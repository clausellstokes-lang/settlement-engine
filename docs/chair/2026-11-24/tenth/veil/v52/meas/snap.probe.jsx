// VEIL-52 (1)(a), "SNAP" (D4, SNAP-MEASURE; N84 (3)): A COPY OF wd (b126c9813 out/v43/meas/wd.probe.jsx), the chair's leave
// (RULING-V1 V1-3 1: "the world snapshots"). WHAT IT READS: BOTH MAP READS' WORLD SNAPSHOTS, served as stored (211
// `get_gallery_map` -> `world` {snapshot, sections} and `realmArcSummary`; 168 `get_unlisted_map` -> `world_snapshot`,
// `world_sections`, `realm_arc_summary`; `import_gallery_map` = the first's payload, read too). THE WORLD: the stored set's
// documents grouped into campaigns of SNAP_G (default 4, consecutive in the shard), a regional graph chaining them (trade
// partners, the last pair rivals), every `*Enabled` simulation rule ON, SNAP_TICKS (default 12) monthly ticks of
// `advanceCampaignWorld` with the members' updates fed back (the owner's own advance), then the client's own publish
// artifacts: `serializeWorldSnapshotPublic(ws, graph, saves, every section on)` (MapShareEditor :: buildShareOpts),
// `buildRealmArcSummary`, published through 148 `publish_map` (the server's 089 depth check) as the owner.
// PER READ (each member at its own setting key, Reveal off and on, as wd walks them; the snapshot itself is the same bytes
// at every read): THE WITHHELD SET of member m = withheldAllOf(stored m, m as the map member serves it) and the persons the
// member does not serve. COUNTED IN THE WORLD STRINGS (snapshot, sections, arc summary), by path:
//   copy    an object holding >= 2 of a settlement's keys (npcs, institutions, powerStructure, factions, economy,
//           relationships, publicProse) or equal to a member document
//   ppkey   a `publicProse` key at any depth
//   person  a stored person's name (any member) in a string: `person-served` (the member serves the person) and
//           `person-withheld` (it does not)
//   name    a string the lane's fold names a withheld power or house in (namesWithheld, carried line for line)
//   id      a withheld id as a string or a key
// SNAP_PLANT=1 THE PLANTED POSITIVE: the first campaign with a hideable house gets, in its published snapshot, a dashboard
// line "<that house's name> holds the docks", a chronicle-style person string "<a withheld person> was seen", a
// `publicProse` key and a settlement copy under `dashboard.plantCopy`; each must be counted where the server serves it.
// THE JUDGMENT IS THE LANE'S (withheldOf, withheldAllOf, servedNamesOf, namesWithheld: galleryVeilRecent.pglite.test.js,
// CHECKED against that file's bytes at start, as wd does). The fold: gallerySecondHomes.js :: buildNameSearch.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, norm } from '../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const FORM = process.env.RV9_FORM || 'stored';
const G = Number(process.env.SNAP_G || 4);
const TICKS = Number(process.env.SNAP_TICKS || 12);
const PLANT = process.env.SNAP_PLANT === '1';
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const NOW = '2026-11-01T00:00:00.000Z';

