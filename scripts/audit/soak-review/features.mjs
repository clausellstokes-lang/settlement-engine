/**
 * scripts/audit/soak-review/features.mjs — one settlement as a flat row of facts, for the
 * aggregates ("every aspect, alone and in relation").
 *
 * TWO PARTS.
 *  1. THE GENERIC WALK (`walkRecord`): every leaf of the record, never a hand-picked list.
 *     Array indices collapse to `[]`; an array's length is its own field (`path.#`); a leaf
 *     under an array is summarised per settlement (numeric → its mean `:mean`; boolean → its
 *     rate `:rate`; short categorical strings → counted per element in `cats`). Keys that are
 *     ids (long hex/digit runs) collapse to `{id}`. EXCLUDED, and said so in the report:
 *     `simulationTrace` (the pipeline's own log), `_config` (a copy of `config`), `userCanon` /
 *     `aiOverlays` (empty at birth), `id` / `_seed` / hashes / fingerprints (identity), and
 *     prose: a string over 48 characters is never a category (its length is kept as `:len`).
 *  2. THE ENGINE'S CHAINS (`chainFacts`): the derived facts the engine's own rules relate, each
 *     read through the domain function that owns it, so a chain row cites its rule.
 */
import { defenseFactsOf, foodEnduranceOf } from '../../../src/domain/defense/defenseFacts.js';
import { faithReadingOf, faithHasChurchEvidence } from '../../../src/domain/dossier/faithReading.js';
import { deriveMagicReliance } from '../../../src/domain/magicReliance.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';

const SKIP_KEYS = new Set(['simulationTrace', '_config', 'userCanon', 'aiOverlays', 'id', '_seed', 'economyInputFingerprint', 'colour', 'color', 'bg', 'catalogId', 'sourcePath']);
const ID_KEY = /^(?:[0-9a-f]{8,}|.*\d{3,}.*|npc_\d+|inst_\d+|s_[0-9a-f]+)$/i;
const MAX_DEPTH = 7;

/**
 * @param {object} record
 * @returns {{ scalars: Record<string, number|string|boolean>, cats: Record<string, Record<string, number>> }}
 */
export function walkRecord(record) {
  const scalars = {};
  const cats = {};
  const inner = {}; // path → { sum, n } | { t, n }
  const visit = (v, path, depth, underArray) => {
    if (depth > MAX_DEPTH) return;
    if (v === null || v === undefined) { if (!underArray) scalars[`${path}:null`] = true; return; }
    if (Array.isArray(v)) {
      const lp = `${path}.#`;
      if (underArray) { (inner[lp] ??= { sum: 0, n: 0 }); inner[lp].sum += v.length; inner[lp].n += 1; } else scalars[lp] = v.length;
      for (const x of v) visit(x, `${path}[]`, depth + 1, true);
      return;
    }
    if (typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (SKIP_KEYS.has(k)) continue;
        visit(x, `${path ? `${path}.` : ''}${ID_KEY.test(k) ? '{id}' : k}`, depth + 1, underArray);
      }
      return;
    }
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) return;
      if (underArray) { (inner[`${path}:mean`] ??= { sum: 0, n: 0 }); inner[`${path}:mean`].sum += v; inner[`${path}:mean`].n += 1; } else scalars[path] = v;
      return;
    }
    if (typeof v === 'boolean') {
      if (underArray) { (inner[`${path}:rate`] ??= { sum: 0, n: 0 }); inner[`${path}:rate`].sum += v ? 1 : 0; inner[`${path}:rate`].n += 1; } else scalars[path] = v;
      return;
    }
    if (typeof v === 'string') {
      if (v.length > 48) { if (!underArray) scalars[`${path}:len`] = v.length; return; }
      if (underArray) { const c = (cats[path] ??= {}); c[v] = (c[v] || 0) + 1; } else scalars[path] = v;
    }
  };
  visit(record, '', 0, false);
  for (const [p, { sum, n }] of Object.entries(inner)) scalars[p] = n ? Math.round((sum / n) * 1000) / 1000 : 0;
  return { scalars, cats };
}

const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };

