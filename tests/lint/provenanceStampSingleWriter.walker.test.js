/**
 * provenanceStampSingleWriter.walker.test.js — R-5b item #10 STRUCTURAL
 * PREVENTION for the provenance-ledger merge (docs/CAPABILITY_REMEDIATION_PLAN.md).
 *
 * THE CLASS THIS KILLS. Two independent lanes stamp "who did this" onto a
 * settlement's institution roster and they have never agreed on a spelling: the
 * COMPOSER lane writes `createdByEventId` / `removedByEventId` /
 * `destroyedByEventId`, the WORLD-PULSE lane writes `*ByWorldPulseOutcomeId`.
 * Item #10 merged them on the READ side (src/domain/provenance/rosterProvenance.js)
 * rather than the write side, for three load-bearing reasons — undo scrubs by the
 * raw composer keys, institutionHistory is an ENGINE INPUT, and legacy saves carry
 * the old stamps forever. A read-side join is only sound while the write side stays
 * where it is. The failure this file makes impossible is a THIRD minter appearing
 * in some unrelated module, whose rows the join would then silently mis-attribute
 * (or, worse, a composer verb quietly acquiring a pulse stamp with no namespace).
 *
 * THE GUARANTEE — a fail-closed source scan over the whole of src/, in two
 * directions (the E-B walker pattern):
 *   1. MINTER EXACT SET — the set of files containing a MINT of any provenance
 *      stamp equals the declared list below. A new minter reds; a declared file
 *      that stopped minting reds (so the list can never rot into decoration).
 *   2. LANE PLACEMENT — pulse stamps are minted only under src/domain/worldPulse/;
 *      composer stamps only under src/domain/events/ plus the ONE exact-path
 *      exemption measured below.
 *   3. THE READ SIDE MINTS NOTHING — rosterProvenance.js reads every stamp in
 *      both families and must never write one, or the derived record would start
 *      feeding itself.
 *
 * THE MEASURED CORRECTION to the design spec. The spec predicted the composer
 * exemption would be `mutateEntities.js` minting a PULSE stamp for its SHIFT_TIER
 * verb. The measurement says otherwise, twice over, and the truth is better:
 *   - shiftTier writes NO stamp of its own; it delegates the whole roster surgery
 *     to worldPulse/tierOutcomeApply under a namespaced synthetic outcome id
 *     (`dm_shift_tier:…`), so the pulse family really is minted only under
 *     src/domain/worldPulse/, with no exemption at all. That namespace is the
 *     only tell between the lanes and is pinned in
 *     tests/domain/provenance/rosterProvenance.test.js.
 *   - the real exemption is on the COMPOSER side: src/domain/entities/npcs.js
 *     stamps `removedByEventId` when an event kills an NPC. It is an events-lane
 *     writer that happens to live in the entities tree.
 *
 * THE DAMPING FREEZE (below). institutionHistory is not a journal, it is an
 * ENGINE INPUT: priorLifecycleCounts counts entries by `fate` under a 24-entry
 * cap and damps build/close probability with the result. That is the exact reason
 * the merge could not be write-side, so the boundary is pinned structurally here —
 * a future lane adding a `tick` (or any other key) to those entries can do so
 * without changing a single damping decision, but a lane that widens what the
 * damping READS is a seeded-advance drift under THE PROMISE and reds here.
 *
 * KNOWN BLIND SPOT (deliberate). The scan is textual, so a stamp minted through a
 * computed key (`inst[keyName] = id`) is invisible. Nothing in the tree does that
 * today, and the object-literal idiom is the house style for every roster write.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** @type {Map<string, string>} */
const cache = new Map();
/** Read once per file — the scan touches every source several times over. */
function read(rel) {
  if (!cache.has(rel)) cache.set(rel, readFileSync(join(ROOT, rel), 'utf8'));
  return /** @type {string} */ (cache.get(rel));
}

// ── The two stamp families ───────────────────────────────────────────────────

const PULSE_VERBS = ['created', 'removed', 'founded', 'reopened', 'closed', 'demoted'];
const COMPOSER_VERBS = ['created', 'removed', 'destroyed'];

