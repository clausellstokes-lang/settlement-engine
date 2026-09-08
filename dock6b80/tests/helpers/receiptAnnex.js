/**
 * tests/helpers/receiptAnnex.js — THE ONE READER for the receipt-pool content annexes.
 *
 * THE CLASS THIS CLOSES (measured, not theorised — D-W1 of docs/DISPOSITION_WAVE_PROPOSAL.md).
 * The war kind-pool walkers each hand-rolled an `annexLines(kind)` that sliced
 * `docs/content/RECEIPT_POOLS_WAR.md` with `indexOf` and matched `^\d+\. `. Two defects rode
 * in that shape:
 *
 *   1. THE ADDRESS LIE. The one-kind-one-pool merge (2026-08-03) moved twenty-three pools to
 *      `RECEIPT_POOLS_LEGACY.md` and left a `→ pool lives in …` POINTER behind. A pointer
 *      block carries no numbered rows, so the extractor returned `[]` and
 *      `expect(rendered).toEqual(annexLines(kind))` reddened against emptiness — the corpus
 *      was never missing anything; the walker's document address was wrong. Thirteen kinds
 *      across three walkers failed this way.
 *   2. THE FIRST-MATCH HOLE. `indexOf('# WR-7')` matches `## WR-7a` as a SUBSTRING, and
 *      `indexOf('### home_front_hand ')` would happily land inside `### home_front_hands`.
 *      A second heading anywhere in the volume retargets the slice silently; the pin stays
 *      green pointing at the wrong block.
 *
 * THE CHOKEPOINT. Every annex read routes through here, every anchor is a LINE-ANCHORED
 * regex asserted to match EXACTLY ONCE, and every failure THROWS — the `sourceContract.js`
 * discipline. An extractor that returns `[]` is the bug; this one cannot.
 *
 * THE RICHER LEGACY SHAPE. A relocated block is not a re-point: it carries 7–9 rows, of which
 * the five that are wired today are tagged `` `[live, verbatim]` ``, and every row declares its
 * own `` `requiredSlots: [...]` ``. The live five are the pool; the rest are authored depth the
 * frequency-scaled floor owes and no wave has wired. Selecting the wrong five would still
 * render five sentences, so the parse ALSO returns the annex's declared `requiredSlots` — the
 * caller pins it against the registry's parallel array, an orthogonal witness that the filter
 * picked the right rows in the right order (LEG-3's `pool.length === requiredSlots.length` law
 * in its stronger, value-bearing form).
 *
 * SCOPE FENCE. This helper re-points and hardens. It does NOT reconcile the kinds whose annex
 * was DEEPENED past the walker's fixed-five assumption (chronic-tier deepening, `1e8bf8a8`);
 * those stay red under D-W3's Class B, which needs a chair ruling (cap raised vs corpus
 * trimmed), not a parser.
 */
import { readFileSync } from 'node:fs';

/**
 * The caller reads and names its OWN volume (`WAR_ANNEX_URL` below) and passes the text in —
 * a walker that stopped deriving from source would be lying about what it checks. Only the
 * forward's DESTINATION is this module's business, because it is a document-internal redirect
 * no caller should have to know about.
 */
export const WAR_ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_WAR.md', import.meta.url);
/** The FP-GRAMMAR annex (GR-0 onward). EXTENDED here rather than forked: the two defects
 *  this module closes — the address lie and the first-match hole — are properties of the
 *  READER, not of the volume, so a second volume takes the same reader. */
export const GRAMMAR_ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_GRAMMAR.md', import.meta.url);
/**
 * The FP-TRADE annex (FP wave TR-1 onward). Added here rather than forked into a second
 * reader: the address-lie and first-match defects this module exists to close live in the
 * EXTRACTOR, so a per-volume copy would re-open both once per volume. The one-kind-one-pool
 * forward is a WAR-volume artifact and the trade annex carries none, so the legacy road
 * below simply never runs for it — which the TR walker asserts by pinning `from === 'trade'`
 * rather than leaving it to be discovered when a future merge relocates a pool.
 */
