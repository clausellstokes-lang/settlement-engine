import { buildDb } from './db.mjs';
import { writeFileSync } from 'node:fs';
const t0 = Date.now();
const { db, failed } = await buildDb(Number(process.env.THROUGH || 999));
console.log('built', (Date.now()-t0)/1000, 's failed:', failed);
const r = await db.query(`
 select p.oid::regprocedure::text sig, p.prosecdef def, p.provolatile vol, coalesce(array_to_string(p.proconfig, ';'),'') cfg,
   has_function_privilege('anon', p.oid, 'execute') anon, has_function_privilege('authenticated', p.oid, 'execute') authn,
   pg_get_userbyid(p.proowner) owner,
   (p.prosrc ~* 'settlements') reads_settlements, (p.prosrc ~* 'gallery_member_overrides') reads_ov,
   (p.prosrc ~* '\\mdata\\M|ai_data|campaign_state') reads_data
 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by 1`);
writeFileSync(process.env.OUT || 'catalog.json', JSON.stringify(r.rows, null, 1));
const pub = r.rows.filter(x => (x.anon || x.authn) && (x.reads_settlements || x.reads_ov));
for (const x of pub) console.log(x.def?'DEF':'inv', x.anon?'anon':'    ', x.authn?'auth':'    ', x.reads_ov?'OV':'  ', x.sig, x.cfg);
const veil = r.rows.filter(x => /_gallery_veil|_gallery_apply_member|_gallery_sanitize|_gallery_dm_full|_gallery_npc_key|_gallery_chronicle/.test(x.sig));
for (const x of veil) console.log('helper', x.anon?'ANON':'-', x.authn?'AUTH':'-', x.def?'DEF':'inv', x.sig, x.cfg);
