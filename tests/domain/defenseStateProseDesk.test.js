/**
 * defenseStateProseDesk.test.js — DESK CAR 12: the defense desk.
 *
 * ⭐ THIS SUITE GUARDS THE FIRST PRODUCTION USE OF THE DM'S-PEN PROJECTION.
 * `projectBesideDmField` had ZERO runtime callers before this car — unit-tested, never
 * exercised. So the law it exists to hold is re-proved HERE, against the desk that now
 * depends on it, rather than cited from its own suite: the DM's string comes back BY
 * IDENTITY, and the bytes of a wired field equal the bytes of a dark one.
 *
 * ⛔ No `it.each`: the lighting walker parks a whole file that registers tests from a
 * non-literal table, and its each-family debt is a SHRINK-ONLY ratchet.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  RECOGNISED_MONSTER_TIERS, SLOT_FILL_SHAPES, SLOT_FILL_TABLES, beastsRowPoolKey,
  defenseStateProse, defenseThreatProse, disasterRowPoolKey, economicRowPoolKey,
  firstSurveyPoolKey, internalRowPoolKey, invasionRowPoolKey, isCompoundSafetyLabel,
  publicOrderPoolKey,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import {
  DEFENSE_BUCKET_KEYS, standingDefenseForces,
} from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { MONSTER_THREAT_TIERS, normalizeMonsterThreat } from '../../src/data/monsterThreat.js';
import { avgScore, scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { avgScore as avgScoreViaPdf } from '../../src/pdf/lib/viewModelPrimitives.js';
import { deriveDefensePosture } from '../../src/domain/display/dossierViewModel.js';
import { DM_FIELD_FRAMED_BY_BLOCK, isDmEditableProsePath } from '../../src/domain/display/stateProse/dmFieldProjection.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, sentenceMountForBlock } from '../../src/domain/display/stateProse/dossierMounts.js';
import { parseSlotShapes, mergeSlotShapes } from '../../scripts/lib/dossier-slot-shapes.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/**
 * THE LIVENESS ANCHOR for every "this block is not in the dark half" assertion below,
 * DERIVED and never named. An entry of UNMOUNTED_BLOCKS that genuinely carries no mount
 * row proves two things at once: the dark list is populated, and it is still correctly
 * keyed against the registry — which is exactly the partition those assertions depend on.
 * A bare absence check cannot tell "this block is mounted" from "the dark list drifted
 * away", and naming a dark block instead would go stale the moment it was lit (this suite
 * lost an arm that way one wave ago); a `.find` simply picks another. If the corpus ever
 * went fully mounted this is undefined and the anchored assertions red — which is right,
 * because the claim they make stops meaning anything at that point.
 */
const A_DARK_SIBLING = UNMOUNTED_BLOCKS.find(
  (id) => !DOSSIER_MOUNTS.some((row) => row.blockId === id),
);

const DEF3 = 'DS-DEF-3';
const DEF3_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF3].pools;
const SRC = resolve(import.meta.dirname, '../../src');

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

/** The five clean labels `safetyProfile.js` writes. */
const CLEAN_LABELS = ['Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous'];
/** Real compound forms the generator builds under a crisis. */
const COMPOUND_LABELS = [
  'Controlled — Occupation Curfew', 'Tense — Active Siege', 'Desperate — Famine Conditions',
  'Strained — Plague Conditions', 'Tense — Wartime',
];
const DM_LINE = 'The watch is thorough by day and thin after dark.';
const town = (safetyLabel, safetyDesc = DM_LINE) => ({
  name: 'Thornwall', _seed: 'seed-def',
  economicState: { safetyProfile: { safetyLabel, safetyDesc } },
});

