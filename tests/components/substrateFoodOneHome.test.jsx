/** @vitest-environment jsdom */
/**
 * R3-TABS (round three's cut #494 and #1317; the chair's ruling (c)). The Foundations Food row banded the
 * causal score on the causal ladder, and the page's food reading is the food record's band, which the
 * Overview ("Food Security"), the Crisis tab ("Food: …") and the Economics tab print: "Food · Strained"
 * stood beside "Food Security · Deficit" under a siege at a 68% deficit, and "Food · Adequate" beside
 * "Pressured". The row now prints the record's own word, cased as the Overview cases it.
 *
 * RED-FIRST at aac79b808: on the reader's twenty towns the Foundations Food word equalled the Overview's
 * food word in none (Secure/Adequate, Deficit/Critical, Deficit/Strained, Pressured/Adequate …).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { statusCase } from '../../src/domain/display/labelCase.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';

function appBirth(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}
function textNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  const out = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) out.push(n.nodeValue.trim());
  return out;
}
const SEEDS = ['rr2s-town-under_siege-rand-1', 'rr2s-metropolis-plague_onset-port-1', 'rr2s-city-famine-rand-1',
  'rr2s-thorp-calm-rand-1', 'rr2s-village-famine-rand-1', 'r3t-hamlet-under_siege-rand-3', 'r3t-city-calm-rand-1', 'r3t-metropolis-famine-rand-3'];
const ROWS = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = appBirth(seed);
    const { container } = render(<SubstrateTab settlement={s} />);
    const nodes = textNodes(container);
    ROWS.push({ seed, record: s.economicState.foodSecurity.label, word: nodes[nodes.indexOf('Food') + 1] });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('the Foundations Food row prints the food record\'s word', () => {
  test('the siege town at a 68% deficit reads Deficit, and the pressured metropolis reads Pressured', () => {
    expect(ROWS.find((r) => r.seed === 'rr2s-town-under_siege-rand-1').word).toBe('Deficit');
    expect(ROWS.find((r) => r.seed === 'rr2s-metropolis-plague_onset-port-1').word).toBe('Pressured');
  });
  test('on every town the row and the record say one word', () => {
    expect(ROWS.filter((r) => r.word !== statusCase(r.record)).map((r) => `${r.seed}: ${r.word} vs ${r.record}`)).toEqual([]);
  });
});
