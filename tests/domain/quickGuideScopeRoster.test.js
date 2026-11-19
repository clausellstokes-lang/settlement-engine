/**
 * THE SCOPE LINE READS THE ROSTER AND THE SIZE IN EVERY FRAME (R2-CODE-B-SIDE item 5; round three's #1, #234, #513,
 * the increment's rww-hamlet-succession_void-1, and CENSUS-2's hits on SCOPE_PHRASE / SCOPE_LINE_FRAMES /
 * QUICK_GUIDE_SIBLINGS: 57 lines of kind (a), 7 of kind (c) on the census's 720 at 0570b3441). A clause that names an
 * institution, a quarter or an office prints only where the roster holds it; a clause that cannot be true in a small
 * place (a thorp, a hamlet or a village, by tier or by population) is not printed there.
 */
import { describe, expect, test } from 'vitest';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const town = (key, label, tier, population, names, extra = {}) => ({
  name: 'Testford', tier, population, culturalIdentity: { key, label },
  institutions: names.map((name) => ({ name })),
  config: { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: [] },
  powerStructure: { government: 'Town Council', factions: [] }, ...extra,
});

describe('a clause that names a house reads the roster', () => {
  test('#1: no waterworks and no endowed house in a thorp of 16', () => {
    const line = cultureScopeLine(town('arabic', 'Arabic-inspired', 'thorp', 16,
      ['Subsistence farming', 'Access to external mill', 'Wayside shrine', 'Access to parish church', 'Burial ground', 'Water source']));
    expect(line).toContain('built around courtyards');
    for (const word of ['waterworks', 'endowed']) expectAbsentWithAnchor(line, word, 'built around courtyards', '#1');
  });
  test('the guard: a town with an aqueduct and a parish church keeps both', () => {
    const line = cultureScopeLine(town('arabic', 'Arabic-inspired', 'town', 1800, ['Aqueduct or water system', 'Parish churches (2-5)', 'Market square']));
    expect(line).toContain('courtyards and waterworks, on endowed institutions');
  });
  test('#234: "under temple and guild" with no guild on the roster', () => {
    const line = cultureScopeLine(town('south_asian', 'South-Asian-inspired', 'town', 1500, ['Temple', 'Market square']));
    expect(line).toContain('under the temple');
    expectAbsentWithAnchor(line, 'guild', 'under the temple', '#234');
  });
  test('a mesoamerican town with no waterworks: "tribute and market"', () => {
    const line = cultureScopeLine(town('mesoamerican', 'Mesoamerican-inspired', 'town', 900, ['Market square', 'Temple']));
    expect(line).toContain('tribute and market');
    expectAbsentWithAnchor(line, 'waterworks', 'tribute and market', 'no waterworks');
  });
});

describe('an office reads the roster, and is not printed in a small place', () => {
  test('rww-hamlet-succession_void-1: no "bureau" in a hamlet of 31', () => {
    const line = cultureScopeLine(town('east_asian', 'East-Asian-inspired', 'hamlet', 31, ["Lord's steward", 'Dwellings (1-8)']));
    expect(line).toContain('ordered by lineage');
    for (const word of ['bureau', 'wards']) expectAbsentWithAnchor(line, word, 'ordered by lineage', 'rww-hamlet-succession_void-1');
  });
  test('the guard: a town with a town hall keeps its bureaux', () => {
    const line = cultureScopeLine(town('east_asian', 'East-Asian-inspired', 'town', 2000, ['Town hall']));
    expect(line).toContain('ordered by bureau and lineage');
  });
  test('#513: "run by civic association" under a lord\'s appointee', () => {
    const line = cultureScopeLine(town('greek', 'Greek-inspired', 'town', 1600, ['Market square'], { powerStructure: { government: 'Feudal Appointee', factions: [] } }));
    expect(line).toContain('built around the agora');
    expectAbsentWithAnchor(line, 'civic association', 'built around the agora', '#513');
  });
});

describe('the size rule reaches every frame: a village is small by its tier as well as its people', () => {
  test('a village of 372: no wards, no quarters', () => {
    const line = cultureScopeLine(town('south_asian', 'South-Asian-inspired', 'village', 372, ['Dwellings']));
    expectAbsentWithAnchor(line, 'quarters', 'built around the tank', 'a village of 372');
    const line2 = cultureScopeLine(town('east_asian', 'East-Asian-inspired', 'village', 391, ['Dwellings']));
    for (const word of ['wards', 'bureau']) expectAbsentWithAnchor(line2, word, 'ordered by lineage', 'a village of 391');
  });
  test('the Celtic thorp of 15: no assembly ground it lacks', () => {
    const line = cultureScopeLine(town('celtic', 'Celtic-inspired', 'thorp', 15, ['Subsistence farming', 'Informal elder consensus'], { config: { terrainType: 'forest', tradeRouteAccess: 'road', nearbyResources: [] } }));
    expect(line).toContain('built around kin');
    for (const word of ['districts', 'assembly ground']) expectAbsentWithAnchor(line, word, 'built around kin', 'the Celtic thorp of 15');
  });
});
