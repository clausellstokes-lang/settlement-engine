/**
 * seedLedgerDensity.test.js — SK-6's proof surface (sk-b; ODQ §143.4).
 *
 * The ledger's failure mode is SURVIVORSHIP BIAS, and it is subtle: every individual rule
 * looks reasonable, and together they can make the instrument measure its own history. The
 * three arms that stop it are pinned with the fixtures that would otherwise let them rot —
 * a cancelled run leaving the ledger byte-identical, a known finding not re-counting, and
 * ordering that never truncates the tail.
 */

import { describe, expect, it } from 'vitest';

import {
  CREDITING_STATUS,
  HALF_LIFE_BAND,
  NON_CREDITING_STATUSES,
  assertHomeWritable,
  capsulesRoot,
  decayedDensity,
  densityKey,
  emptyLedger,
  findingKey,
  ledgerPath,
  orderCells,
  recordRun,
  resolveStateHome,
} from '../../scripts/soak/seedLedger.mjs';

const cell = (seed, rowId = 'preset') => ({ seed, years: 30, settlements: 4, rowId });
const firing = (id, forCell, tickBand = '0-51') => ({ id, cell: forCell, tickBand });

describe('the sensitive-seed ledger', () => {
  it('the home is outside both trees, outside every archive, and overridable', () => {
    expect(resolveStateHome({ XDG_STATE_HOME: '/xdg' })).toBe('/xdg/settlementforge/soak');
    expect(resolveStateHome({}, '/home/o')).toBe('/home/o/.local/state/settlementforge/soak');
    // A lane that needs isolation overrides it explicitly — one spelling, one override.
    expect(resolveStateHome({ SETTLEMENTFORGE_SOAK_STATE: '/lane/state/' })).toBe('/lane/state');
    expect(ledgerPath('/s')).toBe('/s/seed-ledger.json');
    expect(capsulesRoot('/s')).toBe('/s/capsules');
    // ⛔ AN UNWRITABLE HOME IS A HARD REFUSAL THAT NAMES THE PATH — never a silent
    // fallback. "Could not write the ledger" without a path is unactionable.
    expect(assertHomeWritable('/s', () => true)).toEqual([]);
    const refusal = assertHomeWritable('/s', () => false);
    expect(refusal.length).toBe(1);
    expect(refusal[0]).toContain('/s');
    expect(refusal[0]).toContain('HARD REFUSAL');
  });

  it('keys are the FULL cell identity, never the bare seed', () => {
    expect(densityKey(cell('w0'))).toBe('w0::30::4::preset');
    // Two cells on ONE seed under different config rows are DIFFERENT keys. A bare-seed
    // key would smear their density together and rank a seed for a finding that only ever
    // happened under one configuration.
    expect(densityKey(cell('w0', 'maximal'))).not.toBe(densityKey(cell('w0', 'preset')));
    expect(findingKey(firing('unbounded_growth', cell('w0')), cell('w0')))
      .toBe('unbounded_growth|w0::30::4::preset|0-51');
  });

  it('⛔ a CANCELLED or SUPERSEDED run leaves the ledger BYTE-IDENTICAL', () => {
    const before = emptyLedger();
    before.cells['w0::30::4::preset'] = { density: 2, lastRun: 1, firings: 2 };
    const snapshot = JSON.stringify(before);
    expect(CREDITING_STATUS).toBe('complete');
    for (const status of NON_CREDITING_STATUSES) {
      const result = recordRun(before, {
        status,
        cells: [cell('w0'), cell('w1')],
        findings: [firing('negative_stock', cell('w1'))],
      });
      expect(result.credited, `${status} credited density`).toBe(false);
      expect(result.reason).toContain(status);
      // BYTE-IDENTICAL, not "mostly unchanged": the run counter, the cell rows and the
      // never-fired tail all stay exactly as they were. A partial credit here would
      // inflate exactly the historic seeds and starve the tail — survivorship bias
      // manufactured by the cancellation policy itself.
      expect(JSON.stringify(result.ledger)).toBe(snapshot);
    }
    // …and the SAME run, completed, DOES credit — so the guard discriminates on status
    // rather than simply never crediting anything.
    const completed = recordRun(before, {
      status: 'complete',
      cells: [cell('w0'), cell('w1')],
      findings: [firing('negative_stock', cell('w1'))],
    });
    expect(completed.credited).toBe(true);
    expect(completed.ledger.cells['w1::30::4::preset'].density).toBe(1);
  });

  it('a KNOWN finding deduplicates against its standing capsule and never re-counts', () => {
    let ledger = emptyLedger();
    const cells = [cell('w0')];
    const known = firing('unbounded_growth', cell('w0'));
    const identity = findingKey(known, cell('w0'));

    const first = recordRun(ledger, { status: 'complete', cells, findings: [known] });
    expect(first.fresh).toEqual([identity]);
    expect(first.ledger.cells['w0::30::4::preset'].density).toBe(1);
    ledger = first.ledger;

    // The SAME wire, the SAME cell, the SAME tick band, with the capsule still open.
    // Counting it again would rank the cell by how long its one open bug has been open.
    const second = recordRun(ledger, {
      status: 'complete', cells, findings: [known], standingCapsules: [identity],
    });
    expect(second.known).toEqual([identity]);
    expect(second.fresh).toEqual([]);
    expect(second.ledger.cells['w0::30::4::preset'].density).toBe(1);

    // A DIFFERENT tick band is a different finding and DOES count — so the dedupe is
    // identity-based rather than a blanket second-firing suppressor.
    const elsewhere = firing('unbounded_growth', cell('w0'), '520-571');
    const third = recordRun(second.ledger, {
      status: 'complete', cells, findings: [elsewhere], standingCapsules: [identity],
    });
    expect(third.fresh.length).toBe(1);
    expect(third.ledger.cells['w0::30::4::preset'].density).toBe(2);
  });

  it('density decays, and the ordering NEVER truncates the never-fired tail', () => {
    expect(HALF_LIFE_BAND).toEqual({ min: 5, max: 20, default: 10, unsoaked: true });
    // ⚠ MARKED UNSOAKED (§43): no observed firing distribution exists, because nothing has
    // soaked. The marker is asserted so the figure cannot be quoted as fitted.
    expect(HALF_LIFE_BAND.unsoaked).toBe(true);
    expect(decayedDensity({ density: 4, lastRun: 0 }, 0)).toBe(4);
    expect(decayedDensity({ density: 4, lastRun: 0 }, 10)).toBe(2);
    expect(decayedDensity({ density: 4, lastRun: 0 }, 20)).toBe(1);
    // An early accident does not pin the order forever: after two half-lives a single old
    // firing ranks BELOW a fresh one.
    expect(decayedDensity({ density: 1, lastRun: 0 }, 20)).toBeLessThan(decayedDensity({ density: 1, lastRun: 20 }, 20));

    const ledger = emptyLedger();
    ledger.runs = 3;
    ledger.cells['hot::30::4::preset'] = { density: 5, lastRun: 3, firings: 5 };
    ledger.cells['warm::30::4::preset'] = { density: 1, lastRun: 3, firings: 1 };
    const cells = [cell('cold'), cell('warm'), cell('hot'), cell('never')];
    const ordered = orderCells(cells, ledger);
    expect(ordered.map((entry) => entry.seed)).toEqual(['hot', 'warm', 'cold', 'never']);
    // ⛔ THE ANTI-SURVIVORSHIP GUARD: ordering is a PERMUTATION, never a filter. Every
    // never-fired cell is still present, so a seed that has never fired can still earn its
    // first entry — the full grid always completes behind the sensitive head.
    expect(ordered.length).toBe(cells.length);
    expect(ordered.map((entry) => entry.seed).sort()).toEqual(['cold', 'hot', 'never', 'warm']);
    // The order is TOTAL and reproducible: ties break on the key, so two runs agree.
    expect(orderCells(cells, ledger).map(densityKey)).toEqual(ordered.map(densityKey));
  });
});
