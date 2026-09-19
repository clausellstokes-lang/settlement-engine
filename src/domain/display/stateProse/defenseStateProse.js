/**
 * domain/display/stateProse/defenseStateProse.js — DESK CAR 12: THE DEFENSE DESK.
 *
 * The fourth desk module, and the FIRST PRODUCTION USE OF THE DM'S-PEN PROJECTION.
 *
 *   DS-DEF-3  Defense › Public order banner — `safetyProfile.{safetyLabel, safetyDesc}`
 *   DS-DEF-2  Defense › Threat assessment — the five readiness rows:
 *             `standingDefenseForces(settlement).{walls,garrison,militia}.present` +
 *             `defenseProfile.scores.economic` + `config.monsterThreat` +
 *             `economicState.compound.inst{...}`
 *   DS-DEF-5  Defense › Armed forces & fortifications — the five force lenses:
 *             `standingDefenseForces(settlement)` × `config.monsterThreat` × `magicWorksAt`
 *   DS-DEF-8  Defense › Active military status — `stress[].type → DEFENSE_STRESS_STATUS`
 *             × `economicViability.viable`. ONE of its four pools is DECLARED DARK; the
 *             reason and the single act that lights it are stated at the block below.
 *   DS-DEF-11 Defense › Why the wall, and why not — the perimeter × the country × the tier
 *             × `defenseProfile.economicGates.military`. The leaf's one second slot.
 *   DS-DEF-4  Defense › Criminal structure + capture consequence — `deriveCriminalStructure`
 *             × `powerStructure.criminalCaptureState`, two exact 1:1 vocabularies.
 *   DS-DEF-6  Defense › Supporting capabilities — `deriveSupportingCapabilities`. TWO of its
 *             six lenses speak; the other FOUR are declared dark under the C3 law because a
 *             LANDED sentence position on the same tab already states their fact, in prose
 *             that is near-verbatim identical. See DEF6_C3_BLOCKED_POOLS.
 *   DS-DEF-9  Viability › Magic dependency — `defenseProfile.magicDependency` ×
 *             `economicState.activeChains[].magicNote`. The leaf's ONE block that speaks
 *             off the `defense` tab, and the reason its host needed the paid gate threaded.
 *
 * ── ⛔⛔ TWO BLOCKS ARE DECLARED DARK BY MEASUREMENT, NOT BY OMISSION ─────────────────
 * DS-DEF-7 and DS-DEF-10 are the leaf's remaining unmounted blocks and each is dark for a
 * MEASURED reason, stated at its own declaration below with the one act that lights it:
 * DS-DEF-7 (`DEF7_DARK_POOLS`) on a chunk cost and an unwired host; DS-DEF-10
 * (`DEF10_DARK_POOLS`) on the C3 law, every lens family of it. Neither is a missing
 * producer — both blocks' producers are present, exact and reachable, which is precisely
 * what makes the two findings worth writing down rather than leaving as a silence.
 *
 * ── ⭐⭐ DS-DEF-1'S BLOCKER DECAYED, AND NOBODY NOTICED — the paragraph it replaced ───
 *
 * This header used to say DS-DEF-1 "waits on a SMALL LIFT of `avgScore` into a cheap leaf",
 * because the overall defence mean was stranded in two modules costing ~280 KB each against
 * the first-paint closure and a third hand-rolled copy is what `parityContract.js`'s
 * `defense.scoreAvg` pin exists to prevent. **THAT LIFT HAS SINCE LANDED.** `avgScore` now
 * lives in `defenseScoreBands.js` at 3,617 B, both former homes delegate, and the suite that
 * guards it sits in this desk's own test file. The blocker was true when written and false
 * by the time anybody re-read it.
 *
 * ⭐ A BLOCKER IS A CLAIM, AND A CLAIM DECAYS. A stale figure gets refused by a gate; a
 * stale BLOCKER is obeyed in silence, and this one kept an authored block dark after the
 * thing blocking it was gone. Re-derive a constraint before obeying it.
 *
 * ⚠ AND THE LIFT TURNED OUT NOT TO BE WHAT DS-DEF-1 NEEDED. The readiness lens keys on
 * `defenseProfile.readiness.score`, NOT on `avgScore`, and the reason is COHERENCE WITH THE
 * BADGE BESIDE IT: `DefenseTab` prints `readiness.label` in the same header, and that label
 * is computed from `readiness.score` (the mean PLUS a tier bonus MINUS a threat penalty).
 * Banding the bare mean would let the page print "Fortress" beside a sentence calling the
 * town effectively undefended. Two numbers, one header, one reader. The lift is still the
 * right act — it is what makes `avgScore` reachable for the consumers that want the mean —
 * but it was never this block's gate.
 *
 * ── THE DM'S PEN, AND WHY THIS DESK CANNOT OVERWRITE IT ──────────────────────────────
 *
 * `safetyProfile.safetyDesc` is a DM-EDITABLE field (declared in
 * `dmFieldProjection.DM_EDITABLE_SETTLEMENT_PROSE_PATHS`, and named by
 * `DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-3']`). An implementer wiring "the corpus supplies this
 * section's prose" the obvious way overwrites the DM's sentence and does it silently,
 * because the machine sentence is a perfectly good sentence. So this desk returns the
 * corpus line through `projectBesideDmField`, which has NOWHERE TO PUT A WRITE: it hands
 * back the DM's string BY IDENTITY and offers the machine line as a separate adjacent
 * field.
 * ⚠ THAT MODULE HAD ZERO RUNTIME CALLERS BEFORE THIS CAR. It is unit-tested and had never
 * been exercised in production, so it was treated as unproven machinery and PROVEN by
 * execution before being leaned on: 8/8 framed paths declared editable, the field returned
 * by identity, `beside` null when the corpus is silent, and — the pin that matters — the
 * wired field's bytes identical to the dark field's bytes. The desk test re-proves all of
 * it here rather than citing that run.
 *
 * ── THE THREE LENSES, ALL WITH MEASURED PRODUCERS ────────────────────────────────────
 *   THE LABEL (5 pools)  `safetyProfile.js` writes exactly `Very Safe · Safe · Moderate ·
 *                        Unsafe · Dangerous`. An EXACT 1:1 with the five pools.
 *   THE COMPOUND (1)     Under a crisis the generator REWRITES the label into a compound
 *                        form — `Controlled — Occupation Curfew`, `Tense — Active Siege`,
 *                        `Desperate — Famine Conditions`. The corpus wrote a pool named
 *                        `COMPOUND override (a crisis stress has rewritten the label)` for
 *                        exactly that, the same anticipation `layer DORMANT` shows. It is
 *                        detected by the em dash the compound form carries, never by a list
 *                        of crisis names that would need maintaining.
 *   FIRST SURVEY (1)     A framing pool, and its basis is a measurement: `safetyLabel` has
 *                        ZERO writers under `src/domain/worldPulse/`, so the reading is
 *                        never re-judged once generated. The qualification is therefore
 *                        always true of it — which is why the corpus wrote it as a framing
 *                        line rather than a state-keyed one, exactly like DS-STR-1's
 *                        "Overview's own section framing".
 *
 * @enforced-by tests/domain/defenseStateProseDesk.test.js
 */
import { MONSTER_THREAT_TIERS, normalizeMonsterThreat } from '../../../data/monsterThreat.js';
import { standingDefenseForces } from '../../institutions/defenseInstitutionBuckets.js';
import { magicWorksAt } from '../../worldPulse/magicWorksAt.js';
import { SMALL_TIERS, TOWN_PLUS_TIERS } from '../../../data/constants.js';
import { scoreBand } from '../defenseScoreBands.js';
import { DEFENSE_STRESS_STATUS } from '../defenseDisplay.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../data/dossierStateProse/defense.generated.js';
import {
  DM_FIELD_FRAMED_BY_BLOCK, projectBesideDmField, readProsePath,
} from './dmFieldProjection.js';
import { composeStateProse } from './composeStateProse.js';
import { defenseStateProseCandidates } from './defenseStateProseCandidates.js';
import { legibilityRung } from './legibilityRung.js';

/**
 * The desk's corpus, typed at the import boundary — the generated leaves stay PURE DATA.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_DEFENSE)
);

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column. DS-DEF-3's
 * variants name `{settlement}` and nothing else — measured, all seven pools.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper', defwork: 'bare-common', seat: 'proper', good: 'bare-common',
});

/**
 * This desk owns NO literal fill table, and says so rather than omitting the field — the
 * projection contract's guard treats an exported string map as a candidate fill table and
 * refuses one this does not name.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/** The pool that qualifies the reading as a first look. See the docblock for its basis. */
const FIRST_SURVEY_POOL = 'First-Survey qualification (the reading is a first look)';
/** The pool for a label a crisis has rewritten. */
const COMPOUND_POOL = 'COMPOUND override (a crisis stress has rewritten the label)';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A `proper` fill, or `undefined` — mirroring `fillShapeViolation`'s PROPER branch.
 * @param {string} value @returns {string|undefined}
 */
