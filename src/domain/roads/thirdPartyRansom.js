/**
 * roads/thirdPartyRansom.js — DEEP COUPLINGS D-5 THE THIRD-PARTY RANSOM (owner commission;
 * DESIGN_DEEP_COUPLINGS.md §9 is binding law). A third party — a friend, an ally-creditor, or
 * a predatory rival — buys a hostage's freedom mid-term. The captive may REFUSE a coin that is
 * not his own home's; a rival's coin binds by a covert leash, a friend's by gratitude.
 *
 * DARK behind the VIRTUAL flag `thirdPartyRansomEnabled` (§1 law 1; ABSENT from
 * DEFAULT_SIMULATION_RULES — read `=== true` defensively). Flag absent ⇒ the roads mover never
 * calls in here ⇒ byte-identical (thirdPartyRansomDormancy proves it). Requires roadsEnabled;
 * the DEBT outcome additionally needs constructiveFlowsEnabled (generosity consumes the deposit),
 * the COMPROMISED outcome corruptionWebEnabled (the web consumes the channel) — web/generosity
 * dark ⇒ the outcome degrades to DEBT / a no-op, the §9 gating-coherence law.
 *
 * SINGLE-WRITER (§1 law 5): this leaf is PURE — it DECIDES, it never writes. The roads mover
 * applies every effect through ITS OWN writers (the RansomRec fields, the redirected
 * legitimacy/prosperity applicators, and the two deposit ledgers this leaf persists on the
 * mover's behalf — roadsRansomSettlements → generosity, roadsBondEvents → the ladder).
 * NO-DEATH (§1 law 9): refusal, debt, and compromise are all continuations — no fate resolves.
 *
 * FIRST-PAINT LAW: a LAZY roads leaf, imported only from the lazy roads kernel + tests.
 *
 * @enforced-by tests/domain/thirdPartyRansom.test.js + tests/property/thirdPartyRansomDormancyGolden.test.js
 */
import { createPRNG } from '../../kernel/prng.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { relationshipTypeBetween, atOpenWar } from './embassyHazard.js';
import { bondSevToward } from '../worldPulse/npcLadderState.js';
import { asObject, num, clampNum, clamp01, conversionFlawFactor, cmp } from './state.js';

// ── THE DORMANCY GATE (§1 law 1) — a virtual, defensively-read flag ─────────────
/**
 * Is D-5 LIT? Reads simulationRules.thirdPartyRansomEnabled === true, defensively. ABSENT ⇒
 * false ⇒ DORMANT (the mover never enters the third-party checkpoint; byte-identical). Pure.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState @returns {boolean}
 */
export function thirdPartyRansomActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).thirdPartyRansomEnabled === true);
}

// ── §9 TUNING (soak-certified dials; every entry vetoable) ──────────────────────
export const THIRD_PARTY_RANSOM_TUNING = Object.freeze({
  HALF_TERM_FRACTION: 0.5, // the payer scan fires once when remainingWeeks crosses termWeeks × this
  // §9 THE REFUSAL — refuseP base by motive (a friend's coin is rarely refused; a rival's often)
  REFUSE_BASE: Object.freeze({ friendship: 0.02, succor_ally: 0.05, succor_unbonded: 0.25, leverage: 0.55 }),
  REFUSE_TRAIT_GAIN: 0.30, // +this when the captive bears a refusing trait (proud/loyal/…)
  ACCEPT_TRAIT_GAIN: 0.25, // −this for an accepting trait (pragmatic/ambitious/…) or a corruptible flaw
  SERVED_FRACTION_GAIN: 0.10, // −this × servedFraction — long chains humble the proudest neck
  REFUSE_MIN: 0.05, REFUSE_MAX: 0.95,
  // §9 THE OUTCOME FORK — pCompromised = BASE × flawFactor × motiveMult × acceptBias, clamped
  COMPROMISE_BASE: 0.18, COMPROMISE_CAP: 0.5,
  MOTIVE_COMPROMISE_MULT: Object.freeze({ leverage: 1.6, succor_unbonded: 1.0, succor_ally: 0.6, friendship: 0.3 }),
  ACCEPT_BIAS_TRAIT: 1.4, ACCEPT_BIAS_BASE: 1.0,
  // §9 THE WRITE SCHEDULE (redirected)
  OBLIGATION_SCALE: 0.5, // ransom_relief obligation magnitude = this × importanceWeight (notable ~0.2 · pillar 0.5)
  PAYER_PROSPERITY_STEP: -1, // the payer bleeds a band-step for key/pillar captives (mercy priced)
  PAYER_CREDIT_MIN_WEIGHT: 0.7, // "key/pillar" = importanceWeight >= this (the roads CAPTOR_CREDIT_MIN_WEIGHT twin)
  // §9 THE FRIEND CHANNEL (memoryWeave) — friend-payer detection + gratitude bond formation
  FRIEND_PAYER_FLOOR: 0.3, // a payer NPC's bond toward the captive >= this ⇒ a FRIEND payer
  GRATITUDE_BOND_SEV: 0.5, // the gratitude bond deposited toward the friend who paid (D-7e formation)
  GRATITUDE_BOND_WEEKS: 260, // the bond's formation week is stamped; the ladder's D5-band clock decays it
  // deposit-ledger prune windows (safety TTL; the consumer clears within one tick by construction)
  DEPOSIT_TTL_WEEKS: 8,
});

