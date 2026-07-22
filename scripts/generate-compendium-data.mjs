/**
 * generate-compendium-data.mjs — THE REGISTRY-RENDER LAW (the Compendium's headline).
 *
 * WHAT
 *   Emits src/domain/compendium/generated/compendiumData.generated.js — a pure,
 *   frozen data module that renders every enumerable and every count the public
 *   Compendium shows DIRECTLY from the engine's own registries. The Compendium UI,
 *   the global-search index, the A–Z index, and the About page's engine facts all
 *   read this one artifact, so a number on a reference/marketing surface can never
 *   be hand-typed and can never silently drift from the engine.
 *
 * WHY a generated artifact (not a live import)
 *   Two reasons. (1) The freshness test (tests/docs/compendiumDataFreshness.test.js)
 *   asserts the committed module is byte-identical to a fresh build AND checks
 *   per-registry parity — so a registry that gains or loses an entry FAILS CI until
 *   the artifact and the page are regenerated together. That is the drift contract.
 *   (2) The committed artifact is pure frozen data with zero engine imports, so the
 *   lazy Compendium chunk never drags heavy domain/kernel modules into its bundle.
 *
 *   This machinery exists because hand-typed counts rot. Proven in this very tree:
 *   SYSTEM_VARIABLES carries a stale "14 canonical system variables" doc comment
 *   while the array holds 16; the old Compendium hand-typed tier population bands
 *   (Thorp 20-80) that diverge from the engine's POPULATION_RANGES (Thorp 8-60).
 *   Rendering from this artifact makes both classes of drift impossible.
 *
 * WHAT IS DERIVED vs AUTHORED
 *   Derived-from-engine (the drift contract's teeth): causal variables, pressures,
 *   tier bands, prosperity tiers, the operation registry, the deity pool, the map
 *   lenses + style schema, the calamity vocabulary, the interior/facet vocabulary,
 *   the simulation presets + their lit flags, the institution counts.
 *   Authored taxonomy (no engine source exists — verified): the 30 settlement
 *   ARCHETYPES and the 8 neighbour RELATIONSHIP types live in catalogData.js. They
 *   are routed THROUGH this generator so there is ONE render source with a freshness
 *   pin, but they are honestly labelled authored, not pretend-derived.
 *
 * HOW to regenerate
 *   npm run gen:compendium-data
 *
 * Deterministic: no timestamps; key order fixed by construction; array order follows
 * the source registries' own declaration order.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { SYSTEM_VARIABLES, CAUSAL_BANDS, VARIABLE_LABEL } from '../src/domain/causalState.js';
import { PRESSURE_KINDS } from '../src/domain/autonomy/signalRegistry.js';
import { DEITY_AXIS_EFFECTS } from '../src/domain/display/deityEffects.js';
import { DEITY_RANK_AUTHORITY } from '../src/domain/deityConstants.js';
import { FACTION_ARCHETYPES } from '../src/domain/factionArchetypes.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS } from '../src/data/constants.js';
import { OPERATIONS, EXEMPT_OPERATIONS } from '../src/store/operationRegistry.js';
import {
  TOWN_MAP_STYLE_IDS, resolveTownMapStyle,
  FURNITURE_KINDS, HAZARD_GLYPHS, ANCHOR_GLYPHS, CONTRAST_LEVELS,
} from '../src/design/townMapStyles.js';
import { INTERIOR_KINDS, ROOM_KINDS, FURNISHING_KINDS } from '../src/domain/interior/interiorTemplates.js';
import {
  DISASTER_FLAVOR_TITLE, DISASTER_TYPE_BY_TERRAIN, CALAMITY_SEVERITY_BANDS,
} from '../src/domain/spatial/calamity.js';
import {
  SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_PRESET_ID, DEFAULT_SIMULATION_RULES,
} from '../src/domain/worldPulse/simulationRules.js';
import { ARCHETYPES, REL_TYPES } from '../src/domain/compendium/catalogData.js';
import { buildBandLadders } from '../src/domain/compendium/bandLadders.js';
import { APPROVED_CORPUS, corpusCompendiumBlock } from '../src/domain/compendium/corpusStaging.js';
import { institutionalCatalog } from '../src/data/institutionalCatalog.js';
import { fixture } from '../src/components/home/landingFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_PATH = join(
  ROOT, 'src', 'domain', 'compendium', 'generated', 'compendiumData.generated.js',
);

// ── The endgame Living-World systems (authored index → drift-checked flags) ────
// The NAME→FLAG mapping is a curated human index (the engine has no self-describing
// system registry). But each flag string is validated against the real rule-key
// universe below, and preset membership is DERIVED — so a renamed flag fails CI.
// Each system carries a `blurb`: a plain description of what it does in the
// simulation, grounded in its kernel/module (never an effect the code lacks). A
// system with no default preset is honestly noted as off-by-default in its blurb.
const ENDGAME_SYSTEMS = [
  { id: 'doctrine',           label: 'Doctrine — supply-web warfare',   flag: 'supplyWebWarfareEnabled',
    blurb: 'Lets a warring power fight indirectly by striking the enemy\'s supply villages, through raids, occupation, embargo, tolls, and interdiction, instead of meeting its army head on. The strangled supply can force an early peace, and preying on innocents drifts the aggressor\'s reputation.' },
  { id: 'momentum',           label: 'Momentum',                        flag: 'momentumEnabled',
    blurb: 'Tracks each power\'s public commitment to a course of action, built up by visible acts like sieges and mobilizations. Once commitment runs high it resists the rational exit, modelling sunk cost and the cost of losing face.' },
  { id: 'upswing',            label: 'Upswing arcs',                    flag: 'upswingArcsEnabled',
    blurb: 'Drives recovery and growth: rebuilding after calamity or siege, boom and bust from sustained trade, and bounded golden ages. Every gain is paid for from a real source, never conjured.' },
  { id: 'resources',          label: 'Resource dynamics',               flag: 'resourceDynamicsEnabled',
    blurb: 'Lets a settlement\'s resource nodes change over time, with rare discovery of a new terrain-appropriate resource and the loss of a nonrenewable one that has stayed depleted too long.' },
  { id: 'generosity',         label: 'Constructive flows — generosity', flag: 'constructiveFlowsEnabled',
    blurb: 'Models whether an ally gives or withholds relief to a settlement in need, weighing bond and conscience against its own margin and risks. Aid is a conserved transfer with a granary floor it never crosses, and every choice is remembered as an obligation.' },
  { id: 'peace',              label: 'The peace engine',                flag: 'peaceEngineEnabled',
    blurb: 'When a war ends in a suit for peace, the victor imposes treaty terms, from tribute and forced alliance to demilitarization and a puppet seat. Terms run on believed strength, can be cheated under fog, and a broken treaty becomes the cause of the next war.' },
  { id: 'navy',               label: 'The naval layer',                 flag: 'navalEnabled',
    blurb: 'Adds sea power to a mapped realm: convoys carry armies to reachable ports, hostile fleets fight where they share a sea lane, and a blockade can put a port under siege. It stays inert until a realm is placed on the map.' },
  { id: 'convergence',        label: 'Foreign intervention',            flag: 'interventionEnabled',
    blurb: 'Lets a foreign power throw its weight into another settlement\'s internal struggle, currently a coup, to tip the outcome toward the side it favours. Feasibility and motive decide whether the gamble pays off.' },
  { id: 'lifecycle',          label: 'Settlement lifecycle',            flag: 'settlementLifecycleEnabled',
    blurb: 'Lets settlements be born and die on their own: crowded, prosperous towns spawn satellite thorps that grow, starve, or merge, and a failing settlement can reach a terminal death, leaving a resettlable ruin only if it once grew large. Population and food move in conserved amounts at every step.' },
  { id: 'corruption',         label: 'The corruption web',              flag: 'corruptionWebEnabled',
    blurb: 'Lets a foreign patron covertly turn a corruptible official inside a rival settlement, buying sight into it and a measure of hidden influence. It is off in every default preset today and wakes only under a custom ruleset.' },
  { id: 'infoStatecraft',     label: 'Information statecraft',          flag: 'infoStatecraftEnabled',
    blurb: 'Gives each power a credibility standing and the ability to plant a lie, which can spread, be contradicted, and finally be exposed for a reputational cost. It is off in every default preset today and wakes only under a custom ruleset.' },
  { id: 'spatialConsequence', label: 'Spatial consequence',            flag: 'spatialConsequenceEnabled',
    blurb: 'On a mapped realm, it decides where a calamity\'s toll, a siege\'s breach, and corruption\'s creep actually fall across districts, without changing any totals. It is off in every default preset today.' },
  { id: 'provenance',         label: 'The provenance ledger',           flag: 'provenanceLedgerEnabled',
    blurb: 'Records the true parent cause of each durable outcome into a ledger, so the chronicle can mark a link as genuinely recorded rather than merely inferred from time and place. It is off in every default preset today and wakes only under a custom ruleset.' },
  { id: 'urbanFabric',        label: 'Urban fabric',                    flag: 'urbanFabricEnabled',
    blurb: 'Gives each district a slowly decaying sense of prominence, so old power and wealth linger after a regime or economy shifts instead of flipping at once. It also tracks a gradual alignment grain and fading scars from past disasters, and it is off in every default preset today.' },
  { id: 'npcGrowth',          label: 'NPC growth',                      flag: 'npcGrowthEnabled',
    blurb: 'Lets NPCs slowly change: lived events like calamity, betrayal, or a golden age build pressure that can, rarely, add an acquired trait over an NPC\'s authored core, never overwriting it. It is off in every default preset today and wakes only under a custom ruleset.' },
  // NOTE: the live gate for the calamity system is the real rules key
  // `disastersEnabled` (set true in dramatic_campaign + full_simulation). The
  // curated label `calamityEnabled` was NOT a real key, so the preset-membership
  // scan wrongly reported The Great Calamity as dormant. Corrected to the real key.
  { id: 'calamity',           label: 'The Great Calamity',              flag: 'disastersEnabled',
    blurb: 'A rare seeded disaster can strike a settlement, knocking out a few of its non-essential institutions and killing a bounded share of its people. The aftermath, from severed supply chains to exodus and unrest, emerges from the other systems rather than being scripted.' },
];

// ── Living-World vocabulary copy (authored here, drift-checked below) ──────────
// The compendium's Living-World tab renders three identifier-shaped vocabularies:
// the causal substrate variables, the pressures, and the endgame systems. Each
// gets an authored, human label and a plain description of what it captures in the
// simulation (no runtime splitter). Labels for the variables come from the engine's
// own VARIABLE_LABEL (one source); the descriptions are authored here (compendium-
// only, so they stay off the eager first-paint bundles). The validation in
// buildCompendiumDataObject throws if any variable / pressure / system lacks copy,
// so a new entry cannot ship unlabelled.

/** description per substrate variable (what the 0..100 score captures). */
const CAUSAL_VARIABLE_DESC = {
  food_security:            'How reliably the settlement can feed its population, weighing food production and stores against demand. It falls toward famine when granaries and trade cannot cover the mouths to feed.',
  labor_capacity:           'The workforce available for production, services, and building. It reflects population, health, and how much labor is already committed elsewhere.',
  public_legitimacy:        'How far the populace accepts the ruling power as rightful. Low legitimacy invites unrest, defiance, and factional challenge.',
  ruling_authority:         'The reach and grip of the governing power over the settlement. It measures how effectively decisions are enforced, not whether they are welcomed.',
  faction_power:            'The collective strength of organized factions competing for influence. When it is high, rival blocs rather than the ruler increasingly set the agenda.',
  trade_connectivity:       'How well the settlement is tied into trade routes and partners. It governs the flow of goods in and out, and the wealth that flow brings.',
  healing_capacity:         'The settlement\'s ability to treat injury and disease through its healers, temples, and institutions. When it is low, plague and wounds run unchecked.',
  defense_readiness:        'How prepared the settlement is to withstand attack, from walls and garrison to trained militia. It rises with fortification and falls under siege or neglect.',
  criminal_opportunity:     'How much room the settlement leaves for crime to operate. Higher is worse here: it tracks the gaps in law, wealth, and oversight that let criminal networks thrive.',
  religious_authority:      'The reach of religious institutions over settlement life. It reflects how strongly faith shapes governance, custom, and public order.',
  housing_pressure:         'Whether the settlement has enough sound housing for its people. It is scored so higher is better, so a low score means crowding, sprawl, and strained shelter.',
  infrastructure_condition: 'The state of the settlement\'s built fabric: roads, bridges, walls, and public works. It decays without upkeep and limits everything built on top of it.',
  magical_stability:        'How stable and well-governed the settlement\'s magical forces are. Low stability signals unchecked arcane hazard, leakage, or contested magical authority.',
  social_trust:             'The cohesion binding the populace together, the everyday confidence that neighbours and institutions will hold. It frays under stress, division, and betrayal.',
  economic_capacity:        'The overall productive and financial strength of the settlement\'s economy. It underwrites what the settlement can afford to build, field, and endure.',
  law_order:                'How firmly the rule of law holds day to day, from courts and watch to the plain absence of disorder. It falls as crime, faction violence, and unrest rise.',
};

