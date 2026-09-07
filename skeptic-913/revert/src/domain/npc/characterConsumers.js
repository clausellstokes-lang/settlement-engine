/**
 * domain/npc/characterConsumers.js — THE CONSUMER SEAM (W-LIVES car L5;
 * DESIGN_W_LIVES.md §4, §13 (R6/R7/R8), §15's panel fold, which OUTRANKS them).
 *
 * WHAT THIS HOLDS. Everything a consumer of a paradigm chart needs that is NOT the
 * chart: the one place a chart becomes the vocabulary a legacy reader already
 * speaks, the personal risk register, the derived alignment reading, the corruption
 * depth gate, and the band a court vets on. Six reads, one home, and every one of
 * them routes through L2's `effectiveCharacter` rather than growing a second
 * opinion about who somebody is.
 *
 * ── ⭐⭐ THE MEASURED FACT THAT SHAPES EVERY FUNCTION BELOW ───────────────────
 *
 * NOTHING IN THIS TREE WRITES `npc.character`. Not one generator, not one step, not
 * one migration; the only `.character` writers in `src/` are a settlement's history
 * prose and an undercity graph label, neither of which is a soul. So on every world
 * this engine can generate today the authored chart is ABSENT, and `effectiveCharacter`
 * returns `undefined` BY REFERENCE.
 *
 * That is not a defect and it is not a reason to defer: it is the shape of the whole
 * program. The chart arrives with car L8's edit surface and L1's catalog; the funnel
 * that would drift it is dark; and this car's job is to be the seam they land ON.
 * But it changes what a "byte-identical" claim is worth, so every claim below names
 * WHICH of the two absences is doing the work:
 *
 *   ABSENCE 1 — no chart (universal today; cured by authoring)
 *   ABSENCE 2 — no drift (universal today; cured by TE-VIRT-1's flag + the funnel)
 *
 * A test that only ever sees both absences discovers NOTHING (the §866 vacuous-green
 * class, through a generated instrument). So every read here is exercised in the
 * test with a chart AND with drift, on a comparator proved able to see the
 * difference, and the byte-identity claim is the ABSENT case measured beside it.
 *
 * ── ⭐ THE DESCRIPTOR RE-ROUTE, AND WHY IT IS A WRAPPER AND NOT A MERGE ──────
 *
 * §4 says every consumer routes through the one chokepoint. The consumers it names
 * do not read a chart at all — they read legacy personality WORDS, through three
 * separate spellings of "the descriptor list of an NPC":
 *
 *   `clergyTraitPlane.authoredTraits`   personality only
 *   `npcLadderGoals.traitsOf`           personality only
 *   `corruption.authoredAlignmentTraits` personality PLUS acquired descriptors
 *
 * Those three are NOT the same function, and collapsing them would silently change
 * what the corruption lens reads. So `effectiveDescriptors` takes a caller's OWN
 * word list and returns it as the chart now reads it — one home for the DRIFT
 * LAYER, three unchanged bases. Absent a chart it returns THE SAME ARRAY, by
 * reference, which is why the byte-identity claim is structural rather than
 * asserted (L2's `effectiveCharacter` idiom, one level up).
 *
 * ⚠ THE PROJECTION IS A SEAM, NOT A MIRROR. Turning an axis position back into a
 * legacy word is car L1's `paradigmAxisCatalog.wordForAxisPosition`, and L1 is
 * UNLANDED at this base. The estate's answer to that has been to MIRROR small
 * things (L2 mirrored three band words; L3 mirrored an axis-id roster). This one is
 * NOT small — it is a 17-axis, two-pole, three-level word table — and F1 killed the
 * parallel-tables hazard by ruling ONE home for exactly those values. So the
 * projection is INJECTED: `PARADIGM_WORD_PROJECTION_SEAM` names the import that
 * binds it, the tests drive the whole path with a fixture projection, and the
 * binding is one line at the consist landing. A mirror here would buy a working
 * demo with the hazard F1 spent a car killing.
 *
 * ── WHAT IS DECLARED ABSENT (the SP-C idiom, espionageProductStage's own) ────
 *
 * The risk register's DESPERATION and DISORDER terms are DECLARED ABSENT rather
 * than folded as a silent zero. The estate's one desperation read is computed inside
 * `processLies` and is not exported, and its one NPC disorder read is
 * `clergyTraitPlane.npcTraitPlane().c`; minting a second spelling of either is what
 * J-WR-10 forbids. A caller that holds them supplies them; a caller that does not
 * gets a register that says so on its face.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation, no store.
 *
 * @see docs/DESIGN_W_LIVES.md §4, §13 (R6, R7, R8), §14 (GAP C), §15 (F2, F10, F13, F15)
 * @see docs/OWNER_DECISION_QUEUE.md §803.1, §806, §856
 * @enforced-by tests/domain/npc/characterConsumers.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { riskAppetiteOf, traitsOf } from '../worldPulse/npcLadderGoals.js';
import {
  AXIS_LEVELS,
  SPECTRUM_HALF_SPAN,
  driftEntryOf,
  effectiveCharacter,
  positionValue,
} from './characterDrift.js';
import { NPC_ALIGNMENTS } from './npcFacetContract.js';

/**
 * THE PROJECTION SEAM — the import that turns an axis position back into a legacy
 * word. Named as a constant rather than left to a search, the
 * `CHARACTER_DRIFT_FLAG_KEY` idiom: the consist landing binds ONE import here and
 * every re-route below starts speaking.
 *
 * Until then `effectiveDescriptors` is handed no projection and returns its input
 * array by reference, which is the honest behaviour for a reader that cannot yet
 * read: it makes no claim rather than guessing a word.
 */
