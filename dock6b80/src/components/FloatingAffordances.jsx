/**
 * components/FloatingAffordances.jsx — the global floating-widget cluster.
 *
 * A single lazy mount point for the app's self-gated floating affordances: the feedback
 * widget and THE ONE DOOR (C13) — the single left-edge Surveyor entry that routes every
 * prompt to its destination (the S1 analyst panel or a Surveyor workshop stage; both ride
 * this same lazy chunk through SurveyorDoor's static imports). App.jsx mounts THIS (one
 * lazy chunk) instead of each widget separately, so adding a widget costs the App.jsx
 * shell zero code lines (it sits at its max-lines ceiling) while every widget stays off
 * first paint — they ride this lazy chunk, never the entry closure
 * (tests/build/surveyorPanelsLazy.test.js pins the membership chain). The workshop's
 * stage bodies are themselves React.lazy, so each stage's graph loads only when opened.
 *
 * Each child self-gates on `visible` (the door additionally on the Surveyor entitlement);
 * this wrapper just co-locates the mounts.
 */

import FeedbackWidget from './FeedbackWidget.jsx';
import SurveyorDoor from './surveyor/SurveyorDoor.jsx';

export default function FloatingAffordances({ visible = true }) {
  return (
    <>
      <FeedbackWidget visible={visible} />
      <SurveyorDoor visible={visible} />
    </>
  );
}