// §9 the personality trait sets (the traitsOf read — the npcLadderGoals idiom over dominant/flaw)
const REFUSE_TRAITS = new Set(['proud', 'loyal', 'principled', 'zealous', 'pious']);
const ACCEPT_TRAITS = new Set(['pragmatic', 'ambitious', 'opportunistic']);
// §9 the succor/leverage relationship reads (relationshipTypeBetween vocabulary)
const ALLY_LIKE = new Set(['ally', 'allied', 'friendly', 'vassal', 'patron', 'client', 'defensive_pact', 'cordial', 'kinship']);
const TRADE_LIKE = new Set(['trade_partner', 'trade', 'commercial']);
const RIVAL_LIKE = new Set(['rival', 'cold_war']);
// §9 the predatory (leverage) governing archetype — the generosity §2.1 leverage-seat read
const PREDATORY_ARCHETYPE = /militar|expansion|imperial|warlord|tyran|merc|ambit|opportun|criminal|raid|conquer|hegemon/i;

/** @param {unknown} npc @returns {{ dominant: string, flaw: string }} personality read (lowercased). Pure. */
function personaOf(npc) {
  const p = asObject(asObject(npc).personality);
  return { dominant: String(p.dominant || '').toLowerCase(), flaw: String(p.flaw || '').toLowerCase() };
}
/** Does the captive bear a refusing trait (proud/loyal/principled/zealous/pious)? Pure. @param {unknown} npc @returns {boolean} */
export function hasRefusingTrait(npc) {
  const { dominant, flaw } = personaOf(npc);
  return REFUSE_TRAITS.has(dominant) || REFUSE_TRAITS.has(flaw);
}
/** Does the captive bear an accepting trait (pragmatic/ambitious/opportunistic) OR a corruptible
 *  flaw? Pure. @param {unknown} npc @param {Set<string>|readonly string[]} corruptibleFlaws @returns {boolean} */
export function hasAcceptingTrait(npc, corruptibleFlaws) {
  const { dominant, flaw } = personaOf(npc);
  const set = corruptibleFlaws instanceof Set ? corruptibleFlaws : new Set(Array.isArray(corruptibleFlaws) ? corruptibleFlaws : []);
  return ACCEPT_TRAITS.has(dominant) || ACCEPT_TRAITS.has(flaw) || set.has(flaw);
}

/**
 * §9 THE REFUSAL PROBABILITY: a captive's chance of refusing a third party's coin. Pure.
 * @param {{ motive: string, npc: unknown, servedFraction: number, corruptibleFlaws: Set<string>|readonly string[] }} a
 * @returns {number}
 */