/** label + description per pressure (the 0..1 directional strain on a settlement). */
const PRESSURE_GLOSSARY = {
  food:       { label: 'Food',       description: 'Strain from the settlement failing to feed itself, rising as production and stores fall short of demand. It is the pressure behind famine and food riots.' },
  disease:    { label: 'Disease',    description: 'Strain from sickness and poor sanitation outpacing the settlement\'s ability to treat it. It is the pressure behind plague and its social fallout.' },
  conflict:   { label: 'Conflict',   description: 'Internal strain from factions, classes, or rivals pulling against each other. It is the pressure behind feuds, unrest, and political fracture.' },
  hostility:  { label: 'Hostility',  description: 'External strain from hostile neighbours and threats pressing on the settlement. It is the pressure behind raids, a war footing, and closed gates.' },
  trade:      { label: 'Trade',      description: 'Strain from the settlement\'s trade being disrupted or unable to meet its needs. It rises when routes, partners, or exports falter.' },
  economy:    { label: 'Economy',    description: 'Strain from economic weakness, scarcity, or collapse of livelihoods. It is the pressure behind hardship, debt, and decline.' },
  legitimacy: { label: 'Legitimacy', description: 'Strain from the ruling power losing the populace\'s acceptance. It is the pressure behind defiance, succession disputes, and revolt.' },
  defense:    { label: 'Defense',    description: 'Strain from the settlement being unready to defend itself against the threats it faces. It rises as garrison, walls, and readiness fall behind the danger.' },
  crime:      { label: 'Crime',      description: 'Strain from criminal activity the settlement cannot contain. It is the pressure behind smuggling, extortion, and the erosion of order.' },
};

