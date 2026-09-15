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
 *   DS-POW-4  Power › Rule and succession — `coupContenders(settlement)` (as a READING) +
 *             `publicLegitimacy.govMultiplier`. Its lineage pools stay dark; see below.
 *   DS-POW-3  Power › The Ladder — `ladderRungsOf` + `ladderInstabilityOf`, PER FACTION
 *   DS-POW-5  Power › ruling structure and the structural lens — `structuralLensOf` +
 *             `governingName`
 *   DS-POW-7  Power › blocs and the divided court — `politicsRead.settlementBlocs`
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
import { composeStateProse } from './composeStateProse.js';
import { powerStateProseCandidates } from './powerStateProseCandidates.js';
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
 * @property {unknown} [govMultiplier] the band's hold multiplier, 1.30 down to 0.60
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
 * THAN A STYLE CHOICE. The producer emits `Fractured (no stable governing authority)`
 * (and, on every save written before LT41b RULING 3, `Fractured — no stable governing
 * authority`; this reader takes the first word and is indifferent to which arrives).
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
 * carrying either token is `Critical (active siege, survival priority)` (spelled
 * `Critical (active siege — survival priority)` on saves older than LT41b RULING 3 — the
 * `\bsiege\b` test reads both), so exactly one of
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
 * ── DS-POW-4, RULE AND SUCCESSION ────────────────────────────────────────────────────
 *
 * Nine pools, three lenses, and ZERO covert variants — this block is entirely public.
 *
 * ⭐ THE RISK LADDER ARRIVES AS A READING, NOT AS AN IMPORT. `coupRiskLabel` lives beside
 * `coupContenders` in domain/rulingPowerCoup.js, which is 13.9 KB behind four transitive
 * imports. A desk that imported it would drag all of that into the power tab's chunk to
 * classify four pools, and would also break this file's own law — the reference desk states
 * it plainly: a desk "never derives a number a canonical reader already owns … their
 * readings arrive here as arguments". So the CALLER derives the contenders and hands them
 * over, exactly as EconomicsTab hands over `foodBalance` and `granaryOutlook`. A caller that
 * supplies none leaves the four risk pools silent and the other five speaking, which is
 * anchored liveness doing its ordinary work rather than a special case.
 *
 * ⚠ THE LADDER WAS DISPLAY-RESIDENT AND IS NOW THE DOMAIN'S. The four-way lived inline in
 * `components/dossier/EngineSections.jsx`, and this corpus keys four pools on its exact
 * strings — `Critical. The seat could fall` byte for byte. Reading it here would have been
 * a SECOND spelling of one classification, and the page and the prose would have drifted
 * apart about whether a seat was Contested or Holding, each correct against its own copy.
 * The lift is proven equivalent to the original inline logic over all four branches.
 *
 * ⭐ THE HOLD LENS NEEDS NO NEW READER AT ALL. `computePublicLegitimacy` already returns
 * `govMultiplier` — 1.30 / 1.15 / 1.00 / 0.80 / 0.60 straight off the band — and the
 * corpus's three pools are exactly "backing hardens", "neither helps nor hurts" and
 * "rejection is breaking". So the multiplier's position relative to 1 IS the reading, and
 * this desk derives no second opinion about legitimacy's effect on a hold.
 */

/**
 * The risk labels that need no rewriting: the corpus keys them verbatim.
 * @type {Readonly<Record<string, string>>}
 */
const RISK_POOL_OF = Object.freeze({
  // `Stable` is the one label the corpus re-spells, because its pool says WHY.
  Stable: 'riskLabel: Stable (no challengers)',
  Holding: 'riskLabel: Holding',
  Contested: 'riskLabel: Contested',
  'Critical. The seat could fall': 'riskLabel: Critical. The seat could fall',
});

/**
 * DS-POW-4's risk lens. Null when the caller handed over no contenders — the desk does not
 * reach for them itself.
 * @param {string|null|undefined} riskLabel a value of COUP_RISK_LABELS
 * @returns {string|null}
 */
export function riskPoolKey(riskLabel) {
  const label = text(riskLabel);
  return label ? RISK_POOL_OF[label] || null : null;
}

