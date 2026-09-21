/**
 * institutionLookupsAddress.test.js — EM-P4's ADDRESS CONTRACT.
 *
 * EM-P4 moved the institutional catalogue's tier readers out of the generator's own
 * lookup leaf and into `src/data/institutionLookups.js`, with
 * `src/domain/institutionLookups.js` as the stable domain address. The move exists so a
 * `src/domain` reader can reach the tier gate without an edge across the generator
 * boundary, which `tests/build/domainGeneratorsBoundary.test.js` refuses.
 *
 * A relocation can fail in four ways that a passing generation run would never show, and
 * each has an arm here: the home could acquire a dependency that undoes the inversion
 * (P1); the old address could be RE-IMPLEMENTED rather than re-exported, so two copies
 * drift (P2, asserted as object IDENTITY rather than deep equality); the domain address
 * could quietly name a generator module (P4); or the tier gate could stop biting on the
 * way through (P5, P6). Every claim is measured against the RAW catalogue or the modules'
 * own source text, never against the predicate under test.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { TIER_ORDER } from '../../src/data/constants.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import * as home from '../../src/data/institutionLookups.js';
import * as domainAddress from '../../src/domain/institutionLookups.js';
import * as seam from '../../src/generators/lookups.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HOME_REL = 'src/data/institutionLookups.js';
const DOMAIN_REL = 'src/domain/institutionLookups.js';

/** @param {string} rel @returns {string} */
const readSrc = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * Every module specifier a source names, static or dynamic, sorted. Read from source
 * rather than from the module graph: what is on trial is what the FILE says.
 * @param {string} source @returns {string[]}
 */
const specifiersOf = (source) => [
  ...[...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]),
  ...[...source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]),
].sort();

/** The four bindings that MOVED — the ones whose identity the seam must preserve. */
const MOVED = ['institutionAvailableAtTier', 'getInstitutionalCatalog', 'getFullCatalogWithTierMeta', 'getInstitutionsForTier'];

/** The three the domain address re-exports. */
const DOMAIN_NAMES = ['getInstitutionalCatalog', 'getInstitutionsForTier', 'institutionAvailableAtTier'];

/**
 * The tier gate REBUILT from index arithmetic — deliberately not the module's own
 * predicate, so P5 compares two independent derivations rather than one with itself.
 * @param {string} tier @param {string} min @returns {boolean}
 */
const atLeast = (tier, min) => TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(min);

/** @param {string[]} tiers @returns {Record<string, Record<string, object>>} merged, later tiers winning */
const rawMerge = (tiers) => {
  /** @type {Record<string, Record<string, object>>} */
  const merged = {};
  for (const t of tiers) {
    for (const [category, insts] of Object.entries(institutionalCatalog[t] || {})) {
      if (!merged[category]) merged[category] = {};
      for (const [name, def] of Object.entries(insts)) merged[category][name] = def;
    }
  }
  return merged;
};

/** @param {Record<string, Record<string, object>>} catalog @param {string} tier @returns {Record<string, Record<string, object>>} */
const rawGate = (catalog, tier) => {
  /** @type {Record<string, Record<string, object>>} */
  const out = {};
  for (const [category, insts] of Object.entries(catalog || {})) {
    /** @type {Record<string, object>} */
    const kept = {};
    for (const [name, def] of Object.entries(insts || {})) {
      if (!def?.minTier || atLeast(tier, def.minTier)) kept[name] = def;
    }
    if (Object.keys(kept).length > 0) out[category] = kept;
  }
  return out;
};

/** The catalogue a tier argument should answer, rebuilt from the RAW tables. @param {unknown} tier */
const rebuiltCatalog = (tier) => {
  if (!tier || tier === 'random' || tier === 'custom') return rawGate(institutionalCatalog['village'] || {}, 'village');
  if (tier === 'metropolis') return rawGate(rawMerge(['city', 'metropolis']), 'metropolis');
  if (tier === 'all') return rawMerge(TIER_ORDER);
  return rawGate(institutionalCatalog[String(tier)] || {}, String(tier));
};

/** The in-tier NAME set a tier argument should answer, rebuilt from the RAW tables. @param {unknown} tier */
const rebuiltNames = (tier) => {
  const blocks = tier === 'metropolis' ? ['city', 'metropolis'] : [String(tier)];
  const names = new Set();
  for (const block of blocks) {
    for (const insts of Object.values(institutionalCatalog[block] || {})) {
      for (const [name, def] of Object.entries(insts)) {
        if (!def?.minTier || atLeast(String(tier), def.minTier)) names.add(name);
      }
    }
  }
  return [...names].sort();
};

/** Every tier argument the readers accept, including the five non-tier spellings. */
const TIER_ARGUMENTS = [...TIER_ORDER, 'all', undefined, null, '', 'random', 'custom'];

