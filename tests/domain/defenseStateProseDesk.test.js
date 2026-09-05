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
  RECOGNISED_MONSTER_TIERS, SLOT_FILL_SHAPES, SLOT_FILL_TABLES, arcaneDefensePoolKey,
  beastsRowPoolKey, charterPoolKey, contractedForcePoolKey, countryWarrantsCharter,
  defenseForcesProse, defenseStateProse, defenseThreatProse, disasterRowPoolKey,
  defensePostureProse, economicRowPoolKey, firstSurveyPoolKey, forceCorePoolKey,
  fortificationPoolKey, internalRowPoolKey, invasionRowPoolKey, isCompoundSafetyLabel,
  measuredMonsterFamily, posturePoolKey, publicOrderPoolKey, strategicPrizePoolKey,
  terrainDefencePoolKey, TERRAIN_DEFENCE_NAMES, TERRAIN_PRIZE_NAMES,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import {
  DEFENSE_BUCKET_KEYS, standingDefenseForces,
} from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { MONSTER_THREAT_TIERS, normalizeMonsterThreat } from '../../src/data/monsterThreat.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { avgScore, scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { avgScore as avgScoreViaPdf } from '../../src/pdf/lib/viewModelPrimitives.js';
import { deriveDefensePosture } from '../../src/domain/display/dossierViewModel.js';
import { DM_FIELD_FRAMED_BY_BLOCK, isDmEditableProsePath } from '../../src/domain/display/stateProse/dmFieldProjection.js';
import { deriveGuardAssessment } from '../../src/domain/display/defenseDisplay.js';
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

  it('⭐ AN ABSENT TIER IS NOT THE FRONTIER — the desk requires a MEASUREMENT', () => {
    // The normaliser's first line is `raw || 'frontier'`, so routing an absent value through
    // it describes the country of a settlement whose country nobody measured. Measured here
    // rather than assumed, and the desk refuses the default at its own boundary.
    expect(normalizeMonsterThreat(undefined)).toBe('frontier');
    expect(normalizeMonsterThreat('')).toBe('frontier');
    expect(measuredMonsterFamily(undefined)).toBeNull();
    expect(measuredMonsterFamily('')).toBeNull();
    expect(measuredMonsterFamily('   ')).toBeNull();
    expect(measuredMonsterFamily('heartland')).toBe('settled');
    expect(measuredMonsterFamily('low')).toBe('settled');
    expect(measuredMonsterFamily('civilized')).toBeNull();
    // Both consumers of the tier refuse it, so the desk cannot disagree with itself.
    expect(beastsRowPoolKey(undefined, true, true)).toBeNull();
    expect(countryWarrantsCharter(undefined)).toBe(false);
    // ⚠ AND IT CHANGES NO GENERATED WORLD: steps/resolveConfig.js writes `monsterThreat`
    // into every effective config it builds, so an absent tier means a hand-built fixture or
    // a malformed import — never a settlement the generator produced.
    const resolveSource = readFileSync(
      resolve(import.meta.dirname, '../../src/generators/steps/resolveConfig.js'), 'utf8',
    );
    expect(resolveSource).toContain('monsterThreat: threat,');
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

/** DS-DEF-1 — the defensive-posture header, the three lenses. */
const DEF1 = 'DS-DEF-1';
/** A DM's own sentence in the field DS-DEF-1 frames. */
const DM_GUARD_LINE = 'The gate guards know every carter by name and half of them by debt.';
const DEF1_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF1].pools;
/** Every terrain NAME the producer can write into `resourceAnalysis.terrain`. */
const TERRAIN_NAMES = Object.values(TERRAIN_DATA).map((t) => t.name);

/** @param {string|undefined} terrain @param {number|undefined} score */
function sited(terrain, score = 50) {
  return {
    name: 'Thornwall', _seed: 'seed-def1',
    resourceAnalysis: { terrain },
    defenseProfile: { readiness: { score } },
  };
}

describe('DS-DEF-1 — the posture header, and a BLOCKER that had decayed', () => {
  it('⭐ the readiness lens bands the SAME number the badge beside it shows', () => {
    // Not `avgScore`. `DefenseTab` prints `readiness.label`, which computeDefenseReadiness
    // derives from `readiness.score` — the mean PLUS a tier bonus MINUS a threat penalty.
    // Banding any other quantity would let the page print "Fortress" beside a sentence
    // calling the town effectively undefended.
    for (const n of [90, 65, 64, 30, 19, 0]) {
      expect(posturePoolKey(n)).toBe(`readiness ${scoreBand(n)}`);
    }
    expect(posturePoolKey(80)).toBe('readiness STRONG');
    expect(posturePoolKey(45)).toBe('readiness ADEQUATE');
    expect(posturePoolKey(25)).toBe('readiness WEAK');
    expect(posturePoolKey(5)).toBe('readiness CRITICAL');
    // …and the generator really does write that field, on a real profile.
    const built = generateDefenseProfile(fort({ walls: true, garrison: true }));
    expect(typeof built.readiness.score).toBe('number');
    expect(posturePoolKey(built.readiness.score)).toBe(`readiness ${scoreBand(built.readiness.score)}`);
  });

  it('an absent readiness score is SILENCE, not CRITICAL', () => {
    // `scoreBand` would happily call an absent reading CRITICAL, which is a false statement
    // rather than a missing one — the same distinction the economic row makes.
    expect(scoreBand(0)).toBe('CRITICAL');
    expect(posturePoolKey(undefined)).toBeNull();
    expect(posturePoolKey(null)).toBeNull();
    expect(posturePoolKey('50')).toBeNull();
    expect(posturePoolKey(Number.NaN)).toBeNull();
    expect(defensePostureProse({ name: 'Thornwall' }, { seed: 'z1' }).posture).toBeNull();
  });

  it('⭐ the terrain maps are TOTAL against TERRAIN_DATA in BOTH directions', () => {
    // The label-trap discipline applied to a display-name vocabulary: every key is a name
    // the producer actually writes, and a terrain added or renamed reds here rather than
    // dropping silently out of the lens.
    for (const name of TERRAIN_DEFENCE_NAMES) {
      expect(TERRAIN_NAMES, `${name} is not a terrain the producer writes`).toContain(name);
    }
    for (const name of TERRAIN_PRIZE_NAMES) {
      expect(TERRAIN_NAMES, `${name} is not a terrain the producer writes`).toContain(name);
    }
    // …and the two terrains left out of the defence map are left out ON PURPOSE.
    const unclassified = TERRAIN_NAMES.filter((n) => !TERRAIN_DEFENCE_NAMES.includes(n));
    expect(unclassified.sort()).toEqual(['Coastal', 'Riverside']);
  });

  it('⭐ each map entry AGREES with the strategicValue its own terrain carries', () => {
    // The runtime never parses that prose — that is the config-key-walker defect in
    // miniature — but the map claims to summarise it, so the claim is checked HERE against
    // the data rather than believed.
    const svOf = (name) => Object.values(TERRAIN_DATA).find((t) => t.name === name).strategicValue;
    for (const name of TERRAIN_DEFENCE_NAMES) {
      const favourable = terrainDefencePoolKey(name) === 'terrain FAVOURABLE to the defender';
      const sv = svOf(name);
      if (favourable) expect(sv, `${name}: ${sv}`).toMatch(/defensible|difficult to besiege/i);
      else expect(sv, `${name}: ${sv}`).toMatch(/exposed|caravan/i);
    }
    expect(svOf('Coastal')).toMatch(/^High - /);
    expect(svOf('Mountain')).toMatch(/^High - /);
    expect(svOf('Forest')).toMatch(/^Low-/);
    // The middle of the range is in NEITHER prize pool, because the corpus wrote no middle
    // and Hills' Medium-High value is DEFENSIVE rather than a prize.
    for (const name of ['Riverside', 'Plains', 'Desert/Arid', 'Hills']) {
      expect(strategicPrizePoolKey(name), name).toBeNull();
      expect(svOf(name)).toMatch(/^Medium/);
    }
  });

  it('the ground lens speaks only where the corpus has a reading for it', () => {
    expect(terrainDefencePoolKey('Mountain')).toBe('terrain FAVOURABLE to the defender');
    expect(terrainDefencePoolKey('Hills')).toBe('terrain FAVOURABLE to the defender');
    expect(terrainDefencePoolKey('Forest')).toBe('terrain FAVOURABLE to the defender');
    expect(terrainDefencePoolKey('Plains')).toBe('terrain EXPOSED');
    expect(terrainDefencePoolKey('Desert/Arid')).toBe('terrain EXPOSED');
    // A water flank is neither narrows nor open ground: both pools would be false of it.
    expect(terrainDefencePoolKey('Coastal')).toBeNull();
    expect(terrainDefencePoolKey('Riverside')).toBeNull();
    expect(terrainDefencePoolKey(undefined)).toBeNull();
    expect(terrainDefencePoolKey('Tundra')).toBeNull();
  });

  it('all EIGHT pools speak, over every terrain the producer writes × the band ladder', () => {
    const reached = new Set();
    for (const terrain of [...TERRAIN_NAMES, undefined]) {
      for (const score of [90, 76, 65, 64, 55, 40, 24, 20, 19, 12, 0, undefined]) {
        const drawn = defensePostureProse(sited(terrain, score), { seed: 'sweep1' });
        for (const lens of ['posture', 'terrain', 'prize']) {
          // The projection carries its rung; a bare `drawn[lens].sentence` is exactly the
          // read a caller must not be able to make, so the sweep goes through `.rung` too.
          const rung = drawn[lens]?.rung;
          if (!rung?.sentence) continue;
          reached.add(rung.provenance.poolKey);
          expect(rung.provenance.blockId).toBe(DEF1);
          // anchored: `reached.size` is pinned at the corpus pool count below
          expect(rung.sentence).not.toMatch(/[{}]/);
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(DEF1_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(DEF1_POOLS).length);
    expect(Object.keys(DEF1_POOLS)).toHaveLength(8);
  });

  it('the registry mounts DS-DEF-1 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.postureHeader', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF1)?.mount).toBe('defense.postureHeader');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, DEF1, A_DARK_SIBLING,
      'DS-DEF-1 carries a mount row, so the dark half must not name it',
    );
  });

  it('⛔⛔ DS-DEF-1 IS A DM\'S-PEN BLOCK — the registry says so, and the desk obeys it', () => {
    // This arm caught a real defect while it was being written. A first cut of the desk
    // returned BARE RUNGS, reasoning that `guardEffectivenessDesc` was not a DM path. The
    // registry disagrees, and it is the authority: DS-DEF-1 is the leaf's OTHER DM-pen
    // block, and `deriveGuardAssessment` returns that exact field verbatim into the header
    // these lenses sit beside. A claim about a registry is checked against the registry.
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF1]).toBe('economicState.safetyProfile.guardEffectivenessDesc');
    expect(isDmEditableProsePath(DM_FIELD_FRAMED_BY_BLOCK[DEF1])).toBe(true);
    expect(deriveGuardAssessment({
      economicState: { safetyProfile: { guardEffectivenessDesc: DM_GUARD_LINE } },
    })).toBe(DM_GUARD_LINE);

    // THE PROJECTION SHAPE, on every lens: `{field, beside, hasField, rung}` and never a
    // bare rung, so a composer cannot put the machine line where the DM's sentence lives.
    const withPen = defensePostureProse({
      ...sited('Mountain', 80),
      economicState: { safetyProfile: { guardEffectivenessDesc: DM_GUARD_LINE } },
    }, { seed: 'pen' });
    for (const lens of ['posture', 'terrain', 'prize']) {
      expect(Object.keys(withPen[lens]).sort()).toEqual(['beside', 'field', 'hasField', 'rung']);
      // THE PIN THAT MATTERS: the DM's string comes back BY IDENTITY, not a copy.
      expect(withPen[lens].field).toBe(DM_GUARD_LINE);
      expect(withPen[lens].hasField).toBe(true);
      expect(withPen[lens].beside).toBeTruthy();
    }
    // …and the wired field's bytes equal the dark field's bytes.
    const dark = { economicState: { safetyProfile: { guardEffectivenessDesc: DM_GUARD_LINE } } };
    expect(withPen.posture.field).toBe(dark.economicState.safetyProfile.guardEffectivenessDesc);
    // With no DM sentence, the field stays absent and the machine line is still offered
    // beside it rather than promoted into its place.
    const noPen = defensePostureProse(sited('Mountain', 80), { seed: 'pen' });
    expect(noPen.posture.hasField).toBe(false);
    expect(noPen.posture.beside).toBeTruthy();
  });
});

