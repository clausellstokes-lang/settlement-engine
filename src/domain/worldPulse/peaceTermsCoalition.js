/**
 * domain/worldPulse/peaceTermsCoalition.js — §7 THE TABLE WITH MORE THAN TWO
 * CHAIRS.
 *
 * Who was actually besieging whom when this edge closed, which acceptance-time
 * witness may price an exit, when a set of tagged closures is really one
 * CONGRESS (and not a lone peace wearing a congress's name), the typed public
 * fact one closed coalition edge emits, how an abandoned ally's own authored
 * war-seat books price the betrayal, and the deterministic §H-loaded peel read.
 * Every function here is a READ or a plan; the writes live in peaceTermsOverlay.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { stablePart } from './stablePart.js';
import { thresholdFactorOf } from './dispositionProfile.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { coalitionLedgerActive } from './warCoalitionExpenditure.js';
import { coalitionClosureWitness, normalizeJoinAnchor } from './warCoalitionLedger.js';
import { planCoalitionSettlement } from './warCoalitionSettlement.js';
import { PEACE_TERMS_TUNING, COALITION_BETRAYAL_CHARACTER_TUNING } from './peaceTermsCatalog.js';
import { recordOf, explicitText, round4 } from './peaceTermsPrimitives.js';

/**
 * Resolve the anchored coalition around one closing bilateral edge. A joined
 * party can be the departing side, or a root caller can close its own edge while
 * joined members remain. Recalled rows still count here: they are the exact
 * just-approved exit fact and the war layer removes them on its next pass.
 * Unrelated same-target deployments never enter this read.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} aId @param {string} bId @param {unknown} tick
 * @returns {null|{departingId:string,enemyId:string,callerId:string,
 *   abandoned:string[],members:string[]}}
 */
export function coalitionPeaceContext(worldState, aId, bId, tick) {
  return coalitionClosureWitness(worldState, aId, bId, tick);
}

/** Validate the acceptance-time coalition witness before it can price an exit. */
export function persistedCoalitionPeaceContext(raw, aId, bId) {
  const row = recordOf(raw);
  const departingId = explicitText(row.departingId);
  const enemyId = explicitText(row.enemyId);
  const callerId = explicitText(row.callerId);
  const pair = new Set([String(aId), String(bId)]);
  if (!departingId || !enemyId || !callerId || departingId === enemyId
    || !pair.has(departingId) || !pair.has(enemyId) || pair.size !== 2) return null;
  const abandoned = [...new Set((Array.isArray(row.abandoned) ? row.abandoned : [])
    .map(explicitText).filter((id) => id && id !== departingId && id !== enemyId))].sort();
  if (!abandoned.length) return null;
  let joinAnchor = null;
  if (departingId !== callerId) {
    const rawAnchor = recordOf(row.joinAnchor);
    joinAnchor = normalizeJoinAnchor(
      rawAnchor,
      departingId,
      enemyId,
      rawAnchor.joinedTick,
    );
    if (!joinAnchor || joinAnchor.callerId !== callerId) return null;
  } else if (callerId === enemyId) return null;
  const expenditurePressure = Number(row.expenditurePressure01);
  let reimbursementClaims = null;
  if (Object.prototype.hasOwnProperty.call(row, 'reimbursementClaims')) {
    if (!Array.isArray(row.reimbursementClaims)) return null;
    const expectedMembers = (departingId === callerId ? abandoned : [departingId]).slice().sort();
    const seen = new Set();
    reimbursementClaims = [];
    for (const rawClaim of row.reimbursementClaims) {
      const claimRow = recordOf(rawClaim);
      const memberId = explicitText(claimRow.memberId);
      const pressure01 = Number(claimRow.pressure01);
      const rawAnchor = recordOf(claimRow.joinAnchor);
      const claimAnchor = normalizeJoinAnchor(
        rawAnchor,
        memberId,
        enemyId,
        rawAnchor.joinedTick,
      );
      if (!memberId || memberId === callerId || memberId === enemyId
        || !expectedMembers.includes(memberId) || seen.has(memberId)
        || !Number.isFinite(pressure01) || pressure01 < 0 || pressure01 > 1
        || !claimAnchor || claimAnchor.callerId !== callerId) return null;
      seen.add(memberId);
      reimbursementClaims.push({
        memberId,
        pressure01: clamp01(pressure01),
        joinAnchor: claimAnchor,
      });
    }
    reimbursementClaims.sort((left, right) => left.memberId < right.memberId ? -1 : left.memberId > right.memberId ? 1 : 0);
    if (reimbursementClaims.map((claim) => claim.memberId).join('\u0000')
      !== expectedMembers.join('\u0000')) return null;
  }
  return {
    departingId,
    enemyId,
    callerId,
    abandoned,
    members: [departingId, ...abandoned].sort(),
    ...(joinAnchor ? { joinAnchor } : {}),
    ...(Number.isFinite(expenditurePressure)
      ? { expenditurePressure01: clamp01(expenditurePressure) }
      : {}),
    ...(reimbursementClaims ? { reimbursementClaims } : {}),
  };
}