export function payerRefuseProbability(a) {
  const T = THIRD_PARTY_RANSOM_TUNING;
  const base = num(/** @type {Record<string, number>} */ (T.REFUSE_BASE)[a.motive], 0.25);
  const refusing = hasRefusingTrait(a.npc) ? T.REFUSE_TRAIT_GAIN : 0;
  const accepting = hasAcceptingTrait(a.npc, a.corruptibleFlaws) ? T.ACCEPT_TRAIT_GAIN : 0;
  const served = T.SERVED_FRACTION_GAIN * clamp01(a.servedFraction);
  return clampNum(base + refusing - accepting - served, T.REFUSE_MIN, T.REFUSE_MAX);
}

/**
 * §9 THE COMPROMISE PROBABILITY: pCompromised for an ACCEPTED third-party ransom (the outcome
 * fork's leash chance; the complement is DEBT). Uses the roads conversionFlawFactor VERBATIM —
 * zero new corruption machinery. Pure.
 * @param {{ motive: string, npc: unknown, acceptedViaTrait: boolean, corruptibleFlaws: Set<string>|readonly string[] }} a
 * @returns {number}
 */
export function payerCompromiseProbability(a) {
  const T = THIRD_PARTY_RANSOM_TUNING;
  const flawFactor = conversionFlawFactor(a.npc, a.corruptibleFlaws);
  const motiveMult = num(/** @type {Record<string, number>} */ (T.MOTIVE_COMPROMISE_MULT)[a.motive], 1.0);
  const acceptBias = a.acceptedViaTrait ? T.ACCEPT_BIAS_TRAIT : T.ACCEPT_BIAS_BASE;
  return clampNum(T.COMPROMISE_BASE * Math.max(0, flawFactor) * motiveMult * acceptBias, 0, T.COMPROMISE_CAP);
}

/** The governing faction's archetype of a settlement matches the predatory (leverage) pattern? Pure.
 *  @param {unknown} settlement @returns {boolean} */
function predatorySeat(settlement) {
  const factions = asObject(asObject(settlement).powerStructure).factions;
  const list = Array.isArray(factions) ? factions : [];
  for (const f of list) {
    const fo = asObject(f);
    if (fo.isGoverning) return PREDATORY_ARCHETYPE.test(String(fo.archetype || ''));
  }
  return false;
}

/** Sum of the outstanding obligations home→payer (home is indebted to the payer). Pure.
 *  @param {Record<string, unknown>} obligations @param {string} homeId @param {string} payerId @returns {number} */
function obligationHomeOwes(obligations, homeId, payerId) {
  let sum = 0;
  for (const key of Object.keys(obligations)) {
    const r = asObject(obligations[key]);
    if (String(r.from) === homeId && String(r.to) === payerId) sum += num(r.magnitude, 0);
  }
  return sum;
}

/** The strongest FRIEND in a payer settlement toward the captive (a ladder NPC whose bond
 *  toward captiveNpcKey >= FRIEND_PAYER_FLOOR), or null. Pure.
 *  @param {Record<string, unknown>} ladderLedger @param {string} payerId @param {string} captiveNpcKey
 *  @returns {{ npcKey: string, sev: number }|null} */
function friendInSettlement(ladderLedger, payerId, captiveNpcKey) {
  const npcs = asObject(asObject(ladderLedger[payerId]).npcs);
  const floor = THIRD_PARTY_RANSOM_TUNING.FRIEND_PAYER_FLOOR;
  /** @type {{ npcKey: string, sev: number }|null} */
  let best = null;
  for (const npcKey of Object.keys(npcs).sort(cmp)) {
    const sev = bondSevToward(/** @type {never} */ (npcs[npcKey]), captiveNpcKey);
    if (sev >= floor && (!best || sev > best.sev)) best = { npcKey, sev };
  }
  return best;
}

/**
 * @typedef {Object} ThirdPartyDecision
 * @property {'none'|'refused'|'debt'|'compromised'} action
 * @property {string|null} payerId
 * @property {string|null} payerMotive
 * @property {{ targetNpcKey: string, targetSid: string, sev: number }|null} [gratitudeBond]  friend-payer only
 * @property {number} [obligationMag]   the ransom_relief magnitude (DEBT only)
 * @property {boolean} [predatory]      the obligation was minted at leverage weight (DEBT only)
 */

