// R4I-TONIGHT-2 item C.4, THE ARM IN THREE HALVES (VEIL-42; the chair's rulings 40.3 (2), 40.7 (2)), built on
// out/v38/r4it/tonight-arm.probe.jsx. Per place: the DEFAULT veil (writeShareVeil({}, [])); Reveal DM off and on; the
// GALLERY read (get_gallery_dossier) and the LINK read (get_unlisted_dossier); each read as the page receives it
// (src/lib/gallery.js :: fetchPublicDossier, its sanitiser and veil seam) by the TWIN (an unserved row: the client's veil
// seam projects it) twice and, where RV9_SERVER_TPL is given, by the SERVER (the scratch PG16) twice. The Tonight sheet is
// composed from each served document by the one composer (composeTonightSheet); every person's `castId` (the cast row's
// served id, re-keyed on every read by design, VR10) is named by THE READ'S PERSON-ID BIJECTION
// (tests/security/personIdBijection.shared.mjs :: canonPeople over that served document), every other byte kept:
//   (a) TWO READS PRINT THE SAME SHEET   twin2: twin read 1 == twin read 2; server2: server read 1 == server read 2
//   (b) THE SERVED SHEET EQUALS THE TWIN'S   twinServer: twin read 1 == server read 1 (same doors, same settings)
//   (c) ON THE OWNER'S PAGE (the stored record's own sheet), per read (twin 1, server 1), every cast person of the owner's
//       sheet found on the served one (by name and role label), in one class:
//         roleBoth      a ROLE line on both (no goal on the owner's card, none on the served card; a want line voiced):
//                       the line (and its sameAs) MUST be the same; each that differs is RED (roleMoved)
//         goalWithheld  the owner's card carries a goal and the served card none (the read withholds it), so the lines
//                       differ for a cause the key does not touch: COUNTED AND NAMED, NOT RED
//         sameOther     any other cast person whose line is the same on both
//         otherMoved    any other cast person whose line differs (named, for the reader)
//       The analyser reads (c) on the NOTHING-HIDDEN places (no hideable house, E.isHideableHouse), and prints it on
//       every place beside.
// RV9_OWNER_OUT dumps the owner's own sheet per birth (owner-sheet.probe.jsx's shape; read by owner-moves.mjs).
// Births: RV9_SET=towns (the tell gate's 140) or RV9_SET=pool (RV9_POOL_DIR's pool-shard*.json / poolb-shard*.json).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const env = vi.hoisted(() => ({ gallery: null, link: null }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }) }),
    rpc: async (name) => {
      if (name === 'get_gallery_dossier') return { data: env.gallery ? [JSON.parse(JSON.stringify(env.gallery))] : [], error: null };
      if (name === 'get_unlisted_dossier') return { data: env.link ? JSON.parse(JSON.stringify(env.link)) : null, error: null };
      return { data: null, error: null };
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});
const clone = (v) => JSON.parse(JSON.stringify(v));
const clean = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');

