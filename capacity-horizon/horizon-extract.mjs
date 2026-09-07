/**
 * horizon-extract.mjs — LANE CAP-HORIZON-909, READ-ONLY.
 * Grades one soak receipt with the PRODUCT's own instruments (evaluateReceipt,
 * deriveRegisterFigures, settlementShapeOf) — nothing re-implemented, nothing typed.
 * Usage: node horizon-extract.mjs <receipt.json>
 */
import { readFileSync } from 'node:fs';

const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const RECEIPT = process.argv[2];

const { evaluateReceipt } = await import(`${DOCK}/scripts/soak/evaluate.mjs`);
const { settlementShapeOf, deriveRegisterFigures } = await import(`${DOCK}/scripts/soak/register.mjs`);
const { TRIPWIRES } = await import(`${DOCK}/scripts/soak/tripwires.mjs`);

const r = JSON.parse(readFileSync(RECEIPT, 'utf8'));
const ids = (r.behavioral?.settlementIds || []).map(String);
const yearly = r.behavioral?.yearly || [];
const pops = Array.isArray(r.yearlyPopulations) ? r.yearlyPopulations : [];
const died = Array.isArray(r.yearlyDiedFlags) ? r.yearlyDiedFlags : [];

console.log('# HORIZON EXTRACT');
console.log(`receipt              ${RECEIPT}`);
console.log(`bytes                ${readFileSync(RECEIPT).length}`);
console.log(`kind=${r.kind} schemaVersion=${r.schemaVersion} years=${r.years} settlements=${r.settlements}`);
console.log(`seed                 ${r.seed}`);
console.log(`caseId               ${r.caseId ?? '(none — no register cell identity claimed)'}`);
console.log(`passed               ${r.passed}`);
console.log(`demographicsEnabled  ${r.subsystems?.rules?.demographicsEnabled}   <- the overlay, read off the receipt`);
console.log(`finalHash            ${r.finalHash}`);
console.log(`receipt.notExecutable (writer's own) = ${JSON.stringify(r.notExecutable)}`);
console.log('');

console.log('## ⭐ THE SHIPPED SERIES (§909 car 1) — is it on the receipt, and how long?');
console.log(`  yearlyPopulations   rows=${pops.length}  width=${Array.isArray(pops[0]) ? pops[0].length : 'n/a'}`);
console.log(`  yearlyDiedFlags     rows=${died.length}  width=${Array.isArray(died[0]) ? died[0].length : 'n/a'}`);
console.log(`  behavioral.yearly   rows=${yearly.length}`);
console.log('');

// ── the product's own evaluation ────────────────────────────────────────────
const ev = evaluateReceipt(r);
console.log('## ⭐ evaluateReceipt — the PRODUCT grading its own receipt');
console.log(`  deterministicFirings ${ev.deterministicFirings}`);
console.log(`  fullInstrument       ${ev.fullInstrument}`);
console.log(`  notExecutable (folded) ${JSON.stringify(ev.notExecutable)}`);
console.log(`  annotated.notExecutable ${JSON.stringify(ev.annotated.notExecutable)}`);
console.log('  FINDINGS:');
for (const f of ev.findings) console.log(`    FINDING  ${f.id}  [${f.class}]  ${JSON.stringify(f.detail ?? f.findings ?? f)}`);
if (!ev.findings.length) console.log('    (none)');
console.log('  OBSERVABILITY:');
for (const o of ev.observability) console.log(`    OBS      ${o.id}  inconclusive=${o.inconclusive === true}  ${JSON.stringify(o)}`);
if (!ev.observability.length) console.log('    (none)');
console.log('');

console.log('## ⭐ THE FOUR CAPACITY ROWS, one line each — gate / requires / horizon / verdict');
for (const row of TRIPWIRES.filter((t) => t.id.startsWith('capacity_'))) {
  const gated = typeof row.gate === 'function' ? row.gate(r) : true;
  const obsFn = row.horizon?.observed;
  const observed = typeof obsFn === 'function' ? obsFn(r) : (row.horizon ? row.horizon.observed : null);
  const fired = ev.findings.filter((f) => f.id === row.id);
  const obs = ev.observability.filter((f) => f.id === row.id);
  const ne = (ev.annotated.notExecutable || []).filter((f) => (f.id || f.assertion) === row.id);
  let verdict = 'EXECUTED, SILENT (no finding)';
  if (!gated) verdict = 'NOT APPLICABLE (gate false)';
  else if (ne.length) verdict = 'NOT-EXECUTABLE';
  else if (fired.length) verdict = 'EXECUTED, FIRED';
  else if (obs.length) verdict = 'EXECUTED, COMPLETE BUT INCONCLUSIVE (observability)';
  console.log(`  ${row.id.padEnd(24)} class=${row.class}  gate=${gated}  requires=${JSON.stringify(row.requires || [])}`);
  console.log(`  ${''.padEnd(24)} horizon required=${row.horizon?.required ?? 'n/a'} observed=${observed ?? 'n/a'}`);
  console.log(`  ${''.padEnd(24)} ⇒ ${verdict}`);
  const raw = typeof row.detect === 'function' && gated ? row.detect(r) : null;
  if (raw) console.log(`  ${''.padEnd(24)} detector output (${raw.length}): ${JSON.stringify(raw)}`);
}
console.log('');

