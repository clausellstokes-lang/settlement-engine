// CLAMP-W1 divergence harness. Object.is throughout — `!==` reports false mismatches on NaN.
const kClamp   = (x, lo, hi) => (Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : lo);
const kClamp01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);

const INPUTS = [
  -1000, -2, -1, -0.5, -0.0001, -0, 0, 0.0001, 0.3, 0.5, 0.9999, 1, 1.5, 2, 100, 1000,
  NaN, Infinity, -Infinity,
  '5', '0.5', '', '  ', 'abc', null, undefined, true, false, {}, [], [0.5],
];
const show = (v) => (Object.is(v, -0) ? '-0' : typeof v === 'string' ? JSON.stringify(v)
  : Array.isArray(v) ? `[${v}]` : v && typeof v === 'object' ? '{}' : String(v));

const LOCALS = {
  // PASSTHROUGH clamp(v,lo,hi) — conquestIntent.js:98, conquestDoctrineStage.js:128
  'conquestIntent/conquestDoctrineStage  clamp(v,lo,hi) passthrough':
    { arity: 3, fn: (value, lo, hi) => (value < lo ? lo : value > hi ? hi : value) },
  // PASSTHROUGH clamp arrow — dispositionProfile.js:28
  'dispositionProfile  clamp(v,lo,hi) passthrough arrow':
    { arity: 3, fn: (value, lo, hi) => (value < lo ? lo : value > hi ? hi : value) },
  // COERCE clamp01 — warCoalitionDecision.js:31
  'warCoalitionDecision  clamp01 Number(v)||0 coerce':
    { arity: 1, fn: (value) => Math.max(0, Math.min(1, Number(value) || 0)) },
  // Number() + isFinite + ternary — conquestExecution.js:139
  'conquestExecution  clamp01 Number()+isFinite+ternary':
    { arity: 1, fn: (value) => { const n = Number(value); if (!Number.isFinite(n)) return 0; return n < 0 ? 0 : n > 1 ? 1 : n; } },
  // num()-inside clamp01 — forceComposition.js:86
  'forceComposition  clamp01 with inner num()':
    { arity: 1, fn: (v) => { const num = (x, d = 0) => (Number.isFinite(Number(x)) ? Number(x) : d); return Math.max(0, Math.min(1, num(v))); } },
  // bare Math.max/min clamp01 — characterConsumers.js:219, knownCharacter.js:128
  'characterConsumers/knownCharacter  clamp01 bare Math.max/min':
    { arity: 1, fn: (v) => Math.max(0, Math.min(1, v)) },
};

const LOHI = [[0, 1], [-1, 1], [0, 3]]; // 0..1, dispositionProfile's -1..1, band index 0..LEN-1

let anyDiff = false;
for (const [name, { arity, fn }] of Object.entries(LOCALS)) {
  const rows = [];
  if (arity === 1) {
    for (const x of INPUTS) {
      const a = fn(x), b = kClamp01(x);
      if (!Object.is(a, b)) rows.push(`    in=${show(x).padEnd(9)} local=${show(a).padEnd(9)} kernel=${show(b)}`);
    }
  } else {
    for (const [lo, hi] of LOHI) for (const x of INPUTS) {
      const a = fn(x, lo, hi), b = kClamp(x, lo, hi);
      if (!Object.is(a, b)) rows.push(`    [${lo},${hi}] in=${show(x).padEnd(9)} local=${show(a).padEnd(9)} kernel=${show(b)}`);
    }
  }
  if (rows.length) { anyDiff = true; console.log(`DIVERGES  ${name}  (${rows.length} inputs)`); rows.forEach((r) => console.log(r)); }
  else console.log(`IDENTICAL ${name}`);
  console.log('');
}
console.log(anyDiff ? 'RESULT: at least one local DIVERGES at function level (expected — that is why call-site neutrality is the bar).'
                    : 'RESULT: all identical at function level.');
