/**
 * domain/display/stateProse/powerStateProse.js — DESK CAR 2: THE POWER DESK.
 *
 * The second desk, and the first one written against a leaf that inherits none of the
 * three shape residues §0c-4 records. Two corpus blocks, two rendered surfaces:
 *
 *   DS-POW-1  Power › Public legitimacy banner — `powerStructure.publicLegitimacy`
 *   DS-POW-2  Power › Stability + governing authority header —
 *             `powerStructure.{stability, governingName, factions[], recentConflict}`
 *   DS-POW-6  Power › the criminal underside — `governanceLedger(settlement)` +
 *             `powerStructure.criminalCaptureState` + `safetyProfile.criminalInstitutions`
 *
 * ── WHY THIS LEAF, AND WHY THIS BLOCK FIRST ──────────────────────────────────────────
 *
 * `power` is the only wholly dark leaf with NO sentence-initial lowercase seam, NO
 * `{band}` variant use and NO demoted STATE dimension, measured over all 79 of its pools.
 * Every slot its blocks name is `proper` in the annex register — and a `proper` fill is
 * the one class `bareCommonFill` does not refuse — so the `{complexity}` failure mode
 * that leaves the economy desk's C1 pool at one eligible variant CANNOT arise here. The
 * desk that proves the second-desk shape should be the one paying no residue.
 *
 * ── WHAT A DESK IS RESPONSIBLE FOR (unchanged from the reference desk) ───────────────
 *
 * A desk maps LIVE STATE to a POOL KEY, and nothing else. It does not select prose (the
 * kernel draws), it does not compose sections (the panel does), and it never re-derives a
 * number a canonical reader already owns. `publicLegitimacy` arrives here as the
 * generator built it; this file reads its `label`, its `breakdown` and its
 * `governanceFractured` flag and turns them into pool keys.
 *
 * ── ELEVEN POOLS, THREE LENSES, ONE POSITION — AND WHY ALL ELEVEN CAN FIRE ───────────
 *
 * DS-POW-1's eleven pools are not eleven mutually exclusive states. They are THREE
 * LENSES over one record:
 *
 *   LENS A — the band ladder (5 pools). `Endorsed` · `Approved` · `Tolerated` ·
 *            `Contested` · `Legitimacy Crisis`. Mutually exclusive, total over the score.
 *   LENS B — the breakdown dominance (5 pools). Which of the four contributions is
 *            carrying the score, and in which direction.
 *   LENS C — `governanceFractured true` (1 pool). The governing body's internal cohesion.
 *
 * A block speaks at ONE POSITION per page-set (dossierMounts.js's C3 law), and that law
 * is spelled about RUNGS rather than draws precisely so that one position may read more
 * than one pool of one block — the DS-GEN-6 tier overlay is the same shape. So the banner
 * draws LENS A as its headline and ONE OF LENS B/C as the reading underneath it, at one
 * position, at one depth. That is one fact reading once, not one fact speaking twice.
 *
 * ⚠ THE ORDERING OF LENS C AHEAD OF LENS B IS LOAD-BEARING, AND THE REVERSE WOULD KILL A
 * POOL. `legitimacyBandFor` sets `governanceFractured: score < 30` and sets the label to
 * `Legitimacy Crisis` on the same predicate, so the two are COEXTENSIVE at the producer.
 * Had the lens preferred the breakdown, `governanceFractured true` would be reachable only
 * on a state the generator cannot build, and the pool would be lit-but-unfireable — a
 * dark world and a lit-but-incapable world are byte-identical to every test that does not
 * assert a rendered sentence. Ordering C first makes the crisis band print the ladder line
 * AND the fracture line, and leaves LENS B to the eleven-in-twenty worlds above the
 * threshold. Every one of the eleven pools is reachable from a state the generator
 * produces, and the desk test drives each one.
 *
 * ── THE DELIBERATE SILENCE, WHICH IS NOT A GAP ───────────────────────────────────────
 * A breakdown whose dominant contribution is FAVOURABLE and is not prosperity has NO
 * pool: the corpus writes a favourable lens for prosperity alone. This desk returns null
 * for that state rather than falling back to the prosperity line, because the fallback
 * would state something false about the town — safety, defense and food all reach
 * positive contributions, so the state is real and reachable. R-DST-K: the absence of a
 * sentence is the correct rendering of a state the corpus does not cover.
 *
 * ── §0d, THE DIGIT BAN ───────────────────────────────────────────────────────────────
 * The banner keeps its `score/100` datum; the prose bands the same fact. Nothing this
 * desk puts in a slot is ever a figure, and the kernel rejects a numeric fill outright.
 *
 * @enforced-by tests/domain/powerStateProseDesk.test.js
 */
