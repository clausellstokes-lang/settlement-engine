#!/usr/bin/env node
/**
 * generate-dossier-state-prose.mjs — LANE P: the corpus projection.
 *
 * THE PROBLEM THIS SOLVES. docs/content/RECEIPT_POOLS_DOSSIER_STATE.md (77 dossier
 * surfaces, 59 blocks) and docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md (78 join
 * families x 6) are the AUTHORED corpus, and they are the surface the chair and the
 * owner read and veto. Hand-transcribing ~2,400 variants into a JS data leaf would
 * fork the content: the doc would drift from the code and neither would be wrong.
 * So the doc IS the source, this script is the ONE projection of it, and the
 * projection is checked into src/data so the runtime never parses markdown.
 *
 * THE PARSER IS STRICT ON PURPOSE. A silently-dropped variant is the failure mode
 * that matters (a pool one line short still renders, just never says that thing
 * again), so every `[angle]`-tagged line inside a block region MUST be consumed by
 * a pool or the run throws. The per-block counts are printed so the totals are
 * measured, never asserted from the doc's own arithmetic.
 *
 * GRAMMAR (both annexes):
 *   `### DS-XXX-N — ...`   opens a state block   (a header containing FOLDED INTO is skipped)
 *   `### JF-...   — ...`   opens a causal family
 *   `**SLOTS:**` / `**SLOTS.**`    the block's slot palette
 *   `**SECTION-TARGET:**`          the dossier section the prose lands in
 *   `**ARMS:**`                    the causal family's two arms
 *   `**<label>**` alone on a line  opens a POOL keyed by <label>
 *   `N. \`[angle · tag]\` text`    a variant; `0. *(canonical)*` marks canonical-at-zero
 *
 * A trailing italic authoring note — ` *(...)*` at end of line — is an editorial
 * aside to the chair, never prose, and is stripped. Everything else is kept byte-for-byte.
 *
 * Run with --check in the gate (tests/data/dossierStateProseProjection.contract.test.js).
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { ECONOMY_FRESHNESS_SENTENCES } from '../src/domain/display/economyFreshness.js';
import { isCovertPath } from '../src/domain/prose/wiringCensus.js';
import { parseSlotShapes, mergeSlotShapes, assertSlotShapesTotal } from './lib/dossier-slot-shapes.mjs';
import {
  CONNECTIVES_HEADING_RE, FACE_ROW_RE, GRAMMAR_TAG_RE, applyDeclaration, assertCensusCurrent,
  assertFaces, assertNoAuthoringMarker, assertPoolDeclaration, isDeclarationLine, kinSpines,
  parseConnectives, readDeclarations, seatMeta, seatOf, vidsOf,
} from './lib/dossier-annex-grammar.mjs';
// ⭐ THE ESTATE'S ONE STOP LIST, read HERE and never in the composer (ARCH §4.1 refuses a
// `src/domain/prose/` import there; `kinSpines`'s docblock carries the measurement). A script
// is outside `src/`, so the island fence — which scans `src/` alone — is untouched.
import { contentWords } from '../src/domain/prose/composedWalker.js';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
/**
 * ⭐⭐ `--taste` — THE DOCK-ONLY FLAG OF TASTE car 6 (ARCH §12 row 6), AND THE ONE THING THE
 * SHIPPED BUILD NEVER PASSES.
 *
 * The taste lands seven modifier pools' TYPED LINES before their prose exists, because a
 * writer authors against a licence card that can only be printed once the pool has a census
 * row. Two rules relax behind this flag and NOTHING else does:
 *
 *   1. a variant whose text carries the authoring marker is admitted (without the flag the
 *      projector refuses it BY NAME, so a placeholder can never ship);
 *   2. T-F12's civic-object-class collision on an ATTACH is PRINTED rather than thrown,
 *      because the key-string proxy refuses four of the seven attach sites ARCH §6.3-§6.5
 *      specifies — three of them on the POLARITY MARKER that the sibling rule T-F3 requires
 *      the key to carry. The waivers are printed with the class each collided on and the
 *      sitting rules; arm A1 over the real text is unaffected and still gates.
 *
 * Every waiver taken is printed at the end of the run and counted, so a silent relaxation is
 * impossible: a flag whose effect nobody prints is a flag nobody can audit.
 *
 * ⛔ DARK AT THIS TIP (REWRITE car 8a-3): the flag landed with the taste's INSTRUMENTS and the
 * taste's seven annex rows did not, so there is no marker to admit and no modifier ATTACH to
 * collide, and `--taste` waives nothing — `node scripts/generate-dossier-state-prose.mjs
 * --taste` prints "NO refusal needed waiving". It lights the day 8b authors the first modifier
 * row, which is the day a writer first needs a card printed for a pool with no prose in it.
 */
const tasteMode = process.argv.includes('--taste');
/** @type {string[]} every refusal the taste flag relaxed, printed at the end of the run. */
const tasteWaivers = [];

const STATE_DOC = path.join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md');
const CAUSAL_DOC = path.join(ROOT, 'docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md');
const STATE_OUT_DIR = path.join(ROOT, 'src/data/dossierStateProse');
const CAUSAL_OUT = path.join(ROOT, 'src/data/dossierCausalProse.generated.js');

/**
 * ⭐ THE WIRING CENSUS, READ BESIDE THE ANNEX (ARCH §3.5, §12 row 4). The AUTHORING half of a
 * pool's metadata — what it tests, what it reads, its predicate, its rate — lives in this
 * committed JSON and never ships (181,956 B saved, X-F6). The projection reads it for three
 * things and writes it for none: to refuse a `READS:` token the census does not list under
 * this pool's tests, to emit the RENDER half of `poolMeta` and the norm bit, and to REFUSE TO
 * RUN when the census's own stamp is stale against the composers it was taken over.
 */
const CENSUS_JSON = path.join(ROOT, 'docs/content/wiring-census.json');

/** The three leaves ARCH §4.1 gives the composer, beside the kernel. */
const CONNECTIVES_OUT = path.join(ROOT, 'src/data/dossierConnectives.generated.js');
const NORMS_OUT = path.join(ROOT, 'src/data/proseNorms.generated.js');
const RELATIONS_OUT = path.join(ROOT, 'src/data/dossierRelations.generated.js');

/**
 * THE DESK SPLIT. One leaf per desk family rather than one 600 kB table, so a panel
 * pulls only the corpus its own sections read and the lazy-chunk derivation in
 * vite.config can route each desk with the tab that consumes it. The prefixes are
 * exhaustive over the annex's block ids and the split asserts it — a new block whose
 * prefix nobody claims fails the run rather than losing its prose silently.
 */
const DESKS = [
  { file: 'economy', constant: 'DOSSIER_STATE_PROSE_ECONOMY', prefixes: ['DS-ECO-', 'DS-SUP-'], title: 'THE ECONOMY + SUPPLY DESK' },
  { file: 'power', constant: 'DOSSIER_STATE_PROSE_POWER', prefixes: ['DS-POW-'], title: 'THE POWER DESK' },
  { file: 'defense', constant: 'DOSSIER_STATE_PROSE_DEFENSE', prefixes: ['DS-DEF-'], title: 'THE DEFENSE DESK' },
  { file: 'warFaith', constant: 'DOSSIER_STATE_PROSE_WAR_FAITH', prefixes: ['DS-WAR-', 'DS-FTH-'], title: 'THE WAR + FAITH DESK' },
  { file: 'stressors', constant: 'DOSSIER_STATE_PROSE_STRESSORS', prefixes: ['DS-STR-', 'DS-CND-'], title: 'THE STRESSOR + CONDITION DESK' },
  { file: 'general', constant: 'DOSSIER_STATE_PROSE_GENERAL', prefixes: ['DS-GEN-', 'DS-REL-', 'DS-POP-', 'DS-HK-'], title: 'THE OVERVIEW / RELATIONS / POPULATION / HOOKS DESK' },
];

