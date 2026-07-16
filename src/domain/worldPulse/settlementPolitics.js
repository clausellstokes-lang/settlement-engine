/**
 * domain/worldPulse/settlementPolitics.js — W-DOCTRINE-4: SETTLEMENT POLITICS
 * (DESIGN_SETTLEMENT_POLITICS.md §1–§7). THE FINAL ENGINE WAVE.
 *
 * The peace engine's coalition machinery, played SCALE-FREE inside one settlement at
 * FACTION grain (the design's §0 principle: "one vocabulary, two arenas"). Competing
 * factions form BLOCS against oppositions for more influence — aligning interests, or
 * perpetually fragmenting — and the NAMED people inside those factions decide how a
 * bloc forms, how strong or fragile it is, to what end, and when it fractures.
 *
 * The overt twin of the corruption web (corruptionWeb.js §3): a ruling bloc LOADS the
 * settlement's decision weights toward its members' interests exactly as a foreign
 * asset's directionBias does — the SAME §H kernel, the OPPOSITE legitimacy (overt,
 * domestic, receipted in the visible record). A divided court decides closer to raw
 * character and is CHEAP TO CORRUPT — the two designs are one market.
 *
 * ── WHY LAZY (first-paint budget) ────────────────────────────────────────────
 * Imported ONLY by the dynamically-loaded pulse kernel (a lazy engine leaf) + the lazy
 * corruption-web seam — ZERO first-paint bytes. It imports pure leaves only (cohesion
 * weave §B/§C, the kernel math, the codepoint sort, the stablePart slug). No Date, no
 * Math.random; all randomness forks off the pulse rng confluence; all folds
 * codepoint-sorted; every persisted float round4'd (same-seed byte-identity depends on
 * it — the peaceTerms/warReasons idiom).
 *
 * ── DORMANCY (constitutional) ────────────────────────────────────────────────
 * The whole layer lights on settlementPoliticsActive: the VIRTUAL flag
 * simulationRules.settlementPoliticsEnabled === true AND the faction substrate
 * (factionCompetitionEnabled — factionStates are meaningless without the subsystem
 * that maintains them). The virtual flag has NO entry in DEFAULT_SIMULATION_RULES (the
 * corruptionWebEnabled / infoStatecraftEnabled idiom), so every existing golden is
 * byte-identical. Gate absent ⇒ the mover is an IMMEDIATE no-op (no fork, no ledger,
 * no realignment) and every read returns its neutral value (no bloc, factor 1.0, 0
 * consolidation) ⇒ byte-identical. worldState.politicsLedgers is a conditionally-
 * materialized top-level ledger (the narrativeTempo precedent) — absent while dormant.
 *   [JUDGMENT: a dedicated virtual flag composed with factionCompetitionEnabled (the
 *    faction subsystem), NOT with beliefsActive/warLayer — factions coalesce in an
 *    aspatial, belief-off, peacetime campaign, so coupling to beliefs or the war gate
 *    would be wrong. The war-sub-flag-under-warLayerEnabled nesting precedent. Say
 *    "veto" to fold onto a different substrate.]
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { stablePart } from './stablePart.js';
import { faithAlignmentQuadrant, rulingPowerFromArchetype } from '../spatial/cohesionWeave.js';
import { warFrontsInto } from './warFrontReads.js';
import { mobilizationSeverity } from './mobilization.js';

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** A settlement item as it appears on the pre-tick snapshot.
 *  @typedef {{ id: string|number, name?: string, settlement?: SimSettlement }} PolItem */
/** The loosely-typed snapshot slice this module reads.
 *  @typedef {{ byId?: Map<string, PolItem>, settlements?: PolItem[] }} PolSnapshot */
/** @typedef {{ fork?: (key: string) => { random: () => number } } | null} RngLike */

/** A glue entry on a bloc (§1). type is the BINDING; detail is the DM receipt fragment.
 *  @typedef {{ type: 'concession'|'patronage'|'doctrine'|'threat'|'compromise', detail: string }} BlocGlue */
/** A persisted bloc (§1). id = codepoint-sorted stableParts of members (stable composite).
 *  @typedef {{ id: string, members: string[], glue: BlocGlue[],
 *    end: 'seats'|'doctrine'|'commerce'|'survival'|'patron', strain: number,
 *    sinceTick: number, covert?: boolean }} Bloc */
/** A per-settlement politics ledger. @typedef {{ blocs: Bloc[] }} SettlementPoliticsLedger */

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} n @returns {number} 4-dp round for byte-tidy persisted floats. */
function round4(n) { return Math.round((Number(n) || 0) * 10000) / 10000; }

// ── Tuning (bounded named constants — owner-retunable) ───────────────────────────
export const SETTLEMENT_POLITICS_TUNING = Object.freeze({
  /** HARD CAP on blocs per settlement (§1 depth-cap law — reviewable as a design bug
   *  if it grows). A 4th candidate DEFERS (visible), never forms. */
  MAX_BLOCS_PER_SETTLEMENT: 3,
  /** A bloc needs ≥ this many members. Below it the bloc dissolves (a coalition of one
   *  is no coalition). */
  MIN_BLOC_MEMBERS: 2,

  // ── §2 FORMATION (who CAN × who DOES) ────────────────────────────────────────
  /** The affinity score a candidate pair must clear before the §H draw even fires
   *  (0..~1.5). Blocs are STICKY to form (hysteresis as law) — a high bar. */
  FORMATION_AFFINITY_FLOOR: 0.55,
  /** The E0 rarity baseline (the corruptionWeb INITIATE_BASE idiom): formation is a
   *  drama-classed event, ramped by affinity² so only a strong, willing pair coalesces
   *  in any given tick — never weekly churn. */
  FORMATION_BASE: 0.16,
  /** Warm leader ties (kin, partner, mentor/protégé, ally) MULTIPLY the formation
   *  affinity up to this (the §G "the people lower the threshold"). Clamped. */
  WARM_TIE_BOOST: 1.4,
  /** A personal leader RIVALRY (hostile edge or a live rivalry-target) crushes the
   *  affinity toward this floor — the load-bearing pin: interests-align + leaders-
   *  hostile ⇒ no formation ("the guildmaster will not sit at her table"). A bitter/
   *  mortal enmity floors it to 0 (a HARD block). */
  RIVALRY_BLOCK_FLOOR: 0.12,

  // ── §4 STRAIN / FRAGMENTATION ────────────────────────────────────────────────
  /** Per-tick strain a bloc member accrues per unit of differential peace-term burden
   *  it bears (the revanchism mechanism — someone's warehouses pay the tribute). */
  STRAIN_BURDEN_W: 0.06,
  /** Per-tick strain a bloc sheds toward 0 when nothing loads it (mean reversion — a
   *  quiet coalition cools). */
  STRAIN_RELAX: 0.02,
  /** A bloc under this much strain is at risk of a strain-driven fracture on its next
   *  defection window. */
  STRAIN_FRACTURE_AT: 0.7,
  /** Minimum ticks a bloc must hold before it may dissolve/realign for a non-triggering
   *  reason (hysteresis dwell — meaningful to break, an event the chronicle narrates). */
  MIN_DWELL_TICKS: 8,
  /** OUTBIDDING (seat-held concession glue is a market): a non-member suitor outbids a
   *  member's seat only when it offers an EQUAL-OR-BETTER interest AND commands at least
   *  this fraction MORE power than the member's current best partner (the richer patron
   *  wins the concession). People-held/compromise/doctrine glue is NOT market-outbiddable. */
  OUTBID_POWER_MARGIN: 0.25,
  /** An external threat (siege/war footing) COMPRESSES the formation floor by this
   *  fraction (the rally — a fractious council closes ranks when banners crest the
   *  ridge) and stabilises survival blocs. */
  THREAT_RALLY_RELIEF: 0.35,

  // ── §4 CONSPIRACIES (autarchies suppress overt blocs + breed covert ones) ────
  /** The per-tick E0 discovery baseline for a COVERT conspiracy (the covert→revealed
   *  exposure path). Ramped toward certainty as the plot MATURES — a conspiracy cannot
   *  stay hidden forever under a watchful autarch. */
  DISCOVERY_BASE: 0.06,
  /** Ticks over which a covert plot's discovery odds ramp from DISCOVERY_BASE to its
   *  full (× (1 + age/this)) exposure — the older the plot, the likelier it surfaces. */
  DISCOVERY_MATURE_TICKS: 26,

  // ── §3 RULING-BLOC DECISION LOADING (the overt §H twin) ──────────────────────
  /** The bounded span of the decision-weight load a ruling bloc applies toward its
   *  end (the warReasonFactor WAR_FACTOR_W idiom: factor = 1 + SPAN·pull, clamped).
   *  0.30 matches the corruption web's DIRECTION_MAX so the overt and covert twins
   *  bias with the SAME authority. */
  DECISION_LOAD_SPAN: 0.3,
  /** A ruling bloc's consolidation (its share of the settlement's power) must clear
   *  this before it loads decisions at all (a bare plurality does not command the
   *  council). */
  RULING_CONSOLIDATION_FLOOR: 0.4,
  // The §3 CROSS-SEAM degrade weight (a consolidated coalition raises the corruption
  // patron's price) lives in CORRUPTION_WEB_TUNING.COALITION_RESIST_MAX — co-located
  // with the other recruitment-degrade weights the corruption web applies; this module
  // only exports the consolidation READ it consumes (coalitionConsolidation01).
});

