/**
 * npcGrowthKernel.js — THE GROWTH LAYER (owner commission, task #36; the D7 pattern at
 * person scale — core frozen, growth derived).
 *
 * Owner verbatim (COMPREHENSIVE_REVIEW_PROGRAM.md @ 910d9b5d): core traits/flaws are
 * "their constitutional core as people ... they can also have learned or temporary traits
 * ... bold by nature being more cautious after losing several battles ... traits or flaws
 * further from their core personality should need more frequent or more severe events ...
 * they should all reflect in that NPC's decision making, stances, and goals."
 *
 * THE ARCHITECTURE (the D3 course machinery — momentum.js — at PERSON scale):
 *   • ACQUISITION IS A DEPOSIT LEDGER. `spatialLedgers.npcGrowth`, keyed by the canonical
 *     npcId (npcAgency.npcId — the SAME key npcStates uses, so roleArchetype joins). Per
 *     NPC, per candidate trait: a decaying STOCK of weighted experience. DEPOSITS ARE
 *     READS, NOT ROLLS (momentum's stream-position law): the durable POST-apply outcomes
 *     already in state — a fresh calamity, a live bust, a besieging front, a revealed
 *     betrayal, a boom, a golden age — deposit deterministically each tick. NO rng.
 *   • THRESHOLD-CROSSING MINTS a RARE STICKY trait (hysteresis: MINT_CLIFF to enter,
 *     RELINQUISH_FLOOR < MINT_CLIFF to shed — no oscillation), capped at MAX_ACQUIRED per
 *     soul. BOTH SIGNS: an unreinforced trait's stock DECAYS and, below the floor, sheds.
 *   • THE DECAY IS D5-BAND-SCALED (relationshipEvolution memory horizons): the half-life
 *     multiplies by the NPC's settlement memoryHorizon band — an elf-long / undying court's
 *     acquired caution outlives a human's (generational band ⇒ ×1 ⇒ the base clock).
 *   • THE DISTANCE-FROM-CORE RULE: a candidate FAR from the soul's constitutional core (its
 *     authored dominant/flaw/modifier) RESISTS — its deposits are divided by a resistance
 *     that grows with the opposition distance on the EXISTING signed trait axes. "Traits or
 *     flaws further from their core personality ... need more frequent or more severe
 *     events" (owner, binding).
 *
 * EFFECTS = OVERLAYS, NEVER CORE MUTATION (state-never-fate: the engine WEATHERS a person,
 * never rewrites them). The core fields (personality.{dominant,flaw,modifier}) are NEVER
 * written. Minted traits are MIRRORED onto a NON-core `npc.acquiredTraits[]` field (the
 * corruption `mirrorCorruptionOntoSettlement` idiom — authoritative state in the ledger,
 * projected onto the roster). The existing consumer reads (corruption npcAlignmentScore,
 * disposition aggression/conscience, momentum commitment cliff — data/npcTraitWeights
 * acquiredTraitDescriptors extends each extractor) then read core + overlay. The overlay is
 * self-healing: re-projected from the ledger every tick, so no NPC-object rebuild can ghost
 * it (the write-survives-one-path bug class is structurally impossible — the ledger is the
 * single source of truth).
 *
 * THE DORMANCY GATE (constitutional): behind the VIRTUAL npcGrowthEnabled flag (ABSENT from
 * DEFAULT_SIMULATION_RULES — the upswingArcsEnabled precedent). Absent ⇒ an immediate no-op:
 * zero deposits, zero ledger keys, zero mirror, byte-identical (the growth dormancy golden
 * proves it). Every acquiredTraitDescriptors read returns [] when the field is absent, so
 * the overlay is inert dark.
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse engine
 * (pulseKernel, at the mover seam). Never from the first-paint entry closure. The signed
 * weight maps it reads (TRAIT_ALIGNMENT/AGGRESSION) are the light npcTraitWeights leaf.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 *
 * Pure, deterministic, side-effect-free. AGGREGATE of durable state → per-soul overlay;
 * never a named soul's FATE.
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { TRAIT_ALIGNMENT, TRAIT_AGGRESSION } from '../../data/npcTraitWeights.js';
import { memoryHorizonMultiplierOf } from './relationshipEvolution.js';
import { importanceWeight } from '../entities/npcs.js';
import { npcId } from './npcAgency.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ id?: string, name?: string, label?: string, role?: string, title?: string,
 *   description?: string, importance?: string, notability?: number, dots?: number,
 *   personality?: unknown, corrupt?: boolean, ousted?: boolean, acquiredTraits?: unknown,
 *   corruptTies?: { revealed?: boolean } }} GrowthNpc */
