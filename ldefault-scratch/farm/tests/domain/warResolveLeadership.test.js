/**
 * tests/domain/warResolveLeadership.test.js — pins domain-readmodels-3: the
 * War & Resolve leadership read must INCLUDE 'pillar' figures (the Lord Mayor /
 * High Priestess / Kingpin / Archmagister — the seat-holder), ordered pillar >
 * key > notable, and must FALL BACK to power/influence ranking when no npc
 * carries an importance stamp (plain npcGenerator settlements). Previously the
 * filter accepted only key|notable, so the ruler never appeared and
 * importance-less settlements showed no figures at all.
 */

import { describe, it, expect } from 'vitest';

import { warResolveSignal } from '../../src/domain/display/warResolve.js';

function figuresFor(npcs) {
  const sig = warResolveSignal({ settlement: { id: 's', npcs }, saveId: 's' });
  return sig.leadership.figures.map(f => f.name);
}

describe('warResolve — leadership figures include the ruler', () => {
  it("the 'pillar' seat-holder leads, ordered pillar > key > notable", () => {
    const names = figuresFor([
      { name: 'Lt Bob', role: 'Lieutenant', importance: 'key', power: 6, influence: 'moderate' },
      { name: 'Mayor Vance', role: 'Lord Mayor', importance: 'pillar', power: 9, influence: 'high' },
      { name: 'Trader Ann', role: 'Senior Trader', importance: 'notable', power: 3, influence: 'low' },
    ]);
    // The ruler (pillar) ranks first — previously excluded entirely.
    expect(names[0]).toBe('Mayor Vance');
    expect(names).toEqual(['Mayor Vance', 'Lt Bob', 'Trader Ann']);
  });

  it('falls back to power/influence when NO npc carries an importance stamp', () => {
    const names = figuresFor([
      { name: 'Weak', power: 2, influence: 'low' },
      { name: 'Strong', power: 9, influence: 'high' },
      { name: 'Mid', power: 5, influence: 'moderate' },
    ]);
    // A plain-generated settlement still surfaces figures (was an empty list before).
    expect(names).toEqual(['Strong', 'Mid', 'Weak']);
  });

  it('caps at three figures and tolerates an empty roster', () => {
    expect(figuresFor([]).length).toBe(0);
    const many = figuresFor([
      { name: 'A', importance: 'pillar' }, { name: 'B', importance: 'key' },
      { name: 'C', importance: 'key' }, { name: 'D', importance: 'notable' },
    ]);
    expect(many.length).toBe(3);
    expect(many[0]).toBe('A');
  });
});
