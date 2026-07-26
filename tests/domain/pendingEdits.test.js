/**
 * pendingEdits.test.js — Contract over the edit queue + cascade preview.
 *
 * The pendingEdits module is the substrate for the worldbuilder editor
 * revolution (E-1 / E-2). The UI layer changes; the contract here
 * shouldn't. Pin the behavior so a future UI rewrite can't silently
 * drift the semantics.
 */

import { describe, it, expect } from 'vitest';
import {
  buildEdit, appendEdit, revertEdit, dropEdit,
  activeEdits, hasPending, EDIT_KINDS,
  COMMITTABLE_EDIT_KINDS,
} from '../../src/domain/pendingEdits.js';
import { previewCascade } from '../../src/domain/pendingEditsPreview.js';

describe('pendingEdits — construction', () => {
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

describe('pendingEdits — committable-kinds contract (no silent drop)', () => {
  // The queueEdit seam (store/settlementSlice) admits only COMMITTABLE_EDIT_KINDS.
  // Everything else is scaffolding without a commit dispatcher. These pins keep the
  // set honest so an un-committable kind can never enter the queue and be silently
  // dropped at commit.
  it('COMMITTABLE_EDIT_KINDS is a subset of EDIT_KINDS', () => {
    for (const k of COMMITTABLE_EDIT_KINDS) {
      expect(EDIT_KINDS).toContain(k);
    }
  });

  it('marks exactly the kinds commitPendingEdits dispatches (renames + the NPC lifecycle + roads ops + player siding + the table event + recall)', () => {
    // DESIGN_NPC_LIFECYCLE §2 added live dispatchers for the three typed NPC ops
    // (edit / reassign / stasis+return); DESIGN_THE_ROADS §11 added the two party-hand
    // roads ops (ransom / rescue); DESIGN_DEEP_COUPLINGS §8 D-4e added the player-siding op
    // (champion); R-1 THE SESSION LEDGER added 'table-event' (via applyTableEvent);
    // DESIGN_VISION_WAVE V-24a added the recall rider (recall) — all route through
    // applyEditOp/applyNpcOp (commitPendingEdits' default arm). Kept in lockstep with the
    // commitPendingEdits switch.
    expect([...COMMITTABLE_EDIT_KINDS].sort()).toEqual([
      'champion-npc', 'edit-npc', 'ransom-npc', 'reassign-npc', 'recall-npc', 'rename-npc',
      'rename-settlement', 'rescue-npc', 'return-npc', 'stasis-npc', 'table-event',
    ]);
  });

  it('the un-dispatched scaffolding kinds are explicitly NOT committable', () => {
    for (const k of ['rename-faction', 'add-institution', 'remove-institution',
      'add-resource', 'remove-resource', 'add-stressor', 'remove-stressor', 'edit-prose']) {
      expect(EDIT_KINDS).toContain(k);                    // still a declared kind…
      expect(COMMITTABLE_EDIT_KINDS).not.toContain(k);    // …but has no committer
    }
  });
});

describe('pendingEdits — queue ops', () => {
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

describe('pendingEdits — cascade preview', () => {
  const baseSettlement = {
    name: 'Hightower',
    npcs: [{ name: 'A' }, { name: 'B' }],
    factions: [{ name: 'F1' }],
    plotHooks: [{ title: 'H1' }, { title: 'H2' }, { title: 'H3' }],
  };

  it('empty queue → empty preview', () => {
    const p = previewCascade(baseSettlement, []);
    expect(p.epistemic).toEqual({
      class: 'bounded_projection',
      basis: 'queued_intents_and_current_read_model',
      simulatesCommit: false,
    });
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

  it('preserves balanced structural intents as exact directional changes', () => {
    const q = [
      buildEdit('add-institution', { id: 'new-guild', label: 'New Guild' }, 1),
      buildEdit('remove-institution', { id: 'old-abbey', label: 'Old Abbey' }, 2),
    ];
    const p = previewCascade(baseSettlement, q);

    expect(p.availability).toEqual({ status: 'available', reason: null });
    expect(p.scope).toEqual({
      kind: 'intent-set',
      count: 2,
      intentIds: q.map(edit => edit.id),
    });
    expect(p.structural.status).toBe('balanced');
    expect(p.structural.deltas).toEqual([
      {
        intentId: q[0].id,
        kind: 'add-institution',
        subject: 'institution',
        direction: 'add',
        amount: 1,
        targetLabel: 'New Guild',
      },
      {
        intentId: q[1].id,
        kind: 'remove-institution',
        subject: 'institution',
        direction: 'remove',
        amount: 1,
        targetLabel: 'Old Abbey',
      },
    ]);
    expect(p.summaryLines).toContain(
      '2 structural changes balance to no net count change',
    );
  });

  it('names preview unavailability instead of reporting no structural effect', () => {
    const q = [buildEdit('add-institution', { id: 'new-guild' }, 1)];
    const p = previewCascade(null, q);

    expect(p.availability.status).toBe('unavailable');
    expect(p.epistemic.class).toBe('unavailable');
    expect(p.availability.reason).toMatch(/settlement is unavailable/i);
    expect(p.structural.status).toBe('unavailable');
    // The queued direction remains inspectable even though downstream evaluation
    // could not run.
    expect(p.structural.deltas).toMatchObject([
      { direction: 'add', subject: 'institution', targetLabel: 'new-guild' },
    ]);
    expect(p.summaryLines).toEqual([]);
  });

  it('marks table-event consequences unassessed instead of claiming zero effect', () => {
    const q = [buildEdit('table-event', {
      record: {
        kind: 'obligation',
        targets: { ref: 'debt', label: 'A debt' },
      },
      directive: {
        dispatch: 'applyEvent',
        event: { type: 'APPLY_STRESSOR', payload: { type: 'debt', severity: 0.5 } },
      },
    }, 1)];
    const p = previewCascade(baseSettlement, q);

    expect(p.availability.status).toBe('partial');
    expect(p.epistemic.class).toBe('partial_projection');
    expect(p.availability.reason).toMatch(/typed consequences.*does not simulate/i);
    expect(p.structural.status).toBe('unassessed');
    expect(p.summaryLines).toContain(
      '1 table event queued; downstream effect unassessed',
    );
  });

  it('keeps known directional rows when a mixed table-event review is partial', () => {
    const q = [
      buildEdit('add-institution', { id: 'new-guild', label: 'New Guild' }, 1),
      buildEdit('remove-institution', { id: 'old-abbey', label: 'Old Abbey' }, 2),
      buildEdit('table-event', {
        record: { kind: 'stressor-relief' },
        directive: {
          dispatch: 'applyEvent',
          event: { type: 'RESOLVE_STRESSOR', payload: { type: 'debt', magnitude: 0.5 } },
        },
      }, 3),
    ];
    const p = previewCascade(baseSettlement, q);

    expect(p.availability.status).toBe('partial');
    expect(p.structural.status).toBe('unassessed');
    expect(p.structural.deltas).toMatchObject([
      { direction: 'add', targetLabel: 'New Guild' },
      { direction: 'remove', targetLabel: 'Old Abbey' },
    ]);
    expect(p.summaryLines).not.toContain('No structural effect');
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

  it('previews NPC lifecycle decisions by name and flags narrated prose for follow-up', () => {
    const narrated = { ...baseSettlement, _narrative: { thesis: '...' } };
    const q = [
      buildEdit('stasis-npc', { npcIndex: 0, reason: 'journey' }, 1),
      buildEdit('recall-npc', { npcIndex: 1 }, 2),
    ];
    const p = previewCascade(narrated, q);
    expect(p.summaryLines).toContain('A: would be set aside (journey)');
    expect(p.summaryLines).toContain('B: would be recalled home');
    expect(p.downstreamCounts.npcChanges).toBe(2);
    expect(p.narrativeImpact).toBe('progression-suggested');
  });
});
