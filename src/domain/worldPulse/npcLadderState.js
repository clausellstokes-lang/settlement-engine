/**
 * npcLadderState.js — THE LADDER pure state layer (a lazy sibling leaf of
 * npcLadderKernel.js; DESIGN_THE_LADDER.md §1, §5, §11).
 *
 * The tuning tables + the pure, side-effect-free state machinery the ladder mover
 * composes: record normalization/byte-stable sort, first-lit derivation from the
 * existing structural-position indicators, the standing INTEGRATOR (the fabric
 * prominence idiom — decay toward baseline over calendar weeks), and the compact
 * mirror projection. NO rng, NO clock, NO store, NO engine writes — every function is
 * a pure read over its arguments. Split out of the kernel so each file stays a cheap
 * leaf under the domain max-lines ceiling.
 */
import { importanceWeight } from '../entities/npcs.js';
import { npcId } from './npcAgency.js';
import { clamp, clamp01 } from '../../kernel/math.js';
import { slugify } from '../../kernel/slugify.js';

/** @param {unknown} v @param {number} fallback @returns {number} */
export function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
export function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint compare for byte-stable iteration. @param {string} a @param {string} b */
export function compareCodepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
/** @param {number} v @returns {number} */
export function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

// ── Tuning (JUDGMENT tables — say "veto" to retune) ───────────────────────────
//
// STANDING is the fabric-prominence integrator at soul scale: a 0..STAND_MAX stock
// that decays toward STAND_BASELINE over CALENDAR WEEKS (interval-invariant — the
// same pace whether the owner advances by week or by year). A first-lit rung seeds
// ABOVE baseline by its structural height (the defender's-advantage head start §2);
// with no fresh deeds it decays back toward baseline over ~3 years (§8d entrenchment —
// old glory fades, "success plants the fall").
export const LADDER_TUNING = Object.freeze({
  STAND_MAX: 10,
  STAND_BASELINE: 3.0,
  // The top rung seeds at BASELINE + SEED_SPREAD; the floor rung at BASELINE.
  SEED_SPREAD: 3.0,
  // Standing decays toward baseline on this half-life (weeks); ~3 years.
  STAND_HALF_LIFE_WEEKS: 156,
  // A settlement first seen by the lit mover integrates ONE week of decay (its true
  // delta is unknowable at first sight — the fabric FIRST_SIGHT_WEEKS idiom).
  FIRST_SIGHT_WEEKS: 1,
  // Only office-holders hold a rung (importanceWeight ≥ this — notable+; a nameless
  // extra never carries a settlement's court). Mirrors the growth IMPORTANCE_FLOOR.
  RUNG_ELIGIBLE_FLOOR: 0.4,
  // Prune a standing record whose stock has decayed to (essentially) baseline AND
  // carries no goal/stigma/grudge — a spent record drops (byte-identical-dormant).
  PRUNE_EPSILON: 0.05,
  // §10 THE STIGMA MARK + §4e D5 GRUDGES: lifespan-scaled half-lives (weeks, × the
  // settlement's memory-horizon band — years for humans, longer for the long-lived; the
  // npcGrowth decay idiom). A caught schemer climbs at half strength for years.
  STIGMA_HALF_LIFE_WEEKS: 312, // ~6 years base — "a caught schemer climbs at half strength for years"
  GRUDGE_HALF_LIFE_WEEKS: 156, // ~3 years base — grudges are real but fade
  // D-7e THE POSITIVE-BOND SYMMETRY: the grudge structure's TWIN. Same D5-band decay
  // clock (bonds fade like grudges), additive stacking, a bounded cap. loyalty/gratitude/
  // friendship. A bond dies with the standing record (the deliberate succession reset —
  // state-never-fate; NEVER a parallel NPC-pair graph). Absent unless memoryWeave lit AND
  // a bond formed (drop-when-empty ⇒ zero bonds keys when dark — the D-7 contract).
  BOND_HALF_LIFE_WEEKS: 156,   // ~3 years base — a friendship fades like a grudge
  BOND_MINT_SEV: 0.5,          // a formation event deposits half a mark (additive, capped)
  BOND_MAX_SEV: 1.0,           // the bounded cap (a bond cannot exceed a full mark)
  STIGMA_MINT_SEV: 1.0,        // a fresh exposure stamps a full mark (refresh extends)
  // D-2 (design §6): a fresh LIE-exposure mints the SAME stigma shape, sev SCALED by the
  // lie's magnitude band (0..4) with a floor — a band-4 whopper stigmatizes as fully as a
  // corruption exposure; even a small caught lie stings. A caught liar and a caught schemer
  // wear the same mark (both feed revealed_corruption + the STIGMA_CHALLENGE_TAX thereafter).
  LIE_STIGMA_SEV_FLOOR: 0.4,
  MARK_PRUNE_EPSILON: 0.05,
  // §8 THE STANDING LOOP (ladder→faction feedback, single-writer to the mirror):
  // (a) leadership quality → a bounded power modifier; (b) churn instability (a decaying
  // tax on the faction, the fabric half-life idiom); (c) legitimacy-of-the-how modifier.
  LEADERSHIP_GAIN: 0.3,        // quality (−0.5..~+0.5 centred) × this ⇒ ±~0.15 power swing
  POWER_MOD_MIN: 0.85, POWER_MOD_MAX: 1.15,
  INSTABILITY_HALF_LIFE_WEEKS: 104, // churn fades over ~2 years
  CHURN_BUMP: 0.35,            // per contested challenge this advance (win OR fail)
  LEGIT_TAX: 0.12,             // per NORM-BREAKING (leverage/stigma) succession
  LEGIT_MOD_MIN: 0.8,
});

