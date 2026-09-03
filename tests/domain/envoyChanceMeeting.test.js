/**
 * tests/domain/envoyChanceMeeting.test.js — ENC-1's proof, and the leaf's only driver.
 *
 * ⭐ IT IS LIT-ELIGIBLE ON PURPOSE. `mechanismLitCoverage.test.js` computes AUTO mechanism
 * credit only over test files whose names do NOT match `/(dormanc|byteidentity)/i`, so the
 * dormancy fence ENC-3 will write can credit the FLAG and never the MECHANISM. Every flat
 * `worldPulse/*.js` leaf therefore needs a lit-eligible direct importer of its own, and
 * this file is the leaf's.
 *
 * ⭐ EVERY ABSENCE HERE IS ANCHORED ON A PRESENCE. The negative arms are written as
 * exact-set equalities or as `toBe(false)` over a subject the same arm proves non-empty,
 * so a fixture that silently emptied reds instead of passing having proved nothing.
 */
import { describe, expect, test } from 'vitest';
import {
  MEETING_KINDS,
  MEETING_VENUES,
  MEETING_OUTCOMES,
  MEETING_MARK_KINDS,
  MEETING_DRIFT_BANDS,
  MEETING_REFUSALS,
  MEETING_ARMS,
  DISTANCE_BANDS,
  POSTURE_BANDS,
  LEAN_BANDS,
  APPROACH_WORDS,
  EIGHTHS,
  CHANCE_MEETING_TUNING,
  CHANCE_MEETING_TUNING_PROVENANCE,
  meetingRollKey,
  residentMeetingKey,
  pairMeetingKey,
  legacyCoreAxes,
  axisRungs,
  planeFromAxes,
  planeFromChart,
  pairDistance,
  personCourtRung,
  censusChanceMeetingCandidates,
  selectChanceMeetings,
  resolveChanceMeeting,
} from '../../src/domain/worldPulse/envoyChanceMeeting.js';
import { npcTraitPlane } from '../../src/domain/worldPulse/clergyTraitPlane.js';
import { TRAIT_COLUMNS } from '../../src/domain/npc/paradigmAxisCatalog.js';
// ⭐ THE SPECTRUM READ IS IMPORTED HERE AND NOWHERE IN THE LEAF. `infiltrationDrift`'s
// shape exactly: the src leaf holds no opinion about the drift machinery and takes L2's
// read as an argument, while its DRIVER imports the live function — so a moved or
// re-shaped `positionValue` reds these arms instead of drifting apart from them.
import { positionValue } from '../../src/domain/npc/characterDrift.js';

const COURTS = {
  S1: { lawfulness01: 0.5, malice01: 0.5 },
  S2: { lawfulness01: 0.2, malice01: 0.8 },
  S3: { lawfulness01: 0.9, malice01: 0.1 },
};

/** @param {string} nid @param {string} homeSid @param {string[]} words @param {object} [extra] */
function person(nid, homeSid, words, extra = {}) {
  return {
    nid, homeSid, words, clean: true, corruptible: true, hasRecord: true, covert: false, ...extra,
  };
}

/** @param {object} [over] */
function meeting(over = {}) {
  return resolveChanceMeeting({
    meetingKey: 'stop-1',
    kind: 'traveller_resident',
    venue: 'host_settlement',
    nodeId: 'S2',
    tick: 10,
    seed: 'seed-a',
    a: person('n1', 'S1', ['brave', 'cautious', 'ambitious']),
    b: person('n2', 'S2', ['compassionate', 'cautious', 'stern']),
    courts: COURTS,
    posture: 'neutral',
    wariness: 0,
    positionValue,
    ...over,
  });
}

/** @param {string} errandId @param {object} [over] */
function traveller(errandId, over = {}) {
  return {
    errandId,
    nid: `w-${errandId}`,
    homeSid: 'S1',
    nodeId: 'S2',
    nodeKind: 'settlement',
    journey: 'outbound',
    band: 'arrived',
    arrivalTick: 10,
    covert: false,
    ...over,
  };
}

