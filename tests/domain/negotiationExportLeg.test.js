/**
 * TCD-2 — THE NEGOTIATION PICTURE'S EXPORT LEG, pinned against REAL generator output.
 *
 * THE DEFECT THIS GUARDS. Both negotiation-picture mints — the envoy court
 * picture (`envoyNegotiationPictureBuilder.ownExportsOf`) and the army transit
 * picture (`armyTransitKernel.exportPictureOf`) — probed
 * `settlement.economicState.exports`, and the envoy one also probed
 * `settlement.economy` and `settlement.trade`. The economy generator writes none
 * of the three; it writes `economicState.primaryExports`, and `exports` survives
 * only as a legacy save alias. Measured through the full pipeline: 0 of 60
 * generated settlements carried any of the three probed containers, 60 of 60
 * carried `primaryExports`. So both mints answered `unknown` for every
 * settlement in production and their `known` arms were structurally unreachable
 * — every negotiation picture said "exports unknown", and
 * `appraiseLoserPortfolioFromInputs` therefore appraised NO export term at all,
 * because a null `loserExports` omits the whole `export_flows` asset class.
 *
 * ⚠ THESE PINS MUST NOT BE MOVED ONTO A FIXTURE. A hand-built
 * `{ economicState: { exports: [...] } }` fixture is a record no generator makes,
 * and a fixture of exactly that shape is what let the dead arm read green for as
 * long as it did — the fixture mirrored the reader instead of the writer. Every
 * expectation below is DERIVED from the settlement under test, and the corpus is
 * multi-seed across every tier so no single lucky world can carry the suite.
 *
 * ⚠ THE SEED MUST ARRIVE. `generateSettlementPipeline(config, seed)` puts the
 * seed in the `importedNeighbour` slot, where a non-object is silently discarded
 * and generation falls through to a random seed. The corpus builder therefore
 * asserts `_seed` came back, so a mis-spelled call cannot quietly turn these
 * pins into a re-randomised lottery.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { canonExports, canonExportsPresent } from '../../src/domain/canonicalAccessors.js';
import {
  createNegotiationPicture,
  normalizeNegotiationPicture,
} from '../../src/domain/worldPulse/negotiationPictures.js';
import { negotiationExportLeg } from '../../src/domain/worldPulse/negotiationPicturesExportLeg.js';
import { appraiseLoserPortfolioFromInputs } from '../../src/domain/worldPulse/peaceTerms.js';

const TIERS = Object.freeze(['hamlet', 'village', 'town', 'city', 'metropolis']);

/** Real worlds, six seeds × every tier — never one lucky settlement. */
function corpus() {
  const rows = [];
  for (let index = 0; index < 6; index += 1) {
    for (const settType of TIERS) {
      const seed = `tcd2-${settType}-${index}`;
      let settlement;
      try {
        settlement = generateSettlementPipeline({ settType }, null, { seed, customContent: {} });
      } catch {
        continue;
      }
      // The seed-slot guard: a discarded seed makes every pin below a lottery.
      if (!settlement || settlement._seed !== seed) continue;
      rows.push({ id: `${settType}-${index}`, seed, settlement });
    }
  }
  return rows;
}

const ROWS = corpus();

/** The picture-subject shape the schema demands, wrapped around one export leg. */
function subjectWith(settlementId, leg) {
  return {
    settlementId,
    strengthBand: 'ready',
    governingArchetype: 'merchant',
    alignmentPressBand: 'measured',
    ...leg,
  };
}

