/**
 * magicForms.test.js — W-K slice K2, the forms ladder and THE TWO-SIDED BAND
 * (docs/DESIGN_MAGIC_ECONOMY.md §3a, §3b, §12).
 *
 * The claims §12 asks the forms half to prove:
 *
 *   PRESENCE-INDEPENDENCE   magic-institution presence at high magic is INVARIANT
 *       across every economy band. The amendment's own claim, made falsifiable: the
 *       pin sweeps all four regimes at every tier and asserts one floor.
 *   ARCHETYPE REACHABILITY  the poor + high-magic cell genuinely occurs in REAL
 *       generated corpora and genuinely holds circles. Measured, not assumed: this is
 *       the unreachable-predicate-conjunction hazard class, pre-answered.
 *   THE TWO-SIDED BAND      a rich low-magic town and a poor high-magic one hold
 *       DIFFERENT form sets, and for different reasons (a low floor versus a low
 *       ceiling).
 *   EXPLOITATION ORDERING   magic-derived output is monotone in the economy at FIXED
 *       magic, which is the envelope the one gate exists to guarantee.
 *   THE ARCANE GATE         a cobbler's guild is not a magic guild. Pinned because an
 *       ungated build of this file classified 16 guilds and 13 circles into worlds
 *       whose magic level was `none` (measured over a 180-settlement corpus), which
 *       would have made every pin above measure the mundane guild economy.
 *
 * The two design sentences of §3a are pinned VERBATIM as test names, because they are
 * the specification and a reader should be able to grep them.
 */
import { describe, it, expect } from 'vitest';
import {
  MAGIC_FORMS,
  MAGIC_FORM_CATALOG,
  MAGIC_FORMS_TUNING,
  availableMagicForms,
  classifyMagicForm,
  formRank,
  heldMagicForms,
  magicFormCeiling,
  magicFormFloor,
  magicFormInstitutions,
  magicFormsAboveCeiling,
  magicFormsDelta,
  magicOutputScale,
  shelledMagicForms,
} from '../../src/domain/worldPulse/magicForms.js';
import { MAGIC_REGIMES, regimeForEconomy } from '../../src/domain/worldPulse/magicRegimeModel.js';
import { magicLedger } from '../../src/domain/magicLedger.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { economyHealthScore } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** A settlement literal: tier plus the magic dial, which is all the band reads. */
const town = (tier, magicLevel, institutions = []) => ({
  tier, config: { magicLevel }, institutions,
});

/** An institution literal carrying the catalog's own authored tags. */
const inst = (name, tags, extra = {}) => ({ name, tags, status: 'active', ...extra });

describe('the closed forms ladder (§3b, law 7)', () => {
  it('is exactly the five rungs the design names, in ladder order', () => {
    expect([...MAGIC_FORMS]).toEqual(['practitioner', 'circle', 'tower', 'guild', 'foundry']);
  });

  it('every rung has at least one AUTHORED catalog entry behind it (the graduation, §2)', () => {
    for (const form of MAGIC_FORMS) {
      expect(MAGIC_FORM_CATALOG[form].length, `${form} names no authored entry`).toBeGreaterThan(0);
    }
  });

  it('the tuning tables are TOTAL over their vocabularies, so a widening cannot half-land', () => {
    for (const tier of TIER_ORDER) {
      expect(MAGIC_FORMS_TUNING.tierCap[tier], `tierCap misses ${tier}`).toBeTruthy();
    }
    for (const regime of MAGIC_REGIMES) {
      expect(MAGIC_FORMS_TUNING.regimeCeiling[regime], `regimeCeiling misses ${regime}`).toBeTruthy();
    }
    for (const form of MAGIC_FORMS) {
      expect(MAGIC_FORMS_TUNING.rungCapacity[form], `rungCapacity misses ${form}`).toBeGreaterThan(0);
    }
  });
});

