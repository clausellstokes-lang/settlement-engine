/**
 * metropolisCatalogReachable.test.js — [generators-pipeline-5] + inventory ratchet.
 *
 * The 24 metropolis-only catalog institutions used to be invisible to every UI
 * catalog lookup: getInstitutionalCatalog('metropolis') returned only the city
 * block, and the 'all'/full-meta merges stopped at city. So no user could view,
 * require, or force-exclude any metropolis-only institution, and the generator's
 * force path was unreachable. The lookups now merge city+metropolis.
 *
 * The walker is an only-grows reachability ratchet: EVERY institution in EVERY
 * catalog tier must be reachable from getInstitutionalCatalog(tier) — so a future
 * top-tier catalog addition can never silently become unreachable again.
 *
 * ── RATCHET AMENDMENT, CH-3 §3.1 (judgment J-CH-3-1, chair-ruled) ───────────────────
 * The ratchet used to read "reachable at EVERY tier whose block names it". That was
 * the right rule while the lookups returned raw blocks, and it is the WRONG rule now.
 *
 * Ten catalog rows are authored in one tier's block and gated to a higher tier by
 * `minTier` ("author here, gate there"): nine city rows gated to metropolis and one
 * village row gated to city. `assembleInstitutions` refuses those rows below their
 * gate, so the old lookups advertised ten rows at a tier the generator would never
 * roll them at. CH-3 closes that at the READER — the lookups now apply the same gate —
 * rather than by moving the data, because both data rewrites were measured content
 * changes (deleting `minTier` moves 97 of 420 rosters; moving the rows moves 108 and
 * collides with the city's own `Smuggling network`) while the reader fix costs zero.
 *
 * So the ratchet is amended to its honest form: **reachable at every tier the row can
 * actually fire at.** It is still only-grows — a new top-tier row that no lookup
 * returns still reds — but it no longer demands reachability at a tier the engine
 * refuses. The un-gated majority (301 of 311 rows) is pinned exactly as before; the
 * gated ten are pinned to be reachable at their gate tier and ABSENT below it, which
 * is a strictly stronger statement than the old arm made about them.
 *
 * This is a deliberate contract change, not a test fixup: reverting the `lookups.js`
 * filter must red this arm.
 */

import { describe, test, expect } from 'vitest';
import {
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
} from '../../src/generators/lookups.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { TIER_ORDER, tierAtLeast } from '../../src/data/constants.js';

const namesOf = (catalog) => {
  const s = new Set();
  for (const insts of Object.values(catalog || {})) for (const n of Object.keys(insts)) s.add(n);
  return s;
};

describe('[generators-pipeline-5] metropolis catalog is reachable from the lookups', () => {
  test('the metropolis block is non-empty (assertions are not vacuous)', () => {
    expect(namesOf(institutionalCatalog.metropolis).size).toBeGreaterThan(0);
  });

  test('every metropolis-only institution is reachable via getInstitutionalCatalog("metropolis")', () => {
    const reachable = namesOf(getInstitutionalCatalog('metropolis'));
    const cityNames = namesOf(institutionalCatalog.city);
    const metroOnly = [...namesOf(institutionalCatalog.metropolis)].filter((n) => !cityNames.has(n));
    expect(metroOnly.length).toBeGreaterThan(0);
    for (const n of metroOnly) expect(reachable.has(n)).toBe(true);
  });

  test('metropolis-only institutions are reachable via the "all" and full-meta merges', () => {
    const all = namesOf(getInstitutionalCatalog('all'));
    const full = namesOf(getFullCatalogWithTierMeta());
    for (const n of namesOf(institutionalCatalog.metropolis)) {
      expect(all.has(n)).toBe(true);
      expect(full.has(n)).toBe(true);
    }
  });

  test('getInstitutionsForTier("metropolis") includes both city and metropolis names', () => {
    const set = getInstitutionsForTier('metropolis');
    for (const n of namesOf(institutionalCatalog.metropolis)) expect(set.has(n)).toBe(true);
    for (const n of namesOf(institutionalCatalog.city)) expect(set.has(n)).toBe(true);
  });

  // Inventory ratchet, amended per CH-3 §3.1 (see the header): every catalog row is
  // reachable at every tier it can actually fire at.
  test('RATCHET: every catalog institution is reachable at every tier it can fire at', () => {
    for (const tier of Object.keys(institutionalCatalog)) {
      const reachable = namesOf(getInstitutionalCatalog(tier));
      for (const [, insts] of Object.entries(institutionalCatalog[tier])) {
        for (const [n, def] of Object.entries(insts)) {
          // The generator's own gate, written the same way round as
          // assembleInstitutions.js: a row below its `minTier` cannot fire here.
          if (def.minTier && !tierAtLeast(tier, def.minTier)) continue;
          expect({ tier, name: n, reachable: reachable.has(n) }).toEqual({ tier, name: n, reachable: true });
        }
      }
    }
  });

  // The other half of the amendment, and the half that makes it a ratchet rather than
  // a weakening: a gated row must be ABSENT below its gate and PRESENT at it. Reverting
  // the lookups filter reds this arm.
  test('RATCHET: a `minTier`-gated row is absent below its gate and reachable at it', () => {
    const gated = [];
    for (const tier of Object.keys(institutionalCatalog)) {
      for (const [, insts] of Object.entries(institutionalCatalog[tier])) {
        for (const [n, def] of Object.entries(insts)) {
          if (def.minTier && !tierAtLeast(tier, def.minTier)) gated.push({ tier, name: n, minTier: def.minTier });
        }
      }
    }
    // Non-vacuity: the gated class exists and is the measured ten.
    expect(gated.length).toBe(10);

    for (const { tier, name, minTier } of gated) {
      expect({ name, tier, visible: namesOf(getInstitutionalCatalog(tier)).has(name) })
        .toEqual({ name, tier, visible: false });
      expect({ name, tier, inTierNames: getInstitutionsForTier(tier).has(name) })
        .toEqual({ name, tier, inTierNames: false });
      // …and reachable at the tier its gate names, so the fix hides nothing outright.
      expect({ name, at: minTier, visible: namesOf(getInstitutionalCatalog(minTier)).has(name) })
        .toEqual({ name, at: minTier, visible: true });
    }
  });

  // The full-meta view spans every tier, so nothing is dropped there — what CH-3 fixed
  // is the LABEL. `nativeTier` must name the earliest tier the row can fire at.
  test('full-meta `nativeTier` reports the effective tier, not the authoring block', () => {
    const full = getFullCatalogWithTierMeta();
    let gatedSeen = 0;
    for (const tier of TIER_ORDER) {
      for (const [category, insts] of Object.entries(institutionalCatalog[tier] || {})) {
        for (const [name, def] of Object.entries(insts)) {
          const entry = full[category]?.[name];
          if (!entry) continue;
          // The winner of the name merge is the LAST tier that declares it.
          expect({ name, gateHonest: tierAtLeast(entry.nativeTier, def.minTier || 'thorp') })
            .toEqual({ name, gateHonest: true });
          if (def.minTier && !tierAtLeast(tier, def.minTier)) gatedSeen++;
        }
      }
    }
    expect(gatedSeen).toBe(10);
    // The precise claim for the nine city→metropolis rows that no metropolis block
    // re-declares: the badge now says metropolis.
    expect(full.Entertainment?.['Colosseum/arena']?.nativeTier).toBe('metropolis');
    expect(full.Exotic?.['Dragon resident']?.nativeTier).toBe('metropolis');
  });
});
