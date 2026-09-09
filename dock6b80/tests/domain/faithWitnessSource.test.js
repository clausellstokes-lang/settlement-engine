/**
 * faithWitnessSource.test.js — W-FAITH F3c act 2b: the faith pull as a witness-plane
 * source, the amended-F9 cadence law it satisfies by arithmetic, and the RECONCILE
 * PINS that keep its mirrors from outliving their source.
 *
 * ⛔ THE FUNNEL IS NOT IN THIS TREE. `livedExperienceCatalog.js` lives on W-LIVES's
 * stack, so every shared vocabulary here is a mirror. The reconcile pins below
 * assert the sibling's ABSENCE POSITIVELY — never by skipping — with a live anchor
 * proving the path is right, so each one FLIPS to a live equality the moment the two
 * cars share a tree (§863's consist). That idiom is L2's and is copied deliberately.
 */
import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEITY_CHART_AXIS_IDS } from '../../src/domain/customContentSchema.js';
import { PARADIGM_AXES, AXIS_LEVELS } from '../../src/domain/npc/paradigmAxisCatalog.js';
// ⭐⭐ THE RECONCILE PINS BELOW ARE NOW LIVE IMPORTS, AND THAT IS THE FLIP THIS FILE
// WAS BUILT TO MAKE. `faithWitnessSource.js`'s header promised that "every vocabulary
// it shares with the funnel is MIRRORED under a reconcile pin that flips to a live
// equality the moment the two cars share a tree". They share a tree. A pin that
// regex-scraped the other stack's SOURCE TEXT could pass on a comment; these read the
// values the funnel will actually use.
import {
  AMBIENT_EXPERIENCE_KINDS,
  EXPERIENCE_TABLE,
  LIVED_EXPERIENCE_KINDS,
  RECEIPTED_EXPERIENCE_KINDS,
  PULL_BANDS as FUNNEL_PULL_BANDS,
} from '../../src/domain/npc/livedExperienceCatalog.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';
import {
  FAITH_WITNESS_KIND,
  FAITH_WITNESS_PLANE,
  FAITH_WITNESS_FAMILY,
  FAITH_WITNESS_TUNING,
  AMBIENT_CADENCE_TICKS,
  PULL_BANDS,
  exposureDemotion,
  faithWitnessEntries,
} from '../../src/domain/worldPulse/faithWitnessSource.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const L2_CATALOG = join(REPO_ROOT, 'src/domain/npc/livedExperienceCatalog.js');

/** A pantheon member as `religionState` writes one. */
function member({ ref = 'd.one', rank = 'major', share = 100, standing = 'ascendant', suppressed = false, axes } = {}) {
  return {
    deityRef: ref,
    snapshot: { name: ref, rankAxis: rank, ...(axes === undefined ? {} : { characterAxes: axes }) },
    share,
    standing,
    suppressed,
  };
}

function state(members, patronRef) {
  /** @type {Record<string, any>} */
  const deities = {};
  for (const m of members) deities[m.deityRef] = m;
  return { deities, patronRef: patronRef === undefined ? members[0]?.deityRef ?? null : patronRef };
}

const SETTLEMENT = Object.freeze({ id: 's.town', config: {} });
/** The save's seed, supplied BY THE CALLER — a settlement carries none (see the adapter). */
const SEED = 'seed-town';
const NPC = Object.freeze({ id: 'npc_1', name: 'Ada', role: 'priestess' });

/** One season of dwell — the smallest span this source may emit. */
const ONE_SEASON = 13;

function emit(religionState, { dweltTicks = ONE_SEASON, settlement = SETTLEMENT } = {}) {
  return faithWitnessEntries({ settlement, religionState, npc: NPC, dweltTicks, eventId: 'ev.1', settlementSeed: SEED });
}

