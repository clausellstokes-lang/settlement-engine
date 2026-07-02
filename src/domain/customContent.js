/**
 * domain/customContent.js — Classify user-added content as causal objects.
 *
 * When a user adds "Dragonbone Foundry,"
 * the simulator needs to know what it IS structurally — category,
 * what it provides, what it requires, what controls it, what risks
 * it raises, what effects it has on substrate / capacities. Without
 * structure, user content is just appended prose; with it, the
 * content flows through every derivation alongside generated
 * entities.
 *
 *   classifyCustomEntity(rawEntity, settlement) -> {
 *     type, rawName, inferredCategory,
 *     provides, requires, controlledBy,
 *     risks, effects,
 *     contributors[]
 *   }
 *
 * Pure read-only. Pattern-based inference (the same hook/threat
 * classifier pattern). The simulator's rerun is already the event
 * pipeline's job — this module produces the structured input the
 * pipeline consumes.
 */

// ── Catalogs ─────────────────────────────────────────────────────────────

export const CUSTOM_CONTENT_TYPES = Object.freeze([
  'institution', 'faction', 'npc', 'threat', 'hook',
]);

export const INSTITUTION_CATEGORIES = Object.freeze([
  'food',         // granary, mill, fishery, bakery, farm
  'military',     // garrison, watch, militia, barracks
  'religious',    // temple, shrine, chapel, monastery
  'arcane',       // tower, college, conclave, sanctum
  'craft',        // forge, smithy, workshop, foundry
  'civic',        // court, hall, council, registry
  'trade',        // market, exchange, port, warehouse
  'criminal',     // den, hideout, blackmarket
  'healing',      // hospice, apothecary, healer
  'occupation',   // any of: barracks, garrison
  'other',
]);

// ── Type inference ───────────────────────────────────────────────────────

const TYPE_PATTERNS = Object.freeze([
  // Order matters — most specific first.
  // Threats come before factions because "cult menace" reads as threat,
  // not faction; faction-specific words (guild / order / council) stay
  // unambiguous for the faction line.
  { pattern: /\b(threat|menace|peril|invasion|raid|incursion)\b/i, type: 'threat' },
  { pattern: /\b(rumors?|hooks?|whispers?|legends?|tales?)\b/i, type: 'hook' },
  { pattern: /\b(faction|guild|order|brotherhood|sisterhood|cabal|league|council)\b/i, type: 'faction' },
  { pattern: /\b(captain|lord|lady|priest|priestess|mage|wizard|merchant|smith|baker|elder)\s+[a-z]/i, type: 'npc' },
  // Default to institution if a noun-looking name is present
]);

/** @param {any} rawEntity */
export function inferCustomEntityType(rawEntity) {
  if (!rawEntity) return null;
  // Explicit type wins
  if (typeof rawEntity.type === 'string' && CUSTOM_CONTENT_TYPES.includes(rawEntity.type)) {
    return rawEntity.type;
  }
  const name = String(rawEntity.name || rawEntity.label || rawEntity.text || '');
  for (const { pattern, type } of TYPE_PATTERNS) {
    if (pattern.test(name)) return type;
  }
  return 'institution';
}

// ── Institution classification ───────────────────────────────────────────

const INSTITUTION_CATEGORY_PATTERNS = Object.freeze([
  { pattern: /(granary|mill|fishery|bakery|orchard|farm|silo|brewery)/i,                  category: 'food' },
  { pattern: /(garrison|barracks|watch|militia|guard|fortress|citadel|gate|wall)/i,       category: 'military' },
  { pattern: /(temple|cathedral|chapel|monastery|abbey|shrine|sanctum|priory|sept)/i,     category: 'religious' },
  { pattern: /(tower|college|conclave|circle|enclave|atheneum|library.*arcane|sanctum)/i, category: 'arcane' },
  { pattern: /(forge|smithy|workshop|guild.*craft|foundry|tannery|cooper|wheelwright)/i,  category: 'craft' },
  { pattern: /(court|hall|council|chancery|registry|moot|forum|government)/i,             category: 'civic' },
  { pattern: /(market|bazaar|exchange|warehouse|quay|wharf|trade hall|port|dock)/i,       category: 'trade' },
  { pattern: /(den|hideout|blackmarket|safehouse|fence)/i,                                category: 'criminal' },
  { pattern: /(infirmary|hospice|herbalist|apothecary|healer|hospital)/i,                 category: 'healing' },
]);

/** @param {any} name */
function inferInstitutionCategory(name) {
  for (const { pattern, category } of INSTITUTION_CATEGORY_PATTERNS) {
    if (pattern.test(name)) return category;
  }
  return 'other';
}