/** @typedef {{ type?: string, year?: number, tick?: number }} GrowthCalStamp */
/** @typedef {{ archetype?: string }} GrowthCondition */
/** @typedef {{ name?: string, npcs?: GrowthNpc[], calamityHistory?: GrowthCalStamp[],
 *   activeConditions?: GrowthCondition[] }} GrowthSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: GrowthSettlement }} GrowthSnapItem */
/** @typedef {{ settlements?: GrowthSnapItem[] }} GrowthSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: GrowthSettlement }} GrowthUpdate */
/** @typedef {{ tick: number, signal: string, mag: number }} GrowthReceipt */
/** @typedef {{ stock: number, sinceTick: number, lastDepositTick: number,
 *   minted: boolean, mintedAt: number, deposits: GrowthReceipt[] }} GrowthCandidate */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint compare for byte-stable iteration. @param {string} a @param {string} b */
function compareCodepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
/** @param {number} v @returns {number} */
function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

// ── THE DORMANCY GATE (constitutional) — a virtual, defensively-read flag ──────
/**
 * Is the growth layer LIT? Reads simulationRules.npcGrowthEnabled === true, defensively —
 * ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never even entered (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors upswingArcsActive. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function npcGrowthActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).npcGrowthEnabled === true);
}

// ── THE DEPOSIT MAP (JUDGMENT — say "veto" to retune) ─────────────────────────
//
// Each row maps an EXISTING durable POST-apply outcome type to a bank-vocabulary CANDIDATE
// trait, a DOMAIN (which office-holder role weathers it most), and a LOUDNESS (per-tick
// deposit magnitude, momentum's "loudness is the measure" idiom — soak-tunable). EVERY
// candidate trait is a bank personality word AND carries a signed weight in ≥1 existing
// consumer map (TRAIT_ALIGNMENT ∪ TRAIT_AGGRESSION ∪ TRAIT_MOMENTUM), so a minted trait is
// GUARANTEED readable by ≥1 consumer (the no-dead-facet law — asserted by the growth walker
// pin). DEPOSITS ARE READS: a signal PRESENT this tick deposits; "several battles" is the
// SAME signal read over several ticks accumulating stock past the mint cliff.
//
//   owner anchor         durable signal (existing type)        → candidate  domain
//   ─────────────────────────────────────────────────────────────────────────────────
//   defeats→cautious     a fresh calamity stamp                → cautious   civic
//   defeats→cautious     an active `bust` condition            → cautious   civic
//   defeats→cautious     a war front pointing INTO the town    → cautious   military
//   endured / hardened   `siege_lifted`/`occupation_lifted`    → tenacious  military
//   perseverance         an active `reconstruction` condition  → tenacious  civic
//   betrayals→distrust   a revealed-corrupt / ousted insider   → cynical    ruler
//   triumphs→proud       an active `boom` condition            → proud      ruler
//   triumphs→proud       an active `flourishing` condition     → proud      ruler
//
// DOMAIN routing: a signal's candidate deposits at FULL loudness to office-holders whose
// roleArchetype matches the domain (military signals → military roles), and at
// DOMAIN_OFF_MULT to the rest (everyone lived through it, the leader most). 'civic'/'ruler'
// signals treat ruler/civic/heir as the matched domain. When npcStates is dark (no
// roleArchetype), every office-holder is treated as matched (domain-agnostic fallback).
/** @type {ReadonlyArray<{ signal: string, trait: string, domain: string, loud: number }>} */
export const GROWTH_DEPOSIT_MAP = Object.freeze([
  { signal: 'calamity',       trait: 'cautious',  domain: 'civic',    loud: 0.55 },
  { signal: 'bust',           trait: 'cautious',  domain: 'civic',    loud: 0.45 },
  { signal: 'besieged',       trait: 'cautious',  domain: 'military', loud: 0.60 },
  { signal: 'siege_survived', trait: 'tenacious', domain: 'military', loud: 0.55 },
  { signal: 'reconstruction', trait: 'tenacious', domain: 'civic',    loud: 0.35 },
  { signal: 'betrayal',       trait: 'cynical',   domain: 'ruler',    loud: 0.50 },
  { signal: 'boom',           trait: 'proud',     domain: 'ruler',    loud: 0.40 },
  { signal: 'flourishing',    trait: 'proud',     domain: 'ruler',    loud: 0.45 },
]);

/** The bounded mintable vocabulary (the deposit map's candidate traits). Every entry is a
 *  bank word carrying a signed weight in ≥1 consumer map. @type {readonly string[]} */
export const ACQUIRED_TRAIT_VOCAB = Object.freeze([...new Set(GROWTH_DEPOSIT_MAP.map((r) => r.trait))].sort());