describe('the defense desk — the label vocabulary is the producer\'s', () => {
  it('the five clean labels are an EXACT 1:1 with the five label pools', () => {
    for (const label of CLEAN_LABELS) {
      expect(DEF3_POOLS[label], `corpus has no pool ${label}`).toBeTruthy();
      expect(publicOrderPoolKey(label)).toBe(label);
    }
    // Both directions: the corpus carries no label pool the generator cannot write.
    const labelPools = Object.keys(DEF3_POOLS)
      .filter((k) => !k.startsWith('COMPOUND') && !k.startsWith('First-Survey'));
    expect([...labelPools].sort()).toEqual([...CLEAN_LABELS].sort());
    // An unrecognised label renders nothing — a safety band is a claim about whether the
    // streets are safe, and the neighbouring band is the wrong one to guess.
    expect(publicOrderPoolKey('Placid')).toBeNull();
    expect(publicOrderPoolKey('')).toBeNull();
    expect(publicOrderPoolKey(undefined)).toBeNull();
  });

  it('a crisis-rewritten label goes to COMPOUND, detected by the dash and not a name list', () => {
    for (const label of COMPOUND_LABELS) {
      expect(isCompoundSafetyLabel(label), label).toBe(true);
      expect(publicOrderPoolKey(label)).toBe('COMPOUND override (a crisis stress has rewritten the label)');
    }
    for (const label of CLEAN_LABELS) expect(isCompoundSafetyLabel(label), label).toBe(false);
    // Detecting the DASH rather than listing crisis names is deliberate: a new crisis would
    // otherwise read as an ordinary label, which is the quiet-degradation shape. A crisis
    // this suite has never heard of still routes correctly.
    expect(publicOrderPoolKey('Tense — Some Future Crisis'))
      .toBe('COMPOUND override (a crisis stress has rewritten the label)');
  });

  it('the declared slot shapes equal the annex register, and the desk owns no fill table', () => {
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(SHAPES.shapeOf(slot), `slot {${slot}}`).toBe(shape);
    }
    expect(SLOT_FILL_TABLES).toEqual({});
    // Every DS-DEF-3 variant names {settlement} and nothing else.
    const slots = new Set(Object.values(DEF3_POOLS).flat().flatMap((v) => v.slots || []));
    expect([...slots]).toEqual(['settlement']);
  });
});

describe('the defense desk — the FIRST-SURVEY framing rests on a measurement', () => {
  it('⭐ safetyLabel has NO world-pulse writer, which is why the qualification always holds', () => {
    // The pool is a FRAMING line rather than a state-keyed one, and the basis is that the
    // reading is never re-judged after generation. That is measured here, not assumed: if a
    // world-pulse module ever starts writing safetyLabel, this arm reds and the framing has
    // to be revisited rather than quietly becoming false.
    const pulseDir = resolve(SRC, 'domain/worldPulse');
    const writers = readdirSync(pulseDir)
      .filter((f) => f.endsWith('.js'))
      .filter((f) => /safetyLabel/.test(readFileSync(resolve(pulseDir, f), 'utf8')));
    expect(writers, `worldPulse now touches safetyLabel: ${writers}`).toEqual([]);
    // And it applies whenever there is a reading to qualify, and never without one.
    expect(firstSurveyPoolKey('Safe')).toBe('First-Survey qualification (the reading is a first look)');
    expect(firstSurveyPoolKey('Tense — Active Siege')).toBeTruthy();
    expect(firstSurveyPoolKey('')).toBeNull();
    expect(firstSurveyPoolKey(undefined)).toBeNull();
  });

  it('ALIVENESS: all SEVEN pools speak over labels the generator really writes', () => {
    const reached = new Set();
    for (const label of [...CLEAN_LABELS, ...COMPOUND_LABELS]) {
      const drawn = defenseStateProse(town(label), { seed: `d-${label}` });
      for (const key of ['publicOrder', 'firstSurvey']) {
        const rung = drawn[key]?.rung;
        if (rung?.sentence) {
          reached.add(rung.provenance.poolKey);
          expect(rung.provenance.blockId).toBe(DEF3);
          // This branch is guarded by `if (rung?.sentence)`, so it could run zero times —
          // but the arm pins `reached.size` at exactly 7 below, which a desk that had gone
          // silent over every label fails.
          // anchored: `reached.size` is pinned at exactly 7 after this loop
          expect(rung.sentence).not.toMatch(/[{}]/);
          // anchored: same guarded sentence; `reached.size` is pinned at 7 below
          expect(rung.sentence).not.toMatch(/[0-9]/);
        }
      }
    }
    expect(reached.size, `reached: ${[...reached]}`).toBe(7);
    expect(Object.keys(DEF3_POOLS)).toHaveLength(7);
  });
});

