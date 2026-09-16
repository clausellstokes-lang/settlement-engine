/**
 * tests/domain/regenerationPreservation.test.js — the merge half of reroll
 * preservation.
 *
 * The pipeline-level proof (a real settlement, a real edit, a real reroll) lives
 * in tests/store/regenPreservation.test.js. These pin the decisions that proof
 * cannot isolate: which entities qualify, which slot a keeper takes over, and
 * the dormancy guarantee an unedited settlement's reroll rests on.
 */

import { describe, it, expect } from 'vitest';
import { mergePreservedNpcs } from '../../src/domain/regenerationPreservation.js';

/** @param {object} extra */
const npc = (id, name, extra = {}) => ({
  id, name, role: 'Blacksmith', category: 'craft', ...extra,
});

const authored = (id, name, extra = {}) => npc(id, name, {
  _authored: true,
  _userEdits: { 'secret.what': { value: 'Hand-written.', originalValue: 'Generated.' } },
  secret: { what: 'Hand-written.' },
  ...extra,
});

describe('dormancy — a settlement with no user canon', () => {
  it('returns the fresh roster by reference, so the reroll is untouched', () => {
    const fresh = [npc('npc_1', 'Aldric'), npc('npc_2', 'Bren')];
    const result = mergePreservedNpcs([npc('npc_1', 'Old One')], fresh);

    // Reference identity is the guarantee: the pipeline cannot have altered a
    // roll it never rewrote.
    expect(result.npcs).toBe(fresh);
    expect(result.preserved).toEqual([]);
  });

  it('treats an absent or malformed previous roster as nothing to preserve', () => {
    const fresh = [npc('npc_1', 'Aldric')];
    expect(mergePreservedNpcs(null, fresh).npcs).toBe(fresh);
    expect(mergePreservedNpcs(undefined, fresh).npcs).toBe(fresh);
    expect(mergePreservedNpcs([null], fresh).npcs).toBe(fresh);
  });
});

describe('which entities qualify', () => {
  const fresh = [npc('npc_1', 'Aldric'), npc('npc_2', 'Bren'), npc('npc_3', 'Cyne')];

  it('preserves a user-authored NPC with its edit record intact', () => {
    const { npcs, preserved } = mergePreservedNpcs([authored('npc_9', 'Maren')], fresh);
    const kept = npcs.find(n => n.name === 'Maren');

    expect(kept).toBeTruthy();
    expect(kept._authored).toBe(true);
    expect(kept._userEdits['secret.what'].value).toBe('Hand-written.');
    expect(kept.secret.what).toBe('Hand-written.');
    expect(preserved).toHaveLength(1);
  });

  it('preserves a locked or pinned NPC even without authored prose', () => {
    const locked = mergePreservedNpcs([npc('npc_9', 'Locked', { locked: true })], fresh);
    const pinned = mergePreservedNpcs([npc('npc_9', 'Pinned', { pinned: true })], fresh);

    expect(locked.npcs.some(n => n.name === 'Locked')).toBe(true);
    expect(pinned.npcs.some(n => n.name === 'Pinned')).toBe(true);
  });

  it('rerolls a plain generated NPC — the reroll must stay a reroll', () => {
    const { npcs, preserved } = mergePreservedNpcs([npc('npc_9', 'Forgettable')], fresh);

    expect(npcs.some(n => n.name === 'Forgettable')).toBe(false);
    expect(preserved).toEqual([]);
  });

  it('picks the qualifying NPC out of a mixed roster, not the first N', () => {
    // The discriminating case: bury the authored NPC mid-list. A merge that
    // took previous.slice(0, N) instead of consulting the predicate would keep
    // the bystanders and destroy the user's writing, while passing every test
    // whose fixture happens to put the canon NPC first.
    const previous = [
      npc('npc_1', 'Bystander One'),
      npc('npc_2', 'Bystander Two'),
      authored('npc_3', 'Maren'),
      npc('npc_4', 'Bystander Three'),
    ];
    const { npcs, preserved } = mergePreservedNpcs(previous, fresh);

    expect(preserved.map(p => p.name)).toEqual(['Maren']);
    const kept = npcs.find(n => n.name === 'Maren');
    expect(kept._userEdits['secret.what'].value).toBe('Hand-written.');
    for (const bystander of ['Bystander One', 'Bystander Two', 'Bystander Three']) {
      expect(npcs.some(n => n.name === bystander)).toBe(false);
    }
  });

  it('preserves an NPC the DM created through an event', () => {
    // ADD_NPC stamps createdByEventId; that is the most explicit canon an NPC
    // can carry, and it was invisible to the tagger.
    const invented = npc('npc_9', 'Marta the Reeve', { createdByEventId: 'evt-1' });
    const { npcs } = mergePreservedNpcs([invented], fresh);

    expect(npcs.some(n => n.name === 'Marta the Reeve')).toBe(true);
    expect(mergePreservedNpcs([invented], fresh, { mode: 'reforge' })
      .npcs.some(n => n.name === 'Marta the Reeve')).toBe(true);
  });

  it('keeps user canon under reforge, the most aggressive mode', () => {
    const { npcs } = mergePreservedNpcs([authored('npc_9', 'Maren')], fresh, { mode: 'reforge' });
    expect(npcs.some(n => n.name === 'Maren')).toBe(true);
  });
});