/**
 * DS-POW-4's hold lens, read off the band's own multiplier.
 * @param {unknown} govMultiplier
 * @returns {string|null}
 */
export function legitimacyHoldPoolKey(govMultiplier) {
  if (typeof govMultiplier !== 'number' || !Number.isFinite(govMultiplier)) return null;
  if (govMultiplier > 1) return 'legitimacyHold: public backing hardens the hold';
  if (govMultiplier < 1) return 'legitimacyHold: public rejection is breaking the hold';
  return 'legitimacyHold: public opinion neither helps nor hurts';
}

/**
 * ⛔ THE LINEAGE LENS IS NOT WIRED, AND THE REASON IS A MEASUREMENT RATHER THAN A CHOICE.
 *
 * DS-POW-4's last two pools key on `powerStructure.previousGovernments`. That field has NO
 * GENERATION-TIME WRITER: it is written only when a power transfer happens in play
 * (domain/rulingPower.js), so `check-observed-shape-readers` convicts a fresh read of it —
 * "a guarded read of a key the real generator never writes cannot throw; it degrades to a
 * default, and the arm behind it is dead on every generated world." I confirmed the
 * conviction by running the door: every one of the tree's `previousGovernments` sites is a
 * READER. My earlier note that it had "29 hits" was a grep count, and a grep count is not a
 * producer — the same error class this desk has been built to refuse.
 *
 * The sanctioned home for exactly this case is the scan's M8/M9 explained-writer bank
 * (declared identities whose writer the GENERATION corpus never runs). Adding a row there
 * is a REGISTER ACT and therefore the chair's, not a lane's. So the two pools stay dark,
 * DECLARED here rather than left for an auditor to re-find, and the desk reads the field
 * NOWHERE — a mounted-but-unreachable pool is a finding; a dead read is a defect.
 *
 * TO LIGHT THEM: bank the explained-writer row naming `rulingPower.js` as the writer, then
 * add a lineage lens that takes the array as a READING from the caller.
 */

/**
 * ── DS-POW-3, THE LADDER — the first PER-FACTION block, and the first CONDITIONAL one ──
 *
 * Every other block this desk serves answers once per page. This one answers once per
 * FACTION, because a ladder is a faction's internal order and a town has several. So it
 * gets its own entry point (`powerLadderRung`) rather than a key on the page-wide return:
 * folding a per-faction answer into a once-per-page object would have forced the caller to
 * pick one faction and call it the town's, which is a claim the corpus never makes.
 *
 * ⚠ THIS BLOCK IS DARK AT BIRTH, AND THAT IS A SURFACE CONDITION RATHER THAN A DEFECT.
 * `settlement.npcLadder` has NO generation-time writer — it is a play-time sidecar written
 * by `worldPulse/npcLadderKernel.js`, and `ladderRead.js` returns empty for every reader
 * when the mirror is absent, so PowerTab's ladder section hides itself
 * (`hasLadder(s) && …`). Nothing degrades and nothing lies in a world without one.
 * ⛔ THE DISTINCTION FROM THE LINEAGE POOLS ABOVE IS LOAD-BEARING. Those were a DEAD READ:
 * the desk read a field no writer produces and the read would silently degrade to a
 * default. This is a CONDITIONAL SURFACE: a real writer exists, the caller checks presence
 * and hides. A played world is a real world, and a block that speaks only about lived
 * history is describing the thing the product exists to produce.
 * ⇒ Its aliveness proof therefore uses a SIMULATED fixture built by the kernel's own
 * `mirrorOf` writer, never a birth fixture. A proof that it is silent at birth would be a
 * DORMANCY proof, and a dormancy proof is indistinguishable from the four dead-arm
 * pathologies this suite exists to refuse.
 *
 * ⚠ THE READINGS ARRIVE AS ARGUMENTS (the DS-POW-4 pattern, and for a second reason here):
 * `ladderRungsOf`/`ladderInstabilityOf` are the canonical readers and PowerTab already
 * calls both in its faction loop, so the desk takes their OUTPUTS. That also means this
 * desk reads no `npcLadder` shape of its own and gains no observed-shape row.
 */

