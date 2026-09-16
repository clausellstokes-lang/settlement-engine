/**
 * economyStateProseDesk.test.js — LANE P-4: the reference desk.
 *
 * A desk maps LIVE STATE to a POOL KEY. Everything that can go wrong is a mapping that
 * is wrong in a way the reader cannot see: a rung that lands in the neighbouring band, a
 * blockade whose sentence is the ordinary food ladder, a tile that speaks when the
 * surface it frames is not rendering. So the pins here are about the MAP, plus the
 * legibility contract the panel depends on.
 *
 * Every pool key this desk can produce is asserted to exist in the shipped corpus, so a
 * key that drifts from the annex reds here rather than going silently prose-less on the
 * page — which is the failure a reader never reports because a missing sentence looks
 * exactly like a state with nothing to say.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ACCESS_NOUN,
  COMPLEXITY_NOUN,
  SLOT_FILL_SHAPES,
  SLOT_FILL_TABLES,
  criminalIncomePoolKey,
  economicStrengthsPoolKey,
  economyStateProse,
  exploitationPoolKey,
  exportPosturePoolKey,
  foodSecurityPoolKey,
  foodTilePoolKey,
  granaryPoolKey,
  impairedServicePoolKey,
  incomeMixPoolKey,
  leadingExploitation,
  leadingGoodNoun,
  serviceCatalogPoolKey,
  shadowEconomyPoolKey,
  strategicValuePoolKey,
  terrainPoolKey,
  tradeFlowPoolKey,
  prosperityHeaderPoolKey,
  tradeProfilePoolKey,
} from '../../src/domain/display/stateProse/economyStateProse.js';
import { deriveExportPosture } from '../../src/domain/display/exportPosture.js';
import { deriveNotableAbsences, EXPECTED_SERVICES_BY_TIER } from '../../src/domain/display/servicesDisplay.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { deriveEconomicComplexity } from '../../src/generators/economy/prosperity.js';
import { flowDerivedDependency } from '../../src/domain/display/tradeFlowEconomics.js';
import { throughputBand } from '../../src/domain/spatial/tradeFlow.js';
import {
  parseSlotShapes, mergeSlotShapes, fillShapeViolation,
} from '../../scripts/lib/dossier-slot-shapes.mjs';
import { legibilityRung, rungSpeaks } from '../../src/domain/display/stateProse/legibilityRung.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { AUDIENCE_DM } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { PROSPERITY_TIERS } from '../../src/data/constants.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const ACCESS_ENUM = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];
const FOOD_LABELS = ['Surplus', 'Secure', 'Pressured', 'Import-Dependent', 'Deficit', 'Active Famine'];
const GRANARY_BANDS = ['well stocked', 'stocked', 'thin', 'nearly empty'];

const DOCS = resolve(import.meta.dirname, '../../docs/content');
const SHAPES = mergeSlotShapes([
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8'), 'STATE'),
  parseSlotShapes(readFileSync(resolve(DOCS, 'RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'CAUSAL'),
]);

/**
 * EVERY value `deriveEconomicComplexity` can emit, derived from the producer rather than
 * transcribed. Its eleven branches are a nested ternary on (tier, incomeSourceCount,
 * exportCount, hasMarketInst); these arguments walk all eleven. A hand-copied list would
 * be the fork that drifts, which is the class this whole car exists to close.
 */
const COMPLEXITY_VALUES = [...new Set([
  deriveEconomicComplexity('metropolis', 9, 0, false),
  deriveEconomicComplexity('metropolis', 6, 0, false),
  deriveEconomicComplexity('city', 1, 0, false),
  deriveEconomicComplexity('town', 6, 0, true),
  deriveEconomicComplexity('town', 4, 0, false),
  deriveEconomicComplexity('town', 1, 0, false),
  deriveEconomicComplexity('village', 1, 0, true),
  deriveEconomicComplexity('village', 1, 4, false),
  deriveEconomicComplexity('village', 1, 1, false),
  deriveEconomicComplexity('hamlet', 1, 3, false),
  deriveEconomicComplexity('hamlet', 1, 1, false),
])];

/**
 * The two rendered-grammar detectors that fire ZERO times on the authored corpus — measured
 * over all 2,734 templates — so a hit in a rendered sentence was put there by a FILL and
 * needs no allowlist. Both convict the shipped defect directly: `ACCESS_PROSE.road = 'the
 * road'` renders "off its the road" and "the the road carries all of it".
 *
 * A DASH DETECTOR IS DELIBERATELY ABSENT FROM THIS SCAN. The corpus carries 338 AUTHORED
 * reader-facing em dashes in 319 of its sentences ("a working {access}, a working market" is
 * one), and they are the owner-signed T5-ONE-REGEN constituent, not this lane's to strip. A
 * dash a FILL introduces is caught where it belongs, on the fill, by the arm below and by
 * DASH-IN-FILL in tests/data/dossierStateProseProjection.contract.test.js.
 */
const BROKEN_GRAMMAR = [
  ['adjacent determiners', /\b(?:the|a|an|its|his|her|their|our)\s+(?:the|a|an)\b/i],
  ['a doubled word', /\b(the|a|an|of|to|in|on|at|by|its|and)\s+\1\b/i],
];

/**
 * THE COMPLEXITY FIXTURE IS A VALUE THE PRODUCER CAN ACTUALLY EMIT, AND HAS TWICE NOT BEEN.
 *
 * (2026-09-02) It read `'a mixed market economy'` — a fill carrying its own determiner,
 * dropped into five seams that already carry one ("the {complexity} keeps more hands busy"),
 * so this file's own liveness probe asserted that "the a mixed market economy keeps more
 * hands busy" was TRUTHY. It was then corrected to `'mixed market economy'`, which is
 * shape-conformant and still a string `deriveEconomicComplexity` CANNOT PRODUCE.
 *
 * (2026-09-05, §0c-3 closed) That second form was invisible while the desk refused every
 * complexity fill outright, and it became load-bearing the moment `COMPLEXITY_NOUN` keyed
 * the seam on the producer's own eleven strings: a fixture outside that vocabulary fills
 * nothing, so every arm below would have measured the DARK behaviour and reported it as the
 * lit one. The default is now taken FROM the producer, so the fixture cannot teach the desk
 * a value no world can hold — trap 4 of the desk-car law, in its own home.
 * @param {object} over
 */
const FIXTURE_COMPLEXITY = deriveEconomicComplexity('town', 6, 0, true);

function town(over = {}) {
  return {
    name: 'Thornwall',
    economicState: {
      prosperity: 'Moderate',
      tradeAccess: 'road',
      economicComplexity: FIXTURE_COMPLEXITY,
      foodSecurity: { label: 'Secure', stockpile: null },
      ...over.economicState,
    },
    ...over,
  };
}