// Ladder length by settlement tier (3–5 rungs; a thorp is a single seat). JUDGMENT.
/** @type {Readonly<Record<string, number>>} */
export const RUNG_CAP_BY_TIER = Object.freeze({
  thorp: 1, hamlet: 2, village: 3, town: 3, city: 4, metropolis: 5,
});
/** @param {string|undefined} tier @returns {number} */
export function rungCapForTier(tier) {
  const cap = RUNG_CAP_BY_TIER[String(tier || '').toLowerCase()];
  return typeof cap === 'number' ? cap : 3;
}

// ── Faction key + membership (the §8 read-side consumer computes the SAME key) ──
/** The faction entry's display NAME across record shapes. REAL powerStructure.factions
 *  records carry the name in `.faction` (rulingStructure.js keys governingName off it, and
 *  the domain accessor rulingPower.nameOf reads `.faction || .name`); the test-fixture /
 *  legacy shape uses `.name`/`.label`. Without the `.faction` arm every real faction
 *  slugified to `fac.unknown` and the ladder merged them into one — THE FACTION-KEY BUG.
 *  Single chokepoint for both the key and the membership match. @param {Record<string, unknown>} f @returns {string} */
function factionName(f) {
  if (typeof f.faction === 'string' && f.faction) return f.faction;
  if (typeof f.name === 'string' && f.name) return f.name;
  if (typeof f.label === 'string' && f.label) return f.label;
  return '';
}
/** The stable ladder key for a faction entry — its own id, else the normalized name
 *  (the generator's `.faction`, else `.name`/`.label`; see factionName).
 *  The read-side power/legitimacy consumer keys its mirror lookup identically.
 *  @param {{ id?: unknown, name?: unknown, faction?: unknown }} faction @returns {string} */
