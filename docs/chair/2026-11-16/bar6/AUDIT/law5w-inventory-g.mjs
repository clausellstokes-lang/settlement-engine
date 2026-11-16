// BAR6-AUDIT-G · LAW 5 WIDENED · THE STATIC INVENTORY OF EVERY PRESUMPTION IN EVERY POOL THAT PRINTS.
//   node law5w-inventory-g.mjs <tree-root> <out.json> [--render <PAGE-COPY render dir>]
// Widens BAR5-AUDIT-B's `bar5/AUDIT/law5-inventory.mjs` (read, not edited: its literal scanner and its channel
// reading are copied here) from the crisis words to THIRTEEN CLASSES (`CLASSES` below): the six crisis classes of
// law 5 (outside, plenty, work, animals, iron, law) and SIZE, GOODS, EASE, THREAT, OFFICE, SOVEREIGN, RESOURCE.
// Every prose line (four words or more) of src/ (tests out) is read once:
//   the STATE ANNEX (`src/data/dossierStateProse/*.generated.js`) structurally: block, pool, variant, its `marks`,
//     the pool's `poolMeta` (`colour`, `crisisScoped`, `declares`);
//   every other file by its literals, each with the declaration of its own object (`needs`, `excludes`, `crisis`,
//     `twinOf`, `colour`, `tags`), the declaration channels of `scripts/lib/table-pools.mjs` (sibling sets, columns),
//     a `declaredSet(...)` around it, and its pool's own key gate (an arrival sense keyed by a house or a trade).
// For EVERY CLASS a line's words fall in, it reads whether the line DECLARES FOR THAT CLASS: an atom of a dimension
// that answers the class (`CLASS_DIMS`), a twin (the crisis classes), a crisis-scoped pool (the crisis classes), a
// tier word in its pool's key (size), a house or trade key gate (goods, resource, iron, animals). Statuses a class:
//   declared · twin · scoped · gate · keyed       declared for the class
//   any      the line writes only `crisis: any` ("safe under every condition") for a crisis class: a CLAIM, unearned
//   colour   the line or its pool is ruled "presumes nothing" while it holds a class word: a claim the lexicon disputes
//   other    the line declares atoms, none of them for this class
//   none     the line declares nothing at all
// THE TRUE STOCK of a class = any + colour + other + none (no declaration answers the class).
// --render: each line is looked for in the render's dumps (its longest fixed fragment, 18 characters or more):
//   `printed` = the towns whose page prints it. Static otherwise: no town is born.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const [treeArg, outPath] = argv;
const opt = (k) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : null; };
if (!treeArg || !outPath) { console.error('usage: law5w-inventory-g.mjs <tree> <out.json> [--render <dir>]'); process.exit(2); }
const TREE = path.resolve(treeArg);
const imp = async (rel) => import(pathToFileURL(path.join(TREE, rel)).href);

const LEX = (await import(pathToFileURL(path.join(path.dirname(new URL(import.meta.url).pathname), '../../../../../tests/helpers/pageLaws/law5w.mjs')).href)).makeLaw5w(await imp('src/domain/facts/factVocabulary.js'));
const { CLASSES, CLASS_DIMS, statusFor, DECLARED, BOUND_FILES, TIER_KEY, classesOf } = LEX;

