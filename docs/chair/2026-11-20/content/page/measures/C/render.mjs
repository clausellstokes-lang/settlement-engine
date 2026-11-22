#!/usr/bin/env node
// PAGE-1 helper C: drive the rendered check (render.c.jsx) through vitest with the tree as root, then read the People
// views it wrote and confirm, on the page as printed, the record-level figures of f4.mjs / f5.mjs.
// Run from the repository root (n towns per size, default 2; workers default 3):
//   node docs/chair/2026-11-20/content/page/measures/C/render.mjs "$PWD" 2 3 > docs/chair/2026-11-20/content/page/measures/C/render.out.txt 2>&1
// Writes the vitest config, plans, logs and views under $PAGEC_TMP (default: /tmp/pagec-render), never in the tree.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const [tree = process.cwd(), nA = '2', wA = '3'] = process.argv.slice(2);
const TREE = resolve(tree); const TMP = process.env.PAGEC_TMP || '/tmp/pagec-render';
const OUT = join(TMP, 'views'); mkdirSync(OUT, { recursive: true });
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const plan = SIZES.flatMap((size) => Array.from({ length: +nA }, (_, i) => ({ size, seed: `hxd-${size}-${i}` }))).filter((r) => !existsSync(join(OUT, `${r.seed}.json`)));
const config = join(TMP, 'vitest.pagec.config.mjs');
writeFileSync(config, `import react from '${join(TREE, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${TREE}', plugins: [react()], test: { environment: 'node', include: ['${join(HERE, 'render.c.jsx')}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const go = (env, log) => new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: TREE, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (code) => { writeFileSync(log, Buffer.concat(chunks)); res(code); });
});
const W = Math.max(1, Math.min(+wA, plan.length));
const codes = plan.length ? await Promise.all(Array.from({ length: W }, (_, w) => {
  const part = join(TMP, `plan.${w}.json`); writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % W === w)));
  return go({ PAGEC_OUT: OUT, PAGEC_PLAN: part }, join(TMP, `render.${w}.log`));
})) : [];
console.log(`render: ${plan.length} towns rendered now (exit codes ${codes.join(',') || 'none'}); views in ${OUT}`);

// ── read the People views ──────────────────────────────────────────────────────────────────────────────
const files = readdirSync(OUT).filter((f) => f.endsWith('.json')).sort();
const lines = (v) => (Array.isArray(v) ? v.flatMap(lines) : typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(lines) : []);
// THE WALKER DEDUPES LINES within a view (two cards' identical "Standing marginal" print once), so a per-card count reads
// the card's HEADER, "<name>●|●●|●●●" (npcComponents.jsx:416-418, the dots of :294 from the same n.influence that the
// Standing word of :570 reads), and the card's power line after it ("... first of X ...", npcComponents.jsx:458-466).
const perSize = {}; let tot = { first: 0, low: 0, rec: 0, recLow: 0, cards: 0, oneDot: 0 }; const samples = []; let standingWords = new Set();
for (const f of files) {
  const { seed, views } = JSON.parse(readFileSync(join(OUT, f), 'utf8'));
  const size = seed.split('-')[1]; const ps = perSize[size] = perSize[size] || { towns: 0, first: 0, low: 0, rec: 0, recLow: 0 }; ps.towns++;
  const L = Object.keys(views).filter((k) => /NPCs/.test(k)).flatMap((k) => lines(views[k]));
  let dots = null; let name = null;
  for (const l of L) {
    const h = /^(.+?)(●{1,3})$/.exec(l.trim());
    if (h && !/^All/.test(l)) { dots = h[2]; name = h[1]; tot.cards++; if (dots === '●') tot.oneDot++; continue; }
    const s = /^Standing (\w+)$/.exec(l.trim()); if (s) standingWords.add(s[1]);
    if (dots && /\bfirst of\b/.test(l)) { ps.first++; tot.first++; if (dots === '●') { ps.low++; tot.low++; if (samples.length < 6) samples.push(`${seed} ${name}● "${l.trim()}"`); } dots = null; }
  }
  // the record's own count for the same seed (f4.mjs's reading): first-of rows with influence low
}
// record-level for the same seeds, forged by the brief's recipe
const { generateSettlementPipeline } = await import(`${TREE}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${TREE}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${TREE}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
for (const f of files) {
  const seed = f.replace(/\.json$/, ''); const size = seed.split('-')[1];
  const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  for (const n of town.npcs) for (const m of n.memberships || []) if (m.rank === 1) { perSize[size].rec++; tot.rec++; if (n.influence === 'low') { perSize[size].recLow++; tot.recLow++; } }
}
console.log(`\nRENDERED (${files.length} towns, People tab as the census walker prints it): card headers ${tot.cards}, of them one dot (= "Standing marginal") ${tot.oneDot}; Standing words seen: ${[...standingWords].join(', ')}`);
console.log(`cards whose power line says "first of", header one dot: ${tot.low}/${tot.first}; the RECORD for the same seeds (first-of rows, influence low): ${tot.recLow}/${tot.rec} (a card first of two powers prints one line: rendered counts cards, the record counts rows)`);
console.log(`by size (rendered low/first | record low/first): ${Object.entries(perSize).map(([s, v]) => `${s} (${v.towns}) ${v.low}/${v.first} | ${v.recLow}/${v.rec}`).join(' · ')}`);
console.log(`samples:\n  ${samples.join('\n  ')}`);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
