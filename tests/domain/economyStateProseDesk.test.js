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
import { describe, expect, it } from 'vitest';
import {
  economyStateProse,
  foodSecurityPoolKey,
  foodTilePoolKey,
  granaryPoolKey,
  prosperityHeaderPoolKey,
} from '../../src/domain/display/stateProse/economyStateProse.js';
import { legibilityRung, rungSpeaks } from '../../src/domain/display/stateProse/legibilityRung.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { AUDIENCE_DM } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { PROSPERITY_TIERS } from '../../src/data/constants.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const ACCESS_ENUM = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];
const FOOD_LABELS = ['Surplus', 'Secure', 'Pressured', 'Import-Dependent', 'Deficit', 'Active Famine'];
const GRANARY_BANDS = ['well stocked', 'stocked', 'thin', 'nearly empty'];

/** @param {object} over */
function town(over = {}) {
  return {
    name: 'Thornwall',
    economicState: {
      prosperity: 'Moderate',
      tradeAccess: 'road',
      economicComplexity: 'a mixed market economy',
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
    const withComplexity = draw('a mixed market economy');
    const without = draw('');
    const complexityLine = withComplexity.find((line) => line.includes('a mixed market economy'));
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
    for (const key of ['COMBINATION C2 — a high rung on a narrow approach (isolated / mountain_pass)',
      'COMBINATION C5 — a low rung on a narrow approach']) {
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
        granaryOutlook: { available: true, band: 'stocked', season: 'Harvest' },
      },
      { seed: 'world-3', audience: AUDIENCE_DM },
    );
    expect(desk.prosperityHeader.glance).toBe('Comfortable');
    expect(desk.prosperityHeader.sentence).toBeTruthy();
    expect(desk.prosperityHeader.detail).toContainEqual({ label: 'Approach', value: 'the crossroads' });
    expect(desk.prosperityHeader.provenance).toEqual({
      blockId: 'DS-ECO-1',
      poolKey: 'COMBINATION C3 — the middle rungs',
      angle: expect.any(String),
    });
    expect(desk.granaryTile.glance).toBe('stocked');
    expect(desk.granaryTile.sentence).toContain('Harvest');
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