/**
 * The engine's chains, one fact per link, each read through the function that owns it.
 * @param {object} s @param {object} ctx `{ stressCell, findings }`
 */
export function chainFacts(s, ctx) {
  const food = s.economicState?.foodSecurity || {};
  const record = food.foodRecord || {};
  const def = safe(() => defenseFactsOf(s), {}) || {};
  const end = safe(() => foodEnduranceOf(s));
  const faith = safe(() => faithReadingOf(s), null);
  const magic = safe(() => deriveMagicReliance(s), {}) || {};
  const hooks = safe(() => collectPlotHooks(s), []) || [];
  const stress = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean);
  const factions = s.powerStructure?.factions || [];
  const governing = factions.find((f) => f?.isGoverning) ?? factions[0];
  const findings = ctx.findings || [];
  const has = (prefix) => findings.some((f) => f.check.startsWith(prefix));
  return {
    'chain.tier': s.tier,
    'chain.population': s.population,
    'chain.institutionCount': (s.institutions || []).length,
    'chain.npcCount': (s.npcs || []).length,
    'chain.factionCount': factions.length,
    'chain.culture': s.config?.culture ?? s.culturalIdentity?.key,
    'chain.terrain': s.config?.terrainType,
    'chain.route': s.config?.tradeRouteAccess,
    'chain.magicScenario': `${s.config?.magicExists ? 'on' : 'off'}/${s.config?.priorityMagic ?? ''}`,
    'chain.contentProfile': s.config?.contentProfile,
    'chain.monsterThreat': s.config?.monsterThreat,
    'chain.stressCell': ctx.stressCell,
    'chain.stressPrimary': stress[0] ?? 'none',
    'chain.stressCount': stress.length,
    'chain.nativeResources': (s.config?.nearbyResourcesNative || []).length,
    'chain.depletedResources': (s.config?.nearbyResourcesNativeDepleted || []).length,
    'chain.prosperity': s.economicState?.prosperity,
    'chain.exports': (s.economicState?.primaryExports || []).length,
    'chain.imports': (s.economicState?.primaryImports || []).length,
    'chain.foodBand': record.band,
    'chain.grownPct': record.grownPct,
    'chain.normalImportPct': record.normalImportPct,
    'chain.gapPct': record.gapPct,
    'chain.storageMonths': record.storageMonths,
    'chain.hasGranary': record.hasGranary,
    'chain.hasSiege': food.hasSiege === true,
    'chain.enduranceFullMonths': end?.fullRationMonths ?? null,
    'chain.enduranceHalfForever': end ? end.halfRationMonths === null : null,
    'chain.enduranceFullForever': end ? end.fullRationMonths === null : null,
    'chain.hasWalls': def.hasWalls,
    'chain.hasGarrison': def.hasGarrison,
    'chain.hasWatch': def.hasWatch,
    'chain.hasMilitia': def.hasMilitia,
    'chain.priorityMilitary': s.config?.priorityMilitary,
    'chain.defenseScoreMean': (() => { const sc = s.defenseProfile?.scores || {}; const v = Object.values(sc).filter((x) => typeof x === 'number'); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; })(),
    'chain.faithChurchEvidence': faith ? faithHasChurchEvidence(faith) : null,
    'chain.faithHasChurch': faith?.hasChurch ?? null,
    'chain.religiousFaction': faith?.religiousFaction ?? null,
    'chain.priorityReligion': s.config?.priorityReligion,
    'chain.governingArchetype': governing?.category ?? governing?.archetype ?? governing?.type ?? null,
    'chain.government': s.powerStructure?.government,
    'chain.stability': s.powerStructure?.stability,
    'chain.magicReliance': magic.reading,
    'chain.magicPractitioners': (magic.practitioners || []).length,
    'chain.magicDependents': (magic.dependents || []).length,
    'chain.renderedHooks': hooks.length,
    'chain.tonightNamesCrisis': stress.length ? !has('X-51') : null,
    'chain.tierNounFindings': findings.filter((f) => f.check === 'coh:tier-noun').length,
    'chain.inBand': !has('X-46'),
    'chain.findingCount': findings.length,
  };
}
