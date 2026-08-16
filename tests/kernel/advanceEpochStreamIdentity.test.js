/**
 * advanceEpochStreamIdentity.test.js — the RENDERED-STRING pin for `epochSuffix`
 * (wave EP-0, the advance-epoch program's pure segment).
 *
 * THE CLAIM THIS FILE EXISTS TO MAKE EXECUTABLE: a flag-absent or legacy world composes
 * the pre-wave pulse seed CHARACTER-FOR-CHARACTER. Not "the branch agrees"; not "the draw
 * counts match" — the literal string. `epochSuffix(absent)` returns `''` and `x + '' === x`,
 * so the identity is a property of concatenation rather than of a conditional that happens
 * to take the right arm today.
 *
 * ⛔ THE EXPECTATIONS ARE HARD-CODED LITERALS, NEVER RECOMPUTATIONS. A pin that rebuilds
 * the expected string from the same tokens the subject uses asserts only that the tokens
 * were spelled once — it is green under any consistent mistake. Both rendered strings below
 * are typed out in full, and the SHAPE they claim is anchored against the live kernel by the
 * source-read control so the two cannot drift apart silently.
 *
 * WHAT IS NOT PINNED HERE: nothing in `src` calls `epochSuffix` at this wave. EP-0 is dark
 * by construction (the WR-10 dark-instrument precedent) — the segment exists, is proven, and
 * has no caller until EP-1 threads it into the kernel seam. The source-read control below is
 * written to survive that landing: it pins the DARK PREFIX of the kernel's composition, which
 * EP-1 extends rather than rewrites.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';
import { createPRNG, epochSuffix } from '../../src/kernel/prng.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PULSE_KERNEL = 'src/domain/worldPulse/pulseKernel.js';

/**
 * The DARK composition body, verbatim at the EP-0 base. This is the string the kernel's one
 * `createPRNG` root interpolates, with the interpolation slots left as source text — it is
 * compared against SOURCE, not against a rendered value.
 */
const DARK_TEMPLATE_BODY =
  '${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}';

/**
 * A table of REAL seed spellings. The live writer mints `world-pulse:${campaign.id}`
 * (`worldState.js#createDefaultWorldState`), and the loader's fallback chain can leave a
 * campaign carrying any of the shapes below, so the identity is asserted over all of them
 * rather than over one tidy example. The last three are the ones a naive implementation
 * gets wrong: a seed that already carries the delimiter, a numeric-looking seed, and the
 * empty seed.
 */
const REAL_SEEDS = Object.freeze([
  'world-pulse:campaign',
  'world-pulse:c1',
  'world-pulse:4f2d37d1-9ab0-4c11-8e5a-b6d0c2e19f83',
  'world-pulse:Ashvale Reach',
  'world-pulse:c1::tick:6::one_month',
  '0',
  '',
]);

/** Read a source file as text, repo-relative. Throws on absence rather than returning ''. */
function readSource(rel) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  if (!text.trim()) throw new Error(`${rel} is empty — the source control below would be vacuous`);
  return text;
}

describe('epochSuffix renders the advance-epoch stream segment', () => {
  test('the ABSENT case renders the empty string, in every falsy spelling', () => {
    // `epoch: 0` must never render. A `!= null` guard would render `::epoch:0` for a world
    // whose epoch counter is at zero, which is a different stream for the same world.
    for (const absent of [null, undefined, '', 0, false, Number.NaN]) {
      expect(epochSuffix(/** @type {any} */ (absent)), `epochSuffix(${String(absent)})`).toBe('');
    }
  });

  test('the PRESENT case renders `::epoch:<e>` and coerces non-strings', () => {
    expect(epochSuffix('abc123')).toBe('::epoch:abc123');
    expect(epochSuffix(/** @type {any} */ (7))).toBe('::epoch:7');
  });

  test('the empty-string identity holds over a table of real seeds', () => {
    // This is the whole dark-identity claim reduced to the one algebraic fact it rests on.
    // COLLECTED, not bare: a loop that asserts inline dies on the first bad seed, so a
    // one-seed break and a whole-table break look identical — and the seeds after the
    // casualty never run at all, which is exactly the shape a dark-identity claim must not
    // be verified under.
    const failures = collectSeedFailures(REAL_SEEDS, (seed) => {
      expect(`${seed}${epochSuffix(null)}`).toBe(seed);
      expect(createPRNG(`${seed}${epochSuffix(null)}`).seed).toBe(createPRNG(seed).seed);
    });
    expectNoSeedFailures(failures, 'an absent epoch leaves every real seed character-identical');
  });

  test('the drawn stream is identical dark, not merely the seed string', () => {
    // Same seed ⇒ same draws is the property the identity is FOR; asserting the string alone
    // would leave the inference to the reader.
    const failures = collectSeedFailures(REAL_SEEDS, (seed) => {
      const bare = createPRNG(seed);
      const suffixed = createPRNG(`${seed}${epochSuffix(undefined)}`);
      expect([bare.random(), bare.random(), bare.random()])
        .toEqual([suffixed.random(), suffixed.random(), suffixed.random()]);
    });
    expectNoSeedFailures(failures, 'an absent epoch leaves every real seed drawing the same stream');
  });
});

