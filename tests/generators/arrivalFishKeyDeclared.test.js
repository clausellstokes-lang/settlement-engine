/**
 * tests/generators/arrivalFishKeyDeclared.test.js — CENSUS-2f unit 2, the chair's R-AP: a key is a
 * guarantee only when its picker is the fact's own reader. The arrival sense picker (`chooseSense`)
 * reads catalogue NAMES by fragment, so the `fish` key is reachable by a fish market or a fishmonger
 * where no catch feeds the place (soak1k-152: an occupied forest village on a mountain pass, food
 * sources `game` only, printed "A basket of fish, still flapping, is carried past at a run."). The
 * lines under the key declare `fish` (the `foodSources` presence atom), so a refused beat redraws.
 * The audit of the five arrival tables found two more keys whose picker is not the fact's reader and
 * whose lines presume that fact: `market` (fragments, not `isMarketInstitution`'s tags) and `faith`
 * (fragments that include `priest` and `chapel`, not the `sacredHouse` composite) — declared the same
 * way; 0 births move for them on the 1,000.
 *
 * @enforced-by npx vitest run tests/generators/arrivalFishKeyDeclared.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { terrainClassOf, tradeRouteOf } from '../../src/domain/facts/terrain.js';
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';

const sense = (key) => ARRIVAL_SENSES.find((s) => s.key === key);
const needsOf = (line) => (typeof line === 'function' ? [] : declarationOf(line).needs ?? []);
const textOfLine = (line, n) => (typeof line === 'function' ? line : line.text)(n);
const FISH_LINES = /fishmonger shouts a price|Nets hang drying on poles|basket of fish, still flapping|Gulls quarrel over the fish stalls/;

describe('the arrival tables declare what an unguaranteed key presumes (R-AP)', () => {
  it('every line under the fish key\'s `lines` declares `fish`', () => {
    for (const line of sense('fish').lines) expect(needsOf(line)).toContain('fish');
  });
  it('the market key\'s lines declare `market`', () => {
    for (const line of sense('market').lines) expect(needsOf(line)).toContain('market');
  });
  it('the faith key\'s bell, incense and hymn declare `sacredHouse`; the wayside shrine is colour', () => {
    const [bell, incense, shrine, hymn] = sense('faith').lines;
    for (const line of [bell, incense, hymn]) expect(needsOf(line)).toContain('sacredHouse');
    expect(shrine).toEqual(expect.objectContaining({ colour: true })); // R-AO: read, presumes nothing (after the chair's 07:25 message)
  });
});

describe('the fish beat on the soak (R-AP)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-152 (no catch) prints no fish beat', () => {
    const s = birth(152).settlement;
    expect(factsOf(s).foodSources.length, 'the record names its food sources').toBeGreaterThan(0);
    expect(factsOf(s).foodSources).not.toContain('fish'); // anchored: the line above proves the food sources are read
    expect(FISH_LINES.test(s.arrivalScene || ''), s.arrivalScene).toBe(false);
  }, 30_000);

  it('soak1k-170 (a river village whose food record holds fish) keeps its beat, and A-11\'s own water gate is open', () => {
    const b = birth(170); const s = b.settlement;
    expect(factsOf(s).foodSources).toContain('fish');
    expect(s.arrivalScene).toContain(textOfLine(sense('fish').lines[3], s.name));
    const terrain = terrainClassOf(s) || String(b.config?.terrainOverride ?? '');
    const route = tradeRouteOf(s) || String(b.config?.tradeRouteAccess ?? '');
    // A-11 (scripts/audit/soak-review/checks.mjs) reads sea words only where `waterAccessKind` is 'none'
    expect(waterAccessKind(terrain.toLowerCase(), route || null)).not.toBe('none');
  }, 30_000);
});
