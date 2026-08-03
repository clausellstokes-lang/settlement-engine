import { describe, expect, it } from 'vitest';

import {
  applyNegotiationPictureMutation,
  compareOfferToResponderDraft,
  createNegotiationPicture,
  evaluateNegotiationPicture,
  mutateNegotiationPicture,
  negotiateFromPictures,
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
  validateTermSheetAgainstPictures,
} from '../../src/domain/worldPulse/negotiationPictures.js';
import { materializeCarriedTermSheet } from '../../src/domain/worldPulse/peaceTerms.js';

function subject(settlementId, patch = {}) {
  return {
    settlementId,
    strengthBand: 'ready',
    storesBand: 'stocked',
    foodPressureBand: 'present',
    economyPressureBand: 'present',
    tradePressureBand: 'present',
    threatBand: 'present',
    allyStrengthBand: 'present',
    restitutionClaimBand: 'quiet',
    warExhaustionBand: 'present',
    governingArchetype: 'other',
    alignmentPressBand: 'measured',
    exportKnowledge: 'known',
    exports: [],
    ...patch,
  };
}

function picture({
  id = 'picture.iron',
  partyId = 'iron',
  counterpartId = 'weak',
  carrier = { kind: 'envoy', id: 'npc.envoy.iron' },
  frontOwnerId = 'iron',
  frontSinceTick = 4,
  capturedTick = 10,
  subjects = [
    subject('iron', {
      strengthBand: 'dominant',
      foodPressureBand: 'pressing',
      economyPressureBand: 'pressing',
      tradePressureBand: 'present',
      threatBand: 'pressing',
      governingArchetype: 'merchant',
      alignmentPressBand: 'hard',
    }),
    subject('weak', {
      strengthBand: 'strained',
      storesBand: 'thin',
      allyStrengthBand: 'present',
      exports: ['Silver'],
    }),
  ],
  ...patch
} = {}) {
  return createNegotiationPicture({
    id,
    carrier,
    partyId,
    counterpartId,
    relationshipKey: 'edge.iron.weak',
    episodeKey: 'war.iron.weak.4',
    frontOwnerId,
    frontSinceTick,
    capturedTick,
    causeStatus: 'live',
    subjects,
    evidenceIds: ['decision.peace.iron.10'],
  });
}

function parlayArgs(patch = {}) {
  return {
    termSheetId: 'term_sheet.errand.iron.12',
    errandId: 'envoy_errand.iron.weak.10',
    encounterId: 'encounter.field.iron.weak.12',
    episodeKey: 'war.iron.weak.4',
    relationshipKey: 'edge.iron.weak',
    proposerId: 'iron',
    responderId: 'weak',
    victorId: 'iron',
    loserId: 'weak',
    agreedTick: 12,
    proposerPicture: picture(),
    responderPicture: picture({
      id: 'picture.weak',
      partyId: 'weak',
      counterpartId: 'iron',
      carrier: { kind: 'army', id: 'army.weak.iron.4' },
    }),
    ...patch,
  };
}

