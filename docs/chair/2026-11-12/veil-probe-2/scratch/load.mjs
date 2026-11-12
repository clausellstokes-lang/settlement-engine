// node load.mjs <db> : put the Force-all row (every eye shut) at slugs fa-p / fa-l, and unmarked at fu-p / fu-l
import { readFileSync } from 'node:fs';
const pg = (await import(process.env.PG_MODULE)).default;
const S = process.env.S;
const db = new pg.Client({ database: process.argv[2] }); await db.connect();
const rec = readFileSync(`${S}/fa-rec.json`, 'utf-8');
await db.query("delete from public.settlements where public_slug in ('fa-p','fu-p','fd-p')");
const O = '11111111-1111-1111-1111-111111111111';
for (const [id, p, l, ov] of [['f0000000-0000-0000-0000-000000000001', 'fa-p', 'fa-l', readFileSync(`${S}/fa-all.json`, 'utf-8')],
  ['f0000000-0000-0000-0000-000000000002', 'fu-p', 'fu-l', '{}'], ['f0000000-0000-0000-0000-000000000003', 'fd-p', 'fd-l', readFileSync(`${S}/fa-def.json`, 'utf-8')]]) {
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides)
    values ($1,$2,'T','metropolis',$3,true,$4,now(),$5,'unlisted',$6)`, [id, O, rec, p, l, ov]);
}
console.log('loaded', process.argv[2]); await db.end();