describe('RECONCILE PINS — a mirror cannot outlive its source silently', () => {
  test('PULL_BANDS must equal the funnel catalog\'s the moment they share a tree', () => {
    // ⭐ THE FALLBACK ARM IS GONE, AND ITS REMOVAL IS THE POINT. It existed only to
    // say something honest while the catalog was on another stack; the catalog is a
    // static import above now, so that branch is one no assertion could ever reach —
    // and this estate's own law is to RETIRE an unreachable branch rather than pin it.
    // The mirror is proven against the live value, both ways.
    expect([...PULL_BANDS]).toEqual([...FUNNEL_PULL_BANDS]);
    expect(PULL_BANDS.length).toBe(AXIS_LEVELS.length);
    // anchored: the shared value is non-trivial, so the equality above is not two
    // empty arrays agreeing.
    expect(FUNNEL_PULL_BANDS.length).toBe(3);
    // and the catalog file really is where the import says it is.
    expect(existsSync(L2_CATALOG)).toBe(true);
  });

  test('⛔ THE DEBT: this car\'s kind must be ADMITTED to the funnel\'s catalog', () => {
    // The debt's own statement, kept verbatim because it is what made it
    // unforgettable: there was no faith-exposure kind in the funnel's 31 —
    // `god_fortunes_*` are receipted but already carry L4 adapters (§856 non-overlap
    // forbids reuse) and `dwell_milieu` is roads-owned. So the kind was MINTED here
    // and OWED there. It is now ADMITTED there, and this is where that is proven.
    expect(FAITH_WITNESS_KIND).toBe('faith_milieu');
    expect(FAITH_WITNESS_PLANE).toBe('witness');
    expect(FAITH_WITNESS_FAMILY).toBe('milieu');
    // ⭐ THE FLIP, EXECUTED AT THE SUBSTRATE COUPLING. Once the trees are shared this
    // stops being a declaration and becomes a live requirement: the catalog must
    // carry the row, on the plane and family this adapter emits, marked ambient (F9
    // requires a declared span).
    //
    // ⭐⭐ AND IT IS ASKED OF THE LIVE MODULE, NOT OF ITS SOURCE TEXT. The pin was
    // written as a substring scan because it could not import a catalog that was not
    // in its tree; the catalog is here now, so the debt is discharged against the
    // VALUES the funnel will actually read. A source scan would have passed on the
    // word `faith_milieu:` appearing in a comment — which is precisely the citation
    // class this coupling spent four walkers curing.
    const row = EXPERIENCE_TABLE[FAITH_WITNESS_KIND];
    expect(
      row,
      `the funnel catalog has no '${FAITH_WITNESS_KIND}' row — this adapter's output is refused at the door until it does`,
    ).toBeTruthy();
    expect(LIVED_EXPERIENCE_KINDS).toContain(FAITH_WITNESS_KIND);
    expect(row.plane).toBe(FAITH_WITNESS_PLANE);
    expect(row.family).toBe(FAITH_WITNESS_FAMILY);
    // F9: an ambient row is what lets this adapter's integrated span be honoured.
    expect(row.ambient).toBe(true);
    expect(AMBIENT_EXPERIENCE_KINDS).toContain(FAITH_WITNESS_KIND);
    // ⭐ AND THE DEBT IS PAID IN SUBSTANCE, NOT IN LETTER: an admitted row that the
    // funnel still refuses would leave the adapter exactly as mute as before. A
    // `sourceUnverified` row is refused at the door by construction, and the funnel
    // accepts a CALLER-SUPPLIED pull vector only for an ambient kind whose tabled
    // vector is empty — which is the shape this adapter emits.
    expect(row.sourceUnverified).toBe(false);
    expect(RECEIPTED_EXPERIENCE_KINDS).toContain(FAITH_WITNESS_KIND);
    expect(row.pulls).toEqual([]);
    expect(row.receipt).toBeTruthy();
  });

  test('⭐ THE KIND IS NOT A SECOND SPELLING OF THE ROW BESIDE IT', () => {
    // `dwell_milieu` and `faith_milieu` share a plane, a family and the ambient flag
    // — deliberately, they are the same SHAPE — so the thing that must never
    // collapse is that they are two rows with two receipts. W-LIVES §3 lists them
    // separately and §6 names the faith pull explicitly.
    const faith = EXPERIENCE_TABLE[FAITH_WITNESS_KIND];
    const dwell = EXPERIENCE_TABLE.dwell_milieu;
    expect(dwell).toBeTruthy();
    expect(faith.plane).toBe(dwell.plane);
    expect(faith.family).toBe(dwell.family);
    expect(faith.receipt).not.toBe(dwell.receipt);
    expect(FAITH_WITNESS_KIND).not.toBe('dwell_milieu');
  });

  test('the cadence is IMPORTED, not mirrored — one season, from the estate\'s own table', () => {
    expect(AMBIENT_CADENCE_TICKS).toBe(INTERVAL_WEEKS.one_season);
    expect(AMBIENT_CADENCE_TICKS).toBe(13);
  });

  test('ZERO INVENTED VOCABULARY: every authorable deity axis is a real paradigm axis', () => {
    // This is what makes `characterAxes` usable as a pull source at all: the
    // authored token is already AXIS:pole:level, which maps rung-for-rung onto the
    // funnel's {axisId, pole, band} without a translation table anyone could get wrong.
    const paradigmIds = new Set(PARADIGM_AXES.map((a) => a.id));
    for (const axisId of DEITY_CHART_AXIS_IDS) {
      expect(paradigmIds.has(axisId), `${axisId} is authorable on a deity but unknown to the paradigm chart`).toBe(true);
    }
    // …and the ladders are the same depth, which is what makes the mapping rung-for-rung.
    expect(AXIS_LEVELS.length).toBe(PULL_BANDS.length);
  });
});