// ── THE GATE (fail-closed; the virtual-flag idiom) ───────────────────────────────
/**
 * Is the settlement-politics layer LIT? The VIRTUAL flag settlementPoliticsEnabled ===
 * true AND the faction substrate factionCompetitionEnabled === true, read defensively
 * (absent ⇒ false ⇒ dormant). NEITHER touches DEFAULT_SIMULATION_RULES via a new
 * default: settlementPoliticsEnabled has NO entry there (byte-identical dormancy).
 * @param {{ simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function settlementPoliticsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  if (!rules || typeof rules !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (rules);
  return r.settlementPoliticsEnabled === true && r.factionCompetitionEnabled === true;
}

/** The stable seed fork key (§H). @param {string} cid @param {number} tick @returns {string} */
export function politicsForkKey(cid, tick) {
  return `settlement-politics:${cid}:${tick}`;
}

/** The stable bloc id: codepoint-sorted member stableParts, joined (§1 stable composite).
 *  A rename that re-mints a member's stablePart re-mints the id — handled by the
 *  membership re-validation each tick (a dropped member below MIN dissolves the bloc).
 * @param {ReadonlyArray<string>} memberNames @returns {string} */
export function blocId(memberNames) {
  return (Array.isArray(memberNames) ? memberNames : [])
    .map((n) => stablePart(n))
    .sort(compareCodepoint)
    .join('+');
}

// ── §2 THE FACTION VIEW (join factionStates ⋈ roster, per settlement) ─────────────

/** The roster factions off a snapshot item (the settlementFactions fallback chain). */
/** @param {PolItem | null | undefined} item @returns {Array<Record<string, unknown>>} */
function rosterFactions(item) {
  const s = asObject(item ? item.settlement : null);
  const ps = asObject(s.powerStructure);
  const politics = asObject(s.politics);
  const list = (Array.isArray(ps.factions) && ps.factions)
    || (Array.isArray(s.factions) && s.factions)
    || (Array.isArray(politics.factions) && politics.factions)
    || [];
  return /** @type {Array<Record<string, unknown>>} */ (list);
}

/** A faction's display name (the roster/state fallback chain). @param {Record<string, unknown>} f */
function factionNameOf(f) {
  return String(f?.faction || f?.name || f?.label || '');
}

