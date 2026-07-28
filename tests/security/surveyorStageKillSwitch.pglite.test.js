/**
 * surveyorStageKillSwitch.pglite.test.js — runs the REAL PL/pgSQL from migration 146
 * (the per-stage kill-switch, §2b) against in-process Postgres (pglite).
 *
 * What it proves (the FAIL-CLOSED contract, at the SQL layer):
 *   - the seed enables every current stage (launch-whole default-on);
 *   - surveyor_stage_enabled(stage) returns the stored boolean;
 *   - an ABSENT stage key ⇒ true (a newly added stage ships enabled);
 *   - an explicit false ⇒ false (the operator paused it — the switch honours OFF);
 *   - an empty/null stage name ⇒ false (nothing to enable);
 *   - a non-boolean value ⇒ false (fail-closed on a malformed config);
 *   - a MISSING config row ⇒ true (an unconfigured switch does not itself pause).
 *   - SENTINEL: a paused stage really flips to false (no vacuous pass).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIG_150 = resolve(process.cwd(), 'supabase', 'migrations', '150_surveyor_stage_kill_switch.sql');
const haveMigration = existsSync(MIG_150);

let db;
const enabled = async (stage) => (await db.query('select public.surveyor_stage_enabled($1) as r', [stage])).rows[0].r;

it('targeted migration present (suite not vacuous)', () => {
  expect(haveMigration).toBe(true);
});

describe.runIf(haveMigration)('surveyor stage kill-switch — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    await db.exec(`
      do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
      do $$ begin create role service_role; exception when duplicate_object then null; end $$;
      create table public.system_config (key text primary key, value jsonb not null);
    `);
    await db.exec(readFileSync(MIG_150, 'utf-8'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the seed enables every current stage (launch-whole default-on)', async () => {
    for (const s of ['analysis', 'brief', 'interpret', 'parley']) {
      expect(await enabled(s), `${s} should ship enabled`).toBe(true);
    }
  });

  it('an ABSENT stage key ⇒ enabled (a newly added stage ships on)', async () => {
    expect(await enabled('some_future_stage')).toBe(true);
  });

  it('an empty / null stage name ⇒ NOT enabled (nothing to enable)', async () => {
    expect(await enabled('')).toBe(false);
    expect(await enabled(null)).toBe(false);
  });

  it('an operator OFF flag ⇒ NOT enabled (the switch honours a pause) — the sentinel', async () => {
    // sentinel: interpret starts ON …
    expect(await enabled('interpret')).toBe(true);
    // … the operator pauses it …
    await db.query(`update public.system_config
      set value = jsonb_set(value, '{interpret}', 'false'::jsonb)
      where key = 'surveyor_stage_switches'`);
    // … and the switch now refuses it (fail-closed on OFF).
    expect(await enabled('interpret')).toBe(false);
    // a sibling stage is unaffected (per-stage granularity)
    expect(await enabled('parley')).toBe(true);
  });

  it('a non-boolean flag ⇒ NOT enabled (fail-closed on a malformed config)', async () => {
    await db.query(`update public.system_config
      set value = jsonb_set(value, '{brief}', '"yes"'::jsonb)
      where key = 'surveyor_stage_switches'`);
    expect(await enabled('brief')).toBe(false);
  });

  it('a MISSING config row ⇒ enabled (an unconfigured switch does not itself pause)', async () => {
    await db.query(`delete from public.system_config where key = 'surveyor_stage_switches'`);
    expect(await enabled('interpret')).toBe(true);
  });
});
