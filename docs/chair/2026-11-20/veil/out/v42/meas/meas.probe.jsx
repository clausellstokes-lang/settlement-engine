// R4I-MEASURE (VEIL-42, chain B; brief docs/chair/2026-11-20/veil/briefs/R4I-MEASURE-BRIEF.md): THE THREE MEASURES' ONE PROBE.
// A MEASURE ONLY: no line of src, supabase or tests is changed; every engine is read at RV6_SRC by absolute path.
// Per document (a birth of RV6_SRC's engine, a stored document, or criminalSwitchHandReach's six towns in both shapes),
// per Reveal DM off/on, per setting (M's: the default marker writeShareVeil({}, []), every family the tell probe reads but
// g:111, and UNMARKED {}), ONE server row (the scratch PG16 database copied from RV9_SERVER_TPL) read by each door:
//   gallery  get_gallery_dossier (its `data` and served marker; the whole row for L2)
//   link     get_unlisted_dossier (`dossier`, `gallery_member_overrides`)
//   import   import_gallery_dossier's `data` (test.uid = a premium reader) — NO TWIN (named, not invented)
//   map      get_gallery_map's member `settlement` (a map_with_campaign row naming the settlement) — NO TWIN (named)
// and the twins: gallery = galleryVeil.js :: projectShareVeil(galleryPayloadFor(rec, { shareDm, memberOverrides: ov }), ov)
// (applyVeil on every marked setting, as the server-veil tests call it); link = linkTwin.shared.mjs :: linkTwinOf, its
// definition copied verbatim below (the tip has no such file; the -wip's is imported and must agree: `linkTwinSame`).
// THE COMPARISONS (MEAS_BIJ=1, A: modulo the bijection; MEAS_BIJ=0, B: value for value):
//   L1 gallery: served `data` vs the gallery twin; L1 link: served `dossier` vs the link twin;
//   L2 gallery (M's level, tonight-names.probe.jsx byte for byte): both rows through the client's fetchPublicDossier, the
//      twin row with a FIXED salt (crypto.randomUUID stubbed), the server row as served.
//   With MEAS_BIJ=1 each pair is compared twice: canonPeople on both sides (M's instrument), and ALIGNED (an independent
//   instrument: the two documents walked in parallel, a value that is a person/tie id of its side's walk mapped to the
//   other side's value at the same path, the map a bijection, every other byte exact; no order of first appearance).
// THE STORED-ID SEARCH (MEAS_C=1, C): personIdBijection.shared.mjs :: storedIdsServed([body, marker], document) on every
//   door's served body and both twins; each hit by normalised path, door, engine, with one example.
// Out: MEAS_OUT (one JSON a shard), rewritten after every document.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const env = vi.hoisted(() => ({ row: null }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name) => (name === 'get_gallery_dossier' ? { data: [JSON.parse(JSON.stringify(env.row))], error: null } : { data: null, error: null }),
  };
  return { supabase, isConfigured: true, default: supabase };
});

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const str = (v) => (typeof v === 'string' ? v : '');
const SALT = 'r4it-known-salt-0f0f0f0f';
const BIJ = process.env.MEAS_BIJ !== '0';
const DO_C = process.env.MEAS_C === '1';
const DOORS = new Set((process.env.MEAS_DOORS || 'gallery,link,import,map').split(','));
const L2 = process.env.MEAS_L2 !== '0';
const cut = (v) => { const s = v === undefined ? 'undefined' : JSON.stringify(v); return s.length > 200 ? `${s.slice(0, 200)}…` : s; };
const cutS = (s) => (s === undefined ? '(absent)' : s.length > 200 ? `${s.slice(0, 200)}…` : s);
const norm = (p) => p.replace(/\[\d+\]/g, '[]');
const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));

