// generate-narrative/promptCache.ts — the prompt cache-breakpoint marker and the
// provider-side helpers that split/strip it (Anthropic cache_control blocks /
// OpenAI prefix strip). Extracted verbatim from index.ts; behaviour-identical.
// A pure leaf shared by prompts.ts (which inserts the marker) and index.ts's
// provider calls (which consume it).

export const CACHE_BREAKPOINT = '<<CACHE>>';

type AnthropicTextBlock = { type: 'text'; text: string; cache_control?: { type: 'ephemeral' } };

/**
 * Build the Anthropic user-message content from a prompt that MAY carry a
 * CACHE_BREAKPOINT. With the marker: two text blocks, the leading (stable) one
 * flagged cache_control. Without it: the bare string. In BOTH cases the text the
 * model sees equals the prompt with the marker stripped (no content is added or
 * dropped). Exported for unit testing.
 */
export function buildAnthropicUserContent(prompt: string): string | AnthropicTextBlock[] {
  const idx = prompt.indexOf(CACHE_BREAKPOINT);
  if (idx === -1) return prompt;
  const prefix = prompt.slice(0, idx);
  const rest = prompt.slice(idx + CACHE_BREAKPOINT.length);
  // A degenerate empty prefix can't cache and isn't a valid block — fall back.
  if (!prefix) return rest;
  return [
    { type: 'text', text: prefix, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: rest },
  ];
}

/** Remove the cache breakpoint for providers that cache prefixes automatically
 *  (OpenAI) or don't support cache_control — yields the original prompt text. */
export function stripCacheBreakpoint(prompt: string): string {
  return prompt.split(CACHE_BREAKPOINT).join('');
}


