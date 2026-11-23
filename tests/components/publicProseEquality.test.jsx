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
 *
 * ── RE-STATED: VEIL-41 C2-BUILD (a') (2707d6829, the chair's N49, N72 (1), N78) ──────────
 * A SHARED READ SERVES NO publicProse; THE OWNER'S READ PRINTS ITS OWN. Both engines now drop
 * the key on every non-owner read (212 :: _gallery_veil_withhold_always, galleryWithholdAlways.js
 * :: withholdAlways), so the shared page prints no shipped sentence. Every arm above is re-stated
 * to that truth and keeps a liveness anchor: the owner's page still prints its prose lines
 * (counted > 0, read from the projection BEFORE the veil, `toPublicSafe(withPublicProse(...))`),
 * and the served shared read carries no `publicProse` key and prints none of those lines, but for
 * the LOCAL lines named below (a shared tab's own draw from served fields that happens to equal
 * a composed string; each counted live on the twelve).
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { rederiveForPage } from '../../src/domain/veil/pageRederive.js';
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
import { shadowCaptureShown } from '../../src/domain/display/shadowEconomyShown.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defenseDeskRead, DEFENSE_LENSES } from '../../src/components/new/defenseDeskRead.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { magicDeskRead } from '../../src/components/new/magicDeskRead.js';
import { isolationDeskRead } from '../../src/components/new/viabilityDeskRead.js';
import SteadingsSection from '../../src/components/new/tabs/SteadingsSection.jsx';
import { faithDeskReadings, warFaithDeskRungs } from '../../src/components/new/tabs/WarFaithDesk.jsx';
import { powerDeskRead, powerDeskReadings, governanceAccountRead } from '../../src/components/new/powerDeskRead.js';

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
  power: (s, gate) => <PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} {...gate} />,
  faith: (s, gate) => <FaithTab settlement={s} {...gate} />,
  magic: (s, gate) => <MagicTab settlement={s} {...gate} />,
};

/**
 * WHERE EVERY FAMILY A TAB HOSTS IS LIT, the remainder A − B is NONE. A tab that also prints a
 * family not yet lit (or a line the projection's own field set strips) is pinned per family
 * below instead, and joins this list in the cause that completes it.
 */
const COMPLETE = ['economics', 'services', 'resources', 'daily_life', 'history', 'defense', 'magic', 'viability', 'overview'];

/**
 * THE VEILED ROWS, per tab: lines the owner's player view prints that the projection strips by
 * law, so the shared page's silence there is the veil, not a gap. The crisis card's "Hook:" rows
 * read `crisisHook` (the `hook` denylist token; §6.3 finding 3, ruled veiled).
 * @type {Record<string, (line: string) => boolean>}
 */
const VEILED = {
  overview: (line) => line.startsWith('Hook: '),
};

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

/**
 * The Shadow Economy card's three scale notes, READ FROM THE SHIPPED SOURCE (EconomicsTab.jsx's own `scaleNote`
 * expression), never written here: a rewrite of the card's words moves this list with it. Read once, lazily.
 * @type {string[] | null}
 */
let shadowScaleNotes = null;
function shadowScaleNotesOf() {
  if (shadowScaleNotes) return shadowScaleNotes;
  const src = readFileSync(join(process.cwd(), 'src/components/new/tabs/EconomicsTab.jsx'), 'utf8');
  const expr = src.match(/const scaleNote = ([\s\S]*?);\n/)?.[1] ?? '';
  shadowScaleNotes = [...expr.matchAll(/'((?:[^'\\]|\\.)+)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
  return shadowScaleNotes;
}
/**
 * THE LOCAL LINES (VEIL-41 (a')): with no publicProse served, a shared tab still prints its own draw
 * from served fields, and a few of those lines equal a composed string. They are named here by their
 * source, never by the line; each is counted live on the twelve below.
 *   economics: EconomicsTab.jsx's Shadow Economy card, its scale note by the served
 *     `economicState.safetyProfile.blackMarketCapture` (shadowCaptureShown), three bands;
 *   defense: the served `economicState.safetyProfile.safetyDesc` and `.guardEffectivenessDesc`,
 *     printed verbatim, and the Defense tab's ring note `criminalStructureOf(shared).note`.
 * @type {Record<string, (shared: any) => string[]>}
 */
