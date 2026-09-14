/**
 * scribeCore.test.ts — THE CONTRACT IN AND OUT, and the gate every rendered line passes.
 *
 * Deno test (`deno task test:edge`), not vitest. Every arm here is a property the design states
 * and the money depends on: a prefix that is not byte-stable is a cache miss on every settlement;
 * an instruction that reached the cached half would be one user's words in every other user's
 * prompt; and a unit that passed the gate without its faces aligned would put the wrong power's
 * name on the wrong sentence on a paid page.
 */
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import {
  CACHE_MIN_PREFIX_TOKENS,
  buildScribeBrief,
  buildScribeUserTurn,
  buildTier1Checklist,
  estimateTokens,
  judgeUnits,
  parseScribeUnits,
  SCRIBE_MODEL,
  SCRIBE_OUTPUT_SCHEMA,
} from './scribeCore.ts';
import { SCRIBE_VOICE, SCRIBE_VOICE_CHARS } from './voice.ts';

const card = {
  tab: 'defense',
  audience: 'dm',
  town: { name: 'Ashford', tier: 'town', sources: ['hall', 'watch'] },
  epoch: { tick: 8, calendar: { year: 2 } },
  pools: [{
    blockId: 'DS-DEF-2',
    poolKey: 'FAMILY: acute crisis',
    vid: 3,
    angle: 'ledger',
    marks: [],
    slots: { declared: ['settlement'] },
    faceSources: [null, 'hall'],
    unit: { spine: 'The corpus spine stands.', faces: ['face nought', 'face one'] },
  }],
};

Deno.test('the VOICE is transcribed whole', () => {
  assertEquals(SCRIBE_VOICE.length, SCRIBE_VOICE_CHARS);
  assert(SCRIBE_VOICE.includes('THE MASTER ARCHIVER'));
});

Deno.test('the model is the one the chair ruled', () => {
  assertEquals(SCRIBE_MODEL, 'claude-opus-5');
});

Deno.test('⭐ THE BRIEF IS BYTE-STABLE, which is the whole economics of the feature', () => {
  // Two calls in the same process must be identical, and so must two calls that differ in every
  // way a caller could differ: the brief closes over nothing but module constants.
  assertEquals(buildScribeBrief(SCRIBE_VOICE), buildScribeBrief(SCRIBE_VOICE));
  assert(estimateTokens(buildScribeBrief(SCRIBE_VOICE)) >= CACHE_MIN_PREFIX_TOKENS,
    'the brief must clear the cache floor or it silently does not cache at all');
});

Deno.test('⛔ THE GAME MASTER\'S INSTRUCTIONS ARE IN THE VOLATILE TURN AND NEVER THE BRIEF', () => {
  // A per-user instruction in the cached prefix would be one user's words in every other user's
  // prompt AND a cache miss on every request. Both halves are asserted.
  const secret = 'dwell on the smuggling at the north gate';
  const brief = buildScribeBrief(SCRIBE_VOICE);
  const turn = buildScribeUserTurn({ card, guidance: secret });
  assert(!brief.includes(secret));
  assert(turn.includes(secret));
  // And the brief is the same bytes whether a guidance was given or not.
  assertEquals(brief, buildScribeBrief(SCRIBE_VOICE));
});

Deno.test('the volatile turn carries the card, the ground and the corpus exemplar', () => {
  const turn = buildScribeUserTurn({ card });
  assert(turn.includes('Ashford'));
  assert(turn.includes('FAMILY: acute crisis'));
  assert(turn.includes('The corpus spine stands.'), 'the corpus line is the exemplar and the fallback');
  assert(turn.includes('face 1 speaks through: hall'), 'the seating is told, never chosen');
  assert(turn.includes('faces to write: 2'));
});

Deno.test('the epoch record is carried only when one is given', () => {
  assert(!buildScribeUserTurn({ card }).includes('WHAT HAS MOVED'));
  assert(buildScribeUserTurn({ card, record: { advanceSeq: 2, delta: {} } }).includes('WHAT HAS MOVED'));
});

Deno.test('the output schema is CLOSED at every level', () => {
  assertEquals(SCRIBE_OUTPUT_SCHEMA.additionalProperties, false);
  assertEquals(SCRIBE_OUTPUT_SCHEMA.properties.units.items.additionalProperties, false);
  // ⛔ AND IT NAMES ONLY WORDS. A schema that admitted `marks`, `sources`, `pairs` or `slots`
  // would let a blob mint a DM-only line onto a player page or seat a power the town lacks.
  assertEquals(
    Object.keys(SCRIBE_OUTPUT_SCHEMA.properties.units.items.properties).sort(),
    ['blockId', 'faces', 'notebook', 'poolKey', 'spine', 'vid'],
  );
});

