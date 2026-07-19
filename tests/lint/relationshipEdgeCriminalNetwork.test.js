/**
 * relationshipEdgeCriminalNetwork.test.js — RESTORATION #8 pins.
 *
 * The composite dropped criminal_network from the map edge style / legend / filter
 * list and reverted the edge palette to inline hex (on a false "relationshipColors
 * is absent" premise). These pin the restored state: criminal_network is a reachable
 * canonical edge type, and the whole palette derives from the cross-surface brand
 * source (settlements/relationshipColors.js) so the map, dossier chip, and PDF agree.
 */
import { describe, test, expect } from 'vitest';
import { REL_EDGE_STYLE, REL_TYPES, relEdgeColor, WAR_FAITH_STYLE } from '../../src/components/map/relationshipEdgeStyle.js';
import { relColor } from '../../src/components/settlements/relationshipColors.js';

describe('relationshipEdgeStyle — criminal_network reachability (RESTORATION #8)', () => {
  test('criminal_network is a styled edge type, not a grey fallback', () => {
    expect(REL_EDGE_STYLE.criminal_network).toBeTruthy();
    expect(relEdgeColor('criminal_network')).toBe(relColor('criminal_network'));
    expect(relEdgeColor('criminal_network')).not.toBe('#888');
  });

  test('criminal_network appears in the canonical legend / filter list', () => {
    const ids = REL_TYPES.map(t => t.id);
    expect(ids).toContain('criminal_network');
    const row = REL_TYPES.find(t => t.id === 'criminal_network');
    expect(row.label).toBe('Criminal network');
    expect(row.color).toBe(relColor('criminal_network'));
  });

  test('the edge palette derives from the cross-surface brand palette (relColor)', () => {
    expect(relEdgeColor('trade_partner')).toBe(relColor('trade_partner'));
    expect(relEdgeColor('hostile')).toBe(relColor('hostile'));
  });

  test('war_front intentionally keeps its own hue (regionalMapOverlay agreement)', () => {
    // NOT relColor('hostile') — it matches the regional overlay channel color.
    expect(WAR_FAITH_STYLE.war_front.color).toBe('#b91c1c');
  });
});
