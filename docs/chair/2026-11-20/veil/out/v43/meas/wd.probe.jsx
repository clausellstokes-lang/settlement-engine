// V43-MEASURE ("DAILY" and "NAMES", unit (1)(e) and (f); brief docs/chair/2026-11-20/veil/briefs/V43-MEASURE-BRIEF.md at 5de9073eb).
// A COPY OF tell2.probe.jsx's `towns` MODE (out/v27/tell2/measure): the gate's 140 births (tell-common.mjs :: pool, N=2; its
// 92 hidden-house towns and 48 controls), every setting tell-common.mjs :: settings computes (own, g:000..g:110, allOpen, off;
// g:111 = own, skipped as tell2 skips it), Reveal DM off and on, BOTH ENGINES: the twin (projectShareVeil over
// galleryPayloadFor) and the server on the local cluster (createdb -T v28tpl). EVERY DOOR the instrument reaches:
//   server  gallery (get_gallery_dossier), link (get_unlisted_dossier -> 'dossier'), import (import_gallery_dossier, as the
//           reader 2222...), map (get_gallery_map's member, #> '{members,0,settlement}')
//   twin    gallery (Reveal as set), link (Reveal off: the player view, as galleryVeilRecent.pglite.test.js pairs it; the
//           twin's import is its gallery document and its map member its link document, so each is read once)
// RV9_FORM=born   each birth as tell-common.mjs :: birth makes it (born, not saved).
// RV9_FORM=stored each birth AS saves.js STORES IT: the lane's round trip, out/v33/legacy/dump.probe.jsx (veil-42's
//                 r4ids-wip branch, run unchanged with LP_A=0 LP_B=0), read from RV9_STORED_DIR/<seed>.json; the born
//                 document is also made and compared with it byte for byte.
// THE JUDGMENT IS THE LANE'S, NOT BUILT HERE: withheldOf, withheldAllOf, servedNamesOf, namesWithheld and THE NEVER-THERE
// RECORD are tests/security/galleryVeilRecent.pglite.test.js's (its THE DIFFERENTIAL arm, lines 154-187, 414-418, 465-469),
// carried line for line (not exported from a test file) and CHECKED against that file's bytes at start (COPIED below).
// The fold is imported: src/domain/display/gallerySecondHomes.js :: buildNameSearch.
// A HIDING READ = a read where withheldAllOf(stored, served) is non-empty (the arm's own `if (!wh.length) continue`).
// THE NEVER-THERE READ: the never-there record read the same way: same engine, door, Reveal, and the same setting key
// computed on the never-there record (tell-common.mjs :: settings).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, norm } from '../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const FORM = process.env.RV9_FORM || 'born';
const PICK = Number(process.env.RV9_PICK || 1);
const DAILY = process.env.WD_DAILY === '1'; // the chair's N91: step 1 "DAILY" is WITHDRAWN; NAMES only by default // the cost shard: every PICK-th birth of the shard
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';

