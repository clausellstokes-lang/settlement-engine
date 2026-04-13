/**
 * neighbourGenerator.js
 * Extracts structured relationship data from an imported settlement object
 * and computes how that relationship affects the generating settlement's
 * institutions, economics, government type, and factions.
 *
 * Key design principles:
 * - Rivals mirror economically (competing for same space) but diverge ideologically
 * - Patrons pull clients toward their government type; clients develop resistance factions
 * - Cold war produces both surface similarity AND underground antithesis simultaneously
 * - Hostile relationships militarize both sides but antithesis in government/ideology
 * - Trade partners are complementary, not competing
 */

// ── Government antithesis map ─────────────────────────────────────────────────
// For each government archetype, what is its ideological opposite?
const GOV_ANTITHESIS = {
  theocracy:          ['merchant republic', 'secular council', 'military council'],
  'merchant republic':['theocracy', 'feudal lordship', 'military autocracy'],
  'military autocracy':['merchant republic', 'peasant commune', 'ecclesiastical council'],
  'noble oligarchy':  ['peasant commune', 'merchant republic', 'free city council'],
  'feudal lordship':  ['free city council', 'merchant republic', 'peasant commune'],
  'free city council':['feudal lordship', 'noble oligarchy', 'military autocracy'],
  'peasant commune':  ['noble oligarchy', 'feudal lordship', 'military autocracy'],
  'ecclesiastical council':['military council', 'merchant republic'],
  'military council': ['ecclesiastical council', 'merchant republic'],
};

// ── Relationship dynamics table ───────────────────────────────────────────────
// Defines how each relationship type biases generation axes.
// Values are multipliers applied to base institution chances.

// ── Relationship dynamics table ───────────────────────────────────────────────
// Defines how each relationship type biases generation axes.
// economyMode: how we relate economically to the neighbour
//   'complement' = fill their gaps, 'compete' = mirror their exports,
//   'dependent' = produce what they need, 'suppress' = minimal trade, 'independent' = neutral
// govMirrorW / govAntithesisW: probability weights for mirroring or opposing their government type
const REL_DYNAMICS = {
  neutral: {
    economyMode:      'independent',
    govMirrorW:       0.05,
    govAntithesisW:   0.05,
    militaryBias:     0,
  },
  allied: {
    economyMode:      'complement',
    govMirrorW:       0.20,
    govAntithesisW:   0.02,
    militaryBias:     0.05,
  },
  trade_partner: {
    economyMode:      'complement',
    govMirrorW:       0.10,
    govAntithesisW:   0.03,
    militaryBias:     0,
  },
  patron: {
    economyMode:      'dependent',
    govMirrorW:       0.35,
    govAntithesisW:   0.15,
    militaryBias:     0.10,
  },
  client: {
    economyMode:      'dependent',
    govMirrorW:       0.25,
    govAntithesisW:   0.10,
    militaryBias:     0.05,
  },
  rival: {
    economyMode:      'compete',
    govMirrorW:       0.05,
    govAntithesisW:   0.25,
    militaryBias:     0.20,
  },
  cold_war: {
    economyMode:      'compete',
    govMirrorW:       0.10,
    govAntithesisW:   0.30,
    militaryBias:     0.30,
  },
  hostile: {
    economyMode:      'suppress',
    govMirrorW:       0.02,
    govAntithesisW:   0.40,
    militaryBias:     0.50,
  },
};

// ── Extract neighbour profile from settlement object ──────────────────────────
export function extractNeighbourProfile(neighbour, relationshipType = 'neutral') {
  if (!neighbour) return null;

  const econ    = neighbour.economicState || {};
  const power   = neighbour.powerStructure || {};
  const factions= neighbour.powerStructure?.factions || neighbour.factions || [];
  const config  = neighbour.config || {};

  // Primary exports/imports from economic state
  const primaryExports  = econ.primaryExports  || [];
  const primaryImports  = econ.primaryImports  || [];

  // Active supply chain IDs
  const activeChains    = econ.activeChains    || [];

  // Prosperity → economic strength 0–1
  const PROSPERITY_RANK = {
    'Subsistence':0.05,'Poor':0.2,'Struggling':0.3,'Modest':0.45,
    'Moderate':0.55,'Comfortable':0.65,'Prosperous':0.75,'Wealthy':0.85,'Affluent':1.0,
  };
  const economicStrength = PROSPERITY_RANK[econ.prosperityLevel] ?? 0.5;

  // Military strength from config priority
  const militaryStrength = ((config.priorityMilitary ?? 50) / 100);

  // Government type — extract from powerStructure
  const governmentType = extractGovernmentType(power);

  // Dominant faction types (top 2 by influence)
  const dominantFactionTypes = extractDominantFactionTypes(factions);

  // Magic level
  const magicLevel = (config.priorityMagic ?? 0) / 100;

  // Trade route connectivity
  const tradeRoute = config.tradeRouteAccess || 'road';

  // Tier
  const tier = neighbour.tier || config.settType || 'village';

  return {
    name:                neighbour.name || 'Unknown',
    tier,
    relationshipType,
    primaryExports,
    primaryImports,
    activeChains,
    economicStrength,
    militaryStrength,
    governmentType,
    dominantFactionTypes,
    magicLevel,
    tradeRoute,
    // Raw dynamics for the relationship type
    dynamics: REL_DYNAMICS[relationshipType] || REL_DYNAMICS.neutral,
    // Include NPC and faction data for cross-settlement conflict generation
    npcs:     neighbour.npcs     || [],
    factions: neighbour.factions || factions || [],
  };
}

