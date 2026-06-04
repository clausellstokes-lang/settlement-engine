/**
 * tests/domain/userEdits.test.js - Tier 5.4 comprehensive suite.
 *
 * Verifies the per-field user-authorship domain layer:
 *   - apply / revert lifecycle
 *   - first-edit-captures-original semantics
 *   - canon-tag wiring (_authored: true flips entity to source: 'user')
 *   - settlement-wide walking + counting
 *   - registry guard (isEditablePath blocks anything not whitelisted)
 *   - defensive against malformed input
 */

import { describe, it, expect } from 'vitest';
import {
  applyUserEdit,
  revertUserEdit,
  revertAllEdits,
  getEditedPaths,
  isEdited,
  hasAnyEdit,
  getOriginalValue,
  getEffectiveValue,
  getEditRecord,
  walkUserEdits,
  countSettlementEdits,
  isSettlementEdited,
  summarizeUserEdits,
  isEditablePath,
  EDITABLE_FIELDS,
  EDITABLE_ENTITY_TYPES,
} from '../../src/domain/userEdits.js';
import { tagEntityCanon } from '../../src/domain/canonStatus.js';

// ── Fixtures ─────────────────────────────────────────────────────────────

function npcFixture() {
  return {
    id: 'npc.aldis',
    name: 'Aldis Vale',
    role: 'Guildmaster',
    personality: 'Stern, exacting.',
    goal: { short: 'Tighten the guild\'s grip on the docks.' },
    secret: { what: 'Embezzles dues to pay off a personal debt.' },
  };
}

