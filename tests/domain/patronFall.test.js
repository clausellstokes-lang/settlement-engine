/**
 * patronFall.test.js — WF-1a's acceptance battery for THE TYPED PATRON FALL.
 *
 * ⛔ EVERY FIXTURE BELOW WAS RUN AND PRINTED BEFORE ITS ASSERTION WAS WRITTEN, and that
 * order is the point rather than a courtesy. `PATRON_FLIP_TICKS` is 3 and
 * `SHARE_STEP_MAX` is 6, so a fixture advanced a handful of ticks, or one whose rival
 * cannot actually gain ground, produces base == cure and a SILENTLY VACUOUS pin — the
 * recorded class where an assertion passes because the engine never executed the
 * behaviour it names. The measured tick at which each arm fires is recorded beside it,
 * and every fixture here runs well past that tick.
 *
 * ⛔ THE DEITY DOCTRINE BINDS THE FIXTURES TOO. Every deity below arrives through the
 * doctrine path — `config.primaryDeitySnapshot` (what SET_PRIMARY_DEITY writes) and
 * `config.cultDeitySnapshots` (what IMPOSE_CULT writes) — never by poking a catalogue or
 * an allow-list, and no premade pool is read. The causes are believer-side and political
 * throughout: a garrison, an eviction, a contest, a share flip.
 *
 * @enforced-by tests/lint/sovereigntyLightingContract.walker.test.js
 */
import { describe, it, expect } from 'vitest';
import { PATRON_FALL_CAUSES, FALL_RING_CAP, classifyPatronFall, recordPatronFall, fallCauseFor } from '../../src/domain/worldPulse/patronFall.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot, RELIGION_TUNING } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
/** The SPREAD-lane rules argument. Distinct from worldState.simulationRules, which is
 *  where the WF-1a gate is read — the two are deliberately not the same surface. */
const SPREAD = { religionDynamicsEnabled: true };

const deity = (name, temper, align, rank) => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

/** A save carrying its patron through the SET_PRIMARY_DEITY embed field set. */
function save(id, name, d, tier = 'town') {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population: tier === 'city' ? 20000 : tier === 'metropolis' ? 60000 : 3000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, ...(d ? { primaryDeityRef: d._deityRef, primaryDeitySnapshot: d } : {}) },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function region(saveList, edges, seed, worldState = {}) {
  return {
    campaign: {
      id: 'wf', name: 'wf', settlementIds: saveList.map((s) => s.id),
      worldState: { rngSeed: seed, tick: 1, simulationRules: {}, ...worldState },
      regionalGraph: ensureRegionalGraph({ edges }),
      wizardNews: { currentTick: 1, entries: [] },
    },
    saves: saveList,
  };
}

/** ONE advance: drive the fold, persist religionStates, and mirror each patron back onto
 *  config.primaryDeitySnapshot exactly as the kernel's deityReembed does. The mirror is
 *  load-bearing: without it every tick manufactures a DM re-assign out of a stale config. */
function step(campaign, saves, rules) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const rng = createPRNG(`${campaign.worldState.rngSeed}::tick:${campaign.worldState.tick}`);
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules, rng });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id];
    const patron = st ? patronSnapshot(st) : null;
    return patron ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } } } : s;
  });
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves };
}

function drive(seed, ticks, hook = null) {
  let { campaign, saves } = seed;
  for (let t = 0; t < ticks; t++) {
    if (hook) ({ campaign, saves } = hook(t, campaign, saves) || { campaign, saves });
    ({ campaign, saves } = step(campaign, saves, SPREAD));
  }
  return { world: campaign.worldState, campaign, saves };
}

/** Re-assign the patron the way the DM's SET_PRIMARY_DEITY verb does: the embed field set
 *  on config, never a poke at worldState.religionStates. */
const reassign = (saves, id, d) => saves.map((s) => (s.id !== id ? s : {
  ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: d._deityRef, primaryDeitySnapshot: d } },
}));

// ── THE MEASURED FIXTURES ────────────────────────────────────────────────────────────
const AURUM = deity('Aurum', 'peaceful', 'good', 'major');
const FADED = deity('Faded', 'neutral', 'neutral', 'cult');
/** ORGANIC DISPLACEMENT. MEASURED: Btown's seat flips Faded → Aurum at tick 12, so the
 *  16-tick run below clears it by four. A run of four ticks records nothing at all. */
const organic = (rules) => region([save('a', 'Acity', AURUM, 'city'), save('b', 'Btown', FADED, 'town')],
  [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }], 'rel', { simulationRules: rules });

