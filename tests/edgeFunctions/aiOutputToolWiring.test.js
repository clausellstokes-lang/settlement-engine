/**
 * tests/edgeFunctions/aiOutputToolWiring.test.js — THE L-WIRE CONTRACT (wave L-WIRE of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md §4c).
 *
 * L-WIRE changed the provider-call shape on every compile surface at once, and three of its
 * four halves are the kind of change that fails SILENTLY:
 *
 *   1. THE FORCED TOOL is a live behaviour change. It has to be present, byte-stable, and
 *      the same schema the surface's own wall validates against, or the model is being
 *      constrained by something other than the rules it will be judged by.
 *   2. THE FALLBACK is what stops that from being a one-way door. A response with no
 *      tool_use block must flow through EXACTLY the pre-L-WIRE expression, or a model or
 *      provider without tool support silently returns an empty answer that looks like a
 *      refusal.
 *   3. THE THINKING DIAL ships inert. "Inert" means the serialized request body is
 *      byte-identical to the pre-L-WIRE one, which is a claim about bytes and is therefore
 *      measured here rather than asserted.
 *   4. THE COACHING BLOCK rides the cached prefix, so the QUANTIZATION LAW (§4c.3) has to
 *      hold: the same profile must render the same bytes, or per-model cache churn is
 *      unbounded and the token thesis leaks.
 *
 * Every case below EXECUTES the real edge modules (vitest can import these .ts files
 * directly; the shells cannot be imported wholesale, so shell-level claims are source
 * contracts in the contracts.test.js style).
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  answerTextFromResponse, buildOutputTool, forceOutputTool, outputToolName, thinkingClause,
} from '../../supabase/functions/_shared/aiOutputTool.ts';
import {
  TIER_BY_CLASS, THINKING_BUDGET_BY_TIER, thinkingBudgetForTierClass,
} from '../../supabase/functions/ai-analyst/modelResolver.ts';
import { renderCoachingBlock, renderCoachingFor, COACHING_TASK_SURFACE } from '../../supabase/functions/_shared/modelCoaching.ts';
import { buildSurfaceOutputSchema, SCHEMA_SURFACES } from '../../supabase/functions/_shared/aiOutputSchemaBundle.js';
import { buildIntentAtlasSection } from '../../supabase/functions/_shared/intentAtlasBundle.js';
import { CACHE_MARKER, CACHE_MIN_PREFIX_TOKENS, estimateTokens } from '../../supabase/functions/_shared/anthropicCache.ts';

import { contentStaticPrefix } from '../../supabase/functions/custom-content/customContentCore.ts';
import { constructStaticPrefix } from '../../supabase/functions/_shared/constructCore.ts';
import { interpretStaticPrefix } from '../../supabase/functions/interpret-session/interpretCore.ts';
import { autonomyStaticPrefix } from '../../supabase/functions/surveyor-autonomy/autonomyCore.ts';
import { styleStaticPrefix } from '../../supabase/functions/style-overhaul/styleOverhaulCore.ts';
import { buildStyleVocabulary } from '../../src/design/townMapStyleWall.js';
import { buildConstructVocabulary } from '../../src/domain/construct/configVocabulary.js';
import { buildOpVocabulary } from '../../src/domain/intent/opVocabulary.js';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');
const shellSrc = (name) => readFileSync(join(FN_DIR, name, 'index.ts'), 'utf8');

/** The six compile shells and the schema surface each one forces. */
const SHELLS = Object.freeze({
  'custom-content': 'customContent',
  'style-overhaul': 'styleOverhaul',
  'construct-settlement': 'construct',
  'construct-realm': 'construct',
  'surveyor-autonomy': 'autonomy',
  'interpret-session': 'interpret',
});

// ── 1. the forced tool ───────────────────────────────────────────────────────