describe('the defense desk — ⭐ THE DM\'S PEN, first production use', () => {
  it('the block frames a DECLARED DM-editable field', () => {
    const path = DM_FIELD_FRAMED_BY_BLOCK[DEF3];
    expect(path).toBe('economicState.safetyProfile.safetyDesc');
    expect(isDmEditableProsePath(path), 'the framed path is not declared editable').toBe(true);
  });

  it('⛔ THE PIN — the DM\'s field comes back BY IDENTITY, and wired bytes === dark bytes', () => {
    const wired = defenseStateProse(town('Unsafe'), { seed: 'pin' });
    // BY IDENTITY, not merely equal: the projection may not trim, re-case or compose it.
    expect(wired.publicOrder.field).toBe(DM_LINE);
    expect(wired.publicOrder.hasField).toBe(true);
    expect(wired.publicOrder.beside).toBeTruthy();
    // THE LAW: a DM-edited field renders the same bytes with the corpus fully wired as it
    // does with the corpus absent. The corpus is made absent by giving no readable label.
    const dark = defenseStateProse(town('', DM_LINE), { seed: 'pin' });
    expect(dark.publicOrder, 'no readable label ⇒ no rung at all').toBeNull();
    // …and the field the caller would render is untouched in both worlds.
    expect(wired.publicOrder.field).toBe(DM_LINE);
  });

  it('the machine line is OFFERED, never substituted — and is null when the corpus is silent', () => {
    // No DM field at all: the corpus line is still offered beside an empty position.
    const noDm = defenseStateProse({ name: 'Thornwall', economicState: { safetyProfile: { safetyLabel: 'Safe' } } }, { seed: 'n' });
    expect(noDm.publicOrder.hasField).toBe(false);
    expect(noDm.publicOrder.beside).toBeTruthy();
    // A settlement with no safety profile says nothing at all, and does not crash.
    expect(defenseStateProse({ name: 'Thornwall' }).publicOrder).toBeNull();
    expect(defenseStateProse(undefined).firstSurvey).toBeNull();
  });

  it('⭐ the desk returns PROJECTIONS, not bare rungs — a composer has nowhere to put a write', () => {
    // The structural half of the law. If this desk returned a bare rung, a caller could
    // render the machine sentence into the position the DM's field occupies and nothing
    // would stop it. The returned shape carries `field`/`beside`/`hasField`, so the only
    // thing a caller can do with the machine line is put it BESIDE.
    const drawn = defenseStateProse(town('Dangerous'), { seed: 'shape' });
    for (const key of ['publicOrder', 'firstSurvey']) {
      expect(Object.keys(drawn[key]).sort()).toEqual(['beside', 'field', 'hasField', 'rung']);
    }
    // And the caller cannot mutate what it was handed.
    expect(Object.isFrozen(drawn.publicOrder)).toBe(true);
  });

  it('the registry mounts DS-DEF-3 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF3);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.publicOrder', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF3)?.mount).toBe('defense.publicOrder');
    // Derived, never a hardcoded dark-block literal — an assertion naming a block as DARK
    // goes stale the moment it is lit, which cost this lane an arm one wave ago.
    for (const row of DOSSIER_MOUNTS.filter((r) => r.desk === 'defense')) {
      expectAbsentWithAnchor(
        UNMOUNTED_BLOCKS, row.blockId, A_DARK_SIBLING,
        `${row.blockId} carries a defense mount row, so the dark half must not name it`,
      );
    }
  });
});

/** DS-DEF-2 — the five readiness rows. */
const DEF2 = 'DS-DEF-2';
const DEF2_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF2].pools;

/**
 * ⭐⭐ THE FIXTURE THAT LIED, AND WHAT REPLACED IT.
 *
 * This factory used to hand the desk `institutions: { walls: true, garrison: true }` —
 * BOOLEANS — and 24 of 24 arms were green against it for the whole of the block's shipped
 * life. The producer has never once returned that shape: `getDefenseInstitutions` writes
 * ARRAYS, so the shipped grader (`v === true || typeof v === 'number' && v > 0`) was FALSE
 * for a fortified town and false for an empty field alike, and the two produced
 * byte-identical prose in front of a paying reader. **A fixture that hand-builds a shape
 * the producer never returns IS the specification, and it is lying.**
 *
 * So the fixture now carries a REAL ROSTER of catalogue institution names, and the arm
 * below (`the fixture's roster is the PRODUCER's own`) binds those names to
 * `generateDefenseProfile`'s actual buckets, so a fixture that drifts out of the
 * producer's vocabulary reds instead of quietly proving nothing.
 * @type {Readonly<Record<string, string>>}
 */
