/**
 * lawBandTable.walker.test.js — WC-0C's cured C3 fence: the law-band curve table stays
 * SINGULAR, and no consumer carries a private one.
 *
 * ⛔⛔ THIS FENCE REPLACES A DOUBLE VACUITY, AND BOTH HALVES WERE EXECUTED BEFORE IT WAS
 * WRITTEN. `DESIGN_FP_ARCH_WC.md` §3 authors a single device:
 *
 *     MATCHES     /LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE$/, plus any module
 *                 exporting registerLawBandCurve
 *     EXCLUDES    LAW_WORDS and LAW_WORD_EDGES (lawWord.js)
 *     ASSERTS     at most one exporting module
 *     NON-VACUITY the scan must FIND lawWord.js's excluded pair
 *
 * Run verbatim over every `export const` in `src/`, its candidate pool was EMPTY, and the
 * authored pattern cannot match its own exclusion list — so the non-vacuity arm could never
 * pass, and the EXCLUDES clause subtracted from an empty set. One device was asked to prove
 * two separable things: that the extractor can see `export const` at all, and that the
 * exclusion list is live. This fence separates them into a GUARD pool and a CONTROL pool,
 * and expresses the exclusion as a DISJOINTNESS ASSERTION rather than as a subtraction.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/lint file starts at
 * ceiling ZERO against the frozen roster. This file is the shape that most wants a bare
 * negated-membership assertion and writes none; every negative is `toEqual([])` or
 * `toBe(false)`, both free. The notice is worded rather than quoting the scanned forms.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(REPO, 'src');

/** THE GUARD POOL — the curve table this fence exists to keep singular. */
const GUARD = /^(?:LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE)$/;
/**
 * THE CONTROL POOL — the same DECLARATION SHAPE in the same neighbourhood, chosen because
 * it is provably non-empty. It proves the EXTRACTOR is alive. It is not a filter and
 * nothing is subtracted from it.
 *
 * ⛔ THE LAW-WORD HALF ONLY, AND THE NARROWING IS THE WHOLE POINT OF ARM 3. The packet
 * drafted this pool as `/^LAW_(?:WORD|BAND)[A-Z0-9_]*$/` and asserted it DISJOINT from
 * GUARD — both true at a base where no `LAW_BAND_*` identifier existed anywhere. This
 * member lands the first one. With the `BAND` alternation the control pool admits
 * `LAW_BAND_KEYS` and `LAW_BAND_AXIS`, which GUARD also admits BY DESIGN, so the two pools
 * overlap by construction the moment the guard's own subject exists — and they would
 * overlap harder at WC-8 and WC-9, whose curve identifiers GUARD is built to catch. The
 * disjointness arm would have been a permanent red, or deleted to make it pass.
 *
 * Narrowed to the law-WORD vocabulary, the control pool is disjoint from GUARD FOREVER
 * rather than only until the mint, and it loses nothing it was for: it is still the same
 * `export const` shape, still in the same neighbourhood, and still provably non-empty at
 * three identifiers across two modules.
 */
const CONTROL = /^LAW_WORD[A-Z0-9_]*$/;

/** The canonical table itself — the ONE module the guard pool may lawfully contain. */
const CANONICAL_TABLE = 'src/domain/worldPulse/lawBandModulation.js';

/**
 * THE C3 LEGACY SET — CLOSED AT TWO, SHRINK-ONLY, BY EXACT MODULE IDENTITY.
 * §8.1 row 2's contract ("none may carry a private table") was breached before WC existed,
 * by two modules a NAME-keyed fence cannot see: `habitCurve.js` builds its law-word-keyed
 * curves by `fromEntries` over a derived order, and `espionageDoctrine.js` carries two
 * literal tables. They are recorded rather than repaired — WC does not rewrite another
 * volume's landed module, and a breach that is enumerated is not a breach that is hidden.
 * ⛔ NOTHING JOINS THIS LIST. A third private table is a STOP and a chair question, never a
 * third row.
 */
