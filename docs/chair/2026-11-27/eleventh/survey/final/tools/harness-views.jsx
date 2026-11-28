/**
 * R-MEASURE harness (plain node, no vitest). Bundled by build.mjs with esbuild; run by boot.mjs under a jsdom global.
 * Per plan row: born exactly as the page battery births it (birthConfig(row.config), { seed, customContent: {} }),
 * stamped with its public prose, rendered through the tree's real OutputContainer with the census's store
 * (pageCensusWalk.shared.mjs :: storeFor) and walked by the tree's own walkDossier (OWNER view). Then the SHARE:
 * toPublicSafe(town) -> projectShareVeil(.., null), rendered as PublicDossierView renders it (readOnly, playerView).
 * Writes one jsonl line per birth: seed, size, recordHash, owner views, share views, the stamped record.
 */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { createHash } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import OutputContainer from 'TREE/src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { storeFor, linesOf } from 'TREE/tests/components/pageCensusWalk.shared.mjs';
import { buildViewModel } from 'TREE/src/pdf/lib/viewModel.js';
import { composeTonightSheet } from 'TREE/src/domain/summary/tonightSheet.js';

/**
 * The tree's walkDossier (tests/components/pageCensusWalk.shared.mjs), copied line for line, with ONE addition: each
 * snapshot of a panel also counts its lines BEFORE the per-view dedupe, and a line printed twice or more in one snapshot is
 * kept in `reps[view][line] = max count` (the tree's walk keeps a repeated line once, so a repeat would be invisible).
 */
async function walkDossier(container, { fireEvent, waitFor, expect }, reps) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
  const views = {};
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const tabName = (tab.textContent || '').trim(); const id = (tab.id || '').replace(/^sf-tab-/, '');
      fireEvent.click(tab);
      try {
        await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 });
      } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      const name = `${groupName}/${tabName}`;
      if (!panel) { views[name] = ['[NO PANEL]']; continue; }
      const seen = new Set(); const acc = [];
      const snap = () => {
        const ls = linesOf(panel); const cnt = new Map();
        for (const l of ls) cnt.set(l, (cnt.get(l) || 0) + 1);
        for (const [l, c] of cnt) if (c > 1) { reps[name] ||= {}; reps[name][l] = Math.max(reps[name][l] || 0, c); }
        for (const l of ls) if (!seen.has(l)) { seen.add(l); acc.push(l); }
      };
      const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
      for (let pass = 0; pass < 4; pass++) {
        const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false');
        if (!closed.length) break;
        for (const e of closed) fireEvent.click(e);
      }
      snap();
      const n = disclosures().length;
      for (let k = 0; k < n; k++) {
        const e = disclosures()[k];
        if (!e || e.getAttribute('aria-expanded') !== 'false') continue;
        fireEvent.click(e);
        if (e.getAttribute('aria-expanded') === 'true') snap();
      }
      views[name] = acc;
    }
  }
  return views;
}
import { mocks } from 'mock:state';

const fn = () => { const f = (..._a) => undefined; return f; };
const expect = (v) => ({
  toBeGreaterThan: (n) => { if (!(v > n)) throw new Error(`expected ${v} > ${n}`); },
  toBeTruthy: () => { if (!v) throw new Error('expected truthy'); },
});
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

export async function run(plan, out, { share = true, keepRecord = true } = {}) {
  await loadGenerationLawPayloads();
  let n = 0;
  for (const row of plan) {
    const t0 = Date.now();
    let line;
    try {
      let town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const recordHash = sha(town);
      town = withPublicProse(town, composePublicProse(town));
      mocks.store = storeFor(town, fn);
      const a = render(createElement(OutputContainer, { settlement: town }));
      const reps = {};
      const views = await walkDossier(a.container, { fireEvent, waitFor, expect }, reps);
      cleanup();
      let shareViews = null;
      if (share) {
        const pub = projectShareVeil(toPublicSafe(town, { full: false, memberOverrides: null }), null);
        mocks.store = storeFor(pub, fn);
        const b = render(createElement(OutputContainer, { settlement: pub, readOnly: true, playerView: true }));
        shareViews = await walkDossier(b.container, { fireEvent, waitFor, expect }, {});
        cleanup();
      }
      let pdf = null; try { pdf = buildViewModel({ settlement: town }); } catch (e) { pdf = 'ERR ' + String(e).slice(0, 200); }
      let tonight = null; try { tonight = composeTonightSheet(town); } catch (e) { tonight = 'ERR ' + String(e).slice(0, 200); }
      line = { seed: row.seed, size: row.size, recordHash, ms: Date.now() - t0, views, shareViews, pdf: JSON.stringify(pdf), tonight: JSON.stringify(tonight) };
    } catch (e) {
      try { cleanup(); } catch { /* */ }
      line = { seed: row.seed, size: row.size, error: String(e?.stack || e).slice(0, 2000) };
    }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    n++;
    if (n % 10 === 0) console.log(`${new Date().toISOString()} ${n}/${plan.length} last ${row.seed} ${line.ms ?? 'ERR'}ms`);
  }
}