// ── World-input vocabularies (Wave D): terrain + culture ──────────────────────
// Terrain readings: what each of the seven terrains steers (resource lean, the low-
// agriculture import bias for mountain/hills/desert, and the calamity flavour it
// selects, cross-checked against DISASTER_TYPE_BY_TERRAIN). The terrain LIST is read
// from DISASTER_TYPE_BY_TERRAIN keys; the build guard reds if a terrain lacks a reading.
const TERRAIN_READINGS = {
  plains:    'Open, arable land. Strong agriculture, and fire is its calamity.',
  hills:     'Rolling high ground. Stone and defensible sites, though low agriculture leans on imports, and quakes are its calamity.',
  forest:    'Wooded country. Timber and game, and fire is its calamity.',
  riverside: 'On a river. Mills, ferries, and cheap bulk trade, and floods are its calamity.',
  coastal:   'On the sea. Fishing, ports, and maritime trade, and storms are its calamity.',
  mountain:  'High and rugged. Ore and strong defense, though low agriculture leans on imports, and quakes are its calamity.',
  desert:    'Arid land. Sparse agriculture and hard travel, and storms are its calamity.',
};

// Culture values: the config picker's authorable cultures. 'mixed' is the default
// overlay (no single culture); the rest are the generator's own CULTURES list
// (src/generators/steps/resolveConfig.js), pinned equal by tests/ui/compendiumWorldInputs
// so a drift reds (authored inline to avoid importing resolveConfig's registerStep side
// effect into the build). Culture is flavour more than math (see the note).
const CULTURE_VALUES = [
  { id: 'mixed', label: 'Mixed' }, { id: 'germanic', label: 'Germanic' },
  { id: 'latin', label: 'Latin' }, { id: 'celtic', label: 'Celtic' },
  { id: 'arabic', label: 'Arabic' }, { id: 'norse', label: 'Norse' },
  { id: 'slavic', label: 'Slavic' }, { id: 'east_asian', label: 'East Asian' },
  { id: 'mesoamerican', label: 'Mesoamerican' }, { id: 'south_asian', label: 'South Asian' },
  { id: 'steppe', label: 'Steppe' }, { id: 'greek', label: 'Greek' },
];
const CULTURE_NOTE = 'Culture shapes flavour more than math: the names of settlements and NPCs, the adjectives on traditions, the demand profile, and which gods a world tends to seed at the start. Mixed is the default, with no single culture. This is distinct from the culture-distance the living world derives to measure how alike two settlements behave.';

