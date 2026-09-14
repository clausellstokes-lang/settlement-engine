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
  TIER1_ANSWER_SCHEMA,
  TIER1_QUESTIONS,
  applyTier1,
  buildScribeBrief,
  buildScribeUserTurn,
  buildTier1Checklist,
  buildTownBlock,
  cachePadding,
  estimateTokens,
  judgeUnits,
  parseScribeUnits,
  SCRIBE_MODEL,
  SCRIBE_OUTPUT_SCHEMA,
} from './scribeCore.ts';
import { SCRIBE_VOICE, SCRIBE_VOICE_CHARS } from './voice.ts';
import { SCRIBE_EXEMPLARS, SCRIBE_EXEMPLARS_CHARS } from './exemplars.ts';

/** The brief as the function actually builds it, so no arm can drift from the shipped inputs. */
const brief = () => buildScribeBrief({ voice: SCRIBE_VOICE, exemplars: SCRIBE_EXEMPLARS });

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

Deno.test('the exemplar pack is carried whole', () => {
  assertEquals(SCRIBE_EXEMPLARS.length, SCRIBE_EXEMPLARS_CHARS);
  assert(SCRIBE_EXEMPLARS.includes('THE EXEMPLAR PACK'));
  assert(SCRIBE_EXEMPLARS.includes('Nothing above is a refuter\'s finding'),
    'the pack ends on its own standing, so a truncation at the tail is visible');
});

Deno.test('⭐ THE BRIEF IS BYTE-STABLE, which is the whole economics of the feature', () => {
  // Two calls in the same process must be identical, and so must two calls that differ in every
  // way a caller could differ: the brief closes over nothing but its two inputs, and both are
  // module constants at every call site.
  assertEquals(brief(), brief());
  assert(estimateTokens(brief()) >= CACHE_MIN_PREFIX_TOKENS,
    'the brief must clear the cache floor or it silently does not cache at all');
});

Deno.test('⭐ THE PACK CLEARS THE CACHE FLOOR BY ITSELF, so no padding is added', () => {
  // W2 padded the brief because it was the VOICE alone. With the exemplar pack in it the prefix
  // is an order of magnitude above the floor, and `cachePadding` returns the empty string for it
  // — asserted rather than assumed, because a silently-padded prefix is still byte-stable and
  // would hide the fact that the pack had gone missing.
  assertEquals(cachePadding(brief()), '');
  assert(!brief().includes('CACHE-STABILIZER'));
  // And the function still works, so keeping it is not keeping dead code.
  assert(cachePadding('a short prefix').includes('CACHE-STABILIZER'));
});

Deno.test('⛔ THE GAME MASTER\'S INSTRUCTIONS ARE IN THE VOLATILE TURN AND NEVER THE BRIEF', () => {
  // A per-user instruction in the cached prefix would be one user's words in every other user's
  // prompt AND a cache miss on every request. Both halves are asserted.
  const secret = 'dwell on the smuggling at the north gate';
  const turn = buildScribeUserTurn({ card, guidance: secret });
  assert(!brief().includes(secret));
  assert(!buildTownBlock(card).includes(secret));
  assert(turn.includes(secret));
  // And the brief is the same bytes whether a guidance was given or not.
  assertEquals(brief(), brief());
});

Deno.test('⭐ THE TOWN IS THE SECOND CACHED BLOCK AND IS NOT IN THE VOLATILE TURN', () => {
  // The whole point of the second breakpoint: the town section is the same bytes on every tab of
  // one settlement, so a tab call must not repeat it. A turn that still carried it would be
  // paying full price for ~7 KB on every tab.
  const block = buildTownBlock(card);
  const turn = buildScribeUserTurn({ card });
  assert(block.includes('Ashford'));
  assert(block.includes('THE TOWN, WHICH DOES NOT CHANGE BETWEEN TABS'));
  assert(!turn.includes('Ashford'), 'the town block is cached; the turn must not repeat it');
  assertEquals(block, buildTownBlock(card));
});

Deno.test('the volatile turn carries the page, the ground and the corpus line', () => {
  const turn = buildScribeUserTurn({ card });
  assert(turn.includes('tab defense'));
  assert(turn.includes('FAMILY: acute crisis'));
  assert(turn.includes('The corpus spine stands.'), 'the corpus line is the claim and the fallback');
  assert(turn.includes('face 1 speaks through: hall'), 'the seating is told, never chosen');
  assert(turn.includes('faces to write: 2'));
});

