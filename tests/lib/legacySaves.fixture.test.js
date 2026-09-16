/**
 * @vitest-environment jsdom
 *
 * legacySaves.fixture.test.js — regression pin for the legacy-save migration
 * spine, driven by a COMMITTED pre-v2 localStorage blob
 * (tests/fixtures/legacy-saves/april-2026-v1.json).
 *
 * Why a committed fixture: migrateSaveToV2 + normalizeSettlement run on every
 * read of every save a real user has kept since before schemaVersion / seed /
 * campaignState existed. Synthesizing shapes inline drifts toward whatever the
 * current code already handles; a frozen artifact from the pre-v2 era exercises
 * the branches that actually shipped — numeric ids, ISO timestamps, spread
 * toggles, no seed column, no campaignState, and settlements missing
 * schemaVersion / id / stressors, across all three stress shapes (bare object /
 * 2-element array / null).
 *
 * The assertions PIN current behavior (not aspiration): in particular the exact
 * stressor-coercion semantics — normalizeSettlement preserves the stored shape,
 * while the canonical reader canonStressors is what turns it into an array.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { canonStressors } from '../../src/domain/canonicalAccessors.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

// Resolve from the vitest cwd (repo root) — import.meta.url is not a file:// URL
// under the jsdom environment, so URL-based resolution can't be used here.
const FIXTURE_PATH = join(process.cwd(), 'tests/fixtures/legacy-saves/april-2026-v1.json');
// The EXACT bytes a pre-v2 browser held in localStorage under this key.
const RAW = readFileSync(FIXTURE_PATH, 'utf8');
const FIXTURE = JSON.parse(RAW);
const LOCAL_KEY = 'dnd_settlement_saves';

const byName = (list) => Object.fromEntries(list.map((e) => [e.name, e]));

describe('legacy pre-v2 save fixture', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    // Force isConfigured=false so saves.* bind to the local* (localStorage) path.
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
    // Plant the committed fixture VERBATIM, exactly as a real browser stored it.
    localStorage.setItem(LOCAL_KEY, RAW);
  });

  // ── Guard the fixture itself: if it silently drifts into a v2 shape the
  //    migration branches below stop being exercised. ─────────────────────────
  test('the committed fixture is a faithful pre-v2 envelope', () => {
    expect(Array.isArray(FIXTURE)).toBe(true);
    expect(FIXTURE).toHaveLength(3);
    for (const e of FIXTURE) {
      expect(typeof e.id).toBe('number');                 // numeric ids (pre-UUID)
      expect(e.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);  // ISO timestamps
      expect(e.seed).toBeUndefined();                     // NO seed column
      expect(e.campaignState).toBeUndefined();            // NO campaignState
      expect(e.versionHistory).toBeUndefined();           // NO versionHistory
      // Spread toggles at the top level (pre the `toggles` bundle column).
      expect(e).toHaveProperty('institutionToggles');
      expect(e).toHaveProperty('categoryToggles');
      expect(e).toHaveProperty('goodsToggles');
      expect(e).toHaveProperty('servicesToggles');
      // Settlements pre-date the canonical stamps.
      expect(e.settlement.schemaVersion).toBeUndefined();
      expect(e.settlement.id).toBeUndefined();
      expect(e.settlement.stressors).toBeUndefined();
    }
    // All three stress shapes are present.
    expect(Array.isArray(FIXTURE[0].settlement.stress)).toBe(false);
    expect(FIXTURE[0].settlement.stress).toBeTypeOf('object'); // bare object
    expect(Array.isArray(FIXTURE[1].settlement.stress)).toBe(true);
    expect(FIXTURE[1].settlement.stress).toHaveLength(2);       // 2-element array
    expect(FIXTURE[2].settlement.stress).toBeNull();            // null
  });

  test('saves.list() migrates every entry without throwing', async () => {
    const list = await saves.list();                     // throws → test fails
    expect(list).toHaveLength(3);
    expect(list.map((e) => e.name).sort()).toEqual(["Harrowmoor", "Kelder's Reach", 'Thistledown']);
  });

  test('schemaVersion and a stable seed-derived id are stamped on load', async () => {
    const list = await saves.list();
    for (const e of list) {
      expect(e.settlement.schemaVersion).toBe(1);
      expect(e.settlement.id).toMatch(/^s_/);
    }
    // Deterministic: the same seeded blob always normalizes to the same id.
    expect(byName(list)['Harrowmoor'].settlement.id)
      .toBe(normalizeSettlement(FIXTURE[0].settlement).id);
  });

  test('seed is lifted from the settlement/config blob (or null when unknown)', async () => {
    const b = byName(await saves.list());
    expect(b['Harrowmoor'].seed).toBe('harrowmoor-8823');    // from settlement._seed
    expect(b["Kelder's Reach"].seed).toBe('kelder-4410');    // from config._seed
    expect(b['Thistledown'].seed).toBeNull();                // no _seed anywhere → honest null
  });

  test('campaignState is default-populated to draft for pre-v2 entries', async () => {
    for (const e of await saves.list()) {
      expect(e.campaignState).toBeDefined();
      expect(e.campaignState.phase).toBe('draft');
      expect(e.campaignState.eventLog).toEqual([]);
      expect(e.campaignState.systemState).toBeNull();
      expect(e.campaignState.canonizedAt).toBeNull();
    }
  });

  // ── Stressor coercion — PIN the actual two-layer behavior. ─────────────────
  test('stressors: normalize preserves the stored shape; canonStressors is what coerces to an array', async () => {
    const b = byName(await saves.list());
    const harrow = b['Harrowmoor'].settlement;
    const kelder = b["Kelder's Reach"].settlement;
    const thistle = b['Thistledown'].settlement;

    // (a) normalizeSettlement resolves the `stress` alias into `stressors`
    //     WITHOUT coercing — the stored shape is preserved verbatim.
    expect(Array.isArray(harrow.stressors)).toBe(false);
    expect(harrow.stressors).toEqual(harrow.stress);   // bare object stays a bare object
    expect(Array.isArray(kelder.stressors)).toBe(true);
    expect(kelder.stressors).toHaveLength(2);           // array stays an array
    expect(thistle.stressors).toBeNull();               // null stays null
    // The legacy `stress` alias is preserved, never deleted.
    expect(harrow.stress).toBeDefined();

    // (b) the array coercion happens at READ time via canonStressors — the
    //     accessor deriveSystemState consumes. This is where the "stressors are
    //     arrays" invariant actually holds.
    expect(canonStressors(harrow)).toHaveLength(1);     // bare object → 1-element array
    expect(canonStressors(kelder)).toHaveLength(2);
    expect(canonStressors(thistle)).toEqual([]);        // null → empty array
    for (const e of Object.values(b)) {
      expect(Array.isArray(canonStressors(e.settlement))).toBe(true);
    }
  });

  test('normalizeSettlement is idempotent on every migrated settlement (deep-equal 2nd pass)', async () => {
    for (const e of await saves.list()) {
      const once = e.settlement;                 // saves.list() already normalized it once
      const twice = normalizeSettlement(once);
      expect(twice).toEqual(once);               // deep structural equality
      expect(JSON.stringify(twice)).toBe(JSON.stringify(once)); // byte-stable
    }
  });

  test('deriveDossierViewModel and deriveSystemState consume every migrated settlement without throwing', async () => {
    for (const e of await saves.list()) {
      expect(() => deriveDossierViewModel(e.settlement)).not.toThrow();
      expect(() => deriveSystemState(e.settlement)).not.toThrow();
      expect(deriveDossierViewModel(e.settlement)).toBeTypeOf('object');
      expect(deriveSystemState(e.settlement)).toBeTypeOf('object');
    }
  });
});
