/**
 * strategyMoveVocabulary.walker.test.js — HB-1. THE SINGLE-EXPORTER FENCE AND THE
 * OUTSIDE-THE-EXPORT SCAN.
 *
 * ⭐ ARM 1 IS ANOTHER VOLUME'S STRUCTURAL HALF, LANDED BY THE VOLUME THAT GOT THERE FIRST.
 * The cross-volume collision contract is explicit that *"a source-scan pin that only exists
 * once the later wave builds cannot restrain the volume that builds FIRST … until both
 * artifacts exist the arbitration is a RECOMMENDATION with a fence, not a contract."*
 * MEASURED: no such fence exists anywhere in the tree. So this file ships it — at-most-one
 * module may export the closed move vocabulary — and the chair records that as DISCHARGING
 * the other volume's obligation rather than duplicating it. The inbound half of the
 * contract remains owed by that volume's fold.
 *
 * ── ARM 2: THE PREDICATE THE VOLUME UNDER-SPECIFIED, DEFINED HERE ───────────────
 *
 * The charter asks for "a walker that reds any module branching on a strategy-move token
 * outside the frozen export". ⚠⚠ READ LITERALLY THAT REDS THE TREE ON DAY ONE, and the
 * reason is a measurement rather than an opinion: TEN modules compare a move literal today,
 * and they fall into two kinds a token scan cannot tell apart. FOUR are genuine
 * strategy-move branchers — the chooser itself, the bloc decision load which takes the move
 * key as an argument, the commitment load, and the deploy order. SIX compare a word that
 * belongs to a DIFFERENT closed vocabulary: an engagement posture, a ladder posture, a
 * generosity act and a competition axis all spell a word this vocabulary also holds.
 *
 * ⚠⚠ THAT NARROWS A CLAIM THE COMPILE MADE. It reasoned that once this wave mints the
 * eleven, the cross-vocabulary collision *"becomes impossible because the two vocabularies
 * no longer share a member"*. TRUE of the token this wave deletes and the mobilization
 * vocabulary; FALSE in general — three move words are shared with three other closed
 * vocabularies today, measured. The structural cure is therefore the REGISTER, not the
 * disjointness, and the register is exact in both directions so a new sharer reds.
 *
 * ── ARM 3: THE ARM THE GUARD-THE-GUARD ACTUALLY REDS ────────────────────────────
 *
 * Inside a module the register calls a STRATEGY owner, every literal compared against a
 * move-named identifier must be a MEMBER of the vocabulary. That is what catches a
 * re-inserted dead token: a membership scan over the vocabulary can never see a word the
 * vocabulary does not contain, which is exactly how the deleted disjunct hid in plain sight
 * through two review rounds.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ALL_MOVE_TOKENS,
  STRATEGY_MOVES,
} from '../../src/domain/worldPulse/strategyMoves.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VOCABULARY_HOME = 'src/domain/worldPulse/strategyMoves.js';

/**
 * EVERY MODULE THAT COMPARES A MOVE LITERAL, frozen at its measured membership and exact in
 * both directions. `kind: 'strategy'` means the module really is branching on THIS
 * vocabulary and is therefore held to arm 3; `kind: 'foreign-vocabulary'` means the word it
 * spells belongs to a different closed set that happens to share it.
 */
