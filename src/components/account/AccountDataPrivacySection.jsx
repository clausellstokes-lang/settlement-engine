/**
 * AccountDataPrivacySection.jsx — "Data & Privacy" section of the Account page.
 *
 * Completes the data-rights gaps alongside the existing PrivacySettings consent
 * toggles (which it embeds):
 *   • Import my data — validate + import an export file's settlements, campaigns,
 *     and private custom content
 *     (hostile-input pipeline in lib/accountImport + the importAccountData store
 *     action; this block is the three-state UI shell).
 *   • Export my data — downloads the user's settlements, campaigns, and custom
 *     content as JSON
 *     (lib/accountData.downloadAccountExport over a live store snapshot).
 *   • Delete settlements / campaigns (bulk) — confirmation-gated wipe of saved
 *     content, routed through the handlers AccountPage passes (which persist).
 *   • Delete my account — a guarded, confirmation-gated SOFT-DELETE *request*
 *     (lib/accountData.requestAccountDeletion). Never a client hard-delete: the
 *     button files a request a server job processes after a grace window.
 *   • Privacy & analytics consent — the existing PrivacySettings, embedded here
 *     so all data controls live in one section.
 *
 * NOTE: THEIRS also carries "sharing & visibility defaults" here, backed by a
 * durable productPrefs store bag (setProductPref). OURS has no productPrefs
 * store slice, so that block is intentionally omitted (reported as an absent
 * back-end, not stubbed).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, AlertTriangle, Upload } from 'lucide-react';
import { downloadAccountExport, requestAccountDeletion } from '../../lib/accountData.js';
import { saves as savesService } from '../../lib/saves.js';
import { t } from '../../copy/index.js';
import { MAX_IMPORT_BYTES } from '../../lib/accountImport.js';
import { activeSaveCount } from '../../lib/saveAccess.js';
import { useStore } from '../../store/index.js';
import PrivacySettings from '../PrivacySettings.jsx';
import Button from '../primitives/Button.jsx';
import { captureSavedSettlementsHydration } from '../../store/savedSettlementsHydration.js';
import {
  INK, BODY, BORDER, BORDER_STRONG, CARD, sans, SP, FS, swatch,
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
  border: `1px solid ${BORDER_STRONG}`,
  background: CARD, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800,
  cursor: enabled ? 'pointer' : 'not-allowed', opacity: enabled ? 1 : 0.62,
});

/** Visually-hidden but focus/operable file input (kept in the a11y tree). */
const VISUALLY_HIDDEN_INPUT = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

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
  const [exported, setExported] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Import (file → validate → preview/confirm → result). Hostile-input pipeline
  // lives in lib/accountImport + the importAccountData store action; this block
  // is the three-state UI shell (idle → preview → result/error).
  const savedSettlements = useStore(s => s.savedSettlements);
  const savedSettlementsLoaded = useStore(s => s.savedSettlementsLoaded);
  const exportLoadRef = useRef(null);
  const exportAccountStateLoadRef = useRef(null);
  const [importStage, setImportStage] = useState('idle'); // idle | preview | result
  const [importPreview, setImportPreview] = useState(null);
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Bulk content deletion (confirmation-gated, one step of disclosure).
  const [confirmWipe, setConfirmWipe] = useState(null); // 'settlements' | 'campaigns' | null
  const [wipeBusy, setWipeBusy] = useState(false);
  const [wipeError, setWipeError] = useState(null);

  // Account deletion (typed-phrase confirmation, soft-delete request).
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteQueued, setDeleteQueued] = useState(false);

  const authUserId = auth?.user?.id || null;
  const ensureCloudSavesLoaded = useCallback(async () => {
    const state = useStore.getState();
    const hydration = captureSavedSettlementsHydration(state, authUserId);
    if (!hydration) {
      throw new Error('The signed-in account changed while its data was loading.');
    }
    if (!authUserId || state.savedSettlementsLoaded) {
      return Array.isArray(state.savedSettlements) ? state.savedSettlements : [];
    }
    if (exportLoadRef.current?.ownerId === authUserId) {
      return exportLoadRef.current.promise;
    }

    const promise = Promise.resolve()
      .then(() => savesService.list())
      .then((loaded) => {
        const latest = useStore.getState();
        if (String(latest.auth?.user?.id || '') !== String(authUserId)) {
          throw new Error('The signed-in account changed while its data was loading.');
        }
        const saves = Array.isArray(loaded) ? loaded : [];
        if (latest.setSavedSettlements?.(saves, hydration) === false) {
          throw new Error('The signed-in account changed while its data was loading.');
        }
        return saves;
      })
      .finally(() => {
        if (exportLoadRef.current?.promise === promise) exportLoadRef.current = null;
      });
    exportLoadRef.current = { ownerId: authUserId, promise };
    return promise;
  }, [authUserId]);

  const ensureExportAccountStateLoaded = useCallback(async () => {
    const current = useStore.getState();
    if (String(current.auth?.user?.id || '') !== String(authUserId || '')) {
      throw new Error('The signed-in account changed while its data was loading.');
    }
    if (exportAccountStateLoadRef.current?.ownerId === authUserId) {
      return exportAccountStateLoadRef.current.promise;
    }

    const promise = Promise.resolve()
      .then(async () => {
        let state = useStore.getState();
        const canLoadCustomContent =
          typeof state.loadCustomContentFromCloud === 'function'
          && typeof state.canUseCustomContent === 'function'
          && state.canUseCustomContent();
        if (canLoadCustomContent && state.customContentSyncedAt == null) {
          await state.loadCustomContentFromCloud();
        }

        state = useStore.getState();
        if (
          typeof state.loadCampaigns === 'function'
          && state.campaignsLoaded !== true
        ) {
          // Campaign migration may infer one legacy content cutoff, so custom
          // content must settle before this read.
          await state.loadCampaigns();
        }

        state = useStore.getState();
        if (typeof state.exportCustomContentArchive !== 'function') {
          throw new Error(
            'The full custom-content archive service is unavailable. Please update the app and try again.',
          );
        }
        // This is an ownership/data-rights read, never an entitlement-gated
        // content-pack export. It includes archived definitions, every
        // immutable revision, pack lineage, environments, and audit receipts.
        const archiveResult = await state.exportCustomContentArchive({
          purpose: 'account-export',
        });
        const customContentArchive =
          archiveResult?.archive || archiveResult || null;

        const loaded = useStore.getState();
        if (String(loaded.auth?.user?.id || '') !== String(authUserId || '')) {
          throw new Error('The signed-in account changed while its data was loading.');
        }
        return { state: loaded, customContentArchive };
      })
      .finally(() => {
        if (exportAccountStateLoadRef.current?.promise === promise) {
          exportAccountStateLoadRef.current = null;
        }
      });
    exportAccountStateLoadRef.current = { ownerId: authUserId, promise };
    return promise;
  }, [authUserId]);

  // Direct navigation can mount Account before any library surface has hydrated
  // cloud saves. Start that read immediately; handleExport awaits the same promise
  // so an early click cannot download a silently-empty archive.
  useEffect(() => {
    if (!authUserId || savedSettlementsLoaded) return;
    void ensureCloudSavesLoaded().catch(() => {
      // The button retries and surfaces a user-facing error if this preload fails.
    });
  }, [authUserId, savedSettlementsLoaded, ensureCloudSavesLoaded]);

  useEffect(() => {
    if (!authUserId) return;
    void ensureExportAccountStateLoaded().catch(() => {
      // The button retries and reports the same failure in its alert surface.
    });
  }, [authUserId, ensureExportAccountStateLoaded]);

  const handleExport = async () => {
    setExportBusy(true);
    setExportError(null);
    try {
      const [loadedSaves, loadedAccountExport] = await Promise.all([
        ensureCloudSavesLoaded(),
        ensureExportAccountStateLoaded(),
      ]);
      // Snapshot only after hydration settles. `loadedSaves` is also used as the
      // fallback for narrow test/store adapters without setSavedSettlements.
      const state = useStore.getState();
      const loadedAccountState = loadedAccountExport.state;
      downloadAccountExport({
        auth: state.auth,
        savedSettlements: state.savedSettlementsLoaded
          ? state.savedSettlements
          : loadedSaves,
        campaigns: loadedAccountState.campaigns || state.campaigns,
        customContent: loadedAccountState.customContent || state.customContent,
        customContentArchive: loadedAccountExport.customContentArchive,
      });
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (error) {
      setExportError(error?.message || 'Your saved settlements could not be loaded. Please try again.');
    } finally {
      setExportBusy(false);
    }
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
      setImportError(t('errors.importTooLarge'));
      return;
    }

    let text;
    try {
      text = await file.text();
    } catch {
      setImportStage('result');
      setImportError(t('errors.importUnreadable'));
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
    const archiveLedger = res.value.customContentArchive?.ledger || null;
    const archiveDefinitions = archiveLedger?.definitions;
    const packContent = res.value.customContentPack?.content || {};
    const customContentDefinitions = Array.isArray(archiveDefinitions)
      ? archiveDefinitions.length
      : Object.values(packContent).reduce(
          (total, items) => total + (Array.isArray(items) ? items.length : 0),
          0,
        );
    setImportPreview({
      text,
      settlements: res.value.settlements.length,
      campaigns: res.value.campaigns.length,
      customContentDefinitions,
      customContentArchiveCounts: archiveLedger ? {
        revisions: archiveLedger.revisions.length,
        archivedDefinitions: archiveLedger.definitions.filter(
          definition => definition.archivedAt != null,
        ).length,
        packs: archiveLedger.packs.length,
        packVersions: archiveLedger.packVersions.length,
        environments: archiveLedger.environments.length,
      } : null,
    });
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
    setWipeError(null);
    try {
      if (confirmWipe === 'settlements' && typeof onDeleteAllSettlements === 'function') {
        await onDeleteAllSettlements();
      } else if (confirmWipe === 'campaigns' && typeof onDeleteAllCampaigns === 'function') {
        await onDeleteAllCampaigns();
      }
      setConfirmWipe(null);
    } catch (e) {
      // The handler throws when a server-side delete fails (a partial wipe must
      // not report a clean success on a privacy surface). Surface the message and
      // keep the confirm panel open so the user can retry.
      setWipeError(e?.message || 'Could not delete your content. Please try again.');
    } finally {
      setWipeBusy(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (deletePhrase.trim().toUpperCase() !== DELETE_PHRASE) {
      setDeleteError(t('errors.deleteConfirmPhrase', { phrase: DELETE_PHRASE }));
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
            Bring settlements, campaigns, and private custom content in from an export file.
            Imported records are added under this account, never overwriting unrelated work.
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, paddingLeft: SP.md, borderLeft: `3px solid ${swatch.info}` }}>
              <div style={{ fontSize: FS.sm, color: INK }}>
                This file holds <strong>{importPreview.settlements}</strong> settlement{importPreview.settlements === 1 ? '' : 's'} and{' '}
                <strong>{importPreview.campaigns}</strong> campaign{importPreview.campaigns === 1 ? '' : 's'}
                {importPreview.customContentDefinitions
                  ? ` and ${importPreview.customContentDefinitions} custom-content definition${importPreview.customContentDefinitions === 1 ? '' : 's'}`
                  : ''}.
              </div>
              {importPreview.customContentArchiveCounts && (
                <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5 }}>
                  Full ledger: {importPreview.customContentArchiveCounts.revisions} immutable revision{importPreview.customContentArchiveCounts.revisions === 1 ? '' : 's'}, {' '}
                  {importPreview.customContentArchiveCounts.archivedDefinitions} archived definition{importPreview.customContentArchiveCounts.archivedDefinitions === 1 ? '' : 's'}, {' '}
                  {importPreview.customContentArchiveCounts.packs} pack{importPreview.customContentArchiveCounts.packs === 1 ? '' : 's'} ({importPreview.customContentArchiveCounts.packVersions} version{importPreview.customContentArchiveCounts.packVersions === 1 ? '' : 's'}), and {' '}
                  {importPreview.customContentArchiveCounts.environments} environment revision{importPreview.customContentArchiveCounts.environments === 1 ? '' : 's'}.
                </div>
              )}
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
                <div role="alert" style={{ paddingLeft: SP.md, borderLeft: `3px solid ${swatch.danger}`, fontSize: FS.sm, color: swatch.danger, lineHeight: 1.5 }}>
                  {importError}
                </div>
              ) : (
                <div role="status" style={{ paddingLeft: SP.md, borderLeft: `3px solid ${swatch.success}`, fontSize: FS.sm, color: swatch.success, lineHeight: 1.5 }}>
                  Imported {importResult?.settlementsImported ?? 0} settlement{(importResult?.settlementsImported ?? 0) === 1 ? '' : 's'}
                  {importResult?.campaignsImported ? `, ${importResult.campaignsImported} campaign${importResult.campaignsImported === 1 ? '' : 's'}` : ''}
                  {importResult?.customContentImported ? `, and ${importResult.customContentImported} custom-content definition${importResult.customContentImported === 1 ? '' : 's'}` : ''}.
                  {importResult?.customContentImportCounts?.revisions ? (
                    <> The restored ledger includes {importResult.customContentImportCounts.revisions} immutable revision{importResult.customContentImportCounts.revisions === 1 ? '' : 's'}, {importResult.customContentImportCounts.archivedDefinitions || 0} archived definition{importResult.customContentImportCounts.archivedDefinitions === 1 ? '' : 's'}, {importResult.customContentImportCounts.packs || 0} pack{importResult.customContentImportCounts.packs === 1 ? '' : 's'}, and {importResult.customContentImportCounts.environments || 0} environment revision{importResult.customContentImportCounts.environments === 1 ? '' : 's'}.</>
                  ) : null}
                  {(importResult?.settlementsSkipped?.length
                    || importResult?.campaignsSkipped?.length
                    || importResult?.customContentSkipped?.length
                    || importResult?.settlementContentWarnings?.length
                    || importResult?.campaignContentWarnings?.length) ? (
                    <details style={{ marginTop: SP.xs }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
                        {(
                          (importResult.settlementsSkipped?.length || 0)
                          + (importResult.campaignsSkipped?.length || 0)
                          + (importResult.customContentSkipped?.length || 0)
                          + (importResult.settlementContentWarnings?.length || 0)
                          + (importResult.campaignContentWarnings?.length || 0)
                        )} notices
                      </summary>
                      <ul style={{ margin: `${SP.xs}px 0 0`, paddingLeft: SP.lg, fontSize: FS.xs, color: BODY }}>
                        {(importResult.settlementsSkipped || []).map((s, i) => (
                          <li key={`s-${i}`}>{s.name}: {s.reason}</li>
                        ))}
                        {(importResult.campaignsSkipped || []).map((c, i) => (
                          <li key={`c-${i}`}>{c.name}: {c.reason}</li>
                        ))}
                        {(importResult.customContentSkipped || []).map((entry, i) => (
                          <li key={`cc-${i}`}>{entry.name}: {entry.reason}</li>
                        ))}
                        {(importResult.settlementContentWarnings || []).map((entry, i) => (
                          <li key={`sp-${i}`}>{entry.name}: {entry.reason}</li>
                        ))}
                        {(importResult.campaignContentWarnings || []).map((entry, i) => (
                          <li key={`cb-${i}`}>{entry.name}: {entry.reason}</li>
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
            Download your saved settlements, campaigns, and private custom content as a single JSON file.
          </p>
          {exportError && (
            <div role="alert" style={{ fontSize: FS.xs, color: swatch.danger, marginBottom: SP.sm }}>
              {exportError}
            </div>
          )}
          <Button variant="secondary" size="md" icon={<Download size={14} />} busy={exportBusy} onClick={handleExport}>
            {exported ? 'Downloaded' : 'Download JSON'}
          </Button>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, paddingLeft: SP.md, borderLeft: `3px solid ${swatch.danger}` }}>
              {wipeError && <div role="alert" style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 700 }}>{wipeError}</div>}
              <div style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 700 }}>
                Delete all {confirmWipe}? This permanently removes
                {confirmWipe === 'settlements' ? ` ${settlementCount} settlement${settlementCount === 1 ? '' : 's'}` : ` ${campaignCount} campaign${campaignCount === 1 ? '' : 's'}`}.
              </div>
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button variant="danger" size="md" busy={wipeBusy} onClick={runWipe}>Yes, delete all</Button>
                <Button variant="ghost" size="md" disabled={wipeBusy} onClick={() => { setConfirmWipe(null); setWipeError(null); }}>Cancel</Button>
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
            <div role="status" style={{ marginTop: SP.sm, paddingLeft: SP.md, borderLeft: `3px solid ${swatch.success}`, fontSize: FS.sm, color: swatch.success, lineHeight: 1.5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm, paddingLeft: SP.md, borderLeft: `3px solid ${swatch.danger}` }}>
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
                style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, color: INK }}
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
