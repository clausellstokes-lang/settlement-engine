/**
 * Guard against the engine's deepest fragility: institution names are coupled
 * across several maps by EXACT STRING — institutionalCatalog (definitions),
 * spatialData's GATE_FEATURES / INSTITUTION_SPATIAL (structural requirements),
 * and structuralValidator's SPATIAL_FEATURES (greater→implied-lesser). A rename
 * or typo in one place silently breaks the cross-reference with no type error
 * and (until now) no test.
 *
 * This pins it: every institution name *referenced* as a requirement or
 * implication must be *defined* somewhere in the union of those maps.
 *
 * When this fails you've either (a) typo'd / renamed a name on one side only —
 * fix the data so both sides agree — or (b) added a genuinely new structural-
 * only feature — extend the defined set or KNOWN_UNRESOLVED below.
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import {
  INSTITUTION_SPATIAL,
  GATE_FEATURES,
  GATE_DERIVED_REQUIREMENTS,
  GOVERNMENT_INSTITUTIONS,
} from '../../src/data/spatialData.js';
import { SPATIAL_FEATURES } from '../../src/generators/structuralValidator.js';

// EP-g3 is an explicit owner disposition, not part of the EP-g2 vocabulary
// repair. Keep these two dead legacy keys visible and exact until that decision
// lands; any third non-catalog gate is a regression.
const EP_G3_OWNER_DEFERRED_GATE_KEYS = new Set([
  'Major port',
  'Navy (if coastal)',
]);

function buildCatalogNames() {
  const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      for (const name of Object.keys(category)) names.add(name);
    }
  }
  return names;
}

function buildDefinedNames() {
  const defined = buildCatalogNames();
  for (const key of Object.keys(GATE_FEATURES)) defined.add(key);
  for (const entry of INSTITUTION_SPATIAL) {
    if (entry?.institution) defined.add(entry.institution);
  }
  const govNames = Array.isArray(GOVERNMENT_INSTITUTIONS)
    ? GOVERNMENT_INSTITUTIONS
    : Object.keys(GOVERNMENT_INSTITUTIONS || {});
  for (const g of govNames) defined.add(g);
  for (const key of Object.keys(SPATIAL_FEATURES)) defined.add(key);
  return defined;
}

describe('institution-name integrity (string-coupling guard)', () => {
  const catalogNames = buildCatalogNames();
  const defined = buildDefinedNames();
  const isDefined = (name) => defined.has(name);

  it('every SPATIAL_FEATURES implied (lesser) institution is defined somewhere', () => {
    const orphans = new Set();
    for (const [greater, lessers] of Object.entries(SPATIAL_FEATURES)) {
      for (const lesser of lessers) {
        if (!isDefined(lesser)) orphans.add(`${lesser}  <- implied by "${greater}"`);
      }
    }
    expect([...orphans].sort()).toEqual([]);
  });

  it('every INSTITUTION_SPATIAL exception names a defined institution', () => {
    // `exception` exempts an entry from its access check when the named
    // institution is on the roster (structuralValidator). It joins by exact
    // string, so a rename on either side silently disables the exemption.
    const orphans = [];
    for (const entry of INSTITUTION_SPATIAL) {
      if (entry?.exception && !isDefined(entry.exception)) {
        orphans.push(`${entry.exception}  <- exception on "${entry.institution}"`);
      }
    }
    expect(orphans).toEqual([]);
  });

  it('every live GATE_FEATURES key is a catalog institution', () => {
    const orphans = Object.keys(GATE_FEATURES)
      .filter(name => !catalogNames.has(name))
      .sort();
    expect(orphans).toEqual([...EP_G3_OWNER_DEFERRED_GATE_KEYS].sort());
  });

  it('every live GATE_FEATURES dependency is cataloged or explicitly real-derived', () => {
    const derived = new Set(GATE_DERIVED_REQUIREMENTS);
    const orphans = [];
    for (const [feature, def] of Object.entries(GATE_FEATURES)) {
      for (const field of ['requires', 'requiresAny', 'blockedBy']) {
        for (const requirement of def?.[field] || []) {
          if (catalogNames.has(requirement) || derived.has(requirement)) continue;
          orphans.push(`${feature}.${field}: ${requirement}`);
        }
      }
    }
    expect(orphans.sort()).toEqual([]);
  });
});
