#!/usr/bin/env node
/**
 * NAMES-3's agreement count (rebuilt from NAMES-2's hand-back §5, the same definition). Usage:
 *   node agree.mjs <reader-tree> <out-dir> [--examples=<n>] [--json=<file>]
 * reads `<out-dir>/census.jsonl` (stored prose, the 720) and `<out-dir>/views/*.json` (the rendered pages, every view).
 *
 * A power as the SUBJECT of its clause: its article form ("the Merchant Guilds", "The Guard"; `powerNameWithArticle`)
 * at a sentence's or a clause's head (after . ! ? ; : or a dash, or opening the string), or after a subordinator ("what",
 * "that", "than", "while", "so", "but", "and" opening a clause, "when", "until", "if", "because", "whether", "as", "where",
 * "which", "unless", "before", "after", "since", "though"); a compound subject ("the X and the Y"), an object, a
 * possessive and a name behind a preposition are skipped. Its verb (the next word after a few adverbs) is read for
 * number: singular "is/has/was/does" or an -s verb; plural "are/have/were/do" or the bare form of a verb the corpus
 * also shows with -s after a power. The name's number is `pluralPowerName` (read from <reader-tree>, the same reader
 * before and after). Counts: plural power with a singular verb; singular power with a plural verb.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [readerTree, outDir] = process.argv.slice(2).map((p) => resolve(p));
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `=${d}`).split('=').slice(1).join('=');
const EXAMPLES = Number(arg('examples', '3'));
const { powerNameAfterArticle } = await import(join(readerTree, 'src/data/people/powerSentenceName.js'));
const { pluralPowerName } = await import(join(readerTree, 'src/domain/display/pluralPowerName.js'));

const ADVERBS = new Set(['still', 'now', 'also', 'already', 'itself', 'themselves', 'usually', 'often', 'only', 'just', 'never', 'always', 'rarely', 'even', 'alone', 'quietly', 'openly', 'secretly', 'simply', 'certainly', 'really', 'once', 'all', 'both', 'first', 'actually', 'effectively', 'nominally', 'formally', 'privately', 'publicly', 'currently', 'largely', 'mostly', 'no', 'longer', 'not']);
const SUBORD = new Set(['what', 'that', 'than', 'while', 'so', 'but', 'and', 'when', 'until', 'if', 'because', 'whether', 'as', 'where', 'which', 'unless', 'before', 'after', 'since', 'though', 'although', 'whatever', 'whom', 'or', 'yet', 'how', 'why', 'whenever', 'once', 'till', 'then', 'now']);
const SING_AUX = new Set(['is', 'has', 'was', 'does', "isn't", "hasn't", "wasn't", "doesn't", "it's"]);
const PLUR_AUX = new Set(['are', 'have', 'were', 'do', "aren't", "haven't", "weren't", "don't"]);
const NOT_VERB_S = new Set(['members', 'people', 'its', 'his', 'this', 'thus', 'as', 'us', 'was', 'has', 'is', 'does', 'always', 'perhaps', 'news', 'yes', 'whereas', 'towns', 'needs', 'lands', 'works', 'interests', 'its']);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every subject reading in one text. @param {string} text @param {{ name: string, body: string, plural: boolean }[]} forms */
function readings(text, forms) {
  const out = [];
  for (const f of forms) {
    const re = new RegExp(`(^|[^A-Za-z'])([Tt]he ${esc(f.body)})(?![A-Za-z])`, 'g');
    let m;
    while ((m = re.exec(text))) {
      const at = m.index + m[1].length; const end = at + m[2].length;
      const before = text.slice(0, at);
      const after = text.slice(end);
      if (/^('s|'|’s|’)/.test(after)) continue; // a possessive
      if (/^\s+and\s+(the\s+)?[A-Z]/.test(after)) continue; // the first of a compound subject
      const prevWords = before.trimEnd();
      let head = false;
      if (!prevWords || /[.!?;:—–(]$|\s-$/.test(prevWords)) head = true;
      else {
        const pm = prevWords.match(/([A-Za-z']+),?$/);
        const pw = pm ? pm[1].toLowerCase() : '';
        if (SUBORD.has(pw)) {
          if (pw === 'and' || pw === 'or') {
            // "the X and the Y wants": a compound, not Y's own clause, when a power form ends the text before "and"
            const pre = prevWords.slice(0, -pw.length).trimEnd();
            if (forms.some((g) => new RegExp(`[Tt]he ${esc(g.body)}$`).test(pre))) continue;
            if (/[A-Za-z]$/.test(pre) && !/,$/.test(pre) && !/[.!?;:]$/.test(pre)) {
              // "between the X and the Y": the "and" joins two noun phrases unless a comma opens a new clause
              if (/\b(between|both|of|with|to|from|for|against|over|among|by|and|in|on|at)\s+[^,.;:]*$/i.test(pre)) continue;
            }
          }
          head = true;
        } else if (/,$/.test(prevWords)) head = true;
      }
      if (!head) continue;
      const words = after.replace(/^[\s,]+/, '').split(/[\s,.;:!?()]+/).filter(Boolean);
      let i = 0;
      while (i < words.length && ADVERBS.has(words[i].toLowerCase())) i++;
      const v = (words[i] || '').toLowerCase();
      if (!v || !/^[a-z']+$/.test(v)) continue;
      out.push({ form: f, verb: v, at });
    }
  }
  return out;
}

/** @param {string} v */
const singularVerb = (v) => SING_AUX.has(v) || (/^[a-z]+s$/.test(v) && !/ss$/.test(v) && !NOT_VERB_S.has(v) && v.length > 2);

/** @param {string[]} powers */
function formsOf(powers) {
  const seen = new Map();
  for (const name of powers) {
    const body = powerNameAfterArticle(String(name || '').trim());
    if (!body || seen.has(body)) continue;
    seen.set(body, { name, body, plural: pluralPowerName(name) });
  }
  // the longest body first, so "the Merchant Guilds" never reads as a shorter name inside it
  return [...seen.values()].sort((a, b) => b.body.length - a.body.length);
}

/** @param {unknown} doc @param {(path: string, s: string) => void} f @param {string} [path] */
function strings(doc, f, path = '') {
  if (typeof doc === 'string') { f(path, doc); return; }
  if (Array.isArray(doc)) { doc.forEach((d) => strings(d, f, `${path}[]`)); return; }
  if (doc && typeof doc === 'object') for (const [k, v] of Object.entries(doc)) strings(v, f, path ? `${path}.${k}` : k);
}

const sigOf = (text, forms) => { let s = text; for (const f of forms) s = s.split(`the ${f.body}`).join('the {P}').split(`The ${f.body}`).join('The {P}'); return s.replace(/\d+/g, '#').replace(/(^|[^.!?;:]\s)(?:[A-Z][\w'’\u00C0-\u024F-]*)(?:\s+(?:al-|ibn |de |of |the )?[A-Z][\w'’\u00C0-\u024F-]*)*/g, '$1N'); };

function count(units) {
  // units: [{ town, where, text, forms }]
  const all = []; const sVerbs = new Set();
  for (const u of units) for (const r of readings(u.text, u.forms)) { all.push({ ...r, u }); if (singularVerb(r.verb) && !SING_AUX.has(r.verb)) sVerbs.add(r.verb); }
  const bare = new Set([...sVerbs].map((v) => v.replace(/ies$/, 'y').replace(/(ch|sh|x|ss|o)es$/, '$1').replace(/s$/, '')));
  const pluralVerb = (v) => PLUR_AUX.has(v) || bare.has(v);
  const res = { readings: all.length, pluralSing: [], singPlural: [] };
  for (const r of all) {
    if (r.form.plural && singularVerb(r.verb)) res.pluralSing.push(r);
    else if (!r.form.plural && pluralVerb(r.verb)) res.singPlural.push(r);
  }
  return res;
}

function report(label, res) {
  const towns = (xs) => new Set(xs.map((r) => r.u.town)).size;
  const lines = [`## ${label}: ${res.readings} subject readings; plural power + singular verb ${res.pluralSing.length} (${towns(res.pluralSing)} towns); singular power + plural verb ${res.singPlural.length} (${towns(res.singPlural)} towns)`];
  for (const [kind, xs] of [['plural+singular', res.pluralSing], ['singular+plural', res.singPlural]]) {
    const by = new Map();
    for (const r of xs) { const k = `${r.u.where} :: ${sigOf(r.u.text, r.u.forms).slice(0, 220)}`; if (!by.has(k)) by.set(k, []); by.get(k).push(r); }
    for (const [k, rs] of [...by.entries()].sort((a, b) => b[1].length - a[1].length)) {
      lines.push(`- ${kind} ×${rs.length} [${rs[0].form.body} / ${rs[0].verb}] ${k}`);
      for (const r of rs.slice(0, EXAMPLES - 1)) lines.push(`    e.g. ${r.u.town}: ${r.u.text.slice(Math.max(0, r.at - 60), r.at + 120)}`);
    }
  }
  return lines.join('\n');
}

// stored prose: the 720
const stored = [];
for (const line of readFileSync(join(outDir, 'census.jsonl'), 'utf8').split('\n')) {
  if (!line) continue;
  const { key, doc } = JSON.parse(line);
  const forms = formsOf((doc?.powerStructure?.factions || []).map((f) => f?.faction));
  strings(doc, (path, s) => { if (s.includes(' ') ) stored.push({ town: key, where: path, text: s, forms }); });
}
// rendered: every view's lines
const rendered = [];
let viewsDir = join(outDir, 'views'); let files = [];
try { files = readdirSync(viewsDir).filter((f) => f.endsWith('.json')); } catch { files = []; }
for (const file of files) {
  const { seed, powers, views } = JSON.parse(readFileSync(join(viewsDir, file), 'utf8'));
  const forms = formsOf(powers);
  for (const [view, lines] of Object.entries(views)) for (const l of lines) rendered.push({ town: seed, where: view, text: l, forms });
}
const S = count(stored); const R = count(rendered);
const text = `${report(`STORED (${new Set(stored.map((u) => u.town)).size} towns)`, S)}\n\n${report(`RENDERED (${files.length} towns)`, R)}\n`;
const jsonOut = arg('json', '');
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ stored: { readings: S.readings, pluralSing: S.pluralSing.length, singPlural: S.singPlural.length }, rendered: { readings: R.readings, pluralSing: R.pluralSing.length, singPlural: R.singPlural.length } }));
process.stdout.write(text);