// Category → structural impact templates. Each template lists
// `provides` (subsystems benefited), `requires` (inputs needed),
// `controlledBy` (likely faction archetype), `risks` (threat types
// raised), `effects` (substrate + capacity impact deltas).
const CATEGORY_TEMPLATES = Object.freeze({
  food: {
    provides:     ['food_security', 'food_production capacity'],
    requires:     ['grain or harvest', 'mill labor'],
    controlledBy: 'merchant',
    risks:        [],
    effects: {
      substrate:  { food_security: +10 },
      capacities: { food_production: { supply: +12 } },
    },
  },
  military: {
    provides:     ['defense_readiness', 'public order'],
    requires:     ['soldiers', 'pay', 'arms'],
    controlledBy: 'military',
    risks:        ['rival_neighbor'],
    effects: {
      substrate:  { defense_readiness: +12, criminal_opportunity: -6 },
      capacities: { defense: { supply: +14 } },
    },
  },
  religious: {
    provides:     ['religious_authority', 'public_legitimacy', 'healing'],
    requires:     ['donations', 'clergy'],
    controlledBy: 'religious',
    risks:        [],
    effects: {
      substrate:  { religious_authority: +12, social_trust: +6 },
      capacities: { religious_welfare: { supply: +12 }, healing: { supply: +5 } },
    },
  },
  arcane: {
    provides:     ['magical_stability', 'arcane capacity'],
    requires:     ['arcane training', 'patronage'],
    controlledBy: 'arcane',
    risks:        ['arcane_instability'],
    effects: {
      substrate:  { magical_stability: +12 },
      capacities: { magical: { supply: +15 } },
    },
  },
  craft: {
    provides:     ['craft capacity', 'exports'],
    requires:     ['raw materials', 'skilled labor'],
    controlledBy: 'craft',
    risks:        [],
    effects: {
      substrate:  { trade_connectivity: +5 },
      capacities: { craft: { supply: +14 } },
    },
  },
  civic: {
    provides:     ['ruling_authority', 'public_legitimacy'],
    requires:     ['legitimacy', 'staffing'],
    controlledBy: 'government',
    risks:        ['corruption'],
    effects: {
      substrate:  { ruling_authority: +10, public_legitimacy: +5 },
      capacities: { administrative: { supply: +12 } },
    },
  },
  trade: {
    provides:     ['trade_connectivity', 'merchant wealth'],
    requires:     ['trade route', 'merchants'],
    controlledBy: 'merchant',
    risks:        ['economic_collapse'],
    effects: {
      substrate:  { trade_connectivity: +10 },
      capacities: { transport: { supply: +8 } },
    },
  },
  criminal: {
    provides:     ['criminal economy'],
    requires:     ['weak enforcement', 'patronage'],
    controlledBy: 'criminal',
    risks:        ['corruption', 'unrest'],
    effects: {
      substrate:  { criminal_opportunity: +15, public_legitimacy: -4 },
      capacities: {},
    },
  },
  healing: {
    provides:     ['healing_capacity'],
    requires:     ['herbalists', 'supplies'],
    controlledBy: 'religious',
    risks:        [],
    effects: {
      substrate:  { healing_capacity: +12 },
      capacities: { healing: { supply: +14 } },
    },
  },
  occupation: {
    provides:     ['nominal defense', 'control of population'],
    requires:     ['occupying force', 'collaborator class'],
    controlledBy: 'military',
    risks:        ['unrest'],
    effects: {
      substrate:  { defense_readiness: +6, public_legitimacy: -12, social_trust: -8 },
      capacities: { defense: { supply: +8 }, administrative: { demand: +6 } },
    },
  },
  other: {
    provides:     [],
    requires:     [],
    controlledBy: 'unattributed',
    risks:        [],
    effects: { substrate: {}, capacities: {} },
  },
});

/**
 * Classify a custom institution. Returns the structured envelope.
 * @param {any} rawEntity
 * @param {import('./settlement.schema.js').SimSettlement} [settlement]
 */
export function classifyCustomInstitution(rawEntity, settlement) {
  if (!rawEntity) return null;
  const name = String(rawEntity.name || rawEntity.label || 'Unnamed institution');
  const category = inferInstitutionCategory(name);
  const tmpl = /** @type {Record<string, any>} */ (CATEGORY_TEMPLATES)[category];
  const contributors = [{
    source: 'category_inference',
    effect: 'matched',
    reason: `"${name}" classified as ${category} institution.`,
  }];

  // If the user provided an explicit faction control or risks, prefer
  // those over the template defaults.
  const controlledBy = rawEntity.controlledBy || rawEntity.controller || tmpl.controlledBy;
  const risks = Array.isArray(rawEntity.risks) && rawEntity.risks.length
    ? [...rawEntity.risks]
    : [...tmpl.risks];
  const provides = Array.isArray(rawEntity.provides) && rawEntity.provides.length
    ? [...rawEntity.provides]
    : [...tmpl.provides];
  const requires = Array.isArray(rawEntity.requires) && rawEntity.requires.length
    ? [...rawEntity.requires]
    : [...tmpl.requires];

  // Effects always merged from template (user can override individual
  // entries; we don't deep-merge — keep it simple).
  const effects = rawEntity.effects
    ? rawEntity.effects
    : { substrate: { ...tmpl.effects.substrate }, capacities: { ...tmpl.effects.capacities } };

  // Modest contextual hint — settlement size, magic level.
  if (settlement?.config?.magicLevel && category === 'arcane') {
    const level = settlement.config.magicLevel;
    if (level === 'rare' || level === 'low') {
      contributors.push({
        source: 'config.magicLevel',
        effect: 'environment_dampen',
        reason: `Arcane institution in a ${level}-magic setting reads as exceptional rather than typical.`,
      });
    }
  }

  return {
    type: 'institution',
    rawName: name,
    inferredCategory: category,
    provides,
    requires,
    controlledBy,
    risks,
    effects,
    contributors,
  };
}

