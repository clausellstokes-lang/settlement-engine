// VEIL-52, "PP" (PAGES PUBLISHED BEFORE THE VEIL), the chair's question through VEIL-50 (22:2x UTC 2026-11-24), for the owner's
// decision: A COPY OF um (VEIL-44's MAP-COVERT um.probe.jsx, 6edc79094). Its harness (the supabase mock, the stored set's index, the
// local cluster, the client's own fetcher over the served row) is um's; its loop is replaced by THREE DOCUMENTS walked by path, per
// stored document, Reveal as the maker set it (gallery_share_dm off and on), at the GALLERY READ:
//   S = what the server sends for an UNMARKED listing (get_gallery_dossier data, gallery_member_overrides {});
//   P = what the browser shows of S (fetchPublicDossier over that row: sanitizeDossier's unserved branch);
//   V = the same place with THE DEFAULT VEIL marker (writeShareVeil({}, [])): Vd = its served data, Vp = its page.
// WALK: every leaf (string, number, boolean) as (path with array indices folded to [], value); a MULTISET difference A - B counts
// each leaf A holds more often than B. CLASSED BY KIND, first match: publicProse (path under publicProse); covert copy (path under
// prominentRelationship/pressureSentence and the stored copy is covert by the twin's own rule, as um decides it); hidden house (the
// string names a hideable house of the stored document, isHideableHouse, by plain inclusion); hooks (/hook/i in the path); secrets
// (/secret/i); DM-only (/(^|\.)(dm|gm)[A-Z_]|dmNotes|dossierNotes|narrativeNotes|decrees|dmLayer|customContent/ in the path);
// else top:<the first key>. COUNTED: (a) S - P; (b) P - Vp (and P - Vd beside it): leaves, documents, reads, per kind and per
// top path. Out: UM_OUT (one json per shard). No line of src changed; nothing judged by the twin.
// R4I-MEASURE, the chair's two added items (the seat's message of 08:45 UTC): A MEASURE ONLY, no line of src changed.
// (U) THE PRODUCTION QUESTION (UM_U=1): per stored document, ONE unmarked share (gallery_member_overrides {}) at Reveal OFF, read
//     by the server's doors (get_gallery_dossier, import_gallery_dossier as a premium reader, a get_gallery_map member, and
//     get_unlisted_dossier beside them) and by the client's own fetchers over those served rows (fetchPublicDossier for the
//     gallery page, fetchDossierForImport, fetchGalleryMap). The stored document's covert copies are decided by the twin's own
//     rule (gallerySecondHomes.js :: withholdCovertCopies over { prominentRelationship, pressureSentence } of the stored
//     document, against the stored document, shareDm false): a copy the rule takes is a COVERT COPY. Per door and per page:
//     does it carry `prominentRelationship` (`pressureSentence`), and is it the covert copy (equal to the stored copy)?
// (M) M'S THREE COUNTS ON THE TWIN'S PROJECTION (UM_M=1): tonight-names.probe.jsx :: castPersons, shared and judge, verbatim,
//     run on the PROJECTION reads (gallery: projectShareVeil(galleryPayloadFor(...)); link: linkTwinOf's definition), Reveal off
//     and DM, every setting M read (the default marker, every family but g:111) and UNMARKED; the projection's salt fixed by
//     stubbing crypto.randomUUID (galleryVeilPeople.js :: readSalt), so each served id maps back by rekeyId. Out: UM_OUT.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const env = vi.hoisted(() => ({ rpc: {} }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name) => (name in env.rpc ? { data: JSON.parse(JSON.stringify(env.rpc[name])), error: null } : { data: null, error: null }),
  };
  return { supabase, isConfigured: true, default: supabase };
});
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const clean = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
const SALT = 'r4it-known-salt-0f0f0f0f';

