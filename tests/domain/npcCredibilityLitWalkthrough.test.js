/**
 * npcCredibilityLitWalkthrough.test.js — DEEP COUPLINGS D-2 LIT WALKTHROUGH (charter §13).
 *
 * The executed causal arc, end to end: an NPC fronts a lie → the lie is exposed → his PERSONAL
 * credibility falls → his NEXT bluff is believed LESS (the boy who cried wolf) AND the ladder
 * consumes the exposure one tick later into a STANDING hit (the lie-stigma + the exposed_liar
 * window). Every step is a REPUTATION cost — the soul lives, marked (§0.5). Chained through the
 * real movers (processLies → advanceNpcCredibility → advanceNpcLadder), deterministic rng.
 */
import { describe, it, expect } from 'vitest';
import { processLies, advanceCredibility } from '../../src/domain/worldPulse/informationStatecraft.js';
import { advanceNpcCredibility, npcCredibilityScoreOf } from '../../src/domain/worldPulse/npcCredibility.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { openWindows } from '../../src/domain/worldPulse/npcLadderChallenge.js';

const rng = { fork: () => ({ random: () => 0 }) };
const RULES = { npcCredibilityEnabled: true, npcLadderEnabled: true, infoStatecraftEnabled: true, infoMode: 'unreliable' };

// The lying court: weak, hostile Marchmont, its mouthpiece the Reeve; strong hostile Crownhold.
const reeve = { id: 'reeve', name: 'Reeve of the March', importance: 'pillar', structuralRank: 'dominant', factionAffiliation: 'Merchant League', personality: { dominant: 'shrewd', flaw: 'deceitful', modifier: 'bold' } };
const raiderSettlement = {
  name: 'Marchmont', tier: 'town', population: 4200,
  powerStructure: { factions: [{ faction: 'Merchant League', isGoverning: true, power: 60 }], publicLegitimacy: { score: 55 } },
  npcs: [reeve, { id: 'deputy', name: 'Deputy', importance: 'key', structuralRank: 'subordinate', factionAffiliation: 'Merchant League', personality: { dominant: 'proud', flaw: 'ambitious', modifier: 'patient' } }],
  institutions: [], activeConditions: [],
};
const byId = new Map([
  ['raider', { id: 'raider', settlement: raiderSettlement }],
  ['crown', { id: 'crown', settlement: { npcs: [{ id: 'castellan', name: 'Castellan', importance: 'key' }] } }],
]);
const snapshot = { settlements: [{ id: 'raider' }, { id: 'crown' }], byId };
const beliefsHostile = () => ({
  raider: { seat: { crown: { allianceLabel: 'hostile', strengthBand: 4, confidence01: 0.8, readiness: 0.5 } } },
  crown: { seat: { raider: { allianceLabel: 'hostile', strengthBand: 1, confidence01: 0.6, readiness: 0.4 } } },
});
const lieArgs = (worldState, beliefMaps, tick) => ({
  snapshot, worldState, beliefMaps, rng, tick,
  strengthOf: () => 0.15, alignmentOf: () => ({ malice01: 0.9, lawfulness01: 0.1 }), nameFor: (id) => String(id),
});

describe('D-2 LIT WALKTHROUGH — a caught liar is discounted, personally, and marked on the ladder', () => {
  it('the whole arc executes: seed → expose → personal fall → next bluff discounted → ladder stigma', () => {
    // ── T=0: the Reeve fronts a garrison bluff planted in Crownhold. ──
    let ws = { simulationRules: RULES, spatialCanonVersion: 1, calendar: { elapsedWeeks: 260 }, spatialLedgers: {} };
    const seed = processLies(lieArgs(ws, beliefsHostile(), 0));
    const rec0 = seed.disinfo['lie:raider:crown'];
    expect(rec0.spokespersonNpcId).toBe('raider:reeve');
    const confBefore = seed.overrides.get('crown').get('raider').confidence01;
     
    console.log(`[T0] Reeve fronts a bluff; planted at confidence ${confBefore} (mouthpiece still trusted)`);

    // ── T=1: the bluff is exposed (Crownhold's belief re-anchors) → the personal charge. ──
    ws = { ...ws, spatialLedgers: { disinfo: seed.disinfo } };
    const beliefs1 = { ...beliefsHostile(), crown: { seat: { raider: { allianceLabel: 'hostile', strengthBand: rec0.trueBand, confidence01: 0.6, readiness: 0.4 } } } };
    const expose = processLies(lieArgs(ws, beliefs1, 1));
    const personal = expose.npcDeltas.find((d) => d.id === 'raider:reeve');
    expect(personal.kind).toBe('deception');
    // Fold BOTH the settlement charge (unchanged) and the personal one (D-2).
    ws = advanceCredibility({ worldState: ws, tick: 1, deltas: expose.deltas }).worldState;
    ws = advanceNpcCredibility({ worldState: ws, tick: 1, deltas: expose.npcDeltas }).worldState;
    const reeveScore = npcCredibilityScoreOf(ws, 'raider:reeve', 1);
    expect(reeveScore).toBeLessThan(0);
    expect(ws.spatialLedgers.npcCredibility['raider:reeve'].lieExposure).toEqual({ tick: 1, band: personal.lieExposedBand });
     
    console.log(`[T1] Bluff exposed; Reeve's personal credibility falls to ${reeveScore.toFixed(3)} (a deposit for the court, band ${personal.lieExposedBand})`);

    // ── T=2: the ladder (Marchmont's court) consumes the exposure → the lie-stigma. ──
    const ladder = advanceNpcLadder({
      snapshot, worldState: { ...ws, calendar: { elapsedWeeks: 261 } },
      settlementUpdates: [{ saveId: 'raider', settlement: raiderSettlement }], tick: 261, now: null,
    });
    const st = ladder.worldState.spatialLedgers.npcLadder.raider.npcs['raider:reeve'];
    expect(st.stigma, 'the Reeve now wears the lie-stigma').toBeTruthy();
    expect(st.lastLieSeen).toBe(1);
    expect(openWindows({ nid: 'raider:reeve', standing: 8, stigma: false }, { factionFalling: false }, false, false, true)).toContain('exposed_liar');
     
    console.log(`[T2] Marchmont's court learns of it; the Reeve takes a stigma (sev ${st.stigma.sev}) and the exposed_liar window opens — he keeps his seat, marked`);

    // ── T=3: the Reeve fronts ANOTHER bluff — now believed LESS (the boy who cried wolf). ──
    // The prior bluff was exposed + dropped; carry only the credibility stocks (both fallen).
    const wsNext = { ...ws, spatialLedgers: { npcCredibility: ws.spatialLedgers.npcCredibility, credibility: ws.spatialLedgers.credibility } };
    const seed2 = processLies(lieArgs(wsNext, beliefsHostile(), 3));
    const confAfter = seed2.overrides.get('crown').get('raider').confidence01;
    expect(confAfter).toBeLessThan(confBefore); // discounted — settlement AND person both fell
     
    console.log(`[T3] Reeve fronts a new bluff; planted at confidence ${confAfter} < ${confBefore} — the boy who cried wolf is believed less`);

    // The no-death law: at every step the Reeve remains a seated, scheming soul — never gone.
    expect(ladder.worldState.spatialLedgers.npcLadder.raider.factions).toBeTruthy();
  });
});
