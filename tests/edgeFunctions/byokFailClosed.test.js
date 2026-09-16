/**
 * byokFailClosed.test.js — the BYOK FAIL-CLOSED contract (owner ruling, 2026-07-30:
 * "on vault error the request fails with a clear retryable error; the user's chosen key
 * boundary is never silently crossed").
 *
 * Two layers:
 *   1. RUNTIME — resolveProviderKey is driven with fake clients across the whole branch
 *      matrix, because the load-bearing distinction is a pair of facts that look alike
 *      from a distance: "the vault could not be read" and "this user has no key". The
 *      first must refuse; the second must keep the managed house path exactly as it was.
 *   2. CENSUS — every shell that imports the resolver must narrow the outcome BEFORE it
 *      builds its credit flow. Placement is the whole reason no reservation leaks on
 *      this path: there is nothing to release because nothing was reserved yet.
 *
 * The end-to-end shell proof (no provider fetch, no money RPC, typed 503) is the Deno
 * companion supabase/functions/ai-analyst/byokFailClosed.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import {
  resolveProviderKey, isVaultUnavailable, BYOK_VAULT_UNAVAILABLE_MESSAGE,
} from '../../supabase/functions/ai-analyst/byok.ts';

const ROOT = resolve(process.cwd());
const FN_DIR = join(ROOT, 'supabase/functions');
const SERVER_KEY = 'sk-house-key';
const USER_KEY = 'sk-user-own-key';

/** A client whose rpc answers from a table of thunks and records what it was asked. */
function client(answers) {
  const seen = [];
  return {
    seen,
    rpc: (fn, args) => {
      seen.push(fn);
      const a = answers[fn];
      if (typeof a !== 'function') return Promise.resolve({ data: null, error: null });
      const out = a(args);
      return out instanceof Promise ? out : Promise.resolve(out);
    },
  };
}

const vaultErroring = () => client({ surveyor_byok_get: () => ({ data: null, error: { message: 'boom' } }) });
const vaultThrowing = () => client({ surveyor_byok_get: () => { throw new Error('transport'); } });
const witnessWithKey = () => client({ surveyor_byok_status: () => ({ data: [{ provider: 'anthropic', has_key: true }], error: null }) });
const witnessNoKey = () => client({ surveyor_byok_status: () => ({ data: [], error: null }) });
const witnessBroken = () => client({ surveyor_byok_status: () => ({ data: null, error: { message: 'down' } }) });

const resolveWith = (admin, owner) =>
  resolveProviderKey(admin, 'user-1', 'anthropic', SERVER_KEY, undefined, owner);

describe('resolveProviderKey — a vault failure never crosses the key boundary', () => {
  it('vault ERROR + a stored key ⇒ the typed retryable refusal, and no key at all', async () => {
    const out = await resolveWith(vaultErroring(), witnessWithKey());
    expect(isVaultUnavailable(out)).toBe(true);
    expect(out.code).toBe('byok_vault_unavailable');
    expect(out.status).toBe(503);
    expect(out.retryable).toBe(true);
    expect(out.message).toBe(BYOK_VAULT_UNAVAILABLE_MESSAGE);
    // The refusal is a refusal, not a key wearing a flag: there is no `key` to send.
    expect(out.key).toBeUndefined();
    expect(out.byok).toBeUndefined();
  });

  it('vault THROW + a stored key ⇒ the same typed refusal', async () => {
    const out = await resolveWith(vaultThrowing(), witnessWithKey());
    expect(isVaultUnavailable(out)).toBe(true);
    expect(out.code).toBe('byok_vault_unavailable');
  });

  it('vault ERROR + NO stored key ⇒ the managed house path, unchanged', async () => {
    const out = await resolveWith(vaultErroring(), witnessNoKey());
    expect(isVaultUnavailable(out)).toBe(false);
    expect(out.key).toBe(SERVER_KEY);
    expect(out.byok).toBe(false);
  });

  it('vault THROW + NO stored key ⇒ the managed house path, unchanged', async () => {
    const out = await resolveWith(vaultThrowing(), witnessNoKey());
    expect(out.key).toBe(SERVER_KEY);
    expect(out.byok).toBe(false);
  });

  it('the witness itself is unreadable ⇒ cannot determine ⇒ fail closed', async () => {
    const out = await resolveWith(vaultErroring(), witnessBroken());
    expect(isVaultUnavailable(out)).toBe(true);
  });

  it('the witness throws ⇒ cannot determine ⇒ fail closed', async () => {
    const owner = client({ surveyor_byok_status: () => { throw new Error('transport'); } });
    expect(isVaultUnavailable(await resolveWith(vaultErroring(), owner))).toBe(true);
  });

  it('NO witness supplied ⇒ cannot determine ⇒ fail closed', async () => {
    expect(isVaultUnavailable(await resolveWith(vaultErroring(), undefined))).toBe(true);
  });
});

