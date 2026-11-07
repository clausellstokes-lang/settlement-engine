/**
 * CENSUS-4f unit 6 (this lane's own leftover, found by unit 3's read): NPC_WANTS's three declaring
 * lines (the phase-A ledger) were ledgered and never applied, so the birth self-check could not see
 * them. Measured on the 1,000 at the merged tip: "a dockhand's oilskins…" false in 48 of 81 prints
 * (no docks), the shrine vestments 17 of 151 (on the ledger's `temple`), the guild colours 2 of 146.
 * The rows declare in place (`{ text, needs }`; religious#4 re-read under R-AE: the shrine a priest
 * serves is a `sacredHouse`, not the narrow `temple`), and the draw `npcGenerator.js ::
 * generateNPCAppearance` — an R site the mechanism lane has not wired — reads its pick through
 * `textOf` (R-C), byte-identical: carried, enforced when the site is wired.
 */
import { describe, expect, it } from 'vitest';
import { NPC_WANTS } from '../../src/data/npcData.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const DECLARED = Object.freeze({
  "a dockhand's oilskins over hands too clean for the work": ['docks'],
  'guild colours worn with pride': ['guild'],
  'vestments a size too grand for the shrine they serve': ['sacredHouse'],
});

describe('NPC_WANTS declarations (CENSUS-4f unit 6)', () => {
  it('(a) the three ledgered lines declare in place, and only they', () => {
    const rows = Object.values(NPC_WANTS).flat();
    const declared = rows.filter((r) => typeof r === 'object' && r.colour !== true);
    expect(Object.fromEntries(declared.map((r) => [r.text, r.needs]))).toEqual(DECLARED);
    // CENSUS-4h unit 4 (R-AO): every other want is phase A's read colour row, `{ text, colour: true }` (was a bare string)
    expect(rows.filter((r) => typeof r === 'object' && r.colour === true && Object.keys(r).length === 2).length).toBe(rows.length - 3);
  });

  it('(b) the draw stores the text, and since CENSUS-1i unit 6 resolves a refused want: soak1k-9 (no docks) no longer prints the oilskins', async () => {
    // re-keyed by CENSUS-1i unit 6 (the site wired through drawDeclared): soak1k-9 drew the oilskins
    // with no docks on its record; the refused want now resolves to an admitted one, stored as a string.
    await ensureLaws();
    const { settlement } = birth(9);
    const clothes = (settlement.npcs || []).map((n) => n?.physical?.clothes);
    expect(clothes.length, 'the birth is crewed').toBeGreaterThan(0);
    expect(clothes).not.toContain("a dockhand's oilskins over hands too clean for the work"); // anchored: the line above proves the clothes are read
    expect(clothes.every((c) => typeof c === 'string')).toBe(true);
  });
});
