/**
 * traditionNeedsHeld.test.js — RULING 122-T: A TOWN IS DEALT ONLY RITES IT CAN HOLD.
 *
 * `traditions/genesis.js :: deriveFoundingTraditions` runs on the finished record, so every need a motif declares
 * (`shownTraditions.js :: motifNeeds`: its element's corpus `needs`, and its act's: a fair presumes the market) is
 * answerable at the draw. A record stamped 0.10.0 or later draws only motifs whose every need the place holds
 * (`atomHolds(...) === true`, the tab's own rule), so the tab drops nothing it drew. A record an earlier engine bore
 * (0.9.0, or no stamp) keeps its old draw, and the tab's view-time drop stands for it.
 *
 * Births through the pipeline: 60 seeds of the page battery's C corpus (`birthConfig({ settType })`), ten per size,
 * 36 of which drop a row on the base (four of them showing no tradition at all; two losing "The Founding Fair").
 *
 * RED FIRST (04fe78096): (i), (ii) and (iv) fail on the base; (iii) holds on it (the old draw, kept by name).
 * MUTANTS: (i) and (ii) red with the retry loop removed (genesis takes the first draw again); (iii) red with the floor
 * removed (`askNeeds` true for every record); (iv) red with the act's need removed (the corpus `fair` without `needs`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { motifNeeds, shownTraditionsOf } from '../../src/domain/traditions/shownTraditions.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { traditionFloorOf } from '../../src/domain/traditions/traditionFloor.js';
import { TRADITION_ELEMENTS, TRADITION_ACTS } from '../../src/data/traditionCorpus.js';
import { applyVeil, CARD_KINDS, curateModelFor, resolveVeil } from '../../src/domain/display/galleryVeil.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** The seeds that drop at least one drawn row on the base (B-count's keys). */
const DROPPERS = [
  'dp-thorp-1', 'dp-thorp-7', 'dp-thorp-8', 'dp-thorp-10', 'dp-thorp-13', 'dp-thorp-15',
  'dp-hamlet-0', 'dp-hamlet-6', 'dp-hamlet-7', 'dp-hamlet-9', 'dp-hamlet-12', 'dp-hamlet-14',
  'dp-village-1', 'dp-village-2', 'dp-village-4', 'dp-village-5', 'dp-village-9', 'dp-village-14',
  'dp-town-1', 'dp-town-8', 'dp-town-11', 'dp-town-23', 'dp-town-24', 'dp-town-27',
  'dp-city-0', 'dp-city-5', 'dp-city-24', 'dp-city-27', 'dp-city-30', 'dp-city-48',
  'dp-metropolis-32', 'dp-metropolis-58', 'dp-metropolis-83', 'dp-metropolis-105', 'dp-metropolis-113', 'dp-metropolis-121',
];
/** Seeds that drop nothing on the base: they must still draw. */
const KEEPERS = [
  'dp-thorp-0', 'dp-thorp-2', 'dp-thorp-3', 'dp-thorp-4', 'dp-hamlet-1', 'dp-hamlet-2', 'dp-hamlet-3', 'dp-hamlet-4',
  'dp-village-0', 'dp-village-3', 'dp-village-6', 'dp-village-7', 'dp-town-0', 'dp-town-2', 'dp-town-3', 'dp-town-4',
  'dp-city-1', 'dp-city-2', 'dp-city-3', 'dp-city-4', 'dp-metropolis-0', 'dp-metropolis-1', 'dp-metropolis-2', 'dp-metropolis-3',
];
/** The droppers whose 0.9.0 draw drops too: all but dp-city-48, whose dropped row is the field rule's (0.10.0) reroll. */
const OLD_DROPPERS = DROPPERS.filter((s) => s !== 'dp-city-48');
/** The two births whose founding row is "The Founding Fair" in a place with no market, on the base. */
const FOUNDING_FAIRS = ['dp-thorp-1', 'dp-village-1'];

/** @type {Map<string, any>} */
const born = new Map();
/** @param {any} town @param {string|null} stamp */
const stamped = (town, stamp) => {
  const t = { ...town };
  if (stamp === null) delete t.generatorVersion; else t.generatorVersion = stamp;
  return t;
};
/** @param {any} town @returns {any[]} the drawn rows whose motif declares a need the place does not hold */
const unheld = (town) => {
  const facts = /** @type {any} */ (factsOf(town));
  return deriveFoundingTraditions(town).filter((r) => motifNeeds(r).some((a) => atomHolds(a, facts) !== true));
};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...DROPPERS, ...KEEPERS]) {
    const settType = seed.split('-')[1];
    born.set(seed, generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} }));
  }
}, 240000);