export const TRADE_ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_TRADE.md', import.meta.url);
/**
 * The FP-INFORMATION annex (IN-1c onward). Added here for the third time rather than forked
 * for the same measured reason: the address lie and the first-match hole are properties of
 * the READER, so a fourth volume that copied the extractor would re-open both once per
 * volume. Like the trade annex this one carries no one-kind-one-pool forward, so the legacy
 * road below never runs for it — which the IN walker asserts POSITIVELY by pinning
 * `from === 'information'`, rather than leaving it to be discovered when a future merge
 * relocates a pool and the pin goes quietly stale.
 */
export const INFORMATION_ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_INFORMATION.md', import.meta.url);
const LEGACY_ANNEX = new URL('../../docs/content/RECEIPT_POOLS_LEGACY.md', import.meta.url);

/** The forward left behind by the one-kind-one-pool merge, 2026-08-03. */
const POINTER_RE = /^→ pool lives in RECEIPT_POOLS_LEGACY\.md\b/m;
/** A row wired into `src/` today. Untagged rows are authored-but-unwired depth. */
const LIVE_TAG = '`[live, verbatim]`';
/** Trailing metadata tags: `` `[live, verbatim]` `` / `` `[merged ← …]` `` / `` `requiredSlots: [...]` ``. */
const TAG_SUFFIX_RE = /(?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$/;
const REQUIRED_SLOTS_RE = /`requiredSlots: \[([^\]]*)\]`/;
const NUMBERED_ROW_RE = /^\d+\. (.+)$/gm;
/** Any heading closes a block: `### next_kind`, `## §1b — …`, `# §2 — …`. */
const ANY_HEADING_RE = /^#{1,3} /m;

function escapeRe(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find `pattern` in `source` and assert it occurs EXACTLY ONCE. Throws on zero (the address
 * rotted) and on two or more (the first-match hole: a second heading would silently retarget
 * the slice). Never returns a "not found" sentinel.
 * @param {string} source
 * @param {RegExp} pattern  must carry the `g` flag
 * @param {string} label    human context for the throw
 * @returns {RegExpMatchArray} the single match (with `.index`)
 */
export function anchoredOnce(source, pattern, label) {
  if (typeof source !== 'string') throw new Error(`receiptAnnex.anchoredOnce: source is not a string (${label})`);
  if (!pattern.flags.includes('g')) throw new Error(`receiptAnnex.anchoredOnce: pattern needs the g flag (${label})`);
  const hits = [...source.matchAll(pattern)];
  if (hits.length !== 1) {
    throw new Error(`receiptAnnex.anchoredOnce: ${label} — expected exactly 1 match of ${pattern}, found ${hits.length}`);
  }
  return hits[0];
}

/**
 * Slice one wave section out of an annex volume, between two line-anchored headings that must
 * each appear exactly once and in order.
 * @param {string} source
 * @param {string} section  e.g. `# WR-4` or `## WR-7a`
 * @param {string} until    e.g. `# WR-5` or `## WR-7c`
 * @returns {string}
 */
export function sectionSlice(source, section, until) {
  const open = anchoredOnce(source, new RegExp(`^${escapeRe(section)}(?=[ \\n])`, 'gm'), `section "${section}"`);
  const close = anchoredOnce(source, new RegExp(`^${escapeRe(until)}(?=[ \\n])`, 'gm'), `section terminator "${until}"`);
  if (close.index <= open.index) {
    throw new Error(`receiptAnnex.sectionSlice: "${until}" precedes "${section}" — the volume order changed`);
  }
  return source.slice(open.index, close.index);
}

/**
 * The block under `### <kind> ` — from the end of its heading line to the next heading of any
 * level (or the end of the enclosing slice). The `(?= )` lookahead makes the heading match
 * EXACT: `### home_front_hand ` can never land inside `### home_front_hands`.
 */
function kindBlock(scope, kind, where) {
  const heading = anchoredOnce(scope, new RegExp(`^### ${escapeRe(kind)}(?= )`, 'gm'), `${kind}: heading in ${where}`);
  const afterHeading = scope.indexOf('\n', heading.index);
  if (afterHeading < 0) throw new Error(`receiptAnnex: ${kind}: heading in ${where} has no body`);
  const rest = scope.slice(afterHeading + 1);
  const next = rest.search(ANY_HEADING_RE);
  return next >= 0 ? rest.slice(0, next) : rest;
}

function numberedRows(block) {
  return [...block.matchAll(NUMBERED_ROW_RE)].map((match) => match[1]);
}

function stripTags(row) {
  let text = row;
  let previous;
  do {
    previous = text;
    text = text.replace(TAG_SUFFIX_RE, '');
  } while (text !== previous);
  return text;
}

function parseRequiredSlots(row, kind) {
  const match = row.match(REQUIRED_SLOTS_RE);
  if (!match) throw new Error(`receiptAnnex: ${kind}: a live legacy row declares no requiredSlots — "${row.slice(0, 60)}…"`);
  const body = match[1].trim();
  if (body === '') return [];
  return body.split(',').map((slot) => slot.trim().replace(/^'|'$/g, ''));
}

/**
 * Read one phrased kind's authored pool out of the receipt-pool annexes, following the
 * one-kind-one-pool forward into `RECEIPT_POOLS_LEGACY.md` when the war volume points there.
 *
 * @param {string} kind
 * @param {object} options
 * @param {string} options.source   the war volume's text, read by the caller (WAR_ANNEX_URL)
 * @param {string} options.section  war-volume wave heading, e.g. `# WR-4`
 * @param {string} options.until    the heading that closes it, e.g. `# WR-5`
 * @param {Record<string,string>} options.interp  slot values for `{slot}` substitution
 * @param {(line: string) => string} [options.strip]  editorial-marker strip applied before interpolation
 * @param {string} [options.annex]  the caller's volume basename, used in throw messages and
 *   returned as `from`. Defaults to the war volume so every existing caller is unchanged.
 * @returns {{ lines: string[], requiredSlots: string[][] | null, from: string }}
 *   `requiredSlots` is the annex's own declaration and is non-null only for a relocated pool.
 */
export function receiptAnnexPool(kind, {
  source, section, until, interp, strip, annex = 'war',
}) {
  const scope = sectionSlice(source, section, until);
  const block = kindBlock(scope, kind, `${section} of RECEIPT_POOLS_${annex.toUpperCase()}.md`);

  let rows = numberedRows(block);
  let requiredSlots = null;
  let from = annex;

  if (POINTER_RE.test(block)) {
    if (rows.length > 0) {
      throw new Error(`receiptAnnex: ${kind}: the war volume both forwards the pool and carries ${rows.length} rows`);
    }
    const legacy = readFileSync(LEGACY_ANNEX, 'utf8');
    const legacyBlock = kindBlock(legacy, kind, 'RECEIPT_POOLS_LEGACY.md');
    const live = numberedRows(legacyBlock).filter((row) => row.includes(LIVE_TAG));
    if (live.length === 0) {
      throw new Error(`receiptAnnex: ${kind}: forwarded to the legacy annex, which tags no row ${LIVE_TAG}`);
    }
    requiredSlots = live.map((row) => parseRequiredSlots(row, kind));
    rows = live;
    from = 'legacy';
  }

  if (rows.length === 0) {
    throw new Error(`receiptAnnex: ${kind}: no authored rows found under ${section} and no forward to follow`);
  }

  const lines = rows.map((row) => {
    const bare = strip ? strip(stripTags(row)) : stripTags(row);
    return bare.replace(/\{(\w+)\}/g, (_, slot) => String(interp[slot]));
  });
  return { lines, requiredSlots, from };
}