function properFill(value) {
  if (!value) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

/**
 * Has a crisis rewritten the label? The compound form the generator builds is
 * `"<strain> — <crisis>"`, so the EM DASH is the marker. Detecting the dash rather than
 * listing the crisis names is deliberate: the list would need maintaining and a new crisis
 * would silently read as an ordinary label, which is the quiet-degradation shape.
 * @param {unknown} safetyLabel @returns {boolean}
 */
export function isCompoundSafetyLabel(safetyLabel) {
  return /[—–]/.test(text(safetyLabel));
}

/**
 * DS-DEF-3's label pool key. A compound label goes to the COMPOUND pool; a clean label to
 * its own; anything the corpus does not carry renders NOTHING rather than falling into a
 * neighbouring band, because a safety band is a claim about whether the streets are safe.
 * @param {unknown} safetyLabel @returns {string|null}
 */
export function publicOrderPoolKey(safetyLabel) {
  const label = text(safetyLabel);
  if (!label) return null;
  if (isCompoundSafetyLabel(label)) return COMPOUND_POOL;
  return CORPUS['DS-DEF-3'].pools[label] ? label : null;
}

/**
 * DS-DEF-3's first-survey qualification. It applies whenever there is a reading to qualify:
 * `safetyLabel` is written at generation and has no world-pulse writer, so it is never
 * re-judged and the qualification is always true of it.
 * @param {unknown} safetyLabel @returns {string|null}
 */
export function firstSurveyPoolKey(safetyLabel) {
  return text(safetyLabel) ? FIRST_SURVEY_POOL : null;
}

/**
 * ── ⭐⭐ THE LABEL-TRAP RULE, THIRD INSTANCE — NOW A STANDING RULE ────────────────────
 *
 * `MONSTER_THREAT_TIERS` is exactly `heartland · frontier · plagued`. The corpus's three
 * Beasts & Monsters families are `plagued · frontier · SETTLED`. **The producer's
 * `heartland` is the corpus's `settled`** — the same shape as the stressor leaf's
 * `indebted` ("Indebted to Outside Power" vs `…TO AN OUTSIDE POWER`) and
 * `religious_conversion` ("Religious Conversion" vs `RELIGIOUS CRISIS`).
 *
 * THREE INSTANCES ACROSS TWO LEAVES, so it is a rule and not a coincidence:
 *   KEY ON THE CANONICAL PRODUCER TOKEN, NEVER ON THE CORPUS WORD, AND ASSERT THE MAP
 *   TOTAL IN BOTH DIRECTIONS.
 * A route that reads the corpus word — or that works for most of a vocabulary and silently
 * drops the rest — is a DEFAULT WEARING A READING'S CLOTHES, one layer up from the value
 * itself. The map below is bound to `MONSTER_THREAT_TIERS` by the desk test AND by a new
 * bound-consumer contract in `tests/lint/vocabularyTotality.walker.test.js`, which is the
 * estate's own registry of exactly this class.
 *
 * ⚠ RAISED, NOT DIAGNOSED: `normalizeMonsterThreat` forwards `'civilized'` UNCHANGED even
 * though it is not a canonical tier. A normaliser that passes a non-canonical value through
 * is not normalising — it is the same default-in-reading's-clothes shape at the producer.
 * This desk is TOTAL over the canonical three and returns null for anything else, so an
 * un-normalised value renders silence rather than a wrong family. Not cured here.
 *
 * @type {Readonly<Record<string, string>>}
 */
const MONSTER_FAMILY_OF = Object.freeze({
  plagued: 'plagued',
  frontier: 'frontier',
  // ⚠ THE NAME DIFFERENCE. The producer says `heartland`; the corpus says `settled`.
  heartland: 'settled',
});

/**
 * ── ⛔⛔ WHAT USED TO BE HERE, AND WHY IT IS A NAMED READ NOW ─────────────────────────
 *
 *     function flag(v) { return v === true || (typeof v === 'number' && v > 0); }
 *
 * That graded BOTH the defence buckets and the civic-facility flags, and it was wrong
 * about the first for the whole of its shipped life: the buckets are ARRAYS, so
 * `flag(["Massive Walls","Inner Citadel"])` was `false` and a fortified town read exactly
 * like an empty field. The cure is not a wider predicate — a shape-agnostic truthiness
 * test would grade `{}` and `"no"` as defended — but a read that CANNOT ask the vague
 * question: the defence rows now take a typed `standingDefenseForces` projection, and the
 * civic rows go through `civicFlag`, which is total about the one shape its producer
 * emits. The full measurement is in defenseInstitutionBuckets.js's header.
 *
 * ── ⛔⛔ AND THE VALUE `civicFlag` READS IS A GENERATION-TIME SNAPSHOT ────────────────
 * LT40 car 6 — REPORTED, DELIBERATELY NOT CURED. `compound.inst` is stamped ONCE, by
 * `economicState.js` (`compound: ecoInstFlags`, :883), from `getInstFlags(config,
 * institutions)` over the RAW roster — `priorityHelpers.js:42` maps
 * `nativeSemanticNames(institutions)`, never `liveInstitutions()` — and NOTHING on the
 * advance path recomputes it. So these flags describe the town as GENERATED, not as it
 * stands.
 *
 * MEASURED (city seed `civic-probe`): ruin the four civic rows and the live roster drops
 * 46 -> 42; a recompute over `liveInstitutions()` gives `hasCourtSystem: false,
 * hasPrison: false`; the stamped `compound.inst` still reads TRUE on both. Since
 * DS-DEF-2 row 3 (`internalRowPoolKey`) keys on exactly that pair — this file's own note
 * at the DS-DEF-6 collision block (:1369) says so — a town whose court and prison are RUBBLE
 * still asserts a full legal chain. A floor-1 self-contradiction reachable with no
 * authoring error.
 *
 * ⛔ DO NOT CURE IT HERE. Both cures — recompute from `liveInstitutions()` at read, or
 * re-derive `compound` at advance — move DS-DEF-2's civic rows on every ruined town, and
 * the producer's flags also feed prosperity, safety, services, NPCs and the power layer.
 * The trace and the pricing are docs/ENGINE_DEFECT_DISPOSITIONS.md §4; the cure is
 * owner-gated under §764.3.
 */

/**
 * A `compound.inst` civic-facility reading. `priorityHelpers.getInstitutionNames` builds
 * every one of these with `hasAny(...)`, which is `.some()` — a GENUINE boolean, never a
 * roster and never a count. So this is strict rather than coercive, and the desk suite
 * binds the claim to the producer by running it and asserting the types, which is the arm
 * whose absence let the array/boolean mismatch above ship.
 * @param {unknown} v @returns {boolean}
 */
function civicFlag(v) {
  return v === true;
}

/**
 * ⭐ THE ONE THREAT-TIER READ THIS DESK PERFORMS — a MEASUREMENT, never a default.
 *
 * ⚠ `normalizeMonsterThreat(undefined) === 'frontier'`: the normaliser's first line is
 * `raw || 'frontier'`, so an ABSENT tier silently becomes the frontier. Measured, not
 * assumed. Routing an absent value through it would let the desk describe the country of a
 * settlement whose country nobody ever measured — a default wearing a reading's clothes, and
 * the second face of the looseness this desk already raises about `'civilized'` above.
 *
 * So the raw value must be PRESENT before it is normalised, and `null` is returned
 * otherwise. This is a robustness property rather than a change to any shipped world:
 * `steps/resolveConfig.js` writes `monsterThreat: threat` into every effective config it
 * builds, so a GENERATED settlement always carries a tier and always reaches a family. An
 * absent tier means a hand-built fixture or a malformed import, and about those the desk
 * says nothing rather than something confident.
 *
 * @param {unknown} monsterThreat @returns {string|null} the CORPUS family word, or null
 */
export function measuredMonsterFamily(monsterThreat) {
  const raw = text(monsterThreat);
  if (!raw) return null;
  return MONSTER_FAMILY_OF[text(normalizeMonsterThreat(raw))] || null;
}

/**
 * ── ⭐⭐ DS-DEF-2's FOUR KEY TABLES, EXPOSED — THE RUNG-4 KEYS MADE READABLE ──────────
 *
 * The four tables below and the three SITUATION readers beside them are a WIRING change and
 * nothing else: every key this desk returns for every input is the key it returned before,
 * and the four blocks' prose, pools and slots are untouched. What moves is who can READ the
 * mapping. ARCH §3.6 asks for it in terms — "the rung-4 keys need the composers to expose
 * their key tables, a wiring car per desk, chair-decidable, zero text".
 *
 * ⛔ WHY IT WAS UNREADABLE, AND WHY A LOCAL BUILDER IS THE CAUSE. The estate's wiring census
 * (the instrument island under `src/domain/prose/`, which no product file may name — see the
 * note at the foot of this block) recovers a pool's selecting predicate down a four-rung
 * ladder: a LITERAL a key function returns, a TEMPLATE of one, a module-level TABLE it
 * indexes, and then WIRING-UNRESOLVED with a measured reason. Twenty-two of DS-DEF-2's
 * twenty-six pools sat on that fourth rung, in two families:
 *   • EIGHTEEN were built by a LOCAL arrow — `const key = (tail) => `<prefix>${family},
 *     ${tail}`` — so the template's holes bound to a local the census cannot resolve to a
 *     reading, and the whole pool read "no key function returns this key as a literal";
 *   • FOUR were a template over a BAND CALL, `` `Economic Survival: ${scoreBand(score)}` ``,
 *     whose hole is a function call and not a field.
 * The instrument was right both times. Its own header refuses to read one token further
 * (the bare-limb rule on its local-alias map): hopping to the first PARAM of a LOOKUP would have
 * resolved fifty more pools estate-wide and made fifty predicates FALSE — this desk's own
 * `const family = measuredMonsterFamily(monsterThreat)` is the worked example, because
 * `family === 'settled'` is produced by the config value `heartland`. A table cannot lie
 * that way: its key is the value the branch actually selects on.
 *
 * ⭐ SO THE SITUATION IS NAMED, AND THE NAME IS THE TABLE'S KEY. Each reader below answers
 * one question — what SITUATION is this town in, for this row — and the table maps that
 * situation to the pool the corpus wrote for it. The census then recovers a predicate that
 * is an exact `if and only if`: `<the reader's call> === '<the situation>'`.
 *
 * ⚠ ROW 3 (`internalRowPoolKey`) IS DELIBERATELY NOT TABLED, and that is the one judgment
 * this car makes. Its four pools already resolve on rung 1 with a REAL read set —
 * `["court","prison"]`, the block's only fact pair, which SITTING §P.2-28 names — because it
 * returns its keys as plain literals from guarded branches. Rung 3's field is the census's
 * own synthetic label (`"<reader> (via <TABLE> in <file>)"`), so tabling that row would trade
 * two named readings for one label, empty its absence record and move its fact budget from
 * k = 1 to k = 2 on a claim nobody measured. A wiring car that made four rows less legible to
 * buy uniformity is not this one. Say "veto" to table it anyway.
 *
 * ⚠ AND THE SAME SHAPE SURVIVES ELSEWHERE ON THIS LEAF, RECORDED RATHER THAN SWEPT UP:
 * `supplyLogisticsPoolKey` (DS-DEF-6) still builds its five keys through a local arrow. It is
 * a different block with a different chair row, so it is named here and left for its own car.
 *
 * ⛔⛔ AND THE INSTRUMENT MAY NOT BE NAMED HERE, WHICH IS WHY THIS BLOCK TALKS AROUND IT.
 * The census walker's island fence scans every file under `src/` for the BARE MODULE NAME of
 * each of its eleven modules and refuses a hit outside `src/domain/prose/` — by raw text,
 * comments included, because a product surface that has learnt the instrument's name is one
 * refactor away from importing it. A first cut of this docblock spelled the module and the
 * fence caught it, which is the fence working. Cite the DIRECTORY, never the module.
 */

/**
 * DS-DEF-2 row 1 — BEASTS & MONSTERS: the threat tier against a perimeter and a force.
 *
 * Each tier has its OWN situations rather than a clean cross-product, because the corpus
 * wrote the combinations that mean something: a plagued country with a wall and nobody on
 * it is a story; a quiet heartland with a force and no wall is not, and renders nothing.
 * @type {Readonly<Record<string, string>>}
 */
const BEASTS_ROW_POOL = Object.freeze({
  'plagued country, perimeter and force':
    'Beasts & Monsters: plagued, perimeter AND organized force',
  'plagued country, perimeter without force':
    'Beasts & Monsters: plagued, perimeter but NO force to hold it',
  'plagued country, neither':
    'Beasts & Monsters: plagued, NO perimeter and NO force',
  'frontier country, perimeter and force':
    'Beasts & Monsters: frontier, credible deterrence',
  'frontier country, force without a perimeter':
    'Beasts & Monsters: frontier, force without a perimeter',
  'settled country, perimeter':
    'Beasts & Monsters: settled, defenses beyond the need',
  'settled country, neither':
    'Beasts & Monsters: settled, nothing organized',
});

/**
 * WHICH BEASTS SITUATION a town is in, or `''` where the corpus wrote none.
 *
 * ⚠ THE SILENCES ARE THE CORPUS'S AND ARE PRESERVED EXACTLY. A plagued or settled town with
 * a force and no perimeter, and a frontier town with a perimeter and no force, have no pool:
 * the corpus did not write those readings and the desk says nothing rather than rounding
 * them into a neighbour. `settled country, perimeter` deliberately does not consult the
 * force at all, because a wall in a quiet country is the more specific fact and is read
 * first — which is the branch the shipped desk already took.
 * @param {string} family the CORPUS family word from `measuredMonsterFamily`
 * @param {boolean} perimeter @param {boolean} force @returns {string}
 */
function beastsRowSituation(family, perimeter, force) {
  if (family === 'plagued') {
    if (perimeter) return force ? 'plagued country, perimeter and force' : 'plagued country, perimeter without force';
    return force ? '' : 'plagued country, neither';
  }
  if (family === 'frontier') {
    if (perimeter) return force ? 'frontier country, perimeter and force' : '';
    return force ? 'frontier country, force without a perimeter' : '';
  }
  if (perimeter) return 'settled country, perimeter';
  return force ? '' : 'settled country, neither';
}

/**
 * DS-DEF-2 row 1's pool key.
 * @param {unknown} monsterThreat @param {boolean} perimeter @param {boolean} force
 * @returns {string|null}
 */
export function beastsRowPoolKey(monsterThreat, perimeter, force) {
  const family = measuredMonsterFamily(monsterThreat);
  if (!family) return null;
  return BEASTS_ROW_POOL[beastsRowSituation(family, perimeter, force)] || null;
}

/**
 * DS-DEF-2 row 2 — INVASION & WAR: walls against a professional garrison or a militia.
 * TOTAL over the six situations the eight boolean combinations collapse into.
 * @type {Readonly<Record<string, string>>}
 */
const INVASION_ROW_POOL = Object.freeze({
  'walls, professional garrison': 'Invasion & War: walls AND professional garrison',
  'walls, citizen militia': 'Invasion & War: walls with citizen militia',
  'walls, no force': 'Invasion & War: walls with NO force',
  'no walls, professional garrison': 'Invasion & War: force with NO walls',
  'no walls, citizen militia': 'Invasion & War: militia only',
  'no walls, no force': 'Invasion & War: neither walls nor force',
});

/**
 * WHICH INVASION SITUATION a town is in. Total: this lens is never silent.
 *
 * ⚠ A GARRISON OUTRANKS A MILITIA, which is why the eight combinations are six situations:
 * the corpus distinguishes the two forces and a town holding both is defended by the
 * professionals, so `garrison` is read before `militia` on both sides of the wall.
 * @param {boolean} walls @param {boolean} garrison @param {boolean} militia
 * @returns {string}
 */
function invasionRowSituation(walls, garrison, militia) {
  if (walls) {
    if (garrison) return 'walls, professional garrison';
    return militia ? 'walls, citizen militia' : 'walls, no force';
  }
  if (garrison) return 'no walls, professional garrison';
  return militia ? 'no walls, citizen militia' : 'no walls, no force';
}

/**
 * DS-DEF-2 row 2's pool key.
 * @param {boolean} walls @param {boolean} garrison @param {boolean} militia
 * @returns {string}
 */
export function invasionRowPoolKey(walls, garrison, militia) {
  return INVASION_ROW_POOL[invasionRowSituation(walls, garrison, militia)];
}

/**
 * DS-DEF-2 row 3 — INTERNAL SECURITY: a court against a place to hold people.
 * TOTAL over the four combinations — the corpus wrote all four, including both halves
 * without the other, because "detention without process" is a different town from
 * "court without detention".
 *
 * ⭐ THE ONE ROW OF THE FIVE WITH NO TABLE, AND THE ABSENCE IS THE POINT. Every key here is
 * a plain literal returned from a guarded branch, so the wiring census recovers it on RUNG 1
 * with the branch's OWN fields — `court` and `prison`, this block's only fact pair. See the
 * exposure docblock above for why a table would be a loss here and a gain on the other four.
 * @param {boolean} court @param {boolean} prison @returns {string}
 */
export function internalRowPoolKey(court, prison) {
  if (court && prison) return 'Internal Security: full legal chain (court AND prison)';
  if (court) return 'Internal Security: court without detention';
  return prison ? 'Internal Security: detention without process' : 'Internal Security: no legal infrastructure';
}

/**
 * DS-DEF-2 row 4 — ECONOMIC SURVIVAL: the band of the economic defence score.
 *
 * ⭐ `scoreBand` is the canonical band function — `STRONG · ADEQUATE · WEAK · CRITICAL`,
 * commented in its own module as "the frozen four; never extend" — and the corpus keys four
 * pools on exactly those words. An EXACT 1:1, and it reads ONE score, so this row needs
 * nothing like the overall `avgScore` mean that DS-DEF-1 waits on.
 *
 * ⚠ THE TABLE IS NOW THE ROSTER, WHERE THE CORPUS LOOKUP USED TO BE. The shipped key
 * function built the key by template and then asked `CORPUS['DS-DEF-2'].pools[key]` whether
 * the corpus carried it — a guard that answered the same thing this table answers, one
 * indirection later and invisibly to any reader outside the running process. Both halves of
 * the 1:1 are bound by the desk suite instead: every band word `scoreBand` can emit is a key
 * of this table, and every value of it is a live pool of the shipped corpus. A band the
 * corpus stopped carrying reds an arm rather than going quiet at runtime.
 * @type {Readonly<Record<string, string>>}
 */
const ECONOMIC_ROW_POOL = Object.freeze({
  STRONG: 'Economic Survival: STRONG',
  ADEQUATE: 'Economic Survival: ADEQUATE',
  WEAK: 'Economic Survival: WEAK',
  CRITICAL: 'Economic Survival: CRITICAL',
});

/**
 * DS-DEF-2 row 4's pool key. An absent or non-finite score is SILENCE, never CRITICAL.
 * @param {unknown} economicScore @returns {string|null}
 */
export function economicRowPoolKey(economicScore) {
  if (typeof economicScore !== 'number' || !Number.isFinite(economicScore)) return null;
  return ECONOMIC_ROW_POOL[scoreBand(economicScore)] || null;
}

/**
 * DS-DEF-2 row 5 — DISASTERS & FAMINE: reserves against medical provision.
 * TOTAL over the five situations the corpus actually carries.
 * @type {Readonly<Record<string, string>>}
 */
const DISASTER_ROW_POOL = Object.freeze({
  'granary, hospital': 'Disasters & Famine: granary AND hospital',
  'granary, parish care': 'Disasters & Famine: granary AND parish care only',
  'granary, no medical provision': 'Disasters & Famine: granary, NO medical provision',
  'no reserves, hospital': 'Disasters & Famine: NO reserves, hospital present',
  'no reserves, no medical provision': 'Disasters & Famine: NO reserves, NO medical provision',
});

/**
 * WHICH DISASTER SITUATION a town is in. Total: this lens is never silent.
 *
 * ⚠ AND THE SENTENCE ABOVE IS WORDED TO KEEP AN INSTRUMENT QUIET, WHICH IS WORTH THE LINE.
 * The alias draft's `docblock` evidence kind proposes a candidate alias from any composer
 * COMMENT line that names both a relation endpoint's leaf and a census read path's root leaf.
 * A first cut of the sentence above ended "no silence on this one", spelled with the OTHER
 * three-letter noun for a lens of this block, and that put a bare key-function parameter name
 * beside this block's own subject word on one line: the draft then proposed an alias between
 * the two out of nothing but English. SITTING §P.2-27 withdrew exactly that shape from the
 * `generator-write` evidence kind, and it survives in the kind that IS comments by definition.
 * ⛔ THE RULE THIS LEAVES: a comment line here may not set a producer token beside a bare
 * parameter name. The full account is in the SEAM car 3h receipt, for the chair.
 *
 * ⚠ A CHURCH COUNTS AS MEDICAL PROVISION ONLY IN THE GRANARY BRANCH, and that is the
 * corpus's own shape rather than a choice: it wrote `granary AND parish care only` (clergy
 * who tend the sick) but no matching "no reserves, parish care" pool. So for a town with no
 * reserves the split is hospital-or-nothing, and the church is not consulted there — which
 * is why the situation set is five and not six.
 * @param {boolean} granary @param {boolean} hospital @param {boolean} church
 * @returns {string}
 */
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}

