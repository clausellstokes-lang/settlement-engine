// VEIL-DOORS — THE TILE DOOR, MEASURED (V10-3; VR19, VR22). For born towns of every tier and crisis, three births on ONE
// seed (the REVIEW-VEIL-9 differ's A / B / C: as born; every hideable house cut after every step; the same number of
// ordinary houses cut), each stored as a gallery row (the facet columns as ShareToGallery writes them) under four shares:
// UNMARKED ({}), DEFAULT (writeShareVeil({}, [])), ALL (every eye shut), each Reveal DM off and on. Reads, on a native
// chain of the tree under test (RV_TPL, a template database): get_gallery_dossier's tile columns and `data`, and the
// tile row (_gallery_public_tile_rows) the lists read. Writes RV_OUT: per tile column, per share, the towns where A and B
// differ and where A and C differ, with examples; and the closed answers (data = the name alone).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV_N || 2);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const COLS = ['stability', 'prosperity', 'threat_level', 'government_type', 'terrain', 'magic_level', 'primary_resource', 'population', 'culture', 'primary_deity', 'at_war'];
it('VEIL-DOORS: the tile door', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV_DB || 'tiles_m'; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return JSON.parse(JSON.stringify(t));
  };
  let nrow = 0;
  const read = async (rec, dm, kind) => {
    let ov = {};
    if (kind === 'default') ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    if (kind === 'all') { const pub = veil.galleryPayloadFor(rec, { shareDm: dm, memberOverrides: {} }); const m = veil.curateModelFor(pub, []);
      const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); }
    nrow += 1; const id = `abcd9f00-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,gallery_facet_culture,gallery_facet_prosperity,gallery_facet_deity)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true,false,$8,$9,$10)`,
    [id, rec.name || 'x', JSON.stringify(rec), `tl${nrow}`, `tll${nrow}`, JSON.stringify(ov), dm, rec?.config?.culture || null, rec?.economicState?.prosperity || null, rec?.config?.primaryDeitySnapshot?.name || null]);
    const g = (await db.query('select * from public.get_gallery_dossier($1)', [`tl${nrow}`])).rows[0] || null;
    const t = (await db.query('select * from public._gallery_public_tile_rows() where id = $1', [id])).rows[0] || null;
    await db.query('delete from public.settlements where id = $1', [id]);
    const closed = !!g && isRec(g.data) && Object.keys(g.data).length <= 1;
    return { dossier: g ? Object.fromEntries(COLS.map((c) => [c, g[c] ?? null])) : null, tile: t ? Object.fromEntries(COLS.map((c) => [c, t[c] ?? null])) : null,
      docStability: g?.data?.powerStructure?.stability ?? null, docProsperity: g?.data?.economicState?.prosperity ?? null, closed };
  };
  const census = {}; const towns = []; let idx = 0;
  const bump = (key, which, seed, ex) => { const r = census[key] = census[key] || { B: new Set(), C: new Set(), ex: {} }; r[which].add(seed); if (!r.ex[which] || r.ex[which].length < 4) (r.ex[which] = r.ex[which] || []).push(ex); };
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const seed = `rv10-tile-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { towns.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const H = (A.institutions || []).filter(hideable);
    const ordinary = (A.institutions || []).filter((h) => isRec(h) && !hideable(h) && !h.required).map((h) => h.name).sort((x, y) => (x.length * 7919 + x.charCodeAt(0)) % 101 - (y.length * 7919 + y.charCodeAt(0)) % 101);
    const cNames = new Set(ordinary.slice(0, Math.max(1, H.length)));
    const B = H.length ? birth(cfg, seed, hideable) : null; const C = birth(cfg, seed, (h) => isRec(h) && cNames.has(h.name));
    towns.push({ seed, size, crisis, hideable: H.map((h) => h.name) });
    for (const dm of [false, true]) for (const kind of ['none', 'default', 'all']) {
      const vk = `${kind}${dm ? '+DM' : ''}`;
      const rA = await read(A, dm, kind); const rB = B ? await read(B, dm, kind) : null; const rC = await read(C, dm, kind);
      if (rA.closed) bump(`CLOSED ${vk}`, 'B', seed, 'closed');
      for (const surf of ['dossier', 'tile']) for (const c of COLS) {
        if (rB && JSON.stringify(rA[surf]?.[c]) !== JSON.stringify(rB[surf]?.[c])) bump(`${surf}.${c} ${vk}`, 'B', seed, `${seed}: A=${rA[surf]?.[c]} | B=${rB[surf]?.[c]}`);
        if (JSON.stringify(rA[surf]?.[c]) !== JSON.stringify(rC[surf]?.[c])) bump(`${surf}.${c} ${vk}`, 'C', seed, `${seed}: A=${rA[surf]?.[c]} | C=${rC[surf]?.[c]}`);
      }
      if (rA.dossier?.stability !== rA.docStability) bump(`dossier.stability vs data.powerStructure.stability ${vk}`, 'B', seed, `${rA.dossier?.stability} | data=${rA.docStability}`);
      if (rA.tile?.prosperity !== rA.docProsperity) bump(`tile.prosperity vs data.economicState.prosperity ${vk}`, 'B', seed, `${rA.tile?.prosperity} | data=${rA.docProsperity}`);
    }
  }
  await db.end();
  const rows = Object.entries(census).map(([key, r]) => ({ key, B: r.B.size, C: r.C.size, ex: r.ex }));
  writeFileSync(process.env.RV_OUT, JSON.stringify({ births: towns.length, withHideable: towns.filter((t) => t.hideable?.length).length, towns, rows }, null, 1));
}, 14_400_000);