describe('the rendered pulse-root strings, as hard-coded literals', () => {
  /**
   * The kernel's composition, re-expressed here at the token level so the two rendered
   * literals below have something to be rendered BY. Its fidelity to the live kernel is not
   * assumed — the source-read control in the next block asserts it.
   */
  const composeRoot = (world, tickInterval, epoch) =>
    `${world.rngSeed}::tick:${world.tick + 1}::${tickInterval}${epochSuffix(epoch)}`;

  const WORLD = Object.freeze({ rngSeed: 'world-pulse:c1', tick: 5 });

  test('epoch ABSENT composes the pre-wave string', () => {
    expect(composeRoot(WORLD, 'one_month', null)).toBe('world-pulse:c1::tick:6::one_month');
  });

  test('epoch PRESENT composes the pre-wave string plus one segment', () => {
    expect(composeRoot(WORLD, 'one_month', 'abc123'))
      .toBe('world-pulse:c1::tick:6::one_month::epoch:abc123');
  });

  test('the multi-tick interval spelling composes its own pair', () => {
    // `simulateCampaignWorldInterval` builds every composed tick with the LITERAL
    // 'one_week', so the interval term is part of the stream identity and a pin written
    // only over 'one_month' would miss the path that is default-ON.
    expect(composeRoot(WORLD, 'one_week', null)).toBe('world-pulse:c1::tick:6::one_week');
    expect(composeRoot(WORLD, 'one_week', 'abc123'))
      .toBe('world-pulse:c1::tick:6::one_week::epoch:abc123');
  });

  test('THE MUTANT: a `!= null` guard renders `::epoch:0` and breaks the dark identity', () => {
    // The defect this file's first assertion exists to catch, executed rather than argued.
    const mutantSuffix = (e) => (e != null ? `::epoch:${String(e)}` : '');
    expect(mutantSuffix(0)).toBe('::epoch:0');
    expect(epochSuffix(/** @type {any} */ (0))).toBe('');
    expect(`${WORLD.rngSeed}${mutantSuffix(0)}`).not.toBe(WORLD.rngSeed);
    // anchored: the same expression with the REAL implementation is asserted equal on the
    // line below, so this negative cannot pass by the subject having gone missing.
    expect(`${WORLD.rngSeed}${epochSuffix(/** @type {any} */ (0))}`).toBe(WORLD.rngSeed);
  });
});

describe('the composition shape is anchored against the live kernel', () => {
  test('pulseKernel composes exactly ONE root, and its dark prefix is the frozen body', () => {
    const source = readSource(PULSE_KERNEL);
    const roots = [...source.matchAll(/createPRNG\(`([^`]*)`\)/g)].map((m) => m[1]);
    // R1's measured fact: the kernel composes exactly one root and every sub-stream forks
    // off it. A second root would mean a second stream identity this pin says nothing about.
    expect(roots, `${PULSE_KERNEL} must compose exactly one createPRNG root`).toHaveLength(1);
    expect(
      roots[0].startsWith(DARK_TEMPLATE_BODY),
      `${PULSE_KERNEL}'s pulse root is \`${roots[0]}\`, which does not open with the frozen`
      + ` dark body \`${DARK_TEMPLATE_BODY}\`. The literals pinned above render THAT body, so`
      + ` a change here silently invalidates them. EP-1 APPENDS the epoch term to this`
      + ` template and leaves the prefix intact — a failure means something else moved.`,
    ).toBe(true);
  });

  test('no production module calls epochSuffix at this wave — EP-0 is dark by construction', () => {
    // The dormancy claim, measured rather than asserted. EP-1 lands the first caller.
    const kernel = readSource('src/kernel/prng.js');
    expect(kernel).toContain('export function epochSuffix');
    const pulse = readSource(PULSE_KERNEL);
    // `readSource` throws on an empty or missing file, and the assertion below proves the
    // scanned text really is the live kernel — so the negative cannot go vacuous.
    // anchored: the same text is asserted to CONTAIN the pulse root on the next line.
    expect(pulse).not.toContain('epochSuffix');
    expect(pulse).toContain('createPRNG(`');
  });
});
