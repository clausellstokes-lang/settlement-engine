// @vitest-environment jsdom
// REVIEW-VEIL-9 — THE PUBLIC PAGE AS A NON-OWNER SEES IT, read from a local chain. For every share a cold run stored
// (RV9_DBS; at most RV9_LIMIT a database): the tree's own fetchPublicDossier (its supabase client answered by the
// local chain, anon) by the gallery slug and by the party link; the page model rendered by the tree's own
// PublicDossierView (OutputContainer read-only), walked by the repo's own walkDossier (every group, sub-tab and
// disclosure). Searched in the page's text: the planted markers; every form of a house the stored town lists and the
// served page does not (fold.mjs: every script, any case, bracketless, id, catalogue id, squeezed); and the same
// forms in the raw response the server sent. Run through REVIEW-VEIL-6's vitest.config.mjs (RV6_PROBE=<this file>).
import { it, vi, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = process.env.RV9_OUT; const DBS = (process.env.RV9_DBS || '').split(',').filter(Boolean);
const LIMIT = Number(process.env.RV9_LIMIT || 1000); const LIKE = process.env.RV9_LIKE || '%';
const mocks = vi.hoisted(() => ({ store: {}, db: null }));
vi.mock(`${process.env.RV6_SRC}/src/store/index.js`, () => { const useStore = (sel) => sel(mocks.store); useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {}; return { useStore, default: useStore }; });
vi.mock(`${process.env.RV6_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ isConfigured: true, supabase: {
  auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  rpc: async (name, args) => { const db = mocks.db; try {
    if (name === 'get_gallery_dossier') { const r = (await db.query('select * from public.get_gallery_dossier($1)', [args.dossier_slug])).rows; mocks.raw.push(r); return { data: r, error: null }; }
    if (name === 'get_unlisted_dossier') { const x = (await db.query('select public.get_unlisted_dossier($1) x', [args.p_slug ?? args.slug ?? Object.values(args)[0]])).rows[0]?.x ?? null; mocks.raw.push(x); return { data: x, error: null }; }
    return { data: null, error: null }; } catch (e) { return { data: null, error: { message: String(e.message) } }; } } } }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const MARK = /vq6n[0-9]+z/i;
const VOCAB = process.env.RV9_VOCAB ? new RegExp(process.env.RV9_VOCAB, 'i') : null;
it('REVIEW-VEIL-9: the public page over the chains', async () => {
  const { fold, formsOf, hitsIn } = await import('/var/tmp/v16/rv9/fold.mjs');
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const React = (await import(`${SRC}/node_modules/react/index.js`)).default;
  const { render, fireEvent, waitFor, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
  const { walkDossier, storeFor } = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const PublicDossierView = (await import(`${SRC}/src/components/PublicDossierView.jsx`)).default;
  const viewport = { matches: false };
  window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })), { SF_CONTROLLED: true });
  const lines = []; const rows = {};
  const bump = (k, ex) => { rows[k] = rows[k] || { n: 0, ex }; rows[k].n += 1; };
  for (const dbname of DBS) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect(); mocks.db = db;
    await db.query(`select set_config('test.uid', '', false)`);
    const shares = (await db.query(`select public_slug, unlisted_slug, name, gallery_share_dm dm, gallery_member_overrides->'$veil'->>'mode' mode, (gallery_member_overrides ? '$veil') marked,
       coalesce(jsonb_array_length(gallery_member_overrides->'$veil'->'deltas'),0) deltas, data->'institutions' houses from public.settlements where public_slug like $2 order by public_slug limit $1`, [LIMIT, LIKE])).rows;
    const t = { pages: 0, noModel: 0, views: 0, threw: 0, chars: 0 };
    for (const sh of shares) for (const [via, slug] of [['gallery', sh.public_slug], ['link', sh.unlisted_slug]]) {
      if (!slug) continue; mocks.raw = [];
      const kind = `${dbname.replace(/_\d+$/, '')} | ${via} | ${sh.dm ? 'DM reveal on' : 'no reveal'} | ${!sh.marked ? 'unmarked' : sh.deltas > 0 ? 'eyes shut' : 'marked, no eye'}${sh.mode === 'snapshot' ? ' | frozen' : ''}`;
      let page = null; try { page = await gallery.fetchPublicDossier(slug); } catch (e) { bump(`${kind} | page model threw`, String(e.message).slice(0, 120)); }
      const s = page?.settlement; if (!isRec(s)) { t.noModel += 1; bump(`${kind} | NO PAGE MODEL`, sh.name); continue; }
      t.pages += 1;
      const openIds = new Set((s.institutions || []).filter(isRec).map((i) => i.id).filter(Boolean));
      const openNames = new Set((s.institutions || []).filter(isRec).map((i) => fold(i.name)));
      const gone = (sh.houses || []).filter(isRec).filter((h) => !(h.id && openIds.has(h.id)) && !openNames.has(fold(h.name)));
      const openForms = new Set((s.institutions || []).filter(isRec).flatMap(formsOf));
      for (const list of [s.npcs, s.powerStructure?.factions, s.factions]) for (const c of (Array.isArray(list) ? list : []).filter(isRec)) for (const k of ['name', 'faction']) if (typeof c[k] === 'string') openForms.add(fold(c[k]));
      const forms = [...new Set(gone.flatMap(formsOf))].filter((g) => !openForms.has(g) && ![...openForms].some((o) => o.includes(g)));
      const crim = (sh.houses || []).filter(isRec).filter((h) => /criminal/i.test(h.category || '') || (Array.isArray(h.tags) && h.tags.includes('criminal')));
      const allCrimGone = crim.length > 0 && crim.every((h) => gone.includes(h));
      mocks.store = storeFor(s, vi.fn);
      let views = {};
      try { const { container } = render(React.createElement(PublicDossierView, { dossier: page, showHeader: true })); views = await walkDossier(container, { fireEvent, waitFor, expect }); }
      catch (e) { t.threw += 1; bump(`${kind} | render threw`, `${sh.name}: ${String(e.message).slice(0, 140)}`); }
      cleanup();
      t.views += Object.keys(views).length;
      for (const [view, ls] of Object.entries(views)) for (const l of ls) { t.chars += l.length;
        if (MARK.test(l)) bump(`${kind} | MARKER on the page | ${view}`, `${sh.name}: ${l.slice(0, 200)}`);
        if (VOCAB && sh.deltas > 0 && allCrimGone && VOCAB.test(l)) bump(`${kind} | CRIME WORDS with every hideable house hidden | ${view} | ${(l.match(VOCAB) || [''])[0].toLowerCase()}`, `${sh.name}: ${l.slice(0, 260)}`);
        for (const h of hitsIn(l, forms)) bump(`${kind} | HIDDEN HOUSE on the page | ${view} | ${h}`, `${sh.name}: ${l.slice(0, 220)}`); }
      // the raw response, every key and string, the same forms
      const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { if (!(/^(has|is)[A-Z]/.test(k) && x === false)) for (const h of hitsIn(k, forms)) bump(`${kind} | HIDDEN HOUSE in a KEY of the response | ${p}.<key> | ${h}`, `${sh.name}: ${k} = ${JSON.stringify(x).slice(0, 60)}`); walk(x, p ? `${p}.${k}` : k); } else if (typeof v === 'string') for (const h of hitsIn(v, forms)) bump(`${kind} | HIDDEN HOUSE in the response | ${p.replace(/\[\]/g, '[]')} | ${h}`, `${sh.name}: ${v.slice(0, 220)}`); };
      walk(mocks.raw, '');
    }
    lines.push(`${dbname}: ${shares.length} shares, ${t.pages} pages, no model ${t.noModel}, render threw ${t.threw}, views ${t.views}, ${t.chars} characters`);
    await db.end();
  }
  for (const k of Object.keys(rows).sort()) lines.push(`${k} | ${rows[k].n}\n      e.g. ${rows[k].ex}`);
  writeFileSync(OUT, lines.join('\n') + '\n');
}, 14_400_000);