describe('ENC-1 — the chance-meeting leaf: the vocabularies', () => {
  test('every closed vocabulary is frozen, non-empty and duplicate-free', () => {
    const families = {
      MEETING_KINDS, MEETING_VENUES, MEETING_OUTCOMES, MEETING_MARK_KINDS,
      MEETING_DRIFT_BANDS, MEETING_REFUSALS, MEETING_ARMS, DISTANCE_BANDS,
      POSTURE_BANDS, LEAN_BANDS, APPROACH_WORDS,
    };
    for (const [name, family] of Object.entries(families)) {
      expect(Object.isFrozen(family), `${name} is not frozen`).toBe(true);
      expect(family.length, `${name} is empty`).toBeGreaterThan(0);
      expect(new Set(family).size, `${name} repeats a word`).toBe(family.length);
      for (const word of family) expect(typeof word).toBe('string');
    }
  });

  test('the venue words are a SUBSET of the errand family\'s, taken by value and not by import', () => {
    // The parity that matters is that a meeting never names a venue the errand family
    // cannot spell. It is asserted against the literal pair rather than the import,
    // because importing either twin home would put this leaf inside a pin it must not move.
    expect([...MEETING_VENUES].sort()).toEqual(['field_node', 'host_settlement']);
  });

  test('the six arms are exactly the arms the leaf can draw, and every one reaches a receipt', () => {
    expect([...MEETING_ARMS]).toEqual(['meet', 'pick', 'approach', 'mark', 'compromise', 'exposure']);
    const drawn = new Set();
    // Five arms are drawn by the resolution ...
    for (let i = 0; i < 400; i += 1) {
      const r = meeting({ meetingKey: `k-${i}`, posture: 'hostile', wariness: 2 });
      for (const arm of Object.keys(r.rolls)) drawn.add(arm);
    }
    // ... and the sixth, the PICK, is drawn one layer up by the census that chose which
    // resident is standing there. It reaches the receipt through the candidate, because an
    // arm no receipt records is an arm no fence can ever see.
    const candidate = censusChanceMeetingCandidates({
      travellers: [traveller('e1')],
      residentsAt: { S2: [{ residentNid: 'r1', index: 0, npc: null }, { residentNid: 'r2', index: 1, npc: null }] },
      tick: 10,
      seed: 'seed-a',
    })[0];
    expect(Number.isInteger(candidate.pickRoll)).toBe(true);
    for (const arm of Object.keys(meeting({ pickRoll: candidate.pickRoll }).rolls)) drawn.add(arm);
    expect([...drawn].sort()).toEqual([...MEETING_ARMS].sort());
  });

  test('every outcome word the leaf can emit is a MEETING_OUTCOMES member, and the set is reachable', () => {
    const seen = new Set();
    for (let i = 0; i < 2000; i += 1) seen.add(meeting({ meetingKey: `k-${i}` }).outcome);
    for (const word of seen) expect(MEETING_OUTCOMES).toContain(word);
    expect(seen.size, 'the fixture reached only one outcome, so the membership arm proved nothing')
      .toBeGreaterThan(4);
  });
});

describe('ENC-1 — the tuning register is a DRAFT and this lane signs nothing', () => {
  test('the provenance is unsigned and the table is frozen', () => {
    expect(CHANCE_MEETING_TUNING_PROVENANCE.signedBy).toBe(null);
    expect(CHANCE_MEETING_TUNING_PROVENANCE.status).toContain('OWNER-UNSIGNED');
    expect(CHANCE_MEETING_TUNING_PROVENANCE.ownerRows.length).toBeGreaterThan(5);
    expect(Object.isFrozen(CHANCE_MEETING_TUNING)).toBe(true);
  });

  test('every rung in the register is an integer of the die, and the die is eight', () => {
    expect(EIGHTHS).toBe(8);
    const t = CHANCE_MEETING_TUNING;
    const rungs = [
      t.baseRung.traveller_resident.host_settlement,
      t.baseRung.traveller_traveller.host_settlement,
      t.baseRung.traveller_traveller.field_node,
      t.approachBaseRung, t.compromiseFloor, t.compromiseCapCorruptible,
      t.compromiseCapPlain, t.compromiseFastPath, t.nothingFloor,
      t.exposureBaseRung, t.exposureWarinessCap,
    ];
    for (const rung of rungs) {
      expect(Number.isInteger(rung)).toBe(true);
      expect(rung).toBeGreaterThanOrEqual(0);
      expect(rung).toBeLessThanOrEqual(EIGHTHS);
    }
    // The fast path is near-certain and never certain: the die always keeps one face for
    // the man who surprises everyone.
    expect(t.compromiseFastPath).toBe(EIGHTHS - 1);
  });
});

