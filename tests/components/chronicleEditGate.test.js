/**
 * chronicleEditGate.test.js — owner requirement: the Narrative Chronicles
 * panel is edit-mode chrome. It must NOT render in the read-only View —
 * only when "Edit Dossier" is active.
 *
 * SettlementDetail historically rendered ChroniclePanel twice: once
 * inside the `{editMode && (<>…</>)}` chrome block and once inside the
 * `{!editMode && (…)}` read view. The read-only site was removed; the
 * Workshop reorg (UX overhaul Phase 6) then dropped the `{!editMode && (`
 * read gate entirely (the read surfaces moved into the always-mounted
 * Workshop rail). ChroniclePanel + NetworkEffectsPanel remain EDIT-ONLY
 * chrome, inside the one `{editMode && (<div…>…</div>)}` block. The UI/UX
 * overhaul width-capped that block: the edit chrome is now wrapped in a
 * centered `maxWidth:PAGE_MAX` column (a `<div>`), where it used to be a
 * bare `<>` fragment — so the gate markers below track the `<div>` form.
 * These tests pin that structurally, in the same source-level style as
 * provenanceEditGate.test.js (mounting the full SettlementDetail would
 * require mocking the entire store).
 *
 * Markers (each unique in SettlementDetail.jsx — verified single-occurrence):
 *   • `{editMode && (<div` — edit-mode chrome gate open. There are earlier
 *                            single-child `{editMode && (` blocks (newline
 *                            after the paren), so anchoring on the `(<div`
 *                            form selects the width-capped chrome block only.
 *   • `</div>)}`           — gate close (first occurrence after the open)
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

const EDIT_GATE_OPEN = '{editMode && (<div';
const EDIT_GATE_CLOSE = '</div>)}';

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

  test('nothing after the editMode gate closes renders ChroniclePanel', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const editOpen = source.indexOf(EDIT_GATE_OPEN);
    const editClose = source.indexOf(EDIT_GATE_CLOSE, editOpen);
    expect(editClose).toBeGreaterThan(editOpen);

    // Everything past the gate close (the always-mounted Workshop + export
    // chrome + the read-only OutputContainer) must be ChroniclePanel-free.
    expect(source.slice(editClose + EDIT_GATE_CLOSE.length)).not.toMatch(renderSite());
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

describe('NetworkEffectsPanel is exclusively Edit Dossier chrome (owner, 2026-06-12)', () => {
  // Same two-render-sites history as ChroniclePanel/ProvenanceBlock: the
  // panel rendered inside the editMode chrome AND in the read-only View.
  // The read-only site was removed; these pins hold the gate. The panel is
  // module-local to SettlementDetail.jsx (defined and rendered in one file),
  // so the render-site scan is scoped to that file.
  const networkSite = () => /<NetworkEffectsPanel\b/g;

  test('exactly one render site, inside the editMode gate', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const sites = [...source.matchAll(networkSite())];
    expect(sites).toHaveLength(1);

    const editOpen = source.indexOf(EDIT_GATE_OPEN);
    const editClose = source.indexOf(EDIT_GATE_CLOSE, editOpen);
    expect(editOpen).toBeGreaterThan(-1);
    expect(editClose).toBeGreaterThan(editOpen);

    const siteIdx = sites[0].index;
    expect(siteIdx).toBeGreaterThan(editOpen);
    expect(siteIdx).toBeLessThan(editClose);
  });

  test('nothing after the editMode gate closes renders NetworkEffectsPanel', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const editOpen = source.indexOf(EDIT_GATE_OPEN);
    const editClose = source.indexOf(EDIT_GATE_CLOSE, editOpen);
    expect(editClose).toBeGreaterThan(editOpen);
    expect(source.slice(editClose + EDIT_GATE_CLOSE.length)).not.toMatch(networkSite());
  });
});
