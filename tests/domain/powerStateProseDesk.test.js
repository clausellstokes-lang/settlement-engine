/**
 * powerStateProseDesk.test.js — DESK CAR 2: the power desk, and an ALIVENESS suite.
 *
 * WHAT THIS FILE IS FOR, AND WHY IT IS SHAPED THE WAY IT IS.
 *
 * A dark world and a lit-but-incapable world are BYTE-IDENTICAL to every test that checks
 * shape, arm, identity or determinism. A feature shipped this week with two arms that
 * could not fire in any possible world, and every dormancy fence and coupling row over it
 * was green. So the central arms below are not "the desk returns the right key" — they are
 * "SWITCH THE BLOCK ON AND A SENTENCE COMES OUT", pool by pool, over states the real
 * generator can build.
 *
 * The three things that would make this suite vacuous, and the controls that refuse them:
 *   • A POOL KEY THE CORPUS DOES NOT CARRY. Every key the desk can emit is asserted to
 *     exist in the shipped leaf, and the band keys are additionally proved EQUAL to the
 *     producer's own label vocabulary rather than to a transcription of it.
 *   • A POOL NO STATE CAN REACH. All eleven pools are driven, and the count is asserted
 *     against the leaf so a twelfth pool cannot arrive untested.
 *   • A SENTENCE THAT IS THE SAME SENTENCE EVERYWHERE. The differential arm renders two
 *     states through one seed and requires the lines to differ.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SLOT_FILL_SHAPES,
  SLOT_FILL_TABLES,
  governingSharePoolKey,
  legitimacyBandPoolKey,
  legitimacyLensPoolKey,
  powerStateProse,
  stabilityLensPoolKey,
  stabilityPoolKey,
} from '../../src/domain/display/stateProse/powerStateProse.js';
import { likelyFutureFacts } from '../../src/domain/simulationSpine.js';
import { legitimacyBandFor } from '../../src/generators/factionDynamics.js';
import {
  parseSlotShapes, mergeSlotShapes, fillShapeViolation,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import {
  DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, drawnAtMount, sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';

const BLOCK = 'DS-POW-1';
const POOLS = DOSSIER_STATE_PROSE_POWER[BLOCK].pools;
const POWER_POOLS2 = DOSSIER_STATE_PROSE_POWER['DS-POW-2'].pools;

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

/** A settlement carrying exactly the fields this desk reads. */
function town(publicLegitimacy, { name = 'Thornwall', governingName = 'Ashford Company' } = {}) {
  return { name, _seed: 'seed-alpha', powerStructure: { publicLegitimacy, governingName } };
}

/** A legitimacy record with a neutral breakdown, so the lens is controlled per test. */
function legit(label, breakdown = {}, governanceFractured = false) {
  return {
    score: 50,
    label,
    breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0, ...breakdown },
    governanceFractured,
  };
}

const BAND_LABELS = ['Endorsed', 'Approved', 'Tolerated', 'Contested', 'Legitimacy Crisis'];

describe('the power desk — the keys are the producer\'s, not a transcription', () => {
  it('every label legitimacyBandFor can emit is a DS-POW-1 pool key, and covers the ladder', () => {
    // DERIVED FROM THE PRODUCER. The band function is a total function of the score, so
    // walking 0..100 emits every label it can ever emit. A hand-copied list would be a
    // second spelling of the vocabulary and would agree with itself while both drifted.
    const emitted = new Set();
    for (let score = 0; score <= 100; score += 1) emitted.add(legitimacyBandFor(score).label);
    expect([...emitted].sort()).toEqual([...BAND_LABELS].sort());
    for (const label of emitted) {
      expect(POOLS[label], `the producer emits ${label} and the corpus has no such pool`).toBeTruthy();
      expect(legitimacyBandPoolKey(label)).toBe(label);
    }
  });

  it('an unrecognised label renders nothing rather than falling into a band', () => {
    expect(legitimacyBandPoolKey('Beloved')).toBeNull();
    expect(legitimacyBandPoolKey('')).toBeNull();
    expect(legitimacyBandPoolKey(undefined)).toBeNull();
    // And the whole desk goes silent with it, rather than drawing a neighbouring band.
    expect(powerStateProse(town(legit('Beloved'))).legitimacyBanner).toBeNull();
  });

  it('the declared slot shapes equal the annex register for every slot this desk fills', () => {
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(SHAPES.shapeOf(slot), `slot {${slot}}`).toBe(shape);
    }
    // The desk owns no literal fill table, and says so rather than omitting the field.
    expect(SLOT_FILL_TABLES).toEqual({});
  });
});

