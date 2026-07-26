/**
 * The formal receipt is an independent audit of the assembled dossier.
 *
 * These tests deliberately damage final output after generation. Producer
 * receipts and repair passes have already run at that point, so a passing
 * recertification proves that the final-graph checks are inspecting canonical
 * output instead of trusting the systems that produced it.
 */

import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildGenerationCoherenceReceipt } from '../../src/generators/generationCoherence.js';
import { GENERATION_JUDGMENT_IDS } from '../../src/generators/generationReceiptJudgments.js';

function generate(config = {}, seed = 'formal-receipt-base') {
  return generateSettlementPipeline(
    {
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      contentProfile: 'grounded',
      ...config,
    },
    null,
    { seed, customContent: {} },
  );
}

function recertify(settlement) {
  const candidate = structuredClone(settlement);
  const previous = candidate.generationCoherenceReceipt;
  delete candidate.generationCoherenceReceipt;
  return buildGenerationCoherenceReceipt(candidate, {
    seed: previous?.seed || candidate._seed,
    generationRepairs: previous?.repairs || [],
  });
}

function check(receipt, id) {
  return receipt.checks.find(entry => entry.id === id);
}

function judgment(receipt, id) {
  return receipt.judgments.find(entry => entry.id === id);
}

describe('formal generation receipt judgments', () => {
  it('publishes seven evidence-bearing, categorical judgments', () => {
    const receipt = generate().generationCoherenceReceipt;

    expect(receipt.status).not.toBe('needs_review');
    expect(receipt.judgments.map(entry => entry.id)).toEqual(
      GENERATION_JUDGMENT_IDS,
    );
    expect(receipt.judgments).toHaveLength(7);
    for (const entry of receipt.judgments) {
      expect(entry.evidence.length).toBeGreaterThan(0);
      expect(entry).not.toHaveProperty('confidence');
      expect(entry.status).toMatch(
        /^(pass|pass_with_tension|needs_review|not_applicable)$/,
      );
    }
    expect(
      judgment(receipt, 'confidence_and_provenance').evidence,
    ).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'seed' }),
      expect.objectContaining({ path: 'worldLawVersion' }),
    ]));
    expect(
      judgment(receipt, 'diversity_and_repetition').summary,
    ).toContain('cohort');
  });

  it('rejects a broken final NPC reference after all producers have run', () => {
    const settlement = generate({}, 'receipt-broken-reference');
    settlement.relationships[0].npc1Id = 'missing-final-npc';

    const receipt = recertify(settlement);

    expect(receipt.status).toBe('needs_review');
    expect(check(receipt, 'final_graph')).toMatchObject({
      status: 'fail',
      findings: expect.arrayContaining([
        expect.objectContaining({
          path: 'relationships[0].npc1Id',
        }),
      ]),
    });
    expect(judgment(receipt, 'hard_structural_validity').status)
      .toBe('needs_review');
  });

  it('rejects broken faction joins and unconserved income directly', () => {
    const settlement = generate({}, 'receipt-final-graph-edges');
    settlement.factions[0].members[0] = {
      ...settlement.factions[0].members[0],
      id: 'missing-faction-member',
    };
    settlement.conflicts[0].parties[0] = 'Missing narrative faction';
    settlement.economicState.incomeSources[0].percentage += 1;
    settlement.population = Number.POSITIVE_INFINITY;

    const receipt = recertify(settlement);

    expect(check(receipt, 'final_graph').findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'factions[0].members[0].id',
        }),
        expect.objectContaining({
          path: 'conflicts[0].parties[0]',
        }),
      ]),
    );
    expect(check(receipt, 'conservation').findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'economicState.incomeSources',
        }),
        expect.objectContaining({
          path: 'population',
        }),
      ]),
    );
  });

  it('catches chronology and conservation drift in the final dossier', () => {
    const settlement = generate({}, 'receipt-conservation');
    settlement.history.historicalEvents[0].yearsAgo = 1;
    settlement.history.historicalEvents[1].yearsAgo = 10;
    settlement.powerStructure.factions[0].power += 1;

    const receipt = recertify(settlement);

    expect(check(receipt, 'chronology').status).toBe('fail');
    expect(check(receipt, 'conservation')).toMatchObject({
      status: 'fail',
      findings: expect.arrayContaining([
        expect.objectContaining({
          path: 'powerStructure.factions',
        }),
      ]),
    });
    expect(judgment(receipt, 'narrative_realization').status)
      .toBe('needs_review');
    expect(judgment(receipt, 'cross_system_semantic_agreement').status)
      .toBe('needs_review');
  });

  it('does not mistake a proper name ending in An for a doubled article', () => {
    const settlement = generate({}, 'receipt-proper-name-grammar');
    settlement.npcs[0].secret.what =
      'Owes Wu An a debt from before either held office.';

    const properNameReceipt = recertify(settlement);
    expect(check(properNameReceipt, 'narrative_quality').status).toBe('pass');

    settlement.npcs[0].secret.what =
      'The the debt remains outstanding.';
    const doubledArticleReceipt = recertify(settlement);
    expect(check(doubledArticleReceipt, 'narrative_quality').status)
      .toBe('fail');
  });

  it('detects when a final cull violates an explicit institution requirement', () => {
    const settlement = generate({
      _institutionToggles: {
        'town::Military::Citizen militia': {
          allow: true,
          require: true,
        },
      },
    }, 'receipt-required-institution');
    settlement.institutions = settlement.institutions.filter(
      institution => institution.name !== 'Citizen militia',
    );

    const receipt = recertify(settlement);

    expect(check(receipt, 'user_intent')).toMatchObject({
      status: 'fail',
      findings: expect.arrayContaining([
        expect.objectContaining({
          detail: expect.stringContaining('required institution'),
        }),
      ]),
    });
    expect(judgment(receipt, 'user_intent_fulfillment').status)
      .toBe('needs_review');
  });

  it('reports within-settlement repetition without claiming cohort evidence', () => {
    const settlement = generate({}, 'receipt-roster-repetition');
    settlement.npcs[1].name = settlement.npcs[0].name;
    settlement.relationships.push({
      ...settlement.relationships[0],
    });

    const receipt = recertify(settlement);
    const diversity = judgment(receipt, 'diversity_and_repetition');

    expect(check(receipt, 'roster_repetition').status).toBe('fail');
    expect(diversity.status).toBe('needs_review');
    expect(diversity.summary).toContain('cohort');
    expect(diversity.evidence[0].detail).toContain('Cross-corpus');
  });

  it('treats explained authored hardship as tension, not a defect', () => {
    const settlement = generate({
      settType: 'village',
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
    }, 'receipt-authored-hardship');
    const receipt = settlement.generationCoherenceReceipt;

    expect(receipt.status).toBe('coherent_with_authored_tensions');
    expect(judgment(receipt, 'hard_structural_validity').status).toBe('pass');
    expect(judgment(receipt, 'dramatic_tension')).toMatchObject({
      status: 'pass_with_tension',
      findings: [],
    });
    expect(receipt.authoredTensions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'access_violation',
        subject: 'Fishmonger',
      }),
    ]));
  });
});
