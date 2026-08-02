/**
 * AccountEmailPreferencesSection.jsx — per-category email opt-out controls
 * (Wave 4d owner item; storage in migration 126).
 *
 * Three independent toggles (product updates / referral rewards / realm
 * activity) — the only categories a member may opt out of. Transactional mail
 * (receipts, password recovery, email confirmation) is never listed here and is
 * always sent, which the footnote states plainly. Each toggle persists
 * immediately through the SECURITY DEFINER set_my_email_preference RPC and rolls
 * back on failure so the control never lies about persisted state.
 *
 * Styling uses this tree's theme vocabulary — no new raw colors.
 */
import { useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { GOLD, INK, BODY, MUTED, BORDER, SP, FS, swatch } from '../theme.js';
import { EMAIL_CATEGORIES, getMyEmailPreferences, setMyEmailPreference } from '../../lib/emailPreferences.js';
import { authSessionIdentity, captureAuthSessionFence, isAuthSessionFenceCurrent } from '../../lib/authSessionFence.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import Section from './AccountSection.jsx';

function Toggle({ checked, onChange, label }) {
  const id = `email-pref-${String(label).replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      <input
        id={id}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: GOLD, width: 18, height: 18, cursor: 'pointer' }}
      />
    </label>
  );
}

export default function AccountEmailPreferencesSection() {
  const auth = useStore(state => state.auth);
  const ownerId = auth?.user?.id || null;
  const sessionIdentity = authSessionIdentity(auth);
  const [snapshot, setSnapshot] = useState({
    ownerId: null, sessionIdentity: null, prefs: null, error: null,
  });
  const loadRevision = useRef(0);
  const writeQueues = useRef(new Map());
  const writeRevisions = useRef(new Map());

  const retryLoad = async () => {
    const revision = ++loadRevision.current;
    setSnapshot({ ownerId, sessionIdentity, prefs: null, error: null });
    try {
      const loaded = await getMyEmailPreferences();
      if (loadRevision.current === revision) {
        setSnapshot({ ownerId, sessionIdentity, prefs: loaded, error: null });
      }
    } catch {
      if (loadRevision.current === revision) {
        setSnapshot({
          ownerId,
          sessionIdentity,
          prefs: null,
          error: 'Email preferences could not be loaded. No consent setting was assumed.',
        });
      }
    }
  };

  useEffect(() => {
    const revision = ++loadRevision.current;
    getMyEmailPreferences()
      .then((loaded) => {
        if (loadRevision.current === revision) {
          setSnapshot({ ownerId, sessionIdentity, prefs: loaded, error: null });
        }
      })
      .catch(() => {
        if (loadRevision.current === revision) {
          setSnapshot({
            ownerId,
            sessionIdentity,
            prefs: null,
            error: 'Email preferences could not be loaded. No consent setting was assumed.',
          });
        }
      });
    return () => { loadRevision.current += 1; };
  }, [ownerId, sessionIdentity]);

  const snapshotMatches = snapshot.ownerId === ownerId
    && snapshot.sessionIdentity === sessionIdentity;
  const visiblePrefs = snapshotMatches ? snapshot.prefs : null;
  const visibleError = snapshotMatches ? snapshot.error : null;

  const handleToggle = (category, next) => {
    const sessionFence = captureAuthSessionFence(useStore.getState().auth);
    const revision = (writeRevisions.current.get(category) || 0) + 1;
    writeRevisions.current.set(category, revision);
    setSnapshot(current => current.ownerId === ownerId
      && current.sessionIdentity === sessionIdentity
      ? { ...current, error: null, prefs: { ...current.prefs, [category]: next } }
      : current);

    // Preserve the user's click order per category. A slow older opt-in must
    // never arrive after a newer opt-out, and an older failure must not roll a
    // newer optimistic choice backward.
    const prior = writeQueues.current.get(category) || Promise.resolve();
    const write = prior.catch(() => {}).then(async () => {
      if (!isAuthSessionFenceCurrent(sessionFence, useStore.getState().auth)) {
        return { staleSession: true };
      }
      await setMyEmailPreference(category, next, sessionFence.ownerId);
      return { staleSession: false };
    });
    writeQueues.current.set(category, write);
    write
      .then((result) => {
        if (result?.staleSession) return;
        if (isAuthSessionFenceCurrent(sessionFence, useStore.getState().auth)
          && writeRevisions.current.get(category) === revision) {
          setSnapshot(current => current.ownerId === ownerId
            && current.sessionIdentity === sessionIdentity
            ? { ...current, error: null }
            : current);
        }
      })
      .catch(() => {
        if (isAuthSessionFenceCurrent(sessionFence, useStore.getState().auth)
          && writeRevisions.current.get(category) === revision) {
          setSnapshot(current => current.ownerId === ownerId
            && current.sessionIdentity === sessionIdentity
            ? {
                ...current,
                prefs: { ...current.prefs, [category]: !next },
                error: t('errors.prefSave'),
              }
            : current);
        }
      })
      .finally(() => {
        if (writeQueues.current.get(category) === write) writeQueues.current.delete(category);
      });
  };

  return (
    <Section title="Email preferences" icon={Mail}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
        <p style={{ fontSize: FS.sm, color: BODY, margin: 0, lineHeight: 1.5 }}>
          Choose which non-essential emails you receive. Changes save as you make them.
        </p>

        {visibleError && (
          <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, fontSize: FS.sm, color: swatch.danger }}>
            {visibleError}
            {visiblePrefs === null && (
              <Button variant="secondary" size="sm" onClick={retryLoad} style={{ marginLeft: SP.sm }}>
                Retry
              </Button>
            )}
          </div>
        )}

        {visiblePrefs === null && !visibleError ? (
          <div style={{ fontSize: FS.sm, color: BODY }}>Loading…</div>
        ) : visiblePrefs ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            {EMAIL_CATEGORIES.map(cat => (
              <div key={cat.id} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: SP.md, padding: `${SP.sm}px ${SP.md}px`,
                border: `1px solid ${BORDER}`,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: FS.md, fontWeight: 600, color: INK }}>{cat.label}</div>
                  <div style={{ fontSize: FS.sm, color: MUTED, lineHeight: 1.5 }}>{cat.description}</div>
                </div>
                <Toggle
                  checked={visiblePrefs[cat.id] !== false}
                  onChange={(next) => handleToggle(cat.id, next)}
                  label={cat.label}
                />
              </div>
            ))}
          </div>
        ) : null}

        <p style={{ fontSize: FS.xs, color: MUTED, margin: 0, lineHeight: 1.5 }}>
          Account and payment emails (receipts, password resets, and email confirmations)
          are always sent and are not affected by these settings.
        </p>
      </div>
    </Section>
  );
}