describe('ENC-1 — the charts', () => {
  test('THE CONTROL: the leaf\'s plane projection reproduces npcTraitPlane on an undrifted chart', () => {
    // The leaf reads the word plane through the catalog's own columns rather than through
    // clergyTraitPlane, so that it mints no cross-layer coupling pair. This arm is what
    // makes that substitution a measurement instead of a hope.
    // Over EVERY legacy word that carries a plane, not a hand-picked four: a control that
    // chose its own subjects would prove only that four words happen to agree.
    let matched = 0;
    /** @type {string[]} */
    const divergent = [];
    for (const [word, columns] of Object.entries(TRAIT_COLUMNS)) {
      if (!columns.plane) continue;
      matched += 1;
      const mine = planeFromChart(legacyCoreAxes([word]), [word]);
      const theirs = npcTraitPlane({ personality: { dominant: word } }, null);
      if (Math.abs(mine.e - theirs.e) > 1e-12 || Math.abs(mine.c - theirs.c) > 1e-12) divergent.push(word);
    }
    expect(matched, 'no word carried a plane, so the control compared nothing')
      .toBeGreaterThan(40);
    expect(divergent, 'the leaf projection diverged from the estate\'s own true plane').toEqual([]);
    // ⚠ AND THE AXIS-ONLY HALF IS NOT THE WHOLE CHART, which is why planeFromChart exists:
    // `ambitious` carries a real plane lean and lives in no axis at all, so an axis-only
    // projection reads a schemer as plane-neutral.
    expect(planeFromAxes(legacyCoreAxes(['ambitious']))).toEqual({ e: 0, c: 0 });
    expect(planeFromChart(legacyCoreAxes(['ambitious']), ['ambitious']).e).toBeGreaterThan(0);
  });

  test('axis positions are integer rungs and the distance bands are the closed three', () => {
    const axes = legacyCoreAxes(['brave', 'callous', 'compassionate']);
    for (const value of Object.values(axisRungs(axes, positionValue))) {
      expect(Number.isInteger(value)).toBe(true);
      expect(Math.abs(value)).toBeLessThanOrEqual(3);
    }
    const near = pairDistance(legacyCoreAxes(['callous']), legacyCoreAxes(['callous']), positionValue);
    const far = pairDistance(legacyCoreAxes(['callous']), legacyCoreAxes(['compassionate']), positionValue);
    expect(near.rungs).toBe(0);
    expect(near.band).toBe('alike');
    expect(DISTANCE_BANDS).toContain(far.band);
    expect(far.rungs).toBeGreaterThan(near.rungs);
  });

  test('a person-to-court rung is an integer 0..8, and a court with no signal reads low', () => {
    const flat = personCourtRung({ e: 0, c: 0 }, { lawfulness01: 0.5, malice01: 0.5 });
    expect(flat).toBe(0);
    for (const e of [-1, -0.5, 0, 0.5, 1]) {
      for (const court of Object.values(COURTS)) {
        const rung = personCourtRung({ e, c: -e }, court);
        expect(Number.isInteger(rung)).toBe(true);
        expect(rung).toBeGreaterThanOrEqual(0);
        expect(rung).toBeLessThanOrEqual(EIGHTHS);
      }
    }
    // A good man in an evil, lawless town reads FAR from it; the same man at home reads 0.
    expect(personCourtRung({ e: -1, c: -1 }, COURTS.S2)).toBeGreaterThan(0);
  });
});