describe('the power desk — ALIVENESS: every pool fires over a state the generator builds', () => {
  // The eleven pools, each with the state that reaches it. THE POINT OF THIS TABLE is that
  // a pool absent from it is caught by the count arm below, so a pool cannot be mounted and
  // left unreachable in silence.
  const CASES = [
    ...BAND_LABELS.map((label) => [label, legit(label)]),
    ['governanceFractured true', legit('Legitimacy Crisis', {}, true)],
    ['breakdown dominated by PROSPERITY, favourable', legit('Endorsed', { prosperity: 20 })],
    ['breakdown dominated by PROSPERITY, adverse', legit('Contested', { prosperity: -20 })],
    ['breakdown dominated by SAFETY, adverse', legit('Contested', { safety: -20 })],
    ['breakdown dominated by DEFENSE, adverse', legit('Tolerated', { defense: -10 })],
    ['breakdown dominated by FOOD, adverse', legit('Tolerated', { food: -10 })],
  ];

  it('drives all eleven of the block\'s pools, and the block has exactly eleven', () => {
    // If the corpus grows a pool, this count reds and the new pool must be given a state
    // above rather than joining the mounted block as something no world can reach.
    expect(Object.keys(POOLS)).toHaveLength(11);
    expect(new Set(CASES.map(([key]) => key)).size).toBe(11);
    for (const [key] of CASES) expect(POOLS[key], `no such pool: ${key}`).toBeTruthy();
  });

  // A PLAIN PARAMETERLESS TEST LOOPING IN ITS BODY, never an `each` call. The lighting
  // walker parks a whole file that registers tests from a non-literal table, and its
  // each-family park debt is a SHRINK-ONLY ratchet — measured: an `it.each(CASES)` here
  // raised it from 111 to 112 and reddened the gate. Every assertion below carries the
  // pool key in its message, so a failure still names the pool that went dark.
  it('every one of the eleven pools renders a real sentence, not a null and not a stub', () => {
    for (const [key, record] of CASES) {
      const drawn = powerStateProse(town(record), { seed: 'seed-alpha' });
      const rung = BAND_LABELS.includes(key) ? drawn.legitimacyBanner : drawn.legitimacyLens;
      expect(rung, `the pool is mounted and the desk produced no rung for ${key}`).toBeTruthy();
      expect(rung.provenance, `provenance for ${key}`).toEqual(
        expect.objectContaining({ blockId: BLOCK, poolKey: key }),
      );
      // THE ARM THAT WOULD CATCH A LIT-BUT-INCAPABLE BLOCK: a real, filled sentence.
      expect(typeof rung.sentence, `sentence type for ${key}`).toBe('string');
      expect(rung.sentence.length, `sentence length for ${key}`).toBeGreaterThan(20);
      // No slot survived unfilled, and no engine token reached the reader.
      expect(rung.sentence, `unfilled slot in ${key}`).not.toMatch(/[{}]/);
      expect(rung.sentence, `engine token in ${key}`).not.toMatch(/[a-z]+_[a-z]+/);
      // §0d — the prose bands the figure, it never prints one.
      expect(rung.sentence, `digit in ${key}`).not.toMatch(/[0-9]/);
    }
  });

  it('the banner and the lens are drawn from two pools of ONE block at ONE position', () => {
    const drawn = powerStateProse(town(legit('Contested', { safety: -20 })), { seed: 's' });
    expect(drawn.legitimacyBanner.provenance.poolKey).toBe('Contested');
    expect(drawn.legitimacyLens.provenance.poolKey).toBe('breakdown dominated by SAFETY, adverse');
    expect(drawn.legitimacyBanner.provenance.blockId).toBe(BLOCK);
    expect(drawn.legitimacyLens.provenance.blockId).toBe(BLOCK);
    // Two readings, never the same sentence twice.
    expect(drawn.legitimacyBanner.sentence).not.toBe(drawn.legitimacyLens.sentence);
  });
});