function settlementFixture() {
  return {
    id: 'sett.test',
    name: 'Testford',
    tier: 'town',
    population: 1500,
    arrivalScene: 'A stone bridge greets travellers.',
    pressureSentence: 'The guild squeezes the dockers.',
    settlementReason: 'A ford in the river.',
    npcs: [
      npcFixture(),
      { id: 'npc.morrow', name: 'Captain Morrow', role: 'Guard Captain' },
    ],
    institutions: [
      { id: 'inst.market', name: 'Market', desc: 'A bustling daily market.' },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.guild', name: 'Merchant Guild', desc: 'Old money behind every door.' },
      ],
      conflicts: [],
    },
    history: {
      founding: {
        reason: 'River ford toll',
        initialChallenge: 'flooding',
        overcoming: 'built stone bridge',
        foundedBy: 'House Vale',
      },
      historicalEvents: [
        { name: 'Flood Year', description: 'River broke its banks.' },
      ],
      currentTensions: [
        { type: 'economic', description: 'Toll dispute' },
      ],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────

describe('EDITABLE_FIELDS registry', () => {
  it('exposes a closed vocabulary of editable entity types', () => {
    expect(EDITABLE_ENTITY_TYPES).toContain('npc');
    expect(EDITABLE_ENTITY_TYPES).toContain('faction');
    expect(EDITABLE_ENTITY_TYPES).toContain('institution');
    expect(EDITABLE_ENTITY_TYPES).toContain('settlement');
  });

  it('settlement-root paths include the high-value prose fields', () => {
    const paths = EDITABLE_FIELDS.settlement;
    expect(paths).toContain('arrivalScene');
    expect(paths).toContain('pressureSentence');
    expect(paths).toContain('settlementReason');
    expect(paths).toContain('history.founding.reason');
    expect(paths).toContain('economicViability.summary');
  });

  it('NPC paths include goal.short / secret.what / personality', () => {
    expect(EDITABLE_FIELDS.npc).toContain('goal.short');
    expect(EDITABLE_FIELDS.npc).toContain('secret.what');
    expect(EDITABLE_FIELDS.npc).toContain('personality');
  });

  it('does NOT include structural fields (population, tier, faction power)', () => {
    const allFields = Object.values(EDITABLE_FIELDS).flat();
    expect(allFields).not.toContain('population');
    expect(allFields).not.toContain('tier');
    expect(allFields).not.toContain('power');
    expect(allFields).not.toContain('isGoverning');
  });

  it('EDITABLE_FIELDS and its sub-arrays are frozen', () => {
    expect(() => { EDITABLE_FIELDS.npc.push('rogue'); }).toThrow();
    expect(Object.isFrozen(EDITABLE_FIELDS)).toBe(true);
  });
});

describe('isEditablePath()', () => {
  it('returns true for whitelisted (type, path) pairs', () => {
    expect(isEditablePath('npc', 'secret.what')).toBe(true);
    expect(isEditablePath('settlement', 'arrivalScene')).toBe(true);
    expect(isEditablePath('faction', 'desc')).toBe(true);
  });

  it('returns false for paths not in the registry', () => {
    expect(isEditablePath('npc', 'name')).toBe(false);
    expect(isEditablePath('settlement', 'population')).toBe(false);
    expect(isEditablePath('faction', 'power')).toBe(false);
  });

  it('returns false for unknown entity types', () => {
    expect(isEditablePath('dragon', 'lairLocation')).toBe(false);
    expect(isEditablePath('', 'anything')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// applyUserEdit
// ─────────────────────────────────────────────────────────────────────

describe('applyUserEdit()', () => {
  it('writes the new value at the path', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'Hand-written secret.');
    expect(npc.secret.what).toBe('Hand-written secret.');
  });

  it('captures the original value on the first edit', () => {
    const npc = npcFixture();
    const before = npc.secret.what;
    applyUserEdit(npc, 'secret.what', 'New text.');
    expect(npc._userEdits['secret.what'].originalValue).toBe(before);
  });

  it('PRESERVES the original across subsequent edits to the same path', () => {
    const npc = npcFixture();
    const truly = npc.secret.what;
    applyUserEdit(npc, 'secret.what', 'Edit #1');
    applyUserEdit(npc, 'secret.what', 'Edit #2');
    applyUserEdit(npc, 'secret.what', 'Edit #3');
    expect(npc._userEdits['secret.what'].originalValue).toBe(truly);
    expect(npc._userEdits['secret.what'].value).toBe('Edit #3');
    expect(npc.secret.what).toBe('Edit #3');
  });

  it('updates the editedAt timestamp on every edit', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'first',  { editedAt: '2026-01-01T00:00:00.000Z' });
    applyUserEdit(npc, 'secret.what', 'second', { editedAt: '2026-02-01T00:00:00.000Z' });
    expect(npc._userEdits['secret.what'].editedAt).toBe('2026-02-01T00:00:00.000Z');
  });

  it('sets _authored: true so canonStatus picks up the user-source tag', () => {
    const npc = npcFixture();
    expect(tagEntityCanon(npc).source).toBe('generated');
    applyUserEdit(npc, 'secret.what', 'Edited.');
    expect(tagEntityCanon(npc).source).toBe('user');
    expect(tagEntityCanon(npc).canonStatus).toBe('canon');
    expect(tagEntityCanon(npc).locked).toBe(true);
  });

  it('handles deep paths (creates intermediate objects if missing)', () => {
    const entity = { id: 'e.1' };
    applyUserEdit(entity, 'a.b.c.d', 'deep');
    expect(entity.a.b.c.d).toBe('deep');
  });

  it('handles single-segment paths (root-level fields)', () => {
    const settlement = settlementFixture();
    applyUserEdit(settlement, 'arrivalScene', 'Polished arrival.');
    expect(settlement.arrivalScene).toBe('Polished arrival.');
    expect(settlement._userEdits.arrivalScene.value).toBe('Polished arrival.');
  });

  it('returns the same entity for chaining', () => {
    const npc = npcFixture();
    const result = applyUserEdit(npc, 'secret.what', 'X');
    expect(result).toBe(npc);
  });

  it('uses the current time when editedAt is not provided', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    expect(typeof npc._userEdits['secret.what'].editedAt).toBe('string');
    // ISO-ish format check.
    expect(npc._userEdits['secret.what'].editedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('multiple paths on the same entity all coexist', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'Edit 1');
    applyUserEdit(npc, 'goal.short',  'Edit 2');
    applyUserEdit(npc, 'personality', 'Edit 3');
    expect(getEditedPaths(npc).sort()).toEqual(['goal.short', 'personality', 'secret.what']);
  });

  it('is a no-op on null entity', () => {
    expect(applyUserEdit(null, 'p', 'v')).toBe(null);
  });

  it('is a no-op on missing path', () => {
    const npc = npcFixture();
    applyUserEdit(npc, '', 'X');
    expect(npc._userEdits).toBeUndefined();
  });

  it('is a no-op on non-object entity', () => {
    expect(applyUserEdit('not an object', 'p', 'v')).toBe('not an object');
  });
});

// ─────────────────────────────────────────────────────────────────────
// revertUserEdit
// ─────────────────────────────────────────────────────────────────────

describe('revertUserEdit()', () => {
  it('restores the original value', () => {
    const npc = npcFixture();
    const before = npc.secret.what;
    applyUserEdit(npc, 'secret.what', 'changed');
    revertUserEdit(npc, 'secret.what');
    expect(npc.secret.what).toBe(before);
  });

  it('removes the _userEdits record for the reverted path', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    revertUserEdit(npc, 'secret.what');
    expect(isEdited(npc, 'secret.what')).toBe(false);
  });

  it('removes _userEdits and _authored entirely when no edits remain', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    revertUserEdit(npc, 'secret.what');
    expect(npc._userEdits).toBeUndefined();
    expect(npc._authored).toBeUndefined();
  });

  it('keeps OTHER edits intact when reverting one path', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'A');
    applyUserEdit(npc, 'goal.short',  'B');
    revertUserEdit(npc, 'secret.what');
    expect(isEdited(npc, 'goal.short')).toBe(true);
    expect(npc.goal.short).toBe('B');
  });

  it('keeps _authored: true while ANY edit remains', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'A');
    applyUserEdit(npc, 'goal.short',  'B');
    revertUserEdit(npc, 'secret.what');
    expect(npc._authored).toBe(true);
    expect(tagEntityCanon(npc).source).toBe('user');
  });

  it('returns to generated canon source after the LAST edit is reverted', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'A');
    revertUserEdit(npc, 'secret.what');
    expect(tagEntityCanon(npc).source).toBe('generated');
  });

  it('is a no-op on an unedited path', () => {
    const npc = npcFixture();
    const before = JSON.stringify(npc);
    revertUserEdit(npc, 'secret.what');
    expect(JSON.stringify(npc)).toBe(before);
  });

  it('is a no-op on null entity', () => {
    expect(revertUserEdit(null, 'p')).toBe(null);
  });
});

