/**
 * veilDoorsHostedRoles.pglite.test.js — THE ANON ARM (VEIL-53 unit (3); RULING V1-3 point 6, RULING V23).
 *
 * WHY: 211 part B closes every function 212 creates (the share veil's helpers are class NOBODY, SECURITY
 * INVOKER). A SECURITY DEFINER door calls them as its owner: fine. A SECURITY INVOKER path a visitor runs
 * calls them as the visitor and answers "permission denied". The call-graph read (every chain from a function
 * anon or authenticated may execute, down through invokers, to a NOBODY or SERVER function) found one root:
 * _gallery_apply_member_overrides (invoker, then ANYONE), which raised as anon and as authenticated
 * "permission denied for function _gallery_veil_str". RULING V23 closed it, and the sanitizer only definers
 * and closed helpers call, in 212.
 *
 * WHAT HOLDS, on ONE chain under the hosted default privileges (tests/security/hostedDefaultHarness.js):
 *   - every door returns its document to anon and to authenticated (the veil ran: the hidden house absent);
 *     the two USER doors, as anon, EXECUTE (the hosted default's by-name grant stands) and answer with their
 *     body gate's empty answer, never a grant refusal;
 *   - the two closed functions, called directly as either role, are refused by their own grant;
 *   - THE CONTROL: one door made SECURITY INVOKER raises on a veil helper born closed; definer again, it returns;
 *   - the owner's read of the seeded dossier is the same with the two functions open as closed.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootHostedChain } from './hostedDefaultHarness.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget

const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '33333333-3333-3333-3333-333333333333';
const SID = 'aaaaaaaa-0000-0000-0000-000000000053';
const NAME = 'Veilmoor';
const HOUSE = 'The Gutter Hand';
const CLOSED = [
  ['_gallery_apply_member_overrides', 'select public._gallery_apply_member_overrides($1, $2, $3, false, true, false) as out', (a) => [a.pub, a.full, a.ov]],
  ['_gallery_sanitize_public_json', 'select public._gallery_sanitize_public_json($1) as out', (a) => [a.raw]],
];
const OPEN_AGAIN = `grant execute on function public._gallery_apply_member_overrides(jsonb, jsonb, jsonb, boolean, boolean, boolean) to public;
  grant execute on function public._gallery_sanitize_public_json(jsonb, text[]) to public;`;
const CLOSE_AGAIN = `revoke execute on function public._gallery_apply_member_overrides(jsonb, jsonb, jsonb, boolean, boolean, boolean) from public, anon, authenticated;
  revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public, anon, authenticated;`;

let chain;
let db;
let args;

beforeAll(async () => {
  chain = await bootHostedChain();
  db = chain.db;
  // A town whose curate choices hide a criminal house, listed and linked, and a shared map holding it.
  const town = {
    name: NAME, tier: 'town',
    institutions: [{ id: 'h', name: HOUSE, category: 'criminal', desc: 'A thieves house behind the tannery' }],
    npcs: [{ id: 'n1', name: 'Ada Crane', role: 'Fence', institution: { kind: 'house', key: 'h' } }, { id: 'n2', name: 'Bram Holt', role: 'Mayor' }],
    relationships: [{ npc1Name: 'Ada Crane', npc2Name: 'Bram Holt', typeName: 'rival', description: 'They quarrel', covert: false }],
  };
  const ov = { n1: { revealDm: false }, $veil: { v: 1, deltas: [{ address: 'card:institution:h', hidden: true }] } };
  await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    update public.profiles set tier = 'premium' where id = '${READER}';`);
  await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
      gallery_member_overrides, gallery_share_dm, gallery_importable)
    values ($1, $2, $3, 'town', $4, true, 'veilmoor', now(), 'veilmoor-link', 'unlisted', $5, false, true)`, [SID, OWNER, NAME, JSON.stringify(town), JSON.stringify(ov)]);
  await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
    values (gen_random_uuid(), $1, 'Veil Reach', $2, true, 'veil-reach', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [SID] } })]);
  // The arguments a door hands _gallery_apply_member_overrides, made as the owner of the chain.
  [args] = (await db.query(`select data as raw, public._gallery_sanitize_public_json(data) as pub, public._gallery_dm_full_json(data) as full,
    gallery_member_overrides as ov from public.settlements where id = $1`, [SID])).rows;
}, PGLITE_BOOT_TIMEOUT_MS);

afterAll(async () => { await db?.close(); });

/** Run `sql` as `role` (authenticated as `uid`), the role reset after; returns { rows } or { error }. */
async function as(role, sql, params = [], uid = role === 'authenticated' ? READER : '') {
  await db.exec(`set test.uid = '${uid}'; set request.jwt.claim.sub = '${uid}'; set role ${role};`);
  try {
    return { rows: (await db.query(sql, params)).rows };
  } catch (e) {
    return { error: String(e?.message || e) };
  } finally {
    await db.exec('reset role; reset test.uid; reset request.jwt.claim.sub;');
  }
}

