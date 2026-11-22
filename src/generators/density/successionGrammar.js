/**
 * successionGrammar.js — §810.8 R23/R24/R25: HOW A SUCCESSION ENDS, AND THAT IT ALWAYS DOES.
 *
 * `titularSuccession.js` reads which titles stand vacant and who may claim them. This
 * module decides what becomes of one such title — and, like every law in this lane, it
 * DECIDES AND RETURNS AN INERT FROZEN PLAN. The caller applies. Nothing here writes.
 *
 * ── R23: THE CLOSED RESOLUTION GRAMMAR (the owner's three, and only three) ─────────
 *
 *   CONTINUITY  the house HOLDS the seat. Where it has someone to raise, the ladder
 *               raises them; where it has nobody, it holds the seat EMPTY and the
 *               vacancy stands. ⭐ Both are continuity, and calling them one outcome is
 *               not a fudge: §810.8 defines continuity as "the house holds", and the
 *               promotion is what happens when there is somebody to promote.
 *   TRANSFER    a rival power with a LEGITIMACY CASE challenges and wins. Lawful
 *               passage of the seat, and ⭐ THE DEFEATED HOUSE SURVIVES DEMOTED.
 *   OVERTHROW   rebellion or coup seizes the seat and the old ruling house is removed
 *               ENTIRELY — "factions and all".
 *
 * ⭐⭐ THE DIFFERENCE BETWEEN THE LAST TWO IS THE WHOLE POINT, IN THE OWNER'S OWN WORDS:
 * *"the difference between transfer and overthrow is whether the old house lives, and
 * that difference is where decades of story come from."* This module carries that
 * difference as a TYPED DISPOSITION on the defeated house (`demoted` vs `scattered`)
 * rather than as prose, so a caller cannot apply one while receipting the other.
 *
 * ⛔⛔ AND THE ESTATE CANNOT HONOUR IT TODAY. MEASURED, NOT ASSUMED. The tree has ONE
 * seat-transfer primitive, `domain/rulingPower.transferRulingPower`, and it does not
 * demote — it RELABELS the governing row into the winner's government form. Executed on
 * a three-house fixture, under BOTH `cause: 'succession'` and `cause: 'coup'`, the
 * defeated house "The Crown" left the roster entirely and the victor stayed
 * `isGoverning: false` ("the power behind the seat"); the only surviving trace was one
 * string in `previousGovernments`, and the two causes produced identical rosters apart
 * from a single modifier word. ⇒ **R23's central distinction is presently unreachable
 * downstream of this plan**, and curing it means teaching that primitive to demote —
 * a change to shipped coup behaviour in every existing world, in a module carried by
 * three edge-function bundles. That is an owner's call, not a lane's. This module
 * therefore EMITS the distinction and the car escalates the gap; it does not fork a
 * second seat writer to paper over it, which is the one thing §810.8 forbids
 * ("the coup machinery already in the tree serves this family").
 *
 * ── R24: THE CLOCK, AND WHY TERMINATION IS STRUCTURAL ─────────────────────────────
 *
 * "The succession stressor persists while claimants maneuver … and at its end the
 * weighted roll settles what play did not. A succession that never resolves is a hole,
 * not a story; termination is structural."
 *
 * Structural means it is a property of the RETURN SHAPE, not of the weights. At or past
 * the clock, `planSuccessionResolution` always returns an outcome from the scope's
 * closed set — never null, never a refusal, and never a fourth thing — because one
 * member of each set carries an unconditional base weight that no input can zero:
 * CONTINUITY for a ruling seat (the house holds; R14 forbids the alternative) and
 * WITHERING for an institutional one (the vacancy stands, drifting toward R18). A
 * caller cannot forget to handle the tail, because there is no tail.
 *
 * ⚠ THE CLOCK IS `<x>Until`, THE ESTATE'S OWN DEADLINE GRAMMAR, NOT A NEW WORD. The
 * ladder's `cooldownUntil`, pestilence's `incubateUntil`/`refractoryUntil`, the verdict
 * layer's `jailUntilTick` and war's `decreedUntilTick` are all absolute "no X before
 * tick N" marks that never decrement. `SUCCESSION_CLOCK_FIELD` joins them, in TICKS
 * (this lane's unit — `interregnumSinceTick`, `densityStepTick`) and additive-optional
 * (the `jailUntilTick` shape: written when a clock is running, absent otherwise, so a
 * settlement with no succession is byte-identical to one from before this law).
 * `ticksRemaining` / `deadlineTick` / `resolveByTick` appear ZERO times in `src/`;
 * minting one would have been a fourth idiom for a solved problem.
 *
 * ── WHERE THE MANEUVERING GOES — NAMED, DELIBERATELY NOT WIRED ────────────────────
 *
 * R24 has claimants maneuvering "through the EXISTING agency grammar (undermine_rival,
 * bargain, mobilize, expose — every move a lesson)". That grammar is
 * `NPC_ACTION_FAMILIES` in `domain/worldPulse/npcAgency.js`, and its `heir` role
 * archetype already carries EXACTLY the claimant's action set:
 * `['seek_promotion', 'undermine_rival', 'bargain', 'expose']`. Nothing here wires it,
 * for two reasons and both are hard: `npcAgency.js` sits at 830 effective lines against
 * a frozen baseline of 830 — zero headroom in BOTH directions — and the maneuvering
 * belongs to a live-agency car, not to the law that says how the arc ends.
 *
 * ⬜ THE OTHER NAMED SEAMS, so the next lane does not rediscover them:
 *   - `SUCCESSION_CLOCK_FIELD` — the mark a caller persists on the faction record when
 *     a title falls vacant, beside D2c's `interregnumSinceTick`.
 *   - `npcLadderState.designateHeir` / `swapIntoSeat` — the heir tie R22(d) reads, dark
 *     behind `heirsEnabled` until W-LIVES lands.
 *   - `rulingPowerCoup.coupContenders` — the challenger set. This module takes
 *     challengers as INPUT for the same reason `densityCadence` takes its candidate
 *     pool as input: where they come from is a design call that belongs in the open at
 *     the caller, not buried in a helper.
 *   - `SUCCESSION_LESSONS` — §810.8 says every outcome "lands its lessons". ⛔ THERE IS
 *     NO LESSON WRITER IN THE TREE: `house_power_fell`, `LESSON_KINDS`, `appendLesson`
 *     and `careerLesson` all return ZERO hits across the repository. The plan carries
 *     its lesson as DATA against the day one exists; saying so here is the difference
 *     between a named seam and a silent hole.
 *   - GRUDGES, by contrast, ARE built and are composed rather than re-invented:
 *     `transferRulingPower`'s own `opts.losers` mints the competitive/escalating
 *     `factionRelationships` edges, which is why `powerTransfer.losers` below is
 *     spelled exactly as that primitive expects it.
 *
 * ── NO AMBIENT DRAW ──────────────────────────────────────────────────────────────
 *
 * The roll takes its stream from the CALLER, which must hand it a keyed fork
 * (`density-law` → `succession`) rather than its ambient one. This lane measured what
 * an ambient draw costs: a stressor row that can never fire still moved 104 of 240
 * same-seed worlds purely by drawing. Every refusal path below returns BEFORE touching
 * the stream, so a dormant world and a clock-still-running world both draw nothing.
 *
 * Pure. No writes, no store, no React.
 */

