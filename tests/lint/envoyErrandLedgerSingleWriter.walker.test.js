/**
 * envoyErrandLedgerSingleWriter.walker.test.js — the executable half of WR-7a's
 * single-writer law for `worldState.envoyErrands` (cycle-8 verifier, Finding B).
 *
 * THE LAW, AS WRITTEN. Three headers in the errand family assert it in prose:
 * envoyErrandLedger.js ("the ONE function that writes `worldState.envoyErrands`"),
 * envoyErrand.js ("assigned in exactly one function (`writeErrands`), in one
 * file"), and envoyErrandEncounterWriter.js ("splitting this arc out of the head
 * did not mint a second writer of `envoyErrands`"). THE DECOMPOSITION WAVE (ruling
 * R-BLD-4) turned one 2,638-line module into a head plus nine leaves precisely
 * because the law reads ONE WRITER FAMILY, not one file — which is exactly the
 * arrangement in which a second writer is easiest to add by accident, and hardest
 * to see in review: ten sibling files that all legitimately import the same
 * vocabulary constant, any one of which could spread the key into a world object
 * itself instead of routing through `writeErrands`.
 *
 * WHY A SECOND WRITER IS A REAL DEFECT, NOT A STYLE COMPLAINT. `writeErrands`
 * carries four behaviours nothing else replicates:
 *   - it NORMALIZES BOTH SIDES through `normalizeEnvoyErrands` (bounding terminal
 *     history, de-duplicating by id, sorting by departedTick then codepoint), so a
 *     bypassing write persists rows in an order the reader never produces;
 *   - it returns the caller's own world BY REFERENCE when nothing moved (law 5's
 *     change-detector rule), so a bypassing write mints a fresh object on a no-op
 *     and breaks the identity every memoized consumer keys on;
 *   - it DELETES the top-level key rather than persisting an empty array, which is
 *     what makes a dark campaign serialize byte-identically (the conditional-ledger
 *     dormancy contract in worldState.js);
 *   - it is the seam `ensureWorldState`'s round-trip is validated against, so a
 *     bypassing write is exactly the class that survives one lifecycle path (the
 *     tick) and ghosts on another (save → reload → undo).
 * All four fail SILENTLY. There is no runtime signal; the symptom is a duplicated
 * envoy, a dormancy golden that drifted, or an undo that resurrects a returned
 * legate — all of them attributed to something else weeks later.
 *
 * THE GUARANTEE — a fail-closed source scan over all of src/, in both directions
 * (the provenanceStampSingleWriter / E-B walker pattern):
 *   1. WRITER EXACT SET — the set of files containing a WRITE form of the ledger
 *      key equals the single declared writer. A new writer reds; the declared
 *      writer ceasing to write reds, so the declaration can never rot.
 *   2. FUNCTION SCOPE — inside that one file, every write form sits inside
 *      `writeErrands`'s own body. A second function in the ledger leaf would
 *      satisfy a file-level scan while breaking the law as the headers state it.
 *   3. THE READERS READ — the whole rest of the family reaches the ledger through
 *      `envoyErrandsOf` / `writeErrands`, and the mention census is strictly wider
 *      than the writer set, so the narrow WRITE regex is provably not just a
 *      broken pattern matching nothing.
 *
 * THE ONE REVIEWED EXEMPTION — `src/domain/worldPulse/worldState.js`. The
 * persistence layer materializes EVERY conditional ledger generically, through a
 * loop over CONDITIONAL_LEDGER_KEYS with the key in a variable, so it never spells
 * a write form of this key and never trips the scan. That is not an accident this
 * file tolerates but a property it PINS below: worldState.js's only envoy-specific
 * token is a rehydration dispatch that must route to `normalizeEnvoyErrands` — it
 * rehydrates persisted rows, it never authors one.
 *
 * KNOWN BLIND SPOT (deliberate, and the same one the provenance walker declares).
 * The scan is textual, so a write through a fully computed key held in a local
 * (`const k = 'envoy' + 'Errands'; out[k] = rows`) is invisible. Nothing in the
 * tree does that, the vocabulary constant is the house idiom, and a detector that
 * chased string arithmetic would have to interpret the language rather than read
 * it. The exact-set direction is what makes this bounded: such a file would still
 * have to import or re-spell the key to be useful, and every honest spelling of
 * it is caught here.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const LEDGER_LEAF = 'src/domain/worldPulse/envoyErrandLedger.js';
const WRITER_FUNCTION = 'writeErrands';
const VOCABULARY_LEAF = 'src/domain/worldPulse/envoyErrandVocabulary.js';
const PERSISTENCE_LAYER = 'src/domain/worldPulse/worldState.js';
const RECORDS_LEAF = 'src/domain/worldPulse/envoyErrandRecords.js';

/** @type {Map<string, string>} */
const cache = new Map();
function read(rel) {
  if (!cache.has(rel)) cache.set(rel, readFileSync(join(ROOT, rel), 'utf8'));
  return /** @type {string} */ (cache.get(rel));
}

