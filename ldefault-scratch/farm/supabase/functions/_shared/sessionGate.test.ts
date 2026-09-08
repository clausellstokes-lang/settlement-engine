/**
 * sessionGate.test.ts — EXECUTION test of the single-session request-layer gate
 * (161/§7.2, M-9b). Runs the real decodeSessionId + isSessionSuperseded against a
 * recording admin stub and pins THE ROLLOUT-SAFETY LAW: mismatch → superseded,
 * missing row → allow + adopt, missing claim / read error → allow.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { decodeSessionId, isSessionSuperseded } from './sessionGate.ts';

/** Build a (dummy-signed) JWT carrying the given session_id claim. */
function jwt(sessionId: string | null): string {
  const b64url = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const payload = sessionId === null ? { sub: 'u1' } : { sub: 'u1', session_id: sessionId };
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.sig`;
}

// deno-lint-ignore no-explicit-any
function makeAdmin(opts: { row?: { session_id: string } | null; readError?: { message: string } | null } = {}) {
  const upserts: Array<{ rows: unknown; opts: unknown }> = [];
  const admin = {
    upserts,
    from: (_t: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: opts.row ?? null, error: opts.readError ?? null }) }) }),
      upsert: (rows: unknown, o: unknown) => { upserts.push({ rows, opts: o }); return Promise.resolve({ error: null }); },
    }),
  };
  return admin;
}

Deno.test('decodeSessionId reads the claim, handles Bearer, and rejects odd shapes', () => {
  assertEquals(decodeSessionId(`Bearer ${jwt('sess-1')}`), 'sess-1');
  assertEquals(decodeSessionId(jwt('sess-2')), 'sess-2');
  assertEquals(decodeSessionId(jwt(null)), null);        // no session_id claim
  assertEquals(decodeSessionId('not.a.jwt.at.all'), null);
  assertEquals(decodeSessionId(null), null);
});

Deno.test('a MATCHING session id is not superseded', async () => {
  const admin = makeAdmin({ row: { session_id: 'sess-1' } });
  assertEquals(await isSessionSuperseded(admin, 'u1', jwt('sess-1')), false);
});

Deno.test('a DIFFERENT recorded session id IS superseded (fail closed)', async () => {
  const admin = makeAdmin({ row: { session_id: 'sess-OLD' } });
  assertEquals(await isSessionSuperseded(admin, 'u1', jwt('sess-NEW')), true);
});

Deno.test('a MISSING row ALLOWS and lazily adopts (insert-if-absent, never overwrite)', async () => {
  const admin = makeAdmin({ row: null });
  assertEquals(await isSessionSuperseded(admin, 'u1', jwt('sess-1'), 'Chrome / macOS'), false);
  assertEquals(admin.upserts.length, 1);
  // ignoreDuplicates:true so a concurrent adopt wins and this never overwrites.
  assertEquals((admin.upserts[0].opts as { ignoreDuplicates?: boolean }).ignoreDuplicates, true);
  assertEquals((admin.upserts[0].rows as Array<{ session_id: string; device_label: string }>)[0].session_id, 'sess-1');
  assertEquals((admin.upserts[0].rows as Array<{ device_label: string }>)[0].device_label, 'Chrome / macOS');
});

Deno.test('a token with NO session_id claim ALLOWS (never brick an odd shape) — no read', async () => {
  const admin = makeAdmin({ row: { session_id: 'sess-1' } });
  assertEquals(await isSessionSuperseded(admin, 'u1', jwt(null)), false);
  assertEquals(admin.upserts.length, 0);
});

Deno.test('a gate READ ERROR ALLOWS (availability; the spend_credits belt is the money guard)', async () => {
  const admin = makeAdmin({ readError: { message: 'transient' } });
  assertEquals(await isSessionSuperseded(admin, 'u1', jwt('sess-1')), false);
});