// Preset copy (Wave E): the four quiet presets read identically ("lights no endgame
// systems") with no basis to choose among them. A per-preset one-liner + the humanized
// autonomy axis distinguish them. Summaries are authored per preset id (build-guarded);
// intensity + autonomy are READ from SIMULATION_RULE_PRESETS. Keyed by preset id.
const PRESET_SUMMARIES = {
  quiet_local:        'A quiet local game. Time passes, but the wider region stays still.',
  realistic_regional: 'The default. The region evolves at a measured, realistic pace.',
  dramatic_campaign:  'A high-drama campaign. Events land hard and the world runs itself.',
  static_campaign:    'Nothing moves without you. The world waits on your every decision.',
  narrative_campaign: 'A quiet stage that proposes changes but waits for your approval.',
  living_realm:       'A fully alive realm that runs the region on its own.',
  full_simulation:    'Everything on. The most complete and demanding simulation.',
};
// Humanized reading of the politicalAutonomy axis (how much the world acts on its own).
const AUTONOMY_LABELS = {
  dm_only:         'you decide everything',
  recommendations: 'it proposes, you approve',
  routine:         'routine acts run, big moves come to you',
  full:            'fully autonomous',
};

// Power family (Wave I): faction archetype readings (keyed by the FACTION_ARCHETYPES
// values; build-guarded so a new archetype without a reading reds) + the governance-
// stability base-label vocabulary (authored from governanceNarrative's parentheticals;
// stresses override the base label with a compound form, stated in the note).
const FACTION_ARCHETYPE_READINGS = {
  government: 'The ruling administration and its offices.',
  noble:      'Landed or hereditary elites.',
  military:   'The garrison, guard, or standing force.',
  merchant:   'Trade houses, guilds, and commercial interests.',
  religious:  'Temples, clergy, and faith institutions.',
  criminal:   'Organized crime and the black market.',
  arcane:     'Mages, academies, and arcane orders.',
  craft:      'Artisans and production guilds.',
  labor:      'Workers, labourers, and their organizations.',
  outsider:   'A foreign or external power with a foothold.',
  occupation: 'An occupying force holding the settlement.',
  civic:      'Civic bodies and community institutions.',
  other:      'A faction that fits none of the above.',
};
const GOVERNANCE_LABELS = [
  { label: 'Stable',         reading: 'Settled governance with no dominant strain.' },
  { label: 'Ordered',        reading: 'Stable under a strong military presence.' },
  { label: 'Tense',          reading: 'Stable but under external threat or monster pressure.' },
  { label: 'Fragile',        reading: 'Held by private security, with no public law.' },
  { label: 'Vulnerable',     reading: 'Prosperous but underdefended.' },
  { label: 'Unstable',       reading: 'Pervasive organized crime, up to outright criminal governance.' },
  { label: 'Enforced Order', reading: 'Authoritarian control.' },
  { label: 'Rigid',          reading: 'A militant theocracy.' },
];
const GOVERNANCE_NOTE = 'An active stress overrides the base label with a compound form (for example Critical under an active siege, Suppressed under occupation, or Fractured, Shaken, and Desperate under others).';