/**
 * §9 THE THIRD-PARTY CHECKPOINT (called ONCE per ransom at half-term). Scans for the highest-EV
 * payer across all settlements, rolls the refusal, and — on acceptance — the outcome fork. PURE:
 * returns a decision the mover applies; writes nothing. Deterministic (ransomId-seeded forks;
 * codepoint-stable candidate scan).
 * @param {Object} a
 * @param {Record<string, unknown>} a.ransom          the RansomRec (homeId, captorId, npcKey, id, willConvert)
 * @param {unknown} a.captiveNpc                       the captive's npc (personality, importance)
 * @param {number} a.w                                 the captive's importanceWeight [0,1]
 * @param {number} a.servedFraction                    term served at the checkpoint [0,1]
 * @param {Record<string, unknown>} a.graph
 * @param {Record<string, unknown>} a.worldState
 * @param {(id: string) => Record<string, unknown>} a.settlementOf
 * @param {string[]} a.candidateIds                    all settlement ids (codepoint-ordered upstream)
 * @param {string} a.rngSeed
 * @param {boolean} a.memoryWeaveLit                   the friend channel + gratitude bond gate
 * @param {Set<string>|readonly string[]} a.corruptibleFlaws
 * @returns {ThirdPartyDecision}
 */
export function resolveThirdPartyRansom(a) {
  const T = THIRD_PARTY_RANSOM_TUNING;
  const ransom = asObject(a.ransom);
  const homeId = String(ransom.homeId);
  const captorId = String(ransom.captorId);
  const captiveKey = String(ransom.npcKey);
  const ransomId = String(ransom.id);
  const obligations = asObject(getSpatialLedger(a.worldState, 'obligations'));
  const ladderLedger = asObject(getSpatialLedger(a.worldState, 'npcLadder'));

  /** @type {{ payerId: string, motive: string, ev: number, friendNpcKey: string|null }|null} */
  let best = null;
  for (const payerId of a.candidateIds) {
    if (payerId === homeId || payerId === captorId) continue;
    if (atOpenWar(a.graph, payerId, captorId)) continue; // the captor gate — a payer at war with the captor cannot deal
    const relation = String(relationshipTypeBetween(a.graph, a.worldState, homeId, payerId) || '');
    // (c) FRIEND (memoryWeave only): a payer whose notable holds a positive bond toward the captive.
    const friend = a.memoryWeaveLit ? friendInSettlement(ladderLedger, payerId, captiveKey) : null;
    /** @type {string} */ let motive;
    /** @type {string|null} */ let friendNpcKey = null;
    /** @type {number} */ let tier;
    if (friend) { motive = 'friendship'; friendNpcKey = friend.npcKey; tier = 4; }
    else if (ALLY_LIKE.has(relation)) { motive = 'succor_ally'; tier = 3; }
    else if (obligationHomeOwes(obligations, homeId, payerId) > 0 && !RIVAL_LIKE.has(relation)) {
      // (a) CREDITOR: home owes the payer — a debtor's captive is a chance to collect in gratitude.
      motive = ALLY_LIKE.has(relation) ? 'succor_ally' : 'succor_unbonded'; tier = 2;
    } else if (TRADE_LIKE.has(relation)) { motive = 'succor_unbonded'; tier = 2; }
    else if (RIVAL_LIKE.has(relation) && predatorySeat(a.settlementOf(payerId))) {
      // (b) LEVERAGE: a predatory rival buys a rival's notable — the favor-economy weapon.
      motive = 'leverage'; tier = 1;
    } else continue;
    const ev = tier + clamp01(a.w); // motive tier dominates; importance breaks within a tier (payerId codepoint final)
    if (!best || ev > best.ev) best = { payerId, motive, ev, friendNpcKey };
  }
  if (!best) return { action: 'none', payerId: null, payerMotive: null };

  // THE REFUSAL (owner refinement ii) — evaluated BEFORE any release logic.
  const refuseFork = createPRNG(`${a.rngSeed}::roads-ransom3p:refuse:${ransomId}`);
  const refuseP = payerRefuseProbability({
    motive: best.motive, npc: a.captiveNpc, servedFraction: a.servedFraction, corruptibleFlaws: a.corruptibleFlaws,
  });
  if (refuseFork.random() < refuseP) return { action: 'refused', payerId: best.payerId, payerMotive: best.motive };

  // THE OUTCOME FORK (owner refinement i) — EXACTLY ONE of DEBT or COMPROMISED, one roll at release.
  const acceptedViaTrait = hasAcceptingTrait(a.captiveNpc, a.corruptibleFlaws);
  /** @type {'debt'|'compromised'} */ let action;
  if (ransom.willConvert === true) {
    action = 'debt'; // CAPTOR PRECEDENCE: a latched captor leash wins — the payer outcome is forced to DEBT
  } else {
    const outFork = createPRNG(`${a.rngSeed}::roads-ransom3p:outcome:${ransomId}`);
    const pCompromised = payerCompromiseProbability({
      motive: best.motive, npc: a.captiveNpc, acceptedViaTrait, corruptibleFlaws: a.corruptibleFlaws,
    });
    action = outFork.random() < pCompromised ? 'compromised' : 'debt';
  }
  const gratitudeBond = (a.memoryWeaveLit && best.motive === 'friendship' && best.friendNpcKey)
    ? { targetNpcKey: best.friendNpcKey, targetSid: best.payerId, sev: T.GRATITUDE_BOND_SEV } : null;
  return {
    action, payerId: best.payerId, payerMotive: best.motive, gratitudeBond,
    obligationMag: T.OBLIGATION_SCALE * clamp01(a.w), predatory: best.motive === 'leverage',
  };
}

