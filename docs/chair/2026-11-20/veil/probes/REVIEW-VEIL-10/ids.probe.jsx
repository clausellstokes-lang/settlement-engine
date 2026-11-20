// REVIEW-VEIL-10 — IDS AND GAPS: what a served id or a served numbering says of a withheld house. One metropolis, default veil, served by the server.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('ids', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ids1 with (force)`); await admin.query(`create database ids1 template x212`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'ids1' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'metropolis' }), null, { seed: 'rv10-sw-metropolis-none-31', customContent: {} }); A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
  const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
    values ('abcd4000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','I','town',$1,true,'id1',now(),'idl1','unlisted',$2,true,true,false)`, [JSON.stringify(A), JSON.stringify(ov)]);
  const g = (await db.query('select data from public.get_gallery_dossier($1)', ['id1'])).rows[0].data;
  const l = (await db.query('select public.get_unlisted_dossier($1) x', ['idl1'])).rows[0].x.dossier;
  await db.end();
  const rep = { storedInst: (A.institutions || []).map((h, i) => `${i}|${h.id || ''}|${h.name}|${h.category}`), servedInst: (g.institutions || []).map((h) => `${h.id || ''}|${h.name}`),
    storedNpcIds: (A.npcs || []).map((p) => `${p.id}|${p.name}|${typeof p.institution === 'object' ? p.institution?.key : p.institution}`), servedNpcIdsGallery: (g.npcs || []).map((p) => `${p.id}|${p.name}`), servedNpcIdsLink: (l.npcs || []).map((p) => `${p.id}|${p.name}`) };
  writeFileSync('/var/tmp/v16/rv10/ids-out.json', JSON.stringify(rep, null, 1)); writeFileSync('/var/tmp/v16/rv10/ids-A.json', JSON.stringify(A)); writeFileSync('/var/tmp/v16/rv10/ids-G.json', JSON.stringify(g)); writeFileSync('/var/tmp/v16/rv10/ids-L.json', JSON.stringify(l));
}, 600000);
