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
import { scrubImportedConfig } from '../../src/lib/importScrub.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import { prepareSettlementEntry, ensureNormalizeLoaded } from '../../src/lib/accountImport.js';

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
