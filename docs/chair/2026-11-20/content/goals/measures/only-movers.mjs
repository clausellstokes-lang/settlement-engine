// Scratch copy of docs/chair/2026-11-20/content/goals/measures/only-repeaters.mjs, taught a second class of allowed mover
// (GOALS-2 units 4 and 6). Every changed goal holding (base -> after) must be (1) a REPEAT in the base (an earlier holding,
// roster order, short then long, held its wording: the template with name slots masked, other slots captured), or (2) a
// holding of THE REFUSED PAIRING: the card's FINAL secret (after tree) on GOAL_SECRET_REFUSAL_ROWS, matched as
// goals-final.mjs :: venal matches it, beside a PERSONALITY conviction/duty want at that vantage in the base. Every other
// differing string is traced: (3) does it quote a moved goal (its before or after text)?
// Usage: node only-movers.mjs <base tree> <after tree> <born-before dir> <born-after dir>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , TREE, TREEB, A, B] = process.argv;
const { GOAL_FAMILY_LINES } = await import(pathToFileURL(`${TREE}/src/data/people/goalFamilies.js`).href);
const LEAF = await import(pathToFileURL(`${TREEB}/src/data/people/goalSecretRefusals.js`).href);
const { rareRowOf } = await import(pathToFileURL(`${TREEB}/src/generators/people/rareSecrets.js`).href);
const NAME = new Set(['above','below','other','handler','agent','target','priest','power','rival','guild','house','otherHouse','front','targetHouse','shrine','arcaneHouse']);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const T = [];
for (const kinds of Object.values(GOAL_FAMILY_LINES)) for (const vs of Object.values(kinds)) for (const cell of Object.values(vs)) for (const l of cell) T.push(typeof l === 'string' ? l : l.line);
const TM = [...new Set(T)].map((line) => { const toks = [...line.matchAll(/\{([^}]+)\}(?:'s)?/g)]; const fixed = line.split(/\{[^}]+\}(?:'s)?/);
  return { line, fl: fixed.join('').length, re: new RegExp('^' + fixed.map((p, i) => esc(p) + (i < toks.length ? (NAME.has(toks[i][1]) || toks[i][1].includes('|') ? '.+?' : '(.+?)') : '')).join('') + '$', 'u') }; });
