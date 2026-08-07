/**
 * espionageDoctrineStage.test.js — ES-5: the doctrine stage and the autonomous cadence.
 *
 * EVERY DOCTRINE BELOW IS COMPOSED FROM A REALLY-DERIVED ALIGNMENT. Nothing here hands
 * `readEspionageDoctrine` a word: the words come out of `settlementAlignment` over a
 * settlement shaped the way `governingFactionOf` actually reads one (`powerStructure.
 * factions[].isGoverning`), which is the difference between proving the STAGE and proving
 * the leaf ES-0 already pinned. A fixture that mirrored the deriver would have re-tested the
 * table and left the gathering — the half this wave built — completely uncovered.
 *
 * ⭐ THE J-ES-10 DIFFERENTIAL IS THE FILE'S SHARPEST PIN, and it is executed rather than
 * argued. The doctrine bands the LAW axis at its own vetoable pair (0.60/0.40) instead of
 * the estate pair (0.67/0.33), and the tuning's comment says why: the seat-archetype term
 * alone tops out near 0.63 and bottoms near 0.35, so an estate-banded doctrine would read
 * `balanced` for the most lawful court in the world AND for a criminal syndicate in the
 * seat. Both of those settlements are built below and BOTH pairs are run on them, so the
 * local pair is proven to be doing work rather than described as doing it.
 *
 * ── THE EXECUTED MUTANT RECORD (ES-5a build, cp backup + cmp restore each) ───────────────
 *   M5 — the doctrine-local edge pair dropped, so `lawWordFor` falls back to the ESTATE
 *        pair (0.67/0.33) → 2 failed / 9. That is the J-ES-10 differential doing its job:
 *        with the estate pair both courts read `balanced` and the doctrine goes inert.
 *   M6 — the already-dispatched door deleted → 1 failed / 10. Without it a patient court
 *        sends a fresh operative every tick for the whole of its own patience window.
 * Both plants restored byte-identically (cmp) in the same shell. See the sibling record in
 * espionageWariness.test.js for why the plants are run by hand rather than by the sweep.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  DISPATCH_DEMANDS,
  DISPATCH_TUNING,
  dispatchCadenceFor,
  dispatchCadenceKey,
  dispatchDemandFor,
  espionageDoctrineFor,
} from '../../src/domain/worldPulse/espionage/espionageDoctrineStage.js';
import {
  DOCTRINE_EMPLOYMENTS,
  DOCTRINE_METHODS,
  DOCTRINE_TARGETINGS,
  ESPIONAGE_DOCTRINE_TUNING,
  lawWordFor,
} from '../../src/domain/worldPulse/espionage/espionageDoctrine.js';
import { LAW_WORD_EDGES } from '../../src/domain/worldPulse/lawWord.js';
import { natureWordFor } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { settlementAlignment } from '../../src/domain/worldPulse/settlementAlignment.js';
import { hash01 } from '../../src/domain/region/contestMath.js';
import { litCovertWorld } from '../helpers/covertMissionFixture.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The leaf's own four-decimal rounding, so a derived expectation compares a VALUE rather
 *  than a float representation. @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** A settlement whose governing seat is read the way `governingFactionOf` reads one.
 *  @param {string} id @param {string} category @param {Record<string, unknown>} [extra] */
function seatedTown(id, category, extra = {}) {
  return {
    id,
    settlement: {
      powerStructure: { factions: [{ faction: 'The Seat', category, isGoverning: true }] },
      ...extra,
    },
  };
}

/** THE MOST LAWFUL SEAT FORM IN THE ESTATE, with a benevolent bench under it. */
const SAINTLY_COURT = seatedTown('ashford', 'civic', {
  npcs: [
    { name: 'Mara', personality: ['compassionate', 'honest', 'selfless'], importance: 'pillar' },
    { name: 'Bren', personality: ['kind', 'merciful', 'generous'], importance: 'pillar' },
  ],
});

/** A CRIMINAL SYNDICATE IN THE SEAT — the other end of the same axis. */
const SYNDICATE_COURT = seatedTown('irontown', 'criminal');

/** The acts world that pushes the syndicate's malice past the estate's own moral edge. */
const ACTS_WORLD = Object.freeze({
  warExhaustion: { irontown: 1 },
  occupations: [
    { holderId: 'irontown', settlementId: 'y' },
    { holderId: 'irontown', settlementId: 'z' },
  ],
});