describe('resolveProviderKey — a successful lookup is never mistaken for a failure', () => {
  it('null (139/191: no key on file) ⇒ the house key, and the witness is NOT consulted', async () => {
    const owner = witnessNoKey();
    const out = await resolveWith(client({ surveyor_byok_get: () => ({ data: null, error: null }) }), owner);
    expect(out.key).toBe(SERVER_KEY);
    expect(out.byok).toBe(false);
    expect(owner.seen).toEqual([]); // the happy path costs no extra round-trip
  });

  it('the LEGACY string shape ⇒ the user key, witness untouched', async () => {
    const owner = witnessNoKey();
    const out = await resolveWith(client({ surveyor_byok_get: () => ({ data: USER_KEY, error: null }) }), owner);
    expect(out.key).toBe(USER_KEY);
    expect(out.byok).toBe(true);
    expect(owner.seen).toEqual([]);
  });

  it('the CARRY-ALL shape ⇒ the user key plus the exam receipt', async () => {
    const admin = client({
      surveyor_byok_get: () => ({
        data: {
          key: USER_KEY, probe_tier: 'strong', probe_model: 'claude-opus-4-8',
          probe_version: '1.0.0', probe_profile: { construct: 'pass' },
        },
        error: null,
      }),
    });
    const out = await resolveWith(admin, witnessNoKey());
    expect(out.key).toBe(USER_KEY);
    expect(out.byok).toBe(true);
    expect(out.probeTier).toBe('strong');
    expect(out.probeModel).toBe('claude-opus-4-8');
  });

  it('a BLANK plaintext for an EXISTING row is a broken read, not an absence ⇒ closed', async () => {
    // 139/191 return NULL when there is no row, so a '' or a keyless carry-all object
    // means the row exists and the decrypt failed. Silently serving the house key there
    // is exactly the crossing the ruling forbids.
    expect(isVaultUnavailable(await resolveWith(client({ surveyor_byok_get: () => ({ data: '   ', error: null }) }), witnessNoKey()))).toBe(true);
    expect(isVaultUnavailable(await resolveWith(client({ surveyor_byok_get: () => ({ data: { key: '' }, error: null }) }), witnessNoKey()))).toBe(true);
  });

  it('the keyless error note names the failure and carries no key material', async () => {
    const notes = [];
    await resolveProviderKey(vaultErroring(), 'user-1', 'anthropic', SERVER_KEY, (n) => notes.push(n), witnessNoKey());
    expect(notes.length).toBe(1);
    expect(notes[0]).toMatch(/vault unreadable/); // the liveness anchor for the absence below
    expect(notes[0]).not.toContain(SERVER_KEY); // anchored: the toMatch above proves the note is live prose, so an emptied channel reds first
  });
});

// ── CENSUS: every importing shell narrows BEFORE it can spend ────────────────────────
const SHELLS = readdirSync(FN_DIR)
  .filter((d) => {
    try { return readFileSync(join(FN_DIR, d, 'index.ts'), 'utf8').includes('resolveProviderKey'); }
    catch { return false; }
  })
  .sort();

describe('every resolveProviderKey shell fails closed before it can spend', () => {
  it('the census is the ten AI surfaces (a new importer joins it or this reds)', () => {
    expect(SHELLS).toEqual([
      'ai-analyst', 'construct-realm', 'construct-settlement', 'custom-content',
      'interpret-session', 'interview', 'parley', 'style-overhaul',
      'surveyor-autonomy', 'surveyor-byok',
    ]);
  });

  for (const shell of SHELLS) {
    it(`${shell}: guards the outcome, and does it before any money call`, () => {
      const src = readFileSync(join(FN_DIR, shell, 'index.ts'), 'utf8');
      const guard = src.indexOf('isVaultUnavailable(providerKey)');
      expect(guard).toBeGreaterThan(-1);
      // The guard must sit between the resolve and the first thing that costs anything.
      // CALL-SHAPED anchors, not bare names: the shells discuss `spend_credits` in prose
      // in their headers, and a prose mention is not a spend.
      expect(guard).toBeGreaterThan(src.indexOf('await resolveProviderKey('));
      const spenders = ["rpc('reserve_ai_spend'", "rpc('spend_credits'", 'await runCreditedCall('];
      // surveyor-byok verifies a key and deliberately spends nothing; every other shell
      // must carry all three, so an anchor that stopped matching cannot pass silently.
      const found = spenders.filter((s) => src.includes(s));
      expect(found.length).toBe(shell === 'surveyor-byok' ? 0 : spenders.length);
      for (const spender of found) expect(guard).toBeLessThan(src.indexOf(spender));
      // The typed identity reaches the client: status + machine code + the retry flag.
      expect(src).toContain('providerKey.status');
      expect(src).toContain('code: providerKey.code');
      expect(src).toContain('retryable: providerKey.retryable');
    });
  }
});
