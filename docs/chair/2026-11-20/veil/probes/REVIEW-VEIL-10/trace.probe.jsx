import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('trace', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists tr1 with (force)`); await admin.query(`create database tr1 template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'tr1' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const rep = [];
  for (const [size, crisis, k] of [['town', 'none', 0], ['city', 'none', 0], ['metropolis', 'occupied', 0]]) {
    const seed = `rv10-gap-${size}-${crisis}-${k}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} }); A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    await db.query('delete from public.settlements');
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ('abcd9100-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','G','town',$1,true,'tr1',now(),'trl1','unlisted',$2,true,true,false)`, [JSON.stringify(A), JSON.stringify(ov)]);
    const S = (await db.query('select data from public.get_gallery_dossier($1)', ['tr1'])).rows[0].data;
    const sts = new Set((S.simulationTrace || []).map((t) => t.ts));
    const gone = (A.simulationTrace || []).filter((t) => !sts.has(t.ts));
    rep.push({ seed, crim: (A.institutions || []).filter((h) => /criminal/i.test(h.category || '')).map((h) => h.name), storedN: (A.simulationTrace || []).length, servedN: (S.simulationTrace || []).length, servedTs: (S.simulationTrace || []).map((t) => t.ts).join(','), gone: gone.map((t) => JSON.stringify(t).slice(0, 300)), keysOfStep: Object.keys((A.simulationTrace || [])[0] || {}) });
  }
  await db.end(); writeFileSync('/var/tmp/v16/rv10/trace-out.json', JSON.stringify(rep, null, 1));
}, 1200000);
