/**
 * useNextActionRailHandlers — the wiring behind SettlementDetail's NextActionRail
 * and the shared canonize-confirm gate.
 *
 * Extracted from SettlementDetail (behavior-preserving) to keep that surface
 * under the component-size ratchet. The rail is purely an aggregation surface:
 * every handler here maps to an action SettlementDetail already performs.
 *
 * Two navigation-audit fixes live here:
 *   - BLOCKER #3: canonize routes through ONE confirm gate + ONE first_canonize
 *     pricing moment (shared with PhaseBadge), so the rail can no longer fire the
 *     persisted draft→canon transition unconfirmed or skip the moment.
 *   - MAJOR #8: the event + AI rungs enter edit mode and then scroll/focus the
 *     card where the action actually lives, making the rail's JSDoc promise true.
 */

import { useStore } from '../../store/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { navigate } from '../../hooks/useRoute.js';

// After edit mode flips, the target Workshop/AI node only exists on the NEXT
// paint — poll a few frames for it, then scroll it into view and focus a control
// within it (or the container). Pure DOM, no closure.
function scrollFocusWhenReady(selector) {
  let tries = 0;
  const tick = () => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusTarget = el.matches('input,select,textarea,button')
        ? el
        : (el.querySelector('select,input,textarea,button') || el);
      try { focusTarget.focus({ preventScroll: true }); } catch { /* focus is best-effort */ }
      return;
    }
    if (tries++ < 12) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * @param {Object} deps
 * @param {string|null} deps.saveId
 * @param {string} deps.phase
 * @param {boolean} deps.canEdit
 * @param {boolean} deps.editMode
 * @param {boolean} deps.narrated
 * @param {() => void} deps.toggleEditMode
 * @param {(() => void)|undefined} deps.canonize
 * @param {(open: boolean) => void} deps.setConfirmCanonizeOpen
 * @param {() => void} deps.openExportSheet
 * @returns {{ railHandlers: Object, requestCanonize: () => void, confirmCanonize: () => void }}
 */
export function useNextActionRailHandlers({
  saveId, phase, canEdit, editMode, narrated,
  toggleEditMode, canonize, setConfirmCanonizeOpen, openExportSheet,
}) {
  // Shared canonize commit — the ONE place the persisted draft→canon transition
  // fires, behind the host's ConfirmDialog + the first_canonize pricing moment.
  const requestCanonize = () => setConfirmCanonizeOpen(true);
  const confirmCanonize = () => {
    setConfirmCanonizeOpen(false);
    canonize?.();
    triggerPricingMoment('first_canonize', () => {
      useStore.getState().setPurchaseModalOpen?.(true);
    }, { tier: useStore.getState().auth?.tier });
  };

  const enterEdit = () => { if (canEdit && !editMode) toggleEditMode(); };
  // Event rung: enter edit, then land on the EventComposer inside the auto-opened
  // "Make Changes" Workshop card.
  const enterEditAndComposeEvent = () => {
    enterEdit();
    scrollFocusWhenReady('#event-composer');
  };
  // Core narrate invocation — DECOUPLED from the editor (no edit-mode entry).
  // It fires requestNarrative against the saved record exactly like the dossier's
  // own paid CTA did; the read dossier shows progress via its in-progress chip and
  // auto-flips to the prose on success (requestNarrative sets showNarrative). This
  // is what lets the rail's Narrate button stand on its own rather than dragging
  // the user into the edit surface. Shared by first-narrate and regenerate.
  const runNarrate = () => {
    const live = useStore.getState();
    if (typeof live.requestNarrative === 'function' && saveId) {
      live.requestNarrative(saveId).catch(e => {
        console.warn('[NextActionRail] requestNarrative failed:', e);
      });
    }
    triggerPricingMoment('first_ai_use', () => {
      live.setPurchaseModalOpen?.(true);
    }, { tier: live.auth?.tier });
  };

  // First narration — offered until a narrative exists.
  const polishWithAi = () => runNarrate();

  const railHandlers = {
    onCanonize: (canEdit && phase !== 'canon') ? requestCanonize : undefined,
    onApplyEvent: canEdit ? enterEditAndComposeEvent : undefined,
    onPolishAi: (canEdit && !narrated) ? polishWithAi : undefined,
    // Regenerate is the same paid invocation as the first narrate; the rail wraps
    // it in a discard-confirm (NextActionRail owns that dialog) before firing.
    onRegenerateAi: (canEdit && narrated) ? runNarrate : undefined,
    onExport: openExportSheet,
    onPlaceOnMap: () => navigate('realm'),
    onEdit: canEdit ? toggleEditMode : undefined,
  };

  return { railHandlers, requestCanonize, confirmCanonize };
}