/** Which roleArchetypes a domain treats as "matched" (full loudness). */
const DOMAIN_ROLES = Object.freeze({
  military: new Set(['military']),
  civic: new Set(['ruler', 'civic', 'heir']),
  ruler: new Set(['ruler', 'civic', 'heir']),
});

// ── Tuning (documented; owner-retunable in the checkpoint soaks) ──────────────
export const GROWTH_TUNING = Object.freeze({
  // The base generational half-life (ticks) of an acquired trait's stock — D5-band-scaled
  // per NPC. 52 ≈ a game-year at one-week ticks (relationshipEvolution's clock). A long /
  // undying court multiplies this (their caution outlives a human's).
  HALF_LIFE_TICKS: 52,
  // Past this age with no reinforcement the stock is spent (prune ⇒ byte-identical-dormant).
  MAX_LOOKBACK_TICKS: 312,
  // Stock saturation + the per-deposit scale.
  STOCK_MAX: 12,
  DEPOSIT_SCALE: 1.0,
  // MINT / SHED hysteresis (design: rare, sticky, both signs). A candidate MINTS at/above
  // MINT_CLIFF; a minted trait SHEDS below RELINQUISH_FLOOR — the gap is the hysteresis band
  // that keeps a trait off the oscillation boundary.
  MINT_CLIFF: 6,
  RELINQUISH_FLOOR: 3,
  // Prune a candidate whose decayed stock falls below this (forgotten ⇒ dropped ⇒
  // byte-identical). Below the relinquish floor so a shed trait's dwindling stock still
  // lingers as sub-threshold memory (a re-acquisition is faster the second time).
  PRUNE_EPSILON: 0.05,
  // Cap concurrent MINTED traits per soul (rare, sticky). Over cap ⇒ only the strongest mint.
  MAX_ACQUIRED: 3,
  // THE DISTANCE-FROM-CORE resistance: a candidate at maximal opposition to the core divides
  // its deposit by (1 + RESIST_SCALE). At zero opposition the deposit is undivided.
  RESIST_SCALE: 2.0,
  // Off-domain deposit multiplier (an office-holder outside the signal's domain still
  // weathers it, but less).
  DOMAIN_OFF_MULT: 0.35,
  // The office-holder importance floor (only leaders acquire — a nameless extra does not
  // carry a settlement's fate). Mirrors importanceWeight bands.
  IMPORTANCE_FLOOR: 0.5,
  // The capped typed deposit-receipt list length (the provenance the chronicle narrates).
  RECEIPT_CAP: 8,
  // A fresh calamity within this many years is a live hardship deposit.
  CALAMITY_WINDOW_YEARS: 2,
});

// ── THE OPPOSITION METRIC (JUDGMENT — say "veto") ─────────────────────────────
//
// "Distance from core" over the EXISTING signed trait axes (bank-derivable, no new
// vocabulary): each trait is a 2-vector (TRAIT_ALIGNMENT, TRAIT_AGGRESSION); an absent key
// is 0 (the neutral anchor). The soul's CORE vector is the mean of its authored
// dominant/flaw/modifier vectors. opposition01 = the Euclidean distance between the
// candidate and the core, normalized by the axis diagonal (max ≈ 2√2). A compassionate core
// acquiring cruelty is maximally opposed (resists hardest); a ruthless core acquiring
// cautious is near (resists little). PURE.
const OPP_MAX_DIST = Math.sqrt(2 * 2 + 2 * 2); // both axes span [-1,1] ⇒ diagonal 2√2

/** The signed 2-vector for a trait descriptor (absent ⇒ [0,0]). @param {string} trait */
function traitVector(trait) {
  const key = String(trait).trim().toLowerCase();
  const a = /** @type {Record<string, number>} */ (TRAIT_ALIGNMENT)[key];
  const g = /** @type {Record<string, number>} */ (TRAIT_AGGRESSION)[key];
  return [Number.isFinite(a) ? a : 0, Number.isFinite(g) ? g : 0];
}

/** The authored core-trait descriptors of an NPC ([dominant, flaw, modifier]; string/array
 *  tolerant — the corruption/disposition/momentum extractor shape). Reads AUTHORED core
 *  ONLY (never the acquired overlay — resistance is measured against the constitutional
 *  core). @param {GrowthNpc} npc @returns {string[]} */
function coreTraits(npc) {
  const p = npc && npc.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  const o = asObject(p);
  return [o.dominant, o.flaw, o.modifier].filter((x) => typeof x === 'string').map(String);
}

/** opposition01(candidate, npc): 0 (candidate sits on the core) .. 1 (maximally opposed).
 *  A core with no scoring traits ⇒ the neutral anchor [0,0] ⇒ distance = |candidate|. PURE.
 *  @param {string} trait @param {GrowthNpc} npc @returns {number} */
