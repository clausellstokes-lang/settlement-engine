/**
 * warRulingsEvidence.js — WR-5's behavioral-fact composers.
 *
 * Writers and decision readers call these helpers only after an action happened.
 * They select governed kinds from explicit qualitative receipts and carry typed
 * identities forward; they do not render prose or discover names. The one
 * consequence helper below routes verdict withdrawal through the existing
 * deployment-recall writer before it allows a dissolution fact to speak.
 */

import { stampDeploymentRecall } from './warIntent.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function wholeTick(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

/**
 * Whose recorded interest actually points toward the offer that was made.
 *
 * ⚠ `'foreign'` JOINED THE VOCABULARY AT W-SEAT SEAT-2a, AND ITS ABSENCE HERE WAS
 * A WRONG POSITIVE, NOT A GAP. An unlisted interest failed the membership test and
 * returned `null`, which made the whole offer produce no evidence at all — but had
 * it merely fallen through the second test it would have been credited to `'realm'`,
 * publishing "the realm's position carried the decision" about a peace an occupier
 * carried. Both outcomes are wrong in different directions, which is exactly why
 * the fourth book is enumerated here rather than left to a default.
 */
function peaceInterestServed(read) {
  const row = asObject(read);
  const interest = String(row.booksInterest || '');
  const direction = String(row.booksDirection || '');
  if (!['realm', 'seat', 'patron', 'foreign'].includes(interest)) return null;
  // A private book pointing away from peace cannot be credited with the offer;
  // the realm terms overcame it. Realm/even books leave the realm as the honest
  // attributable interest rather than inventing a private motive.
  if (['seat', 'patron', 'foreign'].includes(interest) && direction === 'peace') return interest;
  return 'realm';
}

/** @param {Record<string,unknown>} read */
function hasRivalTriumph(read) {
  return ['present', 'pressing', 'decisive'].includes(String(read.rivalTriumphBand || ''));
}

/** @param {Record<string,unknown>} read */
function successorPeaceEarned(read, inheritedDemand) {
  return read.momentumBroken === true
    || (asObject(inheritedDemand).desiredAction === 'peace');
}

/**
 * Facts earned when the second court answers an approved bilateral offer. The
 * offer itself is real on either arm; ending/rival/successor facts require two
 * yeses. Refusal costs and target-side continued-war facts are composed by the
 * refusal writer because only it knows which prices actually landed.
 *
 * @param {{outcome?:unknown,decision?:unknown,tick?:unknown}} args
 * @returns {Array<Record<string,unknown>>}
 */
export function peaceDecisionRulingEvidence({ outcome = null, decision = null, tick = null } = {}) {
  const offer = asObject(outcome);
  const resolved = asObject(decision);
  const offerId = String(offer.id || '');
  const offererId = String(resolved.offererId || '');
  const targetId = String(resolved.targetId || '');
  const atTick = wholeTick(tick ?? asObject(resolved.receipt).tick);
  const offererRead = asObject(resolved.offererRead);
  if (!offerId || !offererId || !targetId || offererId === targetId) return [];
  const interestServed = peaceInterestServed(offererRead);
  if (!interestServed) return [];

  const offerBase = {
    ...offererRead,
    id: `${offerId}:offer`,
    tick: atTick,
    settlementId: offererId,
    counterpartId: targetId,
    offererId,
    targetId,
    interestServed,
  };
  /** @type {Array<Record<string,unknown>>} */
  const evidence = [];
  // ⛔ THE FOREIGN BOOK ABSTAINS FROM BOTH SUING KINDS, AND THE ABSTENTION IS A
  // RULING RATHER THAN A FALL-THROUGH. Neither existing sentence is true of an
  // occupier-carried peace: `sued_for_peace_realm` says the realm's own position
  // decided, and `sued_for_peace_seat` requires an `npc` identity that resolves to
  // the LOCAL ruler and reads "on the settlement's behalf" — it would name the
  // wrong person for the right event. A reader-facing kind for a foreign-carried
  // decision is chartered in the volume's D8 bill (five kinds, minted together,
  // paying the full V6-B3 authoring/pool/herald census); minting one alone here
  // would pay that whole bill for a fifth of the benefit. Until it lands the fact
  // is receipted where the estate's primary receipt lives — `booksInterest`,
  // `foreignSeatId`, `foreignSeatBand` and `booksReason` on the termination read.
  // DELIBERATELY DEFERRED, DOCUMENTED, NOT A BUG TO RE-FIND.
  if (interestServed !== 'foreign') {
    evidence.push({
      ...offerBase,
      kind: interestServed === 'realm' ? 'sued_for_peace_realm' : 'sued_for_peace_seat',
    });
  }
  if (interestServed === 'patron') {
    evidence.push({ ...offerBase, kind: 'ruler_books_compromised' });
  }
  if (resolved.accepted !== true) return evidence;

  if (hasRivalTriumph(offererRead)) {
    evidence.push({ ...offerBase, id: offerId, kind: 'war_ended_against_rival_triumph' });
  }
  if (successorPeaceEarned(offererRead, asObject(offer.metadata).inheritedWarDemand)) {
    evidence.push({ ...offerBase, id: `${offerId}:offerer`, kind: 'successor_repudiates_war' });
  }

  const targetRead = asObject(asObject(resolved.termination).receipt);
  const targetDecision = asObject(resolved.receipt);
  // Acceptance is bilateral, so the target court can earn the same public
  // political ending as the offerer. Require the target's own accepted seat
  // interest as well as its own rival-triumph receipt: a covert patron decision
  // must never be promoted into a public explanation of why the war ended.
  if (targetDecision.interestServed === 'seat' && hasRivalTriumph(targetRead)) {
    evidence.push({
      ...targetRead,
      ...targetDecision,
      id: `${offerId}:target`,
      kind: 'war_ended_against_rival_triumph',
      tick: atTick,
      settlementId: targetId,
      counterpartId: offererId,
      offererId,
      targetId,
    });
  }
  if (successorPeaceEarned(targetRead, resolved.inheritedDemand)) {
    evidence.push({
      ...targetRead,
      ...targetDecision,
      id: `${offerId}:target`,
      kind: 'successor_repudiates_war',
      tick: atTick,
      settlementId: targetId,
      counterpartId: offererId,
    });
  }
  if (targetDecision.interestServed === 'patron') {
    evidence.push({
      ...targetRead,
      ...targetDecision,
      id: `${offerId}:target`,
      kind: 'ruler_books_compromised',
      tick: atTick,
      settlementId: targetId,
      counterpartId: offererId,
    });
  }
  return evidence;
}

