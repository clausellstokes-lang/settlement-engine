// REVIEW-VEIL-11 — ONE ATTACK on VEIL-DOORS as built (04704a660 / cca49cb8d): the chronicle's and the tiles' name lists hold the
// houses the veil removed, the people it removed and the powers the DM flagged hidden, but NOT a power the veil removes because
// its house is hidden (VR11). Born towns with a hideable house, the DEFAULT veil (marked), served by get_gallery_dossier as anon.
// Per town: the powers in the stored town and not in the served body (gone powers). A log is planted naming each gone power
// (IMPAIR_FACTION, a 'target' type) and, as the control, each served power; the read's chronicle and its tile columns are
// searched for each gone power's name, each gone house's name, and the gone persons' names.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const fname = (f) => String(f?.faction || f?.name || '');
it('doorsa', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'dra';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { towns: 0, withGonePower: 0, plantedGone: 0, servedGone: 0, plantedOpen: 0, servedOpen: 0, tileHits: [], chronHouseHits: 0, ex: [], govTile: {} };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'infiltrated', 'insurgency', 'politically_fractured', 'occupied', 'wartime', 'indebted']) {
    n += 1; const seed = `rv11-doors-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    if (!(A.institutions || []).some(hideable)) continue;
    const facs = (A.powerStructure?.factions || A.factions || []).filter(isRec);
    const log = facs.map((f, i) => ({ event: { id: `ev-${i}`, type: 'IMPAIR_FACTION', targetId: fname(f), payload: { faction: fname(f) }, cause: 'authoring' }, appliedAt: `2026-11-01T10:${String(i).padStart(2, '0')}:00.000Z`, narrativeSummary: `${fname(f)} was weakened by the watch.` }));
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9800-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,campaign_state)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false,$6)`, [id, JSON.stringify(A), `dr${n}`, `drl${n}`, JSON.stringify(ov), JSON.stringify({ eventLog: log })]);
    await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [`dr${n}`])).rows[0]; await db.query('reset role');
    await db.query('delete from public.settlements where id = $1', [id]);
    out.towns += 1; const S = row.data;
    const served = new Set((S.powerStructure?.factions || S.factions || []).map(fname));
    const gonePow = facs.map(fname).filter((x) => x && !served.has(x));
    const goneHouse = (A.institutions || []).filter((i) => !(S.institutions || []).some((x) => x.name === i.name)).map((i) => String(i.name || '')).filter(Boolean);
    if (gonePow.length) out.withGonePower += 1;
    const chron = JSON.stringify(row.chronicle || []);
    for (const g of gonePow) { out.plantedGone += 1; if (chron.includes(g)) { out.servedGone += 1; if (out.ex.length < 6) out.ex.push(`${seed}: gone power "${g}" served in the chronicle; gone houses ${JSON.stringify(goneHouse).slice(0, 120)}`); } }
    for (const o of served) { if (!o) continue; out.plantedOpen += 1; if (chron.includes(o)) out.servedOpen += 1; }
    for (const h of goneHouse) if (h.length > 3 && chron.toLowerCase().includes(h.toLowerCase())) out.chronHouseHits += 1;
    const tiles = { stability: row.stability, prosperity: row.prosperity, government_type: row.government_type, threat_level: row.threat_level, terrain: row.terrain, magic_level: row.magic_level, primary_resource: row.primary_resource };
    out.govTile[String(row.government_type)] = (out.govTile[String(row.government_type)] || 0) + 1;
    const sq = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    for (const [c, v] of Object.entries(tiles)) for (const nm of [...gonePow, ...goneHouse]) if (v && sq(nm).length > 3 && sq(v).includes(sq(nm))) out.tileHits.push(`${seed}: tile ${c}="${v}" holds withheld "${nm}"`);
    for (const [c, v] of Object.entries(tiles)) if (v && /thie|smuggl|black.?market|gang|criminal|assassin|syndicate|underworld/i.test(v)) out.tileHits.push(`${seed}: tile ${c}="${v}" crime-worded`);
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