// ── the realm curve by decade ──────────────────────────────────────────────
console.log('## ⭐ REALM loadRatio01 BY DECADE (behavioral.yearly[y].realmDemography)');
console.log('  year  loadRatio01  pressure01  population    bound  capacity  granary walls  inWindow[0.6,1.05]');
const decadeRows = [];
for (let y = 10; y <= yearly.length; y += 10) {
  const rd = yearly[y - 1]?.realmDemography;
  if (!rd) { console.log(`  ${String(y).padStart(4)}  (no realmDemography on this row)`); continue; }
  const inWin = Number(rd.loadRatio01) >= 0.6 && Number(rd.loadRatio01) <= 1.05;
  decadeRows.push({ y, load: Number(rd.loadRatio01), inWin });
  console.log(`  ${String(y).padStart(4)}  ${Number(rd.loadRatio01).toFixed(4).padStart(11)}  ${Number(rd.realmPressure01).toFixed(4).padStart(10)}  ${String(rd.population).padStart(10)}  ${String(rd.bound).padStart(7)}  ${String(rd.capacity).padStart(8)}  ${String(rd.binding?.granary).padStart(7)} ${String(rd.binding?.walls).padStart(5)}  ${inWin ? 'YES' : 'no'}`);
}
console.log('');
const firstIn = decadeRows.find((d) => d.inWin);
const lastOut = [...decadeRows].reverse().find((d) => !d.inWin);
console.log(`  first decade INSIDE [0.6,1.05]: ${firstIn ? `year ${firstIn.y} (${firstIn.load.toFixed(4)})` : 'NEVER'}`);
console.log(`  last  decade OUTSIDE          : ${lastOut ? `year ${lastOut.y} (${lastOut.load.toFixed(4)})` : 'none — inside from the first decade on'}`);
console.log(`  ENTERS AND STAYS              : ${firstIn && (!lastOut || lastOut.y < firstIn.y) ? 'YES' : 'NO'}`);
console.log('');

// ── shapes, both derivations ───────────────────────────────────────────────
console.log('## ⭐ SETTLEMENT SHAPES — settlementShapeOf on BOTH series (they must agree)');
const finalDied = Array.isArray(r.finalDiedFlags) ? r.finalDiedFlags : [];
const shipped = {};
ids.forEach((id, i) => { shipped[id] = pops.map((row) => Number(row?.[i])).filter(Number.isFinite); });
const fromVectors = {};
for (const id of ids) fromVectors[id] = [];
for (const yr of yearly) for (const id of ids) {
  const p = yr?.stateVectors?.[id]?.population;
  if (Number.isFinite(Number(p))) fromVectors[id].push(Number(p));
}
console.log('  settlement       len  start   y-mid   centuryAgo   final  |final-centuryAgo|  5%*final   shape(shipped)  shape(stateVectors)');
ids.forEach((id, i) => {
  const s = shipped[id]; const v = fromVectors[id];
  const final = s[s.length - 1]; const centuryAgo = s[s.length - 1 - 100];
  const mid = s[Math.floor((s.length - 1) / 2)];
  const drift = Math.abs(final - centuryAgo); const allowed = Math.abs(final || 1) * 0.05;
  const a = settlementShapeOf(s, { died: Boolean(finalDied[i]) });
  const b = settlementShapeOf(v, { died: Boolean(finalDied[i]) });
  console.log(`  ${id.padEnd(14)} ${String(s.length).padStart(4)} ${String(s[0]).padStart(6)} ${String(mid).padStart(7)} ${String(centuryAgo).padStart(12)} ${String(final).padStart(7)} ${drift.toFixed(1).padStart(18)} ${allowed.toFixed(1).padStart(9)}   ${a.padEnd(15)} ${b}${a === b ? '' : '   ⛔ DISAGREE'}`);
});
console.log('');