const LOCAL = {
  economics: (s) => (shadowCaptureShown(s?.economicState?.safetyProfile) == null ? [] : shadowScaleNotesOf()),
  defense: (s) => [
    s?.economicState?.safetyProfile?.safetyDesc,
    s?.economicState?.safetyProfile?.guardEffectivenessDesc,
    criminalStructureOf(s)?.note,
  ].filter((x) => typeof x === 'string' && x !== ''),
};
/** Is this composed string a LOCAL line of the tab's shared draw (part of a named local source)? */
const isLocal = (tab, shared, str) => (LOCAL[tab]?.(shared) ?? []).some((line) => line.includes(str));

/** Every sentence-length string the projection carries, every site, at any depth. */
function composedStrings(record) {
  const blocks = record?.publicProse?.blocks || {};
  return [...new Set(Object.keys(blocks).flatMap((site) => shippedStrings(record, site)))];
}

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

/** @type {Record<number, {owner: any, projected: any, shared: any, unstamped: any}>} */
const towns = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of TOWNS) {
    const owner = birth(i).settlement;
    const stamped = withPublicProse(owner, composePublicProse(owner));
    // R2 (VEIL-21; VR19 (c), VR33): the shared page is the page's own read of an unmarked share: the projection and the
    // page's re-derivation of what the server withholds on every read (src/lib/gallery.js :: sanitizeDossier ->
    // src/domain/veil/pageRederive.js, `unveiled`: the share carries no veil). R2-CURE (the chair's ruling of 04:27 UTC):
    // the comparison is with the OWNER'S OWN RECORD, unaltered; the page draws what the owner's page draws, by identity
    // (R2 had compared it with the owner's record less the black market's capture, which moved the owner's law band)
    // VEIL-41 (a'): `projected` is the projection BEFORE the veil, where the lines still ship (the owner's composed
    // prose, counted there); `shared` is the served read, which carries no publicProse key
    towns[i] = {
      owner,
      projected: toPublicSafe(stamped),
      shared: rederiveForPage(projectShareVeil(toPublicSafe(stamped), null), { unveiled: true }),
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

/** The owner's composed strings (the projection before the veil) that the owner's page of this tab prints. */
function ownerProseOn(tab, { owner, projected }) {
  const a = proseLines(TABS[tab](owner, { playerView: true })).join('\n');
  return composedStrings(projected).filter((str) => a.includes(str));
}

describe('a shared read serves no publicProse; the owner\'s read prints its own (VEIL-41 (a\'), re-stated from "line for line")', () => {
  for (const tab of COMPLETE) {
    it.each(TOWNS)(`${tab}, soak1k-%i: the owner's page prints its lines; the served shared read carries no publicProse key and prints none of its prose`, (i) => {
      const { owner, projected, shared } = towns[i];
      const veiled = VEILED[tab] ?? (() => false);
      const a = proseLines(TABS[tab](owner, { playerView: true })).filter((line) => !veiled(line));
      const b = proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })).join('\n');
      expect(a.length).toBeGreaterThan(0);
      expectPresentThenAbsent(Object.keys(projected), Object.keys(shared), 'publicProse', `${tab}, soak1k-${i}: the key leaves on the served read`);
      // anchored: ownerProseOn is counted > 0 per tab on the twelve in the arm below, so an empty list is a judgment
      expect(ownerProseOn(tab, towns[i]).filter((str) => b.includes(str) && !isLocal(tab, shared, str))).toEqual([]);
    });
    it(`${tab}: not vacuous, the owner's page prints its composed prose on the twelve`, () => {
      const hits = TOWNS.reduce((n, i) => n + ownerProseOn(tab, towns[i]).length, 0);
      expect(hits).toBeGreaterThan(0);
    });
  }
  it('the LOCAL lines are live: each named local source prints on the shared page somewhere on the twelve, and only there', () => {
    // the card's three bands are read from its source (a band lost there reds here)
    expect(shadowScaleNotesOf()).toHaveLength(3);
    for (const tab of Object.keys(LOCAL)) {
      const hits = TOWNS.filter((i) => {
        const b = proseLines(TABS[tab](towns[i].shared, { publicDossier: true, playerView: true })).join('\n');
        return ownerProseOn(tab, towns[i]).some((str) => b.includes(str) && isLocal(tab, towns[i].shared, str));
      });
      expect(hits.length, `${tab}: a LOCAL source the shared page prints`).toBeGreaterThan(0);
    }
  }, 120_000);
});

