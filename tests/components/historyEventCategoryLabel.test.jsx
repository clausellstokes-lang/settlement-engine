/** @vitest-environment jsdom */
/**
 * R3-TABS (round three's cut #1104; the chair's ruling (c)). The History tab's event cards print a category
 * word beside the event's own name, from HistoryTab.jsx :: ALL_EC. Two of its words named the wrong thing:
 * every event of category `exile_return` is drawn from the template `occupation_legacy` ("The Occupation",
 * "A previous occupation ended…") and printed "Exile & Return"; every event of `occupation_infiltration` is
 * drawn from `infiltration_fear` ("The Purge", enemy agents and denunciations) and printed "Occupation"
 * (historyPolicyData.js: one template per category). Measured at aac79b808 on 884 births: 385 events and
 * 443 events, every one so. The cure reads the event's own template, in the words the same tab already gives
 * those templates as tensions (TENSION_META): "Occupation Legacy" and "Infiltration Fear". No new words.
 *
 * RED-FIRST at aac79b808: rr2s-city-occupied-rand-1 printed "The Occupation" + "Exile & Return".
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';

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

let town; let nodes;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  town = appBirth('rr2s-city-occupied-rand-1');
  const { container } = render(<HistoryTab settlement={town} />);
  for (let p = 0; p < 4; p += 1) for (const b of [...container.querySelectorAll('[aria-expanded="false"]')]) fireEvent.click(b);
  nodes = textNodes(container);
}, 120000);
afterEach(cleanup);

describe("an event card's category word names the event's own template", () => {
  test('the premise: the town holds both events, each of its one template', () => {
    const ev = town.history.historicalEvents;
    expect(ev.find((e) => e.type === 'exile_return')?.name).toBe('The Occupation');
    expect(ev.find((e) => e.type === 'occupation_infiltration')?.name).toBe('The Purge');
  });
  test('"The Occupation" reads Occupation Legacy and "The Purge" reads Infiltration Fear', () => {
    const after = (name) => nodes[nodes.indexOf(name) + 1];
    expect(after('The Occupation')).toBe('Occupation Legacy');
    expect(after('The Purge')).toBe('Infiltration Fear');
    // anchored: the same text nodes hold 'Occupation Legacy' and 'Infiltration Fear', asserted on the two lines above
    expect(nodes).not.toContain('Exile & Return');
  });
});
