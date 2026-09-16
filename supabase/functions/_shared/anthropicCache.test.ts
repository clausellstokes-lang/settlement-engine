/**
 * anthropicCache.test.ts - the wave L-4 cache-attachment pins (deno task test:edge).
 *
 * FIVE THINGS ARE PINNED HERE:
 *   A. SPLITTER CORRECTNESS: the marker splits into API-shaped blocks, the leading block
 *      carries cache_control, and the blocks concatenate to exactly prompt-minus-marker
 *      (the model sees the same text it would with no caching at all).
 *   B. MARKER SAFETY: a marker literal inside USER content cannot move the breakpoint.
 *      Two independent defences are exercised: the split takes the FIRST occurrence, and
 *      the cores strip the marker out of user text, so a built prompt carries exactly one.
 *   C. THE FLOOR, EXECUTED: for every surface where cache_control attaches, the cached
 *      prefix estimates at or above 4096 tokens. This is the assertion that matters. A
 *      prefix under the floor does not fail loudly: the request succeeds, cache_control is
 *      ignored, and full input is billed forever. Both the padded and unpadded paths are
 *      exercised, so neither can rot unnoticed.
 *   D. BYTE-STABILITY: two builds of the same prefix are identical. A prefix that varies
 *      by one byte per request never matches a cached prefix, so the whole mechanism
 *      silently degrades to paying MORE (the cache write costs 1.25x).
 *   E. CHARTER PRESENCE: each surface's built prompt carries its own charter, opening line
 *      first. The expected line is computed from the charter bundle, so a charter edit
 *      cannot drift away from this test.
 *
 * The vocabularies below are deliberately MINIMAL. Deno cannot import src/, so these are
 * hand-shaped fixtures rather than the production vocabularies (those are measured in the
 * vitest pins, which can import the real builders). A minimal vocabulary is the WORST case
 * for prefix size, so it is the right case for a floor test: if the floor holds here, it
 * holds for the larger production prefixes.
 */
