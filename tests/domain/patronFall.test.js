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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { PATRON_FALL_CAUSES, FALL_RING_CAP, classifyPatronFall, recordPatronFall, fallCauseFor } from '../../src/domain/worldPulse/patronFall.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot, RELIGION_TUNING, attemptEntry, resolvePatronContest, advanceShares } from '../../src/domain/worldPulse/religionState.js';
import { nicheOf } from '../../src/domain/worldPulse/cultImpositionApply.js';
import { ensureWorldState, runWorldStateMigrations, CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';
import { WORLD_SNAPSHOT_HARD_DENY, WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST } from '../../src/domain/display/worldSnapshotPublic.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
// WF-8a — the settlement extinction obituary's acceptance surface (B1-B8).
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { newsEntryForOutcome, isDriftOnlyOutcome } from '../../src/domain/worldPulse/worldPulseFeedCuration.js';
import { SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { FREQUENCY_FLOORS } from '../helpers/kindPoolWalker.js';
import { FAITH_KIND_REGISTRY, FAITH_KINDS, faithLine } from '../../src/domain/worldPulse/faithNews.js';

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
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves, outcomes: r.outcomes };
}

function drive(seed, ticks, hook = null) {
  let { campaign, saves } = seed;
  /** WF-8a: the fold's own outcome stream, kept so the obituary can be read at its source as
   *  well as at the feed. Additive — every existing caller destructures world/campaign/saves. */
  const outcomes = [];
  for (let t = 0; t < ticks; t++) {
    if (hook) ({ campaign, saves } = hook(t, campaign, saves) || { campaign, saves });
    const stepped = step(campaign, saves, SPREAD);
    campaign = stepped.campaign; saves = stepped.saves;
    for (const o of stepped.outcomes) outcomes.push({ tick: campaign.worldState.tick - 1, o });
  }
  return { world: campaign.worldState, campaign, saves, outcomes };
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
function eviction(rules = { faithUnseatingEnabled: true }) {
  const b = save('b', 'Bcity', LOAM, 'city');
  b.settlement.config.cultDeitySnapshots = ['Ashen', 'Brine', 'Cinder']
    .map((n, i) => ({ ...deity(n, i === 1 ? 'peaceful' : 'warlike', i === 0 ? 'evil' : 'good', 'cult'), lawAxis: 'neutral' }));
  return region([save('a', 'Acity', THRESHER, 'metropolis'), b],
    [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }], 'supp',
    { simulationRules: rules });
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


// ── WF-8a · THE SETTLEMENT EXTINCTION OBITUARY — MEASURED FIXTURES (B1-B8) ────────────
//
// ⛔ EVERY FIGURE BELOW WAS RUN AND PRINTED BEFORE ITS ASSERTION WAS WRITTEN, and the first run
// REFUTED the packet's own mint rule. A bare per-deletion mint produced TWENTY-FIVE obituaries
// for THREE creeds in one sixteen-tick village: `pruneSuppressed` genuinely deletes an entry,
// and a creed with a ROAD BACK re-enters next tick and is deleted again. Two roads exist and
// both were found by execution — a neighbour still CARRYING the creed, and the settlement's own
// EMBEDDED snapshots, which `ensureReligionState` re-installs as the dominant patron. The fold
// closes both, and B4 convicts each one separately.
//
// ⭐ THE STORY THE REACHABLE FIXTURE TELLS is the one the beat is for: four neighbours change
// their own patron rite (the DM verb), nobody carries the old creeds any more, and the last
// altars to them in Zed go dark — each creed named exactly ONCE, ever.
const SUCCESSORS = ['Quill', 'Rook', 'Sable', 'Tarn', 'Umber', 'Vane', 'Wold', 'Yarrow'];
const RING_NAMES = ['Alder', 'Bramble', 'Cinder', 'Dunmar', 'Ember', 'Fenwick', 'Gale', 'Holt'];
const TEMPERS = ['peaceful', 'warlike', 'neutral'];
const ALIGNS = ['good', 'evil', 'neutral'];
const OBITUARY = 'faith_last_altar_dark';

/** A ring of metropolis neighbours, each bearing its own creed, around one small town `z`. */
function ring(n, tier, rules) {
  const target = save('z', 'Zed', deity('Zenith', 'neutral', 'neutral', 'major'), tier);
  const neigh = [];
  for (let i = 0; i < n; i += 1) {
    neigh.push(save(`n${i}`, `N${i}`,
      deity(RING_NAMES[i], TEMPERS[i % 3], ALIGNS[Math.floor(i / 3) % 3], i % 2 ? 'major' : 'minor'),
      'metropolis'));
  }
  return region([target, ...neigh],
    neigh.map((sv) => ({ id: `edge.${sv.id}.z`, from: sv.id, to: 'z', relationshipType: 'allied' })),
    'reach', { simulationRules: { religionDynamicsEnabled: true, ...rules } });
}

/**
 * Drive the REAL pulse. `withdrawAt`/`withdrawCount` apply the DM's SET_PRIMARY_DEITY verb to
 * that many neighbours at that pulse — the carrier withdrawal — through the same embed field set
 * `reassign` uses. Returns every UNIQUE obituary entry the feed ever carried.
 */
function pulseRun(seed, pulses, withdrawAt = -1, withdrawCount = 0) {
  let { campaign, saves } = seed;
  const seen = [];
  for (let i = 0; i < pulses; i += 1) {
    if (i === withdrawAt) {
      for (let k = 0; k < withdrawCount; k += 1) {
        saves = reassign(saves, `n${k}`, deity(SUCCESSORS[k], TEMPERS[(k + 1) % 3], ALIGNS[(k + 1) % 3], 'major'));
      }
    }
    const res = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', commit: false, now: NOW });
    for (const e of (res?.wizardNews?.entries || [])) {
      if (e.impactKind === OBITUARY && !seen.some((f) => f.id === e.id)) seen.push({ pulse: i, ...e });
    }
    campaign = { ...campaign, worldState: res.worldState, regionalGraph: res.regionalGraph || campaign.regionalGraph, wizardNews: res.wizardNews };
    if (res.settlementUpdates) {
      saves = saves.map((sv) => {
        const u = res.settlementUpdates.find((x) => String(x.id) === String(sv.id));
        return u && u.settlement ? { ...sv, settlement: u.settlement } : sv;
      });
    }
  }
  return seen;
}

/** The creed a beat names, off its own outcome id. */
const creedOf = (entry) => String(entry.sourceEventId).split('lu_')[1];

/** MEASURED: the withdrawal at pulse 6 darkens three altars at pulse 6 and nothing thereafter. */
const WITHDRAWN = pulseRun(ring(8, 'village', { faithUnseatingEnabled: true }), 22, 6, 4);
/** The SAME ring with no withdrawal at all — the near-miss negative's arm. */
const HELD = pulseRun(ring(8, 'village', { faithUnseatingEnabled: true }), 22);
/** The same withdrawal, dark. */
const WITHDRAWN_DARK = pulseRun(ring(8, 'village', {}), 22, 6, 4);

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

  // ── WF-1b · THE STAMPED SUPPRESSION AND THE FLAG-FORKED PRUNE KEY ───────────────────
  // ⛔ EVERY FIXTURE BELOW WAS RUN AND PRINTED BEFORE ITS ASSERTION WAS WRITTEN, at this tip,
  // and one of those runs REFUTED a pin that reading alone would have written — see A1.
  // The eight cases are straight-line `it` calls inside WF-1a's existing describe on purpose:
  // this member mints no test file and no suite title, so the estate's lighting census moves
  // by titles only.

  it('WF-1b A1 · the same-niche push-out stamps suppressedAtTick, and the hand-authored niche that would make this pin vacuous is PROVEN vacuous', () => {
    const newcomer = { _deityRef: 'd.B', name: 'B' };
    /** @param {string} incumbentNiche @param {{tick?: number|null}} [opts] */
    const push = (incumbentNiche, opts = {}) => {
      const state = { capacity: 3, patronRef: 'd.A', deities: {
        'd.A': { deityRef: 'd.A', snapshot: { _deityRef: 'd.A', name: 'A' }, niche: incumbentNiche, share: 60, standing: 'patron', suppressed: false, legitimacy: 0.5, tenure: 5 },
      } };
      return { state, out: attemptEntry(state, newcomer, 0.9, opts) };
    };
    // ⛔⛔ THE MEASURED HAZARD, AND IT IS NOT IN THE FAMILY ANNEX. `nicheOf` is a COMPUTED niche
    // (`temper:alignment`), so an incumbent carrying a hand-authored niche string never matches
    // the newcomer's: the entry falls through to open_slot, evicts nothing, and a site-:262 pin
    // passes GREEN having asserted nothing. The fixture must build the niche THROUGH nicheOf.
    expect(nicheOf(newcomer)).toBe('neutral:neutral');
    expect(RELIGION_TUNING.PUSH_MARGIN).toBe(1.1);   // claim 90 clears 60 x 1.1 = 66
    const lit = push(nicheOf(newcomer), { tick: 7 });
    expect(lit.out).toEqual({ entered: true, path: 'same_niche_pushout', evicted: 'd.A' });
    expect(lit.state.deities['d.A'].suppressed).toBe(true);
    expect(lit.state.deities['d.A'].share).toBe(0);
    expect(lit.state.deities['d.A'].standing).toBe('cult');
    expect(lit.state.deities['d.A'].suppressedAtTick).toBe(7);
    // THE VACUITY CONTROL: the identical fixture with a hand-authored niche cannot execute the
    // defect at all. This arm is the reason the arm above means something.
    const authored = push('harvest', { tick: 7 });
    expect(authored.out).toEqual({ entered: true, path: 'open_slot', evicted: null });
    expect(authored.state.deities['d.A'].suppressed).toBe(false);
    // …AND DARK the same push-out suppresses exactly as it always did and stamps nothing.
    const dark = push(nicheOf(newcomer));
    expect(dark.out).toEqual({ entered: true, path: 'same_niche_pushout', evicted: 'd.A' });
    expect(dark.state.deities['d.A'].suppressed).toBe(true);
    expect(Object.hasOwn(dark.state.deities['d.A'], 'suppressedAtTick')).toBe(false);
  });

  it('WF-1b A2 · absent and false serialize identically on a SUPPRESSING deity-bearing world, and the LITERAL lit drive materializes the stamp', () => {
    const absent = JSON.stringify(drive(eviction({}), 20).world.religionStates);
    const off = JSON.stringify(drive(eviction({ faithUnseatingEnabled: false }), 20).world.religionStates);
    // THE LIT-MUTANT CONTROL. The absent-vs-false differential is blind by design. The drive is
    // the LITERAL key: mechanismLitCoverage grants AUTO credit only on a literal, and a computed
    // key attributes to NO key. ⛔ The deity-free corpus golden is NOT this fence and is vacuous
    // for faith; every deity here arrives through the doctrine path.
    const lit = JSON.stringify(drive(eviction({ faithUnseatingEnabled: true }), 20).world.religionStates);
    expect(absent).toBe(off);
    expect(lit).not.toBe(absent);
    // NON-VACUITY, TWICE OVER: the fixture really carries faith, AND the dark run really did
    // suppress a creed — so the absence below is the missing STAMP, never a missing suppression.
    expect(absent).toContain(ref('Loam'));
    expect(absent).toContain('"suppressed":true');
    // anchored: the two positives directly above prove the dark serialization is populated, spellable AND genuinely suppressing, so this absence measures the un-materialized stamp rather than an empty subject
    expect(absent).not.toContain('suppressedAtTick');
    expect(lit).toContain('suppressedAtTick');
  });

  it('WF-1b A3 · the siege stamps only at the resolving tick, and the two ticks that OWN the seat while suppressing nothing stamp nothing', () => {
    const niche = nicheOf({ _deityRef: 'd.x', name: 'x' });
    const state = { capacity: 5, patronRef: 'd.A', deities: {
      'd.A': { deityRef: 'd.A', snapshot: { _deityRef: 'd.A', name: 'A' }, niche, share: 50, standing: 'patron', suppressed: false, legitimacy: 0.05, tenure: 3 },
      'd.B': { deityRef: 'd.B', snapshot: { _deityRef: 'd.B', name: 'B' }, niche, share: 50, standing: 'state', suppressed: false, legitimacy: 0.9, tenure: 3 },
    } };
    const rng = { weightedPick: (/** @type {string[]} */ items) => (items.includes('d.B') ? 'd.B' : items[0]) };
    const seen = [];
    for (let tick = 1; tick <= 3; tick += 1) {
      const owned = resolvePatronContest(state, rng, tick);
      seen.push({ tick, owned, suppressed: state.deities['d.A'].suppressed === true, stamp: state.deities['d.A'].suppressedAtTick ?? null });
    }
    // ⛔ MEASURED: the siege returns owned=true on ticks 1 and 2 while suppressing NOTHING. Those
    // two rows are a genuine negative — the counterforce is running — and not an absence of setup.
    expect(RELIGION_TUNING.PATRON_FLIP_TICKS).toBe(3);
    expect(seen).toEqual([
      { tick: 1, owned: true, suppressed: false, stamp: null },
      { tick: 2, owned: true, suppressed: false, stamp: null },
      { tick: 3, owned: true, suppressed: true, stamp: 3 },
    ]);
    expect(state.patronRef).toBe('d.B');
  });

  it('WF-1b A4 · the stamp is cleared by RESURGENCE and by nothing else, asserted at the byte level in both directions', () => {
    const newcomer = { _deityRef: 'd.B', name: 'B' };
    const state = { capacity: 3, patronRef: 'd.A', deities: {
      'd.A': { deityRef: 'd.A', snapshot: { _deityRef: 'd.A', name: 'A' }, niche: nicheOf(newcomer), share: 60, standing: 'patron', suppressed: false, legitimacy: 0.5, tenure: 5 },
    } };
    attemptEntry(state, newcomer, 0.9, { tick: 11 });
    expect(state.deities['d.A'].suppressedAtTick).toBe(11);
    expect(JSON.stringify(state.deities['d.A'])).toContain('"suppressedAtTick":11');
    // ⭐ RESURGENCE: attemptEntry's seed() replaces the returning creed's record WHOLESALE, and the
    // seed carries no stamp — so a creed back in the light carries no stale mark of its dormancy.
    const back = attemptEntry(state, { _deityRef: 'd.A', name: 'A' }, 0.9, { tick: 19 });
    expect(back.entered).toBe(true);
    expect(state.deities['d.A'].suppressed).toBe(false);
    const resurged = JSON.stringify(state.deities['d.A']);
    expect(resurged).toContain('"suppressed":false');
    // anchored: the positive one line up proves the resurged record is populated and spellable, so this absence is the CLEARED stamp and not an empty object
    expect(resurged).not.toContain('suppressedAtTick');
    // …and the creed it displaced on its way back IS stamped, so the clear is scoped to the
    // returning record rather than being a blanket failure to write.
    expect(state.deities['d.B'].suppressedAtTick).toBe(19);
  });

  it('WF-1b A5 · the narrative prune drops the LONGEST-DORMANT where the dark prune drops the codepoint-last, on a fixture whose two orders disagree', () => {
    // ⛔ A fixture whose codepoint order and stamp order AGREE is vacuous — base == cure — and is
    // a STOP. These disagree by construction: the longest-dormant is d.S2 (stamp 10) while the
    // codepoint-last is d.S4. Whichever ref the prune drops therefore names which key it sorted on.
    const STAMPS = { 'd.S1': 40, 'd.S2': 10, 'd.S3': 30, 'd.S4': 20 };
    /** @param {Record<string, number|undefined>} stamps */
    const build = (stamps) => ({ capacity: 9, patronRef: 'd.LIVE', deities: {
      'd.LIVE': { deityRef: 'd.LIVE', snapshot: { _deityRef: 'd.LIVE', name: 'LIVE' }, niche: 'a:a', share: 100, standing: 'patron', suppressed: false },
      ...Object.fromEntries(Object.keys(STAMPS).map((k) => [k, {
        deityRef: k, snapshot: { _deityRef: k, name: k }, niche: `${k}:x`, share: 0, standing: 'cult', suppressed: true,
        ...(Number.isFinite(stamps[k]) ? { suppressedAtTick: stamps[k] } : {}),
      }])),
    } });
    const dark = build(STAMPS);
    expect(advanceShares(dark, { 'd.LIVE': 1 })).toEqual(['d.S4']);
    const lit = build(STAMPS);
    expect(advanceShares(lit, { 'd.LIVE': 1 }, { narrativePrune: true })).toEqual(['d.S2']);
    expect(Object.hasOwn(lit.deities, 'd.S2')).toBe(false);
    expect(Object.hasOwn(lit.deities, 'd.S4')).toBe(true);
    // THE TIE / LEGACY ARM. An UNSTAMPED entry — a record written dark, or before this wave —
    // sorts BELOW every stamped one and is dropped first, exactly as the volume specifies.
    const legacy = build({ ...STAMPS, 'd.S1': undefined });
    expect(advanceShares(legacy, { 'd.LIVE': 1 }, { narrativePrune: true })).toEqual(['d.S1']);
    // …and two entries that are BOTH unstamped fall back to codepoint between themselves, which
    // is the second, distinct reason the comparator needs a total tiebreak.
    const twoLegacy = build({ ...STAMPS, 'd.S1': undefined, 'd.S3': undefined });
    expect(advanceShares(twoLegacy, { 'd.LIVE': 1 }, { narrativePrune: true })).toEqual(['d.S3']);
  });

  it('WF-1b A6 · the stamp round-trips through ensureWorldState and the schema-2 migration, adds no top-level ledger key, and stays behind the veil', () => {
    const stamped = { patronRef: null, capacity: 3, deities: { 'd.A': { deityRef: 'd.A', snapshot: { _deityRef: 'd.A' }, niche: 'a:a', share: 0, standing: 'cult', suppressed: true, suppressedAtTick: 12 } } };
    const bare = { patronRef: 'd.A', capacity: 3, deities: { 'd.A': { deityRef: 'd.A', snapshot: { _deityRef: 'd.A' }, niche: 'a:a', share: 100, standing: 'patron', suppressed: false } } };
    // BOTH ARMS through the REAL seam. religionStates takes the deepCloneConditionalLedger branch,
    // so no dedicated normalizer is owed and an added sub-key rides verbatim.
    for (const [label, st] of /** @type {[string, any][]} */ ([['field-present', stamped], ['field-absent', bare]])) {
      expect(JSON.stringify(ensureWorldState({ religionStates: { b: st } }).religionStates.b), label).toBe(JSON.stringify(st));
    }
    // SUB-KEY ORDER IS THE WRITER'S ENUMERATION AND IS PINNED, NOT ASSUMED: the spread preserves
    // the record's existing keys in place, so the stamp appends LAST.
    expect(Object.keys(stamped.deities['d.A']).at(-1)).toBe('suppressedAtTick');
    // ⛔ THE LIVE MIGRATION, WHICH NEITHER COPY OF THE VOLUME MENTIONS. The { to: 2 } chief→patron
    // rename spreads ...rest, so a new conditional sub-key survives it. Asserted, not assumed.
    const migrated = runWorldStateMigrations({ religionStates: { b: { chiefRef: 'd.A', chiefHeld: 2, deities: stamped.deities } } });
    expect(migrated.religionStates.b.patronRef).toBe('d.A');
    expect(migrated.religionStates.b.deities['d.A'].suppressedAtTick).toBe(12);
    // ZERO NEW TOP-LEVEL KEYS, asserted rather than assumed: the stamp lives INSIDE an existing
    // conditional ledger, so the append-only ledger-key order does not move.
    expect(CONDITIONAL_LEDGER_KEYS).toContain('religionStates');
    // anchored: the membership positive one line up proves the frozen ledger list is populated and spellable, so this absence measures that the wave added NO top-level key rather than an empty list
    expect(CONDITIONAL_LEDGER_KEYS).not.toContain('suppressedAtTick');
    // THE VEIL, asserted rather than reasoned about.
    expect(WORLD_SNAPSHOT_HARD_DENY).toContain('religionStates');
    // anchored: the deny-membership positive one line up proves both frozen lists are populated and spellable, so this absence is the ledger genuinely staying behind the veil rather than an empty allowlist
    expect(WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST).not.toContain('religionStates');
  });

  it('WF-1b A7 · the prune returns exactly the refs it deleted and an EMPTY ARRAY when it deleted none, and its fire bar derives from the landed KEEP', () => {
    /** @param {number} n */
    const build = (n) => ({ capacity: 9, patronRef: 'd.LIVE', deities: {
      'd.LIVE': { deityRef: 'd.LIVE', snapshot: { _deityRef: 'd.LIVE', name: 'LIVE' }, niche: 'a:a', share: 100, standing: 'patron', suppressed: false },
      ...Object.fromEntries(Array.from({ length: n }, (_, i) => [`d.S${i + 1}`, {
        deityRef: `d.S${i + 1}`, snapshot: { _deityRef: `d.S${i + 1}`, name: `S${i + 1}` }, niche: `n${i}:x`, share: 0, standing: 'cult', suppressed: true,
      }])),
    } });
    // ⛔ MEASURED, at this tip. The bar is `supp.length > KEEP` read where KEEP already lives, so
    // it DERIVES from the landed constant instead of transcribing its value (ODQ §308.3 RAISED-4).
    const none = advanceShares(build(3), { 'd.LIVE': 1 });
    expect(Array.isArray(none)).toBe(true);
    expect(none).toEqual([]);
    expect(advanceShares(build(4), { 'd.LIVE': 1 })).toEqual(['d.S4']);
    expect(advanceShares(build(5), { 'd.LIVE': 1 })).toEqual(['d.S4', 'd.S5']);
    // THE EMPTY-KEYS ARM RETURNS THE SAME SHAPE — never null, never undefined, so the seam the
    // WF-8 beat member lands on can be consumed without a nullish guard on any path.
    const noFaith = advanceShares({ capacity: 3, patronRef: null, deities: {} }, {});
    expect(Array.isArray(noFaith)).toBe(true);
    expect(noFaith).toEqual([]);
  });

  it('WF-1b A8 · the comment-stripped source scan finds ONE raw suppression write, inside the sole writer, and exactly THREE routed call sites', () => {
    const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
    const src = readFileSync(join(ROOT, 'src', 'domain', 'worldPulse', 'religionState.js'), 'utf8');
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
    const rawWrites = [...stripped.matchAll(/suppressed:\s*true/g)];
    const declarations = [...stripped.matchAll(/function suppressDeity\(/g)];
    const callSites = [...stripped.matchAll(/suppressDeity\(/g)].length - declarations.length;
    // ⛔ BOTH DIRECTIONS RED. A fourth site spelled INLINE raises the raw-write count; a fourth
    // site routed through the helper raises the call-site count, which is the reviewed act. The
    // volume's obligation — a future fourth site reds the pin instead of minting a stamp-less
    // entry — is discharged by the pair, never by either count alone.
    expect(declarations).toHaveLength(1);
    expect(rawWrites).toHaveLength(1);
    expect(callSites).toBe(3);
    // …AND THE ONE RAW WRITE IS THE WRITER'S OWN, not a stray that happens to keep the count at
    // one. Without this arm an inline write could replace the helper's and the counts would not move.
    const from = stripped.indexOf('function suppressDeity(');
    const body = stripped.slice(from, stripped.indexOf('\n}', from));
    expect(body).toContain('suppressed: true');
    expect(body).toContain('Number.isFinite(tick)');
    // ⚠ SPECTACLE-AWARENESS (§P2.9), stated affirmatively and MEASURED rather than asserted in
    // prose: the grand-observance predicate passes ANY act at scaleBand >= SPECTACLE_SCALE, so a
    // negative arm over a drawsPilgrims-class predicate can be silently satisfied. This member
    // touches no such predicate in either file, so no negative arm above can go vacuous that way.
    const fold = readFileSync(join(ROOT, 'src', 'domain', 'worldPulse', 'religiousContest.js'), 'utf8');
    const spectacle = /drawsPilgrims|SPECTACLE_SCALE|scaleBand/;
    expect(spectacle.test(src)).toBe(false);
    expect(spectacle.test(fold)).toBe(false);
    // NON-VACUITY OF THAT SCAN ITSELF: the predicate is real and the regex finds it at its home.
    expect(spectacle.test(readFileSync(join(ROOT, 'src', 'domain', 'traditions', 'pilgrimage.js'), 'utf8'))).toBe(true);
  });

  // ── WF-8a · B1-B8 · THE SETTLEMENT EXTINCTION OBITUARY ──────────────────────────────

  it('B1 · a carrier withdrawal darkens the last altars, each creed named exactly ONCE, through the REAL pulse', () => {
    // Four neighbours change their own patron rite at pulse 6. Nobody carries the old creeds to
    // Zed any more, and Zed's last altars to them go dark in that same pulse.
    expect(WITHDRAWN.length).toBeGreaterThanOrEqual(1);
    const creeds = WITHDRAWN.map(creedOf);
    // ⛔ EXACTLY ONCE, EVER. This is the arm the first implementation failed: a creed with a road
    // back is deleted and re-admitted every tick, and a bare per-deletion mint said so every time.
    expect(new Set(creeds).size).toBe(creeds.length);
    // The obituary names the creed by its AUTHORED snapshot name and the town by name — never a
    // ref slug — and both are read off the rendered headline rather than off the id.
    for (const entry of WITHDRAWN) {
      const authored = RING_NAMES.find((nm) => nm.toLowerCase() === creedOf(entry));
      expect(authored, `${creedOf(entry)}: no authored name`).toBeTruthy();
      expect(entry.headline).toContain(authored);
      expect(entry.headline).toContain('Zed');
    }
  });

  it('B2 · the same ring with NO withdrawal produces no obituary at all (the near-miss negative)', () => {
    // ⛔ THE POSITIVE COMPANION TRAVELS THE SAME FILTER. `HELD` and `WITHDRAWN` are the identical
    // ring, the identical seed and the identical twenty-two pulses, read through the identical
    // impactKind filter inside `pulseRun`; the ONLY difference is the withdrawal. Without this
    // arm the emptiness below would pass just as happily against a filter that had stopped
    // filtering, a feed that never populated, or a beat nothing could ever mint.
    expect(WITHDRAWN.length).toBeGreaterThanOrEqual(1);
    expect(HELD).toEqual([]);
    // …and the ring really did run and really did produce faith activity, so the empty result is
    // a settlement whose creeds all still have a road home rather than a fixture that did nothing.
    const { world } = drive(ring(8, 'village', { faithUnseatingEnabled: true }), 6);
    expect(Object.keys(world.religionStates.z.deities).length).toBeGreaterThan(1);
  });

  it('B3 · the beat is per DELETED CREED, never per tick — three altars, three beats, one pulse', () => {
    const atWithdrawal = WITHDRAWN.filter((e) => e.pulse === 6);
    expect(atWithdrawal.length).toBeGreaterThanOrEqual(2);
    // Every one of them is the SAME pulse and the SAME town, and they are distinct creeds — so
    // the count is the creeds', not the tick's. A per-tick mint would read exactly one here.
    expect(new Set(atWithdrawal.map(creedOf)).size).toBe(atWithdrawal.length);
    expect(new Set(atWithdrawal.map((e) => e.tick)).size).toBe(1);
    for (const e of atWithdrawal) expect(e.settlementIds).toEqual(['z']);
  });

  it('B4 · both ROADS BACK are fenced, each convicted with its deletion proven to have happened', () => {
    // ROAD TWO — THE SETTLEMENT'S OWN EMBEDDED SNAPSHOT. Zed's config names Zenith, and
    // `ensureReligionState`'s DM-re-assign branch re-installs an embedded patron as DOMINANT
    // whenever state and config disagree. So Zenith is deleted by the prune and comes straight
    // back. MEASURED through the real pulse before the fence: announced extinct at tick 4,
    // reinstalled at tick 5, announced again at tick 9.
    const run = drive(ring(8, 'village', { faithUnseatingEnabled: true }), 16);
    const beats = run.outcomes.filter(({ o }) => o.candidateType === OBITUARY).map(({ o }) => creedOf({ sourceEventId: o.id }));
    // THE POSITIVE COMPANIONS COME FIRST, and they travel the same filter: this run really does
    // mint obituaries, and Zenith really was in the pantheon to begin with.
    expect(beats.length).toBeGreaterThanOrEqual(1);
    const firstTick = drive(ring(8, 'village', { faithUnseatingEnabled: true }), 1);
    expect(Object.keys(firstTick.world.religionStates.z.deities)).toContain(ref('Zenith'));
    // THE DELETION IS PROVEN: Zenith is gone from the settlement's state at the end of the run.
    expect(Object.keys(run.world.religionStates.z.deities)).not.toContain(ref('Zenith')); // anchored: the same key list is asserted to CONTAIN Zenith one tick in, so this absence is a deletion rather than a creed that was never there
    // …and it is announced NOWHERE, because it has a road back its own town keeps open.
    // anchored: `beats` is asserted non-empty above, so this exclusion runs over a populated beat list read through the identical filter.
    expect(beats).not.toContain('zenith');

    // ROAD ONE — A CARRIER. The identical ring, the identical seed, the identical twenty-two
    // pulses and the identical impactKind filter; the ONLY difference is whether the neighbours
    // keep carrying their creeds. Held, every deleted creed is still arriving and NONE is
    // announced; withdrawn, the same creeds are announced by name.
    expect(HELD).toEqual([]);
    const withdrawnCreeds = WITHDRAWN.map(creedOf);
    expect(withdrawnCreeds.length).toBeGreaterThanOrEqual(1);
    // The creeds the withdrawal announces are exactly neighbours' creeds — the ones a carrier
    // was holding open until the DM verb closed the road.
    for (const creed of withdrawnCreeds) {
      expect(RING_NAMES.map((nm) => nm.toLowerCase())).toContain(creed);
    }
  });

  it('B5 · dormancy: absent and false are byte-identical, and the LIT literal drive moves a fenced byte', () => {
    const seed = () => ring(8, 'village', {});
    const absent = drive(seed(), 14);
    const off = drive(ring(8, 'village', { faithUnseatingEnabled: false }), 14);
    // THE LIT-MUTANT CONTROL. The absent-vs-false differential is blind by design — it would pass
    // over a subsystem that was never wired — so the lit arm is what proves the fence can see.
    // The drive is the LITERAL key: mechanismLitCoverage grants AUTO credit only on a literal.
    const lit = drive(ring(8, 'village', { faithUnseatingEnabled: true }), 14);
    expect(JSON.stringify(absent.world.religionStates)).toBe(JSON.stringify(off.world.religionStates));
    expect(JSON.stringify(absent.outcomes)).toBe(JSON.stringify(off.outcomes));
    expect(JSON.stringify(lit.world.religionStates)).not.toBe(JSON.stringify(absent.world.religionStates));
    // The fixture really carries faith, so the byte-identity claim is not two empty objects.
    expect(JSON.stringify(absent.world.religionStates)).toContain('custom:lu_');
    // The RENDERED FEED carries no obituary dark, read through the same filter that finds them lit.
    // anchored: WITHDRAWN (the identical ring, lit) is asserted non-empty in B1, so this filter demonstrably finds obituaries when they exist.
    expect(WITHDRAWN_DARK).toEqual([]);
  });

  it('B6 · registration totality, both directions, from the kind the fixture ACTUALLY produced', () => {
    // The denominator is the beat the engine minted, not a literal typed here: a rename that
    // moved the token would fail at the join rather than pass against a stale constant.
    const kind = WITHDRAWN[0].impactKind;
    expect(kind).toBe(FAITH_KINDS[0]);
    const row = FAITH_KIND_REGISTRY.find((r) => r.kind === kind);
    expect(row).toBeTruthy();
    expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[row.significance]);
    expect(row.requiredSlots).toHaveLength(row.pool.length);
    // All three registration homes carry it, and it is EXPLICITLY routed rather than riding the
    // `faith_` family prefix — the check that separates a filed kind from an unfiled one.
    expect(SECTION_OF(kind)).toBe('faith');
    expect(isExplicitlyRouted(kind)).toBe(true);
    expect(KIND_SECTION[kind]).toBe('traditions');
    expect(typeof WHAT_PHRASES[kind]).toBe('string');
    // The other direction: the registry's declared desk is the desk the router actually answers.
    expect(row.section).toBe(SECTION_OF(kind));
  });

  it('B7 · the surfaced entry is a RECORD, address-complete and game-grade, on the applied path', () => {
    const entry = WITHDRAWN[0];
    // It is a record, never a proposal — asserted on the entry the REAL pulse put in the feed.
    expect(entry.kind).toBe('applied');
    // Severity 0.5 sits below newsEntryForOutcome's 0.72 major line, so a town losing one creed
    // is a notable RECORD rather than a realm alarm; the scope is the settlement's own.
    expect(entry.significance).toBe('notable');
    expect(entry.scope).toBe('settlement');
    expect(entry.severity).toBe(0.5);
    // THE ADDRESS CHAIN (news address law): a typed action, the place by id, the source event
    // that encodes both settlement and creed, and a reason that names the parties.
    expect(entry.impactKind).toBe(OBITUARY);
    expect(entry.settlementIds).toEqual(['z']);
    expect(entry.sourceEventId).toContain('faith.last_altar_dark.z.');
    expect(entry.reasons.length).toBeGreaterThanOrEqual(1);
    expect(entry.reasons[0]).toContain('Zed');
    // GAME-GRADE: no numerals, no engine slug, no template residue on composed reader output.
    // anchored: the headline and reason are asserted non-empty and party-naming above, so these are scans over real rendered prose.
    expect(`${entry.headline} ${entry.summary} ${entry.reasons.join(' ')}`).not.toMatch(/\d|custom:|_deityRef|\$\{|undefined/);
    // And curation admits it rather than suppressing it as drift.
    const outcome = drive(ring(8, 'village', { faithUnseatingEnabled: true }), 1).outcomes;
    expect(Array.isArray(outcome)).toBe(true);
    expect(isDriftOnlyOutcome({ curationClass: 'transition' })).toBe(false);
    expect(newsEntryForOutcome({ id: 'x', candidateType: OBITUARY, severity: 0.5, affectedSettlementIds: ['z'] }, 3, 'applied').kind).toBe('applied');
  });

  it('B8 · the pick is deterministic on its key and the pool genuinely spreads', () => {
    const kind = FAITH_KINDS[0];
    const interp = { creed: 'the Lady of Harvests', settlement: 'Bramwell' };
    // Same key, same sentence — forever (THE PROMISE), on the registry's own picker.
    expect(faithLine(kind, `${kind}::z::custom:lu_alder`, interp))
      .toEqual(faithLine(kind, `${kind}::z::custom:lu_alder`, interp));
    // …and DIFFERENT (cid, ref) keys really do reach different variants, or the determinism above
    // would be the determinism of a picker that answers one sentence to everything. The witness
    // keys are the fixture's OWN creeds rather than authored strings.
    const reached = new Set(WITHDRAWN.map((e) => faithLine(kind, `${kind}::z::custom:lu_${creedOf(e)}`, interp).templateIndex));
    expect(reached.size).toBeGreaterThanOrEqual(2);
    // The engine's own beats show the spread too: the fixture's obituaries are not all one line.
    expect(new Set(WITHDRAWN.map((e) => e.headline)).size).toBeGreaterThanOrEqual(2);
  });
});