describe('TCD-2 negotiation picture export leg', () => {
  it('the corpus is real, seeded, and every settlement reached the generator', () => {
    // The denominator. If this collapses, every pin below goes vacuous silently
    // — which is exactly how the defect class under guard propagates.
    expect(ROWS.length).toBe(TIERS.length * 6);
    expect(ROWS.every((row) => row.settlement._seed === row.seed)).toBe(true);
  });

  it('the three containers the old readers probed are written by nothing', () => {
    // This is the pin that says the pre-fix reader COULD NOT have worked. If the
    // generator ever starts writing `economicState.exports`, this reds and the
    // alias question gets re-opened deliberately rather than by accident.
    const carriers = ROWS.filter((row) => Array.isArray(row.settlement.economicState?.exports)
      || row.settlement.economy !== undefined
      || row.settlement.trade !== undefined);
    expect(carriers.map((row) => row.id)).toEqual([]);
    expect(ROWS.length).toBeGreaterThan(0);
  });

  it('the live container is total across the corpus, and holds plain labels', () => {
    const withPrimary = ROWS.filter((row) => Array.isArray(row.settlement.economicState?.primaryExports));
    expect(withPrimary.length).toBe(ROWS.length);
    // The element shape is ASSERTED, not assumed — the leg's string branch is
    // what resolves these, and an object-shaped row would need the keyed branch.
    const allLabels = ROWS.flatMap((row) => canonExports(row.settlement));
    expect(allLabels.length).toBeGreaterThan(0);
    expect(allLabels.every((label) => typeof label === 'string')).toBe(true);
  });

  it('every settlement in the corpus now reports KNOWN exports', () => {
    // A TOTAL positive predicate, not a spot check: the count of settlements the
    // leg can read must equal the whole corpus. Re-pointing the leg at any of
    // the dead containers drops this to zero.
    const known = ROWS.filter((row) => negotiationExportLeg(row.settlement).exportKnowledge === 'known');
    expect(known.length).toBe(ROWS.length);
    expect(ROWS.every((row) => canonExportsPresent(row.settlement))).toBe(true);
  });

  it('the reported exports are exactly the writer\'s own labels, deduped and ordered', () => {
    // Derived from the writer on every row — never transcribed. A leg that
    // returned `known` with an empty list on a settlement that really exports
    // something would red here even though the previous pin stayed green.
    let nonEmpty = 0;
    for (const row of ROWS) {
      const raw = canonExports(row.settlement);
      const expected = [...new Set(raw.map((label) => String(label).trim()).filter(Boolean))].sort();
      const leg = negotiationExportLeg(row.settlement);
      expect(leg.exports).toEqual(expected);
      if (leg.exports.length) nonEmpty += 1;
    }
    // The defect's signature was an empty list everywhere. Most real settlements
    // export something, so a majority must be non-empty for this to mean anything.
    expect(nonEmpty).toBeGreaterThan(ROWS.length / 2);
  });

  it('knowledge and emptiness stay apart', () => {
    // An authored-but-empty list is a court that knows its rival ships nothing
    // (peaceTermsAppraisal drafts tribute); an absent list is real ignorance, for
    // which no export term is appraised at all. Collapsing the two would be a
    // silent behaviour change in peace drafting.
    expect(negotiationExportLeg({ economicState: {} })).toEqual({ exportKnowledge: 'unknown', exports: [] });
    expect(negotiationExportLeg({})).toEqual({ exportKnowledge: 'unknown', exports: [] });
    expect(negotiationExportLeg({ economicState: { primaryExports: [] } }))
      .toEqual({ exportKnowledge: 'known', exports: [] });
  });

  it('the legacy save alias still resolves, and object rows keep their labels', () => {
    // canonExports' whole reason for existing: old saves carry `exports`. The fix
    // must not trade one dead field for another.
    expect(negotiationExportLeg({ economicState: { exports: ['Salt', 'Salt', ' Wool '] } }))
      .toEqual({ exportKnowledge: 'known', exports: ['Salt', 'Wool'] });
    expect(negotiationExportLeg({ economicState: { exports: [{ name: 'Tin' }, { good: 'Amber' }] } }))
      .toEqual({ exportKnowledge: 'known', exports: ['Amber', 'Tin'] });
    // Canonical wins over the legacy alias when both are present.
    expect(negotiationExportLeg({ economicState: { primaryExports: ['Iron'], exports: ['Stale'] } }))
      .toEqual({ exportKnowledge: 'known', exports: ['Iron'] });
  });

  it('a minted picture carrying the leg survives the normalize round-trip unchanged', () => {
    // The leg's ordering must equal what `createSubject` re-derives, or
    // `normalizeSubject`'s JSON-identity check rejects the whole picture on
    // rehydration and the mint silently becomes null.
    let checked = 0;
    for (const row of ROWS) {
      const leg = negotiationExportLeg(row.settlement);
      const picture = createNegotiationPicture({
        id: `negotiation_picture:${row.id}`,
        carrier: { kind: 'court', id: 'carrier-1' },
        partyId: 'alpha',
        counterpartId: 'beta',
        relationshipKey: 'alpha|beta',
        episodeKey: 'episode-1',
        frontOwnerId: 'alpha',
        frontSinceTick: 0,
        capturedTick: 1,
        causeStatus: 'live',
        subjects: [subjectWith('alpha', leg), subjectWith('beta', leg)],
        evidenceIds: [],
      });
      expect(picture).not.toBeNull();
      expect(normalizeNegotiationPicture(picture)).toEqual(picture);
      expect(picture.subjects[0].exports).toEqual(leg.exports);
      expect(picture.subjects[0].exportKnowledge).toBe(leg.exportKnowledge);
      checked += 1;
    }
    expect(checked).toBe(ROWS.length);
  });

  it('the appraisal now reaches its export term, and did not before', () => {
    // The consequence, pinned at the consumer. `loserExports: null` is exactly
    // what an `unknown` leg produced through negotiationPictures.js, and it omits
    // the entire export_flows asset class from the drafted peace.
    const row = ROWS.find((entry) => negotiationExportLeg(entry.settlement).exports.length);
    expect(row).toBeDefined();
    const leg = negotiationExportLeg(row.settlement);
    const inputs = {
      believedLoserStrength: 0.6,
      victorFoodPressure01: 0.5,
      victorEconomyPressure01: 0.5,
      victorTradePressure01: 0.5,
      victorThreat01: 0.4,
      loserAllyStrength01: 0.3,
      victorArchetype: 'merchant',
      restitutionClaim01: null,
    };
    const classesOf = (assets) => assets.map((asset) => asset.assetClass);

    const beforeFix = appraiseLoserPortfolioFromInputs({ ...inputs, loserExports: null });
    expect(classesOf(beforeFix)).not.toContain('export_flows');

    const afterFix = appraiseLoserPortfolioFromInputs({ ...inputs, loserExports: leg.exports });
    expect(classesOf(afterFix)).toContain('export_flows');
    // The named good comes from the writer's own list, not from a constant.
    const flows = afterFix.find((asset) => asset.assetClass === 'export_flows');
    expect(flows.good).toBe(leg.exports[0]);
    expect(flows.termType).not.toBe('tribute');
  });
});
