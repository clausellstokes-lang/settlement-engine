/**
 * tests/domain/events/generosityVerbs.test.js — FORCE_RELIEF / OFFER_CREDIT
 * (FP-G3: the generosity engine's counterpart DM-verbs — the Counterpart Criterion paid).
 *
 * The pins:
 *  1. COUNTERPART FIDELITY — the handler runs the SAME structural gate the organic
 *     mover runs (generosityGate.qualifiesForGenerosity; the generosityEV re-export is
 *     the identical function object), honours the same hard reserve floor (behavioral
 *     parity against STOCKPILE_TUNING.reserveTitheFloorMonths — the handler's mirrored
 *     constant cannot drift silently), and floors grain to the tenth-month exactly like
 *     the conserved sink.
 *  2. THE VETO LADDER — unlinked neighbour / non-qualifying bond / zero-grain decree
 *     each refuse with a typed code (never a phantom gift — the E1d zero-grain class,
 *     closed on the mover's give path this same wave) and the lazy VETO_PROSE teaches.
 *  3. THE WRITES — grain debit (tenth-month), the dual-written atEventId-stamped
 *     annotation ledger (_forcedRelief / _offeredCredit), FORCE_RELIEF's legitimacy
 *     nudge (lean town pays, comfortable town earns — the mover's §9 twin), and
 *     OFFER_CREDIT's no-legitimacy law (a loan is not charity — the purchase precedent).
 *  4. PREVIEW ≡ APPLY through the live pipeline + dial clampAtCommit (out-of-band
 *     magnitude commits like the bound; garbage falls to the default).
 */
import { describe, it, expect } from 'vitest';
import { runEventPipeline } from '../../../src/domain/events/eventPipeline.js';
import { mutateSettlementChecked } from '../../../src/domain/events/mutate.js';
import { qualifiesForGenerosity as gateFn, normalizeBondKind } from '../../../src/domain/spatial/generosityGate.js';
import { qualifiesForGenerosity as evReexport } from '../../../src/domain/spatial/generosityEV.js';
import { STOCKPILE_TUNING } from '../../../src/domain/worldPulse/foodStockpile.js';
import { GENEROSITY_MOVER_TUNING } from '../../../src/domain/worldPulse/generosityKernel.js';
import { vetoProse, AFFORDANCE_MANIFEST, RELIEF_MAGNITUDE_VALUES } from '../../../src/domain/events/affordanceManifest.js';

const NOW = '2026-01-01T00:00:00.000Z';

/** A minimal pipeline-shaped settlement with a qualifying + a cold neighbour link. */
function town({ storageMonths = 6, legitimacy = 50 } = {}) {
  return {
    name: 'Thornwall',
    population: 1200,
    tier: 'town',
    institutions: [{ id: 'i1', name: 'Granary' }],
    powerStructure: {
      publicLegitimacy: { score: legitimacy, label: 'Stable' },
      factions: [{ id: 'f1', name: 'Council', faction: 'Council' }],
    },
    npcs: [{ id: 'n1', name: 'Mira' }],
    config: { nearbyResources: ['timber'] },
    economicState: { foodSecurity: { storageMonths, deficitPct: 0, surplusPct: 0 } },
    neighbourNetwork: [
      { id: 'nbr.marchmont', name: 'Marchmont', relationshipType: 'allied' },
      { id: 'nbr.coldpass', name: 'Coldpass', relationshipType: 'neutral' },
      { id: 'nbr.saltford', name: 'Saltford', relationshipType: 'trade_partners' }, // legacy plural
    ],
  };
}

const relief = (over = {}) => ({
  id: 'ev_force_relief', type: 'FORCE_RELIEF', targetId: 'Marchmont',
  payload: { magnitude: 0.5 }, cause: 'player_action', ...over,
});
const credit = (over = {}) => ({
  id: 'ev_offer_credit', type: 'OFFER_CREDIT', targetId: 'Marchmont',
  payload: { magnitude: 0.5 }, cause: 'player_action', ...over,
});

const months = (s) => s.economicState.foodSecurity.storageMonths;
const legit = (s) => s.powerStructure.publicLegitimacy.score;
const vetoOf = (s, event) => mutateSettlementChecked({ settlement: s, event, now: NOW }).veto;

