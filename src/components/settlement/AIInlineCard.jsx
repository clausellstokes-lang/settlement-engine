/**
 * AIInlineCard — Contextual AI explainer, mounted right below the
 * dossier title in edit mode.
 *
 * The audit's framing: AI should not be the first thing the product
 * asks users to trust. The deterministic core renders first, then a
 * gentle inline card explains the optional polish.
 *
 * This card is a PLAIN EXPLAINER, not a CTA. The single paid
 * "run narrative" action lives in the dossier header
 * (DossierNarrativeButtons), which also carries the free
 * View Narrative / Raw toggle. Rendering a second paid button here
 * stranded the dossier with two competing primaries for the SAME
 * narrative layer; this card now just points the GM at that one
 * header action so the run-narrative path is unambiguous.
 *
 * Hidden when:
 *   - the settlement is already narrated (job done)
 *   - the user dismisses it (one click; persists for the session)
 *   - there's no settlement to polish
 */

import { useState } from 'react';
import { FS, swatch } from '../theme.js';
import { X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import Card from '../primitives/Card.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { COPY } from '../../copy/strings.js';

/**
 * @param {Object} props
 * @param {Object} props.settlement
 */
export default function AIInlineCard({ settlement }) {
  const aiSettlement = useStore(s => s.aiSettlement);
  const aiDailyLife  = useStore(s => s.aiDailyLife);
  // Authoritative cost: read the live narrative cost through the same store
  // selector the dossier header's "Generate Narrative" button uses, so this
  // explainer and that button never disagree on price. Respects the user's
  // model preference (fast tiers cost less). The server enforces this same
  // schedule — see generate-narrative CREDIT_COSTS.
  const narrativeCost = useStore(s => s.getCost('narrative'));
  const [dismissed, setDismissed] = useState(false);
  // Unify the "narrated" predicate with the header badge + Revert-to-Raw gate,
  // which both treat ANY narrative layer (settlement narrative OR daily-life
  // prose) as narrated. The card previously keyed on aiSettlement only, so a
  // daily-life-only save showed BOTH "Revert to Raw" and this card — two
  // contradictory signals about the same narrative layer (P8). One source of
  // truth: hide the explainer whenever any narrative layer exists.
  const narrated = !!(aiSettlement || aiDailyLife);
  if (!settlement) return null;
  if (narrated) return null;
  if (dismissed) return null;

  return (
    <Card
      variant="suggestion"
      // Programmatic-focus target: the NextActionRail's "Polish with AI" rung
      // enters edit mode then scrolls/focuses this card. tabIndex={-1} makes the
      // card focusable without joining the natural tab order. Card forwards
      // unknown props to its root <section>, so id + tabIndex land on the DOM.
      id="ai-inline-card"
      tabIndex={-1}
      kicker={COPY.ai.inlineHook}
      actions={
        <IconButton
          Icon={X}
          label="Dismiss this suggestion for the session"
          tone="ghost" size="sm"
          onClick={() => setDismissed(true)}
        />
      }
    >
      <p style={{
        margin: 0,
        fontSize: FS.sm, lineHeight: 1.5,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: swatch.inkMag,
      }}>
        The Narrative Layer turns this dossier's simulated facts into table-ready prose.
        Use the <strong>Generate Narrative ({narrativeCost} credit{narrativeCost === 1 ? '' : 's'})</strong> button
        in the dossier header to run it. It streams section by section, partial failures keep
        your raw draft intact, and you can revert to raw any time.
      </p>
    </Card>
  );
}
