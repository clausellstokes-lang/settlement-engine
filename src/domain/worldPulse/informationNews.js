/**
 * informationNews.js — THE FP-INFORMATION GOVERNED READER REGISTRY (IN-1c-a's slice).
 *
 * The WW-C split, copied deliberately from GR-0: `informationReceiptPools.js` holds the
 * authored corpus, THIS file holds the registry rows, the eligibility declaration and the
 * seeded picker, and `src/domain/display/neighbourMirror.js` holds the read-model that joins
 * an already-earned typed fact to the authored sentences. Nothing here decides that a court
 * was shown anything; it only voices a record the mirror leaf already derived.
 *
 * THE ESTATE'S FIFTH PHRASED-KIND REGISTRY FAMILY, and its first row is a DOSSIER LINE.
 *
 * ── WHY THE ONE ROW FILES NO DESK ─────────────────────────────────────────────────
 *
 * `mirror_standing_line` renders INTO the town page's own standing-line block, under the
 * heading the read-model owns. It reaches no Herald desk, so `section` is null — and that is
 * a derivation rather than a preference, on the landed `treaty_age_line` and
 * `succession_question_open` precedents. A `section` here would claim a desk the kind never
 * reaches; a reader-phrase row would be vocabulary with no address; an `EXACT_SECTION` row
 * would route a token nothing files. ⇒ this row registers WITHOUT routing, which is exactly
 * what raises the estate-wide registered-minus-routed honesty check by one.
 *
 * THE KNOWLEDGE DESK EXISTS SINCE FP IN-5. The IN corpus files most of its beats at the Herald's
 * knowledge desk, the seventh section IN-5 minted; the interim `war` desk IN-2 declared for the
 * routed rows below was re-filed there in IN-5's desk commit. This one row still files no desk,
 * because a dossier line reaches none, and that derivation is unchanged by the desk's arrival.
 *
 * ── ⚠ THE PARTY BINDING, AND WHY THIS FAMILY HAS NO ROLE TABLE ────────────────────
 *
 * GR-0 needs `GRAMMAR_SLOT_ROLES` because its pools bind two courts across an obligation axis
 * and one pool inverts it. This corpus has ONE party: `{counterpart}` is always the court
 * being spoken about, and the speaking court is never named in the sentence at all — the
 * whole block is our own bookkeeping of our own disclosures. There is no axis to invert, so
 * a role table here would be machinery with nothing to decide.
 *
 * ── ⭐⭐ THE KEYED PICK IS THE CURED SPELLING, AND THE DIVERGENCE IS DOCKETED ───────
 *
 * The estate holds TEN seeded-pick call sites in TWO spellings. NINE of them —
 * `eventProse.js` (seven), `commercialReasonsNews.js` and `sovereigntyNews.js` — index with
 * `fnv1a32(namespacedSeed) % eligible.length`, which aliases onto a parity class through the
 * recorded FNV-1a low-bit hazard. The tenth, `grammarNews.js`, avalanches first and documents
 * the cure in its own comment. THIS FILE COPIES THE CURED ONE, VERBATIM.
 *
 * ⛔ It repairs none of the nine. That is a cross-family refactor across four landed
 * registries and is a STOP for any single wave; the divergence is docketed as `CR-IN1C-DRIFT`
 * to the machinery queue (OWNER_DECISION_QUEUE.md §55, Q4) and nothing walks it today.
 *
 * PURE: frozen data, one keyed hash, no store, no Date, no Math.random, no I/O.
 *
 * @enforced-by tests/lint/informationKindPools.walker.test.js
 */

import { hash01 } from '../region/contestMath.js';
import { INFORMATION_RECEIPTS } from './informationReceiptPools.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string, significance:'notable'|'routine'|'major'|'n/a',
 *   audience:'public'|'dm-only', section:string|null,
 *   pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>,
 *   contexts:ReadonlyArray<readonly string[]|null>}}
 *   InformationRegistryEntry
 */

