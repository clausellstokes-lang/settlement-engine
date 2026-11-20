// REVIEW-VEIL-11 — read (3): VR28's split on MASTER'S STORED SHAPE (production's towns). Born by origin/master's engine (RV10_GEN),
// stored with the DEFAULT veil, served by get_gallery_dossier as anon on the chain RV10_TPL (xp212: 001..203 + 211 + 212), re-derived
// with MASTER'S OWN exports (the engine that wrote the stored town). RV11_CONTROL=1: towns without a hideable house.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('splitm', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'splm';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const P = await import(`${GEN}/src/generators/economy/prosperity.js`); const H = await import(`${GEN}/src/generators/helpers.js`);
  const SP = await import(`${GEN}/src/generators/safetyProfile.js`); const L = await import(`${GEN}/src/generators/factionDynamics.js`);
  const D = await import(`${GEN}/src/generators/defenseGenerator.js`); const F = await import(`${GEN}/src/generators/foodGenerator.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (t) => ({ ...(t.config || {}), tier: t.tier || t.config?.tier || t.config?.settType });
  const derive = (t) => { const c = cfgOf(t); const inst = t.institutions || []; const names = inst.map((i) => String(i.name || '').toLowerCase());
    const base = P.computeBaseProsperity(c.tier, c.tradeRouteAccess, inst, c, names, t.economicState?.incomeSources || [], t.economicState?.foodSecurity || null).label;
    let sp = null; try { sp = SP.generateSafetyProfile(c, c.tier, inst); } catch (e) { sp = null; }
    let dp = null; try { dp = D.generateDefenseProfile(t); } catch (e) { dp = null; }
    let fd = null; try { fd = F.generateFoodSecurity(c.tier, inst, { ...c }); } catch (e) { fd = null; }
    return { pros: P.deriveProsperityLabel(base, c, inst), sp, dp, fd, crim: H.getInstFlags(c, inst).criminalEffective }; };
  const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
  const T = {}; const bump = (k, f, ex) => { const r = T[k] = T[k] || { n: 0, sane: 0, fails: 0, ex: [] }; r.n += 1; if (f !== 'insane' && f !== 'na') r.sane += 1; if (f === 'fail') { r.fails += 1; if (r.ex.length < 3 && ex) r.ex.push(ex); } };
  const comp = []; const names = []; let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = JSON.parse(JSON.stringify(A)); const hid = (A.institutions || []).filter(hideable);
    if (process.env.RV11_CONTROL ? hid.length : !hid.length) continue;
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9500-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `im${n}`, `iml${n}`, JSON.stringify(ov)]);
    await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [`im${n}`])).rows[0]; await db.query('reset role');
    await db.query('delete from public.settlements where id = $1', [id]);
    const S = row.data; const servedNames = new Set((S.institutions || []).map((i) => i.name)); const gone = (A.institutions || []).filter((i) => !servedNames.has(i.name));
    let a; let s; try { a = derive(A); s = derive(S); } catch (e) { bump('derive threw', 'fail', `${seed}: ${String(e.message).slice(0, 80)}`); continue; }
    const cmp = (key, va, stored, served, vs) => { if (served === undefined) { bump(key, 'na'); return; } const sane = JSON.stringify(va) === JSON.stringify(stored); bump(key, !sane ? 'insane' : JSON.stringify(vs) === JSON.stringify(served) ? 'pass' : 'fail', `${seed}: served ${String(JSON.stringify(served)).slice(0, 70)} | from served ${String(JSON.stringify(vs)).slice(0, 70)}`); };
    cmp('band economy.prosperity', a.pros, A.economicState?.prosperity, S.economicState?.prosperity, s.pros);
    cmp('band safety.safetyLabel', a.sp?.safetyLabel, A.economicState?.safetyProfile?.safetyLabel, S.economicState?.safetyProfile?.safetyLabel, s.sp?.safetyLabel);
    cmp('band defence.readiness.label', a.dp?.readiness?.label, A.defenseProfile?.readiness?.label, S.defenseProfile?.readiness?.label, s.dp?.readiness?.label);
    const lab = (t) => L.computePublicLegitimacy(t.economicState, t.defenseProfile?.readiness?.label, t.tier);
    cmp('precise legitimacy.score (from served labels)', lab(A)?.score, A.powerStructure?.publicLegitimacy?.score, S.powerStructure?.publicLegitimacy?.score, lab(S)?.score);
    for (const key of ['disaster', 'economic', 'internal', 'magical', 'military', 'monster']) cmp(`precise defence.scores.${key}`, a.dp?.scores?.[key], A.defenseProfile?.scores?.[key], S.defenseProfile?.scores?.[key], s.dp?.scores?.[key]);
    cmp('precise defence.economicGates', canon(a.dp?.economicGates), canon(A.defenseProfile?.economicGates), S.defenseProfile?.economicGates === undefined ? undefined : canon(S.defenseProfile?.economicGates), canon(s.dp?.economicGates));
    cmp('precise food.resilienceScore', a.fd?.resilienceScore, A.economicState?.foodSecurity?.resilienceScore, S.economicState?.foodSecurity?.resilienceScore, s.fd?.resilienceScore);
    cmp('precise food.storageMonths', a.fd?.storageMonths ?? a.fd?.foodRecord?.storageMonths, A.economicState?.foodSecurity?.storageMonths ?? A.economicState?.foodSecurity?.foodRecord?.storageMonths, S.economicState?.foodSecurity?.storageMonths ?? S.economicState?.foodSecurity?.foodRecord?.storageMonths, s.fd?.storageMonths ?? s.fd?.foodRecord?.storageMonths);
    // raw crime-measure and severity figures still served on this shape
    bump('served conditions.severity present', (S.activeConditions || []).some((c) => c.severity !== undefined) ? 'fail' : 'pass');
    bump('served safetyRatio present', S.economicState?.safetyProfile?.safetyRatio !== undefined ? 'fail' : 'pass');
    bump('served compound.criminalEffective present', S.economicState?.compound?.criminalEffective !== undefined ? 'fail' : 'pass');
    const isum = (t) => (t.economicState?.incomeSources || []).reduce((x, e) => x + (Number(e.percentage) || 0), 0);
    const psum = (t) => (t.powerStructure?.factions || []).reduce((x, f) => x + (Number(f.power) || 0), 0);
    const inS = new Set((S.economicState?.incomeSources || []).map((e) => e.source));
    comp.push({ seed, hidden: gone.length, incA: isum(A), incS: isum(S), incGone: (A.economicState?.incomeSources || []).filter((e) => !inS.has(e.source)).map((e) => `${e.source}:${e.percentage}`), powA: psum(A), powS: psum(S), facA: (A.powerStructure?.factions || []).length, facS: (S.powerStructure?.factions || []).length });
    const blob = JSON.stringify(row).toLowerCase(); for (const g of gone) { const nm = String(g.name || '').toLowerCase(); if (nm.length > 3 && blob.includes(nm)) names.push(`${seed}: ${g.name}`); }
  }
  await db.end();
  writeFileSync(process.env.RV10_OUT, JSON.stringify({ tally: T, namesN: names.length, names: names.slice(0, 20), comp }, null, 1));
}, 14_400_000);
