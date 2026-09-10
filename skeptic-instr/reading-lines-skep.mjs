// reading-sequence.mjs — the SIMULATED READING SEQUENCE over N towns, composed through the
// SHIPPED composers with REAL readings (gen-probe2.mjs's method; never `{}` readings, which
// select the absence pools for every seed and manufacture a finding).
// READ-ONLY. Writes only its own JSON report into this scratchpad directory.
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const imp = (p) => import(pathToFileURL(D + '/' + p).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generalDeskLines } = await imp('src/components/new/generalDeskRead.js');
const power = await imp('src/domain/display/stateProse/powerStateProse.js');
const { structuralLensOf } = await imp('src/domain/spatial/cohesionWeave.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
const { classifyMoves, orderIdOf } = await imp('src/domain/prose/moveGrammar.js');

const N = Number(process.argv[2] || 200);
const CONFIG = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };
const towns = [];
let threw = 0;
for (let i = 0; i < N; i++) {
  const SEED = `instr-912-seq-${i}`;
  let s;
  try { s = generateSettlementPipeline(CONFIG, null, { seed: SEED, customContent: {} }); }
  catch (e) { threw++; continue; }
  const seed = String(s._seed ?? s.id ?? SEED);
  const found = [];
  const walk = (o, depth = 0) => {
    if (!o || typeof o !== 'object' || depth > 10) return;
    if (typeof o.blockId === 'string' && typeof o.poolKey === 'string' && typeof o.text === 'string') { found.push(o); return; }
    if (typeof o.sentence === 'string' && o.provenance && typeof o.provenance.blockId === 'string') {
      found.push({ blockId: o.provenance.blockId, poolKey: o.provenance.poolKey, text: o.sentence }); return;
    }
    for (const v of Object.values(o)) walk(v, depth + 1);
  };
  try { walk(generalDeskLines(s, { seed, audience: 'dm' })); } catch (e) { threw++; }
  let contenders = null; try { contenders = coupContenders(s); } catch { /* the reading is absent on some towns */ }
  const deskReadings = { ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}), structuralLens: structuralLensOf(s) };
  try { walk(power.powerStateProse(s, deskReadings, { seed, audience: 'dm' })); } catch (e) { threw++; }
  towns.push({ seed: SEED, name: s.name, lines: found.map(l => ({ block: l.blockId, pool: l.poolKey, text: l.text })) });
}
const orderOf = (t) => orderIdOf(classifyMoves(t)) || classifyMoves(t).join('→');
const sequences = towns.map(t => ({ unit: `town ${t.seed}`, orders: t.lines.map(l => orderOf(l.text)) }));
const flat = sequences.flatMap(s => s.orders);
const counts = new Map(); for (const o of flat) counts.set(o, (counts.get(o) || 0) + 1);
let repeats = 0, pairs = 0;
for (const s of sequences) for (let i = 1; i < s.orders.length; i++) { pairs++; if (s.orders[i] === s.orders[i-1]) repeats++; }
console.log(`towns ${towns.length} of ${N} (composer throws ${threw}) | lines ${flat.length} | mean lines/town ${(flat.length/towns.length).toFixed(1)}`);
console.log(`distinct realised orders n = ${counts.size}`);
for (const [o,k] of [...counts].sort((a,b)=>b[1]-a[1])) console.log(`   ${String(k).padStart(5)}  ${(k/flat.length*100).toFixed(1)}%  ${o}`);
console.log(`same-order-as-previous within a town: ${repeats}/${pairs} = ${(repeats/pairs).toFixed(4)}`);
writeFileSync('reading-lines.json', JSON.stringify(towns, null, 1));
console.log('wrote reading-sequence.json');
