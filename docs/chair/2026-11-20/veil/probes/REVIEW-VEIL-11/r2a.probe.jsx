// REVIEW-VEIL-11 — ATTACKS on R2 (4ddf8c60c). Born towns (RV10_GEN for master's shape), each stored on the chain BEFORE R2
// (RV11_PRE_TPL, built from 302850b0b) and AFTER (RV10_TPL), read by get_gallery_dossier as anon, then run through EACH TREE'S
// OWN client (fetchPublicDossier with the RPC answered by that chain's row). Shares: UNMARKED and the DEFAULT veil, Reveal DM
// off and on. (A) the membership re-stamp: every person's memberships the page model draws after R2 must equal before R2
// (by id and house), and no membership the owner's public projection drops (veiled !== false) may appear on a Reveal-DM-off
// page. (B) the black market's capture: drawn only on unmarked shares; on a marked share absent for every town. (C) FINAL
// arms: the raw measures absent from the served row; the served stability holds no word after its band.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const PRE = process.env.RV11_PRE; const GEN = process.env.RV10_GEN || SRC;
const rpcMock = () => ({ supabase: { rpc: async () => ({ data: globalThis.__rv11row ? [globalThis.__rv11row] : null, error: null }), auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }) } }, isConfigured: true });
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => rpcMock());
vi.mock(`${process.env.RV11_PRE}/src/lib/supabase.js`, () => rpcMock());
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const memSig = (page) => JSON.stringify((page?.npcs || []).map((n) => [n?.id || n?.name, (n?.memberships || []).map((m) => `${m?.kind || ''}:${m?.power || m?.key || m?.name || m?.id || ''}`).sort()]));
it('r2a', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  for (const [db, tpl] of [['r2a_post', process.env.RV10_TPL], ['r2a_pre', process.env.RV11_PRE_TPL]]) { await admin.query(`drop database if exists ${db} with (force)`); await admin.query(`create database ${db} template ${tpl}`); }
  await admin.end();
  const dbs = { post: new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'r2a_post' }), pre: new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'r2a_pre' }) };
  await dbs.post.connect(); await dbs.pre.connect();
  const lib = { post: await import(`${SRC}/src/lib/gallery.js`), pre: await import(`${PRE}/src/lib/gallery.js`) };
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const T = {}; const ex = []; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; if (ex.length < 14) ex.push(`${k}: ${e}`); } };
  const RAW = [['economicState', 'compound', 'criminalEffective'], ['economicState', 'compound', 'militaryEffective'], ['economicState', 'safetyProfile', 'safetyRatio'], ['economicState', 'safetyProfile', 'blackMarketCapture'], ['defenseProfile', 'scores', 'internal'], ['defenseProfile', 'scores', 'military'], ['defenseProfile', 'economicGates'], ['defenseProfile', 'readiness', 'score']];
  const at = (o, p) => p.reduce((x, k) => (x == null ? x : x[k]), o);
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'indebted', 'politically_fractured', 'none']) {
    n += 1; const seed = `rv11-r2-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    for (const marked of [false, true]) for (const dm of [false, true]) {
      const ov = marked ? veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) : {};
      const pages = {}; const rows = {};
      for (const side of ['pre', 'post']) {
        const db = dbs[side]; const id = `abcd9c00-0000-0000-0000-${String(n * 4 + (marked ? 2 : 0) + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `r2${n}${marked ? 'm' : 'u'}${dm ? 'd' : 'p'}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
          values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(A), slug, JSON.stringify(ov), dm]);
        await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0]; await db.query('reset role');
        await db.query('delete from public.settlements where id = $1', [id]);
        rows[side] = row; globalThis.__rv11row = JSON.parse(JSON.stringify(row));
        const page = await lib[side].fetchPublicDossier(slug); globalThis.__rv11row = null;
        pages[side] = page?.settlement || page?.data || page;
      }
      const tag = `${marked ? 'marked' : 'unmarked'} dm=${dm}`;
      // (A) memberships the page draws, before and after R2
      bump(`A memberships equal pre/post (${tag})`, memSig(pages.pre) !== memSig(pages.post), `${seed}: pre ${memSig(pages.pre).slice(0, 120)} | post ${memSig(pages.post).slice(0, 120)}`);
      if (!dm) { const pub = (A.npcs || []).flatMap((p) => (p?.memberships || []).filter((m) => !(isRec(m) && m.veiled === false)).map((m) => `${p.id || p.name}|${m?.kind || ''}:${m?.power || m?.key || m?.name || m?.id || ''}`));
        const drawn = new Set((pages.post?.npcs || []).flatMap((p) => (p?.memberships || []).map((m) => `${p.id || p.name}|${m?.kind || ''}:${m?.power || m?.key || m?.name || m?.id || ''}`)));
        const leak = pub.filter((x) => drawn.has(x)); if (leak.length && !globalThis.__memEx) { const [pid] = leak[0].split('|'); globalThis.__memEx = { seed, tag, leak: leak.slice(0, 3), stored: JSON.stringify((A.npcs || []).find((p) => String(p.id || p.name) === pid)?.memberships), drawn: JSON.stringify((pages.post?.npcs || []).find((p) => String(p.id || p.name) === pid)?.memberships) }; } bump(`A no secret membership drawn (${tag})`, leak.length > 0, `${seed}: ${leak.slice(0, 3).join(', ')}`); }
      // (B) the black market's capture on the page
      const cap = pages.post?.economicState?.safetyProfile?.blackMarketCapture;
      if (marked) bump(`B capture absent on a marked share (${tag})`, cap !== undefined, `${seed}: ${cap}`); else bump(`B capture drawn on an unmarked share (${tag})`, false, '');
      if (!marked && cap !== undefined) { const stored = A.economicState?.safetyProfile?.blackMarketCapture; bump(`B capture equals the owner's (${tag})`, stored !== cap, `${seed}: stored ${stored} page ${cap}`); }
      // (C) the served row
      for (const p of RAW) bump(`C served ${p.join('.')} absent (${tag})`, at(rows.post.data, p) !== undefined, `${seed}: ${String(JSON.stringify(at(rows.post.data, p))).slice(0, 40)}`);
      bump(`C served severity absent (${tag})`, (rows.post.data.activeConditions || []).some((c) => c && c.severity !== undefined), seed);
      const st = rows.post.data.powerStructure?.stability; bump(`C stability is a band word alone (${tag})`, typeof st === 'string' && /[(—;:,–-]|crime|criminal|gang|thie|smuggl/i.test(st), `${seed}: "${st}"`);
      bump(`C stability tile is a band word alone (${tag})`, typeof rows.post.stability === 'string' && /[(—;:,–-]|crime|criminal|gang|thie|smuggl/i.test(rows.post.stability), `${seed}: tile "${rows.post.stability}"`);
    }
  }
  await dbs.post.end(); await dbs.pre.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex, memEx: globalThis.__memEx }, null, 1));
}, 14_400_000);