// ---- the literal scanner and the enclosing object (BAR5-AUDIT-B's, copied verbatim in behaviour)
function literals(src) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1, depth = 0;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (c === '`' && src[j] === '$' && src[j + 1] === '{') { depth++; j += 2; continue; }
        if (c === '`' && depth && src[j] === '}') { depth--; j++; continue; }
        if (!depth && src[j] === c) break;
        if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      out.push({ start: i, end: j + 1, text: src.slice(i + 1, j) }); i = j + 1; continue;
    }
    i++;
  }
  return out;
}
function enclosingObject(masked, start, end) {
  let depth = 0, a = -1;
  for (let k = start - 1; k >= Math.max(0, start - 4000); k--) {
    const ch = masked[k];
    if (ch === '}' || ch === ']' || ch === ')') depth++;
    else if (ch === '{' || ch === '[' || ch === '(') { if (depth === 0) { if (ch === '{') { a = k; break; } if (ch === '[') return null; } else depth--; }
  }
  if (a < 0) return null;
  depth = 0;
  for (let k = a; k < Math.min(masked.length, end + 4000); k++) { const ch = masked[k]; if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return [a, k + 1]; } }
  return null;
}
const poolOf = (src, at) => { const m = [...src.slice(0, at).matchAll(/^(?:export\s+)?(?:const|let|function)\s+([A-Za-z_$][\w$]*)/gm)].pop(); return m ? m[1] : '(module)'; };
const subKeyOf = (src, at) => {
  const lines = src.slice(Math.max(0, at - 30000), at).split('\n'); let key = '', sub = '';
  for (let k = lines.length - 2; k >= 0 && k > lines.length - 600; k--) {
    const L = lines[k];
    const km = L.match(/\{\s*key:\s*'([^']+)'/); if (km) { key = km[1]; break; }
    if (!sub) { const sm = L.match(/^\s{2,8}['"]?([A-Za-z_][\w &:,'-]{0,40}?)['"]?\s*:\s*[[{]\s*(\/\/.*)?$/); if (sm) sub = sm[1]; }
    if (/^(export\s+)?(const|let|function)\s/.test(L)) break;
  }
  return [key, sub].filter(Boolean).join('/');
};

const walk = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(__tests__|__mocks__)$/.test(e.name)) walk(p, acc); } else if (/\.(js|jsx|mjs)$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) acc.push(p); } return acc; };

// ---- the declaration channels (sibling sets and columns), read live
const { DECLARATION_CHANNELS } = await imp('scripts/lib/table-pools.mjs');
const chan = new Map();
for (const c of DECLARATION_CHANNELS) {
  let mod; try { mod = await imp(c.module); } catch (e) { console.error(`channel ${c.module} :: ${c.name} not loaded: ${e.message}`); continue; }
  const t = mod[c.name]; if (!t) continue;
  for (const [text, v] of Object.entries(t)) {
    if (c.kind === 'siblings') {
      const set = Array.isArray(v) ? v : [];
      const hasTwin = set.some((x) => typeof x?.twinOf === 'string');
      const own = set.find((x) => x?.text === text) || {};
      chan.set(text, { kind: 'siblings', twin: hasTwin, atoms: [...(own.needs || []), ...(own.excludes || []).map((a) => `no ${a}`), ...(own.crisis || []).map((x) => (/^crisis:/.test(x) ? x : `crisis: ${x}`))], colour: own.colour === true });
      for (const x of set) if (typeof x?.text === 'string' && x.text !== text) chan.set(x.text, { kind: 'siblings', twin: true, atoms: [...(x.needs || []), ...(x.excludes || []).map((a) => `no ${a}`), ...(x.crisis || []).map((y) => (/^crisis:/.test(y) ? y : `crisis: ${y}`))] });
    } else chan.set(text, { kind: 'column', atoms: [...(v?.needs || []), ...(v?.excludes || []).map((a) => `no ${a}`), ...(v?.crisis || []).map((y) => (/^crisis:/.test(y) ? y : `crisis: ${y}`))], colour: v?.colour === true });
  }
}

const rows = [];
const push = (r) => { r.classes = classesOf(r.text); r.status = Object.fromEntries(r.classes.map((c) => [c, statusFor(c, r.decl)])); rows.push(r); };

// ---- A: the state annex, structurally
const ANNEX = { defense: 'DOSSIER_STATE_PROSE_DEFENSE', economy: 'DOSSIER_STATE_PROSE_ECONOMY', general: 'DOSSIER_STATE_PROSE_GENERAL', power: 'DOSSIER_STATE_PROSE_POWER', stressors: 'DOSSIER_STATE_PROSE_STRESSORS', warFaith: 'DOSSIER_STATE_PROSE_WAR_FAITH' };
for (const [f, n] of Object.entries(ANNEX)) {
  const rel = `src/data/dossierStateProse/${f}.generated.js`;
  const m = (await imp(rel))[n];
  for (const [bid, b] of Object.entries(m)) for (const [pk, arr] of Object.entries(b.pools || {})) {
    const pm = b.poolMeta?.[pk] || {};
    for (const v of arr) {
      if (typeof v.text !== 'string' || v.text.split(/\s+/).length < 4) continue;
      const marks = Array.isArray(v.marks) ? v.marks : [];
      const poolAtoms = Array.isArray(pm.declares) ? pm.declares : (pm.declares && typeof pm.declares === 'object' ? Object.values(pm.declares).flat() : []);
      push({ file: rel, pool: `${bid}::${pk}`, line: null, text: v.text, src: 'annex',
        decl: { atoms: [...marks, ...poolAtoms.map(String)], scoped: pm.crisisScoped === true, colour: marks.includes('colour') || pm.colour === true, tierKey: TIER_KEY.test(pk) },
        via: `marks [${marks.join(', ')}]${pm.colour ? ' · pool {colour}' : ''}${pm.crisisScoped ? ' · pool {crisis-scoped}' : ''}${poolAtoms.length ? ` · pool atoms [${poolAtoms.join(', ')}]` : ''}` });
    }
  }
}

