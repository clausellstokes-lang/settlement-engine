/**
 * WizardNextSteps.jsx — post-generate "what's next" guide.
 *
 * The post-generate flow used to end on a lone Save button: the user
 * walks through the pipeline reveal, reads their dossier, and then
 * the page just… stops. Power users know they can also export a PDF,
 * refine fields, drop the settlement on the world map, or roll another —
 * but a first-timer is left wondering "now what?".
 *
 * This card closes out the post-generate flow the way WizardCloseout
 * closes out the pre-generate flow: a short, state-aware checklist
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
    hint: 'A free account keeps your settlements and reaches every size up to metropolis.',
  };
}

/**
 * Build the ordered next-step checklist for a freshly-generated dossier.
 * Pure.
 *
 * The headline binds to the settlement's OWN identity (its name, falling back to
 * tier) so the peak/end focal line is about the artifact the user just made, not
 * a generic category label (P3/P9 — the end lands on content, not chrome).
 *
 * `steps` are the four forward moves that build ON this dossier (save → export →
 * refine → place). "Generate another" is intentionally NOT in `steps`: it
 * throws the work away rather than building on it, so it must not own the final
 * recency slot of a "what's next" list. It returns as a separate quiet `footer`
 * (rendered as a low-emphasis trailing row), not the climax of the checklist.
 *
 * @param {Object}  args
 * @param {Object}  [args.settlement] — the generated settlement (name + tier).
 * @param {boolean} [args.canSave]    — store `canSave()` result.
 * @param {boolean} [args.signedIn]   — whether the user is authenticated (non-wanderer).
 * @param {boolean} [args.saved]      — whether THIS settlement is already in the library.
 * @returns {{ headline: string, steps: Array<{id,label,hint}>, footer: {id,label,hint} }}
 */
export function buildNextSteps({ settlement, canSave = false, signedIn = false, saved = false } = {}) {
  const tier = settlement?.tier || 'settlement';
  const name = settlement?.name;
  return {
    headline: name ? `${name} is ready.` : `Your ${tier} is ready.`,
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
      // State-aware: only instruct "drag from library" once the settlement is
      // actually saved — an unsaved draft isn't in the library yet, so the drag
      // has nothing to grab. For the unsaved case, point at the prerequisite.
      saved
        ? {
            id: 'map',
            label: 'Place it on your world map',
            hint: 'Drag it from your library onto the map to link trade and neighbours.',
          }
        : {
            id: 'map',
            label: 'Place it on your world map',
            hint: 'Save it first, then drag it from your library to link trade and neighbours.',
          },
    ],
    footer: {
      id: 'another',
      label: 'Generate another',
      hint: 'Same settings for a fresh roll, or switch modes to start over.',
    },
  };
}

export default function WizardNextSteps() {
  const settlement = useStore(s => s.settlement);
  const canSave    = useStore(s => s.canSave());
  const authTier   = useStore(s => s.auth?.tier);
  // "Saved" = the on-screen settlement is backed by a library entry. activeSaveId
  // covers the opened-from-library case; the savedSettlements name+tier match
  // covers a draft the live Save button just persisted (which doesn't set
  // activeSaveId). A freshly-generated draft matches neither, so it reads unsaved.
  const activeSaveId     = useStore(s => s.activeSaveId);
  const savedSettlements = useStore(s => s.savedSettlements);

  const [dismissed, setDismissed] = useState(isWhatsNextDismissed);
  const handleDismiss = () => { markWhatsNextDismissed(); setDismissed(true); };

  if (!settlement) return null;
  if (dismissed) return null;

  // auth tier is 'anon' | 'free' | 'premium' — 'wanderer' is a pricing key, never
  // an auth tier, so the old check treated every signed-in user as anonymous.
  const signedIn = !!authTier && authTier !== 'anon';
  const saved = activeSaveId != null
    || (Array.isArray(savedSettlements)
        && savedSettlements.some(e => e?.name === settlement.name && e?.tier === settlement.tier));
  const guide = buildNextSteps({ settlement, canSave, signedIn, saved });

  return (
    <div
      role="group"
      aria-label="What's next"
      style={{
        border: `1px solid ${BORDER}`, borderRadius: R.lg,
        overflow: 'hidden', marginTop: SP.md,
        background: CARD,
        // No drop-shadow: this is a SUBORDINATE guidance card. Border + header
        // tint already fence it; a shadow would lift it to (or above) the
        // elevation of the dossier/Save it annotates (P5 — one elevation level).
      }}
    >
      <div style={{
        padding: `${SP.sm + 1}px ${SP.lg}px`, background: CARD_HDR,
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'baseline', gap: SP.sm,
      }}>
        {/* Content-as-hero: the readiness statement is the focal element; the
            literal "What's next" label is demoted to a quiet eyebrow. */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: BODY,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            What&rsquo;s next
          </span>
          <span style={{
            fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK,
          }}>
            {guide.headline}
          </span>
        </div>
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

      {/* This is GUIDANCE, not a set of buttons. The old numbered gold pips read
          as a clickable step-CTA list — a label→function mismatch, since each row
          is inert and duplicates the verbs of the real controls (Save button,
          export toolbar). The pips are replaced with a quiet hairline marker so
          nothing invites a dead click; the single focal cue (Save) is carried by
          a gold left-rule + weight, not a fake step button (P8). */}
      <ul style={{
        listStyle: 'none', margin: 0,
        padding: `${SP.md}px ${SP.lg}px`, fontFamily: sans,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        {guide.steps.map((step, i) => {
          // One focal row: Save (the most-important next move) gets a gold
          // left-rule + INK label; the rest are quiet BODY rows, so the squint
          // test lands on the single first action, not co-equal pseudo-buttons.
          const isPrimary = i === 0;
          return (
            <li key={step.id} style={{
              display: 'flex', flexDirection: 'column', gap: 1,
              paddingLeft: SP.md,
              borderLeft: `2px solid ${isPrimary ? GOLD : GOLD_BG}`,
            }}>
              <span style={{ fontSize: FS.sm, fontWeight: isPrimary ? 800 : 700, color: isPrimary ? INK : BODY }}>{step.label}</span>
              <span style={{ fontSize: FS.xs, color: BODY }}>{step.hint}</span>
            </li>
          );
        })}
      </ul>

      {/* Quiet footer — "Generate another" discards this dossier rather than
          building on it, so it sits apart from the forward-building checklist
          above, not in its final recency slot. A spacing-grouped trailing row,
          de-emphasized (no marker, MUTED). */}
      <div style={{
        padding: `${SP.sm}px ${SP.lg}px`, borderTop: `1px solid ${BORDER}`,
        fontFamily: sans,
      }}>
        <span style={{ fontSize: FS.sm, fontWeight: 700, color: BODY }}>{guide.footer.label}</span>
        <span style={{ fontSize: FS.xs, color: MUTED, marginLeft: SP.sm }}>{guide.footer.hint}</span>
      </div>
    </div>
  );
}
