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
import { CRIMINAL_OP_ROLES, criminalOpEcon } from '../../src/domain/criminalOpRole.js';
import { COUP_RISK_LABELS, coupRiskLabel } from '../../src/domain/rulingPowerCoup.js';
import { mirrorOf } from '../../src/domain/worldPulse/npcLadderState.js';
import {
  ECONOMIC_BASES, RULING_POWERS, structuralLens, structuralLensOf,
} from '../../src/domain/spatial/cohesionWeave.js';
import { hasLadder, ladderInstabilityOf, ladderRungsOf } from '../../src/domain/townMap/ladderRead.js';
import { hasPolitics, settlementBlocs as politicsBlocsOf } from '../../src/domain/display/politicsRead.js';
import {
  capturePoolKey, legitimacyHoldPoolKey, legitimacyReadingPoolKey,
  ladderPoolKey, operationRolePoolKey, politicsEndPoolKey, politicsGluePoolKey,
  politicsPresencePoolKey, powerLadderRung, riskPoolKey, rulingPowerPoolKey,
} from '../../src/domain/display/stateProse/powerStateProse.js';
import { legitimacyBandFor } from '../../src/generators/factionDynamics.js';
import {
  parseSlotShapes, mergeSlotShapes, fillShapeViolation,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import {
  DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, drawnAtMount, sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';
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
      const drawn = powerStateProse(town(record), {}, { seed: 'seed-alpha' });
      const rung = BAND_LABELS.includes(key) ? drawn.legitimacyBanner : drawn.legitimacyLens;
      expect(rung, `the pool is mounted and the desk produced no rung for ${key}`).toBeTruthy();
      expect(rung.provenance, `provenance for ${key}`).toEqual(
        expect.objectContaining({ blockId: BLOCK, poolKey: key }),
      );
      // THE ARM THAT WOULD CATCH A LIT-BUT-INCAPABLE BLOCK: a real, filled sentence.
      expect(typeof rung.sentence, `sentence type for ${key}`).toBe('string');
      expect(rung.sentence.length, `sentence length for ${key}`).toBeGreaterThan(20);
      // No slot survived unfilled, and no engine token reached the reader.
      // The two assertions directly above pin THIS `rung.sentence` as a string of length
      // > 20, so a silenced or emptied sentence reds there and can never reach these
      // three absence checks to satisfy them by having nothing to say.
      // anchored: `rung.sentence` is pinned a string of length > 20 two lines up
      expect(rung.sentence, `unfilled slot in ${key}`).not.toMatch(/[{}]/);
      // anchored: same sentence, pinned non-empty by the length assertion above
      expect(rung.sentence, `engine token in ${key}`).not.toMatch(/[a-z]+_[a-z]+/);
      // §0d — the prose bands the figure, it never prints one.
      // anchored: same sentence, pinned non-empty by the length assertion above
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
    const drawn = powerStateProse(legacy, {}, { seed: 's' });
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
        {}, { seed: `s${score}` },
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
    const drawn = powerStateProse(bad, {}, { seed: 'seed-alpha' });
    // Endorsed carries one {settlement}-only variant, so the surface still speaks.
    expect(drawn.legitimacyBanner.sentence).toBeTruthy();
    // The line above pins this same sentence non-empty, so "the raw token did not reach
    // the reader" cannot be satisfied by the surface having gone silent.
    // anchored: the same sentence is pinned truthy on the line above
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
    const a = powerStateProse(state(), {}, { seed: 'seed-alpha' });
    const b = powerStateProse(state(), {}, { seed: 'seed-alpha' });
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
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, BLOCK, A_DARK_SIBLING, 'DS-POW-1 is mounted, so the dark half must not name it',
    );
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

const FLOOR = 'no token matched: unclassified (the plain-description floor)';

/**
 * Every stability label `governanceNarrative.js` can emit TODAY, and the pool each must
 * reach. ⭐ RE-SYNCED AT LT41b RULING 3 (the chair, 2026-09-15), which collapsed the
 * producer's three separator conventions onto ONE, `<Band> (<gloss>)`. This table's
 * contract is PRODUCER FIDELITY — "what the producer actually emits, not the pool keys
 * alone" — so it moves when the producer moves, and RETIRED_STABILITY below carries the
 * spellings it used to hold.
 * ⚠ ONE ROW WAS ALREADY UNFAITHFUL BEFORE THIS RE-SYNC, and it is corrected here rather
 * than carried: the Suppressed row read `(under occupation — resistance simmers)` while
 * the producer has written a COLON since the label was authored. Nothing depended on it
 * (both spellings floor-match), which is exactly how a fidelity table rots.
 */
const REAL_STABILITY = Object.freeze([
  ['Stable', 'stable matched'],
  ['Stable (theocratic governance)', 'stable matched'],
  ['Unstable (pervasive organized crime)', 'unstable matched'],
  ['Unstable (criminal governance)', 'unstable matched'],
  // ⚠ SIX ROWS THE TABLE NEVER HAD, ADDED HERE SO ITS OWN SENTENCE IS TRUE. The header
  // has always said "every stability label governanceNarrative.js can emit"; MEASURED by
  // extracting the literals the three stability functions return, the producer emits 21
  // and this table held 15 of them. Every one of the six lands on the floor, which is why
  // nothing noticed — and a fidelity table that is quietly missing a quarter of its
  // producer cannot red when a NEW label arrives that the ladder should have caught.
  // It is now 21 of 21, plus one composed monster-threat fold.
  ['Enforced Order (authoritarian)', FLOOR],
  ['Rigid (militant theocracy)', FLOOR],
  ['Fragile (private security, no public law)', FLOOR],
  ['Tense (militarised, chronically underfunded)', FLOOR],
  ['Strained (debt obligations constrain every decision)', FLOOR],
  ['Tense (monster pressure from surrounding region)', FLOOR],
  ['Volatile (power is available to whoever moves first)', 'unstable matched'],
  ['Critical (active siege, survival priority)', 'siege matched'],
  ['Desperate (hunger is eroding order)', 'Desperate matched'],
  // ⛔ THE REGRESSION PIN. A substring test for `stable` MATCHES "no stable governing
  // authority" and would print "The hall is settled" about a settlement that has none.
  ['Fractured (no stable governing authority)', FLOOR],
  ['Shaken (institutional trust collapsed)', FLOOR],
  ['Tense (external threat)', FLOOR],
  ['Anxious (disease is overriding normal authority)', FLOOR],
  ['Suppressed (under occupation: resistance simmers)', FLOOR],
  ['Ordered (strong military presence)', FLOOR],
  ['Vulnerable (prosperous but underdefended)', FLOOR],
  // The monster-threat note folds into the gloss rather than hanging off a semicolon.
  ['Unstable (criminal governance, monster threat active)', 'unstable matched'],
  ['Tense (regional monster threat)', FLOOR],
]);

/**
 * ⛔ THE RETIRED SPELLINGS, AND WHY THEY ARE A PIN RATHER THAN HISTORY. The stability
 * label is PERSISTED on `powerStructure.stability`, there is NO migration and NO save
 * rewrite (every existing world is test data — the owner's law), so EVERY save written
 * before LT41b RULING 3 still carries one of these and still arrives at this reader.
 * `stabilityPoolKey` takes the label's FIRST WORD and pre-tests `\bsiege\b`, so it never
 * read the separator — but "never read it" is a property, and a property that is not
 * pinned is a property that gets optimised away. Each row must reach THE SAME POOL as its
 * live twin above.
 */
const RETIRED_STABILITY = Object.freeze([
  ['Unstable — criminal governance', 'unstable matched'],
  ['Volatile — power is available to whoever moves first', 'unstable matched'],
  ['Critical (active siege — survival priority)', 'siege matched'],
  ['Desperate — hunger is eroding order', 'Desperate matched'],
  ['Fractured — no stable governing authority', FLOOR],
  ['Shaken — institutional trust collapsed', FLOOR],
  ['Anxious — disease is overriding normal authority', FLOOR],
  ['Strained — debt obligations constrain every decision', FLOOR],
  ['Tense — regional monster threat', FLOOR],
  // The retired `<Band>; <note>` annotation form, on both of its own spellings.
  ['Unstable — criminal governance; monster threat active', 'unstable matched'],
  ['Unstable (pervasive organized crime); monster threat active', 'unstable matched'],
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
    // And every RETIRED spelling still on a persisted save reaches the SAME pool as its
    // live twin. The separator changed; the reading must not have.
    for (const [label, key] of RETIRED_STABILITY) {
      expect(stabilityPoolKey(label), `retired label ${label}`).toBe(key);
    }
    // The pin is not vacuous in the direction that matters: the two tables must actually
    // differ, or a copy-paste would make the tolerance arm assert nothing new.
    const live = new Set(REAL_STABILITY.map(([l]) => l));
    expect(RETIRED_STABILITY.filter(([l]) => live.has(l)), 'a retired spelling is still live')
      .toEqual([]);
  });

  it('⛔ REGRESSION: a negated token never matches — "no stable governing authority"', () => {
    // The exact defect, pinned from both sides.
    expect(stabilityPoolKey('Fractured — no stable governing authority'))
      .not.toBe('stable matched');
    // And a genuinely stable town still matches, or the pin is just a broken matcher.
    expect(stabilityPoolKey('Stable')).toBe('stable matched');
  });

  it('⭐ the CANONICAL reader is CURED: a negated token no longer forces a trajectory', () => {
    // This arm previously pinned the DEFECT — likelyFutureFacts reported `continuity` for
    // a settlement with no governing authority, because it substring-tested for `stable`
    // and "no stable governing authority" contains it. The chair ruled it a repair (the
    // world is unchanged; only what the reader SAYS about it was wrong), it was cured in
    // simulationSpine.js by matching the label's first word against closed token sets, and
    // this arm now pins the CURED behaviour so the defect cannot return.
    expect(likelyFutureFacts({ powerStructure: { stability: 'Fractured — no stable governing authority' } }).arc)
      .toBeNull();
    // The cure must not have broken the classifications that were already right — the
    // ordered-ladder property the old comment protected still holds under first-word
    // matching, and is pinned here as a PROPERTY rather than as a sequence.
    const arcOf = (label) => likelyFutureFacts({ powerStructure: { stability: label } }).arc;
    expect(arcOf('Stable')).toBe('continuity');
    expect(arcOf('Unstable (pervasive organized crime)')).toBe('test');
    expect(arcOf('Volatile (power is available to whoever moves first)')).toBe('test');
    expect(arcOf('Critical (active siege, survival priority)')).toBe('crisis');
    expect(arcOf('Desperate (hunger is eroding order)')).toBe('crisis');
    // A monster-threat annotation must not move the classification, in EITHER spelling:
    // the live one folds the note into the gloss, and every save written before LT41b
    // RULING 3 carries the retired semicolon form and still arrives here.
    expect(arcOf('Unstable (criminal governance, monster threat active)')).toBe('test');
    expect(arcOf('Unstable — criminal governance; monster threat active')).toBe('test');
    // And the retired ` — ` spellings classify exactly as their live twins do.
    expect(arcOf('Volatile — power is available to whoever moves first')).toBe('test');
    expect(arcOf('Critical (active siege — survival priority)')).toBe('crisis');
    expect(arcOf('Desperate — hunger is eroding order')).toBe('crisis');
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
      // Fractured needed excluding while the canonical reader was WRONG about it. Since
      // the cure it is honestly unclassified there and floor-matched here, so it no longer
      // reaches this loop at all (ARC_OF_POOL has no entry for the floor) and needs no
      // special case. The exclusion is deliberately GONE rather than left as dead cover.
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
      ['unstable matched', ruled('Unstable (criminal governance)', { factions: DOMINANT_FACTIONS })],
      ['siege matched', ruled('Critical (active siege, survival priority)', { factions: DOMINANT_FACTIONS })],
      ['Desperate matched', ruled('Desperate (hunger is eroding order)', { factions: DOMINANT_FACTIONS })],
      ['no token matched: unclassified (the plain-description floor)', ruled('Tense (external threat)', { factions: DOMINANT_FACTIONS })],
      // `critical matched` has no producer; this label is the SHAPE a future one would
      // take, so it is spelled in the live convention rather than the retired one.
      ['critical matched', ruled('Critical (the seat is failing)', { factions: DOMINANT_FACTIONS })],
    ];
    for (const [key, settlement] of CASES) {
      const drawn = powerStateProse(settlement, {}, { seed: `p2-${key}` });
      expect(drawn.stabilityHeader, `no rung for ${key}`).toBeTruthy();
      expect(drawn.stabilityHeader.provenance).toEqual(
        expect.objectContaining({ blockId: POW2, poolKey: key }),
      );
      expect(drawn.stabilityHeader.sentence, `silent pool ${key}`).toBeTruthy();
      // The `silent pool` assertion above pins this same sentence non-empty for this key,
      // so neither absence check below can pass on a surface that went dark.
      // anchored: the same sentence is pinned truthy by `silent pool ${key}` above
      expect(drawn.stabilityHeader.sentence).not.toMatch(/[{}]/);
      // anchored: same sentence, pinned non-empty by the `silent pool` assertion above
      expect(drawn.stabilityHeader.sentence).not.toMatch(/[0-9]/);
    }
    // The three lens pools, each over its own state.
    const dominant = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), {}, { seed: 'd' });
    const narrow = powerStateProse(ruled('Stable', { factions: NARROW_FACTIONS }), {}, { seed: 'n' });
    const conflict = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS, recentConflict: 'a quarrel over the levy' }), {}, { seed: 'c' });
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
      const drawn = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), {}, { seed: `s${i}` });
      const line = drawn.stabilityHeader?.sentence;
      if (line) seen.add(line);
    }
    expect(seen.size).toBeGreaterThan(1);
    for (const line of seen) {
      // `seen.size` is pinned > 1 above and every member of `seen` is a rendered line, so
      // this loop cannot run zero times over a dead producer — an empty draw reds at that
      // assertion rather than passing both checks here.
      // anchored: `seen` is pinned non-empty (size > 1) before this loop
      expect(line, 'a doubled name reached the reader').not.toMatch(/Merchant Council at Thornwall is Merchant Council/);
      // anchored: same live `seen` set, pinned non-empty above
      expect(line).not.toMatch(/[{}]/);
    }
  });

  it('an absent stability label is silence, and DS-POW-1 is unaffected by DS-POW-2', () => {
    expect(powerStateProse(ruled(null)).stabilityHeader).toBeNull();
    expect(powerStateProse(ruled('')).stabilityHeader).toBeNull();
    expect(powerStateProse(undefined).stabilityHeader).toBeNull();
    // The two blocks are independent: a legitimacy-less town still gets its ladder line.
    const drawn = powerStateProse(ruled('Stable', { factions: DOMINANT_FACTIONS }), {}, { seed: 'x' });
    expect(drawn.legitimacyBanner).toBeNull();
    expect(drawn.stabilityHeader.sentence).toBeTruthy();
  });

  it('the registry mounts DS-POW-2 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW2);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.stabilityHeader', tab: 'power', desk: 'power', rung: 'sentence' });
    expect(sentenceMountForBlock(POW2)?.mount).toBe('power.stabilityHeader');
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, POW2, A_DARK_SIBLING, 'DS-POW-2 is mounted, so the dark half must not name it',
    );
  });
});

