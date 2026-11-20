// REVIEW-VEIL-10 — VR26/VR28 over the registry's other diffuse rows. Per born town with a hideable house, the DEFAULT veil, served S
// (get_gallery_dossier, x212). Each value re-derived with the engine's own exports from the STORED town A (sanity) and from S; a row
// FAILS in a town where the sanity holds and the re-derivation from S differs from S's served value.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const at = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
it('inversion2', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists inv2 with (force)`); await admin.query(`create database inv2 template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'inv2' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const D = await import(`${SRC}/src/generators/defenseGenerator.js`); const K = await import(`${SRC}/src/domain/facts/keep.js`);
  const F = await import(`${SRC}/src/generators/foodGenerator.js`); const L = await import(`${SRC}/src/generators/factionDynamics.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const VALS = {
    'defence.readiness.label': (t) => D.generateDefenseProfile(t, K.keepOfRecord(t.economicState))?.readiness?.label,
    'defence.readiness.colours': (t) => { const r = D.generateDefenseProfile(t, K.keepOfRecord(t.economicState))?.readiness; return r && [r.color, r.background, r.border].join('|'); },
    'defence.scores.*': (t) => JSON.stringify(canon(D.generateDefenseProfile(t, K.keepOfRecord(t.economicState))?.scores)),
    'defence.economicGates': (t) => JSON.stringify(canon(D.generateDefenseProfile(t, K.keepOfRecord(t.economicState))?.economicGates)),
    'food.resilienceScore': (t) => { const c = { ...(t.config || {}), tradeRouteAccess: t.config?.tradeRouteAccess }; return F.generateFoodSecurity(t.tier || c.tier || c.settType, t.institutions || [], c)?.resilienceScore; },
    'food.record.storageMonths': (t) => { const c = { ...(t.config || {}) }; return F.generateFoodSecurity(t.tier || c.tier || c.settType, t.institutions || [], c)?.foodRecord?.storageMonths; },
    'legitimacy.label+colours': (t) => { const l = L.computePublicLegitimacy(t.economicState, t.defenseProfile?.readiness?.label, t.tier); return l && [l.label, l.bg, l.color].join('|'); },
  };
  const SERVED = {
    'defence.readiness.label': (t) => t.defenseProfile?.readiness?.label, 'defence.readiness.colours': (t) => { const r = t.defenseProfile?.readiness; return r && [r.color, r.background, r.border].join('|'); },
    'defence.scores.*': (t) => JSON.stringify(canon(t.defenseProfile?.scores)), 'defence.economicGates': (t) => JSON.stringify(canon(t.defenseProfile?.economicGates)),
    'food.resilienceScore': (t) => t.economicState?.foodSecurity?.resilienceScore, 'food.record.storageMonths': (t) => t.economicState?.foodSecurity?.foodRecord?.storageMonths,
    'legitimacy.label+colours': (t) => { const l = t.powerStructure?.publicLegitimacy; return l && [l.label, l.bg, l.color].join('|'); },
  };
  const PROSE = ['defense:state.publicOrder.beside', 'defense:state.publicOrder.rung.sentence', 'defense:threat.economic.sentence', 'defense:wall.rationale.sentence', 'economy:economics.prosperityHeader.sentence', 'economy:economics.prosperityRung.sentence', 'stressors:overview.conditionSeverity.sentence'];
  const proseAt = (pp, key) => { const i = key.indexOf('.', key.indexOf(':')); const site = key.slice(0, i); const rest = key.slice(i + 1); return JSON.stringify(at(pp?.blocks?.[site] || {}, rest)); };
  const tally = {}; const bump = (k, f, ex) => { const r = tally[k] = tally[k] || { towns: 0, sane: 0, fails: 0, ex: [] }; r.towns += 1; if (f === 'sane' || f === 'fail') r.sane += 1; if (f === 'fail') { r.fails += 1; if (r.ex.length < 3) r.ex.push(ex); } };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    if (process.env.RV10_CONTROL ? (A.institutions || []).some(hideable) : !(A.institutions || []).some(hideable)) continue;
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9300-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `iw${n}`, `iwl${n}`, JSON.stringify(ov)]);
    const S = (await db.query('select data from public.get_gallery_dossier($1)', [`iw${n}`])).rows[0].data; await db.query('delete from public.settlements where id = $1', [id]);
    for (const [key, fn] of Object.entries(VALS)) { let a; let s; try { a = fn(A); s = fn(S); } catch (e) { bump(key, 'threw', ''); continue; }
      const sane = JSON.stringify(a) === JSON.stringify(SERVED[key](A)); const servedV = SERVED[key](S); if (servedV === undefined) { bump(key, 'withheld', ''); continue; }
      bump(key, !sane ? 'insane' : JSON.stringify(s) === JSON.stringify(servedV) ? 'sane' : 'fail', `${seed}: served ${String(servedV).slice(0, 80)} | from served ${String(s).slice(0, 80)}`); }
    let pa; let ps; try { pa = compose(A); ps = compose(S); } catch (e) { bump('prose', 'threw', ''); continue; }
    for (const key of PROSE) { const sv = proseAt(S.publicProse, key); if (sv === undefined || sv === 'undefined') { bump(`prose ${key}`, 'withheld', ''); continue; }
      const sane = proseAt(pa, key) === proseAt(A.publicProse, key); bump(`prose ${key}`, !sane ? 'insane' : proseAt(ps, key) === sv ? 'sane' : 'fail', `${seed}: served ${sv.slice(0, 90)} | from served ${String(proseAt(ps, key)).slice(0, 90)}`); }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(tally, null, 1));
}, 14_400_000);