/** Every leaf by exact path; an array also gives its length at `<path>#len`, an object its key set at `<path>#keys`. */
function leaves(v, p = '', out = new Map()) {
  if (Array.isArray(v)) { out.set(`${p}#len`, v.length); v.forEach((x, i) => leaves(x, `${p}[${i}]`, out)); }
  else if (isRec(v)) { const ks = Object.keys(v).sort(); out.set(`${p}#keys`, ks.join(',')); for (const k of ks) leaves(v[k], p ? `${p}.${k}` : k, out); }
  else out.set(p, JSON.stringify(v));
  return out;
}
/** Every exact path at which `a` and `b` differ: [path, aValue, bValue] (values as JSON text; `undefined` where absent). */
function diffDocs(a, b) {
  const A = leaves(a); const B = leaves(b); const out = [];
  for (const k of new Set([...A.keys(), ...B.keys()])) if (A.get(k) !== B.get(k)) out.push([k, A.get(k), B.get(k)]);
  return out;
}
/** THE ALIGNED INSTRUMENT: `a` and `b` walked in parallel; a value of `ia` (side a's re-keyed person/tie ids) at a path
 *  where `b` holds a value of `ib` is mapped, the map a bijection both ways; every other value exact. Returns the diffs. */
function alignDiff(a, b, ia, ib) {
  const ab = new Map(); const ba = new Map(); const out = [];
  const walk = (x, y, p) => {
    if (Array.isArray(x) && Array.isArray(y)) { if (x.length !== y.length) out.push([`${p}#len`, String(x.length), String(y.length)]); for (let i = 0; i < Math.min(x.length, y.length); i += 1) walk(x[i], y[i], `${p}[${i}]`); return; }
    if (isRec(x) && isRec(y)) {
      const kx = Object.keys(x).sort().join(','); const ky = Object.keys(y).sort().join(',');
      if (kx !== ky) out.push([`${p}#keys`, kx, ky]);
      for (const k of Object.keys(x)) if (k in y) walk(x[k], y[k], p ? `${p}.${k}` : k);
      return;
    }
    const xs = (typeof x === 'string' || typeof x === 'number') ? String(x) : null; const ys = (typeof y === 'string' || typeof y === 'number') ? String(y) : null;
    if (xs !== null && ys !== null && ia.has(xs) && ib.has(ys)) {
      if ((ab.has(xs) && ab.get(xs) !== ys) || (ba.has(ys) && ba.get(ys) !== xs)) out.push([`${p}@bijection`, `${xs}->${ab.get(xs) ?? '?'}`, `${ys}<-${ba.get(ys) ?? '?'}`]);
      else { ab.set(xs, ys); ba.set(ys, xs); }
      return;
    }
    if (JSON.stringify(x) !== JSON.stringify(y)) out.push([p, JSON.stringify(x), JSON.stringify(y)]);
  };
  walk(a, b, '');
  return out;
}

/** The re-key's own sites (personIdBijection.shared.mjs :: sites; 212 :: _gallery_veil_rekey), normalised. */
const SITES = new Set(['npcs[].id', 'powerStructure.factions[].members[].id', 'factions[].members[].id', 'npcs[].goal.intent.short.target.id',
  'npcs[].goal.intent.long.target.id', 'npcs[].allegiance.handler', ...['from', 'to', 'npc1Id', 'npc2Id', 'id'].map((k) => `relationships[].${k}`),
  ...['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId', 'id'].map((k) => `npcs[].relationships[].${k}`),
  ...['stress', 'stressors', 'stressors[]'].flatMap((c) => [`${c}.cast.roles[].id`, `${c}.cast.levers[].holderId`]),
  'simulationTrace[].targetId', 'simulationTrace[].downstreamEffects[].target']);