Deno.test('a malformed answer is a typed refusal, never a throw', () => {
  assertEquals(parseScribeUnits('not json').reason, 'unparseable');
  assertEquals(parseScribeUnits('{"nope":1}').reason, 'no_units');
  assertEquals(parseScribeUnits('{"units":[{"blockId":"a"}]}').reason, 'no_lawful_units');
  const ok = parseScribeUnits(JSON.stringify({
    units: [{ blockId: 'DS-DEF-2', poolKey: 'k', vid: 3, spine: 'A line.', faces: ['a'], notebook: [] }],
  }));
  assertEquals(ok.ok, true);
  assertEquals(ok.units[0].vid, 3);
});

// ── THE GATE ────────────────────────────────────────────────────────────────────────────────
const unit = (over: Record<string, unknown> = {}) => ({
  blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', vid: 3,
  spine: 'A line.', faces: ['a', 'b'], notebook: [], ...over,
});
const passes = () => ({ verdict: 'PASS', findings: [] });

Deno.test('⭐ A FACE COUNT THAT DOES NOT MATCH IS DROPPED BEFORE THE INSTRUMENTS SEE IT', () => {
  // The words would be MIS-SEATED rather than merely wrong: face i speaks through source i.
  let called = 0;
  const out = judgeUnits([unit({ faces: ['only one'] })], card, () => { called += 1; return passes(); });
  assertEquals(out.kept.length, 0);
  assertEquals(out.dropped, 1);
  assertEquals(out.verdicts[0].arms, ['FACE-COUNT']);
  assertEquals(called, 0, 'the refuter is never asked about a mis-seated unit');
});

Deno.test('a pool the card does not carry is dropped', () => {
  const out = judgeUnits([unit({ poolKey: 'invented' })], card, passes);
  assertEquals(out.kept.length, 0);
  assertEquals(out.verdicts[0].arms, ['CARD-POOL']);
});

Deno.test('⭐ FAIL IS DROPPED, WITHHELD SHIPS — the corpus\'s own rule, not a stricter one', () => {
  const failing = judgeUnits([unit()], card, () => ({
    verdict: 'FAIL', findings: [{ arm: 'WALL-6', channel: 'FAIL' }],
  }));
  assertEquals(failing.kept.length, 0);
  assertEquals(failing.dropped, 1);
  assertEquals(failing.verdicts[0].verdict, 'FAIL');
  assertEquals(failing.verdicts[0].arms, ['WALL-6']);

  const withheld = judgeUnits([unit()], card, () => ({
    verdict: 'WITHHELD', findings: [{ arm: 'ORDER', channel: 'WITHHELD' }],
  }));
  assertEquals(withheld.kept.length, 1, 'the corpus ships its own WITHHELDs and so does the Scribe');
  assertEquals(withheld.verdicts[0].verdict, 'WITHHELD');
});

Deno.test('the worst verdict any ROW earns is the unit\'s, because a unit ships whole', () => {
  const seen: string[] = [];
  const out = judgeUnits([unit({ notebook: ['a note'] })], card, (u: { text: string }) => {
    seen.push(u.text);
    return u.text === 'b' ? { verdict: 'FAIL', findings: [] } : passes();
  });
  assertEquals(seen, ['A line.', 'a', 'b', 'a note'], 'spine, then every face, then every note');
  assertEquals(out.kept.length, 0);
});

Deno.test('a refuter that THROWS convicts the unit rather than crashing the render', () => {
  const out = judgeUnits([unit()], card, () => { throw new Error('boom'); });
  assertEquals(out.kept.length, 0);
  assertEquals(out.verdicts[0].verdict, 'FAIL');
});

Deno.test('a clean unit ships with its verdict recorded', () => {
  const out = judgeUnits([unit()], card, passes);
  assertEquals(out.kept.length, 1);
  assertEquals(out.dropped, 0);
  assertEquals(out.verdicts[0].verdict, 'PASS');
  assertStrictEquals(out.kept[0].spine, 'A line.');
});

Deno.test('the tier-1 checklist asks the five classes tier 0 cannot reach', () => {
  const text = buildTier1Checklist([unit()], card);
  for (const klass of ['CERTAINTY', 'QUANTIFIER', 'SCOPE', 'ACTOR', 'FORECAST']) {
    assert(text.includes(klass), `${klass} is one of the 27 tier-0 cannot reach`);
  }
  assert(text.includes('1. A line.'));
});
