import Button from '../primitives/Button.jsx';
import BuyThisDossier from '../BuyThisDossier.jsx';
import { t } from '../../copy/index.js';

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
  return (
    <>
      {/* Edit-mode toggle. Premium-gated; a non-premium owner sees a greyed
          variant that opens the pricing modal. */}
      <Button
        variant={!canEdit ? 'secondary' : 'ai'}
        size="sm"
        onClick={() => { if (canEdit) { toggleEditMode(); } else if (setPurchaseModalOpen) { setPurchaseModalOpen(true); } }}
        title={canEdit
          ? (editMode
              ? 'Stop editing. Fields return to read-only display.'
              : 'Edit dossier prose in place. Edited NPCs survive a reroll; the AI overlay passes them through.')
          : 'Manual editing is a Cartographer (premium) feature. Click to upgrade.'}
      >
        {!canEdit ? 'Edit (Premium)' : (editMode ? 'Stop Editing' : 'Edit Dossier')}
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
      <Button
        variant="secondary"
        size="sm"
        busy={imageExporting}
        onClick={onExportImage}
        title={t('export.imageTitle')}
      >
        {imageExporting ? t('export.imageBusy') : t('export.imageCta')}
      </Button>
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
