// REVIEW-VEIL-5 — R3 end to end: a town whose owner-composed succession line differs from the stripped composition is
// saved as the new client saves it (data.publicProse stamped), shared without any reveal, and read through the four
// reads of a 211 chain. What sentence does a reader get, and does the response hold the hidden power anywhere else?
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV5_SRC; const OUT = process.env.RV5_OUT; const PGMOD = process.env.RV5_PGMOD; const DB = process.env.RV5_DB;
const TOWNS = (process.env.RV5_TOWNS || 'village:infiltrated:3,town:infiltrated:8,village:infiltrated:9').split(',').map((x) => x.split(':'));
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
it('R3 end to end', async () => {
  const pg = (await import(`${PGMOD}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const { composePublicProse } = await import(`${M}/components/new/publicProseCompose.js`);
  const safe = await import(`${M}/domain/display/publicSafe.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const out = [];
  let n = 0;
  for (const [size, stress, k] of TOWNS) {
    const seed = `rv5-r3-${size}-${stress === 'null' ? null : stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress !== 'null' ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
    const stripped = safe.publicVeiledRecordOf(s);
    const hidden = (s.powerStructure?.factions || []).filter((f) => !(stripped.powerStructure?.factions || []).some((g) => (g.faction || g.name) === (f.faction || f.name))).map((f) => f.faction || f.name);
    const A = composePublicProse(s); const B = composePublicProse(stripped);
    const saved = { ...s, publicProse: A };
    for (const [share, ov] of [['unmarked', {}], ['default-veil', veil.writeShareVeil({}, [], { mode: 'live' })]]) {
      n += 1; const id = `abcd9999-0000-0000-0000-${String(n).padStart(12, '0')}`; const slug = `r3p${n}`; const link = `r3l${n}`; const map = `r3m${n}`;
      await db.query(`select set_config('test.uid', '', false)`);
      await db.query('delete from public.saved_maps where public_slug = $1', [map]); await db.query('delete from public.settlements where id = $1', [id]);
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',$8,false,true)`, [id, OWNER, s.name, size, JSON.stringify(saved), slug, link, JSON.stringify(ov)]);
      await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map]);
      await db.query(`select set_config('test.uid', '', false)`);
      const g = (await db.query('select data from public.get_gallery_dossier($1)', [slug])).rows[0]?.data;
      const l = (await db.query('select public.get_unlisted_dossier($1) as x', [link])).rows[0]?.x?.dossier;
      const m = (await db.query('select public.get_gallery_map($1) as x', [map])).rows[0]?.x?.members?.[0]?.settlement;
      await db.query(`select set_config('test.uid', $1, false)`, [READER]);
      const im = (await db.query('select data from public.import_gallery_dossier($1)', [slug])).rows[0]?.data;
      const line = (d) => d?.publicProse?.blocks?.['power:desk']?.successionRisk ?? null;
      const page = g ? veil.projectServedVeil(safe.toPublicSafe(g, {}), {}) : null;
      out.push({ seed, share, hiddenPowers: hidden, ownerLine: A.blocks['power:desk']?.successionRisk, strippedLine: B.blocks['power:desk']?.successionRisk,
        gallery: line(g), link: line(l), map: line(m), import: line(im), page: line(page),
        powersSentGallery: (g?.powerStructure?.factions || []).map((f) => f.faction || f.name), hiddenNameAnywhere: hidden.filter((h) => JSON.stringify([g, l, m, im]).includes(h)),
        ownerConflictLines: A.blocks['general:overview']?.conflictLines?.length, strippedConflictLines: B.blocks['general:overview']?.conflictLines?.length, galleryConflictLines: g?.publicProse?.blocks?.['general:overview']?.conflictLines?.length });
    }
  }
  await db.end();
  writeFileSync(OUT, JSON.stringify(out, null, 1));
}, 3_600_000);