export function oppositionOf(trait, npc) {
  const core = coreTraits(npc);
  let cx = 0;
  let cy = 0;
  let n = 0;
  for (const t of core) {
    const [a, g] = traitVector(t);
    if (a === 0 && g === 0) continue;
    cx += a; cy += g; n += 1;
  }
  if (n > 0) { cx /= n; cy /= n; }
  const [tx, ty] = traitVector(trait);
  const d = Math.sqrt((tx - cx) * (tx - cx) + (ty - cy) * (ty - cy));
  return clamp01(d / OPP_MAX_DIST);
}

/** The resistance divisor for a candidate on an NPC: 1 (near core) .. 1+RESIST_SCALE (far).
 *  @param {string} trait @param {GrowthNpc} npc @returns {number} */
function resistanceOf(trait, npc) {
  return 1 + GROWTH_TUNING.RESIST_SCALE * oppositionOf(trait, npc);
}

// ── The decayed stock (D5-band-scaled half-life) ──────────────────────────────
/** The candidate's decayed stock as of `tick`, its half-life multiplied by the settlement's
 *  memory-horizon band (generational ⇒ ×1 ⇒ the base clock; undying ⇒ Infinity ⇒ no time
 *  decay). Past MAX_LOOKBACK (band-scaled) the stock is spent (0). PURE.
 *  @param {GrowthCandidate} cand @param {number} tick @param {number} bandMult @returns {number} */
function decayedStock(cand, tick, bandMult) {
  const stock = num(cand.stock, 0);
  if (stock <= 0) return 0;
  const age = Math.max(0, Math.floor(tick) - Math.floor(num(cand.lastDepositTick, tick)));
  if (!Number.isFinite(bandMult)) return stock; // undying ⇒ no time decay
  const halfLife = Math.max(1, GROWTH_TUNING.HALF_LIFE_TICKS * bandMult);
  if (age > GROWTH_TUNING.MAX_LOOKBACK_TICKS * bandMult) return 0;
  return stock * Math.pow(0.5, age / halfLife);
}

// ── Durable-signal reads (all pure over the freshest settlement + worldState) ──
/** Fresh calamity within the window? @param {GrowthSettlement} s @param {number} year */
function hasRecentCalamity(s, year) {
  const hist = Array.isArray(s?.calamityHistory) ? s.calamityHistory : [];
  for (const st of hist) {
    const y = num(st?.year, -Infinity);
    if (Number.isFinite(y) && (year - y) >= 0 && (year - y) <= GROWTH_TUNING.CALAMITY_WINDOW_YEARS) return true;
  }
  return false;
}
/** Does the settlement carry an active condition of the given archetype? */
function hasCondition(/** @type {GrowthSettlement} */ s, /** @type {string} */ archetype) {
  const conds = Array.isArray(s?.activeConditions) ? s.activeConditions : [];
  return conds.some((c) => c?.archetype === archetype);
}
/** Is a betrayal legible in the roster — a revealed-corrupt or ousted insider? */
function hasBetrayal(/** @type {GrowthSettlement} */ s) {
  const npcs = Array.isArray(s?.npcs) ? s.npcs : [];
  return npcs.some((n) => (n?.corrupt === true && n?.corruptTies?.revealed === true) || n?.ousted === true);
}
/** Is a war front pointing INTO this settlement (besieged)? Reads the regional graph's war
 *  edges. Dormancy-safe: with the war layer dark there are no war edges ⇒ false.
 *  @param {{ edges?: unknown[] }|null|undefined} graph @param {string} id @returns {boolean} */
function isBesieged(graph, id) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  for (const e of edges) {
    const edge = asObject(e);
    if (String(edge.relationshipType || '') !== 'war') continue;
    if (String(edge.to ?? '') === id) return true;
  }
  return false;
}

/** The durable signals PRESENT for a settlement this tick (codepoint-stable order).
 *  @param {GrowthSettlement} s @param {{ edges?: unknown[] }|null|undefined} graph
 *  @param {string} id @param {number} year @returns {string[]} */
function settlementSignals(s, graph, id, year) {
  /** @type {string[]} */
  const out = [];
  if (hasRecentCalamity(s, year)) out.push('calamity');
  if (hasCondition(s, 'bust')) out.push('bust');
  if (isBesieged(graph, id)) out.push('besieged');
  if (hasCondition(s, 'siege_lifted') || hasCondition(s, 'occupation_lifted')) out.push('siege_survived');
  if (hasCondition(s, 'reconstruction')) out.push('reconstruction');
  if (hasBetrayal(s)) out.push('betrayal');
  if (hasCondition(s, 'boom')) out.push('boom');
  if (hasCondition(s, 'flourishing')) out.push('flourishing');
  return out;
}

