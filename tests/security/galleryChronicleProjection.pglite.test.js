/**
 * galleryChronicleProjection.pglite.test.js — EXECUTION-level proof of the public gallery's
 * chronicle field allowlist, read AS anon (A+ enforcement.6's gallery half; LT36 car 5).
 *
 * WHAT WAS MISSING, PRECISELY. The gallery's other privacy surfaces already execute: the
 * sanitizer in gallerySanitize.pglite.test.js, the dossier RPC in
 * galleryAlivenessTitleChain.pglite.test.js. But that suite STUBS
 * `_gallery_chronicle_json` to `select '[]'::jsonb` — deliberately, since it pins the
 * phase-2 tile plumbing — so the chronicle projection itself has never been executed
 * anywhere. Its allowlist was guarded only by GREPPING migration 032 for quoted identifiers
 * (tests/security/gallery_privacy.contract.test.js:94, :106, :125). That grep counts
 * `'key',` occurrences in a source file. It cannot tell you what the function RETURNS, and a
 * projection that silently starts emitting a private field while still spelling the
 * allowlist keys in its `jsonb_build_object` would sail past it green.
 *
 * WHAT THIS DOES. It boots the real chain in in-process pglite — migrations 146 and 147
 * wholesale (net-current `get_gallery_dossier` and `_gallery_public_tile_rows`), plus the
 * NET-CURRENT `_gallery_chronicle_entry` / `_gallery_chronicle_json` resolved by replaying
 * the whole migration corpus — seeds a settlement whose campaign eventLog carries the
 * private fields the migration header names (beforeState, afterState, delta,
 * factionResponses, hookSeed, undo, payload, description, inWorldDate), switches to the
 * `anon` role, selects the dossier, and asserts on the EXECUTED OUTPUT. No database is
 * touched and no migration is applied.
 *
 * ⛔ THE ASSERTION IS SET EQUALITY, NOT A LIST OF ABSENCES. Every key appearing anywhere in
 * the returned chronicle is collected and compared to the allowlist with `toEqual`. A roster
 * of per-field absence assertions would pass just as happily against an empty chronicle,
 * would have to be extended by hand for every newly-invented private field, and is the
 * vacuous-negative shape tests/lint/negativeAssertionAnchor.walker.test.js exists to refuse.
 * Set equality reds on ANY key nobody allowlisted, including one that does not exist yet.
 * (That sentence is deliberately written WITHOUT spelling the matcher: the walker's scanner
 * reads source text, so naming it in prose registers a real un-anchored site. The estate has
 * been bitten by a detector counting a docstring twice before —
 * tests/lint/rawButtonBaseline.test.js, LANE VT and LANE PW.)
 *
 * ⛔ AND THE MUTATION CONTROL IS A SUITE MEMBER. enforcement.6's Done-when
 * (docs/A_PLUS_ROADMAP.md:308) demands a mutation proof both ways. A second database is
 * booted with `payload` added back into the loaded projection, and asserts the leak becomes
 * visible — so a green above is evidence the allowlist is doing work, not evidence that the
 * fixture produced nothing to inspect.
 *
 * The net-current extractor is spelled locally, as adminLeastPrivilege.pglite.test.js,
 * profileEscalation.pglite.test.js and civilityGuard.pglite.test.js each spell theirs: these
 * suites are self-contained by convention, and a test file may not import from another test
 * file (an exported suite re-registers in every importer — see tests/helpers/dormancyOracle.js).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_146 = resolve(MIG_DIR, '146_gallery_title_aliveness_columns.sql');
const MIG_147 = resolve(MIG_DIR, '147_gallery_tile_chain_aliveness_title_reactions.sql');
const allExist = existsSync(MIG_DIR) && existsSync(MIG_146) && existsSync(MIG_147);

const MIGRATION_FILES = existsSync(MIG_DIR)
  ? readdirSync(MIG_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort()
  : [];

/**
 * The NET-CURRENT definition of `public.<name>`: replay every migration in file order, keep
 * the LAST `create or replace function` standing.
 *
 * ⚠ ANCHORED AT LINE START (`^` + the m flag). The unanchored form also matches a migration
 * HEADER that quotes the statement in prose — migration 032's header does exactly that, at
 * length — and the extract then begins mid-comment, feeding Postgres English. Canonical
 * writeup: tests/security/moneyRpcNetCurrentGuards.test.js; enforced by
 * tests/lint/netCurrentExtractorAnchor.walker.test.js.
 *
 * @param {string} name bare function name, e.g. `_gallery_chronicle_entry`
 * @returns {{ name: string, ddl: string, file: string }}
 */