describe('THE ARCANE GATE: a cobbler is not a wizard', () => {
  // Each of these was MEASURED being misclassified by an ungated build of this file.
  const mundane = [
    inst("Cobbler's guild", ['guild', 'trade']),
    inst('Craft guilds (5-15)', ['guild']),
    inst("Merchant guilds (3-8)", ['guild', 'trade']),
    inst("Assassins' guild", ['criminal']),
    inst('Town council', ['civic']),
    inst('Mayor and council', ['civic']),
    inst("Hunter's lodge", ['trade', 'military']),
    inst("Veteran's lodge", ['military']),
  ];

  it('classifies no mundane guild, council or lodge onto the ladder', () => {
    for (const row of mundane) {
      expect(classifyMagicForm(row), `${row.name} must not be a magic form`).toBeNull();
    }
    // ANCHOR: the SAME classifier, on rows that travel the same path, does classify.
    // Without this the eight nulls above would also hold for a classifier that had
    // been broken to return null for everything.
    expect(classifyMagicForm(inst("Mages' guild", ['arcane', 'guild']))).toBe('guild');
    expect(classifyMagicForm(inst('Elder Grove Council', ['arcane', 'religious']))).toBe('circle');
  });

  it('a settlement of nothing but mundane guilds holds NO magic forms', () => {
    const settlement = town('city', 'high', mundane);
    expect(magicFormInstitutions(settlement)).toEqual([]);
    // ANCHOR: adding one genuinely arcane row to the SAME roster produces exactly one
    // form, so the empty above measures the gate rather than a dead reader.
    const withMage = town('city', 'high', [...mundane, inst("Mages' guild", ['arcane', 'guild'])]);
    expect(magicFormInstitutions(withMage).map((f) => f.form)).toEqual(['guild']);
  });

  it('reads the arcane signal through the canonical tag accessor, so a rename still lands', () => {
    // No declared tag at all: the keyword backfill in lib/entities.js supplies ARCANE.
    expect(classifyMagicForm({ name: "Sorcerer's workshop", status: 'active' })).toBe('practitioner');
    expect(classifyMagicForm({ name: 'Cooper workshop', status: 'active' })).toBeNull();
  });

  it('never annexes materialized custom content, by either guard', () => {
    // TWO independent guards agree here, which is why the claim is worth pinning:
    // nativeSemanticName reports no name for a custom row, and institutionTags
    // reports no tags. Either alone would answer null; both is the belt and braces.
    for (const marker of [{ isCustom: true }, { custom: true }, { source: 'custom' }, { customDefinitionId: 'x' }]) {
      expect(
        classifyMagicForm({ name: 'The Sunken Spire', tags: ['arcane'], ...marker }),
        `custom marker ${Object.keys(marker)[0]} must keep the row off the ladder`,
      ).toBeNull();
    }
    // ANCHOR: the identical row WITHOUT a custom marker classifies, so the nulls
    // above measure the custom-content rule and not the name.
    expect(classifyMagicForm({ name: 'The Sunken Spire', tags: ['arcane'] })).toBe('tower');
  });
});

describe('the catalog graduation: authored names land on the rung their prose describes', () => {
  const cases = [
    ['Traveling hedge wizard', ['arcane'], 'practitioner'],
    ['Hedge wizard', ['arcane'], 'practitioner'],
    ['Alchemist shop', ['arcane', 'alchemy'], 'practitioner'],
    ['Druid Circle', ['arcane', 'religious'], 'circle'],
    ['Teleportation circle', ['arcane', 'exotic'], 'circle'],
    ["Wizard's tower", ['arcane'], 'tower'],
    ["Mages' guild", ['arcane', 'guild'], 'guild'],
    ['Alchemist quarter', ['arcane', 'alchemy'], 'guild'],
    ['Academy of magic', ['arcane'], 'guild'],
    ['Golem workforce', ['arcane'], 'foundry'],
    ['Undead labor', ['arcane'], 'foundry'],
    ['Message network (high magic)', ['arcane', 'exotic'], 'foundry'],
  ];
  it.each(cases)('%s reads as %s', (name, tags, form) => {
    expect(classifyMagicForm(inst(name, tags))).toBe(form);
  });
});

