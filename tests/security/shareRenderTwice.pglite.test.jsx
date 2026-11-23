// @vitest-environment jsdom
/**
 * shareRenderTwice.pglite.test.jsx — VR16 CONDITION (1): "UNDRAWN" PROVEN BY RENDERING, NOT TRUSTED FROM A CENSUS
 * (the sixth chair's ruling VR16, 2026-11-19 09:22 UTC; SUB-BRIEF-VR7 stage R2; the seventh chair's VR15: THROUGH THE
 * SERVER). VEIL-20 item 3b: THE HARNESS AND ITS RED ARM, built before R2; R2 makes the main arm its green.
 *
 * THE RULE IT HOLDS: a field the roster-choice registry withholds on EVERY non-owner read for being undrawn
 * (src/domain/veil/rosterChoiceRegistry.js, its `withhold`/`always` rows) moves no byte of any surface a non-owner can
 * reach. Each born town is stored with the DEFAULT veil on a chain of every migration on disk and read as anon by the
 * client's own code (src/lib/gallery.js :: fetchPublicDossier, its sanitiser and veil seam; the party link by its
 * unlisted slug through the same function), the rpc routed to that chain. Each read is rendered twice:
 *   A  the served document with every withhold-always path removed;
 *   B  A with each such path's STORED value grafted back (arrays aligned by length, else by id, name or archetype).
 * Rendered: PublicDossierView (OutputContainer read-only, the player view) for the gallery read, PartyLinkView (the
 * players' page, PublicDossierView inside) for the link, every group and sub-tab and every disclosure opened, at
 * desktop and at phone width; the panel's HTML per view, React's generated ids normalised. THE SESSION SHEET (the
 * Table View, "Open Tonight", the chair's ruling of 2026-11-20 04:50 UTC): composed at render from the served
 * document and mounted by OutputContainer with no public gate, it is opened as a visitor opens it (the Overview's
 * "Open Tonight" control, the store's `tableViewOpen` pref) and its dialog's HTML joins the views on both surfaces
 * and both widths; CONTROL proves the walk reaches it (non-empty, the served name drawn).
 * THE ARMS:
 *   CONTROL  A rendered twice is byte-equal (the walk is deterministic, so a difference below is the field's).
 *   RED      the harness sees a DRAWN field: with the safety band (`safetyLabel`, drawn on DefenseTab) removed from A
 *            and grafted into B, B differs from A.
 *   MAIN     (R2's green) B, every withhold-always row grafted back but the known drawn ones, equals A on every
 *            surface, width and town.
 *   DRAWN    each row in KNOWN_DRAWN (measured: the registry calls it undrawn, a non-owner page draws it) still moves
 *            a byte alone; R2 re-classes each ((a) or (b)) and strikes it (shrink-only).
 * NOT REACHED HERE (named for R2): the campaign map's member dossier (CampaignWorldView over get_gallery_map); there
 * is no export a non-owner can trigger (VR4 section 2b: no PDF, journal or print on a non-owner page).
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { bootChain, storeShare, withhold, graft, BIRTH_DIALS } from './veilChain.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 1_800_000;

const env = vi.hoisted(() => ({ db: null, mobile: false, mutate: null, store: {}, version: 0, subs: new Set(), sheetText: null, lastServedName: null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => env.mobile }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/store/index.js', async () => {
  // Reactive on `setUserPref` alone (renderOnce's), so the Table View mounts when a visitor opens it.
  const { useSyncExternalStore } = await import('react');
  const subscribe = (fn) => { env.subs.add(fn); return () => env.subs.delete(fn); };
  const useStore = (sel) => { useSyncExternalStore(subscribe, () => env.version); return typeof sel === 'function' ? sel(env.store) : env.store; };
  useStore.subscribe = subscribe;
  useStore.getState = () => env.store;
  useStore.setState = () => {};
  return { useStore, default: useStore };
});
vi.mock('../../src/lib/supabase.js', () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name, args) => {
      if (name === 'get_gallery_dossier') {
        const rows = (await env.db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [args.dossier_slug])).rows.map((x) => x.r);
        for (const r of rows) r.data = env.mutate(r.data);
        return { data: rows, error: null };
      }
      if (name === 'get_unlisted_dossier') {
        const r = (await env.db.query('select public.get_unlisted_dossier($1) as r', [args.p_slug])).rows[0]?.r ?? null;
        if (r) r.dossier = env.mutate(r.dossier);
        return { data: r, error: null };
      }
      return { data: null, error: null };
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const OUT = process.env.RENDER_TWICE_OUT || null;


const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null]];
const DRAWN_CONTROL = [/^economicState\.safetyProfile\.safetyLabel$/];
/** MEASURED by this harness at its first run (VEIL-20, 2026-11-20; three born towns, the default veil, Reveal off, the
 * gallery read and the link, desktop and phone): rows the registry withholds on every read as UNDRAWN that a
 * non-owner page DRAWS. R2 re-classes each ((a) recompose or (b) withhold, VR16) and strikes it here. Shrink-only. */
