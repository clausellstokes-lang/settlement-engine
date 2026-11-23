// VEIL-27 measure helper (m27/kl): a COPY of R3-CURE-5's keylevel.probe.jsx (unit 2, twin only; the original kept beside it as
// keylevel.probe.orig.jsx) that ALSO reads every page through the SERVER exactly as gate.probe.jsx does (the same births
// r3m-<size>-<crisis>-<k>-<idx>, the same opened veil record OPEN, Reveal DM off and on, the gallery read: a row inserted into
// public.settlements of a per-shard copy of RV9_SERVER_TPL, read by public.get_gallery_dossier(slug) as the session's
// superuser with test.uid '', then deleted; gate.probe.jsx has no link read, so none here). Per page, per engine, the holders
// of the key-level table; the server's cuts are read against the twin's projection before the veil (`pub`: the server has
// no intermediate). PARITY: per page, every (holder path, key) served by one engine and not the other (the table's keys;
// and, as a second column, ANY own key of a power or a person). TASK 2: per page (A, the counterfactual B, the control),
// per engine and Reveal, the Defense key recomputed FROM THE SERVED PAGE ALONE the way DefenseTab.jsx draws it (a JSON
// copy of the served page, `isVeiled(.., 'block:defense.criminalStructure', { publicDossier: true })`, then
// `deskHostArgs.js :: criminalStructureOf(page, veiled)?.key`), against the gate's served key
// (`criminalStructureKeyOf(served page)`). Out: RV9_OUT. RV9_SHAPE=master: master's stored shape (stored AND served).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AFF = ['factionAffiliation', 'faction', 'affiliation', 'factionId'];
const clone = (v) => JSON.parse(JSON.stringify(v));
it('m27/kl key-level measure, twin AND server', async () => {
  // THE SERVER, as gate.probe.jsx: a per-shard database from the template, superuser session, test.uid ''
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
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { criminalStructureKeyOf } = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const { criminalStructureOf } = await import(`${SRC}/src/components/new/deskHostArgs.js`);
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
  const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const SHAPE = process.env.RV9_SHAPE || 'lane';
  const shaped = (rec) => (SHAPE === 'master' ? { ...rec, factions: clone(rec.powerStructure?.factions || []) } : rec);
  let nrow = 0;
  const server = async (rec, dm) => { // gate.probe.jsx :: server, verbatim but for the id/slug stem
    nrow += 1; const id = `abcd9f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `m${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  // the twin returns [pub, served]; the server returns the served page (its `pub` is the twin's, the same projection's input)
  const read = (rec0, dm) => { const rec = shaped(rec0); const pub = veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }); return [pub, veil.projectShareVeil(clone(pub), ov)]; };
  const lists = (d) => [['powerStructure.factions', d?.powerStructure?.factions], ['factions', d?.factions]];
  const pkind = (f) => (f.isGoverning === true ? 'governing' : String(f.category || 'none').toLowerCase());
  const holders = (d) => {
    const out = [];
    for (const [l, xs] of lists(d)) for (const f of (Array.isArray(xs) ? xs : []).filter(isRec)) out.push({ list: l, kind: `power:${pkind(f)}`, key: 'contestsNiche', has: typeof f.contestsNiche === 'string' && f.contestsNiche !== '' });
    for (const n of (Array.isArray(d?.npcs) ? d.npcs : []).filter(isRec)) for (const k of AFF) out.push({ list: 'npcs', kind: `person:${(Array.isArray(n.memberships) && n.memberships.length) ? 'member' : 'nomember'}`, key: k, has: typeof n[k] === 'string' && n[k] !== '' });
    return out;
  };
  const strings = (v, p, out) => { if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) v.forEach((x) => strings(x, `${p}[]`, out)); else if (isRec(v)) for (const k of Object.keys(v)) { out.push([`${p}.{KEY}`, k]); strings(v[k], p ? `${p}.${k}` : k, out); } return out; };
  const cutsOf = (pub, d) => { // keylevel.probe.jsx's cut search, verbatim, as a function of (projection, served page)
    const opens = lists(d).flatMap(([, xs]) => (Array.isArray(xs) ? xs : [])).filter(isRec).flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v);
    const cuts = [];
    for (const [l, xs] of lists(d)) for (const f of (Array.isArray(xs) ? xs : []).filter(isRec)) {
      const nm = f.faction ?? f.name;
      const [, pxs] = lists(pub).find(([pl]) => pl === l);
      const f0 = (Array.isArray(pxs) ? pxs : []).find((z) => isRec(z) && (z.faction ?? z.name) === nm);
      if (f0 && typeof f0.contestsNiche === 'string' && f0.contestsNiche !== '' && f.contestsNiche !== f0.contestsNiche) cuts.push({ list: l, kind: `power:${pkind(f)}`, key: 'contestsNiche', value: f0.contestsNiche, servedValue: f.contestsNiche ?? null });
    }
    for (const n of (Array.isArray(d?.npcs) ? d.npcs : []).filter(isRec)) {
      const n0 = (Array.isArray(pub.npcs) ? pub.npcs : []).find((z) => isRec(z) && z.id === n.id);
      if (!n0) continue;
      for (const key of AFF) if (typeof n0[key] === 'string' && n0[key] !== '' && n[key] !== n0[key]) cuts.push({ list: 'npcs', kind: `person:${(Array.isArray(n.memberships) && n.memberships.length) ? 'member' : 'nomember'}`, key, value: n0[key], servedValue: n[key] ?? null, memberships: (n.memberships || []).length });
    }
    const all = strings(d, '', []);
    for (const c of cuts) { const s = buildNameSearch([c.value], opens); c.stillNamed = s ? all.filter(([, v]) => s.hit(v)).map(([p]) => p) : []; }
    return cuts;
  };
  // PARITY: the page's holders by path ('<list>[<name>]#<n>' for a power, 'npcs[<id>]#<n>' for a person), each with its own keys
  const holderMap = (d0) => {
    const d = clone(d0 ?? {}); const m = new Map();
    for (const [l, xs] of lists(d)) { const seen = {}; for (const f of (Array.isArray(xs) ? xs : []).filter(isRec)) { const nm = String(f.faction ?? f.name ?? '?'); seen[nm] = (seen[nm] || 0) + 1; m.set(`${l}[${nm}]#${seen[nm]}`, f); } }
    const seen = {}; for (const n of (Array.isArray(d.npcs) ? d.npcs : []).filter(isRec)) { const nm = String(n.id ?? n.name ?? '?'); seen[nm] = (seen[nm] || 0) + 1; m.set(`npcs[${nm}]#${seen[nm]}`, n); }
    return m;
  };
  const TABLE = (p) => (p.startsWith('npcs[') ? AFF : ['contestsNiche']);
  // values compared with object keys sorted (jsonb stores an object's keys in its own order; the order is not served meaning)
  const canon = (v) => JSON.stringify(v, (_, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x)) ?? 'undefined';
  const hasK = (o, k) => typeof o?.[k] === 'string' && o[k] !== '';
  const parity = (s, t) => {
    const S = holderMap(s); const T = holderMap(t); const out = { nS: S.size, nT: T.size, holderOnlyServer: [], holderOnlyTwin: [], table: [], anyKey: [], valueDiff: [] };
    for (const p of S.keys()) if (!T.has(p)) out.holderOnlyServer.push(p);
    for (const p of T.keys()) if (!S.has(p)) out.holderOnlyTwin.push(p);
    for (const [p, a] of S) { const b = T.get(p); if (!b) continue;
      for (const k of TABLE(p)) if (hasK(a, k) !== hasK(b, k)) out.table.push({ path: p, key: k, server: a[k] ?? null, twin: b[k] ?? null, servedBy: hasK(a, k) ? 'server' : 'twin' });
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        const ia = k in a; const ib = k in b;
        if (ia !== ib) out.anyKey.push({ path: p, key: k, servedBy: ia ? 'server' : 'twin', value: JSON.stringify(ia ? a[k] : b[k]).slice(0, 120) });
        else if (canon(a[k]) !== canon(b[k])) out.valueDiff.push({ path: p, key: k, server: canon(a[k]).slice(0, 160), twin: canon(b[k]).slice(0, 160) });
      }
    }
    return out;
  };
  // TASK 2: the Defense key recomputed from the served page alone, the way DefenseTab.jsx draws it
  const ADDR = 'block:defense.criminalStructure';
  const defenseKeys = (d) => {
    const copy = clone(d ?? {}); // the served fields only: no list beside the object
    const veiledCopy = veil.isVeiled(copy, ADDR, { publicDossier: true });
    const veiledObj = veil.isVeiled(d ?? {}, ADDR, { publicDossier: true });
    return { served: criminalStructureKeyOf(d) ?? null, page: criminalStructureOf(copy, veiledCopy)?.key ?? null, pageObj: criminalStructureOf(d ?? {}, veiledObj)?.key ?? null, veiledCopy, veiledObj };
  };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { seed, size, crisis, shape: SHAPE, hidden: hidden.map((h) => h.name), pages: [], stored: holders(shaped(A)), parity: [], keys: [] };
    const towns = [];
    if (!hidden.length) towns.push(['control', A]);
    else { towns.push(['hidden', A]); try { towns.push(['counterfactual', birth(cfg, seed, (h) => isHideableHouse(h))]); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); } }
    for (const [role, T] of towns) for (const dm of [false, true]) {
      const [pub, dt] = read(T, dm);
      const ds = await server(shaped(T), dm);
      if (!ds) rec.serverNull = (rec.serverNull || 0) + 1;
      for (const [engine, d] of [['twin', dt], ['server', ds]]) {
        const page = { engine, role, dm, served: holders(d), pub: holders(pub) };
        if (role === 'hidden') page.cuts = cutsOf(pub, d ?? {});
        rec.pages.push(page);
        rec.keys.push({ engine, role, dm, ...defenseKeys(d) });
      }
      rec.parity.push({ role, dm, ...parity(ds, dt) });
    }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