/** Fewer rungs than this is a ladder that is short because the faction is. JUDGMENT. */
const SHALLOW_RUNGS_BELOW = 3;
/** Churn tax at or above this reads as churning. JUDGMENT — no canonical cut exists. */
const HIGH_INSTABILITY_FROM = 0.35;
/** Top and runner-up within this standing gap are a crowded top rung. JUDGMENT. */
const CROWDED_TOP_GAP = 0.08;
/** Every adjacent pair at least this far apart reads as settled order. JUDGMENT. */
const SETTLED_MIN_GAP = 0.15;

/**
 * DS-POW-3's pool key for ONE faction's ladder.
 *
 * The order is the corpus's own specificity, and each step is a different question: how
 * MANY rungs there are at all, then whether the order is CHURNING, then — only for a
 * settled ladder — how the standings SIT. A shallow ladder is tested first because the
 * gap questions below it are meaningless on two rungs.
 *
 * The four cuts are JUDGMENTS and are vetoable: `LADDER_TUNING` carries STAND_MAX and a
 * baseline but no band boundaries, so there was no canonical cut to reuse and inventing one
 * silently would have been the worse move. Say "veto" to move any of them.
 *
 * @param {ReadonlyArray<{name?: unknown, standing?: unknown}>|null|undefined} rungs
 *   ordered top-rung first, as `ladderRungsOf` returns them
 * @param {unknown} instability the churn tax 0..1, as `ladderInstabilityOf` returns it
 * @returns {string|null} null when there is no ladder to describe
 */
export function ladderPoolKey(rungs, instability) {
  if (!Array.isArray(rungs) || rungs.length === 0) return null;
  if (rungs.length < SHALLOW_RUNGS_BELOW) return 'shallow ladder (few rungs recorded)';
  const churn = typeof instability === 'number' && Number.isFinite(instability) ? instability : 0;
  if (churn >= HIGH_INSTABILITY_FROM) return 'high instability (churn at the top)';
  const standing = rungs.map((r) => (typeof r?.standing === 'number' ? r.standing : 0));
  if (standing[0] - standing[1] <= CROWDED_TOP_GAP) return 'crowded top rung, low instability';
  const settled = standing.every((v, i) => i === 0 || standing[i - 1] - v >= SETTLED_MIN_GAP);
  return settled ? 'low instability, long-held order' : 'clear top rung, low instability';
}

/**
 * THE LADDER DESK, per faction. Returns one rung, or null where there is nothing to say.
 *
 * `{faction}` is MANDATORY here in a way it is not elsewhere: every one of DS-POW-3's
 * sixteen variants names it, so a faction without a usable name renders NOTHING rather
 * than degrading — there is no faction-free variant to fall back to, and the anchored
 * liveness law makes that silence automatic rather than a special case.
 *
 * @param {PowerDeskSettlement|null|undefined} settlement
 * @param {{factionName?: unknown, rungs?: ReadonlyArray<{name?: unknown, standing?: unknown}>|null,
 *   instability?: unknown}} [reading] the caller's own `ladderRungsOf`/`ladderInstabilityOf`
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {object|null}
 */
export function powerLadderRung(settlement, reading = {}, options = {}) {
  const key = ladderPoolKey(reading.rungs, reading.instability);
  if (!key) return null;
  const faction = properFill(text(reading.factionName));
  if (!faction) return null;
  const slots = {
    settlement: properFill(text(settlement?.name)),
    faction,
    // The top rung's holder. Absent or oddly-named ⇒ the six {npc} variants drop and the
    // ten that never needed one still speak.
    npc: properFill(text(reading.rungs?.[0]?.name)),
  };
  // ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3e). The per-faction ladder's whole reading is
  // the one this entry point was handed, so that is what the candidates leaf is offered.
  const line = composeStateProse(CORPUS, 'DS-POW-3', {
    ...options,
    slots,
    spineKey: key,
    candidates: powerStateProseCandidates('DS-POW-3', reading),
  });
  return legibilityRung(faction, line, []);
}