describe('THE CADENCE GATE — F9 as amended, satisfied by arithmetic', () => {
  const devoutPantheon = () => state([member({ axes: 'MERCY:virtue:defining' })]);

  test('under one whole season teaches NOTHING, at every sub-cadence dwell', () => {
    for (let dwelt = 0; dwelt < AMBIENT_CADENCE_TICKS; dwelt += 1) {
      expect(emit(devoutPantheon(), { dweltTicks: dwelt }), `${dwelt} ticks`).toEqual([]);
    }
  });

  test('exactly one season teaches once, with a span of exactly one cadence', () => {
    const [entry] = emit(devoutPantheon(), { dweltTicks: 13 });
    expect(entry.spanTicks).toBe(13);
  });

  test('the span is FLOOR-DIVIDED, never fractional — 25 ticks is one season, not 1.9', () => {
    expect(emit(devoutPantheon(), { dweltTicks: 25 })[0].spanTicks).toBe(13);
    expect(emit(devoutPantheon(), { dweltTicks: 26 })[0].spanTicks).toBe(26);
    expect(emit(devoutPantheon(), { dweltTicks: 51 })[0].spanTicks).toBe(39);
    expect(emit(devoutPantheon(), { dweltTicks: 52 })[0].spanTicks).toBe(52);
  });

  test('⭐ A SUB-FLOOR PULL IS NOT CONSTRUCTIBLE — every emitted span is a whole cadence ≥ 1', () => {
    // The funnel scales magnitude by spanTicks / AMBIENT_CADENCE_TICKS. Because this
    // source only ever emits whole multiples, that scale is an INTEGER ≥ 1, so the
    // smallest magnitude reachable is exactly one `faint` band — the materialization
    // floor itself, never under it. Proved over a wide sweep rather than asserted.
    for (let dwelt = 0; dwelt <= 400; dwelt += 1) {
      for (const entry of emit(devoutPantheon(), { dweltTicks: dwelt })) {
        expect(entry.spanTicks % AMBIENT_CADENCE_TICKS).toBe(0);
        expect(entry.spanTicks / AMBIENT_CADENCE_TICKS).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('a negative or non-numeric dwell is silence, not a throw', () => {
    // ⚠ CALLED DIRECTLY, NOT THROUGH `emit`, AND THAT IS LOAD-BEARING. `emit`'s
    // default parameter fires on an explicitly-passed `undefined`, so routing this
    // case through the helper would silently test a 13-tick dwell and pass while
    // asserting the opposite. Caught by this arm on its first run — the same
    // default-parameter trap `espionageDormancyFence` records against its own harness.
    for (const dwelt of [-1, -100, NaN, undefined, null, 'many', {}]) {
      expect(faithWitnessEntries({
        settlement: SETTLEMENT,
        religionState: devoutPantheon(),
        npc: NPC,
        dweltTicks: /** @type {any} */ (dwelt),
        eventId: 'ev.1',
        settlementSeed: SEED,
      }), `dwell ${String(dwelt)}`).toEqual([]);
    }
  });
});

describe('THE BAND LADDER — exposure steps DOWN from the authored level, never up', () => {
  test('exposureDemotion reads the two thresholds and nothing else', () => {
    expect(exposureDemotion(FAITH_WITNESS_TUNING.FULL_EXPOSURE)).toBe(0);
    expect(exposureDemotion(FAITH_WITNESS_TUNING.FULL_EXPOSURE + 10)).toBe(0);
    expect(exposureDemotion(FAITH_WITNESS_TUNING.PART_EXPOSURE)).toBe(1);
    expect(exposureDemotion(FAITH_WITNESS_TUNING.PART_EXPOSURE - 1e-9)).toBe(2);
    expect(exposureDemotion(0)).toBe(2);
  });

  test('a dominant patron teaches at the authored level: defining ⇒ heavy', () => {
    // patron weight = 1.0 × 0.95 × 1 × 1.6 = 1.52 ⇒ full exposure ⇒ no demotion
    const [entry] = emit(state([member({ axes: 'MERCY:virtue:defining' })]));
    expect(entry.pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'heavy' }]);
  });

  test('a partial exposure steps ONE rung down: defining ⇒ firm', () => {
    // non-patron weight = 0.6 × 0.95 × 1 = 0.57 ⇒ in [0.25, 0.6) ⇒ one rung
    const st = state([
      member({ ref: 'd.patron', share: 40, axes: undefined }),
      member({ ref: 'd.other', share: 60, axes: 'MERCY:virtue:defining' }),
    ], 'd.patron');
    const [entry] = emit(st);
    expect(entry.pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'firm' }]);
  });

  test('a fringe cult steps TWO rungs down: defining ⇒ faint', () => {
    // non-patron weight = 0.3 × 0.6 × 0.6 = 0.108 ⇒ below PART ⇒ two rungs
    const st = state([
      member({ ref: 'd.patron', share: 70, axes: undefined }),
      member({ ref: 'd.cult', share: 30, rank: 'minor', standing: 'established', axes: 'MERCY:virtue:defining' }),
    ], 'd.patron');
    const [entry] = emit(st);
    expect(entry.pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'faint' }]);
  });

  test('⭐ AT FRINGE EXPOSURE ONLY A `defining` GOD MARKS AT ALL — the floor declines, it does not round', () => {
    // The whole ladder at one exposure, stated as a table. Two rungs down silences
    // `a_touch` (rung 0 → −2) AND `marked` (rung 1 → −1) outright, and leaves only
    // `defining` (rung 2 → 0) faintly felt. §853: "a truly faint exposure honestly
    // never marks" — emitting a floor-clamped `faint` for the silent two would be
    // exactly the accumulation the amended F9 exists to forbid.
    const fringe = (level) => state([
      member({ ref: 'd.patron', share: 70, axes: undefined }),
      member({ ref: 'd.cult', share: 30, rank: 'minor', standing: 'established', axes: `MERCY:virtue:${level}` }),
    ], 'd.patron');
    expect(emit(fringe('a_touch')), 'a_touch at fringe exposure').toEqual([]);
    expect(emit(fringe('marked')), 'marked at fringe exposure').toEqual([]);
    expect(emit(fringe('defining'))[0].pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'faint' }]);
    // ⭐ AND THAT IS THE SPARSITY PROPERTY, MEASURED: of the three authorable
    // levels, a fringe cult transmits exactly ONE. Most gods most people live near
    // leave no mark, which is what makes the marks that do land mean something.
    const marking = AXIS_LEVELS.filter((level) => emit(fringe(level)).length > 0);
    expect(marking).toEqual(['defining']);
  });

  test('NO exposure however total teaches MORE than the god is authored to be', () => {
    // The ceiling property: the ladder steps down only. A dominant patron authored
    // `a_touch` teaches `faint`, never `heavy`.
    const [entry] = emit(state([member({ axes: 'MERCY:virtue:a_touch' })]));
    expect(entry.pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'faint' }]);
  });

  test('piety scales exposure — a devout city feels a cult its neighbour would not', () => {
    const st = state([
      member({ ref: 'd.patron', share: 70, axes: undefined }),
      member({ ref: 'd.cult', share: 30, rank: 'minor', standing: 'established', axes: 'MERCY:virtue:defining' }),
    ], 'd.patron');
    // exposure 0.108 ⇒ faint. Under a composite of 2.5 it becomes 0.27 ⇒ one rung ⇒ firm.
    const devout = { id: 's.devout', config: { faithProfile: { piety: { composite: 2.5 } } } };
    expect(emit(st)[0].pulls[0].band).toBe('faint');
    expect(emit(st, { settlement: devout })[0].pulls[0].band).toBe('firm');
  });
});