describe('counterpart fidelity — the same gate, the same floor (the same-function law)', () => {
  it('the generosityEV re-export IS the leaf gate function (single source, one law)', () => {
    expect(evReexport).toBe(gateFn);
  });

  it('the handler reserve-floor mirror agrees with STOCKPILE_TUNING (behavioral parity)', () => {
    // AT the mover's floor: spareable = 0 ⇒ a full-magnitude decree still vetoes.
    const floor = Number(STOCKPILE_TUNING.reserveTitheFloorMonths);
    const atFloor = vetoOf(town({ storageMonths: floor }), relief({ payload: { magnitude: 1 } }));
    expect(atFloor?.code).toBe('relief_nothing_to_send');
    // ONE month above it: exactly that month is spareable ⇒ magnitude 1 sends 1.0.
    const r = mutateSettlementChecked({ settlement: town({ storageMonths: floor + 1 }), event: relief({ payload: { magnitude: 1 } }), now: NOW });
    expect(r.veto).toBeNull();
    expect(months(r.settlement)).toBe(floor);
  });

  it('the legitimacy mirror agrees with GENEROSITY_MOVER_TUNING (cost 3 / lift 1)', () => {
    expect(GENEROSITY_MOVER_TUNING.LEGITIMACY_COST).toBe(3);
    expect(GENEROSITY_MOVER_TUNING.LEGITIMACY_LIFT).toBe(1);
    // Lean after the gift (2 → 1.0 months) at magnitude 1 ⇒ the full cost, −3.
    const lean = mutateSettlementChecked({ settlement: town({ storageMonths: 2 }), event: relief({ payload: { magnitude: 1 } }), now: NOW });
    expect(legit(lean.settlement)).toBe(47);
    // Comfortable (6 → 3.5 months) ⇒ the small granary-city lift, +1.
    const comf = mutateSettlementChecked({ settlement: town({ storageMonths: 6 }), event: relief(), now: NOW });
    expect(legit(comf.settlement)).toBe(51);
  });

  it('the legacy plural trade_partners link qualifies through normalizeBondKind', () => {
    expect(normalizeBondKind('trade_partners')).toBe('trade_partner');
    const r = mutateSettlementChecked({ settlement: town(), event: relief({ targetId: 'Saltford' }), now: NOW });
    expect(r.veto).toBeNull();
    expect(months(r.settlement)).toBe(3.5);
  });
});

describe('the veto ladder — a decree never mints a phantom gift', () => {
  it('an unlinked neighbour refuses (neighbour_not_linked) and the prose teaches', () => {
    const v = vetoOf(town(), relief({ targetId: 'Nowhere' }));
    expect(v?.code).toBe('neighbour_not_linked');
    expect(vetoProse(v.code, v.detail)).toContain('Nowhere');
  });

  it('a non-qualifying (neutral) neighbour refuses: the DM overrides willingness, never the law', () => {
    const vRelief = vetoOf(town(), relief({ targetId: 'Coldpass' }));
    expect(vRelief?.code).toBe('relief_unqualified');
    expect(vetoProse(vRelief.code, vRelief.detail)).toContain('Coldpass');
    const vCredit = vetoOf(town(), credit({ targetId: 'Coldpass' }));
    expect(vCredit?.code).toBe('credit_unqualified');
  });

  it('ZERO-GRAIN DECREE: a sliver above the floor moves nothing ⇒ veto, not a phantom gift (the E1d class)', () => {
    // 1.05 months: spareable 0.05; even magnitude 1 floors to 0.0 tenth-months.
    const v = vetoOf(town({ storageMonths: 1.05 }), relief({ payload: { magnitude: 1 } }));
    expect(v?.code).toBe('relief_nothing_to_send');
    const vc = vetoOf(town({ storageMonths: 1.05 }), credit({ payload: { magnitude: 1 } }));
    expect(vc?.code).toBe('credit_nothing_to_lend');
    expect(vetoProse('relief_nothing_to_send', '')).toContain('reserve floor');
  });

  it('a vetoed decree commits NOTHING through the pipeline (no deltas, no narration)', () => {
    const s = town({ storageMonths: 1.05 });
    const r = runEventPipeline(s, relief({ payload: { magnitude: 1 } }));
    expect(r.warnings.some(w => w.severity === 'veto' && w.code === 'relief_nothing_to_send')).toBe(true);
    expect(months(r.nextSettlement)).toBe(1.05);
    expect(r.systemStateDeltas).toEqual([]);
  });
});