/**
 * THE LIVE-STRING BINDINGS — the ONE-HOME rule, enforced at the projection.
 *
 * A handful of the annexes' `0. *(frozen, canonical)*` rows are not corpus prose at
 * all: they are a byte-copy of a string the ENGINE already owns and ships, recorded in
 * the doc so the chair can read the variants against the real sentence. Projecting such
 * a row as a JSON literal MINTS A SECOND HOME for that string, which is precisely the
 * hand-copy drift class the freshness walker
 * (tests/lint/economyReadModelCoverage.walker.test.js, "the freshness sentence is
 * minted only in the detector module") exists to forbid — and it re-appears on every
 * regeneration, so curing the leaf by hand would last exactly until the next run.
 *
 * So the projection BINDS instead of inlining: the generator imports the live constant,
 * finds its exact quoted form in the emitted JSON, and replaces it with a reference to
 * the constant, hoisting the import into the leaf. The runtime shape is unchanged (the
 * same string arrives at the same key); the SOURCE has one home again.
 *
 * `module` is repo-relative — the specifier is computed per output file, so a desk that
 * moves depth does not silently emit a broken import.
 *
 * FAIL-CLOSED BOTH WAYS (assertLiveStringsBound below):
 *   - a member that binds NOWHERE throws (the doc reworded the canonical row, or the
 *     engine reworded the sentence, and the binding quietly became decoration);
 *   - a raw literal surviving anywhere in the emitted text throws (the substitution
 *     missed an occurrence and a second home shipped).
 */
const LIVE_STRING_BINDINGS = [
  {
    symbol: 'ECONOMY_FRESHNESS_SENTENCES',
    module: 'src/domain/display/economyFreshness.js',
    members: ECONOMY_FRESHNESS_SENTENCES,
  },
];

/** Every member across every binding, as `symbol.member` → the live string. */
const BOUND_LITERALS = LIVE_STRING_BINDINGS.flatMap(({ symbol, members }) =>
  Object.entries(members).map(([member, literal]) => ({
    ref: `${symbol}.${member}`, literal, quoted: JSON.stringify(literal),
  })));

/** Which `symbol.member` refs actually landed, accumulated across every emitted file. */
const boundRefs = new Set();

/**
 * The ESM specifier for `module` as seen from `outPath`.
 * @param {string} outPath absolute path of the file being emitted
 * @param {string} moduleRel repo-relative path of the imported module
 * @returns {string}
 */
function specifierFor(outPath, moduleRel) {
  const rel = path.relative(path.dirname(outPath), path.join(ROOT, moduleRel)).split(path.sep).join('/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/**
 * Replace every bound live string in an emitted JSON body with a reference to its
 * constant, and report which imports the leaf now needs.
 * @param {string} body the `JSON.stringify` output
 * @param {string} outPath absolute path of the file being emitted
 * @returns {{body: string, imports: string[]}}
 */
function bindLiveStrings(body, outPath) {
  let out = body;
  const used = new Set();
  for (const { ref, quoted } of BOUND_LITERALS) {
    if (!out.includes(quoted)) continue;
    // The quoted form carries its own delimiters, so this can only match a WHOLE JSON
    // string token — never a substring of a longer variant.
    out = out.split(quoted).join(ref);
    boundRefs.add(ref);
    used.add(ref.split('.')[0]);
  }
  const imports = LIVE_STRING_BINDINGS
    .filter(({ symbol }) => used.has(symbol))
    .map(({ symbol, module }) => `import { ${symbol} } from '${specifierFor(outPath, module)}';\n`);
  return { body: out, imports };
}

/**
 * The generator-side pin: a regeneration can never re-inline a bound string, and can
 * never carry a binding that no longer binds anything.
 * @param {Array<{path: string, text: string}>} files
 */
function assertLiveStringsBound(files) {
  const dead = BOUND_LITERALS.filter(({ ref }) => !boundRefs.has(ref));
  if (dead.length) {
    throw new Error(
      `live-string binding(s) matched NOTHING: ${dead.map((d) => d.ref).join(', ')}.`
      + ' The annex\'s canonical row and the engine constant have drifted apart —'
      + ' re-sync the `0. *(frozen, canonical)*` row with the live string, or drop the'
      + ' binding from LIVE_STRING_BINDINGS deliberately.',
    );
  }
  for (const file of files) {
    for (const { ref, quoted } of BOUND_LITERALS) {
      if (file.text.includes(quoted)) {
        throw new Error(
          `${path.relative(ROOT, file.path)} still INLINES the live string bound to ${ref}`
          + ' — a second home for it would ship. The substitution missed an occurrence.',
        );
      }
    }
  }
}

/**
 * A variant line: `1. \`[street · dm-only]\` The market runs thin...`
 * A SECOND bracketed tag is lawful and load-bearing — R-DOS-G lets a causal variant
 * carry its audience separately (`6. \`[counterforce · seat]\` \`[dm-only]\` …`). Both
 * tags fold into the variant's marks; missing the second would publish dm-only prose.
 */
const VARIANT_RE = /^(\d+)\.\s+`\[([^\]]+)\]`\s+(?:`\[([^\]]+)\]`\s+)?(.*)$/;
/** The canonical-at-zero row: `0. *(canonical)* <the live engine string>` */
const CANONICAL_RE = /^0\.\s+\*\(([^)]*canonical[^)]*)\)\*\s+(.*)$/;
/**
 * A pool label. Either a standalone bold line (`**COMBINATION C1 — ...**`) or a bold
 * label carrying an em-dash gloss (`**SUBSISTENCE** — *bare survival, no cushion*`).
 * A bold lead-in followed by ordinary prose (`**STATE-KEY.** The closed ladder ...`)
 * is deliberately NOT a label — the remainder must be empty or a gloss opener.
 */
