// @vitest-environment jsdom
// R4I-PAGE-2 item O (VEIL-38; the chair's terms of 00:25 UTC for the Tonight sheet's order STOP): A MEASURE, no cure.
// Each town is read TWICE by each engine (the twin: the client's own fetchPublicDossier over an UNSERVED row, so its
// veil seam projects it, projectServedVeil -> projectShareVeil; the server: get_gallery_dossier on the scratch PG16 at
// RV9_SERVER_TPL, when given), the DEFAULT veil (writeShareVeil({}, [])), Reveal off, and reports:
//   (3) SERVED ORDER: whether the served document is EQUAL on the two reads modulo the read's person-id bijection
//       (tests/security/personIdBijection.shared.mjs :: canonPeople names each person by FIRST APPEARANCE in one fixed walk,
//       so equal canonical documents are equal in every byte but the ids, ORDER INCLUDED), twin and server; where not, the
//       differing top-level keys; and the same for each served person array alone (npcs, relationships, the roster copies,
//       the casts).
//   (4) PRINTED ORDER BY SURFACE: the page rendered as shareRenderTwice.pglite.test.jsx renders it (PublicDossierView,
//       every group, sub-tab and disclosure opened, and the session sheet opened from its control; its walk and mocks
//       copied), each view's HTML normalised for React's ids AND for every re-keyed person or tie id (`npc_`/`tie_` or
//       `npc-`/`tie-` + 16 hex) by first appearance IN THAT VIEW: a view that differs after that moved an ORDER or a
//       WORD, not an id byte. Counted by view, per engine. RV9_RENDER=0 skips it (served order only).
// Births: RV9_SET=towns (the tell gate's 140, tell-common.mjs :: pool(2)) or RV9_SET=pool (every seed of RV9_POOL_DIR's
// pool-shard*.json and poolb-shard*.json, born whole as tell2.probe.jsx borns them). RV9_SHARD s/n; RV9_LIMIT caps.
import { it, vi, expect } from 'vitest';
import React from 'react';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const env = vi.hoisted(() => ({ row: null, mobile: false, store: {}, version: 0, subs: new Set() }));
vi.mock(`${process.env.RV6_SRC}/src/hooks/useIsMobile.js`, () => ({ default: () => env.mobile }));
vi.mock(`${process.env.RV6_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/store/index.js`, async () => {
  const { useSyncExternalStore } = await import('react');
  const subscribe = (fn) => { env.subs.add(fn); return () => env.subs.delete(fn); };
  const useStore = (sel) => { useSyncExternalStore(subscribe, () => env.version); return typeof sel === 'function' ? sel(env.store) : env.store; };
  useStore.subscribe = subscribe; useStore.getState = () => env.store; useStore.setState = () => {};
  return { useStore, default: useStore };
});
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name) => (name === 'get_gallery_dossier' ? { data: [JSON.parse(JSON.stringify(env.row))], error: null } : { data: null, error: null }),
  };
  return { supabase, isConfigured: true, default: supabase };
});

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const SHEET_VIEW = 'SHEET/Tonight (Table View)';
const normalise = (html) => {
  const names = new Map();
  return html.replace(/:r[0-9a-z]+:/g, ':id:').replace(/«r[0-9a-z]+»/g, '«id»')
    .replace(/\b(npc|tie)([-_])([0-9a-f]{16})\b/g, (m, k, sep) => { if (!names.has(m)) names.set(m, `${k}${sep}#${names.size}`); return names.get(m); });
};