function netCurrentFunction(name) {
  const re = new RegExp(
    `^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    'gim',
  );
  let ddl = null;
  let file = null;
  for (const f of MIGRATION_FILES) {
    const src = readFileSync(resolve(MIG_DIR, f), 'utf-8');
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) { ddl = m[0]; file = f; }
  }
  if (ddl === null) throw new Error(`no net-current definition of public.${name} in ${MIG_DIR}`);
  return { name, ddl, file };
}

const CHRONICLE_FNS = allExist
  ? ['_gallery_chronicle_entry', '_gallery_chronicle_json'].map(netCurrentFunction)
  : [];

/** The allowlist migration 032 declares, and the ONLY keys a public chronicle may carry. */
const ALLOWED_KEYS = [
  'appliedAt', 'cause', 'event', 'id', 'narrativeSummary', 'partyCaused', 'timestamp', 'type',
];

/** The private EventLogEntry fields the migration header names as never-publishable. */
const PRIVATE_FIELDS = {
  beforeState: { population: 1200, treasury: 4400 },
  afterState: { population: 980, treasury: 100 },
  delta: { population: -220 },
  factionResponses: [{ faction: 'The Ash Circle', hookSeed: 'they want the vault' }],
  hookSeed: 'a body in the well',
  undo: { snapshot: 'everything' },
  payload: { secret: 'the DM note nobody may read' },
  description: "the DM's free-text context",
  inWorldDate: '14th of Harvestmoon, 1042',
};

const OWNER = '11111111-1111-1111-1111-111111111111';
const SETTLEMENT = '33333333-3333-3333-3333-333333333333';

/** One eventLog entry: every allowlisted field, and every private field, together. */
const entry = (n) => ({
  id: `evt-${String(n).padStart(3, '0')}`,
  appliedAt: `2026-01-${String((n % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
  timestamp: 1700000000000 + n,
  narrativeSummary: `Something happened, number ${n}.`,
  cause: 'player',
  partyCaused: true,
  event: {
    id: `inner-${n}`,
    type: 'raid',
    cause: 'player',
    partyCaused: true,
    ...PRIVATE_FIELDS,
  },
  ...PRIVATE_FIELDS,
});

/** Every key appearing ANYWHERE in a JSON value, at any depth. */
function allKeysDeep(value, out = new Set()) {
  if (Array.isArray(value)) { for (const v of value) allKeysDeep(v, out); return out; }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { out.add(k); allKeysDeep(v, out); }
  }
  return out;
}

const SCAFFOLD = `
  do $roles$ begin
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
    if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
  end $roles$;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $fn$
    select nullif(current_setting('test.uid', true), '')::uuid
  $fn$;
  create table public.settlements (
    id uuid primary key, user_id uuid, name text, tier text,
    data jsonb default '{}'::jsonb,
    is_public boolean not null default false, public_slug text,
    published_at timestamptz default now(), updated_at timestamptz default now(),
    view_count integer default 0, is_curated boolean default false,
    gallery_description text, gallery_image_url text, gallery_image_alt text,
    gallery_tags text[] default '{}', gallery_updated_at timestamptz,
    gallery_share_narrated boolean default false, gallery_share_dm boolean default false,
    gallery_importable boolean default false, gallery_member_overrides jsonb,
    gallery_facet_culture text, gallery_facet_prosperity text, gallery_facet_deity text,
    gallery_facet_at_war boolean, campaign_state jsonb, ai_data jsonb
  );
  create table public.saved_maps (id uuid primary key);
  create table public.profiles (id uuid primary key, external_name text);
  create table public.gallery_votes (
    settlement_id uuid not null, user_id uuid not null,
    created_at timestamptz default now(), primary key (settlement_id, user_id)
  );
  create table public.gallery_comments (
    id uuid primary key default gen_random_uuid(),
    settlement_id uuid not null, user_id uuid not null, body text, deleted_at timestamptz
  );
  create table public.gallery_reactions (
    settlement_id uuid not null, user_id uuid not null, reaction_key text not null,
    created_at timestamptz default now(), primary key (settlement_id, user_id, reaction_key)
  );
  -- Identity stubs for the sanitizer twins ONLY. Their projection parity has dedicated
  -- suites (gallerySanitize*.pglite, the 142 twin parity); the chronicle helpers below are
  -- the REAL ones, because they are what this file is about. An identity stub here would be
  -- a test that proves its own stub.
  create or replace function public._gallery_dm_full_json(j jsonb) returns jsonb
    language sql immutable as $fn$ select j $fn$;
  create or replace function public._gallery_sanitize_public_json(j jsonb) returns jsonb
    language sql immutable as $fn$ select j $fn$;
  create or replace function public._gallery_apply_member_overrides(
    base jsonb, dm_full jsonb, overrides jsonb,
    settlement_share_dm boolean, settlement_importable boolean, for_import boolean
  ) returns jsonb language sql immutable as $fn$ select base $fn$;
`;

/**
 * Boot the chain.
 * @param {{ entryDdl?: string }} options `entryDdl` replaces `_gallery_chronicle_entry` —
 *   used ONLY by the mutation arm.
 */
async function boot({ entryDdl } = {}) {
  const db = new PGlite();
  await db.exec(SCAFFOLD);
  for (const fn of CHRONICLE_FNS) {
    await db.exec(fn.name === '_gallery_chronicle_entry' && entryDdl ? entryDdl : fn.ddl);
  }
  await db.exec(readFileSync(MIG_146, 'utf-8'));
  await db.exec(readFileSync(MIG_147, 'utf-8'));
  return db;
}

async function seed(db, entries) {
  await db.exec("reset role; truncate public.settlements, public.profiles cascade; set test.uid = '';");
  // One command per query(): pglite's prepared-statement path refuses a multi-command
  // string ("cannot insert multiple commands into a prepared statement").
  await db.query(
    "insert into public.profiles (id, external_name) values ($1, 'Keeper of Maps')",
    [OWNER],
  );
  await db.query(
    `insert into public.settlements
       (id, user_id, name, tier, is_public, public_slug, published_at, campaign_state)
     values ($1, $2, 'Thornwick', 'town', true, 'slug-one', now(), $3::jsonb)`,
    [SETTLEMENT, OWNER, JSON.stringify(entries === null ? {} : { eventLog: entries })],
  );
}

/** Read the dossier's chronicle column with the session role set to `anon`. */
async function chronicleAsAnon(db) {
  await db.exec('set role anon;');
  const { rows } = await db.query("select chronicle from public.get_gallery_dossier('slug-one')");
  await db.exec('reset role;');
  return rows[0]?.chronicle ?? null;
}

// ── Anti-vacuity, unconditional ──────────────────────────────────────────────
describe('gallery chronicle fixtures exist (guards against a silent vacuous skip)', () => {
  it('the migrations are present and both chronicle helpers are derivable', () => {
    expect(existsSync(MIG_146), `missing: ${MIG_146}`).toBe(true);
    expect(existsSync(MIG_147), `missing: ${MIG_147}`).toBe(true);
    expect(CHRONICLE_FNS.map((f) => f.name)).toEqual(['_gallery_chronicle_entry', '_gallery_chronicle_json']);
    for (const fn of CHRONICLE_FNS) {
      expect(fn.ddl.length, `${fn.name}: net-current DDL is empty`).toBeGreaterThan(200);
      expect(fn.ddl, `${fn.name}: extract does not start at the create statement`)
        .toMatch(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${fn.name}\\b`, 'i'));
      // The header of 032 quotes these names in prose at length; an unanchored extractor
      // would have started there. Proving the extract is SQL and not English:
      expect(fn.ddl, `${fn.name}: extract is not a function body`).toContain('language sql');
    }
    // The fixture must actually carry the private fields, or the leak assertions below
    // would be asking whether absent data is absent.
    expect(allKeysDeep(entry(1)).size).toBeGreaterThan(0);
    for (const field of Object.keys(PRIVATE_FIELDS)) {
      expect([...allKeysDeep(entry(1))], `fixture lacks ${field}`).toContain(field);
    }
  });
});

describe.runIf(allExist)('the public chronicle, projected and read AS anon (pglite)', () => {
  /** @type {PGlite} */ let db;
  beforeAll(async () => { db = await boot(); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db, [entry(1), entry(2), entry(3)]));

  it('anon can execute the dossier RPC at all (the 147 grant)', async () => {
    await db.exec('set role anon;');
    const { rows } = await db.query("select public_slug, name from public.get_gallery_dossier('slug-one')");
    await db.exec('reset role;');
    expect(rows).toHaveLength(1);
    expect(rows[0].public_slug).toBe('slug-one');
  });

  it('EVERY key in the executed chronicle is in the allowlist — set equality, at any depth', async () => {
    const chronicle = await chronicleAsAnon(db);
    expect(Array.isArray(chronicle), 'the chronicle column is an array').toBe(true);
    expect(chronicle).toHaveLength(3);
    expect([...allKeysDeep(chronicle)].sort()).toEqual([...ALLOWED_KEYS].sort());
  });

  it('the allowlisted VALUES survive — the projection keeps what it is for', async () => {
    // Without this, a projection that returned `[{}, {}, {}]` would satisfy the key-set
    // assertion above perfectly.
    const chronicle = await chronicleAsAnon(db);
    expect(chronicle[0].id).toBe('evt-001');
    expect(chronicle[0].narrativeSummary).toBe('Something happened, number 1.');
    expect(chronicle[0].cause).toBe('player');
    expect(chronicle[0].partyCaused).toBe(true);
    expect(chronicle[0].event).toEqual({
      id: 'inner-1', type: 'raid', cause: 'player', partyCaused: true,
    });
  });

  it('the NESTED event object is allowlisted too, not just the outer entry', async () => {
    const chronicle = await chronicleAsAnon(db);
    expect([...allKeysDeep(chronicle.map((c) => c.event))].sort())
      .toEqual(['cause', 'id', 'partyCaused', 'type']);
  });

  it('caps the public chronicle at the NEWEST 50 entries', async () => {
    await seed(db, Array.from({ length: 60 }, (_, i) => entry(i + 1)));
    const chronicle = await chronicleAsAnon(db);
    expect(chronicle).toHaveLength(50);
    // Newest, not oldest: entries 11..60 survive, in append order.
    expect(chronicle[0].id).toBe('evt-011');
    expect(chronicle[49].id).toBe('evt-060');
    // …and the cap did not smuggle a private field back in at volume.
    expect([...allKeysDeep(chronicle)].sort()).toEqual([...ALLOWED_KEYS].sort());
  });

  it('a settlement with no campaign log yields a NULL chronicle, not a leak and not a crash', async () => {
    await seed(db, null);
    expect(await chronicleAsAnon(db)).toBeNull();
  });

  it('a malformed eventLog entry is DROPPED, never passed through raw', async () => {
    await seed(db, [entry(1), 'not-an-object', 42, null, entry(2)]);
    const chronicle = await chronicleAsAnon(db);
    expect(chronicle.map((c) => c.id)).toEqual(['evt-001', 'evt-002']);
    expect([...allKeysDeep(chronicle)].sort()).toEqual([...ALLOWED_KEYS].sort());
  });
});

// ── THE MUTATION ARM ─────────────────────────────────────────────────────────
// A+ A_PLUS_ROADMAP.md:308 asks for "a mutation proof both ways". Adding one private key
// back into the loaded projection must make the leak VISIBLE in the executed output —
// otherwise the set-equality assertion above could be passing because the fixture produced
// nothing to inspect rather than because the allowlist held.
describe.runIf(allExist)('MUTATION CONTROL — re-adding `payload` to the projection makes the leak visible', () => {
  /** @type {PGlite} */ let db;
  const LEAKY_ENTRY = `
    create or replace function public._gallery_chronicle_entry(e jsonb)
    returns jsonb language sql immutable as $$
      select case
        when e is null or jsonb_typeof(e) <> 'object' then null
        else jsonb_strip_nulls(jsonb_build_object(
          'id',               e -> 'id',
          'appliedAt',        e -> 'appliedAt',
          'timestamp',        e -> 'timestamp',
          'narrativeSummary', e -> 'narrativeSummary',
          'cause',            e -> 'cause',
          'partyCaused',      e -> 'partyCaused',
          'payload',          e -> 'payload'
        ))
      end;
    $$;
  `;
  beforeAll(async () => { db = await boot({ entryDdl: LEAKY_ENTRY }); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db, [entry(1), entry(2), entry(3)]));

  it('the DM note now reaches anon — so the green above is the allowlist, not an empty fixture', async () => {
    const chronicle = await chronicleAsAnon(db);
    expect(chronicle).toHaveLength(3);
    expect(chronicle[0].payload).toEqual({ secret: 'the DM note nobody may read' });
    expect([...allKeysDeep(chronicle)]).toContain('payload');
  });

  it('and ONLY the projection moved — the newest-50 cap still holds under the mutation', async () => {
    // Without this, a mutation that had broken the whole helper would be indistinguishable
    // from one that widened the allowlist by exactly one key.
    await seed(db, Array.from({ length: 60 }, (_, i) => entry(i + 1)));
    const chronicle = await chronicleAsAnon(db);
    expect(chronicle).toHaveLength(50);
    expect(chronicle[0].id).toBe('evt-011');
  });
});
