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
import { Download, AlertTriangle, Upload } from 'lucide-react';
import { downloadAccountExport, requestAccountDeletion } from '../../lib/accountData.js';
import { MAX_IMPORT_BYTES } from '../../lib/accountImport.js';
import { activeSaveCount } from '../../lib/saveAccess.js';
import { useStore } from '../../store/index.js';
import PrivacySettings from '../PrivacySettings.jsx';
import Button from '../primitives/Button.jsx';
import {
  INK, SECOND, BODY, BORDER, BORDER_STRONG, CARD, sans, SP, R, FS, swatch,
  DANGER_BORDER, SUCCESS_BORDER,
} from '../theme.js';
import Section from './AccountSection.jsx';

const DELETE_PHRASE = 'DELETE';

/**
 * Style for the file-input <label> so it reads as a secondary Button without
 * being a raw button element (the label natively forwards click + Enter to its input).
 * @param {boolean} enabled whether import is permitted (tier/save gate)
 */
const IMPORT_TRIGGER_STYLE = (enabled) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  minHeight: 40, padding: `${SP.sm}px ${SP.md}px`,
  border: `1px solid ${BORDER_STRONG}`, borderRadius: R.lg,
  background: CARD, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800,
  cursor: enabled ? 'pointer' : 'not-allowed', opacity: enabled ? 1 : 0.62,
});

