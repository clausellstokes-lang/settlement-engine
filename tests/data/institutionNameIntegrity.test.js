/**
 * Guard against the engine's deepest fragility: institution names are coupled
 * across several maps by EXACT STRING - institutionalCatalog (definitions),
 * spatialData's GATE_FEATURES / INSTITUTION_SPATIAL (structural requirements),
 * and structuralValidator's SPATIAL_FEATURES (greater→implied-lesser). A rename
 * or typo in one place silently breaks the cross-reference with no type error
 * and (until now) no test.
 *
 * This pins it: every institution name *referenced* as a requirement or
 * implication must be *defined* somewhere in the union of those maps.
 *
 * When this fails you've either (a) typo'd / renamed a name on one side only -
 * fix the data so both sides agree - or (b) added a genuinely new structural-
 * only feature - extend the defined set or KNOWN_UNRESOLVED below.
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import {
  INSTITUTION_SPATIAL,
  GATE_FEATURES,
  GOVERNMENT_INSTITUTIONS,
} from '../../src/data/spatialData.js';
import { SPATIAL_FEATURES } from '../../src/generators/structuralValidator.js';

// Pre-existing data bugs this guard surfaced on first run. These GATE_FEATURES
// requirements name institutions that exist nowhere in the catalog/spatial maps,
// so the requirement can never resolve. Fixing them is a domain/behavioral call
// (which name was intended?), so they're quarantined here rather than guessed:
//   - "Arcane university" / "Magical academy"  (required by "Magic item
//     consignment") - no such institutions; likely meant "Academy of magic"
//     and/or "Mages' guild".
//   - "River access"  (required by "Tanners") - an ACCESS type, not an
//     institution; belongs in `requiresAccess: ['river']`, not `requires`.
// Remove each entry as the underlying data is fixed (the test enforces that:
// a fixed name left in this list will fail).
const KNOWN_UNRESOLVED = new Set([
  'Arcane university',
  'Magical academy',
  'River access',
]);

function buildDefinedNames() {
  const defined = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      for (const name of Object.keys(category)) defined.add(name);
    }
  }
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

  it('every GATE_FEATURES requirement resolves, except documented pre-existing bugs', () => {
    const orphans = new Set();
    for (const [feature, def] of Object.entries(GATE_FEATURES)) {
      for (const req of def?.requires || []) {
        if (!isDefined(req)) orphans.add(req);
      }
    }
    // Exact match: a NEW unresolved name fails (drift caught); a FIXED one also
    // fails, prompting its removal from KNOWN_UNRESOLVED so the list stays honest.
    expect([...orphans].sort()).toEqual([...KNOWN_UNRESOLVED].sort());
  });
});