/** DS-POW-6 — the criminal underside. */
const POW6 = 'DS-POW-6';
const POW6_POOLS = DOSSIER_STATE_PROSE_POWER[POW6].pools;

function underside(legitimacy, captureState, operations = []) {
  return {
    name: 'Thornwall',
    _seed: 'seed-pow6',
    powerStructure: { publicLegitimacy: legitimacy, governingName: 'Merchant Council', criminalCaptureState: captureState },
    economicState: { safetyProfile: { criminalInstitutions: operations } },
  };
}
const BREAK = (b) => ({ score: 50, label: 'Tolerated', breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0, ...b }, governanceFractured: false });

describe('DS-POW-6 — the operation role is an IDENTITY with the producer', () => {
  it('every role criminalOpEcon can emit has a pool, and the roster is TOTAL', () => {
    // Pinned against the producer's own exported roster, never a hand list beside it.
    expect(CRIMINAL_OP_ROLES).toHaveLength(7);
    for (const role of CRIMINAL_OP_ROLES) {
      const key = role === 'criminal revenue stream'
        ? 'operation role criminal revenue stream (unclassified)'
        : `operation role ${role}`;
      expect(POW6_POOLS[key], `no pool for role ${role}`).toBeTruthy();
    }
    // And the corpus holds no operation-role pool the producer cannot emit.
    const corpusRoles = Object.keys(POW6_POOLS).filter((k) => k.startsWith('operation role'));
    expect(corpusRoles).toHaveLength(CRIMINAL_OP_ROLES.length);
  });

  it('each named operation reaches its own pool, the fallback included', () => {
    const NAMES = [
      ['Black Market Ring', 'operation role parallel marketplace'],
      ['Smuggling Operation', 'operation role duty evasion'],
      ['Gambling Den', 'operation role unlicensed revenue'],
      ['Front Business', 'operation role money laundering'],
      ['Fence Network', 'operation role stolen goods market'],
      ['Thieves Guild', 'operation role protection + extraction'],
      ['Odd Syndicate', 'operation role criminal revenue stream (unclassified)'],
    ];
    for (const [name, key] of NAMES) {
      expect(operationRolePoolKey(name), name).toBe(key);
      // The desk really renders it, rather than merely computing a key.
      const drawn = powerStateProse(underside(BREAK({}), 'equilibrium', [name]), { seed: `op-${name}` });
      expect(drawn.operationReading?.sentence, `silent for ${name}`).toBeTruthy();
      expect(drawn.operationReading.provenance.poolKey).toBe(key);
    }
    expect(operationRolePoolKey('')).toBeNull();
    expect(operationRolePoolKey(null)).toBeNull();
  });
});