// dark-until: Register VII's wiring car — chartered the day the owner signs `REGISTER_VII_SIGNATURE`; until then DELIBERATE-DARK by the owner's unsigned register
// Having no importer is BY DESIGN here, not orphanhood: this is R23/R24/R25's deciding half,
// landed ahead of its wiring. It also holds the NAMED promotion path for the R25 mutation
// plant (scripts/mutation-coverage-manifest.json, the densityLaw.test.js rationale), so it
// is load-bearing while dark. Disposition and the owner decision point:
// docs/DEAD_CODE_DISPOSITION.md section "Round-3 additions" (FIX-D9, 2026-09-20).
// @enforced-by tests/lint/deadCodeDisposition.walker.test.js
import { compareCodepoint } from '../../domain/deterministicSort.js';
// ⚠ THE KERNEL'S CLAMP, NOT A LOCAL COPY. `clamp01` had been hand-rolled ~70 times
// across the engine with THREE divergent non-finite behaviours before `kernel/math.js`
// became the one home; the estate's ratchet forbids a new local copy and it is right to.
// Every value reaching it here is already finite (each passes through `num` first), so
// the kernel's explicit non-finite policy (⇒ 0) is a strictly safer floor, never a
// behaviour change.
import { clamp01 } from '../../kernel/math.js';
import { SUCCESSION_CLOCK_TICKS, SUCCESSION_WEIGHTS } from '../../domain/density/densityBands.js';
import { rollsRegisterVii } from '../../domain/density/densityLaw.js';

