/**
 * index.test.ts — execution test for the dynamic OG-card endpoint.
 *
 * Runs the real handler with injected data + rasterize stubs and pins the trust
 * boundary: method gate, slug validation, the fail-safe redirect on every error
 * path, the PNG content-type + cache posture on success, and — most importantly
 * — the SEED-SECRET FIREWALL: a projection that smuggles a seed/secret can never
 * reach the rendered SVG, and buildCardSvg draws ONLY the coarse public fields
 * and XML-escapes them. No live Supabase, no WASM rasterizer.
 */
import { assertEquals, assert, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');

const { handleOgImage, buildCardSvg } = await import('./index.ts');

const FAKE_PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // PNG magic

const sampleProjection = {
  name: 'Ashford-on-Vell',
  tier: 'town',
  terrain: 'river valley',
  population: 2400,
  governmentType: 'merchant council',
  magicLevel: 'ambient',
  stability: 'tense',
};

const get = (slug: string, method = 'GET') =>
  new Request(`https://edge/og-image?slug=${encodeURIComponent(slug)}`, { method });

/** A rasterize spy that captures the SVG it was handed. */
function rasterizeSpy() {
  const seen: string[] = [];
  return {
    seen,
    rasterize: (svg: string) => {
      seen.push(svg);
      return Promise.resolve(FAKE_PNG);
    },
  };
}

Deno.test('OPTIONS preflight returns 204', async () => {
  const res = await handleOgImage(new Request('https://edge/og-image', { method: 'OPTIONS' }));
  assertEquals(res.status, 204);
});

Deno.test('non-GET is rejected 405', async () => {
  const res = await handleOgImage(new Request('https://edge/og-image?slug=abc', { method: 'POST' }));
  assertEquals(res.status, 405);
});

Deno.test('missing slug redirects to the default card (302)', async () => {
  const res = await handleOgImage(new Request('https://edge/og-image', { method: 'GET' }));
  assertEquals(res.status, 302);
  // SB4: the fail-safe must serve the CURRENT house-sealed card (og-craft.png),
  // not the retired pre-seal og-default.png.
  assertStringIncludes(res.headers.get('Location') || '', 'og-craft.png');
});

Deno.test('a garbage/injection slug redirects to default and never fetches', async () => {
  let fetched = 0;
  const res = await handleOgImage(get('../etc/passwd'), {
    fetchProjection: () => { fetched++; return Promise.resolve(sampleProjection); },
    rasterize: rasterizeSpy().rasterize,
  });
  assertEquals(res.status, 302);
  assertEquals(fetched, 0); // rejected before any data fetch
});

Deno.test('an unknown slug (null projection) redirects to default', async () => {
  const res = await handleOgImage(get('missing123'), {
    fetchProjection: () => Promise.resolve(null),
    rasterize: rasterizeSpy().rasterize,
  });
  assertEquals(res.status, 302);
});

Deno.test('a data-fetch throw redirects to default (fail-safe)', async () => {
  const res = await handleOgImage(get('boom'), {
    fetchProjection: () => Promise.reject(new Error('rpc down')),
    rasterize: rasterizeSpy().rasterize,
  });
  assertEquals(res.status, 302);
});

Deno.test('a rasterize throw redirects to default (fail-safe)', async () => {
  const res = await handleOgImage(get('ashford'), {
    fetchProjection: () => Promise.resolve(sampleProjection),
    rasterize: () => Promise.reject(new Error('wasm boom')),
  });
  assertEquals(res.status, 302);
});

Deno.test('a valid slug renders a PNG with image content-type + a ONE-DAY cache', async () => {
  const spy = rasterizeSpy();
  const res = await handleOgImage(get('ashford'), {
    fetchProjection: () => Promise.resolve(sampleProjection),
    rasterize: spy.rasterize,
  });
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('Content-Type'), 'image/png');
  // EXACT, not "contains max-age": the TTL is the whole contract here. An unpublished
  // dossier's card must age out of every shared cache within a day, and the revalidation
  // grace is bounded to the same day so it cannot become a second staleness window.
  assertEquals(
    res.headers.get('Cache-Control'),
    'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
  );
  const body = new Uint8Array(await res.arrayBuffer());
  // PNG magic bytes came straight from the (stub) rasterizer.
  assertEquals(Array.from(body.slice(0, 4)), [0x89, 0x50, 0x4e, 0x47]);
  // The rendered SVG carried the real settlement name + coarse stats.
  assertStringIncludes(spy.seen[0], 'Ashford-on-Vell');
  assertStringIncludes(spy.seen[0], 'Merchant Council');
});

// ── SEED-SECRET FIREWALL ─────────────────────────────────────────────────────
// The single most important guarantee: no seed/secret/private field can ever be
// drawn, even if a drifted or malicious projection carries one.

Deno.test('a smuggled seed/secret is never rendered into the card SVG', async () => {
  const spy = rasterizeSpy();
  const rogue = {
    ...sampleProjection,
    // Fields the card must NEVER render, however they arrive:
    seed: 'DEADBEEF-SEED-9931',
    prngSeed: 'sekret-seed-value',
    data: { seed: 'blob-seed', dmNotes: 'the vault code is 8471' },
    ownerEmail: 'gm@example.com',
    // deno-lint-ignore no-explicit-any
  } as any;
  const res = await handleOgImage(get('ashford'), {
    fetchProjection: () => Promise.resolve(rogue),
    rasterize: spy.rasterize,
  });
  assertEquals(res.status, 200);
  const svg = spy.seen[0];
  assert(!svg.includes('DEADBEEF-SEED-9931'), 'seed value leaked into SVG');
  assert(!svg.includes('sekret-seed-value'), 'prngSeed leaked into SVG');
  assert(!svg.includes('blob-seed'), 'data.seed leaked into SVG');
  assert(!svg.includes('vault code'), 'dmNotes leaked into SVG');
  assert(!svg.includes('gm@example.com'), 'ownerEmail leaked into SVG');
  assert(!/seed/i.test(svg), 'the word "seed" must not appear anywhere in the card');
});

Deno.test('buildCardSvg draws only coarse fields and XML-escapes them', () => {
  const svg = buildCardSvg({
    name: 'A & B <script>',
    tier: 'city',
    terrain: 'coast',
    population: 12000,
    governmentType: 'theocracy',
    magicLevel: 'high',
    stability: 'stable',
  });
  // Escaped, not injected.
  assert(!svg.includes('<script>'), 'raw markup must be escaped');
  assertStringIncludes(svg, '&amp;');
  assertStringIncludes(svg, '&lt;script&gt;');
  // Coarse fields are present.
  assertStringIncludes(svg, 'City');
  assertStringIncludes(svg, '12,000');
  // Fixed 1200×630 card.
  assertStringIncludes(svg, 'width="1200"');
  assertStringIncludes(svg, 'height="630"');
  assertStringIncludes(svg, 'Forged with SettlementForge');
});

Deno.test('buildCardSvg tolerates an empty projection without throwing', () => {
  const svg = buildCardSvg({
    name: '', tier: '', terrain: '', population: null,
    governmentType: '', magicLevel: '', stability: '',
  });
  assertStringIncludes(svg, 'A Settlement');       // name fallback
  assertStringIncludes(svg, 'Living settlement');  // subtitle fallback
});