describe('revertAllEdits()', () => {
  it('reverts every edit on an entity', () => {
    const npc = npcFixture();
    const originalGoal = npc.goal.short;
    const originalSecret = npc.secret.what;
    applyUserEdit(npc, 'secret.what', 'X');
    applyUserEdit(npc, 'goal.short',  'Y');
    revertAllEdits(npc);
    expect(npc.secret.what).toBe(originalSecret);
    expect(npc.goal.short).toBe(originalGoal);
    expect(npc._userEdits).toBeUndefined();
    expect(npc._authored).toBeUndefined();
  });

  it('is a no-op on an entity with no edits', () => {
    const npc = npcFixture();
    const before = JSON.stringify(npc);
    revertAllEdits(npc);
    expect(JSON.stringify(npc)).toBe(before);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Per-entity queries
// ─────────────────────────────────────────────────────────────────────

describe('getEditedPaths() / isEdited() / hasAnyEdit()', () => {
  it('getEditedPaths returns [] when no edits', () => {
    expect(getEditedPaths(npcFixture())).toEqual([]);
  });

  it('getEditedPaths returns the dotted paths of every edit', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'A');
    applyUserEdit(npc, 'goal.short',  'B');
    expect(getEditedPaths(npc).sort()).toEqual(['goal.short', 'secret.what']);
  });

  it('isEdited returns true only for actually-edited paths', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    expect(isEdited(npc, 'secret.what')).toBe(true);
    expect(isEdited(npc, 'goal.short')).toBe(false);
  });

  it('hasAnyEdit summarizes "is there at least one"', () => {
    const npc = npcFixture();
    expect(hasAnyEdit(npc)).toBe(false);
    applyUserEdit(npc, 'secret.what', 'X');
    expect(hasAnyEdit(npc)).toBe(true);
    revertUserEdit(npc, 'secret.what');
    expect(hasAnyEdit(npc)).toBe(false);
  });

  it('isEdited returns false on null entity', () => {
    expect(isEdited(null, 'p')).toBe(false);
  });
});

describe('getOriginalValue() / getEffectiveValue() / getEditRecord()', () => {
  it('getOriginalValue returns the captured pre-edit value', () => {
    const npc = npcFixture();
    const before = npc.secret.what;
    applyUserEdit(npc, 'secret.what', 'changed');
    expect(getOriginalValue(npc, 'secret.what')).toBe(before);
  });

  it('getOriginalValue returns null for unedited paths', () => {
    expect(getOriginalValue(npcFixture(), 'secret.what')).toBeNull();
  });

  it('getEffectiveValue returns the current (post-edit) value', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'live value');
    expect(getEffectiveValue(npc, 'secret.what')).toBe('live value');
  });

  it('getEditRecord returns the full record', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'V', { editedAt: '2026-05-20T00:00:00.000Z' });
    const r = getEditRecord(npc, 'secret.what');
    expect(r).toEqual({
      value: 'V',
      originalValue: 'Embezzles dues to pay off a personal debt.',
      editedAt: '2026-05-20T00:00:00.000Z',
    });
  });

  it('getEditRecord returns null when not edited', () => {
    expect(getEditRecord(npcFixture(), 'secret.what')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Settlement-level walking
// ─────────────────────────────────────────────────────────────────────

describe('walkUserEdits()', () => {
  it('yields settlement-root edits', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', 'Polished.');
    const walked = walkUserEdits(s);
    expect(walked.length).toBe(1);
    expect(walked[0].kind).toBe('settlement');
    expect(walked[0].path).toBe('arrivalScene');
  });

  it('yields NPC edits with kind="npc" and entityIndex', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    const walked = walkUserEdits(s);
    expect(walked.length).toBe(1);
    expect(walked[0].kind).toBe('npc');
    expect(walked[0].entityIndex).toBe(0);
    expect(walked[0].path).toBe('secret.what');
  });

  it('yields faction edits with kind="faction"', () => {
    const s = settlementFixture();
    applyUserEdit(s.powerStructure.factions[0], 'desc', 'X');
    const walked = walkUserEdits(s);
    expect(walked[0].kind).toBe('faction');
  });

  it('yields institution edits with kind="institution"', () => {
    const s = settlementFixture();
    applyUserEdit(s.institutions[0], 'desc', 'X');
    const walked = walkUserEdits(s);
    expect(walked[0].kind).toBe('institution');
  });

  it('yields history event edits with kind="historicalEvent"', () => {
    const s = settlementFixture();
    applyUserEdit(s.history.historicalEvents[0], 'description', 'X');
    const walked = walkUserEdits(s);
    expect(walked[0].kind).toBe('historicalEvent');
  });

  it('yields currentTension edits with kind="currentTension"', () => {
    const s = settlementFixture();
    applyUserEdit(s.history.currentTensions[0], 'description', 'X');
    const walked = walkUserEdits(s);
    expect(walked[0].kind).toBe('currentTension');
  });

  it('yields every edit across the tree in one pass', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', '1');
    applyUserEdit(s.npcs[0], 'secret.what', '2');
    applyUserEdit(s.powerStructure.factions[0], 'desc', '3');
    applyUserEdit(s.institutions[0], 'desc', '4');
    // Nested history prose lives under the settlement root (the path
    // expands into the settlement object), not on an intermediate
    // history "entity". The EDITABLE_FIELDS registry treats it that way.
    applyUserEdit(s, 'history.historicalCharacter', '5');
    expect(walkUserEdits(s).length).toBe(5);
  });

  it('returns [] on null / non-object input', () => {
    expect(walkUserEdits(null)).toEqual([]);
    expect(walkUserEdits('string')).toEqual([]);
  });

  it('tolerates missing entity arrays', () => {
    const minimal = { id: 'm', name: 'M' };
    expect(walkUserEdits(minimal)).toEqual([]);
  });
});