function extractGovernmentType(power) {
  if (!power) return null;
  // Try institutions array first
  const insts = power.institutions || [];
  const govInst = insts.find(i =>
    (i.category || '').toLowerCase().includes('government') ||
    (i.category || '').toLowerCase().includes('council') ||
    i.required
  );
  if (govInst) return (govInst.label || govInst.name || '').toLowerCase();
  // Try dominant label
  return (power.dominantLabel || power.summary || '').toLowerCase() || null;
}

function extractDominantFactionTypes(factions) {
  if (!factions?.length) return [];
  // factions here are powerStructure factions: {faction, power, category, ...}
  const sorted = [...factions].sort((a, b) => (b.power || 0) - (a.power || 0));
  const types = [];
  for (const f of sorted.slice(0, 5)) {
    const cat = (f.category || '').toLowerCase();
    if (cat && cat !== 'other' && !types.includes(cat)) types.push(cat);
    if (types.length >= 2) break;
  }
  return types;
}

// ── Economic complementarity / competition ────────────────────────────────────
// Returns export category biases for the generating settlement based on
// what the neighbour exports.
export function getNeighbourEconomicBias(neighbourProfile) {
  if (!neighbourProfile) return {};
  const { primaryExports, primaryImports, dynamics, relationshipType } = neighbourProfile;
  const mode = dynamics.economyMode || 'independent';
  const bias = {};

  if (mode === 'complement') {
    // Neighbour's imports are our export opportunity
    for (const imp of primaryImports) {
      bias[imp] = (bias[imp] || 1.0) * 1.4;
    }
    // Neighbour's exports we should NOT duplicate — complementarity means specializing elsewhere
    for (const exp of primaryExports) {
      bias[exp] = (bias[exp] || 1.0) * 0.6;
    }
  } else if (mode === 'compete') {
    // Rivals compete in the same space — elevated chance of same exports
    for (const exp of primaryExports) {
      bias[exp] = (bias[exp] || 1.0) * 1.35;
    }
    // But also capture their import needs (undercut their suppliers)
    for (const imp of primaryImports) {
      bias[imp] = (bias[imp] || 1.0) * 1.2;
    }
  } else if (mode === 'dependent') {
    // Client/patron: we produce what they need
    for (const imp of primaryImports) {
      bias[imp] = (bias[imp] || 1.0) * 1.6;
    }
  } else if (mode === 'suppress') {
    // Hostile: minimal trade, focus on self-sufficiency
    for (const exp of primaryExports) {
      bias[exp] = (bias[exp] || 1.0) * 0.4;
    }
  }

  return bias;
}

// ── Government type bias ───────────────────────────────────────────────────────
// Returns { mirrorType, antithesisTypes, mirrorWeight, antithesisWeight }
export function getNeighbourGovernmentBias(neighbourProfile) {
  if (!neighbourProfile?.governmentType) return null;
  const { governmentType, dynamics } = neighbourProfile;
  const antithesisTypes = GOV_ANTITHESIS[governmentType] || [];

  return {
    mirrorType:      governmentType,
    antithesisTypes,
    mirrorWeight:    dynamics.govMirrorW    || 0.1,
    antithesisWeight:dynamics.govAntithesisW|| 0.05,
  };
}