// ── Other-type classifiers (light) ──────────────────────────────────────

/** @param {any} rawEntity */
function classifyCustomFaction(rawEntity) {
  const name = String(rawEntity.name || rawEntity.label || 'Unnamed faction');
  const contributors = [{ source: 'category_inference', effect: 'faction', reason: `"${name}" classified as faction.` }];
  return {
    type: 'faction',
    rawName: name,
    inferredCategory: null,
    provides:     ['power_structure_presence'],
    requires:     ['members', 'resources'],
    controlledBy: rawEntity.controlledBy || 'self',
    risks:        rawEntity.risks || [],
    effects:      { substrate: {}, capacities: {} },
    contributors,
  };
}

/** @param {any} rawEntity */
function classifyCustomNpc(rawEntity) {
  const name = String(rawEntity.name || rawEntity.label || 'Unnamed NPC');
  return {
    type: 'npc',
    rawName: name,
    inferredCategory: null,
    provides:     ['individual_authority'],
    requires:     ['standing in a faction or institution'],
    controlledBy: rawEntity.factionAffiliation || 'unattributed',
    risks:        [],
    effects:      { substrate: {}, capacities: {} },
    contributors: [{ source: 'category_inference', effect: 'npc', reason: `"${name}" classified as NPC.` }],
  };
}

/** @param {any} rawEntity */
function classifyCustomThreat(rawEntity) {
  const name = String(rawEntity.name || rawEntity.label || 'Unnamed threat');
  return {
    type: 'threat',
    rawName: name,
    inferredCategory: rawEntity.threatType || 'other',
    provides:     [],
    requires:     [],
    controlledBy: 'external',
    risks:        [name],
    effects:      { substrate: {}, capacities: {} },
    contributors: [{ source: 'category_inference', effect: 'threat', reason: `"${name}" classified as threat.` }],
  };
}

/** @param {any} rawEntity */
function classifyCustomHook(rawEntity) {
  const text = String(rawEntity.text || rawEntity.name || 'Unnamed hook');
  return {
    type: 'hook',
    rawName: text,
    inferredCategory: rawEntity.category || 'other',
    provides:     ['narrative thread'],
    requires:     [],
    controlledBy: 'narrative',
    risks:        [],
    effects:      { substrate: {}, capacities: {} },
    contributors: [{ source: 'category_inference', effect: 'hook', reason: `"${text}" classified as hook.` }],
  };
}

// ── Universal dispatcher ─────────────────────────────────────────────────

/**
 * Classify any user-added entity. Dispatches by inferred type.
 *
 * @param {Object} rawEntity   { name?, text?, type?, ...optional structured fields }
 * @param {Object} [settlement]
 * @returns {Object | null}
 */
export function classifyCustomEntity(rawEntity, settlement) {
  if (!rawEntity) return null;
  const type = inferCustomEntityType(rawEntity);
  switch (type) {
    case 'institution': return classifyCustomInstitution(rawEntity, settlement);
    case 'faction':     return classifyCustomFaction(rawEntity);
    case 'npc':         return classifyCustomNpc(rawEntity);
    case 'threat':      return classifyCustomThreat(rawEntity);
    case 'hook':        return classifyCustomHook(rawEntity);
    default:            return classifyCustomInstitution(rawEntity, settlement);
  }
}

// ── Catalog accessors ────────────────────────────────────────────────────

export function supportedCustomContentTypes() {
  return [...CUSTOM_CONTENT_TYPES];
}
export function supportedInstitutionCategories() {
  return [...INSTITUTION_CATEGORIES];
}
/** @param {any} category */
export function institutionCategoryTemplate(category) {
  const t = /** @type {Record<string, any>} */ (CATEGORY_TEMPLATES)[category];
  if (!t) return null;
  return {
    provides:     [...t.provides],
    requires:     [...t.requires],
    controlledBy: t.controlledBy,
    risks:        [...t.risks],
    effects:      { substrate: { ...t.effects.substrate }, capacities: { ...t.effects.capacities } },
  };
}
