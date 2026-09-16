/**
 * tests/helpers/dossierCorpus.js — THE CORPUS LOADERS the entry and grammar walkers read.
 *
 * WHY A LOADER PER HOME. `check-pair.mjs:16-33` loads two homes — the projected dossier
 * leaves and the causal table — and every reconcile named the same gap: a rule that cites
 * `check-pair.mjs` on a register whose loader does not exist is OWED, not tested. This
 * module is that debt, paid one home at a time, with every home materialised in ONE shape
 * so the walkers do not learn a second vocabulary per register.
 *
 * THE SHAPE, carried verbatim from `check-pair.mjs:22`:
 *   `{ id, text, block, pool, poolId, idx, angle, marks, slots, file, line, register,
 *      siblings }`
 * `siblings` is the list of SIBLING POOL KEYS of the same block (check-pair's meaning);
 * the sibling VARIANTS of one cell are assembled by `poolCells()` because the entry walker
 * needs the cell, not the block.
 *
 * FAIL-CLOSED, in the `sourceContract.js` discipline. Every loader THROWS when its home is
 * missing or reads empty. A loader that returns `[]` after a rename is the silent-extractor
 * class the estate already burned (`contractTestAntiVacuity.walker.test.js`), and a walker
 * standing on one measures nothing while passing.
 *
 * READ-ONLY. Nothing here writes a corpus byte. The annex is read by RAW BYTES rather than
 * through the numbered-line join, because that join truncates 13 line-wrapped rows and
 * under-reads the wired count 8 against 129 (PROBE_ALL_REFUTATION R-5).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '../..');

/** The projected desk leaves — the R1 STATE register. */
const LEAF_DIR = join(ROOT, 'src/data/dossierStateProse');
/** The projected causal table — the R2 CAUSAL JOIN register. */
const CAUSAL_LEAF = join(ROOT, 'src/data/dossierCausalProse.generated.js');
/** The AUTHORED annex the leaves are projected from. */
export const STATE_ANNEX = join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md');
/** The Herald's crier voice — R5, whose two homes PROBE_ALL's roster names. */
const NEWS_VOICE = join(ROOT, 'src/domain/display/newsVoice.js');
const NEWS_BODY = join(ROOT, 'src/domain/display/newsBody.js');
/** A generator prose home (R14-class): faction dynamics narratives. */
const FACTION_DYNAMICS = join(ROOT, 'src/generators/factionDynamics.js');

/**
 * @typedef {object} CorpusEntry
 * @property {string} id
 * @property {string} text
 * @property {string} block
 * @property {string} pool
 * @property {string} poolId
 * @property {number} idx
 * @property {number} [vid] the leaf's STABLE ID, R1 only. `idx` is the variant's position in
 *   the pool array and moves when anything is inserted before it; `vid` is the annex row
 *   number, which never moves, and it is what `drawVariant` keys the index-stable draw on
 *   (law 6). They differ by one on the 701 pools numbered from 1 and coincide on the seven
 *   led by a `canonical` row numbered 0, so a reader that wants the DRAW's coordinate must
 *   take this field and never `idx`.
 * @property {string} angle
 * @property {string[]} marks
 * @property {string[]} slots
 * @property {string} file
 * @property {number} [line]
 * @property {string} register
 * @property {string[]} siblings
 */

/**
 * THE THIRD FAIL-CLOSED PATH, and the one no test drove.
 *
 * ⛔ IT WAS EXPORTED FOR EXACTLY THAT REASON. `git grep refuseEmpty` returned twelve hits —
 * every call site plus this definition — and no test in the estate ran it, while the file's
 * own docblock claimed "each control MUST fire, and each does". A guard nobody has ever seen
 * fire is a guard nobody has measured; that is the false-green class the docblock invokes,
 * committed by the docblock itself.
 * @param {string} label @param {unknown[]} rows @returns {void}
 */
export function refuseEmpty(label, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(`dossierCorpus: the ${label} loader read ZERO rows — the home moved or the parser went dark`);
  }
}