/** @param {Record<string, unknown>} [rules] */
function lit(rules = {}) {
  return { ...litCovertWorld(rules), ...ACTS_WORLD };
}

describe('ES-5 — the stage gathers the words the leaf refuses to fetch', () => {
  test('DARK is null; LIT-but-unreadable is a doctrine that says so', () => {
    // The two nulls are different answers (see the module header). Dark returns NOTHING —
    // no object, no receipt, no read of an alignment.
    expect(espionageDoctrineFor({ worldState: lit({ espionageEnabled: false }), item: SAINTLY_COURT }))
      .toBeNull();
    expect(espionageDoctrineFor({ worldState: lit({ errandSpineEnabled: false }), item: SAINTLY_COURT }))
      .toBeNull();
    expect(espionageDoctrineFor({ worldState: {}, item: SAINTLY_COURT })).toBeNull();
    // LIT and unresolvable: the leaf's own resolution gate fires and NAMES the reason. The
    // anchor that keeps this from being a null-vs-null pin is the reading right below it.
    const unnamed = espionageDoctrineFor({ worldState: lit(), item: { settlement: {} } });
    expect(unnamed).not.toBeNull();
    expect(unnamed.known).toBe(false);
    expect(unnamed.receipt).toContain('no court was named');
    expect(espionageDoctrineFor({ worldState: lit(), item: SAINTLY_COURT }).known).toBe(true);
  });

  test('the whole doctrine is composed from the settlement, in one call', () => {
    const doctrine = espionageDoctrineFor({ worldState: lit(), item: SYNDICATE_COURT });
    // The syndicate: watches everyone, travels hidden, spends its people cheaply, sends
    // constantly. Every field is a closed-set member and the sets are the leaf's own.
    expect(DOCTRINE_TARGETINGS).toContain(doctrine.targeting);
    expect(DOCTRINE_METHODS).toContain(doctrine.method);
    expect(DOCTRINE_EMPLOYMENTS).toContain(doctrine.employment);
    expect(doctrine).toMatchObject({
      known: true, targeting: 'all_courts', method: 'lawless', employment: 'lenient',
    });
    // DERIVED, not restated: the cadence is the tuning's own composition for this court's
    // two words, so a retune moves the expectation with the code.
    const T = ESPIONAGE_DOCTRINE_TUNING;
    // ROUNDED THE LEAF'S OWN WAY. The composition is float arithmetic and the leaf answers
    // through `round4`; comparing the raw sum would pin a representation, not a value.
    expect(doctrine.frequency01)
      .toBe(round4(T.FREQ_BASE + T.FREQ_BY_ORDER.lawless + T.FREQ_BY_NATURE.malicious));

    // …and the saintly court is its opposite on every field, which is what proves the
    // composition reads the SETTLEMENT rather than answering one way for everybody.
    const saint = espionageDoctrineFor({ worldState: lit(), item: SAINTLY_COURT });
    expect(saint).toMatchObject({
      known: true, targeting: 'foes_only', method: 'lawful', employment: 'strict',
    });
    expect(saint.frequency01)
      .toBe(round4(T.FREQ_BASE + T.FREQ_BY_ORDER.lawful + T.FREQ_BY_NATURE.benevolent));
    expect(saint.frequency01).toBeLessThan(doctrine.frequency01);
  });

  test('J-ES-10 EXECUTED: the local edges band two real courts the estate pair cannot', () => {
    const doctrineEdges = ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES;
    // The pairs really are different, and the estate's is untouched by this program.
    expect(LAW_WORD_EDGES).toEqual({ lawful: 0.67, lawless: 0.33 });
    expect(doctrineEdges).toEqual({ lawful: 0.60, lawless: 0.40 });
    for (const [item, doctrineWord] of [[SAINTLY_COURT, 'lawful'], [SYNDICATE_COURT, 'lawless']]) {
      const axis = settlementAlignment(item, lit()).lawfulness01;
      // THE DIFFERENTIAL. Same axis reading, two pairs, two different words — measured on a
      // settlement the generator can really produce, not on a hand-picked number.
      expect(lawWordFor(axis, doctrineEdges), `${item.id} under the doctrine pair`).toBe(doctrineWord);
      expect(lawWordFor(axis), `${item.id} under the estate pair`).toBe('balanced');
      // And the STAGE is on the doctrine side of that difference: an estate-banded stage
      // would give both courts the balanced court's method and cadence.
      const read = espionageDoctrineFor({ worldState: lit(), item });
      expect(read.method).toBe(doctrineWord === 'lawful' ? 'lawful' : 'lawless');
      expect(read.frequency01)
        .not.toBe(ESPIONAGE_DOCTRINE_TUNING.FREQ_BASE + ESPIONAGE_DOCTRINE_TUNING.FREQ_BY_NATURE[
          natureWordFor(settlementAlignment(item, lit()).malice01)]);
    }
  });
});

