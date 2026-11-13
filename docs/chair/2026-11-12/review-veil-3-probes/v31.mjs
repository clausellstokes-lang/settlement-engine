const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/veil5/src/domain/display/galleryVeil.js`);
const P = await import(`${SP}/veil5/src/domain/display/publicSafe.js`);
const ED = { decrees: [{ op: 'kill', note: 'TOP_DECREE' }], dmLayer: { 'npcs.a': 'TOP_DMLAYER' } };
const NESTED = { npcs: [{ id: 'a', name: 'Ann', role: 'mayor', dmLayer: { x: 'NPC_DMLAYER' }, decrees: ['NPC_DECREE'] }],
  institutions: [{ id: 'i', name: 'Mill', decrees: ['INST_DECREE'], dmLayer: { y: 'INST_DMLAYER' } }], powerStructure: { dmLayer: 'PS_DMLAYER' } };
const opened = (extra = {}) => V.writeShareVeil({}, [{ address: 'block:housekeeping.decrees', hidden: false }], { mode: 'live', at: '2026-11-01T00:00:00.000Z', ...extra });
const ROWS = {
  unmarked_top: { data: { name: 'T', ...ED }, ov: {} },
  marked_default_top: { data: { name: 'T', ...ED }, ov: V.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) },
  marked_opened_top: { data: { name: 'T', ...ED }, ov: opened() },
  opened_copy: { data: { name: 'T' }, ov: opened({ mode: 'snapshot', snapshot: { name: 'T', ...ED } }) },
  opened_narration: { data: { name: 'T' }, ov: opened(), ai: { name: 'T', ...ED } },
  unmarked_narration: { data: { name: 'T' }, ov: {}, ai: { name: 'T', ...ED } },
  unmarked_nested: { data: { name: 'T', ...NESTED }, ov: {} },
  opened_nested_revealed: { data: { name: 'T', ...NESTED }, ov: { ...opened(), a: { revealDm: true, allowImport: true } } },
  unmarked_case_variants: { data: { name: 'T', Decrees: ['CASE_DECREE'], DMLayer: { z: 'CASE_DMLAYER' }, decrees_v2: ['SUFFIX_DECREE'] }, ov: {} },
};
const TOK = /(TOP|NPC|INST|PS|CASE|SUFFIX)_(DECREE|DMLAYER)/g;
const toks = (o) => [...new Set((JSON.stringify(o ?? null).match(TOK) || []))].sort().join(',') || '-';
for (const DB of process.argv.slice(2)) {
  const db = new pg.Client({ database: DB }); await db.connect();
  await db.query(`insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
    insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  let n = 0;
  for (const [k, r] of Object.entries(ROWS)) {
    await db.query(`select set_config('test.uid', '', false)`);
    n++; const id = `eeeeeeee-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated, ai_data)
      values ($1, '11111111-1111-1111-1111-111111111111', 'T', 'town', $2, true, $3, now(), $4, 'unlisted', $5, true, true, $6, $7)`,
    [id, JSON.stringify(r.data), `v${n}`, `vl${n}`, JSON.stringify(r.ov), !!r.ai, r.ai ? JSON.stringify({ aiSettlement: r.ai }) : null]);
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign) values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'm', $1, true, $2, 'map_with_campaign', true)`, [JSON.stringify({ campaign: { settlementIds: [id] } }), `vm${n}`]);
    const g = (await db.query('select data, gallery_member_overrides o from public.get_gallery_dossier($1)', [`v${n}`])).rows[0];
    const l = (await db.query('select public.get_unlisted_dossier($1) x', [`vl${n}`])).rows[0].x;
    const m = (await db.query('select public.get_gallery_map($1) x', [`vm${n}`])).rows[0].x;
    await db.query(`select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false)`);
    const im = (await db.query('select data from public.import_gallery_dossier($1)', [`v${n}`])).rows[0];
    const client = P.toPublicSafe(r.ai ?? (V.readShareMode(r.ov).snapshot || r.data), { full: true, memberOverrides: r.ov });
    console.log(DB.padEnd(6), k.padEnd(24), '| gallery', toks(g.data), '| overrides', toks(g.o), '| import', toks(im?.data), '| link', toks(l?.dossier), '| map', toks(m?.members), '|| client full-mode', toks(client));
  }
  await db.end();
}
