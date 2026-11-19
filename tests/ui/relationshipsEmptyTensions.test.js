/**
 * @vitest-environment jsdom
 *
 * R2-CODE-B item 4 — THE EMPTY LINE NEVER DENIES A CONFLICT THE RECORD HOLDS (the cold list
 * REVIEW-W2A-3, f385d487b: MEDIUM #29 #60 "No neighbours, ties between people or conflicts are
 * recorded for this settlement." beside the Overview's Tensions & Conflicts, which prints
 * `history.currentTensions` and `powerStructure.recentConflict`).
 */
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);
const empty = (s) => render(React.createElement(RelationshipsTab, { settlement: s })).queryByTestId('relationships-empty')?.textContent.trim() ?? null;
const BASE = { name: 'Hobb', tier: 'thorp', population: 40, npcs: [], relationships: [], neighbourNetwork: [], conflicts: [] };

describe('the empty Relationships line and the record\'s tensions', () => {
  test('a recorded tension: the line names only what this tab lacks', () => {
    expect(empty({ ...BASE, history: { currentTensions: [{ description: 'A dispute over grazing rights.' }] } }))
      .toBe('No neighbours or ties between people are recorded for this settlement.');
  });
  test('a recorded conflict of the powers: the same', () => {
    expect(empty({ ...BASE, powerStructure: { recentConflict: 'The church wants approval rights over trade.' } }))
      .toBe('No neighbours or ties between people are recorded for this settlement.');
  });
  test('nothing recorded anywhere: the full line, as before', () => {
    expect(empty(BASE)).toBe('No neighbours, ties between people or conflicts are recorded for this settlement.');
  });
  test('generated thorps and hamlets: a line that denies conflicts never stands beside a recorded one', () => {
    const wrong = [];
    let shown = 0;
    for (let i = 0; i < 10; i++) {
      const s = generateSettlementPipeline({ settType: i % 2 ? 'thorp' : 'hamlet' }, null, { seed: `r2b-rel-${i}`, customContent: {} });
      const line = empty(s);
      cleanup();
      if (line == null) continue;
      shown += 1;
      const recorded = (s.history?.currentTensions || []).length > 0 || !!s.powerStructure?.recentConflict;
      if (recorded && /conflicts/.test(line)) wrong.push(`r2b-rel-${i}: ${line}`);
    }
    expect(shown, 'no generated small place showed the empty line').toBeGreaterThan(0);
    expect(wrong).toEqual([]);
  });
});