describe('the power desk — the lens ordering is load-bearing', () => {
  it('LENS C precedes LENS B, which is what keeps the fracture pool reachable at all', () => {
    // governanceFractured and the crisis band are COEXTENSIVE at the producer
    // (legitimacyBandFor sets both on score < 30), so every fractured state also carries a
    // dominant breakdown. Had the lens preferred the breakdown, this pool would be
    // unreachable in every world the generator can build — lit, and unable to fire.
    const fracturedWithDominantBreakdown = legit('Legitimacy Crisis', { safety: -20 }, true);
    expect(legitimacyLensPoolKey(fracturedWithDominantBreakdown)).toBe('governanceFractured true');
    // THE CONTROL: the same record with the flag cleared falls through to the breakdown,
    // so the arm above is proving the ORDER and not merely that a key comes back.
    expect(legitimacyLensPoolKey(legit('Contested', { safety: -20 }, false)))
      .toBe('breakdown dominated by SAFETY, adverse');
  });

  it('a real generator score below the threshold sets both, confirming the coextension', () => {
    const band = legitimacyBandFor(10);
    expect(band.label).toBe('Legitimacy Crisis');
    expect(band.governanceFractured).toBe(true);
    // And above it, neither.
    const healthy = legitimacyBandFor(80);
    expect(healthy.label).toBe('Endorsed');
    expect(healthy.governanceFractured).toBe(false);
  });

  it('ties break in the declared order rather than by object iteration order', () => {
    // Two equal-magnitude adverse contributions: prosperity is declared first and wins,
    // so an unrelated edit to the record's key order cannot change the rendered sentence.
    expect(legitimacyLensPoolKey(legit('Contested', { prosperity: -10, food: -10 })))
      .toBe('breakdown dominated by PROSPERITY, adverse');
  });
});

describe('the power desk — the deliberate silences', () => {
  it('a dominant FAVOURABLE non-prosperity contribution renders nothing, never a false line', () => {
    // The corpus writes a favourable lens for prosperity alone, and safety/defense/food all
    // reach positive contributions, so this is a state the generator really produces.
    // Falling back to the prosperity line would state something false about the town.
    for (const field of ['safety', 'defense', 'food']) {
      expect(legitimacyLensPoolKey(legit('Endorsed', { [field]: 15 })), field).toBeNull();
    }
    // The banner still speaks: the silence is the LENS's, not the whole surface's.
    const drawn = powerStateProse(town(legit('Endorsed', { safety: 15 })), { seed: 's' });
    expect(drawn.legitimacyLens).toBeNull();
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
  });

  it('an all-zero breakdown is no dominance at all', () => {
    expect(legitimacyLensPoolKey(legit('Tolerated'))).toBeNull();
  });

  it('a legacy numeric publicLegitimacy narrates nothing rather than half a record', () => {
    const legacy = { name: 'Thornwall', powerStructure: { publicLegitimacy: 62, governingName: 'Ashford Company' } };
    const drawn = powerStateProse(legacy, { seed: 's' });
    expect(drawn.legitimacyBanner).toBeNull();
    expect(drawn.legitimacyLens).toBeNull();
  });

  it('a missing powerStructure is silence, not a crash', () => {
    expect(powerStateProse(undefined).legitimacyBanner).toBeNull();
    expect(powerStateProse({}).legitimacyBanner).toBeNull();
    expect(powerStateProse({ powerStructure: null }).legitimacyBanner).toBeNull();
  });
});

