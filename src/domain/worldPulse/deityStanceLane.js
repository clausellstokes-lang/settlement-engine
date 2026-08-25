/**
 * domain/worldPulse/deityStanceLane.js — the SPREAD-lane inter-deity STANCE
 * CONSUMER (Phase 4 W-F4b, completing W-F4's first deferred item).
 *
 * deityStance.js (W-F2) is the PURE stance CORE — `stanceOf(source, target)` over
 * the two signed alignment axes. This module is its GLOBAL-lane consumer: over the
 * codepoint-sorted DEITY-BEARING RELATED pairs of a realm it turns those stances
 * into discrete, seeded, cause-chained EVENTS —
 *
 *   • BETRAYAL — an evil patron backstabs a PARTNER (a settlement it already holds a
 *     positive pact with). Hazard is the source's `stanceOf().betrayalHazard`
 *     DAMPED by EVIL-PACT COHESION keyed on the MIN lawfulness across the two
 *     parties (the owner's evil-pact rule: LE×LE bond hardest ⇒ least betrayal;
 *     any chaotic-evil party ⇒ brittle ⇒ most betrayal, so LE×LE < LE×CE ≈ CE×CE
 *     in betrayal frequency). Composed with the ACTING settlement's piety composite
 *     (a devout evil patron backstabs harder/oftener — §2.5), gated by a
 *     per-pair COOLDOWN (no re-betrayal within BETRAYAL_COOLDOWN_TICKS, read from
 *     pulseHistory) and a per-tick realm CAP (MAX_BETRAYALS_PER_TICK — the
 *     containment-cap idiom, pantheon.js:70). Surfaced through the EXISTING
 *     `betrayal` stressor + news chain (the conversionOutcome pattern).
 *   • PACT — a consolidated GOOD (or a strong lawful-evil) cooperation draws two
 *     related-but-not-yet-allied faiths together. Surfaced as a light cause-chained
 *     `faith_pact` news outcome (the positive relationship-WEIGHT coupling is the
 *     deferred half — this wave stops at legible events, never relationship weights).
 *
 * ASYMMETRY BY DESIGN (the self-balancing property): good's betrayalHazard is 0 —
 * it never initiates; evil forms no bloc and carries a standing betrayal price, so
 * coalitions of light vs a fractious darkness fall out of the numbers, not a rule.
 *
 * INERTNESS: the whole lane is SPREAD-gated by its caller (advanceReligionStates'
 * spread branch) ⇒ inert when spread is off. Within spread, a realm of only
 * True-Neutral / legacy deities reads all-zero stances ⇒ no event ⇒ byte-identical.
 * Guards (cooldown, cap, dead-band) are ABSOLUTE — never piety-amplified (§2.5).
 *
 * PURE: no wall-clock, no mutation, no Math.random. The only entropy is the
 * INJECTED pulse PRNG, forked per pair on the STABLE key
 * `deity-stance::${tick}::${a}::${b}` (a < b codepoint order) ⇒ replay-identical
 * and consumption-independent. All iteration is codepoint-sorted.
 */

import { stanceOf } from './deityStance.js';
import { chaos01 } from './deityAxes.js';
import { normalizeStressor } from './stressors.js';
import { stablePart } from '../region/graph.js';

/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string, _deityRef?: string }} DeitySnapshot */
/** @typedef {{ localMult: number, realmMult: number }} AmplifierTag */
/** @typedef {Record<string, unknown>} StanceOutcome  a pulse outcome record (built here, consumed by the apply pass) */

