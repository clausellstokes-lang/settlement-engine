/**
 * defenseGenerator.js
 * Defense profile generation — fortress readiness scores across five dimensions.
 *
 * Provides:
 *  - getDefenseInstitutions: classify institutions into defense categories
 *  - computeDefenseScores: score military/monster/internal/economic/magical defense
 *  - computeDefenseReadiness: overall readiness label from scores
 *  - generateDefenseProfile: main export, assembles the full profile
 */

import {getInstFlags, getPriorities} from './helpers.js';
import {computeEffectiveMagicPresence} from './priorityHelpers.js';

// ─── getDefenseInstitutions ───────────────────────────────────────────────────
/**
 * Partition institution list into defense-relevant groups.
 *
 * @param {Array} institutions
 * @returns {{ walls, garrison, militia, watch, mercenary, charter, magicDef }}
 */
const getDefenseInstitutions = (institutions) => {
  const matches = (inst, keywords) =>
    keywords.some(kw => inst.name.toLowerCase().includes(kw));

  return {
    walls: institutions.filter(i => matches(i, [
      'wall', 'citadel', 'palisade', 'earthwork',
      'inner citadel', 'massive walls',
    ])),
    garrison: institutions.filter(i => matches(i, [
      'garrison', 'barracks', 'professional guard',
      'professional city watch', 'multiple garrison',
    ])),
    militia: institutions.filter(i => matches(i, [
      'citizen militia', 'militia',
    ])),
    watch: institutions.filter(i => matches(i, [
      'town watch', 'city watch', 'professional city watch',
    ])),
    mercenary: institutions.filter(i => matches(i, [
      'mercenary company', 'mercenary quarter', 'hired muscle',
    ])),
    charter: institutions.filter(i => matches(i, [
      "adventurers' charter hall", "adventurers' guild hall",
      "multiple adventurers'",
    ])),
    magicDef: institutions.filter(i => matches(i, [
      "wizard", "mages' guild", "mage", "academy of magic",
      "golem workforce", "alchemist",
    ])),
  };
};

// ─── computeDefenseScores ─────────────────────────────────────────────────────
/**
 * Calculate five defense dimension scores (0–100 each) from institution
 * presence, influence scores, and active stress conditions.
 *
 * Dimensions:
 *  military  — conventional force readiness (walls + garrison = highest weight)
 *  monster   — capacity to handle supernatural/creature threats
 *  internal  — civil order and law enforcement effectiveness
 *  economic  — logistical resilience (food, medicine, trade access)
 *  magical   — arcane defense and countermeasure capability
 *
 * @param {Object} inst          - Institution presence flags from getInstFlags
 * @param {number} milEffective  - Military effective score (0–100)
 * @param {number} crimEffective - Criminal effective score (0–100)
 * @param {number} econOutput    - Economy output score (0–100)
 * @param {number} magInfluence  - Magic influence score (0–100)
 * @param {number} relInfluence  - Religion influence score (0–100)
 * @param {Object} priorities    - Raw priority values
 * @param {string} threat        - Monster threat level
 * @param {Object} config        - Settlement config
 * @param {string} tier          - Settlement tier
 * @param {Array}  stressTypes   - Active stress type strings
 * @returns {{ military, monster, internal, economic, magical }}
 */
