/**
 * domain/worldPulse/feasibilityGate.js — Phase B1 HARD FEASIBILITY GATE.
 *
 * A DETERMINISTIC classifier that sits IN FRONT of the siege RNG. Before any
 * coin is flipped, it compares the attacker(coalition)'s CURRENT military
 * capacity against the defender's DEFENSIVE capacity and decides whether the
 * conflict is even PLAUSIBLE. Only conflicts in the *plausible band* are handed
 * to the stochastic siege verdict — everything else resolves DETERMINISTICALLY
 * to one of a small set of non-RNG verdicts. A thorpe must NOT be able to storm a
 * fortified city on a lucky roll.
 *
 * This is THE thing the proposal (§2 "hard feasibility gates") and the
 * determinism call-out (PROPOSAL_ASSESSMENT §3.5) demand: "the hard feasibility
 * gate must be a deterministic classifier in front of the contest (NOT an RNG
 * step) so 'RNG only resolves plausible conflicts' is itself reproducible."
 *
 * DETERMINISM CONTRACT (sacred): a PURE function of the two capacities + the
 * defender's live conditions. No Date.now / Math.random / argless new Date, no
 * rng. The classification of a given (attacker, defender) state is byte-stable —
 * the same ratio always yields the same verdict, independent of save order.
 *
 * The thresholds are EXPORTED tunable constants (`FEASIBILITY_TUNING`).
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

/**
 * The feasibility verdicts. RNG runs ONLY for `plausible`; every other verdict
 * resolves the conflict deterministically (no siege roll).
 *
 *  - `plausible`            — the matchup is close enough to contest; hand it to RNG.
 *  - `auto_fail`            — the attacker is so far below the defender it simply
 *                             cannot break the walls; the siege deterministically fails.
 *  - `harassment`           — the attacker is too weak to siege but can still raid /
 *                             pressure; resolves to a LOW-severity pressure, not a siege.
 *  - `require_coalition`    — a lone attacker can't, but it is within reach of a
 *                             COALITION; the solo deploy is blocked (the front does
 *                             not fire until enough besiegers converge).
 *  - `require_betrayal`     — only an internal collapse (a coup / rebellion / low
 *                             legitimacy on the defender) opens the gates; fires
 *                             ONLY if the defender already carries such a condition.
 *  - `require_magic`        — only a decisive magical advantage could tip it; fires
 *                             ONLY if the attacker out-classes the defender in war-magic.
 *
 * @typedef {'plausible'|'auto_fail'|'harassment'|'require_coalition'|'require_betrayal'|'require_magic'} FeasibilityVerdict
 */

// ── Tunable thresholds (calibration is load-bearing — see PROPOSAL_ASSESSMENT §2).
// The ratio is attackerCurrent / max(defenderDefensive, ε). A ratio of 1.0 is a
// dead-even matchup. The plausible band is centred a little above 1 (home ground
// favours the defender — you generally need an edge to crack a defended town):
//
//   ratio ≥ PLAUSIBLE_FLOOR (and < PLAUSIBLE_CEILING) → plausible → RNG.
//   PLAUSIBLE_CEILING ≤ ratio                          → plausible (an overwhelming
//                                                        attacker is STILL resolved by
//                                                        RNG — it just nearly always wins;
//                                                        the band is open-topped).
//   HARASSMENT_FLOOR ≤ ratio < PLAUSIBLE_FLOOR         → require_coalition (close but
//                                                        not enough solo) OR harassment.
//   AUTO_FAIL_CEILING ≤ ratio < HARASSMENT_FLOOR        → harassment (can raid, can't siege).
//   ratio < AUTO_FAIL_CEILING                           → auto_fail (hopeless) unless an
//                                                        internal-collapse / magic override.
//
// The bands are deliberately wide so the classifier is robust to the model's
// noise — a thorpe (ratio ≈ 0.1) lands deep in auto_fail; a peer (ratio ≈ 1.0)
// lands in the plausible band.
const PLAUSIBLE_FLOOR = 0.78;     // below this, a solo attacker cannot reliably break a defended town
const PLAUSIBLE_CEILING = 4.0;    // (documentation only — the band is open-topped above the floor)
const HARASSMENT_FLOOR = 0.55;    // below the plausible floor but in coalition reach
const AUTO_FAIL_CEILING = 0.32;   // below this, a solo siege is hopeless (→ harassment), and far below → auto_fail
const HOPELESS_CEILING = 0.18;    // below this it is utterly hopeless: auto_fail, no harassment value

// A coalition is "enough" once the COMBINED attacker capacity reaches the
// plausible floor; require_coalition only ever blocks a SOLO attacker that a
// coalition could plausibly carry.
const COALITION_PLAUSIBLE_FLOOR = PLAUSIBLE_FLOOR;

