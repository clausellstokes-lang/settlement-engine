/**
 * lib/brief.mjs — THE BLOCK BRIEF AND THE VOLATILE TURN (W1 deliverable 4).
 *
 * The design's §3.1 shape, built here so `render-town.mjs` and `pilot.mjs` cannot drift:
 *   1. THE BLOCK BRIEF — per block, BYTE-STABLE, cached at `ttl: '1h'`: the VOICE verbatim, the
 *      exemplar pack, the block's static-card sections, the mechanical bars, the output schema.
 *   2. THE TOWN CARD — per settlement per tab, VOLATILE.
 *   3. THE EPOCH RECORD — per advance, VOLATILE.
 *
 * ⛔ THE BRIEF IS BYTE-STABLE OR THE CACHE IS A LIE. Nothing in `blockBrief` reads a clock, a
 * random value, a per-user field or an unsorted object. `usage.cache_read_input_tokens` on the
 * second call of a run is the receipt, and the pilot prints it.
 *
 * ⭐ THE `town` BLOCK IS HOISTED. W0 measured that about 7 KB of EVERY tab card is the same
 * repeated `town` section (the roster, the roles, the institutions), which on six tabs is 42 KB of
 * the same bytes sent six times. It is moved into the CACHED prefix once per settlement, and the
 * volatile turn carries `pools` and `page` alone. That is the one structural optimisation W0's
 * report asked W1 for.
 *
 * ⛔ THE VOICE IS LIFTED VERBATIM FROM THE WORKFLOW, NEVER RETYPED. `rewrite-block-v3.workflow.js`
 * holds the law the whole corpus was cut under; a paraphrase here would be a SECOND law, and the
 * estate's prose programme is a record of what two laws do. It is read out of that file's source
 * at load time and the pilot prints its length so a silent truncation is visible.
 */
import { readFileSync } from 'node:fs';
import { z } from 'zod';

/** The kit, as an absolute path, so this runs from any cwd. */
export const KIT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit';
export const DOCK = `${KIT}/lane-scribe`;

const WORKFLOW = `${KIT}/rewrite/rewrite-block-v3.workflow.js`;
const EXEMPLARS = `${KIT}/rewrite/recut/EXEMPLAR-PACK.md`;
const LAW = `${DOCK}/docs/content/scribe-static-card.json`;

/**
 * ⭐ THE VOICE, LIFTED VERBATIM. The constant is a single double-quoted JS string literal on one
 * line of the workflow, so it is read by locating `const VOICE = "` and taking the literal up to
 * its unescaped closing quote, then unescaping. A parse failure THROWS rather than falling back to
 * a paraphrase: a harness that silently invents the law is the one failure this file exists to
 * prevent.
 * @returns {string}
 */
export function voiceText() {
  const source = readFileSync(WORKFLOW, 'utf8');
  const at = source.indexOf('const VOICE = "');
  if (at < 0) throw new Error(`the VOICE constant is not in ${WORKFLOW}; the harness will not paraphrase it`);
  let i = at + 'const VOICE = "'.length;
  let out = '';
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') { out += source[i] + source[i + 1]; i += 2; continue; }
    if (ch === '"') break;
    out += ch;
    i += 1;
  }
  if (out.length < 500) throw new Error(`the VOICE read out of ${WORKFLOW} is ${out.length} chars, which is a truncation`);
  return JSON.parse(`"${out}"`);
}

/** The exemplar pack, whole. It is the model's worked example and the corpus's own best cut. */
export function exemplarPack() {
  return readFileSync(EXEMPLARS, 'utf8');
}

/** The static card, which the brief's per-block sections are read out of. */
export function staticCard() {
  return JSON.parse(readFileSync(LAW, 'utf8'));
}

/**
 * ⭐ THE OUTPUT SCHEMA (design §3.2) — structured, never free text. One unit per pool, with the
 * stance, the source it speaks through, the pair kind where the pool has one, and the text.
 */
export const UnitSchema = z.object({
  units: z.array(z.object({
    blockId: z.string().describe('the block the pool belongs to, copied from the card'),
    poolKey: z.string().describe('the pool key, copied from the card exactly'),
    stance: z.enum(['spine', 'face']).describe('a spine carries the pool key; a face is one thing a person could notice'),
    source: z.string().describe('the face source this unit speaks through, from the card faceSources'),
    pair: z.string().describe('the pair kind where the card names one for this pool, else an empty string'),
    text: z.string().describe('the unit itself: no em dash, no exclamation mark, no digit, no semicolon, no contraction, no first person, no will or shall'),
  })).describe('one entry per pool on the card, in the card page order'),
});

