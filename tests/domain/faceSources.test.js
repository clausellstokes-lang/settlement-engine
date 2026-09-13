/**
 * faceSources.test.js — WHICH POWERS OF A TOWN CAN SPEAK (ADDENDUM 18 ruling 15; REWRITE
 * car 8b-W-18c).
 *
 * `sourcesOf(settlement)` is the one product reader that turns a town into the set of source
 * words a `[face]` row may resolve on. Three things are pinned here, over the REAL generator
 * at fixed seeds rather than a hand-built roster, so the seating follows the catalogue the
 * engine actually instantiates:
 *   THE SEATING     a thorp hears the stranger and the elders and no hall; a town hears the
 *                   hall, the tavern and the guilds; a metropolis the hall; the tier words
 *                   never leak into the set.
 *   THE RUIN FILTER a calamity-ruined hall keeps no clerk: the source drops with the row.
 *   THE CONTRACT    total over a missing settlement; closed over the kernel's vocabulary;
 *                   `withFaceSources` puts the roster on once and never overwrites a given one;
 *                   the three flag lists re-spelled from `priorityHelpers.js` are held to it.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ALWAYS_SOURCES, PRIORITY_HELPER_LISTS, sourcesOf, withFaceSources,
} from '../../src/domain/display/stateProse/faceSources.js';
import {
  FACE_SOURCES, PUBLIC_SOURCE, UNIVERSAL_SOURCE, UNIVERSAL_SOURCES,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ROOT } from '../helpers/dossierCorpus.js';

const SEED = 'sf-faces-2026-09-13';
/** @param {object} config */
const gen = (config) => generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });

