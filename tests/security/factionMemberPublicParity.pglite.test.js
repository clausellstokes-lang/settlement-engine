/**
 * factionMemberPublicParity.pglite.test.js — the FACTION-MEMBER privacy scrub,
 * both halves (CYCLE-3 Wave 8 respec H21, migration 189 + publicSafe.js twin).
 *
 * THE DEFECT THIS PINS CLOSED: factions[].members[] embed the SAME full NPC
 * records as npcs[] (factionGrouping pushes roster object references;
 * relinkFactionMembers re-points them at the enriched roster), but the NPC
 * field allowlist only fired on paths ending in 'npcs' — a member's path ends
 * in 'members' under 'factions', so it never matched. The deep denylist still
 * caught `secret`/`plotHooks` (tokens secret|plotHook|hook), but `goal` (the
 * NPC's DM motivation), `gender`, `power`, and any future non-allowlisted NPC
 * field rode through to public / anon / preview projections on BOTH halves.
 *
 * This file walks BOTH halves against one fixture:
 *   1. CLIENT — toPublicSafe reduces faction members to the NPC public
 *      allowlist (default mode), keeps them whole in full mode (the owner's
 *      gallery_share_dm opt-in), and projects a member to the SAME key set as
 *      the identical record in npcs[] (the no-drift behavioural pin between
 *      NPC_PUBLIC_KEYS, publicNpc, and the SQL npc_allowed).
 *   2. SERVER — the NET-CURRENT _gallery_sanitize_public_json (latest-wins
 *      across migrations, i.e. 189's recreate) executes in pglite against the
 *      same fixture and strips identically, pinned field-for-field to the
 *      client twin (the gallerySanitize.pglite.test.js idiom).
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { toPublicSafe, NPC_PUBLIC_KEYS } from '../../src/domain/display/publicSafe.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of the net-current `_gallery_sanitize_public_json`
 *  function body across all migrations (file order). Returns the LAST definition so
 *  the EFFECTIVE server sanitizer is tested, not a superseded one. */