export const PARADIGM_WORD_PROJECTION_SEAM = 'paradigmAxisCatalog.js#wordForAxisPosition';

/**
 * The two axes R6's centre reads, MIRRORED NOT IMPORTED from car L1's
 * `PARADIGM_AXES[].id` (UNLANDED at this base — importing an unlanded sibling would
 * make this car unbuildable alone). Two identifiers is the scale L2 mirrored at; the
 * test reconciles them against the catalog the moment the two cars share a tree.
 *
 * F15 fixed these two by name and struck the phantom "ambition family" that §13's
 * first draft implied, so the pair is a ruling, not a taste.
 * @type {Readonly<{ nerve: string, restraint: string }>}
 */
export const RISK_CENTER_AXES = Object.freeze({ nerve: 'COURAGE', restraint: 'PRUDENCE' });

/**
 * The axes a DRIFTED vice can make corruptible AT ALL, and the corruption VECTOR
 * each one opens — MIRRORED from L1's `PARADIGM_AXES[].corruptionVector`. L1
 * MEASURED this reach: seven of seventeen. The other ten carry no legacy flaw column
 * on their vice side, so a soul who drifts into `lazy` or `treacherous` opens no
 * door however deep it runs — an owner row (13(a)'s companion), carried here so the
 * gate's silence on ten axes is a stated property rather than a mystery.
 *
 * ⚠ THE VALUES ARE VECTORS, NOT FLAWS. `corruption.js` keeps two vocabularies —
 * seventeen flaw WORDS and the four VECTORS they map onto — and the estate's
 * `corruptionVectorForFlaw` DEFAULTS an unmapped word to `greed`, so handing a
 * vector into the flaw reader would silently record a `fear`-drifted soul as greedy.
 * The reconcile pin checks the values against L1 and the vocabulary against
 * `CORRUPTION_VECTORS`, both ways.
 * @type {Readonly<Record<string, string>>}
 */
export const CORRUPTIBLE_AXIS_VECTORS = Object.freeze({
  CANDOR: 'forbidden_patron',
  COURAGE: 'fear',
  GENEROSITY: 'greed',
  HUMILITY: 'hunger_for_status',
  JUSTICE: 'greed',
  MERCY: 'greed',
  TRUST: 'fear',
});

/** The seven axis ids, codepoint-ordered — derived, never a second hand-kept list. */
export const CORRUPTIBLE_AXES = Object.freeze(
  Object.keys(CORRUPTIBLE_AXIS_VECTORS).sort(compareCodepoint),
);

/**
 * ⭐ THE OWNER-SIGNABLE DEPTH GATE (F13, pack row 13(a) — UNSIGNED).
 *
 * §4 wrote `marked`; the chair's recorded lean is `defining`-only; F13 RESTORED the
 * call to the owner. Both thresholds are built, both are proven by the suite, and
 * the live one is chosen HERE by one field. It defaults to the SAFER reading —
 * `defining` opens the fewest doors, and a gate that opens too few is a feature that
 * has not arrived, while a gate that opens too many is a live behaviour change
 * nobody signed.
 *
 * `signedBy: null` is the pen's own slot. Flipping `threshold` to `'marked'` is the
 * whole edit; nothing else in this file or any consumer moves.
 * @type {Readonly<{ status: string, signedBy: string|null, threshold: string, thresholds: readonly string[], ownerRows: readonly string[] }>}
 */
export const CORRUPTION_DEPTH_GATE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (pack row 13(a); F13 restored the call to the pen)',
  signedBy: null,
  // THE SAFER DEFAULT until signed. `AXIS_LEVELS[AXIS_LEVELS.length - 1]` rather
  // than the literal, so a catalog that ever grew a fourth rung would carry the
  // gate's meaning ("the deepest band") instead of stranding it on a stale word.
  threshold: AXIS_LEVELS[AXIS_LEVELS.length - 1],
  thresholds: AXIS_LEVELS,
  ownerRows: Object.freeze([
    '13(a): `marked`-or-deeper (DESIGN_W_LIVES §4 as written) vs `defining`-only (the chair\'s recorded lean). Both arms built and pinned; this field is the switch',
    'the reach: a drifted vice opens a door on 7 of 17 axes, because ten axes carry no legacy flaw column on their vice side (L1, measured). Widening the reach is a catalog act, not a gate act',
  ]),
});