describe('ENC-1 — the key law and determinism', () => {
  test('every arm draws from one key shape, and the seed is inside it', () => {
    for (const arm of MEETING_ARMS) {
      expect(meetingRollKey('sd', 'mk', arm)).toBe(`sd|chance-meeting:mk:${arm}`);
    }
    expect(meetingRollKey('one', 'mk', 'meet')).not.toBe(meetingRollKey('two', 'mk', 'meet'));
  });

  test('the same inputs resolve identically, and a different seed moves the world', () => {
    const first = meeting();
    const second = meeting();
    expect(second).toEqual(first);
    let moved = 0;
    for (let i = 0; i < 200; i += 1) {
      const x = meeting({ meetingKey: `k-${i}`, seed: 'seed-a' });
      const y = meeting({ meetingKey: `k-${i}`, seed: 'seed-b' });
      if (x.outcome !== y.outcome || x.rolls.meet !== y.rolls.meet) moved += 1;
    }
    expect(moved, 'two seeds produced an identical world: the seed is not in the key')
      .toBeGreaterThan(20);
  });

  test('P7 GUARD — the resident PICK is seeded, so two seeds pick differently somewhere', () => {
    const residents = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].map((residentNid, index) => ({
      residentNid, index, npc: null,
    }));
    const args = (seed) => ({
      travellers: [traveller('e1'), traveller('e2', { nid: 'w-e2', journey: 'return' })],
      residentsAt: { S2: residents },
      tick: 10,
      seed,
    });
    const pickedWith = (seed) => censusChanceMeetingCandidates(args(seed))
      .filter((c) => c.kind === 'traveller_resident')
      .map((c) => c.parties[1].nid)
      .join(',');
    const one = pickedWith('seed-a');
    const two = pickedWith('seed-zzz');
    expect(one.length, 'the census produced no resident candidate, so the arm proved nothing')
      .toBeGreaterThan(0);
    expect(two).not.toBe(one);
  });

  test('P1 GUARD — the CENSUS itself is a function of its inputs, drawn from no ambient source', () => {
    // ⚠ THIS ARM EXISTS BECAUSE THE PLANT FOUND ITS ABSENCE. A `Math.random()` planted in
    // the resident pick passed the whole suite: the resolution's determinism arm never
    // touches the census, the order arm ran with an empty roster so no pick was drawn, and
    // the two-seed arm is SATISFIED by randomness, which is the trap. Only running the same
    // census twice can convict an ambient draw.
    const args = () => ({
      travellers: [traveller('e1'), traveller('e2', { nid: 'w-e2', journey: 'return' })],
      residentsAt: { S2: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ residentNid: `r${n}`, index: n, npc: null })) },
      tick: 10,
      seed: 'seed-a',
    });
    const first = censusChanceMeetingCandidates(args());
    expect(first.filter((c) => c.kind === 'traveller_resident').length,
      'the fixture drew no pick, so this arm could not see an ambient one').toBeGreaterThan(0);
    for (let i = 0; i < 12; i += 1) {
      expect(censusChanceMeetingCandidates(args()), 'the census moved between two identical calls')
        .toEqual(first);
    }
  });

  test('the census is independent of the order it is handed its rows', () => {
    const rows = [traveller('e3'), traveller('e1'), traveller('e2', { homeSid: 'S3' })];
    const args = (travellers) => ({ travellers, residentsAt: { S2: [] }, tick: 10, seed: 'seed-a' });
    const forward = censusChanceMeetingCandidates(args(rows)).map((c) => c.id);
    const reversed = censusChanceMeetingCandidates(args([...rows].reverse())).map((c) => c.id);
    expect(forward.length).toBeGreaterThan(0);
    expect(reversed).toEqual(forward);
  });
});

