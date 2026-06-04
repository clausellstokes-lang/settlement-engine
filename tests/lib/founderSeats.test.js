/**
 * tests/lib/founderSeats.test.js - Tier 7.6 client helper.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

async function loadWithStubs({ rpcImpl = vi.fn(), isConfigured = true } = {}) {
  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured,
    supabase: { rpc: rpcImpl },
  }));
  return await import('../../src/lib/founderSeats.js');
}

describe('Tier 7.6 - founder seat helpers', () => {
  it('FOUNDER_SEAT_CAP is the documented value (500)', async () => {
    const mod = await loadWithStubs();
    expect(mod.FOUNDER_SEAT_CAP).toBe(500);
  });
});

describe('fetchFounderSeatsTaken()', () => {
  it('calls the founder_seats_taken RPC and returns the numeric result', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 42, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    const result = await mod.fetchFounderSeatsTaken();
    expect(rpc).toHaveBeenCalledWith('founder_seats_taken');
    expect(result).toBe(42);
  });

  it('returns null when the RPC returns an error', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'oops' } });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsTaken()).toBeNull();
  });

  it('returns null when the RPC throws', async () => {
    const rpc = vi.fn().mockRejectedValue(new Error('network'));
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsTaken()).toBeNull();
  });

  it('returns null when supabase is not configured', async () => {
    const rpc = vi.fn();
    const mod = await loadWithStubs({ rpcImpl: rpc, isConfigured: false });
    expect(await mod.fetchFounderSeatsTaken()).toBeNull();
    expect(rpc).not.toHaveBeenCalled();
  });

  it('returns null when the RPC returns a non-numeric result', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 'broken', error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsTaken()).toBeNull();
  });

  it('returns null when the RPC returns a negative number (corruption guard)', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: -1, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsTaken()).toBeNull();
  });
});

describe('fetchFounderSeatsRemaining()', () => {
  it('returns cap - taken when taken is valid', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 50, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsRemaining()).toBe(450);
  });

  it('clamps to 0 when taken exceeds cap', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 999, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsRemaining()).toBe(0);
  });

  it('clamps to cap when taken is 0', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 0, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsRemaining()).toBe(500);
  });

  it('returns null when underlying fetch returns null', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'x' } });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsRemaining()).toBeNull();
  });

  it('honors a custom cap', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 5, error: null });
    const mod = await loadWithStubs({ rpcImpl: rpc });
    expect(await mod.fetchFounderSeatsRemaining(50)).toBe(45);
  });
});

describe('Tier 7.6 - migration 010 contract', () => {
  it('the migration file exists in tree', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const path = join(__dirname, '..', '..', 'supabase', 'migrations', '010_founder_seat_counter.sql');
    expect(existsSync(path)).toBe(true);
    const sql = readFileSync(path, 'utf8');
    expect(sql).toMatch(/create or replace function public\.founder_seats_taken/);
    expect(sql).toMatch(/security definer/);
    expect(sql).toMatch(/grant execute on function public\.founder_seats_taken/);
    expect(sql).toMatch(/is_founder is true/);
  });
});