// ── Faction cross-contamination ────────────────────────────────────────────────
// Returns { mirrorFactions, opposeFactions, mirrorWeight, opposeWeight }
export function getNeighbourFactionBias(neighbourProfile) {
  if (!neighbourProfile?.dominantFactionTypes?.length) return null;
  const { dominantFactionTypes, dynamics } = neighbourProfile;

  // Opposition faction types — inverse of neighbour's dominant types
  const FACTION_OPPOSITION = {
    military:   ['criminal', 'economy'],
    religious:  ['economy', 'government'],
    criminal:   ['military', 'government'],
    magic:      ['religious', 'government'],
    economy:    ['military', 'religious'],
    government: ['criminal', 'economy'],
  };
  const opposeFactions = dominantFactionTypes
    .flatMap(t => FACTION_OPPOSITION[t] || [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter(t => !dominantFactionTypes.includes(t));

  return {
    mirrorFactions:  dominantFactionTypes,
    opposeFactions,
    mirrorWeight:    dynamics.factionMirrorW || 0.1,
    opposeWeight:    dynamics.factionOpposeW  || 0.05,
  };
}

// ── Faction label generators ───────────────────────────────────────────────────
export function getMirrorFactionLabel(factionType, relType, neighbourName) {
  const n = neighbourName || 'the neighbour';
  const labels = {
    allied: {
      military:   `Joint Defense Compact (with ${n})`,
      economy:    `Merchants of the ${n} Alliance`,
      religious:  `Faithful of the Shared Covenant`,
      government: `Allied Administrative Council`,
      criminal:   `Cross-border Syndicate`,
      magic:      `Arcane Exchange Circle`,
    },
    trade_partner: {
      military:   null,
      economy:    `${n} Trading House`,
      religious:  null,
      government: `Trade Liaison Office`,
      criminal:   `Smugglers running the ${n} route`,
      magic:      null,
    },
    patron: {
      military:   `${n} Garrison Overseer`,
      economy:    `${n} Revenue Collectors`,
      religious:  `${n} Temple Authority`,
      government: `${n} Administrative Prefects`,
      criminal:   null,
      magic:      `${n} Arcane Envoys`,
    },
    client: {
      economy:    `Suppliers to ${n}`,
      military:   null,
      religious:  `Pilgrims bound for ${n}`,
      government: `${n} Liaison Office`,
      criminal:   null,
      magic:      null,
    },
    rival: {
      military:   `${n} Intelligence Agents (embedded)`,
      economy:    `${n} Merchant Spies`,
      criminal:   `${n}-backed Saboteurs`,
      government: `${n} Diplomatic Mission`,
      religious:  `${n} Proselytizers`,
      magic:      `${n} Arcane Observers`,
    },
    cold_war: {
      military:   `${n} Deep Cover Operatives`,
      economy:    `${n} Commercial Front`,
      criminal:   `${n} Clandestine Network`,
      government: `${n} Official Delegation`,
      religious:  `${n} Cultural Mission`,
      magic:      `${n} Arcane Observers`,
    },
    hostile: {
      military:   null,
      economy:    `${n} Black Market Contacts`,
      criminal:   `${n}-backed Insurgents`,
      government: `${n} Collaborationist Faction`,
      religious:  null,
      magic:      null,
    },
  };
  return (labels[relType] || labels.allied || {})[factionType] || null;
}

export function getOpposeFactionLabel(factionType, relType, neighbourName) {
  const n = neighbourName || 'the neighbour';
  const labels = {
    rival: {
      military:   `Anti-${n} Militia`,
      economy:    `Counter-${n} Merchant Brotherhood`,
      criminal:   `Anti-${n} Vigilantes`,
      government: `${n} Opposition Council`,
      religious:  `Anti-${n} Reform Movement`,
      magic:      `Anti-${n} Arcane Resistance`,
    },
    cold_war: {
      military:   `${n} Resistance Cell`,
      economy:    `Anti-${n} Economic Bloc`,
      criminal:   `Underground ${n} Opposition`,
      government: `Shadow Council Against ${n}`,
      religious:  `Theological Opposition to ${n}`,
      magic:      `Arcane Counter-intelligence`,
    },
    hostile: {
      military:   `Resistance Against ${n}`,
      economy:    `Self-sufficiency League (anti-${n})`,
      criminal:   `Anti-${n} Underground`,
      government: `Exile Government`,
      religious:  `Faith-driven Resistance`,
      magic:      `Arcane Defenders`,
    },
    patron: {
      military:   `${n} Liberation Front`,
      economy:    `Anti-tribute Merchant Brotherhood`,
      criminal:   null,
      government: `Independence Faction`,
      religious:  `Religious Freedom Movement`,
      magic:      null,
    },
    client: {
      military:   `Autonomy Militia`,
      economy:    `Free Market Advocates`,
      criminal:   null,
      government: `Sovereign Council`,
      religious:  null,
      magic:      null,
    },
  };
  return (labels[relType] || {})[factionType] || null;
}
