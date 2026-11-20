// GR4 check: every changed goal holding (base → after) was a REPEAT in the base (an earlier holding, roster order,
// short then long, held its wording: the template with name slots masked, other slots captured); every town with no
// base repeat is byte-identical in its goals. Usage: node onlyRepeaters.mjs <base tree> <born-before dir> <born-after dir>
import { createReadStream } from 'node:fs'; import { createInterface } from 'node:readline';
const [, , TREE, A, B] = process.argv;
const { GOAL_FAMILY_LINES } = await import(`${TREE}/src/data/people/goalFamilies.js`);
const NAME = new Set(['above','below','other','handler','agent','target','priest','power','rival','guild','house','otherHouse','front','targetHouse','shrine','arcaneHouse']);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const T = [];
for (const kinds of Object.values(GOAL_FAMILY_LINES)) for (const vs of Object.values(kinds)) for (const cell of Object.values(vs)) for (const l of cell) T.push(typeof l === 'string' ? l : l.line);
const TM = [...new Set(T)].map((line) => { const toks = [...line.matchAll(/\{([^}]+)\}(?:'s)?/g)]; const fixed = line.split(/\{[^}]+\}(?:'s)?/);
  return { line, fl: fixed.join('').length, re: new RegExp('^' + fixed.map((p, i) => esc(p) + (i < toks.length ? (NAME.has(toks[i][1]) || toks[i][1].includes('|') ? '.+?' : '(.+?)') : '')).join('') + '$', 'u') }; });
const wording = (text) => { let best = null, m = null; for (const t of TM) { const x = t.re.exec(text); if (x && (!best || t.fl > best.fl)) { best = t; m = x; } } if (!best) return text; let g = 0; return best.line.replace(/\{([^}]+)\}/g, (w, s) => (NAME.has(s) ? '§' : s.includes('|') ? w : m[++g])); };
const read = async (f) => { const m = new Map(); for await (const l of createInterface({ input: createReadStream(f) })) { if (!l.trim()) continue; const r = JSON.parse(l); m.set(r.key, (r.doc.npcs || []).map((n) => [n.goal?.short ?? null, n.goal?.long ?? null])); } return m; };
for (const corpus of ['golden', 'census']) {
  const a = await read(`${A}/${corpus}.jsonl`), b = await read(`${B}/${corpus}.jsonl`);
  let changed = 0, notRepeat = 0, cleanTownsMoved = 0, towns = 0, unmatched = 0; const ex = [];
  for (const [key, ga] of a) { towns++; const gb = b.get(key) || []; const seen = new Set(); let anyRepeat = false, anyChange = false;
    ga.forEach((pair, i) => pair.forEach((t, v) => { if (!t) return; const w = wording(t); if (w === t && !TM.some((x) => x.re.test(t))) unmatched++; const rep = seen.has(w); if (rep) anyRepeat = true; seen.add(w);
      if (gb[i]?.[v] !== t) { anyChange = true; changed++; if (!rep) { notRepeat++; if (ex.length < 5) ex.push(`${key} npc ${i} ${v ? 'long' : 'short'}: ${t} -> ${gb[i]?.[v]}`); } } }));
    if (anyChange && !anyRepeat) cleanTownsMoved++; }
  console.log(`${corpus}: towns ${towns} · changed holdings ${changed} · changed but NOT a base repeat ${notRepeat} · towns with no base repeat yet changed ${cleanTownsMoved} · texts no template matched ${unmatched}`);
  for (const e of ex) console.log('  ' + e);
}