// The defender's home-ground advantage, folded into the defensive capacity so a
// defended town is worth more than its bare strength. Multiplies the defender's
// current capacity before the ratio is taken.
const HOME_GROUND_MULTIPLIER = 1.18;

// Defender conditions that signal an INTERNAL COLLAPSE — a coup, an active
// rebellion, or a legitimacy crisis. When present, a require_betrayal verdict
// becomes a *plausible* opening (the gates may be opened from within), so a
// weaker attacker that would otherwise auto_fail gets a (still RNG-resolved) shot.
const COLLAPSE_ARCHETYPES = new Set([
  'coup_detat',
  'rebellion',
  'vassal_rebellion',
  'independence_pressure',
  'faction_challenge',
  'succession_crisis',
  'legitimacy_crisis',
]);

// The legitimacy floor (0..100) under which a defender is internally fragile
// enough to count as a collapse signal even without a named condition.
const FRAGILE_LEGITIMACY = 28;

// The war-magic materiel edge (attacker.materiel − defender.materiel, 0..100
// facet points) above which a require_magic verdict turns a hopeless siege into a
// plausible one (a decisive arcane-artillery / battle-mage advantage).
const MAGIC_EDGE_POINTS = 22;

/**
 * The defensive ratio for a coalition-vs-defender matchup. The attacker capacity
 * is the COALITION SUM (an order-independent sum of member current capacities);
 * the defender capacity is its current capacity scaled by the home-ground bonus.
 *
 * @param {number} attackerCurrent  0..100 — the (coalition-summed) current capacity.
 * @param {number} defenderCurrent  0..100 — the defender's current capacity.
 * @returns {number} the ratio (≥ 0); large when the attacker dominates.
 */
export function feasibilityRatio(attackerCurrent, defenderCurrent) {
  const a = Math.max(0, Number(attackerCurrent) || 0);
  const d = Math.max(0, Number(defenderCurrent) || 0) * HOME_GROUND_MULTIPLIER;
  return a / Math.max(d, 1e-6);
}

/**
 * Does the defender carry an INTERNAL-COLLAPSE signal — a coup / rebellion /
 * legitimacy crisis condition, or a fragile legitimacy score? This is what makes
 * a `require_betrayal` opening actually FIRE (a weak attacker only gets in if the
 * defender is rotting from within). Pure read of the defender's live state.
 *
 * @param {any} defenderItem  a worldSnapshot item ({ settlement }) or a settlement.
 * @returns {boolean}
 */
export function defenderHasCollapseSignal(defenderItem) {
  const settlement = defenderItem?.settlement || defenderItem || {};
  const conditions = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  for (const cond of conditions) {
    if (cond && COLLAPSE_ARCHETYPES.has(String(cond.archetype))) return true;
  }
  // A bare legitimacy crisis (no named condition) still counts.
  const legit = settlement?.powerStructure?.publicLegitimacy?.score;
  if (Number.isFinite(legit) && legit <= FRAGILE_LEGITIMACY) return true;
  return false;
}

/**
 * The war-magic materiel edge of the attacker over the defender (facet points).
 * @param {{ materiel?: number }} attackerFacets
 * @param {{ materiel?: number }} defenderFacets
 * @returns {number}
 */
function magicEdge(attackerFacets, defenderFacets) {
  const a = Number(attackerFacets?.materiel) || 0;
  const d = Number(defenderFacets?.materiel) || 0;
  return a - d;
}

/**
 * Classify a (coalition)-vs-defender matchup into a feasibility verdict. PURE +
 * DETERMINISTIC: no rng — the verdict is fully determined by the capacities and
 * the defender's live state. RNG (the siege roll) runs downstream ONLY for the
 * `plausible` verdict.
 *
 * The classification is layered so an internal-collapse / magic override can
 * RESCUE an otherwise-hopeless attacker into the plausible band, but a thorpe with
 * neither override against a fortified city stays `auto_fail` / `harassment`.
 *
 * @param {Object} args
 * @param {number} args.attackerCurrent   0..100 — the coalition-summed current capacity.
 * @param {number} args.defenderCurrent   0..100 — the defender's current capacity.
 * @param {number} [args.coalitionSize]   how many besiegers are committed (1 = solo).
 * @param {any} [args.defenderItem]       the defender snapshot item (collapse read).
 * @param {{ materiel?: number }} [args.attackerFacets]  attacker military facets (magic edge).
 * @param {{ materiel?: number }} [args.defenderFacets]  defender military facets (magic edge).
 * @returns {{ verdict: FeasibilityVerdict, ratio: number, reasons: string[] }}
 */
