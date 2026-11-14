// node births.mjs <tree> <out.ndjson.gz> census|fresh — the census 720 (CENSUS-2 seeds.txt via its seedcfg) or a fresh 720 in the app's shape
import fs from 'node:fs'; import zlib from 'node:zlib';
const [TREE, OUTF, which] = process.argv.slice(2); const R = TREE + '/src'; const S = '/tmp/claude-0/-home-user-settlement-engine/20da41e0-fdd7-5ba6-bcc5-735d1051c63c/scratchpad';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
const { makeCfgFor } = await import(S + '/c2/seedcfg.mjs');
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['under_siege', 'famine', 'occupied', 'plague_onset', 'wartime', 'insurgency'];
let seeds; const census = makeCfgFor(birthConfig, DEFAULT_CONFIG);
let cfgFor = census;
if (which === 'census') seeds = fs.readFileSync(S + '/c2/seeds.txt', 'utf8').trim().split('\n').filter(Boolean);
else {
  seeds = []; for (const z of SIZES) for (let i = 0; i < 60; i++) seeds.push(`w2fd8r-${z}-${i}`);
  for (const c of CRISES) for (const z of SIZES) for (let i = 0; i < 10; i++) seeds.push(`w2fd8s-${c}-${z}-${i}`);
  cfgFor = (seed) => { let m = /^w2fd8r-(\w+)-\d+$/.exec(seed); if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true });
    m = /^w2fd8s-([a-z_+]+)-(\w+)-\d+$/.exec(seed); return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStressesRandom: false, selectedStresses: m[1].split('+'), _randomizePriorities: true }); };
}
const out = zlib.createGzip(); const done = new Promise((r) => out.pipe(fs.createWriteStream(OUTF)).on('finish', r));
let n = 0, err = 0;
for (const seed of seeds) { try { const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }); out.write(JSON.stringify({ seed, s }) + '\n'); n++; } catch (e) { err++; console.error(seed, e.message); } }
out.end(); await done; console.log('births', n, 'errors', err); process.exit(err ? 1 : 0);
