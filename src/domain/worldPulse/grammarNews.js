/**
 * grammarNews.js — THE PACT GRAMMAR'S GOVERNED READER REGISTRY (GR-0's slice).
 *
 * The WW-C split, copied deliberately: `grammarReceiptPools.js` holds the authored
 * corpus, THIS file holds the registry rows, the eligibility declarations and the
 * seeded picker, and `treatyLifecycleVoice.js` holds the engine-facing reads and the
 * beats. Nothing here decides that a treaty lapsed or that a court noticed a default;
 * it only joins an already-earned typed fact to the authored sentences.
 *
 * ── TWO ELIGIBILITY AXES, AND WHY BOTH ARE NEEDED ───────────────────────────────
 *
 * `requiredSlots` is WR-10's axis, verbatim: a family whose named evidence is absent is
 * skipped rather than rendered with a hole, and every pool carries a SLOTLESS sibling so
 * the degraded receipt is still a real authored sentence.
 *
 * `contexts` is GR-0's own, and it exists because two of this annex's pools are authored
 * ACROSS a fact the receipt actually carries. `treaty_lapsed` variant 5 says "it kept
 * every one of them" — true of a pact that ran its term, a LIE about one the court caught
 * hollow — and `treaty_age_line` carries "Young yet, as treaties go" beside "Old enough
 * that the roads it opened are simply the roads now", which cannot both be honest about
 * the same parchment. HEADLINE HONESTY (the annex's own constraint 2) says every verb must
 * be entailable by the receipt's facts, so each such row DECLARES the contexts it is
 * honest under and the picker filters on them. A row that declares none is honest under
 * all of them. This re-authors nothing: it records which authored sentence belongs to
 * which world, which is a wiring decision and therefore this file's business.
 *
 * ⚠ ONE POOL INVERTS THE PARTY SLOTS, exactly the WW-C hazard. Six of the seven pools bind
 * `{settlement}` to the OBLIGEE (the court owed to — the war victor, the sale's seller) and
 * `{counterpart}` to the OBLIGOR. `treaty_true_state_chip` is authored the other way round:
 * "in fact {settlement} has sent less than it swore … and nobody across the border has
 * weighed it" makes `{settlement}` the party WITHHOLDING. A single global binding would
 * make that chip accuse the wrong court of quiet default — compiling, passing, and exactly
 * backwards. GRAMMAR_SLOT_ROLES is the whole cure and the walker pins the inversion by
 * name. (`hollowed_quiet` inverts the same way and lands with its ground-truth surface;
 * see grammarReceiptPools.js for why its prose is deliberately unwired.)
 *
 * NO FABRICATED BANDS (WR-10's law, inherited). `{band}` is filled only from an authored
 * qualitative token the producer actually holds. The engine records a treaty's AGE, so the
 * lapse eulogy and the age line get their band; it records no count of short seasons, so
 * `treaty_default_detected`'s two "{band} seasons" families are simply ineligible on every
 * real beat rather than being handed an invented ladder.
 *
 * PURE: frozen data, one keyed hash, no store, no Date, no Math.random, no I/O.
 *
 * @enforced-by tests/lint/grammarLifecycleKindPools.walker.test.js
 */

import { hash01 } from '../region/contestMath.js';
import { GRAMMAR_RECEIPTS } from './grammarReceiptPools.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string, significance:'notable'|'routine'|'n/a',
 *   audience:'public'|'dm-only', section:'trade'|null,
 *   pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>,
 *   contexts:ReadonlyArray<readonly string[]|null>}} GrammarRegistryEntry
 */

/**
 * @param {string} kind
 * @param {'notable'|'routine'|'n/a'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'trade'|null} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @param {ReadonlyArray<readonly string[]|null>} [contexts]
 * @returns {Readonly<GrammarRegistryEntry>}
 */
function grammarKindRow(kind, significance, audience, section, requiredSlots, contexts) {
  const pool = /** @type {readonly ProseVariant[]} */ (GRAMMAR_RECEIPTS[kind]);
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool,
    requiredSlots: Object.freeze(requiredSlots.map((slots) => Object.freeze([...slots]))),
    contexts: Object.freeze((contexts || pool.map(() => null))
      .map((row) => (row ? Object.freeze([...row]) : null))),
  });
}

/**
 * GR-0's governed rows. `section` is non-null on the two HERALD kinds only; the clause,
 * ending, dossier and chip pools are rendered INTO another surface and file nowhere of
 * their own (a section for them would claim a desk they never reach).
 * @type {ReadonlyArray<Readonly<GrammarRegistryEntry>>}
 */