console.log('## ⭐ capacity_plateau, term by term per settlement (the row\'s own clauses)');
const last = pops.length - 1; const midIdx = Math.floor(last / 2);
console.log(`  the row reads pops[last=${last}] against pops[mid=${midIdx}] (years ${last + 1} and ${midIdx + 1}); band |yLast-yMid|/yMid <= 0.05`);
ids.forEach((id, i) => {
  const yMid = Number(pops[midIdx]?.[i]); const yLast = Number(pops[last]?.[i]);
  const ratio = yMid > 0 ? Math.abs(yLast - yMid) / yMid : NaN;
  const centuries = [];
  for (let y = 100; y <= last; y += 100) {
    const from = Number(pops[y - 100]?.[i]); const to = Number(pops[y]?.[i]);
    if (Number.isFinite(from) && from > 0) centuries.push(`y${y - 100}->y${y} x${(to / from).toFixed(2)}`);
  }
  console.log(`  ${id.padEnd(14)} yMid=${String(yMid).padStart(6)} yLast=${String(yLast).padStart(6)}  drift=${Number.isFinite(ratio) ? ratio.toFixed(4) : 'n/a'}  ${ratio <= 0.05 ? 'PLATEAU' : `NOT plateau (${(ratio / 0.05).toFixed(1)}x the window)`}`);
  console.log(`  ${''.padEnd(14)} century multipliers (bar 50): ${centuries.join('  ')}`);
});
console.log('');

// ── register figures ───────────────────────────────────────────────────────
console.log('## ⭐ deriveRegisterFigures — runaway / floored / unlawfulZero / bifurcated');
const derived = deriveRegisterFigures(ev.annotated);
for (const [k, v] of Object.entries(derived.figures)) {
  if (/^realm\.|^population\./.test(k)) console.log(`  ${k.padEnd(34)} ${JSON.stringify(v.value)}  (${v.direction}${v.band != null ? ` ${v.band}` : ''})`);
}
console.log(`  shapes: ${JSON.stringify(derived.shapes)}`);
console.log('');

// ── cost ───────────────────────────────────────────────────────────────────
console.log('## ⭐ COST — the receipt\'s OWN timing (`runDurationsMs`, register figure `cost.primaryMs`)');
console.log(`  runDurationsMs = ${JSON.stringify(r.runDurationsMs)}`);
console.log(`  peakHeapUsedBytes = ${r.peakHeapUsedBytes}`);
console.log(`  ticksAdvanced = ${r.ticksAdvanced}`);
const sy = Number(r.years) * Number(r.settlements);
const primary = Number(r.runDurationsMs?.primary);
const replay = Number(r.runDurationsMs?.replay);
const divergent = Number(r.runDurationsMs?.divergent);
if (Number.isFinite(primary)) {
  console.log(`  settlement-years  = ${r.years} y x ${r.settlements} s = ${sy}`);
  console.log(`  run A (primary)   = ${primary} ms = ${(primary / 1000).toFixed(1)} s  ⇒ ${(primary / 1000 / sy).toFixed(4)} s per settlement-year`);
  if (Number.isFinite(replay)) console.log(`  run B (replay)    = ${replay} ms = ${(replay / 1000).toFixed(1)} s  ⇒ ${(replay / 1000 / sy).toFixed(4)} s per settlement-year`);
  if (Number.isFinite(divergent)) console.log(`  run C (divergent) = ${divergent} ms = ${(divergent / 1000).toFixed(1)} s`);
  console.log(`  A+B+C             = ${((primary + (replay || 0) + (divergent || 0)) / 1000).toFixed(1)} s`);
}
console.log('');

console.log('## trough / recovery (is the curve still moving at the horizon?)');
ids.forEach((id) => {
  const s = shipped[id];
  let minV = Infinity, minY = 0;
  s.forEach((v, i) => { if (v < minV) { minV = v; minY = i + 1; } });
  console.log(`  ${id.padEnd(14)} min ${String(minV).padStart(6)} at y${String(minY).padStart(3)}   final ${String(s[s.length - 1]).padStart(6)}   ${s[s.length - 1] > minV ? `recovered +${s[s.length - 1] - minV}` : 'at/below trough'}`);
});
const realmAt = (y) => ids.reduce((t, id) => t + (shipped[id][y - 1] ?? 0), 0);
const tail = [];
for (let y = Math.max(10, pops.length - 50); y <= pops.length; y += 10) tail.push(`y${y}=${realmAt(y)}`);
console.log(`  realm, last 50 y: ${tail.join('  ')}`);
if (pops.length > 50) {
  const a = realmAt(pops.length - 50), b = realmAt(pops.length);
  console.log(`  realm change over the LAST FIFTY YEARS: ${a} -> ${b} = ${((b / a - 1) * 100).toFixed(1)}%`);
}
