import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import BuyThisDossier from '../BuyThisDossier.jsx';
import { t } from '../../copy/index.js';
import { purchasesOpen } from '../../lib/launchGate.js';

/**
 * SettlementDetailActions — the saved-view header's ACTION cluster (Edit, Session
 * Mode, Export, Export Image, Share).
 *
 * Owner order (2026-07-22): these verbs live in the Actions panel (NextActionRail)
 * in READ mode; SettlementDetail renders this cluster only in EDIT mode, where the
 * Actions rail is not shown, so a premium editor still reaches them and can Stop
 * Editing. Free users cannot enter edit mode, so their read-view toolbar is nav +
 * identity + status chips only.
 *
 * Extracted from SettlementDetail (behavior-preserving) to keep that surface under
 * the 600-line component ratchet — every value/handler arrives via props, no store
 * reads. The Export rung's free-tier branch renders BuyThisDossier, whose durable
 * $2.99 pitch is now the ExportUnlockDialog popup (never a static caption).
 */
export default function SettlementDetailActions({
  settlement, saveId,
  canEdit, editMode, toggleEditMode, setPurchaseModalOpen,
  sessionModeEnabled, onOpenSession,
  exportAllowed, exporting, onOpenExportSheet,
  imageExporting, onExportImage,
  shareOpen, onToggleShare, galleryPublished,
}) {
  // Pre-launch lockout (lib/launchGate.js): only the non-subscriber "Edit (Cartographer)"
  // variant is a purchase (it opens the pricing modal), so only it renders disabled
  // with the Available at launch pill until purchases open. A premium editor's
  // Edit Dossier / Stop Editing toggle is untouched.
  const purchasesAreOpen = purchasesOpen();
  const editUpsellLocked = !canEdit && !purchasesAreOpen;
  return (
    <>
      {/* Edit-mode toggle. Premium-gated; a non-premium owner sees a greyed
          variant that opens the pricing modal. */}
      <Button
        variant={!canEdit ? 'secondary' : 'ai'}
        size="sm"
        disabled={editUpsellLocked}
        style={editUpsellLocked ? { flexWrap: 'wrap' } : undefined}
        onClick={() => { if (canEdit) { toggleEditMode(); } else if (setPurchaseModalOpen) { setPurchaseModalOpen(true); } }}
        title={canEdit
          ? (editMode
              ? 'Stop editing. Fields return to read-only display.'
              : 'Edit dossier prose in place. Edited NPCs survive a reroll; the AI overlay passes them through.')
          : 'Manual editing is a Cartographer feature. Click to upgrade.'}
      >
        {!canEdit ? 'Edit (Cartographer)' : (editMode ? 'Stop Editing' : 'Edit Dossier')}
        {editUpsellLocked && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
      </Button>
      {sessionModeEnabled && (
        <Button
          variant="gold"
          size="sm"
          onClick={onOpenSession}
          title="A distraction-free run-of-play view for the table: tonight's beats, key NPCs, hooks, and the live world state."
        >
          Session Mode
        </Button>
      )}
      {exportAllowed ? (
        <Button
          variant="danger"
          size="sm"
          busy={exporting}
          onClick={onOpenExportSheet}
          title="Choose Draft Brief / Canon Dossier / Timeline Packet."
        >
          {exporting ? 'Building PDF…' : 'Export Dossier'}
        </Button>
      ) : (
        // Owner ruling: a free tier without a durable right buys the PDF ($2.99,
        // via the ExportUnlockDialog popup) rather than exporting freely.
        <BuyThisDossier settlement={settlement} saveId={saveId} />
      )}
      {/* Export Image — WITHHELD (the owner, 2026-09-19): its map is still being made. */}
      {saveId && (
        <Button
          variant="info"
          size="sm"
          aria-pressed={shareOpen}
          onClick={onToggleShare}
          title="Publish this dossier to the public gallery, or manage its listing."
        >
          {shareOpen ? 'Close Gallery' : (galleryPublished ? 'Edit Gallery Listing' : 'Share to Gallery')}
        </Button>
      )}
    </>
  );
}
