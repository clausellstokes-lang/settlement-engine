#!/usr/bin/env node
/**
 * E8 MEASURE (WORDS-1): every printed sentence with a reflexive (themselves, themself, himself, herself, itself), by shape,
 * and the ones whose reflexive disagrees with a gendered pronoun of the same clause ("an introduction he would rather keep
 * to themselves"). Reads a page-battery run made WITH `--views`. A MEASURE: it changes nothing.
 *
 * Usage: node e8-measure.mjs --dir=<run> [--all] [--out=<file.tsv>]
 *   default: only the sentences where a they-reflexive shares its clause with he/she/him/his/her (or a gendered reflexive
 *   shares it with they/them/their), the class N26 names; --all: every reflexive sentence, by shape.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const DIR = arg('dir'); const OUT = arg('out'); const ALL = process.argv.includes('--all');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SPLIT = /(?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu})/u;
const REFL = /\b(themselves|themself|himself|herself|itself)\b/i;
const GENDERED = /\b(he|she|him|his|her|hers)\b/i;
const THEYFORM = /\b(they|them|their|theirs)\b/i;
const mask = (/** @type {string} */ s) => s.replace(/\b\p{Lu}[\p{L}\-']*(?:\s+(?:of|the|de|van|von)?\s*\p{Lu}[\p{L}\-']*)*/gu, 'N').replace(/\d+/g, '#');

/** the clause holding the reflexive: from the last ; : — or sentence start, to the next ; : or the end @param {string} s */
function clauseOf(s, at) {
  const before = s.slice(0, at); const after = s.slice(at);
  const from = Math.max(before.lastIndexOf(';'), before.lastIndexOf(':'), before.lastIndexOf('—'));
  const toRel = after.search(/[;:—]/);
  return s.slice(from + 1, toRel < 0 ? s.length : at + toRel);
}
/** @param {string} s @returns {string|null} the class of disagreement, or null */
function disagreement(s) {
  const m = REFL.exec(s); if (!m) return null;
  const clause = clauseOf(s, m.index); const r = m[1].toLowerCase();
  if ((r === 'themselves' || r === 'themself') && GENDERED.test(clause)) return `they-reflexive beside "${GENDERED.exec(clause)[1]}"`;
  if ((r === 'himself' || r === 'herself') && THEYFORM.test(clause)) return `${r} beside "${THEYFORM.exec(clause)[1]}"`;
  if (r === 'himself' && /\b(she|her|hers)\b/i.test(clause) && !/\b(he|him|his)\b/i.test(clause)) return 'himself beside she/her only';
  if (r === 'herself' && /\b(he|him|his)\b/i.test(clause) && !/\b(she|her|hers)\b/i.test(clause)) return 'herself beside he/him only';
  return null;
}

const rows = readdirSync(join(DIR, 'rows')).filter((f) => f.endsWith('.json'));
/** @type {Map<string, any>} */ const shapes = new Map(); const tsv = []; const placesBy = {}; let places = 0;
for (const f of rows) {
  const r = JSON.parse(readFileSync(join(DIR, 'rows', f), 'utf8'));
  let hit = false; const seen = new Set();
  for (const [view, lines] of Object.entries(r.printed || {})) for (const line of lines) for (const sent of String(line).split(SPLIT)) {
    if (!REFL.test(sent)) continue;
    const why = disagreement(sent);
    if (!ALL && !why) continue;
    if (seen.has(sent)) continue; seen.add(sent); hit = true;
    tsv.push([r.seed, r.size, view, why || '-', sent.replace(/\t/g, ' ')].join('\t'));
    const sh = `${why || '-'} | ${mask(sent)}`;
    const e = shapes.get(sh) || { by: {}, n: 0, seeds: [], ex: sent, view };
    e.n++; e.by[r.size] = (e.by[r.size] || 0) + 1; if (e.seeds.length < 3) e.seeds.push(r.seed); shapes.set(sh, e);
  }
  if (hit) { places++; placesBy[r.size] = (placesBy[r.size] || 0) + 1; }
}
const list = [...shapes.entries()].sort((a, b) => b[1].n - a[1].n);
console.log(`e8-measure ${DIR}${ALL ? ' --all' : ''}: births ${rows.length}; places ${places} (${SIZES.map((z) => `${z} ${placesBy[z] || 0}`).join(', ')}); sentences ${tsv.length}; shapes ${list.length}`);
for (const [sh, e] of list) console.log(`${String(e.n).padStart(4)} [${SIZES.map((z) => e.by[z] || 0).join(' ')}] ${e.seeds.join(' ')} (${e.view})\n      ${sh.split(' | ')[0]}\n      ex: ${e.ex.slice(0, 260)}`);
if (OUT) writeFileSync(OUT, `${tsv.join('\n')}\n`);
