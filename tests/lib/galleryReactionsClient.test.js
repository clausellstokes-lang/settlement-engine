/**
 * galleryReactionsClient.test.js — the client seam for structured reactions
 * (GALLERY-2 phase 2). Stubs supabase (the tests/lib/gallery.test.js harness
 * idiom) and pins:
 *   • toggleGalleryReaction — RPC dispatch shape, client-side vocabulary wall,
 *     full-state normalization of the RPC rows.
 *   • fetchGalleryReactionState — normalization + fail-quiet on error/missing id.
 *   • sanitizeReactionState — key allowlist (unknown keys DROP), count clamping,
 *     both accepted shapes (RPC rows and the 148 tile-row jsonb counts object).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
  isConfigured: true,
}));

import { supabase } from '../../src/lib/supabase.js';
import {
  toggleGalleryReaction,
  fetchGalleryReactionState,
  sanitizeReactionState,
} from '../../src/lib/gallery.js';
import { REACTION_KEYS } from '../../src/data/galleryReactionVocab.js';

afterEach(() => vi.clearAllMocks());

describe('toggleGalleryReaction', () => {
  it('dispatches toggle_gallery_reaction with the settlement id + key and returns the normalized full state', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [
        { reaction_key: 'worth_walking', reaction_count: 3, mine: true },
        { reaction_key: 'map_speaks', reaction_count: 1, mine: false },
      ],
      error: null,
    });
    const state = await toggleGalleryReaction('settlement-uuid', 'worth_walking');
    expect(supabase.rpc).toHaveBeenCalledWith('toggle_gallery_reaction', {
      target_settlement_id: 'settlement-uuid',
      reaction: 'worth_walking',
    });
    expect(state).toEqual({
      counts: { worth_walking: 3, map_speaks: 1 },
      mine: { worth_walking: true },
    });
  });

  it('rejects an unknown reaction key CLIENT-side (never reaches the RPC)', async () => {
    await expect(toggleGalleryReaction('settlement-uuid', 'free_text')).rejects.toThrow(/unknown reaction/i);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('surfaces the server error message', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'You are reacting too quickly' } });
    await expect(toggleGalleryReaction('settlement-uuid', 'map_speaks')).rejects.toThrow(/reacting too quickly/i);
  });
});

describe('fetchGalleryReactionState', () => {
  it('normalizes RPC rows into { counts, mine }', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{ reaction_key: 'true_to_life', reaction_count: 7, mine: true }],
      error: null,
    });
    expect(await fetchGalleryReactionState('id-1')).toEqual({
      counts: { true_to_life: 7 },
      mine: { true_to_life: true },
    });
    expect(supabase.rpc).toHaveBeenCalledWith('get_gallery_reaction_state', { target_settlement_id: 'id-1' });
  });

  it('fails quiet (empty state) on error or missing id', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    expect(await fetchGalleryReactionState('id-1')).toEqual({ counts: {}, mine: {} });
    expect(await fetchGalleryReactionState(null)).toEqual({ counts: {}, mine: {} });
  });
});

describe('sanitizeReactionState (defense in depth)', () => {
  it('drops unknown keys from RPC rows (bounded vocabulary)', () => {
    const state = sanitizeReactionState([
      { reaction_key: 'worth_walking', reaction_count: 2, mine: true },
      { reaction_key: 'dm_notes_leak', reaction_count: 99, mine: true },
    ]);
    expect(state.counts).toEqual({ worth_walking: 2 });
    expect(state.mine).toEqual({ worth_walking: true });
  });

  it('clamps malformed counts to non-negative integers', () => {
    const state = sanitizeReactionState([
      { reaction_key: 'map_speaks', reaction_count: -5, mine: false },
      { reaction_key: 'finely_wrought', reaction_count: '4.9', mine: false },
    ]);
    expect(state.counts.map_speaks).toBe(0);
    expect(state.counts.finely_wrought).toBe(4);
  });

  it('accepts the tile-row jsonb counts object (148 shape), allowlisted + zero-dropped', () => {
    const state = sanitizeReactionState({ steeped_history: 5, bogus_key: 3, run_campaign: 0 });
    expect(state.counts).toEqual({ steeped_history: 5 });
    expect(state.mine).toEqual({});
  });

  it('yields the empty state for null / non-object input', () => {
    expect(sanitizeReactionState(null)).toEqual({ counts: {}, mine: {} });
    expect(sanitizeReactionState('nope')).toEqual({ counts: {}, mine: {} });
  });

  it('covers every vocab key when all are present (no silent truncation)', () => {
    const rows = REACTION_KEYS.map(key => ({ reaction_key: key, reaction_count: 1, mine: false }));
    expect(Object.keys(sanitizeReactionState(rows).counts).sort()).toEqual([...REACTION_KEYS].sort());
  });
});
