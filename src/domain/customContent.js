/**
 * domain/customContent.js — Classify user-added content as causal objects.
 *
 * Tier 4.16 of the roadmap. When a user adds "Dragonbone Foundry,"
 * the simulator needs to know what it IS structurally — category,
 * what it provides, what it requires, what controls it, what risks
 * it raises, what effects it has on substrate / capacities. Without
 * structure, user content is just appended prose; with it, the
 * content flows through every Tier 4 derivation alongside generated
 * entities.
 *
 *   classifyCustomEntity(rawEntity, settlement) -> {
 *     type, rawName, inferredCategory,
 *     provides, requires, controlledBy,
 *     risks, effects,
 *     contributors[]
 *   }
 *
 * Pure read-only. Pattern-based inference (same Phase 11 / Phase 20
 * pattern). The simulator's rerun is already Phase 18's job — this
 * module produces the structured input Phase 18 consumes.
 *
 * MG-3h (leak L12, chair ruling R-BLD-5): TWO drifts closed here. The `arcane` category
 * was inferred from a pattern of purely AMBIGUOUS tokens (tower|college|circle|enclave…)
 * with no catalog consult, and the magic-level hint read `config.magicLevel` RAW —
 * a second spelling of the magic gate, blind to the legacy band vocabulary and, worse,
 * silent in a world where magic does not function at all. Both now read the canonical
 * sources: domain/arcaneIdentity for identity, domain/magicLedger for the band.
 */

import { magicLedger } from './magicLedger.js';
import { ARCANE_IDENTITY } from './arcaneIdentity.js';
import { stripNegatedMagic } from './magicAssertionText.js';
import { institutionCatalogArcaneTag } from './arcaneInstitutionIdentity.js';

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

/**
 * @typedef {Object} RawCustomEntity
 * @property {string} [name]
 * @property {string} [label]
 * @property {string} [text]
 * @property {string} [type]
 * @property {string} [controlledBy]
 * @property {string} [controller]
 * @property {string} [factionAffiliation]
 * @property {string} [threatType]
 * @property {string} [category]
 * @property {string[]} [risks]
 * @property {string[]} [provides]
 * @property {string[]} [requires]
 * @property {{ substrate?: Object, capacities?: Object }} [effects]
 */

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

/**
 * @param {RawCustomEntity | null | undefined} rawEntity
 * @returns {string | null}
 */
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

/**
 * @param {string} name
 * @returns {keyof typeof CATEGORY_TEMPLATES}
 */