/**
 * ── DS-POW-5, THE RULING STRUCTURE AND THE STRUCTURAL LENS ───────────────────────────
 *
 * Twelve pools in THREE lenses, and every one of them is an IDENTITY with a canonical
 * vocabulary rather than a mapping this desk invents:
 *
 *   RULING POWER (6)   `cohesionWeave.RULING_POWERS` is
 *                      `autocrat · council · theocracy · merchant_league · criminal · mixed`
 *                      and the corpus keys six pools on exactly those six words.
 *   THE NAME (1)       the governing body's own title, which is a SLOT and never a baked
 *                      noun — it fires whenever `{seat}` has a real fill.
 *
 * The archetype mapper is TOTAL and fails soft to `mixed`, so the ruling-power lens always
 * answers on a generated world. The desk asserts its vocabulary against `RULING_POWERS`
 * directly instead of carrying a table that could drift from it.
 *
 * ⛔ THE FIVE `economicBase:` POOLS ARE DARK, AND THE REASON IS A MEASUREMENT.
 * `check-observed-shape-readers` convicts all three keys the base is derived from —
 * `economicState.economicBase`, `config.economicBase`, `economicState.primaryIndustry` — as
 * keys NO WRITER PRODUCES. So `normalizeEconomicBase` receives `''` on every generated
 * world and fails soft to `mixed`: the axis has never varied for ANY consumer of the lens,
 * which is a pre-existing finding about the lens rather than about this desk.
 * Drawing `economicBase: mixed` off that default would hand a reader a FAIL-SOFT VALUE
 * DRESSED AS A READING — a false statement about the town, which is the one thing this
 * subsystem exists to refuse. So the desk does not draw the base lens at all, and does not
 * read the keys. The five pools stay dark BY DECLARATION.
 * TO LIGHT THEM: give the economy generator a real economic-base field; the corpus, the
 * vocabulary and the pool keys are already in place and agree 1:1.
 *
 * ⚠ THE READING ARRIVES AS AN ARGUMENT (the DS-POW-4 / DS-POW-3 pattern). `structuralLensOf`
 * is the ONE derivation of the lens from a settlement, and it was lifted into
 * `cohesionWeave.js` for this car: the extraction it performs lived as a LOCAL helper in
 * `generosityKernel.js`, and writing a fourth copy for this desk is the point at which a
 * duplicated derivation becomes a drift that ships. The caller derives; the desk consumes.
 *
 * ⚠ `criminal` IS WHOLLY COVERT — all three of its variants are `dm-only`, measured — so it
 * draws only on the DM's own dossier, through the audience the caller already passes. The
 * same fail-closed law that would have left DS-POW-6's capture pools dark applies here, and
 * it is already satisfied.
 *
 * ⚠ `{institution}`, `{route}` and `{good}` are named by exactly ONE variant EACH of the
 * block's forty (in `theocracy`, `economicBase: trade_hub` and `economicBase: craft`
 * respectively). `{good}` is the only `bare-common` slot this leaf touches — the shape class
 * that leaves DS-ECO-1's C1 pool at one eligible variant — and at one variant of forty its
 * exposure is a single dropped sentence rather than a degraded pool. They are left unfilled;
 * anchored liveness drops those three variants and no POOL is lost, which the desk test
 * measures rather than assumes.
 */

/**
 * DS-POW-5's ruling-power pool key. The lens word IS the pool key; an unrecognised word
 * renders nothing rather than falling into `mixed`, because a vocabulary this desk does not
 * know is a producer change and guessing which rung it meant is how a page states something
 * false.
 * @param {{rulingPower?: unknown}|null|undefined} lens
 * @returns {string|null}
 */
export function rulingPowerPoolKey(lens) {
  const word = text(lens?.rulingPower);
  if (!word) return null;
  return CORPUS['DS-POW-5'].pools[word] ? word : null;
}

/** The pool that narrates the governing body's own title. */
const GOVERNING_NAME_POOL = 'governing body name: a SLOT, never a baked noun';