export const STANCE_LANE_TUNING = Object.freeze({
  BETRAYAL_COOLDOWN_TICKS: 8,   // no re-betrayal on a pair within this window (pulseHistory-read)
  // [worldpulse-religion-trade-2] G1d — metronome discipline for the standing-state
  // re-emitters. A pact / foothold that already fired on a pair (or on a
  // cid×rival×minister) re-announces at most once per this window instead of
  // every tick. Aligned to the realm-wide re-emit cadence (DRIFT_REEMIT_COOLDOWN_TICKS
  // / FLIP_COOLDOWN_TICKS = 6). Both rides pulseHistory — no new worldState key.
  PACT_COOLDOWN_TICKS: 6,       // no re-announced faith pact on a pair within this window
  FOOTHOLD_COOLDOWN_TICKS: 6,   // no re-announced foothold on a (cid,rival,minister) within this window
  MAX_BETRAYALS_PER_TICK: 2,    // realm cap (containment-cap idiom, pantheon.js:70)
  MAX_PACTS_PER_TICK: 3,        // realm cap on positive events too (bounded emission)
  COHESION_LAW_W: 0.6,          // evil-pact cohesion: MIN-lawfulness ⇒ this much betrayal-hazard damp
  BETRAYAL_MIN_HAZARD: 0.05,    // dead-band: below this effective hazard, no betrayal event
  PACT_MIN_COOP: 0.45,          // cooperation floor for a NEW pact (good-good qualifies; evil transactional does not)
  BETRAYAL_SEVERITY: 0.6,       // base betrayal-shock severity (before the piety composite)
  PIETY_CAP: 2.0,               // never let the piety composite push a probability past the composite bound
});

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** The pair key (a < b codepoint order) used for the fork, cooldown, and receipts. @param {string} a @param {string} b */
export const stancePairKey = (a, b) => (a < b ? `${a}::${b}` : `${b}::${a}`);

/** 0..1 lawfulness of a deity: 1 lawful · 0.5 neutral/legacy · 0 chaotic (from chaos01). @param {DeitySnapshot} d @returns {number} */
const lawfulness01 = (d) => 1 - chaos01(d);

/**
 * The EVIL-PACT-COHESION-damped betrayal hazard the SOURCE deity carries toward the
 * TARGET: `stanceOf(source,target).betrayalHazard × (1 − COHESION_LAW_W × minLawfulness)`.
 * Both-lawful (LE×LE) ⇒ min-lawfulness 1 ⇒ max damp ⇒ least betrayal; any chaotic party
 * ⇒ min-lawfulness low ⇒ little damp ⇒ near-full hazard. Good/neutral source ⇒ 0. Pure.
 * @param {DeitySnapshot} source @param {DeitySnapshot} target @returns {number}
 */
export function pactBetrayalHazard(source, target) {
  const T = STANCE_LANE_TUNING;
  const base = stanceOf(source, target).betrayalHazard;
  if (base <= 0) return 0;
  const minLaw = Math.min(lawfulness01(source), lawfulness01(target));   // 0..1; both lawful ⇒ 1
  return clamp01(base * (1 - T.COHESION_LAW_W * minLaw));
}

/**
 * The pairs whose deity pact was BETRAYED within the cooldown window, read from
 * pulseHistory. A pair key appears here iff a `religious_pact_betrayal` outcome for
 * it landed at a tick within BETRAYAL_COOLDOWN_TICKS of `tick`. Pure read.
 * @param {{ pulseHistory?: Array<{ tick?: number, selectedOutcomes?: Array<{ ruleId?: string, tick?: number, metadata?: { pairKey?: string } }> }> }|null|undefined} worldState
 * @param {number} tick
 * @returns {Set<string>}
 */
export function betrayalCooldownPairs(worldState, tick) {
  const T = STANCE_LANE_TUNING;
  const out = new Set();
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  for (const rec of history) {
    for (const o of (rec?.selectedOutcomes || [])) {
      if (o?.ruleId !== 'religious_pact_betrayal') continue;
      const key = o?.metadata?.pairKey;
      if (!key) continue;
      const at = Number.isFinite(o?.tick) ? Number(o.tick) : (Number.isFinite(rec?.tick) ? Number(rec.tick) : null);
      if (at == null || tick - at < T.BETRAYAL_COOLDOWN_TICKS) out.add(String(key));
    }
  }
  return out;
}

