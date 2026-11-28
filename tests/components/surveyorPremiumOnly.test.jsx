/** @vitest-environment jsdom */
/**
 * surveyorPremiumOnly.test.jsx — THE SURVEYOR IS PREMIUM ONLY (the owner, 2026-11-09:
 * "Premium only"; lane TIER-PARITY-FIX). The door's hook and the account's hook, driven
 * with the server's RPC answering FALSE (no grant row): a Cartographer premium and a
 * Founder reach the Surveyor, staff reach it, a free account does not. Red at the base: a
 * bare Cartographer was refused on both surfaces (the census's §4(d)).
 */
import { describe, expect, test, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ state: { auth: {} }, rpc: vi.fn(async () => ({ data: false, error: null })) }));
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(mocks.state) }));
vi.mock('../../src/lib/supabase.js', () => ({ supabase: { rpc: (...a) => mocks.rpc(...a) }, isConfigured: true }));

import { useSurveyorEntitled } from '../../src/components/surveyor/useSurveyorEntitled.js';
import { useAccountSurveyorGate } from '../../src/components/account/useAccountSurveyorGate.js';

const CASES = [
  ['a Cartographer premium', { tier: 'premium', isFounder: false, role: 'user' }, true],
  ['a Founder (lifetime premium)', { tier: 'premium', isFounder: true, role: 'user' }, true],
  ['staff on a free tier field', { tier: 'free', isFounder: false, role: 'developer' }, true],
  ['a free account with no grant', { tier: 'free', isFounder: false, role: 'user' }, false],
];

describe('the Surveyor door and the AI & keys surface: premium only, the server answering no grant', () => {
  CASES.forEach(([who, auth, expected], i) => {
    test(`${who}: ${expected ? 'admitted' : 'refused'} on both surfaces`, async () => {
      mocks.state.auth = { ...auth, user: { id: `u${i}` } };
      const door = renderHook(() => useSurveyorEntitled());
      const account = renderHook(() => useAccountSurveyorGate());
      // the RPC resolved (the fetched bit settled) before the verdict is read
      await waitFor(() => expect(mocks.rpc).toHaveBeenCalled());
      await waitFor(() => {
        expect(door.result.current, `door: ${who}`).toBe(expected);
        expect(account.result.current, `account: ${who}`).toBe(expected);
      });
    });
  });
});
