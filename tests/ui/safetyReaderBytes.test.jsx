/**
 * @vitest-environment jsdom
 *
 * safetyReaderBytes.test.jsx — PAGE-1's SAFETY unit (BUILD.md §SAFETY (3), second half): EVERY READER, SHARED OR PUBLIC
 * PATH PRINTS TODAY'S BYTES. The owner's page gains a line beside the Safety label (`domain/display/safetyShown.js`);
 * no other audience may gain a byte. This test renders, for each of the chair's 300 towns (measure A's recipe), every
 * surface that prints the Safety label on a path that is not the owner's, hashes each, and holds the hashes equal to the
 * list recorded on the untouched surfaces (base ff51769f7):
 *   - the Overview and Defense tabs as the gallery reads them (`publicDossier` and `playerView`, PublicDossierView's
 *     default), as an owner's "reveal DM content" share reads them (`publicDossier` alone), and as a player share
 *     reads them (`playerView` alone);
 *   - the print view model with no DM view (`buildViewModel({ settlement })`, what the Foundry export builds), its
 *     Cover, Overview and Defense chapters' text, and the Foundry journal's pages.
 * The records are NOT veiled first: the unveiled record carries the capture rung and the tensions, so a reader path that
 * read them would show here.
 *
 * THE DOOR (re-record only on purpose, never by hand): SAFETY_READER_BYTES_RECORD=1 npx vitest run tests/ui/safetyReaderBytes.test.jsx
 */
import React from 'react';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { SIZES } from '../components/pageCensusWalk.shared.mjs';

const PINNED = join(dirname(fileURLToPath(import.meta.url)), 'safetyReaderBytes.base.json');
const RECORD = process.env.SAFETY_READER_BYTES_RECORD === '1';
const sha = (s) => createHash('sha256').update(s).digest('hex');

/** The PDF's text leaves (the goldenViewModel idiom: the sections are plain hook-free functions). */
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}

/** The reader audiences of the screen, as OutputContainer passes them. */
const READERS = {
  gallery: { publicDossier: true, playerView: true },
  revealShare: { publicDossier: true, playerView: false },
  playerShare: { publicDossier: false, playerView: true },
};
const TABS = { overview: OverviewTab, defense: DefenseTab };

/** @param {any} s @returns {Record<string, string>} each reader surface's hash */
function readerHashes(s) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [tab, Tab] of Object.entries(TABS)) for (const [who, props] of Object.entries(READERS)) {
    const { container } = render(<Tab settlement={s} narrativeNote={null} {...props} />);
    out[`${tab}.${who}`] = sha(container.innerHTML);
    cleanup();
  }
  const vm = buildViewModel({ settlement: s });
  out['pdf.vm'] = sha(JSON.stringify(vm));
  out['pdf.cover'] = sha(collectText(Cover({ settlement: s, vm })).join('\n'));
  out['pdf.overview'] = sha(collectText(Overview({ settlement: s, vm })).join('\n'));
  out['pdf.defense'] = sha(collectText(DefenseSecurity({ settlement: s, vm })).join('\n'));
  out.foundry = sha(JSON.stringify(buildJournalPages(vm, { settlement: s }).map((p) => [p.name, p.markdown])));
  return out;
}

/** @type {Record<string, Record<string, string>>} */
const now = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 50; i++) {
    const seed = `hxd-${size}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    now[seed] = readerHashes(s);
  }
  if (RECORD) writeFileSync(PINNED, `${JSON.stringify(now, null, 1)}\n`);
}, 1800000);

describe('every reader, shared and public path prints the bytes it printed before the owner\'s line', () => {
  test('the pinned list exists and covers the 300', () => {
    expect(existsSync(PINNED)).toBe(true);
    expect(Object.keys(JSON.parse(readFileSync(PINNED, 'utf8'))).length).toBe(300);
  });
  test('each town\'s every reader surface hashes as pinned', () => {
    const pinned = JSON.parse(readFileSync(PINNED, 'utf8'));
    const moved = [];
    for (const [seed, hashes] of Object.entries(now)) for (const [where, h] of Object.entries(hashes)) {
      if (pinned[seed]?.[where] !== h) moved.push(`${seed} ${where}`);
    }
    const surfaces = Object.values(now).reduce((n, h) => n + Object.keys(h).length, 0);
    console.log(`READER BYTES: ${Object.keys(now).length} towns, ${surfaces} reader surfaces hashed, ${moved.length} moved`);
    expect(moved).toEqual([]);
  });
});