const IRONJAW = deity('Ironjaw', 'warlike', 'evil', 'major');
const MEADOW = deity('Meadow', 'peaceful', 'good', 'cult');
/** GARRISON. MEASURED: the occupier's creed takes Btown's seat at tick 12. */
const garrison = () => region([save('a', 'Acity', IRONJAW, 'city'), save('b', 'Btown', MEADOW, 'town')],
  [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], 'occ',
  { simulationRules: { faithUnseatingEnabled: true }, occupations: { b: { occupierId: 'a' } } });

const HEARTH = deity('Hearth', 'peaceful', 'good', 'major');
const STORM = deity('Stormcaller', 'warlike', 'neutral', 'major');
/** THE DM FLIP. MEASURED: the re-assign lands at tick 5, the tick the verb is applied. */
const dmWorld = (rules) => region([save('b', 'Btown', HEARTH, 'town')], [], 'dm', { simulationRules: rules });

const LOAM = deity('Loam', 'neutral', 'neutral', 'cult');
const THRESHER = deity('Thresher', 'neutral', 'neutral', 'major');
/** FORCED EVICTION. The seated patron is diluted to 82 share by three IMPOSE_CULT entries
 *  in other niches, which is what lets a same-niche claim clear PUSH_MARGIN 1.1 at all.
 *  MEASURED: Loam is evicted and the seat changes at tick 2. */
function eviction() {
  const b = save('b', 'Bcity', LOAM, 'city');
  b.settlement.config.cultDeitySnapshots = ['Ashen', 'Brine', 'Cinder']
    .map((n, i) => ({ ...deity(n, i === 1 ? 'peaceful' : 'warlike', i === 0 ? 'evil' : 'good', 'cult'), lawAxis: 'neutral' }));
  return region([save('a', 'Acity', THRESHER, 'metropolis'), b],
    [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }], 'supp',
    { simulationRules: { faithUnseatingEnabled: true } });
}

const ASHGRAVE = deity('Ashgrave', 'warlike', 'evil', 'cult');
const DAWNWELL = deity('Dawnwell', 'peaceful', 'good', 'major');
/** THE SCHISM. Two IMPOSE_CULT entries and NO legacy patron: both seats are seeded at the
 *  cult legitimacy floor, well under LEGIT_ORGANIC_CONTEST, so the seat is organically
 *  contestable from the first tick and the seeded roll decides it. MEASURED: the contest
 *  resolves and the seat changes at tick 7. */
function schism() {
  const x = save('x', 'Xburg', null, 'city');
  x.settlement.config.cultDeitySnapshots = [ASHGRAVE, DAWNWELL].map((d) => ({ ...d, lawAxis: 'neutral' }));
  return region([x], [], 'disc-a', { simulationRules: { faithUnseatingEnabled: true } });
}