import { DOSSIER_STATE_PROSE_POWER } from '../../../data/dossierStateProse/power.generated.js';
import { criminalOpEcon } from '../../criminalOpRole.js';
import { governanceLedger } from '../../governanceLedger.js';
import { readStateProse } from './stateProseKernel.js';
import { legibilityRung } from './legibilityRung.js';

/**
 * The desk's corpus, typed at the import boundary. The generated leaves stay PURE DATA
 * with no import of any kind — including a JSDoc type import, which would couple
 * src/data to a domain module path — so the shape assertion lives here, once.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_POWER)
);

/**
 * The narrow slice of a settlement this desk reads. Declared rather than cast: a desk
 * which types its input `any` has given up the one check that would catch a renamed
 * field, and every field below is a real read.
 * @typedef {object} LegitimacyBreakdownView
 * @property {unknown} [prosperity]
 * @property {unknown} [safety]
 * @property {unknown} [defense]
 * @property {unknown} [food]
 */
/**
 * `publicLegitimacy` is canonically an object. It is ALSO legacy-numeric on old saves —
 * governanceLedger.js:42 says so and carries the same caveat — and a number has no label,
 * no breakdown and no flag, so this desk reads nothing from it and renders nothing. That
 * is the honest outcome: a save that predates the record cannot be narrated by it.
 * @typedef {object} PublicLegitimacyView
 * @property {unknown} [score]
 * @property {unknown} [label]
 * @property {LegitimacyBreakdownView|null} [breakdown]
 * @property {unknown} [governanceFractured]
 */
/**
 * @typedef {object} RulingFactionView
 * @property {unknown} [faction]
 * @property {unknown} [isGoverning]
 * @property {unknown} [power]
 */
/**
 * @typedef {object} PowerStructureView
 * @property {PublicLegitimacyView|number|null} [publicLegitimacy]
 * @property {unknown} [governingName]
 * @property {unknown} [stability]
 * @property {unknown} [recentConflict]
 * @property {ReadonlyArray<RulingFactionView>|null} [factions]
 * @property {unknown} [criminalCaptureState]
 */
/**
 * @typedef {object} PowerDeskSettlement
 * @property {string} [name]
 * @property {PowerStructureView|null} [powerStructure]
 * @property {{safetyProfile?: {criminalInstitutions?: unknown}|null}|null} [economicState]
 */

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column.
 *
 * The ANNEX is the authority and this is a checked mirror, not a second home: the
 * projection contract test asserts this map equals the register parsed out of the
 * annexes, slot for slot, so a desk that drifts from the corpus reds rather than
 * rendering. Both slots below are the ones DS-POW-1's variants actually name — 38 of its
 * 41 variants name `{seat}` and all 41 name `{settlement}`.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper',
  seat: 'proper',
});

/**
 * Every LITERAL fill table this desk owns, by the slot it fills. THIS DESK OWNS NONE, and
 * the empty object is the honest declaration rather than an omission: both its slots take
 * a generated NAME, not a table-mapped enum. The guard walks this directory and refuses an
 * exported string map that is not declared here, so declaring the emptiness is what keeps
 * a future table from arriving unchecked.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/**
 * A `proper` fill, or `undefined` — the desk's own half of the shape contract.
 *
 * The rules mirror `fillShapeViolation`'s PROPER branch in
 * scripts/lib/dossier-slot-shapes.mjs: a name must be capitalised, and must not carry a
 * gloss dash, a sentence break, a digit or a raw snake_case engine token. `governingName`
 * is a generated faction name and conforms in every world measured, but it is also the
 * field a future transfer-of-power path writes, so the refusal is kept rather than
 * assumed away. Refusing yields SILENCE for the 38 variants that name `{seat}`, and the
 * three that name only `{settlement}` still speak — the kernel's anchored liveness
 * degrading a pool exactly as designed, instead of printing a token at a reader.
 * @param {string} value
 * @returns {string|undefined}
 */
