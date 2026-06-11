/**
 * provenanceEditGate.test.js — owner requirement: the Provenance card
 * (Seed / Generated / Last edited / Canonized / Last export / Campaign)
 * is edit-mode chrome. It must NOT render in the read-only View — only
 * when "Edit Dossier" is active.
 *
 * SettlementDetail historically rendered ProvenanceBlock twice: once
 * inside the `{editMode && (<>…</>)}` chrome block and once inside the
 * `{!editMode && (…)}` read view. The read-only site was removed
 * (2026-06-11); these tests pin that removal structurally, in the same
 * source-level style as noNativeDialogs.test.js (mounting the full
 * SettlementDetail would require mocking the entire store).
 *
 * Markers (each unique in SettlementDetail.jsx at the relevant range):
 *   • `{editMode && (<>`  — edit-mode chrome gate open
 *   • `</>)}`             — first occurrence after the open = gate close
 *   • `{!editMode && (`   — read-only View gate open
 */

import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_ROOT = join(process.cwd(), 'src', 'components');
const DETAIL_PATH = join(COMPONENTS_ROOT, 'SettlementDetail.jsx');
// Factory, not a shared constant — `g`-flagged regexes are stateful
// (`lastIndex` persists across .test() calls), which would corrupt the
// per-file filter below.
const renderSite = () => /<ProvenanceBlock\b/g;

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

describe('ProvenanceBlock is exclusively Edit Dossier chrome', () => {
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

  test('the read-only View block contains no ProvenanceBlock', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');

    const readOpen = source.indexOf(READ_GATE_OPEN);
    expect(readOpen).toBeGreaterThan(-1);

    // The only render site is inside the edit gate, which closes before
    // the read-only gate opens — so everything from the read gate to EOF
    // must be ProvenanceBlock-free.
    expect(source.slice(readOpen)).not.toMatch(renderSite());
  });
});