it('R4I-MEASURE: A (77), C (GAP), B (WHOLE-DOC)', async () => {
  const { loadEngine, loadVeil } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`).catch(() => import(`${process.env.MEAS_COMMON}`));
  const P = await import(`${process.env.MEAS_BIJ_MOD || `${SRC}/tests/security/personIdBijection.shared.mjs`}`);
  const { fetchPublicDossier } = await import(`${SRC}/src/lib/gallery.js`);
  const E = await loadEngine(SRC); const V = await loadVeil(SRC); const veil = V.veil;
  const { membershipsOf } = await import(`${SRC}/src/domain/people/membership.js`);
  // the link twin: linkTwin.shared.mjs's definition, verbatim but for the module it takes the veil from (RV6_SRC's)
  const linkHonoured = (overrides) => {
    if (!isRec(overrides)) return null;
    const out = {};
    for (const [k, v] of Object.entries(overrides)) {
      if (k === '$veil' || !isRec(v) || v.revealDm !== true) { out[k] = clone(v); continue; }
      const { revealDm, ...rest } = v; // eslint-disable-line no-unused-vars
      out[k] = rest;
    }
    return out;
  };
  const linkTwinOf = (stored, overrides, opts) => {
    const ov = isRec(overrides) ? overrides : null;
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: false, memberOverrides: linkHonoured(ov) });
    const { marked, deltas } = veil.readShareVeil(ov);
    return veil.applyVeil(pub, veil.resolveVeil(veil.defaultVeilFor(pub), marked ? deltas : []), opts);
  };
  let sharedLinkTwin = null;
  try { sharedLinkTwin = (await import(`${SRC}/tests/security/linkTwin.shared.mjs`)).linkTwinOf; } catch { sharedLinkTwin = null; }

  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  const SEEDS = process.env.MEAS_SEEDS ? new Set(process.env.MEAS_SEEDS.split(',')) : null;
  const SET = process.env.RV9_SET || 'towns';
  /** @type {Array<{ seed: string, shape?: string, doc: () => any }>} */
  let docs;
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  if (SET === 'towns') docs = E.pool(Number(process.env.RV9_N || 2), SHARD).map((b) => ({ seed: b.seed, doc: () => E.birth(b.cfg, b.seed, null) }));
  else if (SET === 'pool') {
    const dir = process.env.RV9_POOL_DIR;
    const files = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort();
    const all = files.flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    docs = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, doc: () => E.birth(cfgOf(b.size, b.crisis), b.seed, null) }));
  } else if (SET === 'stored') {
    const DIR = process.env.RV9_STORED_DIR;
    const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
      .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
    docs = index.filter((_j, i) => i % SHARD[1] === SHARD[0]).map((j) => ({ seed: j.seed, doc: () => JSON.parse(readFileSync(`${DIR}/${j.seed}.json`, 'utf8')) }));
  } else if (SET === 'handreach') {
    // criminalSwitchHandReach.pglite.test.js's six towns, born as it bears them, each in BOTH stored shapes (its
    // toMasterShape, copied verbatim): THE POSITIVE CONTROL's documents
    const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
    const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
    const TOWNS = [['v102-thorp-0', 'thorp'], ['v102-hamlet-6', 'hamlet'], ['v102-village-3', 'village'], ['v102-town-1', 'town'], ['v102-city-0', 'city'], ['v102-metropolis-1', 'metropolis']];
    const toMasterShape = (record) => {
      const out = structuredClone(record);
      if (Array.isArray(out.relationships)) out.relationships = out.relationships.map(({ from, to, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to }));
      for (const n of recs(out.npcs)) if (isRec(n.institution)) n.institution = str(n.institution.key) || str(n.institution.name);
      const powers = recs(out.powerStructure?.factions);
      for (const f of powers) delete f.members;
      out.factions = powers.map((f) => {
        const name = str(f.faction) || str(f.name);
        return { name, dominantCategory: f.category, members: recs(out.npcs).filter((n) => membershipsOf(n).some((m) => m.power === name)) };
      });
      return out;
    };
    const born = (seed, settType) => { const raw = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} }); return JSON.parse(JSON.stringify({ ...raw, publicProse: composePublicProse(raw) })); };
    docs = TOWNS.flatMap(([seed, t]) => ['current', 'master'].map((shape) => ({ seed: `${seed}|${shape}`, shape, doc: () => (shape === 'master' ? toMasterShape(born(seed, t)) : born(seed, t)) })))
      .filter((_d, i) => i % SHARD[1] === SHARD[0]);
  }
  if (SEEDS) docs = docs.filter((d) => SEEDS.has(d.seed));
  if (LIMIT) docs = docs.slice(0, LIMIT);

  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB || 'meas'}_${SHARD[0]}`;
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
  await db.query(`update public.profiles set role = 'developer' where id = $1`, [READER]);
  await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  /** One stored row, read once by each door. */
  const server = async (rec, dm, ov) => {
    nrow += 1;
    const id = `abcd4200-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `m${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const out = {};
    try {
      if (DOORS.has('gallery')) out.gallery = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
      if (DOORS.has('link')) out.link = (await db.query('select public.get_unlisted_dossier($1) x', [`${sl}l`])).rows[0]?.x ?? null;
      if (DOORS.has('import')) {
        await db.query(`select set_config('test.uid', $1, false)`, [READER]);
        try { out.import = (await db.query('select to_jsonb(g) r from public.import_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null; } finally { await db.query(`select set_config('test.uid', '', false)`); }
      }
      if (DOORS.has('map')) {
        const mid = `abcd4201-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`;
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign) values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true)`,
          [mid, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`]);
        const m = (await db.query('select public.get_gallery_map($1) x', [`${sl}m`])).rows[0]?.x;
        out.map = recs(m?.members)[0] ?? null;
        await db.query('delete from public.saved_maps where id = $1', [mid]);
      }
    } finally { await db.query('delete from public.settlements where id = $1', [id]); }
    return out;
  };
  const twinRow = (rec, dm, ov) => ({ id: 'abcd0000-0000-0000-0000-000000000001', public_slug: 'n1', name: rec.name || 'x', tier: rec.tier || 'town', published_at: null, view_count: 0, gallery_share_dm: dm, gallery_importable: true, data: clone(rec), gallery_member_overrides: clone(ov) });
  /** The client's own read of a row; with `fixed`, the read's salt is SALT (tonight-names.probe.jsx :: read). */
  const read = async (row, fixed) => {
    env.row = row;
    const spy = fixed && globalThis.crypto?.randomUUID ? vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => SALT) : null;
    try { const d = await fetchPublicDossier('n1'); return d?.settlement ? clone(d.settlement) : null; } finally { if (spy) spy.mockRestore(); }
  };
  const idsOf = (d) => new Set(BIJ ? [...P.canonPeople(d).names.keys()].map(String) : []);

  // the tally: per comparison `cmp` (e.g. 'L1 gallery'), per instrument: reads compared, reads differing, by normalised path
  const out = { src: SRC, set: SET, bij: BIJ, doors: [...DOORS], shard: SHARD, started: new Date().toISOString(), docs: 0, faults: [], linkTwinSame: { same: 0, differ: 0 },
    cmp: {}, c: { hits: {}, prose: {}, reads: {}, freshShaped: 0, docsWithStoredIds: 0, census: {} }, storedCmp: { same: 0, differ: 0, missing: 0 }, perDoc: [] };
  const tallyOf = (cmp, inst) => { const k = `${cmp} | ${inst}`; out.cmp[k] ||= { reads: 0, differ: 0, paths: {}, byTag: {} }; return out.cmp[k]; };
  const judge = (cmp, inst, tag, diffs, doc) => {
    const t = tallyOf(cmp, inst); t.reads += 1;
    if (!diffs.length) return false;
    t.differ += 1; t.byTag[tag.split('|').slice(1).join('|')] = (t.byTag[tag.split('|').slice(1).join('|')] || 0) + 1;
    const seen = new Set();
    for (const [p, x, y] of diffs) {
      const n = norm(p);
      const e = (t.paths[n] ||= { reads: 0, leaves: 0, example: null, docs: [] });
      e.leaves += 1;
      if (!seen.has(n)) { seen.add(n); e.reads += 1; if (e.docs.length < 12 && !e.docs.includes(doc)) e.docs.push(doc); }
      if (!e.example) e.example = { doc, tag, path: p, server: cutS(x), twin: cutS(y) };
    }
    return true;
  };
  const compare = (cmp, tag, doc, srv, tw, row) => {
    if (!isRec(srv) || !isRec(tw)) { out.faults.push(`${tag} ${cmp}: no ${!isRec(srv) ? 'server' : 'twin'} document`); return; }
    if (BIJ) {
      const cs = P.canonPeople(srv); const ct = P.canonPeople(tw);
      const d1 = J(cs.doc) === J(ct.doc) ? [] : diffDocs(cs.doc, ct.doc);
      const d2 = alignDiff(srv, tw, idsOf(srv), idsOf(tw));
      const a = judge(cmp, 'canon', tag, d1, doc); const b = judge(cmp, 'aligned', tag, d2, doc);
      if (a !== b) { row.instrumentSplit.push(`${cmp} ${tag}: canon ${a ? 'differs' : 'equal'}, aligned ${b ? 'differs' : 'equal'}`); }
      if (a) row.differ.push(`${cmp} ${tag}`);
    } else {
      const d = J(srv) === J(tw) ? [] : diffDocs(srv, tw);
      if (judge(cmp, 'exact', tag, d, doc)) row.differ.push(`${cmp} ${tag}`);
    }
  };
  const cHits = (door, engine, tag, doc, body, marker, stored) => {
    const k = `${door} | ${engine}`;
    out.c.reads[k] = (out.c.reads[k] || 0) + 1;
    if (!isRec(body)) return;
    for (const h of P.storedIdsServed([body, marker ?? null], stored)) {
      const m = /^(\[[01]\])(.*?) = (.*)$/s.exec(h);
      const where = m ? (m[1] === '[1]' ? `$marker${m[2]}` : m[2].replace(/^\./, '')) : h;
      const n = norm(where);
      const bucket = n.startsWith('publicProse') ? out.c.prose : out.c.hits;
      const e = ((bucket[k] ||= {})[n] ||= { count: 0, reads: new Set(), example: null });
      e.count += 1; e.reads.add(`${doc}|${tag}`);
      if (!e.example) e.example = { doc, tag, path: where, value: cut(m ? m[3] : h) };
    }
  };

  for (const d of docs) {
    const t0 = Date.now();
    let rec;
    try { rec = d.doc(); } catch (e) { out.faults.push(`${d.seed}: no document: ${String(e?.message || e).slice(0, 160)}`); continue; }
    out.docs += 1;
    // the instrument check's census: same-named persons (npcs[] by name, any two cards of one name), per place
    const byName = new Map(); for (const n of recs(rec.npcs)) { const nm = str(n.name).trim(); if (nm) byName.set(nm, (byName.get(nm) || 0) + 1); }
    const tm = { birth: Date.now() - t0, settings: 0, server: 0, twins: 0, l2: 0, cmp: 0, c: 0 }; let tq = Date.now(); const lap = (k) => { const n = Date.now(); tm[k] += n - tq; tq = n; };
    const row = { seed: d.seed, tm, cards: recs(rec.npcs).length, sameNamed: [...byName].filter(([, c]) => c > 1).map(([nm, c]) => `${nm} x${c}`), reads: 0, differ: [], instrumentSplit: [], ms: 0 };
    if (DO_C) {
      const fs = P.freshShapedStoredIds ? P.freshShapedStoredIds(rec) : [];
      out.c.freshShaped += fs.length;
      const self = P.storedIdsServed([rec, null], rec);
      if (self.length) out.c.docsWithStoredIds += 1;
      // THE STORED SIDE'S CENSUS: every path of the stored document holding a stored person id, the re-key's own sites
      // apart (SITES): where a stored id stands that no rule re-keys (the gap's possible sites, before any read)
      const seenHere = new Set();
      for (const h of self) {
        const m = /^\[0\](.*?) = /s.exec(h); if (!m) continue;
        const n = norm(m[1].replace(/^\./, ''));
        if (SITES.has(n)) continue;
        const e = (out.c.census[n] ||= { count: 0, docs: 0, example: null });
        e.count += 1; if (!seenHere.has(n)) { seenHere.add(n); e.docs += 1; }
        e.example ||= { doc: d.seed, at: h.slice(0, 200) };
      }
    }
    if (process.env.MEAS_STORED_CMP) {
      try { const st = JSON.parse(readFileSync(`${process.env.MEAS_STORED_CMP}/${d.seed}.json`, 'utf8')); out.storedCmp[J(st) === J(rec) ? 'same' : 'differ'] += 1; } catch { out.storedCmp.missing += 1; }
    }
    for (const dm of [false, true]) {
      const fam = { default: veil.writeShareVeil({}, []), unmarked: {} };
      tq = Date.now();
      if (process.env.MEAS_FAMILIES !== 'min') {
        try {
          const st = V.settings(rec, dm);
          for (const k of Object.keys(st.deltas).filter((x) => x !== 'g:111')) fam[k] = V.write(st.deltas[k]);
        } catch (e) { out.faults.push(`${d.seed} dm=${dm}: settings: ${String(e?.message || e).slice(0, 160)}`); }
      }
      lap('settings');
      for (const [k, ov] of Object.entries(fam)) {
        tq = Date.now();
        const tag = `${d.seed}|${dm ? 'dm' : 'off'}|${k}`;
        row.reads += 1;
        let srv;
        try { srv = await server(rec, dm, ov); } catch (e) { out.faults.push(`${tag}: server: ${String(e?.message || e).slice(0, 200)}`); continue; }
        lap('server');
        // the twins (L1)
        const tw = clone(veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov));
        const lt = clone(linkTwinOf(rec, ov));
        if (sharedLinkTwin) { const a = P.canonPeople(lt).doc; const b = P.canonPeople(clone(sharedLinkTwin(rec, ov))).doc; out.linkTwinSame[J(a) === J(b) ? 'same' : 'differ'] += 1; }
        lap('twins');
        if (srv.gallery !== undefined) compare('L1 gallery', tag, d.seed, srv.gallery?.data, tw, row);
        if (srv.link !== undefined) compare('L1 link', tag, d.seed, srv.link?.dossier, lt, row);
        lap('cmp');
        // L2: both rows through the client (M's level)
        if (L2 && srv.gallery) {
          const twl2 = await read(twinRow(rec, dm, ov), true);
          const svl2 = await read(srv.gallery, false);
          compare('L2 gallery', tag, d.seed, svl2, twl2, row);
          // where the two levels part, the client's processing on each side against its own L1 (named in the report)
          if (BIJ) {
            const sameServer = J(P.canonPeople(svl2).doc) === J(P.canonPeople(srv.gallery.data).doc);
            const k2 = `L2-vs-L1 server`; tallyOf(k2, 'canon').reads += 1; if (!sameServer) judge(k2, 'canon', tag, diffDocs(P.canonPeople(svl2).doc, P.canonPeople(srv.gallery.data).doc), d.seed);
            const k3 = `L2-vs-L1 twin`; tallyOf(k3, 'canon').reads += 1; const sameTwin = J(P.canonPeople(twl2).doc) === J(P.canonPeople(tw).doc); if (!sameTwin) judge(k3, 'canon', tag, diffDocs(P.canonPeople(twl2).doc, P.canonPeople(tw).doc), d.seed);
          }
          if (DO_C) cHits('gallery page (L2)', 'server', tag, d.seed, svl2, null, rec);
        }
        lap('l2');
        if (DO_C) {
          if (srv.gallery !== undefined) cHits('gallery', 'server', tag, d.seed, srv.gallery?.data, srv.gallery?.gallery_member_overrides, rec);
          if (srv.link !== undefined) cHits('link', 'server', tag, d.seed, srv.link?.dossier, srv.link?.gallery_member_overrides, rec);
          if (srv.import !== undefined) { cHits('import', 'server', tag, d.seed, srv.import?.data, null, rec); if (!isRec(srv.import?.data)) out.faults.push(`${tag}: import served no body`); }
          if (srv.map !== undefined) { cHits('map member', 'server', tag, d.seed, srv.map?.settlement, null, rec); if (!isRec(srv.map?.settlement)) out.faults.push(`${tag}: map served no member`); }
          cHits('gallery', 'twin', tag, d.seed, tw, null, rec);
          cHits('link', 'twin', tag, d.seed, lt, null, rec);
        }
        lap('c');
      }
    }
    row.ms = Date.now() - t0;
    out.perDoc.push(row);
    out.ended = new Date().toISOString();
    if (process.env.MEAS_OUT) writeFileSync(process.env.MEAS_OUT, JSON.stringify(out, (_k, v) => (v instanceof Set ? { n: v.size, first: [...v].slice(0, 6) } : v)));
  }
  await db.end();
  out.ended = new Date().toISOString(); out.done = true;
  if (process.env.MEAS_OUT) writeFileSync(process.env.MEAS_OUT, JSON.stringify(out, (_k, v) => (v instanceof Set ? { n: v.size, first: [...v].slice(0, 6) } : v)));
}, 14_400_000);
