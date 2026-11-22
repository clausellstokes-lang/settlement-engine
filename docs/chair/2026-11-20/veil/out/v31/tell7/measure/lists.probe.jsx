// R3-TELL-7 unit (vii) STEP 1 (VEIL-31's builder; ruling 81): THE SAFETY PROFILE'S LISTS, SERVED AGAINST THE HOUSE-FREE TWIN'S.
// Extends out/v31/twins/twins.probe.jsx (VEIL-31's twin measure) onto the R3 gate's own births and readings
// (out/v27/tell/measure/tell-common.mjs: the gate's 140 births byte for byte, its settings; tell2.probe.jsx's server read).
// Per birth that holds a hideable house (the 92): A as born; B the house-free twin (every hideable house cut from
// ctx.institutions and ctx.settlement.institutions after EVERY step: ruling 30's acceptance, the R3 gate's own birth). Each read
// under EVERY gated setting of the gate (own, g:000..g:110, allOpen, off; computed on each document as the gate computes it),
// Reveal off and DM: A by the SERVER (get_gallery_dossier on RV9_SERVER_TPL) and by the TWIN (projectShareVeil); B by both.
// Per page the safety profile's three lists (safetyProfile.js returns no other list): crimeTypes (by type), criminalInstitutions
// (sp.ops), plotHooks; '#absent' where the key is not served. Per town the STORED lists and the readings the causes need (A's and
// B's safety label, ratio, compound effectives). No line of 212 or the twin. LOCAL cluster only. Out: compact JSON (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);

it('R3-TELL-7 step 1: the safety lists against the twin', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd77${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s7${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const spOf = (d) => (isRec(d?.economicState?.safetyProfile) ? d.economicState.safetyProfile : null);
  const has = (o, k) => isRec(o) && Object.prototype.hasOwnProperty.call(o, k);
  /** The three lists of a page: an array of strings, or '#absent' / '#nosp' / '#notarray'. */
  const lists = (d) => {
    const sp = spOf(d); if (!sp) return { crimeTypes: '#nosp', ops: '#nosp', plotHooks: '#nosp' };
    const L = (k, f) => (!has(sp, k) ? '#absent' : Array.isArray(sp[k]) ? sp[k].map(f) : '#notarray');
    return { crimeTypes: L('crimeTypes', (c) => (isRec(c) ? String(c.type) : `#${typeof c}`)), ops: L('criminalInstitutions', (x) => String(x)), plotHooks: L('plotHooks', (x) => String(x)) };
  };
  const readings = (d) => {
    const sp = spOf(d) || {}; const c = isRec(sp.compound) ? sp.compound : {};
    return { label: sp.safetyLabel ?? null, ratio: sp.safetyRatio ?? null, crimEff: c.criminalEffective ?? null, milEff: c.militaryEffective ?? null,
      inst: isRec(c.inst) ? Object.fromEntries(['hasCriminalInst', 'hasSmuggling', 'hasThievesGuild', 'hasGangInfra', 'hasMarket', 'hasMagicInst', 'hasMilitaryInst', 'hasCourtSystem', 'hasPrison', 'hasCharterHall'].map((k) => [k, c.inst[k] ?? null])) : null,
      crimeDescs: Array.isArray(sp.crimeTypes) ? sp.crimeTypes.filter(isRec).map((x) => [x.type, x.desc]) : null,
      houses: (d?.institutions || []).filter(isRec).map((h) => `${h.name}|${h.category ?? ''}|${E.isHideableHouse(h) ? 'H' : ''}`) };
  };
  const out = { meta: { src: SRC, shard: SHARD, started: new Date().toISOString() }, towns: [] };
  const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null);
    const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
    if (!hidden.length) continue;
    const B = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden, storedA: lists(A), storedB: lists(B), readA: readings(A), readB: readings(B),
      bHolds: (B.institutions || []).filter((h) => E.isHideableHouse(h)).length, pages: {} };
    for (const dm of [false, true]) {
      const sa = V.settings(A, dm).deltas; const sb = V.settings(B, dm).deltas;
      for (const k of Object.keys(sa)) {
        if (k === 'g:111') continue;
        const oa = V.write(sa[k]); const ob = V.write(sb[k]);
        rec.pages[`${dm ? 'dm' : 'off'}|${k}`] = {
          srvA: lists(await server(clone(A), dm, oa)), twA: lists(V.twin(A, dm, oa)),
          srvB: lists(await server(clone(B), dm, ob)), twB: lists(V.twin(B, dm, ob)),
        };
      }
    }
    out.towns.push(rec);
  }
  await db.end();
  out.meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
