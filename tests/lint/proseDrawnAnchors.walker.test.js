/**
 * proseDrawnAnchors.walker.test.js — habitat removal for the LITERAL ANCHOR ON DRAWN PROSE
 * class (REWRITE car 8a-13; structural-prevention, the third same-shape fix).
 *
 * ⛔ THE CLASS. A test that pins a STATE-PROSE SENTENCE as a string literal —
 * `expect(dom).toContain('Nothing in Steinmark is level for long')` — is asserting two things
 * at once and can only say one of them. It means "this block draws at this position"; it says
 * "this position draws THIS WORDING". Which wording a pool draws is a function of the
 * fixture's seed and of the draw rule (`stateProseKernel.js` `drawVariant`, keyed
 * `seed::blockId::poolKey::v<vid>` since car 8a-1), so a change to EITHER — or a rewrite of
 * the wording under Shift 1, or an APPENDED wording that wins the draw under NEVER TRIM —
 * reds every such pin at once while the thing it guards is perfectly well. The bill, measured:
 * car 8a-1 re-seeded three desk pins by hand; car 8a-12 re-seeded SIXTEEN more (the §919 proof
 * printed nine, a `for` loop hid the other seven) and cost a 111,965-candidate seed search for
 * one fixture alone; and the receipt's own finding is that one or two more fall due PER BLOCK
 * CAR of the REWRITE, for ever.
 *
 * ⭐ THE LAWFUL SHAPE is `tests/helpers/drawnProse.js`: the anchor is COMPUTED at test time
 * through the shipped read path, from the block, the pool, the audience and the slot bag the
 * desk itself uses. The test still owns the whole semantic claim; only the wording follows the
 * corpus. This walker is what keeps the shape: a NEW literal state-prose fragment inside an
 * assertion reds by name, and the inventory of the ones that exist can only shrink.
 *
 * ── THE WALK ─────────────────────────────────────────────────────────────────────────────
 *
 * Over every `*.test.js` / `*.test.jsx` under `tests/`, every STRING LITERAL outside a comment
 * is collected. A corpus sentence quoted in a comment is documentation rather than a pin and
 * is outside the scan by construction; a template literal that interpolates is skipped,
 * because its text is computed, which is the shape this walker wants.
 *
 * ⛔ THE SCOPE IS EVERY LITERAL AND NOT ONLY AN ASSERTION'S ARGUMENT, AND THAT IS MEASURED
 * RATHER THAN CAUTIOUS. The charter proposed scanning inside `toContain(` / `toMatch(` /
 * `queryByText(` / an anchor call. Built that way and run at this tip it reports TWO pins in
 * the whole corpus — and would have caught NONE of the sixteen that actually bit at car 8a-12,
 * because every one of them was a `const GROUND = '…'` at module scope that an assertion later
 * names. A detector that misses the shape of its own founding incident is not a detector, so
 * the scan is widened and the extra false positives are carried in the roster with their
 * reasons instead.
 *
 * A literal counts as a PIN when it can be ALIGNED against a variant of the six state leaves
 * with every `{slot}` standing for one arbitrary fill of 1..80 characters, over a floor of
 * **18 characters of FIXED text** actually matched. The floor is the whole guard against
 * vacuity: without it an alignment can spend the entire literal inside fills and "match"
 * anything (8a-12 measured 49,233 false pins at floor 0).
 *
 * ⚠ TWO KNOWN RECALL LIMITS, stated rather than hidden — both SHRINK the ledger, never
 * inflate it. (1) A real pin whose fixed runs total fewer than 18 characters is missed:
 * `'Thornmere looks to Steinmark'` (fixed run `' looks to '` = 10) is a genuine DS-REL-1 pin
 * this scan does not list. (2) A literal built by concatenation is judged piece by piece, so a
 * pin split across `+` at a point that leaves each piece under the floor is missed. Neither
 * limit lets a pin into the FROZEN roster it does not belong in, and the roster is a ceiling
 * on what is tolerated rather than a claim about what exists.
 *
 * REGENERATION: `UPDATE_DRAWN_ANCHOR_ALLOWLIST=1 npx vitest run
 * tests/lint/proseDrawnAnchors.walker.test.js` PRINTS a fresh literal and FAILS with
 * instructions. It never writes a file — the allowlist is a reviewed artifact, and a
 * self-updating ratchet ratchets nothing.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { STATE_LEAVES } from '../helpers/drawnProse.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCAN_ROOT = 'tests';

/** A fill stands for at most this many characters — the annex's own longest is far shorter. */
const MAX_FILL = 80;
/** How many characters of AUTHORED text an alignment must actually match to count as a pin. */
const FIXED_TEXT_FLOOR = 18;
/** Below this a literal is too short to be a sentence fragment worth pinning. */
const MIN_LITERAL = 18;

