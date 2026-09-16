/**
 * domain/worldPulse/deploymentReturn.js — contextual return outcomes (Feature A + B2).
 *
 * A clone of the coup-verdict idiom (coup.js): when a deployment CLEARS (its siege
 * resolved this tick) the army marches home, and the outcome is CONTEXTUAL to the
 * home's predicament — "the troops come home to trouble":
 *
 *   home OCCUPIED   → `occupation_lifted` (a STRONG army breaks the occupation) vs a
 *                       failed rebellion (a DEPLETED one cannot)
 *   home UNDER SIEGE → `siege_lifted`     (a STRONG army relieves it) vs a failed
 *                       relief (a DEPLETED one is brushed aside)
 *   home is a VASSAL → a coup (a STRONG army topples the seat) vs a disbanded host
 *                       (a DEPLETED one cannot, and may splinter)
 *   else            → a GENERIC clear; a BADLY-DAMAGED army that returns to an
 *                       untroubled home still SPLINTERS (deserters / rebels / a
 *                       loyalist remnant) — a low-strength return is destabilizing.
 *
 * STRENGTH-SCALED RESOLUTION. The army now carries a `currentEffectiveStrength`
 * (relative to its `maxStartStrength` and to the home situation). The branch is still
 * contextual, but its RESOLUTION is strength-scaled: a deterministic threshold on the
 * army's remaining-strength ratio + a plausibility-banded roll (NOT a coin flip). A
 * strong returning army succeeds; a depleted one fails, negotiates from weakness, or
 * splinters. The returning strength feeds siege-relief / occupation-rebellion /
 * vassal-rebellion / coup / faction-confidence / ruler-legitimacy / war-exhaustion /
 * postwar-instability.
 *
 * The generic clear of a HEALTHY army emits NOTHING (mirrors isCoupResidualOutcome /
 * the no-echo carve-out, §5): a stood-down intact army must not pollute the chronicle.
 *
 * Deterministic: rng forked on `'deployment-return'` then per-record on the home id;
 * codepoint-sorted iteration; reads only the (post-tick) graph + pre-tick snapshot +
 * the stateful deployment record carried on each resolved deployment.
 */

