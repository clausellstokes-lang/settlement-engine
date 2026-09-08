/**
 * espionageDoctrine.test.js — ES-0's doctrine leaf, and the estate's newly single
 * law-band spelling.
 *
 * THE HARDEST CLAIM IN THIS FILE IS THE REACHABILITY ONE, and it is deliberately made
 * against REALLY GENERATED settlements rather than against hand-fed numbers (census 4
 * §5.9 refuses hand-fed numbers by name, and the recorded "fixture mirrors the deriver"
 * class is exactly what a hand-fed band battery walks into: a threshold pair can look
 * perfectly two-tailed on invented inputs and be single-tailed on every world the
 * generator can actually produce). So the corpus below drives
 * `generateSettlementPipeline` across six tiers x six trade-route classes x five
 * cultures, then crosses each settlement with a real patron deity on both law axes and
 * with a real occupation ledger, and every threshold claim is measured on the
 * `computeLawfulness` output of THAT.
 *
 * WHY THE DEITY AND OCCUPATION CROSSES ARE NOT DECORATION: measured at ES-0, a
 * deity-free, unoccupied corpus spans only [0.4551, 0.6878] and reaches NEITHER tail at
 * either threshold pair. A battery built on that corpus alone would have "proved" that
 * `lawless` is a dead rung and invited the edges to be lowered until the test went
 * green — the tuning table lying to the owner about what the world can produce. The
 * lever that opens the tails is real world state (a patron's law axis, an occupier), so
 * the corpus carries it.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  DOCTRINE_EMPLOYMENTS,
  DOCTRINE_METHODS,
  DOCTRINE_TARGETINGS,
  ESPIONAGE_DOCTRINE_TUNING,
  LAW_WORDS,
  lawWordFor,
  readEspionageDoctrine,
  unknownDoctrine,
} from '../../src/domain/worldPulse/espionage/espionageDoctrine.js';
import { LAW_WORD_EDGES } from '../../src/domain/worldPulse/lawWord.js';
import { natureWordFor } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { computeLawfulness } from '../../src/domain/worldPulse/disposition.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/espionage/espionageDoctrine.js';

const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const ROUTES = Object.freeze(['isolated', 'road', 'river', 'port', 'crossroads', 'mountain_pass']);
const CULTURES = Object.freeze(['germanic', 'nordic', 'celtic', 'mediterranean', 'slavic']);
/** Real patron shapes, on both law axes — the lever that opens both tails. */
const LAWFUL_PATRON = Object.freeze({ name: 'The Ordinant', lawAxis: 'lawful', moralAxis: 'good' });
const CHAOTIC_PATRON = Object.freeze({ name: 'The Unbound', lawAxis: 'chaotic', moralAxis: 'evil' });

/** Every real `computeLawfulness` reading the corpus can produce. Built once. */
const LAWFULNESS_READINGS = [];
for (const settType of TIERS) {
  for (const tradeRouteAccess of ROUTES) {
    for (const culture of CULTURES) {
      const base = generateSettlementPipeline(
        { settType, culture, tradeRouteAccess },
        null,
        { seed: `es0-law-${settType}-${tradeRouteAccess}-${culture}`, customContent: {} },
      );
      const id = String(base.id);
      const occupied = { occupations: { [id]: { occupierId: 'elsewhere', state: 'held' } } };
      for (const patron of [null, LAWFUL_PATRON, CHAOTIC_PATRON]) {
        const settlement = patron
          ? { ...base, config: { ...(base.config || {}), primaryDeitySnapshot: patron } }
          : base;
        for (const worldState of [null, occupied]) {
          LAWFULNESS_READINGS.push(computeLawfulness({ id, settlement }, worldState));
        }
      }
    }
  }
}

/** The two frozen edge pairs, each measured against the same real corpus. */
const EDGE_PAIRS = Object.freeze([
  Object.freeze({ name: 'the ESTATE pair (warSeatBooks + natureWordFor)', edges: LAW_WORD_EDGES }),
  Object.freeze({ name: 'the DOCTRINE-LOCAL pair (J-ES-10)', edges: ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES }),
]);

