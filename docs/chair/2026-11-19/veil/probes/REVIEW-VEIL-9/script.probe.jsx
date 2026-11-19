// REVIEW-VEIL-9 — BORN TOWNS WHOSE HIDEABLE HOUSES ARE NAMED IN SCRIPTS WITH NO LATIN LETTER. Born by the tree's own
// pipeline (every size, calm and under crises), then each house of the hideable class (the server's own class test,
// `_gallery_veil_hideable`-like: category Criminal or a criminal tag) is given a name from POOL, and EVERY occurrence of
// its birth name in any letter case, in every string value and key of the town, is replaced by it (as if the engine had
// written that name everywhere it writes the name); then the public prose is composed again by the tree's own composer.
// Each town is stored on each chain (RV9_CHAINS db:template) with every eye shut by hand (the cold pass's own method:
// curateModelFor's every address), reveal off and on, live and frozen, and a map that holds it. The reads are made by
// names-unicode.mjs and page.probe.jsx afterwards. Writes RV9_OUT (the names given, by town).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const CHAINS = (process.env.RV9_CHAINS || '').split(',').filter(Boolean).map((x) => { const [db, tpl] = x.split(':'); return { db, tpl }; });
const SIZES = (process.env.RV9_SIZES || 'village,town,city,metropolis').split(',');
const STRESSES = (process.env.RV9_STRESSES || 'none,infiltrated,insurgency,occupied,indebted').split(',');
const SEEDS = Number(process.env.RV9_SEEDS || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const POOL = ['闇市', '암시장', 'ヤミ市の組', 'Гильдия теней', 'ตลาดมืด', 'Σκιώδης Συντεχνία', 'שוק שחור', 'السوق السوداء', 'Գողերի գիլդիա', 'ბნელი ბაზარი', 'Ночной рынок', '盗賊ギルド'];
const OWNER = '11111111-1111-1111-1111-111111111111';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
it('REVIEW-VEIL-9: born towns, hideable houses named in other scripts', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const { composePublicProse } = await import(`${M}/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${M}/domain/display/publicProse.js`);
  await loadGenerationLawPayloads();
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbs = {};
  for (const c of CHAINS) { const name = `${c.db}_${SHARD[0]}`; await admin.query(`drop database if exists ${name} with (force)`); await admin.query(`create database ${name} template ${c.tpl}`);
    dbs[c.db] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: name }); await dbs[c.db].connect(); }
  await admin.end();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { towns: [], threw: [], raised: [] }; let idx = 0; let n = 0;
  for (let k = 0; k < SEEDS; k += 1) for (const size of SIZES) for (const stress of STRESSES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv9-script-${size}-${stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress !== 'none' ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let town; try { town = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); } catch (e) { out.threw.push(`${seed}: ${String(e.message).slice(0, 140)}`); continue; }
    const hideable = (town.institutions || []).filter(isRec).filter((h) => /criminal/i.test(h.category || '') || (Array.isArray(h.tags) && h.tags.includes('criminal')));
    if (!hideable.length) { out.towns.push({ seed, names: {} }); continue; }
    const names = {}; hideable.forEach((h, i) => { names[h.name] = POOL[(i + idx) % POOL.length]; });
    // the longest birth name first, so "Thieves' guild (powerful)" goes before "Thieves' guild"
    const order = Object.keys(names).sort((a, b) => b.length - a.length);
    const swap = (s) => { let o = s; for (const nm of order) o = o.replace(new RegExp(esc(nm), 'gi'), names[nm]); return o; };
    const walk = (v) => { if (Array.isArray(v)) return v.map(walk); if (isRec(v)) { const o = {}; for (const [kk, x] of Object.entries(v)) o[swap(kk)] = walk(x); return o; } return typeof v === 'string' ? swap(v) : v; };
    let rec = walk(town); delete rec.publicProse;
    try { rec = withPublicProse(rec, composePublicProse(rec)); } catch (e) { out.threw.push(`${seed} compose: ${String(e.message).slice(0, 140)}`); }
    out.towns.push({ seed, name: rec.name, names });
    for (const dm of [false, true]) for (const mode of ['live', 'snapshot']) {
      const pub = veil.galleryPayloadFor(rec, { shareDm: dm, memberOverrides: {} });
      const m = veil.curateModelFor(pub, []);
      const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode, at: '2026-11-01T00:00:00.000Z' });
      n += 1; const id = `abcd99${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`;
      const slug = `s9p${SHARD[0]}x${n}`; const link = `s9l${SHARD[0]}x${n}`; const map = `s9m${SHARD[0]}x${n}`; const mapLink = `s9u${SHARD[0]}x${n}`;
      for (const c of CHAINS) { const db = dbs[c.db];
        try {
          await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
            values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',$8,$9,true,false)`, [id, OWNER, rec.name || seed, size, JSON.stringify(rec), slug, link, JSON.stringify(ov), dm]);
          await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign,unlisted_slug,gallery_importable,visibility,published_at) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true,$4,true,'unlisted',now())`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map, mapLink]);
        } catch (e) { out.raised.push(`${c.db} ${seed}: ${String(e.message).slice(0, 160)}`); } }
    }
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c.db].end();
}, 14_400_000);
