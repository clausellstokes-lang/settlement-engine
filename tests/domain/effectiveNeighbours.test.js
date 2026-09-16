/**
 * effectiveNeighbours.test.js — THE chokepoint totality pins (owner order
 * 2026-07-22: co-campaign settlements are implicit Neutral neighbours by default,
 * expressed as a read-time default, never materialized rows).
 *
 * Covers: explicit+implicit merge, explicit-wins (by id AND by name), the strict
 * no-op (no campaign context ⇒ raw list, same identity), the full lifecycle
 * (place / remove / re-place / campaign-move / import) proven from live
 * membership alone, and determinism (same inputs ⇒ identical output).
 */
import { describe, test, expect } from 'vitest';
import {
  effectiveNeighboursOf,
  campaignMembershipIndex,
  IMPLICIT_NEUTRAL_FLAG,
} from '../../src/domain/relationships/effectiveNeighbours.js';

function save(id, name, neighbours = []) {
  return { id, name, settlement: { name, neighbourNetwork: neighbours } };
}

const implicitOnly = (list) => list.filter((l) => l[IMPLICIT_NEUTRAL_FLAG]);
const implicitTargetIds = (list) => implicitOnly(list).map((l) => l.targetId).sort();

describe('effectiveNeighboursOf — strict no-op without campaign context', () => {
  test('no coCampaignSaves ⇒ returns the explicit array unchanged (same identity)', () => {
    const explicit = [{ id: 'x', neighbourName: 'Xton', relationshipType: 'trade_partner' }];
    const A = save('a', 'Aford', explicit);
    expect(effectiveNeighboursOf(A, [])).toBe(A.settlement.neighbourNetwork);
    expect(effectiveNeighboursOf(A, undefined)).toBe(A.settlement.neighbourNetwork);
    expect(effectiveNeighboursOf(A, null)).toBe(A.settlement.neighbourNetwork);
  });

  test('a settlement with no neighbourNetwork and no campaign ⇒ empty list', () => {
    const A = { id: 'a', name: 'Aford', settlement: { name: 'Aford' } };
    expect(effectiveNeighboursOf(A, [])).toEqual([]);
  });
});

describe('effectiveNeighboursOf — implicit neutral expansion', () => {
  test('every OTHER co-campaign settlement becomes an implicit Neutral neighbour', () => {
    const A = save('a', 'Aford');
    const B = save('b', 'Bton');
    const C = save('c', 'Cwick');
    const eff = effectiveNeighboursOf(A, [A, B, C]);
    expect(implicitTargetIds(eff)).toEqual(['b', 'c']); // self 'a' skipped
    for (const l of implicitOnly(eff)) {
      expect(l.relationshipType).toBe('neutral');
      expect(l.localRelationshipRole).toBe('neutral');
      expect(l[IMPLICIT_NEUTRAL_FLAG]).toBe(true);
      expect(l.targetId).toBeTruthy();
    }
  });

  test('explicit link wins by id — no implicit duplicate for that partner', () => {
    const A = save('a', 'Aford', [{ id: 'b', neighbourName: 'Bton', relationshipType: 'hostile' }]);
    const B = save('b', 'Bton');
    const C = save('c', 'Cwick');
    const eff = effectiveNeighboursOf(A, [A, B, C]);
    // B stays the explicit hostile link; only C is added as implicit neutral.
    expect(implicitTargetIds(eff)).toEqual(['c']);
    const bEntry = eff.find((l) => String(l.id) === 'b');
    expect(bEntry.relationshipType).toBe('hostile');
    expect(bEntry[IMPLICIT_NEUTRAL_FLAG]).toBeUndefined();
  });

  test('explicit link wins by NAME — no implicit duplicate for that partner', () => {
    const A = save('a', 'Aford', [{ neighbourName: 'Bton', relationshipType: 'allied' }]);
    const B = save('b', 'Bton');
    const C = save('c', 'Cwick');
    const eff = effectiveNeighboursOf(A, [A, B, C]);
    expect(implicitTargetIds(eff)).toEqual(['c']); // B matched by name, excluded
  });

  test('does not mutate the source neighbourNetwork', () => {
    const A = save('a', 'Aford', [{ id: 'b', neighbourName: 'Bton', relationshipType: 'rival' }]);
    const before = A.settlement.neighbourNetwork.length;
    effectiveNeighboursOf(A, [A, save('c', 'Cwick')]);
    expect(A.settlement.neighbourNetwork.length).toBe(before);
  });

  test('deterministic — identical inputs produce identical output (x2)', () => {
    const A = save('a', 'Aford');
    const group = [A, save('b', 'Bton'), save('c', 'Cwick'), save('d', 'Dhaven')];
    expect(effectiveNeighboursOf(A, group)).toEqual(effectiveNeighboursOf(A, group));
  });
});

describe('effectiveNeighboursOf — lifecycle (derived from live membership; no stored state)', () => {
  const A = save('a', 'Aford');
  const B = save('b', 'Bton');
  const C = save('c', 'Cwick');

  test('PLACE: A + B in the same campaign ⇒ each sees the other as neutral', () => {
    expect(implicitTargetIds(effectiveNeighboursOf(A, [A, B]))).toEqual(['b']);
    expect(implicitTargetIds(effectiveNeighboursOf(B, [A, B]))).toEqual(['a']);
  });

  test('REMOVE: B no longer in the campaign ⇒ A no longer sees B — and NO delink needed', () => {
    // The implicit reading simply drops B; A.settlement.neighbourNetwork was
    // never written to, so removal requires no explicit-link cleanup.
    expect(implicitOnly(effectiveNeighboursOf(A, [A]))).toEqual([]);
    expect(A.settlement.neighbourNetwork).toEqual([]);
  });

  test('RE-PLACE: B added back ⇒ the neutral neighbour reappears with no re-link', () => {
    expect(implicitTargetIds(effectiveNeighboursOf(A, [A, B]))).toEqual(['b']);
  });

  test('CAMPAIGN-MOVE: A moved to a campaign with C ⇒ implicit neutrals follow membership', () => {
    // A's group is now {A, C}; B is gone, C appears — purely from the new group.
    expect(implicitTargetIds(effectiveNeighboursOf(A, [A, C]))).toEqual(['c']);
  });

  test('IMPORT: an imported settlement (neighbourNetwork scrubbed to []) still gets co-campaign neutrals', () => {
    const imported = save('imp', 'Imported', []); // gallery/import scrubs explicit links
    expect(implicitTargetIds(effectiveNeighboursOf(imported, [imported, A, B]))).toEqual(['a', 'b']);
  });
});

describe('campaignMembershipIndex', () => {
  test('maps each settlementId (String-normalized) to its campaign id', () => {
    const idx = campaignMembershipIndex([
      { id: 'camp1', settlementIds: ['a', 2, 'c'] },
      { id: 'camp2', settlementIds: ['d'] },
    ]);
    expect(idx.get('a')).toBe('camp1');
    expect(idx.get('2')).toBe('camp1'); // numeric id normalized to string key
    expect(idx.get('c')).toBe('camp1');
    expect(idx.get('d')).toBe('camp2');
    expect(idx.get('missing')).toBeUndefined();
  });

  test('tolerates empty / malformed input', () => {
    expect(campaignMembershipIndex(undefined).size).toBe(0);
    expect(campaignMembershipIndex([{ settlementIds: ['x'] }]).size).toBe(0); // no id ⇒ skipped
  });
});
