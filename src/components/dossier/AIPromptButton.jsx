/**
 * AIPromptButton.jsx — P137 / HT-4: copy this dossier as an AI prompt.
 *
 * Power-user surface. The user has a generated dossier in front of
 * them; they want to feed it into ChatGPT/Claude for a tangential
 * question ("what would a sermon in this town sound like?") without
 * spending a Narrative credit. This button serialises the dossier
 * into the same grounded prompt envelope our edge function uses,
 * then drops it on the clipboard with a confirmation toast.
 *
 * Self-gated on flag('aiPromptCopy'). Hidden in readOnly (public
 * dossier viewer). Fires EVENTS.AI_PROMPT_COPIED on success.
 *
 * The prompt body is built from the existing domain helpers
 * (buildAiGroundingPayload + assemblePromptSections) so the
 * exported text matches what our backend would send — no second
 * format to keep in sync.
 */

import { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import {
  buildAiGroundingPayload,
  assemblePromptSections,
} from '../../domain/aiGrounding.js';

const GOLD = '#C9A24C';
const MUTED = '#9C8068';
const BORDER = '#E8D9B0';
const sans = '"Nunito", system-ui, sans-serif';

function buildPromptText(settlement) {
  const payload = buildAiGroundingPayload(settlement);
  const sections = assemblePromptSections(payload);
  // assemblePromptSections returns an ordered array — flatten with
  // double-newline so the exported prompt reads as discrete sections.
  return Array.isArray(sections)
    ? sections.map(s => typeof s === 'string' ? s : (s.body || '')).filter(Boolean).join('\n\n')
    : String(sections || '');
}

export default function AIPromptButton({ settlement }) {
  const enabled = flag('aiPromptCopy');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const tier = useStore(s => s.auth.tier);

  if (!enabled) return null;
  if (!settlement) return null;
  // Reserved for signed-in users — anon users would hit a wall trying
  // to feed this into a paid AI, and the export reveals the structured
  // grounding which is one of the moat assets. Anon users see nothing.
  if (tier === 'anon') return null;

  const handleClick = async () => {
    try {
      const text = buildPromptText(settlement);
      if (!text) throw new Error('Empty prompt');
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      try {
        Funnel.track(EVENTS.AI_PROMPT_COPIED, {
          settlement_name: settlement.name,
          length: text.length,
        });
      } catch { /* silent */ }
      // Reset the success state after 2s so the icon goes back to
      // clipboard — user can copy again if they made a tweak.
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError(e?.message || 'Copy failed');
      setTimeout(() => setError(null), 3500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Copy this dossier as a structured prompt to paste into ChatGPT or Claude."
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px',
        background: copied ? 'rgba(74,122,58,0.10)' : 'transparent',
        border: `1px solid ${copied ? '#4A7A3A' : BORDER}`,
        borderRadius: 4,
        color: copied ? '#3A6A2A' : MUTED,
        fontSize: 11, fontFamily: sans, fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {copied
        ? <><Check size={11} /> Copied to clipboard</>
        : error
          ? <><Clipboard size={11} /> {error}</>
          : <><Clipboard size={11} color={GOLD} /> Copy as AI prompt</>
      }
    </button>
  );
}
