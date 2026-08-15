/**
 * Authored-intent precedence across generation normalization.
 *
 * Generation profiles constrain generator suggestions. They do not erase an
 * event-authored crisis or custom definition. Likewise, roster normalization
 * may collapse redundant generated scale variants, but it preserves an
 * institution the player explicitly forced and reports any resulting
 * contradiction as a by-design tension.
 */

import { describe, expect, it } from 'vitest';
import {
  isAuthoredGenerationEntity,
  isGeneratorOwnedEntity,
  isProtectedFromCustomSubsumption,
  isProtectedGenerationEntity,
} from '../../src/domain/generationOwnership.js';
import {
  createGenerationWorldLaw,
} from '../../src/generators/generationContext.js';
import {
  generateSettlementPipeline,
} from '../../src/generators/generateSettlementPipeline.js';

function generate(config, seed) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
  });
}

function stressEntries(settlement) {
  if (Array.isArray(settlement.stress)) return settlement.stress;
  return settlement.stress ? [settlement.stress] : [];
}

describe('central generation ownership law', () => {
  it('distinguishes authored provenance from broader normalization protection', () => {
    expect(isAuthoredGenerationEntity({ source: 'event' })).toBe(true);
    expect(isAuthoredGenerationEntity({ source: 'forced' })).toBe(true);
    expect(isAuthoredGenerationEntity({ isCustom: true })).toBe(true);
    expect(isAuthoredGenerationEntity({ createdByEventId: 'ev-add' })).toBe(true);
    expect(isAuthoredGenerationEntity({ addedByEventId: 'ev-stress' })).toBe(true);
    expect(isAuthoredGenerationEntity({ createdByEventId: '' })).toBe(false);
    expect(isAuthoredGenerationEntity({ source: 'generated' })).toBe(false);

    expect(isProtectedGenerationEntity({
      source: 'required',
      required: true,
    })).toBe(true);
    expect(isAuthoredGenerationEntity({
      source: 'required',
      required: true,
    })).toBe(false);
    expect(isGeneratorOwnedEntity({ source: 'generated' })).toBe(true);
    expect(isGeneratorOwnedEntity({ createdByEventId: 'ev-add' })).toBe(false);

    expect(isProtectedGenerationEntity({ createdByEventId: 'ev-add' })).toBe(true);
    expect(isProtectedFromCustomSubsumption(
      { createdByEventId: 'ev-add' },
      { exactTarget: true },
    )).toBe(true);
    expect(isProtectedFromCustomSubsumption(
      { addedByEventId: 'ev-stress' },
      { exactTarget: true },
    )).toBe(true);

    const optionalCustom = {
      source: 'custom',
      isCustom: true,
      customDefinitionId: 'definition:institutions:annex',
    };
    expect(isProtectedFromCustomSubsumption(optionalCustom)).toBe(true);
    expect(isProtectedFromCustomSubsumption(optionalCustom, {
      exactTarget: true,
    })).toBe(false);
    expect(isProtectedFromCustomSubsumption({
      ...optionalCustom,
      required: true,
    }, {
      exactTarget: true,
    })).toBe(true);
  });

  it('applies heroic boundaries to generated content, not custom content', () => {
    const law = createGenerationWorldLaw({
      contentProfile: 'heroic',
      magicExists: true,
      priorityMagic: 50,
    });

    expect(law.allowsInstitution({
      name: 'Slave market memorial',
      source: 'custom',
      isCustom: true,
    })).toBe(true);
    expect(law.allowsService({
      name: 'Testimony about the slave trade',
      source: 'custom',
      custom: true,
    })).toBe(true);
    expect(law.allowsInstitution({
      name: 'Slave market',
      source: 'generated',
    })).toBe(false);
  });
});