const FIXTURES = [
  ['thorp', { settType: 'thorp', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' }],
  ['hamlet', { settType: 'hamlet', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }],
  ['town', { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' }],
  ['city', { settType: 'city', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'port' }],
  ['metropolis', { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'port' }],
];

describe('faceSources — the seating of the powers on generated towns', () => {
  const towns = Object.fromEntries(FIXTURES.map(([tier, config]) => [tier, gen(config)]));

  it('every town hears the stranger, and every word is of the closed vocabulary', () => {
    for (const [tier, town] of Object.entries(towns)) {
      const sources = sourcesOf(town);
      expect(sources.has(UNIVERSAL_SOURCE), tier).toBe(true);
      for (const word of sources) expect(FACE_SOURCES, `${tier} seats ${word}`).toContain(word);
      expect(sources.has(town.tier), 'the tier word never leaks into the set').toBe(false);
    }
    // ⭐ RE-FROZEN AT CAR 8b-W-18n (ADDENDUM 18 ruling 28): the PUBLIC joins the stranger as a
    // source seated by NOTHING and therefore seated everywhere. The list is the kernel's own, so
    // a word added to one and not the other is a defect rather than a silence.
    expect(ALWAYS_SOURCES).toEqual([UNIVERSAL_SOURCE, PUBLIC_SOURCE]);
    expect(ALWAYS_SOURCES).toBe(UNIVERSAL_SOURCES);
    for (const [tier, town] of Object.entries(towns)) {
      expect(sourcesOf(town).has(PUBLIC_SOURCE), `${tier} hears the public`).toBe(true);
    }
    process.stdout.write(`\n[faceSources] ${Object.entries(towns).map(([tier, town]) => `${tier}: ${[...sourcesOf(town)].join(' ')}`).join('\n[faceSources] ')}\n`);
  });

  it('⭐ a thorp hears the elders and no hall, tavern or guild; a town hears the hall, the tavern and the guilds', () => {
    const thorp = sourcesOf(towns.thorp);
    expect(thorp.has('elders')).toBe(true);
    expect(thorp.has('hall')).toBe(false);
    expect(thorp.has('guild')).toBe(false);
    expect(thorp.has('tavern')).toBe(false);
    const town = sourcesOf(towns.town);
    expect(town.has('hall'), 'Town hall is a required row at town').toBe(true);
    expect(town.has('tavern'), 'Taverns (5-20) is a required row at town').toBe(true);
    expect(town.has('guild'), 'Craft guilds (5-15) is a required row at town').toBe(true);
    expect(town.has('elders'), 'the elders sit below town only').toBe(false);
    expect(sourcesOf(towns.hamlet).has('elders')).toBe(true);
    const metropolis = sourcesOf(towns.metropolis);
    expect(metropolis.has('elders')).toBe(false);
    expect(metropolis.has('court'), 'a metropolis holds a court row').toBe(true);
    expect(sourcesOf(towns.city).has('hall'), 'City hall is a required row at city').toBe(true);
  });

  it('the force sources follow the standing buckets, never the tier', () => {
    // Pinned against the same roster the desks read: a source is present iff the bucket is.
    for (const [tier, town] of Object.entries(towns)) {
      const forces = standingDefenseForces(town);
      const sources = sourcesOf(town);
      expect(sources.has('muster'), `${tier} muster`).toBe(forces.militia.present);
      expect(sources.has('watch'), `${tier} watch`).toBe(forces.watch.present);
      expect(sources.has('garrison'), `${tier} garrison`).toBe(forces.garrison.present);
    }
  });

  it('⛔ THE RUIN FILTER: a calamity-ruined hall keeps no clerk — the source drops with the row', () => {
    const town = towns.town;
    expect(sourcesOf(town).has('hall')).toBe(true);
    const ruined = {
      ...town,
      institutions: town.institutions.map((inst) => (
        /town hall/i.test(String(inst?.name || '')) ? { ...inst, status: 'ruined', _worldPulseInactive: true } : inst)),
    };
    expect(sourcesOf(ruined).has('hall'), 'ruined: no hall').toBe(false);
    expect(sourcesOf(ruined).has('tavern'), 'and nothing else moved').toBe(true);
    // The paired positive: the same edit on a row that is not the hall leaves the hall standing.
    const other = {
      ...town,
      institutions: town.institutions.map((inst, at) => (at === 0 && !/town hall/i.test(String(inst?.name || ''))
        ? { ...inst, status: 'ruined', _worldPulseInactive: true } : inst)),
    };
    expect(sourcesOf(other).has('hall')).toBe(true);
  });

  it('is total: a missing, empty or roster-less settlement is the stranger alone, never a throw', () => {
    for (const bad of [null, undefined, {}, { tier: 'town' }, { institutions: 'nope' }, { institutions: [null, 7, { name: 3 }] }]) {
      // ⭐ RE-FROZEN AT CAR 8b-W-18n: "the stranger alone" is now "the stranger and the public",
      // and for the same reason — neither is seated by anything a broken settlement could lack.
      expect([...sourcesOf(/** @type {any} */ (bad))].filter((w) => w !== 'elders'))
        .toEqual([UNIVERSAL_SOURCE, PUBLIC_SOURCE]);
    }
    expect(sourcesOf({ tier: 'village' }).has('elders'), 'the tier alone seats the elders').toBe(true);
  });

  it('withFaceSources puts the roster on once and never overwrites a roster the caller gave', () => {
    const town = towns.town;
    const put = withFaceSources(town, { seed: 's', audience: 'dm' });
    expect(put.seed).toBe('s');
    expect(put.sources instanceof Set).toBe(true);
    expect([...put.sources].sort()).toEqual([...sourcesOf(town)].sort());
    const given = new Set(['stranger']);
    expect(withFaceSources(town, { sources: given }).sources, 'a Set is kept').toBe(given);
    const list = ['hall'];
    expect(withFaceSources(town, { sources: list }).sources, 'an array is kept').toBe(list);
    const again = withFaceSources(town, put);
    expect(again, 'idempotent: the same object comes back').toBe(put);
    expect(withFaceSources(town, undefined).sources instanceof Set, 'no options at all').toBe(true);
    expect(withFaceSources(null, { seed: 'x' }).sources.has(UNIVERSAL_SOURCE)).toBe(true);
  });

  it('⛔ the three flag lists re-spelled from priorityHelpers.js are held to that file, verbatim', () => {
    // `getInstitutionNames` is private to the generator and no display module imports from
    // `src/generators/`, so the lists are copied — and a copy that drifts is caught here by
    // name rather than seating a power the engine no longer recognises.
    const src = readFileSync(join(ROOT, 'src/generators/priorityHelpers.js'), 'utf8');
    for (const [flag, list] of Object.entries(PRIORITY_HELPER_LISTS)) {
      const spelled = `${flag}:${' '.repeat(Math.max(1, 18 - flag.length - 1))}hasAny(names, [${list.map((w) => `'${w}'`).join(',')}])`;
      expect(src.includes(spelled), `${flag} in priorityHelpers.js reads\n  ${spelled}`).toBe(true);
    }
    expect(Object.keys(PRIORITY_HELPER_LISTS).sort()).toEqual(['hasCourtSystem', 'hasGates', 'hasMarket']);
  });
});