/**
 * ⛔ EXEMPT BY NAME: corpus text used as FIXTURE INPUT, which is the lawful use.
 *
 * These three walkers FEED corpus sentences to the instrument under test — the wave gate's
 * band grain, the contradiction walker's entry table, the composer's own arrangement — so the
 * literal is the test's SUBJECT, not an anchor on somebody else's draw. Nothing about the
 * draw rule can move them, because nothing here is drawn.
 */
const FIXTURE_INPUT_FILES = Object.freeze([
  'tests/lint/proseWaveGate.walker.test.js',
  'tests/lint/proseEntryContradiction.walker.test.js',
  'tests/lint/proseComposed.walker.test.js',
  // This file itself: its planted sentence is the DETECTOR'S OWN CONTROL, which the
  // anti-vacuity arm below drives. A walker that reported itself would be reporting the proof
  // that it works.
  'tests/lint/proseDrawnAnchors.walker.test.js',
  // ⭐ ADDED 2026-09-18 (the block weave). `weaveBlock` ARRANGES sentences a desk already
  // drew — it joins them and stands a repeated opening settlement name down to the tier noun
  // — so its unit test FEEDS corpus sentences to the instrument and asserts the ARRANGEMENT
  // that comes back. Nothing here is drawn: no pool is read, no seed reaches the file, and
  // `drawVariant` never runs, so no re-index, rewrite or appended wording can move a single
  // assertion. Three of its inputs are real shipped wordings on purpose — the owner's own
  // Vallepagus triple, quoted in the finding this module answers, is the reading the cure has
  // to be judged against, and substituting invented prose for it would be testing a different
  // sentence than the one that was complained about.
  //
  // ⛔ THE LINE IT MUST NOT CROSS, so the next seat does not widen this row: this file may
  // never assert that a DESK or a PAGE produced one of these sentences. The moment it does,
  // it is an anchor and it belongs in `drawnProse.js` like every other. The DOM proof for the
  // weave lives in tests/ui/generalDeskTabFlow.test.js, which computes its anchors.
  'tests/domain/display/stateProse/weaveBlock.test.js',
]);

/**
 * ── THE INVENTORY ───────────────────────────────────────────────────────────────────────
 *
 * FROZEN 2026-09-09 at REWRITE car 8a-13, from this walker's own scan, AFTER the two `tests/ui`
 * flow suites and the two desk-suite equality pins were converted to `drawnProse.js`. Every row
 * below is a literal this scan can align against the corpus and that no car has yet converted.
 *
 * SHRINK-ONLY, and the six files this car cured are held at EXACT ZERO by the arms below, so
 * the banked win cannot be quietly spent.
 *
 * To bank a win: replace the literal with `drawnMember` / `variantByVid` / `poolMemberTexts`
 * from tests/helpers/drawnProse.js and DELETE the row (or lower the count). Never raise a
 * number; never add a file. A new file needing a row means a new literal anchor was authored,
 * which is the thing this gate exists to stop.
 *
 * ⚠ NOT ONE SURVIVOR IS A PIN ON A DRAWN SENTENCE — every one was read at the freeze and named
 * here, so a later seat converts the right ones and leaves the rest alone:
 *   magicRegimeLifecycle:221 · settlementLifecycleFirstClass:400 — `remnantReason` and a
 *     CHRONICLE event description. GENERATOR text that shares a phrase with the corpus; it
 *     never reaches `drawVariant`, so no draw rule can move it.
 *   stressorAftermath:89 — a TEST TITLE. The matcher's own false positive, kept in the ledger
 *     rather than special-cased into invisibility.
 *   dossierMountRegistry:640 — a HAND-BUILT rung fixture handed to the registry's reader; the
 *     sentence is the walker's input, not a draw.
 *   economyReadModelCoverage:414 — a NEEDLE for a source scan ("this sentence is minted in one
 *     module"). It is looking for the string in `src/`, which is the opposite direction.
 *   envoyKindPools:55 — a different pool family's AUTHORED list, pinned as that family's own
 *     roster.
 *   warRemembranceReader:136 — a UI HEADING used as an `expectAbsentWithAnchor` anchor, which
 *     the matcher aligns against a power-leaf variant by coincidence. Not corpus prose.
 */
