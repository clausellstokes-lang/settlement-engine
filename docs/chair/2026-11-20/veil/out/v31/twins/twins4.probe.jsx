// R3-CURE-5 unit 3 (VEIL-25's builder): THE R3 GATE AS AN INSTRUMENT, copied from out/v24/r3c2/measure/keys.probe.jsx (R3-CURE-2's
// measure, whose words follow) with: the crime dial (the effective priorityCriminal, read off the pipeline's own ctx.config by
// onStep: no projection or veil helper) for the control's strata; and THE TELL COLUMN (the chair's ruling 41 (2)): per town
// whose served key reads LOWER, its served page (A, the open read) against the regenerated house-free town's (B) served page
// under three settings of the owner's switches (the open read; the default veil; the criminal switch OFF: setCriminalVeil
// hiding every criminal part the Curate screen draws), field by criminal field; a setting under which every field is equal
// answers "no tell". TELL: twin only. RV9_TELL_ONLY_LOWER=0 runs the column on every hidden-house town.
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
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  await loadGenerationLawPayloads();
  let dial = null;
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    // (the crime dial: the effective priorityCriminal the pipeline resolved, read off its ctx; the cut as R3-CURE-2's)
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: (name, ctx) => {
      // (resolveConfig's effectiveConfig carries the ROLLED dial under _randomizePriorities; ctx.config keeps the UI's 50)
      if (typeof ctx?.effectiveConfig?.priorityCriminal === 'number') dial = ctx.effectiveConfig.priorityCriminal;
      if (drop) { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } } });
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
  // THE TELL COLUMN: every criminal-related field a page serves, as a comparable value
  const crimP = (f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || (typeof f.category !== 'string' && /thie/i.test(String(f.faction ?? f.name ?? ''))));
  const sortJ = (xs) => JSON.stringify([...xs].map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).sort());
  const crimFields = (d) => {
    const powers = [...(d?.powerStructure?.factions || []), ...(d?.factions || [])].filter(crimP);
    const pn = new Set(powers.flatMap((f) => [f.faction, f.name, f.id]).filter((v) => v !== undefined && v !== null).map(String));
    const npcs = (d?.npcs || []).filter(isRec);
    return {
      criminalHouses: sortJ((d?.institutions || []).filter((h) => isRec(h) && /crimin/i.test(String(h.category || ''))).map((h) => String(h.name))),
      crimeTypes: sortJ((d?.economicState?.safetyProfile?.crimeTypes || []).map((c) => c?.type)),
      opsLabels: JSON.stringify(d?.economicState?.safetyProfile?.criminalInstitutions ?? null),
      incomeRow: sortJ((d?.economicState?.incomeSources || []).filter((r) => r?.isCriminal === true).map((r) => r?.source ?? r?.label ?? r?.name ?? '?')),
      criminalPowers: sortJ(powers.map((f) => `${f.faction ?? f.name}${f.isGoverning ? '*' : ''}`)),
      covertServices: sortJ((d?.availableServices?.criminal || []).filter((x) => x?.institution === '(covert)').map((x) => x?.name ?? x?.service ?? '?')),
      criminalServicesCount: String((d?.availableServices?.criminal || []).length),
      goalsAtCriminalPower: String(npcs.filter((n) => isRec(n.goal) && ['short', 'long'].some((k) => pn.has(String(n.goal?.intent?.[k]?.target?.id ?? '')))).length),
      membershipsOfCriminalPower: String(npcs.flatMap((n) => (Array.isArray(n.memberships) ? n.memberships : [])).filter((m) => isRec(m) && pn.has(String(m.power ?? m.faction ?? m.name ?? ''))).length),
      corruptionFields: String(npcs.filter((n) => 'corruption' in n).length),
      defenseKey: String(criminalStructureKeyOf(d)), magicalCrime: String(magical(d)), covertHeld: String(covertCrimeHeld(d)),
    };
  };
  const switchOffOv = (rec, dm) => {
    const pubB = veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pubB, []);
    const deltas = sw.setCriminalVeil(OPEN.map((a) => ({ address: a, hidden: false })), model.defaults, true, sw.presentCriminalGroupings(pubB), model);
    return veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  };
  const twinWith = (rec, dm, o) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: o }), o);
  const tell = (A, B, dm) => {
    const a = crimFields(twin(A, dm));
    const settings = { open: twin(B, dm), default: twinWith(B, dm, veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' })), criminalSwitchOff: twinWith(B, dm, switchOffOv(B, dm)) };
    const per = {};
    for (const [k, d] of Object.entries(settings)) { const b = crimFields(d); per[k] = Object.keys(a).filter((f) => a[f] !== b[f]).map((f) => `${f}: served ${a[f]} | B ${b[f]}`); }
    return { equalUnder: Object.keys(per).filter((k) => !per[k].length), differ: per };
  };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const ONLY = (process.env.RV9_ONLY || '').split(',').filter(Boolean); if (ONLY.length && !ONLY.includes(seed)) continue;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; dial = null; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { tier: size, seed, crisis, dial, hidden: hidden.map((h) => h.name), storedKey: criminalStructureKeyOf(A) };
    // (the seat's 09:18 relay: THE CONTROL, a town with no hideable house, read through the same veil: its key and labels)
    const ops = (d) => (Array.isArray(d?.economicState?.safetyProfile?.criminalInstitutions) ? d.economicState.safetyProfile.criminalInstitutions : null);
    if (!hidden.length) {
      rec.control = {};
      for (const dm of [false, true]) for (const [eng, d] of [['server', await server(A, dm)], ['twin', twin(A, dm)]]) rec.control[`${eng}/${dm ? 'dm' : 'off'}`] = { key: criminalStructureKeyOf(d), ops: ops(d), magic: magical(d) };
      out.push(rec); continue;
    }
    let B; try { B = birth(cfg, seed, (h) => isHideableHouse(h)); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); out.push(rec); continue; }
    if (ONLY.length) {   // VEIL-31's twin measure (the chair's 02:28 condition): the house-free twin B's own values, raw and read
      const tv = (d) => ({ crimeTypes: (d?.economicState?.safetyProfile?.crimeTypes || []).map((c) => c?.type ?? null), ops: ops(d),
        criminalHouses: (d?.institutions || []).filter((h) => isRec(h) && /crimin/i.test(String(h.category || ''))).map((h) => String(h.name)),
        gamblingHouses: (d?.institutions || []).filter((h) => isRec(h) && /gambl/i.test(String(h.name || ''))).map((h) => String(h.name)),
        ccs: d?.powerStructure && Object.prototype.hasOwnProperty.call(d.powerStructure, 'criminalCaptureState') ? d.powerStructure.criminalCaptureState : '#absent' });
      const pw = (d) => ({ factions: (d?.powerStructure?.factions || []).filter(isRec).map((f) => `${f.faction ?? f.name}|cat=${f.category}|gov=${!!f.isGoverning}|cs=${f.captureState ?? '-'}`),
        rels: (d?.powerStructure?.factionRelationships || []).filter(isRec).filter((r) => r.captureState).map((r) => `${JSON.stringify(r.pair)}|${r.captureState}`),
        hideableLeft: (d?.institutions || []).filter((h) => isRec(h) && isHideableHouse(h)).map((h) => String(h.name)),
        criminalCatHouses: (d?.institutions || []).filter((h) => isRec(h) && /crimin/i.test(String(h.category || '') + String(h.priorityCategory || ''))).map((h) => String(h.name)),
        allegiances: (d?.npcs || []).filter((n) => isRec(n) && n.allegiance).map((n) => JSON.stringify(n.allegiance).slice(0, 80)) });
      rec.Bpw = pw(B); rec.Apw = pw(A);
      rec.A = tv(A); rec.B = tv(B); rec.Bserved = {}; rec.Aserved = {};
      for (const dm of [false, true]) { rec.Bserved[dm ? 'dm' : 'off'] = tv(twin(B, dm)); rec.Aserved[dm ? 'dm' : 'off'] = tv(twin(A, dm)); }
      out.push(rec); continue;
    }
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
      const lower = ['server', 'twin'].some((e) => { const r = rec.reads[`${e}/${dm ? 'dm' : 'off'}`]; return r.key !== r.cf; });
      if (lower || process.env.RV9_TELL_ONLY_LOWER === '0') (rec.tell ||= {})[dm ? 'dm' : 'off'] = tell(A, B, dm);
    }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
