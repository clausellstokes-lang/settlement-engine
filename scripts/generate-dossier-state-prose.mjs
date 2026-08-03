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
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const STATE_DOC = path.join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md');
const CAUSAL_DOC = path.join(ROOT, 'docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md');
const STATE_OUT_DIR = path.join(ROOT, 'src/data/dossierStateProse');
const CAUSAL_OUT = path.join(ROOT, 'src/data/dossierCausalProse.generated.js');

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
 * @param {string} tag
 * @returns {{angle: string, marks: string[]}}
 */
function parseTag(tag) {
  const parts = tag.split('·').map((p) => p.trim()).filter(Boolean);
  return { angle: parts[0] || '', marks: parts.slice(1) };
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
function parseAnnex(src, headerRe, label) {
  const lines = src.split('\n');
  /** @type {Array<{id:string,title:string,sectionTarget:string[],arms:string[],slots:string[],pools:Array<{key:string,variants:Array<object>}>}>} */
  const blocks = [];
  let block = null;
  let pool = null;
  let lastBold = null;
  let lastIndex = -1;
  let skipping = false;

  const openPool = (key) => {
    if (block === null) throw new Error(`${label}: pool "${key}" outside any block`);
    pool = { key, variants: [] };
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
    if (skipping || !block) continue;

    if (/^\*\*SLOTS[:.]\*\*/.test(line)) {
      block.slots = [...new Set(slotsOn(line))];
      continue;
    }
    if (/^\*\*SECTION-TARGET[:.]\*\*/.test(line)) {
      block.sectionTarget = stripInlineCode(line.replace(/^\*\*SECTION-TARGET[:.]\*\*/, ''))
        .split(/·|,/).map((s) => s.trim().replace(/^also\s+/i, '').trim()).filter(Boolean);
      continue;
    }
    if (/^\*\*ARMS[:.]\*\*/.test(line)) {
      block.arms = [...line.matchAll(/`([a-z_]+)`/g)].map((m) => m[1]);
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
      openPool(group ? `${group} — ${rowKey}` : rowKey);
      for (const m of compact[2].matchAll(COMPACT_VARIANT_RE)) {
        const { angle, marks } = parseTag(m[2]);
        const lead = m[3].match(LEADING_TAG_RE);
        const extra = lead ? parseTag(lead[1]) : null;
        pool.variants.push({
          index: Number(m[1]),
          angle,
          marks: extra ? [...marks, extra.angle, ...extra.marks].filter(Boolean) : marks,
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
      pool.variants.push({ index: 0, angle: 'canonical', marks: [], text: cleanText(canonical[2]) });
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
      const { angle, marks } = parseTag(variant[2]);
      const extra = variant[3] ? parseTag(variant[3]) : null;
      const allMarks = extra ? [...marks, extra.angle, ...extra.marks].filter(Boolean) : marks;
      pool.variants.push({ index: n, angle, marks: allMarks, text: cleanText(variant[4]) });
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
function assertNothingDropped(src, headerRe, blocks, label) {
  const lines = src.split('\n');
  let inBlock = false;
  let tagged = 0;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (headerRe.test(line)) { inBlock = !/FOLDED INTO/i.test(line); continue; }
    if (!inBlock) continue;
    if (VARIANT_RE.test(line) || CANONICAL_RE.test(line)) { tagged += 1; continue; }
    const compact = line.match(COMPACT_BULLET_RE) || line.match(COMPACT_BOLD_RE);
    if (compact) tagged += [...compact[2].matchAll(COMPACT_VARIANT_RE)].length;
  }
  const captured = blocks.reduce(
    (n, b) => n + b.pools.reduce((m, p) => m + p.variants.length, 0), 0,
  );
  if (captured !== tagged) {
    throw new Error(`${label}: ${tagged} tagged pool lines in block regions, ${captured} captured — ${tagged - captured} dropped`);
  }
  return captured;
}

/** @param {Array<object>} blocks @returns {object} the runtime shape */
function projectBlocks(blocks) {
  const out = {};
  for (const b of blocks) {
    if (b.pools.length === 0) continue;
    const pools = {};
    for (const p of b.pools) {
      // Two pools under one label inside a block would silently shadow; merge is wrong,
      // so the last-wins case is an error.
      if (pools[p.key]) throw new Error(`${b.id}: duplicate pool label "${p.key}"`);
      pools[p.key] = p.variants.map((v) => ({
        angle: v.angle,
        ...(v.marks.length ? { marks: v.marks } : {}),
        text: v.text,
        slots: [...new Set(slotsOn(v.text))],
      }));
    }
    out[b.id] = {
      title: b.title,
      ...(b.sectionTarget.length ? { sectionTarget: b.sectionTarget } : {}),
      ...(b.arms.length ? { arms: b.arms } : {}),
      slots: b.slots,
      pools,
    };
  }
  return out;
}

/** @param {string} name @param {string} script @param {object} data @param {string} note */
function emit(name, data, note) {
  return `// GENERATED by scripts/generate-dossier-state-prose.mjs. Do not edit by hand.\n`
    + `// ${note}\n`
    + `// Regenerate with \`npm run gen:dossier-prose\`; the gate runs it with --check.\n\n`
    + `/** @type {Readonly<Record<string, object>>} */\n`
    + `export const ${name} = /* #__PURE__ */ Object.freeze(${JSON.stringify(data, null, 2)});\n`;
}

const stateSrc = await readFile(STATE_DOC, 'utf8');
const causalSrc = await readFile(CAUSAL_DOC, 'utf8');

const STATE_HEADER = /^###\s+(DS-[A-Z]+-\d+)\b/;
const CAUSAL_HEADER = /^###\s+(JF-[A-Za-z0-9_-]+)\b/;

const stateBlocks = parseAnnex(stateSrc, STATE_HEADER, 'DOSSIER_STATE');
const causalBlocks = parseAnnex(causalSrc, CAUSAL_HEADER, 'CAUSAL_DOSSIER');

const stateCount = assertNothingDropped(stateSrc, STATE_HEADER, stateBlocks, 'DOSSIER_STATE');
const causalCount = assertNothingDropped(causalSrc, CAUSAL_HEADER, causalBlocks, 'CAUSAL_DOSSIER');

const stateData = projectBlocks(stateBlocks);
const causalData = projectBlocks(causalBlocks);

const emitted = [];
for (const desk of DESKS) {
  const slice = {};
  for (const [id, block] of Object.entries(stateData)) {
    if (desk.prefixes.some((p) => id.startsWith(p))) slice[id] = block;
  }
  const variants = Object.values(slice)
    .reduce((n, b) => n + Object.values(b.pools).reduce((m, p) => m + p.length, 0), 0);
  if (Object.keys(slice).length === 0) throw new Error(`desk ${desk.file} matched no blocks`);
  emitted.push({
    path: path.join(STATE_OUT_DIR, `${desk.file}.generated.js`),
    text: emit(
      desk.constant, slice,
      `${desk.title} — projected from docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
      + ` (${desk.prefixes.join(' + ')}): ${Object.keys(slice).length} blocks, ${variants} variants.`,
    ),
    blocks: Object.keys(slice).length,
    variants,
  });
}
// Every block must land in exactly one desk, or a surface silently loses its prose.
const assigned = emitted.reduce((n, e) => n + e.blocks, 0);
if (assigned !== Object.keys(stateData).length) {
  throw new Error(`desk split covers ${assigned} of ${Object.keys(stateData).length} blocks`);
}
emitted.push({
  path: CAUSAL_OUT,
  text: emit(
    'DOSSIER_CAUSAL_PROSE', causalData,
    `Projected from docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md —`
    + ` ${Object.keys(causalData).length} join families, ${causalCount} variants.`,
  ),
  blocks: Object.keys(causalData).length,
  variants: causalCount,
});

if (checkOnly) {
  for (const e of emitted) {
    const have = await readFile(e.path, 'utf8').catch(() => null);
    if (have !== e.text) {
      throw new Error(`${path.relative(ROOT, e.path)} is stale; run \`npm run gen:dossier-prose\`.`);
    }
  }
  console.log(`[dossier-prose] verified ${Object.keys(stateData).length} state blocks / ${stateCount} variants across ${DESKS.length} desks, ${Object.keys(causalData).length} causal families / ${causalCount} variants`);
} else {
  await mkdir(STATE_OUT_DIR, { recursive: true });
  for (const e of emitted) await writeFile(e.path, e.text);
  for (const e of emitted) {
    console.log(`[dossier-prose]   ${path.relative(ROOT, e.path)} — ${e.blocks} blocks, ${e.variants} variants`);
  }
  console.log(`[dossier-prose] wrote ${Object.keys(stateData).length} state blocks / ${stateCount} variants across ${DESKS.length} desks, ${Object.keys(causalData).length} causal families / ${causalCount} variants`);
}
