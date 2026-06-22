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
// Deity rank → base 0..1 strength (major god > minor god > cult).
const DEITY_RANK_STRENGTH = Object.freeze({ major: 0.95, minor: 0.6, cult: 0.35 });

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
 * @param {{ id: any, targetSaveId: any, severity: any, headline: any, summary: any, reasons: any, tick: any, sourceEventTargetId: any, deityReembed: any }} args
 */
function conversionOutcome({ id, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, deityReembed }) {
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
  void worldState;
  // ── DOUBLE GATE: byte-identical no-op unless BOTH the opt-in flag AND the
  //    activation gate hold. Either false ⇒ empties (no mint, no contest). ─────
  if (!rules?.religionDynamicsEnabled) return { outcomes: [], graphChannels: [] };
  if (!isSubsystemActive(snapshot, 'religion')) return { outcomes: [], graphChannels: [] };

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
      const scoreFor = clamp01(rank * carrier * neighbourAuthority * (0.4 + 0.6 * convertibility));
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

    outcomes.push(conversionOutcome({
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