describe('lawWordFor — the estate\'s one law-band spelling', () => {
  test('the corpus is real and non-trivial (guard the guard)', () => {
    // Without this, every reachability claim below could be satisfied by an empty or
    // collapsed corpus and would prove nothing at all.
    expect(LAWFULNESS_READINGS.length).toBe(TIERS.length * ROUTES.length * CULTURES.length * 6);
    expect(LAWFULNESS_READINGS.every((value) => Number.isFinite(value))).toBe(true);
    // The measured span at ES-0. Stated as bounds rather than as an exact pin so
    // ordinary generator evolution does not red the file, while a collapse to the
    // no-signal midpoint (which would make every band claim vacuous) still does.
    const min = Math.min(...LAWFULNESS_READINGS);
    const max = Math.max(...LAWFULNESS_READINGS);
    expect(min).toBeLessThan(0.33);
    expect(max).toBeGreaterThan(0.67);
    // Census 4's ban: the axis is tanh-squashed, so nothing reaches the rails.
    expect(min).toBeGreaterThan(0);
    expect(max).toBeLessThan(0.85);
  });

  test.each(EDGE_PAIRS)('BOTH TAILS are reachable at $name', ({ edges }) => {
    const words = LAWFULNESS_READINGS.map((value) => lawWordFor(value, edges));
    const produced = new Set(words);
    // Every rung, produced by a world the generator can really make. A single-tailed
    // pair would ship a rung nothing can reach — the dead-band law, and the reason
    // `envoyTestimony`'s `'lawless'` arm sat dead for a whole era.
    expect([...produced].sort()).toEqual([...LAW_WORDS]);
    // And non-vacuously: each rung has real support, not one lucky outlier.
    for (const word of LAW_WORDS) {
      expect(words.filter((w) => w === word).length, `${word} has token support only`).toBeGreaterThan(5);
    }
  });

  test('the ESTATE pair is exactly the retired lawfulnessBand pair, to the digit', () => {
    // CR-ES-3 is a VOCABULARY unification. The retired `warSeatBooks.lawfulnessBand`
    // banded at 0.67/0.33; moving the edges under cover of a word change would be an
    // undeclared behavioural shift on a frozen war-lane surface. This pin is what makes
    // that promise falsifiable rather than a sentence in a commit message.
    expect(LAW_WORD_EDGES).toEqual({ lawful: 0.67, lawless: 0.33 });
    // The exact rung boundaries the old private function produced, re-derived here.
    expect(lawWordFor(0.67)).toBe('lawful');
    expect(lawWordFor(0.6699)).toBe('balanced');
    expect(lawWordFor(0.33)).toBe('lawless');
    expect(lawWordFor(0.3301)).toBe('balanced');
  });

  test('the doctrine pair is genuinely different, and wider in the middle-crossing sense', () => {
    // J-ES-10's whole reason: the estate middle is wide enough that no seat ARCHETYPE
    // crosses it alone. If the two pairs were ever made equal, the ruling would be
    // silently unimplemented while every other test here stayed green.
    expect(ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES).not.toEqual(LAW_WORD_EDGES);
    const estate = LAWFULNESS_READINGS.filter((v) => lawWordFor(v) !== 'balanced').length;
    const doctrine = LAWFULNESS_READINGS
      .filter((v) => lawWordFor(v, ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES) !== 'balanced').length;
    expect(doctrine, 'the doctrine pair must band MORE courts, or it buys nothing').toBeGreaterThan(estate);
  });

  test('total on garbage, and it never invents a fourth word', () => {
    // `computeLawfulness` documents EXACTLY 0.5 as "no signal", so an unreadable axis
    // reads as the no-signal rung. It must never answer `unknown`: both frozen consumer
    // sets would reject that word and the row would vanish — the very defect CR-ES-3
    // exists to close.
    for (const bad of [undefined, null, NaN, Infinity, 'lawful', {}, []]) {
      expect(LAW_WORDS).toContain(lawWordFor(bad));
    }
    expect(lawWordFor(NaN)).toBe('balanced');
    expect(lawWordFor(0.5)).toBe('balanced');
  });

  test('LAW_WORDS is a codepoint-sorted totality export', () => {
    expect([...LAW_WORDS]).toEqual([...LAW_WORDS].sort());
    expect(new Set(LAW_WORDS).size).toBe(LAW_WORDS.length);
  });
});

