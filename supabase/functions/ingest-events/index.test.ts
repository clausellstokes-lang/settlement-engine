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
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT
 * vitest). The 413 path returns BEFORE any Supabase client work, so a stub URL
 * + key satisfy the config gate without network.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { handleIngestEvents, stripProps } = await import('./index.ts');

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

Deno.test('stripProps bounds recursion depth and rejects non-object roots', () => {
  // Depth > 4 is dropped outright rather than trusted.
  const deep = { a: { b: { c: { d: { e: 'x'.repeat(200) } } } } };
  const out = stripProps(deep) as Record<string, unknown>;
  assertEquals(JSON.stringify(out).includes('xxxx'), false);
  assertEquals(stripProps('not an object'), {});
  assertEquals(stripProps(['array', 'root']), {});
  assertEquals(stripProps(null), {});
});
