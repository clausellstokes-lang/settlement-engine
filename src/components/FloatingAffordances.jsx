/**
 * components/FloatingAffordances.jsx — the global floating-widget cluster.
 *
 * A single lazy mount point for the app's self-gated floating affordances: the feedback
 * widget, the Surveyor analyst panel (S1, read-only), and the Surveyor's workshop (the S4–S6
 * write stages). App.jsx mounts THIS (one lazy chunk) instead of each widget separately, so
 * adding a widget costs the App.jsx shell zero code lines (it sits at its max-lines ceiling)
 * while every widget stays off first paint — they ride this lazy chunk, never the entry
 * closure (tests/build/surveyorPanelsLazy.test.js pins the workshop's membership). The
 * workshop's four stage bodies are themselves React.lazy, so each stage's graph loads only
 * when opened.
 *
 * Each child self-gates on `visible`; this wrapper just co-locates the mounts.
 */

import FeedbackWidget from './FeedbackWidget.jsx';
import AiAnalystPanel from './AiAnalystPanel.jsx';
import SurveyorWorkshop from './surveyor/SurveyorWorkshop.jsx';

export default function FloatingAffordances({ visible = true }) {
  return (
    <>
      <FeedbackWidget visible={visible} />
      <AiAnalystPanel visible={visible} />
      <SurveyorWorkshop visible={visible} />
    </>
  );
}