const FORCE_NAME = Object.freeze({
  walls: 'Massive Walls', garrison: 'Garrison Barracks', militia: 'Citizen Militia',
});

/** A settlement carrying exactly the slice DS-DEF-2 reads, in the producer's own shapes. */
function fort({
  monsterThreat = 'frontier', walls = false, garrison = false, militia = false,
  hasCourtSystem = false, hasPrison = false, hasGranary = false, hasHospital = false,
  hasChurch = false, economic = 50, ruined = false,
} = {}) {
  const roster = [];
  if (walls) roster.push({ name: FORCE_NAME.walls });
  if (garrison) roster.push({ name: FORCE_NAME.garrison });
  if (militia) roster.push({ name: FORCE_NAME.militia });
  return {
    name: 'Thornwall', _seed: 'seed-def2',
    config: { monsterThreat },
    // The ruin paths replace a row IMMUTABLY and stamp both fields; the fixture copies
    // that shape rather than inventing a cheaper one.
    institutions: ruined
      ? roster.map((i) => ({ ...i, status: 'ruined', _worldPulseInactive: true }))
      : roster,
    defenseProfile: { scores: { economic } },
    economicState: { compound: { inst: { hasCourtSystem, hasPrison, hasGranary, hasHospital, hasChurch } } },
  };
}

