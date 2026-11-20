// REVIEW-VEIL-10 — ORDER AND GAPS: in the SERVED payload, an array of records whose integer field (any key) runs 0..n or 1..n in the
// STORED town with no hole but has a hole when served (a member removed shows as a skipped number); and an array of scalars whose
// served order is not the stored order with the withheld members dropped (a moved member). Default veil and every eye shut,
// reveal off/on, gallery and link, born towns.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arrays = (v, p = '', out = new Map()) => { if (Array.isArray(v)) { (out.get(p) || out.set(p, []).get(p)).push(v); v.forEach((x) => arrays(x, `${p}[]`, out)); } else if (isRec(v)) for (const [k, x] of Object.entries(v)) arrays(x, p ? `${p}.${k}` : k, out); return out; };
const holes = (arr) => { const out = []; if (!arr.length || !arr.every(isRec)) return out; const keys = new Set(arr.flatMap((o) => Object.keys(o))); for (const k of keys) { const ns = arr.map((o) => o[k]); if (!ns.every((x) => Number.isInteger(x))) continue; const s = [...new Set(ns)].sort((a, b) => a - b); if (s.length < 3) continue; const lo = s[0]; if (lo !== 0 && lo !== 1) continue; const contiguous = s[s.length - 1] - lo + 1 === s.length; out.push([k, contiguous, s.length]); } return out; };
it('gaps', async () => {
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
  let n = 0; const census = {};
  const SIZES = (process.env.RV10_SIZES || 'town,city,city,metropolis,metropolis').split(','); const CRISES = (process.env.RV10_CRISES || 'none,infiltrated,insurgency,occupied,indebted,none').split(','); const NN = Number(process.env.RV10_N || 1);
  for (let k = 0; k < NN; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    const seed = NN > 1 ? `rv10-gap-${size}-${crisis}-${k}-${n}` : `rv10-gap-${size}-${crisis}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    if (compose) { A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    const stored = arrays(A);
    for (const dm of [false, true]) for (const kind of ['default', 'all']) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      let eyes = []; if (kind === 'all') { const m = veil.curateModelFor(pub, []); eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]); }
      const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      n += 1; const id = `abcd9000-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','G','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(A), `gp${n}`, `gpl${n}`, JSON.stringify(ov), dm]);
      for (const read of ['gallery', 'link']) {
        const S = read === 'link' ? (await db.query('select public.get_unlisted_dossier($1) x', [`gpl${n}`])).rows[0].x.dossier : (await db.query('select data from public.get_gallery_dossier($1)', [`gp${n}`])).rows[0].data;
        for (const [p, list] of arrays(S)) {
          const sl = stored.get(p) || [];
          list.forEach((arr, i) => { for (const [k, contiguous, len] of holes(arr)) { if (contiguous) continue; const st = sl[i] ? holes(sl[i]).find((h) => h[0] === k) : null; if (st && !st[1]) continue; const key = `${read} ${kind}${dm ? ' +DM' : ''} | ${p}[].${k}`; const r = census[key] = census[key] || { n: 0, ex: `${seed}: served ${JSON.stringify(arr.map((o) => o[k])).slice(0, 120)} stored ${sl[i] ? JSON.stringify(sl[i].map((o) => o[k])).slice(0, 120) : '?'}` }; r.n += 1; } });
        }
      }
      await db.query('delete from public.settlements where id = $1', [id]);
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(census, null, 1));
}, 14_400_000);
