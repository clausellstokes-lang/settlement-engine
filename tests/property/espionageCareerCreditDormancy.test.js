/**
 * espionageCareerCreditDormancy.test.js — ES-5d: the mission credit's dormancy fences, the
 * MEASURED same-tick handoff, the real writer-to-reader integration, and the ⟨F6⟩ GOLDEN PAIR.
 *
 * Acceptance cases A2, A5, A7 and A8. A1/A3/A4/A6 live in
 * tests/domain/espionageCareerCredit.test.js.
 *
 * ── ⚠ NO BARE NEGATIVES. This file is NEW **and** generation-facing (`tests/property/**`), so
 * `negativeAssertionAnchor.walker` holds it at a HARD ceiling of zero un-anchored
 * `not.toContain` / `not.toMatch` / `not.toHaveProperty` sites with no frozen row legally
 * available to it. None of the three matchers appears here at all: every claim below is an
 * equality, an inequality, or a count. That is ES-5c's precedent in its sibling file.
 *
 * ── ⭐ HOW "BYTE-IDENTICAL TO BASE" IS MEASURED, SINCE THE OLD CODE IS GONE ─────────────
 * A fence that only compared dark with dark would stay green if the credit had been wired to
 * fire in EVERY world. So every identity claim is TRIANGULATED across worlds that differ in
 * exactly one thing, and each is paired with a LIT+CREDITED control that really does move.
 * Without that anchor the identities would all be readings of a dead feature.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  CAREER_CREDIT_TUNING,
  depositMissionCredits,
  readMissionCreditEvents,
} from '../../src/domain/worldPulse/espionage/espionageCareerCredit.js';
import { advanceEspionageProducts } from '../../src/domain/worldPulse/espionage/espionageProductStage.js';
import { MISSION_GRADES } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { rosterPersonById } from '../../src/domain/worldPulse/envoyCasting.js';
import { extractSpatialUsage } from '../../src/lib/spatialUsage.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HOME = 'ashford';
const OPERATIVE_ID = 'npc.reeve';
const NID = `${HOME}:${OPERATIVE_ID}`;
const ERRAND_TICK = 13;
const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
const FKEY = ladderFactionKey(guild);

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
const HOSTILE_GRAPH = Object.freeze({
  edges: [{ from: HOME, to: 'westmarch', relationshipType: 'hostile' }],
});

/** The operative the errand fixture actually casts, as the roster holds him. */
const OPERATIVE = Object.freeze({
  id: OPERATIVE_ID, name: 'Reeve Mara', role: 'Reeve Mara', importance: 'pillar', dots: 3,
  structuralRank: 'dominant', factionAffiliation: guild.name,
  personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
});
const BENCH = Object.freeze({
  id: 'npc.factor', name: 'Factor Maera', role: 'Factor Maera', importance: 'key', dots: 2,
  structuralRank: 'subordinate', factionAffiliation: guild.name,
  personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
});

/**
 * ONE settlement that BOTH movers can read: the economic shape the espionage stage wants and
 * the court shape the ladder wants, on one object. They read disjoint keys, so a single
 * fixture drives the real handoff instead of two that could drift apart.
 */
function town(id, name, { court = false } = {}) {
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
        npcs: [OPERATIVE, BENCH], institutions: [], activeConditions: [],
      } : {}),
    },
  };
}

const SNAPSHOT = Object.freeze({
  settlements: [town(HOME, 'Ashford', { court: true }), town('westmarch', 'Westmarch'), town('irontown', 'Irontown')],
});

function withBeliefs(worldState) {
  return {
    ...worldState,
    spatialLedgers: {
      ...(worldState.spatialLedgers || {}),
      beliefMaps: {
        westmarch: { seat: { irontown: HOST_BELIEF } },
        [HOME]: { seat: { irontown: HOME_PRIOR } },
      },
    },
  };
}

/**
 * A REAL covert mission on a world lit exactly as far as each fence needs.
 * @param {{ rules?: Record<string, unknown> }} [options]
 */
function missionWorld({ rules = {} } = {}) {
  const { worldState } = mintCovertFixture(
    litCovertWorld({ ...AXES_LIT, npcLadderEnabled: true, ...rules }),
    {},
  );
  return withBeliefs({ ...worldState, calendar: { elapsedWeeks: ERRAND_TICK } });
}

/** THE REAL PRODUCTION CLOSURE, copied in shape from envoyPulse's own call site. */
const npcForOf = (state) => (errand) => {
  const homeId = String(errand?.from || '');
  const item = SNAPSHOT.settlements.find((s) => s.id === homeId);
  return rosterPersonById(state, homeId, item?.settlement, String(errand?.npcId || ''));
};

