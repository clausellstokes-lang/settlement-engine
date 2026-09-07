/**
 * stressorsStateProseDesk.test.js — DESK CAR 10: the stressor desk.
 *
 * ⭐ THE FIRST DESK IN THIS ARC WHOSE BLOCKS BOTH SPEAK AT BIRTH. `settlement.stress[]` and
 * `settlement.activeConditions[]` are written by `assembleSettlement` at generation, so the
 * aliveness proofs here use ORDINARY generated shapes — the opposite of DS-POW-3 and
 * DS-POW-7, whose state is play-time and which needed simulated fixtures.
 *
 * The two traps this file exists to hold shut:
 *   • THE LABEL TRAP. 13 of the 15 stress labels uppercase onto their pool key and TWO DO
 *     NOT, so a label route would darken two banners in silence. Asserted, both ways.
 *   • THE WRONG-READER TRAP. `isEventSourcedCondition` answers a NARROWER question than the
 *     provenance pools split on, and routing on it would have called a generation-sourced
 *     condition untraceable. Pinned as a divergence so nobody "restores" it.
 *
 * ⛔ No `it.each` anywhere: the lighting walker parks a whole file that registers tests from
 * a non-literal table, and its each-family debt is a SHRINK-ONLY ratchet.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SLOT_FILL_SHAPES, SLOT_FILL_TABLES, conditionArchetypePoolKey,
  conditionDirectionPoolKey, conditionDurationPoolKey, conditionProvenancePoolKey,
  conditionSeverityPoolKey, crisisArityPoolKey, crisisBannerPoolKey, crisisBannerRung,
  crisisFramingPoolKey, stressorLifecyclePoolKey, stressorOriginPoolKey, stressorsStateProse,
} from '../../src/domain/display/stateProse/stressorsStateProse.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import {
  isEventSourcedCondition, severityBand, severityBands, supportedConditionArchetypes,
} from '../../src/domain/activeConditions.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { STRESSOR_LIFECYCLE_STAGES, normalizeStressor } from '../../src/domain/worldPulse/stressorsCore.js';
// ⭐ A TEST IMPORT COSTS NO PRODUCTION BYTES. `stressorDynamics.js` drags 29 modules /
// 602 KB and the DESK deliberately does not touch it — but the identity between its variant
// roster and the corpus's origin pools is worth asserting, and here is where that is free.
import { VARIANT_HOOKS } from '../../src/domain/worldPulse/stressorDynamics.js';
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

const STR1 = 'DS-STR-1';
const CND1 = 'DS-CND-1';
const STR1_POOLS = DOSSIER_STATE_PROSE_STRESSORS[STR1].pools;
const CND1_POOLS = DOSSIER_STATE_PROSE_STRESSORS[CND1].pools;

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

const town = { name: 'Thornwall', _seed: 'seed-str' };
const banner = (type) => ({ type, label: STRESS_TYPE_MAP[type]?.label });
const condition = (over = {}) => ({
  archetype: 'plague', severityBand: 'low', status: 'stable',
  duration: { elapsedTicks: 0, expiresAtTicks: 100 }, causes: [], triggeredAt: {}, ...over,
});

describe('the stressor desk — the banner map is TOTAL, and keyed on the token for a reason', () => {
  it('every producer stress type has an entry, and every banner pool is claimed once', () => {
    const types = Object.keys(STRESS_TYPE_MAP);
    expect(types).toHaveLength(15);
    for (const type of types) {
      // The FUNCTION is the contract: the map behind it is private, because the projection
      // guard treats an exported string map as a candidate FILL table and this is not one.
      const key = crisisBannerPoolKey(type);
      expect(key, `no banner pool declared for stress type ${type}`).toBeTruthy();
      expect(STR1_POOLS[key], `corpus has no pool ${key}`).toBeTruthy();
    }
    // Every banner pool is claimed by exactly one type — so a pool cannot be orphaned and
    // two types cannot collide onto one banner.
    const claimed = types.map((t) => crisisBannerPoolKey(t));
    expect(new Set(claimed).size).toBe(types.length);
    const bannerPools = Object.keys(STR1_POOLS)
      .filter((k) => !k.startsWith('ARITY:') && !k.startsWith("Overview's"));
    expect([...claimed].sort()).toEqual([...bannerPools].sort());
    // An unknown type renders nothing rather than falling into a neighbouring crisis.
    expect(crisisBannerPoolKey('volcano')).toBeNull();
    expect(crisisBannerPoolKey('')).toBeNull();
  });

  it('⛔ THE LABEL TRAP: two of the fifteen labels do NOT match their pool key', () => {
    // This is why the desk keys on the TYPE TOKEN. If a future edit re-routes on the label,
    // these two banners darken in silence — the quiet degradation the corpus exists to
    // refuse — so the divergence is pinned rather than left as a comment.
    const mismatched = Object.keys(STRESS_TYPE_MAP).filter(
      (t) => String(STRESS_TYPE_MAP[t].label).toUpperCase() !== crisisBannerPoolKey(t),
    );
    expect([...mismatched].sort()).toEqual(['indebted', 'religious_conversion']);
    // And the token route serves them correctly regardless.
    expect(crisisBannerPoolKey('indebted')).toBe('INDEBTED TO AN OUTSIDE POWER');
    expect(crisisBannerPoolKey('religious_conversion')).toBe('RELIGIOUS CRISIS');
  });

  it('the declared slot shapes equal the annex register, and the desk owns no fill table', () => {
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(SHAPES.shapeOf(slot), `slot {${slot}}`).toBe(shape);
    }
    expect(SLOT_FILL_TABLES).toEqual({});
  });
});

describe('the stressor desk — ALIVENESS at BIRTH', () => {
  it('all fifteen crisis banners speak over an ordinary generated stress record', () => {
    const reached = new Set();
    for (const type of Object.keys(STRESS_TYPE_MAP)) {
      const drawn = crisisBannerRung(town, banner(type), { seed: `b-${type}` });
      expect(drawn, `no rung for ${type}`).toBeTruthy();
      expect(drawn.sentence, `SILENT banner ${type}`).toBeTruthy();
      expect(drawn.sentence.length).toBeGreaterThan(20);
      // The length assertion above pins this same sentence at > 20 characters, so neither
      // absence check can be satisfied by a banner that went silent.
      // anchored: `drawn.sentence` is pinned > 20 characters on the line above
      expect(drawn.sentence).not.toMatch(/[{}]/);
      // anchored: same sentence, pinned > 20 characters above
      expect(drawn.sentence).not.toMatch(/[0-9]/);
      expect(drawn.provenance.blockId).toBe(STR1);
      reached.add(drawn.provenance.poolKey);
    }
    expect(reached.size).toBe(15);
  });

  it('the arity line needs SEVERAL crises, and the framing line needs one', () => {
    const one = stressorsStateProse(town, { banners: [banner('famine')], conditions: [] }, { seed: 'a1' });
    expect(one.crisisArity, 'one crisis is not an arity story').toBeNull();
    expect(one.crisisFraming.sentence).toBeTruthy();
    const two = stressorsStateProse(
      town, { banners: [banner('famine'), banner('wartime')], conditions: [] }, { seed: 'a2' },
    );
    expect(two.crisisArity.sentence).toBeTruthy();
    expect(two.crisisArity.provenance.poolKey).toBe('ARITY: several banners standing at once');
    // No crisis at all ⇒ the section does not render ⇒ neither line speaks.
    const none = stressorsStateProse(town, { banners: [], conditions: [] }, { seed: 'a0' });
    expect(none.crisisFraming).toBeNull();
    expect(none.crisisArity).toBeNull();
    expect(crisisArityPoolKey(null)).toBeNull();
    expect(crisisFramingPoolKey(null)).toBeNull();
  });

  it('the four SEVERITY pools read through the CANONICAL band derivation', () => {
    expect(severityBands()).toEqual(['low', 'medium', 'high', 'critical']);
    for (const band of severityBands()) {
      const key = conditionSeverityPoolKey(condition({ severityBand: band }));
      expect(key).toBe(`SEVERITY: ${band}`);
      expect(CND1_POOLS[key]).toBeTruthy();
    }
    // A record carrying only the NUMERIC severity is banded by the one derivation of that
    // ladder, never by a second spelling of the cut inside this desk.
    const numeric = { severity: 0.95, status: 'stable' };
    expect(conditionSeverityPoolKey(numeric)).toBe(`SEVERITY: ${severityBand(0.95)}`);
    expect(conditionSeverityPoolKey({})).toBeNull();
  });

  it('the DIRECTION lens is TOTAL — the FLAT case is the corpus\'s own name for it', () => {
    const flat = 'DIRECTION: stable, and the FLAT case (no valid directional status)';
    expect(conditionDirectionPoolKey(condition({ status: 'worsening' }))).toBe('DIRECTION: worsening');
    expect(conditionDirectionPoolKey(condition({ status: 'easing' }))).toBe('DIRECTION: easing');
    expect(conditionDirectionPoolKey(condition({ status: 'stable' }))).toBe(flat);
    // An absent or unrecognised status is the FLAT case rather than silence, which is why
    // the corpus spells the pool that way. So this lens never goes quiet on a real record.
    expect(conditionDirectionPoolKey(condition({ status: undefined }))).toBe(flat);
    expect(conditionDirectionPoolKey(condition({ status: 'sideways' }))).toBe(flat);
    expect(conditionDirectionPoolKey(null)).toBeNull();
  });

  it('the ARCHETYPE lens covers the THREE the corpus wrote, of forty-six that exist', () => {
    const all = supportedConditionArchetypes();
    expect(all.length).toBeGreaterThan(40);
    for (const archetype of ['reconstruction', 'boom', 'flourishing']) {
      expect(all, `${archetype} is not a real archetype`).toContain(archetype);
      expect(conditionArchetypePoolKey(condition({ archetype }))).toBe(`ARCHETYPE: ${archetype}`);
    }
    // The other forty-three render no archetype line — the corpus choosing its subject, not
    // a gap — and the remaining lenses still speak for such a condition.
    const other = stressorsStateProse(
      town, { banners: [], conditions: [condition({ archetype: 'plague' })] }, { seed: 'arch' },
    );
    expect(other.conditionArchetype).toBeNull();
    expect(other.conditionSeverity.sentence).toBeTruthy();
    expect(other.conditionDirection.sentence).toBeTruthy();
  });

  it('the DURATION cut is driven from both sides', () => {
    expect(conditionDurationPoolKey(condition({ duration: { elapsedTicks: 90, expiresAtTicks: 100 } })))
      .toBe('DURATION: inside the expiry wind-down window');
    expect(conditionDurationPoolKey(condition({ duration: { elapsedTicks: 75, expiresAtTicks: 100 } })))
      .toBe('DURATION: inside the expiry wind-down window');
    expect(conditionDurationPoolKey(condition({ duration: { elapsedTicks: 74, expiresAtTicks: 100 } })))
      .toBeNull();
    // A condition with no expiry never enters a wind-down.
    expect(conditionDurationPoolKey(condition({ duration: { elapsedTicks: 5 } }))).toBeNull();
    expect(conditionDurationPoolKey(condition({ duration: null }))).toBeNull();
  });
});

describe('the stressor desk — the wrong-reader trap, and the two declared darknesses', () => {
  it('⛔ isEventSourcedCondition answers a NARROWER question, and is deliberately unused', () => {
    // The divergence, pinned from both sides. A generation-sourced condition carries a full
    // causes[] and the canonical predicate still returns false, because it asks only about
    // CANON EVENTS. Routing provenance on it would tell a reader the condition has no
    // traceable origin when the record plainly carries one.
    const generationSourced = condition({ causes: [{ source: 'generation' }] });
    expect(isEventSourcedCondition(generationSourced)).toBe(false);
    expect(conditionProvenancePoolKey(generationSourced))
      .toBe('PROVENANCE: causes[] or triggeredAt.sourceEventType populated');
    // …and the desk does not import it, so the trap cannot be re-entered by restoration.
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/stressorsStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expectAbsentWithAnchor(
      code, 'isEventSourcedCondition', 'export function stressorsStateProse',
      'the desk routes provenance on the narrower predicate',
    );
    // The untraced side, and the sourceEventType side.
    expect(conditionProvenancePoolKey(condition({}))).toBe('PROVENANCE: no causes[] and no sourceEventType');
    expect(conditionProvenancePoolKey(condition({ triggeredAt: { sourceEventType: 'war' } })))
      .toBe('PROVENANCE: causes[] or triggeredAt.sourceEventType populated');
  });

  it('⛔ the TRACED-provenance pool is ROUTED but silent — the {complexity} shape', () => {
    // All three of its variants name {reason}: bare-common, no producer, and the VALUES are
    // reader-facing words in the dossier's own register — the class §0c-3 records for
    // {complexity} and which a lane must not choose. So the desk routes correctly and
    // anchored liveness holds it silent. Rule a {reason} vocabulary and it lights with no
    // desk change at all.
    const pool = CND1_POOLS['PROVENANCE: causes[] or triggeredAt.sourceEventType populated'];
    expect(pool.every((v) => (v.slots || []).includes('reason')), 'a {reason}-free variant exists').toBe(true);
    const drawn = stressorsStateProse(
      town, { banners: [], conditions: [condition({ causes: [{ source: 'event' }] })] }, { seed: 'prov' },
    );
    expect(drawn.conditionProvenance.provenance).toBeNull();
    expect(drawn.conditionProvenance.sentence).toBeNull();
    // The UNTRACED pool has {settlement}-only variants and speaks today.
    const untraced = stressorsStateProse(
      town, { banners: [], conditions: [condition({})] }, { seed: 'prov2' },
    );
    expect(untraced.conditionProvenance.sentence).toBeTruthy();
  });

  it('⛔ the five FAMILY pools are dark: the archetype templates carry NO family field', () => {
    for (const key of ['FAMILY: acute crisis', 'FAMILY: regional transmission',
      'FAMILY: war layer, aggressor side', 'FAMILY: occupation layer', 'FAMILY: recovery']) {
      expect(CND1_POOLS[key], `corpus lost ${key}`).toBeTruthy();
    }
    // A family lens would have to invent a 46-archetype -> 5-family classification inside a
    // display desk, which is a VOCABULARY decision. The door is one act wide: add `family`
    // to CONDITION_ARCHETYPE_TEMPLATES and this desk lights all five with no corpus work.
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/stressorsStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expectAbsentWithAnchor(
      code, 'FAMILY:', 'export function stressorsStateProse',
      'the desk invented a family classification',
    );
  });

  it('the registry mounts both blocks once each, on the overview tab', () => {
    for (const [blockId, mount] of [[STR1, 'overview.crisisBanners'], [CND1, 'overview.activeConditions']]) {
      const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === blockId);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ mount, tab: 'overview', desk: 'stressors', rung: 'sentence' });
      expect(sentenceMountForBlock(blockId)?.mount).toBe(mount);
      expectAbsentWithAnchor(
        UNMOUNTED_BLOCKS, blockId, A_DARK_SIBLING, `${blockId} is mounted, so the dark half must not name it`,
      );
    }
    // ⚠ THIS ARM ONCE ASSERTED `DS-STR-2` WAS STILL DARK, and the very next car mounted it.
    // An assertion naming a block as DARK goes stale the moment that block is lit — the same
    // staleness the mount walker's hardcoded routing plant hit in this same wave. So the
    // claim is DERIVED: every block this desk's registry rows name is mounted, and the count
    // comes from the registry rather than from a literal that has to be maintained.
    const deskRows = DOSSIER_MOUNTS.filter((row) => row.desk === 'stressors');
    for (const row of deskRows) {
      expectAbsentWithAnchor(
        UNMOUNTED_BLOCKS, row.blockId, A_DARK_SIBLING,
        `${row.blockId} carries a stressors mount row, so the dark half must not name it`,
      );
    }
  });

  it('a settlement with no crises and no conditions is wholly silent, not a crash', () => {
    const empty = stressorsStateProse({ name: 'Thornwall' }, {}, { seed: 'z' });
    for (const key of Object.keys(empty)) expect(empty[key], key).toBeNull();
    expect(stressorsStateProse(undefined).crisisFraming).toBeNull();
    expect(crisisBannerRung(undefined, undefined)).toBeNull();
  });
});

/**
 * DS-STR-2 — the world stressor. A CONDITIONAL SURFACE: `worldState.stressors[]` is written
 * only during play, so every aliveness arm below runs against a SIMULATED fixture normalized
 * by the kernel's own `normalizeStressor`. The birth case is a separate, labelled arm — a
 * dormancy proof standing in for an aliveness proof is the failure this file refuses.
 */