/** One congress exists only when every row declares the same complete census. */
export function explicitCongressPlan(rawClosures, tick) {
  const rows = Array.isArray(rawClosures) ? rawClosures.map(recordOf) : [];
  if (rows.length < 2) return null;
  const settlementId = explicitText(rows[0].coalitionSettlementId);
  const claim = Number(rows[0].aggregateClaim01);
  if (!settlementId || !Number.isFinite(claim) || claim <= 0 || claim > 1
    || rows.some((row) => explicitText(row.coalitionSettlementId) !== settlementId
      || Number(row.aggregateClaim01) !== claim)) return null;
  const declared = [...new Set((Array.isArray(rows[0].componentClosureIds)
    ? rows[0].componentClosureIds : []).map(explicitText).filter(Boolean))].sort();
  if (declared.length < 2 || rows.some((row) => {
    const census = [...new Set((Array.isArray(row.componentClosureIds)
      ? row.componentClosureIds : []).map(explicitText).filter(Boolean))].sort();
    return census.join('\u0000') !== declared.join('\u0000');
  })) return null;
  const actual = rows.map((row) => explicitText(row.closureId)).sort();
  if (actual.some((id) => !id)
    || new Set(actual).size !== actual.length
    || actual.join('\u0000') !== declared.join('\u0000')) return null;
  const parties = new Set(rows.flatMap((row) => [
    explicitText(row.winnerId), explicitText(row.loserId),
  ]).filter(Boolean));
  if (parties.size < 3) return null;
  const plan = planCoalitionSettlement({
    coalitionSettlementId: settlementId,
    closures: rows,
    aggregateClaim01: claim,
    tick,
  });
  return plan ? { plan, closures: rows } : null;
}

/** One stable typed fact for one actually closed coalition edge. */
export function coalitionSeparatePeaceEvidence(context, tick, outcomeId = '') {
  const row = recordOf(context);
  const departingId = explicitText(row.departingId);
  const enemyId = explicitText(row.enemyId);
  const callerId = explicitText(row.callerId);
  const abandoned = Array.isArray(row.abandoned) ? row.abandoned.map(String).sort() : [];
  const at = Number.isFinite(Number(tick)) ? Math.max(0, Math.floor(Number(tick))) : 0;
  const source = explicitText(outcomeId)
    || `${stablePart(departingId)}.${stablePart(enemyId)}.${at}`;
  const joinAnchor = recordOf(row.joinAnchor);
  return {
    id: `coalition-separate-peace.${stablePart(source)}.${stablePart(departingId)}.${stablePart(enemyId)}`,
    kind: 'coalition_separate_peace',
    tick: at,
    settlementId: departingId,
    counterpartId: departingId !== callerId ? callerId : (abandoned[0] || callerId),
    thirdPartyId: enemyId,
    callerId,
    targetId: enemyId,
    abandonedIds: abandoned,
    ...(Number.isInteger(Number(joinAnchor.joinedTick))
      ? { joinedTick: Number(joinAnchor.joinedTick) }
      : {}),
  };
}

/**
 * Read how one abandoned ally prices a coalition betrayal through that ally's
 * own authored war-seat books and, when WR-2 is lit, learned disposition.
 * Partial WR-6 activation is deliberately neutral.
 *
 * @param {{worldState?:Record<string,unknown>|null,
 *   snapshot?:Record<string,unknown>|null,allyId?:unknown,deserterId?:unknown}} [input]
 * @returns {{multiplier:number,interpretation:'grievance'|'prudence'|'balanced'}}
 */
