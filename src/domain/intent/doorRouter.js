/**
 * domain/intent/doorRouter.js — THE ONE DOOR's destination router (C13, owner ruling
 * 2026-07-18: "AI access = ONE floating marker … ALL prompts route through it").
 *
 * The S3 intent compiler IS the router (the ruling's architecture line): this module is
 * the compiler's CLIENT FORE-STAGE — the zero-cost, zero-network classification that
 * decides WHICH existing stage surface a prompt belongs to, so the stage panels become
 * DESTINATIONS the door opens, never entry points. Anything the fore-stage cannot place
 * with a strong cue falls to the ANALYST as a question about the CURRENT surface — the
 * CONTEXT-FIRST LAW (grounding envelope = current surface → settlement → world → product,
 * widening only when the text names a wider ring). The real compilation still happens at
 * the destinations through the ONE existing compiler lane (lib/surveyorWrite.js /
 * lib/aiAnalyst.js) — this module proposes a destination; it never compiles, charges,
 * or calls a provider.
 *
 * VOCABULARY IS VETOABLE: the cue table below is a manager-authored starting vocabulary
 * (recorded in the C13 report); tests/domain/doorRouter.test.js pins the table so a veto
 * is a one-line edit + pin update, never an archaeology dig.
 *
 * PURITY / BUDGET: no store, no transport, no side effects; lazy-only (rides the
 * FloatingAffordances chunk) — zero eager bytes.
 */

/** Every destination the door can open — the workshop's stage ids plus the analyst.
 *  Mirrors SurveyorWorkshop STAGES + AiAnalystPanel; the pin asserts the workshop ids
 *  stay a subset of this list so a new stage cannot silently become unroutable. */
export const DOOR_DESTINATIONS = Object.freeze([
  'analyst', 'content', 'style', 'construct', 'apply', 'autonomy',
]);

/** The grounding rings, innermost first (the context-first law's ladder). */
export const DOOR_SCOPES = Object.freeze(['settlement', 'realm', 'product']);

// ── The cue table ────────────────────────────────────────────────────────────
// Strong, order-sensitive cues only: a prompt must EARN a write-stage routing;
// ambiguity falls through to the analyst (a question about the current surface).
// Order: session recap (apply) → autonomy → style → construct → content.
// `construct` outranks `content` so "build me a new town with a mage guild"
// lands on S5/S6; bare "invent an item/npc/deity" lands on S4.
/** @type {ReadonlyArray<[string, RegExp]>} */
const CUES = [
  ['apply', /\b(session|recap|the party|last session|what happened|we (fought|killed|sacked|burned|met|found|took|rescued|freed))\b/i],
  ['autonomy', /\b(advance (the )?(world|campaign|weeks?)|keep (running|advancing)|until (a|the|it)|standing instructions?|autonomous|run the (world|campaign))\b/i],
  ['style', /\b(re-?style|re-?skin|redraw|style|look and feel|palette|watercolor|woodcut|art style|map style)\b/i],
  ['construct', /\bnew (settlement|town|village|city|hamlet|thorp|capital|realm)\b|\b(build|construct|found|lay out|place)\b[^.?!]*\b(settlement|town|village|city|hamlet|thorp|capital|realm|district|quarter)\b|\bgenerate (a|an) (settlement|town|village|city|realm)\b/i],
  ['content', /\b(invent|draft|write|create|add|make)( me| up)? (a|an|some|a few|new|custom)\b|\bcustom content\b/i],
];

// Ring-widening cues (the envelope moves OUTWARD only when the text names it).
const REALM_CUE = /\b(realm|world|region|kingdom|empire|continent|the whole map)\b/i;
const PRODUCT_CUE = /\b(credits?|price|pricing|subscription|plan|billing|refund|tier|upgrade|byok|api key)\b/i;

/**
 * Classify a door prompt into a destination + grounding scope. Pure, deterministic.
 *
 * @param {string} text the user's prompt as typed
 * @param {{ label?: string }|null} [anchor] the current-surface anchor (deriveAnchor's
 *   output) — reserved for future surface-sensitive cues; the default scope is already
 *   "the current surface" by construction (the analyst destination anchors itself).
 * @returns {{ destination: string, scope: string }}
 */
export function routeDoorPrompt(text, anchor = null) {
  void anchor; // context-first: the innermost ring is the default, not a computation
  const q = typeof text === 'string' ? text.trim() : '';
  // Product-ring questions are ANALYST questions about the product, never writes.
  if (PRODUCT_CUE.test(q)) return { destination: 'analyst', scope: 'product' };
  const scope = REALM_CUE.test(q) ? 'realm' : 'settlement';
  for (const [destination, cue] of CUES) {
    if (cue.test(q)) return { destination, scope };
  }
  return { destination: 'analyst', scope };
}
