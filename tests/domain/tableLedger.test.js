/**
 * tableLedger.test.js — R-1 THE SESSION LEDGER: the finite-semantics SCHEMA WALL.
 *
 * These pins enforce the owner's binding law: every table effect is a TYPED
 * record from a CLOSED vocabulary with a BOUNDED magnitude, and free text is
 * FLAVOR ONLY — it can never reach a mechanical field. The clerk is a bucketing
 * clerk, never a writer: its output must pass this same wall.
 */
import { describe, test, expect } from 'vitest';
import {
  TABLE_EVENT_KINDS, MAGNITUDE_BANDS, MAGNITUDE_BAND_IDS, OBLIGATION_TYPES,
  TABLE_EVENT_SOURCE, KIND_SPEC,
  validateTableEvent, buildTableEffect, reviewClerkProposals,
} from '../../src/domain/tableLedger.js';

describe('the closed vocabulary + bounded bands', () => {
  test('kinds and bands are frozen closed sets', () => {
    expect(Object.isFrozen(TABLE_EVENT_KINDS)).toBe(true);
    expect(Object.isFrozen(MAGNITUDE_BANDS)).toBe(true);
    expect([...TABLE_EVENT_KINDS].sort()).toEqual(['exposure', 'incident', 'obligation', 'stressor-relief']);
    expect(MAGNITUDE_BAND_IDS).toEqual(['minor', 'moderate', 'major']);
    // Every band resolves to a clamped 0..1 severity.
    for (const id of MAGNITUDE_BAND_IDS) {
      expect(MAGNITUDE_BANDS[id]).toBeGreaterThan(0);
      expect(MAGNITUDE_BANDS[id]).toBeLessThanOrEqual(1);
    }
  });

  test('rejects an off-vocabulary kind (the wall)', () => {
    const r = validateTableEvent({ kind: 'nuke-the-realm', magnitude: 'major', targets: { ref: 'x' } });
    expect(r.ok).toBe(false);
    expect(r.record).toBeNull();
    expect(r.errors.join(' ')).toMatch(/kind must be one of/);
  });

  test('magnitude must be a NAMED band, never a raw number', () => {
    // A raw number is refused — magnitude is finite by construction.
    expect(validateTableEvent({ kind: 'obligation', magnitude: 0.97, targets: { ref: 'debt' } }).ok).toBe(false);
    expect(validateTableEvent({ kind: 'obligation', magnitude: 'catastrophic', targets: { ref: 'debt' } }).ok).toBe(false);
    const ok = validateTableEvent({ kind: 'obligation', magnitude: 'major', targets: { ref: 'debt' } });
    expect(ok.ok).toBe(true);
    expect(ok.record.severity).toBe(MAGNITUDE_BANDS.major);
  });

  test('mechanical kinds require a target; obligation target is a closed vocab', () => {
    expect(validateTableEvent({ kind: 'stressor-relief', magnitude: 'minor', targets: {} }).ok).toBe(false);
    expect(validateTableEvent({ kind: 'obligation', magnitude: 'minor', targets: { ref: 'made-up-burden' } }).ok).toBe(false);
    for (const t of OBLIGATION_TYPES) {
      expect(validateTableEvent({ kind: 'obligation', magnitude: 'minor', targets: { ref: t } }).ok).toBe(true);
    }
  });

  test('incident needs no target or magnitude (pure flavor)', () => {
    const r = validateTableEvent({ kind: 'incident', flavor: 'The party feasted in the longhall.' });
    expect(r.ok).toBe(true);
    expect(r.record.severity).toBeNull();
    expect(r.record.flavor).toBe('The party feasted in the longhall.');
  });
});

describe('FREE TEXT IS FLAVOR ONLY — the source-scan on the built directive', () => {
  // A flavor string planted with words that also name mechanical concepts. The
  // built directive's MECHANICAL surface must not contain it anywhere.
  const FLAVOR = 'the party BURNED the granary, INSULTED the baron, and SEVERITY be damned';

  test('a mechanical kind keeps flavor OFF every mechanical field', () => {
    const { record } = validateTableEvent({
      kind: 'obligation', magnitude: 'major', targets: { ref: 'debt', label: 'debt' }, flavor: FLAVOR,
    });
    const built = buildTableEffect(record);
    expect(built.dispatch).toBe('applyEvent');
    // The verbatim flavor rides tableFlavor, and NOWHERE else.
    expect(built.event.tableFlavor).toBe(FLAVOR);
    expect(built.event.source).toBe(TABLE_EVENT_SOURCE);
    // Mechanical surface: targetId + payload. Serialize and assert the flavor is absent.
    const mechanical = JSON.stringify({ type: built.event.type, targetId: built.event.targetId, payload: built.event.payload });
    expect(mechanical).not.toContain('BURNED');
    expect(mechanical).not.toContain('INSULTED');
    expect(mechanical).not.toContain(FLAVOR);
    // The payload's numeric severity is a banded value, not derived from text.
    expect(built.event.payload.severity).toBe(MAGNITUDE_BANDS.major);
  });

  test('an incident stores the DM words as a flavor line, still tagged source:table', () => {
    const { record } = validateTableEvent({ kind: 'incident', flavor: FLAVOR });
    const built = buildTableEffect(record);
    expect(built.dispatch).toBe('flavor');
    expect(built.entry.source).toBe(TABLE_EVENT_SOURCE);
    expect(built.entry.narrativeSummary).toBe(FLAVOR);
    // A flavor line has NO mechanical payload at all.
    expect(built.entry.payload).toBeUndefined();
  });

  test('every built directive carries source:table', () => {
    for (const kind of TABLE_EVENT_KINDS) {
      const spec = KIND_SPEC[kind];
      const input = {
        kind, flavor: 'x',
        ...(spec.needsMagnitude ? { magnitude: 'minor' } : {}),
        ...(spec.needsTarget ? { targets: { ref: kind === 'obligation' ? 'debt' : 'famine' } } : {}),
      };
      const { ok, record } = validateTableEvent(input);
      expect(ok).toBe(true);
      const built = buildTableEffect(record);
      const stamped = built.dispatch === 'flavor' ? built.entry.source : built.event.source;
      expect(stamped).toBe(TABLE_EVENT_SOURCE);
    }
  });
});

describe('the clerk is a bucketing clerk, never a writer', () => {
  test('reviewClerkProposals routes hallucinated buckets to rejected, valid ones to accepted', () => {
    const raw = [
      { kind: 'obligation', magnitude: 'moderate', targets: { ref: 'debt' }, flavor: 'a loan came due' },   // valid
      { kind: 'mind-control', magnitude: 'major', targets: { ref: 'everyone' } },                            // off-vocab
      { kind: 'stressor-relief', magnitude: 9000, targets: { ref: 'famine' } },                              // raw number
      { kind: 'exposure', magnitude: 'minor', targets: { ref: 'npc.aldis' }, flavor: 'unmasked' },           // valid
    ];
    const { accepted, rejected } = reviewClerkProposals(raw);
    expect(accepted.map(a => a.index)).toEqual([0, 3]);
    expect(rejected.map(r => r.index)).toEqual([1, 2]);
    // Accepted proposals become VALIDATED, typed records — never the raw text.
    for (const a of accepted) {
      expect(TABLE_EVENT_KINDS).toContain(a.record.kind);
    }
  });

  test('a non-array clerk output is safely empty', () => {
    expect(reviewClerkProposals(null)).toEqual({ accepted: [], rejected: [] });
  });
});
