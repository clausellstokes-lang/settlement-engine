/**
 * index.test.ts — regression tests for the ingest-events low findings:
 *
 *   1. Body cap counts BYTES, not UTF-16 code units: a payload whose
 *      `.length` is under 64K but whose UTF-8 encoding exceeds 64KB must be
 *      rejected 413 (the same regression generate-narrative and
 *      generate-chronicle already pin with tests).
 *   2. stripProps drops >64-char prose at ANY depth — the old top-level-only
 *      filter let nested `{ note: { text: '…prose…' } }` land verbatim in
 *      analytics_events.props on this anonymous, no-JWT endpoint.
 *   3. The rate limiter fails CLOSED: an RPC error from `ingest_check_rate`
 *      (data null/undefined + a non-null error) must yield 429 with ZERO
 *      service-role writes, not sail through as "under rate" and upsert.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT
 * vitest). The 413 path returns BEFORE any Supabase client work, so a stub URL
 * + key satisfy the config gate without network. The limiter test injects a
 * recording admin stub via the `__setSupabaseFactory` seam so it never touches
 * the network either.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

// A device token needs a pepper to resolve a device key (and thus a rate key);
// set one so the limiter runs against `d:<hash>` rather than the ip fallback.
Deno.env.set('ANALYTICS_HASH_PEPPER', 'test-pepper');

const { handleIngestEvents, stripProps, __setSupabaseFactory } = await import('./index.ts');

const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36', 'content-type': 'application/json' };

Deno.test('body cap is byte-based: multibyte payload under 64K code units but over 64KB bytes is 413', async () => {
  // '€' is 1 UTF-16 code unit but 3 UTF-8 bytes: 40_000 chars ≈ 120KB bytes.
  const prose = '€'.repeat(40_000);
  const body = JSON.stringify({ events: [], filler: prose });
  assertEquals(body.length < 64 * 1024, true); // the OLD check would have passed it
  const res = await handleIngestEvents(
    new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
  );
  assertEquals(res.status, 413);
  const payload = await res.json();
  assertEquals(payload.error, 'too_large');
});

Deno.test('body cap still admits a normal-sized single-byte payload past the 413 gate', async () => {
  // Same shape, ASCII filler: comfortably under the cap in bytes too. It must
  // NOT be rejected 413 (it then proceeds to real client work against the stub
  // URL, so we only assert the status is not the size rejection).
  const body = JSON.stringify({ events: [], filler: 'x'.repeat(1000) });
  const res = await handleIngestEvents(
    new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
  );
  assertEquals(res.status !== 413, true);
  await res.body?.cancel();
});

Deno.test('stripProps drops long strings at any nesting depth, keeps short/scalar values', () => {
  const prose = 'p'.repeat(200);
  const out = stripProps({
    ok: 'short',
    n: 0,
    b: false,
    z: null,
    top: prose,
    nested: { text: prose, keep: 'fine', deeper: { note: prose, count: 3 } },
    arr: [prose, 'kept', 7, { inner: prose, tag: 'ok' }],
  });
  assertEquals(out, {
    ok: 'short',
    n: 0,
    b: false,
    z: null,
    nested: { keep: 'fine', deeper: { count: 3 } },
    arr: ['kept', 7, { tag: 'ok' }],
  });
});

/**
 * Recording admin stub: device-link reads resolve to an existing actor (so no
 * insert is attempted), `ingest_check_rate` returns whatever the test dictates,
 * and every `.upsert` (the service-role writes) is recorded so the test can
 * assert none happened when the limiter fails closed.
 */
function makeLimiterAdmin(rate: { data?: unknown; error?: { message: string } | null }) {
  const upserts: string[] = [];
  // deno-lint-ignore no-explicit-any
  const table = (name: string): any => ({
    // deno-lint-ignore no-explicit-any
    select: (): any => ({
      // deno-lint-ignore no-explicit-any
      eq: (): any => ({
        maybeSingle: () =>
          Promise.resolve(
            name === 'analytics_device_links'
              ? { data: { actor_id: '11111111-1111-1111-1111-111111111111' }, error: null }
              : { data: null, error: null },
          ),
      }),
    }),
    upsert: () => {
      upserts.push(name);
      return Promise.resolve({ data: null, error: null });
    },
    insert: () => {
      upserts.push(`${name}:insert`);
      return Promise.resolve({ data: null, error: null });
    },
  });
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (name: string) => table(name),
    rpc: (fn: string) =>
      fn === 'ingest_check_rate'
        ? Promise.resolve({ data: rate.data ?? null, error: rate.error ?? null })
        : Promise.resolve({ data: null, error: null }),
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
  };
  return { client, upserts };
}

