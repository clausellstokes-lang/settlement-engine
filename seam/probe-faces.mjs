import { drawFace } from '../laneSEAM/src/domain/display/stateProse/stateProseKernel.js';
const four = { text: 'a', wordings: ['b', 'c', 'd'] };
const one = { text: 'a' };
const N = 10000;
for (const [label, prefix] of [['seed-', 'seed-'], ['town-', 'town-'], ['s', 's']]) {
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < N; i += 1) counts[drawFace(four, 'DS-DEF-11', 'UNWALLED-SMALL', `${prefix}${i}`)] += 1;
  const se = Math.sqrt(0.25 * 0.75 / N);
  const dev = counts.map((c) => Math.abs(c / N - 0.25) / se);
  console.log(label, JSON.stringify(counts), 'maxSE=', Math.max(...dev).toFixed(3));
}
console.log('seedless four-face:', drawFace(four, 'B', 'P', ''), drawFace(four, 'B', 'P', null), drawFace(four, 'B', 'P', undefined));
console.log('one-face any seed:', new Set(Array.from({ length: 500 }, (_, i) => drawFace(one, 'B', 'P', `s${i}`))));
console.log('2 SE window at N=10000:', (2 * Math.sqrt(0.25 * 0.75 / N) * N).toFixed(2), 'counts around 2500');
