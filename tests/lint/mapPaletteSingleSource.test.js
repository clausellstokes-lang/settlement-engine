/**
 * mapPaletteSingleSource.test.js — components-map-2 / components-map-3.
 *
 * The relationship / war-faith palette is single-sourced from
 * relationshipEdgeStyle.js so the drawn line and the legend that explains it can
 * never disagree (P11). Two components (RoutesToolbar, LayersPanel) had grown
 * their own copies — RoutesToolbar's in DIVERGENT hues (a gold "Client" dot beside
 * a purple edge). These guards keep the palette single-writer:
 *
 *   (a) no components/map file (except relationshipEdgeStyle.js) may re-declare a
 *       canonical relationship/war-faith hue as a raw color literal;
 *   (b) war_front / religious_authority are drawn by RelationshipEdges only — the
 *       RegionalCausalityLayer diagnostic overlay must subtract them (no double
 *       draw in a second, mismatched purple);
 *   (c) the two purples for religious_authority must agree across the two palette
 *       modules (WAR_FAITH_STYLE vs regionalMapOverlay CHANNEL_COLORS).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { REL_EDGE_STYLE, WAR_FAITH_STYLE, relChannelColor } from '../../src/components/map/relationshipEdgeStyle.js';
import { regionalChannelColor } from '../../src/lib/regionalMapOverlay.js';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MAP_DIR = join(REPO, 'src/components/map');

/** Strip block + line comments and swatch['#XXXXXX'] design-token lookups so the
 *  scan only sees real raw color literals. */
function stripNoise(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/swatch\[['"]#[0-9a-fA-F]{6}['"]\]/g, '');
}

function mapFiles() {
  return readdirSync(MAP_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(jsx?|mjs)$/.test(e.name))
    .map((e) => e.name);
}

describe('map palette — single-sourced from relationshipEdgeStyle (P11)', () => {
  const banned = new Set(
    [...Object.values(REL_EDGE_STYLE).map((s) => s.color), ...Object.values(WAR_FAITH_STYLE).map((s) => s.color)]
      .map((c) => c.toLowerCase()),
  );

  it('the banned canonical palette is non-empty (guard non-vacuity)', () => {
    expect(banned.size).toBeGreaterThanOrEqual(8);
  });

  it('no components/map file re-declares a canonical relationship/war-faith hue as a raw literal', () => {
    const offenders = [];
    for (const name of mapFiles()) {
      if (name === 'relationshipEdgeStyle.js') continue; // the single source itself
      const src = stripNoise(readFileSync(join(MAP_DIR, name), 'utf8'));
      const hexes = src.match(/#[0-9a-fA-F]{6}/g) || [];
      for (const hex of hexes) {
        if (banned.has(hex.toLowerCase())) offenders.push(`${name}: ${hex}`);
      }
    }
    expect(
      offenders,
      `re-declared canonical palette hex under components/map — import REL_TYPES/relEdgeColor from relationshipEdgeStyle.js instead:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('RegionalCausalityLayer subtracts war_front/religious_authority (single-writer: RelationshipEdges)', () => {
    const src = readFileSync(join(MAP_DIR, 'RegionalCausalityLayer.jsx'), 'utf8');
    // The overlay must filter those two channel types out of its draw.
    expect(src).toMatch(/war_front/);
    expect(src).toMatch(/religious_authority/);
    expect(src, 'RegionalCausalityLayer must filter the war/faith channel types before drawing')
      .toMatch(/\.filter\(channel\s*=>\s*!WAR_FAITH_TYPES\.has\(channel\.type\)\)/);
  });

  it('religious_authority is ONE purple across both palette modules', () => {
    expect(regionalChannelColor('religious_authority').toLowerCase())
      .toBe(relChannelColor('religious_authority').toLowerCase());
    // war_front already agreed; keep it pinned so a recolor of one side reds.
    expect(regionalChannelColor('war_front').toLowerCase())
      .toBe(relChannelColor('war_front').toLowerCase());
  });
});
