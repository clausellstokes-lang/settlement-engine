const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/veil/src/domain/display/galleryVeil.js`);
for (const DB of ['dz210', 'dz211']) {
  const db = new pg.Client({ database: DB }); await db.connect();
  await db.query(`insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
    insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  const data = { name: 'T', npcs: [{ id: 'a', name: 'Ann', role: 'mayor', secret: 'S' }], decrees: [{ op: 'kill', target: 'a', note: 'DECREE_SPOILER: the mayor dies next session' }], dmLayer: { 'npcs.a.secret': 'DMLAYER_MARK' } };
  const rows = {
    unmarked: {},
    marked_default: V.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }),
    marked_opened: V.writeShareVeil({}, [{ address: 'block:housekeeping.decrees', hidden: false }], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }),
  };
  let n = 0;
  for (const [k, ov] of Object.entries(rows)) {
    await db.query(`select set_config('test.uid', '', false)`);
    n++; const id = `dddddddd-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, gallery_member_overrides, gallery_share_dm, gallery_importable)
      values ($1, '11111111-1111-1111-1111-111111111111', 'T', 'town', $2, true, $3, now(), $4, true, true)`, [id, JSON.stringify(data), `dz${n}`, JSON.stringify(ov)]);
    await db.query(`select set_config('test.uid', '', false)`);
    const g = (await db.query('select data, gallery_member_overrides from public.get_gallery_dossier($1)', [`dz${n}`])).rows[0];
    await db.query(`select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false)`);
    const im = (await db.query('select data from public.import_gallery_dossier($1)', [`dz${n}`])).rows[0];
    const has = (o) => { const t = JSON.stringify(o ?? null); return `${t.includes('DECREE_SPOILER') ? 'DECREES' : '-'}/${t.includes('DMLAYER_MARK') ? 'DMLAYER' : '-'}`; };
    console.log(DB, k.padEnd(15), 'Reveal DM on | gallery data', has(g.data), '| gallery overrides', has(g.gallery_member_overrides), '| import data', has(im?.data));
  }
  await db.end();
}
