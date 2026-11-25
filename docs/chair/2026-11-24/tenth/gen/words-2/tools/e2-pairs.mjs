#!/usr/bin/env node
/**
 * WORDS-2 · E2 (intake 15; the tenth chair's PRERELEASE-LIST E2): THE CENSUS OF SECTIONS OF ONE PAGE THAT STATE ONE FACT TWO
 * WAYS. A MEASURE: reads a page battery's `--views` output (`rows/<seed>.json`, `.printed`: 'Group/Tab' -> lines) and, where
 * given, the records dump (`<seed>.json.gz`, for the place's name). Changes nothing.
 *
 * Every printed line is split into sentences; the place's name becomes {S}, numbers {N}. Each sentence is classed by the
 * LEXICON below: a topic (one fact a page can state) and a polarity (+ it holds, - it does not; = a level word, compared
 * by rank). A PAIR is two sentences of ONE page, in TWO DIFFERENT sections (views), on one topic, whose polarities differ
 * (CONFLICT) or, for the echo class, two sections that both say the same absence (ECHO: the "no market said twice" shape).
 * Pairs are keyed by (topic, entry A, section A, entry B, section B) and ranked by how many pages hold them.
 *
 * Usage: node e2-pairs.mjs --rows=<battery dir>/rows [--rec=<records dir>] --out=<file.tsv> [--examples=3]
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';

const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const ROWS = arg('rows'); const REC = arg('rec'); const OUT = arg('out'); const EX = Number(arg('examples', '3'));

/** topic -> [ [entryId, polarity, RegExp] ]; polarity '+' the fact holds, '-' it does not. */
export const LEXICON = {
  market: [
    ['market.none', '-', /\b(?:keeps|has|holds) no market\b|\bno market or fair\b|\bthere is no market\b|\bhaving no market\b|\bno market of (?:its|any)\b|\bwhich has no market\b|\bno stall to take and no market day\b/i],
    ['market.held', '+', /\bmarket day is\b|\bthe market (?:is|fills|runs|opens|square)\b|\b(?:its|the) market (?:draws|brings|sets)\b|\bbuyers? (?:come|crowd) to (?:the|its) market\b/i],
  ],
  food: [
    ['food.plenty', '+', /\bmore than enough to eat\b|\bgoes? (?:to bed )?hungry\b(?<=nobody[^.]*)|\bfood is (?:not|never) a worry\b|\bsuggests to a visitor that food is a worry\b|\beats well\b|\bplenty to eat\b|\bwell fed\b/i],
    ['food.short', '-', /\bhunger is (?:already )?here\b|\bmost households go short\b|\bfood trades are failing\b|\bnot enough to eat\b|\bfood the (?:town|city|village|hamlet|thorp|place) would miss\b|\bgoes? hungry\b(?<!nobody[^.]*)|\bfood is (?:short|scarce)\b|\bsell(?:s|ing)? [^.]*food it (?:cannot|can't) spare\b/i],
  ],
  defencePay: [
    ['pay.paid', '+', /\bpays wages for its defen[cs]e\b|\bpays (?:its|the) (?:soldiers|guards|watch|garrison)\b/i],
    ['pay.unpaid', '-', /\bno money to pay them\b|\b(?:soldiers|guards|watch|garrison) (?:go|goes|have gone) unpaid\b|\bwages? (?:are|is) (?:owed|late|in arrears)\b/i],
  ],
  walls: [
    ['walls.none', '-', /\bhas no wall\b|\bno wall (?:marks|to fall back)\b|\bunwalled\b|\bwithout walls\b/i],
    ['walls.some', '+', /\b(?:its|the) (?:town |city )?walls (?:are|stand|hold|keep|were)\b|\bbehind (?:its|the) walls\b|\bkeeping its walls\b|\bthinks of the (?:town |city )?walls\b/i],
  ],
  magic: [
    ['magic.none', '-', /\bmagic is not a thing\b|\bno magic (?:is|here)\b|\bknows? no magic\b|\bwithout magic\b/i],
    ['magic.some', '+', /\b(?:the Art|magic) (?:is|are) (?:used|practised|worked|common|sold|bought)\b|\b(?:its|the) (?:wizards?|mages?|sorcerers?) (?:sell|work|keep|are)\b/i],
  ],
  healer: [
    ['healer.none', '-', /\bno healer (?:is kept|here|in)\b|\bthere is no healer\b/i],
    ['healer.some', '+', /\b(?:the|its) healer (?:is|keeps|sees|tends)\b|\bthe sick (?:go|are taken) to (?:the|its) (?:healer|infirmary|hospital)\b/i],
  ],
  garrison: [
    ['garrison.none', '-', /\bkeeps no (?:garrison|soldiers|watch|militia|guard)\b|\bno one (?:here )?under arms\b|\bnobody (?:here )?under arms\b|\bhas no (?:garrison|watch|militia)\b/i],
    ['garrison.some', '+', /\bkeeps people under arms\b|\b(?:its|the) (?:garrison|watch|militia) (?:keeps|holds|walks|patrols|is (?:strong|ready))\b/i],
  ],
  wealth: [
    ['wealth.poor', '-', /\b(?:stays|is|remains) poor\b|\bin poverty\b|\bscrapes? by\b/i],
    ['wealth.rich', '+', /\bnobody here calls the \w+ poor\b|\b(?:is|grows?|has grown) (?:wealthy|rich|prosperous)\b|\bdoes well on it\b/i],
  ],
  order: [
    ['order.calm', '+', /\bnobody (?:here )?(?:locks|bars) (?:a|their) door\b|\bcrime is (?:rare|low|unknown)\b|\bthe streets are safe\b/i],
    ['order.unrest', '-', /\border among the people has gone\b|\bcrime (?:is|runs) (?:rife|high|everywhere)\b|\bthe streets are not safe\b|\briots?\b/i],
  ],
  seat: [
    ['seat.empty', '-', /\bseat (?:stands |lies |is )?empty\b|\bno one (?:holds|sits in) the seat\b|\bthe seat is vacant\b|\bnobody governs\b/i],
    ['seat.held', '+', /\bholds the seat\b|\b(?:governs|rules) (?:here|in name|{S})\b/i],
  ],
  trade: [
    ['trade.none', '-', /\balmost nothing changes hands\b|\btrade (?:has )?stopped\b|\bnobody comes in to (?:sell|trade)\b/i],
    ['trade.busy', '+', /\btrade (?:is brisk|flows|thrives)\b|\bthe roads bring buyers\b|\bfills: the roads bring\b/i],
  ],
  temple: [
    ['temple.none', '-', /\bno (?:temple|church|shrine) (?:stands|here|of its own)\b|\bkeeps no (?:temple|church|shrine|priest)\b|\bwhen a priest comes through\b/i],
    ['temple.some', '+', /\b(?:its|the) (?:temple|church|shrine|chapel) (?:stands|is|keeps|holds|bells?)\b|\b(?:the|its) priest (?:keeps|holds|leads|says)\b/i],
  ],
};
/** a sentence about the place itself (its name, "here", or the place by its size word); cards and labels are not */
export const ABOUT_PLACE = /\{S\}|\bhere\b|\bthe (?:thorp|hamlet|village|town|city|metropolis|place|settlement)\b/i;
/** sections whose sentences speak of the past or of one person: never counted for a presence topic */
export const SKIP_VIEWS = new Set(['World/History', 'World/NPCs', 'World/Relationships', 'Notes/DM Notes', 'Notes/AI Notes', 'Notes/Chronicle']);

const sentences = (line) => String(line).split(/(?<=[.;!?])\s+(?=[A-Z"“'‘(])/).map((s) => s.trim()).filter((s) => s.length > 12);
const norm = (s, name) => {
  let t = s;
  if (name) t = t.split(name).join('{S}');
  return t.replace(/\d[\d,.]*/g, '{N}');
};

const files = readdirSync(ROWS).filter((f) => f.endsWith('.json')).sort();
/** @type {Map<string, { pages: Set<string>, sizes: Record<string, number>, ex: Array<[string, string, string]> }>} */
const pairs = new Map();
/** per-topic: pages where the topic is said at all */
const topicPages = {};
let pages = 0;
for (const f of files) {
  const r = JSON.parse(readFileSync(join(ROWS, f), 'utf8'));
  if (!r.printed) continue;
  pages += 1;
  let name = null;
  if (REC && existsSync(join(REC, `${r.seed}.json.gz`))) name = JSON.parse(gunzipSync(readFileSync(join(REC, `${r.seed}.json.gz`)))).record?.name ?? null;
  /** @type {Array<{ view: string, topic: string, id: string, pol: string, text: string }>} */
  const hits = [];
  for (const [view, lines] of Object.entries(r.printed)) {
    if (!Array.isArray(lines) || SKIP_VIEWS.has(view)) continue;
    const seen = new Set();
    for (const line of lines) for (const s of sentences(line)) {
      const t = norm(s, name);
      if (!ABOUT_PLACE.test(t)) continue;
      for (const [topic, entries] of Object.entries(LEXICON)) {
        // a sentence that says both polarities of a topic is not counted for it (it states the contrast itself)
        const got = entries.filter(([, , re]) => re.test(t));
        if (got.length !== 1) continue;
        const [id, pol] = got[0];
        const k = `${topic}|${id}|${t}`;
        if (seen.has(k)) continue; seen.add(k);
        hits.push({ view, topic, id, pol, text: t });
      }
    }
  }
  const pageKeys = new Set();
  for (let i = 0; i < hits.length; i++) for (let j = 0; j < hits.length; j++) {
    const a = hits[i]; const b = hits[j];
    if (a.topic !== b.topic || a.view === b.view) continue;
    let kind = null;
    if (a.pol === '+' && b.pol === '-') kind = 'CONFLICT';
    else if (a.pol === '-' && b.pol === '-' && i < j) kind = 'ECHO';
    if (!kind) continue;
    const key = `${kind}\t${a.topic}\t${a.id}\t${a.view}\t${b.id}\t${b.view}`;
    const tkey = `${key}\t${a.text}\t${b.text}`;
    for (const k of [key, `T\t${tkey}`]) {
      if (pageKeys.has(k)) continue; pageKeys.add(k);
      const e = pairs.get(k) || { pages: new Set(), sizes: {}, ex: [] };
      e.pages.add(r.seed); e.sizes[r.size] = (e.sizes[r.size] || 0) + 1;
      if (e.ex.length < EX) e.ex.push([r.seed, a.text, b.text]);
      pairs.set(k, e);
    }
  }
}
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = [`# pages ${pages}`, ['level', 'n', ...SIZES, 'kind', 'topic', 'A', 'sectionA', 'B', 'sectionB', 'lineA', 'lineB', 'seeds'].join('\t')];
for (const [k, e] of [...pairs.entries()].sort((x, y) => y[1].pages.size - x[1].pages.size)) {
  const level = k.startsWith('T\t') ? 'template' : 'entry';
  const parts = k.replace(/^T\t/, '').split('\t');
  const head = parts.slice(0, 6);
  const lines = level === 'template' ? parts.slice(6) : [e.ex[0][1], e.ex[0][2]];
  out.push([level, e.pages.size, ...SIZES.map((z) => e.sizes[z] || 0), ...head, ...lines, e.ex.map((x) => x[0]).join(' ')].join('\t'));
}
writeFileSync(OUT, `${out.join('\n')}\n`);
console.log(`e2-pairs: ${pages} pages, ${pairs.size} pair keys -> ${OUT}`);