/**
 * DS-DEF-2 row 5's pool key.
 * @param {boolean} granary @param {boolean} hospital @param {boolean} church
 * @returns {string}
 */
export function disasterRowPoolKey(granary, hospital, church) {
  return DISASTER_ROW_POOL[disasterRowSituation(granary, hospital, church)];
}

/**
 * THE THREAT-ASSESSMENT DESK — the five readiness rows, each its own rung.
 *
 * DS-DEF-2 frames no DM-editable field, so these return plain rungs rather than
 * projections: the DM's-pen shape is DS-DEF-3's, and handing back a projection where no
 * DM field exists would be ceremony rather than protection.
 *
 * ⛔ THE FORCE ROWS READ THE LIVE ROSTER, NOT `defenseProfile.institutions`. Those buckets
 * are a generation-time snapshot with a single writer at assembly, and every ruin path
 * replaces its roster row immutably — so a flattened citadel stays in the snapshot's
 * `walls` bucket forever and the ruin stamp never reaches it. `standingDefenseForces`
 * re-derives from `settlement.institutions` through the canonical live filter, which is
 * why a ruined citadel does not read here as standing walls.
 *
 * @param {{name?: string, config?: {monsterThreat?: unknown}|null, institutions?: unknown,
 *   defenseProfile?: {scores?: {economic?: unknown}|null}|null,
 *   economicState?: {compound?: {inst?: Record<string, unknown>}|null}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{beasts: object|null, invasion: object|null, internal: object|null,
 *   economic: object|null, disaster: object|null}>}
 */
export function defenseThreatProse(settlement, options = {}) {
  const dp = settlement?.defenseProfile || {};
  const compound = settlement?.economicState?.compound?.inst || {};
  const slots = { settlement: properFill(text(settlement?.name)) };

  const forces = standingDefenseForces(settlement);
  const walls = forces.walls.present;
  const garrison = forces.garrison.present;
  const militia = forces.militia.present;

  // ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3f), as is every entry point on this leaf. The
  // spine key is this desk's own key function and every bag is unchanged; the candidates
  // leaf is EMPTY until car 9 authors it, and an empty list composes to the kernel's own
  // draw, so the manifest cannot move.
  //
  // ⛔ WHAT THE LEAF IS HANDED HERE, AND WHY IT IS THE SETTLEMENT. Alone among the six desks
  // this one takes no `readings` object: every entry point takes `(settlement, options)` and
  // derives its own locals. So the reading it holds IS the settlement, and that is what it
  // hands over — a name it already has, never a fresh `{ dp, compound, forces }` wrapper,
  // which would mint those names into the wiring census's producer index (car 3f-0, and the
  // fence arm that now refuses it). ⚠ ONE FACT IS THEREBY OUT OF THE LEAF'S REACH and is
  // recorded rather than smuggled: DS-DEF-4's `structureKey` is a CALLER'S argument, not a
  // settlement field, so a car-9 predicate over it needs a shape this signature does not
  // have. That is a wiring row for car 9, not a wrapper for this car.
  /** @param {string|null} poolKey */
  const line = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-DEF-2', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-2', settlement),
    })
    : null);
  /** @param {string|null} poolKey */
  const rung = (poolKey) => (poolKey ? legibilityRung('', line(poolKey), []) : null);

  return Object.freeze({
    beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia)),
    invasion: rung(invasionRowPoolKey(walls, garrison, militia)),
    internal: rung(internalRowPoolKey(
      civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison),
    )),
    economic: rung(economicRowPoolKey(dp.scores?.economic)),
    disaster: rung(disasterRowPoolKey(
      civicFlag(compound.hasGranary), civicFlag(compound.hasHospital), civicFlag(compound.hasChurch),
    )),
  });
}

/**
 * Every canonical monster-threat tier this desk recognises, exported so the vocabulary
 * walker can bind it to `MONSTER_THREAT_TIERS` without reading the source.
 * @type {ReadonlyArray<string>}
 */
export const RECOGNISED_MONSTER_TIERS = Object.freeze(Object.keys(MONSTER_FAMILY_OF));

/**
 * ── ⭐ THE TERRAIN MAP — a closed vocabulary of seven, bound to its producer BOTH WAYS ──
 *
 * DS-DEF-1 asks whether the ground helps the defender. The estate has no typed answer:
 * `resourceAnalysis.terrain` is `TERRAIN_DATA[k].name`, a display word, and the only
 * defensive statement in the data is English inside `strategicValue`
 * ("defensible position", "difficult to besiege", "exposed to raids"). Parsing that prose
 * at runtime is the config-key-walker defect in miniature, so the classification is a MAP —
 * the same shape as `MONSTER_FAMILY_OF`, held total against `TERRAIN_DATA` in both
 * directions by the desk suite, so a terrain added or renamed reds instead of silently
 * dropping out.
 *
 * ⚠ TWO TERRAINS ARE DELIBERATELY IN NEITHER POOL, and that is a reading rather than a gap.
 * The corpus wrote FAVOURABLE ("the approach is narrow… has to come the long way and in the
 * open") and EXPOSED ("no hill and no narrows"). A coastal or riverside town has a water
 * flank: it is not narrows, and it is not nothing. Both pools would be false of it, so the
 * lens is SILENT there. Dormant is a true statement, not a fallback.
 * @type {Readonly<Record<string, string>>}
 */
const TERRAIN_DEFENCE_OF = Object.freeze({
  // The three whose own strategicValue text states a defensive property.
  Mountain: 'terrain FAVOURABLE to the defender',
  Hills: 'terrain FAVOURABLE to the defender',
  Forest: 'terrain FAVOURABLE to the defender',
  // Open ground. Plains' own entry says "exposed to raids".
  Plains: 'terrain EXPOSED',
  'Desert/Arid': 'terrain EXPOSED',
  // Coastal and Riverside are absent ON PURPOSE — see the note above.
});

/**
 * ── THE PRIZE MAP — is this town worth an army's season? ─────────────────────────────
 *
 * Keyed on the terrain for the same reason: `strategicValue` is a prose string
 * ("High - controls sea routes and naval access") derived from the same terrain record, so
 * keying on the record avoids parsing the sentence while reading exactly the same fact. The
 * desk suite binds each entry to the "High - " / "Low-" prefix its terrain actually carries,
 * so the map cannot drift from the data it claims to summarise.
 *
 * ⚠ `Medium` and `Medium-High` are in NEITHER pool. The corpus wrote HIGH ("holds something
 * worth taking") and LOW ("not a prize") and no middle, and Hills' Medium-High value is
 * DEFENSIVE ("defensible terrain, good visibility") rather than a prize — routing it to HIGH
 * would print a claim its own data does not make.
 * @type {Readonly<Record<string, string>>}
 */
