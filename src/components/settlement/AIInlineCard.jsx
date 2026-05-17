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

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import Card from '../primitives/Card.jsx';
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
  const [dismissed, setDismissed] = useState(false);
  const narrated = !!aiSettlement;
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
        fontSize: 12, lineHeight: 1.5,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1c1409',
      }}>
        Polish this draft with AI — costs {creditCost} credit{creditCost === '1' ? '' : 's'},
        streams section by section. Partial failures keep your raw draft intact, and you can
        revert to raw any time.
      </p>
      <button
        type="button"
        onClick={onPolish}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '6px 12px',
          background: '#a0762a', color: '#fffbf5',
          border: 'none', borderRadius: 4,
          fontSize: 12, fontWeight: 700,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer',
        }}
      >
        <Sparkles size={12} aria-hidden="true" /> {COPY.ai.polishCta}
      </button>
    </Card>
  );
}