describe('the writes — grain, annotation, legitimacy', () => {
  it('FORCE_RELIEF: tenth-month grain debit + the dual-written _forcedRelief annotation', () => {
    const base = town(); // _config absent — config-only write
    const r = mutateSettlementChecked({ settlement: base, event: relief(), now: NOW });
    expect(r.veto).toBeNull();
    // 6 − floor(0.5 × 5 × 10)/10 = 6 − 2.5 = 3.5.
    expect(months(r.settlement)).toBe(3.5);
    const ann = r.settlement.config._forcedRelief;
    expect(ann).toHaveLength(1);
    expect(ann[0]).toMatchObject({ to: 'Marchmont', monthsSent: 2.5, magnitude: 0.5, atEventId: 'ev_force_relief' });
    // The _config mirror follows when _config exists (the cutTradeRoute discipline).
    const withRaw = { ...town(), _config: { settType: 'town' } };
    const r2 = mutateSettlementChecked({ settlement: withRaw, event: relief(), now: NOW });
    expect(r2.settlement._config._forcedRelief).toEqual(r2.settlement.config._forcedRelief);
  });

  it('OFFER_CREDIT: the same grain leg, the _offeredCredit ledger, and NO legitimacy move (a loan is not charity)', () => {
    const r = mutateSettlementChecked({ settlement: town(), event: credit(), now: NOW });
    expect(r.veto).toBeNull();
    expect(months(r.settlement)).toBe(3.5);
    expect(r.settlement.config._offeredCredit[0]).toMatchObject({ to: 'Marchmont', monthsSent: 2.5, atEventId: 'ev_offer_credit' });
    expect(r.settlement.config._forcedRelief).toBeUndefined();
    expect(legit(r.settlement)).toBe(50); // untouched
  });
});

describe('preview ≡ apply through the live pipeline + dial clampAtCommit', () => {
  it('two pipeline runs of the same decree are identical (preview ≡ apply)', () => {
    const s = town();
    const a = runEventPipeline(s, relief());
    const b = runEventPipeline(s, relief());
    expect(a.afterSystemState).toEqual(b.afterSystemState);
    expect(a.systemStateDeltas).toEqual(b.systemStateDeltas);
    expect(months(a.nextSettlement)).toBe(months(b.nextSettlement));
    expect(a.warnings.filter(w => w.severity === 'veto')).toEqual([]);
  });

  it('an out-of-band magnitude (5) commits exactly like magnitude 1; garbage falls to the default', () => {
    const s = town();
    const wild = runEventPipeline(s, relief({ payload: { magnitude: 5 } }));
    const bound = runEventPipeline(s, relief({ payload: { magnitude: 1 } }));
    expect(months(wild.nextSettlement)).toBe(months(bound.nextSettlement));
    expect(wild.systemStateDeltas).toEqual(bound.systemStateDeltas);
    const garbage = runEventPipeline(s, relief({ payload: { magnitude: 'heaps' } }));
    const dflt = runEventPipeline(s, relief({ payload: {} }));
    expect(months(garbage.nextSettlement)).toBe(months(dflt.nextSettlement));
    expect(garbage.systemStateDeltas).toEqual(dflt.systemStateDeltas);
  });

  it('the manifest predicate and target options run the SAME gate (grays the doomed action)', () => {
    const verb = AFFORDANCE_MANIFEST.FORCE_RELIEF;
    // A town with only a neutral link: unavailable, with teaching reasons + unlocks.
    const cold = { ...town(), neighbourNetwork: [{ id: 'nbr.coldpass', name: 'Coldpass', relationshipType: 'neutral' }] };
    const p1 = verb.predicate(cold, {});
    expect(p1.available).toBe(false);
    expect(p1.reasons.length).toBeGreaterThan(0);
    expect(p1.unlocks.length).toBeGreaterThan(0);
    // At the reserve floor: unavailable for the floor reason.
    const p2 = verb.predicate(town({ storageMonths: 1 }), {});
    expect(p2.available).toBe(false);
    // A qualifying link + surplus: available, and the target list is ONLY the qualifying links.
    const p3 = verb.predicate(town(), {});
    expect(p3.available).toBe(true);
    expect(verb.targetOptions(town()).map(o => o.id).sort()).toEqual(['Marchmont', 'Saltford']);
    // The band dial carries the engine numbers (words at the table).
    expect(RELIEF_MAGNITUDE_VALUES.measured).toBe(0.5);
    expect(verb.dials[0].bandWords).toBe(RELIEF_MAGNITUDE_VALUES);
  });
});