export function ladderFactionKey(faction) {
  const f = asObject(faction);
  const id = f.id;
  if (typeof id === 'string' && id) return id;
  return `fac.${normalizeToken(factionName(f))}`;
}
/** @param {string} value @returns {string} */
function normalizeToken(value) {
  return slugify(value, { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' });
}

/** The NPC's faction handle (the generator's canonical affiliation fields, first present).
 *  @param {Record<string, unknown>} npc @returns {string} */
function npcFactionHandle(npc) {
  for (const key of ['factionAffiliation', 'factionId', 'factionLink', 'faction', 'organizationId']) {
    const v = npc[key];
    if (typeof v === 'string' && v) return v;
  }
  return '';
}
/** Does this NPC belong to the given faction? Matches the generator affiliation handle
 *  (normalized) against the faction name/key, or linkedFactionIds against the faction id.
 *  The faction name is read via factionName (`.faction` on real records, else `.name`).
 *  @param {Record<string, unknown>} npc @param {{ id?: unknown, name?: unknown, faction?: unknown }} faction @param {string} fkey */
export function npcInFaction(npc, faction, fkey) {
  const f = asObject(faction);
  const name = factionName(f);
  const handle = npcFactionHandle(npc);
  if (handle && (normalizeToken(handle) === normalizeToken(name) || handle === f.id || `fac.${normalizeToken(handle)}` === fkey)) return true;
  const linked = Array.isArray(npc.linkedFactionIds) ? npc.linkedFactionIds : [];
  if (typeof f.id === 'string' && f.id && linked.map(String).includes(f.id)) return true;
  return false;
}

/** The structural-rank score of an npc (the generator's dominant/subordinate/minor
 *  indicator; higher = more senior). @param {Record<string, unknown>} npc @returns {number} */
function structuralRankScore(npc) {
  const r = String(npc.structuralRank || npc.structuralPosition || '').toLowerCase();
  if (r === 'dominant') return 2;
  if (r === 'subordinate' || r === 'secondary') return 1;
  return 0;
}

/**
 * The ladder-eligible members of a faction, ORDERED top-rung first, derived from the
 * settlement's roster + existing structural-position indicators (deterministic; no
 * stored migration). Order key (descending): importance weight, dots, structural rank,
 * then npcId codepoint (byte-stable tiebreak). Stasis NPCs and below-floor extras are
 * excluded. Returns [{ npcId, name }].
 * @param {string} sid @param {{ npcs?: unknown }} settlement @param {{ id?: unknown, name?: unknown }} faction
 * @param {string} fkey @returns {Array<{ npcId: string, name: string }>}
 */
export function eligibleMembersOf(sid, settlement, faction, fkey) {
  const npcs = Array.isArray(asObject(settlement).npcs) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).npcs) : [];
  /** @type {Array<{ npcId: string, name: string, w: number, dots: number, rank: number }>} */
  const rows = [];
  npcs.forEach((npc, index) => {
    const n = asObject(npc);
    if (n.stasis) return;
    if (!npcInFaction(n, faction, fkey)) return;
    const w = importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (/** @type {unknown} */ (n)));
    if (w < LADDER_TUNING.RUNG_ELIGIBLE_FLOOR) return;
    const nid = npcId(sid, n, index);
    rows.push({ npcId: nid, name: String(n.name || n.label || nid), w, dots: num(n.dots, 0), rank: structuralRankScore(n) });
  });
  rows.sort((a, b) => (b.w - a.w) || (b.dots - a.dots) || (b.rank - a.rank) || compareCodepoint(a.npcId, b.npcId));
  return rows.map((r) => ({ npcId: r.npcId, name: r.name }));
}

/** The first-lit standing seed for a rung: BASELINE + structural head-start (top rung
 *  the most). @param {number} rungIndex @param {number} rungCount @returns {number} */
export function seedStandingForRung(rungIndex, rungCount) {
  const T = LADDER_TUNING;
  if (rungCount <= 1) return T.STAND_BASELINE + T.SEED_SPREAD; // a lone seat sits high
  const height = (rungCount - 1 - rungIndex) / (rungCount - 1); // 1 at top, 0 at floor
  return T.STAND_BASELINE + T.SEED_SPREAD * clamp01(height);
}

/** Decay a standing stock toward BASELINE over elapsed weeks (the integrator's slow
 *  reversion — old glory fades). PURE. @param {number} stock @param {number} deltaWeeks @returns {number} */