const KNOWN_DRAWN = Object.freeze(new Set([]));
/* STRUCK BY R2 (VEIL-21, 2026-11-20; the seventh chair's VR37), each with its class (rosterChoiceRegistry.js):
 *   conditions.severity      withheld on every read; its band served (tier 2); the page draws the chips from the band
 *   defence.readiness.score  withheld on every read; the label stays; the page re-derives the score (pageRederive.js)
 *   cast.stakes, cast.roles  (b): per entry, with the power, person or house each names (212 :: _gallery_veil_cast)
 *   power.relation.direction (b): with its relation, per entry (R3's power.relation.entry); a closed vocabulary */

/** React's generated ids (useId) differ between mounts; nothing else may. */
const normalise = (html) => html.replace(/:r[0-9a-z]+:/g, ':id:').replace(/«r[0-9a-z]+»/g, '«id»');
const SHEET_VIEW = 'SHEET/Tonight (Table View)';

/** Walk every group, sub-tab and disclosure (tests/components/pageCensusWalk.shared.mjs's walk), keeping each panel's HTML. */
async function walkHtml(container, copy) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
  /** @type {Record<string, string>} */ const views = {}; // the panels only: the page's status line at mount is transient
  const openButton = (root) => [...root.querySelectorAll('button')].find((b) => (b.textContent || '').trim() === copy.open);
  let opener = null; // [group, sub-tab] of the panel that carries the sheet's control
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const id = (tab.id || '').replace(/^sf-tab-/, ''); const name = `${groupName}/${(tab.textContent || '').trim()}`;
      fireEvent.click(tab);
      try { await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 }); } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      if (!panel) { views[name] = '[NO PANEL]'; continue; }
      const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
      for (let pass = 0; pass < 4; pass++) {
        const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false');
        if (!closed.length) break;
        for (const e of closed) fireEvent.click(e);
      }
      views[name] = normalise(panel.innerHTML);
      if (!opener && openButton(panel)) opener = [g, i];
    }
  }
  // THE SESSION SHEET, opened as a visitor opens it: back to the panel with the control, then a click.
  env.sheetText = null;
  views[SHEET_VIEW] = '[NO SHEET CONTROL]';
  if (opener) {
    fireEvent.click(groupTabs()[opener[0]]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(opener[1]));
    fireEvent.click(subTabs()[opener[1]]);
    const button = await waitFor(() => { const b = openButton(container); expect(b).toBeTruthy(); return b; }, { timeout: 10000 });
    fireEvent.click(button);
    const dialog = () => container.querySelector(`[role="dialog"][aria-label^="${copy.title}: "]`);
    try { await waitFor(() => expect((dialog()?.textContent || '').length).toBeGreaterThan(15), { timeout: 10000 }); } catch { /* read as it is */ }
    const d = dialog();
    views[SHEET_VIEW] = d ? normalise(d.outerHTML) : '[NO SHEET]';
    env.sheetText = d ? d.textContent || '' : null;
  }
  return views;
}

