/**
 * institutions/defenseInstitutionBuckets.js — THE ONE DEFENCE PARTITION, and the typed
 * STANDING projection that replaced a grader nobody could see was broken.
 *
 * ── THE DEFECT THIS MODULE EXISTS TO MAKE UNREACHABLE (F2, measured) ─────────────────
 * `defenseStateProse.js` graded a settlement's defences with
 *
 *     function flag(v) { return v === true || (typeof v === 'number' && v > 0); }
 *
 * while its producer, `getDefenseInstitutions`, writes ARRAYS. Executed at the tip before
 * the cure, on a town holding `Massive Walls`, `Inner Citadel` and `Garrison Barracks`:
 *
 *     flag(["Massive Walls","Inner Citadel"])  ->  false     <-- WHAT SHIPPED
 *     flag([])                                 ->  false
 *
 * so a walled, garrisoned town and an empty field produced BYTE-IDENTICAL prose — "The
 * town's plan for an army is to not be interesting to one" — and the Beasts & Monsters
 * row went silent on every settlement in the product. The desk's own suite was 24/24
 * green throughout, because its fixture handed the grader BOOLEANS, a shape the producer
 * has never once returned. ⭐⭐ A FIXTURE THAT HAND-BUILDS A SHAPE THE PRODUCER NEVER
 * RETURNS IS THE SPECIFICATION, AND IT IS LYING.
 *
 * The cure is not a wider `flag`. A shape-agnostic truthiness test grades `{}` and the
 * string `"no"` as defended, which is the same class of wrong one turn later. It is a
 * TYPED, NAMED projection: `standingDefenseForces` answers `present` / `count` / `names`,
 * so a caller CANNOT ask the vague question — there is no vague question left to ask.
 *
 * ── AND WHY CURING THAT READ ALONE WOULD HAVE SHIPPED A CONFIDENT FALSEHOOD (F3) ─────
 * ⭐⭐ THE LAW: WHEN A DEAD READ MASKS A BAD PRODUCER, CURING THE READ ACTIVATES THE
 * PRODUCER'S DEFECT. `getDefenseInstitutions` partitions by NAME KEYWORD ONLY and consults
 * no ruin status, so a calamity-flattened citadel still lands in the `walls` bucket. That
 * was harmless only while `flag()` was false for every array. Teaching the desk to read
 * arrays, and nothing else, would have turned a silence into "the walls are kept up" about
 * a heap of rubble — worse than the silence it replaced.
 *
 * ⛔⛔ AND THE RUIN QUESTION IS DEEPER THAN THE PARTITIONER, measured while curing it.
 * `generateDefenseProfile` has exactly ONE caller — `steps/assembleSettlement.js` — so
 * `defenseProfile.institutions` is a GENERATION-TIME SNAPSHOT that is never rebuilt. Every
 * ruin path (calamityKernel, institutionLifecycle, tierOutcomeApply,
 * settlementLifecycleFirstClass, magicRegimeLifecycle) stamps its row IMMUTABLY —
 * `{ ...inst, status: 'ruined', _worldPulseInactive: true }` — replacing the object in
 * `settlement.institutions` rather than mutating it. The buckets therefore hold the
 * PRE-RUIN objects by reference, and the ruin stamp can never reach them. ⇒ Filtering
 * inside the generator would have been a NO-OP against the live hazard: at generation
 * nothing is ruined yet, and after generation the buckets are unreachable.
 *
 * So the truth-telling consumer must re-derive from the LIVE roster, which is what
 * `standingDefenseForces` does — `liveInstitutions(settlement)` first, partition second.
 * The generator keeps its snapshot semantics unchanged (byte-identical output, no golden
 * movement, the force cards on DefenseTab still list what the town built), and it now
 * delegates its partition HERE so the keyword table has ONE writer instead of two copies
 * free to drift.
 *
 * ── WHY THIS FILE SITS IN src/domain/institutions/ ───────────────────────────────────
 * The old partitioner lived in `src/generators/`, OUTSIDE the `src/domain` scan root of
 * `tests/lint/ruinFilterRoster.walker.test.js` — so no arm of the estate's own ruin-filter
 * ratchet could reach the one function whose ruin-blindness mattered. A producer outside
 * every scan root is a HABITAT, not an oversight. Moving the partition here puts it inside
 * the walker's reach: this file routes its roster read through the canonical accessor, so
 * it is compliant by construction, and a later hand that re-spells a raw `.institutions`
 * read in here enrols it and owes the walker a disposition.
 *
 * PURE, HEADLESS: no state, no clock, no RNG, no store. Every projection is frozen.
 *
 * @enforced-by tests/domain/defenseStateProseDesk.test.js
 */
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from './institutionRoster.js';

