/**
 * editFingerprint.test.js — the privacy guarantee for the edit research plane.
 * Edits are the highest prose-risk signal (rename payloads, prose bodies,
 * cascade summary lines), so the canary feeds all of those and proves none reach
 * an emitted row.
 */

import { describe, it, expect } from 'vitest';
import { extractEditRows, extractEditCascade } from '../../src/lib/editFingerprint.js';
import { stableStringify } from '../../src/lib/structuralFingerprint.js';

const SENSITIVE = [
  'Seraphina Voss',                          // rename newName
  'poisoned the mayor',                      // prose value
  'The cascade will ripple to the spymaster', // cascade summaryLine
  'Thieves Guild',                           // institution name payload
];

const active = [
  { id: 'e0', kind: 'rename-npc', payload: { npcIndex: 0, newName: 'Seraphina Voss' } },
  { id: 'e1', kind: 'edit-prose', payload: { field: 'history', value: 'poisoned the mayor' } },
  { id: 'e2', kind: 'add-institution', payload: { name: 'Thieves Guild' } },
  { id: 'e3', kind: 'bogus-kind', payload: { secret: 'poisoned the mayor' } }, // not in EDIT_KINDS → dropped
];

const cascade = {
  summaryLines: ['The cascade will ripple to the spymaster'],
  downstreamCounts: { npcs: 3, hooks: 1, factions: 2, linkedSaves: 0 },
  narrativeImpact: 'regenerate-needed',
};

function assertNoLeak(obj) {
  const json = stableStringify(obj);
  for (const s of SENSITIVE) expect(json, `leaked: ${s}`).not.toContain(s);
  return json;
}

describe('editFingerprint — redaction canary', () => {
  it('edit rows leak no names / prose / cascade summary', () => {
    assertNoLeak(extractEditRows(active, { settlementUuid: 'u1', cascade }));
  });
  it('cascade extraction leaks nothing', () => {
    assertNoLeak(extractEditCascade(cascade));
  });
});

describe('editFingerprint — signal is captured', () => {
  it('drops unknown kinds and classifies the rest', () => {
    const rows = extractEditRows(active, { settlementUuid: 'u1', cascade });
    expect(rows).toHaveLength(3); // bogus-kind dropped
    expect(rows[0]).toMatchObject({
      settlementUuid: 'u1', kind: 'rename-npc', targetKind: 'npc',
      payloadRedacted: { target_kind: 'npc', change_tier: 'cosmetic' }, editSeq: 0, reverted: false,
    });
    expect(rows.find(r => r.kind === 'edit-prose')).toMatchObject({ targetKind: 'prose', payloadRedacted: { change_tier: 'prose' } });
    expect(rows.find(r => r.kind === 'add-institution')).toMatchObject({ targetKind: 'institution', payloadRedacted: { change_tier: 'structural' } });
  });

  it('attaches coarse cascade (counts + impact enum) to each row', () => {
    const rows = extractEditRows(active, { settlementUuid: 'u1', cascade });
    expect(rows[0].cascade).toEqual({
      narrative_impact: 'regenerate-needed',
      downstream: { npcs: 3, hooks: 1, factions: 2, linked_saves: 0 },
    });
  });

  it('extractEditCascade(null) is null', () => {
    expect(extractEditCascade(null)).toBeNull();
  });

  it('no rows for an empty queue', () => {
    expect(extractEditRows([], { settlementUuid: 'u1' })).toEqual([]);
  });
});