const wording = (text) => { let best = null, m = null; for (const t of TM) { const x = t.re.exec(text); if (x && (!best || t.fl > best.fl)) { best = t; m = x; } } if (!best) return text; let g = 0; return best.line.replace(/\{([^}]+)\}/g, (w, s) => (NAME.has(s) ? '§' : s.includes('|') ? w : m[++g])); };
// goals-final.mjs :: venal, rows from the after tree's leaf
const R0 = LEAF.GOAL_SECRET_REFUSAL_ROWS; const rows = (Array.isArray(R0) ? R0 : Object.values(R0)).map((r) => typeof r === 'string' ? r : (r.text || r.line || r.secret || r.what || r[1]));
const norm = (s) => String(s || '').trim().replace(/[.\s]+$/, '');
const rowRes = rows.map((r) => new RegExp('^' + norm(r).split(/(\{faction\} \w+?s\b|\{[^}]+\})/).map((p) => { const fv = /^\{faction\} (\w+?)s$/.exec(p); return fv ? `.+? ${esc(fv[1])}s?` : /^\{[^}]+\}$/.test(p) ? '.+?' : esc(p); }).join('') + '$', 'is'));
const venal = (n) => { const s = norm(typeof n?.secret === 'string' ? n.secret : n?.secret?.what); return !!s && rowRes.some((re) => re.test(s)); };
const rareKey = (n) => { try { const r = rareRowOf(n?.secret); return r && LEAF.GOAL_SECRET_REFUSAL_RARE_KEYS.includes(String(r.row?.key)) ? String(r.row.key) : null; } catch { return null; } };
const refusedWant = (it) => it?.family === 'PERSONALITY' && (it.kind === 'conviction' || it.kind === 'duty');
const read = (dir, corpus) => new Map(readFileSync(join(dir, `${corpus}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [JSON.stringify(r.key), r.doc]; }));
const strings = (x, path, out) => { if (typeof x === 'string') out.set(path, x); else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) strings(v, Array.isArray(x) ? `${path}[${k}]` : (path ? `${path}.${k}` : k), out); return out; };
const lines = [];
const say = (s) => { lines.push(s); console.log(s); };
for (const corpus of ['golden', 'census']) {
  const a = read(A, corpus), b = read(B, corpus);
  const C = { tags: {}, towns: 0, townsChanged: 0, changed: 0, rep: 0, refusal: 0, both: 0, rareOnly: 0, out: 0, intentOnly: 0, cleanTownsMoved: 0, unmatched: 0, refusalCards: 0, refusalCardsMoved: 0, otherStrings: 0, otherQuoting: 0, otherNot: 0 };
  const outList = [], rareList = [], otherNotList = [], otherFields = new Map(), cardOther = new Map();
  for (const [key, da] of a) { C.towns++; const db = b.get(key); const na = da.npcs || [], nb = db?.npcs || [];
    const later = new Map(); na.forEach((ca)=>['short','long'].forEach((v)=>{const t=ca.goal?.[v]; if(t){const w=wording(t); later.set(w,(later.get(w)||0)+1);}})); let inScopeBefore=false; const seen = new Set(); let anyRepeat = false, anyChange = false, anyRefusal = false; const moved = [];
    na.forEach((ca, i) => { const cb = nb[i] || {}; const fin = venal(cb); const rk = rareKey(cb);
      const pairing = fin && ['short', 'long'].some((v) => refusedWant(ca.goal?.intent?.[v])); if (pairing) { C.refusalCards++; anyRefusal = true; }
      let cardMoved = false;
      ['short', 'long'].forEach((v) => { const t = ca.goal?.[v] ?? null; const u = cb.goal?.[v] ?? null; if (!t) return;
        const w = wording(t); if (w === t && !TM.some((x) => x.re.test(t))) C.unmatched++; const rep = seen.has(w); if (rep) anyRepeat = true; seen.add(w);
        const intentMoved = JSON.stringify(ca.goal?.intent?.[v] ?? null) !== JSON.stringify(cb.goal?.intent?.[v] ?? null);
        if (u === t) { if (intentMoved) { C.intentOnly++; outList.push(`${corpus} ${JSON.parse(key)} ${ca.id} npcs[${i}].goal.intent.${v} moved, text kept: ${t}`); C.out++; } return; }
        anyChange = true; cardMoved = true; C.changed++; moved.push(t, u);
        const ref = fin && refusedWant(ca.goal?.intent?.[v]);
        if (rep || ref) inScopeBefore = true; if (rep && ref) C.both++; else if (rep) C.rep++; else if (ref) C.refusal++;
        else if (rk && refusedWant(ca.goal?.intent?.[v])) { C.rareOnly++; rareList.push(`${corpus} ${JSON.parse(key)} ${ca.id} npcs[${i}].goal.${v} [rare secret ${rk}]: ${t} -> ${u}`); }
        else { C.out++; const tag = `${later.get(w) > 1 ? 'first-of-a-repeat' : 'unique-in-town'}${inScopeBefore ? ',after-an-in-scope-move' : ',no-in-scope-move-before'}`; C.tags[tag] = (C.tags[tag] || 0) + 1; outList.push(`${tag} ${corpus} ${JSON.parse(key)} ${ca.id} npcs[${i}].goal.${v} [${ca.goal?.intent?.[v]?.family}/${ca.goal?.intent?.[v]?.kind}; secret: ${norm(cb.secret?.what ?? cb.secret)}]: ${t} -> ${u}`); } });
      if (pairing && cardMoved) C.refusalCardsMoved++;
      // the card's other fields
      const sa = strings(ca, '', new Map()), sb = strings(cb, '', new Map());
      for (const [p, x] of sa) if (!p.startsWith('goal.') && sb.get(p) !== x) { const f = `npcs[].${p.replace(/\[\d+\]/g, '[]')}`; cardOther.set(f, (cardOther.get(f) || 0) + 1); }
      for (const p of new Set([...Object.keys(ca), ...Object.keys(cb)])) if (p !== 'goal' && JSON.stringify(ca[p]) !== JSON.stringify(cb[p]) && !(typeof ca[p] === 'string' || (ca[p] && typeof ca[p] === 'object'))) cardOther.set(`npcs[].${p} (non-string)`, (cardOther.get(`npcs[].${p} (non-string)`) || 0) + 1);
    });
    // every other differing string in the document, traced against the town's moved goals
    const sa = strings({ ...da, npcs: undefined }, '', new Map()), sb = strings({ ...db, npcs: undefined }, '', new Map());
    const keys = new Set([...sa.keys(), ...sb.keys()]);
    const low = (s) => norm(s).toLowerCase();
    const quotes = (s) => moved.some((g) => { if (!g || !s) return false; const gg = low(g), ss = low(s); return ss.includes(gg) || (gg.length > 30 && ss.includes(gg.slice(0, 30))); });
    for (const p of keys) { const x = sa.get(p), y = sb.get(p); if (x === y) continue; C.otherStrings++; const f = p.replace(/\[\d+\]/g, '[]'); otherFields.set(f, (otherFields.get(f) || 0) + 1);
      if (quotes(x) || quotes(y)) C.otherQuoting++; else { C.otherNot++; otherNotList.push(`${corpus} ${JSON.parse(key)} ${p}: ${x} -> ${y}`); } }
    const strip = (d) => JSON.stringify({ ...d, npcs: (d?.npcs || []).map((n) => ({ ...n, goal: undefined })) });
    if (strip(da) !== strip(db)) { C.restDiffers = (C.restDiffers || 0) + 1; }
    if (anyChange) C.townsChanged++;
    if (anyChange && !anyRepeat && !anyRefusal) C.cleanTownsMoved++; }
  say(`${corpus}: towns ${C.towns} · towns with a changed goal ${C.townsChanged} · changed holdings ${C.changed} · (1) a base repeat ${C.rep} · (2) the refused pairing ${C.refusal} · both (1) and (2) ${C.both} · OUTSIDE (1)-(2) ${C.out + C.rareOnly} (of them a rare-row secret beside a conviction/duty want, the code's own second leg: ${C.rareOnly}; intent moved with text kept: ${C.intentOnly}) · towns with no base repeat and no refused pairing yet changed ${C.cleanTownsMoved} · texts no template matched ${C.unmatched}`);
  say(`  OUTSIDE holdings by class: ${JSON.stringify(C.tags)}`);
  say(`  refused-pairing cards (final secret on the list beside a base conviction/duty want) ${C.refusalCards}, of them moved ${C.refusalCardsMoved}`);
  say(`  documents differing anywhere outside npcs[].goal (whole JSON, key order included): ${C.restDiffers || 0}`);
  say(`  card fields other than goal that differ: ${cardOther.size ? [...cardOther].map(([f, n]) => `${f} ${n}`).join(', ') : 'none'}`);
  say(`  document strings outside npcs that differ ${C.otherStrings}: quoting a moved goal ${C.otherQuoting}, not ${C.otherNot}${otherFields.size ? ' · fields: ' + [...otherFields].map(([f, n]) => `${f} ${n}`).join(', ') : ''}`);
  for (const e of outList) say('  OUT ' + e);
  for (const e of rareList) say('  RARE ' + e);
  for (const e of otherNotList.slice(0, 40)) say('  UNTRACED ' + e);
}
