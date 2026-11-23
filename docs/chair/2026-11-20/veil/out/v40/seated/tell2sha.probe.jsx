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
//   verify  THE CACHE STILL HOLDS: every RV9_VERIFY-th cached pool birth re-born and re-read on this tree; its signatures
//           compared with the cache's (for the cure's runs, which reuse the cache).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, CRISES, OPEN } from '../../v27/tell/measure/tell-common.mjs';
import { namesOf } from '../../v27/tell/measure/tell-surface.mjs';
import { signatureOf, SIG_VERSION } from '../../v27/tell2/measure/tell2-signature.mjs';
// VEIL-40 ruling 114 (the copy's addition): with RV9_SHAS=<dir>, each read that has BOTH a server page and a twin page
// for one (seed, setting, Reveal) appends `seed\tdoor\tsetting\treveal\tserverSha\ttwinSha` to <dir>/shas-<shard>.tsv
// (sha256 of the canonical JSON: object keys sorted recursively, arrays in order), and the first 50 differing pairs of
// the shard are kept whole in <dir>/diff-<shard>-<n>.json. Unset, the probe's output is the original's.
import { appendFileSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
  // ── ruling 114's shas (RV9_SHAS only): the twin's pages of the birth last read (twinSigs), paired at the server's read.
  const SHAS = process.env.RV9_SHAS || ''; const SHA_KEEP = 50;
  let shaSeed = null; let shaTwinDoc = null; let shaTwin = new Map(); let shaKept = 0;
  if (SHAS) {
    mkdirSync(SHAS, { recursive: true }); writeFileSync(`${SHAS}/shas-${SHARD[0]}.tsv`, '');
    for (const f of readdirSync(SHAS)) if (new RegExp(`^diff-${SHARD[0]}-\\d+\\.json$`).test(f)) rmSync(`${SHAS}/${f}`);
  }
  const canonOf = (v) => {
    if (v && typeof v.toJSON === 'function') v = v.toJSON();
    if (Array.isArray(v)) return v.map(canonOf);
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canonOf(v[k]); return o; }
    return v;
  };
  const shaOf = (s) => createHash('sha256').update(s).digest('hex');
  const shaTwinPut = (doc, key, page) => { if (shaTwinDoc !== doc) { shaTwinDoc = doc; shaTwin = new Map(); } shaTwin.set(key, page == null ? null : JSON.stringify(canonOf(page))); };
  const shaPair = (doc, key, page) => {
    const tw = doc === shaTwinDoc ? shaTwin.get(key) : null; if (tw == null || page == null) return;
    const sv = JSON.stringify(canonOf(page)); const reveal = key.slice(0, key.indexOf('|')); const setting = key.slice(key.indexOf('|') + 1);
    const ss = shaOf(sv); const ts = shaOf(tw);
    appendFileSync(`${SHAS}/shas-${SHARD[0]}.tsv`, `${shaSeed}\tgallery\t${setting}\t${reveal}\t${ss}\t${ts}\n`);
    if (ss !== ts && shaKept < SHA_KEEP) { shaKept += 1; writeFileSync(`${SHAS}/diff-${SHARD[0]}-${shaKept}.json`, JSON.stringify({ seed: shaSeed, setting, reveal, server: JSON.parse(sv), twin: JSON.parse(tw) })); }
  };
  /** Every setting's twin signature, Reveal off and on: sigs { 'off|own': ix, ... } and pc { key: 'rows/gov' }. */
  let lastPc = {};
  const twinSigs = (doc, setsOf = allSettings) => {
    const out = {}; lastPc = {};
    for (const dm of [false, true]) {
      for (const [k, d] of Object.entries(setsOf(doc, dm))) if (k !== 'g:111') { const page = V.twin(doc, dm, V.write(d)); const key = `${dm ? 'dm' : 'off'}|${k}`; if (SHAS) shaTwinPut(doc, key, page); out[key] = sigOf(page); const pc = pcOf(page); if (pc) lastPc[key] = pc; }
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
      for (const [k, d] of Object.entries(deltas)) if (k !== 'g:111' && (!only || only.includes(k))) { const page = await server(doc, dm, V.write(d)); const key = `${dm ? 'dm' : 'off'}|${k}`; if (SHAS) shaPair(doc, key, page); out[key] = sigOf(page); const pc = pcOf(page); if (pc) lastSrvPc[key] = pc; }
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
        if (SHAS) shaSeed = rec.seed;
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
      if (SHAS) shaSeed = rec.seed;
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
      if (SHAS) shaSeed = rec.seed;
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
  }
  if (db) await db.end();
  out.sigs = [...SIGS.keys()];
  meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
