/**
 * Final manual-authoring controls.
 *
 * A definition revision can be committed only after the deterministic sample
 * corresponds to the current admitted draft. Keeping this gate beside the
 * button makes the taste gate a visible authoring contract, not a hidden
 * handler precondition.
 */

import Button from '../primitives/Button.jsx';
import { FS, MUTED as MUT } from '../theme.js';

const STATUS_STYLE = Object.freeze({
  marginTop: 4,
  maxWidth: 260,
  fontSize: FS.micro,
  color: MUT,
  lineHeight: 1.35,
});

export default function CustomContentCommitControls({
  definitionReady,
  draft,
  editingId,
  handleSave,
  manualSampleCurrent,
  resetDraft,
  saveBusy,
}) {
  const hasName = Boolean(draft.name?.trim());
  const definitionIncomplete = hasName && !definitionReady;
  const statusMessage = definitionIncomplete
    ? 'Complete the required registered fields before reviewing this revision.'
    : !manualSampleCurrent && hasName
      ? 'Forge the current unsaved sample before committing this revision.'
      : null;

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
      <div>
        <Button
          variant="ai"
          size="sm"
          busy={saveBusy}
          onClick={handleSave}
          disabled={
            saveBusy
            || !manualSampleCurrent
            || !definitionReady
          }
        >
          {editingId ? 'Create revision' : 'Add versioned definition'}
        </Button>
        {statusMessage && (
          <div role="status" style={STATUS_STYLE}>
            {statusMessage}
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={resetDraft}
        disabled={saveBusy}
      >
        Cancel
      </Button>
    </div>
  );
}
