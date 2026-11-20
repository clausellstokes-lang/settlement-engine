// REVIEW-VEIL-13 — THE TELL QUESTION (the chair's ruling 41 (2), PART 26; REVIEW-VEIL-13.txt). MY OWN INSTRUMENT, built
// independently of the lane's gate: the pool is the gate's recipe (r3m-<size>-<crisis>-<k>-<idx>, 7 sizes x 10 crises x N),
// the counterfactual is MY birth (generateSettlementPipeline with every hideable house cut after EVERY step: onStep), never a
// helper of the projection. Per town with a hideable house:
//   A  as born, served under THE GATE'S SETTING (the groupings and plot hooks opened by hand, every hideable house hidden by
//      the default veil), Reveal DM off and on, by the SERVER (get_gallery_dossier, anon) and the TWIN.
//   B  the house-free regeneration, served by the twin under EVERY SETTING OF THE OWNER'S SWITCHES (each of the three criminal
//      groupings open or shut; the criminal powers' depth and people's corruption eyes at default or opened: 16), and by the
//      server under the gate's setting (the gate recomputed: HIGHER / EQUAL / LOWER on the derived key).
// THE TELL (literal): a criminal-related field of served(A) equal to served(B, S) for NO setting S. Reported: the best S (the
// fewest differing fields) and those fields. THE POSSIBLE WORLD (wider): A's criminal SIGNATURE (presence/shape, never names)
// against every house-free page of the same tier (every B and every control town, every S): found or not.
// RV13_TOWNS = comma list of seed suffixes like "town-none-0-17" to restrict A; RV9_N (default 2). Out: RV10_OUT (text).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2);
const ONLY = process.env.RV13_TOWNS ? new Set(process.env.RV13_TOWNS.split(',')) : null;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const eq = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const GROUPS = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside'];
const CRIMPOW = (f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || /thie|crimin|syndicate|gang|smuggl|black market/i.test(String(f.faction ?? f.name ?? '')));
const CRIMROW = (r) => isRec(r) && (r.isCriminal === true || /crim|black market|smuggl|thie|fence/i.test(String(r.source ?? r.label ?? r.name ?? '')));
it('tell', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = 'tell';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const CSK = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  // MY counterfactual: the generator, the hideable class cut from the roster after every step.
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx?.institutions); if (isRec(ctx?.settlement)) cut(ctx.settlement.institutions); } : undefined });
    t = clone(t); if (drop) cut(t.institutions);
    delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return clone(t);
  };
  const GATE = veil.writeShareVeil({}, [...GROUPS, 'tab:plot_hooks'].map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const settingsFor = (rec) => {
    const defs = veil.defaultVeilFor(veil.galleryPayloadFor(clone(rec), { shareDm: true, memberOverrides: {} }));
    const depth = defs.filter((d) => d && (d.cls === 'criminal-faction' || d.cls === 'npc-corruption')).map((d) => d.address);
    const out = [];
    for (let m = 0; m < 8; m += 1) for (const deep of [false, true]) {
      const deltas = [{ address: 'tab:plot_hooks', hidden: false }, ...GROUPS.map((a, i) => ({ address: a, hidden: !((m >> i) & 1) })), ...(deep ? depth.map((a) => ({ address: a, hidden: false })) : [])];
      out.push({ name: `${GROUPS.map((a, i) => ((m >> i) & 1 ? 'SDP'[i] : '-')).join('')}${deep ? '+depth' : ''}`, ov: veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) });
    }
    return out;
  };
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd9f13-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `t13x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','x','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(rec), sl, JSON.stringify(ov), dm]);
    await db.query('set role anon'); const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d; await db.query('reset role');
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const twin = (rec, dm, ov) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov);
  // the criminal-related fields (every path a criminal grouping removes, the criminal rows and powers, the derived key)
  const sp = (d) => d?.economicState?.safetyProfile;
  const FIELDS = {
    key: (d) => CSK.criminalStructureKeyOf(d),
    covertHeld: (d) => (CSK.covertCrimeHeld ? CSK.covertCrimeHeld(d) : null),
    ops: (d) => sp(d)?.criminalInstitutions,
    crimeTypes: (d) => sp(d)?.crimeTypes,
    blackMarketCapture: (d) => sp(d)?.blackMarketCapture,
    servicesCriminal: (d) => d?.availableServices?.criminal,
    incomeCriminalRows: (d) => (Array.isArray(d?.economicState?.incomeSources) ? d.economicState.incomeSources.filter(CRIMROW) : d?.economicState?.incomeSources),
    criminalPowers: (d) => (d?.powerStructure?.factions || []).filter(CRIMPOW).map((f) => ({ name: f.faction ?? f.name, category: f.category, isGoverning: f.isGoverning ?? null })),
    captureStates: (d) => ({ c: d?.powerStructure?.criminalCaptureState ?? null, f: (d?.powerStructure?.factions || []).filter((f) => f?.captureState != null).map((f) => [f.faction ?? f.name, f.captureState]).sort(), p: (d?.powerStructure?.factionRelationships || []).filter((p) => p?.captureState != null).map((p) => p.captureState).sort() }),
    criminalChains: (d) => (d?.economicState?.activeChains || []).filter((c) => c?.needKey === 'criminal_economy').map((c) => `${c?.chainId}:${c?.status}`),
  };
  const tri = (v) => (v === undefined ? 'absent' : Array.isArray(v) ? (v.length ? 'some' : 'empty') : v === null ? 'null' : 'value');
  const signature = (d) => JSON.stringify({ key: FIELDS.key(d), ops: tri(FIELDS.ops(d)), types: tri(FIELDS.crimeTypes(d)), bmc: tri(FIELDS.blackMarketCapture(d)), svc: tri(FIELDS.servicesCriminal(d)),
    inc: (FIELDS.incomeCriminalRows(d) || []).length ? 'row' : 'none', pow: FIELDS.criminalPowers(d).length ? 'some' : 'none', cap: d?.powerStructure?.criminalCaptureState === undefined ? 'absent' : 'present', chains: FIELDS.criminalChains(d).length ? 'some' : 'none' });
  const worlds = {}; // tier -> dm -> Set(signature) over house-free pages
  const addWorld = (tier, dm, d) => { ((worlds[tier] = worlds[tier] || {})[dm] = worlds[tier][dm] || new Set()).add(signature(d)); };
  const towns = []; let idx = 0; const gate = { HIGHER: 0, EQUAL: 0, LOWER: 0, twinServerDiffer: 0 }; const RANK = { null: 0, undefined: 0, diffuse: 1, 'semi-organized': 2, organized: 3 };
  const rank = (k) => (Object.prototype.hasOwnProperty.call(RANK, String(k)) ? RANK[String(k)] : -1);
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const tag = `${size}-${crisis}-${k}-${idx}`; const seed = `r3m-${tag}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch { continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    if (!hidden.length) { for (const s of settingsFor(A)) for (const dm of [false, true]) addWorld(size, dm, twin(A, dm, s.ov)); continue; }
    let B; try { B = birth(cfg, seed, (h) => isHideableHouse(h)); } catch { continue; }
    const SB = settingsFor(B);
    const bViews = {}; for (const dm of [false, true]) bViews[dm] = SB.map((s) => ({ name: s.name, d: twin(B, dm, s.ov) }));
    for (const dm of [false, true]) for (const v of bViews[dm]) addWorld(size, dm, v.d);
    if (ONLY && !ONLY.has(tag)) continue;
    const t = { tag, size, hidden: hidden.map((h) => h.name), reads: {} };
    for (const dm of [false, true]) {
      const aS = await server(A, dm, GATE); const aT = twin(A, dm, GATE); const bS = await server(B, dm, GATE);
      if (!eq(aS, aT)) gate.twinServerDiffer += 1;
      const ka = FIELDS.key(aS); const kb = FIELDS.key(bS); const verdict = rank(ka) > rank(kb) ? 'HIGHER' : rank(ka) < rank(kb) ? 'LOWER' : 'EQUAL'; gate[verdict] += 1;
      let best = null;
      for (const v of bViews[dm]) { const diff = Object.keys(FIELDS).filter((f) => !eq(FIELDS[f](aS), FIELDS[f](v.d))); if (!best || diff.length < best.diff.length) best = { name: v.name, diff, b: v.d }; }
      t.reads[dm ? 'dm' : 'off'] = { key: ka, cfKey: kb, verdict, bestSetting: best.name, tell: best.diff, detail: Object.fromEntries(best.diff.map((f) => [f, { served: JSON.stringify(FIELDS[f](aS) ?? null).slice(0, 160), cf: JSON.stringify(FIELDS[f](best.b) ?? null).slice(0, 160) }])), sig: signature(aS) };
    }
    towns.push(t);
  }
  const lines = [`GATE (my recompute, server, the gate's setting, both dm): ${JSON.stringify(gate)}`];
  for (const t of towns) for (const [dm, r] of Object.entries(t.reads)) {
    const found = worlds[t.size]?.[dm === 'dm']?.has(r.sig);
    lines.push(`${t.tag} ${dm} ${r.verdict} served=${r.key} cf=${r.cfKey} | best setting ${r.bestSetting}: ${r.tell.length ? 'TELL ' + r.tell.join(',') : 'no field differs'} | possible world (signature among house-free pages of tier ${t.size}): ${found ? 'FOUND' : 'NOT FOUND ' + r.sig}`);
    for (const [f, x] of Object.entries(r.detail)) lines.push(`    ${f}: served ${x.served} | cf ${x.cf}`);
  }
  writeFileSync(process.env.RV10_OUT, lines.join('\n') + '\n');
  await db.end();
}, 14_400_000);