describe('THE TWO-SIDED BAND (§3a)', () => {
  it('"a high-magic metropolis with a weak treasury holds circles but no foundry"', () => {
    const band = availableMagicForms({ settlement: town('metropolis', 'high'), regime: 'subsistence' });
    expect([...band.available]).toEqual(['practitioner', 'circle']);
    expect(band.top).toBe('circle');
    // ANCHOR: the SAME metropolis under a strong treasury does reach the foundry, so
    // the absence above measures the treasury and not a ceiling stuck at circle.
    const rich = availableMagicForms({ settlement: town('metropolis', 'high'), regime: 'industrial' });
    expectAbsentWithAnchor(band.available, 'foundry', 'circle');
    expect([...rich.available]).toContain('foundry');
  });

  it('"a thorp holds one practitioner however magical the wood"', () => {
    const failures = collectSeedFailures(
      ['low', 'medium', 'high'].flatMap((m) => MAGIC_REGIMES.map((r) => `${m}|${r}`)),
      (cell) => {
        const [magicLevel, regime] = cell.split('|');
        const band = availableMagicForms({ settlement: town('thorp', magicLevel), regime });
        expect([...band.available], cell).toEqual(['practitioner']);
      },
    );
    expectNoSeedFailures(failures, 'a thorp holds exactly the practitioner rung in every magic x regime cell');
  });

  it('a rich LOW-magic town and a poor HIGH-magic town hold DIFFERENT sets', () => {
    const rich = availableMagicForms({ settlement: town('town', 'low'), regime: 'industrial' });
    const poor = availableMagicForms({ settlement: town('town', 'high'), regime: 'subsistence' });
    expect([...rich.available]).not.toEqual([...poor.available]);
    // And the DIAGNOSIS differs, which is the point of reporting both ends: the rich
    // town is short because its floor is low, the poor one because its ceiling is.
    expect(rich.floor).toBe('practitioner');
    expect(rich.ceiling).toBe('tower');
    expect(poor.floor).toBe('circle');
    expect(poor.ceiling).toBe('practitioner');
  });

  it('the tier caps what money can add: a rich hamlet is still a hamlet', () => {
    const band = availableMagicForms({ settlement: town('hamlet', 'high'), regime: 'industrial' });
    expect(band.top).toBe('practitioner');
    expect(band.tierCap).toBe('practitioner');
  });

  it('PRESENCE IS MAGIC-GATED: a magicless world holds no forms however rich', () => {
    const dead = { tier: 'metropolis', config: { magicLevel: 'high', magicExists: false } };
    const band = availableMagicForms({ settlement: dead, regime: 'industrial' });
    expect([...band.available]).toEqual([]);
    expect(band.top).toBeNull();
    expect(magicFormFloor(dead)).toBeNull();
    // ANCHOR: the identical settlement with magic functioning does hold forms.
    const alive = { tier: 'metropolis', config: { magicLevel: 'high' } };
    expect(availableMagicForms({ settlement: alive, regime: 'industrial' }).top).toBe('foundry');
  });

  it('a magic band of `none` is likewise empty at every regime', () => {
    for (const regime of MAGIC_REGIMES) {
      expect(availableMagicForms({ settlement: town('city', 'none'), regime }).top).toBeNull();
    }
  });
});

describe('PRESENCE-INDEPENDENCE (the amendment claim, made falsifiable)', () => {
  it('the floor takes NO economy argument at all: presence cannot become economy-dependent', () => {
    // The strongest form of the claim is about the SIGNATURE, not the output: there is
    // no regime to read, so no future edit can quietly couple presence to money
    // without changing every call site and reding this pin.
    expect(magicFormFloor.length).toBe(1);
    expect(magicFormCeiling.length).toBe(1);
  });

  it('magic-institution presence at HIGH magic is invariant across every economy band', () => {
    const failures = collectSeedFailures(TIER_ORDER, (tier) => {
      const floors = MAGIC_REGIMES.map(
        (regime) => availableMagicForms({ settlement: town(tier, 'high'), regime }).floor,
      );
      expect(new Set(floors).size, `${tier} floors: ${floors.join(',')}`).toBe(1);
      // And the floor is always actually AVAILABLE, at every band: the ceiling only
      // ever adds above it, it never takes the guarantee away.
      for (const regime of MAGIC_REGIMES) {
        const band = availableMagicForms({ settlement: town(tier, 'high'), regime });
        expect(band.available, `${tier}/${regime}`).toContain(band.floor);
      }
    });
    expectNoSeedFailures(failures, 'the high-magic presence floor is economy-invariant at every tier');
  });

  it('the CEILING, by contrast, does move with the economy: the two axes are genuinely different', () => {
    // ANCHOR for the invariance above. If the ceiling were also invariant the pin
    // would be proving that nothing in this file responds to anything.
    const ceilings = MAGIC_REGIMES.map(magicFormCeiling);
    expect(new Set(ceilings).size).toBe(MAGIC_REGIMES.length);
  });
});

