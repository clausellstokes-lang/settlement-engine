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
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

// ── IO ──
/** @param {string} dir */
export function readRun(dir) {
  const rd = join(dir, 'rows');
  const files = existsSync(rd) ? readdirSync(rd).filter((f) => f.endsWith('.json')) : [];
  /** @type {Record<string, any[]>} */ const bySize = {};
  for (const f of files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) { const r = JSON.parse(readFileSync(join(rd, f), 'utf8')); (bySize[r.size] ||= []).push(r); }
  return bySize;
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

async function main() {
  const prefix = arg('seed-prefix', 'hxd');
  const n = Number(arg('n', '50'));
  const workers = Number(arg('workers', '4'));
  const from = arg('from');
  if (!process.argv.includes('--measure') && !from) { console.error('sameness-census: --measure or --from=<dir>'); process.exit(2); }
  const out = from || arg('out') || mkdtempSync(join(tmpdir(), 'same-census-'));
  if (!from) {
    const plan = SIZES.flatMap((size) => Array.from({ length: n }, (_, i) => ({ seed: `${prefix}-${size}-${i}`, size })));
    mkdirSync(join(out, 'rows'), { recursive: true });
    writeFileSync(join(out, 'vitest.same-census.config.mjs'), `import react from '${join(ROOT, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${ROOT}', plugins: [react()], test: { environment: 'node', include: ['${RENDER}'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
    const t0 = Date.now();
    console.log(`sameness-census: rendering ${plan.length} places (${workers} workers) into ${out}`);
    await Promise.all(Array.from({ length: workers }, (_, w) => {
      const part = join(out, `plan.${w}.json`);
      writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
      return new Promise((resolve) => {
        const child = spawn('npx', ['vitest', 'run', '--config', join(out, 'vitest.same-census.config.mjs')], {
          cwd: ROOT, env: { ...process.env, SAME_CENSUS_OUT: join(out, 'rows'), SAME_CENSUS_PLAN: part }, stdio: ['ignore', 'pipe', 'pipe'],
        });
        /** @type {Buffer[]} */ const log = [];
        child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
        child.on('close', (code) => { writeFileSync(join(out, `render.${w}.log`), Buffer.concat(log)); resolve(code); });
      });
    }));
    const wall = ((Date.now() - t0) / 60000).toFixed(1);
    writeFileSync(join(out, 'wall.txt'), `${wall} min, ${plan.length} places, ${workers} workers\n`);
    console.log(`sameness-census: rendered in ${wall} min`);
  }
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
