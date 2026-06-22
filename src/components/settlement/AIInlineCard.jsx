/**
 * AIInlineCard — Contextual AI affordance, mounted right below the
 * dossier title.
 *
 * The audit's framing: AI should not be the first thing the product
 * asks users to trust. The deterministic core renders first, then a
 * gentle inline card offers polish. This replaces "AI = top-level
 * button" with "AI = appears once you have a draft worth polishing".
 *
 * Hidden when:
 *   - the settlement is already narrated (job done)
 *   - the user dismisses it (one click; persists for the session)
 *   - there's no settlement to polish
 *
 * The CTA wires to the existing AI invocation flow — this is purely
 * about presentation, not a new code path.
 */

import { useState } from 'react';
import { FS, swatch } from '../theme.js';
import { Sparkles, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import Card from '../primitives/Card.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { COPY } from '../../copy/strings.js';

/**
 * @param {Object} props
 * @param {Object} props.settlement
 * @param {() => void} props.onPolish        invoked on CTA click — wired by the parent
 *   to the appropriate AI handler (typically `requestNarrative(saveId)` from
 *   the AI slice). The card stays handler-agnostic so callers can route to
 *   different flows (raw narrative, progression, daily life) without
 *   changing this component.
 * @param {string=} [props.creditCost='1']   string so callers can vary copy
 */
export default function AIInlineCard({ settlement, onPolish, creditCost = '1' }) {
  const aiSettlement = useStore(s => s.aiSettlement);
  const aiDailyLife  = useStore(s => s.aiDailyLife);
  const aiLoading    = useStore(s => s.aiLoading);
  const aiError      = useStore(s => s.aiError);
  const [dismissed, setDismissed] = useState(false);
  // Unify the "narrated" predicate with the header badge + Revert-to-Raw gate,
  // which both treat ANY narrative layer (settlement narrative OR daily-life
  // prose) as narrated. The card previously keyed on aiSettlement only, so a
  // daily-life-only save showed BOTH "Revert to Raw" and this polish CTA — two
  // contradictory primaries about the same narrative layer (P8). One source of
  // truth: hide polish whenever any narrative layer exists.
  const narrated = !!(aiSettlement || aiDailyLife);
  if (!settlement) return null;
  if (narrated) return null;
  if (dismissed) return null;

  return (
    <Card
      variant="suggestion"
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
        margin: '0 0 8px',
        fontSize: FS.sm, lineHeight: 1.5,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: swatch.inkMag,
      }}>
        Run the Narrative Layer on this dossier. Costs {creditCost} credit{creditCost === '1' ? '' : 's'},
        streams section by section. Partial failures keep your raw draft intact, and you can
        revert to raw any time.
      </p>
      <Button
        type="button"
        variant="primary"
        size="md"
        busy={aiLoading}
        disabled={aiLoading}
        icon={<Sparkles size={12} aria-hidden="true" />}
        onClick={onPolish}
      >
        {aiLoading ? 'Running…' : (aiError ? 'Retry' : 'Run the Narrative Layer')}
      </Button>
      {/* Co-located status + recovery (P10): the polish CTA reflects its own
          busy state, and a failure surfaces inline beneath the button the GM
          pressed — not far down in the dossier's session notices. aiError is a
          shared field across AI actions (same imprecision OutputContainer lives
          with), so it can occasionally echo another AI action's error. */}
      {aiError && !aiLoading && (
        <p role="alert" style={{ margin: '8px 0 0', fontSize: FS.xs, lineHeight: 1.45, color: swatch.danger, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {aiError}
        </p>
      )}
    </Card>
  );
}
