/**
 * militaryColumnRelease.test.js — WC-0B acceptance B1..B5 for the column-class union and
 * the release fork in `src/domain/spatial/migration.js`.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes NONE of the three negated
 * membership forms that walker scans for, and this notice is WORDED rather than quoting
 * them — quoting the forms to say they are absent is itself a violation, as this train's
 * WC-0A member discovered by being convicted for it.
 *
 * ⭐ EVERY REFUSAL HERE CARRIES A LIVE ANCHOR. A column that stays on the road proves
 * nothing unless something else in the same call DID land: a dormant no-op holds every
 * column too. Each case therefore asserts a released column first, and only then the held
 * one — the idiom `demographicsMigration.test.js` established for this exact ledger.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  DEMOGRAPHIC_COLUMN_CLASSES,
  MILITARY_COLUMN_CLASSES,
  COLUMN_CLASSES,
  isDemographicColumn,
  isMilitaryColumn,
  releaseArrivals,
  enqueueColumns,
} from '../../src/domain/spatial/migration.js';

const MIGRATION_SOURCE = fileURLToPath(
  new URL('../../src/domain/spatial/migration.js', import.meta.url),
);
const MIGRATION_DIR = dirname(MIGRATION_SOURCE);

/**
 * Re-point a copied module's RELATIVE imports at the real sibling files, so a copy written
 * outside the tree still loads the same dependencies the original does. Without this the
 * copy dies on `./distanceRead.js` — a startup error, which would have masqueraded as the
 * mutant failing to convict.
 */
const absolutize = (source) => source.replace(
  /from '\.\/([^']+)'/g,
  (_match, rel) => `from ${JSON.stringify(pathToFileURL(join(MIGRATION_DIR, rel)).href)}`,
);

/** A column record in the shape the ledger persists. */
const column = (extra) => ({
  originId: 'Ahold', destId: 'Bhold', arrivals: 40, departTick: 1, arrivalTick: 2, ...extra,
});

/** A world with the spatial marker lit and the given migration ledger. */
const worldWith = (ledger) => ({ spatialCanonVersion: 1, spatialLedgers: { migration: ledger } });

