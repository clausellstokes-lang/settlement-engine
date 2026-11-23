// V33-Q (VEIL-33's builder): THE MEASURES OF UNITS (iv), (v), (vi), read-only (no line of 212, the twin or the registry).
// Per served page, compactly: the relation rows (pair, type, direction, captureState, each end's class), the safety line's
// state and its two gates clauses, the current tensions (type, factions), the criminal-worded imports, criminalCaptureState
// and the served crime signal (212's own: a served house of category / priorityCategory 'criminal', a served power of
// category 'criminal'). Modes (RV9_MODE):
//   towns   the gate's 140 births (tell-common.mjs :: pool, RV9_N=2; RV9_ONLY=<seeds> narrows), every setting but g:111,
//           Reveal off and on, the twin AND (hidden-house towns) the server (get_gallery_dossier on the scratch PG16: 211 + this
//           tree's 212, template RV9_SERVER_TPL); and each hidden-house town's HOUSE-FREE TWIN B (every hideable house cut after
//           every step, R6's birth: tell-common.mjs :: birth with drop), its stored values and its twin pages.
//   pool    the cached pool's births (RV9_POOL_DIR, parts A and B) re-born whole, every RV9_STRIDE-th: part A under every
//           setting, part B under the settings that hide nothing it holds (tell2.probe.jsx :: showAll), Reveal off and on; twin.
//   insurg  NEW nothing-hidden births (seeds q33i-<size>-insurgency-<k>, the gate's config and dials, the insurgency crisis), a
//           birth REJECTED at the first step that holds a hideable house (tell2.probe.jsx :: pool's rule), RV9_TARGET accepted
//           per size (RV9_POOL_SIZES, default town), each read (twin) under every setting, Reveal off and on.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
import { CRIM_RE } from '../../../v27/tell/measure/tell-surface.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const MODE = process.env.RV9_MODE || 'towns';
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const low = (v) => (typeof v === 'string' ? v.toLowerCase() : '');
const stable = (v) => (Array.isArray(v) ? v.map(stable) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])])) : v);
const S = (v) => (v === undefined ? 'undefined' : JSON.stringify(stable(v)));
const EVERYONE = ' Everyone comes in by the gates, where the guard sees them.';
const BENEATH = ' The guard keeps the gates, but smugglers have ways in beneath the walls.';
class Reject extends Error {}