const TERRAIN_PRIZE_OF = Object.freeze({
  Coastal: 'strategic value HIGH',
  Mountain: 'strategic value HIGH',
  Forest: 'strategic value LOW',
});

/** Every terrain name this desk classifies, exported for the both-ways binding. */
export const TERRAIN_DEFENCE_NAMES = Object.freeze(Object.keys(TERRAIN_DEFENCE_OF));
/** Every terrain name this desk reads a prize value for. */
export const TERRAIN_PRIZE_NAMES = Object.freeze(Object.keys(TERRAIN_PRIZE_OF));

/**
 * DS-DEF-1 lens 1 — THE READINESS BAND.
 *
 * ⭐ Reads `defenseProfile.readiness.score`, NOT `avgScore(scores)`. See the header: the
 * badge printed in the same page header is computed from this exact number, so banding any
 * other quantity would let the page contradict itself in one glance. An absent or
 * non-numeric score is SILENCE — a settlement with no readiness reading is not a CRITICAL
 * one, and `scoreBand` would happily call it that.
 * @param {unknown} readinessScore @returns {string|null}
 */
export function posturePoolKey(readinessScore) {
  if (typeof readinessScore !== 'number' || !Number.isFinite(readinessScore)) return null;
  const key = `readiness ${scoreBand(readinessScore)}`;
  return CORPUS['DS-DEF-1'].pools[key] ? key : null;
}

/**
 * DS-DEF-1 lens 2 — DOES THE GROUND HELP? Silent for a terrain the map does not classify,
 * and for a settlement with no terrain reading at all.
 * @param {unknown} terrain @returns {string|null}
 */
export function terrainDefencePoolKey(terrain) {
  return TERRAIN_DEFENCE_OF[text(terrain)] || null;
}

/**
 * DS-DEF-1 lens 3 — IS THE TOWN A PRIZE? Silent for the middle of the range, which the
 * corpus did not write.
 * @param {unknown} terrain @returns {string|null}
 */
export function strategicPrizePoolKey(terrain) {
  return TERRAIN_PRIZE_OF[text(terrain)] || null;
}

/**
 * THE DEFENSIVE-POSTURE DESK — DS-DEF-1's three lenses at the header position.
 *
 * ⛔⛔ THE SECOND DM'S-PEN BLOCK, AND IT NEARLY SHIPPED AS PLAIN RUNGS. A first cut of this
 * function returned bare rungs on the reasoning that `guardEffectivenessDesc` is "not a DM
 * path, so there is nothing to protect". THE REGISTRY SAYS OTHERWISE, and an arm below
 * asked it rather than believing the reasoning:
 *
 *     DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-1'] === 'economicState.safetyProfile.guardEffectivenessDesc'
 *     isDmEditableProsePath(that path)     === true
 *
 * DS-DEF-1 is the leaf's OTHER DM-pen block — `deriveGuardAssessment` returns that exact
 * field verbatim, and the tab prints it as the Guard Assessment paragraph these lenses sit
 * next to. So every rung here goes back through `projectBesideDmField`, which has nowhere
 * to put a write: it returns the DM's string BY IDENTITY and offers the machine line as a
 * separate adjacent field. A caller that receives this shape CANNOT render a machine
 * sentence into the position the DM's own sentence occupies.
 *
 * ⭐ The lesson is the desk's own, one layer up: a claim about a REGISTRY is checked
 * against the registry. Reasoning about which fields "feel" DM-editable is how the
 * overwrite gets written.
 *
 * @param {{name?: string, defenseProfile?: {readiness?: {score?: unknown}|null}|null,
 *   resourceAnalysis?: {terrain?: unknown}|null,
 *   economicState?: {safetyProfile?: {guardEffectivenessDesc?: unknown}|null}|null
 *   }|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{posture: object|null, terrain: object|null, prize: object|null}>}
 */
export function defensePostureProse(settlement, options = {}) {
  const slots = { settlement: properFill(text(settlement?.name)) };
  const terrain = settlement?.resourceAnalysis?.terrain;
  // THE DM'S FIELD ALL THREE LENSES SIT BESIDE. Read through the projection's own path
  // reader so this desk cannot spell the path differently from the registry that declares it.
  const dmField = readProsePath(settlement, DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-1']);

  /** @param {string|null} poolKey */
  const projected = (poolKey) => {
    if (!poolKey) return null;
    const line = composeStateProse(CORPUS, 'DS-DEF-1', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-1', settlement),
    });
    return Object.freeze({
      ...projectBesideDmField(dmField, line?.text ?? null),
      rung: legibilityRung('', line, []),
    });
  };

  return Object.freeze({
    posture: projected(posturePoolKey(settlement?.defenseProfile?.readiness?.score)),
    terrain: projected(terrainDefencePoolKey(terrain)),
    prize: projected(strategicPrizePoolKey(terrain)),
  });
}

/**
 * ── DS-DEF-4 · CRIMINAL STRUCTURE + CAPTURE CONSEQUENCE ──────────────────────────────
 *
 * Two lenses, and BOTH of their vocabularies are exact 1:1s with a producer — which is why
 * this block needs no judgment about where to cut a band. `deriveCriminalStructure` returns
 * one of `organized · semi-organized · diffuse` or null, and the corpus wrote exactly four
 * `structure …` pools including the null one. `computeCriminalCaptureState` is typed
 * `'none'|'adversarial'|'equilibrium'|'corrupted'|'capture'` and the corpus wrote exactly
 * those five `capture …` pools. Both are asserted TOTAL in both directions by the desk
 * suite, the label-trap rule applied to two more vocabularies.
 *
 * ⚠ AN ABSENT CAPTURE STATE IS NOT `none`. `DefenseTab` reads
 * `powerStructure?.criminalCaptureState || 'none'` for its own styling, and that `|| 'none'`
 * is right for a colour and wrong for a sentence: "Nothing criminal has reached the hall" is
 * a claim, and a settlement with no power structure has not been measured for it. The desk
 * accepts only a value the producer's own vocabulary contains and is otherwise silent.
 *
 * ⚠ `{seat}` IS THE GOVERNING BODY'S OWN GENERATED NAME — `powerStructure.government`,
 * which `rulingStructure` sets from the governing faction entry (*Town Council*, *Headman's
 * Authority*, *Grand Merchant Oligarchy*). The annex bans a baked noun here in terms: "prose
 * that hard-codes *the council* is wrong on most settlements in the realm". Where the name
 * is missing the fill is refused and the kernel drops the variants that need it — one of the
 * three variants in each capture pool; the other two say "the hall" in their own words.
 */

/**
 * The four `structure …` pool keys, by the producer's own key. `null` is a reading.
 *
 * Typed as an open `Record` rather than left to its literal shape because the lookup below
 * is keyed on a PRODUCER value, not on a key this file spells: an unrecognised structure
 * must resolve to `undefined` and fall through to `null` — the desk's own silence — rather
 * than being a compile-time impossibility. `RECOGNISED_CRIMINAL_STRUCTURES` is the runtime
 * both-ways binding the suite asserts totality against; the type is not that instrument.
 * @type {Readonly<Record<string, string>>}
 */
const CRIMINAL_STRUCTURE_POOL = Object.freeze({
  organized: 'structure organized',
  'semi-organized': 'structure semi-organized',
  diffuse: 'structure diffuse',
});

/** The producer's five capture states, exported so the suite can bind them both ways. */
export const CRIMINAL_CAPTURE_STATES = Object.freeze([
  'none', 'adversarial', 'equilibrium', 'corrupted', 'capture',
]);

/** Every structure key this desk recognises, exported for the same both-ways binding. */
export const RECOGNISED_CRIMINAL_STRUCTURES = Object.freeze(Object.keys(CRIMINAL_STRUCTURE_POOL));

/**
 * DS-DEF-4 lens 1 — WHAT SHAPE THE CRIME HAS. `null` from the producer is the fourth
 * reading, not an absence: "no criminal infrastructure has been identified" is a finding.
 * @param {unknown} structureKey the `key` of `deriveCriminalStructure`, or null
 * @returns {string|null}
 */
export function criminalStructurePoolKey(structureKey) {
  const key = text(structureKey);
  if (!key) return 'structure null (nothing organized recognized)';
  return CRIMINAL_STRUCTURE_POOL[key] || null;
}

/**
 * DS-DEF-4 lens 2 — HOW FAR IT HAS REACHED INTO THE HALL. Total over the producer's typed
 * vocabulary; anything else is silence rather than `none`.
 * @param {unknown} captureState @returns {string|null}
 */
export function criminalCapturePoolKey(captureState) {
  const state = text(captureState);
  return CRIMINAL_CAPTURE_STATES.includes(state) ? `capture ${state}` : null;
}

/**
 * THE CRIMINAL-ARCHITECTURE DESK — DS-DEF-4's two lenses at one position.
 *
 * ⚠ It takes the structure KEY rather than deriving it, so the tab hands over the value it
 * is already rendering from (`deriveCriminalStructure(r)`) and the sentence and the card
 * beneath it cannot be about two different classifications.
 *
 * @param {{name?: string, powerStructure?: {government?: unknown,
 *   criminalCaptureState?: unknown}|null}|null|undefined} settlement
 * @param {unknown} structureKey
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{structure: object|null, capture: object|null}>}
 */
export function defenseCriminalProse(settlement, structureKey, options = {}) {
  const power = settlement?.powerStructure || {};
  const slots = {
    settlement: properFill(text(settlement?.name)),
    seat: properFill(text(power.government)),
  };

  /** @param {string|null} poolKey */
  const rung = (poolKey) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-4', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-4', settlement),
    }), [])
    : null);

  return Object.freeze({
    structure: rung(criminalStructurePoolKey(structureKey)),
    capture: rung(criminalCapturePoolKey(power.criminalCaptureState)),
  });
}

/**
 * ── DS-DEF-11 · WHY THE WALL, AND WHY NOT ────────────────────────────────────────────
 *
 * Five pools over the perimeter, the country, the tier and the upkeep gate. The one block
 * on this leaf that needs a SECOND slot, and the slot is the interesting part.
 *
 * ── ⭐ `{defwork}`: THE TOWN'S OWN WALL BY ITS RECORDED NAME ─────────────────────────
 * The annex is explicit — "the roster row `institutions.walls` matched (wall · citadel ·
 * palisade · earthwork); NEVER a baked or invented noun, and never offered to a settlement
 * whose wall-class list is empty" — and its shape is `bare-common`, which forbids a leading
 * determiner (the seam supplies one) and requires a lowercase initial.
 *
 * Catalogue rows are Capitalised ("Massive Walls", "Inner Citadel"), so the fill lowercases.
 * ⚠ AND IT REFUSES ANY NAME THAT IS NOT WALL-CLASS VOCABULARY. Lowercasing is safe for a
 * common noun and destructive for a proper one: "Vaelthorn Bastion" would become "the
 * vaelthorn bastion", which is a name the town does not use. So the fill is offered only
 * when the recorded name actually contains one of the four wall words the annex names, and
 * otherwise returns undefined — at which point the kernel's anchored liveness drops the
 * variants that need the slot and the pool degrades to the ones that never did (R-DST-K).
 * Refusing a fill is the designed behaviour; forcing one is how a page starts calling a
 * place by a name nobody there uses.
 * @type {ReadonlyArray<string>}
 */
const DEFWORK_WORDS = Object.freeze(['wall', 'citadel', 'palisade', 'earthwork']);

/**
 * A `bare-common` fill, or `undefined` — mirroring `fillShapeViolation`'s BARE_COMMON
 * branch, the same half-of-the-contract `economyStateProse` keeps for `{access}`.
 * @param {string} value @returns {string|undefined}
 */
function bareCommonFill(value) {
  if (!value) return undefined;
  if (/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(value)) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[a-z]/.test(value) ? value : undefined;
}

/**
 * The `{defwork}` fill for a settlement: its first STANDING wall-class work, lowercased,
 * and only when the recorded name is wall-class vocabulary. See the note above for why a
 * name outside that vocabulary is refused rather than lowercased.
 * @param {Readonly<Record<string, {names: ReadonlyArray<string>}>>} forces
 * @returns {string|undefined}
 */