/**
 * [worldpulse-religion-trade-2] G1d — the pairs whose FAITH PACT was announced
 * within the cooldown window, read from pulseHistory. A pact re-announces at most
 * once per PACT_COOLDOWN_TICKS instead of ~every tick the two consolidated creeds
 * qualify. Mirrors betrayalCooldownPairs exactly (same ledger family, same window
 * semantics). Pure read.
 * @param {{ pulseHistory?: Array<{ tick?: number, selectedOutcomes?: Array<{ ruleId?: string, tick?: number, metadata?: { pairKey?: string } }> }> }|null|undefined} worldState
 * @param {number} tick
 * @returns {Set<string>}
 */
export function pactCooldownPairs(worldState, tick) {
  const T = STANCE_LANE_TUNING;
  const out = new Set();
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  for (const rec of history) {
    for (const o of (rec?.selectedOutcomes || [])) {
      if (o?.ruleId !== 'religious_pact_formation') continue;
      const key = o?.metadata?.pairKey;
      if (!key) continue;
      const at = Number.isFinite(o?.tick) ? Number(o.tick) : (Number.isFinite(rec?.tick) ? Number(rec.tick) : null);
      if (at == null || tick - at < T.PACT_COOLDOWN_TICKS) out.add(String(key));
    }
  }
  return out;
}

/**
 * [worldpulse-religion-trade-2] G1d — the stable cooldown key for a TARGETED
 * FOOTHOLD: the (settlement, rival creed, recruited minister) triple. Used
 * identically by the emission gate (religiousContest) and the pulseHistory reader
 * below, so the two never disagree.
 * @param {unknown} settlementId @param {unknown} rivalRef @param {unknown} npcId @returns {string}
 */
export const footholdCooldownKey = (settlementId, rivalRef, npcId) =>
  `${String(settlementId)}::${String(rivalRef)}::${String(npcId || 'x')}`;

/**
 * [worldpulse-religion-trade-2] G1d — the (cid,rival,minister) triples whose
 * TARGETED FOOTHOLD was announced within the cooldown window, read from
 * pulseHistory. A foothold is deterministic over static NPC traits, so absent a
 * cooldown it re-prints "X finds an ear in Y" EVERY tick; this suppresses the
 * repeat to once per FOOTHOLD_COOLDOWN_TICKS. Pure read.
 * @param {{ pulseHistory?: Array<{ tick?: number, selectedOutcomes?: Array<{ ruleId?: string, tick?: number, metadata?: { settlementId?: string, rivalRef?: string, npcId?: string } }> }> }|null|undefined} worldState
 * @param {number} tick
 * @returns {Set<string>}
 */
export function footholdCooldownKeys(worldState, tick) {
  const T = STANCE_LANE_TUNING;
  const out = new Set();
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  for (const rec of history) {
    for (const o of (rec?.selectedOutcomes || [])) {
      if (o?.ruleId !== 'religious_targeted_foothold') continue;
      const m = o?.metadata;
      if (!m || m.settlementId == null || m.rivalRef == null) continue;
      const at = Number.isFinite(o?.tick) ? Number(o.tick) : (Number.isFinite(rec?.tick) ? Number(rec.tick) : null);
      if (at == null || tick - at < T.FOOTHOLD_COOLDOWN_TICKS) out.add(footholdCooldownKey(m.settlementId, m.rivalRef, m.npcId));
    }
  }
  return out;
}

/**
 * A DEITY-PACT BETRAYAL outcome — a `betrayal` stressor shock on the BETRAYED
 * settlement, mirroring conversionOutcome's plumbing (auto/prob-1, stressor + news +
 * cause chain). Distinct ruleId (`religious_pact_betrayal`) and id namespace keep it
 * apart from war betrayals; NO originContext ⇒ no traitor is seeded (this is a divine
 * schism, not an internal defection).
 * @param {{ pairKey: string, source: string, target: string, sourceName: string, targetName: string, sourceDeity: DeitySnapshot, targetDeity: DeitySnapshot, severity: number, tick: number, reasons: string[], amplifiers: AmplifierTag|null }} args
 * @returns {StanceOutcome}
 */
