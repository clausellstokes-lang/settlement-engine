// REVIEW-VEIL-12 — THE RANK-WORD CLASS (the chair, 08:37 UTC): a served sentence whose rank word, share word, count,
// superlative or "only" is computed over rows that include a row the read withholds. COUNTERFACTUAL: the same town with the
// withheld rows truly absent (A' = the stored town with the SERVED institutions, income rows, factions and safety profile put
// in place of the stored ones) must compose the same sentence. Per served prose leaf: served S vs compose(A'); sanity:
// compose(A) equals the stored prose. Born towns with a hideable house (RV12_CONTROL=1: without), default veil (RV12_OPEN=1:
// the three groupings opened), gallery read, Reveal DM off and on, on chain RV10_TPL. Counts per prose key; a mismatch whose
// served sentence holds a rank word is flagged RANK.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const leaves = (v, p = '', out = {}) => { if (typeof v === 'string') out[p] = v; else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${p}[${i}]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) leaves(x, p ? `${p}.${k}` : k, out); return out; };
const RANK = /\b(largest|biggest|greatest|most|second|third|only|sole|one of (two|three)|both|majority|minority|chief|main|leading|top|lion's share|a good share|half|bulk|dominat\w*|outrank\w*|first|fewest|least|smallest|no other|alone|single)\b/i;
it('rank', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV12_DB || 'rank';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  const compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 3 && ex[k].push(e); } };
  let n = 0; const N = Number(process.env.RV10_N || 1); const CONTROL = !!process.env.RV12_CONTROL;
  const open = process.env.RV12_OPEN ? [{ address: 'block:defense.criminalStructure', hidden: false }, { address: 'block:power.criminalUnderside', hidden: false }, { address: 'block:economy.criminalServices', hidden: false }] : [];
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'city', 'metropolis']) for (const crisis of ['none', 'indebted', 'insurgency', 'famine', 'infiltrated', 'none', 'politically_fractured']) {
    n += 1; const seed = `rv12-rank-${size}-${crisis}-${k}-${n}`;
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); A = JSON.parse(JSON.stringify(A));
    const hid = (A.institutions || []).filter(hideable); if (CONTROL ? hid.length : !hid.length) continue;
    const sane = JSON.stringify(compose(JSON.parse(JSON.stringify(A)))) === JSON.stringify(A.publicProse); bump('sanity compose(A) equals stored prose', !sane, seed);
    for (const dm of [false, true]) {
      const ov = veil.writeShareVeil({}, open, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const id = `abcd9c00-0000-0000-0000-${String(n * 2 + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `rk${n}${dm ? 'd' : 'p'}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(A), slug, JSON.stringify(ov), dm]);
      await db.query('set role anon'); const S = (await db.query('select data from public.get_gallery_dossier($1)', [slug])).rows[0]?.data; await db.query('reset role');
      await db.query('delete from public.settlements where id = $1', [id]); if (!S) { bump('served nothing', true, seed); continue; }
      const B = JSON.parse(JSON.stringify(A)); delete B.publicProse;
      B.institutions = S.institutions ?? []; if (B.economicState) { B.economicState.incomeSources = S.economicState?.incomeSources ?? []; if (S.economicState?.safetyProfile) B.economicState.safetyProfile = { ...B.economicState.safetyProfile, ...S.economicState.safetyProfile }; }
      if (B.powerStructure) B.powerStructure.factions = S.powerStructure?.factions ?? [];
      let pb; try { pb = compose(B); } catch (e) { bump('compose(A\') threw', true, `${seed}: ${String(e.message).slice(0, 80)}`); continue; }
      const sv = leaves(S.publicProse || {}); const cf = leaves(pb || {}); const st = leaves(A.publicProse || {});
      const incomeGone = (A.economicState?.incomeSources || []).length !== (S.economicState?.incomeSources || []).length;
      for (const [key, s] of Object.entries(sv)) { const kk = key.replace(/\[\d+\]/g, '[]');
        if (cf[key] === s) { bump(`same ${kk}`, false, ''); continue; }
        const changedByVeil = st[key] === s; // the served sentence is the stored one, while the counterfactual differs
        const tag = RANK.test(s) ? 'RANK' : 'other';
        bump(`${tag} served != counterfactual ${kk}${incomeGone ? ' (income row withheld)' : ''}`, changedByVeil, `${seed} dm=${dm}: served "${s.slice(0, 120)}" | absent "${String(cf[key]).slice(0, 120)}"`); }
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex }, null, 1));
}, 14_400_000);