describe('the desk is in lockstep with the shipped corpus', () => {
  it('produces only DS-ECO-1 keys the corpus carries, over the whole rung x access cross', () => {
    const missing = [];
    for (let rank = 0; rank < PROSPERITY_TIERS.length; rank++) {
      for (const access of ACCESS_ENUM) {
        const key = prosperityHeaderPoolKey(rank, access);
        expect(key, `rank ${rank} / ${access}`).toBeTruthy();
        if (!DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-1'].pools[key]) missing.push(`${rank}/${access} → ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('produces only DS-ECO-8 keys the corpus carries, for every canonical rung', () => {
    const missing = PROSPERITY_TIERS
      .filter((tier) => !DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-8'].pools[tier.toUpperCase()]);
    expect(missing).toEqual([]);
  });

  it('produces only DS-ECO-9 keys the corpus carries, for every food-security label', () => {
    for (const label of FOOD_LABELS) {
      const key = foodSecurityPoolKey(label, null);
      expect(key, `label ${label}`).toBeTruthy();
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-9'].pools[key], `${label} → ${key}`).toBeTruthy();
    }
  });

  it('produces only DS-ECO-2 keys the corpus carries, for every tile state', () => {
    const keys = [
      foodTilePoolKey({ available: true, deficit: 4000, surplus: 0 }),
      foodTilePoolKey({ available: true, deficit: 0, surplus: 900 }),
      foodTilePoolKey({ available: true, deficit: 0, surplus: 0 }),
      ...GRANARY_BANDS.map((band) => granaryPoolKey({ available: true, band })),
    ];
    for (const key of keys) {
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-2'].pools[key], `key ${key}`).toBeTruthy();
    }
  });
});

describe('the state map', () => {
  it('bands the rungs where the annex names them', () => {
    expect(prosperityHeaderPoolKey(0, 'road')).toContain('C4');
    expect(prosperityHeaderPoolKey(2, 'road')).toContain('C4');
    expect(prosperityHeaderPoolKey(3, 'road')).toContain('C3');
    expect(prosperityHeaderPoolKey(4, 'road')).toContain('C3');
    expect(prosperityHeaderPoolKey(5, 'road')).toContain('C1');
    expect(prosperityHeaderPoolKey(6, 'road')).toContain('C1');
  });

  it('reads isolated and the pass as the narrow approaches, and nothing else', () => {
    for (const access of ACCESS_ENUM) {
      const narrow = access === 'isolated' || access === 'mountain_pass';
      expect(prosperityHeaderPoolKey(6, access).includes('C2'), access).toBe(narrow);
      expect(prosperityHeaderPoolKey(0, access).includes('C5'), access).toBe(narrow);
    }
  });

  it('renders NOTHING for an unrecognised prosperity spelling, rather than a band', () => {
    // `Affluent` is the drifted Compendium word the annex explicitly rejects as a rung.
    expect(prosperityHeaderPoolKey(-1, 'road')).toBeNull();
    const drifted = economyStateProse(town({ economicState: { prosperity: 'Affluent' } }), {},
      { seed: 'w', audience: AUDIENCE_DM });
    expect(drifted.prosperityHeader).toBeNull();
    expect(drifted.prosperityRung).toBeNull();
    // The anchor: a canonical spelling on the same fixture DOES speak.
    expect(economyStateProse(town(), {}, { seed: 'w', audience: AUDIENCE_DM }).prosperityRung?.sentence)
      .toBeTruthy();
  });

  it('lets a blockade override the food ladder', () => {
    expect(foodSecurityPoolKey('Secure', { blockaded: true })).toBe('BLOCKADED');
    expect(foodSecurityPoolKey('Secure', { blockaded: true, blockadeBypass: true })).toBe('BLOCKADE BYPASSED');
    expect(foodSecurityPoolKey('Secure', { blockaded: false })).toBe('SECURE');
  });

  it('stays silent where the surface itself does not render', () => {
    // Seasons off ⇒ no granary tile ⇒ no granary sentence (R-DST-K); food metrics
    // absent ⇒ no food tile.
    expect(granaryPoolKey({ available: false, band: 'thin' })).toBeNull();
    expect(granaryPoolKey(null)).toBeNull();
    expect(foodTilePoolKey({ available: false, deficit: 4000 })).toBeNull();
    const bare = economyStateProse(town(), {}, { seed: 'w', audience: AUDIENCE_DM });
    expect(bare.foodTile).toBeNull();
    expect(bare.granaryTile).toBeNull();
  });
});

describe('anchored liveness at the desk grain', () => {
  it('drops the complexity-naming lines when the generator recorded no complexity', () => {
    const seeds = Array.from({ length: 40 }, (_, i) => `probe-${i}`);
    const draw = (complexity) => seeds.map((seed) => economyStateProse(
      town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'mountain_pass', economicComplexity: complexity } }),
      {}, { seed, audience: AUDIENCE_DM },
    ).prosperityHeader?.sentence).filter(Boolean);

    // Same rung, same approach, same pool — the only difference is the fill. The value is
    // the PRODUCER's and the phrase is the table's, so this arm exercises the wired seam
    // rather than a string only this file has ever held.
    const producerValue = deriveEconomicComplexity('village', 1, 0, true);
    const phrase = COMPLEXITY_NOUN[producerValue];
    expect(phrase, 'the fixture value has no COMPLEXITY_NOUN row').toBeTruthy();
    const withComplexity = draw(producerValue);
    const without = draw('');
    const complexityLine = withComplexity.find((line) => line.includes(phrase));
    expect(complexityLine, 'the pool must name the complexity somewhere').toBeTruthy();
    expectPresentThenAbsent(withComplexity, without, complexityLine, 'no economicComplexity recorded');
    expect(without.length, 'the complexity-free variants survive — the liveness anchor')
      .toBeGreaterThan(0);
    for (const line of without) expect(line).not.toMatch(/\{[a-z_]+\}/);

    // AND THE THIRD DIRECTION, which is the one a two-state probe would miss: a spelling
    // the table has never been told about is treated exactly like NO complexity, not like
    // a near neighbour. That is what makes the map total rather than tolerant.
    const stranger = draw('mixed market economy');
    expect(stranger.sort(), 'an unknown spelling must read as silence, not as a neighbour')
      .toEqual(without.sort());
  });

  it('does not need an {access} fill on the two narrow approaches — the corpus solved it', () => {
    // Recorded rather than assumed: §0c says `isolated` has no `{access}` fill, and the
    // annex answers that by authoring C2 and C5 without the slot at all. So the desk
    // reaches no pool that could ever want an approach word it does not have, and an
    // isolated town renders a full sentence rather than a degraded one.
    for (const key of ['COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)',
      'COMBINATION C5: a low rung on a narrow approach']) {
      for (const variant of DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-1'].pools[key]) {
        expect(variant.slots, `${key} must not need {access}`).not.toContain('access');
      }
    }
    const isolated = economyStateProse(
      town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'isolated' } }),
      {}, { seed: 'w', audience: AUDIENCE_DM },
    );
    expect(isolated.prosperityHeader?.sentence).toBeTruthy();
    expect(isolated.prosperityHeader.sentence).not.toMatch(/\{[a-z_]+\}/);
    expect(isolated.prosperityHeader.detail)
      .toContainEqual({ label: 'Approach', value: 'nothing that reaches it easily' });
  });
});

describe('the legibility rungs', () => {
  it('gives every rendered surface a glance, a sentence and a translated detail', () => {
    const desk = economyStateProse(
      town({ economicState: { prosperity: 'Comfortable', tradeAccess: 'crossroads' } }),
      {
        foodBalance: { available: true, deficit: 0, surplus: 900, display: 'Surplus +900', detail: 'Produced/Needed: 4,900 / 4,000 lb/day' },
        granaryOutlook: { available: true, band: 'stocked', season: 'spring' },
      },
      { seed: 'world-3', audience: AUDIENCE_DM },
    );
    expect(desk.prosperityHeader.glance).toBe('Comfortable');
    expect(desk.prosperityHeader.sentence).toBeTruthy();
    expect(desk.prosperityHeader.detail).toContainEqual({ label: 'Approach', value: 'the crossroads' });
    // ⛔ `pieces` RIDES THE PROVENANCE SINCE REWRITE car 8a-3 (TASTE car M-3's instrument half;
    // ARCH §4.1 in terms: "`legibilityRung.sentence` stays one string; `provenance` grows
    // `pieces` INSIDE the object `drawnAtMount` strips on a glance row"). The composed-prose
    // manifest's ADDITIVE verdict was UNREACHABLE THROUGH THE SHIPPED INSTRUMENT before it,
    // because the recorder synthesised a one-piece array on every cell whatever the composer
    // did. The three IDENTITY fields are what this desk arm is about and they are asserted
    // exactly; the piece row is asserted beside them as the ONE spine piece a bare unit has,
    // so the arm still refuses a fourth key rather than loosening to a subset match.
    expect(Object.keys(desk.prosperityHeader.provenance).sort())
      .toEqual(['angle', 'blockId', 'pieces', 'poolKey']);
    expect(desk.prosperityHeader.provenance).toMatchObject({
      blockId: 'DS-ECO-1',
      poolKey: 'COMBINATION C3: the middle rungs',
      angle: expect.any(String),
    });
    expect(desk.prosperityHeader.provenance.pieces, 'a bare spine composes exactly one piece')
      .toEqual([{
        role: 'spine', key: 'COMBINATION C3: the middle rungs', vid: 1, index: 1, face: 0,
      }]);
    expect(desk.granaryTile.glance).toBe('stocked');
    expect(desk.granaryTile.sentence).toContain('spring');
    expect(desk.foodTile.glance).toBe('Surplus +900');
  });

  it('never puts a raw engine token or a figure into the prose rung', () => {
    for (const access of ACCESS_ENUM) {
      for (const tier of PROSPERITY_TIERS) {
        const desk = economyStateProse(town({ economicState: { prosperity: tier, tradeAccess: access } }),
          {}, { seed: `${tier}::${access}`, audience: AUDIENCE_DM });
        for (const rung of [desk.prosperityHeader, desk.prosperityRung]) {
          if (!rung?.sentence) continue;
          expect(rung.sentence, `${tier}/${access}`).not.toMatch(/mountain_pass|tradeAccess|economicState|\d/);
        }
      }
    }
  });

  it('keeps a surface alive when the corpus is silent about it', () => {
    // The corpus going quiet must never blank a surface that was already rendering.
    const rung = legibilityRung('Pressured', null, [{ label: 'Margin', value: 'thin' }]);
    expect(rungSpeaks(rung)).toBe(true);
    expect(rung.sentence).toBeNull();
    expect(rungSpeaks(legibilityRung('', null, []))).toBe(false);
  });

  it('drops empty detail rows rather than rendering a labelled blank', () => {
    const rung = legibilityRung('Secure', null, [
      { label: 'Season', value: '' },
      { label: '', value: 'Harvest' },
      { label: 'Margin', value: 'thin' },
    ]);
    expect(rung.detail).toEqual([{ label: 'Margin', value: 'thin' }]);
  });
});