export function decayStandingTowardBaseline(stock, deltaWeeks) {
  const T = LADDER_TUNING;
  const base = T.STAND_BASELINE;
  if (!(deltaWeeks > 0)) return stock;
  const factor = Math.pow(0.5, deltaWeeks / Math.max(1, T.STAND_HALF_LIFE_WEEKS));
  return base + (stock - base) * factor;
}

/** Lifespan-scaled exponential decay of a mark severity over elapsed weeks (the npcGrowth
 *  D5-band idiom — Infinity band ⇒ no time decay). PURE.
 *  @param {number} sev @param {number} deltaWeeks @param {number} halfLife @param {number} bandMult @returns {number} */
function decayMark(sev, deltaWeeks, halfLife, bandMult) {
  if (!(sev > 0) || !(deltaWeeks > 0)) return sev;
  if (!Number.isFinite(bandMult)) return sev; // undying ⇒ the mark never fades
  return sev * Math.pow(0.5, deltaWeeks / Math.max(1, halfLife * bandMult));
}

/**
 * Maintain a standing record's MARKS across an advance (§10 stigma + §4e D5 grudges):
 * decay both on their lifespan-scaled clocks (band-scaled), then detect a FRESH corruption
 * exposure (timesExposed bumped or newly ousted vs the last-seen values) and mint/refresh
 * the stigma mark. Returns the updated standing + whether a fresh exposure fired this
 * advance (the widest challenge window §2 + the §10 tax trigger). PURE.
 * D-2 (design §6): `lieExposure` is the ladder-consumed deposit ({tick, band}, already
 * filtered by npcCredibility.freshLieExposureFor for the one-tick lag + the since check). When
 * present, a fresh lie-exposure mints/refreshes the SAME stigma (sev band-scaled), stamps
 * lastLieSeen (consume-once), and reports freshLieExposed (the exposed_liar window). A
 * REPUTATION cost, never a fate (§0.5): the NPC keeps his rung, marked.
 * @param {import('./npcLadderKernel.js').LadderStanding} st @param {Record<string, unknown>} npc
 * @param {number} bandMult @param {number} weeks @param {number} tick
 * @param {{ tick: number, band: number } | null} [lieExposure]
 * @returns {{ st: import('./npcLadderKernel.js').LadderStanding, freshExposed: boolean, freshLieExposed: boolean }}
 */