// ── Office-holder selection + archetype join ──────────────────────────────────
/** Is this NPC an office-holder (importance ≥ floor)? @param {GrowthNpc} npc */
function isOfficeHolder(npc) {
  return importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (/** @type {unknown} */ (npc))) >= GROWTH_TUNING.IMPORTANCE_FLOOR;
}
/** The NPC's roleArchetype from npcStates (populated by ensureNpcStates earlier this tick),
 *  or null when npcStates is dark. @param {Record<string, unknown>} npcStates @param {string} nid */
function archetypeOf(npcStates, nid) {
  const st = asObject(npcStates[nid]);
  const a = st.roleArchetype;
  return typeof a === 'string' && a ? a : null;
}
/** The domain-match multiplier for a deposit: FULL when the NPC's archetype is in the
 *  signal's domain (or archetype is unknown — domain-agnostic fallback), else DOMAIN_OFF_MULT.
 *  @param {string} domain @param {string|null} archetype @returns {number} */
function domainMult(domain, archetype) {
  if (archetype == null) return 1; // npcStates dark ⇒ everyone weathers it
  const roles = /** @type {Record<string, Set<string>>} */ (DOMAIN_ROLES)[domain];
  if (!roles) return 1;
  return roles.has(archetype) ? 1 : GROWTH_TUNING.DOMAIN_OFF_MULT;
}

// ── Candidate normalization ───────────────────────────────────────────────────
/** @param {unknown} v @returns {GrowthCandidate} */
function normalizeCandidate(v) {
  const o = asObject(v);
  const depositsRaw = Array.isArray(o.deposits) ? o.deposits : [];
  const deposits = depositsRaw
    .map((d) => ({ tick: Math.floor(num(asObject(d).tick, 0)), signal: String(asObject(d).signal || ''), mag: round4(num(asObject(d).mag, 0)) }))
    .slice(-GROWTH_TUNING.RECEIPT_CAP);
  return {
    stock: clamp(num(o.stock, 0), 0, GROWTH_TUNING.STOCK_MAX),
    sinceTick: Math.floor(num(o.sinceTick, 0)),
    lastDepositTick: Math.floor(num(o.lastDepositTick, 0)),
    minted: o.minted === true,
    mintedAt: Math.floor(num(o.mintedAt, 0)),
    deposits,
  };
}

/** Read an NPC's MINTED acquired traits from the growth ledger (the overlay source of truth),
 *  codepoint-sorted. Empty when absent/dormant. EXPORTED for the dossier + the pins.
 *  @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string} nid
 *  @returns {Array<{ trait: string, intensity: number, since: number, provenance: string[] }>} */
