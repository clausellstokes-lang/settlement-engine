/**
 * prngForkLabelDelimiter.test.js — habitat guard for the FORK LABEL ALIASING class
 * (kernel-generators review, 2026-07-30).
 *
 * THE CLASS: `fork(label)` derives its child seed by concatenation —
 * `${seed}::${label}` — with no escaping. So a label that itself contains '::'
 * derives the SAME string a fork CHAIN derives: from seed S, fork('a::b') and
 * fork('a').fork('b') are one stream. Two substreams meant to be independent would
 * then draw identical values forever, silently, and only a same-value coincidence
 * across two lanes would ever surface it.
 *
 * WHY NOT A RUNTIME THROW: the review proposed rejecting '::' in fork() as dormant
 * hardening. It is not dormant — three worldPulse lanes already use '::' as their
 * own sub-delimiter (fidelityNoise.js, deityStanceLane.js, religiousContest.js).
 * Staging the throw reds 12 of 18 tests in tests/domain/deityStanceLane.test.js at
 * deityStanceLane.js:349, so a throw is a regression, not a guard. Re-spelling those
 * labels is not available either: the label IS the seed material, so any re-spelling
 * re-rolls those streams for every existing world — owner-gated under THE PROMISE.
 *
 * THE GUARD THAT IS AVAILABLE: freeze the label families that embed the delimiter
 * and prove none of them has a chain rooted at the same first segment. A new
 * embedded-delimiter label reds here until someone confirms no chain aliases it; a
 * new chain over a frozen family reds too. That is the collision check the reviewer
 * ran by hand, made repeatable.
 *
 * KNOWN EDGES (source scan, accepted):
 *   - Only LITERAL label heads are visible. `.fork(name)` and `.fork(`${key}`)` pass
 *     a value the scan cannot read; the interpolated components in the frozen
 *     families are slugified ids and single-colon keys, verified by hand at freeze
 *     time. A dynamic label that could contain '::' is a code-review question, not a
 *     scannable one.
 *   - A `.fork(` inside a comment or a doc block counts as a site. A false positive
 *     costs one frozen row, never a miss — which is why the roster is exact-equality
 *     rather than a subset check.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, test, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** A `.fork(` call whose label is a single string/template literal. */
const FORK_LITERAL_RE = /\.fork\(\s*(`[^`]*`|'[^']*'|"[^"]*")/g;

/**
 * The label families that spell their sub-keys with the reserved delimiter, frozen
 * with the file that owns each. EXACT set: adding a row means confirming that no
 * fork CHAIN anywhere derives the same seed string (the second test below checks the
 * chain-root half automatically once the family is listed).
 */
const EMBEDDED_DELIMITER_FAMILIES = Object.freeze({
  'deity-stance': ['src/domain/worldPulse/deityStanceLane.js'],
  'fidelity': ['src/domain/worldPulse/fidelityNoise.js'],
  'religion-contest': ['src/domain/worldPulse/religiousContest.js'],
});

/** Every .js/.jsx file under src/, repo-relative with POSIX slashes. */
function collectSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) collectSourceFiles(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, abs).replace(/\\/g, '/'));
  }
  return out;
}

/** Literal fork labels in the tree: `{ file, label }` with quotes stripped. */
function collectLiteralForkLabels() {
  /** @type {Array<{ file: string, label: string }>} */
  const sites = [];
  for (const file of collectSourceFiles(SRC)) {
    const source = readFileSync(join(ROOT, file), 'utf8');
    for (const match of source.matchAll(FORK_LITERAL_RE)) {
      sites.push({ file, label: match[1].slice(1, -1) });
    }
  }
  return sites;
}

describe('fork() derives child seeds by concatenation — the delimiter is vocabulary', () => {
  test('the derivation is `${seed}::${label}` and an embedded delimiter aliases a chain', () => {
    // THE CONTRACT. Every seeded stream in the product hangs off this exact string;
    // changing it is an owner-gated re-roll of every world, not a refactor.
    expect(createPRNG('world-seed').fork('cultural-identity').seed).toBe('world-seed::cultural-identity');

    // THE HAZARD, demonstrated rather than asserted in prose: these two derivations
    // are the same string, so the two PRNGs are the same stream.
    const embedded = createPRNG('world-seed').fork('a::b');
    const chained = createPRNG('world-seed').fork('a').fork('b');
    expect(embedded.seed).toBe(chained.seed);
    expect([embedded.random(), embedded.random()]).toEqual([chained.random(), chained.random()]);
  });
});

describe('the embedded-delimiter label families are frozen and collision-free', () => {
  test('exactly the frozen families spell a fork label with the reserved delimiter', () => {
    /** @type {Record<string, string[]>} */
    const found = {};
    for (const { file, label } of collectLiteralForkLabels()) {
      if (!label.includes('::')) continue;
      const family = label.split('::')[0];
      // A family head that is itself interpolated cannot be reasoned about statically,
      // so it may not be frozen — it must be reviewed at the call site.
      expect(
        family.includes('${'),
        `fork label at ${file} opens with an interpolated segment before '::' (${label}).`
        + ` The family head must be a literal, or no scan can prove its stream is unique.`,
      ).toBe(false);
      (found[family] ||= []).push(file);
    }
    for (const family of Object.keys(found)) found[family] = [...new Set(found[family])].sort();

    expect(
      found,
      `The set of fork label families that embed '::' changed. A new family is only safe`
      + ` once you have confirmed no fork CHAIN derives the same seed string — see this`
      + ` file's header. Add the row here after that check, never to silence the test.`,
    ).toEqual(EMBEDDED_DELIMITER_FAMILIES);
  });

  test('no fork chain is rooted at a frozen family head', () => {
    const heads = new Set(Object.keys(EMBEDDED_DELIMITER_FAMILIES));
    /** @type {Array<string>} */
    const collisions = [];
    for (const { file, label } of collectLiteralForkLabels()) {
      if (heads.has(label)) collisions.push(`${file}: .fork('${label}')`);
    }
    expect(
      collisions,
      `A fork label equals the head of a family that also spells that head with '::'.`
      + ` The chain's child and the embedded label derive the SAME seed, so the two`
      + ` substreams are one — give one of them a different head.`,
    ).toEqual([]);
  });
});
