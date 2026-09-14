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
  terrainDefencePoolKey, activeDefenceStress, defenseMilitaryStatusProse,
  militaryOverridePoolKey, viabilityUnderStressPoolKey, DEF8_UNREACHABLE_POOLS,
  defenseWallRationaleProse, defworkFill, wallRationalePoolKey,
  criminalCapturePoolKey, criminalStructurePoolKey, defenseCriminalProse,
  CRIMINAL_CAPTURE_STATES, RECOGNISED_CRIMINAL_STRUCTURES,
  TERRAIN_DEFENCE_NAMES, TERRAIN_PRIZE_NAMES,
  DEF6_C3_BLOCKED_POOLS, DEF6_FACT_SPOKEN_AT, defenseSupportingProse,
  navalDefensePoolKey, supplyLogisticsPoolKey,
  DEF7_DARK_POOLS, DEF10_DARK_POOLS, DEF10_FACT_SPOKEN_AT,
  defenseMagicDependencyProse, hasNamedMagicChain, magicDependencyPoolKey,
  namedMagicChainGood,
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
import { DEFENSE_STRESS_STATUS, deriveCriminalStructure, deriveGuardAssessment, deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { codeOnly } from '../helpers/codeOnlySource.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { SMALL_TIERS, TIER_ORDER, TOWN_PLUS_TIERS } from '../../src/data/constants.js';
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

/** DS-DEF-4 — criminal structure and capture consequence. */
const DEF4 = 'DS-DEF-4';
const DEF4_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF4].pools;
/** The two capture pools the kernel's covertness gate keeps off a player's dossier. */
const DEF4_DM_ONLY = ['capture corrupted', 'capture capture'];

/**
 * Does `rulingStructure` really persist the seat's generated name under `government`? Read
 * from its source rather than believed — the fill would silently vanish if it were renamed.
 * @returns {boolean}
 */
function rulingStructureNamesTheSeat() {
  const src = readFileSync(
    resolve(import.meta.dirname, '../../src/generators/power/rulingStructure.js'), 'utf8',
  );
  return src.includes('government: (factions.find((f) => f.isGoverning) || {}).faction || null,');
}

/** A settlement with a named seat and a capture state. */
function underworld({ government = 'Town Council', criminalCaptureState = 'none' } = {}) {
  return {
    name: 'Thornwall', _seed: 'seed-def4',
    powerStructure: { government, criminalCaptureState },
  };
}

describe('DS-DEF-4 — two vocabularies that are EXACT 1:1s, and a covertness gate', () => {
  it('⭐ both producer vocabularies map onto the corpus pools, both ways', () => {
    // The label-trap rule applied twice more. `computeCriminalCaptureState` is typed
    // 'none'|'adversarial'|'equilibrium'|'corrupted'|'capture' and the corpus wrote exactly
    // those five; `deriveCriminalStructure` returns organized|semi-organized|diffuse or null
    // and the corpus wrote exactly those four including the null reading.
    const capturePools = Object.keys(DEF4_POOLS).filter((k) => k.startsWith('capture '));
    expect([...capturePools].sort())
      .toEqual([...CRIMINAL_CAPTURE_STATES].map((s2) => `capture ${s2}`).sort());
    for (const state of CRIMINAL_CAPTURE_STATES) {
      expect(criminalCapturePoolKey(state)).toBe(`capture ${state}`);
    }
    const structurePools = Object.keys(DEF4_POOLS).filter((k) => k.startsWith('structure '));
    expect(structurePools).toHaveLength(RECOGNISED_CRIMINAL_STRUCTURES.length + 1);
    for (const key of RECOGNISED_CRIMINAL_STRUCTURES) {
      expect(criminalStructurePoolKey(key)).toBe(`structure ${key}`);
      expect(DEF4_POOLS[`structure ${key}`], `corpus has no pool for ${key}`).toBeTruthy();
    }
    // …and the producer really does emit those keys, asked of the producer.
    const built = deriveCriminalStructure({ economicState: { safetyProfile: { criminalInstitutions: [] } } });
    expect(built === null || RECOGNISED_CRIMINAL_STRUCTURES.includes(built.key)).toBe(true);
  });

  it('⚠ AN ABSENT CAPTURE STATE IS NOT `none` — the tab\'s `|| \'none\'` is for a colour', () => {
    // "Nothing criminal has reached the hall" is a claim, and a settlement with no power
    // structure has not been measured for it. A colour may default; a sentence may not.
    expect(criminalCapturePoolKey(undefined)).toBeNull();
    expect(criminalCapturePoolKey('')).toBeNull();
    expect(criminalCapturePoolKey('bogus')).toBeNull();
    expect(defenseCriminalProse({ name: 'Thornwall' }, 'organized', { seed: 'a', audience: 'dm' }).capture).toBeNull();
    // The structure lens is the opposite case: producer `null` IS the fourth reading.
    expect(criminalStructurePoolKey(null)).toBe('structure null (nothing organized recognized)');
    expect(criminalStructurePoolKey('bogus')).toBeNull();
  });

  it('⛔⛔ THE COVERTNESS GATE IS LIVE: a player is not told the hall has been bought', () => {
    // Measured, and it is the reason a first sweep of this block reached only 7 of 9 pools:
    // `capture corrupted` and `capture capture` are DM-ONLY, so the `audience` this desk is
    // handed is load-bearing here in a way it is not for the leaf's other blocks.
    for (const state of ['corrupted', 'capture']) {
      const dm = defenseCriminalProse(underworld({ criminalCaptureState: state }), 'organized', { seed: 'c', audience: 'dm' });
      const player = defenseCriminalProse(underworld({ criminalCaptureState: state }), 'organized', { seed: 'c', audience: 'player' });
      expect(dm.capture.provenance.poolKey, state).toBe(`capture ${state}`);
      // ⚠ THE REFUSED SHAPE IS INERT, not a false trail. A pool the gate refuses still
      // yields a rung — the desk asked for a key that exists — but `legibilityRung` with no
      // line gives `{glance:'', sentence:null, detail:[], provenance:null}`: nothing to
      // print and, crucially, NO PROVENANCE, so no surface can carry the trail of a
      // sentence it did not draw. The component's `.filter(Boolean)` drops it.
      expect(player.capture.sentence, `${state} reached a player dossier`).toBeNull();
      expect(player.capture.provenance, `${state} left a trail for a line nobody printed`).toBeNull();
      expect(player.capture.glance).toBe('');
      expect(player.capture.detail).toEqual([]);
    }
    // The open states are shown to both, so the gate is a gate and not a dead arm.
    for (const state of ['none', 'adversarial', 'equilibrium']) {
      const player = defenseCriminalProse(underworld({ criminalCaptureState: state }), 'diffuse', { seed: 'c', audience: 'player' });
      expect(player.capture?.provenance.poolKey, state).toBe(`capture ${state}`);
    }
    expect(DEF4_DM_ONLY.every((k) => DEF4_POOLS[k])).toBe(true);
  });

  it('⚠ `{seat}` is the seat\'s OWN generated name, and a missing one drops the variant', () => {
    // The annex bans a baked noun in terms: "prose that hard-codes *the council* is wrong on
    // most settlements in the realm". One of the three variants in each capture pool names
    // the slot; the other two say "the hall" in their own words, so the pool degrades.
    expect(SLOT_FILL_SHAPES.seat).toBe('proper');
    expect(SHAPES.shapeOf('seat')).toBe('proper');
    // ⚠ THE ANCHOR IS A FILLED SLOT, WHICH IS THE MECHANISM UNDER TEST. "No brace survived"
    // is true of a sentence that was never drawn, so each negative is paired with a fill that
    // travels the SAME kernel path: the seat's own generated name where one exists, and the
    // settlement name — `{settlement}`, filled in every variant — where the seat is missing
    // and the naming variant is the one that drops. If the fill pipeline broke, the anchor is
    // absent BEFORE the brace question is asked.
    const named = defenseCriminalProse(underworld({ government: 'Grand Merchant Oligarchy', criminalCaptureState: 'capture' }), null, { seed: 'seat-a', audience: 'dm' });
    expectAbsentWithAnchor(named.capture.sentence, '{', 'Grand Merchant Oligarchy', 'named seat: open brace');
    expectAbsentWithAnchor(named.capture.sentence, '}', 'Grand Merchant Oligarchy', 'named seat: close brace');
    const unnamed = defenseCriminalProse(underworld({ government: undefined, criminalCaptureState: 'capture' }), null, { seed: 'seat-a', audience: 'dm' });
    expectAbsentWithAnchor(unnamed.capture?.sentence ?? '', '{', 'Thornwall', 'unnamed seat: open brace');
    expectAbsentWithAnchor(unnamed.capture?.sentence ?? '', '}', 'Thornwall', 'unnamed seat: close brace');
    // The generator's own field is where the name comes from.
    expect(rulingStructureNamesTheSeat()).toBe(true);
  });

  it('all NINE pools speak to a DM, over every structure key × every capture state', () => {
    const reached = new Set();
    for (const structureKey of [...RECOGNISED_CRIMINAL_STRUCTURES, null, 'bogus']) {
      for (const state of [...CRIMINAL_CAPTURE_STATES, undefined, 'bogus']) {
        for (const government of ['Town Council', undefined]) {
          const drawn = defenseCriminalProse(
            underworld({ government, criminalCaptureState: state }), structureKey,
            { seed: 'sweep4', audience: 'dm' },
          );
          for (const lens of ['structure', 'capture']) {
            const rung = drawn[lens];
            if (!rung?.sentence) continue;
            reached.add(rung.provenance.poolKey);
            expect(rung.provenance.blockId).toBe(DEF4);
            // anchored: `reached.size` is pinned at the corpus pool count below
            expect(rung.sentence).not.toMatch(/[{}]/);
          }
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(DEF4_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(DEF4_POOLS).length);
    expect(Object.keys(DEF4_POOLS)).toHaveLength(9);
  });

  it('the registry mounts DS-DEF-4 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF4);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.criminalStructure', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF4)?.mount).toBe('defense.criminalStructure');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, DEF4, A_DARK_SIBLING,
      'DS-DEF-4 carries a mount row, so the dark half must not name it',
    );
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF4]).toBeUndefined();
  });
});

