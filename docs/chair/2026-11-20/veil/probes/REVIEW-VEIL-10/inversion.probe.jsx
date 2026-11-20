// REVIEW-VEIL-10 — VR26, THE INVERSION TEST, on the registry's diffuse row economy.prosperity (and the tile copy). A value sent as
// stored must either be impossible to re-derive from the served document or equal its re-derivation. Per born town with a hideable
// house: the stored town A, stored with the DEFAULT veil, served S by get_gallery_dossier as anon. RE-DERIVE with the engine's own
// exports (prosperity.js :: computeBaseProsperity, deriveProsperityLabels) from (i) A's own fields (SANITY: must equal A's stored label)
// and (ii) S's served fields. A town where (i) holds and (ii) differs from S's served label fails the test: the served label carries
// the hidden houses' crime drag that the served roster cannot produce.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('inversion', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists inv1 with (force)`); await admin.query(`create database inv1 template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'inv1' }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const P = await import(`${SRC}/src/generators/economy/prosperity.js`);
  const H = await import(`${SRC}/src/generators/helpers.js`); const SP = await import(`${SRC}/src/generators/safetyProfile.js`); const L = await import(`${SRC}/src/generators/factionDynamics.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const derive = (t) => { const c = { ...(t.config || {}), tier: t.tier || t.config?.tier || t.config?.settType }; const inst = t.institutions || []; const names = inst.map((i) => String(i.name || '').toLowerCase()); const tier = c.tier; const route = c.tradeRouteAccess;
    const base = P.computeBaseProsperity(tier, route, inst, c, names, t.economicState?.incomeSources || [], t.economicState?.foodSecurity || null).label;
    const lab = P.deriveProsperityLabels(base, P.standingBaseProsperity(tier, route, inst, c, names, t.economicState?.incomeSources || []), c, inst).prosperity;
    let safe = null; try { safe = SP.generateSafetyProfile(c, tier, inst).safetyLabel; } catch (e) { safe = `threw ${String(e.message).slice(0, 40)}`; }
    let legit = null; try { legit = L.computePublicLegitimacy(t.economicState, t.defenseProfile?.readiness?.label, tier)?.score; } catch (e) { legit = 'threw'; }
    return { lab, safe, legit, crim: H.getInstFlags(c, inst).criminalEffective }; };
  const rows = []; let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    if (!(A.institutions || []).some(hideable)) continue;
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9200-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `iv${n}`, `ivl${n}`, JSON.stringify(ov)]);
    await db.query('set role anon'); await db.query('reset role');
    const Sd = (await db.query('select data from public.get_gallery_dossier($1)', [`iv${n}`])).rows[0].data;
    await db.query('delete from public.settlements where id = $1', [id]);
    let ra; let rs; try { ra = derive(A); rs = derive(Sd); } catch (e) { rows.push({ seed, threw: String(e.message).slice(0, 120) }); continue; }
    rows.push({ seed, stored: A.economicState?.prosperity, served: Sd.economicState?.prosperity, fromStored: ra.lab, fromServed: rs.lab, crimStored: Math.round(ra.crim), crimServed: Math.round(rs.crim), safeStored: A.economicState?.safetyProfile?.safetyLabel, safeServed: Sd.economicState?.safetyProfile?.safetyLabel, safeFromStored: ra.safe, safeFromServed: rs.safe, legitServed: Sd.powerStructure?.publicLegitimacy?.score, legitFromServed: rs.legit });
  }
  await db.end();
  const ok = rows.filter((r) => !r.threw); const sane = ok.filter((r) => r.fromStored === r.stored);
  const fail = sane.filter((r) => r.served === r.stored && r.fromServed !== r.served);
  const sSane = ok.filter((r) => r.safeFromStored === r.safeStored); const sFail = sSane.filter((r) => r.safeServed === r.safeStored && r.safeFromServed !== r.safeServed);
  const lFail = ok.filter((r) => r.legitServed != null && r.legitFromServed !== r.legitServed);
  writeFileSync(process.env.RV10_OUT, JSON.stringify({ safety: { sane: sSane.length, fails: sFail.length, ex: sFail.slice(0, 5).map((r) => `${r.seed}: served ${r.safeServed} | from served ${r.safeFromServed}`) }, legitimacy: { differs: lFail.length, ex: lFail.slice(0, 3).map((r) => `${r.seed}: ${r.legitServed} vs ${r.legitFromServed}`) }, towns: ok.length, threw: rows.length - ok.length, sane: sane.length, inversionFails: fail.length, fails: fail, rows }, null, 1));
}, 14_400_000);
