// c-today.mjs — R4I-SQL-2's second cure (ADDENDUM 2, N106), proof (c): NO TODAY-BORN READ MOVES. Run from the worktree root:
//   PGHOST=/var/tmp/rv7 PGUSER=postgres node docs/chair/2026-11-20/veil/out/v42/sql2/c-today.mjs <tplBefore> <tplAfter> <storedDir> <shard>/<n> <out.json>
// Every document of <storedDir> (the gate's 140 today-born births, /var/tmp/v18/out/v42/stored-today) in shard <shard> of <n>, Reveal DM
// off and on, the measure's 12 setting families (default, unmarked, own, g:000..g:110, allOpen, off: tell-common.mjs :: loadVeil's
// settings, as meas.probe.jsx builds them), each stored once in a database made from <tplBefore> and once in one made from <tplAfter>
// (local, sql2_c{a,b}_<shard>), read through get_gallery_dossier and get_unlisted_dossier. Each read's served document is hashed
// MODULO ITS PERSON-ID BIJECTION (personIdBijection.shared.mjs :: canonPeople: every read re-keys under a salt of its own) and the
// two databases' hashes compared read for read; THE CONTROL, rawDiffer: the raw documents differ (each read its own salt), so
// the reads are distinct reads and only the bijection makes them equal. Writes {reads, same, differ, rawDiffer, examples, faults}.
import pg from 'pg';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { canonPeople } from '../../../../../../../tests/security/personIdBijection.shared.mjs';
import { loadVeil } from '../../v27/tell/measure/tell-common.mjs';

const [tplA, tplB, dir, shardArg, outFile] = process.argv.slice(2);
const [S, N] = shardArg.split('/').map(Number);
const SRC = process.cwd();
const V = await loadVeil(SRC);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const hash = (d) => createHash('sha256').update(canon(isRec(d) ? canonPeople(d).doc : d)).digest('hex');

const files = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('index-') && !f.startsWith('meta')).sort();
const mine = files.filter((_f, i) => i % N === S);
const OWNER = '11111111-1111-1111-1111-111111111111';
const host = process.env.PGHOST || '/var/tmp/rv7';
const user = process.env.PGUSER || 'postgres';
const admin = new pg.Client({ host, user, database: 'postgres' });
await admin.connect();
const dbs = {};
for (const [k, tpl] of [['a', tplA], ['b', tplB]]) {
  const name = `sql2_c${k}_${S}`;
  await admin.query(`drop database if exists ${name} with (force)`);
  await admin.query(`create database ${name} template ${tpl}`);
  dbs[k] = new pg.Client({ host, user, database: name });
  await dbs[k].connect();
}
await admin.end();
const out = { shard: shardArg, docs: 0, reads: 0, same: 0, differ: 0, rawDiffer: 0, examples: [], faults: [] };
let nrow = 0;
const readBoth = async (rec, dm, ov) => {
  nrow += 1;
  const id = `5c2d0000-${String(S).padStart(4, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`;
  const sl = `c${S}x${nrow}`;
  const got = {};
  for (const k of ['a', 'b']) {
    const db = dbs[k];
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    try {
      got[k] = {
        gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d ?? null,
        link: (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${sl}l`])).rows[0]?.d ?? null,
      };
    } finally { await db.query('delete from public.settlements where id = $1', [id]); }
  }
  return got;
};
for (const f of mine) {
  const rec = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  out.docs += 1;
  for (const dm of [false, true]) {
    const fam = { default: V.veil.writeShareVeil({}, []), unmarked: {} };
    try {
      const st = V.settings(rec, dm);
      for (const k of Object.keys(st.deltas).filter((x) => x !== 'g:111')) fam[k] = V.write(st.deltas[k]);
    } catch (e) { out.faults.push(`${f} dm=${dm}: settings: ${String(e?.message || e).slice(0, 160)}`); }
    for (const [k, ov] of Object.entries(fam)) {
      const g = await readBoth(rec, dm, ov);
      for (const door of ['gallery', 'link']) {
        out.reads += 1;
        const ha = hash(g.a[door]); const hb = hash(g.b[door]);
        // the control: the raw documents (each read under its own salt) differ wherever a person id is served
        if (canon(g.a[door]) !== canon(g.b[door])) out.rawDiffer += 1;
        if (ha === hb) out.same += 1;
        else { out.differ += 1; if (out.examples.length < 10) out.examples.push(`${f} dm=${dm} ${k} ${door}: ${ha.slice(0, 12)} vs ${hb.slice(0, 12)}`); }
      }
    }
  }
}
for (const k of ['a', 'b']) await dbs[k].end();
writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(`shard ${shardArg}: docs ${out.docs}, reads ${out.reads}, same ${out.same}, differ ${out.differ} (raw documents differing, the control: ${out.rawDiffer}), faults ${out.faults.length}`);
process.exit(out.faults.length ? 2 : 0);
