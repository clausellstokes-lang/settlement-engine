// sevcount.mjs <surfBase> <surfTip> <seedsfile> [<dumpsBase> <dumpsTip>]
// Per surface, base against tip: lines printing two severity words for one thing (a range) and lines with ONE
// severity word on its own (a single chip/pill); then every line that differs base->tip, classed: a range line
// gone (expected), anything else (must be none).
import fs from 'node:fs';
const [sb, st, seedsf, db, dt] = process.argv.slice(2);
const seeds = fs.readFileSync(seedsf, 'utf8').trim().split('\n');
const W = '(minor|major|catastrophic)';
const RANGE = new RegExp(`^${W}\\s*(/|,)?\\s*${W}$`, 'i');
const INLINE = new RegExp(`\\b${W}\\s*/\\s*${W}\\b|${W}${W}\\b`, 'i');
const ONE = new RegExp(`^${W}$`, 'i');
const C = {}; const add = (k, n = 1) => { C[k] = (C[k] || 0) + n; };
const towns = {}; const addT = (k, seed) => { (towns[k] ||= new Set()).add(seed); };
const other = []; const examples = {};
function multiset(lines) { const m = new Map(); for (const l of lines) m.set(l, (m.get(l) || 0) + 1); return m; }
function cmp(surface, seed, a, b) {
  for (const [side, lines] of [['base', a], ['tip', b]]) for (const l of lines) {
    if (RANGE.test(l) || INLINE.test(l)) { add(`${surface}\t${side}\trange lines`); addT(`${surface}\t${side}\trange lines`, seed); (examples[`${surface}\t${side}`] ||= `${seed}: ${l.slice(0, 120)}`); }
    else if (ONE.test(l)) add(`${surface}\t${side}\tone-word lines`);
  }
  const ma = multiset(a), mb = multiset(b);
  for (const [l, n] of ma) { const d = n - (mb.get(l) || 0); if (d > 0) { if (RANGE.test(l) || INLINE.test(l)) add(`${surface}\tdiff\trange line gone`, d); else other.push(`${surface} ${seed} - ${l.slice(0, 160)}`); } }
  for (const [l, n] of mb) { const d = n - (ma.get(l) || 0); if (d > 0) other.push(`${surface} ${seed} + ${l.slice(0, 160)}`); }
}
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean) : null);
for (const seed of seeds) {
  for (const v of ['pdf-canon_dossier', 'pdf-draft_brief', 'pdf-timeline_packet', 'foundry-canon_dossier', 'foundry-draft_brief', 'tonight']) {
    const ext = v === 'tonight' ? 'tonight' : v;
    const a = read(`${sb}/${seed}.${ext}.txt`), b = read(`${st}/${seed}.${ext}.txt`);
    if (!a || !b) { add(`${v}\tmissing`); continue; }
    // The journal file is one JSON-ish line per page: split its Markdown into lines first.
    const split = (ls) => (v.startsWith('foundry') ? ls.flatMap((l) => l.split(/\\n|\n/)).map((l) => l.replace(/[*_\\]/g, '').replace(/^[-#|\s]+/, '').trim()).filter(Boolean) : ls);
    cmp(v, seed, split(a), split(b));
  }
  if (db && dt) {
    const hist = (ls) => { const out = []; let on = false; for (const l of ls || []) { if (l.startsWith('== ')) { on = /\/History ==/.test(l); continue; } if (on) out.push(l); } return out; };
    const a = hist(read(`${db}/${seed}.txt`)), b = hist(read(`${dt}/${seed}.txt`));
    if (!a.length || !b.length) { add('page History\tmissing'); continue; }
    // A tension header prints "<label><sev>..." run together; count the severity words that end the line.
    const tail = (l) => { const m = l.match(new RegExp(`${W}+$`, 'i')); return m ? (m[0].match(new RegExp(W, 'gi')) || []).length : 0; };
    for (const [side, ls] of [['base', a], ['tip', b]]) for (const l of ls) { const n = tail(l); if (n >= 2) { add(`page History\t${side}\trange lines`); addT(`page History\t${side}\trange lines`, seed); } }
    const ma = multiset(a), mb = multiset(b);
    for (const [l, n] of ma) { const d = n - (mb.get(l) || 0); if (d > 0) { if (tail(l) >= 2) add('page History\tdiff\trange line gone', d); else other.push(`page ${seed} - ${l.slice(0, 160)}`); } }
    const stripped = new Set([...ma.keys()].filter((x) => tail(x) >= 2).map((x) => x.replace(new RegExp(`${W}+$`, 'i'), '')));
    for (const [l, n] of mb) { const d = n - (ma.get(l) || 0); if (d > 0) { const was = stripped.has(l); if (was) add('page History\tdiff\trange line -> its label alone', d); else other.push(`page ${seed} + ${l.slice(0, 160)}`); } }
  }
}
for (const k of Object.keys(C).sort()) console.log(`${k}\t${C[k]}${towns[k] ? `\ttowns ${towns[k].size}` : ''}`);
for (const [k, v] of Object.entries(examples)) console.log(`example\t${k}\t${v}`);
console.log(`OTHER DIFFERING LINES\t${other.length}`); for (const o of other.slice(0, 40)) console.log('  ' + o);
