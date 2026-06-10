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

import { institutionHasTag, TAG } from '../lib/entities.js';

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
  // `exposurePenalty`: each PRIOR exposure (organic or DM) makes re-corruption
  // progressively harder (a burned official is warier + more watched).
  onset: { base: 0.04, crime: 0.12, security: 0.08, prosperity: 0.06, exposurePenalty: 0.6, min: 0.005, max: 0.25 },
  // Per-tick organic exposure of a corrupt NPC — the self-cleaning counter-force.
  // `repeatBoost`: each prior exposure makes re-exposure EASIER (a known repeat
  // offender draws more scrutiny once they relapse).
  exposure: { base: 0.05, security: 0.20, prosperity: 0.12, guild: 0.22, visibility: 0.06, repeatBoost: 0.35, min: 0.01, max: 0.50 },
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
export function onsetHazard({ crime = 0, security = 0.5, prosperity = 0.5, priorExposures = 0 } = {}) {
  const t = CORRUPTION_TUNING.onset;
  let p = t.base + n01(crime) * t.crime - n01(security) * t.security - n01(prosperity) * t.prosperity;
  // A burned official is warier + more watched: each prior exposure makes
  // re-corruption progressively harder (diminishing, never zero).
  p /= 1 + t.exposurePenalty * Math.max(0, priorExposures);
  return clamp(p, t.min, t.max);
}

/**
 * Per-tick organic exposure probability for a corrupt NPC. Rises with security +
 * prosperity and the NPC's visibility (standing); falls with guild strength.
 * @param {{security?:number, prosperity?:number, guildStrength?:number, visibility?:number, priorExposures?:number}} args
 */
