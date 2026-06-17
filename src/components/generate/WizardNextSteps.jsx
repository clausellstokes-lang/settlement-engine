/**
 * WizardNextSteps.jsx — P134 / W-4 post-generate "what's next" guide.
 *
 * The post-generate flow used to end on a lone Save button: the user
 * walks through the pipeline reveal (X-1), reads their dossier, and then
 * the page just… stops. Power users know they can also export a PDF,
 * refine fields, drop the settlement on the world map, or roll another —
 * but a first-timer is left wondering "now what?".
 *
 * This card closes out the post-generate flow the way WizardCloseout
 * (W-2) closes out the pre-generate flow: a short, state-aware checklist
 * of next steps. It is GUIDANCE, not a second set of action buttons —
 * the canonical Save / Export / New controls keep their existing homes,
 * so this never competes with (or duplicates) them. The only piece of
 * real state it reflects is whether the user can save yet, because that
 * changes the single most important next step (save vs. make an account
 * vs. upgrade for more slots).
 *
 * Reads settlement + save/auth state from the store. The pure step
 * builder is exported so it can be unit-tested without a DOM.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import {
  GOLD, GOLD_BG, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, R,
} from '../theme.js';

// Persistent "Got it" dismiss — once the user closes the What's-next guide it
// stays closed for them (mirrors the first-dossier callout popup pattern).
const DISMISS_KEY = 'sf:dismissed_whats_next';
function isWhatsNextDismissed() {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1'; }
  catch { return false; }
}
function markWhatsNextDismissed() {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(DISMISS_KEY, '1'); }
  catch { /* storage unavailable — accept ephemeral dismiss */ }
}

/** The save step's framing depends on whether the user can save yet. */
function saveStep({ canSave, signedIn }) {
  if (canSave) {
    return {
      id: 'save',
      label: 'Save it to your library',
      hint: 'Keep it for campaigns, inline editing, and export.',
    };
  }
  if (signedIn) {
    // Signed in but blocked → almost always the per-tier save cap.
    return {
      id: 'save',
      label: 'Save it. Free up a slot or upgrade',
      hint: "You've reached your library's save cap.",
    };
  }
  return {
    id: 'save',
    label: 'Save it. Create a free account',
    hint: 'Free accounts keep your settlements and unlock Town+ tiers.',
  };
}

/**
 * Build the ordered next-step checklist for a freshly-generated dossier.
 * Pure.
 *
 * @param {Object}  args
 * @param {Object}  [args.settlement] — the generated settlement (for the headline tier).
 * @param {boolean} [args.canSave]    — store `canSave()` result.
 * @param {boolean} [args.signedIn]   — whether the user is authenticated (non-wanderer).
 * @returns {{ headline: string, steps: Array<{id,label,hint}> }}
 */
export function buildNextSteps({ settlement, canSave = false, signedIn = false } = {}) {
  const tier = settlement?.tier || 'settlement';
  return {
    headline: `Your ${tier} is ready.`,
    steps: [
      saveStep({ canSave, signedIn }),
      {
        id: 'export',
        label: 'Export a PDF',
        hint: 'A print-ready dossier for the table.',
      },
      {
        id: 'refine',
        label: 'Refine the details',
        hint: 'Rename or tweak fields inline, then re-roll anything that misses.',
      },
      {
        id: 'map',
        label: 'Place it on your world map',
        hint: 'Drag it from your library onto the map to wire up trade and neighbours.',
      },
      {
        id: 'another',
        label: 'Generate another',
        hint: 'Same config for a fresh roll, or switch modes to start over.',
      },
    ],
  };
}

export default function WizardNextSteps() {
  const settlement = useStore(s => s.settlement);
  const canSave    = useStore(s => s.canSave());
  const authTier   = useStore(s => s.auth?.tier);

  const [dismissed, setDismissed] = useState(isWhatsNextDismissed);
  const handleDismiss = () => { markWhatsNextDismissed(); setDismissed(true); };

  if (!settlement) return null;
  if (dismissed) return null;

  // auth tier is 'anon' | 'free' | 'premium' — 'wanderer' is a pricing key, never
  // an auth tier, so the old check treated every signed-in user as anonymous.
  const signedIn = !!authTier && authTier !== 'anon';
  const guide = buildNextSteps({ settlement, canSave, signedIn });

  return (
    <div
      role="group"
      aria-label="What's next"
      style={{
        border: `1px solid ${BORDER}`, borderRadius: R.lg,
        overflow: 'hidden', marginTop: SP.md,
        background: CARD,
        boxShadow: '0 2px 10px rgba(27,20,8,0.08)',
      }}
    >
      <div style={{
        padding: `${SP.sm + 1}px ${SP.lg}px`, background: CARD_HDR,
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'baseline', gap: SP.sm,
      }}>
        <span style={{
          fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK,
        }}>
          What&rsquo;s next
        </span>
        <span style={{ fontSize: FS.xs, color: MUTED, flex: 1, minWidth: 0 }}>
          {guide.headline}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          aria-label="Dismiss what's next"
          title="Got it"
          style={{ flexShrink: 0 }}
        >
          Got it ×
        </Button>
      </div>

      <ol style={{
        listStyle: 'none', margin: 0,
        padding: `${SP.md}px ${SP.lg}px`, fontFamily: sans,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        {guide.steps.map((step, i) => (
          <li key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: SP.sm }}>
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20, borderRadius: '50%',
                background: GOLD_BG, border: `1px solid ${GOLD}`,
                color: GOLD, fontSize: FS.xs, fontWeight: 700, lineHeight: 1,
              }}
            >
              {i + 1}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>{step.label}</div>
              <div style={{ fontSize: FS.xs, color: BODY, marginTop: 1 }}>{step.hint}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