const FROZEN_LITERAL_ANCHORS = Object.freeze({
  'tests/domain/magicRegimeLifecycle.test.js': 1,
  'tests/domain/settlementLifecycleFirstClass.test.js': 1,
  'tests/domain/stressorAftermath.test.js': 1,
  'tests/lint/dossierMountRegistry.walker.test.js': 1,
  'tests/lint/economyReadModelCoverage.walker.test.js': 1,
  'tests/lint/envoyKindPools.walker.test.js': 1,
  'tests/ui/warRemembranceReader.test.jsx': 1,
});

/**
 * The SIX FILES car 8a-13 drove to zero literal anchors: the two `tests/ui` flow suites whose
 * sixteen pins were the founding incident, and the four desk suites 8a-12's ledger named. No
 * frozen row may name one of them, so the banked win cannot be quietly spent.
 *
 * ⚠ NOT THE WHOLE OF `tests/ui`. `warRemembranceReader.test.jsx` anchors on a UI HEADING that
 * the matcher aligns against a power-leaf variant by coincidence — a false positive, kept in
 * the roster with its reason rather than special-cased into invisibility.
 */
const CURED_FILES = Object.freeze([
  'tests/ui/generalDeskTabFlow.test.js',
  'tests/ui/economicsTabFlow.test.js',
  'tests/domain/generalStateProseDesk.test.js',
  'tests/domain/defenseStateProseDesk.test.js',
  'tests/domain/economyStateProseDesk.test.js',
  'tests/domain/warFaithStateProseDesk.test.js',
]);

const inCuredFamily = (rel) => CURED_FILES.includes(rel);

// ── THE TEMPLATE INDEX ────────────────────────────────────────────────────────────────────

/**
 * One authored variant, split into the tokens an alignment walks: FIXED runs (what a renderer
 * cannot alter) and SLOT holes.
 * @typedef {{tokens: ReadonlyArray<{fixed: string}|{slot: true}>, where: string, text: string}} Template
 */

const SLOT_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

/** @param {string} text @param {string} where @returns {Template} */
function templateOf(text, where) {
  /** @type {Array<{fixed: string}|{slot: true}>} */
  const tokens = [];
  let last = 0;
  for (const match of text.matchAll(SLOT_RE)) {
    const at = /** @type {number} */ (match.index);
    if (at > last) tokens.push({ fixed: text.slice(last, at) });
    tokens.push({ slot: true });
    last = at + match[0].length;
  }
  if (last < text.length) tokens.push({ fixed: text.slice(last) });
  return { tokens, where, text };
}

/** Every variant of the six state leaves, as a template. */
function loadTemplates() {
  /** @type {Template[]} */
  const out = [];
  for (const [leaf, corpus] of Object.entries(STATE_LEAVES)) {
    for (const [blockId, block] of Object.entries(corpus)) {
      for (const [poolKey, pool] of Object.entries(block.pools || {})) {
        for (const variant of pool) {
          const faces = [variant.text, ...(Array.isArray(variant.wordings) ? variant.wordings : [])];
          for (const face of faces) {
            if (typeof face === 'string' && face !== '') {
              out.push(templateOf(face, `${leaf} :: ${blockId} :: ${poolKey} :: vid ${variant.vid}`));
            }
          }
        }
      }
    }
  }
  return out;
}

const WORD_RE = /[a-z]{4,}/g;
/** The indexable words of a template — taken from FIXED runs only, since a fill is not authored. */
function templateWords(template) {
  const words = new Set();
  for (const token of template.tokens) {
    if (!('fixed' in token)) continue;
    for (const word of token.fixed.toLowerCase().matchAll(WORD_RE)) words.add(word[0]);
  }
  return words;
}

/**
 * word → the templates whose authored text carries it. A candidate is only tested against the
 * templates its four RAREST words reach, which is what makes a 2,600-file walk affordable.
 *
 * ⚠ FOUR WORDS, NOT ONE, and the reason is a measured miss: a pinned fragment carries FILLED
 * slots, and a fill word can be rare in the corpus for an entirely different variant, so a
 * single-rarest-word narrowing sent real pins to the wrong posting list and reported a clean
 * sweep over files that do carry them (8a-12).
 */