const C3_LEGACY = Object.freeze([
  'src/domain/worldPulse/espionage/espionageDoctrine.js', // ORDER_EDGES / FREQ_BY_ORDER
  'src/domain/worldPulse/habit/habitCurve.js', // HABIT_TUNING.LEARN_RATE / .HALF_LIFE
]);
/** EXACT, BOTH DIRECTIONS — a bound that only forbids growth lets a shrink go unbanked. */
const C3_LEGACY_CEILING = 2;

/**
 * The live roster of `src/` modules importing `lawWord.js`, the canonical table excluded.
 * ⛔ PINNED EXACTLY, which is the mechanism by which a third private table "reds by name":
 * a new importer cannot be absorbed silently, it reds here and goes to the chair.
 */
const LAW_WORD_IMPORTERS = Object.freeze([
  'src/domain/worldPulse/espionage/espionageDoctrine.js',
  'src/domain/worldPulse/habit/habitCurve.js',
  'src/domain/worldPulse/warSeatBooks.js',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.js$/.test(full) && !/\.test\./.test(full)) out.push(full);
  }
  return out;
}

/**
 * Blank every comment, preserving line count.
 * ⛔ LINE-PRESERVING BY CONSTRUCTION, AND ASSERTED SO BELOW. This fence reports `file:line`,
 * and the landed HB-1 walker's own mask collapses what it removes, so its blob stops being
 * line-addressable and every address it prints afterwards is wrong. That defect is
 * INHERITED here as a lesson, not as code: it is docketed for infra as HB-1's own
 * one-character fix and is not proposed as a WC edit.
 */
function codeOnly(source) {
  const blank = (match) => match.replace(/[^\n]/g, ' ');
  return source.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^[ \t]*\/\/.*$/gm, blank);
}

/** Every `src/` module as `{ path, code }`, plus any planted overlay entries. */
function corpus(overlay = []) {
  const live = walk(SRC).map((full) => ({
    path: relative(REPO, full).split('\\').join('/'),
    code: codeOnly(readFileSync(full, 'utf8')),
  }));
  return [...live, ...overlay.map((o) => ({ path: o.path, code: codeOnly(o.code) }))];
}

/** `{ path, id }` for every `export const <ID>` whose identifier the pattern admits. */
function identifiers(pattern, overlay = []) {
  const out = [];
  for (const file of corpus(overlay)) {
    for (const line of file.code.split('\n')) {
      const match = /^export const ([A-Za-z0-9_$]+)/.exec(line);
      if (match && pattern.test(match[1])) out.push({ path: file.path, id: match[1] });
    }
  }
  return out;
}

/**
 * ⭐ COUNTING IS BY MODULE, NOT BY IDENTIFIER — the volume's own word at §8.1 row 2, and the
 * unit the move half of the twin fence got wrong. It matters concretely: WC-8's
 * `LAW_BAND_COHESION_CURVE` and WC-9's `LAW_BAND_DRIFT_CURVE` will be two identifiers in ONE
 * module, and a match-counting fence would red on them.
 */
function exportingModules(pattern, overlay = []) {
  return [...new Set(identifiers(pattern, overlay).map((hit) => hit.path))].sort();
}

/** The other half of the volume's MATCHES clause: any module exporting the entry point. */
function registryModules(overlay = []) {
  return corpus(overlay)
    .filter((file) => /export (?:function|const) registerLawBandCurve/.test(file.code))
    .map((file) => file.path)
    .sort();
}

/** The guard pool as the volume defines it: the identifier half UNION the entry-point half. */
function guardPool(overlay = []) {
  return [...new Set([...exportingModules(GUARD, overlay), ...registryModules(overlay)])].sort();
}