/**
 * THE KEYWORD TABLE — the single writer. Moved VERBATIM from `defenseGenerator.js`'s
 * `getDefenseInstitutions` so the generator's output is unchanged to the byte; the key
 * ORDER is load-bearing for the same reason, being the property order of a persisted
 * object the golden master compares.
 *
 * ⚠ These are SUBSTRING matches over the institution's native semantic name, which is
 * why several entries look redundant ('inner citadel' under a table that already carries
 * 'citadel'): they document the catalogue rows the bucket was written for. Left as they
 * were rather than minimised — a "tidy" that changed one match is a defence changing
 * hands in silence.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const DEFENSE_BUCKET_KEYWORDS = Object.freeze({
  walls: Object.freeze([
    'wall', 'citadel', 'palisade', 'earthwork',
    'inner citadel', 'massive walls',
  ]),
  garrison: Object.freeze([
    'garrison', 'barracks', 'professional guard',
    'professional city watch', 'multiple garrison',
  ]),
  militia: Object.freeze([
    'citizen militia', 'militia',
  ]),
  watch: Object.freeze([
    'town watch', 'city watch', 'professional city watch',
  ]),
  mercenary: Object.freeze([
    'mercenary company', 'mercenary quarter', 'hired muscle',
  ]),
  charter: Object.freeze([
    "adventurers' charter hall", "adventurers' guild hall",
    "multiple adventurers'",
  ]),
  magicDef: Object.freeze([
    'wizard', "mages' guild", 'mage', 'academy of magic',
    'golem workforce', 'alchemist',
  ]),
});

/**
 * Every bucket this module partitions into, exported so a consumer can be TOTAL over the
 * vocabulary without re-spelling it (the label-trap rule, applied to bucket names).
 * @type {ReadonlyArray<string>}
 */
export const DEFENSE_BUCKET_KEYS = Object.freeze(Object.keys(DEFENSE_BUCKET_KEYWORDS));

/**
 * Partition an institution list into the defence buckets. RUIN-BLIND BY CONTRACT: it
 * classifies whatever list it is handed and takes no view on whether those buildings still
 * stand. The caller chooses the roster, and that is the honest split — the generator wants
 * the roster as built, the desk wants the roster as it stands today.
 *
 * ⚠ THE MEMBER TYPE IS `unknown` ON PURPOSE, and it is the accurate width rather than a
 * placeholder. This module asks an institution exactly ONE question — `nativeSemanticName`,
 * which itself takes `unknown` — so there is nothing narrower to honestly claim. `any[]` said
 * the opposite: it told every caller that any field it cared to name was there and correctly
 * typed, which is how a bucket member gets read for a property nothing writes. Under
 * `unknown` a caller must prove a field before reading it, which is the whole point.
 *
 * @param {unknown} institutions the roster to classify
 * @returns {Record<string, unknown[]>} one array per bucket, in DEFENSE_BUCKET_KEYS order
 */
export function partitionDefenseInstitutions(institutions) {
  const list = Array.isArray(institutions) ? institutions : [];
  /** @param {unknown} inst @param {ReadonlyArray<string>} keywords */
  const matches = (inst, keywords) =>
    keywords.some((kw) => nativeSemanticName(inst).toLowerCase().includes(kw));
  /** @type {Record<string, unknown[]>} */
  const buckets = {};
  for (const bucket of DEFENSE_BUCKET_KEYS) {
    buckets[bucket] = list.filter((inst) => matches(inst, DEFENSE_BUCKET_KEYWORDS[bucket]));
  }
  return buckets;
}

/**
 * One bucket's standing reading.
 * @typedef {object} StandingForce
 * @property {boolean} present whether the town has at least one STANDING member
 * @property {number} count how many stand
 * @property {ReadonlyArray<string>} names their names, for a surface that lists them
 */

/**
 * ⭐ THE TYPED PROJECTION — what a settlement can actually field TODAY.
 *
 * Total over `DEFENSE_BUCKET_KEYS`: every bucket is present on the result, so a consumer
 * can never read `undefined` off a typo'd key and coerce it to "undefended". Frozen, so a
 * surface cannot edit the reading it was handed.
 *
 * It reads `liveInstitutions(settlement)` — the settlement's CURRENT roster, ruin-filtered
 * through the canonical accessor — and never `defenseProfile.institutions`, which is the
 * generation-time snapshot the ruin stamp cannot reach (see the header).
 *
 * @param {{ institutions?: unknown } | null | undefined} settlement
 * @returns {Readonly<Record<string, StandingForce>>}
 */
export function standingDefenseForces(settlement) {
  const buckets = partitionDefenseInstitutions(liveInstitutions(settlement));
  /** @type {Record<string, StandingForce>} */
  const out = {};
  for (const bucket of DEFENSE_BUCKET_KEYS) {
    const members = buckets[bucket];
    out[bucket] = Object.freeze({
      present: members.length > 0,
      count: members.length,
      names: Object.freeze(members.map((inst) => nativeSemanticName(inst))),
    });
  }
  return Object.freeze(out);
}