function betrayalOutcome({ pairKey, source, target, sourceName, targetName, sourceDeity, targetDeity, severity, tick, reasons, amplifiers }) {
  const stressor = normalizeStressor({
    type: 'betrayal',
    originSettlementId: source,
    severity,
    affectedSettlementIds: [target],
  });
  return {
    id: `world_stressor.betrayal.deity_pact.${stablePart(source)}.${stablePart(target)}`,
    type: 'stressor',
    candidateType: 'stressor_birth_religious_pact_betrayal',
    ruleId: 'religious_pact_betrayal',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: target,
    severity,
    headline: `${sourceName} turns on ${targetName}`,
    summary: `The faith of ${sourceDeity?.name || sourceName} broke its pact with ${targetName}, a betrayal its patron's nature made only a matter of time.`,
    reasons,
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      conversionCause: 'deity_pact_betrayal',
      pairKey,
      betrayer: source,
      betrayed: target,
      betrayerDeity: sourceDeity?.name || null,
      betrayedDeity: targetDeity?.name || null,
      ...(amplifiers ? { amplifiers } : {}),
    },
    condition: {
      archetype: 'betrayal',
      severity,
      triggeredAt: { tick, sourceEventType: 'DEITY_PACT_BETRAYAL', sourceEventTargetId: source },
      causes: [{ source, effect: 'betrayal', reason: reasons[0] }],
    },
    conflictTags: [`stressor:betrayal:${target}`, `settlement:${target}:stressor_birth`],
  };
}

/**
 * A FAITH-PACT outcome — a light, cause-chained NEWS record of two faiths drawing
 * together (no stressor, no state mutation; the positive relationship-WEIGHT coupling
 * is the deferred half). Auto/prob-1 so it threads the deterministic apply set and
 * lands in pulseHistory for legibility.
 * @param {{ pairKey: string, a: string, b: string, aName: string, bName: string, aDeity: DeitySnapshot, bDeity: DeitySnapshot, tick: number, reasons: string[], amplifiers: AmplifierTag|null }} args
 * @returns {StanceOutcome}
 */
function pactOutcome({ pairKey, a, b, aName, bName, aDeity, bDeity, tick, reasons, amplifiers }) {
  return {
    id: `world_faith_pact.${stablePart(a)}.${stablePart(b)}`,
    type: 'faith_pact',
    candidateType: 'faith_pact_formed',
    ruleId: 'religious_pact_formation',
    ruleFamily: 'diplomacy',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: a,
    severity: 0.2,
    headline: `${aName} and ${bName} find common cause in faith`,
    summary: `The kindred creeds of ${aDeity?.name || aName} and ${bDeity?.name || bName} drew ${aName} and ${bName} into a pact of shared purpose.`,
    reasons,
    metadata: {
      conversionCause: 'deity_pact_formation',
      pairKey,
      partners: [a, b],
      deities: [aDeity?.name || null, bDeity?.name || null],
      ...(amplifiers ? { amplifiers } : {}),
    },
    condition: {
      archetype: 'faith_pact',
      severity: 0.2,
      triggeredAt: { tick, sourceEventType: 'DEITY_PACT_FORMATION', sourceEventTargetId: a },
      causes: [{ source: b, effect: 'faith_pact', reason: reasons[0] }],
    },
    conflictTags: [`faith_pact:${pairKey}`],
  };
}

/**
 * A TARGETED-FOOTHOLD outcome (item 3) — a NAMED, cause-chained record that a present
 * RIVAL creed has recruited a SPECIFIC influential minister whose authored traits match
 * its plane and clash with the patron's (the owner's "usurpation is cast, named, and
 * narratable"). Rides the item-1 plumbing: a light `faith_foothold` news outcome (auto/
 * prob-1, no crisis stressor — the full conversion-defense consumption is deferred).
 * @param {{ cid: string, cityName: string, npcId: string, npcName: string, rivalRef: string, rivalName: string, patronName: string, tick: number, reasons: string[], amplifiers: AmplifierTag|null }} args
 * @returns {StanceOutcome}
 */
