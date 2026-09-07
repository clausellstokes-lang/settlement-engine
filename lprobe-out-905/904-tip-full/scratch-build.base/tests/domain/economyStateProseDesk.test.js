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
  SLOT_FILL_SHAPES,
  economyStateProse,
  foodSecurityPoolKey,
  foodTilePoolKey,
  granaryPoolKey,
  prosperityHeaderPoolKey,
} from '../../src/domain/display/stateProse/economyStateProse.js';
import { deriveEconomicComplexity } from '../../src/generators/economy/prosperity.js';
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
 * THE COMPLEXITY FIXTURE IS SHAPE-CONFORMANT AND WAS NOT (2026-09-02). It read `'a mixed
 * market economy'` — a fill carrying its own determiner, dropped into five seams that
 * already carry one ("the {complexity} keeps more hands busy"), so this file's own liveness
 * probe asserted that "the a mixed market economy keeps more hands busy" was TRUTHY. It was
 * also a value the engine cannot produce: `deriveEconomicComplexity` emits eleven
 * title-cased strings, five of them em-dashed clauses. The value below is what §0c's
 * `bare-common` shape requires, and it is the shape a ruled §0c-3 band vocabulary will have.
 * @param {object} over
 */
function town(over = {}) {
  return {
    name: 'Thornwall',
    economicState: {
      prosperity: 'Moderate',
      tradeAccess: 'road',
      economicComplexity: 'mixed market economy',
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

    // Same rung, same approach, same pool — the only difference is the fill.
    const withComplexity = draw('mixed market economy');
    const without = draw('');
    const complexityLine = withComplexity.find((line) => line.includes('mixed market economy'));
    expect(complexityLine, 'the pool must name the complexity somewhere').toBeTruthy();
    expectPresentThenAbsent(withComplexity, without, complexityLine, 'no economicComplexity recorded');
    expect(without.length, 'the complexity-free variants survive — the liveness anchor')
      .toBeGreaterThan(0);
    for (const line of without) expect(line).not.toMatch(/\{[a-z_]+\}/);
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
    expect(desk.prosperityHeader.provenance).toEqual({
      blockId: 'DS-ECO-1',
      poolKey: 'COMBINATION C3: the middle rungs',
      angle: expect.any(String),
    });
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
    // arm is agreement about an empty question. All eleven are refused today because none
    // is a bare common-noun phrase; §0c-3 is the open chair row that would change it.
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
