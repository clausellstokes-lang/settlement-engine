/**
 * npcLadderChallenge.js — THE CHALLENGE ENGINE (a lazy sibling leaf of npcLadderKernel.js;
 * DESIGN_THE_LADDER.md §1 conservation · §2 windows/challenge model · §3 determinants ·
 * §4d/§4e traits+D5 · §10 stigma · §11.2 pacing brakes · §11.4 the three-body ladder).
 *
 * A challenge on an adjacent pair (challenger rung i vs defender rung i-1) may open ONLY
 * on a WINDOW; it resolves as a DETERMINISTIC seeded contest — challengeScore vs
 * defenseScore from the §3/§4 named inputs, with FOUR stacked brakes so promotions stay
 * rare (§11.2): (1) the sustained margin (TURN_MARGIN — a spike never fires), (2) windows
 * as gates, (3) a per-faction years-scale post-succession cooldown (the interregnum),
 * (4) the realm-wide E0 cap (the cacophony guard). CONSERVATION (§1): a win SWAPS the two
 * rungs; a FAILED challenge drops the challenger one rung (the stake — ambition risks
 * something real). THE THREE-BODY LADDER (§11.4): mounting a challenge WEAKENS your own
 * defense for its duration, so the ambitious middle straining at the top is exposed to the
 * patient bottom. NO rng — every draw is hash01 over the seed fork (seed|tick|faction|npc).
 *
 * The receipt enumerates every score input (non-short-circuiting, the S7 evaluator idiom).
 * Pure over its arguments; the kernel applies the returned swaps/deposits/marks/beats.
 */
import { hash01 } from '../region/contestMath.js';
import { acquiredTraitsOf, oppositionOf } from './npcGrowthKernel.js';
import { factionArchetype } from '../factionArchetypes.js';
import { clamp, clamp01 } from '../../kernel/math.js';
import { num, asObject, round4, LADDER_TUNING } from './npcLadderState.js';

// ── Tuning (JUDGMENT — say "veto" to retune; the CADENCE dial is soak-certified) ──
export const CHALLENGE_TUNING = Object.freeze({
  // THE CADENCE DIAL (§11.2 + the anti-stasis bound): the base per-advance rate a viable,
  // windowed challenge is even ATTEMPTED. Small ⇒ rare. Scaled up by the challenger's
  // margin. Target band: a succession per faction every few sim-years — NEITHER stasis
  // (a nonzero floor: windows + margin still let the strong rise) NOR churn (the ceiling:
  // cooldown + cap). Soak-certify against BOTH bounds.
  CHALLENGE_RATE: 0.05,
  RATE_MARGIN_GAIN: 0.10, // × how far challengeScore exceeds defenseScore (0..~1)
  // (1) THE SUSTAINED MARGIN — a win needs challengeScore ≥ defenseScore × this (held,
  // not spiked; the fabric LEAD_FLOOR/TURN_MARGIN idiom).
  TURN_MARGIN: 1.15,
  // (3) per-faction post-succession cooldown (weeks) — the interregnum = the §8 transition-
  // instability period; ~2 years seals the court after any succession.
  COOLDOWN_WEEKS: 104,
  // (4) the realm-wide E0 cap on ladder successions per advance (the cacophony guard).
  REALM_SUCCESSION_CAP: 3,
  // Seat weight: the defender's seat defends its holder, scaling with rung HEIGHT (top
  // seat the most) — pushing DOWN is harder than climbing is ambitious (§2).
  SEAT_WEIGHT: 2.5,
  // Faction power trajectory (§3.1): rising ⇒ "the system works" (defense bonus); falling
  // ⇒ a structural-change pressure lowering every incumbent's defense.
  FACTION_RISING_DEFENSE: 1.2,
  FACTION_FALLING_DEFENSE: -1.5,
  POWER_TRAJECTORY_EPS: 0.5,
  // (§11.4) mounting a challenge weakens your own defense to this fraction for the advance.
  DEFENSE_WHEN_CHALLENGING: 0.6,
  // Trait weights (§4d): tenacious aids challenge; cautious aids defense.
  TENACIOUS_BONUS: 1.2,
  CAUTIOUS_BONUS: 1.2,
  // Clash (§3.3): a defender far from the faction's character has its defense ERODED and
  // rivals' challenges sharpened.
  CLASH_DEFENSE_EROSION: 2.0,
  // Compromised covert leverage (§4c): evil climbs on leverage — a covert-compromised
  // challenger gains challenge weight (a time-bomb the exposure window later detonates).
  LEVERAGE_BONUS: 1.0,
  // §10 THE STIGMA MARK: an exposed climber challenges at HALF strength.
  STIGMA_CHALLENGE_TAX: 0.5,
  // §4e D5: a failed challenger's grudge hardens the SAME defender's defense on a repeat.
  GRUDGE_HARDEN: 1.5,
  // The stake (§2): a failed challenge withdraws this share of the challenger's standing
  // and stamps a D5 grudge of this severity (lifespan-scaled decay handled by the kernel).
  FAIL_STANDING_WITHDRAW: 0.15,
  GRUDGE_MINT_SEV: 0.6,
});

