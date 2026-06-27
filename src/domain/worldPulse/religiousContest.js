/**
 * domain/worldPulse/religiousContest.js — the religion core (deity contest +
 * conversion spread + religious_authority mint).
 *
 * "C's primary faith" is a CONTESTABLE PRIZE. C's embedded deity (the incumbent)
 * holds it; neighbouring deities that reach C along a religious_authority carrier
 * channel contest to convert it. The contest math, the incumbency amplifier, the
 * determinism, and the tie-break all live in the shared primitive
 * `contestOverThirdParty`; this module is a thin caller that enumerates contests
 * deterministically and supplies a single blended 0..1 `scoreFor` per contender.
 *
 *   scoreFor(X) = deityRankStrength(X) × carrierChannelStrength(X→C)
 *                 × neighbourReligiousAuthority(X) × proximity/orthodoxy(C)
 *   (blended in LOG-ODDS by the primitive — never a raw product across contenders)
 *
 * A conversion RE-EMBEDS the winning neighbour's EXISTING primaryDeitySnapshot
 * onto C's `config.primaryDeitySnapshot` (copied from the neighbour's embedded
 * snapshot — never customContent; the pulse never reads customContent), stamps a
 * conversion condition, and SEEDS the existing `religious_conversion_fracture`
 * stressor on C so the conversion SPREADS along religious_authority (the stressor
 * already declares `spreadChannels:['religious_authority']` and the existing
 * religiousConversionGate already boosts ~1.6× under occupation). We do NOT invent
 * a parallel spread.
 *
 * DOUBLE GATE — byte-identical when dormant. Religion ACTS only when BOTH hold:
 *   (a) rules.religionDynamicsEnabled (the opt-in flag, default false), AND
 *   (b) isSubsystemActive(snapshot,'religion') (true iff ≥1 settlement carries
 *       an embedded config.primaryDeitySnapshot).
 * If EITHER is false ⇒ pure no-op returning empties (no mints, no contests, no
 * conversions) ⇒ byte-identical legacy. A no-deity campaign is unchanged even with
 * the flag on, because the activation gate short-circuits before any fork or mint.
 *
 * DETERMINISM CONTRACT (sacred, identical to A1/A2):
 *   - No Date.now / Math.random / argless new Date. RNG is INJECTED; the contest
 *     forks on the FROZEN F3 recipe (`contest:religious_authority:<prizeId>:<tick>`).
 *   - Every output iteration is over a CODEPOINT-SORTED key list — converts,
 *     contenders, mint endpoints. Never a Map/Set/Object insertion order.
 *   - All reads come from the SINGLE pre-tick snapshot. Mints are deterministic
 *     (id derives from type+from+to; `now` injected).
 *   - SAME-TICK multi-spread is a COMMUTATIVE field-merge (union of affected ids,
 *     MAX of severities) so apply order cannot change the result.
 */

import { contestOverThirdParty } from '../region/contestOverThirdParty.js';
import { mintDirectedChannel, stablePart } from '../region/graph.js';
import { clamp01 } from '../region/contestMath.js';
import { isSubsystemActive } from './subsystemActivation.js';
import { normalizeStressor } from './stressors.js';
import { PANTHEON_TUNING } from './pantheon.js';
import { militaryCapacityScalar } from './militaryStrength.js';
import { ensureReligionState, attemptEntry, advanceShares, selectPatron, resolvePatronContest, patronSnapshot } from './religionState.js';
import { rulerLens, deityLegitimacyTarget, stepDeityLegitimacy } from './religionLegitimacy.js';
import { createPRNG } from '../../generators/prng.js';

// Regional-prevalence reinforcement: a deity grows stronger in C for each neighbour
// of C that already holds it as patron (geographic faith clustering), capped.
const PREVALENCE_PER_NEIGHBOUR = 0.06;
const PREVALENCE_MAX = 0.3;

const CHANNEL_TYPE = 'religious_authority';
// The relationship labels that carry a faith — a deity's influence travels with
// alliance, patronage, vassalage, and trade. (Occupation is carried by the
// war_front/military_protection channels enumerated below: "the occupier's faith
// arrives with its garrison" — the existing religiousConversionGate's 1.6× boost.)
const FAITH_CARRIER_RELATIONSHIPS = Object.freeze([
  'allied', 'ally', 'trade_partner', 'patron', 'vassal',
]);
// Channel types that already exist in the graph and along which a deity's
// influence can be projected directly (the occupation/garrison carrier).
const FAITH_CARRIER_CHANNELS = Object.freeze([
  'war_front', 'military_protection', 'political_authority',
]);
// A neighbour deity needs a minimally-real carrier strength to even contest.
const MIN_CARRIER = 0.15;
// Deity rank → base 0..1 strength (major god > minor god > cult). Sourced from the
// zero-import pantheon tuning leaf so the engine and the presentation layer read ONE
// constant; re-exported here for back-compat with the engine's public surface.
export const DEITY_RANK_STRENGTH = PANTHEON_TUNING.DEITY_RANK_STRENGTH;

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The embedded deity snapshot for a settlement id, or null (never customContent).
 * @param {any} snapshot
 * @param {any} id
 */