describe('WR-7b frozen negotiation picture DTO', () => {
  it('is versioned, canonical, scalar-free in every observation, and keeps carrier identity separate', () => {
    const made = picture({
      carrier: { kind: 'army', id: 'army.third_party.9' },
      frontOwnerId: 'third_party',
    });
    expect(made).toBeTruthy();
    expect(made).toMatchObject({
      schemaVersion: 1,
      carrier: { kind: 'army', id: 'army.third_party.9' },
      partyId: 'iron',
      counterpartId: 'weak',
      frontOwnerId: 'third_party',
      capturedTick: 10,
      lastChangedTick: 10,
    });
    expect(made.subjects.map((row) => row.settlementId)).toEqual(['iron', 'weak']);
    expect(normalizeNegotiationPicture(JSON.parse(JSON.stringify(made)))).toEqual(made);
    for (const row of made.subjects) {
      for (const [key, value] of Object.entries(row)) {
        if (key === 'exports') expect(value.every((entry) => typeof entry === 'string')).toBe(true);
        else expect(typeof value, key).toBe('string');
      }
    }
  });

  it('keeps missing observations explicitly unknown and omits them from appraisal', () => {
    const made = picture({
      subjects: [
        { settlementId: 'iron', strengthBand: 'strong', governingArchetype: 'merchant', alignmentPressBand: 'measured' },
        { settlementId: 'weak', strengthBand: 'strained' },
      ],
    });
    expect(made.subjects[0]).toMatchObject({
      foodPressureBand: 'unknown',
      economyPressureBand: 'unknown',
      exportKnowledge: 'unknown',
      exports: [],
    });
    expect(made.subjects[1]).toMatchObject({
      allyStrengthBand: 'unknown',
      restitutionClaimBand: 'unknown',
      exportKnowledge: 'unknown',
    });
    const evaluated = evaluateNegotiationPicture(made, { victorId: 'iron', loserId: 'weak' });
    expect(evaluated.ranked.map((asset) => asset.assetClass)).toEqual(['government']);
    expect(evaluated.ranked.some((asset) => asset.assetClass === 'treasury' || asset.assetClass === 'export_flows')).toBe(false);
  });

  it('rejects scalar observations and malformed/aliased pair clocks instead of coercing them', () => {
    const scalar = picture({
      subjects: [subject('iron', { strengthBand: 0.8 }), subject('weak')],
    });
    expect(scalar).toBeNull();
    const made = picture();
    expect(normalizeNegotiationPicture({ ...made, lastChangedTick: 9 })).toBeNull();
    expect(createNegotiationPicture({
      ...made,
      partyId: 'iron',
      counterpartId: 'iron',
      subjects: [subject('iron'), subject('iron')],
    })).toBeNull();
    expect(normalizeNegotiationPicture({ ...made, surpriseScalar: 0.42 })).toBeNull();
  });
});

describe('WR-7b one-source, one-rung picture mutation', () => {
  function patch(overrides = {}) {
    return {
      id: 'picture_mutation.battle.12',
      pictureId: 'picture.iron',
      episodeKey: 'war.iron.weak.4',
      sourceId: 'battle.iron.weak.12',
      kind: 'battle',
      tick: 12,
      subjectId: 'weak',
      field: 'strengthBand',
      fromBand: 'strained',
      toBand: 'ready',
      direction: 'rise',
      ...overrides,
    };
  }

  it('moves one closed field one rung, records sorted provenance, and round-trips', () => {
    const before = picture();
    const applied = mutateNegotiationPicture(before, patch());
    expect(applied).toMatchObject({ changed: true, reason: 'applied' });
    const after = applied.picture;
    expect(after.subjects.find((row) => row.settlementId === 'weak').strengthBand).toBe('ready');
    expect(after.lastChangedTick).toBe(12);
    expect(after.evidenceIds).toEqual(['battle.iron.weak.12', 'decision.peace.iron.10']);
    expect(normalizeNegotiationPicture(JSON.parse(JSON.stringify(after)))).toEqual(after);
  });

  it('fails closed for duplicate sources, skipped/scalar target bands, stale bands, and cross-picture patches', () => {
    const before = picture();
    const once = applyNegotiationPictureMutation(before, patch());
    expect(applyNegotiationPictureMutation(once, patch({ id: 'second' }))).toBe(once);
    expect(applyNegotiationPictureMutation(before, patch({ toBand: 'strong' }))).toBe(before);
    expect(applyNegotiationPictureMutation(before, patch({ toBand: 0.7 }))).toBe(before);
    expect(applyNegotiationPictureMutation(before, patch({ fromBand: 'ready', toBand: 'strong' }))).toBe(before);
    expect(applyNegotiationPictureMutation(before, patch({ pictureId: 'picture.other' }))).toBe(before);
    expect(applyNegotiationPictureMutation(before, patch({ episodeKey: 'war.other' }))).toBe(before);
  });

  it('freezes the authored inputs: later source-object poison cannot refresh the picture', () => {
    const iron = subject('iron', { strengthBand: 'dominant', governingArchetype: 'merchant', alignmentPressBand: 'hard' });
    const weak = subject('weak', { strengthBand: 'strained', exports: ['Silver'] });
    const frozen = picture({ subjects: [iron, weak] });
    const first = evaluateNegotiationPicture(frozen, { victorId: 'iron', loserId: 'weak' });
    iron.strengthBand = 'spent';
    weak.strengthBand = 'dominant';
    weak.exports.push('A town that fell after departure');
    const second = evaluateNegotiationPicture(frozen, { victorId: 'iron', loserId: 'weak' });
    expect(second).toEqual(first);
  });
});

