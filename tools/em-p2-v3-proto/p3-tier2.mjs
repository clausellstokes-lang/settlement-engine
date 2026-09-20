/**
 * p3-tier2.mjs — (A) the registerStep-AWARE SYMBOL RESOLVER, designed here and proven against
 * the two sites the EM-P2 v2 STOP named as mis-attributed by the model's resolver; and
 * (B) Tier 2's arms measured: path resolution on generated records, and `origin` by execution.
 */
import { readFileSync } from 'node:fs';

globalThis.__EMP2_MINTS__ = null;
globalThis.__EMP2_HASH__ = null;
globalThis.__EMP2_FNV__ = null;

const { TREE, getStepMeta, instrumentedRoot, runHeadless } = await import('./harness.mjs');
const { codeOnly } = await import(`${TREE}/tests/helpers/codeOnlySource.js`);
const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);

// ════════════════════════════════════════════════════════════════════════════
// (A) THE RESOLVER
// ════════════════════════════════════════════════════════════════════════════
/**
 * Every DECLARATION FORM this tree hosts a chooser in, anchored at a line start with
 * `[ \t]*` — never `\s*`, which under /m eats the preceding newlines (the STOP's S5 rider).
 * ⛔ `registerStep('<name>'` IS A DECLARATION FORM. A generation chooser lives inside the
 * step's callback — an argument arrow with no binding — so a "nearest preceding declaration"
 * resolver walks back PAST the call and names whatever const happens to sit above it.
 */
