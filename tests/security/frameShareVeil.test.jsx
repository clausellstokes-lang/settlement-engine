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
 * The PDF and the Foundry module carry no player variant (`PDF_VARIANTS`, pinned below: a new variant reds here and must
 * be classed before it ships).
 */
import { createHash } from 'node:crypto';
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cloneElement } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';

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
   for (const [seed, tier] of BORN) {
    const s = birth(seed, tier);
    if (process.env.FRAME_VEIL_PRINT) { // the measuring run (at the base, where no frame exists): the digests only
      const reads = await sharedReadsOf(s);
      appendFileSync(process.env.FRAME_VEIL_PRINT, `${JSON.stringify([seed, Object.fromEntries(Object.entries(reads).map(([k, v]) => [k, digest(v)]))])}\n`);
      continue;
    }
    const own = composeTonightSheet(s, { audience: 'owner' });
    // 1. liveness
    expect(own.frame, 'the owner\'s record casts a frame').toBeTruthy();
    if (WITH_CRIMINAL.has(seed)) expect(own.frame.sides.some((d) => d.kind === 'criminal'), 'a side names the criminal power').toBe(true);
    const lines = frameLinesOf(own);
    const ownText = tableOf(s, 'owner').text;
    for (const line of lines) expect(ownText, `the owner's Table View prints "${line}"`).toContain(line[0].toUpperCase() + line.slice(1));

    const reads = await sharedReadsOf(s);
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
   }
  }, 600000);

  test(`the gate is the FIRST lock: on the owner's own seeded record, a reader who is not the owner gets the no-frame sheet (${BORN.length} born towns)`, () => {
    for (const [seed, tier] of BORN) {
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
    }
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
      const lines = frameLinesOf(composeTonightSheet(s, { audience: 'owner' }));
      expect(lines.length, `${seed}: the owner's frame has lines to look for`).toBeGreaterThan(1);
      towns.push({ seed, lines, reads: await sharedReadsOf(s) });
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
    for (const { seed, lines, reads } of towns) {
      const pages = [
        ['the gallery page', <PublicDossierView key="g" dossier={reads.gallery} />],
        ['the gallery page (DM content shared)', <PublicDossierView key="d" dossier={reads.galleryDmFull} />],
        ["the party link's page", <PartyLinkView key="p" dossier={reads.partyLink} auth={{ user: null }} onReport={() => {}} />],
      ];
      for (const [where, element] of pages) {
        const got = await openSheetOn(element);
        expect(got.sheet.length, `${seed} on ${where}: the sheet drew`).toBeGreaterThan(0);
        expect(got.sides, `${seed} on ${where}: no sides`).toBe(false);
        expect(got.sheet.includes(TONIGHT_COPY.trouble), `${seed} on ${where}: the sheet opens on no trouble`).toBe(false);
        expect(got.page.includes(TONIGHT_COPY.sides), `${seed} on ${where}: the sides' eyebrow`).toBe(false);
        for (const line of lines) expect(got.page.includes(line[0].toUpperCase() + line.slice(1)), `${seed} on ${where} prints "${line}"`).toBe(false);
      }
    }
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