describe('the power desk — the {seat} fill and its refusal', () => {
  it('a conforming governingName fills {seat}, and the fill obeys the declared shape', () => {
    const drawn = powerStateProse(town(legit('Endorsed')), { seed: 'seed-alpha' });
    expect(fillShapeViolation('proper', 'Ashford Company')).toBe('');
    // The name reaches the reader.
    const seated = Object.keys(POOLS).map((key) => powerStateProse(
      town(legit('Endorsed')), { seed: key },
    ).legitimacyBanner?.sentence).filter(Boolean);
    expect(seated.some((line) => line.includes('Ashford Company'))).toBe(true);
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
  });

  // ⭐ THE ARM THAT PROVES THE DESK IS ALIVE IN PRODUCTION, NOT MERELY ON A FIXTURE.
  // A hand-written fixture proves the desk CAN speak; it cannot prove the real producer
  // hands it something it will accept. Measured during the build: a non-conforming name
  // ("the Ashford Concern") silences 38 of the block's 41 variants and takes the whole
  // `Tolerated` pool dark, because every one of its five variants names {seat}. That is
  // the refusal working — but if the REAL vocabulary ever tripped it, this desk would be
  // lit and mute in front of every reader while every other arm in this file stayed green.
  // So the real names are pinned here, and a producer change that lowercases one reds.
  const REAL_GOVERNING_NAMES = Object.freeze([
    "Headman's Authority", 'Arcane Council', 'Arcane Senate', 'Church Council', 'City Council',
    'Corrupt City Council', 'Corrupt Council', 'Ecclesiastical Council', 'Elder Council',
    'Grand Council', 'Grand Merchant Senate', 'Grand Military Council', 'High Theocratic Council',
    'Household Council', 'Merchant City Council', 'Merchant Council', 'Military City Council',
    'Military Council', 'Priestly Guidance', 'Shadow Senate', 'Town Council', 'Town Mayor',
    'Military/Guard', 'Religious Authorities', 'Craft Guilds', "Thieves' Guild", 'Arcane Orders',
  ]);

  it('every REAL governing name conforms, and the banner speaks at every score 0..100', () => {
    for (const name of REAL_GOVERNING_NAMES) {
      expect(fillShapeViolation('proper', name), `the real governing name ${name} would be refused`).toBe('');
    }
    // The whole score domain, against the real names, through the real band function.
    let spoke = 0;
    let lensSpoke = 0;
    for (let score = 0; score <= 100; score += 1) {
      const band = legitimacyBandFor(score);
      const record = {
        score,
        label: band.label,
        breakdown: { prosperity: score >= 60 ? 15 : -15, safety: 0, defense: 0, food: 0 },
        governanceFractured: band.governanceFractured,
      };
      const drawn = powerStateProse(
        town(record, { governingName: REAL_GOVERNING_NAMES[score % REAL_GOVERNING_NAMES.length] }),
        { seed: `s${score}` },
      );
      if (drawn.legitimacyBanner?.sentence) spoke += 1;
      if (drawn.legitimacyLens?.sentence) lensSpoke += 1;
    }
    // MEASURED 101/101 for both at the time of writing. Anything less means the desk has
    // gone partly mute over real state, which is the one failure a reader never reports.
    expect(spoke, 'the banner went silent over a real score point').toBe(101);
    expect(lensSpoke, 'the lens went silent over a real score point').toBe(101);
  });

  it('a NON-conforming governingName degrades the pool instead of printing a token', () => {
    // 38 of the block's 41 variants name {seat}; three name only {settlement}. A refused
    // fill must drop the 38 and leave the three speaking — anchored liveness doing its
    // work — rather than rendering `merchant_league` at a reader.
    const bad = town(legit('Endorsed'), { governingName: 'merchant_league' });
    const drawn = powerStateProse(bad, { seed: 'seed-alpha' });
    // Endorsed carries one {settlement}-only variant, so the surface still speaks.
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
    expect(drawn.legitimacyBanner.sentence).not.toMatch(/merchant_league/);
    // A pool whose every variant names {seat} goes fully silent instead.
    const allSeat = powerStateProse(
      town(legit('Approved'), { governingName: 'merchant_league' }), { seed: 'seed-alpha' },
    );
    expect(allSeat.legitimacyBanner.sentence).toBeNull();
  });
});