/** The mechanical bars, restated for the model in the brief's own words. */
export const MECHANICAL_BARS = [
  'no em dash and no exclamation mark: the E2 ratchet holds every face at hard zero',
  'no digit: a face states a band in words, never a figure',
  'no semicolon',
  'no contraction: the exact common word in a professional hand',
  'no first person: the archiver reports and the clerks are reported',
  'no will and no shall: no field says what comes next',
  'no rulebook proper noun, scale or unit',
].join('\n  - ');

/**
 * ⭐⭐ THE BLOCK BRIEF — the cached prefix. Byte-stable by construction.
 *
 * @param {{blockId: string, town: object, poolKeys: ReadonlyArray<string>,
 *   staticRows: ReadonlyArray<object>}} input
 * @returns {string}
 */
export function blockBrief(input) {
  const lines = [];
  lines.push('# THE ARCHIVER\'S BRIEF');
  lines.push('');
  lines.push('You are writing part of one settlement dossier. The dossier is compiled by ONE archiver from what');
  lines.push('the clerks of the various halls send in. Everything below is the law it is written under.');
  lines.push('');
  lines.push('## THE VOICE');
  lines.push(voiceText());
  lines.push('');
  lines.push('## THE MECHANICAL BARS, which red the build');
  lines.push(`  - ${MECHANICAL_BARS}`);
  lines.push('');
  lines.push('## THE EXEMPLAR PACK');
  lines.push(exemplarPack());
  lines.push('');
  lines.push(`## THE BLOCK: ${input.blockId}`);
  lines.push('These are the pool keys of this block and the wiring the codebase holds for each. A pool key is a');
  lines.push('STATE the engine has decided; the unit you write is that state said in the archiver\'s hand.');
  lines.push('');
  for (const row of input.staticRows) {
    lines.push(`- \`${row.pool}\` · wiring ${row.wiring} · rung ${row.rung} · reads ${(row.reads || []).join(', ') || '(none recorded)'}${row.covert ? ' · COVERT' : ''}`);
  }
  lines.push('');
  lines.push('## THE TOWN, WHICH DOES NOT CHANGE BETWEEN TABS');
  lines.push('Every role, body and record you may name is in this section. A role this town does not seat and a');
  lines.push('record no body here keeps are both refused outright by the instruments and never reach the page.');
  lines.push('```json');
  lines.push(JSON.stringify(input.town, null, 1));
  lines.push('```');
  lines.push('');
  lines.push('## WHAT TO RETURN');
  lines.push('One unit per pool on the card that follows, in the card\'s page order, under the schema you are given.');
  lines.push('Copy `blockId` and `poolKey` from the card exactly. Say what the card holds and nothing the card does');
  lines.push('not hold. Where the card carries a corpus unit for a pool, that unit is the shape to write into and');
  lines.push('the line that ships if yours is refused.');
  return lines.join('\n');
}

/**
 * ⭐ THE VOLATILE TURN — the card with its `town` block removed (it is in the cached prefix), plus
 * the epoch record where one exists.
 * @param {{card: object, record: object|null}} input
 * @returns {string}
 */
export function volatileTurn(input) {
  const { town, ...rest } = input.card;
  const body = [
    `## THE CARD: ${input.card.town.name} (${input.card.town.tier}), tab ${input.card.tab}, audience ${input.card.audience}`,
    '```json',
    JSON.stringify(rest),
    '```',
  ];
  if (input.record) {
    body.push('');
    body.push('## WHAT MOVED SINCE THE LAST SURVEY');
    body.push('This is the engine\'s own typed record of the advance. You may say that a thing has changed ONLY');
    body.push('over a field this delta names. You are never shown what was written last time, and you never');
    body.push('refine it: the coherence is the record\'s, not the prose\'s.');
    body.push('```json');
    body.push(JSON.stringify(input.record));
    body.push('```');
  }
  return body.join('\n');
}

/** The static-card rows for one block, sorted, so the brief is byte-stable. */
export function staticRowsFor(card, blockId) {
  return Object.values(card.pools)
    .filter((row) => row.block === blockId)
    .sort((a, b) => (a.pool < b.pool ? -1 : 1));
}