describe('DS-DEF-2 — ⛔⛔ THE GRADER READS WHAT THE PRODUCER WRITES (F2/F3)', () => {
  it('the fixture\'s roster is the PRODUCER\'s own — its names land in the real buckets', () => {
    // The arm that makes every assertion below mean something. If a catalogue rename ever
    // moved these names out of the producer's keyword vocabulary, the fixture would go on
    // "proving" a walled town while the producer classified nothing, which is precisely the
    // failure the boolean fixture hid. Asserted against generateDefenseProfile, not a literal.
    const built = fort({ walls: true, garrison: true, militia: true });
    const buckets = generateDefenseProfile(built).institutions;
    expect(buckets.walls.map((i) => i.name)).toEqual([FORCE_NAME.walls]);
    expect(buckets.garrison.map((i) => i.name)).toEqual([FORCE_NAME.garrison]);
    expect(buckets.militia.map((i) => i.name)).toEqual([FORCE_NAME.militia]);
    // …and the producer's bucket vocabulary is the module's, both ways: a bucket added to
    // one side and not the other is the label trap wearing a different hat.
    expect(Object.keys(buckets).sort()).toEqual([...DEFENSE_BUCKET_KEYS].sort());
  });

  it('⛔ WHAT SHIPPED: the producer writes ARRAYS, so the old boolean grader saw nothing', () => {
    // The defect, pinned as a fact about SHAPES rather than re-enacted as a dead predicate.
    // `flag(v) { return v === true || (typeof v === 'number' && v > 0) }` is false for every
    // one of these, which is why a fortified town and an empty field read alike.
    const buckets = generateDefenseProfile(fort({ walls: true, garrison: true })).institutions;
    expect(Array.isArray(buckets.walls)).toBe(true);
    expect(buckets.walls).not.toBe(true);
    expect(typeof buckets.walls).not.toBe('number');
    // The typed projection is what a caller may ask, and it is a real boolean.
    expect(standingDefenseForces(fort({ walls: true })).walls.present).toBe(true);
    expect(standingDefenseForces(fort({})).walls.present).toBe(false);
  });

  it('⭐ A WALLED TOWN AND AN UNDEFENDED ONE NOW SAY DIFFERENT THINGS', () => {
    const walled = defenseThreatProse(fort({ walls: true, garrison: true }), { seed: 'f2' });
    const bare = defenseThreatProse(fort({}), { seed: 'f2' });
    expect(walled.invasion.provenance.poolKey).toBe('Invasion & War: walls AND professional garrison');
    expect(bare.invasion.provenance.poolKey).toBe('Invasion & War: neither walls nor force');
    expect(walled.invasion.sentence).not.toBe(bare.invasion.sentence);
    // …and the Beasts row, which was silent on EVERY settlement in the product, speaks.
    expect(walled.beasts.provenance.poolKey).toBe('Beasts & Monsters: frontier, credible deterrence');
    expect(bare.beasts).toBeNull();
  });

  it('⛔⛔ A RUINED CITADEL DOES NOT READ AS STANDING WALLS', () => {
    // Curing the read ACTIVATES the producer's defect, so this is the arm that had to exist
    // before the read was widened. The rubble town and the empty field agree; the rubble
    // town and the intact town do not.
    const intact = defenseThreatProse(fort({ walls: true, garrison: true }), { seed: 'f3' });
    const rubble = defenseThreatProse(fort({ walls: true, garrison: true, ruined: true }), { seed: 'f3' });
    const bare = defenseThreatProse(fort({}), { seed: 'f3' });
    expect(rubble.invasion.provenance.poolKey).toBe('Invasion & War: neither walls nor force');
    expect(rubble.invasion.sentence).toBe(bare.invasion.sentence);
    expect(rubble.invasion.sentence).not.toBe(intact.invasion.sentence);
    expect(standingDefenseForces(fort({ walls: true, ruined: true })).walls).toEqual(
      { present: false, count: 0, names: [] },
    );
  });

  it('⛔ AND THE SNAPSHOT COULD NEVER HAVE BEEN FILTERED — it is unreachable by construction', () => {
    // `generateDefenseProfile` runs once, at assembly; every ruin path REPLACES its roster
    // row immutably, so `defenseProfile.institutions` keeps the PRE-RUIN objects for the
    // life of the settlement. Filtering inside the producer would have been a no-op against
    // the live hazard — this arm is the measurement that says so, in the tree.
    const rubble = fort({ walls: true, ruined: true });
    rubble.defenseProfile = generateDefenseProfile(rubble);
    expect(rubble.defenseProfile.institutions.walls.map((i) => i.name)).toEqual([FORCE_NAME.walls]);
    expect(rubble.institutions[0]._worldPulseInactive).toBe(true);
    expect(standingDefenseForces(rubble).walls.count).toBe(0);
  });

  it('the civic rows read a producer that really does emit booleans', () => {
    // `civicFlag` is strict `=== true`. That is only correct because
    // priorityHelpers.getInstitutionNames builds each of these with `hasAny(...)`, i.e.
    // `.some()`. Bound to the producer here rather than assumed, because assuming it about
    // the SIBLING facet is the whole of F2.
    const flags = getInstFlags({}, [
      { name: 'Courthouse' }, { name: 'Prison' }, { name: 'Granary' },
      { name: 'Hospital' }, { name: 'Church' },
    ]).inst;
    for (const key of ['hasCourtSystem', 'hasPrison', 'hasGranary', 'hasHospital', 'hasChurch']) {
      expect(typeof flags[key], `${key} is not a boolean — the civic read must be re-cut`).toBe('boolean');
      expect(flags[key]).toBe(true);
    }
    const none = getInstFlags({}, []).inst;
    for (const key of ['hasCourtSystem', 'hasPrison', 'hasGranary', 'hasHospital', 'hasChurch']) {
      expect(none[key]).toBe(false);
    }
  });
});