describe('slot takeover — the id namespace stays intact', () => {
  const fresh = [npc('npc_1', 'Aldric'), npc('npc_2', 'Bren'), npc('npc_3', 'Cyne')];

  it('holds the cast size steady rather than growing it each reroll', () => {
    const { npcs } = mergePreservedNpcs([authored('npc_9', 'Maren')], fresh);
    expect(npcs).toHaveLength(fresh.length);
  });

  it('gives every NPC a unique id, so no id-keyed edge can bind to two people', () => {
    const { npcs } = mergePreservedNpcs(
      [authored('npc_1', 'Maren'), authored('npc_2', 'Osric')],
      fresh,
    );
    const ids = npcs.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('inherits the displaced character\'s id rather than carrying a stale one', () => {
    const { npcs, preserved } = mergePreservedNpcs([authored('npc_99', 'Maren')], fresh);
    const kept = npcs.find(n => n.name === 'Maren');

    expect(kept.id).not.toBe('npc_99');
    expect(fresh.map(n => n.id)).toContain(kept.id);
    expect(preserved[0].id).toBe(kept.id);
  });

  it('displaces its own namesake first, so a regenerated character is not duplicated', () => {
    const { npcs } = mergePreservedNpcs([authored('npc_9', 'Bren')], fresh);
    const names = npcs.map(n => n.name);

    expect(names.filter(n => n === 'Bren')).toHaveLength(1);
    expect(npcs.find(n => n.name === 'Bren')._authored).toBe(true);
    // Aldric and Cyne are untouched bystanders.
    expect(names).toContain('Aldric');
    expect(names).toContain('Cyne');
  });

  it('prefers a shared role so the relationship graph still describes someone similar', () => {
    const mixed = [
      npc('npc_1', 'Aldric', { role: 'Reeve', category: 'civic' }),
      npc('npc_2', 'Bren', { role: 'Captain', category: 'martial' }),
    ];
    const { npcs } = mergePreservedNpcs(
      [authored('npc_9', 'Maren', { role: 'Captain', category: 'martial' })],
      mixed,
    );

    expect(npcs[1].name).toBe('Maren');
    expect(npcs[0].name).toBe('Aldric');
  });

  it('never spends the leader on a weak match — the roster is relevance-sorted', () => {
    // Enrichment leaves index 0 as the settlement's most important character.
    // A keeper that shares only a CATEGORY with them must not evict them, or an
    // edited bystander silently leaves the town with no government.
    const byRelevance = [
      npc('npc_1', 'Mayor Johanna', { role: 'Mayor', category: 'government' }),
      npc('npc_2', 'Clerk Otto', { role: 'Clerk', category: 'government' }),
      npc('npc_3', 'Smith Rurik', { role: 'Blacksmith', category: 'craft' }),
    ];
    const keeper = authored('npc_9', 'Baron Ulbrecht', { role: 'Baron', category: 'government' });
    const { npcs } = mergePreservedNpcs([keeper], byRelevance);

    expect(npcs[0].name).toBe('Mayor Johanna');
    expect(npcs.some(n => n.role === 'Mayor')).toBe(true);
    expect(npcs.some(n => n.name === 'Baron Ulbrecht')).toBe(true);
  });

  it('falls back to the least relevant slot when nothing matches at all', () => {
    const byRelevance = [
      npc('npc_1', 'Mayor Johanna', { role: 'Mayor', category: 'government' }),
      npc('npc_2', 'Smith Rurik', { role: 'Blacksmith', category: 'craft' }),
    ];
    const keeper = authored('npc_9', 'Wanderer', { role: 'Hedge Witch', category: 'arcane' });
    const { npcs } = mergePreservedNpcs([keeper], byRelevance);

    expect(npcs[0].name).toBe('Mayor Johanna');
    expect(npcs[1].name).toBe('Wanderer');
  });

  it('reports who each keeper displaced, so the caller can repair the prose', () => {
    const byRelevance = [
      npc('npc_1', 'Mayor Johanna', { role: 'Mayor', category: 'government' }),
      npc('npc_2', 'Smith Rurik', { role: 'Blacksmith', category: 'craft' }),
    ];
    const { displacements } = mergePreservedNpcs(
      [authored('npc_9', 'Wanderer', { role: 'Hedge Witch', category: 'arcane' })],
      byRelevance,
    );

    expect(displacements).toEqual([{ from: 'Smith Rurik', to: 'Wanderer' }]);
  });

  it('reports no displacement when a keeper replaces its own namesake', () => {
    const { displacements } = mergePreservedNpcs(
      [authored('npc_9', 'Bren')],
      [npc('npc_1', 'Aldric'), npc('npc_2', 'Bren')],
    );

    expect(displacements).toEqual([]);
  });

  it('appends with a fresh id when the new roll has fewer slots than keepers', () => {
    const tiny = [npc('npc_1', 'Aldric')];
    const { npcs, overflow } = mergePreservedNpcs(
      [authored('npc_1', 'Maren'), authored('npc_2', 'Osric')],
      tiny,
    );
    const ids = npcs.map(n => n.id);

    expect(npcs).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(npcs.map(n => n.name).sort()).toEqual(['Maren', 'Osric']);
    // An appended keeper has no relationships and no faction, so the caller is
    // told rather than left to discover a socially isolated character.
    expect(overflow.map(o => o.name)).toEqual(['Osric']);
  });
});

describe('purity', () => {
  it('mutates neither roster it is handed', () => {
    const previous = [authored('npc_9', 'Maren')];
    const fresh = [npc('npc_1', 'Aldric')];
    const previousJson = JSON.stringify(previous);
    const freshJson = JSON.stringify(fresh);

    mergePreservedNpcs(previous, fresh);

    expect(JSON.stringify(previous)).toBe(previousJson);
    expect(JSON.stringify(fresh)).toBe(freshJson);
  });

  it('returns a clone, so a frozen store roster is safe to hand in', () => {
    const keeper = Object.freeze(authored('npc_9', 'Maren'));
    const { npcs } = mergePreservedNpcs([keeper], [npc('npc_1', 'Aldric')]);
    const kept = npcs.find(n => n.name === 'Maren');

    expect(kept).not.toBe(keeper);
    expect(Object.isFrozen(kept)).toBe(false);
  });
});
