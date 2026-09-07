/**
 * _shared/aiOutputTool.ts - THE CONSTRAINED-OUTPUT SEAM (wave L-WIRE of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md, closing the recorded suboptimality §4c.1).
 *
 * WHAT THIS IS FOR. src/domain/aiOutputSchema.js renders a JSON Schema per compile
 * surface; _shared/aiOutputSchemaBundle.js carries it across the Deno / src barrier. This
 * module is the third piece: it turns a surface key into the exact `tools` entry the
 * Anthropic Messages API takes, and it reads an answer back out of a response whether or
 * not the model used the tool. Six shells share it, so the tool naming law, the frozen
 * schema and the fallback rule are each written once.
 *
 * WHY A FORCED TOOL AT ALL. Until this wave the walls were the only thing standing between
 * a model and an unregistered bucket: the model could emit anything, the validator dropped
 * what it could not accept, and wave L-6 then paid for a repair round to ask again. A tool
 * schema moves that whole class earlier: malformed JSON, an out-of-enum value and an alien
 * key stop being things the model emits and the wall rejects, and become things the model
 * cannot emit. What survives is semantic, which is exactly the residue the repair loop was
 * built to own.
 *
 * THE FALLBACK IS NOT DECORATIVE. `answerTextFromResponse` returns the pre-L-WIRE
 * expression VERBATIM when no tool_use block is present, so a provider, a model or a
 * deployment that does not honour the forced tool degrades to precisely today's behaviour
 * rather than to an empty answer. That path is pinned by an executed test, not asserted.
 *
 * WHERE THIS SITS IN THE CACHE. Anthropic renders a request as tools, then system, then
 * messages, so the tools array is the FIRST thing in the cacheable prefix - ahead of the
 * charter, ahead of the vocabulary, ahead of the marker sealStaticPrefix plants. That is
 * only safe because the schema is byte-stable: it sorts every list, builds every property
 * bag in sorted key order, and reads no clock, rng or ambient state. A tools array that
 * varied per request would invalidate the whole cached prefix on every call while looking
 * like it worked, which is the same silent-money failure mode wave L-4 was built around.
 * A one-time invalidation IS expected at deploy: adding the tools array changes the prefix
 * once, and the next request re-reads it.
 *
 * Pure: no Deno globals, no network, no clock, no rng. Imported by BOTH the edge shells
 * and the pins.
 */

import { buildSurfaceOutputSchema } from './aiOutputSchemaBundle.js';

/** One Anthropic `tools` entry. `input_schema` is the surface's frozen output schema. */
export interface AnthropicToolSpec {
  name: string;
  description: string;
  input_schema: unknown;
}

/** The forced-tool directive that sits beside it. */
export interface AnthropicToolChoice {
  type: 'tool';
  name: string;
}

/**
 * The tool-name law: `submit_<surfaceKey>`, derived rather than typed at six call sites so
 * a surface cannot acquire a name its sibling would not have chosen. Anthropic accepts
 * ^[a-zA-Z0-9_-]{1,64}$ for a tool name; every schema surface key is a bare camelCase
 * identifier, so the composed name is in range by construction and the assertion below is
 * a guard against a future surface key rather than a live risk.
 */
export function outputToolName(surfaceKey: string): string {
  return `submit_${String(surfaceKey ?? '')}`;
}

/** ^[a-zA-Z0-9_-]{1,64}$ - the provider's own tool-name shape. */
const TOOL_NAME_RE = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * Build one surface's tool entry. THROWS on an unknown surface (buildSurfaceOutputSchema's
 * own contract) and on a name the provider would reject, because a tool that silently
 * degraded to no schema would constrain nothing while every caller looked healthy.
 *
 * `description` is ONE bounded sentence: the provider shows it to the model beside the
 * schema, and a paragraph here would duplicate the charter at full price on a surface whose
 * whole design is that the charter is stated once.
 */
export function buildOutputTool(surfaceKey: string, description: string): AnthropicToolSpec {
  const name = outputToolName(surfaceKey);
  if (!TOOL_NAME_RE.test(name)) {
    throw new Error(`buildOutputTool: "${name}" is not a valid provider tool name`);
  }
  return Object.freeze({
    name,
    description: String(description ?? ''),
    input_schema: buildSurfaceOutputSchema(surfaceKey),
  });
}

/** The forced choice for a built tool. Separate from the tool so a caller cannot force a
 *  name it did not send. */
export function forceOutputTool(tool: AnthropicToolSpec): AnthropicToolChoice {
  return { type: 'tool', name: tool.name };
}

/**
 * THE THINKING CLAUSE (wave L-WIRE, INERT AS SHIPPED).
 *
 * Returns a SPREADABLE fragment rather than a value, so a zero budget contributes no key at
 * all and the serialized request body is byte-identical to the pre-L-WIRE one. That is the
 * inertness contract, and it is a property of this function rather than a habit of its six
 * callers: `...thinkingClause(0)` spreads an empty object.
 *
 * ⚠ ACTIVATION BLOCKER, RECORDED HERE RATHER THAN DISCOVERED AT ACTIVATION (see the note
 * on THINKING_BUDGET_BY_TIER in ai-analyst/modelResolver.ts for the full account): the
 * `{type:'enabled', budget_tokens}` shape this emits is NOT accepted by every model this
 * ladder can resolve. It is the correct shape for the Sonnet and Haiku classes, and it is
 * REJECTED with a 400 by the Opus class the 'deep' rung points at, where a fixed thinking
 * budget was replaced by adaptive thinking plus an effort level. Nothing is broken today
 * because every budget is zero and this clause is therefore never emitted. Turning the dial
 * up without first resolving the per-model shape would 400 the top rung, which is the one
 * rung the escalation exists to serve.
 */
export function thinkingClause(budgetTokens: number): Record<string, unknown> {
  const budget = typeof budgetTokens === 'number' && Number.isFinite(budgetTokens)
    ? Math.floor(budgetTokens)
    : 0;
  if (budget <= 0) return {};
  return { thinking: { type: 'enabled', budget_tokens: budget } };
}

/**
 * Read the answer out of an Anthropic response body.
 *
 * TOOL PATH: the FIRST tool_use block's `input` is the answer, serialized back to JSON so
 * every core's existing `parse<Surface>Answer` consumes it unchanged. That is deliberate
 * and is what keeps this wave small: the schema constrains what the model may produce, and
 * nothing downstream of this function learns that anything changed. Scanning for the block
 * rather than reading content[0] is what makes the reader survive a leading thinking block
 * if the thinking dial is ever turned up.
 *
 * FALLBACK PATH: `content[0].text`, which is the pre-L-WIRE expression VERBATIM. A response
 * carrying no tool_use block therefore flows through exactly as it did before this wave.
 * The caller still applies its own `.trim()`, so the composed expression at every shell is
 * byte-for-byte what it always was.
 *
 * Total: never throws, whatever a provider returns.
 */
export function answerTextFromResponse(data: unknown): string {
  const content = (data as { content?: unknown } | null)?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      const block = part as { type?: unknown; input?: unknown } | null;
      if (block && block.type === 'tool_use' && block.input && typeof block.input === 'object') {
        try {
          return JSON.stringify(block.input);
        } catch {
          // A structure JSON.stringify cannot serialize is not an answer; fall through to
          // the text path rather than inventing one.
          break;
        }
      }
    }
  }
  return ((data as { content?: Array<{ text?: string }> } | null)?.content?.[0]?.text || '');
}