// ---- B: every other source file, by its literals
const files = walk(path.join(TREE, 'src')).filter((f) => !/dossierStateProse\/[a-z]+\.generated\.js$/i.test(f));
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8'); const rel = path.relative(TREE, f);
  const lits = literals(src);
  let masked = src.split(''); for (const l of lits) for (let k = l.start + 1; k < l.end - 1; k++) masked[k] = ' '; masked = masked.join('');
  for (const l of lits) {
    const t = l.text;
    if (t.split(/\s+/).length < 4 || !/[a-z]/.test(t) || /^[\w./-]+$/.test(t)) continue;
    if (/^\s*(import|export)\b|^[@#]|^(https?:|\.\/|\.\.\/)/.test(t)) continue;
    if (/^\s*:/.test(src.slice(l.end, l.end + 3))) continue; // a key of a channel: read where it prints
    const cls = classesOf(t); if (!cls.length) continue;
    const ob = enclosingObject(masked, l.start, l.end); const objText = ob && ob[1] - ob[0] < 1500 ? src.slice(ob[0], ob[1]) : '';
    const near = src.slice(Math.max(0, l.start - 200), l.start);
    const atoms = []; let twin = false, colour = false, via = [];
    for (const k of ['needs', 'excludes', 'crisis', 'tags', 'poolDeclares']) {
      const m = objText.match(new RegExp(`\\b${k}\\s*:\\s*\\[([^\\]]*)\\]`)); if (!m) continue;
      const ws = [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
      atoms.push(...ws.map((w) => (k === 'excludes' ? `no ${w}` : k === 'crisis' && !/^crisis:/.test(w) ? `crisis: ${w}` : w))); via.push(`${k} [${ws.join(', ')}]`);
    }
    if (/\btwinOf\s*:/.test(objText)) { twin = true; via.push('twinOf'); }
    if (/\bcolour\s*:\s*true\b/.test(objText)) { colour = true; via.push('colour'); }
    const ds = /declaredSet\s*\(\s*$/.test(near) || /declaredSet\s*\([^)]*$/.test(near.slice(-100));
    const c = chan.get(t);
    if (c) { atoms.push(...c.atoms); if (c.twin) twin = true; if (c.colour) colour = true; via.push(`channel ${c.kind}${c.twin ? ' (twin)' : ''} [${c.atoms.join(', ')}]`); }
    else if (ds) { const m = src.slice(l.end, l.end + 600).match(/^\s*,\s*\[([^\]]*)\]/); if (m) { const ws = [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]); atoms.push(...ws); via.push(`declaredSet [${ws.join(', ')}]`); } }
    const pool = poolOf(src, l.start); const sub = subKeyOf(src, l.start);
    // an arrival sense is keyed by a house or a trade the town has (`institutions` / `trade`): a pool gate for goods
    let keyGate = false; { const ks = src.lastIndexOf('{ key: ', l.start); if (ks >= 0 && l.start - ks < 6000 && /institutions:\s*\[/.test(src.slice(ks, Math.min(l.start, ks + 1200)))) { keyGate = true; via.push('pool keyed by house/trade'); } }
    const tierKey = TIER_KEY.test(sub) || /\b(tier|TIER|population|isSmall|smallPlace|SMALL)\b/.test(src.slice(Math.max(0, l.start - 300), l.start));
    if (tierKey) via.push('tier key or code gate (unverified)');
    push({ file: rel, pool: sub ? `${pool}.${sub}` : pool, line: src.slice(0, l.start).split('\n').length, text: t.replace(/\$\{[^}]*\}/g, '…'), src: 'literal',
      decl: { atoms, twin, colour, keyGate, tierKey, bound: BOUND_FILES.test(rel) }, via: via.join(' · ') });
  }
}

// ---- distinct texts (a channel key printed in its table and named in its set is one line); keep the best-declared
const RANK = { declared: 6, twin: 5, scoped: 5, gate: 4, keyed: 4, bound: 4, colour: 2, any: 2, other: 1, none: 0 };
const byText = new Map();
for (const r of rows) {
  const d = byText.get(r.text); if (!d) { byText.set(r.text, { ...r, also: [] }); continue; }
  d.also.push(`${r.file}:${r.line ?? r.pool}`);
  for (const c of r.classes) if ((RANK[r.status[c]] ?? 0) > (RANK[d.status[c]] ?? -1)) d.status[c] = r.status[c];
}
const hits = [...byText.values()];

// ---- printed: the longest fixed fragment of the line, found in the render's dumps
const renderDir = opt('--render');
if (renderDir) {
  const dumps = fs.readdirSync(path.join(renderDir, 'dumps')).filter((x) => x.endsWith('.txt'));
  const pages = dumps.map((x) => fs.readFileSync(path.join(renderDir, 'dumps', x), 'utf8'));
  const big = pages.join('\u0001'); const starts = []; { let o = 0; for (const p of pages) { starts.push(o); o += p.length + 1; } }
  const townAt = (pos) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= pos) lo = mid; else hi = mid - 1; } return lo; };
  for (const h of hits) {
    const frags = h.text.split(/…|\{[^}]*\}|\$\{[^}]*\}/).map((s) => s.trim()).sort((a, b) => b.length - a.length);
    const fr = frags[0] || ''; if (fr.length < 18) { h.printed = null; continue; }
    const towns = new Set(); let p = big.indexOf(fr); while (p >= 0 && towns.size < 1000) { towns.add(townAt(p)); p = big.indexOf(fr, starts[townAt(p)] + pages[townAt(p)].length); }
    h.printed = towns.size; h.printedIn = [...towns].slice(0, 5).map((i) => dumps[i].replace(/\.txt$/, ''));
  }
}
fs.writeFileSync(outPath, JSON.stringify(hits, null, 1));