const BOLD_LINE_RE = /^\*\*((?:(?!\*\*).)+)\*\*(\s*(?:[—–·,:(-]\s*.*|\*.*)?)$/;
/** A trailing italic authoring note. */
const TRAILING_NOTE_RE = /\s*\*\([^*]*\)\*\s*$/;
/**
 * WRITER-4's COMPACT ROW — a whole pool on one bullet line:
 *   `- \`STRONG\` — 1. \`[visitor]\` text · 2. \`[ledger]\` text · 3. \`[street]\` text`
 * The row key sits between the bullet and the first em dash; the variants are
 * interpunct-separated. Five blocks (DS-GEN-3/4/5/6/10) are authored this way and are
 * invisible to the one-variant-per-line grammar — 225 variants that would have gone
 * missing silently if the drop check did not count them.
 */
const COMPACT_BULLET_RE = /^-\s+(.+?)\s+—\s+(1\.\s+`\[.*)$/;
/** The same shape carrying its OWN bold label rather than nesting under a group. */
const COMPACT_BOLD_RE = /^\*\*((?:(?!\*\*).)+)\*\*\s*(?:\*\([^*]*\)\*\s*)?—\s+(1\.\s+`\[.*)$/;
/** A leading second tag on a variant body, e.g. `` `[dm-only]` the sentence ``. */
const LEADING_TAG_RE = /^`\[([^\]]+)\]`\s+/;
const COMPACT_VARIANT_RE = /(\d+)\.\s+`\[([^\]]+)\]`\s+(.*?)(?=\s+·\s+\d+\.\s+`\[|$)/g;

/** The reserved key of a block whose variants carry no pool label at all. */
const SOLE_POOL = '*';

/**
 * A pool label is a short state-shape name (`Endorsed`, `ARITY — no banner`,
 * `intensity: low`). The annexes also carry bold-led RULE paragraphs whose bold span
 * happens to be followed by a gloss opener — `**Fence (from the sibling family):**
 * **there is no believed-solvency axis.** …` — and taking one of those as a label
 * splits a family's pool in two, which is how three causal families lost their
 * variants to a metadata heading in the first pass. A label therefore never ends in a
 * colon and never carries a sentence break.
 * @param {string} label
 */
function isPoolLabel(label, remainder) {
  const s = label.trim();
  // A colon-terminated bold span is a rule heading in both annexes, never a state
  // value — JF-CPL-12a's FENCE HONOURED heading split that family's pool until this.
  if (s.endsWith(':')) return false;
  if (remainder.trim() === '') {
    // A whole-line bold is a label unless it is plainly a sentence. Engine values can
    // carry a stop (`riskLabel: Critical. The seat could fall`), so length decides.
    return !(s.length > 70 && (/\.\s/.test(s) || s.endsWith('.')));
  }
  // A bold span followed by a gloss: labels are short noun phrases, rule headings
  // are colon-led or sentence-shaped.
  if (s.endsWith(':')) return false;
  if (/\.\s/.test(s)) return false;
  return !(s.endsWith('.') && s.length > 40);
}

/** @param {string} s */
function stripInlineCode(s) {
  return s.replace(/`/g, '').trim();
}

/** @param {string} s the raw bold label @returns {string} a stable pool key */
function poolKeyOf(s) {
  return stripInlineCode(s)
    .replace(TRAILING_NOTE_RE, '')
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strip the trailing italic authoring note — an aside to the chair, never prose.
 * A regex cannot do this: several notes contain their own `**bold**`, so an
 * asterisk-free body is not a safe delimiter. The note is the LAST ` *(` whose
 * remainder is a balanced italic parenthetical running to end of line.
 * @param {string} text @returns {string}
 */
function cleanText(text) {
  const out = text.trim();
  if (!out.endsWith('*')) return out;
  // Two note openers are in use: ` *(…)*` (the parenthetical aside) and ` *— …*`
  // (the slot-requirement note DS-FTH-3 carries). Both run to end of line.
  const at = Math.max(out.lastIndexOf(' *('), out.lastIndexOf(' *—'));
  if (at <= 0) return out;
  const body = out.slice(0, at).trim();
  return body.length > 0 ? body : out;
}

/**
 * Split an angle tag into its parts: `street · dm-only` / `ledger · cut`.
 *
 * ⛔ AND ROUTE `grammar: Vn` AWAY FROM `marks` (GRAMMAR_TAG_CONTRACT, moveGrammar.js:151-157).
 * The tag rides the same bracket slot as an audience mark, and left in `marks` it would put
 * eight new words into a vocabulary the kernel treats as CLOSED: `STATE_MARK_DIMENSIONS`'s own
 * contract arm reds on an unclassified mark, because an unclassified word is a state dimension
 * the kernel cannot see. The tag is a per-variant DATUM — nothing reads it at the draw — so it
 * takes its own field and moves no index.
 * @param {string} tag
 * @returns {{angle: string, marks: string[], grammar: string|null}}
 */
function parseTag(tag) {
  const parts = tag.split('·').map((p) => p.trim()).filter(Boolean);
  const grammars = parts.map((part) => part.match(GRAMMAR_TAG_RE)).filter(Boolean);
  const rest = parts.filter((part) => !GRAMMAR_TAG_RE.test(part));
  if (grammars.length > 1) {
    throw new Error(`a variant carries ${grammars.length} \`grammar:\` tags; a variant realises ONE order`);
  }
  return {
    angle: rest[0] || '',
    marks: rest.slice(1),
    grammar: grammars.length ? grammars[0][1] : null,
  };
}

/**
 * A second bracketed tag, folded in. The grammar tag may stand in EITHER bracket, so both are
 * asked; an angle-less second tag contributes its first part as a mark.
 * @param {{angle: string, marks: string[], grammar: string|null}} first
 * @param {{angle: string, marks: string[], grammar: string|null}|null} extra
 * @returns {{marks: string[], grammar: string|null}}
 */
function foldTags(first, extra) {
  if (!extra) return { marks: first.marks, grammar: first.grammar };
  if (first.grammar && extra.grammar) {
    throw new Error('a variant carries two `grammar:` tags; a variant realises ONE order');
  }
  return {
    marks: [...first.marks, extra.angle, ...extra.marks].filter(Boolean),
    grammar: first.grammar || extra.grammar,
  };
}

/** @param {string} line @returns {string[]} every `{slot}` named on a line */
function slotsOn(line) {
  return [...line.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]);
}

/**
 * Parse one annex into blocks.
 * @param {string} src the markdown
 * @param {RegExp} headerRe matches a block header, capture 1 = block id
 * @param {string} label for error messages
 */
function parseAnnex(src, headerRe, label, options = {}) {
  const lines = src.split('\n');
  /** @type {Array<{id:string,title:string,sectionTarget:string[],sectionTargetRaw:string|null,arms:string[],slots:string[],pools:Array<{key:string,variants:Array<object>,declared:Record<string,unknown>}>}>} */
  const blocks = [];
  let block = null;
  let pool = null;
  let lastBold = null;
  let lastIndex = -1;
  let skipping = false;

  const openPool = (key) => {
    if (block === null) throw new Error(`${label}: pool "${key}" outside any block`);
    pool = { key, variants: [], declared: {} };
    block.pools.push(pool);
    lastIndex = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    const header = line.match(headerRe);
    if (header) {
      // A FOLDED block is an id kept for the record with its content moved elsewhere.
      skipping = /FOLDED INTO/i.test(line);
      block = skipping ? null : {
        id: header[1],
        title: line.replace(/^###\s+/, '').trim(),
        sectionTarget: [],
        sectionTargetRaw: null,
        arms: [],
        slots: [],
        pools: [],
      };
      if (block) blocks.push(block);
      pool = null;
      lastBold = null;
      lastIndex = -1;
      continue;
    }
    // ⛔ THE BLOCK REGION ENDS AT A NAMED ANNEX SECTION. `## §7b THE STATE CONNECTIVES` sits
    // after the last block, and without this the last block would go on consuming its rows: a
    // bold cell would be read as a pool label and a numbered row as a variant. Passed in per
    // annex rather than derived, because the CAUSAL annex carries `## §2`…`## §7` headings
    // BETWEEN its families and closing the region on those would move that leaf's parse.
    if (options.regionEnd && options.regionEnd.test(line)) {
      skipping = true;
      block = null;
      pool = null;
      lastBold = null;
      continue;
    }
    if (skipping || !block) continue;

    if (isDeclarationLine(line)) {
      // ⛔ A PENDING LABEL ALWAYS OPENS ITS POOL HERE (TASTE car M-2). The guard was
      // `pool === null && lastBold !== null`, which is only true for the FIRST pool of a
      // block: on the second and every later one a pending bold label was ignored and the
      // typed lines were folded into the PREVIOUS pool's declarations — a modifier's ROLE,
      // READS and ATTACH landing silently on the spine above it. It has never fired because
      // the annex carried no typed line at all until this car, and it would have fired on the
      // first one authored after a block's opening pool. The plant is in the projection
      // contract: two declared pools in one block, and the second's READS must be its own.
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      if (pool === null) throw new Error(`${label} ${block.id}: a typed line stands outside any pool (line ${i + 1})`);
      for (const decl of readDeclarations(line)) {
        applyDeclaration(decl, pool.declared, `${label} ${block.id} :: ${pool.key}`);
      }
      continue;
    }

    const face = line.match(FACE_ROW_RE);
    if (face) {
      const last = pool && pool.variants.length ? pool.variants[pool.variants.length - 1] : null;
      if (!last) throw new Error(`${label} ${block.id}: a \`[face]\` row stands before any variant (line ${i + 1})`);
      last.wordings.push(cleanText(face[1]));
      continue;
    }

    if (/^\*\*SLOTS[:.]\*\*/.test(line)) {
      block.slots = [...new Set(slotsOn(line))];
      continue;
    }
    if (/^\*\*SECTION-TARGET[:.]\*\*/.test(line)) {
      // BACKTICKED TOKENS ONLY, which is the shape the ARMS extractor below has always
      // used. The rule this replaces split the declaration on `,` as well as the intended
      // `·`, so `` `economy` (economic resilience, prosperity, food) `` projected as the
      // three fragments `economy (economic resilience`, `prosperity` and `food)`, and 26
      // of the 45 declaring state blocks carried at least one string outside the eight.
      // Prose on this line is an aside to the reader, never a target; assertSectionTargets
      // below judges what lands, and the raw line is kept so it can quote the row.
      block.sectionTargetRaw = line.replace(/^\*\*SECTION-TARGET[:.]\*\*/, '');
      block.sectionTarget = [...block.sectionTargetRaw.matchAll(/`([a-z][a-z0-9_-]*)`/g)]
        .map((m) => m[1]);
      continue;
    }
    if (/^\*\*ARMS[:.]\*\*/.test(line)) {
      // Hyphens are lawful in an arm name (`broker-town`); an underscore-only class
      // silently dropped that arm and orphaned the two variants tagged with it.
      block.arms = [...line.matchAll(/`([a-z][a-z0-9_-]*)`/g)].map((m) => m[1]);
      continue;
    }

    const bulletRow = line.match(COMPACT_BULLET_RE);
    const boldRow = bulletRow ? null : line.match(COMPACT_BOLD_RE);
    const compact = bulletRow || boldRow;
    if (compact) {
      const rowKey = poolKeyOf(compact[1]);
      // A bulleted row NESTS under the bold group heading above it; a row carrying its
      // own bold label IS the pool and takes no prefix (and clears the pending label,
      // so a following bullet cannot inherit a heading that was never a group).
      const group = bulletRow && lastBold !== null ? poolKeyOf(lastBold) : '';
      if (boldRow) lastBold = null;
      // THE JOIN IS A COLON, NOT AN EM DASH (VOICE-1b, §854). A group-plus-row key is
      // the label/title separator VOICE_AND_TONE §6 sends to a colon, and the separator
      // this line MINTS is the one em dash in a pool key no author can reach: it is not
      // in either annex, so 56 of the corpus's 299 key em dashes could only be burned
      // here. The key is hashed into the draw (stateProseKernel.js `drawVariant`), so
      // this separator is renameable only while the corpus is dark.
      openPool(group ? `${group}: ${rowKey}` : rowKey);
      for (const m of compact[2].matchAll(COMPACT_VARIANT_RE)) {
        const first = parseTag(m[2]);
        const lead = m[3].match(LEADING_TAG_RE);
        const folded = foldTags(first, lead ? parseTag(lead[1]) : null);
        pool.variants.push({
          index: Number(m[1]),
          angle: first.angle,
          marks: folded.marks,
          grammar: folded.grammar,
          wordings: [],
          text: cleanText(lead ? m[3].slice(lead[0].length) : m[3]),
        });
      }
      if (pool.variants.length === 0) {
        throw new Error(`${label} ${block.id}: compact row "${rowKey}" parsed to zero variants (line ${i + 1})`);
      }
      // The row is self-contained; the next row re-opens under the same group label.
      lastIndex = -1;
      continue;
    }

    const bold = line.match(BOLD_LINE_RE);
    if (bold && isPoolLabel(bold[1], bold[2] || "")) { lastBold = bold[1]; continue; }

    const canonical = line.match(CANONICAL_RE);
    if (canonical) {
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      // A block whose variants carry no label at all has ONE pool (every causal
      // family, and the few single-state blocks); '*' is its reserved key.
      if (!pool) openPool(SOLE_POOL);
      pool.variants.push({
        index: 0, angle: 'canonical', marks: [], grammar: null, wordings: [], text: cleanText(canonical[2]),
      });
      lastIndex = 0;
      continue;
    }

    const variant = line.match(VARIANT_RE);
    if (variant) {
      const n = Number(variant[1]);
      if (lastBold !== null) { openPool(poolKeyOf(lastBold)); lastBold = null; }
      if (!pool) openPool(SOLE_POOL);
      // A restart of the numbering with no new label would silently merge two pools.
      if (n <= lastIndex) {
        throw new Error(
          `${label} ${block.id}: variant numbering restarted at ${n} inside pool "${pool.key}"`
          + ` (line ${i + 1}) — the pool label is missing or is not a standalone bold line.`,
        );
      }
      lastIndex = n;
      const first = parseTag(variant[2]);
      const folded = foldTags(first, variant[3] ? parseTag(variant[3]) : null);
      pool.variants.push({
        index: n,
        angle: first.angle,
        marks: folded.marks,
        grammar: folded.grammar,
        wordings: [],
        text: cleanText(variant[4]),
      });
      continue;
    }

    // A pending label is STICKY across the note paragraph several pools carry
    // between their heading and their first variant (DS-STR-1's gated ARITY pool is
    // the case that forced this). A later label overwrites it, so the pool a variant
    // lands in is always the NEAREST PRECEDING label — never an earlier one.
  }
  return blocks;
}

/**
 * Every `[angle]`-tagged pool line inside a block region must land in a pool.
 * @param {string} src @param {RegExp} headerRe @param {Array<object>} blocks @param {string} label
 */
function assertNothingDropped(src, headerRe, blocks, label, options = {}) {
  const lines = src.split('\n');
  let inBlock = false;
  let tagged = 0;
  let faceRows = 0;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (headerRe.test(line)) { inBlock = !/FOLDED INTO/i.test(line); continue; }
    if (options.regionEnd && options.regionEnd.test(line)) { inBlock = false; continue; }
    if (!inBlock) continue;
    if (VARIANT_RE.test(line) || CANONICAL_RE.test(line)) { tagged += 1; continue; }
    // A FACE is not a numbered row, so the numbering guard never sees it and the drop check
    // has to count it separately or a wording set could go missing exactly as a variant could.
    if (FACE_ROW_RE.test(line)) { faceRows += 1; continue; }
    const compact = line.match(COMPACT_BULLET_RE) || line.match(COMPACT_BOLD_RE);
    if (compact) tagged += [...compact[2].matchAll(COMPACT_VARIANT_RE)].length;
  }
  const captured = blocks.reduce(
    (n, b) => n + b.pools.reduce((m, p) => m + p.variants.length, 0), 0,
  );
  const capturedFaces = blocks.reduce(
    (n, b) => n + b.pools.reduce((m, p) => m + p.variants.reduce((k, v) => k + v.wordings.length, 0), 0), 0,
  );
  if (captured !== tagged) {
    throw new Error(`${label}: ${tagged} tagged pool lines in block regions, ${captured} captured — ${tagged - captured} dropped`);
  }
  if (capturedFaces !== faceRows) {
    throw new Error(`${label}: ${faceRows} \`[face]\` rows in block regions, ${capturedFaces} captured — ${faceRows - capturedFaces} dropped`);
  }
  return { variants: captured, faces: faceRows };
}

/**
 * THE DOSSIER SECTIONS a block may be discovered under — the closed vocabulary a
 * SECTION-TARGET line is allowed to name.
 *
 * WHY A CLOSED VOCABULARY FOR A FIELD NOTHING ROUTES ON. `sectionTarget` is DISCOVERY:
 * the mount registry routes, and this field is not in the draw key (`drawVariant` keys on
 * `${seed}::${blockId}::${poolKey}`), so nothing renders differently for it being right.
 * It was still half unroutable prose, and a field that is half prose is a defect whether
 * or not anything reads it. The causal register came out 100% canonical under the same
 * parser only because its authors happen to write nothing but backticked tokens.
 *
 * THE EIGHT ARE THE DOC'S, NOT THIS FILE'S. assertSectionVocabulary re-reads them from the
 * causal annex's own §0e table on every run, so a ninth section added there reds this
 * projection instead of passing silently. `overview` and `viability` are STATE-ONLY and
 * declared here rather than in §0e: the state register speaks at two page surfaces the
 * causal register never reaches, while §0e speaks for the causal families, whose eight
 * ship to the runtime as CAUSAL_SECTION_TARGETS in
 * src/domain/display/stateProse/causalDossierProse.js.
 */
const SECTION_TARGETS_STATE_ONLY = Object.freeze(['overview', 'viability']);
const SECTION_TARGETS = Object.freeze([
  'economy', 'history', 'tensions', 'faith', 'power', 'population', 'defense', 'relations',
  ...SECTION_TARGETS_STATE_ONLY,
]);

/**
 * The blocks whose SECTION-TARGET line names NO dossier section, because the surface they
 * are written FOR is not one: DS-GEN-10 targets the printed chapter openers and DS-HK-1
 * the hooks panel header. Both are honest, and minting a section id for them would invent
 * vocabulary no surface has. FROZEN so a new silent one cannot appear.
 */
const SECTION_TARGETLESS_BLOCKS = Object.freeze(['DS-GEN-10', 'DS-HK-1']);

/**
 * The section names the causal annex's §0e table declares, read rather than assumed.
 * @param {string} src the causal markdown
 * @returns {string[]}
 */
function parseSectionVocabulary(src) {
  const lines = src.split('\n');
  const at = lines.findIndex((l) => /^##\s+§0e\s+THE SECTION-TARGET CONVENTION\s*$/.test(l.trimEnd()));
  if (at < 0) return [];
  const found = [];
  for (let i = at + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) {
    const row = lines[i].match(/^\|\s*`([a-z][a-z0-9_-]*)`\s*\|/);
    if (row) found.push(row[1]);
  }
  return found;
}

/**
 * FAIL-CLOSED BOTH WAYS, the shape assertLiveStringsBound already uses for this file's
 * other doc-bound constant: the vocabulary enforced here must be exactly §0e's list plus
 * the two state-only names, in §0e's own order.
 * @param {string} causalDoc
 */
function assertSectionVocabulary(causalDoc) {
  const declared = parseSectionVocabulary(causalDoc);
  const expected = SECTION_TARGETS.filter((s) => !SECTION_TARGETS_STATE_ONLY.includes(s));
  if (declared.join(' ') !== expected.join(' ')) {
    throw new Error(
      'the SECTION-TARGET vocabulary has drifted from the causal annex\'s §0e table.'
      + `\n  §0e declares:       ${declared.join(' ') || '(nothing: the heading or the table moved)'}`
      + `\n  this file enforces: ${expected.join(' ')}`
      + '\n  Move SECTION_TARGETS here and CAUSAL_SECTION_TARGETS in'
      + ' src/domain/display/stateProse/causalDossierProse.js together, or restore §0e.',
    );
  }
}

/**
 * Every SECTION-TARGET token the annexes declare is one of the closed vocabulary.
 *
 * An UNKNOWN BACKTICKED TOKEN THROWS rather than being dropped: on this line a backticked
 * token is indistinguishable from a target, and a plausible-looking wrong section id is
 * worse than the fragments this repair removed. Un-backticked prose is ignored by
 * construction, which is how both annexes spell a surface that is not a dossier section.
 * @param {Array<object>} blocks @param {string} label
 * @returns {{declaring: number, targetless: string[]}}
 */
function assertSectionTargets(blocks, label) {
  const strays = [];
  const targetless = [];
  let declaring = 0;
  for (const b of blocks) {
    if (b.sectionTargetRaw === null) continue;
    declaring += 1;
    for (const t of b.sectionTarget) {
      if (!SECTION_TARGETS.includes(t)) strays.push(`${b.id} names \`${t}\` in:${b.sectionTargetRaw}`);
    }
    if (b.sectionTarget.length === 0) targetless.push(b.id);
  }
  if (strays.length) {
    throw new Error(
      `${label}: ${strays.length} SECTION-TARGET token(s) name no dossier section:\n  `
      + `${strays.join('\n  ')}\n  The vocabulary is: ${SECTION_TARGETS.join(' ')}.`
      + ' Re-word the annex row so that only real targets are backticked.',
    );
  }
  return { declaring, targetless };
}

/**
 * THE MAXIMUM FACES A VARIANT MAY CARRY (ARCH §2.6). One today on every row; four after
 * Shift 1, and the seven `canonical` rows keep one by refusal.
 */
const FACE_PIN = 4;

/**
 * A modifier's DERIVED attach set (ARCH §2.5, E-F1): every RESOLVED spine of THIS block whose
 * selecting branch does NOT test the modifier's own field. No cap of three — the echo bound is
 * per fact and per page-set, not per pool.
 * @param {object} input
 * @returns {string[]}
 */
function derivedAttach({ pools, declaredRoleByPool, censusOf, field }) {
  return pools
    .map((p) => p.key)
    .filter((key) => (declaredRoleByPool[key] || 'spine') === 'spine')
    .filter((key) => {
      const row = censusOf(key);
      if (!row || row.status !== 'RESOLVED') return false;
      return !field || !row.tests.includes(field);
    })
    .sort();
}

/**
 * @param {Array<object>} blocks
 * @param {{meta?: {censusOf: Function, edgesFrom: Function, shapeOf: Function,
 *   clauseOpeners: ReadonlyArray<string>, relationRows: ReadonlyArray<object>,
 *   aliasOf: Map<string, string>,
 *   tally: {sentence: number, clause: number, reasons: Record<string, number>}}}}
 *   [options] when `meta` is given the block carries
 *   `poolMeta` and every variant carries its `vid`. The CAUSAL register takes no `meta`: its
 *   pools are not in the wiring census, §11 refuses wording sets on it in wave one, and its
 *   byte ceiling equals its own genesis bytes (the prose byte baseline's `_causalLeafGround`),
 *   so a `vid` per variant there would breach a ceiling that is a RULING.
 * @returns {object} the runtime shape
 */
function projectBlocks(blocks, options = {}) {
  const out = {};
  const meta = options.meta || null;
  for (const b of blocks) {
    if (b.pools.length === 0) continue;
    const pools = {};
    const poolMeta = {};
    const declaredRoleByPool = Object.fromEntries(
      b.pools.map((p) => [p.key, p.declared.role || 'spine']),
    );
    const blockPoolKeys = new Set(b.pools.map((p) => p.key));
    for (const p of b.pools) {
      // Two pools under one label inside a block would silently shadow; merge is wrong,
      // so the last-wins case is an error.
      if (pools[p.key]) throw new Error(`${b.id}: duplicate pool label "${p.key}"`);
      const label = `${b.id} :: ${p.key}`;
      if (meta) {
        const censusOf = (key) => meta.censusOf(b.id, key);
        assertPoolDeclaration({
          blockId: b.id,
          poolKey: p.key,
          variants: p.variants,
          declared: p.declared,
          censusOf,
          isCovert: isCovertPath,
          edgesFrom: meta.edgesFrom,
          blockPoolKeys,
          declaredRoleByPool,
          taste: meta.taste,
          waive: meta.waive,
        });
        assertNoAuthoringMarker(label, p.variants, meta.taste, meta.waive);
        const form = p.declared.form
          || (p.declared.relation === 'consequence' ? 'fragment' : 'sentence');
        for (const v of p.variants) {
          assertFaces({
            label: `${label} #${v.index}`,
            parent: { angle: v.angle, text: v.text, slots: [...new Set(slotsOn(v.text))] },
            faces: v.wordings,
            pinnedFaceCount: FACE_PIN,
            shapeOf: meta.shapeOf,
            clauseOpeners: meta.clauseOpeners,
            form,
          });
        }
      }
      pools[p.key] = p.variants.map((v) => ({
        angle: v.angle,
        ...(v.marks.length ? { marks: v.marks } : {}),
        text: v.text,
        slots: [...new Set(slotsOn(v.text))],
        ...(meta ? { vid: v.index } : {}),
        ...(v.wordings.length ? { wordings: v.wordings } : {}),
        ...(v.grammar ? { grammar: v.grammar } : {}),
      }));
      if (meta) {
        const role = p.declared.role || 'spine';
        const field = Array.isArray(p.declared.reads) ? p.declared.reads[0] : '';
        const attach = role === 'spine'
          ? []
          : (Array.isArray(p.declared.attach)
            ? p.declared.attach
            : derivedAttach({
              pools: b.pools,
              declaredRoleByPool,
              censusOf: (key) => meta.censusOf(b.id, key),
              field,
            }));
        const row = meta.censusOf(b.id, p.key);
        // ⭐⭐ THE SEAT LICENCE (car 4d). Asked HERE, where the census's `reads`, the relation
        // rows and the ratified aliases are all in hand, and frozen onto the pool — because
        // `reads` never ships (ARCH §16) and a composer that reads it is naming a field its
        // own input cannot carry. `seatMeta` emits the two keys only on a modifier; `seatOf`
        // answers for EVERY pool so the tally below is over all 708 and not over the seven
        // that happen to carry one.
        const licenceInput = {
          role,
          relation: p.declared.relation,
          attach,
          reads: p.declared.reads,
          censusOf: (key) => meta.censusOf(b.id, key),
          relationRows: meta.relationRows,
          aliasOf: meta.aliasOf,
        };
        const licence = seatOf(licenceInput);
        meta.tally[licence.seat] += 1;
        meta.tally.reasons[licence.reason] = (meta.tally.reasons[licence.reason] || 0) + 1;
        poolMeta[p.key] = {
          role,
          variantCount: p.variants.length,
          faceCounts: p.variants.map((v) => 1 + v.wordings.length),
          vids: vidsOf(label, p.variants, undefined, undefined),
          // ⭐ `readsCount` — the ADDENDUM's ruling, and the ONE authoring figure the RENDER
          // half carries. The composer bounds a unit at `k <= 3 - |spine.reads|` and `reads`
          // itself never ships (ARCH §16), so without this integer the composer reads every
          // spine as a one-fact spine and a three-fact spine would take modifiers it has no
          // budget for. It is READ from the census, never derived here, and it is ABSENT
          // where the census records no reading — the composer's one-fact default stands
          // there, unchanged.
          ...(row && row.reads.length ? { readsCount: row.reads.length } : {}),
          ...(p.declared.relation ? { relation: p.declared.relation } : {}),
          ...seatMeta(licenceInput),
          ...(p.declared.form ? { form: p.declared.form } : {}),
          ...(p.declared.move ? { move: p.declared.move } : {}),
          attach,
          // ⭐⭐ `kin` — THE THREAD RULE'S TYPED HALF (REWRITE car 8a-4; SITTING §T.4 / C″),
          // resolved beside the seat licence for the same reason: the `reads`, the relation
          // rows and the aliases are all in hand HERE, and the composer may read neither a
          // lexicon nor `src/domain/prose/`. Emitted only where non-empty, and only a MODIFIER
          // has an attach set, so it ships on none of the 708 spines and moves no leaf byte.
          ...(() => {
            const kin = kinSpines({
              pools: b.pools, attach, variants: p.variants, contentWordsOf: contentWords,
            });
            return kin.length ? { kin } : {};
          })(),
          ...(p.declared.explains ? { explains: p.declared.explains } : {}),
          ...(p.declared.spines ? { spines: p.declared.spines } : {}),
          ...(p.declared.covers ? { covers: p.declared.covers } : {}),
        };
      }
    }
    out[b.id] = {
      title: b.title,
      ...(b.sectionTarget.length ? { sectionTarget: b.sectionTarget } : {}),
      ...(b.arms.length ? { arms: b.arms } : {}),
      slots: b.slots,
      pools,
      ...(meta ? { poolMeta } : {}),
    };
  }
  return out;
}

/** @param {string} name @param {object} data @param {string} note @param {string} outPath */
function emit(name, data, note, outPath) {
  const { body, imports } = bindLiveStrings(JSON.stringify(data, null, 2), outPath);
  return `// GENERATED by scripts/generate-dossier-state-prose.mjs. Do not edit by hand.\n`
    + `// ${note}\n`
    + `// Regenerate with \`npm run gen:dossier-prose\`; the gate runs it with --check.\n`
    + (imports.length
      ? `// A canonical row that IS a live engine string is IMPORTED, never inlined —`
        + ` see LIVE_STRING_BINDINGS in the generator.\n\n${imports.join('')}\n`
      : '\n')
    + `/** @type {Readonly<Record<string, object>>} */\n`
    + `export const ${name} = /* #__PURE__ */ Object.freeze(${body});\n`;
}

const stateSrc = await readFile(STATE_DOC, 'utf8');
const causalSrc = await readFile(CAUSAL_DOC, 'utf8');

const STATE_HEADER = /^###\s+(DS-[A-Z]+-\d+)\b/;
const CAUSAL_HEADER = /^###\s+(JF-[A-Za-z0-9_-]+)\b/;

/** @param {string} text @returns {string} */
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * ⭐⭐ THE SHA INTERLOCK (ARCH §3.5, §12 row 4). The census records the sha256 of every file it
 * was taken over; if one has moved since, the census's reading of what a pool tests is a
 * reading of a composer that no longer exists, and a `poolMeta` projected from it would be a
 * confident wrong answer. So the projection REFUSES TO RUN rather than emit one.
 *
 * ⛔ FAIL-CLOSED ON ABSENCE TOO: a missing or empty census is not "no metadata", it is a
 * projection that cannot know what it is claiming.
 * @returns {Promise<object>}
 */
async function readCensus() {
  const raw = await readFile(CENSUS_JSON, 'utf8').catch(() => null);
  if (raw === null) {
    throw new Error(`${path.relative(ROOT, CENSUS_JSON)} is missing. The RENDER half of poolMeta`
      + ' is projected from it; run `node scripts/wiring-census.mjs` first.');
  }
  const census = JSON.parse(raw);
  const stamped = Object.keys(census.stamp?.files || {});
  const bytes = new Map(await Promise.all(
    stamped.map(async (rel) => [rel, await readFile(path.join(ROOT, rel), 'utf8')]),
  ));
  assertCensusCurrent(census, (rel) => bytes.get(rel), sha256);
  return census;
}

const census = await readCensus();

/** `${block} :: ${pool}` -> the census row, for the projection's own reads. */
const CENSUS_ROWS = new Map(census.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));

/**
 * What the census says about one pool. `tests` is the FUNCTION-WIDE field set (every field the
 * key function evaluates) and `reads` is the SELECTING BRANCH's, which is the grain SITTING
 * §O.1 ruled and the grain `readsCount` reports.
 * @param {string} block @param {string} pool
 */
function censusOf(block, pool) {
  const row = CENSUS_ROWS.get(`${block} :: ${pool}`);
  if (!row) return null;
  return {
    tests: row.fieldsRead || [],
    reads: row.reads || [],
    status: row.status,
    objectClass: row.objectClass ?? null,
    objectClasses: row.objectClasses || [],
    sites: row.sites || [],
  };
}

/** Every typed provenance edge between two field paths, in the ORDERED direction (ARCH §5.2). */
const RELATION_EDGES = new Map();
for (const row of census.relations?.rows || []) {
  const key = `${row.a}|${row.b}`;
  RELATION_EDGES.set(key, [...(RELATION_EDGES.get(key) || []), row]);
}
/** @param {string} from @param {string} to */
function edgesFrom(from, to) {
  if (!from || !to) return [];
  return [
    ...(RELATION_EDGES.get(`${from}|${to}`) || []).filter((r) => r.direction === 'a->b'),
    ...(RELATION_EDGES.get(`${to}|${from}`) || []).filter((r) => r.direction === 'b->a'),
  ];
}

/**
 * The RATIFIED ALIASES as a lookup, read HERE rather than at the relations leaf below because
 * the SEAT LICENCE (car 4d) needs them while the blocks are being projected: an alias is what
 * turns a producer token into the desk read root it is the same fact as (SITTING §P.2-27).
 * @type {Map<string, string>}
 */
const RATIFIED_ALIASES = new Map(
  (census.ratifiedAliases?.rows || []).map((r) => [r.endpoint, r.readRoot]),
);
/** The seat tally, filled as the blocks project and printed with the other census lines. */
const SEAT_TALLY = { sentence: 0, clause: 0, reasons: /** @type {Record<string, number>} */ ({}) };

/** §7b, read before the blocks: the face refusals need the clause lists. */
const connectives = parseConnectives(stateSrc);
const CLAUSE_OPENERS = Object.values(connectives.lists)
  .flatMap((bySeat) => (bySeat.clause || []))
  .map((joint) => joint.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, ''))
  .filter(Boolean);