/** @param {Record<string, unknown>} npc @param {Record<string, unknown>} worldState @param {string} nid
 *  @returns {string[]} core+acquired trait words, lowercased */
function traitWordsOf(npc, worldState, nid) {
  /** @type {string[]} */
  const out = [];
  const p = npc.personality;
  if (typeof p === 'string') out.push(p.toLowerCase());
  else if (Array.isArray(p)) for (const x of p) if (typeof x === 'string') out.push(x.toLowerCase());
  else { const o = asObject(p); for (const k of ['dominant', 'flaw', 'modifier']) if (typeof o[k] === 'string') out.push(String(o[k]).toLowerCase()); }
  for (const a of acquiredTraitsOf(worldState, nid)) if (a && typeof a.trait === 'string') out.push(a.trait.toLowerCase());
  return out;
}

// The faction's institutional CHARACTER as a trait word (for the §3.3 clash metric via the
// growth layer's oppositionOf 2-vector). JUDGMENT — say "veto".
/** @type {Readonly<Record<string, string>>} */
const FACTION_CHARACTER = Object.freeze({
  government: 'lawful', noble: 'proud', military: 'aggressive', merchant: 'shrewd',
  religious: 'pious', criminal: 'ruthless', arcane: 'aloof', craft: 'diligent',
  labor: 'stoic', outsider: 'independent', occupation: 'harsh', civic: 'loyal', other: 'pragmatic',
});
/** person-vs-institutional-character clash (0 fit … 1 opposed), reusing the growth 2-vector.
 *  @param {Record<string, unknown>} npc @param {unknown} faction @returns {number} */
export function clashOf(npc, faction) {
  const arch = factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (faction));
  const character = FACTION_CHARACTER[arch] || FACTION_CHARACTER.other;
  return clamp01(oppositionOf(character, /** @type {Parameters<typeof oppositionOf>[1]} */ (npc)));
}

/** @typedef {{ nid: string, npc: Record<string, unknown>, standing: number, stigma: boolean,
 *   grudgeVsDefender: number, isChallenging: boolean, rungIndex: number, rungCount: number }} Combatant */
/** @typedef {{ faction: unknown, factionRising: boolean, factionFalling: boolean,
 *   worldState: Record<string, unknown> }} ChallengeCtx */

/**
 * The challenger's contest score — the §3/§4 inputs enumerated (non-short-circuiting).
 * Returns { score, receipt } where receipt lists every contribution by name.
 * @param {Combatant} c @param {ChallengeCtx} ctx @returns {{ score: number, receipt: Record<string, number> }}
 */
