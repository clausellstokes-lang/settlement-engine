/**
 * AccountDataPrivacySection.jsx — "Data & Privacy" section of the Account page.
 *
 * Completes the data-rights gaps alongside the existing PrivacySettings consent
 * toggles (which it embeds):
 *   • Export my data — downloads the user's settlements + campaigns as JSON
 *     (lib/accountData.downloadAccountExport over a live store snapshot).
 *   • Delete settlements / campaigns (bulk) — confirmation-gated wipe of saved
 *     content, routed through the handlers AccountPage passes (which persist).
 *   • Delete my account — a guarded, confirmation-gated SOFT-DELETE *request*
 *     (lib/accountData.requestAccountDeletion). Never a client hard-delete: the
 *     button files a request a server job processes after a grace window.
 *   • Privacy & analytics consent — the existing PrivacySettings, embedded here
 *     so all data controls live in one section.
 *   • Visibility defaults — public-gallery + share/player-view defaults, backed
 *     by the durable productPrefs store (setProductPref).
 */
import { useState } from 'react';
import {
  Database, Download, Trash2, AlertTriangle, Eye,
} from 'lucide-react';
import { downloadAccountExport, requestAccountDeletion } from '../../lib/accountData.js';
import { useStore } from '../../store/index.js';
import PrivacySettings from '../PrivacySettings.jsx';
import Button from '../primitives/Button.jsx';
import {
  GOLD, INK, SECOND, BODY, BORDER, sans, SP, R, FS, swatch,
  DANGER_BORDER, SUCCESS_BORDER,
} from '../theme.js';
import Section from './AccountSection.jsx';

const DELETE_PHRASE = 'DELETE';

