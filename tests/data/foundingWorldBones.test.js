/**
 * tests/data/foundingWorldBones.test.js — EVERY PROMISE ON A FOUNDING WORLD'S CARD IS
 * CARRIED BY ITS CANONICAL SEED AND BY THE TOWNS ITS VISITORS ACTUALLY GET.
 *
 * src/data/sampleSettlements.js's own law (NARRATIVE PARITY, the owner's order of
 * 2026-07-21): each card is a REAL generation, its teaser written to the generated truth.
 * Nothing re-ran that as the engine moved, so by 2026-11-10 Black Crag's canonical seed
 * generated a city ruled by a "Noble Governorship" under a teaser that said "ruled by its
 * guild-masters", and nothing reddened. The owner's word that day: "Also after everything
 * has merged, you need to regeenrate mossgate, cnocby, and black crag vwith the updated
 * system".
 *
 * ⛔ AND THE CANONICAL SEED IS NOT WHAT A VISITOR OPENS. "Visit" forks the card with a
 * seed suffixed by who is forking (forkSeedFor), so a promise the canonical town keeps
 * and its forks do not is a promise broken to nearly every visitor. The chair's ruling N8
 * (2026-11-10): every clause of every teaser and every tag HOLDS IN AT LEAST 19 OF 20
 * FORKS AT THE CARD'S DIALS, or is pinned by a real wizard dial, or leaves the card.
 * Measured that day, the guild government held in 1 of 20 Black Crag forks, Cnocby's
 * criminal pressure in 1 of 20, and Mossgate's council quarrel in 14 of 20; those
 * clauses left the cards.
 *
 * Each card's PROMISES row quotes its teaser and tags verbatim (so a re-worded card reds
 * here until its promises are re-measured) and sets a predicate on a generated field
 * beside every clause. Each predicate must hold at the canonical seed AND in at least
 * FORK_LINE of FORK_SAMPLE seeded forks, generated the way a fork reaches the pipeline:
 * DEFAULT_CONFIG + the card's config minus its seed (the card's own dials, which a fork
 * keeps since N5b), through birthConfig, the law payloads loaded.
 *
 * Cost: three canonical generations and sixty forks (a village, a town, a city), measured
 * in the FOUNDING-WORLDS record.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } from '../../src/data/sampleSettlements.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

const FORK_SAMPLE = 20;
const FORK_LINE = 19;

/** @param {string} id */
const card = (id) => {
  const sample = SAMPLE_SETTLEMENTS.find((s) => s.id === id);
  if (!sample) throw new Error(`no curated sample ${id}`);
  return sample;
};

/** @param {any} sample @param {string} seed */
const generateAt = (sample, seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...forkConfigFor(sample) }),
  null,
  { seed, customContent: {} },
);

/** The fork seeds: forkSeedFor's own shape, with a fixed, spread-out forker per index. */
const forkSeeds = (/** @type {any} */ sample) => Array.from({ length: FORK_SAMPLE }, (_, i) =>
  String(forkSeedFor(sample, `f${String(i).padStart(2, '0')}x${((i * 2654435761) >>> 0).toString(16)}`)));

/** @param {any} s @param {string} key */
const conditionOf = (s, key) => (s.resourceAnalysis?.resourceConditions || []).find((/** @type {any} */ r) => r.key === key)?.condition;
/** @param {any} s @param {RegExp} re */
const hasInstitution = (s, re) => (s.institutions || []).some((/** @type {any} */ i) => re.test(String(i.name)));
/** @param {any} s @param {RegExp} re */
const hasFaction = (s, re) => (s.powerStructure?.factions || []).some((/** @type {any} */ f) => re.test(String(f.faction)));

/**
 * @typedef {{ clause: string, holds: (s: any) => boolean }} Promise
 * @type {Record<string, { teaser: string, tags: string[], promises: Promise[] }>}
 */
