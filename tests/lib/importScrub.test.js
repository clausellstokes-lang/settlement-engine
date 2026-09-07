/**
 * importScrub.test.js — store-4 pin.
 *
 * scrubImportedConfig is the SINGLE writer for the imported-settlement dormancy
 * strip, shared by galleryImportSettlement.js and accountImport.js. It must drop
 * every deity/faith embed (primaryDeitySnapshot / cultDeitySnapshots / primaryDeityRef
 * / faithProfile) AND the generation seed, so an imported settlement arrives DORMANT —
 * the religion subsystem gate (which flips on config.primaryDeitySnapshot /
 * cultDeitySnapshots) stays closed and no foreign pantheon enters the importer's world.
 * cultDeitySnapshots was the store-4 gap: previously missed by BOTH hand-maintained
 * strips.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  scrubImportedConfig,
  scrubImportedTreasury,
  scrubGalleryImportLivingContent,
} from '../../src/lib/importScrub.js';
import { LIVING_CONTENT_LAW_CONFIG_KEY } from '../../src/domain/content/livingContentLawVersion.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import { prepareSettlementEntry, ensureNormalizeLoaded } from '../../src/lib/accountImport.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('store-4 — scrubImportedConfig', () => {
  it('drops the seed + EVERY deity/faith embed, keeps benign keys', () => {
    const out = scrubImportedConfig({
      culture: 'norse',
      population: 1200,
      _seed: 'abc123',
      primaryDeityRef: 'deity:acct-42:sol',
      primaryDeitySnapshot: { name: 'Sol', lawAxis: 'lawful' },
      cultDeitySnapshots: [{ name: 'Nerz' }],
      faithProfile: { piety: 0.8, martial: {} },
    });
    expect(out).toEqual({ culture: 'norse', population: 1200 });
    for (const stripped of ['_seed', 'primaryDeityRef', 'primaryDeitySnapshot', 'cultDeitySnapshots', 'faithProfile']) {
      expect(out).not.toHaveProperty(stripped);
    }
  });

  it('the scrubbed config leaves the religion subsystem gate CLOSED', () => {
    const scrubbed = scrubImportedConfig({
      cultDeitySnapshots: [{ name: 'Foreign Cult' }],
      primaryDeitySnapshot: { name: 'Foreign Patron' },
    });
    // A world snapshot whose only member carries the scrubbed config must read dormant.
    const snapshot = { settlements: [{ id: 's1', settlement: { config: scrubbed } }] };
    expect(isSubsystemActive(snapshot, 'religion')).toBe(false);
    // Sanity: the SAME gate would fire on the UN-scrubbed config (the strip is load-bearing).
    const live = { settlements: [{ id: 's1', settlement: { config: { cultDeitySnapshots: [{ name: 'X' }] } } }] };
    expect(isSubsystemActive(live, 'religion')).toBe(true);
  });

  it('passes a null / non-object config through unchanged', () => {
    expect(scrubImportedConfig(null)).toBe(null);
    expect(scrubImportedConfig(undefined)).toBe(undefined);
  });
});

describe('W-COIN A1.8 — scrubImportedTreasury: imports arrive COINLESS', () => {
  const withLedger = (coin) => ({
    name: 'Imported', tier: 'town',
    economicState: {
      foodSecurity: { storageMonths: 2 },
      treasury: { coin, openedTick: 3, lastTick: 40, coinFlows: { taxed: 5, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } },
    },
  });

  it('drops the coin ledger and keeps every other economicState key', () => {
    const out = /** @type {any} */ (scrubImportedTreasury(withLedger(4200)));
    expect(Object.hasOwn(out.economicState, 'treasury')).toBe(false);
    // anchored: the round-trip arm below proves this same fixture really carries a ledger
    // before the strip, so a scrub whose subject had drifted away reds there, not here.
    expect(out.economicState.foodSecurity).toEqual({ storageMonths: 2 });
    expect(out.name).toBe('Imported');
  });

  it('is REFERENCE-IDENTICAL when there is nothing to strip', () => {
    // Every settlement in every dark campaign takes this path. A strip that rebuilt the
    // object would charge a dormancy cost to worlds with no ledger at all.
    const dark = { name: 'Dark', economicState: { foodSecurity: { storageMonths: 2 } } };
    expect(scrubImportedTreasury(dark)).toBe(dark);
    expect(scrubImportedTreasury({ name: 'NoEconomy' })).not.toBe(undefined); // anchored: the two identity assertions on the following lines pin the exact objects returned, so a function that had started returning undefined reds there.
    const noEconomy = { name: 'NoEconomy' };
    expect(scrubImportedTreasury(noEconomy)).toBe(noEconomy);
    const oddEconomy = { name: 'Odd', economicState: 'not-an-object' };
    expect(scrubImportedTreasury(oddEconomy)).toBe(oddEconomy);
  });

  it('passes a null / non-object settlement through unchanged', () => {
    expect(scrubImportedTreasury(null)).toBe(null);
    expect(scrubImportedTreasury(undefined)).toBe(undefined);
    const arr = /** @type {any} */ ([]);
    expect(scrubImportedTreasury(arr)).toBe(arr);
  });

  it('the sanity half: the UNSCRUBBED settlement really does carry a foreign balance', () => {
    // The strip is load-bearing only if its subject exists — the store-4 shape of proof.
    const live = /** @type {any} */ (withLedger(4200));
    expect(live.economicState.treasury.coin).toBe(4200);
  });

  it('ALL THREE import paths call it — the one-path-only shape store-4 was', () => {
    // A behavioural test can reach the account path (below); the two gallery paths are
    // store modules behind a network fetch. Their wiring is therefore pinned by ADDRESS,
    // which is the same instrument tests/lib/accountImport.test.js uses for its sibling
    // import. Named individually because a second door silently covering a deleted first
    // is this program's most-repeated verification failure.
    const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
    for (const rel of [
      'src/lib/accountImport.js',
      'src/store/galleryImportSettlement.js',
      'src/store/galleryImportMap.js',
    ]) {
      const src = read(rel);
      expect(src, `${rel} no longer imports the coin strip`)
        .toMatch(/import\s*\{[^}]*\bscrubImportedTreasury\b[^}]*\}\s*from\s*['"][^'"]*importScrub\.js['"]/);
      expect(src.includes('scrubImportedTreasury('), `${rel} imports the coin strip but never calls it`).toBe(true);
    }
  });
});

