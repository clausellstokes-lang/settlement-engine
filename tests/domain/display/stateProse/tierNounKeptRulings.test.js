/**
 * tests/domain/display/stateProse/tierNounKeptRulings.test.js — THE CHAIR'S RULINGS ON THE
 * TIER-NOUN RESIDUE (lane TIER-NOUN-POOLS, 2026-11-04, after units 1–2 took the 1,000 corpus
 * from 287 to 160 places).
 *
 * The 160 came from four sources, and the chair ruled on each (vetoable by the owner). Each
 * arm reads the leaking line FROM ITS OWN MODULE rather than quoting it, so a reworded source
 * fails here loudly instead of leaving a stale quote green. Each arm also proves the keep is
 * no wider than its line: a self-reference beside it still finds, and `speakTierNoun` still
 * returns the line unchanged (a keep changes what the CHECK forgives, never a rendered byte).
 */
import { textOf } from '../../../../src/domain/facts/textOf.js';
import { describe, expect, it } from 'vitest';

import { speakTierNoun } from '../../../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFindings } from '../../../../src/domain/coherence/tierNounFindings.js';
import { INSTITUTION_DESC_VARIANTS } from '../../../../src/data/institutionDescVariants.js';
import { RESOURCE_CHAINS } from '../../../../src/data/resourceChains.js';
import { institutionalCatalog } from '../../../../src/data/institutionalCatalog.js';
import { CULTURE_PROFILES } from '../../../../src/data/cultureProfiles.js';
import { SUPPLY_CHAIN_NEEDS } from '../../../../src/data/supplyChainData.js';
import { generateSpatialLayout } from '../../../../src/generators/spatialGenerator.js';

/** The self-reference planted beside a kept line: it must still be found. */
const SELF = ' Plainly this is a town that bargains.';

/** The kept line is forgiven on the tier, the planted self-reference beside it is not, and no byte moves. */
function expectKept(line, tier) {
  expect(tierNounFindings({ tier }, line), `${tier}: ${line}`).toEqual([]);
  const found = tierNounFindings({ tier }, line + SELF);
  expect(found, `${tier}: the self-reference beside it`).toHaveLength(1);
  expect(found[0].context).toContain('this is a town that bargains');
  expect(speakTierNoun(line, tier), `${tier}: a keep never moves a rendered byte`).toBe(line);
}

describe('ruling 1 — "crown or town" (the customs house) is the state or the municipality, not the tier', () => {
  const line = INSTITUTION_DESC_VARIANTS['city|Economy|Customs house'].find((s) => /crown or town/.test(s));
  it('the line exists where the soak found it (city and metropolis keys)', () => {
    expect(line).toBeTruthy();
    expect(INSTITUTION_DESC_VARIANTS['metropolis|Economy|Customs house']).toContain(line);
  });
  it.each(['city', 'metropolis'])('is kept on a %s', (tier) => expectKept(line, tier));
});

describe('ruling 2 — "Town granary" is a catalogue row\'s proper name, not the tier', () => {
  // The chair's test for the ruling: if only town-and-larger blocks name it, it is a proper name and is kept;
  // a thorp, hamlet or village block naming it would instead be renamed "Granary".
  it('only the town block names it (city and metropolis carry their own names)', () => {
    const naming = Object.entries(institutionalCatalog)
      .filter(([, cats]) => Object.values(cats).some((insts) => Object.keys(insts).includes('Town granary')))
      .map(([tier]) => tier);
    expect(naming).toEqual(['town']);
  });
  // The leak: a chain row lists its processing institutions by catalogue name at every tier. GREEN-BASE (2026-11-08):
  // the grain chain no longer names it — REVIEW-INTAKE-2 unit 4 (9421e31e4, chair ruling R4: "a granary stores grain
  // and does not process it") struck it from RESOURCE_CHAINS.grain, pinned there by tests/joins/chainNamesOnlyProcessors
  // — so the arm reads the row that still prints it below the town: the floodplain-agriculture supply chain
  // (data/supplyChainData.js, minTier village), whose processing institutions the supply-chain panel and the PDF's
  // chain rows print by catalogue name. The keep is unchanged; the line it forgives is re-read from its own module.
  const floodplain = Object.values(SUPPLY_CHAIN_NEEDS).flatMap((need) => need.chains).find((c) => c.id === 'floodplain_agriculture');
  const row = `${floodplain.label} » ${floodplain.processingInstitutions.join(', ')}`;
  it('the grain chain no longer names it (R4); the floodplain-agriculture chain row does', () => {
    expect(RESOURCE_CHAINS.grain.processingInstitutions, 'R4 struck the granary from the grain chain').toEqual(['Mill', 'Bakers (5-15)', 'Access to external mill']);
    expect(row).toContain('Town granary');
  });
  it.each(['thorp', 'hamlet', 'village', 'city', 'metropolis'])('is kept on a %s', (tier) => expectKept(row, tier));
});

