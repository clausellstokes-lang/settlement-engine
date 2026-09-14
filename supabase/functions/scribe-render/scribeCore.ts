/**
 * scribe-render/scribeCore.ts — THE EDGE HALF OF THE SCRIBE: the constants the money path needs,
 * the cache-floor padding, and the RE-EXPORT of the one prompt builder.
 *
 * ── ⛔⛔ THE BUILDERS ARE NOT HERE ANY MORE, AND THAT IS THE WHOLE OF W3a CAR 1 ─────
 * Until 2026-09-14 this file built the brief, the turn, the pool rows, the output schema and the
 * tier-1 checklist, and `scribe-harness/lib/brief.mjs` built a SECOND set with a different output
 * schema. The simulation that produced the chair's figures ran the harness's fork, so what was
 * measured was a prompt this product would never send. Chair ruling 25 struck the fork: the
 * builders now live in `src/domain/prose/scribeBrief.js`, a pure leaf, bundled into
 * `_shared/proseKernel.bundle.js` for Deno and imported from the dock by the harness. This file
 * re-exports them so `index.ts` reads one import list and the boundary's shape is unchanged.
 *
 * ⛔ THE RE-EXPORT IS NOT A CONVENIENCE. It is what keeps the bundle's names from being spelled
 * at two call sites: `index.ts` imports from here, the tests import from here, and the only line
 * in the estate that knows the builders come from a bundle is the one below.
 *
 * ── THE CONTRACT IN (design §3.1, ruling 31) ───────────────────────────────────────
 * THREE parts now, and the split is the whole economics of the feature:
 *   1. THE BRIEF — byte-stable, `cache_control: ephemeral` with a one-hour TTL: the VOICE, the
 *      mechanical bars, the unit rules, the plausible-addition bar, the two-ladders note and the
 *      exemplar pack. Written once per hour per model and read at a fraction of the price on
 *      every tab of every settlement after that.
 *   2. THE TOWN BLOCK — a SECOND cached breakpoint, one per settlement rather than one per tab.
 *   3. THE VOLATILE TURN — the epoch, the record, the pools and the game master's instructions.
 *
 * ⭐ JUDGMENT (vetoable, unchanged since W2): ONE BRIEF FOR EVERY BLOCK, NOT ONE PER BLOCK. The
 * design calls the cached part "the block brief", per block. The only block-specific content it
 * could hold is the block's pool keys and their spine stances — and those are per-TOWN facts
 * already carried by the card in the volatile turn. Hoisting them into the prefix would make the
 * prefix vary by town and destroy the cache, which is the opposite of what §3.1 is for.
 */

// deno-lint-ignore-file no-explicit-any

// @ts-ignore — the bundle is generated JavaScript with JSDoc types, checked by `deno check` in
// tests/lint/scribeBundle.walker.test.js and byte-derived from src/domain/prose/scribeBrief.js.
import {
  buildScribeBrief as buildScribeBriefJs,
  buildScribeUserTurn as buildScribeUserTurnJs,
  buildTier1Checklist as buildTier1ChecklistJs,
  buildTownBlock as buildTownBlockJs,
  judgeUnits as judgeUnitsJs,
  parseScribeUnits as parseScribeUnitsJs,
  SCRIBE_OUTPUT_SCHEMA as SCRIBE_OUTPUT_SCHEMA_JS,
} from '../_shared/proseKernel.bundle.js';

/** The artefact shape this renderer writes. Pinned equal to `SCRIBE_ARTEFACT_SCHEMA`. */
export const SCRIBE_ARTEFACT_SCHEMA = 1;

/** The writer and the tier-1 refuter (chair ruling 8; the API skill's current default). */
export const SCRIBE_MODEL = 'claude-opus-5';

/** The provider beta that turns on server-side refusal fallbacks in their scalar form. */
export const SCRIBE_FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/**
 * The cached prefix's floor. Below this many tokens a prefix silently does not cache at all.
 *
 * ⛔ THE BRIEF NO LONGER NEEDS PADDING AND IS NOT PADDED. With the exemplar pack in it the prefix
 * is an order of magnitude above this floor; `scribeCore.test.ts` asserts that directly rather
 * than trusting it. `cachePadding` is kept because the estate's other cached prefixes use the
 * same idiom and a second spelling of it would be the thing that drifts.
 */
export const CACHE_MIN_PREFIX_TOKENS = 4096;
const CACHE_PAD_TARGET_TOKENS = 4400;
const CACHE_PAD_SENTENCE =
  'Ignore this line; it is content-neutral filler present only to keep the cached prompt prefix at a stable, cacheable size. ';

/** The estate's own 4-chars-per-token estimate, so this file and `prompts.ts` agree. */
export const estimateTokens = (text: string): number => Math.ceil(String(text || '').length / 4);

/** Pad a prefix to clear the cache floor. Returns the PAD ALONE, as `cachePadding` does. */
export function cachePadding(prefixText: string): string {
  const est = estimateTokens(prefixText);
  if (est >= CACHE_MIN_PREFIX_TOKENS) return '';
  const neededChars = (CACHE_PAD_TARGET_TOKENS - est) * 4;
  const reps = Math.max(1, Math.ceil(neededChars / CACHE_PAD_SENTENCE.length));
  return `\n\n[CACHE-STABILIZER — ignore this block; it is not settlement data]\n${CACHE_PAD_SENTENCE.repeat(reps)}\n[END CACHE-STABILIZER]`;
}

export interface ScribeUnit {
  blockId: string;
  poolKey: string;
  vid: number;
  spine: string;
  faces: string[];
  notebook: string[];
}

export interface ScribeVerdict {
  blockId: string;
  poolKey: string;
  vid: number;
  verdict: string;
  arms: string[];
  findings: Array<{
    arm: string;
    channel: string;
    subject: string;
    value: string;
    description: string;
  }>;
}

/** ⭐ THE OUTPUT SCHEMA (design §3.2), from the one leaf. Closed at every level. */
export const SCRIBE_OUTPUT_SCHEMA = SCRIBE_OUTPUT_SCHEMA_JS as Record<string, any>;

/** ⭐⭐ THE BRIEF — cache breakpoint 1. Byte-stable given the VOICE and the exemplar pack. */
export const buildScribeBrief = (input: { voice: string; exemplars: string }): string =>
  buildScribeBriefJs(input);

/** ⭐ THE TOWN BLOCK — cache breakpoint 2, one per settlement rather than one per tab. */
export const buildTownBlock = (card: any): string => buildTownBlockJs(card);

/** ⭐ THE VOLATILE TURN (design §3.1 parts 2-4); the town is in the block above, not here. */
export const buildScribeUserTurn = (
  input: { card: any; record?: any; guidance?: string },
): string => buildScribeUserTurnJs(input);

/** Parse the provider's structured answer. A typed refusal, never a throw. */
export const parseScribeUnits = (
  answerText: string,
): { ok: boolean; units: ScribeUnit[]; reason: string } => parseScribeUnitsJs(answerText);

/** ⭐⭐ THE GATE EVERY RENDERED LINE PASSES (design §4; chair rulings 5 and 6). */
export const judgeUnits = (
  units: ScribeUnit[],
  card: any,
  refute: (unit: any, card: any, extra?: any) => any,
): { kept: ScribeUnit[]; verdicts: ScribeVerdict[]; dropped: number } =>
  judgeUnitsJs(units, card, refute);

/** ⭐ THE TIER-1 CHECKLIST (design §4). The classes no tier-0 arm can reach. */
export const buildTier1Checklist = (units: ScribeUnit[], card: any): string =>
  buildTier1ChecklistJs(units, card);