/**
 * §9 THE RELEASE EFFECTS: translate an ACCEPTED decision into the mover's deposit/applicator plan
 * (the mover pushes these; this leaf never writes). COMPROMISED routes the returned-captive channel
 * to the PAYER (web dark ⇒ falls through to DEBT, §9 gating coherence). DEBT deposits the
 * ransom_relief obligation. A friend-payer's gratitude bond rides either. Pure.
 * @param {ThirdPartyDecision} decision
 * @param {{ homeId: string, captorId: string, npcKey: string, w: number, corruptionWebLit: boolean }} ctx
 * @returns {{ payerId: string, payerProsperityStep: number,
 *   returnedCaptiveDeposit: { captorId: string, homeId: string, npcKey: string, beneficiaryId: string }|null,
 *   ransomSettlementDeposit: { homeId: string, payerId: string, magnitude: number, predatory: boolean }|null,
 *   bondEventDeposit: { homeId: string, captiveNpcKey: string, targetNpcKey: string, targetSid: string, sev: number }|null }}
 */
export function thirdPartyReleaseEffects(decision, ctx) {
  const T = THIRD_PARTY_RANSOM_TUNING;
  const payerId = String(decision.payerId || '');
  const compromised = decision.action === 'compromised' && ctx.corruptionWebLit; // web dark ⇒ degrade to debt
  const gb = decision.gratitudeBond || null;
  return {
    payerId,
    payerProsperityStep: clamp01(ctx.w) >= T.PAYER_CREDIT_MIN_WEIGHT ? T.PAYER_PROSPERITY_STEP : 0,
    returnedCaptiveDeposit: compromised
      ? { captorId: ctx.captorId, homeId: ctx.homeId, npcKey: ctx.npcKey, beneficiaryId: payerId } : null,
    ransomSettlementDeposit: compromised
      ? null : { homeId: ctx.homeId, payerId, magnitude: num(decision.obligationMag, 0), predatory: decision.predatory === true },
    bondEventDeposit: gb
      ? { homeId: ctx.homeId, captiveNpcKey: ctx.npcKey, targetNpcKey: gb.targetNpcKey, targetSid: gb.targetSid, sev: gb.sev } : null,
  };
}

// ── §9 THE DEPOSIT LEDGERS — the mover persists these on this leaf's behalf (drop-when-empty,
//    codepoint-stable). roadsRansomSettlements → advanceGenerosity (DEBT). roadsBondEvents →
//    the ladder pass (gratitude). Both prune records older than one tick (consume-once by
//    construction: the consumer runs earlier in the tick that follows the deposit — pulse order). ─