const stateBlocks = parseAnnex(stateSrc, STATE_HEADER, 'DOSSIER_STATE', { regionEnd: CONNECTIVES_HEADING_RE });
const causalBlocks = parseAnnex(causalSrc, CAUSAL_HEADER, 'CAUSAL_DOSSIER');

const stateDrop = assertNothingDropped(stateSrc, STATE_HEADER, stateBlocks, 'DOSSIER_STATE', { regionEnd: CONNECTIVES_HEADING_RE });
const causalDrop = assertNothingDropped(causalSrc, CAUSAL_HEADER, causalBlocks, 'CAUSAL_DOSSIER');
const stateCount = stateDrop.variants;
const causalCount = causalDrop.variants;

assertSectionVocabulary(causalSrc);
const stateTargets = assertSectionTargets(stateBlocks, 'DOSSIER_STATE');
const causalTargets = assertSectionTargets(causalBlocks, 'CAUSAL_DOSSIER');
const targetless = [...stateTargets.targetless, ...causalTargets.targetless].sort();
if (targetless.join(' ') !== [...SECTION_TARGETLESS_BLOCKS].sort().join(' ')) {
  throw new Error(
    'the set of blocks whose SECTION-TARGET names no dossier section has moved.'
    + `\n  recorded: ${[...SECTION_TARGETLESS_BLOCKS].sort().join(' ')}`
    + `\n  measured: ${targetless.join(' ') || '(none)'}`
    + '\n  A block whose target surface IS a dossier section must name it in backticks;'
    + ' one whose surface is not may join SECTION_TARGETLESS_BLOCKS deliberately.',
  );
}