describe('countSettlementEdits() / isSettlementEdited()', () => {
  it('counts edits across every array', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', '1');
    applyUserEdit(s.npcs[0], 'secret.what', '2');
    applyUserEdit(s.npcs[1], 'role', '3'); // even though role isn't whitelisted, it's still tracked at the data layer
    applyUserEdit(s.powerStructure.factions[0], 'desc', '4');
    expect(countSettlementEdits(s)).toBe(4);
  });

  it('isSettlementEdited returns true after the first edit', () => {
    const s = settlementFixture();
    expect(isSettlementEdited(s)).toBe(false);
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    expect(isSettlementEdited(s)).toBe(true);
  });

  it('isSettlementEdited returns false after every edit is reverted', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    revertUserEdit(s.npcs[0], 'secret.what');
    expect(isSettlementEdited(s)).toBe(false);
  });
});

describe('summarizeUserEdits()', () => {
  it('returns one line per edit', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', 'X');
    applyUserEdit(s.npcs[0], 'secret.what', 'Y');
    const lines = summarizeUserEdits(s);
    expect(lines.length).toBe(2);
  });

  it('settlement-root summary uses "settlement > path" format', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', 'X');
    expect(summarizeUserEdits(s)[0]).toBe('settlement > arrivalScene');
  });

  it('entity summary uses "kind: label > path" format', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    expect(summarizeUserEdits(s)[0]).toBe('npc: Aldis Vale > secret.what');
  });

  it('falls back to index when label is missing', () => {
    const s = settlementFixture();
    s.npcs.push({ id: 'np.x' });  // no name
    applyUserEdit(s.npcs[2], 'role', 'X');
    expect(summarizeUserEdits(s)[0]).toBe('npc: #2 > role');
  });
});