function buildIndex(templates) {
  /** @type {Map<string, number[]>} */
  const index = new Map();
  templates.forEach((template, i) => {
    for (const word of templateWords(template)) {
      const list = index.get(word);
      if (list) list.push(i); else index.set(word, [i]);
    }
  });
  return index;
}

// ── THE ALIGNMENT ─────────────────────────────────────────────────────────────────────────

/**
 * Can `literal` be a substring of some rendering of `template`, and how many characters of
 * AUTHORED text does the best such alignment match?
 *
 * The walk starts at every position the literal could begin — inside any fixed run, or inside
 * a fill — and, at a slot, seeks the next fixed run's occurrences within the fill's 80-character
 * reach rather than trying every fill length, which is what keeps the search small.
 *
 * @param {string} literal @param {Template} template @returns {number} fixed characters matched, 0 for no alignment
 */
function alignmentFixedChars(literal, template) {
  const { tokens } = template;
  let best = 0;

  /** @param {number} li @param {number} ti @param {number} matched */
  const walk = (li, ti, matched) => {
    if (li >= literal.length) { if (matched > best) best = matched; return; }
    if (ti >= tokens.length) return;
    const token = tokens[ti];
    if ('fixed' in token) {
      const rest = token.fixed;
      const take = Math.min(rest.length, literal.length - li);
      if (literal.slice(li, li + take) !== rest.slice(0, take)) return;
      if (li + take >= literal.length) { if (matched + take > best) best = matched + take; return; }
      walk(li + rest.length, ti + 1, matched + rest.length);
      return;
    }
    // A SLOT. The literal may end inside the fill (a fill is at most MAX_FILL long)…
    if (literal.length - li <= MAX_FILL && matched > best) best = matched;
    // …or the fill ends and the next fixed run resumes somewhere within its reach.
    const next = tokens[ti + 1];
    if (!next || !('fixed' in next)) return;
    const head = next.fixed.slice(0, Math.min(next.fixed.length, 24));
    if (head === '') return;
    const limit = Math.min(literal.length, li + MAX_FILL + 1);
    for (let at = literal.indexOf(head, li + 1); at >= 0 && at < limit; at = literal.indexOf(head, at + 1)) {
      walk(at, ti + 1, matched);
    }
    // …or the literal ENDS part-way through that run. Without this branch a pin like
    // `'What the realm has lost'` — `What the {seat} has lost at {settlement}…` cut short —
    // aligns on nine characters instead of eighteen and slips under the floor.
    for (let fill = 1; fill <= MAX_FILL && li + fill < literal.length; fill += 1) {
      const tail = literal.slice(li + fill);
      if (tail.length < next.fixed.length && next.fixed.startsWith(tail)) {
        if (matched + tail.length > best) best = matched + tail.length;
      }
    }
  };

  for (let ti = 0; ti < tokens.length; ti += 1) {
    const token = tokens[ti];
    if ('fixed' in token) {
      // The literal may begin at any offset inside this authored run.
      for (let off = 0; off < token.fixed.length; off += 1) {
        const rest = token.fixed.slice(off);
        const take = Math.min(rest.length, literal.length);
        if (literal.slice(0, take) !== rest.slice(0, take)) continue;
        if (take >= literal.length) { if (take > best) best = take; continue; }
        walk(rest.length, ti + 1, rest.length);
      }
    } else {
      walk(0, ti, 0);
    }
  }
  return best;
}

// ── THE SOURCE SCAN ───────────────────────────────────────────────────────────────────────

/** Walk a directory tree. */
function walkTree(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkTree(p, out);
    else out.push(p);
  }
  return out;
}

/** Index of the quote closing the string opened at `at`, or -1. */
function endOfString(source, at) {
  const quote = source[at];
  for (let i = at + 1; i < source.length; i += 1) {
    if (source[i] === '\\') { i += 1; continue; }
    if (source[i] === quote) return i;
    if (quote !== '`' && source[i] === '\n') return -1;
  }
  return -1;
}

/**
 * Every string literal in a source file, outside comments, with its absolute offset. A
 * template literal that interpolates (`${…}`) is skipped: its text is computed, which is the
 * shape this walker wants.
 *
 * ⚠ A REGEX LITERAL CARRYING AN APOSTROPHE would open a spurious string span. None exists in
 * the corpus today and the effect would be to MISS literals rather than invent them, which is
 * the direction this scan is allowed to be wrong in.
 * @param {string} source
 * @returns {Array<{text: string, at: number}>}
 */