describe('DS-POW-6 — the capture pools are COVERT, and that is the kernel working', () => {
  it('all four capture pools are wholly dm-only in the shipped corpus', () => {
    // The measurement the desk depends on. If the corpus ever un-marks one, this reds and
    // the audience decision gets revisited deliberately rather than by surprise.
    for (const key of [
      'capture pressure ADVANCING (weak security, poor prosperity)',
      'capture pressure RECOVERING (strong security, prosperity)',
      'capture reached an AGENT of a faction',
      'capture reached a LEADER',
    ]) {
      const pool = POW6_POOLS[key];
      expect(pool.every((v) => (v.marks || []).includes('dm-only')), `${key} is not wholly covert`).toBe(true);
    }
  });

  it('FAIL-CLOSED: the player sees silence, the DM sees the line', () => {
    const state = underside(BREAK({ prosperity: -10, safety: -12 }), 'capture');
    expect(powerStateProse(state, {}, { seed: 'a' }).captureReading?.sentence ?? null).toBeNull();
    expect(powerStateProse(state, {}, { seed: 'a', audience: 'player' }).captureReading?.sentence ?? null).toBeNull();
    const dm = powerStateProse(state, {}, { seed: 'a', audience: 'dm' });
    expect(dm.captureReading.sentence).toBeTruthy();
    expect(dm.captureReading.provenance.poolKey).toBe('capture reached a LEADER');
  });

  it('the AGENT/LEADER split is grounded in the shipped capture labels', () => {
    // No person-level captured-role record exists; the two top rungs already say which it
    // is — `corrupted` renders as "Corrupted Officials", `capture` as "Governance Captured".
    expect(capturePoolKey('capture', { prosperity: 0, safety: 0 })).toBe('capture reached a LEADER');
    expect(capturePoolKey('corrupted', { prosperity: 0, safety: 0 })).toBe('capture reached an AGENT of a faction');
  });

  it('pressure direction reads the CANONICAL contributions, and a mixed pair is silence', () => {
    expect(capturePoolKey('equilibrium', { safety: -12, prosperity: -10 }))
      .toBe('capture pressure ADVANCING (weak security, poor prosperity)');
    expect(capturePoolKey('none', { safety: 8, prosperity: 15 }))
      .toBe('capture pressure RECOVERING (strong security, prosperity)');
    // Mixed and flat are neither direction — the corpus wrote no sentence for them.
    expect(capturePoolKey('none', { safety: -12, prosperity: 15 })).toBeNull();
    expect(capturePoolKey('none', { safety: 0, prosperity: 0 })).toBeNull();
    expect(capturePoolKey('none', null)).toBeNull();
  });
});

describe('DS-POW-6 — the reading lens TILES with DS-POW-1 rather than overlapping it', () => {
  it('no legitimacy record at all ⇒ the "no reading" pool', () => {
    const drawn = powerStateProse(underside(null, 'none'), {}, { seed: 'r' });
    expect(drawn.legitimacyReading.provenance.poolKey).toBe('present: false (no legitimacy reading)');
    expect(drawn.legitimacyReading.sentence).toBeTruthy();
    // DS-POW-1 is correctly silent there, so the page is not saying two things at once.
    expect(drawn.legitimacyBanner).toBeNull();
  });

  it('a flat breakdown is exactly where DS-POW-1 goes quiet, and DS-POW-6 speaks', () => {
    const flat = underside(BREAK({}), 'none');
    const drawn = powerStateProse(flat, {}, { seed: 'r' });
    // DS-POW-1's LENS is silent on an all-zero breakdown (measured in its own arm above)…
    expect(drawn.legitimacyLens).toBeNull();
    // …and DS-POW-6 owns that cell.
    expect(drawn.legitimacyReading.provenance.poolKey).toBe('neutral baseline (nothing pulling either way)');
    expect(drawn.legitimacyReading.sentence).toBeTruthy();
  });

  it('a breakdown that IS pulling leaves the reading lens silent — no double narration', () => {
    const pulling = underside(BREAK({ prosperity: -20 }), 'none');
    expect(legitimacyReadingPoolKey({ present: true }, BREAK({ prosperity: -20 }))).toBeNull();
    const drawn = powerStateProse(pulling, {}, { seed: 'r' });
    expect(drawn.legitimacyReading).toBeNull();
  });

  it('the registry mounts DS-POW-6 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW6);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.criminalUnderside', tab: 'power', desk: 'power', rung: 'sentence' });
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, POW6, A_DARK_SIBLING, 'DS-POW-6 is mounted, so the dark half must not name it',
    );
  });

  it('ALIVENESS: all thirteen pools fire across the two audiences', () => {
    const reached = new Set();
    const cases = [
      underside(null, 'none'),
      underside(BREAK({}), 'none'),
      underside(BREAK({ prosperity: -10, safety: -12 }), 'equilibrium'),
      underside(BREAK({ prosperity: 15, safety: 8 }), 'none'),
      underside(BREAK({ prosperity: -10, safety: -12 }), 'corrupted'),
      underside(BREAK({ prosperity: -10, safety: -12 }), 'capture'),
      ...['Black Market Ring', 'Smuggling Operation', 'Gambling Den', 'Front Business',
        'Fence Network', 'Thieves Guild', 'Odd Syndicate']
        .map((n) => underside(BREAK({}), 'equilibrium', [n])),
    ];
    for (const state of cases) {
      for (const audience of ['dm', 'player']) {
        const drawn = powerStateProse(state, {}, { seed: 'aliveness', audience });
        for (const rung of ['legitimacyReading', 'captureReading', 'operationReading']) {
          const line = drawn[rung];
          if (line?.sentence) reached.add(line.provenance.poolKey);
        }
      }
    }
    expect(reached.size, `unreached: ${Object.keys(POW6_POOLS).filter((k) => !reached.has(k))}`)
      .toBe(Object.keys(POW6_POOLS).length);
    expect(Object.keys(POW6_POOLS)).toHaveLength(13);
  });
});

/** DS-POW-4 — rule and succession. */
const POW4 = 'DS-POW-4';
const POW4_POOLS = DOSSIER_STATE_PROSE_POWER[POW4].pools;

