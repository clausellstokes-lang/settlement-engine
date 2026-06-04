/**
 * uiSlice.test.js - P142 / D-6 contract over the transient UI-prefs bag.
 *
 * Pins the small store surface the Table View (and any future transient
 * pref) rides on:
 *   • userPrefs.tableViewOpen defaults to false (closed on every load).
 *   • setUserPref(key, value) writes through, including brand-new keys.
 *   • getUserPref reads the same value back.
 *
 * Built from createUiSlice alone - the slice has no cross-slice reads, so a
 * one-slice store is the whole contract.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createUiSlice } from '../../src/store/uiSlice.js';

const makeStore = () => create(immer((...a) => ({ ...createUiSlice(...a) })));

describe('uiSlice - transient UI prefs', () => {
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