/**
 * Source with comments stripped. A claim about what a module CANNOT do must read
 * the code, never the prose: three of these headers describe the single-writer
 * law in words that name the key, and a raw scan would read the law itself as the
 * offence.
 */
const executable = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

// ── The write forms ──────────────────────────────────────────────────────────
// Every honest spelling of the key: the two string literals and the vocabulary
// constant that is the house idiom. A reader (`state[KEY]`, `'envoyErrands' in x`)
// matches none of these; only a form that PUTS the key onto an object does.
const KEY_TOKEN = String.raw`(?:'envoyErrands'|"envoyErrands"|ENVOY_ERRAND_LEDGER_KEY)`;

const WRITE_FORMS = Object.freeze({
  /** `{ ...state, [KEY]: rows }` or a literal `envoyErrands: rows` property. */
  'object-property write': new RegExp(String.raw`(?:\[\s*${KEY_TOKEN}\s*\]|\benvoyErrands)\s*:`),
  /** `world.envoyErrands = rows` / `out[KEY] = rows` (never `===`). */
  'member assignment': new RegExp(String.raw`(?:\.envoyErrands\b|\[\s*${KEY_TOKEN}\s*\])\s*=(?!=)`),
  /** `delete out[KEY]` — dropping the key is a write of the dormancy contract. */
  'key deletion': new RegExp(String.raw`\bdelete\s+[^;\n]*?(?:\.envoyErrands\b|\[\s*${KEY_TOKEN}\s*\])`),
});

/** Any mention of the key at all — the denominator the write forms sit inside. */
const MENTION = new RegExp(KEY_TOKEN);

/** True when any write form appears in the given executable source text. */
function writeFormsIn(code) {
  return Object.entries(WRITE_FORMS)
    .filter(([, re]) => code.split('\n').some((line) => re.test(line)))
    .map(([name]) => name)
    .sort();
}

// ── The census ───────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(abs);
  }
  return out;
}

const SOURCES = walk(join(ROOT, 'src'))
  .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
  .sort();

const writers = SOURCES.filter((rel) => writeFormsIn(executable(read(rel))).length > 0);
const mentioners = SOURCES.filter((rel) => MENTION.test(executable(read(rel))));

/** The balanced body of a named exported function, from its signature. */
function functionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  expect(start, `${name} vanished from ${LEDGER_LEAF} — the single-writer law lost its subject`).toBeGreaterThan(-1);
  let parens = 0;
  let cursor = source.indexOf('(', start);
  for (; cursor < source.length; cursor += 1) {
    if (source[cursor] === '(') parens += 1;
    else if (source[cursor] === ')') {
      parens -= 1;
      if (parens === 0) break;
    }
  }
  let depth = 0;
  const open = source.indexOf('{', cursor);
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`unbalanced braces reading ${name}`);
}

