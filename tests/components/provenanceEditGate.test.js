/**
 * provenanceEditGate.test.js — the Provenance card after the Workshop reorg
 * (UX overhaul Phase 6, plan §4.3).
 *
 * History: SettlementDetail rendered ProvenanceBlock as edit-mode chrome (and,
 * earlier, in the read-only View too — that read site was removed 2026-06-11).
 * Phase 6 then moved it into the editor Workshop as card #7 "Provenance & Links"
 * — a READ surface (the seed / timestamps / campaign link are the free→premium
 * teaser), so it is no longer SettlementDetail-local edit-only chrome.
 *
 * These tests pin the NEW home structurally (mounting the full tree would mean
 * mocking the whole store):
 *   • ProvenanceBlock is rendered by exactly ONE component — the Workshop.
 *   • SettlementDetail no longer renders it directly.
 *   • The Workshop hosts it inside its "provenance-links" card.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_ROOT = join(process.cwd(), 'src', 'components');
const DETAIL_PATH = join(COMPONENTS_ROOT, 'SettlementDetail.jsx');
const WORKSHOP_PATH = join(COMPONENTS_ROOT, 'settlement', 'Workshop.jsx');
// Factory, not a shared constant — `g`-flagged regexes are stateful
// (`lastIndex` persists across .test() calls), which would corrupt the
// per-file filter below.
const renderSite = () => /<ProvenanceBlock\b/g;

function walk(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    return /\.(js|jsx)$/.test(entry) ? [path] : [];
  });
}

describe('ProvenanceBlock lives in the editor Workshop (Phase 6)', () => {
  test('the Workshop is the only component that renders it', () => {
    const renderers = walk(COMPONENTS_ROOT)
      .filter(path => renderSite().test(readFileSync(path, 'utf8')));

    expect(renderers).toEqual([WORKSHOP_PATH]);
  });

  test('SettlementDetail no longer renders ProvenanceBlock directly', () => {
    const source = readFileSync(DETAIL_PATH, 'utf8');
    expect(source).not.toMatch(renderSite());
  });

  test('the Workshop hosts it inside the Provenance & Links card', () => {
    const source = readFileSync(WORKSHOP_PATH, 'utf8');

    const sites = [...source.matchAll(renderSite())];
    expect(sites).toHaveLength(1);

    // The single render site sits after the card's id marker.
    const cardIdx = source.indexOf("id=\"provenance-links\"");
    expect(cardIdx).toBeGreaterThan(-1);
    expect(sites[0].index).toBeGreaterThan(cardIdx);
  });
});
