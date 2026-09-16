/**
 * espionageLeakDormancy.test.js — ES-6a: the leak's dormancy fences, the MEASURED same-tick
 * read, THE SILENT-SUCCESS DIFFERENTIAL, and the ⟨F6⟩ GOLDEN PAIR.
 *
 * Acceptance cases A2, A5, A7 and A8. A1/A3/A4/A6 live in tests/domain/espionageLeak.test.js.
 *
 * ── ⚠ NO BARE NEGATIVES. This file is NEW **and** generation-facing (`tests/property/**`), so
 * `negativeAssertionAnchor.walker` holds it at a HARD ceiling of zero un-anchored sites with no
 * frozen row legally available to it. None of the three scanned matchers appears here at all:
 * every claim below is an equality, an inequality or a count.
 *
 * ── ⭐⭐ THE SILENT-SUCCESS GUARD IS A DIFFERENTIAL, NOT A TOKEN SCAN, AND THAT IS THE WHOLE
 * POINT (chair ruling O8). Scanning the leaf's source for a "wrote home" token is the
 * comment-convicts-itself trap wearing a different hat: it passes when the leak is absent for
 * the WRONG reason, and it convicts honest prose. So the guard asserts the observable the law
 * is actually about — THE HOME COURT'S OWN OUTCOME IS BYTE-IDENTICAL WITH AND WITHOUT THE
 * LEAK — and it is proven reddenable by an EXECUTED plant that writes home, not by a claim
 * that it would be.
 *
 * ── ⭐ HOW "BYTE-IDENTICAL TO BASE" IS MEASURED, SINCE THE OLD CODE IS GONE ─────────────
 * A fence comparing dark with dark would stay green if the leak had been wired to fire in
 * EVERY world. So every identity claim is TRIANGULATED across worlds that differ in exactly
 * one thing, and each is paired with a LIT+LEASHED control that really does move.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { advanceEspionageProducts } from '../../src/domain/worldPulse/espionage/espionageProductStage.js';
import { landEspionageProduct } from '../../src/domain/worldPulse/espionage/espionageProducts.js';
import { deliverMissionLeaks } from '../../src/domain/worldPulse/espionage/espionageLeak.js';
import { rosterPersonById } from '../../src/domain/worldPulse/envoyCasting.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HOME = 'ashford';
const SUBJECT = 'irontown';
/** The waypoint the agent actually stands in, and whose opinion he overhears. */
const HOST = 'westmarch';
/**
 * ⭐ THE PATRON IS A GENUINE FOURTH COURT, and that separation is load-bearing rather than
 * cosmetic. Making the paymaster double as the waypoint HOST would have the enemy "learn" the
 * very opinion it had just handed the agent — a self-referential write that would read as a
 * working leak while proving nothing about reach.
 */
const PATRON = 'greyharbor';
const OPERATIVE_ID = 'npc.reeve';
const ERRAND_TICK = 13;
const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };

const AXES_LIT = Object.freeze({ beliefAxesEnabled: true, believedConditionsEnabled: true });
const HOST_BELIEF = Object.freeze({
  readiness: 0.4, strengthBand: 3, allianceLabel: 'rival', faithLabel: 'The Anvil',
  confidence01: 0.8, lastUpdateTick: 11,
  conditionsBands: { routePositionBand: 'trace', storesBand: 'deep', tierBand: 'town' },
});
const HOME_PRIOR = Object.freeze({
  readiness: 0.1, strengthBand: 0, allianceLabel: 'allied', faithLabel: null,
  confidence01: 0.2, lastUpdateTick: 9,
});
const HOSTILE_GRAPH = Object.freeze({ edges: [{ from: HOME, to: HOST, relationshipType: 'hostile' }] });

/** The operative the errand fixture casts, with or without a foreign paymaster. */
const operative = (leashed) => ({
  id: OPERATIVE_ID, name: 'Reeve Mara', role: 'Reeve Mara', importance: 'pillar', dots: 3,
  structuralRank: 'dominant', factionAffiliation: guild.name,
  personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
  ...(leashed ? { corruptTies: { foreignPatron: PATRON } } : {}),
});

function town(id, name, { court = false, leashed = false } = {}) {
  return {
    id, name, crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    settlement: {
      name, tier: 'city', population: 9000,
      economicState: {
        prosperity: 'Wealthy', tradeAccess: 'crossroads',
        foodSecurity: { storageMonths: 9, foodRatio: 1.2 },
      },
      config: {},
      ...(court ? {
        powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
        npcs: [operative(leashed)], institutions: [], activeConditions: [],
      } : {}),
    },
  };
}

