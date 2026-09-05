// check-pair.mjs <dock> <pairs.json> — the MECHANICAL half of taste-sample verification, executed not eyeballed.
// pairs.json: [{ id, before, after }] ; the BEFORE must exist verbatim in the dossier corpus (state or causal leaves).
// Checks: located (block, pool key, angle, marks, sibling pool keys) · marks (dm-only) · slot-set identity · digits ·
// em dash · exclamation · question · word count not longer · §0d count/duration vocabulary added · sibling-key words that
// appear in BEFORE but not AFTER (the R4 contrast test: a cut word that names a sibling pool key is a FAIL).
import { readFileSync, readdirSync } from 'node:fs'; import path from 'node:path';
const [,, D, PAIRS] = process.argv;
const corpus = []; // { text, block, pool, angle, marks, siblings }
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const src = readFileSync(path.join(gdir, f), 'utf8'); let block = '?', pool = '?', angle = '', marks = [];
  const poolsOf = {};
  for (const line of src.split('\n')) {
    const b = line.match(/^  "([A-Z]+-[A-Z]+-\d+[a-z]?)": \{/); if (b) { block = b[1]; poolsOf[block] = []; }
    const p = line.match(/^      "([^"]+)": \[/); if (p) { pool = p[1]; poolsOf[block].push(pool); }
    const a = line.match(/^\s+"angle": "([^"]*)"/); if (a) angle = a[1];
    const m = line.match(/^\s+"marks": \[(.*)\]/); if (m) marks = m[1].split(',').map(x => x.trim().replace(/"/g, '')).filter(Boolean);
    const t = line.match(/^\s+"text": "(.*)",?$/); if (t) { corpus.push({ text: JSON.parse('"' + t[1] + '"'), block, pool, angle, marks, file: f, poolsOf }); angle = ''; marks = []; }
  }
}
{ const src = readFileSync(path.join(D, 'src/data/dossierCausalProse.generated.js'), 'utf8'); let pool = '?', marks = [];
  for (const line of src.split('\n')) { const p = line.match(/^\s+"([^"]+)": \[/); if (p) pool = p[1];
    const m = line.match(/^\s+"marks": \[(.*)\]/); if (m) marks = m[1].split(',').map(x => x.trim().replace(/"/g, '')).filter(Boolean);
    const t = line.match(/^\s+"text": "(.*)",?$/); if (t) { corpus.push({ text: JSON.parse('"' + t[1] + '"'), block: 'CAUSAL', pool, angle: '', marks, file: 'dossierCausalProse.generated.js', poolsOf: {} }); marks = []; } } }
const slots = s => new Set([...s.matchAll(/\{([a-z_0-9]+)\}/g)].map(m => m[1]));
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
const DURATION = /\b(year|years|season|seasons|winter|winters|generation|generations|lifetime|decade|decades|month|months|week|weeks|day|days|ago|since|every|always|never|long|recent|lately|now|yet|still)\b/gi;
const COUNT = /\b(nobody|no one|a few|a dozen|dozens|hundreds|a hundred|scores|most|half|all|none|many|several|some)\b/gi;
const pairs = JSON.parse(readFileSync(PAIRS, 'utf8')); let fails = 0;
for (const p of pairs) {
  const hits = corpus.filter(c => c.text === p.before); const r = []; 
  if (hits.length === 0) r.push('NOT LOCATED in the dossier corpus (state+causal)');
  const h = hits[0];
  if (h && h.marks.length) r.push('MARKS ' + JSON.stringify(h.marks) + (h.marks.includes('dm-only') ? ' — dm-only: the AFTER must keep the mark' : ''));
  const sb = slots(p.before), sa = slots(p.after);
  if ([...sb].some(x => !sa.has(x)) || [...sa].some(x => !sb.has(x))) r.push(`SLOTS differ: before {${[...sb]}} after {${[...sa]}}`);
  if (/\d/.test(p.after)) r.push('DIGIT in AFTER'); if (/—/.test(p.after)) r.push('EM DASH in AFTER'); if (/!/.test(p.after)) r.push('EXCLAMATION in AFTER');
  if (words(p.after) > words(p.before)) r.push(`LONGER: ${words(p.before)} → ${words(p.after)} words`);
  const addedDur = [...new Set((p.after.match(DURATION) || []).map(x => x.toLowerCase()))].filter(w => !(p.before.toLowerCase().match(DURATION) || []).map(x => x.toLowerCase()).includes(w));
  if (addedDur.length) r.push('DURATION/TIME words ADDED: ' + addedDur.join(', '));
  const addedCount = [...new Set((p.after.match(COUNT) || []).map(x => x.toLowerCase()))].filter(w => !(p.before.toLowerCase().match(COUNT) || []).map(x => x.toLowerCase()).includes(w));
  if (addedCount.length) r.push('COUNT words ADDED: ' + addedCount.join(', '));
  if (h && h.block !== 'CAUSAL') { const sibs = (h.poolsOf[h.block] || []).filter(k => k !== h.pool); const sibWords = new Set(sibs.flatMap(k => k.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/)).filter(w => w.length > 3));
    const cut = [...new Set(p.before.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/))].filter(w => sibWords.has(w) && !p.after.toLowerCase().includes(w));
    if (cut.length) r.push('R4: CUT a word that names a SIBLING pool key: ' + cut.join(', ') + '  (siblings: ' + sibs.slice(0, 6).join(' | ') + ')'); }
  const ok = r.length === 0; if (!ok) fails++;
  console.log(`#${p.id} ${ok ? 'PASS(mechanical)' : 'FAIL'} ${h ? h.block + ' :: ' + h.pool + (h.angle ? ' [' + h.angle + ']' : '') : ''}`); for (const x of r) console.log('    - ' + x);
}
console.log(`\n${pairs.length - fails} pass mechanically, ${fails} fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)`);
