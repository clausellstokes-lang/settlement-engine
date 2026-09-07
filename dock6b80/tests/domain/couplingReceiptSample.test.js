/**
 * couplingReceiptSample.test.js — CW-0w slice 3: THE WAR VOLUME'S RECEIPT-FIELD
 * SAMPLE, and the sampler's own proof.
 *
 * Two claims, and the second is the one that matters:
 *   1. GRAMMAR TOTALITY — the address parser covers all 26 live registry rows.
 *      Every address resolves to a KNOWN root kind; an `unknown-root` means the
 *      registry grew a spelling the sampler cannot read, which is exactly the
 *      silent gap this helper exists to close.
 *   2. REAL WRITERS, NOT A FIXTURE ECHO — WR-4's four rows are sampled against
 *      output from the actual `readWarHomeFront` AND the actual trajectory pair
 *      (`evaluateWarCostTrajectory` / `compareWarCostTrajectoryTruth`), each
 *      called with a seeded non-empty world. The recorded
 *      fixture-mirrors-the-deriver hazard is precisely a sample built from keys
 *      the pipeline never writes; here the pulseRecord shape is assembled around
 *      what the real reads RETURN. Booting only the first read left the fourth
 *      row's four fields absent, and the sampler reported it rather than
 *      excusing it — which is the whole point of the helper.
 *
 * SCOPE, STATED HONESTLY (seam SC-9): this wave lands the helper and the
 * state-rooted WAR sample. Rows whose receiptField is a RETURNED read
 * (`readWarPeaceDecision(...)`) are reported UNSAMPLED with their reason and are
 * never counted as satisfied — the sampler's honesty rule. Their per-row real
 * sampling belongs to the WAR volume's convergence wave alongside every other
 * volume's, and the count of still-unsampled rows is frozen below so it can only
 * shrink.
 */
import { describe, expect, test } from 'vitest';

import { COUPLING_REGISTRY, WR4_WAR_COST_COUPLINGS } from '../../src/domain/certification/couplingRegistry.js';
import {
  compareWarCostTrajectoryTruth,
  evaluateWarCostTrajectory,
  readWarHomeFront,
} from '../../src/domain/worldPulse/warCosts.js';
import {
  STATE_ROOTS,
  parseReceiptField,
  resolveReceiptAddress,
  sampleCouplingRow,
} from '../helpers/couplingReceiptSample.js';

/** A seeded, non-empty settlement: stores, imports, institutions, a seat. */
function seededSettlement() {
  return {
    name: 'Ashford',
    tier: 'town',
    population: 900,
    config: { tier: 'town', tradeRouteAccess: 'road' },
    economicState: {
      primaryImports: [{ id: 'grain', label: 'Grain' }],
      primaryExports: [{ id: 'iron', label: 'Iron' }],
      foodSecurity: { storageMonths: 1, stockpile: { capacityMonths: 4, deployed: true } },
    },
    institutions: [{ id: 'temple', name: 'Temple of Dawn' }],
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Stable' },
      factions: [{ id: 'civic-council', name: 'Civic Council', isGoverning: true }],
    },
    activeConditions: [],
    npcs: [],
  };
}

function seededSnapshot() {
  const rows = [
    { id: 'actor', name: 'Ashford', settlement: seededSettlement() },
    { id: 'peer', name: 'Reedbank', settlement: { name: 'Reedbank' } },
  ];
  return { byId: new Map(rows.map((row) => [row.id, row])), regionalGraph: { edges: [] } };
}

/**
 * Call the REAL reads and file their returns where WR-4's rows say they land.
 * All four rows address ONE `warTerminationReads[]` entry, and TWO different
 * reads write it: readWarHomeFront supplies the components, and the trajectory
 * pair supplies the believed/truth bands. Booting only the first left the
 * fourth row's fields absent — which the sampler reported rather than excused.
 */
function realWarTerminationRead() {
  const homeFront = readWarHomeFront({
    actorId: 'actor',
    deployment: { targetId: 'peer', sinceTick: 2, deploymentAge: 30, manpower: 0.7, currentEffectiveStrength: 40, maxStartStrength: 55 },
    worldState: { tick: 32, routeNetwork: null, spatialLedgers: {} },
    snapshot: seededSnapshot(),
  });
  const believed = evaluateWarCostTrajectory({
    priorBelievedBand: 'matched',
    currentBelievedBand: 'behind',
  });
  const truth = compareWarCostTrajectoryTruth({
    believedTrajectory: believed.trajectory,
    priorTruthBand: 'matched',
    currentTruthBand: 'ahead',
  });
  return { homeFront, believed, truth };
}

const REAL = realWarTerminationRead();