it(`VEIL-52 snap (${FORM})`, async () => {
  const T0 = Date.now();
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const FOLD = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const MEMO = new Map();
  const buildNameSearch = (names, opens) => { const k = JSON.stringify([names, opens]); if (!MEMO.has(k)) { if (MEMO.size > 5000) MEMO.clear(); MEMO.set(k, FOLD.buildNameSearch(names, opens)); } return MEMO.get(k); };
  const W = await import(`${SRC}/src/domain/worldPulse/advanceCampaignWorld.js`);
  const RULES = await import(`${SRC}/src/domain/worldPulse/simulationRules.js`);
  const RG = await import(`${SRC}/src/domain/region/graph.js`);
  const WS = await import(`${SRC}/src/domain/display/worldSnapshotPublic.js`);
  const RA = await import(`${SRC}/src/domain/display/realmArcSummary.js`);
  const arr = (v) => (Array.isArray(v) ? v : []);
  // ── THE LANE'S JUDGMENT, carried line for line from galleryVeilRecent.pglite.test.js (checked below), as wd carries it
  const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
  function withheldOf(stored, d) {
    const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v)));
    const out = new Set();
    for (const f of listsOf(stored)) {
      const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v);
      if (!names.length || names.some((n) => served.has(n))) continue;
      for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) out.add(v);
    }
    return [...out];
  }
  const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap((f) => [f.faction, f.name]), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]
    .filter((v) => typeof v === 'string' && v))];
  function namesWithheld(text, withheld, d) {
    if (typeof text !== 'string' || text === '') return false;
    if (withheld.includes(text)) return true;
    const words = withheld.filter((t) => !/^\d+$/.test(t));
    const opens = servedNamesOf(d);
    const bare = buildNameSearch(words, []);
    const search = buildNameSearch(words, opens);
    if (!bare || !bare.hit(text)) return false;
    if (search && search.hit(text)) return true;
    const holders = opens.filter((n) => text.includes(n) && bare.hit(n));
    return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));
  }
  const withheldAllOf = (stored, d) => {
    const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
    return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];
  };
  const COPIED = [
    'const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);',
    "const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v)));",
    "const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v);",
    'if (!names.length || names.some((n) => served.has(n))) continue;',
    "for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) out.add(v);",
    'const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap((f) => [f.faction, f.name]), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]',
    "if (typeof text !== 'string' || text === '') return false;",
    'if (withheld.includes(text)) return true;',
    'const words = withheld.filter((t) => !/^\\d+$/.test(t));',
    'const bare = buildNameSearch(words, []);',
    'const search = buildNameSearch(words, opens);',
    'if (!bare || !bare.hit(text)) return false;',
    'if (search && search.hit(text)) return true;',
    'const holders = opens.filter((n) => text.includes(n) && bare.hit(n));',
    "return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));",
    'const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));',
    "return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];",
  ];
  const TEST = readFileSync(`${SRC}/tests/security/galleryVeilRecent.pglite.test.js`, 'utf8');
  const notCopied = COPIED.filter((l) => !TEST.includes(l));
  if (notCopied.length) throw new Error(`STOP: a carried line is not in galleryVeilRecent.pglite.test.js: ${notCopied.join(' || ')}`);

  // ── the server (local cluster), one database per shard (wd's)
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`;
  if (!/^v43x/.test(dbn)) throw new Error(`database prefix must be v43x: ${dbn}`);
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const uid = (a, b) => `abcd52${String(SHARD[0]).padStart(2, '0')}-${String(a).padStart(4, '0')}-0000-0000-${String(b).padStart(12, '0')}`;

  const out = { meta: { form: FORM, shard: SHARD, g: G, ticks: TICKS, plant: PLANT, src: SRC, started: new Date(T0).toISOString() }, campaigns: [], reads: 0, noWorld: {},
    hits: {}, publishPath: {}, worldBytes: [], sectionsOn: {}, plant: { done: false, campaign: null, expect: {}, caught: {}, refused: {} }, pulseErrors: [], personSubstrOnly: {}, sectionsRefused: {} };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const WRE = new Map(); const wordRe = (n) => { if (!WRE.has(n)) WRE.set(n, new RegExp(`(?<![\\p{L}\\p{N}])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u')); return WRE.get(n); };
  const walk = (v, p, strs, keys, objs) => {
    if (typeof v === 'string') strs.push([p, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, strs, keys, objs));
    else if (isRec(v)) { objs.push([p, v]); for (const [k, x] of Object.entries(v)) { const q = p ? `${p}.${k}` : k; keys.push([q, k]); walk(x, q, strs, keys, objs); } }
  };
  const SKEYS = ['npcs', 'institutions', 'powerStructure', 'factions', 'economy', 'relationships', 'publicProse'];
  const RULESON = Object.fromEntries(Object.entries(RULES.DEFAULT_SIMULATION_RULES).map(([k, v]) => [k, /Enabled$/.test(k) && typeof v === 'boolean' ? true : v]));
  const ALL5 = { worldClock: true, chronicle: true, pantheon: true, warNetwork: true, dashboard: true };
  const SECTIONS = Object.keys(ALL5);

  // the shard's documents, in pool order
  const stored = process.env.RV9_STORED_DIR;
  const docs = E.pool(Number(process.env.RV9_N || 2), SHARD).map((b) => ({ seed: b.seed, doc: JSON.parse(readFileSync(`${stored}/${b.seed}.json`, 'utf8')) }));
  for (let c0 = 0, ci = 0; c0 < docs.length; c0 += G, ci += 1) {
    const group = docs.slice(c0, c0 + G);
    const ids = group.map((_, k) => uid(ci, k + 1));
    const saves = group.map((m, k) => ({ id: ids[k], name: m.doc.name, phase: 'canon', settlement: clone(m.doc), campaignState: { phase: 'canon', eventLog: [], locks: {} } }));
    const edges = []; const channels = [];
    for (let k = 0; k + 1 < ids.length; k += 1) {
      const rival = k + 2 === ids.length && ids.length > 2;
      edges.push({ id: `edge.${k}`, from: ids[k], to: ids[k + 1], relationshipType: rival ? 'rival' : 'trade_partner' });
      channels.push({ type: rival ? 'resource_competition' : 'trade_route', from: ids[k], to: ids[k + 1], status: 'confirmed' });
    }
    let campaign = { id: `snap-${group[0].seed}`, name: 'Snap', settlementIds: ids,
      worldState: { rngSeed: `snap-${group[0].seed}`, tick: 0, simulationRules: RULESON, stressors: [] },
      regionalGraph: RG.ensureRegionalGraph({ edges, channels }), wizardNews: { currentTick: 0, entries: [] } };
    const p0 = Date.now(); let ticks = 0;
    try {
      for (let t = 0; t < TICKS; t += 1) {
        const r = W.advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: NOW });
        campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
        for (const u of arr(r.settlementUpdates)) { const s = saves.find((x) => x.id === u.saveId); if (s && isRec(u.settlement)) s.settlement = u.settlement; }
        ticks += 1;
      }
    } catch (e) { out.pulseErrors.push({ campaign: campaign.id, tick: ticks, err: String(e?.stack || e).slice(0, 400) }); }
    let snapshot = WS.serializeWorldSnapshotPublic(campaign.worldState, campaign.regionalGraph, saves, ALL5);
    const arc = RA.buildRealmArcSummary({ worldState: campaign.worldState, regionalGraph: campaign.regionalGraph, settlements: saves });
    for (const k of SECTIONS) if (snapshot[k] != null) bump(out.sectionsOn, k);
    // the plant: the first campaign with a hideable house
    let plantHouse = null; let plantPerson = null;
    if (PLANT && !out.plant.done) {
      for (const s of saves) { const hh = arr(s.settlement.institutions).find((h) => isRec(h) && E.isHideableHouse(h) && typeof h.name === 'string' && h.name); if (hh) { plantHouse = hh.name; break; } }
      if (plantHouse) {
        snapshot = clone(snapshot); snapshot.dashboard = isRec(snapshot.dashboard) ? snapshot.dashboard : {};
        snapshot.dashboard.realmArcLines = [...arr(snapshot.dashboard.realmArcLines), `${plantHouse} holds the docks`];
        snapshot.dashboard.plantCopy = { npcs: [{ name: 'P' }], institutions: [], publicProse: { blocks: [] } };
        out.plant.done = true; out.plant.campaign = campaign.id; out.plant.house = plantHouse;
      }
    }
    // the server: members as the owner's rows (each at a setting, below), the map published through publish_map
    for (const [k, s] of saves.entries()) {
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted','{}'::jsonb,false,true)`, [s.id, OWNER, s.settlement.name || 'x', JSON.stringify(s.settlement), `n${SHARD[0]}c${ci}m${k}`, `n${SHARD[0]}c${ci}m${k}l`]);
    }
    const mid = uid(ci, 0); const ms = `n${SHARD[0]}c${ci}map`;
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, unlisted_slug, visibility, gallery_importable) values ($1, $2, 'm', $3, $4, 'unlisted', true)`,
      [mid, OWNER, JSON.stringify({ campaign: { settlementIds: ids } }), `${ms}l`]);
    // the person plant needs a withheld person: written after the first read finds one (below), by a second publish
    // VEIL-52 23:1x (the first plant run: publish_map and 091's trigger REFUSE a snapshot carrying a denied key, e.g. the
    // section `chronicle` (089's /.*chronicle.*/)): the stored artifact is what the server's own check accepts: each section
    // alone through _gallery_world_snapshot_is_safe (the net-current definition), the refused ones dropped and recorded; each
    // plant part kept only if the planted snapshot still passes, else recorded as REFUSED BY THE SERVER (not blind).
    const safe = async (v) => (await db.query('select public._gallery_world_snapshot_is_safe($1::jsonb) ok', [JSON.stringify(v)])).rows[0].ok;
    for (const k of SECTIONS) if (k !== 'dashboard' && snapshot[k] != null && !(await safe({ schemaVersion: 1, [k]: snapshot[k] }))) { delete snapshot[k]; bump(out.sectionsRefused, k); }
    if (snapshot.dashboard != null) {
      const plain = { ...snapshot.dashboard }; delete plain.plantCopy; plain.realmArcLines = arr(plain.realmArcLines).filter((l) => !(plantHouse && l === `${plantHouse} holds the docks`));
      if (!(await safe({ schemaVersion: 1, dashboard: plain }))) { delete snapshot.dashboard; bump(out.sectionsRefused, 'dashboard'); }
      else if (plantHouse) {
        if (!(await safe({ schemaVersion: 1, dashboard: { ...plain, plantCopy: snapshot.dashboard.plantCopy } }))) { delete snapshot.dashboard.plantCopy; out.plant.refused.copy = true; }
        if (!(await safe({ schemaVersion: 1, dashboard: snapshot.dashboard }))) { snapshot.dashboard = plain; out.plant.refused.name = true; }
      }
    }
    const publish = async (snap) => {
      await db.query(`select set_config('test.uid', $1, false)`, [OWNER]);
      try {
        await db.query('select public.publish_map($1::uuid, $2, $3, null, true, null, null, true, $4::jsonb, $5::jsonb, $6, null)', [mid, 'map_with_campaign', 'd', JSON.stringify(SECTIONS), JSON.stringify(snap), arc || null]);
        bump(out.publishPath, 'publish_map');
      } catch (e) {
        // a refusal is recorded; the stored artifact is then written as the client's direct patch writes it (gallery.js :: the unlisted patch)
        bump(out.publishPath, `refused: ${String(e.message).slice(0, 80)}`);
        await db.query(`update public.saved_maps set is_public = true, public_slug = coalesce(public_slug, $2), share_kind = 'map_with_campaign', gallery_share_campaign = true,
          gallery_share_world = true, gallery_world_sections = $3::jsonb, gallery_world_snapshot = $4::jsonb, gallery_realm_arc_summary = $5 where id = $1`, [mid, ms, JSON.stringify(SECTIONS), JSON.stringify(snap), arc || null]);
      }
      await db.query(`select set_config('test.uid', '', false)`);
      return (await db.query('select public_slug s from public.saved_maps where id = $1', [mid])).rows[0]?.s;
    };
    let slug = await publish(snapshot);
    await db.query(`update public.saved_maps set unlisted_slug = $2, visibility = 'unlisted' where id = $1`, [mid, `${ms}l`]);
    const camp = { id: campaign.id, seeds: group.map((m) => m.seed), ticks, pulseMs: Date.now() - p0, hidden: 0, reads: 0, worldBytes: JSON.stringify(snapshot).length };
    out.worldBytes.push(camp.worldBytes);
    camp.hidden = saves.filter((s) => arr(s.settlement.institutions).some((h) => isRec(h) && E.isHideableHouse(h))).length;
    // every member's setting keys, both Reveals; read j sets member m to its (j mod n)-th key
    for (const dm of [false, true]) {
      const keysOf = saves.map((s) => Object.keys(V.settings(s.settlement, dm).deltas).filter((k) => k !== 'g:111'));
      const nj = Math.max(...keysOf.map((k) => k.length));
      for (let j = 0; j < nj; j += 1) {
        const keyAt = saves.map((s, m) => keysOf[m][j % keysOf[m].length]);
        for (const [m, s] of saves.entries()) await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [s.id, JSON.stringify(V.write(V.settings(s.settlement, dm).deltas[keyAt[m]])), dm]);
        const gm = (await db.query('select public.get_gallery_map($1) d', [slug])).rows[0]?.d;
        await db.query(`select set_config('test.uid', $1, false)`, [READER]);
        const im = (await db.query('select public.import_gallery_map($1) d', [slug])).rows[0]?.d;
        await db.query(`select set_config('test.uid', '', false)`);
        const um = (await db.query('select public.get_unlisted_map($1) d', [`${ms}l`])).rows[0]?.d;
        // the withheld sets of this read, from each member AS THE MAP MEMBER SERVES IT
        const servedById = new Map(arr(gm?.members).filter(isRec).map((x) => [x.old_id, x.settlement]));
        const wh = []; const persons = new Map(); const ids2 = new Set(); const servedDocs = [];
        for (const s of saves) {
          const d = servedById.get(s.id); servedDocs.push(d);
          if (!isRec(d)) { bump(out.noWorld, `member-not-served|dm=${dm}`); continue; }
          const w = withheldAllOf(s.settlement, d); wh.push(...w);
          const sp = new Set(arr(d.npcs).filter(isRec).map((n) => n.name));
          for (const n of arr(s.settlement.npcs)) if (isRec(n) && typeof n.name === 'string' && n.name.length >= 3) {
            const served = sp.has(n.name); if (!persons.has(n.name) || !served) persons.set(n.name, served ? 'person-served' : 'person-withheld');
            if (!served && n.id != null && n.id !== '') ids2.add(String(n.id));
          }
          for (const f of listsOf(s.settlement)) if ([f.faction, f.name].some((x) => typeof x === 'string' && w.includes(x)) && f.id != null) ids2.add(String(f.id));
        }
        // a name ANY member serves is open on this map (the members' union is the open set)
        const openDoc = { institutions: servedDocs.filter(isRec).flatMap((d) => arr(d.institutions)), factions: servedDocs.filter(isRec).flatMap((d) => listsOf(d)) };
        const openNames = new Set(servedNamesOf(openDoc));
        const whs = [...new Set(wh)].filter((n) => !openNames.has(n));
        // the plant's person: the first withheld person of the first read, published once into the chronicle-style line
        // VEIL-55 (00:16): the person plant goes on the FIRST campaign, any campaign, where a read withholds a person
        if (PLANT && !out.plant.personDone && !plantPerson) {
          plantPerson = [...persons.entries()].find(([, k]) => k === 'person-withheld')?.[0] || null;
          if (plantPerson) {
            const withP = clone(snapshot); withP.dashboard = isRec(withP.dashboard) ? withP.dashboard : {}; withP.dashboard.realmArcLines = [...arr(withP.dashboard.realmArcLines), `${plantPerson} was seen`];
            out.plant.person = plantPerson; out.plant.personDone = true; out.plant.personCampaign = campaign.id;
            if (await safe(withP)) { snapshot = withP; slug = await publish(snapshot); j -= 1; continue; } // re-read this setting with the person planted
            out.plant.refused.person = true;
          }
        }
        const worlds = [['gallery_map', { world: gm?.world, realmArcSummary: gm?.realmArcSummary }], ['import_map', { world: im?.world, realmArcSummary: im?.realmArcSummary }],
          ['unlisted_map', { world_snapshot: um?.world_snapshot, world_sections: um?.world_sections, realm_arc_summary: um?.realm_arc_summary }]];
        for (const [door, w] of worlds) {
          out.reads += 1; camp.reads += 1;
          if (!Object.values(w).some((v) => v != null)) { bump(out.noWorld, `${door}|dm=${dm}`); continue; }
          const strs = []; const keys = []; const objs = []; walk(w, '', strs, keys, objs);
          const readHits = []; const hit = (q, kind, ex) => { readHits.push([q, kind, String(ex)]); const pat = norm(q); const h = (out.hits[`${pat}|${kind}`] ||= { pat, kind, reads: 0, campaigns: {}, doors: {}, ex: null }); h.reads += 1; h.campaigns[campaign.id] = 1; bump(h.doors, `${door}|dm=${dm}`); if (!h.ex) h.ex = { campaign: campaign.id, dm, door, text: String(ex).slice(0, 240), wh: whs.slice(0, 6) }; };
          for (const [q, o] of objs) {
            const n = SKEYS.filter((k) => Object.prototype.hasOwnProperty.call(o, k)).length;
            if (n >= 2 || saves.some((s) => JSON.stringify(s.settlement) === JSON.stringify(o))) hit(q, 'copy', Object.keys(o).slice(0, 8).join(','));
          }
          for (const [q, k] of keys) { if (k === 'publicProse') hit(q, 'ppkey', k); if (ids2.has(k)) hit(q, 'id-key', k); }
          const pre = buildNameSearch(whs.filter((t) => !/^\d+$/.test(t)), []);
          for (const [q, s] of strs) {
            if (ids2.has(s)) hit(q, 'id-text', s);
            // a withheld power or house: judged against every member's served document (a name one member serves is open)
            if ((whs.includes(s) || (pre && pre.hit(s))) && namesWithheld(s, whs, openDoc)) hit(q, 'name', s);
            // a person's name as a WHOLE WORD (no letter or digit on either side; VEIL-50's change); the old substring match's extra hits are counted
            for (const [pn, kind] of persons) { const sub = s.includes(pn); if (!sub) continue; if (wordRe(pn).test(s)) hit(q, kind, s); else bump(out.personSubstrOnly, kind); }
          }
          if (PLANT && plantPerson && out.plant.personCampaign === campaign.id) { const t = `${door}|dm=${dm}`; // the person plant, on its own campaign
            if (strs.some(([, x]) => x.includes(`${plantPerson} was seen`)) && persons.get(plantPerson) === 'person-withheld') { bump(out.plant.expect, `person|${t}`); if (readHits.some(([q, k, x]) => k === 'person-withheld' && x.includes(`${plantPerson} was seen`))) bump(out.plant.caught, `person|${t}`); } }
          if (PLANT && out.plant.campaign === campaign.id) { // EXPECT = the plant is served on this read (and withheld); CAUGHT = the instrument's own hit on it
            const t = `${door}|dm=${dm}`;
            const has = (txt) => strs.some(([, x]) => x.includes(txt));
            const got = (kind, f) => readHits.some(([q, k, x]) => k === kind && f(q, x));
            if (plantHouse && has(`${plantHouse} holds the docks`) && whs.includes(plantHouse)) { bump(out.plant.expect, `name|${t}`); if (got('name', (q, x) => x.includes(`${plantHouse} holds the docks`))) bump(out.plant.caught, `name|${t}`); }
            if (false && plantPerson && has(`${plantPerson} was seen`) && persons.get(plantPerson) === 'person-withheld') { bump(out.plant.expect, `person|${t}`); if (got('person-withheld', (q, x) => x.includes(`${plantPerson} was seen`))) bump(out.plant.caught, `person|${t}`); }
            if (objs.some(([q]) => /plantCopy$/.test(q))) { bump(out.plant.expect, `copy|${t}`); if (got('copy', (q) => /plantCopy$/.test(q))) bump(out.plant.caught, `copy|${t}`); }
            if (keys.some(([q, k]) => k === 'publicProse' && /plantCopy/.test(q))) { bump(out.plant.expect, `ppkey|${t}`); if (got('ppkey', (q) => /plantCopy/.test(q))) bump(out.plant.caught, `ppkey|${t}`); }
          }
        }
      }
    }
    await db.query('delete from public.saved_maps where id = $1', [mid]);
    await db.query('delete from public.settlements where id = any($1::uuid[])', [ids]);
    out.campaigns.push(camp);
  }
  await db.end();
  const ad = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await ad.connect(); await ad.query(`drop database if exists ${dbn} with (force)`); await ad.end();
  out.meta.ended = new Date().toISOString(); out.meta.ms = Date.now() - T0;
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