describe('EXPLOITATION ORDERING (§12: output monotone in economy at fixed magic)', () => {
  it('the output scale never falls as the economy rises, at every tier and magic band', () => {
    const cells = TIER_ORDER.flatMap((tier) => ['low', 'medium', 'high'].map((m) => `${tier}|${m}`));
    const failures = collectSeedFailures(cells, (cell) => {
      const [tier, magicLevel] = cell.split('|');
      const settlement = town(tier, magicLevel);
      let previous = -1;
      for (let step = 0; step <= 100; step++) {
        const economy01 = step / 100;
        const regime = regimeForEconomy(economy01);
        const value = magicOutputScale({
          band: availableMagicForms({ settlement, regime }), regime, economy01,
        });
        expect(value, `${cell} fell at economy ${economy01}`).toBeGreaterThanOrEqual(previous - 1e-12);
        previous = value;
      }
    });
    expectNoSeedFailures(failures, 'magic output is monotone in the economy at fixed magic');
  });

  it('a poor high-magic town still produces something: unpaid practitioners work anyway', () => {
    const poor = town('town', 'high');
    const value = magicOutputScale({
      band: availableMagicForms({ settlement: poor, regime: 'subsistence' }),
      regime: 'subsistence',
      economy01: 0.1,
    });
    expect(value).toBeGreaterThan(0);
    // ...and a magicless town of the same tier and wealth produces exactly nothing.
    const dead = { tier: 'town', config: { magicLevel: 'high', magicExists: false } };
    expect(magicOutputScale({
      band: availableMagicForms({ settlement: dead, regime: 'industrial' }),
      regime: 'industrial',
      economy01: 1,
    })).toBe(0);
  });

  it('is STRICTLY greater for a rich settlement than a poor one at the same magic and tier', () => {
    const settlement = town('city', 'high');
    const poor = magicOutputScale({
      band: availableMagicForms({ settlement, regime: 'subsistence' }), regime: 'subsistence', economy01: 0.2,
    });
    const rich = magicOutputScale({
      band: availableMagicForms({ settlement, regime: 'industrial' }), regime: 'industrial', economy01: 0.95,
    });
    expect(rich).toBeGreaterThan(poor);
  });
});

describe('the roster readers (the census law)', () => {
  const foundry = inst('Golem workforce', ['arcane']);
  const shelled = inst('Golem workforce', ['arcane'], {
    status: 'remnant', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
  });
  const ruined = inst('Golem workforce', ['arcane'], {
    status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
  });

  it('a ruined form confers nothing, and neither does a shelled one', () => {
    expect(magicFormInstitutions(town('city', 'high', [ruined]))).toEqual([]);
    expect(magicFormInstitutions(town('city', 'high', [shelled]))).toEqual([]);
    // ANCHOR: the same row STANDING is read, so the two empties measure the filter.
    expect(magicFormInstitutions(town('city', 'high', [foundry])).map((f) => f.form)).toEqual(['foundry']);
  });

  it('the shell reader finds the shelled row and refuses the ruin (law 6 needs it findable)', () => {
    expect(shelledMagicForms(town('city', 'high', [shelled])).map((f) => f.form)).toEqual(['foundry']);
    expect(shelledMagicForms(town('city', 'high', [ruined]))).toEqual([]);
    expect(shelledMagicForms(town('city', 'high', [foundry]))).toEqual([]);
  });

  it('names the rows a demotion must close, and never a row already shelled', () => {
    const settlement = town('city', 'high', [foundry, inst("Wizard's tower", ['arcane'])]);
    const band = availableMagicForms({ settlement, regime: 'funded' });
    const above = magicFormsAboveCeiling({ settlement, band });
    expect(above.map((entry) => entry.form).sort()).toEqual(['foundry', 'tower']);
    const alreadyClosed = town('city', 'high', [shelled]);
    expect(magicFormsAboveCeiling({ settlement: alreadyClosed, band })).toEqual([]);
  });

  it('the practitioner rung can be held by a PERSON with no institution at all (§3b)', () => {
    const thorp = town('thorp', 'high', []);
    expect([...heldMagicForms({ settlement: thorp })]).toEqual([]);
    expect([...heldMagicForms({ settlement: thorp, tiedPractitioner: true })]).toEqual(['practitioner']);
  });
});

