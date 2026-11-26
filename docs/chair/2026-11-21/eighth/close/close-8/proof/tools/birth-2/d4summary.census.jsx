/** @vitest-environment jsdom */
// D4 every-birth check (BIRTH-2). For each birth of a plan, on a tree: the Summary as rendered ("Power rests with", the Power
// tile, the bar's legend) and the template narrative's five powers, each against THE RAW RECORD's numbers ranked here
// (ties in roster order): never through the leaf under test. Writes one line a birth; the record's hash beside it.
import { test } from 'vitest';
import React from 'react';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { render, cleanup, within } from '@testing-library/react';
const T = process.env.D4_TREE;
test('D4 summary over every birth', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const SummaryTab = (await import(/* @vite-ignore */ R + 'components/new/SummaryTab.jsx')).default;
  const { extractFullContext } = await import(/* @vite-ignore */ R + 'generators/aiLayer.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.D4_PLAN, 'utf8'));
  const out = [];
  for (const { seed, size, config } of plan) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const recordHash = createHash('sha256').update(JSON.stringify(s)).digest('hex');
    const fs = (s.powerStructure?.factions || []).map((f, i) => ({ name: String(f.faction), power: Number(f.power) || 0, i }));
    const ranked = fs.slice().sort((a, b) => (a.power === b.power ? a.i - b.i : b.power - a.power));
    const names = fs.map((f) => f.name);
    const { container, queryByText } = render(React.createElement(SummaryTab, { settlement: s }));
    const text = container.textContent || '';
    const top = ranked[0]?.name;
    const sentenceOk = !top || text.includes(`Power rests with ${top.toLowerCase()};`);
    const tile = queryByText('Power')?.parentElement;
    const tileOk = !top || (tile ? !!within(tile).queryByText(top) : false);
    const legend = [...container.querySelectorAll('span')].map((n) => n.textContent || '').filter((t) => names.includes(t));
    const want5 = ranked.slice(0, 5).map((f) => f.name);
    const barOk = JSON.stringify(legend.slice(0, want5.length)) === JSON.stringify(want5);
    const ai = extractFullContext(s).factions;
    const aiOk = JSON.stringify(ai) === JSON.stringify(ranked.slice(0, 5).map((f) => `${f.name} (${f.power}%)`));
    const pageHash = createHash('sha256').update(text).digest('hex');
    cleanup();
    out.push(JSON.stringify({ seed, size, recordHash, pageHash, sentenceOk, tileOk, barOk, aiOk }));
  }
  writeFileSync(process.env.D4_OUT, out.join('\n') + '\n');
}, 7200000);