describe('ENC-1 — the census, the stop law and the select', () => {
  test('THE STOP LAW: a dwelling operative at one stop yields exactly ONE candidate over six ticks', () => {
    const dwell = (tick) => censusChanceMeetingCandidates({
      // The projection puts a dwelling operative at his stop on EVERY dwell tick; his
      // arrivalTick does not move, so only the arrival tick can key a candidate.
      travellers: [traveller('e1', { covert: true })],
      residentsAt: { S2: [{ residentNid: 'r1', index: 0, npc: null }] },
      tick,
      seed: 'seed-a',
    });
    const counts = [10, 11, 12, 13, 14, 15].map((t) => dwell(t).length);
    expect(counts).toEqual([1, 0, 0, 0, 0, 0]);
  });

  test('a traveller standing at his own home is not a traveller, and a passing one is not standing', () => {
    const args = (over) => ({
      travellers: [traveller('e1', over)],
      residentsAt: { S2: [{ residentNid: 'r1', index: 0, npc: null }] },
      tick: 10,
      seed: 'seed-a',
    });
    expect(censusChanceMeetingCandidates(args({})).length).toBe(1);
    expect(censusChanceMeetingCandidates(args({ homeSid: 'S2' })).length).toBe(0);
    expect(censusChanceMeetingCandidates(args({ band: 'underway' })).length).toBe(0);
    expect(censusChanceMeetingCandidates(args({ nodeKind: 'route_node' })).length).toBe(0);
  });

  test('one candidate per traveller per node, and the resident pick is exactly one person', () => {
    const candidates = censusChanceMeetingCandidates({
      travellers: [traveller('e1')],
      residentsAt: { S2: [1, 2, 3, 4, 5].map((n) => ({ residentNid: `r${n}`, index: n, npc: null })) },
      tick: 10,
      seed: 'seed-a',
    });
    expect(candidates.length).toBe(1);
    expect(candidates[0].parties.length).toBe(2);
    expect(candidates[0].kind).toBe('traveller_resident');
  });

  test('two countrymen at a third place never meet; two foreigners do', () => {
    const both = (homeB) => censusChanceMeetingCandidates({
      travellers: [traveller('e1'), traveller('e2', { nid: 'w-e2', homeSid: homeB })],
      residentsAt: { S2: [] },
      tick: 10,
      seed: 'seed-a',
    }).filter((c) => c.kind === 'traveller_traveller');
    expect(both('S1').length, 'countrymen met').toBe(0);
    expect(both('S3').length, 'two foreign courts failed to meet').toBe(1);
  });

  test('THE SELECT takes at most one meeting per PERSON, and prefers the rarer pair event', () => {
    const selected = selectChanceMeetings({
      travellers: [
        traveller('e1'),
        traveller('e2', { nid: 'w-e2', homeSid: 'S3' }),
        traveller('e3', { nid: 'w-e3', homeSid: 'S1' }),
      ],
      residentsAt: { S2: [{ residentNid: 'r1', index: 0, npc: null }] },
      tick: 10,
      seed: 'seed-a',
    });
    const keys = selected.flatMap((c) => c.parties.map((p) => `${p.homeSid}|${p.nid}`));
    expect(new Set(keys).size, 'a person met twice in one tick').toBe(keys.length);
    expect(selected[0].kind).toBe('traveller_traveller');
  });
});