import { resolveCoupVerdict } from '../rulingPowerCoup.js';
import { foreignSeatCoupAdj } from '../rulingPowerSeat.js';
import { irregularShareFactor } from './irregularForce.js';
import { occupationLiftTransfer } from './occupation.js';
import {
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { stablePart } from './worldState.js';
import { warFrontsInto } from './warFrontReads.js';
import { formatCount } from '../formatNumber.js';
import { spatialConsequenceActive, substrateOf, approachOctant, resolveBreachSegment } from '../spatial/spatialSubstrateRead.js';

/** @param {string} a @param {string} b */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** @param {number} min @param {number} max @param {number} value */
function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

// ── Strength-scaled return tunables (calibration is load-bearing). ───────────────
// The army's REMAINING-STRENGTH RATIO (currentEffectiveStrength / maxStartStrength,
// 0..1) is the spine of every return resolution. A high ratio ⇒ a strong host that
// breaks the siege / liberates / coups; a low ratio ⇒ a spent host that fails,
// negotiates from weakness, or splinters.
//
// The resolution is a DETERMINISTIC THRESHOLD + a PLAUSIBILITY-BANDED roll (NOT a
// coin flip): the success probability is the strength ratio mapped through a band, so
// a near-full army nearly always succeeds and a gutted one nearly always fails, with
// a contested middle where the (deterministic, id-forked) roll decides.
const STRONG_RETURN_RATIO = 0.62;   // at/above this the host is "strong" (high success odds)
const SPLINTER_RATIO = 0.3;         // below this a returning host is at risk of splintering
// The gutted cut, as a fraction of SPLINTER_RATIO: a host this far below the splinter
// ratio is not merely spent, it has ceased to be an army. Named (rather than spelled
// `SPLINTER_RATIO * 0.6` at each use) so the disband branch and the word that describes
// it cannot drift apart — TE-HERALD-1.
const DISBAND_RATIO_SCALE = 0.6;
const RETURN_SUCCESS_FLOOR = 0.06;  // even a gutted army has a sliver of a chance (a desperate sally)
const RETURN_SUCCESS_CEIL = 0.96;   // even a full army can be unlucky (fog of war)

/**
 * The army's remaining-strength ratio (0..1) from its stateful deployment record. A
 * light/pre-B2 record (no strength fields) reads as a FULL army (1.0) — so the legacy
 * binary behaviour (a returning army always succeeds) is the limiting case of the
 * strength-scaled one. A `withdrawal` (the army gave up a stalled siege) is treated as
 * already somewhat spent regardless.
 * @param {any} deployment  the resolved deployment record.
 * @param {string} outcome  the resolution that returned it ('conquest'|'withdrawal'|…).
 * @returns {number} 0..1
 */
function strengthRatioOf(deployment, outcome) {
  const d = deployment || {};
  const max = Number(d.maxStartStrength);
  const cur = Number(d.currentEffectiveStrength);
  let ratio = Number.isFinite(max) && max > 0 && Number.isFinite(cur)
    ? clamp01(cur / max)
    : 1.0; // light record ⇒ full strength (legacy binary limit).
  // A withdrawal is a retreat off a stalled siege — the host is demoralized even if
  // its headcount held. Cap its effective return strength a little.
  if (outcome === 'withdrawal') ratio = Math.min(ratio, 0.85);
  return ratio;
}

/**
 * The success probability of a strength-scaled return resolution: the army's strength
 * ratio mapped through the plausibility band, optionally tilted by a context factor
 * (e.g. the home's own fragility makes a coup easier). Deterministic; bounded. The
 * caller draws ONE id-forked roll against this.
 * @param {number} ratio       0..1 remaining-strength ratio.
 * @param {number} [contextTilt] additive tilt (e.g. +0.15 when the home is fragile).
 * @returns {number} 0..1
 */
function returnSuccessProbability(ratio, contextTilt = 0) {
  // A smooth ramp centred on STRONG_RETURN_RATIO: well below ⇒ near the floor, well
  // above ⇒ near the ceiling, a contested band around the threshold.
  const centered = (clamp01(ratio) - SPLINTER_RATIO) / Math.max(1e-6, STRONG_RETURN_RATIO - SPLINTER_RATIO);
  const ramp = clamp01(0.5 * centered + 0.25); // ratio at SPLINTER → 0.25, at STRONG → 0.75
  return clamp(RETURN_SUCCESS_FLOOR, RETURN_SUCCESS_CEIL, ramp + contextTilt);
}

// ── THE RETURN'S OWN WORDS (TE-HERALD-1). ────────────────────────────────────────
// The reader is told the fact the arithmetic used, in the words this file already
// speaks it in — never the scalar. BOTH ladders read the tunables ABOVE rather than a
// second set of cuts, so a calibration change moves the words with it and the prose
// cannot drift away from the resolution it describes: a host is `broken` at exactly
// the ratio that risks a splinter, `all but whole` at exactly the ratio the resolution
// calls strong, and the odds words sit on the success ramp's own landmarks (the ramp
// yields 0.25 at SPLINTER_RATIO and 0.75 at STRONG_RETURN_RATIO, so those two are the
// interior cuts).
//
// EXPORTED because a coverage proof must read the ladder from source rather than
// transcribe it — the totality-export discipline lawWord.js states, and the shape
// tests/lint/contractTestAntiVacuity.walker.test.js Rule 2 exists to force.

/**
 * The returning host in a word, worst-first. Four rungs because the file's own
 * resolution has exactly three interior cuts on this axis.
 * @type {ReadonlyArray<string>}
 */
export const RETURN_MUSTER_WORDS = Object.freeze([
  'gutted', 'broken', 'thinned', 'all but whole',
]);

/**
 * How much of its muster came home, as a word.
 * @param {number} ratio 0..1 remaining-strength ratio.
 * @returns {string} a member of RETURN_MUSTER_WORDS.
 */
export function returnMusterWordFor(ratio) {
  const r = clamp01(ratio);
  if (r < SPLINTER_RATIO * DISBAND_RATIO_SCALE) return RETURN_MUSTER_WORDS[0];
  if (r < SPLINTER_RATIO) return RETURN_MUSTER_WORDS[1];
  if (r < STRONG_RETURN_RATIO) return RETURN_MUSTER_WORDS[2];
  return RETURN_MUSTER_WORDS[3];
}

/**
 * How the attempt STOOD before the roll was drawn, worst-first. This is the honest
 * content of a success probability: not the number, but whether the thing was ever
 * likely.
 * @type {ReadonlyArray<string>}
 */
export const RETURN_ODDS_WORDS = Object.freeze([
  'a forlorn hope', 'a long chance', 'an even thing', 'the likelier outcome',
]);

/**
 * The attempt's standing before the roll, as a word.
 * @param {number} pSuccess 0..1 success probability.
 * @returns {string} a member of RETURN_ODDS_WORDS.
 */
export function returnOddsWordFor(pSuccess) {
  const p = clamp01(pSuccess);
  if (p < 0.25) return RETURN_ODDS_WORDS[0];
  if (p < 0.5) return RETURN_ODDS_WORDS[1];
  if (p < 0.75) return RETURN_ODDS_WORDS[2];
  return RETURN_ODDS_WORDS[3];
}

/**
 * How firmly the seat was expected to hold, worst-first. Read off the coup verdict's
 * `pHold`, which `resolveCoupVerdict` bounds to 0.1..0.9 — so the two interior cuts sit
 * a comfortable step inside both bounds rather than grazing them.
 * @type {ReadonlyArray<string>}
 */
export const SEAT_GRIP_WORDS = Object.freeze(['brittle', 'uncertain', 'firm']);

/**
 * The incumbent's grip before the challenge, as a word.
 * @param {number} pHold 0..1 chance the seat holds.
 * @returns {string} a member of SEAT_GRIP_WORDS.
 */
export function seatGripWordFor(pHold) {
  const p = clamp01(pHold);
  if (p < 0.35) return SEAT_GRIP_WORDS[0];
  if (p < 0.65) return SEAT_GRIP_WORDS[1];
  return SEAT_GRIP_WORDS[2];
}

/**
 * Is `homeId` itself besieged — a CONFIRMED war_front pointing at it?
 * @param {any} graph
 * @param {string} homeId
 */
function isBesieged(graph, homeId) {
  // Provenance-gated (warFrontReads): a pure hostile-RELATIONSHIP front mints the
  // same confirmed war_front id as a real siege but has no army behind it. Counting
  // it here rolled a phantom "lifts the siege at its gates" recovery (+ a false
  // chronicle beat) on an army returning to a merely-hostile home.
  return warFrontsInto(graph, homeId).length > 0;
}

/**
 * DOOR 1 — THE SIEGE BREACH (consumer b). The relieved siege breached a specific wall
 * segment, picked DETERMINISTICALLY from the substrate's per-segment strength + the
 * attacker's approach (the lowest-codepoint besieger, via a stable per-pair octant).
 * Returns the additive `{ wallSegmentId, districtId }` to spread INTO the siege_lifted
 * cause (where the fabric scar reader lifts it into a precise scar). DORMANT — the flag
 * absent or no substrate ⇒ `{}` ⇒ the cause is byte-identical. PURE.
 * @param {Record<string, unknown>|null|undefined} worldState @param {string} homeId
 * @param {{ channels?: unknown[] }|null|undefined} graph
 * @returns {{ wallSegmentId?: number, districtId?: (string|null) }}
 */
function breachCauseFields(worldState, homeId, graph) {
  if (!spatialConsequenceActive(worldState)) return {};
  const sub = substrateOf(worldState, homeId);
  if (!sub) return {};
  const besiegers = warFrontsInto(graph, homeId).map(String).sort(codepoint);
  const attacker = besiegers.length ? besiegers[0] : homeId;
  const breach = resolveBreachSegment(sub, approachOctant(attacker, homeId));
  if (!breach) return {};
  return { wallSegmentId: breach.wallSegmentId, districtId: breach.districtId };
}

/**
 * Is `homeId` OCCUPIED — an entry in the authoritative `worldState.occupations`
 * ledger (the war layer's occupation state machine, keyed by the occupied id)?
 * Conditions are deliberately NOT consulted: an ambient `war_pressure` condition
 * (harassment, an assault aftermath, a nearby war) used to read as "occupied"
 * here, minting a false "throws off its occupiers" chronicle event plus an
 * unearned occupation_lifted recovery on a never-occupied home. The ledger is
 * absent on a war-off / unconquered campaign, so this stays a pure no-op there.
 * @param {any} snapshot
 * @param {string} homeId
 */
function isOccupied(snapshot, homeId) {
  const occupations = snapshot?.worldState?.occupations;
  return Boolean(occupations && typeof occupations === 'object' && occupations[String(homeId)]);
}

/**
 * Is `homeId` a vassal (the JUNIOR side of a resolved vassal edge)?
 * @param {any} snapshot
 * @param {string} homeId
 */
function isVassal(snapshot, homeId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (relState.relationshipType !== 'vassal') continue;
    const roles = relationshipRoles(edge, relState);
    if (String(roles.juniorId) === String(homeId)) return true;
  }
  return false;
}

