#!/usr/bin/env node
/**
 * TWIN STRINGS (WORDS-1): per birth of a plan on one tree, every string of the born record (by path) AND every string of
 * the public projection (`components/new/publicProseCompose.js :: composePublicProse`, under `public:`), written as one
 * JSON per seed; `--cmp` reads two trees' dumps and lists, per seed, each path whose string differs. A MEASURE.
 *   node twin-strings.mjs <tree> <plan.json> <outDir>
 *   node twin-strings.mjs --cmp <dirA> <dirB> <out.tsv>    (tsv: seed, size, path, before, after)
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** @param {unknown} v @param {string} path @param {Record<string, string>} acc */
const flat = (v, path, acc) => {
  if (typeof v === 'string') acc[path] = v;
  else if (Array.isArray(v)) v.forEach((x, i) => flat(x, `${path}[${i}]`, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(x, `${path}.${k}`, acc);
  return acc;
};
if (process.argv[2] === '--cmp') {
  const [, , , A, B, OUT] = process.argv;
  const rows = []; const moved = { record: new Set(), public: new Set() }; let n = 0;
  for (const f of readdirSync(A).filter((x) => x.endsWith('.json'))) {
    n++;
    const a = JSON.parse(readFileSync(join(A, f), 'utf8')); const b = JSON.parse(readFileSync(join(B, f), 'utf8'));
    for (const k of new Set([...Object.keys(a.s), ...Object.keys(b.s)])) {
      if (a.s[k] === b.s[k]) continue;
      moved[k.startsWith('public') ? 'public' : 'record'].add(a.seed);
      rows.push([a.seed, a.size, k, a.s[k] ?? '∅', b.s[k] ?? '∅'].map((x) => String(x).replace(/[\t\n]/g, ' ')).join('\t'));
    }
  }
  writeFileSync(OUT, `${rows.join('\n')}\n`);
  console.log(`twin-strings --cmp: births ${n}; strings differing ${rows.length}; places with a record string moved ${moved.record.size}, with a public-projection string moved ${moved.public.size}`);
  process.exit(0);
}
const [T, PLAN, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { composePublicProse } = await import(`${T}/src/components/new/publicProseCompose.js`);
await loadGenerationLawPayloads();
mkdirSync(OUT, { recursive: true });
for (const p of JSON.parse(readFileSync(PLAN, 'utf8'))) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  const acc = flat(s, 'record', {});
  flat(composePublicProse(s), 'public', acc);
  writeFileSync(join(OUT, `${p.seed}.json`), JSON.stringify({ seed: p.seed, size: p.size, s: acc }));
}
console.log(`twin-strings ${T} ${PLAN}: done`);