export const GRAMMAR_KIND_REGISTRY = Object.freeze([
  grammarKindRow('treaty_lapsed', 'notable', 'public', 'trade', [
    ['settlement', 'counterpart', 'band'], ['term', 'settlement', 'counterpart'],
    ['settlement', 'counterpart'], ['settlement', 'counterpart', 'term'],
    ['band'], ['counterpart', 'term'], [],
  ], [
    null, null, null, null,
    // "…and it kept every one of them" is entailable only where the pact was never
    // caught in default. A hollowed ending drawing this family would be the beat
    // asserting the opposite of the ledger it was minted from.
    ['ran_its_term'],
    null, null,
  ]),
  grammarKindRow('treaty_lapsed.road_open', 'n/a', 'public', null, [
    ['route', 'settlement', 'counterpart'], [], ['settlement'],
    ['settlement', 'counterpart'], [], ['route'], ['settlement', 'counterpart'],
  ]),
  grammarKindRow('treaty_default_detected', 'notable', 'public', 'trade', [
    [], ['settlement', 'counterpart'], ['counterpart'],
    ['counterpart', 'term', 'band', 'settlement'], ['settlement'],
    ['counterpart', 'settlement'], ['band'],
  ]),
  grammarKindRow('treaty_age_line', 'n/a', 'public', null, [
    ['band'], [], ['settlement', 'counterpart'], [], [], [], [], ['counterpart'],
  ], [
    // The age classes each authored line is honest about. Variant 1 speaks the band it
    // is handed and so fits every class; the rest carry an age claim in the prose.
    null, ['old'], ['settled', 'old'], ['settled', 'old'],
    ['young'], ['settled', 'old'], ['old'], ['old'],
  ]),
  grammarKindRow('treaty_true_state_chip', 'n/a', 'dm-only', null, [
    ['term', 'settlement', 'band'], ['settlement', 'counterpart'], ['counterpart'],
    [], [], ['counterpart'], ['settlement'], ['counterpart', 'term'],
  ]),
  grammarKindRow('ran_its_term', 'routine', 'public', null, [
    [], ['term'], ['settlement'], ['settlement', 'counterpart'],
    [], ['settlement'], ['term'], ['counterpart'],
  ]),
  grammarKindRow('hollowed_detected', 'notable', 'public', null, [
    ['term'], ['counterpart', 'settlement'], [], [], [],
    ['term', 'settlement'], ['counterpart', 'settlement'],
  ]),
]);

/** The exact GR-0 governed pool set. */
export const GRAMMAR_KINDS = Object.freeze(GRAMMAR_KIND_REGISTRY.map((row) => row.kind));

/** The two rows that reach the Herald as kinds of their own. */
export const GRAMMAR_HERALD_KINDS = Object.freeze(
  GRAMMAR_KIND_REGISTRY.filter((row) => row.section !== null).map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<GrammarRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<GrammarRegistryEntry>]>} */ (
    GRAMMAR_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * ⚠ THE PER-POOL PARTY BINDING (see the module header). The DM chip is authored from the
 * withholding party's side; every other GR-0 pool is authored from the owed party's.
 * @type {Readonly<Record<string, { settlement:'obligee'|'obligor', counterpart:'obligee'|'obligor' }>>}
 */
export const GRAMMAR_SLOT_ROLES = Object.freeze({
  treaty_true_state_chip: Object.freeze({ settlement: 'obligor', counterpart: 'obligee' }),
});

/** @type {Readonly<{ settlement:'obligee'|'obligor', counterpart:'obligee'|'obligor' }>} */
export const DEFAULT_GRAMMAR_SLOT_ROLES = Object.freeze({ settlement: 'obligee', counterpart: 'obligor' });

/** The binding one pool uses, or the default. @param {string} kind */
export function grammarSlotRoles(kind) {
  return GRAMMAR_SLOT_ROLES[String(kind)] || DEFAULT_GRAMMAR_SLOT_ROLES;
}

/**
 * Resolve one authored GR-0 sentence. Families whose named evidence is absent, and
 * families whose prose is not honest in this context, are ineligible; their slotless and
 * context-free siblings remain honest fallbacks. Null when nothing in the pool qualifies
 * or the kind is unknown — silence, never generic prose.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @param {string|null} [context] an authored context token (a PACT_ENDINGS member, an age class)
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string|null} | null}
 */
export function grammarReceipt(kind, seed, interp = {}, context = null) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => {
      const contexts = row.contexts[templateIndex];
      if (contexts && !contexts.includes(String(context))) return false;
      return row.requiredSlots[templateIndex].every((slot) => (
        typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
      ));
    });
  if (eligible.length === 0) return null;
  // THE KEYED PICK (L1): `hash01` avalanches before the multiply, so the choice does not
  // alias onto a parity class the way a raw `fnv % poolLength` would (the recorded
  // FNV-1a low-bit hazard). Same seed, same world, same sentence — forever.
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed
    ? eligible[Math.min(eligible.length - 1, Math.floor(hash01(namespacedSeed) * eligible.length))]
    : eligible[0];
  const variant = row.pool[templateIndex];
  const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    // SENTENCE CASE AT THE RENDER, and it is not cosmetic. One authored family OPENS with
    // a slot — `treaty_age_line` variant 1 is "{band} years this peace has held." — and a
    // band word is lower case because it also fills mid-sentence. Rendering that template
    // raw puts a lower-case letter at the head of a Herald sentence. The corpus is right
    // and the fill is right; the CASING is the renderer's business, which is why it is
    // normalized here rather than by editing an annex-verbatim pool.
    line: raw.charAt(0).toUpperCase() + raw.slice(1),
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}