function netCurrentSanitizerSql() {
  if (!existsSync(MIGRATIONS_DIR)) return null;
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  // ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form also matches header
  // prose quoting the statement (see tests/security/moneyRpcNetCurrentGuards.test.js).
  const re = /^create\s+or\s+replace\s+function\s+public\._gallery_sanitize_public_json\b[\s\S]*?\$\$;/igm;
  let last = null;
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const SANITIZER_SQL = netCurrentSanitizerSql();

// The full NPC record — the SAME shape npcGenerator emits and factionGrouping
// embeds by reference into faction rosters. Every allowlisted field present, so
// the member projection and the npcs[] projection of this record must carry the
// SAME key set (the no-drift pin). DM-private sentinels are unique strings
// asserted absent from the whole serialized projection.
const ALDRIC = {
  id: 'n1', name: 'Aldric', gender: 'male', role: 'Mayor', title: 'Lord-Mayor',
  category: 'government',
  personality: { dominant: 'wary', flaw: 'greed', modifier: 'quiet', tell: 'taps his ring', speech: 'clipped' },
  physical: { age: 'greying', build: 'stout', feature: 'scarred hands', clothes: 'fine wool' },
  goal: { short: 'quietly hoards the levy rolls', long: 'Means to buy the harbour wardship before the crown audits.' },
  secret: { what: 'forged the harbour charter', stakes: 'exposure means the gallows' },
  plotHooks: ['The Forged Charter', 'The Missing Ledger'],
  relationships: [{ with: 'n2', type: 'rival' }],
  influence: 'high', power: 9000, presentation: 'formal',
  factionAffiliation: 'The Salt Circle', secondaryAffiliation: 'The Harbour Bench',
};

const SETTLEMENT = {
  name: 'Brackwater', tier: 'town', population: 1200,
  // The SAME record in the canonical roster — production truth: members are the
  // npcs[] records themselves (same object references at generation time).
  npcs: [ALDRIC],
  factions: [{
    name: 'The Salt Circle', dominantCategory: 'government',
    members: [
      ALDRIC,
      // A second, sparser member: reduction must key-filter, never drop the member.
      { name: 'Mara', role: 'clerk', goal: { short: 'skim the tithe rolls' } },
    ],
  }],
  // A DEEPER roster under a 'factions' ancestor: the live generator emits no
  // powerStructure members today (breakdown rows only), but the ancestor rule
  // ('factions' = any(path)) must cover any future roster fail-closed — parity
  // on both halves is pinned here so the two predicates cannot drift.
  powerStructure: {
    summary: 'a merchant council',
    factions: [{
      faction: 'The Salt Circle', category: 'economy', power: 60,
      members: [{ name: 'Odo', role: 'factor', goal: { short: 'buy a bench seat' }, gender: 'male' }],
    }],
  },
};

// Every DM-private sentinel that must appear NOWHERE in a default projection.
const PRIVATE_SENTINELS = [
  'quietly hoards the levy rolls', // members[0].goal.short — the CONFIRMED live leak
  'harbour wardship',              // members[0].goal.long
  'forged the harbour charter',    // members[0].secret.what
  'The Forged Charter',            // members[0].plotHooks
  'skim the tithe rolls',          // sparse member goal
  'buy a bench seat',              // deep-roster member goal
];

describe('_gallery_sanitize_public_json exists and carries the 189 member predicate', () => {
  it('a net-current definition is present and gates faction-member paths', () => {
    expect(existsSync(MIGRATIONS_DIR), `migrations dir missing: ${MIGRATIONS_DIR}`).toBe(true);
    expect(SANITIZER_SQL, '_gallery_sanitize_public_json not found in any migration — renamed?').toBeTruthy();
    // Early tell (behavioural pins below are the real proof): the net-current
    // definition must still carry the member-roster arm of is_npc_obj. A later
    // recreate that drops it would red here AND leak `goal` below.
    expect(SANITIZER_SQL).toMatch(/'members'/);
  });
});

describe('CLIENT half — toPublicSafe reduces faction-roster members (189 twin)', () => {
  it('strips goal/secret/plotHooks/relationships/gender/power from factions[].members[]', () => {
    const out = toPublicSafe(SETTLEMENT);
    expect(out.factions).toHaveLength(1);
    const members = out.factions[0].members;
    expect(members, 'members must be reduced, never dropped').toHaveLength(2);
    expect(members[0].name).toBe('Aldric');
    expect(members[0].role).toBe('Mayor');
    expect(members[0].influence).toBe('high');
    for (const k of ['goal', 'secret', 'plotHooks', 'relationships', 'gender', 'power']) {
      expect(members[0][k], `member "${k}" must not leak`).toBeUndefined();
    }
    // The sparse member survives as a key-filtered record.
    expect(members[1]).toEqual({ name: 'Mara', role: 'clerk' });
  });

  it('covers a deeper roster under a factions ancestor (powerStructure.factions[].members)', () => {
    const out = toPublicSafe(SETTLEMENT);
    const deep = out.powerStructure.factions[0].members;
    expect(deep).toHaveLength(1);
    expect(deep[0]).toEqual({ name: 'Odo', role: 'factor' });
  });

  it('projects a member to the SAME key set as the identical record in npcs[] (no-drift pin)', () => {
    // ALDRIC carries every allowlisted field, so both projections must surface
    // exactly NPC_PUBLIC_KEYS — pinning NPC_PUBLIC_KEYS, publicNpc, and the
    // member reduction to one another behaviourally.
    const out = toPublicSafe(SETTLEMENT);
    const memberKeys = Object.keys(out.factions[0].members[0]).sort();
    const npcKeys = Object.keys(out.npcs[0]).filter((k) => out.npcs[0][k] !== undefined).sort();
    expect(memberKeys).toEqual(npcKeys);
    expect(memberKeys).toEqual([...NPC_PUBLIC_KEYS].sort());
  });

  it('no DM-private sentinel appears anywhere in the default projection', () => {
    const json = JSON.stringify(toPublicSafe(SETTLEMENT));
    for (const s of PRIVATE_SENTINELS) {
      expect(json, `"${s}" must appear nowhere in the public projection`).not.toContain(s);
    }
  });

  it('full mode (gallery_share_dm, the owner opt-in) keeps member DM fields', () => {
    // Full mode deep-clones and drops only the named truly-confidential blocks;
    // faction members are the owner's opted-in DM content there, matching the
    // untouched server _gallery_dm_full_json (189 scope note).
    const out = toPublicSafe(SETTLEMENT, { full: true });
    expect(out.factions[0].members[0].goal).toEqual(ALDRIC.goal);
    expect(out.factions[0].members[0].secret).toEqual(ALDRIC.secret);
  });
});

describe.runIf(!!SANITIZER_SQL)('SERVER half — net-current sanitizer strips members identically (pglite)', () => {
  let db;
  let serverOut;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SANITIZER_SQL);
    const row = (await db.query(
      `select public._gallery_sanitize_public_json($1::jsonb) as j`,
      [JSON.stringify(SETTLEMENT)],
    )).rows[0];
    serverOut = row.j;
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('strips goal/secret/plotHooks/relationships/gender/power from factions[].members[]', () => {
    expect(serverOut.factions).toHaveLength(1);
    const members = serverOut.factions[0].members;
    expect(members, 'members must be reduced, never dropped').toHaveLength(2);
    expect(members[0].name).toBe('Aldric');
    expect(members[0].role).toBe('Mayor');
    for (const k of ['goal', 'secret', 'plotHooks', 'relationships', 'gender', 'power']) {
      expect(members[0][k], `member "${k}" must not leak server-side`).toBeUndefined();
    }
    expect(members[1]).toEqual({ name: 'Mara', role: 'clerk' });
  });

  it('covers the deeper roster under a factions ancestor server-side', () => {
    const deep = serverOut.powerStructure.factions[0].members;
    expect(deep).toHaveLength(1);
    expect(deep[0]).toEqual({ name: 'Odo', role: 'factor' });
  });

  it('no DM-private sentinel appears anywhere in the server projection', () => {
    const json = JSON.stringify(serverOut);
    for (const s of PRIVATE_SENTINELS) {
      expect(json, `"${s}" must appear nowhere in the server projection`).not.toContain(s);
    }
  });

  it('matches the client twin toPublicSafe field-for-field', () => {
    // The server and client are twins — same input, same public projection.
    expect(serverOut).toEqual(toPublicSafe(SETTLEMENT));
  });
});