describe('ENC-1 — the resolution', () => {
  test('a receipt carries words and integers only: no float reaches one', () => {
    /** @param {unknown} value @param {string} path @param {string[]} out */
    const floats = (value, path, out) => {
      if (typeof value === 'number' && !Number.isInteger(value)) out.push(path);
      else if (Array.isArray(value)) value.forEach((v, i) => floats(v, `${path}[${i}]`, out));
      else if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) floats(v, `${path}.${k}`, out);
      }
      return out;
    };
    let receipts = 0;
    /** @type {string[]} */
    const offenders = [];
    for (let i = 0; i < 1500; i += 1) {
      const r = meeting({ meetingKey: `k-${i}`, posture: i % 3 === 0 ? 'hostile' : 'friendly', wariness: i % 3 });
      receipts += 1;
      floats(r, 'receipt', offenders);
    }
    expect(receipts).toBe(1500);
    expect(offenders).toEqual([]);
  });

  test('the mark severity is the WORD half, never the ladder\'s number', () => {
    let marks = 0;
    for (let i = 0; i < 1500; i += 1) {
      const r = meeting({ meetingKey: `k-${i}` });
      if (!r.mark) continue;
      marks += 1;
      expect(r.mark.sev).toBe('half');
      expect(MEETING_MARK_KINDS).toContain(r.mark.kind);
    }
    expect(marks, 'no mark was minted, so the arm proved nothing').toBeGreaterThan(50);
  });

  test('THE NOTHING FLOOR: no band and no posture lets the mark ladder claim more than six faces', () => {
    // ⭐ EXACT, NOT STATISTICAL. The claim is about the LADDER, so it is measured as the set
    // of mark-die FACES that produce a mark, per band and per posture. A frequency arm over
    // the same fixture would pass or fail on sampling noise and would prove nothing about
    // the law it is named for.
    const pairs = {
      alike: [['callous', 'cautious'], ['callous', 'cautious']],
      differing: [['brave', 'cautious', 'ambitious'], ['compassionate', 'cautious', 'stern']],
      opposed: [['callous', 'cruel', 'greedy'], ['compassionate', 'humble', 'generous']],
    };
    const room = EIGHTHS - CHANCE_MEETING_TUNING.nothingFloor;
    let measured = 0;
    for (const [band, [wordsA, wordsB]] of Object.entries(pairs)) {
      for (const posture of POSTURE_BANDS) {
        /** @type {Map<number, string>} */
        const byFace = new Map();
        let sawBand = false;
        for (let i = 0; i < 3000; i += 1) {
          const r = meeting({
            meetingKey: `f-${band}-${posture}-${i}`,
            posture,
            a: person('n1', 'S1', wordsA, { corruptible: false }),
            b: person('n2', 'S2', wordsB, { corruptible: false }),
          });
          if (r.distance.band !== band) continue;
          sawBand = true;
          if (r.rolls.mark === undefined) continue;
          byFace.set(r.rolls.mark, r.outcome);
        }
        expect(sawBand, `the fixture never produced band ${band}`).toBe(true);
        const marking = [...byFace.values()].filter((o) => o !== 'nothing' && o !== 'rejected');
        expect(byFace.size, `${band}/${posture} reached too few faces to judge`).toBeGreaterThan(5);
        expect(
          marking.length,
          `${band}/${posture}: the mark ladder claimed ${marking.length} of eight faces`,
        ).toBeLessThanOrEqual(room);
        measured += 1;
      }
    }
    expect(measured, 'no band and posture pair was measured').toBe(9);
  });

  test('the approach die gates the offer: an attempt is rarer than a meeting', () => {
    let met = 0;
    let made = 0;
    for (let i = 0; i < 4000; i += 1) {
      const r = meeting({ meetingKey: `a-${i}` });
      if (r.reason === 'no_meeting') continue;
      met += 1;
      expect(APPROACH_WORDS).toContain(r.approach);
      if (r.approach === 'made') made += 1;
    }
    expect(made).toBeGreaterThan(0);
    // The whole point of the fold's approach die: an offer is NOT the median meeting.
    expect(made / met).toBeLessThan(0.5);
  });

  test('a compromise is a LEAN and never a defection: it moves nobody and concludes nobody', () => {
    let compromises = 0;
    for (let i = 0; i < 4000; i += 1) {
      const r = meeting({ meetingKey: `c-${i}` });
      if (r.outcome !== 'compromised') continue;
      compromises += 1;
      expect(LEAN_BANDS).toContain(r.lean.band);
      expect(r.lean.band).toBe('leaning');
      expect(r.lean.patronSid.length).toBeGreaterThan(0);
      expect(r.lean.targetNid.length).toBeGreaterThan(0);
      // The person plane records the tie; nothing about the man's place changes.
      expect(r.mark.kind).toBe('loyalty');
      expect(Object.keys(r).sort()).toEqual([
        'approach', 'distance', 'drift', 'grievance', 'id', 'kind', 'lean', 'mark',
        'nodeId', 'outcome', 'parties', 'posture', 'refusals', 'rolls', 'tick', 'venue',
      ]);
    }
    expect(compromises, 'no compromise was reached, so the arm proved nothing').toBeGreaterThan(20);
  });

  test('a REFUSED offer keeps its own word and is not overwritten by the mark arm', () => {
    let rejected = 0;
    let rejectedWithMark = 0;
    for (let i = 0; i < 4000; i += 1) {
      const r = meeting({ meetingKey: `r-${i}` });
      if (r.outcome !== 'rejected') continue;
      rejected += 1;
      if (r.mark) rejectedWithMark += 1;
    }
    expect(rejected, 'no offer was refused, so the arm proved nothing').toBeGreaterThan(20);
    expect(rejectedWithMark, 'a refusal never also left a mark, so the two facts were never both carried')
      .toBeGreaterThan(0);
  });

  test('an exposed approach carries its grievance with both courts named, and wariness is load-bearing', () => {
    const run = (wariness) => {
      let exposed = 0;
      for (let i = 0; i < 8000; i += 1) {
        const r = meeting({ meetingKey: `x-${i}`, posture: 'hostile', wariness });
        if (r.outcome !== 'exposed') continue;
        exposed += 1;
        expect(r.grievance.incidentType).toBe('approach_exposed');
        expect(r.grievance.fromSid).not.toBe(r.grievance.toSid);
        expect(r.mark).toBe(null);
      }
      return exposed;
    };
    const calm = run(0);
    const watchful = run(2);
    expect(calm, 'nothing was exposed at all, so the arm proved nothing').toBeGreaterThan(0);
    // The host court's OWN wariness read is what sharpens exposure, so a watchful court
    // must find out more often than a calm one over the same eight thousand stops.
    expect(watchful).toBeGreaterThan(calm);
  });

  test('a target with no home record is refused rather than silently dropped', () => {
    const r = meeting({
      meetingKey: 'no-home',
      a: person('n1', 'S1', ['brave', 'cautious', 'ambitious'], { hasRecord: false }),
      b: person('n2', 'S2', ['compassionate', 'cautious', 'stern'], { hasRecord: false }),
    });
    const words = r.refusals.map((x) => x.word);
    expect(words.length, 'the refusal list is empty, so the membership arm proved nothing')
      .toBeGreaterThan(0);
    for (const word of words) expect(MEETING_REFUSALS).toContain(word);
    expect(words).toContain('no_home_record');
    expect(r.mark).toBe(null);
  });

  test('drift runs on every meeting that happened, in bands and never in floats', () => {
    let withDrift = 0;
    for (let i = 0; i < 1000; i += 1) {
      const r = meeting({ meetingKey: `d-${i}` });
      if (r.reason === 'no_meeting') {
        expect(r.drift).toEqual([]);
        continue;
      }
      if (r.drift.length > 0) withDrift += 1;
      const perSubject = {};
      for (const pull of r.drift) {
        expect(MEETING_DRIFT_BANDS).toContain(pull.band);
        expect(['virtue', 'vice']).toContain(pull.pole);
        perSubject[pull.subjectNid] = (perSubject[pull.subjectNid] || 0) + 1;
      }
      for (const count of Object.values(perSubject)) {
        expect(count).toBeLessThanOrEqual(CHANCE_MEETING_TUNING.driftAxisCap);
      }
    }
    expect(withDrift, 'no meeting taught anything, so the cap arm proved nothing').toBeGreaterThan(50);
  });
});

