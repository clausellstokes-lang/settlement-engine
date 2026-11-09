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
import { publicProseOf, withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { stressorsDeskRead } from '../../src/components/new/stressorsDeskRead.js';
import { overviewStressesOf, criminalStructureOf } from '../../src/components/new/deskHostArgs.js';
import { defenseDeskRead, DEFENSE_LENSES } from '../../src/components/new/defenseDeskRead.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';

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
  overview: (s, gate) => <OverviewTab settlement={s} narrativeNote={null} {...gate} />,
  history: (s, gate) => <HistoryTab settlement={s} narrativeNote={null} {...gate} />,
  viability: (s, gate) => <ViabilityTab settlement={s} narrativeNote={null} {...gate} />,
  defense: (s, gate) => <DefenseTab settlement={s} narrativeNote={null} {...gate} />,
};

/**
 * WHERE EVERY FAMILY A TAB HOSTS IS LIT, the remainder A − B is NONE. A tab that also prints a
 * family not yet lit (or a line the projection's own field set strips) is pinned per family
 * below instead, and joins this list in the cause that completes it.
 */
const COMPLETE = ['economics', 'services', 'resources', 'daily_life', 'history', 'defense'];

/**
 * THE LIT FAMILIES' SITES, by tab: every string the save shipped at these sites that the owner's
 * player view prints, the shared page prints, character for character.
 * @type {Record<string, ReadonlyArray<string>>}
 */
const SITES = {
  economics: ['economy:economics', 'general:economics'],
  services: ['economy:services'],
  resources: ['economy:resources'],
  daily_life: ['economy:daily_life'],
  overview: ['general:overview', 'stressors:overview'],
  history: ['general:history'],
  viability: ['general:viability'],
};

/** Every string in a shipped site, at any depth. */
function shippedStrings(record, site) {
  const out = [];
  const walk = (v) => {
    if (typeof v === 'string') { if (v.split(' ').length >= 4) out.push(v); return; }
    if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(publicProseOf(record, site));
  return out;
}

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
  for (const tab of COMPLETE) {
    it.each(TOWNS)(`${tab}, soak1k-%i: every owner player-view line is on the shared page`, (i) => {
      const { owner, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true }));
      const b = new Set(proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })));
      expect(a.length).toBeGreaterThan(0);
      expect(a.filter((line) => !b.has(line))).toEqual([]);
    });
  }
});

describe('each lit family: what the owner\'s player view prints from it, the shared page prints', () => {
  for (const [tab, sites] of Object.entries(SITES)) {
    it.each(TOWNS)(`${tab} (${sites.join(', ')}), soak1k-%i`, (i) => {
      const { owner, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true })).join('\n');
      const b = proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })).join('\n');
      const printed = sites.flatMap((site) => shippedStrings(shared, site)).filter((str) => a.includes(str));
      expect(printed.filter((str) => !b.includes(str))).toEqual([]);
    });
  }
  it('the family arm is not vacuous: every lit site prints somewhere on the twelve', () => {
    for (const [tab, sites] of Object.entries(SITES)) {
      for (const site of sites) {
        const hits = TOWNS.filter((i) => {
          const a = proseLines(TABS[tab](towns[i].owner, { playerView: true })).join('\n');
          return shippedStrings(towns[i].shared, site).some((str) => a.includes(str));
        });
        expect(hits.length, `${tab} :: ${site}`).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * THE OWNER'S OWN DRAW, read through each later family's one caller exactly as its host tab calls
 * it on the owner's player view (never through the composer, so the pin does not grade the
 * composer by itself): every sentence of that draw the owner's page prints, the shared page
 * prints. RED-FIRST per family: before its cause the shared page drew SILENT at the site.
 * @type {Record<string, {tab: string, draw: (owner: any) => unknown}>}
 */
const DRAWN = {
  'stressors:overview': {
    tab: 'overview',
    draw: (o) => stressorsDeskRead(o, { playerView: true, stresses: overviewStressesOf(o), tier: o.tier }),
  },
  ...Object.fromEntries(DEFENSE_LENSES.map((lens) => [`defense:${lens}`, {
    tab: 'defense',
    draw: (o) => defenseDeskRead(o, { playerView: true, tier: o.tier, crimStructure: criminalStructureOf(o)?.key ?? null })[lens],
  }])),
};

/** Every sentence-length string in a drawn desk, at any depth (provenance skipped). */
function drawnStrings(desk) {
  const out = [];
  const walk = (v, key) => {
    if (key === 'provenance') return;
    if (typeof v === 'string') { if (v.split(' ').length >= 4) out.push(v); return; }
    if (v && typeof v === 'object') Object.entries(v).forEach(([k, c]) => walk(c, k));
  };
  walk(desk, '');
  return out;
}

describe('each later family, from the owner\'s own draw: what the owner\'s player view prints, the shared page prints', () => {
  for (const [site, { tab, draw }] of Object.entries(DRAWN)) {
    it.each(TOWNS)(`${site} on ${tab}, soak1k-%i`, (i) => {
      const { owner, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true })).join('\n');
      const b = proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })).join('\n');
      const printed = drawnStrings(draw(owner)).filter((str) => a.includes(str));
      expect(printed.filter((str) => !b.includes(str))).toEqual([]);
    });
    it(`${site}: not vacuous, the owner's page prints its draw on the twelve`, () => {
      const hits = TOWNS.filter((i) => {
        const a = proseLines(TABS[tab](towns[i].owner, { playerView: true })).join('\n');
        return drawnStrings(draw(towns[i].owner)).some((str) => a.includes(str));
      });
      expect(hits.length).toBeGreaterThan(0);
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
    // T2-20's static line: owner reach 0 of 300 (player and DM, measured before the cause), shared
    // page 37 of 300 (soak1k-6 first) — a shared-page-only composition, so it GOES (15:2x's test).
    'DefenseTab.jsx T2-20 static line': { tab: 'defense', text: () => 'No organized criminal infrastructure detected' },
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