function deitySnapshotFor(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.settlement?.config?.primaryDeitySnapshot || null;
}

// ── Occupation → conversion coupling ─────────────────────────────────────────
// A conquered settlement tends to adopt its occupier's faith — "the creed follows
// the garrison." The pull scales with the SIZE of the occupying force (the
// occupier's military capacity) tempered by how firmly the occupation is held (a
// garrison still fighting resistance converts less), and is amplified when the
// occupier's deity is WARBOUND (warlike temperament — a martial creed spreads at
// the point of a spear). It is COUNTERED by an incumbent faith of opposed nature:
// FULL force lands against a warlike or adjacent (neutral-temperament) creed, but a
// peaceful or alignment-opposed (good↔evil) faith digs in and resists. The lift is
// bounded — it pushes the occupier's claim toward, never past, certainty.
const OCC_CONVERSION_GAIN = 0.5;        // max claim-lift fraction at full control, peaceful occupier deity
const WARBOUND_CONVERSION_MULT = 1.35;  // warlike occupier deity lifts the pull "a little further"
const OCC_CARRIER_FLOOR = 0.5;          // an occupation is itself a strong faith carrier (the garrison path)
// Temperament / alignment axes mapped onto a line so opposition = distance.
const TEMPER_POS = /** @type {Record<string, number>} */ (Object.freeze({ warlike: 1, neutral: 0.5, peaceful: 0 }));
const ALIGN_POS = /** @type {Record<string, number>} */ (Object.freeze({ evil: 0, neutral: 0.5, good: 1 }));

/**
 * The occupation faith-pull an occupier O exerts on the city C it holds.
 * { control, warbound } or null when O does not occupy C. `control` (0..1) scales
 * with O's military capacity (the occupying-force size) and how firmly the
 * occupation is established (1 − resistance); a present garrison always pulls some.
 * @param {any} snapshot @param {any} occupations @param {any} occupierId @param {any} convertId
 * @returns {{ control: number, warbound: boolean } | null}
 */
function occupationFaithPull(snapshot, occupations, occupierId, convertId) {
  const rec = occupations?.[String(convertId)];
  if (!rec || String(rec.occupierId) !== String(occupierId)) return null;
  const occItem = snapshot?.byId?.get?.(String(occupierId));
  const force = clamp01(militaryCapacityScalar(occItem || {}));            // size of occupying forces
  const established = clamp01(1 - (Number(rec.resistance) || 0));          // garrison in control vs still fighting
  const control = clamp01(force * (0.4 + 0.6 * established));
  const deity = deitySnapshotFor(snapshot, occupierId);
  const warbound = String(deity?.temperamentAxis || '') === 'warlike';
  return { control, warbound };
}

/**
 * The counter-force (0..1) an INCUMBENT faith mounts against an occupier's creed —
 * 0 = no resistance (full conversion force), 1 = fully countered. Zero when the two
 * creeds are kindred (warlike occupier vs a warlike/adjacent incumbent — "full force
 * against a warlike or adjacent deity"); rises with temperament opposition (a
 * peaceful incumbent) and alignment opposition (good↔evil).
 * @param {any} occDeity @param {any} incDeity
 * @returns {number}
 */
function incumbentCounterForce(occDeity, incDeity) {
  if (!incDeity) return 0;                                                  // no entrenched faith → no resistance
  const tGap = Math.abs((TEMPER_POS[occDeity?.temperamentAxis] ?? 0.5) - (TEMPER_POS[incDeity?.temperamentAxis] ?? 0.5)); // 0..1
  const aGap = Math.abs((ALIGN_POS[occDeity?.alignmentAxis] ?? 0.5) - (ALIGN_POS[incDeity?.alignmentAxis] ?? 0.5));       // 0..1
  // Adjacent temperament (gap ≤ 0.5) mounts NO temperament resistance; an opposed
  // temperament (warlike↔peaceful, gap = 1) does. Opposed alignment resists too.
  const tempResist = Math.max(0, tGap - 0.5) * 2;                           // 0 at gap ≤ 0.5, 1 at gap = 1
  return clamp01(0.6 * tempResist + 0.6 * aGap);                            // either opposition alone can substantially counter
}