/**
 * §9 THE DEBT CONSUMER (generosity's arm): read the roadsRansomSettlements deposits into
 * ransom_relief obligation mints {from: home (debtor), to: payer (creditor)}. The roads mover
 * prunes the ledger the same tick (drop-all-prior), so each deposit is consumed exactly once
 * (pulse order: generosity before roads-last). CONSUME-ONCE DOUBLE GUARD (courier-liveness):
 * a deposit is couriered EXACTLY one tick after it lands (depositTick === tick − 1); a stale
 * one whose depositor went dark (drop-all-prior never fired) is skipped, never re-consumed —
 * the readGratitudeBondEvents idiom in the pulse-tick clock (the deposit's `week` field rides
 * the interval-scaled calendar, so only depositTick is safe to age against). Absent depositTick
 * (a legacy in-flight record) defaults to one-tick-old ⇒ consumed once, as before. Absent
 * ledger ⇒ [] ⇒ byte-neutral. Pure.
 * @param {Record<string, unknown>} worldState @param {number} tick
 * @returns {Array<{ from: string, to: string, kind: string, magnitude: number, mintTick: number, lastTick: number, predatory?: boolean }>}
 */
export function consumeRansomSettlements(worldState, tick) {
  const ledger = asObject(getSpatialLedger(worldState, 'roadsRansomSettlements'));
  const oneTickAgo = Math.floor(num(tick, 0)) - 1;
  /** @type {Array<{ from: string, to: string, kind: string, magnitude: number, mintTick: number, lastTick: number, predatory?: boolean }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort(cmp)) {
    const r = asObject(ledger[key]);
    if (Math.floor(num(r.depositTick, oneTickAgo)) !== oneTickAgo) continue; // stale (dark depositor) ⇒ never re-consume
    const from = String(r.homeId || ''); const to = String(r.payerId || '');
    const magnitude = num(r.magnitude, 0);
    if (!from || !to || from === to || magnitude <= 0) continue;
    out.push({ from, to, kind: 'ransom_relief', magnitude, mintTick: tick, lastTick: tick, ...(r.predatory === true ? { predatory: true } : {}) });
  }
  return out;
}

/**
 * §9 THE GRATITUDE CONSUMER (the ladder's arm): read the roadsBondEvents deposits into a lookup
 * `${homeId}|${captiveNpcKey}` → { targetNpcKey, targetSid, sev }. The ladder pass mints the
 * gratitude bond through ITS OWN writer (mintBond) when it processes the captive's standing; the
 * roads mover prunes the ledger the same tick (consume-once, pulse order). CONSUME-ONCE DOUBLE
 * GUARD (courier-liveness): consume ONLY a deposit exactly one tick old (depositTick === tick − 1,
 * the pulse-tick clock); a stale one left by a dark depositor is skipped, never re-consumed.
 * Absent depositTick (legacy in-flight) defaults to one-tick-old ⇒ consumed once, as before.
 * Absent ⇒ empty ⇒ byte-neutral. Pure.
 * @param {Record<string, unknown>} worldState @param {number} [tick]
 * @returns {Map<string, { targetNpcKey: string, targetSid: string, sev: number }>}
 */
export function readRoadsBondEvents(worldState, tick) {
  const ledger = asObject(getSpatialLedger(worldState, 'roadsBondEvents'));
  const oneTickAgo = Math.floor(num(tick, 0)) - 1;
  /** @type {Map<string, { targetNpcKey: string, targetSid: string, sev: number }>} */
  const out = new Map();
  for (const key of Object.keys(ledger).sort(cmp)) {
    const r = asObject(ledger[key]);
    if (Math.floor(num(r.depositTick, oneTickAgo)) !== oneTickAgo) continue; // stale (dark depositor) ⇒ never re-consume
    const homeId = String(r.homeId || ''); const captiveNpcKey = String(r.captiveNpcKey || '');
    const targetNpcKey = String(r.targetNpcKey || ''); const targetSid = String(r.targetSid || '');
    if (!homeId || !captiveNpcKey || !targetNpcKey || !targetSid) continue;
    out.set(`${homeId}|${captiveNpcKey}`, { targetNpcKey, targetSid, sev: num(r.sev, 0) });
  }
  return out;
}

/** Sort an object's keys codepoint-stably. @param {Record<string, unknown>} obj @returns {Record<string, unknown>} */
function sortKeys(obj) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const k of Object.keys(obj).sort(cmp)) out[k] = obj[k];
  return out;
}