it('item C.4: the Tonight sheet in three halves (two reads; served = twin; the owner\'s role lines)', async () => {
  const { loadEngine } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { fetchPublicDossier } = await import(`${SRC}/src/lib/gallery.js`);
  const { composeTonightSheet, hasOwnGoal } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const { canonPeople } = await import(`${SRC}/tests/security/personIdBijection.shared.mjs`);
  const owners = { births: [] };
  const ownerDump = (sheet, seed) => {
    if (!process.env.RV9_OWNER_OUT) return;
    owners.births.push({ seed, people: sheet.people.map((p) => ({ name: p.name, role: p.role, why: p.why, castLabel: p.castLabel, castKind: p.castKind, castId: p.castId, line: p.line, says: p.says, sameAs: p.sameAs })), crisis: sheet.crisis?.line || null });
    writeFileSync(process.env.RV9_OWNER_OUT, JSON.stringify(owners));
  };
  const E = await loadEngine(SRC);
  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  let births;
  if ((process.env.RV9_SET || 'towns') === 'towns') births = E.pool(Number(process.env.RV9_N || 2), SHARD);
  else {
    const dir = process.env.RV9_POOL_DIR;
    const files = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort();
    const all = files.flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    births = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, cfg: cfgOf(b.size, b.crisis) }));
  }
  if (LIMIT) births = births.slice(0, LIMIT);
  let db = null; let nrow = 0;
  if (process.env.RV9_SERVER_TPL) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB || 'r4it2_arm'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const ov = veil.writeShareVeil({}, []);
  const ROW_ID = 'abcd0000-0000-0000-0000-000000000001';
  const twin = (surface, rec, dm) => (surface === 'gallery'
    ? { gallery: { id: ROW_ID, public_slug: 'a1', name: rec.name || 'x', tier: rec.tier || 'town', published_at: null, view_count: 0, gallery_share_dm: dm, gallery_importable: true, data: clone(rec), gallery_member_overrides: clone(ov) }, link: null }
    : { gallery: null, link: { id: ROW_ID, name: rec.name || 'x', tier: rec.tier || 'town', slug: 'a1l', dossier: clone(rec), author_name: '', gallery_member_overrides: clone(ov), is_owner: false } });
  /** The server's rows for one record and one Reveal setting: two gallery reads and two link reads of one stored row. */
  const serverReads = async (rec, dm) => {
    nrow += 1; const id = `abcd7c${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `t${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const g = async () => ({ gallery: (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null, link: null });
    const l = async () => ({ gallery: null, link: (await db.query('select public.get_unlisted_dossier($1) as r', [`${sl}l`])).rows[0]?.r ?? null });
    const out = { gallery: [await g(), await g()], link: [await l(), await l()] };
    await db.query('delete from public.settlements where id = $1', [id]);
    return out;
  };
  const read = async (rows) => { env.gallery = rows.gallery; env.link = rows.link; try { const d = await fetchPublicDossier('a1'); return d?.settlement ? clone(d.settlement) : null; } finally { env.gallery = null; env.link = null; } };
  /** The sheet as compared: every byte, each person's castId named by the read's bijection. */
  const sheetOf = (doc) => {
    if (!doc) return { missing: true, people: [] };
    const s = composeTonightSheet(doc); const { names } = canonPeople(doc);
    return { ...s, people: s.people.map((p) => (p.castId === undefined ? p : { ...p, castId: names.get(String(p.castId)) ?? `UNMAPPED:${p.castId}` })) };
  };
  const firstMove = (a, b) => {
    if (JSON.stringify(a.people) !== JSON.stringify(b.people)) {
      const i = Math.max(0, a.people.findIndex((p, k) => JSON.stringify(p) !== JSON.stringify(b.people[k])));
      return { at: `people[${i}]`, a: a.people[i] || null, b: b.people[i] || null };
    }
    const k = Object.keys({ ...a, ...b }).find((x) => JSON.stringify(a[x]) !== JSON.stringify(b[x]));
    return k === undefined ? null : { at: k, a: JSON.stringify(a[k]).slice(0, 300), b: JSON.stringify(b[k]).slice(0, 300) };
  };
  const cardOf = (doc, name) => (doc?.npcs || []).find((x) => x && clean(x.name) === name);
  const isRole = (p, card) => p.why === 'cast' && p.says === 'want' && !!p.line && !!card && !hasOwnGoal(card);
  /** (c): the owner's cast persons against one served sheet, by class. */
  const ownerHalf = (rec, own, doc, served) => {
    const r = { roleBoth: 0, roleMoved: [], goalWithheld: [], sameOther: 0, otherMoved: [], notServed: 0 };
    for (const p of own.people) {
      if (p.why !== 'cast') continue;
      const q = served.people.find((x) => x.name === p.name && x.castLabel === p.castLabel);
      if (!q) { r.notServed += 1; continue; }
      const c0 = cardOf(rec, p.name); const c1 = cardOf(doc, p.name);
      const same = q.line === p.line && q.sameAs === p.sameAs;
      const row = { name: p.name, role: p.castLabel, kind: p.castKind || '', owner: p.sameAs ? `Wants the same as ${p.sameAs}.` : p.line, served: q.sameAs ? `Wants the same as ${q.sameAs}.` : q.line };
      if (isRole(p, c0) && isRole(q, c1)) { r.roleBoth += 1; if (!same) r.roleMoved.push(row); }
      else if (c0 && hasOwnGoal(c0) && c1 && !hasOwnGoal(c1)) r.goalWithheld.push({ ...row, same });
      else if (same) r.sameOther += 1;
      else r.otherMoved.push(row);
    }
    return r;
  };
  const out = { births: [] };
  for (const b of births) {
    const rec = E.birth(b.cfg, b.seed, null);
    const hidden = (rec.institutions || []).filter((h) => E.isHideableHouse(h)).length;
    const own = composeTonightSheet(rec);
    const r = { seed: b.seed, hidden, castVoiced: own.people.filter((p) => p.why === 'cast').length, reads: {} };
    for (const dm of [false, true]) {
      const srv = db ? await serverReads(rec, dm) : null;
      for (const surface of ['gallery', 'link']) {
        const tag = `${surface}|${dm ? 'dm' : 'off'}`;
        const w1doc = await read(twin(surface, rec, dm)); const w2doc = await read(twin(surface, rec, dm));
        const w1 = sheetOf(w1doc); const w2 = sheetOf(w2doc);
        const x = { twinMissing: !w1doc, twin2: firstMove(w1, w2), ownerTwin: ownerHalf(rec, own, w1doc, w1) };
        if (srv) {
          const s1doc = await read(srv[surface][0]); const s2doc = await read(srv[surface][1]);
          const s1 = sheetOf(s1doc); const s2 = sheetOf(s2doc);
          Object.assign(x, { serverMissing: !s1doc, server2: firstMove(s1, s2), twinServer: firstMove(w1, s1), ownerServer: ownerHalf(rec, own, s1doc, s1) });
        }
        r.reads[tag] = x;
      }
    }
    out.births.push(r);
    ownerDump(own, b.seed);
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
