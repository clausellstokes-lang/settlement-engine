/** @vitest-environment jsdom */
/**
 * tests/security/frameShareVeil.test.jsx — THE FRAME REACHES NO SHARED PAGE (FRAME-1, the seventh chair's CF3: "the frame
 * may name a criminal faction as a side; on a page players see, that gives away what the DM hid").
 *
 * Born calm towns that carry a TROUBLE OF WEIGHT (FRAME-2 · B2, CF11: only such a town casts a frame), one or more of
 * every tier that births one, hamlet to metropolis, two of them with a frame that names the criminal power (chosen by
 * measuring the 330-town calm pool: docs/chair/2026-11-20/content/frame2/B2-WEIGHT-RESULTS.md). No calm thorp of the
 * 330 holds a trouble of weight, so no thorp casts a frame to veil; the thorps' sheets are held byte-identical to the
 * working line's by tests/domain/tension/troubleWeight.test.js. (FRAME-1's eight towns were re-seated at B2c: five of
 * them no longer cast a frame under CF11.) On each:
 *   1. LIVENESS: the owner's own record casts a frame, and the Table View drawn from it prints the frame's lines (its
 *      sides' eyebrow and every face's reason). Without this the absences below would prove nothing.
 *   2. BYTE-IDENTITY: the gallery read (`fetchPublicDossier`, default and DM-full), the party link (its unlisted branch),
 *      the import (`fetchDossierForImport`) and the world export's player variant (`buildWorldExport`) carry the digests
 *      pinned below, measured at the lane's base (85fccf898) and unchanged at its tip: the frame stores nothing (CF2), so
 *      no shared read moves.
 *   3. ABSENCE: from every one of those projections the sheet composes no frame (the cast needs the record's `_seed`,
 *      which every projection strips), and the Table View drawn from it, the one sheet surface a shared page can open,
 *      prints none of the frame's lines.
 *   4. ONE DOOR: only the sheet's composer imports the cast, so no other surface can draw it.
 *   5. THE FIRST LOCK (FRAME-2 B3, the chair's ruling: "a reader who is not the owner gets today's sheet, never the
 *      frame; the missing seed stays a second lock, never the first"): the composer casts the frame only for the
 *      audience 'owner'. The owner's own SEEDED record, handed to it with no options, `{}`, any other audience or an
 *      undefined one, composes exactly the sheet a town with no frame composes.
 *   6. ON THE PAGES: the real gallery page (PublicDossierView) and the party link's page (PartyLinkView), each fed the
 *      town's shared read, open the Tonight sheet the way a viewer does (the Overview's "Open Tonight" sets the
 *      persisted `tableViewOpen` preference, and the page mounts the Table View on it: the security lane's gap, which
 *      this file does not cure); the sheet DRAWS there, and none of the frame's lines is on the page.
 *   7. THE CRISIS PAGE'S READER (FRAME-4 · U0, the chair's ruling of 2026-11-20: P1b's and P4a's lines are drawn for the
 *      owner only, behind the crisis page's explicit audience argument): towns born in a crisis; the owner's own
 *      surfaces (the live editor and the owner's saved view) mount the Crisis tab with the audience 'owner' (liveness:
 *      the tab draws its page); the gallery page (default and DM content shared) and the party link (Reveal DM off and
 *      on) mount NO Crisis tab (OutputContainer's own gate, the security lane's, untouched), so no crisis page is composed
 *      there for anyone, and any Crisis tab a page did mount would carry a reader who is not the owner.
 * The PDF and the Foundry module carry no player variant (`PDF_VARIANTS`, pinned below: a new variant reds here and must
 * be classed before it ships).
 */
import { createHash } from 'node:crypto';
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cloneElement } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';

