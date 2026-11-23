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

it('R4I-MEASURE U (unmarked) and M (M\'s counts on the projection)', async () => {
  const { loadEngine, loadVeil } = await import(`${process.env.MEAS_COMMON}`);
  const E = await loadEngine(SRC); const V = await loadVeil(SRC); const veil = V.veil;
  const { withholdCovertCopies } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { rekeyId } = await import(`${SRC}/src/domain/display/galleryVeilPeople.js`);
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
  if (process.env.UM_U === '1') {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB || 'meas_um'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
    await db.query(`update public.profiles set role = 'developer' where id = $1`, [READER]); await db.query(`select set_config('test.uid', '', false)`);
  }
  const out = { src: SRC, set: SET, shard: SHARD, docs: 0, faults: [], U: { docs: 0, covertPR: 0, covertPS: 0, carry: {}, examples: [] },
    M: { docs: 0, reads: 0, own: 0, ownNoName: 0, ownNoCard: 0, ownShared: 0, servedPersons: 0, i: 0, ii: 0, iii: 0, unmapped: 0, byRead: {}, stops: [] } };
  const carry = (k, yes) => { out.U.carry[k] ||= { reads: 0, yes: 0 }; out.U.carry[k].reads += 1; if (yes) out.U.carry[k].yes += 1; };

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

  for (const d of docs) {
    let rec; try { rec = d.doc(); } catch (e) { out.faults.push(`${d.seed}: ${String(e?.message || e).slice(0, 160)}`); continue; }
    out.docs += 1;
    if (db) {
      out.U.docs += 1;
      const probe = withholdCovertCopies({ prominentRelationship: rec.prominentRelationship, pressureSentence: rec.pressureSentence }, rec, false);
      const covPR = isRec(rec.prominentRelationship) && !('prominentRelationship' in probe);
      const covPS = typeof rec.pressureSentence === 'string' && !('pressureSentence' in probe);
      if (covPR) out.U.covertPR += 1; if (covPS) out.U.covertPS += 1;
      nrow += 1; const id = `abcd4300-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `u${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted','{}'::jsonb,false,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`]);
      const mid = `abcd4301-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`;
      await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign) values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true)`, [mid, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`]);
      const g = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
      const l = (await db.query('select public.get_unlisted_dossier($1) x', [`${sl}l`])).rows[0]?.x ?? null;
      await db.query(`select set_config('test.uid', $1, false)`, [READER]);
      const imp = (await db.query('select to_jsonb(g) r from public.import_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
      await db.query(`select set_config('test.uid', '', false)`);
      const map = (await db.query('select public.get_gallery_map($1) x', [`${sl}m`])).rows[0]?.x ?? null;
      await db.query('delete from public.saved_maps where id = $1', [mid]); await db.query('delete from public.settlements where id = $1', [id]);
      env.rpc = { get_gallery_dossier: g ? [g] : [], import_gallery_dossier: imp ? [imp] : [], get_gallery_map: map };
      const page = (await gallery.fetchPublicDossier(sl))?.settlement ?? null;
      const ipage = (await gallery.fetchDossierForImport(sl))?.settlement ?? null;
      const mpage = recs((await gallery.fetchGalleryMap(`${sl}m`))?.members)[0]?.settlement ?? null;
      env.rpc = {};
      const bodies = { 'gallery data': g?.data, 'gallery page (fetchPublicDossier)': page, 'import data': imp?.data, 'import page (fetchDossierForImport)': ipage,
        'map member': recs(map?.members)[0]?.settlement, 'map page (fetchGalleryMap)': mpage, 'link dossier': l?.dossier };
      for (const [k, b] of Object.entries(bodies)) {
        if (!isRec(b)) { out.faults.push(`${d.seed}: ${k}: no body`); continue; }
        const hasPR = 'prominentRelationship' in b; const hasPS = 'pressureSentence' in b;
        carry(`${k} | prominentRelationship present (any place)`, hasPR);
        if (covPR) { carry(`${k} | prominentRelationship present where it is a COVERT copy`, hasPR); if (hasPR && out.U.examples.length < 6) out.U.examples.push({ seed: d.seed, door: k, copy: JSON.stringify(b.prominentRelationship).slice(0, 200), equalToStored: J(b.prominentRelationship) === J(rec.prominentRelationship) }); }
        if (covPS) carry(`${k} | pressureSentence present where it is a COVERT copy`, hasPS);
      }
      // beside it, the MARKED share (the default marker, writeShareVeil({}, [])) read by the map door only: does the member carry it there too?
      {
        nrow += 1; const id2 = `abcd4302-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; const sl2 = `u${SHARD[0]}x${nrow}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,false,true)`, [id2, OWNER, rec.name || 'x', JSON.stringify(rec), sl2, `${sl2}l`, JSON.stringify(veil.writeShareVeil({}, []))]);
        const mid2 = `abcd4303-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`;
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign) values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true)`, [mid2, OWNER, JSON.stringify({ campaign: { settlementIds: [id2] } }), `${sl2}m`]);
        const map2 = (await db.query('select public.get_gallery_map($1) x', [`${sl2}m`])).rows[0]?.x ?? null;
        const g2 = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl2])).rows[0]?.r ?? null;
        await db.query('delete from public.saved_maps where id = $1', [mid2]); await db.query('delete from public.settlements where id = $1', [id2]);
        const m2 = recs(map2?.members)[0]?.settlement;
        if (isRec(m2)) { carry('MARKED (default) map member | prominentRelationship present (any place)', 'prominentRelationship' in m2); if (covPR) carry('MARKED (default) map member | prominentRelationship present where it is a COVERT copy', 'prominentRelationship' in m2); if (covPS) carry('MARKED (default) map member | pressureSentence present where it is a COVERT copy', 'pressureSentence' in m2); }
        if (isRec(g2?.data) && covPR) carry('MARKED (default) gallery data | prominentRelationship present where it is a COVERT copy', 'prominentRelationship' in g2.data);
      }
      out.U.marker = out.U.marker || {}; const mk = `gallery served marker: ${veil.isServedVeil(g?.gallery_member_overrides) ? 'served' : 'NONE'}`; out.U.marker[mk] = (out.U.marker[mk] || 0) + 1;
    }
    if (process.env.UM_M === '1') {
      out.M.docs += 1;
      const own = castPersons(rec);
      out.M.own += own.length; out.M.ownNoName += own.filter((p) => p.card && !p.cardName).length; out.M.ownNoCard += own.filter((p) => !p.card).length; out.M.ownShared += shared(own).length;
      const storedByKey = new Map(own.map((p) => [`${p.copy}|${p.at}|${p.role}|${p.id}`, p]));
      const back = new Map(); for (const n of rec.npcs || []) if (n && (typeof n.id === 'string' || typeof n.id === 'number')) back.set(rekeyId('npc_', idText(n.id), SALT), n.id);
      const judge = (tag, served) => {
        out.M.reads += 1; const R = (out.M.byRead[tag.split('|')[0]] ||= { reads: 0, i: 0, ii: 0, iii: 0, unmapped: 0 }); R.reads += 1;
        const ps = castPersons(served); out.M.servedPersons += ps.length;
        const nn = ps.filter((p) => p.card && !p.cardName).length; out.M.iii += nn; R.iii += nn;
        const sh = shared(ps); out.M.i += sh.length; R.i += sh.length;
        if (sh.length || nn) out.M.stops.push({ seed: d.seed, read: tag, shared: sh, nameless: nn });
        for (const p of ps) {
          const sid = back.get(p.id);
          if (sid === undefined) { out.M.unmapped += 1; R.unmapped += 1; out.M.stops.push({ seed: d.seed, read: tag, unmapped: p.cardName || p.rowName, role: p.role }); continue; }
          const s = storedByKey.get(`${p.copy}|${p.at}|${p.role}|${sid}`) || own.find((x) => x.id === sid && x.role === p.role && x.crisis === p.crisis);
          if (!s) { out.M.unmapped += 1; R.unmapped += 1; out.M.stops.push({ seed: d.seed, read: tag, unmapped: p.cardName || p.rowName, why: 'no stored cast row' }); continue; }
          if (s.cardName !== p.cardName || s.rowName !== p.rowName || s.card !== p.card) { out.M.ii += 1; R.ii += 1; out.M.stops.push({ seed: d.seed, read: tag, role: p.role, stored: [s.cardName, s.rowName], served: [p.cardName, p.rowName] }); }
        }
      };
      for (const dm of [false, true]) {
        const fam = { default: veil.writeShareVeil({}, []), unmarked: {} };
        try { const st = V.settings(rec, dm); for (const k of Object.keys(st.deltas).filter((x) => x !== 'g:111')) fam[k] = V.write(st.deltas[k]); } catch (e) { out.faults.push(`${d.seed} dm=${dm}: settings: ${String(e?.message || e).slice(0, 120)}`); }
        for (const [k, ov] of Object.entries(fam)) {
          judge(`gallery twin|${dm ? 'dm' : 'off'}|${k}`, fixed(() => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov)));
          // the link is never a Reveal-DM read (212 :3307): its twin takes shareDm false whatever the share says; at `dm` the setting
          // families are the Reveal-DM screen's (V.settings(rec, true)), so both are read
          judge(`link twin|${dm ? 'dm' : 'off'}|${k}`, fixed(() => linkTwinOf(rec, ov)));
        }
      }
      if (out.M.stops.length > 200) out.M.stops = out.M.stops.slice(0, 200);
    }
    if (process.env.UM_OUT) writeFileSync(process.env.UM_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  out.done = true; if (process.env.UM_OUT) writeFileSync(process.env.UM_OUT, JSON.stringify(out));
}, 14_400_000);