const slotShapes = mergeSlotShapes([
  parseSlotShapes(stateSrc, 'RECEIPT_POOLS_DOSSIER_STATE.md §0c/§0c-2'),
  parseSlotShapes(causalSrc, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md §0c'),
]);

const stateData = projectBlocks(stateBlocks, {
  meta: {
    taste: tasteMode,
    waive: (message) => tasteWaivers.push(message),
    censusOf,
    edgesFrom,
    shapeOf: (slot) => slotShapes.shapeOf(slot),
    clauseOpeners: CLAUSE_OPENERS,
    relationRows: census.relations?.rows || [],
    aliasOf: RATIFIED_ALIASES,
    tally: SEAT_TALLY,
  },
});
const causalData = projectBlocks(causalBlocks);

/**
 * THE SHAPE GATE. A slot has a NAME, a SEMANTIC gloss and — since 2026-09-02 — a declared
 * GRAMMATICAL SHAPE (§0c). The projection refuses to run when a variant names a slot no
 * register declares, so a slot can never again reach a desk implementer with its shape
 * left to guess. That guess is what shipped `ACCESS_PROSE.road = 'the road'` into eight
 * seams that already carried their own determiner.
 *
 * It runs HERE rather than in a test because a test can be skipped and a projection cannot:
 * every path to a leaf byte goes through this line.
 * @param {Record<string, object>} data
 * @returns {string[]}
 */
function slotsUsedIn(data) {
  return Object.values(data).flatMap((block) => Object.values(block.pools)
    .flat().flatMap((variant) => variant.slots));
}

const shapeGaps = assertSlotShapesTotal(
  slotShapes, [...slotsUsedIn(stateData), ...slotsUsedIn(causalData)],
);
if (shapeGaps.undeclared.length || shapeGaps.deadPrefixes.length) {
  throw new Error(
    'the slot SHAPE register is not total over the corpus.'
    + (shapeGaps.undeclared.length
      ? `\n  used but undeclared: ${shapeGaps.undeclared.map((s) => `{${s}}`).join(' ')}`
        + '\n  Add a row to §0c (or §0c-2, or the causal annex\'s §0c) with a Shape cell.'
      : '')
    + (shapeGaps.deadPrefixes.length
      ? `\n  declared but matching nothing: ${shapeGaps.deadPrefixes.join(' ')}`
        + '\n  A wildcard row that covers no live slot hides the next missing declaration.'
      : ''),
  );
}

const emitted = [];
for (const desk of DESKS) {
  const slice = {};
  for (const [id, block] of Object.entries(stateData)) {
    if (desk.prefixes.some((p) => id.startsWith(p))) slice[id] = block;
  }
  const variants = Object.values(slice)
    .reduce((n, b) => n + Object.values(b.pools).reduce((m, p) => m + p.length, 0), 0);
  if (Object.keys(slice).length === 0) throw new Error(`desk ${desk.file} matched no blocks`);
  const outPath = path.join(STATE_OUT_DIR, `${desk.file}.generated.js`);
  emitted.push({
    path: outPath,
    text: emit(
      desk.constant, slice,
      `${desk.title} — projected from docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
      + ` (${desk.prefixes.join(' + ')}): ${Object.keys(slice).length} blocks, ${variants} variants.`,
      outPath,
    ),
    blocks: Object.keys(slice).length,
    variants,
  });
}
// Every block must land in exactly one desk, or a surface silently loses its prose.
const assigned = emitted.reduce((n, e) => n + (e.blocks || 0), 0);
if (assigned !== Object.keys(stateData).length) {
  throw new Error(`desk split covers ${assigned} of ${Object.keys(stateData).length} blocks`);
}
emitted.push({
  path: CAUSAL_OUT,
  text: emit(
    'DOSSIER_CAUSAL_PROSE', causalData,
    `Projected from docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md —`
    + ` ${Object.keys(causalData).length} join families, ${causalCount} variants.`,
    CAUSAL_OUT,
  ),
  blocks: Object.keys(causalData).length,
  variants: causalCount,
});

// ═══════════════════════════════════════════════════════════════════════════════════
// THE THREE LEAVES ARCH §4.1 GIVES THE COMPOSER BESIDE THE KERNEL (§2.3, §12 row 4)
//
// They ship at their FLOORS. That is a measurement and not a placeholder, and the header of
// each says which floor it stands at and what is OWED, because a reader of a leaf holding an
// empty list must be able to tell "nobody has authored this yet" from "this is empty by law".
// ═══════════════════════════════════════════════════════════════════════════════════

/** @param {string} name @param {object} data @param {string[]} noteLines */
function emitLeaf(name, data, noteLines) {
  return `// GENERATED by scripts/generate-dossier-state-prose.mjs. Do not edit by hand.\n`
    + noteLines.map((l) => (l ? `// ${l}\n` : '//\n')).join('')
    + `// Regenerate with \`npm run gen:dossier-prose\`; the gate runs it with --check.\n\n`
    + `/** @type {Readonly<Record<string, object>>} */\n`
    + `export const ${name} = /* #__PURE__ */ Object.freeze(${JSON.stringify(data, null, 2)});\n`;
}

const connectivePins = connectives.pins
  .map((r) => `${r.relation}.${r.seat} ${r.pin}${r.owed ? ` (floor ${r.floor}, OWED)` : ''}`)
  .join(' · ');
emitted.push({
  path: CONNECTIVES_OUT,
  text: emitLeaf('DOSSIER_CONNECTIVES', connectives.lists, [
    'THE STATE CONNECTIVES, projected from RECEIPT_POOLS_DOSSIER_STATE.md §7b.',
    'The comma and the word that join a modifier to its spine live HERE and nowhere else: never',
    'inside a variant\'s own text (T-F1). FOUR REACHABLE (relation, seat) pairs; a fifth is a',
    'projector error. The empty string IS the empty opener: adjacency, adding no claim.',
    `PINNED LENGTHS: ${connectivePins}.`,
    'A list length is a mechanism of the SHIFT REGISTER (docs/content/prose-shift-register.json):',
    'a longer list changes the modulus of every joint drawn on it, so growth is a DECLARED row.',
    'ALL FOUR STAND AT THEIR FLOORS since REWRITE car 8a-9, as PUBLIC-COPY DRAFTS signed at the',
    'walk (§13 row 27). They are DATA behind the shipped draw and move no rendered byte: no',
    'shipped pool declares `role: modifier`, so no joint of any list is drawn on any town, and',
    'growing a list from one to three re-rolls nothing because nothing was ever rolled.',
    'THE TWO THAT WERE OWED ARE STILL UNLICENSED, which is a different thing from unwritten: no',
    'engine relation row joins two fields a desk reads (car 0 F1), so `seatOf` answers',
    '`not-consequence` on all 708 pools and the composer cannot reach either list. What the',
    'floors buy is that the day a licence exists the writers are not also inventing the joinery.',
  ]),
  label: `${connectives.pins.length} (relation, seat) lists, `
    + `${connectives.pins.reduce((n, r) => n + r.pin, 0)} joints, `
    + `${connectives.pins.filter((r) => r.owed).length} OWED against their floors`,
});

const DEPARTURE_LINE_BP = census.rate?.departureReport?.lineBp ?? null;
if (DEPARTURE_LINE_BP === null) throw new Error('the census carries no departure line; the norm leaf has no ground');
const norms = {};
let departureOnes = 0;
for (const row of census.rows) {
  if (row.rateBp === null || row.rateBp === undefined) continue;
  const departure = row.rateBp < DEPARTURE_LINE_BP ? 1 : 0;
  departureOnes += departure;
  norms[`${row.block}::${row.pool}`] = { departure };
}
const normRows = Object.keys(norms).length;
emitted.push({
  path: NORMS_OUT,
  text: emitLeaf('DOSSIER_PROSE_NORMS', norms, [
    'THE DEPARTURE BIT per pool: `${blockId}::${poolKey}` -> {departure: 0|1}, read off the',
    'wiring census\'s RATE corpus and FROZEN at the pool\'s birth car (P-F4).',
    'A BIT AND NOT A RATE, deliberately: a rate re-measured by an unrelated car would re-order',
    'installed worlds without anyone intending it. The measured rate stays a REPORT in the census.',
    // ⛔ THE DENOMINATOR IS THE POOLS THE RATE CORPUS COULD MEASURE, WHICH IS THE SPINE COUNT
    // (TASTE car M-2). `census.rows.length` gained the taste's seven modifier rows, and no
    // modifier has a rate yet — its predicate lives in a candidate leaf the corpus walk does
    // not call — so "271 of 715" would report seven pools as measured-and-silent when they were
    // never measured at all. `totals.pools` is the census's own spine count.
    `MEASURED: ${normRows} of ${census.totals.pools} pools fired on the RATE corpus (768 towns,`,
    `192 cells, 4 seeds); ${departureOnes} of them read 1 at the departure line of`,
    `${DEPARTURE_LINE_BP} basis points.`,
    'A POOL WITH NO ROW IS ABSENT, NOT ZERO, and the composer reads an absent row as "not a',
    'departure": the same reading as 0, and the honest one. A pool the RATE corpus never fired',
    'has no measurable norm, so its bit is OWED rather than assumed. The remainder are those.',
  ]),
  label: `${normRows} pools with a measured bit, ${departureOnes} of them a DEPARTURE`,
});

const relations = {};
for (const row of census.relations?.rows || []) {
  const key = `${row.a}|${row.b}`;
  // The census spells the direction in ASCII; the composer's own reader spells it with the
  // arrow (composeStateProse.js `edgesFrom`), and the leaf is what that reader reads.
  const entry = {
    relation: row.relation,
    source: row.source,
    direction: row.direction === 'a->b' ? 'a→b' : 'b→a',
    ...(row.whenA ? { whenA: row.whenA } : {}),
  };
  relations[key] = [...(relations[key] || []), entry];
}
const aliasRows = (census.ratifiedAliases?.rows || [])
  .map((r) => ({ endpoint: r.endpoint, readRoot: r.readRoot, evidence: r.evidence, at: r.at }));
const aliasOf = new Map(aliasRows.map((r) => [r.endpoint, r.readRoot]));
const deskRoots = new Set(census.rows.flatMap((r) => r.reads || []).map((path_) => String(path_).split('.')[0]));
const resolves = (endpoint) => aliasOf.has(endpoint)
  || deskRoots.has(String(endpoint).split('.')[0]);
const joinable = (census.relations?.rows || []).filter((r) => resolves(r.a) && resolves(r.b)).length;
emitted.push({
  path: RELATIONS_OUT,
  text: emitLeaf('DOSSIER_RELATIONS', relations, [
    'THE RELATION TABLE: `${fieldA}|${fieldB}` -> the typed provenance edges between them, each',
    'with a DIRECTION. Projected from the engine\'s OWN tables through the wiring census',
    '(ARCH §5.2 sources (a) condition archetype -> system variable, (b) CAUSE_SIGNAL, (c) the',
    'generator\'s recorded derivations); source (d), the sitting\'s ratified axis pairs, is empty.',
    `MEASURED: ${Object.keys(relations).length} pairs over`,
    `${(census.relations?.rows || []).length} rows, every one running a->b.`,
    '',
    '⛔ THE JOIN IS EMPTY, AND THAT IS THE MEASUREMENT CAR 0 LANDED (F1, ARCH §16 item 9).',
    `With the ratified aliases applied, ${joinable} of ${(census.relations?.rows || []).length}`,
    'rows have BOTH endpoints resolving to a field a desk reads. The rows are keyed on PRODUCER',
    'tokens (`condition:plague`, `system:food_security`) and the desks read settlement paths, so',
    'no `consequence` and no `tension` joint is authorable anywhere on the shipped corpus and',
    'every joint stands at the `addition` floor. The cure is the ALIAS TABLE below.',
  ])
    + `\n/**\n`
    + ` * THE RATIFIED ALIASES (SITTING §P.2-27). The chair ratified the alias draft's\n`
    + ` * \`identifier\` rows, the same identifier standing on both sides, one of them ARCH §5.2's\n`
    + ` * own worked edge — and WITHDREW the four "would join" rows and every \`generator-write\`\n`
    + ` * citation that was a comment, a prose string, a template string or an arrow parameter.\n`
    + ` * A row here maps a relation ENDPOINT to the desk READ ROOT it is the same fact as.\n`
    + ` * @type {ReadonlyArray<{endpoint: string, readRoot: string, evidence: string, at: string}>}\n`
    + ` */\n`
    + `export const DOSSIER_RELATION_ALIASES = /* #__PURE__ */ Object.freeze(${JSON.stringify(aliasRows, null, 2)});\n`,
  label: `${Object.keys(relations).length} pairs, ${aliasRows.length} ratified aliases, `
    + `${joinable} rows joining a desk read on both endpoints`,
});

// Every bound live string landed as a reference, and none survived as a literal.
assertLiveStringsBound(emitted);

/**
 * ⭐ THE SEAT CENSUS (car 4d) — one line, over every state pool, with the reason each took.
 * "No clause can seat today" is this tally and not a sentence in a header: the day an alias
 * makes the first `consequence` authorable, this line moves and the SHIFT REGISTER's `seat`
 * row stops being a named non-mechanism.
 */
const seatLine = Object.entries(SEAT_TALLY.reasons).sort()
  .map(([reason, n]) => `${reason} ${n}`).join(' · ');
console.log(`[dossier-prose] seats: ${SEAT_TALLY.sentence} sentence / ${SEAT_TALLY.clause} clause`
  + ` over ${SEAT_TALLY.sentence + SEAT_TALLY.clause} state pools (${seatLine})`);

// ⭐⭐ EVERY WAIVER THE `--taste` FLAG TOOK, PRINTED AND COUNTED. A relaxation nobody prints is
// a relaxation nobody can audit, so the run says exactly which refusals it did not make and
// why. Without the flag this list is empty by construction: each waiver site throws first.
if (tasteWaivers.length > 0) {
  console.log(`[dossier-prose] ⛔ --taste WAIVED ${tasteWaivers.length} refusal(s) that the shipped`
    + ' build makes. The shipped projector (no --taste) refuses each of these BY NAME:');
  for (const line of tasteWaivers) console.log(`[dossier-prose]   ${line}`);
} else if (tasteMode) {
  console.log('[dossier-prose] --taste was passed and NO refusal needed waiving.');
}

if (checkOnly) {
  for (const e of emitted) {
    const have = await readFile(e.path, 'utf8').catch(() => null);
    if (have !== e.text) {
      throw new Error(`${path.relative(ROOT, e.path)} is stale; run \`npm run gen:dossier-prose\`.`);
    }
  }
  console.log(`[dossier-prose] section targets: ${stateTargets.declaring + causalTargets.declaring} blocks declare one over ${SECTION_TARGETS.length} sections; ${targetless.length} name none (${targetless.join(', ')})`);
  console.log(`[dossier-prose] verified ${Object.keys(stateData).length} state blocks / ${stateCount} variants across ${DESKS.length} desks, ${Object.keys(causalData).length} causal families / ${causalCount} variants`);
} else {
  await mkdir(STATE_OUT_DIR, { recursive: true });
  for (const e of emitted) await writeFile(e.path, e.text);
  for (const e of emitted) {
    console.log(`[dossier-prose]   ${path.relative(ROOT, e.path)} — `
      + (e.label || `${e.blocks} blocks, ${e.variants} variants`));
  }
  console.log(`[dossier-prose] section targets: ${stateTargets.declaring + causalTargets.declaring} blocks declare one over ${SECTION_TARGETS.length} sections; ${targetless.length} name none (${targetless.join(', ')})`);
  console.log(`[dossier-prose] wrote ${Object.keys(stateData).length} state blocks / ${stateCount} variants across ${DESKS.length} desks, ${Object.keys(causalData).length} causal families / ${causalCount} variants`);
}