it(`V43-MEASURE wd (${FORM})`, async () => {
  const T0 = Date.now();
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const FOLD = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  /** The imported fold, memoized by its arguments (the carried lines call it per string; same result, built once). */
  const MEMO = new Map();
  const buildNameSearch = (names, opens) => { const k = JSON.stringify([names, opens]); if (!MEMO.has(k)) { if (MEMO.size > 5000) MEMO.clear(); MEMO.set(k, FOLD.buildNameSearch(names, opens)); } return MEMO.get(k); };
  const DL = await import(`${SRC}/src/domain/dailyLife.js`);
  const { COMMONER_RESENTMENTS } = await import(`${SRC}/src/data/dailyLife/commonerResentments.js`);
  const PR = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const arr = (v) => (Array.isArray(v) ? v : []);
  // ── THE LANE'S JUDGMENT, carried line for line from galleryVeilRecent.pglite.test.js (checked below)
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
  const neverOf = (t, wh) => {
    const never = clone(t);
    never.institutions = arr(never.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
    const keep = (f) => !(isRec(f) && [f.faction, f.name].some((n) => typeof n === 'string' && wh.includes(n)));
    if (isRec(never.powerStructure)) never.powerStructure.factions = arr(never.powerStructure.factions).filter(keep);
    if (Array.isArray(never.factions)) never.factions = never.factions.filter(keep);
    return never;
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
    'never.institutions = arr(never.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));',
    "const keep = (f) => !(isRec(f) && [f.faction, f.name].some((n) => typeof n === 'string' && wh.includes(n)));",
    'if (isRec(never.powerStructure)) never.powerStructure.factions = arr(never.powerStructure.factions).filter(keep);',
    'if (Array.isArray(never.factions)) never.factions = never.factions.filter(keep);',
  ];
  const TEST = readFileSync(`${SRC}/tests/security/galleryVeilRecent.pglite.test.js`, 'utf8');
  const notCopied = COPIED.filter((l) => !TEST.includes(l));
  if (notCopied.length) throw new Error(`STOP: a carried line is not in galleryVeilRecent.pglite.test.js: ${notCopied.join(' || ')}`);

  // ── the office lines (L8..L11; L12 is NOT BUILT)
  const LINES = Object.values(COMMONER_RESENTMENTS).flatMap((b) => arr(b)).filter(isRec);
  const OFFICE = LINES.filter((l) => ['L8', 'L9', 'L10', 'L11'].includes(l.id));
  const officeOf = (text) => (typeof text === 'string' ? OFFICE.filter((l) => text.includes(l.text)).map((l) => l.id).join('+') || null : null);
  const OWNER_SLOT = 'commoner_resentments_dm';

  // ── the server (local cluster), one database per shard
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`;
  if (!/^v43x/.test(dbn)) throw new Error(`database prefix must be v43x: ${dbn}`);
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0; let srvMs = 0;
  /** One server read of a record at one setting: every door. */
  const serverAll = async (rec, dm, ov) => {
    const s0 = Date.now();
    nrow += 1; const id = `abcd7f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `w${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const gallery = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    const link = (await db.query("select public.get_unlisted_dossier($1) -> 'dossier' d", [`${sl}l`])).rows[0]?.d;
    await db.query(`select set_config('test.uid', $1, false)`, [READER]);
    const imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query(`select set_config('test.uid', '', false)`);
    await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
      values ($1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`, `${sl}ml`]);
    const map = (await db.query("select public.get_gallery_map($1) #> '{members,0,settlement}' d", [`${sl}m`])).rows[0]?.d;
    await db.query('delete from public.saved_maps where public_slug = $1', [`${sl}m`]);
    await db.query('delete from public.settlements where id = $1', [id]);
    srvMs += Date.now() - s0;
    return { gallery, link, import: imp, map };
  };
  /** Every door of one record at one setting key and Reveal, both engines: [{ eng, door, d }]. */
  const SETS = new WeakMap();
  const settingsOf = (rec, dm) => { if (!SETS.has(rec)) SETS.set(rec, {}); const c = SETS.get(rec); if (!c[dm]) c[dm] = V.settings(rec, dm).deltas; return c[dm]; };
  const readDoors = async (rec, dm, key) => {
    const deltas = settingsOf(rec, dm)[key];
    const ov = V.write(deltas);
    const s = await serverAll(rec, dm, ov);
    const tw = V.twin(rec, dm, ov); const twOff = dm ? V.twin(rec, false, ov) : tw;
    return [['server', 'gallery', s.gallery], ['server', 'link', s.link], ['server', 'import', s.import], ['server', 'map', s.map], ['twin', 'gallery', tw], ['twin', 'link', twOff]]
      .map(([eng, door, d]) => ({ eng, door, d: isRec(d) ? d : null }));
  };

  // ── the tallies
  const out = { meta: { form: FORM, shard: SHARD, pick: PICK, src: SRC, started: new Date(T0).toISOString() }, places: [], reads: 0, noDoc: {}, hiding: 0, hidingBy: {},
    daily: {}, dailyPairs: {}, dailyPage: {}, dailyPagePairs: {}, office: { hidingServed: {}, hidingNever: {}, differ: 0, pair: null },
    dmSlot: { inSlots: 0, asKey: 0, keyPaths: {} }, ownerish: {}, names: {}, mapKnown: {}, mapOther: [], neverDangling: 0, neverReads: 0,
    storedVsBorn: { same: 0, differ: 0, diffSeeds: [] }, neighbour: 0, l12: LINES.some((l) => l.id === 'L12') };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const OWNERISH = /audience|owner|^dm|_dm$|dmOnly|dm_only|dmLayer|isDm|gmOnly/i;
  /** Every string leaf and every key of a document, with its path. */
  const walk = (v, p, strs, keys) => {
    if (typeof v === 'string') strs.push([p, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, strs, keys));
    else if (isRec(v)) for (const [k, x] of Object.entries(v)) { const q = p ? `${p}.${k}` : k; keys.push([q, k]); walk(x, q, strs, keys); }
  };
  const idOfHouse = (h) => { try { return V.veil.CARD_KINDS.institution.idOf(h); } catch { return null; } };
  /** The ids of the rows and persons a read withholds (as strings): powers (withheldOf's ids), houses, persons. */
  const withheldIds = (stored, d, wh) => {
    const ids = new Set();
    for (const f of listsOf(stored)) if ([f.faction, f.name].some((n) => typeof n === 'string' && wh.includes(n)) && f.id != null) ids.add(String(f.id));
    for (const h of arr(stored.institutions)) if (isRec(h) && wh.includes(h.name)) for (const v of [h.id, idOfHouse(h)]) if (v != null && v !== '') ids.add(String(v));
    const servedPeople = new Set(arr(d?.npcs).filter(isRec).map((n) => n.name));
    for (const n of arr(stored.npcs)) if (isRec(n) && typeof n.name === 'string' && !servedPeople.has(n.name) && n.id != null && n.id !== '') ids.add(String(n.id));
    return ids;
  };

  const stored = FORM === 'stored' ? process.env.RV9_STORED_DIR : null;
  let i = -1;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    i += 1; if (i % PICK !== 0) continue;
    const p0 = Date.now();
    const born = E.birth(b.cfg, b.seed, null);
    if (isRec(born.neighborRelationship) && born.neighborRelationship.name) out.neighbour += 1;
    let doc = born;
    if (stored) {
      doc = JSON.parse(readFileSync(`${stored}/${b.seed}.json`, 'utf8'));
      if (JSON.stringify(doc) === JSON.stringify(born)) out.storedVsBorn.same += 1; else { out.storedVsBorn.differ += 1; out.storedVsBorn.diffSeeds.push(b.seed); }
    }
    const hidden = arr(doc.institutions).filter((h) => isRec(h) && E.isHideableHouse(h)).map((h) => h.name);
    const place = { seed: b.seed, size: b.size, hidden: hidden.length, hidingReads: 0 };
    for (const dm of [false, true]) {
      for (const key of Object.keys(settingsOf(doc, dm))) {
        if (key === 'g:111') continue;
        const reads = await readDoors(doc, dm, key);
        const nevers = new Map(); // wh -> the never-there record's reads
        for (const { eng, door, d } of reads) {
          const tag = `${eng}|${door}`;
          out.reads += 1;
          if (!d) { bump(out.noDoc, `${tag}|dm=${dm}`); continue; }
          // the owner-only slot and anything a reader's derivation could take for the owner's (EVERY read)
          const mine = DAILY ? DL.deriveDailyLife(d, null) : null;
          if (mine && Object.prototype.hasOwnProperty.call(mine.slots, OWNER_SLOT)) out.dmSlot.inSlots += 1;
          const strs = []; const keys = []; walk(d, '', strs, keys);
          for (const [q, k] of keys) {
            if (k === OWNER_SLOT) { out.dmSlot.asKey += 1; bump(out.dmSlot.keyPaths, norm(q)); }
            if (OWNERISH.test(k)) { const o = (out.ownerish[norm(q)] ||= { n: 0, doors: {} }); o.n += 1; bump(o.doors, `${tag}|dm=${dm}`); }
          }
          const wh = withheldAllOf(doc, d);
          if (!wh.length) continue;
          out.hiding += 1; place.hidingReads += 1; bump(out.hidingBy, `${tag}|dm=${dm}`);
          if (DAILY) { // ── DAILY (withdrawn, the chair's N91: off unless WD_DAILY=1; never run)
          // the never-there place, read the same way
          const whk = JSON.stringify([...wh].sort());
          if (!nevers.has(whk)) {
            const nrec = neverOf(doc, wh);
            const nreads = await readDoors(nrec, dm, key);
            // N63: does the never-there record still carry the withheld names in its own strings (a roster no open place shows)?
            const ns = []; walk(nrec, '', ns, []);
            const npre = buildNameSearch(wh.filter((t) => !/^\d+$/.test(t)), []);
            const dangling = ns.some(([, s]) => (wh.includes(s) || (npre && npre.hit(s))) && namesWithheld(s, wh, nrec));
            out.neverReads += 1; if (dangling) out.neverDangling += 1;
            nevers.set(whk, nreads);
          }
          const nd = nevers.get(whk).find((r) => r.eng === eng && r.door === door)?.d;
          if (!nd) bump(out.noDoc, `never|${tag}|dm=${dm}`);
          else {
          const theirs = DL.deriveDailyLife(nd, null).slots;
          for (const slot of DL.DAILY_LIFE_SLOTS) {
            const a = mine.slots[slot]?.text ?? null; const c = theirs[slot]?.text ?? null;
            const by = (out.daily[slot] ||= { differ: 0, reads: 0 }); by.reads += 1;
            if (a !== c) { by.differ += 1; if (!out.dailyPairs[slot]) out.dailyPairs[slot] = { served: a, never: c, seed: b.seed, setting: key, dm, eng, door }; }
          }
          const oa = officeOf(mine.slots.commoner_resentments?.text); const oc = officeOf(theirs.commoner_resentments?.text);
          if (oa) bump(out.office.hidingServed, oa); if (oc) bump(out.office.hidingNever, oc);
          if ((oa || oc) && oa !== oc) { out.office.differ += 1; if (!out.office.pair) out.office.pair = { served: mine.slots.commoner_resentments?.text, never: theirs.commoner_resentments?.text, seed: b.seed, setting: key, dm, eng, door }; }
          // side count: the page's re-derivation first (gallery.js hands the page rederiveForPage(...) of the served document)
          const pa = DL.deriveDailyLife(PR.rederiveForPage(clone(d)), null).slots; const pc = DL.deriveDailyLife(PR.rederiveForPage(clone(nd)), null).slots;
          for (const slot of DL.DAILY_LIFE_SLOTS) {
            const a = pa[slot]?.text ?? null; const c = pc[slot]?.text ?? null;
            if (a !== c) { bump(out.dailyPage, slot); if (!out.dailyPagePairs[slot]) out.dailyPagePairs[slot] = { served: a, never: c, seed: b.seed, setting: key, dm, eng, door }; }
          }
          } } // the DAILY block
          // ── NAMES: every served string by the lane's fold; the withheld ids as strings and as keys
          const ids = withheldIds(doc, d, wh);
          const hit = (q, kind, ex) => {
            const pat = norm(q); const h = (out.names[`${pat}|${kind}`] ||= { pat, kind, reads: 0, places: {}, doors: {}, ex: null });
            h.reads += 1; h.places[b.seed] = 1; bump(h.doors, `${tag}|dm=${dm}`); if (!h.ex) h.ex = { seed: b.seed, setting: key, dm, eng, door, text: String(ex).slice(0, 240), wh: wh.slice(0, 6) };
            if (door === 'map' && eng === 'server') {
              // the map member never reads gallery_share_dm (211): it is served at Reveal off whatever the row's flag
              const known = /(^|\.)(prominentRelationship|pressureSentence)(\.|\[|$)/.test(q);
              if (known) bump(out.mapKnown, `${pat}|${kind}|row dm=${dm}`); else out.mapOther.push({ pat, kind, seed: b.seed, setting: key, dm, text: String(ex).slice(0, 200) });
            }
          };
          const pre = buildNameSearch(wh.filter((t) => !/^\d+$/.test(t)), []); // namesWithheld's own first test, hoisted
          for (const [q, s] of strs) {
            if (ids.has(s)) hit(q, 'id-text', s);
            else if ((wh.includes(s) || (pre && pre.hit(s))) && namesWithheld(s, wh, d)) hit(q, 'name', s);
          }
          for (const [q, k] of keys) if (ids.has(k)) hit(q, 'id-key', k);
        }
      }
    }
    place.ms = Date.now() - p0; out.places.push(place);
  }
  await db.end();
  const ad = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await ad.connect(); await ad.query(`drop database if exists ${dbn} with (force)`); await ad.end();
  out.meta.ended = new Date().toISOString(); out.meta.ms = Date.now() - T0; out.meta.srvMs = srvMs;
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