describe('W-COIN A1.8 — the account-file import path arrives coinless end to end', () => {
  it('prepareSettlementEntry strips a foreign coin ledger', async () => {
    await ensureNormalizeLoaded();
    const res = prepareSettlementEntry({
      settlement: {
        name: 'Rich Import', tier: 'town',
        economicState: {
          foodSecurity: { storageMonths: 2 },
          treasury: { coin: 99999, openedTick: 1, lastTick: 50, coinFlows: { taxed: 12, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } },
        },
      },
    });
    expect(res.ok).toBe(true);
    const eco = res.entry.settlement.economicState || {};
    expect(Object.hasOwn(eco, 'treasury')).toBe(false);
    // anchored: `res.ok` is asserted true above and the surviving food ledger below proves
    // the entry really carries an economicState, so an emptied entry reds there, not here.
    expect(eco.foodSecurity).toBeDefined();
  });
});

describe('store-4 — the account-file import path routes through the shared scrub', () => {
  it('prepareSettlementEntry drops the deity/faith embeds (parity with the gallery path)', async () => {
    await ensureNormalizeLoaded();
    const res = prepareSettlementEntry({
      settlement: {
        name: 'Imported', tier: 'town',
        config: {
          culture: 'x',
          cultDeitySnapshots: [{ name: 'Foreign Cult' }],
          primaryDeitySnapshot: { name: 'Foreign Patron' },
          primaryDeityRef: 'deity:acct-9:sol',
          faithProfile: { piety: 0.5 },
          _seed: 'zzz',
        },
      },
    });
    expect(res.ok).toBe(true);
    const cfg = res.entry.settlement.config || {};
    expect(cfg.cultDeitySnapshots).toBeUndefined();
    expect(cfg.primaryDeitySnapshot).toBeUndefined();
    expect(cfg.primaryDeityRef).toBeUndefined();
    expect(cfg.faithProfile).toBeUndefined();
    expect(cfg._seed).toBeUndefined();
  });
});

