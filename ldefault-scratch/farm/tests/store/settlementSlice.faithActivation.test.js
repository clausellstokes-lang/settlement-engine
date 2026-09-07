/**
 * settlementSlice faith activation — Phase 4 W-F6, THE PREMIUM GATE.
 *
 * Pins the STORE-side half of the latent-pantheon activation seam: on save-open
 * (hydrateFromSave), a PREMIUM (or elevated) account turns the key —
 * activateLatentPantheon copies the seed's latent patron + cults into the LIVE
 * embeds — while FREE / ANON accounts load the save verbatim (faith latent +
 * private). Idempotent, tier-gated, and conservative (an explicit deity is never
 * clobbered; a deity-free save is untouched).
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

function makeStore(tier = 'premium', { elevated = false } = {}) {
  return create(immer((set, get) => ({
    auth: { tier },
    isElevated: () => elevated,
    setPurchaseModalOpen: () => {},
    ...createSettlementSlice(set, get),
  })));
}

const LATENT = Object.freeze({
  patron: { _deityRef: 'deity:core:sun', name: 'Sun', alignmentAxis: 'good', temperamentAxis: 'peaceful', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' },
  cults: [{ _deityRef: 'deity:core:ash', name: 'Ash', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'cult', lawAxis: 'chaotic', domain: 'death' }],
});

function baseSettlement(configExtra = {}) {
  return {
    tier: 'town', name: 'Testford', population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road', ...configExtra },
    institutions: [], economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] }, npcs: [], activeConditions: [],
  };
}

function saveWith(configExtra) {
  return { id: 'save1', settlement: baseSettlement(configExtra) };
}

describe('settlementSlice faith activation — the premium gate on save-open', () => {
  test('PREMIUM: opening a save with a latent pantheon activates the live embeds', () => {
    const store = makeStore('premium');
    store.getState().hydrateFromSave(saveWith({ latentPantheon: LATENT }));
    const cfg = store.getState().settlement.config;
    expect(cfg.primaryDeityRef).toBe('deity:core:sun');
    expect(cfg.primaryDeitySnapshot).toEqual(LATENT.patron);
    expect(cfg.cultDeitySnapshots).toEqual(LATENT.cults);
    // The latent record is PRESERVED (the seed's truth; regeneration re-bakes it).
    expect(cfg.latentPantheon).toEqual(LATENT);
  });

  test('ELEVATED (developer/admin) also activates', () => {
    const store = makeStore('free', { elevated: true });
    store.getState().hydrateFromSave(saveWith({ latentPantheon: LATENT }));
    expect(store.getState().settlement.config.primaryDeitySnapshot).toEqual(LATENT.patron);
  });

  test('FREE: opening the SAME save never activates — faith stays latent + private', () => {
    const store = makeStore('free');
    store.getState().hydrateFromSave(saveWith({ latentPantheon: LATENT }));
    const cfg = store.getState().settlement.config;
    expect('primaryDeitySnapshot' in cfg).toBe(false);
    expect('cultDeitySnapshots' in cfg).toBe(false);
    // The latent record is untouched (it is stripped from public projections, not
    // from the owner's own save).
    expect(cfg.latentPantheon).toEqual(LATENT);
  });

  test('ANON: never activates', () => {
    const store = makeStore('anon');
    store.getState().hydrateFromSave(saveWith({ latentPantheon: LATENT }));
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
  });

  test('CONSERVATIVE: an explicit live patron is never clobbered by the latent seed', () => {
    const explicit = { _deityRef: 'custom:vael', name: 'Vael', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major', lawAxis: 'neutral', domain: 'war' };
    const store = makeStore('premium');
    store.getState().hydrateFromSave(saveWith({ latentPantheon: LATENT, primaryDeitySnapshot: explicit }));
    // A DM assignment outranks the latent seed — activation is an idempotent no-op.
    expect(store.getState().settlement.config.primaryDeitySnapshot).toEqual(explicit);
    expect(store.getState().settlement.config.primaryDeityRef).toBeUndefined();
  });

  test('DEITY-FREE: a save with no latent pantheon is untouched for premium (faith:none)', () => {
    const store = makeStore('premium');
    store.getState().hydrateFromSave(saveWith({}));
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
    expect('latentPantheon' in store.getState().settlement.config).toBe(false);
  });
});
