// sweep.mjs <tree> <renderOut> <outTsv>
// THE CLASS "A TWIN TAKES ITS SIBLINGS' CONDITION", swept over every pool of the corpus (all blocks).
// For each pool: every condition some variants carry and a sibling lacks (fact atoms of the declaration,
// `no crisis: X` exclusions, and the kernel's dimension marks); for each lacking sibling, how many of the
// rendered births DRAW it (the owner's page draws, <seed>.draws.json) in a town where the condition FAILS
// (factsOf over <seed>.json + the kernel's one rule, declarationAdmits). Positive crisis requirements are a
// twin's own scope and are not swept (a general line printing where the twin's crisis is off is the design);
// a sibling that carries the condition's negation or another value of the same band dimension is
// partitioned, not lacking.
import fs from 'node:fs';
import path from 'node:path';
const [tree, rout, outTsv] = process.argv.slice(2);
const T = (p) => path.join(tree, p);
const voc = await import(T('src/domain/facts/factVocabulary.js'));
const kernel = await import(T('src/domain/display/stateProse/stateProseKernel.js'));
const { factsOf } = await import(T('src/domain/facts/factsOf.js'));
const CORPUS = {};
for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) {
  const leaf = Object.values(await import(T(`src/data/dossierStateProse/${desk}.generated.js`))).find((v) => v && typeof v === 'object');
  for (const [b, block] of Object.entries(leaf)) CORPUS[b] = block;
}
const DIM_MARK = {};
for (const [dim, words] of Object.entries(voc.STATE_MARK_DIMENSIONS)) for (const w of words) DIM_MARK[w] = dim;
// a condition word -> a declaration the kernel's rule can read, or null (unanswerable here)
function condDecl(c) {
  if (DIM_MARK[c]) {
    const neg = c.startsWith('no ') ? c.slice(3) : null; const base = neg || c;
    const map = { walls: 'walls', crisis: 'crisis', hunger: 'crisis: hunger' };
    const tag = map[base]; if (!tag) return null;
    return voc.declarationOfTags([neg ? `no ${tag}` : tag]);
  }
  return voc.declarationOfTags([c]);
}
// the conditions a variant carries (own spelling); positive crisis kept apart
function conds(v) {
  const out = new Set(); const pos = new Set();
  for (const m of v.marks || []) {
    if (m === 'dm-only' || m === 'covert') continue;
    if (DIM_MARK[m]) { out.add(m); continue; }
    const a = voc.parseAtom(m.replace(/^no\s+/i, '')); if (!a) continue;
    const neg = /^no\s+/i.test(m);
    if (a.dimension === 'crisis' && !neg) { for (const x of a.values || ['any']) pos.add(x); continue; }
    out.add(neg ? `no ${a.raw}` : a.raw);
  }
  return { out, pos };
}
const dimOf = (c) => { if (DIM_MARK[c]) return 'mark:' + DIM_MARK[c]; const a = voc.parseAtom(c.replace(/^no\s+/i, '')); return a ? a.dimension + (a.dimension === 'crisis' ? ':' + (a.values || []).join(',') : '') : c; };
const isBand = (c) => { const a = voc.parseAtom(c.replace(/^no\s+/i, '')); return a && a.op; };
// towns
const dumps = path.join(rout, 'dumps'); const recs = path.join(rout, 'records');
const seeds = fs.readdirSync(dumps).filter((f) => f.endsWith('.draws.json')).map((f) => f.replace(/\.draws\.json$/, ''));
const TOWNS = [];
for (const s of seeds) {
  let rec; try { rec = JSON.parse(fs.readFileSync(path.join(recs, s + '.json'), 'utf8')); } catch { continue; }
  TOWNS.push({ s, draws: JSON.parse(fs.readFileSync(path.join(dumps, s + '.draws.json'), 'utf8')), facts: factsOf(rec) });
}
const rows = [];
for (const [blockId, block] of Object.entries(CORPUS)) {
  for (const [key, pool] of Object.entries(block.pools || {})) {
    const vs = (pool || []).filter((v) => typeof v.vid === 'number');
    if (vs.length < 2) continue;
    const crisisScoped = block.poolMeta?.[key]?.crisisScoped === true;
    const C = vs.map((v) => ({ v, ...conds(v) }));
    const all = new Set(C.flatMap((x) => [...x.out]));
    for (const c of all) {
      const carriers = C.filter((x) => x.out.has(c)).map((x) => x.v.vid);
      const neg = c.startsWith('no ') ? c.slice(3) : 'no ' + c;
      const lacking = C.filter((x) => {
        if (x.out.has(c) || x.out.has(neg)) return false;
        if (isBand(c) && [...x.out].some((o) => dimOf(o) === dimOf(c))) return false; // its own band on the dimension
        if (DIM_MARK[c] && [...x.out].some((o) => DIM_MARK[o] === DIM_MARK[c])) return false;
        if (c.startsWith('no crisis:')) { const ks = voc.parseAtom(c.slice(3)).values || []; if (ks.some((k) => x.pos.has(k))) return false; }
        return true;
      }).map((x) => x.v.vid);
      if (!lacking.length) continue;
      const decl = condDecl(c);
      const pk = `${blockId}::${key}`;
      const hits = {}; let drawnAll = 0;
      for (const t of TOWNS) {
        const d = t.draws[pk]; if (!d) continue;
        const fails = decl ? !voc.declarationAdmits(decl, t.facts, { crisisScoped: false }).admitted : null;
        for (const vid of d.d || []) {
          if (!lacking.includes(vid)) continue; drawnAll++;
          if (fails === true) (hits[vid] ||= []).push(t.s);
          else if (fails === null) (hits[vid] ||= []).push('?' + t.s);
        }
      }
      const n = Object.values(hits).reduce((a, h) => a + h.filter((x) => !x.startsWith('?')).length, 0);
      const unk = Object.values(hits).reduce((a, h) => a + h.filter((x) => x.startsWith('?')).length, 0);
      const strict = lacking.length === 1 && carriers.length >= 2 ? 'ALL-SIBLINGS' : `${carriers.length}/${carriers.length + lacking.length}`;
      rows.push({ block: blockId, pool: key, cond: c, strict, carriers: carriers.join(','), lacking: lacking.join(','), drawnLacking: drawnAll, failDrawn: n, unanswered: unk,
        byVid: Object.entries(hits).map(([v, h]) => `v${v}:${h.length}`).join(' '),
        towns: Object.entries(hits).map(([v, h]) => `v${v}[${h.slice(0, 6).join(' ')}]`).join(' ') });
    }
  }
}
rows.sort((a, b) => b.failDrawn - a.failDrawn || a.block.localeCompare(b.block));
const H = ['block', 'pool', 'cond', 'strict', 'carriers', 'lacking', 'drawnLacking', 'failDrawn', 'unanswered', 'byVid', 'towns'];
fs.writeFileSync(outTsv, [H.join('\t'), ...rows.map((r) => H.map((h) => r[h]).join('\t'))].join('\n') + '\n');
const fam = (b) => b.replace(/-\d+$/, '');
const sum = {};
for (const r of rows) { const f = fam(r.block); sum[f] ||= { rows: 0, live: 0, draws: 0 }; sum[f].rows++; if (r.failDrawn) { sum[f].live++; sum[f].draws += r.failDrawn; } }
console.log('towns', TOWNS.length, 'rows', rows.length);
for (const [f, s] of Object.entries(sum).sort()) console.log(f, 'conditions-lacked', s.rows, 'live (drawn where it fails)', s.live, 'draws', s.draws);