/** Drive the REAL espionage product stage. */
function runProducts(worldState, tick = ERRAND_TICK) {
  return advanceEspionageProducts({
    worldState, tick, snapshot: SNAPSHOT, regionalGraph: HOSTILE_GRAPH,
    npcFor: npcForOf(worldState),
  });
}

/** Drive the REAL ladder over the same world and tick. */
function runLadder(worldState, tick = ERRAND_TICK) {
  const item = SNAPSHOT.settlements[0];
  const result = advanceNpcLadder({
    snapshot: { settlements: [item], byId: new Map([[HOME, item]]) },
    worldState,
    settlementUpdates: [{ saveId: HOME, settlement: item.settlement }],
    tick,
    now: null,
  });
  return { result, rec: result.worldState?.spatialLedgers?.npcLadder?.[HOME] ?? null };
}

const creditsOf = (ws) => ws?.spatialLedgers?.missionCreditEvents ?? {};
const stockOf = (rec, nid = NID) => rec?.npcs?.[nid]?.stock;
/** The credited-set predicate, DERIVED from the shipped map rather than re-typed. */
const creditsAt = (grade) => Number(CAREER_CREDIT_TUNING.GRADE_MULTIPLE[grade]) > 0;
/** One landing receipt in exactly the shape `landOne` hands back. */
const landing = (grade, errandId, observerId = HOME) => ({ errandId, observerId, grade });

describe('ES-5d A2 — FOUR FENCES: a dark world mints NO ledger key at all', () => {
  it('FENCE 1 — ESPIONAGE DARK: the stage refuses at its door, no key, no change', () => {
    const dark = runProducts(missionWorld({ rules: { espionageEnabled: false } }));
    expect(Object.keys(creditsOf(dark.worldState))).toEqual([]);
    // THE ANCHOR: the very same fixture with espionage lit walks the mission for real, so the
    // refusal above is the flag's doing and not an inert fixture.
    const lit = runProducts(missionWorld());
    expect(lit.gatherings.length + lit.landings.length).toBeGreaterThan(0);
  });

  it('FENCE 2 — LADDER DARK: espionage runs, but the deposit is NOT WRITTEN (CR-ES5D O5)', () => {
    // ⛔ The chair's ruling is the sharp end of this fence: no writer, no prune, no key. A
    // ledger that accumulated while nothing consumed it would be a leak wearing a receipt.
    const darkLadder = runProducts(missionWorld({ rules: { npcLadderEnabled: false } }));
    expect(Object.keys(creditsOf(darkLadder.worldState))).toEqual([]);
    // …and the writer refuses on the LADDER flag alone, with everything else lit. ⚠ The base
    // world here carries `spatialCanonVersion` and a non-omniscient `infoMode` deliberately:
    // `espionageActive` reads `beliefsActive` FIRST, so a world missing either would have been
    // refused by the ESPIONAGE door and this arm would have proved nothing about the ladder one.
    const litBase = (ladder) => ({
      spatialCanonVersion: 1,
      simulationRules: {
        infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true,
        ...(ladder ? { npcLadderEnabled: true } : {}),
      },
    });
    const call = (ladder) => depositMissionCredits({
      worldState: litBase(ladder),
      tick: ERRAND_TICK,
      landings: [landing('met', 'e1')],
      operatives: new Map([['e1', OPERATIVE]]),
    });
    const refused = call(false);
    expect(Object.keys(creditsOf(refused.worldState))).toEqual([]);
    expect(refused.changed).toBe(false);
    // THE ANCHOR: the IDENTICAL call with the ladder flag lit really does write, so the refusal
    // above is that one flag's doing and nothing else's.
    expect(Object.keys(creditsOf(call(true).worldState))).toEqual([NID]);
  });

  it('FENCE 3 — ERRAND SPINE DARK: no covert errands ⇒ no landings ⇒ no key', () => {
    const spineDark = runProducts(missionWorld({ rules: { errandSpineEnabled: false } }));
    expect(Object.keys(creditsOf(spineDark.worldState))).toEqual([]);
    expect(spineDark.landings).toEqual([]);
  });

  it('FENCE 4 — ROADS DARK: a world with no journey mints no key, and the ladder is untouched', () => {
    // Nobody has travelled: the errand ledger is empty, so the stage walks nothing at all.
    const still = runProducts(withBeliefs({
      ...litCovertWorld({ ...AXES_LIT, npcLadderEnabled: true }),
      calendar: { elapsedWeeks: ERRAND_TICK },
    }));
    expect(Object.keys(creditsOf(still.worldState))).toEqual([]);
    const bare = runLadder(still.worldState);
    const control = runLadder(withBeliefs({
      ...litCovertWorld({ ...AXES_LIT, npcLadderEnabled: true }),
      calendar: { elapsedWeeks: ERRAND_TICK },
    }));
    expect(JSON.stringify(bare.rec)).toBe(JSON.stringify(control.rec));
  });

  it('⭐ DROP-WHEN-EMPTY IS WHAT MAKES DARK BYTE-IDENTICAL: no dark arm gains the namespace key', () => {
    const arms = {
      espionageDark: runProducts(missionWorld({ rules: { espionageEnabled: false } })),
      ladderDark: runProducts(missionWorld({ rules: { npcLadderEnabled: false } })),
      spineDark: runProducts(missionWorld({ rules: { errandSpineEnabled: false } })),
    };
    expect(Object.fromEntries(Object.entries(arms).map(([k, v]) => [
      k, Object.keys(v.worldState?.spatialLedgers ?? {}).includes('missionCreditEvents'),
    ]))).toEqual({ espionageDark: false, ladderDark: false, spineDark: false });
  });
});