/** The optional `_` prefix catches the config sidecar spelling (_destroyedByEventId). */
const stampWord = (verbs, tail) => `(?:${verbs.join('|')})By${tail}`;
const PULSE_STAMP = new RegExp(`(?<![A-Za-z0-9])_?${stampWord(PULSE_VERBS, 'WorldPulseOutcomeId')}`);
const COMPOSER_STAMP = new RegExp(`(?<![A-Za-z0-9])_?${stampWord(COMPOSER_VERBS, 'EventId')}`);

/**
 * A MINT is an object-literal write: `stamp: <value>`. The `_`-prefixed value is
 * excluded because that is the destructure-discard idiom every SCRUB path uses
 * (`const { removedByEventId: _r, ...rest } = inst`) — removing a stamp is the
 * opposite of minting one.
 */
// The `(?=[^\s_])` lookahead cannot be satisfied by backtracking `\s*` onto a
// space, so it really does forbid an underscore-discard value (a plain `(?!_)`
// would pass by backtracking one character — verified as a negative control).
const mintOf = stamp => new RegExp(`(?<![A-Za-z0-9])_?${stamp}\\s*:\\s*(?=[^\\s_])`);
const PULSE_MINT = mintOf(stampWord(PULSE_VERBS, 'WorldPulseOutcomeId'));
const COMPOSER_MINT = mintOf(stampWord(COMPOSER_VERBS, 'EventId'));

// ── The declared minters (exact set, both directions) ────────────────────────

/** Every file allowed to MINT a world-pulse stamp, with what it stamps and why. */
const PULSE_MINTERS = {
  'src/domain/worldPulse/institutionLifecycle.js':
    'The lifecycle apply path: build / reopen / close / abolish / found each stamp their outcome id onto the row they touched.',
  'src/domain/worldPulse/tierOutcomeApply.js':
    'The tier apply path: promotion additions and reactivations stamp createdBy…, demotion fates stamp demotedBy… / removedBy….',
  'src/domain/worldPulse/entrepotKernel.js':
    'The M6b entrepot layer founds a transshipment institution under its own `entrepot.founding.…` outcome id.',
  'src/domain/worldPulse/settlementLifecycleFirstClass.js':
    'Settlement death disperses the roster, stamping removedByWorldPulseOutcomeId on every institution that went with it.',
};

/** Every file allowed to MINT a composer stamp, with what it stamps and why. */
const COMPOSER_MINTERS = {
  'src/domain/events/mutateEntities.js':
    'The composer verbs themselves: ADD/REMOVE institution + faction, DESTROY settlement. These keys are what undoLastEvent scrubs by.',
  'src/domain/entities/npcs.js':
    'THE ONE EXEMPTION outside src/domain/events: killing an NPC through an event stamps removedByEventId so undo can un-kill exactly that death.',
};

/** Lane placement: which directory prefix each family belongs to. */
const PULSE_LANE = 'src/domain/worldPulse/';
const COMPOSER_LANE = 'src/domain/events/';
/** Composer minters legitimately outside the events lane (exact paths only). */
const COMPOSER_LANE_EXEMPT = ['src/domain/entities/npcs.js'];

const READ_SIDE = 'src/domain/provenance/rosterProvenance.js';

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
  .map(abs => relative(ROOT, abs).replace(/\\/g, '/'))
  .sort();

/** rel path → the lines that match `pattern`, as `line-number: text`. */
function linesMatching(rel, pattern) {
  return read(rel)
    .split('\n')
    .map((text, i) => ({ line: i + 1, text: text.trim() }))
    .filter(({ text }) => pattern.test(text));
}

const filesMinting = pattern => SOURCES.filter(rel => linesMatching(rel, pattern).length > 0);
const filesMentioning = pattern => SOURCES.filter(rel => pattern.test(read(rel)));

const pulseMinters = filesMinting(PULSE_MINT);
const composerMinters = filesMinting(COMPOSER_MINT);