/**
 * ⛔⛔ THE PARAMETER ORDER IS `grammarNews.js#grammarKindRow`'s, AND IT IS LOAD-BEARING:
 * `(kind, significance, audience, section, requiredSlots, …)`. A family that re-orders its row
 * constructor is a family whose rows cannot be read across the estate by eye.
 *
 * ⭐ POSITION SIX IS OCCUPIED SINCE FP IN-4, WITH ITS OWN DRIVING CASE, exactly as the paragraph
 * below reserved it: the race pools speak of a MAN ("He reached the gate before his story did"),
 * and a marching column races its story too. Each race variant declares the racer contexts it is
 * honest under (`reputationRaceConsumer.js :: RACER_CONTEXTS`), a row that declares none is honest
 * under all of them, and the picker filters on the caller's context: GR-0's axis, copied.
 * ⚠ (history) POSITION SIX — GR-0's `contexts` axis — WAS DELIBERATELY UNOCCUPIED rather than accepted
 * and ignored. GR-0 needs it because two of its pools are authored ACROSS a fact the receipt
 * carries, so a family that declares no contexts is honest under all of them. This corpus
 * authors no such split: every one of the nine standing sentences is honest about any record
 * the mirror can derive. Taking the parameter and never consulting it would be a branch no
 * producer can reach — the dead-arm class — and storing a table nobody reads would be worse.
 * The first INFORMATION row that genuinely needs a context axis lands the filter WITH its own
 * driving case, at this same position.
 *
 * @param {string} kind
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @param {'public'|'dm-only'} audience
 * @param {string|null} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @param {ReadonlyArray<readonly string[]|null>} [contexts]
 * @returns {Readonly<InformationRegistryEntry>}
 */