/**
 * ── DS-POW-7, THE BLOCS — the last block in the leaf, and the only one needing a data route ─
 *
 * ⚠ CONDITIONAL SURFACE, the DS-POW-3 class. `worldState.politicsLedgers` is written only by
 * `worldPulse/settlementPolitics.js` during play — no generator writes it — so the layer is
 * dormant at birth. The corpus ANTICIPATES that with its own `layer DORMANT (no ledger
 * materialized)` pool, which is why this is a surface condition rather than a dead read: the
 * dormant sentence is a TRUE statement about an unorganised hall ("the factions sit as
 * factions, and nothing binds any"), not a fail-soft default dressed as a reading. Its
 * aliveness proof therefore uses a PLAYED-world fixture, verified through the shipped reader.
 *
 * ⚠ IT READS THE DISPLAY PROJECTION, NEVER THE KERNEL. `settlementPolitics.js` is 61.9 KB
 * behind EIGHT transitive imports (treaty orientation, war fronts, mobilization, espionage
 * presence…). `display/politicsRead.js` is 7.3 KB behind two, is the display layer's own
 * projection of the same ledger, and already implements the §13 secrets seam. Reaching for
 * the kernel to serve a dossier sentence would repeat exactly the mistake the criminal-op
 * lift corrected, so the reading arrives as an argument from the caller's `politicsRead`.
 *
 * ⚠ THE SEAM JUDGMENT, STATED BECAUSE IT IS A JUDGMENT (vetoable). `politicsRead` puts a
 * bloc's raw `end` and `glue` behind `includeGroundTruth`, while the CORPUS marks only the
 * genuinely secret members covert — `glue compromise (a corruption leash)` and `end patron`
 * are wholly `dm-only`, the other four of each are public — and the projection's always-
 * visible `presence` line already speaks the end in phrase form. Two mechanisms, two jobs:
 * the projection gates the raw DETAIL BAG, and the corpus's marks gate the SENTENCE under
 * kernel law 2. So the caller hands over ground truth for ROUTING and the kernel refuses the
 * covert variants on a player page — a player reading a corruption-leash bloc gets the pool
 * key and then SILENCE, because all three of its variants are covert. Nothing the desk holds
 * reaches a reader except a sentence the kernel approved. The caller still honours the
 * projection's own covert FILTER (`includeCovert` off for a player), so a conspiracy does not
 * even enter the projection there.
 *
 * ⛔ SIX OF THE TWENTY POOLS ARE DARK BY DECLARATION, each with a measured reason:
 *   • `receipt formed / realigned / fractured / exposed / deferred` (5). These narrate
 *     TRANSITIONS, and `advanceSettlementPolitics` returns a `receipts` array that its ONLY
 *     caller discards — pulseKernel.js `if (politics.changed) worldState =` keeps only the
 *     changed flag and the world state, dropping the rest. There is no readable state, so a
 *     read would be the dead-read defect. (The machinery feeding nothing is itself a finding.)
 *   • `hostile leader tie HARD-BLOCKS an otherwise natural alignment` (1). Nothing persists
 *     a BLOCKED alignment; deriving it would fork the kernel's own alignment reasoning.
 * And TWO more are dark for a cost reason rather than a truth reason:
 *   • `consolidation 0: a fully divided court` and `a RULING bloc, consolidated`. Both need
 *     `rulingBlocOf` / `coalitionConsolidation01`, which live in that 61.9 KB kernel module
 *     and which the display projection does not expose. Lighting them wants a small
 *     ruling-bloc derivation added to `politicsRead` — a separate act, deliberately not
 *     bundled into this car.
 */

/**
 * The corpus IS the key table. Both families are derived by scanning the shipped pool names,
 * so a renamed pool or a new glue type cannot drift from a hand-written map — the failure
 * mode a literal table here would have.
 * @param {string} prefix @returns {Readonly<Record<string, string>>} token → pool key
 */
function poolsByToken(prefix) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const key of Object.keys(CORPUS['DS-POW-7'].pools)) {
    if (!key.startsWith(`${prefix} `)) continue;
    const token = key.slice(prefix.length + 1).split(' ')[0];
    if (token) out[token] = key;
  }
  return Object.freeze(out);
}
const GLUE_POOL_OF = poolsByToken('glue');
const END_POOL_OF = poolsByToken('end');

/** @param {{blocs?: ReadonlyArray<Record<string, unknown>>}|null|undefined} projection */
function firstBloc(projection) {
  const blocs = projection?.blocs;
  return Array.isArray(blocs) && blocs.length > 0 ? blocs[0] : null;
}

