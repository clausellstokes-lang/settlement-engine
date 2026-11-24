import { boot } from './boot.mjs';
import { writeFileSync } from 'node:fs';
const { db } = await boot({ hostedDefaults: true });
const UID = '11111111-1111-1111-1111-111111111111';
const VIC = '22222222-2222-2222-2222-222222222222';
const q = async (s, p) => (await db.query(s, p)).rows;
await db.exec(`reset role; set app.settings.byok_secret = 'probe-secret';
  insert into auth.users (id, email) values ('${UID}', 'u@probe.test'), ('${VIC}', 'v@probe.test') on conflict do nothing;`);
const prof = await q(`select id, tier, role from public.profiles order by id`);
console.log('profiles after signup trigger:', JSON.stringify(prof));
// make the victim premium with an active settlement-free claim state
await db.exec(`update public.profiles set tier = 'premium', free_narrative_claimed_at = now() where id = '${VIC}';
  update public.profiles set free_narrative_claimed_at = now() where id = '${UID}';`);
const bcols = (await q(`select column_name from information_schema.columns where table_schema='public' and table_name='surveyor_byok_keys' order by ordinal_position`)).map(r=>r.column_name);
console.log('byok cols', bcols.join(','));
await db.exec(`insert into public.surveyor_byok_keys (user_id, provider, ciphertext) values ('${VIC}', 'anthropic', extensions.pgp_sym_encrypt('sk-ant-VICTIM-KEY', 'probe-secret'))`).catch(e=>console.log('byok seed err', e.message));
const asRole = async (role, uid, sql) => {
  try {
    await db.exec(`reset role; set request.jwt.claim.role = '${role}'; set test.uid = '${uid || ''}'; set role ${role};`);
    const r = await q(sql);
    return { ok: true, rows: r };
  } catch (e) { return { ok: false, err: e.message }; } finally { await db.exec('reset role;'); }
};
const out = {};
out.anon_byok_get = await asRole('anon', null, `select public.surveyor_byok_get('${VIC}', 'anthropic') as r`);
out.anon_byok_secret = await asRole('anon', null, `select public._surveyor_byok_secret() as r`);
out.anon_downgrade = await asRole('anon', null, `select public.handle_premium_downgrade('${VIC}') as r`);
out.victim_after_downgrade = await q(`select tier, premium_downgraded_at is not null as downgraded from public.profiles where id='${VIC}'`);
out.auth_release_own = await asRole('authenticated', UID, `select public.release_free_narrative('${UID}') as r`);
out.own_after_release = await q(`select free_narrative_claimed_at from public.profiles where id='${UID}'`);
out.anon_claim_victim = await asRole('anon', null, `select public.claim_free_narrative('${VIC}') as r`);
writeFileSync(new URL('./out/exec-f1.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