describe('WR-7b two independent drafts and carried agreement', () => {
  it('agrees only after two independent evaluations and is byte-deterministic', () => {
    const args = parlayArgs();
    const first = negotiateFromPictures(args);
    const second = negotiateFromPictures(args);
    expect(first.agreed).toBe(true);
    expect(first.reason).toBe('bounded');
    expect(first.termSheet.clauses.length).toBeGreaterThan(0);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(first.termSheet.valuations).toEqual([
      { partyId: 'iron', pictureId: 'picture.iron', role: 'proposer', decision: 'accept' },
      { partyId: 'weak', pictureId: 'picture.weak', role: 'responder', decision: 'accept' },
    ]);
    expect(validateTermSheetAgainstPictures({
      termSheet: first.termSheet,
      proposerPicture: args.proposerPicture,
      responderPicture: args.responderPicture,
    })).toEqual({ accepted: true, reason: 'bounded' });
  });

  it('never averages the pictures: a responder that sees the proposed loser as stronger refuses orientation', () => {
    const responderPicture = picture({
      id: 'picture.weak.refuses',
      partyId: 'weak',
      counterpartId: 'iron',
      subjects: [
        subject('iron', { strengthBand: 'spent', governingArchetype: 'merchant', alignmentPressBand: 'hard' }),
        subject('weak', { strengthBand: 'dominant', exports: ['Silver'] }),
      ],
    });
    const result = negotiateFromPictures(parlayArgs({ responderPicture }));
    expect(result).toEqual({ agreed: false, reason: 'orientation_refused', termSheet: null });
  });

  it('accepts a zero-clause white peace even when the two courts disagree about the harmless orientation', () => {
    const proposerPicture = picture({
      subjects: [subject('iron', { strengthBand: 'ready' }), subject('weak', { strengthBand: 'ready' })],
    });
    const responderPicture = picture({
      id: 'picture.weak.white',
      partyId: 'weak',
      counterpartId: 'iron',
      subjects: [subject('iron', { strengthBand: 'strained' }), subject('weak', { strengthBand: 'strong' })],
    });
    const result = negotiateFromPictures(parlayArgs({ proposerPicture, responderPicture }));
    expect(result.agreed).toBe(true);
    expect(result.reason).toBe('white_peace');
    expect(result.termSheet.clauses).toEqual([]);
    expect(result.termSheet.budgetSpent).toBe(0);
  });

  it('pins every responder refusal limb without a merge or compromise round', () => {
    const offer = [{ type: 'tribute', family: 'economic', magnitude: 0.5, durationTicks: 104, weightSpent: 0.8, burden01: 0 }];
    const base = {
      believedMargin: 0.4,
      whitePeace: false,
      budget: 2,
      clauses: [{ type: 'tribute', family: 'economic', magnitude: 0.5, durationTicks: 104, weightSpent: 0.8, burden01: 0 }],
    };
    expect(compareOfferToResponderDraft(offer, 0.8, { ...base, clauses: [] }).reason).toBe('family_refused');
    expect(compareOfferToResponderDraft(offer, 0.8, { ...base, clauses: [{ ...base.clauses[0], magnitude: 0.4 }] }).reason).toBe('magnitude_refused');
    expect(compareOfferToResponderDraft(offer, 0.8, { ...base, clauses: [{ ...base.clauses[0], durationTicks: 52 }] }).reason).toBe('duration_refused');
    expect(compareOfferToResponderDraft(offer, 0.8, { ...base, clauses: [{ ...base.clauses[0], weightSpent: 0.7 }] }).reason).toBe('weight_refused');
    expect(compareOfferToResponderDraft(offer, 0.8, { ...base, budget: 0.7 }).reason).toBe('budget_refused');
  });

  it('fails closed on crossed pair, episode, relationship, clock, and picture provenance', () => {
    expect(negotiateFromPictures(parlayArgs({ episodeKey: 'war.crossed' })).reason).toBe('episode_mismatch');
    expect(negotiateFromPictures(parlayArgs({ relationshipKey: 'edge.crossed' })).reason).toBe('relationship_mismatch');
    expect(negotiateFromPictures(parlayArgs({ agreedTick: 9 })).reason).toBe('clock_mismatch');
    expect(negotiateFromPictures(parlayArgs({ loserId: 'third' })).reason).toBe('pair_mismatch');
    const accepted = negotiateFromPictures(parlayArgs()).termSheet;
    const crossed = { ...accepted, episodeKey: 'war.crossed' };
    expect(normalizeParlayTermSheet(crossed)).toBeTruthy();
    expect(validateTermSheetAgainstPictures({
      termSheet: crossed,
      proposerPicture: parlayArgs().proposerPicture,
      responderPicture: parlayArgs().responderPicture,
    })).toEqual({ accepted: false, reason: 'provenance_mismatch' });
  });

  it('proves the proposer sheet is byte-exact, not merely below its own budget', () => {
    const args = parlayArgs();
    const accepted = negotiateFromPictures(args).termSheet;
    const clauses = accepted.clauses.map((clause, index) => index === 0
      ? { ...clause, magnitude: Math.max(0, Math.round((clause.magnitude - 0.0001) * 10000) / 10000) }
      : clause);
    const tampered = normalizeParlayTermSheet({ ...accepted, clauses });
    expect(tampered).toBeTruthy();
    expect(validateTermSheetAgainstPictures({
      termSheet: tampered,
      proposerPicture: args.proposerPicture,
      responderPicture: args.responderPicture,
    })).toEqual({ accepted: false, reason: 'proposer_sheet_mismatch' });
  });
});