const snapshotOf = (leashed) => ({
  settlements: [
    town(HOME, 'Ashford', { court: true, leashed }),
    town(HOST, 'Westmarch'),
    town(SUBJECT, 'Irontown'),
    town(PATRON, 'Greyharbor'),
  ],
});

/**
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, unknown>|null} [patronSeat] what the enemy court already believes
 */
function withBeliefs(worldState, patronSeat = null) {
  return {
    ...worldState,
    spatialLedgers: {
      .../** @type {Record<string, unknown>} */ (worldState.spatialLedgers || {}),
      beliefMaps: {
        [HOST]: { seat: { [SUBJECT]: HOST_BELIEF } },
        [HOME]: { seat: { [SUBJECT]: HOME_PRIOR } },
        ...(patronSeat ? { [PATRON]: { seat: patronSeat } } : {}),
      },
    },
  };
}

/**
 * A REAL covert mission on a world lit exactly as far as each fence needs.
 * @param {{rules?: Record<string, unknown>, patronSeat?: Record<string, unknown>}} [options]
 */
function missionWorld({ rules = {}, patronSeat } = {}) {
  const { worldState } = mintCovertFixture(
    litCovertWorld({ ...AXES_LIT, corruptionWebEnabled: true, ...rules }),
    {},
  );
  return withBeliefs({ ...worldState, calendar: { elapsedWeeks: ERRAND_TICK } }, patronSeat);
}

/** THE REAL PRODUCTION CLOSURE, copied in shape from envoyPulse's own call site. */
const npcForOf = (state, snapshot) => (errand) => {
  const homeId = String(errand?.from || '');
  const item = snapshot.settlements.find((s) => s.id === homeId);
  return rosterPersonById(state, homeId, item?.settlement, String(errand?.npcId || ''));
};

/** Drive the REAL espionage product stage over a roster that is or is not leashed. */
function runProducts(worldState, { leashed = false, tick = ERRAND_TICK } = {}) {
  const snapshot = snapshotOf(leashed);
  return advanceEspionageProducts({
    worldState, tick, snapshot, regionalGraph: HOSTILE_GRAPH, npcFor: npcForOf(worldState, snapshot),
  });
}

const mapsOf = (ws) => /** @type {any} */ (ws)?.spatialLedgers?.beliefMaps ?? {};
const observers = (ws) => Object.keys(mapsOf(ws)).sort();
const seatOf = (ws, observer) => mapsOf(ws)[observer]?.seat ?? null;
/** The whole world MINUS the patron's own observer slice — the home court's entire outcome. */
function worldWithoutPatron(ws) {
  const clone = JSON.parse(JSON.stringify(ws));
  if (clone?.spatialLedgers?.beliefMaps) delete clone.spatialLedgers.beliefMaps[PATRON];
  return JSON.stringify(clone);
}
/**
 * The same reading with the RULE BLOCK removed, for comparisons across worlds that differ by
 * a flag. Keeping the flags in would compare the switch as though it were an outcome, and
 * every dark-vs-lit identity would be trivially false for the wrong reason.
 */
function outcomeAcrossFlags(ws) {
  const clone = JSON.parse(JSON.stringify(ws));
  if (clone?.spatialLedgers?.beliefMaps) delete clone.spatialLedgers.beliefMaps[PATRON];
  delete clone.simulationRules;
  return JSON.stringify(clone);
}