export function defworkFill(forces) {
  for (const name of forces.walls.names) {
    const lowered = text(name).toLowerCase();
    if (!DEFWORK_WORDS.some((word) => lowered.includes(word))) continue;
    const fill = bareCommonFill(lowered);
    if (fill) return fill;
  }
  return undefined;
}

/**
 * DS-DEF-11's pool key.
 *
 * JUDGMENT (vetoable): among the three WALLED pools, STRAINED OUTRANKS THREATENED OUTRANKS
 * QUIET. A frontier town whose muster is underfunded satisfies both of the first two, and
 * the corpus's STRAINED prose is the more specific and the more urgent of them — "the
 * {defwork} around {settlement} is sound and the muster behind it is thinning, which is the
 * kind of arithmetic a town notices late". Saying the country presses instead would print
 * the less alarming half of a true pair. Say "veto" to reorder.
 *
 * ⚠ THE UNWALLED CUT IS NOT INVENTED. `SMALL_TIERS` and `TOWN_PLUS_TIERS` in
 * src/data/constants.js are an EXACT closed partition of `TIER_ORDER`, so the small/large
 * split is the estate's own and the desk suite binds it both ways. An unrecognised tier is
 * in neither, and renders silence rather than guessing which side of the line a town is on.
 *
 * @param {boolean} walls @param {unknown} monsterThreat @param {unknown} militaryGate
 * @param {unknown} tier @returns {string|null}
 */
export function wallRationalePoolKey(walls, monsterThreat, militaryGate, tier) {
  if (walls) {
    if (typeof militaryGate === 'number' && Number.isFinite(militaryGate) && militaryGate < 1) {
      return 'WALLED-STRAINED';
    }
    const family = measuredMonsterFamily(monsterThreat);
    if (!family) return null;
    return family === 'settled' ? 'WALLED-QUIET' : 'WALLED-THREATENED';
  }
  const size = text(tier).toLowerCase();
  if (SMALL_TIERS.includes(size)) return 'UNWALLED-SMALL';
  return TOWN_PLUS_TIERS.includes(size) ? 'UNWALLED-LARGE' : null;
}

/**
 * THE WALL-RATIONALE DESK — DS-DEF-11's one lens.
 *
 * ⚠ The perimeter read is `standingDefenseForces`, so a town whose walls have been thrown
 * down is described by the UNWALLED pools, not asked why it keeps a wall it no longer has.
 * DS-DEF-11 frames no DM-editable field, so this is a plain rung.
 *
 * @param {{name?: string, tier?: unknown, institutions?: unknown,
 *   config?: {monsterThreat?: unknown}|null,
 *   defenseProfile?: {economicGates?: {military?: unknown}|null}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{rationale: object|null}>}
 */
export function defenseWallRationaleProse(settlement, options = {}) {
  const forces = standingDefenseForces(settlement);
  const slots = {
    settlement: properFill(text(settlement?.name)),
    defwork: defworkFill(forces),
  };
  const poolKey = wallRationalePoolKey(
    forces.walls.present,
    settlement?.config?.monsterThreat,
    settlement?.defenseProfile?.economicGates?.military,
    settlement?.tier,
  );

  return Object.freeze({
    rationale: poolKey
      ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-11', {
        ...options,
        slots,
        spineKey: poolKey,
        candidates: defenseStateProseCandidates('DS-DEF-11', settlement),
      }), [])
      : null,
  });
}

/**
 * ── DS-DEF-8 · ACTIVE MILITARY STATUS — when a crisis has rewritten the posture ───────
 *
 * The stress override the tab already renders as a Military Status banner. `DefenseTab`
 * picks `stressTypes.find((t) => DEFENSE_STRESS_STATUS[t])`, so the override is ACTIVE
 * exactly when at least one of the settlement's stresses carries a defence posture; this
 * desk asks the same question of the same map rather than keeping a second opinion.
 *
 * ⛔⛔ ONE POOL OF THE FOUR IS DECLARED DARK, AND IT IS A FINDING RATHER THAN AN OMISSION.
 * `multiple stresses, one posture shown` claims, in all three of its variants, that the
 * posture named is "the heaviest"/"the loudest" of several. MEASURED: `STRESS_TYPE_MAP`
 * carries `probability` (rarity) and no severity at all, and the banner picks the FIRST
 * entry of `settlement.stress` that maps — roll order, not rank. Printing that pool would
 * make the page assert a ranking nothing computes, which is a false statement rather than a
 * missing one, and this desk's whole subject is the difference.
 * ⭐ THE ONE ACT THAT LIGHTS IT: give the posture pick a defined severity order, so "the
 * heaviest" becomes true. That is a change to what the banner DISPLAYS and it needs an
 * authored ranking over the fifteen stress types — new content, its own act, its own proof.
 * Declared here and pinned by an arm so the pool cannot be quietly forgotten OR quietly lit.
 * @type {string}
 */
const DEF8_DECLARED_DARK_POOL = 'multiple stresses, one posture shown';

/** The pool declared dark above, exported so the desk suite pins the claim. */
export const DEF8_UNREACHABLE_POOLS = Object.freeze([DEF8_DECLARED_DARK_POOL]);

/**
 * A stress entry as this desk reads it.
 *
 * ⚠ THE SHAPE NAMES ONE FIELD BECAUSE THIS DESK READS ONE FIELD. `settlement.stress` is
 * generator-authored and its payload differs by stress type, so `type` — which goes through
 * `text()` before it indexes anything — is the only field any branch below consults. A wider
 * shape would assert fields nothing here reads; `any` asserted something worse, that EVERY
 * field is present and correctly typed, on a value the saves disagree about the shape of.
 * @typedef {{ type?: unknown }} StressEntry
 */

/**
 * Every stress on a settlement, as an array. Mirrors `DefenseTab`'s own normalisation —
 * the field is a single object on some saves and an array on others.
 * @param {unknown} stress @returns {StressEntry[]}
 */
function stressList(stress) {
  if (Array.isArray(stress)) return stress.filter(Boolean);
  return stress ? [stress] : [];
}

/**
 * Is a defence-posture override active, and which stress carries it? Returns the stress
 * entry the banner would show, or null.
 * @param {unknown} stress @returns {StressEntry|null}
 */
export function activeDefenceStress(stress) {
  return stressList(stress).find((entry) => DEFENSE_STRESS_STATUS[text(entry?.type)]) || null;
}

/**
 * DS-DEF-8 lens 1 — THE FRAMING. An override is on, so the ordinary reading of this town's
 * defences does not describe it today.
 * @param {unknown} stress @returns {string|null}
 */
export function militaryOverridePoolKey(stress) {
  return activeDefenceStress(stress) ? 'override active (generic framing)' : null;
}

/**
 * DS-DEF-8 lens 2 — IS THE TOWN'S CONTINUATION IN QUESTION?
 *
 * ⚠ NOT `stress.viabilityNote`, although the block's title names it. MEASURED: all fifteen
 * entries of `STRESS_TYPE_MAP` carry a `viabilityNote`, so its presence is a CONSTANT and a
 * split on it would put every settlement in the `threatened` pool and leave `intact`
 * unreachable — a default wearing a reading's clothes, and an unusually convincing one
 * because the field is named for the question.
 *
 * The measured verdict is `economicViability.viable`, which `economy/viability.js` derives
 * as `criticalIssues.length === 0`. A settlement with no viability reading at all is SILENT
 * here: an unmeasured continuation is not an intact one.
 * @param {unknown} stress @param {unknown} viable @returns {string|null}
 */
export function viabilityUnderStressPoolKey(stress, viable) {
  if (!activeDefenceStress(stress)) return null;
  if (viable === false) return 'override active, viability threatened';
  return viable === true ? 'override active, viability intact' : null;
}

/**
 * THE MILITARY-STATUS DESK — DS-DEF-8's two live lenses at the banner position.
 *
 * DS-DEF-8 frames no DM-editable field (the banner renders `stress.summary` and
 * `stress.viabilityNote`, both generator-authored rather than DM-editable), so these are
 * plain rungs, on DS-DEF-2's reasoning.
 *
 * @param {{name?: string, stress?: unknown,
 *   economicViability?: {viable?: unknown}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{override: object|null, viability: object|null}>}
 */
export function defenseMilitaryStatusProse(settlement, options = {}) {
  const slots = { settlement: properFill(text(settlement?.name)) };
  const stress = settlement?.stress;

  /** @param {string|null} poolKey */
  const rung = (poolKey) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-8', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-8', settlement),
    }), [])
    : null);

  return Object.freeze({
    override: rung(militaryOverridePoolKey(stress)),
    viability: rung(viabilityUnderStressPoolKey(stress, settlement?.economicViability?.viable)),
  });
}

/**
 * ── DS-DEF-5 · ARMED FORCES & FORTIFICATIONS — five lenses over the STANDING roster ──
 *
 * The block whose title names `defenseProfile.institutions{...}`, and which this desk
 * deliberately does NOT read there. Those buckets are the generation-time snapshot; a
 * paragraph about what a town can field must be about what still stands, so every lens
 * below reads `standingDefenseForces`. See defenseInstitutionBuckets.js for the
 * measurement, and DS-DEF-2 above for the defect that made the distinction visible.
 *
 * ⚠ Does the country WARRANT a chartered specialist hall? Keyed on the canonical producer
 * token through `normalizeMonsterThreat`, never on a display word — the label-trap rule,
 * fourth instance. `frontier` and `plagued` are the two tiers whose countries produce the
 * work a garrison is the wrong instrument for; a settled heartland does not warrant one, so
 * the ABSENT pool stays silent there rather than scolding a quiet town for a hall it has no
 * use for. An un-normalised tier warrants nothing and renders silence.
 * @param {unknown} monsterThreat @returns {boolean}
 */
export function countryWarrantsCharter(monsterThreat) {
  const family = measuredMonsterFamily(monsterThreat);
  return family === 'frontier' || family === 'plagued';
}

/**
 * DS-DEF-5 lens 1 — THE PERIMETER. Total: a town either controls its entry points or it
 * does not, and both readings are measurements.
 * @param {boolean} walls @returns {string}
 */
export function fortificationPoolKey(walls) {
  return walls ? 'walls PRESENT' : 'walls ABSENT';
}

/**
 * DS-DEF-5 lens 2 — WHO HOLDS IT. A standing garrison outranks a militia outranks a watch,
 * because the corpus wrote each as a different kind of town and a town with a garrison is
 * described by its garrison.
 *
 * ⚠ `NO organized force at all` is NOT "no garrison". Its prose says "no command, no
 * training and no way to coordinate a response", which is false of a town that retains a
 * mercenary company or a charter hall — those are commands, merely bought ones. So it fires
 * only when NOTHING stands, which is the same reading `DefenseTab`'s own `hasAnyForce`
 * already makes on the screen beside it; a town whose only force is contracted is described
 * by lens 3 instead of being called defenceless.
 * @param {Readonly<Record<string, {present: boolean}>>} forces
 * @returns {string|null}
 */
export function forceCorePoolKey(forces) {
  if (forces.garrison.present) return 'garrison PRESENT';
  if (forces.militia.present) return 'militia PRESENT (no garrison)';
  if (forces.watch.present) return 'watch PRESENT';
  const anything = forces.mercenary.present || forces.charter.present || forces.magicDef.present;
  return anything ? null : 'NO organized force at all';
}

/**
 * DS-DEF-5 lens 3 — CONTRACTED FORCE. Present only. The corpus wrote no "hires nobody"
 * pool, and inventing silence-as-absence prose here would be the desk improvising past its
 * own corpus.
 * @param {Readonly<Record<string, {present: boolean}>>} forces @returns {string|null}
 */
export function contractedForcePoolKey(forces) {
  return forces.mercenary.present ? 'mercenary / contracted forces PRESENT' : null;
}

/**
 * DS-DEF-5 lens 4 — SPECIALIST RESPONSE. Present, or ABSENT WHERE THE COUNTRY WARRANTS
 * ONE. The second half is why this lens takes the threat tier: "retains no specialists" is
 * only a finding about a town the country actually presses.
 * @param {Readonly<Record<string, {present: boolean}>>} forces @param {unknown} monsterThreat
 * @returns {string|null}
 */