describe('ENC-1 — the sight law: choose on KNOWN, resolve on TRUE', () => {
  test('a disclosed chart moves the DECISION and leaves the subject\'s own drift origin alone', () => {
    const words = ['brave', 'cautious', 'ambitious'];
    const bare = person('n1', 'S1', words);
    const disclosed = person('n1', 'S1', words, {
      // The same man, seen differently: his words (his TRUE chart) do not move.
      // ⚠ THE AXES, NOT THE READING. The caller holds the KnownReading and hands down what
      // it disclosed; the leaf never names the authored-core key, whose readers in src are
      // enumerated by file AND by count in tests/domain/npc/characterDrift.test.js.
      knownAxes: { MERCY: { pole: 'vice', level: 'defining', word: 'callous' } },
    });
    const other = person('n2', 'S2', ['compassionate', 'cautious', 'stern']);
    const run = (a) => resolveChanceMeeting({
      meetingKey: 'sight', kind: 'traveller_resident', venue: 'host_settlement',
      nodeId: 'S2', tick: 10, seed: 'seed-a', a, b: other, courts: COURTS,
      posture: 'neutral', wariness: 0, positionValue,
    });
    const plain = run(bare);
    const seen = run(disclosed);

    // THE DECISION MOVES: the pair distance is read on the KNOWN charts.
    expect(seen.distance.rungs).not.toBe(plain.distance.rungs);

    // THE RESOLUTION DOES NOT: this subject's own drift origin is his TRUE chart, so the
    // axes HE is pulled on are unchanged by what the other man came to believe about him.
    const mine = (r) => r.drift.filter((p) => p.subjectNid === 'n1').map((p) => `${p.axisId}:${p.pole}:${p.band}`);
    expect(mine(seen)).toEqual(mine(plain));

    // ...and the COUNTERPART is pulled toward what he perceived, which did move.
    const theirs = (r) => r.drift.filter((p) => p.subjectNid === 'n2').map((p) => `${p.axisId}:${p.pole}:${p.band}`);
    expect(theirs(plain).length).toBeGreaterThan(0);
    expect(theirs(seen)).not.toEqual(theirs(plain));
  });

  test('an undisclosed chart reads at the authored core, which is the sight law itself', () => {
    const words = ['brave', 'cautious', 'ambitious'];
    const bare = resolveChanceMeeting({
      meetingKey: 'core', kind: 'traveller_resident', venue: 'host_settlement', nodeId: 'S2',
      tick: 10, seed: 'seed-a', a: person('n1', 'S1', words),
      b: person('n2', 'S2', ['compassionate']), courts: COURTS, posture: 'neutral', wariness: 0,
      positionValue,
    });
    expect(bare.distance.rungs)
      .toBe(pairDistance(legacyCoreAxes(words), legacyCoreAxes(['compassionate']), positionValue).rungs);
  });
});

