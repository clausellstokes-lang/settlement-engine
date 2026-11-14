/**
 * THE CRIMINAL STRUCTURE IS NEVER "NOTHING ORGANIZED" BESIDE A NETWORK (lane RUNG1-TRUTH unit E2,
 * 2026-11-04; docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 16, A-06's residue; the chair's ruling 2).
 *
 * `defenseDisplay.js :: deriveCriminalStructure` read institution NAMES against a keyword ladder
 * that knows neither "Street gang" nor "Underground network", and never the power roster, so
 * soak1k-759 (a town with a street gang) and soak1k-393 (a Thieves' Guild faction holding power
 * with no premises) both read null, and the Defense desk printed DS-DEF-4's
 * "structure null (nothing organized recognized)" pool: "No criminal infrastructure has been
 * identified at {settlement}." The fact now also reads the roster's criminal factions and the
 * estate's one criminal-institution detector (`corruption.js :: isCriminalInstitution`); where
 * either exists the structure is one of the pool's existing three keys. No pool text changes.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { criminalStructurePoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';

const NULL_POOL = 'structure null (nothing organized recognized)';

describe('the criminal structure reads the roster and the one detector', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-393: a Thieves\' Guild faction with no premises is an organized structure', () => {
    const { settlement } = birth(393);
    expect(settlement.powerStructure.factions.some((f) => f.category === 'criminal')).toBe(true);
    expect(deriveCriminalStructure(settlement)?.key).toBe('organized');
    expect(criminalStructurePoolKey(deriveCriminalStructure(settlement)?.key)).not.toBe(NULL_POOL);
  });

  it('soak1k-759: a street gang is a semi-organized structure', () => {
    const { settlement } = birth(759);
    expect(deriveCriminalStructure(settlement)?.key).toBe('semi-organized');
  });

  it('a place with no criminal house and no criminal faction still reads null', () => {
    const place = { institutions: [{ name: 'Parish church', category: 'Religious' }], powerStructure: { factions: [{ faction: 'Elder Council', category: 'government' }] } };
    expect(deriveCriminalStructure(place)).toBeNull();
    expect(criminalStructurePoolKey(null)).toBe(NULL_POOL);
  });

  it('the name ladder still answers first: a thieves\' guild chapter is organized', () => {
    expect(deriveCriminalStructure({ institutions: [{ name: "Thieves' guild chapter", category: 'Criminal' }] })?.key).toBe('organized');
  });

  // 5b (W2-A-LEAVES, 2026-11-12; the second wave's ruling): "Diffuse, no gang" printed beside a criminal power
  // (2 of the census's 720: r2s-indebted-town-1, r2s-succession_void-town-1). The ladder read a fence's house as
  // diffuse and never asked the roster. A gang is a gang: the crime signal's factions OUTRANK the name ladder.
  it('5b: a criminal faction outranks the name ladder — a fence beside a thieves\' guild power is organized', () => {
    const place = {
      institutions: [{ name: 'Fence network', category: 'Criminal' }],
      powerStructure: { factions: [{ faction: "Thieves' Guild", category: 'criminal', power: 20 }] },
    };
    expect(deriveCriminalStructure(place)?.key).toBe('organized');
    // the control: the same fence with no criminal power is still diffuse
    expect(deriveCriminalStructure({ institutions: place.institutions, powerStructure: { factions: [] } })?.key).toBe('diffuse');
  });
});