describe('WF-1a · the typed patron fall — the flag, the leaf, the ring and the classifier', () => {
  it('A1 · a sustained organic share flip appends exactly one displaced record naming the OUTGOING patron', () => {
    const { world } = drive(organic({ faithUnseatingEnabled: true }), 16);
    const st = world.religionStates.b;
    expect(st.patronRef).toBe(ref('Aurum'));
    expect(st.patronFalls).toEqual([{ ref: ref('Faded'), cause: 'displaced', atTick: 12 }]);
    // EXACTLY ONE, and the run continues four ticks past the flip: a ring that re-appended
    // every tick after the transition would read four here.
    expect(st.patronFalls).toHaveLength(1);
  });

  it('A2 · absent and false are byte-identical on a deity-BEARING world, and the lit arm moves a fenced byte', () => {
    const absent = JSON.stringify(drive(organic({}), 16).world.religionStates);
    const off = JSON.stringify(drive(organic({ faithUnseatingEnabled: false }), 16).world.religionStates);
    // THE LIT-MUTANT CONTROL. The absent-vs-false differential is blind by design — it
    // would pass over a subsystem that was never wired — so the lit arm is what proves the
    // fence can see at all. The drive is the LITERAL key: mechanismLitCoverage grants AUTO
    // credit only on a literal, and a computed key attributes to no key.
    const lit = JSON.stringify(drive(organic({ faithUnseatingEnabled: true }), 16).world.religionStates);
    expect(absent).toBe(off);
    expect(lit).not.toBe(absent);
    // The fixture really carries faith, so the byte-identity claim is not vacuous.
    expect(absent).toContain(ref('Aurum'));
    // anchored: the positive one line up proves the serialized state is populated and spellable, so this absence is the missing RING and not an empty subject
    expect(absent).not.toContain('patronFalls');
    expect(lit).toContain('patronFalls');
  });

  it('A3 · a pressed patron that holds mints no record and materializes no key, with the rival genuinely ahead on share', () => {
    let { campaign, saves } = region([save('a', 'Acity', IRONJAW, 'city'), save('b', 'Btown', deity('Meadow', 'peaceful', 'good', 'major'), 'town')],
      [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }], 'hold', { simulationRules: { faithUnseatingEnabled: true } });
    let worstLead = Number.POSITIVE_INFINITY;
    for (let t = 0; t < 40; t++) {
      ({ campaign, saves } = step(campaign, saves, SPREAD));
      const st = campaign.worldState.religionStates.b;
      const held = st.deities[st.patronRef]?.share ?? 0;
      const rival = Math.max(0, ...Object.keys(st.deities)
        .filter((k) => k !== st.patronRef && !st.deities[k].suppressed).map((k) => st.deities[k].share));
      worstLead = Math.min(worstLead, held - rival);
    }
    const st = campaign.worldState.religionStates.b;
    // NON-VACUITY: the rival did not merely exist, it ended up AHEAD on adherent share and
    // the patron still held — the erodable PATRON_HOLD buffer doing exactly its job. A
    // fixture where nothing pressed would read a large positive lead here.
    expect(worstLead).toBeLessThan(0);
    expect(Math.abs(worstLead)).toBeLessThan(RELIGION_TUNING.PATRON_FLIP_MARGIN);
    expect(st.patronRef).toBe(ref('Meadow'));
    expect(Object.hasOwn(st, 'patronFalls')).toBe(false);
  });

  it('A4 · all four causes are reachable arm by arm, and the vocabulary is closed at four with abandoned absent', () => {
    // ⚠ FOUR PRODUCERS, ACROSS TWO CASES, AND THE SPLIT IS DELIBERATE. `imposed` has TWO
    // producers — the garrison and the DM's SET_PRIMARY_DEITY re-assign — and the DM one
    // lives wholly in A5. Driving it here as well would make mutant (a) (collapse every arm
    // to displaced) and mutant (c) (key the classifier on prevPatron) convict the IDENTICAL
    // set of cases, which is the recorded signature of one guard subsuming the other. The
    // denominator is still four producers; it is the case boundary that moved.
    // GARRISON ⇒ imposed. The occupier's creed takes the seat under arms.
    const occ = drive(garrison(), 14).world.religionStates.b;
    expect(occ.patronFalls[0]).toEqual({ ref: ref('Meadow'), cause: 'imposed', atTick: 12 });
    // FORCED ENTRY ⇒ suppressed. attemptEntry named the outgoing patron in `evicted`.
    const sup = drive(eviction(), 20).world.religionStates.b;
    expect(sup.patronFalls[0]).toEqual({ ref: ref('Loam'), cause: 'suppressed', atTick: 2 });
    expect(sup.deities[ref('Loam')].suppressed).toBe(true);
    // SCHISM ⇒ discredited. resolvePatronContest owned the seat and the roll went the
    // challenger's way three ticks running.
    const dis = drive(schism(), 40).world.religionStates.x;
    expect(dis.patronFalls[0]).toEqual({ ref: ref('Ashgrave'), cause: 'discredited', atTick: 7 });
    // …AND THE VOCABULARY IS CLOSED. Four tokens, codepoint-ordered, every one produced above.
    expect(PATRON_FALL_CAUSES).toEqual(['discredited', 'displaced', 'imposed', 'suppressed']);
    // anchored: the exact-equality one line up proves the frozen list is populated and spellable, so this absence is the CUT token and not an empty array
    expect(PATRON_FALL_CAUSES).not.toContain('abandoned');
    expect(recordPatronFall({}, { ref: 'x', cause: 'abandoned', atTick: 1 })).toBeNull();
  });

  it('A5 · a SET_PRIMARY_DEITY flip fires an imposed fall, which a classifier keyed on prevPatron cannot see', () => {
    const { world } = drive(dmWorld({ faithUnseatingEnabled: true }), 10,
      (t, campaign, saves) => (t !== 4 ? null : { campaign, saves: reassign(saves, 'b', STORM) }));
    const st = world.religionStates.b;
    expect(st.patronRef).toBe(ref('Stormcaller'));
    expect(st.patronFalls).toEqual([{ ref: ref('Hearth'), cause: 'imposed', atTick: 5 }]);
    // ⛔ THE REGRESSION THIS CASE EXISTS FOR. ensureReligionState's DM RE-ASSIGN branch
    // writes s.patronRef BEFORE the fold reads prevPatron, so on this world the two are
    // EQUAL at the classify site and a prevPatron-keyed classifier records nothing. This
    // assertion is the executed proof that the two captures genuinely differ here — it is
    // what mutant (c) reds, and it reds nowhere else.
    const priorPatron = ref('Hearth');
    expect(st.patronRef).not.toBe(priorPatron);
    expect(fallCauseFor(st, priorPatron)).toBe('imposed');
  });

  it('A6 · five successive falls leave exactly FALL_RING_CAP records newest-first, and a quiet tick appends nothing', () => {
    const gods = ['Hearth', 'Stormcaller', 'Tidewright', 'Umberfast', 'Volund', 'Wardenrock']
      .map((n, i) => deity(n, i % 2 ? 'warlike' : 'peaceful', i % 3 ? 'neutral' : 'good', 'major'));
    let { campaign, saves } = region([save('b', 'Btown', gods[0], 'town')], [], 'ring', { simulationRules: { faithUnseatingEnabled: true } });
    for (let t = 0; t < 12; t++) {
      if (t >= 1 && t <= 5) saves = reassign(saves, 'b', gods[t]);
      ({ campaign, saves } = step(campaign, saves, SPREAD));
    }
    const ring = campaign.worldState.religionStates.b.patronFalls;
    expect(FALL_RING_CAP).toBe(3);
    expect(ring).toHaveLength(FALL_RING_CAP);
    // NEWEST FIRST, strictly: the ticks descend, so the oldest of the five is the one gone.
    expect(ring.map((row) => row.atTick)).toEqual([...ring.map((row) => row.atTick)].sort((a, b) => b - a));
    expect(ring[0].atTick).toBeGreaterThan(ring[FALL_RING_CAP - 1].atTick);
    // IDEMPOTENCY: three further ticks with no transition append nothing.
    const before = JSON.stringify(ring);
    for (let t = 0; t < 3; t++) ({ campaign, saves } = step(campaign, saves, SPREAD));
    expect(JSON.stringify(campaign.worldState.religionStates.b.patronFalls)).toBe(before);
  });

  it('A7 · the ring survives a serialization round trip and an undo, and a regen that drops religionStates drops it too', () => {
    const { world, campaign, saves } = drive(organic({ faithUnseatingEnabled: true }), 16);
    const ring = world.religionStates.b.patronFalls;
    expect(ring).toHaveLength(1);
    // PERSIST + RELOAD, then advance again from the reloaded world.
    const reloaded = JSON.parse(JSON.stringify(world));
    expect(reloaded.religionStates.b.patronFalls).toEqual(ring);
    const after = step({ ...campaign, worldState: reloaded }, saves, SPREAD).campaign.worldState.religionStates.b;
    expect(after.patronFalls).toEqual(ring);
    // UNDO: the ring rides the world snapshot wholesale, with no key of its own to restore.
    expect(JSON.parse(JSON.stringify(world)).religionStates.b.patronFalls).toEqual(ring);
    // A FULL REGEN THAT DROPS religionStates DROPS THE RING WITH IT. Declared and asserted
    // rather than discovered: the ring is engine history keyed to the state container, and
    // a world rebuilt from nothing has not lived the falls.
    const fresh = step(organic({ faithUnseatingEnabled: true }).campaign, organic({ faithUnseatingEnabled: true }).saves, SPREAD);
    expect(Object.hasOwn(fresh.campaign.worldState.religionStates.b, 'patronFalls')).toBe(false);
  });

  it('A8 · a world that never fell carries no patronFalls key at all, and the leaf refuses to mint one', () => {
    // Six ticks is deliberately SHORT OF the measured tick-12 flip: the seat never changes.
    const { world } = drive(organic({ faithUnseatingEnabled: true }), 6);
    const st = world.religionStates.b;
    expect(st.patronRef).toBe(ref('Faded'));
    expect(Object.hasOwn(st, 'patronFalls')).toBe(false);
    expect(st.patronFalls).toBeUndefined();
    // An empty array is a key and a key is a byte — in every save, undo snapshot and
    // same-seed hash — so absence is asserted at the serialized level too.
    const serialized = JSON.stringify(world.religionStates);
    expect(serialized).toContain(ref('Faded'));
    // anchored: the positive one line up proves the serialized state is populated and spellable, so this absence measures the missing key rather than an empty string
    expect(serialized).not.toContain('patronFalls');
    // …AND THE WRITER REFUSES the shapes that would create one by accident.
    const bare = {};
    expect(recordPatronFall(bare, { ref: null, cause: 'displaced', atTick: 3 })).toBeNull();
    expect(Object.hasOwn(bare, 'patronFalls')).toBe(false);
    expect(fallCauseFor(bare, ref('Faded'))).toBeNull();
    expect(fallCauseFor(null, null)).toBeNull();
    // The classifier is TOTAL: it never returns null for a real transition.
    expect(PATRON_FALL_CAUSES).toContain(classifyPatronFall({}));
  });
});