describe('the power desk — THE PROMISE and the mount wiring', () => {
  it('same seed + same state ⇒ same sentence, and a different seed may differ', () => {
    const state = () => town(legit('Tolerated'));
    const a = powerStateProse(state(), { seed: 'seed-alpha' });
    const b = powerStateProse(state(), { seed: 'seed-alpha' });
    expect(a.legitimacyBanner.sentence).toBe(b.legitimacyBanner.sentence);
    expect(a.legitimacyBanner.provenance).toEqual(b.legitimacyBanner.provenance);
  });

  it('DIFFERENTIAL: one seed, two states, two different sentences', () => {
    // The arm that a dormant feature cannot pass. If the desk were incapable, both of
    // these would be null or identical.
    const endorsed = powerStateProse(town(legit('Endorsed')), { seed: 'same-seed' });
    const crisis = powerStateProse(town(legit('Legitimacy Crisis', {}, true)), { seed: 'same-seed' });
    expect(endorsed.legitimacyBanner.sentence).toBeTruthy();
    expect(crisis.legitimacyBanner.sentence).toBeTruthy();
    expect(endorsed.legitimacyBanner.sentence).not.toBe(crisis.legitimacyBanner.sentence);
    // And the lens differentiates too: silent on the healthy town, speaking on the crisis.
    expect(endorsed.legitimacyLens).toBeNull();
    expect(crisis.legitimacyLens.sentence).toBeTruthy();
  });

  it('the registry mounts DS-POW-1 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === BLOCK);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      mount: 'power.legitimacyBanner', tab: 'power', desk: 'power', rung: 'sentence',
    });
    expect(sentenceMountForBlock(BLOCK)?.mount).toBe('power.legitimacyBanner');
    expect(UNMOUNTED_BLOCKS).not.toContain(BLOCK);
  });

  it('the mount ROUTES: flipping the row to glance would silence both readings together', () => {
    const drawn = powerStateProse(town(legit('Contested', { safety: -20 })), { seed: 's' });
    // As mounted (sentence), both readings reach the page.
    expect(drawnAtMount('power.legitimacyBanner', drawn.legitimacyBanner).sentence).toBeTruthy();
    expect(drawnAtMount('power.legitimacyBanner', drawn.legitimacyLens).sentence).toBeTruthy();
    // A glance row strips the sentence AND its provenance from whatever it is handed —
    // the control proving the component is routed rather than merely naming a string.
    const asGlance = drawnAtMount('economics.economyTile', drawn.legitimacyBanner);
    expect(asGlance.sentence).toBeNull();
    expect(asGlance.provenance).toBeNull();
    // An unmounted position is silence, not a fallback to speech.
    expect(drawnAtMount('power.notAPosition', drawn.legitimacyBanner)).toBeNull();
  });
});

/**
 * DS-POW-2 — the stability ladder. The arms below are shaped by what the PRODUCER actually
 * emits (governanceNarrative.js's authored labels), not by the pool keys alone: the whole
 * lesson of this file is that a suite can be green over a corpus no real state reaches.
 */
const POW2 = 'DS-POW-2';

