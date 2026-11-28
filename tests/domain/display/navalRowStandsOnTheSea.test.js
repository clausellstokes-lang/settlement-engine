/**
 * navalRowStandsOnTheSea.test.js — W2-C-LEAVES-SIDE item 2 (2026-11-13; ROUND-3-CUT #961, MED): "Naval Defense · Port only ·
 * Port facility but no naval force. Sea approaches are accessible to any vessel." in rr2s-city-under_siege+famine-rand-1,
 * a river town in a forest. The chair's ruling (record 387, the port's two homes): the trade route is the home of "this
 * is a port" and of which water it stands on; the row prints only where the route is the sea; no river twin was read
 * true, so a river town is silent. A live blockade (a fleet the record names) keeps the row.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveSupportingCapabilities } from '../../../src/domain/display/defenseDisplay.js';

/** The reader's own shape (REVIEW-R2-STAGES render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} s */
const naval = (s) => deriveSupportingCapabilities(s).find((c) => c.label === 'Naval Defense');
/** @param {string} route @param {boolean} [blockaded] */
const town = (route, blockaded = false) => ({
  config: { tradeRouteAccess: route }, institutions: [{ name: 'Docks/port facilities' }],
  economicState: { compound: { inst: { hasPort: true } }, foodSecurity: { stockpile: blockaded ? { blockaded: true } : null } },
});

describe('the Naval Defense row stands on the sea (#961)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: docks on the sea route print the row; on a river, a road or isolated they do not; a live blockade keeps it', () => {
    expect(naval(town('port'))?.note).toMatch(/Sea approaches/);
    for (const route of ['river', 'road', 'isolated', 'crossroads']) expect(naval(town(route)), route).toBeUndefined();
    expect(naval(town('river', true))?.status).toBe('Under blockade');
  });

  test('the reader\'s town (a river town in a forest) prints no sea approaches; a port town keeps its row', () => {
    const river = birthApp('rr2s-city-under_siege+famine-rand-1');
    expect(river.config.tradeRouteAccess, 'anchored: the river route').toBe('river');
    expect(river.economicState.compound.inst.hasPort, 'anchored: its docks').toBe(true);
    expect(naval(river)).toBeUndefined();
    const port = birthApp('rr2s-town-indebted-port-1');
    expect(naval(port)?.note).toBe('Port facility but no naval force. Sea approaches are accessible to any vessel.');
  }, 60000);
});