describe('the forced output tool (wave L-WIRE)', () => {
  it('names itself submit_<surfaceKey>, for every schema surface', () => {
    for (const surface of SCHEMA_SURFACES) {
      expect(outputToolName(surface)).toBe(`submit_${surface}`);
      // and the composed name is one the provider will accept
      expect(outputToolName(surface)).toMatch(/^[a-zA-Z0-9_-]{1,64}$/);
    }
  });

  it('carries the surface\'s own schema, not a copy of it', () => {
    for (const surface of SCHEMA_SURFACES) {
      const tool = buildOutputTool(surface, 'a bounded sentence');
      expect(JSON.stringify(tool.input_schema)).toBe(JSON.stringify(buildSurfaceOutputSchema(surface)));
    }
  });

  it('is BYTE-STABLE across calls (the tools array leads the cached prefix)', () => {
    // Anthropic renders tools, then system, then messages, so an unstable tools array
    // invalidates the WHOLE cached prefix on every request while the answer looks fine.
    // That is the same silent-money failure wave L-4 was built around.
    for (const surface of SCHEMA_SURFACES) {
      const a = buildOutputTool(surface, 'a bounded sentence');
      const b = buildOutputTool(surface, 'a bounded sentence');
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });

  it('forces itself by name, and cannot force a name it did not send', () => {
    const tool = buildOutputTool('interpret', 'x');
    expect(forceOutputTool(tool)).toEqual({ type: 'tool', name: 'submit_interpret' });
  });

  it('throws on an unknown surface rather than degrading to no schema', () => {
    // A tool with no constraint would look healthy at every call site while constraining
    // nothing, which is the exact failure the schema module exists to prevent.
    expect(() => buildOutputTool('not-a-surface', 'x')).toThrow(/unknown schema surface/);
  });

  it.each(Object.entries(SHELLS))('%s sends the tool AND forces it', (shell, surface) => {
    const src = shellSrc(shell);
    expect(src, `${shell} must build its tool from the bundle`).toContain("from '../_shared/aiOutputTool.ts'");
    expect(src).toMatch(new RegExp(`buildOutputTool\\(\\s*'${surface}'`));
    expect(src, `${shell} must SEND the tool`).toMatch(/tools: \[\w+_TOOL\]/);
    expect(src, `${shell} must FORCE the tool`).toMatch(/tool_choice: \w+_TOOL_CHOICE/);
    // built once, at module scope: a per-request rebuild is a cache miss per request
    expect(src).toMatch(/^const \w+_TOOL = buildOutputTool\($/m);
  });

  it('the shell detector would catch a surface that dropped the tool (self-check)', () => {
    expect(/tools: \[\w+_TOOL\]/.test('body: JSON.stringify({ model, max_tokens: N, messages })')).toBe(false);
    expect(/tools: \[\w+_TOOL\]/.test('tools: [STYLE_TOOL], tool_choice: STYLE_TOOL_CHOICE')).toBe(true);
  });
});

// ── 2. the fallback ──────────────────────────────────────────────────────────

describe('the free-text fallback survives (a model without tool support degrades as before)', () => {
  /** The pre-L-WIRE expression, verbatim, as the six shells spelled it. */
  const preLWire = (data) => (data?.content?.[0]?.text || '').trim();

  const NO_TOOL_CASES = [
    ['a plain text answer', { content: [{ type: 'text', text: '  {"ops":[]}  ' }] }],
    ['an empty content array', { content: [] }],
    ['a missing content key', {}],
    ['a null body', null],
    ['a text block with no text', { content: [{ type: 'text' }] }],
    ['content that is not an array', { content: 'nope' }],
  ];

  it.each(NO_TOOL_CASES)('%s reads byte-identically to the pre-L-WIRE expression', (_label, data) => {
    expect(answerTextFromResponse(data).trim()).toBe(preLWire(data));
  });

  it('a tool_use block IS read, and its input becomes the answer text', () => {
    const data = { content: [{ type: 'tool_use', name: 'submit_interpret', input: { ops: [], musings: [] } }] };
    expect(answerTextFromResponse(data)).toBe(JSON.stringify({ ops: [], musings: [] }));
    // NEGATIVE CONTROL: the pre-L-WIRE expression cannot read it, which is why the change
    // was needed at all. A shell that kept the old expression would answer empty.
    expect(preLWire(data)).toBe('');
  });

  it('a LEADING non-tool block does not hide the tool_use (thinking-block safe)', () => {
    // content[0] is not the tool block here. Scanning rather than indexing is what makes
    // the reader survive the thinking dial ever being turned up.
    const data = {
      content: [
        { type: 'thinking', thinking: '' },
        { type: 'tool_use', name: 'submit_construct', input: { config: {} } },
      ],
    };
    expect(answerTextFromResponse(data)).toBe(JSON.stringify({ config: {} }));
  });

  it('a malformed tool_use falls through to the text path rather than inventing an answer', () => {
    expect(answerTextFromResponse({ content: [{ type: 'tool_use', input: null }, { type: 'text', text: 'hi' }] }))
      .toBe('');   // content[0].text is undefined -> '' , exactly as before
    expect(answerTextFromResponse({ content: [{ type: 'text', text: 'hi' }, { type: 'tool_use', input: 'str' }] }))
      .toBe('hi');
  });

  it('never throws, whatever a provider returns', () => {
    for (const hostile of [undefined, 0, '', [], { content: [null, undefined] }, { content: [{ type: 'tool_use' }] }]) {
      expect(() => answerTextFromResponse(hostile)).not.toThrow();
    }
  });

  it.each(Object.keys(SHELLS))('%s reads its answer through the shared reader', (shell) => {
    const src = shellSrc(shell);
    expect(src).toMatch(/answerTextFromResponse\(data\)\.trim\(\)/);
    // the bare pre-L-WIRE expression must not linger beside it (two readers, one used)
    expect(src).not.toMatch(/answerText: \(data\?\.content\?\.\[0\]\?\.text \|\| ''\)\.trim\(\)/);
  });
});

// ── 3. the thinking dial, INERT ──────────────────────────────────────────────

describe('the thinking dial ships INERT (measured, not asserted)', () => {
  it('every rung is zero in source (activation is an owner switch, not a merge)', () => {
    expect(THINKING_BUDGET_BY_TIER).toEqual({ scout: 0, journeyman: 0, master: 0 });
    expect(Object.isFrozen(THINKING_BUDGET_BY_TIER)).toBe(true);
  });

  it('every resolvable tier class therefore gets a zero budget', () => {
    for (const cls of Object.keys(TIER_BY_CLASS)) expect(thinkingBudgetForTierClass(cls)).toBe(0);
    // an unclassified model has not earned a ceiling
    expect(thinkingBudgetForTierClass(null)).toBe(0);
    expect(thinkingBudgetForTierClass(undefined)).toBe(0);
    expect(thinkingBudgetForTierClass('not-a-class')).toBe(0);
  });

  it('THE INERTNESS PROOF: at budget 0 the serialized request body is byte-identical', () => {
    // The real body expression from the six shells, reproduced here over the SAME helper
    // they call, so the comparison is over bytes rather than over an argument about them.
    const tool = buildOutputTool('interpret', 'a bounded sentence');
    const bodyWith = (budget) => JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 3000,
      tools: [tool],
      tool_choice: forceOutputTool(tool),
      ...thinkingClause(budget),
      messages: [{ role: 'user', content: 'x' }],
    });
    const bodyWithout = JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 3000,
      tools: [tool],
      tool_choice: forceOutputTool(tool),
      messages: [{ role: 'user', content: 'x' }],
    });
    expect(bodyWith(0)).toBe(bodyWithout);
    // and every shape that is not a positive budget behaves the same way
    for (const b of [0, -1, NaN, Infinity, null, undefined, 'big']) {
      expect(thinkingClause(b), `budget ${String(b)} must contribute no key`).toEqual({});
    }
    // NEGATIVE CONTROL: a positive budget really does change the body, so the equality
    // above is a property of the zero rather than of a broken helper.
    expect(bodyWith(4000)).not.toBe(bodyWithout);
    expect(JSON.parse(bodyWith(4000)).thinking).toEqual({ type: 'enabled', budget_tokens: 4000 });
  });

  it.each(Object.keys(SHELLS))('%s spreads the clause rather than sending a key', (shell) => {
    const src = shellSrc(shell);
    expect(src).toMatch(/\.\.\.thinkingClause\(thinkingBudget\)/);
    expect(src).toMatch(/const thinkingBudget = thinkingBudgetForTierClass\(resolvedModel\.tierClass\)/);
    // never a per-surface literal: one dial, owner-switched, for the whole ladder
    expect(src).not.toMatch(/budget_tokens:\s*[1-9]/);
  });
});

