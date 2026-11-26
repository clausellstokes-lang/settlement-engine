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
    ['market.held', '+', /\bmarket day is\b|\bthe market is open\b|\bthe market (?:fills|runs|opens|square)\b|\b(?:its|the) market (?:draws|brings|sets)\b|\btraders at its market\b/i],
  ],
  food: [
    ['food.plenty', '+', /\bmore than enough to eat\b|\bnobody here goes (?:to bed )?hungry\b|\bsuggests to a visitor that food is a worry\b|\bFood is not what keeps\b|\beats well\b|\bgrows (?:far |a little )?more than it eats\b|\bnobody has to think about the pace\b/i],
    ['food.short', '-', /\bhunger is (?:already )?here\b|\bhouseholds go short\b|\bfood trades are failing\b|\bnot enough to eat\b|\bfood the \{T\} would miss\b|\bgoes? hungry\b(?<!nobody here goes(?: to bed)? hungry)|\bfood is (?:short|scarce)\b|\bfalls (?:a little )?short of the food\b|\btighter belts\b/i],
  ],
  pay: [
    ['pay.paid', '+', /\bpays wages for its defen[cs]e\b|\bkeeps paid guards\b|\bdraw wages\b/i],
    ['pay.broke', '-', /\bno money to pay them\b|\bwould have to borrow the money first\b|\bnothing laid by to pay\b|\bcannot fund\b|\bno money to meet trouble\b/i],
    ['pay.flush', '+', /\baccounts have money in hand\b|\bcan buy what a bad season needs\b/i],
  ],
  walls: [
    ['walls.none', '-', /\bhas no wall\b|\bno wall (?:marks|to fall back)\b|\bunwalled\b|\bwithout walls\b/i],
    ['walls.some', '+', /\b(?:its|the) (?:\{T\} )?walls (?:are|stand|hold|keep|were)\b|\bbehind (?:its|the) walls\b|\bkeeping its walls\b|\bthinks of the (?:\{T\} )?walls\b|\bbeneath the walls\b|\bwalls are walked\b/i],
  ],
  watch: [
    ['watch.none', '-', /^There is no watch\.|\bkeeps no (?:watch|guard)\b|\bno watch (?:is kept|walks)\b/i],
    ['watch.some', '+', /^(?:Professional \{T\} watch|City watch;|Town watch;)|\bthe (?:garrison and \{T\} )?watch keep|\bthe watch (?:answers|walks|keeps|is)\b|\bCrime at \{S\} is outrunning the watch\b/i],
  ],
  magic: [
    ['magic.none', '-', /^Reliance on magic: None$|\bmagic is not a thing\b|\bwithout any magic at all\b/i],
    ['magic.relied', '+', /^Reliance on magic: Relied upon$|\bA busy market for spell services\b|\bSpell scrolls for sale\b|\bMages' district\b/i],
  ],
  healer: [
    ['healer.none', '-', /\bno healer (?:is kept|here)\b|\bthere is no healer\b|\bno healer to send for\b/i],
    ['healer.some', '+', /\b(?:the|its) healer (?:is|keeps|sees|tends)\b|\bhouse for the sick\b|\bthe sick (?:go|are taken) to\b/i],
  ],
  wealth: [
    ['wealth.poor', '-', /\b(?:stays|is|remains) poor\b|\bin poverty\b|\bscrapes? by\b|\bthe \{T\} is poor\b/i],
    ['wealth.ok', '+', /\bnobody here calls the \{T\} poor\b|\b(?:is|grows?|has grown) (?:wealthy|rich|prosperous)\b|\bdoes well on it\b|\bmoney laid by\b/i],
  ],
  order: [
    ['order.calm', '+', /\bcrime is (?:rare|low|unknown)\b|\bthe streets are safe\b|\bnobody (?:here )?(?:locks|bars) (?:a|their) door/i],
    ['order.crime', '-', /\border among the people has gone\b|\bcrime (?:is|runs) (?:rife|high|everywhere)\b|\bCrime at \{S\} is outrunning\b|\brecord of crimes at \{S\} grows faster\b|\bthe streets (?:stay )?badly (?:watched|guarded)\b/i],
  ],
  rule: [
    ['rule.stable', '+', /^Governed by .* · Stable$/],
    ['rule.broken', '-', /\bno stable governing authority\b|\bno longer trust those in charge\b|\bopen doubt here about whether\b|^Governed by .* · (?:Fractured|Contested|Unstable|Collapsed)$/i],
  ],
  seat: [
    ['seat.empty', '-', /\bseat (?:stands |lies |is )?empty\b|\bno one (?:holds|sits in) the seat\b|\bthe seat is vacant\b|\bnobody governs\b/i],
    ['seat.held', '+', /\bholds the seat\b|\bgoverns in name\b/i],
  ],
  trade: [
    ['trade.none', '-', /\balmost nothing changes hands\b|\btrade (?:has )?stopped\b|\bnobody comes in to (?:sell|trade)\b|\bLittle that comes past \{S\} stops there\b/i],
    ['trade.busy', '+', /\bthe roads bring buyers\b|\bthe road is busy\b|\b's road is busy\b|\bBuyers from outside come\b|\bThe carts that leave \{S\}\b/i],
  ],
  temple: [
    ['temple.none', '-', /\bno (?:temple|church|shrine) (?:stands|here|of its own)\b|\bkeeps no (?:temple|church|shrine|priest)\b|\bwhen a priest comes through\b/i],
    ['temple.some', '+', /\b(?:its|the) (?:temple|church|shrine|chapel) (?:stands|is|keeps|holds|bells?)\b|\bthe priest (?:has|keeps|holds|leads|says|wants)\b/i],
  ],
  defence: [
    ['defence.armed', '+', /\bkeeps people under arms\b|\bpays wages for its defen[cs]e\b|\bkeeps paid guards\b/i],
    ['defence.bare', '-', /^There is no watch\.|\bnobody would\b(?=[^.]*threat)|\bhas no wall\b|\bno one (?:here )?under arms\b/i],
  ],
  seatShape: [
    ['seat.one', '+', /^A headman settles disputes\b|^A (?:lord's steward|reeve elected|single household head)\b|\bOne household head acts\b/i],
    ['seat.many', '-', /^The ruling (?:two|three|four|five) of (?:Headman's Authority|Elected Reeve|Feudal Stewardship)\b|\bthe whole (?:Headman's Authority|Elected Reeve) must agree\b/i],
  ],
  viability: [
    ['viable.no', '-', /^Viability=Not viable$/],
    ['viable.yes', '+', /\bpays its way from year to year\b/i],
  ],
  danger: [
    ['danger.none', '-', /\bnothing threatens\b|\bno threat (?:at|near)\b|\bsafe from (?:raids|beasts|monsters)\b/i],
    ['danger.beasts', '+', /\bbeasts of the country around it come right up\b|\bMonsters prowl\b|\bMonster attacks\b|\babandoned after attacks\b/i],
  ],
};
/**
 * THE LABELS: a health or foundations label is a claim too. Each row: the label's words, the topic it states, and its values'
 * polarity (a value not listed is a middle value: neither). The page prints them as "<Label><Value>" (Foundations, Food
 * Security) or as two lines (the Systems Health grid: "Prosperity", "Comfortable"); both are read as "<Label>=<Value>".
 */
export const LABELS = [
  ['Food Security', 'food', { Secure: '+', Pressured: '-', Deficit: '-', 'Deficit — active famine': '-' }],
  ['Food', 'food', { Secure: '+', Pressured: '-', Deficit: '-', 'Deficit — active famine': '-' }],
  ['Prosperity', 'wealth', { Prosperous: '+', Comfortable: '+', Poor: '-', Struggling: '-' }],
  ['Safety', 'order', { Unsafe: '-', Dangerous: '-', Desperate: '-', Volatile: '-' }],
  ['Law & order', 'order', { Adequate: '+', Critical: '-', Collapsed: '-' }],
  ['Healing capacity', 'healer', { Adequate: '+' }],
  ['Public legitimacy', 'rule', { Contested: '-' }],
  ['Ruling authority', 'rule', { Critical: '-' }],
  ['Defense', 'defence', { Fortress: '+', 'Well-defended': '+', Defensible: '+', Vulnerable: '-', Undefended: '-' }],
  ['Defense readiness', 'defence', { Adequate: '+', Critical: '-', Collapsed: '-' }],
  ['Viability', 'viability', { 'Not viable': '-' }],
  ['Trade connectivity', 'trade', { Adequate: '+', Critical: '-' }],
];
const LABEL_RE = new RegExp(`^(${LABELS.map(([l]) => l.replace(/[&]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|')})=?(.+)$`);
/** a health label's value as a polarity (a middle value is neither) */
const LABEL_POLARITY = { Secure: '+', Adequate: '+', Pressured: '-', Strained: '-', Deficit: '-', Critical: '-', Collapsed: '-', Famine: '-',
  Prosperous: '+', Wealthy: '+', Opulent: '+', Comfortable: '+', Poor: '-', Destitute: '-', Struggling: '-',
  Safe: '+', Secure2: '+', Unsafe: '-', Dangerous: '-', Lawless: '-' };
/** a sentence about the place itself (its name, "here", or the place by its size word), or a label line; cards are not */
export const ABOUT_PLACE = /\{S\}|\bhere\b|\{T\}|\bthe (?:place|settlement)\b|^(?:Food Security|Prosperity|Safety)\w|^Governed by|^Reliance on magic|^There is no watch|^(?:Professional \{T\} watch|City watch;|Town watch;)|^A headman settles|^A (?:lord's steward|reeve elected)|^The ruling (?:two|three|four|five) of|\bmust agree\b|^Viability=|\bno stable governing authority\b|\bA busy market for spell services\b|\bSpell scrolls for sale\b|\bMages' district\b|\bno longer trust those in charge\b/i;
export const SKIP_VIEWS = new Set(['World/History', 'World/NPCs', 'World/Relationships', 'Notes/DM Notes', 'Notes/AI Notes', 'Notes/Chronicle']);

const sentences = (line) => String(line).split(/(?<=[.;!?])\s+(?=[A-Z"“'‘(])/).map((s) => s.trim()).filter((s) => s.length > 12);
const norm = (s, name) => {
  let t = s;
  if (name) t = t.split(name).join('{S}');
  return t.replace(/\b(?:thorp|hamlet|village|town|city|metropolis)\b/g, '{T}').replace(/\d[\d,.]*/g, '{N}');
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
  // else the Overview's first line: "<name><size word>· <population> pop.· …"
  if (!name) {
    const head = String(r.printed?.['Summary/Overview']?.[0] ?? '').split('·')[0].trim();
    name = head.endsWith(r.size) ? head.slice(0, -r.size.length).trim() : head || null;
  }
  /** @type {Array<{ view: string, topic: string, id: string, pol: string, text: string }>} */
  const hits = [];
  for (const [view, lines] of Object.entries(r.printed)) {
    if (!Array.isArray(lines) || SKIP_VIEWS.has(view)) continue;
    const seen = new Set();
    // a health label printed as two lines ("Prosperity", "Comfortable") is read as one
    for (let li = 0; li < lines.length; li++) {
      const l = String(lines[li]);
      const two = /^(?:Prosperity|Safety|Defense|Viability)$/.test(l) && typeof lines[li + 1] === 'string' ? `${l}=${lines[li + 1]}` : null;
      const m = (two ?? l).match(LABEL_RE);
      if (m) {
        const row = LABELS.find(([lab]) => lab === m[1]);
        const pol = row?.[2][m[2]];
        const k = `label|${m[1]}=${m[2]}`;
        if (pol && !seen.has(k)) { seen.add(k); hits.push({ view, topic: row[1], id: `label.${m[1]}`, pol, text: `${m[1]}: ${m[2]}` }); }
        continue;
      }
    }
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
    if (a.topic !== b.topic || (a.view === b.view && a.text === b.text)) continue;
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