export function maintainMarks(st, npc, bandMult, weeks, tick, lieExposure = null) {
  const T = LADDER_TUNING;
  // Decay stigma + grudges on their band-scaled clocks; prune spent marks.
  let stigma = st.stigma;
  if (stigma) {
    const sev = round4(decayMark(stigma.sev, Math.max(0, weeks - stigma.week), T.STIGMA_HALF_LIFE_WEEKS, bandMult));
    stigma = sev >= T.MARK_PRUNE_EPSILON ? { sev, week: weeks, tick: stigma.tick } : null;
  }
  /** @type {Record<string, import('./npcLadderKernel.js').LadderGrudge>} */
  const grudges = {};
  for (const k of Object.keys(st.grudges).sort(compareCodepoint)) {
    const g = st.grudges[k];
    const sev = round4(decayMark(g.sev, Math.max(0, weeks - g.week), T.GRUDGE_HALF_LIFE_WEEKS, bandMult));
    if (sev >= T.MARK_PRUNE_EPSILON) grudges[k] = { sev, week: weeks };
  }
  // Fresh exposure detection: the corruption mirror bumps timesExposed / sets ousted.
  const exposedNow = Math.floor(num(npc.timesExposed, 0));
  const oustedNow = npc.ousted === true;
  const first = st.lastExposed === undefined;
  const freshExposed = !first && (exposedNow > num(st.lastExposed, 0) || (oustedNow && st.wasOusted !== true));
  if (freshExposed) {
    // Mint or REFRESH+extend the stigma mark (§10 second-exposure refreshes).
    stigma = { sev: T.STIGMA_MINT_SEV, week: weeks, tick: Math.floor(tick) };
  }
  // D-2 THE LIE-STIGMA (deposit-and-consume, one tick after exposure): mint/refresh the same
  // stigma shape, sev SCALED by the lie's magnitude band, keeping the STRONGER mark if a
  // corruption exposure also fired this tick. Stamp lastLieSeen so the deposit fires once.
  let freshLieExposed = false;
  let lastLieSeen = st.lastLieSeen;
  if (lieExposure && typeof lieExposure === 'object') {
    const band = clamp(Math.round(num(lieExposure.band, 0)), 0, 4);
    const lieSev = clamp01(T.LIE_STIGMA_SEV_FLOOR + (1 - T.LIE_STIGMA_SEV_FLOOR) * (band / 4));
    const sev = round4(stigma ? Math.max(stigma.sev, lieSev) : lieSev);
    stigma = { sev, week: weeks, tick: Math.floor(tick) };
    lastLieSeen = Math.floor(num(lieExposure.tick, tick));
    freshLieExposed = true;
  }
  // D-7e: decay the POSITIVE bonds on the same band-scaled clock (only when present —
  // a dark / bond-free record carries no bonds field, so none is created here). Prune
  // spent bonds; the field itself drops when the last bond fades (drop-when-empty).
  /** @type {Record<string, import('./npcLadderKernel.js').LadderBond>|undefined} */
  let bonds;
  if (st.bonds && typeof st.bonds === 'object') {
    /** @type {Record<string, import('./npcLadderKernel.js').LadderBond>} */
    const next = {};
    for (const k of Object.keys(st.bonds).sort(compareCodepoint)) {
      const b = st.bonds[k];
      const sev = round4(decayMark(b.sev, Math.max(0, weeks - b.week), T.BOND_HALF_LIFE_WEEKS, bandMult));
      if (sev >= T.MARK_PRUNE_EPSILON) next[k] = { sev, week: weeks, kind: b.kind };
    }
    if (Object.keys(next).length) bonds = next;
  }
  /** @type {import('./npcLadderKernel.js').LadderStanding} */
  const nextSt = { ...st, stigma, grudges, lastExposed: exposedNow, wasOusted: oustedNow };
  if (bonds) nextSt.bonds = bonds; else delete nextSt.bonds;
  if (lastLieSeen !== undefined) nextSt.lastLieSeen = lastLieSeen;
  return { st: nextSt, freshExposed, freshLieExposed };
}