describe('the crossing delta (the material half of a receipt)', () => {
  const settlement = town('metropolis', 'high');
  const at = (regime) => availableMagicForms({ settlement, regime });

  it('a promotion reports the rungs that OPENED, in ladder order', () => {
    const delta = magicFormsDelta(at('funded'), at('industrial'));
    expect([...delta.opened]).toEqual(['tower', 'guild', 'foundry']);
    expect([...delta.closed]).toEqual([]);
  });

  it('a demotion reports the rungs that CLOSED, in ladder order', () => {
    const delta = magicFormsDelta(at('industrial'), at('funded'));
    expect([...delta.closed]).toEqual(['tower', 'guild', 'foundry']);
    expect([...delta.opened]).toEqual([]);
  });

  it('a crossing that moves no rung reports neither', () => {
    // metropolis + high magic has a circle FLOOR, so subsistence and funded resolve to
    // the same band: a crossing between them is real but materially silent, and the
    // receipt says so rather than inventing a form.
    const delta = magicFormsDelta(at('subsistence'), at('funded'));
    expect([...delta.opened]).toEqual([]);
    expect([...delta.closed]).toEqual([]);
  });
});

// ── ARCHETYPE REACHABILITY over a REAL corpus ────────────────────────────────
// THE HAZARD THIS ANSWERS: `unreachable-predicate-conjunction`. A band that is
// beautiful on literals and never occurs in generated worlds is dead code wearing a
// design document, and a pin over hand-built settlements cannot tell the difference.
// So this suite generates real settlements through the real pipeline and MEASURES.
describe('ARCHETYPE REACHABILITY (real generated corpus)', () => {
  /**
   * 144 real settlements: every tier, at a HIGH magic dial (20 seeds) and a DEAD one
   * (4 seeds). The split is uneven on purpose. The magicless arm answers a TOTAL
   * claim (no world holds a form) and saturates immediately; the high-magic arm has
   * to populate a RARE cell, and 20 seeds a tier is the size at which it does so
   * with margin. Both arms are fixed-seeded, so this suite is deterministic.
   */
  const HIGH_SEEDS = 20;
  const DEAD_SEEDS = 4;
  /** @type {Array<{ tier: string, magicLevel: string, economy01: number, regime: string, forms: string[], band: ReturnType<typeof availableMagicForms> }>} */
  const corpus = [];
  for (const settType of TIER_ORDER) {
    for (const [priorityMagic, seeds] of [[90, HIGH_SEEDS], [0, DEAD_SEEDS]]) {
      for (let i = 0; i < seeds; i++) {
        const settlement = generateSettlementPipeline(
          { settType, culture: 'germanic', priorityMagic },
          null,
          { seed: `k2-reach-${settType}-${priorityMagic}-${i}`, customContent: {} },
        );
        const economy01 = economyHealthScore(deriveCausalState(settlement)?.scores || {});
        const regime = regimeForEconomy(economy01);
        corpus.push({
          tier: settType,
          magicLevel: magicLedger(settlement).magicLevel,
          economy01,
          regime,
          forms: [...new Set(magicFormInstitutions(settlement).map((f) => f.form))],
          band: availableMagicForms({ settlement, regime }),
        });
      }
    }
  }
  const highMagic = corpus.filter((row) => row.magicLevel === 'high');

  it('the corpus actually generated, so every claim below has a denominator', () => {
    expect(corpus.length).toBe(TIER_ORDER.length * (HIGH_SEEDS + DEAD_SEEDS));
    expect(highMagic.length).toBe(TIER_ORDER.length * HIGH_SEEDS);
  });

  it('a `none`-magic world holds NO magic form anywhere in the corpus', () => {
    const dark = corpus.filter((row) => row.magicLevel === 'none');
    expect(dark.length, 'the corpus must contain magicless settlements to measure').toBeGreaterThan(0);
    expect(dark.filter((row) => row.forms.length > 0)).toEqual([]);
    // ANCHOR: the high-magic half of the SAME corpus does hold forms, so the zero
    // above measures the magic gate and not a classifier that stopped classifying.
    expect(highMagic.filter((row) => row.forms.length > 0).length).toBeGreaterThan(0);
  });

  it('the POOR + HIGH-MAGIC conjunction genuinely OCCURS in real corpora', () => {
    // THE UNREACHABLE-CONJUNCTION HAZARD, answered head on: a band that no generated
    // world ever lands in is dead code wearing a design document.
    const poorHigh = highMagic.filter((row) => row.regime === 'subsistence');
    expect(
      poorHigh.length,
      `the poor + high-magic cell must be reachable; measured 0 of ${highMagic.length}`,
    ).toBeGreaterThan(0);
  });

  it('every poor + high-magic settlement has a NON-EMPTY band floored at a practitioner or a circle', () => {
    // The TOTAL form of the design's claim, and the strong one: poverty never empties
    // the band, because the floor is economy-blind. Total over the cell rather than
    // existential, so it cannot pass on a lucky seed.
    const poorHigh = highMagic.filter((row) => row.regime === 'subsistence');
    const failures = collectSeedFailures(poorHigh, (row) => {
      expect(row.band.available.length, `${row.tier} at economy ${row.economy01.toFixed(3)}`).toBeGreaterThan(0);
      expect(['practitioner', 'circle']).toContain(row.band.floor);
    });
    expectNoSeedFailures(failures, 'poverty never empties a high-magic settlement\'s band');
  });

  it('the POOREST high-magic settlements genuinely HOLD practitioners or circles on their real rosters', () => {
    // The EXISTENTIAL half: the band is not merely permitted, the generator realizes
    // it. Measured over the bottom economy quartile of the high-magic corpus, which
    // is the population "poor" names and is far better peopled than the subsistence
    // regime alone (town and above never reach subsistence at genesis at all).
    const sorted = [...highMagic].sort((a, b) => a.economy01 - b.economy01);
    const quartile = sorted.slice(0, Math.ceil(sorted.length / 4));
    const holding = quartile.filter(
      (row) => row.forms.includes('circle') || row.forms.includes('practitioner'),
    );
    expect(
      holding.length,
      'the poorest high-magic settlements must be able to hold a practitioner or a circle; '
      + `measured ${quartile.length} in the bottom quartile (economy <= `
      + `${quartile[quartile.length - 1].economy01.toFixed(3)}), ${holding.length} holding`,
    ).toBeGreaterThan(0);
  });

  it('a THORP holds no magic INSTITUTION at any magic level, which is why the rung is a person', () => {
    // The catalog authors no Magic category at thorp at all. This is the empirical
    // fact that makes §3b's tied-character rung load-bearing rather than decorative:
    // without it the design's own thorp sentence could never be satisfied by any
    // generated world, at any magic level, ever.
    const thorps = corpus.filter((row) => row.tier === 'thorp');
    expect(thorps.length).toBeGreaterThan(0);
    expect(thorps.filter((row) => row.forms.length > 0)).toEqual([]);
    // ...and yet the band still says a practitioner belongs there, which is exactly
    // the gap the tied character fills.
    expect(thorps.every((row) => row.band.top === 'practitioner' || row.band.top === null)).toBe(true);
    // ANCHOR: the same corpus at village and above does hold forms.
    expect(corpus.filter((row) => row.tier !== 'thorp' && row.forms.length > 0).length).toBeGreaterThan(0);
  });

  it('every form the corpus produces is a member of the closed ladder', () => {
    const seen = new Set(corpus.flatMap((row) => row.forms));
    for (const form of seen) expect(MAGIC_FORMS).toContain(form);
    expect(seen.size, 'the corpus must exercise more than one rung to be worth measuring').toBeGreaterThan(1);
  });

  it('the INDUSTRIAL regime is not reachable at genesis, which is recorded rather than assumed', () => {
    // MEASURED: across this corpus the economy composite never exceeds the patronized
    // band. The industrial rung is therefore something a world GROWS INTO through
    // simulation, never something it is born with, and §9's rarity law is satisfied by
    // construction rather than by tuning. Stated as a pin so that if a future economy
    // change makes industrial settlements pop out of the generator, someone is told.
    expect(corpus.filter((row) => row.regime === 'industrial')).toEqual([]);
    // ANCHOR: the corpus does reach more than one regime, so the empty is a ceiling
    // rather than a broken reading.
    expect(new Set(corpus.map((row) => row.regime)).size).toBeGreaterThan(1);
  });
});

describe('ranking helpers', () => {
  it('formRank answers -1 for a non-form, unlike regimeRank which folds to the floor', () => {
    expect(formRank('foundry')).toBe(4);
    // A form is a CLASSIFICATION, so "could not classify" must not read as "hedge
    // wizard". The asymmetry with regimeRank is deliberate and pinned.
    expect(formRank('workshop')).toBe(-1);
  });
});
