// R3-TELL-2 unit 1: THE INSTRUMENT (ruling 54 (a)-(d)). No line of 212 or the twin. Three modes (RV9_MODE):
//   pool    THE POOL: nothing-hidden births per size (seeds t2p-<size>-<crisis>-<k>, the gate's config and dials, the
//           gate's crisis cycle), each read (twin) under EVERY setting of the owner's switches: Reveal DM off and on, and
//           each criminal setting tell-common.mjs :: settings computes on the record (own, the seven g:<bits>, allOpen,
//           off); every page's signature (tell2-signature.mjs). A birth is REJECTED at the first pipeline step that holds a
//           hideable house (houses are only ever added later: 0 of 450 births measured lost one; every RV9_AUDIT-th
//           rejected birth is run to its end and checked). Shard s of n takes k = s mod n; each size stops at
//           ceil(RV9_TARGET / n) accepted births. Every RV9_SERVER_SAMPLE-th accepted birth is also read by the server
//           (own and off, Reveal off and on) and its signatures compared.
//   towns   THE 92 (and the gate's 48 controls): the gate's births byte for byte (tell-common.mjs :: pool), each read by
//           the twin AND the server (get_gallery_dossier on the scratch PG16: 211 + this tree's 212) under the same
//           settings, Reveal off and on; every page's signature.
//   reread  PART A RE-READ (t2sig-2): the births of an earlier part-A cache (RV9_FROM_DIR), re-born whole (no rejection
//           needed: they are known nothing-hidden) and re-read as in `pool`.
//   poolb   PART B (ruling 58 1): births that DO hold a hideable house (seeds t2b-<size>-<crisis>-<k>; a birth with none is
//           skipped), each read under the settings that HIDE NOTHING IT HOLDS: every hideable house's card shown, with the
//           hooks tab open and each grouping setting (own, g:000..g:110), and 'allShown' (the switch's "Show everything
//           criminal", its house cards kept shown); Reveal off and on. RV9_TARGET a size (150).
//   stored  V33-LP (THE READ-STORED MODE, an instrument that stays): STORED DOCUMENTS from RV9_STORED_DIR (dump.probe.jsx's
//           <seed>.json and index-shard*.json; any engine's births, master's among them) read through THIS tree's twin and
//           its server (RV9_SERVER_TPL: createdb -T v27x211 plus this tree's 212), the tell's settings and hiding choices.
//           Each document is routed by what IT holds (today's isHideableHouse): role T (the gate's towns) as `towns`;
//           role A/B with no hideable house as `pool` (every setting; every RV9_SERVER_SAMPLE-th by the server, own and off),
//           with one as `poolb` (the settings that hide nothing it holds). Writes RV9_OUT_DIR/{pool,poolb,towns}-shard<s>.json
//           in the analyzer's format (tell2-an.mjs <dir> <dir>) and, unless RV9_EXTRA=0, extra-shard<s>.json: per document
//           THE DIFFERENTIAL (galleryVeilRecent.pglite.test.js's arm: own, Reveal off and on, server page + import and the
//           twin, against the same place with the withheld powers and houses never there), THE TELLS per registry row
//           (every gated setting, twin, both Reveals: a withheld name served, a crime-kind word served where the
//           never-there read serves none at that path, a key the never-there read lacks) and THE READERS (pageRederive.js
//           fed a nothing-hidden read, each re-derived value against the record). RV9_ROLES (A,B,T), RV9_LIMIT, RV9_SERVER=0.
//   verify  THE CACHE STILL HOLDS: every RV9_VERIFY-th cached pool birth re-born and re-read on this tree; its signatures
//           compared with the cache's (for the cure's runs, which reuse the cache).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, CRISES, OPEN, leaves, norm } from '../../v27/tell/measure/tell-common.mjs';
import { namesOf } from '../../v27/tell/measure/tell-surface.mjs';
import { signatureOf, SIG_VERSION } from '../../v27/tell2/measure/tell2-signature.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const MODE = process.env.RV9_MODE || 'towns';
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
class Reject extends Error {}