describe('THE POSITION READER — string or list, and closed vocabularies throughout', () => {
  test('characterAxes reads as a STRING and as a LIST (act 1 J1: the one uncoerced key)', () => {
    const asString = emit(state([member({ axes: 'MERCY:virtue:defining' })]));
    const asList = emit(state([member({ axes: ['MERCY:virtue:defining'] })]));
    expect(asList[0].pulls).toEqual(asString[0].pulls);
  });

  test('a multi-position deity teaches every axis it is authored on, in codepoint order', () => {
    const [entry] = emit(state([member({ axes: ['TRUST:vice:defining', 'MERCY:virtue:defining', 'CANDOR:virtue:marked'] })]));
    expect(entry.pulls).toEqual([
      { axisId: 'CANDOR', pole: 'virtue', band: 'firm' },
      { axisId: 'MERCY', pole: 'virtue', band: 'heavy' },
      { axisId: 'TRUST', pole: 'vice', band: 'heavy' },
    ]);
  });

  test('a malformed or out-of-vocabulary token teaches nothing, and does not poison its siblings', () => {
    const [entry] = emit(state([member({ axes: [
      'MERCY:virtue:defining',   // good
      'MERCY:virtue',            // too few parts
      'MERCY:sideways:defining', // not a pole
      'MERCY:virtue:colossal',   // not a level
      '',                        // empty
      ':virtue:defining',        // no axis
    ] })]));
    expect(entry.pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'heavy' }]);
  });

  test('a deity authoring no character axes teaches nothing', () => {
    expect(emit(state([member({ axes: undefined })]))).toEqual([]);
    expect(emit(state([member({ axes: '' })]))).toEqual([]);
    expect(emit(state([member({ axes: [] })]))).toEqual([]);
  });

  test('a SUPPRESSED deity teaches nothing, however loudly authored', () => {
    const st = state([
      member({ ref: 'd.live', share: 100, axes: 'MERCY:virtue:defining' }),
      member({ ref: 'd.dead', share: 100, suppressed: true, axes: 'TRUST:vice:defining' }),
    ], 'd.live');
    expect(emit(st).map((e) => e.eventId)).toEqual(['ev.1.d.live']);
  });
});