it(`V33-Q measure (${MODE})`, async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const powersOf = (d) => [...recs(d?.powerStructure?.factions), ...recs(d?.factions)];
  const pname = (f) => String(f.faction ?? f.name ?? '');
  /** The page's compact record. `A` (the stored record) classifies a relation's ends; null on the pool (no stored compare). */
  const pageOf = (page, A) => {
    const d = isRec(page) ? page : {}; const ps = isRec(d.powerStructure) ? d.powerStructure : {};
    const served = recs(ps.factions); const servedNames = new Set(powersOf(d).map(pname).filter(Boolean));
    const crimHouse = recs(d.institutions).some((h) => low(h.category) === 'criminal' || low(h.priorityCategory) === 'criminal');
    const signal = crimHouse || served.some((f) => low(f.category) === 'criminal');
    const gov = served.find((f) => f.isGoverning === true);
    const servedCls = (s) => { const f = served.find((x) => pname(x) === s) || powersOf(d).find((x) => pname(x) === s); return f && f.isGoverning === true && low(f.category) === 'criminal' ? 'gov-crim' : f && low(f.category) === 'criminal' ? 'crim-served' : 'served'; };
    let cls = (n) => (servedNames.has(String(n)) ? servedCls(String(n)) : 'unserved');
    let wSearch = null;
    if (A) {
      const stored = new Map(powersOf(A).map((f) => [pname(f), f]));
      const hidden = recs(A.institutions).filter((h) => E.isHideableHouse(h)).map((h) => String(h.name ?? ''));
      const shownH = new Set(recs(d.institutions).map((h) => String(h.name ?? '')));
      const hiddenNow = hidden.filter((h) => !shownH.has(h));
      cls = (n) => {
        const s = String(n);
        if (servedNames.has(s)) return servedCls(s);
        if (hiddenNow.includes(s)) return 'hidden-house';
        const f = stored.get(s); if (!f) return 'unknown';
        return low(f.category) === 'criminal' && f.isGoverning !== true ? 'withheld-crim' : 'withheld-other';
      };
      const withheld = [...stored.keys()].filter((k) => k && !servedNames.has(k));
      wSearch = buildNameSearch([...withheld, ...hiddenNow].filter(Boolean), [...servedNames, ...shownH].filter(Boolean));
    }
    const rel = recs(ps.factionRelationships).map((r) => {
      const pair = Array.isArray(r.pair) ? r.pair : [];
      const hits = wSearch ? Object.entries(r).filter(([k, v]) => k !== 'pair' && typeof v === 'string' && wSearch.hit(v)).map(([k]) => k) : [];
      return [S(pair), r.type ?? null, r.direction ?? null, 'captureState' in r ? r.captureState : '#a', pair.map(cls).join('+'), hits.join(',')];
    });
    const sp = isRec(d.economicState?.safetyProfile) ? d.economicState.safetyProfile : null;
    const sdv = sp ? sp.safetyDesc : undefined;
    const sd = { s: sp === null ? 'nosp' : sdv === undefined ? 'a' : sdv === null ? 'n' : typeof sdv === 'string' ? 'p' : 'o', ev: typeof sdv === 'string' && sdv.includes(EVERYONE) ? 1 : 0,
      bn: typeof sdv === 'string' && sdv.includes(BENEATH) ? 1 : 0, vs: typeof sdv === 'string' && sdv.startsWith('Visitors can walk anywhere') ? 1 : 0, lbl: sp?.safetyLabel ?? null };
    const hist = isRec(d.history) ? d.history : {};
    const ten = Array.isArray(hist.currentTensions) ? recs(hist.currentTensions).map((t) => [t.type ?? null, S(t.factions), (Array.isArray(t.factions) ? t.factions : []).map(cls).join('+')]) : '#a';
    const imps = Array.isArray(d.economicState?.primaryImports) ? d.economicState.primaryImports : null;
    const imp = imps ? imps.filter((x) => CRIM_RE.test(S(x))).map((x) => S(x).slice(0, 80)) : '#a';
    return { rel, sd, ten, imp, impN: imps ? imps.length : -1, ccs: 'criminalCaptureState' in ps ? ps.criminalCaptureState : '#a', sig: signal ? 1 : 0,
      govC: gov && low(gov.category) === 'criminal' ? 1 : 0, crimP: served.filter((f) => low(f.category) === 'criminal').map((f) => `${pname(f)}${f.isGoverning ? '*' : ''}`), crimH: crimHouse ? 1 : 0 };
  };
  /** The stored record's own values (the same reads, on the record as stored; its powers and hidden houses). */
  const storedOf = (A) => ({ ...pageOf(A, A), powers: powersOf(A).map((f) => `${pname(f)}|${f.category}|${f.isGoverning === true ? 'gov' : ''}`),
    hidden: recs(A.institutions).filter((h) => E.isHideableHouse(h)).map((h) => String(h.name)), sdText: A.economicState?.safetyProfile?.safetyDesc ?? null,
    tenFull: recs(A.history?.currentTensions).map((t) => S(t).slice(0, 300)) });
  const showAll = (doc, dm) => {
    const { sc, deltas } = V.settings(doc, dm);
    const cards = (doc.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const out = {};
    for (const [k, dd] of Object.entries(deltas)) if (k.startsWith('g:') || k === 'own') out[k] = [...dd, ...cards];
    out.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
    return out;
  };
  const allSettings = (doc, dm) => V.settings(doc, dm).deltas;
  const twinPages = (doc, setsOf, A) => { const out = {}; for (const dm of [false, true]) for (const [k, dd] of Object.entries(setsOf(doc, dm))) if (k !== 'g:111') out[`${dm ? 'dm' : 'off'}|${k}`] = pageOf(V.twin(doc, dm, V.write(dd)), A); return out; };
  // ── the server (scratch PG16), one database per shard (tell2.probe.jsx :: openDb, server)
  let db = null; let nrow = 0;
  const openDb = async () => {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  };
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd3f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `q${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const out = { mode: MODE, shard: SHARD, src: SRC, started: new Date().toISOString(), births: [] };
  if (MODE === 'towns') {
    await openDb();
    const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
    for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
      if (ONLY && !ONLY.has(b.seed)) continue;
      const A = E.birth(b.cfg, b.seed, null);
      const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
      const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden, stored: storedOf(A), twin: twinPages(A, allSettings, A) };
      if (hidden.length) {
        rec.server = {};
        for (const dm of [false, true]) for (const [k, dd] of Object.entries(allSettings(A, dm))) if (k !== 'g:111') rec.server[`${dm ? 'dm' : 'off'}|${k}`] = pageOf(await server(A, dm, V.write(dd)), A);
        const B = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
        rec.B = { stored: storedOf(B), twin: twinPages(B, allSettings, B), hideableLeft: (B.institutions || []).filter((h) => E.isHideableHouse(h)).length };
      }
      out.births.push(rec);
    }
  } else if (MODE === 'pool') {
    const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
    const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const born = (size, crisis, seed) => { let t = generateSettlementPipeline(birthConfig(cfgOf(size, crisis)), null, { seed, customContent: {} }); t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t)); return clone(t); };
    const dir = process.env.RV9_POOL_DIR; const STRIDE = Number(process.env.RV9_STRIDE || 1);
    const shards = readdirSync(dir).filter((f) => /^poolb?-shard\d+\.json$/.test(f)).sort().map((f) => ({ b: f.startsWith('poolb'), ...JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) }));
    // (VEIL-40's T5: RV9_PSIZES narrows the re-birth to the sizes the units read; the shard split is over those births alone)
    const PSIZES = process.env.RV9_PSIZES ? new Set(process.env.RV9_PSIZES.split(',')) : null;
    let i = 0;
    for (const sh of shards) for (const c of sh.births) {
      if (PSIZES && !PSIZES.has(c.size)) continue;
      i += 1; if (i % STRIDE !== 0 || (i / STRIDE) % SHARD[1] !== SHARD[0]) continue;
      const doc = born(c.size, c.crisis, c.seed);
      out.births.push({ seed: c.seed, size: c.size, crisis: c.crisis, part: sh.b ? 'B' : 'A', stored: pageOf(doc, null), pages: twinPages(doc, sh.b ? showAll : allSettings, null) });
    }
  } else if (MODE === 'insurg') {
    const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
    const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const crisis = process.env.RV9_CRISIS || 'insurgency';
    const hasHouse = (ctx) => [...(Array.isArray(ctx?.institutions) ? ctx.institutions : []), ...(isRec(ctx?.settlement) && Array.isArray(ctx.settlement.institutions) ? ctx.settlement.institutions : [])].some((h) => isRec(h) && E.isHideableHouse(h));
    const SIZES = (process.env.RV9_POOL_SIZES || 'town').split(',');
    const TARGET = Number(process.env.RV9_TARGET || 300); const per = Math.ceil(TARGET / SHARD[1]);
    out.cost = {};
    for (const size of SIZES) {
      const t0 = Date.now(); let got = 0; let tried = 0; let rej = 0;
      for (let k = SHARD[0]; got < per && k < 400 * TARGET; k += SHARD[1]) {
        const seed = `q33i-${size}-${crisis}-${k}`; tried += 1;
        let t;
        try {
          t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, selectedStresses: [crisis], selectedStressesRandom: false }), null, { seed, customContent: {}, onStep: (name, ctx) => { if (hasHouse(ctx)) throw new Reject(name); } });
        } catch (e) { if (e instanceof Reject) { rej += 1; continue; } throw e; }
        t = { ...t }; delete t.publicProse; t = clone(withPublicProse(t, composePublicProse(t)));
        if ((t.institutions || []).some((h) => E.isHideableHouse(h))) throw new Error(`accepted birth holds a hideable house: ${seed}`);
        got += 1;
        out.births.push({ seed, size, crisis, part: 'A', stored: pageOf(t, null), pages: twinPages(t, allSettings, null) });
      }
      out.cost[size] = { tried, accepted: got, rejected: rej, ms: Date.now() - t0 };
    }
  }
  if (db) await db.end();
  out.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