const MOVE_TOKEN_BRANCHERS = Object.freeze({
  'src/domain/worldPulse/settlementStrategy.js': Object.freeze({
    kind: 'strategy',
    reason: 'the chooser itself — it enumerates, scores and samples the vocabulary, so it is the one module that must branch on every member',
  }),
  'src/domain/worldPulse/settlementPolitics.js': Object.freeze({
    kind: 'strategy',
    reason: 'the ruling-bloc decision load takes the move key as an argument and loads it toward the governing coalition\'s end; it is the site whose dead disjunct this wave deletes',
  }),
  'src/domain/worldPulse/momentum.js': Object.freeze({
    kind: 'strategy',
    reason: 'the commitment load weights a move against a committed course, so it branches on the two moves that advance and reverse one',
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
 * A move-named identifier compared against a string literal — arm 3's subject.
 * ⚠ THE ALTERNATION IS DELIBERATE AND WAS FOUND BY EXECUTION: a single
 * `[A-Za-z_$][\w$]*[Mm]ove` class requires a character BEFORE the word and therefore
 * misses the bare identifier `move`, which is precisely what the owner site spells —
 * the arm measured ZERO subjects until this was corrected. The capitalised half is
 * kept separate so `remove` cannot masquerade as a move-named binding.
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
function branchingModules(code = null) {
  const res = ALL_MOVE_TOKENS.map((word) => new RegExp(`(?:===|!==)\\s*['"\`]${word}['"\`]|['"\`]${word}['"\`]\\s*(?:===|!==)`));
  return SRC_FILES
    .filter(({ rel }) => rel !== VOCABULARY_HOME)
    .filter((file) => res.some((re) => re.test(code ? code(file) : file.code)))
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

describe('HB-1 — one exporter of the move vocabulary, and no branch outside it', () => {
  test('the corpus and both detectors are live (guard the guard)', () => {
    // Absence claims over a scan that stopped matching prove nothing. Each detector is
    // proven on a subject that is genuinely non-empty before any emptiness is asserted.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    expect(filesDeclaringVocabulary(ALL_MOVE_TOKENS)).toContain(VOCABULARY_HOME);
    expect(branchingModules().length).toBeGreaterThan(5);
    expect(ALL_MOVE_TOKENS.length).toBeGreaterThan(5);
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
    const leaf = SRC_FILES.find(({ rel }) => rel === VOCABULARY_HOME);
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
      + ' then answers to the membership arm below), or `foreign-vocabulary` naming the'
      + ' closed set the word actually belongs to.',
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
    }
  });

  test('inside a STRATEGY owner, every move-keyed literal is a MEMBER of the vocabulary', () => {
    const strays = [];
    for (const [module, row] of Object.entries(MOVE_TOKEN_BRANCHERS)) {
      if (row.kind !== 'strategy') continue;
      const file = SRC_FILES.find(({ rel }) => rel === module);
      expect(file, `${module} vanished — re-aim its register row`).toBeTruthy();
      for (const literal of moveKeyedLiterals(file.code)) {
        if (!ALL_MOVE_TOKENS.includes(literal)) strays.push(`${module}: ${literal}`);
      }
    }
    expect(
      strays,
      'a STRATEGY owner branches on a move-shaped token the frozen vocabulary does not'
      + ' contain. That is the cross-vocabulary collision this wave exists to close: a'
      + ' membership scan over the vocabulary can never see a word the vocabulary lacks,'
      + ' which is exactly how the deleted token survived two review rounds.',
    ).toEqual([]);
  });

  test('GUARD-THE-GUARD: a planted re-insertion of the deleted token REDS the owner arm', () => {
    // The predicate under test, run against a MUTATED reading of the live file rather than
    // against the file itself. Without this the arm above could be an always-empty
    // comparison and nobody would know until a dead token came back.
    const owner = 'src/domain/worldPulse/settlementPolitics.js';
    const file = SRC_FILES.find(({ rel }) => rel === owner);
    const live = moveKeyedLiterals(file.code);
    expect(live.length, 'the owner arm has no subject on the live file').toBeGreaterThan(0);
    for (const literal of live) expect(ALL_MOVE_TOKENS).toContain(literal);
    const planted = moveKeyedLiterals(file.code.replace(
      "move === 'defend'", "move === 'fortify' || move === 'defend'",
    ));
    const strays = planted.filter((literal) => !ALL_MOVE_TOKENS.includes(literal));
    expect(strays, 'the plant did not change the reading — this control proves nothing').toHaveLength(1);
    expect(planted.length).toBeGreaterThan(live.length);
  });
});