/**
 * The terms R6 folds without an input, named on the register's own face — the SP-C
 * idiom, and the reason a caller can tell "nobody is desperate" from "nobody asked".
 * @type {readonly string[]}
 */
export const RISK_TERMS = Object.freeze(['desperation01', 'disorder01']);

/**
 * The three contributors to the register's CENTRE, named so the share each takes is
 * derived from their count rather than chosen. Adding a fourth re-divides the swing
 * automatically instead of silently over-driving the sum past the window.
 * @type {readonly string[]}
 */
export const RISK_CENTER_TERMS = Object.freeze(['axes', 'appetite', 'desperation']);

/** The window's midpoint: a soul with no reading sits exactly here. */
export const NEUTRAL_RISK_CENTER = 1 / 2;

/**
 * How far ONE centre term may move the centre. DERIVED: the three terms split the
 * swing from neutral to either edge equally, so all three at their extreme land on
 * exactly 0 or exactly 1 and no term can be over-driven by tuning taste.
 */
export const RISK_CENTER_SHARE = NEUTRAL_RISK_CENTER / RISK_CENTER_TERMS.length;

/**
 * R8's window at its NARROWEST — one band's share of the window. A perfectly lawful
 * soul accepts only well-priced risks; a zero breadth would accept nothing at all on
 * a float comparison, which is a wall, not a temperament.
 */
export const MIN_RISK_BREADTH = 1 / (2 * SPECTRUM_HALF_SPAN);