export function acquiredTraitsOf(worldState, nid) {
  const ledger = asObject(getSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'npcGrowth'));
  const rec = asObject(ledger[String(nid)]);
  /** @type {Array<{ trait: string, intensity: number, since: number, provenance: string[] }>} */
  const out = [];
  for (const trait of Object.keys(rec).sort(compareCodepoint)) {
    const cand = normalizeCandidate(rec[trait]);
    if (!cand.minted) continue;
    out.push({
      trait,
      intensity: round4(clamp01(cand.stock / GROWTH_TUNING.STOCK_MAX)),
      since: cand.mintedAt,
      provenance: [...new Set(cand.deposits.map((d) => d.signal).filter(Boolean))].sort(),
    });
  }
  return out;
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} NpcGrowthAdvanceResult
 * @property {GrowthUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the growth layer one tick. DORMANT (flag absent) ⇒ a complete no-op (byte-
 * identical). Lit ⇒ read each settlement's durable signals, deposit weighted experience to
 * its office-holders (distance-from-core-resisted), decay the ledger (D5-band-scaled), mint
 * / shed sticky traits (hysteresis + cap), mirror the minted set onto the roster, and
 * narrate every transition. Deterministic; NO rng (deposits are reads). Codepoint-sorted.
 * @param {Object} args
 * @param {GrowthSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {GrowthUpdate[]} args.settlementUpdates
 * @param {{ edges?: unknown[] }|null|undefined} args.graph
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {NpcGrowthAdvanceResult}
 */
export function advanceNpcGrowth({ snapshot, worldState, settlementUpdates, graph, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No deposit, no key. ──
  if (!npcGrowthActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }

  const T = GROWTH_TUNING;
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  const npcStates = asObject(asObject(worldState).npcStates);
  const year = num(asObject(asObject(worldState).calendar).year, Math.floor(num(tick, 0) / 52) + 1);
  const now2 = Math.max(0, Math.floor(num(tick, 0)));

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  const freshSettlement = (/** @type {string} */ id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return updates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const priorLedger = asObject(getSpatialLedger(worldState, 'npcGrowth'));
  /** @type {Record<string, Record<string, GrowthCandidate>>} the next ledger, per npc → trait */
  const nextLedger = {};
  // Seed nextLedger from prior so orphan records (npc not seen this tick) still decay/prune.
  for (const nid of Object.keys(priorLedger)) {
    const rec = asObject(priorLedger[nid]);
    /** @type {Record<string, GrowthCandidate>} */
    const perTrait = {};
    for (const trait of Object.keys(rec)) perTrait[trait] = normalizeCandidate(rec[trait]);
    nextLedger[nid] = perTrait;
  }

  /** @type {Set<string>} the npcIds an office-holder was seen for this tick (band-scaled decay applied) */
  const seenNpcIds = new Set();
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Map<string, GrowthNpc>} nid → npc (for the mirror + news naming) */
  const npcByNid = new Map();
  /** @type {Map<string, string>} nid → settlement id */
  const settlementByNid = new Map();

  const orderedIds = items.map((it) => String(it.id)).sort(compareCodepoint);

  // ── PASS 1: deposit + decay/fold per office-holder of each settlement. ──
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    const bandMult = memoryHorizonMultiplierOf(/** @type {Parameters<typeof memoryHorizonMultiplierOf>[0]} */ (/** @type {unknown} */ (s)));
    const signals = settlementSignals(s, graph, sid, year);
    const npcs = Array.isArray(s.npcs) ? s.npcs : [];

    npcs.forEach((npc, index) => {
      if (!isOfficeHolder(npc)) return;
      const nid = npcId(sid, npc, index);
      seenNpcIds.add(nid);
      npcByNid.set(nid, npc);
      settlementByNid.set(nid, sid);
      const archetype = archetypeOf(npcStates, nid);

      // Compose this tick's deposits for this soul from the settlement's signals.
      /** @type {Map<string, { mag: number, signal: string }>} trait → strongest deposit */
      const deposits = new Map();
      for (const signal of signals) {
        for (const row of GROWTH_DEPOSIT_MAP) {
          if (row.signal !== signal) continue;
          const dm = domainMult(row.domain, archetype);
          const resisted = (row.loud * dm) / resistanceOf(row.trait, npc);
          if (resisted <= 0) continue;
          const prev = deposits.get(row.trait);
          if (!prev || resisted > prev.mag) deposits.set(row.trait, { mag: resisted, signal });
        }
      }

      // Decay + fold. Every candidate for this soul (existing + freshly deposited) decays to
      // now (band-scaled) then takes its deposit; codepoint-sorted for byte stability.
      const perTrait = nextLedger[nid] || (nextLedger[nid] = {});
      const traitKeys = new Set([...Object.keys(perTrait), ...deposits.keys()]);
      for (const trait of [...traitKeys].sort(compareCodepoint)) {
        const prior = perTrait[trait];
        let stock = prior ? decayedStock(prior, now2, bandMult) : 0;
        const dep = deposits.get(trait);
        const sinceTick = prior ? prior.sinceTick : now2;
        let lastDepositTick = prior ? prior.lastDepositTick : now2;
        let receipts = prior ? prior.deposits : [];
        if (dep) {
          stock = clamp(stock + dep.mag * T.DEPOSIT_SCALE, 0, T.STOCK_MAX);
          lastDepositTick = now2;
          receipts = [...receipts, { tick: now2, signal: dep.signal, mag: round4(dep.mag) }].slice(-T.RECEIPT_CAP);
        }
        perTrait[trait] = {
          stock: round4(stock),
          sinceTick,
          lastDepositTick,
          minted: prior ? prior.minted : false,
          mintedAt: prior ? prior.mintedAt : 0,
          deposits: receipts,
        };
      }
    });
  }

  // ── PASS 2: decay orphan records (npcs not seen this tick — no settlement band known;
  // decay at the base generational clock, prune when spent). ──
  for (const nid of Object.keys(nextLedger)) {
    if (seenNpcIds.has(nid)) continue;
    const perTrait = nextLedger[nid];
    for (const trait of Object.keys(perTrait)) {
      const decayed = decayedStock(perTrait[trait], now2, 1);
      perTrait[trait] = { ...perTrait[trait], stock: round4(decayed) };
    }
  }

  // ── PASS 3: mint / shed (hysteresis + cap), prune, then build the persisted ledger. ──
  /** @type {Map<string, Array<{ trait: string, minted: boolean }>>} nid → transitions to narrate */
  const mintTransitions = new Map();
  /** @type {Record<string, Record<string, GrowthCandidate>>} */
  const persisted = {};

  for (const nid of Object.keys(nextLedger).sort(compareCodepoint)) {
    const perTrait = nextLedger[nid];
    // Count currently-minted (post-decay, pre-shed) for the cap.
    /** @type {Array<{ trait: string, cand: GrowthCandidate }>} */
    const entries = Object.keys(perTrait).sort(compareCodepoint).map((trait) => ({ trait, cand: perTrait[trait] }));
    // Determine which stay/become minted, cap-limited (strongest stock first).
    const mintedNow = new Set(entries.filter((e) => e.cand.minted && e.cand.stock >= T.RELINQUISH_FLOOR).map((e) => e.trait));
    // Candidates that cross the mint cliff and aren't minted yet — mint by strength within cap.
    const risingCandidates = entries
      .filter((e) => !e.cand.minted && e.cand.stock >= T.MINT_CLIFF)
      .sort((a, b) => (b.cand.stock - a.cand.stock) || compareCodepoint(a.trait, b.trait));
    for (const e of risingCandidates) {
      if (mintedNow.size >= T.MAX_ACQUIRED) break;
      mintedNow.add(e.trait);
    }

    /** @type {Record<string, GrowthCandidate>} */
    const keptTraits = {};
    /** @type {Array<{ trait: string, minted: boolean }>} */
    const transitions = [];
    for (const { trait, cand } of entries) {
      const wasMinted = cand.minted;
      const isMinted = mintedNow.has(trait);
      let next = cand;
      if (isMinted && !wasMinted) {
        next = { ...cand, minted: true, mintedAt: now2 };
        transitions.push({ trait, minted: true });
      } else if (!isMinted && wasMinted) {
        next = { ...cand, minted: false, mintedAt: 0 };
        transitions.push({ trait, minted: false });
      }
      // Prune a spent, unminted candidate (drop-when-empty). A minted trait is always kept.
      if (!next.minted && next.stock < T.PRUNE_EPSILON) continue;
      keptTraits[trait] = next;
    }
    if (transitions.length) mintTransitions.set(nid, transitions);
    if (Object.keys(keptTraits).length) persisted[nid] = keptTraits;
  }

  // ── PASS 4: mirror the minted set onto the roster + narrate transitions. ──
  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };

  // Group affected npcs by settlement so we rebuild each settlement's roster once.
  /** @type {Map<string, Set<string>>} sid → nids that need a mirror refresh */
  const touchedBySettlement = new Map();
  const allAffected = collectMirrorCandidates(priorLedger, persisted);
  for (const nid of allAffected) {
    const sid = settlementByNid.get(nid);
    if (sid === undefined) continue; // orphan / not in this snapshot — its stale mirror decays with the roster elsewhere
    if (!touchedBySettlement.has(sid)) touchedBySettlement.set(sid, new Set());
    touchedBySettlement.get(sid)?.add(nid);
  }

  for (const sid of [...touchedBySettlement.keys()].sort(compareCodepoint)) {
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const s = freshSettlement(sid);
    const npcs = Array.isArray(s?.npcs) ? s.npcs : [];
    let rosterChanged = false;
    const nextNpcs = npcs.map((npc, index) => {
      const nid = npcId(sid, npc, index);
      const desired = acquiredTraitsFromPersisted(persisted[nid]);
      const current = Array.isArray(npc.acquiredTraits) ? npc.acquiredTraits : null;
      if (sameAcquired(current, desired)) return npc;
      rosterChanged = true;
      if (desired.length === 0) {
        if (!current) return npc;
        const { acquiredTraits: _drop, ...rest } = npc;
        return rest;
      }
      return { ...npc, acquiredTraits: desired };
    });
    if (rosterChanged) {
      ensureCloned();
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...s, npcs: nextNpcs } };
    }
  }

  // Narrate — one beat per newly minted trait (the chronicle carries "the Marshal grew
  // cautious"), one quiet beat per shed (the mark faded). Sorted for determinism.
  for (const nid of [...mintTransitions.keys()].sort(compareCodepoint)) {
    const npc = npcByNid.get(nid);
    const sid = settlementByNid.get(nid);
    if (!npc || sid === undefined) continue;
    const item = itemById.get(sid);
    const townName = String(item?.name || freshSettlement(sid)?.name || sid);
    for (const tr of mintTransitions.get(nid) || []) {
      const cand = persisted[nid]?.[tr.trait];
      const prov = cand ? [...new Set(cand.deposits.map((d) => d.signal).filter(Boolean))].sort() : [];
      newsEntries.push(growthNews(nid, String(npc.name || npc.label || nid), townName, sid, tr.trait, tr.minted, prov, now2, now));
    }
  }

  // ── PERSIST (drop-when-empty). Nothing changed ⇒ byte-identical. ──
  let nextWorldState = worldState;
  let changed = cloned;
  const prevSerialized = JSON.stringify(Object.keys(priorLedger).length ? sortedLedger(priorLedger) : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? sortedLedger(persisted) : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'npcGrowth', sortedLedger(persisted))
      : dropSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'npcGrowth');
    changed = true;
  }

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries };
}