export function classifyFeasibility({
  attackerCurrent,
  defenderCurrent,
  coalitionSize = 1,
  defenderItem = null,
  attackerFacets = {},
  defenderFacets = {},
}) {
  const ratio = feasibilityRatio(attackerCurrent, defenderCurrent);
  const reasons = [`Attacker/defender capacity ratio ${ratio.toFixed(2)} (home-ground adjusted).`];

  // The plausible band: a real contest. Hand it to RNG (open-topped above the floor).
  if (ratio >= PLAUSIBLE_FLOOR) {
    reasons.push('Within the plausible band — the contest is decided by the siege roll.');
    return { verdict: 'plausible', ratio, reasons };
  }

  // Below the plausible floor. Two OVERRIDES can still rescue the attacker into a
  // (still-RNG) contest: a decisive war-magic edge, or an internal collapse the
  // attacker can exploit. These are the proposal's "require-magical-advantage" and
  // "require-betrayal/sabotage/internal-collapse" verdicts — they only FIRE when
  // the precondition holds; otherwise they are the REASON the siege can't happen.
  const collapse = defenderHasCollapseSignal(defenderItem);
  const magic = magicEdge(attackerFacets, defenderFacets) >= MAGIC_EDGE_POINTS;

  if (collapse) {
    reasons.push('Defender is internally fractured (coup / rebellion / legitimacy crisis) — the gates may open from within.');
    return { verdict: 'require_betrayal', ratio, reasons };
  }
  if (magic) {
    reasons.push('Attacker holds a decisive war-magic advantage — arcane force could tip an otherwise-hopeless siege.');
    return { verdict: 'require_magic', ratio, reasons };
  }

  // A coalition could carry it where a solo attacker cannot: the attacker is
  // within COALITION reach (above the harassment floor) but, alone, below the
  // plausible floor. A solo attacker here is BLOCKED (require_coalition); once the
  // coalition sum clears the floor the matchup is already `plausible` above.
  if (ratio >= HARASSMENT_FLOOR) {
    if (coalitionSize <= 1) {
      reasons.push('Too weak to break the town alone, but a coalition could — the solo siege is blocked.');
      return { verdict: 'require_coalition', ratio, reasons };
    }
    // A multi-besieger coalition that still falls short here drops to harassment.
    reasons.push('Even the coalition falls short of a plausible storm — it can only harass.');
    return { verdict: 'harassment', ratio, reasons };
  }

  // Below the harassment floor. A weak attacker can still RAID (a low-severity
  // pressure), unless it is utterly hopeless, in which case the siege auto-fails.
  if (ratio >= AUTO_FAIL_CEILING) {
    reasons.push('Far too weak to siege — the most it can do is harass the approaches.');
    return { verdict: 'harassment', ratio, reasons };
  }
  if (ratio >= HOPELESS_CEILING) {
    reasons.push('Hopelessly outmatched — a siege deterministically fails (it may still harass).');
    return { verdict: 'harassment', ratio, reasons };
  }
  reasons.push('Utterly outmatched (e.g. a thorpe vs a fortified city) — the siege cannot succeed.');
  return { verdict: 'auto_fail', ratio, reasons };
}

/**
 * Whether a verdict permits the conflict to proceed to the STOCHASTIC siege
 * verdict (the RNG roll). Only `plausible` and the two satisfied overrides
 * (`require_betrayal` / `require_magic` — already gated on their precondition by
 * the classifier) reach the roll. `auto_fail` / `harassment` / `require_coalition`
 * never roll.
 * @param {FeasibilityVerdict} verdict
 * @returns {boolean}
 */
export function verdictPermitsSiege(verdict) {
  return verdict === 'plausible' || verdict === 'require_betrayal' || verdict === 'require_magic';
}

/**
 * Whether a verdict means the attacker can still HARASS (a low-severity pressure,
 * not a siege). The harassment verdict, and a solo require_coalition (the attacker
 * shows up but can't commit to a full siege), both surface as harassment pressure.
 * @param {FeasibilityVerdict} verdict
 * @returns {boolean}
 */
export function verdictAllowsHarassment(verdict) {
  return verdict === 'harassment';
}

export const FEASIBILITY_TUNING = Object.freeze({
  PLAUSIBLE_FLOOR,
  PLAUSIBLE_CEILING,
  HARASSMENT_FLOOR,
  AUTO_FAIL_CEILING,
  HOPELESS_CEILING,
  COALITION_PLAUSIBLE_FLOOR,
  HOME_GROUND_MULTIPLIER,
  FRAGILE_LEGITIMACY,
  MAGIC_EDGE_POINTS,
});
