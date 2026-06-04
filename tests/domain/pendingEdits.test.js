/**
 * pendingEdits.test.js - Contract over the edit queue + cascade preview.
 *
 * The pendingEdits module is the substrate for the worldbuilder editor
 * revolution (E-1 / E-2). The UI layer changes; the contract here
 * shouldn't. Pin the behavior so a future UI rewrite can't silently
 * drift the semantics.
 */

import { describe, it, expect } from 'vitest';
import {
  buildEdit, appendEdit, revertEdit, dropEdit,
  activeEdits, hasPending, previewCascade, EDIT_KINDS,
} from '../../src/domain/pendingEdits.js';

describe('pendingEdits - construction', () => {
  it('builds a frozen edit with id + kind + payload + ts', () => {
    const e = buildEdit('rename-npc', { npcId: 'npc1', newName: 'Velda' }, 7);
    expect(e).toMatchObject({
      kind: 'rename-npc',
      payload: { npcId: 'npc1', newName: 'Velda' },
      ts: 7,
      reverted: false,
    });
    expect(typeof e.id).toBe('string');
    expect(Object.isFrozen(e)).toBe(true);
  });

  it('rejects unknown kinds', () => {
    expect(() => buildEdit('nuke-everything', {})).toThrow(/unknown kind/);
  });

  it('exposes the full EDIT_KINDS set', () => {
    expect(EDIT_KINDS).toContain('rename-npc');
    expect(EDIT_KINDS).toContain('add-institution');
    expect(EDIT_KINDS).toContain('edit-prose');
    expect(EDIT_KINDS.length).toBeGreaterThanOrEqual(10);
  });
});

describe('pendingEdits - queue ops', () => {
  it('append returns a new queue without mutating the original', () => {
    const e1 = buildEdit('rename-npc', { npcId: 'a', newName: 'A' }, 1);
    const e2 = buildEdit('add-institution', { institutionId: 'i1' }, 2);
    const q0 = [];
    const q1 = appendEdit(q0, e1);
    const q2 = appendEdit(q1, e2);
    expect(q0).toEqual([]);
    expect(q1).toEqual([e1]);
    expect(q2).toEqual([e1, e2]);
  });

  it('revert marks an entry without removing it', () => {
    const e1 = buildEdit('rename-npc', { npcId: 'a', newName: 'A' }, 1);
    const e2 = buildEdit('add-institution', { institutionId: 'i1' }, 2);
    const q = [e1, e2];
    const reverted = revertEdit(q, e1.id);
    expect(reverted.length).toBe(2);
    expect(reverted[0].reverted).toBe(true);
    expect(reverted[1].reverted).toBe(false);
  });

  it('drop removes an entry entirely', () => {
    const e1 = buildEdit('rename-npc', { npcId: 'a', newName: 'A' }, 1);
    const e2 = buildEdit('add-institution', { institutionId: 'i1' }, 2);
    const q = [e1, e2];
    const dropped = dropEdit(q, e1.id);
    expect(dropped.length).toBe(1);
    expect(dropped[0].id).toBe(e2.id);
  });

  it('activeEdits filters reverted', () => {
    const e1 = buildEdit('rename-npc', { npcId: 'a', newName: 'A' }, 1);
    const e2 = buildEdit('add-institution', { institutionId: 'i1' }, 2);
    const q = revertEdit([e1, e2], e1.id);
    expect(activeEdits(q).length).toBe(1);
    expect(activeEdits(q)[0].id).toBe(e2.id);
  });

  it('hasPending counts only active', () => {
    const e = buildEdit('rename-npc', { npcId: 'a', newName: 'A' }, 1);
    expect(hasPending([e])).toBe(true);
    expect(hasPending(revertEdit([e], e.id))).toBe(false);
    expect(hasPending([])).toBe(false);
    expect(hasPending(null)).toBe(false);
  });
});

describe('pendingEdits - cascade preview', () => {
  const baseSettlement = {
    name: 'Hightower',
    npcs: [{ name: 'A' }, { name: 'B' }],
    factions: [{ name: 'F1' }],
    plotHooks: [{ title: 'H1' }, { title: 'H2' }, { title: 'H3' }],
  };

  it('empty queue → empty preview', () => {
    const p = previewCascade(baseSettlement, []);
    expect(p.summaryLines).toEqual([]);
    expect(p.narrativeImpact).toBe('none');
    expect(p.warnings).toEqual([]);
  });

  it('net institution count surfaces as a single summary line', () => {
    const q = [
      buildEdit('add-institution', { id: 'i1' }, 1),
      buildEdit('add-institution', { id: 'i2' }, 2),
      buildEdit('remove-institution', { id: 'i3' }, 3),
    ];
    const p = previewCascade(baseSettlement, q);
    expect(p.summaryLines).toContain('+1 institution');
  });

  it('reverted edits don\'t count', () => {
    let q = [buildEdit('add-institution', { id: 'i1' }, 1)];
    q = revertEdit(q, q[0].id);
    const p = previewCascade(baseSettlement, q);
    expect(p.summaryLines).toEqual([]);
  });

  it('narrative impact = none when settlement is raw', () => {
    const rawSet = { ...baseSettlement };
    const q = [buildEdit('add-institution', { id: 'i1' }, 1)];
    const p = previewCascade(rawSet, q);
    expect(p.narrativeImpact).toBe('none');
  });

  it('narrative impact = regenerate-needed on narrated + structural', () => {
    const narrated = { ...baseSettlement, _narrative: { thesis: '...' } };
    const q = [buildEdit('add-institution', { id: 'i1' }, 1)];
    const p = previewCascade(narrated, q);
    expect(p.narrativeImpact).toBe('regenerate-needed');
    expect(p.warnings.length).toBeGreaterThan(0);
  });

  it('narrative impact = progression-suggested on narrated + rename only', () => {
    const narrated = { ...baseSettlement, _narrative: { thesis: '...' } };
    const q = [buildEdit('rename-npc', { npcId: 'a', newName: 'A2' }, 1)];
    const p = previewCascade(narrated, q);
    expect(p.narrativeImpact).toBe('progression-suggested');
  });

  it('downstreamCounts reflect live settlement', () => {
    const q = [buildEdit('rename-npc', { npcId: 'a', newName: 'A2' }, 1)];
    const p = previewCascade(baseSettlement, q);
    expect(p.downstreamCounts.npcs).toBe(2);
    expect(p.downstreamCounts.factions).toBe(1);
    expect(p.downstreamCounts.hooks).toBe(3);
  });

  it('warns when removing multiple institutions', () => {
    const q = [
      buildEdit('remove-institution', { id: 'i1' }, 1),
      buildEdit('remove-institution', { id: 'i2' }, 2),
    ];
    const p = previewCascade(baseSettlement, q);
    expect(p.warnings.some(w => /Removing multiple institutions/.test(w))).toBe(true);
  });
});
