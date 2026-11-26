/** @vitest-environment jsdom */
// A5 proof, part two (BIRTH-2, RULING G1 term 5): the PDF and Foundry view model and the search enumeration carry the raw
// record (the view model under `active`, `npcs.factions`, `relationships.factions` and `raw`; the search as `settlement`), so
// the new key rides inside them. Per birth: sha256 of each with every `dmStanding` key removed (equal to the base tree's =
// byte-equal but for the key), and the search's own objects (its `objects`, what it matches and prints) with no removal.
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const T = process.env.A5_TREE;
const h = (v) => createHash('sha256').update(JSON.stringify(v, (k, x) => (k === 'dmStanding' ? undefined : x)) ?? 'undefined').digest('hex').slice(0, 16);
const hRaw = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
test('A5 vm and search', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { buildViewModel } = await import(/* @vite-ignore */ R + 'pdf/lib/viewModel.js');
  const { enumerateDossierObjects } = await import(/* @vite-ignore */ R + 'domain/dossier/dossierSearch.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.A5_PLAN, 'utf8'));
  const out = [];
  for (const { seed, size, config } of plan) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement: s }); const e = enumerateDossierObjects(s);
    out.push(JSON.stringify({ seed, size, vmStripped: h(vm), searchStripped: h(e), searchObjects: hRaw(e?.objects) }));
  }
  writeFileSync(process.env.A5_OUT, out.join('\n') + '\n');
}, 7200000);
