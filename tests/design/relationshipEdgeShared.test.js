/**
 * tests/design/relationshipEdgeShared.test.js — pins the map-surface dedupe.
 *
 * REL_TYPES (the filter-chip list shared by LayersPanel / RoutesToolbar /
 * MapLegend) and WAR_FAITH_STYLE (the siege/faith channel colors shared by
 * RelationshipEdges + MapLegend) now live in ONE module so the chips, the legend,
 * and the drawn line can never disagree. These assertions fail if a future edit
 * forks a label, a relationship color, or a war/faith channel color back out.
 */

import { describe, expect, test } from 'vitest';

import {
  REL_TYPES,
  REL_EDGE_STYLE,
  relEdgeColor,
  WAR_FAITH_STYLE,
  relChannelColor,
} from '../../src/components/map/relationshipEdgeStyle.js';
import { relColor } from '../../src/components/settlements/relationshipColors.js';

describe('shared relationship-type list', () => {
  test('covers every drawn edge style and labels each type', () => {
    const ids = REL_TYPES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length); // no dup ids
    for (const t of REL_TYPES) {
      expect(t.label).toBeTruthy();
      // each chip color is derived from the SAME edge style the map draws
      expect(t.color).toBe(relEdgeColor(t.id));
      expect(t.color).toBe(REL_EDGE_STYLE[t.id].color);
    }
  });

  test('the canonical labels are the unified terms (no "Trade"/"Cold" forks)', () => {
    const byId = Object.fromEntries(REL_TYPES.map(t => [t.id, t.label]));
    expect(byId.trade_partner).toBe('Trade partner');
    expect(byId.cold_war).toBe('Cold war');
  });
});

describe('map edges derive from the canonical brand palette', () => {
  test('every map edge color equals the parchment REL_HEX hue, so map and dossier agree', () => {
    for (const t of REL_TYPES) {
      expect(REL_EDGE_STYLE[t.id].color).toBe(relColor(t.id));
    }
  });

  test('criminal_network is colored (no grey fallback) now that the palette covers it', () => {
    expect(REL_EDGE_STYLE.criminal_network).toBeTruthy();
    expect(relEdgeColor('criminal_network')).toBe(relColor('criminal_network'));
    expect(relEdgeColor('criminal_network')).not.toBe('#888');
  });

  test('war_front uses the brand hostile hue', () => {
    expect(WAR_FAITH_STYLE.war_front.color).toBe(relColor('hostile'));
  });
});

describe('shared war/faith channel style', () => {
  test('legend colors derive from the SAME WAR_FAITH_STYLE the map draws', () => {
    expect(relChannelColor('war_front')).toBe(WAR_FAITH_STYLE.war_front.color);
    expect(relChannelColor('religious_authority')).toBe(WAR_FAITH_STYLE.religious_authority.color);
  });

  test('unknown channel falls back to neutral grey', () => {
    expect(relChannelColor('mystery_channel')).toBe('#888');
  });
});