describe('ENC-1 — total on garbage', () => {
  test('the census and the resolution survive nonsense without throwing', () => {
    expect(censusChanceMeetingCandidates()).toEqual([]);
    expect(censusChanceMeetingCandidates({ travellers: 'nope', tick: 'soon' })).toEqual([]);
    expect(censusChanceMeetingCandidates({ travellers: [null, 7, {}], residentsAt: 3, tick: 1 })).toEqual([]);
    expect(selectChanceMeetings({ travellers: null, tick: null })).toEqual([]);
    const junk = resolveChanceMeeting();
    expect(junk.outcome).toBe('nothing');
    expect(MEETING_KINDS).toContain(junk.kind);
    expect(MEETING_VENUES).toContain(junk.venue);
    const junk2 = resolveChanceMeeting({ meetingKey: 5, a: 'x', b: [], courts: 'no', posture: 'sideways' });
    expect(junk2.posture).toBe('neutral');
    expect(junk2.drift).toEqual([]);
  });

  test('the meeting keys are stable and order-free for a pair', () => {
    const a = { errandId: 'e1', journey: 'outbound' };
    const b = { errandId: 'e2', journey: 'return' };
    expect(pairMeetingKey({ a, b, nodeId: 'S2' })).toBe(pairMeetingKey({ a: b, b: a, nodeId: 'S2' }));
    expect(residentMeetingKey({ errandId: 'e1', journey: 'outbound', nodeId: 'S2' }))
      .toBe(residentMeetingKey({ errandId: 'e1', journey: 'outbound', nodeId: 'S2' }));
    expect(residentMeetingKey({ errandId: 'e1', journey: 'return', nodeId: 'S2' }))
      .not.toBe(residentMeetingKey({ errandId: 'e1', journey: 'outbound', nodeId: 'S2' }));
  });
});