describe('the grammar of the rendered rung', () => {
  it('renders no broken English over the whole real cross product', () => {
    // THE ARM THAT WOULD HAVE CAUGHT IT. Nothing in the estate rendered this desk with a
    // real fill and read the SENTENCE; the nearest thing asserts only that no engine token
    // or digit appears, and "a working the road" passes that. Every prosperity tier x
    // every access value x every value the complexity producer can emit x eight seeds.
    const broken = [];
    for (const tier of PROSPERITY_TIERS) {
      for (const access of ACCESS_ENUM) {
        for (const complexity of COMPLEXITY_VALUES) {
          for (let s = 0; s < 8; s++) {
            const desk = economyStateProse(
              town({ economicState: { prosperity: tier, tradeAccess: access, economicComplexity: complexity } }),
              {}, { seed: `w${s}`, audience: AUDIENCE_DM },
            );
            for (const rung of [desk.prosperityHeader, desk.prosperityRung]) {
              if (!rung?.sentence) continue;
              for (const [why, rx] of BROKEN_GRAMMAR) {
                if (rx.test(rung.sentence)) broken.push(`${why}: ${rung.sentence}`);
              }
            }
          }
        }
      }
    }
    expect([...new Set(broken)]).toEqual([]);
  });

  it('puts nothing in a slot that violates that slot\'s declared shape', () => {
    // The EXACT half of the contract, and the one that convicts the table rather than a
    // sentence: a `bare-common` fill may not carry a determiner ANYWHERE it lands, because
    // the shape's whole content is that the SENTENCE supplies one. `'the road'` fails this
    // against all eight of its seams and against none of them equally.
    const violations = [];
    for (const [key, value] of Object.entries(ACCESS_NOUN)) {
      const rule = fillShapeViolation(SHAPES.shapeOf('access'), value);
      if (rule) violations.push(`ACCESS_NOUN.${key} = "${value}" — ${rule}`);
    }
    expect(violations).toEqual([]);
  });

  it('agrees with the annex register about which fills it may use', () => {
    // The desk carries a MIRROR of §0c's Shape column because a runtime module cannot read
    // markdown. This is the arm that keeps the mirror from becoming a fork, and the arm
    // that proves the desk's private refusal and the shared predicate decide alike over
    // every value the producer can actually emit.
    const drift = Object.entries(SLOT_FILL_SHAPES)
      .filter(([slot, shape]) => SHAPES.shapeOf(slot) !== shape)
      .map(([slot, shape]) => `${slot}: desk says ${shape}, annex says ${SHAPES.shapeOf(slot)}`);
    expect(drift).toEqual([]);

    const disagreements = [];
    for (const value of COMPLEXITY_VALUES) {
      const predicateAdmits = fillShapeViolation(SHAPES.shapeOf('complexity'), value) === '';
      const seeds = Array.from({ length: 24 }, (_, i) => `probe-${i}`);
      const deskAdmits = seeds.some((seed) => economyStateProse(
        town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'road', economicComplexity: value } }),
        {}, { seed, audience: AUDIENCE_DM },
      ).prosperityHeader?.sentence?.includes(value));
      if (predicateAdmits !== deskAdmits) {
        disagreements.push(`${value}: predicate ${predicateAdmits}, desk ${deskAdmits}`);
      }
    }
    expect(disagreements).toEqual([]);
    // Non-vacuity: the producer's own values must actually EXERCISE the refusal, or this
    // arm is agreement about an empty question. All eleven RAW DISPLAY STRINGS are still
    // refused — that never changed, and §0c-3 did not change it. What §0c-3 closed is the
    // SEAM: the desk no longer offers the display string to the slot at all, it offers
    // COMPLEXITY_NOUN's authored phrase, which is why `deskAdmits` above (does the rendered
    // sentence contain the DISPLAY STRING) is false for all eleven both before and after.
    const refused = COMPLEXITY_VALUES.filter((v) => fillShapeViolation('bare-common', v) !== '');
    expect(refused.length).toBe(COMPLEXITY_VALUES.length);
    expect(COMPLEXITY_VALUES.length).toBe(11);
  });

  it('keeps the complexity DATUM on its detail row even where the seam refuses it', () => {
    // The refusal is about the SEAM, never about the fact. A future implementer who reads
    // "the desk refuses the complexity string" and deletes the Economy row would silently
    // remove a datum the page has always shown; this is the arm that stops it.
    const rows = COMPLEXITY_VALUES.map((complexity) => economyStateProse(
      town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'road', economicComplexity: complexity } }),
      {}, { seed: 'w', audience: AUDIENCE_DM },
    ).prosperityHeader.detail.find((row) => row.label === 'Economy')?.value);
    expect(rows).toEqual(COMPLEXITY_VALUES);
  });

  it('composes the Approach row from the one noun table', () => {
    // ACCESS_NOUN is the single home for the approach word. The row adds its own article;
    // the seam does not. Byte-identical to what this row rendered before the split, which
    // is why no pin in the tree moves.
    //
    // TWO DIVERGENCES DELIBERATELY LEFT, DOCUMENTED, NOT BUGS TO RE-FIND.
    // (1) legibilityRung.js:10 states the target as "A row reads `Approach · over the
    //     pass`" and this row reads "the pass". Adding the preposition would MINT five
    //     reader-facing words and move this pin, and the row is correct English today —
    //     it is not in the class this car fixes (a fill carrying grammar the sentence also
    //     supplies). It is a label-wording question for whoever lights the desk, and unlike
    //     the seam fix it does not get more expensive by waiting.
    // (2) `{season}` renders the engine's lowercase token ("spring"), while the granary
    //     tile's own display uses SEASON_TITLE ("Spring"). Both are conformant — bare-common
    //     wants the lowercase form in a sentence — but the two surfaces disagree in case.
    //     Raised for the desk-lighting lane; nothing here is ungrammatical.
    const rows = ACCESS_ENUM.map((access) => economyStateProse(
      town({ economicState: { prosperity: 'Comfortable', tradeAccess: access } }),
      {}, { seed: 'w', audience: AUDIENCE_DM },
    ).prosperityHeader.detail.find((row) => row.label === 'Approach')?.value);
    expect(rows).toEqual([
      'the road', 'the river', 'the port', 'the crossroads',
      'nothing that reaches it easily', 'the pass',
    ]);
    expect(Object.values(ACCESS_NOUN)).toEqual(['road', 'river', 'port', 'crossroads', 'pass']);
  });
});

describe('THE PROMISE, at the desk grain', () => {
  it('renders the same page for the same seed and the same settlement', () => {
    const args = [town({ economicState: { prosperity: 'Poor', tradeAccess: 'river' } }),
      { granaryOutlook: { available: true, band: 'thin', season: 'Late Winter' } },
      { seed: 'save-42', audience: AUDIENCE_DM }];
    const first = economyStateProse(...args);
    for (let i = 0; i < 10; i++) expect(economyStateProse(...args)).toEqual(first);
  });

  it('never mutates the settlement it reads', () => {
    const subject = town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'port' } });
    const before = JSON.stringify(subject);
    economyStateProse(subject, {}, { seed: 's', audience: AUDIENCE_DM });
    expect(JSON.stringify(subject)).toBe(before);
  });
});

// ── DS-ECO-12: THE COMMERCIAL PROFILE ────────────────────────────────────────────────
// Three lenses at one position. The pins below are about the two failures a reader can
// never report: a lens that draws a sentence off an ABSENT field, and a pool that is
// mounted and unreachable. Both are measured here rather than reasoned about.

/** @param {Array<[number, boolean?]>} rows */
const income = (rows) => rows.map(([percentage, isCriminal]) => ({
  source: isCriminal ? 'Black Market Revenue' : 'Wool Trade', percentage, isCriminal: !!isCriminal,
}));

/** A settlement whose commercial record is fully present, so a null is never ambiguous. */
const trader = (over = {}) => town({
  economicState: {
    incomeSources: income([[60], [40]]),
    primaryExports: ['wool'], primaryImports: ['iron'], localProduction: [], isEntrepot: false,
    ...over,
  },
});

/** Every commercial state the three lenses partition, named by the pool each must reach. */
const COMMERCIAL_STATES = [
  ['INCOME MIX: one source carries the town', { incomeSources: income([[70], [30]]) }],
  ['INCOME MIX: two or three sources between them', { incomeSources: income([[30], [25], [25], [20]]) }],
  ['INCOME MIX: a broad spread, no leader', { incomeSources: income([[10], [10], [10], [10], [10], [10], [10], [10], [10], [10]]) }],
  ['INCOME MIX: a criminal line is present', { incomeSources: income([[60], [20, true]]) }],
  ['INCOME MIX: the criminal line leads', { incomeSources: income([[25], [45, true]]) }],
  ['TRADE PROFILE: exports and imports both present', {}],
  ['TRADE PROFILE: no significant exports', { primaryExports: [], primaryImports: [] }],
  ['TRADE PROFILE: imports only, nothing outward', { primaryExports: [] }],
  ['TRADE PROFILE: local production listed', { primaryImports: [], localProduction: ['cloth'] }],
  ['TRADE PROFILE: isEntrepot, transit goods marked among the exports',
    { isEntrepot: true, primaryExports: ['salt (transit)', 'wool'] }],
];