/** §810.8 R23 — the ruling seat's three endings. CLOSED; the pins assert this set
 *  exactly, because "closed" is the whole content of a finite-semantics ruling. */
export const RULING_SEAT_OUTCOMES = Object.freeze(['continuity', 'transfer', 'overthrow']);

/** §810.8 R25 — the REDUCED family for an institutional title (guild head, temple head).
 *  "The realm-scale outcomes belong to the ruling title alone", so rebellion and the
 *  legitimacy transfer of a SEAT are structurally unreachable here. */
export const INSTITUTIONAL_OUTCOMES = Object.freeze(['promotion', 'absorption', 'withering']);

/**
 * What becomes of the house that held the title. ⭐ THIS IS §810.8's LOAD-BEARING
 * DISTINCTION, TYPED.
 *
 *   `held`      the house keeps its title (continuity · promotion · withering).
 *   `demoted`   TRANSFER — the house LIVES, out of the seat, carrying its lesson and
 *               its grudges, and able to come back for it.
 *   `scattered` OVERTHROW and ABSORPTION — the house ENDS. Its named figures are
 *               re-affiliated onto the house that took it, which empties the roster and
 *               lets **R18's own road** dissolve the house with its own receipt.
 *
 * ⭐⭐ `scattered` COMPOSES R18 RATHER THAN FORKING IT, AND THAT IS DELIBERATE. §810.8
 * says the old faction is removed "through R18's own roster-emptying roads". Writing a
 * second removal path would have given the estate two ways for a house to end, one of
 * them without the chronicle receipt R18 mints. Re-affiliation is also the ONLY road an
 * engine may take under §827's STATE-NEVER-FATE: "scattered" is the first word §810.8
 * offers, and unlike exile or destruction it authors no named character's fate. It
 * keeps §817-Q8's always-affiliated invariant true for the same reason R9's fold does.
 */
export const DEFEATED_HOUSE_DISPOSITIONS = Object.freeze(['held', 'demoted', 'scattered']);

/** Every typed reason the grammar declines to resolve. A typed refusal is a finding a
 *  caller can act on; a bare null is a bug that looks like a policy. CLOSED. */
export const SUCCESSION_REFUSALS = Object.freeze([
  'dormant_law',    // v1: the law is not in force for this world
  'no_vacancy',     // the caller named no open title
  'clock_running',  // R24: the claimants still have time to settle it themselves
]);

/** ⚠ THE CLOCK MARK a caller persists on the faction record while a succession is
 *  unresolved — Idiom A (`<x>Until`, absolute, never decremented), in ticks, and
 *  additive-optional so a settlement with no succession carries no key at all. */
export const SUCCESSION_CLOCK_FIELD = 'successionUntilTick';

