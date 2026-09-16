/**
 * implicitNeutralSingleSource.test.js — single-writer guard for the neutral-neighbour
 * default (owner order 2026-07-22).
 *
 * Implicit Neutral neighbours are a READ-TIME default, never materialized rows.
 * They must be minted in exactly ONE place — src/domain/relationships/
 * effectiveNeighbours.js — so the "co-campaign ⇒ neutral by default" reading can
 * never be forked into a second, drifting implementation, and so the marker stays
 * a read-time-only object that is never persisted (a second minter could leak an
 * implicit entry into neighbourNetwork → the neighbour_links column → the map/road
 * network / regional causal graph, which deliberately read RAW explicit links).
 *
 * Scan signatures (WRITE shapes only, never reads):
 *   (a) `[IMPLICIT_NEUTRAL_FLAG]:`  — setting the marker as an object key (a mint)
 *   (b) `implicit_neutral__`        — the synthetic implicit linkId literal
 * A consumer READING the marker (`link[IMPLICIT_NEUTRAL_FLAG]`, no colon) does not
 * match, so display/guard code may freely detect implicit entries.
 *
 * CANNOT-CATCH (accepted regex-gate gaps): a minter that reconstructs an implicit
 * entry WITHOUT the marker key and WITHOUT the `implicit_neutral__` linkId prefix
 * (e.g. hand-rolling `{ relationshipType: 'neutral', targetId }`). Residual is
 * covered by the effectiveNeighbours totality pins + the buildGraph campaign-aware
 * pins, which assert the chokepoint is the path the cascade actually reads.
 *
 * Frozen 2026-07-22 (hand-audited): the ONLY legal minter is effectiveNeighbours.js.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');
const CHOKEPOINT = 'src/domain/relationships/effectiveNeighbours.js';

const MINT_SIGNATURES = [
  /\[\s*IMPLICIT_NEUTRAL_FLAG\s*\]\s*:/, // (a) setting the marker as an object key
  /implicit_neutral__/,                  // (b) the synthetic implicit linkId literal
];

/** Strip block + line comments so a signature named in a doc comment isn't a hit. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Recursively collect .js / .jsx / .mjs files under src, forward-slash normalized. */
function sourceFiles(dir = SRC, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    if (e.isDirectory()) sourceFiles(abs, acc);
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(relative(REPO, abs).split(sep).join('/'));
  }
  return acc;
}

describe('implicit neutral neighbour — single writer (effectiveNeighbours.js)', () => {
  it('the chokepoint itself matches the mint signature (guard non-vacuity)', () => {
    const src = stripComments(readFileSync(join(REPO, CHOKEPOINT), 'utf8'));
    expect(MINT_SIGNATURES.some((re) => re.test(src))).toBe(true);
  });

  it('no file except effectiveNeighbours.js mints an implicit neutral neighbour', () => {
    const offenders = [];
    for (const file of sourceFiles()) {
      if (file === CHOKEPOINT) continue; // the single sanctioned minter
      const src = stripComments(readFileSync(join(REPO, file), 'utf8'));
      for (const re of MINT_SIGNATURES) {
        if (re.test(src)) offenders.push(file);
      }
    }
    expect(
      [...new Set(offenders)],
      'implicit Neutral neighbours must be minted only in ' + CHOKEPOINT +
        ' (import effectiveNeighboursOf instead of hand-building an implicit link). ' +
        'Offending files:\n  ' + [...new Set(offenders)].join('\n  '),
    ).toEqual([]);
  });
});

// ── RN-A1: THE RELATIONSHIP-SPELLING SINGLE-WRITER LAW (ODQ §64.1/§64.4) ─────

/**
 * The law one level up from the guard above.
 *
 * The arm above says an implicit-neutral READING may never fork into a second,
 * drifting implementation. RN-A1's law says the relationship-SPELLING reading may
 * never fork into a second, drifting TABLE: `canonicalRelationship.js` is the single
 * HOME for every map from a legacy or synonym spelling onto a canonical relationship
 * label, and it hosts one table per plane (regional + relationship-state) side by
 * side rather than merged.
 *
 * SCAN SIGNATURE (DECLARATION shapes only, never reads): a spelling→label pair as it
 * appears in an object literal, e.g. `alliance: 'allied'`. A consumer that READS a
 * label (`if (type === 'allied')`) carries no colon-quote pair and does not match, so
 * ordinary relationship logic is free.
 *
 * ⭐ THE ROSTER WAS ASKED OF THE CORPUS, NOT GUESSED. These signatures were measured
 * against all of `src/` before they were written here: five files matched at RN-A1's
 * base, and four match after the relocation.
 *
 * CANNOT-CATCH (accepted, and the same class the guard above records): a fold
 * expressed as control flow rather than a table — `k === 'trade_partners' ? …` — has
 * no object-literal pair and cannot match. `generosityGate.js` is exactly that shape,
 * which is why it is NOT on the banked roster below; its fold is arm B1's row.
 */