// ── Small helpers ──────────────────────────────────────────────────────────────
/** Codepoint-sorted two-level ledger (npc → trait → candidate) for byte-stable persistence.
 *  Accepts a raw ledger (defensive: reads via asObject). @param {Record<string, unknown>} ledger */
function sortedLedger(ledger) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const nid of Object.keys(ledger).sort(compareCodepoint)) {
    const rec = asObject(ledger[nid]);
    const keys = Object.keys(rec).sort(compareCodepoint);
    if (!keys.length) continue;
    /** @type {Record<string, unknown>} */
    const per = {};
    for (const t of keys) per[t] = rec[t];
    out[nid] = per;
  }
  return out;
}

/** The acquiredTraits[] mirror array for an npc's persisted record (minted only, sorted).
 *  @param {Record<string, GrowthCandidate>|undefined} rec */
function acquiredTraitsFromPersisted(rec) {
  if (!rec) return [];
  /** @type {Array<{ trait: string, intensity: number, since: number, provenance: string[] }>} */
  const out = [];
  for (const trait of Object.keys(rec).sort(compareCodepoint)) {
    const cand = rec[trait];
    if (!cand.minted) continue;
    out.push({
      trait,
      intensity: round4(clamp01(cand.stock / GROWTH_TUNING.STOCK_MAX)),
      since: cand.mintedAt,
      provenance: [...new Set(cand.deposits.map((d) => d.signal).filter(Boolean))].sort(),
    });
  }
  return out;
}

