// R4I-TONIGHT item M (VEIL-38; the chair's ruling 40.3 (2)): A MEASURE before the cure, no line of src changed.
// The cure keys `tonightSheet.js :: castWantOf` on the person's NAME as the card prints it (with the crisis and the role).
// It is safe only if, per place and read:
//   (i)  NO TWO CAST PERSONS OF ONE PLACE SHARE (name, crisis, role): distinct person ids under one key, on the owner's
//        page (the stored record) and on every served read;
//   (ii) NO CAST PERSON'S SERVED NAME DIFFERS FROM THE STORED NAME: the card's name the sheet prints (npcs[] matched by the
//        cast row's id, as tonightSheet.js :: peopleOf matches it) and the cast row's own name, served vs stored.
// THE READS, per place: Reveal DM off and on; the default veil (writeShareVeil({}, [])) and every setting family the tell
// probe reads (out/v27/tell/measure/tell-common.mjs :: settings: own, g:000..g:110, allOpen, off), each computed on its
// own record; each read by the TWIN (the client's own fetchPublicDossier over the unserved row, its veil seam) and, where
// RV9_SERVER_TPL is given, the SERVER (get_gallery_dossier on the scratch PG16, then the same client fetch).
// THE MAP served id -> stored id: the twin's salt is FIXED for its read (globalThis.crypto.randomUUID stubbed, so
// galleryVeilPeople.js :: readSalt returns a known salt; every stored id re-keyed under it by rekeyId); the server's salt
// is its own, so a server id is mapped through personIdBijection.shared.mjs :: canonPeople to the twin's id of the same
// canonical name (the same setting), then to the stored id. A served cast id the map does not reach is COUNTED (unmapped).
// THE PLANT: RV9_PLANT=1 plants one renamed card and one same-named second cast person on the first twin read of
// each place (the teeth: (i) and (ii) must count it; the planted id is unmapped).
// Births: RV9_SET=towns (the tell gate's 140) or RV9_SET=pool (RV9_POOL_DIR's pool-shard*.json / poolb-shard*.json).
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
const clone = (v) => JSON.parse(JSON.stringify(v));
const clean = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const SALT = 'r4it-known-salt-0f0f0f0f';

