// usage: node budgets.mjs <ref> <slow-all.tsv> : for every slow row, find its it() by its full title chain in the file at <ref>
// and report the budget in force: the it's own (3rd arg number / options.timeout), else the nearest describe's, else a file-level
// vi.setConfig({testTimeout}), else the default 20000. Prints part, file, ms, budget-source, budget, line, matched title.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/settlement-engine/package.json');
const { parse } = require('@babel/parser');
const [ref, tsv] = process.argv.slice(2);
const rows = readFileSync(tsv, 'utf8').trim().split('\n').map((l) => l.split('\t'));
const cache = new Map();
const isTestCall = (c) => {
  let x = c.callee; const names = [];
  while (x) { if (x.type === 'Identifier') { names.unshift(x.name); break; } if (x.type === 'MemberExpression') { names.unshift(x.property.name); x = x.object; } else if (x.type === 'CallExpression') { x = x.callee; } else break; }
  if (['it', 'test', 'describe'].includes(names[0])) return names[0] === 'describe' ? 'describe' : 'it';
  return null;
};
const strOf = (n) => {
  if (!n) return null;
  if (n.type === 'StringLiteral') return n.value;
  if (n.type === 'TemplateLiteral') return n.quasis.map((q) => q.value.cooked).join('\u0000');
  if (n.type === 'BinaryExpression' && n.operator === '+') { const a = strOf(n.left), b = strOf(n.right); return (a ?? '\u0000') + (b ?? '\u0000'); }
  return '\u0000';
};
const numOf = (n) => (n && n.type === 'NumericLiteral' ? n.value : null);
const timeoutIn = (args) => {
  for (const a of args.slice(1)) {
    if (numOf(a) != null) return [numOf(a), 'number'];
    if (a && a.type === 'ObjectExpression') for (const p of a.properties) if (p.key && (p.key.name === 'timeout' || p.key.value === 'timeout')) return [numOf(p.value) ?? 'EXPR', 'options'];
    if (a && a.type === 'Identifier') return ['IDENT:' + a.name, 'ident'];
    if (a && a.type === 'MemberExpression') return ['EXPR', 'expr'];
  }
  return [null, null];
};
function tests(file) {
  if (cache.has(file)) return cache.get(file);
  let src = ''; try { src = execFileSync('git', ['show', `${ref}:${file}`], { cwd: '/home/user/settlement-engine', encoding: 'utf8', maxBuffer: 1e8 }); } catch { cache.set(file, null); return null; }
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx', 'typescript'], errorRecovery: true });
  const out = []; let fileCfg = null;
  const m = src.match(/vi\.setConfig\(\{[^}]*testTimeout:\s*([\d_]+)/); if (m) fileCfg = Number(m[1].replace(/_/g, ''));
  const walk = (node, chain, dBudget) => {
    if (!node || typeof node.type !== 'string') return;
    if (node.type === 'CallExpression') {
      const k = isTestCall(node);
      if (k) {
        const t = strOf(node.arguments[0]) ?? '\u0000'; const [b] = timeoutIn(node.arguments);
        if (k === 'it') out.push({ title: [...chain, t].join(' '), own: b, desc: dBudget, line: node.loc.start.line });
        else { for (const a of node.arguments.slice(1)) walk(a, [...chain, t], b ?? dBudget); return; }
      }
    }
    for (const key of Object.keys(node)) { if (key === 'loc' || key === 'start' || key === 'end') continue; const v = node[key]; if (Array.isArray(v)) v.forEach((c) => walk(c, chain, dBudget)); else if (v && typeof v.type === 'string') walk(v, chain, dBudget); }
  };
  walk(ast.program, [], null);
  const r = { out, fileCfg }; cache.set(file, r); return r;
}
const compat = (cand, row) => {
  // cand: the it's full title with \u0000 for each computed part; row: the census's title, cut at 140 chars
  const cut = row.length >= 139; const segs = cand.split('\u0000');
  const go = (i, p) => {
    if (i === segs.length) return p === row.length;
    const seg = segs[i]; const wild = i > 0;
    const tryAt = (q) => {
      const rest = row.slice(q);
      if (rest.startsWith(seg)) return go(i + 1, q + seg.length) || (wild === false && false);
      return cut && seg.startsWith(rest);
    };
    if (!wild) return tryAt(p);
    for (let q = p; q <= row.length; q++) if (tryAt(q)) return true;
    return false;
  };
  return go(0, 0) || (segs.length > 1 && segs[segs.length - 1] === '' && go(0, 0));
};
const rx = (t) => new RegExp('^' + t.split('\u0000').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*?'), 's');
for (const [part, file, title, ms, heur] of rows) {
  const r = tests(file); if (!r) { console.log([part, file, ms, heur, 'NOFILE', '', '', title].join('\t')); continue; }
  const all = r.out.filter((t) => compat(t.title, title));
  const lit = (t) => t.title.replace(/\u0000/g, '').length;
  const best = Math.max(0, ...all.map(lit));
  const seen = new Set(); const hits = all.filter((t) => lit(t) === best).filter((t) => { const k = t.line + ':' + t.own; if (seen.has(k)) return false; seen.add(k); return true; });
  const eff = (h) => (h.own != null ? ['own', h.own] : h.desc != null ? ['describe', h.desc] : r.fileCfg != null ? ['file', r.fileCfg] : ['default', 20000]);
  if (!hits.length) { console.log([part, file, ms, heur, 'NOMATCH', '', '', title].join('\t')); continue; }
  const effs = new Set(hits.map((h) => eff(h).join(':')));
  if (effs.size !== 1) { console.log([part, file, ms, heur, 'AMBIG' + hits.length, [...effs].join('|'), hits.map((h) => h.line).join(','), title].join('\t')); continue; }
  const [src, b] = eff(hits[0]);
  console.log([part, file, ms, heur, src + (hits.length > 1 ? '~' + hits.length : ''), b, hits.map((h) => h.line).join(','), title].join('\t'));
}