describe('each lit family: what the owner\'s player view prints from it, the served shared read does not (VEIL-41 (a\'))', () => {
  for (const [tab, sites] of Object.entries(SITES)) {
    it.each(TOWNS)(`${tab} (${sites.join(', ')}), soak1k-%i`, (i) => {
      const { owner, projected, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true })).join('\n');
      const b = proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })).join('\n');
      // the site's lines as they ship on the projection BEFORE the veil; the served read carries none
      const printed = sites.flatMap((site) => shippedStrings(projected, site)).filter((str) => a.includes(str));
      expect(sites.flatMap((site) => shippedStrings(shared, site))).toEqual([]);
      // anchored: the family arm below counts each site's printed lines > 0 on the twelve, so an empty list is a judgment
      expect(printed.filter((str) => b.includes(str) && !isLocal(tab, shared, str))).toEqual([]);
    });
  }
  it('the family arm is not vacuous: every lit site prints on the owner\'s page somewhere on the twelve', () => {
    for (const [tab, sites] of Object.entries(SITES)) {
      for (const site of sites) {
        const hits = TOWNS.filter((i) => {
          const a = proseLines(TABS[tab](towns[i].owner, { playerView: true })).join('\n');
          return shippedStrings(towns[i].projected, site).some((str) => a.includes(str));
        });
        expect(hits.length, `${tab} :: ${site}`).toBeGreaterThan(0);
      }
    }
  }, 120_000); // its own budget: a corpus walk at the edge of the 20 s default on a CI runner under coverage (measured 2026-11-18: ~20 s there)
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
  // The saved record's player view: no played world, so the blocs are dormant (owner-only).
  'power:desk': {
    tab: 'power',
    draw: (o) => powerDeskRead(o, { playerView: true, readings: powerDeskReadings(o, { playerView: true }) }),
  },
  'power:governance': { tab: 'power', draw: (o) => governanceAccountRead(o) },
  'warFaith:faith': {
    tab: 'faith',
    draw: (o) => warFaithDeskRungs({ settlement: o, publicDossier: false, playerView: true, readings: faithDeskReadings(o) }),
  },
  magic: { tab: 'magic', draw: (o) => magicDeskRead(o, { playerView: true }) },
  viability: { tab: 'viability', draw: (o) => isolationDeskRead(o, { playerView: true }) },
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

