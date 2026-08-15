/**
 * strategyMoveVocabulary.walker.test.js — HB-1. THE SINGLE-EXPORTER FENCE, THE BRANCHER
 * REGISTER, AND THE OWNER ARM THAT REPLACES A REFUTED DELETION.
 *
 * ⭐ ARM 1 IS ANOTHER VOLUME'S STRUCTURAL HALF, LANDED BY THE VOLUME THAT GOT THERE FIRST.
 * The cross-volume collision contract is explicit that *"a source-scan pin that only exists
 * once the later wave builds cannot restrain the volume that builds FIRST … until both
 * artifacts exist the arbitration is a RECOMMENDATION with a fence, not a contract."*
 * MEASURED: no such fence existed anywhere in the tree. So this file ships it — at-most-one
 * module may export the closed move vocabulary — and the chair records that as DISCHARGING
 * the other volume's obligation rather than duplicating it. The inbound half of the
 * contract remains owed by that volume's fold.
 *
 * ── THE PREDICATE THE VOLUME UNDER-SPECIFIED, DEFINED HERE ──────────────────────
 *
 * The charter asks for "a walker that reds any module branching on a strategy-move token
 * outside the frozen export". ⚠⚠ READ LITERALLY THAT REDS THE TREE ON DAY ONE, and the
 * reason is a measurement rather than an opinion: TEN modules compare a move literal today,
 * and they fall into two kinds a token scan cannot tell apart. FOUR are genuine
 * strategy-move branchers — the chooser itself, the bloc decision load which takes the move
 * key as an argument, the commitment load, and the deploy order. SIX compare a word that
 * belongs to a DIFFERENT closed vocabulary: an engagement posture, a ladder posture (twice),
 * a generosity act (twice) and a competition axis all spell a word this vocabulary also
 * holds.
 *
 * ⚠⚠ THAT NARROWS A CLAIM THE COMPILE MADE. It reasoned that once this wave mints the
 * eleven, the cross-vocabulary collision *"becomes impossible because the two vocabularies
 * no longer share a member"*. FALSE in general, measured: six modules spell a shared word
 * today. The structural cure is therefore the REGISTER, not the disjointness.
 *
 * ── ⛔⛔ THE ARM THE REFUTED DESIGN COULD NOT HAVE ─────────────────────────────────
 *
 * The volume asked twice for the `move === 'fortify' ||` disjunct in the bloc decision load
 * to be DELETED, and both asks died on measurement (OWNER_DECISION_QUEUE.md §38). The token
 * is not a member of this vocabulary and never will be — it belongs to the MOBILIZATION
 * vocabulary — yet the disjunct is LIVE, because the deciding site's inputs are not limited
 * to emitted moves: a RATIFIED same-seed golden passes the token straight in.
 *
 * A membership-only arm is structurally blind to that. It can only ask "is this literal in
 * the vocabulary?", and the answer for a live foreign token is NO — so the honest reading of
 * the refuted design REDS ON DAY ONE with the disjunct alive, and goes quiet the moment
 * somebody deletes it. Exactly backwards.
 *
 * The owner arm here is therefore MEMBERSHIP **OR** REGISTERED-FOREIGN, and — this is the
 * whole cure — the declared foreign set is asserted EQUAL to the MEASURED foreign set, EXACT
 * IN BOTH DIRECTIONS:
 *
 *   - add an UNDECLARED foreign token  ⇒ the unregistered half reds;
 *   - DELETE the registered disjunct   ⇒ the declared-but-absent half reds.
 *
 * The second is the arm that would have caught the refutation before it was ever committed.
 *
 * ⚠ A DECLARED VACUITY, recorded rather than hidden: `momentum.js` is a registered
 * `strategy` brancher with ZERO owner-arm subjects — it compares tokens through a
 * differently-named identifier. Its contribution to the owner arm is vacuous today, and this
 * comment exists so a future reader cannot mistake an empty arm for a proved one.
 *
 * ⚠ THE MOVE-KEYED DETECTOR'S SHAPE IS LOAD-BEARING AND WAS FOUND BY EXECUTION: a single
 * `[A-Za-z_$][\w$]*[Mm]ove` class requires a character BEFORE the word and therefore misses
 * the bare identifier `move`, which is precisely what the owner site spells — the arm
 * measured ZERO subjects until this was corrected. The capitalised half is kept separate so
 * `remove` cannot masquerade as a move-named binding.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ALL_MOVE_TOKENS,
  STRATEGY_MOVES,
} from '../../src/domain/worldPulse/strategyMoves.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VOCABULARY_HOME = 'src/domain/worldPulse/strategyMoves.js';
const OWNER_OF_THE_FOREIGN_TOKEN = 'src/domain/worldPulse/settlementPolitics.js';

const NO_FOREIGN_TOKENS = Object.freeze({});

/**
 * EVERY MODULE THAT COMPARES A MOVE LITERAL, frozen at its measured membership and exact in
 * both directions. `kind: 'strategy'` means the module really is branching on THIS
 * vocabulary and is therefore held to the owner arm; `kind: 'foreign-vocabulary'` means the
 * word it spells belongs to a different closed set that happens to share it.
 *
 * ⭐⭐ A `strategy` row may declare `foreignTokens`: move-shaped literals it branches on that
 * this vocabulary does NOT contain and never will. Each entry names the vocabulary the word
 * really belongs to, the LIVE EVIDENCE that makes the branch load-bearing, and the symbol at
 * that address which spells the token. The set is asserted exact in both directions, so a
 * declaration cannot outlive the branch it describes and a branch cannot appear undeclared.
 */