function seat(govMultiplier, previousGovernments = []) {
  return {
    name: 'Thornwall',
    _seed: 'seed-pow4',
    powerStructure: {
      publicLegitimacy: {
        score: 50, label: 'Tolerated', govMultiplier,
        breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0 },
      },
      governingName: 'Merchant Council',
      previousGovernments,
    },
  };
}
const CONTENDERS = Object.freeze({
  challengers: Object.freeze([Object.freeze({ name: 'Craft Guilds', weight: 60 })]),
  incumbent: Object.freeze({ gated: true, amplifiedWeight: 50 }),
});

describe('DS-POW-4 — the lifted risk ladder is the ONE derivation', () => {
  it('the lift is behaviour-identical to the inline logic it replaced, on all four branches', () => {
    // The ORACLE is the original inline four-way, transcribed from EngineSections.jsx as it
    // stood before the lift. A lift is only a lift if it cannot change an answer.
    const original = (c) => {
      let risk = 'Stable';
      if (c.challengers.length) {
        if (!c.incumbent.gated) risk = 'Critical. The seat could fall';
        else if (c.incumbent.amplifiedWeight < c.challengers[0].weight) risk = 'Contested';
        else risk = 'Holding';
      }
      return risk;
    };
    const cases = [
      { challengers: [], incumbent: { gated: true, amplifiedWeight: 50 } },
      { challengers: [{ weight: 60 }], incumbent: { gated: false, amplifiedWeight: 50 } },
      { challengers: [{ weight: 60 }], incumbent: { gated: true, amplifiedWeight: 50 } },
      { challengers: [{ weight: 40 }], incumbent: { gated: true, amplifiedWeight: 50 } },
      { challengers: [{ weight: 50 }], incumbent: { gated: true, amplifiedWeight: 50 } },
    ];
    const reached = new Set();
    for (const c of cases) {
      expect(coupRiskLabel(c), JSON.stringify(c)).toBe(original(c));
      reached.add(coupRiskLabel(c));
    }
    // Non-vacuity: the oracle and the lift must have exercised the WHOLE vocabulary.
    expect([...reached].sort()).toEqual([...COUP_RISK_LABELS].sort());
    // Defensive, because a desk reading is allowed to be absent.
    expect(coupRiskLabel(null)).toBe('Stable');
    expect(coupRiskLabel(undefined)).toBe('Stable');
  });

  it('every label the ladder emits has a pool, and the corpus has no risk pool it cannot emit', () => {
    for (const label of COUP_RISK_LABELS) {
      const key = riskPoolKey(label);
      expect(key, `no pool for risk label ${label}`).toBeTruthy();
      expect(POW4_POOLS[key], `corpus lacks ${key}`).toBeTruthy();
    }
    const corpusRisk = Object.keys(POW4_POOLS).filter((k) => k.startsWith('riskLabel:'));
    expect(corpusRisk).toHaveLength(COUP_RISK_LABELS.length);
    // An unknown label renders nothing rather than guessing a rung.
    expect(riskPoolKey('Doomed')).toBeNull();
    expect(riskPoolKey('')).toBeNull();
  });
});

describe('DS-POW-4 — the risk ladder arrives as a READING, never as an import', () => {
  it('no contenders handed over ⇒ the risk lens is silent and the other two still speak', () => {
    // The desk does not reach for coupContenders: that would drag 13.9 KB behind four
    // transitive imports into this leaf and break the reference desk's own law.
    const drawn = powerStateProse(seat(1.3, [{ cause: 'a coup' }]), {}, { seed: 'x' });
    expect(drawn.successionRisk).toBeNull();
    expect(drawn.successionHold?.sentence).toBeTruthy();
  });

  it('with the reading handed over, the risk lens speaks and cites the right pool', () => {
    const drawn = powerStateProse(
      seat(1.0), { contenders: CONTENDERS, riskLabel: coupRiskLabel(CONTENDERS) }, { seed: 'x' },
    );
    expect(drawn.successionRisk.provenance).toEqual(
      expect.objectContaining({ blockId: POW4, poolKey: 'riskLabel: Contested' }),
    );
    expect(drawn.successionRisk.sentence).toBeTruthy();
    // {counterpart} is the top challenger, and it reaches the reader by name. Only ONE of
    // the four Contested variants names it, so the draw is swept across enough seeds to
    // reach that variant — nine were not enough, which is itself the reason this is a sweep
    // rather than a single read.
    const named = new Set();
    for (let i = 0; i < 60; i += 1) {
      const line = powerStateProse(
        seat(1.0), { contenders: CONTENDERS, riskLabel: 'Contested' }, { seed: `cp-${i}` },
      ).successionRisk?.sentence;
      if (line) named.add(line);
    }
    expect(named.size, 'the pool drew only one variant across sixty seeds').toBeGreaterThan(1);
    expect([...named].some((line) => line.includes('Craft Guilds'))).toBe(true);
    // And no line leaks an unfilled slot while the challenger is absent.
    const anon = powerStateProse(
      seat(1.0), { contenders: { challengers: [] }, riskLabel: 'Contested' }, { seed: 'cp-x' },
    ).successionRisk?.sentence;
    // THE LIVENESS ANCHOR for the guarded negative below. `anon` is allowed to be null —
    // the pool may correctly refuse every {counterpart}-naming variant when there is no
    // challenger — so `if (anon)` could skip the check entirely and the arm would pass
    // over a wholly dead desk. This renders the SAME seed and pool WITH a challenger and
    // requires a sentence, so a null `anon` is a refusal we have proved is deliberate.
    const withChallenger = powerStateProse(
      seat(1.0), { contenders: CONTENDERS, riskLabel: 'Contested' }, { seed: 'cp-x' },
    ).successionRisk?.sentence;
    expect(withChallenger, 'the pool is silent even WITH a challenger — the desk is dark').toBeTruthy();
    // anchored: `withChallenger` above proves this seed and pool render at all
    if (anon) expect(anon).not.toMatch(/[{}]/);
  });
});

