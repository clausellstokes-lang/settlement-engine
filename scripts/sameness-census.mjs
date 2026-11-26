#!/usr/bin/env node
/**
 * scripts/sameness-census.mjs — SAME-1's RENDERED SAMENESS CENSUS (2026-11-20; brief 1, docs/chair/2026-11-20/content/
 * same/SAME-1-CENSUS-BRIEF.md): every sentence the owner's page prints, per slot, and how far places of one size share it.
 *
 * Usage (read-only):
 *   node scripts/sameness-census.mjs --measure [--seed-prefix=hxd] [--n=50] [--workers=4] [--out=<dir>]
 *        births 50 places a size (`<prefix>-<size>-<i>`, the chair's stored census's birth), renders each through
 *        scripts/census/sameness-census.render.census.jsx (its own vitest config, <workers> forks) to `<out>/rows/`,
 *        then counts it;
 *   node scripts/sameness-census.mjs --measure --plan=<file.json> [--text] [--workers=4] --out=<dir>
 *        renders the caller's own births instead: rows `[{ seed, size, config }]`, each config passed to the birth as given
 *        with the store's content runtime at rest (the renderer's birthOf; SAME-2 part 3, granted by the chair; no check
 *        reads it); --text also writes <out>/text/<seed>.txt, UNMASKED, every surface's lines in page order under headings;
 *   node scripts/sameness-census.mjs --from=<dir> [--confirm=<dir>] [--docs=<dir>] [--commit=<sha>] [--wall=<text>]
 *        counts a rendered run; with --docs writes SAME-CENSUS.md and tables-<size>.txt (beside it, --confirm's run).
 *
 * THE RULE. MASK (census.mjs's): the place's own proper names (its name; each person's name and each word of it longer
 * than three letters; each power's `name` and `faction`), longest first, to `#`; every run of digits to `0`.
 * SENTENCE: a printed line split at `.`/`!`/`?`/`…` followed by space and a capital, a quote or a mask; a masked piece of
 * at least 25 characters with a space. SLOT: `surface | source`, SOURCE the shortest stored path (indices `[]`) whose
 * masked string holds the sentence word for word, else `COMPOSED@<heading>`. Per slot and size: holders, distinct,
 * sentences per place, TOP (commonest sentence, its places / holders), SEEN (the mean share of a place's sentences at the
 * slot that a second place also prints). `count()` is a pure function of the rendered rows (brief 2 reuses it).
 *
 * THE DOOR (brief 2, docs/chair/2026-11-20/content/same/SAME-1-DOOR-BRIEF.md, and the chair's amendments of 2026-11-20):
 *   node scripts/sameness-census.mjs --check   [--from=<hxd run>] [--confirm=<hxu run>] [--n=<n>] [--seed-prefix=<p>]
 *        renders hxd (150 a size, the six sizes), judges every slot against scripts/census/sameness-census.register.json,
 *        renders hxu only when a rise needs confirming; exits 1 on a red. A foreign --n or --seed-prefix is a PROBE.
 *   node scripts/sameness-census.mjs --write   adds an entry for every unregistered slot (>= MIN_PLACES places) at the
 *        HIGHER of hxd and hxu rounded up to 0.01, retires stale entries by name; refuses (exit 1) on a confirmed rise.
 *   node scripts/sameness-census.mjs --tighten THE CHAIR'S DOOR: lowers each ceiling loose on both readings, never raises.
 * TWO LAWS: A PRINTED SLOT WITH NO ROW REDS; A CEILING ONLY TIGHTENS.
 * LAW 1 IS TIED TO THE BAR, BY SIZE, WITH NO SECOND SAMPLE (the chair's ruling, 2026-11-20 18:52 UTC): an unregistered
 * slot REDS only where its COMMONEST SENTENCE prints in at least ceil(n x LAW1_RED_SHARE) places of a size (15 of 150: two
 * thirds of the 15% bar); one whose commonest sentence prints in at least ceil(n x LAW1_WATCH_SHARE) (8 of 150) is listed
 * as WATCH by --check, not red; below that it is neither (counted in one NOTE line). The commonest sentence's places, not
 * the slot's: a slot printed everywhere with every sentence distinct is neither. No confirmation corpus is read for law 1.
 * MIN_PLACES and NOISE_SE stay for the registered rows' law of rises (and --write still registers every slot at MIN_PLACES).
 * THE SLOT is `<surface> | <position>`: where the page prints the line, whatever it says (positionOf). Every wording a
 * position prints is one slot (a pool's lines are one slot); the stored paths are its attribution, found word for word or
 * as the longest stored sentence a printed one contains (a label-prefixed line: "Constraint: <stored sentence>").
 * THE READING: shareAll (the commonest sentence's places over ALL the size's places) is the ceiling's reading for a slot
 * printing at most 1.5 sentences a place; SEEN for a slot printing more; shareIn (over the holders) is printed beside.
 * MIN_PLACES and NOISE_SE are measured; their measures are written beside them (MIN_PLACES_MEASURE, NOISE_SE_MEASURE).
 * WHAT THE DOOR DOES NOT COUNT (E13d; the owner, deferring it to the chair: "Whether the repeated-wording check should skip
 * job titles and fixed captions. I recommend yes."; the tenth chair's G35: "the sameness door does not count a role title or
 * a fixed caption as a drawn sentence"): a printed sentence that IS a role title (a face's title in `faceHonorifics.js`'s
 * tables, the catalogue's faces, the mints' titles in `mintTitles.js`) or IS a sentence of a fixed section caption
 * (`copy/sectionHelp.js`) is not counted at any slot: its share is how many places hold that person or that section, not
 * how often a draw repeats. The set is DERIVED BY IMPORT from those homes (`notDrawnSentences`), never typed; it is matched
 * by the whole sentence's text, never by its length, and no slot is skipped whole (a slot that prints a drawn sentence
 * beside a title is still counted by its drawn sentences). Held by tests/lint/samenessCensus.walker.test.js.
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FACE_HONORIFICS, FACE_HONORIFICS_INLAND, FACE_HONORIFICS_BY_CULTURE } from '../src/data/faceHonorifics.js';
import { faceRows, FACE_SEAT } from '../src/data/institutionalCatalog.js';
import { SEAT_MINT_TITLES, OTHER_MINT_ROWS } from '../src/generators/people/mintTitles.js';
import { SECTION_HELP, SYSTEMS_HEALTH_VINTAGE } from '../src/copy/sectionHelp.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDER = join(ROOT, 'scripts/census/sameness-census.render.census.jsx');
export const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
export const MIN_HOLDERS = 5;

const esc = (/** @type {string} */ x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * census.mjs's mask for one born place.
 * @param {any} t @returns {(s: string) => string}
 */