/** DS-DEF-11 — why the wall, and why not. */
const DEF11 = 'DS-DEF-11';
const DEF11_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF11].pools;

/** A settlement with a named wall (or none), a country, a tier and an upkeep gate. */
function circuit({ wall = null, monsterThreat = 'frontier', tier = 'town', military } = {}) {
  return {
    name: 'Thornwall', _seed: 'seed-def11', tier,
    institutions: wall ? [{ name: wall }] : [],
    config: { monsterThreat },
    defenseProfile: { economicGates: military === undefined ? {} : { military } },
  };
}

describe('DS-DEF-11 — the wall rationale, and the slot that refuses a name', () => {
  it('⭐ the small/large cut is the ESTATE\'S OWN partition, not an invented one', () => {
    // SMALL_TIERS and TOWN_PLUS_TIERS are an EXACT closed partition of TIER_ORDER, so the
    // unwalled split is measured. Both directions, so a tier added to one and not the other
    // reds here instead of falling silently into neither pool.
    expect([...SMALL_TIERS, ...TOWN_PLUS_TIERS].sort()).toEqual([...TIER_ORDER].sort());
    expect(SMALL_TIERS.filter((t) => TOWN_PLUS_TIERS.includes(t))).toEqual([]);
    for (const tier of SMALL_TIERS) {
      expect(wallRationalePoolKey(false, 'frontier', undefined, tier), tier).toBe('UNWALLED-SMALL');
    }
    for (const tier of TOWN_PLUS_TIERS) {
      expect(wallRationalePoolKey(false, 'frontier', undefined, tier), tier).toBe('UNWALLED-LARGE');
    }
    // A tier in neither is silence, not a guess about which side of the line it sits on.
    expect(wallRationalePoolKey(false, 'frontier', undefined, 'bogus')).toBeNull();
    expect(wallRationalePoolKey(false, 'frontier', undefined, undefined)).toBeNull();
  });

  it('the walled branch ranks STRAINED over THREATENED over QUIET', () => {
    // JUDGMENT, recorded in the desk: a frontier town whose muster is underfunded satisfies
    // both of the first two, and STRAINED is the more specific and the more urgent.
    expect(wallRationalePoolKey(true, 'frontier', 0.6, 'town')).toBe('WALLED-STRAINED');
    expect(wallRationalePoolKey(true, 'heartland', 0.6, 'town')).toBe('WALLED-STRAINED');
    expect(wallRationalePoolKey(true, 'frontier', 1, 'town')).toBe('WALLED-THREATENED');
    expect(wallRationalePoolKey(true, 'plagued', undefined, 'town')).toBe('WALLED-THREATENED');
    expect(wallRationalePoolKey(true, 'heartland', 1, 'town')).toBe('WALLED-QUIET');
    // A gate at or above 1 is funded, not strained; a non-numeric gate is not a reading.
    expect(wallRationalePoolKey(true, 'heartland', 1.4, 'town')).toBe('WALLED-QUIET');
    expect(wallRationalePoolKey(true, 'heartland', '0.6', 'town')).toBe('WALLED-QUIET');
    // …and an unmeasured country leaves the walled branch silent rather than guessing.
    expect(wallRationalePoolKey(true, undefined, undefined, 'town')).toBeNull();
  });

  it('⛔ `{defwork}` is the town\'s RECORDED wall name, and a name outside the vocabulary is REFUSED', () => {
    // The annex: "the roster row matched (wall · citadel · palisade · earthwork); NEVER a
    // baked or invented noun". `bare-common` forbids a determiner and needs a lowercase
    // initial, so a Capitalised catalogue row lowercases — safe for a common noun and
    // DESTRUCTIVE for a proper one, which is why anything outside the vocabulary is refused
    // and the kernel drops the variants that need the slot.
    const fill = (name) => defworkFill(standingDefenseForces({ institutions: [{ name }] }));
    expect(fill('Massive Walls')).toBe('massive walls');
    expect(fill('Inner Citadel')).toBe('inner citadel');
    expect(fill('Palisade')).toBe('palisade');
    expect(fill('Earthworks')).toBe('earthworks');
    expect(fill('Vaelthorn Bastion')).toBeUndefined();
    expect(fill('The Old Wall')).toBeUndefined();
    expect(defworkFill(standingDefenseForces({ institutions: [] }))).toBeUndefined();
    // The declared shape is the annex register's, and the desk still owns no fill TABLE —
    // the fill comes off the roster, so there is no literal map to drift.
    expect(SLOT_FILL_SHAPES.defwork).toBe('bare-common');
    expect(SHAPES.shapeOf('defwork')).toBe('bare-common');
    expect(SLOT_FILL_TABLES).toEqual({});
  });

  it('⛔ A RUINED WALL IS DESCRIBED AS AN ABSENCE, not asked why the town keeps it', () => {
    const standing = defenseWallRationaleProse(circuit({ wall: 'Massive Walls', tier: 'city' }), { seed: 'w' });
    const rubble = defenseWallRationaleProse({
      ...circuit({ wall: 'Massive Walls', tier: 'city' }),
      institutions: [{ name: 'Massive Walls', status: 'ruined', _worldPulseInactive: true }],
    }, { seed: 'w' });
    expect(standing.rationale.provenance.poolKey).toBe('WALLED-THREATENED');
    expect(rubble.rationale.provenance.poolKey).toBe('UNWALLED-LARGE');
  });

  it('all FIVE pools speak, with no unfilled slot anywhere in the sweep', () => {
    const reached = new Set();
    for (const wall of ['Massive Walls', 'Inner Citadel', 'Palisade', 'Earthworks', 'Vaelthorn Bastion', null]) {
      for (const monsterThreat of [...MONSTER_THREAT_TIERS, undefined]) {
        for (const military of [0.6, 1, undefined]) {
          for (const tier of [...TIER_ORDER, 'bogus']) {
            const drawn = defenseWallRationaleProse(
              circuit({ wall, monsterThreat, tier, military }), { seed: 'sweep11' },
            );
            const rung = drawn.rationale;
            if (!rung?.sentence) continue;
            reached.add(rung.provenance.poolKey);
            expect(rung.provenance.blockId).toBe(DEF11);
            // anchored: `reached.size` is pinned at the corpus pool count below
            expect(rung.sentence).not.toMatch(/[{}]/);
          }
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(DEF11_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(DEF11_POOLS).length);
    expect(Object.keys(DEF11_POOLS)).toHaveLength(5);
  });

  it('the registry mounts DS-DEF-11 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF11);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.wallRationale', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF11)?.mount).toBe('defense.wallRationale');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, DEF11, A_DARK_SIBLING,
      'DS-DEF-11 carries a mount row, so the dark half must not name it',
    );
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF11]).toBeUndefined();
  });
});

