/**
 * campaignImport.test.js — V-17 THE CAMPAIGN IMPORT: the resumable session pins.
 *
 * The per-event confirmation gate (nothing commits unconfirmed), resumability
 * (deterministic from the same notes), and that only confirmed + valid rows ever
 * become records.
 */
import { describe, it, expect } from 'vitest';
import {
  createImportSession,
  addBlankRow,
  updateRow,
  setRowConfirmed,
  setRowSkipped,
  confirmedRecords,
  importSummary,
} from '../../src/lib/campaignImport.js';

const NOTES = 'A famine struck Ashford.\nThe party saved the granary.\nThe baron swore an oath.';

describe('createImportSession', () => {
  it('proposes one row per segment, all unconfirmed, tick defaulted', () => {
    const s = createImportSession(NOTES, { defaultTick: 12 });
    expect(s.rows).toHaveLength(3);
    expect(s.rows.every(r => r.confirmed === false && r.skipped === false)).toBe(true);
    expect(s.rows.every(r => r.tick === 12)).toBe(true);
    expect(s.rows.map(r => r.kind)).toEqual(['incident', 'stressor-relief', 'obligation']);
    expect(s.raw).toBe(NOTES);
  });
  it('is resumable: identical notes ⇒ identical session', () => {
    expect(createImportSession(NOTES, { defaultTick: 3 })).toEqual(createImportSession(NOTES, { defaultTick: 3 }));
  });
  it('empty notes ⇒ empty session', () => {
    expect(createImportSession('').rows).toEqual([]);
  });
});

describe('the per-event confirmation gate', () => {
  it('confirmedRecords is EMPTY until a row is confirmed', () => {
    const s = createImportSession(NOTES);
    expect(confirmedRecords(s)).toEqual([]);
    expect(importSummary(s)).toMatchObject({ total: 3, confirmed: 0, pending: 3, ready: false });
  });
  it('confirming one row yields exactly one record, tagged source:table', () => {
    let s = createImportSession(NOTES, { defaultTick: 5 });
    s = setRowConfirmed(s, 1, true); // "saved the granary" → stressor-relief
    const recs = confirmedRecords(s);
    expect(recs).toHaveLength(1);
    expect(recs[0].kind).toBe('stressor-relief');
    expect(recs[0].source).toBe('table');
    expect(recs[0].tick).toBe(5);
    expect(recs[0].flavor).toBe('The party saved the granary.');
    expect(importSummary(s)).toMatchObject({ confirmed: 1, ready: true });
  });
  it('a skipped row never commits even if it was confirmed first', () => {
    let s = createImportSession(NOTES);
    s = setRowConfirmed(s, 0, true);
    expect(confirmedRecords(s)).toHaveLength(1);
    s = setRowSkipped(s, 0, true);
    expect(confirmedRecords(s)).toHaveLength(0);
    expect(importSummary(s)).toMatchObject({ skipped: 1, confirmed: 0 });
  });
  it('a row with an inadmissible kind CANNOT be confirmed (gate refuses)', () => {
    let s = createImportSession(NOTES);
    s = updateRow(s, 0, { kind: 'coup' }); // out of vocabulary
    s = setRowConfirmed(s, 0, true);
    expect(s.rows.find(r => r.index === 0).confirmed).toBe(false);
    expect(confirmedRecords(s)).toHaveLength(0);
  });
});

describe('manual override path (no clerk trust required)', () => {
  it('the DM can re-bucket, re-band, re-tick, and assign targets by hand', () => {
    let s = createImportSession('Something ambiguous happened.', { defaultTick: 0 });
    // Clerk was unsure; the DM assigns everything manually.
    s = updateRow(s, 0, { kind: 'exposure', band: 'major', tick: 40, settlementIds: ['ashford'] });
    s = setRowConfirmed(s, 0, true);
    const recs = confirmedRecords(s);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ kind: 'exposure', band: 'major', tick: 40 });
    expect(recs[0].targets.settlementIds).toEqual(['ashford']);
  });
});

describe('the fully-manual path (addBlankRow — no notes, no clerk)', () => {
  it('appends a blank row with a fresh index that the DM authors by hand', () => {
    let s = createImportSession('', { defaultTick: 7 });
    expect(s.rows).toEqual([]);
    s = addBlankRow(s);
    expect(s.rows).toHaveLength(1);
    expect(s.rows[0]).toMatchObject({ index: 0, flavor: '', kind: 'incident', band: 'moderate', tick: 7, confirmed: false });
    s = addBlankRow(s);
    expect(s.rows.map(r => r.index)).toEqual([0, 1]); // fresh, non-colliding indices
  });
  it('a hand-authored blank row commits once filled and confirmed', () => {
    let s = addBlankRow(createImportSession(''), { tick: 2 });
    s = updateRow(s, 0, { kind: 'obligation', band: 'moderate', flavor: 'the crown owes the guild a charter' });
    s = setRowConfirmed(s, 0, true);
    const recs = confirmedRecords(s);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ kind: 'obligation', tick: 2, source: 'table' });
  });
});

describe('abort semantics', () => {
  it('nothing is produced from a session that was never committed (caller discards it)', () => {
    // The session is a plain value; dropping the reference is the abort. This pin
    // documents that confirmedRecords is a PURE read — it mutates nothing, so an
    // abandoned session leaves no residue.
    const s = createImportSession(NOTES);
    const before = JSON.stringify(s);
    confirmedRecords(s);
    importSummary(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});
