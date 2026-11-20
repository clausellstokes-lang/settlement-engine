/** @vitest-environment jsdom */
/**
 * tests/security/frameShareVeil.test.jsx — THE FRAME REACHES NO SHARED PAGE (FRAME-1, the seventh chair's CF3: "the frame
 * may name a criminal faction as a side; on a page players see, that gives away what the DM hid").
 *
 * Born towns of every tier, two of them with a frame that names the criminal power. On each:
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
 * The PDF and the Foundry module carry no player variant (`PDF_VARIANTS`, pinned below: a new variant reds here and must
 * be classed before it ships).
 */
import { createHash } from 'node:crypto';
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
  isConfigured: true,
}));
vi.mock('../../src/store/index.js', () => {
  const data = { auth: { tier: 'premium' }, isElevated: () => false, phase: 'draft', systemState: null, eventLog: [], campaigns: [], savedSettlements: [] };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  return { useStore };
});

import { supabase } from '../../src/lib/supabase.js';
import { fetchPublicDossier, fetchDossierForImport } from '../../src/lib/gallery.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';
import { PDF_VARIANTS } from '../../src/pdf/variants.js';
import TableView from '../../src/components/TableView.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const BORN = [
  ['frame-calm-thorp-0', 'thorp'], ['frame-calm-hamlet-0', 'hamlet'], ['frame-calm-village-0', 'village'],
  ['frame-calm-town-0', 'town'], ['frame-calm-city-0', 'city'], ['frame-calm-city-1', 'city'],
  ['frame-calm-metropolis-1', 'metropolis'], ['frame-calm-metropolis-3', 'metropolis'],
];
const WITH_CRIMINAL = new Set(['frame-calm-city-0', 'frame-calm-metropolis-1']);

/** The digests of every shared read, per town, measured at the base 85fccf898 (FRAME_VEIL_PRINT=<file> writes them there). */
const DIGESTS = Object.freeze({
  'frame-calm-thorp-0': Object.freeze({ gallery: '138f0dab1824d809', galleryDmFull: 'fb3f9dbb3520bd77', partyLink: '79682b895f18217f', imported: '5e98227a073406bf', worldPlayer: '927e4033f02d4c21' }),
  'frame-calm-hamlet-0': Object.freeze({ gallery: '73de0d4979c916bd', galleryDmFull: '6dd173337186a2f0', partyLink: '56ec5192aa5d5805', imported: '099e6b8946565f03', worldPlayer: '07d47ca833c1a332' }),
  'frame-calm-village-0': Object.freeze({ gallery: 'd470028016c09694', galleryDmFull: '9a53d31e23c50da8', partyLink: 'd7f1a6e63736a50e', imported: '9de485b2443a6bc4', worldPlayer: '0ddf530540e158fd' }),
  'frame-calm-town-0': Object.freeze({ gallery: '25b5a76edef99296', galleryDmFull: 'ab5bd3a795ff607e', partyLink: '3d89064da86105b3', imported: '1008fcacc62fb782', worldPlayer: '87e30bb713960100' }),
  'frame-calm-city-0': Object.freeze({ gallery: 'aeeb73e7db33b8b8', galleryDmFull: '40d242b25526be71', partyLink: '30b797aacfb8bb8a', imported: 'a72da96e8fba7997', worldPlayer: '92e6443041d1f8b5' }),
  'frame-calm-city-1': Object.freeze({ gallery: '8631ab6992ec1388', galleryDmFull: '3ecc0ce3536a6698', partyLink: 'c39c698d99df6396', imported: 'c9166bd9b29b3bbf', worldPlayer: 'c18e028156c419e4' }),
  'frame-calm-metropolis-1': Object.freeze({ gallery: 'ac7f4027a0717df2', galleryDmFull: 'ca467c3b3cca53f8', partyLink: '49e1a31363ecbe53', imported: '8438fd8061b17bd7', worldPlayer: '2023640a9e8e695d' }),
  'frame-calm-metropolis-3': Object.freeze({ gallery: 'f1ed437fa7457497', galleryDmFull: '4444c6e88d43c0fe', partyLink: 'a59fa8e76015abc0', imported: 'e79de9f5d766643f', worldPlayer: '19df47c70a903538' }),
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

/** The Table View's text, and whether it drew the sheet at all (its `data-tonight-sheet` section). */
const tableOf = (s) => {
  const { container } = render(<TableView settlement={s} onClose={() => {}} />);
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
    const own = composeTonightSheet(s);
    // 1. liveness
    expect(own.frame, 'the owner\'s record casts a frame').toBeTruthy();
    if (WITH_CRIMINAL.has(seed)) expect(own.frame.sides.some((d) => d.kind === 'criminal'), 'a side names the criminal power').toBe(true);
    const lines = frameLinesOf(own);
    const ownText = tableOf(s).text;
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
      expect(composeTonightSheet(shared).frame, `${key}: no frame`).toBe(null);
      const { text, drew } = tableOf(shared);
      expect(drew, `${key}: the Table View draws the sheet`).toBe(true);
      for (const line of lines) expect(text.includes(line[0].toUpperCase() + line.slice(1)), `${key} prints "${line}"`).toBe(false);
      expect(text.includes(TONIGHT_COPY.sides), `${key} prints the sides' eyebrow`).toBe(false);
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