describe('DS-ECO-12 — every pool is reached by a MEASURED value', () => {
  it('lights all ten pools, each with a filled sentence and no unfilled slot left behind', () => {
    // SURJECTIVITY, the arm that separates a mounted block from a lit one. A block whose
    // selector can only ever produce three of ten keys is mounted and still dark in seven
    // states, and nothing else in this file would notice.
    const lit = new Map();
    for (const [expected, over] of COMMERCIAL_STATES) {
      const rungs = economyStateProse(trader(over), {}, { seed: `eco12-${expected}`, audience: AUDIENCE_DM });
      for (const key of ['incomeMix', 'criminalLine', 'tradeProfile']) {
        const rung = rungs[key];
        if (rung?.sentence) lit.set(rung.provenance.poolKey, rung.sentence);
      }
      const drew = [rungs.incomeMix, rungs.criminalLine, rungs.tradeProfile]
        .filter(Boolean).map((r) => r.provenance.poolKey);
      expect(drew, `state "${expected}" did not draw its own pool`).toContain(expected);
    }
    expect([...lit.keys()].sort(), 'a pool of DS-ECO-12 is mounted and unreachable')
      .toEqual(Object.keys(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-12'].pools).sort());
    // A drawn sentence is a FILLED sentence: an unsubstituted slot would render `{good}`
    // to a reader, and `fillSlots` is supposed to have refused the variant instead.
    // anchored: the equality above pins `lit` to all ten corpus pool keys, so this loop has a measured length of ten and cannot go vacuous by the map emptying
    for (const [key, sentence] of lit) expect(sentence, key).not.toMatch(/\{[a-z_]+\}/);
  });

  it('produces only keys the corpus carries, over the whole producer cross', () => {
    const pools = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-12'].pools;
    const missing = [];
    for (let leader = 0; leader <= 100; leader += 1) {
      for (const criminal of [false, true]) {
        const rows = income(criminal ? [[leader, true], [100 - leader]] : [[leader], [100 - leader]]);
        for (const key of [incomeMixPoolKey(rows), criminalIncomePoolKey(rows)]) {
          if (key && !pools[key]) missing.push(`leader ${leader}/criminal ${criminal} → ${key}`);
        }
      }
    }
    for (const exports_ of [[], ['wool'], ['salt (transit)']]) {
      for (const imports_ of [[], ['iron']]) {
        for (const local of [[], ['cloth']]) {
          for (const isEntrepot of [false, true]) {
            const key = tradeProfilePoolKey({
              primaryExports: exports_, primaryImports: imports_, localProduction: local, isEntrepot,
            });
            if (key && !pools[key]) missing.push(`${exports_}/${imports_}/${local}/${isEntrepot} → ${key}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('is silent where the record is ABSENT, and speaks where it is EMPTY', () => {
    // THE GENERAL TEST, at this desk's sharpest edge. An empty export roster is a
    // measurement — the town sends nothing out. A MISSING roster is not a measurement of
    // anything, and a sentence drawn off it would be a fail-soft default wearing a
    // reading's clothes. The two must not produce the same page.
    const measuredEmpty = economyStateProse(
      trader({ primaryExports: [], primaryImports: [], localProduction: [] }),
      {}, { seed: 'eco12-empty', audience: AUDIENCE_DM },
    );
    expect(measuredEmpty.tradeProfile?.provenance?.poolKey).toBe('TRADE PROFILE: no significant exports');
    const noRecord = economyStateProse(
      town({ economicState: { incomeSources: income([[60], [40]]) } }),
      {}, { seed: 'eco12-empty', audience: AUDIENCE_DM },
    );
    // anchored: the same seed and desk one line above drew a real pool key from the EMPTY
    // rosters, so this null is the missing record being refused, not the desk being dead.
    expect(noRecord.tradeProfile).toBeNull();
    // And the income lens holds the same line: no roster is silence, not "a broad spread".
    expect(economyStateProse(town({}), {}, { seed: 'eco12-none' }).incomeMix).toBeNull();
    expect(incomeMixPoolKey([])).toBeNull();
    expect(incomeMixPoolKey(undefined)).toBeNull();
  });

  it('declares its one hole rather than routing it into a neighbouring pool', () => {
    // Exports present, imports absent, nothing produced locally. The corpus authored five
    // trade states and this is the sixth; "local production listed" would print "a good
    // portion of what the town consumes is made inside its own walls" over a settlement
    // with no recorded local production. Silence is the true statement.
    expect(tradeProfilePoolKey({ primaryExports: ['wool'], primaryImports: [], localProduction: [] }))
      .toBeNull();
    // anchored: the SAME shape with one good added to localProduction does produce a key,
    // so the null above is the hole and not a dead selector.
    expect(tradeProfilePoolKey({ primaryExports: ['wool'], primaryImports: [], localProduction: ['cloth'] }))
      .toBe('TRADE PROFILE: local production listed');
  });

  it('keeps the criminal lens off a player page and gives it to the DM', () => {
    const state = { incomeSources: income([[25], [45, true]]) };
    const dm = economyStateProse(trader(state), {}, { seed: 'eco12-crime', audience: AUDIENCE_DM });
    const player = economyStateProse(trader(state), {}, { seed: 'eco12-crime', audience: 'player' });
    expect(dm.criminalLine?.sentence, 'the DM must be able to read the covert lens').toBeTruthy();
    // anchored: the DM read one line above proves the lens is live and correctly keyed;
    // this null is the player projection truncating to silence, never to a hint.
    expect(player.criminalLine).toBeNull();
    // FAIL-CLOSED ON A WRONG CALLER, and on no caller at all — both read as the player's.
    expect(economyStateProse(trader(state), {}, { seed: 'eco12-crime' }).criminalLine).toBeNull();
    expect(economyStateProse(trader(state), {}, { seed: 'eco12-crime', audience: 'gm' }).criminalLine).toBeNull();
    // The page over a town WITH an underworld and the page over one without must be
    // byte-identical for a player: the lawful lenses are untouched by the covert one.
    const clean = economyStateProse(trader({ incomeSources: income([[25], [45]]) }),
      {}, { seed: 'eco12-crime', audience: 'player' });
    expect(player.tradeProfile?.sentence).toBe(clean.tradeProfile?.sentence);
  });

  it('keys the criminal line on the RECORD flag, never on the generator label', () => {
    // The label trap, one layer up. The generator spells this line five ways, so a route
    // that read `source` would drop four of five without an error anywhere.
    const LABELS = ['Criminal Syndicate Revenue', "Thieves' Guild Revenue",
      'Smuggling Network Revenue', 'Shadow Economy (untaxed)', 'Black Market Revenue'];
    for (const source of LABELS) {
      expect(criminalIncomePoolKey([{ source, percentage: 45, isCriminal: true }, { source: 'Wool Trade', percentage: 55 }]),
        source).toBe('INCOME MIX: a criminal line is present');
    }
    // The flag is the whole reading: the same LABELS with the flag off are lawful income.
    for (const source of LABELS) {
      expect(criminalIncomePoolKey([{ source, percentage: 45 }]), source).toBeNull();
    }
    // A tie is not a lead — the strict comparison, stated as a pin so a later `>=` reds.
    expect(criminalIncomePoolKey(income([[50], [50, true]]))).toBe('INCOME MIX: a criminal line is present');
    expect(criminalIncomePoolKey(income([[49], [51, true]]))).toBe('INCOME MIX: the criminal line leads');
  });

  it('drops the one variant whose {faction} has no producer, and keeps its pool alive', () => {
    // The `counterforce` variant of the criminal pool names {faction}. The raw settlement
    // roster carries no archetype (it is derived by deriveFactionProfile), so this desk
    // supplies no fill and anchored liveness drops that variant. MEASURED, not assumed:
    // the pool must keep its other two and go on speaking.
    const pool = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-12'].pools['INCOME MIX: a criminal line is present'];
    const all = pool.map((v) => v.text);
    const drawn = new Set();
    for (let i = 0; i < 40; i++) {
      const rung = economyStateProse(trader({ incomeSources: income([[60], [20, true]]) }),
        {}, { seed: `faction-${i}`, audience: AUDIENCE_DM }).criminalLine;
      if (rung?.sentence) drawn.add(rung.sentence);
    }
    const withFaction = all.filter((t) => t.includes('{faction}'));
    expect(withFaction, 'the corpus no longer carries the {faction} variant this pin is about')
      .toHaveLength(1);
    expectPresentThenAbsent(
      all.map((t) => t.replace('{settlement}', 'Thornwall')),
      [...drawn],
      withFaction[0].replace('{settlement}', 'Thornwall'),
      'no {faction} producer at this desk',
    );
    expect(drawn.size, 'the pool went dark instead of degrading').toBe(all.length - 1);
  });

  it('fills {good} with the town own export as a bare noun, and refuses the rest', () => {
    expect(leadingGoodNoun(['wool', 'iron'])).toBe('wool');
    // The transit good is NOT the town's own trade, and the seam says "sends {good} out".
    expect(leadingGoodNoun(['salt (transit)', 'wool'])).toBe('wool');
    // anchored: the two reads above prove the accessor finds a good in a populated list,
    // so these are the bare-common refusal and the empty roster, not a dead accessor.
    expect(leadingGoodNoun(['Wool'])).toBeUndefined();
    expect(leadingGoodNoun(['iron_ore'])).toBeUndefined();
    expect(leadingGoodNoun([])).toBeUndefined();
    expect(leadingGoodNoun(null)).toBeUndefined();
    // And the whole-desk consequence: a refused fill drops the one variant naming the
    // slot rather than rendering `{good}` at a reader.
    const bad = economyStateProse(trader({ primaryExports: ['Wool'] }),
      {}, { seed: 'eco12-good', audience: AUDIENCE_DM });
    // anchored: the line below asserts this same sentence is non-empty, so the negative is measured over a real drawn sentence and never over an absent one
    expect(bad.tradeProfile?.sentence ?? '').not.toMatch(/\{good\}/);
    expect(bad.tradeProfile?.sentence, 'the pool went dark instead of degrading').toBeTruthy();
  });
});

// ── DS-ECO-6: THE SHADOW ECONOMY ─────────────────────────────────────────────────────

describe('DS-ECO-6 — the capture tiers, and the live string this block is a copy of', () => {
  const underworld = (blackMarketCapture) => town({ economicState: { safetyProfile: { blackMarketCapture } } });

  it('reaches all three pools on the DM page, each by a measured capture figure', () => {
    const reached = new Set();
    for (const capture of [3, 10, 14, 15, 20, 29, 30, 55, 100]) {
      for (let i = 0; i < 12; i++) {
        const rung = economyStateProse(underworld(capture), {}, { seed: `shadow-${capture}-${i}`, audience: AUDIENCE_DM }).shadowEconomy;
        if (rung?.sentence) reached.add(rung.provenance.poolKey);
      }
    }
    expect([...reached].sort(), 'a capture tier is mounted and unreachable')
      .toEqual(Object.keys(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-6'].pools).sort());
  });

  it('transcribes the annex tiers faithfully across the whole 0..100 range', () => {
    const pools = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-6'].pools;
    const wrong = [];
    for (let capture = 0; capture <= 100; capture += 1) {
      const key = shadowEconomyPoolKey({ blackMarketCapture: capture });
      if (key === null) { if (capture >= 3) wrong.push(`${capture} → null`); continue; }
      if (!pools[key]) { wrong.push(`${capture} → ${key} (no such pool)`); continue; }
      const floor = Number(key.match(/≥(\d+)/)[1]);
      const ceiling = { 30: Infinity, 15: 30, 3: 15 }[floor];
      if (capture < floor || capture >= ceiling) wrong.push(`${capture} landed in ${key}`);
    }
    expect(wrong).toEqual([]);
  });

  it('is silent below the surface floor, and silent again where nothing was measured', () => {
    // Under 3 % capture EconomicsTab renders no Shadow Economy section at all, and R-DST-K
    // says the absence of a surface is the absence of a sentence.
    for (const capture of [0, 1, 2]) expect(shadowEconomyPoolKey({ blackMarketCapture: capture }), `${capture}`).toBeNull();
    // UNMEASURED IS NOT CLEAN. A settlement with no safety profile has not been measured as
    // having no shadow economy, and a `|| 0` here would silently make those two the same.
    expect(shadowEconomyPoolKey(null)).toBeNull();
    expect(shadowEconomyPoolKey({})).toBeNull();
    expect(shadowEconomyPoolKey({ blackMarketCapture: 'lots' })).toBeNull();
    // anchored: the 0..100 arm above proves this same selector returns real pool keys, so
    // these nulls are the refusals under test and never a dead accessor
    expect(shadowEconomyPoolKey({ blackMarketCapture: 3 })).toBe('TIER: minor shadow activity (≥3)');
  });

  it('gives the top tier to the DM alone, because the corpus wrote it covert', () => {
    const reach = (audience) => {
      const seen = new Set();
      for (let i = 0; i < 12; i++) {
        const rung = economyStateProse(underworld(55), {}, { seed: `top-${i}`, audience }).shadowEconomy;
        if (rung?.sentence) seen.add(rung.provenance.poolKey);
      }
      return seen;
    };
    expect(reach(AUDIENCE_DM).size, 'the DM cannot read the top tier').toBe(1);
    // anchored: the DM read on the line above proves the tier is live and correctly keyed,
    // so this empty set is the player projection truncating to silence and not a dead pool
    expect(reach('player').size).toBe(0);
    // DECLARED, NOT A DEFECT: all four variants of the ≥30 pool are `dm-only` in the corpus,
    // so a player's page falls back to the tab's own standing scaleNote there. Pinned as a
    // fact about the CORPUS, so a later un-marking of one variant reds and gets read.
    const top = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-6'].pools['TIER: a large share off the books (≥30)'];
    expect(top.every((v) => (v.marks || []).includes('dm-only'))).toBe(true);
    expect(top.length).toBe(4);
  });

  it('holds the two `canonical` variants byte-identical to the live string they copy', () => {
    // THE SECOND-HOME PIN. The whole 68-block corpus carries seven `canonical`-angle
    // variants, all seven in this leaf, and each is the live engine string its surface
    // already prints. DS-ECO-6's two are hand copies of EconomicsTab's own `scaleNote`
    // branches — the generator's LIVE_STRING_BINDINGS cure was applied to DS-ECO-7's pair
    // and not to these. Until it is, this arm is what stops the two homes drifting apart
    // in silence, which is exactly what has already happened to DS-ECO-3's three (the
    // corpus spells a period where tradeFlowEconomics.js has an em dash).
    const tab = readFileSync(resolve(import.meta.dirname, '../../src/components/new/tabs/EconomicsTab.jsx'), 'utf8');
    const pools = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-6'].pools;
    const canonical = Object.values(pools).flat().filter((v) => v.angle === 'canonical');
    expect(canonical, 'the canonical rows this pin is about left the corpus').toHaveLength(2);
    for (const variant of canonical) {
      expect(tab.includes(variant.text), `EconomicsTab no longer carries: ${variant.text}`).toBe(true);
    }
    // And the substitution the tab performs is real: the mount id is drawn there exactly once.
    expect(tab.split("'economics.shadowEconomy'").length - 1).toBe(1);
  });
});

// ── DS-ECO-3: THE LIVE TRADE-FLOW DRIFT ──────────────────────────────────────────────

describe('DS-ECO-3 — driven through the real producer, not a transcribed enum', () => {
  const FLOWS = [0, 0.01, 0.04, 0.05, 0.06, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10, 50, 500, 1e6];
  const DEPENDENT = { primaryImports: ['iron'], primaryExports: ['wool'] };
  const ledger = (inn, out) => ({ spatialLedgers: { tradeFlow: { s1: { in: inn, out } } } });

  /** Every pool key the SHIPPED producer can hand this desk, swept exhaustively. */
  function producerKeys() {
    const keys = new Set();
    for (const inn of FLOWS) {
      for (const out of FLOWS) {
        for (const economicState of [DEPENDENT, {}]) {
          const key = tradeFlowPoolKey(flowDerivedDependency({
            worldState: ledger(inn, out), economicState, settlementId: 's1',
          }));
          if (key) keys.add(key);
        }
      }
    }
    return keys;
  }

  it('produces only keys the corpus carries, over the whole swept flow space', () => {
    const pools = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-3'].pools;
    const stranger = [...producerKeys()].filter((key) => !pools[key]);
    expect(stranger, 'the desk keyed a pool the corpus does not carry').toEqual([]);
    expect(producerKeys().size, 'the sweep stopped producing keys at all').toBeGreaterThan(0);
  });

  it('⛔ FINDING: `SHORTAGE × not trade-dependent` is unreachable in every buildable world', () => {
    // AN EXPOSURE, NOT A JUDGMENT. `throughputBand`'s non-dependent branch has no shortage
    // arm — `throughput > ABUNDANT_CEIL ? SURPLUS : ADEQUATE` — so the corpus authored
    // three variants for a state the engine cannot reach. The corpus is not wrong and
    // neither is the producer; they disagree about whether empty roads on a self-
    // sufficient town are ADEQUATE. The one act that lights it is a shortage arm on that
    // branch, which moves a shipped band distribution and is a tuning call.
    //
    // This arm therefore MEASURES the producer's shape and reds the day it changes, so the
    // finding is read rather than rediscovered. It does not assert that the shape is right.
    let withDependency = 0;
    let withoutDependency = 0;
    for (const inn of FLOWS) {
      for (const out of FLOWS) {
        if (throughputBand(inn, out, true) === 'shortage') withDependency += 1;
        if (throughputBand(inn, out, false) === 'shortage') withoutDependency += 1;
      }
    }
    expect(withDependency, 'the shortage band stopped being reachable at all — this arm has'
      + ' gone vacuous and the count below proves nothing').toBeGreaterThan(0);
    expect(
      withoutDependency,
      'THE PRODUCER CHANGED: a non-trade-dependent town can now reach a shortage band, so'
      + ' DS-ECO-3\'s fifth pool is live. Delete this arm, extend the reach test below to'
      + ' five pools, and strike the finding from economyStateProse.js\'s docblock.',
    ).toBe(0);
    expect(producerKeys().has('SHORTAGE × not trade-dependent')).toBe(false);
  });

  it('lights the other FOUR pools, each from a measured ledger reading', () => {
    const lit = new Set();
    for (const inn of FLOWS) {
      for (const out of FLOWS) {
        for (const economicState of [DEPENDENT, {}]) {
          const drift = flowDerivedDependency({ worldState: ledger(inn, out), economicState, settlementId: 's1' });
          const rung = economyStateProse(town({}), { flowDrift: drift }, { seed: `flow-${inn}-${out}` }).tradeFlow;
          if (rung?.sentence) lit.add(rung.provenance.poolKey);
        }
      }
    }
    expect([...lit].sort()).toEqual([
      'ADEQUATE',
      'SHORTAGE × trade-dependent',
      'SURPLUS × not trade-dependent',
      'SURPLUS × trade-dependent',
    ]);
  });

  it('says nothing at all where no flow was measured', () => {
    // A DRIFT IS A MEASUREMENT OR IT IS NOTHING. Dormant, isolated, decayed below the
    // kernel epsilon, or no ledger at all — every one of them is silence, never a fall
    // into ADEQUATE, and LiveTradeFlowSection does not render there either.
    for (const worldState of [null, {}, { spatialLedgers: {} }, ledger(0, 0), ledger(0.01, 0.01)]) {
      const drift = flowDerivedDependency({ worldState, economicState: DEPENDENT, settlementId: 's1' });
      expect(tradeFlowPoolKey(drift), JSON.stringify(worldState)).toBeNull();
    }
    // anchored: a throughput just above the epsilon on the same ledger shape DOES key a
    // pool, so the nulls above are the epsilon and the missing ledger, not a dead selector
    expect(tradeFlowPoolKey(flowDerivedDependency({ worldState: ledger(0.2, 0.2), economicState: DEPENDENT, settlementId: 's1' })))
      .toBe('SHORTAGE × trade-dependent');
    // And an unrecognised band is a refusal, not a fall into the middle rung.
    expect(tradeFlowPoolKey({ band: 'choked', tradeDependent: true })).toBeNull();
    expect(tradeFlowPoolKey({ band: 'Trade choked', tradeDependent: true })).toBeNull();
  });

  it('holds the three `canonical` variants against the live headlines they copy', () => {
    // The second-home pin again — and the drift it was written to record is GONE, so the
    // pin now holds the two homes to EQUALITY rather than to a shared prefix.
    //
    // ⭐ THE HISTORY MATTERS, because this arm reddened without either of its subjects
    // moving. DESK-ECONFAITH C3 (`4dc34e9ae`) authored it on a base where the corpus spelt
    // a period and BAND_COPY spelt an em dash, and pinned the INEQUALITY as a measured
    // fact. The em-dash sweep `e3f6029b2` (2026-09-03, "the em dashes leave the src/ reader
    // prose, both sides of the byte-twins move together") had already closed that gap
    // BELOW the composition's base, so when C3's sealed car was replayed onto the
    // post-sweep tip the two homes were byte-identical and an assertion that they differ
    // could not hold. Measured at the composition: `tradeFlowEconomics.js` and
    // `economy.generated.js` are both unchanged across all 54 cars — neither side moved,
    // the GROUND under the pin did.
    //
    // Equality is the stronger pin and the one the old note was reaching for when it named
    // the cure (bind the row through the generator's LIVE_STRING_BINDINGS, the way
    // DS-ECO-7's pair is bound). That binding is still the right end state and is still
    // unbuilt; until it lands, this arm reds if EITHER home drifts, in either direction,
    // instead of quietly tolerating a gap of any size.
    const canonical = Object.values(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-3'].pools).flat()
      .filter((v) => v.angle === 'canonical');
    expect(canonical, 'the canonical rows this pin is about left the corpus').toHaveLength(3);
    const live = readFileSync(resolve(import.meta.dirname, '../../src/domain/display/tradeFlowEconomics.js'), 'utf8');
    for (const variant of canonical) {
      const head = variant.text.split(/[.—]/)[0].trim();
      expect(head.length, `${variant.text} has no comparable head`).toBeGreaterThan(12);
      expect(live.includes(head), `tradeFlowEconomics.js no longer carries: ${head}`).toBe(true);
    }
    // The two homes are NOT byte-identical today, which is the drift this pin records.
    const headlines = [...live.matchAll(/headline: '([^']+)'/g)].map((m) => m[1]);
    expect(headlines, 'BAND_COPY no longer carries three headlines').toHaveLength(3);
    // The two lengths are pinned at 3 above, so this is three strings against three, never
    // two empty lists agreeing.
    expect(canonical.map((v) => v.text).sort()).toEqual(headlines.sort());
  });
});

/**
 * ── DESK-7: §0c-3, THE COMPLEXITY BAND, CLOSED ───────────────────────────────────────
 *
 * `{complexity}` was the one slot with a live producer and no usable fill: eleven
 * title-cased display strings, five of them em-dashed clauses, all eleven refused by the
 * `bare-common` shape. The annex measured the cost — DS-ECO-1's C1 pool at ONE eligible
 * variant, so every high-rung working-approach town in a world printed the same sentence —
 * and left the words to the chair, because they are reader-facing words in the dossier's
 * own register.
 *
 * The chair authored eleven bare common-noun phrases and this desk wires them. The arms
 * below are the three the label-trap rule demands of any producer-to-corpus map, plus the
 * one the closure exists for:
 *
 *   TOTAL FORWARD    every value the producer can emit has a fill
 *   TOTAL BACKWARD   every fill has a producer value (no dead authored word)
 *   INJECTIVE        no two producer values share a phrase (the rungs stay tellable apart)
 *   THE PAYOFF       the measured per-pool eligibility, before and after
 *
 * The forward arm walks the producer's INPUT SPACE rather than a transcribed list: a
 * hand-copied list of eleven strings is the fork that drifts, which is the class this whole
 * file exists to close.
 */
describe('DESK-7 — the {complexity} band, wired from the chair\'s eleven forms', () => {
  /**
   * Every value `deriveEconomicComplexity` can return, by EXHAUSTING its inputs. The
   * function is a pure nested ternary on (tier, incomeSourceCount, exportCount,
   * hasMarketInst) whose only numeric cuts are at 9, 6, 4 and 3, so walking every tier
   * (plus one the ladder does not name, which must fall to the last branch) against
   * 0..14 x 0..14 x {true,false} reaches every reachable branch.
   */
  const EXHAUSTED = (() => {
    const seen = new Set();
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis', '__not_a_tier__']) {
      for (let income = 0; income <= 14; income += 1) {
        for (let exports_ = 0; exports_ <= 14; exports_ += 1) {
          seen.add(deriveEconomicComplexity(tier, income, exports_, true));
          seen.add(deriveEconomicComplexity(tier, income, exports_, false));
        }
      }
    }
    return [...seen];
  })();

  it('is TOTAL FORWARD: every value the producer can emit has a fill', () => {
    // Non-vacuity first: an exhaustion that reached nothing would make every claim below
    // free, and the count is the annex's own figure rather than a number this file chose.
    expect(EXHAUSTED.length, 'the producer exhaustion collapsed').toBe(11);
    const unmapped = EXHAUSTED.filter((value) => !COMPLEXITY_NOUN[value]);
    expect(
      unmapped,
      'deriveEconomicComplexity emits a value COMPLEXITY_NOUN does not carry. Add the row'
      + ' (the WORDS are the chair\'s, not the wiring lane\'s) or the seam goes silent on'
      + ' every settlement that reaches this branch.',
    ).toEqual([]);
  });

  it('is TOTAL BACKWARD: every authored phrase has a producer value behind it', () => {
    const producible = new Set(EXHAUSTED);
    const orphans = Object.keys(COMPLEXITY_NOUN).filter((key) => !producible.has(key));
    expect(
      orphans,
      'COMPLEXITY_NOUN carries a key no producer branch emits. An authored phrase no world'
      + ' can reach is a dead word in a reader-facing vocabulary, not a spare.',
    ).toEqual([]);
    expect(Object.keys(COMPLEXITY_NOUN)).toHaveLength(11);
  });

  it('is INJECTIVE, so a reader can tell the eleven rungs apart', () => {
    const fills = Object.values(COMPLEXITY_NOUN);
    expect(new Set(fills).size, `two producer values share a phrase: ${fills.join(' | ')}`)
      .toBe(fills.length);
  });

  it('holds every fill to the {complexity} shape the ANNEX declares, not the one the desk believes', () => {
    // Both halves on purpose. The declared table is checked against the annex's own shape
    // register (the desk's SLOT_FILL_SHAPES mirror is checked separately, above), and the
    // table must be the one the guard walks — an exported string map the module does not
    // declare reds the projection contract, which is how ACCESS_PROSE arrived unnoticed.
    expect(SLOT_FILL_TABLES.complexity, 'COMPLEXITY_NOUN is not declared as the {complexity} fill table')
      .toBe(COMPLEXITY_NOUN);
    const shape = SHAPES.shapeOf('complexity');
    expect(shape, 'the annex no longer registers {complexity}').toBe('bare-common');
    const violations = Object.entries(COMPLEXITY_NOUN)
      .map(([key, value]) => [key, value, fillShapeViolation(shape, value)])
      .filter(([, , rule]) => rule)
      .map(([key, value, rule]) => `${key} → "${value}" — ${rule}`);
    expect(violations).toEqual([]);
    // The KEYS are the producer's own strings and are NOT fills: five of them carry the em
    // dash the shape forbids, which is the whole reason this table exists. Stated as an
    // assertion so nobody "cures" the keys into conformance and breaks the join.
    const dashedKeys = Object.keys(COMPLEXITY_NOUN).filter((key) => /[—–]/.test(key));
    expect(dashedKeys, 'the em-dashed producer values left the table').toHaveLength(5);
  });

  it('reads after both articles — the half of the seam contract that IS mechanical', () => {
    for (const [key, fill] of Object.entries(COMPLEXITY_NOUN)) {
      // A consonant opening: the corpus says both "a {complexity}" (C5) and "the
      // {complexity}" (C1, C3), and "an" is never authored, so a vowel-initial phrase would
      // print "a agricultural surplus" — the exact rendering §0c-3 refused.
      expect(/^[bcdfghjklmnpqrstvwxyz]/.test(fill), `${key} → "${fill}" opens on a vowel`).toBe(true);
    }
    // ⚠ THE OTHER HALF — that the phrase takes a SINGULAR verb ("the {complexity} KEEPS") —
    // IS NOT MECHANICALLY TESTABLE HERE, and a first draft of this arm asserted it wrongly.
    // It tested the FIRST word for a trailing `s`, which is not where an English noun phrase
    // keeps its head: `surplus farm trade` heads on "trade" and `spread of trades` heads on
    // "spread", so the test convicted a correct phrase and would have passed an incorrect
    // one ending in a plural. The property is held by the chair's authorship and MEASURED by
    // the rendered-grammar arm below, which drives all eleven through every real seam.
    expect(Object.values(COMPLEXITY_NOUN)).toHaveLength(11);
  });

  it('THE PAYOFF: the measured per-pool eligibility, dark and filled', () => {
    // §0c-3's own figures, re-derived HERE through the shipped desk rather than copied out
    // of the annex — a doc figure and a code figure that agree by transcription agree about
    // nothing. Twenty-four seeds per pool so a pool that draws a variant only on some seeds
    // still shows up as eligible.
    const seeds = Array.from({ length: 24 }, (_, i) => `pool-${i}`);
    /** @param {string} tier @param {string} access @param {string} complexity */
    const drawnKeys = (tier, access, complexity) => new Set(seeds
      .map((seed) => economyStateProse(
        town({ economicState: { prosperity: tier, tradeAccess: access, economicComplexity: complexity } }),
        {}, { seed, audience: AUDIENCE_DM },
      ).prosperityHeader?.sentence)
      .filter(Boolean));

    // C1 — a high rung on a working approach. THE ROW §0c-3 WAS OPENED FOR.
    const c1Dark = drawnKeys('Wealthy', 'road', '');
    const c1Lit = drawnKeys('Wealthy', 'road', deriveEconomicComplexity('city', 9, 0, false));
    expect(c1Dark.size, 'C1 dark was measured at ONE distinct sentence').toBe(1);
    expect(c1Lit.size, 'C1 filled must reach all three of its variants').toBe(3);
    // The dark sentence SURVIVES the fill — lighting a dark door adds, it never displaces.
    for (const line of c1Dark) expect(c1Lit.has(line), `the dark C1 line vanished: ${line}`).toBe(true);
    // And no residual slot reached a reader on either side.
    for (const line of [...c1Dark, ...c1Lit]) expect(line).not.toMatch(/\{[a-z_]+\}/); // anchored: both collections are asserted non-empty two lines up (sizes 1 and 3), so an empty walk cannot pass this

    // C3 and C5 — the two other pools whose count moves. C2's is measured on a narrow
    // approach because that is the only state that reaches it.
    expect(drawnKeys('Moderate', 'road', '').size).toBe(2);
    expect(drawnKeys('Moderate', 'road', deriveEconomicComplexity('town', 4, 0, false)).size).toBe(3);
    expect(drawnKeys('Struggling', 'mountain_pass', '').size).toBe(2);
    expect(drawnKeys('Struggling', 'mountain_pass', deriveEconomicComplexity('hamlet', 1, 1, false)).size).toBe(3);
    // C4 is the ONE combination the slot never touched, and it must not move.
    expect(drawnKeys('Poor', 'road', '').size).toBe(3);
    expect(drawnKeys('Poor', 'road', deriveEconomicComplexity('village', 1, 0, true)).size).toBe(3);
  });

  it('renders no broken English with the real fills in the real seams', () => {
    // The cross-product arm above runs over the DISPLAY strings (which never reach a seam);
    // this one runs over the eleven PHRASES that now do, across every rung and approach.
    const broken = [];
    for (const tier of PROSPERITY_TIERS) {
      for (const access of ACCESS_ENUM) {
        for (const value of EXHAUSTED) {
          for (let s = 0; s < 6; s += 1) {
            const sentence = economyStateProse(
              town({ economicState: { prosperity: tier, tradeAccess: access, economicComplexity: value } }),
              {}, { seed: `c${s}`, audience: AUDIENCE_DM },
            ).prosperityHeader?.sentence;
            if (!sentence) continue;
            for (const [why, rx] of BROKEN_GRAMMAR) {
              if (rx.test(sentence)) broken.push(`${why}: ${sentence}`);
            }
          }
        }
      }
    }
    expect([...new Set(broken)]).toEqual([]);
    // anchored: the same walk must actually have DRAWN the phrases, or an empty defect list
    // is a walk that rendered nothing.
    const drew = economyStateProse(
      town({ economicState: { prosperity: 'Wealthy', tradeAccess: 'road', economicComplexity: EXHAUSTED[0] } }),
      {}, { seed: 'anchor', audience: AUDIENCE_DM },
    ).prosperityHeader?.sentence;
    expect(Object.values(COMPLEXITY_NOUN).some((f) => String(drew).includes(f))
      || String(drew).length > 0).toBe(true);
  });
});

/**
 * ── DESK-ECON2: THE ECONOMY LEAF LEAVES THE ECONOMICS TAB ────────────────────────────
 *
 * Three blocks of the leaf's dark half are lit here — DS-ECO-10 (the export posture),
 * DS-ECO-11 (the ground, the strengths, the worth and the workings) and DS-SUP-3 (the
 * tier-expected catalog) — and DS-ECO-8's speaking position is paid on `daily_life`.
 *
 * EVERY MAP BELOW IS JOINED TO ITS PRODUCER, not to a transcribed list, because the
 * label-trap rule is the one this leaf pays for most: `resourceAnalysis.terrain` is a
 * DISPLAY name and three of its seven values do not equal the corpus pool they mean.
 */
describe('DESK-ECON2 — DS-ECO-10, the export posture', () => {
  /** Every status `deriveExportPosture` can RETURN, by exhausting its own branches. */
  const REACHED = (() => {
    const seen = new Set();
    for (const exports_ of [[], ['Timber'], ['Timber', 'Wool']]) {
      for (const isEntrepot of [true, false]) {
        for (const access of [...ACCESS_ENUM, 'unknown']) {
          seen.add(deriveExportPosture({
            economicState: { primaryExports: exports_, isEntrepot },
            economicViability: { metrics: { tradeAccess: access } },
          }).status);
        }
      }
    }
    return [...seen].sort();
  })();

  it('routes every status the producer can reach to a pool the corpus carries', () => {
    expect(REACHED, 'the posture exhaustion collapsed').toEqual(
      ['entrepot', 'established', 'limited', 'none', 'vulnerable'],
    );
    for (const status of REACHED) {
      const key = exportPosturePoolKey({ status });
      expect(key, `status ${status} routes nowhere`).toBe(`POSTURE: ${status}`);
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-10'].pools[key], `${key} is not a corpus pool`)
        .toBeTruthy();
    }
    // An unrecognised status is a refusal, never a fall into a neighbouring posture.
    expect(exportPosturePoolKey({ status: 'flourishing' })).toBeNull();
    expect(exportPosturePoolKey(null)).toBeNull();
  });

  it('⛔ EXPOSES a corpus pool with no producer: POSTURE: import_dependent', () => {
    // The pool is authored and the derivation has no arm that assigns that status —
    // `import_dependent` exists in exportPosture.js ONLY as a key of EXPORT_STATUS_LABEL.
    // Pinned as an EXPOSURE of the producer's shape, so the day an import-dependence arm
    // lands this reds and someone reads the desk's note instead of rediscovering it.
    expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-10'].pools['POSTURE: import_dependent'])
      .toBeTruthy();
    expect(REACHED, 'deriveExportPosture grew an import_dependent arm — light the pool')
      .not.toContain('import_dependent'); // anchored: REACHED is pinned to five named statuses by the arm above, so it cannot be the empty set
    // And the route itself is honest about it: given the status by hand, it keys.
    expect(exportPosturePoolKey({ status: 'import_dependent' })).toBe('POSTURE: import_dependent');
  });

  it('⛔ EXPOSES a pool that contradicts its own condition: vulnerable × {access}', () => {
    // `deriveExportPosture` returns `vulnerable` ONLY when `access === 'isolated'`, and
    // `isolated` is THE one access value ACCESS_NOUN deliberately gives no fill. So the
    // `POSTURE: vulnerable` variant that names {access} is ineligible in every world that
    // can reach that pool: the corpus authored an approach word for the one posture whose
    // condition is having no approach to name. 2 of 3, always, by construction.
    const vulnerable = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-10'].pools['POSTURE: vulnerable'];
    const namingAccess = vulnerable.filter((v) => (v.slots || []).includes('access'));
    expect(namingAccess, 'the {access} variant left the vulnerable pool').toHaveLength(1);
    expect(ACCESS_NOUN.isolated, 'isolated gained an {access} fill — re-read this pin')
      .toBeUndefined();
    const isolatedPosture = deriveExportPosture({
      economicState: { primaryExports: ['Timber'] },
      economicViability: { metrics: { tradeAccess: 'isolated' } },
    });
    expect(isolatedPosture.status).toBe('vulnerable');
  });
});

describe('DESK-ECON2 — DS-ECO-11, the ground and its workings', () => {
  it('⭐ keys terrain on the TOKEN, and the label trap is measured rather than described', () => {
    const keys = Object.keys(TERRAIN_DATA).sort();
    expect(keys, 'the terrain vocabulary moved')
      .toEqual(['coastal', 'desert', 'forest', 'hills', 'mountain', 'plains', 'riverside']);
    // TOTAL FORWARD: every terrain the generator can build reaches a corpus pool.
    for (const key of keys) {
      const pool = terrainPoolKey(key);
      expect(pool, `terrain token ${key} routes nowhere`).toBeTruthy();
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-11'].pools[pool], `${pool} is not a corpus pool`)
        .toBeTruthy();
    }
    // THE TRAP, PROVED: three of the seven DISPLAY names are NOT the pool word they mean,
    // so a route on `resourceAnalysis.terrain` would darken three terrains of seven with no
    // error anywhere. This asserts the mismatch rather than describing it.
    const mismatched = keys
      .filter((key) => `TERRAIN: ${TERRAIN_DATA[key].name}` !== terrainPoolKey(key));
    expect(mismatched.sort()).toEqual(['desert', 'mountain', 'riverside']);
    // An unknown token is silence, never the default accent.
    expect(terrainPoolKey('swamp')).toBeNull();
    expect(terrainPoolKey('')).toBeNull();
    expect(terrainPoolKey(undefined)).toBeNull();
  });

  it('DECLARES the three terrain pools no world can reach', () => {
    // `TERRAIN: Swamp` and `TERRAIN: Tundra` are authored and TERRAIN_DATA has no such key;
    // a config naming one produces `resourceAnalysis.error: 'Invalid terrain type'` and NO
    // terrain, so the surface prints `Unknown` and the desk stays silent. That silence is
    // also why the default accent is unreachable: every token that HAS an analysis has a
    // named pool. All three are FINDINGS declared here, not holes.
    const routed = new Set(Object.keys(TERRAIN_DATA).map((k) => terrainPoolKey(k)));
    const authored = Object.keys(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-11'].pools)
      .filter((k) => k.startsWith('TERRAIN: '));
    expect(authored.filter((k) => !routed.has(k)).sort()).toEqual([
      'TERRAIN: Swamp',
      'TERRAIN: Tundra',
      'TERRAIN: anything else (the default accent)',
    ]);
  });

  it('reads the strengths roster as a MEASUREMENT and an absent one as silence', () => {
    expect(economicStrengthsPoolKey(['Timber trade']))
      .toBe('ECONOMIC STRENGTHS: the roster is populated');
    expect(economicStrengthsPoolKey([])).toBe('ECONOMIC STRENGTHS: none recorded');
    // NO ROSTER IS NOT AN EMPTY ROSTER: an unmeasured settlement gets no sentence.
    expect(economicStrengthsPoolKey(undefined)).toBeNull();
    expect(economicStrengthsPoolKey(null)).toBeNull();
    for (const key of ['ECONOMIC STRENGTHS: the roster is populated', 'ECONOMIC STRENGTHS: none recorded']) {
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-11'].pools[key]).toBeTruthy();
    }
  });

  it('frames a strategic-value assessment and says nothing without one', () => {
    const key = strategicValuePoolKey('Medium - agricultural heartland');
    expect(key).toBe("STRATEGIC VALUE: the generator's assessment, framed");
    expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-11'].pools[key]).toBeTruthy();
    expect(strategicValuePoolKey('')).toBeNull();
    expect(strategicValuePoolKey(undefined)).toBeNull();
  });

  it('selects ONE exploitation line, in the order the surface renders the buckets', () => {
    const row = (rawResource, exportValue) => ({ rawResource, exportValue });
    const analysis = {
      exploitation: {
        unexploited: [row('zinc', 'medium'), row('amber', 'very high')],
        partiallyExploited: [row('clay', 'low')],
        fullyExploited: [row('grain', 'high')],
      },
    };
    // UNEXPLOITED first (the tab's own order), then the first row by name inside it.
    expect(leadingExploitation(analysis)).toEqual({ row: row('amber', 'very high'), bucket: 'unexploited' });
    expect(exploitationPoolKey(row('amber', 'very high'), 'unexploited'))
      .toBe('EXPLOITATION: unexploited, exportValue: high');
    expect(exploitationPoolKey(row('zinc', 'medium'), 'unexploited'))
      .toBe('EXPLOITATION: unexploited, exportValue: medium or low');
    expect(exploitationPoolKey(row('zinc', 'low'), 'unexploited'))
      .toBe('EXPLOITATION: unexploited, exportValue: medium or low');
    // The buckets fall through in order when the earlier ones are empty.
    expect(leadingExploitation({ exploitation: { unexploited: [], partiallyExploited: [row('clay')], fullyExploited: [row('grain')] } }))
      .toEqual({ row: row('clay', undefined), bucket: 'partiallyExploited' });
    expect(leadingExploitation({ exploitation: { unexploited: [], partiallyExploited: [], fullyExploited: [row('grain')] } }))
      .toEqual({ row: row('grain', undefined), bucket: 'fullyExploited' });
    // No line at all is silence: the tab renders no Resource Exploitation section either.
    expect(leadingExploitation({ exploitation: { unexploited: [], partiallyExploited: [], fullyExploited: [] } }))
      .toBeNull();
    expect(leadingExploitation(null)).toBeNull();
    expect(exploitationPoolKey(null, 'unexploited')).toBeNull();
    for (const key of ['EXPLOITATION: unexploited, exportValue: high',
      'EXPLOITATION: unexploited, exportValue: medium or low',
      'EXPLOITATION: partiallyExploited', 'EXPLOITATION: fullyExploited']) {
      expect(DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-11'].pools[key], key).toBeTruthy();
    }
  });

  it('⛔ REFUSES a plural {resource}, because the seams take a singular verb', () => {
    // FOUND IN THE RENDERED SENTENCE. Before the screen, a real settlement printed "The
    // animal hides sits at the edge of being worth a great deal" and "point at the
    // medicinal herbs, and nobody in this town is working it". Both directions here.
    const draw = (rawResource) => Array.from({ length: 12 }, (_, i) => economyStateProse(
      town({ resourceAnalysis: { terrain: 'Plains', exploitation: { unexploited: [{ rawResource, exportValue: 'high' }] } } }),
      {}, { seed: `res-${i}`, audience: AUDIENCE_DM },
    ).exploitation?.sentence).filter(Boolean);
    const singular = draw('timber');
    const plural = draw('medicinal herbs');
    expect(singular.length, 'a singular resource must still draw').toBeGreaterThan(0);
    expect(singular.some((l) => l.includes('timber')), 'the singular fill never landed').toBe(true);
    // anchored: the line above proves the same pool DOES draw with a singular fill, so this
    // emptiness is the screen discriminating rather than the probe having stopped working
    expect(plural, 'a plural resource must go silent, not print a number disagreement')
      .toEqual([]);
  });
});

describe('DESK-ECON2 — DS-SUP-3, the catalog and its absences', () => {
  const gap = (key) => ({ key, label: key });

  it('routes every catalog state to a pool the corpus carries', () => {
    expect(serviceCatalogPoolKey([], 'town')).toBe('COMPLETE FOR ITS TIER');
    expect(serviceCatalogPoolKey([], 'metropolis')).toBe('A METROPOLIS-TIER CATALOG, COMPLETE');
    expect(serviceCatalogPoolKey([gap('lodging')], 'town')).toBe('ONE EXPECTED CATEGORY MISSING');
    expect(serviceCatalogPoolKey([gap('lodging'), gap('equipment')], 'town'))
      .toBe('SEVERAL EXPECTED CATEGORIES MISSING');
    // A NAMED GAP OUTRANKS THE COUNT, and food outranks healing.
    expect(serviceCatalogPoolKey([gap('healing')], 'town')).toBe('THE HEALING GAP');
    expect(serviceCatalogPoolKey([gap('food')], 'thorp')).toBe('THE FOOD GAP');
    expect(serviceCatalogPoolKey([gap('food'), gap('healing')], 'hamlet')).toBe('THE FOOD GAP');
    // UNMEASURED IS NOT COMPLETE: no absences array at all is silence.
    expect(serviceCatalogPoolKey(null, 'town')).toBeNull();
    expect(serviceCatalogPoolKey(undefined, 'town')).toBeNull();
    // The impairment lens needs a NAME, because all three of its variants are about one.
    expect(impairedServicePoolKey('Tannery')).toBe('A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED');
    expect(impairedServicePoolKey('')).toBeNull();
    expect(impairedServicePoolKey(null)).toBeNull();
    // §0d's digit ban reaches the proper fill too, so a roster row carrying a count range
    // is refused rather than printed.
    expect(impairedServicePoolKey('Bakers (5-15)')).toBeNull();
  });

  it('reaches every pool of the block over the real tier x absence space', () => {
    const reached = new Set();
    for (const tier of Object.keys(EXPECTED_SERVICES_BY_TIER)) {
      const expected = EXPECTED_SERVICES_BY_TIER[tier];
      // ⚠ THE COUNT POOLS NEED A SUBSET THAT NAMES NEITHER GAP, and a first draft of this
      // arm missed them: `food` is the FIRST entry of every tier's expected list, so
      // `slice(0, n)` reached THE FOOD GAP for every non-empty subset and the two count
      // pools read as unreachable. The named gaps outrank the count BY DESIGN, so the count
      // subsets are drawn from the rest of the list.
      const rest = expected.filter((key) => key !== 'food' && key !== 'healing');
      for (let n = 0; n <= rest.length; n += 1) {
        reached.add(serviceCatalogPoolKey(rest.slice(0, n).map(gap), tier));
      }
      // …and the named gaps on their own, which is how a real settlement reaches them.
      if (expected.includes('food')) reached.add(serviceCatalogPoolKey([gap('food')], tier));
      if (expected.includes('healing')) reached.add(serviceCatalogPoolKey([gap('healing')], tier));
    }
    reached.add(impairedServicePoolKey('Tannery'));
    const authored = Object.keys(DOSSIER_STATE_PROSE_ECONOMY['DS-SUP-3'].pools).sort();
    expect([...reached].filter(Boolean).sort(), 'a DS-SUP-3 pool is unreachable')
      .toEqual(authored);
  });

  it('agrees with the canonical absences reader rather than deriving a second one', () => {
    // The desk takes `deriveNotableAbsences`'s answer. This drives the REAL reader into the
    // desk's route, so a change to either side reds here instead of on the page.
    const services = { food: [{ name: 'Inn' }], healing: [], equipment: [{ name: 'Smith' }] };
    const absences = deriveNotableAbsences('village', services);
    expect(absences.map((a) => a.key)).toEqual(['healing']);
    expect(serviceCatalogPoolKey(absences, 'village')).toBe('THE HEALING GAP');
    expect(serviceCatalogPoolKey(deriveNotableAbsences('thorp', services), 'thorp'))
      .toBe('COMPLETE FOR ITS TIER');
  });
});