// FRAME-4 · U0: the Crisis tab, recorded as it is mounted (who the page says reads it), and rendered as it is
const crisisMounts = vi.hoisted(() => /** @type {Array<{ said: boolean, audience: unknown }>} */ ([]));
vi.mock('../../src/components/new/tabs/CrisisTab.jsx', async (importOriginal) => {
  const real = await importOriginal();
  const { createElement } = await import('react');
  function RecordedCrisisTab(props) {
    crisisMounts.push({ said: Object.prototype.hasOwnProperty.call(props, 'audience'), audience: props.audience });
    return createElement(real.default, props);
  }
  return { ...real, default: RecordedCrisisTab };
});
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
  isConfigured: true,
}));
vi.mock('../../src/store/index.js', () => {
  const data = {
    auth: { tier: 'premium' }, isElevated: () => false, phase: 'draft', systemState: null, eventLog: [], campaigns: [], savedSettlements: [],
    // the persisted preference the Overview's "Open Tonight" writes and the page mounts the Table View on
    userPrefs: {}, setUserPref: (key, value) => { data.userPrefs = { ...data.userPrefs, [key]: value }; },
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import { supabase } from '../../src/lib/supabase.js';
import { useStore } from '../../src/store/index.js';
import { fetchPublicDossier, fetchDossierForImport } from '../../src/lib/gallery.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, TONIGHT_AUDIENCES, TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';
import { PDF_VARIANTS } from '../../src/pdf/variants.js';
import TableView from '../../src/components/TableView.jsx';
import PublicDossierView from '../../src/components/PublicDossierView.jsx';
import PartyLinkView from '../../src/components/PartyLinkView.jsx';
import OutputContainer from '../../src/components/OutputContainer.jsx';
import { composeCrisisPage, hasActiveCrisis } from '../../src/domain/crisis/crisisPage.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

afterEach(() => { cleanup(); vi.clearAllMocks(); useStore.getState().userPrefs = {}; });

// Each with its trouble of weight as measured: hamlet-7 trade_collapse (an impaired chain); village-0 tyranny (legitimacy
// below 45); village-76 legitimacy_crisis (the incumbent ungated); town-1 outside_debt (an impaired chain); city-8 and
// metropolis-8 crime_wave (a high conflict between the Military/Guard and the Thieves' Guild, both of them its sides; the
// criminal power on a side); metropolis-1 trade_dispute #2 and metropolis-5 trade_dispute (an impaired chain).
// RE-SEATED at FRAME-2 · B9 (W2 as written, the chair's ruling: a high conflict weighs only where BOTH its powers are
// the tension's sides): city-0 (crime_wave; its high row is the Craft Guilds vs the Thieves' Guild, and the Craft Guilds
// are no side) and city-4 (corruption_scandal; the City Council vs the Craft Guilds, the Craft Guilds no side) cast no
// frame now, and keep today's sheet (pinned in tests/domain/tension/troubleWeight.test.js); metropolis-1's crime_wave
// at #0 names the Military/Guard and the Thieves' Guild, but each of its high rows sets one of them against a power no
// side names (the Grand Guild Consortium, the Merchant Guilds, the Craft Guilds), so it opens on its trade_dispute at #2
// (an impaired chain), with no criminal side. city-8 and metropolis-8 are the first crime_wave opener of each tier that births one
// (12 survive on the 330-town pool: city 8, 14, 25, 33, 35, 45, 57; metropolis 8, 19, 56, 64, 68, every one with the
// criminal power on its third side), chosen by identity.
const BORN = [
  ['frame-calm-hamlet-7', 'hamlet'], ['frame-calm-village-0', 'village'], ['frame-calm-village-76', 'village'],
  ['frame-calm-town-1', 'town'], ['frame-calm-city-8', 'city'], ['frame-calm-metropolis-8', 'metropolis'],
  ['frame-calm-metropolis-1', 'metropolis'], ['frame-calm-metropolis-5', 'metropolis'],
];
const WITH_CRIMINAL = new Set(['frame-calm-city-8', 'frame-calm-metropolis-8']);

/**
 * The digests of every shared read, per town, measured at the base 85fccf898 (FRAME_VEIL_PRINT=<file> writes them there),
 * in an archive of that commit (B2c, 2026-11-20). The three towns FRAME-1 measured and B2c kept (village-0, city-0,
 * metropolis-1) re-measured to the same digests. RE-MEASURED at the merge of the line (FRAME-3, by the chair's ruling of
 * 2026-11-20) by this file's own FRAME_VEIL_PRINT door in an archive of the line `e356c94f2`, which carries no frame code:
 * the line's final names work (point 77) changes generated prose, so every shared read of every town moved; the base is
 * now the line. FRAME-2 · B9 (re-seated under W2 as written): city-8 and metropolis-8 measured by the same door in an
 * archive of the line `e356c94f2`, in the same run that gave the six kept towns their pinned digests again, and held
 * equal at the tip; city-0's and city-4's rows left with their towns.
 */
const DIGESTS = Object.freeze({
  'frame-calm-hamlet-7': Object.freeze({ gallery: '124ff33bddb5283d', galleryDmFull: '146bcb5d33de08d9', partyLink: '1113cb954bd598e1', imported: '5a349a1637786d2a', worldPlayer: '400ca8e595b27aef' }),
  'frame-calm-village-0': Object.freeze({ gallery: '8d26ab7fb85b8e56', galleryDmFull: 'e125edffe9ec531e', partyLink: 'bb0173cd3a8168c3', imported: '75edf25721e4f9a5', worldPlayer: '5525cabd392986d1' }),
  'frame-calm-village-76': Object.freeze({ gallery: '8f93b50759a87be4', galleryDmFull: 'bbba7ceceddba038', partyLink: '9321fd48ed18044f', imported: 'd5d0b750d328d55c', worldPlayer: 'ba7d857c7346fa23' }),
  'frame-calm-town-1': Object.freeze({ gallery: '594c0f4e581e1503', galleryDmFull: '04129133b43dbb5a', partyLink: '29ad2c4bc13527c6', imported: '0cfd209c7c2f3231', worldPlayer: '524aa22612e6cfad' }),
  'frame-calm-city-8': Object.freeze({ gallery: '8a1fb34d51a02402', galleryDmFull: '14941410eb8f06e4', partyLink: 'e5201063a77a0652', imported: '22d36cf721e99b17', worldPlayer: '314767bceab656e9' }),
  'frame-calm-metropolis-8': Object.freeze({ gallery: '1c84d1c415ab8511', galleryDmFull: '76f353a996e449e6', partyLink: '70a9d6184469f483', imported: '1aad6f4c026af231', worldPlayer: '5076ec24c35e8232' }),
  'frame-calm-metropolis-1': Object.freeze({ gallery: '34211488b2aab264', galleryDmFull: 'deccba4eb7587686', partyLink: 'a7aeb69a51aedfd8', imported: 'cca06e8dbce684fa', worldPlayer: '32a95948b1009748' }),
  'frame-calm-metropolis-5': Object.freeze({ gallery: 'e2af948b1e6224d3', galleryDmFull: 'ff023d73c2d56d8c', partyLink: 'c023565c1009067d', imported: 'cfa6fe241eeccbab', worldPlayer: '33a85130672d749e' }),
});

const digest = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);
const birth = (seed, tier) => generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
const row = (s, extra = {}) => ({ id: `id-${s._seed}`, name: s.name, tier: s.tier, public_slug: 'a1b2c3d4e5f6', data: structuredClone(s), ...extra });

/** Every shared read of one town, through the real client code (the server's RPC mocked to hand back the row). */
async function sharedReadsOf(s) {
  supabase.rpc
    .mockResolvedValueOnce({ data: [row(s)], error: null })
    .mockResolvedValueOnce({ data: null, error: null })
    .mockResolvedValueOnce({ data: [{ net_votes: 0, voted: false }], error: null })
    .mockResolvedValueOnce({ data: [], error: null })
    .mockResolvedValueOnce({ data: [], error: null });
  const gallery = await fetchPublicDossier('a1b2c3d4e5f6');
  supabase.rpc
    .mockResolvedValueOnce({ data: [row(s, { gallery_share_dm: true })], error: null })
    .mockResolvedValueOnce({ data: null, error: null })
    .mockResolvedValueOnce({ data: [{ net_votes: 0, voted: false }], error: null })
    .mockResolvedValueOnce({ data: [], error: null })
    .mockResolvedValueOnce({ data: [], error: null });
  const galleryDmFull = await fetchPublicDossier('a1b2c3d4e5f6');
  supabase.rpc
    .mockResolvedValueOnce({ data: [], error: null })
    .mockResolvedValueOnce({ data: { id: `id-${s._seed}`, name: s.name, tier: s.tier, slug: 'u1u2u3u4u5u6', dossier: structuredClone(s), author_name: 'A', is_owner: false }, error: null });
  const partyLink = await fetchPublicDossier('u1u2u3u4u5u6');
  supabase.rpc.mockResolvedValueOnce({ data: [row(s)], error: null });
  const imported = await fetchDossierForImport('a1b2c3d4e5f6');
  const worldPlayer = buildWorldExport({ name: 'Realm', settlements: [{ id: 'm1', name: s.name, settlement: structuredClone(s) }] }, { variant: 'player' });
  return { gallery, galleryDmFull, partyLink, imported, worldPlayer };
}
/** The settlement a shared read hands the page. */
const recordOf = (key, read) => (key === 'worldPlayer' ? read.settlements[0].dossier : read.settlement);

/** The frame's own lines on a sheet: the sides' eyebrow, every side's words with its reason, the absent side's words. */
const frameLinesOf = (sheet) => (sheet.frame ? [TONIGHT_COPY.sides, ...sheet.frame.sides.filter((d) => d.kind).map((d) => d.reason)] : []);

/** The Table View's text, and whether it drew the sheet at all (its `data-tonight-sheet` section); no audience is a stranger. */
const tableOf = (s, audience) => {
  const { container } = render(<TableView settlement={s} audience={audience} onClose={() => {}} />);
  const out = { text: container.textContent || '', drew: !!container.querySelector('[data-tonight-sheet]') };
  cleanup();
  return out;
};

describe('CF3: the frame reaches no shared page', () => {
  test(`${BORN.length} born towns: live on the owner's record; every shared read byte-identical to the base and frame-free`, async () => {
    if (process.env.FRAME_VEIL_PRINT) { // the measuring run (at the base, where no frame exists): the digests only
      for (const [seed, tier] of BORN) {
        const reads = await sharedReadsOf(birth(seed, tier));
        appendFileSync(process.env.FRAME_VEIL_PRINT, `${JSON.stringify([seed, Object.fromEntries(Object.entries(reads).map(([k, v]) => [k, digest(v)]))])}\n`);
      }
      return;
    }
    // every town's shared reads first (the reads are async; collectSeedFailures is synchronous), then every town is
    // asserted and its failures collected, so a red reports every failing town, not the first (seedLoopTotality)
    const towns = new Map();
    for (const [seed, tier] of BORN) {
      const s = birth(seed, tier);
      towns.set(seed, { s, reads: await sharedReadsOf(s) });
    }
    const failures = collectSeedFailures([...towns.keys()], (seed) => {
      const { s, reads } = towns.get(seed);
      const own = composeTonightSheet(s, { audience: 'owner' });
      // 1. liveness
      expect(own.frame, 'the owner\'s record casts a frame').toBeTruthy();
      if (WITH_CRIMINAL.has(seed)) expect(own.frame.sides.some((d) => d.kind === 'criminal'), 'a side names the criminal power').toBe(true);
      const lines = frameLinesOf(own);
      const ownText = tableOf(s, 'owner').text;
      for (const line of lines) expect(ownText, `the owner's Table View prints "${line}"`).toContain(line[0].toUpperCase() + line.slice(1));

      // 2. byte-identity with the base
      const got = Object.fromEntries(Object.entries(reads).map(([k, v]) => [k, digest(v)]));
      expect(got).toEqual(DIGESTS[seed]);
      // 3. absence
      for (const [key, read] of Object.entries(reads)) {
        const shared = recordOf(key, read);
        expect(shared && typeof shared === 'object', `${key} hands the page a record`).toBe(true);
        expect(shared._seed, `${key} carries no seed`).toBeUndefined();
        expect(composeTonightSheet(shared).frame ?? null, `${key}: no frame`).toBe(null);
        expect(composeTonightSheet(shared, { audience: 'owner' }).frame ?? null, `${key}: no frame even for the owner (the second lock)`).toBe(null);
        const { text, drew } = tableOf(shared);
        expect(drew, `${key}: the Table View draws the sheet`).toBe(true);
        for (const line of lines) expect(text.includes(line[0].toUpperCase() + line.slice(1)), `${key} prints "${line}"`).toBe(false);
        expect(text.includes(TONIGHT_COPY.sides), `${key} prints the sides' eyebrow`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'every born town is live on the owner\'s record, and every shared read is byte-identical to the base and frame-free');
  }, 600000);

  test(`the gate is the FIRST lock: on the owner's own seeded record, a reader who is not the owner gets the no-frame sheet (${BORN.length} born towns)`, () => {
    const failures = collectSeedFailures(BORN, ([seed, tier]) => {
      const s = birth(seed, tier);
      expect(typeof s._seed === 'string' && s._seed.length > 0, `${seed}: the owner's record carries its seed`).toBe(true);
      // liveness: the owner casts the frame
      const owned = composeTonightSheet(s, { audience: 'owner' });
      expect(owned.frame, `${seed}: the owner's record casts a frame for the owner`).toBeTruthy();
      // the no-frame sheet: the same record without the seed (what a town with no frame composes today)
      const { _seed, ...unseeded } = s;
      const noFrame = composeTonightSheet(unseeded, { audience: 'owner' });
      expect(noFrame.frame ?? null, `${seed}: the reference sheet carries no frame`).toBe(null);
      expect(owned, `${seed}: the frame changes the sheet (else equality below proves nothing)`).not.toEqual(noFrame);
      /** @type {Array<[string, any]>} */
      const strangers = [
        ['no options', composeTonightSheet(s)],
        ['{}', composeTonightSheet(s, {})],
        ["{ audience: 'player' }", composeTonightSheet(s, { audience: 'player' })],
        ["{ audience: 'gallery' }", composeTonightSheet(s, { audience: 'gallery' })],
        ['{ audience: undefined }', composeTonightSheet(s, { audience: undefined })],
      ];
      for (const [label, sheet] of strangers) {
        expect(sheet.frame ?? null, `${seed} ${label}: no frame`).toBe(null);
        expect(sheet, `${seed} ${label}: exactly the no-frame sheet`).toEqual(noFrame);
      }
    });
    expectNoSeedFailures(failures, 'on every born town\'s own seeded record, a reader who is not the owner gets the no-frame sheet');
  }, 600000);

  test('the audiences are a closed, frozen set; only the owner\'s draws the frame', () => {
    expect(Object.isFrozen(TONIGHT_AUDIENCES)).toBe(true);
    expect(Object.values(TONIGHT_AUDIENCES).sort()).toEqual(['gallery', 'owner', 'player']);
  });

  test(`the sheet opens ON the gallery page and ON the party link (${BORN.length} born towns), and the frame never rides it`, async () => {
    // every shared read first, so no page's own fetches can take a queued answer meant for a read
    const towns = [];
    for (const [seed, tier] of BORN) {
      const s = birth(seed, tier);
      towns.push({ seed, lines: frameLinesOf(composeTonightSheet(s, { audience: 'owner' })), reads: await sharedReadsOf(s) });
    }
    /** Open the sheet on a rendered page as a viewer does: the Overview's "Open Tonight", then the page mounts the Table View. */
    const openSheetOn = async (element) => {
      const view = render(element);
      const open = await within(view.container).findByText(TONIGHT_COPY.open, {}, { timeout: 60000 });
      fireEvent.click(open.closest('button') || open);
      expect(useStore.getState().userPrefs.tableViewOpen, 'the button writes the persisted preference').toBe(true);
      view.rerender(cloneElement(element)); // the store's notification (the mocked store does not subscribe): a fresh element re-renders the page
      await waitFor(() => expect(view.container.querySelector('[data-tonight-sheet]')).toBeTruthy(), { timeout: 60000 });
      const sheet = view.container.querySelector('[data-tonight-sheet]');
      const out = { page: view.container.textContent || '', sheet: sheet.textContent || '', sides: !!sheet.querySelector('[data-tonight-sides]') };
      cleanup();
      useStore.getState().userPrefs = {};
      return out;
    };
    // every page of every town opened (async), each page's outcome kept, its own error included (a page that fails to
    // open is cleaned up and the next one opens); then every town asserted and its failures collected (seedLoopTotality)
    const opened = new Map();
    for (const { seed, lines, reads } of towns) {
      const pages = [
        ['the gallery page', <PublicDossierView key="g" dossier={reads.gallery} />],
        ['the gallery page (DM content shared)', <PublicDossierView key="d" dossier={reads.galleryDmFull} />],
        ["the party link's page", <PartyLinkView key="p" dossier={reads.partyLink} auth={{ user: null }} onReport={() => {}} />],
      ];
      const seen = [];
      for (const [where, element] of pages) {
        try {
          seen.push({ where, got: await openSheetOn(element) });
        } catch (error) {
          cleanup();
          useStore.getState().userPrefs = {};
          seen.push({ where, error });
        }
      }
      opened.set(seed, { lines, seen });
    }
    const failures = collectSeedFailures([...opened.keys()], (seed) => {
      const { lines, seen } = opened.get(seed);
      expect(lines.length, `${seed}: the owner's frame has lines to look for`).toBeGreaterThan(1);
      for (const { where, got, error } of seen) {
        if (error) throw error;
        expect(got.sheet.length, `${seed} on ${where}: the sheet drew`).toBeGreaterThan(0);
        expect(got.sides, `${seed} on ${where}: no sides`).toBe(false);
        expect(got.sheet.includes(TONIGHT_COPY.trouble), `${seed} on ${where}: the sheet opens on no trouble`).toBe(false);
        expect(got.page.includes(TONIGHT_COPY.sides), `${seed} on ${where}: the sides' eyebrow`).toBe(false);
        for (const line of lines) expect(got.page.includes(line[0].toUpperCase() + line.slice(1)), `${seed} on ${where} prints "${line}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'on every born town, the sheet opens on the gallery page and the party link, and the frame never rides it');
  }, 600000);

  test('U0: the owner\'s own surfaces mount the Crisis tab for the owner; the gallery page and the party link mount none', async () => {
    // B7's forced births (`b7-<kind>-<tier>-<i>`): one crisis of each nature the P-units draw on (a natural famine, the
    // engineered infiltration, the external debt)
    const CRISIS = [['b7-famine-town-0', 'famine'], ['b7-infiltrated-town-0', 'infiltrated'], ['b7-indebted-town-0', 'indebted']];
    const towns = [];
    for (const [seed, kind] of CRISIS) {
      const s = generateSettlementPipeline({ settType: 'town', stressType: kind }, null, { seed, customContent: {} });
      towns.push({ seed, s, reads: await sharedReadsOf(s) });
    }
    /** Render a page, wait for its tab strip, open the Crisis tab where the page offers one; what was mounted, for whom. */
    const visit = async (element) => {
      crisisMounts.length = 0;
      const view = render(element);
      await within(view.container).findByRole('tab', { name: /Overview/ }, { timeout: 60000 });
      const tab = view.container.querySelector('#sf-tab-crisis');
      let drew = false;
      if (tab) {
        fireEvent.click(tab);
        await waitFor(() => expect(view.container.querySelector('[data-testid="crisis-tab"]')).toBeTruthy(), { timeout: 60000 });
        drew = view.container.querySelectorAll('[data-testid="crisis-section"]').length > 0;
      }
      const out = { offered: !!tab, drew, mounts: crisisMounts.slice() };
      cleanup();
      return out;
    };
    const seen = new Map();
    for (const { seed, s, reads } of towns) {
      const pages = [
        ['owner', 'the live editor', <OutputContainer key="e" settlement={s} />],
        ['owner', "the owner's saved view", <OutputContainer key="v" settlement={s} readOnly saveId="u0-own-save" />],
        ['stranger', 'the gallery page', <PublicDossierView key="g" dossier={reads.gallery} />],
        ['stranger', 'the gallery page (DM content shared)', <PublicDossierView key="d" dossier={reads.galleryDmFull} />],
        ['stranger', "the party link's page (Reveal DM off)", <PartyLinkView key="p" dossier={reads.partyLink} auth={{ user: null }} onReport={() => {}} />],
        ['stranger', "the party link's page (Reveal DM on)", <PartyLinkView key="q" dossier={{ ...reads.partyLink, shareDm: true }} auth={{ user: null }} onReport={() => {}} />],
      ];
      const got = [];
      for (const [who, where, element] of pages) {
        try { got.push({ who, where, ...(await visit(element)) }); } catch (error) { cleanup(); got.push({ who, where, error }); }
      }
      seen.set(seed, { s, reads, got });
    }
    const failures = collectSeedFailures([...seen.keys()], (seed) => {
      const { s, reads, got } = seen.get(seed);
      expect(hasActiveCrisis(s), `${seed}: born in its crisis`).toBe(true);
      for (const key of ['gallery', 'galleryDmFull', 'partyLink']) {
        // the shared record still holds the crisis: the absence below is the page's gate, not a calm town
        expect(hasActiveCrisis(reads[key].settlement), `${seed} ${key}: the shared record holds the crisis`).toBe(true);
        for (const options of [undefined, {}, { audience: TONIGHT_AUDIENCES.player }, { audience: TONIGHT_AUDIENCES.gallery }]) {
          expect(composeCrisisPage(reads[key].settlement, options), `${seed} ${key}: a stranger's page is today's`).toEqual(composeCrisisPage(reads[key].settlement));
        }
      }
      for (const { who, where, offered, drew, mounts, error } of got) {
        if (error) throw error;
        if (who === 'owner') {
          expect(offered, `${seed} on ${where}: the Crisis tab is offered`).toBe(true);
          expect(drew, `${seed} on ${where}: the Crisis tab draws its page`).toBe(true);
          expect(mounts.length, `${seed} on ${where}: the Crisis tab mounted`).toBeGreaterThan(0);
          for (const m of mounts) expect(m, `${seed} on ${where}: mounted for the owner`).toEqual({ said: true, audience: TONIGHT_AUDIENCES.owner });
        } else {
          expect(offered, `${seed} on ${where}: no Crisis tab is offered`).toBe(false);
          expect(mounts, `${seed} on ${where}: no Crisis tab is mounted`).toEqual([]);
          for (const m of mounts) expect(m.audience, `${seed} on ${where}: never the owner`).not.toBe(TONIGHT_AUDIENCES.owner);
        }
      }
    });
    expectNoSeedFailures(failures, 'on every crisis town, the owner\'s surfaces mount the Crisis tab for the owner, and no shared page mounts one');
  }, 600000);

  test('one door: only the sheet\'s composer imports the trouble cast', () => {
    const importers = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(?:js|jsx|mjs)$/.test(name) && !p.includes(join('src', 'domain', 'tension'))
          && /from\s+['"][^'"]*tension\/troubleCast\.js['"]/.test(readFileSync(p, 'utf8'))) importers.push(p.replace(/\\/g, '/'));
      }
    };
    walk('src');
    expect(importers).toEqual(['src/domain/summary/tonightSheet.js']);
  });

  test('no export variant is a player variant: the PDF and Foundry variants are the DM\'s four (a new one reds and is classed first)', () => {
    expect(Object.keys(PDF_VARIANTS).sort()).toEqual(['campaign_state', 'canon_dossier', 'draft_brief', 'timeline_packet']);
  });
});

// FRAME-5 · P1B (B7 §P1b; the chair's ruling of 2026-11-20, vetoable by the owner: the infiltration's outside hand is
// reached through a lodging keeper on the OWNER's crisis page only, behind U0's audience argument). Two of B7's forced
// infiltrations whose instigator is absent as "an outside hand, unnamed" and whose record holds a free lodging keeper. The
// owner's live editor draws the words on its Crisis tab (liveness: red at the base); the gallery page (default and DM
// content shared) and the party link (Reveal DM off and on) offer no Crisis tab and print none of them; every reader who
// is not the owner, of the shared record and of the owner's own record, composes today's crisis page, without them.
describe('P1B: the outside hand\'s keeper is drawn for the owner only', () => {
  const P1B_TOWNS = [
    ['b7-infiltrated-hamlet-1', 'hamlet', 'Chae Yang keeps the alehouse where its people come and go'],
    ['b7-infiltrated-town-0', 'town', 'Peppo Schubert keeps the taverns where its people come and go'],
  ];
  const STRANGER_OPTIONS = [undefined, null, {}, { audience: undefined }, { audience: TONIGHT_AUDIENCES.player }, { audience: TONIGHT_AUDIENCES.gallery }, { audience: 'Owner' }];
  const handLine = (page) => page.find((x) => x.type === 'infiltrated')?.absent.find((a) => a.role === 'instigator')?.reason ?? null;

  test(`the owner's Crisis tab reaches the hand; no shared page and no other reader does (${P1B_TOWNS.length} born towns)`, async () => {
    const towns = [];
    for (const [seed, tier, words] of P1B_TOWNS) {
      const s = generateSettlementPipeline({ settType: tier, stressType: 'infiltrated' }, null, { seed, customContent: {} });
      towns.push({ seed, words, s, reads: await sharedReadsOf(s) });
    }
    /** Render a page, wait for its tab strip, open the Crisis tab where offered; the page's text. */
    const visit = async (element) => {
      crisisMounts.length = 0;
      const view = render(element);
      await within(view.container).findByRole('tab', { name: /Overview/ }, { timeout: 60000 });
      const tab = view.container.querySelector('#sf-tab-crisis');
      let absent = [];
      if (tab) {
        fireEvent.click(tab);
        await waitFor(() => expect(view.container.querySelector('[data-testid="crisis-tab"]')).toBeTruthy(), { timeout: 60000 });
        absent = [...view.container.querySelectorAll('[data-testid="crisis-cast-absent"]')].map((p) => p.textContent || '');
      }
      const out = { offered: !!tab, absent, text: view.container.textContent || '', mounts: crisisMounts.slice() };
      cleanup();
      return out;
    };
    const seen = new Map();
    for (const { seed, words, s, reads } of towns) {
      const pages = [
        ['owner', 'the live editor', <OutputContainer key="e" settlement={s} />],
        ['stranger', 'the gallery page', <PublicDossierView key="g" dossier={reads.gallery} />],
        ['stranger', 'the gallery page (DM content shared)', <PublicDossierView key="d" dossier={reads.galleryDmFull} />],
        ['stranger', "the party link's page (Reveal DM off)", <PartyLinkView key="p" dossier={reads.partyLink} auth={{ user: null }} onReport={() => {}} />],
        ['stranger', "the party link's page (Reveal DM on)", <PartyLinkView key="q" dossier={{ ...reads.partyLink, shareDm: true }} auth={{ user: null }} onReport={() => {}} />],
      ];
      const got = [];
      for (const [who, where, element] of pages) {
        try { got.push({ who, where, ...(await visit(element)) }); } catch (error) { cleanup(); got.push({ who, where, error }); }
      }
      seen.set(seed, { words, s, reads, got });
    }
    const failures = collectSeedFailures([...seen.keys()], (seed) => {
      const { words, s, reads, got } = seen.get(seed);
      // the owner's record: the words for the owner, today's page for every other reader
      expect(handLine(composeCrisisPage(s, { audience: TONIGHT_AUDIENCES.owner })), `${seed}: the owner's line`).toBe(`an outside hand, unnamed; ${words}`);
      for (const options of STRANGER_OPTIONS) {
        expect(composeCrisisPage(s, options), `${seed} ${JSON.stringify(options)}: today's page on the owner's record`).toEqual(composeCrisisPage(s));
      }
      expect(handLine(composeCrisisPage(s)), `${seed}: today's line`).toBe('an outside hand, unnamed');
      // every shared record: today's page for every reader who is not the owner, and none of the words
      for (const key of ['gallery', 'galleryDmFull', 'partyLink']) {
        const shared = reads[key].settlement;
        expect(hasActiveCrisis(shared), `${seed} ${key}: the shared record holds the crisis`).toBe(true);
        for (const options of STRANGER_OPTIONS) {
          const page = composeCrisisPage(shared, options);
          expect(page, `${seed} ${key} ${JSON.stringify(options)}: today's page`).toEqual(composeCrisisPage(shared));
          expect(JSON.stringify(page).includes(words), `${seed} ${key} ${JSON.stringify(options)}: no keeper for the hand`).toBe(false);
        }
      }
      for (const { who, where, offered, absent, text, mounts, error } of got) {
        if (error) throw error;
        if (who === 'owner') {
          expect(offered, `${seed} on ${where}: the Crisis tab is offered`).toBe(true);
          for (const m of mounts) expect(m, `${seed} on ${where}: mounted for the owner`).toEqual({ said: true, audience: TONIGHT_AUDIENCES.owner });
          expect(absent.some((line) => line.endsWith(`an outside hand, unnamed; ${words}`)), `${seed} on ${where}: the tab prints the owner's line`).toBe(true);
        } else {
          expect(offered, `${seed} on ${where}: no Crisis tab is offered`).toBe(false);
          expect(mounts, `${seed} on ${where}: no Crisis tab is mounted`).toEqual([]);
          expect(text.includes(words), `${seed} on ${where}: the page prints no keeper for the hand`).toBe(false);
        }
      }
    });
    expectNoSeedFailures(failures, 'on every infiltrated town, the owner\'s Crisis tab reaches the hand, and no shared page or other reader does');
  }, 600000);
});

/**
 * FRAME-5 · CF12 (the chair's CF11 amended, 2026-11-20): A HALL IN CRIMINAL HANDS WITH A LIVE CRIME WAVE (W4) DRAWS FOR
 * THE OWNER ONLY. Capture is what the share veil hides (display/publicSafe.js deletes `captureState` from every power row
 * of a public projection; the DM layer keeps it), so on every shared path the sheet is TODAY'S, byte for byte. The five
 * calm towns of the 330-town pool that W4 frames (a power at `captureState` corrupted, a `crime_wave` among their
 * tensions, no other trouble of weight; measured in docs/chair/2026-11-20/content/frame5/CF12-CAPTURED-HALL-RESULTS.md):
 *   1. LIVENESS: the owner's own record opens on the crime wave (W4), and its sheet is not today's.
 *   2. THE FIRST LOCK: on that same seeded record, no options, `{}`, `'player'` and `'gallery'` compose today's sheet.
 *   3. THE SHARED READS (the gallery read, default and DM content shared; the party link): every reader, the owner
 *      included, composes today's sheet; and where the veil has deleted `captureState` the record holds no W4 even with
 *      its seed handed back (the SECOND lock, never the first).
 *   4. ON THE PAGES: the gallery page (default, DM content shared) and the party link's page (Reveal DM off and on) open
 *      today's sheet, with no sides and none of the owner's frame lines.
 * TODAY is the base 8991b83b2: each digest below was written there by this block's own door (CF12_VEIL_PRINT=<file>), in
 * an archive of that commit.
 */
describe('CF12: a hall in criminal hands with a live crime wave draws for the owner only', () => {
  const W4_BORN = [['frame-calm-town-20', 'town'], ['frame-calm-town-80', 'town'], ['frame-calm-city-12', 'city'], ['frame-calm-city-49', 'city'], ['frame-calm-metropolis-51', 'metropolis']];
  const SHARED_KEYS = ['gallery', 'galleryDmFull', 'partyLink'];
  const STRANGER_READERS = [['no options', []], ['{}', [{}]], ["{ audience: 'player' }", [{ audience: TONIGHT_AUDIENCES.player }]], ["{ audience: 'gallery' }", [{ audience: TONIGHT_AUDIENCES.gallery }]]];
  const EVERY_READER = [...STRANGER_READERS, ["{ audience: 'owner' }", [{ audience: TONIGHT_AUDIENCES.owner }]]];
  /**
   * The shared reads whose record keeps no `captureState` on any power row (measured at the base by the door). The gallery
   * read with DM content shared keeps it (the DM layer), and its sheet is the seeded record's: there the first lock and the
   * missing seed hold the frame back, as they hold back every strain's.
   */
  const VEILED = new Set(['gallery', 'partyLink']);
  /** Today's sheets at the base, by town: the seeded record's, each shared read's, and each page's sheet text. */
  const TODAY = Object.freeze({
    'frame-calm-town-20': Object.freeze({ seeded: 'd0d5036ee3166d5d', gallery: '7d4e8243b449b935', galleryDmFull: 'd0d5036ee3166d5d', partyLink: '7d4e8243b449b935', pageGallery: 'a164d9fc3f7692fe', pageGalleryDm: '1984854d1c0e72dc', pagePartyLink: 'a164d9fc3f7692fe', pagePartyLinkDm: 'a164d9fc3f7692fe' }),
    'frame-calm-town-80': Object.freeze({ seeded: '0784580bafc90b0f', gallery: '83bb1d9fe390e496', galleryDmFull: '0784580bafc90b0f', partyLink: '83bb1d9fe390e496', pageGallery: '126742f0d588b970', pageGalleryDm: '6beb6f5ffb912a4c', pagePartyLink: '126742f0d588b970', pagePartyLinkDm: '126742f0d588b970' }),
    'frame-calm-city-12': Object.freeze({ seeded: 'fba3eba5d1cfe000', gallery: 'f90f8903b6c1ddda', galleryDmFull: 'fba3eba5d1cfe000', partyLink: 'f90f8903b6c1ddda', pageGallery: '7572dcb094c83e4e', pageGalleryDm: 'b1615ae330ca5887', pagePartyLink: '7572dcb094c83e4e', pagePartyLinkDm: '7572dcb094c83e4e' }),
    'frame-calm-city-49': Object.freeze({ seeded: '3396a0085c6038b7', gallery: 'e8972ef18c6064ff', galleryDmFull: '3396a0085c6038b7', partyLink: 'e8972ef18c6064ff', pageGallery: '1b34b6727b04945f', pageGalleryDm: '8b345dd8cdb50e39', pagePartyLink: '1b34b6727b04945f', pagePartyLinkDm: '1b34b6727b04945f' }),
    'frame-calm-metropolis-51': Object.freeze({ seeded: '26998fa42bb502f5', gallery: '2f1c225266d1827a', galleryDmFull: '26998fa42bb502f5', partyLink: '2f1c225266d1827a', pageGallery: '2ea68c783a42ff58', pageGalleryDm: '6c76aedfcedf2aa2', pagePartyLink: '2ea68c783a42ff58', pagePartyLinkDm: '2ea68c783a42ff58' }),
  });
  const print = process.env.CF12_VEIL_PRINT;
  const keepsCapture = (rec) => (rec?.powerStructure?.factions || []).some((f) => f && Object.hasOwn(f, 'captureState'));

  /** Open the sheet on a rendered page as a viewer does (the Overview's "Open Tonight"), as the B3 arm above does. */
  const openSheetOn = async (element) => {
    const view = render(element);
    const open = await within(view.container).findByText(TONIGHT_COPY.open, {}, { timeout: 60000 });
    fireEvent.click(open.closest('button') || open);
    view.rerender(cloneElement(element));
    await waitFor(() => expect(view.container.querySelector('[data-tonight-sheet]')).toBeTruthy(), { timeout: 60000 });
    const sheet = view.container.querySelector('[data-tonight-sheet]');
    const out = { page: view.container.textContent || '', sheet: sheet.textContent || '', sides: !!sheet.querySelector('[data-tonight-sides]') };
    cleanup();
    useStore.getState().userPrefs = {};
    return out;
  };

  test(`${W4_BORN.length} born towns: the owner's sheet opens on the crime wave; every other reader, every shared read and every page is today's`, async () => {
    const { troubleOfWeight, castTroubleFrame } = await import('../../src/domain/tension/troubleCast.js');
    const towns = new Map();
    for (const [seed, tier] of W4_BORN) {
      const s = birth(seed, tier);
      const reads = await sharedReadsOf(s);
      const lines = frameLinesOf(composeTonightSheet(s, { audience: TONIGHT_AUDIENCES.owner }));
      const pages = [
        ['pageGallery', <PublicDossierView key="g" dossier={reads.gallery} />],
        ['pageGalleryDm', <PublicDossierView key="d" dossier={reads.galleryDmFull} />],
        ['pagePartyLink', <PartyLinkView key="p" dossier={reads.partyLink} auth={{ user: null }} onReport={() => {}} />],
        ['pagePartyLinkDm', <PartyLinkView key="q" dossier={{ ...reads.partyLink, shareDm: true }} auth={{ user: null }} onReport={() => {}} />],
      ];
      const opened = {};
      for (const [key, element] of pages) {
        try { opened[key] = await openSheetOn(element); } catch (error) { cleanup(); useStore.getState().userPrefs = {}; opened[key] = { error }; }
      }
      towns.set(seed, { s, reads, lines, opened });
    }
    if (print) { // the measuring run, at the base (no W4 exists there): today's digests and which reads keep the field
      for (const [seed, { s, reads, opened }] of towns) {
        const row = { seeded: digest(composeTonightSheet(s)) };
        for (const key of SHARED_KEYS) { row[key] = digest(composeTonightSheet(recordOf(key, reads[key]))); row[`${key}KeepsCapture`] = keepsCapture(recordOf(key, reads[key])); }
        for (const [key, got] of Object.entries(opened)) row[key] = got.error ? `ERROR ${got.error}` : digest(got.sheet);
        appendFileSync(print, `${JSON.stringify([seed, row])}\n`);
      }
      return;
    }
    const failures = collectSeedFailures([...towns.keys()], (seed) => {
      const { s, reads, lines, opened } = towns.get(seed);
      const today = TODAY[seed];
      expect(today, `${seed}: today's digests are pinned`).toBeTruthy();
      // 1. liveness: the owner's own record opens on the crime wave, on W4, and its sheet is not today's
      expect(troubleOfWeight(s)?.strain, `${seed}: W4`).toEqual({ strain: 'W4', grade: 'hall-captured' });
      const own = composeTonightSheet(s, { audience: TONIGHT_AUDIENCES.owner });
      expect(own.frame?.type, `${seed}: the owner's sheet opens on the crime wave`).toBe('crime_wave');
      expect(digest(own), `${seed}: the owner's sheet is not today's (else the equalities below prove nothing)`).not.toBe(today.seeded);
      expect(lines.length, `${seed}: the owner's frame has lines to look for`).toBeGreaterThan(1);
      // 2. the first lock: every reader who is not the owner, on the owner's own seeded record
      for (const [label, args] of STRANGER_READERS) expect(digest(composeTonightSheet(s, ...args)), `${seed} ${label}: today's sheet`).toBe(today.seeded);
      // 3. the shared reads: today's sheet for every reader; the veiled record holds no W4, its seed handed back or not
      for (const key of SHARED_KEYS) {
        const shared = recordOf(key, reads[key]);
        expect(shared._seed, `${seed} ${key}: no seed`).toBeUndefined();
        expect(shared.history.currentTensions.some((t) => t.type === 'crime_wave'), `${seed} ${key}: the crime wave is still on the record`).toBe(true);
        expect(keepsCapture(shared), `${seed} ${key}: captureState ${VEILED.has(key) ? 'deleted' : 'kept (the DM layer)'}`).toBe(!VEILED.has(key));
        if (VEILED.has(key)) {
          expect(troubleOfWeight(shared), `${seed} ${key}: no W4 on the veiled record`).toBe(null);
          expect(castTroubleFrame({ ...shared, _seed: s._seed }), `${seed} ${key}: no frame with the seed handed back (the second lock)`).toBe(null);
        }
        for (const [label, args] of EVERY_READER) expect(digest(composeTonightSheet(shared, ...args)), `${seed} ${key} ${label}: today's sheet`).toBe(today[key]);
      }
      // 4. on the pages: the gallery page and the party link, Reveal DM off and on
      for (const [key, got] of Object.entries(opened)) {
        if (got.error) throw got.error;
        expect(digest(got.sheet), `${seed} on ${key}: today's sheet`).toBe(today[key]);
        expect(got.sides, `${seed} on ${key}: no sides`).toBe(false);
        for (const line of lines) expect(got.page.includes(line[0].toUpperCase() + line.slice(1)), `${seed} on ${key} prints "${line}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'on every W4 town, the owner\'s sheet opens on the crime wave and every other reader, read and page is today\'s');
  }, 900000);
});