it('item O: served order and printed order, two reads of one place', async () => {
  const { render, fireEvent, waitFor, cleanup } = await import('@testing-library/react');
  const { loadEngine } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const { canonPeople } = await import(`${SRC}/tests/security/personIdBijection.shared.mjs`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { fetchPublicDossier } = await import(`${SRC}/src/lib/gallery.js`);
  const PublicDossierView = (await import(`${SRC}/src/components/PublicDossierView.jsx`)).default;
  const { TONIGHT_COPY } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const { storeFor } = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  if (!window.matchMedia) window.matchMedia = (q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  const E = await loadEngine(SRC);
  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const RENDER = process.env.RV9_RENDER !== '0';
  const LIMIT = Number(process.env.RV9_LIMIT || 0);

  /** @type {Array<{ seed: string, cfg: object }>} */
  let births;
  if ((process.env.RV9_SET || 'towns') === 'towns') births = E.pool(Number(process.env.RV9_N || 2), SHARD);
  else {
    const dir = process.env.RV9_POOL_DIR;
    const files = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort();
    const all = files.flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    // tell2.probe.jsx :: cfgOf, byte for byte
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    births = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, cfg: cfgOf(b.size, b.crisis) }));
  }
  if (LIMIT) births = births.slice(0, LIMIT);

  let db = null; let nrow = 0;
  if (process.env.RV9_SERVER_TPL) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB || 'r4ip2_order'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const ov = veil.writeShareVeil({}, []);
  const baseRow = (rec) => ({ id: 'abcd0000-0000-0000-0000-000000000001', public_slug: 'o1', name: rec.name || 'x', tier: rec.tier || 'town', published_at: null, view_count: 0, gallery_share_dm: false, gallery_importable: true });
  const twinRow = (rec) => ({ ...baseRow(rec), data: clone(rec), gallery_member_overrides: clone(ov) });
  const serverRow = async (rec) => {
    nrow += 1; const id = `abcd7f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `o${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,false,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov)]);
    const r = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r;
    const r2 = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r;
    await db.query('delete from public.settlements where id = $1', [id]);
    return [r, r2];
  };

  async function walkHtml(container) {
    const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
    const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
    await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
    const views = {};
    const openButton = (root) => [...root.querySelectorAll('button')].find((b) => (b.textContent || '').trim() === TONIGHT_COPY.open);
    let opener = null;
    for (let g = 0; g < groupTabs().length; g++) {
      const groupName = (groupTabs()[g].textContent || '').trim();
      fireEvent.click(groupTabs()[g]);
      await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
      for (let i = 0; i < subTabs().length; i++) {
        const tab = subTabs()[i]; const id = (tab.id || '').replace(/^sf-tab-/, ''); const name = `${groupName}/${(tab.textContent || '').trim()}`;
        fireEvent.click(tab);
        try { await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 }); } catch { /* read as it is */ }
        const panel = container.querySelector(`#sf-panel-${id}`);
        if (!panel) { views[name] = '[NO PANEL]'; continue; }
        const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
        for (let pass = 0; pass < 4; pass++) { const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false'); if (!closed.length) break; for (const e of closed) fireEvent.click(e); }
        views[name] = normalise(panel.innerHTML);
        if (!opener && openButton(panel)) opener = [g, i];
      }
    }
    views[SHEET_VIEW] = '[NO SHEET CONTROL]';
    if (opener) {
      fireEvent.click(groupTabs()[opener[0]]);
      await waitFor(() => expect(subTabs().length).toBeGreaterThan(opener[1]));
      fireEvent.click(subTabs()[opener[1]]);
      const button = await waitFor(() => { const b = openButton(container); expect(b).toBeTruthy(); return b; }, { timeout: 10000 });
      fireEvent.click(button);
      const dialog = () => container.querySelector(`[role="dialog"][aria-label^="${TONIGHT_COPY.title}: "]`);
      try { await waitFor(() => expect((dialog()?.textContent || '').length).toBeGreaterThan(15), { timeout: 10000 }); } catch { /* read as it is */ }
      const d = dialog(); views[SHEET_VIEW] = d ? normalise(d.outerHTML) : '[NO SHEET]';
    }
    return views;
  }
  /** One read through the client's own fetch (its sanitiser and veil seam), rendered; returns { doc, views }. */
  async function readOnce(row) {
    env.row = row; env.mobile = false;
    const dossier = await fetchPublicDossier('o1');
    const doc = clone(dossier.settlement);
    if (!RENDER) return { doc, views: {} };
    env.store = storeFor(dossier.settlement, vi.fn);
    env.store.setUserPref = (k, v) => { env.store = { ...env.store, userPrefs: { ...env.store.userPrefs, [k]: v } }; env.version += 1; for (const f of env.subs) f(); };
    const { container } = render(React.createElement(PublicDossierView, { dossier: { ...dossier, viewCount: 0, publishedAt: null }, showHeader: false }));
    const views = await walkHtml(container);
    cleanup();
    return { doc, views };
  }
  const ARRAYS = {
    npcs: (d) => d.npcs, relationships: (d) => d.relationships,
    'powerStructure.factions[].members': (d) => (d.powerStructure?.factions || []).map((f) => f?.members),
    'factions[].members': (d) => (d.factions || []).map((f) => f?.members),
    'npcs[].relationships': (d) => (d.npcs || []).map((n) => n?.relationships),
    casts: (d) => ['stress', 'stressors'].flatMap((k) => (Array.isArray(d[k]) ? d[k] : [d[k]])).filter(isRec).map((c) => c.cast),
  };
  const servedOrder = (a, b) => {
    const ca = canonPeople(a).doc; const cb = canonPeople(b).doc;
    // object keys sorted (jsonb stores its own key order); ARRAY order kept: the order is what is measured
    const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
    const keys = [...new Set([...Object.keys(ca), ...Object.keys(cb)])].filter((k) => J(ca[k]) !== J(cb[k]));
    const arrays = Object.entries(ARRAYS).filter(([, f]) => J(f(ca)) !== J(f(cb))).map(([k]) => k);
    return { equal: keys.length === 0, keys, arrays };
  };
  const out = { births: [] };
  for (const b of births) {
    const rec = E.birth(b.cfg, b.seed, null);
    const t0 = Date.now();
    const r = { seed: b.seed, hidden: (rec.institutions || []).filter((h) => E.isHideableHouse(h)).length };
    const t1 = await readOnce(twinRow(rec)); const t2 = await readOnce(twinRow(rec));
    // the twin's served document as the tell arms read it (tell-common.mjs :: loadVeil's twin), twice
    const twinDoc = () => clone(veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov));
    const w1 = twinDoc(); const w2 = twinDoc();
    r.twin = { served: servedOrder(w1, w2), seam: servedOrder(t1.doc, t2.doc), viewsMoved: Object.keys(t1.views).filter((v) => t1.views[v] !== t2.views[v]),
      views: Object.keys(t1.views).length, sheet: (t1.views[SHEET_VIEW] || '').length };
    if (db) {
      const [s1, s2] = await serverRow(rec);
      const sv1 = await readOnce(s1); const sv2 = await readOnce(s2);
      r.server = { served: servedOrder(sv1.doc, sv2.doc), viewsMoved: Object.keys(sv1.views).filter((v) => sv1.views[v] !== sv2.views[v]),
        views: Object.keys(sv1.views).length, sheet: (sv1.views[SHEET_VIEW] || '').length, twinVsServer: servedOrder(w1, s1.data) };
    }
    r.ms = Date.now() - t0;
    out.births.push(r);
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