function informationKindRow(kind, significance, audience, section, requiredSlots, contexts) {
  const pool = /** @type {readonly ProseVariant[]} */ (INFORMATION_RECEIPTS[kind]);
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

/** The racer context a sentence that speaks of a man is honest under. */
const PERSON_ONLY = Object.freeze(['person']);

/**
 * The governed rows. TWO since FP IN-2 (`lure_sprung`, the lure's DM-truth spring, is the first
 * ROUTED information beat and carries the interim desk declaration below); FOUR since FP IN-3
 * (`false_accusation` and `sweep_launched`, the counter-game's two public beats). IN-1's singular was a
 * measurement rather than a stage of construction: `mirror_shift`'s strength arm is inexpressible at this base (the collector
 * applies no seeded-tick filter to plants, so an earlier tick returns the present answer
 * wearing a past clock) and `mirror_confidence_degraded` has no honest producer at all (the
 * collector reads the arrival tick and throws it away). ⛔ A registry row without an honest
 * producer is a chartered orphan; both re-file behind their own chair charter (CR-IN1C-3).
 *
 * `requiredSlots` is WR-10's axis, verbatim: a variant whose named evidence is absent is
 * skipped rather than rendered with a hole, and the pool carries FOUR slotless siblings so a
 * degraded receipt is still a real authored sentence. The array is parallel to the pool and
 * the arity equality is a pinned join, not a formality — a length mismatch mints the
 * `slot-arity` reason in the shared walker template and reds.
 *
 * ⚠ THE `{season}` SLOT HAS NO SUPPLIER AT THIS BASE (CR-IN1C-2), so variants 2 and 7 are
 * declared unreachable and the walker pins the eligible set at seven WITH the control that a
 * supplied season yields nine. The declaration lives with the corpus, in
 * `informationReceiptPools.js`; the arity below is what makes it true.
 *
 * @type {ReadonlyArray<Readonly<InformationRegistryEntry>>}
 */
export const INFORMATION_KIND_REGISTRY = Object.freeze([
  // IN-3 THE COUNTER-GAME: the witch-hunt's receipt, the annex's `sweep_witch_hunt` block (the
  // kind the volume names `false_accusation`). PUBLIC: the town remembers whose name it was. It
  // filed at the interim desk IN-2 declared (`war`) until FP IN-5 minted the knowledge desk,
  // where it files now (the annex's own desk). Codepoint-sorted (SR-7).
  informationKindRow('false_accusation', 'notable', 'public', 'knowledge', [
    ['settlement'], ['npc'], ['npc'], ['npc'], ['settlement'], [],
  ]),
  // IN-2 THE LURE. The interim desk `war` was declared by the first wave that minted a routed
  // information beat (this file's header reserved the declaration for it); FP IN-5 minted the
  // knowledge desk and the lure files there now, as the annex heads its block. DM truth, so
  // `dm-only` (the producer sets `covert` fail-closed). Codepoint-sorted insertion (SR-7).
  informationKindRow('lure_sprung', 'notable', 'dm-only', 'knowledge', [
    [], ['faction', 'route', 'counterpart', 'house'], ['settlement'], ['counterpart', 'faction'], [], ['settlement', 'season'],
  ]),
  informationKindRow('mirror_standing_line', 'routine', 'public', null, [
    [], ['counterpart', 'band', 'season'], ['band'], ['counterpart'], ['band'],
    [], ['counterpart', 'season'], [], [],
  ]),
  // IN-4 THE ROAD: the three race kinds (the built RACE_OUTCOMES tokens, `neither` silent by law)
  // and the jewel. PUBLIC, the rumor mill's beats, filed at `events` beside the envoy comings and
  // goings the race reads (envoy_home's desk) until IN-5 mints the knowledge desk. Every sentence
  // that speaks of a man is honest for a PERSON racer only (the context axis above).
  // Codepoint-sorted insertion (SR-7).
  informationKindRow('race_person', 'notable', 'public', 'events', [
    [], ['npc', 'settlement', 'counterpart'], ['settlement'], [], ['route'], ['settlement'],
  ], [PERSON_ONLY, PERSON_ONLY, PERSON_ONLY, PERSON_ONLY, PERSON_ONLY, PERSON_ONLY]),
  informationKindRow('race_story', 'notable', 'public', 'events', [
    [], ['settlement', 'counterpart', 'npc'], ['settlement'], [], [], ['season', 'band', 'settlement'],
  ], [PERSON_ONLY, PERSON_ONLY, PERSON_ONLY, PERSON_ONLY, null, PERSON_ONLY]),
  informationKindRow('race_together', 'routine', 'public', 'events', [
    ['npc', 'counterpart', 'settlement'], [], ['settlement'], [], [], ['settlement'], ['settlement'], [], [],
  ], [PERSON_ONLY, PERSON_ONLY, null, PERSON_ONLY, null, null, null, PERSON_ONLY, PERSON_ONLY]),
  // IN-3 THE SWEEP HUM, the annex's `sweep_launched` block: the line a sweep that found nothing
  // leaves in the town (a catch speaks through the built beat, a witch-hunt through the row
  // above). Public, routine, at the knowledge desk since FP IN-5. Codepoint-sorted (SR-7).
  informationKindRow('sweep_launched', 'routine', 'public', 'knowledge', [
    ['settlement'], ['faction', 'settlement'], ['reason'], ['settlement'], ['settlement'],
    ['settlement'], ['settlement'], [], [],
  ]),
  informationKindRow('word_came_too_late', 'notable', 'public', 'events', [
    ['npc', 'settlement'], ['counterpart'], ['settlement'], ['reason'], [], [],
  ]),
]);

/** The exact governed pool set. */
export const INFORMATION_KINDS = Object.freeze(INFORMATION_KIND_REGISTRY.map((row) => row.kind));

/** @type {ReadonlyMap<string, Readonly<InformationRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<InformationRegistryEntry>]>} */ (
    INFORMATION_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one authored INFORMATION sentence. Variants whose named evidence is absent are
 * ineligible; their slotless siblings remain honest fallbacks. Null when nothing in the pool
 * qualifies or the kind is unknown — silence, never generic prose, and the read-model turns
 * that null into the landed hand-composed sentence rather than into a blank line.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @param {string|null} [context] the racer context a row's declared contexts filter on (IN-4)
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string|null} | null}
 */
export function informationReceipt(kind, seed, interp = {}, context = null) {
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
  // THE KEYED PICK, copied from `grammarNews.js` and cured for the same recorded reason:
  // `hash01` avalanches before the multiply, so the choice does not alias onto a parity class
  // the way a raw `fnv % poolLength` would. Same seed, same world, same sentence — forever.
  // ⛔ Nine sibling call sites still carry the uncured spelling; repairing them is
  // `CR-IN1C-DRIFT`'s and not this file's.
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed
    ? eligible[Math.min(eligible.length - 1, Math.floor(hash01(namespacedSeed) * eligible.length))]
    : eligible[0];
  const variant = row.pool[templateIndex];
  const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    // SENTENCE CASE AT THE RENDER, on GR-0's recorded reason. An authored family may open with
    // a slot whose fill is lower case because it also fills mid-sentence; rendering that
    // template raw would put a lower-case letter at the head of a rendered sentence. The
    // corpus is right and the fill is right, so the CASING is the renderer's business and is
    // normalized here rather than by editing an annex-verbatim pool.
    line: raw.charAt(0).toUpperCase() + raw.slice(1),
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}