/**
 * 0..1 base strength for a deity snapshot from its rank (major>minor>cult).
 * @param {any} deity
 * @returns {number}
 */
function deityRankStrength(deity) {
  if (!deity) return 0;
  return /** @type {Record<string, number>} */ (DEITY_RANK_STRENGTH)[deity.rankAxis] ?? DEITY_RANK_STRENGTH.minor;
}

/**
 * A settlement's religious_authority causal score in 0..1 (0..100 → 0..1).
 * @param {any} snapshot
 * @param {any} id
 * @returns {number}
 */
function religiousAuthority01(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  const score = item?.causal?.scores?.religious_authority;
  return clamp01((Number.isFinite(score) ? score : 50) / 100);
}

/**
 * A settlement's orthodoxy in 0..1 — how strongly it holds its current faith.
 * @param {any} snapshot
 * @param {any} id
 * @returns {number}
 */
function orthodoxy01(snapshot, id) {
  // Orthodoxy IS the religious_authority of the convert: a strong orthodoxy
  // resists conversion. A settlement with no deity has a thinner orthodoxy.
  const authority = religiousAuthority01(snapshot, id);
  const hasDeity = Boolean(deitySnapshotFor(snapshot, id));
  return clamp01(authority * (hasDeity ? 1 : 0.7));
}

/**
 * Codepoint-sorted ids of every settlement that has an embedded deity.
 * @param {any} snapshot
 * @returns {string[]}
 */
function deityBearers(snapshot) {
  return (snapshot?.settlements || [])
    .filter((/** @type {any} */ item) => Boolean(item?.settlement?.config?.primaryDeitySnapshot))
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);
}

/**
 * The faith-carrier neighbours OUT of a deity-bearing settlement S: every other
 * settlement reachable from S along a faith-carrier relationship edge or a
 * faith-carrier channel. Returns a codepoint-sorted array of
 * `{ to, strength }` — the strongest carrier strength per neighbour.
 * @param {any} snapshot
 * @param {any} fromId
 * @returns {Array<{ to: string, strength: number }>}
 */
function faithCarriersOut(snapshot, fromId) {
  const id = String(fromId);
  const byTo = new Map();
  const note = (/** @type {any} */ to, /** @type {number} */ strength) => {
    const t = String(to);
    if (!t || t === id) return;
    const prev = byTo.get(t) ?? 0;
    if (strength > prev) byTo.set(t, strength);
  };

  // Faith-carrier RELATIONSHIP edges (allied/trade/patron/vassal). An edge is
  // one-per-pair; faith travels along it in BOTH directions, so we read it from
  // either orientation.
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const type = String(edge?.relationshipType || edge?.type || '');
    if (!FAITH_CARRIER_RELATIONSHIPS.includes(type)) continue;
    const a = String(edge?.from ?? '');
    const b = String(edge?.to ?? '');
    if (a === id) note(b, 0.45);
    else if (b === id) note(a, 0.45);
  }

  // Faith-carrier CHANNELS directed OUT of S (war_front/military_protection/
  // political_authority — the occupier/garrison carrier). Confirmed only.
  for (const channel of snapshot?.regionalGraph?.channels || snapshot?.channels || []) {
    if (String(channel?.from) !== id) continue;
    if (!FAITH_CARRIER_CHANNELS.includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    note(channel.to, clamp01(channel.strength ?? channel.severity ?? 0.5));
  }

  return [...byTo.entries()]
    .map(([to, strength]) => ({ to, strength }))
    .sort((x, y) => codepoint(x.to, y.to));
}

/**
 * A probability-1 CONVERSION outcome. It is a STRESSOR outcome that SEEDS the
 * EXISTING `religious_conversion_fracture` stressor on the convert C (so the
 * conversion SPREADS along religious_authority via the stressor's own
 * spreadChannels — we drive that stressor, never a parallel one). The stable id
 * (`world_stressor.religious_conversion_fracture.<C>`) means the crisis is born
 * ONCE per convert and a re-fire merges (the apply-side commutative merge). The
 * outcome ALSO carries `deityReembed` so the apply pass re-embeds the winning
 * neighbour's snapshot onto C's config.primaryDeitySnapshot.
 * @param {{ id: any, targetSaveId: any, severity: any, headline: any, summary: any, reasons: any, tick: any, sourceEventTargetId: any, deityReembed: any, cause?: string }} args
 */
