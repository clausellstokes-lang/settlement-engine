/**
 * errandConsumerRegistry.walker.test.js — SP-D. THE CONSUMER REGISTRATION TRIPWIRE, both
 * ways, plus the one-reader law that keeps the conditional class field readable.
 *
 * ── WHY A TRIPWIRE AT ALL ────────────────────────────────────────────────────────
 * J-SP-2 makes `worldState.envoyErrands` the estate's ONE purposeful-travel substrate, and
 * five unbuilt volumes are supposed to mint through it: TRADE's factors, FAITH's legates
 * and pilgrims, ES-1/IN-4's couriers, INTERIOR's emigres. "Supposed to" is not a mechanism.
 * The failure this file forecloses is the ordinary one: a volume lands, needs a traveller,
 * finds the errand seam slightly awkward for its case, and opens a second ledger — and
 * nobody notices until two subsystems disagree about where a named person is. So the map
 * is FROZEN in the vocabulary leaf and measured in BOTH directions:
 *
 *   UNREGISTERED MINTER REDS — a module that reaches the generalized mint head without a
 *     registry row fails. There is no lawful way to get a validated class block except
 *     `mintErrandSpine`, so this signature cannot be dodged by spelling.
 *   CONSUMERLESS ROW REDS — a row claiming `built: true` whose module does not mint fails,
 *     and a row claiming `built: false` whose module DOES mint fails. A registry that
 *     drifts into fiction is worse than no registry: it reports coverage it does not have.
 *
 * ── AND THE ONE-READER LAW ───────────────────────────────────────────────────────
 * `purposeClass` is ABSENT on every legacy row and on every errand the war path mints,
 * because the mapping row derives `diplomatic` for the war purposes (that is what buys
 * SP-D its no-migration promise). A consumer that reads `errand.purposeClass` DIRECTLY
 * therefore sees `undefined` on exactly the rows that are most common, and would file a
 * peace embassy under no class at all. One reader, `purposeClassOf`, and the scan below
 * holds the estate to it — the writer/reader spelling-drift class, one field wide.
 *
 * BOTH HALVES CARRY POSITIVE CONTROLS. A scanner that stopped matching would report no
 * offenders and pass having proved nothing, so each detector is driven against a planted
 * source that MUST red before any absence is asserted.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ENVOY_PURPOSE_CLASSES,
  ERRAND_CONSUMERS,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

/** The mint head's own home — the definition site, never a consumer of itself. */
const MINT_HOME = 'src/domain/worldPulse/errandMint.js';

/**
 * THE ERRAND FAMILY. These files own the row's shape and are the lawful direct readers of
 * the three conditional fields; everyone else goes through the vocabulary's readers or the
 * projection's audience split.
 */
const FAMILY = Object.freeze([
  'src/domain/worldPulse/errandMint.js',
  'src/domain/worldPulse/envoyErrandVocabulary.js',
  'src/domain/worldPulse/envoyErrandRecords.js',
  'src/domain/worldPulse/envoyErrandProjection.js',
]);

