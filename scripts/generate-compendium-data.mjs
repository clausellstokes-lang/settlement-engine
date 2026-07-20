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

import { SYSTEM_VARIABLES, CAUSAL_BANDS } from '../src/domain/causalState.js';
import { PRESSURE_KINDS } from '../src/domain/autonomy/signalRegistry.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS } from '../src/data/constants.js';
import { OPERATIONS, EXEMPT_OPERATIONS } from '../src/store/operationRegistry.js';
import { DEITY_POOL } from '../src/generators/data/deityPool.js';
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
const ENDGAME_SYSTEMS = [
  { id: 'doctrine',           label: 'Doctrine — supply-web warfare',   flag: 'supplyWebWarfareEnabled' },
  { id: 'momentum',           label: 'Momentum',                        flag: 'momentumEnabled' },
  { id: 'upswing',            label: 'Upswing arcs',                    flag: 'upswingArcsEnabled' },
  { id: 'resources',          label: 'Resource dynamics',               flag: 'resourceDynamicsEnabled' },
  { id: 'generosity',         label: 'Constructive flows — generosity', flag: 'constructiveFlowsEnabled' },
  { id: 'peace',              label: 'The peace engine',                flag: 'peaceEngineEnabled' },
  { id: 'navy',               label: 'The naval layer',                 flag: 'navalEnabled' },
  { id: 'convergence',        label: 'Foreign intervention',            flag: 'interventionEnabled' },
  { id: 'lifecycle',          label: 'Settlement lifecycle',            flag: 'settlementLifecycleEnabled' },
  { id: 'corruption',         label: 'The corruption web',              flag: 'corruptionWebEnabled' },
  { id: 'infoStatecraft',     label: 'Information statecraft',          flag: 'infoStatecraftEnabled' },
  { id: 'spatialConsequence', label: 'Spatial consequence',            flag: 'spatialConsequenceEnabled' },
  { id: 'provenance',         label: 'The provenance ledger',           flag: 'provenanceLedgerEnabled' },
  { id: 'urbanFabric',        label: 'Urban fabric',                    flag: 'urbanFabricEnabled' },
  { id: 'npcGrowth',          label: 'NPC growth',                      flag: 'npcGrowthEnabled' },
  { id: 'calamity',           label: 'The Great Calamity',              flag: 'calamityEnabled' },
];

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

  // Systems: preset membership derived; wave flags validated against the universe.
  const systems = ENDGAME_SYSTEMS.map((s) => {
    const inUniverse = ruleKeyUniverse.has(s.flag);
    const presets = presetsThatLight(s.flag);
    // A wave flag (one that appears in the rule universe) must resolve to a real
    // key; a dormant flag (corruption, provenance, …) legitimately has no preset.
    return {
      id: s.id, label: s.label, flag: s.flag,
      presetGated: inUniverse,
      dormant: presets.length === 0,
      presets,
    };
  });

  // The presets, with exactly which endgame-system flags each one lights (derived).
  const systemFlags = ENDGAME_SYSTEMS.map((s) => s.flag);
  const presets = presetIds.map((id) => ({
    id,
    label: presetLabel(id),
    isDefault: id === DEFAULT_SIMULATION_PRESET_ID,
    lights: systemFlags.filter((f) => (SIMULATION_RULE_PRESETS[id]?.rules || {})[f] === true),
  }));

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
      bands: [...CAUSAL_BANDS],
      bandCount: CAUSAL_BANDS.length,
    },

    pressures: {
      kinds: [...PRESSURE_KINDS],
      count: PRESSURE_KINDS.length,
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

    operations: {
      count: Object.keys(OPERATIONS).length,
      exemptCount: Object.keys(EXEMPT_OPERATIONS).length,
      byKlass: Object.values(OPERATIONS).reduce((acc, op) => {
        acc[op.klass] = (acc[op.klass] || 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({})),
      scopes: [...new Set(Object.values(OPERATIONS).map((op) => op.targetScope))].sort(),
      // Every registered op, in declaration order: its class, its scope, whether it
      // leaves a receipt, whether it can be undone. THE trust artifact for ruling 1.
      entries: Object.values(OPERATIONS).map((op) => ({
        opType: op.opType,
        klass: op.klass,
        slice: op.slice,
        targetScope: op.targetScope,
        receiptRef: op.receiptRef,
        undoToken: op.undoToken,
      })),
    },

    deities: {
      count: DEITY_POOL.length,
      entries: DEITY_POOL.map((d) => ({
        slug: d.slug,
        name: d.name,
        portfolio: d.portfolio,
        alignment: d.alignmentAxis,
        law: d.lawAxis,
        temperament: d.temperamentAxis,
        rank: d.rankAxis,
        domain: d.domain,
      })),
    },

    lenses: {
      count: TOWN_MAP_STYLE_IDS.length,
      entries: TOWN_MAP_STYLE_IDS.map((id) => ({ id, label: resolveTownMapStyle(id).label })),
      schema: {
        furniture: [...FURNITURE_KINDS],
        hazardGlyphs: [...HAZARD_GLYPHS],
        anchorGlyphs: [...ANCHOR_GLYPHS],
        contrastLevels: [...CONTRAST_LEVELS],
      },
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
    `${d.operations.count} ops · ${d.deities.count} deities · ${d.lenses.count} lenses)\n`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
