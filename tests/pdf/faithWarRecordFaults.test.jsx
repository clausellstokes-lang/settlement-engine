/**
 * FaithWar's two RECORD FAULTS (STYLE-RULINGS-2 A7; lane SW-4, 2026-11-09), pinned red-first on
 * planted live-world slices:
 *
 *   1. The at-war headline named "the patron god" without reading `deity`, so a town at war with
 *      no patron printed a god it does not keep. It names one only when `deity` is present.
 *   2. "A coalition of … holds the walls": the besiegers are OUTSIDE the walls. They surround
 *      them; they never hold them.
 */
import { describe, expect, test } from 'vitest';
import { FaithWar } from '../../src/pdf/sections/FaithWar.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SETTLEMENT = { name: 'Planted Ford', tier: 'town' };

function textOf(node) {
  const out = [];
  const walk = (n) => {
    if (n == null || typeof n === 'boolean') return;
    if (typeof n === 'string' || typeof n === 'number') { out.push(String(n)); return; }
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (typeof n === 'object') {
      if (typeof n.type === 'function') { try { walk(n.type(n.props)); } catch { /* a sub-tree that needs a renderer */ } return; }
      walk(n.props?.children);
    }
  };
  walk(node);
  return out.join('\u0000');
}

const render = (liveWorld) => textOf(FaithWar({ settlement: SETTLEMENT, narrativeMode: false, vm: { liveWorld } }));
const headlineOf = (text) => text.split('\u0000').find((t) => t.startsWith('This settlement is at war.')) || '';

describe('FaithWar — the record faults (A7)', () => {
  test('an at-war town with NO deity names no god in its headline', () => {
    const text = render({ hasLive: true, atWar: true, besiegingTargets: ['Oxbridge'] });
    const headline = headlineOf(text);
    expect(headline).not.toBe('');
    expectAbsentWithAnchor(headline.toLowerCase(), 'god', 'this settlement is at war.', 'the at-war headline with no deity');
    expectAbsentWithAnchor(text.toLowerCase(), 'god', 'this settlement is at war.', 'the chapter with no deity');
  });

  test('an at-war town WITH a deity still names the god it keeps', () => {
    const text = render({ hasLive: true, atWar: true, deity: { name: 'Corvane', effects: [] }, besiegingTargets: ['Oxbridge'] });
    const headline = headlineOf(text);
    expect(headline).not.toBe('');
    expect(headline).toMatch(/\bgod\b/i);
  });

  test('a coalition besieging the town surrounds the walls; it never holds them', () => {
    const text = render({ hasLive: true, atWar: true, besiegedBy: ['Oxbridge', 'Harrowmere'] });
    expectAbsentWithAnchor(text, 'holds the walls', 'A coalition of Oxbridge, Harrowmere surrounds the walls.', 'the besieged line');
  });
});