/**
 * ⚠ CANDIDATE REGISTER (finite semantics; frozen only by the owner's pen). §810.8 names
 * `house_power_fell` in its own text; the other three are its siblings, minted so that
 * every outcome has one rather than leaving three of four silent.
 *
 * ⛔ NOTHING IN THE TREE CONSUMES THESE YET — there is no lesson vocabulary and no
 * lesson writer anywhere in the repository (measured: zero hits). They ride on the plan
 * as data, and the wiring car that gains a lesson writer is where they become live.
 */
export const SUCCESSION_LESSONS = Object.freeze([
  'house_power_held',    // the house kept the seat
  'house_power_fell',    // §810.8's own word: TRANSFER — out of the seat, still alive
  'house_power_broken',  // OVERTHROW — the house did not merely fall, it ended
  'house_power_taken',   // the victor's side of either
]);

/**
 * The `cause` each seat-moving outcome hands the estate's transfer primitive.
 *
 * ⚠ THESE ARE NOT FREE STRINGS. Both are members of `rulingPower.RULING_POWER_CAUSES`,
 * and the pins assert that against the REAL producer rather than against a spelling
 * here — a literal would agree with a drift instead of catching it, which is the lesson
 * D2c paid for when a slug separator forked one polity into two ids. `succession` is
 * the lawful passage R23's TRANSFER describes; `coup` is what the coup machinery
 * already mints for a seat taken by force.
 * @type {Readonly<Record<string, string>>}
 */
export const SEAT_CAUSE_BY_OUTCOME = Object.freeze({
  transfer: 'succession',
  overthrow: 'coup',
});

const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/**
 * When this vacancy's clock runs out.
 *
 * A title that fell vacant this tick (`openedAtTick` absent) starts its clock NOW, so a
 * caller that has not yet persisted the mark still gets a well-defined due date and can
 * write it. Total; never throws.
 *
 * @param {{scope?: string}} vacancy
 * @param {number} tick
 * @param {number|null|undefined} openedAtTick
 * @returns {number}
 */
export function successionDueAtTick(vacancy, tick, openedAtTick) {
  const span = SUCCESSION_CLOCK_TICKS[String(vacancy?.scope || '')]
    ?? SUCCESSION_CLOCK_TICKS.faction_head;
  // ⛔ `Number(null)` IS 0, AND `Number.isFinite(0)` IS TRUE. A `?? tick` guard written
  // over `Number(openedAtTick)` therefore accepts an ABSENT mark as tick ZERO, and the
  // clock of every freshly-opened vacancy is then already long expired — R24's entire
  // maneuvering window skipped, silently, on the exact path a caller reading an
  // unwritten `successionUntilTick` takes. Found by the pin below, not by review. The
  // absence test must be an ABSENCE test; only then is the numeric coercion safe.
  const absent = openedAtTick === null || openedAtTick === undefined;
  const raw = absent ? tick : Number(openedAtTick);
  const opened = Number.isFinite(raw) ? raw : tick;
  // ⚠ A FUTURE-DATED MARK DOES NOT BUY EXTRA TIME. An imported or forged history whose
  // tick sits ahead of the world's would otherwise hold a settlement's politics open
  // forever — the razing-latch discipline this lane already obeys for the interregnum.
  return Math.min(opened, tick) + span;
}

