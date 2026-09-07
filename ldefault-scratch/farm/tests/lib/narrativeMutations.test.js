/**
 * tests/lib/narrativeMutations.test.js — Tier 3.8 comprehensive coverage.
 */

import { describe, test, expect } from 'vitest';
import {
  classifyChange,
  applyRenameToAiData,
  applyRenamesToAiData,
} from '../../src/lib/narrativeMutations.js';

// ── classifyChange ────────────────────────────────────────────────────

describe('classifyChange()', () => {
  test('renames are cosmetic', () => {
    expect(classifyChange('renameNpc')).toBe('cosmetic');
    expect(classifyChange('renameFaction')).toBe('cosmetic');
    expect(classifyChange('renameSettlement')).toBe('cosmetic');
  });

  test('institution / stressor / resource changes are structural', () => {
    for (const t of [
      'addInstitution', 'removeInstitution',
      'addStressor', 'removeStressor',
      'addTradeGood', 'removeTradeGood',
      'addResource', 'removeResource',
      'setResourceState', 'setPrioritySlider',
    ]) {
      expect(classifyChange(t), t).toBe('structural');
    }
  });

  test('identity changes are seismic', () => {
    for (const t of ['changeTier', 'changeCulture', 'changeGovernment', 'changeTerrain']) {
      expect(classifyChange(t), t).toBe('seismic');
    }
  });

  test('unknown types default to structural (the safe choice)', () => {
    expect(classifyChange('pizzaParty')).toBe('structural');
    expect(classifyChange(null)).toBe('structural');
    expect(classifyChange(undefined)).toBe('structural');
  });
});

// ── applyRenameToAiData ───────────────────────────────────────────────

describe('applyRenameToAiData()', () => {
  // The function operates on aiData.aiSettlement and aiData.aiDailyLife.
  // Bare top-level strings are left alone — only the narrative blobs
  // get rewritten.

  test('replaces whole-word occurrences inside aiSettlement', () => {
    const aiData = {
      aiSettlement: {
        thesis: 'Captain Rusk leads the watch.',
        npcs: [{ name: 'Captain Rusk', bio: 'Captain Rusk has served for years.' }],
      },
    };
    const out = applyRenameToAiData(aiData, 'Captain Rusk', 'Captain Vela');
    expect(out.aiSettlement.thesis).toBe('Captain Vela leads the watch.');
    expect(out.aiSettlement.npcs[0].name).toBe('Captain Vela');
    expect(out.aiSettlement.npcs[0].bio).toBe('Captain Vela has served for years.');
  });

  test('replaces whole-word occurrences inside aiDailyLife', () => {
    const aiData = {
      aiDailyLife: {
        dawn: 'Captain Rusk opens the gate.',
      },
    };
    const out = applyRenameToAiData(aiData, 'Captain Rusk', 'Captain Vela');
    expect(out.aiDailyLife.dawn).toBe('Captain Vela opens the gate.');
  });

  test('does NOT mutate the input', () => {
    const aiData = { aiSettlement: { thesis: 'Rusk leads.' } };
    const before = JSON.stringify(aiData);
    applyRenameToAiData(aiData, 'Rusk', 'Vela');
    expect(JSON.stringify(aiData)).toBe(before);
  });

  test('returns input unchanged when oldName is empty/missing', () => {
    const aiData = { aiSettlement: { thesis: 'Captain Rusk leads.' } };
    expect(applyRenameToAiData(aiData, '', 'Vela')).toBe(aiData);
    expect(applyRenameToAiData(aiData, null, 'Vela')).toBe(aiData);
  });

  test('returns input unchanged when old === new', () => {
    const aiData = { aiSettlement: { thesis: 'X' } };
    expect(applyRenameToAiData(aiData, 'Same', 'Same')).toBe(aiData);
  });

  test('handles nullish aiData', () => {
    expect(applyRenameToAiData(null, 'a', 'b')).toBeNull();
    expect(applyRenameToAiData(undefined, 'a', 'b')).toBeUndefined();
  });

  test('returns input unchanged when no narrative blobs are present', () => {
    const aiData = { thesis: 'top-level not touched' };
    expect(applyRenameToAiData(aiData, 'top-level', 'X')).toBe(aiData);
  });

  test('does not replace partial-word matches', () => {
    const aiData = { aiSettlement: { thesis: 'Ruskovia is far from Rusk.' } };
    const out = applyRenameToAiData(aiData, 'Rusk', 'Vela');
    expect(out.aiSettlement.thesis).toBe('Ruskovia is far from Vela.');
  });

  test('handles regex metacharacters in names safely', () => {
    const aiData = { aiSettlement: { thesis: 'A.B (the prophet) is here.' } };
    const out = applyRenameToAiData(aiData, 'A.B', 'Cdef');
    expect(out.aiSettlement.thesis).toBe('Cdef (the prophet) is here.');
  });

  test('renames names that start with a non-ASCII letter', () => {
    // Regression: `\b` is ASCII-only, so "Éowyn" (leading non-ASCII letter)
    // never matched and left stale prose behind.
    const aiData = { aiSettlement: { thesis: "Éowyn rules. Éowyn's hall stands." } };
    const out = applyRenameToAiData(aiData, 'Éowyn', 'Bran');
    expect(out.aiSettlement.thesis).toBe("Bran rules. Bran's hall stands.");
  });

  test('renames names that end with a non-ASCII letter', () => {
    const aiData = { aiSettlement: { thesis: 'José leads and Zoë follows.' } };
    let out = applyRenameToAiData(aiData, 'José', 'Rue');
    out = applyRenameToAiData(out, 'Zoë', 'Wren');
    expect(out.aiSettlement.thesis).toBe('Rue leads and Wren follows.');
  });

  test('does not rewrite partial matches around a non-ASCII name', () => {
    // "Björns" (plural) must not be touched when renaming "Björn".
    const aiData = { aiSettlement: { thesis: 'Björn and the Björns march.' } };
    const out = applyRenameToAiData(aiData, 'Björn', 'Kai');
    expect(out.aiSettlement.thesis).toBe('Kai and the Björns march.');
  });

  test('inserts the new name verbatim even when it contains $', () => {
    // Function-form replacement: "$&" etc. in a user name are not special.
    const aiData = { aiSettlement: { thesis: 'Pay Rusk today.' } };
    const out = applyRenameToAiData(aiData, 'Rusk', 'The $ Guild');
    expect(out.aiSettlement.thesis).toBe('Pay The $ Guild today.');
  });

  test('walks arrays inside narrative blobs', () => {
    const aiData = {
      aiSettlement: {
        bullets: ['Rusk speaks', 'Rusk listens', 'Rusk leaves'],
      },
    };
    const out = applyRenameToAiData(aiData, 'Rusk', 'Vela');
    expect(out.aiSettlement.bullets).toEqual(['Vela speaks', 'Vela listens', 'Vela leaves']);
  });

  test('preserves non-string scalars (numbers, booleans)', () => {
    const aiData = {
      aiSettlement: { count: 7, active: true, name: 'Rusk' },
    };
    const out = applyRenameToAiData(aiData, 'Rusk', 'Vela');
    expect(out.aiSettlement.count).toBe(7);
    expect(out.aiSettlement.active).toBe(true);
    expect(out.aiSettlement.name).toBe('Vela');
  });

  test('preserves top-level fields outside the narrative blobs', () => {
    const aiData = {
      aiSettlement: { thesis: 'Rusk.' },
      version: 1,
      generatedAt: '2026-05-19',
    };
    const out = applyRenameToAiData(aiData, 'Rusk', 'Vela');
    expect(out.aiSettlement.thesis).toBe('Vela.');
    expect(out.version).toBe(1);
    expect(out.generatedAt).toBe('2026-05-19');
  });
});