const computeDefenseScores = (
  inst, milEffective, crimEffective, econOutput, magInfluence, relInfluence,
  priorities, threat, config, tier, stressTypes = [],
) => {
  const hasStress = (type) => stressTypes.includes(type);
  const route     = config.tradeRouteAccess || 'road';
  const magicOn   = config.magicExists !== false; // no-magic mode suppresses supernatural effects
  const magPri    = magicOn ? (config.priorityMagic ?? 50) : 0;
  const relPri    = config.priorityReligion ?? 50;
  const TIER_ORD  = ['thorp','hamlet','village','town','city','metropolis'];
  const tierIdx   = TIER_ORD.indexOf(tier);

  // ── Tradition detection ─────────────────────────────────────────────────────
  const institutions = config._institutions || [];
  const hasInst = (...kws) => institutions.some(i =>
    kws.some(kw => (i.name||'').toLowerCase().includes(kw)));

  // Arcane: wizard/mage/sorcerer/enchanter
  const hasArcane   = magicOn && magPri >= 35 && (
    inst.hasMagicInst ||
    hasInst('wizard','mages','arcane','enchant','spellcasting','academy of magic','mages\' district')
  );
  // Strong arcane: organised guild-level
  const hasArcaneGuild = magicOn && magPri >= 55 && hasInst(
    'mages\' guild','wizard\'s tower','arcane academy','mages\' district','academy of magic'
  );

  // Divine: cleric/temple — uses religion priority as primary gate (not magic)
  // Suppressed in no-magic mode for supernatural effects
  const hasDivine   = magicOn && relPri >= 55 && (
    hasInst('cathedral','monastery','great cathedral','parish church') ||
    (relPri >= 65 && hasInst('shrine','temple','friary'))
  );
  // Strong divine: cathedral/monastery level
  const hasDivineStrong = magicOn && relPri >= 65 && hasInst('cathedral','monastery','great cathedral');

  // Druid/nature tradition — not route-gated, but more likely in certain contexts
  const hasDruid    = magicOn && magPri >= 30 && hasInst(
    'druid circle','grove shrine','elder grove','warden\'s lodge','sacred grove'
  );

  // Alchemy — amplifier tradition, lower magic threshold
  const hasAlchemy  = magicOn && magPri >= 15 && hasInst(
    'alchemist','apothecary district','alchemist quarter'
  );

  // ── Tier-appropriate community defense baseline (thorp/hamlet/village) ─────
  // Small settlements don't have garrison/walls — they have terrain, cohesion,
  // and community alertness. Score these directly rather than penalising absence.
  const isSmall  = ['thorp','hamlet','village'].includes(tier);
  const isThorp  = tier === 'thorp';
  const isHamlet = tier === 'hamlet';

  // Terrain military advantage (natural chokepoints, elevation, approach restriction)
  const terrainType = config.terrainType || 'plains';
  const terrainMilMult = terrainType === 'mountain' ? 1.28
                       : terrainType === 'hills'    ? 1.18
                       : terrainType === 'forest'   ? 1.12
                       : terrainType === 'riverside' ? 1.06
                       : terrainType === 'coastal'  ? 1.02
                       : 1.00; // plains / desert

  // Community baseline for small settlements
  let communityMilBase = 0;
  let communityIntBase = 0;
  if (isSmall) {
    // Flight feasibility and terrain alarm (everyone notices strangers)
    const isolationBonus = route === 'isolated' ? 8 : route === 'road' ? 4 : 2;
    communityMilBase += isolationBonus;
    // Community weapons and coordination (every adult armed with tools)
    communityMilBase += isThorp ? 6 : isHamlet ? 8 : 10;
    // Internal: tight community self-policing (strangers noticed, disputes mediated by elders)
    communityIntBase += isThorp ? 18 : isHamlet ? 14 : 10;
    // Church/shrine as social authority and emergency coordination
    if (inst.hasChurch) { communityIntBase += 8; communityMilBase += 3; }
    // Government institution (reeve, elder, lord's steward) = coordination ability
    if (hasInst('reeve','steward','elder','household council','free elder'))
      { communityIntBase += 6; communityMilBase += 3; }
    // No criminal infrastructure = strangers and troublemakers visible immediately
    const hasCrimOrg = hasInst('fence','smuggl','gang','outlaw');
    if (!hasCrimOrg) communityIntBase += 6;
  }

  // ── Military score ──────────────────────────────────────────────────────────
  let military = communityMilBase;
  if (inst.hasWalls)       military += 30;
  if (inst.hasGarrison)    military += 28;
  if (inst.hasMilitia)     military += 10;
  if (inst.hasWatch)       military +=  7;
  if (inst.hasMercenary)   military += 14;
  if (inst.hasCharterHall) military += 10;

  // Arcane deterrence — scaled (replaces flat +8)
  if (hasArcane) {
    const deterrence = Math.round(10 + Math.min(15, (magPri - 35) * 0.25));
    military += deterrence;
    if (hasInst('wizard\'s tower')) military += 5; // visible high-level fortification
    if (hasArcaneGuild)             military += 8; // organised coordinated magic defense
  }
  // Divine martial blessing (Bless spell, Crusader morale)
  if (hasDivineStrong && relPri >= 70) military += 6;

  const hasAnyDefense = inst.hasWalls || inst.hasGarrison || inst.hasMilitia ||
                        inst.hasWatch || inst.hasMercenary || inst.hasCharterHall;
  military = Math.min(100, military + Math.round(milEffective * (hasAnyDefense ? 0.35 : 0.06)));
  // Apply terrain multiplier — natural chokepoints, elevation, approach restriction
  military = Math.min(100, Math.round(military * terrainMilMult));

  // ── Monster score ───────────────────────────────────────────────────────────
  let monster = 0;
  // Threat-level baseline even at thorp tier — pitchforks and communal watch
  if (threat === 'plagued')  monster += 8;
  else if (threat === 'frontier') monster += 4;
  if (inst.hasCharterHall) monster += 35;
  if (inst.hasGarrison)    monster += 20;
  if (inst.hasWalls)       monster += 20;
  if (inst.hasMilitia)     monster += 12;
  if (inst.hasHospital)    monster +=  5;

  // Tradition bonuses — capped at +35 combined
  let monsterMagicBonus = 0;
  if (hasArcane)  monsterMagicBonus += Math.round(15 + Math.min(10, (magPri - 35) * 0.2)); // fireballs, force
  if (hasDivine)  monsterMagicBonus += 18; // Turn Undead — highest vs undead/fiends
  if (hasDruid)   monsterMagicBonus += 12; // beast lore, tracking
  monster = Math.min(100, monster + Math.min(35, monsterMagicBonus));
  if (threat === 'plagued') monster = Math.max(0, monster - 15);

  // ── Internal order score ────────────────────────────────────────────────────
  // Community baseline applied first for small tiers
  let internal = communityIntBase;
  if (inst.hasCourtSystem)  internal += 20;
  if (inst.hasPrison)       internal += 15;
  if (inst.hasGarrison)     internal += 15;
  if (inst.hasWatch)        internal += 18;
  if (inst.hasMilitia)      internal +=  8;
  if (inst.hasCharterHall)  internal +=  5;

  // Arcane surveillance (Scrying, Detect Thoughts)
  if (hasArcane && magPri >= 50) internal += Math.min(8, Math.round((magPri - 50) * 0.16));
  // Divine social cohesion (Zone of Truth, sanctuary, confessional intelligence)
  if (hasDivine && relPri >= 60) internal += Math.min(10, Math.round((relPri - 60) * 0.25));

  const hasLawInfra = inst.hasCourtSystem || inst.hasPrison || inst.hasGarrison || inst.hasWatch;
  internal = Math.min(100, internal + Math.round(milEffective * (hasLawInfra ? 0.25 : 0.04)));
  internal = Math.max(0, internal - Math.round(crimEffective * 0.4));

  // ── Economic resilience score ───────────────────────────────────────────────
  // Primary driver: food storage months (from foodSecurity system)
  // Secondary: medical, market access, financial capacity
  const foodSec = config._foodSecurity;
  const storageMonths = foodSec?.storageMonths ?? (inst.hasGranary ? 4 : 1);
  // Storage → score: 0mo=0, 1mo=10, 3mo=25, 6mo=45, 12mo=70 (diminishing returns)
  const storageScore = Math.min(70, Math.round(storageMonths <= 1 ? storageMonths * 10
                                              : storageMonths <= 6 ? 10 + (storageMonths-1) * 7
                                              : 45 + (storageMonths-6) * 4));
  let economic = storageScore;
  if (inst.hasMarket)   economic += 10;  // financial capacity and merchant access
  if (inst.hasHospital) economic += 10;  // medical resilience
  if (route === 'port')       economic += 10; // sea supply can't be cut by land siege
  if (route === 'crossroads') economic +=  8; // multiple supply routes
  economic = Math.min(100, economic + Math.round(econOutput * 0.2));
  // Alchemy extends granary effective capacity (preservation, food extension)
  if (hasAlchemy && inst.hasGranary) economic += 8;
  economic = Math.min(100, economic); // re-cap after alchemy bonus

  // ── Magical defense score ───────────────────────────────────────────────────
  // Driven by computeEffectiveMagicPresence — same source of truth as Daily Life and Power tabs.
  // Tradition flags (arcane/divine/druid) modify the defensive PROFILE, not the base score.
  // Tier gate: thorps and hamlets get 0 magical defense unless a magic institution is actually present.
  // The slider alone shouldn't give tiny settlements magical defense — they have no practitioners.
  const _isSmallTier = ['thorp','hamlet','village'].includes(tier);
  // For the tier gate: hasDivine means actual miracle/healing presence, not just a standard parish.
  // Parish church is universal at village+ — it shouldn't unlock magical defense on its own.
  // Use hasInst() which is already available in this scope.
  const _hasActualMagic = inst.hasMagicInst || hasDruid || hasArcane
    || hasInst('healer','monastery','cathedral','divine','healing','druid','wizard','mage','arcane','enchant');
  const _hasMagicInstitution = _hasActualMagic;
  let magical = 0;
  if (!magicOn || (_isSmallTier && !_hasMagicInstitution)) {
    magical = 0; // no magic, or small tier with no magic presence
  } else {
    const _magicPresence = computeEffectiveMagicPresence(
      institutions,
      { ...config, nearbyResources: config.nearbyResources || [] }
    );
    // Effective score IS the magic defense baseline
    magical = _magicPresence.score;
    // Tradition modifiers: different traditions emphasize different defensive capabilities
    if (hasDivine)      magical = Math.min(100, magical + Math.round(relPri * 0.12)); // divine healing, morale
    if (hasDruid)       magical = Math.min(100, magical + 6);  // nature warding, terrain knowledge
    if (hasArcaneGuild) magical = Math.min(100, magical + 8);  // organized wards, counterspells
    magical = Math.round(magical);
  }

  // ── Stress penalties ────────────────────────────────────────────────────────
  // Base penalties, then tradition-based reductions

  if (hasStress('under_siege')) {
    let econPenalty     = 25;
    let internalPenalty = 15;
    // Arcane: Teleportation supplies in/out, Sending for morale
    if (hasArcane && magPri >= 65 && hasInst('teleportation','teleport'))
      econPenalty = Math.round(econPenalty * 0.4);   // -25 → -10
    else if (hasArcaneGuild && magPri >= 50)
      internalPenalty = Math.round(internalPenalty * 0.53); // -15 → -8
    // Divine: sanctuary, morale, consecrate
    if (hasDivineStrong)
      internalPenalty = Math.round(internalPenalty * 0.53); // -15 → -8
    // Druid: conjured food partial offset
    if (hasDruid && magPri >= 40)
      econPenalty = Math.round(econPenalty * 0.72); // -25 → -18
    economic = Math.max(0, economic - econPenalty);
    internal = Math.max(0, internal - internalPenalty);
  }

  if (hasStress('famine')) {
    let econPenalty  = 20;
    let milPenalty   = 10;
    let intPenalty   = 20;
    // Druid: highest food substitution (65% recovery)
    if (hasDruid && magPri >= 30) {
      econPenalty = Math.round(econPenalty * 0.4); // -20 → -8
      milPenalty  = Math.round(milPenalty  * 0.5); // -10 → -5
    }
    // Divine: Create Food and Water, Bless crops
    if (hasDivine) {
      econPenalty = Math.max(Math.round(econPenalty * 0.6), Math.round(20 * 0.6)); // -20 → -12
      milPenalty  = Math.max(Math.round(milPenalty  * 0.6), Math.round(10 * 0.6)); // -10 → -6
    }
    // Arcane: minor Goodberry, Plant Growth
    if (hasArcane && magPri >= 50)
      econPenalty = Math.min(econPenalty, Math.round(20 * 0.75)); // -20 → -15 (caps)
    // Alchemy: preservation extends existing stores
    if (hasAlchemy)
      econPenalty = Math.max(0, econPenalty - 3);
    economic = Math.max(0, economic - econPenalty);
    military = Math.max(0, military - milPenalty);
    internal = Math.max(0, internal - intPenalty);
  }

  if (hasStress('occupied')) {
    military = Math.max(0, military - 35);
    internal = Math.max(0, internal - 20);
  }

  if (hasStress('plague_onset')) {
    let milPenalty  = 15;
    let econPenalty = 15;
    // Divine: Remove Disease, mass healing (HIGHEST healer)
    if (hasDivine) {
      milPenalty = Math.round(milPenalty * 0.33);   // → -5
      econPenalty = Math.round(econPenalty * 0.53);  // → -8
    }
    // Alchemy: plague remedies, quarantine management
    if (hasAlchemy) {
      milPenalty = Math.min(milPenalty, Math.round(15 * 0.53));   // -8
      econPenalty = Math.min(econPenalty, Math.round(15 * 0.67)); // -10
    }
    // Arcane: Heal, mass cure (less efficient)
    if (hasArcane && magPri >= 50)
      milPenalty = Math.min(milPenalty, Math.round(15 * 0.67)); // → -10
    military = Math.max(0, military - milPenalty);
    economic = Math.max(0, economic - econPenalty);
  }

  if (hasStress('succession_void')) {
    military = Math.max(0, military - 15);
    internal = Math.max(0, internal - 20);
  }
  if (hasStress('politically_fractured')) {
    internal = Math.max(0, internal - 20);
  }
  if (hasStress('recently_betrayed')) {
    internal = Math.max(0, internal - 10);
    military = Math.max(0, military - 10);
  }
  if (hasStress('indebted')) {
    economic = Math.max(0, economic - 15);
    military = Math.max(0, military - 10);
  }
  if (hasStress('infiltrated')) {
    internal = Math.max(0, internal - 15);
    military = Math.max(0, military -  8);
  }

  if (hasStress('monster_pressure')) {
    // Base penalty — but magic can REVERSE this into a net positive
    let monsterPenalty = 20;
    let milPenalty     = 5;
    // Arcane: fireballs, force walls — can turn pressure into opportunity
    if (hasArcane && magPri >= 40) monsterPenalty = Math.round(monsterPenalty * 0.25); // -20 → -5
    if (hasDivine)                 monsterPenalty = Math.round(monsterPenalty * 0.4);  // -20 → -8
    if (hasDruid)                  monsterPenalty = Math.round(monsterPenalty * 0.5);  // -20 → -10
    monster  = Math.max(0, monster  - monsterPenalty);
    military = Math.max(0, military - milPenalty);
  }

  // ── Magic dependency flag ───────────────────────────────────────────────────
  // Computed but returned separately — indicates vulnerability if magic lost
  // Magic dependency: fires when magic is actively compensating for vulnerabilities
  // Either under stress with magic filling gaps, OR when multiple traditions present
  // in a settlement that has supply chain or resource deficits
  const magicDependency = magicOn && (
    (hasStress('under_siege') && (hasArcane || hasDruid || hasDivine)) ||
    (hasStress('famine')      && (hasDruid  || hasDivine)) ||
    (hasStress('plague_onset')&& (hasDivine || hasAlchemy)) ||
    (hasArcaneGuild && (hasStress('under_siege') || hasStress('famine')))
  );

  return {
    military, monster, internal, economic, magical,
    magicDependency,
    traditions: {
      hasArcane, hasArcaneGuild, hasDivine, hasDruid, hasAlchemy,
    },
  };
};

