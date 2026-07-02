/**
 * toggleSlice — servicesToggles key-normalization migration.
 *
 * The Stage-2b ServicesTogglePanel fix moved the servicesToggles WRITE key from
 * the display institution name (`${instName}_service_${svcName}`) to the catalog
 * service-key form (`${svcKey}_service_${svcName}`). Toggles a user persisted
 * under the OLD form are orphaned on read. `normalizeServicesToggles` (run on
 * hydrate) remaps them to the new form.
 *
 * Contracts pinned here:
 *   1. An old display-name-keyed bag is remapped to the svcKey form the panel now
 *      reads (mirrors matchServiceName), preserving each toggle value.
 *   2. Idempotent — a bag already in the new form (or one just normalized)
 *      normalizes to itself.
 *   3. Unmappable keys are DROPPED, not mis-applied.
 *   4. A genuine new-format entry wins a collision with a remapped old key.
 *   5. The hydrateServicesToggles slice action applies the pure normalization.
 */

import { describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { INSTITUTION_SERVICES } from '../../src/data/tradeGoodsData';
import { createToggleSlice, normalizeServicesToggles } from '../../src/store/toggleSlice.js';

const FORCE   = { allow: true,  force: true,  forceExclude: false };
const EXCLUDE = { allow: false, force: false, forceExclude: true  };

// Mirror of the panel's derivation, used ONLY to compute expected keys here.
function matchServiceName(instName) {
  const lower = instName.toLowerCase().split(/[\s'(),\-/]+/).filter(w => w.length > 2);
  let best = null, bestScore = 0;
  for (const key of Object.keys(INSTITUTION_SERVICES)) {
    const kw = key.toLowerCase().split(/[\s'(),\-/]+/).filter(w => w.length > 2);
    let score = 0;
    for (const kp of kw) for (const lp of lower) {
      if (kp === lp) score += 2;
      else if (kp.length > 3 && lp.startsWith(kp)) score += 1;
      else if (lp.length > 4 && kp.startsWith(lp)) score += 1;
    }
    const norm = kw.length > 0 ? score / (kw.length * 2) : 0;
    if (score > bestScore || (score === bestScore && score > 0 && norm > (bestScore / (kw.length * 2 || 1)))) {
      bestScore = score; best = key;
    }
  }
  return bestScore > 0 ? best : null;
}

describe('normalizeServicesToggles', () => {
  test('remaps old display-name keys to the svcKey form the panel reads', () => {
    // "Grand Market" and "Village Chapel" are generated display names, not
    // INSTITUTION_SERVICES keys — the old bug keyed toggles under them.
    const marketKey = matchServiceName('Grand Market');
    const chapelKey = matchServiceName('Village Chapel');
    // Precondition: these are genuinely NOT already-new-format keys.
    expect(marketKey).toBeTruthy();
    expect(chapelKey).toBeTruthy();
    expect(marketKey).not.toBe('Grand Market');
    expect(chapelKey).not.toBe('Village Chapel');

    const oldBag = {
      'Grand Market_service_Price discovery': FORCE,
      'Village Chapel_service_Poor relief':   EXCLUDE,
    };
    const out = normalizeServicesToggles(oldBag);

    expect(out).toEqual({
      [`${marketKey}_service_Price discovery`]: FORCE,
      [`${chapelKey}_service_Poor relief`]:     EXCLUDE,
    });
    // The orphaned old keys are gone.
    expect(out['Grand Market_service_Price discovery']).toBeUndefined();
  });

  test('is idempotent — already-normalized bags map to themselves', () => {
    const oldBag = {
      'Grand Market_service_Price discovery': FORCE,
      'Village Chapel_service_Poor relief':   EXCLUDE,
    };
    const once  = normalizeServicesToggles(oldBag);
    const twice = normalizeServicesToggles(once);
    expect(twice).toEqual(once);
  });

  test('passes through keys already in the new svcKey form untouched', () => {
    // "Market" IS an INSTITUTION_SERVICES key — a correctly-migrated entry.
    expect(INSTITUTION_SERVICES).toHaveProperty('Market');
    const newBag = { 'Market_service_Price discovery': FORCE };
    expect(normalizeServicesToggles(newBag)).toEqual(newBag);
  });

  test('does not corrupt new-format keys that are not matchServiceName fixed points', () => {
    // "Brothel" is a real svcKey, but matchServiceName('Brothel') !==
    // 'Brothel' (it fuzzy-prefers "Brothel (red light district)"). A naive
    // re-map would corrupt an already-correct entry; the hasOwnProperty guard
    // must leave it alone.
    expect(INSTITUTION_SERVICES).toHaveProperty('Brothel');
    expect(matchServiceName('Brothel')).not.toBe('Brothel');
    const newBag = { 'Brothel_service_Companionship': FORCE };
    const out = normalizeServicesToggles(newBag);
    expect(out).toEqual(newBag);
    // …and running again is still a no-op.
    expect(normalizeServicesToggles(out)).toEqual(newBag);
  });

  test('drops unmappable keys rather than mis-applying them', () => {
    const bag = {
      'Zzqzz Nonsense Blarg_service_Whatever': FORCE, // no fuzzy match
      'Grand Market_service_Price discovery':  EXCLUDE,
    };
    const out = normalizeServicesToggles(bag);
    const marketKey = matchServiceName('Grand Market');
    expect(out).toEqual({ [`${marketKey}_service_Price discovery`]: EXCLUDE });
  });

  test('a genuine new-format entry wins a collision with a remapped old key', () => {
    const marketKey = matchServiceName('Grand Market');
    const newEntry = { allow: true, force: false, forceExclude: false };
    const bag = {
      // Old key that remaps onto the same target as the explicit new key below.
      'Grand Market_service_Price discovery': FORCE,
      [`${marketKey}_service_Price discovery`]: newEntry,
    };
    const out = normalizeServicesToggles(bag);
    expect(out[`${marketKey}_service_Price discovery`]).toEqual(newEntry);
  });

  test('handles empty / non-object input safely', () => {
    expect(normalizeServicesToggles({})).toEqual({});
    expect(normalizeServicesToggles(null)).toEqual({});
    expect(normalizeServicesToggles(undefined)).toEqual({});
  });

  test('leaves keys without a _service_ segment untouched', () => {
    const bag = { 'weird-orphan-key': FORCE };
    expect(normalizeServicesToggles(bag)).toEqual(bag);
  });
});

describe('hydrateServicesToggles action', () => {
  test('normalizes the persisted bag in place on hydrate', () => {
    const useStore = create(immer((set, get) => createToggleSlice(set, get)));
    const marketKey = matchServiceName('Grand Market');
    useStore.getState().setServiceToggles({
      'Grand Market_service_Price discovery': FORCE,
    });
    useStore.getState().hydrateServicesToggles();
    expect(useStore.getState().servicesToggles).toEqual({
      [`${marketKey}_service_Price discovery`]: FORCE,
    });
    // Idempotent through the action too.
    useStore.getState().hydrateServicesToggles();
    expect(useStore.getState().servicesToggles).toEqual({
      [`${marketKey}_service_Price discovery`]: FORCE,
    });
  });
});