// Map + district vocabularies (Wave K). Lens readings keyed by TOWN_MAP_STYLE_IDS
// (build-guarded); the Illustrated 6th lens is noted separately (it re-shapes geometry,
// not a re-skin). District wealth/safety labels + the category list authored inline,
// drift-pinned to qualitativeBands / districtProfile.
const LENS_READINGS = {
  parchment:   'The default hand-drawn plate.',
  watercolor:  'Soft washes and muted colour.',
  darkFantasy: 'Grim, high-contrast linework.',
  vtt:         'A bare grid and scale bar for virtual tabletops.',
  accessible:  'Colourblind-safe, high-contrast linework (Okabe-Ito).',
};
const ILLUSTRATED_LENS_NOTE = 'A sixth lens, Illustrated, re-shapes the map geometry rather than re-skinning it, so it sits outside the five-lens re-skin family above.';
const DISTRICT_WEALTH = [
  { label: 'Destitute',   reading: 'The poorest quarter; want is the rule.' },
  { label: 'Poor',        reading: 'Getting by, with little to spare.' },
  { label: 'Modest',      reading: 'Ordinary means.' },
  { label: 'Comfortable', reading: 'Reliable means and some surplus.' },
  { label: 'Wealthy',     reading: 'Visibly well off.' },
  { label: 'Opulent',     reading: 'The richest quarter; conspicuous wealth.' },
];
const DISTRICT_SAFETY = [
  { label: 'Lawless',   reading: 'No effective law; the quarter is left to itself.' },
  { label: 'Unsafe',    reading: 'Crime outpaces what watch there is.' },
  { label: 'Watched',   reading: 'A watch is present but stretched.' },
  { label: 'Orderly',   reading: 'Law holds day to day.' },
  { label: 'Fortified',  reading: 'Heavily secured and closely held.' },
];
const DISTRICT_CATEGORIES = [
  'religious', 'merchant', 'military', 'craft', 'noble', 'civic',
  'arcane', 'criminal', 'foreign', 'industrial', 'residential',
];
const DISTRICT_NOTE = 'District wealth grades one quarter of a town; the settlement-wide economy is graded by Prosperity, which happens to share the words Poor, Comfortable, and Wealthy.';

