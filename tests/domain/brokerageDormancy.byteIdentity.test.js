/**
 * brokerageDormancy.byteIdentity.test.js — [W-I INFORMATION BROKERAGES] I2, the dormancy
 * contract at the surface it actually reaches (docs/DESIGN_INFORMATION_BROKERAGES.md Law 5,
 * §9).
 *
 * THE GOLDEN LAW for this slice: nothing moves while the virtual flag is dark, and even
 * with the flag lit nothing moves outside a settlement where a house stands. Both halves
 * are asserted through the REAL Herald read model (buildRealmItemReadModel), because the
 * epistemic block is where the stamp lands and a leaf-level assertion would not prove the
 * seam is wired the way the leaf expects.
 *
 * The three states this file separates, which is the whole point:
 *   DARK          the flag absent, houses standing        no key
 *   LIT, NO HOUSE the flag lit, an ordinary roster        no key
 *   LIT, HOUSE    the flag lit, a house on the roster     the key
 *
 * The first two must be BYTE-IDENTICAL to each other and to the model this slice inherited,
 * which is asserted as a whole-model JSON comparison rather than a spot check on one field.
 */
import { describe, expect, it } from 'vitest';

import { buildRealmItemReadModel } from '../../src/domain/realm/realmItemReadModel.js';
import { RELIABILITY_LADDER } from '../../src/domain/worldPulse/brokerageStamps.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange", tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const SMITH = Object.freeze({ name: 'Blacksmith', tags: ['crafts'] });

const NEWS_ENTRY = Object.freeze({
  id: 'wizard_news.9.applied.evt1',
  tick: 9,
  significance: 'major',
  impactKind: 'import_shortage',
  headline: 'The grain did not come',
  summary: 'A shortage is recorded on the road.',
  settlementIds: ['a'],
  sourceEventId: 'evt1',
  severity: 0.6,
});

const RUMOR_LEDGERS = Object.freeze({
  a: {
    'trade:evt1': {
      eventRef: 'evt1', arrivalTick: 9, hopCount: 0, corroborationRoots: ['t0:evt1@a'],
      completeness01: 1, accuracy01: 1, score: 80,
      provenance: { originId: 'a', relayIds: [] },
      content: { what: 'import_shortage', whereId: 'a', scope: 'regional', magnitude: 2, partyIds: ['a'] },
    },
  },
});

/** A campaign whose one news item addresses settlement `a`. */
function campaignFor(rules) {
  return {
    id: 'camp-1',
    wizardNews: { entries: [{ ...NEWS_ENTRY }] },
    worldState: {
      tick: 9,
      spatialCanonVersion: 1,
      simulationRules: { ...rules },
      spatialLedgers: { rumorLedgers: RUMOR_LEDGERS },
    },
  };
}

const savesWith = (institutions) => [{ id: 'a', settlement: { id: 'a', name: 'Ashford', institutions } }];

const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });
const LIT_RULES = Object.freeze({ ...DARK_RULES, informationBrokeragesEnabled: true });

const modelFor = (rules, institutions) => buildRealmItemReadModel(
  campaignFor(rules), { saves: savesWith(institutions), canUseCustom: true },
);

/** The epistemic blocks of every item in a model, in model order. */
const epistemicsOf = (model) => model.items.map((item) => item.epistemic);

describe('[W-I I2] the stamp is absent while the flag is dark', () => {
  it('a dark model carries the epistemic class and no reliability key, houses or not', () => {
    const failures = collectSeedFailures([[EXCHANGE], [SMITH], []], (institutions) => {
      const model = modelFor(DARK_RULES, institutions);
      expect(model.items.length, 'the fixture produced no items to inspect').toBeGreaterThan(0);
      for (const epistemic of epistemicsOf(model)) {
        // Anchored by the sibling key that must ALWAYS be present: a block that lost its
        // class would otherwise pass "no reliability" for the wrong reason.
        expectAbsentWithAnchor(Object.keys(epistemic), 'reliability', 'class', 'dark flag');
      }
    });
    expectNoSeedFailures(failures, 'no roster stamps anything while the flag is dark');
  });

  it('a dark model and a lit model with no house are byte-identical, whole model', () => {
    const dark = modelFor(DARK_RULES, [SMITH]);
    const litNoHouse = modelFor(LIT_RULES, [SMITH]);
    expect(JSON.stringify(litNoHouse)).toBe(JSON.stringify(dark));
  });

  it('lighting the flag alone changes nothing even where a house stands, until it is lit', () => {
    // The conjunction gate: the brokerage key WITHOUT the statecraft key is still dark.
    const halfLit = modelFor({ infoMode: 'unreliable', informationBrokeragesEnabled: true }, [EXCHANGE]);
    const dark = modelFor(DARK_RULES, [EXCHANGE]);
    expect(JSON.stringify(halfLit)).toBe(JSON.stringify(dark));
  });
});

describe('[W-I I2] stamps appear only where a house stands', () => {
  it('a lit brokerage settlement stamps its own news, and a matched one does not', () => {
    const withHouse = modelFor(LIT_RULES, [EXCHANGE]);
    const withoutHouse = modelFor(LIT_RULES, [SMITH]);
    const stamped = epistemicsOf(withHouse).filter((e) => e.reliability);
    expect(stamped.length, 'the positive control never stamped').toBeGreaterThan(0);
    expect(RELIABILITY_LADDER).toContain(stamped[0].reliability.grade);
    expect(stamped[0].reliability.graderId).toBe('a');
    expect(stamped[0].class, 'the stamp replaced the epistemic class').toBeTruthy();
    for (const epistemic of epistemicsOf(withoutHouse)) {
      expectAbsentWithAnchor(Object.keys(epistemic), 'reliability', 'class', 'no house on the roster');
    }
  });

  it('the stamp is a DERIVED read-model key and never a persisted one', () => {
    // The read model must not write the stamp back onto the campaign it read. If it did,
    // the key would ride save serialisation and every dormancy claim above would be a
    // statement about one run rather than about the data.
    const campaign = campaignFor(LIT_RULES);
    const before = JSON.stringify(campaign);
    const model = buildRealmItemReadModel(campaign, { saves: savesWith([EXCHANGE]), canUseCustom: true });
    expect(epistemicsOf(model).some((e) => e.reliability), 'the fixture must stamp for this to prove anything').toBe(true);
    expect(JSON.stringify(campaign)).toBe(before);
    // And the model itself round-trips, so a stamped item is plain serialisable data.
    expect(JSON.parse(JSON.stringify(model)).items.length).toBe(model.items.length);
  });

  it('a settlement that hosts a house but never heard the news is not stamped', () => {
    const campaign = campaignFor(LIT_RULES);
    campaign.worldState.spatialLedgers.rumorLedgers = { a: {} };
    const model = buildRealmItemReadModel(campaign, { saves: savesWith([EXCHANGE]), canUseCustom: true });
    for (const epistemic of epistemicsOf(model)) {
      expectAbsentWithAnchor(Object.keys(epistemic), 'reliability', 'class', 'the house never heard it');
    }
  });
});