export function maskerFor(t) {
  const names = new Set();
  const add = (/** @type {unknown} */ x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
  add(t.name);
  for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
  for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
  return (s) => (re ? String(s).replace(re, '#') : String(s)).replace(/\d+/g, '0');
}
const SPLIT = /(?<=[.!?…])\s+(?=[A-Z"“'‘#0])/u;
/** The sentences of one masked line (census.mjs's threshold). @param {string} line @returns {string[]} */
export const sentencesOf = (line) => String(line).split(SPLIT).map((s) => s.trim()).filter((s) => s.length >= 25 && s.includes(' '));
/**
 * THE ROLE TITLES, from their own homes (E13d, G35): every face title `faceHonorifics.js` keys its honorifics by (its walker
 * pins every catalogue face and mint title there), the catalogue's own faces, and the two mints' titles.
 * @returns {string[]}
 */
export function roleTitles() {
  const titles = new Set([...Object.keys(FACE_HONORIFICS), ...Object.keys(FACE_HONORIFICS_INLAND)]);
  for (const byTitle of Object.values(FACE_HONORIFICS_BY_CULTURE)) for (const t of Object.keys(byTitle)) titles.add(t);
  for (const r of faceRows()) if (typeof r.face === 'string' && r.face !== FACE_SEAT) titles.add(r.face);
  for (const t of Object.values(SEAT_MINT_TITLES)) titles.add(String(t));
  for (const row of Object.values(OTHER_MINT_ROWS)) titles.add(String(row.title));
  return [...titles].sort();
}
/** THE FIXED SECTION CAPTIONS (E13d, G35): every `?` pill's words and the vintage sentence. @returns {string[]} */
export function fixedCaptions() { return [...Object.values(SECTION_HELP), SYSTEMS_HEALTH_VINTAGE]; }
/**
 * THE SENTENCES THE DOOR DOES NOT COUNT (E13d, G35): each role title as printed (its own case and sentence case) and each
 * sentence of each fixed caption, masked as the door masks (digits to `0`) and cut by the door's own `sentencesOf`, so
 * only what the door would otherwise count is here. Derived by import, never typed.
 * @returns {Set<string>}
 */
export function notDrawnSentences() {
  const out = new Set();
  const add = (/** @type {string} */ text) => { for (const s of sentencesOf(String(text).replace(/\d+/g, '0'))) out.add(s); };
  for (const t of roleTitles()) { add(t); add(t.charAt(0).toUpperCase() + t.slice(1)); }
  for (const c of fixedCaptions()) add(c);
  return out;
}
const NOT_DRAWN = notDrawnSentences();
/** The surface FAMILY a slot's surface belongs to (table c). @param {string} surface */
export const familyOf = (surface) => (surface.startsWith('web:') ? 'web' : surface);

/**
 * THE COUNT: a pure function of rendered rows (one size). Returns the slot rows and the twice-printed rows.
 * @param {Array<{ seed: string, surfaces: Record<string, Array<[string, string]>>, stored: Record<string, string[]> }>} rows
 */
export function count(rows) {
  /** @type {Map<string, { surface: string, source: string, paths: string[], heading: string, bySentence: Map<string, Set<number>> }>} */
  const slots = new Map();
  /** @type {Map<string, { family: string, slots: string[], places: Set<number>, example: string }>} */
  const twice = new Map();
  // THE HEADING a composed sentence is filed under: the innermost of its open headings that names no place's own thing
  // (no mask, no count, no rank dots) and that heads that surface in at least 30% of the size's places.
  /** @type {Map<string, Map<string, number>>} */ const headSeen = new Map();
  for (const row of rows) for (const [surface, lines] of Object.entries(row.surfaces)) {
    let m = headSeen.get(surface); if (!m) { m = new Map(); headSeen.set(surface, m); }
    for (const h of new Set(lines.flatMap(([, hp]) => (hp ? hp.split(' › ') : [])))) m.set(h, (m.get(h) || 0) + 1);
  }
  const headingOf = (/** @type {string} */ surface, /** @type {string} */ hp) => {
    const m = headSeen.get(surface); const parts = hp ? hp.split(' › ') : [];
    for (let k = parts.length - 1; k >= 0; k--) { const h = parts[k]; if (!/[#0●]/.test(h) && (m?.get(h) || 0) >= 0.3 * rows.length) return h; }
    return '(none)';
  };
  rows.forEach((row, i) => {
    /** @type {Map<string, Map<string, Set<string>>>} family -> sentence -> slots */
    const fam = new Map();
    for (const [surface, lines] of Object.entries(row.surfaces)) {
      for (const [line, hp] of lines) {
        const heading = headingOf(surface, hp);
        for (const s of sentencesOf(line)) {
          const paths = row.stored[s];
          let source; let all = [];
          if (paths && paths.length) { all = [...paths].sort((a, b) => a.length - b.length || (a < b ? -1 : 1)); source = all[0]; } else source = `COMPOSED@${heading}`;
          const key = `${surface} | ${source}`;
          let sl = slots.get(key);
          if (!sl) { sl = { surface, source, paths: all, heading, bySentence: new Map() }; slots.set(key, sl); }
          for (const p of all) if (!sl.paths.includes(p)) sl.paths.push(p);
          let st = sl.bySentence.get(s); if (!st) { st = new Set(); sl.bySentence.set(s, st); }
          st.add(i);
          const f = familyOf(surface);
          let fm = fam.get(f); if (!fm) { fm = new Map(); fam.set(f, fm); }
          let ss = fm.get(s); if (!ss) { ss = new Set(); fm.set(s, ss); }
          ss.add(key);
        }
      }
    }
    for (const [f, fm] of fam) for (const [s, ks] of fm) {
      if (ks.size < 2) continue;
      const slotList = [...ks].sort();
      const k = `${f} :: ${slotList.join(' ++ ')}`;
      let tw = twice.get(k); if (!tw) { tw = { family: f, slots: slotList, places: new Set(), example: s }; twice.set(k, tw); }
      tw.places.add(i);
    }
  });
  const out = [];
  for (const [key, sl] of slots) {
    /** @type {Map<number, { c: number, sh: number }>} */ const perTown = new Map();
    let top = ''; let topN = 0; const holders = new Set();
    for (const [s, st] of sl.bySentence) {
      if (st.size > topN) { topN = st.size; top = s; }
      for (const i of st) { holders.add(i); const o = perTown.get(i) || { c: 0, sh: 0 }; o.c++; o.sh += st.size - 1; perTown.set(i, o); }
    }
    const H = holders.size; if (H < MIN_HOLDERS) continue;
    let seen = 0; for (const o of perTown.values()) seen += o.sh / o.c / Math.max(1, H - 1);
    seen /= perTown.size;
    const perPlace = [...perTown.values()].reduce((a, o) => a + o.c, 0) / H;
    out.push({ key, surface: sl.surface, source: sl.source, paths: sl.paths, heading: sl.heading, holders: H, places: rows.length, distinct: sl.bySentence.size, perPlace: +perPlace.toFixed(2), topN, topShare: +(topN / H).toFixed(2), seen: +seen.toFixed(3), top });
  }
  const tw = [...twice.values()].map((t) => ({ family: t.family, slots: t.slots, places: t.places.size, example: t.example })).sort((a, b) => b.places - a.places);
  return { slots: out, twice: tw };
}

// ── the module index: string and template fragments of src/**/*.{js,jsx}, digits masked ──
const K = 14;
/** @returns {Map<string, Array<{ frag: string, file: string }>>} */
export function moduleIndex() {
  /** @type {Map<string, Array<{ frag: string, file: string }>>} */ const idx = new Map();
  const files = [];
  const walk = (/** @type {string} */ d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|jsx)$/.test(e.name) && !/\.test\./.test(e.name)) files.push(p); } };
  walk(join(ROOT, 'src'));
  const LIT = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  for (const f of files) {
    const src = readFileSync(f, 'utf8'); const rel = relative(ROOT, f);
    for (const m of src.matchAll(LIT)) {
      const body = m[1] ?? m[2] ?? m[3] ?? '';
      const parts = m[3] != null ? body.split(/\$\{[^}]*\}/) : [body];
      for (let p of parts) {
        p = p.replace(/\\(['"`\\])/g, '$1').replace(/\s+/g, ' ').replace(/\d+/g, '0').trim();
        if (p.length < K || !p.includes(' ')) continue;
        const head = p.slice(0, K);
        let a = idx.get(head); if (!a) { a = []; idx.set(head, a); }
        if (!a.some((x) => x.frag === p && x.file === rel)) a.push({ frag: p, file: rel });
      }
    }
  }
  return idx;
}
/** The module whose longest fragment the sentence contains. @param {string} s @param {ReturnType<typeof moduleIndex>} idx */
export function moduleOf(s, idx) {
  let best = null;
  for (let i = 0; i + K <= s.length; i++) {
    const a = idx.get(s.slice(i, i + K)); if (!a) continue;
    for (const x of a) if ((!best || x.frag.length > best.frag.length) && s.startsWith(x.frag, i)) best = x;
  }
  return best;
}

// ── the class: decided by the source (path, module, heading); `?` where the rule guesses ──
/** THE HAND CLASSES (scripts/census/sameness-census.classes.json), read before the rule. */
export const HAND_CLASSES = JSON.parse(readFileSync(join(ROOT, 'scripts/census/sameness-census.classes.json'), 'utf8'));
/** The hand class of a row, by its most specific key. @param {any} r @returns {{ cls: string, why: string } | null} */
export function handClassOf(r) {
  const base = r.source.startsWith('COMPOSED@') ? `${r.source} ~ ${r.module || 'unfound'}` : r.source;
  const hit = HAND_CLASSES[`${base} ~ ${r.top}`] || HAND_CLASSES[base];
  return hit && typeof hit === 'object' ? { cls: hit.cls, why: `hand: ${hit.why}` } : null;
}
/** @param {any} r @returns {{ cls: string, why: string }} */
export function classOf(r) {
  const hand = handClassOf(r); if (hand) return hand;
  const p = r.source.startsWith('COMPOSED@') ? '' : r.source;
  const leaf = p.split('.').pop() || '';
  const mod = r.module || '';
  const few = r.distinct <= Math.max(8, 0.3 * r.holders);
  if (/(institutions|services|amenities|goods|resources|buildings)\[\]\.(desc|description|definition|blurb|flavou?r|colou?r)$/i.test(p) || /^availableServices\.[a-zA-Z]+\[\]\.(desc|description|name)$/.test(p)) return { cls: 'CATALOGUE', why: `${p}: a house's or service's own definition` };
  if (/activeChains\[\]\.(entrepotNote|label|outputs\[\]|desc)$|incomeSources\[\]\.(desc|label)$|institutionalServices\[\]\.(output|exportLabel)$/.test(p)) return { cls: 'CATALOGUE?', why: `${p}: a chain's or income source's own definition` };
  if (!/[.!?…]["”’]?$/.test(r.top) && r.top.length < 60) return { cls: 'LABEL?', why: 'a name or a band word, not a sentence (no sentence end)' };
  if (/src\/data\/.*(institution|service|catalog|good|building|supplyChain|resourceChain)|institutionDesc|serviceDesc|[Cc]atalog/.test(mod)) return { cls: 'CATALOGUE?', why: `composed from ${mod.split('/').pop()}: a catalogue's text` };
  if (/src\/copy\/|sectionHelp|[Hh]elp(Text)?\.js|COPY|[Cc]opy\.js|[Ll]abels?\.js|uiText|emptyState/.test(mod)) return { cls: 'LABEL', why: `the page's own words (${mod.split('/').pop()})` };
  if (r.distinct === 1) return { cls: 'LABEL?', why: 'one sentence for every holder: a fixed caption' };
  if (!p && (/src\/(components|pdf)\//.test(mod) || mod === 'unfound') && r.seen >= 0.75) return { cls: 'LABEL?', why: `composed at display (${mod.split('/').pop()}), the same for nearly every holder: the page's own furniture` };
  if (/hook|rumou?r|history|founding|event|conflict|tension|story|narrat|pool|daily|quirk|secret|goal|want|motive|voice|opening|scene|legend|tradition|festival|relationship|backstory|personality|appearance/i.test(p)) return { cls: 'NARRATIVE', why: `${p}: a story field of the place` };
  if (/(Desc|Description|Label|Note|Status|Band|Tier|Verdict|Summary|situation|assessment|Word|Words|Line|Reason|reason)$/.test(leaf) && few) return { cls: 'STATE?', why: `${leaf}: a few sentences (${r.distinct}) for ${r.holders} places, read off a band` };
  if (/[Bb]and|[Tt]ier|[Vv]erdict|[Tt]hreshold|[Ww]ords|[Ss]tate[A-Z.]|[Ss]tatus/.test(mod) && !/[Pp]ool|[Pp]ick|[Rr]andom|[Cc]hoose/.test(mod) && few) return { cls: 'STATE?', why: `composed by ${mod.split('/').pop()}, a state-to-words module, few sentences (${r.distinct})` };
  if (/hook|rumou?r|history|founding|event|conflict|tension|story|narrat|[Pp]ool|daily|quirk|secret|goal|want|motive|voice|opening|scene|prose|[Pp]rose/i.test(`${mod} ${r.heading || ''}`)) return { cls: 'NARRATIVE?', why: `composed by ${mod.split('/').pop() || 'an unfound module'}: a story or pool module` };
  if (few && r.perPlace <= 1.5) return { cls: 'STATE?', why: `few sentences (${r.distinct}) one a place: likely a band's sentence` };
  return { cls: 'NARRATIVE?', why: `many sentences (${r.distinct}) composed per place; pool or story not proven` };
}

// ── THE DOOR (brief 2, docs/chair/2026-11-20/content/same/SAME-1-DOOR-BRIEF.md) ──
/** THE REGISTER: scripts/census/sameness-census.register.json. */
export const REGISTER_PATH = join(ROOT, 'scripts/census/sameness-census.register.json');
/** The corpus the register is banked on, and its confirmation corpus (the same plan under another prefix). */
export const CORPUS = Object.freeze({ prefix: 'hxd', confirm: 'hxu', n: 150, sizes: SIZES });
/** A slot printing at most this many sentences a place is met again by its TOP share; else by its SEEN. */
export const ONE_A_PLACE = 1.5;
/** --write registers every slot printed in this many places of a size (law 1 no longer reds by it: LAW1_RED_SHARE). */
export const MIN_PLACES = 5;
/** Why MIN_PLACES is 5 (the smallest value at which hxd and hxu agree on the slot set). */
export const MIN_PLACES_MEASURE = 'hxd vs hxu at 23893d8d4, 150 a size: 55 slots printed in two or more places of a size in one corpus and in none of the other, by holders 2+: 55, 3+: 24, 4+: 6, 5+: 0; so from 5 places the two corpora agree on every slot (at 50 a size the same count needs 6: 2+: 66, 5+: 7, 6+: 0).';
/** LAW 1, RED: an unregistered slot whose commonest sentence prints in at least ceil(n x this) places of a size. */
export const LAW1_RED_SHARE = 0.1;
/** LAW 1, WATCH: an unregistered slot whose commonest sentence prints in at least ceil(n x this) places (below red). */
export const LAW1_WATCH_SHARE = 8 / 150;
/** Why law 1 reds and watches where it does. */
export const LAW1_MEASURE = 'the chair\'s ruling, 2026-11-20 18:52 UTC: "LAW 1 IS TIED TO THE BAR, BY SIZE, WITH NO SECOND SAMPLE": RED at 15 of 150 places of some size for ONE sentence of the slot (two thirds of the 15% bar), WATCH at 8 to 14 of 150 (8 of 150 the watch line), else neither. Why: at MIN_PLACES 5 law 1 false-reddened a fresh sample (hxw: 83 unregistered slots at 5 to 10 places, 0 rises).';
/** The places of a size of n at which an unregistered slot's commonest sentence reds (15 at 150). @param {number} n */
export const law1RedPlaces = (n) => Math.ceil(n * LAW1_RED_SHARE - 1e-9);
/** The places of a size of n at which it is listed as watch (8 at 150). @param {number} n */
export const law1WatchPlaces = (n) => Math.ceil(n * LAW1_WATCH_SHARE - 1e-9);
/** A rise reds beyond this many standard errors of a share at the ceiling, on both readings. */
export const NOISE_SE = 4;
/** Why NOISE_SE is 4. */
export const NOISE_SE_MEASURE = 'hxd vs hxu at 23893d8d4, 150 a size, rows with 5+ holders: one corpus read against ceilings banked on the other alone puts over 3 SE 19 of 3150 rows (hxu) and 32 of 3186 (hxd), over 4 SE 5 and 2 (max 5.16 SE: SEEN is not binomial and runs wider). A red needs both readings over, so at 4 SE a re-dealt tree expects about (5/3150)^2 x 3150 = 0.008 false reds; at 3, 0.1 to 0.3.';

/** An index of a place's stored sentences by their first 16 characters (the containment attribution). @param {Record<string, string[]>} stored */
export function storedHeads(stored) {
  /** @type {Map<string, string[]>} */ const m = new Map();
  for (const t of Object.keys(stored)) { const h = t.slice(0, 16); const a = m.get(h); if (a) a.push(t); else m.set(h, [t]); }
  return m;
}
/**
 * THE ATTRIBUTION: the stored paths of a printed sentence: the paths that hold it word for word, else (SAME-1's
 * amendment, 2026-11-20: a label-prefixed line, "Constraint: <stored sentence>") the paths of the LONGEST stored sentence
 * the printed one contains; else none (composed at display). The printed sentence stays the measured text.
 * @param {string} s @param {Record<string, string[]>} stored @param {Map<string, string[]>} heads @returns {string[]}
 */
export function attributionOf(s, stored, heads) {
  if (stored[s]?.length) return stored[s];
  let best = '';
  for (let i = 1; i + 25 <= s.length; i++) {
    const a = heads.get(s.slice(i, i + 16)); if (!a) continue;
    for (const t of a) if (t.length > best.length && s.startsWith(t, i)) best = t;
  }
  return best ? stored[best] : [];
}
/**
 * THE POSITION: where the page prints a line, whatever it says — the renderer's fourth field: on the web the named
 * React components and each element's place among its siblings below the tab's panel (a keyed list item is `*`, so a
 * list is one position), on the PDF the same over SettlementPDF's element tree, on the session sheet the leaf's key path. @param {string} surface @param {any[]} line
 */
export const positionOf = (surface, line) => `${surface} | ${line[3] ?? '?'}`;
/**
 * THE SLOT KEY: `<surface> | <position>` (the chair's rulings of 2026-11-20: a slot is keyed by surface and printed
 * position, the stored path its attribution; a pool's lines printed at one position are ONE slot, whichever stored path
 * holds the wording). The stored paths are recorded beside it (`paths`), never part of its identity.
 * @param {string} surface @param {any[]} line
 */
export const slotKey = (surface, line) => positionOf(surface, line);
/**
 * THE DOOR'S MEASURE (one size): per slot, places (holders), `of` (the size's places), distinct sentences, sentences a
 * place, shareAll (the commonest sentence's places / ALL the size's places: the chair's bar), shareIn (its places / the
 * holders), SEEN (count()'s), the commonest sentence, and its attribution (path -> places).
 * @param {Array<{ surfaces: Record<string, Array<[string, string, string?, string?]>>, stored: Record<string, string[]> }>} rows
 */
export function measureSlots(rows) {
  /** @type {Map<string, { bySentence: Map<string, Set<number>>, paths: Map<string, Set<number>>, exactOnly: boolean }>} */ const slots = new Map();
  rows.forEach((row, i) => {
    const heads = storedHeads(row.stored);
    for (const [surface, lines] of Object.entries(row.surfaces)) for (const line of lines) for (const s of sentencesOf(line[0])) {
      if (NOT_DRAWN.has(s)) continue; // E13d (G35): a role title or a fixed caption is not a drawn sentence
      const paths = attributionOf(s, row.stored, heads);
      const key = slotKey(surface, line);
      let sl = slots.get(key); if (!sl) { sl = { bySentence: new Map(), paths: new Map(), exactOnly: true }; slots.set(key, sl); }
      if (paths.length && !row.stored[s]?.length) sl.exactOnly = false;
      let st = sl.bySentence.get(s); if (!st) { st = new Set(); sl.bySentence.set(s, st); } st.add(i);
      for (const p of paths) { let ps = sl.paths.get(p); if (!ps) { ps = new Set(); sl.paths.set(p, ps); } ps.add(i); }
    }
  });
  /** @type {Map<string, { places: number, of: number, distinct: number, perPlace: number, topPlaces: number, shareAll: number, shareIn: number, seen: number, sentence: string, paths: Record<string, number>, contained: boolean }>} */ const out = new Map();
  for (const [key, sl] of slots) {
    /** @type {Map<number, { c: number, sh: number }>} */ const per = new Map(); let top = ''; let topN = 0;
    for (const [s, st] of sl.bySentence) {
      if (st.size > topN || (st.size === topN && s < top)) { topN = st.size; top = s; }
      for (const i of st) { const o = per.get(i) || { c: 0, sh: 0 }; o.c++; o.sh += st.size - 1; per.set(i, o); }
    }
    const H = per.size; let seen = 0; for (const o of per.values()) seen += o.sh / o.c / Math.max(1, H - 1); seen /= H;
    const perPlace = [...per.values()].reduce((a, o) => a + o.c, 0) / H;
    out.set(key, { places: H, of: rows.length, distinct: sl.bySentence.size, perPlace: +perPlace.toFixed(2), topPlaces: topN, shareAll: +(topN / rows.length).toFixed(4), shareIn: +(topN / H).toFixed(4), seen: +seen.toFixed(4), sentence: top,
      paths: Object.fromEntries([...sl.paths].map(([p, st]) => [p, st.size]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))), contained: !sl.exactOnly });
  }
  return out;
}
/**
 * A SENTENCE REPEATED INSIDE ONE PLACE (the chair, 2026-11-20 20:14: one of the owner's stop conditions). Per place, the
 * sentences printed TWICE OR MORE within one surface FAMILY (familyOf: the web dossier is one family, each PDF form one,
 * the session sheet one), at any positions, the same position included (two cards in one list printing one line: count()'s
 * table (c) keys by stored path and counts only two different slots, so it never saw that case). Pure, one size's rows.
 * Returns the places holding at least one repeat, and per (family, sentence): the places repeating it, `onePosition` (the
 * places where ONE position printed it twice or more: the same-list case), the most times one place prints it, its
 * positions (door slot keys) and its stored paths (attributionOf).
 * @param {Array<{ surfaces: Record<string, Array<any[]>>, stored: Record<string, string[]> }>} rows
 */
export function repeatsInPlace(rows) {
  /** @type {Map<string, { family: string, sentence: string, at: Set<number>, one: Set<number>, times: number, positions: Set<string>, paths: Set<string> }>} */ const rep = new Map();
  const hit = new Set();
  rows.forEach((row, i) => {
    const heads = storedHeads(row.stored);
    /** @type {Map<string, { n: number, positions: Set<string>, per: Map<string, number>, paths: Set<string> }>} */ const seen = new Map();
    for (const [surface, lines] of Object.entries(row.surfaces)) for (const line of lines) for (const s of sentencesOf(line[0])) {
      const k = `${familyOf(surface)}\u0000${s}`; let o = seen.get(k); if (!o) { o = { n: 0, positions: new Set(), per: new Map(), paths: new Set() }; seen.set(k, o); }
      const pos = slotKey(surface, line); o.n++; o.positions.add(pos); o.per.set(pos, (o.per.get(pos) || 0) + 1); for (const p of attributionOf(s, row.stored, heads)) o.paths.add(p);
    }
    for (const [k, o] of seen) {
      if (o.n < 2) continue;
      hit.add(i);
      const [family, sentence] = k.split('\u0000');
      let r = rep.get(k); if (!r) { r = { family, sentence, at: new Set(), one: new Set(), times: 0, positions: new Set(), paths: new Set() }; rep.set(k, r); }
      r.at.add(i); if ([...o.per.values()].some((c) => c >= 2)) r.one.add(i); r.times = Math.max(r.times, o.n); for (const x of o.positions) r.positions.add(x); for (const x of o.paths) r.paths.add(x);
    }
  });
  const sentences = [...rep.values()].map((r) => ({ family: r.family, sentence: r.sentence, places: r.at.size, onePosition: r.one.size, placeIdx: [...r.at], oneIdx: [...r.one], times: r.times, positions: [...r.positions].sort(), paths: [...r.paths].sort() }))
    .sort((a, b) => b.places - a.places || (a.family < b.family ? -1 : a.family > b.family ? 1 : a.sentence < b.sentence ? -1 : 1));
  return { places: hit.size, of: rows.length, sentences };
}
/** How a slot is met again: `top` (one a place) or `seen` (many a place). @param {{ perPlace: number }} m @returns {'top' | 'seen'} */
export const byOf = (m) => (m.perPlace <= ONE_A_PLACE ? 'top' : 'seen');
/** The share a DM meets again: shareAll for a one-a-place slot, SEEN for a many-a-place slot. @param {any} m @param {'top' | 'seen'} [by] */
export const meetOf = (m, by) => ((by || byOf(m)) === 'top' ? m.shareAll : m.seen);
/** The places a reading's share is taken over: all the size's places (shareAll), or the holders (SEEN). @param {any} m @param {'top' | 'seen'} by */
export const overOf = (m, by) => (by === 'top' ? m.of : m.places);
/** A share rounded UP to 0.01, so a ceiling never sits below its reading. @param {number} x */
export const ceil2 = (x) => Math.min(1, Math.ceil(x * 100 - 1e-9) / 100);
/**
 * The standard error of a share AT the ceiling over the reading's places (binomial; shareAll over all the size's places,
 * SEEN over its holders). The share is floored at half a place, so a ceiling at 0 or 1 still allows a place's noise.
 * @param {number} ceiling @param {number} places
 */
export function shareError(ceiling, places) {
  const n = Math.max(1, places); const c = Math.min(Math.max(ceiling, 0.5 / n), 1 - 0.5 / n);
  return Math.sqrt((c * (1 - c)) / n);
}

/** @returns {any} the register */
export function readRegister(path = REGISTER_PATH) { return JSON.parse(readFileSync(path, 'utf8')); }

/**
 * THE JUDGE: one reading (per size, a measureSlots table) against the register. RED: `unregistered` (a slot with no entry
 * for a size whose COMMONEST SENTENCE prints in >= law1RedPlaces(n) of the size's n places: 15 of 150, the chair's ruling
 * of 18:52 UTC) and `over` (an entry's meet above its ceiling beyond NOISE_SE errors; it stays red only if the
 * confirmation repeats it: confirmRises). WATCH: `watch` (no entry, its commonest sentence in law1WatchPlaces(n) places
 * or more, below red: listed, not red). NOTE: `rare` (no entry, below the watch line), `stale` (an entry whose slot this reading does not print), `loose` (a ceiling above its meet
 * beyond the noise; repeated on both readings it prompts --tighten). Every finding names its key.
 * @param {Record<string, Map<string, any>>} table @param {any} register @param {{ noiseSe?: number }} [opts]
 */
export function judge(table, register, opts = {}) {
  const noise = opts.noiseSe ?? NOISE_SE;
  const rows = register.rows || {};
  /** @type {{ unregistered: any[], watch: any[], over: any[], rare: any[], stale: any[], loose: any[] }} */
  const f = { unregistered: [], watch: [], over: [], rare: [], stale: [], loose: [] };
  for (const size of Object.keys(table)) for (const [slot, m] of table[size]) {
    const e = rows[slot]?.sizes?.[size];
    if (!e) {
      const top = m.topPlaces ?? Math.round(m.shareAll * m.of);
      const list = top >= law1RedPlaces(m.of) ? f.unregistered : top >= law1WatchPlaces(m.of) ? f.watch : f.rare;
      list.push({ slot, size, m, top, text: `${size} ${slot}: top sentence in ${top}/${m.of} places (slot in ${m.places}), no row` });
      continue;
    }
    const meet = meetOf(m, e.by); const se = shareError(e.ceiling, overOf(m, e.by));
    if (meet > e.ceiling + noise * se + 1e-9) f.over.push({ slot, size, meet, text: `${size} ${slot}: ${e.by === 'top' ? 'shareAll' : 'seen'} ${meet.toFixed(2)} > ceiling ${e.ceiling} (${((meet - e.ceiling) / se).toFixed(1)} SE over ${overOf(m, e.by)} places)` });
    else if (e.ceiling - meet > noise * se + 1e-9) f.loose.push({ slot, size, meet, text: `${size} ${slot}: ceiling ${e.ceiling} above meet ${meet.toFixed(2)} (${((e.ceiling - meet) / se).toFixed(1)} SE)` });
  }
  for (const [slot, row] of Object.entries(rows)) for (const size of Object.keys(row.sizes || {})) {
    if (table[size] && !table[size].has(slot)) f.stale.push({ slot, size, text: `${size} ${slot}: no longer printed (last ${row.sizes[size].meet} in ${row.sizes[size].places} places)` });
  }
  return f;
}
/**
 * A RISE MUST REPEAT: an `over` of the first reading stays red only if the second reading is over too; else it is a note
 * printed with both readings. A loose ceiling is a --tighten prompt only when loose on both.
 * @param {ReturnType<typeof judge>} first @param {ReturnType<typeof judge>} second
 */
export function confirmRises(first, second) {
  const k = (/** @type {any} */ x) => `${x.size}\u0000${x.slot}`;
  const overAgain = new Map(second.over.map((x) => [k(x), x])); const looseAgain = new Map(second.loose.map((x) => [k(x), x]));
  const both = (/** @type {any} */ x, /** @type {Map<string, any>} */ m) => `${x.text}; ${CORPUS.confirm}: ${m.get(k(x))?.text.split(': ').slice(1).join(': ')}`;
  return {
    ...first,
    over: first.over.filter((x) => overAgain.has(k(x))).map((x) => ({ ...x, text: both(x, overAgain) })),
    loose: first.loose.filter((x) => looseAgain.has(k(x))).map((x) => ({ ...x, second: looseAgain.get(k(x)) })),
    notes: first.over.filter((x) => !overAgain.has(k(x))).map((x) => `${x.text}; does not repeat on ${CORPUS.confirm}`),
    looseNotes: first.loose.filter((x) => !looseAgain.has(k(x))).map((x) => `${x.text}; not loose on ${CORPUS.confirm}`),
  };
}

/** The class and reason of a door slot: the hand classes, then classOf's rule, read off its commonest sentence. @param {string} slot @param {any} m @param {any} [idx] */
export function classifySlot(slot, m, idx) {
  const surface = slot.split(' | ')[0];
  const paths = Object.keys(m.paths || {});
  const field = paths.length ? `@${paths[0]}` : '~';
  const mod = idx ? moduleOf(m.sentence, idx)?.file || 'unfound' : 'unfound';
  const heading = surface === 'session' ? slot.split(' | ')[1] : '(none)';
  const pseudo = { source: field === '~' ? `COMPOSED@${heading}` : field.slice(1), module: mod, top: m.sentence, distinct: m.distinct, holders: m.places, seen: m.seen, perPlace: m.perPlace, heading };
  for (const p of paths) { const hit = handClassOf({ ...pseudo, source: p }); if (hit) return { cls: hit.cls, reason: hit.why }; }
  const c = classOf(pseudo);
  return { cls: c.cls, reason: c.why };
}
/**
 * --write: an entry for every slot printed in >= MIN_PLACES places of a size (on either reading) with none, at the HIGHER
 * of the two readings rounded up to 0.01, classed from the classes file; a stale entry (printed on neither reading)
 * retires by name into `retired` with its last reading. It never raises a ceiling: a confirmed rise refuses the whole write.
 * @param {Record<string, Map<string, any>>} first @param {Record<string, Map<string, any>>} second @param {any} register
 * @param {{ classify?: (slot: string, m: any) => { cls: string, reason: string }, minPlaces?: number }} [opts]
 * @returns {{ refused: string[], next: any, changed: string[] }}
 */
export function writeRows(first, second, register, opts = {}) {
  const minPlaces = opts.minPlaces ?? MIN_PLACES;
  const rises = confirmRises(judge(first, register), judge(second, register)).over;
  if (rises.length) return { refused: rises.map((x) => `refused: ${x.text} (a write never raises a ceiling)`), next: register, changed: [] };
  const next = JSON.parse(JSON.stringify(register)); next.rows ||= {}; next.retired ||= {};
  const changed = [];
  for (const size of Object.keys(first)) {
    const keys = new Set([...first[size].keys(), ...(second[size]?.keys() || [])]);
    for (const slot of [...keys].sort()) {
      if (next.rows[slot]?.sizes?.[size]) continue;
      const a = first[size].get(slot); const b = second[size]?.get(slot);
      if (Math.max(a?.places || 0, b?.places || 0) < minPlaces) continue;
      const hi = [a, b].filter(Boolean).sort((x, y) => meetOf(y) - meetOf(x) || y.places - x.places)[0];
      const by = byOf(hi);
      const meet = Math.max(a ? meetOf(a, by) : 0, b ? meetOf(b, by) : 0);
      const ref = a || b;
      if (!next.rows[slot]) {
        const c = (opts.classify || classifySlot)(slot, ref);
        next.rows[slot] = { class: c.cls, reason: c.reason, sentence: cut(ref.sentence), paths: {}, sizes: {} };
      }
      const row = next.rows[slot];
      for (const [p, n] of Object.entries(ref.paths || {})) row.paths[p] = Math.max(row.paths[p] || 0, n);
      row.sizes[size] = { places: ref.places, of: ref.of, distinct: ref.distinct, shareAll: ref.shareAll, shareIn: ref.shareIn, seen: ref.seen, by, meet: +meet.toFixed(4), ceiling: ceil2(meet) };
      changed.push(`+ ${size} ${slot}: ceiling ${row.sizes[size].ceiling} (${by}: hxd ${a ? meetOf(a, by).toFixed(2) : '-'}, hxu ${b ? meetOf(b, by).toFixed(2) : '-'}; ${row.class})`);
    }
  }
  for (const [slot, row] of Object.entries(next.rows)) {
    for (const size of Object.keys(row.sizes)) {
      if (!first[size] || first[size].has(slot) || second[size]?.has(slot)) continue;
      next.retired[`${slot} @ ${size}`] = { class: row.class, reason: row.reason, last: row.sizes[size] };
      delete row.sizes[size];
      changed.push(`- ${size} ${slot}: retired (printed on neither reading; last ${row.sizes?.[size]?.meet ?? next.retired[`${slot} @ ${size}`].last.meet})`);
    }
    if (!Object.keys(row.sizes).length) delete next.rows[slot];
  }
  return { refused: [], next, changed };
}
/**
 * --tighten (THE CHAIR'S DOOR): each ceiling loose on both readings is lowered to the higher of the two readings (rounded
 * up to 0.01). It never raises one: a lowered value at or above the old ceiling is not written.
 * @param {Record<string, Map<string, any>>} first @param {Record<string, Map<string, any>>} second @param {any} register
 */
export function tighten(first, second, register) {
  const { loose } = confirmRises(judge(first, register), judge(second, register));
  const next = JSON.parse(JSON.stringify(register)); const changed = [];
  for (const x of loose) {
    const e = next.rows[x.slot].sizes[x.size];
    const hi = Math.max(meetOf(first[x.size].get(x.slot), e.by), meetOf(second[x.size].get(x.slot), e.by));
    const c = ceil2(hi);
    if (c >= e.ceiling) continue;
    changed.push(`v ${x.size} ${x.slot}: ceiling ${e.ceiling} -> ${c}`);
    e.ceiling = c;
  }
  return { next, changed };
}

// ── IO ──
/** @param {string} dir */
export function readRun(dir) {
  const rd = join(dir, 'rows');
  const files = existsSync(rd) ? readdirSync(rd).filter((f) => f.endsWith('.json')) : [];
  /** @type {Record<string, any[]>} */ const bySize = {};
  for (const f of files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) { const r = JSON.parse(readFileSync(join(rd, f), 'utf8')); (bySize[r.size] ||= []).push(r); }
  return bySize;
}
/**
 * One size of a rendered run (a 900-place run does not fit in memory at once), optionally only its places 0..limit-1
 * (the 50-a-size corpus is the first 50 of the 150). @param {string} dir @param {string} size @param {number} [limit]
 */
export function readSize(dir, size, limit = Infinity) {
  const rd = join(dir, 'rows');
  const re = new RegExp(`^[a-z0-9]+-${size}-(\\d+)\\.json$`);
  return (existsSync(rd) ? readdirSync(rd) : []).map((f) => [f, re.exec(f)]).filter(([, m]) => m && Number(m[1]) < limit)
    .sort((a, b) => Number(a[1][1]) - Number(b[1][1])).map(([f]) => JSON.parse(readFileSync(join(rd, f), 'utf8')));
}
/**
 * AN INCOMPLETE RENDER GIVES NO VERDICT (SAME-2's fault F, 2026-11-20): a size holding fewer than n rows (a fork that
 * died shrinks it, and law 1 would under-count over the smaller `of`), or a fork that exited non-zero, is a fault; the
 * door then prints each and exits 2, judging and writing nothing. Pure: the size's row counts, n, the sizes, the forks'
 * exit codes (when known). @param {Record<string, number>} counts @param {number} n @param {readonly string[]} sizes
 * @param {Array<number | null>} [codes] @returns {string[]}
 */
export function incompleteRender(counts, n, sizes, codes = []) {
  const faults = [];
  for (const s of sizes) if ((counts[s] || 0) < n) faults.push(`${s}: ${counts[s] || 0} of ${n} rows`);
  codes.forEach((c, w) => { if (c !== 0) faults.push(`fork ${w}: exited ${c}`); });
  return faults;
}
/** A run's rows per size (places 0..n-1) and its forks' exit codes (forks.json, when the run wrote one). @param {string} dir @param {number} n */
export function runCounts(dir, n) {
  const rd = join(dir, 'rows'); /** @type {Record<string, number>} */ const counts = {};
  for (const f of existsSync(rd) ? readdirSync(rd) : []) { const m = /^[a-z0-9]+-([a-z]+)-(\d+)\.json$/.exec(f); if (m && Number(m[2]) < n) counts[m[1]] = (counts[m[1]] || 0) + 1; }
  const fp = join(dir, 'forks.json');
  return { counts, codes: existsSync(fp) ? JSON.parse(readFileSync(fp, 'utf8')) : [] };
}
/** @param {string} name @param {string} [fallback] */
const arg = (name, fallback) => { const hit = process.argv.find((a) => a.startsWith(`--${name}=`)); return hit ? hit.slice(name.length + 3) : fallback; };
const cut = (/** @type {string} */ s, n = 120) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const pct = (/** @type {number} */ x) => `${Math.round(x * 100)}%`;

/** The three tables of one size, as text. @param {ReturnType<typeof count>} c */
function tablesText(size, c) {
  const a = c.slots.filter((r) => r.perPlace <= 1.5).sort((x, y) => y.topShare - x.topShare || y.holders - x.holders);
  const b = c.slots.filter((r) => r.perPlace > 1.5).sort((x, y) => y.seen - x.seen || y.holders - x.holders);
  const line = (r) => `${String(r.holders).padStart(3)} ${String(r.distinct).padStart(5)} ${r.perPlace.toFixed(1).padStart(5)} ${(`${r.topN}/${r.holders}`).padStart(6)} ${r.topShare.toFixed(2)} ${r.seen.toFixed(3)} ${r.cls.padEnd(11)} ${r.key}${r.module ? `  [${r.module}]` : ''}\n      top: ${cut(r.top, 160)}\n      why: ${r.why}${r.paths.length > 1 ? `\n      paths: ${r.paths.join(', ')}` : ''}`;
  const head = 'hold  dist  /plc    top share  seen  class       slot';
  return [`# ${size}: table (a) ONE A PLACE (sentences per place <= 1.5), by top share — ${a.length} rows`, head, ...a.map(line), '',
    `# ${size}: table (b) MANY A PLACE, by SEEN — ${b.length} rows`, head, ...b.map(line), '',
    `# ${size}: table (c) PRINTED TWICE INSIDE ONE PLACE (one family) — ${c.twice.length} rows`, ...c.twice.map((t) => `${String(t.places).padStart(3)} places  ${t.family}\n      slots: ${t.slots.join('\n             ')}\n      e.g.: ${cut(t.example, 160)}`), ''].join('\n');
}

/**
 * Render a plan (`<prefix>-<size>-<i>`, n a size) through the renderer's own vitest config, <workers> forks, into
 * `<out>/rows/`. @param {string} prefix @param {number} n @param {number} workers @param {string} out @returns {Promise<string>} the wall time
 */
async function renderRun(prefix, n, workers, out, { plan: given = null, text = false } = {}) {
  const plan = given || SIZES.flatMap((size) => Array.from({ length: n }, (_, i) => ({ seed: `${prefix}-${size}-${i}`, size })));
  mkdirSync(join(out, 'rows'), { recursive: true });
  if (text) mkdirSync(join(out, 'text'), { recursive: true });
  writeFileSync(join(out, 'vitest.same-census.config.mjs'), `import react from '${join(ROOT, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${ROOT}', plugins: [react()], test: { environment: 'node', include: ['${RENDER}'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
  const t0 = Date.now();
  console.log(`sameness-census: rendering ${plan.length} places (${workers} workers) into ${out}`);
  const codes = await Promise.all(Array.from({ length: workers }, (_, w) => {
    const part = join(out, `plan.${w}.json`);
    writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
    return new Promise((resolve) => {
      const child = spawn('npx', ['vitest', 'run', '--config', join(out, 'vitest.same-census.config.mjs')], {
        cwd: ROOT, env: { ...process.env, SAME_CENSUS_OUT: join(out, 'rows'), SAME_CENSUS_PLAN: part, SAME_CENSUS_TEXT: text ? join(out, 'text') : '' }, stdio: ['ignore', 'pipe', 'pipe'],
      });
      /** @type {Buffer[]} */ const log = [];
      child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
      child.on('close', (code) => { writeFileSync(join(out, `render.${w}.log`), Buffer.concat(log)); resolve(code); });
    });
  }));
  writeFileSync(join(out, 'forks.json'), `${JSON.stringify(codes)}\n`);
  const wall = ((Date.now() - t0) / 60000).toFixed(1);
  writeFileSync(join(out, 'wall.txt'), `${wall} min, ${plan.length} places, ${workers} workers\n`);
  console.log(`sameness-census: rendered in ${wall} min`);
  return wall;
}

const REGISTER_LAW = 'TWO LAWS (SAME-1 brief 2, the sameness door). A PRINTED SLOT WITH NO ROW REDS, TIED TO THE BAR (the chair, 2026-11-20 18:52 UTC): a slot (surface | printed position) with no entry for a size reds where ONE sentence of it prints in 15 or more of the size\'s 150 places (two thirds of the 15% bar; ceil(n x 0.10)); where its commonest sentence prints in 8 to 14 of 150 it is listed as watch, not red; below that it is neither. --write registers every slot printed in MIN_PLACES or more places of a size over the corpus `corpus` names. A CEILING ONLY TIGHTENS: an entry\'s ceiling bounds `meet` (TOP share where the slot prints at most 1.5 sentences a place, SEEN otherwise; `by` names which); --write adds entries and retires stale ones by name into `retired` and never raises a ceiling; --tighten (the chair\'s door) lowers a ceiling loose on both readings and never raises one. Nothing edits this file by hand. Held by tests/lint/samenessCensus.walker.test.js and `node scripts/sameness-census.mjs --check`.';
const IDENTITY_RULE = 'A slot is keyed `<surface> | <position>`: the surface, and where the page prints the line whatever it says (the renderer\'s position: named components and each element\'s place among its siblings, a keyed list item `*`; the session sheet\'s key path). Every wording printed at one position is one slot, whichever stored path holds it (the chair, 2026-11-20: a pool\'s lines are one slot). The stored paths are attribution (`paths`): those that hold the printed sentence word for word, else those of the longest stored sentence it contains.';
/** An empty register on this corpus (the first --write fills it). */
export const emptyRegister = () => ({ _law: REGISTER_LAW, corpus: { ...CORPUS, sizes: [...SIZES] }, identity: { _rule: IDENTITY_RULE }, rows: {}, retired: {} });
const sameCorpus = (/** @type {any} */ c) => JSON.stringify(c) === JSON.stringify({ ...CORPUS, sizes: [...SIZES] });

/**
 * THE DOOR'S CLI: --check | --write | --tighten [--from=<hxd run>] [--confirm=<hxu run>] [--workers=4] [--out=<dir>]
 * [--register=<path>] [--n=<n>] (a foreign n or prefix is a flake probe: the register's corpus check is waived and said so).
 * @param {'check' | 'write' | 'tighten'} mode
 */
async function door(mode) {
  const t0 = Date.now();
  const regPath = arg('register', REGISTER_PATH);
  const register = existsSync(regPath) ? readRegister(regPath) : (mode === 'write' ? emptyRegister() : null);
  if (!register) { console.error(`sameness-census --${mode}: no register at ${regPath}`); process.exit(2); }
  const n = Number(arg('n', String(CORPUS.n))); const prefix = arg('seed-prefix', CORPUS.prefix); const workers = Number(arg('workers', '4'));
  const probe = n !== CORPUS.n || prefix !== CORPUS.prefix;
  if (!sameCorpus(register.corpus)) { console.error(`sameness-census --${mode}: the register is banked on another corpus (${JSON.stringify(register.corpus)})`); process.exit(2); }
  if (probe && mode !== 'check') { console.error(`sameness-census --${mode}: writes only on the register's corpus`); process.exit(2); }
  if (probe) console.log(`sameness-census --check: A PROBE (prefix ${prefix}, n ${n}), not the register's corpus`);
  const base = arg('out') || mkdtempSync(join(tmpdir(), 'same-door-'));
  const whole = (/** @type {string} */ dir) => {
    const { counts, codes } = runCounts(dir, n); const faults = incompleteRender(counts, n, SIZES, codes);
    if (!faults.length) return dir;
    for (const x of faults) console.error(`sameness-census --${mode}: incomplete render (${dir}): ${x}`);
    console.error(`sameness-census --${mode}: incomplete render: no verdict, nothing written`); process.exit(2);
  };
  const readOrRender = async (/** @type {string | undefined} */ dir, /** @type {string} */ pfx, /** @type {string} */ name) => {
    if (dir) return whole(dir);
    await renderRun(pfx, n, workers, join(base, name)); return whole(join(base, name));
  };
  const firstDir = await readOrRender(arg('from'), prefix, prefix);
  const t1 = Date.now();
  /** @type {any} */ let secondTable = null;
  const tableOf = (/** @type {string} */ dir) => Object.fromEntries(SIZES.flatMap((s) => { const rows = readSize(dir, s, n); return rows.length ? [[s, measureSlots(rows)]] : []; }));
  const second = async () => { secondTable ||= tableOf(await readOrRender(arg('confirm'), prefix === CORPUS.confirm ? CORPUS.prefix : CORPUS.confirm, 'confirm')); return secondTable; };
  const first = tableOf(firstDir);
  const idx = moduleIndex();
  const say = (/** @type {string} */ x) => console.log(x);
  if (mode === 'check') {
    let f = judge(first, register);
    /** @type {string[]} */ let notes = []; /** @type {string[]} */ let looseNotes = [];
    let confirmed = false;
    if (f.over.length) { const t = await second(); const c = confirmRises(f, judge(t, register)); notes = c.notes; looseNotes = c.looseNotes; f = c; confirmed = true; }
    for (const x of f.unregistered) say(`RED unregistered: ${x.text}`);
    for (const x of f.watch) say(`WATCH unregistered: ${x.size} ${x.slot}: top ${x.top}/${x.m.of}: "${cut(x.m.sentence, 100)}"`);
    for (const x of f.over) say(`RED rise: ${x.text}`);
    for (const x of notes) say(`NOTE rise on one reading: ${x}`);
    for (const x of f.stale) say(`NOTE stale: ${x.text}`);
    for (const x of f.loose) say(`NOTE loose${confirmed ? ' (on both readings)' : ` (on ${prefix}; --tighten reads both)`}: ${x.text}`);
    for (const x of looseNotes) say(`NOTE loose on one reading: ${x}`);
    say(`NOTE: ${f.rare.length} slot-sizes with no row whose top sentence prints below the watch line (${law1WatchPlaces(n)} of ${n}; neither red nor watch)`);
    const rows = Object.keys(register.rows).length;
    say(`sameness-census --check: ${f.unregistered.length} unregistered, ${f.over.length} rises (red); ${f.watch.length} watch; ${notes.length} one-reading rises, ${f.stale.length} stale, ${f.loose.length} loose (notes); ${rows} rows; render ${((t1 - t0) / 60000).toFixed(1)} min, wall ${((Date.now() - t0) / 60000).toFixed(1)} min${confirmed ? ` (confirmed on ${CORPUS.confirm})` : ' (no confirmation needed)'}`);
    process.exit(f.unregistered.length || f.over.length ? 1 : 0);
  }
  const t2 = await second();
  if (mode === 'write') {
    const r = writeRows(first, t2, register, { classify: (slot, m) => classifySlot(slot, m, idx) });
    if (r.refused.length) { for (const x of r.refused) say(x); say('sameness-census --write: NOTHING WRITTEN'); process.exit(1); }
    // the tree the readings were rendered at (the renders read src/ as checked out; a dirty src/ is said so)
    const git = (/** @type {string[]} */ a) => { try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return '?'; } };
    r.next.taken = { commit: git(['rev-parse', '--short=9', 'HEAD']), srcClean: git(['status', '--porcelain', '--', 'src']) === '', at: arg('from') ? 'from a rendered run' : 'rendered by this write' };
    writeFileSync(regPath, `${JSON.stringify(r.next, null, 1)}\n`);
    for (const x of r.changed) say(x);
    say(`sameness-census --write: ${r.changed.length} changes; ${Object.keys(r.next.rows).length} rows; wall ${((Date.now() - t0) / 60000).toFixed(1)} min`);
    return;
  }
  const r = tighten(first, t2, register);
  writeFileSync(regPath, `${JSON.stringify(r.next, null, 1)}\n`);
  for (const x of r.changed) say(x);
  say(`sameness-census --tighten: ${r.changed.length} ceilings lowered; wall ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}

async function main() {
  for (const mode of /** @type {const} */ (['check', 'write', 'tighten'])) if (process.argv.includes(`--${mode}`)) return door(mode);
  const prefix = arg('seed-prefix', 'hxd');
  const n = Number(arg('n', '50'));
  const workers = Number(arg('workers', '4'));
  const from = arg('from');
  if (!process.argv.includes('--measure') && !from) { console.error('sameness-census: --measure, --from=<dir>, --check, --write or --tighten'); process.exit(2); }
  const out = from || arg('out') || mkdtempSync(join(tmpdir(), 'same-census-'));
  const planFile = arg('plan');
  if (!from) await renderRun(prefix, n, workers, out, { plan: planFile ? JSON.parse(readFileSync(planFile, 'utf8')) : null, text: process.argv.includes('--text') });
  const run = readRun(out);
  const total = Object.values(run).reduce((a, r) => a + r.length, 0);
  console.log(`sameness-census: ${total} places read from ${out}`);
  const confirm = arg('confirm'); const crun = confirm ? readRun(confirm) : null;
  const idx = moduleIndex();
  const docs = arg('docs');
  /** @type {Record<string, any>} */ const counted = {};
  for (const size of SIZES) {
    if (!run[size]) continue;
    const c = count(run[size]);
    for (const r of c.slots) {
      const m = moduleOf(r.top, idx); r.module = m ? m.file : 'unfound';
      Object.assign(r, (({ cls, why }) => ({ cls, why }))(classOf(r)));
    }
    const cc = crun?.[size] ? count(crun[size]) : null;
    if (cc) { const byKey = new Map(cc.slots.map((r) => [r.key, r])); for (const r of c.slots) r.confirm = byKey.get(r.key) || null; }
    counted[size] = { c, cc };
    console.log(`${size}: ${run[size].length} places, ${c.slots.length} slots (>= ${MIN_HOLDERS} holders), ${c.twice.length} twice-printed rows`);
    if (docs) writeFileSync(join(docs, `tables-${size}.txt`), tablesText(size, c));
  }
  writeFileSync(join(out, 'counted.json'), JSON.stringify(Object.fromEntries(Object.entries(counted).map(([s, { c }]) => [s, c]))));
  if (docs) writeFileSync(join(docs, 'SAME-CENSUS.md'), censusMd(counted, { commit: arg('commit', '?'), wall: arg('wall', '?'), confirm: !!crun }));
}

/** @param {Record<string, any>} counted */
function censusMd(counted, { commit, wall, confirm }) {
  const L = [];
  L.push('# SAME-CENSUS — the rendered sameness census (SAME-1, brief 1)', '');
  L.push(`Commit measured: \`${commit}\`. Corpus: hxd (50 a size, six sizes); confirmation hxu${confirm ? '' : ': **pending**'}. Wall time: ${wall}.`, '');
  L.push('THE RULE, in five lines:', '',
    '1. Every line the page prints (web dossier: every group, tab and disclosure; the PDF, three variants; the session sheet), names masked to `#` and digits to `0` (the chair\'s census.mjs mask).',
    '2. A sentence is a piece of a line split at `.`/`!`/`?`/`…` + space + capital, at least 25 characters with a space.',
    '3. A SLOT is `surface | source`: the shortest stored path whose string holds the sentence word for word, else `COMPOSED@<heading>` with the module whose longest literal fragment the sentence contains.',
    '4. TOP = the commonest sentence\'s places / holders; SEEN = the mean share of a place\'s sentences at the slot that a second place also prints. Rows with >= 10 holders.',
    '5. Ranked: (a) one a place (<= 1.5 sentences per place) by TOP share, (b) many a place by SEEN, merged, STATE and NARRATIVE classes only (a `?` class is the rule\'s guess); one row per source and top sentence, its surfaces listed (the reading shown is its worst surface); then every twice-printed row (c).', '');
  // FURNITURE AND EMPTY STATES THAT A DM MEETS AGAIN: LABEL rows (and any empty state) with top share >= 0.6 and >= 25
  // holders, one line per source and top sentence, sizes merged
  /** @type {Map<string, any>} */ const furn = new Map();
  for (const size of SIZES) {
    if (!counted[size]) continue;
    for (const r of counted[size].c.slots) {
      if (!(r.holders >= 25 && r.topShare >= 0.6 && (/^LABEL/.test(r.cls) || /empty state/.test(r.why)))) continue;
      const k = `${r.source.startsWith('COMPOSED@') ? `${r.source} ~ ${r.module}` : r.source}\u0000${r.top}`;
      const o = furn.get(k) || { r, sizes: new Map(), surfaces: new Set() };
      const was = o.sizes.get(size); if (!was || r.topShare > was.topShare) o.sizes.set(size, r);
      o.surfaces.add(r.surface); furn.set(k, o);
    }
  }
  L.push('## FURNITURE AND EMPTY STATES THAT A DM MEETS AGAIN', '', 'LABEL rows, and every row marked `empty state`, with top share >= 0.6 and >= 25 holders (hxd), one line per source and top sentence, sizes merged (size: top places / holders).', '');
  for (const o of [...furn.values()].sort((a, b) => b.sizes.size - a.sizes.size || a.r.top.localeCompare(b.r.top))) {
    const sz = [...o.sizes].map(([s, r]) => `${s} ${r.topN}/${r.holders}`).join(', ');
    L.push(`- **${o.r.cls}**${/empty state/.test(o.r.why) ? ' (empty state)' : ''} "${cut(o.r.top, 110)}" — ${sz} — ${[...o.surfaces].map((x) => `\`${x}\``).join(' ')} — ${o.r.why}`);
  }
  L.push('');
  for (const size of SIZES) {
    if (!counted[size]) continue;
    const { c } = counted[size];
    // one row per source and top sentence: the same slot printed on several surfaces is read once, its surfaces listed
    /** @type {Map<string, any>} */ const merged = new Map();
    for (const r of c.slots.filter((x) => x.holders >= 10 && /^(STATE|NARRATIVE)/.test(x.cls)).map((x) => ({ ...x, meet: x.perPlace <= 1.5 ? x.topShare : x.seen, tbl: x.perPlace <= 1.5 ? 'a' : 'b' }))) {
      const k = `${r.source.startsWith('COMPOSED@') ? 'COMPOSED' : r.source}\u0000${r.top}`;
      const o = merged.get(k);
      if (!o) merged.set(k, { ...r, surfaces: [r.surface] });
      else { o.surfaces.push(r.surface); if (r.meet > o.meet) Object.assign(o, { ...r, surfaces: o.surfaces }); }
    }
    const rows = [...merged.values()].sort((x, y) => y.meet - x.meet || y.holders - x.holders).slice(0, 40);
    L.push(`## ${size}`, '', '| # | t | hxd meet (top / seen) | hxu meet | holders | dist | /place | class | slot | source / module | top sentence |', '|---|---|---|---|---|---|---|---|---|---|---|');
    rows.forEach((r, i) => {
      const cf = r.confirm; const hm = cf ? (r.tbl === 'a' ? cf.topShare : cf.seen) : null;
      const hxu = !confirm ? 'pending' : cf ? `${pct(hm)} (${cf.topN}/${cf.holders} · ${cf.seen.toFixed(2)})` : 'absent';
      const src = r.source.startsWith('COMPOSED@') ? `${r.source} — ${r.module}` : `${r.paths.slice(0, 3).join(', ')}${r.paths.length > 3 ? ` +${r.paths.length - 3}` : ''} — ${r.module}`;
      L.push(`| ${i + 1} | ${r.tbl} | ${pct(r.meet)} (${r.topN}/${r.holders} · ${r.seen.toFixed(2)}) | ${hxu} | ${r.holders} | ${r.distinct} | ${r.perPlace.toFixed(1)} | ${r.cls}: ${r.why} | ${r.surfaces.map((x) => `\`${x}\``).join(' ')} | ${src.replace(/\|/g, '\\|')} | ${cut(r.top).replace(/\|/g, '\\|')} |`);
    });
    L.push('', `### ${size}: (c) printed twice inside one place — ${c.twice.length} rows`, '', '| places | family | slots | e.g. |', '|---|---|---|---|');
    for (const t of c.twice) L.push(`| ${t.places} | ${t.family} | ${t.slots.map((s) => `\`${s.replace(/\|/g, '¦')}\``).join('<br>')} | ${cut(t.example).replace(/\|/g, '\\|')} |`);
    L.push('');
  }
  return `${L.join('\n')}\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