const DOORS = [
  ['get_gallery_dossier', `select * from public.get_gallery_dossier('veilmoor')`, 'ANYONE'],
  ['get_unlisted_dossier', `select public.get_unlisted_dossier('veilmoor-link') as out`, 'ANYONE'],
  ['import_gallery_dossier', `select * from public.import_gallery_dossier('veilmoor')`, 'USER'],
  ['get_gallery_map', `select public.get_gallery_map('veil-reach') as out`, 'ANYONE'],
  ['import_gallery_map', `select public.import_gallery_map('veil-reach') as out`, 'USER'],
];

describe('the seed is real (no vacuous pass)', () => {
  it('the chain replays; the dossier, its link and the map are seeded; the veil is marked', async () => {
    expect(chain.failures.filter((f) => !/pg_cron/.test(f.err))).toEqual([]);
    const [s] = (await db.query(`select name, is_public, unlisted_slug, gallery_member_overrides -> '$veil' as veil from public.settlements where id = $1`, [SID])).rows;
    expect(s).toMatchObject({ name: NAME, is_public: true, unlisted_slug: 'veilmoor-link' });
    expect(s.veil.deltas).toEqual([{ address: 'card:institution:h', hidden: true }]);
    expect(JSON.stringify(args.raw)).toContain(HOUSE);
  });
});

describe('every door returns its document to both roles, and raises nothing', () => {
  for (const role of ['anon', 'authenticated']) {
    for (const [door, sql, cls] of DOORS) {
      if (cls === 'USER' && role === 'anon') {
        it(`${door} as anon EXECUTES (the hosted default's grant) and answers with its body gate's empty answer`, async () => {
          const priv = (await db.query(`select has_function_privilege('anon', 'public.${door}(text)', 'execute') as x`)).rows[0].x;
          expect(priv).toBe(true);
          const r = await as(role, sql);
          expect(r.error).toBeUndefined();
          if (door === 'import_gallery_dossier') expect(r.rows).toEqual([]);
          else expect(r.rows).toEqual([{ out: null }]);
        });
        continue;
      }
      it(`${door} as ${role} returns the document, veiled`, async () => {
        const r = await as(role, sql);
        expect(r.error).toBeUndefined();
        expect(r.rows.length).toBe(1);
        const text = JSON.stringify(r.rows[0]);
        expect(text).toContain(NAME);
        expect(text).not.toContain(HOUSE);
      });
    }
  }
  it('the two dossier reads carry the served veil marker (the veil helpers ran inside the definer)', async () => {
    const g = await as('anon', `select gallery_member_overrides from public.get_gallery_dossier('veilmoor')`);
    const l = await as('anon', `select public.get_unlisted_dossier('veilmoor-link') -> 'gallery_member_overrides' as m`);
    expect(g.rows[0].gallery_member_overrides.$veil.v).toBe(2);
    expect(l.rows[0].m.$veil.v).toBe(2);
  });
  it('the map serves the dossier as its member', async () => {
    const r = await as('anon', `select public.get_gallery_map('veil-reach') -> 'members' as m`);
    expect(r.rows[0].m.length).toBe(1);
    expect(JSON.stringify(r.rows[0].m[0])).toContain(NAME);
  });
});

describe('the two functions RULING V23 closed refuse both roles by their own grant', () => {
  for (const role of ['anon', 'authenticated']) {
    for (const [fn, sql, params] of CLOSED) {
      it(`${fn} called directly as ${role}: permission denied for function ${fn}`, async () => {
        const r = await as(role, sql, params(args));
        expect(r.error).toMatch(new RegExp(`permission denied for function ${fn}\\b`));
      });
    }
  }
});

describe('THE CONTROL: the arm sees the class (plant and restore in one block)', () => {
  it('get_gallery_dossier made SECURITY INVOKER raises on a veil helper born closed, as anon; definer again, it returns', async () => {
    await db.exec('alter function public.get_gallery_dossier(text) security invoker;');
    let planted;
    try {
      planted = await as('anon', `select * from public.get_gallery_dossier('veilmoor')`);
    } finally {
      await db.exec('alter function public.get_gallery_dossier(text) security definer;');
    }
    expect(planted.error).toMatch(/permission denied for function _gallery_veil/);
    const r = await as('anon', `select * from public.get_gallery_dossier('veilmoor')`);
    expect(r.error).toBeUndefined();
    expect(JSON.stringify(r.rows)).toContain(NAME);
  });
});

describe("the owner's own reads are unchanged by the closing", () => {
  it("the owner's read of the seeded dossier (gallery and link) is the same with the two functions open as closed", async () => {
    const read = async () => {
      const g = await as('authenticated', `select * from public.get_gallery_dossier('veilmoor')`, [], OWNER);
      const l = await as('authenticated', `select public.get_unlisted_dossier('veilmoor-link') as out`, [], OWNER);
      expect(g.error).toBeUndefined();
      expect(l.error).toBeUndefined();
      // view_count moves with every gallery read; the rest is the document
      return { g: g.rows.map((x) => { const y = { ...x }; delete y.view_count; return y; }), l: l.rows };
    };
    const closed = await read();
    await db.exec(OPEN_AGAIN);
    let open;
    try { open = await read(); } finally { await db.exec(CLOSE_AGAIN); }
    expect(closed.g.length).toBe(1);
    expect(closed.l[0].out.is_owner).toBe(true);
    expect(open).toEqual(closed);
  });
});