export function coalitionBetrayalCharacterRead({
  worldState = null,
  snapshot = null,
  allyId = '',
  deserterId = '',
} = {}) {
  const neutral = { multiplier: 1, interpretation: 'balanced' };
  if (!coalitionLedgerActive(worldState)) return neutral;
  const ally = explicitText(allyId);
  const deserter = explicitText(deserterId);
  if (!ally || !deserter || ally === deserter) return neutral;
  const learnedActive = worldState?.simulationRules?.dispositionChannelsEnabled === true;
  let learned = 1;
  if (learnedActive) {
    const entry = recordOf(recordOf(worldState.dispositionStats)[ally]);
    const martial = thresholdFactorOf(entry, 'martial').factor;
    const diplomatic = thresholdFactorOf(entry, 'diplomatic').factor;
    const insular = thresholdFactorOf(entry, 'insular').factor;
    learned = ((2 - martial) + diplomatic + insular) / 3;
  }
  // High martial confidence hardens the broken expectation. Diplomatic and
  // inward-looking histories retain their published direction and make room
  // for prudence. This is the same bounded learned-character grammar already
  // used by the WR-6 refusal aftermath, now read by the abandoned court itself.
  const books = readWarSeatBooks({ worldState, snapshot, actorId: ally, opponentId: deserter });
  const continueBias01 = clamp01(Number(books.continueBias01));
  const authored = 0.8 + continueBias01 * 0.4;
  const T = COALITION_BETRAYAL_CHARACTER_TUNING;
  const multiplier = round4(Math.max(T.MIN_MULTIPLIER, Math.min(
    T.MAX_MULTIPLIER,
    learnedActive ? (learned + authored) / 2 : authored,
  )));
  return {
    multiplier,
    interpretation: multiplier >= T.GRIEVANCE_MIN
      ? 'grievance'
      : multiplier <= T.PRUDENCE_MAX ? 'prudence' : 'balanced',
  };
}

/**
 * The victor's co-besieger coalition against this loser: OTHER attackers whose
 * live deployment targets the same loser (the exact primitive the coalition_
 * fracture peace reason reads — reused so the two features stay consistent).
 * Codepoint-ordered; excludes the victor itself.
 * @param {Record<string, { targetId?: unknown }> | null | undefined} deployments
 * @param {string} victorId @param {string} loserId @returns {string[]}
 */
export function coBesiegersOf(deployments, victorId, loserId) {
  if (!deployments || typeof deployments !== 'object') return [];
  /** @type {string[]} */
  const out = [];
  for (const attackerId of Object.keys(deployments).sort()) {
    if (attackerId === victorId) continue;
    if (String(deployments[attackerId]?.targetId || '') === String(loserId)) out.push(attackerId);
  }
  return out;
}

/**
 * The §H-LOADED coalition-mode read (DETERMINISTIC — the module's no-rng law):
 * a member takes a SEPARATE EXIT when its peel-propensity clears the threshold.
 * Propensity is loaded by the member's own war-exhaustion (a worn court buys the
 * quick separate peace) and the WEAKNESS of its ties to the coalition (weak ties
 * desert; strong ties hold the line). No coalition (no co-besiegers) ⇒ never a
 * peel — the plain per-pair peace. Pure.
 * @param {{ victorExhaustion01: number, avgTie01: number, coalitionSize: number }} args
 * @returns {{ mode: 'joint' | 'separate_exit', peelPropensity: number }}
 */
export function chooseCoalitionMode({ victorExhaustion01, avgTie01, coalitionSize }) {
  if (!(Number(coalitionSize) > 1)) return { mode: 'joint', peelPropensity: 0 };
  const peelPropensity = round4(clamp01(
    PEACE_TERMS_TUNING.PEEL_EXHAUSTION_W * clamp01(Number(victorExhaustion01) || 0)
    + PEACE_TERMS_TUNING.PEEL_TIE_W * (1 - clamp01(Number(avgTie01) || 0)),
  ));
  return { mode: peelPropensity >= PEACE_TERMS_TUNING.PEEL_THRESHOLD ? 'separate_exit' : 'joint', peelPropensity };
}

/** Committed-strength shares for a coalition, pro-rata to each member's strength
 *  (§7: reparations split by contribution). Codepoint-keyed, sums to ~1.
 *  @param {string[]} members @param {(id: string) => number} truthFor @returns {Record<string, number>} */
export function coalitionShares(members, truthFor) {
  const weights = members.map((id) => Math.max(0, Number(truthFor(id)) || 0));
  const total = weights.reduce((s, w) => s + w, 0);
  /** @type {Record<string, number>} */
  const shares = {};
  for (let i = 0; i < members.length; i++) {
    shares[members[i]] = total > 0 ? round4(weights[i] / total) : round4(1 / members.length);
  }
  return shares;
}