describe('ES-5d A5 — THE HANDOFF IS SAME-TICK, AND THE PULSE ORDER IS WHY (deviation D7)', () => {
  it('⚠⚠ MEASURED AT SOURCE: the espionage pass runs BEFORE the ladder, in one pulse, on one tick', () => {
    // This is the packet-level correction's evidence, and it is asserted rather than described
    // because the whole carrier choice turns on it. Both call sites are matched in their CALL
    // form (`name({`), which appears nowhere else in the file — the import lines and the prose
    // that names them carry no parenthesis, so neither can be mistaken for a call.
    const pulse = readFileSync(join(ROOT, 'src/domain/worldPulse/pulseKernel.js'), 'utf8');
    const espionageAt = pulse.indexOf('advanceEnvoyDiplomacyPulse({');
    const ladderAt = pulse.indexOf('AndCommonsAndAssize({');
    expect(espionageAt, 'the espionage pass call site moved — re-derive the handoff lag')
      .toBeGreaterThan(0);
    expect(ladderAt, 'the ladder chain call site moved — re-derive the handoff lag')
      .toBeGreaterThan(0);
    // ⛔ IF THIS EVER FLIPS, THE WINDOW IN espionageCareerCredit.js MUST FLIP WITH IT. A
    // depositor that ran AFTER its consumer would need the one-tick lag the roads deposit uses.
    expect(espionageAt).toBeLessThan(ladderAt);
    // …and both movers are handed the SAME tick, which is what makes "same tick" meaningful.
    const between = pulse.slice(espionageAt, ladderAt + 400);
    expect(between.split('tick: worldState.tick').length - 1).toBeGreaterThanOrEqual(2);
  });

  it('the credit lands on the tick it was DEPOSITED, and a prior tick\'s deposit is inert', () => {
    const written = depositMissionCredits({
      worldState: missionWorld(), tick: ERRAND_TICK,
      landings: [landing('met', 'e1')], operatives: new Map([['e1', OPERATIVE]]),
    }).worldState;
    const sameTick = runLadder(written, ERRAND_TICK);
    const nextTick = runLadder(written, ERRAND_TICK + 1);
    const control = runLadder(missionWorld(), ERRAND_TICK);
    expect(typeof stockOf(control.rec), 'the operative holds no rung — every claim is vacuous')
      .toBe('number');
    // SAME TICK: consumed.
    expect(stockOf(sameTick.rec)).toBeGreaterThan(stockOf(control.rec));
    // ONE TICK LATER: the strict window refuses it, which is the consume-once guarantee.
    const nextControl = runLadder(missionWorld(), ERRAND_TICK + 1);
    expect(stockOf(nextTick.rec)).toBe(stockOf(nextControl.rec));
  });

  it('the read is a STRICT equality on the tick — neither older nor newer records are consumed', () => {
    const at = (depositTick) => readMissionCreditEvents(
      { spatialLedgers: { missionCreditEvents: { [NID]: { credit: 0.15, depositTick, grade: 'met' } } } },
      ERRAND_TICK,
    );
    expect([...at(ERRAND_TICK).keys()]).toEqual([NID]);
    expect([...at(ERRAND_TICK - 1).keys()]).toEqual([]);
    expect([...at(ERRAND_TICK + 1).keys()]).toEqual([]);
  });
});

