// REVIEW-VEIL-6 — WHAT THE DEPLOYED CLIENT MEETS ON THE NEW FUNCTIONS. Run in a worktree of origin/master.
// For every share stored in each database: master's own `fetchPublicDossier` (its supabase client answered by the
// local chain) builds the page's model; then master's own tab components are RENDERED over it (react-dom/server),
// as the shared page draws them (publicDossier, playerView). Counted: a page model that failed to build; a tab that
// threw; my markers and the names of houses hidden whole (any letter case) in the HTML each tab printed.
//   RV6_SRC=<master worktree> RV6_PROBE=oldclient.probe.jsx RV6_DBS=<db>[,<db>] RV6_LIMIT=48 RV6_OUT=… vitest
// @vitest-environment jsdom
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = process.env.RV6_OUT; const DBS = (process.env.RV6_DBS || '').split(',').filter(Boolean); const LIMIT = Number(process.env.RV6_LIMIT || 48);
let db = null;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ isConfigured: true, supabase: {
  auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  rpc: async (name, args) => { try {
    if (name === 'get_gallery_dossier') return { data: (await db.query('select * from public.get_gallery_dossier($1)', [args.dossier_slug])).rows, error: null };
    if (name === 'get_unlisted_dossier') return { data: (await db.query('select public.get_unlisted_dossier($1) x', [args.p_slug])).rows[0]?.x ?? null, error: null };
    return { data: null, error: null }; } catch (e) { return { data: null, error: { message: String(e.message) } }; } } } }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const fold = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
it('the deployed client over the chains', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const React = (await import(`${SRC}/node_modules/react/index.js`)).default;
  const { renderToString } = await import(`${SRC}/node_modules/react-dom/server.node.js`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const T = `${SRC}/src/components/new/tabs`;
  const tabs = {};
  for (const [name, path, props] of [['Overview', `${T}/OverviewTab.jsx`, (s) => ({ settlement: s, narrativeNote: null, onNavigateTab: () => {} })], ['Economics', `${T}/EconomicsTab.jsx`, (s) => ({ settlement: s, narrativeNote: null })],
    ['Services', `${T}/ServicesTab.jsx`, (s) => ({ services: s.availableServices, settlement: s, narrativeNote: null })], ['Power', `${T}/PowerTab.jsx`, (s) => ({ powerStructure: s.powerStructure, settlement: s, narrativeNote: null })],
    ['Defense', `${T}/DefenseTab.jsx`, (s) => ({ settlement: s, narrativeNote: null })], ['NPCs', `${T}/NPCsTab.jsx`, (s) => ({ npcs: s.npcs, settlement: s, narrativeNote: null, pinnedIds: [] })],
    ['History', `${T}/HistoryTab.jsx`, (s) => ({ settlement: s, narrativeNote: null, recentEvents: [] })], ['Resources', `${T}/ResourcesTab.jsx`, (s) => ({ settlement: s, narrativeNote: null })],
    ['Viability', `${T}/ViabilityTab.jsx`, (s) => ({ settlement: s, narrativeNote: null })], ['Relationships', `${T}/RelationshipsTab.jsx`, (s) => ({ settlement: s, narrativeNote: null })],
    ['Summary', `${SRC}/src/components/new/SummaryTab.jsx`, (s) => ({ settlement: s })]]) {
    try { const mod = await import(path); const C = mod[`${name}Tab`] || mod.default; if (C) tabs[name] = { C, props }; } catch (e) { tabs[name] = { importError: String(e.message).slice(0, 120) }; }
  }
  const lines = [];
  for (const dbname of DBS) {
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
    await db.query(`select set_config('test.uid', '', false)`);
    const shares = (await db.query(`select public_slug, unlisted_slug, name, gallery_share_dm dm, (select jsonb_agg(i->>'name') from jsonb_array_elements(data->'institutions') i) names from public.settlements where public_slug is not null order by public_slug limit $1`, [LIMIT])).rows;
    const t = { shares: 0, noModel: 0, tabsRendered: 0, threw: {}, markerInHtml: {}, hiddenNameInHtml: {}, examples: {}, chars: 0 };
    for (const sh of shares) for (const slug of [sh.public_slug, sh.unlisted_slug]) {
      t.shares += 1; let page; try { page = await gallery.fetchPublicDossier(slug); } catch (e) { page = null; t.examples.model = String(e.message).slice(0, 140); }
      const s = page && (page.settlement || page.data || page.dossier); if (!isRec(s)) { t.noModel += 1; continue; }
      const open = new Set((s.institutions || []).filter(isRec).map((i) => fold(i.name)));
      const gone = (sh.names || []).filter((x) => typeof x === 'string' && fold(x).length >= 6 && !open.has(fold(x))).map(fold);
      for (const [name, tab] of Object.entries(tabs)) {
        if (!tab.C) { t.threw[`${name} (import)`] = tab.importError; continue; }
        let html = '';
        try { html = renderToString(React.createElement(tab.C, { ...tab.props(s), publicDossier: true, playerView: true })); t.tabsRendered += 1; t.chars += html.length; }
        catch (e) { t.threw[name] = (t.threw[name] || 0) + 1; t.examples[`threw ${name}`] = t.examples[`threw ${name}`] || `${sh.name}: ${String(e.message).slice(0, 140)}`; continue; }
        const text = html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
        if (/vq6n[0-9]+z/i.test(text)) { t.markerInHtml[name] = (t.markerInHtml[name] || 0) + 1; const m = text.match(/.{0,70}vq6n[0-9]+z/i); t.examples[`marker ${name}`] = t.examples[`marker ${name}`] || `${sh.name}${sh.dm ? ' (DM)' : ''}: …${m ? m[0] : ''}`; }
        const f = fold(text); const hit = gone.find((g) => f.includes(g));
        if (hit) { t.hiddenNameInHtml[name] = (t.hiddenNameInHtml[name] || 0) + 1; const i = f.indexOf(hit); t.examples[`hidden name ${name}`] = t.examples[`hidden name ${name}`] || `${sh.name}${sh.dm ? ' (DM)' : ''}: "${hit}" in "…${f.slice(Math.max(0, i - 50), i + hit.length + 30)}…"`; }
      }
    }
    await db.end();
    lines.push(`${dbname}: ${t.shares} pages (each share by its gallery slug and by its party link) | no page model ${t.noModel} | tabs rendered ${t.tabsRendered} (${t.chars} characters of HTML) | tabs that threw ${JSON.stringify(t.threw)} | pages whose tab printed one of my markers ${JSON.stringify(t.markerInHtml)} | pages whose tab printed the name of a house hidden whole ${JSON.stringify(t.hiddenNameInHtml)}`);
    for (const [k, v] of Object.entries(t.examples)) lines.push(`      ${k}: ${v}`);
  }
  writeFileSync(OUT, lines.join('\n') + '\n');
}, 14_400_000);
