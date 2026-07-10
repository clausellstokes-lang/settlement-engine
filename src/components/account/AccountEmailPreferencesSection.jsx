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
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { GOLD, INK, BODY, MUTED, BORDER, SP, R, FS, swatch } from '../theme.js';
import { EMAIL_CATEGORIES, getMyEmailPreferences, setMyEmailPreference } from '../../lib/emailPreferences.js';
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
  const [prefs, setPrefs] = useState(null); // null while loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getMyEmailPreferences()
      .then((p) => { if (alive) setPrefs(p); })
      .catch(() => { if (alive) setPrefs({ product_updates: true, referral: true, lifecycle: true }); });
    return () => { alive = false; };
  }, []);

  const handleToggle = async (category, next) => {
    setError(null);
    // Optimistic flip; roll back if the server write fails.
    setPrefs(prev => ({ ...prev, [category]: next }));
    try {
      await setMyEmailPreference(category, next);
    } catch {
      setPrefs(prev => ({ ...prev, [category]: !next }));
      setError('We could not save that preference. Please try again.');
    }
  };

  return (
    <Section title="Email preferences" icon={Mail}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
        <p style={{ fontSize: FS.sm, color: BODY, margin: 0, lineHeight: 1.5 }}>
          Choose which non-essential emails you receive. Changes save as you make them.
        </p>

        {error && (
          <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
            {error}
          </div>
        )}

        {prefs === null ? (
          <div style={{ fontSize: FS.sm, color: BODY }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            {EMAIL_CATEGORIES.map(cat => (
              <div key={cat.id} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: SP.md, padding: `${SP.sm}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: FS.md, fontWeight: 600, color: INK }}>{cat.label}</div>
                  <div style={{ fontSize: FS.sm, color: MUTED, lineHeight: 1.5 }}>{cat.description}</div>
                </div>
                <Toggle
                  checked={prefs[cat.id] !== false}
                  onChange={(next) => handleToggle(cat.id, next)}
                  label={cat.label}
                />
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: FS.xs, color: MUTED, margin: 0, lineHeight: 1.5 }}>
          Account and payment emails — receipts, password resets, and email confirmations —
          are always sent and are not affected by these settings.
        </p>
      </div>
    </Section>
  );
}
