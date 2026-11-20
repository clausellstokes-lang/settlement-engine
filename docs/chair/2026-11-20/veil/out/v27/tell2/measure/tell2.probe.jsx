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
//   verify  THE CACHE STILL HOLDS: every RV9_VERIFY-th cached pool birth re-born and re-read on this tree; its signatures
//           compared with the cache's (for the cure's runs, which reuse the cache).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, CRISES } from '../../tell/measure/tell-common.mjs';
import { signatureOf, SIG_VERSION } from './tell2-signature.mjs';
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
  const SIGS = new Map(); const sigIx = (s) => { if (!SIGS.has(s)) SIGS.set(s, SIGS.size); return SIGS.get(s); };
  const sigOf = (page) => sigIx(signatureOf(page, E.isHideableHouse).sig);
  /** Every setting's twin signature, Reveal off and on: { 'off|own': ix, ... }. */
  const twinSigs = (doc) => {
    const out = {};
    for (const dm of [false, true]) {
      const { deltas } = V.settings(doc, dm);
      for (const [k, d] of Object.entries(deltas)) if (k !== 'g:111') out[`${dm ? 'dm' : 'off'}|${k}`] = sigOf(V.twin(doc, dm, V.write(d)));
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
  const serverSigs = async (doc, only) => {
    const out = {};
    for (const dm of [false, true]) {
      const { deltas } = V.settings(doc, dm);
      for (const [k, d] of Object.entries(deltas)) if (k !== 'g:111' && (!only || only.includes(k))) out[`${dm ? 'dm' : 'off'}|${k}`] = sigOf(await server(doc, dm, V.write(d)));
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
        const rec = { seed, size, crisis, k, dial: b.dial, sigs: twinSigs(b.doc) };
        const inc = (b.doc.economicState?.incomeSources || []).filter(isRec); rec.incSum = inc.length ? Math.round(inc.reduce((a, x) => a + (Number(x.percentage) || 0), 0) * 100) / 100 : null;
        if (SS && got % SS === 0) rec.srv = await serverSigs(b.doc, ['own', 'off']);
        out.births.push(rec);
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
      const rec = { seed: b.seed, size: b.size, crisis: b.crisis, dial: E.state.dial, hidden, sigs: twinSigs(A) };
      if (hidden.length || process.env.RV9_CONTROL_SERVER === '1') rec.srv = await serverSigs(A, null);
      out.births.push(rec);
    }
  } else if (MODE === 'verify') {
    const dir = process.env.RV9_POOL_DIR; const STRIDE = Number(process.env.RV9_VERIFY || 10);
    const shards = readdirSync(dir).filter((f) => /^pool-shard\d+\.json$/.test(f)).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
    let i = 0;
    for (const sh of shards) for (const c of sh.births) {
      i += 1; if (i % STRIDE !== 0 || (i / STRIDE) % SHARD[1] !== SHARD[0]) continue;
      const b = bornOrNull(c.size, c.crisis, c.seed, false);
      const now = twinSigs(b.doc);
      const diff = Object.keys(c.sigs).filter((k) => sh.sigs[c.sigs[k]] !== [...SIGS.keys()][now[k]]);
      out.births.push({ seed: c.seed, size: c.size, same: !diff.length, diff });
    }
  }
  if (db) await db.end();
  out.sigs = [...SIGS.keys()];
  meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
