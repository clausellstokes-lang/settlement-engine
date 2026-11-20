// R3-CURE-2 MEASURE (VEIL-24's builder; the brief's unit 2): THE DERIVED DEFENSE KEY PER TOWN, BOTH ENGINES. The first
// cure's births (copies.probe.jsx: sizes x crises x N, seed r3m-<size>-<crisis>-<k>-<idx>), the veil "groupings and the
// plot-hooks tab opened by hand, every hideable house hidden whole". Per town with a hideable house: A (as born) and B
// (the house-free counterfactual: every hideable house cut after every step, R6's birth), each read by the server's
// gallery (Reveal off and on) and by the twin (projectShareVeil over galleryPayloadFor). The key a visitor derives
// (criminalStructureKeyOf) of A's read against B's; where they differ, ATTRIBUTION: each field the key reads, served
// as the counterfactual's read serves it, alone; the fields whose swap alone closes the gap. "Magical crime" by read.
// LOCAL scratch cluster only. Out: compact JSON (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const clone = (v) => JSON.parse(JSON.stringify(v));
/** The fields the key reads (criminalStructureKey.js), each as a getter and a setter on a document. */
const FIELDS = {
  institutions: [(d) => d?.institutions, (d, v) => { d.institutions = v; }],
  powers: [(d) => d?.powerStructure?.factions, (d, v) => { d.powerStructure = { ...(d.powerStructure || {}), factions: v }; }],
  criminalInstitutions: [(d) => d?.economicState?.safetyProfile?.criminalInstitutions, (d, v) => { d.economicState = d.economicState || {}; d.economicState.safetyProfile = { ...(d.economicState.safetyProfile || {}), criminalInstitutions: v }; }],
  activeChains: [(d) => d?.economicState?.activeChains, (d, v) => { d.economicState = { ...(d.economicState || {}), activeChains: v }; }],
  incomeSources: [(d) => d?.economicState?.incomeSources, (d, v) => { d.economicState = { ...(d.economicState || {}), incomeSources: v }; }],
  servicesCriminal: [(d) => d?.availableServices?.criminal, (d, v) => { d.availableServices = { ...(d.availableServices || {}), criminal: v }; }],
};
it('R3-CURE-2 keys measure', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { criminalStructureKeyOf, covertCrimeHeld } = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return clone(t);
  };
  let nrow = 0;
  const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const server = async (rec, dm) => {
    nrow += 1; const id = `abcd9e${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `k${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const twin = (rec, dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov);
  const magical = (d) => (d?.economicState?.safetyProfile?.crimeTypes || []).some((c) => c?.type === 'Magical crime');
  const why = (d) => ({ inst: (d?.institutions || []).map((i) => String(i?.name || '')).filter((n) => /thie|crimin|underground|front business|smuggl|black market|gambl|fence|bandit|outlaw|gang/i.test(n)),
    powers: (d?.powerStructure?.factions || []).filter((f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || /thie/i.test(String(f.faction ?? f.name ?? '')))).map((f) => `${f.faction ?? f.name}${f.isGoverning ? '*' : ''}`),
    ops: d?.economicState?.safetyProfile?.criminalInstitutions ?? null,
    chains: (d?.economicState?.activeChains || []).filter((c) => c?.needKey === 'criminal_economy').map((c) => `${c?.chainId}:${c?.status}`),
    income: (d?.economicState?.incomeSources || []).filter((r) => r?.isCriminal === true).map((r) => `${r?.source ?? r?.label ?? r?.name ?? '?'}:${r?.percentage}`),
    covert: (d?.availableServices?.criminal || []).filter((x) => x?.institution === '(covert)').map((x) => x?.name ?? x?.service ?? '?'),
    covertHeld: covertCrimeHeld(d) });
  const attribute = (a, b, cfKey) => {
    const out = [];
    for (const [f, [get, set]] of Object.entries(FIELDS)) {
      const x = clone(a); set(x, get(b) === undefined ? undefined : clone(get(b)));
      if (criminalStructureKeyOf(x) === cfKey) out.push(f);
    }
    return out;
  };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { tier: size, seed, hidden: hidden.map((h) => h.name), storedKey: criminalStructureKeyOf(A) };
    // (the seat's 09:18 relay: THE CONTROL, a town with no hideable house, read through the same veil: its key and labels)
    const ops = (d) => (Array.isArray(d?.economicState?.safetyProfile?.criminalInstitutions) ? d.economicState.safetyProfile.criminalInstitutions : null);
    if (!hidden.length) {
      rec.control = {};
      for (const dm of [false, true]) for (const [eng, d] of [['server', await server(A, dm)], ['twin', twin(A, dm)]]) rec.control[`${eng}/${dm ? 'dm' : 'off'}`] = { key: criminalStructureKeyOf(d), ops: ops(d) };
      out.push(rec); continue;
    }
    let B; try { B = birth(cfg, seed, (h) => isHideableHouse(h)); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); out.push(rec); continue; }
    rec.reads = {};
    rec.tier = size;
    for (const dm of [false, true]) {
      const views = { server: [await server(A, dm), await server(B, dm)], twin: [twin(A, dm), twin(B, dm)] };
      for (const [eng, [a, b]] of Object.entries(views)) {
        const ka = criminalStructureKeyOf(a); const kb = criminalStructureKeyOf(b);
        const r = { key: ka, cf: kb, magic: magical(a), cfMagic: magical(b), ops: ops(a), cfOps: ops(b) };
        if (ka !== kb) { r.why = why(a); r.cfWhy = why(b); r.closes = attribute(a, b, kb); }
        rec.reads[`${eng}/${dm ? 'dm' : 'off'}`] = r;
      }
    }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