/**
 * R1 — the six projected desk leaves, imported as MODULES so `marks`, `angle` and `slots`
 * are read off the objects and never regexed out of the text.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadStateLeaves() {
  /** @type {CorpusEntry[]} */
  const out = [];
  const files = readdirSync(LEAF_DIR).filter((f) => f.endsWith('.generated.js')).sort();
  if (files.length === 0) throw new Error('dossierCorpus: no .generated.js leaves in src/data/dossierStateProse');
  for (const file of files) {
    const mod = await import(/* @vite-ignore */ `file://${join(LEAF_DIR, file)}`);
    const table = Object.values(mod)[0];
    for (const [block, b] of Object.entries(/** @type {Record<string, any>} */ (table))) {
      const poolKeys = Object.keys(b.pools || {});
      for (const [pool, variants] of Object.entries(/** @type {Record<string, any[]>} */ (b.pools || {}))) {
        variants.forEach((v, idx) => {
          out.push({
            id: `${file}::${block}::${pool}#${idx}`,
            text: v.text,
            block,
            pool,
            poolId: `${file}::${block}::${pool}`,
            idx,
            vid: v.vid,
            angle: v.angle || '',
            marks: Array.isArray(v.marks) ? [...v.marks] : [],
            slots: Array.isArray(v.slots) ? [...v.slots] : [],
            file: `src/data/dossierStateProse/${file}`,
            register: 'R1',
            siblings: poolKeys.filter((k) => k !== pool),
          });
        });
      }
    }
  }
  refuseEmpty('R1 state leaf', out);
  return out;
}

/**
 * R2 — the causal join table. Its shape is a nest of arrays keyed by family and arm, so it
 * is walked rather than indexed (`check-pair.mjs:26-33`'s own method, kept).
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadCausalLeaf() {
  const mod = await import(/* @vite-ignore */ `file://${CAUSAL_LEAF}`);
  const table = Object.values(mod)[0];
  /** @type {CorpusEntry[]} */
  const out = [];
  let poolSeq = 0;
  /** @param {any} node @param {string} key */
  const walk = (node, key) => {
    if (Array.isArray(node)) {
      const poolId = `causal::${key}::${poolSeq++}`;
      node.forEach((v, idx) => {
        if (!v || typeof v.text !== 'string') return;
        out.push({
          id: `${poolId}#${idx}`,
          text: v.text,
          block: 'CAUSAL',
          pool: key,
          poolId,
          idx,
          angle: v.angle || '',
          marks: Array.isArray(v.marks) ? [...v.marks] : [],
          slots: Array.isArray(v.slots) ? [...v.slots] : [],
          file: 'src/data/dossierCausalProse.generated.js',
          register: 'R2',
          siblings: [],
        });
      });
      return;
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, k);
    }
  };
  walk(table, 'CAUSAL');
  refuseEmpty('R2 causal leaf', out);
  return out;
}

/**
 * Strip the trailing italic authoring note — an aside to the chair, never prose. MIRRORS
 * `scripts/generate-dossier-state-prose.mjs`'s `cleanText` deliberately and for its stated
 * reason: a regex cannot do this, because several notes carry their own `**bold**`, so an
 * asterisk-free body is not a safe delimiter. Two openers are in use — ` *(…)*` and
 * ` *— …*` — and both run to end of line.
 *
 * ⚠ THIS IS THE SECOND SPELLING OF ONE RULE, and the join rate is what pins it: with the
 * naive one-regex version six rows failed to join (DS-FTH-2/3/4's slot-requirement notes),
 * and the walker test asserts the unjoined count so a future divergence is loud.
 * @param {string} text
 * @returns {string}
 */
function cleanAnnexText(text) {
  const out = String(text).trim();
  if (!out.endsWith('*')) return out;
  const at = Math.max(out.lastIndexOf(' *('), out.lastIndexOf(' *—'));
  if (at <= 0) return out;
  const body = out.slice(0, at).trim();
  return body.length > 0 ? body : out;
}

/**
 * THE ANNEX, BY RAW BYTES — for the ADDRESS, never for the grammar.
 *
 * ⭐ THE DIVISION OF LABOUR, and the reason it is not a re-parse. The annex's pool grammar
 * is not one rule: `generate-dossier-state-prose.mjs` carries SEVEN regexes for it
 * (`BOLD_LINE_RE`, `COMPACT_BULLET_RE`, `COMPACT_BOLD_RE`, `LEADING_TAG_RE`, …) plus
 * `poolKeyOf`. This lane's first cut re-implemented the bold-line rule with one regex and
 * mis-keyed the row at `RECEIPT_POOLS_DOSSIER_STATE.md:5233` to the PREVIOUS pool, because
 * its header line carries a trailing scope note the one-regex version did not admit — a
 * silent mis-address on the exact row the anti-vacuity guard cites. So the grammar stays
 * where it is already parsed ONCE (the shipped projection, whose output the contract test
 * byte-compares), and this reader takes only what the leaf cannot give: the ROW's LINE
 * NUMBER, and the rows the projection does NOT carry.
 *
 * The row scan is by raw bytes rather than through the numbered-line join, because that
 * join truncates 13 line-wrapped rows and under-reads the wired count 8 against 129
 * (PROBE_ALL_REFUTATION R-5).
 * @param {string} [path]
 * @returns {CorpusEntry[]} rows carrying `block` (from the `### DS-…` header), `text` and
 *   `line`; `pool`, `marks` and `slots` are filled by `joinAnnexToLeaves`
 */