describe('WR-7b carried sheet materialization', () => {
  it('carries odd stale terms home unchanged and starts every authority clock only there', () => {
    const staleSubjects = [
      subject('iron', {
        strengthBand: 'dominant',
        threatBand: 'decisive',
        foodPressureBand: 'quiet',
        economyPressureBand: 'quiet',
        tradePressureBand: 'quiet',
        governingArchetype: 'military',
        alignmentPressBand: 'merciful',
      }),
      subject('weak', { strengthBand: 'spent', allyStrengthBand: 'quiet' }),
    ];
    const proposerPicture = picture({ subjects: staleSubjects });
    const responderPicture = picture({
      id: 'picture.weak.fallen_town',
      partyId: 'weak',
      counterpartId: 'iron',
      carrier: { kind: 'army', id: 'army.weak.fallen_town' },
      subjects: staleSubjects,
    });
    const agreed = negotiateFromPictures(parlayArgs({ proposerPicture, responderPicture })).termSheet;
    expect(agreed.clauses.some((clause) => clause.type === 'occupation_continuation')).toBe(true);
    const before = JSON.parse(JSON.stringify(agreed));
    // By arrival the town may have fallen and its road may be cut. There is no
    // current-fact argument at this boundary, so the carried territorial clause
    // remains the authority instead of being silently redrafted away.
    const treaty = materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 });
    expect(agreed).toEqual(before);
    expect(treaty.sourceTermSheetId).toBe(agreed.id);
    expect(treaty.sourceErrandId).toBe(agreed.errandId);
    expect(treaty.sourceEncounterId).toBe(agreed.encounterId);
    expect(treaty.termsAgreedTick).toBe(12);
    expect(treaty.signedTick).toBe(40);
    expect(treaty.mintedTick).toBe(40);
    expect(treaty.terms.map((term) => ({
      type: term.type,
      family: term.family,
      magnitude: term.magnitude,
      durationTicks: term.expiresTick - term.mintedTick,
      weightSpent: term.weightSpent,
      burden01: term.burden01,
      ...(term.good ? { good: term.good } : {}),
      ...(term.seam ? { seam: true } : {}),
    }))).toEqual(agreed.clauses);
    expect(treaty.terms.every((term) => term.mintedTick === 40 && term.expiresTick > 40)).toBe(true);
  });

  it('rejects pre-stamped authority clocks, malformed provenance, and arrival before agreement', () => {
    const agreed = negotiateFromPictures(parlayArgs()).termSheet;
    expect(normalizeParlayTermSheet({ ...agreed, mintedTick: 12 })).toBeNull();
    expect(normalizeParlayTermSheet({ ...agreed, encounterId: '' })).toBeNull();
    expect(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 11 })).toBeNull();
    expect(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })))
      .toBe(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })));
  });
});
