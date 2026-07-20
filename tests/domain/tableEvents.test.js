/**
 * tableEvents.test.js — V-17 THE CAMPAIGN IMPORT schema wall + bucketing clerk pins.
 *
 * The finite-semantics law made testable: the vocabulary is closed, magnitude is
 * bounded and band-derived only, the clerk is deterministic, and no free text ever
 * reaches a mechanical field.
 */
import { describe, it, expect } from 'vitest';
import {
  TABLE_EVENT_KINDS,
  MAGNITUDE_BANDS,
  TABLE_EVENT_SOURCE,
  isTableEventKind,
  isMagnitudeBand,
  bandMagnitude,
  significanceForBand,
  validateTableEvent,
  buildTableEvent,
  segmentNotes,
  classifySegment,
  proposeBuckets,
  tableEventToNewsEntry,
  sortRecordsForReview,
} from '../../src/domain/tableEvents.js';

describe('the closed vocabulary (V-F parity)', () => {
  it('is exactly the four mirrored kinds, frozen', () => {
    expect([...TABLE_EVENT_KINDS]).toEqual(['incident', 'stressor-relief', 'obligation', 'exposure']);
    expect(Object.isFrozen(TABLE_EVENT_KINDS)).toBe(true);
  });
  it('is exactly the three named bands, frozen', () => {
    expect([...MAGNITUDE_BANDS]).toEqual(['minor', 'moderate', 'major']);
    expect(Object.isFrozen(MAGNITUDE_BANDS)).toBe(true);
  });
  it('provenance stamp is the literal table source (the soak excludes it)', () => {
    expect(TABLE_EVENT_SOURCE).toBe('table');
  });
  it('kind/band guards reject anything outside the vocabulary', () => {
    expect(isTableEventKind('incident')).toBe(true);
    expect(isTableEventKind('coup')).toBe(false);
    expect(isTableEventKind('')).toBe(false);
    expect(isMagnitudeBand('major')).toBe(true);
    expect(isMagnitudeBand('apocalyptic')).toBe(false);
  });
});

describe('bounded magnitude — bands only, never raw numbers', () => {
  it('every band maps into severity range [0,1], monotonic', () => {
    const vals = MAGNITUDE_BANDS.map(bandMagnitude);
    for (const v of vals) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1); }
    expect(bandMagnitude('minor')).toBeLessThan(bandMagnitude('moderate'));
    expect(bandMagnitude('moderate')).toBeLessThan(bandMagnitude('major'));
  });
  it('significance tier: only major band is major news', () => {
    expect(significanceForBand('major')).toBe('major');
    expect(significanceForBand('moderate')).toBe('notable');
    expect(significanceForBand('minor')).toBe('notable');
  });
});

describe('the schema wall (validateTableEvent)', () => {
  const good = { kind: 'incident', band: 'moderate', tick: 3, targets: { settlementIds: ['a'] }, flavor: 'the well ran dry' };
  it('admits a well-formed typed event', () => {
    expect(validateTableEvent(good)).toEqual({ ok: true, errors: [] });
  });
  it('rejects an out-of-vocabulary kind', () => {
    const r = validateTableEvent({ ...good, kind: 'coup' });
    expect(r.ok).toBe(false);
    expect(r.errors.join(' ')).toMatch(/kind/i);
  });
  it('rejects an out-of-vocabulary band', () => {
    expect(validateTableEvent({ ...good, band: 'nuclear' }).ok).toBe(false);
  });
  it('rejects a non-integer / negative tick', () => {
    expect(validateTableEvent({ ...good, tick: -1 }).ok).toBe(false);
    expect(validateTableEvent({ ...good, tick: 2.5 }).ok).toBe(false);
    expect(validateTableEvent({ ...good, tick: 'soon' }).ok).toBe(false);
  });
  it('rejects malformed targets but accepts absent targets', () => {
    expect(validateTableEvent({ ...good, targets: { settlementIds: 'a' } }).ok).toBe(false);
    expect(validateTableEvent({ kind: 'incident', band: 'minor', tick: 0 }).ok).toBe(true);
  });
  it('flavor may be any string (it is FLAVOR) but not a non-string', () => {
    expect(validateTableEvent({ ...good, flavor: 'anything at all; <script>' }).ok).toBe(true);
    expect(validateTableEvent({ ...good, flavor: 42 }).ok).toBe(false);
  });
  it('never throws on garbage', () => {
    expect(validateTableEvent(null).ok).toBe(false);
    expect(validateTableEvent(undefined).ok).toBe(false);
    expect(validateTableEvent(7).ok).toBe(false);
  });
});