/** A module reaches the generalized mint head. There is no second lawful spelling. */
const MINT_RE = /\bmintErrandSpine\s*\(/;

/** A direct property read of one of the three conditional fields. */
const RAW_FIELD_RE = /\.\s*(?:purposeClass|declaredPurpose|truePurpose)\b/;

/** Strip comments so prose cannot make a module look like a minter, or hide one. */
function executableSource(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.js$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

const domainFiles = walk(DOMAIN).map((absolute) => ({
  rel: relative(ROOT, absolute).replace(/\\/g, '/'),
  code: executableSource(readFileSync(absolute, 'utf8')),
}));

/** Every module that mints through the spine, excluding the head's own home. */
const minters = domainFiles
  .filter(({ rel, code }) => rel !== MINT_HOME && MINT_RE.test(code))
  .map(({ rel }) => rel)
  .sort();

const registeredModules = ERRAND_CONSUMERS.map((row) => row.module);
const builtModules = ERRAND_CONSUMERS.filter((row) => row.built).map((row) => row.module).sort();

describe('SP-D errand consumer registry — the map itself', () => {
  test('guard the guard: the scan is populated and the detectors discriminate', () => {
    // A collapsed walk would make every absence below trivially true.
    expect(domainFiles.length, 'the domain scan emptied').toBeGreaterThan(200);
    expect(ERRAND_CONSUMERS.length, 'the registry emptied').toBeGreaterThanOrEqual(6);
    // POSITIVE CONTROL for the mint detector, and its comment-blind negative.
    expect(MINT_RE.test(executableSource('const r = mintErrandSpine({ worldState });'))).toBe(true);
    expect(MINT_RE.test(executableSource('// a volume would call mintErrandSpine(here)'))).toBe(false);
    // POSITIVE CONTROL for the raw-field detector, and the lawful reader it must not flag.
    expect(RAW_FIELD_RE.test('if (errand.purposeClass === "covert") run();')).toBe(true);
    expect(RAW_FIELD_RE.test('if (purposeClassOf(errand) === "covert") run();')).toBe(false);
  });

  test('every row names a lawful class, and every class is claimed', () => {
    for (const row of ERRAND_CONSUMERS) {
      expect(ENVOY_PURPOSE_CLASSES, `${row.consumer}: ${row.purposeClass} is not a class`)
        .toContain(row.purposeClass);
      expect(typeof row.wave, `${row.consumer}: a row names the wave that owes it`).toBe('string');
      expect(row.wave.length).toBeGreaterThan(1);
      expect(typeof row.built).toBe('boolean');
    }
    // TOTALITY: the six classes exist because six kinds of business exist, and each has
    // somebody who will mint it. A class nobody claims is a word with no future.
    const claimed = new Set(ERRAND_CONSUMERS.map((row) => row.purposeClass));
    expect([...claimed].sort()).toEqual([...ENVOY_PURPOSE_CLASSES].sort());
    // Consumer names and module addresses are unique, or "which one is built" is unanswerable.
    expect(new Set(registeredModules).size).toBe(registeredModules.length);
    expect(new Set(ERRAND_CONSUMERS.map((r) => r.consumer)).size).toBe(ERRAND_CONSUMERS.length);
  });
});

describe('SP-D errand consumer registry — BOTH WAYS against the tree', () => {
  test('DIRECTION 1: every module that mints is registered', () => {
    const unregistered = minters.filter((rel) => !registeredModules.includes(rel));
    expect(
      unregistered,
      'a module mints errands with no row in ERRAND_CONSUMERS. Add its row (consumer,'
      + ' purposeClass, module, wave, built:true) in the SAME commit — an unregistered'
      + ' minter is how a second purposeful-travel substrate gets built by accident.',
    ).toEqual([]);
    // NON-VACUITY: somebody really does mint today, so direction 1 measures something.
    expect(minters.length, 'nothing mints — the direction-1 filter is empty').toBeGreaterThan(0);
  });

  test('DIRECTION 2: every BUILT row really mints, and every UNBUILT row really does not', () => {
    const problems = [];
    for (const row of ERRAND_CONSUMERS) {
      const mints = minters.includes(row.module);
      const exists = existsSync(join(ROOT, row.module));
      if (row.built && !mints) {
        problems.push(`${row.consumer}: row claims built:true but ${row.module} `
          + `${exists ? 'does not reach mintErrandSpine' : 'does not exist'}`);
      }
      if (!row.built && mints) {
        problems.push(`${row.consumer}: ${row.module} now mints — flip built:true in the`
          + ` same commit as ${row.wave}'s landing`);
      }
    }
    expect(problems, 'the errand consumer registry drifted from the tree').toEqual([]);
    // The partition is a MEASUREMENT only if both halves are non-empty: all-built or
    // all-unbuilt would make every row agree with the tree for free.
    expect(builtModules.length, 'no consumer is built — direction 2 proves nothing')
      .toBeGreaterThan(0);
    expect(
      ERRAND_CONSUMERS.filter((row) => !row.built).length,
      'every consumer is built — the pre-pin toward the unbuilt volumes has expired,'
      + ' which is a real event and wants a look',
    ).toBeGreaterThan(0);
  });

  test('the TWO built consumers today are the war errand head and the pact proposals', () => {
    // Recorded as a fact rather than assumed, and the fact MOVED at FP GR-2 (2026-08-06):
    // the spine's whole purpose is to be minted through by more than one lane, and this is
    // the first lane to do it. The remaining four pre-pins still point at volumes that have
    // not landed, so the built/unbuilt partition above is still a real measurement.
    //
    // THAT THE SECOND CONSUMER IS *NOT* A NEW `*Errand.js` FILE IS THE POINT. The registry's
    // unbuilt rows all name a prospective module of their own; GR-2 instead mints from the
    // ledger writer that creates the thing being carried, because a pact proposal has no
    // life of its own outside that row. A wave that felt it needed a private errand module
    // to travel would be building the second substrate this registry exists to prevent.
    expect(builtModules).toEqual([
      'src/domain/worldPulse/envoyErrand.js',
      'src/domain/worldPulse/pactProposals.js',
    ]);
    expect(minters).toEqual([
      'src/domain/worldPulse/envoyErrand.js',
      'src/domain/worldPulse/pactProposals.js',
    ]);
  });
});

describe('SP-D one-reader law — the conditional fields have exactly one reader', () => {
  test('no module outside the errand family reads purposeClass/declaredPurpose/truePurpose directly', () => {
    const offenders = domainFiles
      .filter(({ rel }) => !FAMILY.includes(rel))
      .filter(({ code }) => RAW_FIELD_RE.test(code))
      .map(({ rel }) => rel)
      .sort();
    expect(
      offenders,
      'a direct read of a DROP-WHEN-DERIVABLE field. `purposeClass` is absent on every'
      + ' legacy row and on every war errand, so a direct read returns undefined exactly'
      + ' where it matters — use purposeClassOf / declaredPurposeClassOf, or'
      + ' projectErrandPurpose for an audience-side read.',
    ).toEqual([]);
    // NON-VACUITY: the family members really do read the fields, so an empty offender set
    // is a measurement rather than a regex that stopped matching.
    const familyReaders = domainFiles
      .filter(({ rel, code }) => FAMILY.includes(rel) && RAW_FIELD_RE.test(code))
      .map(({ rel }) => rel);
    expect(familyReaders.length, 'not one family member reads the fields — the scan broke')
      .toBeGreaterThan(0);
  });

  test('the two readers are declared exactly once each, in the vocabulary leaf', () => {
    const declarations = (name) => domainFiles
      .filter(({ code }) => new RegExp(`function\\s+${name}\\s*\\(`).test(code))
      .map(({ rel }) => rel);
    // A second definition anywhere is the collision class SP-C was bitten by, and it would
    // let two modules disagree about what an errand is while both look correct.
    expect(declarations('purposeClassOf')).toEqual(['src/domain/worldPulse/envoyErrandVocabulary.js']);
    expect(declarations('declaredPurposeClassOf')).toEqual(['src/domain/worldPulse/envoyErrandVocabulary.js']);
  });
});