describe('ruling 3 — the steppe built-form line\'s "river town" names the culture\'s settled hinge, not this place', () => {
  // The chair ruled "river town" routed through the noun unless the phrase is fixed in a culture line where the
  // tier noun reads wrong. Routed, this line would say "A fortified trade station or river thorp acts as the settled
  // hinge of a much wider mobile hinterland": that a thorp (or a metropolis) is the region's hinge. It is the
  // culture's design grammar, the same string for every steppe place, so that ONE line is kept.
  const line = CULTURE_PROFILES.steppe.builtForm.map(textOf).find((s) => /river town/.test(s));
  it('the line exists in the steppe profile\'s built form', () => expect(line).toBeTruthy());
  it.each(['thorp', 'hamlet', 'village', 'city', 'metropolis'])('is kept on a %s', (tier) => expectKept(line, tier));
  it('the keep is that line\'s, not the phrase\'s: a self-referring "a river town" still moves and still finds', () => {
    // anchored: invented wording (a corpus sentence quoted here would be a literal state-prose anchor)
    expect(speakTierNoun('A river town keeps its own counsel.', 'thorp')).toBe('A river thorp keeps its own counsel.');
    expect(tierNounFindings({ tier: 'thorp' }, 'A river town keeps its own counsel.')).toHaveLength(1);
  });
});

describe('ruling 4 — "lower town" is a district of a city, kept for city and metropolis ONLY', () => {
  const line = generateSpatialLayout('city', [], 'road', 'mountain').layout;
  it('the mountain city layout names it', () => expect(line).toContain('lower town'));
  it.each(['city', 'metropolis'])('is kept on a %s', (tier) => expectKept(line, tier));
  it.each(['thorp', 'hamlet', 'village'])('still counts on a %s: the licence reads the tier', (tier) => {
    // anchored: invented wording; a smaller place has no lower town of its own
    expect(tierNounFindings({ tier }, 'The mill stands in the lower town.')).toHaveLength(1);
    expect(tierNounFindings({ tier }, line)).toHaveLength(1);
  });
});

describe('URBAN-FIX B-P1 — "old town" is a district of a larger place, kept for city and metropolis ONLY', () => {
  // The Shadows District quarter's location, read from its writer: the one stored string behind every urban
  // tier-noun finding on the 1,000 (URBAN-AUDIT §2, B-1). The twin of ruling 4's "lower town" (the chair's ruling 1).
  const quarter = generateSpatialLayout('city', [{ name: 'Thieves\' guild' }], 'road', 'plains').quarters
    .find((q) => q.name === 'Shadows District');
  const line = quarter?.location;
  it('the underworld quarter names it', () => expect(line).toBe('Old town or slums'));
  it.each(['city', 'metropolis'])('is kept on a %s', (tier) => expectKept(line, tier));
  it.each(['thorp', 'hamlet', 'village', 'town'])('the control on a %s: the licence reads the tier', (tier) => {
    // anchored: invented wording; a smaller place has no old town of its own
    const expected = tier === 'town' ? 0 : 1;
    expect(tierNounFindings({ tier }, 'The shrine stands in the old town.')).toHaveLength(expected);
    expect(tierNounFindings({ tier }, line)).toHaveLength(expected);
  });
});