describe('THE ENTRY SHAPE — funnel intake, one entry per deity', () => {
  const TWO_GODS = () => state([
    member({ ref: 'd.alpha', share: 50, axes: 'MERCY:virtue:defining' }),
    member({ ref: 'd.zeta', share: 50, axes: 'TRUST:vice:defining' }),
  ], 'd.alpha');

  test('one entry per authoring deity, in codepoint order, with DISTINCT evidence ids', () => {
    const entries = emit(TWO_GODS());
    expect(entries.map((e) => e.eventId)).toEqual(['ev.1.d.alpha', 'ev.1.d.zeta']);
    // Two gods of one pantheon must not claim the same event — the funnel keys
    // receipts on this id.
    expect(new Set(entries.map((e) => e.eventId)).size).toBe(entries.length);
  });

  test('every entry declares the kind, the plane, the settlement and the soul', () => {
    for (const entry of emit(TWO_GODS())) {
      expect(entry.kind).toBe(FAITH_WITNESS_KIND);
      expect(entry.plane).toBe(FAITH_WITNESS_PLANE);
      expect(entry.settlementId).toBe('s.town');
      expect(entry.settlementSeed).toBe('seed-town');
      expect(entry.npc).toBe(NPC);
      expect(typeof entry.spanTicks).toBe('number');
      expect(entry.pulls.length).toBeGreaterThan(0);
    }
  });

  test('the field and the witness plane share NO carried quantity — the double-count is structural', () => {
    // The volume's risk #1, asserted rather than trusted: a witness entry names axis
    // pulls and no effect channel; the field names effect channels and no axis. A
    // future edit that fed the temper or a boon into a pull would red here.
    const entries = emit(state([member({
      ref: 'd.one',
      axes: 'MERCY:virtue:defining',
    })]));
    const [entry] = entries;
    const CHANNEL_WORDS = ['harvest', 'trade', 'craft', 'healing', 'sea', 'order', 'war_readiness', 'learning', 'hearth'];
    const TEMPER_WORDS = ['warlike', 'peacelike', 'neutral'];
    // ⭐ THE LIVENESS ANCHOR, added by W-FAITH F4c. Without it every assertion below
    // passes on an EMPTY `pulls` array — the collection drifting away reads exactly like
    // the words being correctly excluded, which is the vacuity the negative-assertion
    // walker exists to refuse. The sibling test above already pins this; this arm did not.
    expect(entry.pulls.length, 'no pulls to inspect — the arm below would prove nothing').toBeGreaterThan(0);
    const text = JSON.stringify(entry.pulls);
    for (const word of [...CHANNEL_WORDS, ...TEMPER_WORDS]) {
      // anchored: entry.pulls.length is pinned non-empty three lines above
      expect(text, `a witness pull carried '${word}' — that is the field's road, not this one`).not.toContain(word);
    }
  });

  test('a dead-magic world still teaches — the magic gate is the CHANNELS\', not the plane\'s', () => {
    // D3 gates boon/bane because they are mechanical, and says they survive "as
    // cultural emphasis in prose only". A god's character working on the people who
    // live among its priests IS that cultural emphasis; gating it would delete the
    // very thing D3 says survives.
    const dead = { id: 's.dead', config: { magicLevel: 'medium', magicExists: false } };
    const entries = emit(state([member({ axes: 'MERCY:virtue:defining' })]), { settlement: dead });
    expect(entries.length).toBe(1);
    expect(entries[0].pulls).toEqual([{ axisId: 'MERCY', pole: 'virtue', band: 'heavy' }]);
  });

  test('DORMANT ⇒ an empty array, on every path to absence', () => {
    for (const religionState of [null, undefined, {}, { deities: {} }]) {
      expect(emit(/** @type {any} */ (religionState), { dweltTicks: 52 })).toEqual([]);
    }
    expect(faithWitnessEntries({
      settlement: SETTLEMENT, religionState: state([member({ axes: 'MERCY:virtue:defining' })]),
      npc: null, dweltTicks: 52, eventId: 'ev.1', settlementSeed: SEED,
    })).toEqual([]);
  });

  test('the output is deterministic and frozen', () => {
    const st = TWO_GODS();
    const first = emit(st);
    for (let i = 0; i < 10; i += 1) expect(emit(st)).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first[0])).toBe(true);
    expect(Object.isFrozen(first[0].pulls)).toBe(true);
  });
});

