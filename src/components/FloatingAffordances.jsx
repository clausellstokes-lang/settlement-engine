/**
 * components/FloatingAffordances.jsx — the global floating-widget cluster.
 *
 * A single lazy mount point for the app's self-gated floating affordances: the feedback
 * widget and the Surveyor analyst panel. App.jsx mounts THIS (one lazy chunk) instead of
 * each widget separately, so adding the analyst panel costs the App.jsx shell zero code
 * lines (it sits at its max-lines ceiling) while both widgets stay off first paint —
 * FeedbackWidget and AiAnalystPanel ride this lazy chunk, never the entry closure.
 *
 * Each child self-gates on `visible`; this wrapper just co-locates the mounts.
 */

import FeedbackWidget from './FeedbackWidget.jsx';
import AiAnalystPanel from './AiAnalystPanel.jsx';

export default function FloatingAffordances({ visible = true }) {
  return (
    <>
      <FeedbackWidget visible={visible} />
      <AiAnalystPanel visible={visible} />
    </>
  );
}
