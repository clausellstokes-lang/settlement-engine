/** @vitest-environment jsdom */
/**
 * R3-TABS (round two's #329 and #858, given to this seat by the chair on 2026-11-13 with its ruling: the
 * tab does not print a connectivity word the town's own crisis contradicts; under a siege that cuts the
 * roads the row says so in the crisis's own words from the record, or it does not print).
 *
 * MEASURED at aac79b808 on 82 siege births in the app's shape (census, the reader's twenty, fresh): the
 * reading (`causalState.js :: deriveTradeConnectivity`, the defence lane's, not changed) folds a siege in as
 * "wartime pressure" (−13/−14), so the row read Adequate in 29 and Surplus in 1 while every one of the 82
 * crises' own summary says nothing comes in by road. The row now prints the crisis's own label.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { statusCase } from '../../src/domain/display/labelCase.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
const SIEGE = ['rr2s-town-under_siege-rand-1', 'rr2s-hamlet-under_siege-rand-1', 'rr2s-city-under_siege+famine-rand-1',
  'r3t-metropolis-under_siege-port-2', 'r3t-village-under_siege-port-4', 'r3t-city-under_siege-rand-1'];
const CALM = ['rr2s-town-calm-rand-1', 'r3t-city-calm-rand-1'];
const ROWS = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...SIEGE, ...CALM]) {
    const s = appBirth(seed);
    const { container } = render(<SubstrateTab settlement={s} />);
    const nodes = textNodes(container);
    const siege = (Array.isArray(s.stress) ? s.stress : [s.stress]).find((x) => x?.type === 'under_siege');
    ROWS.push({ seed, siege, word: nodes[nodes.indexOf('Trade connectivity') + 1] });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('the Foundations Trade connectivity row under a siege', () => {
  test('every siege town prints the crisis\'s own word on the row', () => {
    const failures = collectSeedFailures(ROWS.filter((r) => SIEGE.includes(r.seed)), ({ siege, word }) => {
      if (!/nothing comes in by road/.test(siege?.summary || '')) throw new Error(`summary ${siege?.summary}`);
      if (word !== statusCase(siege.label)) throw new Error(`word ${word}`);
    });
    expectNoSeedFailures(failures, 'the siege speaks on the trade row');
  });
  test('a town with no siege keeps its band word', () => {
    const failures = collectSeedFailures(ROWS.filter((r) => CALM.includes(r.seed)), ({ word }) => {
      if (!['Surplus', 'Adequate', 'Strained', 'Critical', 'Collapsed'].includes(word)) throw new Error(`word ${word}`);
    });
    expectNoSeedFailures(failures, 'a calm town keeps its band word');
  });
});
