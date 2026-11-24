// PLACE-1 · entrepotNote MEASURE: sections 0-C's numbers from measure.mjs's rows.
//   node analyze.mjs <rows-plain.json> <rows-capture.json> > out/analyze.txt
// HELD = the record holds the note (the chair's census reading); PRINTED = EconomicsTab's gate passes
// (entrepot && entrepotNote && !dependency; section 0 proved the gate equals the rendered surface).
import fs from 'node:fs';
const plain = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const cap = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');
const out = (s = '') => console.log(s);

// ── the instrument moves nothing ──
let same = 0;
for (let k = 0; k < plain.length; k++) {
  const a = JSON.stringify(plain[k].chains), b = JSON.stringify(cap[k].chains);
  if (a === b && plain[k].seed === cap[k].seed) same++;
}
out(`INSTRUMENT: ${same} of ${plain.length} births identical (every noted chain: note, gate, status, outputs) with and without capture`);
out();

// ── before, by size ──
/** @param {any[]} rs @param {(c:any)=>boolean} keep */
function topOf(rs, keep) {
  const m = new Map(); let holders = 0;
  for (const r of rs) {
    const s = new Set(r.chains.filter(keep).map((c) => c.masked));
    if (s.size) holders++;
    for (const x of s) m.set(x, (m.get(x) || 0) + 1);
  }
  const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);
  return { holders, distinct: m.size, sorted };
}
out('BEFORE (100 places a size). top = places holding the commonest note; share of the size\'s 100 places and of its holders');
for (const size of SIZES) {
  const rs = plain.filter((r) => r.size === size);
  const h = topOf(rs, () => true), p = topOf(rs, (c) => c.printed);
  const notesHeld = rs.reduce((a, r) => a + r.chains.length, 0), notesPrinted = rs.reduce((a, r) => a + r.chains.filter((c) => c.printed).length, 0);
  out(`${size.padEnd(10)} HELD   holders ${String(h.holders).padStart(3)}  distinct ${String(h.distinct).padStart(2)}  top ${h.sorted[0]?.[1] ?? 0}/100 (${pct(h.sorted[0]?.[1] ?? 0, h.holders)} of holders)  notes/holder ${(notesHeld / Math.max(1, h.holders)).toFixed(1)}  "${(h.sorted[0]?.[0] || '').slice(0, 60)}"`);
  out(`${''.padEnd(10)} PRINTED holders ${String(p.holders).padStart(3)}  distinct ${String(p.distinct).padStart(2)}  top ${p.sorted[0]?.[1] ?? 0}/100 (${pct(p.sorted[0]?.[1] ?? 0, p.holders)} of printers) notes/printer ${(notesPrinted / Math.max(1, p.holders)).toFixed(1)}  "${(p.sorted[0]?.[0] || '').slice(0, 60)}"`);
}
out();

// ── per chain: places holding / printing, by size ──
const ids = [...new Set(plain.flatMap((r) => r.chains.map((c) => c.id)))].sort();
out('PER CHAIN: places of 100 that HOLD / PRINT the chain\'s note, by size (thorp hamlet village town city metropolis)');
for (const id of ids) {
  const cells = SIZES.map((s) => {
    const rs = plain.filter((r) => r.size === s);
    const held = rs.filter((r) => r.chains.some((c) => c.id === id)).length;
    const pr = rs.filter((r) => r.chains.some((c) => c.id === id && c.printed)).length;
    return `${String(held).padStart(3)}/${String(pr).padEnd(3)}`;
  });
  out(`${id.padEnd(22)} ${cells.join(' ')}`);
}
out();

// ── why a held note is not printed ──
const why = new Map();
for (const r of plain) for (const c of r.chains) if (!c.printed) { const k = `${c.id}: ${c.entrepot ? '' : 'not entrepot '}${c.dependency ? 'dependency' : ''}`; why.set(k, (why.get(k) || 0) + 1); }
out('HELD BUT NOT PRINTED (chain: reason, notes of 600 births)');
for (const [k, v] of [...why.entries()].sort((a, b) => b[1] - a[1])) out(`  ${k}  ${v}`);
out();

// ── the route each printed note sits on, per chain ──
out('ROUTE of the places that PRINT each chain\'s note (all sizes)');
for (const id of ids) {
  const m = new Map();
  for (const r of plain) for (const c of r.chains) if (c.id === id && c.printed) m.set(r.route, (m.get(r.route) || 0) + 1);
  out(`  ${id.padEnd(22)} ${[...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`);
}
out();