describe('EM-P4 — the institutional catalogue has one home and two lawful addresses', () => {
  it('P1: the home sits below both layers, importing exactly the two src/data modules and nothing else', () => {
    const source = readSrc(HOME_REL);
    expect(source.length, 'the home source did not load — every claim below would be vacuous').toBeGreaterThan(500);
    expect(
      specifiersOf(source),
      'the one home may depend only on the two src/data tables it already read. A third specifier —'
      + ' above all a src/domain or src/generators one — undoes the inversion this packet exists to make.',
    ).toEqual(['./constants.js', './institutionalCatalog.js']);
    // POSITIVE CONTROL: the reader finds a generator specifier when one is there, so the exact
    // list above is a verdict rather than a matcher that answers nothing to everything.
    const planted = `${source}\nimport { x } from '../generators/pipeline.js';\n`;
    expect(
      specifiersOf(planted).filter((s) => s.includes('/generators/')),
      'the specifier reader stopped firing — P1 and P4 would both be vacuous',
    ).toEqual(['../generators/pipeline.js']);
  });

  it('P2: the generator address keeps all six export names and re-exports the moved functions THEMSELVES', () => {
    expect(
      Object.keys(seam).sort(),
      'an export name left the generator address. Every existing importer reads this module by name;'
      + ' the move is only lawful while the name set is unchanged.',
    ).toEqual([
      'getFullCatalogWithTierMeta', 'getInstitutionalCatalog', 'getInstitutionsForTier',
      'getPopulationRanges', 'getTierOrder', 'institutionAvailableAtTier',
    ]);
    // IDENTITY, NOT DEEP EQUALITY: a re-implementation at either address would satisfy
    // toEqual and then drift. `export … from` is what makes these the same objects.
    expect(
      MOVED.map((name) => [name, seam[name] === home[name]]),
      'a moved binding is no longer the SAME function object at both addresses — the seam was'
      + ' rewritten as import-then-export, or one side was re-implemented.',
    ).toEqual(MOVED.map((name) => [name, true]));
  });

  it('P3: the domain address re-exports exactly three names, and they are the home\'s own objects', () => {
    expect(
      Object.keys(domainAddress).sort(),
      'the domain address exports a set other than the three a domain reader needs. The all-tier'
      + ' browse is deliberately absent: an unread re-export is a claim nobody checks.',
    ).toEqual(DOMAIN_NAMES);
    expect(
      DOMAIN_NAMES.map((name) => [name, domainAddress[name] === home[name]]),
      'the domain address hands out something other than the home\'s own functions',
    ).toEqual(DOMAIN_NAMES.map((name) => [name, true]));
  });

  it('P4: the domain address names no generators specifier, so the inversion is real and not nominal', () => {
    const source = readSrc(DOMAIN_REL);
    expect(source.length, 'the domain address source did not load').toBeGreaterThan(200);
    expect(
      specifiersOf(source).filter((s) => s.includes('/generators/')),
      'the domain address imports a generator module. That is the edge tests/build/'
      + 'domainGeneratorsBoundary.test.js ratchets shrink-only, and it is the whole reason this'
      + ' packet moved the bodies down a layer.',
    ).toEqual([]);
    // POSITIVE CONTROL, dynamic form included: an `import('…')` would evade a static-only reader.
    const planted = `${source}\nconst late = () => import('../generators/pipeline.js');\n`;
    expect(
      specifiersOf(planted).filter((s) => s.includes('/generators/')),
      'the dynamic-import branch of the reader stopped firing',
    ).toEqual(['../generators/pipeline.js']);
  });

  it('P5: both readers answer the eligible set rebuilt from the raw catalogue, at every tier argument', () => {
    // Anti-vacuity: the rebuild produces a real, populated answer before anything is compared.
    expect(rebuiltNames('town').length, 'the rebuild from the raw catalogue produced nothing').toBeGreaterThan(50);
    const disagreements = [];
    for (const tier of TIER_ARGUMENTS) {
      const label = String(tier);
      const liveNames = [...seam.getInstitutionsForTier(tier)].sort();
      if (JSON.stringify(liveNames) !== JSON.stringify(rebuiltNames(tier))) disagreements.push(`names@${label}`);
      const liveCatalog = JSON.stringify(seam.getInstitutionalCatalog(tier));
      if (liveCatalog !== JSON.stringify(rebuiltCatalog(tier))) disagreements.push(`catalog@${label}`);
    }
    expect(
      disagreements,
      'a reader stopped agreeing with the tier gate rebuilt independently from the raw catalogue.'
      + ' EM-P4 is a relocation: any disagreement here is a behaviour change, which is a STOP.',
    ).toEqual([]);
    expect(
      seam.getInstitutionsForTier('town').size,
      'the in-tier name count at town moved. This is the figure EM-A2a\'s institution.class pool reads.',
    ).toBe(85);
  });

  it('P6: the minTier gate still bites when the catalogue is read through the domain address', () => {
    const gated = [];
    const ungated = [];
    for (const insts of Object.values(institutionalCatalog['city'] || {})) {
      for (const [name, def] of Object.entries(insts)) {
        if (def?.minTier === 'metropolis') gated.push(name);
        else if (!def?.minTier) ungated.push(name);
      }
    }
    expect(gated.length, 'no city-authored, metropolis-gated row exists — the gate has nothing to bite on').toBeGreaterThan(0);
    expect(ungated.length, 'no un-gated city row exists — the anchor below would prove nothing').toBeGreaterThan(0);
    const atCity = domainAddress.getInstitutionsForTier('city');
    const atMetropolis = domainAddress.getInstitutionsForTier('metropolis');
    expect(
      gated.filter((name) => atCity.has(name)),
      'a metropolis-gated row is offered at city through the domain address: the UI would advertise'
      + ' a row the generator refuses to roll there',
    ).toEqual([]);
    expect(
      gated.filter((name) => !atMetropolis.has(name)),
      'a metropolis-gated row is unreachable even at metropolis — the gate is not filtering, it is deleting',
    ).toEqual([]);
    // THE ANCHOR: un-gated shelf siblings are present at BOTH tiers, so the absence asserted
    // above measures the gate rather than an empty, renamed or drifted collection.
    expect(
      ungated.filter((name) => !atCity.has(name) || !atMetropolis.has(name)),
      'an un-gated city row went missing at one of the two tiers — the collection drifted, and the'
      + ' absence asserted above is vacuous rather than a verdict about the gate',
    ).toEqual([]);
  });
});
