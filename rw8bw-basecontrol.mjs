/**
 * REWRITE car 8b-W — THE BASE CONTROL (lane instrument, never committed).
 *
 * Imports the desk AT `f73bdbf16` beside the desk at the working tree and sweeps the FIVE key
 * functions this car tables over their whole input domain, printing every input on which the
 * two disagree. The base copy is written into the desk directory (its relative imports have to
 * resolve) and REMOVED before the process exits, in a `finally`.
 *
 *   node rw8bw-basecontrol.mjs
 */
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

const LANE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW';
const REL = 'src/domain/display/stateProse/defenseStateProse.js';
const BASE_REL = 'src/domain/display/stateProse/defenseStateProse.BASE8bW.js';
const BASE_ABS = `${LANE}/${BASE_REL}`;
const BASE_SHA = 'f73bdbf16';

const SCORES = [-1e9, -1, -0.5, 0, 19, 19.9, 20, 39, 39.9, 40, 64, 64.9, 65, 99, 100, 1e9,
  NaN, Infinity, -Infinity, '50', null, undefined, true, {}, [], '', 'x'];
const LABELS = [
  'Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous',
  'Controlled — Authoritarian', 'Dangerous — Criminal Governance', 'Tense — Active Siege',
  'Desperate — Famine Conditions', 'Controlled — Occupation Curfew + Famine Conditions',
  'Strained – Plague', 'Tense — Some Future Crisis',
  // The two DS-DEF-3 pool keys that are NOT labels: the inputs a corpus-roster guard and a
  // key table answer differently, which is the whole point of listing them.
  'COMPOUND override (a crisis stress has rewritten the label)',
  'First-Survey qualification (the reading is a first look)',
  // Object.prototype keys: a bare index on a plain object answers with an inherited value.
  'constructor', 'toString', '__proto__', 'hasOwnProperty', 'valueOf', 'isPrototypeOf',
  ' Very Safe ', 'very safe', 'VERY SAFE', 'Saf', 'Safest', 'Placid', '', '   ',
  null, undefined, 0, false, true, 42, [], {}, ['Safe'],
];
const CAPTURES = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture',
  'capture capture', 'None', ' none ', 'nonsense', 'constructor', 'toString', '__proto__',
  '', null, undefined, 0, false, true, 42, [], {}];
const ACCESS = ['road', 'port', 'isolated', 'Port', ' port ', 'river', 'constructor',
  '__proto__', '', null, undefined, 0, false, true, 42, [], {}];
const FLAGS = [true, false, 0, 1, '', 'x', null, undefined, NaN, [], {}];

/** @param {object} m the desk module @returns {string[]} */
function sweep(m) {
  const rows = [];
  for (const n of SCORES) rows.push(`posture|${String(n)}|${String(m.posturePoolKey(n))}`);
  for (const l of LABELS) {
    rows.push(`publicOrder|${String(l)}|${String(m.publicOrderPoolKey(l))}`);
    rows.push(`firstSurvey|${String(l)}|${String(m.firstSurveyPoolKey(l))}`);
  }
  for (const c of CAPTURES) rows.push(`capture|${String(c)}|${String(m.criminalCapturePoolKey(c))}`);
  for (const g of FLAGS) {
    for (const p of FLAGS) {
      for (const a of ACCESS) {
        rows.push(`supply|${String(g)}|${String(p)}|${String(a)}|${String(m.supplyLogisticsPoolKey(g, p, a))}`);
      }
    }
  }
  return rows;
}

try {
  const src = execFileSync('git', ['-C', LANE, 'show', `${BASE_SHA}:${REL}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  writeFileSync(BASE_ABS, src);
  const base = await import(BASE_ABS);
  const tip = await import(`${LANE}/${REL}`);
  const a = sweep(base);
  const b = sweep(tip);
  const bad = [];
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) bad.push(`${a[i]}\n        TIP: ${b[i]}`);
  console.log(`[base-control] ${BASE_SHA} vs the working tree — ${a.length} inputs swept, `
    + `${bad.length} differ`);
  for (const line of bad) console.log(`    BASE: ${line}`);
} finally {
  rmSync(BASE_ABS, { force: true });
}