function literalsIn(source) {
  /** @type {Array<{text: string, at: number}>} */
  const out = [];
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '/' && source[i + 1] === '/') { const e = source.indexOf('\n', i); if (e < 0) break; i = e; continue; }
    if (ch === '/' && source[i + 1] === '*') { const e = source.indexOf('*/', i + 2); if (e < 0) break; i = e + 1; continue; }
    if (ch !== "'" && ch !== '"' && ch !== '`') continue;
    const end = endOfString(source, i);
    if (end < 0) continue;
    const raw = source.slice(i + 1, end);
    const at = i;
    i = end;
    if (ch === '`' && raw.includes('${')) continue;
    out.push({ text: raw.replace(/\\(['"`\\])/g, '$1'), at });
  }
  return out;
}

/** 1-based line number of an absolute offset. */
function lineOf(source, at) {
  let line = 1;
  for (let i = 0; i < at && i < source.length; i += 1) if (source[i] === '\n') line += 1;
  return line;
}

/**
 * The scan. Returns per-file pin counts and the pins themselves.
 * @returns {{counts: Record<string, number>, pins: Array<{file: string, line: number, literal: string, source: string, fixed: number}>}}
 */
function scanLiteralAnchors() {
  const templates = loadTemplates();
  const index = buildIndex(templates);
  /** @type {Record<string, number>} */
  const counts = {};
  /** @type {Array<{file: string, line: number, literal: string, source: string, fixed: number}>} */
  const pins = [];
  const absRoot = join(ROOT, SCAN_ROOT);
  if (!existsSync(absRoot)) return { counts, pins };
  for (const filePath of walkTree(absRoot)) {
    const rel = relative(ROOT, filePath).replace(/\\/g, '/');
    if (!/\.test\.(js|jsx)$/.test(rel)) continue;
    if (FIXTURE_INPUT_FILES.includes(rel)) continue;
    const source = readFileSync(filePath, 'utf8');
    for (const { text, at } of literalsIn(source)) {
      const hit = alignOne(text, templates, index);
      if (!hit) continue;
      counts[rel] = (counts[rel] || 0) + 1;
      pins.push({ file: rel, line: lineOf(source, at), literal: text, source: hit.where, fixed: hit.fixed });
    }
  }
  return { counts, pins };
}

/**
 * The best alignment of one literal against the corpus, or null. Narrowed by the four rarest
 * indexed words before any alignment is attempted.
 * @returns {{fixed: number, where: string}|null}
 */
function alignOne(text, templates, index) {
  if (text.length < MIN_LITERAL || !text.includes(' ')) return null;
  const words = [...new Set(text.toLowerCase().match(WORD_RE) || [])]
    .filter((word) => index.has(word))
    .sort((a, b) => index.get(a).length - index.get(b).length)
    .slice(0, 4);
  if (words.length === 0) return null;
  const candidates = new Set(words.flatMap((word) => index.get(word)));
  let bestFixed = 0;
  let bestWhere = '';
  for (const i of candidates) {
    const fixed = alignmentFixedChars(text, templates[i]);
    if (fixed > bestFixed) { bestFixed = fixed; bestWhere = templates[i].where; }
  }
  return bestFixed >= FIXED_TEXT_FLOOR ? { fixed: bestFixed, where: bestWhere } : null;
}

/** Render the current scan as a paste-ready FROZEN_LITERAL_ANCHORS literal. */
function renderLiteral(counts) {
  const rows = Object.keys(counts).sort().map((file) => `  '${file}': ${counts[file]},`).join('\n');
  return `const FROZEN_LITERAL_ANCHORS = Object.freeze({\n${rows}\n});`;
}

const SCAN = scanLiteralAnchors();

describe('proseDrawnAnchors — a literal state-prose sentence may not be a test anchor', () => {
  test('the regeneration door prints and never writes', () => {
    if (process.env.UPDATE_DRAWN_ANCHOR_ALLOWLIST !== '1') {
      expect(typeof renderLiteral(SCAN.counts)).toBe('string');
      return;
    }
    const listing = SCAN.pins
      .map((pin) => `  ${pin.file}:${pin.line}  (${pin.fixed} fixed chars)\n     ${JSON.stringify(pin.literal)}\n     ↳ ${pin.source}`)
      .join('\n');
    expect(
      false,
      `REGENERATED — paste this into the file, then read every row before you keep it:\n\n`
      + `${renderLiteral(SCAN.counts)}\n\nPINS:\n${listing}\n`,
    ).toBe(true);
  });

  test('⛔ THE DETECTOR IS NOT VACUOUS — it finds a planted pin and refuses a control', () => {
    // A pin built from a real variant, with its slots filled the way a page fills them.
    const planted = 'Nothing in Steinmark is level for long; the town takes the slope';
    const templates = loadTemplates();
    const hits = templates.filter((t) => alignmentFixedChars(planted, t) >= FIXED_TEXT_FLOOR);
    expect(hits.length, 'the matcher cannot find a sentence the corpus demonstrably carries')
      .toBeGreaterThan(0);
    // …and a control of the same shape and length that the corpus does NOT carry.
    const control = 'Nothing in Steinmark is level for lunch; the town bakes the slope';
    const falseHits = templates.filter((t) => alignmentFixedChars(control, t) >= FIXED_TEXT_FLOOR);
    expect(falseHits.length, 'the matcher aligned a sentence the corpus does not carry')
      .toBe(0);
    // The corpus itself is really loaded, or both halves above are free.
    expect(templates.length, 'no templates were loaded — the leaves moved').toBeGreaterThan(2000);
  });

  test('no NEW file carries a literal state-prose anchor, and no frozen row grows', () => {
    const offenders = Object.entries(SCAN.counts)
      .filter(([file, count]) => (FROZEN_LITERAL_ANCHORS[file] || 0) < count)
      .map(([file, count]) => `${file}: ${count} (frozen ${FROZEN_LITERAL_ANCHORS[file] ?? 'none'})`);
    expect(
      offenders,
      `A literal state-prose sentence is being used as a test anchor. Compute it instead —`
      + ` \`drawnMember\` / \`variantByVid\` / \`poolMemberTexts\` from tests/helpers/drawnProse.js`
      + ` — so a re-index, a rewrite or an appended wording moves the member and the anchor`
      + ` together. Regenerate the roster with UPDATE_DRAWN_ANCHOR_ALLOWLIST=1 to see every`
      + ` pin and the corpus row it aligns against.`,
    ).toEqual([]);
  });

  test('the frozen roster is SHRINK-ONLY: no row names a file the scan no longer finds', () => {
    const stale = Object.keys(FROZEN_LITERAL_ANCHORS).filter((file) => !SCAN.counts[file]);
    expect(
      stale,
      `These rows are banked wins that were never spent: the scan finds no literal anchor in`
      + ` them any more. Delete the rows — a roster that keeps a cured file is slack the next`
      + ` offender can spend.`,
    ).toEqual([]);
  });

  test('⛔ the six files car 8a-13 cured are held at EXACT ZERO', () => {
    const readmitted = Object.keys(FROZEN_LITERAL_ANCHORS).filter(inCuredFamily);
    expect(
      readmitted,
      `The two tests/ui flow suites and the four *StateProseDesk suites were driven to zero`
      + ` literal anchors at REWRITE car 8a-13. No frozen row may name one of them.`,
    ).toEqual([]);
    const live = Object.keys(SCAN.counts).filter(inCuredFamily);
    expect(
      live,
      `A literal state-prose anchor has re-entered a cured family. This is the class the car`
      + ` removed the habitat for — compute the anchor through tests/helpers/drawnProse.js.`,
    ).toEqual([]);
  });

  test('every exempt-by-name file exists and really does carry corpus text', () => {
    for (const rel of FIXTURE_INPUT_FILES) {
      expect(existsSync(join(ROOT, rel)), `${rel} is exempt by name and does not exist`).toBe(true);
      const source = readFileSync(join(ROOT, rel), 'utf8');
      // NON-VACUITY: an exemption over a file with nothing to exempt is an exemption that has
      // stopped meaning anything — it would hide the day the file grows a real anchor.
      const templates = loadTemplates();
      const index = buildIndex(templates);
      const found = literalsIn(source).filter((lit) => alignOne(lit.text, templates, index)).length;
      expect(found, `${rel} is exempt as a corpus-fixture consumer but carries no corpus text`)
        .toBeGreaterThan(0);
    }
  });
});
