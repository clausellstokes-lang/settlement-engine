/** @vitest-environment jsdom */
// PAGE-4 MAGIC-AUDIENCE, point 4: "A shared, player or public page's other bytes do not move (hash the rendered reader
// views before and after)." Renders the Overview and the Magic tab for the player view (the record, playerView) and the
// public page (`toPublicSafe(record)`, publicDossier) over the chair's 300 and the brief's three made-up documents, and
// writes one line per (document, audience, tab): `<doc> <audience> <tab> <sha256 of the rendered HTML>`, then a digest of
// the list. Run at base and at tip (readerHash.vitest.config.mjs); the two outputs are diffed.
import React from 'react';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../../../../../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../../../../../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { OverviewTab } from '../../../../../../../src/components/new/tabs/OverviewTab.jsx';
import MagicTab from '../../../../../../../src/components/new/tabs/MagicTab.jsx';
import { toPublicSafe } from '../../../../../../../src/domain/display/publicSafe.js';
import { generateSettlementPipeline } from '../../../../../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';
import { SIZES } from '../../../../../../../tests/components/pageCensusWalk.shared.mjs';

const sha = (/** @type {string} */ s) => createHash('sha256').update(s).digest('hex');
const madeUp = () => ({
  name: 'Made-up Hollow', tier: 'village',
  config: { magicExists: true, priorityMagic: 50, magicLevel: 'medium' },
  institutions: [{ name: 'Parish church', category: 'Religious' }],
  npcs: [],
  defenseProfile: { scores: { magical: 5 } },
  economicState: { activeChains: [{ chainId: 'divine_healing', label: 'Divine & Magical Healing', needKey: 'healing_medicine', processingInstitutions: ['Parish church'], outputs: ['Medical care (basic)', 'Spellcasting (minor)'], services: ['healing', 'magic'], status: 'running' }] },
});

test('reader views hashed', async () => {
  await loadGenerationLawPayloads();
  /** @type {Array<[string, any]>} */ const docs = [
    ['made-up', madeUp()],
    ['made-up-unsupplied', { ...madeUp(), institutions: [] }],
    ['made-up-strong', { ...madeUp(), economicState: { activeChains: [] }, defenseProfile: { scores: { magical: 85 } } }],
  ];
  for (const size of SIZES) for (let i = 0; i < 50; i++) {
    const seed = `hxd-${size}-${i}`;
    docs.push([seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })]);
  }
  /** @type {string[]} */ const lines = [];
  for (const [key, t] of docs) {
    for (const [aud, doc, flags] of /** @type {const} */ ([['player', t, { playerView: true }], ['public', toPublicSafe(t), { publicDossier: true }]])) {
      for (const [tab, El] of /** @type {const} */ ([['overview', OverviewTab], ['magic', MagicTab]])) {
        const { container, unmount } = render(<El settlement={doc} {...flags} />);
        lines.push(`${key} ${aud} ${tab} ${sha(container.innerHTML)}`);
        unmount(); cleanup();
      }
    }
  }
  lines.push(`COUNT ${lines.length} LIST-DIGEST ${sha(lines.join('\n'))}`);
  writeFileSync(String(process.env.READER_HASH_OUT), `${lines.join('\n')}\n`);
  expect(lines.length).toBe(303 * 4 + 1);
}, 1_200_000);
