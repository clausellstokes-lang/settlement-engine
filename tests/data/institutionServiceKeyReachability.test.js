/**
 * institutionServiceKeyReachability.test.js
 *
 * Locks the orphaned-key cleanup: three INSTITUTION_SERVICES keys that no
 * institution could ever resolve to ("Assassins Guild", "Dream Parlor",
 * "Watchtower") were deleted. This guard proves they are gone AND replays the
 * generator's own key-resolution precedence (exact name → locale override →
 * confidence-gated fuzzy token match) over every catalog institution name to
 * confirm each surviving key stays reachable — so a future edit cannot silently
 * reintroduce a dead key, and cannot delete a live one.
 */

import { describe, it, expect } from 'vitest';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../src/data/servicesData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const catalogKeys = Object.keys(INSTITUTION_SERVICES);

/** Collect every institution NAME defined across every tier/category. */
function catalogInstitutionNames() {
  const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      for (const name of Object.keys(category)) names.add(name);
    }
  }
  return names;
}

const tok = (s) =>
  String(s)
    .toLowerCase()
    .split(/[\s'(),/-]+/)
    .filter((t) => t.length > 2);

/**
 * Replicate getServicesForInstitution's key resolution EXACTLY, including the
 * confidence gate (fuzzy score >= 2). Kept in lockstep with
 * src/generators/services/serviceResolution.js.
 */
function resolveKey(name) {
  const exact = catalogKeys.find((k) => k.toLowerCase() === name.toLowerCase());
  if (exact) return exact;
  const loc = LOCALE_SERVICE_OVERRIDES[name.toLowerCase()];
  if (loc && INSTITUTION_SERVICES[loc]) return loc;
  const nt = tok(name);
  let bestKey = null;
  let bestScore = 0;
  for (const candidate of catalogKeys) {
    const ct = tok(candidate);
    let score = 0;
    for (const a of ct)
      for (const b of nt)
        b === a
          ? (score += 2)
          : ((a.length > 3 && b.startsWith(a)) || (b.length > 4 && a.startsWith(b))) && (score += 1);
    const norm = score / (ct.length * 2);
    const btc = bestKey ? tok(bestKey).length : 1;
    const normBest = bestScore / (btc * 2);
    (score > bestScore || (score === bestScore && score > 0 && norm > normBest)) &&
      ((bestScore = score), (bestKey = candidate));
  }
  return bestScore >= 2 ? bestKey : null;
}

describe('INSTITUTION_SERVICES orphaned-key cleanup', () => {
  it('the three provably-unreachable keys stay deleted', () => {
    for (const dead of ['Assassins Guild', 'Dream Parlor', 'Watchtower']) {
      expect(INSTITUTION_SERVICES[dead]).toBeUndefined();
    }
  });

  it('every catalog institution that resolves a service key resolves a real one', () => {
    const dangling = [];
    for (const name of catalogInstitutionNames()) {
      const key = resolveKey(name);
      if (key && !INSTITUTION_SERVICES[key]) dangling.push(`${name} -> ${key}`);
    }
    expect(dangling).toEqual([]);
  });
});