// ── Record normalization (defensive reads of the persisted shape) ─────────────
/** @param {unknown} v @param {number} weeks @returns {import('./npcLadderKernel.js').LadderStanding} */
export function normalizeStanding(v, weeks) {
  const o = asObject(v);
  /** @type {import('./npcLadderKernel.js').LadderStanding} */
  const st = {
    stock: clamp(num(o.stock, LADDER_TUNING.STAND_BASELINE), 0, LADDER_TUNING.STAND_MAX),
    since: num(o.since, weeks),
    week: num(o.week, weeks),
    goal: normalizeGoal(o.goal),
    stigma: normalizeStigma(o.stigma),
    grudges: normalizeGrudges(o.grudges),
  };
  if (typeof o.lastExposed === 'number' && Number.isFinite(o.lastExposed)) st.lastExposed = Math.floor(o.lastExposed);
  if (o.wasOusted === true) st.wasOusted = true;
  // D-2: the last lie-exposure tick the ladder already stigmatized (consume-once). Additive-
  // optional — absent on legacy records ⇒ a stale deposit re-fires once, then latches.
  if (typeof o.lastLieSeen === 'number' && Number.isFinite(o.lastLieSeen)) st.lastLieSeen = Math.floor(o.lastLieSeen);
  // D-7e: the positive bonds — additive-optional (absent on legacy / dark records ⇒ no key).
  const bonds = normalizeBonds(o.bonds);
  if (Object.keys(bonds).length) st.bonds = bonds;
  return st;
}
/** @param {unknown} v @returns {import('./npcLadderKernel.js').LadderGoal|null} */
function normalizeGoal(v) {
  const o = asObject(v);
  if (!o.condition || typeof o.condition !== 'object') return null;
  return {
    condition: /** @type {import('../autonomy/stopConditions.js').StopCondition} */ (o.condition),
    stakes: round4(num(o.stakes, 0)),
    horizonWeeks: Math.max(1, Math.floor(num(o.horizonWeeks, 1))),
    mintedWeek: num(o.mintedWeek, 0),
    mintedRung: Math.floor(num(o.mintedRung, 0)),
    startScore: round4(num(o.startScore, 0)),
    progress: round4(clamp01(num(o.progress, 0))),
    basis: typeof o.basis === 'string' ? o.basis : '',
  };
}
/** @param {unknown} v @returns {import('./npcLadderKernel.js').LadderStigma|null} */
function normalizeStigma(v) {
  const o = asObject(v);
  const sev = num(o.sev, 0);
  if (!(sev > 0)) return null;
  return { sev: round4(clamp01(sev)), week: num(o.week, 0), tick: Math.floor(num(o.tick, 0)) };
}
/** @param {unknown} v @returns {Record<string, import('./npcLadderKernel.js').LadderGrudge>} */
function normalizeGrudges(v) {
  const o = asObject(v);
  /** @type {Record<string, import('./npcLadderKernel.js').LadderGrudge>} */
  const out = {};
  for (const key of Object.keys(o).sort(compareCodepoint)) {
    const g = asObject(o[key]);
    const sev = num(g.sev, 0);
    if (sev > 0) out[key] = { sev: round4(clamp01(sev)), week: num(g.week, 0) };
  }
  return out;
}
// ── D-7e THE PERSON BONDS (the grudge twin; loyalty / gratitude / friendship) ──
/** The three positive-bond kinds — the grudge's mirror image. @type {ReadonlySet<string>} */
export const BOND_KINDS = Object.freeze(new Set(['loyalty', 'gratitude', 'friendship']));

/** Normalize a persisted bonds map (defensive; drop-when-invalid). Each entry is
 *  {sev, week, kind∈BOND_KINDS}; a bad kind coerces to 'friendship' (the generic tie).
 *  @param {unknown} v @returns {Record<string, import('./npcLadderKernel.js').LadderBond>} */
export function normalizeBonds(v) {
  const o = asObject(v);
  /** @type {Record<string, import('./npcLadderKernel.js').LadderBond>} */
  const out = {};
  for (const key of Object.keys(o).sort(compareCodepoint)) {
    const b = asObject(o[key]);
    const sev = num(b.sev, 0);
    if (sev > 0) {
      const kind = typeof b.kind === 'string' && BOND_KINDS.has(b.kind) ? b.kind : 'friendship';
      out[key] = { sev: round4(clamp01(sev)), week: num(b.week, 0), kind };
    }
  }
  return out;
}

/** Deposit a bond of `kind` toward `otherNid` into a bonds map (a NEW map — never mutate).
 *  ADDITIVE stacking on sev, bounded by BOND_MAX_SEV; the latest formation sets the kind
 *  (a gratitude event over a loyalty tie reads as gratitude now). The caller has gated on
 *  memoryWeaveActive. Pure. @param {Record<string, import('./npcLadderKernel.js').LadderBond>|undefined} bonds
 *  @param {string} otherNid @param {string} kind @param {number} addSev @param {number} weeks
 *  @returns {Record<string, import('./npcLadderKernel.js').LadderBond>} */
export function mintBond(bonds, otherNid, kind, addSev, weeks) {
  const T = LADDER_TUNING;
  const cur = asObject(bonds);
  const prior = asObject(cur[otherNid]);
  const priorSev = num(prior.sev, 0);
  const sev = round4(clamp(priorSev + Math.max(0, num(addSev, 0)), 0, T.BOND_MAX_SEV));
  const k = typeof kind === 'string' && BOND_KINDS.has(kind) ? kind : 'friendship';
  return { ...cur, [otherNid]: { sev, week: weeks, kind: k } };
}

/** The bond severity toward a specific NPC (0 when none). @param {import('./npcLadderKernel.js').LadderStanding|null|undefined} st
 *  @param {string} otherNid @returns {number} */
