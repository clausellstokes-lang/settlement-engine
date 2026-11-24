// THE CHAIR'S OWN PROBE of migration 211 parts C and D (never committed; a scratch file).
// Run with cwd = the grants worktree. Two chains:
//   L: the whole chain on the lane (to 211).
//   P: the chain as production stands (to 203), then the OWNER'S FILES 3 and 4 as he would run them.
// The question: after the fix, can an ordinary signed-in user still do what the live site's pages do
// (plain insert, the upsert the pages send, an owner-column update), and is a server column still refused?
import { readFileSync } from 'node:fs';
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';

const OWNER = '11111111-1111-1111-1111-111111111111';
const OWNER_DIR = '/home/user/wt/grants/docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/';

async function asUser(db, sql) {
  try {
    await db.exec(`set request.jwt.claim.role = 'authenticated'; set test.uid = '${OWNER}'; set role authenticated;`);
    const r = await db.query(sql);
    return { ok: true, rows: r.rows };
  } catch (e) {
    return { ok: false, err: String(e?.message || e).slice(0, 160) };
  } finally {
    await db.exec(`reset role; reset request.jwt.claim.role; set test.uid = '';`);
  }
}

async function probe(label, db) {
  const out = [];
  const say = (name, want, r) => {
    const got = r.ok ? 'OK' : 'REFUSED';
    out.push(`${got === want ? 'pass' : 'FAIL'}  [${label}] ${name}: want ${want}, got ${got}${r.ok ? '' : ' (' + r.err + ')'}`);
  };
  await db.exec(`insert into auth.users (id, email) values ('${OWNER}', 'o@probe.test') on conflict do nothing;`);
  await db.exec(`update public.profiles set tier = 'premium' where id = '${OWNER}';`);

  // 1. the pages' plain insert of a settlement (the columns src/lib/saves.js :: supabaseSave sends)
  let r = await asUser(db, `insert into public.settlements (user_id, name, tier, data, config, toggles, seed, neighbour_links, ai_data, campaign_state, version_history)
    values ('${OWNER}', 'probe town', 'village', '{}', null, null, null, null, '{}', null, null) returning id`);
  say('plain insert, settlements (the pages\' own columns)', 'OK', r);
  const sid = r.ok ? r.rows[0].id : (await db.query(`insert into public.settlements (user_id, name, tier, data) values ('${OWNER}', 'seed', 'village', '{}') returning id`)).rows[0].id;

  // 2. the pages' plain insert of a campaign (src/lib/campaigns.js :: rowForCampaign)
  r = await asUser(db, `insert into public.saved_maps (user_id, name, map_seed, map_data, burg_settlement_map, supply_chain_config)
    values ('${OWNER}', 'probe campaign', null, '{}', '{}', '[]') returning id`);
  say('plain insert, saved_maps (the pages\' own columns)', 'OK', r);
  const mid = r.ok ? r.rows[0].id : (await db.query(`insert into public.saved_maps (user_id, name) values ('${OWNER}', 'seed') returning id`)).rows[0].id;

  // the server has since counted views and featured the rows (as the server's own role)
  await db.exec(`update public.settlements set view_count = 57, is_featured = true, featured_order = 3 where id = '${sid}';
                 update public.saved_maps set view_count = 12, import_count = 4, is_featured = true where id = '${mid}';`);

  // 3. the pages' upsert over an existing row whose server columns are no longer at their defaults
  r = await asUser(db, `insert into public.settlements (id, user_id, name, tier, data) values ('${sid}', '${OWNER}', 'renamed by upsert', 'village', '{"a":1}')
    on conflict (id) do update set name = excluded.name, tier = excluded.tier, data = excluded.data, user_id = excluded.user_id returning view_count, is_featured`);
  say('upsert over a viewed and featured settlement', 'OK', r);
  if (r.ok) out.push(`      server columns after the upsert: ${JSON.stringify(r.rows[0])}`);
  r = await asUser(db, `insert into public.saved_maps (id, user_id, name, map_data) values ('${mid}', '${OWNER}', 'renamed by upsert', '{"b":2}')
    on conflict (id) do update set name = excluded.name, map_data = excluded.map_data, user_id = excluded.user_id returning view_count, import_count, is_featured`);
  say('upsert over a viewed, imported and featured campaign', 'OK', r);
  if (r.ok) out.push(`      server columns after the upsert: ${JSON.stringify(r.rows[0])}`);

  // 4. owner-column updates
  say('update name, settlements', 'OK', await asUser(db, `update public.settlements set name = 'n2' where id = '${sid}' returning 1`));
  say('update name, saved_maps', 'OK', await asUser(db, `update public.saved_maps set name = 'n2' where id = '${mid}' returning 1`));
  say('update gallery_description, settlements', 'OK', await asUser(db, `update public.settlements set gallery_description = 'x' where id = '${sid}' returning 1`));

  // 5. server columns are refused
  say('update view_count, settlements', 'REFUSED', await asUser(db, `update public.settlements set view_count = 0 where id = '${sid}' returning 1`));
  say('update is_featured, saved_maps', 'REFUSED', await asUser(db, `update public.saved_maps set is_featured = false where id = '${mid}' returning 1`));
  say('insert with view_count 5, settlements', 'REFUSED', await asUser(db, `insert into public.settlements (user_id, name, tier, data, view_count) values ('${OWNER}', 'x', 'village', '{}', 5) returning 1`));
  // an upsert whose payload carries the row's CURRENT server value (a page that sent a loaded row back): what happens?
  r = await asUser(db, `insert into public.settlements (id, user_id, name, tier, data, view_count) values ('${sid}', '${OWNER}', 'n3', 'village', '{}', 57)
    on conflict (id) do update set name = excluded.name returning 1`);
  out.push(`note  [${label}] an upsert whose payload repeats the current view_count (57): ${r.ok ? 'OK' : 'REFUSED (' + r.err + ')'}`);

  // 6. profiles (part C)
  say('profiles: update avatar_url', 'OK', await asUser(db, `update public.profiles set avatar_url = 'https://example.test/a.png' where id = '${OWNER}' returning 1`));
  say('profiles: update email_notifications', 'OK', await asUser(db, `update public.profiles set email_notifications = false where id = '${OWNER}' returning 1`));
  say('profiles: update public_identity_opt_in', 'OK', await asUser(db, `update public.profiles set public_identity_opt_in = true where id = '${OWNER}' returning 1`));
  say('profiles: update display_name directly', 'REFUSED', await asUser(db, `update public.profiles set display_name = 'x' where id = '${OWNER}' returning 1`));
  say('profiles: update tier', 'REFUSED', await asUser(db, `update public.profiles set tier = 'premium' where id = '${OWNER}' returning 1`));
  say('profiles: update free_narrative_claimed_at', 'REFUSED', await asUser(db, `update public.profiles set free_narrative_claimed_at = null where id = '${OWNER}' returning 1`));
  say('profiles: update_display_name RPC', 'OK', await asUser(db, `select public.update_display_name('Probe Name')`));
  // can a user insert or delete a profile row at all?
  r = await asUser(db, `delete from public.profiles where id = '${OWNER}' returning 1`);
  out.push(`note  [${label}] profiles: delete own row as a user: ${r.ok ? 'statement ran, rows ' + r.rows.length : 'REFUSED (' + r.err + ')'}`);
  r = await asUser(db, `insert into public.profiles (id, tier) values ('22222222-2222-2222-2222-222222222222', 'premium') returning 1`);
  out.push(`note  [${label}] profiles: insert a row as a user: ${r.ok ? 'INSERTED rows ' + r.rows.length : 'REFUSED (' + r.err + ')'}`);
  return out;
}

const which = process.argv[2];
const t0 = Date.now();
if (which === 'L') {
  const { db, files, failures } = await bootHostedChain();
  console.log(`[L] chain: ${files.length} files, last ${files[files.length - 1]}, ${failures.length} statement failures; booted in ${Math.round((Date.now() - t0) / 1000)} s`);
  for (const l of await probe('L: the lane to 211', db)) console.log(l);
} else {
  const { db, files, failures } = await bootHostedChain({ upTo: 203 });
  console.log(`[P] chain: ${files.length} files, last ${files[files.length - 1]}, ${failures.length} statement failures; booted in ${Math.round((Date.now() - t0) / 1000)} s`);
  for (const f of ['3-part-c-profiles.sql', '4-part-d-settlements-maps.sql']) {
    try { const r = await db.exec(readFileSync(OWNER_DIR + f, 'utf8')); console.log(`[P] the owner's file ${f}: ran (${r.length} statements' results)`); }
    catch (e) { console.log(`[P] the owner's file ${f}: RAISED ${String(e?.message || e).slice(0, 200)}`); }
  }
  for (const l of await probe('P: production at 203 + the owner\'s files 3 and 4', db)) console.log(l);
}
console.log('done in', Math.round((Date.now() - t0) / 1000), 's');