describe('THE WRATHFUL SHARPENING (W-FAITH F5c) — the temper pull sharpens while fortunes fall', () => {
  /** A wrathful-and-cruel god, deliberately NOT the patron so the exposure sits in the
   *  one-rung-down band: weight = 0.5 × 0.95 × 1 (no patron amp) = 0.475, piety 1,
   *  and 0.25 ≤ 0.475 < 0.6 ⇒ demotion 1. Authored `marked` (rung 1) therefore
   *  teaches at rung 0 = `faint` unless the sharpening recovers the rung. */
  const WRATH = () => state([
    member({ ref: 'd.wrath', share: 50, axes: ['MERCY:vice:marked', 'TEMPER:vice:marked'] }),
  ], null);
  const FALLING = Object.freeze({ 'd.wrath': Object.freeze({ wins: 1, losses: 3 }) });

  function emitWith(religionState, pantheon) {
    return faithWitnessEntries({
      settlement: SETTLEMENT, religionState, npc: NPC, dweltTicks: ONE_SEASON,
      eventId: 'ev.1', settlementSeed: SEED, pantheon,
    });
  }

  test('no ledger, a level book, and a rising book all leave the pulls byte-identical', () => {
    const base = emitWith(WRATH(), undefined);
    // The baseline itself: both vice pulls demoted one rung to `faint`.
    expect(base.length).toBe(1);
    expect(base[0].pulls).toEqual([
      { axisId: 'MERCY', pole: 'vice', band: 'faint' },
      { axisId: 'TEMPER', pole: 'vice', band: 'faint' },
    ]);
    // Absent arg, absent entry, level fortunes, rising fortunes: all the same output.
    expect(emitWith(WRATH(), null)).toEqual(base);
    expect(emitWith(WRATH(), {})).toEqual(base);
    expect(emitWith(WRATH(), { 'd.wrath': { wins: 2, losses: 2 } })).toEqual(base);
    expect(emitWith(WRATH(), { 'd.wrath': { wins: 3, losses: 1 } })).toEqual(base);
  });

  test('⭐ falling fortunes sharpen THE TEMPER PULL ONLY — per-position attachment, in one entry', () => {
    const sharp = emitWith(WRATH(), FALLING);
    expect(sharp.length).toBe(1);
    expect(sharp[0].pulls).toEqual([
      // MERCY keeps its plain exposure demotion: `faint`. The sharpening is not a
      // property of the god; it is a property of the one vice position it attaches to.
      { axisId: 'MERCY', pole: 'vice', band: 'faint' },
      // TEMPER recovers the demoted rung: authored `marked` teaches as `firm`.
      { axisId: 'TEMPER', pole: 'vice', band: 'firm' },
    ]);
  });

  test('the sharpening reads the RIGHT deity\'s entry — a rival\'s bad book moves nothing', () => {
    const base = emitWith(WRATH(), undefined);
    expect(emitWith(WRATH(), { 'd.other': { wins: 0, losses: 9 } })).toEqual(base);
  });

  test('⭐ THE CEILING PIN: at full exposure the sharpening cannot push past the authored level', () => {
    // The patron at half the pool: 0.5 × 0.95 × 1.6 = 0.76 ≥ 0.6 ⇒ demotion 0 — the
    // pull already lands AT the authored ceiling. Falling fortunes must leave it
    // there: `defining` teaches `heavy`, and there is no rung above `heavy`.
    const st = state([
      member({ ref: 'd.wrath', share: 50, axes: ['TEMPER:vice:defining'] }),
    ]);
    const pulls = emitWith(st, FALLING)[0].pulls;
    expect(pulls).toEqual([{ axisId: 'TEMPER', pole: 'vice', band: 'heavy' }]);
  });

  test('the VIRTUE pole never sharpens — a patient god is not wrathful about losing', () => {
    const st = state([
      member({ ref: 'd.wrath', share: 50, axes: ['TEMPER:virtue:marked'] }),
    ], null);
    const pulls = emitWith(st, FALLING)[0].pulls;
    expect(pulls).toEqual([{ axisId: 'TEMPER', pole: 'virtue', band: 'faint' }]);
  });

  test('⭐ the sharpening can RECOVER a pull exposure had silenced — deliberate, and stated', () => {
    // Authored `a_touch` (rung 0) at demotion 1 lands at rung −1: below the floor,
    // so the god teaches nothing and no entry is emitted. As its fortunes fall the
    // wrathful position recovers the rung and is faintly felt — the god grows harsher
    // as its fortunes fail, still never above its authored ceiling.
    const st = () => state([
      member({ ref: 'd.wrath', share: 50, axes: ['TEMPER:vice:a_touch'] }),
    ], null);
    expect(emitWith(st(), undefined)).toEqual([]);
    const sharp = emitWith(st(), FALLING);
    expect(sharp.length).toBe(1);
    expect(sharp[0].pulls).toEqual([{ axisId: 'TEMPER', pole: 'vice', band: 'faint' }]);
  });

  test('the sharpened output is still frozen, deterministic and shape-identical', () => {
    // The funnel's intake shape is mirror-pinned against the absent W-LIVES catalog;
    // the sharpening may move a BAND VALUE only, never widen the shape.
    const first = emitWith(WRATH(), FALLING);
    for (let i = 0; i < 10; i += 1) expect(emitWith(WRATH(), FALLING)).toEqual(first);
    expect(Object.isFrozen(first[0].pulls)).toBe(true);
    expect(Object.keys(first[0].pulls[0]).sort()).toEqual(['axisId', 'band', 'pole']);
    expect(Object.keys(first[0]).sort()).toEqual(
      ['eventId', 'kind', 'npc', 'plane', 'pulls', 'settlementId', 'settlementSeed', 'spanTicks'],
    );
  });
});