describe('DS-POW-4 — the hold lens needs no new reader, and the lineage needs a cause', () => {
  it('govMultiplier position relative to 1 IS the reading', () => {
    // The band's own multiplier: 1.30 / 1.15 / 1.00 / 0.80 / 0.60.
    expect(legitimacyHoldPoolKey(1.3)).toBe('legitimacyHold: public backing hardens the hold');
    expect(legitimacyHoldPoolKey(1.15)).toBe('legitimacyHold: public backing hardens the hold');
    expect(legitimacyHoldPoolKey(1.0)).toBe('legitimacyHold: public opinion neither helps nor hurts');
    expect(legitimacyHoldPoolKey(0.8)).toBe('legitimacyHold: public rejection is breaking the hold');
    expect(legitimacyHoldPoolKey(0.6)).toBe('legitimacyHold: public rejection is breaking the hold');
    // Absent or non-numeric is silence, never a band.
    expect(legitimacyHoldPoolKey(undefined)).toBeNull();
    expect(legitimacyHoldPoolKey('1.3')).toBeNull();
    expect(legitimacyHoldPoolKey(Number.NaN)).toBeNull();
  });

  it('⛔ the two LINEAGE pools are dark, and the desk reads the field NOWHERE', () => {
    // `powerStructure.previousGovernments` has no generation-time writer — it is written
    // only by a play-time power transfer — so `check-observed-shape-readers` convicts a
    // fresh read of it as an arm dead on every generated world. Lighting these two needs an
    // M8/M9 explained-writer row, which is a REGISTER act and the chair's. Until then the
    // pools stay dark BY DECLARATION and this arm proves the desk does not read the key.
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/powerStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expectAbsentWithAnchor(
      code, 'previousGovernments', 'export function powerStateProse',
      'the desk reads a key no generator writes',
    );
    // The pools exist and remain unmounted-in-effect, recorded so nobody re-finds them.
    expect(POW4_POOLS['previousGovernments present with a recorded cause']).toBeTruthy();
    expect(POW4_POOLS['previousGovernments empty (no recorded lineage)']).toBeTruthy();
  });

  it('ALIVENESS: all nine pools fire, with {timeband_age} left deliberately unfilled', () => {
    const reached = new Set();
    for (const label of COUP_RISK_LABELS) {
      for (const gm of [1.3, 1.0, 0.6]) {
        for (const previous of [[{ cause: 'a coup' }], [], [{}]]) {
          const drawn = powerStateProse(
            seat(gm, previous),
            { contenders: CONTENDERS, riskLabel: label },
            { seed: `p4-${label}-${gm}` },
          );
          for (const rung of ['successionRisk', 'successionHold']) {
            const line = drawn[rung];
            if (line?.sentence) reached.add(line.provenance.poolKey);
            if (line) expect(line.sentence, `${rung} for ${label}`).toBeTruthy();
          }
        }
      }
    }
    // SEVEN of nine. The two lineage pools are dark by declaration (see the arm above), and
    // stating the number here is what stops a later reader assuming all nine were wired.
    expect(reached.size, `unreached: ${Object.keys(POW4_POOLS).filter((k) => !reached.has(k))}`).toBe(7);
    expect(Object.keys(POW4_POOLS)).toHaveLength(9);
    // {timeband_age} is named by ONE variant of 29. It stays unfilled, anchored liveness
    // drops that single variant, and the count above proves no POOL is lost by it.
    //
    // ⛔ THE REASON THIS COMMENT USED TO GIVE — "no duration former anywhere in the tree" —
    // IS FALSE. `heraldCausalGrammar.js`'s timeBandOf/timeBandWord IS that former: a
    // zero-import display leaf whose six-band × four-position table matches §0d cell for
    // cell in both annexes (24 of 24 cells, measured 2026-09-05 by DESK-TIMEBAND). The slot
    // stays unfilled for a STRONGER reason, and the two arms below PIN it rather than
    // restating it: the one variant lives in a LINEAGE pool, and the arm above proves this
    // desk reads neither lineage pool — so a fill would change no rendered byte.
    // If a corpus regeneration ever moves this variant into a pool the desk DOES reach,
    // these red, and the refusal has to be decided again instead of silently inherited.
    const named = Object.entries(POW4_POOLS)
      .flatMap(([poolKey, variants]) => variants.map((v) => ({ poolKey, v })))
      .filter(({ v }) => (v.slots || []).includes('timeband_age'));
    expect(named).toHaveLength(1);
    expect(named[0].poolKey).toBe('previousGovernments present with a recorded cause');
    // `reached` is pinned at exactly 7 above, so this cannot go vacuous by an empty set.
    expect(
      reached.has(named[0].poolKey),
      'the desk must not reach the pool that holds the {timeband_age} variant',
    ).toBe(false);
  });

  it('DS-POW-4 carries no covert variant, so the player and the DM read the same lines', () => {
    const covert = Object.values(POW4_POOLS).flat()
      .filter((v) => (v.marks || []).includes('dm-only'));
    expect(covert).toHaveLength(0);
    const asPlayer = powerStateProse(seat(1.3, []), { contenders: CONTENDERS, riskLabel: 'Holding' }, { seed: 'q', audience: 'player' });
    const asDm = powerStateProse(seat(1.3, []), { contenders: CONTENDERS, riskLabel: 'Holding' }, { seed: 'q', audience: 'dm' });
    expect(asPlayer.successionRisk.sentence).toBe(asDm.successionRisk.sentence);
  });

  it('the registry mounts DS-POW-4 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW4);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.succession', tab: 'power', desk: 'power', rung: 'sentence' });
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, POW4, A_DARK_SIBLING, 'DS-POW-4 is mounted, so the dark half must not name it',
    );
  });
});

/**
 * DS-POW-3 — THE LADDER. The first block whose state is play-time only, so its aliveness
 * proof is built with the KERNEL'S OWN WRITER and never with a birth fixture.
 *
 * ⛔ WHY THAT IS NOT A FORMALITY. `settlement.npcLadder` has no generation-time writer, so
 * a "proof" that this block is silent at birth would be a DORMANCY proof — and a dormancy
 * proof is byte-indistinguishable from the four dead-arm pathologies this suite exists to
 * refuse. The block must be shown to SPEAK in the world where it can speak. Everything
 * below therefore runs against a sidecar projected by `mirrorOf`, the same function
 * `npcLadderKernel` calls when it writes one during play, and the fixtures are read back
 * through the canonical `ladderRungsOf` / `ladderInstabilityOf` rather than inspected
 * directly — so a fixture this suite builds is one the shipped readers actually accept.
 */
const POW3 = 'DS-POW-3';
const POW3_POOLS = DOSSIER_STATE_PROSE_POWER[POW3].pools;
const LADDER_NAMES = new Map([['n1', 'Maera Voss'], ['n2', 'Haldor Renn'], ['n3', 'Sil Ateva']]);

/**
 * A SIMULATED settlement: a real LadderRecord projected by the kernel's own mirror writer.
 * @param {number[]} stocks standing stocks, top rung first (STAND_MAX is 10)
 * @param {number} instab the churn tax the kernel would have recorded
 */
function played(stocks, instab) {
  const nids = stocks.map((_, i) => `n${i + 1}`);
  const rec = {
    factions: { iron: { rungs: nids } },
    npcs: Object.fromEntries(nids.map((nid, i) => [nid, { stock: stocks[i] }])),
  };
  const mirror = mirrorOf(rec, LADDER_NAMES, new Map([['iron', { power: 1, legit: 1, instab }]]));
  return { name: 'Thornwall', _seed: 'seed-pow3', npcLadder: mirror };
}
/** The reading PowerTab's faction loop hands the desk, via the canonical readers. */
const ladderReading = (settlement, factionName = 'Iron Circle') => ({
  factionName,
  rungs: ladderRungsOf(settlement, 'iron'),
  instability: ladderInstabilityOf(settlement, 'iron'),
});

describe('DS-POW-3 — the fixture is a PLAYED world, built by the kernel\'s own writer', () => {
  it('mirrorOf produces a sidecar the shipped readers accept', () => {
    const settlement = played([9.0, 5.0, 2.0], 0.5);
    // If this is false the whole suite below is measuring a hand-shaped object rather than
    // a world, and every aliveness claim in it would be worthless.
    expect(hasLadder(settlement), 'the kernel writer produced no readable mirror').toBe(true);
    const rungs = ladderRungsOf(settlement, 'iron');
    expect(rungs).toHaveLength(3);
    expect(rungs[0]).toMatchObject({ npcId: 'n1', name: 'Maera Voss' });
    // Standing is normalised against STAND_MAX by the writer, not by this fixture.
    expect(rungs[0].standing).toBeCloseTo(0.9, 4);
    expect(ladderInstabilityOf(settlement, 'iron')).toBeCloseTo(0.5, 4);
  });

  it('ALIVENESS: all five pools SPEAK over played worlds', () => {
    const CASES = [
      ['shallow ladder (few rungs recorded)', played([9.0, 5.0], 0)],
      ['high instability (churn at the top)', played([9.0, 5.0, 2.0], 0.5)],
      ['crowded top rung, low instability', played([9.0, 8.5, 5.0], 0)],
      ['low instability, long-held order', played([9.0, 6.0, 3.0], 0)],
      ['clear top rung, low instability', played([9.0, 7.0, 6.5], 0)],
    ];
    const reached = new Set();
    for (const [key, settlement] of CASES) {
      const drawn = powerLadderRung(settlement, ladderReading(settlement), { seed: `l-${key}` });
      expect(drawn, `no rung for ${key}`).toBeTruthy();
      expect(drawn.provenance).toEqual(expect.objectContaining({ blockId: POW3, poolKey: key }));
      expect(drawn.sentence, `SILENT pool ${key}`).toBeTruthy();
      expect(drawn.sentence.length).toBeGreaterThan(20);
      // The length assertion above pins this same sentence at > 20 characters, so neither
      // absence check can be satisfied by an empty or missing sentence.
      // anchored: `drawn.sentence` is pinned > 20 characters on the line above
      expect(drawn.sentence).not.toMatch(/[{}]/);
      // anchored: same sentence, pinned > 20 characters above
      expect(drawn.sentence).not.toMatch(/[0-9]/);
      // The faction reaches the reader by name — every variant of this block names it.
      expect(drawn.sentence).toContain('Iron Circle');
      reached.add(key);
    }
    expect(reached.size).toBe(Object.keys(POW3_POOLS).length);
    expect(Object.keys(POW3_POOLS)).toHaveLength(5);
  });

  it('the top rung\'s holder reaches the reader, on the pools that name one', () => {
    const settlement = played([9.0, 5.0], 0);
    const seen = new Set();
    for (let i = 0; i < 40; i += 1) {
      const line = powerLadderRung(settlement, ladderReading(settlement), { seed: `npc-${i}` })?.sentence;
      if (line) seen.add(line);
    }
    expect(seen.size, 'the pool drew one variant across forty seeds').toBeGreaterThan(1);
    expect([...seen].some((line) => line.includes('Maera Voss'))).toBe(true);
  });
});

