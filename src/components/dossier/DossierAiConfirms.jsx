/**
 * dossier/DossierAiConfirms.jsx — the dossier's two AI-action confirms, plus
 * the shared friendly-error mapper. Extracted from OutputContainer as a
 * behavior-preserving Track-C sibling so the dossier stays under the component
 * size ratchet while the regenerate discard-confirm lands.
 *
 *   • Send-campaign-context guard — shown when the settlement carries AI
 *     Guidance that will be woven into the narration.
 *   • Regenerate discard-and-spend guard — shown only when narrative prose
 *     already exists, so a regenerate cannot silently discard pending prose.
 */
import { ConfirmDialog } from '../primitives/Dialog.jsx';

// Map a caught narrative/local-AI error to GM-facing domain language so
// transport/engine internals (fetch/RPC/parse messages) never leak to the trust
// surface; the raw message belongs in logs, not in front of the user.
export function toFriendlyAiError(e) {
  const raw = (e && typeof e.message === 'string' ? e.message : String(e || '')).toLowerCase();
  if (/network|fetch|timeout|connection|offline|failed to fetch/.test(raw)) {
    return 'The simulator could not be reached. Check your connection and try again.';
  }
  return 'The narrative layer could not be generated. Try again.';
}

export default function DossierAiConfirms({
  pendingAiAction, onConfirmContext, onCancelContext,
  pendingRegenerate, regenerateBody, onConfirmRegenerate, onCancelRegenerate,
}) {
  return (
    <>
      <ConfirmDialog
        open={!!pendingAiAction}
        tone="warning"
        title="Send campaign context?"
        body="Your Campaign Context from Notes will be woven into the narration as established lore. Settlement facts still take precedence. DM Notes stay private and are not included."
        confirmLabel="Send context"
        cancelLabel="Cancel"
        onConfirm={onConfirmContext}
        onCancel={onCancelContext}
      />
      {/* Regenerate discard-and-spend confirm — only shown when a narrative
          already exists, so first generation has no friction. */}
      <ConfirmDialog
        open={pendingRegenerate}
        tone="warning"
        title="Regenerate the Narrative Layer?"
        body={regenerateBody}
        confirmLabel="Regenerate"
        cancelLabel="Keep current"
        onConfirm={onConfirmRegenerate}
        onCancel={onCancelRegenerate}
      />
    </>
  );
}