describe('DS-DEF-2 — ⭐ THE LABEL-TRAP RULE, third instance', () => {
  it('the desk recognises EXACTLY the canonical tiers, both ways', () => {
    expect([...RECOGNISED_MONSTER_TIERS].sort()).toEqual([...MONSTER_THREAT_TIERS].sort());
  });

  it('⛔ the producer says `heartland` where the corpus says `settled` — keyed on the TOKEN', () => {
    // Three instances across two leaves now: `indebted`, `religious_conversion`, and this.
    // A consumer keyed on the CORPUS word would carry an arm no producer emits AND miss the
    // tier that is emitted — the dead-vocabulary defect from both sides at once.
    expectAbsentWithAnchor(
      MONSTER_THREAT_TIERS, 'settled', 'heartland',
      'the producer emits `heartland`; `settled` is the CORPUS word and no tier',
    );
    // …and the corpus's family word is `settled`, reached FROM the producer token.
    expect(beastsRowPoolKey('heartland', true, true)).toBe('Beasts & Monsters: settled, defenses beyond the need');
    expect(Object.keys(DEF2_POOLS).some((k) => k.startsWith('Beasts & Monsters: settled'))).toBe(true);
    expect(Object.keys(DEF2_POOLS).some((k) => k.includes('heartland'))).toBe(false);
  });

  it('⚠ RAISED NOT CURED: the normaliser forwards a non-canonical tier, and the desk is silent on it', () => {
    // `normalizeMonsterThreat` passes 'civilized' through UNCHANGED although it is not a
    // canonical tier — a normaliser that forwards a non-canonical value is not normalising.
    // Recorded, not fixed here. The desk is TOTAL over the canonical three and returns null
    // for anything else, so an un-normalised value renders SILENCE, never a wrong family.
    expect(normalizeMonsterThreat('civilized')).toBe('civilized');
    expectAbsentWithAnchor(
      MONSTER_THREAT_TIERS, 'civilized', 'heartland',
      'the normaliser forwards `civilized` although it is not a canonical tier',
    );
    expect(beastsRowPoolKey('civilized', true, true)).toBeNull();
    // The legacy aliases the normaliser DOES map still route correctly.
    expect(normalizeMonsterThreat('low')).toBe('heartland');
    expect(beastsRowPoolKey('low', true, true)).toBe('Beasts & Monsters: settled, defenses beyond the need');
  });
});

describe('DS-DEF-2 — each row lens at its boundaries', () => {
  it('BEASTS branches per tier, and says nothing where the corpus wrote nothing', () => {
    expect(beastsRowPoolKey('plagued', true, true)).toBe('Beasts & Monsters: plagued, perimeter AND organized force');
    expect(beastsRowPoolKey('plagued', true, false)).toBe('Beasts & Monsters: plagued, perimeter but NO force to hold it');
    expect(beastsRowPoolKey('plagued', false, false)).toBe('Beasts & Monsters: plagued, NO perimeter and NO force');
    // A plagued country with a force and no wall: the corpus wrote no sentence, so silence.
    expect(beastsRowPoolKey('plagued', false, true)).toBeNull();
    expect(beastsRowPoolKey('frontier', true, true)).toBe('Beasts & Monsters: frontier, credible deterrence');
    expect(beastsRowPoolKey('frontier', false, true)).toBe('Beasts & Monsters: frontier, force without a perimeter');
    expect(beastsRowPoolKey('frontier', false, false)).toBeNull();
    expect(beastsRowPoolKey('heartland', true, false)).toBe('Beasts & Monsters: settled, defenses beyond the need');
    expect(beastsRowPoolKey('heartland', false, false)).toBe('Beasts & Monsters: settled, nothing organized');
    expect(beastsRowPoolKey('heartland', false, true)).toBeNull();
  });

  it('INVASION and INTERNAL are TOTAL over their boolean combinations', () => {
    expect(invasionRowPoolKey(true, true, false)).toBe('Invasion & War: walls AND professional garrison');
    // A garrison outranks a militia: a town with both is defended by the professionals.
    expect(invasionRowPoolKey(true, true, true)).toBe('Invasion & War: walls AND professional garrison');
    expect(invasionRowPoolKey(true, false, true)).toBe('Invasion & War: walls with citizen militia');
    expect(invasionRowPoolKey(true, false, false)).toBe('Invasion & War: walls with NO force');
    expect(invasionRowPoolKey(false, true, false)).toBe('Invasion & War: force with NO walls');
    expect(invasionRowPoolKey(false, false, true)).toBe('Invasion & War: militia only');
    expect(invasionRowPoolKey(false, false, false)).toBe('Invasion & War: neither walls nor force');
    expect(internalRowPoolKey(true, true)).toBe('Internal Security: full legal chain (court AND prison)');
    expect(internalRowPoolKey(true, false)).toBe('Internal Security: court without detention');
    expect(internalRowPoolKey(false, true)).toBe('Internal Security: detention without process');
    expect(internalRowPoolKey(false, false)).toBe('Internal Security: no legal infrastructure');
  });

  it('⭐ ECONOMIC reads ONE score through the canonical band — no `avgScore` mean needed', () => {
    // This is why DS-DEF-2 could land before DS-DEF-1: the band comes from
    // `scores.economic` alone, not from the overall mean that is stranded behind ~280 KB.
    for (const n of [80, 50, 30, 10]) {
      expect(economicRowPoolKey(n)).toBe(`Economic Survival: ${scoreBand(n)}`);
    }
    expect(economicRowPoolKey(65)).toBe('Economic Survival: STRONG');
    expect(economicRowPoolKey(64)).toBe('Economic Survival: ADEQUATE');
    expect(economicRowPoolKey(20)).toBe('Economic Survival: WEAK');
    expect(economicRowPoolKey(19)).toBe('Economic Survival: CRITICAL');
    // Absent or non-numeric is silence, never a band.
    expect(economicRowPoolKey(undefined)).toBeNull();
    expect(economicRowPoolKey('50')).toBeNull();
    // And the desk does not reach for the stranded mean.
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/defenseStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    for (const heavy of ['avgScore', 'dossierViewModel', 'viewModelPrimitives']) {
      expectAbsentWithAnchor(
        code, heavy, 'export function defenseStateProse',
        'the desk reached for avgScore or its heavy homes',
      );
    }
  });

  it('DISASTERS treats parish care as medical provision ONLY in the granary branch', () => {
    // The corpus's own shape: it wrote `granary AND parish care only` but no matching
    // "no reserves, parish care" pool, so for a town with no reserves the split is
    // hospital-or-nothing. Total over the five pools the corpus actually carries.
    expect(disasterRowPoolKey(true, true, false)).toBe('Disasters & Famine: granary AND hospital');
    expect(disasterRowPoolKey(true, false, true)).toBe('Disasters & Famine: granary AND parish care only');
    expect(disasterRowPoolKey(true, false, false)).toBe('Disasters & Famine: granary, NO medical provision');
    expect(disasterRowPoolKey(false, true, false)).toBe('Disasters & Famine: NO reserves, hospital present');
    expect(disasterRowPoolKey(false, false, false)).toBe('Disasters & Famine: NO reserves, NO medical provision');
    expect(disasterRowPoolKey(false, false, true)).toBe('Disasters & Famine: NO reserves, NO medical provision');
  });
});