function inferInstitutionCategory(name) {
  for (const { pattern, category } of INSTITUTION_CATEGORY_PATTERNS) {
    // MG-3h / R-BLD-5: the arcane slot consults the AUTHORED CATALOG TAG first, and the
    // tag is authoritative in BOTH directions — a custom entity named for a catalog
    // institution the author tagged mundane ('Great library', authored `education`) falls
    // through to the later patterns instead of claiming the arcane slot.
    //
    // The NAME PATTERN then stands unchanged for everything else, and that is deliberate
    // rather than an omission. This surface classifies USER-AUTHORED content, where the
    // name IS the authored tag: a DM who types "Conclave of the Veil" has declared an
    // arcane order, and MG-LAW-4 says an authored premise survives. Demanding a second
    // corroborating magic word here would silently demote the DM's own naming — the
    // opposite failure from the one the register recorded. The ambiguity cure belongs on
    // the surfaces that classify GENERATED entities against a catalog (L10), not here.
    // What the ruling does bind here is the denial clause: a name is read with the world
    // law's NEGATED_MAGIC_PATTERNS struck out first.
    if (category === 'arcane') {
      const tag = institutionCatalogArcaneTag(name);
      if (tag !== ARCANE_IDENTITY.UNKNOWN) {
        if (tag === ARCANE_IDENTITY.ARCANE) return 'arcane';
        continue;
      }
      if (pattern.test(stripNegatedMagic(name))) return 'arcane';
      continue;
    }
    if (pattern.test(name)) return /** @type {keyof typeof CATEGORY_TEMPLATES} */ (category);
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
 * @param {RawCustomEntity | null | undefined} rawEntity
 * @param {{ config?: { magicLevel?: string, priorityMagic?: number, magicExists?: boolean } | null }} [settlement]
 * @returns {Object | null}
 */
export function classifyCustomInstitution(rawEntity, settlement) {
  if (!rawEntity) return null;
  const name = String(rawEntity.name || rawEntity.label || 'Unnamed institution');
  const category = inferInstitutionCategory(name);
  const tmpl = CATEGORY_TEMPLATES[category];
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

  // Modest contextual hint — the settlement's magic environment.
  //
  // MG-3h / L12: this read `config.magicLevel` RAW and matched the literal strings
  // 'rare'/'low'. Two failures followed. It was blind to the legacy band vocabulary the
  // canonical accessor folds ('moderate', 'common', 'pervasive' — a save carrying those
  // got no hint at all), and it had NOTHING to say about a world where magic does not
  // function: an arcane institution in a dead-magic realm was described as "exceptional
  // rather than typical", which reads as rare-but-working. It now goes through
  // magicLedger — the one canonical accessor — and the magic-off case gets its own,
  // honest line. MG-LAW-4 holds throughout: the entity is never erased or reclassified,
  // it is annotated. The DM's one strange glowing city stays exactly where it was put.
  if (category === 'arcane') {
    const ledger = magicLedger(settlement);
    // `present:false` means the settlement carries NO magic axis at all — an un-generated
    // record, or the classifier called with no settlement. The ledger's neutral envelope
    // reports magicExists:false there, which is absence, not a dead-magic world; reading
    // it as one would stamp "magic does not function" onto every context-free
    // classification. The raw world fact is consulted only in that gap, which also closes
    // the recorded latent edge where a config carries magicExists:false and nothing else.
    const magicOff = ledger.present
      ? !ledger.magicExists
      : settlement?.config?.magicExists === false;
    if (magicOff) {
      contributors.push({
        source: 'magicLedger.magicExists',
        effect: 'environment_inert',
        reason: 'Magic does not function in this world. The institution stands, but nothing it '
          + 'claims to do arcanely works — read its output as trade, scholarship, or belief.',
      });
    } else if (ledger.present && ledger.magicLevel === 'none') {
      contributors.push({
        source: 'magicLedger.magicLevel',
        effect: 'environment_dampen',
        reason: 'No arcane practice is established here. The institution stands without a local '
          + 'tradition behind it — whoever works there learned it somewhere else.',
      });
    } else if (ledger.present && ledger.magicLevel === 'low') {
      contributors.push({
        source: 'magicLedger.magicLevel',
        effect: 'environment_dampen',
        reason: 'Arcane institution in a low-magic setting reads as exceptional rather than typical.',
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

/** @param {RawCustomEntity} rawEntity */
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

/** @param {RawCustomEntity} rawEntity */
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

/** @param {RawCustomEntity} rawEntity */
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

/** @param {RawCustomEntity} rawEntity */
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
 * @param {RawCustomEntity} rawEntity   { name?, text?, type?, ...optional structured fields }
 * @param {{ config?: { magicLevel?: string, priorityMagic?: number, magicExists?: boolean } | null }} [settlement]
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
/** @param {string} category */
export function institutionCategoryTemplate(category) {
  const t = CATEGORY_TEMPLATES[/** @type {keyof typeof CATEGORY_TEMPLATES} */ (category)];
  if (!t) return null;
  return {
    provides:     [...t.provides],
    requires:     [...t.requires],
    controlledBy: t.controlledBy,
    risks:        [...t.risks],
    effects:      { substrate: { ...t.effects.substrate }, capacities: { ...t.effects.capacities } },
  };
}