/** Visually-hidden but focus/operable file input (kept in the a11y tree). */
const VISUALLY_HIDDEN_INPUT = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

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
  onSignOut,
  onImport,
  canSave = false,
  maxSaves = 0,
}) {
  const galleryPublicDefault = useStore(s => s.productPrefs?.galleryPublicDefault);
  const shareDefault = useStore(s => s.productPrefs?.shareDefault);
  const playerViewDefault = useStore(s => s.productPrefs?.playerViewDefault);
  const setProductPref = useStore(s => s.setProductPref);

  const [exported, setExported] = useState(false);

  // Import (file → validate → preview/confirm → result). Hostile-input pipeline
  // lives in lib/accountImport + the importAccountData store action; this block
  // is the three-state UI shell (idle → preview → result/error).
  const savedSettlements = useStore(s => s.savedSettlements);
  const [importStage, setImportStage] = useState('idle'); // idle | preview | result
  const [importPreview, setImportPreview] = useState(null); // { text, settlements, campaigns }
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importResult, setImportResult] = useState(null);

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

  const resetImport = () => {
    setImportStage('idle');
    setImportPreview(null);
    setImportError(null);
    setImportResult(null);
    setImportBusy(false);
  };

  // Stage 0: read the chosen file (hard size cap) then envelope-validate it for
  // a preview. No write happens here — the user confirms counts first.
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    // Allow re-picking the same file later by clearing the input value.
    e.target.value = '';
    if (!file) return;
    setImportError(null);
    setImportResult(null);

    if (file.size > MAX_IMPORT_BYTES) {
      setImportStage('result');
      setImportError('That file is too large to be a SettlementForge export.');
      return;
    }

    let text;
    try {
      text = await file.text();
    } catch {
      setImportStage('result');
      setImportError("That file couldn't be read. Try downloading a fresh export.");
      return;
    }

    // Lazily validate the envelope for the preview (the store action re-validates
    // before any write, so this is purely to show trustworthy counts).
    const { validateAccountImport } = await import('../../lib/accountImport.js');
    const res = validateAccountImport(text);
    if (!res.ok) {
      setImportStage('result');
      setImportError(res.error);
      return;
    }
    setImportPreview({ text, settlements: res.value.settlements.length, campaigns: res.value.campaigns.length });
    setImportStage('preview');
  };

  const handleImportConfirm = async () => {
    if (!importPreview || typeof onImport !== 'function') return;
    setImportBusy(true);
    setImportError(null);
    try {
      const result = await onImport(importPreview.text);
      if (!result?.ok) {
        setImportError(result?.error || 'Import failed. Please try again.');
        setImportStage('result');
        return;
      }
      setImportResult(result);
      setImportStage('result');
    } catch (err) {
      setImportError(err?.message || 'Import failed. Please try again.');
      setImportStage('result');
    } finally {
      setImportBusy(false);
    }
  };

  // Remaining free slots, for the over-limit preview notice.
  const remainingSlots = Number.isFinite(maxSaves)
    ? Math.max(0, maxSaves - activeSaveCount(savedSettlements || []))
    : Infinity;
  const importOverLimit = !!importPreview
    && Number.isFinite(remainingSlots)
    && importPreview.settlements > remainingSlots;

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
      // File the soft-delete request BEFORE signing out, so it is durably
      // recorded even if ending the session tears down the auth context.
      await requestAccountDeletion(auth.user);
      setDeleteQueued(true);
      setDeleteOpen(false);
      setDeletePhrase('');
      // Honor the banner's promise: end the session so the user is signed out.
      if (typeof onSignOut === 'function') await onSignOut();
    } catch (e) {
      setDeleteError(e?.message || 'Could not submit your request. Please contact support.');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <Section title="Data and privacy">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl }}>

        {/* ── Import ────────────────────────────────────────────────────────
            Bring an export file back in. The file is treated as hostile: the
            store action re-validates the envelope, migrates each record forward,
            remaps ownership to this account, mints fresh ids (additive, never
            overwriting), and respects the save-limit gate. This block is the
            three-state shell — idle (file picker) → preview (counts + confirm) →
            result/error. Nothing is written until Import is clicked. */}
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
            Import my data
          </div>
          <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
            Bring settlements and campaigns in from an export file. Imported records are added to your
            library under this account, never overwriting what you already have.
          </p>

          {importStage === 'idle' && (
            <>
              {/* The native file <input> is NESTED inside its <label> (which is
                  the visible, Button-styled trigger) and visually hidden but kept
                  focusable + operable by keyboard. A <label> natively forwards
                  click + Enter to its nested input, so there's no raw button
                  element and no second interactive element — the input IS the control. */}
              <label htmlFor="account-import-file" style={IMPORT_TRIGGER_STYLE(canSave)}>
                <Upload size={14} aria-hidden="true" />
                Choose export file
                <input
                  id="account-import-file"
                  type="file"
                  accept="application/json,.json"
                  aria-label="Choose an export file to import"
                  disabled={!canSave}
                  onChange={handleImportFile}
                  style={VISUALLY_HIDDEN_INPUT}
                />
              </label>
              {!canSave && (
                <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 0` }}>
                  Sign in or upgrade to import settlements into your library.
                </p>
              )}
            </>
          )}

          {importStage === 'preview' && importPreview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, padding: SP.md, background: swatch.infoBg, border: `1px solid ${BORDER}`, borderRadius: R.md }}>
              <div style={{ fontSize: FS.sm, color: INK }}>
                This file holds <strong>{importPreview.settlements}</strong> settlement{importPreview.settlements === 1 ? '' : 's'} and{' '}
                <strong>{importPreview.campaigns}</strong> campaign{importPreview.campaigns === 1 ? '' : 's'}.
              </div>
              {importOverLimit && (
                <div style={{ fontSize: FS.xs, color: swatch.info, lineHeight: 1.5 }}>
                  Your library has {remainingSlots} free slot{remainingSlots === 1 ? '' : 's'}; the first {remainingSlots} will be
                  imported and the rest skipped. Free up space or upgrade to bring in the rest.
                </div>
              )}
              {importPreview.campaigns > 0 && auth?.tier !== 'premium' && (
                <div style={{ fontSize: FS.xs, color: swatch.info, lineHeight: 1.5 }}>
                  Campaign import needs premium; campaigns in this file will be skipped.
                </div>
              )}
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button variant="primary" size="md" busy={importBusy} onClick={handleImportConfirm}>
                  Import
                </Button>
                <Button variant="ghost" size="md" disabled={importBusy} onClick={resetImport}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {importStage === 'result' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
              {importError ? (
                <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
                  {importError}
                </div>
              ) : (
                <div role="status" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.successBg, border: `1px solid ${SUCCESS_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.success }}>
                  Imported {importResult?.settlementsImported ?? 0} settlement{(importResult?.settlementsImported ?? 0) === 1 ? '' : 's'}
                  {importResult?.campaignsImported ? ` and ${importResult.campaignsImported} campaign${importResult.campaignsImported === 1 ? '' : 's'}` : ''}.
                  {(importResult?.settlementsSkipped?.length || importResult?.campaignsSkipped?.length) ? (
                    <details style={{ marginTop: SP.xs }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
                        {(importResult.settlementsSkipped.length + importResult.campaignsSkipped.length)} skipped
                      </summary>
                      <ul style={{ margin: `${SP.xs}px 0 0`, paddingLeft: SP.lg, fontSize: FS.xs, color: BODY }}>
                        {importResult.settlementsSkipped.map((s, i) => (
                          <li key={`s-${i}`}>{s.name} — {s.reason}</li>
                        ))}
                        {importResult.campaignsSkipped.map((c, i) => (
                          <li key={`c-${i}`}>{c.name} — {c.reason}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
              )}
              <div>
                <Button variant="ghost" size="md" onClick={resetImport}>
                  {importError ? 'Try another file' : 'Done'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Export ────────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
            Export my data
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
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, marginBottom: SP.xs }}>
            Sharing and visibility defaults
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
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
            Delete content
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
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.danger }}>
            Delete my account
          </div>
          {deleteQueued ? (
            <div style={{ marginTop: SP.sm, padding: `${SP.sm}px ${SP.md}px`, background: swatch.successBg, border: `1px solid ${SUCCESS_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.success }}>
              Your deletion request has been received. Your account is scheduled for removal and we are signing you out now. Contact support if this was a mistake.
            </div>
          ) : !deleteOpen ? (
            <>
              <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
                This requests permanent deletion of your account and all associated data. There is a short grace
                window during which you can contact support to cancel.
              </p>
              <Button variant="ghost" size="md" icon={<AlertTriangle size={14} />} onClick={() => { setDeleteOpen(true); setDeleteError(null); }}>
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
