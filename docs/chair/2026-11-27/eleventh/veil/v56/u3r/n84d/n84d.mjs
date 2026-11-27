// U3R, N84 (d): THE CHRONICLE AFTER THE RE-KEY, measured before it is built. doors-3's _gallery_doors_chronicle
// (3e1115c81) installed beside the R4-IDS chain (v52dsql = v27x211 + unit 3's 212); for each stored town, a planted log of
// two entries: (1) ADD_NPC on a person the link's body SHOWS (by name), its summary naming them; (2) a PLAGUE naming no one
// (the control). The chronicle is asked with the link's own inputs (pub = the sanitiser's projection, v = _gallery_veil(pub,
// {}, true), share_dm false, not frozen). Counted: towns; entry (1) served; entry (2) served. If (1) goes where its person
// is shown, the re-key made every person read as gone (proj's ids against the body's re-keyed ids).
import { readFileSync, readdirSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const DIR = process.argv[2]; const DB = process.argv[3] || 'u3r_n84d';
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
const idx = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index);
const out = { towns: 0, noShown: 0, shownServed: 0, shownWithheld: 0, controlServed: 0, controlWithheld: 0, chronNull: 0, ex: [] };
for (const j of idx) {
  const town = JSON.parse(readFileSync(`${DIR}/${j.seed}.json`, 'utf8'));
  const r = (await db.query(`select pub, v, v -> 'body' as body from (select pub, public._gallery_veil(pub, '{}'::jsonb, true) as v from (select public._gallery_sanitize_public_json($1::jsonb) as pub) a) b`, [JSON.stringify(town)])).rows[0];
  const shown = (r.body?.npcs || []).map((n) => n?.name).filter((n) => typeof n === 'string' && n.length > 3);
  out.towns += 1;
  if (!shown.length) { out.noShown += 1; continue; }
  const P = shown[0]; const slug = P.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const log = [
    { id: 'e1', type: 'ADD_NPC', event: { type: 'ADD_NPC', targetId: `npc.${slug}` }, narrativeSummary: `${P} arrived to stay.`, timestamp: '2026-10-01T00:00:00.000Z' },
    { id: 'e2', type: 'PLAGUE', event: { type: 'PLAGUE', targetId: 'plague' }, narrativeSummary: 'A fever came with the rains.', timestamp: '2026-10-02T00:00:00.000Z' },
  ];
  const c = (await db.query(`select public._gallery_doors_chronicle($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb, false, null) as c`, [JSON.stringify(log), JSON.stringify(r.pub), JSON.stringify(r.v), JSON.stringify(town)])).rows[0].c;
  if (!Array.isArray(c)) { out.chronNull += 1; continue; }
  // THE TOOTH: the same call with the body's person ids put back to the projection's (by name): if (1) is served there,
  // the re-key is the cause
  const byName = new Map((r.pub?.npcs || []).filter((n) => n && n.name).map((n) => [n.name, n.id]));
  const v2 = JSON.parse(JSON.stringify(r.v)); for (const n of v2.body?.npcs || []) if (n && byName.has(n.name)) n.id = byName.get(n.name);
  const c2 = (await db.query(`select public._gallery_doors_chronicle($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb, false, null) as c`, [JSON.stringify(log), JSON.stringify(r.pub), JSON.stringify(v2), JSON.stringify(town)])).rows[0].c;
  if (Array.isArray(c2) && c2.some((e) => e.narrativeSummary === log[0].narrativeSummary)) out.toothServed = (out.toothServed || 0) + 1; else out.toothWithheld = (out.toothWithheld || 0) + 1;
  const got = new Set(c.map((e) => e.narrativeSummary));
  if (got.has(log[0].narrativeSummary)) out.shownServed += 1; else { out.shownWithheld += 1; if (out.ex.length < 5) out.ex.push(`${j.seed}: "${P}" shown in the body; its ADD_NPC entry withheld`); }
  if (got.has(log[1].narrativeSummary)) out.controlServed += 1; else out.controlWithheld += 1;
}
console.log(JSON.stringify(out, null, 1));
await db.end();