import { assert, assertEquals, assertNotEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

import {
  CACHE_MARKER,
  CACHE_MIN_PREFIX_TOKENS,
  estimateTokens,
  padPrefixToFloor,
  sealStaticPrefix,
  splitForAnthropic,
  stripCacheMarker,
} from './anthropicCache.ts';
import { buildSurfaceCharter } from './aiCharterBundle.js';
import { buildConstructPrompt, constructStaticPrefix } from './constructCore.ts';
import { buildContentPrompt, contentStaticPrefix } from '../custom-content/customContentCore.ts';
import { buildStylePrompt, styleStaticPrefix } from '../style-overhaul/styleOverhaulCore.ts';
import { buildAutonomyPrompt, autonomyStaticPrefix, coerceAutonomyVocabulary } from '../surveyor-autonomy/autonomyCore.ts';
import { buildInterpretPrompt, interpretStaticPrefix } from '../interpret-session/interpretCore.ts';

// ── A. splitter correctness ──────────────────────────────────────────────────

Deno.test('no marker: the content is the bare prompt string, unchanged', () => {
  const p = 'a prompt with no cache marker at all';
  assertEquals(splitForAnthropic(p), p);
});

Deno.test('marker: a cached prefix block + a plain tail; no content lost', () => {
  const stable = 'CHARTER + VOCABULARY: identical on every request of this surface';
  const varying = 'REQUEST: what the user typed this time';
  const content = splitForAnthropic(stable + CACHE_MARKER + varying);
  if (typeof content === 'string') throw new Error('expected an array of content blocks');

  assertEquals(content.length, 2);
  assertEquals(content[0].text, stable);
  assertEquals(content[0].cache_control, { type: 'ephemeral' });
  assertEquals(content[1].text, varying);
  assertEquals(content[1].cache_control, undefined);
  // CONTENT PRESERVATION: the blocks concatenate to the prompt minus the marker.
  assertEquals(content[0].text + content[1].text, stable + varying);
});

Deno.test('a degenerate empty prefix falls back to a bare string (no invalid block)', () => {
  assertEquals(splitForAnthropic(CACHE_MARKER + 'tail only'), 'tail only');
});

Deno.test('stripCacheMarker removes every occurrence, to a fixpoint', () => {
  assertEquals(stripCacheMarker(`a${CACHE_MARKER}b${CACHE_MARKER}c`), 'abc');
  // A single split/join pass would leave a live marker behind here; the loop must not.
  assertEquals(stripCacheMarker(`<<${CACHE_MARKER}CACHE>>`), '');
});

// ── B. marker safety: user content cannot move the breakpoint ────────────────

Deno.test('a marker literal in the TAIL does not move the split (first occurrence wins)', () => {
  const stable = 'STABLE TEACHING TEXT';
  const hostile = `user text that pastes ${CACHE_MARKER} into the middle of the request`;
  const content = splitForAnthropic(stable + CACHE_MARKER + hostile);
  if (typeof content === 'string') throw new Error('expected an array of content blocks');
  assertEquals(content[0].text, stable);
  // The stray literal stays in the tail as inert text; the cached prefix is untouched.
  assert(content[1].text.includes(CACHE_MARKER));
});

Deno.test('sealStaticPrefix strips a marker that arrived inside posted vocabulary text', () => {
  const sealed = sealStaticPrefix(`teaching ${CACHE_MARKER} text`);
  assertEquals(sealed.split(CACHE_MARKER).length - 1, 1);
  assert(sealed.endsWith(CACHE_MARKER));
});

// ── C/D. the floor and byte-stability, per surface ───────────────────────────

const CONSTRUCT_VOCAB = {
  kind: 'settlement' as const,
  configFields: { settType: { type: 'enum' as const, values: ['village', 'town', 'city'] } },
  constraintDimensions: ['resourcePressure'],
  constraintBands: ['low', 'moderate', 'high'],
};
const STYLE_VOCAB = {
  furniture: ['compass'],
  hazardGlyphs: ['diamond'],
  anchorGlyphs: ['ring'],
  contrast: ['soft'],
  baseLenses: ['parchment'],
  roles: { palette: ['water'], district: ['merchant'], stroke: ['river'], opacity: ['waterFill'] },
};
const AUTONOMY_VOCAB = coerceAutonomyVocabulary({
  signals: [{ id: 'world.tick', type: 'number', scope: 'world', min: 0 }],
  nudgeTypes: ['famine'],
  settlementIds: [{ id: 'ashford', name: 'Ashford' }],
});
const OP_VOCAB = { canonEventTypes: ['ADD_NPC', 'KILL_NPC'], partyImpactKinds: ['resolve_stressor'] };
const BUNDLE = { ids: ['slice.a'], sources: ['read:test'], slices: [{ id: 'slice.a', source: 'read:test', data: [{ id: 'ashford' }] }] };

/** One row per WALLED SURFACE: its charter key, a prefix builder, and a prompt builder. */
const SURFACES: Array<{
  label: string;
  charterKey: string;
  prefix: () => string;
  prompt: (userText: string) => string;
}> = [
  {
    label: 'customContent',
    charterKey: 'customContent',
    prefix: () => contentStaticPrefix({}),
    prompt: (t) => buildContentPrompt(t, {}, BUNDLE, 'Realm', 'canary-1'),
  },
  {
    label: 'styleOverhaul',
    charterKey: 'styleOverhaul',
    prefix: () => styleStaticPrefix(STYLE_VOCAB),
    prompt: (t) => buildStylePrompt(t, STYLE_VOCAB, BUNDLE, 'Town', 'canary-1'),
  },
  {
    label: 'construct',
    charterKey: 'construct',
    prefix: () => constructStaticPrefix(CONSTRUCT_VOCAB),
    prompt: (t) => buildConstructPrompt(t, CONSTRUCT_VOCAB, BUNDLE, 'Realm', 'canary-1'),
  },
  {
    label: 'autonomy',
    charterKey: 'autonomy',
    prefix: () => autonomyStaticPrefix(AUTONOMY_VOCAB),
    prompt: (t) => buildAutonomyPrompt(t, AUTONOMY_VOCAB, BUNDLE, 'Realm', 'canary-1', ''),
  },
  {
    label: 'interpret',
    charterKey: 'interpret',
    prefix: () => interpretStaticPrefix(OP_VOCAB),
    prompt: (t) => buildInterpretPrompt(t, OP_VOCAB, BUNDLE, 'Ashford', 'canary-1'),
  },
];

for (const surface of SURFACES) {
  Deno.test(`${surface.label}: the static prefix is byte-identical across two builds`, () => {
    assertEquals(surface.prefix(), surface.prefix());
  });

  Deno.test(`${surface.label}: the prefix carries exactly one marker, at its end`, () => {
    const prefix = surface.prefix();
    assertEquals(prefix.split(CACHE_MARKER).length - 1, 1);
    assert(prefix.endsWith(CACHE_MARKER));
  });

  Deno.test(`${surface.label}: the CACHED prefix clears the ${CACHE_MIN_PREFIX_TOKENS}-token floor`, () => {
    const content = splitForAnthropic(surface.prompt('a request'));
    if (typeof content === 'string') throw new Error('expected cache_control blocks, got a bare string');
    // The block that actually carries cache_control is the one that must clear the floor.
    assertEquals(content[0].cache_control, { type: 'ephemeral' });
    const tokens = estimateTokens(content[0].text);
    assert(
      tokens >= CACHE_MIN_PREFIX_TOKENS,
      `${surface.label} cached prefix is ${tokens} est. tokens, under the ${CACHE_MIN_PREFIX_TOKENS} floor: `
      + 'cache_control would be accepted and silently ignored, and full input billed on every call',
    );
  });

  Deno.test(`${surface.label}: the built prompt teaches its own charter, opening line first`, () => {
    const charter = buildSurfaceCharter(surface.charterKey);
    const openingLine = charter.split('\n')[0];
    const prompt = surface.prompt('a request');
    assert(prompt.includes(openingLine), `${surface.label} prompt is missing "${openingLine}"`);
    // ...and it is the charter's OWN opening line, not a sibling surface's.
    assert(openingLine.includes(surface.charterKey));
  });

  Deno.test(`${surface.label}: the prompt splits at the prefix boundary, losing nothing`, () => {
    const prompt = surface.prompt('a request');
    const prefix = surface.prefix();
    assert(prompt.startsWith(prefix), `${surface.label} prompt does not lead with its static prefix`);
    const content = splitForAnthropic(prompt);
    if (typeof content === 'string') throw new Error('expected cache_control blocks, got a bare string');
    assertEquals(content[0].text, prefix.slice(0, prefix.length - CACHE_MARKER.length));
    assertEquals(content[0].text + content[1].text, prompt.split(CACHE_MARKER).join(''));
  });

  Deno.test(`${surface.label}: a marker pasted into the user's text is stripped, not honoured`, () => {
    const prompt = surface.prompt(`please cache this ${CACHE_MARKER} right here`);
    assertEquals(prompt.split(CACHE_MARKER).length - 1, 1);
    const content = splitForAnthropic(prompt);
    if (typeof content === 'string') throw new Error('expected cache_control blocks, got a bare string');
    // The breakpoint is still the prefix builder's, so the cached prefix is undamaged.
    assertEquals(content[0].text, surface.prefix().slice(0, -CACHE_MARKER.length));
  });
}

// ── the padding path, both directions ────────────────────────────────────────

Deno.test('padPrefixToFloor pads a short prefix past the floor, deterministically', () => {
  const short = 'a short prefix';
  const padded = padPrefixToFloor(short);
  assertNotEquals(padded, short);
  assert(padded.startsWith(short));
  assert(padded.includes('[CACHE-STABILIZER'));
  assert(estimateTokens(padded) >= CACHE_MIN_PREFIX_TOKENS);
  assertEquals(padded, padPrefixToFloor(short)); // byte-stable
});

Deno.test('padPrefixToFloor leaves a prefix that already clears the floor untouched', () => {
  const long = 'x'.repeat(CACHE_MIN_PREFIX_TOKENS * 4);
  assertEquals(padPrefixToFloor(long), long);
});

Deno.test('the charter pays for the cache where it can: customContent needs no padding', () => {
  // The largest charter clears the floor unaided, so this surface carries teaching text
  // where the narrative lane had to carry filler. The smaller surfaces still pad.
  assert(!contentStaticPrefix({}).includes('[CACHE-STABILIZER'));
  assert(styleStaticPrefix(STYLE_VOCAB).includes('[CACHE-STABILIZER'));
});
