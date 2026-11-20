// REVIEW-VEIL-11 — the governing body's name (the chair's question of 04:55 UTC). Born towns (random priorities); (1) towns whose
// stored government is a CRIMINAL body (Corrupt Council, Shadow Senate, Corrupt Oligarchy, Shadowed Council, …), the DEFAULT veil,
// get_gallery_dossier and the party link as anon: every served path holding the body's name or a criminal-government sentence,
// and the tile government_type. (2) every town: a HAND veil hiding the governing house whole (the institution whose name holds
// the label the body is read from), and the same reads: is the house removed, and is the body's name still served?
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const CRIM_GOV = /corrupt|shadow/i;
const SENT = /criminal networks have captured governance|masks a criminal oligarchy|official authority is a facade|back rooms|purchased|captured/i;
const walk = (v, p, out, test) => { if (typeof v === 'string') { if (test(v)) out.push(`${p}: ${v.slice(0, 90)}`); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, out, test)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k, out, test); };
const GOV_HOUSE = /royal seat|guild consortium|merchant oligarchy|reeve|council hall|town hall|city hall|governor|palace|keep|manor|assembly|theocra|temple council/i;
it('gov', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'gov';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { towns: 0, crimGov: 0, crimServedName: 0, crimServedSentence: 0, tiles: {}, paths: {}, ex: [], hand: { tried: 0, houseRemoved: 0, nameStill: 0, ex: [] }, govNames: {} };
  const read = async (n, A, ov) => {
    const id = `abcd9b00-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `gv${n}`, `gvl${n}`, JSON.stringify(ov)]);
    await db.query('set role anon');
    const g = (await db.query('select * from public.get_gallery_dossier($1)', [`gv${n}`])).rows[0];
    const l = (await db.query('select public.get_unlisted_dossier($1) as out', [`gvl${n}`])).rows[0].out;
    await db.query('reset role'); await db.query('delete from public.settlements where id = $1', [id]);
    return { g, l };
  };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'none', 'infiltrated', 'politically_fractured', 'indebted', 'occupied']) {
    n += 1; const seed = `rv11-gov-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    out.towns += 1; const gov = String(A.powerStructure?.government || ''); out.govNames[gov] = (out.govNames[gov] || 0) + 1;
    // (1) the default veil
    if (CRIM_GOV.test(gov)) {
      out.crimGov += 1;
      const { g, l } = await read(n * 2, A, veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }));
      const hitsName = []; walk({ gallery: g, link: l }, '', hitsName, (s) => s.includes(gov));
      const hitsSent = []; walk({ gallery: g, link: l }, '', hitsSent, (s) => SENT.test(s));
      if (hitsName.length) out.crimServedName += 1; if (hitsSent.length) out.crimServedSentence += 1;
      out.tiles[String(g.government_type)] = (out.tiles[String(g.government_type)] || 0) + 1;
      for (const h of [...hitsName, ...hitsSent]) { const p = h.split(':')[0].replace(/\[\d+\]/g, '[]'); out.paths[p] = (out.paths[p] || 0) + 1; }
      if (out.ex.length < 6) out.ex.push({ seed, gov, sentence: hitsSent.slice(0, 6), storedDesc: JSON.stringify(A.powerStructure).match(/.{0,80}(facade|back rooms|captured).{0,40}/)?.[0] });
    }
    // (2) a hand veil hiding the governing house whole
    const house = (A.institutions || []).find((i) => isRec(i) && GOV_HOUSE.test(String(i.name || '')));
    if (house) {
      out.hand.tried += 1;
      const card = V_id(veil, house);
      const ov = veil.writeShareVeil({}, [{ address: `card:institution:${card}`, hidden: true }], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const { g } = await read(n * 2 + 1, A, ov);
      const removed = !(g.data?.institutions || []).some((i) => i?.name === house.name);
      if (removed) out.hand.houseRemoved += 1;
      const still = JSON.stringify(g.data?.powerStructure?.government || '') + JSON.stringify(g.government_type || '');
      if (removed && gov && still.includes(gov)) { out.hand.nameStill += 1; if (out.hand.ex.length < 4) out.hand.ex.push(`${seed}: house "${house.name}" removed, government "${gov}" still served`); }
      if (!removed && out.hand.ex.length < 4) out.hand.ex.push(`${seed}: hand hide of "${house.name}" (${house.category}) did not remove it`);
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
function V_id(veil, house) { const K = veil.CARD_KINDS?.institution; return K ? K.idOf(house) : (house.id || house.name); }
