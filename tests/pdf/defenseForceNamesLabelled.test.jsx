/**
 * tests/pdf/defenseForceNamesLabelled.test.jsx — UPKEEP-14, the chair's row (1) of 2026-11-14 (HIGH; the r2-code-b
 * reader's H3-T2): the PDF's ARMED FORCES & FORTIFICATIONS list printed a force's catalogue key raw ("Gates (if
 * walled)", 18 of the 972) where the roster prints its label ("Town gates"). The list now prints each force's name
 * through the house-label seam the roster reads (`institutionDisplayName`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** Every leaf string of an element tree, executing the hook-free PDF components. */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}
/** The leaves of the forces list (between its heading and the next chapter block). @param {string[]} leaves */
const forceLeaves = (leaves) => { const i = leaves.indexOf('ARMED FORCES & FORTIFICATIONS'); const j = leaves.findIndex((l, n) => n > i && /^(?:CRIMINAL ARCHITECTURE|SUPPORTING CAPABILITIES)$/.test(l)); return leaves.slice(i + 1, j < 0 ? undefined : j); };

/** The capacity reader's r2r-town-11 (render5.mjs's census shape): a walled town whose roster holds the gate row. */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
let town;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'town' }), null, { seed: 'r2r-town-11', customContent: {} });
}, 120_000);

describe('(1) the PDF prints a force under the label the roster prints', () => {
  test('r2r-town-11: the gate row prints "Town gates", never its catalogue key', () => {
    expect(town.institutions.map((i) => i.name), 'fixture premise: the roster holds the gate row').toContain('Gates (if walled)');
    const forces = forceLeaves(deepText(DefenseSecurity({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null })));
    expect(forces.length, 'anti-vacuity: the list prints forces').toBeGreaterThan(0);
    expect(forces).toContain('Town gates');
    expect(forces.filter((l) => /\(if walled\)/.test(l))).toEqual([]);
  });
});