/** Every stability label `governanceNarrative.js` can emit, and the pool each must reach. */
const REAL_STABILITY = Object.freeze([
  ['Stable', 'stable matched'],
  ['Stable (theocratic governance)', 'stable matched'],
  ['Unstable (pervasive organized crime)', 'unstable matched'],
  ['Unstable — criminal governance', 'unstable matched'],
  ['Volatile — power is available to whoever moves first', 'unstable matched'],
  ['Critical (active siege — survival priority)', 'siege matched'],
  ['Desperate — hunger is eroding order', 'Desperate matched'],
  // ⛔ THE REGRESSION PIN. A substring test for `stable` MATCHES "no stable governing
  // authority" and would print "The hall is settled" about a settlement that has none.
  ['Fractured — no stable governing authority', 'no token matched: unclassified (the plain-description floor)'],
  ['Shaken — institutional trust collapsed', 'no token matched: unclassified (the plain-description floor)'],
  ['Tense (external threat)', 'no token matched: unclassified (the plain-description floor)'],
  ['Anxious — disease is overriding normal authority', 'no token matched: unclassified (the plain-description floor)'],
  ['Suppressed (under occupation — resistance simmers)', 'no token matched: unclassified (the plain-description floor)'],
  ['Ordered (strong military presence)', 'no token matched: unclassified (the plain-description floor)'],
  ['Vulnerable (prosperous but underdefended)', 'no token matched: unclassified (the plain-description floor)'],
]);

/** A settlement carrying the DS-POW-2 slice. */
function ruled(stability, { factions = null, recentConflict = null, governingName = 'Merchant Council' } = {}) {
  return {
    name: 'Thornwall',
    _seed: 'seed-pow2',
    powerStructure: { stability, governingName, factions, recentConflict, publicLegitimacy: null },
  };
}

const DOMINANT_FACTIONS = Object.freeze([
  Object.freeze({ faction: 'Merchant Council', isGoverning: true, power: 60 }),
  Object.freeze({ faction: 'Craft Guilds', power: 20 }),
]);
// NARROW needs the governing faction to LEAD without outweighing the rest combined —
// otherwise DOMINANT correctly fires first, which is what the first draft of this fixture
// got wrong. 42 leads 40 by inside the 15% margin, and 40 + 20 out-weighs 42.
const NARROW_FACTIONS = Object.freeze([
  Object.freeze({ faction: 'Merchant Council', isGoverning: true, power: 42 }),
  Object.freeze({ faction: 'Craft Guilds', power: 40 }),
  Object.freeze({ faction: 'Arcane Orders', power: 20 }),
]);