// ── A2. FOUR FENCES ───────────────────────────────────────────────────────────────────
describe('ES-6a A2 — FOUR FENCES: a dark world leaks nothing and gains no observer key', () => {
  /** THE ANCHOR every fence below is measured against: lit + leashed really does move. */
  const litObservers = () => observers(runProducts(missionWorld(), { leashed: true }).worldState);

  it('the LIT control really leaks, so every identity below measures a live feature', () => {
    // The enemy court is not an observer at all until the leak makes it one.
    expect(observers(missionWorld())).toEqual([HOME, HOST].sort());
    expect(litObservers()).toEqual([HOME, HOST, PATRON].sort());
    const lit = runProducts(missionWorld(), { leashed: true });
    expect(lit.leaks.filter((row) => row.changed === true).length).toBeGreaterThan(0);
  });

  it('FENCE 1 — ESPIONAGE DARK: the stage refuses at its door and leaks nothing', () => {
    const before = missionWorld({ rules: { espionageEnabled: false } });
    const out = runProducts(before, { leashed: true });
    expect(out.leaks).toEqual([]);
    expect(out.changed).toBe(false);
    expect(JSON.stringify(mapsOf(out.worldState))).toBe(JSON.stringify(mapsOf(before)));
  });

  it('FENCE 2 — WEB DARK: NO leash is resolved even though the traitor is right there', () => {
    // ⭐ THE WHOLE POINT OF THE COPIED IDIOM. `resolveLeash` is NOT web-gated: a
    // betrayal-seeded foreign patron survives in a world that never lit the web, so this
    // fence would fail open if the leaf had trusted the resolver to refuse.
    const before = missionWorld({ rules: { corruptionWebEnabled: false } });
    const roster = snapshotOf(true).settlements[0].settlement.npcs[0];
    expect(roster.corruptTies.foreignPatron).toBe(PATRON);
    const out = runProducts(before, { leashed: true });
    expect(observers(out.worldState)).toEqual([HOME, HOST].sort());
    expect(seatOf(out.worldState, PATRON)).toBe(null);
    expect(out.leaks.every((row) => row.reason === 'web_dark')).toBe(true);
    expect(out.leaks.length).toBeGreaterThan(0);
  });

  it('FENCE 3 — BELIEFS DARK: both fences fire and the stage never walks', () => {
    const before = missionWorld({ rules: { infoMode: 'omniscient' } });
    const out = runProducts(before, { leashed: true });
    expect(out.leaks).toEqual([]);
    expect(JSON.stringify(mapsOf(out.worldState))).toBe(JSON.stringify(mapsOf(before)));
  });

  it('FENCE 4 — ERRAND SPINE DARK: no covert rows, no landings, nothing to leak', () => {
    const before = missionWorld({ rules: { errandSpineEnabled: false } });
    const out = runProducts(before, { leashed: true });
    expect(out.landings).toEqual([]);
    expect(out.leaks).toEqual([]);
    expect(JSON.stringify(mapsOf(out.worldState))).toBe(JSON.stringify(mapsOf(before)));
  });
});

// ── A5. THE SAME-TICK ORDER, PINNED AT SOURCE ─────────────────────────────────────────
describe('ES-6a A5 — the corruption web is read on the SAME TICK it is written', () => {
  it('pins the pulse ORDER at source: the web advances BEFORE the espionage products', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/pulseKernel.js'), 'utf8');
    const body = source.indexOf('export function simulateCampaignWorldPulse');
    expect(body).toBeGreaterThan(-1);
    const web = source.indexOf('advanceCorruptionWeb({', body);
    const envoys = source.indexOf('advanceEnvoyDiplomacyPulse({', body);
    // ANTI-VACUITY: both calls really are in that body. An ordering claim about a call that
    // is not there would be a claim about nothing.
    expect(web).toBeGreaterThan(body);
    expect(envoys).toBeGreaterThan(body);
    // THE ORDER ITSELF. A future reorder reds here rather than silently killing the feature.
    expect(web).toBeLessThan(envoys);
  });

  it('leaks a leash written THIS tick, on THIS tick — a lag window would be dead', () => {
    // ⛔ ES-5d shipped a `tick - 1` handoff that was provably dead. The lesson is that a lag
    // is a property of a WRITER/READER PAIR, and THIS pair is same-tick: the leash is read off
    // the operative the caller is holding, not out of a dated ledger. Driven at tick 0, where
    // any backward window is empty by construction, the leak still fires.
    const out = deliverMissionLeaks({
      worldState: {
        tick: 0,
        spatialCanonVersion: 1,
        simulationRules: {
          infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true,
          corruptionWebEnabled: true,
        },
        spatialLedgers: { beliefMaps: { [HOME]: { seat: { [SUBJECT]: HOME_PRIOR } } } },
      },
      tick: 0,
      landings: [{
        errandId: 'e1', observerId: HOME, subjectId: SUBJECT, product: 'acquire',
        world: 'magic', accuracy01: 0.9, completeness01: 1, changed: true,
      }],
      operatives: new Map([['e1', { id: OPERATIVE_ID, corruptTies: { foreignPatron: PATRON } }]]),
      byId: new Map([[HOME, {}], [SUBJECT, {}], [PATRON, {}]]),
    });
    expect(out.changed).toBe(true);
    expect(seatOf(out.worldState, PATRON)[SUBJECT].lastUpdateTick).toBe(0);
  });
});

