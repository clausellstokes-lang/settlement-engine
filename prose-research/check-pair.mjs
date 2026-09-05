// check-pair.mjs <dock> <pairs.json> — the MECHANICAL half of taste-sample verification, executed not eyeballed.
// Loads the generated leaves as modules (pure data), so marks/angles/slots are read from the objects, never regexed.
import { readdirSync } from 'node:fs'; import { readFileSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const [,, D, PAIRS] = process.argv;
const corpus = [];
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs)
    corpus.push({ text: v.text, block, pool, angle: v.angle || '', marks: v.marks || [], file: f, siblings: Object.keys(b.pools).filter(k => k !== pool) });
}
{ const mod = await import(pathToFileURL(path.join(D, 'src/data/dossierCausalProse.generated.js')).href); const table = Object.values(mod)[0];
  const walk = (o, key) => { if (Array.isArray(o)) { for (const v of o) if (v && typeof v.text === 'string') corpus.push({ text: v.text, block: 'CAUSAL', pool: key, angle: v.angle || '', marks: v.marks || [], file: 'causal', siblings: [] }); } else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, k); };
  walk(table, 'CAUSAL'); }
const slots = s => new Set([...s.matchAll(/\{([a-z_0-9]+)\}/g)].map(m => m[1]));
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
// §0d's six-band vocabulary + the general time words: any of these ADDED by a rewrite is a duration claim the pool key may not license (T5)
const DURATION = /\b(this season|within the year|years on|years old|a decade|a generation|older than its bearers|year|years|season|seasons|winter|winters|generation|generations|lifetime|decade|decades|month|months|week|weeks|day|days|ago|since|every|always|never|long|recent|lately|now|yet|still|already)\b/gi;
// §0d QUANTITY_BANDS + the authored magnitude words + the count NOUNS (a moved noun moves the band: souls → households)
const COUNT = /\b(nobody|no one|a few souls|a few|a dozen or so|a dozen|dozens|a hundred or so|a hundred|several hundred|many hundreds|hundreds|thousands|a handful|a score|scores|most|all but|half|all|none|many|several|some|souls|people|households|families|hands|mouths|heads)\b/gi;
const lower = s => s.toLowerCase();
const setOf = (s, re) => new Set((lower(s).match(re) || []).map(x => x.toLowerCase()));
const pairs = JSON.parse(readFileSync(PAIRS, 'utf8')); let fails = 0;
for (const p of pairs) {
  const hits = corpus.filter(c => c.text === p.before); const r = []; const h = hits[0];
  if (!h) r.push('NOT LOCATED in the dossier corpus (state+causal)');
  if (h && h.marks.length) r.push('MARKS ' + JSON.stringify(h.marks) + (h.marks.includes('dm-only') ? ' — dm-only: the AFTER inherits the mark and the audience law' : ''));
  const sb = slots(p.before), sa = slots(p.after);
  if ([...sb].some(x => !sa.has(x)) || [...sa].some(x => !sb.has(x))) r.push(`SLOTS differ: before {${[...sb]}} after {${[...sa]}}`);
  if (/\d/.test(p.after)) r.push('DIGIT in AFTER'); if (/\d+\s*%|percent/i.test(p.after)) r.push('PERCENT in AFTER (§0d: proportions in words)'); if (/—/.test(p.after)) r.push('EM DASH in AFTER'); if (/!/.test(p.after)) r.push('EXCLAMATION in AFTER');
  if (words(p.after) > words(p.before)) r.push(`LONGER: ${words(p.before)} → ${words(p.after)} words`);
  const dB = setOf(p.before, DURATION), dA = setOf(p.after, DURATION); const addedDur = [...dA].filter(w => !dB.has(w)); if (addedDur.length) r.push('DURATION/TIME words ADDED: ' + addedDur.join(', '));
  const cB = setOf(p.before, COUNT), cA = setOf(p.after, COUNT); const addedC = [...cA].filter(w => !cB.has(w)), lostC = [...cB].filter(w => !cA.has(w));
  if (addedC.length) r.push('COUNT words ADDED: ' + addedC.join(', ')); if (lostC.length) r.push('COUNT words LOST (band noun moved?): ' + lostC.join(', '));
  if (h && h.siblings.length) { const sibWords = new Set(h.siblings.flatMap(k => lower(k).replace(/[^a-z ]/g, ' ').split(/\s+/)).filter(w => w.length > 3 && !['quantity','candidate','kind'].includes(w)));
    const cut = [...new Set(lower(p.before).replace(/[^a-z ]/g, ' ').split(/\s+/))].filter(w => sibWords.has(w) && !lower(p.after).includes(w));
    if (cut.length) r.push('R4: CUT a word that names a SIBLING pool key: ' + cut.join(', ') + '  (siblings: ' + h.siblings.slice(0, 6).join(' | ') + ')'); }
  // U2: the two-sentence ceiling (house rate 11 of 2,734 three-sentence variants)
  const sentences = t => t.replace(/\{[a-z_0-9]+\}/g, 'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(Boolean).length;
  if (sentences(p.after) > 2) r.push(`THREE+ SENTENCES (${sentences(p.after)}) — the register is one flowing sentence or two short ones`);
  // U3: the pet-word ration is a per-variant NET test at the point of edit
  const RATION = [/\brather than\b/g, /\bwhich (is|means)\b/g, /\b(nobody|no one|nothing)\b/g, /\bits own\b/g, /\bwhatever\b/g, /\benough (to|that)\b/g, /\b(kind|sort) of\b/g, /\bquiet(ly)?\b/g, /\b(still|yet|already)\b/g];
  for (const re of RATION) { const b = (lower(p.before).match(re) || []).length, a = (lower(p.after).match(re) || []).length; if (a > b) r.push(`RATIONED WORD ADDED: ${re.source} ${b} → ${a}`); }
  // U4: count the antithesis SHAPE, not the phrase
  const shape = t => (lower(t).match(/\brather than\b|\bnot [^.,;]{1,40}, but\b|\bnot [^.,;]{1,40} but\b|, not [a-z][^.,;]{0,40}[.;]|\bnot [^.,;]{1,30}, (it|this|that) is\b|\bless [^.,;]{1,30} than\b/g) || []).length;
  if (shape(p.after) > shape(p.before)) r.push(`ANTITHESIS SHAPE ADDED: ${shape(p.before)} → ${shape(p.after)}`);
  if (shape(p.before) > 0 && shape(p.after) === shape(p.before) && /rather than/.test(lower(p.before)) && !/rather than/.test(lower(p.after))) r.push('NOTE: "rather than" removed but the antithesis SHAPE survives (a column moved, not the failure mode)');
  // U7: a bare future indicative is a FATE breach; the [threshold] edge is subjunctive
  if (/\b(will|shall)\b/.test(lower(p.after)) && !/\b(will|shall)\b/.test(lower(p.before))) r.push('FUTURE INDICATIVE ADDED (STATE never FATE)');
  if (/\bwould\b/.test(lower(p.before)) && !/\bwould\b/.test(lower(p.after))) r.push('SUBJUNCTIVE "would" REMOVED — a [threshold] edge may have become a forecast');
  const ok = r.length === 0; if (!ok) fails++;
  console.log(`#${p.id} ${ok ? 'PASS(mechanical)' : 'FAIL'} ${h ? h.block + ' :: ' + h.pool + (h.angle ? ' [' + h.angle + ']' : '') : ''}`); for (const x of r) console.log('    - ' + x);
}
console.log(`\ncorpus loaded: ${corpus.length} variants; ${pairs.length - fails} pass mechanically, ${fails} fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)`);