/** DS-DEF-8 — the active-military-status banner. */
const DEF8 = 'DS-DEF-8';
const DEF8_POOLS = DOSSIER_STATE_PROSE_DEFENSE[DEF8].pools;

/** A settlement under the named stresses. @param {string[]} types */
function pressed(types, { viable } = {}) {
  return {
    name: 'Thornwall', _seed: 'seed-def8',
    stress: types.map((type) => ({ type, ...STRESS_TYPE_MAP[type] })),
    ...(viable === undefined ? {} : { economicViability: { viable } }),
  };
}

describe('DS-DEF-8 — the military-status override, and the pool that must NOT speak', () => {
  it('the override lens asks the SAME map the banner beside it asks', () => {
    // Not a second opinion about which stresses carry a posture: `DefenseTab` picks
    // `stressTypes.find((t) => DEFENSE_STRESS_STATUS[t])` and so does this desk.
    for (const type of Object.keys(DEFENSE_STRESS_STATUS)) {
      expect(militaryOverridePoolKey(pressed([type]).stress), type)
        .toBe('override active (generic framing)');
      expect(activeDefenceStress(pressed([type]).stress).type).toBe(type);
    }
    // A stress with no defence posture leaves the banner — and this desk — silent.
    expect(DEFENSE_STRESS_STATUS.no_such_stress).toBeUndefined();
    expect(militaryOverridePoolKey([{ type: 'no_such_stress' }])).toBeNull();
    expect(militaryOverridePoolKey([])).toBeNull();
    expect(militaryOverridePoolKey(undefined)).toBeNull();
    // The field is a bare object on some saves; both shapes normalise.
    expect(militaryOverridePoolKey({ type: 'under_siege' })).toBe('override active (generic framing)');
  });

  it('⛔⛔ `viabilityNote` IS A CONSTANT — every one of the fifteen carries one', () => {
    // The block's title names `stress.viabilityNote`, and splitting on its presence is the
    // trap: it is present on ALL fifteen stress types, so `threatened` would fire for every
    // settlement and `intact` would be unreachable. A default wearing a reading's clothes,
    // and an unusually convincing one because the field is named for the question.
    const withNote = Object.keys(STRESS_TYPE_MAP)
      .filter((t) => typeof STRESS_TYPE_MAP[t].viabilityNote === 'string' && STRESS_TYPE_MAP[t].viabilityNote);
    expect(withNote).toHaveLength(Object.keys(STRESS_TYPE_MAP).length);
    expect(Object.keys(STRESS_TYPE_MAP)).toHaveLength(15);
    // The desk therefore reads the MEASURED verdict instead, and is silent without one.
    expect(viabilityUnderStressPoolKey(pressed(['famine']).stress, false)).toBe('override active, viability threatened');
    expect(viabilityUnderStressPoolKey(pressed(['famine']).stress, true)).toBe('override active, viability intact');
    expect(viabilityUnderStressPoolKey(pressed(['famine']).stress, undefined)).toBeNull();
    // …and it says nothing at all when no override is on, whatever the verdict.
    expect(viabilityUnderStressPoolKey([], false)).toBeNull();
    expect(viabilityUnderStressPoolKey([], true)).toBeNull();
  });

  it('⛔⛔ ONE POOL IS DECLARED DARK, and this arm is the pin on that declaration', () => {
    // `multiple stresses, one posture shown` claims in all three variants that the posture
    // named is "the heaviest"/"the loudest" of several. MEASURED: STRESS_TYPE_MAP carries
    // `probability` (rarity) and NO severity, and the banner picks the FIRST stress that
    // maps — roll order, not rank. Printing it would assert a ranking nothing computes.
    expect(DEF8_UNREACHABLE_POOLS).toEqual(['multiple stresses, one posture shown']);
    expect(DEF8_POOLS[DEF8_UNREACHABLE_POOLS[0]], 'the declared-dark pool left the corpus').toBeTruthy();
    for (const type of Object.keys(STRESS_TYPE_MAP)) {
      // ⚠ `probability` IS THE ANCHOR BECAUSE IT IS THE ARGUMENT. The claim above is not
      // "severity is absent" but "the entry carries RARITY and no rank", so a key set that
      // still holds `probability` proves the map is live and correctly keyed — and severity's
      // absence from THAT set is a measurement. Bare, this negative would read identically
      // against a STRESS_TYPE_MAP that had been emptied or re-shaped out from under it.
      expectAbsentWithAnchor(
        Object.keys(STRESS_TYPE_MAP[type]), 'severity', 'probability',
        `${type} gained a severity field`,
      );
    }
    // The claim it would make is false of the pick the banner actually performs: with two
    // stresses the FIRST is shown, whatever its weight.
    const both = pressed(['mass_migration', 'under_siege']);
    expect(activeDefenceStress(both.stress).type).toBe('mass_migration');
    // And a multi-stress settlement is still described — by the two live lenses.
    const drawn = defenseMilitaryStatusProse({ ...both, economicViability: { viable: false } }, { seed: 'm' });
    expect(drawn.override.provenance.poolKey).toBe('override active (generic framing)');
    expect(drawn.viability.provenance.poolKey).toBe('override active, viability threatened');
  });

  it('all THREE live pools speak over every stress type × the viability verdict', () => {
    const reached = new Set();
    for (const type of [...Object.keys(STRESS_TYPE_MAP), 'no_such_stress']) {
      for (const viable of [true, false, undefined]) {
        const drawn = defenseMilitaryStatusProse(pressed([type], { viable }), { seed: 'sweep8' });
        for (const lens of ['override', 'viability']) {
          const rung = drawn[lens];
          if (!rung?.sentence) continue;
          reached.add(rung.provenance.poolKey);
          expect(rung.provenance.blockId).toBe(DEF8);
          // anchored: `reached` is pinned against the corpus pool set below
          expect(rung.sentence).not.toMatch(/[{}]/);
        }
      }
    }
    const live = Object.keys(DEF8_POOLS).filter((k) => !DEF8_UNREACHABLE_POOLS.includes(k));
    expect([...reached].sort()).toEqual([...live].sort());
    expect(Object.keys(DEF8_POOLS)).toHaveLength(4);
    expect(live).toHaveLength(3);
  });

  it('the registry mounts DS-DEF-8 once, as a sentence, on the defense tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === DEF8);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'defense.militaryStatus', tab: 'defense', desk: 'defense', rung: 'sentence' });
    expect(sentenceMountForBlock(DEF8)?.mount).toBe('defense.militaryStatus');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, DEF8, A_DARK_SIBLING,
      'DS-DEF-8 carries a mount row, so the dark half must not name it',
    );
    expect(DM_FIELD_FRAMED_BY_BLOCK[DEF8]).toBeUndefined();
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

/**
 * ── DS-DEF-6 · SUPPORTING CAPABILITIES ──────────────────────────────────────────────
 *
 * The fixtures below are DERIVED FROM GENERATED SETTLEMENTS rather than hand-shaped, because
 * this block's whole risk is a desk that agrees with its own expectations and disagrees with
 * the producer six pixels away on the screen. Every pool-key claim is checked against
 * `deriveSupportingCapabilities`'s own `status`/`note` on the same settlement.
 */
const DEF6_POOLS = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-6'].pools;

/** Four generated worlds chosen to reach four of the five logistics branches. */
const WORLDS = [
  ['village-road', { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' }, 'seed-A'],
  ['metro-port', { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' }, 'seed-B'],
  ['city-isolated', { settType: 'city', culture: 'norse', terrain: 'mountain', tradeRouteAccess: 'isolated' }, 'seed-C'],
  ['town-road', { settType: 'town', culture: 'celtic', terrain: 'forest', tradeRouteAccess: 'road', monsterThreat: 'plagued' }, 'seed-D'],
].map(([label, config, seed]) => ({
  label, settlement: generateSettlementPipeline(config, null, { seed, customContent: {} }),
}));

describe('DS-DEF-6 — the two lenses that may speak, bound to their producer', () => {
  it('the logistics key is TOTAL over the corpus five, and mirrors the producer branch for branch', () => {
    // Both directions. Every key the desk can emit is a pool; every `Logistics & Supply`
    // pool is reachable from some (granary, port, access) triple the producer can present.
    const emitted = new Set();
    for (const granary of [true, false]) {
      for (const port of [true, false]) {
        for (const access of ['road', 'port', 'isolated', 'river']) {
          const key = supplyLogisticsPoolKey(granary, port, access);
          expect(DEF6_POOLS[key], `desk emitted a key the corpus has no pool for: ${key}`).toBeTruthy();
          emitted.add(key);
        }
      }
    }
    const corpusKeys = Object.keys(DEF6_POOLS).filter((k) => k.startsWith('Logistics & Supply: '));
    expect([...emitted].sort()).toEqual([...corpusKeys].sort());
    expect(corpusKeys).toHaveLength(5);
  });

  it('AN ABSENT TRADE ACCESS IS SILENCE, and the producer default is the thing declined', () => {
    // The producer reads `r.config?.tradeRouteAccess || 'road'`, so an unmeasured approach
    // becomes a road. Routing that through the desk would let the page tell a settlement
    // whose approaches nobody recorded that cutting its roads cuts its supply.
    expect(supplyLogisticsPoolKey(true, false, undefined)).toBeNull();
    expect(supplyLogisticsPoolKey(true, false, '')).toBeNull();
    expect(supplyLogisticsPoolKey(false, false, null)).toBeNull();
    // ANCHOR: the same call with the value PRESENT does route, so the nulls above are the
    // presence check discriminating rather than the function having stopped working.
    expect(supplyLogisticsPoolKey(true, false, 'road')).toBe('Logistics & Supply: Granary with road supply');
    // …and no GENERATED settlement is ever silent here: resolveConfig writes the field.
    for (const { label, settlement } of WORLDS) {
      expect(typeof settlement.config?.tradeRouteAccess, `${label} carries no tradeRouteAccess`).toBe('string');
    }
  });

  it('the naval key is TOTAL, silent without water, and lets the LIVE blockade outrank', () => {
    expect(navalDefensePoolKey(false, false, false)).toBeNull();
    expect(navalDefensePoolKey(false, false, true)).toBeNull();
    expect(navalDefensePoolKey(true, false, false)).toBe('Naval Defense: Naval force');
    expect(navalDefensePoolKey(false, true, false)).toBe('Naval Defense: Port only');
    expect(navalDefensePoolKey(true, true, false)).toBe('Naval Defense: Naval force');
    expect(navalDefensePoolKey(true, true, true)).toBe('Naval Defense: Under blockade');
    expect(navalDefensePoolKey(false, true, true)).toBe('Naval Defense: Under blockade');
    const corpusKeys = Object.keys(DEF6_POOLS).filter((k) => k.startsWith('Naval Defense: '));
    expect(corpusKeys).toHaveLength(3);
    for (const key of corpusKeys) expect(DEF6_POOLS[key].length).toBeGreaterThan(0);
  });

  it('THE MIRROR HOLDS ON GENERATED WORLDS: the desk key and the producer row agree', () => {
    // The arm that would have caught a desk describing one supply posture beside a note
    // describing another. The producer's own asymmetry (institution `hasPort` on the granary
    // side, config `=== 'port'` on the other) is what makes this worth executing rather
    // than reasoning about.
    const seenLogistics = new Set();
    for (const { label, settlement } of WORLDS) {
      const caps = deriveSupportingCapabilities(settlement);
      const inst = settlement.economicState?.compound?.inst || {};
      const key = supplyLogisticsPoolKey(
        inst.hasGranary === true, inst.hasPort === true, settlement.config?.tradeRouteAccess,
      );
      seenLogistics.add(key);
      const note = caps.find((c) => c.label === 'Logistics & Supply')?.note || '';
      // The corpus suffix and the producer's note are two spellings of one branch; the
      // branch identity is what is asserted, via the producer's own status + note pairing.
      const granaryNote = /^Granary/.test(note);
      expect(granaryNote, `${label}: producer note ${JSON.stringify(note)} vs key ${key}`)
        .toBe(key.includes(': Granary'));
      if (key === 'Logistics & Supply: Granary + port') expect(note).toContain('sea access');
      if (key === 'Logistics & Supply: Granary in isolation') expect(note).toContain('isolation');
      if (key === 'Logistics & Supply: Granary with road supply') expect(note).toContain('road supply');
      if (key === 'Logistics & Supply: No reserves, port open') expect(note).toContain('sea supply');
      if (key === 'Logistics & Supply: No reserves, landlocked') expect(note).toContain('No food buffer');
      // The naval row exists exactly when the desk has a naval key, both ways.
      const navalRow = caps.find((c) => c.label === 'Naval Defense') || null;
      const navalKey = navalDefensePoolKey(inst.hasNavy === true, inst.hasPort === true, false);
      expect(Boolean(navalRow), `${label}: naval row presence`).toBe(navalKey !== null);
      if (navalRow) expect(navalKey).toBe(`Naval Defense: ${navalRow.status}`);
    }
    // Non-vacuity: the four worlds must have reached more than one logistics branch, or the
    // agreement above is one branch asserted four times.
    expect(seenLogistics.size).toBeGreaterThan(2);
  });

  it('the desk RENDERS on every generated world, and the sentence carries no slot marker', () => {
    for (const { label, settlement } of WORLDS) {
      const drawn = defenseSupportingProse(settlement, { seed: 'def6', audience: 'dm' });
      expect(drawn.logistics, `${label} drew no logistics rung`).toBeTruthy();
      expect(typeof drawn.logistics.sentence, `${label} logistics sentence`).toBe('string');
      expect(drawn.logistics.sentence.length, `${label} drew an empty line`).toBeGreaterThan(40);
      // anchored: the length arm on the line above proves the subject is a real rendered
      expect(drawn.logistics.sentence).not.toContain('{'); // sentence and not an empty string
      expect(drawn.logistics.provenance.blockId).toBe('DS-DEF-6');
      if (drawn.naval) {
        expect(drawn.naval.sentence.length, `${label} drew an empty naval line`).toBeGreaterThan(40);
        // anchored: the length arm on the line above proves the subject is a real sentence
        expect(drawn.naval.sentence).not.toContain('{');
        expect(drawn.naval.provenance.blockId).toBe('DS-DEF-6');
      }
    }
  });

  it('THE BLOCKADE POOL ROUTES — dormant at generation, live in a pulsed world', () => {
    // `stockpile.blockaded` is written by worldPulse/foodStockpile.js and NEVER at
    // generation, so a corpus census over generated worlds would call this pool dead. It is
    // not dead; it is dormant. The fixture carries the field in the SHAPE that writer emits.
    const port = WORLDS.find((w) => w.label === 'metro-port').settlement;
    expect(port.economicState?.foodSecurity?.stockpile ?? null, 'generation now writes a stockpile').toBeNull();
    const pulsed = {
      ...port,
      economicState: {
        ...port.economicState,
        foodSecurity: {
          ...port.economicState.foodSecurity,
          stockpile: { blockaded: true, blockadeBypass: 'teleport', famished: false, lastTick: 12 },
        },
      },
    };
    const drawn = defenseSupportingProse(pulsed, { seed: 'blk', audience: 'dm' });
    expect(drawn.naval.provenance.poolKey).toBe('Naval Defense: Under blockade');
    // ⚠ A stockpile that says nothing about a blockade is NOT a blockade: the strict read.
    const quiet = { ...pulsed,
      economicState: { ...pulsed.economicState,
        foodSecurity: { ...pulsed.economicState.foodSecurity, stockpile: { lastTick: 12 } } } };
    expect(defenseSupportingProse(quiet, { seed: 'blk' }).naval.provenance.poolKey)
      .toBe('Naval Defense: Port only');
  });

  it('THE COVERTNESS GATE holds on the blockade pool — the player is not told about the channel', () => {
    // One variant of `Under blockade` is dm-only: it discloses that a magical channel is
    // still running the line. A player-facing dossier must be byte-identical to one over a
    // town with no such channel, so the variant must be UNREACHABLE at the player audience.
    const covert = DEF6_POOLS['Naval Defense: Under blockade']
      .filter((v) => (v.marks || []).includes('dm-only'));
    expect(covert, 'the covert variant left the pool, so this arm proves nothing').toHaveLength(1);
    const port = WORLDS.find((w) => w.label === 'metro-port').settlement;
    const pulsed = { ...port,
      economicState: { ...port.economicState,
        foodSecurity: { ...port.economicState.foodSecurity, stockpile: { blockaded: true, blockadeBypass: 'teleport' } } } };
    // ⚠ THE NAME IS FIXED AND THE SEED VARIES, because `properFill` REFUSES a name
    // carrying a digit — a `Town0` fixture would unfill every {settlement} slot, drop
    // every variant in the pool and leave this arm asserting against nothing.
    const seen = new Set();
    for (let i = 0; i < 40; i++) {
      seen.add(defenseSupportingProse(pulsed, { seed: `s${i}`, audience: 'player' }).naval.sentence);
    }
    // ANCHOR: forty player draws reached more than one variant, so the covert text's absence
    // is the gate discriminating and not the draw having collapsed onto one index.
    expect(seen.size, 'the player draw collapsed to a single variant').toBeGreaterThan(1);
    expect([...seen].join(' ⟡ ')).not.toContain('magical channel'); // anchored: the line above proves the draw reached several variants
    // …and the DM audience CAN reach it, which is the positive control for the same gate.
    const dmSeen = new Set();
    for (let i = 0; i < 60; i++) {
      dmSeen.add(defenseSupportingProse(pulsed, { seed: `d${i}`, audience: 'dm' }).naval.sentence);
    }
    expect([...dmSeen].join(' ⟡ ')).toContain('magical channel');
  });
});

describe('DS-DEF-6 — the FOUR lenses that must NOT speak, and why', () => {
  it('the declared-blocked set is exactly the corpus minus the two speaking lenses', () => {
    const live = Object.keys(DEF6_POOLS)
      .filter((k) => k.startsWith('Logistics & Supply: ') || k.startsWith('Naval Defense: '));
    const blocked = Object.keys(DEF6_POOLS).filter((k) => !live.includes(k));
    expect([...DEF6_C3_BLOCKED_POOLS].sort()).toEqual([...blocked].sort());
    expect(DEF6_C3_BLOCKED_POOLS).toHaveLength(13);
    expect(live).toHaveLength(8);
    // Every declared-blocked key is a REAL pool: a typo here would silently shrink the claim.
    for (const key of DEF6_C3_BLOCKED_POOLS) expect(DEF6_POOLS[key], key).toBeTruthy();
  });

  it('every blocked lens names a LIVE mount row that already speaks its fact', () => {
    // Pinned against the registry rather than a comment: if one of those positions is
    // re-cut or its rung flipped to glance, this arm reds and the declaration is re-opened
    // instead of quietly describing a page that has changed.
    for (const [lens, mount] of Object.entries(DEF6_FACT_SPOKEN_AT)) {
      const row = DOSSIER_MOUNTS.find((r) => r.mount === mount);
      expect(row, `${lens} claims to be covered by ${mount}, which is not in the registry`).toBeTruthy();
      expect(row.rung, `${mount} no longer SPEAKS, so ${lens} is no longer covered`).toBe('sentence');
      expect(row.tab).toBe('defense');
      // Every blocked pool belongs to a named lens, and every named lens has blocked pools.
      expect(DEF6_C3_BLOCKED_POOLS.some((k) => k.startsWith(`${lens}: `)), lens).toBe(true);
    }
    for (const key of DEF6_C3_BLOCKED_POOLS) {
      const lens = key.slice(0, key.indexOf(':'));
      expect(Object.keys(DEF6_FACT_SPOKEN_AT), `${key} names no covering position`).toContain(lens);
    }
  });

  it('the desk NEVER emits a blocked pool key, over the producer\'s whole input space', () => {
    // The structural half of the declaration: it is not enough that the desk chooses not to
    // read those lenses today — no reachable input may route to one.
    const emitted = new Set();
    for (const granary of [true, false]) {
      for (const port of [true, false]) {
        for (const navy of [true, false]) {
          for (const blockaded of [true, false]) {
            for (const access of ['road', 'port', 'isolated', 'river', '']) {
              const a = supplyLogisticsPoolKey(granary, port, access);
              const b = navalDefensePoolKey(navy, port, blockaded);
              if (a) emitted.add(a);
              if (b) emitted.add(b);
            }
          }
        }
      }
    }
    expect(emitted.size, 'the sweep emitted nothing, so the negative below is vacuous').toBe(8);
    for (const key of DEF6_C3_BLOCKED_POOLS) {
      // anchored: the line above proves the sweep emitted all eight live keys
      expect([...emitted], `the desk can still reach the blocked pool ${key}`).not.toContain(key);
    }
  });

  it('DS-DEF-6 speaks at exactly ONE position and has left the dark list', () => {
    const row = sentenceMountForBlock('DS-DEF-6');
    expect(row).toBeTruthy();
    expect(row.mount).toBe('defense.supportingCapabilities');
    expect(row.desk).toBe('defense');
    expect(row.tab).toBe('defense');
    // anchored: A_DARK_SIBLING is an id that genuinely carries no mount row, so the dark
    // list is populated and still correctly keyed against the registry.
    expectAbsentWithAnchor(UNMOUNTED_BLOCKS, 'DS-DEF-6', A_DARK_SIBLING, 'DS-DEF-6 is mounted');
  });
});

/**
 * ── DS-DEF-9 · MAGIC DEPENDENCY — the leaf's one block that speaks off the defense tab ──
 */
const DEF9_POOLS = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-9'].pools;
const chained = (magicNote, outputs) => ({
  defenseProfile: { magicDependency: true }, name: 'Silbergate', _seed: 'd9',
  economicState: { activeChains: [{ label: 'Bowyer & fletcher', magicNote, outputs }] },
});

describe('DS-DEF-9 — magic dependency, and the slot filled from the right ROLE', () => {
  it('the pool key is TOTAL over the producer boolean and SILENT when it is absent', () => {
    expect(magicDependencyPoolKey(true, false)).toBe('magicDependency true');
    expect(magicDependencyPoolKey(true, true)).toBe('magicDependency true, with a NAMED dependent chain');
    expect(magicDependencyPoolKey(false, false)).toBe('magicDependency false');
    expect(magicDependencyPoolKey(false, true)).toBe('magicDependency false');
    // An unmeasured town is not an independent one. `defenseGenerator.js:639` writes the
    // flag into every profile it builds, so an absent value is a fixture or a bad import.
    expect(magicDependencyPoolKey(undefined, false)).toBeNull();
    expect(magicDependencyPoolKey(null, true)).toBeNull();
    expect(magicDependencyPoolKey('true', false)).toBeNull();
    // Both directions: the three keys the desk can emit are exactly the corpus's three.
    const emitted = new Set(['magicDependency true', 'magicDependency true, with a NAMED dependent chain', 'magicDependency false']);
    expect([...emitted].sort()).toEqual(Object.keys(DEF9_POOLS).sort());
  });

  it('THE FILL COMES FROM `outputs[0]` AND NEVER FROM `label` — the role, not the field', () => {
    // The chain's label names the TRADE ("Bowyer & fletcher"); the corpus slot is {good} and
    // its sentence is "The {good} that {settlement} lives on". A trade name there reads
    // perfectly fluent and states something the record does not.
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Bows and crossbows'] }]))
      .toBe('bows and crossbows');
    // The label is present in that same fixture and is NOT what came back.
    // anchored: the line above proves the reader returns a fill from this shape
    expect(namedMagicChainGood([{ magicNote: 'n', label: 'Bowyer & fletcher', outputs: ['Preserved foods'] }]))
      .not.toBe('bowyer & fletcher');
    expect(namedMagicChainGood([{ magicNote: 'n', label: 'Bowyer & fletcher', outputs: ['Preserved foods'] }]))
      .toBe('preserved foods');
    // A chain with no magicNote is not a dependent chain, and is skipped for the fill.
    expect(namedMagicChainGood([{ outputs: ['Herbal remedies'] }])).toBeUndefined();
    expect(namedMagicChainGood(null)).toBeUndefined();
    expect(namedMagicChainGood([])).toBeUndefined();
  });

  it('the fill REFUSES rather than lowercases what is not a bare common noun', () => {
    // Lowercasing is safe for a common noun and destructive for a proper one: a custom
    // content good called "Vaelthorn Steel" must not become "the vaelthorn steel".
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Vaelthorn Steel'] }])).toBeUndefined();
    // A parenthetical is a catalogue measure, not the shape `bare-common` names.
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Ale (barrel)'] }])).toBeUndefined();
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Iron ingots 40'] }])).toBeUndefined();
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: [''] }])).toBeUndefined();
    // ANCHOR: the same reader on a clean value DOES fill, so the refusals above are the
    // shape guard discriminating rather than the reader having stopped working.
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Refined iron ingots'] }]))
      .toBe('refined iron ingots');
    // …and it walks past a refused chain to a later one that qualifies.
    expect(namedMagicChainGood([
      { magicNote: 'n', outputs: ['Ale (barrel)'] }, { magicNote: 'n', outputs: ['Game meat'] },
    ])).toBe('game meat');
  });

  it('A REFUSED FILL DEGRADES THE POOL, it never blanks the position (R-DST-K)', () => {
    // The NAMED-chain pool holds three variants, two of which name {good}. When the fill is
    // refused the kernel drops those two and the third — which never named it — speaks.
    const refused = chained('Arcane fabrication', ['Vaelthorn Steel']);
    expect(hasNamedMagicChain(refused.economicState.activeChains)).toBe(true);
    const drawn = defenseMagicDependencyProse(refused, { seed: 'r', audience: 'dm' });
    expect(drawn.arcaneReliance, 'a refused fill blanked the position').toBeTruthy();
    expect(drawn.arcaneReliance.provenance.poolKey).toBe('magicDependency true, with a NAMED dependent chain');
    expect(drawn.arcaneReliance.sentence.length, 'the degraded pool drew an empty line').toBeGreaterThan(40);
    // anchored: the length arm on the line above proves the subject is a real rendered
    expect(drawn.arcaneReliance.sentence).not.toContain('{'); // sentence and not an empty string
    const slotless = DEF9_POOLS['magicDependency true, with a NAMED dependent chain']
      .filter((v) => !(v.slots || []).includes('good'));
    expect(slotless, 'the pool has no slotless variant left to degrade to').toHaveLength(1);
    expect(drawn.arcaneReliance.sentence).toBe(slotless[0].text.replace('{settlement}', 'Silbergate'));
    // …and with a CLEAN fill the pool's {good}-bearing variants come back into play.
    // ⚠ Asserted OVER SEEDS, not on one: the draw is deterministic on the seed, and two
    // of this pool's three variants name the slot — so a single seed proves only which
    // index that seed lands on. Pinning one seed here would be a test asserting the
    // avalanche rather than the fill.
    const withGood = new Set();
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      withGood.add(defenseMagicDependencyProse(chained('Arcane fabrication', ['Preserved foods']), { seed })
        .arcaneReliance.sentence);
    }
    expect(withGood.size, 'the draw collapsed to one variant, so the next arm proves little')
      .toBeGreaterThan(1);
    expect([...withGood].some((line) => line.includes('preserved foods')),
      'no seed reached a variant that names the good').toBe(true);
  });

  it('ROUTING IS ON THE STATE, not on whether the fill survived the annex punctuation', () => {
    // The pool key is a claim about the town ("there is a named dependent chain"), and the
    // chain is named in the record whether or not its first output happens to pass the
    // shape guard. Routing on the fill would make the sentence a function of the annex.
    expect(hasNamedMagicChain([{ magicNote: 'x' }])).toBe(true);
    expect(hasNamedMagicChain([{ magicNote: '   ' }])).toBe(false);
    expect(hasNamedMagicChain([{ label: 'x' }])).toBe(false);
    expect(hasNamedMagicChain(undefined)).toBe(false);
    expect(defenseMagicDependencyProse(chained('n', ['Vaelthorn Steel']), { seed: 'q' })
      .arcaneReliance.provenance.poolKey).toBe('magicDependency true, with a NAMED dependent chain');
  });

  it('REACHABILITY, MEASURED OVER GENERATED WORLDS rather than assumed', () => {
    // The false pool is what every default world reads, and the desk renders it as a
    // finding rather than as a silence.
    for (const { label, settlement } of WORLDS) {
      expect(typeof settlement.defenseProfile?.magicDependency, `${label}`).toBe('boolean');
      const drawn = defenseMagicDependencyProse(settlement, { seed: 'm', audience: 'dm' });
      expect(drawn.arcaneReliance, `${label} drew nothing`).toBeTruthy();
      expect(drawn.arcaneReliance.sentence.length, `${label} drew an empty line`).toBeGreaterThan(40);
      // anchored: the length arm on the line above proves the subject is a real rendered
      expect(drawn.arcaneReliance.sentence).not.toContain('{'); // sentence and not an empty string
      expect(drawn.arcaneReliance.provenance.blockId).toBe('DS-DEF-9');
    }
    // And the TRUE flag is reachable — gated entirely by stress incidence, not by magic.
    // A magic-forced sweep is what makes the state appear; the sweep is small on purpose
    // (the claim is reachability, and the wide census is recorded in the desk docblock).
    let trueSeen = 0;
    let namedSeen = 0;
    for (let i = 0; i < 40; i++) {
      const s = generateSettlementPipeline({
        settType: ['village', 'town', 'city', 'metropolis'][i % 4],
        culture: ['germanic', 'mediterranean', 'norse', 'celtic'][i % 4],
        terrain: ['grassland', 'coastal', 'mountain', 'forest'][i % 4],
        tradeRouteAccess: 'road', priorityMagic: 85, priorityReligion: 80,
      }, null, { seed: `mx-${i}`, customContent: {} });
      if (s.defenseProfile?.magicDependency !== true) continue;
      trueSeen++;
      const drawn = defenseMagicDependencyProse(s, { seed: `mx-${i}`, audience: 'dm' });
      expect(drawn.arcaneReliance.provenance.poolKey).not.toBe('magicDependency false');
      if (drawn.arcaneReliance.provenance.poolKey.includes('NAMED')) namedSeen++;
    }
    expect(trueSeen, 'no magic-dependent world was generated, so the arm proves nothing')
      .toBeGreaterThan(0);
    expect(namedSeen).toBeGreaterThan(0);
  });

  it('DS-DEF-9 speaks at exactly ONE position, on `viability`, and has left the dark list', () => {
    const row = sentenceMountForBlock('DS-DEF-9');
    expect(row).toBeTruthy();
    expect(row.mount).toBe('viability.magicDependency');
    expect(row.tab).toBe('viability');
    // ⚠ The `desk` column names the CORPUS LEAF, not the tab — this is the registry's first
    // cross-tab row and the column is doing what it is specified to do.
    expect(row.desk).toBe('defense');
    expect(row.tab).not.toBe(row.desk);
    expectAbsentWithAnchor(UNMOUNTED_BLOCKS, 'DS-DEF-9', A_DARK_SIBLING, 'DS-DEF-9 is mounted');
    // The slot the block needs is declared, and at the shape the annex registers.
    expect(SLOT_FILL_SHAPES.good).toBe('bare-common');
    expect(SHAPES.shapeOf('good')).toBe('bare-common');
  });
});

/**
 * ── ⛔ THE TWO DECLARED-DARK BLOCKS — pinned so neither can be quietly forgotten OR lit ──
 */
describe('DS-DEF-7 and DS-DEF-10 — dark by measurement, and the pin on both declarations', () => {
  it('each declaration covers its block\'s WHOLE pool set, exactly', () => {
    // A declaration that listed some of a block's pools would leave the rest looking like
    // an oversight. Both directions, both blocks.
    for (const [id, declared] of [['DS-DEF-7', DEF7_DARK_POOLS], ['DS-DEF-10', DEF10_DARK_POOLS]]) {
      const pools = Object.keys(DOSSIER_STATE_PROSE_DEFENSE[id].pools);
      expect([...declared].sort(), `${id} declaration drifted from the corpus`).toEqual([...pools].sort());
      for (const key of declared) {
        expect(DOSSIER_STATE_PROSE_DEFENSE[id].pools[key].length, `${id} :: ${key}`).toBeGreaterThan(0);
      }
    }
    expect(DEF7_DARK_POOLS).toHaveLength(11);
    expect(DEF10_DARK_POOLS).toHaveLength(21);
  });

  it('both blocks are in the dark half and NEITHER is mounted anywhere', () => {
    for (const id of ['DS-DEF-7', 'DS-DEF-10']) {
      expect(UNMOUNTED_BLOCKS, id).toContain(id);
      expect(sentenceMountForBlock(id), `${id} gained a speaking position`).toBeNull();
      expect(DOSSIER_MOUNTS.filter((r) => r.blockId === id), `${id} gained a mount row`).toHaveLength(0);
    }
  });

  it('DS-DEF-10: every lens family names a LIVE position that already speaks its fact', () => {
    // The C3 claim, pinned against the registry rather than left in a docblock. If any of
    // those three positions is re-cut or stepped down to a glance, this arm reds and the
    // declaration is re-opened — which is exactly the act that would light this block.
    for (const [family, mount] of Object.entries(DEF10_FACT_SPOKEN_AT)) {
      const row = DOSSIER_MOUNTS.find((r) => r.mount === mount);
      expect(row, `${family} claims cover from ${mount}, which is not in the registry`).toBeTruthy();
      expect(row.rung, `${mount} no longer SPEAKS, so ${family} is no longer covered`).toBe('sentence');
      expect(DEF10_DARK_POOLS.some((k) => k.startsWith(`${family} `)), family).toBe(true);
    }
    // Every dark pool belongs to one of the three named families — no fourth family has
    // appeared in the corpus without a covering position being named for it.
    for (const key of DEF10_DARK_POOLS) {
      const family = key.split(' ')[0];
      expect(Object.keys(DEF10_FACT_SPOKEN_AT), `${key} names no covering position`).toContain(family);
    }
  });

  it('DS-DEF-10\'s posture vocabulary IS an exact 1:1 with the producer — the block is not broken', () => {
    // The point of this arm is that the block is dark for a LAYOUT reason and not a
    // producer one: the route would be trivial, which is what makes the C3 finding worth
    // writing down instead of leaving as a silence.
    const postures = new Set(Object.values(DEFENSE_STRESS_STATUS).map((s) => s.posture));
    const declared = DEF10_DARK_POOLS.filter((k) => k.startsWith('posture '))
      .map((k) => k.replace(/^posture /, '').replace(/ \([^)]*\)$/, ''));
    expect([...declared].sort()).toEqual([...postures].sort());
    expect(declared).toHaveLength(15);
    // ⚠ AND THE PARENTHETICAL IS THE TOKEN DE-UNDERSCORED, NOT THE TOKEN. This arm asserted
    // the token verbatim and REDDED on `politically fractured`, which corrected the claim:
    // where the corpus word differs from the producer's, the corpus does help by naming the
    // producer — but it spells the token's underscores as spaces. That is the label trap one
    // notch smaller than usual, and the measured cost of missing it is exact: a route keying
    // on the parenthetical verbatim reaches 3 of the 6 and drops the other 3.
    const parenthesised = DEF10_DARK_POOLS
      .filter((k) => /^posture .* \(.*\)$/.test(k)).map((k) => /\(([^)]*)\)$/.exec(k)[1]);
    const tokens = Object.keys(DEFENSE_STRESS_STATUS);
    expect(parenthesised).toHaveLength(6);
    const verbatim = parenthesised.filter((p) => tokens.includes(p));
    const deUnderscored = parenthesised.filter((p) => tokens.includes(p.replace(/ /g, '_')));
    // EVERY one resolves once the underscores are restored — that is the usable route.
    expect(deUnderscored).toHaveLength(6);
    // …and exactly three would have resolved without it, which is the trap's size. The
    // three that do are the single-word tokens, which have no underscore to lose.
    expect(verbatim.sort()).toEqual(['famine', 'indebted', 'wartime']);
    for (const p of parenthesised) {
      expect(tokens, `${p} does not de-underscore to a stress type`).toContain(p.replace(/ /g, '_'));
    }
  });

  it('DS-DEF-7 reason 3: NO contributor reason can fill the `bare-common` slot the pools name', () => {
    // MEASURED, not reasoned: `causalState.js` writes `reason` as a finished SENTENCE, and
    // every one fails `bare-common` on a leading capital and a terminal period at least.
    // The desk's own `{good}` fill is the reader used, because it applies the same shape.
    const REAL_REASONS = [
      'Defense readiness score: 21.', 'Defensive walls in place.',
      'Wartime pressure taxes defense readiness.',
    ];
    for (const reason of REAL_REASONS) {
      expect(namedMagicChainGood([{ magicNote: 'n', outputs: [reason] }]), reason).toBeUndefined();
    }
    // ANCHOR: the same reader fills from a value that IS a bare common noun, so the three
    // refusals above are the shape guard discriminating and not the reader being broken.
    expect(namedMagicChainGood([{ magicNote: 'n', outputs: ['Preserved foods'] }])).toBe('preserved foods');
    // And the pools that need the slot are the two the declaration names as needing it.
    const needSlot = DEF7_DARK_POOLS.filter((k) => DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-7'].pools[k]
      .some((v) => (v.slots || []).includes('reason')));
    expect([...needSlot].sort()).toEqual([
      'a contributor with a RECORDED reason, adverse',
      'a contributor with a RECORDED reason, favourable',
    ]);
  });

  it('DS-DEF-7 reason 1: the host component that was built for this block has no product caller', () => {
    // `DefenseWarFrontSection` computes the live band, the contributors AND the war front,
    // and nothing renders it. Mounting into it would satisfy the walker's reachability arm
    // and lie to every reader of the registry.
    const HOST = 'src/components/dossier/EngineSections.jsx';
    expect(readFileSync(resolve(SRC, '../', HOST), 'utf8'))
      .toContain('export function DefenseWarFrontSection');
    /** @param {string} dir @returns {string[]} */
    const walk = (dir) => readdirSync(dir).flatMap((entry) => {
      const path = resolve(dir, entry);
      if (statSync(path).isDirectory()) return walk(path);
      return /\.jsx?$/.test(path) ? [path] : [];
    });
    const callers = walk(resolve(SRC, 'components')).filter((path) => {
      if (path.endsWith('EngineSections.jsx')) return false;
      return codeOnly(readFileSync(path, 'utf8')).includes('DefenseWarFrontSection');
    });
    // ANCHOR: the same walk over the same sources finds plenty of callers of a component
    // that IS wired, so an empty list is a measurement rather than a broken walk.
    const wired = walk(resolve(SRC, 'components')).filter((path) => {
      if (path.endsWith('DefenseTab.jsx')) return false;
      return codeOnly(readFileSync(path, 'utf8')).includes('DefenseTab');
    });
    expect(wired.length, 'the source walk found no caller of a component that IS wired').toBeGreaterThan(0);
    // anchored: the line above proves the same walk finds callers of a wired component
    expect(callers.map((p) => p.replace(SRC, 'src')), 'DS-DEF-7\'s host gained a caller — re-open the declaration').toHaveLength(0);
  });
});

