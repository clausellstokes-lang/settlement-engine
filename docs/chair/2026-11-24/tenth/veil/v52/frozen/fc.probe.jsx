// FROZEN-COVERT MEASURE (VEIL-52; RULING V28 (2), "MEASURED BEFORE IT IS BUILT"). A MEASURE ONLY: no line of src/, supabase/
// or tests/ changes. A copy of VEIL-44's um.probe.jsx (6edc79094), run as um.sh runs it (fc.sh), cut to this question.
// THE FAULT (V28 F1): in SNAPSHOT mode a share's source is its FROZEN COPY ($veil.snapshot). Master's client stores
// galleryPayloadFor(settlement, ...) (toPublicSafe alone, which drops every nested object whose `covert` is true), so the copy
// holds no covert tie, 212 :: _gallery_apply_member_overrides's `dropped` is empty, and the covert tie's prominentRelationship
// and the pressureSentence that tells it pass at the three doors.
// PER STORED TOWN (every town of the set; the RED table reads the towns whose raw record holds a covert tie): the frozen copy
// built TWO ways, (M) master's galleryPayloadFor (FC_MASTER's tree) and (T) the tip's (RV6_SRC's tree), shareDm false, no
// overrides; stored as the owner's public row (gallery_share_dm false, ai_data null) with the $veil snapshot record, and one
// public map_with_campaign listing it; plus a LIVE-mode control (mode 'live', no snapshot). Read at Reveal off: the gallery
// read (get_gallery_dossier data), the import (import_gallery_dossier data, as the premium reader), the map member
// (get_gallery_map members[0].settlement), and the party link (get_unlisted_dossier -> dossier).
// THE ORACLE (not the rule): written here on its own, against the RAW stored town's covert ties; it imports nothing of 212's twin.
// THE PROPOSED RULE (offline, JS, no SQL): (a) the source's own covert ties, (b) PLUS the live stored row's covert ties, through
// the twin's own matching (withholdCovertCopies, called on a synthetic full town: the RULE's machinery, never the oracle's);
// (c) THE ORPHAN RULE; (d) a source carrying either string and no `relationships` key is unread. Out: FC_OUT.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const MASTER = process.env.FC_MASTER || '/home/user/wt/master';
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: false, default: null }));
vi.mock(`${process.env.FC_MASTER || '/home/user/wt/master'}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.FC_MASTER || '/home/user/wt/master'}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: false, default: null }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const S = (v) => (typeof v === 'string' ? v : '');
const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
const has = (o, k) => isRec(o) && Object.prototype.hasOwnProperty.call(o, k) && o[k] !== undefined && o[k] !== null;
const covertOf = (town) => (isRec(town) && Array.isArray(town.relationships) ? town.relationships.filter((t) => isRec(t) && t.covert === true) : []);
const AT = '2026-11-01T00:00:00.000Z';

// ── THE ORACLE (the RAW stored town says which strings tell a covert tie) ─────────────────────────────────────────────
// prominentRelationship TELLS a covert tie when it copies one: the same two ends (either order) and type
// (pr.npc1/npc2/type vs t.npc1Name/npc2Name/typeName), or pr.full === t.description, or pr.tension === t.tension.
const oraclePR = (pr, ties) => isRec(pr) && ties.some((t) => {
  const a = S(t.npc1Name); const b = S(t.npc2Name);
  const ends = a !== '' && b !== '' && S(pr.type) === S(t.typeName) && ((S(pr.npc1) === a && S(pr.npc2) === b) || (S(pr.npc1) === b && S(pr.npc2) === a));
  return ends || (S(pr.full) !== '' && pr.full === t.description) || (S(pr.tension) !== '' && pr.tension === t.tension);
});
// pressureSentence TELLS a covert tie when it names both ends (both names as written) or holds the tie's description or
// tension text (either holds the other: the sentence contains the text, or the text contains the whole sentence).
const oraclePS = (ps, ties) => typeof ps === 'string' && ps !== '' && ties.some((t) => {
  const a = S(t.npc1Name); const b = S(t.npc2Name);
  if (a !== '' && b !== '' && ps.includes(a) && ps.includes(b)) return true;
  return [S(t.description), S(t.tension)].some((x) => x !== '' && (ps.includes(x) || x.includes(ps)));
});

it('FROZEN-COVERT MEASURE (VEIL-52, RULING V28 (2))', async () => {
  const tip = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const mst = await import(`${MASTER}/src/domain/display/galleryVeil.js`);
  const { withholdCovertCopies } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`); // the RULE's machinery only

  // ── THE PROPOSED RULE, offline: which of the source's two strings each part withholds ──────────────────────────────
  const SENT = { prominentRelationship: 1, pressureSentence: 1 };
  const goes = (full) => { const r = withholdCovertCopies({ ...SENT }, full, false); return { pr: !('prominentRelationship' in r), ps: !('pressureSentence' in r) }; };
  const prCopiesTie = (pr, t) => isRec(t) && ((S(t.npc1Name) === S(pr.npc1) && S(t.npc2Name) === S(pr.npc2) && S(t.typeName) === S(pr.type))
    || (S(pr.full) !== '' && t.description === pr.full) || (S(pr.tension) !== '' && t.tension === pr.tension));
  const rule = (src, live) => {
    if (!isRec(src)) { const g = goes(src); return { A: g, AB: g, C: { pr: false, ps: false }, D: { pr: false, ps: false } }; }
    const base = { prominentRelationship: src.prominentRelationship, pressureSentence: src.pressureSentence };
    const relKey = Object.prototype.hasOwnProperty.call(src, 'relationships');
    const A = goes(relKey ? { ...base, relationships: src.relationships } : base);
    const liveTies = [...covertOf(live), ...(isRec(live?.ai_data) ? covertOf(live.ai_data.aiSettlement) : [])];
    const AB = goes({ ...base, relationships: Array.isArray(src.relationships) ? [...src.relationships, ...liveTies] : relKey ? src.relationships : liveTies });
    const orphan = isRec(src.prominentRelationship) && Array.isArray(src.relationships) && !src.relationships.some((t) => prCopiesTie(src.prominentRelationship, t));
    const unread = !relKey && (has(src, 'prominentRelationship') || has(src, 'pressureSentence'));
    return { A, AB, C: { pr: orphan, ps: orphan }, D: { pr: unread, ps: unread } };
  };

  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const DIR = process.env.RV9_STORED_DIR;
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index).sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  let docs = index.filter((_j, i) => i % SHARD[1] === SHARD[0]).map((j) => ({ seed: j.seed, doc: () => JSON.parse(readFileSync(`${DIR}/${j.seed}.json`, 'utf8')) }));
  if (process.env.MEAS_SEEDS) { const Q = new Set(process.env.MEAS_SEEDS.split(',')); docs = docs.filter((d) => Q.has(d.seed)); }

  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB || 'meas_fc'}_${SHARD[0]}`;
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
  await db.query(`update public.profiles set role = 'developer' where id = $1`, [READER]); await db.query(`select set_config('test.uid', '', false)`);

  const out = { src: SRC, master: MASTER, tpl: process.env.RV9_SERVER_TPL, set: DIR, shard: SHARD, docs: 0, faults: [], reads: [] };
  let nrow = 0;
  const prText = (pr) => (isRec(pr) ? `${S(pr.npc1)} / ${S(pr.npc2)} (${S(pr.type)}): ${S(pr.full) || S(pr.phrasing)}` : String(pr)).slice(0, 120);

  for (const d of docs) {
    let rec; try { rec = d.doc(); } catch (e) { out.faults.push(`${d.seed}: ${String(e?.message || e).slice(0, 160)}`); continue; }
    out.docs += 1;
    const raw = covertOf(rec);
    const rawPRtells = oraclePR(rec.prominentRelationship, raw); const rawPStells = oraclePS(rec.pressureSentence, raw);
    const copies = {};
    for (const [k, V] of [['M', mst], ['T', tip]]) {
      try { copies[k] = clone(V.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: null })); } catch (e) { out.faults.push(`${d.seed} ${k}: galleryPayloadFor: ${String(e?.message || e).slice(0, 140)}`); }
    }
    const modes = [
      ...['M', 'T'].filter((k) => copies[k]).map((k) => [k, { $veil: { v: 1, deltas: [], mode: 'snapshot', at: AT, snapshot: copies[k] } }, copies[k]]),
      ['live', { $veil: { v: 1, deltas: [], mode: 'live', at: AT } }, rec],
    ];
    for (const [copy, ov, source] of modes) {
      nrow += 1; const id = `abcd5200-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `f${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,false,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov)]);
      const mid = `abcd5201-${String(SHARD[0]).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`;
      await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable, unlisted_slug, visibility)
        values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true, true, $5, 'public')`, [mid, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`, `${sl}mu`]);
      const g = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
      const l = (await db.query('select public.get_unlisted_dossier($1) x', [`${sl}l`])).rows[0]?.x ?? null;
      const map = (await db.query('select public.get_gallery_map($1) x', [`${sl}m`])).rows[0]?.x ?? null;
      await db.query(`select set_config('test.uid', $1, false)`, [READER]);
      const imp = (await db.query('select to_jsonb(g) r from public.import_gallery_dossier($1) g', [sl])).rows[0]?.r ?? null;
      await db.query(`select set_config('test.uid', '', false)`);
      await db.query('delete from public.saved_maps where id = $1', [mid]); await db.query('delete from public.settlements where id = $1', [id]);
      const members = Array.isArray(map?.members) ? map.members.filter(isRec) : [];
      const bodies = { gallery: g?.data, import: imp?.data, map: members[0]?.settlement, link: l?.dossier };
      for (const [door, b] of Object.entries(bodies)) {
        const src = door === 'link' ? rec : source; // the link reads the live row in every mode
        const r = { seed: d.seed, covertTown: raw.length > 0, copy, door, body: isRec(b), rawPRtells, rawPStells };
        if (isRec(b)) {
          r.prIn = has(b, 'prominentRelationship'); r.psIn = has(b, 'pressureSentence');
          r.prTells = r.prIn && oraclePR(b.prominentRelationship, raw); r.psTells = r.psIn && oraclePS(b.pressureSentence, raw);
          // a cross-check by identity: the served string equals the raw stored string that tells
          r.prEqRawTell = r.prIn && rawPRtells && J(b.prominentRelationship) === J(rec.prominentRelationship);
          r.psEqRawTell = r.psIn && rawPStells && b.pressureSentence === rec.pressureSentence;
          r.rule = rule(src, rec);
          if (r.prIn) r.prText = prText(b.prominentRelationship);
          if (r.psIn) r.psText = S(b.pressureSentence).slice(0, 120);
          r.srcRel = isRec(src) && Object.prototype.hasOwnProperty.call(src, 'relationships') ? (Array.isArray(src.relationships) ? src.relationships.length : 'not-array') : 'absent';
        }
        out.reads.push(r);
      }
    }
    if (process.env.FC_OUT) writeFileSync(process.env.FC_OUT, JSON.stringify(out));
  }
  await db.end();
  out.done = true; if (process.env.FC_OUT) writeFileSync(process.env.FC_OUT, JSON.stringify(out));
}, 14_400_000);