// ─── computeDefenseReadiness ──────────────────────────────────────────────────
/**
 * Compute an overall readiness label and colour from the five scores.
 * Applies a small bonus for small tiers (simpler to defend) and a
 * penalty for frontier/plagued threats.
 *
 * @param {{ military, monster, internal, economic, magical }} scores
 * @param {string} threat - Monster threat level
 * @param {string} tier   - Settlement tier
 * @returns {{ label, color, background, border }}
 */
const computeDefenseReadiness = (scores, threat, tier, magicExists = true) => {
  // Small tiers are cheaper to defend — small bonus that reflects genuine scale
  // (fewer approaches, everyone knows everyone, simpler to coordinate)
  const tierBonus =
    tier === 'thorp'  ? 12 :
    tier === 'hamlet' ? 8  :
    tier === 'village'? 4  :
    tier === 'town'   ? 2  : 0;

  // Threat level penalty
  const threatPenalty =
    threat === 'plagued'  ? 15 :
    threat === 'frontier' ? 7  : 0;

  // In no-magic worlds, exclude magical dimension from average (can't be penalised
  // for not having something that doesn't exist in this world)
  const dims = magicExists
    ? [scores.military, scores.monster, scores.internal, scores.economic, scores.magical]
    : [scores.military, scores.monster, scores.internal, scores.economic];
  const avgScore = Math.round(dims.reduce((a,b)=>a+b,0) / dims.length);
  const readiness = Math.max(0, avgScore + tierBonus - threatPenalty);

  if (readiness >= 76) return { label: 'Fortress',         color: '#1a4a2a', background: '#f0faf2', border: '#a8d8b0' };
  if (readiness >= 55) return { label: 'Well-Defended',    color: '#1a3a6a', background: '#f0f4fa', border: '#a8c0d8' };
  if (readiness >= 38) return { label: 'Defensible',       color: '#5a6a1a', background: '#f4f8ec', border: '#b8d0a8' };
  if (readiness >= 24) return { label: 'Lightly Defended', color: '#7a5010', background: '#faf6ec', border: '#e0c880' };
  if (readiness >= 12) return { label: 'Vulnerable',       color: '#8a3010', background: '#fdf8ec', border: '#e8c080' };
  return                       { label: 'Undefended',      color: '#8b1a1a', background: '#fdf4f4', border: '#e8c0c0' };
};

