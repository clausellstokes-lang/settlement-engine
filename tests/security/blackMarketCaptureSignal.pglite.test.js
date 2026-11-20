/**
 * blackMarketCaptureSignal.pglite.test.js — THE CHAIR'S CONDITION ON `safety.blackMarketCapture`, MEASURED (VEIL-22,
 * R6 unit 3, 2026-11-20; docs/chair/2026-11-20/veil/out/v22/r6/R6-HANDBACK.md).
 *
 * THE CLAIM: the server withholds `economicState.safetyProfile.blackMarketCapture` on every non-owner read (R2, VR33:
 * registry row `safety.blackMarketCapture`, withhold-always). The page puts it back only where
 * src/domain/veil/pageRederive.js :: rederiveForPage(doc, { unveiled }) is told `unveiled`, which
 * src/lib/gallery.js :: sanitizeDossier computes as `!served && !readShareVeil(veilOverrides).marked` (on the party link
 * an unmarked share is first given the default veil). THE CONDITION, proved on born towns, through the server on a pglite
 * chain of every migration on disk and then through `sanitizeDossier`'s own path (it is not exported: the module's
 * public `fetchPublicDossier`, its rpc stubbed to return the server's row exactly as the server returned it):
 *   (i)  the decision depends on the SERVED signal alone (the row's `gallery_member_overrides` as served): the figure is
 *        drawn exactly where that signal says so, and a body read with another read's signal follows the signal;
 *   (ii) under a given signal the figure's presence is THE SAME FOR EVERY TOWN: a marked share (the default veil) draws
 *        it on NO town, whether or not the town has a criminal house; an unmarked share draws it on EVERY town, equal to
 *        the owner's stored figure; the party link never draws it on a marked share (nor, given the default veil, on an
 *        unmarked one). Reveal DM off and on. Towns are counted per arm, with and without a criminal house apart.
 * The report (env R6_OUT, a directory): blackmarket-capture-condition.json.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { bootChain, storeShare, BIRTH_DIALS } from './veilChain.shared.mjs';

vi.mock('../../src/lib/supabase.js', () => {
  const builder = () => {
    const b = {};
    for (const m of ['select', 'eq', 'in', 'order', 'range', 'limit', 'maybeSingle', 'single', 'update']) b[m] = vi.fn(() => b);
    b.then = (resolve) => resolve({ data: [], error: null, count: 0 });
    return b;
  };
  return {
    supabase: { from: vi.fn(() => builder()), rpc: vi.fn(() => Promise.resolve({ data: null, error: null })) },
    isConfigured: true,
  };
});

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const OUT = process.env.R6_OUT || null;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
/** The births (size, crisis): the counterfactual test's eight, and four more so both classes (with and without a
 * criminal house) hold several towns. */
const BIRTHS = [['town', 'infiltrated'], ['city', null], ['metropolis', null], ['city', 'insurgency'], ['town', null], ['metropolis', 'indebted'],
  ['village', null], ['city', 'famine'], ['village', 'infiltrated'], ['town', 'indebted'], ['hamlet', null], ['city', 'plague']];
const SIGNALS = ['marked', 'unmarked'];
const captureOf = (doc) => doc?.economicState?.safetyProfile?.blackMarketCapture;
const holds = (doc) => isRec(doc?.economicState?.safetyProfile) && 'blackMarketCapture' in doc.economicState.safetyProfile;