describe('provenance stamps — the write side stays where the read-side join expects it', () => {
  test('guard-the-guard: the scan is not vacuous and both families really fire', () => {
    // A silently-broken walk or regex would pass every assertion below over an
    // empty set. Today src/ holds ~1.5k scanned files and both families mint.
    expect(SOURCES.length).toBeGreaterThan(500);
    expect(pulseMinters.length).toBeGreaterThan(0);
    expect(composerMinters.length).toBeGreaterThan(0);
    // The MINT regex must be strictly narrower than the MENTION regex, or the
    // scrub/read exclusion is doing nothing.
    expect(filesMentioning(PULSE_STAMP).length).toBeGreaterThan(pulseMinters.length);
    expect(filesMentioning(COMPOSER_STAMP).length).toBeGreaterThan(composerMinters.length);
    // Negative control: the destructure-discard idiom is NOT a mint.
    expect(PULSE_MINT.test('closedByWorldPulseOutcomeId: outcome.id || null,')).toBe(true);
    expect(COMPOSER_MINT.test('const { removedByEventId: _r, ...rest } = existing;')).toBe(false);
    expect(COMPOSER_MINT.test('createdByEventId: event.id,')).toBe(true);
  });

  test('EXACT SET: the world-pulse stamp has exactly the declared minters', () => {
    const declared = Object.keys(PULSE_MINTERS).sort();
    expect(
      pulseMinters,
      '\nThe set of files MINTING a *ByWorldPulseOutcomeId stamp changed. A new minter must be '
      + 'declared in PULSE_MINTERS (tests/lint/provenanceStampSingleWriter.walker.test.js) WITH its '
      + 'reason, and src/domain/provenance/rosterProvenance.js must be taught to classify it — an '
      + 'unclassified stamp renders as "unknown" provenance on the dossier. A file that stopped '
      + 'minting must lose its entry so the list cannot rot.\n',
    ).toEqual(declared);
  });

  test('EXACT SET: the composer stamp has exactly the declared minters', () => {
    const declared = Object.keys(COMPOSER_MINTERS).sort();
    expect(
      composerMinters,
      '\nThe set of files MINTING a *ByEventId stamp changed. These keys are the FROZEN CONTRACT '
      + 'undoLastEvent scrubs by (src/domain/events/undoEvent.js) — a new minter outside the '
      + 'declared list means an entity that undo cannot un-create. Declare it in COMPOSER_MINTERS '
      + 'with its reason, or move the write to the events lane.\n',
    ).toEqual(declared);
  });

  test('LANE PLACEMENT: each family is minted only in its own lane', () => {
    const strayPulse = pulseMinters.filter(rel => !rel.startsWith(PULSE_LANE));
    expect(
      strayPulse,
      'a world-pulse stamp minted outside src/domain/worldPulse/. The composer\'s SHIFT_TIER verb '
      + 'is the sanctioned way to reuse the pulse apply path: delegate to '
      + 'applyTierOutcomeToSettlement under a `dm_shift_tier:` namespaced outcome id rather than '
      + 'hand-stamping the row.',
    ).toEqual([]);

    const strayComposer = composerMinters
      .filter(rel => !rel.startsWith(COMPOSER_LANE) && !COMPOSER_LANE_EXEMPT.includes(rel));
    expect(
      strayComposer,
      'a composer stamp minted outside src/domain/events/ and outside the declared exemptions',
    ).toEqual([]);

    // The exemptions must still be earning their place.
    for (const rel of COMPOSER_LANE_EXEMPT) {
      expect(composerMinters, `stale exemption: ${rel} no longer mints a composer stamp`).toContain(rel);
    }
  });

  test('every declared minter really mints — no decorative entries', () => {
    for (const rel of Object.keys(PULSE_MINTERS)) {
      expect(linesMatching(rel, PULSE_MINT).length, `${rel} declares a pulse mint it does not perform`).toBeGreaterThan(0);
    }
    for (const rel of Object.keys(COMPOSER_MINTERS)) {
      expect(linesMatching(rel, COMPOSER_MINT).length, `${rel} declares a composer mint it does not perform`).toBeGreaterThan(0);
    }
  });

  test('THE READ SIDE MINTS NOTHING: the derived record never writes a stamp', () => {
    const src = read(READ_SIDE);
    expect(PULSE_STAMP.test(src), 'the read-side join must reference the pulse stamps to join them').toBe(true);
    expect(COMPOSER_STAMP.test(src), 'the read-side join must reference the composer stamps to join them').toBe(true);
    expect(linesMatching(READ_SIDE, PULSE_MINT), 'the derived provenance record must never WRITE a stamp').toEqual([]);
    expect(linesMatching(READ_SIDE, COMPOSER_MINT), 'the derived provenance record must never WRITE a stamp').toEqual([]);
    // A leaf by construction: no store import may ride in on the display path.
    expect(/from '\.\.?\/.*store\//.test(src), 'rosterProvenance.js must stay a pure domain leaf').toBe(false);
  });
});

// ── The damping freeze (the drift boundary, made structural) ─────────────────

const LIFECYCLE = 'src/domain/worldPulse/institutionLifecycle.js';

/** The body of a named top-level function, brace-matched from its signature. */
function functionBody(src, name) {
  const start = src.indexOf(`function ${name}(`);
  expect(start, `${name} vanished from ${LIFECYCLE} — the damping freeze lost its subject`).toBeGreaterThan(-1);
  // Skip the parameter list first: these signatures carry inline JSDoc casts
  // (`/** @type {any} */ settlement`), so the first `{` after the name is a TYPE,
  // not the body.
  let parens = 0;
  let cursor = src.indexOf('(', start);
  for (; cursor < src.length; cursor += 1) {
    if (src[cursor] === '(') parens += 1;
    else if (src[cursor] === ')') {
      parens -= 1;
      if (parens === 0) break;
    }
  }
  let depth = 0;
  let i = src.indexOf('{', cursor);
  const open = i;
  for (; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error(`unbalanced braces reading ${name}`);
}

describe('institutionHistory is an ENGINE INPUT — the damping reads `fate` and nothing else', () => {
  const src = read(LIFECYCLE);
  const body = functionBody(src, 'priorLifecycleCounts');

  test('guard-the-guard: the extracted body is really the counter', () => {
    expect(body).toContain('institutionHistory');
    expect(body).toContain('builds');
    expect(body).toContain('closes');
    expect(body.length).toBeGreaterThan(80);
  });

  test('THE FREEZE: the only entry field the damping reads is `fate`', () => {
    // Every property read off a history ENTRY inside the counter. If a future
    // lane makes the damping read a second field, the two journals stop being
    // "extra keys are free" and every added key becomes seeded-advance drift.
    const entryReads = [...body.matchAll(/\bentry\s*\??\.\s*([A-Za-z_$][\w$]*)/g)].map(m => m[1]);
    expect(
      [...new Set(entryReads)].sort(),
      '\nThe institutionHistory damping now reads a field other than `fate`. That is the exact '
      + 'boundary the read-side provenance merge was built around: while the engine reads only '
      + '`fate`, a lane may add keys (a tick, an actor) to history entries without changing a '
      + 'single seeded-advance decision. Widening this read makes every such addition a golden '
      + 'mover under THE PROMISE — take it to the T4 batch with an owner-signed shift, never here.\n',
    ).toEqual(['fate']);
  });

  test('THE FREEZE: the two fate vocabularies are exactly the frozen sets', () => {
    const setOf = name => {
      const m = src.match(new RegExp(`const ${name} = new Set\\(\\[([^\\]]*)\\]\\)`));
      expect(m, `${name} is no longer a literal Set — the damping vocabulary must stay readable`).toBeTruthy();
      return m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).sort();
    };
    expect(setOf('LIFECYCLE_BUILD_FATES')).toEqual(['built', 'reopened']);
    expect(setOf('LIFECYCLE_CLOSE_FATES')).toEqual(['bankrupt', 'closed_for_want_of_custom', 'shuttered']);
  });

  test('THE FREEZE: the 24-entry cap that makes the damping forget is intact', () => {
    const append = functionBody(src, 'appendInstitutionHistory');
    expect(append).toContain('slice(-23)');
    expect(append).toContain('slice(-24)');
  });

  test('the composer never appends to institutionHistory directly', () => {
    // A composer verb appending its own entry would change the fate counts and
    // therefore the next advance's build/close decisions — seeded drift. The
    // sanctioned pattern is SHIFT_TIER's: delegate to the pulse apply path.
    const composerFiles = SOURCES.filter(rel => rel.startsWith('src/domain/events/'));
    const appenders = composerFiles.filter(rel => /institutionHistory\s*:/.test(read(rel)));
    expect(
      appenders,
      'a composer verb writes institutionHistory directly. institutionHistory feeds '
      + 'priorLifecycleCounts (build/close damping) under a 24-entry cap, so a composer-written '
      + 'entry both damps a future advance and evicts an older one — seeded-advance drift under '
      + 'THE PROMISE. Delegate to worldPulse/tierOutcomeApply the way SHIFT_TIER does.',
    ).toEqual([]);
  });
});