/**
 * ⚠ ONE SHAPE, DECLARED ONCE. Every path out of this module — the three refusals, the
 * ruling seat's three endings and the office's three — returns exactly this, so a caller
 * reads `.resolved` and never a union of five differently-shaped objects. Declaring it
 * as a typedef rather than repeating it per function is also what keeps the refusal and
 * the resolution honest about being the same type: `typecheck:ratchet` compared the
 * inferred returns and convicted the first draft for letting them drift.
 *
 * @typedef {Object} SuccessionPlan
 * @property {boolean} resolved  false on every refusal; true on every ending
 * @property {string|null} outcome  a member of the scope's closed outcome set
 * @property {string|null} reason  a member of SUCCESSION_REFUSALS when unresolved
 * @property {number|null} dueAtTick  when R24's clock runs out (known even while running)
 * @property {string|null} scope  a member of TITLE_SCOPES
 * @property {string|null} factionKey
 * @property {string|null} claimBasis  a member of CLAIM_BASES
 * @property {Readonly<Record<string, unknown>>|null} successor  null when nobody was raised
 * @property {Readonly<Record<string, unknown>>|null} challenger  null unless a rival took it
 * @property {Readonly<Record<string, unknown>>|null} defeatedHouse  {key, disposition, intoName}
 * @property {Readonly<Record<string, unknown>>|null} powerTransfer  the estate's own descriptor
 * @property {string|null} lesson  a member of SUCCESSION_LESSONS
 * @property {Readonly<Record<string, unknown>>|null} receipt  candidate register data
 * @property {Readonly<Record<string, number>>|null} weights  what the roll read
 */

/** The inert "nothing decided" plan. Shared so every refusal returns the SAME shape and
 *  a caller can read `.resolved` without a null check.
 *  @param {string} reason @param {number|null} dueAtTick @returns {SuccessionPlan} */
function declined(reason, dueAtTick = null) {
  return Object.freeze({
    resolved: false,
    outcome: null,
    reason,
    dueAtTick,
    scope: null,
    factionKey: null,
    claimBasis: null,
    successor: null,
    challenger: null,
    defeatedHouse: null,
    powerTransfer: null,
    lesson: null,
    receipt: null,
    weights: null,
  });
}

/**
 * The challengers that could take a ruling seat, normalised and ordered.
 *
 * ⭐ THE SHAPE IS `rulingPowerCoup.coupContenders`' OWN. That function already answers
 * "who could take this seat", already excludes criminal archetypes and powerless houses,
 * already coercion-weights each contender, and already caps the field at three. Taking
 * its output verbatim means this law cannot disagree with the coup machinery about who
 * the contenders are — §810.8's "the coup machinery already in the tree serves this
 * family", obeyed rather than restated.
 *
 * `legitimacy01` is the ONE term `coupContenders` does not carry, because a coup does
 * not need one. R23's TRANSFER does: it is the outcome defined by having a case.
 *
 * @param {Array<Record<string, unknown>>|null|undefined} challengers
 * @returns {Array<{name: string, power: number, weight: number, legitimacy01: number}>}
 */
export function normalizedChallengers(challengers) {
  return (Array.isArray(challengers) ? challengers : [])
    .map(c => ({
      name: String(c?.name || ''),
      power: num(c?.power, 0),
      weight: num(c?.weight, num(c?.power, 0)),
      // Absent ⇒ 0.5 "unremarkable", the convention `densityParticularsFrom` documents
      // and `representationGapOf` follows, so a partial context tilts nothing rather
      // than tilting wrongly.
      legitimacy01: clamp01(num(c?.legitimacy01, 0.5)),
    }))
    .filter(c => c.name)
    .sort((a, b) => (b.weight - a.weight) || compareCodepoint(a.name, b.name));
}

/**
 * Pick one member of a weighted set. Total and deterministic: the keys are walked in a
 * fixed order and the roll is a single draw, so the same world always settles the same
 * way. Returns the first key when every weight is zero — which cannot happen through
 * `planSuccessionResolution`, because each scope's set carries one unconditional member,
 * but a total function should not have an undefined corner.
 *
 * @param {Record<string, number>} weights
 * @param {{random: () => number}} rng
 * @param {ReadonlyArray<string>} order
 * @returns {string}
 */
function pickWeighted(weights, rng, order) {
  let total = 0;
  for (const key of order) total += Math.max(0, num(weights[key], 0));
  if (total <= 0) return order[0];
  let roll = rng.random() * total;
  for (const key of order) {
    roll -= Math.max(0, num(weights[key], 0));
    if (roll < 0) return key;
  }
  return order[order.length - 1];
}

