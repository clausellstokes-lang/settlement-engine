#!/usr/bin/env node
/**
 * scripts/scribe-static-card.mjs — THE SCRIBE'S STATIC CARD (W0 deliverable 2;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §2's last paragraph, §6, §11 W0).
 *
 *   node scripts/scribe-static-card.mjs            rebuild docs/content/scribe-static-card.json
 *   node scripts/scribe-static-card.mjs --check    rebuild in memory and diff byte for byte
 *
 * ── WHAT THIS IS, AND WHY IT IS NOT PART OF THE TOWN CARD ────────────────────────────
 * The hand corpus's marker card (`scripts/prose-mark-card.mjs`) has nine sections. THREE of
 * them are properties of the CODEBASE and not of any settlement, so they are the same for
 * every town that will ever be generated and paying for them once per render would be paying
 * for them 768 times a corpus and once per player world forever:
 *
 *   (i)  THE READ CLOCK of every field a desk reads — CONFIG / LIVE-ROSTER / PULSE /
 *        SNAPSHOT, from `clockOf` (scripts/lib/prose-mark-fields.mjs). It answers "can this
 *        value move after generation, and by what hand".
 *   (ii) THE FROZEN/LIVE CLASSIFICATION of the same field — the field-grain writer count
 *        under `src/domain/worldPulse/**`, from `frozenFieldCensus`. FROZEN means no writer
 *        exists, which is the licence for the perfect and the durative (ruling 11).
 *   (iii) THE WIRING STATUS per pool — RESOLVED or WIRING-UNRESOLVED, the key function, the
 *        rung, the reads and their normalised engine fields, read from the COMMITTED census
 *        (`docs/content/wiring-census.json`) and never re-derived here.
 *
 * ⛔ IT DOES NOT CHANGE `wiring-census.json` AND IT DOES NOT RE-MEASURE IT. The census is the
 * upstream fact; this file is a JOIN of the census with the pulse tree, key-sorted, and a
 * disagreement between them is a stale-stamp refusal rather than a silent re-take. The stamp
 * carries the census's composer shas and candidate leaves, so a census re-taken under this card
 * reds here; see `buildStaticCard` for the one field of the census stamp it deliberately drops.
 *
 * ⛔ THE TOWN CARD JOINS ON `${blockId}::${poolKey}` AND ON THE FIELD NAME, so `townCard.js`
 * carries no clock table of its own: one home for a fact, as the estate's rule has it.
 *
 * ⚠ WHAT THIS DELIBERATELY DOES NOT CARRY, named so the next reader does not think it was
 * forgotten. The marker card's section (3) — the same-page read set — needs the MACHINE
 * producers of each tab, and `prose-mark-card.mjs` `TAB_PRODUCERS` is populated for the
 * DEFENSE tab alone. Extending it to the other twelve tabs is an audit of every tab's
 * derivation helpers and is a W1 item; the town card carries the literal page instead
 * (`scribePage.js`), which is the stronger answer for one town anyway.
 *
 * Deterministic and read-only except the one file it is asked for. The pulse tree is parsed
 * ONCE and the field census is memoised, so the whole build is a few seconds.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

import {
  ROOT, parseFile, normaliseRead, clockOf, parsePulseTree, frozenFieldCensus,
} from './lib/prose-mark-fields.mjs';
import { DESK_FILE_OF } from './prose-mark-card.mjs';

/** Where the card is committed. */
export const STATIC_CARD_JSON = path.join(ROOT, 'docs/content/scribe-static-card.json');
/** The census this card joins onto. Its bytes are the upstream fact. */
export const CENSUS_JSON = path.join(ROOT, 'docs/content/wiring-census.json');

/** The desk source file of a block id, by its two-segment family. @param {string} block */
const deskFileOf = (block) => DESK_FILE_OF[block.split('-').slice(0, 2).join('-')] || '';

/**
 * A field spelling the pulse census can be asked about. The census's own reads carry
 * decorations a file walk cannot resolve — a `||` of two locals, a `[bucket=x]` roster
 * projection, a `@generation` snapshot marker — and `prose-mark-card.mjs`'s `writersOf`
 * strips exactly these three before asking. One spelling, so the two instruments cannot
 * disagree about which field they measured.
 * @param {string} field
 * @returns {string}
 */