function conversionOutcome({ id, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, deityReembed, cause = 'contest' }) {
  const stressor = normalizeStressor({
    type: 'religious_conversion_fracture',
    originSettlementId: targetSaveId,
    severity,
    affectedSettlementIds: [targetSaveId],
  });
  return {
    id,
    type: 'stressor',
    candidateType: 'stressor_birth_religious_conversion_fracture',
    ruleId: 'religious_contest_conversion',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      conversionCause: cause,
    },
    // The embed bridge: the apply pass re-embeds this winning-neighbour snapshot
    // onto the convert's config.primaryDeitySnapshot (copied from the neighbour's
    // EXISTING embedded snapshot, never customContent).
    deityReembed,
    // A conversion condition for the dossier/news surfaces.
    condition: {
      archetype: 'religious_conversion_fracture',
      severity,
      triggeredAt: { tick, sourceEventType: 'RELIGIOUS_CONVERSION', sourceEventTargetId },
      causes: [{ source: sourceEventTargetId, effect: 'religious_conversion_fracture', reason: `${sourceEventTargetId} converted ${targetSaveId}.` }],
    },
    conflictTags: [`stressor:religious_conversion_fracture:${targetSaveId}`, `settlement:${targetSaveId}:stressor_birth`],
  };
}

/**
 * Evaluate the religion layer for one tick.
 *
 * @param {Object} args
 * @param {any} args.snapshot   the SINGLE pre-tick world snapshot
 * @param {any} [args.worldState]
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} [args.tick]
 * @param {string|null} [args.now]
 * @param {{ religionDynamicsEnabled?: boolean }} args.rules
 * @returns {{ outcomes: any[], graphChannels: any[] }}
 */
