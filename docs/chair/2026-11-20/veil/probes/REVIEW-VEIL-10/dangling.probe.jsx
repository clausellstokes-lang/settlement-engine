// REVIEW-VEIL-10 — V8-5's CLASS, every door: a person the served read REMOVES (present in the stored npcs[], absent from the served
// npcs[]) — is any reference to them left in the served payload (their id, their name, npc.<slug>) at any path? Born towns, both
// stored shapes (RV10_GEN), the server (RV10_TPL), default veil and every eye shut, reveal off/on, gallery and link.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const slug = (s) => String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
const find = (v, needles, p = '', out = []) => { if (Array.isArray(v)) v.forEach((x) => find(x, needles, `${p}[]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { for (const nd of needles) if (k === nd.v) out.push([`${p}.{key}`, nd]); find(x, needles, p ? `${p}.${k}` : k, out); } else if (typeof v === 'string') for (const nd of needles) if (nd.v.length >= 4 && (v === nd.v || (nd.kind === 'name' && v.includes(nd.v)))) out.push([p, nd]); return out; };
it('dangling', async () => {
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
  let n = 0; const census = {}; const towns = [];
  for (const size of ['town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'occupied', 'indebted']) {
    const seed = `rv10-dang-${size}-${crisis}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    if (compose) { A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    for (const dm of [false, true]) for (const kind of ['default', 'all']) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      let eyes = []; if (kind === 'all') { const m = veil.curateModelFor(pub, []); eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]); }
      const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      n += 1; const id = `abcd7000-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','D','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(A), `dg${n}`, `dgl${n}`, JSON.stringify(ov), dm]);
      for (const read of ['gallery', 'link']) {
        const S = read === 'link' ? (await db.query('select public.get_unlisted_dossier($1) x', [`dgl${n}`])).rows[0].x.dossier : (await db.query('select data from public.get_gallery_dossier($1)', [`dg${n}`])).rows[0].data;
        const served = new Set((S.npcs || []).map((p) => p.name)); const servedIds = new Set((S.npcs || []).map((p) => p.id));
        const gone = (A.npcs || []).filter((p) => isRec(p) && p.name && !served.has(p.name));
        const needles = gone.flatMap((p) => [{ v: String(p.id || ''), kind: 'id', who: p.name }, { v: String(p.name), kind: 'name', who: p.name }, { v: `npc.${slug(p.name)}`, kind: 'key', who: p.name }]).filter((x) => x.v && !servedIds.has(x.v));
        const hits = find(S, needles);
        towns.push({ seed, dm, kind, read, removed: gone.length, refs: hits.length });
        for (const [p, nd] of hits) { const k = `${read} ${kind}${dm ? ' +DM' : ''} | ${p.replace(/\[\]/g, '[]')} | by ${nd.kind}`; const r = census[k] = census[k] || { n: 0, ex: `${seed}: ${nd.who} (${nd.v.slice(0, 60)})` }; r.n += 1; }
      }
      await db.query('delete from public.settlements where id = $1', [id]);
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ census, towns }, null, 1));
}, 14_400_000);