describe('ES-5d A7 — the REAL writer-to-reader integration, on a REAL minted mission', () => {
  it('the stage resolves the operative through the REAL roster inverse and lands a REAL grade', () => {
    const products = runProducts(missionWorld());
    expect(products.landings.length, 'the fixture landed no product — the seam is not exercised')
      .toBeGreaterThan(0);
    const graded = products.landings[0];
    expect(MISSION_GRADES).toContain(graded.grade);
    expect(graded.observerId).toBe(HOME);
    // The identity bridge, end to end on a REAL minted errand: the production closure found the
    // man in the roster that cast him, and the deposit keyed him under the LADDER's spelling.
    expect(npcForOf(missionWorld())({ from: HOME, npcId: OPERATIVE_ID })?.id).toBe(OPERATIVE_ID);
    // Whether THIS landing credits is decided by the shipped map, never restated here.
    expect(Object.keys(creditsOf(products.worldState)))
      .toEqual(creditsAt(graded.grade) ? [NID] : []);
  });

  it('⭐ END TO END: espionage deposits, then the LADDER\'S OWN writer folds it into stock', () => {
    // ⭐ NOTHING IS HAND-SHAPED HERE. The mission is minted through the production writer, walked
    // by the real stage, graded by the real arithmetic, and the operative is found by the real
    // roster inverse — the deposit below is the one a running world writes.
    const products = runProducts(missionWorld());
    expect(
      creditsAt(products.landings[0].grade),
      'the fixture no longer lands a CREDITED grade, so the reach measured below would be'
      + ' vacuous. Re-tune the FIXTURE until it clears the bar again — never relax this line.',
    ).toBe(true);
    expect(Object.keys(creditsOf(products.worldState))).toEqual([NID]);
    // THE CONTROL is the SAME walked world with only the credit ledger lifted out, so the two
    // ladder advances differ in exactly one thing: the deposit.
    const { missionCreditEvents: _credit, ...restLedgers } = products.worldState.spatialLedgers;
    const control = runLadder({ ...products.worldState, spatialLedgers: restLedgers }, ERRAND_TICK);
    const credited = runLadder(products.worldState, ERRAND_TICK);
    expect(stockOf(credited.rec) - stockOf(control.rec)).toBeCloseTo(0.15, 10);
    // …and only the operative moved: the bench-mate on the same advance is untouched, so the
    // fold is keyed rather than blanket.
    expect(stockOf(credited.rec, `${HOME}:npc.factor`)).toBe(stockOf(control.rec, `${HOME}:npc.factor`));
    expect(credited.rec.factions[FKEY].rungs).toContain(NID);
  });

  it('THE BOUNDARY HOLDS: the credit leaf writes no ladder state and routes no errand writer', () => {
    // The estate-wide census over the whole espionage directory lives in
    // tests/domain/espionageProducts.test.js and is NOT duplicated here — this is the targeted
    // instance for the ONE file this wave adds, using that census's own two spellings.
    const leaf = readFileSync(
      join(ROOT, 'src/domain/worldPulse/espionage/espionageCareerCredit.js'), 'utf8',
    );
    const LADDER_WRITE_RE = new RegExp(
      String.raw`\b(?:set|drop)SpatialLedger\s*\([^;]{0,160}?['"]npcLadder['"]`
      + String.raw`|\bspatialLedgers\s*(?:\.\s*npcLadder\b|\[\s*['"]npcLadder['"]\s*\])\s*=`,
    );
    expect(LADDER_WRITE_RE.test(leaf)).toBe(false);
    expect(/\bwriteErrands\b/.test(leaf)).toBe(false);
    // NON-VACUITY: both spellings really are matchable, so the two falses above are the leaf
    // being clean rather than the patterns being dead.
    expect(LADDER_WRITE_RE.test("setSpatialLedger(worldState, 'npcLadder', next);")).toBe(true);
    expect(/\bwriteErrands\b/.test('writeErrands(w, r);')).toBe(true);
    // …and the leaf really is the file we think it is (a renamed leaf would pass every line above).
    expect(leaf.includes('export function depositMissionCredits')).toBe(true);
  });
});

