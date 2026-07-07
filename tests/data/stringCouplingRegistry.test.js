/**
 * stringCouplingRegistry.test.js — THE registry of cross-map string joins.
 *
 * The engine's deepest structural fragility is exact/substring string coupling
 * between parallel data maps: a name defined in one map is referenced by
 * literal string in another, and every such join fails SILENTLY on drift — a
 * rename or typo disables a gate, a boost, a classification, or a cross-link
 * with no error. Individual guards existed (institutionNameIntegrity,
 * spatialDataTokenIntegrity, tests/joins/*), but each covered one join and
 * nothing enforced that a NEW join got a guard at all.
 *
 * This file completes that defense:
 *   1. REGISTRY — one declarative entry per cross-map join not already owned
 *      by a dedicated test. Each entry lists the provider strings, the match
 *      rule the REAL consumer uses, and a pinned exception set asserted
 *      EXACTLY (the honest-list discipline): a NEW orphan fails (drift
 *      caught), and a FIXED one also fails until removed from the pin.
 *   2. affectedSystems LITERAL AUDIT — every literal affectedSystems array
 *      minted anywhere in src/ must use the 16 SYSTEM_VARIABLES (or a
 *      canonical alias), because every causal deriver joins on those strings
 *      exactly (the cycle-4/5 lift-polarity bug family lived here).
 *   3. SITE SWEEP — self-enforcement: every DEFINITION site of a
 *      join-carrying field in src/ must be claimed here or by a named
 *      dedicated guard, so a new joining map cannot ship unguarded.
 *
 * When an entry fails: read its `owner` note first. Fix the DATA so both
 * sides agree (usual case), or — for a deliberate superset / dormant hook —
 * extend the pin with a comment saying why. Never blind-update a pin.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import {
  catalogInstitutionNames,
  definedInstitutionNames,
  terrainResourceNames,
} from '../../src/data/entityVocabulary.js';
import { RESOURCE_DATA, SPECIAL_RESOURCES, RESOURCE_CHAINS } from '../../src/data/resourceData.js';
import { COMMODITY_CATEGORY_MAP } from '../../src/data/tradeGoodsData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { exactGoodId } from '../../src/domain/region/goodsCatalog.js';
import { SYSTEM_VARIABLES } from '../../src/domain/causalState.js';
import {
  supportedConditionArchetypes,
  conditionArchetypeTemplate,
} from '../../src/domain/activeConditions.js';
import { STRESSOR_CATALOG, CAUSAL_SYSTEM_ALIASES } from '../../src/domain/worldPulse/stressors.js';
import { STRESSOR_SYSTEM_ALIASES } from '../../src/domain/crisisLifecycle.js';
import { PROPAGATION_MATRIX } from '../../src/lib/relationshipGraph.js';
import { RELATIONSHIP_TYPES } from '../../src/store/neighbourSlice.js';
import { REL_HEX, REL_RGB } from '../../src/components/settlements/relationshipColors.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../../src/domain/worldPulse/relationshipCompatibility.js';
import { RELATIONSHIP_TYPE_ALIASES } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';
import { ARCHETYPE_IMPACTS } from '../../src/domain/factionRelationshipUpdate.js';
import { GEN_TO_PULSE_TYPE } from '../../src/domain/stressorPicker.js';
import { HIGH_MAGIC_INSTITUTIONS, SPATIAL_FEATURES } from '../../src/generators/structuralValidator.js';
import { EXTRACTION_BOOSTS } from '../../src/generators/steps/assembleInstitutions.js';
import { RESOURCE_GOOD_INST_GATES } from '../../src/generators/computeActiveChains.js';

// ── Shared vocabulary snapshots ──────────────────────────────────────────────
const CATALOG_LOWER = [...catalogInstitutionNames()].map((n) => n.toLowerCase());
const DEFINED = definedInstitutionNames(Object.keys(SPATIAL_FEATURES));
const SYSTEMS = new Set(SYSTEM_VARIABLES);

// The consumer-faithful substring rule used by getResourceMultiplier and the
// EXTRACTION_BOOSTS loop: lowercased institution name .includes(fragment).
const substringMatchesSomeInstitution = (fragment) =>
  CATALOG_LOWER.some((n) => n.includes(String(fragment).toLowerCase()));

// Impact-profile keys with SPECIAL consumer semantics (not archetype names):
// '_default' (fallback profile), 'sameAsTarget' (the removed NPC's own faction),
// 'rival' (the top non-same-archetype faction) — see factionRelationshipUpdate's
// KILL_NPC handling. Everything else must be a canonical archetype.
const SPECIAL_IMPACT_KEYS = new Set(['_default', 'sameAsTarget', 'rival']);

// ── THE REGISTRY ─────────────────────────────────────────────────────────────
const REGISTRY = [
  {
    id: 'structuralValidator.HIGH_MAGIC_INSTITUTIONS → defined institution names (exact)',
    provides: () => HIGH_MAGIC_INSTITUTIONS,
    vocabularyCheck: (n) => DEFINED.has(n),
    exceptions: [
      // In NO vocabulary — dormant hooks that fire only for an identically-named
      // CUSTOM institution (same dormancy contract as the SUPERSET_GATE_KEYS pin).
      'Extradimensional vault',
      'High magic district',
    ],
    owner:
      'Low-magic context warning (structuralValidator). Exact join against the expanded present set; ' +
      'four tokens were dead until aligned to their catalog "(high magic)" names — do not re-shorten.',
  },
  {
    id: 'SPECIAL_RESOURCES effects.institutionModifiers[].name → catalog names (substring)',
    provides: () => {
      const names = new Set();
      for (const r of Object.values(SPECIAL_RESOURCES)) {
        for (const m of r?.effects?.institutionModifiers || []) if (m?.name) names.add(m.name);
      }
      return names;
    },
    vocabularyCheck: substringMatchesSomeInstitution,
    exceptions: [
      // No catalog name CONTAINS these tokens (the join lowercases the name and
      // asks name.includes(token)) — so the boost never fires for GENERATED
      // institutions, only for a custom institution whose name contains the
      // token. Note the direction trap: "Sage/library" and "Adventurers' guild
      // hall" LOOK real (they are GATE/superset vocabulary), but no emittable
      // catalog name contains them. The special-resources path is additionally
      // inert in shipped generation (generateNarratives passes
      // specialResources: []). Pinned so a catalog rename that kills a LIVE
      // modifier still trips this entry.
      "Adventurers' guild hall",
      'Antiquarian',
      'Pilgrimage shrine',
      'Sage/library',
      'Spa/healing house',
      'Toll station',
    ],
    owner:
      'assembleInstitutions getResourceMultiplier instModifiers branch: name.includes(mod.name.toLowerCase()).',
  },
  {
    id: 'RESOURCE_DATA instBoosts KEYS → catalog names (substring stems)',
    provides: () => {
      const keys = new Set();
      for (const r of Object.values(RESOURCE_DATA)) {
        for (const k of Object.keys(r?.instBoosts || {})) keys.add(k);
      }
      return keys;
    },
    vocabularyCheck: substringMatchesSomeInstitution,
    exceptions: [
      // Stems matching no catalog name today. They are DISPLAY data too
      // (resolveResources downstreamEffects lists them), so deleting them is
      // NOT free — a cycle-5 attempt changed the golden master. If a new
      // catalog institution makes one live, remove it from this pin.
      'mason',
      'stonemason',
    ],
    owner:
      'assembleInstitutions getResourceMultiplier: name.includes(boostKey) — generation probability. ' +
      'Keys double as downstreamEffects display strings (resolveResources), so do not delete "dead" keys.',
  },
  {
    id: 'EXTRACTION_BOOSTS KEYS → RESOURCE_DATA keys (exact)',
    provides: () => Object.keys(EXTRACTION_BOOSTS),
    vocabularyCheck: (k) => Boolean(RESOURCE_DATA[k]),
    exceptions: [],
    owner: 'assembleInstitutions EXTRACTION_BOOSTS[resourceKey] — exact lookup keyed by nearbyResources.',
  },
  {
    id: 'EXTRACTION_BOOSTS FRAGMENTS → catalog names (substring)',
    provides: () => {
      const frags = new Set();
      for (const m of Object.values(EXTRACTION_BOOSTS)) for (const f of Object.keys(m)) frags.add(f);
      return frags;
    },
    vocabularyCheck: substringMatchesSomeInstitution,
    exceptions: [
      // stone_quarry's 'stonemason' fragment: no catalog name contains it (the
      // catalog institution is "Stone quarry", matched by the sibling 'stone
      // quarry' fragment). Same display/golden caveat as the instBoosts stems.
      'stonemason',
    ],
    owner: 'assembleInstitutions: name.includes(fragment) — truncated fragments are deliberate, dead ones are not.',
  },
  {
    id: 'RESOURCE_CHAINS rawResource → terrain allowedResources (exact membership)',
    provides: () => Object.values(RESOURCE_CHAINS).map((c) => c?.rawResource),
    vocabularyCheck: (r) => terrainResourceNames().has(r),
    exceptions: [
      // Known drift, owned by the in-flight terrain-synonym fix: renaming these
      // regressed the DISPLAY (rawResource doubles as the report's human name)
      // and the golden, so the fix is a synonym-aware matcher, not a rename.
      // Shrink this pin as that work lands. flax/grapes/animal-hides are
      // additionally unmodeled as terrain resources anywhere (content decision).
      'animal hides',
      'copper ore',
      'flax',
      'gemstones',
      'glass sand',
      'gold/silver ore',
      'grapes',
    ],
    owner: 'resourceGenerator evaluateEconomicActivity resourcePresent = nearbyResources.includes(rawResource).',
  },
  {
    id: 'RESOURCE_DATA commodities → COMMODITY_CATEGORY_MAP keys (exact)',
    provides: () => {
      const commodities = new Set();
      for (const r of Object.values(RESOURCE_DATA)) for (const c of r?.commodities || []) commodities.add(c);
      return commodities;
    },
    vocabularyCheck: (c) => Boolean(COMMODITY_CATEGORY_MAP[c]),
    exceptions: [
      // The consumer is graceful-by-design: getInstitutionEconomicBonus adds
      // BOTH the mapped category (when present) AND the raw commodity, so an
      // unmapped commodity still participates — the map only adds a canonical
      // alias. Pinned so a NEW unmapped commodity is a conscious choice.
      'dates',
      'furs',
      'gems',
      'glass',
      'honey',
      'luxury',
      'maritime_access',
      'medicinal_herbs',
      'processed_textiles',
      'trade_access',
      'water',
    ],
    owner: 'economicGenerator getInstitutionEconomicBonus COMMODITY_CATEGORY_MAP[commodity] alias lookup.',
  },
  {
    id: 'RESOURCE_GOOD_INST_GATES output good names → goods catalog (exactGoodId)',
    provides: () => {
      const goods = new Set();
      for (const m of Object.values(RESOURCE_GOOD_INST_GATES)) for (const g of Object.keys(m)) goods.add(g);
      return goods;
    },
    vocabularyCheck: (g) => exactGoodId(g) != null,
    exceptions: [
      // Real drift, documented: these three outputs flow into primaryExports
      // but resolve to NO goods-catalog id, so the SupplyChain panels' id-first
      // export match misses them (the substring fallback still displays them)
      // and subsumeTradeGoods cannot merge their aliases. The FIX is adding
      // GOOD_CATALOG aliases — a goods-normalization change that shifts
      // subsumption output (golden), so it belongs to a deliberate content
      // pass, not this guard. Do not add NEW gate outputs without an id.
      'Coin minting',
      'Magical services',
      'Rare texts',
    ],
    owner:
      'computeActiveChains gate outputs flow into primaryExports and are matched downstream by ' +
      'exactGoodId (SupplyChain panels) and subsumeTradeGoods aliases — an unresolvable name breaks both.',
  },
  {
    id: 'CONDITION_ARCHETYPE_TEMPLATES affectedSystems → the 16 SYSTEM_VARIABLES (exact)',
    provides: () => {
      const systems = new Set();
      for (const a of supportedConditionArchetypes()) {
        for (const s of conditionArchetypeTemplate(a)?.affectedSystems || []) systems.add(s);
      }
      return systems;
    },
    vocabularyCheck: (s) => SYSTEMS.has(s),
    exceptions: [],
    owner:
      'THE central causal join: every deriver scans cond.affectedSystems.includes(<system>). A string ' +
      'outside SYSTEM_VARIABLES contributes NOTHING silently (the cycle-4/5 lift-polarity bug family).',
  },
  {
    id: 'STRESSOR_CATALOG affectedSystems → SYSTEM_VARIABLES after CAUSAL_SYSTEM_ALIASES (exact)',
    provides: () => {
      const systems = new Set();
      for (const d of Object.values(STRESSOR_CATALOG)) for (const s of d?.affectedSystems || []) systems.add(s);
      return systems;
    },
    vocabularyCheck: (s) => SYSTEMS.has(CAUSAL_SYSTEM_ALIASES[s] || s),
    exceptions: [],
    owner:
      'stressors.js canonicalAffectedSystems normalizes at emission; a catalog string that survives ' +
      'aliasing without landing in the 16 is silently no-opd against the substrate.',
  },
  {
    id: 'neighbourSlice RELATIONSHIP_TYPES picker ids → PROPAGATION_MATRIX keys (exact)',
    provides: () => RELATIONSHIP_TYPES.map((t) => t?.id ?? t),
    vocabularyCheck: (id) => Boolean(PROPAGATION_MATRIX[id]),
    exceptions: [],
    owner: 'The authoring vocabulary must be propagation-resolvable or an edge degrades to neutral silently.',
  },
  {
    id: 'relationshipColors REL_HEX/REL_RGB keys → matrix keys ∪ RELATIONSHIP_TYPE_ALIASES (exact)',
    provides: () => new Set([...Object.keys(REL_HEX), ...Object.keys(REL_RGB)]),
    vocabularyCheck: (k) => Boolean(PROPAGATION_MATRIX[k]) || k in RELATIONSHIP_TYPE_ALIASES,
    exceptions: [],
    owner: 'Display palette keyed by relationship type — this exact coupling has drifted before (file header).',
  },
  {
    id: 'relationshipCompatibility PRIMARY_RELATIONSHIP_TYPES ⇔ PROPAGATION_MATRIX keys (set equality)',
    provides: () => [
      ...PRIMARY_RELATIONSHIP_TYPES.map((t) => `primary:${t}`),
      ...Object.keys(PROPAGATION_MATRIX).map((t) => `matrix:${t}`),
    ],
    vocabularyCheck: (tagged) => {
      const [side, t] = tagged.split(/:(.*)/s);
      return side === 'primary'
        ? Boolean(PROPAGATION_MATRIX[t])
        : PRIMARY_RELATIONSHIP_TYPES.includes(t);
    },
    exceptions: [],
    owner:
      'relationshipCompatibility hand-mirrors the primary relationship vocabulary (its header says so) — ' +
      'this entry makes the mirror an enforced invariant instead of a comment.',
  },
  {
    id: 'RELATIONSHIP_TYPE_ALIASES targets → PROPAGATION_MATRIX keys (exact)',
    provides: () => Object.values(RELATIONSHIP_TYPE_ALIASES),
    vocabularyCheck: (t) => Boolean(PROPAGATION_MATRIX[t]),
    exceptions: [],
    owner: 'An alias resolving to a non-matrix type would silently neutral-fallback in relationshipGraph.',
  },
  {
    id: 'ARCHETYPE_IMPACTS per-faction keys → FACTION_ARCHETYPES canonical values (exact)',
    provides: () => {
      const keys = new Set();
      for (const profile of Object.values(ARCHETYPE_IMPACTS)) {
        for (const k of Object.keys(profile)) if (!SPECIAL_IMPACT_KEYS.has(k)) keys.add(k);
      }
      return keys;
    },
    vocabularyCheck: (k) => new Set(Object.values(FACTION_ARCHETYPES)).has(k),
    exceptions: [],
    owner:
      'factionRelationshipUpdate impacts[profile.archetype]: a key outside the canonical archetype ' +
      'vocabulary means a faction of that archetype silently receives NO deltas from the event.',
  },
  {
    id: 'GEN_TO_PULSE_TYPE keys → STRESS_TYPE_MAP, values → STRESSOR_CATALOG (exact)',
    provides: () => [
      ...Object.keys(GEN_TO_PULSE_TYPE).map((k) => `gen:${k}`),
      ...Object.values(GEN_TO_PULSE_TYPE).map((v) => `pulse:${v}`),
    ],
    vocabularyCheck: (tagged) => {
      const [side, key] = tagged.split(/:(.*)/s);
      return side === 'gen' ? Boolean(STRESS_TYPE_MAP[key]) : Boolean(STRESSOR_CATALOG[key]);
    },
    exceptions: [],
    owner: 'stressorPicker bridges the generation and campaign stressor vocabularies; both feet must land.',
  },
];

describe('string-coupling registry — every cross-map join resolves or is consciously pinned', () => {
  it.each(REGISTRY.map((e) => [e.id, e]))('%s', (_id, entry) => {
    const provided = [...entry.provides()].filter(Boolean);
    expect(provided.length, `${entry.id}: provider returned nothing — the join moved; update the registry`)
      .toBeGreaterThan(0);
    const orphans = [...new Set(provided.filter((n) => !entry.vocabularyCheck(n)))].sort();
    expect(orphans, `owner: ${entry.owner}`).toEqual([...entry.exceptions].sort());
  });

  it('the crisisLifecycle alias mirror is byte-identical to the stressors.js canonical', () => {
    // crisisLifecycle deliberately keeps a tiny local copy of the alias table
    // (import-cycle avoidance, documented in-file). A mirror is only safe while
    // something FAILS when the copies diverge — this is that something.
    expect(STRESSOR_SYSTEM_ALIASES).toEqual(CAUSAL_SYSTEM_ALIASES);
  });

  it('every CAUSAL_SYSTEM_ALIASES target is one of the 16 SYSTEM_VARIABLES', () => {
    expect(Object.values(CAUSAL_SYSTEM_ALIASES).filter((v) => !SYSTEMS.has(v))).toEqual([]);
  });
});

// ── affectedSystems LITERAL AUDIT ────────────────────────────────────────────
// Conditions are minted in MANY places, not just the template catalog. Every
// LITERAL affectedSystems array anywhere in src/ must use the 16
// SYSTEM_VARIABLES or a canonical alias key (normalized at emission) — a
// deriver joins those strings exactly, so anything else is silent dead weight.
// Dynamic arrays (affectedSystems: someVar) are out of regex reach by design:
// they route through the template catalog or canonicalAffectedSystems, both
// audited above.
function walkSrc(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkSrc(p, out);
    else if (/\.(js|jsx)$/.test(name)) out.push(p);
  }
  return out;
}

const SRC_ROOT = join(process.cwd(), 'src');
const relPath = (file) => relative(SRC_ROOT, file).split('\\').join('/');

describe('affectedSystems literal audit — every minted system string is causal vocabulary', () => {
  it('every literal affectedSystems array in src/ uses SYSTEM_VARIABLES ∪ alias keys', () => {
    const allowed = new Set([...SYSTEMS, ...Object.keys(CAUSAL_SYSTEM_ALIASES)]);
    const violations = [];
    for (const file of walkSrc(SRC_ROOT)) {
      const text = readFileSync(file, 'utf-8');
      const arrays = text.match(/affectedSystems\s*:\s*\[[^\]]*\]/g) || [];
      for (const arr of arrays) {
        for (const m of arr.matchAll(/['"]([^'"]+)['"]/g)) {
          if (!allowed.has(m[1])) violations.push(`${relPath(file)} :: '${m[1]}'`);
        }
      }
    }
    expect(violations, 'A minted affectedSystems string no deriver will ever read').toEqual([]);
  });
});

// ── SITE SWEEP — self-enforcement ────────────────────────────────────────────
// Every DEFINITION site (`field:`) of a join-carrying field in src/ must be
// claimed below, so a new joining map cannot ship without a guard. Consumer
// READS (x.field) are deliberately not swept — providers are the drift source.
const SWEPT_FIELDS = [
  'requiredInstitution',
  'processingInstitutions',
  'rawResource',
  'instBoosts',
  'affectedSystems',
  'institutionModifiers',
];

// src-relative file → fields it may DEFINE, each with its guard:
//   [registry]   — covered by a REGISTRY entry above
//   [dedicated]  — covered by the named dedicated test
//   [audited]    — covered by the affectedSystems literal audit above
//   [plumbing]   — builds/copies view models or runtime custom content; the
//                  provider it forwards is guarded at its own definition site
const REGISTERED_SITES = {
  'data/resourceData.js': ['instBoosts', 'rawResource', 'processingInstitutions', 'institutionModifiers'], // [registry] + processingInstitutions via tests/joins/resourceChains.test.js [dedicated]
  'data/tradeGoodsData.js': ['requiredInstitution'], // [dedicated] institutionNameIntegrity 3-map test
  'data/supplyChainData.js': ['processingInstitutions'], // [dedicated] tests/joins/chains.test.js
  'data/geographyData.js': ['institutionModifiers'], // TAG-axis modifiers (mod.tags), governed by the entityTags coverage test — not a name join
  'generators/services/serviceTierData.js': ['requiredInstitution'], // [dedicated] institutionNameIntegrity
  'generators/computeActiveChains.js': ['processingInstitutions'], // [dedicated] chains/institutionIdentity join tests
  'generators/steps/generateEconomy.js': ['processingInstitutions'], // [plumbing] copies chain view into economicState
  'domain/activeConditions.js': ['affectedSystems'], // [registry] template systems
  'domain/worldPulse/stressors.js': ['affectedSystems'], // [registry] stressor systems (+ literal audit)
  'domain/crisisLifecycle.js': ['affectedSystems'], // [audited] promotes via templates/aliases
  'domain/events/mutateWorld.js': ['affectedSystems'], // [audited]
  'domain/explanation.js': ['affectedSystems'], // [audited]
  'domain/region/propagation.js': ['affectedSystems'], // [audited]
  'domain/supplyChainState.js': ['affectedSystems', 'processingInstitutions'], // [audited] + [plumbing]
  'domain/threatProfile.js': ['affectedSystems'], // [audited]
  'domain/worldPulse/factionCompetition.js': ['affectedSystems'], // [audited]
  'domain/worldPulse/npcAgency.js': ['affectedSystems'], // [audited]
  'domain/worldPulse/relationshipRulesAdversarial.js': ['affectedSystems'], // [audited]
  'domain/worldPulse/relationshipRulesCore.js': ['affectedSystems'], // [audited]
  'domain/inferSupplyChains.js': ['processingInstitutions'], // [plumbing] infers FROM present institutions (reverse direction)
  'lib/structuralFingerprint.js': ['affectedSystems'], // [plumbing] fingerprints existing conditions
  'lib/dependencyEngine.js': ['requiredInstitution'], // [plumbing] runtime custom-content refs (dangling-ref gate tested in finishedGoodsSupply.test.js)
  'components/compendium/Dependencies.jsx': ['requiredInstitution'], // [plumbing] compendium display of the same refs
  'pdf/lib/viewModel.js': ['processingInstitutions'], // [plumbing] PDF view model copy
};

describe('site sweep — no unregistered join-carrying field definition ships', () => {
  const DEF_RE = (field) => new RegExp(`(?:^|[^A-Za-z0-9_.])${field}\\s*:`, 'm');

  it('every SWEPT_FIELDS definition site in src/ is registered', () => {
    const unregistered = [];
    for (const file of walkSrc(SRC_ROOT)) {
      const rel = relPath(file);
      const text = readFileSync(file, 'utf-8');
      for (const field of SWEPT_FIELDS) {
        if (!DEF_RE(field).test(text)) continue;
        const allowed = REGISTERED_SITES[rel] || [];
        if (!allowed.includes(field)) unregistered.push(`${rel} :: ${field}`);
      }
    }
    expect(
      unregistered,
      'New join-carrying field definition site(s). Register each in REGISTERED_SITES WITH a guard ' +
      '(a registry entry, a dedicated test, or the literal audit) — do not just add it here.',
    ).toEqual([]);
  });

  it('REGISTERED_SITES stays honest — every listed (file, field) still defines that field', () => {
    const stale = [];
    for (const [rel, fields] of Object.entries(REGISTERED_SITES)) {
      let text;
      try {
        text = readFileSync(join(SRC_ROOT, rel), 'utf-8');
      } catch {
        stale.push(`${rel} :: (file gone)`);
        continue;
      }
      for (const field of fields) {
        if (!DEF_RE(field).test(text)) stale.push(`${rel} :: ${field}`);
      }
    }
    expect(stale, 'Remove stale entries so the sweep list stays a truthful map of the join surface').toEqual([]);
  });
});