// ─── generateDefenseProfile ───────────────────────────────────────────────────
/**
 * Assemble the complete defense profile for a settlement.
 *
 * @param {Object} settlement - Full settlement object
 * @returns {{ scores, readiness, institutions }}
 */
export function generateDefenseProfile(settlement) {
  const config       = settlement.config       || {};
  const institutions = settlement.institutions || [];
  const stressTypes  = settlement.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress : [settlement.stress]).map(s => s?.type).filter(Boolean)
    : (config.stressTypes || config.intendedStressTypes || []);

  const defenseInsts = getDefenseInstitutions(institutions);
  const instFlags    = getInstFlags(config, institutions);

  const foodSecurity = settlement.economicState?.foodSecurity || null;
  const scores = computeDefenseScores(
    instFlags.inst,
    Math.round(instFlags.militaryEffective),
    Math.round(instFlags.criminalEffective),
    Math.round(instFlags.economyOutput),
    Math.round(instFlags.magicInfluence),
    Math.round(instFlags.religionInfluence),
    getPriorities(config),
    config.monsterThreat || 'frontier',
    { ...config, _institutions: institutions, _foodSecurity: foodSecurity },
    settlement.tier || 'town',
    stressTypes,
  );

  // ── Supply chain linkage (Item 24) ────────────────────────────────────────
  // Active garrison/fortification chains and their upstream health
  // feed into the final score as modifiers (not replacing institution checks)
  const activeChains = settlement.economicState?.activeChains || [];
  const chainById = Object.fromEntries(activeChains.map(c => [c.chainId, c]));

  const garrisonChain    = chainById['garrison'];
  const fortificationChain = chainById['fortification'];
  const mercenaryChain   = chainById['mercenary'];
  const foodProcChain    = chainById['food_processing'];

  let chainMilBonus  = 0;
  let chainEconBonus = 0;

  // Garrison chain: fully operational = +5 military, vulnerable (no provisions) = -5
  if (garrisonChain) {
    if (garrisonChain.status === 'operational' || garrisonChain.status === 'running') chainMilBonus  += 5;
    else if (garrisonChain.status === 'vulnerable' || garrisonChain.status === 'impaired')  chainMilBonus  -= 5;
  }
  // Fortification chain: operational = +6 military (walls maintained), impaired = -4
  if (fortificationChain) {
    if (fortificationChain.status === 'operational' || fortificationChain.status === 'running') chainMilBonus  += 6;
    else if (fortificationChain.status === 'impaired') chainMilBonus -= 4;
  }
  // Mercenary chain active and healthy = +4 military (contract force available)
  if (mercenaryChain && (mercenaryChain.status === 'operational' || mercenaryChain.status === 'running')) {
    chainMilBonus += 4;
  }
  // Food processing chain healthy = +5 economic defense (logistics well-supplied)
  if (foodProcChain && foodProcChain.status !== 'impaired') chainEconBonus += 5;
  // Food processing chain impaired = -8 economic defense (siege logistics strained)
  if (foodProcChain && foodProcChain.status === 'impaired') chainEconBonus -= 8;

  const finalScores = {
    ...scores,
    military: Math.min(100, Math.max(0, scores.military + chainMilBonus)),
    economic: Math.min(100, Math.max(0, scores.economic + chainEconBonus)),
  };
  const finalReadiness = computeDefenseReadiness(
    finalScores,
    config.monsterThreat || 'frontier',
    settlement.tier || 'town',
    config.magicExists !== false,
  );
  // ─────────────────────────────────────────────────────────────────────────────

  return {
    scores: finalScores,
    readiness: finalReadiness,
    institutions: defenseInsts,
    magicDependency: finalScores.magicDependency || false,
    traditions: finalScores.traditions || {},
    chainModifiers: {
      military: chainMilBonus,
      economic: chainEconBonus,
    },
  };
}

