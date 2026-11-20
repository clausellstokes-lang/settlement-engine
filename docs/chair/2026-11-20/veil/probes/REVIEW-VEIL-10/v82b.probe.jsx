// REVIEW-VEIL-10 — V8-2 attacked: a criminal house renamed by a writer that moves `name` only (catalogId kept, every other copy
// under the birth name: defence rows, services, chains, people's house keys), then hidden whole by the DEFAULT veil. Served by
// the server (gallery, link; reveal off/on). Is the BIRTH name, the NEW name, or the house's description anywhere?
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const where = (v, needle, p = '', out = []) => { if (Array.isArray(v)) v.forEach((x, i) => where(x, needle, `${p}[${i}]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { if (k.toLowerCase().includes(needle)) out.push(`${p}.{${k}}`); where(x, needle, p ? `${p}.${k}` : k, out); } else if (typeof v === 'string' && v.toLowerCase().includes(needle)) out.push(`${p}=${v.slice(0, 120)}`); return out; };
it('v82', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists v82b with (force)`); await admin.query(`create database v82b template x212`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'v82b' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const rep = []; let n = 0;
  for (const seed of ['rv10-sw-city-none-18', 'rv10-sw-city-insurgency-15']) {
    const size = seed.includes('metropolis') ? 'metropolis' : 'city';
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size }), null, { seed, customContent: {} }); A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    for (const h of (A.institutions || []).filter((x) => /criminal/i.test(String(x.category || '')))) {
      const R = JSON.parse(JSON.stringify(A)); const r = R.institutions.find((x) => x.name === h.name); const birth = r.name; if (!process.env.NORENAME) r.name = 'Qqv Lantern Society';
      for (const dm of [false, true]) {
        n += 1; const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
          values ($1,'11111111-1111-1111-1111-111111111111','V','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [`abcd8000-0000-0000-0000-${String(n).padStart(12, '0')}`, JSON.stringify(R), `v8${n}`, `v8l${n}`, JSON.stringify(ov), dm]);
        const g = (await db.query('select data from public.get_gallery_dossier($1)', [`v8${n}`])).rows[0].data;
        const l = (await db.query('select public.get_unlisted_dossier($1) x', [`v8l${n}`])).rows[0].x.dossier;
        const desc = String(h.description || h.desc || '').slice(0, 40).toLowerCase();
        rep.push({ seed, birth, dm, inStored: where(R, birth.toLowerCase()).length,
          galleryBirth: where(g, birth.toLowerCase()).slice(0, 6), galleryNew: where(g, 'qqv lantern').slice(0, 4), galleryDesc: desc.length > 20 ? where(g, desc).slice(0, 3) : 'n/a',
          linkBirth: where(l, birth.toLowerCase()).slice(0, 6), linkNew: where(l, 'qqv lantern').slice(0, 4) });
      }
    }
  }
  await db.end(); writeFileSync('/var/tmp/v16/rv10/v82-norename.json', JSON.stringify(rep, null, 1));
}, 3600000);