function properFill(value) {
  if (!value) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * LENS A. The band ladder's pool key — the producer's own label, unmapped.
 *
 * There is deliberately NO translation table here. `legitimacyBandFor` in
 * src/generators/factionDynamics.js emits exactly `Endorsed` · `Approved` · `Tolerated` ·
 * `Contested` · `Legitimacy Crisis`, and DS-POW-1's five ladder pools are keyed by those
 * same five strings byte for byte. A map would be a second spelling of an identity, and
 * the identity is the thing worth asserting — so the desk test asserts the producer's
 * vocabulary equals the corpus's rather than trusting a table to bridge them.
 *
 * An unrecognised label renders NOTHING rather than falling into a band: a spelling this
 * desk does not know is a producer change, and guessing which band it meant is how a page
 * states something false.
 * @param {unknown} label
 * @returns {string|null}
 */
export function legitimacyBandPoolKey(label) {
  const key = text(label);
  if (!key) return null;
  return CORPUS['DS-POW-1'].pools[key] ? key : null;
}

/**
 * The four contributions, in the corpus's own pool-key spelling. The keys are the
 * `breakdown` record's field names and the values are the words the pool keys use, so the
 * join is written once here instead of five times in a conditional chain.
 * @type {Readonly<Record<string, string>>}
 */
const BREAKDOWN_WORD = Object.freeze({
  prosperity: 'PROSPERITY',
  safety: 'SAFETY',
  defense: 'DEFENSE',
  food: 'FOOD',
});

/** @param {unknown} value @returns {number} */
function contribution(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * LENS B and LENS C. The reading UNDERNEATH the ladder line, or null.
 *
 * LENS C first, and the docblock above says why at length: the fracture flag and the
 * crisis band are coextensive at the producer, so preferring the breakdown here would
 * make `governanceFractured true` unreachable in every world the generator can build.
 *
 * Then the dominant contribution, by absolute magnitude. Ties break in the declared order
 * of BREAKDOWN_WORD (prosperity, safety, defense, food) — a stable order rather than
 * whichever key an object literal happened to yield first, because a tie that resolved by
 * iteration order would make the same state read differently after an unrelated edit.
 *
 * A dominant contribution of ZERO is no dominance at all: a town whose four contributions
 * are all zero is the neutral middle, the ladder line already says so, and there is no
 * second reading to add.
 * @param {PublicLegitimacyView} legitimacy
 * @returns {string|null}
 */
export function legitimacyLensPoolKey(legitimacy) {
  if (legitimacy?.governanceFractured === true) return 'governanceFractured true';
  const breakdown = legitimacy?.breakdown;
  if (!breakdown) return null;
  /** @type {{field: string, value: number}|null} */
  let top = null;
  for (const field of Object.keys(BREAKDOWN_WORD)) {
    const value = contribution(breakdown[/** @type {keyof LegitimacyBreakdownView} */ (field)]);
    if (top === null || Math.abs(value) > Math.abs(top.value)) top = { field, value };
  }
  if (top === null || top.value === 0) return null;
  const word = BREAKDOWN_WORD[top.field];
  if (top.value < 0) return `breakdown dominated by ${word}, adverse`;
  // THE DELIBERATE SILENCE. Only prosperity has a favourable lens in the corpus, and
  // safety, defense and food all reach positive contributions, so this branch is a state
  // the generator really produces. Silence beats the prosperity line, which would be false.
  return top.field === 'prosperity' ? `breakdown dominated by ${word}, favourable` : null;
}

/**
 * ── DS-POW-2, THE STABILITY LADDER ───────────────────────────────────────────────────
 *
 * ⚠ THE CANONICAL READER IS TOO COARSE FOR THIS CORPUS, AND SAYING SO IS THE POINT.
 * `simulationSpine.js`'s STABILITY_ARC collapses the label into THREE arcs — crisis, test,
 * continuity — and `crisis` conflates `critical`, `siege` and `desperate`, which DS-POW-2
 * writes as THREE SEPARATE POOLS. Reading the pool key off `likelyFutureFacts` would
 * therefore leave two of them unreachable in every world, which is the lit-but-incapable
 * failure. So this ladder REFINES the canonical one rather than forking it, and the desk
 * test pins every token to the canonical arc that contains it — a drift between the two
 * reds instead of quietly disagreeing about a settlement.
 *
 * ⛔ MATCHED ON THE LABEL'S FIRST WORD, NEVER ON A SUBSTRING, AND THIS IS A BUG FIX RATHER
 * THAN A STYLE CHOICE. The producer emits `Fractured — no stable governing authority`.
 * A substring test for `stable` MATCHES IT, and would print "The hall is settled" about a
 * settlement that has no governing authority at all — a false statement about the world,
 * which is the one outcome this subsystem exists to refuse. Every label the producer can
 * emit leads with its classifier word (`governanceNarrative.js`: Stable · Unstable ·
 * Volatile · Critical · Desperate · Fractured · Shaken · Tense · Anxious · Suppressed ·
 * Ordered · Rigid · Fragile · Strained · Vulnerable), so the first word IS the classifier
 * and reading it is both correct and cheaper.
 * ⚠ THE SAME SUBSTRING DEFECT IS LIVE IN `likelyFutureFacts` ITSELF, which reports
 * `continuity` for that Fractured label. That is a defect in a shipped canonical reader,
 * it is NOT this desk's to fix (the cure changes narrative output on lit surfaces for
 * existing worlds), and it is raised for the chair rather than patched here.
 *
 * ⚠ `siege matched` IS CHECKED BEFORE THE FIRST WORD, and it costs a pool. The only label
 * carrying either token is `Critical (active siege — survival priority)`, so exactly one of
 * `siege matched` / `critical matched` can ever fire. The siege prose ("the walls have
 * settled it") is written for precisely that state and the critical prose is the general
 * case, so most-specific-wins takes siege — the same rule DS-POW-1's lens uses.
 * ⇒ `critical matched` HAS NO PRODUCER TODAY. It is mounted and unreachable, declared here
 * rather than left to be re-found, and PINNED by the desk test so that a producer which
 * later emits a critical-without-siege stability REDS and someone lights the pool.
 * @type {ReadonlyArray<[string, string]>}
 */
const STABILITY_LADDER = Object.freeze([
  ['stable', 'stable matched'],
  ['unstable', 'unstable matched'],
  ['volatile', 'unstable matched'],
  ['critical', 'critical matched'],
  ['desperate', 'Desperate matched'],
]);

/** The floor: a label the corpus wrote no token for still gets a plain description. */
const STABILITY_FLOOR = 'no token matched: unclassified (the plain-description floor)';

/**
 * DS-POW-2's headline pool key. Never null: every label lands somewhere, and an absent
 * label is the only silence.
 * @param {unknown} stability
 * @returns {string|null}
 */
export function stabilityPoolKey(stability) {
  const label = text(stability);
  if (!label) return null;
  const lower = label.toLowerCase();
  if (/\bsiege\b/.test(lower)) return 'siege matched';
  const first = lower.split(/[^a-z]+/).filter(Boolean)[0] || '';
  const hit = STABILITY_LADDER.find(([token]) => token === first);
  return hit ? hit[1] : STABILITY_FLOOR;
}

/**
 * DS-POW-2's share lens. DOMINANT is the corpus's own phrasing made arithmetic — "it
 * outweighs everything else in the town put together" is literally `governing > rest`.
 *
 * JUDGMENT (vetoable): NARROW is a runner-up within 15% of the governing faction's power.
 * The annex says "by the smallest margin the town has" and "first and not because it is
 * large" and leaves the cut to the implementer. A share between the two bands renders
 * NOTHING rather than being rounded into one, because the middle is the ordinary case and
 * the corpus wrote no sentence for it. Say "veto" to move it.
 * @param {ReadonlyArray<{faction?: unknown, isGoverning?: unknown, power?: unknown}>|null|undefined} factions
 * @returns {string|null}
 */
export function governingSharePoolKey(factions) {
  if (!Array.isArray(factions) || factions.length === 0) return null;
  const scored = factions
    .map((f) => ({ governing: Boolean(f?.isGoverning), power: contribution(f?.power) }))
    .filter((f) => f.power > 0);
  const governing = scored.find((f) => f.governing);
  if (!governing) return null;
  const others = scored.filter((f) => f !== governing);
  const rest = others.reduce((sum, f) => sum + f.power, 0);
  if (governing.power > rest) return 'governing faction holds a DOMINANT share';
  const runnerUp = others.reduce((top, f) => (f.power > top ? f.power : top), 0);
  // Not the largest at all ⇒ it does not hold a plurality, and neither pool is true.
  if (runnerUp > governing.power) return null;
  return governing.power - runnerUp <= governing.power * NARROW_MARGIN
    ? 'governing faction holds a NARROW plurality'
    : null;
}

/** See governingSharePoolKey. A vetoable cut, not a measured constant. */
const NARROW_MARGIN = 0.15;

/**
 * DS-POW-2's lens, underneath the stability line. RECENT CONFLICT FIRST, and for the same
 * reachability reason DS-POW-1's lens orders itself: the share is determinate for almost
 * every generated town, so preferring it would leave `recentConflict present` reachable
 * only on the rare town with no computable share. Ordering the conflict first makes both
 * pools ordinary — a town with a recent quarrel tells that story, and every other town
 * tells the share story.
 * @param {unknown} recentConflict
 * @param {ReadonlyArray<{faction?: unknown, isGoverning?: unknown, power?: unknown}>|null|undefined} factions
 * @returns {string|null}
 */
export function stabilityLensPoolKey(recentConflict, factions) {
  if (text(recentConflict)) return 'recentConflict present';
  return governingSharePoolKey(factions);
}

/**
 * ── DS-POW-6, THE CRIMINAL UNDERSIDE ─────────────────────────────────────────────────
 *
 * Thirteen pools in THREE lenses, and this block is the complement of DS-POW-1 rather than
 * a second opinion about it: where DS-POW-1 narrates the legitimacy reading that EXISTS,
 * DS-POW-6 owns the two cells where there is no reading to narrate, plus the criminal
 * capture ladder and the economic role of each operation.
 *
 * ⭐ THE ROLE LENS IS AN IDENTITY, NOT A TABLE. `criminalOpEcon` (domain/criminalOpRole.js)
 * emits exactly seven values and the corpus keys seven pools on `operation role <value>`,
 * with the sole fallback spelled `(unclassified)` in the corpus. So the desk appends rather
 * than translates, and the test pins the mapping TOTAL against the producer's own exported
 * roster (CRIMINAL_OP_ROLES) instead of a hand list beside it.
 *
 * ⚠ THE CAPTURE MAPPING IS A JUDGMENT, AND IT IS GROUNDED IN THE SHIPPED LABELS RATHER THAN
 * INVENTED. The corpus wants `an AGENT of a faction` vs `a LEADER`, and there is no
 * person-level captured-role record anywhere in the tree — `CAPTURE_LADDER` is
 * faction-level (`none · adversarial · equilibrium · corrupted · capture`). But the two top
 * rungs already SAY which it is, in the display labels the power tab renders today:
 * `corrupted` is "Criminal: Corrupted Officials" (officials, not the head) and `capture` is
 * "Criminal: Governance Captured" (the head). So corrupted → AGENT and capture → LEADER,
 * which keeps both pools reachable from a real producer instead of leaving them dark on a
 * missing person-role field. Say "veto" to move it.
 *
 * ⭐ THE PRESSURE DIRECTION REUSES THE CANONICAL CONTRIBUTIONS rather than re-deriving from
 * labels. `publicLegitimacy.breakdown` already carries signed safety and prosperity
 * contributions computed by the generator, and the corpus's own pool names are
 * "(weak security, poor prosperity)" and "(strong security, prosperity)" — so the sign pair
 * IS the reading. A second derivation from `safetyLabel` and the prosperity tier would be
 * the fork that drifts, and this desk has no business owning a safety band.
 */

/**
 * DS-POW-6's legitimacy-reading lens: the two cells DS-POW-1 leaves empty.
 * @param {{present?: unknown}|null|undefined} ledger the governanceLedger reading
 * @param {PublicLegitimacyView|null|undefined} legitimacy
 * @returns {string|null}
 */
export function legitimacyReadingPoolKey(ledger, legitimacy) {
  if (!ledger?.present) return 'present: false (no legitimacy reading)';
  const b = legitimacy?.breakdown;
  if (!b) return null;
  const flat = ['prosperity', 'safety', 'defense', 'food']
    .every((f) => contribution(b[/** @type {keyof LegitimacyBreakdownView} */ (f)]) === 0);
  // Nothing pulling either way is exactly the state DS-POW-1's lens goes silent on, so the
  // two blocks tile the space instead of overlapping or leaving a hole in it.
  return flat ? 'neutral baseline (nothing pulling either way)' : null;
}

/**
 * DS-POW-6's capture lens.
 * @param {unknown} captureState
 * @param {LegitimacyBreakdownView|null|undefined} breakdown
 * @returns {string|null}
 */
export function capturePoolKey(captureState, breakdown) {
  const state = text(captureState);
  if (state === 'capture') return 'capture reached a LEADER';
  if (state === 'corrupted') return 'capture reached an AGENT of a faction';
  if (!breakdown) return null;
  const safety = contribution(breakdown.safety);
  const prosperity = contribution(breakdown.prosperity);
  if (safety < 0 && prosperity < 0) return 'capture pressure ADVANCING (weak security, poor prosperity)';
  if (safety > 0 && prosperity > 0) return 'capture pressure RECOVERING (strong security, prosperity)';
  // A mixed or flat pair is neither direction, and the corpus wrote no sentence for it.
  return null;
}

/**
 * DS-POW-6's operation-role lens, for ONE named operation.
 * @param {unknown} name
 * @returns {string|null}
 */
export function operationRolePoolKey(name) {
  if (!text(name)) return null;
  const role = criminalOpEcon(text(name));
  return role === 'criminal revenue stream'
    ? 'operation role criminal revenue stream (unclassified)'
    : `operation role ${role}`;
}

/**
 * THE DESK. Returns the two rungs the legitimacy banner draws, or null for each where the
 * state does not support one.
 *
 * Both rungs are routed through ONE mount id by the caller, which is the C3 law held: the
 * banner is one position, and flipping its registry row to `glance` silences both lines
 * together rather than leaving half a reading on the page.
 *
 * @param {PowerDeskSettlement|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{legitimacyBanner: object|null, legitimacyLens: object|null,
 *   stabilityHeader: object|null, stabilityLens: object|null, legitimacyReading: object|null,
 *   captureReading: object|null, operationReading: object|null}>}
 */
export function powerStateProse(settlement, options = {}) {
  const power = settlement?.powerStructure || {};
  // A legacy numeric `publicLegitimacy` carries no label, breakdown or flag. Reading it as
  // an object would yield `undefined` at every field and silence at every pool, which is
  // the right outcome; narrowing to it explicitly is what makes that outcome deliberate.
  const legitimacy = typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({});

  const town = properFill(text(settlement?.name));
  // The canonical "who governs" name, never a hand-rolled second spelling of it.
  const governing = properFill(text(power.governingName));

  // ⚠ TWO BAGS, BECAUSE {seat} CARRIES TWO INCOMPATIBLE ROLES ACROSS THESE BLOCKS, AND ONE
  // FILL CANNOT SATISFY BOTH. In DS-POW-1 every {seat} seam is the governing BODY — "The
  // {seat} at {settlement} is obeyed", "the {seat}'s writ" — which is exactly
  // `governingName`. In DS-POW-2 it is the HALL, a PLACE the body occupies: "The {seat} at
  // {settlement} is {faction}'s, and the town takes its questions there." Filling both from
  // one name renders "The Merchant Council at Thornwall is Merchant Council's".
  //
  // No hall-name producer exists, so DS-POW-2 leaves {seat} UNFILLED and supplies {faction}
  // only. Anchored liveness then drops the 10 seat-naming variants and keeps 21 of 31 —
  // MEASURED: all NINE pools still speak, none goes dark. Variety is the price; a broken
  // sentence and a dead pool are the alternatives, and both are worse.
  // This is a corpus-side slot-role ambiguity of the same KIND the annex records for
  // {band}, and it is raised for the chair rather than papered over with a second fill.
  const slots = { settlement: town, seat: governing };
  const stabilitySlots = { settlement: town, faction: governing };

  /** @param {string|null} poolKey */
  const line = (poolKey) => (poolKey
    ? readStateProse(CORPUS, 'DS-POW-1', poolKey, { ...options, slots })
    : null);
  /** @param {string|null} poolKey */
  const line2 = (poolKey) => (poolKey
    ? readStateProse(CORPUS, 'DS-POW-2', poolKey, { ...options, slots: stabilitySlots })
    : null);
  // DS-POW-6 uses {seat} as the governing BODY (like DS-POW-1) and {faction} for the
  // captured house, so it takes BOTH fills — the two roles do not collide in this block.
  /** @param {string|null} poolKey */
  const line6 = (poolKey) => (poolKey
    ? readStateProse(CORPUS, 'DS-POW-6', poolKey,
      { ...options, slots: { settlement: town, seat: governing, faction: governing } })
    : null);

  const bandKey = legitimacyBandPoolKey(legitimacy.label);
  const lensKey = legitimacyLensPoolKey(legitimacy);
  const glance = text(legitimacy.label);

  const stabilityKey = stabilityPoolKey(power.stability);
  const stabilityLens = stabilityLensPoolKey(power.recentConflict, power.factions);

  // DS-POW-6. The ledger is the canonical reader for "is there a reading at all"; the
  // breakdown is the generator's own signed contributions; the operations are the safety
  // profile's own list. This desk derives none of the three.
  const ledger = governanceLedger(settlement);
  const breakdown = legitimacy.breakdown;
  const readingKey = legitimacyReadingPoolKey(ledger, legitimacy);
  const captureKey = capturePoolKey(power.criminalCaptureState, breakdown);
  const operations = Array.isArray(settlement?.economicState?.safetyProfile?.criminalInstitutions)
    ? settlement.economicState.safetyProfile.criminalInstitutions
    : [];
  // The FIRST classifiable operation speaks. A page that narrated all of them would repeat
  // one fact in several voices, and the corpus writes one sentence per role, not a list.
  const operationKey = operations.map(operationRolePoolKey).find(Boolean) || null;

  return Object.freeze({
    legitimacyBanner: bandKey ? legibilityRung(glance, line(bandKey), []) : null,
    // The lens rung carries no glance of its own: the band word is already on the banner
    // an inch above it, and a second copy of one word is the page repeating itself.
    legitimacyLens: lensKey ? legibilityRung('', line(lensKey), []) : null,
    stabilityHeader: stabilityKey
      ? legibilityRung(text(power.stability), line2(stabilityKey), [])
      : null,
    stabilityLens: stabilityLens ? legibilityRung('', line2(stabilityLens), []) : null,
    legitimacyReading: readingKey ? legibilityRung('', line6(readingKey), []) : null,
    captureReading: captureKey ? legibilityRung('', line6(captureKey), []) : null,
    operationReading: operationKey ? legibilityRung('', line6(operationKey), []) : null,
  });
}