/** A faction's numeric power (roster field chain). @param {Record<string, unknown>} f @returns {number} */
function factionPowerOf(f) {
  const raw = f?.power ?? f?.influence ?? f?.score ?? f?.weight;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * The per-faction view for a settlement: the live factionStates (authoritative:
 * archetype, seats, rivals, members) joined to the roster (power, isGoverning) by the
 * stablePart(name) key. Codepoint-sorted by key for determinism.
 * @param {PolItem} item
 * @param {Record<string, unknown>} factionStatesForSettlement  factionStates entries whose settlementId === item.id, name-keyed by stablePart
 * @returns {Array<{ key: string, name: string, archetype: string, power: number,
 *   isGoverning: boolean, leaderNpcId: string|null, leaderName: string|null,
 *   rivalKeys: Set<string>, captureState: string }>}
 */
function factionViews(item, factionStatesForSettlement) {
  const roster = rosterFactions(item);
  /** @type {Map<string, Record<string, unknown>>} */
  const rosterByKey = new Map();
  for (const f of roster) {
    const key = stablePart(factionNameOf(f));
    if (key && key !== 'unknown' && !rosterByKey.has(key)) rosterByKey.set(key, f);
  }
  /** @type {Array<{ key: string, name: string, archetype: string, power: number, isGoverning: boolean, leaderNpcId: string|null, leaderName: string|null, rivalKeys: Set<string>, captureState: string }>} */
  const out = [];
  for (const key of Object.keys(factionStatesForSettlement).sort(compareCodepoint)) {
    const st = asObject(factionStatesForSettlement[key]);
    const name = String(st.name || key);
    const rosterEntry = rosterByKey.get(key) || null;
    const seats = asObject(st.internalSeats);
    const leader = asObject(seats.leader_champion);
    const rivalKeys = new Set(
      (Array.isArray(st.rivals) ? st.rivals : [])
        .map((r) => stripSavePrefix(String(r && typeof r === 'object' ? (asObject(r).id ?? asObject(r).name ?? '') : r)))
        .filter(Boolean),
    );
    out.push({
      key,
      name,
      archetype: String(st.archetype || (rosterEntry ? rosterEntry.archetype : '') || 'other'),
      power: rosterEntry ? factionPowerOf(rosterEntry) : 0,
      isGoverning: rosterEntry ? rosterEntry.isGoverning === true : false,
      leaderNpcId: leader.npcId != null ? String(leader.npcId) : null,
      leaderName: leader.name != null ? String(leader.name) : null,
      rivalKeys,
      captureState: String(st.captureState || 'none'),
    });
  }
  return out;
}

/** Strip a `saveId:` prefix from a worldPulse composite id, recovering the tail (the
 *  faction stablePart key or the generator npc id). @param {string} id @returns {string} */
function stripSavePrefix(id) {
  const s = String(id || '');
  const i = s.indexOf(':');
  return i >= 0 ? s.slice(i + 1) : s;
}

// ── §2 AFFINITY: who CAN coalesce (§B quadrant × §C structural × rivals repulsion) ──

/** The structural (§C) archetype-affinity lens — standing fault lines and natural
 *  alliances (temple+labor vs crown+merchant; the criminal is nobody's overt ally).
 *  Symmetric; 1.0 = neutral, >1 = drawn together, <1 = structurally opposed. Values
 *  bounded. Absent/unknown archetype ⇒ neutral. */
// KEYS ARE ALPHABETICAL `${min}|${max}` (the lookup normalizes the pair the same way);
// a mis-ordered key silently never matches, so keep them sorted.
const STRUCTURAL_AFFINITY = Object.freeze({
  // Natural alliances (shared structural interest).
  'labor|religious': 1.25, 'civic|religious': 1.15, 'civic|labor': 1.2,
  'merchant|noble': 1.2, 'craft|merchant': 1.25, 'military|noble': 1.25,
  'arcane|religious': 1.1, 'craft|labor': 1.15,
  // Standing fault lines (structurally opposed).
  'labor|merchant': 0.7, 'labor|noble': 0.65, 'merchant|religious': 0.8,
  'noble|religious': 0.85, 'civic|criminal': 0.55, 'criminal|military': 0.5,
  'criminal|religious': 0.6, 'labor|military': 0.8,
});

/** Look up the symmetric structural-affinity multiplier for two archetypes. */
/** @param {string} a @param {string} b @returns {number} */
function structuralAffinity(a, b) {
  const x = String(a || 'other');
  const y = String(b || 'other');
  if (x === y) return 1.1; // same archetype — kindred interests, a mild draw.
  const key = x < y ? `${x}|${y}` : `${y}|${x}`;
  const v = /** @type {Record<string, number>} */ (STRUCTURAL_AFFINITY)[key];
  return Number.isFinite(v) ? v : 1.0;
}

/**
 * The §B faith×alignment quadrant gate between two factions (bounded, centered on 1.0
 * via the modulators.gate). Within one settlement faith is shared, so samePatron is
 * TRUE by default; the discriminating axis is the leaders' alignment kinship. Absent
 * alignment ⇒ neutral (the charitable default — never pushed to natural_enemy by
 * absence). @param {number|null} kinship01 @returns {number} */
function quadrantGate(kinship01) {
  const q = faithAlignmentQuadrant({
    samePatron: true,
    alignmentKinship01: kinship01 == null ? 0.5 : clamp01(kinship01),
  });
  return q.modulators.gate;
}

// ── §G THE PEOPLE: leader ties gate formation (warm lowers, rivalry BLOCKS) ────────

/** Relationship-edge types that read as WARM (a personal draw the people bring). */
const WARM_TIE_TYPES = new Set(['family', 'mentor_student', 'ally', 'respect', 'lover', 'patron_client']);
/** Relationship-edge types that read as HOSTILE (a personal rivalry that BLOCKS). */
const HOSTILE_TIE_TYPES = new Set(['rival', 'enemy']);
/** The hostile strengths that HARD-block (a bitter/mortal enmity floors affinity to 0). */
const HARD_BLOCK_STRENGTHS = new Set(['bitter', 'mortal', 'personal', 'serious']);

/**
 * Read the personal tie between two faction leaders (§G). Returns a signed posture:
 *   +1 warm, -1 hostile (soft), -2 hostile (hard block), 0 none/unknown.
 * Static generator ties (settlement.relationships[]) OR a live dynamic rivalry
 * (npcStates[leader].rivalryTargets) count as hostile. Pure.
 * @param {Array<Record<string, unknown>>} relationships  settlement.relationships[]
 * @param {Record<string, unknown>} npcStates             worldState.npcStates
 * @param {string|null} aLeaderNpcId  worldPulse composite id (`${saveId}:${genId}`)
 * @param {string|null} bLeaderNpcId
 * @returns {{ posture: -2|-1|0|1, reason: string }}
 */
function leaderTiePosture(relationships, npcStates, aLeaderNpcId, bLeaderNpcId) {
  if (!aLeaderNpcId || !bLeaderNpcId || aLeaderNpcId === bLeaderNpcId) return { posture: 0, reason: '' };
  // Dynamic rivalry (worldPulse-space npcIds): a leader that has MOVED against the
  // other during the sim is hostile, whatever the generation-frozen edge says.
  const aState = asObject(npcStates[aLeaderNpcId]);
  const bState = asObject(npcStates[bLeaderNpcId]);
  const aTargets = Array.isArray(aState.rivalryTargets) ? aState.rivalryTargets.map(String) : [];
  const bTargets = Array.isArray(bState.rivalryTargets) ? bState.rivalryTargets.map(String) : [];
  if (aTargets.includes(bLeaderNpcId) || bTargets.includes(aLeaderNpcId)) {
    return { posture: -1, reason: 'the leaders have moved against each other' };
  }
  // Static generator edge (generator-id space): strip the saveId: prefix to match
  // settlement.relationships[].npc1Id/npc2Id.
  const aGen = stripSavePrefix(aLeaderNpcId);
  const bGen = stripSavePrefix(bLeaderNpcId);
  for (const rel of relationships) {
    const n1 = String(rel?.npc1Id ?? '');
    const n2 = String(rel?.npc2Id ?? '');
    if (!((n1 === aGen && n2 === bGen) || (n1 === bGen && n2 === aGen))) continue;
    const type = String(rel?.type ?? '').toLowerCase();
    const strength = String(rel?.strength ?? '').toLowerCase();
    if (HOSTILE_TIE_TYPES.has(type)) {
      const hard = HARD_BLOCK_STRENGTHS.has(strength);
      return {
        posture: hard ? -2 : -1,
        reason: `a ${strength || ''} ${type === 'enemy' ? 'enmity' : 'rivalry'} between the leaders`.replace(/\s+/g, ' ').trim(),
      };
    }
    if (WARM_TIE_TYPES.has(type)) {
      return { posture: 1, reason: `a personal bond between the leaders (${type.replace('_', '/')})` };
    }
  }
  return { posture: 0, reason: '' };
}

/**
 * The pre-tie INTEREST between two factions: the structural draw (§C) × the
 * faith/alignment quadrant gate (§B) × rivals[] repulsion. This is "who CAN coalesce"
 * before the people have their say. Bounded. @returns {number}
 * @param {{ key: string, archetype: string, rivalKeys: Set<string> }} a
 * @param {{ key: string, archetype: string, rivalKeys: Set<string> }} b
 * @param {number|null} kinship01
 */
function pairInterest(a, b, kinship01) {
  let interest = structuralAffinity(a.archetype, b.archetype) * quadrantGate(kinship01);
  // rivals[] repulsion — a declared faction rivalry is a standing structural repulsion.
  if (a.rivalKeys.has(b.key) || b.rivalKeys.has(a.key)) interest *= 0.6;
  return round4(clamp(interest, 0, 3));
}

/**
 * Apply the §G people modulation to a pre-tie interest (the addendum's "who DOES"):
 * a warm leader tie MULTIPLIES it up; a soft rivalry crushes it toward the block floor;
 * a HARD rivalry (-2, a bitter/mortal enmity) returns 0 — the coalition their interests
 * demand does not form ("the guildmaster will not sit at her table"). @returns {number}
 * @param {number} interest @param {{ posture: -2|-1|0|1 }} tie
 */
function applyTie(interest, tie) {
  if (tie.posture === -2) return 0; // HARD block.
  if (tie.posture === -1) return round4(Math.min(interest, SETTLEMENT_POLITICS_TUNING.RIVALRY_BLOCK_FLOOR));
  if (tie.posture === 1) return round4(clamp(interest * SETTLEMENT_POLITICS_TUNING.WARM_TIE_BOOST, 0, 3));
  return interest;
}

// ── §2 GLUE TYPOLOGY (what binds — decides strength/fragility) ────────────────────

/**
 * Classify the PRIMARY glue binding a pair/group (§2). Precedence (strongest binding
 * named first): compromise (a corruption leash) > threat (external rally) > doctrine
 * (shared faith) > patronage (a warm personal leader tie) > concession (the overt
 * transactional default). Returns the typed glue + whether it is PEOPLE-HELD (dissolves
 * on succession — the twin pin) vs seat-held/other.
 * @param {Object} args
 * @param {ReadonlyArray<{ archetype: string, captureState: string, leaderNpcId: string|null }>} args.members
 * @param {Record<string, unknown>} args.npcStates
 * @param {{ posture: -2|-1|0|1 }} args.tie
 * @param {boolean} args.underThreat
 * @returns {{ glue: BlocGlue, peopleHeld: boolean, covert: boolean }}
 */
function classifyGlue({ members, npcStates, tie, underThreat }) {
  // COMPROMISE — a member's seat-holder carries a corruption leash (local OR foreign):
  // the strongest and most catastrophic glue (exposure shatters it + fires scandal).
  for (const m of members) {
    if (!m.leaderNpcId) continue;
    const st = asObject(npcStates[m.leaderNpcId]);
    const leash = asObject(st.corruptionLeash);
    const corrupt = st.corruption === true || st.corrupt === true || Object.keys(leash).length > 0;
    if (corrupt) {
      return {
        glue: { type: 'compromise', detail: 'a seat-holder carries a corruption leash — a leash the bloc does not name aloud' },
        peopleHeld: false,
        covert: true,
      };
    }
  }
  // THREAT — a survival bloc born of an external rally (dissolves when the siege lifts).
  if (underThreat) {
    return { glue: { type: 'threat', detail: 'a common danger at the walls — the fractious close ranks' }, peopleHeld: false, covert: false };
  }
  // DOCTRINE — both anchored in faith/arcane authority (shared creed).
  const faithMembers = members.filter((m) => m.archetype === 'religious' || m.archetype === 'arcane');
  if (faithMembers.length >= 2) {
    return { glue: { type: 'doctrine', detail: 'a shared creed binds the seats' }, peopleHeld: false, covert: false };
  }
  // PATRONAGE — a warm personal leader tie is the binding force (PEOPLE-HELD: strong
  // while those hands hold those seats, brittle at succession — the §G seat/people law).
  if (tie.posture === 1) {
    return { glue: { type: 'patronage', detail: 'personal loyalty between the leaders' }, peopleHeld: true, covert: false };
  }
  // CONCESSION — the overt transactional default (seats traded, revenue shared): seat-
  // held, outbiddable any day, but survives leader changes.
  return { glue: { type: 'concession', detail: 'seats and revenue traded for a working majority' }, peopleHeld: false, covert: false };
}

// ── §2 "TO WHAT END" (member interests colored by the leading NPC's goals) ────────

/** Map a faction archetype to its base political END (§2 / §C war-style vocabulary). */
const ARCHETYPE_END = Object.freeze({
  noble: 'seats', military: 'seats', government: 'seats', civic: 'seats',
  merchant: 'commerce', craft: 'commerce', labor: 'commerce',
  religious: 'doctrine', arcane: 'doctrine',
  criminal: 'patron', outsider: 'patron',
});

/** Goal tokens (npcState shortGoal/longGoal) that COLOR the end when a leader steers. */
const GOAL_END_HINT = Object.freeze({
  secure_office: 'seats', seek_promotion: 'seats', consolidate_power: 'seats', break_vassalage: 'survival',
  profit_from_change: 'commerce', accumulate_wealth: 'commerce', expand_trade: 'commerce',
  spread_faith: 'doctrine', defend_doctrine: 'doctrine', serve_patron: 'patron',
});

/**
 * Derive a bloc's END (§2): the members' base interests (archetype), COLORED by the
 * leading faction's leader goals, under an external-threat override (survival). Re-
 * derived whenever the leading seat changes hands. Deterministic.
 * @param {ReadonlyArray<{ archetype: string, power: number, leaderNpcId: string|null }>} members
 * @param {Record<string, unknown>} npcStates
 * @param {boolean} underThreat
 * @returns {'seats'|'doctrine'|'commerce'|'survival'|'patron'}
 */
function deriveEnd(members, npcStates, underThreat) {
  if (underThreat) return 'survival';
  // The leading member (max power, codepoint tiebreak on archetype) sets the tone.
  const lead = [...members].sort((x, y) => (y.power - x.power) || compareCodepoint(x.archetype, y.archetype))[0];
  if (lead && lead.leaderNpcId) {
    const st = asObject(npcStates[lead.leaderNpcId]);
    const goalHint = /** @type {Record<string, string>} */ (GOAL_END_HINT)[String(st.longGoal || '')]
      || /** @type {Record<string, string>} */ (GOAL_END_HINT)[String(st.shortGoal || '')];
    if (goalHint) return /** @type {'seats'|'doctrine'|'commerce'|'survival'|'patron'} */ (goalHint);
  }
  const base = lead ? /** @type {Record<string, string>} */ (ARCHETYPE_END)[lead.archetype] : null;
  return /** @type {'seats'|'doctrine'|'commerce'|'survival'|'patron'} */ (base || 'commerce');
}

// ── EXTERNAL-THREAT read (the rally — a war footing/siege compresses formation) ─────
/**
 * True when banners are cresting the ridge. Reads the REAL engine sources the rest of the war
 * layer uses (r2 politics-psychology-2): a besieging war_front INTO the settlement, or a war
 * footing on worldState.warPosture[cid]. The prior code probed six fields (underSiege / besieged
 * / mobilizationState / warPosture / threatLevel / embattlement) that NO engine path writes onto
 * a settlement object — siege truth is a war_front edge and warPosture is a worldState ledger —
 * so the rally, survival blocs, and threat glue never fired in a real campaign. The old
 * settlement-field probes are kept as a tolerant FALLBACK (a snapshot that happens to carry them).
 * @param {PolItem} item @param {Record<string, unknown>} [worldState] @param {unknown} [graph]
 * @param {string} [cid] @returns {boolean}
 */
function settlementUnderThreat(item, worldState, graph, cid) {
  const id = cid != null ? String(cid) : String(item?.id ?? '');
  // PRIMARY — a live besieging war_front INTO this settlement (the provenance-gated read).
  if (id && graph && warFrontsInto(graph, id).length > 0) return true;
  // PRIMARY — a war footing on the worldState.warPosture ledger (war_preparation/mobilized/deployed).
  if (id && worldState) {
    const posture = asObject(asObject(worldState.warPosture)[id]);
    if (mobilizationSeverity(String(posture.state || '')) > 0) return true;
  }
  // FALLBACK — the tolerant settlement-field markers (kept; a snapshot may still carry them).
  const s = asObject(item ? item.settlement : null);
  if (s.underSiege === true || s.besieged === true) return true;
  const mob = String(s.mobilizationState || s.warPosture || '').toLowerCase();
  if (mob && mob !== 'peace' && mob !== 'none' && mob !== 'idle') return true;
  const threat = Number(s.threatLevel ?? s.embattlement);
  return Number.isFinite(threat) && threat >= 0.5;
}

// ── §3 + §4 THE EXPORTED EFFECT READS (pure; dormant ⇒ neutral) ───────────────────

/** The blocs for a settlement (the persisted ledger, or []). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} cid @returns {Bloc[]} */
export function settlementBlocs(worldState, cid) {
  if (!settlementPoliticsActive(worldState)) return [];
  const ledgers = asObject(asObject(worldState).politicsLedgers);
  const entry = asObject(ledgers[String(cid)]);
  return Array.isArray(entry.blocs) ? /** @type {Bloc[]} */ (entry.blocs) : [];
}

/**
 * The RULING bloc for a settlement (§3): the bloc CONTAINING the governing faction
 * whose members command ≥ RULING_CONSOLIDATION_FLOOR of the settlement's power. A pure
 * DERIVED read (never a roster isGoverning write — that stays owner-gated). null ⇒ a
 * divided court (no ruling bloc). Dormant ⇒ null.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} cid
 * @param {PolItem | null | undefined} item
 * @returns {{ bloc: Bloc, consolidation: number } | null}
 */
export function rulingBlocOf(worldState, cid, item) {
  const blocs = settlementBlocs(worldState, cid);
  if (!blocs.length || !item) return null;
  // Build a name→{power,isGoverning} map straight off the roster (the roster carries the
  // live power + isGoverning; factionStates are not needed for this read).
  const roster = rosterFactions(item);
  let totalPower = 0;
  /** @type {Map<string, { power: number, isGoverning: boolean }>} */
  const byKey = new Map();
  for (const f of roster) {
    const key = stablePart(factionNameOf(f));
    const power = factionPowerOf(f);
    totalPower += power;
    if (key && !byKey.has(key)) byKey.set(key, { power, isGoverning: f.isGoverning === true });
  }
  if (totalPower <= 0) return null;
  for (const bloc of blocs) {
    const memberKeys = bloc.members.map((n) => stablePart(n));
    const holdsGoverning = memberKeys.some((k) => byKey.get(k)?.isGoverning === true);
    if (!holdsGoverning) continue;
    const share = memberKeys.reduce((s, k) => s + (byKey.get(k)?.power || 0), 0) / totalPower;
    if (share >= SETTLEMENT_POLITICS_TUNING.RULING_CONSOLIDATION_FLOOR) {
      return { bloc, consolidation: round4(share) };
    }
  }
  return null;
}

/**
 * The court's CONSOLIDATION (§3 cross-seam): 0 = a fully divided court (no ruling bloc /
 * high fragmentation, CHEAP to corrupt) … 1 = one bloc commands the settlement (dear).
 * Consumed by the corruption web's recruitment-weight degrade. Dormant ⇒ 0 (byte-
 * neutral: the corruption goldens never lit it). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} cid
 * @param {PolItem | null | undefined} item
 * @returns {number}
 */
export function coalitionConsolidation01(worldState, cid, item) {
  const ruling = rulingBlocOf(worldState, cid, item);
  return ruling ? clamp01(ruling.consolidation) : 0;
}

/**
 * THE RULING-BLOC DECISION LOAD (§3, the overt §H twin): a bounded multiplier centered
 * on 1.0 that the settlement-strategy scorer applies to a move, loaded toward the ruling
 * bloc's END — the SAME kernel as warReasonFactor (1 + SPAN·pull), clamped. A revanchist
 * ruling bloc (high strain) lifts `deploy`; a commerce/doctrine bloc damps it; a survival
 * bloc lifts defensive posture. Dormant / no ruling bloc ⇒ 1.0 (byte-identical). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} cid
 * @param {PolItem | null | undefined} item
 * @param {string} moveKind  the strategy move key ('deploy'|'sue_for_peace'|'fortify'|…)
 * @returns {number}
 */
export function blocDecisionFactor(worldState, cid, item, moveKind) {
  const ruling = rulingBlocOf(worldState, cid, item);
  if (!ruling) return 1;
  const T = SETTLEMENT_POLITICS_TUNING;
  // How hard the bloc pushes: its consolidation over the floor, saturating at 1.
  const command = clamp01((ruling.consolidation - T.RULING_CONSOLIDATION_FLOOR) / Math.max(1e-6, 1 - T.RULING_CONSOLIDATION_FLOOR));
  const strain = clamp01(Number(ruling.bloc.strain) || 0);
  const move = String(moveKind || '');
  // The end→move loading table (bounded pulls in [-1, 1]; a revanchist strain adds war
  // appetite on top of the end).
  let pull = 0;
  const end = String(ruling.bloc.end || '');
  if (move === 'deploy') {
    pull = (end === 'seats' ? 0.4 : end === 'survival' ? -0.2 : end === 'commerce' ? -0.5 : end === 'doctrine' ? 0.1 : 0);
    pull += strain * 0.6; // revanchism: the term-burdened faction becomes the war party.
  } else if (move === 'sue_for_peace') {
    pull = (end === 'commerce' ? 0.5 : end === 'survival' ? 0.4 : 0) - strain * 0.5;
  } else if (move === 'fortify' || move === 'defend') {
    pull = (end === 'survival' ? 0.6 : end === 'seats' ? 0.2 : 0);
  }
  const factor = 1 + T.DECISION_LOAD_SPAN * command * clamp(pull, -1, 1);
  return round4(clamp(factor, 1 - T.DECISION_LOAD_SPAN, 1 + T.DECISION_LOAD_SPAN));
}

/**
 * A faction's REVANCHISM (§4): the accumulated bloc strain it carries as a term-burdened
 * member — its measurably-risen war appetite. Max over the blocs it belongs to. Dormant /
 * unaligned ⇒ 0. Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} cid
 * @param {string} factionName
 * @returns {number}
 */
export function factionRevanchism01(worldState, cid, factionName) {
  const key = stablePart(factionName);
  let max = 0;
  for (const bloc of settlementBlocs(worldState, cid)) {
    if (bloc.members.some((n) => stablePart(n) === key)) max = Math.max(max, clamp01(Number(bloc.strain) || 0));
  }
  return round4(max);
}

// ── §4 DIFFERENTIAL PEACE-TERM BURDEN (the revanchism input) ──────────────────────
/**
 * The differential peace-term burden a settlement bears as a treaty LOSER (0..1) — the
 * max burden01 across the terms landed on it in the treaties ledger. 0 when the peace
 * layer is dark or the settlement bears no term (byte-neutral). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} cid
 * @returns {number}
 */
function treatyBurdenFor(worldState, cid) {
  const spatial = asObject(asObject(worldState).spatialLedgers);
  const treaties = asObject(spatial.treaties);
  let burden = 0;
  for (const k of Object.keys(treaties).sort(compareCodepoint)) {
    const t = asObject(treaties[k]);
    if (String(t.loserId ?? '') !== String(cid)) continue;
    const terms = Array.isArray(t.terms) ? t.terms : [];
    for (const term of terms) {
      const b = Number(asObject(term).burden01);
      if (Number.isFinite(b)) burden = Math.max(burden, clamp01(b));
    }
  }
  return burden;
}

// ── THE MOVER (§2 formation / §4 strain-fragmentation / §5 guardrails) ─────────────

/**
 * @typedef {Object} PoliticsResult
 * @property {Record<string, unknown>} worldState  the (possibly) updated worldState (politicsLedgers)
 * @property {boolean} changed
 * @property {Array<{ cid: string, kind: 'formed'|'realigned'|'fractured'|'exposed'|'deferred', blocId: string, detail: string }>} receipts
 *   the DM-truth transition receipts (E0-classed events) — observable in the mover output.
 */

/**
 * Advance the settlement-politics layer one tick (§2/§4). For each settlement, codepoint-
 * sorted: re-validate its blocs against the live faction roster (a vanished member drops;
 * a sub-MIN bloc dissolves — the rename-safe membership law), accrue/relax strain from
 * differential peace-term burden, fire the defection windows (succession dissolves
 * people-held blocs; strain fractures), then consider ONE new formation under the cap via
 * a §H loaded draw over the pair affinities (the people gate it — a leader rivalry
 * blocks). Hysteresis as law: a bloc must hold MIN_DWELL_TICKS before it dissolves for a
 * non-triggering reason. DORMANT ⇒ an IMMEDIATE no-op (no fork, no ledger).
 * @param {{ snapshot: PolSnapshot, worldState: Record<string, unknown>, rng?: RngLike, tick: number }} args
 * @returns {PoliticsResult}
 */
export function advanceSettlementPolitics({ snapshot, worldState, rng = null, tick }) {
  // ── DORMANCY GATE: absent ⇒ an immediate no-op. No fork, no ledger. ──
  if (!settlementPoliticsActive(worldState)) {
    return { worldState, changed: false, receipts: [] };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const T = SETTLEMENT_POLITICS_TUNING;
  const npcStates = asObject(worldState.npcStates);
  const factionStates = asObject(worldState.factionStates);

  // Group factionStates by settlementId, name-keyed by stablePart(name).
  /** @type {Map<string, Record<string, unknown>>} */
  const statesBySettlement = new Map();
  for (const fid of Object.keys(factionStates).sort(compareCodepoint)) {
    const st = asObject(factionStates[fid]);
    const sid = String(st.settlementId ?? '');
    if (!sid) continue;
    const key = stablePart(String(st.name || stripSavePrefix(fid)));
    if (!statesBySettlement.has(sid)) statesBySettlement.set(sid, {});
    const bucket = /** @type {Record<string, unknown>} */ (statesBySettlement.get(sid));
    if (!(key in bucket)) bucket[key] = st;
  }

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const liveIds = new Set(items.map((s) => String(s.id)));
  const prevLedgers = asObject(worldState.politicsLedgers);
  /** @type {Record<string, SettlementPoliticsLedger>} */
  const nextLedgers = {};
  /** @type {PoliticsResult['receipts']} */
  const receipts = [];

  // Iterate settlements in codepoint order (deterministic fold).
  for (const item of [...items].sort((a, b) => compareCodepoint(String(a.id), String(b.id)))) {
    const cid = String(item.id);
    const states = statesBySettlement.get(cid) || {};
    const views = factionViews(item, states);
    if (views.length < T.MIN_BLOC_MEMBERS) continue; // nothing to coalesce.
    const viewByKey = new Map(views.map((v) => [v.key, v]));
    const relRaw = asObject(item ? item.settlement : null).relationships;
    const relationships = Array.isArray(relRaw) ? /** @type {Array<Record<string, unknown>>} */ (relRaw) : [];
    const underThreat = settlementUnderThreat(item, worldState, /** @type {{ regionalGraph?: unknown }} */ (snapshot)?.regionalGraph, cid);
    const burden = treatyBurdenFor(worldState, cid);
    // §4 fragmentation-propensity as a CHARACTER STATE: the governing power's kind sets
    // the texture. An AUTARCHY suppresses overt opposition — an opposition bloc there is
    // driven COVERT (a conspiracy, discovered via the exposure machinery).
    const govView = views.find((v) => v.isGoverning) || [...views].sort((a, b) => (b.power - a.power) || compareCodepoint(a.key, b.key))[0] || null;
    const isAutarchy = govView ? rulingPowerFromArchetype(govView.archetype) === 'autocrat' : false;

    const prevEntry = asObject(prevLedgers[cid]);
    const prevBlocs = Array.isArray(prevEntry.blocs) ? /** @type {Bloc[]} */ (prevEntry.blocs) : [];

    /** @type {Bloc[]} */
    const blocs = [];
    /** The faction keys already committed to a surviving bloc (a faction joins ≤1 bloc). */
    const committed = new Set();

    // ── PASS 1: re-validate + strain + defection windows on the EXISTING blocs. ──
    for (const prev of prevBlocs) {
      const liveMembers = (Array.isArray(prev.members) ? prev.members : [])
        .filter((n) => viewByKey.has(stablePart(n)));
      // MEMBERSHIP LAW: a vanished member drops; a sub-MIN bloc dissolves.
      if (liveMembers.length < T.MIN_BLOC_MEMBERS) {
        receipts.push({ cid, kind: 'fractured', blocId: prev.id, detail: 'the bloc lost its members and dissolved' });
        continue;
      }
      const memberViews = liveMembers.map((n) => /** @type {NonNullable<ReturnType<typeof viewByKey.get>>} */ (viewByKey.get(stablePart(n))));
      const age = now - Math.max(0, finiteNumber(prev.sinceTick, now));
      const glueType = String(prev.glue?.[0]?.type || 'concession');
      const peopleHeld = glueType === 'patronage';

      // SUCCESSION defection (§4): a people-held bloc evaporates when a member's leader
      // seat changed hands (the §G seat/people law). Detect via the leaderNpcId drift
      // recorded on the bloc's members snapshot.
      const prevLeaders = asObject(asObject(prev).leaderNpcIds);
      let succession = false;
      for (const mv of memberViews) {
        const was = prevLeaders[mv.key];
        if (was != null && String(was) !== String(mv.leaderNpcId ?? '')) { succession = true; break; }
      }
      if (peopleHeld && succession && age >= T.MIN_DWELL_TICKS) {
        receipts.push({ cid, kind: 'fractured', blocId: prev.id, detail: 'a leader who bound the bloc left the seat; the personal loyalty went with them' });
        continue;
      }

      // EXPOSURE detonation (§4): a compromise-glue bloc whose leash is now REVEALED
      // shatters + fires the scandal receipt. Revealed ⇒ the leash is no longer covert.
      if (glueType === 'compromise') {
        const revealed = memberViews.some((mv) => {
          if (!mv.leaderNpcId) return false;
          const st = asObject(npcStates[mv.leaderNpcId]);
          const leash = asObject(st.corruptionLeash);
          return leash.revealed === true || leash.covert === false || st.exposed === true;
        });
        if (revealed) {
          receipts.push({ cid, kind: 'exposed', blocId: prev.id, detail: 'the leash was dragged into the light — the bloc shattered in scandal' });
          continue;
        }
      }

      // CONSPIRACY DISCOVERY (§4, the covert→revealed path): a COVERT conspiracy cannot
      // hide forever under a watchful autarch. Each tick it faces an E0 discovery draw,
      // ramped toward certainty as the plot matures; a hit drags it into the light (an
      // 'exposed' receipt) and the autarch crushes it. Reuses the covert/revealed
      // vocabulary whole (§4). No draw when there is no rng (deterministic no-op).
      if (prev.covert === true) {
        const fork = rng && typeof rng.fork === 'function' ? rng.fork(`${politicsForkKey(cid, now)}:discover:${prev.id}`) : null;
        const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
        const maturity = 1 + Math.min(age, T.DISCOVERY_MATURE_TICKS) / T.DISCOVERY_MATURE_TICKS;
        if (u < clamp01(T.DISCOVERY_BASE * maturity)) {
          receipts.push({ cid, kind: 'exposed', blocId: prev.id, detail: 'the conspiracy was uncovered — the plot dragged into the light and broken' });
          continue;
        }
      }

      // STRAIN accrual/relaxation (§4). Differential burden lands hardest on the non-
      // governing economic member (someone's warehouses pay the tribute); an external
      // rally relieves it (a besieged bloc closes ranks). Relax toward 0 otherwise.
      const bearsBurden = burden > 0 && memberViews.some((mv) => !mv.isGoverning && (mv.archetype === 'merchant' || mv.archetype === 'craft' || mv.archetype === 'labor'));
      let strain = clamp01(Number(prev.strain) || 0);
      if (bearsBurden && !underThreat) strain = clamp01(strain + T.STRAIN_BURDEN_W * burden);
      else strain = clamp01(strain - T.STRAIN_RELAX * (underThreat ? 2 : 1));

      // THREAT-END dissolution (§4): a survival/threat bloc dissolves when the danger
      // lifts (past the dwell — hysteresis).
      if (glueType === 'threat' && !underThreat && age >= T.MIN_DWELL_TICKS) {
        receipts.push({ cid, kind: 'fractured', blocId: prev.id, detail: 'the danger passed; the survival bloc had nothing left to bind it' });
        continue;
      }

      // STRAIN fracture (§4): a bloc past the fracture threshold breaks (past dwell).
      if (strain >= T.STRAIN_FRACTURE_AT && age >= T.MIN_DWELL_TICKS) {
        receipts.push({ cid, kind: 'fractured', blocId: prev.id, detail: 'the differential burden broke the bloc — its bearer becomes the revanchist party' });
        continue;
      }

      // OUTBIDDING (§4): SEAT-HELD (concession) glue is a MARKET. A member is lured away
      // when a NON-member suitor offers an equal-or-better aligned deal AND commands
      // clearly more power than the member's current best partner (the richer patron wins
      // the seat). People-held/compromise/doctrine glue is NOT market-outbiddable.
      let survivingViews = memberViews;
      if (glueType === 'concession' && age >= T.MIN_DWELL_TICKS && memberViews.length >= 2) {
        const memberKeys = new Set(memberViews.map((mv) => mv.key));
        const outsiders = views.filter((v) => !memberKeys.has(v.key) && !committed.has(v.key));
        /** @type {string | null} */
        let outbidReceipt = null;
        survivingViews = memberViews.filter((mv) => {
          if (outbidReceipt) return true; // one outbid per bloc per tick (an event, not churn).
          const partners = memberViews.filter((o) => o.key !== mv.key);
          const partnerPower = partners.reduce((p, o) => Math.max(p, o.power), 0);
          const internalPull = partners.reduce((p, o) => Math.max(p, pairInterest(mv, o, null)), 0);
          for (const f of outsiders) {
            const offer = pairInterest(mv, f, null);
            if (offer >= internalPull - 1e-6 && f.power >= partnerPower * (1 + T.OUTBID_POWER_MARGIN)) {
              outbidReceipt = `${f.name} outbid the bloc for ${mv.name}'s seat — the richer suitor took the concession`;
              return false; // outbid — the member defects.
            }
          }
          return true;
        });
        if (outbidReceipt) {
          if (survivingViews.length < T.MIN_BLOC_MEMBERS) {
            receipts.push({ cid, kind: 'fractured', blocId: prev.id, detail: outbidReceipt });
            continue;
          }
          receipts.push({ cid, kind: 'realigned', blocId: prev.id, detail: outbidReceipt });
        }
      }

      // SURVIVE: re-derive the end (member interests may have shifted seats/goals) and
      // carry the bloc forward with the surviving members + strain.
      const memberNames = survivingViews.map((mv) => mv.name).sort(compareCodepoint);
      const end = deriveEnd(survivingViews, npcStates, underThreat);
      /** @type {Bloc & { leaderNpcIds: Record<string, string> }} */
      const kept = {
        id: blocId(memberNames),
        members: memberNames,
        glue: Array.isArray(prev.glue) && prev.glue.length ? prev.glue : [{ type: 'concession', detail: 'a working majority' }],
        end,
        strain: round4(strain),
        sinceTick: Math.max(0, finiteNumber(prev.sinceTick, now)),
        ...(prev.covert === true ? { covert: true } : {}),
        leaderNpcIds: Object.fromEntries(survivingViews.map((mv) => [mv.key, String(mv.leaderNpcId ?? '')])),
      };
      if (end !== prev.end) receipts.push({ cid, kind: 'realigned', blocId: kept.id, detail: `the bloc's aim shifted to ${end}` });
      blocs.push(kept);
      for (const mv of survivingViews) committed.add(mv.key);
    }

    // ── PASS 2: consider ONE new formation (under the cap) via a §H loaded draw. ──
    const floor = underThreat ? T.FORMATION_AFFINITY_FLOOR * (1 - T.THREAT_RALLY_RELIEF) : T.FORMATION_AFFINITY_FLOOR;
    const free = views.filter((v) => !committed.has(v.key));
    if (blocs.length < T.MAX_BLOCS_PER_SETTLEMENT) {
      // Score every uncommitted, distinct faction pair; keep the strict max (codepoint
      // stable) both for the FINAL score (formation) and, separately, the best pair whose
      // INTERESTS align but whose LEADERS block it (the headline deferral).
      /** @type {{ a: typeof free[number], b: typeof free[number], score: number, tie: ReturnType<typeof leaderTiePosture> } | null} */
      let best = null;
      /** @type {{ a: typeof free[number], b: typeof free[number], interest: number, reason: string } | null} */
      let bestBlocked = null;
      for (let i = 0; i < free.length; i += 1) {
        for (let j = i + 1; j < free.length; j += 1) {
          const a = free[i];
          const b = free[j];
          const tie = leaderTiePosture(relationships, npcStates, a.leaderNpcId, b.leaderNpcId);
          const kinship = leaderAlignmentKinship(npcStates, a.leaderNpcId, b.leaderNpcId);
          const interest = pairInterest(a, b, kinship);
          const score = applyTie(interest, tie);
          if (!best || score > best.score
            || (score === best.score && compareCodepoint(a.key, best.a.key) < 0)) {
            best = { a, b, score, tie };
          }
          // The LEADER-RIVALRY BLOCK deferral: interests would clear the floor, but the
          // people keep them apart ("they need each other, and she will not sit at his
          // table"). Tracked whether the block is hard (score 0) or soft.
          if (tie.posture < 0 && interest >= floor
            && (!bestBlocked || interest > bestBlocked.interest)) {
            bestBlocked = { a, b, interest, reason: tie.reason };
          }
        }
      }
      if (best && best.score >= floor) {
        // E0 loaded draw: rare baseline ramped by affinity² (the drama-class tempo — a
        // formation is an event, not weekly churn). A miss DEFERS (visible), retried.
        const fork = rng && typeof rng.fork === 'function' ? rng.fork(`${politicsForkKey(cid, now)}:${best.a.key}+${best.b.key}`) : null;
        const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
        const pForm = clamp01(T.FORMATION_BASE * best.score * best.score);
        if (u < pForm) {
          const members = [best.a, best.b];
          const { glue, covert } = classifyGlue({ members, npcStates, tie: best.tie, underThreat });
          const memberNames = members.map((m) => m.name).sort(compareCodepoint);
          const id = blocId(memberNames);
          const end = deriveEnd(members, npcStates, underThreat);
          // §4 CONSPIRACY: under an autarchy, an OPPOSITION bloc (one excluding the
          // governing seat) cannot organise in the open — it forms COVERT (a conspiracy,
          // discovered later via the exposure machinery). A ruling clique (containing the
          // governing seat) forms overt. Compromise glue is covert regardless.
          const excludesGov = govView ? !members.some((m) => m.key === govView.key) : true;
          const conspiracy = isAutarchy && excludesGov;
          const covertFinal = covert || conspiracy;
          /** @type {Bloc & { leaderNpcIds: Record<string, string> }} */
          const formed = {
            id,
            members: memberNames,
            glue: [glue],
            end,
            strain: 0,
            sinceTick: now,
            ...(covertFinal ? { covert: true } : {}),
            leaderNpcIds: Object.fromEntries(members.map((m) => [m.key, String(m.leaderNpcId ?? '')])),
          };
          blocs.push(formed);
          committed.add(best.a.key);
          committed.add(best.b.key);
          receipts.push({ cid, kind: 'formed', blocId: id, detail: conspiracy ? `${memberNames.join(' + ')} conspire covertly against the autarch toward ${end}` : `${memberNames.join(' + ')} coalesce on ${glue.type} toward ${end}` });
        } else {
          receipts.push({ cid, kind: 'deferred', blocId: blocId([best.a.name, best.b.name]), detail: 'the alignment is there; the moment has not come' });
        }
      } else if (bestBlocked) {
        receipts.push({ cid, kind: 'deferred', blocId: blocId([bestBlocked.a.name, bestBlocked.b.name]), detail: `${bestBlocked.a.name} and ${bestBlocked.b.name} need each other — ${bestBlocked.reason} keeps them apart` });
      }
    } else if (free.length >= T.MIN_BLOC_MEMBERS) {
      // CAP: a fourth bloc cannot form — a visible E0 deferral (the depth-cap pin).
      receipts.push({ cid, kind: 'deferred', blocId: '', detail: 'the settlement already holds three blocs — a fourth alignment is held at the cap' });
    }

    if (blocs.length) {
      // Strip the internal leaderNpcIds bookkeeping key order stays stable; codepoint-
      // sort blocs by id for byte-stable serialization.
      nextLedgers[cid] = { blocs: blocs.sort((x, y) => compareCodepoint(x.id, y.id)) };
    }
  }

  // Drop cids for settlements no longer live (a removed settlement's ledger dangles).
  for (const cid of Object.keys(nextLedgers)) {
    if (!liveIds.has(cid)) delete nextLedgers[cid];
  }

  // ── PERSIST (serialize-compare + drop-when-empty ⇒ byte-identical dormant). ──
  const hasNext = Object.keys(nextLedgers).length > 0;
  const prevSer = JSON.stringify(Object.keys(prevLedgers).length ? sortLedgers(prevLedgers) : null);
  const nextSer = JSON.stringify(hasNext ? sortLedgers(nextLedgers) : null);
  if (prevSer === nextSer) {
    return { worldState, changed: false, receipts };
  }
  if (hasNext) {
    return { worldState: { ...worldState, politicsLedgers: sortLedgers(nextLedgers) }, changed: true, receipts };
  }
  // Drained to empty: drop the key (byte-identical-dormant).
  const { politicsLedgers: _drop, ...rest } = /** @type {Record<string, unknown>} */ (worldState);
  return { worldState: rest, changed: true, receipts };
}

/** Codepoint-sort a politicsLedgers map (keys + each settlement's blocs) for byte-stable
 *  serialization. Accepts both the typed next-ledger and the raw prev-ledger.
 *  @param {Record<string, unknown>} ledgers @returns {Record<string, { blocs: Bloc[] }>} */
function sortLedgers(ledgers) {
  /** @type {Record<string, { blocs: Bloc[] }>} */
  const out = {};
  for (const cid of Object.keys(ledgers).sort(compareCodepoint)) {
    const blocsRaw = asObject(ledgers[cid]).blocs;
    const blocs = Array.isArray(blocsRaw) ? /** @type {Bloc[]} */ ([...blocsRaw]) : [];
    out[cid] = { blocs: blocs.sort((x, y) => compareCodepoint(String(x.id), String(y.id))) };
  }
  return out;
}

// ── §B leader alignment kinship (for the quadrant gate) ───────────────────────────
/**
 * The alignment kinship (0 opposite … 1 kindred) between two faction leaders, from their
 * npcState alignment coords when present. null ⇒ unknown (the quadrant defaults neutral).
 * Exported for the r2 politics-psychology-1 pin (the categorical-string resolution).
 * @param {Record<string, unknown>} npcStates
 * @param {string|null} aId @param {string|null} bId @returns {number|null}
 */
export function leaderAlignmentKinship(npcStates, aId, bId) {
  if (!aId || !bId) return null;
  const a = alignmentAxes(asObject(npcStates[aId]));
  const b = alignmentAxes(asObject(npcStates[bId]));
  if (!a || !b) return null;
  // Manhattan distance over the two 0..1 axes → kinship = 1 - dist/2.
  const dist = (Math.abs(a.law - b.law) + Math.abs(a.good - b.good)) / 2;
  return clamp01(1 - dist);
}

/** Extract 0..1 law/good axes from an npcState alignment, tolerant of shapes.
 *  npcStates carries a CATEGORICAL STRING ('lawful_good', 'true_neutral',
 *  'corrupted_chaotic_evil', …) written by ensureNpcStates (npcAgency.js) — parse THAT first
 *  (r2 politics-psychology-1): the prior code ran asObject('lawful_good') → {} → law/good NaN →
 *  null, so §B leader-alignment kinship never resolved and the quadrant gate collapsed to a
 *  constant. Law: lawful→1, chaotic→0, else (neutral/true)→0.5. Good: good→1, evil→0, else→0.5.
 *  The 'corrupted_' prefix rides along harmlessly (substring match on the base axis words).
 *  A numeric {law,good}/{lawfulness,morality} object or malice01/lawfulness01 scalar is still
 *  honoured for forward-compat, with the ternary now correctly parenthesised. */
/** @param {Record<string, unknown>} st @returns {{ law: number, good: number }|null} */
function alignmentAxes(st) {
  const alRaw = st.alignment;
  if (typeof alRaw === 'string' && alRaw) {
    const s = alRaw.toLowerCase();
    const law = s.includes('lawful') ? 1 : s.includes('chaotic') ? 0 : 0.5;
    const good = s.includes('good') ? 1 : s.includes('evil') ? 0 : 0.5;
    return { law, good };
  }
  const al = asObject(alRaw);
  const law = Number(al.law ?? al.lawfulness ?? al.order ?? st.lawfulness01);
  // Parenthesised (the prior `a ?? b ?? c != null ? … : …` misparsed as `(a ?? b ?? (c!=null)) ? …`):
  const goodSource = (al.good ?? al.morality) != null
    ? (al.good ?? al.morality)
    : (st.malice01 != null ? 1 - Number(st.malice01) : NaN);
  const good = Number(goodSource);
  if (Number.isFinite(law) && Number.isFinite(good)) return { law: clamp01(law), good: clamp01(good) };
  return null;
}