export function bondSevToward(st, otherNid) {
  const b = st && st.bonds ? st.bonds[otherNid] : null;
  return b ? num(b.sev, 0) : 0;
}

/** The strongest bond a standing holds ({ nid, sev, kind } | null) — the D-4f support-goal
 *  patron pick / the generosity give-side read. @param {import('./npcLadderKernel.js').LadderStanding|null|undefined} st
 *  @returns {{ nid: string, sev: number, kind: string }|null} */
export function strongestBond(st) {
  const bonds = st && st.bonds ? st.bonds : null;
  if (!bonds) return null;
  /** @type {{ nid: string, sev: number, kind: string }|null} */
  let best = null;
  for (const nid of Object.keys(bonds).sort(compareCodepoint)) {
    const b = bonds[nid];
    if (!best || b.sev > best.sev) best = { nid, sev: b.sev, kind: b.kind };
  }
  return best;
}

/** @param {unknown} v @returns {import('./npcLadderKernel.js').LadderFactionRec} */
export function normalizeFactionRec(v) {
  const o = asObject(v);
  const rungs = Array.isArray(o.rungs) ? o.rungs.filter((r) => typeof r === 'string' && r).map(String) : [];
  return {
    rungs, cooldownUntil: Math.floor(num(o.cooldownUntil, 0)), lastPower: num(o.lastPower, 0),
    instability: clamp01(num(o.instability, 0)), week: num(o.week, 0),
  };
}
/** @param {unknown} v @param {number} weeks @returns {import('./npcLadderKernel.js').LadderRecord} */
export function normalizeRecord(v, weeks) {
  const o = asObject(v);
  /** @type {Record<string, import('./npcLadderKernel.js').LadderFactionRec>} */
  const factions = {};
  const rawF = asObject(o.factions);
  for (const fkey of Object.keys(rawF)) factions[fkey] = normalizeFactionRec(rawF[fkey]);
  /** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */
  const npcs = {};
  const rawN = asObject(o.npcs);
  for (const nid of Object.keys(rawN)) npcs[nid] = normalizeStanding(rawN[nid], weeks);
  return { factions, npcs };
}

// ── Byte-stable persistence (codepoint-sorted, drop-when-empty) ───────────────
/** @param {import('./npcLadderKernel.js').LadderStanding} st @returns {Record<string, unknown>} */
function sortedStanding(st) {
  /** @type {Record<string, unknown>} */
  const out = { since: st.since, stock: round4(st.stock), week: st.week };
  if (st.goal) {
    out.goal = {
      basis: st.goal.basis, condition: st.goal.condition, horizonWeeks: st.goal.horizonWeeks,
      mintedRung: st.goal.mintedRung, mintedWeek: st.goal.mintedWeek, progress: st.goal.progress,
      stakes: st.goal.stakes, startScore: st.goal.startScore,
    };
  }
  if (st.stigma) out.stigma = { sev: st.stigma.sev, tick: st.stigma.tick, week: st.stigma.week };
  const gk = Object.keys(st.grudges).sort(compareCodepoint);
  if (gk.length) {
    /** @type {Record<string, unknown>} */
    const g = {};
    for (const k of gk) g[k] = { sev: st.grudges[k].sev, week: st.grudges[k].week };
    out.grudges = g;
  }
  if (typeof st.lastExposed === 'number' && st.lastExposed > 0) out.lastExposed = st.lastExposed;
  if (st.wasOusted === true) out.wasOusted = true;
  if (typeof st.lastLieSeen === 'number' && st.lastLieSeen > 0) out.lastLieSeen = st.lastLieSeen; // D-2 consume-once
  // D-7e: persist bonds ONLY when non-empty (drop-when-empty ⇒ zero bonds keys when dark).
  if (st.bonds) {
    const bk = Object.keys(st.bonds).sort(compareCodepoint);
    if (bk.length) {
      /** @type {Record<string, unknown>} */
      const b = {};
      for (const k of bk) b[k] = { kind: st.bonds[k].kind, sev: st.bonds[k].sev, week: st.bonds[k].week };
      out.bonds = b;
    }
  }
  return out;
}
/** The codepoint-sorted persisted record (byte-stable serialization). Empty ⇒ null so an
 *  emptied settlement drops its key (byte-identical to never-lit).
 *  @param {import('./npcLadderKernel.js').LadderRecord} rec @returns {Record<string, unknown>|null} */
