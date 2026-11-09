/**
 * @vitest-environment jsdom
 *
 * THE PUBLIC PAGE PRINTS THE OWNER'S PLAYER VIEW (STYLE-RULINGS-2 B10(a); lane SW-B7b PROJECTION,
 * the chair's law of 12:5x: public = the owner's PLAYER-audience view minus the veiled rows,
 * byte for byte).
 *
 * For each lit desk family's tabs, on the twelve fixture towns (soak1k-0..11):
 *   A — the owner's record, rendered as the owner's player view (`playerView`);
 *   B — the shared page: the record stamped by the save path's composer, projected
 *       (`projectShareVeil(toPublicSafe(stamped))`) and rendered `publicDossier`.
 * The prose lines (six words or more, by paragraph) that A prints and B does not must be NONE:
 * every sentence the owner's player view prints, the shared page prints, character for character.
 * RED-FIRST: at each family's parent the shared page drew SILENT there, so A − B held its corpus.
 *
 * And RULE 1 rendered: an UNSTAMPED record (a save not yet re-published) prints none of the
 * shipped sentences — silence, never a re-draw.
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';

afterEach(cleanup);

const TOWNS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/**
 * The lit tabs, each as the router mounts it (OutputContainer.jsx's cases).
 * @type {Record<string, (s: any, gate: {publicDossier?: boolean, playerView?: boolean}) => React.ReactElement>}
 */
const TABS = {
  economics: (s, gate) => <EconomicsTab settlement={s} narrativeNote={null} {...gate} />,
  services: (s, gate) => <ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} {...gate} />,
  resources: (s, gate) => <ResourcesTab settlement={s} narrativeNote={null} {...gate} />,
  daily_life: (s, gate) => <DailyLifeTab settlement={s} {...gate} />,
};

/**
 * The lines a tab prints from a desk family NOT YET LIT, by family: the remainder A − B is
 * exactly these until that family's cause lands and deletes its entry.
 * @type {Record<string, (owner: any) => ReadonlyArray<string|null>>}
 */
const PENDING = {
  // DS-GEN-18, the general desk's craft reason, which the economics tab hosts.
  economics: (owner) => [generalDeskLines(owner, { playerView: true, tier: owner?.tier }).economics.craftReasonLine],
};

/** @type {Record<number, {owner: any, shared: any, unstamped: any}>} */
const towns = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of TOWNS) {
    const owner = birth(i).settlement;
    const stamped = withPublicProse(owner, composePublicProse(owner));
    towns[i] = {
      owner,
      shared: projectShareVeil(toPublicSafe(stamped), null),
      unstamped: projectShareVeil(toPublicSafe(owner), null),
    };
  }
}, 120_000);

/** The prose lines a render prints: each paragraph's text, six words or more. */
function proseLines(element) {
  const { container, unmount } = render(element);
  const lines = [...container.querySelectorAll('p')]
    .map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim())
    .filter((t) => t.split(' ').length >= 6);
  unmount();
  return lines;
}

describe('the shared page prints the owner\'s player view, line for line', () => {
  for (const tab of Object.keys(TABS)) {
    it.each(TOWNS)(`${tab}, soak1k-%i: the owner's player-view lines are all on the shared page`, (i) => {
      const { owner, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true }));
      const b = new Set(proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })));
      expect(a.length).toBeGreaterThan(0);
      const pending = (PENDING[tab]?.(owner) ?? []).filter(Boolean);
      expect(a.filter((line) => !b.has(line))).toEqual(a.filter((line) => pending.includes(line)));
    });
  }
});

describe('RULE 1, rendered: an unstamped record prints silence where the desk speaks', () => {
  it.each(TOWNS)('economics, soak1k-%i: the shipped-only lines are absent from the unstamped page', (i) => {
    const { owner, shared, unstamped } = towns[i];
    const lit = new Set(proseLines(TABS.economics(shared, { publicDossier: true, playerView: true })));
    const dark = new Set(proseLines(TABS.economics(unstamped, { publicDossier: true, playerView: true })));
    const ownerLines = proseLines(TABS.economics(owner, { playerView: true }));
    const shippedOnly = ownerLines.filter((line) => lit.has(line) && !dark.has(line));
    // anchored: the lit page carries desk lines the dark one lacks, so the absence is not vacuous
    expect(shippedOnly.length).toBeGreaterThan(0);
    expect([...dark].filter((line) => shippedOnly.includes(line))).toEqual([]);
  });
});

describe('the legacy fallbacks have left: the shared page never reaches them (item 6)', () => {
  /** @type {Record<string, {tab: string, text: (owner: any) => unknown}>} */
  const FALLBACKS = {
    'prosperity.js situationDesc (the Economics lead)': { tab: 'economics', text: (o) => o.economicState?.situationDesc },
    'geographyData.js rated line (strategicValue)': { tab: 'resources', text: (o) => o.resourceAnalysis?.strategicValue },
  };
  for (const [name, { tab, text }] of Object.entries(FALLBACKS)) {
    it.each(TOWNS)(`${name}, soak1k-%i: on neither the stamped nor the unstamped shared page`, (i) => {
      const { owner, shared, unstamped } = towns[i];
      const line = String(text(owner) || '');
      expect(line.length).toBeGreaterThan(0);
      for (const page of [shared, unstamped]) {
        const { container, unmount } = render(TABS[tab](page, { publicDossier: true, playerView: true }));
        const printed = (container.textContent || '').replace(/\s+/g, ' ');
        unmount();
        // anchored: the record carries the line (asserted above), so its absence is the page's choice
        expect(printed.includes(line)).toBe(false);
      }
    });
  }
});