/**
 * DS-POW-7's presence lens. A dormant layer says so; a conspiracy under an autarchy is the
 * one presence fact the projection exposes that this desk can route.
 * @param {{blocs?: ReadonlyArray<Record<string, unknown>>}|null|undefined} projection
 * @param {unknown} rulingPower a RULING_POWERS word, from the DS-POW-5 lens
 * @returns {string|null}
 */
export function politicsPresencePoolKey(projection, rulingPower) {
  const blocs = projection?.blocs;
  if (!Array.isArray(blocs) || blocs.length === 0) return 'layer DORMANT (no ledger materialized)';
  const covert = blocs.some((b) => b?.covert === true);
  return covert && text(rulingPower) === 'autocrat'
    ? 'an opposition bloc forms COVERT under an autarchy'
    : null;
}

/**
 * DS-POW-7's glue lens — the binding of the first bloc, from the ground-truth bag.
 * @param {{blocs?: ReadonlyArray<Record<string, unknown>>}|null|undefined} projection
 * @returns {string|null}
 */
export function politicsGluePoolKey(projection) {
  const truth = /** @type {{glue?: ReadonlyArray<{type?: unknown}>}|undefined} */ (firstBloc(projection)?.truth);
  const glue = truth?.glue;
  if (!Array.isArray(glue) || glue.length === 0) return null;
  return GLUE_POOL_OF[text(glue[0]?.type)] || null;
}

/**
 * DS-POW-7's end lens — what the first bloc is FOR.
 * @param {{blocs?: ReadonlyArray<Record<string, unknown>>}|null|undefined} projection
 * @returns {string|null}
 */
export function politicsEndPoolKey(projection) {
  const truth = /** @type {{end?: unknown}|undefined} */ (firstBloc(projection)?.truth);
  return END_POOL_OF[text(truth?.end)] || null;
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
 * @param {{contenders?: {challengers?: ReadonlyArray<{name?: unknown}>}|null,
 *   riskLabel?: string|null,
 *   structuralLens?: {rulingPower?: unknown, economicBase?: unknown}|null,
 *   politics?: {blocs?: ReadonlyArray<Record<string, unknown>>}|null}} [readings]
 *   the caller's own derivations — see DS-POW-4, DS-POW-5 and DS-POW-7 above
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{legitimacyBanner: object|null, legitimacyLens: object|null,
 *   stabilityHeader: object|null, stabilityLens: object|null, legitimacyReading: object|null,
 *   captureReading: object|null, operationReading: object|null, successionRisk: object|null,
 *   successionHold: object|null, rulingStructure: object|null, governingTitle: object|null,
 *   blocPresence: object|null, blocGlue: object|null, blocEnd: object|null}>}
 */
