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
 * @property {string} angle
 * @property {string[]} marks
 * @property {string[]} slots
 * @property {string} file
 * @property {number} [line]
 * @property {string} register
 * @property {string[]} siblings
 */

/** @param {string} label @param {unknown[]} rows @returns {void} */
function refuseEmpty(label, rows) {
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