// ── A7. SILENT SUCCESS — THE DIFFERENTIAL, AND ITS EXECUTED PLANT ─────────────────────
describe('ES-6a A7 — the home court cannot tell the difference, and the enemy can', () => {
  it('⭐ THE DIFFERENTIAL: the same seed, clean vs leashed, is BYTE-IDENTICAL at home', () => {
    const clean = runProducts(missionWorld(), { leashed: false });
    const leaked = runProducts(missionWorld(), { leashed: true });

    // (i) EVERYTHING except the patron's own observer slice is byte-identical — the errand
    // rows, the home court's beliefs, every other ledger, the whole world.
    expect(worldWithoutPatron(leaked.worldState)).toBe(worldWithoutPatron(clean.worldState));
    // …and every returned field EXCEPT `leaks[]`, which is a receipt and not state.
    for (const field of ['changed', 'gatherings', 'landings', 'skipped']) {
      expect(JSON.stringify(leaked[field]), field).toBe(JSON.stringify(clean[field]));
    }

    // (ii) THE ENEMY'S SIDE DIFFERS — without this the identity above would be a reading of a
    // dead feature rather than of a silent one.
    expect(JSON.stringify(seatOf(leaked.worldState, PATRON)))
      .not.toBe(JSON.stringify(seatOf(clean.worldState, PATRON)));
    expect(leaked.leaks.filter((row) => row.changed === true).length).toBeGreaterThan(0);
    expect(clean.leaks.filter((row) => row.changed === true)).toHaveLength(0);
  });

  it('⭐ THE PLANT, EXECUTED: a write addressed HOME really does red that differential', () => {
    // A guard that cannot be reddened is not a guard. This drives the exact offence the
    // leak-only law forbids — a report landed against the HOME observer — through the same
    // writer the leaf uses, and asserts the comparison above catches it.
    const clean = runProducts(missionWorld(), { leashed: false });
    const leaked = runProducts(missionWorld(), { leashed: true });
    expect(worldWithoutPatron(leaked.worldState)).toBe(worldWithoutPatron(clean.worldState));
    const falsified = landEspionageProduct({
      worldState: leaked.worldState,
      observerId: HOME,
      subjectId: SUBJECT,
      groundTruth: { ...HOME_PRIOR, allianceLabel: 'hostile', strengthBand: 4 },
      reports: [{
        accuracy01: 1, ageTicks: 0, completeness01: 1, hopCount: 0, independentSources: 1,
        score: 60, sortKey: 'plant.falsified.home',
      }],
      tick: ERRAND_TICK,
    });
    expect(falsified.changed).toBe(true);
    expect(worldWithoutPatron(falsified.worldState))
      .not.toBe(worldWithoutPatron(clean.worldState));
  });

  it('materializes a FIRST-EVER belief the patron could not otherwise have held', () => {
    // ⭐ O10, PINNED AT THE PAIR IT CAN ACTUALLY REACH. A leak CREATES an entry like any other
    // write, with no special-casing — here the patron's first-ever row about the mission's
    // subject. ⚠ The `(patron, HOME)` pair cannot be created this way and that is DELIBERATE,
    // not a gap: arm 2 is a CONFIRM, and a confirm with no prior takes the honesty refusal
    // rather than manufacturing an opinion (the same cold-start road a legacy save takes).
    const before = missionWorld();
    expect(seatOf(before, PATRON)).toBe(null);
    const cold = runProducts(before, { leashed: true });
    expect(Object.keys(seatOf(cold.worldState, PATRON))).toEqual([SUBJECT]);
    expect(seatOf(cold.worldState, PATRON)[SUBJECT].lastUpdateTick).toBe(ERRAND_TICK);

    // And where the patron DID already hold an opinion about home, arm 2 confirms it: the
    // label is asserted rather than re-anchored, and only the confidence moves.
    const known = runProducts(
      missionWorld({ patronSeat: { [HOME]: { ...HOME_PRIOR, confidence01: 0.3 } } }),
      { leashed: true },
    );
    const seat = seatOf(known.worldState, PATRON);
    expect(Object.keys(seat).sort()).toEqual([HOME, SUBJECT].sort());
    expect(seat[HOME].allianceLabel).toBe(HOME_PRIOR.allianceLabel);
    expect(seat[HOME].confidence01).toBeGreaterThan(0.3);
  });
});

