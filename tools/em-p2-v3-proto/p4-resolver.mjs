/**
 * p4-resolver.mjs — THE RESOLVER THE PACKET SPECIFIES, and its proof.
 *
 * ⛔ WHAT THE ARM ACTUALLY NEEDS, and why the offset direction is the wrong one.
 * §21 struck the static idiom scan, so nothing asks "which symbol encloses this call site"
 * any more — that was the model's question and the question its resolver got wrong (STOP S5).
 * Tier 2's arm is EM-A1's I-3 in the other direction: "the declared writer `path#symbol`
 * names a symbol DECLARED IN THAT FILE EXACTLY ONCE". The registerStep awareness is what
 * makes a STEP nameable at all: `assembleInstitutions` is declared nowhere as a function or a
 * const — only as `registerStep('assembleInstitutions', …)` — so the model's form set finds
 * ZERO of the 22 steps, and a register keyed on steps could not name its own writers.
 *
 * ⚠ `codeOnly` BLANKS STRING CONTENTS, so the step's name is gone from the blanked source.
 * Offsets are preserved, so the name is read back from the RAW source at the same index.
 * That is the one subtlety a build lane must not lose.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

globalThis.__EMP2_MINTS__ = null; globalThis.__EMP2_HASH__ = null; globalThis.__EMP2_FNV__ = null;
const { TREE, getStepMeta } = await import('./harness.mjs');
const { codeOnly } = await import(`${TREE}/tests/helpers/codeOnlySource.js`);

/** The declaration forms, each anchored `[ \t]*` — never `\s*` (STOP S5's rider). */
const DECL_FORMS = [
  ['function', /^[ \t]*(?:export[ \t]+)?(?:default[ \t]+)?(?:async[ \t]+)?function[ \t]*\*?[ \t]*([A-Za-z_$][\w$]*)/gm],
  ['binding', /^[ \t]*(?:export[ \t]+)?(?:const|let|var)[ \t]+([A-Za-z_$][\w$]*)[ \t]*=/gm],
  ['class', /^[ \t]*(?:export[ \t]+)?class[ \t]+([A-Za-z_$][\w$]*)/gm],
  ['registerStep', /^[ \t]*registerStep[ \t]*\([ \t]*['"`]/gm],
];

/** @returns {Map<string, number>} every symbol this file DECLARES, and how many times. */
export function declaredSymbols(raw) {
  const code = codeOnly(raw);
  const counts = new Map();
  for (const [kind, re] of DECL_FORMS) {
    re.lastIndex = 0;
    for (const m of code.matchAll(re)) {
      let name = m[1];
      if (kind === 'registerStep') {
        // The name lives in a string literal, which codeOnly blanked. Offsets are preserved,
        // so read it back from RAW at the same index.
        const q = m.index + m[0].length - 1;
        const quote = raw[q];
        const close = raw.indexOf(quote, q + 1);
        if (close < 0) continue;
        name = raw.slice(q + 1, close);
        if (!/^[A-Za-z_$][\w$]*$/.test(name)) continue;
      }
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return counts;
}

/** THE MODEL'S form set, verbatim from tests/lint/chooserTotality.walker.test.js:165. */
function declaredByMODEL(raw) {
  const code = codeOnly(raw);
  const decl = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  const counts = new Map();
  for (const m of code.matchAll(decl)) {
    const name = m[1] || m[2];
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return counts;
}

console.log('=== ARM: every registered STEP is declared EXACTLY ONCE in its own step file ===');
const steps = getStepMeta().map((m) => m.name);
let v3ok = 0; let modelok = 0; const bad = [];
for (const step of steps) {
  const rel = `src/generators/steps/${step}.js`;
  const raw = readFileSync(join(TREE, rel), 'utf8');
  const v3 = declaredSymbols(raw).get(step) || 0;
  const model = declaredByMODEL(raw).get(step) || 0;
  if (v3 === 1) v3ok += 1; else bad.push(`${step}=${v3}`);
  if (model === 1) modelok += 1;
}
console.log(`V3 resolver   : ${v3ok}/${steps.length} steps declared exactly once ${bad.length ? `(NOT: ${bad.join(', ')})` : ''}`);
console.log(`MODEL resolver: ${modelok}/${steps.length} steps declared exactly once  <- the reason the model cannot name a step`);

console.log('\n=== ARM: the declared leaf PRODUCERS resolve, exactly once, in their own module ===');
const PRODUCERS = [
  ['src/generators/npcGenerator.js', 'pickFirst', 'module-local const arrow (never exported) — EM-A1 §1c.1 property 2'],
  ['src/generators/power/rulingStructure.js', 'generatePowerStructure', 'the power card’s producer'],
  ['src/generators/steps/generatePopulation.js', 'generatePopulation', 'a registerStep host'],
  ['src/generators/steps/assembleInstitutions.js', 'assembleInstitutions', 'a registerStep host'],
  ['src/generators/steps/generatePower.js', 'generatePower', 'a registerStep host'],
];
for (const [rel, sym, why] of PRODUCERS) {
  const raw = readFileSync(join(TREE, rel), 'utf8');
  console.log(`${rel}#${sym}\tV3=${declaredSymbols(raw).get(sym) || 0}\tMODEL=${declaredByMODEL(raw).get(sym) || 0}\t(${why})`);
}

console.log('\n=== ANTI-VACUITY: a symbol that does NOT exist must resolve to 0 ===');
for (const [rel, sym] of [
  ['src/generators/steps/generatePower.js', 'generatePowerX'],
  ['src/generators/npcGenerator.js', 'pickSecond'],
]) {
  const raw = readFileSync(join(TREE, rel), 'utf8');
  console.log(`${rel}#${sym}\tV3=${declaredSymbols(raw).get(sym) || 0}  (must be 0)`);
}

console.log('\n=== ANTI-VACUITY: a name that appears ONLY in prose/strings must not be counted ===');
const probe = `
// const ghostInComment = 1;
const real = 'const ghostInString = 2;';
const realTwo = \`registerStep('ghostInTemplate', {\`;
registerStep('actuallyHere', {
  provides: [],
}, () => {});
export function alsoHere() {}
`;
const found = [...declaredSymbols(probe).entries()].map(([k, v]) => `${k}:${v}`).sort();
console.log(`declared = [${found.join(' , ')}]`);
console.log(`ghostInComment absent? ${!declaredSymbols(probe).has('ghostInComment')}`);
console.log(`ghostInString absent?  ${!declaredSymbols(probe).has('ghostInString')}`);
console.log(`ghostInTemplate absent? ${!declaredSymbols(probe).has('ghostInTemplate')}`);
console.log(`actuallyHere = ${declaredSymbols(probe).get('actuallyHere')} ; alsoHere = ${declaredSymbols(probe).get('alsoHere')}`);

// ── the registration cost: the lighting census's own denominator ─────────────
console.log('\n=== REGISTER MOVE: the sovereignty-lighting census denominator, measured ===');
const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const testFiles = walk(join(TREE, 'tests')).filter((p) => /\.test\.jsx?$/.test(p));
console.log(`test files under tests/ matching /\\.test\\.jsx?$/ = ${testFiles.length}`);
const lint = testFiles.filter((p) => relative(TREE, p).startsWith('tests/lint/'));
console.log(`of which tests/lint/ = ${lint.length}`);