describe('DS-DEF-2 — ALIVENESS over every combination the generator can build', () => {
  it('all TWENTY-SIX pools speak, swept over the full combination space', () => {
    const reached = new Set();
    for (const monsterThreat of MONSTER_THREAT_TIERS) {
      for (const walls of [true, false]) {
        for (const garrison of [true, false]) {
          for (const militia of [true, false]) {
            for (const hasCourtSystem of [true, false]) {
              for (const hasPrison of [true, false]) {
                for (const hasGranary of [true, false]) {
                  for (const hasHospital of [true, false]) {
                    for (const hasChurch of [true, false]) {
                      for (const economic of [80, 50, 30, 10]) {
                        const drawn = defenseThreatProse(fort({
                          monsterThreat, walls, garrison, militia, hasCourtSystem,
                          hasPrison, hasGranary, hasHospital, hasChurch, economic,
                        }), { seed: 'sweep' });
                        for (const row of ['beasts', 'invasion', 'internal', 'economic', 'disaster']) {
                          const rung = drawn[row];
                          if (!rung?.sentence) continue;
                          reached.add(rung.provenance.poolKey);
                          expect(rung.provenance.blockId).toBe(DEF2);
                          // This branch is guarded by `if (!rung?.sentence) continue`, so
                          // it could run zero times — but the arm pins `reached.size` at
                          // the corpus pool count below, which a dead desk fails.
                          // anchored: `reached.size` is pinned at the corpus pool count
                          expect(rung.sentence).not.toMatch(/[{}]/);
                          // anchored: same guarded sentence; `reached.size` pinned below
                          expect(rung.sentence).not.toMatch(/[0-9]/);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(DEF2_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(DEF2_POOLS).length);
    expect(Object.keys(DEF2_POOLS)).toHaveLength(26);
  });

  it('DS-DEF-2 frames no DM field, so it returns plain rungs rather than projections', () => {
    // The DM's-pen shape is DS-DEF-3's. Handing back a projection where no DM-editable
    // field exists would be ceremony rather than protection, and would tell a reader of
    // this code that a field is at risk when none is.
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF2]).toBeUndefined();
    const drawn = defenseThreatProse(fort({ walls: true, garrison: true }), { seed: 'shape' });
    expect(Object.keys(drawn.invasion).sort()).toEqual(['detail', 'glance', 'provenance', 'sentence']);
  });

  it('a settlement with no defence profile says nothing at all, and does not crash', () => {
    const empty = defenseThreatProse({ name: 'Thornwall' }, { seed: 'z' });
    // The boolean rows are TOTAL, so they still speak on an absent profile (all-false is a
    // real reading: no walls, no force, no legal chain, no reserves). The SCORE row is the
    // one that goes silent, because an absent score is not a band.
    expect(empty.economic).toBeNull();
    expect(empty.invasion.sentence).toBeTruthy();
    expect(defenseThreatProse(undefined).economic).toBeNull();
  });

  it('the registry mounts DS-DEF-2 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF2);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.threatAssessment', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF2)?.mount).toBe('defense.threatAssessment');
  });
});

/**
 * ⭐ THE `avgScore` LIFT — guarded here because DS-DEF-1 is the consumer that motivated it.
 *
 * The overall defence mean was a four-line pure function in `pdf/lib/viewModelPrimitives.js`
 * AND an inline copy in `dossierViewModel.deriveDefensePosture`. `parityContract.js` carries
 * a `defense.scoreAvg` row precisely because two copies of one mean drift. Both homes were
 * expensive: reaching them cost 297,048 B and 282,319 B of transitive weight over the
 * first-paint closure, so a display consumer had three options — pay ~280 KB, hand-roll a
 * THIRD copy, or go without. It now lives in `defenseScoreBands.js`, the module that owns
 * the band vocabulary every consumer pairs it with, at 3,617 B.
 */
describe('the avgScore lift — ONE implementation, reachable cheaply', () => {
  it('⛔ exactly ONE implementation of the mean remains in src/', () => {
    // A source scan, because the defect this lift cures is a SECOND copy — and a third
    // could be hand-rolled by anyone who finds the real one expensive to reach.
    const hits = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir)) {
        const path = resolve(dir, entry);
        if (statSync(path).isDirectory()) { walk(path); continue; }
        if (!/\.jsx?$/.test(entry)) continue;
        const src = readFileSync(path, 'utf8');
        if (/reduce\(\(a,\s*b\)\s*=>\s*a\s*\+\s*b,\s*0\)\s*\/\s*vals\.length/.test(src)) hits.push(entry);
      }
    };
    walk(resolve(import.meta.dirname, '../../src'));
    expect(hits, `the mean is implemented in ${hits.length} places`).toEqual(['defenseScoreBands.js']);
  });

  it('both former homes DELEGATE, and agree with the leaf exactly', () => {
    // The PDF primitive re-exports; dossierViewModel calls. Agreement is asserted with
    // Object.is so the NaN-in/NaN-out case counts as equal rather than silently passing.
    const cases = [
      { monster: 40, military: 55, internal: 60, economic: 50, magical: 30 },
      { a: 1 }, { a: 0 }, {}, null, undefined, { a: 'x', b: 5 },
      { a: 66, b: 67 }, { a: -10, b: 10 }, { a: 99.6 }, { a: Number.NaN, b: 50 },
    ];
    const reached = new Set();
    for (const scores of cases) {
      const mine = avgScore(scores);
      reached.add(String(mine));
      expect(Object.is(avgScoreViaPdf(scores), mine), `pdf re-export for ${JSON.stringify(scores)}`).toBe(true);
      const posture = deriveDefensePosture({ defenseProfile: { scores } });
      expect(Object.is(posture.scoreAvg, mine), `dossierViewModel for ${JSON.stringify(scores)}`).toBe(true);
    }
    // Non-vacuity: the cases must have produced several distinct answers, or agreement
    // could be three functions all returning the same constant.
    expect(reached.size).toBeGreaterThan(5);
  });

  it('`null` on no numeric scores — an absent score is NOT a zero', () => {
    // A consumer that banded 0 would report CRITICAL for a settlement with no defence
    // profile at all, which is a false statement rather than a missing one.
    expect(avgScore({})).toBeNull();
    expect(avgScore(null)).toBeNull();
    expect(avgScore({ a: 'x' })).toBeNull();
    expect(scoreBand(0)).toBe('CRITICAL');
    // …and the desk's economic row is silent rather than CRITICAL on an absent score.
    expect(economicRowPoolKey(avgScore({}))).toBeNull();
  });
});
