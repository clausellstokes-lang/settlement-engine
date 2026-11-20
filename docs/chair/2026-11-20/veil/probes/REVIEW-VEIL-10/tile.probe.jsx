// REVIEW-VEIL-10 — THE GALLERY LIST'S TILE (list_gallery_dossiers -> _gallery_public_tile_rows): a door 212 does not govern.
// Births A (as born), B (every hideable house cut after every step), C (control: as many ordinary houses cut). Each stored
// public with the DEFAULT veil (writeShareVeil({}, [])) on a clone of RV10_TPL; the tile read as anon by list_gallery_dossiers
// (search by name); and the dossier read (get_gallery_dossier) for the same row. Writes per tile column: towns A/B differ, A/C.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('REVIEW-VEIL-10: the tile door', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV10_DB; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    if (compose) { t = { ...t }; delete t.publicProse; t = withPP(t, compose(t)); }
    return JSON.parse(JSON.stringify(t));
  };
  let nrow = 0;
  const store = async (rec, tag) => { nrow += 1; const id = `abcd2000-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const name = `T${nrow} ${tag}`;
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,false,true,false)`, [id, name, JSON.stringify(rec), `tl${nrow}`, `tll${nrow}`, JSON.stringify(ov)]);
    await db.query(`set role anon`);
    const tile = (await db.query(`select * from public.list_gallery_dossiers(0, 60, 'newest', $1, '{}'::jsonb, false)`, [name])).rows.find((r) => r.id === id);
    const dos = (await db.query(`select * from public.get_gallery_dossier($1)`, [`tl${nrow}`])).rows[0]?.data;
    await db.query(`reset role`);
    await db.query('delete from public.settlements where id = $1', [id]);
    return { id, tile, dos };
  };
  const COLS = ['population', 'terrain', 'government_type', 'magic_level', 'stability', 'primary_resource', 'threat_level', 'culture', 'prosperity', 'primary_deity', 'at_war'];
  const SIZES = (process.env.RV10_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
  const CRISES = (process.env.RV10_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
  const N = Number(process.env.RV10_N || 1);
  const census = {}; const towns = []; const crimeWords = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const seed = `rv10-tile-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { towns.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const H = (A.institutions || []).filter(hideable); if (!H.length) { towns.push({ seed, hideable: 0 }); continue; }
    const ordinary = (A.institutions || []).filter((h) => isRec(h) && !hideable(h) && !h.required).map((h) => h.name).sort();
    const cNames = new Set(ordinary.slice(0, H.length));
    const B = birth(cfg, seed, hideable); const C = birth(cfg, seed, (h) => isRec(h) && cNames.has(h.name));
    const a = await store(A, 'A'); const b = await store(B, 'B'); const c = await store(C, 'C');
    const sentHouses = (a.dos?.institutions || []).filter(hideable).length;
    towns.push({ seed, size, crisis, hideable: H.map((h) => h.name), sentHideable: sentHouses, tileA: a.tile && Object.fromEntries(COLS.map((x) => [x, a.tile[x]])), dosStability: a.dos?.powerStructure?.stability });
    for (const col of COLS) {
      const r = census[col] = census[col] || { AB: 0, AC: 0, ex: [] };
      const va = a.tile?.[col]; const vb = b.tile?.[col]; const vc = c.tile?.[col];
      if (JSON.stringify(va) !== JSON.stringify(vb)) { r.AB += 1; if (r.ex.length < 6) r.ex.push(`${seed}: A=${JSON.stringify(va)} B=${JSON.stringify(vb)} C=${JSON.stringify(vc)}`); }
      if (JSON.stringify(va) !== JSON.stringify(vc)) r.AC += 1;
    }
    if (/crime|criminal|smuggl|thie|underworld|black market/i.test(JSON.stringify(a.tile || {}))) crimeWords.push({ seed, tile: a.tile && Object.fromEntries(COLS.map((x) => [x, a.tile[x]])), hidden: H.map((h) => h.name), sentHideable: sentHouses, dossierStability: a.dos?.powerStructure?.stability });
  }
  await db.end();
  writeFileSync(process.env.RV10_OUT, JSON.stringify({ census, crimeWords, towns }, null, 1));
}, 14_400_000);