describe('DS-POW-3 — the cuts, the mandatory faction, and the surface condition', () => {
  it('each cut is the boundary it claims to be', () => {
    // Driven on the reading shape directly, so a threshold move reds here with a name.
    const rung = (standing) => ({ name: 'X', standing });
    expect(ladderPoolKey([rung(0.9), rung(0.5)], 0)).toBe('shallow ladder (few rungs recorded)');
    // Churn is tested BEFORE the gaps, because a churning ladder's gaps are not the story.
    expect(ladderPoolKey([rung(0.9), rung(0.6), rung(0.3)], 0.35)).toBe('high instability (churn at the top)');
    expect(ladderPoolKey([rung(0.9), rung(0.6), rung(0.3)], 0.34)).toBe('low instability, long-held order');
    expect(ladderPoolKey([rung(0.9), rung(0.83), rung(0.5)], 0)).toBe('crowded top rung, low instability');
    expect(ladderPoolKey([rung(0.9), rung(0.7), rung(0.65)], 0)).toBe('clear top rung, low instability');
    // No ladder at all is silence, never a band.
    expect(ladderPoolKey([], 0)).toBeNull();
    expect(ladderPoolKey(null, 0)).toBeNull();
  });

  it('{faction} is MANDATORY — every variant names it, so a nameless faction is silent', () => {
    const settlement = played([9.0, 6.0, 3.0], 0);
    const named = Object.values(POW3_POOLS).flat()
      .filter((v) => (v.slots || []).includes('faction'));
    // The measurement the rule rests on: 16 of 16.
    expect(named).toHaveLength(Object.values(POW3_POOLS).flat().length);
    expect(powerLadderRung(settlement, { ...ladderReading(settlement), factionName: '' })).toBeNull();
    // A raw engine token is refused rather than printed at a reader.
    expect(powerLadderRung(settlement, { ...ladderReading(settlement), factionName: 'iron_circle' })).toBeNull();
  });

  it('⚠ THE SURFACE CONDITION, stated separately so it is never mistaken for aliveness', () => {
    // A settlement with no sidecar has no ladder, the canonical readers return empty, and
    // PowerTab hides the whole section. Nothing degrades and nothing false is said. This is
    // a SURFACE arm; the aliveness proof is the played-world arm above, and substituting
    // this one for it would be the dormancy proof this file refuses to accept.
    const birth = { name: 'Thornwall' };
    expect(hasLadder(birth)).toBe(false);
    expect(ladderRungsOf(birth, 'iron')).toEqual([]);
    expect(powerLadderRung(birth, { factionName: 'Iron Circle', rungs: ladderRungsOf(birth, 'iron'), instability: 0 }))
      .toBeNull();
  });

  it('the registry mounts DS-POW-3 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW3);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.factionLadder', tab: 'power', desk: 'power', rung: 'sentence' });
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, POW3, A_DARK_SIBLING, 'DS-POW-3 is mounted, so the dark half must not name it',
    );
  });

  it('DS-POW-3 carries no covert variant', () => {
    const covert = Object.values(POW3_POOLS).flat().filter((v) => (v.marks || []).includes('dm-only'));
    expect(covert).toHaveLength(0);
  });
});

/** DS-POW-5 — ruling structure and the structural lens. */
const POW5 = 'DS-POW-5';
const POW5_POOLS = DOSSIER_STATE_PROSE_POWER[POW5].pools;

function ruled5(category, economicBase, governingName = 'Merchant Council') {
  return {
    name: 'Thornwall',
    _seed: 'seed-pow5',
    powerStructure: { governingName, factions: [{ category, power: 50 }] },
    economicState: { economicBase },
  };
}

describe('DS-POW-5 — the lens vocabularies ARE the pool keys, both directions', () => {
  it('every RULING_POWERS word is a pool, and every ruling pool is a RULING_POWERS word', () => {
    // Asserted against cohesionWeave's own frozen roster, never a table in this desk that
    // could drift from it. Both directions, so neither side can gain a member unnoticed.
    for (const word of RULING_POWERS) {
      expect(POW5_POOLS[word], `no pool for ruling power ${word}`).toBeTruthy();
      expect(rulingPowerPoolKey({ rulingPower: word })).toBe(word);
    }
    const poolWords = Object.keys(POW5_POOLS)
      .filter((k) => !k.startsWith('economicBase: ') && !k.startsWith('governing body name'));
    expect([...poolWords].sort()).toEqual([...RULING_POWERS].sort());
  });

  it('⛔ the five economicBase pools are DARK, and the desk reads none of their keys', () => {
    // All three keys the base is derived from are convicted by
    // check-observed-shape-readers as keys NO WRITER PRODUCES, so normalizeEconomicBase
    // always receives '' and fails soft to `mixed` — the axis has never varied for any
    // consumer of the lens. Drawing off that default would hand a reader a fail-soft value
    // dressed as a reading. The corpus is READY (the vocabulary agrees 1:1), so the pools
    // are pinned present-and-unread rather than deleted.
    for (const word of ECONOMIC_BASES) {
      expect(POW5_POOLS[`economicBase: ${word}`], `corpus lost ${word}`).toBeTruthy();
    }
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/spatial/cohesionWeave.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    const lensOf = code.slice(code.indexOf('export function structuralLensOf'));
    const body = lensOf.slice(0, lensOf.indexOf('\n}'));
    // The anchor is `governingArchetype`: the ONE key structuralLensOf really derives
    // from. It travels the same extraction as the two forbidden keys, so a `body` that
    // silently came back empty — the slice is bounded by two indexOf calls that both
    // return -1 when the function is renamed — reds here instead of passing both checks.
    expectAbsentWithAnchor(
      body, 'primaryIndustry', 'governingArchetype', 'the lift reads a key no generator writes',
    );
    expectAbsentWithAnchor(
      body, 'economicBase', 'governingArchetype', 'the lift reads a key no generator writes',
    );
  });

  it('an unrecognised lens word renders nothing rather than falling into `mixed`', () => {
    expect(rulingPowerPoolKey({ rulingPower: 'junta' })).toBeNull();
    expect(rulingPowerPoolKey(null)).toBeNull();
    expect(rulingPowerPoolKey(undefined)).toBeNull();
  });
});

