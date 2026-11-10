/**
 * tests/data/foundingWorldBones.test.js — EACH FOUNDING WORLD'S CANONICAL SEED STILL
 * CARRIES ITS CARD'S BONES.
 *
 * src/data/sampleSettlements.js's own law (NARRATIVE PARITY, the owner's order of
 * 2026-07-21): each card is a REAL generation, its seed+config seed-hunted through the
 * live pipeline until the generated FACTS carried the card's bones, the teaser written
 * to that truth. Nothing re-ran the hunt as the engine moved, so by 2026-11-10 Black
 * Crag's canonical seed `blackcrag-016` generated a city ruled by a "Noble Governorship"
 * under a teaser that says "ruled by its guild-masters" — and nothing reddened. The
 * owner's word that day: "Also after everything has merged, you need to regeenrate
 * mossgate, cnocby, and black crag vwith the updated system". This pin is what turns the
 * NEXT engine change that breaks a card red instead of leaving a stale card.
 *
 * Each card is generated the way a fork reaches the pipeline (DEFAULT_CONFIG + the
 * card's config minus its seed, through birthConfig, the law payloads loaded), at its
 * canonical seed, and every claim of its teaser and tags is set beside the generated
 * field that carries it. A failing bone means: hunt a new seed under the SAME config
 * (the card's own `<name>-NNN` convention) before any word of the teaser changes.
 *
 * Cost: three generations (a village, a town, a city), about two seconds.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor } from '../../src/data/sampleSettlements.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

/** @param {string} id */
const card = (id) => {
  const sample = SAMPLE_SETTLEMENTS.find((s) => s.id === id);
  if (!sample) throw new Error(`no curated sample ${id}`);
  return sample;
};

/** @param {any} sample */
const generateCanonical = (sample) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...forkConfigFor(sample) }),
  null,
  { seed: sample.config.seed, customContent: {} },
);

/** @param {any} s @param {string} key */
const conditionOf = (s, key) => (s.resourceAnalysis?.resourceConditions || []).find((r) => r.key === key)?.condition;
/** @param {any} s @returns {string[]} */
const institutionNames = (s) => (s.institutions || []).map((i) => String(i.name));
/** @param {any} s @returns {string[]} */
const factionNames = (s) => (s.powerStructure?.factions || []).map((f) => String(f.faction));
/** @param {any} s @returns {any[]} */
const conflictsOf = (s) => s.conflicts || [];

/** @type {Record<string, any>} */
const towns = {};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const id of ['sample-cnocby', 'sample-mossgate', 'sample-blackcrag']) towns[id] = generateCanonical(card(id));
}, 60_000);

describe('Cnocby — "A mountain village on a through road, where the good timber was cut out a generation ago and the carters who still stop know exactly whose cousin to ask about the rest."', () => {
  it('is a mountain village on a road (tags: Mountain road)', () => {
    const s = towns['sample-cnocby'];
    expect(s.name).toBe('Cnocby');
    expect([s.tier, s.config.terrainType, s.config.tradeRouteAccess]).toEqual(['village', 'mountain', 'road']);
  });
  it('its mountain timber is cut out (tags: Exhausted timber)', () => {
    expect(conditionOf(towns['sample-cnocby'], 'mountain_timber')).toBe('depleted');
  });
  it('carters still stop: a road-traffic institution stands', () => {
    expect(institutionNames(towns['sample-cnocby']).filter((n) => /waystation|stable|pack animal|coaching inn/i.test(n)).length).toBeGreaterThan(0);
  });
  it('whose cousin to ask: a criminal institution and no criminal faction (tags: Quiet criminal pressure)', () => {
    const s = towns['sample-cnocby'];
    expect(institutionNames(s).filter((n) => /bandit|smuggl|fence|thieves|black market|criminal/i.test(n)).length).toBeGreaterThan(0);
    // Anchored: the factions list is read and non-empty, so "none criminal" is not vacuous.
    expect(factionNames(s).length).toBeGreaterThan(0);
    expect(factionNames(s).filter((f) => /thieves|crim|syndicate/i.test(f))).toEqual([]);
  });
});

describe('Mossgate — "A rain-grey harbour town where the council and the temple have stopped speaking, and the merchant guilds quietly profit from the silence."', () => {
  it('is a harbour town (tags: Coastal trade)', () => {
    const s = towns['sample-mossgate'];
    expect(s.name).toBe('Mossgate');
    expect([s.tier, s.config.terrainType, s.config.tradeRouteAccess]).toEqual(['town', 'coastal', 'port']);
    expect(institutionNames(s).filter((n) => /docks|harbour/i.test(n)).length).toBeGreaterThan(0);
  });
  it('the council and the temple are at odds (tags: Religious tension)', () => {
    const s = towns['sample-mossgate'];
    const recent = String(s.powerStructure?.recentConflict || '');
    const inConflict = conflictsOf(s).some((c) => (c.parties || []).some((/** @type {string} */ p) => /council/i.test(p))
      && (c.parties || []).some((/** @type {string} */ p) => /relig|church|temple/i.test(p)));
    expect(inConflict || (/church|temple/i.test(recent) && /council/i.test(recent))).toBe(true);
  });
  it('the merchant guilds are a power, and not the government', () => {
    const s = towns['sample-mossgate'];
    expect(factionNames(s)).toContain('Merchant Guilds');
    expect(String(s.powerStructure?.governingName || '')).not.toMatch(/merchant/i);
  });
  it('the council is contested (tags: Contested council)', () => {
    const s = towns['sample-mossgate'];
    expect(conflictsOf(s).length).toBeGreaterThan(0);
    expect(conflictsOf(s).some((c) => /council/i.test(String(c.issue || ''))
      || (c.parties || []).some((/** @type {string} */ p) => /council/i.test(p)))).toBe(true);
  });
});

describe('Black Crag — "A mountain city built on iron, ruled by its guild-masters, whose mines now give up too little ore."', () => {
  it('is a mountain city built on iron (tags: Industrial)', () => {
    const s = towns['sample-blackcrag'];
    expect(s.name).toBe('Black Crag');
    expect([s.tier, s.config.terrainType]).toEqual(['city', 'mountain']);
    expect(conditionOf(s, 'iron_deposits')).toBeDefined();
    expect(institutionNames(s)).toContain('Smelter');
    expect(institutionNames(s).filter((n) => /blacksmith|metalwork/i.test(n)).length).toBeGreaterThan(0);
  });
  it('is ruled by its guild-masters (tags: Guild power)', () => {
    expect(towns['sample-blackcrag'].powerStructure?.governingName).toMatch(/guild/i);
  });
  it('its mines give up too little ore (tags: Dwindling resource)', () => {
    const s = towns['sample-blackcrag'];
    expect(conditionOf(s, 'iron_deposits')).toBe('depleted');
    expect(institutionNames(s)).toContain('Mine');
    expect(JSON.stringify(s.economicState)).toContain('Iron ore (local mines exhausted)');
  });
});
