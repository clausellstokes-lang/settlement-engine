/**
 * chronicleEditGate.test.js — owner requirement: the Narrative Chronicles
 * panel is edit-mode chrome. It must NOT render in the read-only View —
 * only when "Edit Dossier" is active.
 *
 * SettlementDetail historically rendered ChroniclePanel twice: once
 * inside the `{editMode && (<>…</>)}` chrome block and once inside the
 * `{!editMode && (…)}` read view. The read-only site was removed
 * (2026-06-11); these tests pin that removal structurally, in the same
 * source-level style as provenanceEditGate.test.js (mounting the full
 * SettlementDetail would require mocking the entire store).
 *
 * Markers (each unique in SettlementDetail.jsx at the relevant range):
 *   • `{editMode && (<>`  — edit-mode chrome gate open
 *   • `</>)}`             — first occurrence after the open = gate close
 *                           (an earlier `</>)}` exists in the header button
 *                           row, so the search MUST start at the gate open)
 *   • `{!editMode && (`   — read-only View gate open
 *
 * Also pins the owner rename (2026-06-11): the panel's user-facing copy
 * says "Narrative Chronicles", not bare "Chronicle".
 */

import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_ROOT = join(process.cwd(), 'src', 'components');
const DETAIL_PATH = join(COMPONENTS_ROOT, 'SettlementDetail.jsx');
const PANEL_PATH = join(COMPONENTS_ROOT, 'ChroniclePanel.jsx');
// Factory, not a shared constant — `g`-flagged regexes are stateful
// (`lastIndex` persists across .test() calls), which would corrupt the
// per-file filter below.
const renderSite = () => /<ChroniclePanel\b/g;

const EDIT_GATE_OPEN = '{editMode && (<>';
const EDIT_GATE_CLOSE = '</>)}';
const READ_GATE_OPEN = '{!editMode && (';

function walk(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    return /\.(js|jsx)$/.test(entry) ? [path] : [];
  });
}

describe('ChroniclePanel is exclusively Edit Dossier chrome', () => {
  test('SettlementDetail.jsx is the only component that renders it', () => {
    const renderers = walk(COMPONENTS_ROOT)
      .filter(path => renderSite().test(readFileSync(path, 'utf8')));

    expect(renderers).toEqual([DETAIL_PATH]);
  });

  test('the single render site sits inside the editMode gate', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const sites = [...source.matchAll(renderSite())];
    expect(sites).toHaveLength(1);

    const editOpen = source.indexOf(EDIT_GATE_OPEN);
    const editClose = source.indexOf(EDIT_GATE_CLOSE, editOpen);
    expect(editOpen).toBeGreaterThan(-1);
    expect(editClose).toBeGreaterThan(editOpen);

    const siteIdx = sites[0].index;
    expect(siteIdx).toBeGreaterThan(editOpen);
    expect(siteIdx).toBeLessThan(editClose);
  });

  test('the read-only View block contains no ChroniclePanel', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const readOpen = source.indexOf(READ_GATE_OPEN);
    expect(readOpen).toBeGreaterThan(-1);

    // The only render site is inside the edit gate, which closes before
    // the read-only gate opens — so everything from the read gate to EOF
    // must be ChroniclePanel-free.
    expect(source.slice(readOpen)).not.toMatch(renderSite());
  });
});

describe('ChroniclePanel user-facing copy says "Narrative Chronicles"', () => {
  test('the collapsible header uses the renamed title', () => {
    const source = readFileSync(PANEL_PATH, 'utf8');
    expect(source).toContain('Narrative Chronicles {list.length');
  });

  test('the full-entry modal title is "Narrative Chronicle Entry" (old bare title gone)', () => {
    const source = readFileSync(PANEL_PATH, 'utf8');
    expect(source).toContain('Narrative Chronicle Entry');
    // Every remaining "Chronicle Entry" occurrence is the renamed one —
    // no bare "Chronicle Entry" title survives.
    const bare = [...source.matchAll(/Chronicle Entry/g)];
    const renamed = [...source.matchAll(/Narrative Chronicle Entry/g)];
    expect(bare).toHaveLength(renamed.length);
  });
});
