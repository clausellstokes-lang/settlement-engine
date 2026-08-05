/**
 * oathStampTotality.walker.test.js — GR-1: habitat removal for the UNSIGNED MINT DOOR
 * class (compiled charter docs/DESIGN_FP_ARCHITECTURE.md §5 #9, "the stamp totality
 * walker across all three doors").
 *
 * THE CLASS. The treaty writer family has more than one road into the one instrument,
 * and the count has already changed once: the GRAMMAR volume was written when there
 * were TWO mint doors and WR-10 landed a third (the victor-free sale) before this wave
 * started. A road that mints without stamping produces a treaty that is correct in
 * every other respect and simply has no signature line — so the Herald says "the seat
 * swore" for peaces that came home one way and names two people for peaces that came
 * home another, and nothing anywhere reds. The failure is invisible at runtime, it is
 * invisible in a receipt (a receipt cannot say which road minted a document), and it
 * gets WORSE with time, because the next door to be added inherits the silence.
 *
 * WHY A SOURCE WALKER AND NOT ONLY BEHAVIOUR. tests/domain/oathHolderGr1.test.js DRIVES
 * all three roads lit and asserts each stamps — that is the real proof, and it is the
 * stronger one. What it cannot do is notice a FOURTH door: a behavioural battery only
 * ever tests the roads its author knew about. This walker closes that by measuring the
 * door set from the tree instead of from a list, and reddening when the measured set
 * and the declared set disagree in either direction.
 *
 * THE WALK. A module MINTS when it writes the treaties ledger — `setSpatialLedger(…,
 * 'treaties', …)`, which is the estate's one persistence road for the instrument.
 * Every writer must then be either
 *   1. a REGISTERED MINT MODULE, which must reach the one stamp writer (`stampSworn`
 *      from oathHolder.js) — the import is the reach, since a module that does not
 *      import it cannot possibly call it; or
 *   2. a REGISTERED REWRITER, which does not mint and carries a written reason.
 * Both lists are exact: an entry naming a module that no longer writes the ledger reds
 * as stale, and a module in neither list reds as unaccounted.
 *
 * GUARD THE GUARD. The detector is driven against synthetic sources and must red on
 * each failure shape before any live claim is made, and the live scan carries a
 * positive control (a writer everyone agrees is there), a discriminating control (a
 * ledger key nothing writes must come back EMPTY, so a regex matching everything is
 * caught), and non-vacuity floors. Without that step a regex that silently stopped
 * matching would pass every assertion below on an empty measurement — which is exactly
 * how the census blindness this estate has already paid for came to be believed cured.
 *
 * TO COMPLY when this reds:
 *   - added a mint door → stamp at it (or route it through the shared mint loop) and
 *     add it to MINT_MODULES in the SAME commit.
 *   - added a module that rewrites an existing treaty without minting → add it to
 *     REWRITE_MODULES with a reason a reviewer can disagree with.
 *   - moved or renamed the stamp writer → update STAMP_WRITER; the symbol is the join.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The one writer of `sworn`, addressed as module#symbol so a rename cannot pass. */
const STAMP_WRITER = Object.freeze({
  module: 'src/domain/worldPulse/oathHolder.js',
  symbol: 'stampSworn',
});

/**
 * THE MINT DOORS, by module. Each of these authors a NEW treaty record and therefore
 * owes a signature line. The per-module door symbols are named so a reader can find
 * them and so a door that is renamed out of existence reds here rather than rotting.
 */
const MINT_MODULES = Object.freeze({
  'src/domain/worldPulse/peaceTerms.js': Object.freeze({
    doors: Object.freeze(['mintTreaty', 'mintTreatyFromCarriedSheet']),
    why: 'THE HEAD, and TWO doors rather than one: the live-appraisal war mint and the'
      + ' carried-sheet mint. Both are module-private and both are reached only from'
      + " advanceTreaties' PASS 1 loop, which is where the stamp is applied — deliberately,"
      + ' because the mint-effects closure each road builds is defined TWICE and an arm'
      + ' added inside it would be two spellings of one law. The loop is where the roads meet.',
  }),
  'src/domain/worldPulse/peaceTermsSale.js': Object.freeze({
    doors: Object.freeze(['mintSovereigntySaleTreaties']),
    why: 'THE THIRD DOOR (WR-10 amendment S): a victor-free peacetime mint with no war in'
      + ' it. It is the door the GRAMMAR volume did not know about — the volume says "both'
      + ' doors" and the tree has three — which is the whole reason this walker measures the'
      + ' set instead of trusting a sentence.',
  }),
});