it(`R3-TELL-2 instrument (${MODE})`, async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  const hasHouse = (ctx) => [...(Array.isArray(ctx?.institutions) ? ctx.institutions : []), ...(isRec(ctx?.settlement) && Array.isArray(ctx.settlement.institutions) ? ctx.settlement.institutions : [])].some((h) => isRec(h) && E.isHideableHouse(h));
  /** A birth as tell-common.mjs :: birth makes it (drop = null), aborted at the first step holding a hideable house when `abort`. */
  const bornOrNull = (size, crisis, seed, abort) => {
    let dial = null;
    try {
      let t = generateSettlementPipeline(birthConfig(cfgOf(size, crisis)), null, { seed, customContent: {}, onStep: (name, ctx) => {
        if (typeof ctx?.effectiveConfig?.priorityCriminal === 'number') dial = ctx.effectiveConfig.priorityCriminal;
        if (abort && hasHouse(ctx)) throw new Reject(name);
      } });
      t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
      return { doc: clone(t), dial };
    } catch (e) { if (e instanceof Reject) return { rejectedAt: e.message }; throw e; }
  };
  const { hasMarketInstitution } = await import(`${SRC}/src/domain/facts/market.js`);
  const SIGS = new Map(); const sigIx = (s) => { if (!SIGS.has(s)) SIGS.set(s, SIGS.size); return SIGS.get(s); };
  const sigOf = (page) => sigIx(signatureOf(page, E.isHideableHouse, hasMarketInstitution).sig);
  /** The criminal powers' rows a page serves (ruling 58 3 (c)'s count): 'rows/governing', or null where none. */
  const pcOf = (page) => {
    const d = isRec(page) ? page : {}; const { P } = namesOf(E.isHideableHouse, d);
    const ps = [...(Array.isArray(d.powerStructure?.factions) ? d.powerStructure.factions : []), ...(Array.isArray(d.factions) ? d.factions : [])].filter(isRec)
      .filter((f) => P.has(String(f.faction ?? f.name ?? '')) || String(f.category ?? '').toLowerCase() === 'criminal');
    return ps.length ? `${ps.length}/${ps.filter((f) => f.isGoverning === true).length}` : null;
  };
  /** The settings of a birth that HOLDS hideable houses that hide none of them (part B). */
  const showAll = (doc, dm) => {
    const { sc, deltas } = V.settings(doc, dm);
    const cards = (doc.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const out = {};
    for (const [k, d] of Object.entries(deltas)) if (k.startsWith('g:') || k === 'own') out[k] = [...d, ...cards];
    out.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
    return out;
  };
  const allSettings = (doc, dm) => V.settings(doc, dm).deltas;
  /** Every setting's twin signature, Reveal off and on: sigs { 'off|own': ix, ... } and pc { key: 'rows/gov' }. */
  let lastPc = {};
  const twinSigs = (doc, setsOf = allSettings) => {
    const out = {}; lastPc = {};
    for (const dm of [false, true]) {
      for (const [k, d] of Object.entries(setsOf(doc, dm))) if (k !== 'g:111') { const page = V.twin(doc, dm, V.write(d)); const key = `${dm ? 'dm' : 'off'}|${k}`; out[key] = sigOf(page); const pc = pcOf(page); if (pc) lastPc[key] = pc; }
    }
    return out;
  };
  // ── the server (scratch PG16), one database per shard
  let db = null; let nrow = 0;
  const openDb = async () => {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  };
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `u${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  let lastSrvPc = {};
  const serverSigs = async (doc, only) => {
    const out = {}; lastSrvPc = {};
    for (const dm of [false, true]) {
      const { deltas } = V.settings(doc, dm);
      for (const [k, d] of Object.entries(deltas)) if (k !== 'g:111' && (!only || only.includes(k))) { const page = await server(doc, dm, V.write(d)); const key = `${dm ? 'dm' : 'off'}|${k}`; out[key] = sigOf(page); const pc = pcOf(page); if (pc) lastSrvPc[key] = pc; }
    }
    return out;
  };
  const meta = { SIG_VERSION, mode: MODE, shard: SHARD, src: SRC, started: new Date().toISOString() };
  const out = { meta, births: [], rejected: {}, audit: [] };

  if (MODE === 'pool') {
    const SIZES = (process.env.RV9_POOL_SIZES || 'village,town,city,metropolis').split(',');
    const TARGET = Number(process.env.RV9_TARGET || 300); const per = Math.ceil(TARGET / SHARD[1]);
    const AUDIT = Number(process.env.RV9_AUDIT || 50); const SS = Number(process.env.RV9_SERVER_SAMPLE || 0);
    if (SS) await openDb();
    let nrej = 0;
    for (const size of SIZES) {
      const t0 = Date.now(); let got = 0; let tried = 0;
      for (let k = SHARD[0]; got < per && k < 400 * TARGET; k += SHARD[1]) {
        const crisis = CRISES[k % CRISES.length]; const seed = `t2p-${size}-${crisis}-${k}`; tried += 1;
        const b = bornOrNull(size, crisis, seed, true);
        if (b.rejectedAt) {
          nrej += 1; (out.rejected[size] ||= { n: 0, at: {} }).n += 1; out.rejected[size].at[b.rejectedAt] = (out.rejected[size].at[b.rejectedAt] || 0) + 1;
          if (AUDIT && nrej % AUDIT === 0) { const full = bornOrNull(size, crisis, seed, false); out.audit.push({ seed, rejectedAt: b.rejectedAt, finalHasHouse: (full.doc.institutions || []).some((h) => E.isHideableHouse(h)) }); }
          continue;
        }
        if ((b.doc.institutions || []).some((h) => E.isHideableHouse(h))) throw new Error(`accepted birth holds a hideable house: ${seed}`);
        got += 1;
        const rec = { seed, size, crisis, k, dial: b.dial, sigs: twinSigs(b.doc), pc: lastPc };
        const inc = (b.doc.economicState?.incomeSources || []).filter(isRec); rec.incSum = inc.length ? Math.round(inc.reduce((a, x) => a + (Number(x.percentage) || 0), 0) * 100) / 100 : null;
        if (SS && got % SS === 0) rec.srv = await serverSigs(b.doc, ['own', 'off']);
        out.births.push(rec);
      }
      (out.cost ||= {})[size] = { tried, accepted: got, ms: Date.now() - t0 };
    }
  } else if (MODE === 'reread') {
    const SS = Number(process.env.RV9_SERVER_SAMPLE || 0); if (SS) await openDb();
    const from = readdirSync(process.env.RV9_FROM_DIR).filter((f) => /^pool-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${process.env.RV9_FROM_DIR}/${f}`, 'utf8')));
    let i = 0; const t0 = {};
    for (const sh of from) for (const c of sh.births) {
      i += 1; if (i % SHARD[1] !== SHARD[0]) continue;
      const s0 = Date.now(); const b = bornOrNull(c.size, c.crisis, c.seed, false);
      if ((b.doc.institutions || []).some((h) => E.isHideableHouse(h))) throw new Error(`cached nothing-hidden birth holds a hideable house: ${c.seed}`);
      const rec = { seed: c.seed, size: c.size, crisis: c.crisis, k: c.k, dial: b.dial, sigs: twinSigs(b.doc), pc: lastPc };
      if (SS && i % SS === 0) rec.srv = await serverSigs(b.doc, ['own', 'off']);
      out.births.push(rec); t0[c.size] = (t0[c.size] || 0) + Date.now() - s0;
    }
    out.cost = Object.fromEntries(Object.entries(t0).map(([s, ms]) => [s, { ms, accepted: out.births.filter((x) => x.size === s).length }]));
  } else if (MODE === 'poolb') {
    const SIZES = (process.env.RV9_POOL_SIZES || 'village,town,city,metropolis').split(',');
    const TARGET = Number(process.env.RV9_TARGET || 150); const per = Math.ceil(TARGET / SHARD[1]);
    for (const size of SIZES) {
      const t0 = Date.now(); let got = 0; let tried = 0;
      for (let k = SHARD[0]; got < per && k < 400 * TARGET; k += SHARD[1]) {
        const crisis = CRISES[k % CRISES.length]; const seed = `t2b-${size}-${crisis}-${k}`; tried += 1;
        const b = bornOrNull(size, crisis, seed, false);
        const held = (b.doc.institutions || []).filter((h) => E.isHideableHouse(h));
        if (!held.length) continue;
        got += 1;
        out.births.push({ seed, size, crisis, k, dial: b.dial, held: held.map((h) => h.name), sigs: twinSigs(b.doc, showAll), pc: lastPc });
      }
      (out.cost ||= {})[size] = { tried, accepted: got, ms: Date.now() - t0 };
    }
  } else if (MODE === 'towns') {
    await openDb();
    const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
    for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
      if (ONLY && !ONLY.has(b.seed)) continue;
      const A = E.birth(b.cfg, b.seed, null);
      const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
      const rec = { seed: b.seed, size: b.size, crisis: b.crisis, dial: E.state.dial, hidden, sigs: twinSigs(A), pc: lastPc };
      if (hidden.length || process.env.RV9_CONTROL_SERVER === '1') { rec.srv = await serverSigs(A, null); rec.srvPc = lastSrvPc; }
      out.births.push(rec);
    }
  } else if (MODE === 'verify') {
    const dir = process.env.RV9_POOL_DIR; const STRIDE = Number(process.env.RV9_VERIFY || 10);
    const shards = readdirSync(dir).filter((f) => /^poolb?-shard\d+\.json$/.test(f)).sort().map((f) => ({ b: f.startsWith('poolb'), ...JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) }));
    let i = 0;
    for (const sh of shards) for (const c of sh.births) {
      i += 1; if (i % STRIDE !== 0 || (i / STRIDE) % SHARD[1] !== SHARD[0]) continue;
      const b = bornOrNull(c.size, c.crisis, c.seed, false);
      const now = twinSigs(b.doc, sh.b ? showAll : allSettings);
      const diff = Object.keys(c.sigs).filter((k) => sh.sigs[c.sigs[k]] !== [...SIGS.keys()][now[k]]);
      out.births.push({ seed: c.seed, size: c.size, same: !diff.length, diff });
    }
  } else if (MODE === 'stored') {
    const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
    const ROLES = new Set((process.env.RV9_ROLES || 'A,B,T').split(','));
    const SS = Number(process.env.RV9_SERVER_SAMPLE ?? 10); const EXTRA = process.env.RV9_EXTRA !== '0'; const SERVER = process.env.RV9_SERVER !== '0';
    const LIMIT = Number(process.env.RV9_LIMIT || 0);
    const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
      .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
    if (SERVER) await openDb();
    const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
    const REG = await import(`${SRC}/src/domain/veil/rosterChoiceRegistry.js`);
    const PR = await import(`${SRC}/src/domain/veil/pageRederive.js`);
    const IR = await import(`${SRC}/src/domain/veil/importRederive.js`);
    const arr = (v) => (Array.isArray(v) ? v : []); const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
    const READER = '22222222-2222-2222-2222-222222222222';
    // ── the plant's judgment (galleryVeilRecent.pglite.test.js), restated
    const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
    const withheldOf = (stored, d) => {
      const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v))); const o = new Set();
      for (const f of listsOf(stored)) { const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v); if (!names.length || names.some((n) => served.has(n))) continue;
        for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) o.add(v); }
      return [...o];
    };
    const withheldAllOf = (stored, d) => { const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
      return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])]; };
    const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap((f) => [f.faction, f.name]), ...arr(d?.institutions).filter(isRec).map((h) => h.name)].filter((v) => typeof v === 'string' && v))];
    /** namesWithheld(text, withheld, d) of the plant, its searches built once per read. */
    const namerOf = (withheld, d) => {
      const words = withheld.filter((t) => !/^\d+$/.test(t)); const opens = servedNamesOf(d);
      const bare = buildNameSearch(words, []); const search = buildNameSearch(words, opens);
      return (text) => {
        if (typeof text !== 'string' || text === '') return false; if (withheld.includes(text)) return true;
        if (!bare || !bare.hit(text)) return false; if (search && search.hit(text)) return true;
        const holders = opens.filter((n) => text.includes(n) && bare.hit(n));
        return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));
      };
    };
    const walk = (v, keys = new Set(), strs = []) => { if (typeof v === 'string') strs.push(v); else if (Array.isArray(v)) for (const x of v) walk(x, keys, strs); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { keys.add(k); walk(x, keys, strs); } return { keys, strs }; };
    const absenceFaults = (want, d) => { const o = []; const { keys, strs } = walk(d);
      if (keys.has('recentConflict')) o.push('serves a recentConflict key');
      if (typeof want === 'string' && want !== '' && strs.some((x) => x.includes(want))) o.push('serves the stored sentence (or a string holding it)');
      if (isRec(d) && Object.prototype.hasOwnProperty.call(d, 'pressureSentence') && d.pressureSentence === want) o.push('serves the pressureSentence copy');
      return o; };
    const sentenceOf = (d) => (isRec(d?.powerStructure) && typeof d.powerStructure.recentConflict === 'string' ? d.powerStructure.recentConflict : null);
    const pageSentence = (door, d) => (isRec(d) ? sentenceOf(door === 'page' ? PR.rederiveForPage(clone(d)) : IR.rederiveServed(clone(d))) : null);
    const hidesAnyD = (t) => arr(t.institutions).some((h) => isRec(h) && E.isHideableHouse(h)) || listsOf(t).some((f) => f.hidden === true);
    const neverOf = (t, wh) => { const n = clone(t); n.institutions = arr(n.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
      const keep = (f) => !(isRec(f) && [f.faction, f.name].some((x) => typeof x === 'string' && wh.includes(x)));
      if (isRec(n.powerStructure)) n.powerStructure.factions = arr(n.powerStructure.factions).filter(keep); if (Array.isArray(n.factions)) n.factions = n.factions.filter(keep); return n; };
    /** The server's two doors of one read: the gallery page (anonymous) and the import (READER). */
    const serverDoors = async (rec, dm, ov) => {
      nrow += 1; const id = `abcd7f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `u${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
      const page = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
      await db.query(`select set_config('test.uid', $1, false)`, [READER]);
      let imp = null; try { imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d; } catch (e) { imp = { __error: String(e.message || e) }; }
      await db.query(`select set_config('test.uid', '', false)`);
      await db.query('delete from public.settlements where id = $1', [id]);
      return { page: isRec(page) ? page : null, import: isRec(imp) && !imp.__error ? imp : null, importError: imp?.__error || null };
    };
    // ── (2) THE DIFFERENTIAL, own, Reveal off and on
    const differential = async (t) => {
      const r = { hiding: 0, reads: 0, equal: 0, faults: [] };
      if (!SERVER || !hidesAnyD(t)) return r;
      for (const dm of [false, true]) {
        const ov = V.write(V.opened(OPEN));
        const got = { server: await serverDoors(t, dm, ov), twin: null }; const tw = V.twin(t, dm, ov); got.twin = { page: tw, import: tw };
        const wh = withheldAllOf(t, got.twin.page); const whS = isRec(got.server.page) ? withheldAllOf(t, got.server.page) : null;
        if (canon([...wh].sort()) !== canon([...(whS || [])].sort())) r.faults.push(`dm=${dm}: server and twin withhold differently: ${JSON.stringify(whS)} | ${JSON.stringify(wh)}`);
        if (!wh.length) continue;
        r.hiding += 1;
        const never = neverOf(t, wh);
        const ng = { server: await serverDoors(never, dm, ov) }; const nt = V.twin(never, dm, ov); ng.twin = { page: nt, import: nt };
        const at2 = {};
        for (const eng of ['server', 'twin']) for (const door of ['page', 'import']) {
          const d = got[eng][door]; const n = ng[eng][door];
          if (!isRec(d) || !isRec(n)) { r.faults.push(`${eng} ${door} dm=${dm}: no document${got[eng].importError ? ` (${got[eng].importError.slice(0, 80)})` : ''}`); continue; }
          r.reads += 1;
          for (const f of absenceFaults(t.powerStructure?.recentConflict, d)) r.faults.push(`${eng} ${door} dm=${dm}: the served payload ${f}`);
          const ph = pageSentence(door, d); const pn = pageSentence(door, n); at2[`${eng} ${door}`] = ph;
          if (ph === null) r.faults.push(`${eng} ${door} dm=${dm}: the page drew no sentence`);
          else if (ph === pn) r.equal += 1;
          else r.faults.push(`${eng} ${door} dm=${dm}: hiding ${JSON.stringify(ph).slice(0, 110)} | never there ${JSON.stringify(pn).slice(0, 110)}`);
          if (namerOf(wh, d)(ph)) r.faults.push(`${eng} ${door} dm=${dm}: the page's sentence names a withheld power or house ${JSON.stringify(wh)}: ${JSON.stringify(ph).slice(0, 140)}`);
        }
        for (const door of ['page', 'import']) if (at2[`server ${door}`] !== at2[`twin ${door}`]) r.faults.push(`${door} dm=${dm}: server ${JSON.stringify(at2[`server ${door}`]).slice(0, 100)} | twin ${JSON.stringify(at2[`twin ${door}`]).slice(0, 100)}`);
      }
      return r;
    };
    // ── (3) THE TELLS, per registry row
    const ROWS = REG.REGISTRY_ROWS.filter((x) => typeof x.path === 'string' && x.path).map((x) => ({ id: x.id, re: new RegExp(x.path) }));
    const CRIME = new RegExp(REG.CRIME_NAME_PATTERN.source, REG.CRIME_NAME_PATTERN.flags);
    const rowCache = new Map();
    const rowOf = (np) => {
      if (rowCache.has(np)) return rowCache.get(np);
      const segs = np.split(/(?=\.)|(?=\[\])/); let id = null;
      for (let n = segs.length; n > 0 && !id; n -= 1) { const p = segs.slice(0, n).join(''); const hit = ROWS.find((x) => x.re.test(p)); if (hit) id = hit.id; }
      id ||= `(unregistered) ${segs.slice(0, 2).join('')}`; rowCache.set(np, id); return id;
    };
    const tellsOf = (t) => {
      const T = {};
      const add = (row, kind, ex) => { const o = (T[row] ||= { name: 0, kind: 0, key: 0, ex: {} }); o[kind] += 1; o.ex[kind] ||= ex; };
      for (const dm of [false, true]) {
        const { deltas } = V.settings(t, dm);
        for (const [k, d] of Object.entries(deltas)) {
          if (k === 'g:111') continue;
          const ov = V.write(d); const page = V.twin(t, dm, ov); const wh = withheldAllOf(t, page); if (!wh.length) continue;
          const np = V.twin(neverOf(t, wh), dm, ov); const nl = leaves(np); const nKeys = new Set(); const nCrime = new Set();
          for (const [p, v] of nl) { const q = norm(p); nKeys.add(q); if (v[0] === '"' && CRIME.test(JSON.parse(v))) nCrime.add(q); }
          const named = namerOf(wh, page); const tag = `${dm ? 'dm' : 'off'}|${k}`; const seenRow = new Set();
          for (const [p, v] of leaves(page)) {
            const q = norm(p); const row = rowOf(q);
            if (v[0] === '"') { const s = JSON.parse(v);
              if (named(s)) { if (!seenRow.has(`n${row}`)) { seenRow.add(`n${row}`); add(row, 'name', `${tag} ${p}: ${s.slice(0, 120)} (withheld ${JSON.stringify(wh).slice(0, 80)})`); } }
              else if (CRIME.test(s) && !nCrime.has(q) && !seenRow.has(`c${row}`)) { seenRow.add(`c${row}`); add(row, 'kind', `${tag} ${p}: ${s.slice(0, 120)}`); } }
            if (!nKeys.has(q) && !seenRow.has(`k${row}`)) { seenRow.add(`k${row}`); add(row, 'key', `${tag} ${p} = ${v.slice(0, 80)}`); }
          }
        }
      }
      return T;
    };
    // ── (4) THE READERS on a nothing-hidden read (Reveal off; a holding place under showAll's own)
    const get = (o, path) => path.split('.').reduce((a, k) => (isRec(a) ? a[k] : undefined), o);
    const FIELDS = [...PR.PAGE_DRAWN_SCORES.map((k) => `defenseProfile.scores.${k}`), 'defenseProfile.readiness.score', 'defenseProfile.economicGates', 'economicState.compound.economyOutput'];
    const stateOf = (rec, served, re) => (served !== undefined ? 'served' : re === undefined && rec === undefined ? 'none' : re === undefined ? 'notDrawn' : rec === undefined ? 'recordLacks' : canon(re) === canon(rec) ? 'equal' : 'differ');
    const readersOf = (t) => {
      const held = arr(t.institutions).some((h) => isRec(h) && E.isHideableHouse(h));
      const d = held ? showAll(t, false).own : V.opened(OPEN); const page = V.twin(t, false, V.write(d));
      const wh = withheldAllOf(t, page); const o = { hidesNothing: !wh.length, f: {} };
      const put = (f, rec, served, re) => { o.f[f] = { s: stateOf(rec, served, re), ...(stateOf(rec, served, re) === 'differ' ? { rec: JSON.stringify(rec).slice(0, 160), re: JSON.stringify(re).slice(0, 160) } : {}) }; };
      const r = PR.rederiveForPage(clone(page));
      for (const f of FIELDS) put(f, get(t, f), get(page, f), get(r, f));
      const ru = PR.rederiveForPage(clone(page), { unveiled: true }); const bf = 'economicState.safetyProfile.blackMarketCapture';
      put(`${bf} (unveiled)`, get(t, bf), get(page, bf), get(ru, bf));
      const cf = 'economicState.safetyProfile.crimeTypes'; put(`${cf} (rederiveCrimeTypes, authoritative)`, get(t, cf), undefined, get(PR.rederiveCrimeTypes(clone(page), { authoritative: true }), cf));
      const rf = 'powerStructure.recentConflict'; put(`${rf} (rederiveRecentConflict, authoritative)`, get(t, rf), undefined, get(PR.rederiveRecentConflict(clone(page), { authoritative: true }), rf));
      const sc = arr(t.activeConditions); const pc2 = arr(r.activeConditions); const keyOf = (c) => (isRec(c) ? String(c.id ?? c.name ?? c.type ?? '') : '');
      let n = 0; let eq = 0; let ex = null;
      for (const c of arr(page.activeConditions)) { if (!isRec(c) || 'severity' in c) continue; const rc = pc2.find((x) => keyOf(x) === keyOf(c)); const st = sc.find((x) => keyOf(x) === keyOf(c));
        if (!rc || !st || !('severity' in st)) continue; n += 1; if (rc.severity === st.severity) eq += 1; else ex ||= `${keyOf(c)}: record ${st.severity} | re-derived ${rc.severity} (band ${c.severityBand})`; }
      o.f['activeConditions[].severity'] = { n, eq, ...(ex ? { ex } : {}) };
      return o;
    };
    const parts = { pool: [], poolb: [], towns: [], extra: [] };
    let i = 0;
    for (const m of index) {
      if (!ROLES.has(m.role)) continue; i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && i > LIMIT * SHARD[1]) break;
      const doc = JSON.parse(readFileSync(`${DIR}/${m.seed}.json`, 'utf8'));
      const held = arr(doc.institutions).filter((h) => isRec(h) && E.isHideableHouse(h)).map((h) => h.name);
      const base = { seed: m.seed, size: m.size, crisis: m.crisis, k: m.k, dial: m.dial, role: m.role };
      if (m.role === 'T') { const rec = { ...base, hidden: held, sigs: twinSigs(doc), pc: lastPc }; if (SERVER && (held.length || process.env.RV9_CONTROL_SERVER === '1')) { rec.srv = await serverSigs(doc, null); rec.srvPc = lastSrvPc; } parts.towns.push(rec); }
      else if (!held.length) { const rec = { ...base, sigs: twinSigs(doc), pc: lastPc }; if (SERVER && SS && (parts.pool.length + 1) % SS === 0) rec.srv = await serverSigs(doc, ['own', 'off']); parts.pool.push(rec); }
      else parts.poolb.push({ ...base, held, sigs: twinSigs(doc, showAll), pc: lastPc });
      if (EXTRA) parts.extra.push({ ...base, held, ownerHidden: listsOf(doc).filter((f) => f.hidden === true).length, hasPublicProse: 'publicProse' in doc, diff: await differential(doc), tells: tellsOf(doc), readers: readersOf(doc) });
    }
    meta.dir = DIR; meta.ended = new Date().toISOString();
    for (const [k, list] of Object.entries(parts)) writeFileSync(`${OUTD}/${k}-shard${SHARD[0]}.json`, JSON.stringify({ meta, births: list, sigs: k === 'extra' ? [] : [...SIGS.keys()] }));
  }
  if (db) await db.end();
  out.sigs = [...SIGS.keys()];
  meta.ended = new Date().toISOString();
  if (MODE !== 'stored') writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