const MOVE_TOKEN_BRANCHERS = Object.freeze({
  'src/domain/worldPulse/settlementStrategy.js': Object.freeze({
    kind: 'strategy',
    reason: 'the chooser itself — it enumerates, scores and samples the vocabulary, so it is the one module that must branch on every member',
  }),
  [OWNER_OF_THE_FOREIGN_TOKEN]: Object.freeze({
    kind: 'strategy',
    reason: 'the ruling-bloc decision load takes the move key as an argument and loads it toward the governing coalition\'s end; it is the site whose disjunct two review rounds tried to delete',
    foreignTokens: Object.freeze({
      fortify: Object.freeze({
        vocabulary: 'MOBILIZATION (src/domain/worldPulse/mobilizationReactions.js)',
        evidence: 'tests/property/espionageAbsenceDormancy.test.js',
        evidenceSymbol: 'LOAD_BEARING_MOVES',
        reason: 'a LIVE ratified consumer passes this NON-EMITTED token straight in, and the arm it lands on is a DISJUNCTION whose other operand IS an emitted move — so the token takes the sibling\'s loaded value rather than the neutral 1 a fall-through token returns. Two same-seed goldens record it and re-recording either is forbidden by that file\'s own header. ⛔ THE DISJUNCT IS NOT DEAD: its deletion was refuted at OWNER_DECISION_QUEUE.md §38, twice, and this row is what reds the third attempt.',
      }),
    }),
  }),
  'src/domain/worldPulse/momentum.js': Object.freeze({
    kind: 'strategy',
    reason: 'the commitment load weights a move against a committed course, so it branches on the two moves that advance and reverse one; ⚠ it reaches them through a differently-named identifier, so its owner-arm contribution is VACUOUS today and the file header says so',
  }),
  'src/domain/worldPulse/warIntent.js': Object.freeze({
    kind: 'strategy',
    reason: 'the war-intent order is minted from the deploy move alone, which is the same measured fact that makes the chooser\'s arity per-action rather than flatly dyadic',
  }),
  'src/domain/worldPulse/convergence.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'it spells a member of the ENGAGEMENT posture vocabulary, a four-word closed set this file re-uses as its shape template; the shared word is a collision of spelling, not of meaning',
  }),
  'src/domain/worldPulse/npcLadderContest.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'it spells a ladder-contest posture, not a settlement strategy move; the ladder owns its own closed vocabulary and its own close',
  }),
  'src/domain/worldPulse/npcLadderState.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'the same ladder posture vocabulary as its sibling above, read on the state side',
  }),
  'src/domain/worldPulse/generosityKernel.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'it spells a generosity ACT, which is its own closed vocabulary; the strategy lever of the same name is a different act by a different actor',
  }),
  'src/domain/spatial/generosityReactions.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'the reaction side of the same generosity act vocabulary',
  }),
  'src/domain/worldPulse/factionCompetition.js': Object.freeze({
    kind: 'foreign-vocabulary',
    reason: 'it spells a faction competition axis, a closed set of its own; the strategy lever of the same name scores a settlement act rather than naming an axis',
  }),
});