const STR2 = 'DS-STR-2';
const STR2_POOLS = DOSSIER_STATE_PROSE_STRESSORS[STR2].pools;

/** A played-world stressor, through the shipped normalizer. */
const playedStressor = (lifecycleStage, variant) => normalizeStressor({
  type: 'famine', severity: 0.6, status: 'active', lifecycleStage,
  affectedSettlementIds: ['sid-1'], originContext: { variant },
});

describe('DS-STR-2 — the two wired lenses are identities over PERSISTED fields', () => {
  it('the fixture is what the shipped normalizer produces', () => {
    const stressor = playedStressor('peaking', 'foreign_sponsored');
    // If the normalizer dropped either field the arms below would be measuring a
    // hand-shaped object rather than what the simulation writes.
    expect(stressor.lifecycleStage).toBe('peaking');
    expect(stressor.originContext).toEqual({ variant: 'foreign_sponsored' });
    expect(stressor.affectedSettlementIds).toEqual(['sid-1']);
  });

  it('⭐ the ORIGIN lens is a 17/17 identity with the producer\'s variant roster', () => {
    const variants = Object.keys(VARIANT_HOOKS);
    expect(variants).toHaveLength(17);
    for (const variant of variants) {
      const key = `ORIGIN: ${variant}`;
      expect(STR2_POOLS[key], `corpus has no pool for origin ${variant}`).toBeTruthy();
      expect(stressorOriginPoolKey({ originContext: { variant } })).toBe(key);
    }
    // Both directions: the corpus holds no origin pool the producer cannot emit.
    const originPools = Object.keys(STR2_POOLS).filter((k) => k.startsWith('ORIGIN: '));
    expect(originPools).toHaveLength(variants.length);
    // An unknown variant renders nothing. An origin is a claim about who did this to the
    // town, and the wrong one is the worst sentence this corpus could print.
    expect(stressorOriginPoolKey({ originContext: { variant: 'alien_invasion' } })).toBeNull();
    expect(stressorOriginPoolKey({})).toBeNull();
  });

  it('the LIFECYCLE lens covers FIVE of the roster\'s seven stages, by the corpus\'s choice', () => {
    expect(STRESSOR_LIFECYCLE_STAGES).toHaveLength(7);
    const narrated = ['emerging', 'active', 'peaking', 'easing', 'residual'];
    for (const stage of narrated) {
      expect(stressorLifecyclePoolKey({ lifecycleStage: stage })).toBe(`LIFECYCLE: ${stage}`);
    }
    // `resolved` and `dormant` get no pool — a stressor that is over is not a story about a
    // stressor — so they render NOTHING rather than a missing-pool error.
    for (const stage of ['resolved', 'dormant']) {
      expect(STRESSOR_LIFECYCLE_STAGES).toContain(stage);
      expect(stressorLifecyclePoolKey({ lifecycleStage: stage })).toBeNull();
    }
    expect(stressorLifecyclePoolKey({})).toBeNull();
    expect(stressorLifecyclePoolKey(null)).toBeNull();
  });

  it('ALIVENESS: all TWENTY-TWO lit pools speak over played worlds', () => {
    const reached = new Set();
    for (const stage of STRESSOR_LIFECYCLE_STAGES) {
      for (const variant of Object.keys(VARIANT_HOOKS)) {
        const drawn = stressorsStateProse(
          town, { worldStressor: playedStressor(stage, variant) }, { seed: `s2-${stage}-${variant}` },
        );
        for (const rung of ['worldStressorLifecycle', 'worldStressorOrigin']) {
          const line = drawn[rung];
          if (line?.sentence) {
            reached.add(line.provenance.poolKey);
            expect(line.provenance.blockId).toBe(STR2);
            // This branch is guarded, so it could run zero times — but the arm pins
            // `reached.size` at exactly 22 below, which a dead desk fails.
            // anchored: `reached.size` is pinned at exactly 22 after this loop
            expect(line.sentence).not.toMatch(/[{}]/);
            // anchored: same guarded line; `reached.size` is pinned at 22 below
            expect(line.sentence).not.toMatch(/[0-9]/);
          }
        }
      }
    }
    expect(reached.size, `reached ${reached.size}`).toBe(22);
    expect(Object.keys(STR2_POOLS)).toHaveLength(32);
  });
});