Deno.test('⭐⭐ THE STANDARD IS NON-CONTRADICTION, NOT NON-INVENTION (ruling 36)', () => {
  const text = brief();
  assert(text.includes('THE LINE THAT IS REFUSED, AND THE LINE THAT IS NOT'));
  assert(text.includes('THE STANDARD IS NON-CONTRADICTION'));
  assert(text.includes('refused for CONTRADICTING the settlement and never for ADDING to it'));
  assert(text.includes('silence is permission'));
  // ⭐ THE SIX THINGS THAT ARE REFUSED, each a contradiction of something the card holds.
  for (const bar of [
    'A VALUE A CARD FIELD DENIES',
    'A PAGE LINE OR A BADGE CONTRADICTED',
    'A ROLE THE TOWN DOES NOT SEAT, OR A RECORD NO BODY HERE KEEPS',
    'THE ENGINE\'S OWN MODEL DENIED',
    'AN EVENT, A DATE OR A NUMBER STATED AS RECORD',
    'A FORECAST',
  ]) assert(text.includes(bar), `${bar} is missing from the writer's brief`);
  // ⛔ AND THE THINGS THAT SHIP. W3b car 1's six invention bars refused every one of these, and
  // ruling 36 supersedes them: they are the flavour a game master opens the dossier for.
  assert(text.includes('NOT REFUSED, BECAUSE SILENCE IS PERMISSION'));
  assert(text.includes('Servants at the inn nursing a sick guest on a town with no'));
  assert(text.includes('The court\'s business waiting on the parish'));
  assert(!text.includes('THE SIX WAYS A LINE INVENTS'), 'ruling 35\'s bars are gone');
  assert(!text.includes('you may not say a fine, a debt, a backlog or a bribe'),
    'the plausible-addition sentence went with them: a practice is not a contradiction');
  // ⭐ THE UNKNOWN WORDING, RE-CUT: write around it, but give it no value, count or date.
  assert(text.includes('AN UNKNOWN FIELD IS ONE YOU MAY WRITE AROUND BUT MAY NOT GIVE A VALUE, A COUNT OR A DATE'));
  // AND THE REST OF W3a's ANSWERS TO THE FOUR GUESSES STAND.
  assert(text.includes('WHEN THE CARD GIVES A FACE NOTHING TO STAND ON, COPY THE CORPUS'),
    'the positive rule is first: a writer told only what not to do still has a seat to fill');
  assert(text.includes('THE TWO LADDERS'), 'the badge word against the band word');
  assert(text.includes('THE CORPUS LINE\'S STANDING'), 'the exemplar that breaks its own law');
  assert(text.includes('do not imitate the breach'));
  assert(text.includes('THE EXEMPLAR PACK'), 'the pack rides in the cached half');
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

Deno.test('every row is refuted on its own: spine, then every face, then every note', () => {
  const seen: string[] = [];
  judgeUnits([unit({ notebook: ['a note'] })], card, (u: { text: string }) => {
    seen.push(u.text);
    return passes();
  });
  assertEquals(seen, ['A line.', 'a', 'b', 'a note'], 'spine, then every face, then every note');
});

Deno.test('⭐⭐ A FACE FALLS ALONE: the refused face becomes the CORPUS face and the unit ships', () => {
  // ⛔ RUN 2 FINDING 3. A seven-line unit died on face one with its spine and face nought answered
  // all-no, and the pool then drew the hand corpus for all seven — which is the line face one
  // would have got anyway. Ruling 5/6's "a unit ships whole" is amended: whole OR patched.
  const out = judgeUnits([unit({ notebook: [] })], card, (u: { text: string }) => (
    u.text === 'b' ? { verdict: 'FAIL', findings: [{ arm: 'WALL-6', channel: 'FAIL' }] } : passes()
  ));
  assertEquals(out.kept.length, 1, 'the unit ships');
  assertEquals(out.dropped, 0);
  assertEquals(out.patched, 1);
  // Face 1 is the CORPUS face at that seat; face 0 is still the model's own.
  assertEquals(out.kept[0].faces, ['a', 'face one']);
  assertEquals(out.kept[0].spine, 'A line.', 'the spine is untouched');
  assertEquals(out.verdicts[0].verdict, 'PATCHED');
  assertEquals(out.verdicts[0].patched, ['face 1']);
  assertEquals(out.verdicts[0].arms, ['WALL-6']);
  assertEquals(out.verdicts[0].findings[0].seat, 'face 1', 'every finding names its seat');
});

Deno.test('⛔ A REFUSED SPINE STILL DROPS THE UNIT WHOLE, because the spine is the fact', () => {
  const out = judgeUnits([unit()], card, (u: { text: string }) => (
    u.text === 'A line.' ? { verdict: 'FAIL', findings: [{ arm: 'C4', channel: 'FAIL' }] } : passes()
  ));
  assertEquals(out.kept.length, 0);
  assertEquals(out.dropped, 1);
  assertEquals(out.patched, 0);
  assertEquals(out.verdicts[0].verdict, 'FAIL');
});

Deno.test('a refused NOTEBOOK row is dropped alone: the notebook has no corpus twin', () => {
  const out = judgeUnits([unit({ notebook: ['a note', 'another note'] })], card, (u: { text: string }) => (
    u.text === 'a note' ? { verdict: 'FAIL', findings: [{ arm: 'X', channel: 'FAIL' }] } : passes()
  ));
  assertEquals(out.kept.length, 1);
  assertEquals(out.kept[0].notebook, ['another note']);
  assertEquals(out.kept[0].faces, ['a', 'b'], 'no face moved');
  assertEquals(out.verdicts[0].patched, ['notebook 0']);
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

Deno.test('⭐⭐ the tier-1 checklist asks SIX CONTRADICTION TESTS, and says the standard first', () => {
  const text = buildTier1Checklist([unit()], card);
  assertEquals(TIER1_QUESTIONS.length, 6);
  for (const klass of ['FIELD', 'PAGE', 'ROSTER', 'MODEL', 'RECORD', 'FORECAST']) {
    assert(text.includes(`${klass}:`), `${klass} is missing from the checklist`);
  }
  assert(text.includes('6 CONTRADICTION TESTS'), 'the count in the instruction follows the list');
  // ⛔ THE STRUCK FOUR. Ruling 36: every one of them asked whether the line ADDED something, and
  // the owner's standard is whether it CONTRADICTS something. They drew most of RUN 2's refusals.
  for (const gone of ['CERTAINTY:', 'QUANTIFIER:', 'SCOPE:', 'MECHANISM:', 'ACTOR:']) {
    assert(!text.includes(gone), `${gone} was struck by ruling 36 and is still in the checklist`);
  }
  assert(text.includes('a line is refused for CONTRADICTING the settlement, and NEVER for adding to it'),
    'the standard is stated before the questions, or a reader told what to look for finds it');
  assert(text.includes('You are not asked whether the line was invented.'));
  // The lines are numbered per (unit, row) so an answer maps back to a unit, and the row is named.
  assert(text.includes('1. (spine) A line.'));
  assert(text.includes('2. (face 0) a'));
  // ⛔ AND THE FACTS ARE THE CARD'S OWN. A checklist asked against less than the writer was given
  // would refuse lines the writer was licensed to write, which is ruling 26's own defect class.
  assert(text.includes('Ashford'), 'the town');
  assert(text.includes('FAMILY: acute crisis'), 'the pool the line was written for');
});

Deno.test('⭐ THE TWO SEATS HOLD ONE LAW: the checklist carries the writer\'s standard', () => {
  // ⛔ RUN 2 MEASURED THE GAP. The writer wrote to the readiness BAND because the brief told it
  // to, and the second reader — shown the page's `Well-Defended` badge and never shown that note
  // — answered SAME PAGE `yes` on it. A checklist asked against a different law from the one the
  // writer was given refuses lines the writer was licensed to write, which is ruling 26's own
  // defect class pointed at the second reader instead of the first.
  const text = buildTier1Checklist([unit()], card);
  assert(text.includes('THE READER\'S EYE'), 'the preface is the writer\'s own law');
  for (const bar of [
    'a line is refused for CONTRADICTING the settlement, and NEVER for adding to it',
    'SILENCE IS PERMISSION',
    'THE TWO LADDERS are two true readings of one score',
    'THE ONE FLOOR WITH NO EXCEPTION: an event, a date or a number stated as record',
  ]) assert(text.includes(bar), `${bar} is missing from the reader's preface`);
  // AND THE SAME LAW IS IN THE WRITER'S BRIEF, so this is one law and not two.
  for (const bar of ['THE STANDARD IS NON-CONTRADICTION', 'AN EVENT, A DATE OR A NUMBER STATED AS RECORD']) {
    assert(brief().includes(bar));
  }
});

Deno.test('the checklist prints the page\'s machine lines, which question 7 is about', () => {
  const withPage = {
    ...card,
    page: [
      { kind: 'badge', label: 'readiness', text: 'Well-Defended' },
      { kind: 'machine', label: 'guard', text: 'The town watch maintains standard patrol coverage.' },
      { kind: 'composed', label: '', text: 'a composed line, which is NOT a machine line' },
    ],
  };
  const text = buildTier1Checklist([unit()], withPage);
  assert(text.includes('[badge] readiness: Well-Defended'));
  assert(text.includes('[machine] guard: The town watch maintains standard patrol coverage.'));
  assert(!text.includes('which is NOT a machine line'), 'a composed row is the prose, not the page');
});

Deno.test('⭐ THE CHECKLIST RIDES UNDER THE SAME LAW: the ladders, the funding note, and the six', () => {
  // ⛔ RUN 2 finding 5 in one arm. The writer wrote to the readiness BAND because its brief told
  // it to; this reader, shown the page's `Well-Defended` badge and never shown that note, answered
  // `yes` on it, and 63 lines fell that way. The note now rides in the town block BOTH seats are
  // given and in the PAGE question it bears on.
  const text = buildTier1Checklist([unit()], card);
  assert(text.includes('THE TWO LADDERS'), 'the ladders note is in the reader\'s turn');
  assert(text.includes('THE FUNDING NOTE IS TWO FIELDS, BOTH TRUE'));
  assert(text.includes('a line that agrees with the band is NOT a contradiction of the badge'),
    'and the PAGE question says so in terms');
  assert(text.includes('ninety seven percent'), 'the funding pair is named in the question too');
  // ⭐ THE FIELD QUESTION ASKS FOR A DENIAL, not for a silence: ruling 36's whole point.
  assert(text.includes('does the line assert a value a field below DENIES'));
  assert(text.includes('not a value a field leaves UNKNOWN'));
  // ⭐ THE RECORD FLOOR IS THE ONE WITH NO EXCEPTION (floor 2, the owner's surviving bar).
  assert(text.includes('RECORD: does it state an EVENT, a DATE or a NUMBER as record'));
  assert(text.includes('This is the one floor with no exception.'));
  // ⭐ AND THE SIX ARMS ARE THE SIX (ruling 36 supersedes ruling 35 and ruling 29's seven).
  assertEquals(TIER1_QUESTIONS.length, 6);
  assertEquals(TIER1_QUESTIONS.map((q) => q.arm), [
    'T1-FIELD', 'T1-PAGE', 'T1-ROSTER', 'T1-MODEL', 'T1-RECORD', 'T1-FORECAST',
  ]);
});

Deno.test('⛔ THE READER IS SHOWN A VALUELESS FIELD IN THE WRITER\'S OWN WORDS, never as `null`', () => {
  // A reader given a harsher rendering of the same fact than the writer was refuses lines the
  // writer was licensed to write, which is ruling 26's defect class pointed at the second seat.
  // ⭐ AND THE TWO KINDS ARE KEPT APART (car 6): a reading THIS CARD cannot resolve was decided by
  // the engine and is stated by the pool key; only a real settlement path whose leaf is absent is
  // UNKNOWN. Measured, 42 of 42 valueless rows on the pinned town are the first kind.
  const withFields = {
    ...card,
    pools: [{
      ...card.pools[0],
      fields: [
        { field: 'forces.walls.present', value: true, unknown: false, state: 'decided' },
        { field: 'readings.scores', value: null, unknown: true, state: 'unreadable' },
        { field: 'powerStructure.recentConflict', value: null, unknown: true, state: 'not-decided' },
      ],
    }],
  };
  const text = buildTier1Checklist([unit()], withFields);
  assert(text.includes('forces.walls.present = true'));
  assert(text.includes('readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it'));
  assert(text.includes('powerStructure.recentConflict = UNKNOWN (the engine has not decided this'));
  assert(!text.includes('readings.scores = UNKNOWN'), 'an unreadable row is not an undecided one');
  assert(!text.includes('= null'), 'a bare null reads as "the answer is nothing", which it is not');
});

Deno.test('⭐ A YES ON A FACE PATCHES THAT SEAT; a yes on the SPINE drops the unit', () => {
  const kept = [unit()];
  const no = { fieldDenied: 'no', page: 'no', roster: 'no', model: 'no', record: 'no', forecast: 'no' };
  // Row 1 is the spine, rows 2 and 3 the two faces. A `yes` on the MECHANISM question of row 3.
  const patch = applyTier1(kept, [{ n: 1, ...no }, { n: 3, ...no, record: 'yes' }], card);
  assertEquals(patch.kept.length, 1, 'the unit ships with the corpus at that seat');
  assertEquals(patch.kept[0].faces, ['a', 'face one']);
  assertEquals(patch.dropped, 0);
  assertEquals(patch.patched, 1);
  assertEquals(patch.verdicts[0].verdict, 'PATCHED');
  assertEquals(patch.verdicts[0].patched, ['face 1']);
  assertEquals(patch.verdicts[0].arms, ['T1-RECORD']);
  assertEquals(patch.verdicts[0].poolKey, 'FAMILY: acute crisis');

  // THE SPINE IS THE FACT: a yes there takes the whole unit, as it always did.
  const drop = applyTier1(kept, [{ n: 1, ...no, record: 'yes' }], card);
  assertEquals(drop.kept.length, 0);
  assertEquals(drop.dropped, 1);
  assertEquals(drop.verdicts[0].verdict, 'FAIL');

  // ⛔ WITHOUT A CARD THERE IS NO CORPUS FACE TO PATCH WITH, so the unit falls whole. Every caller
  // in the product and the pilot passes one; this is the safe answer for one that cannot.
  const blind = applyTier1(kept, [{ n: 3, ...no, record: 'yes' }]);
  assertEquals(blind.kept.length, 0);
  assertEquals(blind.dropped, 1);
});

Deno.test('⭐⭐ A ROW BYTE-EQUAL TO THE CORPUS IS NOT SENT TO THE SECOND READER', () => {
  // ⛔ IT IS THE LINE EVERY REFUSAL FALLS BACK TO. Sending the hand-written row to a model that can
  // answer `yes` would let the second reader refuse the corpus itself, and the numbering must not
  // close up behind it or every answer after it would map to the wrong line.
  const copied = unit({ spine: 'The corpus spine stands.', faces: ['a', 'face one'] });
  const text = buildTier1Checklist([copied], card);
  assert(!text.includes('The corpus spine stands.'), 'the corpus spine is exempt');
  assert(!text.includes('(face 1) face one'), 'the corpus face is exempt');
  assert(text.includes('2. (face 0) a'), 'the model\'s own row is asked, under its own number');
  // AND A `yes` ON AN EXEMPT NUMBER IS IGNORED, because nobody was asked it.
  const no = { fieldDenied: 'no', page: 'no', roster: 'no', model: 'no', record: 'no', forecast: 'no' };
  assertEquals(applyTier1([copied], [{ n: 1, ...no, record: 'yes' }], card).kept.length, 1);
  assertEquals(applyTier1([copied], [{ n: 3, ...no, record: 'yes' }], card).kept.length, 1);
  // NEGATIVE CONTROL — the row that is NOT the corpus is still refusable.
  assertEquals(applyTier1([copied], [{ n: 2, ...no, record: 'yes' }], card).patched, 1);
});

Deno.test('a clean sheet keeps every unit, and an answer for a line that does not exist is ignored', () => {
  const kept = [unit()];
  const no = { fieldDenied: 'no', page: 'no', roster: 'no', model: 'no', record: 'no', forecast: 'no' };
  assertEquals(applyTier1(kept, [{ n: 1, ...no }, { n: 2, ...no }, { n: 3, ...no }], card).kept.length, 1);
  // ⛔ A ROW OUTSIDE THE ENUMERATION IS A REPLY THAT DID NOT FOLLOW THE LIST, and dropping a unit
  // on it would refuse a line nobody read.
  assertEquals(applyTier1(kept, [{ n: 99, ...no, record: 'yes' }], card).kept.length, 1);
  assertEquals(applyTier1(kept, [], card).dropped, 0);
});

Deno.test('the tier-1 answer schema is CLOSED at every level and admits only yes or no', () => {
  assertEquals(TIER1_ANSWER_SCHEMA.additionalProperties, false);
  assertEquals(TIER1_ANSWER_SCHEMA.properties.answers.items.additionalProperties, false);
  assertEquals(
    Object.keys(TIER1_ANSWER_SCHEMA.properties.answers.items.properties).sort(),
    ['fieldDenied', 'forecast', 'model', 'n', 'page', 'record', 'roster'],
  );
  assertEquals(TIER1_ANSWER_SCHEMA.properties.answers.items.properties.record.enum, ['yes', 'no']);
});
