// REVIEW-VEIL-9 — THE DIFFER'S CORPUS THROUGH THE SERVER: the differ reads the client's twin; this proves the twin equals
// the SERVER on the differ's own A births. Each A birth (the differ's seeds and plan) stored on RV9_DB (cloned from
// RV9_TPL) under the default veil and under every eye shut, reveal off and on; then the gallery read (and the party link,
// player view) compared path by path with the twin's projection of the same row. Writes RV9_OUT.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV9_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const flat = (v, p, out) => { if (Array.isArray(v)) v.forEach((x, i) => flat(x, `${p}[${i}]`, out)); else if (isRec(v)) for (const k of Object.keys(v).sort()) flat(v[k], `${p}.${k}`, out); else out.set(p, JSON.stringify(v)); return out; };
it('REVIEW-VEIL-9: the differ corpus, server against twin', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null; try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const tally = { shares: 0, equal: 0, differ: 0, threw: 0 }; const ex = []; let idx = 0; let n = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv9-diff-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); if (compose) { A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A)); } catch { tally.threw += 1; continue; }
    for (const dm of [false, true]) for (const kind of ['default', 'all']) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      let eyes = []; if (kind === 'all') { const m = veil.curateModelFor(pub, []); eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]); }
      const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const twin = veil.projectShareVeil(pub, ov);
      n += 1; const id = `abcd9e${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,$3,$4,true,$5,now(),$6,'unlisted',$7,$8,true,false)`, [id, A.name || seed, size, JSON.stringify(A), `ds${SHARD[0]}x${n}`, `dsl${SHARD[0]}x${n}`, JSON.stringify(ov), dm]);
      const server = (await db.query('select * from public.get_gallery_dossier($1)', [`ds${SHARD[0]}x${n}`])).rows[0]?.data;
      tally.shares += 1; const a = flat(server, '', new Map()); const b = flat(twin, '', new Map()); const d = [];
      for (const [p, v] of a) if (b.get(p) !== v) d.push(p); for (const p of b.keys()) if (!a.has(p)) d.push(p);
      if (d.length) { tally.differ += 1; if (ex.length < 12) ex.push(`${seed} ${kind}${dm ? ' +DM' : ''}: ${d.length} paths, e.g. ${d.slice(0, 4).join(' ')}`); } else tally.equal += 1;
    }
  }
  await db.end(); writeFileSync(process.env.RV9_OUT, JSON.stringify({ tally, ex }, null, 1));
}, 14_400_000);