describe('each later family, from the owner\'s own draw: what the owner\'s player view prints, the served shared read does not (VEIL-41 (a\'))', () => {
  for (const [site, { tab, draw }] of Object.entries(DRAWN)) {
    it.each(TOWNS)(`${site} on ${tab}, soak1k-%i`, (i) => {
      const { owner, shared } = towns[i];
      const a = proseLines(TABS[tab](owner, { playerView: true })).join('\n');
      const b = proseLines(TABS[tab](shared, { publicDossier: true, playerView: true })).join('\n');
      const printed = drawnStrings(draw(owner)).filter((str) => a.includes(str));
      // anchored: the not-vacuous arm beside this one counts the owner's printed draw > 0 on the twelve, so an empty list is a judgment
      expect(printed.filter((str) => b.includes(str) && !isLocal(tab, shared, str))).toEqual([]);
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

describe('RULE 1, rendered: an unstamped record prints silence where the desk speaks; with (a\') the stamped share does too', () => {
  it.each(TOWNS)('economics, soak1k-%i: the shipped-only lines are absent from the unstamped page and from the served stamped share', (i) => {
    const { owner, projected, shared, unstamped } = towns[i];
    const lit = proseLines(TABS.economics(shared, { publicDossier: true, playerView: true })).join('\n');
    const dark = proseLines(TABS.economics(unstamped, { publicDossier: true, playerView: true })).join('\n');
    const a = proseLines(TABS.economics(owner, { playerView: true })).join('\n');
    // VEIL-41 (a'): the shipped-only lines are the owner's composed strings (the projection before the veil), LOCAL ones aside
    // (each page's LOCAL lines read from its own served fields: the page re-derives the capture the server withholds)
    const shippedOnly = composedStrings(projected).filter((str) => a.includes(str));
    // anchored: the owner's page prints its shipped lines on every town, so the absence below is not vacuous
    expect(shippedOnly.length).toBeGreaterThan(0);
    expect(shippedOnly.filter((str) => dark.includes(str) && !isLocal('economics', unstamped, str))).toEqual([]);
    expect(shippedOnly.filter((str) => lit.includes(str) && !isLocal('economics', shared, str))).toEqual([]);
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

describe('general:steadings stays SILENT on the shared page in this wave (the chair\'s ruling 18:1x)', () => {
  // A lifecycle grade and an ancient ruin arise over campaign time (0 of 300 towns carry either at
  // birth), and campaign readings are OWNER-ONLY in this wave: the shared page prints nothing where
  // the owner's view prints DS-GEN-8's lines, never a re-draw. The record is planted as the pulse
  // writes it (settlementLifecycleFirstClass.js: the grade on the record AND on `config`).
  // The cure shapes, for the post-deploy campaign-aware projection packet: (1) SteadingsSection takes
  // worldState instead of the store; (2) the composer's reads admitted as a true shape change.
  const planted = (i) => {
    const base = birth(i).settlement;
    return {
      ...base,
      lifecycleStatus: 'abandoned_site',
      config: { ...(base.config || {}), lifecycleStatus: 'abandoned_site' },
      history: { ...(base.history || {}), ancientRuin: { name: 'Old Vellan', yearsAgo: 340 } },
    };
  };
  /** The section's leaf lines of six words or more. */
  const leafLines = (el) => {
    const { container, unmount } = render(el);
    const lines = [...container.querySelectorAll('div')].filter((d) => d.children.length === 0)
      .map((d) => (d.textContent || '').trim()).filter((t) => t.split(' ').length >= 6);
    unmount();
    return lines;
  };
  it.each([0, 4, 9])('soak1k-%i planted: the owner\'s player view prints both desk lines, the shared page neither', (i) => {
    const owner = planted(i);
    const projection = composePublicProse(owner);
    // RED-FIRST: red the day the composer ships a steadings block without the rung that admits it.
    expect(Object.keys(projection?.blocks || {}).filter((site) => site.includes('steadings'))).toEqual([]);
    const shared = projectShareVeil(toPublicSafe(withPublicProse(owner, projection)), null);
    const desk = generalDeskLines(owner, {
      playerView: true, tier: owner.tier, steadings: [], lifecycleStatus: 'abandoned_site', ancientRuin: owner.history.ancientRuin,
    }).steadings;
    const drawn = [desk.remnantLine, desk.ruinLine].filter(Boolean);
    const a = leafLines(<SteadingsSection settlement={owner} playerView />);
    const b = leafLines(<SteadingsSection settlement={shared} publicDossier playerView />);
    // anchored: the owner's player view prints both desk lines on the planted record
    expect(drawn.filter((line) => a.includes(line))).toHaveLength(2);
    expect(drawn.filter((line) => b.includes(line))).toEqual([]);
  });
});

describe('the dossier search prints a found shipped block verbatim (SW-B7b item 3); the served shared read ships none (VEIL-41 (a\'))', () => {
  it.each([0, 4])('soak1k-%i: a defense lens line renders as one paragraph of the carried text where the block is carried, and is not found on the served shared read', async (i) => {
    const { default: DossierSearchResults } = await import('../../src/components/dossier/DossierSearchResults.jsx');
    const { projected, shared } = towns[i];
    // the line as it ships on the projection BEFORE the veil (the mechanism's own record)
    const desk = /** @type {any} */ (publicProseOf(projected, 'defense:threat')) || {};
    const line = desk.beasts?.sentence || desk.invasion?.sentence;
    expect(line).toBeTruthy();
    const search = (record) => {
      const { container, unmount } = render(
        <DossierSearchResults settlement={record} query={line} tabs={[{ id: 'defense', label: 'Defense' }]}
          publicDossier playerView onOpenTab={() => {}} />,
      );
      const found = [...container.querySelectorAll('[data-search-object="prose"] p')].map((p) => p.textContent);
      unmount();
      return found;
    };
    const carried = search(projected);
    // NO NEW WORDS: the paragraph is the carried strings, and the query's line is among them.
    expect(carried.length).toBe(1);
    expect(carried[0]).toContain(line);
    // anchored: the same search finds the line where the block is carried (above); the served read carries no block
    expect(publicProseOf(shared, 'defense:threat')).toBe(null);
    expect(search(shared)).toEqual([]);
  });
});