// ── 4. the coaching block and the quantization law ───────────────────────────

describe('the coaching block obeys the quantization law (§4c.3)', () => {
  const PROFILE = {
    tasks: [
      { key: 'construct', passed: false, reasonClass: 'unsupported_emitted' },
      { key: 'interpret', passed: true, reasonClass: null },
    ],
    passes: 1,
    tasksRun: 2,
  };

  it('two renders of the SAME profile are byte-identical', () => {
    // The law's whole content: a block that re-rendered differently for an unchanged
    // profile would churn that model's cached prefix on every request.
    expect(renderCoachingBlock(PROFILE, 'construct')).toBe(renderCoachingBlock(PROFILE, 'construct'));
    expect(renderCoachingBlock(structuredClone(PROFILE), 'construct')).toBe(renderCoachingBlock(PROFILE, 'construct'));
    expect(renderCoachingBlock(PROFILE, 'construct').length).toBeGreaterThan(0);
  });

  it('task ORDER in the stored profile does not move the bytes', () => {
    // Sentence order comes from the module's frozen table, not from the array, so two
    // probe runs that found the same faults cannot produce two different prefixes.
    const reordered = { ...PROFILE, tasks: [...PROFILE.tasks].reverse() };
    expect(renderCoachingBlock(reordered, 'construct')).toBe(renderCoachingBlock(PROFILE, 'construct'));
  });

  it('an ABSENT, clean or malformed profile renders nothing (inert by absence)', () => {
    expect(renderCoachingBlock(null, 'construct')).toBe('');
    expect(renderCoachingBlock(undefined, 'construct')).toBe('');
    expect(renderCoachingBlock({ tasks: [{ key: 'construct', passed: true, reasonClass: null }], passes: 1, tasksRun: 1 }, 'construct')).toBe('');
    expect(renderCoachingBlock({ tasks: 'nope' }, 'construct')).toBe('');
    expect(renderCoachingBlock({ tasks: [{ key: 'construct', passed: false, reasonClass: 'invented_class' }] }, 'construct')).toBe('');
  });

  it('a prefix with NO coaching is byte-identical to the pre-L-WIRE prefix shape', () => {
    // The managed-key path renders '' by construction (no BYOK row, no profile), so this
    // is the prefix every server-key user shares.
    const vocab = buildConstructVocabulary();
    const cv = { kind: 'settlement', configFields: vocab.settlementFields, constraintDimensions: vocab.constraintDimensions, constraintBands: vocab.constraintBands };
    expect(constructStaticPrefix(cv, '')).toBe(constructStaticPrefix(cv));
    expect(constructStaticPrefix(cv, renderCoachingBlock(null, 'construct'))).toBe(constructStaticPrefix(cv));
  });

  it('a prefix WITH coaching carries it, at the END, before the marker', () => {
    const vocab = buildConstructVocabulary();
    const cv = { kind: 'settlement', configFields: vocab.settlementFields, constraintDimensions: vocab.constraintDimensions, constraintBands: vocab.constraintBands };
    const block = renderCoachingBlock(PROFILE, 'construct');
    const withCoaching = constructStaticPrefix(cv, block);
    expect(withCoaching).toContain(block);
    // the marker is still the LAST thing, and there is still exactly one
    expect(withCoaching.endsWith(CACHE_MARKER)).toBe(true);
    expect(withCoaching.split(CACHE_MARKER).length - 1).toBe(1);
    // the coaching sits after the output contract, i.e. at the tail of the static text
    expect(withCoaching.indexOf(block)).toBeGreaterThan(withCoaching.indexOf('OUTPUT CONTRACT'));
  });

  /**
   * The slack the LAST assertion below allows between the end of the coaching block and the
   * cache marker. Deliberately tiny: the seal appends the tail and the marker with nothing
   * between them, so the true distance is 0 and this only leaves room for a future trailing
   * newline. It is NOT a tolerance to be widened — widening it is how the bug it was written
   * for came back.
   */
  const COACHING_TO_MARKER_SLACK = 16;

  it('coaching is the LAST thing before the marker on every surface, not merely after the contract', () => {
    // WHY THIS PIN IS SHAPED THIS WAY. Its predecessor asserted only
    // `indexOf(block) > indexOf('OUTPUT CONTRACT')`, which is satisfied by a block sitting
    // seven THOUSAND characters before the marker: on the four padded surfaces
    // sealStaticPrefix used to pad AFTER the coaching, so the [CACHE-STABILIZER] filler
    // landed between the coaching and the marker and buried it in furniture. Ordering
    // against a landmark near the START of the text cannot see that. Distance to the marker
    // can, so distance is what is measured.
    const cVocab = buildConstructVocabulary();
    const block = renderCoachingBlock(PROFILE, 'construct');
    expect(block.length, 'the fixture profile must actually render coaching').toBeGreaterThan(0);

    const surfaces = {
      construct: constructStaticPrefix({
        kind: 'settlement', configFields: cVocab.settlementFields,
        constraintDimensions: cVocab.constraintDimensions, constraintBands: cVocab.constraintBands,
      }, block),
      constructRealm: constructStaticPrefix({
        kind: 'realm', configFields: cVocab.realmFields,
        constraintDimensions: cVocab.constraintDimensions, constraintBands: cVocab.constraintBands,
      }, block),
      customContent: contentStaticPrefix({}, block),
      interpret: interpretStaticPrefix(buildOpVocabulary(), block),
      styleOverhaul: styleStaticPrefix(buildStyleVocabulary(), block),
      autonomy: autonomyStaticPrefix({}, block),
    };

    // Collected rather than asserted surface by surface, so ONE run names every surface that
    // buried its coaching instead of stopping at the first.
    const buried = [];
    for (const [name, prefix] of Object.entries(surfaces)) {
      const at = prefix.indexOf(block);
      expect(at, `${name} dropped the coaching block entirely`).toBeGreaterThanOrEqual(0);
      const distance = prefix.indexOf(CACHE_MARKER) - (at + block.length);
      if (distance > COACHING_TO_MARKER_SLACK) buried.push(`${name}: ${distance} chars`);
      // and the seal's other two contracts survive the tail
      expect(prefix.endsWith(CACHE_MARKER), `${name} must end with the marker`).toBe(true);
      expect(prefix.split(CACHE_MARKER).length - 1, `${name} must carry exactly one marker`).toBe(1);
      expect(
        estimateTokens(prefix.slice(0, -CACHE_MARKER.length)),
        `${name} coached prefix fell under the cache floor`,
      ).toBeGreaterThanOrEqual(CACHE_MIN_PREFIX_TOKENS);
    }
    expect(buried, `filler sits between the coaching and the marker on: ${buried.join(' | ')}`).toEqual([]);
  });

  it('a styleOverhaul prefix carries NO construct coaching (the surface binding, end to end)', () => {
    // THE CLAIM BEING PROTECTED is the block's own header: "verdicts from the same
    // validators that will grade this answer". PROFILE records a CONFIG-vocabulary failure.
    // Nothing in a style compile is graded by the config wall, so a style prompt asserting
    // that sentence over that finding was telling the model something untrue.
    const styleVocab = buildStyleVocabulary();
    const forStyle = renderCoachingBlock(PROFILE, 'styleOverhaul');
    expect(forStyle, 'styleOverhaul has no exam task, so it has nothing to say').toBe('');
    expect(styleStaticPrefix(styleVocab, forStyle)).toBe(styleStaticPrefix(styleVocab));

    // NEGATIVE CONTROL, executed rather than described: the pre-fix signature had no surface
    // to filter by, so what a style prompt received was exactly the construct block. Build
    // that prefix here and show it really does carry the foreign sentence - otherwise the
    // assertion above would be passing because the fixture renders nothing anywhere.
    const constructBlock = renderCoachingBlock(PROFILE, 'construct');
    expect(constructBlock.length, 'guard the guard: the fixture must coach SOMEWHERE').toBeGreaterThan(0);
    const asItUsedToBe = styleStaticPrefix(styleVocab, constructBlock);
    expect(asItUsedToBe).toContain(constructBlock);
    expect(asItUsedToBe).not.toBe(styleStaticPrefix(styleVocab));
  });

  it('every surface receives ONLY its own exam task, and the two uncovered ones receive nothing', () => {
    const cVocab = buildConstructVocabulary();
    const everySurface = {
      construct: (c) => constructStaticPrefix({
        kind: 'settlement', configFields: cVocab.settlementFields,
        constraintDimensions: cVocab.constraintDimensions, constraintBands: cVocab.constraintBands,
      }, c),
      customContent: (c) => contentStaticPrefix({}, c),
      interpret: (c) => interpretStaticPrefix(buildOpVocabulary(), c),
      styleOverhaul: (c) => styleStaticPrefix(buildStyleVocabulary(), c),
      autonomy: (c) => autonomyStaticPrefix({}, c),
    };
    // A profile that failed ALL THREE exam tasks: the strongest fixture, because every
    // surface now has a foreign sentence available to leak.
    const allFailed = {
      tasks: [
        { key: 'construct', passed: false, reasonClass: 'unsupported_emitted' },
        { key: 'customContent', passed: false, reasonClass: 'dropped_at_wall' },
        { key: 'interpret', passed: false, reasonClass: 'no_output' },
      ],
      passes: 0,
      tasksRun: 3,
    };
    const ownSentence = {
      construct: COACHING_TASK_SURFACE.construct,
      customContent: COACHING_TASK_SURFACE.customContent,
      interpret: COACHING_TASK_SURFACE.interpret,
    };
    expect(Object.keys(ownSentence).sort()).toEqual(['construct', 'customContent', 'interpret']);

    for (const [surface, build] of Object.entries(everySurface)) {
      const block = renderCoachingBlock(allFailed, surface);
      const prefix = build(block);
      if (surface === 'styleOverhaul' || surface === 'autonomy') {
        expect(block, `${surface} has no exam task`).toBe('');
        expect(prefix, `${surface} must be byte-identical to its uncoached prefix`).toBe(build(''));
        continue;
      }
      expect(block.split('\n'), `${surface} must render exactly one finding`).toHaveLength(2);
      expect(prefix).toContain(block);
      // and it carries neither of the other two surfaces' sentences
      for (const other of Object.keys(ownSentence)) {
        if (other === surface) continue;
        const foreign = renderCoachingBlock(allFailed, other).split('\n')[1];
        expect(prefix, `${surface} leaked ${other}'s verdict`).not.toContain(foreign);
      }
    }
  });

  it('coaching is bound to the MODEL that earned it, not merely to the key', () => {
    // A user can probe on one model and then change their stored model preference. The
    // profile still sits on the key row, so without this gate the new model would be shown
    // the old model's failures as if they were measurements of itself.
    const vocab = buildConstructVocabulary();
    const cv = { kind: 'settlement', configFields: vocab.settlementFields, constraintDimensions: vocab.constraintDimensions, constraintBands: vocab.constraintBands };
    const matched = renderCoachingFor({
      profile: PROFILE, probeModel: 'claude-probe-a', capturedModel: 'claude-probe-a', surface: 'construct',
    });
    const mismatched = renderCoachingFor({
      profile: PROFILE, probeModel: 'claude-probe-a', capturedModel: 'claude-probe-b', surface: 'construct',
    });
    expect(matched.length, 'guard the guard: a matching model must actually be coached').toBeGreaterThan(0);
    expect(mismatched).toBe('');
    // the mismatched request gets the prefix every uncoached user gets, byte for byte
    expect(constructStaticPrefix(cv, mismatched)).toBe(constructStaticPrefix(cv));
    expect(constructStaticPrefix(cv, matched)).not.toBe(constructStaticPrefix(cv));
    // a never-probed key carries no model, so it is silent for the same reason
    expect(renderCoachingFor({
      profile: PROFILE, probeModel: null, capturedModel: 'claude-probe-a', surface: 'construct',
    })).toBe('');
  });

  it.each(Object.keys(SHELLS))('%s renders coaching from the key it just resolved', (shell) => {
    // Zero extra round-trips: the profile rides the SAME RPC that decrypted the key, so
    // the shell must read it off providerKey rather than fetching it again.
    const src = shellSrc(shell);
    expect(src).toContain("from '../_shared/modelCoaching.ts'");
    // The shell hands the gate BOTH bindings and its own surface key. It must not call the
    // ungated renderer directly: that is the shape that shipped one model's failures to
    // another model, and one surface's failures to another surface.
    expect(src).toMatch(/renderCoachingFor\(\{/);
    expect(src).toMatch(/profile: providerKey\.probeProfile/);
    expect(src).toMatch(/probeModel: providerKey\.probeModel/);
    expect(src).toMatch(/capturedModel,/);
    expect(src).toMatch(new RegExp(`surface: '${SHELLS[shell]}'`));
    expect(src, 'a shell must not bypass the model/surface gate').not.toMatch(/renderCoachingBlock\(/);
    // exactly one BYOK resolution, as before: no second lookup was added
    expect((src.match(/await resolveProviderKey\(/g) || []).length).toBe(1);
  });
});

// ── 5. the atlas, and the cache floor after everything ───────────────────────

describe('the intent atlas rides the shared prefix, and the floor still holds', () => {
  const PREFIXES = () => {
    const cVocab = buildConstructVocabulary();
    return {
      customContent: contentStaticPrefix({}),
      construct: constructStaticPrefix({
        kind: 'settlement', configFields: cVocab.settlementFields,
        constraintDimensions: cVocab.constraintDimensions, constraintBands: cVocab.constraintBands,
      }),
      constructRealm: constructStaticPrefix({
        kind: 'realm', configFields: cVocab.realmFields,
        constraintDimensions: cVocab.constraintDimensions, constraintBands: cVocab.constraintBands,
      }),
      interpret: interpretStaticPrefix(buildOpVocabulary()),
      styleOverhaul: styleStaticPrefix(buildStyleVocabulary()),
    };
  };

  it('EVERY sealed prefix still clears the provider cache floor after the additions', () => {
    // The floor is the whole economic argument (wave L-4): under it, cache_control is
    // accepted and silently ignored and full input is billed forever. sealStaticPrefix
    // pads to it automatically, so this asserts the machinery still runs rather than that
    // anyone remembered to check.
    for (const [name, prefix] of Object.entries(PREFIXES())) {
      expect(prefix.endsWith(CACHE_MARKER), `${name} must end with the marker`).toBe(true);
      expect(prefix.split(CACHE_MARKER).length - 1, `${name} must carry exactly one marker`).toBe(1);
      const cached = prefix.slice(0, -CACHE_MARKER.length);
      expect(estimateTokens(cached), `${name} sealed prefix is under the cache floor`)
        .toBeGreaterThanOrEqual(CACHE_MIN_PREFIX_TOKENS);
    }
  });

  it('the atlas-bearing surfaces carry the EXACT built section (not vacuously inert)', () => {
    // Compared against the builder's own output rather than a quoted phrase, so the
    // assertion cannot rot when the section format moves. If this ever goes quiet the atlas
    // has stopped reaching the prompt, which is exactly the failure a "returns '' when it
    // has nothing to say" contract makes invisible.
    const p = PREFIXES();
    const contentAtlas = buildIntentAtlasSection('customContent');
    const constructAtlas = buildIntentAtlasSection('construct');
    expect(contentAtlas.length, 'the distillate has nothing for customContent').toBeGreaterThan(0);
    expect(constructAtlas.length, 'the distillate has nothing for construct').toBeGreaterThan(0);
    expect(p.customContent).toContain(contentAtlas);
    expect(p.construct).toContain(constructAtlas);
    expect(p.constructRealm).toContain(constructAtlas);
    // it sits AHEAD of the house text: shared grounding belongs with the charter
    expect(p.customContent.indexOf(contentAtlas)).toBeLessThan(p.customContent.indexOf('CONTENT MANIFEST'));
  });

  it('interpret and autonomy render an EMPTY atlas today, and stay byte-clean', () => {
    // Phase A's inert contract, surface by surface: the soak prior speaks to two surfaces
    // and the other two stay silent until real telemetry lands. Silence is the correct
    // output, and it must cost zero bytes rather than an empty heading.
    expect(buildIntentAtlasSection('interpret')).toBe('');
    expect(buildIntentAtlasSection('autonomy')).toBe('');
    expect(PREFIXES().interpret).not.toContain('INTENT ATLAS');
  });

  it('styleOverhaul carries NO atlas section, deliberately', () => {
    // ATLAS_SURFACES omits it: a cosmetic compile infers no intent and would gain nothing
    // from population data. Asserted so a future "add it everywhere" sweep reds here.
    expect(PREFIXES().styleOverhaul).not.toContain('INTENT ATLAS');
    expect(shellSrc('style-overhaul')).not.toContain('intentAtlasBundle');
    const core = readFileSync(join(FN_DIR, 'style-overhaul', 'styleOverhaulCore.ts'), 'utf8');
    expect(core).not.toContain('buildIntentAtlasSection');
  });

  it('every prefix is byte-stable across two builds (the caching claim, re-proven)', () => {
    const a = PREFIXES();
    const b = PREFIXES();
    for (const name of Object.keys(a)) expect(a[name], `${name} drifted between builds`).toBe(b[name]);
  });
});