/**
 * Facts earned by an applied faction installation carrying a typed war demand.
 * No demand means no overturning story; no named successor/faction later makes
 * the governed projector fail closed rather than fabricating a cast.
 *
 * @param {{transition?:unknown,outcome?:unknown}} args
 * @returns {Array<Record<string,unknown>>}
 */
export function governmentTransitionRulingEvidence({ transition = null, outcome = null } = {}) {
  const row = asObject(transition);
  const demand = asObject(row.warDemand);
  const desiredAction = String(demand.desiredAction || '');
  const settlementId = String(demand.actorId || asObject(outcome).targetSaveId || '');
  const counterpartId = String(demand.targetId || '');
  const id = String(row.id || asObject(outcome).id || '');
  if (!id || !settlementId || !counterpartId || !['peace', 'continue'].includes(desiredAction)) return [];
  const base = {
    ...row,
    id,
    tick: wholeTick(row.tick),
    settlementId,
    counterpartId,
    npcId: row.toRulerId,
    factionId: row.installerFactionId,
  };
  return [
    { ...base, kind: 'succession_demand_inherited' },
    {
      ...base,
      kind: desiredAction === 'peace'
        ? 'peace_party_overturns_warmonger'
        : 'war_party_overturns_peacemaker',
    },
  ];
}

/**
 * A post-authority termination read can close the exact corruption quarrel
 * without a separate verdict ledger. Both the momentum break and the dissolved
 * typed cause are required, so ordinary cause decay cannot masquerade as D's
 * cross-system chain.
 *
 * @param {unknown} receipt
 * @returns {Array<Record<string,unknown>>}
 */
export function verdictDissolutionRulingEvidence(receipt) {
  const row = asObject(receipt);
  const dissolved = Array.isArray(row.dissolvedCauseTypes) ? row.dissolvedCauseTypes.map(String) : [];
  if (row.momentumBroken !== true
    || row.authorityChangeKind !== 'corruption_verdict'
    || !String(row.authorityVerdictId || '')
    || row.causeState !== 'dissolved'
    || !dissolved.includes('corruption_exposed')) return [];
  return [{
    ...row,
    kind: 'war_dissolved_by_verdict',
    id: String(row.id || ''),
    tick: wholeTick(row.tick),
    settlementId: String(row.attackerId || ''),
    counterpartId: String(row.targetId || ''),
  }];
}

/**
 * Make the verdict composition real: a successor who no longer owns the
 * founding corruption quarrel recalls that court's live front through the
 * canonical deployment writer. Evidence is returned only when this call
 * actually stamps the withdrawal; an already-recalled or missing front cannot
 * emit a fresh claim that the verdict dissolved it.
 *
 * @param {{worldState?:Record<string,unknown>|null,receipts?:unknown[],tick?:unknown}} args
 * @returns {{worldState:Record<string,unknown>,evidence:Array<Record<string,unknown>>}}
 */
export function applyVerdictWarDissolutions({ worldState = null, receipts = [], tick = null } = {}) {
  let state = asObject(worldState);
  /** @type {Array<Record<string,unknown>>} */
  const evidence = [];
  for (const raw of Array.isArray(receipts) ? receipts : []) {
    const facts = verdictDissolutionRulingEvidence(raw);
    if (!facts.length) continue;
    const receipt = asObject(raw);
    const before = state;
    state = stampDeploymentRecall(
      state,
      String(receipt.attackerId || ''),
      String(receipt.targetId || ''),
      'authority_verdict',
      wholeTick(tick ?? receipt.tick),
    );
    if (state !== before) evidence.push(...facts);
  }
  return { worldState: state, evidence };
}
