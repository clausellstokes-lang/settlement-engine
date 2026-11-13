/**
 * defenseReadinessWord.test.jsx — COHERENCE-UPKEEP-7, the chair's ruling W4 on the fourth read (C-M4): the PDF's
 * readiness strip printed "Score avg", the mean of the five defence scores beside the readiness word: a number that
 * says how the rating is worked out. RULED: that row leaves the PDF; the strip prints the rating's word. The five
 * scores' own figures out of 100 stay (a rating's own figure is not machinery).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { statusCase } from '../../src/domain/display/labelCase.js';

/** Every leaf string of an element tree, executing the hook-free PDF components. @param {any} node @param {string[]} [out] */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}

/** @type {Array<{ seed: string, s: any, leaves: string[] }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const stress of [null, 'under_siege']) {
    for (const tier of ['hamlet', 'town', 'city']) {
      const seed = `w4-${stress || 'calm'}-${tier}`;
      const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: tier, selectedStresses: stress ? [stress] : [], selectedStressesRandom: false });
      const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
      rows.push({ seed, s, leaves: deepText(DefenseSecurity({ settlement: s, narrativeMode: false, vm: buildViewModel({ settlement: s }), stateProse: null })) });
    }
  }
}, 300000);

describe('the PDF readiness strip prints the rating, not its working (W4)', () => {
  test('RED-FIRST: no "Score avg" row, and the readiness word prints', () => {
    for (const { seed, s, leaves } of rows) {
      expect(leaves.includes('Score avg'), `${seed}: the average of the five scores`).toBe(false);
      // anchored: the strip is rendered, with the rating's own word
      expect(leaves.includes('Readiness'), `${seed}: the strip`).toBe(true);
      expect(leaves.includes(statusCase(s.defenseProfile.readiness.label)), `${seed}: the rating's word`).toBe(true);
    }
  });
});
