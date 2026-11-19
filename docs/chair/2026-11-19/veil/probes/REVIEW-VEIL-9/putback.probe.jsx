// @vitest-environment jsdom
// REVIEW-VEIL-9 — VR16'S CLAIM TESTED (the chair, 09:22): "every field NO non-owner page draws is withheld on every
// non-owner read; with the withheld-always fields put back, every non-owner surface renders byte-equal". For every share
// on RV9_DBS (at most RV9_LIMIT): the tree's own fetchPublicDossier (anon; gallery slug and party link), the page drawn by
// PublicDossierView and walked by walkDossier; then the SAME page model with each withheld-always path (RV9_PATHS: a JSON
// file, a list of dot paths; `[]` walks every element, matched by index) put back from the STORED row, drawn and walked
// again. Any view whose lines differ is a field that a non-owner page DRAWS, so it cannot be withheld-always. RV9_OUT.
import { it, vi, expect } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const DBS = (process.env.RV9_DBS || '').split(',').filter(Boolean); const LIMIT = Number(process.env.RV9_LIMIT || 1000);
const mocks = vi.hoisted(() => ({ store: {}, db: null }));
vi.mock(`${process.env.RV6_SRC}/src/store/index.js`, () => { const useStore = (sel) => sel(mocks.store); useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {}; return { useStore, default: useStore }; });
vi.mock(`${process.env.RV6_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ isConfigured: true, supabase: {
  auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  rpc: async (name, args) => { const db = mocks.db; try {
    if (name === 'get_gallery_dossier') return { data: (await db.query('select * from public.get_gallery_dossier($1)', [args.dossier_slug])).rows, error: null };
    if (name === 'get_unlisted_dossier') return { data: (await db.query('select public.get_unlisted_dossier($1) x', [args.p_slug ?? args.slug ?? Object.values(args)[0]])).rows[0]?.x ?? null, error: null };
    return { data: null, error: null }; } catch (e) { return { data: null, error: { message: String(e.message) } }; } } } }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function putBack(dst, src, segs) { // segs: ['a','b[]','c']
  if (!isRec(dst) || !isRec(src) || !segs.length) return; const [h, ...rest] = segs; const arr = h.endsWith('[]'); const k = arr ? h.slice(0, -2) : h;
  if (!rest.length && !arr) { if (k in src) dst[k] = structuredClone(src[k]); return; }
  if (arr) { const a = dst[k]; const b = src[k]; if (!Array.isArray(a) || !Array.isArray(b)) { if (!rest.length && Array.isArray(b)) dst[k] = structuredClone(b); return; }
    if (!rest.length) { dst[k] = structuredClone(b); return; } for (let i = 0; i < Math.min(a.length, b.length); i += 1) putBack(a[i], b[i], rest); return; }
  if (!isRec(dst[k]) && isRec(src[k])) dst[k] = {}; putBack(dst[k], src[k], rest);
}
it('REVIEW-VEIL-9: VR16 put-back', async () => {
  const PATHS = JSON.parse(readFileSync(process.env.RV9_PATHS, 'utf8'));
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const React = (await import(`${SRC}/node_modules/react/index.js`)).default;
  const { render, fireEvent, waitFor, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
  const { walkDossier, storeFor } = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const PublicDossierView = (await import(`${SRC}/src/components/PublicDossierView.jsx`)).default;
  window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })), { SF_CONTROLLED: true });
  const draw = async (page) => { mocks.store = storeFor(page.settlement, vi.fn); const { container } = render(React.createElement(PublicDossierView, { dossier: page, showHeader: true })); const v = await walkDossier(container, { fireEvent, waitFor, expect }); cleanup(); return v; };
  const lines = []; const rows = {}; let pages = 0; let equal = 0;
  for (const dbname of DBS) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect(); mocks.db = db; await db.query(`select set_config('test.uid', '', false)`);
    const shares = (await db.query(`select public_slug, unlisted_slug, name, data from public.settlements where public_slug is not null order by public_slug limit $1`, [LIMIT])).rows;
    for (const sh of shares) for (const slug of [sh.public_slug, sh.unlisted_slug]) {
      const page = await gallery.fetchPublicDossier(slug); if (!isRec(page?.settlement)) continue; pages += 1;
      const v1 = await draw(page);
      // NEVER A CLONE: the client marks a projected settlement's shut groupings in a WeakMap keyed by the object
      // (galleryVeil.js VEILED_GROUPINGS); a clone loses them and draws blocks the visitor never sees. A FRESH fetch,
      // the fields put back IN PLACE.
      const back = await gallery.fetchPublicDossier(slug); for (const p of PATHS) putBack(back.settlement, sh.data, p.split('.'));
      const v2 = await draw(back);
      let same = true;
      for (const view of new Set([...Object.keys(v1), ...Object.keys(v2)])) { const a = (v1[view] || []).join('\n'); const b = (v2[view] || []).join('\n'); if (a === b) continue; same = false;
        const add = (v2[view] || []).filter((x) => !(v1[view] || []).includes(x)); const k = `${dbname} | ${view}`; rows[k] = rows[k] || { n: 0, ex: `${sh.name} (${slug}): +${JSON.stringify(add.slice(0, 2)).slice(0, 220)}` }; rows[k].n += 1; }
      if (same) equal += 1;
    }
    await db.end();
  }
  lines.push(`${pages} pages drawn twice; byte-equal ${equal}; differing ${pages - equal} (paths put back: ${PATHS.length})`);
  for (const k of Object.keys(rows).sort()) lines.push(`${k} | pages ${rows[k].n}\n      e.g. ${rows[k].ex}`);
  writeFileSync(process.env.RV9_OUT, lines.join('\n') + '\n');
}, 14_400_000);