describe('readEspionageDoctrine — both axes, banded and receipted', () => {
  const NATURE_WORDS = Object.freeze(['benevolent', 'balanced', 'malicious']);

  test('the leaf imports EXACTLY the shared law vocabulary, and nothing else', () => {
    // The exact SET rather than emptiness, which is the stronger statement: it names
    // what is allowed instead of forbidding everything and then being quietly relaxed
    // the first time something is needed. The property being protected is the closure —
    // this module plus lawWord.js is two files, and a new import here re-parents that
    // whole closure into every port that spells a doctrine word. There is no runtime
    // symptom until the bundle is built, so the pin is a source scan.
    const source = readFileSync(join(ROOT, LEAF), 'utf8');
    const specifiers = [...source.matchAll(/(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g)]
      .map((m) => m[1]).sort();
    expect(specifiers, `${LEAF} import set drifted`).toEqual(['../lawWord.js']);
    // And the one it reaches for is itself import-free, or the closure claim is empty.
    const vocab = readFileSync(join(ROOT, 'src/domain/worldPulse/lawWord.js'), 'utf8');
    expect([...vocab.matchAll(/(?:^|\n)\s*import\b/g)], 'lawWord.js grew an import').toEqual([]);
  });

  test('every axis pair produces closed-vocabulary members, and all of them are reachable', () => {
    const targetings = new Set();
    const methods = new Set();
    const employments = new Set();
    for (const orderWord of LAW_WORDS) {
      for (const natureWord of NATURE_WORDS) {
        const doctrine = readEspionageDoctrine({ courtId: 'ashford', orderWord, natureWord });
        expect(doctrine.known, `${orderWord}/${natureWord} must resolve`).toBe(true);
        expect(DOCTRINE_TARGETINGS).toContain(doctrine.targeting);
        expect(DOCTRINE_METHODS).toContain(doctrine.method);
        expect(DOCTRINE_EMPLOYMENTS).toContain(doctrine.employment);
        expect(doctrine.frequency01).toBeGreaterThanOrEqual(0);
        expect(doctrine.frequency01).toBeLessThanOrEqual(1);
        targetings.add(doctrine.targeting);
        methods.add(doctrine.method);
        employments.add(doctrine.employment);
      }
    }
    // Reachability of the OUTPUT vocabularies, not just membership: a closed set with an
    // unreachable member is a dead band wearing a totality export's clothes.
    expect([...targetings].sort()).toEqual([...DOCTRINE_TARGETINGS]);
    expect([...methods].sort()).toEqual([...DOCTRINE_METHODS]);
    expect([...employments].sort()).toEqual([...DOCTRINE_EMPLOYMENTS]);
  });

  test('the doctrine words come from the axes they claim to come from', () => {
    // Each output must MOVE with its axis, or the table is decoration. Targeting moves
    // with morality alone; method moves with law alone.
    const byNature = NATURE_WORDS.map((natureWord) =>
      readEspionageDoctrine({ courtId: 'c', orderWord: 'balanced', natureWord }).targeting);
    expect(new Set(byNature).size, 'targeting is blind to the moral axis').toBe(3);
    const byOrder = LAW_WORDS.map((orderWord) =>
      readEspionageDoctrine({ courtId: 'c', orderWord, natureWord: 'balanced' }).method);
    expect(new Set(byOrder).size, 'method is blind to the law axis').toBeGreaterThan(1);
    // The asymmetry is deliberate and stated: only an actively lawless court takes the
    // hidden ways. If a later edit maps the middle rung to `lawless`, hidden-way
    // missions silently become the world's normal case and this reds.
    expect(readEspionageDoctrine({ courtId: 'c', orderWord: 'balanced', natureWord: 'balanced' }).method).toBe('lawful');
    expect(readEspionageDoctrine({ courtId: 'c', orderWord: 'lawless', natureWord: 'balanced' }).method).toBe('lawless');
  });

  test('frequency is lowest for the lawful-benevolent court and highest for the lawless-malicious one', () => {
    const low = readEspionageDoctrine({ courtId: 'c', orderWord: 'lawful', natureWord: 'benevolent' });
    const mid = readEspionageDoctrine({ courtId: 'c', orderWord: 'balanced', natureWord: 'balanced' });
    const high = readEspionageDoctrine({ courtId: 'c', orderWord: 'lawless', natureWord: 'malicious' });
    expect(low.frequency01).toBeLessThan(mid.frequency01);
    expect(mid.frequency01).toBeLessThan(high.frequency01);
    // And the extremes stay inside the unit interval by ARITHMETIC — a clamp that is
    // doing real work would be hiding a runaway weight.
    expect(low.frequency01).toBeGreaterThan(0);
    expect(high.frequency01).toBeLessThan(1);
  });

  test('the unknown arm is produced ONLY at the resolution gate', () => {
    // No court is a resolution failure. A balanced court is NOT: it has a doctrine, and
    // reading silence as a moderate temperament is exactly the honesty failure the
    // sovereignty-sale gate pattern exists to refuse.
    expect(readEspionageDoctrine({ courtId: '', orderWord: 'lawful', natureWord: 'balanced' }).known).toBe(false);
    expect(readEspionageDoctrine({ courtId: 'c', orderWord: 'chaotic', natureWord: 'balanced' }).known).toBe(false);
    expect(readEspionageDoctrine({ courtId: 'c', orderWord: 'lawful', natureWord: 'unknown' }).known).toBe(false);
    expect(readEspionageDoctrine({ courtId: 'c', orderWord: 'balanced', natureWord: 'balanced' }).known).toBe(true);
    // `natureWordFor` really does answer `unknown` on an unreadable axis — the reason
    // the arm above is reachable at all rather than being a defensive fiction.
    expect(natureWordFor(NaN)).toBe('unknown');
    const unknown = unknownDoctrine('no snapshot row');
    expect(unknown.targeting).toBeNull();
    expect(unknown.method).toBeNull();
    expect(unknown.frequency01).toBeNull();
    expect(unknown.employment).toBeNull();
    expect(unknown.receipt).toContain('no snapshot row');
  });

  test('the receipt speaks WORDS and never a number (L5)', () => {
    for (const orderWord of LAW_WORDS) {
      for (const natureWord of NATURE_WORDS) {
        const { receipt } = readEspionageDoctrine({ courtId: 'ashford', orderWord, natureWord });
        // anchored: the two toContain assertions below prove this receipt is a real,
        // populated sentence carrying both doctrine words, so a digit-free result
        // cannot mean the receipt went empty.
        // anchored: the receipt is proven populated by the two toContain assertions below.
        expect(receipt, `${orderWord}/${natureWord}: ${receipt}`).not.toMatch(/[0-9]/);
        expect(receipt).toContain(orderWord);
        expect(receipt).toContain(natureWord);
      }
    }
    // anchored: the unknown-arm block above asserts this same receipt CONTAINS its
    // quoted reason, so the collection is proven non-empty before absence is claimed.
    expect(unknownDoctrine('nothing').receipt).toContain('nothing');
    // anchored: the toContain on the line above proves this receipt is a real sentence.
    expect(unknownDoctrine('nothing').receipt).not.toMatch(/[0-9]/);
  });
});