/** Are two acquiredTraits mirror arrays equal (byte-stable projection compare)?
 *  @param {unknown} a @param {Array<{trait:string,intensity:number,since:number,provenance:string[]}>} b */
function sameAcquired(a, b) {
  const arr = Array.isArray(a) ? a : [];
  if (arr.length !== b.length) return false;
  return JSON.stringify(arr) === JSON.stringify(b);
}

/** Every npc whose PRIOR ledger carried minted traits (so a now-shed npc gets its stale
 *  mirror cleared even if it minted nothing this tick). @param {Record<string, unknown>} prior
 *  @param {Record<string, Record<string, GrowthCandidate>>} persisted @returns {Set<string>} */
function collectMirrorCandidates(prior, persisted) {
  const out = new Set();
  for (const nid of Object.keys(prior)) {
    const rec = asObject(prior[nid]);
    if (Object.keys(rec).some((t) => asObject(rec[t]).minted === true)) out.add(nid);
  }
  for (const nid of Object.keys(persisted)) out.add(nid);
  return out;
}

/**
 * The growth transition beat (house voice) — a person weathered into (or out of) a trait,
 * with its provenance. AGGREGATE of durable outcomes projected onto one named soul's state
 * (never their fate — the trait is reversible). @param {string} nid @param {string} npcName
 * @param {string} townName @param {string} sid @param {string} trait @param {boolean} minted
 * @param {string[]} provenance @param {number} tick @param {string|null} now
 */
function growthNews(nid, npcName, townName, sid, trait, minted, provenance, tick, now) {
  const prov = provenance.length ? provenance.join(', ') : 'the weight of events';
  const headline = minted
    ? `${npcName} has grown ${trait}`
    : `${npcName}'s ${trait} streak has faded`;
  const summary = minted
    ? `The years have left their mark on ${npcName} of ${townName}: after ${prov}, they have grown ${trait}.`
    : `Time has softened ${npcName} of ${townName}; the ${trait} the hard years taught has faded without fresh cause.`;
  return {
    id: `wizard_news.${tick}.npc_growth.${nid}.${trait}.${minted ? 'gain' : 'shed'}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: 0.25, score: 44,
    headline,
    summary,
    kind: 'applied', impactKind: 'npc_growth', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [],
    // Actor layer (NEWS ADDRESS LAW): the person the trait moved on. A learned
    // trait is reversible state, so linking the record names a soul, never seals one.
    npcIds: [nid],
    sourceEventId: `npc_growth.${nid}.${trait}.${tick}`,
    tags: ['world_pulse', 'npc_growth', minted ? 'trait_gained' : 'trait_shed'],
    reasons: [minted
      ? `A learned trait, deposited by durable outcomes (${prov}) past the acquisition threshold — the core personality untouched.`
      : `An unreinforced learned trait decayed below its hold threshold and was shed — both signs of the growth clock.`],
  };
}