// ─────────────────────────────────────────────────────────────────────
// Canon-tag integration
// ─────────────────────────────────────────────────────────────────────

describe('canonStatus integration', () => {
  it('a freshly edited entity becomes source: "user", canonStatus: "canon", locked: true', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    const tag = tagEntityCanon(npc);
    expect(tag.source).toBe('user');
    expect(tag.canonStatus).toBe('canon');
    expect(tag.locked).toBe(true);
  });

  it('reverting the last edit returns the entity to generated/draft', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'X');
    revertUserEdit(npc, 'secret.what');
    const tag = tagEntityCanon(npc);
    expect(tag.source).toBe('generated');
    expect(tag.canonStatus).toBe('draft');
    expect(tag.locked).toBe(false);
  });

  it('an entity with multiple edits stays user-authored across single reverts', () => {
    const npc = npcFixture();
    applyUserEdit(npc, 'secret.what', 'A');
    applyUserEdit(npc, 'goal.short',  'B');
    revertUserEdit(npc, 'secret.what');
    expect(tagEntityCanon(npc).source).toBe('user');
  });
});

// ─────────────────────────────────────────────────────────────────────
// Real-world usage smoke tests
// ─────────────────────────────────────────────────────────────────────

describe('real-world usage', () => {
  it('DM workflow: edit secret → confirm → see Edited badge across the dossier', () => {
    const s = settlementFixture();
    expect(isSettlementEdited(s)).toBe(false);
    applyUserEdit(s.npcs[0], 'secret.what', 'Hand-written secret about a debt to the cathedral.');
    expect(isSettlementEdited(s)).toBe(true);
    expect(s.npcs[0].secret.what).toMatch(/cathedral/);
    expect(s.npcs[0]._authored).toBe(true);
  });

  it('DM workflow: typo correction → revert → back to generated', () => {
    const s = settlementFixture();
    const before = s.arrivalScene;
    applyUserEdit(s, 'arrivalScene', 'wrong!');
    revertUserEdit(s, 'arrivalScene');
    expect(s.arrivalScene).toBe(before);
    expect(isSettlementEdited(s)).toBe(false);
  });

  it('DM workflow: bulk edit across NPCs, then revert one and keep others', () => {
    const s = settlementFixture();
    s.npcs.push({ id: 'npc.x', name: 'Brenna' });
    applyUserEdit(s.npcs[0], 'secret.what', 'A');
    applyUserEdit(s.npcs[1], 'role',        'B');
    applyUserEdit(s.npcs[2], 'role',        'C');
    revertUserEdit(s.npcs[1], 'role');
    expect(isEdited(s.npcs[0], 'secret.what')).toBe(true);
    expect(isEdited(s.npcs[1], 'role')).toBe(false);
    expect(isEdited(s.npcs[2], 'role')).toBe(true);
    expect(countSettlementEdits(s)).toBe(2);
  });

  it('JSON round-trip preserves edits + originals (persistence smoke test)', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'persisted');
    applyUserEdit(s, 'arrivalScene', 'also persisted');
    const json = JSON.stringify(s);
    const restored = JSON.parse(json);

    expect(restored.npcs[0]._userEdits['secret.what'].value).toBe('persisted');
    expect(restored.npcs[0]._userEdits['secret.what'].originalValue).toBe('Embezzles dues to pay off a personal debt.');
    expect(restored._userEdits.arrivalScene.value).toBe('also persisted');
    expect(isSettlementEdited(restored)).toBe(true);
  });
});
