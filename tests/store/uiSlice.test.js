/**
 * uiSlice.test.js — P142 / D-6 contract over the transient UI-prefs bag.
 *
 * Pins the small store surface the Table View (and any future transient
 * pref) rides on:
 *   • userPrefs.tableViewOpen defaults to false (closed on every load).
 *   • setUserPref(key, value) writes through, including brand-new keys.
 *   • getUserPref reads the same value back.
 *
 * Built from createUiSlice alone — the slice has no cross-slice reads, so a
 * one-slice store is the whole contract.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createUiSlice, PRODUCT_PREF_DEFAULTS } from '../../src/store/uiSlice.js';

const makeStore = () => create(immer((...a) => ({ ...createUiSlice(...a) })));

describe('uiSlice — transient UI prefs', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  it('defaults tableViewOpen to false', () => {
    expect(store.getState().userPrefs.tableViewOpen).toBe(false);
  });

  it('setUserPref writes a known key through', () => {
    store.getState().setUserPref('tableViewOpen', true);
    expect(store.getState().userPrefs.tableViewOpen).toBe(true);
    store.getState().setUserPref('tableViewOpen', false);
    expect(store.getState().userPrefs.tableViewOpen).toBe(false);
  });

  it('setUserPref creates a previously-unknown key', () => {
    store.getState().setUserPref('somethingNew', 42);
    expect(store.getState().userPrefs.somethingNew).toBe(42);
  });

  it('getUserPref reads the same value back', () => {
    store.getState().setUserPref('tableViewOpen', true);
    expect(store.getState().getUserPref('tableViewOpen')).toBe(true);
    expect(store.getState().getUserPref('missing')).toBeUndefined();
  });
});

describe('uiSlice — product preferences (Account → Product Preferences)', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  it('seeds productPrefs from the defaults', () => {
    expect(store.getState().productPrefs).toEqual(PRODUCT_PREF_DEFAULTS);
  });

  it('setProductPref writes a known key through', () => {
    store.getState().setProductPref('pdfStyle', 'parchment');
    expect(store.getState().productPrefs.pdfStyle).toBe('parchment');
    store.getState().setProductPref('aiPolishDefault', true);
    expect(store.getState().productPrefs.aiPolishDefault).toBe(true);
  });

  it('setProductPref ignores unknown keys (no bogus prefs)', () => {
    store.getState().setProductPref('totallyMadeUp', 'nope');
    expect(store.getState().productPrefs.totallyMadeUp).toBeUndefined();
  });

  it('getProductPref reads through and falls back to the default', () => {
    expect(store.getState().getProductPref('pdfStyle')).toBe('classic');
    store.getState().setProductPref('pdfStyle', 'compact');
    expect(store.getState().getProductPref('pdfStyle')).toBe('compact');
    // unknown key → its default (here undefined, since not a real pref)
    expect(store.getState().getProductPref('galleryPublicDefault')).toBe(false);
  });
});