export function evaluateReligiousContest({ snapshot, worldState = null, rng, tick = 0, now = null, rules = {} }) {
  // ── DOUBLE GATE: byte-identical no-op unless BOTH the opt-in flag AND the
  //    activation gate hold. Either false ⇒ empties (no mint, no contest). ─────
  if (!rules?.religionDynamicsEnabled) return { outcomes: [], graphChannels: [] };
  if (!isSubsystemActive(snapshot, 'religion')) return { outcomes: [], graphChannels: [] };

  // Occupation faith-pull reads the pre-tick occupations ledger (war layer). Absent
  // on a war-off / unconquered campaign ⇒ the coupling is a pure no-op.
  const occupations = worldState?.occupations && typeof worldState.occupations === 'object'
    ? worldState.occupations
    : null;

  const outcomes = [];
  const graphChannels = [];

  const nameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };

  // ── 1. MINT religious_authority channels (deity-gated, directed): for each
  //    settlement that HAS an embedded deity, mint a religious_authority channel
  //    along its faith-carrier edges so the deity's influence has a graph path.
  //    Codepoint-sorted bearers and targets ⇒ deterministic id stream. ─────────
  const bearers = deityBearers(snapshot);
  for (const fromId of bearers) {
    const deity = deitySnapshotFor(snapshot, fromId);
    const rankStrength = deityRankStrength(deity);
    for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
      if (strength < MIN_CARRIER) continue;
      // The minted channel's strength blends the carrier strength with the
      // deity's rank — a major god projects a stronger faith path than a cult.
      const mintStrength = clamp01(0.35 + strength * 0.4 + rankStrength * 0.25);
      graphChannels.push(mintDirectedChannel({
        type: CHANNEL_TYPE,
        from: fromId,
        to,
        strength: mintStrength,
        confidence: 0.75,
        explanation: `${deity?.name || nameFor(fromId)} projects religious authority from ${nameFor(fromId)} to ${nameFor(to)}.`,
        relationshipKey: `${CHANNEL_TYPE}.${stablePart(fromId)}.${stablePart(to)}`,
        source: 'religious_authority_mint',
        now,
      }));
    }
  }

  // ── 2. DEITY CONTEST over each convert C reachable by ≥2 competing deities. A
  //    competing deity reaches C along a faith-carrier path FROM the deity's home.
  //    We invert the bearer→neighbour map into convert→{contenders} from the SAME
  //    pre-tick carriers (so this tick's fresh mints never re-feed the contest). ─
  // contendersByConvert: convertId → Map(deityHomeId → carrierStrength)
  const contendersByConvert = new Map();
  for (const fromId of bearers) {
    for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
      if (strength < MIN_CARRIER) continue;
      if (!contendersByConvert.has(to)) contendersByConvert.set(to, new Map());
      const m = contendersByConvert.get(to);
      m.set(fromId, Math.max(m.get(fromId) ?? 0, strength));
    }
  }

  // Occupation injects the occupier as a faith contender over the city it holds —
  // the creed follows the garrison, even where no peacetime faith-carrier edge
  // exists. Codepoint-sorted ⇒ deterministic. The occupier must itself carry a deity.
  if (occupations) {
    for (const convertId of Object.keys(occupations).sort(codepoint)) {
      const occId = occupations[convertId]?.occupierId ? String(occupations[convertId].occupierId) : null;
      if (!occId || occId === convertId || !deitySnapshotFor(snapshot, occId)) continue;
      if (!contendersByConvert.has(convertId)) contendersByConvert.set(convertId, new Map());
      const m = contendersByConvert.get(convertId);
      m.set(occId, Math.max(m.get(occId) ?? 0, OCC_CARRIER_FLOOR));
    }
  }

  // Codepoint-sorted converts ⇒ deterministic contest order.
  const converts = [...contendersByConvert.keys()].map(String).sort(codepoint);
  for (const convertId of converts) {
    const carrierMap = contendersByConvert.get(convertId);
    // The neighbouring deity HOMES that reach C (codepoint-sorted). Exclude C
    // itself (a settlement never contests its own faith from outside).
    const neighbourHomes = [...carrierMap.keys()]
      .map(String)
      .filter(homeId => homeId !== convertId)
      .sort(codepoint);

    // The incumbent: C's currently-embedded deity HOME is C itself (its faith is
    // its own). The contest prize is C's faith slot; the incumbent contender is
    // C when C carries a deity (its orthodoxy defends the seat), else null (an
    // open contest — a deity-free settlement has no incumbent faith to defend).
    const cHasDeity = Boolean(deitySnapshotFor(snapshot, convertId));
    const incumbentId = cHasDeity ? convertId : null;

    // contenders = the distinct neighbouring deity homes + C's incumbent (when
    // C carries a deity). Need ≥2 real contenders for the primitive to run.
    const homeIds = cHasDeity
      ? [...new Set([convertId, ...neighbourHomes])].sort(codepoint)
      : neighbourHomes;
    if (homeIds.length < 2) continue;

    const cOrthodoxy = orthodoxy01(snapshot, convertId);
    const contenders = homeIds.map(homeId => {
      if (homeId === convertId) {
        // The incumbent's claim IS the convert's own orthodoxy (how strongly it
        // holds its faith) blended with its own deity's rank.
        const incDeity = deitySnapshotFor(snapshot, convertId);
        const scoreFor = clamp01(0.3 + cOrthodoxy * 0.4 + deityRankStrength(incDeity) * 0.3);
        return { id: homeId, scoreFor };
      }
      // A neighbour's claim: deity rank × carrier strength × the neighbour's own
      // religious_authority × (1 − C's orthodoxy) [a weak orthodoxy is more
      // convertible]. Blended as a product into a single 0..1 claim; the
      // PRIMITIVE takes the log-odds of this — never a raw product across
      // contenders.
      const deity = deitySnapshotFor(snapshot, homeId);
      const rank = deityRankStrength(deity);
      const carrier = clamp01(carrierMap.get(homeId) ?? 0);
      const neighbourAuthority = religiousAuthority01(snapshot, homeId);
      const convertibility = clamp01(1 - cOrthodoxy);
      let scoreFor = clamp01(rank * carrier * neighbourAuthority * (0.4 + 0.6 * convertibility));
      // Occupation faith-pull: an occupier of C lifts its claim toward (never past)
      // certainty — scaled by occupying-force size, amplified if warbound, COUNTERED
      // by an opposed incumbent faith (full force only against a warlike/adjacent creed).
      if (occupations) {
        const pull = occupationFaithPull(snapshot, occupations, homeId, convertId);
        if (pull && pull.control > 0) {
          const incDeity = deitySnapshotFor(snapshot, convertId);
          let lift = OCC_CONVERSION_GAIN * pull.control * (pull.warbound ? WARBOUND_CONVERSION_MULT : 1);
          lift = clamp01(lift * (1 - incumbentCounterForce(deity, incDeity)));
          scoreFor = clamp01(scoreFor + lift * (1 - scoreFor));
        }
      }
      return { id: homeId, scoreFor };
    });

    const prizeId = stablePart(convertId);
    const result = contestOverThirdParty({
      prizeId,
      channelType: CHANNEL_TYPE,
      contenders,
      incumbentId,
      rng,
      tick,
    });

    if (!result.changed) continue; // held — no conversion.
    const winnerHomeId = result.winnerId;
    if (!winnerHomeId || winnerHomeId === convertId) continue; // incumbent held.

    // ── CONVERSION: re-embed the WINNING NEIGHBOUR's existing embedded deity
    //    snapshot onto C's config.primaryDeitySnapshot. Read the neighbour's
    //    OWN snapshot — never customContent (the pulse never reads customContent).
    const winnerSnapshot = deitySnapshotFor(snapshot, winnerHomeId);
    if (!winnerSnapshot) continue; // a winner must carry a deity to convert C.

    // Attribute the conversion: occupation-driven if the winner is C's occupier.
    const winnerIsOccupier = Boolean(occupations && occupations[convertId]?.occupierId
      && String(occupations[convertId].occupierId) === String(winnerHomeId));

    outcomes.push(conversionOutcome({
      cause: winnerIsOccupier ? 'occupation' : 'contest',
      // Stable per-convert id ⇒ the crisis is born once; a same-tick re-fire to
      // the same convert merges (the apply-side commutative merge).
      id: `world_stressor.religious_conversion_fracture.${prizeId}`,
      targetSaveId: convertId,
      severity: clamp01(0.45 + (1 - cOrthodoxy) * 0.25),
      headline: `${nameFor(convertId)} converts to the faith of ${winnerSnapshot.name || nameFor(winnerHomeId)}`,
      summary: `${nameFor(winnerHomeId)}'s creed (${winnerSnapshot.name || 'a foreign faith'}) has displaced the old orthodoxy in ${nameFor(convertId)}.`,
      reasons: [
        `${winnerSnapshot.name || nameFor(winnerHomeId)} (${winnerSnapshot.rankAxis || 'minor'}) won the faith contest over ${nameFor(convertId)}.`,
        `${nameFor(convertId)}'s orthodoxy ${cOrthodoxy.toFixed(2)} could not hold its flock.`,
      ],
      tick,
      sourceEventTargetId: winnerHomeId,
      // Copy the WINNING NEIGHBOUR's EXISTING embedded snapshot (not customContent).
      deityReembed: { snapshot: winnerSnapshot, fromSettlementId: winnerHomeId },
    }));
  }

  return { outcomes, graphChannels };
}