// ── applyRenamesToAiData ──────────────────────────────────────────────

describe('applyRenamesToAiData()', () => {
  test('applies multiple renames in sequence', () => {
    const aiData = {
      aiSettlement: { thesis: 'Captain Rusk and the Merchants resist.' },
    };
    const out = applyRenamesToAiData(aiData, [
      { oldName: 'Captain Rusk', newName: 'Captain Vela' },
      { oldName: 'Merchants',    newName: 'Council' },
    ]);
    expect(out.aiSettlement.thesis).toBe('Captain Vela and the Council resist.');
  });

  test('returns input unchanged for empty pairs', () => {
    const aiData = { aiSettlement: { thesis: 'unchanged' } };
    expect(applyRenamesToAiData(aiData, [])).toBe(aiData);
  });

  test('handles nullish pairs', () => {
    const aiData = { aiSettlement: { thesis: 'unchanged' } };
    expect(applyRenamesToAiData(aiData, null)).toBe(aiData);
  });

  test('does not mutate input', () => {
    const aiData = {
      aiSettlement: { thesis: 'Rusk and Merchants.' },
    };
    const before = JSON.stringify(aiData);
    applyRenamesToAiData(aiData, [{ oldName: 'Rusk', newName: 'Vela' }]);
    expect(JSON.stringify(aiData)).toBe(before);
  });

  test('order of pairs matters when names cascade', () => {
    // Rename "Captain Rusk" -> "Captain Vela" THEN "Captain Vela" -> "Captain Mara"
    // should yield "Captain Mara".
    const aiData = { aiSettlement: { thesis: 'Captain Rusk.' } };
    const out = applyRenamesToAiData(aiData, [
      { oldName: 'Captain Rusk', newName: 'Captain Vela' },
      { oldName: 'Captain Vela', newName: 'Captain Mara' },
    ]);
    expect(out.aiSettlement.thesis).toBe('Captain Mara.');
  });
});