/**
 * Plan the resolution of ONE vacant title (§810.8 R23/R24/R25).
 *
 * Returns a DECLINED plan — never throws — for every reason in `SUCCESSION_REFUSALS`,
 * and takes NO draw on any of those paths. At or past the clock it always resolves.
 *
 * @param {{
 *   vacancy?: {scope?: string, kind?: string, factionKey?: string, claimBasis?: string,
 *              claimants?: Array<Record<string, unknown>>}|null,
 *   config?: Record<string, unknown>,
 *   tick?: number,
 *   openedAtTick?: number|null,
 *   challengers?: Array<Record<string, unknown>>,
 *   legitimacy01?: number,
 *   war01?: number,
 *   stability01?: number,
 *   rng: {random: () => number},
 * }} input
 * @returns {SuccessionPlan}
 */
export function planSuccessionResolution(input) {
  if (!rollsRegisterVii(input?.config || {})) return declined('dormant_law');
  const vacancy = input?.vacancy;
  if (!vacancy || !vacancy.factionKey) return declined('no_vacancy');

  const tick = Math.floor(num(input?.tick, 0));
  const dueAtTick = successionDueAtTick(vacancy, tick, input?.openedAtTick);
  // R24: while the clock runs, play owns the succession. No draw is taken here — the
  // maneuvering seam is named in the header and belongs to a live-agency car.
  if (tick < dueAtTick) return declined('clock_running', dueAtTick);

  const scope = String(vacancy.scope || 'faction_head');
  const claimants = Array.isArray(vacancy.claimants) ? vacancy.claimants : [];
  const challengers = normalizedChallengers(input?.challengers);
  const legitimacy01 = clamp01(num(input?.legitimacy01, 0.5));
  const war01 = clamp01(num(input?.war01, 0));
  const stability01 = clamp01(num(input?.stability01, 0.5));

  return scope === 'ruling_seat'
    ? resolveRulingSeat({
      vacancy, tick, dueAtTick, claimants, challengers,
      legitimacy01, war01, stability01, rng: input.rng,
    })
    : resolveInstitutional({
      vacancy, tick, dueAtTick, claimants, challengers, stability01, rng: input.rng,
    });
}

/**
 * §810.8 R23 — the ruling seat's three-ended grammar.
 *
 * ⭐ CONTINUITY CARRIES AN UNCONDITIONAL BASE WEIGHT, AND THAT IS WHAT MAKES TERMINATION
 * STRUCTURAL. R14 forbids the density law to end a government, so "the house holds" is
 * always available and is therefore always the tail the roll can land on. A settlement
 * with no claimants and no challengers resolves to continuity with a NULL successor:
 * the seat stands empty, receipted, and §810.5's stressor reads it. ⛔ That is the
 * heir-less one-person-polity case §817 asked this car to establish, and it is an
 * ANSWER rather than a hole — the clock terminated, and the empty seat is the story.
 *
 * @param {{vacancy: Record<string, unknown>, tick: number, dueAtTick: number,
 *          claimants: Array<Record<string, unknown>>,
 *          challengers: Array<{name: string, power: number, weight: number, legitimacy01: number}>,
 *          legitimacy01: number, war01: number, stability01: number,
 *          rng: {random: () => number}}} a
 * @returns {SuccessionPlan}
 */