describe('ES-5 — the demand ladder, over every cadence the doctrine can produce', () => {
  /** The nine reachable frequencies, DERIVED from the tuning rather than transcribed. */
  const REACHABLE = Object.values(ESPIONAGE_DOCTRINE_TUNING.FREQ_BY_ORDER)
    .flatMap((o) => Object.values(ESPIONAGE_DOCTRINE_TUNING.FREQ_BY_NATURE)
      .map((n) => round4(ESPIONAGE_DOCTRINE_TUNING.FREQ_BASE + o + n)))
    .sort((a, b) => a - b);

  test('all three bars are REACHABLE from a real doctrine — none is a dead band', () => {
    expect(REACHABLE).toHaveLength(9);
    const bars = new Set(REACHABLE.map((frequency01) => dispatchDemandFor({ frequency01 })));
    expect([...bars].sort()).toEqual([...DISPATCH_DEMANDS].sort());
    // The ladder is MONOTONE: a court that sends more often never demands more proof.
    const rank = { certain: 2, confirm: 1, corroborate: 0 };
    const ranks = REACHABLE.map((frequency01) => rank[dispatchDemandFor({ frequency01 })]);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
  });

  test('urgency lowers the bar and is tested FIRST', () => {
    const patient = ESPIONAGE_DOCTRINE_TUNING.FREQ_BASE
      + ESPIONAGE_DOCTRINE_TUNING.FREQ_BY_ORDER.lawful
      + ESPIONAGE_DOCTRINE_TUNING.FREQ_BY_NATURE.benevolent;
    expect(dispatchDemandFor({ frequency01: patient })).toBe('certain');
    // …and the SAME court with an army at its gate settles for far less.
    expect(dispatchDemandFor({ frequency01: patient, urgent: true })).toBe('corroborate');
    // The edges are inclusive on the patient side and on the hasty side alike.
    expect(dispatchDemandFor({ frequency01: DISPATCH_TUNING.DEMAND_PATIENT_MAX })).toBe('certain');
    expect(dispatchDemandFor({ frequency01: DISPATCH_TUNING.DEMAND_HASTY_MIN })).toBe('corroborate');
    // Garbage reads as the middle bar rather than as a fourth word.
    expect(dispatchDemandFor()).toBe('confirm');
    expect(dispatchDemandFor({ frequency01: 'soon' })).toBe('confirm');
  });
});

