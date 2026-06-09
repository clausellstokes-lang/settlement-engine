/**
 * domain/corruption.js — pure substrate for the NPC/faction corruption system.
 *
 * Corruption is gated, hazard-driven, and DAMPED so it reaches an equilibrium a
 * DM can push either way rather than a death spiral:
 *   • An NPC is only ELIGIBLE if they carry a corruptible personality flaw AND
 *     the settlement has at least one criminal institution present.
 *   • Onset is a per-tick HAZARD (compounds over time), scaled UP by crime
 *     pressure and DOWN by internal security + prosperity.
 *   • Organic EXPOSURE is the counter-force: it rises with security + prosperity
 *     (a healthy settlement self-cleans) and falls with thieves-guild strength
 *     (a captured one shields its own). This is what keeps the loop bounded.
 *
 * All functions are pure (no rng, no store, no Date) — the rng draw happens at
 * the call site (generation pipeline rng / world-pulse rng.fork) so replays stay
 * deterministic. Inputs are normalized 0..1 (crime, security, prosperity,
 * guildStrength, visibility); the adapters that read a settlement's
 * safetyProfile / economicState / causal scores live with their callers.
 */

// ── Eligibility: corruptible flaws → corruption vector ──────────────────────
// Maps the susceptible NPC personality flaws (from npcData.js negative+neutral)
// to the engine's corruption vectors {greed, hunger_for_status, fear,
// forbidden_patron, fanaticism}. A flaw NOT in this map is not corruptible.
const FLAW_VECTOR = Object.freeze({
  greedy: 'greed',
  corrupt: 'greed',
  'self-serving': 'greed',
  ruthless: 'greed',
  callous: 'greed',
  'cold-blooded': 'greed',
  ambitious: 'hunger_for_status',
  calculating: 'hunger_for_status',
  opportunistic: 'hunger_for_status',
  vain: 'hunger_for_status',
  cowardly: 'fear',
  suspicious: 'fear',
  paranoid: 'fear',
  deceitful: 'forbidden_patron',
  manipulative: 'forbidden_patron',
  mendacious: 'forbidden_patron',
  cynical: 'forbidden_patron',
});

export const CORRUPTIBLE_FLAWS = Object.freeze(Object.keys(FLAW_VECTOR));

export function isCorruptibleFlaw(flaw) {
  if (!flaw) return false;
  return Object.prototype.hasOwnProperty.call(FLAW_VECTOR, String(flaw).toLowerCase());
}

/** Corruption vector for a flaw; defaults to 'greed' for an unmapped value. */
export function corruptionVectorForFlaw(flaw) {
  return FLAW_VECTOR[String(flaw || '').toLowerCase()] || 'greed';
}

/** The NPC's corruptible flaw (lowercased) if any, else null. Reads the common
 *  shapes: npc.personality.flaw, npc.flaw, npc.personality.dominant. */
export function npcCorruptibleFlaw(npc) {
  const candidates = [npc?.personality?.flaw, npc?.flaw, npc?.personality?.dominant];
  for (const c of candidates) {
    if (isCorruptibleFlaw(c)) return String(c).toLowerCase();
  }
  return null;
}

// ── Damped probability model (tunable in one place) ─────────────────────────
export const CORRUPTION_TUNING = Object.freeze({
  // Generation-time roll for an eligible NPC when a criminal institution exists.
  spawn: { base: 0.10, crime: 0.35, security: 0.20, prosperity: 0.15, min: 0.02, max: 0.60 },
  // Per-(month-equivalent)-tick onset hazard for a clean eligible NPC.
  onset: { base: 0.04, crime: 0.12, security: 0.08, prosperity: 0.06, min: 0.005, max: 0.25 },
  // Per-tick organic exposure of a corrupt NPC — the self-cleaning counter-force.
  exposure: { base: 0.05, security: 0.20, prosperity: 0.12, guild: 0.22, visibility: 0.06, min: 0.01, max: 0.50 },
  // Once a corrupt NPC has eroded to 'notable', each further exposure rolls this
  // (very low) chance to be outed entirely + replaced by a fresh NPC.
  outReplaceAtNotable: 0.08,
});

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const n01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);

/**
 * Generation-time corruption probability for an ELIGIBLE NPC with a criminal
 * institution present. Caller must check eligibility + criminal presence first.
 * @param {{crime?:number, security?:number, prosperity?:number}} climate
 */