// ---- the table
const STOCK = (s) => !DECLARED.has(s);
const byCls = {}; for (const c of Object.keys(CLASSES)) byCls[c] = { n: 0, declared: 0, twin: 0, scoped: 0, gate: 0, keyed: 0, bound: 0, any: 0, colour: 0, other: 0, none: 0, stock: 0, printedStock: 0 };
for (const h of hits) for (const c of h.classes) { const v = byCls[c]; v.n++; v[h.status[c]]++; if (STOCK(h.status[c])) { v.stock++; if (h.printed) v.printedStock++; } }
console.log(`files read ${files.length + 6} · prose lines holding a class word ${hits.length} (distinct) · annex ${hits.filter((h) => h.src === 'annex').length} · literals ${hits.filter((h) => h.src === 'literal').length}`);
console.log('class       lines  declared twin scoped gate keyed bound |  any colour other  none | STOCK' + (renderDir ? '  printed-in-render' : ''));
for (const [c, v] of Object.entries(byCls)) console.log(`${c.padEnd(10)} ${String(v.n).padStart(6)} ${String(v.declared).padStart(9)} ${String(v.twin).padStart(4)} ${String(v.scoped).padStart(6)} ${String(v.gate).padStart(4)} ${String(v.keyed).padStart(5)} ${String(v.bound).padStart(5)} | ${String(v.any).padStart(4)} ${String(v.colour).padStart(6)} ${String(v.other).padStart(5)} ${String(v.none).padStart(5)} | ${String(v.stock).padStart(5)}${renderDir ? String(v.printedStock).padStart(8) : ''}`);
const anyStock = hits.filter((h) => h.classes.some((c) => STOCK(h.status[c])));
console.log(`LINES WITH AT LEAST ONE UNDECLARED CLASS: ${anyStock.length} of ${hits.length}${renderDir ? ` · of them printed in the render: ${anyStock.filter((h) => h.printed).length}` : ''}`);
