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

// ── §67.2 (DA-A3): THE CONVERGENCE, ASSERTED AT EVERY SURFACE ───────────────
// The three spot checks above pinned the MAP. They could not have caught what
// §67.2 was written for, because the defect lived on the surfaces they never
// looked at: seven duplicate tables, one of which was SEMANTICALLY wrong rather
// than merely stale — the react-PDF chapter painted `allied` in canonical
// TRADE_PARTNER's hue. A palette that is "the single source" only where somebody
// remembered to import it is not a single source, so this arm reads the SOURCE
// of every surface and asserts none of them keeps a table of its own.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REL_HEX, REL_RGB, relRgb } from '../../src/components/settlements/relationshipColors.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Every surface §67.2 named, and the two the compile added. */
const CONVERGED_SURFACES = Object.freeze([
  'src/components/settlements/SettlementCard.jsx',
  'src/components/SettlementDetail.jsx',
  'src/components/new/neighbourComponents.jsx',
  'src/components/new/tabs/RelationshipsTab.jsx',
  'src/utils/generateCampaignPDF.js',
  'src/pdf/theme.js',
  'src/pdf/sections/Relationships.jsx',
]);

/** The engine's canonical relationship vocabulary, as the palette must cover it. */
const CANONICAL_TYPES = Object.freeze([
  'trade_partner', 'allied', 'patron', 'client', 'vassal',
  'rival', 'cold_war', 'hostile', 'criminal_network', 'neutral',
]);

describe('§67.2 — the relationship palette converges on ONE source', () => {
  /**
   * A re-forked palette row: a relationship type bound to a literal COLOUR — a
   * hex string, or an rgb triple of three integers.
   *
   * ⚠ THE TRIPLE MUST BE THREE INTEGERS, and that is a measured constraint, not
   * caution. A looser `\[` matched `trade_partner:['economy']` (an effect-category
   * list in SettlementDetail) and `patron: [1.5, 1.0]` (REL_DASH, a dash pattern
   * in generateCampaignPDF) — twelve false positives on the first run, both in
   * files that HAD converged. A detector that convicts a converged file teaches
   * the next reader to disbelieve it.
   */
  const forkedRowRe = (type) =>
    new RegExp(`\\b${type}\\s*:\\s*(?:'#[0-9a-fA-F]{3,8}'|\\[\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\])`);

  const codeOf = (rel) => readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  test('the re-fork detector CATCHES a seeded table and stays quiet on prose (positive control)', () => {
    // A source-scan negative is worth nothing without this: the arm below reports
    // "no duplicates" in exactly the same way whether the tree is clean or the
    // regex stopped matching.
    expect(forkedRowRe('allied').test("const t = { allied: '#1a5a28' };")).toBe(true);
    expect(forkedRowRe('allied').test('const t = { allied: [26, 58, 122] };')).toBe(true);
    // …and the two shapes that are NOT palettes, both live in this estate.
    expect(forkedRowRe('trade_partner').test("{ trade_partner:['economy'] }")).toBe(false);
    expect(forkedRowRe('patron').test('{ patron: [1.5, 1.0] }')).toBe(false);
    expect(forkedRowRe('allied').test('relColor(link.allied)')).toBe(false);
  });

  test('no converged surface keeps a relationship colour table of its own', () => {
    // Reading the SOURCE is the only thing that can see a table that was
    // re-forked; importing and comparing values cannot see a copy at all.
    const offenders = [];
    for (const rel of CONVERGED_SURFACES) {
      const src = codeOf(rel);
      for (const type of CANONICAL_TYPES) {
        if (forkedRowRe(type).test(src)) offenders.push(`${rel}: re-forked \`${type}\``);
      }
    }
    expect(
      offenders,
      `\nA relationship palette was re-forked. Import relColor()/relRgb() instead.\n${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('every converged surface actually REACHES the canonical module (not merely lacks a table)', () => {
    // The other half of the same claim: a file with no table and no import is not
    // converged, it is colourless. Both halves or neither.
    const unreached = CONVERGED_SURFACES.filter((rel) =>
      rel !== 'src/pdf/theme.js' && !/relationshipColors\.js/.test(readFileSync(join(ROOT, rel), 'utf8')));
    expect(unreached, `these surfaces import no palette at all: ${unreached.join(', ')}`).toEqual([]);
  });

  test('the canonical palette is a BIJECTION with the engine vocabulary, in both channels', () => {
    expect(Object.keys(REL_HEX).sort()).toEqual([...CANONICAL_TYPES].sort());
    expect(Object.keys(REL_RGB).sort()).toEqual([...CANONICAL_TYPES].sort());
  });

  test('every canonical type resolves to a DISTINCT hue — no two relationships look alike', () => {
    // The refused state, named: pdf/theme.js collapsed rival/cold_war/hostile
    // onto one red and patron/client onto one blue, so five of nine types were
    // unreadable. Distinctness is the property that was actually broken.
    const hexes = CANONICAL_TYPES.map((t) => relColor(t));
    expect(new Set(hexes).size, `collapsed hues: ${hexes.join(', ')}`).toBe(CANONICAL_TYPES.length);
  });

  test('⛔ allied is NOT trade_partner — the exact semantic error §67.2 cured', () => {
    expect(relColor('allied')).not.toBe(relColor('trade_partner'));
    expect(relColor('allied')).toBe('#1a3a7a');
    expect(relColor('trade_partner')).toBe('#1a5a28');
  });

  test('vassal and criminal_network stop rendering as the neutral fallback', () => {
    for (const type of ['vassal', 'criminal_network']) {
      expect(relColor(type), `${type} fell back to neutral`).not.toBe(relColor('neutral'));
      expect(relRgb(type)).not.toEqual(relRgb('neutral'));
    }
  });

  test('the hex and rgb channels agree, type for type, so the PDF cannot drift from the web', () => {
    for (const type of CANONICAL_TYPES) {
      const hex = relColor(type);
      const [r, g, b] = relRgb(type);
      expect(`#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`, `${type} channel mismatch`)
        .toBe(hex);
    }
  });

  test('secret_alliance keeps its authored PDF label and gets NO palette row (J-TC21-8)', () => {
    expect(REL_HEX.secret_alliance).toBeUndefined();
    expect(relColor('secret_alliance')).toBe(relColor('neutral'));
    const labels = readFileSync(join(ROOT, 'src/pdf/sections/Relationships.jsx'), 'utf8');
    expect(labels).toContain("secret_alliance:  'Secret Alliance'");
  });
});