export function spawnCorruptionChance({ crime = 0, security = 0.5, prosperity = 0.5 } = {}) {
  const t = CORRUPTION_TUNING.spawn;
  const p = t.base + n01(crime) * t.crime - n01(security) * t.security - n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

/**
 * Per-tick onset hazard for a clean eligible NPC (criminal institution present).
 * Independent per-NPC rolls make the settlement's corrupt FRACTION saturate
 * naturally (corrupt NPCs stop rolling), so no explicit logistic is needed here.
 */
export function onsetHazard({ crime = 0, security = 0.5, prosperity = 0.5 } = {}) {
  const t = CORRUPTION_TUNING.onset;
  const p = t.base + n01(crime) * t.crime - n01(security) * t.security - n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

/**
 * Per-tick organic exposure probability for a corrupt NPC. Rises with security +
 * prosperity and the NPC's visibility (standing); falls with guild strength.
 * @param {{security?:number, prosperity?:number, guildStrength?:number, visibility?:number}} args
 */
export function exposureChance({ security = 0.5, prosperity = 0.5, guildStrength = 0, visibility = 0.5 } = {}) {
  const t = CORRUPTION_TUNING.exposure;
  const p = t.base
    + n01(security) * t.security
    + n01(prosperity) * t.prosperity
    - n01(guildStrength) * t.guild
    + n01(visibility) * t.visibility;
  return clamp(p, t.min, t.max);
}

// ── Standing ladder (for exposure-driven demotion) ──────────────────────────
// Importance tiers (entities/npcs.js): pillar > key > notable > minor.
export const IMPORTANCE_LADDER = Object.freeze(['pillar', 'key', 'notable', 'minor']);

/** Demote one importance step (floor = minor). Unknown → 'notable'. */
export function demoteImportance(importance) {
  const i = IMPORTANCE_LADDER.indexOf(importance);
  if (i < 0) return 'notable';
  return IMPORTANCE_LADDER[Math.min(IMPORTANCE_LADDER.length - 1, i + 1)];
}

/** Demote one dotRank step (3=leader → 2=lieutenant → 1=agent; floor = 1). */
export function demoteDotRank(dotRank) {
  return Math.max(1, (Number(dotRank) || 1) - 1);
}

/** A corrupt NPC eroded to 'notable' (or lower) is eligible to be outed+replaced. */
export function canBeOuted(importance) {
  return importance === 'notable' || importance === 'minor';
}

// ── Settlement → climate adapter ────────────────────────────────────────────
// Reads the corruption climate off a generated settlement: normalized crime /
// security / prosperity (0..1), whether a criminal institution is present, and
// the criminal-institution names (for second-relation matching). Defensive — any
// missing field degrades to a neutral default rather than throwing. No rng/Date.
const CRIMINAL_NAME_RE = /thieves|criminal|gang|smuggl|fence|black\s*market|underworld|assassin|syndicate|racket/i;
const PROSPERITY_SCORE = Object.freeze({
  subsistence: 0.0, destitute: 0.0, poor: 0.2, struggling: 0.2, meager: 0.2,
  moderate: 0.4, modest: 0.4, stable: 0.45, comfortable: 0.6,
  prosperous: 0.8, thriving: 0.8, wealthy: 1.0, affluent: 1.0, opulent: 1.0,
});

function prosperityScore(value) {
  const s = String(value || '').toLowerCase();
  for (const [k, v] of Object.entries(PROSPERITY_SCORE)) { if (s.includes(k)) return v; }
  return 0.4; // unknown → middling
}

function isCriminalInstitution(inst) {
  if (!inst) return false;
  if (CRIMINAL_NAME_RE.test(String(inst.name || ''))) return true;
  if (/criminal/i.test(String(inst.category || ''))) return true;
  const tags = Array.isArray(inst.tags) ? inst.tags : [];
  return tags.some((t) => /criminal/i.test(String(t)));
}

/**
 * @param {object} settlement
 * @returns {{crime:number, security:number, prosperity:number, hasCriminalInst:boolean, criminalInstitutions:string[]}}
 */
export function readCorruptionClimate(settlement) {
  const eco = settlement?.economicState || {};
  const sp = eco.safetyProfile || settlement?.safetyProfile || {};
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];

  const criminalInstitutions = institutions.filter(isCriminalInstitution).map((i) => i.name).filter(Boolean);
  const hasCriminalInst = criminalInstitutions.length > 0
    || (Array.isArray(sp.criminalInstitutions) && sp.criminalInstitutions.length > 0);

  const crimEff = Number(sp?.compound?.criminalEffective);
  const crime = Number.isFinite(crimEff) ? n01(crimEff / 100)
    : Number.isFinite(sp.blackMarketCapture) ? n01(sp.blackMarketCapture / 80)
      : 0.3;

  // safetyRatio = militaryEffective / criminalEffective (≈0..3+). Map to 0..1.
  const safetyRatio = Number.isFinite(sp.safetyRatio) ? sp.safetyRatio : 1;
  const security = n01(safetyRatio / 2.5);

  return {
    crime,
    security,
    prosperity: prosperityScore(eco.prosperity),
    hasCriminalInst,
    criminalInstitutions,
  };
}