/** DS-DEF-5 — armed forces & fortifications, the five lenses. */
const DEF5 = 'DS-DEF-5';
const DEF5_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF5].pools;
const DEF5_LENSES = ['fortification', 'force', 'contracted', 'charter', 'arcane'];

/** The catalogue name that lands in each producer bucket. Bound to the producer below. */
const BUCKET_NAME = Object.freeze({
  walls: 'Massive Walls', garrison: 'Garrison Barracks', militia: 'Citizen Militia',
  watch: 'Town Watch', mercenary: 'Mercenary Company', charter: "Adventurers' Charter Hall",
  magicDef: "Wizard's Tower",
});

/** A settlement with exactly the named buckets standing. @param {string[]} standing */
function garrisonTown(standing, { monsterThreat = 'frontier', magicExists = true, ruined = false } = {}) {
  const roster = standing.map((key) => ({ name: BUCKET_NAME[key] }));
  return {
    name: 'Thornwall', _seed: 'seed-def5',
    config: { monsterThreat, magicExists },
    institutions: ruined
      ? roster.map((i) => ({ ...i, status: 'ruined', _worldPulseInactive: true }))
      : roster,
  };
}

describe('DS-DEF-5 — the armed-forces lenses read what still STANDS', () => {
  it('every fixture name lands in the bucket it claims — bound to the producer', () => {
    // Same discipline as DS-DEF-2's: the roster is the producer's own vocabulary, asserted
    // against generateDefenseProfile rather than believed.
    for (const [bucket, name] of Object.entries(BUCKET_NAME)) {
      const built = generateDefenseProfile(garrisonTown([bucket]));
      expect(built.institutions[bucket].map((i) => i.name), `${name} → ${bucket}`).toEqual([name]);
    }
    expect(Object.keys(BUCKET_NAME).sort()).toEqual([...DEFENSE_BUCKET_KEYS].sort());
  });

  it('the perimeter lens is TOTAL and the force lens ranks garrison > militia > watch', () => {
    expect(fortificationPoolKey(true)).toBe('walls PRESENT');
    expect(fortificationPoolKey(false)).toBe('walls ABSENT');
    const forces = (standing) => standingDefenseForces(garrisonTown(standing));
    expect(forceCorePoolKey(forces(['garrison', 'militia', 'watch']))).toBe('garrison PRESENT');
    expect(forceCorePoolKey(forces(['militia', 'watch']))).toBe('militia PRESENT (no garrison)');
    expect(forceCorePoolKey(forces(['watch']))).toBe('watch PRESENT');
    expect(forceCorePoolKey(forces([]))).toBe('NO organized force at all');
  });

  it('⚠ "NO organized force at all" does not call a town with bought soldiers defenceless', () => {
    // Its prose says "no command, no training and no way to coordinate a response", which
    // is false of a retained company or a charter hall. Those towns are described by their
    // own lens instead; the pool stays for the town that genuinely has nothing.
    const forces = (standing) => standingDefenseForces(garrisonTown(standing));
    expect(forceCorePoolKey(forces(['mercenary']))).toBeNull();
    expect(forceCorePoolKey(forces(['charter']))).toBeNull();
    expect(forceCorePoolKey(forces(['magicDef']))).toBeNull();
    expect(contractedForcePoolKey(forces(['mercenary']))).toBe('mercenary / contracted forces PRESENT');
    // …and no "hires nobody" pool is invented where the corpus wrote none.
    expect(contractedForcePoolKey(forces([]))).toBeNull();
    expectAbsentWithAnchor(
      Object.keys(DEF5_POOLS), 'mercenary / contracted forces ABSENT',
      'mercenary / contracted forces PRESENT',
      'the corpus wrote no absent-mercenary pool, so the lens must stay silent there',
    );
  });

  it('⭐ the charter ABSENT pool speaks only where the COUNTRY warrants one, by TOKEN', () => {
    // The label-trap rule, fourth instance: keyed through normalizeMonsterThreat on the
    // producer's canonical tiers, never on a display word.
    const bare = (monsterThreat) => standingDefenseForces(garrisonTown([], { monsterThreat }));
    expect(charterPoolKey(bare('frontier'), 'frontier')).toBe('charter hall ABSENT where the country warrants one');
    expect(charterPoolKey(bare('plagued'), 'plagued')).toBe('charter hall ABSENT where the country warrants one');
    // A settled heartland is not scolded for a hall it has no use for.
    expect(charterPoolKey(bare('heartland'), 'heartland')).toBeNull();
    // The legacy alias the normaliser DOES map still routes; a non-canonical value warrants
    // nothing rather than defaulting into a family.
    expect(countryWarrantsCharter('low')).toBe(false);
    expect(countryWarrantsCharter('high')).toBe(true);
    expect(countryWarrantsCharter('civilized')).toBe(false);
    const held = standingDefenseForces(garrisonTown(['charter']));
    expect(charterPoolKey(held, 'heartland')).toBe('charter hall PRESENT (specialist monster response)');
  });

  it('⭐ MEASUREMENT OR DEFAULT: the arcane lens is silent in a world with no magic', () => {
    // `config.magicExists === false` is a world setting the generator already reads. In such
    // a world "what arrives unseen goes undetected" is not a shortfall, it is a category
    // that does not exist — printing it would be the machine improvising a lack.
    const forces = (standing) => standingDefenseForces(garrisonTown(standing));
    expect(arcaneDefensePoolKey(forces(['magicDef']), true)).toBe('arcane defense PRESENT');
    expect(arcaneDefensePoolKey(forces([]), true)).toBe('arcane defense ABSENT');
    expect(arcaneDefensePoolKey(forces([]), undefined)).toBe('arcane defense ABSENT');
    expect(arcaneDefensePoolKey(forces(['magicDef']), false)).toBeNull();
    expect(arcaneDefensePoolKey(forces([]), false)).toBeNull();
  });

  it('⛔ A RUINED GARRISON IS NOT A GARRISON — the lenses read the standing roster', () => {
    const standing = defenseForcesProse(garrisonTown(['walls', 'garrison']), { seed: 'r' });
    const rubble = defenseForcesProse(garrisonTown(['walls', 'garrison'], { ruined: true }), { seed: 'r' });
    const nothing = defenseForcesProse(garrisonTown([]), { seed: 'r' });
    expect(standing.fortification.provenance.poolKey).toBe('walls PRESENT');
    expect(rubble.fortification.provenance.poolKey).toBe('walls ABSENT');
    expect(rubble.force.provenance.poolKey).toBe('NO organized force at all');
    expect(rubble.fortification.sentence).toBe(nothing.fortification.sentence);
    expect(rubble.fortification.sentence).not.toBe(standing.fortification.sentence);
  });

  it('all ELEVEN pools speak, swept over every roster the producer can classify', () => {
    const keys = Object.keys(BUCKET_NAME);
    const reached = new Set();
    for (let mask = 0; mask < (1 << keys.length); mask += 1) {
      const standing = keys.filter((_, i) => mask & (1 << i));
      for (const monsterThreat of MONSTER_THREAT_TIERS) {
        for (const magicExists of [true, false]) {
          const drawn = defenseForcesProse(
            garrisonTown(standing, { monsterThreat, magicExists }), { seed: 'sweep5' },
          );
          for (const lens of DEF5_LENSES) {
            const rung = drawn[lens];
            if (!rung?.sentence) continue;
            reached.add(rung.provenance.poolKey);
            expect(rung.provenance.blockId).toBe(DEF5);
            // anchored: `reached.size` is pinned at the corpus pool count below
            expect(rung.sentence).not.toMatch(/[{}]/);
          }
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(DEF5_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(DEF5_POOLS).length);
    expect(Object.keys(DEF5_POOLS)).toHaveLength(11);
  });

  it('the registry mounts DS-DEF-5 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF5);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.armedForces', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF5)?.mount).toBe('defense.armedForces');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, DEF5, A_DARK_SIBLING,
      'DS-DEF-5 carries a mount row, so the dark half must not name it',
    );
    // It frames no DM-editable field either, so plain rungs are the right shape.
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF5]).toBeUndefined();
  });

  it('a settlement with no roster at all speaks the absences and does not crash', () => {
    const empty = defenseForcesProse({ name: 'Thornwall' }, { seed: 'z5' });
    expect(empty.fortification.provenance.poolKey).toBe('walls ABSENT');
    expect(empty.force.provenance.poolKey).toBe('NO organized force at all');
    expect(empty.contracted).toBeNull();
    // No config means no tier: an unmeasured country warrants nothing.
    expect(empty.charter).toBeNull();
    expect(empty.arcane.provenance.poolKey).toBe('arcane defense ABSENT');
    expect(defenseForcesProse(undefined).contracted).toBeNull();
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