/**
 * DEF-1 (lane L-MAT-FIX) — THE GALLERY INGEST CARRIES NO FOREIGN SCOPE RECORD.
 *
 * A gallery clone comes from another account's world. `customContentRoster` and
 * `customContentProvenance` are exactness claims keyed on the SOURCE account's
 * ledger ids, and this boundary has no archive to resolve them against — so they
 * are dropped, along with the living-content law marker that would otherwise
 * leave the clone claiming a scope record the public projection already removed.
 *
 * The negatives here go through `expectAbsentWithAnchor` rather than a bare
 * `not.toHaveProperty`: the anchor is a sibling key that travels the SAME strip,
 * so "the whole settlement drifted away" cannot pass as "the key was dropped".
 */
describe('DEF-1 — scrubGalleryImportLivingContent', () => {
  const foreignClone = () => ({
    name: 'Borrowed Town',
    tier: 'town',
    customContentRoster: {
      schemaVersion: 1,
      buckets: { deities: [{ localUid: 'src-lu-1', customDefinitionId: 'src-secret-def' }] },
    },
    customContentProvenance: {
      schemaVersion: 1,
      materializedDefinitions: [{ definitionId: 'src-secret-def', revisionId: 'src-rev-1' }],
    },
    config: { culture: 'norse', [LIVING_CONTENT_LAW_CONFIG_KEY]: 2 },
  });

  it('drops BOTH exactness records and the law marker, and keeps every sibling', () => {
    const src = foreignClone();
    // Liveness first: the fixture really carries what the strip is asked to remove.
    expect(Object.keys(src)).toContain('customContentRoster');
    expect(Object.keys(src)).toContain('customContentProvenance');
    expect(src.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(2);

    const out = scrubGalleryImportLivingContent(src);
    expectAbsentWithAnchor(Object.keys(out), 'customContentRoster', 'name', 'gallery ingest');
    expectAbsentWithAnchor(Object.keys(out), 'customContentProvenance', 'tier', 'gallery ingest');
    expectAbsentWithAnchor(
      Object.keys(out.config), LIVING_CONTENT_LAW_CONFIG_KEY, 'culture', 'gallery ingest config',
    );
    // The world itself survives whole — a strip, not a reset.
    expect(out.name).toBe('Borrowed Town');
    expect(out.config.culture).toBe('norse');
    // …and the source object is not mutated (the importer spreads it elsewhere).
    expect(Object.keys(src)).toContain('customContentRoster');
  });

  it('is REFERENCE-IDENTICAL when there is nothing to strip (every world this build makes)', () => {
    const clean = { name: 'Ordinary', config: { culture: 'norse' } };
    expect(scrubGalleryImportLivingContent(clean)).toBe(clean);
    // A config that is absent or not a record must not throw or invent one.
    const noConfig = { name: 'Ordinary' };
    expect(scrubGalleryImportLivingContent(noConfig)).toBe(noConfig);
    expect(scrubGalleryImportLivingContent(null)).toBe(null);
  });

  it('⛔ THE ACCOUNT PATH KEEPS THE MARKER — the shared scrub must never learn this key', async () => {
    // The refusal recorded beside the cure: `scrubImportedConfig` is shared by all
    // three import paths, and on the ACCOUNT path the marker is a saved world's own
    // immutable birth law. Dropping it there would reclassify a v2 world as v1 while
    // the roster remap keeps its record — the two halves would then disagree.
    await ensureNormalizeLoaded();
    const res = prepareSettlementEntry({
      settlement: {
        name: 'My Own World', tier: 'town',
        config: { culture: 'x', [LIVING_CONTENT_LAW_CONFIG_KEY]: 2 },
      },
    });
    expect(res.ok).toBe(true);
    expect(res.entry.settlement.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(2);
  });
});