export function charterPoolKey(forces, monsterThreat) {
  if (forces.charter.present) return 'charter hall PRESENT (specialist monster response)';
  return countryWarrantsCharter(monsterThreat)
    ? 'charter hall ABSENT where the country warrants one' : null;
}

/**
 * DS-DEF-5 lens 5 — ARCANE PROVISION. Total over a world where magic exists, and SILENT
 * where it does not.
 *
 * ⭐ That gate is a measurement, not a hedge. A dead-magic world is a world setting the
 * generator already reads (`defenseGenerator`'s readiness call at :631), and in such a
 * world "what arrives unseen here goes undetected and therefore unanswered" is not a
 * shortfall — it is a category that does not exist. Printing it would be the machine
 * improvising a lack out of a setting.
 *
 * ⚠ THE ANSWER ARRIVES ALREADY DECIDED, AND THIS FUNCTION NEVER SPELLS THE DIAL ITSELF.
 * The caller passes `magicWorksAt(settlement)`; see `defenseForcesProse` below for why the
 * raw `config.magicExists` poke that used to sit there is gone. `false` here means the
 * settlement carries a magic axis that says magic does not function — never "no axis was
 * recorded", which says nothing and must not silence the lens.
 * @param {Readonly<Record<string, {present: boolean}>>} forces
 * @param {unknown} magicWorks the `magicWorksAt` verdict; only an exact `false` gates
 * @returns {string|null}
 */
export function arcaneDefensePoolKey(forces, magicWorks) {
  if (magicWorks === false) return null;
  return forces.magicDef.present ? 'arcane defense PRESENT' : 'arcane defense ABSENT';
}

/**
 * THE ARMED-FORCES DESK — DS-DEF-5's five lenses, each its own rung at ONE position.
 *
 * DS-DEF-5 frames no DM-editable field, so these are plain rungs rather than projections,
 * on the same reasoning DS-DEF-2 states: a projection where no DM field exists is ceremony,
 * and it would tell a later reader that a field is at risk when none is.
 *
 * ⚠⚠ THE MAGIC AXIS IS ASKED OF `magicWorksAt`, NOT POKED OUT OF `config`, AND THE
 * OBSERVED-SHAPE RATCHET IS WHY — the `faithField.magicGate01` precedent exactly. This
 * function used to read `config.magicExists` itself, which minted this file its OWN read of
 * a key the generation corpus never observes, and `check-observed-shape-readers` refused it
 * as a NEW row against a new file's ceiling of 0. Calling the estate's one accessor keeps
 * that read in `magicLedger.js`, where the frozen row for it already lives, and leaves
 * exactly one module in the tree that knows how a magic dial is spelled.
 *
 * ⭐ THE READ WAS LIVE, AND THE REPLACEMENT IS BEHAVIOUR-IDENTICAL — MEASURED, NOT ASSUMED.
 * The corpus never observes `magicExists` on `config` because none of its four configs sets
 * it, not because nothing writes it: driven through `generateSettlementPipeline`, a config
 * carrying `magicExists:false` arrives on `settlement.config` intact, and the lens went
 * correctly silent both before and after this change. All four worlds agree — dead-magic
 * with the dial its writers pair it with, dead-magic with the flag alone (the pipeline
 * fills `priorityMagic:0` / `magicLevel:'none'` itself, so `ledger.present` is true either
 * way), live magic, and no magic axis at all.
 *
 * `magicWorksAt` adds the guard the raw read never had: `present === true &&`, so a record
 * that has said NOTHING about magic can no longer be mistaken for one that has said magic
 * is dead. Dormant is a true statement, not a fallback.
 *
 * ⛔ THE ARGUMENT IS WRAPPED AS `{ settlement }` ON PURPOSE — DO NOT "SIMPLIFY" IT TO THE
 * BARE SETTLEMENT. `magicWorksAt` accepts either shape by design, and both are correct at
 * runtime (proved: identical rungs on all four worlds above). But the observed-shape scanner
 * grounds that function's `item?.settlement` read from the shapes its CALL SITES pass, and a
 * bare settlement re-grounds `item` onto the settlement record — which carries no
 * `settlement` key — minting a NEW ceiling-0 row in `magicWorksAt.js`, a file this desk does
 * not own and did not change. MEASURED both ways on this branch: bare argument ⇒
 * `magicWorksAt.js:50 settlement on settlement` NEW; `{ settlement }` ⇒ clean. Passing the
 * worldSnapshot item shape is what every other caller passes, so this call site stops being
 * the odd one out. A cure that plants a red in a shared module is not a cure.
 *
 * @param {{name?: string, institutions?: unknown,
 *   config?: {monsterThreat?: unknown}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{fortification: object|null, force: object|null, contracted: object|null,
 *   charter: object|null, arcane: object|null}>}
 */
export function defenseForcesProse(settlement, options = {}) {
  const forces = standingDefenseForces(settlement);
  const slots = { settlement: properFill(text(settlement?.name)) };
  const config = settlement?.config || {};

  /** @param {string|null} poolKey */
  const rung = (poolKey) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-5', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-5', settlement),
    }), [])
    : null);

  return Object.freeze({
    fortification: rung(fortificationPoolKey(forces.walls.present)),
    force: rung(forceCorePoolKey(forces)),
    contracted: rung(contractedForcePoolKey(forces)),
    charter: rung(charterPoolKey(forces, config.monsterThreat)),
    arcane: rung(arcaneDefensePoolKey(forces, magicWorksAt({ settlement }))),
  });
}

/**
 * THE DESK. Returns the public-order banner's two rungs, each already projected BESIDE the
 * DM's own sentence rather than over it.
 *
 * Each returned entry is the `projectBesideDmField` shape — `{ field, beside, hasField }` —
 * and NOT a bare rung, deliberately: a composer that receives a rung can render it wherever
 * it likes, including in the position the DM's field occupies. Handing back the projection
 * means the only thing the caller can do with the machine line is put it BESIDE.
 *
 * @param {{name?: string, economicState?: {safetyProfile?: {safetyLabel?: unknown,
 *   safetyDesc?: unknown}|null}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{publicOrder: object|null, firstSurvey: object|null}>}
 */
export function defenseStateProse(settlement, options = {}) {
  const safety = settlement?.economicState?.safetyProfile || {};
  const label = safety.safetyLabel;
  const slots = { settlement: properFill(text(settlement?.name)) };

  /** @param {string|null} poolKey */
  const line = (poolKey) => (poolKey
    ? composeStateProse(CORPUS, 'DS-DEF-3', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-3', settlement),
    })
    : null);

  const orderKey = publicOrderPoolKey(label);
  const surveyKey = firstSurveyPoolKey(label);
  const orderLine = line(orderKey);
  const surveyLine = line(surveyKey);

  return Object.freeze({
    // THE DM'S FIELD IS THE SUBJECT OF BOTH PROJECTIONS. `safetyDesc` is the DM's sentence
    // about public order, so both corpus lines sit beside the same field.
    publicOrder: orderKey
      ? Object.freeze({
        ...projectBesideDmField(safety.safetyDesc, orderLine?.text ?? null),
        rung: legibilityRung(text(label), orderLine, []),
      })
      : null,
    firstSurvey: surveyKey
      ? Object.freeze({
        ...projectBesideDmField(safety.safetyDesc, surveyLine?.text ?? null),
        rung: legibilityRung('', surveyLine, []),
      })
      : null,
  });
}

/**
 * ── DS-DEF-6 · SUPPORTING CAPABILITIES — SIX LENSES, AND ONLY TWO MAY SPEAK ──────────
 *
 * `deriveSupportingCapabilities` (defenseDisplay.js:206) is the producer, and it is an
 * unusually clean one: five of its six rows carry a `status` string that is an EXACT 1:1
 * with a corpus pool suffix, and the sixth (Naval Defense) is pushed only when the town has
 * a navy or a port — the same guard the corpus's three naval pools imply.
 *
 * ── ⛔⛔ AND FOUR OF THE SIX MUST NOT SPEAK, BY MEASUREMENT ──────────────────────────
 *
 * The C3 law is a law about FACTS, not about block ids — that is what its own worked
 * example says (DS-ECO-1 speaks prosperity in the header, so DS-ECO-8 GLANCES on its tile,
 * and those are two different blocks). Four of DS-DEF-6's lenses read the same producer
 * values as a LANDED sentence position on the same tab, and the corpus wrote them in prose
 * that is near-verbatim identical. Read side by side, they are not two facts:
 *
 *   LEGAL INFRASTRUCTURE ⇄ `defense.threatAssessment` (DS-DEF-2 row 3, internalRowPoolKey).
 *     Same two producer flags (`compound.inst.hasCourtSystem` × `hasPrison`), same four-way
 *     partition, and the prose collides on the nose:
 *       DS-DEF-6 `None`  "There is no legal machinery at {settlement}. Deterrence extends
 *                         exactly as far as force does and stops there."
 *       DS-DEF-2 `none`  "There is no legal machinery at {settlement}; order here rests on
 *                         force alone, and force alone deters only while it is present."
 *   MAGICAL CAPABILITY  ⇄ `defense.armedForces` (DS-DEF-5 lens 5, arcaneDefensePoolKey).
 *       DS-DEF-6 `None`  "{settlement}'s defense is entirely conventional. Anything that
 *                         arrives invisible arrives unopposed…"
 *       DS-DEF-5 `ABSENT` "{settlement}'s defense is conventional throughout. What arrives
 *                         unseen here goes undetected and therefore unanswered."
 * ⚠ THE MAGIC LENS IS KEYED `Arcane Support` SINCE REVIEW 10 (owner §934.9). It was
 * `Magical Capability`, which is the OVERVIEW row's name for a different fact — the world
 * magic slider's score — while this lens reads the narrow arcane roster `hasMagicInst`. The
 * display label moved first; the corpus key follows it here, so the blocked-pool declaration
 * and the live row can still be read as one thing. The STATUS vocabulary is untouched.
 *
 *   ECONOMIC BACKING    ⇄ `defense.threatAssessment` (DS-DEF-2 row 4, economicRowPoolKey).
 *     Both band `defenseProfile.scores.economic`; DS-DEF-2's own STRONG line already says
 *     "the garrison can be kept paid while they last", which is this lens's whole subject.
 *   MEDICAL READINESS   ⇄ `defense.threatAssessment` (DS-DEF-2 row 5, disasterRowPoolKey).
 *     DS-DEF-2's row reads `hasGranary` × `hasHospital` × `hasChurch` and speaks BOTH the
 *     reserve and the medical halves ("holds food against a bad year and has somewhere to
 *     put the sick"); this lens is the second half of that sentence on its own.
 *
 * ⭐ THE TWO THAT SURVIVE ARE THE TWO WITH A DIMENSION NOTHING ELSE ON THE TAB HAS.
 * LOGISTICS & SUPPLY is not the granary again — it is the granary against the SUPPLY ROUTE
 * (port, isolation, road), and no other block on this leaf can see `config.tradeRouteAccess`
 * or `compound.inst.hasPort` at all. NAVAL DEFENSE is the sea approaches, and nothing else
 * anywhere in the page-set says a word about them. Both are new facts; the other four are
 * the page saying one thing twice.
 *
 * THE ACT THAT LIGHTS THE OTHER FOUR: re-cut the tab so DS-DEF-6 owns the supporting-
 * capability readings and DS-DEF-2's rows 3/4/5 and DS-DEF-5's lens 5 step down to a glance.
 * That is a re-cut of TWO LANDED CARS' speaking positions, so it is a chair act and not a
 * desk one, and it is a genuine choice rather than a repair: the DS-DEF-2 rows read as a
 * THREAT assessment and these read as a CAPABILITY inventory, and which framing should own
 * the fact is a product judgment nobody has made yet.
 * @type {ReadonlyArray<string>}
 */
export const DEF6_C3_BLOCKED_POOLS = Object.freeze([
  'Economic Backing: Well-funded', 'Economic Backing: Adequate',
  'Economic Backing: Underfunded', 'Economic Backing: Critical',
  'Arcane Support: Present', 'Arcane Support: None',
  'Legal Infrastructure: Court + Prison', 'Legal Infrastructure: Court only',
  'Legal Infrastructure: Prison only', 'Legal Infrastructure: None',
  'Medical Readiness: Hospital present', 'Medical Readiness: Clergy care',
  'Medical Readiness: None',
]);

