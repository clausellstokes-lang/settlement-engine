// probe-wiring3.mjs — classify the UNMATCHED pools of MOUNTED blocks by where (if anywhere)
// their key literal lives in the composer source. READ-ONLY.
import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const COMPOSERS = ['generalStateProse', 'powerStateProse', 'economyStateProse', 'defenseStateProse', 'stressorsStateProse', 'warFaithStateProse']
  .map((n) => `src/domain/display/stateProse/${n}.js`);
const srcs = new Map(COMPOSERS.map((r) => [r, readFileSync(path.join(D, r), 'utf8')]));

function balanced(src, open) {
  const p = { '(': ')', '{': '}', '[': ']' };
  if (!p[src[open]]) throw new Error('nb');
  let d = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; if (i < 1) break; continue; }
    if (c === "'" || c === '"' || c === '`') { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; } continue; }
    if ('({['.includes(c)) d++;
    else if (')}]'.includes(c)) { d--; if (d === 0) return { inner: src.slice(open + 1, i), end: i }; }
  }
  throw new Error('unbalanced');
}
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');

const fns = [];
for (const [rel, src] of srcs) {
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*[Pp]oolKey)\s*\(/g)) {
    const open = m.index + m[0].length - 1;
    let a; try { a = balanced(src, open); } catch { continue; }
    const br = src.indexOf('{', a.end);
    let b; try { b = balanced(src, br); } catch { continue; }
    fns.push({ rel, name: m[1], body: strip(b.inner) });
  }
}
const forms = [];
for (const fn of fns) {
  for (const m of fn.body.matchAll(/'((?:[^'\\]|\\.)*)'/g)) forms.push({ fn: fn.name, kind: 'lit', text: m[1] });
  for (const m of fn.body.matchAll(/`((?:[^`\\]|\\.)*)`/g)) {
    const raw = m[1];
    if (!raw.includes('${')) { forms.push({ fn: fn.name, kind: 'lit', text: raw }); continue; }
    const holes = [];
    const pat = raw.replace(/\$\{([^}]*)\}/g, (_, e) => { holes.push(e.trim()); return ' '; });
    forms.push({ fn: fn.name, kind: 'tpl', pat, holes });
  }
}
function matched(k) {
  for (const f of forms) if (f.kind === 'lit' && f.text === k) return true;
  for (const f of forms) {
    if (f.kind !== 'tpl') continue;
    const parts = f.pat.split(' ');
    const re = new RegExp(`^${parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)')}$`);
    if (re.test(k)) return true;
  }
  return false;
}

const gdir = path.join(D, 'src/data/dossierStateProse');
const poolsOf = new Map();
for (const f of readdirSync(gdir).filter((x) => x.endsWith('.generated.js')).sort()) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href);
  const t = Object.values(mod)[0];
  for (const [b, v] of Object.entries(t)) poolsOf.set(b, Object.keys(v.pools || {}));
}
const mounts = await import(pathToFileURL(path.join(D, 'src/domain/display/stateProse/dossierMounts.js')).href);
const UN = new Set(mounts.UNMOUNTED_BLOCKS);

const reasons = new Map();
const examples = new Map();
for (const [block, ks] of poolsOf) {
  if (UN.has(block)) continue;
  for (const k of ks) {
    if (matched(k)) continue;
    let where = 'NOWHERE in any composer source';
    for (const [, src] of srcs) {
      let idx = src.indexOf(`'${k}'`);
      if (idx < 0) idx = src.indexOf(`\`${k}\``);
      if (idx < 0) continue;
      const before = src.slice(0, idx);
      const cd = before.lastIndexOf('\nconst ');
      const fd = before.lastIndexOf('\nfunction ');
      const efd = before.lastIndexOf('\nexport function ');
      where = (cd > fd && cd > efd)
        ? `a module-level const (${(src.slice(cd + 7, cd + 60).match(/^([A-Za-z_$][\w$]*)/) || ['', '?'])[1]})`
        : `a non-PoolKey function (${(src.slice(Math.max(fd, efd)).match(/function\s+([A-Za-z_$][\w$]*)/) || ['', '?'])[1]})`;
      break;
    }
    reasons.set(where, (reasons.get(where) || 0) + 1);
    if (!examples.has(where)) examples.set(where, `${block} :: ${k}`);
  }
}
const rows = [...reasons].sort((a, b) => b[1] - a[1]);
console.log('unmatched pools in MOUNTED blocks, by where the key literal lives:');
let tot = 0;
for (const [w, n] of rows) { tot += n; console.log(`  ${String(n).padStart(4)}  ${w}   e.g. ${examples.get(w)}`); }
console.log(`  total ${tot}`);