// ── Threat assessment narrative ──────────────────────────────────

export function buildThreatAssessment(r) {
  const d = r?.defenseProfile || {};
  const inst = d.institutions || {};
  const scores = d.scores || {};
  const sp = r?.economicState?.safetyProfile || {};
  const f = r?.economicState?.compound?.inst || {};
  const threat = r?.config?.monsterThreat || 'frontier';
  const hasWalls = (inst.walls || []).length > 0;
  const hasGarrison = (inst.garrison || []).length > 0;
  const hasMilitia = (inst.militia || []).length > 0;
  const hasCharter = (inst.charter || []).length > 0;
  const result = [];

  const monColor = threat === 'plagued'
    ? '#8b1a1a'
    : threat === 'frontier'
      ? '#7a5010'
      : '#1a5a28';
  let mon = '';
  if (threat === 'plagued') {
    if (hasWalls && hasGarrison) {
      mon = 'Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity. '
        + (hasCharter
          ? 'Charter hall coordinates specialist monster response.'
          : 'No specialist monster hunters on retainer — the garrison handles everything.');
    } else if (hasWalls && hasMilitia) {
      mon = 'Palisade and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin — simultaneous incursions will break coverage. '
        + (hasCharter
          ? 'Charter hall provides specialist backup.'
          : 'No specialist monster hunters.');
    } else if (hasCharter) {
      mon = 'No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly.';
    } else if (hasWalls) {
      mon = 'Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint but holding it requires people, and there are not enough for sustained watch.';
    } else if (hasGarrison) {
      mon = 'Military force present but no perimeter walls. The garrison engages in the open. Creatures can approach from any direction.';
    } else {
      mon = 'embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger.';
    }
  } else if (threat === 'frontier') {
    if (hasWalls && hasGarrison) {
      mon = 'Active frontier. Walls and garrison provide credible deterrence — most creature threats will not press a defended perimeter. '
        + (hasCharter
          ? 'Charter hall handles anything above the garrison usual remit. '
          : '')
        + 'Adequate for the threat level.';
    } else if (hasWalls && hasMilitia) {
      mon = 'Palisade and militia are standard frontier resilience — effective against most creature threats, strained by simultaneous incursions. '
        + (hasCharter
          ? 'Charter hall provides specialist backup. '
          : '')
        + 'Honest posture for a frontier settlement.';
    } else if (hasGarrison || hasMilitia) {
      mon = 'Active frontier with '
        + (hasGarrison ? 'a garrison' : 'a militia')
        + ' but no perimeter. Defense is reactive — attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated.';
    } else {
      mon = 'Active frontier with no organized defense. Vulnerable to any monster of moderate capability.';
    }
  } else {
    if (hasWalls && hasGarrison) {
      mon = 'Safe heartland — the existing defenses are substantially more than the threat level requires.';
    } else if (hasWalls || hasGarrison || hasMilitia || hasCharter) {
      mon = 'Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal.';
    } else {
      mon = 'Safe heartland with no organized defense. Acceptable given the threat environment.';
    }
  }
  result.push({
    icon: '',
    label: 'Beasts & Monsters',
    color: monColor,
    assess: mon,
  });

  const milScore = scores.military || 0;
  const milColor = milScore >= 60
    ? '#1a4a2a'
    : milScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  let mil = '';
  if (hasWalls && hasGarrison) {
    mil = 'Walls and professional garrison provide meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles.';
  } else if (hasWalls && hasMilitia) {
    mil = 'Walls with citizen militia — credible deterrence against raiders, inadequate against any professional force with siege capability.';
  } else if (hasWalls) {
    mil = 'Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time.';
  } else if (hasGarrison) {
    mil = 'Professional garrison without perimeter walls. Effective against raiders; cannot hold against a siege.';
  } else if (hasMilitia) {
    mil = 'Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force.';
  } else {
    mil = 'No walls or garrison. Cannot resist organized military aggression. Survival depends entirely on distance, diplomacy, or irrelevance to the attacker.';
  }
  result.push({
    icon: '',
    label: 'Invasion & War',
    color: milColor,
    assess: mil,
  });

  const intScore = scores.internal || 0;
  const intColor = intScore >= 60
    ? '#1a4a2a'
    : intScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  const sl = sp.safetyLabel || 'Moderate';
  let intA = 'Internal security: ' + sl + '. ';
  if (sl.includes('Dangerous')) {
    intA += 'Active violence and organized crime make internal order the primary threat. ';
  }
  if (f.hasCourtSystem && f.hasPrison) {
    intA += 'Full legal infrastructure provides enforcement capacity.';
  } else if (f.hasCourtSystem) {
    intA += 'Courts prosecute but limited detention.';
  } else if (f.hasPrison) {
    intA += 'Detention without systematic prosecution.';
  } else {
    intA += 'No legal infrastructure — order relies on force alone.';
  }
  result.push({
    icon: '',
    label: 'Internal Security',
    color: intColor,
    assess: intA,
  });

  const econScore = scores.economic || 0;
  const econColor = econScore >= 60
    ? '#1a4a2a'
    : econScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  let econA;
  if (econScore >= 65) {
    econA = 'Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during prolonged engagement.';
  } else if (econScore >= 40) {
    econA = 'Adequate economic resilience for a short-term crisis. A prolonged siege will begin straining reserves within months.';
  } else if (econScore >= 25) {
    econA = 'Chronic underfunding limits emergency response. A sustained crisis will exhaust reserves and undermine garrison morale.';
  } else {
    econA = 'Economic base cannot support crisis response. Any sustained threat quickly overwhelms the capacity to respond.';
  }
  result.push({
    icon: '',
    label: 'Economic Survival',
    color: econColor,
    assess: econA,
  });

  const disA = (f.hasGranary
    ? 'Granary provides food buffer — the community can absorb a bad harvest without immediate hardship.'
    : 'No food reserves. A crop failure or supply disruption causes immediate hardship.')
    + (f.hasHospital
      ? ' Hospital infrastructure enables disease containment and systematic quarantine.'
      : f.hasChurch
        ? ' Parish clergy provide basic wound care — better than nothing, worse than a hospital.'
        : ' No medical infrastructure. Plague spreads until it burns out.');
  result.push({
    icon: '',
    label: 'Disasters & Famine',
    color: '#1a4a5a',
    assess: disA,
  });

  return result;
}