const firstDiff = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i += 1; return `…${a.slice(Math.max(0, i - 60), i + 60)}… | …${b.slice(Math.max(0, i - 60), i + 60)}…`; };
function viewDiffs(va, vb) {
  const out = [];
  for (const name of new Set([...Object.keys(va), ...Object.keys(vb)])) if (va[name] !== vb[name]) out.push(`${name}: ${firstDiff(va[name] ?? '[NO VIEW]', vb[name] ?? '[NO VIEW]')}`);
  return out;
}

describe('VR16 (1): a field withheld on every non-owner read as undrawn moves no byte of a non-owner surface (through the server)', () => {
  let towns;
  let PATTERNS;
  let lib;

  beforeAll(async () => {
    env.db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(env.db)).toEqual([]);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { REGISTRY_ROWS } = await import('../../src/domain/veil/rosterChoiceRegistry.js');
    const { storeFor } = await import('../components/pageCensusWalk.shared.mjs');
    lib = {
      fetchPublicDossier: (await import('../../src/lib/gallery.js')).fetchPublicDossier,
      PublicDossierView: (await import('../../src/components/PublicDossierView.jsx')).default,
      PartyLinkView: (await import('../../src/components/PartyLinkView.jsx')).default,
      TONIGHT_COPY: (await import('../../src/domain/summary/tonightSheet.js')).TONIGHT_COPY,
      storeFor,
    };
    await loadGenerationLawPayloads();
    if (!window.matchMedia) window.matchMedia = (q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    PATTERNS = REGISTRY_ROWS.filter((r) => r.rule === 'withhold' && r.when === 'always' && r.drawn !== 'yes').map((r) => ({ id: r.id, re: new RegExp(r.path) }));
        const overrides = veil.writeShareVeil({}, []);
    towns = [];
    for (const [i, [size, crisis]] of BIRTHS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = generateSettlementPipeline(cfg, null, { seed: `render-twice-${size}-${crisis || 'calm'}-${i}`, customContent: {} });
      const stored = clone(withPublicProse(born, composePublicProse(born)));
      const slug = `rt${i}`;
      await storeShare(env.db, { town: stored, slug, overrides });
      towns.push({ seed: `${size}-${crisis || 'calm'}-${i}`, stored, slug, link: `${slug}-link` });
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  afterEach(() => cleanup());

  /** One render of one surface: the dossier read through the client's own fetch, its document mutated by `mutate`. */
  async function renderOnce(town, surfaceSlug, mobile, mutate) {
    env.mutate = mutate; env.mobile = mobile;
    const dossier = await lib.fetchPublicDossier(surfaceSlug);
    expect(dossier?.settlement, `${town.seed}: the read served a dossier`).toBeTruthy();
    env.store = lib.storeFor(dossier.settlement, vi.fn);
    env.store.setUserPref = (k, v) => { env.store = { ...env.store, userPrefs: { ...env.store.userPrefs, [k]: v } }; env.version += 1; for (const f of env.subs) f(); };
    const d = { ...dossier, viewCount: 0, publishedAt: null };
    const el = surfaceSlug === town.link
      ? React.createElement(lib.PartyLinkView, { dossier: d, auth: null, onReport: vi.fn(), reportBusy: false })
      : React.createElement(lib.PublicDossierView, { dossier: d, showHeader: false });
    const { container } = render(el);
    const views = await walkHtml(container, lib.TONIGHT_COPY);
    env.lastServedName = dossier.settlement.name;
    cleanup();
    return views;
  }
  const armA = (patterns) => (doc) => withhold(clone(doc), patterns);
  const armB = (town, patterns, tally) => (doc) => { const a = withhold(clone(doc), patterns); graft(a, town.stored, patterns, '', tally); return a; };
  const SURFACES = (t) => [['gallery', t.slug], ['link', t.link]];
  const WIDTHS = [['desktop', false], ['phone', true]];

  it('CONTROL: the same document rendered twice is byte-equal (every surface and width of the first town)', async () => {
    const t = towns[0];
    const bad = [];
    for (const [surface, slug] of SURFACES(t)) for (const [width, mobile] of WIDTHS) {
      const re = PATTERNS.map((p) => p.re);
      const one = await renderOnce(t, slug, mobile, armA(re));
      // THE WALK REACHES THE SHEET (negative control): its HTML is there, non-empty, and draws the served name.
      expect(one[SHEET_VIEW], `${surface}/${width}: the session sheet was opened`).toMatch(/^<div[^>]*role="dialog"/);
      expect(env.sheetText?.length ?? 0, `${surface}/${width}: the sheet is non-empty`).toBeGreaterThan(40);
      expect(env.sheetText, `${surface}/${width}: the sheet draws the served name`).toContain(env.lastServedName);
      const two = await renderOnce(t, slug, mobile, armA(re));
      expect(Object.keys(one).length, `${surface}/${width}: views walked`).toBeGreaterThan(5);
      bad.push(...viewDiffs(one, two).map((d) => `${surface}/${width}: ${d}`));
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('RED: the harness sees a DRAWN field (the safety band removed from A, grafted into B)', async () => {
    const t = towns[0];
    const re = [...PATTERNS.map((p) => p.re), ...DRAWN_CONTROL];
    const tally = { grafted: 0, unaligned: 0 };
    const a = await renderOnce(t, t.slug, false, armA(re));
    const b = await renderOnce(t, t.slug, false, armB(t, DRAWN_CONTROL, tally));
    expect(tally.grafted).toBeGreaterThan(0);
    expect(viewDiffs(a, b).length, 'a drawn field must move a byte').toBeGreaterThan(0);
  }, ARM_TIMEOUT_MS);

  it('MAIN (R2\'s green): every withhold-always row but the known drawn ones, grafted back, moves no byte (every surface, width and town)', async () => {
    const re = PATTERNS.map((p) => p.re);
    const rest = PATTERNS.filter((p) => !KNOWN_DRAWN.has(p.id)).map((p) => p.re);
    const moved = [];
    const report = { rows: PATTERNS.map((p) => p.id), knownDrawn: [...KNOWN_DRAWN], towns: [], drawnRows: {} };
    for (const t of towns) {
      for (const [surface, slug] of SURFACES(t)) for (const [width, mobile] of WIDTHS) {
        const tally = { grafted: 0, unaligned: 0 };
        const a = await renderOnce(t, slug, mobile, armA(re));
        const b = await renderOnce(t, slug, mobile, (doc) => { const x = withhold(clone(doc), re); graft(x, t.stored, rest, '', tally); return x; });
        const d = viewDiffs(a, b);
        report.towns.push({ town: t.seed, surface, width, grafted: tally.grafted, unaligned: tally.unaligned, differing: d.length });
        moved.push(...d.map((x) => `${t.seed} ${surface}/${width}: ${x.slice(0, 300)}`));
      }
    }
    if (OUT) { mkdirSync(OUT, { recursive: true }); writeFileSync(join(OUT, 'render-twice.json'), JSON.stringify({ ...report, moved }, null, 1)); }
    expect(report.towns.every((x) => x.grafted > 0)).toBe(true);
    expect(moved).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('DRAWN (shrink-only): each row the registry calls undrawn that a non-owner page DRAWS still moves a byte alone (R2 re-classes each, then strikes it)', async () => {
    const re = PATTERNS.map((p) => p.re);
    const stillDrawn = new Set();
    for (const t of towns) {
      const a = await renderOnce(t, t.slug, false, armA(re));
      for (const p of PATTERNS.filter((x) => KNOWN_DRAWN.has(x.id) && !stillDrawn.has(x.id))) {
        const one = { grafted: 0, unaligned: 0 };
        const b = await renderOnce(t, t.slug, false, (doc) => { const x = withhold(clone(doc), re); graft(x, t.stored, [p.re], '', one); return x; });
        if (one.grafted && viewDiffs(a, b).length) stillDrawn.add(p.id);
      }
    }
    expect([...stillDrawn].sort()).toEqual([...KNOWN_DRAWN].filter((id) => PATTERNS.some((p) => p.id === id)).sort());
  }, ARM_TIMEOUT_MS);
});
