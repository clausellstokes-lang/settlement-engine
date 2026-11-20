// REVIEW-VEIL-10 — V8-9's CLOSED ANSWER: a born metropolis whose hidden house's name is grown past the bound (17,000 code points;
// and a second case by weight: 4,500 code points of 1,000 distinct Han). Served by gallery and link, default veil, reveal off/on.
// What survives the closed read (every leaf path), and is the hidden name anywhere; the same town just under the bound for contrast.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const leaves = (v, p = '', out = []) => { if (Array.isArray(v)) v.forEach((x) => leaves(x, `${p}[]`, out)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, p ? `${p}.${k}` : k, out); else out.push(`${p}=${JSON.stringify(v).slice(0, 60)}`); return out; };
it('closed', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists cl1 with (force)`); await admin.query(`create database cl1 template x212`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'cl1' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'city' }), null, { seed: 'rv10-sw-city-none-18', customContent: {} }); A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
  const old = (A.institutions || []).find((h) => /criminal/i.test(h.category || '')).name;
  const swap = (rec, nn) => JSON.parse(JSON.stringify(rec).split(JSON.stringify(old).slice(1, -1)).join(nn));
  const han = Array.from({ length: 4500 }, (_, i) => String.fromCodePoint(0x4e00 + (i % 1000))).join('');
  const cases = { under: `Zq${'x'.repeat(14000)}`, over: `Zq${'x'.repeat(17000)}`, weight: `Zq${han}` };
  const rep = {}; let n = 0;
  for (const [k, nn] of Object.entries(cases)) for (const dm of [false, true]) {
    const R = swap(A, nn); n += 1;
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','Cl','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [`abcd6000-0000-0000-0000-${String(n).padStart(12, '0')}`, JSON.stringify(R), `cl${n}`, `cll${n}`, JSON.stringify(ov), dm]);
    const t0 = Date.now(); const g = (await db.query('select data, stability, chronicle from public.get_gallery_dossier($1)', [`cl${n}`])).rows[0]; const ms = Date.now() - t0;
    const l = (await db.query('select public.get_unlisted_dossier($1) x', [`cll${n}`])).rows[0].x;
    const lv = leaves(g.data);
    rep[`${k} dm=${dm}`] = { ms, leaves: lv.length, hasName: JSON.stringify(g.data).includes(nn.slice(0, 40)) || JSON.stringify(l).includes(nn.slice(0, 40)), linkLeaves: leaves(l.dossier).length, sampleLeaves: lv.slice(0, 40), stability: g.stability };
  }
  await db.end(); writeFileSync('/var/tmp/v16/rv10/closed-out.json', JSON.stringify(rep, null, 1));
}, 1200000);