function VisibilityToggle({ id, label, desc, checked, onChange }) {
  return (
    <label htmlFor={id} style={{ display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.xs}px 0`, cursor: 'pointer' }}>
      <input
        id={id}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 3 }}
      />
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 700, color: INK }}>{label}</span>
        <span style={{ display: 'block', fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>{desc}</span>
      </span>
    </label>
  );
}

export default function AccountDataPrivacySection({
  auth,
  settlementCount = 0,
  campaignCount = 0,
  onDeleteAllSettlements,
  onDeleteAllCampaigns,
}) {
  const galleryPublicDefault = useStore(s => s.productPrefs?.galleryPublicDefault);
  const shareDefault = useStore(s => s.productPrefs?.shareDefault);
  const playerViewDefault = useStore(s => s.productPrefs?.playerViewDefault);
  const setProductPref = useStore(s => s.setProductPref);

  const [exported, setExported] = useState(false);

  // Bulk content deletion (confirmation-gated, one step of disclosure).
  const [confirmWipe, setConfirmWipe] = useState(null); // 'settlements' | 'campaigns' | null
  const [wipeBusy, setWipeBusy] = useState(false);

  // Account deletion (typed-phrase confirmation, soft-delete request).
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteQueued, setDeleteQueued] = useState(false);

  const handleExport = () => {
    // Snapshot the live store so the export reflects current data.
    const state = useStore.getState();
    downloadAccountExport({
      auth: state.auth,
      savedSettlements: state.savedSettlements,
      campaigns: state.campaigns,
    });
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const runWipe = async () => {
    setWipeBusy(true);
    try {
      if (confirmWipe === 'settlements' && typeof onDeleteAllSettlements === 'function') {
        await onDeleteAllSettlements();
      } else if (confirmWipe === 'campaigns' && typeof onDeleteAllCampaigns === 'function') {
        await onDeleteAllCampaigns();
      }
      setConfirmWipe(null);
    } finally {
      setWipeBusy(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (deletePhrase.trim().toUpperCase() !== DELETE_PHRASE) {
      setDeleteError(`Type ${DELETE_PHRASE} to confirm.`);
      return;
    }
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await requestAccountDeletion(auth.user);
      setDeleteQueued(true);
      setDeleteOpen(false);
      setDeletePhrase('');
    } catch (e) {
      setDeleteError(e?.message || 'Could not submit your request. Please contact support.');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <Section title="Data &amp; Privacy" icon={Database}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl }}>

        {/* ── Export ────────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, fontWeight: 700, color: INK }}>
            <Download size={14} color={GOLD} /> Export my data
          </div>
          <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
            Download all your saved settlements and campaigns as a single JSON file.
          </p>
          <Button variant="secondary" size="md" icon={<Download size={14} />} onClick={handleExport}>
            {exported ? 'Downloaded' : 'Download JSON'}
          </Button>
        </div>

        {/* ── Visibility defaults ───────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, fontWeight: 700, color: INK, marginBottom: SP.xs }}>
            <Eye size={14} color={GOLD} /> Sharing &amp; visibility defaults
          </div>
          <VisibilityToggle
            id="pref-gallery-public"
            label="Make new gallery shares public"
            desc="When you publish to the gallery, default it to publicly listed. Off keeps shares unlisted (link-only)."
            checked={galleryPublicDefault === true}
            onChange={(v) => setProductPref('galleryPublicDefault', v)}
          />
          <VisibilityToggle
            id="pref-player-view"
            label="Open new settlements in player-safe view"
            desc="Hide DM-only secrets by default when viewing a new settlement."
            checked={playerViewDefault === true}
            onChange={(v) => setProductPref('playerViewDefault', v)}
          />
          <label htmlFor="pref-share-default" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND, marginTop: SP.sm }}>
            Default share scope for player-view links
            <select
              id="pref-share-default"
              value={shareDefault || 'unlisted'}
              onChange={e => setProductPref('shareDefault', e.target.value)}
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK, background: swatch.white }}
            >
              <option value="private">Private (only me)</option>
              <option value="unlisted">Unlisted (anyone with the link)</option>
              <option value="public">Public (listed in gallery)</option>
            </select>
          </label>
        </div>

        {/* ── Privacy & analytics consent (existing component) ──────────────
            Embedded `bare` so it flattens to a borderless sub-group: the
            parent Section border is the only boundary, and PrivacySettings'
            inline title sits level with the sibling sub-group headers instead
            of drawing a second concentric card (P5). */}
        <div>
          <PrivacySettings bare />
        </div>

        {/* ── Bulk content deletion ─────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, fontWeight: 700, color: INK }}>
            <Trash2 size={14} color={swatch.danger} /> Delete content
          </div>
          <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
            Permanently remove all your saved content. This cannot be undone.
          </p>
          {confirmWipe ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, padding: SP.md, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md }}>
              <div style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 700 }}>
                Delete all {confirmWipe}? This permanently removes
                {confirmWipe === 'settlements' ? ` ${settlementCount} settlement${settlementCount === 1 ? '' : 's'}` : ` ${campaignCount} campaign${campaignCount === 1 ? '' : 's'}`}.
              </div>
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button variant="danger" size="md" busy={wipeBusy} onClick={runWipe}>Yes, delete all</Button>
                <Button variant="ghost" size="md" disabled={wipeBusy} onClick={() => setConfirmWipe(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
              <Button variant="ghost" size="md" disabled={settlementCount === 0} onClick={() => setConfirmWipe('settlements')}>
                Delete all settlements ({settlementCount})
              </Button>
              <Button variant="ghost" size="md" disabled={campaignCount === 0} onClick={() => setConfirmWipe('campaigns')}>
                Delete all campaigns ({campaignCount})
              </Button>
            </div>
          )}
        </div>

        {/* ── Account deletion (soft-delete request) ────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, fontWeight: 700, color: swatch.danger }}>
            <AlertTriangle size={14} color={swatch.danger} /> Delete my account
          </div>
          {deleteQueued ? (
            <div style={{ marginTop: SP.sm, padding: `${SP.sm}px ${SP.md}px`, background: swatch.successBg, border: `1px solid ${SUCCESS_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.success }}>
              Your deletion request has been received. Your account is scheduled for removal and you will be signed out shortly. Contact support if this was a mistake.
            </div>
          ) : !deleteOpen ? (
            <>
              <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
                This requests permanent deletion of your account and all associated data. There is a short grace
                window during which you can contact support to cancel.
              </p>
              <Button variant="danger" size="md" icon={<AlertTriangle size={14} />} onClick={() => { setDeleteOpen(true); setDeleteError(null); }}>
                Request account deletion
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm, padding: SP.md, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md }}>
              {deleteError && <div role="alert" style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 700 }}>{deleteError}</div>}
              <span id="delete-confirm-label" style={{ fontSize: FS.xs, fontWeight: 700, color: swatch.danger }}>
                Type {DELETE_PHRASE} to confirm
              </span>
              <input
                id="delete-confirm-phrase"
                // eslint-disable-next-line jsx-a11y/no-autofocus -- land keyboard focus in the typed-phrase confirm when the panel opens
                autoFocus
                aria-labelledby="delete-confirm-label"
                value={deletePhrase}
                onChange={e => setDeletePhrase(e.target.value)}
                placeholder={DELETE_PHRASE}
                style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK }}
              />
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button
                  variant="danger" size="md" busy={deleteBusy}
                  disabled={deletePhrase.trim().toUpperCase() !== DELETE_PHRASE}
                  onClick={handleRequestDeletion}
                >
                  Permanently delete
                </Button>
                <Button variant="ghost" size="md" disabled={deleteBusy} onClick={() => { setDeleteOpen(false); setDeletePhrase(''); setDeleteError(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: FS.xs, color: BODY }}>
          Deleting your account erases your data per our privacy policy.
        </div>
      </div>
    </Section>
  );
}