describe('buildTableEvent — the typed record', () => {
  it('derives magnitude from the band ONLY, stamps source:table, deterministic id', () => {
    const rec = buildTableEvent({ kind: 'stressor-relief', band: 'major', tick: 5, targets: { settlementIds: ['ashford'] }, flavor: 'the party saved the granary', index: 0 });
    expect(rec.source).toBe('table');
    expect(rec.magnitude).toBe(bandMagnitude('major'));
    expect(rec.tick).toBe(5);
    expect(rec.flavor).toBe('the party saved the granary');
    expect(rec.id).toMatch(/^table\.5\.stressor-relief\./);
    const rec2 = buildTableEvent({ kind: 'stressor-relief', band: 'major', tick: 5, targets: { settlementIds: ['ashford'] }, flavor: 'DIFFERENT WORDS', index: 0 });
    // Same mechanical inputs ⇒ same id; flavor does not perturb the id (flavor is not mechanical).
    expect(rec2.id).toBe(rec.id);
  });
  it('freezes the record and its targets', () => {
    const rec = buildTableEvent({ kind: 'incident', band: 'minor', tick: 0 });
    expect(Object.isFrozen(rec)).toBe(true);
    expect(Object.isFrozen(rec.targets)).toBe(true);
    expect(rec.targets.settlementIds).toEqual([]);
  });
});

describe('the bucketing clerk — deterministic keyword classification', () => {
  it('segments notes by line and sentence, stripping bullets, order-preserving', () => {
    const segs = segmentNotes('- The famine struck Ashford. The party saved the granary.\n* A lord swore an oath.');
    expect(segs).toEqual([
      'The famine struck Ashford.',
      'The party saved the granary.',
      'A lord swore an oath.',
    ]);
    expect(segmentNotes('')).toEqual([]);
    expect(segmentNotes('   ')).toEqual([]);
  });
  it('classifies each vocabulary into its kind', () => {
    expect(classifySegment('a great famine and plague struck', 0).kind).toBe('incident');
    expect(classifySegment('the party rescued the town and the granary was saved', 0).kind).toBe('stressor-relief');
    expect(classifySegment('the baron swore a solemn oath and a debt was owed', 0).kind).toBe('obligation');
    expect(classifySegment('the steward was exposed as corrupt, his lie uncovered', 0).kind).toBe('exposure');
  });
  it('reads magnitude hints; absence ⇒ moderate', () => {
    expect(classifySegment('the entire realm was devastated by famine', 0).band).toBe('major');
    expect(classifySegment('a minor fire, briefly', 0).band).toBe('minor');
    expect(classifySegment('a fire in the market', 0).band).toBe('moderate');
  });
  it('flags a no-match segment as not confident (defaults to incident/moderate)', () => {
    const p = classifySegment('the weather was pleasant that spring', 0);
    expect(p.confident).toBe(false);
    expect(p.kind).toBe('incident');
    expect(p.band).toBe('moderate');
  });
  it('NEVER extracts targets from free text — the human assigns them', () => {
    const p = classifySegment('the famine struck the great city of Ashford, killing thousands', 0);
    expect(p.targets).toEqual({ settlementIds: [], npcNames: [] });
  });
  it('is deterministic: identical notes ⇒ identical proposals', () => {
    const notes = 'The famine struck.\nThe granary was saved.\nA debt was owed.';
    expect(proposeBuckets(notes)).toEqual(proposeBuckets(notes));
    expect(proposeBuckets(notes).map(p => p.kind)).toEqual(['incident', 'stressor-relief', 'obligation']);
  });
});

describe('tableEventToNewsEntry — history projection, flavor stays display-only', () => {
  it('places flavor as the SUMMARY, composes the headline from typed fields ONLY', () => {
    const rec = buildTableEvent({ kind: 'incident', band: 'major', tick: 7, targets: { settlementIds: ['ashford'] }, flavor: 'the harvest failed and winter came early' });
    const entry = tableEventToNewsEntry(rec);
    expect(entry.source).toBe('table');
    expect(entry.summary).toBe('the harvest failed and winter came early'); // verbatim flavor
    expect(entry.headline).not.toContain('harvest'); // headline is typed-only, never the free text
    expect(entry.headline).toMatch(/Incident/);
    expect(entry.significance).toBe('major');
    expect(entry.impactKind).toBe('table_incident');
    expect(entry.tags).toEqual(['table', 'incident', 'major']);
    expect(entry.settlementIds).toEqual(['ashford']);
  });
});

describe('sortRecordsForReview', () => {
  it('orders newest tick first, id tie-break, pure', () => {
    const a = buildTableEvent({ kind: 'incident', band: 'minor', tick: 1, index: 0 });
    const b = buildTableEvent({ kind: 'incident', band: 'minor', tick: 9, index: 1 });
    const sorted = sortRecordsForReview([a, b]);
    expect(sorted.map(r => r.tick)).toEqual([9, 1]);
  });
});