export function challengeScore(c, ctx) {
  const T = CHALLENGE_TUNING;
  const traits = traitWordsOf(c.npc, ctx.worldState, c.nid);
  /** @type {Record<string, number>} */
  const receipt = {};
  receipt.standing = round4(c.standing);
  receipt.tenacious = traits.includes('tenacious') ? T.TENACIOUS_BONUS : 0;
  receipt.leverage = c.npc.corrupt === true && c.npc.ousted !== true ? T.LEVERAGE_BONUS : 0;
  receipt.grudgeAgainst = -round4(T.GRUDGE_HARDEN * c.grudgeVsDefender);
  let score = receipt.standing + receipt.tenacious + receipt.leverage + receipt.grudgeAgainst;
  // §10 THE STIGMA MARK: an exposed climber climbs at half strength.
  receipt.stigmaTax = c.stigma ? -round4(score * (1 - T.STIGMA_CHALLENGE_TAX)) : 0;
  if (c.stigma) score *= T.STIGMA_CHALLENGE_TAX;
  return { score: round4(Math.max(0, score)), receipt };
}

/**
 * The defender's contest score — seat weight, faction trajectory, traits, clash, and the
 * three-body self-weakening. Returns { score, receipt } enumerating every input.
 * @param {Combatant} d @param {ChallengeCtx} ctx @returns {{ score: number, receipt: Record<string, number> }}
 */
export function defenseScore(d, ctx) {
  const T = CHALLENGE_TUNING;
  const traits = traitWordsOf(d.npc, ctx.worldState, d.nid);
  /** @type {Record<string, number>} */
  const receipt = {};
  receipt.standing = round4(d.standing);
  // Seat weight scales with rung HEIGHT (the top seat defends hardest).
  const heightFrac = d.rungCount <= 1 ? 1 : (d.rungCount - 1 - d.rungIndex) / (d.rungCount - 1);
  receipt.seatWeight = round4(T.SEAT_WEIGHT * clamp01(heightFrac));
  receipt.factionTrajectory = ctx.factionRising ? T.FACTION_RISING_DEFENSE : ctx.factionFalling ? T.FACTION_FALLING_DEFENSE : 0;
  receipt.cautious = traits.includes('cautious') ? T.CAUTIOUS_BONUS : 0;
  receipt.clashErosion = -round4(T.CLASH_DEFENSE_EROSION * clashOf(d.npc, ctx.faction));
  let score = receipt.standing + receipt.seatWeight + receipt.factionTrajectory + receipt.cautious + receipt.clashErosion;
  // §11.4 THE THREE-BODY: a defender who is itself straining upward defends weakened.
  receipt.threeBodyPenalty = d.isChallenging ? -round4(Math.max(0, score) * (1 - T.DEFENSE_WHEN_CHALLENGING)) : 0;
  if (d.isChallenging) score *= T.DEFENSE_WHEN_CHALLENGING;
  return { score: round4(Math.max(0, score)), receipt };
}

/** The windows a defender is vulnerable through (§2). @param {Combatant} d @param {ChallengeCtx} ctx
 *  @param {boolean} defenderExposed @param {boolean} [faithRuptured] the high priest against his god (4b)
 *  @returns {string[]} the open window reasons ([] ⇒ no window) */
export function openWindows(d, ctx, defenderExposed, faithRuptured = false) {
  /** @type {string[]} */
  const w = [];
  if (ctx.factionFalling) w.push('faction_power_falling');
  if (d.standing < LADDER_TUNING.STAND_BASELINE) w.push('incumbent_underperforming');
  if (defenderExposed || d.stigma) w.push('revealed_corruption');
  if (faithRuptured) w.push('faith_rupture'); // §4b PERMANENT — a head against his faith cannot rest
  return w;
}

/** The deterministic seed-fork draw for a challenge intent (NO rng). @param {string} seed
 *  @param {number} tick @param {string} fkey @param {string} cNid @param {string} dNid @returns {number} */
export function challengeDraw(seed, tick, fkey, cNid, dNid) {
  return hash01(`${seed}|${tick}|ladder|${fkey}|${cNid}|${dNid}`);
}

/** The challenger's standing grudge against a specific defender (§4e D5 mark severity).
 *  @param {import('./npcLadderKernel.js').LadderStanding|undefined} rec @param {string} defenderNid @returns {number} */