/**
 * A FAILED / destabilizing strength-scaled return outcome. A depleted army that
 * cannot liberate / relieve / coup — or a gutted host that splinters on the way home —
 * leaves a WOUND on the home order rather than nothing. Routes through a destabilizing
 * condition archetype (faction_challenge for a splinter/disband — a restive faction
 * maneuvering; war_exhaustion for a failed liberation/relief — the home is left weaker
 * still). Severity scales INVERSELY with the returning strength (the more gutted, the
 * worse the instability). A condition outcome flows through applyWorldPulseOutcomes
 * unchanged.
 *
 * @param {{ kind:'rebellion'|'relief'|'splinter'|'disband', homeId:string, homeName:string, sourceId:string, ratio:number, pSuccess:number, tick:number, headline:string, summary:string }} args
 * @returns {any}
 */
function failedReturnOutcome({ kind, homeId, homeName, sourceId, ratio, pSuccess, tick, headline, summary }) {
  // A failed liberation/relief leaves the home weaker (war_exhaustion — economic
  // wound); a splinter/disband is an internal-instability seed (faction_challenge —
  // legitimacy + faction power + social trust). Severity ∝ how gutted the host is.
  const archetype = (kind === 'splinter' || kind === 'disband') ? 'faction_challenge' : 'war_exhaustion';
  // ⚠ A splinter/disband is decided by the host's CONDITION alone — the caller passes
  // pSuccess 0 and roll 0 because no attempt was made and no roll was drawn. The
  // retired sentence printed "Success 0.00, roll 0.00" on both paths, reporting a
  // throw that never happened; this fork is why the odds clause is withheld there.
  const unrolled = archetype === 'faction_challenge';
  const severity = clamp(0.25, 0.7, 0.6 - ratio * 0.4);
  return {
    id: `world_outcome.return_${kind}.${stablePart(homeId)}.${tick}`,
    type: 'condition',
    candidateType: archetype,
    ruleId: `deployment_return_${kind}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: homeId,
    severity,
    headline,
    summary,
    reasons: [unrolled
      ? `A host come home ${returnMusterWordFor(ratio)} did not hold together.`
      : `A host come home ${returnMusterWordFor(ratio)} could not prevail. It was ${returnOddsWordFor(pSuccess)}, and the day went against it.`],
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN_FAILED', sourceEventTargetId: sourceId },
      causes: [{ source: homeId, effect: archetype, reason: `${homeName}'s depleted army's return (${kind}) destabilized the home order.` }],
    },
  };
}

/**
 * Build the contextual return outcomes for armies that came home this tick.
 *
 * @param {Object} args
 * @param {Array<{attackerId:string, deployment:any, targetId:string, outcome:string}>} args.resolvedDeployments
 * @param {any} args.snapshot   the pre-tick world snapshot (byId carries settlement + causal)
 * @param {any} args.graph      the regional graph AFTER this tick's mints (so "besieged" is current)
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} [args.tick]
 * @param {Record<string, unknown>|null} [args.worldState]  for DOOR 1's siege-breach precision (flag + substrate); optional
 * @returns {any[]} probability-1 condition / power_transfer outcomes for applyWorldPulseOutcomes
 */
export function deploymentReturnOutcomes({ resolvedDeployments = [], snapshot, graph, rng, tick = 0, worldState = null }) {
  const outcomes = [];
  const baseRng = rng.fork('deployment-return');
  // Codepoint-sort by home id so iteration order never leaks into output.
  const sorted = [...resolvedDeployments].sort((a, b) => codepoint(String(a.attackerId), String(b.attackerId)));

  for (const record of sorted) {
    const homeId = String(record.attackerId);
    const item = snapshot?.byId?.get?.(homeId);
    if (!item?.settlement) continue;
    const homeName = item.name || item.settlement?.name || homeId;
    const sourceId = `deployment.${stablePart(homeId)}.${stablePart(record.targetId)}`;

    // ── The returning army's REMAINING-STRENGTH RATIO + one id-forked roll. Every
    // resolution below thresholds on this: a strong host succeeds, a depleted one fails
    // / negotiates / splinters. The roll is forked on the home id (order-independent).
    const ratio = strengthRatioOf(record.deployment, record.outcome);
    const recordRng = baseRng.fork(homeId);

    // ── WAR-ECONOMY RETURN-REPLENISH (P1/F2). The army banked a headcount of
    // conscripted + levied population (deployedPopulation) on its march; the SURVIVORS
    // come home, scaled by the army's remaining-strength ratio. The war dead
    // (deployedPopulation − survivors) are the ONLY population sink — they are never
    // credited back, so the books balance by construction (Σ conscription/levy debits −
    // survivors === war dead).
    //
    // Gated on the BANK, not a live flag: deployedPopulation is only ever banked by a
    // flag-gated debit (conscription under warEconomyDrainEnabled, levy under
    // warLevyEnabled), so a non-zero bank PROVES real population was debited and MUST be
    // credited back regardless of which flags hold at RETURN time. Gating the credit on
    // warEconomyDrainEnabled here made warLevyEnabled-without-drain a permanent 100%
    // population sink (every levied man vanished) and let a mid-war drain flag-off strand
    // the whole banked headcount. Flag-off worlds never bank ⇒ byte-identical.
    const deployedPopulation = Math.max(0, Math.round(Number(record.deployment?.deployedPopulation) || 0));
    if (deployedPopulation > 0) {
      const survivors = Math.min(deployedPopulation, Math.round(deployedPopulation * ratio));
      if (survivors > 0) {
        const fell = deployedPopulation - survivors;

        // ── PER-SOURCE HOMECOMING (war-levy per-settlement conservation). The banked
        // deployedPopulation is the overlord's OWN conscripts PLUS every vassal's levied
        // men (deployment.leviedPopulationBySource). Crediting all survivors to the
        // overlord conserves the WORLD total but silently pumps population from vassals to
        // the overlord over a long war. Instead, apportion the survivors back to each
        // contributor in proportion to what it banked — the overlord's conscript share to
        // the overlord, each vassal's share to that vassal — via largest-remainder rounding
        // so the integer credits sum EXACTLY to `survivors` (per-settlement AND world
        // conservation both hold; `fell` remains the sole sink). A conscription-only army
        // (empty levy bank) collapses to a single credit to homeId, byte-identical to the
        // pre-split behavior. Flag-off worlds never bank ⇒ this branch never runs.
        const bankedBySource = /** @type {Record<string, number>} */ (
          record.deployment?.leviedPopulationBySource || {}
        );
        let leviedTotal = 0;
        /** @type {{ saveId: string, banked: number, name: string }[]} */
        const recipients = [];
        for (const srcId of Object.keys(bankedBySource).sort(codepoint)) {
          const banked = Math.max(0, Math.round(Number(bankedBySource[srcId]) || 0));
          if (banked <= 0) continue;
          leviedTotal += banked;
          const srcItem = snapshot?.byId?.get?.(srcId);
          recipients.unshift({
            saveId: String(srcId),
            banked,
            name: srcItem?.name || srcItem?.settlement?.name || String(srcId),
          });
        }
        // The overlord's own conscript headcount is whatever wasn't levied. Prepended so a
        // no-levy army yields exactly one recipient (homeId), preserving the old output.
        const conscripted = Math.max(0, deployedPopulation - leviedTotal);
        recipients.unshift({ saveId: homeId, banked: conscripted, name: homeName });

        const totalBanked = recipients.reduce((sum, r) => sum + r.banked, 0) || 1;
        const shares = recipients.map((r) => {
          const exact = (survivors * r.banked) / totalBanked;
          const floor = Math.floor(exact);
          return { ...r, alloc: floor, remainder: exact - floor };
        });
        let allocated = shares.reduce((sum, s) => sum + s.alloc, 0);
        // Hand the rounding leftover to the largest remainders (codepoint tie-break) so
        // the per-recipient credits sum to exactly `survivors` — deterministically.
        const byRemainder = [...shares].sort(
          (a, b) => (b.remainder - a.remainder) || codepoint(a.saveId, b.saveId),
        );
        for (let i = 0; allocated < survivors && i < byRemainder.length; i += 1, allocated += 1) {
          byRemainder[i].alloc += 1;
        }

        const populationDeltas = shares
          .filter((s) => s.alloc > 0)
          .map((s) => ({
            saveId: s.saveId,
            delta: s.alloc,
            reason: s.saveId === homeId
              ? `${homeName}'s surviving soldiers return home.`
              : `${s.name}'s surviving levies return home from ${homeName}'s war.`,
          }));
        const dispersedToVassals = populationDeltas.some((d) => d.saveId !== homeId);

        outcomes.push({
          id: `world_outcome.army_homecoming.${stablePart(homeId)}.${tick}`,
          candidateType: 'army_homecoming',
          targetSaveId: homeId,
          generatedAtTick: tick,
          tick,
          headline: `${homeName}'s army comes home`,
          // formatCount (as populationDynamics does): this summary persists into
          // wizardNews/chronicle records, so a bare toLocaleString() would make the
          // same seed produce different bytes across runner locales.
          summary: dispersedToVassals
            ? `${formatCount(survivors)} of ${homeName}'s host disperse to their homes${fell > 0 ? `; ${formatCount(fell)} did not` : ''}.`
            : `${formatCount(survivors)} of ${homeName}'s host return to the muster${fell > 0 ? `; ${formatCount(fell)} did not` : ''}.`,
          populationDeltas,
          metadata: { warEconomy: 'homecoming', armyId: homeId, survivors, fell, deployedPopulation },
        });
      }
    }

    if (isOccupied(snapshot, homeId)) {
      // STRENGTH-SCALED: a strong returning army breaks the foreign occupation; a
      // depleted one mounts a FAILED rebellion (it cannot retake its own home).
      const pSuccess = returnSuccessProbability(ratio);
      const roll = recordRng.fork('liberation').random();
      if (roll < pSuccess) {
        // W-SEAT D7 (SEAT-5): the second `occupation_lifted` producer, and the same ONE
        // derivation — "the settlement begins restoring its own authority" below had no
        // writer behind it on either path. Null when the seat key is dark, in which case
        // the pushed object is key-for-key the pre-SEAT-5 one.
        const liftTransfer = occupationLiftTransfer(worldState, item, tick);
        outcomes.push({
          id: `world_outcome.occupation_lifted.${stablePart(homeId)}.${tick}`,
          type: 'condition',
          candidateType: 'occupation_lifted',
          ruleId: 'deployment_return_occupation_lifted',
          ruleFamily: 'stressor',
          applyMode: 'auto',
          probability: 1,
          targetSaveId: homeId,
          severity: 0.3,
          headline: `${homeName} throws off its occupiers`,
          summary: `${homeName}'s army returned to a captured home and broke the occupation; the settlement begins restoring its own authority.`,
          reasons: [`A host come home ${returnMusterWordFor(ratio)} threw off the occupiers: ${returnOddsWordFor(pSuccess)}, and it came off.`],
          ...(liftTransfer ? { powerTransfer: liftTransfer } : {}),
          condition: {
            archetype: 'occupation_lifted',
            severity: 0.3,
            triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
            causes: [{ source: homeId, effect: 'occupation_lifted', reason: `${homeName}'s returning army broke the occupation.` }],
          },
        });
      } else {
        outcomes.push(failedReturnOutcome({
          kind: 'rebellion', homeId, homeName, sourceId, ratio, pSuccess, tick,
          headline: `${homeName}'s liberation falters`,
          summary: `${homeName}'s army came home too spent to break the occupation; the failed rising leaves the settlement weaker still.`,
        }));
      }
      continue;
    }

    if (isBesieged(graph, homeId)) {
      // STRENGTH-SCALED: a strong returning army relieves the home siege; a depleted
      // one is brushed aside (a FAILED relief that deepens the home's plight).
      const pSuccess = returnSuccessProbability(ratio);
      const roll = recordRng.fork('relief').random();
      if (roll < pSuccess) {
        outcomes.push({
          id: `world_outcome.siege_lifted.${stablePart(homeId)}.${tick}`,
          type: 'condition',
          candidateType: 'siege_lifted',
          ruleId: 'deployment_return_siege_lifted',
          ruleFamily: 'stressor',
          applyMode: 'auto',
          probability: 1,
          targetSaveId: homeId,
          severity: 0.3,
          headline: `${homeName} lifts the siege at its gates`,
          summary: `${homeName}'s army returned to a besieged home and relieved it; the settlement begins to recover.`,
          reasons: [`A host come home ${returnMusterWordFor(ratio)} relieved the siege: ${returnOddsWordFor(pSuccess)}, and it came off.`],
          condition: {
            archetype: 'siege_lifted',
            severity: 0.3,
            triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
            // DOOR 1 — the relieved siege breached a specific wall SEGMENT; the breach
            // rides INSIDE the cause (the only field surviving deriveActiveCondition's
            // whitelist), where the fabric scar reader lifts it into a precise scar.
            // Dark / no substrate ⇒ {} spread ⇒ the cause is byte-identical.
            causes: [{ source: homeId, effect: 'siege_lifted', reason: `${homeName}'s returning army relieved the siege.`, ...breachCauseFields(worldState, homeId, graph) }],
          },
        });
      } else {
        outcomes.push(failedReturnOutcome({
          kind: 'relief', homeId, homeName, sourceId, ratio, pSuccess, tick,
          headline: `${homeName}'s relief column is broken`,
          summary: `${homeName}'s depleted army could not break through to its besieged home; the failed relief leaves the defenders more desperate.`,
        }));
      }
      continue;
    }

    if (isVassal(snapshot, homeId)) {
      // A vassal whose army comes home is a coup risk: legitimacy decides whether the
      // returning host CAN topple the seat — but it is gated on STRENGTH FIRST. A
      // depleted host that marches home is in no shape to coup (it DISBANDS, and a
      // gutted one may splinter); only a host with strength to spare even rolls the
      // legitimacy verdict, and its strength tilts that verdict.
      if (ratio < SPLINTER_RATIO) {
        // Too spent to coup — the host disbands. A truly gutted one splinters.
        if (ratio < SPLINTER_RATIO * DISBAND_RATIO_SCALE) {
          outcomes.push(failedReturnOutcome({
            kind: 'disband', homeId, homeName, sourceId, ratio, pSuccess: 0, tick,
            headline: `${homeName}'s host comes home broken`,
            summary: `${homeName}'s army returned too gutted to challenge the overlord's seat; remnants desert and the order tightens its grip.`,
          }));
        }
        continue;
      }
      // Strength to spare → the legitimacy coup verdict, tilted by the army's strength
      // (a stronger returning host topples a weak seat more readily). The strength tilt
      // feeds the verdict severity so a near-full host coups decisively.
      // W-SEAT D4. ⚠ THIS PATH IS VASSALAGE-ONLY BY CONSTRUCTION and the reason is worth
      // stating: the `isOccupied(snapshot, homeId)` branch above returns first, so a home
      // held at spearpoint routes to liberation-or-failed-rebellion and NEVER reaches this
      // verdict. What can reach it is a returning host in a town whose overlord holds a
      // compact rather than a garrison — exactly the case the seat's scalar weight models.
      // 0 when the flag is dark or no seat resolves => byte-identical.
      //
      // ⚠ AND THE COMPOSITION HERE IS DELIBERATELY THINNER THAN coup.js's: this site
      // supplies NONE of warSentimentAdj / interventionAdj / economicAdj, which is a
      // pre-existing choice this car does not revisit. The seat term joins because it is
      // derivable from exactly the arguments this function already takes; the other three
      // need per-tick reads it deliberately does not perform. Recorded, not smuggled.
      const verdict = resolveCoupVerdict({
        settlement: item.settlement,
        rng: recordRng.fork('coup'),
        severity: clamp(0.45, 0.85, 0.4 + ratio * 0.5),
        rulingAuthorityScore: item.causal?.scores?.ruling_authority ?? null,
        foreignSeatAdj: foreignSeatCoupAdj(worldState, snapshot, homeId),
        // W-SEAT D10 joins by the SAME rule the seat term joined by, stated one comment
        // above: it is derivable from exactly the arguments this function already takes.
        // Wiring only coup.js would be a silent PARTIAL lighting — one of two verdict
        // callers moving while the other did not — which is the recorded failure the seat
        // family cured by putting its gate inside the producer rather than at each consumer.
        forceRatioFactor: irregularShareFactor(worldState, snapshot, homeId),
      });
      if (verdict.holds || !verdict.winner) continue; // order held — generic clear (no residual)
      const winner = /** @type {{ name: string, archetype: string }} */ (verdict.winner);
      const incumbentName = /** @type {any} */ (verdict.incumbent)?.name || 'the ruling power';
      const losers = (verdict.challengers || [])
        .filter(/** @param {any} c */ c => c.name !== winner.name)
        .map(/** @param {any} c */ c => c.name);
      outcomes.push({
        id: `world_outcome.return_coup.${stablePart(homeId)}.${tick}`,
        type: 'power_transfer',
        candidateType: 'coup_succeeded',
        ruleId: 'deployment_return_coup',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: homeId,
        severity: clamp(0.45, 1, 0.6),
        headline: `${winner.name} seizes power in ${homeName}`,
        summary: `${homeName}'s army marched home and the ${String(incumbentName).toLowerCase()} could not hold it. ${winner.name} now commands the government.`,
        reasons: [
          verdict.reason,
          `The host came home ${returnMusterWordFor(ratio)}, and a grip that had looked ${seatGripWordFor(verdict.pHold)} did not survive its arrival.`,
        ],
        powerTransfer: {
          toPowerName: winner.name,
          cause: 'coup',
          tick,
          losers,
          sourceStressorId: sourceId,
        },
        condition: {
          archetype: 'government_overthrown',
          severity: clamp(0.45, 0.8, 0.6),
          triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
          causes: [{
            source: homeId,
            effect: 'government_overthrown',
            reason: `${winner.name} overthrew ${incumbentName} when the army returned.`,
          }],
        },
      });
      continue;
    }

    // ── Generic clear. A HEALTHY army stands down with no residual. But
    // a BADLY-DAMAGED army returning to an untroubled home is itself DESTABILIZING — it
    // SPLINTERS: deserters, would-be rebels, a restive loyalist remnant. A low-strength
    // return is a postwar-instability seed (splinters: rebels/deserters). ────────────
    if (ratio < SPLINTER_RATIO) {
      outcomes.push(failedReturnOutcome({
        kind: 'splinter', homeId, homeName, sourceId, ratio, pSuccess: 0, tick,
        headline: `${homeName}'s broken host comes home`,
        summary: `${homeName}'s army returned a shadow of the force that marched out. Deserters scatter and the survivors are restive, a wound on the home order.`,
      }));
    }
  }

  return outcomes;
}