/**
 * Modules that write the treaties ledger WITHOUT minting. They rewrite records that were
 * already signed, so a stamp here would be a second signature on somebody else's oath.
 */
const REWRITE_MODULES = Object.freeze({
  'src/domain/worldPulse/treatyBreach.js': 'REPUDIATION, not a mint. It rewrites a treaty'
    + ' that already exists — the breach is recorded ONTO the instrument the parties'
    + ' already swore — so the signature line it carries is the one from its own signing'
    + ' and must not be re-stamped. Re-stamping here would let a repudiation quietly'
    + ' re-attribute an oath to whoever holds the seat on the day it was broken, which is'
    + " precisely the history-rewrite the oath law forbids, and it would pre-empt GR-4's"
    + ' succession question by answering it in the wrong module.',
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SOURCES = walk(join(ROOT, 'src')).map((p) => ({
  rel: relative(ROOT, p).replace(/\\/g, '/'),
  src: readFileSync(p, 'utf8'),
}));

/**
 * Every module writing `setSpatialLedger(<state>, '<key>', …)`, as key -> files. The
 * shape mirrors the satellites-authority census so the two read the same way.
 * @param {ReadonlyArray<{rel: string, src: string}>} files
 * @returns {Map<string, string[]>}
 */
export function ledgerWritersOf(files) {
  /** @type {Map<string, Set<string>>} */
  const writers = new Map();
  const call = /setSpatialLedger\(\s*[^,()]+,\s*'([^']+)'\s*,/g;
  for (const { rel, src } of files) {
    for (const match of src.matchAll(call)) {
      const key = match[1];
      if (!writers.has(key)) writers.set(key, new Set());
      writers.get(key).add(rel);
    }
  }
  return new Map([...writers].map(([key, set]) => [key, [...set].sort()]));
}

/** Does this module import the stamp writer by name? The import IS the reach. */
export function reachesStampWriter(src) {
  return new RegExp(`import\\s*\\{[^}]*\\b${STAMP_WRITER.symbol}\\b[^}]*\\}\\s*from`).test(src);
}

const srcOf = (rel) => SOURCES.find((f) => f.rel === rel)?.src ?? null;
const TREATY_WRITERS = ledgerWritersOf(SOURCES).get('treaties') || [];

describe('GR-1 stamp totality — guard the guard', () => {
  test('the detector finds a writer, and reds when one appears unaccounted', () => {
    const planted = [
      { rel: 'a.js', src: "setSpatialLedger(ws, 'treaties', next);" },
      { rel: 'b.js', src: "setSpatialLedger(ws, 'satellites', next);" },
      { rel: 'c.js', src: "// setSpatialLedger(ws, 'treaties', next) in a comment still reads as a write" },
    ];
    const found = ledgerWritersOf(planted);
    expect(found.get('treaties')).toEqual(['a.js', 'c.js']);
    expect(found.get('satellites')).toEqual(['b.js']);
    // The inline mutant: the same comparison must REJECT one extra file, or the exact-set
    // assertions below would tolerate a fourth door arriving unannounced.
    const declared = ['a.js'];
    expect(found.get('treaties')).not.toEqual(declared);
  });

  test('the reach detector sees the import and only the import', () => {
    expect(reachesStampWriter("import { stampSworn } from './oathHolder.js';")).toBe(true);
    expect(reachesStampWriter("import { swornPartiesOf, stampSworn } from './oathHolder.js';")).toBe(true);
    // A module that merely NAMES the writer in prose has not reached it. This is the
    // difference between a door that stamps and a door with a comment about stamping.
    expect(reachesStampWriter('// stampSworn is called by the head')).toBe(false);
    expect(reachesStampWriter("import { swornPartiesOf } from './oathHolder.js';")).toBe(false);
  });

  test('the live scan is non-vacuous, and a key nothing writes comes back empty', () => {
    expect(SOURCES.length).toBeGreaterThan(200);
    // POSITIVE CONTROL: the head is a treaty writer by everyone's account. If the scan
    // stopped matching, every absence claim below would be worthless and this reds first.
    expect(TREATY_WRITERS).toContain('src/domain/worldPulse/peaceTerms.js');
    // DISCRIMINATING CONTROL: a regex that matched everything would report writers here.
    expect(ledgerWritersOf(SOURCES).get('treaties_no_such_ledger')).toBeUndefined();
  });
});

describe('GR-1 stamp totality — every mint door signs', () => {
  test('the stamp writer lives where the registry says, under the name it claims', () => {
    const src = srcOf(STAMP_WRITER.module);
    expect(src, `${STAMP_WRITER.module} has moved — re-aim this walker at its new home`).toBeTruthy();
    expect(src).toContain(`export function ${STAMP_WRITER.symbol}(`);
  });

  test('every declared mint door still exists in its module, by SYMBOL', () => {
    // Navigate by symbol, never by line: a door renamed or extracted is exactly the
    // change that would silently drop a stamp, and the doors are module-private so
    // nothing else in the estate would notice.
    for (const [module, entry] of Object.entries(MINT_MODULES)) {
      const src = srcOf(module);
      expect(src, `declared mint module ${module} does not exist`).toBeTruthy();
      for (const door of entry.doors) {
        expect(src, `${module}: the declared mint door ${door} is gone`)
          .toMatch(new RegExp(`function\\s+${door}\\s*\\(`));
      }
      expect(entry.why.length, `${module}: a door registry entry must say WHY`).toBeGreaterThan(120);
    }
  });

  test('EVERY treaty-ledger writer is a signing mint door or a declared rewriter', () => {
    const unaccounted = TREATY_WRITERS.filter((rel) => !(rel in MINT_MODULES) && !(rel in REWRITE_MODULES));
    expect(
      unaccounted,
      'a module writes the treaties ledger and is in neither list. If it MINTS, stamp it'
      + ' (or route it through the shared mint loop) and add it to MINT_MODULES in this'
      + ' commit; if it only rewrites an existing instrument, add it to REWRITE_MODULES'
      + ' with a reason. Never leave it out: an unsigned mint door is invisible everywhere else.',
    ).toEqual([]);
    // Both lists are EXACT, so an entry that outlived its module reds too.
    const stale = [...Object.keys(MINT_MODULES), ...Object.keys(REWRITE_MODULES)]
      .filter((rel) => !TREATY_WRITERS.includes(rel));
    expect(stale, 'a declared treaty-ledger writer no longer writes it — delete its entry').toEqual([]);
  });

  test('every mint module reaches the ONE stamp writer', () => {
    const silent = Object.keys(MINT_MODULES).filter((rel) => !reachesStampWriter(srcOf(rel) || ''));
    expect(
      silent,
      'a mint door does not reach the stamp writer, so treaties minted by that road carry'
      + ' no signature line while treaties minted by the others do — the exact split this'
      + ' walker exists to forbid.',
    ).toEqual([]);
    // ANCHOR: the reach is measured, not assumed. At least one module really does import
    // it, so the emptiness above is compliance rather than a detector that stopped seeing.
    expect(Object.keys(MINT_MODULES).filter((rel) => reachesStampWriter(srcOf(rel) || '')).length)
      .toBe(Object.keys(MINT_MODULES).length);
    expect(Object.keys(MINT_MODULES).length).toBeGreaterThanOrEqual(2);
  });

  test('a REWRITER does not stamp — a second signature on somebody else\'s oath', () => {
    for (const [rel, why] of Object.entries(REWRITE_MODULES)) {
      expect(why.length, `${rel}: a rewriter exemption must carry a reviewable reason`).toBeGreaterThan(150);
      // anchored: the mint-module reach test above proves this same detector returns TRUE for modules that do import the writer, so a false here is a measured absence rather than a dead detector.
      expect(reachesStampWriter(srcOf(rel) || ''), `${rel} stamps, but it is declared a rewriter`).toBe(false);
    }
  });
});
