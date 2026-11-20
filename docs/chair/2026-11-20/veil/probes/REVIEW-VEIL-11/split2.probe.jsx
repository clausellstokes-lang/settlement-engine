// REVIEW-VEIL-11 — VR28's split of the registry's diffuse rows. Per born town (with a hideable house; RV11_CONTROL=1: without),
// stored A with the DEFAULT veil, served S by get_gallery_dossier on the chain RV10_TPL. Engine's own exports only.
// Arms: BANDS (inversion from S, the band gap, hidden count and kind); PRECISE (defence scores per key, gates, legitimacy
// score from served labels, storage months with the served standing's share, and an IN-PIPELINE counterfactual of the food
// writer: the same call with the hideable houses removed, same rng context, a pure fork); COMPOSITION (income percentages,
// power shares, conflicts naming a withheld house); PROSE (compose(A) against compose(A with ONE input subtree swapped for
// its re-derivation from S)); NAMES (any withheld house's name anywhere in S).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
vi.mock(`${process.env.RV6_SRC}/src/generators/foodGenerator.js`, async (importOriginal) => {
  const m = await importOriginal();
  return { ...m, generateFoodSecurity: (tier, inst, cfg, share) => {
    const out = m.generateFoodSecurity(tier, inst, cfg, share); const g = globalThis.__rv11food;
    if (g && g.on) { const cf = m.generateFoodSecurity(tier, (inst || []).filter((i) => !g.hide(i)), cfg, share);
      g.calls.push({ share, hid: (inst || []).filter((i) => g.hide(i)).length, out: [out?.resilienceScore, out?.foodRecord?.storageMonths], cf: [cf?.resilienceScore, cf?.foodRecord?.storageMonths] }); }
    return out; } };
});
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const at = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const PROS = ['Subsistence', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
it('split', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'spl1';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const P = await import(`${SRC}/src/generators/economy/prosperity.js`); const H = await import(`${SRC}/src/generators/helpers.js`);
  const SP = await import(`${SRC}/src/generators/safetyProfile.js`); const L = await import(`${SRC}/src/generators/factionDynamics.js`);
  const D = await import(`${SRC}/src/generators/defenseGenerator.js`); const K = await import(`${SRC}/src/domain/facts/keep.js`);
  const F = await import(`${SRC}/src/generators/foodGenerator.js`); const C = await import(`${SRC}/src/domain/conditionPromotion.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (t) => ({ ...(t.config || {}), tier: t.tier || t.config?.tier || t.config?.settType });
  const derive = (t) => { const c = cfgOf(t); const inst = t.institutions || []; const names = inst.map((i) => String(i.name || '').toLowerCase()); const tier = c.tier; const route = c.tradeRouteAccess;
    const base = P.computeBaseProsperity(tier, route, inst, c, names, t.economicState?.incomeSources || [], t.economicState?.foodSecurity || null).label;
    const pl = P.deriveProsperityLabels(base, P.standingBaseProsperity(tier, route, inst, c, names, t.economicState?.incomeSources || []), c, inst);
    let sp = null; try { sp = SP.generateSafetyProfile(c, tier, inst); } catch (e) { sp = null; }
    let dp = null; try { dp = D.generateDefenseProfile(t, K.keepOfRecord(t.economicState)); } catch (e) { dp = null; }
    return { pros: pl.prosperity, stand: pl.prosperityStanding, sp, dp, crim: H.getInstFlags(c, inst).criminalEffective }; };
  const PROSE = ['defense:state.publicOrder.beside', 'defense:state.publicOrder.rung.sentence', 'defense:threat.economic.sentence', 'defense:wall.rationale.sentence', 'economy:economics.prosperityHeader.sentence', 'economy:economics.prosperityRung.sentence', 'stressors:overview.conditionSeverity.sentence'];
  const proseAt = (pp, key) => { const i = key.indexOf('.', key.indexOf(':')); return JSON.stringify(at(pp?.blocks?.[key.slice(0, i)] || {}, key.slice(i + 1))); };
  const T = {}; const bump = (k, f, ex) => { const r = T[k] = T[k] || { n: 0, sane: 0, fails: 0, ex: [] }; r.n += 1; if (f !== 'insane' && f !== 'na') r.sane += 1; if (f === 'fail') { r.fails += 1; if (r.ex.length < 3 && ex) r.ex.push(ex); } };
  const towns = []; const promo = { prosperity: [], safety: [], readiness: [], standing: [] }; const vocab = {}; const names = []; const comp = []; const food = { calls: 0, sameBirth: 0, births: 0, direct: 0, ex: [] };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    globalThis.__rv11food = { on: true, hide: hideable, calls: [] };
    let A = generateSettlementPipeline(cfg, null, { seed, customContent: {} }); const calls = globalThis.__rv11food.calls; globalThis.__rv11food = null;
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    const hid = (A.institutions || []).filter(hideable);
    if (process.env.RV11_CONTROL ? hid.length : !hid.length) continue;
    // the wrapper's extra calls move no stream: a plain birth equals it (checked on every 5th town)
    if (n % 5 === 0) { food.births += 1; let B = generateSettlementPipeline(cfg, null, { seed, customContent: {} }); B = { ...B }; delete B.publicProse; B = JSON.parse(JSON.stringify(withPP(B, compose(B)))); if (JSON.stringify(B) === JSON.stringify(A)) food.sameBirth += 1; }
    const last = calls[calls.length - 1]; food.calls += 1;
    if (last && hid.length && JSON.stringify(last.out) !== JSON.stringify(last.cf)) { food.direct += 1; if (food.ex.length < 4) food.ex.push(`${seed}: stored [res,months] ${last.out} | houses removed ${last.cf}`); }
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9400-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `ix${n}`, `ixl${n}`, JSON.stringify(ov)]);
    await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [`ix${n}`])).rows[0]; await db.query('reset role');
    await db.query('delete from public.settlements where id = $1', [id]);
    const S = row.data; const servedNames = new Set((S.institutions || []).map((i) => i.name)); const gone = (A.institutions || []).filter((i) => !servedNames.has(i.name));
    const kinds = gone.map((i) => String(i.category || '') + '/' + (Array.isArray(i.tags) ? i.tags.filter((t) => /criminal|clandestine|broker/i.test(t)).join('+') : ''));
    let a; let s; try { a = derive(A); s = derive(S); } catch (e) { bump('derive threw', 'fail', `${seed}: ${String(e.message).slice(0, 80)}`); continue; }
    const cmp = (key, va, stored, served, vs, ex) => { if (served === undefined) { bump(key, 'na'); return; } const sane = JSON.stringify(va) === JSON.stringify(stored); bump(key, !sane ? 'insane' : JSON.stringify(vs) === JSON.stringify(served) ? 'pass' : 'fail', ex || `${seed}: served ${String(JSON.stringify(served)).slice(0, 70)} | from served ${String(JSON.stringify(vs)).slice(0, 70)}`); return sane && JSON.stringify(vs) !== JSON.stringify(served); };
    // BANDS
    const pf = cmp('band economy.prosperity', a.pros, A.economicState?.prosperity, S.economicState?.prosperity, s.pros);
    const sf = cmp('band economy.prosperityStanding', a.stand, A.economicState?.prosperityStanding, S.economicState?.prosperityStanding, s.stand);
    const af = cmp('band safety.safetyLabel', a.sp?.safetyLabel, A.economicState?.safetyProfile?.safetyLabel, S.economicState?.safetyProfile?.safetyLabel, s.sp?.safetyLabel);
    const rf = cmp('band defence.readiness.label', a.dp?.readiness?.label, A.defenseProfile?.readiness?.label, S.defenseProfile?.readiness?.label, s.dp?.readiness?.label);
    cmp('band defence.readiness.colours', a.dp?.readiness && [a.dp.readiness.color, a.dp.readiness.background, a.dp.readiness.border], A.defenseProfile?.readiness && [A.defenseProfile.readiness.color, A.defenseProfile.readiness.background, A.defenseProfile.readiness.border], S.defenseProfile?.readiness && [S.defenseProfile.readiness.color, S.defenseProfile.readiness.background, S.defenseProfile.readiness.border], s.dp?.readiness && [s.dp.readiness.color, s.dp.readiness.background, s.dp.readiness.border]);
    const lab = (t) => { const l = L.computePublicLegitimacy(t.economicState, t.defenseProfile?.readiness?.label, t.tier); return l; };
    const lA = lab(A); const lS = lab(S);
    cmp('band legitimacy.label+colours', lA && [lA.label, lA.bg, lA.color], A.powerStructure?.publicLegitimacy && [A.powerStructure.publicLegitimacy.label, A.powerStructure.publicLegitimacy.bg, A.powerStructure.publicLegitimacy.color], S.powerStructure?.publicLegitimacy && [S.powerStructure.publicLegitimacy.label, S.powerStructure.publicLegitimacy.bg, S.powerStructure.publicLegitimacy.color], lS && [lS.label, lS.bg, lS.color]);
    cmp('precise legitimacy.score (from served labels)', lA?.score, A.powerStructure?.publicLegitimacy?.score, S.powerStructure?.publicLegitimacy?.score, lS?.score);
    const gap = (x, y) => PROS.indexOf(x) - PROS.indexOf(y);
    if (pf) promo.prosperity.push({ gap: gap(s.pros, S.economicState.prosperity), hidden: gone.length, kinds, crimServed: Math.round(s.crim), crimStored: Math.round(a.crim) });
    if (sf) promo.standing.push({ gap: gap(s.stand, S.economicState.prosperityStanding), hidden: gone.length });
    if (af) promo.safety.push({ served: S.economicState.safetyProfile.safetyLabel, fromServed: s.sp.safetyLabel, hidden: gone.length, kinds });
    if (rf) promo.readiness.push({ served: S.defenseProfile.readiness.label, fromServed: s.dp.readiness.label, hidden: gone.length });
    const sl = S.economicState?.safetyProfile?.safetyLabel; if (sl) { vocab[sl] = (vocab[sl] || 0) + 1; }
    // PRECISE
    for (const key of ['disaster', 'economic', 'internal', 'magical', 'military', 'monster']) cmp(`precise defence.scores.${key}`, a.dp?.scores?.[key], A.defenseProfile?.scores?.[key], S.defenseProfile?.scores?.[key], s.dp?.scores?.[key]);
    cmp('precise defence.economicGates', canon(a.dp?.economicGates), canon(A.defenseProfile?.economicGates), S.defenseProfile?.economicGates === undefined ? undefined : canon(S.defenseProfile?.economicGates), canon(s.dp?.economicGates));
    const months = (t, st) => { const c = cfgOf(t); return F.generateFoodSecurity(c.tier, t.institutions || [], { ...c, tradeRouteAccess: c.tradeRouteAccess }, K.boughtShare('stores', K.keepOf(st)))?.foodRecord?.storageMonths; };
    cmp('precise food.record.storageMonths (served standing share)', months(A, A.economicState?.prosperityStanding), A.economicState?.foodSecurity?.foodRecord?.storageMonths, S.economicState?.foodSecurity?.foodRecord?.storageMonths, months(S, S.economicState?.prosperityStanding));
    // the visitor's re-derivation of the months with the standing it would itself derive (no hidden drag)
    cmp('precise food.record.storageMonths (visitor standing)', months(A, a.stand), A.economicState?.foodSecurity?.foodRecord?.storageMonths, S.economicState?.foodSecurity?.foodRecord?.storageMonths, months(S, s.stand));
    // COMPOSITION
    const isum = (t) => (t.economicState?.incomeSources || []).reduce((x, e) => x + (Number(e.percentage) || 0), 0);
    const psum = (t) => (t.powerStructure?.factions || []).reduce((x, f) => x + (Number(f.power) || 0), 0);
    comp.push({ seed, hidden: gone.length, incA: isum(A), incS: isum(S), incRowsA: (A.economicState?.incomeSources || []).length, incRowsS: (S.economicState?.incomeSources || []).length,
      powA: psum(A), powS: psum(S), facA: (A.powerStructure?.factions || []).length, facS: (S.powerStructure?.factions || []).length, conflictsA: (A.powerStructure?.conflicts || A.conflicts || []).length, conflictsS: (S.powerStructure?.conflicts || S.conflicts || []).length });
    // NAMES: any withheld house's name anywhere in S or the read's other columns
    const blob = JSON.stringify(row).toLowerCase(); for (const g of gone) { const nm = String(g.name || '').toLowerCase(); if (nm.length > 3 && blob.includes(nm)) names.push(`${seed}: ${g.name}`); }
    // PROSE: one input swapped at a time
    const pa = compose(A); const swaps = {
      safety: (t) => { if (s.sp) t.economicState.safetyProfile = JSON.parse(JSON.stringify(s.sp)); },
      defence: (t) => { if (s.dp) t.defenseProfile = JSON.parse(JSON.stringify(s.dp)); },
      prosperity: (t) => { t.economicState.prosperity = s.pros; t.economicState.prosperityStanding = s.stand; },
    };
    for (const [nm, fn] of Object.entries(swaps)) { const B = JSON.parse(JSON.stringify(A)); try { fn(B); } catch (e) { continue; } let pb; try { pb = compose(B); } catch (e) { bump(`prose swap ${nm} threw`, 'fail', String(e.message).slice(0, 60)); continue; }
      for (const key of PROSE) { const sv = proseAt(S.publicProse, key); if (sv === undefined || sv === 'undefined') { bump(`prose ${key} <- ${nm}`, 'na'); continue; }
        const sane = proseAt(pa, key) === proseAt(A.publicProse, key) && sv === proseAt(A.publicProse, key);
        bump(`prose ${key} <- ${nm}`, !sane ? 'insane' : proseAt(pb, key) === sv ? 'pass' : 'fail', `${seed}: served ${sv.slice(0, 90)} | swapped ${String(proseAt(pb, key)).slice(0, 90)}`); } }
    { const rec = { seed, hid: gone.length, safeFail: !!af, prosFail: !!pf, band: S.economicState?.safetyProfile?.safetyLabel, pband: S.economicState?.prosperity };
      const Bs = JSON.parse(JSON.stringify(A)); swaps.safety(Bs); const pbs = compose(Bs);
      rec.poServed = proseAt(S.publicProse, 'defense:state.publicOrder.rung.sentence'); rec.poSwap = proseAt(pbs, 'defense:state.publicOrder.rung.sentence');
      rec.poBeside = proseAt(S.publicProse, 'defense:state.publicOrder.beside');
      rec.ratioA = A.economicState?.safetyProfile?.safetyRatio; rec.ratioS = s.sp?.safetyRatio; rec.ratioServed = S.economicState?.safetyProfile?.safetyRatio;
      try { const B = JSON.parse(JSON.stringify(A)); swaps.defence(B); swaps.prosperity(B); const pr = C.promoteStressorsToConditions(JSON.parse(JSON.stringify({ ...B, activeConditions: [] })))?.activeConditions || [];
        const B2 = JSON.parse(JSON.stringify(A)); (B2.activeConditions || []).forEach((c, i) => { if (pr[i]) { c.severity = pr[i].severity; if (pr[i].severityBand !== undefined) c.severityBand = pr[i].severityBand; } });
        rec.sevServed = proseAt(S.publicProse, 'stressors:overview.conditionSeverity.sentence'); rec.sevSwap = proseAt(compose(B2), 'stressors:overview.conditionSeverity.sentence');
        rec.sevStored = (A.activeConditions || []).map((c) => c.severity); rec.sevCf = pr.map((c) => c.severity); rec.sevBandServed = (S.activeConditions || []).map((c) => c.severityBand);
      } catch (e) { rec.sevErr = String(e.message).slice(0, 60); }
      const inA = (A.economicState?.incomeSources || []).map((e) => e.source); const inS = new Set((S.economicState?.incomeSources || []).map((e) => e.source)); rec.incomeGone = (A.economicState?.incomeSources || []).filter((e) => !inS.has(e.source)).map((e) => `${e.source}:${e.percentage}`);
      towns.push(rec); }
    // conditions' severity under the served defence and prosperity (sanity: the stored town's own re-promotion)
    try { const sev = (t) => JSON.stringify((C.promoteStressorsToConditions(JSON.parse(JSON.stringify({ ...t, activeConditions: [] })))?.activeConditions || []).map((c) => c.severity));
      const B = JSON.parse(JSON.stringify(A)); swaps.defence(B); swaps.prosperity(B);
      const stored = JSON.stringify((A.activeConditions || []).map((c) => c.severity)); const served = S.activeConditions === undefined ? undefined : JSON.stringify((S.activeConditions || []).map((c) => c.severity));
      bump('precise conditions.severity (vs re-promotion)', sev(A) !== stored ? 'insane' : sev(B) === stored ? 'pass' : 'fail', `${seed}: stored ${stored} served ${served} | under served inputs ${sev(B)}`);
    } catch (e) { bump('precise conditions.severity threw', 'fail', String(e.message).slice(0, 60)); }
  }
  await db.end();
  writeFileSync(process.env.RV10_OUT, JSON.stringify({ tally: T, promo, vocab, food, names: names.slice(0, 20), namesN: names.length, comp, towns }, null, 1));
}, 14_400_000);
