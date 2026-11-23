// R4I-TONIGHT item C, THE ARM ON THE 140 AND THE POOL (the chair's ruling 40.3 (2)): per place, the DEFAULT veil
// (writeShareVeil({}, [])), Reveal off, the Tonight sheet composed (composeTonightSheet, the one composer every surface
// renders) from each served document as the page receives it (src/lib/gallery.js :: fetchPublicDossier, its sanitiser and
// veil seam): the TWIN twice (an unserved row; the client's veil seam projects it) and, where RV9_SERVER_TPL is given, the
// SERVER twice (get_gallery_dossier on the scratch PG16). Each sheet is compared with `castId` set aside (the cast row's
// served id: re-keyed on every read by design, VR10; it is the want's key no longer) and every other byte kept:
//   twin2   twin read 1 == twin read 2          server2  server read 1 == server read 2      twinServer  twin 1 == server 1
//   owner   on a place with NO hideable house: the served sheet (twin 1, server 1) == the owner's own sheet (the stored record),
//           whole (MEASURED: it is not, for a cause the key does not touch: a non-owner read withholds the card's goal and
//           secret, so the served sheet voices a temperament or a role line where the owner's voices the goal);
//   ownerRole  THE OWNER TOOTH THE KEY OWNS, on every place: each cast person the OWNER's sheet voices with a ROLE line
//           (no goal of their own on the card) is voiced on the served sheet (by name and role) with the SAME line
// Each failure names the place and the first person or field that moved. Births as tonight-names.probe.jsx takes them.
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
const clone = (v) => JSON.parse(JSON.stringify(v));

it('item C arm: the Tonight sheet on two reads, and against the owner\'s own', async () => {
  const { loadEngine } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { fetchPublicDossier } = await import(`${SRC}/src/lib/gallery.js`);
  const { composeTonightSheet, hasOwnGoal } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  // THE OWNER'S OWN SHEET, per birth, in owner-sheet.probe.jsx's shape (RV9_OWNER_OUT; read by owner-moves.mjs)
  const { composeTonightSheet: ownerCompose } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const owners = { births: [] };
  const ownerDump = (rec, seed) => {
    if (!process.env.RV9_OWNER_OUT) return;
    const sheet = ownerCompose(rec);
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
    const dbn = `${process.env.RV9_SERVER_DB || 'r4it_arm'}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const ov = veil.writeShareVeil({}, []);
  const twinRow = (rec) => ({ id: 'abcd0000-0000-0000-0000-000000000001', public_slug: 'a1', name: rec.name || 'x', tier: rec.tier || 'town', published_at: null, view_count: 0, gallery_share_dm: false, gallery_importable: true, data: clone(rec), gallery_member_overrides: clone(ov) });
  const serverRows = async (rec) => {
    nrow += 1; const id = `abcd7b${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `a${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,false,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov)]);
    const q = async () => (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r;
    const r1 = await q(); const r2 = await q();
    await db.query('delete from public.settlements where id = $1', [id]);
    return [r1, r2];
  };
  const read = async (row) => { env.row = row; const d = await fetchPublicDossier('a1'); return d?.settlement ? clone(d.settlement) : null; };
  /** The sheet as compared: every byte but each person's `castId`. */
  const sheetOf = (doc) => { const s = composeTonightSheet(doc); return { ...s, people: s.people.map(({ castId: _c, ...p }) => p) }; };
  const firstMove = (a, b) => {
    if (JSON.stringify(a.people) !== JSON.stringify(b.people)) {
      const i = a.people.findIndex((p, k) => JSON.stringify(p) !== JSON.stringify(b.people[k]));
      return { at: `people[${i}]`, a: a.people[i] || null, b: b.people[i] || null };
    }
    const k = Object.keys(a).find((x) => JSON.stringify(a[x]) !== JSON.stringify(b[x]));
    return k === undefined ? null : { at: k, a: JSON.stringify(a[k]).slice(0, 300), b: JSON.stringify(b[k]).slice(0, 300) };
  };
  /** ownerRole: [compared, moved[]] of the owner's role-voiced cast persons against one served sheet. */
  const ownerRole = (rec, own, served) => {
    const moved = []; let n = 0;
    for (const p of own.people) {
      if (p.why !== 'cast' || p.says !== 'want') continue;
      const card = (rec.npcs || []).find((x) => x && typeof x.name === 'string' && x.name.replace(/\s+/g, ' ').trim() === p.name);
      if (!card || hasOwnGoal(card)) continue;
      const q = served.people.find((x) => x.name === p.name && x.castLabel === p.castLabel);
      if (!q) continue;
      n += 1;
      if (q.line !== p.line || q.sameAs !== p.sameAs) moved.push({ name: p.name, role: p.castLabel, owner: p.line, served: q.line });
    }
    return { n, moved };
  };
  const out = { births: [] };
  for (const b of births) {
    const rec = E.birth(b.cfg, b.seed, null);
    const hidden = (rec.institutions || []).filter((h) => E.isHideableHouse(h)).length;
    const own = sheetOf(rec);
    const t1 = sheetOf(await read(twinRow(rec))); const t2 = sheetOf(await read(twinRow(rec)));
    const r = { seed: b.seed, hidden, castVoiced: own.people.filter((p) => p.why === 'cast').length, twin2: firstMove(t1, t2), ownerTwin: hidden ? 'n/a' : firstMove(own, t1), ownerRoleTwin: ownerRole(rec, own, t1) };
    if (db) {
      const [s1, s2] = await serverRows(rec);
      const v1 = sheetOf(await read(s1)); const v2 = sheetOf(await read(s2));
      r.server2 = firstMove(v1, v2); r.twinServer = firstMove(t1, v1); r.ownerServer = hidden ? 'n/a' : firstMove(own, v1); r.ownerRoleServer = ownerRole(rec, own, v1);
    }
    out.births.push(r);
    ownerDump(rec, b.seed);
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (db) await db.end();
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
