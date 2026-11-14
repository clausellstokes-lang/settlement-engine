/**
 * R2-CODE-B-SIDE item 7b — THE FAITH READING TAKES A HOUSE BY ITS NATIVE IDENTITY (the chair's ruling, 2026-11-13
 * 23:15, from the data lane's customContentPresentationClaims finding): never by a name a user can type or change.
 * A renamed native church is still a church (its catalogue id says so); a custom house named with a church word is
 * not one (it carries its own provenance and no catalogue id).
 */
import { describe, expect, test } from 'vitest';
import { faithReadingOf } from '../../src/domain/dossier/faithReading.js';

describe('a house is a church by what it is, not by what it is called', () => {
  test('a custom house named with a church word does not move the reading', () => {
    const custom = { name: "Stormwatch Cathedral Hospital", isCustom: true, customDefinitionId: 'definition:institutions:probe', customDefinitionCategory: 'institutions' };
    expect(faithReadingOf({ institutions: [custom] })).toMatchObject({ hasChurch: false, accessOnly: false, shrine: false });
    const access = { name: 'Access to parish church (our chapel)', isCustom: true, customDefinitionId: 'definition:institutions:probe2' };
    expect(faithReadingOf({ institutions: [access] })).toMatchObject({ hasChurch: false, accessOnly: false });
  });
  test('a native church the user renamed is still a church', () => {
    const renamed = { name: 'Old Saint Brannoc', catalogId: 'parish_church' };
    expect(faithReadingOf({ institutions: [renamed] })).toMatchObject({ hasChurch: true, churchWords: 'a parish church' });
  });
  test('a renamed road to a neighbour\'s church is still that road', () => {
    expect(faithReadingOf({ institutions: [{ name: 'The Pilgrim Path', catalogId: 'access_to_parish_church' }] })).toMatchObject({ hasChurch: false, accessOnly: true });
  });
  test('the guard: an unstamped legacy house is read by its name, as before', () => {
    expect(faithReadingOf({ institutions: [{ name: 'Parish church' }] })).toMatchObject({ hasChurch: true });
  });
});