describe('RULING 122-T: a 0.10.0 birth draws only what the place holds', () => {
  test('the premise: 60 births, every size, 36 of them dropping a row on the old draw', () => {
    expect(born.size).toBe(60);
    for (const s of SIZES) expect(DROPPERS.filter((x) => x.includes(`-${s}-`)).length, s).toBeGreaterThan(0);
    expect(OLD_DROPPERS.length, 'at least five towns drop a row on the old draw').toBeGreaterThanOrEqual(5);
  });

  test('(i) at 0.10.0 every drawn rite is one the place holds, so the shown set is the drawn set', () => {
    const failures = collectSeedFailures([...born.keys()], (seed) => {
      const town = born.get(seed);
      const t = stamped(town, '0.10.0');
      expect(unheld(t).map((r) => `${r.name} [${motifNeeds(r).join(', ')}]`), seed).toEqual([]);
      expect(shownTraditionsOf(t, []).recs.map((r) => r.id), seed).toEqual(deriveFoundingTraditions(t).map((r) => r.id));
    });
    expectNoSeedFailures(failures, 'a 0.10.0 birth drew a rite the place does not hold, or showed other than it drew');
  });

  test('(ii) at 0.10.0 no town of the list shows no tradition', () => {
    const failures = collectSeedFailures([...born.keys()], (seed) => {
      const town = born.get(seed);
      expect(shownTraditionsOf(stamped(town, '0.10.0'), []).recs.length, seed).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'a 0.10.0 town showed no tradition');
  });

  test('(iii) re-stamped 0.9.0, or with no stamp, the old draw stands: it still holds a rite the place lacks', () => {
    const failures = collectSeedFailures(OLD_DROPPERS, (seed) => {
      for (const stamp of ['0.9.0', null]) {
        const t = stamped(born.get(seed), stamp);
        expect(unheld(t).length, `${seed} at ${stamp ?? 'no stamp'}`).toBeGreaterThan(0);
        expect(shownTraditionsOf(t, []).recs.length, `${seed}: the tab's drop stands`).toBeLessThan(deriveFoundingTraditions(t).length);
      }
      expect(JSON.stringify(deriveFoundingTraditions(stamped(born.get(seed), null))), seed)
        .toBe(JSON.stringify(deriveFoundingTraditions(stamped(born.get(seed), '0.9.0'))));
    });
    expectNoSeedFailures(failures, 'an old-stamped dropper lost its old draw or the tab\'s drop');
  });

  test('(iv) the founding rite: no fair in a place with no market at 0.10.0', () => {
    const premiseFailures = collectSeedFailures(FOUNDING_FAIRS, (seed) => {
      const town = born.get(seed);
      expect(factsOf(town).market, `${seed}: the premise, no market`).toBe(false);
      expect(deriveFoundingTraditions(stamped(town, '0.9.0'))[0].name, `${seed}: the old founding row`).toBe('The Founding Fair');
    });
    expectNoSeedFailures(premiseFailures, 'a founding-fair premise seed has a market or another old founding row');
    const failures = collectSeedFailures([...born.keys()], (seed) => {
      const town = born.get(seed);
      if (factsOf(town).market === true) return;
      const fairs = deriveFoundingTraditions(stamped(town, '0.10.0')).filter((r) => r.coreMotif.act === 'fair').map((r) => r.name);
      expect(fairs, seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'a 0.10.0 town with no market drew a fair');
  });
});

/*
 * RULING 122-T-2: THE FLOOR IS A FLOOR. The draw asks its needs of `traditionFloorOf` (traditionFloor.js); no veil state of
 * the record may move an answer there. On the sixty births: every address the curate model offers (on the record and on
 * its public projection: groupings, switches, whole-house cards, card eyes), every institution eye and class switch, and
 * every house hidden whole in turn, each alone, then all at once: every atom the corpus declares answers as unveiled.
 * No cap: every address of every town is walked.
 */
describe('RULING 122-T-2: the floor the draw asks is the same under every veil', () => {
  const ATOMS = [...new Set([...TRADITION_ELEMENTS, ...TRADITION_ACTS].flatMap((x) => /** @type {any} */ (x).needs || []))].sort();
  /** @param {any} rec */
  const answers = (rec) => {
    const facts = /** @type {any} */ (factsOf(traditionFloorOf(rec)));
    return Object.fromEntries(ATOMS.map((a) => [a, atomHolds(a, facts) ?? null]));
  };
  /** @param {any} rec @returns {string[]} */
  const addressesOf = (rec) => {
    const model = (/** @type {any} */ doc) => curateModelFor(doc, []).sections.flatMap((/** @type {any} */ sec) => [
      ...sec.groupings.map((/** @type {any} */ g) => g.address), ...sec.switches.map((/** @type {any} */ w) => w.address),
      ...sec.cards.flatMap((/** @type {any} */ c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((/** @type {any} */ e) => e.address)]),
    ]);
    const eyes = Object.keys(CARD_KINDS.institution.fields);
    const houses = (rec.institutions || []).flatMap((/** @type {any} */ i) => {
      const id = CARD_KINDS.institution.idOf(i);
      return [`card:institution:${id}`, ...eyes.map((f) => `field:institution:${id}:${f}`)];
    });
    return [...new Set([...model(rec), ...model(toPublicSafe(rec)), ...houses, ...eyes.map((f) => `class:institution:${f}`)])];
  };

  test('every declared atom answers at the floor as unveiled, each address alone and all at once', () => {
    expect(ATOMS, 'the atoms the corpus declares').toEqual(expect.arrayContaining(['market', 'institution: smith', 'navigable', 'river', 'coast']));
    let runs = 0; let houseHides = 0;
    const failures = collectSeedFailures([...born.keys()], (seed) => {
      const town = born.get(seed);
      const base = answers(town);
      const all = addressesOf(town);
      for (const a of all) {
        runs += 1;
        if (a.startsWith('card:institution:')) houseHides += 1;
        expect(answers(applyVeil(town, new Set([a]))), `${seed}: ${a}`).toEqual(base);
      }
      expect(answers(applyVeil(town, resolveVeil(null, all.map((address) => ({ address, hidden: true }))))), `${seed}: all at once`).toEqual(base);
    });
    expectNoSeedFailures(failures, 'a veil moved an atom\'s answer at the floor');
    expect(houseHides, 'anchored: every house of every town was hidden in turn').toBeGreaterThan(born.size);
    expect(runs).toBeGreaterThan(houseHides);
  }, 600000);
});
