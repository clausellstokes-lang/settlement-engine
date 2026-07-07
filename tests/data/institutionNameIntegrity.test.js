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
import {
  INSTITUTION_SPATIAL,
  GATE_FEATURES,
} from '../../src/data/spatialData.js';
import { EXPORT_GOODS_BY_TIER, GOODS_MODIFIERS_BY_TIER } from '../../src/data/tradeGoodsData.js';
import {
  catalogInstitutionNames,
  definedInstitutionNames,
} from '../../src/data/entityVocabulary.js';
import { SERVICE_TIER_DATA } from '../../src/generators/servicesGenerator.js';
import { SPATIAL_FEATURES } from '../../src/generators/structuralValidator.js';

// The vocabularies come from the SHARED builders in src/data/entityVocabulary.js
// so this guard and the runtime can never disagree about what "defined" means.
// (The old test-local builder added GOVERNMENT_INSTITUTIONS' category KEYS —
// 'government', 'marketScale'… — instead of its institution-name VALUES; the
// shared builder flattens the values, closing that gap in the guard itself.)
// SPATIAL_FEATURES is a generators export, so the data-layer module cannot
// import it — this test passes it in as the extra layer.
const buildCatalogNames = () => catalogInstitutionNames();
const buildDefinedNames = () => definedInstitutionNames(Object.keys(SPATIAL_FEATURES));

// Quarantine for GATE_FEATURES requirements that name an institution existing
// nowhere in the catalog/spatial maps (so the requirement can never resolve).
// Now EMPTY: the three dead-vocabulary entries this guard originally surfaced
// were removed from GATE_FEATURES —
//   - "Arcane university" / "Magical academy"  (from "Magic item consignment")
//   - "River access"  (from "Tanners") — an ACCESS type, not an institution.
// The real institutions already listed alongside each carried the requirement,
// so dropping the dead tokens changed no gate outcome. Keep this set empty; a
// new unresolved name must be fixed in the data, not quarantined here.
const KNOWN_UNRESOLVED = new Set([]);

// GATE_FEATURES is an INTENTIONAL SUPERSET of the emittable catalog: many of its
// keys gate institution NAMES the base catalog never produces (rich-setting /
// custom-content institutions like "University", "Curse breaking", or a stricter
// variant such as "Inner citadel" distinct from the catalog's "Citadel"). Those
// keys are dormant for generated settlements and only bind when a custom-authored
// institution carries that exact name — they are NOT dead code. This set pins the
// accepted superset so the useful signal survives: a NEW non-catalog key here means
// you either (a) added such a superset gate — extend this set on purpose — or (b)
// RENAMED/removed a catalog institution and silently killed a gate key that used to
// bind (fix the data so the key matches its catalog name again).
const SUPERSET_GATE_KEYS = new Set([
  "Adventurers' guild hall",
  'Curse breaking',
  'Enchanting quarter',
  'Inner citadel',
  'Magic item consignment',
  'Magical banking (high magic)',
  'Major port',
  'Mercenary company HQ',
  'Monster part dealers',
  'Multiple cathedrals',
  'Multiple warehouse districts',
  'Multiple wizard towers',
  'Navy (if coastal)',
  'Professional arena',
  'Professional guard (hundreds)',
  'Resurrection services (10,000+ only)',
  'Sage/library',
  'Spellcasting services (1st-4th level)',
  'Spellcasting services (1st-6th level)',
  'Spellcasting services (1st-8th level)',
  'Stock exchange (early)',
  'University',
]);

describe('institution-name integrity (string-coupling guard)', () => {
  const defined = buildDefinedNames();
  const catalogNames = buildCatalogNames();
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

  it('every trade-good requiredInstitution (all 3 parallel maps) names an emittable catalog institution', () => {
    // A good's `requiredInstitution` is matched by EXACT NAME against a settlement's
    // institutions — GOODS_MODIFIERS_BY_TIER gates generation on it; EXPORT_GOODS_BY_TIER
    // and SERVICE_TIER_DATA drive the dependency compendium's cross-links. All three are
    // tier→good→spec maps and must reference REAL catalog institutions; if one names
    // something the catalog can never emit ('University', 'Specialist craftsmen quarters',
    // guild-forms like "Bakers' guild"), the requirement is a fiction that either
    // permanently suppresses the good (generation) or dead-ends the cross-link (display).
    const MAPS = { EXPORT_GOODS_BY_TIER, GOODS_MODIFIERS_BY_TIER, SERVICE_TIER_DATA };
    const orphans = new Set();
    for (const [mapName, map] of Object.entries(MAPS)) {
      for (const goods of Object.values(map || {})) {
        for (const [good, spec] of Object.entries(goods || {})) {
          const req = spec?.requiredInstitution;
          if (req && !catalogNames.has(req)) orphans.add(`${mapName}:${good} → ${req}`);
        }
      }
    }
    expect([...orphans].sort()).toEqual([]);
  });

  it('every GATE_FEATURES key that is NOT an emittable catalog name is an accepted superset gate', () => {
    // Pins the intentional catalog↔gate gap (see SUPERSET_GATE_KEYS above). Fails when
    // the gap CHANGES — a new dormant/superset gate to acknowledge, or (the real bug
    // this catches) a catalog rename that silently dropped a live gate key to dormant.
    const nonCatalogKeys = Object.keys(GATE_FEATURES).filter((k) => !catalogNames.has(k));
    expect([...nonCatalogKeys].sort()).toEqual([...SUPERSET_GATE_KEYS].sort());
  });
});
