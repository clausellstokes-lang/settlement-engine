import { drawFace, hashKey } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/domain/display/stateProse/stateProseKernel.js';

// 1. one-face variant takes no hash: spy on Math.imul
const realImul = Math.imul;
let calls = 0;
Math.imul = (a, b) => { calls += 1; return realImul(a, b); };
const one = { text: 'x' };
for (let i = 0; i < 100; i += 1) drawFace(one, 'DS-X-1', 'POOL', `seed-${i}-a-very-long-seed-string`);
const oneFaceCalls = calls;
calls = 0;
const four = { text: 'x', wordings: ['a', 'b', 'c'] };
drawFace(four, 'DS-X-1', 'POOL', 'seed-1');
const fourFaceCalls = calls;
Math.imul = realImul;
console.log('one-face imul calls over 100 draws:', oneFaceCalls, '| four-face imul calls on 1 draw:', fourFaceCalls);

// 2. seedless returns 0 at all three spellings
console.log('seedless:', ['', null, undefined].map((s) => drawFace(four, 'B', 'P', s)).join(','));

// 3. uniformity over 10000 seeds
const counts = [0, 0, 0, 0];
for (let i = 0; i < 10000; i += 1) counts[drawFace(four, 'DS-X-1', 'POOL', `seed-${i}`)] += 1;
const se = Math.sqrt(10000 * 0.25 * 0.75);
const worst = Math.max(...counts.map((c) => Math.abs(c - 2500) / se));
console.log('10000 seeds four faces:', counts.join(' / '), '| worst deviation SE:', worst.toFixed(3));

// 4. the suffix is ::w — independent reference fold
let ok = true; let wrongSpelling = 0;
for (let i = 0; i < 500; i += 1) {
  const seed = `seed-${i}`;
  const ref = hashKey(`${seed}::DS-X-1::POOL::w`) % 4;
  if (drawFace(four, 'DS-X-1', 'POOL', seed) !== ref) ok = false;
  if (hashKey(`${seed}::DS-X-1::POOL::wording`) % 4 !== ref) wrongSpelling += 1;
}
console.log('suffix ::w matches independent fold on 500 seeds:', ok, '| ::wording differs on', wrongSpelling, 'of 500');