describe('authored intent survives the complete generation pipeline', () => {
  it('preserves an event-authored sensitive crisis under the heroic profile', () => {
    const settlement = generate({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      contentProfile: 'heroic',
      stressorEdits: {
        added: [{
          type: 'slave_revolt',
          label: 'Slave revolt',
          summary: 'The player authored a slave revolt premise.',
          source: 'authored',
        }],
        resolved: [],
      },
    }, 'authored-profile-audit-2');

    expect(stressEntries(settlement)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'slave_revolt',
        source: 'authored',
      }),
    ]));
    expect(settlement.simulationTrace).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        targetId: 'stressor.slave_revolt',
        result: 'declined',
      }),
    ]));
    expect(settlement.generationCoherenceReceipt).toMatchObject({
      status: 'coherent_with_authored_tensions',
      authoredTensions: expect.arrayContaining([
        expect.objectContaining({
          type: 'content_boundary_override',
        }),
      ]),
    });
  });

  it('preserves a crisis explicitly selected in generation config', () => {
    const settlement = generate({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      contentProfile: 'heroic',
      stressTypes: ['slave_revolt'],
    }, 'forced-profile-stress');

    expect(stressEntries(settlement)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'slave_revolt',
        source: 'forced',
        forcedByConfig: true,
      }),
    ]));
    expect(settlement.generationCoherenceReceipt).toMatchObject({
      status: 'coherent_with_authored_tensions',
      authoredTensions: expect.arrayContaining([
        expect.objectContaining({
          type: 'content_boundary_override',
        }),
      ]),
    });
  });

  it('keeps a forced incompatible fishmonger as a by-design tension', () => {
    const settlement = generate({
      settType: 'village',
      culture: 'germanic',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      magicExists: false,
      priorityMagic: 0,
      _institutionToggles: {
        'village::Crafts::Fishmonger': {
          allow: true,
          require: true,
        },
      },
    }, 'authored-fishmonger-audit');

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Fishmonger',
        source: 'forced',
        forcedByToggle: true,
      }),
    ]));
    expect(settlement.structuralViolations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'access_violation',
        institution: 'Fishmonger',
        severity: 'by_design',
      }),
    ]));
    expect(settlement.generationCoherenceReceipt).toMatchObject({
      status: 'coherent_with_authored_tensions',
      authoredTensions: expect.arrayContaining([
        expect.objectContaining({
          type: 'access_violation',
          subject: 'Fishmonger',
        }),
      ]),
    });
  });

  it('preserves a forced sensitive institution without weakening the profile', () => {
    const settlement = generate({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      contentProfile: 'heroic',
      _institutionToggles: {
        'town::Economy::Slave market': {
          allow: true,
          require: true,
        },
      },
    }, 'forced-sensitive-institution');

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Slave market',
        source: 'forced',
        forcedByToggle: true,
      }),
    ]));
    expect(settlement.generationCoherenceReceipt).toMatchObject({
      status: 'coherent_with_authored_tensions',
      contentProfile: 'heroic',
      authoredTensions: expect.arrayContaining([
        expect.objectContaining({
          type: 'content_boundary_override',
        }),
      ]),
    });
  });

  it('does not collapse a forced militia into a generated town watch', () => {
    const settlement = generate({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      _institutionToggles: {
        'town::Military::Citizen militia': {
          allow: true,
          require: true,
        },
      },
    }, 'forced-militia-upgrade-0');

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Citizen militia',
        source: 'forced',
        forcedByToggle: true,
      }),
      expect.objectContaining({
        name: 'Town watch',
      }),
    ]));
  });
});

/**
 * osr-authored-spelling — the provenance predicates read only spellings a
 * writer produces.
 *
 * Both predicates carried an `|| record.authored === true` disjunct. No writer
 * in this repo has ever produced a bare `authored` key on a generation entity:
 * `src/domain/userEdits.js` writes `_authored`, and the `source: 'authored'`
 * spelling is recognised by the AUTHORED_SOURCES arm. A quoted-string sweep of
 * src/ finds the bare key only inside a compendium archetype COUNT block, which
 * is not a generation entity. The dead disjunct was removed; these pins freeze
 * that as a DECISION, so re-adding the spelling has to be argued rather than
 * slipped back in, and the two live spellings cannot silently stop working.
 */
describe('osr-authored-spelling — only the written provenance keys are recognised', () => {
  it('recognises `_authored` and `source: "authored"`, and NOT a bare `authored`', () => {
    // Positives first: these prove the predicate is live and correctly keyed, so
    // the negative below measures exclusion rather than a dead accessor.
    expect(isAuthoredGenerationEntity({ _authored: true })).toBe(true);
    expect(isAuthoredGenerationEntity({ source: 'authored' })).toBe(true);
    // anchored: the two positives above drive the same predicate on the same shape
    expect(isAuthoredGenerationEntity({ authored: true })).toBe(false);
  });

  it('the subsumption shield reads the same spellings', () => {
    expect(isProtectedFromCustomSubsumption({ _authored: true })).toBe(true);
    expect(isProtectedFromCustomSubsumption({ source: 'authored' })).toBe(true);
    // anchored: the two positives above drive the same predicate on the same shape
    expect(isProtectedFromCustomSubsumption({ authored: true })).toBe(false);
  });
});