function resolveRulingSeat(a) {
  const W = SUCCESSION_WEIGHTS;
  // ⭐ THE LEGITIMACY FLOOR IS WHAT SEPARATES THE TWO SEAT-TAKING ENDINGS. A challenger
  // below it has no CASE, so it cannot take the seat lawfully — but it may still take it
  // by force. That single threshold is §810.8's distinction expressed as arithmetic.
  const lawful = a.challengers.filter(c => c.legitimacy01 >= W.transferLegitimacyFloor);
  const bestLawful = lawful[0] || null;
  const bestArmed = a.challengers[0] || null;

  const legitimacyGap = bestLawful ? clamp01(bestLawful.legitimacy01 - a.legitimacy01) : 0;
  const coercionGap = coercionGapOf(bestArmed, a.claimants.length);

  const weights = {
    continuity: W.continuityBase + (W.perClaimant * a.claimants.length)
      + (W.continuityLegitimacy * a.legitimacy01),
    transfer: bestLawful ? W.transferBase + (W.perLegitimacyGap * legitimacyGap) : 0,
    overthrow: bestArmed
      ? W.overthrowBase + (W.perCoercionGap * coercionGap)
        + (W.warTilt * a.war01) + (W.instabilityTilt * (1 - a.stability01))
      : 0,
  };

  const outcome = pickWeighted(weights, a.rng, RULING_SEAT_OUTCOMES);
  const houseKey = String(a.vacancy.factionKey);
  const victor = outcome === 'transfer' ? bestLawful : outcome === 'overthrow' ? bestArmed : null;

  return finish({
    outcome,
    scope: 'ruling_seat',
    vacancy: a.vacancy,
    dueAtTick: a.dueAtTick,
    tick: a.tick,
    successor: outcome === 'continuity' ? (a.claimants[0] || null) : null,
    challenger: victor,
    defeatedHouse: outcome === 'continuity'
      ? { key: houseKey, disposition: 'held', intoName: null }
      : outcome === 'transfer'
        // ⭐ THE HOUSE LIVES. Out of the seat, still a named power, still able to want
        // it back — which is the revanche §810.8 says decades of story come from.
        ? { key: houseKey, disposition: 'demoted', intoName: null }
        // ⭐ THE HOUSE ENDS, by R18's own road: its people go to the victor, the roster
        // empties, and the dissolution receipt is R18's to mint.
        : { key: houseKey, disposition: 'scattered', intoName: victor ? victor.name : null },
    // The estate's OWN transfer descriptor, spelled as `applyWorldPulse`'s mouth and
    // `transferRulingPower` expect it — `losers` included, because that array is the
    // grudge road the primitive already writes.
    powerTransfer: victor
      ? {
        toPowerName: victor.name,
        cause: SEAT_CAUSE_BY_OUTCOME[outcome],
        tick: a.tick,
        losers: [houseKey],
      }
      : null,
    lesson: outcome === 'continuity' ? 'house_power_held'
      : outcome === 'transfer' ? 'house_power_fell' : 'house_power_broken',
    weights,
  });
}

/**
 * §810.8 R25 — the SCALE-DOWN. An institutional title resolves with the reduced family;
 * the realm-scale endings belong to the ruling title alone, so no `powerTransfer` is
 * ever emitted here and neither `transfer` nor `overthrow` is reachable.
 *
 * ⭐ WITHERING IS THIS SCOPE'S UNCONDITIONAL TAIL — "vacancy-persists-toward-dissolution".
 * The house keeps its title and its emptiness, and drifts toward R18 on its own.
 *
 * @param {{vacancy: Record<string, unknown>, tick: number, dueAtTick: number,
 *          claimants: Array<Record<string, unknown>>,
 *          challengers: Array<{name: string, power: number, weight: number, legitimacy01: number}>,
 *          stability01: number, rng: {random: () => number}}} a
 * @returns {SuccessionPlan}
 */
