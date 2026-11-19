// @vitest-environment jsdom
import React from 'react'; import { it } from 'vitest'; import fs from 'node:fs'; import zlib from 'node:zlib';
import { render, cleanup } from '@testing-library/react';
const T = process.env.TREE;
it('surfaces', async () => {
  const { PowerStructure } = await import(T + '/src/pdf/sections/PowerStructure.jsx');
  const { buildViewModel } = await import(T + '/src/pdf/lib/viewModel.js');
  const SummaryTab = (await import(T + '/src/components/new/SummaryTab.jsx')).default;
  const { governingModifierWordsOf } = await import(T + '/src/domain/display/governingModifierWords.js');
  const collectText = (node, out = []) => { if (node == null || typeof node === 'boolean') return out; if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; } if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; } if (typeof node === 'object') { if (typeof node.type === 'function') return collectText(node.type(node.props), out); return collectText(node.props?.children, out); } return out; };
  const want = new Set((process.env.SEEDS || '').split(','));
  const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
  const out = [];
  for (const r of rows) { const seed = r.seed || r.key; if (!want.has(seed)) continue; const s = r.s || r.settlement;
    const g = s.powerStructure.factions.find((f) => f.isGoverning);
    const leaves = collectText(React.createElement(PowerStructure, { settlement: s, vm: buildViewModel({ settlement: s }), narrativeMode: false, stateProse: null }));
    const i = leaves.indexOf('GOVERNING');
    const { container } = render(<SummaryTab settlement={s} />);
    const el = [...container.querySelectorAll('[id]')].find((e) => (e.textContent || '').includes(g.faction) && e.id.includes('faction'));
    out.push(`${seed} | ${g.faction} key=${g.modifier} | tab="${governingModifierWordsOf(s)}" | PDF GOVERNING: ${JSON.stringify(leaves.slice(i, i + 5))} | SUMMARY legend row: "${(el?.textContent || '(none)').slice(0, 120)}"`);
    cleanup();
  }
  fs.writeFileSync(process.env.OUTF, out.join('\n') + '\n');
}, 600000);