describe('worldState.envoyErrands — one writer, one function (WR-7a / R-BLD-4)', () => {
  test('guard-the-guard: the scan is not vacuous and every write form really fires', () => {
    // A silently-broken walk or a rotted regex would pass every assertion below
    // over an empty set. Today src/ holds ~2k scanned files.
    expect(SOURCES.length).toBeGreaterThan(500);
    expect(writers.length).toBeGreaterThan(0);
    // The WRITE regex must be strictly narrower than MENTION, or the reader
    // exclusion is doing nothing and "one writer" would just mean "one mention".
    expect(mentioners.length).toBeGreaterThan(writers.length);

    // Positive controls — each form fires on the shape it names.
    expect(writeFormsIn('return { ...state, [ENVOY_ERRAND_LEDGER_KEY]: next };')).toEqual(['object-property write']);
    expect(writeFormsIn('  envoyErrands: rows,')).toEqual(['object-property write']);
    expect(writeFormsIn('world.envoyErrands = rows;')).toEqual(['member assignment']);
    expect(writeFormsIn("out['envoyErrands'] = rows;")).toEqual(['member assignment']);
    expect(writeFormsIn('delete out[ENVOY_ERRAND_LEDGER_KEY];')).toEqual(['key deletion']);

    // Negative controls — the reader idioms this family is BUILT on must never
    // read as writes, or the exact-set assertion below would be unfalsifiable.
    expect(writeFormsIn('return normalizeEnvoyErrands(asObject(worldState)[ENVOY_ERRAND_LEDGER_KEY]);')).toEqual([]);
    expect(writeFormsIn('const errands = envoyErrandsOf(worldState);')).toEqual([]);
    expect(writeFormsIn("if (key === 'envoyErrands') return normalizeEnvoyErrands(raw?.[key]);")).toEqual([]);
    expect(writeFormsIn("expect(result.worldState).not.toHaveProperty('envoyErrands');")).toEqual([]);
  });

  test('WRITER EXACT SET: exactly one file in src/ writes the ledger key', () => {
    expect(
      writers,
      '\nThe set of files WRITING worldState.envoyErrands changed. `writeErrands` in '
      + `${LEDGER_LEAF} is the ONE writer by ruling R-BLD-4, and it is not a style rule: it `
      + 'normalizes both sides, returns the caller\'s own world by reference on a no-op, and '
      + 'DELETES the key rather than persisting an empty array (the dormancy contract). A second '
      + 'writer breaks all three silently — the symptom is a duplicated envoy, a drifted dormancy '
      + 'golden, or an undo that resurrects a returned legate. Route the write through '
      + '`writeErrands` instead of widening this list.\n',
    ).toEqual([LEDGER_LEAF]);
  });

  test('FUNCTION SCOPE: every write inside the ledger leaf sits inside writeErrands', () => {
    const code = executable(read(LEDGER_LEAF));
    const body = functionBody(code, WRITER_FUNCTION);
    // The body really is the writer (not an empty brace-match).
    expect(writeFormsIn(body).length, 'writeErrands no longer writes the key at all').toBeGreaterThan(0);
    expect(body).toContain('normalizeEnvoyErrands');

    // Remove the writer's body from the file and nothing writeable may remain —
    // a SECOND function in this same leaf would pass a file-level scan while
    // breaking the law exactly as the three family headers state it.
    const outsideTheWriter = code.replace(body, '');
    expect(
      writeFormsIn(outsideTheWriter),
      `a second write of the ledger key inside ${LEDGER_LEAF}, outside ${WRITER_FUNCTION}()`,
    ).toEqual([]);
  });

  test('the writer keeps its three load-bearing behaviours', () => {
    const body = functionBody(executable(read(LEDGER_LEAF)), WRITER_FUNCTION);
    // Normalize BOTH sides — a one-sided normalize makes the change-detector lie.
    expect((body.match(/normalizeEnvoyErrands\s*\(/g) || []).length).toBeGreaterThanOrEqual(2);
    // Return the caller's own world on a no-op (identity, not a fresh object).
    expect(body).toMatch(/return\s+worldState\s*;/);
    // Drop the key rather than persisting an empty array (dormancy byte-identity).
    expect(body).toMatch(/delete\s+\w+\[\s*ENVOY_ERRAND_LEDGER_KEY\s*\]/);
  });

  test('THE ONE EXEMPTION: the persistence layer rehydrates the key, it never authors one', () => {
    const code = executable(read(PERSISTENCE_LAYER));
    // It is in the census as a MENTIONER (it must name the key to rehydrate it)…
    expect(mentioners, `${PERSISTENCE_LAYER} must still name the key it rehydrates`).toContain(PERSISTENCE_LAYER);
    // …and NOT as a writer: the conditional-ledger loop holds the key in a
    // variable, so it materializes every ledger generically and can never author
    // an envoy row of its own.
    expect(writeFormsIn(code), `${PERSISTENCE_LAYER} now spells a direct write of the ledger key`).toEqual([]);
    // Its one envoy-specific branch must route to the family's own normalizer.
    expect(code).toMatch(/key === 'envoyErrands'[\s\S]{0,120}normalizeEnvoyErrands\s*\(/);
  });

  test('the key literal lives in the vocabulary leaf and the readers go through it', () => {
    expect(read(VOCABULARY_LEAF)).toContain("export const ENVOY_ERRAND_LEDGER_KEY = 'envoyErrands';");
    // The read chokepoint is a projection, not a write — the reader half of the
    // same law, and the reason the write regex can afford to be this narrow.
    const records = executable(read(RECORDS_LEAF));
    expect(records).toMatch(/export function envoyErrandsOf\s*\(/);
    expect(writeFormsIn(records), 'the read projection must never write the key').toEqual([]);
  });

  test('MUTANT: a second writer anywhere in the family reds this walker', () => {
    // Production-shaped: the encounter writer (the arc that was split out of the
    // head, and whose own header claims the split "did not mint a second writer")
    // spreading the key itself instead of calling writeErrands.
    const rel = 'src/domain/worldPulse/envoyErrandEncounterWriter.js';
    const source = read(rel);
    const anchor = '  const nextWorldState = writeErrands(worldState, next);';
    expect(source, `${rel} lost the anchor this mutant is planted at`).toContain(anchor);
    const mutant = source.replace(
      anchor,
      '  const nextWorldState = { ...worldState, [ENVOY_ERRAND_LEDGER_KEY]: next };',
    );
    expect(mutant).not.toBe(source);
    expect(writeFormsIn(executable(source)), 'the unmutated encounter writer must be clean').toEqual([]);
    expect(writeFormsIn(executable(mutant))).toEqual(['object-property write']);
  });

  test('MUTANT: a second writer FUNCTION inside the ledger leaf reds the scope pin', () => {
    const code = executable(read(LEDGER_LEAF));
    const body = functionBody(code, WRITER_FUNCTION);
    // A sibling helper in the same file — invisible to a file-level exact set.
    const mutant = `${code}\nexport function clearErrands(worldState) {\n  const out = { ...worldState };\n  delete out[ENVOY_ERRAND_LEDGER_KEY];\n  return out;\n}\n`;
    expect(writeFormsIn(code.replace(body, '')), 'the unmutated leaf writes only inside writeErrands').toEqual([]);
    expect(writeFormsIn(mutant.replace(body, ''))).toEqual(['key deletion']);
  });
});