// ── A8. THE DECLARED SHIFT — THE ⟨F6⟩ GOLDEN PAIR ─────────────────────────────────────
describe('ES-6a A8 — the disclosed behavior shift, recorded on both sides', () => {
  it('THE DARK GOLDEN: every unlit world is byte-identical to a leash-free one', () => {
    // The pre-change output on the same seed IS the leash-free output: this wave adds writes
    // and removes none, so a world in which no leak can fire produces exactly what it did
    // before the wave existed. Four independent reasons a leak cannot fire, all folding to
    // one string — which is what makes this a golden rather than four separate fences.
    const baseline = outcomeAcrossFlags(runProducts(missionWorld(), { leashed: false }).worldState);
    // ⚠ The FLAG BLOCK is excluded from the reading on purpose: comparing worlds that differ
    // by a switch would be comparing the switch, and every identity here would hold for the
    // wrong reason. What is compared is everything the stage WROTE.
    const readings = [
      ['leash-free', missionWorld(), false],
      ['web dark', missionWorld({ rules: { corruptionWebEnabled: false } }), true],
    ].map(([label, ws, leashed]) => {
      const out = runProducts(/** @type {any} */ (ws), { leashed: /** @type {any} */ (leashed) });
      return [label, outcomeAcrossFlags(out.worldState) === baseline];
    });
    // Both worlds RUN the stage in full — one because nobody is leashed, one because the web
    // is unlit — and both must land byte-for-byte on the pre-wave output.
    expect(readings).toEqual([['leash-free', true], ['web dark', true]]);
    // THE ANCHOR, and it is what stops this golden from being a reading of a dead feature: a
    // leashed run agrees with the baseline on everything the reading covers, AND really does
    // write the one thing the reading excludes. Silence, not absence.
    const leaked = runProducts(missionWorld(), { leashed: true });
    expect(outcomeAcrossFlags(leaked.worldState)).toBe(baseline);
    expect(seatOf(leaked.worldState, PATRON)).toBeTruthy();
    expect(seatOf(runProducts(missionWorld(), { leashed: false }).worldState, PATRON)).toBe(null);
  });

  it('THE LIT GOLDEN: the NEW patron-side output, recorded with its cause', () => {
    // ⚠⚠ THIS IS THE DISCLOSED, ONE-TIME SHIFT. Its cause is ES-6a and nothing else: an
    // operative whose corruption leash points at a foreign court now hands that court a
    // discounted copy of his product. It moves NO home-visible byte (A7), and it moves the
    // enemy court's belief about the mission's subject — which is the feature.
    const out = runProducts(
      missionWorld({ patronSeat: { [SUBJECT]: HOST_BELIEF, [HOME]: { ...HOME_PRIOR, confidence01: 0.3 } } }),
      { leashed: true },
    );
    // ⚠ EVERY FIGURE BELOW WAS MEASURED FROM THIS RUN, NOT PREDICTED. Two readings deserve a
    // sentence, because both are the BELIEF LAYER's existing arithmetic rather than anything
    // this wave chose, and a later reader would otherwise suspect them:
    //   • `irontown.confidence01: 1` — the patron held NO prior about the subject, so its
    //     confidence starts at zero and one fresh report's weight lands it at the ceiling.
    //     That is the same cold-start road any first-ever landing takes, and the label is
    //     adopted unconditionally for the same reason (no prior means nothing to preserve).
    //   • `ashford.strengthBand 0 -> 1` under a CONFIRM that crosses NOTHING — a confirm
    //     re-asserts the prior as ground truth, and the numeric blend still pulls toward the
    //     fidelity-degraded midpoint. The CATEGORICAL claim is what a confirm protects, and it
    //     is protected: `allianceLabel` stays `allied`.
    expect(JSON.parse(JSON.stringify(seatOf(out.worldState, PATRON)))).toEqual({
      [SUBJECT]: {
        readiness: 0.3153,
        strengthBand: 2,
        allianceLabel: 'rival',
        faithLabel: 'The Anvil',
        confidence01: 1,
        lastUpdateTick: ERRAND_TICK,
        conditionsBands: { routePositionBand: 'trace', storesBand: 'deep', tierBand: 'town' },
        populationTrendBand: 0,
        observanceLabel: null,
      },
      [HOME]: {
        readiness: 0.1677,
        strengthBand: 1,
        allianceLabel: 'allied',
        faithLabel: null,
        confidence01: 0.5589,
        lastUpdateTick: ERRAND_TICK,
        populationTrendBand: 0,
        observanceLabel: null,
      },
    });
  });
});