export function loadStateAnnex(path = STATE_ANNEX) {
  const lines = readFileSync(path, 'utf8').split('\n');
  /** @type {CorpusEntry[]} */
  const out = [];
  let block = '';
  const rel = path.startsWith(ROOT) ? path.slice(ROOT.length + 1) : path;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const head = raw.match(/^###\s+(DS-[A-Z]+-\d+)\b/);
    if (head) { [, block] = head; continue; }
    const row = raw.match(/^(\d+)\.\s+`\[([^\]]*)\]`\s+(.*)$/);
    if (!row || !block) continue;
    const [, , tag, rowText] = row;
    const text = cleanAnnexText(rowText);
    const parts = tag.split('·').map((s) => s.trim()).filter(Boolean);
    out.push({
      id: `${rel}:${i + 1}`,
      text,
      block,
      pool: '',
      poolId: `annex::${block}`,
      idx: out.length,
      angle: parts[0] || '',
      marks: parts.slice(1),
      slots: [...new Set([...text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
      file: rel,
      line: i + 1,
      register: 'annex',
      siblings: [],
    });
  }
  refuseEmpty('state annex (raw bytes)', out);
  return out;
}

/**
 * Join annex rows to their PROJECTED twins by exact text, so each row gains the pool key,
 * the marks and the declared slots the shipped projection already resolved, and each leaf
 * variant gains the annex LINE its bytes came from. A row that joins nowhere is REPORTED,
 * never dropped: it is either authored depth no pool carries or a projection the leaf
 * reshaped, and both are findings.
 * @param {ReadonlyArray<CorpusEntry>} annexRows
 * @param {ReadonlyArray<CorpusEntry>} leaves
 * @returns {{joined: CorpusEntry[], unjoined: CorpusEntry[], leafLines: Map<string, number>}}
 */
export function joinAnnexToLeaves(annexRows, leaves) {
  /** @type {Map<string, CorpusEntry[]>} */
  const byText = new Map();
  for (const leaf of leaves) {
    if (!byText.has(leaf.text)) byText.set(leaf.text, []);
    (byText.get(leaf.text) || []).push(leaf);
  }
  /** @type {CorpusEntry[]} */
  const joined = [];
  /** @type {CorpusEntry[]} */
  const unjoined = [];
  /** @type {Map<string, number>} */
  const leafLines = new Map();
  for (const row of annexRows) {
    const twins = (byText.get(row.text) || []).filter((t) => t.block === row.block);
    const twin = twins[0];
    if (!twin) { unjoined.push(row); continue; }
    joined.push({
      ...row,
      pool: twin.pool,
      poolId: `annex::${row.block}::${twin.pool}`,
      marks: twin.marks,
      slots: twin.slots,
      siblings: twin.siblings,
    });
    for (const t of twins) if (typeof row.line === 'number') leafLines.set(t.id, row.line);
  }
  return { joined, unjoined, leafLines };
}

/**
 * R5 — the Herald's crier voice, over BOTH homes PROBE_ALL's roster names
 * (`display/newsVoice.js`, `display/newsBody.js`) and all three of their pool tables:
 * `VOICE_LINES[category][bucket]`, the `VOICE_FLOOR[category]` fallbacks, and
 * `BODY_POOLS`. Each array is a POOL; its path is the key.
 *
 * ⚠ THE UNIT DIFFERS FROM PROBE_ALL'S and the walker prints both. PROBE_ALL's R5 n = 373 is
 * a count of DEDUPLICATED SENTENCES; this loader's unit is the AUTHORED LINE, and several
 * lines carry two sentences. A run reports its own line count, its sentence count and the
 * 373 side by side rather than reconciling them by hand.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadCrierVoice() {
  /** @type {CorpusEntry[]} */
  const out = [];
  /**
   * @param {string} absPath
   * @param {string} rel
   * @param {string} tableName
   * @param {unknown} table
   */
  const harvest = (absPath, rel, tableName, table) => {
    if (!table || typeof table !== 'object') {
      throw new Error(`dossierCorpus: ${rel} exports no ${tableName} — the R5 loader is dark`);
    }
    const src = readFileSync(absPath, 'utf8').split('\n');
    /** @param {string} text */
    const lineOf = (text) => {
      const needle = text.slice(0, 48);
      const at = src.findIndex((l) => l.includes(needle));
      return at >= 0 ? at + 1 : undefined;
    };
    /**
     * @param {string} category
     * @param {string} bucket
     * @param {string[]} lines
     * @param {string[]} siblings
     */
    const push = (category, bucket, lines, siblings) => {
      lines.forEach((text, idx) => {
        const line = lineOf(text);
        out.push({
          id: `${tableName}::${category}${bucket ? `::${bucket}` : ''}#${idx}`,
          text,
          block: `${tableName}-${category}`,
          pool: bucket || '*',
          poolId: `${tableName}::${category}${bucket ? `::${bucket}` : ''}`,
          idx,
          angle: '',
          marks: [],
          // R5 declares no slot list anywhere — the crier's pools are bare strings — so the
          // loader derives it from the text. Leaving it empty made the walker's arm D report
          // twelve "undeclared slot" faults on `BODY_POOLS`'s `{scope}`, which was the
          // LOADER's silence and not the corpus's fault.
          slots: [...new Set([...text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
          file: rel,
          ...(line ? { line } : {}),
          register: 'R5',
          siblings,
        });
      });
    };
    for (const [category, value] of Object.entries(/** @type {Record<string, unknown>} */ (table))) {
      if (Array.isArray(value)) { push(category, '', value, []); continue; }
      if (!value || typeof value !== 'object') continue;
      const buckets = /** @type {Record<string, unknown>} */ (value);
      for (const [bucket, lines] of Object.entries(buckets)) {
        if (Array.isArray(lines)) push(category, bucket, lines, Object.keys(buckets).filter((k) => k !== bucket));
      }
    }
  };
  const voice = await import(/* @vite-ignore */ `file://${NEWS_VOICE}`);
  harvest(NEWS_VOICE, 'src/domain/display/newsVoice.js', 'VOICE_LINES', voice.VOICE_LINES);
  harvest(NEWS_VOICE, 'src/domain/display/newsVoice.js', 'VOICE_FLOOR', voice.VOICE_FLOOR);
  const body = await import(/* @vite-ignore */ `file://${NEWS_BODY}`);
  harvest(NEWS_BODY, 'src/domain/display/newsBody.js', 'BODY_POOLS', body.BODY_POOLS);
  refuseEmpty('R5 crier voice', out);
  return out;
}

/**
 * A generator prose home read from SOURCE, because its strings are template literals inside
 * a function and no export reaches them (PROSE_INVENTORY §5's class: 3,881 in-function
 * strings with no export to walk). The extractor is line-anchored and THROWS when it finds
 * nothing.
 * @param {string} [path]
 * @returns {CorpusEntry[]}
 */
export function loadInFunctionNarratives(path = FACTION_DYNAMICS) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const rel = path.startsWith(ROOT) ? path.slice(ROOT.length + 1) : path;
  /** @type {CorpusEntry[]} */
  const out = [];
  lines.forEach((line, i) => {
    const m = line.match(/^\s*narrative\s*=\s*`(.+)`;\s*$/);
    if (!m) return;
    out.push({
      id: `${rel}:${i + 1}`,
      // `${expr}` interpolations are the file's own slots; they are normalised to `{slot}`
      // so the walker reads them as typed references rather than as prose.
      text: m[1].replace(/\$\{[^}]*\}/g, '{slot}'),
      block: 'FACTION-DYNAMICS',
      pool: '*',
      poolId: `${rel}::narrative`,
      idx: out.length,
      angle: '',
      marks: [],
      slots: ['slot'],
      file: rel,
      line: i + 1,
      register: 'R14',
      siblings: [],
    });
  });
  refuseEmpty(`in-function narratives (${rel})`, out);
  return out;
}

/**
 * Group a corpus into POOL CELLS — the unit C5 compares. The cell is `poolId`; the members
 * are the variants in their authored order.
 * @param {ReadonlyArray<CorpusEntry>} corpus
 * @returns {Map<string, CorpusEntry[]>}
 */
export function poolCells(corpus) {
  /** @type {Map<string, CorpusEntry[]>} */
  const cells = new Map();
  for (const e of corpus) {
    if (!cells.has(e.poolId)) cells.set(e.poolId, []);
    (cells.get(e.poolId) || []).push(e);
  }
  return cells;
}

/**
 * The BLOCK-level slot census: what each block DECLARES and what its variants NAME. The
 * third column — what the composer FILLS — comes from `dossierComposedFill.js`, because it
 * is a property of the READER, not of the corpus.
 * @returns {Promise<Map<string, {declared: string[], variantUnion: string[],
 *   pools: Map<string, string[]>}>>}
 */
export async function blockSlotCensus() {
  /** @type {Map<string, {declared: string[], variantUnion: string[], pools: Map<string, string[]>}>} */
  const census = new Map();
  const files = readdirSync(LEAF_DIR).filter((f) => f.endsWith('.generated.js')).sort();
  for (const file of files) {
    const mod = await import(/* @vite-ignore */ `file://${join(LEAF_DIR, file)}`);
    const table = Object.values(mod)[0];
    for (const [block, b] of Object.entries(/** @type {Record<string, any>} */ (table))) {
      /** @type {Map<string, string[]>} */
      const pools = new Map();
      const union = new Set();
      for (const [pool, variants] of Object.entries(/** @type {Record<string, any[]>} */ (b.pools || {}))) {
        const perPool = new Set();
        for (const v of variants) {
          for (const s of v.slots || []) { union.add(s); perPool.add(s); }
        }
        pools.set(pool, [...perPool].sort());
      }
      census.set(block, {
        declared: [...(b.slots || [])].sort(),
        variantUnion: [...union].sort(),
        pools,
      });
    }
  }
  if (census.size === 0) throw new Error('dossierCorpus: the block slot census read zero blocks');
  return census;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// CAR 3 — THE REGISTER LOADERS, in the wave's order
//
// Every reconcile named the same gap: a rule that cites `check-pair.mjs` on a register whose
// LOADER DOES NOT EXIST is OWED, not tested, and keeps its direction while losing its
// STRONG-by-test standing (Part B §0.2, the chair's 13:22 ruling G). These are those loaders.
//
// ⭐ ONE HARVESTER, NOT SEVEN. The registers differ in nesting, not in kind: every one is a
// frozen table whose leaves are string arrays. A loader per register would be seven copies of
// one tree-walk, and the estate has a name for that. What differs per register is the
// ROSTER of exports and the ADMISSION PREDICATE, and both are declared per call.
//
// ⚠ THE ADMISSION PREDICATE IS PUBLISHED, because every count depends on it (PROBE_ALL §1's
// own discipline: "the admission predicate, printed, because every N depends on it"). A string
// is admitted as PROSE when it holds at least three whitespace-separated words and at least
// one lower-case letter, and is refused when it reads as an id, a slug, a key or a token
// (SCREAMING_SNAKE, kebab-with-no-space, a bare path). The predicate is deliberately looser
// than PROBE_ALL's — it admits fragments a sentence regex drops — so a count here may exceed
// PROBE_ALL's for the same register. Both figures are printed; neither is reconciled by hand.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Is this string reader-facing PROSE, or an id wearing a string's coat?
 * @param {unknown} value
 * @returns {boolean}
 */
export function isProse(value) {
  if (typeof value !== 'string') return false;
  const s = value.trim();
  if (s.split(/\s+/).length < 3) return false;
  if (!/[a-z]/.test(s)) return false;
  if (/^[A-Z0-9_]+$/.test(s)) return false;
  if (/^[a-z0-9]+([_-][a-z0-9]+)+$/.test(s)) return false;
  return true;
}

/**
 * Harvest every prose leaf of a frozen export table into corpus entries. An ARRAY of prose is
 * a POOL keyed by its path; a lone prose string under an object is a POOL OF ONE, which is
 * itself a finding (NL-8b: a pool of one is not a pool).
 * @param {object} options
 * @param {string} options.rel repo-relative path, for the entry's `file`
 * @param {string} options.register the register id (R4b, R6, R7, …)
 * @param {Record<string, unknown>} options.module the imported namespace
 * @param {ReadonlyArray<string>} options.exports the export names to harvest
 * @param {string} [options.source] the file's text, when line numbers are wanted
 * @returns {CorpusEntry[]}
 */
export function harvestExports({
  rel, register, module, exports: names, source,
}) {
  /** @type {CorpusEntry[]} */
  const out = [];
  const lines = source ? source.split('\n') : null;
  /** @param {string} text */
  const lineOf = (text) => {
    if (!lines) return undefined;
    const needle = text.slice(0, 48);
    const at = lines.findIndex((l) => l.includes(needle));
    return at >= 0 ? at + 1 : undefined;
  };
  /**
   * @param {unknown} node
   * @param {string[]} path
   * @param {number} depth
   */
  const walk = (node, path, depth) => {
    if (depth > 8) return;
    if (Array.isArray(node)) {
      const prose = node.filter(isProse);
      if (prose.length) {
        const poolId = `${register}::${path.join('.')}`;
        prose.forEach((text, idx) => {
          const line = lineOf(String(text));
          out.push({
            id: `${poolId}#${idx}`,
            text: String(text),
            block: path[0],
            pool: path.slice(1).join('.') || '*',
            poolId,
            idx,
            angle: '',
            marks: [],
            slots: [...new Set([...String(text).matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
            file: rel,
            ...(line ? { line } : {}),
            register,
            siblings: [],
          });
        });
      }
      for (const [i, child] of node.entries()) {
        if (child && typeof child === 'object') walk(child, [...path, String(i)], depth + 1);
      }
      return;
    }
    if (!node || typeof node !== 'object') return;
    /** @type {string[]} */
    const singles = [];
    for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (node))) {
      if (isProse(value)) { singles.push(String(value)); continue; }
      walk(value, [...path, key], depth + 1);
    }
    if (singles.length) {
      const poolId = `${register}::${path.join('.')}`;
      singles.forEach((text, idx) => {
        const line = lineOf(text);
        out.push({
          id: `${poolId}::single#${idx}`,
          text,
          block: path[0],
          pool: path.slice(1).join('.') || '*',
          poolId: `${poolId}::single`,
          idx,
          angle: '',
          marks: [],
          slots: [...new Set([...text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
          file: rel,
          ...(line ? { line } : {}),
          register,
          siblings: [],
        });
      });
    }
  };
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`dossierCorpus.harvestExports: ${rel} exports no \`${name}\` — the loader's roster is stale, which is the address lie one level up`);
    }
    // ⛔ A TOP-LEVEL BARE STRING IS A POOL OF ONE, AND THE WALK USED TO DROP IT SILENTLY.
    // `walk` returns immediately on a non-object node, so an export that IS a prose string —
    // `causeWalk.js`'s `NO_DEEPER_MEMORY`, `LEDGER_DARK_LINE` and `REDACTED_HOP` — was named
    // in the roster, found present, and then harvested to nothing. The object branch already
    // treats a lone prose VALUE as a pool of one (NL-8b: a pool of one is not a pool, and
    // that is the finding); the top level did not, so the drop was a silent shortfall rather
    // than a declared predicate. Three lines left R4b that way, and the register's count read
    // 50 = 53 − 3 while presenting itself as an exact reproduction.
    const node = module[name];
    if (isProse(node)) {
      const text = String(node);
      const line = lineOf(text);
      out.push({
        id: `${register}::${name}::single#0`,
        text,
        block: name,
        pool: '*',
        poolId: `${register}::${name}::single`,
        idx: 0,
        angle: '',
        marks: [],
        slots: [...new Set([...text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
        file: rel,
        ...(line ? { line } : {}),
        register,
        siblings: [],
      });
      continue;
    }
    walk(node, [name], 0);
  }
  return out;
}

/**
 * A MODULE-PRIVATE array of prose, read from SOURCE because no export reaches it. The
 * chronicler's letter keeps its `GREETINGS`, `CLOSINGS` and `QUIET` this way.
 * @param {string} src
 * @param {string} name
 * @returns {string[]}
 */
export function privateArray(src, name) {
  const anchor = new RegExp(`\\bconst\\s+${name}\\s*=\\s*Object\\.freeze\\(\\[|\\bconst\\s+${name}\\s*=\\s*\\[`);
  const m = anchor.exec(src);
  if (!m) throw new Error(`dossierCorpus.privateArray: no \`const ${name}\` array in the source`);
  const open = src.indexOf('[', m.index);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '\'' || c === '"' || c === '`') {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '[') depth += 1;
    else if (c === ']') { depth -= 1; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error(`dossierCorpus.privateArray: unbalanced array for \`${name}\``);
  const body = src.slice(open + 1, end);
  const items = [...body.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)]
    .map((x) => (x[1] ?? x[2]).replace(/\\'/g, "'").replace(/\\"/g, '"'));
  const prose = items.filter(isProse);
  if (prose.length === 0) throw new Error(`dossierCorpus.privateArray: \`${name}\` yielded no prose rows`);
  return prose;
}

/** @param {string} rel @returns {Promise<{module: Record<string, unknown>, source: string, rel: string}>} */
async function openLeaf(rel) {
  const abs = join(ROOT, rel);
  return { module: await import(/* @vite-ignore */ `file://${abs}`), source: readFileSync(abs, 'utf8'), rel };
}

/**
 * THE CHRONICLE (R11 · R12) — the quiet fallbacks, the letter's greetings, closings and quiet
 * lines, the treaty compliance voice and its floor, and the demographic reading's sentences.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadChronicle() {
  /** @type {CorpusEntry[]} */
  const out = [];
  const readModel = await openLeaf('src/domain/display/chronicleReadModel.js');
  out.push(...harvestExports({ ...readModel, register: 'R12', exports: ['QUIET_FALLBACK'] }));
  const treaty = await openLeaf('src/domain/display/treatyDocument.js');
  out.push(...harvestExports({
    ...treaty, register: 'R12', exports: ['TREATY_COMPLIANCE_VOICE', 'TREATY_COMPLIANCE_FLOOR'],
  }));
  const demographic = await openLeaf('src/domain/display/demographicReading.js');
  out.push(...harvestExports({
    ...demographic, register: 'R12', exports: ['OCCUPANCY_SENTENCES', 'READING_VOCABULARIES'],
  }));
  // ⛔ `threatAssessment.js` CARRIES NO TABLE — its one export is `buildThreatAssessment`, a
  // BUILDER whose branches compose their sentences inline. The brief's "assessment branches"
  // are therefore reachable only by running the builder or by reading its source, and this
  // loader does neither: it records the absence, so that "the assessment branches are loaded"
  // is never claimed by a loader that returned nothing. (Executed:
  // `Object.keys(module)` → `['buildThreatAssessment']`, all of it a function.)
  const assessment = await openLeaf('src/domain/display/threatAssessment.js');
  const assessmentTables = Object.keys(assessment.module)
    .filter((k) => assessment.module[k] && typeof assessment.module[k] === 'object');
  out.push(...harvestExports({ ...assessment, register: 'R12', exports: assessmentTables }));
  // The letter's three pools are MODULE-PRIVATE and reached from source.
  const letter = await openLeaf('src/domain/display/chroniclersLetter.js');
  for (const name of ['GREETINGS', 'CLOSINGS', 'QUIET']) {
    privateArray(letter.source, name).forEach((text, idx) => {
      out.push({
        id: `R11::letter.${name}#${idx}`,
        text,
        block: 'CHRONICLERS-LETTER',
        pool: name,
        poolId: `R11::letter.${name}`,
        idx,
        angle: '',
        marks: [],
        slots: [...new Set([...text.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))],
        file: 'src/domain/display/chroniclersLetter.js',
        register: 'R11',
        siblings: ['GREETINGS', 'CLOSINGS', 'QUIET'].filter((k) => k !== name),
      });
    });
  }
  refuseEmpty('chronicle (R11/R12)', out);
  return out;
}

/**
 * R4b — the Herald's disclosure and cause-lifecycle voice.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadHeraldDisclosure() {
  /** @type {CorpusEntry[]} */
  const out = [];
  const integrity = await openLeaf('src/domain/display/heraldIntegrity.js');
  out.push(...harvestExports({ ...integrity, register: 'R4b', exports: ['DISCLOSURE_LINES'] }));
  const vocabulary = await openLeaf('src/domain/display/causeLifecycleVocabulary.js');
  out.push(...harvestExports({
    ...vocabulary, register: 'R4b', exports: ['CAUSE_MECHANISM_PHRASE', 'STAGE_TEMPLATES'],
  }));
  const walkLeaf = await openLeaf('src/domain/display/causeWalk.js');
  out.push(...harvestExports({
    ...walkLeaf, register: 'R4b', exports: ['NO_DEEPER_MEMORY', 'LEDGER_DARK_LINE', 'REDACTED_HOP'],
  }));
  refuseEmpty('R4b herald disclosure', out);
  return out;
}

/**
 * R6 — the NPC cause-conjunction ladder, keyed `role | situation | causeClass | stage`.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadNpcLadder() {
  /** @type {CorpusEntry[]} */
  const out = [];
  for (const [rel, name] of /** @type {ReadonlyArray<[string, string]>} */ ([
    ['src/domain/display/causeConjunctionRoleContent.js', 'ROLE_CONTENT'],
    ['src/domain/display/causeConjunctionClassContent.js', 'CLASS_CONTENT'],
    ['src/domain/display/causeConjunctionContent.js', 'FULL_CONTENT'],
  ])) {
    const leaf = await openLeaf(rel);
    out.push(...harvestExports({ ...leaf, register: 'R6', exports: [name] }));
  }
  refuseEmpty('R6 npc ladder', out);
  return out;
}

/**
 * R7 — the institution and service gazetteer.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadInstitutionGazetteer() {
  /** @type {CorpusEntry[]} */
  const out = [];
  const catalog = await openLeaf('src/data/institutionalCatalog.js');
  out.push(...harvestExports({ ...catalog, register: 'R7', exports: ['institutionalCatalog'] }));
  const services = await openLeaf('src/data/institutionServices.js');
  out.push(...harvestExports({ ...services, register: 'R7', exports: ['INSTITUTION_SERVICES'] }));
  // ⚠ THE BRIEF NAMED TWO FILES; PROBE_ALL'S R7 ROSTER NAMES SIX, and the count depends on
  // which. The four the brief did not name are loaded here too, so the register's figure can
  // be read against PROBE_ALL's 2,169 rather than against a narrower loader nobody can
  // compare. `domain/institutions/institutionCatalog.js` is the sixth and carries NO table:
  // it exports one BUILDER function, so there is nothing to harvest and the roster says so
  // rather than leaving a silent hole.
  const variants = await openLeaf('src/data/institutionDescVariants.js');
  out.push(...harvestExports({ ...variants, register: 'R7', exports: ['INSTITUTION_DESC_VARIANTS'] }));
  const ladders = await openLeaf('src/data/institutionLadders.js');
  out.push(...harvestExports({ ...ladders, register: 'R7', exports: ['UPGRADE_CHAINS', 'SUBSUMPTION_RULES'] }));
  const vocabulary = await openLeaf('src/domain/display/institutionVocabulary.js');
  out.push(...harvestExports({
    ...vocabulary,
    register: 'R7',
    exports: Object.keys(vocabulary.module).filter((k) => vocabulary.module[k] && typeof vocabulary.module[k] === 'object'),
  }));
  refuseEmpty('R7 institution gazetteer', out);
  return out;
}

/**
 * D-d — the DM page's hooks and secrets: the NPC plot-hook tables and the stress-institution
 * effect prose.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadDmHooks() {
  /** @type {CorpusEntry[]} */
  const out = [];
  const npc = await openLeaf('src/data/npcData.js');
  out.push(...harvestExports({
    ...npc, register: 'D-d', exports: ['NPC_PLOT_HOOKS', 'MANNERISMS', 'SPEECH_PATTERNS'],
  }));
  const stress = await openLeaf('src/data/stressInstitutionEffects.js');
  out.push(...harvestExports({ ...stress, register: 'D-d', exports: ['STRESS_INSTITUTION_EFFECTS'] }));
  refuseEmpty('D-d dm hooks', out);
  return out;
}

/**
 * R9 — THE CHROME COPY REGISTRY (the chrome-pool arm). Chrome is a DIFFERENT REGISTER with its
 * own rules — CC-1's wall is that the archivist never speaks on chrome — so it is loaded here
 * to be MEASURED beside the diegetic registers, never to be judged by their rules.
 *
 * ⛔ R16 (the JSX + PDF chrome, 2,685 rows over 354 files) IS NOT LOADED, and that is a
 * refusal with a reason rather than an omission. R16 is a JSX SEGMENT walk — PROBE_ALL's own
 * X4 extractor over `src/**\/*.jsx` — not a pool table, and a second, weaker JSX extractor
 * beside the estate's existing `tests/helpers/jsxLiteralWalk.js` would be a fork of a solved
 * problem. A future car that needs R16 should route through that helper.
 * @returns {Promise<CorpusEntry[]>}
 */
export async function loadChromeCopy() {
  /** @type {CorpusEntry[]} */
  const out = [];
  for (const [rel, name] of /** @type {ReadonlyArray<[string, string]>} */ ([
    ['src/copy/en.js', 'en'],
    ['src/copy/landing.js', 'landing'],
    ['src/copy/pricingPage.js', 'pricingPage'],
    ['src/copy/deityAuthoring.js', 'deityAuthoring'],
    ['src/copy/footer.js', 'footer'],
  ])) {
    const leaf = await openLeaf(rel);
    out.push(...harvestExports({ ...leaf, register: 'R9', exports: [name] }));
  }
  refuseEmpty('R9 chrome copy registry', out);
  return out;
}