/** R8's window at its WIDEST: half the range each way is the whole range. */
export const MAX_RISK_BREADTH = NEUTRAL_RISK_CENTER;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ⛔ `num()` IS LOAD-BEARING AT EVERY `clamp01(num(x))` SITE BELOW — DO NOT COLLAPSE THE
// PAIR. The bare local clamp01 this replaced (`Math.max(0, Math.min(1, v))`) let NaN and
// a coercible string ride through; the kernel's `Number.isFinite` guard does not. The
// swap is byte-neutral ONLY because `num()` has already turned every raw read into a
// finite number, so the guard never fires. Deleting a `num()` as newly-redundant would
// change what a malformed axis value reads as.
/** @param {unknown} v @returns {number} a finite number, or 0 */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * The effective chart's axes, or an empty map. TOTAL, so every read below is a plain
 * lookup: an absent chart, a malformed one and a soul with no axes are one case, and
 * that case is "this reading makes no claim".
 * ⚠ `npc` IS `unknown` ON PURPOSE. The re-routed consumers hand in their own roster
 * types (`SimNpc`, the AI layer's `EntityLite`), and a narrow structural parameter
 * makes each of those a strict-mode error at the call site — which is a type wall
 * pretending to be a contract, on a function that is already total over garbage.
 * @param {unknown} npc
 * @param {Record<string, { offset: number, updatedTick: number }>|null|undefined} drift
 * @returns {Record<string, { pole?: 'virtue'|'vice', level?: string }>}
 */
export function effectiveAxesOf(npc, drift) {
  const chart = effectiveCharacter(/** @type {{ character?: unknown }} */ (asObject(npc)), drift);
  return /** @type {Record<string, { pole?: 'virtue'|'vice', level?: string }>} */ (
    asObject(asObject(chart).axes)
  );
}

// ── 1. THE DESCRIPTOR RE-ROUTE ────────────────────────────────────────────────
/**
 * ⭐ THE LENS — the ONE shape every re-routed consumer takes, so four call sites
 * learn one vocabulary instead of four.
 *
 * Both halves are seams and both are unbound in this tree. `driftOf` resolves a
 * roster NPC to its drift entry, which needs a worldState and a durable-id lookup
 * that none of the re-routed consumers has or should grow; `project` is L1's
 * `wordForAxisPosition`. A lens with neither is the lens every production caller
 * passes today, and it is exactly the identity.
 *
 * @typedef {Object} CharacterLens
 * @property {((npc: unknown) => Record<string, { offset: number, updatedTick: number }>|null)} [driftOf]
 * @property {((position: { axisId: string, pole?: 'virtue'|'vice', level?: string }) => { word: string, displaces: readonly string[] }|null)} [project]
 * @property {((axisId: string) => { e: number, c: number }|null)} [planeOf]
 */

/**
 * The drift entry a lens resolves for one NPC, or null. TOTAL: an absent lens, an
 * absent resolver and a resolver that finds nothing are one case.
 * @param {unknown} npc @param {CharacterLens|null|undefined} lens
 * @returns {Record<string, { offset: number, updatedTick: number }>|null}
 */
export function lensDrift(npc, lens) {
  const resolve = asObject(lens).driftOf;
  if (typeof resolve !== 'function') return null;
  const entry = resolve(npc);
  return entry && typeof entry === 'object'
    ? /** @type {Record<string, { offset: number, updatedTick: number }>} */ (entry) : null;
}

/**
 * ⭐ A CONSUMER'S OWN WORD LIST, AS THE EFFECTIVE CHART NOW READS IT.
 *
 * THE SAME ARRAY, BY REFERENCE, when the chart is absent, when the projection is
 * unbound, or when no axis moves a word. That reference identity is the whole
 * byte-identity proof: a consumer that receives its own array back cannot compute
 * anything different from what it computed before this car existed.
 *
 * WHAT IT DOES WHEN IT CAN READ. Every axis the chart speaks to projects to a legacy
 * word. A word the chart now claims REPLACES the authored word it displaced (the
 * projection reports which authored word an axis owns); a word the chart claims on
 * an axis no authored word occupied is APPENDED. Order is the caller's own for the
 * words it kept, then codepoint for the ones the chart added — so a consumer that
 * sums over the list is permutation-independent and one that reads position still
 * sees its own first.
 *
 * @param {Object} args
 * @param {readonly string[]} args.words       the caller's OWN authored descriptor list
 * @param {unknown} [args.npc]
 * @param {CharacterLens|null|undefined} [args.lens]
 * @returns {readonly string[]} the caller's array itself, or a new list
 */
export function effectiveDescriptors({ words, npc, lens }) {
  const base = Array.isArray(words) ? words : [];
  const project = asObject(lens).project;
  if (typeof project !== 'function') return base;
  const axes = effectiveAxesOf(npc, lensDrift(npc, lens));
  const axisIds = Object.keys(axes).sort(compareCodepoint);
  if (axisIds.length === 0) return base;

  /** @type {Map<string, string>} */
  const replacement = new Map();
  /** @type {string[]} */
  const added = [];
  for (const axisId of axisIds) {
    const claim = project({ axisId, ...axes[axisId] });
    const word = claim && typeof claim === 'object' ? String(claim.word || '') : '';
    if (!word) continue;
    const displaces = claim && Array.isArray(claim.displaces) ? claim.displaces : [];
    let displaced = false;
    for (const old of displaces) {
      const key = String(old).trim().toLowerCase();
      if (base.some((w) => String(w).trim().toLowerCase() === key)) {
        replacement.set(key, word);
        displaced = true;
      }
    }
    if (!displaced && !base.some((w) => String(w).trim().toLowerCase() === word.toLowerCase())) {
      added.push(word);
    }
  }
  // NOTHING MOVED ⇒ the caller's own array, unchanged and unwrapped. The commonest
  // case on a drifted world is a chart that speaks only of axes whose words the
  // consumer already carries at the same rung.
  if (replacement.size === 0 && added.length === 0) return base;
  const kept = base.map((w) => replacement.get(String(w).trim().toLowerCase()) || w);
  return [...kept, ...added.sort(compareCodepoint)];
}

// ── 2. THE RISK REGISTER (R6, R8) ─────────────────────────────────────────────
/**
 * @typedef {Object} RiskRegister
 * @property {number} center   0..1 the risk this soul is drawn to
 * @property {number} breadth  the window half-width around it (R8: chaos is breadth)
 * @property {readonly string[]} absent  the terms that were not supplied
 */

/**
 * ⭐ THE PERSONAL RISK REGISTER — DERIVED, NEVER STORED (R6). No stock, no ledger,
 * no per-NPC memory: drift IS the memory, and this is a reading of it.
 *
 * THE TWO-SCALE SEAM (R6, verbatim): the court's SP-C appetite governs what it
 * OFFERS; this register governs what a person ACCEPTS; a mission happens when both
 * say yes. Nothing here decides an offer, and nothing here is a mission.
 *
 * CENTRE — three terms, each with an equal derived share of the swing:
 *   AXES        `COURAGE` raises it, `PRUDENCE` lowers it (F15's named pair).
 *   APPETITE    the estate's OWN word-grained read, `riskAppetiteOf`. F15 names the
 *               `ambitious` static modifier; `ambitious` is a member of that read's
 *               HIGH_RISK set, and J-WR-10 forbids minting a second spelling of a
 *               read the estate already has one home for. So the register EXTENDS
 *               the existing reader rather than forking a one-word rival of it.
 *   DESPERATION the ES charter's home-desperation context, supplied by the caller.
 *
 * BREADTH — R8: the disorder projection sets the WINDOW WIDTH. Lawful ⇒ narrow (only
 * well-priced risks); chaotic ⇒ broad (the desperate gambit and the irrational fold
 * both live inside). Window width in v1; extending personal chaos into ESTIMATE
 * noise is an owner-taste row R8 itself parks.
 *
 * @param {Object} args
 * @param {unknown} args.npc
 * @param {CharacterLens|null|undefined} [args.lens]
 * @param {unknown} [args.desperation01]  0..1, the ES charter's own read; anything that is
 *        not a finite NUMBER is ABSENT and declared — `null`, `''`, `false` and `[]` all
 *        coerce to a finite 0 and none of them is an answer
 * @param {unknown} [args.disorder01]     0..1, `npcTraitPlane().c` lifted to 0..1; same rule
 * @returns {RiskRegister}
 */
export function riskRegister({ npc, lens, desperation01, disorder01 }) {
  const axes = effectiveAxesOf(npc, lensDrift(npc, lens));
  const nerve = positionValue(axes[RISK_CENTER_AXES.nerve]);
  const restraint = positionValue(axes[RISK_CENTER_AXES.restraint]);
  // The pair spans ±2·HALF_SPAN between them, so the normalized lean is ±1 and the
  // share below is the only thing that decides how far the pair may move the centre.
  const axisLean = (nerve - restraint) / (2 * SPECTRUM_HALF_SPAN);

  // THE APPETITE TERM ROUTES THROUGH THE SAME RE-ROUTE the consumers do, so a soul
  // whose chart moved a word is read by the estate's own reader on the MOVED word.
  const appetite = riskAppetiteOf(asObject(npc), effectiveDescriptors({
    words: traitsOf(asObject(npc)), npc, lens,
  }));
  const appetiteLean = appetite === 'high' ? 1 : appetite === 'low' ? -1 : 0;

  /** @type {string[]} */
  const absent = [];
  // ⛔⛔ `typeof` BEFORE THE FINITE CHECK, AND THE PRODUCER IS THE LAST PLACE IT WAS
  // MISSING — WHICH IS WHY THIS ONE WAS THE DANGEROUS ONE.
  //
  // This read was `Number.isFinite(Number(x))`. `Number(null)` is 0, `Number('')` is 0,
  // `Number(false)` is 0 and `Number([])` is 0 — every one of them FINITE. So a caller
  // with nothing to say was recorded as a caller who said ZERO, and the lie was
  // INVISIBLE at both outputs: a supplied 0 and an absence produce the same `center`
  // and the same `breadth`. The only place the two ever differed was `absent[]` — the
  // list whose entire job is to tell a consumer "nobody asked" from "the answer is
  // none", and the one field a passing test was least likely to look at.
  //
  // ⭐ THE SHAPE OF THIS BUG IS THE WHOLE POINT: BOTH CONSUMERS ALREADY GUARDED, AND
  // THE PRODUCER DID NOT. `npcGoalBranches.branchedGoalsFor` types its `riskCenter`
  // and says so in a comment naming this class as its "second sighting"; the
  // acceptance supplier coerced through its own `finiteOrAbsent` before calling here.
  // Two correct guards around one wrong one is exactly how a class survives being
  // fixed twice — every caller was defended, and the chokepoint everyone reads was
  // not. Curing it HERE is what makes the guards around it redundant rather than
  // load-bearing (the acceptance supplier's has accordingly been retired: two
  // spellings of one guard is the fork J-WR-10 forbids).
  //
  // `Number.isFinite` stays, and it is NOT redundant here the way the consumer's was:
  // `typeof NaN === 'number'`, so the type test alone would admit NaN, and this is the
  // guard that every other guard in the chain was relying on.
  const hasDesperation = typeof desperation01 === 'number' && Number.isFinite(desperation01);
  if (!hasDesperation) absent.push('desperation01');
  const hasDisorder = typeof disorder01 === 'number' && Number.isFinite(disorder01);
  if (!hasDisorder) absent.push('disorder01');
  // DESPERATION PUSHES OUTWARD ONLY. A calm world is not the opposite of a desperate
  // one — it is the absence of the term, which is the neutral share, not a negative.
  const desperationLean = hasDesperation ? clamp01(num(desperation01)) : 0;

  const center = clamp01(
    NEUTRAL_RISK_CENTER + RISK_CENTER_SHARE * (axisLean + appetiteLean + desperationLean),
  );
  const breadth = hasDisorder
    ? MIN_RISK_BREADTH + (MAX_RISK_BREADTH - MIN_RISK_BREADTH) * clamp01(num(disorder01))
    : MIN_RISK_BREADTH;

  return Object.freeze({ center, breadth, absent: Object.freeze(absent) });
}

// ── 3. THE CORRUPTION DEPTH GATE (§4, F2, F13) ────────────────────────────────
/**
 * How deep this soul's DRIFTED vice runs on one axis, as a rung index: 0 for none,
 * 1 `a_touch`, 2 `marked`, 3 `defining`. A VIRTUE position is depth 0 — the gate asks
 * about a vice, and a virtue is not a shallow vice.
 * @param {{ pole?: 'virtue'|'vice', level?: string }|null|undefined} position
 * @returns {number}
 */
export function viceDepth(position) {
  const value = positionValue(position);
  return value < 0 ? -value : 0;
}

/**
 * ⭐ DOES A DRIFTED VICE OPEN THE DOOR? — the banded-depth read §4 makes LOAD-BEARING
 * under a full paradigm: "latent greed in everyone must not make everyone corruptible".
 *
 * BOTH THRESHOLDS ARE LIVE CODE. `threshold` selects which one answers, and it is
 * `CORRUPTION_DEPTH_GATE.threshold` — the owner's one field — by default. Pass one
 * explicitly only to prove the other arm.
 *
 * ⚠ THE REACH IS SEVEN OF SEVENTEEN. An axis with no corruption vector opens nothing
 * however deep the vice runs, because there is no door for it to open — F2's ruling
 * that the per-axis corruption vector applies only to DRIFTED vices, met by L1's
 * measurement that ten axes have no such vector at all.
 *
 * ADDITIVE, NEVER SUBTRACTIVE. This answers whether the CHART opens a door. It can
 * only ever be OR-ed beside the legacy word gate; a soul the words already made
 * corruptible stays corruptible whatever the chart says, because "becoming reachable
 * is the endpoint of a long arc" and an arc does not run backwards through a gate.
 *
 * @param {Object} args
 * @param {unknown} args.npc
 * @param {CharacterLens|null|undefined} [args.lens]
 * @param {string} [args.threshold]  an AXIS_LEVELS member; defaults to the owner's field
 * @returns {string|null} the axis id that opened the door (codepoint-first), or null
 */
export function corruptibleAxisByDepth({ npc, lens, threshold }) {
  const want = AXIS_LEVELS.indexOf(String(threshold ?? CORRUPTION_DEPTH_GATE.threshold)) + 1;
  // An unreadable threshold refuses everything rather than admitting everything: the
  // failure direction on a gate is always toward fewer doors.
  if (want <= 0) return null;
  const axes = effectiveAxesOf(npc, lensDrift(npc, lens));
  for (const axisId of Object.keys(axes).sort(compareCodepoint)) {
    if (!CORRUPTIBLE_AXES.includes(axisId)) continue;
    if (viceDepth(axes[axisId]) >= want) return axisId;
  }
  return null;
}

/**
 * The corruption VECTOR a deep drifted vice opens, ready to hand to
 * `corruption.npcCorruptibleVector` — the whole depth gate in one call.
 * @param {Object} args
 * @param {unknown} args.npc
 * @param {CharacterLens|null|undefined} [args.lens]
 * @param {string} [args.threshold]
 * @returns {string|null}
 */
export function corruptionVectorByDepth({ npc, lens, threshold }) {
  const axisId = corruptibleAxisByDepth({ npc, lens, threshold });
  return axisId ? CORRUPTIBLE_AXIS_VECTORS[axisId] : null;
}

// ── 4. THE DERIVED ALIGNMENT READING (R7) ─────────────────────────────────────
/**
 * @typedef {Object} AlignmentReading
 * @property {boolean} claim  false ⇒ this reading says NOTHING; the fields below are null
 * @property {number|null} good  −1..+1, evil↔good, the summed plane projection
 * @property {number|null} law   −1..+1, chaotic↔lawful
 * @property {string|null} word  an `NPC_ALIGNMENTS` member
 */

/**
 * ⭐ R7 — ALIGNMENT AS A READING OF THE SOUL, never a stored fact. "He was a good man
 * once" is mechanical: the word moves when the chart moves, and there is nowhere for
 * yesterday's word to hide.
 *
 * ⚠⚠ AND THE MEASURED REASON IT SAYS NOTHING TODAY, which is the finding that
 * decides F10's whole disposition. The projection R7 asks for is the per-axis
 * `planeLean` column — car L1's, and UNLANDED here. With no column and no chart this
 * function returns `claim: false`, and `claim: false` is NOT `true_neutral`: a
 * reading that has nothing to read must be distinguishable from a reading that found
 * a balanced soul, or every consumer silently re-bands its whole roster to the
 * middle the day it is wired.
 *
 * THAT IS WHY THE STORED FIELD IS A CACHE AND NOT A DUPLICATE. F10 asks car 5 to
 * re-point `npcStates.alignment`'s consumers to this read or declare the field a
 * projection cache — no third state. The census measured the field's two live
 * consumers (bloc formation and the war-seat ruler bias); re-pointing them at a read
 * that makes no claim would zero two live systems on every existing campaign. So the
 * field is DECLARED A PROJECTION CACHE, with the reconcile pin below as the thing
 * that stops the cache and the read from ever becoming two opinions.
 *
 * @param {Object} args
 * @param {unknown} args.npc
 * @param {CharacterLens|null|undefined} [args.lens]
 *        the lens whose `planeOf` is L1's per-axis `planeLean` column, bound at the
 *        consist landing. Absent ⇒ no claim.
 * @returns {AlignmentReading}
 */
export function derivedAlignment({ npc, lens }) {
  const none = Object.freeze({ claim: false, good: null, law: null, word: null });
  const planeOf = asObject(lens).planeOf;
  if (typeof planeOf !== 'function') return none;
  const axes = effectiveAxesOf(npc, lensDrift(npc, lens));
  const axisIds = Object.keys(axes).sort(compareCodepoint);
  let evil = 0; let chaos = 0; let read = 0;
  for (const axisId of axisIds) {
    const lean = planeOf(axisId);
    // A NULL COLUMN IS A GAP, NOT A ZERO (L1's own rule for its unscored axes): an
    // axis the legacy tables never scored contributes nothing AND is not counted, so
    // it cannot drag the mean toward the middle it has no opinion about.
    if (!lean || typeof lean !== 'object') continue;
    // The chart is signed virtue-positive; the plane column is signed EVIL-positive
    // (clergyTraitPlane's own convention), so a VICE position carries the lean.
    const share = -positionValue(axes[axisId]) / SPECTRUM_HALF_SPAN;
    evil += share * num(lean.e);
    chaos += share * num(lean.c);
    read += 1;
  }
  if (read === 0) return none;
  const good = Math.max(-1, Math.min(1, -evil / read));
  const law = Math.max(-1, Math.min(1, -chaos / read));
  return Object.freeze({ claim: true, good, law, word: alignmentWord(law, good) });
}

/**
 * Two signed axes to one of the eight canonical words. The vocabulary is IMPORTED
 * from `npcFacetContract.NPC_ALIGNMENTS`, never respelled — the editor validates
 * against that list and a second spelling here is how a derived read starts
 * returning words the edit surface refuses.
 *
 * THE BANDS ARE A THIRD OF THE AXIS EACH, derived rather than chosen: three bands on
 * a ±1 axis put the neutral one exactly around zero, which is the only cut that makes
 * `true_neutral` mean "no lean" instead of "a small lean I rounded away".
 *
 * ⚠⚠ AND THE GAP THIS FUNCTION MEASURED, which nobody had written down: the estate's
 * alignment vocabulary is EIGHT WORDS OVER NINE CELLS. `chaotic_good` HAS NO WORD —
 * the roll table, the editor contract and both categorical parsers all carry the
 * other eight and none of them carries that one. A derived reading therefore cannot
 * say "a good man who keeps no rules", which is a whole kind of person.
 *
 * The fallback DROPS THE LAW HALF, never the moral half: `chaotic_good` reads as
 * `neutral_good`. R7's own headline claim is about the moral half ("he was a good man
 * once"), so a fallback that spent the moral reading to keep the law one would
 * silently answer the wrong question. Naming the missing word is an owner row, not
 * this seat's mint (`CONSUMER_SEAM_PROVENANCE.ownerRows`).
 * @param {number} law @param {number} good @returns {string}
 */
export function alignmentWord(law, good) {
  const band = (/** @type {number} */ v) => (v > 1 / 3 ? 1 : v < -1 / 3 ? -1 : 0);
  const l = band(law); const g = band(good);
  const lawWord = l > 0 ? 'lawful' : 'chaotic';
  const goodWord = g > 0 ? 'good' : g < 0 ? 'evil' : 'neutral';
  // `true_neutral` is the one cell whose law half is spelled `true`; every other
  // neutral-law cell is `neutral_*`.
  const word = l === 0 ? (g === 0 ? 'true_neutral' : `neutral_${goodWord}`) : `${lawWord}_${goodWord}`;
  // A cell the contract has no word for keeps the moral half and neutralizes the law
  // half — `neutral_*` is always a member, so this cannot fail closed into silence.
  return NPC_ALIGNMENTS.includes(word) ? word : (g === 0 ? 'true_neutral' : `neutral_${goodWord}`);
}

// ── 5. THE VETTING BAND (§4, ⟨F8⟩) ────────────────────────────────────────────
/**
 * The closed vocabulary a seat vets on. Three words, because a court's read of a man
 * is a judgement and not a score — ⟨F8⟩'s own law, and the reason this returns a band
 * rather than the number a scoring reader would have wanted.
 * @type {readonly string[]}
 */
export const VETTING_TEMPER_BANDS = Object.freeze(['self_serving', 'ordinary', 'dutiful']);

/**
 * THE BAND A COURT READS. §12 R2 makes a court a MORTAL consumer, so the chart handed
 * in here is the KNOWN one (`characterAsSeenBy({ viewer: 'mortal' })`) and never the
 * true one — a well-run treachery reads `dutiful`, which is exactly the property the
 * vetting reader's own header insists on.
 *
 * ABSENT CHART ⇒ `ordinary` ⇒ the middle band ⇒ no arm fires. That is what makes the
 * vetting input byte-identical on every world that has no charts: the term is
 * present, closed, and says nothing.
 *
 * @param {unknown} chart  a `characterAsSeenBy` result
 * @returns {'self_serving'|'ordinary'|'dutiful'}
 */
export function vettingTemperBand(chart) {
  const axes = /** @type {Record<string, { pole?: 'virtue'|'vice', level?: string }>} */ (
    asObject(asObject(chart).axes)
  );
  // FIDELITY is the axis a seat is actually asking about — whether this man keeps
  // faith — and it is the axis whose vice pole L1 had to MINT, because the legacy
  // pools carry no treacherous pole for `loyal`. Reading it here is what makes that
  // mint load-bearing rather than decorative.
  const value = positionValue(axes.FIDELITY);
  if (value >= SPECTRUM_HALF_SPAN) return 'dutiful';
  if (value <= -SPECTRUM_HALF_SPAN) return 'self_serving';
  return 'ordinary';
}

// ── THE ENCOUNTERS SUPPLY (ENC-3) ─────────────────────────────────────────────
//
// ⭐ WHY THESE TWO LIVE HERE AND NOT ON THE CALLER. `tests/domain/npc/characterDrift.test.js`
// STEP 1 says exactly one file outside the drift family may depend on `characterDrift.js`,
// and this module is that file. Its `dependsOn` predicate has a MODULE-PATH arm, so the
// import LINE convicts on its own, whatever symbol it names — a consumer cannot buy its way
// out by importing a symbol that happens to be absent from `DRIFT_SYMBOLS`. So a new consumer
// has exactly two lawful shapes: come through this door, or widen the closure. The chance
// meeting stage comes through the door, and these are the two reads it needs.
//
// Both were already reachable here: `positionValue` was ALREADY imported by this module for
// its own spectrum arithmetic, so the spectrum half of this supply is a re-export and not a
// new reach into the family.

/**
 * THE SPECTRUM READ, re-exported for consumers that must score an authored position without
 * importing the family. Pure over `AXIS_LEVELS`: it reads no world state, no chart and no
 * drift map, and neutral / unknown / malformed all score 0 (a chart that cannot be understood
 * makes no claim, never a guessed one).
 */
export { positionValue };

/**
 * THE SUBJECT-SCOPED DRIFT RECENCY READ — "was THIS soul taught inside the window?"
 *
 * ⛔⛔ THE SIGNATURE IS THE POINT, AND IT IS A CURE. The caller that needed this asked the
 * question with a whole-map read plus a subject id, and then never used the id: it looped
 * `Object.values(driftMap)` over EVERY soul in the world. A per-subject season cap became a
 * world-wide lockout — one NPC taught anywhere refused every lesson everywhere — and no test
 * could see it, because the refusal is silent and sits in front of the funnel. Handing out a
 * map is what made that bug expressible. This read takes ONE identity and never sees a second
 * soul's cells, so the same mistake has nowhere to live.
 *
 * @param {{ worldState?: unknown, wnpcId?: unknown, now?: unknown, within?: unknown }} [args]
 * @returns {boolean} true when some axis of THIS subject was written inside `within` ticks
 */
export function driftTaughtWithin({ worldState, wnpcId, now, within } = {}) {
  const window = num(within);
  if (!(window > 0)) return false;
  const at = num(now);
  const entry = driftEntryOf(
    /** @type {{ characterDrift?: unknown }} */ (asObject(worldState)),
    String(wnpcId ?? ''),
  );
  for (const cell of Object.values(asObject(entry))) {
    const updated = num(asObject(cell).updatedTick);
    if (updated > 0 && at - updated < window) return true;
  }
  return false;
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{ status: string, signedBy: string|null, ownerRows: readonly string[], consumers: readonly string[] }>}
 */
export const CONSUMER_SEAM_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (every magnitude below is derived from the spectrum, none authored)',
  signedBy: null,
  ownerRows: Object.freeze([
    'pack row 13(a): the corruption depth threshold — `marked` vs `defining`. Both arms built; CORRUPTION_DEPTH_GATE.threshold is the switch and it defaults to the safer one',
    'R6\'s centre gives its three terms an EQUAL derived share. A signed weighting (a desperate man\'s nerve counting for more than his courage) is the pen\'s',
    'R8\'s breadth runs from one band\'s share of the window to half of it. The two ends are derived from the spectrum; a signed curve between them is the pen\'s',
    'the vetting band reads FIDELITY alone. A seat that also weighed CANDOR would refuse a different set of men, and which axes a COURT may read is a design row, not an implementation one',
    '⚠⚠ `chaotic_good` HAS NO WORD. NPC_ALIGNMENTS carries eight of the nine law×moral cells, so a derived reading cannot name a good man who keeps no rules; it reads him `neutral_good`. Minting the ninth word touches the roll table, the editor contract and both categorical parsers, so it is the pen\'s call and not a lane\'s',
  ]),
  consumers: Object.freeze([
    'clergyTraitPlane.npcTraitPlane (the group-character projection, GAP C)',
    'npcLadderGoals.traitsOf (via espionageTap.flawDistortion)',
    'corruption.npcCorruptibleFlaw (the depth gate, additive)',
    'sendTwoDivergence.vetVolunteerEnvoy (the vetting band, dark)',
    'npcGoalBranches.branchedGoalsFor (the branch tilt)',
  ]),
});