export function exposureChance({ security = 0.5, prosperity = 0.5, guildStrength = 0, visibility = 0.5, priorExposures = 0 } = {}) {
  const t = CORRUPTION_TUNING.exposure;
  let p = t.base
    + n01(security) * t.security
    + n01(prosperity) * t.prosperity
    - n01(guildStrength) * t.guild
    + n01(visibility) * t.visibility;
  // A repeat offender draws more scrutiny: each prior exposure makes re-exposure easier.
  p *= 1 + t.repeatBoost * Math.max(0, priorExposures);
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

// ── Faction capture ladder (Phase 2) ────────────────────────────────────────
// Reuses the engine's existing criminalCaptureState vocabulary. A faction with
// corrupt seat-holders climbs toward 'capture'; one that's been cleaned recedes
// toward 'none'. Higher the corrupt member's seat, the faster it climbs.
export const CAPTURE_LADDER = Object.freeze(['none', 'adversarial', 'equilibrium', 'corrupted', 'capture']);

/** Step the ladder one rung up (toward capture) or down (toward none). */
export function advanceCaptureState(state, up) {
  const i = CAPTURE_LADDER.indexOf(state);
  const cur = i < 0 ? 0 : i;
  const next = up ? Math.min(CAPTURE_LADDER.length - 1, cur + 1) : Math.max(0, cur - 1);
  return CAPTURE_LADDER[next];
}

export const CAPTURE_TUNING = Object.freeze({
  advance: { base: 0.05, rank: 0.15, security: 0.08, prosperity: 0.05, min: 0.01, max: 0.40 },
  recover: { base: 0.04, security: 0.12, prosperity: 0.08, min: 0.02, max: 0.40 },
});

/** Per-tick chance a faction with a corrupt seat-holder climbs the ladder. The
 *  corrupt member's seat rank (1=agent..3=leader) drives it; security+prosperity
 *  damp it. */
export function captureAdvanceChance({ rank = 1, security = 0.5, prosperity = 0.5 } = {}) {
  const t = CAPTURE_TUNING.advance;
  const p = t.base + n01((Number(rank) || 1) / 3) * t.rank - n01(security) * t.security - n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

/** Per-tick chance a faction with NO corrupt seat-holders recedes toward 'none'
 *  — the faction-level self-cleaning, rising with security + prosperity. */
export function captureRecoverChance({ security = 0.5, prosperity = 0.5 } = {}) {
  const t = CAPTURE_TUNING.recover;
  const p = t.base + n01(security) * t.security + n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

// ── Thieves-guild power loop (Phase 3) ──────────────────────────────────────
// The guild's strength accrues from the factions it has captured — their POWER
// and their DIVERSITY — but SATURATES (exp curve) so it can never run away. A
// stronger guild drags effective security down (the feedback loop) but only by a
// bounded fraction, and is hard-capped on legitimacy: it can out-rank on power,
// never on legitimacy.
export const GUILD_TUNING = Object.freeze({
  powerRate: 0.9,       // saturation rate for captured-power share → strength
  diversityFull: 4,     // distinct captured factions for the full diversity bonus
  securityDrag: 0.5,    // a max-strength guild HALVES effective security (bounded floor)
  legitimacyCap: 25,    // guild legitimacy is hard-capped here — never legitimate
  powerFloorBase: 30,   // criminal-faction power floor base…
  powerFloorRange: 55,  // …+ strength × range (up to ~85 at full strength)
});

/**
 * Guild strength (0..1) from the factions it has captured. Saturating in total
 * captured power (so it asymptotes, never runs away) and lifted by diversity
 * (crime spread across many factions is harder to root out than one).
 * @param {{capturedPowers?:number[], distinctArchetypes?:number}} args
 */
export function guildStrength({ capturedPowers = [], distinctArchetypes = 0 } = {}) {
  const totalShare = (Array.isArray(capturedPowers) ? capturedPowers : [])
    .reduce((a, p) => a + n01((Number(p) || 0) / 100), 0);
  const base = 1 - Math.exp(-totalShare * GUILD_TUNING.powerRate); // saturating
  const diversityMult = 0.6 + 0.4 * Math.min(1, (Number(distinctArchetypes) || 0) / GUILD_TUNING.diversityFull);
  return clamp(base * diversityMult, 0, 1);
}

/** Effective security after the guild's drag — bounded so it never reaches zero. */
export function guildEffectiveSecurity(security, strength) {
  return n01(n01(security) * (1 - n01(strength) * GUILD_TUNING.securityDrag));
}

// ── Settlement → climate adapter ────────────────────────────────────────────
// Reads the corruption climate off a generated settlement: normalized crime /
// security / prosperity (0..1), whether a criminal institution is present, and
// the criminal-institution names (for second-relation matching). Defensive — any
// missing field degrades to a neutral default rather than throwing. No rng/Date.
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
  // Tag dispatch — declared 'criminal' tag OR a criminal name keyword, both
  // resolved by the centralized institutionTags map (lib/entities) — plus the
  // category signal. Replaces the local CRIMINAL_NAME_RE (its terms now live in
  // the one shared keyword map, so a rename can't silently desync this check).
  return institutionHasTag(inst, TAG.CRIMINAL) || /criminal/i.test(String(inst.category || ''));
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

// ── Corrupted-institution duality (patronage vs exposure) ───────────────────
// A corrupted security institution cuts BOTH ways:
//   • Patronage (onset side): criminals with a stooge in the watch operate
//     more freely — effective security is dragged down for ONSET suppression.
//   • Exposure (discovery side): organic exposure reads RAW security — a
//     strong watch keeps catching people even while parts of it are bought
//     (the guild's shielding is already priced into exposureChance's
//     -guildStrength term; passing dragged security in double-dipped it).
// Net dynamic: high security + corrupted institution = a purge state — fewer
// NEW corruptions than a lawless town, but a steady drum of scandals.
// Low security + corrupted institution = quiet rot toward capture.

export const SECURITY_INSTITUTION_RE = /(watch|garrison|constab|guard|magistrate|court|barracks)/i;

export const PATRONAGE_TUNING = Object.freeze({
  dragPerInstitution: 0.15,      // each compromised security institution…
  maxDrag: 0.3,                  // …capped well above the floor (security never zeroes)
  proximityVisibilityBonus: 0.25, // investigators circle a PUBLICLY corrupt institution
});

function nameMatches(a, b) {
  const x = String(a || '').trim().toLowerCase();
  const y = String(b || '').trim().toLowerCase();
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/** The home-institution fields the exposure path reads, in the same order. */
export function npcHomeInstitution(npc) {
  return npc?.factionAffiliation || npc?.factionLink || npc?.institutionId || null;
}

/**
 * Which of the settlement's security institutions are compromised, and how.
 *   covert   — an unexposed corrupt NPC is homed there (the hidden stooge);
 *              drags onset security, invisible to the public.
 *   revealed — the institution carries a 'corruption' impairment (a scandal
 *              made it public); drags onset security AND raises the exposure
 *              visibility of anyone still corrupt inside it.
 *
 * @param {object} settlement
 * @returns {{covert: string[], revealed: string[]}}
 */
export function compromisedSecurityInstitutions(settlement) {
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const securityInstitutions = institutions
    .filter((inst) => SECURITY_INSTITUTION_RE.test(String(inst?.name || '')));
  if (!securityInstitutions.length) return { covert: [], revealed: [] };

  const revealed = new Set();
  for (const inst of securityInstitutions) {
    if ((inst.impairments || []).some((imp) => imp?.type === 'corruption')) revealed.add(inst.name);
  }

  const covert = new Set();
  for (const npc of settlement?.npcs || []) {
    if (npc?.corrupt !== true || npc?.ousted) continue;
    const home = npcHomeInstitution(npc);
    if (!home) continue;
    const match = securityInstitutions.find((inst) => nameMatches(inst.name, home));
    if (match && !revealed.has(match.name)) covert.add(match.name);
  }

  return { covert: [...covert], revealed: [...revealed] };
}

/**
 * The patronage drag corrupted security institutions exert on ONSET-side
 * effective security (covert + revealed both count: a bought watch shields
 * recruits whether or not the town knows it's bought).
 *
 * @param {object} settlement
 * @returns {{drag: number, covert: string[], revealed: string[]}}
 */
export function patronageSecurityDrag(settlement) {
  const { covert, revealed } = compromisedSecurityInstitutions(settlement);
  const count = covert.length + revealed.length;
  return {
    drag: Math.min(PATRONAGE_TUNING.maxDrag, count * PATRONAGE_TUNING.dragPerInstitution),
    covert,
    revealed,
  };
}