export function sortedRecord(rec) {
  /** @type {Record<string, unknown>} */
  const factions = {};
  for (const fkey of Object.keys(rec.factions).sort(compareCodepoint)) {
    const f = rec.factions[fkey];
    if (!f.rungs.length && !(f.cooldownUntil > 0) && !(f.lastPower > 0) && !(f.instability > 0)) continue;
    /** @type {Record<string, unknown>} */
    const fr = { rungs: f.rungs };
    if (f.cooldownUntil > 0) fr.cooldownUntil = f.cooldownUntil;
    if (f.lastPower > 0) fr.lastPower = round4(f.lastPower);
    if (f.instability > 0) { fr.instability = round4(f.instability); fr.week = f.week; }
    factions[fkey] = fr;
  }
  /** @type {Record<string, unknown>} */
  const npcs = {};
  for (const nid of Object.keys(rec.npcs).sort(compareCodepoint)) {
    npcs[nid] = sortedStanding(rec.npcs[nid]);
  }
  const hasF = Object.keys(factions).length > 0;
  const hasN = Object.keys(npcs).length > 0;
  if (!hasF && !hasN) return null;
  /** @type {Record<string, unknown>} */
  const out = {};
  if (hasF) out.factions = factions;
  if (hasN) out.npcs = npcs;
  return out;
}

// ── The compact settlement mirror (what ladderRead consumes) ──────────────────
/** Project the authoritative record onto the compact NON-core mirror. Per faction:
 *  ordered rungs with standing normalized 0..1; the §8 modifiers ride ONLY when non-
 *  neutral (absent ⇒ the read coalesces to null/0 ⇒ byte-identical dark). The per-NPC
 *  goal display stock rides when a goal is minted.
 *  @param {import('./npcLadderKernel.js').LadderRecord} rec
 *  @param {Map<string, string>} nameByNid @param {Map<string, {power: number, legit: number, instab: number}>} modByFkey
 *  @returns {Record<string, unknown>|null} */
export function mirrorOf(rec, nameByNid, modByFkey) {
  const T = LADDER_TUNING;
  /** @type {Record<string, unknown>} */
  const factions = {};
  for (const fkey of Object.keys(rec.factions).sort(compareCodepoint)) {
    const f = rec.factions[fkey];
    if (!f.rungs.length) continue;
    const rungs = f.rungs.map((nid) => ({
      npcId: nid,
      name: nameByNid.get(nid) || nid,
      standing: round4(clamp01(num(rec.npcs[nid]?.stock, T.STAND_BASELINE) / T.STAND_MAX)),
    }));
    /** @type {Record<string, unknown>} */
    const fr = { rungs };
    const mod = modByFkey.get(fkey);
    if (mod && mod.power !== 1) fr.powerModifier = round4(mod.power);
    if (mod && mod.legit !== 1) fr.legitimacyModifier = round4(mod.legit);
    if (mod && mod.instab > 0) fr.instability = round4(clamp01(mod.instab));
    factions[fkey] = fr;
  }
  /** @type {Record<string, unknown>} */
  const goals = {};
  for (const nid of Object.keys(rec.npcs).sort(compareCodepoint)) {
    const st = rec.npcs[nid];
    if (!st.goal) continue;
    goals[nid] = { rung: st.goal.mintedRung, goal: st.goal.basis, stakes: round4(st.goal.stakes) };
  }
  const hasF = Object.keys(factions).length > 0;
  if (!hasF) return null;
  /** @type {Record<string, unknown>} */
  const out = { factions };
  if (Object.keys(goals).length) out.goals = goals;
  return out;
}
