#!/usr/bin/env node
/**
 * E8 RECORD MEASURE (WORDS-1): every stored string of a born record that carries a reflexive (themselves, themself,
 * himself, herself), with the field it sits in and, for a person's card, that card's own `gender` (the raw record: the
 * oracle a check reads). A MEASURE: it changes nothing.
 * Usage: node e8-records.mjs <tree> <plan.json> <out.tsv>
 * TSV columns: seed, size, field (npcs[].x.y | relationships[].description …), card gender ('-' off a card), text.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [T, PLAN, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const REFL = /\b(themselves|themself|himself|herself)\b/i;
const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
const out = [];
for (const p of plan) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  /** @param {unknown} v @param {string} path @param {string} gender */
  const walk = (v, path, gender) => {
    if (typeof v === 'string') { if (REFL.test(v)) out.push([p.seed, p.size, path, gender, v.replace(/[\t\n]/g, ' ')].join('\t')); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, `${path}[]`, gender)); return; }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, gender);
  };
  for (const n of s.npcs || []) walk(n, 'npcs[]', String(n?.gender || '-'));
  for (const [k, v] of Object.entries(s)) if (k !== 'npcs') walk(v, k, '-');
}
writeFileSync(OUT, `${out.join('\n')}\n`);
console.log(`e8-records ${PLAN}: births ${plan.length}; strings with a reflexive ${out.length}`);