describe('DS-POW-5 — structuralLensOf is the ONE derivation, and it matches its origin', () => {
  it('the lift is behaviour-identical to the generosityKernel helpers it replaces', () => {
    // THE ORACLE: the two local helpers in worldPulse/generosityKernel.js, transcribed as
    // they stand. A lift is only a lift if it cannot change an answer.
    const originalArchetype = (s) => {
      const factions = Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : [];
      let best = null;
      let bestPower = -Infinity;
      for (const f of factions) {
        const p = typeof f?.power === 'number' && Number.isFinite(f.power) ? f.power : 0;
        if (p > bestPower) { bestPower = p; best = f; }
      }
      return String(best?.category || '');
    };
    // Kept only to prove the oracle's INPUTS varied; the lift no longer derives a base.
    const originalBase = (s) => String(
      s?.economicState?.economicBase || s?.config?.economicBase || s?.economicState?.primaryIndustry || '',
    );
    const cases = [
      ruled5('noble', 'mining'),
      ruled5('government', 'farming'),
      ruled5('religious', 'trade'),
      ruled5('merchant', 'crafting'),
      ruled5('criminal', 'nonsense'),
      { name: 'T', powerStructure: { factions: [{ category: 'noble', power: 10 }, { category: 'criminal', power: 90 }] }, economicState: { primaryIndustry: 'mining' } },
      { name: 'T', config: { economicBase: 'trade' }, powerStructure: { factions: [] } },
      { name: 'T' },
    ];
    const reachedRuling = new Set();
    const reachedBase = new Set();
    for (const s of cases) {
      // The base is NOT part of the lift (see the arm above), so the oracle compares the
      // ARCHETYPE axis only — comparing a base this function deliberately no longer derives
      // would be asserting a dead read still happens.
      const expected = structuralLens({ governingArchetype: originalArchetype(s) });
      const got = structuralLensOf(s);
      expect(got.rulingPower, JSON.stringify(s)).toBe(expected.rulingPower);
      reachedRuling.add(got.rulingPower);
      reachedBase.add(originalBase(s));
    }
    // NON-VACUITY: the oracle must have been exercised across several answers, or it could
    // be agreeing by always returning the fail-soft default.
    expect(reachedRuling.size).toBeGreaterThan(3);
    expect(reachedBase.size).toBeGreaterThan(3);
    // The highest-power faction wins, not the first — the case the loop exists for.
    expect(structuralLensOf(cases[5]).rulingPower).toBe('criminal');
  });
});

describe('DS-POW-5 — ALIVENESS, the covert pool, and the three rare slots', () => {
  it('all twelve pools fire across the two audiences', () => {
    const reached = new Set();
    for (const category of ['noble', 'government', 'religious', 'merchant', 'criminal', 'zzz-unknown']) {
      for (const base of ['mining', 'farming', 'trade', 'crafting', 'nonsense']) {
        for (const audience of ['dm', 'player']) {
          const settlement = ruled5(category, base);
          const drawn = powerStateProse(
            settlement, { structuralLens: structuralLensOf(settlement) },
            { seed: `p5-${category}-${base}`, audience },
          );
          for (const rung of ['rulingStructure', 'governingTitle']) {
            const line = drawn[rung];
            if (line?.sentence) {
              reached.add(line.provenance.poolKey);
              // This branch is guarded, so it could run zero times — but the arm pins
              // `reached.size` at exactly 7 below, which a dead desk fails.
              // anchored: `reached.size` is pinned at exactly 7 after this loop
              expect(line.sentence).not.toMatch(/[{}]/);
              // anchored: same guarded line; `reached.size` is pinned at 7 below
              expect(line.sentence).not.toMatch(/[0-9]/);
            }
          }
        }
      }
    }
    // SEVEN of twelve: the six ruling-power pools plus the name pool. The five
    // economicBase pools are dark by declaration (see the arm above), and stating the
    // number here is what stops a later reader assuming all twelve were wired.
    expect(reached.size, `unreached: ${Object.keys(POW5_POOLS).filter((k) => !reached.has(k))}`).toBe(7);
    expect(Object.keys(POW5_POOLS)).toHaveLength(12);
  });

  it('`criminal` is WHOLLY covert, so the player sees silence and the DM sees the line', () => {
    const pool = POW5_POOLS.criminal;
    expect(pool.every((v) => (v.marks || []).includes('dm-only'))).toBe(true);
    const settlement = ruled5('criminal', 'mining');
    const reading = { structuralLens: structuralLensOf(settlement) };
    expect(powerStateProse(settlement, reading, { seed: 'c', audience: 'player' }).rulingStructure?.sentence ?? null)
      .toBeNull();
    expect(powerStateProse(settlement, reading, { seed: 'c', audience: 'dm' }).rulingStructure.sentence)
      .toBeTruthy();
  });

  it('{institution}, {route} and {good} are ONE variant each and cost no pool', () => {
    // {good} is the only bare-common slot this leaf touches — the shape class that leaves
    // DS-ECO-1's C1 pool at one eligible variant. At one variant of forty its exposure is a
    // single dropped sentence, which is why it is left unfilled rather than given a table.
    const all = Object.values(POW5_POOLS).flat();
    for (const slot of ['institution', 'route', 'good']) {
      const named = all.filter((v) => (v.slots || []).includes(slot));
      expect(named, `slot {${slot}}`).toHaveLength(1);
    }
    // The one LIT pool that holds such a slot still speaks, because its other variants
    // need none. ({route} and {good} sit in the dark economicBase pools.)
    const settlement = ruled5('religious', 'mining');
    const drawn = powerStateProse(
      settlement, { structuralLens: structuralLensOf(settlement) }, { seed: 'slot-theocracy', audience: 'dm' },
    );
    expect(drawn.rulingStructure?.sentence, 'theocracy went silent').toBeTruthy();
  });

  it('the registry mounts DS-POW-5 once, as a sentence, on the power tab', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW5);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.rulingStructure', tab: 'power', desk: 'power', rung: 'sentence' });
    expectAbsentWithAnchor(
      UNMOUNTED_BLOCKS, POW5, A_DARK_SIBLING, 'DS-POW-5 is mounted, so the dark half must not name it',
    );
  });
});

/**
 * DS-POW-7 — BLOCS. The last block in the leaf. Conditional surface (the DS-POW-3 class),
 * so the aliveness proof uses a PLAYED world read back through the shipped display reader.
 */
const POW7 = 'DS-POW-7';
const POW7_POOLS = DOSSIER_STATE_PROSE_POWER[POW7].pools;
/** The glue and end vocabularies, from the Bloc typedef's own unions. */
const GLUE_TYPES = ['concession', 'patronage', 'doctrine', 'threat', 'compromise'];
const END_KINDS = ['seats', 'doctrine', 'commerce', 'survival', 'patron'];

const politicsWorld = (blocs) => ({ politicsLedgers: { 'sid-1': { blocs } } });
const aBloc = (glue, end, covert = false) => ({
  id: 'b1', members: ['Iron Circle', 'Craft Guilds'],
  glue: [{ type: glue, detail: 'a receipt fragment' }],
  end, strain: 0.2, sinceTick: 5, covert,
});
const politicsSettlement = (category = 'noble') => ({
  id: 'sid-1', name: 'Thornwall', _seed: 'seed-pow7',
  powerStructure: { governingName: 'Merchant Council', factions: [{ category, power: 50 }] },
});
/** The reading PowerTab hands the desk — the DISPLAY projection, never the kernel. */
const politicsReading = (worldState, { groundTruth = true, covert = true } = {}) => politicsBlocsOf({
  worldState, settlementId: 'sid-1', includeGroundTruth: groundTruth, includeCovert: covert,
});

describe('DS-POW-7 — the corpus is its own key table', () => {
  it('every glue type and every end kind maps to a pool, both directions', () => {
    // The maps are DERIVED by scanning shipped pool names, so a renamed pool cannot drift
    // from a hand-written table — the failure mode a literal map here would have.
    for (const type of GLUE_TYPES) {
      const world = politicsWorld([aBloc(type, 'seats')]);
      expect(politicsGluePoolKey(politicsReading(world)), `glue ${type}`).toBeTruthy();
    }
    for (const kind of END_KINDS) {
      const world = politicsWorld([aBloc('concession', kind)]);
      expect(politicsEndPoolKey(politicsReading(world)), `end ${kind}`).toBeTruthy();
    }
    expect(Object.keys(POW7_POOLS).filter((k) => k.startsWith('glue '))).toHaveLength(GLUE_TYPES.length);
    expect(Object.keys(POW7_POOLS).filter((k) => k.startsWith('end '))).toHaveLength(END_KINDS.length);
    // An unknown token renders nothing rather than guessing a binding.
    expect(politicsGluePoolKey(politicsReading(politicsWorld([aBloc('blackmail', 'seats')])))).toBeNull();
    expect(politicsEndPoolKey(politicsReading(politicsWorld([aBloc('concession', 'conquest')])))).toBeNull();
  });
});