const PROMISES = {
  'sample-cnocby': {
    teaser: 'A mountain village on a through road, where the good timber has been cut faster than it can grow back, and the farms, the common grazing and the mill keep the place.',
    tags: ['Mountain road', 'Exhausted timber', 'Farms and grazing'],
    promises: [
      { clause: 'a mountain village on a through road · tag Mountain road', holds: (s) => s.tier === 'village' && s.config.terrainType === 'mountain' && s.config.tradeRouteAccess === 'road' },
      { clause: 'the good timber has been cut faster than it can grow back · tag Exhausted timber', holds: (s) => conditionOf(s, 'mountain_timber') === 'depleted' },
      { clause: 'the farms, the common grazing and the mill keep the place · tag Farms and grazing', holds: (s) => hasInstitution(s, /^Farmland$/) && hasInstitution(s, /^Common grazing land$/) && hasInstitution(s, /^Mill$/) },
    ],
  },
  'sample-mossgate': {
    teaser: 'A harbour town with docks and a harbour master, where the merchant guilds and the religious authorities both hold power.',
    tags: ['Coastal trade', 'Merchant guilds', 'Religious authority'],
    promises: [
      { clause: 'a harbour town · tag Coastal trade', holds: (s) => s.tier === 'town' && s.config.terrainType === 'coastal' && s.config.tradeRouteAccess === 'port' },
      { clause: 'with docks and a harbour master', holds: (s) => hasInstitution(s, /^Docks\/port facilities$/) && hasInstitution(s, /^Harbour master's office$/) },
      { clause: 'the merchant guilds hold power · tag Merchant guilds', holds: (s) => hasFaction(s, /^Merchant Guilds$/) },
      { clause: 'the religious authorities hold power · tag Religious authority', holds: (s) => hasFaction(s, /^Religious Authorities$/) },
    ],
  },
  'sample-blackcrag': {
    teaser: 'A mountain city built on iron, where the merchant guilds hold power and the mines now give up too little ore.',
    tags: ['Industrial', 'Guild power', 'Dwindling resource'],
    promises: [
      { clause: 'a mountain city', holds: (s) => s.tier === 'city' && s.config.terrainType === 'mountain' },
      { clause: 'built on iron · tag Industrial (iron on the card, a Smelter, Specialized metalworkers)', holds: (s) => conditionOf(s, 'iron_deposits') != null && hasInstitution(s, /^Smelter$/) && hasInstitution(s, /^Specialized metalworkers$/) },
      { clause: 'where the merchant guilds hold power · tag Guild power', holds: (s) => hasFaction(s, /^Merchant Guilds$/) },
      // RE-KEYED BY IDENTITY (COHERENCE-AGREE-3, the chair's ruling of 2026-11-12): the card's promise is its own words
      // and unchanged; only the dossier label it quotes is re-spelled, the shortage label naming its own land.
      { clause: 'the mines now give up too little ore (the dossier\'s "Iron ore (local iron mines exhausted)")', holds: (s) => JSON.stringify(s.economicState).includes('Iron ore (local iron mines exhausted)') },
      { clause: 'tag Dwindling resource (iron depleted)', holds: (s) => conditionOf(s, 'iron_deposits') === 'depleted' },
    ],
  },
};

/** @type {Record<string, { canonical: any, forks: any[] }>} */
const towns = {};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const id of Object.keys(PROMISES)) {
    const sample = card(id);
    towns[id] = { canonical: generateAt(sample, sample.config.seed), forks: forkSeeds(sample).map((seed) => generateAt(sample, seed)) };
  }
}, 120_000);

describe('every Founding World keeps every promise on its card', () => {
  it('the table covers the three cards and quotes each one verbatim', () => {
    expect(SAMPLE_SETTLEMENTS.map((s) => s.id).sort()).toEqual(Object.keys(PROMISES).sort());
    for (const [id, row] of Object.entries(PROMISES)) {
      expect(card(id).teaser, `${id}: the teaser changed; re-measure its promises against the forks`).toBe(row.teaser);
      expect(card(id).tags, `${id}: the tags changed; re-measure them against the forks`).toEqual(row.tags);
      expect(row.promises.length, `${id}: a card with no measured promise`).toBeGreaterThan(0);
    }
  });

  it('every promise holds at the card\'s canonical seed', () => {
    const broken = Object.entries(PROMISES).flatMap(([id, row]) => row.promises
      .filter((p) => !p.holds(towns[id].canonical))
      .map((p) => `${card(id).config.seed}: ${p.clause}`));
    expect(broken).toEqual([]);
  });

  it(`every promise holds in at least ${FORK_LINE} of ${FORK_SAMPLE} forks at the card's dials`, () => {
    // Anchored: each card's forks were generated, and they are distinct towns.
    for (const id of Object.keys(PROMISES)) {
      expect(towns[id].forks).toHaveLength(FORK_SAMPLE);
      expect(new Set(towns[id].forks.map((s) => s.population)).size, `${id}: the forks are not distinct towns`).toBeGreaterThan(1);
    }
    const under = Object.entries(PROMISES).flatMap(([id, row]) => row.promises
      .map((p) => ({ p, n: towns[id].forks.filter((s) => p.holds(s)).length }))
      .filter(({ n }) => n < FORK_LINE)
      .map(({ p, n }) => `${card(id).name}: ${p.clause} — ${n}/${FORK_SAMPLE}`));
    expect(under).toEqual([]);
  });
});