const DECL_FORMS = [
  { kind: 'function', re: /^[ \t]*(?:export[ \t]+)?(?:default[ \t]+)?(?:async[ \t]+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/gm },
  { kind: 'binding', re: /^[ \t]*(?:export[ \t]+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm },
  { kind: 'class', re: /^[ \t]*(?:export[ \t]+)?class\s+([A-Za-z_$][\w$]*)/gm },
  { kind: 'registerStep', re: /^[ \t]*registerStep\s*\(\s*['"`]/gm },
];

/** Balanced-extent scan over the BLANKED code, so a brace inside a string cannot confuse it. */
function extentFrom(code, start) {
  let depth = 0; let opened = false;
  for (let i = start; i < code.length; i += 1) {
    const c = code[i];
    if (c === '{' || c === '(' || c === '[') { depth += 1; opened = true; continue; }
    if (c === '}' || c === ')' || c === ']') {
      depth -= 1;
      if (opened && depth <= 0) {
        let j = i + 1;
        while (j < code.length && (code[j] === ' ' || code[j] === '\t')) j += 1;
        return code[j] === ';' ? j : i;
      }
      continue;
    }
    if (!opened && c === ';') return i;
    if (!opened && c === '\n' && code.slice(start, i).includes('=')) return i;
  }
  return code.length;
}

/**
 * The enclosing symbol at an offset: the INNERMOST declaration whose balanced extent contains
 * it. `raw` is needed because `codeOnly` blanks string CONTENTS — the step's own name lives in
 * a string literal, and offsets are preserved, so the name is read from `raw` at the same index.
 * @returns {string|null} the symbol, or null for module scope.
 */
export function enclosingSymbolV3(raw) {
  const code = codeOnly(raw);
  const decls = [];
  for (const { kind, re } of DECL_FORMS) {
    re.lastIndex = 0;
    for (const m of code.matchAll(re)) {
      let name = m[1];
      if (kind === 'registerStep') {
        const q = m.index + m[0].length - 1;
        const quote = raw[q];
        const close = raw.indexOf(quote, q + 1);
        if (close < 0) continue;
        name = raw.slice(q + 1, close);
      }
      if (!name) continue;
      decls.push({ kind, name, start: m.index, end: extentFrom(code, m.index) });
    }
  }
  return (index) => {
    let best = null;
    for (const d of decls) {
      if (d.start > index || d.end < index) continue;
      if (!best || (d.end - d.start) < (best.end - best.start)) best = d;
    }
    return best ? best.name : null;
  };
}

/** THE MODEL'S resolver, copied verbatim from tests/lint/chooserTotality.walker.test.js:165. */
function enclosingSymbolMODEL(code, index) {
  const decl = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  let best = null;
  for (const m of [...code.matchAll(decl)]) {
    if (m.index > index) break;
    best = m[1] || m[2];
  }
  return best;
}

const PROBES = [
  ['src/generators/steps/resolveConfig.js', "rng.fork('cultural-identity')", 'resolveConfig', 'CULTURES'],
  ['src/generators/steps/assembleInstitutions.js', 'rng.fork(`exclusiveCoexist::', 'assembleInstitutions', 'collapseUpgradeChains'],
  ['src/generators/npcGenerator.js', 'const pickFirst = (', 'pickFirst', 'pickFirst'],
  ['src/generators/power/rulingStructure.js', 'governingName:', 'generatePowerStructure', '(model)'],
];
console.log('=== (A) THE registerStep-AWARE RESOLVER vs THE MODEL ===');
console.log('file\tsite\tline\tV3 says\tMODEL says\texpected\tV3 OK?');
for (const [rel, needle, expected] of PROBES) {
  const raw = readFileSync(`${TREE}/${rel}`, 'utf8');
  const idx = raw.indexOf(needle);
  const line = raw.slice(0, idx).split('\n').length;
  const v3 = enclosingSymbolV3(raw)(idx);
  const model = enclosingSymbolMODEL(codeOnly(raw), idx);
  console.log(`${rel.split('/').pop()}\t${JSON.stringify(needle.slice(0, 28))}\t${line}\t${v3}\t${model}\t${expected}\t${v3 === expected}`);
}

console.log('\n=== (A2) the resolver over EVERY registerStep host: does each step name resolve inside its own callback? ===');
const STEP_FILES = getStepMeta().map((m) => m.name);
let ok = 0; let bad = [];
for (const step of STEP_FILES) {
  const rel = `src/generators/steps/${step}.js`;
  let raw;
  try { raw = readFileSync(`${TREE}/${rel}`, 'utf8'); } catch { bad.push(`${step}: no ${rel}`); continue; }
  const code = codeOnly(raw);
  const at = code.indexOf('registerStep');
  // a point INSIDE the callback: the last `rng` or the closing of the registration
  const inside = raw.indexOf('\n', raw.indexOf('fn:', at) >= 0 ? raw.indexOf('fn:', at) : at + 40);
  const resolved = enclosingSymbolV3(raw)(inside);
  if (resolved === step) ok += 1; else bad.push(`${step} -> ${resolved}`);
}
console.log(`steps whose in-callback offset resolves to the step name: ${ok}/${STEP_FILES.length}`);
if (bad.length) console.log(`  NOT: ${bad.join(' , ')}`);

// ════════════════════════════════════════════════════════════════════════════
// (B) TIER 2 — paths, occupancy, origin
// ════════════════════════════════════════════════════════════════════════════
const FIELDS = [
  ['institution', 'institutions[].name', 'assembleInstitutions', 'institutions'],
  ['institution', 'institutions[].category', 'assembleInstitutions', 'institutions'],
  ['institution', 'institutions[].state', 'assembleInstitutions', 'institutions'],
  ['npc', 'npcs[].name', 'generatePopulation', 'npcs'],
  ['npc', 'npcs[].role', 'generatePopulation', 'npcs'],
  ['npc', 'npcs[].status', 'generatePopulation', 'npcs'],
  ['faction', 'powerStructure.factions[].faction', 'generatePower', 'powerStructure'],
  ['faction', 'powerStructure.factions[].category', 'generatePower', 'powerStructure'],
  ['faction', 'powerStructure.factions[].power', 'generatePower', 'powerStructure'],
  ['powerSeat', 'powerStructure.governingName', 'generatePower', 'powerStructure'],
  ['powerSeat', 'powerStructure.factions[].isGoverning', 'generatePower', 'powerStructure'],
  ['powerSeat', 'powerStructure.seats[].holder', 'generatePower', 'powerStructure'],
];

/** Resolve `a.b[].c` against a record; returns the array of values found (empty = ABSENT). */
function resolvePath(root, path) {
  let nodes = [root];
  for (const seg of path.split('.')) {
    const arr = seg.endsWith('[]');
    const key = arr ? seg.slice(0, -2) : seg;
    const next = [];
    for (const n of nodes) {
      if (n === null || n === undefined || typeof n !== 'object') continue;
      const v = n[key];
      if (v === undefined) continue;
      if (arr) { if (Array.isArray(v)) next.push(...v); } else next.push(v);
    }
    nodes = next;
  }
  return nodes.filter((v) => v !== undefined);
}
const valuesOf = (record, path) => JSON.stringify(resolvePath(record, path));

const ALL = goldenCorpus();
const seenT = new Set(); const SAMPLE = [];
for (const r of ALL.slice(0, 504)) {
  const k = `${r.settType}|${r.terrainOverride}`;
  if (seenT.has(k)) continue; seenT.add(k); SAMPLE.push(r);
}
console.log(`\n=== (B) Tier 2 over ${SAMPLE.length} rows (every tier x terrain once) ===`);

const HOLDERS = [...new Set(FIELDS.map((f) => f[2]))];
const ALLSTEPS = getStepMeta().map((m) => m.name);
const occ = new Map(FIELDS.map((f) => [f[1], { rows: 0, values: 0 }]));
const movedByHolder = new Map(FIELDS.map((f) => [f[1], 0]));
const movedByAny = new Map(FIELDS.map((f) => [f[1], new Map()]));

for (const row of SAMPLE) {
  const base = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  for (const [, path] of FIELDS) {
    const vals = resolvePath(base, path);
    if (vals.length) { occ.get(path).rows += 1; occ.get(path).values += vals.length; }
  }
  for (const step of ALLSTEPS) {
    const per = runHeadless(row, instrumentedRoot(row._seed, { perturbStep: step }).root).settlement;
    for (const [, path, holder] of FIELDS) {
      if (valuesOf(base, path) === valuesOf(per, path)) continue;
      const m = movedByAny.get(path);
      m.set(step, (m.get(step) || 0) + 1);
      if (step === holder) movedByHolder.set(path, movedByHolder.get(path) + 1);
    }
  }
}

console.log('\ncard\toutputKey\tholding (step,key)\tresolves\tvalues\tmoves under HOLDER\torigin\tmoved-by (top 5)');
for (const [card, path, holder, key] of FIELDS) {
  const o = occ.get(path);
  const top = [...movedByAny.get(path).entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([s, n]) => `${s}:${n}`).join(' ');
  const origin = o.rows === 0 ? 'n/a (ABSENT)' : (movedByHolder.get(path) > 0 ? 'drawn' : 'computed');
  console.log(`${card}\t${path}\t(${holder},${key})\t${o.rows}/${SAMPLE.length}\t${o.values}\t${movedByHolder.get(path)}/${SAMPLE.length}\t${origin}\t${top || '(none)'}`);
}
console.log(`\nHOLDERS probed: ${HOLDERS.join(', ')} ; all ${ALLSTEPS.length} steps perturbed per row`);