describe('the chair\'s condition on safety.blackMarketCapture: drawn by the served signal alone, the same on every town (through the server, then sanitizeDossier)', () => {
  let towns;
  let lib;

  beforeAll(async () => {
    const db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { isCriminalInstitution } = await import('../../src/domain/people/cardVeil.js');
    const { supabase } = await import('../../src/lib/supabase.js');
    const gallery = await import('../../src/lib/gallery.js');
    await loadGenerationLawPayloads();
    lib = { veil, supabase, gallery };

    let n = 0;
    towns = [];
    for (const [i, [size, crisis]] of BIRTHS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = generateSettlementPipeline(cfg, null, { seed: `r6-bmc-${size}-${crisis || 'calm'}-${i}`, customContent: {} });
      const stored = clone(withPublicProse(born, composePublicProse(born)));
      const t = { seed: `${size}-${crisis || 'calm'}-${i}`, stored, criminal: (stored.institutions || []).some((h) => isRec(h) && isCriminalInstitution(h)), reads: [] };
      for (const shareDm of [false, true]) for (const signal of SIGNALS) {
        n += 1; const slug = `r6bmc${n}`;
        const overrides = signal === 'marked' ? veil.writeShareVeil({}, []) : {};
        await storeShare(db, { town: stored, slug, overrides, shareDm });
        const galleryRow = (await db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [slug])).rows[0]?.r ?? null;
        const linkRow = (await db.query('select public.get_unlisted_dossier($1) as r', [`${slug}-link`])).rows[0]?.r ?? null;
        t.reads.push({ shareDm, signal, slug, galleryRow, linkRow });
      }
      towns.push(t);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  /** The page's read of one server row through sanitizeDossier's own path (the gallery hit, or the party link's miss). */
  const pageOf = async (row, partyLink) => {
    lib.supabase.rpc.mockImplementation((name) => {
      if (name === 'get_gallery_dossier') return Promise.resolve({ data: partyLink ? [] : [row], error: null });
      if (name === 'get_unlisted_dossier') return Promise.resolve({ data: partyLink ? row : null, error: null });
      return Promise.resolve({ data: null, error: null });
    });
    const out = await lib.gallery.fetchPublicDossier(partyLink ? row.slug : row.public_slug);
    return out?.settlement ?? null;
  };
  /** What the served signal says (sanitizeDossier's own expression over the overrides as served). */
  const signalSays = (ov, partyLink) => {
    const { isServedVeil, readShareVeil, writeShareVeil } = lib.veil;
    const served = isServedVeil(ov);
    const v = partyLink && !served && !readShareVeil(ov).marked ? writeShareVeil(ov, []) : ov;
    return !served && !readShareVeil(v).marked;
  };

  it('THROUGH THE SERVER: no non-owner read carries the figure (R2, VR33), on any town, signal, Reveal setting or read', () => {
    const bad = [];
    for (const t of towns) for (const r of t.reads) {
      expect(isRec(r.galleryRow?.data), `${t.seed} ${r.signal} dm=${r.shareDm}: the gallery read serves`).toBe(true);
      expect(isRec(r.linkRow?.dossier), `${t.seed} ${r.signal} dm=${r.shareDm}: the link serves`).toBe(true);
      if (holds(r.galleryRow.data)) bad.push(`${t.seed} ${r.signal} dm=${r.shareDm} gallery`);
      if (holds(r.linkRow.dossier)) bad.push(`${t.seed} ${r.signal} dm=${r.shareDm} link`);
    }
    expect(towns.every((t) => Number.isFinite(captureOf(t.stored))), 'every born town stores a figure').toBe(true);
    expect(bad).toEqual([]);
  });

  it('(i) and (ii): the page draws the figure by the served signal alone, the same on every town; equal to the owner\'s figure where drawn', async () => {
    const arms = {};
    const bad = [];
    const tally = (arm, t, drawn, equal) => {
      const a = arms[arm] = arms[arm] || { criminal: { towns: 0, drawn: 0, equalToOwner: 0 }, noCriminal: { towns: 0, drawn: 0, equalToOwner: 0 }, signalSaysDraw: new Set(), served: new Set(), marked: new Set() };
      const c = a[t.criminal ? 'criminal' : 'noCriminal'];
      c.towns += 1; if (drawn) c.drawn += 1; if (equal) c.equalToOwner += 1;
    };
    for (const t of towns) for (const r of t.reads) for (const [read, row, partyLink] of [['gallery', r.galleryRow, false], ['link', r.linkRow, true]]) {
      const arm = `${read} ${r.signal} dm=${r.shareDm}`;
      const ov = row.gallery_member_overrides;
      const page = await pageOf(row, partyLink);
      expect(isRec(page), `${t.seed} ${arm}: the page reads`).toBe(true);
      const drawn = holds(page);
      const equal = drawn && captureOf(page) === captureOf(t.stored);
      tally(arm, t, drawn, equal);
      arms[arm].signalSaysDraw.add(signalSays(ov, partyLink));
      arms[arm].served.add(lib.veil.isServedVeil(ov));
      arms[arm].marked.add(lib.veil.readShareVeil(ov).marked);
      // (i) the figure is drawn exactly where the served signal says so
      if (drawn !== signalSays(ov, partyLink)) bad.push(`${t.seed} ${arm}: drawn ${drawn}, the served signal says ${signalSays(ov, partyLink)}`);
      // (ii) the chair's arms, town by town
      const want = read === 'gallery' && r.signal === 'unmarked';
      if (drawn !== want) bad.push(`${t.seed} ${arm} (criminal house: ${t.criminal}): drawn ${drawn}, the condition says ${want}`);
      if (drawn && !equal) bad.push(`${t.seed} ${arm}: drawn ${captureOf(page)}, the owner's figure ${captureOf(t.stored)}`);
    }
    const report = Object.fromEntries(Object.entries(arms).map(([k, a]) => [k, { ...a, signalSaysDraw: [...a.signalSaysDraw], served: [...a.served], marked: [...a.marked] }]));
    if (OUT) { mkdirSync(OUT, { recursive: true }); writeFileSync(join(OUT, 'blackmarket-capture-condition.json'), JSON.stringify({ towns: towns.map((t) => ({ seed: t.seed, criminal: t.criminal, capture: captureOf(t.stored) })), arms: report, bad }, null, 1)); }
    console.log(`R6 CONDITION: ${towns.length} towns (${towns.filter((t) => t.criminal).length} with a criminal house, ${towns.filter((t) => !t.criminal).length} without); `
      + Object.entries(report).map(([k, a]) => `${k}: drawn ${a.criminal.drawn}/${a.criminal.towns} criminal, ${a.noCriminal.drawn}/${a.noCriminal.towns} not; equal ${a.criminal.equalToOwner + a.noCriminal.equalToOwner}; served ${a.served}; marked ${a.marked}`).join(' | '));
    // every arm is one decision for every town (the same presence whatever the town)
    for (const [k, a] of Object.entries(report)) expect(a.signalSaysDraw.length, `${k}: one served signal per arm`).toBe(1);
    expect(towns.filter((t) => t.criminal).length, 'towns with a criminal house').toBeGreaterThan(1);
    expect(towns.filter((t) => !t.criminal).length, 'towns without one').toBeGreaterThan(1);
    expect(bad).toEqual([]);
  }, 600_000);

  it('(i) THE SIGNAL ALONE: a served body read with another read\'s served signal follows that signal, not its body', async () => {
    const bad = []; let swaps = 0;
    for (const t of towns) for (const dm of [false, true]) {
      const m = t.reads.find((r) => r.shareDm === dm && r.signal === 'marked').galleryRow;
      const u = t.reads.find((r) => r.shareDm === dm && r.signal === 'unmarked').galleryRow;
      for (const [body, signal, want] of [[m, u, true], [u, m, false]]) {
        const row = { ...clone(body), gallery_member_overrides: clone(signal.gallery_member_overrides) };
        const drawn = holds(await pageOf(row, false));
        swaps += 1;
        if (drawn !== want || drawn !== signalSays(row.gallery_member_overrides, false)) bad.push(`${t.seed} dm=${dm}: a ${body === m ? 'marked' : 'unmarked'} body read with the ${signal === m ? 'marked' : 'unmarked'} signal drew ${drawn}`);
      }
    }
    console.log(`R6 CONDITION swaps: ${swaps}, against the signal ${bad.length}`);
    expect(swaps).toBe(towns.length * 4);
    expect(bad).toEqual([]);
  }, 600_000);
});