describe('DS-POW-2 — the ladder is the producer\'s, and the substring bug stays dead', () => {
  it('every real stability label reaches the pool the corpus wrote for it', () => {
    for (const [label, key] of REAL_STABILITY) {
      expect(stabilityPoolKey(label), `label ${label}`).toBe(key);
      expect(POWER_POOLS2[key], `no such pool: ${key}`).toBeTruthy();
    }
  });

  it('⛔ REGRESSION: a negated token never matches — "no stable governing authority"', () => {
    // The exact defect, pinned from both sides.
    expect(stabilityPoolKey('Fractured — no stable governing authority'))
      .not.toBe('stable matched');
    // And a genuinely stable town still matches, or the pin is just a broken matcher.
    expect(stabilityPoolKey('Stable')).toBe('stable matched');
  });

  it('⚠ the CANONICAL reader carries that same substring defect — raised, not patched here', () => {
    // This is a defect in a SHIPPED canonical reader (simulationSpine.likelyFutureFacts):
    // it reports `continuity` for a settlement with no governing authority. Curing it
    // changes narrative output on lit surfaces for existing worlds, so it is the chair's,
    // not this desk's. Pinned so the day it IS cured, this arm reds and says so.
    expect(likelyFutureFacts({ powerStructure: { stability: 'Fractured — no stable governing authority' } }).arc)
      .toBe('continuity');
  });

  it('the desk REFINES the canonical arc rather than forking it', () => {
    // Every token this desk distinguishes must fall inside the canonical bucket that
    // contains it, so the two can differ in GRAIN but never about a settlement.
    const ARC_OF_POOL = {
      'stable matched': 'continuity',
      'unstable matched': 'test',
      'siege matched': 'crisis',
      'critical matched': 'crisis',
      'Desperate matched': 'crisis',
    };
    for (const [label, key] of REAL_STABILITY) {
      const arc = likelyFutureFacts({ powerStructure: { stability: label } }).arc;
      if (!ARC_OF_POOL[key]) continue;
      // The Fractured label is the ONE place the canonical reader is wrong; it is pinned
      // above and excluded here rather than silently tolerated.
      if (label.startsWith('Fractured')) continue;
      expect(arc, `${label} -> ${key}`).toBe(ARC_OF_POOL[key]);
    }
  });

  it('⚠ `critical matched` has NO producer today — declared, and pinned so it cannot hide', () => {
    // The only label carrying either token is `Critical (active siege — survival priority)`,
    // and most-specific-wins routes it to `siege matched`. So this pool is mounted and
    // unreachable. If a producer ever emits a critical stability WITHOUT a siege, this arm
    // reds and someone lights the pool instead of it staying quietly dead.
    const producerLabels = REAL_STABILITY.map(([l]) => l);
    const criticalWithoutSiege = producerLabels
      .filter((l) => /critical/i.test(l) && !/siege/i.test(l));
    expect(criticalWithoutSiege, 'a critical-without-siege label now exists — light `critical matched`').toEqual([]);
    // The pool is real, and the desk CAN reach it if such a label appears.
    expect(POWER_POOLS2['critical matched']).toBeTruthy();
    expect(stabilityPoolKey('Critical — the seat is failing')).toBe('critical matched');
  });
});

describe('DS-POW-2 — the share lens, and the silence in the middle', () => {
  it('DOMINANT is the corpus phrasing made arithmetic: governing outweighs the rest', () => {
    expect(governingSharePoolKey(DOMINANT_FACTIONS)).toBe('governing faction holds a DOMINANT share');
  });

  it('NARROW is a runner-up inside the vetoable 15% margin', () => {
    expect(governingSharePoolKey(NARROW_FACTIONS)).toBe('governing faction holds a NARROW plurality');
  });

  it('the ordinary middle renders NOTHING rather than being rounded into a band', () => {
    // Governing leads clearly but does not outweigh the rest, and the margin is wide.
    const middle = [
      { faction: 'Merchant Council', isGoverning: true, power: 40 },
      { faction: 'Craft Guilds', power: 30 },
      { faction: 'Arcane Orders', power: 25 },
    ];
    expect(governingSharePoolKey(middle)).toBeNull();
    // And a governing faction that is not even the largest holds neither band.
    expect(governingSharePoolKey([
      { faction: 'Merchant Council', isGoverning: true, power: 10 },
      { faction: 'Craft Guilds', power: 50 },
    ])).toBeNull();
    expect(governingSharePoolKey([])).toBeNull();
    expect(governingSharePoolKey(null)).toBeNull();
  });

  it('LENS ORDER: a recent conflict speaks before the share, so both stay reachable', () => {
    // The share is determinate for almost every generated town, so preferring it would
    // leave `recentConflict present` reachable only on the rare town with no share.
    expect(stabilityLensPoolKey('a quarrel over the levy', DOMINANT_FACTIONS))
      .toBe('recentConflict present');
    // THE CONTROL: same factions, no conflict ⇒ the share speaks, proving the ORDER.
    expect(stabilityLensPoolKey(null, DOMINANT_FACTIONS))
      .toBe('governing faction holds a DOMINANT share');
  });
});