function resolveInstitutional(a) {
  const W = SUCCESSION_WEIGHTS;
  const absorber = a.challengers[0] || null;
  const weights = {
    promotion: a.claimants.length ? W.continuityBase + (W.perClaimant * a.claimants.length) : 0,
    absorption: absorber
      ? W.transferBase + (W.perLegitimacyGap * coercionGapOf(absorber, a.claimants.length))
      : 0,
    withering: W.overthrowBase + (W.instabilityTilt * (1 - a.stability01)),
  };

  const outcome = pickWeighted(weights, a.rng, INSTITUTIONAL_OUTCOMES);
  const houseKey = String(a.vacancy.factionKey);

  return finish({
    outcome,
    scope: 'faction_head',
    vacancy: a.vacancy,
    dueAtTick: a.dueAtTick,
    tick: a.tick,
    successor: outcome === 'promotion' ? (a.claimants[0] || null) : null,
    challenger: outcome === 'absorption' ? absorber : null,
    defeatedHouse: outcome === 'absorption'
      ? { key: houseKey, disposition: 'scattered', intoName: absorber ? absorber.name : null }
      : { key: houseKey, disposition: 'held', intoName: null },
    powerTransfer: null,
    lesson: outcome === 'promotion' ? 'house_power_held'
      : outcome === 'absorption' ? 'house_power_broken' : 'house_power_fell',
    weights,
  });
}

/**
 * How far a challenger out-weighs what the house can field itself, in 0..1.
 *
 * A house with claimants can defend its own seat, so each one it still has narrows the
 * gap. Saturating rather than linear: the tenth claimant does not make a house ten times
 * safer, and an unbounded term would let one crowded house make a coup arithmetically
 * impossible — an absolute that no settlement should be able to buy.
 *
 * @param {{weight: number}|null} challenger
 * @param {number} claimantCount
 * @returns {number}
 */
function coercionGapOf(challenger, claimantCount) {
  if (!challenger) return 0;
  const defence = claimantCount / (claimantCount + 2);
  return clamp01(1 - defence);
}

/** Freeze one resolved plan into the shared shape, with its authored receipt fragments.
 *  @param {Record<string, unknown>} a @returns {SuccessionPlan} */
function finish(a) {
  const vacancy = /** @type {Record<string, unknown>} */ (a.vacancy);
  const successor = /** @type {Record<string, unknown>|null} */ (a.successor);
  const challenger = /** @type {Record<string, unknown>|null} */ (a.challenger);
  const defeated = /** @type {Record<string, unknown>} */ (a.defeatedHouse);
  return Object.freeze({
    resolved: true,
    outcome: String(a.outcome),
    reason: null,
    dueAtTick: /** @type {number} */ (a.dueAtTick),
    scope: String(a.scope),
    factionKey: String(vacancy.factionKey),
    claimBasis: String(vacancy.claimBasis || 'ladder'),
    successor: successor ? Object.freeze({ ...successor }) : null,
    challenger: challenger ? Object.freeze({ ...challenger }) : null,
    defeatedHouse: Object.freeze({ ...defeated }),
    powerTransfer: a.powerTransfer
      ? Object.freeze({ .../** @type {Record<string, unknown>} */ (a.powerTransfer) })
      : null,
    lesson: /** @type {string} */ (a.lesson),
    // ⚠ CANDIDATE REGISTER DATA, OWNER-UNSIGNED (§754.3 Herald-grade contextual). These
    // are the CONTEXTUAL FACTS a receipt is composed from — who held the title, what the
    // claim was made in, who took it and how — not a rendered line. The wiring car mints
    // the beat through the estate's existing writers; composing prose here would put a
    // second news author in a module that has no business being one.
    receipt: Object.freeze({
      outcome: String(a.outcome),
      scope: String(a.scope),
      titleKind: String(vacancy.kind || ''),
      claimBasis: String(vacancy.claimBasis || 'ladder'),
      houseName: String(vacancy.factionKey),
      successorName: successor ? String(successor.name || '') : null,
      challengerName: challenger ? String(challenger.name || '') : null,
      houseDisposition: String(defeated.disposition),
      lesson: /** @type {string} */ (a.lesson),
      tick: /** @type {number} */ (a.tick),
    }),
    weights: Object.freeze({ .../** @type {Record<string, number>} */ (a.weights) }),
  });
}