describe('WC-0C · the law-band curve table stays singular (the cured C3 fence)', () => {
  it('holds the guard pool to the ONE canonical table, named rather than counted', () => {
    // ⚠ ARM 1, RE-DERIVED AT THIS COMMIT RATHER THAN INHERITED. The packet author measured
    // this pool EMPTY and wrote `toEqual([])` — true at a base where the canonical table did
    // not exist. This member LANDS it, and the table exports both `LAW_BAND_*` identifiers
    // and `registerLawBandCurve`, so it is the pool's first member by both halves of the
    // volume's own MATCHES clause. A named singleton is what "at most one exporting module"
    // means the moment the mint exists, and it is STRICTLY STRONGER than the empty
    // assertion: a signature gone blind returns [] and reds here, where against `toEqual([])`
    // it would have passed.
    expect(guardPool()).toEqual([CANONICAL_TABLE]);
    // ⛔ AND NEVER A BARE `<= 1`. The named list is the whole point: a pool that drifted to a
    // DIFFERENT single module would satisfy a count and reds against a name.
    expect(guardPool().length).toBeLessThanOrEqual(1);

    // ⛔⛔ BOTH HALVES OF THE MATCHES CLAUSE ARE ASSERTED SEPARATELY, so this arm cannot
    // GREEN THROUGH A BLIND EXTRACTOR. The union alone would survive one half going dark —
    // kill the identifier extractor and the entry-point half still returns the canonical
    // table, and this arm would pass while measuring nothing. That is the exact shape of the
    // defect this whole fence replaces, and C2 is its control: the two must red
    // independently.
    expect(exportingModules(GUARD)).toEqual([CANONICAL_TABLE]);
    expect(registryModules()).toEqual([CANONICAL_TABLE]);
  });

  it('proves the extractor is alive against a pool that is not empty', () => {
    // ⭐ ARM 2 — EXTRACTOR LIVENESS, the job the authored non-vacuity arm could never do.
    // Same extractor, same declaration shape, a neighbourhood that is provably populated.
    const modules = exportingModules(CONTROL);
    expect(modules).toContain('src/domain/worldPulse/lawWord.js');
    expect(identifiers(CONTROL).length).toBeGreaterThanOrEqual(2);
    expect(identifiers(CONTROL).map((hit) => hit.id)).toContain('LAW_WORDS');
    expect(identifiers(CONTROL).map((hit) => hit.id)).toContain('LAW_WORD_EDGES');

    // ⚠ THE CONTROL POOL IS ASSERTED WITH `toContain`, NOT `toEqual`, AND THE MEASUREMENT IS
    // THE ARGUMENT: `LAW_WORD_VOLATILITY` is a third neighbourhood member no WC author knew
    // about, and HB-2B moved its address under the substrate sweep. An exact control pin
    // would have red on an unrelated family's landing.
    expect(modules.length).toBeGreaterThanOrEqual(2);

    // The mask the extractor runs on is LINE-PRESERVING, so a `file:line` this fence prints
    // still points at the line that carries the offence.
    const raw = readFileSync(join(SRC, 'domain/worldPulse/lawWord.js'), 'utf8');
    expect(codeOnly(raw).split('\n').length).toBe(raw.split('\n').length);
  });

  it('keeps the two pools disjoint, which is what the EXCLUDES clause actually meant', () => {
    // ⭐ ARM 3. The volume subtracted `LAW_WORDS` and `LAW_WORD_EDGES` from a pool that never
    // contained them. Expressed as an assertion instead, it says something true and
    // checkable: no CONTROL identifier is admitted by GUARD.
    expect(identifiers(CONTROL).filter((hit) => GUARD.test(hit.id))).toEqual([]);
    expect(GUARD.test('LAW_WORDS')).toBe(false);
    expect(GUARD.test('LAW_WORD_EDGES')).toBe(false);
    expect(GUARD.test('LAW_WORD_VOLATILITY')).toBe(false);
    // Non-vacuity in the other direction: GUARD is not simply inert.
    expect(GUARD.test('LAW_BAND_COHESION_CURVE')).toBe(true);
    expect(GUARD.test('RELAY_MODULATION_TABLE')).toBe(true);
  });

  it('reds on a SECOND exporting module and stays green on one, counting by module', () => {
    // ⭐ ARMS 4 + 5. A fence whose only observed state is "one" has never been shown to
    // distinguish one from two, so both are planted.
    const second = [{
      path: 'src/domain/worldPulse/relayModulation.js',
      code: 'export const LAW_BAND_RELAY_TABLE = Object.freeze({});\n',
    }];
    expect(guardPool(second)).toEqual([CANONICAL_TABLE, 'src/domain/worldPulse/relayModulation.js']);
    expect(guardPool(second).length).toBeGreaterThan(1);

    // ⭐ AND A SECOND MODULE EXPORTING ONLY THE ENTRY POINT IS CAUGHT TOO — the other half of
    // the volume's MATCHES clause, which a purely identifier-keyed fence would miss.
    const secondRegistry = [{
      path: 'src/domain/worldPulse/sneakyRegistry.js',
      code: 'export function registerLawBandCurve() { return null; }\n',
    }];
    expect(guardPool(secondRegistry).length).toBeGreaterThan(1);

    // ⛔ TWO IDENTIFIERS IN ONE MODULE STAY GREEN. This is the case the move half of the twin
    // fence got wrong, and it is the shape WC-8 and WC-9 will actually land.
    const twoInOne = [{
      path: 'src/domain/worldPulse/futureCurves.js',
      code: 'export const LAW_BAND_COHESION_CURVE = Object.freeze({});\n'
        + 'export const LAW_BAND_DRIFT_CURVE = Object.freeze({});\n',
    }];
    expect(identifiers(GUARD, twoInOne).filter((h) => h.path.endsWith('futureCurves.js')).length).toBe(2);
    expect(guardPool(twoInOne).filter((p) => p.endsWith('futureCurves.js'))).toEqual([
      'src/domain/worldPulse/futureCurves.js',
    ]);
  });

  it('freezes the two legacy private tables by exact identity, and reds a third by name', () => {
    // ⭐ THE FROZEN LEGACY SET. Both breaches predate WC and a NAME-keyed fence cannot see
    // either: a key-shape detector finds `espionageDoctrine.js` and `lawWord.js` but NOT
    // `habitCurve.js`, which builds its map by `fromEntries` over a derived order — provably
    // blind to the very breach that motivates it. A literal-spelling detector over-matches
    // 29 modules. Only exact module identity is both non-blind and tractable.
    expect(C3_LEGACY.length).toBe(C3_LEGACY_CEILING);
    expect(C3_LEGACY_CEILING).toBe(2);
    expect(Object.isFrozen(C3_LEGACY)).toBe(true);
    expect([...C3_LEGACY].sort()).toEqual([
      'src/domain/worldPulse/espionage/espionageDoctrine.js',
      'src/domain/worldPulse/habit/habitCurve.js',
    ]);

    // NON-VACUITY: both frozen rows name modules that are actually live and actually import
    // the law ladder. A frozen row pointing at a deleted module is a row that guards nothing.
    const importers = corpus()
      .filter((file) => /from\s+'[^']*lawWord\.js'/.test(file.code))
      .map((file) => file.path)
      .filter((path) => path !== CANONICAL_TABLE)
      .sort();
    expect(importers).toEqual([...LAW_WORD_IMPORTERS].sort());
    for (const legacy of C3_LEGACY) expect(importers).toContain(legacy);

    // ⛔ AND THE CEILING IS EXACT IN BOTH DIRECTIONS, on the estate's twice-learned reason: a
    // bound that only forbids growth lets a SHRINK go unbanked and leaves free slots behind
    // it. If a legacy table is later dissolved, the win is banked in the diff rather than
    // becoming invisible headroom.
    expect(C3_LEGACY.length).toBeGreaterThanOrEqual(C3_LEGACY_CEILING);
    expect(C3_LEGACY.length).toBeLessThanOrEqual(C3_LEGACY_CEILING);

    // A THIRD PRIVATE TABLE REDS BY NAME rather than being absorbed: it arrives as a new
    // importer of the law ladder, and the roster above is pinned exactly.
    const thirdTable = [{
      path: 'src/domain/worldPulse/newFamilyCurves.js',
      code: "import { LAW_WORDS } from './lawWord.js';\nexport const FAMILY_TUNING = { lawful: null };\n",
    }];
    const withThird = corpus(thirdTable)
      .filter((file) => /from\s+'[^']*lawWord\.js'/.test(file.code))
      .map((file) => file.path)
      .filter((path) => path !== CANONICAL_TABLE)
      .sort();
    expect(withThird.length).toBe(LAW_WORD_IMPORTERS.length + 1);
    expect(withThird).toContain('src/domain/worldPulse/newFamilyCurves.js');
  });
});