// ── facts at hand ──
let outExp = 0, outAll = 0, own = 0, transitN = 0, transitHolders = 0, docks = 0, market = 0, pAll = 0;
for (const r of plain) {
  if (r.chains.some((c) => c.printed)) { transitHolders++; if (r.transit.length) transitN++; if (r.facts.market) market++; }
  for (const c of r.chains) if (c.printed) {
    pAll++;
    if (c.resourceActive && c.resource) own++;
    outAll++; if (c.outputs.some((o) => r.exports.some((e) => e.toLowerCase().includes(o.toLowerCase()) || o.toLowerCase().includes(e.toLowerCase())))) outExp++;
  }
}
out(`FACTS: printed notes ${pAll}; the chain's own ground worked here (resourceActive with a resource) ${own}; a chain output on the export list ${outExp} of ${outAll}`);
out(`FACTS: places printing a note ${transitHolders}; economicState.transit non-empty in ${transitN}; a market in ${market}`);
out();

// ── the writer against the final record ──
let routeEq = 0, setEq = 0, outEq = 0, gateEq = 0, calls = new Map(), n = 0, seedRecon = 0, seedEcon = 0;
const stepEq = { generateEconomy: 0, economyReconcilePass: 0, generateNarratives: 0, assembleSettlement: 0 };
for (const r of cap) {
  n++;
  calls.set(r.caps.length, (calls.get(r.caps.length) || 0) + 1);
  const last = r.caps[r.caps.length - 1] || { chains: [], route: null };
  if (last.route === r.route) routeEq++;
  const fin = r.chains.map((c) => `${c.id}|${c.note}`).sort().join(';');
  if (last.chains.map((c) => `${c.id}|${c.note}`).sort().join(';') === fin) setEq++;
  if (JSON.stringify(last.chains.map((c) => [c.id, c.outputs]).sort()) === JSON.stringify(r.chains.map((c) => [c.id, c.outputs]).sort())) outEq++;
  if (JSON.stringify(last.chains.map((c) => [c.id, c.entrepot && !c.dependency]).sort()) === JSON.stringify(r.chains.map((c) => [c.id, c.printed]).sort())) gateEq++;
  for (const k of Object.keys(stepEq)) {
    const s = r.snaps[k];
    if (s && JSON.stringify(s.chains.map((c) => [c.id, c.note, c.entrepot && !c.dependency, c.outputs]).sort()) === JSON.stringify(r.chains.map((c) => [c.id, c.note, c.printed, c.outputs]).sort())) stepEq[k]++;
  }
  if (r.snaps.economyReconcilePass?.seedInCtx) seedRecon++;
  if (r.snaps.generateEconomy?.seedInCtx) seedEcon++;
}
out(`WRITER: computeActiveChains calls per birth: ${[...calls.entries()].sort().map(([k, v]) => `${k} call(s) ${v}`).join(', ')}`);
out(`WRITER: route handed to the writer (last call) = tradeRouteOf(final record): ${routeEq} of ${n}`);
out(`WRITER: noted chains (id + note) at the last call = final: ${setEq} of ${n}; their outputs equal: ${outEq} of ${n}; their gate (entrepot && !dependency) equal: ${gateEq} of ${n}`);
out(`STEPS: the noted chains (id, note, gate, outputs) after each step = final: ${Object.entries(stepEq).map(([k, v]) => `${k} ${v}`).join(', ')} (of ${n})`);
out(`SEED: ctx._seed a non-empty string after generateEconomy ${seedEcon} of ${n}, after economyReconcilePass ${seedRecon} of ${n} (computeActiveChains is handed no config and no seed: 0 of ${n})`);

// ── the facts the proposed call line would read in economyReconcilePass, against the final record ──
let aRoute = 0, aMarket = 0, aInst = 0, aCarrier = 0, aN = 0;
for (const r of cap) {
  const at = r.snaps.economyReconcilePass?.at; if (!at) continue; aN++;
  if (at.route === r.route) aRoute++;
  if (at.market === r.facts.market) aMarket++;
  if (JSON.stringify(at.inst) === JSON.stringify(r.finalInst)) aInst++;
  if (JSON.stringify(at.carriers.slice().sort()) === JSON.stringify(r.chains.map((c) => `${c.id}:${c.carrier}`).sort())) aCarrier++;
}
out(`AT economyReconcilePass (record = { config: effectiveConfig, economicState, institutions, tier }) = final: route ${aRoute}, market ${aMarket}, tavern+bank ${aInst}, every noted chain's carrier ${aCarrier} (of ${aN})`);