Deno.test('rate limiter fails CLOSED: an RPC error yields 429 with zero writes', async () => {
  const admin = makeLimiterAdmin({ error: { message: 'ingest_check_rate exploded' } });
  __setSupabaseFactory(() => admin.client);
  try {
    const body = JSON.stringify({
      deviceToken: 'dev-abc',
      events: [{ event: 'homepage_view', seq: 0 }],
    });
    const res = await handleIngestEvents(
      new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
    );
    assertEquals(res.status, 429);
    const payload = await res.json();
    assertEquals(payload.error, 'rate_limited');
    // The whole point: no service-role upsert/insert ran after the limiter error.
    assertEquals(admin.upserts, []);
  } finally {
    __setSupabaseFactory(null);
  }
});

Deno.test('rate limiter fails CLOSED: underRate=false yields 429 with zero writes', async () => {
  const admin = makeLimiterAdmin({ data: false });
  __setSupabaseFactory(() => admin.client);
  try {
    const body = JSON.stringify({
      deviceToken: 'dev-abc',
      events: [{ event: 'homepage_view', seq: 0 }],
    });
    const res = await handleIngestEvents(
      new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
    );
    assertEquals(res.status, 429);
    assertEquals(admin.upserts, []);
  } finally {
    __setSupabaseFactory(null);
  }
});

Deno.test('the IP gate stops device-token rotation: over-IP + under-device is still 429 with zero writes', async () => {
  // The per-device rate key is derived from the (rotatable) deviceToken, so it reads
  // "under rate" for every fresh token — that is the bypass. The ipall: gate is what a
  // rotating host cannot escape: here the ipall key is OVER while the device key is
  // UNDER, and the request must still be rejected before any service-role write.
  const upserts: string[] = [];
  // deno-lint-ignore no-explicit-any
  const table = (name: string): any => ({
    // deno-lint-ignore no-explicit-any
    select: (): any => ({
      // deno-lint-ignore no-explicit-any
      eq: (): any => ({
        maybeSingle: () =>
          Promise.resolve(
            name === 'analytics_device_links'
              ? { data: { actor_id: '11111111-1111-1111-1111-111111111111' }, error: null }
              : { data: null, error: null },
          ),
      }),
    }),
    upsert: () => { upserts.push(name); return Promise.resolve({ data: null, error: null }); },
    insert: () => { upserts.push(`${name}:insert`); return Promise.resolve({ data: null, error: null }); },
  });
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (n: string) => table(n),
    // The ipall: gate reads OVER (false); every other key reads UNDER (true).
    rpc: (fn: string, args: { p_key?: string }) =>
      fn === 'ingest_check_rate'
        ? Promise.resolve({ data: !String(args?.p_key || '').startsWith('ipall:'), error: null })
        : Promise.resolve({ data: null, error: null }),
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
  };
  __setSupabaseFactory(() => client);
  try {
    const body = JSON.stringify({ deviceToken: 'dev-rotating-xyz', events: [{ event: 'homepage_view', seq: 0 }] });
    const res = await handleIngestEvents(
      new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
    );
    assertEquals(res.status, 429);
    assertEquals((await res.json()).error, 'rate_limited');
    assertEquals(upserts, []); // the IP gate ran BEFORE any service-role write
  } finally {
    __setSupabaseFactory(null);
  }
});

Deno.test('rate limiter admits when underRate=true (control): not a 429', async () => {
  const admin = makeLimiterAdmin({ data: true });
  __setSupabaseFactory(() => admin.client);
  try {
    const body = JSON.stringify({
      deviceToken: 'dev-abc',
      events: [{ event: 'homepage_view', seq: 0 }],
    });
    const res = await handleIngestEvents(
      new Request('https://edge/ingest-events', { method: 'POST', headers: UA, body }),
    );
    assertEquals(res.status !== 429, true);
    await res.body?.cancel();
  } finally {
    __setSupabaseFactory(null);
  }
});

Deno.test('stripProps bounds recursion depth and rejects non-object roots', () => {
  // Depth > 4 is dropped outright rather than trusted.
  const deep = { a: { b: { c: { d: { e: 'x'.repeat(200) } } } } };
  const out = stripProps(deep) as Record<string, unknown>;
  assertEquals(JSON.stringify(out).includes('xxxx'), false);
  assertEquals(stripProps('not an object'), {});
  assertEquals(stripProps(['array', 'root']), {});
  assertEquals(stripProps(null), {});
});