describe('ES-5 — the cadence: five doors, each dropped on its own', () => {
  const BASE = Object.freeze({
    item: SYNDICATE_COURT, courtId: 'irontown', castable: true, decidingConfidence01: 0.1,
  });
  /** @param {Record<string, unknown>} patch @param {Record<string, unknown>} [rules] */
  const run = (patch = {}, rules = {}) => dispatchCadenceFor({
    worldState: lit(rules), ...BASE, tick: 5, ...patch,
  });

  test('DOOR 1 — dark sends nobody and composes nothing', () => {
    const dark = run({}, { espionageEnabled: false });
    expect(dark).toMatchObject({ dispatch: false, reason: 'dark', doctrine: null, demand: '' });
    expect(dark.receipt).toBe('');
  });

  test('DOOR 2 — an unreadable court sends nobody, in the leaf’s own words', () => {
    const blank = run({ item: { settlement: {} }, courtId: '' });
    expect(blank).toMatchObject({ dispatch: false, reason: 'no_doctrine' });
    expect(blank.receipt).toContain('No espionage doctrine can be read');
  });

  test('DOOR 3 — a court already waiting on a spy does not send a second', () => {
    const running = run({ dispatched: true, ticksSinceDispatch: 1 });
    expect(running).toMatchObject({
      dispatch: false, reason: 'already_dispatched', verdict: 'dispatch_and_wait',
    });
    // THE ANCHOR: the identical call without the mark DOES send, so the refusal above is
    // this door and not some other condition of the same fixture.
    expect(run().dispatch).toBe(true);
  });

  test('DOOR 4 — the deliberation verdict, both non-dispatching arms', () => {
    // Urgency forces a decision now: nobody waits on a spy with an army outside.
    expect(run({ urgent: true })).toMatchObject({ dispatch: false, reason: 'act_now', verdict: 'act_now' });
    // A court with nobody to send does not send.
    expect(run({ castable: false })).toMatchObject({ dispatch: false, reason: 'act_now' });
    // A picture that is already good enough needs no spy.
    expect(run({ decidingConfidence01: 0.95 })).toMatchObject({ dispatch: false, reason: 'act_now' });
  });

  test('DOOR 5 — the keyed draw, both sides, against the court’s own cadence', () => {
    const sends = run();
    expect(sends).toMatchObject({ dispatch: true, reason: 'dispatched', verdict: 'dispatch_and_wait' });
    expect(sends.key).toBe(dispatchCadenceKey('irontown', 5));
    expect(sends.roll01).toBe(hash01(sends.key));
    expect(sends.roll01).toBeLessThan(sends.doctrine.frequency01);
    // A DIFFERENT TICK on the same court draws higher than even this prolific doctrine.
    const quiet = run({ tick: 0 });
    expect(quiet.roll01).toBeGreaterThan(quiet.doctrine.frequency01);
    expect(quiet).toMatchObject({ dispatch: false, reason: 'cadence_declined', demand: '' });
    // …and the SAME tick on the saintly court declines where the syndicate went, which is
    // the doctrine and not the draw: identical roll, different bar.
    const saint = dispatchCadenceFor({ worldState: lit(), item: SAINTLY_COURT, courtId: 'irontown', castable: true, decidingConfidence01: 0.1, tick: 5 });
    expect(saint.roll01).toBe(sends.roll01);
    expect(saint.dispatch).toBe(false);
  });

  test('the dispatch is DETERMINISTIC and the receipt speaks words, never numbers', () => {
    const first = run();
    const second = run();
    expect(second).toEqual(first);
    expect(first.demand).toBe(dispatchDemandFor({ frequency01: first.doctrine.frequency01 }));
    // L5 — THE RUNTIME NO-DECIMAL PIN, on the COMPOSED output rather than on the leaf's
    // half. A control scalar that reached prose would show up here as a digit.
    expect(first.receipt).toContain('sends a watcher');
    // anchored: the live phrase one line up is in the SAME string, so an emptied receipt reds there first.
    expect(first.receipt).not.toMatch(/\d/);
    const declined = run({ tick: 0 });
    expect(declined.receipt).toContain('sends nobody');
    // anchored: the declining arm's own live phrase one line up anchors this second absence.
    expect(declined.receipt).not.toMatch(/\d/);
    // anchored: the roll and the cadence weight are the two control scalars this receipt is
    // composed beside, and `frequency01` travels on the returned doctrine — so its presence
    // there proves the receipt had access to the number it declines to speak.
    expect(first.doctrine.frequency01).toBeGreaterThan(0);
    expectAbsentWithAnchor(
      Object.keys(first),
      'frequency01',
      'roll01',
      'the cadence result surface',
    );
  });
});

describe('ES-5 — the cadence is a DECLARED dark instrument, and the declaration is scanned', () => {
  test('no production module imports the doctrine stage, and the scan reds on a plant', () => {
    // THE HEADER MAKES A CLAIM AND THIS IS ITS PIN — a comment is not a pin, and the wave
    // that shipped this leaf could have wired it and deliberately did not (R-ES1-1: the
    // errand ledger's ONE writer still refuses without the six war flags and a peace offer,
    // so a free-standing spy row does not exist to be minted). The day a caller appears,
    // this reds and the header's residual block must be revisited rather than quietly
    // outliving its fact — the same treatment ES-3 gave `insideAssetAt`'s producer census.
    const walk = (dir, out = []) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.jsx?$/.test(p)) out.push(p);
      }
      return out;
    };
    const importers = walk(join(ROOT, 'src'))
      .filter((p) => /espionageDoctrineStage\.js['"]/.test(readFileSync(p, 'utf8')))
      .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
      .sort();
    expect(importers).toEqual([]);
    // POSITIVE CONTROL: the detector really detects, proven by a planted source rather than
    // assumed. Without it the emptiness above could be a regex that stopped matching.
    const planted = "import { dispatchCadenceFor } from './espionage/espionageDoctrineStage.js';";
    expect(/espionageDoctrineStage\.js['"]/.test(planted)).toBe(true);
    // …and the corpus is real: the scan walked a tree that still contains the leaf itself.
    expect(walk(join(ROOT, 'src')).length).toBeGreaterThan(500);
  });
});