export function footholdOutcome({ cid, cityName, npcId, npcName, rivalRef, rivalName, patronName, tick, reasons, amplifiers }) {
  return {
    id: `world_faith_foothold.${stablePart(cid)}.${stablePart(rivalRef)}.${stablePart(npcId || 'x')}`,
    type: 'faith_foothold',
    candidateType: 'faith_foothold_recruited',
    ruleId: 'religious_targeted_foothold',
    ruleFamily: 'religion',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: cid,
    severity: 0.3,
    headline: `${rivalName} finds an ear in ${cityName}`,
    summary: `${npcName}, whose temper leans to ${rivalName} and away from ${patronName}, has become the creed's foothold within ${cityName}.`,
    reasons,
    metadata: {
      conversionCause: 'targeted_foothold',
      settlementId: cid,
      npcId,
      rivalRef,
      rivalDeity: rivalName,
      patronDeity: patronName,
      ...(amplifiers ? { amplifiers } : {}),
    },
    condition: {
      archetype: 'faith_foothold',
      severity: 0.3,
      triggeredAt: { tick, sourceEventType: 'DEITY_TARGETED_FOOTHOLD', sourceEventTargetId: cid },
      causes: [{ source: npcId || cid, effect: 'faith_foothold', reason: reasons[0] }],
    },
    conflictTags: [`faith_foothold:${cid}:${rivalRef}`],
  };
}

/**
 * Evaluate the global stance lane over the realm's deity-bearing related pairs.
 * PURE + deterministic — the only entropy is the injected `rng`, forked per pair.
 *
 * @param {Object} args
 * @param {Array<{ a: string, b: string, positive: boolean }>} args.pairs
 *   CODEPOINT-SORTED (a < b) deity-bearing related pairs; `positive` = the two already
 *   hold a cooperative relationship (a pact a betrayal could break).
 * @param {(id: string) => DeitySnapshot|null} args.deityOf  patron snapshot for a settlement id (or null)
 * @param {(id: string) => number} args.pietyMultOf  composite piety multiplier (1.0 when no record)
 * @param {(id: string) => string} args.nameFor      display name for a settlement id
 * @param {number} args.tick
 * @param {{ fork: (key: string) => { random: () => number } }|null} args.rng  the pulse PRNG (DI'd)
 * @param {Set<string>} [args.cooldownPairs]         pairs on betrayal cooldown (betrayalCooldownPairs)
 * @param {Set<string>} [args.pactCooldown]          pairs on pact-reannounce cooldown (pactCooldownPairs)
 * @returns {{ outcomes: StanceOutcome[], betrayed: Array<{ pairKey: string, source: string, target: string }>, pacts: Array<{ pairKey: string, a: string, b: string }> }}
 */