/**
 * A move-named identifier compared against a string literal — the owner arm's subject.
 * ⚠ THE ALTERNATION IS DELIBERATE AND WAS FOUND BY EXECUTION (see the header).
 */
const MOVE_KEYED_COMPARISON = /\b(?:move[\w$]*|[A-Za-z_$][\w$]*Move[\w$]*)\s*(?:===|!==)\s*'([^']+)'|'([^']+)'\s*(?:===|!==)\s*\b(?:move[\w$]*|[A-Za-z_$][\w$]*Move[\w$]*)/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

/** Comments and import specifiers blanked; a JSDoc mention is not a branch. */
function codeOnly(src) {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, lead) => lead + ' '.repeat(m.length - lead.length));
  return stripped.replace(
    /^\s*(?:import|export)\b[^\n]*?from\s*['"][^'"]*['"];?[^\n]*$/gm,
    (m) => ' '.repeat(m.length),
  );
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({
    rel: relative(ROOT, p).replace(/\\/g, '/'),
    src: readFileSync(p, 'utf8'),
  }))
  .map((file) => ({ ...file, code: codeOnly(file.src) }))
  .sort((a, b) => (a.rel < b.rel ? -1 : 1));

/** Modules declaring an array literal whose quoted members are EXACTLY the vocabulary. */
function filesDeclaringVocabulary(words) {
  const target = [...words].sort().join('|');
  const hits = [];
  for (const { rel, code } of SRC_FILES) {
    for (const m of code.matchAll(/\[([^[\]]*)\]/g)) {
      const quoted = [...m[1].matchAll(/'([^']*)'/g)].map((q) => q[1]);
      if (quoted.length !== words.length) continue;
      if ([...quoted].sort().join('|') === target) { hits.push(rel); break; }
    }
  }
  return hits;
}

/** Modules comparing any vocabulary member as a literal. */
function branchingModules() {
  const res = ALL_MOVE_TOKENS.map((word) => new RegExp(`(?:===|!==)\\s*['"\`]${word}['"\`]|['"\`]${word}['"\`]\\s*(?:===|!==)`));
  return SRC_FILES
    .filter(({ rel }) => rel !== VOCABULARY_HOME)
    .filter((file) => res.some((re) => re.test(file.code)))
    .map(({ rel }) => rel)
    .sort();
}

/** The move literals a module compares against a move-named identifier. */
function moveKeyedLiterals(code) {
  const out = new Set();
  for (const m of code.matchAll(new RegExp(MOVE_KEYED_COMPARISON.source, 'g'))) {
    out.add(m[1] ?? m[2]);
  }
  return [...out].sort();
}

/** Those literals the frozen vocabulary does NOT contain — the MEASURED foreign set. */
function measuredForeign(code) {
  return moveKeyedLiterals(code).filter((literal) => !ALL_MOVE_TOKENS.includes(literal));
}

const foreignTokensOf = (row) => row.foreignTokens ?? NO_FOREIGN_TOKENS;
const strategyRows = () => Object.entries(MOVE_TOKEN_BRANCHERS).filter(([, row]) => row.kind === 'strategy');
const fileFor = (rel) => SRC_FILES.find((file) => file.rel === rel);

