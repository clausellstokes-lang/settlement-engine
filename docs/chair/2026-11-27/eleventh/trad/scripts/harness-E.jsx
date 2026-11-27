/**
 * R14 harness (plain node under jsdom, bundled by build-trad.mjs). Renders a town's owner dossier through the tree's real
 * OutputContainer with the census store (pageCensusWalk.shared.mjs :: storeFor) and visits its tabs in a GIVEN ORDER:
 * 'walk' (the census walk's order: every group, every sub-tab, in strip order) or 'power-first' (the Power tab first, then
 * the walk). For the Power view it records whether a line "Patron deity" printed, at the census walk's moment (after its
 * waitFor) and again after `settleMs`. Writes one jsonl line per town. Changes nothing.
 */
import { cleanup, fireEvent, render, waitFor, act } from '@testing-library/react';
import { createElement } from 'react';
import { appendFileSync } from 'node:fs';
import OutputContainer from 'TREE/src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { storeFor, linesOf } from 'TREE/tests/components/pageCensusWalk.shared.mjs';
import { mocks } from 'mock:state';

const fn = () => () => undefined;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function run(plan, out, { order = 'walk', settleMs = 300 } = {}) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    mocks.store = storeFor(town, fn);
    const { container } = render(createElement(OutputContainer, { settlement: town }));
    const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
    const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
    await waitFor(() => { if (!groupTabs().length) throw new Error('no groups'); });
    const pairs = [];
    for (let g = 0; g < groupTabs().length; g++) {
      fireEvent.click(groupTabs()[g]);
      await waitFor(() => { if (!subTabs().length) throw new Error('no tabs'); });
      for (let i = 0; i < subTabs().length; i++) pairs.push([g, (groupTabs()[g].textContent || '').trim(), (subTabs()[i].textContent || '').trim()]);
    }
    const seq = order === 'power-first' ? [...pairs.filter((p) => p[2] === 'Power'), ...pairs] : pairs;
    const powerSeen = [];
    for (const [g, gName, tName] of seq) {
      fireEvent.click(groupTabs()[g]);
      await waitFor(() => { if (!subTabs().length) throw new Error('no tabs'); });
      const tab = subTabs().find((t) => (t.textContent || '').trim() === tName); if (!tab) continue;
      const id = (tab.id || '').replace(/^sf-tab-/, '');
      fireEvent.click(tab);
      try { await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); if (!p || (p.textContent || '').length <= 15) throw new Error('empty'); }, { timeout: 10000 }); } catch { /* */ }
      if (tName !== 'Power') continue;
      const panel = container.querySelector(`#sf-panel-${id}`);
      const now = panel ? linesOf(panel).filter((l) => /Patron deity/i.test(l)) : [];
      await act(async () => { await sleep(settleMs); });
      const later = panel ? linesOf(container.querySelector(`#sf-panel-${id}`)).filter((l) => /Patron deity/i.test(l)) : [];
      powerSeen.push({ visit: powerSeen.length + 1, group: gName, atWalkMoment: now, afterSettle: later });
    }
    cleanup();
    appendFileSync(out, `${JSON.stringify({ seed: row.seed, order, powerSeen })}\n`);
  }
}