describe('ES-5d A8 — the DISCLOSED ⟨F6⟩ shift, and the TRACKED classification\'s behavioural pin', () => {
  /**
   * ⚠ THE GOLDEN PAIR. (i) the DARK golden: a world with no credit produces the ladder output
   * this estate produced before ES-5d, byte for byte. (ii) the LIT golden: the NEW output, whose
   * cause is this wave's credit and nothing else.
   *
   * THE SHIFT IS DECLARED, NOT DISCOVERED: a credited `stock` feeds `defenseScore` and
   * `challengeScore`, which drive whether a challenge is hopeless, the attempt rate, and the
   * sustained margin — so ladder successions and the news they emit can move in a LIT world.
   * That is a one-time ⟨F6⟩ ladder-outcome move owned by ES-5d, anticipated by name in the
   * design. ⛔ It may never be re-recorded without stating the cause.
   */
  it('(i) THE DARK GOLDEN: no credit ⇒ the ladder output is byte-identical to the no-deposit world', () => {
    const noKey = runLadder(missionWorld(), ERRAND_TICK);
    const emptyLedger = runLadder({ ...missionWorld(), spatialLedgers: {
      ...(missionWorld().spatialLedgers || {}), missionCreditEvents: {},
    } }, ERRAND_TICK);
    const staleOnly = runLadder({ ...missionWorld(), spatialLedgers: {
      ...(missionWorld().spatialLedgers || {}),
      missionCreditEvents: { [NID]: { credit: 0.15, depositTick: ERRAND_TICK - 1, grade: 'met' } },
    } }, ERRAND_TICK);
    expect(JSON.stringify(emptyLedger.rec)).toBe(JSON.stringify(noKey.rec));
    expect(JSON.stringify(staleOnly.rec)).toBe(JSON.stringify(noKey.rec));
  });

  it('(ii) THE LIT GOLDEN: the credited standing is the recorded NEW value, and its cause is the credit', () => {
    const control = runLadder(missionWorld(), ERRAND_TICK);
    const credited = runLadder({ ...missionWorld(), spatialLedgers: {
      ...(missionWorld().spatialLedgers || {}),
      missionCreditEvents: { [NID]: { credit: 0.15, depositTick: ERRAND_TICK, grade: 'met' } },
    } }, ERRAND_TICK);
    // RECORDED ONCE, IN THIS COMMIT, WITH THE CAUSE STATED: a `met`-grade covert mission credits
    // MISSION_CREDIT_MET (0.15) onto the seat's standing through applyMissionCredit.
    expect(credited.rec.npcs[NID].stock - control.rec.npcs[NID].stock).toBeCloseTo(0.15, 10);
    expect(credited.rec.npcs[NID].stock).toBe(Number(credited.rec.npcs[NID].stock.toFixed(4)));
    // THE ANTI-VACUITY ANCHOR: the lit world genuinely differs from the dark one. Without this
    // the two identities in (i) could both be readings of a feature that never fires.
    expect(JSON.stringify(credited.rec) === JSON.stringify(control.rec)).toBe(false);
  });

  it('⛔ THE TRACKED CLASSIFICATION IS BEHAVIOURAL: the ledger reaches mover_counts AND movers_active', () => {
    // ⚠⚠ A TRACKED ROW FAILS OPEN. Adding the key to TRACKED_LEDGER_KEYS alone greens the
    // coverage walker while emitting ZERO telemetry, because `counts` and `MOVER_PRESENCE` are
    // function-local and unexported. This pin drives the extractor itself, so a classification
    // that registers the key without wiring it reds here. Its two mutants (drop the `counts`
    // entry; drop the `MOVER_PRESENCE` row) are run against this case.
    const usage = extractSpatialUsage({
      spatialCanonVersion: 1,
      spatialLedgers: {
        missionCreditEvents: {
          [NID]: { credit: 0.15, depositTick: ERRAND_TICK, grade: 'met' },
          [`${HOME}:npc.factor`]: { credit: 0.3, depositTick: ERRAND_TICK, grade: 'exceeded' },
        },
      },
    });
    expect(usage.mover_counts.mission_credits).toBe(2);
    expect(usage.movers_active).toContain('mission_credit');
    // …and an absent ledger reads as a structural zero that never enters movers_active, so the
    // count above measures the lane firing rather than the key merely existing.
    const idle = extractSpatialUsage({ spatialCanonVersion: 1, spatialLedgers: {} });
    expect(idle.mover_counts.mission_credits).toBe(0);
    expect(idle.movers_active.filter((m) => m === 'mission_credit')).toEqual([]);
  });

  it('PROP HYGIENE: the telemetry carries a COUNT and never an npc key or name', () => {
    const usage = extractSpatialUsage({
      spatialCanonVersion: 1,
      spatialLedgers: { missionCreditEvents: { [NID]: { credit: 0.15, depositTick: ERRAND_TICK, grade: 'met' } } },
    });
    const emitted = JSON.stringify(usage);
    expect(emitted.includes(NID)).toBe(false);
    expect(emitted.includes(OPERATIVE.name)).toBe(false);
    // NON-VACUITY: the identity really is spellable and really is in the input, so the two
    // falses measure the extractor's hygiene rather than an empty payload.
    expect(NID.length).toBeGreaterThan(0);
    expect(emitted.includes('mission_credit')).toBe(true);
  });
});