// Title-case a snake/lower identifier for a human label (deterministic).
function titleCase(id) {
  return String(id).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Assemble the Compendium data straight from the engine registries. Every field
 * traces to a src/domain / src/data / src/store / src/design export — never a
 * literal count. Throws if an authored system flag is not a real rule key.
 * @returns {Record<string, unknown>}
 */
export function buildCompendiumDataObject() {
  // The universe of real simulation-rule keys — every wave flag must be one of these.
  const ruleKeyUniverse = new Set(Object.keys(DEFAULT_SIMULATION_RULES || {}));
  for (const p of Object.values(SIMULATION_RULE_PRESETS)) {
    for (const k of Object.keys(p.rules || {})) ruleKeyUniverse.add(k);
  }

  const presetIds = Object.keys(SIMULATION_RULE_PRESETS);
  const presetLabel = (id) => SIMULATION_RULE_PRESETS[id]?.label || titleCase(id);
  const presetsThatLight = (flag) =>
    presetIds.filter((id) => (SIMULATION_RULE_PRESETS[id]?.rules || {})[flag] === true);

  // Drift guard for the Living-World copy: every rendered vocabulary entry must
  // carry its authored label + description, so a new variable / pressure / system
  // cannot ship to the compendium unlabelled (the build fails here; the walker
  // tests/store/operationRegistry.walker.test.js enforces the same at test time).
  for (const id of SYSTEM_VARIABLES) {
    if (!VARIABLE_LABEL[id]) throw new Error(`compendium: SYSTEM_VARIABLE "${id}" has no VARIABLE_LABEL`);
    if (!CAUSAL_VARIABLE_DESC[id]) throw new Error(`compendium: SYSTEM_VARIABLE "${id}" has no CAUSAL_VARIABLE_DESC entry`);
  }
  for (const id of PRESSURE_KINDS) {
    const g = PRESSURE_GLOSSARY[id];
    if (!g || !g.label || !g.description) throw new Error(`compendium: PRESSURE "${id}" has no PRESSURE_GLOSSARY label/description`);
  }
  for (const s of ENDGAME_SYSTEMS) {
    if (!s.blurb) throw new Error(`compendium: endgame system "${s.id}" has no blurb`);
  }
  for (const op of Object.values(OPERATIONS)) {
    if (!op.label) throw new Error(`compendium: operation "${op.opType}" has no label`);
    if (!op.description) throw new Error(`compendium: operation "${op.opType}" has no description`);
  }
  for (const axisId of ['alignment', 'law', 'rank', 'temperament']) {
    const eff = DEITY_AXIS_EFFECTS[axisId];
    if (!eff || Object.keys(eff).length === 0) throw new Error(`compendium: deity axis "${axisId}" missing from DEITY_AXIS_EFFECTS`);
    for (const v of Object.values(eff)) {
      if (!v.effect || !v.effect.trim()) throw new Error(`compendium: deity axis "${axisId}" has a value with no effect string`);
    }
  }
  for (const id of Object.keys(DISASTER_TYPE_BY_TERRAIN)) {
    if (!TERRAIN_READINGS[id]) throw new Error(`compendium: terrain "${id}" has no TERRAIN_READINGS entry`);
  }
  for (const id of Object.values(FACTION_ARCHETYPES)) {
    if (!FACTION_ARCHETYPE_READINGS[id]) throw new Error(`compendium: faction archetype "${id}" has no reading`);
  }
  for (const id of TOWN_MAP_STYLE_IDS) {
    if (!LENS_READINGS[id]) throw new Error(`compendium: map lens "${id}" has no LENS_READINGS entry`);
  }

  // Systems: preset membership derived; wave flags validated against the universe.
  const systems = ENDGAME_SYSTEMS.map((s) => {
    const inUniverse = ruleKeyUniverse.has(s.flag);
    const presets = presetsThatLight(s.flag);
    // A wave flag (one that appears in the rule universe) must resolve to a real
    // key; a dormant flag (corruption, provenance, …) legitimately has no preset.
    return {
      id: s.id, label: s.label, flag: s.flag, blurb: s.blurb,
      presetGated: inUniverse,
      dormant: presets.length === 0,
      presets,
    };
  });

  // The presets, with the distinguishing axes (intensity + autonomy, READ from the
  // configs) + an authored summary + exactly which endgame flags each lights (derived).
  const systemFlags = ENDGAME_SYSTEMS.map((s) => s.flag);
  const presets = presetIds.map((id) => {
    const rules = SIMULATION_RULE_PRESETS[id]?.rules || {};
    if (!PRESET_SUMMARIES[id]) throw new Error(`compendium: preset "${id}" has no PRESET_SUMMARIES entry`);
    const intensity = rules.intensity || DEFAULT_SIMULATION_RULES.intensity;
    const autonomy = rules.politicalAutonomy || DEFAULT_SIMULATION_RULES.politicalAutonomy;
    return {
      id,
      label: presetLabel(id),
      isDefault: id === DEFAULT_SIMULATION_PRESET_ID,
      summary: PRESET_SUMMARIES[id],
      intensity,
      autonomy,
      autonomyLabel: AUTONOMY_LABELS[autonomy] || autonomy,
      lights: systemFlags.filter((f) => rules[f] === true),
    };
  });

  // Institution counts (the InstitutionsTab renders the live catalog itself; here
  // we only publish the counts so the dashboard number can't be hand-typed).
  const distinctInstitutions = new Set();
  let institutionTierNameEntries = 0;
  for (const tier of Object.keys(institutionalCatalog)) {
    for (const cat of Object.keys(institutionalCatalog[tier] || {})) {
      for (const name of Object.keys(institutionalCatalog[tier][cat] || {})) {
        institutionTierNameEntries += 1;
        distinctInstitutions.add(name);
      }
    }
  }

  return {
    meta: {
      // The public demo world = the frozen landing fixture's town (owner-sanctioned
      // seed lf-033), read from the committed fixture so it can't drift.
      demoWorld: {
        seed: fixture.seed,
        name: fixture.town.name,
        population: fixture.town.population,
      },
    },

    causal: {
      variables: [...SYSTEM_VARIABLES],
      variableCount: SYSTEM_VARIABLES.length,
      // Each variable with its authored label (the engine's own VARIABLE_LABEL) and
      // a plain description of what its 0..100 score captures. The Living-World tab
      // renders these instead of splitting the snake_case id at render time.
      variableEntries: SYSTEM_VARIABLES.map((id) => ({
        id,
        label: VARIABLE_LABEL[id],
        description: CAUSAL_VARIABLE_DESC[id],
      })),
      bands: [...CAUSAL_BANDS],
      bandCount: CAUSAL_BANDS.length,
    },

    pressures: {
      kinds: [...PRESSURE_KINDS],
      count: PRESSURE_KINDS.length,
      // Each pressure with its authored label + a description of the 0..1 strain.
      entries: PRESSURE_KINDS.map((id) => ({
        id,
        label: PRESSURE_GLOSSARY[id].label,
        description: PRESSURE_GLOSSARY[id].description,
      })),
    },

    tiers: TIER_ORDER.map((id) => ({
      id,
      label: titleCase(id),
      min: POPULATION_RANGES[id]?.min ?? null,
      max: POPULATION_RANGES[id]?.max ?? null,
    })),

    prosperity: {
      tiers: [...PROSPERITY_TIERS],
      count: PROSPERITY_TIERS.length,
    },

    // Banded concepts render their FULL ladder — every rung NAMED with a one-line
    // reading of how to interpret a settlement at that rung. Names read from the
    // typed tables (PROSPERITY_TIERS / glossary stability+strain+capture); prosperity
    // readings are authored (src/domain/compendium/bandLadders.js), the rest read
    // from the glossary derivation. A new band without a reading fails the walker.
    bandLadders: buildBandLadders(),

    operations: {
      count: Object.keys(OPERATIONS).length,
      exemptCount: Object.keys(EXEMPT_OPERATIONS).length,
      byKlass: Object.values(OPERATIONS).reduce((acc, op) => {
        acc[op.klass] = (acc[op.klass] || 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({})),
      scopes: [...new Set(Object.values(OPERATIONS).map((op) => op.targetScope))].sort(),
      // Every registered op, in declaration order: its authored label + description
      // (so the Compendium renders a legible name and says what the op does, not just
      // the raw camelCase opType), its class, its scope, whether it leaves a receipt,
      // whether it can be undone. THE trust artifact for ruling 1.
      entries: Object.values(OPERATIONS).map((op) => ({
        opType: op.opType,
        label: op.label,
        description: op.description,
        klass: op.klass,
        slice: op.slice,
        targetScope: op.targetScope,
        receiptRef: op.receiptRef,
        undoToken: op.undoToken,
      })),
    },

    // The premade-deity roster is intentionally absent (owner ruling 2026-07-21: no
    // premade deities; deities enter a world only via custom-content authoring). What
    // the Compendium DOES publish is the doctrine-compliant vocabulary: the four axes a
    // custom deity is authored on, projected from the engine's DEITY_AXIS_EFFECTS single
    // source (never re-typed, so it can never disagree with the engine), each value's
    // effect string carrying its own name. Rank appends its authority lift (never re-typed).
    faith: {
      authorship: 'Deities enter a world only through custom-content authoring; there is no premade roster. You author a god on the four axes below, and the living pantheon does the rest as the faith spreads.',
      temperNote: 'Temperament is not a dial you set. The engine derives it from the alignment and law axes: evil and chaos push a god warlike, good and law push it peacelike.',
      axes: [
        { id: 'alignment', label: 'Alignment', lines: [
          DEITY_AXIS_EFFECTS.alignment.good.effect,
          DEITY_AXIS_EFFECTS.alignment.evil.effect,
        ] },
        { id: 'law', label: 'Law', lines: [
          DEITY_AXIS_EFFECTS.law.lawful.effect,
          DEITY_AXIS_EFFECTS.law.chaotic.effect,
        ] },
        { id: 'rank', label: 'Rank', lines: [
          `${DEITY_AXIS_EFFECTS.rank.major.effect} (a lift of ${DEITY_RANK_AUTHORITY.major})`,
          `${DEITY_AXIS_EFFECTS.rank.minor.effect} (a lift of ${DEITY_RANK_AUTHORITY.minor})`,
          `${DEITY_AXIS_EFFECTS.rank.cult.effect} (a lift of ${DEITY_RANK_AUTHORITY.cult})`,
        ] },
        { id: 'temperament', label: 'Temperament', derived: true, lines: [
          DEITY_AXIS_EFFECTS.temperament.warlike.effect,
          DEITY_AXIS_EFFECTS.temperament.peacelike.effect,
        ] },
      ],
    },

    // World inputs the config picker offers whose HelpPopover deep-links landed on
    // pages that never defined them: the seven terrains (list from the calamity
    // terrain map; readings authored) and the culture vocabulary.
    terrain: Object.keys(DISASTER_TYPE_BY_TERRAIN).map((id) => ({ id, reading: TERRAIN_READINGS[id] })),
    cultures: { values: [...CULTURE_VALUES], note: CULTURE_NOTE },

    // Power family (Wave I): the 13 faction archetypes (from FACTION_ARCHETYPES + authored
    // readings) and the governance-stability base-label vocabulary. The legitimacy ladder
    // rides CD.bandLadders (tab:'power').
    factionArchetypes: Object.values(FACTION_ARCHETYPES).map((id) => ({ id, label: titleCase(id), reading: FACTION_ARCHETYPE_READINGS[id] })),
    governance: { labels: GOVERNANCE_LABELS.map((g) => ({ ...g })), note: GOVERNANCE_NOTE },

    lenses: {
      count: TOWN_MAP_STYLE_IDS.length,
      entries: TOWN_MAP_STYLE_IDS.map((id) => ({ id, label: resolveTownMapStyle(id).label, reading: LENS_READINGS[id] })),
      illustratedNote: ILLUSTRATED_LENS_NOTE,
      schema: {
        furniture: [...FURNITURE_KINDS],
        hazardGlyphs: [...HAZARD_GLYPHS],
        anchorGlyphs: [...ANCHOR_GLYPHS],
        contrastLevels: [...CONTRAST_LEVELS],
      },
    },

    // District vocabularies (Wave K): the per-quarter wealth (6) + safety (5) ladders
    // and the category list the settlement-map cards show; distinct from settlement-wide
    // Prosperity (the note disarms the shared Poor/Comfortable/Wealthy words).
    districts: {
      wealth: DISTRICT_WEALTH.map((x) => ({ ...x })),
      safety: DISTRICT_SAFETY.map((x) => ({ ...x })),
      categories: [...DISTRICT_CATEGORIES],
      note: DISTRICT_NOTE,
    },

    // Facets: the exported interior/facet vocabulary. The 7 institution natures are
    // the interior kinds minus the 'generic' fallback. The institutionFunction axis
    // is intentionally omitted — its table is un-exported in the engine (a documented
    // deferral, mirroring the glossary's facet scope note), so it is not invented here.
    facets: {
      natures: INTERIOR_KINDS.filter((k) => k !== 'generic'),
      interiorKinds: [...INTERIOR_KINDS],
      roomKinds: [...ROOM_KINDS],
      furnishingKinds: [...FURNISHING_KINDS],
    },

    // Calamity: by owner ruling the mechanics are ONE unified bucket ("The Great
    // Calamity"); the "types" are cosmetic DM flavour. Rendered honestly as such.
    calamity: {
      flavors: Object.entries(DISASTER_FLAVOR_TITLE).map(([key, title]) => ({ key, title })),
      severityBands: Object.entries(CALAMITY_SEVERITY_BANDS).map(([key, v]) => ({
        key, scale: v.scale, kFactor: v.kFactor,
      })),
      terrainMap: Object.entries(DISASTER_TYPE_BY_TERRAIN).map(([terrain, type]) => ({ terrain, type })),
    },

    systems,
    presets,

    // ── Authored taxonomy (no engine source — routed through for one render source) ─
    archetypes: {
      count: ARCHETYPES.length,
      authored: true,
      categories: [...new Set(ARCHETYPES.map((a) => a.cat))],
      entries: ARCHETYPES.map((a) => ({ cat: a.cat, name: a.name, cond: a.cond, desc: a.desc })),
    },

    relationships: {
      count: REL_TYPES.length,
      authored: true,
      entries: REL_TYPES.map((r) => ({ id: r.id, label: r.label, color: r.color, effect: r.effect })),
    },

    // ── V-5 THE CORPUS FACTORY — the owner-approved corpus folded into canon (empty
    // until the owner commits approved candidates to corpusStaging.js). Staged/rejected
    // candidates live only in the runtime store and NEVER reach this artifact. ─────────
    corpus: corpusCompendiumBlock(APPROVED_CORPUS),

    institutions: {
      tierCount: Object.keys(institutionalCatalog).length,
      entryCount: institutionTierNameEntries,
      distinctNames: distinctInstitutions.size,
    },
  };
}

// ── Deterministic emit: objects pretty (one key/line), arrays-of-objects compact
// (one object/line) so the file stays diff-friendly AND well under the 800-line
// domain max-lines ceiling (164 ops → 164 lines, not ~1,300). ────────────────────
function emit(value, indent) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Arrays of primitives render inline; arrays of objects one-per-line compact.
    if (value.every((v) => v === null || typeof v !== 'object')) return JSON.stringify(value);
    return `[\n${value.map((v) => padIn + JSON.stringify(v)).join(',\n')}\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const body = keys
      .map((k) => `${padIn}${JSON.stringify(k)}: ${emit(value[k], indent + 1)}`)
      .join(',\n');
    return `{\n${body}\n${pad}}`;
  }
  return JSON.stringify(value);
}

/**
 * Render the generated JS module string. Pure + deterministic — the freshness test
 * diffs the committed file against this exact output.
 * @returns {string}
 */
export function buildCompendiumData() {
  const data = buildCompendiumDataObject();
  const lines = [];
  lines.push('// GENERATED FILE — DO NOT EDIT BY HAND.');
  lines.push('// Source of truth: the engine registries (causalState, signalRegistry,');
  lines.push('// constants, operationRegistry, deityPool, townMapStyles, interiorTemplates,');
  lines.push('// calamity, simulationRules) + the authored catalogData taxonomy.');
  lines.push('// Regenerate: npm run gen:compendium-data');
  lines.push('// Pinned by tests/docs/compendiumDataFreshness.test.js (byte-identity + parity).');
  lines.push('//');
  lines.push('// THE REGISTRY-RENDER LAW: every enumerable and every count the public');
  lines.push('// Compendium shows renders from this artifact, so a divergent constant fails CI.');
  lines.push('');
  lines.push(`export const COMPENDIUM_DATA = Object.freeze(${emit(data, 0)});`);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const js = buildCompendiumData();
  writeFileSync(DATA_PATH, js);
  const d = buildCompendiumDataObject();
  process.stdout.write(
    `[generate-compendium-data] wrote ${DATA_PATH} ` +
    `(${d.causal.variableCount} vars · ${d.pressures.count} pressures · ` +
    `${d.operations.count} ops · ${d.lenses.count} lenses)\n`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
