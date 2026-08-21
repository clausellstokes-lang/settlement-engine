/**
 * domain/worldPulse/warSiegeVerdict.js — THE SIEGE CONTEST.
 *
 * THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). The one place a siege is
 * decided: the hard feasibility gate, the hard duration ceiling, the defender's will,
 * the two mutually-exclusive resolution cores (the aspatial capacity roll and M5's
 * spatial siege-as-starvation), the outcome band, and the pick of who holds the walls
 * afterward. It reads capacities and returns a VERDICT — it mints nothing, retires
 * nothing, and cannot see a ledger. warDeployment.js (the head) remains the writer
 * that acts on what this returns.
 *
 * DETERMINISM. The only draw is `rng.fork('siege:<T>:<tick>')`, forked on a STABLE
 * key, and it is reached ONLY on a matchup the deterministic gate admitted — so "RNG
 * only resolves plausible conflicts" is itself reproducible. Every other arm
 * (auto_fail, harassment, the ceiling, capitulation) resolves with NO roll.
 */

import { logistic, clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { classifyFeasibility, verdictPermitsSiege, verdictAllowsHarassment } from './feasibilityGate.js';
// Phase 4 W-F4b (item 2a) — the alignment-conditioned fidelity term: a chaotic-devout
// besieger classifies the matchup on a NOISY ESTIMATE of the true capacities (fights
// refused wars / quits winnable ones), then the roll below reads the TRUE values.
// chaosPull 0 (lawful/neutral/no-piety) ⇒ factor 1, no rng forked ⇒ byte-identical.
import { fidelityFactor } from './fidelityNoise.js';

// Siege verdict on the 0..100 capacity scale. K is the log-odds slope per capacity
// point; HOLD_BIAS is the home-ground defender advantage. Calibrated so a MUTUAL /
// near-even siege HOLDS most ticks (pFall ≈ 0.3 — wars take a few ticks, the scar
// accrues, the homeostasis arc runs) while a clear-favourite (a ~18-point offensive
// edge) resolves quickly (pFall ≈ 0.5+). The feasibility gate has ALREADY filtered
// out the implausible matchups, so this slope only ever governs a genuine contest.
const SIEGE_CAPACITY_K = 0.16;
const SIEGE_CAPACITY_HOLD_BIAS = 3;
// Defender-resolve (P4, flag-gated) — the WILL track. A resolute defender shifts the
// siege log-odds toward holding; a broken one toward falling. WILL_BIAS_STRENGTH is the
// max shift (comparable to the hold bias). At/below the capitulate floor the will has
// collapsed and the town yields deterministically (surrender rather than storm).
const WILL_BIAS_STRENGTH = 2.2;
export const WILL_CAPITULATE_FLOOR = -0.72;
// Phase 5.5 mover M2b — SUPPLY INTERDICTION. A supply-starved besieged town's hold
// WEAKENS: its input roads are cut, so its garrison fights hungry (the design's
// siege-as-starvation, whose FULL replacement lands in M5 — here it is an AUGMENTING
// term). Max upward shift on the fall log-odds (comparable to the hold bias), scaled
// by how starved the town is (supplyInterdiction 0..1). DORMANT: supplyInterdiction 0
// ⇒ the term is exactly 0 ⇒ the aspatial siege path resolves BYTE-IDENTICALLY.
const SUPPLY_INTERDICTION_STRENGTH = 2;

// Phase 5.5 mover M5 — SIEGE-AS-STARVATION (the FULL replacement). On the SPATIAL
// path (marker present ⇒ spatialSiege) the capacity-roll CORE of the siege verdict
// (SIEGE_CAPACITY_K·(coalition − defender)) is CLEANLY REPLACED by the supply
// mechanic: fall is driven by supply INTERDICTION × siege TIME, minus RELIEF — "a
// siege is a supply mechanic (starvation + time), not a hitpoint bar" (design §7).
// The feasibility gate, outcome bands, will/capitulation, hard ceiling, and the roll
// fork are UNCHANGED. OFF the marker (spatialSiege false — every aspatial world + all
// 6 siege pins) the capacity-roll runs VERBATIM ⇒ byte-identical. The two cores are
// mutually exclusive (an if/else) — NO dual siege math on either path.
// STARVE_K: the log-odds slope at full starvation×time; STARVE_FULL_TICKS: ticks of
// TOTAL interdiction to fully starve a town; STARVE_RELIEF_BIAS: how much ally/supply
// relief pushes back toward holding. Reuses SIEGE_CAPACITY_HOLD_BIAS (home-ground
// defender advantage) + the will bias — the anti-snowball envelope is preserved.
const STARVE_K = 6;
const STARVE_FULL_TICKS = 12; // a season of total interdiction fully starves the town
const STARVE_RELIEF_BIAS = 3;

/**
 * The defender's WILL-to-resist score ∈ [-1, 1], composed from leadership/faith
 * temperament (facets.will, 0..100), regime legitimacy (0..100), food/supply
 * (facets.logistics, 0..100), and hope (the capacity odds it faces). SHARED by the P4
 * siege verdict (which biases the roll by it) and the read-only War & Resolve display —
 * so the resolve the DM sees is the resolve the siege uses. Pure; 0 is a real `will`
 * value (not a missing-default). A score ≤ WILL_CAPITULATE_FLOOR means the will has
 * collapsed (the town surrenders rather than be stormed).
 *
 * @param {{ willFacet?: any, legitimacyScore?: any, logisticsFacet?: any, defenderCurrent?: number, coalitionCurrent?: number }} args
 * @returns {number}
 */
export function composeDefenderWillScore({ willFacet, legitimacyScore, logisticsFacet, defenderCurrent = 0, coalitionCurrent = 0 }) {
  const willRaw = Number(willFacet);
  const willFacetN = (((Number.isFinite(willRaw) ? willRaw : 50)) - 50) / 50;  // martial/pacifist gov + deity temper (0 is a real value)
  const legit = Number(legitimacyScore);
  const legitN = Number.isFinite(legit) ? (legit - 50) / 50 : 0;
  const logisticsN = Number.isFinite(Number(logisticsFacet)) ? (Number(logisticsFacet) - 50) / 50 : 0; // food + supply
  const denom = coalitionCurrent + defenderCurrent;
  const hopeN = (((denom > 0 ? defenderCurrent / denom : 0.5)) - 0.5) * 2;     // the odds it faces
  return Math.max(-1, Math.min(1, 0.40 * willFacetN + 0.25 * legitN + 0.20 * logisticsN + 0.15 * hopeN));
}

// ── HARD SIEGE-DURATION CEILING (the absolute homeostasis backstop). ──────────────
// The exhaustion/withdrawal arc normally ends a war: a stalled siege drops out of the
// plausible band (capacity collapses under the scar) and the besieger withdraws. But a
// `plausible` siege whose roll never lands a fall and whose attacker exhaustion has
// already SATURATED at 1.0 (so the scar can ratchet no further) has no remaining force
// pushing it out of the plausible band — it can grind INDEFINITELY. This ceiling is the
// deterministic floor under that: once a single siege has run SIEGE_MAX_AGE ticks
// (deploymentAge, incremented once per tick), it auto-resolves. The direction is a PURE
// function of the contested capacities (NO rng, seed/identity-stable): if the besieging
// coalition still holds a current-capacity edge the town finally FALLS; otherwise the
// exhausted besiegers LIFT the siege and withdraw. Either way the siege cannot outlive
// the ceiling, so a saturated stalemate terminates instead of running forever.
export const SIEGE_MAX_AGE = 60;

/**
 * The siege verdict for a single target. FIRST a DETERMINISTIC FEASIBILITY GATE
 * classifies the coalition-vs-defender CURRENT-capacity matchup; only a `plausible`
 * (or a satisfied internal-collapse / war-magic override) matchup goes to RNG.
 * Everything else resolves DETERMINISTICALLY (auto_fail / harassment / require_coalition)
 * with NO roll — so a thorpe can never storm a fortified city on a lucky number, and
 * "RNG only resolves plausible conflicts" is itself reproducible.
 *
 * The stochastic roll (when reached) is log-odds over the CURRENT-capacity delta
 * (NEVER a raw product), forked on `siege:<T>:<tick>`.
 *
 * The coalition strength is the army's STATEFUL `currentEffectiveStrength` once
 * the deployment is stateful (the freshly-recomputed `cap.offensive` is the fallback
 * for a light record). THIS is the keystone: a worn-down army contests at
 * its DEPLETED strength, so it can FAIL against a target it once out-classed. The
 * stochastic roll also produces an OUTCOME BAND (narrow/decisive/costly) the caller
 * feeds into attrition.
 *
 * @param {{ targetId: any, besiegers: any[], capacityFor: (id: any) => { offensive: number, homeDefense: number, facets: any }, effectiveStrengthFor: (id:any)=>(number|null), defenderItem: any, rng: any, tick: any, siegeAge?: number, defenderStrengthOverride?: (number|null), defenderResolveEnabled?: boolean, defenderReliefBonus?: number, attackerFidelity?: number, attackerRust?: number, supplyInterdiction?: number, spatialSiege?: boolean }} args
 * @returns {{ falls: boolean, harass: boolean, forcedLift: boolean, verdict: string, ratio: number, pFall: number, roll: number, coalitionCurrent: number, defenderCurrent: number, band: string, reasons: string[], capitulation?: boolean }}
 */
export function resolveSiegeVerdict({ targetId, besiegers, capacityFor, effectiveStrengthFor, defenderItem, rng, tick, siegeAge = 0, defenderStrengthOverride = null, defenderResolveEnabled = false, defenderReliefBonus = 0, attackerFidelity = 0, attackerRust = 0, supplyInterdiction = 0, spatialSiege = false }) {
  // Coalition strength sums member EFFECTIVE strengths (codepoint-sorted membership)
  // → order-independent: the army at the walls IS the offensive force, depleted by
  // attrition. Each besieger contributes its STATEFUL currentEffectiveStrength when it
  // has a record (the keystone — a worn army contests weaker), else its freshly-
  // recomputed offensive capacity (a light record). The attacker facets feed
  // the war-magic override; the STRONGEST besieger's facets (codepoint tie-break baked
  // into the besiegers order) are the coalition's materiel signal.
  let coalitionCurrent = 0;
  let bestFacets = {};
  let bestStrength = -Infinity;
  for (const id of besiegers) {
    const cap = capacityFor(id);
    const stateful = effectiveStrengthFor(id);
    const eff = Number.isFinite(stateful) ? /** @type {number} */ (stateful) : cap.offensive;
    coalitionCurrent += eff;
    if (eff > bestStrength) { bestStrength = eff; bestFacets = cap.facets; }
  }
  const defenderCap = capacityFor(targetId);
  // The defender contests with its HOME-DEFENSE capacity. A mutual-
  // siege defender's OWN expeditionary army is committed ABROAD — its attrition
  // degrades that field army (read on the OTHER target's verdict), NOT its home walls.
  // So a worn-down besieger does not also defend its own home weaker: the home garrison
  // and the field army are separate forces. The defender's field-army attrition is
  // applied below (it is the attacker on its own front).
  //
  // defenderStrengthOverride (SPIKE, default null): when the defenderAttrition flag is
  // on, the caller passes an ERODED home-defense value from the per-target siege ledger
  // instead of the fresh capacity — so a long siege wears the walls down. Null (the
  // default / flag-off path) uses fresh homeDefense → byte-identical to before.
  // P3 ally defense: allied/vassal/patron relief (0 when the flag is off) bolsters the
  // town's effective defense in the verdict — alliances hold at the walls.
  const defenderCurrent = (Number.isFinite(defenderStrengthOverride)
    ? /** @type {number} */ (defenderStrengthOverride)
    : defenderCap.homeDefense) + (Number(defenderReliefBonus) || 0);

  // ── HARD FEASIBILITY GATE (deterministic, NO rng). ───────────────────────────────
  // W-F4b item 2a: a chaotic-devout besieger CLASSIFIES on a noisy ESTIMATE of the two
  // capacities (own force + defender), so it fights calculator-refused wars and quits
  // winnable ones. The estimate perturbs the CLASSIFY inputs ONLY — the siege roll
  // (logOdds below) and every later branch read the TRUE coalitionCurrent/defenderCurrent,
  // so a mis-classified attacker is delivered INTO a fight and then faces real odds
  // (the owner's variance-with-occasional-payoff). attackerFidelity 0 ⇒ factor 1, NO
  // rng forked ⇒ byte-identical for every deity-free / lawful / no-piety besieger.
  const decisionCid = besiegers.length ? String(besiegers[0]) : String(targetId);
  // W-F8: STRATEGIC RUST adds to the estimate error even for a lawful/neutral (chaosPull 0)
  // besieger — a long-peace realm misjudges its FIRST war (the 1914 problem). rust 0 ⇒
  // no added noise; attackerFidelity 0 AND rust 0 ⇒ NO rng forked ⇒ byte-identical.
  const estimateNoisy = attackerFidelity > 0 || attackerRust > 0;
  const estAttacker = estimateNoisy
    ? Math.max(0, coalitionCurrent * fidelityFactor({ rng, site: 'war_initiation', tick, cid: decisionCid, decisionKey: `own:${stablePart(targetId)}`, chaosPull: attackerFidelity, rust: attackerRust }))
    : coalitionCurrent;
  const estDefender = estimateNoisy
    ? Math.max(0, defenderCurrent * fidelityFactor({ rng, site: 'war_initiation', tick, cid: decisionCid, decisionKey: `foe:${stablePart(targetId)}`, chaosPull: attackerFidelity, rust: attackerRust }))
    : defenderCurrent;
  const { verdict, ratio, reasons } = classifyFeasibility({
    attackerCurrent: estAttacker,
    defenderCurrent: estDefender,
    coalitionSize: besiegers.length,
    defenderItem,
    attackerFacets: bestFacets,
    defenderFacets: defenderCap.facets,
  });

  if (!verdictPermitsSiege(verdict)) {
    // No roll. The siege either auto-fails outright or downgrades to harassment. The
    // attrition band: a harassment tick is a `hold` grind; an auto_fail is a
    // decisive repulse off the walls (the attacker bled trying the impossible).
    const band = verdictAllowsHarassment(verdict) ? 'hold' : 'decisive_fail';
    return {
      falls: false,
      harass: verdictAllowsHarassment(verdict),
      forcedLift: false,
      verdict,
      ratio,
      pFall: 0,
      roll: 0,
      coalitionCurrent,
      defenderCurrent,
      band,
      reasons,
    };
  }

  // ── HARD SIEGE-DURATION CEILING (deterministic, NO rng). A siege-permitting matchup
  // that has ground on for SIEGE_MAX_AGE ticks auto-resolves rather than grinding
  // forever — the backstop for a `plausible` siege whose roll never falls and whose
  // attacker exhaustion has saturated (so nothing else pushes it out of the band). The
  // direction is a pure function of the contested capacities: a coalition still holding
  // a current-capacity edge finally STORMS the walls; an exhausted one that no longer
  // out-classes the defender LIFTS the siege (forcedLift → the caller withdraws it). ──
  if (siegeAge >= SIEGE_MAX_AGE) {
    const falls = coalitionCurrent > defenderCurrent;
    return {
      falls,
      harass: false,
      forcedLift: !falls,
      verdict,
      ratio,
      pFall: falls ? 1 : 0,
      roll: 0,
      coalitionCurrent,
      defenderCurrent,
      band: falls ? 'costly_success' : 'withdrawal',
      reasons: [
        ...reasons,
        `Siege ran the hard ${SIEGE_MAX_AGE}-tick ceiling; auto-resolved ${falls ? 'as a storm' : 'as a withdrawal'} (capacity ${coalitionCurrent.toFixed(1)} vs ${defenderCurrent.toFixed(1)}).`,
      ],
    };
  }

  // ── DEFENDER RESOLVE (P4, flag-gated). Compose the WILL to keep resisting from
  // leadership+faith temperament (facets.will), legitimacy, food/supply (facets.logistics),
  // and hope (the capacity odds). A resolute will biases the roll toward holding; a broken
  // one toward falling; a fully-collapsed will CAPITULATES outright (surrender, not storm).
  // Off ⇒ willBias 0, no capitulation ⇒ logOdds unchanged ⇒ byte-identical.
  let willBias = 0;
  if (defenderResolveEnabled) {
    const facets = defenderCap.facets || {};
    const willScore = composeDefenderWillScore({
      willFacet: facets.will,
      legitimacyScore: defenderItem?.settlement?.powerStructure?.publicLegitimacy?.score,
      logisticsFacet: facets.logistics,
      defenderCurrent,
      coalitionCurrent,
    });
    willBias = WILL_BIAS_STRENGTH * willScore;
    if (willScore <= WILL_CAPITULATE_FLOOR) {
      // WILL COLLAPSE → the defenders yield rather than be stormed (a bloodless fall).
      return {
        falls: true, harass: false, forcedLift: false, verdict, ratio,
        pFall: 1, roll: 0, coalitionCurrent, defenderCurrent, band: 'narrow_success',
        capitulation: true,
        reasons: [...reasons, `${defenderItem?.name || targetId}'s will broke — starving, discredited, and out of hope, the defenders capitulated rather than be stormed.`],
      };
    }
  }

  // ── PLAUSIBLE band (or a satisfied override) → the stochastic siege roll. A resolute
  // defender's willBias lowers pFall (holds); a crumbling one raises it. TWO MUTUALLY-
  // EXCLUSIVE cores (never both — no dual siege math):
  //   • SPATIAL (M5, spatialSiege) — SIEGE-AS-STARVATION. The capacity-roll core is
  //     GONE; fall is driven by supply INTERDICTION × siege TIME minus RELIEF (design
  //     §7). No interdiction ⇒ the town holds (you must cut the roads); a long TOTAL
  //     interdiction starves it out. Feasibility/bands/will/ceiling all still apply.
  //   • ASPATIAL (every legacy world + the 6 siege pins) — the capacity-roll VERBATIM,
  //     with the M2b supply-interdiction AUGMENT term. supplyInterdiction 0 ⇒ +0 ⇒
  //     byte-identical. This branch is BYTE-FOR-BYTE the pre-M5 formula. ──────────────
  // D6 THE UNDERWAYS (coupling 2) SEAM — deliberately deferred, documented, not a bug to
  // re-find: the naval-blockade / spatial-siege CAPITULATION discount (a tunneled defender
  // starving slower under a sea blockade) belongs HERE — multiply `supplyInterdiction` by
  // (1 − UNDERWAYS_TUNING.INTERDICTION_RELIEF) when settlementHasUnderways(defenderItem
  // .settlement). It is NOT wired because warDeployment.js sits exactly at its max-lines
  // baseline ceiling and the required import would exceed it (raising the size baseline is
  // forbidden). The LAND-siege endurance leg IS implemented (foodStockpile _channelShare);
  // this naval leg lands with warDeployment's next size-baseline refresh (owner-gated).
  let logOdds;
  if (spatialSiege) {
    const interdiction = clamp01(supplyInterdiction);
    const timeFactor = clamp01(siegeAge / STARVE_FULL_TICKS);
    const relief01 = clamp01((Number(defenderReliefBonus) || 0) / Math.max(1, defenderCurrent));
    logOdds = STARVE_K * interdiction * timeFactor - STARVE_RELIEF_BIAS * relief01 - SIEGE_CAPACITY_HOLD_BIAS - willBias;
  } else {
    const supplyPush = SUPPLY_INTERDICTION_STRENGTH * clamp01(supplyInterdiction);
    logOdds = SIEGE_CAPACITY_K * (coalitionCurrent - defenderCurrent) - SIEGE_CAPACITY_HOLD_BIAS - willBias + supplyPush;
  }
  const pFall = clamp01(logistic(logOdds));
  const roll = rng.fork(`siege:${stablePart(targetId)}:${tick}`).random();
  const falls = roll < pFall;
  // ── OUTCOME BAND: how the engagement went, scaled by how DECISIVE the roll was
  // relative to its threshold. A fall that cleared the bar by a wide margin is a
  // narrow_success (clean storm); a squeaker is costly_success (pyrrhic). A hold that
  // came close to falling is a narrow_fail for the attacker (it nearly broke through);
  // a comfortable hold is a decisive_fail (thrown back). Deterministic — derived from
  // the same (pFall, roll) pair, so byte-stable + order-independent.
  let band;
  if (falls) {
    band = (pFall - roll) > 0.18 ? 'narrow_success' : 'costly_success';
  } else {
    band = (roll - pFall) < 0.18 ? 'narrow_fail' : 'decisive_fail';
  }
  return {
    falls,
    harass: false,
    forcedLift: false,
    verdict,
    ratio,
    pFall,
    roll,
    coalitionCurrent,
    defenderCurrent,
    band,
    reasons,
  };
}

/**
 * Pick the conquering settlement: the strongest besieger by EFFECTIVE strength
 * (the stateful currentEffectiveStrength when present, else offensive capacity),
 * codepoint tie-break. The strongest SURVIVING army holds the walls.
 * @param {any[]} besiegers
 * @param {(id: any) => { offensive: number }} capacityFor
 * @param {(id: any) => (number|null)} effectiveStrengthFor
 */
export function pickOccupier(besiegers, capacityFor, effectiveStrengthFor) {
  let best = null;
  let bestStrength = -Infinity;
  for (const id of besiegers) {
    const stateful = effectiveStrengthFor(id);
    const s = Number.isFinite(stateful) ? /** @type {number} */ (stateful) : capacityFor(id).offensive;
    if (s > bestStrength || (s === bestStrength && (best == null || id < best))) {
      best = id;
      bestStrength = s;
    }
  }
  return best;
}