describe('CW-0w receipt sampler — the address grammar covers the live registry', () => {
  test('every address on every row parses to a known root kind', () => {
    expect(COUPLING_REGISTRY.length).toBeGreaterThan(0);
    const unknown = [];
    let addresses = 0;
    for (const row of COUPLING_REGISTRY) {
      for (const parsed of parseReceiptField(row.receiptField)) {
        addresses += 1;
        if (parsed.rootKind === 'unknown-root') {
          unknown.push(`${row.couplingId}: '${parsed.raw}' has root '${parsed.root}', which is neither`
            + ` a state root (${STATE_ROOTS.join(', ')}) nor a returned read.`);
        }
      }
    }
    // Non-empty floor: a parser that matched nothing would report zero unknowns.
    expect(addresses).toBeGreaterThan(COUPLING_REGISTRY.length);
    expect(unknown).toEqual([]);
  });

  test('the parser really decomposes an address rather than passing it through', () => {
    const [parsed] = parseReceiptField(
      'pulseRecord.warCoalitionEvidence[kind=coalition_joined|coalition_refused].{decision,booksDirection}',
    );
    expect(parsed.rootKind).toBe('pulseRecord');
    expect(parsed.segments.map((segment) => segment.name)).toEqual(['warCoalitionEvidence']);
    expect(parsed.segments[0].filter).toBe('kind=coalition_joined|coalition_refused');
    expect(parsed.leafFields).toEqual(['decision', 'booksDirection']);
  });

  test('a nested leaf group flattens to dotted field paths', () => {
    const [parsed] = parseReceiptField(
      'worldState.factionPairStates[...].incidents[].{type,context.{decisionId,actualAction}}',
    );
    expect(parsed.leafFields).toEqual(['type', 'context.decisionId', 'context.actualAction']);
  });
});

describe('CW-0w receipt sampler — WR-4 sampled against the REAL home-front read', () => {
  test('the real read returned a seeded, non-empty home front', () => {
    // The anti-vacuity anchor. Every "the field landed" claim below is worthless
    // if the read returned nothing, so the read's own output is asserted first.
    expect(REAL.homeFront).toBeTruthy();
    for (const component of ['roads', 'markets', 'hands', 'institutions']) {
      expect(REAL.homeFront.components?.[component], component).toBeTruthy();
    }
    // The trajectory pair really fired too: a misread is only observable when
    // both reads returned receipts, so this is the second writer's anchor.
    expect(REAL.believed.trajectory).toBe('losing');
    expect(REAL.truth.receipt, 'the truth comparison returned no receipt').toBeTruthy();
    expect(REAL.truth.misread).toBe(true);
  });

  test('each WR-4 row\'s named component fields are present on the real output', () => {
    const pulseRecord = {
      warTerminationReads: [{
        homeFrontComponents: REAL.homeFront.components,
        believedBalanceBand: REAL.believed.receipt.currentBelievedBand,
        truthBalanceBand: REAL.truth.receipt.currentTruthBand,
        trajectory: REAL.believed.trajectory,
        trajectoryMisread: REAL.truth.misread,
      }],
    };
    const absent = [];
    let sampled = 0;
    for (const row of WR4_WAR_COST_COUPLINGS) {
      for (const { parsed, result } of sampleCouplingRow(row, { pulseRecord })) {
        expect(result.status, `${row.couplingId}: ${parsed.raw} — ${result.reason ?? ''}`).toBe('sampled');
        sampled += 1;
        if (result.absentFields.length) {
          absent.push(`${row.couplingId}: ${parsed.raw} names ${result.absentFields.join(', ')},`
            + ' which the real read never wrote.');
        }
      }
    }
    expect(sampled).toBe(WR4_WAR_COST_COUPLINGS.length);
    expect(absent).toEqual([]);
  });

  test('NEGATIVE CONTROL: a renamed leaf field is reported absent, not excused', () => {
    // Guard-the-guard. If the sampler reported "present" for a field the writer
    // does not write, every green above would be meaningless.
    const pulseRecord = { warTerminationReads: [{ homeFrontComponents: { roads: { band: 'quiet' } } }] };
    const [parsed] = parseReceiptField(
      'pulseRecord.warTerminationReads[].homeFrontComponents.roads.{band,stateReadTypo}',
    );
    const result = resolveReceiptAddress(parsed, { pulseRecord });
    expect(result.status).toBe('sampled');
    expect(result.presentFields).toEqual(['band']);
    expect(result.absentFields).toEqual(['stateReadTypo']);
  });

  test('an address the sampler cannot resolve is UNSAMPLED with a reason, never a pass', () => {
    const [returned] = parseReceiptField('readWarPeaceDecision(...).receipt.{decision,reason}');
    const result = resolveReceiptAddress(returned, { pulseRecord: {} });
    expect(returned.rootKind).toBe('returned-read');
    expect(result.status).toBe('unsampled');
    expect(result.reason).toContain('RETURNED read');
    // A missing root is also honest rather than silently satisfied.
    const [stateRooted] = parseReceiptField('worldState.envoyErrands[state=home].{id,npcId}');
    expect(resolveReceiptAddress(stateRooted, { pulseRecord: {} }).status).toBe('unsampled');
  });

  test('the still-unsampled row count is FROZEN and can only shrink (seam SC-9)', () => {
    // Rows whose every address is a returned read cannot be sampled from state.
    // Freezing the count keeps the debt visible: each volume's convergence wave
    // lowers it, and a NEW row that hides behind a returned-read address raises
    // it and reds here.
    const returnedOnly = COUPLING_REGISTRY.filter((row) => parseReceiptField(row.receiptField)
      .every((parsed) => parsed.rootKind === 'returned-read'));
    expect(returnedOnly.map((row) => row.couplingId).sort()).toEqual([
      'CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price',
      'CPL-21.INTERIOR_TO_GRAMMAR.WR-5.seat_acceptance',
      'CPL-3.POP_TO_WAR.WR-3.lineage',
      'CPL-5.WAR_TO_GRAMMAR.WR-5.bilateral_peace',
    ]);
  });
});
