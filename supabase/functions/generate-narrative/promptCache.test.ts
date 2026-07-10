/**
 * promptCache.test.ts — unit test for the Anthropic prompt-cache body builder.
 *
 * Proves the cache split is API-shaped AND content-preserving: the marker is
 * removed, the leading (stable) block carries cache_control, and the blocks
 * concatenate to exactly the prompt-minus-marker — i.e. the model receives the
 * same text it would without caching. (Whether a cache HIT actually occurs is a
 * provider behavior that requires a live key to observe; this pins correctness of
 * the request we send.)
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { buildAnthropicUserContent, stripCacheBreakpoint, CACHE_BREAKPOINT } = await import('./index.ts');

Deno.test('no breakpoint → bare string, unchanged', () => {
  const p = 'a prompt with no cache marker at all';
  assertEquals(buildAnthropicUserContent(p), p);
});

Deno.test('breakpoint → cached prefix block + plain tail; no content lost', () => {
  const stable = 'STABLE: thesis + settlement summary, identical across a run\'s 14 passes';
  const varying = 'TASK: write the opening for THIS pass\nITEMS: {...}';
  const prompt = stable + CACHE_BREAKPOINT + varying;

  const content = buildAnthropicUserContent(prompt);
  if (typeof content === 'string') throw new Error('expected an array of content blocks');

  assertEquals(content.length, 2);
  assertEquals(content[0].text, stable);
  assertEquals(content[0].cache_control, { type: 'ephemeral' });   // prefix is cached
  assertEquals(content[1].text, varying);
  assertEquals(content[1].cache_control, undefined);               // tail is not
  // CONTENT PRESERVATION: the two blocks concatenate to the prompt minus marker.
  assertEquals(content[0].text + content[1].text, stable + varying);
});

Deno.test('both providers see identical text (Anthropic blocks == OpenAI input)', () => {
  const prompt = 'GROUNDING' + CACHE_BREAKPOINT + 'PASS-SPECIFIC TASK';
  const blocks = buildAnthropicUserContent(prompt) as Array<{ text: string }>;
  const anthropicText = blocks.map((b) => b.text).join('');
  const openaiText = stripCacheBreakpoint(prompt);
  assertEquals(anthropicText, openaiText);
  assertEquals(openaiText, 'GROUNDINGPASS-SPECIFIC TASK');
});

Deno.test('a degenerate empty prefix falls back to a bare string (no invalid block)', () => {
  assertEquals(buildAnthropicUserContent(CACHE_BREAKPOINT + 'tail only'), 'tail only');
});

Deno.test('stripCacheBreakpoint removes every marker occurrence', () => {
  assertEquals(stripCacheBreakpoint('a' + CACHE_BREAKPOINT + 'b' + CACHE_BREAKPOINT + 'c'), 'abc');
});
