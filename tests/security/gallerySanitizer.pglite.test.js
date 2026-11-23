/**
 * gallerySanitizer.pglite.test.js — EXECUTION test of the NET-CURRENT gallery
 * public-JSON sanitizer (review B16 #4, #12).
 *
 * The server-side SQL sanitizer is the TRUE RLS-enforced privacy boundary for
 * public dossiers: the client can be bypassed by calling get_gallery_dossier
 * directly, so whatever _gallery_sanitize_public_json keeps IS what an anonymous
 * reader sees. The existing gallery_privacy.contract.test.js only asserts the
 * function body in migration 020 — which is OVERWRITTEN at deploy time by the
 * hardened version in migration 033. A regression in the 033 sanitizer that
 * re-leaked DM secrets / private NPC fields would pass that contract.
 *
 * This loads the ACTUAL net-current _gallery_sanitize_public_json (latest-wins
 * across all migrations — currently 033) into in-process Postgres (pglite) and
 * RUNS it against a settlement carrying DM secrets and private NPC internals,
 * asserting they are stripped. It also pins the SQL npc_allowed[] in sync with
 * the JS mirror in src/domain/display/publicSafe.js so the dual-maintenance
 * trap (a field added to one list but not the other) fails CI.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const PUBLIC_SAFE_JS = resolve(process.cwd(), 'src', 'domain', 'display', 'publicSafe.js');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order). Returns the LAST definition so we test the
 *  net-current behavior, not a superseded one. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'igm');
  let last = null;
  let lastFile = null;
  for (const f of files) {
    const src = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) { last = matches[matches.length - 1]; lastFile = f; }
  }
  return { sql: last, file: lastFile };
}

/** Extract the npc_allowed text[] array literal from the net-current sanitizer SQL. */
function sqlNpcAllowed(sql) {
  const m = sql.match(/npc_allowed\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\]/i);
  if (!m) throw new Error('npc_allowed array not found in net-current sanitizer');
  return new Set([...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
}

/** Extract the NPC allowlist the JS mirror keeps (the object literal in toPublicSafe). */
function jsNpcAllowed() {
  const js = readFileSync(PUBLIC_SAFE_JS, 'utf-8');
  // The public NPC allowlist now lives in the shared publicNpc() helper (used by
  // both the default-mode strip and the per-member override strip). Capture the
  // `key: npc.key` LHS keys from its returned object literal.
  const block = js.match(/function\s+publicNpc\s*\(\s*npc\s*\)\s*\{\s*return\s*\{([\s\S]*?)\};/);
  if (!block) throw new Error('publicNpc projection block not found in publicSafe.js');
  return new Set([...block[1].matchAll(/(\w+):\s*npc\./g)].map((x) => x[1]));
}

let db;
const SANITIZER = netCurrentFn('_gallery_sanitize_public_json');

describe('gallery public-JSON sanitizer — net-current execution (pglite)', () => {
  // Hard-fail (not skip) if the net-current sanitizer can't be located — a moved/
  // renamed migration must surface loudly, not silently drop this coverage.
  it('locates the net-current _gallery_sanitize_public_json across migrations', () => {
    expect(SANITIZER.sql, 'no _gallery_sanitize_public_json found in any migration').toBeTruthy();
    // It must be the HARDENED (allowlist) version, i.e. it carries npc_allowed.
    expect(SANITIZER.sql).toMatch(/npc_allowed/);
  });

  beforeAll(async () => {
    db = new PGlite();
    // The function pins `set search_path = public`; create the schema + load it.
    await db.exec('create schema if not exists public;');
    await db.exec(SANITIZER.sql);
  }, PGLITE_BOOT_TIMEOUT_MS);

  const sanitize = async (obj) =>
    (await db.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;

  it('strips top-level DM-secret blocks (dmCompass, secret, notes, plotHooks, chronicle)', async () => {
    const out = await sanitize({
      name: 'Riverbend',
      population: 1200,
      dmCompass: { secretPlot: 'the mayor is a doppelganger' },
      secretTreasure: 'buried under the inn',
      dmNotes: 'players must not see this',
      plotHooks: ['a stranger arrives'],
      chronicle: [{ secretEvent: 'x' }],
      gmGuidance: 'run it tense',
    });
    expect(out.name).toBe('Riverbend');
    expect(out.population).toBe(1200);
    expect(out.dmCompass).toBeUndefined();
    expect(out.secretTreasure).toBeUndefined();
    expect(out.dmNotes).toBeUndefined();
    expect(out.plotHooks).toBeUndefined();
    expect(out.chronicle).toBeUndefined();
    expect(out.gmGuidance).toBeUndefined();
  });

  it('reduces NPCs to the public allowlist — private internals are dropped', async () => {
    const out = await sanitize({
      npcs: [{
        id: 'n1', name: 'Aldric', role: 'mayor', title: 'Lord', category: 'leader',
        personality: 'wary', physical: 'tall', factionAffiliation: 'crown',
        secondaryAffiliation: 'guild', presentation: 'formal', influence: 'high',
        // Private internals that must NOT leak:
        power: 9000, successionContribution: 0.4, potentialSuccessors: ['n2'],
        linkedSecrets: ['blackmail'], dmNotes: 'is actually a spy',
      }],
    });
    const npc = out.npcs[0];
    // Allowlisted fields survive.
    expect(npc.name).toBe('Aldric');
    expect(npc.role).toBe('mayor');
    expect(npc.influence).toBe('high');
    expect(npc.presentation).toBe('formal');
    // Private internals stripped.
    expect(npc.power).toBeUndefined();
    expect(npc.successionContribution).toBeUndefined();
    expect(npc.potentialSuccessors).toBeUndefined();
    expect(npc.linkedSecrets).toBeUndefined();
    expect(npc.dmNotes).toBeUndefined();
  });

  it('keeps benign nested data (does not over-strip inside an allowlisted subtree)', async () => {
    // LINEAGE NOTE (master merge): this lineage's sanitizer flipped the TOP level
    // to a fail-closed allowlist (128) — an unknown top-level key drops even when
    // it misses the denylist, so master's original top-level `districts`/`judgment`
    // fixture keys are dropped BY DESIGN here. The substance this test pins — the
    // deeper-level word-boundary denylist must not false-strip benign keys (e.g.
    // "judgment" carries an embedded 'gm' but no \mgm word boundary) — moves
    // inside an allowlisted subtree (`history`).
    const out = await sanitize({
      history: {
        districts: [{ name: 'Market Ward', landmarks: ['fountain'] }],
        judgment: 'fair-handed', // embedded 'gm', no word boundary — must survive
      },
    });
    expect(out.history.districts[0].name).toBe('Market Ward');
    expect(out.history.districts[0].landmarks).toEqual(['fountain']);
    expect(out.history.judgment).toBe('fair-handed');
  });

  it('drops unknown TOP-LEVEL keys even when they miss the denylist (fail-closed allowlist, 128)', async () => {
    const out = await sanitize({
      name: 'Ashford',
      districts: [{ name: 'Market Ward' }], // benign but NOT allowlisted at top level
      judgment: 'fair-handed',              // benign but NOT allowlisted at top level
    });
    expect(out.name).toBe('Ashford');
    expect(out.districts).toBeUndefined();
    expect(out.judgment).toBeUndefined();
  });

  // THE PEOPLE CAR'S THREE RETIRED KEYS, EXECUTED (migration 205, FIX-EXPORT-KEYS 2026-11-07; the
  // owner's word: the export allowlist's dead keys go before the deploy). A record published before
  // the car still carries them in its stored row; the projection must not. Anchored: the record's
  // live neighbours (the powers, the card's name and role) survive the same call.
  it('drops the retired grouping and the two retired NPC faction fields; the powers and the card stay (205)', async () => {
    const out = await sanitize({
      name: 'Brackwater',
      factions: [{ name: 'The Salt Circle', dominantCategory: 'government', members: [{ name: 'Aldric' }] }],
      powerStructure: { factions: [{ faction: 'The Salt Circle', category: 'economy', power: 60 }] },
      npcs: [{ id: 'n1', name: 'Aldric', role: 'the mayor', factionAffiliation: 'The Salt Circle', secondaryAffiliation: 'The Harbour Bench' }],
    });
    expect(out.powerStructure.factions[0].faction).toBe('The Salt Circle');
    expect(out.npcs[0]).toEqual({ id: 'n1', name: 'Aldric', role: 'the mayor' });
    expect('factions' in out).toBe(false);
    expect('factionAffiliation' in out.npcs[0]).toBe(false);
    expect('secondaryAffiliation' in out.npcs[0]).toBe(false);
    // anchored: out carries the open power and the NPC, both pinned exactly above
    expect(JSON.stringify(out)).not.toContain('The Harbour Bench');
  });

  it('SQL npc_allowed[] stays in sync with the JS mirror (publicSafe.js)', () => {
    const sql = sqlNpcAllowed(SANITIZER.sql);
    const js = jsNpcAllowed();
    // Both lists must be identical: a field added to one but not the other either
    // hides a public field or (worse) leaks a private one.
    expect([...sql].sort()).toEqual([...js].sort());
  });
});

// ── Per-member overrides (migration 092) — execute the REAL SQL ───────────────
describe('gallery per-member overrides — net-current execution (pglite)', () => {
  let mdb;
  const KEY = netCurrentFn('_gallery_npc_key');
  const APPLY = netCurrentFn('_gallery_apply_member_overrides');
  // Since 212 (the fifth review's V5-4; COHERENCE-VEIL-8's tie roles) the net-current apply ends in the roster
  // splice, which calls these helpers: the loader takes what the body needs, in the order each calls the next.
  // VEIL-13's ruling (5): the apply's covert check calls _gallery_veil_str, _gallery_veil_pieces and _gallery_veil_embeds
  // (which calls _gallery_veil_case_fold, which calls _gallery_veil_name_case and _gallery_veil_name_prep).
  const SPLICE = ['_gallery_veil_str', '_gallery_veil_pieces', '_gallery_veil_name_case', '_gallery_veil_name_prep', '_gallery_veil_case_fold',
    '_gallery_veil_embeds', '_gallery_veil_member_revealed', '_gallery_veil_roster_members', '_gallery_veil_tie_roles', '_gallery_veil_roster_splice']
    .map((name) => netCurrentFn(name));

  it('locates the net-current override helpers (6-arg apply: base + dm_full)', () => {
    expect(KEY.sql, 'no _gallery_npc_key in any migration').toBeTruthy();
    expect(APPLY.sql, 'no _gallery_apply_member_overrides in any migration').toBeTruthy();
    // The 093 fix: apply takes a settlement-level base AND a dm_full splice source.
    expect(APPLY.sql).toMatch(/dm_full\s+jsonb/);
  });

  beforeAll(async () => {
    mdb = new PGlite();
    await mdb.exec('create schema if not exists public;');
    // The apply helper depends on the sanitizer (single-NPC re-strip) + the key fn.
    await mdb.exec(SANITIZER.sql);
    await mdb.exec(KEY.sql);
    for (const fn of SPLICE) if (fn.sql) await mdb.exec(fn.sql);
    await mdb.exec(APPLY.sql);
  }, PGLITE_BOOT_TIMEOUT_MS);

  // The RAW DM-full dossier the RPC passes as `dm_full`: it carries SETTLEMENT-LEVEL
  // DM content (plotHooks, dmCompass) plus full NPCs. The leak in 092 was promoting
  // this whole thing to the public base on a single member reveal.
  const RAW_FULL = {
    plotHooks: ['the mayor is a doppelganger'],
    dmCompass: { frictionPoints: 'the guild versus the crown' },
    npcs: [
      { id: 'n1', name: 'Aldric', role: 'mayor', influence: 'high', secret: 'is a spy', goal: 'seize the crown' },
      { id: 'n2', name: 'Mara', role: 'priest', influence: 'mid', secret: 'embezzles tithes', goal: 'flee the city' },
    ],
  };
  const sanitize = async (obj) =>
    (await mdb.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;
  const apply = async (base, overrides, shareDm, importable, forImport) =>
    (await mdb.query(
      `select public._gallery_apply_member_overrides($1::jsonb,$2::jsonb,$3::jsonb,$4::boolean,$5::boolean,$6::boolean) as out`,
      [JSON.stringify(base), JSON.stringify(RAW_FULL), JSON.stringify(overrides), shareDm, importable, forImport],
    )).rows[0].out;

  it('npc key prefers npc.id, falls back to a name slug matching the client', async () => {
    const byId = (await mdb.query(`select public._gallery_npc_key($1::jsonb) as k`, [JSON.stringify({ id: 'n1', name: 'Aldric' })])).rows[0].k;
    expect(byId).toBe('n1');
    const bySlug = (await mdb.query(`select public._gallery_npc_key($1::jsonb) as k`, [JSON.stringify({ name: 'Old Tom the Smith!' })])).rows[0].k;
    expect(bySlug).toBe('npc.old_tom_the_smith');
  });

  it('REGRESSION (092 leak): revealing one NPC under a HIDDEN settlement leaks NO settlement-level DM content', async () => {
    // Settlement hidden → base is the sanitized projection (no plotHooks/dmCompass).
    const sanitized = await sanitize(RAW_FULL);
    const out = await apply(sanitized, { n1: { revealDm: true } }, false, false, false);
    // The whole point: settlement-level DM content stays stripped.
    expect(out.plotHooks).toBeUndefined();
    expect(out.dmCompass).toBeUndefined();
    // The individually-revealed member gets its DM fields; the other stays public.
    const a = out.npcs.find(n => n.name === 'Aldric');
    const b = out.npcs.find(n => n.name === 'Mara');
    expect(a.secret).toBe('is a spy');
    expect(a.goal).toBe('seize the crown');
    expect(b.secret).toBeUndefined();
    expect(b.goal).toBeUndefined();
  });

  it('settlement REVEALED + one member hidden: settlement content present, hidden member re-stripped', async () => {
    // Settlement revealed → base is the DM-full projection (settlement content intended).
    const out = await apply(RAW_FULL, { n2: { revealDm: false } }, true, false, false);
    expect(out.plotHooks).toBeDefined();       // owner revealed the settlement: intended
    const a = out.npcs.find(n => n.name === 'Aldric');
    const b = out.npcs.find(n => n.name === 'Mara');
    expect(a.secret).toBe('is a spy');
    expect(b.secret).toBeUndefined();          // individually hidden
  });

  it('import: a member keeps DM fields only when revealed AND import-allowed', async () => {
    const sanitized = await sanitize(RAW_FULL);
    const out = await apply(sanitized, { n1: { revealDm: true, allowImport: false }, n2: { revealDm: true, allowImport: true } }, false, false, true);
    const a = out.npcs.find(n => n.name === 'Aldric');
    const b = out.npcs.find(n => n.name === 'Mara');
    expect(a.secret).toBeUndefined();          // revealed but not importable
    expect(b.secret).toBe('embezzles tithes'); // revealed + importable
  });

  it('no npcs array → returned unchanged', async () => {
    const out = await apply({ name: 'Riverbend', population: 900 }, {}, false, false, false);
    expect(out).toEqual({ name: 'Riverbend', population: 900 });
  });
});

// ── 206: THE CARD'S VEIL BIT (FIX-PUBLIC-VEIL, the chair's ruling of 2026-11-07, shape (a)) ──
// Every writer of a card's `institution` stamps `institution.veiled` at birth from ONE predicate
// (src/domain/people/cardVeil.js); the sanitizer and its client twin READ the bit. Where it is false
// the house is public (institution, title, role, memberships); where it is true or ABSENT the face
// is bare (fail-closed); a card with no institution record is 205's projection exactly. Each proof
// is EXECUTED on the net-current SQL and compared field for field with toPublicSafe.
describe('206 — the card\'s veil bit: a face\'s house is public only where veiled is false (pglite)', () => {
  let vdb;
  const sanitizeV = async (obj) =>
    (await vdb.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;
  /** @param {string} name */
  const sqlArray = (name) => {
    const m = SANITIZER.sql.match(new RegExp(`${name}\\s+constant\\s+text\\[\\]\\s*:=\\s*array\\[([\\s\\S]*?)\\]`, 'i'));
    if (!m) throw new Error(`${name} not found in the net-current sanitizer`);
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]).sort();
  };
  const BODY = { personality: 'wary', physical: 'tall', presentation: 'plain', influence: 'high', category: 'government',
    goal: 'DM-ONLY-GOAL', secret: 'DM-ONLY-SECRET', power: 9 };
  // the hidden infiltrator's mint (castPowers.js R-P4), stamped veiled
  const INFILTRATOR = { id: 'npc_power_the_independent_bloc', name: 'Wendel Ashby', title: "the bloc's speaker", role: "the bloc's speaker",
    ...BODY, institution: { kind: 'power', key: 'The Independent Bloc', family: null, title: "the bloc's speaker", veiled: true },
    memberships: [{ power: 'The Independent Bloc', rank: 1, share: 1, veiled: true }] };
  // a criminal guild's face, stamped veiled
  const GUILDMASTER = { id: 'npc_thieves_guild_chapter', name: 'Corvin Vale', title: 'the guildmaster of thieves', role: 'the guildmaster of thieves',
    ...BODY, category: 'criminal', institution: { kind: 'house', key: "Thieves' guild chapter", family: "Thieves' guild chapter", title: 'the guildmaster of thieves', veiled: true },
    memberships: [{ power: 'The Night Market', rank: 1, share: 0.6, veiled: true }] };
  // the parish priest, an open house
  const PRIEST = { id: 'npc_parish_church', name: 'Robert Thomas', title: 'the priest', role: 'the priest',
    ...BODY, category: 'religious', institution: { kind: 'house', key: 'Parish church', family: 'Parish church', title: 'the priest', veiled: false },
    memberships: [{ power: 'The Parish', rank: 1, share: 1, veiled: false }] };
  // an open house's face holding one public and one HIDDEN membership (soak1k-389's shape: a court house
  // backing the infiltrator's hidden power), plus an unstamped entry
  const MAGISTRATE = { id: 'npc_multiple_court_buildings', name: 'Hal Brede', title: 'the chief magistrate', role: 'the chief magistrate',
    ...BODY, institution: { kind: 'house', key: 'Multiple court buildings', family: 'Court', title: 'the chief magistrate', veiled: false },
    memberships: [{ power: 'The Crown', rank: 1, share: 0.6, veiled: false }, { power: 'The Quiet Hand', rank: 2, share: 0.4, veiled: true },
      { power: 'The Old Guard', rank: null, share: null }] };
  // a card born by the car BEFORE the bit (an institution record, no `veiled`)
  const UNSTAMPED = { id: 'npc_mill', name: 'Ada Miller', title: 'the miller', role: 'the miller',
    ...BODY, institution: { kind: 'house', key: 'Mill', family: 'Mill', title: 'the miller' }, memberships: [{ power: 'The Guilds', rank: 2, share: 0.4 }] };
  // a card saved before the people car (no institution, today's title and role)
  const PRE_CAR = { id: 'npc.old_tom', name: 'Old Tom', title: 'Laird', role: 'Blacksmith', ...BODY, category: 'economy' };
  // a DM's person after the v1 -> v2 migration (institution null, memberships moved from factionAffiliation)
  const DM_PERSON = { id: 'npc.dm_mara', name: 'Mara', title: 'Captain', role: 'Captain', ...BODY, institution: null,
    memberships: [{ power: 'The Watch', rank: null, share: null }] };
  // a malformed institution value (no kind / key): no house record, so 205's projection on both sides
  const MALFORMED = { id: 'npc.odd', name: 'Odd Fellow', title: 'Warden', role: 'Warden', ...BODY,
    institution: { title: 'the warden', veiled: false }, memberships: [{ power: 'The Crown', rank: 1, share: 1, veiled: false }] };
  const ALL = [INFILTRATOR, GUILDMASTER, PRIEST, MAGISTRATE, UNSTAMPED, PRE_CAR, DM_PERSON, MALFORMED];

  beforeAll(async () => {
    vdb = new PGlite();
    await vdb.exec('create schema if not exists public;');
    await vdb.exec(SANITIZER.sql);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the net-current sanitizer is 206 or later, and its two house constants equal the client twin\'s', async () => {
    expect(Number(String(SANITIZER.file).split('_')[0])).toBeGreaterThanOrEqual(206);
    const { NPC_HOUSE_KEYS, NPC_HOUSE_NAMED_KEYS } = await import('../../src/domain/display/publicSafe.js');
    expect(sqlArray('npc_house_keys')).toEqual([...NPC_HOUSE_KEYS].sort());
    expect(sqlArray('npc_house_named')).toEqual([...NPC_HOUSE_NAMED_KEYS].sort());
    // anchored: the two constants name exactly the car's three public fields plus the role
    expect(sqlArray('npc_house_keys')).toEqual(['institution', 'memberships']);
    expect(sqlArray('npc_house_named')).toEqual(['role', 'title']);
  });

  it('a hidden-infiltrator face comes out bare: no institution, no title, no role, no memberships', async () => {
    const npc = (await sanitizeV({ npcs: [INFILTRATOR] })).npcs[0];
    expect(npc.name).toBe('Wendel Ashby');
    expect(npc.personality).toBe('wary');
    for (const k of ['institution', 'title', 'role', 'memberships', 'goal', 'secret', 'power']) expect(k in npc, k).toBe(false);
    const { id: _id, ...rest } = npc;
    // anchored: the face is asserted to keep its name and personality above, so `rest` is non-empty
    expect(JSON.stringify(rest)).not.toContain("bloc's speaker");
    // anchored: the face is asserted to keep its name and personality above, so `rest` is non-empty
    expect(JSON.stringify(rest)).not.toContain('Independent Bloc');
  });

  it('a criminal guild\'s face comes out bare', async () => {
    const npc = (await sanitizeV({ npcs: [GUILDMASTER] })).npcs[0];
    expect(npc.name).toBe('Corvin Vale');
    for (const k of ['institution', 'title', 'role', 'memberships']) expect(k in npc, k).toBe(false);
    // the card's `id` is the house slug and stays public (the identity floor, the gallery member key —
    // recorded in docs/FIX_PUBLIC_VEIL_2026-11-07.md for the chair); every OTHER field is clean
    const { id: _id, ...rest } = npc;
    // anchored: the face is asserted to keep its name above, so `rest` is non-empty
    expect(JSON.stringify(rest)).not.toMatch(/thieves/i);
    // anchored: the face is asserted to keep its name above, so `rest` is non-empty
    expect(JSON.stringify(rest)).not.toContain('Night Market');
  });

  it('a parish priest comes out with its institution, title, role and memberships', async () => {
    const npc = (await sanitizeV({ npcs: [PRIEST] })).npcs[0];
    expect(npc.institution).toEqual(PRIEST.institution);
    expect(npc.title).toBe('the priest');
    expect(npc.role).toBe('the priest');
    expect(npc.memberships).toEqual(PRIEST.memberships);
    // and nothing of the DM's: the rest of the card is 205's allowlist
    for (const k of ['goal', 'secret', 'power']) expect(k in npc, k).toBe(false);
  });

  it('an unveiled face with one public and one hidden membership comes out with exactly the public one', async () => {
    const npc = (await sanitizeV({ npcs: [MAGISTRATE] })).npcs[0];
    expect(npc.institution.key).toBe('Multiple court buildings');
    expect(npc.memberships).toEqual([{ power: 'The Crown', rank: 1, share: 0.6, veiled: false }]);
    // anchored: npc is asserted to carry its institution and its open membership just above
    expect(JSON.stringify(npc)).not.toContain('The Quiet Hand');
    // anchored: npc is asserted to carry its institution and its open membership just above
    expect(JSON.stringify(npc)).not.toContain('The Old Guard');
    // a memberships that is not an array is dropped whole (fail-closed)
    const odd = (await sanitizeV({ npcs: [{ ...MAGISTRATE, memberships: { power: 'The Quiet Hand' } }] })).npcs[0];
    expect('memberships' in odd).toBe(false);
    expect(odd.institution.key).toBe('Multiple court buildings');
  });

  it('a row without the bit (born before the fix) is stripped — fail-closed', async () => {
    const npc = (await sanitizeV({ npcs: [UNSTAMPED] })).npcs[0];
    expect(npc.name).toBe('Ada Miller');
    for (const k of ['institution', 'title', 'role', 'memberships']) expect(k in npc, k).toBe(false);
  });

  it('a pre-car NPC row is unchanged by the rule: 205\'s projection, title and role kept', async () => {
    const npc = (await sanitizeV({ npcs: [PRE_CAR] })).npcs[0];
    expect(npc).toEqual({ id: 'npc.old_tom', name: 'Old Tom', title: 'Laird', role: 'Blacksmith', category: 'economy',
      personality: 'wary', physical: 'tall', presentation: 'plain', influence: 'high' });
  });

  it('a malformed institution value (no kind or key) is no house record: 205\'s projection, nothing of the house', async () => {
    const npc = (await sanitizeV({ npcs: [MALFORMED] })).npcs[0];
    expect(npc.title).toBe('Warden');
    expect('institution' in npc).toBe(false);
    expect('memberships' in npc).toBe(false);
  });

  it('a DM\'s person (institution null) keeps its title and role and publishes no memberships', async () => {
    const npc = (await sanitizeV({ npcs: [DM_PERSON] })).npcs[0];
    expect(npc.title).toBe('Captain');
    expect(npc.role).toBe('Captain');
    expect('institution' in npc).toBe(false);
    expect('memberships' in npc).toBe(false);
  });

  it('a roster member under powerStructure.factions[].members obeys the same rule', async () => {
    const out = await sanitizeV({ powerStructure: { factions: [{ faction: 'The Parish', power: 10, members: [PRIEST, INFILTRATOR] }] } });
    const [priest, infiltrator] = out.powerStructure.factions[0].members;
    expect(priest.institution).toEqual(PRIEST.institution);
    expect(priest.memberships).toEqual(PRIEST.memberships);
    expect(priest.title).toBe('the priest');
    for (const k of ['institution', 'title', 'role', 'memberships']) expect(k in infiltrator, k).toBe(false);
  });

  it('client == server, field for field, on every card and both paths (the publicSafe.js twin)', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    const record = { name: 'Riverbend', npcs: ALL, powerStructure: { factions: [{ faction: 'The Parish', power: 10, members: ALL }] } };
    const server = await sanitizeV(record);
    const client = JSON.parse(JSON.stringify(toPublicSafe(record)));
    expect(client.npcs).toEqual(server.npcs);
    expect(client.powerStructure.factions[0].members).toEqual(server.powerStructure.factions[0].members);
    // anchored: the server output is not vacuous — the priest's house rides, the infiltrator's does not
    expect(server.npcs.find((n) => n.id === PRIEST.id).institution.key).toBe('Parish church');
    expect(server.npcs.find((n) => n.id === INFILTRATOR.id).name).toBe('Wendel Ashby');
  });
});

// ── 206, SECOND SEAT: THE HIDDEN POWER AND A VEILED FACE'S TIES (the chair's ruling of 2026-11-08) ──
// A hidden power's own row and its NAME leave the public JSON (the row, the crisis cast's stakes, the
// conflicts naming it, another row's niche contest, any other string, masked); the stress TYPE stays.
// A veiled face's title leaves its ties (npc1Role for the `from` end, npc2Role for the `to` end).
describe('206 (second seat) — the hidden power is not public, and a veiled face\'s ties carry no title (pglite)', () => {
  let hdb;
  const sanitizeH = async (obj) =>
    (await hdb.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;
  const HIDDEN = 'The Quiet Hand';
  const VEILED_MINT = { id: 'npc_power_the_quiet_hand', name: 'Wendel Ashby', title: 'the bloc\'s speaker', role: 'the bloc\'s speaker',
    institution: { kind: 'power', key: HIDDEN, family: null, title: 'the bloc\'s speaker', veiled: true },
    memberships: [{ power: HIDDEN, rank: 1, share: 1, veiled: true }] };
  const SEAT = { id: 'npc_seat', name: 'Oda Hoffmann', title: 'the eldest', role: 'the eldest',
    institution: { kind: 'power', key: 'Elder Council', family: null, title: 'the eldest', veiled: false },
    memberships: [{ power: 'Elder Council', rank: 1, share: 1, veiled: false }] };
  const RECORD = {
    name: 'Riverbend',
    npcs: [SEAT, VEILED_MINT],
    relationships: [{ id: 'tie_npc_seat', from: 'npc_seat', to: 'npc_power_the_quiet_hand', npc1Role: 'the eldest', npc2Role: 'the bloc\'s speaker', npc1Name: 'Oda Hoffmann', npc2Name: 'Wendel Ashby' },
      { id: 'tie_npc_power_the_quiet_hand', from: 'npc_power_the_quiet_hand', to: 'npc_seat', npc1Role: 'the bloc\'s speaker', npc2Role: 'the eldest' }],
    powerStructure: {
      factions: [
        { faction: 'Elder Council', power: 40, isGoverning: true, desc: 'The old families. They play The Quiet Hand and the Guilds against each other.' },
        { faction: HIDDEN, name: HIDDEN, power: 15, category: 'other', hidden: true, desc: 'An external interest with embedded assets in at least two factions. Its presence is not known to the settlement.' },
        { faction: 'The Free Alliance', name: 'The Free Alliance', power: 8, hidden: true, contestsNiche: HIDDEN },
        { faction: 'Merchant Guilds', power: 30, contestsNiche: HIDDEN },
      ],
      conflicts: [{ parties: [HIDDEN, 'Elder Council'], issue: 'x', desc: 'The Quiet Hand and Elder Council are in conflict.' },
        { parties: ['Elder Council', 'Merchant Guilds'], issue: 'tolls', desc: 'Elder Council and Merchant Guilds dispute the tolls.' }],
    },
    conflicts: [{ parties: [HIDDEN, 'Elder Council'], issue: 'x', desc: 'The Quiet Hand and Elder Council are in conflict.' }],
    stress: { type: 'infiltrated', label: 'Infiltrated', cast: { stakes: [{ factionId: HIDDEN, stake: 'split' }, { factionId: 'Elder Council', stake: 'loses' }], roles: [] } },
    stressors: [{ type: 'infiltrated', cast: { stakes: [{ factionId: HIDDEN, stake: 'split' }] } }],
  };

  beforeAll(async () => {
    hdb = new PGlite();
    await hdb.exec('create schema if not exists public;');
    await hdb.exec(SANITIZER.sql);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the hidden power\'s name appears nowhere in the sanitized JSON; the stress type stays', async () => {
    const out = await sanitizeH(RECORD);
    const text = JSON.stringify(out);
    // anchored: the open powers, conflict and stress type are pinned present just below
    expect(text).not.toContain(HIDDEN);
    // anchored: the open powers, conflict and stress type are pinned present just below
    expect(text).not.toContain('The Free Alliance'); // the second hidden row goes too
    // anchored: the open powers, conflict and stress type are pinned present just below
    expect(text).not.toContain('Its presence is not known');
    // anchored: the open powers, the open conflict and the stress type are all still there
    expect(out.powerStructure.factions.map((f) => f.faction)).toEqual(['Elder Council', 'Merchant Guilds']);
    expect(out.powerStructure.conflicts.map((c) => c.issue)).toEqual(['tolls']);
    expect(out.conflicts).toEqual([]);
    expect(out.stress.type).toBe('infiltrated');
    expect(out.stress.cast.stakes).toEqual([{ factionId: 'Elder Council', stake: 'loses' }]);
    expect(out.stressors[0].cast.stakes).toEqual([]);
    expect(out.powerStructure.factions[1].contestsNiche).toBe('an unseen interest'); // another row naming it: masked
    expect(out.powerStructure.factions[0].desc).toBe('The old families. They play an unseen interest and the Guilds against each other.');
  });

  it('a veiled face\'s ties carry no title at either end; an open end keeps its role; the tie still resolves', async () => {
    const out = await sanitizeH(RECORD);
    const [a, b] = out.relationships;
    expect(a.npc1Role).toBe('the eldest');
    expect('npc2Role' in a).toBe(false);
    expect('npc1Role' in b).toBe(false);
    expect(b.npc2Role).toBe('the eldest');
    const ids = new Set(out.npcs.map((n) => n.id));
    for (const tie of out.relationships) { expect(ids.has(tie.from)).toBe(true); expect(ids.has(tie.to)).toBe(true); }
    // anchored: out's ties and NPCs are asserted present and joined just above
    expect(JSON.stringify(out)).not.toContain('bloc\'s speaker');
  });

  it('client == server on the fixture and on real generated towns with an infiltrator', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const records = [RECORD];
    for (const seed of ['veil-a', 'veil-b', 'veil-c']) {
      records.push(generateSettlementPipeline({ settType: 'city', culture: 'germanic', stressTypes: ['infiltrated'] }, null, { seed, customContent: {} }));
    }
    let hiddenSeen = 0;
    for (const rec of records) {
      const hidden = (rec.powerStructure?.factions || []).filter((f) => f.hidden === true).map((f) => f.faction);
      hiddenSeen += hidden.length;
      const server = await sanitizeH(rec);
      const client = JSON.parse(JSON.stringify(toPublicSafe(rec)));
      expect(client).toEqual(server);
      // anchored: server equals the client projection of a generated city, asserted on the line above
      for (const name of hidden) expect(JSON.stringify(server)).not.toContain(name);
      // FIX-PUBLIC-VEIL (option (B)): a veiled face is born with an opaque id; on the public payload no
      // face path spells its house, and every tie to it still resolves
      // (generated towns only: the hand-made fixture above is not born by the generator)
      const veiledFaces = rec === RECORD ? [] : (rec.npcs || []).filter((n) => n.institution && n.institution.veiled === true);
      const ids = new Set(server.npcs.map((n) => n.id));
      for (const n of veiledFaces) {
        expect(ids.has(n.id)).toBe(true);
        const slug = String(n.institution.key).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        // anchored: each NPC id is asserted present in the server JSON on the lines above
        expect(JSON.stringify({ npcs: server.npcs, relationships: server.relationships, stress: server.stress, stressors: server.stressors })).not.toContain(slug);
      }
      for (const tie of server.relationships || []) { expect(ids.has(tie.from)).toBe(true); expect(ids.has(tie.to)).toBe(true); }
    }
    expect(hiddenSeen, 'anchored: the generated towns carry a hidden power').toBeGreaterThanOrEqual(4);
    const born = records.slice(1).flatMap((r) => (r.npcs || []).filter((n) => n.institution?.veiled === true));
    expect(born.length, 'anchored: the generated towns carry veiled faces').toBeGreaterThan(3);
    for (const n of born) expect(n.id).toMatch(/^npc_veiled_[0-9a-f]{16}(_\d+)?$/);
  }, 120_000);
});

// ── R5 (VEIL-FIX, the pre-deploy review of 2026-11-10, finding 4): THE NAME MASK WALKS THE DOCUMENT ──
// 206/207/210 masked a hidden power's name by `replace` over the JSON TEXT, so a name that matched
// text outside a string raised (`true`, `null`, `1`, a single space, `{`) and a name equal to a key
// rewrote the key (`name`, `id`, `text`); a substring hit the settlement's own name; and a row
// stamped hidden with no `faction` stayed public, its description and all. 210 (the last restatement)
// now masks inside string VALUES only by walking the document — never a key, never the settlement's
// own top-level `name` — skips an empty or whitespace-only name, and removes every row stamped
// hidden whatever its `faction`. The client twin (publicSafe.js :: publicVeilPass) holds field for field.
describe('R5 — the hidden-power name mask walks string values (pglite + the client twin)', () => {
  let mdb;
  const sanitizeM = async (obj) =>
    (await mdb.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;
  const town = (hiddenName, extra = {}) => ({
    name: 'Riverbend', id: 'set-1', tier: 'town',
    powerStructure: {
      factions: [
        { faction: 'Elder Council', power: 40, seats: 11, vacancy: null, isGoverning: true, desc: `They watch ${hiddenName} closely.` },
        { faction: hiddenName, power: 15, hidden: true, desc: 'Its presence is not known to the settlement.' },
      ],
    },
    thesis: { text: `A town where ${hiddenName} is whispered of.`, id: 'thesis-1', name: 'the thesis' },
    ...extra,
  });

  beforeAll(async () => {
    mdb = new PGlite();
    await mdb.exec('create schema if not exists public;');
    await mdb.exec(SANITIZER.sql);
  }, PGLITE_BOOT_TIMEOUT_MS);

  const clientOf = async (rec) => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    return JSON.parse(JSON.stringify(toPublicSafe(rec)));
  };

  it('a hidden power named "true", "null", "1", " " or "{" never raises; the row leaves; client == server', async () => {
    for (const raising of ['true', 'null', '1', ' ', '{']) {
      const rec = town(raising);
      const out = await sanitizeM(rec);
      expect(out.name, raising).toBe('Riverbend');
      expect(out.powerStructure.factions.map((f) => f.faction), raising).toEqual(['Elder Council']);
      // anchored: the open row is asserted present on the line above
      expect(JSON.stringify(out), raising).not.toContain('Its presence is not known');
      expect(await clientOf(rec), raising).toEqual(out);
    }
  });

  it('a whitespace-only name masks nothing (the space between words survives)', async () => {
    const out = await sanitizeM(town(' '));
    expect(out.thesis.text).toBe('A town where   is whispered of.');
    expect(out.powerStructure.factions[0].desc).toBe('They watch   closely.');
  });

  it('a non-raising name is still masked inside string values', async () => {
    const out = await sanitizeM(town('true'));
    expect(out.thesis.text).toBe('A town where an unseen interest is whispered of.');
  });

  it('a hidden power named "name", "id" or "text" rewrites no key; client == server', async () => {
    for (const keyName of ['name', 'id', 'text']) {
      const rec = town(keyName);
      const out = await sanitizeM(rec);
      expect(out.name, keyName).toBe('Riverbend');
      expect(out.id, keyName).toBe('set-1');
      expect(Object.keys(out.thesis).sort(), keyName).toEqual(['id', 'name', 'text']);
      expect(Object.keys(out), keyName).not.toContain('an unseen interest'); // anchored: out.name and out.id are asserted present just above
      expect(out.thesis.text, keyName).toBe('A town where an unseen interest is whispered of.');
      expect(await clientOf(rec), keyName).toEqual(out);
    }
  });

  it("the settlement's own top-level name is never masked (a hidden power that is its substring); client == server", async () => {
    const rec = town('The Independent Bloc', { name: 'The Independent Bloc Hall' });
    const out = await sanitizeM(rec);
    expect(out.name).toBe('The Independent Bloc Hall');
    expect(out.thesis.text).toBe('A town where an unseen interest is whispered of.');
    expect(await clientOf(rec)).toEqual(out);
  });

  it('a row stamped hidden with a missing or empty faction leaves the public JSON; client == server', async () => {
    const rec = {
      name: 'Riverbend',
      powerStructure: { factions: [
        { faction: 'Elder Council', power: 40 },
        { hidden: true, power: 9, desc: 'A faceless ring nobody names.' },
        { faction: '', hidden: true, power: 7, desc: 'An empty-named cell.' },
      ] },
    };
    const out = await sanitizeM(rec);
    expect(out.powerStructure.factions).toEqual([{ faction: 'Elder Council', power: 40 }]);
    expect(await clientOf(rec)).toEqual(out);
  });
});

// R10 (VEIL-FIX re-review, 2026-11-10): EVERY RESTATEMENT SOUND ALONE. 206, 207 and 210 each restate
// _gallery_sanitize_public_json; a push that stops between files leaves whichever body applied last, and
// a rollback re-applies an earlier one. So each file's OWN body carries the corrected mask and hidden-row
// removal: the R5 cases run on all three bodies, each in its own database.
describe('R10 — the corrected mask in every restatement (206, 207 and 210, each body alone)', () => {
  const BODIES = ['206_public_card_veil_bit.sql', '207_public_hall_capture_veil.sql', '210_public_prose_text_projection.sql'];
  /** @type {Record<string, PGlite>} */
  const dbs = {};
  beforeAll(async () => {
    const re = /^create\s+or\s+replace\s+function\s+public\._gallery_sanitize_public_json\b[\s\S]*?\$\$;/igm;
    for (const file of BODIES) {
      const src = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8');
      const body = src.match(re);
      if (!body || body.length !== 1) throw new Error(`${file}: expected exactly one sanitizer body`);
      dbs[file] = new PGlite();
      await dbs[file].exec('create schema if not exists public;');
      await dbs[file].exec(body[0]);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  const run = async (file, obj) =>
    (await dbs[file].query('select public._gallery_sanitize_public_json($1::jsonb) as out', [JSON.stringify(obj)])).rows[0].out;
  const town = (hiddenName, name = 'Riverbend') => ({
    name, id: 'set-1', tier: 'town',
    powerStructure: { factions: [
      { faction: 'Elder Council', power: 40, seats: 11, vacancy: null, isGoverning: true, desc: `They watch ${hiddenName} closely.` },
      { faction: hiddenName, power: 15, hidden: true, desc: 'Its presence is not known to the settlement.' },
      { hidden: true, power: 9, desc: 'A faceless ring nobody names.' },
    ] },
    thesis: { text: `A town where ${hiddenName} is whispered of.`, id: 'thesis-1', name: 'the thesis' },
  });

  it('each body: the raising and key-equal names mask string values only, rows stamped hidden leave, the settlement name stands', async () => {
    for (const file of BODIES) {
      for (const hiddenName of ['true', 'null', '1', '{', 'name', 'id', 'text']) {
        const out = await run(file, town(hiddenName));
        const at = `${file} / ${JSON.stringify(hiddenName)}`;
        expect(out.name, at).toBe('Riverbend');
        expect(Object.keys(out).sort(), at).toEqual(['id', 'name', 'powerStructure', 'thesis', 'tier']);
        expect(Object.keys(out.thesis).sort(), at).toEqual(['id', 'name', 'text']);
        expect(out.thesis.text, at).toBe('A town where an unseen interest is whispered of.');
        expect(out.powerStructure.factions.map((f) => f.faction), at).toEqual(['Elder Council']);
      }
      const sub = await run(file, town('The Independent Bloc', 'The Independent Bloc Hall'));
      expect(sub.name, file).toBe('The Independent Bloc Hall');
      const blank = await run(file, town(' '));
      expect(blank.thesis.text, file).toBe('A town where   is whispered of.');
    }
  });
});

// R11 (VEIL-FIX re-review, 2026-11-10): THE MASK'S EDGES. A hidden power named "1" rewrote every id
// ("set-1" -> "set-an unseen interest") and the projection's format tag (`publicProse.v`, "pp-1"), so a
// shared page lost its stamp and its rows their identity; and the blank-name test differed between the
// server and the client (a no-break space was blank to one and a name to the other). The walk now skips
// every leaf whose last path element is `id`, and `publicProse.v`; the blank test is one explicit class
// on both sides. Run on each restatement's own body and against the client twin.
describe('R11 — the mask skips ids and the prose format tag; one blank test on both sides', () => {
  const BODIES = ['206_public_card_veil_bit.sql', '207_public_hall_capture_veil.sql', '210_public_prose_text_projection.sql'];
  /** @type {Record<string, PGlite>} */
  const dbs = {};
  beforeAll(async () => {
    const re = /^create\s+or\s+replace\s+function\s+public\._gallery_sanitize_public_json\b[\s\S]*?\$\$;/igm;
    for (const file of BODIES) {
      dbs[file] = new PGlite();
      await dbs[file].exec('create schema if not exists public;');
      await dbs[file].exec(readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8').match(re)[0]);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);
  const run = async (file, obj) =>
    (await dbs[file].query('select public._gallery_sanitize_public_json($1::jsonb) as out', [JSON.stringify(obj)])).rows[0].out;
  const clientOf = async (rec) => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    return JSON.parse(JSON.stringify(toPublicSafe(rec)));
  };
  const town = (hiddenName) => ({
    name: 'Riverbend', id: 'set-1', tier: 'town',
    publicProse: { v: 'pp-1', blocks: { 'general:overview': { text: `Talk of ${hiddenName} fills the square.` } } },
    npcs: [{ id: 'npc-1', name: 'Ada', role: 'Smith' }],
    powerStructure: { factions: [
      { faction: 'Elder Council', id: 'power-1', power: 40, desc: `They watch ${hiddenName} closely.` },
      { faction: hiddenName, power: 15, hidden: true, desc: 'Its presence is not known.' },
    ] },
  });

  it('a hidden power named "1": every id and the prose format tag stand, the prose text is masked; each body; client == server', async () => {
    for (const file of BODIES) {
      const out = await run(file, town('1'));
      expect(out.id, file).toBe('set-1');
      expect(out.npcs[0].id, file).toBe('npc-1');
      expect(out.powerStructure.factions[0].id, file).toBe('power-1');
      expect(out.powerStructure.factions[0].desc, file).toBe('They watch an unseen interest closely.');
      if (file.startsWith('210')) {
        expect(out.publicProse.v, file).toBe('pp-1');
        expect(out.publicProse.blocks['general:overview'].text, file).toBe('Talk of an unseen interest fills the square.');
        expect(await clientOf(town('1')), file).toEqual(out);
      }
    }
  });

  it('a no-break-space name is blank on the server and on the client alike: it masks nothing; each body; client == server', async () => {
    for (const file of BODIES) {
      const out = await run(file, town(' '));
      expect(out.powerStructure.factions[0].desc, file).toBe('They watch   closely.');
      expect(out.powerStructure.factions.map((f) => f.faction), file).toEqual(['Elder Council']);
      if (file.startsWith('210')) expect(await clientOf(town(' ')), file).toEqual(out);
    }
  });
});
