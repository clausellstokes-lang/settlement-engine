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
  criminalIncomePoolKey,
  economyStateProse,
  foodSecurityPoolKey,
  foodTilePoolKey,
  granaryPoolKey,
  incomeMixPoolKey,
  leadingGoodNoun,
  shadowEconomyPoolKey,
  tradeFlowPoolKey,
  prosperityHeaderPoolKey,
  tradeProfilePoolKey,
} from '../../src/domain/display/stateProse/economyStateProse.js';
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
    // The second-home pin again, and the one that shows the class is not hypothetical:
    // these three have ALREADY drifted. The corpus spells a period where BAND_COPY has an
    // em dash, so the pin is on the drifted-apart PREFIX rather than on equality, and it
    // names the cure — bind the row through the generator's LIVE_STRING_BINDINGS, the way
    // DS-ECO-7's pair is bound.
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
    // anchored: the loop above proved every canonical head appears in that same file, so
    // this inequality is the measured punctuation drift and not two empty lists compared
    expect(canonical.map((v) => v.text).sort()).not.toEqual(headlines.sort());
  });
});