function grudgeSevOf(rec, defenderNid) {
  const g = rec && rec.grudges ? rec.grudges[defenderNid] : null;
  return g && typeof g.sev === 'number' ? g.sev : 0;
}

/**
 * @typedef {Object} ChallengeEvent
 * @property {'rise'|'failed'} kind
 * @property {string} challengerNid @property {string} defenderNid
 * @property {string} challengerName @property {string} defenderName
 * @property {string[]} windows
 * @property {number} cScore @property {number} dScore
 * @property {Record<string, number>} cReceipt @property {Record<string, number>} dReceipt
 */
/**
 * @typedef {Object} ChallengePlan
 * @property {string[]} nextRungs — the post-contest ordering (conservation: a permutation)
 * @property {ChallengeEvent[]} events
 * @property {Array<{ challengerNid: string, defenderNid: string }>} grudgeMints — failed challengers
 * @property {Array<{ nid: string, share: number }>} withdraws — the failed-challenge standing stake
 * @property {number} successions — successful displacements (⇒ cooldown + realm-cap spend)
 */

/**
 * Resolve one faction's ladder challenges this advance (§2/§3/§11.4). Cooldown-gated
 * (the interregnum); each adjacent challenger may open ONLY on a window, fires on the
 * seeded rarity draw scaled by margin, and WINS only past the sustained TURN_MARGIN — a
 * win transposes the pair (conservation), a loss drops the challenger (the stake).
 * THE THREE-BODY: a defender that is itself challenging defends weakened. Returns a PLAN
 * the kernel applies (rungs, events, grudges, withdrawals). PURE; NO rng.
 * @param {Object} a
 * @param {string[]} a.rungs @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} a.npcs
 * @param {Map<string, Record<string, unknown>>} a.npcByNid
 * @param {unknown} a.faction @param {string} a.fkey
 * @param {number} a.cooldownUntil @param {number} a.weeks @param {number} a.tick @param {string} a.seed
 * @param {boolean} a.factionRising @param {boolean} a.factionFalling
 * @param {Set<string>} a.freshExposed @param {Set<string>} [a.faithRuptured] the ruptured defenders (4b)
 * @param {Record<string, unknown>} a.worldState @param {number} a.realmBudget
 * @returns {ChallengePlan}
 */
