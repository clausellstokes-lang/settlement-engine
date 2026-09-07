/**
 * plateau-extract.mjs — LANE HORIZON-B6, read-only.
 * Turns the 300-year lit case receipt into the plateau chart AS NUMBERS the brief asks for,
 * and re-derives `settlementShapeOf`'s verdict term by term so "other" is explained rather
 * than asserted.
 */
import { readFileSync } from 'node:fs';

const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const RECEIPT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json';

const { settlementShapeOf } = await import(`${DOCK}/scripts/soak/register.mjs`);

const r = JSON.parse(readFileSync(RECEIPT, 'utf8'));
const ids = r.behavioral.settlementIds.map(String);
const yearly = r.behavioral.yearly;

const series = {};
for (const id of ids) series[id] = [];
for (const y of yearly) {
  for (const id of ids) {
    const p = y?.stateVectors?.[id]?.population;
    if (Number.isFinite(Number(p))) series[id].push(Number(p));
  }
}

console.log('# THE 300-YEAR LIT PLATEAU CHART, AS NUMBERS');
console.log(`receipt kind=${r.kind} schemaVersion=${r.schemaVersion} years=${r.years} settlements=${r.settlements}`);
console.log(`seed=${r.seed}`);
console.log(`subsystems.rules.demographicsEnabled = ${r.subsystems?.rules?.demographicsEnabled}   <- the LIT overlay reached the world`);
console.log(`passed = ${r.passed}`);
console.log('');

console.log('## Population at each 25-year mark (the curve)');
const marks = [1, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];
console.log(`${'settlement'.padEnd(10)} ${marks.map((m) => `y${m}`.padStart(7)).join('')}`);
for (const id of ids) {
  const s = series[id];
  console.log(`${id.padEnd(10)} ${marks.map((m) => String(s[m - 1] ?? '').padStart(7)).join('')}`);
}
const realmAt = (m) => ids.reduce((t, id) => t + (series[id][m - 1] ?? 0), 0);
console.log(`${'REALM'.padEnd(10)} ${marks.map((m) => String(realmAt(m)).padStart(7)).join('')}`);
console.log('');

console.log('## settlementShapeOf, term by term (why every shape is "other")');
console.log('   plateau requires |final - centuryAgo| <= 0.05 * |final|');
console.log('   runaway  requires final > centuryAgo * RUNAWAY_MULTIPLE');
const finalDied = Array.isArray(r.finalDiedFlags) ? r.finalDiedFlags : [];
ids.forEach((id, i) => {
  const s = series[id];
  const final = s[s.length - 1];
  const centuryAgo = s[s.length - 1 - 100];
  const halfAgo = s[s.length - 1 - 50];
  const start = s[0];
  const drift = Math.abs(final - centuryAgo);
  const allowed = Math.abs(final || 1) * 0.05;
  const shape = settlementShapeOf(s, { died: Boolean(finalDied[i]) });
  console.log(`  ${id.padEnd(8)} start ${String(start).padStart(6)}  y200 ${String(centuryAgo).padStart(6)}  y250 ${String(halfAgo).padStart(6)}  y300 ${String(final).padStart(6)}`);
  console.log(`  ${''.padEnd(8)} |y300-y200| = ${drift.toFixed(1)}  vs 5% of y300 = ${allowed.toFixed(1)}  ->  ${drift <= allowed ? 'PLATEAU' : `NOT plateau (drift is ${(drift / (allowed || 1)).toFixed(1)}x the window)`}`);
  console.log(`  ${''.padEnd(8)} died=${Boolean(finalDied[i])}  series length=${s.length}  SHAPE = ${shape}`);
});
console.log('');

console.log('## the realm-load reading the tripwire fired on');
const rd = yearly[yearly.length - 1]?.realmDemography;
console.log(JSON.stringify(rd, null, 2));
console.log('');

console.log('## trough and recovery (does the curve turn back up?)');
for (const id of ids) {
  const s = series[id];
  let minV = Infinity; let minY = 0;
  s.forEach((v, i) => { if (v < minV) { minV = v; minY = i + 1; } });
  console.log(`  ${id.padEnd(8)} min ${String(minV).padStart(6)} at year ${String(minY).padStart(3)}   y300 ${String(s[s.length - 1]).padStart(6)}   ${s[s.length - 1] > minV ? `recovered +${s[s.length - 1] - minV}` : 'at or below its trough at the horizon'}`);
}
console.log('');
console.log('## last 50 years, realm total (is it still moving at the horizon?)');
const tail = [];
for (let m = 250; m <= 300; m += 5) tail.push(`y${m}=${realmAt(m)}`);
console.log('  ' + tail.join('  '));
