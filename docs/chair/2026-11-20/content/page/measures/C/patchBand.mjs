// PAGE-1 helper C, F4 (added work): WHAT CORRECTING THE KEYWORD MATCH WOULD MOVE. src is never edited: the script copies
// the tree's src/ (with package.json and the census walker) into a scratch directory, patches the COPY of
// npcGenerator.js :: powerBandOfRole so each keyword's '_' reads as a space (the pool rows spell 'Guild Master',
// 'Council Member'), forges the 300 in both trees by the brief's recipe, and diffs every stored field of every town.
// Run from the repository root (scratch dir defaults to /tmp/pagec-patched):
//   node docs/chair/2026-11-20/content/page/measures/C/patchBand.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/C/patchBand.out.txt 2>&1
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [tree = process.cwd(), nA = '50'] = process.argv.slice(2);
const L = resolve(tree); const P = process.env.PAGEC_PATCHED || '/tmp/pagec-patched';
rmSync(P, { recursive: true, force: true }); mkdirSync(join(P, 'tests/components'), { recursive: true });
cpSync(join(L, 'src'), join(P, 'src'), { recursive: true });
cpSync(join(L, 'package.json'), join(P, 'package.json'));
cpSync(join(L, 'tests/components/pageCensusWalk.shared.mjs'), join(P, 'tests/components/pageCensusWalk.shared.mjs'));
symlinkSync(join(L, 'node_modules'), join(P, 'node_modules'));
if (existsSync(join(L, 'supabase'))) symlinkSync(join(L, 'supabase'), join(P, 'supabase'));
const f = join(P, 'src/generators/npcGenerator.js');
const src = readFileSync(f, 'utf8');
const ANCHOR = "return HIGH_POWER.some(kw => r.includes(kw)) ? 'high' : MID_POWER.some(kw => r.includes(kw)) ? 'moderate' : 'low';";
if (!src.includes(ANCHOR)) { console.log('ANCHOR NOT FOUND: the function moved; nothing measured'); process.exit(2); }
writeFileSync(f, src.replace(ANCHOR, "return HIGH_POWER.some(kw => r.includes(kw.replace(/_/g, ' '))) ? 'high' : MID_POWER.some(kw => r.includes(kw.replace(/_/g, ' '))) ? 'moderate' : 'low';"));
console.log(`patched copy at ${P}: npcGenerator.js powerBandOfRole reads '_' as ' ' (the one change)`);

async function forge(root) {
  const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${root}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${root}/src/store/configSlice.js`);
  const { SIZES } = await import(`${root}/tests/components/pageCensusWalk.shared.mjs`);
  await loadGenerationLawPayloads();
  const out = [];
  for (const size of SIZES) for (let i = 0; i < +nA; i++) out.push(JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }))));
  return out;
}
const A = await forge(L); const B = await forge(P);
const paths = new Map(); // normalized path -> Set(town index)
const diff = (a, b, p, ti) => {
  if (a === b) return;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) diff(a[k], b[k], `${p}.${/^\d+$/.test(k) ? '[]' : k}`, ti);
    return;
  }
  if (!paths.has(p)) paths.set(p, new Set()); paths.get(p).add(ti);
};
let changedTowns = 0; let npcInf = 0; let npcPow = 0; let firstsLifted = 0; const lifted = new Map();
for (let i = 0; i < A.length; i++) {
  const before = paths.size; const snap = new Map([...paths].map(([k, v]) => [k, v.size]));
  diff(A[i], B[i], '', i);
  if ([...paths].some(([k, v]) => v.size !== (snap.get(k) || 0))) changedTowns++;
  void before;
  const bn = new Map((B[i].npcs || []).map((n) => [n.id, n]));
  for (const n of A[i].npcs || []) { const m = bn.get(n.id); if (!m) continue; if (m.influence !== n.influence) { npcInf++; const k = `${n.role} ${n.influence}->${m.influence}`; lifted.set(k, (lifted.get(k) || 0) + 1); if ((n.memberships || []).some((x) => x.rank === 1)) firstsLifted++; } if (m.power !== n.power) npcPow++; }
}
console.log(`\ntowns forged: ${A.length} each side; towns with any stored difference: ${changedTowns}`);
console.log(`cards whose influence moved: ${npcInf}; whose power (1-10) moved: ${npcPow}; of the moved, first of a power: ${firstsLifted}`);
console.log(`moves by printed role: ${[...lifted].sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log('\nEVERY STORED PATH THAT DIFFERS (array indices folded to []), with the number of towns where it differs:');
for (const [k, v] of [...paths].sort((x, y) => y[1].size - x[1].size || x[0].localeCompare(y[0]))) console.log(`  ${String(v.size).padStart(4)}  ${k}`);