export function evaluateDeityStanceLane({ pairs, deityOf, pietyMultOf, nameFor, tick, rng, cooldownPairs = new Set(), pactCooldown = new Set() }) {
  const T = STANCE_LANE_TUNING;
  /** @type {StanceOutcome[]} */
  const outcomes = [];
  /** @type {Array<{ pairKey: string, source: string, target: string }>} */
  const betrayed = [];
  /** @type {Array<{ pairKey: string, a: string, b: string }>} */
  const pacts = [];
  if (!rng?.fork || !Array.isArray(pairs) || !pairs.length) return { outcomes, betrayed, pacts };

  let betrayalsThisTick = 0;
  let pactsThisTick = 0;

  for (const { a, b, positive } of pairs) {
    const dA = deityOf(a);
    const dB = deityOf(b);
    if (!dA || !dB) continue;
    const pairKey = stancePairKey(a, b);
    // ONE pair-forked roll drives BOTH the betrayal (low tail) and the pact (high
    // tail) branches; a pair is EITHER already-allied (betrayal-eligible) or not
    // (pact-eligible), so the two never contend for the same pair in the same tick.
    const roll = rng.fork(`deity-stance::${tick}::${a}::${b}`).random();

    if (positive) {
      // BETRAYAL branch — the more-hazardous party is the betrayer.
      const hzAB = pactBetrayalHazard(dA, dB);
      const hzBA = pactBetrayalHazard(dB, dA);
      const source = hzAB >= hzBA ? a : b;
      const target = source === a ? b : a;
      const sourceDeity = source === a ? dA : dB;
      const targetDeity = source === a ? dB : dA;
      const rawHazard = Math.max(hzAB, hzBA);
      // Compose with the ACTING (betrayer) settlement's piety — devout zeal drives it;
      // the composite is bounded so the PROBABILITY never exceeds 1.
      const effHazard = clamp01(rawHazard * Math.min(T.PIETY_CAP, pietyMultOf(source)));
      if (effHazard < T.BETRAYAL_MIN_HAZARD) continue;
      if (cooldownPairs.has(pairKey)) continue;
      if (betrayalsThisTick >= T.MAX_BETRAYALS_PER_TICK) continue;
      if (roll >= effHazard) continue;
      betrayalsThisTick += 1;
      const pMult = pietyMultOf(source);
      const severity = clamp01(T.BETRAYAL_SEVERITY * Math.min(T.PIETY_CAP, pMult));
      const reasons = [
        `${nameFor(source)} broke its pact with ${nameFor(target)}: its patron ${sourceDeity?.name || 'creed'} (${sourceDeity?.alignmentAxis || 'neutral'}/${sourceDeity?.lawAxis || 'neutral'}) carries a standing betrayal hazard toward ${targetDeity?.name || 'its partner'} (${targetDeity?.alignmentAxis || 'neutral'}/${targetDeity?.lawAxis || 'neutral'}).`,
      ];
      if (pMult > 1) reasons.push(`Local devotion (piety ×${pMult.toFixed(2)}) sharpened the treachery.`);
      const amplifiers = pMult !== 1 ? { localMult: pMult, realmMult: 1 } : null;
      outcomes.push(betrayalOutcome({ pairKey, source, target, sourceName: nameFor(source), targetName: nameFor(target), sourceDeity, targetDeity, severity, tick, reasons, amplifiers }));
      betrayed.push({ pairKey, source, target });
    } else {
      // PACT branch — consolidated cooperation draws related-but-unallied faiths together.
      const coop = Math.max(stanceOf(dA, dB).cooperation, stanceOf(dB, dA).cooperation);
      if (coop < T.PACT_MIN_COOP) continue;
      // [worldpulse-religion-trade-2] G1d — metronome: a pact already announced on
      // this pair within PACT_COOLDOWN_TICKS does not re-print. (First announcement
      // is never on cooldown ⇒ byte-identical for a fresh pact.)
      if (pactCooldown.has(pairKey)) continue;
      // The initiator (a, codepoint-first) sets the piety composition — deterministic.
      const effCoop = clamp01(coop * Math.min(T.PIETY_CAP, pietyMultOf(a)));
      if (pactsThisTick >= T.MAX_PACTS_PER_TICK) continue;
      if (roll >= effCoop) continue;
      pactsThisTick += 1;
      const pMult = pietyMultOf(a);
      const reasons = [
        `${nameFor(a)} and ${nameFor(b)} were drawn together: the kindred creeds ${dA?.name || 'a faith'} (${dA?.alignmentAxis || 'neutral'}/${dA?.lawAxis || 'neutral'}) and ${dB?.name || 'a faith'} (${dB?.alignmentAxis || 'neutral'}/${dB?.lawAxis || 'neutral'}) share common ground.`,
      ];
      if (pMult > 1) reasons.push(`Local devotion (piety ×${pMult.toFixed(2)}) deepened the bond.`);
      const amplifiers = pMult !== 1 ? { localMult: pMult, realmMult: 1 } : null;
      outcomes.push(pactOutcome({ pairKey, a, b, aName: nameFor(a), bName: nameFor(b), aDeity: dA, bDeity: dB, tick, reasons, amplifiers }));
      pacts.push({ pairKey, a, b });
    }
  }

  return { outcomes, betrayed, pacts };
}