export function resolveFactionChallenges(a) {
  const T = CHALLENGE_TUNING;
  const { rungs, npcs, npcByNid, faction, fkey, cooldownUntil, weeks, tick, seed, factionRising, factionFalling, freshExposed, worldState, realmBudget } = a;
  const faithRuptured = a.faithRuptured instanceof Set ? a.faithRuptured : new Set();
  const empty = /** @type {ChallengePlan} */ ({ nextRungs: rungs, events: [], grudgeMints: [], withdraws: [], successions: 0 });
  if (cooldownUntil > weeks) return empty;           // (3) the interregnum
  if (realmBudget <= 0) return empty;                 // (4) the realm E0 cap is spent
  const rungCount = rungs.length;
  if (rungCount < 2) return empty;
  const ctx = /** @type {ChallengeCtx} */ ({ faction, factionRising, factionFalling, worldState });
  const nameOf = (/** @type {string} */ nid) => String(asObject(npcByNid.get(nid)).name || asObject(npcByNid.get(nid)).label || nid);
  const mk = (/** @type {number} */ i) => {
    const nid = rungs[i];
    return /** @type {Combatant} */ ({
      nid, npc: npcByNid.get(nid) || {}, standing: num(npcs[nid]?.stock, 0),
      stigma: !!npcs[nid]?.stigma, rungIndex: i, rungCount, grudgeVsDefender: 0, isChallenging: false,
    });
  };

  // ── A SINGLE TOP-DOWN PASS (the three-body dependency §11.4): a challenger's viability is
  // judged against the defender's ALREADY-DECIDED weakened state — the ambitious middle
  // straining at the top (decided first) weakens its own defense, so the patient bottom
  // (decided next) recognises the opening. Intent = window + viability-vs-weakened + the
  // seeded rarity draw; resolution = the sustained margin. Transpositions collected on the
  // ORIGINAL indices, applied at the end. ──
  /** @type {Set<string>} the rung-holders who mounted a challenge (defend weakened) */
  const straining = new Set();
  /** @type {ChallengeEvent[]} */
  const events = [];
  /** @type {Array<{ challengerNid: string, defenderNid: string }>} */
  const grudgeMints = [];
  /** @type {Array<{ nid: string, share: number }>} */
  const withdraws = [];
  /** @type {Array<{ a: number, b: number, win: boolean }>} */
  const transpositions = [];
  for (let i = 1; i < rungCount; i++) {
    const defender = mk(i - 1);
    defender.isChallenging = straining.has(defender.nid); // decided on the earlier iteration
    const windows = openWindows(defender, ctx, freshExposed.has(defender.nid), faithRuptured.has(defender.nid));
    if (!windows.length) continue;
    const challenger = mk(i);
    challenger.grudgeVsDefender = grudgeSevOf(npcs[challenger.nid], defender.nid);
    const cEval = challengeScore(challenger, ctx);
    const dEval = defenseScore(defender, ctx); // WEAKENED if the defender is itself straining
    if (cEval.score < dEval.score) continue;   // hopeless even against the weakened seat
    const margin = dEval.score > 0 ? (cEval.score - dEval.score) / dEval.score : 1;
    const rate = T.CHALLENGE_RATE + T.RATE_MARGIN_GAIN * clamp01(margin);
    if (challengeDraw(seed, tick, fkey, challenger.nid, defender.nid) >= rate) continue; // rare
    straining.add(challenger.nid); // now this challenger's own defense is weakened below
    const win = cEval.score >= dEval.score * T.TURN_MARGIN; // (1) the sustained margin
    if (win) {
      transpositions.push({ a: i - 1, b: i, win: true });
      events.push(evt('rise', challenger, defender, windows, cEval, dEval, nameOf));
    } else {
      // The STAKE (§2): the failed challenger drops one rung (or holds the floor) + a D5
      // grudge hardens the same defender + a standing withdrawal.
      if (i + 1 < rungCount) transpositions.push({ a: i, b: i + 1, win: false });
      grudgeMints.push({ challengerNid: challenger.nid, defenderNid: defender.nid });
      withdraws.push({ nid: challenger.nid, share: T.FAIL_STANDING_WITHDRAW });
      events.push(evt('failed', challenger, defender, windows, cEval, dEval, nameOf));
    }
  }
  if (events.length === 0) return empty;

  // Apply transpositions bottom-up (deduped), bounded by the realm cap on successions.
  const nextRungs = rungs.slice();
  const seen = new Set();
  let successions = 0;
  for (const t of [...transpositions].sort((x, y) => y.a - x.a)) {
    const key = `${t.a}|${t.b}`;
    if (seen.has(key)) continue;
    if (t.win && successions >= realmBudget) continue; // realm cap on displacements
    seen.add(key);
    const tmp = nextRungs[t.a]; nextRungs[t.a] = nextRungs[t.b]; nextRungs[t.b] = tmp;
    if (t.win) successions += 1;
  }
  return { nextRungs, events, grudgeMints, withdraws, successions };
}

/** @param {'rise'|'failed'} kind @param {Combatant} c @param {Combatant} d @param {string[]} windows
 *  @param {{score:number,receipt:Record<string,number>}} cEval @param {{score:number,receipt:Record<string,number>}} dEval
 *  @param {(nid:string)=>string} nameOf @returns {ChallengeEvent} */
function evt(kind, c, d, windows, cEval, dEval, nameOf) {
  return {
    kind, challengerNid: c.nid, defenderNid: d.nid, challengerName: nameOf(c.nid), defenderName: nameOf(d.nid),
    windows, cScore: cEval.score, dScore: dEval.score, cReceipt: cEval.receipt, dReceipt: dEval.receipt,
  };
}

export { clamp, num };