export function pulseKeyOf(field) {
  return String(field).replace(/\[.*$/, '').replace(/@generation.*$/, '').replace(/ \|\| .*$/, '');
}

/**
 * Is this spelling a real settlement field at all? A key function's own parameter name
 * (`tier`, a `derived`/`local` marker) is not a field of the blob and has no pulse writer to
 * count; asking would return a root-grain count over an unrelated identifier.
 * @param {string} key already through `pulseKeyOf`
 * @returns {boolean}
 */
export function isMeasurableField(key) {
  if (key === '' || /^(derived|local)/.test(key)) return false;
  if (key === 'tier') return false;
  return !/^(UNRESOLVED|\()/.test(key) && !key.startsWith("'");
}

/**
 * ⭐ THE FIELD TABLE — every engine field any of the 708 pools reads, with its clock and its
 * writer count. Built from the COMMITTED census's `reads` column, normalised through each
 * desk's own source exactly as the marker card normalises it.
 * @param {object} census the parsed committed census
 * @returns {{fields: Record<string, {clock: string, writers: number, status: string}>,
 *   byPool: Map<string, string[]>, unresolved: string[]}}
 */
export function fieldTable(census) {
  const pulse = parsePulseTree();
  /** @type {Map<string, {source: string, ast: object}>} */
  const deskCache = new Map();
  /** @type {Map<string, {count: number, status: string, grain: string}>} */
  const censusCache = new Map();
  const writersOf = (key) => {
    if (!censusCache.has(key)) {
      const row = frozenFieldCensus(key, undefined, pulse);
      // ⛔ THE GRAIN RIDES WITH THE COUNT, AND IT IS NOT DECORATION. `frozenFieldCensus` says
      // so itself: a ONE-SEGMENT field has no parent chain to match, so every property or
      // assignment of that name anywhere under the pulse counts. `name` reads 201 writers on
      // that grain and the settlement's own name has none of them. A card that printed the
      // count without the grain would tell the model that a frozen field is live, which is
      // exactly the false licence ruling 11 turns on. Carried, never silently dropped.
      censusCache.set(key, Object.fromEntries([
        ['count', row.count], ['status', row.status],
        ['grain', String(row.grain).startsWith('root') ? 'root' : 'field'],
      ]));
    }
    return censusCache.get(key);
  };
  /** @type {Array<[string, {clock: string, writers: number, status: string}]>} */
  const rows = [];
  const seen = new Set();
  /** @type {Map<string, string[]>} */
  const byPool = new Map();
  /** @type {string[]} */
  const unresolved = [];
  for (const row of census.rows) {
    const rel = deskFileOf(row.block);
    if (!rel) continue;
    if (!deskCache.has(rel)) deskCache.set(rel, parseFile(rel));
    /** @type {string[]} */
    const poolFields = [];
    for (const read of row.reads || []) {
      for (const n of normaliseRead(read, deskCache.get(rel), row.keyFunction)) {
        if (/UNRESOLVED/.test(n.how)) { unresolved.push(`${row.block}::${row.pool}::${read}`); continue; }
        for (const spelling of String(n.field).split(' || ')) {
          const key = pulseKeyOf(spelling);
          if (!isMeasurableField(key)) continue;
          if (!poolFields.includes(key)) poolFields.push(key);
          if (seen.has(key)) continue;
          seen.add(key);
          const held = writersOf(key);
          rows.push([key, Object.fromEntries([
            ['clock', clockOf(spelling, held.count)],
            ['writers', held.count],
            ['status', held.status],
            ['grain', held.grain],
          ])]);
        }
      }
    }
    byPool.set(`${row.block}::${row.pool}`, poolFields.sort());
  }
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { fields: Object.fromEntries(rows), byPool, unresolved: [...new Set(unresolved)].sort() };
}

/**
 * ⭐ THE POOL TABLE — the wiring status of every pool, keyed `${block}::${pool}` so the town
 * card joins on one string. Nothing here is computed: every value is the committed census's,
 * carried verbatim beside the normalised field list the join needs.
 * @param {object} census
 * @param {Map<string, string[]>} byPool
 * @returns {Record<string, object>}
 */
export function poolTable(census, byPool) {
  /** @type {Array<[string, object]>} */
  const rows = [];
  for (const row of census.rows) {
    const key = `${row.block}::${row.pool}`;
    rows.push([key, Object.fromEntries([
      ['block', row.block],
      ['pool', row.pool],
      ['wiring', row.status],
      ['keyFunction', row.keyFunction || ''],
      ['rung', row.rung || ''],
      ['readsGrain', row.readsGrain || ''],
      ['reads', [...(row.reads || [])]],
      ['fields', byPool.get(key) || []],
      ['covert', row.covert === true],
      ['sites', [...(row.sites || [])]],
      ['variants', typeof row.variants === 'number' ? row.variants : 0],
      ['slotsNamed', [...(row.slotsNamed || [])].sort()],
      ['k', typeof row.k === 'number' ? row.k : null],
      ['rateBp', typeof row.rateBp === 'number' ? row.rateBp : null],
    ])]);
  }
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return Object.fromEntries(rows);
}

/**
 * Build the whole static card.
 * @returns {object}
 */
export function buildStaticCard() {
  const census = JSON.parse(readFileSync(CENSUS_JSON, 'utf8'));
  const { fields, byPool, unresolved } = fieldTable(census);
  const pools = poolTable(census, byPool);
  const clocks = Object.fromEntries(
    ['CONFIG', 'LIVE-ROSTER', 'PULSE', 'SNAPSHOT'].map(
      (name) => [name, Object.values(fields).filter((f) => f.clock === name).length],
    ),
  );
  return Object.fromEntries([
    ['schema', 'scribe-static-card/1'],
    // ⛔ THE STAMP IS THE CENSUS'S SHAS AND ITS CANDIDATE LEAVES, AND DELIBERATELY NOT ITS
    // WHOLE `stamp`. The census also stamps `producerIndexFiles` — a COUNT of the files its
    // producer walk scanned — which moves whenever ANY `.js` file is added anywhere under
    // `src/domain/**` or `src/generators/**`, for reasons that have nothing to do with this
    // card. Carrying it would make every unrelated new module a stale-card red, which is an
    // alarm that cries wolf and is therefore an alarm nobody reads. What this card must notice
    // is the census being RE-TAKEN under it, and the composer shas are exactly that fact.
    ['stamp', Object.fromEntries([
      ['census', Object.fromEntries([
        ['files', census.stamp?.files || null],
        ['candidateLeaves', census.stamp?.candidateLeaves || null],
      ])],
      ['pulseDir', 'src/domain/worldPulse'],
    ])],
    ['totals', Object.fromEntries([
      ['pools', Object.keys(pools).length],
      ['fields', Object.keys(fields).length],
      ['frozen', Object.values(fields).filter((f) => f.status === 'FROZEN').length],
      ['live', Object.values(fields).filter((f) => f.status === 'LIVE').length],
      ['clocks', clocks],
      ['unresolvedReads', unresolved.length],
    ])],
    ['fields', fields],
    ['pools', pools],
    ['unresolvedReads', unresolved],
  ]);
}

/** @param {object} data @returns {string} */
export const serialise = (data) => `${JSON.stringify(data, null, 2)}\n`;

/**
 * THE INTERLOCK, as a pure comparison so a walker can drive both limbs without writing a
 * byte — the census's own idiom (`wiring-census.mjs` `censusCheck`). A stale STAMP and a
 * stale BYTE are different failures with different cures: the first says the census moved
 * under this card, the second says this card was never re-taken.
 * @param {string|null} committedText
 * @param {object} data
 * @returns {{ok: boolean, reason: string, detail: string}}
 */
export function staticCardCheck(committedText, data) {
  const cure = 'run `node scripts/scribe-static-card.mjs`.';
  if (committedText === null) {
    return Object.fromEntries([['ok', false], ['reason', 'missing'],
      ['detail', `docs/content/scribe-static-card.json is missing; ${cure}`]]);
  }
  /** @type {object} */
  let have;
  try { have = JSON.parse(committedText); } catch {
    return Object.fromEntries([['ok', false], ['reason', 'stale-bytes'],
      ['detail', 'docs/content/scribe-static-card.json does not parse as JSON.']]);
  }
  const held = JSON.stringify(have.stamp?.census?.files || null);
  const fresh = JSON.stringify(data.stamp.census?.files || null);
  if (held !== fresh) {
    return Object.fromEntries([['ok', false], ['reason', 'stale-stamp'],
      ['detail', `the wiring census moved since the static card was taken; ${cure}`]]);
  }
  if (committedText !== serialise(data)) {
    return Object.fromEntries([['ok', false], ['reason', 'stale-bytes'],
      ['detail', `docs/content/scribe-static-card.json is stale; ${cure}`]]);
  }
  return Object.fromEntries([['ok', true], ['reason', ''], ['detail', '']]);
}

async function main() {
  const data = buildStaticCard();
  const text = serialise(data);
  if (process.argv.includes('--check')) {
    const committed = existsSync(STATIC_CARD_JSON) ? readFileSync(STATIC_CARD_JSON, 'utf8') : null;
    const verdict = staticCardCheck(committed, data);
    if (!verdict.ok) throw new Error(verdict.detail);
    console.log(`[scribe-static-card] verified ${data.totals.pools} pools / ${data.totals.fields} fields`
      + ` (${data.totals.frozen} frozen, ${data.totals.live} live)`);
    return;
  }
  writeFileSync(STATIC_CARD_JSON, text);
  console.log(`[scribe-static-card] wrote docs/content/scribe-static-card.json —`
    + ` ${data.totals.pools} pools, ${data.totals.fields} fields,`
    + ` ${data.totals.frozen} frozen / ${data.totals.live} live,`
    + ` ${data.totals.unresolvedReads} unresolved reads`);
}

if (process.argv[1] && process.argv[1].endsWith('scribe-static-card.mjs')) {
  await main();
}