it('item M: cast persons by (name, crisis, role), and served names against stored', async () => {
  const { loadEngine, loadVeil } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const { canonPeople } = await import(`${SRC}/tests/security/personIdBijection.shared.mjs`);
  const { rekeyId } = await import(`${SRC}/src/domain/display/galleryVeilPeople.js`);
  const { idText } = await import(`${SRC}/src/domain/display/galleryRosterChoices.js`);
  const { effectiveCastOf } = await import(`${SRC}/src/domain/crisis/crisisCast.js`);
  const { fetchPublicDossier } = await import(`${SRC}/src/lib/gallery.js`);
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  // THE OWNER'S OWN SHEET, per birth, in owner-sheet.probe.jsx's shape (RV9_OWNER_OUT; read by owner-moves.mjs)
  const { composeTonightSheet: ownerCompose } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const owners = { births: [] };
  const ownerDump = (rec, seed) => {
    if (!process.env.RV9_OWNER_OUT) return;
    const sheet = ownerCompose(rec);
    owners.births.push({ seed, people: sheet.people.map((p) => ({ name: p.name, role: p.role, why: p.why, castLabel: p.castLabel, castKind: p.castKind, castId: p.castId, line: p.line, says: p.says, sameAs: p.sameAs })), crisis: sheet.crisis?.line || null });
    writeFileSync(process.env.RV9_OWNER_OUT, JSON.stringify(owners));
  };
  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  /** @type {Array<{ seed: string, cfg: object }>} */
  let births;
  if ((process.env.RV9_SET || 'towns') === 'towns') births = E.pool(Number(process.env.RV9_N || 2), SHARD);
  else {
    const dir = process.env.RV9_POOL_DIR;
    const files = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort();
    const all = files.flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    // tell2.probe.jsx :: cfgOf, byte for byte (as order.probe.jsx copies it)
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    births = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, cfg: cfgOf(b.size, b.crisis) }));
  }
  if (LIMIT) births = births.slice(0, LIMIT);

  let db = null; let nrow = 0;
  if (process.env.RV9_SERVER_TPL) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB || 'r4it_names'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }

  /** Every cast person of a document, as the sheet reads them: each crisis copy's effective cast, kind npc, its card by id. */
  const castPersons = (doc) => {
    const npcs = Array.isArray(doc?.npcs) ? doc.npcs : [];
    const out = [];
    for (const k of ['stress', 'stressors']) {
      const v = doc?.[k];
      (isRec(v) ? [v] : Array.isArray(v) ? v : []).forEach((s, at) => {
        if (!isRec(s)) return;
        const cast = effectiveCastOf(doc, s).cast;
        if (!cast || !Array.isArray(cast.roles)) return;
        for (const r of cast.roles) {
          if (!isRec(r) || r.kind !== 'npc') continue;
          const card = npcs.find((n) => !!n && (clean(n.id) || clean(n.name)) === r.id);
          out.push({ copy: k, at, crisis: clean(s.type), role: String(r.role), id: r.id, rowName: clean(r.name), card: !!card, cardName: card ? clean(card.name) : '' });
        }
      });
    }
    return out;
  };
  /** (i): keys (cardName, crisis, role) held by two or more DISTINCT person ids (the two crisis copies are one person). */
  const shared = (persons) => {
    const by = new Map();
    for (const p of persons) { if (!p.card || !p.cardName) continue; const k = `${p.cardName}|${p.crisis}|${p.role}`; if (!by.has(k)) by.set(k, new Set()); by.get(k).add(p.id); }
    return [...by].filter(([, ids]) => ids.size > 1).map(([k, ids]) => ({ key: k, ids: ids.size }));
  };
  const twinRow = (rec, dm, ov) => ({ id: 'abcd0000-0000-0000-0000-000000000001', public_slug: 'n1', name: rec.name || 'x', tier: rec.tier || 'town', published_at: null, view_count: 0, gallery_share_dm: dm, gallery_importable: true, data: clone(rec), gallery_member_overrides: clone(ov) });
  const serverRow = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7a${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `n${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const r = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r;
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  };
  let saltCalls = 0;
  /** The client's own read of a row; with `fixed`, the read's salt is SALT. */
  const read = async (row, fixed) => {
    env.row = row;
    const spy = fixed ? vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => { saltCalls += 1; return SALT; }) : null;
    try { const d = await fetchPublicDossier('n1'); return d?.settlement ? clone(d.settlement) : null; } finally { if (spy) spy.mockRestore(); }
  };

  const out = { births: [], salt: SALT };
  for (const b of births) {
    const t0 = Date.now();
    const rec = E.birth(b.cfg, b.seed, null);
    const own = castPersons(rec);
    const r = { seed: b.seed, hidden: (rec.institutions || []).filter((h) => E.isHideableHouse(h)).length, own: own.length,
      ownNoName: own.filter((p) => p.card && !p.cardName).length, ownNoCard: own.filter((p) => !p.card).length, ownShared: shared(own),
      reads: 0, sharedReads: [], differ: [], unmapped: [], canonUnequal: [], servedPersons: 0, servedNoName: 0 };
    const storedByKey = new Map(own.map((p) => [`${p.copy}|${p.at}|${p.role}|${p.id}`, p]));
    /** stored id text -> stored id, re-keyed under SALT */
    const back = new Map();
    for (const n of rec.npcs || []) if (n && (typeof n.id === 'string' || typeof n.id === 'number')) back.set(rekeyId('npc_', idText(n.id), SALT), n.id);
    const judge = (tag, served, mapId) => {
      r.reads += 1;
      const ps = castPersons(served);
      r.servedPersons += ps.length; r.servedNoName += ps.filter((p) => p.card && !p.cardName).length;
      const sh = shared(ps); if (sh.length) r.sharedReads.push({ read: tag, keys: sh });
      for (const p of ps) {
        const sid = mapId(p.id);
        if (sid === undefined) { r.unmapped.push({ read: tag, role: p.role, crisis: p.crisis, name: p.cardName || p.rowName }); continue; }
        const s = storedByKey.get(`${p.copy}|${p.at}|${p.role}|${sid}`) || own.find((x) => x.id === sid && x.role === p.role && x.crisis === p.crisis);
        if (!s) { r.unmapped.push({ read: tag, role: p.role, crisis: p.crisis, name: p.cardName || p.rowName, why: 'no stored cast row' }); continue; }
        if (s.cardName !== p.cardName || s.rowName !== p.rowName || s.card !== p.card) r.differ.push({ read: tag, role: p.role, crisis: p.crisis, stored: [s.cardName, s.rowName], served: [p.cardName, p.rowName] });
      }
    };
    for (const dm of [false, true]) {
      const fam = { default: V.veil.writeShareVeil({}, []) };
      const st = V.settings(rec, dm);
      for (const k of Object.keys(st.deltas).filter((x) => x !== 'g:111')) fam[k] = V.write(st.deltas[k]);
      for (const [k, ov] of Object.entries(fam)) {
        const tag = `${dm ? 'dm' : 'off'}|${k}`;
        const tw = await read(twinRow(rec, dm, ov), true);
        // THE PLANT (RV9_PLANT=1, the probe's own teeth; never in a counted run): on the first twin read, the first cast
        // person's card renamed (ii), and a second card of that name and a cast row of that role and crisis on it (i).
        if (process.env.RV9_PLANT === '1' && tag === 'off|default') {
          const p0 = castPersons(tw).find((p) => p.card && p.cardName);
          const card = p0 && tw.npcs.find((n) => (clean(n.id) || clean(n.name)) === p0.id);
          if (card) {
            card.name = `${card.name} Planted`;
            tw.npcs.push({ ...clone(card), id: 'npc_plantedplanted00' });
            const s = (isRec(tw[p0.copy]) ? [tw[p0.copy]] : tw[p0.copy])[p0.at];
            s.cast.roles.push({ ...clone(s.cast.roles.find((x) => x.id === p0.id)), id: 'npc_plantedplanted00' });
          }
        }
        judge(`twin|${tag}`, tw, (id) => back.get(id));
        if (db) {
          const srow = await serverRow(rec, dm, ov);
          const sv = await read(srow, false);
          const cs = canonPeople(sv); const ct = canonPeople(tw);
          const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
          if (J(cs.doc) !== J(ct.doc)) r.canonUnequal.push(tag);
          const twinOf = new Map([...ct.names].map(([orig, name]) => [name, orig]));
          judge(`server|${tag}`, sv, (id) => { const name = cs.names.get(String(id)) ?? cs.names.get(id); const tid = name !== undefined ? twinOf.get(name) : undefined; return tid !== undefined ? back.get(tid) : undefined; });
        }
      }
    }
    r.ms = Date.now() - t0;
    out.births.push(r);
    ownerDump(rec, b.seed);
    out.saltCalls = saltCalls;
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