/**
 * ── THE PAID SURFACE, OVER THE IMPORT PATH RATHER THAN ONE FUNCTION NAME ────────────
 *
 * `dossierMountRegistry.walker.test.js`'s ARM 2 finds a desk's callers by looking for the
 * literal `<desk>StateProse(` — the name of ONE of the leaf's exports. This leaf now draws
 * from TWO components (`DefenseTab` calls `defenseStateProse`; `ViabilityTab` calls
 * `defenseMagicDependencyProse` for DS-DEF-9's cross-tab row), and the second is INVISIBLE
 * to that reader because its call spells a different export. The arm stays green and stops
 * covering the tree. Reported to the chair for DESK-9, whose file that is; meanwhile this
 * arm holds the invariant the walker intends, computed over the IMPORT PATH so a caller
 * cannot hide behind an export name.
 */
describe('the defense desk\'s paid-surface gate — every caller, found by import path', () => {
  it('every component importing this desk gates its draw on publicDossier', () => {
    /** @param {string} dir @returns {string[]} */
    const walk = (dir) => readdirSync(dir).flatMap((entry) => {
      const path = resolve(dir, entry);
      if (statSync(path).isDirectory()) return walk(path);
      return /\.jsx?$/.test(path) ? [path] : [];
    });
    const importers = walk(resolve(SRC, 'components')).filter(
      (path) => readFileSync(path, 'utf8').includes('stateProse/defenseStateProse.js'),
    );
    // Two callers today, and the count is asserted so a THIRD arrives as a red rather than
    // as a silent third place to forget the gate.
    expect(importers.map((p) => p.replace(`${SRC}/`, '')).sort())
      .toEqual(['components/new/tabs/DefenseTab.jsx', 'components/new/tabs/ViabilityTab.jsx']);
    for (const path of importers) {
      const code = codeOnly(readFileSync(path, 'utf8'));
      // Every call into the desk must have a publicDossier read within the same expression.
      const calls = [...code.matchAll(/\bdefense[A-Za-z]*Prose\(/g)].map((m) => m.index);
      expect(calls.length, `${path} imports the desk and never calls it`).toBeGreaterThan(0);
      for (const at of calls) {
        expect(
          code.slice(Math.max(0, at - 400), at),
          `${path.replace(`${SRC}/`, '')} calls the defense desk with no publicDossier read`
          + ' in the same expression. A public gallery dossier is a FREE, ANONYMOUS viewer'
          + ' and §885.3 rules corpus prose a PAID surface.',
        ).toContain('publicDossier');
      }
    }
  });

  it('NON-VACUITY: an ungated caller of the same shape is convicted by the same reader', () => {
    const ungated = codeOnly([
      "import { defenseSupportingProse } from '../../../domain/display/stateProse/defenseStateProse.js';",
      'const drawn = defenseSupportingProse(s, { seed });',
    ].join('\n'));
    const at = ungated.indexOf('defenseSupportingProse(');
    expect(at, 'the fixture no longer contains the call the slice is taken around').toBeGreaterThan(-1);
    // anchored: `at` is pinned to a real offset on the line above, so the slice is non-empty
    expect(ungated.slice(Math.max(0, at - 400), at)).not.toContain('publicDossier');
  });
});
