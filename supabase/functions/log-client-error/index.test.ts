/**
 * index.test.ts — execution test for the anonymous client-error sink.
 *
 * Runs the real handler with an injected admin stub and pins the trust boundary:
 * method gate, bot rejection, payload length-bounding, IP hashing (no raw IP),
 * per-IP rate limit, and insert shape. No live Supabase.
 */
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('ANALYTICS_HASH_PEPPER', 'test_pepper');

const { handleLogClientError } = await import('./index.ts');

/** Admin stub: select(...).eq(...).gte(...) resolves the rate-limit count;
 *  insert(row) records the row. */
function makeAdmin(countVal: number | null = 0) {
  const inserts: Array<Record<string, unknown>> = [];
  const client = {
    from() {
      return {
        select() { return this; },
        eq() { return this; },
        gte() { return Promise.resolve({ count: countVal, error: null }); },
        insert(row: Record<string, unknown>) { inserts.push(row); return Promise.resolve({ error: null }); },
      };
    },
    // deno-lint-ignore no-explicit-any
  } as any;
  return { inserts, adminClient: () => client };
}

const post = (body: unknown, ua = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120') =>
  new Request('https://edge/log-client-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-agent': ua },
    body: JSON.stringify(body),
  });

Deno.test('OPTIONS preflight returns 200 with no body', async () => {
  const res = await handleLogClientError(
    new Request('https://edge/log-client-error', { method: 'OPTIONS' }),
    { adminClient: makeAdmin().adminClient },
  );
  assertEquals(res.status, 200);
});

Deno.test('non-POST is rejected 405', async () => {
  const res = await handleLogClientError(
    new Request('https://edge/log-client-error', { method: 'GET' }),
    { adminClient: makeAdmin().adminClient },
  );
  assertEquals(res.status, 405);
});

Deno.test('an obvious bot UA is rejected 403 and never inserts', async () => {
  const admin = makeAdmin();
  const res = await handleLogClientError(
    post({ message: 'x' }, 'curl/8.0'),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(admin.inserts.length, 0);
});

Deno.test('a valid report is bounded, IP-hashed, and inserted', async () => {
  const admin = makeAdmin(0);
  const res = await handleLogClientError(
    post({
      kind: 'window.error',
      message: 'M'.repeat(5000),         // over the 1000 cap
      stack: 'S'.repeat(9000),           // over the 4000 cap
      url: 'https://app/x',
      release: 'v1.2.3',
    }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(admin.inserts.length, 1);
  const row = admin.inserts[0];
  assertEquals((row.message as string).length, 1000);   // bounded
  assertEquals((row.stack as string).length, 4000);     // bounded
  assertEquals(row.kind, 'window.error');
  assertEquals(row.release, 'v1.2.3');
  // IP is hashed, never raw, and never echoes the pepper.
  assertEquals(typeof row.ip_hash, 'string');
  assertEquals((row.ip_hash as string).length, 64);     // sha256 hex
});

Deno.test('over the per-IP rate limit returns 202 and does NOT insert', async () => {
  const admin = makeAdmin(60);   // already at the limit this minute
  const res = await handleLogClientError(post({ message: 'flood' }), { adminClient: admin.adminClient });
  assertEquals(res.status, 202);
  assertEquals(admin.inserts.length, 0);
  assertStringIncludes(await res.text(), 'throttled');
});

Deno.test('malformed JSON is rejected 400', async () => {
  const res = await handleLogClientError(
    new Request('https://edge/log-client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'user-agent': 'Mozilla/5.0 Chrome/120' },
      body: '{not json',
    }),
    { adminClient: makeAdmin().adminClient },
  );
  assertEquals(res.status, 400);
});