describe('DS-STR-2 — the ten dark pools, and the coupling measurement behind them', () => {
  it('⛔ SYNERGY × 6 and COUNTERFORCE × 4 are dark, and the desk touches neither kernel', () => {
    for (const key of Object.keys(STR2_POOLS)) {
      if (!key.startsWith('SYNERGY: ') && !key.startsWith('COUNTERFORCE: ')) continue;
      expect(STR2_POOLS[key], `corpus lost ${key}`).toBeTruthy();
    }
    expect(Object.keys(STR2_POOLS).filter((k) => k.startsWith('SYNERGY: '))).toHaveLength(6);
    expect(Object.keys(STR2_POOLS).filter((k) => k.startsWith('COUNTERFORCE: '))).toHaveLength(4);
    // SYNERGY needs `synergyAssessment`, and COUNTERFORCE needs
    // `counterforceAssessment(stressor, snapshot)` — a WORLD SNAPSHOT a dossier tab does not
    // have. Both live in `stressorDynamics.js`, whose import drags 29 modules / 602,004 B
    // that are not already in first paint, onto the most-visited tab in the dossier. The
    // desk must not reach for it, and this asserts the abstinence rather than trusting it.
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/stressorsStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expectAbsentWithAnchor(
      code, 'stressorDynamics', 'export function stressorsStateProse',
      'the desk reached for the 602 KB kernel',
    );
    expectAbsentWithAnchor(
      code, 'SYNERGY:', 'export function stressorsStateProse',
      'the desk invented a synergy lens',
    );
    expectAbsentWithAnchor(
      code, 'COUNTERFORCE:', 'export function stressorsStateProse',
      'the desk invented a counterforce lens',
    );
  });

  it('⚠ THE SURFACE CONDITION, labelled so it is never mistaken for aliveness', () => {
    // No played world ⇒ no world stressor ⇒ both lenses silent. Nothing degrades and
    // nothing false is said; the aliveness proof is the played-world arm above, and
    // substituting this one for it would be the dormancy proof this file refuses.
    const birth = stressorsStateProse(town, { worldStressor: null }, { seed: 'birth' });
    expect(birth.worldStressorLifecycle).toBeNull();
    expect(birth.worldStressorOrigin).toBeNull();
    // …while the two BIRTH-time blocks in this same desk still speak, which is the whole
    // reason this leaf split into two cars.
    const lit = stressorsStateProse(
      town,
      { banners: [banner('famine')], conditions: [condition({ severityBand: 'high' })], worldStressor: null },
      { seed: 'birth2' },
    );
    expect(lit.crisisFraming.sentence).toBeTruthy();
    expect(lit.conditionSeverity.sentence).toBeTruthy();
  });

  it('the registry mounts DS-STR-2 once, and the STRESSORS LEAF IS COMPLETE', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === STR2);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'overview.stressorLifecycle', tab: 'overview', desk: 'stressors', rung: 'sentence' });
    // THE MILESTONE, asserted rather than claimed: no stressors-leaf block remains dark.
    expect(UNMOUNTED_BLOCKS.filter((b) => b.startsWith('DS-STR-') || b.startsWith('DS-CND-'))).toEqual([]);
    expect(DOSSIER_MOUNTS.filter((row) => row.desk === 'stressors')).toHaveLength(3);
  });
});
