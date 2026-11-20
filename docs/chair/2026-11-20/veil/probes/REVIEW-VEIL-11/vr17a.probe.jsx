// REVIEW-VEIL-11 — ONE ATTACK on VEIL-VR17's cure (efca35fd6): the cure reads "open" from the served data's
// safetyProfile.criminalInstitutions + crimeTypes. Its test covers Reveal-DM OFF and live mode only. Here: born towns (RV10_GEN or
// RV6_SRC), Defense's grouping SHUT (or OPEN, the control), every other default; Reveal-DM off/on x live/snapshot; read as anon by
// the gallery read and the party link; then the tree's own client (gallery.js sanitizer where exported) and isVeiled(publicDossier).
// A SHUT case whose served page model reads OPEN is a leak of the derived block; an OPEN case that reads SHUT is a loss.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const ADDR = 'block:defense.criminalStructure';
it('vr17a', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'v17a';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const sanitize = gallery.sanitizeDossier || null;
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const T = {}; const ex = []; let n = 0; const N = Number(process.env.RV10_N || 1);
  const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; if (ex.length < 12) ex.push(`${k}: ${e}`); } };
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'occupied', 'politically_fractured', 'none']) {
    n += 1; const seed = `rv11-v17-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    for (const shut of [true, false]) for (const dm of [false, true]) for (const mode of ['live', 'snapshot']) {
      const deltas = [{ address: ADDR, hidden: shut }];
      let ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      if (mode === 'snapshot') ov = veil.writeShareVeil(ov, deltas, { mode: 'snapshot', at: '2026-11-01T00:00:00.000Z', snapshot: veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: ov }) });
      const id = `abcd9600-0000-0000-0000-${String(n * 8 + (shut ? 0 : 4) + (dm ? 2 : 0) + (mode === 'live' ? 0 : 1)).padStart(12, '0')}`;
      const slug = `v17${n}${shut ? 's' : 'o'}${dm ? 'd' : 'n'}${mode[0]}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(A), slug, `${slug}l`, JSON.stringify(ov), dm]);
      await db.query('set role anon');
      const g = (await db.query('select data from public.get_gallery_dossier($1)', [slug])).rows[0]?.data;
      const l = (await db.query('select public.get_unlisted_dossier($1) as out', [`${slug}l`])).rows[0]?.out;
      await db.query('reset role'); await db.query('delete from public.settlements where id = $1', [id]);
      for (const [surf, raw] of [['gallery', g], ['link', l?.dossier]]) {
        if (!raw) { bump(`${surf} no-data`, true, seed); continue; }
        const data = raw.data && raw.data.economicState === undefined && raw.data.institutions === undefined ? raw.data : raw;
        let page = data; if (sanitize) { try { page = sanitize(JSON.parse(JSON.stringify(data))) || data; } catch (e) { page = data; } }
        const read = veil.isVeiled(page, ADDR, { publicDossier: true });
        const sp = page?.economicState?.safetyProfile || {};
        bump(`${surf} ${shut ? 'SHUT' : 'open'} dm=${dm} ${mode}`, shut ? !read : read, `${seed}: isVeiled=${read} ci=${Array.isArray(sp.criminalInstitutions) ? sp.criminalInstitutions.length : 'none'} ct=${Array.isArray(sp.crimeTypes) ? sp.crimeTypes.length : 'none'}`);
      }
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ tally: T, ex }, null, 1));
}, 14_400_000);