/**
 * Which LANDED position already speaks each blocked lens's fact. Exported so the suite pins
 * the claim to the registry rather than to this comment: a mount row that moved would red
 * the arm instead of leaving a docblock quietly describing a page that no longer exists.
 * @type {Readonly<Record<string, string>>}
 */
export const DEF6_FACT_SPOKEN_AT = Object.freeze({
  'Economic Backing': 'defense.threatAssessment',
  'Arcane Support': 'defense.armedForces',
  'Legal Infrastructure': 'defense.threatAssessment',
  'Medical Readiness': 'defense.threatAssessment',
});

/**
 * DS-DEF-6 lens 5 — LOGISTICS & SUPPLY: the reserve read against the way supply arrives.
 *
 * ⚠ THE PRODUCER'S ASYMMETRY IS MIRRORED, NOT TIDIED. `deriveSupportingCapabilities`
 * branches its granary half on the INSTITUTION flag `hasPort` and its no-granary half on the
 * CONFIG value `tradeRouteAccess === 'port'`. Those are two different questions and a tidier
 * desk would pick one — but the note this sentence sits beside is built from that exact
 * shape, and a sentence that disagreed with the note six pixels below it is worse than an
 * inelegant branch. The desk suite binds all five keys to the producer's own five note
 * branches so the mirror cannot drift.
 *
 * ⚠ AN ABSENT TRADE ACCESS IS SILENCE, NOT `road`. The producer defaults
 * `r.config?.tradeRouteAccess || 'road'`, which is the default-wearing-a-reading's-clothes
 * shape one layer up — it would let the page tell a settlement whose approaches nobody
 * recorded that cutting its roads cuts its supply. This desk requires the raw value PRESENT,
 * on `measuredMonsterFamily`'s reasoning, and is otherwise silent. Not a change to any
 * shipped world: `steps/resolveConfig.js` writes `tradeRouteAccess` into every effective
 * config, so a GENERATED settlement always carries one. RAISED, NOT CURED at the producer.
 *
 * @param {boolean} granary @param {boolean} port @param {unknown} tradeAccess
 * @returns {string|null}
 */
export function supplyLogisticsPoolKey(granary, port, tradeAccess) {
  const access = text(tradeAccess);
  if (!access) return null;
  /** @param {string} tail */
  const key = (tail) => `Logistics & Supply: ${tail}`;
  if (granary) {
    if (port) return key('Granary + port');
    return access === 'isolated' ? key('Granary in isolation') : key('Granary with road supply');
  }
  return access === 'port' ? key('No reserves, port open') : key('No reserves, landlocked');
}

/**
 * DS-DEF-6 lens 6 — NAVAL DEFENSE: who holds the sea approaches.
 *
 * `null` when the town has neither a navy nor a port, which is not a hedge: the producer
 * pushes no Naval Defense row at all for a landlocked town, and the corpus wrote no
 * "no sea approaches" pool. A town with no water has nothing to say about the water.
 *
 * ⭐ `Under blockade` OUTRANKS BOTH, because it is the live reading and the other two are
 * the standing arrangement — the producer's own precedence, mirrored. The blockade flag is
 * written by `worldPulse/foodStockpile.js` at :417 and NEVER at generation, so the pool is
 * DORMANT over a generated-only corpus and LIVE in a campaign world. Measured, not inferred:
 * `economicState.foodSecurity.stockpile` is `null` on every settlement the pipeline builds,
 * and the walker that would call this pool "a key no writer produces" would be reporting its
 * corpus's reach rather than the code's truth. The desk suite proves the route with a
 * fixture carrying the field in the SHAPE that writer emits.
 *
 * @param {boolean} navy @param {boolean} port @param {boolean} blockaded
 * @returns {string|null}
 */
export function navalDefensePoolKey(navy, port, blockaded) {
  if (!navy && !port) return null;
  if (blockaded) return 'Naval Defense: Under blockade';
  return navy ? 'Naval Defense: Naval force' : 'Naval Defense: Port only';
}

/**
 * THE SUPPORTING-CAPABILITIES DESK — DS-DEF-6's two speaking lenses at ONE position.
 *
 * DS-DEF-6 frames no DM-editable field, so these are plain rungs, on DS-DEF-2's reasoning.
 *
 * ⚠ The `{route}` slot named by one variant of `Granary with road supply` gets NO fill and
 * that is a measurement: the estate has no PROPER-shaped route name anywhere on a settlement
 * (`economicState.tradeRoutes` does not exist; `tradeAccess` is the common noun `road` /
 * `port` / `isolated`, and the annex shape for `{route}` is `proper`). The kernel's anchored
 * liveness drops that one variant and the pool speaks through the two that never named it.
 * Refusing a fill is the designed behaviour — the `{defwork}` precedent, one block over.
 *
 * @param {{name?: string, config?: {tradeRouteAccess?: unknown}|null,
 *   economicState?: {compound?: {inst?: Record<string, unknown>}|null,
 *   foodSecurity?: {stockpile?: {blockaded?: unknown}|null}|null}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{logistics: object|null, naval: object|null}>}
 */
export function defenseSupportingProse(settlement, options = {}) {
  const compound = settlement?.economicState?.compound?.inst || {};
  const stockpile = settlement?.economicState?.foodSecurity?.stockpile || null;
  const slots = { settlement: properFill(text(settlement?.name)) };

  /** @param {string|null} poolKey */
  const rung = (poolKey) => (poolKey
    ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-6', {
      ...options,
      slots,
      spineKey: poolKey,
      candidates: defenseStateProseCandidates('DS-DEF-6', settlement),
    }), [])
    : null);

  return Object.freeze({
    logistics: rung(supplyLogisticsPoolKey(
      civicFlag(compound.hasGranary), civicFlag(compound.hasPort),
      settlement?.config?.tradeRouteAccess,
    )),
    naval: rung(navalDefensePoolKey(
      civicFlag(compound.hasNavy), civicFlag(compound.hasPort),
      stockpile ? stockpile.blockaded === true : false,
    )),
  });
}

/**
 * ── DS-DEF-9 · MAGIC DEPENDENCY — the leaf's one block that speaks OFF the defense tab ──
 *
 * `sectionTarget: ['viability','overview']`, and for once the discovery field agrees with
 * the page: the fact is not "does the town have arcane defenses" (that is DS-DEF-5 lens 5,
 * already speaking at `defense.armedForces`) but "would this town still work if the
 * practitioners left". `ViabilityTab` already renders exactly that block, and this desk
 * gives the paragraph the town's own voice beside the generator's.
 *
 * ── ⭐ REACHABILITY, MEASURED OVER GENERATED WORLDS RATHER THAN ASSUMED ─────────────
 * `defenseProfile.magicDependency` is written by `defenseGenerator.js:449` as
 * `magicOn && ((under_siege && (arcane||druid||divine)) || (famine && (druid||divine)) ||
 * (plague_onset && (divine||alchemy)) || (arcaneGuild && (under_siege||famine)))`, and the
 * binding term is the STRESS, not the magic. Measured over generated worlds:
 *   • 200 worlds across 4 tiers × 6 cultures × 6 terrains at default priorities: TRUE on 0.
 *   • 600 worlds with `priorityMagic: 85`: every one had a tradition, 24 carried one of the
 *     three qualifying stresses, and all 24 of those read TRUE. The flag is gated ENTIRELY
 *     by stress incidence.
 *   • The conjunction this block's third pool needs — the flag TRUE *and* an
 *     `activeChains[]` entry carrying a `magicNote` — reached **10 of those 600**.
 * So all three pools are reachable, and the rarest is rare because the STATE is rare, which
 * is the honest reason for a pool to be seldom drawn. A four-world census would have called
 * this block dead; it is not.
 *
 * ⚠ AN ABSENT FLAG IS SILENCE, NOT `false`. `defenseGenerator.js:639` writes
 * `magicDependency: finalScores.magicDependency || false` into every profile it builds, so a
 * generated settlement always carries a boolean; an absent one is a hand-built fixture or a
 * malformed import, and "nothing structural here depends on arcane work" is a claim about a
 * town nobody measured.
 */

/**
 * The `{good}` fill for the NAMED-dependent-chain pool: the first output of the first
 * magically-sustained chain, lowercased.
 *
 * ⭐⭐ THE ROLE IS THE WHOLE POINT, AND THE OBVIOUS FIELD IS THE WRONG ONE. The chain
 * carries a `label` ("Herbalism & Remedies", "Bowyer & fletcher") and an array of `outputs`
 * ("Herbal remedies", "Bows and crossbows"). The label names the TRADE; the corpus's slot is
 * `{good}` and its sentence is "The {good} that {settlement} lives on cannot be made here" —
 * a COMMODITY. Filling a commodity slot from a trade name reads perfectly fluent and states
 * something the record does not: a sibling desk lost a car to exactly that shape. So the
 * fill is `outputs[0]` and never `label`.
 *
 * ⚠ AND IT REFUSES RATHER THAN LOWERCASES WHEN THE VALUE IS NOT A BARE COMMON NOUN.
 * Lowercasing is safe for a common noun and destructive for a proper one, so a value with an
 * interior capital (a named good from custom content) is refused outright rather than
 * flattened. A parenthetical unit is refused too — "Ale (barrel)" is a catalogue row with a
 * measure attached, not the shape `bare-common` names, and "the ale (barrel) that the town
 * lives on" is the machine reading its own spreadsheet aloud. Measured over 250 generated
 * worlds: 15 distinct `outputs[0]` values on magically-sustained chains, none carrying an
 * interior capital, a digit or a dash, and exactly one carrying a parenthetical.
 * A refused fill drops the two variants that name the slot and the pool speaks through the
 * third, which never did. R-DST-K, and the `{defwork}` precedent two blocks over.
 *
 * @param {unknown} activeChains @returns {string|undefined}
 */
export function namedMagicChainGood(activeChains) {
  if (!Array.isArray(activeChains)) return undefined;
  for (const chain of activeChains) {
    if (!text(chain?.magicNote)) continue;
    const raw = text(Array.isArray(chain?.outputs) ? chain.outputs[0] : '');
    if (!raw) continue;
    if (/\s[A-Z]/.test(raw)) continue;
    if (/[()]/.test(raw)) continue;
    const fill = bareCommonFill(raw.toLowerCase());
    if (fill) return fill;
  }
  return undefined;
}

/**
 * Does this settlement have a magically-sustained chain at all? Read separately from the
 * FILL above, and deliberately: the pool key is a claim about the STATE ("there is a named
 * dependent chain"), and the chain is named in the record whether or not its first output
 * happens to survive the `bare-common` shape. Routing on the fill would make the sentence a
 * function of the annex's punctuation rules instead of the town's condition.
 * @param {unknown} activeChains @returns {boolean}
 */
export function hasNamedMagicChain(activeChains) {
  return Array.isArray(activeChains) && activeChains.some((c) => text(c?.magicNote) !== '');
}

/**
 * DS-DEF-9's pool key. Total over the producer's boolean; silent when it is absent.
 * @param {unknown} magicDependency @param {boolean} namedChain @returns {string|null}
 */
export function magicDependencyPoolKey(magicDependency, namedChain) {
  if (magicDependency === true) {
    return namedChain
      ? 'magicDependency true, with a NAMED dependent chain'
      : 'magicDependency true';
  }
  return magicDependency === false ? 'magicDependency false' : null;
}