// ─────────────────────────────────────────────────────────────────────────────
// GRADUAL PANTHEON DRIVER (religion rework — see docs/RELIGION_REWORK.md). Replaces
// the binary winner-take-all flip: each tick every settlement's per-deity adherent
// SHARES evolve toward their strengths (global rank + carrier reach + regional
// prevalence + receptivity), faiths ENTER as cults and climb, the patron is held with
// an erodable incumbency buffer, and a conversion outcome (re-embed) fires only when
// the CHIEF actually changes. Returns the evolved per-settlement religionStates for
// the kernel to persist as a CONDITIONAL worldState ledger (absent ⇒ byte-identical
// dormant), plus patron-change outcomes and the religious_authority mints.
// Deterministic — gradual movement needs no RNG.
// ─────────────────────────────────────────────────────────────────────────────

/** Neighbour ids of C across relationship edges + graph channels (codepoint-sorted). @param {any} snapshot @param {string} id */
function neighbourIdsOf(snapshot, id) {
  const set = new Set();
  for (const e of snapshot?.regionalGraph?.edges || []) {
    if (String(e?.from) === id) set.add(String(e.to));
    else if (String(e?.to) === id) set.add(String(e.from));
  }
  for (const c of snapshot?.regionalGraph?.channels || []) {
    if (String(c?.from) === id) set.add(String(c.to));
    else if (String(c?.to) === id) set.add(String(c.from));
  }
  set.delete(id);
  return [...set].sort(codepoint);
}

/** Capped prevalence bonus: neighbours whose embedded patron faith IS this deity. @param {any} snapshot @param {string[]} neighbourIds @param {string} deityRef */
function prevalenceBonus(snapshot, neighbourIds, deityRef) {
  let n = 0;
  for (const nid of neighbourIds) {
    const snap = deitySnapshotFor(snapshot, nid);
    if (snap && String(snap._deityRef || snap.name) === String(deityRef)) n++;
  }
  return Math.min(PREVALENCE_MAX, n * PREVALENCE_PER_NEIGHBOUR);
}