/**
 * Decide the drop-when-empty write for one deposit ledger: null ⇒ no change; else the sorted
 * next records (or null to drop). The CALLER performs the literal-key setSpatialLedger/
 * dropSpatialLedger so the ledger-coverage walker detects the write. Pure.
 * @param {Record<string, unknown>} nextRecords @param {Record<string, unknown>} priorRecords
 * @returns {{ records: Record<string, unknown>|null }|null}
 */
function diffLedger(nextRecords, priorRecords) {
  const prev = JSON.stringify(Object.keys(priorRecords).length ? priorRecords : null);
  const sorted = Object.keys(nextRecords).length ? sortKeys(nextRecords) : null;
  const next = JSON.stringify(sorted);
  if (prev === next) return null;
  return { records: sorted };
}

/**
 * Persist the two D-5 deposit ledgers. Prior records are ALWAYS dropped — the consumer runs
 * exactly once between two roads passes (pulse order: generosity/ladder before roads-last), so
 * every prior deposit was consumed the tick after it landed (consume-once by construction). This
 * tick's deposits are appended. Drop-when-empty ⇒ dark (no deposits) is byte-identical.
 * @param {Record<string, unknown>} worldState
 * @param {Object} deposits
 * @param {Array<{ homeId: string, payerId: string, magnitude: number, predatory: boolean }>} deposits.ransomSettlements
 * @param {Array<{ homeId: string, captiveNpcKey: string, targetNpcKey: string, targetSid: string, sev: number }>} deposits.bondEvents
 * @param {number} weekClock  the calendar week (interval-scaled) — the record key + informational `week`
 * @param {number} [depositTick]  the PULSE tick (+1/tick, catch-up-stable) — the consumers' consume-once
 *   clock; a deposit is couriered exactly one tick later, so consume-once ages against THIS, not `week`
 *   (which jumps by the tick interval, up to 52 weeks). Defaults to weekClock for callers that omit it.
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function persistThirdPartyLedgers(worldState, deposits, weekClock, depositTick = weekClock) {
  const stamp = Math.floor(num(depositTick, weekClock));
  let ws = worldState;
  let changed = false;
  const settlementDeps = Array.isArray(deposits.ransomSettlements) ? deposits.ransomSettlements : [];
  const bondDeps = Array.isArray(deposits.bondEvents) ? deposits.bondEvents : [];

  const priorSettle = asObject(getSpatialLedger(worldState, 'roadsRansomSettlements'));
  if (Object.keys(priorSettle).length || settlementDeps.length) {
    /** @type {Record<string, unknown>} */
    const nextSettle = {};
    for (const d of settlementDeps) {
      nextSettle[`${d.homeId}|${d.payerId}|${weekClock}`] = { homeId: d.homeId, payerId: d.payerId, magnitude: d.magnitude, predatory: d.predatory === true, week: weekClock, depositTick: stamp };
    }
    const res = diffLedger(nextSettle, priorSettle);
    if (res) {
      ws = res.records ? setSpatialLedger(ws, 'roadsRansomSettlements', res.records) : dropSpatialLedger(ws, 'roadsRansomSettlements');
      changed = true;
    }
  }

  const priorBonds = asObject(getSpatialLedger(worldState, 'roadsBondEvents'));
  if (Object.keys(priorBonds).length || bondDeps.length) {
    /** @type {Record<string, unknown>} */
    const nextBonds = {};
    for (const d of bondDeps) {
      nextBonds[`${d.homeId}|${d.captiveNpcKey}|${d.targetSid}|${d.targetNpcKey}|${weekClock}`] = {
        homeId: d.homeId, captiveNpcKey: d.captiveNpcKey, targetNpcKey: d.targetNpcKey, targetSid: d.targetSid, sev: d.sev, week: weekClock, depositTick: stamp,
      };
    }
    const res = diffLedger(nextBonds, priorBonds);
    if (res) {
      ws = res.records ? setSpatialLedger(ws, 'roadsBondEvents', res.records) : dropSpatialLedger(ws, 'roadsBondEvents');
      changed = true;
    }
  }
  return { worldState: ws, changed };
}