/**
 * THE MAGIC-DEPENDENCY DESK — DS-DEF-9's one lens at the viability position.
 *
 * ⚠ ONE POOL KEY, NOT TWO. The NAMED-chain pool is a MORE SPECIFIC reading of the same
 * `magicDependency true` state rather than a second fact about it, so the two are a lens
 * LADDER and the desk picks one rung — the specific where the record supports it. Drawing
 * both would put two sentences about one dependency in one box, which is the shape the
 * one-fact-one-sentence law exists to refuse, inside a single block.
 *
 * DS-DEF-9 frames no DM-editable field (`ViabilityTab`'s magic-dependency paragraph is a
 * hard-coded component string, not a generator or DM field), so this is a plain rung.
 *
 * ⛔⛔ THE RETURN KEY IS `arcaneReliance` AND NOT `dependency`, AND THE NAME IS THE POINT.
 * A first cut called it `dependency`, which reads naturally and is WRONG in this estate:
 * `dependency` is already the supply-chain vocabulary's own word — `activeChains[].dependency`,
 * `magicSubstitution.js`'s `substitution.dependency.band`, `EconomicsTrade.jsx`'s
 * `c.dependency`. Reusing it for a prose rung puts two unrelated meanings on one identifier
 * in a tree where the first is load-bearing.
 * ⭐ AND THE ESTATE SAID SO BEFORE A READER DID. `check-observed-shape-readers` convicted
 * `magicProse.dependency` with `sentence on dependency — a key no writer produces`. Its
 * DIAGNOSIS was wrong — the rung genuinely carries a `sentence`, written by `legibilityRung`
 * two modules away, so the read was never dead. What it had actually found is the COLLISION:
 * it grounds a receiver by name, and the corpus's `dependency` is a supply-chain record with
 * no `sentence` on it. A false positive about the behaviour and a true one about the name,
 * which is worth more than the arm it was written for. The cure is the rename, not a
 * contortion to dodge the scanner.
 *
 * @param {{name?: string, defenseProfile?: {magicDependency?: unknown}|null,
 *   economicState?: {activeChains?: unknown}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{arcaneReliance: object|null}>}
 */
export function defenseMagicDependencyProse(settlement, options = {}) {
  const chains = settlement?.economicState?.activeChains;
  const slots = {
    settlement: properFill(text(settlement?.name)),
    good: namedMagicChainGood(chains),
  };
  const poolKey = magicDependencyPoolKey(
    settlement?.defenseProfile?.magicDependency, hasNamedMagicChain(chains),
  );

  return Object.freeze({
    arcaneReliance: poolKey
      ? legibilityRung('', composeStateProse(CORPUS, 'DS-DEF-9', {
        ...options,
        slots,
        spineKey: poolKey,
        candidates: defenseStateProseCandidates('DS-DEF-9', settlement),
      }), [])
      : null,
  });
}

/**
 * ── ⛔⛔ DS-DEF-7 · LIVE DEFENSE READINESS + WAR FRONT — DECLARED DARK, FOUR MEASUREMENTS ─
 *
 * This is the sharpest of the leaf's dark blocks because NOTHING about it is missing. Its
 * producers exist, they are exact, and its host component is already written.
 *
 * WHAT IS PRESENT (all measured on generated worlds, all four configs):
 *   • `deriveCausalState(s).variables.defense_readiness` returns `{score, band, contributors}`
 *     on every settlement, and `causalBand`'s vocabulary is `surplus · adequate · strained ·
 *     critical · collapsed` — an EXACT 1:1 with the five `band …` pools, five for five.
 *   • The live band and the frozen `defenseProfile.readiness.score` genuinely differ, which
 *     is what the two comparison pools are about: a village read frozen 21 (`scoreBand`
 *     CRITICAL) and live `strained`; a metropolis read frozen 76 (STRONG) and live `adequate`.
 *   • `components/dossier/EngineSections.jsx`'s `DefenseWarFrontSection` already computes
 *     the band, the contributors AND the war front, and takes `warStatus` as a prop.
 *
 * WHY IT IS DARK ANYWAY — the four reasons, in the order they bind:
 *
 *  1. ⛔ THE HOST HAS NO PRODUCTION CALL SITE. Measured across all of `src/`:
 *     `DefenseWarFrontSection` — and its three siblings in the same file — are referenced
 *     ONLY by `tests/components/engineSections.test.jsx` and by three prose comments. No tab
 *     renders them. Mounting a block into a component nothing renders would satisfy the
 *     walker's reachability arm (the id would appear once under `src/components`) and lie to
 *     every reader of the registry, which is exactly the citation trap the mount docblock
 *     names. A mount is real when the SHIPPED page carries the sentence.
 *
 *  2. ⛔ THE OBVIOUS ALTERNATIVE HOST COSTS HALF A MEGABYTE. `DefenseTab` could compute the
 *     band itself, and `causalState` is not persisted on the settlement (measured: the
 *     pipeline's 38 top-level keys contain no `causalState`), so it would have to import
 *     `deriveCausalState`. Transitive closure, measured by walking the relative-import graph
 *     and summing file bytes: DefenseTab's own closure is 25 files / 487,487 B; adding
 *     causalState.js pulls in 28 further files / **546,887 B**, more than doubling the tab's
 *     chunk — led by institutionalCatalog.js (103,260 B), causalState.js (77,750 B) and
 *     settlement.schema.js (77,413 B). `defenseScoreBands.js` exists because a 293,079 B
 *     version of this same import was refused; this one is nearly twice that.
 *
 *  3. ⛔ THE TWO CONTRIBUTOR POOLS HAVE NO FILL FOR THE SLOT THEY TURN ON. Both name
 *     `{reason}`, whose annex shape is `bare-common`. `causalState.js`'s `push()` writes
 *     `reason` as a finished SENTENCE — "Defense readiness score: 21.", "Defensive walls in
 *     place.", "Wartime pressure taxes defense readiness." Every one of them fails
 *     `bare-common` three ways over: leading capital, terminal period, and (for the first)
 *     digits. There is no noun-phrase cause anywhere on a contributor; `effect` is a tag
 *     (`measured`, `walled`, `strained`) and not a cause. Parsing the sentence at runtime to
 *     extract one is the config-key-walker defect in miniature and this desk refuses it.
 *
 *  4. ⛔ THE TWO WAR-FRONT POOLS NEED A WORLD, NOT A SETTLEMENT. `besiegedBy` and
 *     `besiegingTargets` come from `settlementWarStatus({settlementId, worldState,
 *     regionalGraph})`; nothing of the sort is on the settlement record (measured: no
 *     `warStatus` key on any generated settlement). `DefenseTab` is handed the settlement
 *     alone.
 *
 * ⭐ THE ONE ACT THAT LIGHTS SEVEN OF THE ELEVEN POOLS: wire `DefenseWarFrontSection` into
 * the defense tab. It pays reason 2's cost ONCE, inside the component that already imports
 * `deriveCausalState`, and it carries the `warStatus` prop reason 4 needs — the same
 * store-selector thread `EconomicsTab` already runs for its live trade flow. That is a new
 * dossier SURFACE rather than a desk wiring, so it is the chair's act and not this lane's.
 * The remaining two (the contributor pools) additionally need reason 3 cured at the
 * producer: a noun-phrase `cause` beside `reason` on `CausalContributor`, which is a change
 * to a shape twelve derivers write and owes its own proof.
 *
 * Pinned so the block cannot be quietly forgotten OR quietly lit.
 * @type {ReadonlyArray<string>}
 */
export const DEF7_DARK_POOLS = Object.freeze([
  'band surplus', 'band adequate', 'band strained', 'band critical', 'band collapsed',
  'live band FALLS SHORT of the built profile', 'live band EXCEEDS the built profile',
  'a contributor with a RECORDED reason, adverse',
  'a contributor with a RECORDED reason, favourable',
  'besiegedBy present', 'besiegingTargets present (the army is abroad)',
]);

/**
 * ── ⛔⛔ DS-DEF-10 · THE WHOLE-TAB BLOCK, SUPERSEDED BY THE FINER ONES THAT LANDED ────
 *
 * DS-DEF-10 is titled for the entire defense screen — "the five arms, readiness badges, and
 * military posture" — and its producers are all present and all exact. Its 21 pools fall
 * into three families, and EVERY ONE of the three states a fact a LANDED sentence position
 * on the same tab already speaks. This is a C3 finding, not a producer finding.
 *
 *   THE FIFTEEN POSTURES ⇄ `defense.militaryStatus` (DS-DEF-8). `MILITARY_POSTURE` is an
 *     exact 1:1 with the fifteen pools, and the corpus even names the producer's own stress
 *     type in parentheses where its word differs — `INTERNAL PRESSURE (famine)`,
 *     `COMMAND SPLIT (politically fractured)` — so the route would be cheap.
 *     ⚠ THOUGH NOT FREE, AND THE ARM THAT PINS THIS CORRECTED THE CLAIM BY REDDING: the
 *     parenthetical is the token with its UNDERSCORES SPELLED AS SPACES, not the token.
 *     Six pools carry one; keying on it verbatim reaches exactly THREE (`famine`,
 *     `indebted`, `wartime` — the single-word tokens, which have no underscore to lose) and
 *     drops the other three in silence. The label-trap rule one notch smaller than the three
 *     instances above it, and measured rather than assumed. But DS-DEF-8 already speaks about the SAME active stress at
 *     the SAME banner, and the two sentences finish with the same clause:
 *       DS-DEF-8   "…there is a crisis on it, and the arrangements have been rebuilt
 *                   around the crisis."
 *       DS-DEF-10  "An army sits outside {settlement} and the town's defensive arrangements
 *                   have been reorganized around holding rather than deterring."
 *     The banner ALSO already prints the posture word itself as its badge and the
 *     generator's own `stress.summary` beneath it. A third statement of one fact is the
 *     machine improvising in front of the reader, which is the whole subject of the law.
 *   THE FOUR BADGE BANDS ⇄ `defense.threatAssessment` (DS-DEF-2). DS-DEF-2 speaks one
 *     sentence per arm at that position and the tab prints `scoreBand` as the badge beside
 *     each bar; "badge WEAK (any arm)" is a second sentence about the arm just spoken for.
 *   THE TWO OVERALL READINGS ⇄ `defense.postureHeader` (DS-DEF-1). DS-DEF-1's readiness
 *     lens is the overall defensive reading, and its CRITICAL line opens "{settlement} is
 *     effectively undefended" against DS-DEF-10's "has no serious answer to any of the five
 *     pressures on it" — one town, one verdict, twice.
 *
 * ⚠ AND MOVING IT TO ANOTHER TAB DOES NOT ESCAPE THE LAW. C3 is per PAGE-SET, not per tab
 * ("a settlement has ONE story about its crime wave"), so mounting the overall reading on
 * `summary` would still be the page-set stating the town's defensive verdict twice. There is
 * no position anywhere that this block can speak from while DS-DEF-1, DS-DEF-2 and DS-DEF-8
 * speak where they do.
 *
 * ⭐ THE ONE ACT THAT LIGHTS IT: re-cut the defense tab so DS-DEF-10 owns the whole-tab
 * reading and DS-DEF-1, DS-DEF-2 and DS-DEF-8 step down to glance rungs. That is a
 * three-landed-car reversal and a real product choice — a page that speaks once about the
 * town as a whole reads very differently from a page that speaks once per arm — so it is
 * owner-facing rather than a desk decision. Nothing here is broken; the corpus wrote two
 * grains of the same page and the finer grain landed first.
 * @type {ReadonlyArray<string>}
 */
export const DEF10_DARK_POOLS = Object.freeze([
  'badge STRONG (any arm)', 'badge ADEQUATE (any arm)', 'badge WEAK (any arm)',
  'badge CRITICAL (any arm)', 'overall reading well defended', 'overall reading undefended',
  'posture ACTIVE SIEGE', 'posture INTERNAL PRESSURE (famine)', 'posture UNDER OCCUPATION',
  'posture COMMAND SPLIT (politically fractured)', 'posture UNDER TRIBUTE (indebted)',
  'posture SECURITY COMPROMISED (recently betrayed)', 'posture INFILTRATION ACTIVE',
  'posture QUARANTINE ACTIVE (plague onset)', 'posture SUCCESSION CONTESTED',
  'posture BEAST PRESSURE', 'posture INSURGENCY ACTIVE', 'posture RELIGIOUS UPHEAVAL',
  'posture REVOLT ACTIVE', 'posture WAR FOOTING (wartime)', 'posture MIGRATION SURGE',
]);

/**
 * Which LANDED position speaks each DS-DEF-10 family's fact. Exported for the same reason
 * DEF6_FACT_SPOKEN_AT is: the suite pins the claim against the live registry, so a mount
 * that moved reds an arm rather than leaving a docblock describing a page that has changed.
 * @type {Readonly<Record<string, string>>}
 */
export const DEF10_FACT_SPOKEN_AT = Object.freeze({
  posture: 'defense.militaryStatus',
  badge: 'defense.threatAssessment',
  overall: 'defense.postureHeader',
});
