/**
 * HeraldJudgmentPointer.jsx — THE ONE-LINE POINTER (realm directive 7 / J-D7).
 *
 * "Dismissal parks unresolved items in a durable HELD DOCKET that re-surfaces on
 * the next advance and shows a one-line Herald pointer."
 *
 * The Herald is a NEWSPAPER: it reports what is true and points at where the work
 * is done. Ruling on the realm's withheld matters is that work, and after J-D7 it
 * happens in exactly one place — the gathered adjudication screen. So the
 * Adjudication door's pending half stops being a second desk (which is how a DM
 * ends up half-ruling the same docket from two surfaces) and becomes this: the
 * honest count, in world words, with the door to the one desk.
 *
 * THE COUNT IS THE SCREEN'S OWN. It comes from pendingDecisionCount over the same
 * rows gatheredDecisionRows lists, unfiltered by the paper's focus/search strip —
 * a pointer that promised "two matters" while the desk showed five would be worse
 * than no pointer at all.
 */

import { Gavel } from 'lucide-react';

import { BODY, BORDER, CARD_ALT, FS, MUTED, sans } from '../theme.js';
import { SmallButton } from './WorldPulsePrimitives.jsx';
import { judgmentPointerSentence } from './gatheredDocket.js';

/**
 * @param {Object} props
 * @param {number} props.count            matters awaiting judgment, realm-wide
 * @param {(() => void)|null} [props.onOpen]  opens the gathered adjudication screen
 */
export default function HeraldJudgmentPointer({ count, onOpen = null }) {
  const frame = {
    border: `1px dashed ${BORDER}`, padding: 14, background: CARD_ALT,
    color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5,
    display: 'grid', gap: 8,
  };
  if (count <= 0) {
    return (
      <div data-testid="adjudication-pointer" style={{ ...frame, color: MUTED }}>
        No decision awaits you. The realm runs on its own for now.
      </div>
    );
  }
  return (
    <div data-testid="adjudication-pointer" style={frame}>
      <div data-testid="adjudication-pointer-line">
        {judgmentPointerSentence(count)}
        {' '}
        {onOpen
          ? 'They are gathered on one screen so you can rule on them together, in any order.'
          : 'They are gathered on one screen the next time the realm advances.'}
      </div>
      {onOpen && (
        <div>
          <SmallButton tone="good" onClick={onOpen} hint="Open the matters awaiting judgment">
            <Gavel size={13} /> Hear the matters
          </SmallButton>
        </div>
      )}
    </div>
  );
}