const SPELLING_HOME = 'src/domain/relationships/canonicalRelationship.js';

const SPELLING_TABLE_SIGNATURES = [
  /['"]?\balliance['"]?\s*:\s*['"]allied['"]/,
  /['"]?\bally['"]?\s*:\s*['"]allied['"]/,
  /['"]?\btrade['"]?\s*:\s*['"]trade_partner['"]/,
  /['"]?\btrade_partners['"]?\s*:\s*['"]trade_partner['"]/,
  /['"]?\boverlord['"]?\s*:\s*['"]vassal['"]/,
  /['"]?\btributary['"]?\s*:\s*['"]vassal['"]/,
  /['"]?\bsubject['"]?\s*:\s*['"]vassal['"]/,
  /['"]?\benemy['"]?\s*:\s*['"]hostile['"]/,
  /['"]?\bwar['"]?\s*:\s*['"]hostile['"]/,
  /['"]?\bcoldwar['"]?\s*:\s*['"]cold_war['"]/,
  /['"]?\bcriminal_corridor['"]?\s*:\s*['"]criminal_network['"]/,
  /['"]?\bsmuggling['"]?\s*:\s*['"]smuggling_partner['"]/,
];

/**
 * ⛔ THE BANKED SHIM INVENTORY — SHRINK-ONLY, EXACT-SET, NEVER GROWS.
 *
 * Three modules still carry their own private spelling fold. RN-A1 enumerates them as
 * BANKED DEBT rather than re-pointing them, which is what keeps that member at two
 * modified production files; re-pointing any one of them is a later act that pays the
 * §95.2 sweep for the row it burns.
 *
 * The assertion below is EXACT-SET in both directions, and that is deliberate. A `<=`
 * ceiling would let a cure go unbanked: when a shim is re-pointed this test REDS and
 * demands its line be deleted here, so the win is locked in the diff instead of
 * becoming invisible headroom. That is the sizeBaseline honesty idiom, applied to
 * spelling tables.
 */
const BANKED_SPELLING_SHIMS = Object.freeze([
  'src/domain/events/mutateWorld.js',
  'src/domain/regionalGraph.js',
  'src/domain/worldPulse/canonRelationshipImpact.js',
]);

/** @param {string} file @returns {boolean} */
function declaresSpellingTable(file) {
  const src = stripComments(readFileSync(join(REPO, file), 'utf8'));
  return SPELLING_TABLE_SIGNATURES.some((re) => re.test(src));
}

describe('relationship spelling tables — single home (canonicalRelationship.js)', () => {
  it('the home itself matches the signature (guard non-vacuity)', () => {
    // Without this, a scan whose signatures had all rotted would report an empty
    // offender list and pass while enforcing nothing.
    expect(declaresSpellingTable(SPELLING_HOME)).toBe(true);
  });

  it('the home hosts BOTH plane tables — one home is not one table', () => {
    const src = stripComments(readFileSync(join(REPO, SPELLING_HOME), 'utf8'));
    const matched = SPELLING_TABLE_SIGNATURES.filter((re) => re.test(src));
    expect(
      matched.length,
      'the home stopped carrying both plane tables. RN-A1 put the relationship-state'
      + ' plane table BESIDE the regional one; if one vanished, either it was merged'
      + ' (arm B1, owner-gated) or it drifted back out to another module.',
    ).toBe(SPELLING_TABLE_SIGNATURES.length);
  });

  it('no file outside the home and the banked shims declares a spelling table', () => {
    const declarers = sourceFiles().filter(declaresSpellingTable).sort();
    expect(
      declarers,
      'a relationship-spelling table was declared outside its single home.'
      + ` Declare it in ${SPELLING_HOME} and import it, or — if this is a cure that`
      + ' RETIRED a banked shim — delete that shim from BANKED_SPELLING_SHIMS in the'
      + ' same commit, because this inventory only ever shrinks.',
    ).toEqual([SPELLING_HOME, ...BANKED_SPELLING_SHIMS].sort());
  });

  it('every banked shim is real — the inventory cannot hide a stale row', () => {
    // An entry naming a file that no longer folds spellings would silently reserve a
    // slot for a future offender. Each row must still be a genuine, live shim.
    for (const shim of BANKED_SPELLING_SHIMS) {
      expect(declaresSpellingTable(shim), `${shim} no longer declares a spelling table — delete its banked row`).toBe(true);
    }
  });
});