describe('DS-POW-7 — ALIVENESS over a PLAYED world, read through the shipped reader', () => {
  it('the fixture is a world the shipped politics reader accepts', () => {
    const world = politicsWorld([aBloc('concession', 'seats')]);
    // If this is false the suite below is measuring a hand-shaped object, not a world.
    expect(hasPolitics(world), 'the shipped reader sees no politics in the fixture').toBe(true);
    expect(hasPolitics({}), 'a birth world must carry no politics').toBe(false);
    const projection = politicsReading(world);
    expect(projection).toBeTruthy();
    expect(projection.blocCount).toBe(1);
    expect(projection.blocs[0].truth.end).toBe('seats');
  });

  it('all TWELVE lit pools speak, and the eight dark ones stay dark', () => {
    const reached = new Set();
    for (const glue of GLUE_TYPES) {
      for (const end of END_KINDS) {
        for (const category of ['noble', 'merchant']) {
          for (const audience of ['dm', 'player']) {
            const world = politicsWorld([aBloc(glue, end, category === 'noble')]);
            const settlement = politicsSettlement(category);
            const drawn = powerStateProse(
              settlement,
              { politics: politicsReading(world), structuralLens: structuralLensOf(settlement) },
              { seed: `p7-${glue}-${end}-${category}`, audience },
            );
            for (const rung of ['blocPresence', 'blocGlue', 'blocEnd']) {
              const line = drawn[rung];
              if (line?.sentence) {
                reached.add(line.provenance.poolKey);
                // This branch is guarded, so it could run zero times — but the arm pins
                // `reached.size` against the corpus below, which a dead desk fails.
                // anchored: `reached.size` is pinned against the corpus after this loop
                expect(line.sentence).not.toMatch(/[{}]/);
                // anchored: same guarded line; `reached.size` is pinned below
                expect(line.sentence).not.toMatch(/[0-9]/);
              }
            }
          }
        }
      }
    }
    // The dormant line, which the corpus wrote FOR the absent layer.
    const birth = politicsSettlement();
    const dormant = powerStateProse(
      birth, { politics: null, structuralLens: structuralLensOf(birth) }, { seed: 'dormant' },
    );
    expect(dormant.blocPresence.provenance.poolKey).toBe('layer DORMANT (no ledger materialized)');
    expect(dormant.blocPresence.sentence).toBeTruthy();
    reached.add('layer DORMANT (no ledger materialized)');

    expect(reached.size, `reached: ${[...reached]}`).toBe(12);
    expect(Object.keys(POW7_POOLS)).toHaveLength(20);
  });

  it('⛔ the eight dark pools are declared, and the desk reads no receipt state', () => {
    // 5 receipt pools: `advanceSettlementPolitics` returns a receipts array and its ONLY
    // caller discards it (pulseKernel keeps `changed` and `worldState`). No readable state
    // ⇒ a read would be the dead-read defect. 1 hostile-tie pool: nothing persists a
    // BLOCKED alignment. 2 ruling-bloc pools: they need a 61.9 KB kernel module the display
    // projection does not expose — a cost reason, deliberately not bundled into this car.
    for (const key of [
      'receipt formed', 'receipt realigned', 'receipt fractured', 'receipt exposed',
      'receipt deferred (the alignment exists and has not happened)',
      'hostile leader tie HARD-BLOCKS an otherwise natural alignment',
      'consolidation 0: a fully divided court (live layer, no ruling bloc)',
      'a RULING bloc, consolidated',
    ]) {
      expect(POW7_POOLS[key], `corpus lost ${key}`).toBeTruthy();
    }
    const source = readFileSync(
      resolve(import.meta.dirname, '../../src/domain/display/stateProse/powerStateProse.js'), 'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    // THE LIVENESS ANCHOR for both negatives below: the comment stripper must leave the
    // desk's own entry point standing. An emptied or over-stripped `code` reds HERE
    // rather than passing two absence checks with nothing to search.
    expect(code, 'the comment stripper ate the module').toContain('export function powerStateProse');
    // No read of a receipts bag, and no import of the heavy kernel module. The word-
    // boundary spelling is deliberate, so this one keeps its regex and cites the anchor.
    // anchored: `code` is proved above to still contain the desk's own entry point
    expect(code, 'the desk reads receipt state that nothing persists').not.toMatch(/\breceipts\b/);
    expectAbsentWithAnchor(
      code, 'settlementPolitics', 'export function powerStateProse',
      'the desk reached for the 61.9 KB kernel module',
    );
  });

  it('THE SEAM: a player routed to a covert pool gets SILENCE, not a secret', () => {
    // `glue compromise (a corruption leash)` and `end patron` are wholly dm-only in the
    // corpus. The desk may hold the token (it routes on it); the kernel refuses the
    // sentence. That is the two mechanisms composing, and it is the whole seam argument.
    for (const key of ['glue compromise (a corruption leash)', 'end patron']) {
      expect(POW7_POOLS[key].every((v) => (v.marks || []).includes('dm-only')), key).toBe(true);
    }
    const world = politicsWorld([aBloc('compromise', 'patron')]);
    const settlement = politicsSettlement('merchant');
    const reading = { politics: politicsReading(world), structuralLens: structuralLensOf(settlement) };
    const asPlayer = powerStateProse(settlement, reading, { seed: 'seam', audience: 'player' });
    const asDm = powerStateProse(settlement, reading, { seed: 'seam', audience: 'dm' });
    // Routed to the covert pools in BOTH cases…
    expect(asDm.blocGlue.provenance.poolKey).toBe('glue compromise (a corruption leash)');
    expect(asDm.blocEnd.provenance.poolKey).toBe('end patron');
    // …and only the DM is told.
    expect(asDm.blocGlue.sentence).toBeTruthy();
    expect(asDm.blocEnd.sentence).toBeTruthy();
    expect(asPlayer.blocGlue?.sentence ?? null).toBeNull();
    expect(asPlayer.blocEnd?.sentence ?? null).toBeNull();
  });

  it('the COVERT-under-autarchy pool needs both a conspiracy and an autarchy', () => {
    const covertWorld = politicsWorld([aBloc('concession', 'seats', true)]);
    const autarchy = politicsSettlement('noble');   // noble -> autocrat
    const council = politicsSettlement('government'); // government -> council
    expect(structuralLensOf(autarchy).rulingPower).toBe('autocrat');
    expect(politicsPresencePoolKey(politicsReading(covertWorld), 'autocrat'))
      .toBe('an opposition bloc forms COVERT under an autarchy');
    // A conspiracy under a council is not that pool — the corpus wrote it about an autarchy.
    expect(structuralLensOf(council).rulingPower).toBe('council');
    expect(politicsPresencePoolKey(politicsReading(covertWorld), 'council')).toBeNull();
    // And an OPEN bloc under an autarchy is not a conspiracy.
    expect(politicsPresencePoolKey(politicsReading(politicsWorld([aBloc('concession', 'seats')])), 'autocrat'))
      .toBeNull();
  });

  it('⚠ THE SURFACE CONDITION — dormant is a TRUE statement, not a fallback', () => {
    // Distinct from the economicBase case, where `mixed` would have been a fail-soft
    // default dressed as a reading. Here the corpus WROTE a pool for the absent layer and
    // its prose is accurate about an unorganised hall.
    expect(politicsPresencePoolKey(null, 'autocrat')).toBe('layer DORMANT (no ledger materialized)');
    expect(politicsPresencePoolKey({ blocs: [] }, 'autocrat')).toBe('layer DORMANT (no ledger materialized)');
    expect(POW7_POOLS['layer DORMANT (no ledger materialized)'].every((v) => !(v.marks || []).includes('dm-only')))
      .toBe(true);
  });

  it('the registry mounts DS-POW-7 once, and the POWER LEAF IS COMPLETE', () => {
    const rows = DOSSIER_MOUNTS.filter((row) => row.blockId === POW7);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ mount: 'power.blocs', tab: 'power', desk: 'power', rung: 'sentence' });
    // THE MILESTONE, asserted rather than claimed: no DS-POW- block remains dark.
    expect(UNMOUNTED_BLOCKS.filter((b) => b.startsWith('DS-POW-'))).toEqual([]);
    expect(DOSSIER_MOUNTS.filter((row) => row.desk === 'power')).toHaveLength(7);
  });
});