/**
 * A deity's 0..1 local strength in settlement C: global rank + carrier reach +
 * regional prevalence, modulated by receptivity (alignment/temperament fit with C's
 * current mood — its patron faith). Occupation force-pull is layered on by the caller.
 * @param {{ snapshot: any, deity: any, deityRef: string, neighbourIds: string[], carrier: number, moodDeity: any }} args
 */
function deityLocalStrength({ snapshot, deity, deityRef, neighbourIds, carrier, moodDeity }) {
  const base = clamp01(0.45 * deityRankStrength(deity) + 0.3 * clamp01(carrier) + prevalenceBonus(snapshot, neighbourIds, deityRef));
  const fit = moodDeity ? (1 - incumbentCounterForce(deity, moodDeity)) : 1;   // resist alien creeds, welcome kindred
  return clamp01(base * (0.7 + 0.3 * fit));
}

/**
 * @param {Object} args
 * @param {any} args.snapshot @param {any} [args.worldState]
 * @param {number} [args.tick] @param {string|null} [args.now] @param {any} args.rules
 * @returns {{ religionStates: Record<string, any>|null, outcomes: any[], graphChannels: any[] }}
 */
export function advanceReligionStates({ snapshot, worldState = null, tick = 0, now = null, rules = {} }) {
  if (!rules?.religionDynamicsEnabled) return { religionStates: null, outcomes: [], graphChannels: [] };
  if (!isSubsystemActive(snapshot, 'religion')) return { religionStates: null, outcomes: [], graphChannels: [] };

  /** @param {any} id */
  const nameFor = (id) => { const it = snapshot?.byId?.get?.(String(id)); return it?.name || it?.settlement?.name || String(id); };
  const occupations = worldState?.occupations && typeof worldState.occupations === 'object' ? worldState.occupations : null;
  const prior = worldState?.religionStates && typeof worldState.religionStates === 'object' ? worldState.religionStates : {};
  const outcomes = [];
  const graphChannels = [];
  /** @type {Record<string, any>} */
  const religionStates = {};
  const bearers = deityBearers(snapshot);

  // 1. Mint religious_authority channels along faith carriers (deity-gated, directed).
  for (const fromId of bearers) {
    const deity = deitySnapshotFor(snapshot, fromId);
    const rankStrength = deityRankStrength(deity);
    for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
      if (strength < MIN_CARRIER) continue;
      const mintStrength = clamp01(0.35 + strength * 0.4 + rankStrength * 0.25);
      graphChannels.push(mintDirectedChannel({
        type: CHANNEL_TYPE, from: fromId, to, strength: mintStrength, confidence: 0.75,
        explanation: `${deity?.name || nameFor(fromId)} projects religious authority from ${nameFor(fromId)} to ${nameFor(to)}.`,
        relationshipKey: `${CHANNEL_TYPE}.${stablePart(fromId)}.${stablePart(to)}`,
        source: 'religious_authority_mint', now,
      }));
    }
  }

  // 2. Carrier reach: convertId → Map(deityRef → { deity, carrier, occupied }).
  const reach = new Map();
  /** @param {any} to @param {any} deity @param {number} carrier @param {boolean} [occupied] */
  const note = (to, deity, carrier, occupied = false) => {
    const t = String(to); const dref = String(deity?._deityRef || deity?.name || '');
    if (!t || !dref) return;
    if (!reach.has(t)) reach.set(t, new Map());
    const m = reach.get(t); const prev = m.get(dref);
    m.set(dref, { deity, carrier: Math.max(prev?.carrier ?? 0, carrier), occupied: occupied || Boolean(prev?.occupied) });
  };
  for (const fromId of bearers) {
    const deity = deitySnapshotFor(snapshot, fromId);
    if (!deity) continue;
    for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
      if (strength >= MIN_CARRIER) note(to, deity, strength);
    }
  }
  if (occupations) {
    for (const cid of Object.keys(occupations).sort(codepoint)) {
      const occId = occupations[cid]?.occupierId ? String(occupations[cid].occupierId) : null;
      if (!occId || occId === cid) continue;
      const deity = deitySnapshotFor(snapshot, occId);
      if (deity) note(cid, deity, OCC_CARRIER_FLOOR, true);
    }
  }

  // 3. Evolve each settlement's pantheon (codepoint-sorted ⇒ deterministic).
  const ids = (snapshot?.settlements || []).map((/** @type {any} */ it) => String(it.id)).sort(codepoint);
  for (const cid of ids) {
    const settlement = snapshot?.byId?.get?.(cid)?.settlement;
    if (!settlement) continue;
    const reaching = reach.get(cid);
    const hasState = Boolean(prior[cid]?.deities && Object.keys(prior[cid].deities).length);
    // A settlement carries faith if it has an embedded patron OR any DM-imposed cult.
    const hasDeity = Boolean(deitySnapshotFor(snapshot, cid)) || ((settlement.config?.cultDeitySnapshots || []).length > 0);
    if (!hasDeity && !hasState && !reaching) continue;     // dormancy: untouched ⇒ no state

    const tier = settlement.tier || settlement.config?.tier || 'village';
    const state = ensureReligionState(prior[cid], settlement, tier);
    const prevPatron = state.patronRef;
    const neighbourIds = neighbourIdsOf(snapshot, cid);
    const moodDeity = patronSnapshot(state);

    // 3a. entries — faiths reaching C not yet present (or resurging from suppression).
    if (reaching) {
      for (const dref of [...reaching.keys()].sort(codepoint)) {
        const { deity, carrier, occupied } = reaching.get(dref);
        const cur = state.deities[dref];
        if (cur && !cur.suppressed) continue;
        let strength = deityLocalStrength({ snapshot, deity, deityRef: dref, neighbourIds, carrier, moodDeity });
        if (occupied) {
          const pull = occupationFaithPull(snapshot, occupations, String(occupations[cid].occupierId), cid);
          if (pull) {
            const lift = clamp01(OCC_CONVERSION_GAIN * pull.control * (pull.warbound ? WARBOUND_CONVERSION_MULT : 1) * (1 - incumbentCounterForce(deity, moodDeity)));
            strength = clamp01(strength + lift * (1 - strength));
          }
        }
        attemptEntry(state, deity, strength, { force: Boolean(occupied) });
      }
    }

    // 3b. advance shares for all present (active) deities toward their strengths.
    /** @type {Record<string, number>} */
    const strengthByRef = {};
    for (const dref of Object.keys(state.deities)) {
      if (state.deities[dref].suppressed) continue;
      const carrier = reaching?.get(dref)?.carrier ?? (dref === state.patronRef ? 0.5 : 0.25);   // home faith keeps innate footing
      strengthByRef[dref] = deityLocalStrength({ snapshot, deity: state.deities[dref].snapshot, deityRef: dref, neighbourIds, carrier, moodDeity });
    }
    advanceShares(state, strengthByRef);
    // Legitimacy: each active faith drifts (slowly) toward its rightful-claim target —
    // ruler endorsement + neighbour recognition + tenure + chronicle momentum, minus
    // the heresy stain and corruption rot. Distinct from share; it LAGS conversion.
    const lens = rulerLens(settlement);
    for (const dref of Object.keys(state.deities)) {
      const entry = state.deities[dref];
      if (entry.suppressed) continue;
      const target = deityLegitimacyTarget({ settlement, snapshot, worldState, cid, deity: entry.snapshot, deityRef: dref, neighbourIds, entry, lens, deitySnapshotFor });
      stepDeityLegitimacy(entry, target);
    }
    // Patron seat: a CONTESTED niche (a rival in the patron's own niche — e.g. an
    // imposed cult) is decided by a SEEDED, legitimacy-weighted top-three contest;
    // an uncontested pantheon uses the deterministic share-based flip. The PRNG is
    // forked per settlement+tick from the world seed ⇒ reproducible, never Math.random.
    const contestRng = createPRNG(`${worldState?.rngSeed || 'religion'}::religion-contest::${tick}::${cid}`);
    if (!resolvePatronContest(state, contestRng)) selectPatron(state);
    religionStates[cid] = state;

    // 3c. patron change → a gradual conversion outcome (re-embed the new patron).
    if (state.patronRef && state.patronRef !== prevPatron) {
      const newPatron = patronSnapshot(state);
      if (newPatron) outcomes.push(conversionOutcome({
        cause: occupations?.[cid]?.occupierId ? 'occupation' : 'contest',
        id: `world_stressor.religious_conversion_fracture.${stablePart(cid)}`,
        targetSaveId: cid,
        severity: 0.5,
        headline: `${nameFor(cid)} turns to the faith of ${newPatron.name || 'a new creed'}`,
        summary: `After a long contest of devotion, ${newPatron.name || 'a rising faith'} has become the patron creed of ${nameFor(cid)}.`,
        reasons: [`${newPatron.name || 'a rising faith'} overtook the former patron to become ${nameFor(cid)}'s patron creed.`],
        tick,
        sourceEventTargetId: cid,
        deityReembed: { snapshot: newPatron, fromSettlementId: cid },
      }));
    }
  }

  return { religionStates, outcomes, graphChannels };
}
