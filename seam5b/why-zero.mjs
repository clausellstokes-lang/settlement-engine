import { writeFileSync } from 'node:fs';
import { rateGrid } from '../laneSEAM/scripts/prose-rate-corpus.mjs';
import { generateSettlementPipeline } from '../laneSEAM/src/generators/generateSettlementPipeline.js';
import { instantiatedServices } from '../laneSEAM/src/domain/institutions/institutionTable.js';
const WANT = ['Citizen militia', 'Democratic assembly', 'Royal seat', 'City administration', 'Town hall', 'City hall', 'Courthouse', 'Town watch'];
let corruptImp = 0; let corruptNpc = 0; let impairedAny = 0;
const present = new Map(); const withService = new Map(); const svcNames = new Map();
let towns = 0;
for (const spec of rateGrid()) {
  let s;
  try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
  towns += 1;
  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  if (insts.some((i) => (i.impairments || []).some((m) => m?.type === 'corruption'))) corruptImp += 1;
  if (insts.some((i) => (i.impairments || []).length)) impairedAny += 1;
  if ((s.npcs || []).some((n) => n?.corrupt === true)) corruptNpc += 1;
  const names = new Set(insts.map((i) => String(i?.name || '')));
  const rows = instantiatedServices(s);
  for (const w of WANT) {
    if (names.has(w)) present.set(w, (present.get(w) || 0) + 1);
    if (rows.some((r) => r.institution === w)) withService.set(w, (withService.get(w) || 0) + 1);
  }
  for (const r of rows) if (WANT.includes(r.institution)) svcNames.set(`${r.institution} :: ${r.name}`, (svcNames.get(`${r.institution} :: ${r.name}`) || 0) + 1);
}
const out = [
  `towns ${towns}`,
  `towns with a 'corruption' institution impairment: ${corruptImp}`,
  `towns with ANY institution impairment: ${impairedAny}`,
  `towns with a corrupt NPC: ${corruptNpc}`,
  'institution present / with any instantiated service row:',
  ...WANT.map((w) => `  ${w.padEnd(22)} present ${String(present.get(w) || 0).padStart(4)}  with service rows ${String(withService.get(w) || 0).padStart(4)}`),
  'the service names those institutions actually instantiate:',
  ...[...svcNames].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, n]) => `  ${String(n).padStart(4)}  ${k}`),
].join('\n');
console.log(out);
writeFileSync(process.argv[2], `${out}\n`);
