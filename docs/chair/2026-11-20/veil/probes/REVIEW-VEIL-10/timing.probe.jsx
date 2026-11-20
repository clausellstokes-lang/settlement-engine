// REVIEW-VEIL-10 — SIZES AND TIMES: the served read's latency and length as a function of what is hidden. Per seed: A (as born,
// its hideable houses hidden by the DEFAULT veil) and B (born without them; nothing to hide), both stored with the default veil.
// Each read (gallery, link) timed RV10_REPS times interleaved (A,B,A,B...), server-side by clock_timestamp around the call in
// one statement (no client round trip), median. Also A with every eye OPEN (nothing hidden: the walk has no name).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
it('timing', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV10_DB; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions); t = { ...t }; delete t.publicProse; return JSON.parse(JSON.stringify(withPP(t, compose(t))));
  };
  let n = 0;
  const store = async (rec, deltas) => { n += 1; const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','T','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [`abcd5000-0000-0000-0000-${String(n).padStart(12, '0')}`, JSON.stringify(rec), `tm${n}`, `tml${n}`, JSON.stringify(ov)]); return n; };
  const time = async (k, read) => { const q = read === 'link'
      ? `select extract(epoch from (clock_timestamp() - t0)) * 1000 as ms, len from (select clock_timestamp() t0) a, lateral (select length(public.get_unlisted_dossier('tml${k}')::text) len) b`
      : `select extract(epoch from (clock_timestamp() - t0)) * 1000 as ms, len from (select clock_timestamp() t0) a, lateral (select length(d.data::text) len from public.get_gallery_dossier('tm${k}') d) b`;
    const r = (await db.query(q)).rows[0]; return [Number(r.ms), Number(r.len)]; };
  const REPS = Number(process.env.RV10_REPS || 7); const rows = [];
  for (const [size, crisis] of [['village', 'none'], ['town', 'none'], ['town', 'infiltrated'], ['city', 'none'], ['city', 'insurgency'], ['city', 'indebted'], ['metropolis', 'none'], ['metropolis', 'occupied'], ['metropolis', 'infiltrated'], ['metropolis', 'indebted']]) {
    const seed = `rv10-time-${size}-${crisis}`; const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    const A = birth(cfg, seed, null); const H = (A.institutions || []).filter(hideable); if (!H.length) { rows.push({ seed, hideable: 0 }); continue; }
    const B = birth(cfg, seed, hideable);
    const pub = veil.galleryPayloadFor(A, { shareDm: false, memberOverrides: {} }); const defaults = veil.curateModelFor(pub, []).defaults;
    const open = sw.setCriminalVeil([], defaults, false, sw.presentCriminalGroupings(pub));
    const kA = await store(A, []); const kB = await store(B, []); const kO = await store(A, open);
    for (const read of ['gallery', 'link']) {
      const t = { A: [], B: [], O: [] }; const len = {};
      for (let i = 0; i < REPS; i += 1) for (const [w, k] of [['A', kA], ['B', kB], ['O', kO]]) { const [ms, l] = await time(k, read); if (i > 0) t[w].push(ms); len[w] = l; }
      rows.push({ seed, read, hidden: H.length, nameChars: H.map((h) => h.name).join('').length, msA: med(t.A), msB: med(t.B), msOpen: med(t.O), ratioAB: +(med(t.A) / med(t.B)).toFixed(2), ratioAOpen: +(med(t.A) / med(t.O)).toFixed(2), lenA: len.A, lenB: len.B, lenOpen: len.O });
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(rows, null, 1));
}, 14_400_000);
