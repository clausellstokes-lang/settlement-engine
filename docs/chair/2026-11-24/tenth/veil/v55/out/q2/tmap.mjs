// VEIL-55: get_gallery_map timed on a 140-member map_with_campaign map (the today-born stored 140, unmarked), before (tip 212, v55u1)
// and after (unit 3's 212, v55u3a); three reads each, warm.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const D = '/var/tmp/v55/out/stored-today';
const files = readdirSync(D).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const env = { ...process.env, PGHOST: '/var/tmp/rv7', PGUSER: 'postgres' };
const psql = (db, sql) => execFileSync('psql', ['-X', '-q', '-At', '-v', 'ON_ERROR_STOP=1', '-d', db], { input: sql, env, maxBuffer: 1 << 28 }).toString();
const out = [];
for (const db of ['v55u1', 'v55u3a']) {
  psql(db, `delete from public.saved_maps where public_slug = 'v55tmap'; delete from public.settlements where public_slug like 'v55t%';`);
  const ids = [];
  files.forEach((f, i) => {
    writeFileSync('/tmp/claude-0/tdoc.json', readFileSync(`${D}/${f}`, 'utf8'));
    ids.push(psql(db, `\\set doc \`cat /tmp/claude-0/tdoc.json\`
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_importable)
values (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','t${i}','town',:'doc'::jsonb,true,'v55t${i}',now(),'{}'::jsonb,true) returning id;`).trim());
  });
  psql(db, `insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign)
values (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','m','${JSON.stringify({ campaign: { settlementIds: ids } })}'::jsonb,true,'v55tmap','map_with_campaign',true);`);
  const t = psql(db, `\\timing on
select jsonb_array_length(public.get_gallery_map('v55tmap')->'members');
select jsonb_array_length(public.get_gallery_map('v55tmap')->'members');
select jsonb_array_length(public.get_gallery_map('v55tmap')->'members');
select jsonb_array_length(public.get_gallery_map('v55tmap')->'members');`).replace(/\n/g, ' ');
  out.push(`${db}: ${t}`);
}
writeFileSync('tmap-result.txt', out.join('\n') + '\n'); console.log(out.join('\n'));
