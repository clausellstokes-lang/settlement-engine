/**
 * persistSaveUpdate.unify.test.js — A+ P0.1.
 *
 * There must be exactly ONE persistSaveUpdate implementation, and it must REPORT
 * cloud-save failures (not silently console.warn-and-drop). Previously a second,
 * silent copy lived in settlementSliceHelpers.js and was used by the canon
 * settlement path (applyEvent / undoLastEvent / snapshots / destroy) — a save
 * failure there left the user seeing success while Supabase drifted. These pins
 * keep the divergence from reopening.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const STORE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/store');

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn() },
}));

import { saves } from '../../src/lib/saves.js';
import { persistSaveUpdate, initPersistFailureReporter } from '../../src/store/campaignSliceShared.js';

// A DEFINITION is either `function persistSaveUpdate` OR an assignment
// `persistSaveUpdate = function|(...)=>` (const/let/var arrow). The re-export
// `export { persistSaveUpdate } from …` has no `=` after the name, so it is NOT a
// definition — this catches a silent arrow re-definition the keyword-only regex missed.
const DEF_RE = /function\s+persistSaveUpdate\b|\bpersistSaveUpdate\s*=\s*(?:async\s*)?(?:function|\()/g;

describe('persistSaveUpdate is unified (single impl)', () => {
  test('exactly ONE persistSaveUpdate definition exists across src/store', () => {
    const defs = readdirSync(STORE_DIR)
      .filter(f => f.endsWith('.js'))
      .map(f => ({ f, hits: (readFileSync(join(STORE_DIR, f), 'utf8').match(DEF_RE) || []).length }))
      .filter(x => x.hits > 0);
    const total = defs.reduce((n, x) => n + x.hits, 0);
    expect(total, `definitions found in: ${defs.map(d => d.f).join(', ')}`).toBe(1);
    expect(defs[0].f).toBe('campaignSliceShared.js');
  });

  test('settlementSliceHelpers RE-EXPORTS persistSaveUpdate, does not redefine it (function OR arrow)', () => {
    const src = readFileSync(join(STORE_DIR, 'settlementSliceHelpers.js'), 'utf8');
    expect(src).toMatch(/export\s*\{\s*persistSaveUpdate\s*\}\s*from\s*'\.\/campaignSliceShared\.js'/);
    expect(src).not.toMatch(DEF_RE);
  });
});

describe('persistSaveUpdate reports failures (no silent drift)', () => {
  beforeEach(() => { vi.clearAllMocks(); initPersistFailureReporter(null); });

  test('a rejected cloud save reports the failure and resolves false (awaitable)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    saves.update.mockRejectedValueOnce(new Error('network down'));

    const result = await persistSaveUpdate('save-1', { settlement: {} });

    expect(result).toBe(false);
    expect(report).toHaveBeenCalledTimes(1);
  });

  test('a successful cloud save resolves true and never reports', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    saves.update.mockResolvedValueOnce(undefined);

    const result = await persistSaveUpdate('save-1', { settlement: {} });

    expect(result).toBe(true);
    expect(report).not.toHaveBeenCalled();
  });

  test('a no-op (missing id/partial) resolves true without touching the cloud', async () => {
    saves.update.mockResolvedValue(undefined);
    await expect(persistSaveUpdate(null, { settlement: {} })).resolves.toBe(true);
    await expect(persistSaveUpdate('save-1', null)).resolves.toBe(true);
    expect(saves.update).not.toHaveBeenCalled();
  });
});