it('VEIL-52 PP: pages published before the veil (S, P, V)', async () => {
  const { loadEngine, loadVeil } = await import(`${process.env.MEAS_COMMON}`);
  const E = await loadEngine(SRC); const V = await loadVeil(SRC); const veil = V.veil;
  const { withholdCovertCopies } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  // MAPCOVERT-RED (VEIL-44): rekeyId is M's alone (UM_M=1); the lane's tip 23bb8b8ae has no re-key (no galleryVeilPeople.js), so U loads it not
  const { rekeyId } = process.env.UM_M === '1' ? await import(`${SRC}/src/domain/display/galleryVeilPeople.js`) : { rekeyId: null };
  const { idText } = await import(`${SRC}/src/domain/display/galleryRosterChoices.js`);
  const { effectiveCastOf } = await import(`${SRC}/src/domain/crisis/crisisCast.js`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const linkHonoured = (overrides) => { if (!isRec(overrides)) return null; const out = {}; for (const [k, v] of Object.entries(overrides)) { if (k === '$veil' || !isRec(v) || v.revealDm !== true) { out[k] = clone(v); continue; } const { revealDm, ...rest } = v; out[k] = rest; } return out; }; // eslint-disable-line no-unused-vars
  const linkTwinOf = (stored, overrides) => { const ov = isRec(overrides) ? overrides : null; const pub = veil.galleryPayloadFor(clone(stored), { shareDm: false, memberOverrides: linkHonoured(ov) }); const { marked, deltas } = veil.readShareVeil(ov); return veil.applyVeil(pub, veil.resolveVeil(veil.defaultVeilFor(pub), marked ? deltas : [])); };
  const fixed = (f) => { const spy = vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => SALT); try { return clone(f()); } finally { spy.mockRestore(); } };

  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const SET = process.env.RV9_SET || 'stored';
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  let docs;
  if (SET === 'stored') {
    const DIR = process.env.RV9_STORED_DIR;
    const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index).sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
    docs = index.filter((_j, i) => i % SHARD[1] === SHARD[0]).map((j) => ({ seed: j.seed, doc: () => JSON.parse(readFileSync(`${DIR}/${j.seed}.json`, 'utf8')) }));
  } else {
    const dir = process.env.RV9_POOL_DIR;
    const all = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    docs = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, doc: () => E.birth(cfgOf(b.size, b.crisis), b.seed, null) }));
  }
  if (process.env.MEAS_SEEDS) { const S = new Set(process.env.MEAS_SEEDS.split(',')); docs = docs.filter((d) => S.has(d.seed)); }

  let db = null; let nrow = 0;
  const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
  if (true) { // PP: the server is always read
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB || 'meas_um'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
    await db.query(`update public.profiles set role = 'developer' where id = $1`, [READER]); await db.query(`select set_config('test.uid', '', false)`);
  }
  const out = { src: SRC, set: SET, shard: SHARD, docs: 0, faults: [], U: { docs: 0, covertPR: 0, covertPS: 0, carry: {}, examples: [] },
    M: { docs: 0, reads: 0, own: 0, ownNoName: 0, ownNoCard: 0, ownShared: 0, servedPersons: 0, i: 0, ii: 0, iii: 0, unmapped: 0, byRead: {}, stops: [] } };
  const carry = (k, yes, seed) => { const c = (out.U.carry[k] ||= { reads: 0, yes: 0, places: [] }); c.reads += 1; if (yes) { c.yes += 1; if (seed && !c.places.includes(seed)) c.places.push(seed); } };

  const castPersons = (doc) => {
    const npcs = Array.isArray(doc?.npcs) ? doc.npcs : [];
    const o = [];
    for (const k of ['stress', 'stressors']) {
      const v = doc?.[k];
      (isRec(v) ? [v] : Array.isArray(v) ? v : []).forEach((s, at) => {
        if (!isRec(s)) return;
        const cast = effectiveCastOf(doc, s).cast;
        if (!cast || !Array.isArray(cast.roles)) return;
        for (const r of cast.roles) {
          if (!isRec(r) || r.kind !== 'npc') continue;
          const card = npcs.find((n) => !!n && (clean(n.id) || clean(n.name)) === r.id);
          o.push({ copy: k, at, crisis: clean(s.type), role: String(r.role), id: r.id, rowName: clean(r.name), card: !!card, cardName: card ? clean(card.name) : '' });
        }
      });
    }
    return o;
  };
  const shared = (persons) => {
    const by = new Map();
    for (const p of persons) { if (!p.card || !p.cardName) continue; const k = `${p.cardName}|${p.crisis}|${p.role}`; if (!by.has(k)) by.set(k, new Set()); by.get(k).add(p.id); }
    return [...by].filter(([, ids]) => ids.size > 1).map(([k, ids]) => ({ key: k, ids: ids.size }));
  };

  const J2 = (v) => JSON.stringify(v);
  const walkLeaves = (v, p, outl) => {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') outl.push([p, v]);
    else if (Array.isArray(v)) v.forEach((x) => walkLeaves(x, `${p}[]`, outl));
    else if (isRec(v)) for (const [k, x] of Object.entries(v)) walkLeaves(x, p ? `${p}.${k}` : k, outl);
    return outl;
  };
  const multi = (doc) => { const m = new Map(); for (const [p, v] of walkLeaves(doc, '', [])) { const k = `${p}\u0000${J2(v)}`; m.set(k, (m.get(k) || 0) + 1); } return m; };
  const minus = (A, B) => { const o = []; for (const [k, n] of A) { const r = n - (B.get(k) || 0); if (r > 0) { const [p, v] = k.split('\u0000'); o.push([p, JSON.parse(v), r]); } } return o; };
  const DMRE = /(^|\.)(dm|gm)[A-Z_]|dmNotes|dossierNotes|narrativeNotes|decrees|dmLayer|customContent/;
  const kindOf = (p, v, ctx) => {
    if (/^publicProse(\.|\[|$)/.test(p)) return 'publicProse';
    if (/^prominentRelationship(\.|$)/.test(p) && ctx.covPR) return 'covert copy';
    if (/^pressureSentence$/.test(p) && ctx.covPS) return 'covert copy';
    if (typeof v === 'string' && ctx.houses.some((h) => v.includes(h))) return 'hidden house';
    if (/hook/i.test(p)) return 'hooks';
    if (/secret/i.test(p)) return 'secrets';
    if (DMRE.test(p)) return 'DM-only';
    return `top:${p.split(/[.[]/)[0]}`;
  };
  out.PP = { docs: 0, reads: 0, a: {}, b: {}, bd: {}, noBody: {}, examples: { a: {}, b: {}, bd: {} } };
  const tally = (bin, ex, diffs, ctx, seed, tag) => {
    const seen = new Set();
    for (const [p, v, n] of diffs) {
      const k = kindOf(p, v, ctx); const t = (bin[k] ||= { leaves: 0, docs: [], reads: 0, paths: {} });
      t.leaves += n; t.paths[p] = (t.paths[p] || 0) + n; if (!t.docs.includes(seed)) t.docs.push(seed);
      if (!seen.has(k)) { seen.add(k); t.reads += 1; }
      if (!ex[k]) ex[k] = { seed, tag, path: p, value: String(v).slice(0, 160) };
    }
  };

  for (const d of docs) {
    let rec; try { rec = d.doc(); } catch (e) { out.faults.push(`${d.seed}: ${String(e?.message || e).slice(0, 160)}`); continue; }
    out.docs += 1; out.PP.docs += 1;
    const probe = withholdCovertCopies({ prominentRelationship: rec.prominentRelationship, pressureSentence: rec.pressureSentence }, rec, false);
    const ctx = { covPR: isRec(rec.prominentRelationship) && !('prominentRelationship' in probe), covPS: typeof rec.pressureSentence === 'string' && !('pressureSentence' in probe),
      houses: recs(rec.institutions).filter((h) => E.isHideableHouse(h) && typeof h.name === 'string' && h.name.length >= 3).map((h) => h.name) };
    for (const dm of [false, true]) {
      const tag = dm ? 'DM' : 'off';
      const read = async (ov) => {
        nrow += 1; const id = `abcd5200-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `p${SHARD[0]}x${nrow}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
        const g = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
        await db.query('delete from public.settlements where id = $1', [id]);
        env.rpc = { get_gallery_dossier: g ? [g] : [] };
        const page = (await gallery.fetchPublicDossier(sl))?.settlement ?? null;
        env.rpc = {};
        return { data: g?.data ?? null, page, served: veil.isServedVeil(g?.gallery_member_overrides) };
      };
      const u = await read({}); const v = await read(veil.writeShareVeil({}, []));
      out.PP.reads += 1;
      if (!isRec(u.data) || !isRec(u.page) || !isRec(v.data) || !isRec(v.page)) { out.PP.noBody[`${tag}|S${isRec(u.data)}P${isRec(u.page)}Vd${isRec(v.data)}Vp${isRec(v.page)}`] = (out.PP.noBody[`${tag}|S${isRec(u.data)}P${isRec(u.page)}Vd${isRec(v.data)}Vp${isRec(v.page)}`] || 0) + 1; continue; }
      const mk = `marker S ${u.served ? 'served' : 'none'} V ${v.served ? 'served' : 'none'} | ${tag}`; out.PP.markers ||= {}; out.PP.markers[mk] = (out.PP.markers[mk] || 0) + 1;
      const S = multi(u.data); const P = multi(u.page); const Vd = multi(v.data); const Vp = multi(v.page);
      tally(out.PP.a, out.PP.examples.a, minus(S, P), ctx, d.seed, tag);
      tally(out.PP.b, out.PP.examples.b, minus(P, Vp), ctx, d.seed, tag);
      tally(out.PP.bd, out.PP.examples.bd, minus(P, Vd), ctx, d.seed, tag);
    }
    if (process.env.UM_OUT) writeFileSync(process.env.UM_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  out.done = true; if (process.env.UM_OUT) writeFileSync(process.env.UM_OUT, JSON.stringify(out));
}, 14_400_000);