describe('HB-1 — one exporter of the move vocabulary, and every branch outside it declared', () => {
  test('the corpus, both detectors and the register are live (guard the guard)', () => {
    // Absence claims over a scan that stopped matching prove nothing. Each detector is
    // proven on a subject that is genuinely non-empty before any emptiness is asserted.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    expect(filesDeclaringVocabulary(ALL_MOVE_TOKENS)).toContain(VOCABULARY_HOME);
    expect(branchingModules().length).toBeGreaterThan(5);
    expect(ALL_MOVE_TOKENS.length).toBeGreaterThan(5);
    // The owner arm must have a live subject somewhere, or every stray list below is empty
    // for the wrong reason.
    const subjects = strategyRows()
      .map(([rel]) => moveKeyedLiterals(fileFor(rel)?.code ?? '').length)
      .reduce((sum, n) => sum + n, 0);
    expect(subjects, 'the owner arm has no subject anywhere in the tree').toBeGreaterThan(5);
    // …and the DECLARED foreign set is non-empty, so the exactness arm below is a real
    // comparison rather than [] against [].
    const declared = strategyRows().flatMap(([, row]) => Object.keys(foreignTokensOf(row)));
    expect(declared.length, 'no foreign token is declared — the exactness arm is vacuous')
      .toBeGreaterThan(0);
  });

  test('AT MOST ONE MODULE EXPORTS THE CLOSED MOVE VOCABULARY', () => {
    expect(
      filesDeclaringVocabulary(ALL_MOVE_TOKENS),
      'a second module declares the closed move vocabulary as its own array. The collision'
      + ' contract rules that exactly ONE module exports it and that a second volume AMENDS'
      + ' the same leaf rather than minting a rival — import it instead.',
    ).toEqual([VOCABULARY_HOME]);
  });

  test('the leaf is DEPENDENCY-FREE and its two exports agree today', () => {
    const leaf = fileFor(VOCABULARY_HOME);
    expect(leaf, 'the vocabulary leaf vanished').toBeTruthy();
    const imports = [...leaf.src.matchAll(/^\s*import\b[\s\S]*?from\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(
      imports,
      'the shared vocabulary leaf acquired an import. The collision contract requires a'
      + ' DEPENDENCY-FREE leaf, and a dependency on its first day breaks the contract for'
      + ' the volume that has to amend it later.',
    ).toEqual([]);
    // The union equals the emitted totality TODAY. An amending volume's dispatched-but-
    // unemitted moves join the union and NOT the emitted set, or they red the emitter pin.
    expect([...ALL_MOVE_TOKENS]).toEqual([...STRATEGY_MOVES]);
  });

  test('THE BRANCHER REGISTER is exact in both directions', () => {
    const live = branchingModules();
    const registered = Object.keys(MOVE_TOKEN_BRANCHERS).sort();
    const unregistered = live.filter((rel) => !registered.includes(rel));
    expect(
      unregistered,
      'a module branches on a move token and is not in MOVE_TOKEN_BRANCHERS. Register it'
      + ' with a written reason: `strategy` if it really branches on THIS vocabulary (and it'
      + ' then answers to the owner arm below), or `foreign-vocabulary` naming the closed set'
      + ' the word actually belongs to.',
    ).toEqual([]);
    const stale = registered.filter((rel) => !live.includes(rel));
    expect(
      stale,
      'a registered brancher no longer branches on any move token — DELETE its row; the'
      + ' register only shrinks.',
    ).toEqual([]);
    for (const [module, row] of Object.entries(MOVE_TOKEN_BRANCHERS)) {
      expect(['strategy', 'foreign-vocabulary'], `${module} has no recognised kind`).toContain(row.kind);
      expect(row.reason.length, `${module} is registered without a reason`).toBeGreaterThan(40);
      if (row.kind !== 'strategy') {
        expect(
          Object.keys(foreignTokensOf(row)),
          `${module} is foreign-vocabulary and cannot ALSO declare foreign tokens — the whole`
          + ' row is already the declaration',
        ).toEqual([]);
      }
    }
  });

  test('⭐⭐ THE OWNER ARM — every move-keyed literal is a MEMBER or a DECLARED FOREIGN TOKEN', () => {
    const strays = [];
    for (const [module, row] of strategyRows()) {
      const file = fileFor(module);
      expect(file, `${module} vanished — re-aim its register row`).toBeTruthy();
      const declared = foreignTokensOf(row);
      for (const literal of moveKeyedLiterals(file.code)) {
        if (ALL_MOVE_TOKENS.includes(literal)) continue;
        if (Object.prototype.hasOwnProperty.call(declared, literal)) continue;
        strays.push(`${module}: ${literal}`);
      }
    }
    expect(
      strays,
      'a STRATEGY owner branches on a move-shaped token that is neither a member of the'
      + ' frozen vocabulary nor a DECLARED foreign token. Either it belongs in the'
      + ' vocabulary, or it belongs in that row\'s foreignTokens with the vocabulary it'
      + ' really comes from and the live evidence that makes the branch load-bearing.',
    ).toEqual([]);
  });

  test('⭐⭐ THE DECLARED FOREIGN SET EQUALS THE MEASURED FOREIGN SET, EXACT BOTH DIRECTIONS', () => {
    // ⛔ THIS IS THE ARM THE REFUTED DESIGN COULD NOT HAVE HAD. A membership scan can never
    // see a word the vocabulary does not contain, so it goes quiet exactly when a live
    // foreign branch is deleted. This one reds on the deletion, because the declaration
    // outlives the branch and the comparison is exact in the second direction too.
    for (const [module, row] of strategyRows()) {
      const file = fileFor(module);
      const declared = Object.keys(foreignTokensOf(row)).sort();
      const measured = measuredForeign(file.code);
      expect(
        measured,
        `${module}'s DECLARED foreign token set no longer equals the set the source actually`
        + ' branches on. If a declared token vanished, a live branch was DELETED — check that'
        + ' deletion against the evidence address in the row before believing it is dead. If'
        + ' an undeclared one appeared, register it.',
      ).toEqual(declared);
    }
  });

  test('THE EVIDENCE ARM — every declared foreign token names a live address that spells it', () => {
    let checked = 0;
    for (const [module, row] of strategyRows()) {
      for (const [token, entry] of Object.entries(foreignTokensOf(row))) {
        expect(String(entry.vocabulary || '').length, `${module}:${token} names no vocabulary`)
          .toBeGreaterThan(10);
        expect(String(entry.reason || '').length, `${module}:${token} declares no reason`)
          .toBeGreaterThan(60);
        expect(
          existsSync(join(ROOT, entry.evidence)),
          `${module}:${token} cites evidence that does not exist: ${entry.evidence}`,
        ).toBe(true);
        const evidence = readFileSync(join(ROOT, entry.evidence), 'utf8');
        const declaration = evidence.match(new RegExp(`${entry.evidenceSymbol}\\s*=\\s*\\[([^\\]]*)\\]`));
        expect(
          declaration,
          `${module}:${token} names the symbol ${entry.evidenceSymbol}, which is not declared`
          + ` as an array literal in ${entry.evidence}`,
        ).toBeTruthy();
        expect(
          declaration[1],
          `${entry.evidenceSymbol} in ${entry.evidence} no longer spells '${token}'. A lane`
          + ' removing the token from the live consumer must come HERE first: that consumer is'
          + ' what makes the branch load-bearing, and two ratified same-seed goldens record'
          + ' the value it produces.',
        ).toContain(`'${token}'`);
        checked += 1;
      }
    }
    expect(checked, 'the evidence arm checked nothing').toBeGreaterThan(0);
  });

  test('GUARD-THE-GUARD — a planted undeclared token and a planted DELETION each red', () => {
    // Both halves of the cure, run against MUTATED READINGS of the live file rather than
    // against the file itself. Without this the two arms above could be always-empty
    // comparisons and nobody would know until the third deletion attempt landed.
    const row = MOVE_TOKEN_BRANCHERS[OWNER_OF_THE_FOREIGN_TOKEN];
    const file = fileFor(OWNER_OF_THE_FOREIGN_TOKEN);
    const declared = Object.keys(foreignTokensOf(row)).sort();
    expect(declared).toEqual(['fortify']);
    expect(measuredForeign(file.code), 'the live reading no longer matches its declaration')
      .toEqual(declared);

    // HALF ONE — an UNDECLARED foreign token appears.
    const planted = file.code.replace("move === 'defend'", "move === 'raid' || move === 'defend'");
    expect(planted, 'the plant did not change the source — this control proves nothing')
      .not.toBe(file.code);
    const plantedForeign = measuredForeign(planted);
    expect(plantedForeign).toEqual(['fortify', 'raid']);
    expect(plantedForeign.filter((t) => !declared.includes(t))).toEqual(['raid']);

    // HALF TWO — ⛔ THE REFUTED EDIT ITSELF: the registered disjunct is deleted.
    const deleted = file.code.replace("move === 'fortify' || ", '');
    expect(deleted, 'the deletion plant did not change the source').not.toBe(file.code);
    const deletedForeign = measuredForeign(deleted);
    expect(deletedForeign).toEqual([]);
    expect(
      declared.filter((token) => !deletedForeign.includes(token)),
      'the deletion plant left the declared set satisfied — the exactness arm would NOT have'
      + ' caught the refuted edit, and this whole cure would be decoration',
    ).toEqual(['fortify']);
  });
});