export function powerStateProse(settlement, readings = {}, options = {}) {
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

  // ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3e), all six block helpers below. The spine key
  // is this desk's own key function and every bag is unchanged; the candidates leaf offers
  // the modifier pools the state earned, and is EMPTY until car 9 authors them. An empty
  // list composes to the kernel's own draw, which is why the manifest cannot move here.
  /** @param {string|null} poolKey */
  const line = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-1', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-1', readings),
    })
    : null);
  /** @param {string|null} poolKey */
  const line2 = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-2', {
      ...options,
      slots: stabilitySlots,
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-2', readings),
    })
    : null);
  // DS-POW-6 uses {seat} as the governing BODY (like DS-POW-1) and {faction} for the
  // captured house, so it takes BOTH fills — the two roles do not collide in this block.
  // DS-POW-7 fills {settlement} (59 of its 60 variants), plus {seat}/{faction}/{counterpart}
  // for the two variants each that name them. The counterpart is the challenger the
  // succession reading already resolved, so no second derivation is made for it.
  /** @param {string|null} poolKey */
  const line7 = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-7', {
      ...options,
      slots: { settlement: town, seat: governing, faction: governing, counterpart: challenger },
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-7', readings),
    })
    : null);
  // DS-POW-5 uses {seat} as the governing BODY, the DS-POW-1 role. {institution}, {route}
  // and {good} are deliberately absent — one variant each of forty, no producer, and
  // anchored liveness drops them without costing a pool.
  /** @param {string|null} poolKey */
  const line5 = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-5', {
      ...options,
      slots: { settlement: town, seat: governing },
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-5', readings),
    })
    : null);
  // DS-POW-4 uses {seat} as the OFFICE ("the seat could fall"), the same role DS-POW-1
  // gives it, so governingName fills it here too. {timeband_age} is deliberately absent —
  // it is named by ONE variant of 29, anchored liveness drops that single variant, and all
  // nine pools still speak.
  //
  // ⛔ THE REASON THIS COMMENT USED TO GIVE — "there is no duration former" — IS FALSE, AND
  // IT WAS THE WRONG GROUND EVEN WHEN IT WAS TRUE-SOUNDING. The former is
  // `heraldCausalGrammar.js`'s timeBandOf/timeBandWord: a zero-import display leaf whose
  // six-band × four-position table is IDENTICAL cell for cell to §0d's in BOTH annexes
  // (24 of 24 cells, measured 2026-09-05). Two better reasons stand in its place, either
  // of which alone refuses the fill:
  //   1. THE FILL WOULD BE A NO-OP. The only {timeband_age} variant in this block is #3 of
  //      the pool `previousGovernments present with a recorded cause`, and this desk reads
  //      NEITHER lineage pool — see THE LINEAGE LENS IS NOT WIRED above, whose cure is an
  //      M8/M9 explained-writer bank row and therefore the chair's act, not a lane's.
  //      `line4` is called with the risk and the hold keys alone, so no variant it can
  //      reach names the slot. Measured: previousGovernments absent on 48 of 48 generated
  //      towns, which is the same measurement that block already records.
  //   2. NO DURATION EXISTS HERE EVEN IF THE LENS WERE WIRED. A seat's age is
  //      `now - previousGovernments[last].tick`, and that tick is a WORLD tick. This desk
  //      holds no clock and is handed none; inventing an interval to band it would be
  //      coining exactly the mapping §0d exists to forbid.
  // MEASURED, not assumed — DESK-TIMEBAND 2026-09-05.
  /** @param {string|null} poolKey */
  const line4 = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-4', {
      ...options,
      slots: { settlement: town, seat: governing, faction: governing, counterpart: challenger },
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-4', readings),
    })
    : null);
  /** @param {string|null} poolKey */
  const line6 = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-POW-6', {
      ...options,
      slots: { settlement: town, seat: governing, faction: governing },
      spineKey: poolKey,
      candidates: powerStateProseCandidates('DS-POW-6', readings),
    })
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

  // DS-POW-4. The risk label is the caller's reading; the hold is the band's own multiplier;
  // the lineage is the settlement's own record. {counterpart} is the top challenger — the
  // corpus's own reading of it ("{counterpart} now outweighs the {seat}").
  const riskKey = riskPoolKey(readings.riskLabel);
  const holdKey = legitimacyHoldPoolKey(legitimacy.govMultiplier);
  const challenger = properFill(text(readings.contenders?.challengers?.[0]?.name));

  // DS-POW-5. The lens is the caller's reading; both of its words are canonical vocabularies
  // and both mappers are total, so these two lenses answer on every generated world.
  const rulingKey = rulingPowerPoolKey(readings.structuralLens);
  const namedKey = governing ? GOVERNING_NAME_POOL : null;

  // DS-POW-7. The projection is the caller's `politicsRead` read; the ruling-power word comes
  // from the DS-POW-5 lens it already holds, so no second derivation is made here.
  const politics = readings.politics ?? null;
  const presenceKey = politicsPresencePoolKey(politics, readings.structuralLens?.rulingPower);
  const glueKey = politicsGluePoolKey(politics);
  const endKey = politicsEndPoolKey(politics);

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
    successionRisk: riskKey ? legibilityRung(text(readings.riskLabel), line4(riskKey), []) : null,
    successionHold: holdKey ? legibilityRung('', line4(holdKey), []) : null,
    rulingStructure: rulingKey ? legibilityRung(rulingKey, line5(rulingKey), []) : null,
    governingTitle: namedKey ? legibilityRung('', line5(namedKey), []) : null,
    blocPresence: presenceKey ? legibilityRung('', line7(presenceKey), []) : null,
    blocGlue: glueKey ? legibilityRung('', line7(glueKey), []) : null,
    blocEnd: endKey ? legibilityRung('', line7(endKey), []) : null,
  });
}