describe('WC-0B · the column-class union and the three-way release fork', () => {
  it('holds three military classes and freezes the totality union of both lists', () => {
    // THREE, not two. `reinforcement_column` is the OUTBOUND member an earlier drafting
    // had no room for — and because the class is part of the column KEY, a classless
    // military column would have collided with a demographic one on the same
    // origin/dest/tick.
    expect(MILITARY_COLUMN_CLASSES).toEqual([
      'reinforcement_column', 'shed_column', 'veteran_return',
    ]);
    expect(DEMOGRAPHIC_COLUMN_CLASSES).toEqual(['refugee', 'voluntary']);
    expect(COLUMN_CLASSES).toEqual([
      'refugee', 'voluntary', 'reinforcement_column', 'shed_column', 'veteran_return',
    ]);
    for (const list of [MILITARY_COLUMN_CLASSES, DEMOGRAPHIC_COLUMN_CLASSES, COLUMN_CLASSES]) {
      expect(Object.isFrozen(list)).toBe(true);
    }
    // The union is exactly both lists and the two are disjoint — a class in both would
    // make the discriminator ambiguous rather than three-way.
    expect([...COLUMN_CLASSES].sort()).toEqual(
      [...DEMOGRAPHIC_COLUMN_CLASSES, ...MILITARY_COLUMN_CLASSES].sort(),
    );
    expect(DEMOGRAPHIC_COLUMN_CLASSES.filter((c) => MILITARY_COLUMN_CLASSES.includes(c))).toEqual([]);
    expect(new Set(COLUMN_CLASSES).size).toBe(COLUMN_CLASSES.length);
  });

  it('holds a reinforcement_column in transit instead of releasing it into M4 arrivals', () => {
    const crisis = column({ arrivals: 77 });
    const reinforcement = column({ arrivals: 33, travelClass: 'reinforcement_column' });
    const released = releaseArrivals(
      worldWith({ 'Ahold:Bhold:1': crisis, 'Ahold:Bhold:1:reinforcement_column': reinforcement }),
      5,
    );
    // ANCHOR FIRST: the unclassed column DID land, so the pass ran and the refusal below
    // is a refusal rather than a dormant no-op.
    expect(released.arrivals).toEqual([{ destId: 'Bhold', count: 77, originIds: ['Ahold'] }]);
    expect(released.next['Ahold:Bhold:1'] ?? null).toBe(null);
    // ⭐ THE RELEASE-FORK PIN, DIRECTION ONE. Lent troops must not be credited to the
    // destination's POPULATION as an ordinary migration arrival: that lands them outside
    // arrival / arrive_home / shed, where WC-6's conservation walker cannot see them.
    expect(released.next['Ahold:Bhold:1:reinforcement_column']).toEqual(reinforcement);
    expect(released.arrivals.reduce((n, a) => n + a.count, 0)).toBe(77);
  });

  it('reds direction one when the widening is omitted: the guard alone is what holds it', async () => {
    // ⭐⭐ THE EXECUTED RED PROOF. A guard that cannot be reddened has not been shown to
    // guard anything, and the byte-identity of this landing is NOT what makes it safe —
    // no producer stamps a military class until WC-6 mints one, which is a different
    // claim. This restores the release guard to the demographic predicate alone in a COPY
    // of the real source and requires the planted column to be RELEASED there.
    const source = readFileSync(MIGRATION_SOURCE, 'utf8');
    const unwidened = source.replace(
      'if (isDemographicColumn(col) || isMilitaryColumn(col)) { next[key] = col; continue; }',
      'if (isDemographicColumn(col)) { next[key] = col; continue; }',
    );
    expect(unwidened).not.toBe(source); // the plant actually landed
    const path = join(mkdtempSync(join(tmpdir(), 'wc0b-')), 'migration.unwidened.mjs');
    writeFileSync(path, absolutize(unwidened));
    const mutated = await import(pathToFileURL(path).href);

    const reinforcement = column({ arrivals: 33, travelClass: 'reinforcement_column' });
    const out = mutated.releaseArrivals(
      worldWith({ 'Ahold:Bhold:1:reinforcement_column': reinforcement }), 5,
    );
    // Under the un-widened guard the lent troops ARE credited to Bhold's population.
    expect(out.arrivals).toEqual([{ destId: 'Bhold', count: 33, originIds: ['Ahold'] }]);
    expect(out.next?.['Ahold:Bhold:1:reinforcement_column'] ?? null).toBe(null);

    // Non-vacuity: an UNMODIFIED copy imported the same way still HOLDS it, so the release
    // above is the missing widening and not the copying.
    const controlPath = join(mkdtempSync(join(tmpdir(), 'wc0b-')), 'migration.control.mjs');
    writeFileSync(controlPath, absolutize(source));
    const control = await import(pathToFileURL(controlPath).href);
    const held = control.releaseArrivals(
      worldWith({ 'Ahold:Bhold:1:reinforcement_column': reinforcement }), 5,
    );
    expect(held.arrivals).toEqual([]);
    expect(held.next['Ahold:Bhold:1:reinforcement_column']).toEqual(reinforcement);
  });

  it('discriminates three ways and still fails closed toward M4 on a class it never heard of', () => {
    const legacy = column({ arrivals: 11 });
    const unknown = column({ arrivals: 12, travelClass: 'pilgrim_train' });
    const demographic = column({ arrivals: 13, travelClass: 'refugee' });
    const military = column({ arrivals: 14, travelClass: 'veteran_return' });
    const released = releaseArrivals(worldWith({
      'Ahold:Bhold:1': legacy,
      'Ahold:Bhold:1:pilgrim_train': unknown,
      'Ahold:Bhold:1:refugee': demographic,
      'Ahold:Bhold:1:veteran_return': military,
    }), 5);

    // RELEASED — unclassed-legacy (unchanged behaviour) and an unheard-of class. The
    // pre-existing docstring promises exactly this: a column with no class, or a class this
    // module has never heard of, is M4's. That direction is what makes the widening safe
    // against every save written before it.
    expect(released.arrivals).toEqual([{ destId: 'Bhold', count: 23, originIds: ['Ahold'] }]);
    expect(released.next['Ahold:Bhold:1'] ?? null).toBe(null);
    expect(released.next['Ahold:Bhold:1:pilgrim_train'] ?? null).toBe(null);
    // HELD — the demographic lane (unchanged) and the military lane (new).
    expect(released.next['Ahold:Bhold:1:refugee']).toEqual(demographic);
    expect(released.next['Ahold:Bhold:1:veteran_return']).toEqual(military);

    // And the two predicates agree with the two lists, each failing closed on garbage.
    for (const bad of [null, undefined, 'refugee', 42, {}, { travelClass: 'pilgrim_train' }]) {
      expect(isMilitaryColumn(bad)).toBe(false);
    }
    for (const cls of MILITARY_COLUMN_CLASSES) {
      expect(isMilitaryColumn({ travelClass: cls })).toBe(true);
      expect(isDemographicColumn({ travelClass: cls })).toBe(false);
    }
    for (const cls of DEMOGRAPHIC_COLUMN_CLASSES) {
      expect(isDemographicColumn({ travelClass: cls })).toBe(true);
      expect(isMilitaryColumn({ travelClass: cls })).toBe(false);
    }
  });

  it('keeps the class part of the column KEY, so a military and a refugee column never collide', () => {
    const dispatch = { originId: 'Ahold', destId: 'Bhold', travellers: 10, roadDeaths: 0, arrivals: 10, arrivalTick: 4 };
    const refugeePlan = { originId: 'Ahold', dispatches: [dispatch], mode: 'disperse', travelClass: 'refugee' };
    const militaryPlan = { originId: 'Ahold', dispatches: [dispatch], mode: 'disperse', travelClass: 'reinforcement_column' };

    const afterRefugee = enqueueColumns({}, refugeePlan, 1);
    const afterBoth = enqueueColumns(afterRefugee, militaryPlan, 1);

    // ⛔ DIFFERENT KEYS. Same origin, same destination, same tick — and the class suffix is
    // what keeps them two records instead of one. Without it the survivor's class would
    // decide which lane released BOTH.
    expect(Object.keys(afterBoth).sort()).toEqual([
      'Ahold:Bhold:1:refugee', 'Ahold:Bhold:1:reinforcement_column',
    ]);
    expect(afterBoth['Ahold:Bhold:1:refugee'].travelClass).toBe('refugee');
    expect(afterBoth['Ahold:Bhold:1:reinforcement_column'].travelClass).toBe('reinforcement_column');
    expect(afterBoth['Ahold:Bhold:1:refugee'].arrivals).toBe(10);
    expect(afterBoth['Ahold:Bhold:1:reinforcement_column'].arrivals).toBe(10);

    // An M4 plan carries no class and keeps the bare key it always had — the unclassed
    // path is byte-identical, which is what makes the widening additive.
    const bare = enqueueColumns({}, { originId: 'Ahold', dispatches: [dispatch], mode: 'disperse' }, 1);
    expect(Object.keys(bare)).toEqual(['Ahold:Bhold:1']);
    expect(bare['Ahold:Bhold:1'].travelClass ?? null).toBe(null);
  });
});