describe('DS-POW-2 — ALIVENESS: all nine pools fire, and {seat} stays deliberately unfilled', () => {
  it('every one of the nine pools renders a real sentence over a state the generator builds', () => {
    const CASES = [
      ['stable matched', ruled('Stable', { factions: DOMINANT_FACTIONS })],
      ['unstable matched', ruled('Unstable — criminal governance', { factions: DOMINANT_FACTIONS })],
      ['siege matched', ruled('Critical (active siege — survival priority)', { factions: DOMINANT_FACTIONS })],
      ['Desperate matched', ruled('Desperate — hunger is eroding order', { factions: DOMINANT_FACTIONS })],
      ['no token matched: unclassified (the plain-description floor)', ruled('Tense (external threat)', { factions: DOMINANT_FACTIONS })],
      ['critical matched', ruled('Critical — the seat is failing', { factions: DOMINANT_FACTIONS })],
    ];
    for (const [key, settlement] of CASES) {
      const drawn = powerStateProse(settlement, { seed: `p2-${key}` });
      expect(drawn.stabilityHeader, `no rung for ${key}`).toBeTruthy();
      expect(drawn.stabilityHeader.provenance).toEqual(
        expect.objectContaining({ blockId: POW2, poolKey: key }),
      );
      expect(drawn.stabilityHeader.sentence, `silent pool ${key}`).toBeTruthy();
      expect(drawn.stabilityHeader.sentence).not.toMatch(/[{}]/);
      expect(drawn.stabilityHeader.sentence).not.toMatch(/[0-9]/);
    }
    // The three lens pools, each over its own state.
    const dominant = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), { seed: 'd' });
    const narrow = powerStateProse(ruled('Stable', { factions: NARROW_FACTIONS }), { seed: 'n' });
    const conflict = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS, recentConflict: 'a quarrel over the levy' }), { seed: 'c' });
    expect(dominant.stabilityLens.provenance.poolKey).toBe('governing faction holds a DOMINANT share');
    expect(narrow.stabilityLens.provenance.poolKey).toBe('governing faction holds a NARROW plurality');
    expect(conflict.stabilityLens.provenance.poolKey).toBe('recentConflict present');
    for (const d of [dominant, narrow, conflict]) expect(d.stabilityLens.sentence).toBeTruthy();
  });

  it('{seat} is UNFILLED for DS-POW-2, so no line reads "X at Thornwall is X\'s"', () => {
    // {seat} is the governing BODY in DS-POW-1 and the HALL in DS-POW-2. One fill cannot
    // serve both, and there is no hall-name producer, so DS-POW-2 supplies {faction} only.
    // Anchored liveness drops the seat-naming variants; MEASURED, all nine pools survive.
    const seen = new Set();
    for (let i = 0; i < 60; i += 1) {
      const drawn = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), { seed: `s${i}` });
      const line = drawn.stabilityHeader?.sentence;
      if (line) seen.add(line);
    }
    expect(seen.size).toBeGreaterThan(1);
    for (const line of seen) {
      expect(line, 'a doubled name reached the reader').not.toMatch(/Merchant Council at Thornwall is Merchant Council/);
      expect(line).not.toMatch(/[{}]/);
    }
  });

  it('an absent stability label is silence, and DS-POW-1 is unaffected by DS-POW-2', () => {
    expect(powerStateProse(ruled(null)).stabilityHeader).toBeNull();
    expect(powerStateProse(ruled('')).stabilityHeader).toBeNull();
    expect(powerStateProse(undefined).stabilityHeader).toBeNull();
    // The two blocks are independent: a legitimacy-less town still gets its ladder line.
    const drawn = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), { seed: 'x' });
    expect(drawn.legitimacyBanner).toBeNull();
    expect(drawn.stabilityHeader.sentence).toBeTruthy();
  });

  it('the registry mounts DS-POW-2 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW2);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.stabilityHeader', tab: 'power', desk: 'power', rung: 'sentence' });
    expect(sentenceMountForBlock(POW2)?.mount).toBe('power.stabilityHeader');
    expect(UNMOUNTED_BLOCKS).not.toContain(POW2);
  });
});
