#!/usr/bin/env node
/**
 * register-preflight.mjs — WHICH FROZEN REGISTERS THIS CONSIST DISTURBS, ANSWERED IN SECONDS.
 *
 * ⭐ WHY THIS EXISTS, MEASURED. On the night of 2026-09-02 the §885 consist spent a full
 * 1,001-second gate (run 2, 23:12:37 -> 23:29:18) discovering that it had moved the lighting
 * census and nobody had refrozen it. Every fact needed to predict that was sitting in the diff
 * the whole time. This script reads that diff. Measured against that same consist it returns the
 * same finding in 0.9 seconds.
 *
 * ⭐ THE LAW OF THIS INSTRUMENT: SAY NOTHING YOU HAVE NOT MEASURED. A pre-flight that guesses is
 * worse than no pre-flight, because a wrong "you're clear" is spent as a real gate. So every line
 * it prints is one of exactly three kinds, and they are labelled:
 *
 *   CERTAIN   — arithmetic on the git objects: a file count, or a byte-identical input set.
 *   UNKNOWN   — the figure needs the grammar or the runner. It prints "UNKNOWN — requires the
 *               suite" and the EVIDENCE (which inputs changed), never a prediction.
 *   UNSOUND   — the script's own derivation failed its self-check at the base, so it REFUSES to
 *               make the certain claim it would otherwise have made.
 *
 * ⭐ THE SELF-CHECK IS NOT DECORATION. Before claiming "files goes 2503 -> 2504" the script
 * re-derives the BASE figure and compares it to the BASE register's own frozen value. If those
 * disagree, its model of the register is wrong and every downstream claim is void — so it says so
 * and downgrades to UNKNOWN. "Confirm it, never assume it."
 *
 * ⭐ INPUT GROUPS, BECAUSE ONE REGISTER CAN HAVE TWO DIFFERENT INPUTS. The test ratchet's counts
 * are a function of the test corpus, but its `entries` are a per-test FAILURE census and so take
 * THE WHOLE REPO as input. A version of this script that declared only the test corpus would have
 * called a src-only consist CLEAR for the ratchet, which is a FALSE GREEN — the one output class
 * this instrument may never produce. So a register declares one group per input set, and CLEAR
 * requires every one of them to be byte-identical.
 *
 * ⭐ THE THIRD QUESTION, WHICH IS THE ONE THAT ACTUALLY BITES. "Was it refrozen?" is not enough.
 * A register refrozen at commit 4 of a 6-commit consist is stale if commit 5 touched its inputs.
 * So for a refrozen register the script compares the input digest AT THE REGISTER'S OWN
 * `measuredAtSha` against the digest AT THE TIP, and reports NOT PROVABLY CURRENT when they
 * differ. That is a certain statement: the tuple was measured on a different tree.
 *
 * ⭐ TWO SEVERITIES, AND THE SPLIT IS DELIBERATE. An instrument that exits red on a tree which
 * then gates GREEN teaches lanes to ignore it, and an ignored instrument is worse than none — so
 * "not refrozen at all" and "refrozen slightly early" do NOT share an exit code:
 *
 *   BLOCKER (exit 1) — the inputs moved and the register was never refrozen. This is the §885
 *                      run-2 shape, and it cost 1,001 seconds to discover.
 *   CAUTION (exit 4) — the register WAS refrozen, but an input changed after the tuple was
 *                      measured. The tuple may still be right; it is simply not PROVEN right by
 *                      this tree. The script prints the trailing diff as measured evidence so the
 *                      call takes seconds rather than a suite. (Measured: this fired at the §885
 *                      tip 2d5112851 over a one-line timeout argument, and that gate was green —
 *                      a caution, correctly, and not a red.)
 *
 * Usage:
 *   node scripts/register-preflight.mjs <base> [tip]      # tip defaults to HEAD
 *
 * Exit: 0 = nothing owed. 1 = BLOCKER. 4 = CAUTION only. 2 = the pre-flight is unsound and
 *       refused to judge.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function git(args) {
  return execFileSync('git', ['-C', ROOT, ...args], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
}

/** Every blob in a revision, as [{ path, sha }]. One process for the whole tree. */
function treeBlobs(rev) {
  const rows = [];
  for (const rec of git(['ls-tree', '-r', '-z', rev]).split('\0')) {
    if (rec === '') continue;
    const tab = rec.indexOf('\t'); // "<mode> <type> <sha>\t<path>"
    if (tab < 0) continue;
    const meta = rec.slice(0, tab).split(/\s+/);
    if (meta[1] !== 'blob') continue;
    rows.push({ path: rec.slice(tab + 1), sha: meta[2] });
  }
  return rows;
}

function readJsonAt(rev, path) {
  try {
    return JSON.parse(git(['show', `${rev}:${path}`]));
  } catch {
    return null;
  }
}

function revExists(rev) {
  try {
    git(['rev-parse', '--verify', '--quiet', `${rev}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function shortSha(rev) {
  try {
    return git(['rev-parse', '--short', rev]).trim();
  } catch {
    return rev;
  }
}

const isTestFile = (p) => /^tests\/.+\.test\.(js|jsx)$/.test(p);

const REGISTER_PATHS = new Set([
  'tests/lint/.lighting-census-baseline.json',
  'scripts/.test-ratchet-baseline.json',
]);

/**
 * THE REGISTER ROSTER.
 *
 * ⚠ THIS TABLE DECLARES INPUTS; IT IS NOT THE LIST OF REGISTERS. The list is DISCOVERED from the
 * tree every run (see discoverRegisters). A register present in the tree but absent from this
 * table is still reported — as INPUTS UNDECLARED — so a register added after this script was
 * written can never be silently invisible. It can only be loudly unanalysed.
 */
const DECLARED = [
  {
    path: 'tests/lint/.lighting-census-baseline.json',
    name: 'LIGHTING CENSUS',
    refreeze:
      "LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js",
    groups: [
      {
        key: 'the five figures',
        hard: true,
        desc: 'tests/**/*.test.{js,jsx} — and NOTHING else',
        why:
          "verified at f5a6c3bbf: measureCensus() in the walker reads only TEST_FILES, and "
          + 'parkReasonsFor(src) / liveTitlesIn(src) / liveSuiteTitlesIn(src) each take a file body '
          + 'and nothing more. The walker is itself a .test.js file, so a change to the grammar is '
          + 'a change to this input set.',
        isInput: isTestFile,
        exact: [{ key: 'files', how: 'count of tests/**/*.test.{js,jsx}', derive: (paths) => paths.length }],
        unknown: {
          parked: 'needs the espree grammar in sovereigntyLightingContract.walker.test.js',
          credited: 'needs the espree grammar in sovereigntyLightingContract.walker.test.js',
          titles: 'needs the espree grammar — a title counts only if its opener resolves',
          suiteTitles: 'needs the espree grammar — same resolution rules as titles',
        },
      },
    ],
  },
  {
    path: 'scripts/.test-ratchet-baseline.json',
    name: 'TEST RATCHET',
    refreeze: 'sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update',
    groups: [
      {
        key: 'the counts',
        hard: true,
        desc: 'tests/**/*.test.{js,jsx} except tests/build/**',
        why: "the baseline's own _doc scopes the source phase to all tests except tests/build/**",
        isInput: (p) => isTestFile(p) && !p.startsWith('tests/build/'),
        exact: [
          {
            key: 'totalFiles',
            how: 'count of tests/**/*.test.{js,jsx} outside tests/build/**',
            derive: (paths) => paths.length,
          },
        ],
        unknown: { totalTests: 'needs collection — the runner must enumerate every registered test' },
      },
      {
        key: 'the failure census and the magnitudes',
        // ⭐ SOFT. This input moves on virtually every consist that touches src, and the register
        // moves only if a test's PASS/FAIL actually changed — which nothing cheap can predict. A
        // BLOCKER here would fire on almost every landing and teach lanes to ignore the whole
        // instrument. So it is reported as UNKNOWN and carries no severity of its own. What it
        // does buy is the refusal to call such a consist CLEAR, which would be a false green.
        hard: false,
        desc: 'THE WHOLE REPO',
        why:
          '`entries` records which tests FAIL and at what magnitude, so a src-only consist can move '
          + 'this register with no test file touched at all. Declaring only the test corpus here '
          + 'would produce a FALSE CLEAR.',
        isInput: (p) => !REGISTER_PATHS.has(p),
        exact: [],
        unknown: {
          entries: 'needs execution — it is a census of which tests fail',
          skippedCeiling: 'needs execution',
        },
      },
    ],
  },
];

/** Every plausible register in the tree, discovered — never hand-listed. */
function discoverRegisters(blobs) {
  return blobs
    .map((b) => b.path)
    .filter((p) => /(^|\/)\.?[^/]*baseline[^/]*\.json$/i.test(p))
    .filter((p) => p.startsWith('scripts/') || p.startsWith('tests/'))
    .sort();
}

function digestOf(rows) {
  const h = createHash('sha256');
  for (const r of rows) h.update(`${r.path}\0${r.sha}\n`);
  return h.digest('hex').slice(0, 16);
}

function pad(s, n) {
  const t = String(s);
  return t.length >= n ? t : t + ' '.repeat(n - t.length);
}

/** A test-opener word standing as its own token. */
const OPENER_TOKEN = /\b(it|test|describe|suite)\b/;

/**
 * ⚠ A MEASUREMENT OF THE DIFF, NEVER A PREDICTION OF THE TUPLE. It counts how many changed lines
 * so much as MENTION a test-opener word. Zero such lines does NOT prove the census is unmoved —
 * the walker resolves bindings, options bags and table cardinality, none of which this counter
 * understands. It exists so a reader can spend two seconds instead of a suite deciding whether a
 * trailing edit is worth re-measuring for.
 */
function trailingEvidence(fromRev, toRev, paths) {
  const rows = [];
  for (const p of paths.slice(0, 12)) {
    let numstat;
    let diff;
    try {
      numstat = git(['diff', '--numstat', fromRev, toRev, '--', p]).trim();
      diff = git(['diff', '-U0', fromRev, toRev, '--', p]);
    } catch {
      rows.push({ path: p, note: 'diff unavailable' });
      continue;
    }
    const changed = diff
      .split('\n')
      .filter((l) => (l.startsWith('+') || l.startsWith('-')) && !/^(\+\+\+|---)/.test(l));
    const withOpener = changed.filter((l) => OPENER_TOKEN.test(l.slice(1)));
    const cols = numstat.split('\t');
    rows.push({
      path: p,
      add: cols[0] ?? '?',
      del: cols[1] ?? '?',
      changed: changed.length,
      withOpener: withOpener.length,
      sample: withOpener.slice(0, 3),
    });
  }
  return rows;
}

function analyseGroup(group, reg, ctx) {
  const { base, tip, baseBlobs, tipBlobs } = ctx;
  const baseIn = baseBlobs.filter((b) => group.isInput(b.path));
  const tipIn = tipBlobs.filter((b) => group.isInput(b.path));
  const baseDigest = digestOf(baseIn);
  const tipDigest = digestOf(tipIn);

  const basePins = new Map(baseIn.map((b) => [b.path, b.sha]));
  const tipPins = new Map(tipIn.map((b) => [b.path, b.sha]));
  const added = tipIn.filter((b) => !basePins.has(b.path)).map((b) => b.path);
  const removed = baseIn.filter((b) => !tipPins.has(b.path)).map((b) => b.path);
  const modified = tipIn
    .filter((b) => basePins.has(b.path) && basePins.get(b.path) !== b.sha)
    .map((b) => b.path);

  const baseReg = readJsonAt(base, reg.path);
  const tipReg = readJsonAt(tip, reg.path);
  const exact = group.exact.map((f) => {
    const baseDerived = f.derive(baseIn.map((b) => b.path));
    const tipDerived = f.derive(tipIn.map((b) => b.path));
    const baseFrozen = baseReg ? baseReg[f.key] : undefined;
    const row = {
      ...f,
      baseDerived,
      tipDerived,
      baseFrozen,
      tipFrozen: tipReg ? tipReg[f.key] : undefined,
      sound: typeof baseFrozen === 'number' && baseFrozen === baseDerived,
      baseStale: false,
    };
    // ⭐ A MISMATCH AT THE BASE HAS TWO CAUSES AND THEY ARE NOT THE SAME FINDING. Either this
    // script's model of the figure is wrong, or the BASE's own register is stale — which is the
    // ordinary condition of any mid-consist commit. Conflating them would let a stale base
    // silence the whole instrument. The discriminator is cheap and certain: re-derive at the
    // register's OWN measuredAtSha. If the figure reproduces there, the model is sound and the
    // base is simply stale — and that staleness is itself worth saying out loud, because the
    // consist inherits the owed refreeze. (Measured at dbe469084: files derives 2497, the
    // register froze 2495, and 2495 reproduces exactly at its measuredAtSha 1c7981bb9.)
    if (!row.sound && baseReg && typeof baseReg.measuredAtSha === 'string' && revExists(baseReg.measuredAtSha)) {
      const atM = f.derive(treeBlobs(baseReg.measuredAtSha).filter((b) => group.isInput(b.path)).map((b) => b.path));
      if (atM === baseFrozen) {
        row.sound = true;
        row.baseStale = true;
        row.measuredAtSha = baseReg.measuredAtSha;
      }
    }
    return row;
  });

  return {
    group,
    unchanged: baseDigest === tipDigest,
    baseDigest,
    tipDigest,
    added,
    removed,
    modified,
    exact,
    tipIn,
  };
}

function analyseRegister(reg, ctx) {
  const { base, tip, touched } = ctx;
  const groups = reg.groups.map((g) => analyseGroup(g, reg, ctx));
  const tipReg = readJsonAt(tip, reg.path);
  const baseReg = readJsonAt(base, reg.path);
  const refrozen = touched.has(reg.path);
  const allUnchanged = groups.every((g) => g.unchanged);

  // ── refreeze currency, over the UNION of every group's inputs ──
  let currency = null;
  const hardChanged = groups.some((g) => g.group.hard && !g.unchanged);
  if (refrozen && hardChanged) {
    const m = tipReg && typeof tipReg.measuredAtSha === 'string' ? tipReg.measuredAtSha : null;
    if (m === null) {
      currency = { state: 'UNVERIFIABLE', detail: 'the refrozen register carries no measuredAtSha' };
    } else if (!revExists(m)) {
      currency = { state: 'UNVERIFIABLE', detail: `measuredAtSha ${shortSha(m)} is not a commit in this repo` };
    } else {
      const mBlobs = treeBlobs(m);
      const inUnion = (p) => reg.groups.some((g) => g.hard && g.isInput(p));
      const mIn = mBlobs.filter((b) => inUnion(b.path));
      const tIn = ctx.tipBlobs.filter((b) => inUnion(b.path));
      if (digestOf(mIn) === digestOf(tIn)) {
        currency = {
          state: 'CURRENT',
          detail: `the DERIVING inputs at measuredAtSha ${shortSha(m)} are byte-identical to the tip's`,
        };
      } else {
        const mPins = new Map(mIn.map((b) => [b.path, b.sha]));
        const tPins = new Map(tIn.map((b) => [b.path, b.sha]));
        const since = tIn
          .filter((b) => !mPins.has(b.path) || mPins.get(b.path) !== b.sha)
          .map((b) => b.path)
          .concat(mIn.filter((b) => !tPins.has(b.path)).map((b) => `${b.path} (deleted)`));
        currency = {
          state: 'NOT PROVABLY CURRENT',
          detail: `inputs changed after measuredAtSha ${shortSha(m)}`,
          since,
          evidence: trailingEvidence(m, tip, since.filter((s) => !s.endsWith(' (deleted)'))),
        };
      }
    }
  }

  return { reg, groups, refrozen, allUnchanged, currency, baseReg, tipReg };
}

/**
 * severity: 0 nothing owed, 1 caution, 2 blocker.
 *
 * Only a HARD group — one whose input the register's frozen figures are actually derived from —
 * can raise a blocker. A soft group changing means "UNKNOWN, requires the suite", which is the
 * ordinary condition of nearly every consist and must never be dressed up as a red.
 */
function verdictOf(a) {
  const unsound = a.groups.some((g) => g.exact.some((e) => !e.sound));
  const inheritedStale = a.groups.some((g) => g.exact.some((e) => e.baseStale));
  if (a.allUnchanged) return { code: 'CLEAR', severity: 0, unsound, inheritedStale };

  const hardChanged = a.groups.filter((g) => g.group.hard && !g.unchanged);
  if (hardChanged.length === 0) {
    return {
      code: 'UNKNOWN — requires the suite (only whole-repo inputs moved)',
      severity: 0,
      unsound,
      inheritedStale,
    };
  }
  const moves = hardChanged.some((g) => g.exact.some((e) => e.sound && e.baseDerived !== e.tipDerived));
  const head = moves ? 'WILL MOVE' : 'MAY MOVE';
  const wrongFigure = a.refrozen
    && a.groups.some((g) =>
      g.exact.some((e) => e.sound && typeof e.tipFrozen === 'number' && e.tipFrozen !== e.tipDerived));
  if (wrongFigure) return { code: `${head} — REFROZEN WITH A WRONG FIGURE`, severity: 2, unsound, inheritedStale };
  if (!a.refrozen) return { code: `${head} — NOT REFROZEN`, severity: 2, unsound, inheritedStale };
  if (a.currency && a.currency.state === 'CURRENT') {
    return { code: `${head} — REFROZEN, CURRENT`, severity: 0, unsound, inheritedStale };
  }
  return {
    code: `${head} — REFROZEN BUT ${a.currency ? a.currency.state : 'UNVERIFIABLE'}`,
    severity: 1,
    unsound,
    inheritedStale,
  };
}

const SEVERITY_LABEL = Object.freeze(['OK', 'CAUTION', 'BLOCKER']);

function printGroup(g) {
  console.log(`   ▸ ${g.group.key.toUpperCase()} [${g.group.hard ? 'DERIVING' : 'INFLUENCING'}] — inputs: ${g.group.desc}`);
  console.log(`     (${g.group.why})`);
  if (g.unchanged) {
    console.log(`     CERTAIN: this input set is BYTE-IDENTICAL at base and tip (digest ${g.baseDigest}).`);
    console.log('              Every figure in this group CANNOT move. Nothing is owed for it.');
  } else {
    console.log(
      `     CERTAIN: this input set CHANGED (${g.baseDigest} -> ${g.tipDigest}): `
        + `+${g.added.length} added, -${g.removed.length} removed, ~${g.modified.length} modified.`,
    );
    for (const p of g.added.slice(0, 10)) console.log(`              + ${p}`);
    for (const p of g.removed.slice(0, 10)) console.log(`              - ${p}`);
    for (const p of g.modified.slice(0, 10)) console.log(`              ~ ${p}`);
    const extra = g.added.length + g.removed.length + g.modified.length - 30;
    if (extra > 0) console.log(`              ... and ${extra} more`);
  }
  for (const e of g.exact) {
    if (!e.sound) {
      console.log(
        `     ⛔ UNSOUND: this script derives ${e.key}=${e.baseDerived} at the base but the base `
          + `register froze ${JSON.stringify(e.baseFrozen)}. Its model of ${e.key} is WRONG, so it `
          + 'makes NO claim about it.',
      );
      continue;
    }
    const moved = e.baseDerived !== e.tipDerived;
    const check = e.baseStale
      ? `self-check passed AT measuredAtSha ${shortSha(e.measuredAtSha)}`
      : 'base self-check PASSED';
    console.log(
      `     CERTAIN: ${e.key} ${e.baseDerived} -> ${e.tipDerived}${moved ? '  ⇐ MOVES' : '  (unmoved)'}`
        + `   [${e.how}; ${check}]`,
    );
    if (e.baseStale) {
      console.log(
        `     ⚠ CERTAIN: THE BASE'S OWN REGISTER IS ALREADY STALE — it froze ${e.key}=${e.baseFrozen}, `
          + `measured at ${shortSha(e.measuredAtSha)}, but the BASE tree derives ${e.baseDerived}. `
          + 'This consist inherits an owed refreeze that it did not create.',
      );
    }
    if (typeof e.tipFrozen === 'number' && e.tipFrozen !== e.tipDerived) {
      console.log(
        `     ⛔ CERTAIN: the register at the tip says ${e.key}=${e.tipFrozen} but the tip's tree `
          + `derives ${e.tipDerived}. That figure is WRONG for this tip.`,
      );
    }
  }
  for (const [k, why] of Object.entries(g.group.unknown)) {
    const verdict = g.unchanged ? 'CERTAIN — cannot move (input byte-identical)' : 'UNKNOWN — requires the suite';

    console.log(`     ${pad(k, 14)} ${verdict}  (${why})`);
  }
}

function main() {
  const argv = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (argv.length < 1) {
    console.error('usage: node scripts/register-preflight.mjs <base> [tip]');
    return 2;
  }
  const base = argv[0];
  const tip = argv[1] ?? 'HEAD';
  for (const r of [base, tip]) {
    if (!revExists(r)) {
      console.error(`[preflight] "${r}" is not a commit in this repo — refusing to judge.`);
      return 2;
    }
  }

  const baseBlobs = treeBlobs(base);
  const tipBlobs = treeBlobs(tip);
  const touched = new Set(git(['diff', '--name-only', '-z', base, tip]).split('\0').filter((s) => s !== ''));

  console.log('[preflight] REGISTER PRE-FLIGHT');
  console.log(`  base ${shortSha(base)}  ${git(['log', '-1', '--format=%s', base]).trim().slice(0, 76)}`);
  console.log(`  tip  ${shortSha(tip)}  ${git(['log', '-1', '--format=%s', tip]).trim().slice(0, 76)}`);
  console.log(
    `  consist: ${git(['rev-list', '--count', `${base}..${tip}`]).trim()} commit(s), `
      + `${touched.size} path(s) changed`,
  );
  console.log('');

  const ctx = { base, tip, baseBlobs, tipBlobs, touched };
  const judged = DECLARED.map((reg) => {
    const a = analyseRegister(reg, ctx);
    return { a, v: verdictOf(a) };
  });

  for (const { a, v } of judged) {
    console.log(`── ${a.reg.name}  (${a.reg.path})`);
    for (const g of a.groups) printGroup(g);
    console.log(`   REFROZEN IN THIS CONSIST: ${a.refrozen ? 'YES' : 'NO'}`);
    if (a.currency) {
      console.log(`   REFREEZE CURRENCY: ${a.currency.state} — ${a.currency.detail}`);
      for (const p of (a.currency.since ?? []).slice(0, 12)) console.log(`      changed since: ${p}`);
      for (const e of a.currency.evidence ?? []) {
        if (e.note) {
          console.log(`      EVIDENCE ${e.path}: ${e.note}`);
          continue;
        }
        console.log(
          `      EVIDENCE ${e.path}: +${e.add}/-${e.del}, ${e.withOpener} of ${e.changed} changed `
            + 'line(s) mention a test-opener word (a measurement of the diff, NOT of the tuple)',
        );
        for (const s of e.sample) console.log(`         ${s.trim().slice(0, 96)}`);
      }
    }
    if (v.severity > 0) console.log(`   ⛔ REFREEZE COMMAND: ${a.reg.refreeze}`);
    console.log(`   VERDICT: [${SEVERITY_LABEL[v.severity]}] ${v.code}`);
    console.log('');
  }

  const declaredPaths = new Set(DECLARED.map((d) => d.path));
  const others = discoverRegisters(tipBlobs).filter((p) => !declaredPaths.has(p));
  const othersTouched = others.filter((p) => touched.has(p));
  console.log(`── OTHER REGISTERS DISCOVERED IN THE TREE: ${others.length} (inputs UNDECLARED here)`);
  console.log(`   touched by this consist: ${othersTouched.length}`);
  for (const p of othersTouched) console.log(`      ~ ${p}`);
  console.log('   Each is UNKNOWN — requires the suite. They are listed so that a register added');
  console.log('   after this script was written is loudly unanalysed, never silently invisible.');
  console.log('');

  const blockers = judged.filter((x) => x.v.severity === 2);
  const cautions = judged.filter((x) => x.v.severity === 1);
  console.log('══════ PRE-FLIGHT VERDICT ══════');
  for (const x of judged) {
    console.log(`  ${pad(SEVERITY_LABEL[x.v.severity], 9)}${pad(x.a.reg.name, 18)}${x.v.code}`);
  }
  console.log('');
  if (judged.some((x) => x.v.unsound)) {
    console.log('[preflight] ⛔ UNSOUND: a derivation failed its base self-check. Fix this script');
    console.log('            before trusting any figure above. Exiting 2.');
    return 2;
  }
  if (blockers.length > 0) {
    console.log(
      `[preflight] ⛔ BLOCKER — ${blockers.length} REGISTER(S) OWE A REFREEZE BEFORE YOU GATE: `
        + `${blockers.map((x) => x.a.reg.name).join(', ')}.`,
    );
    console.log('            Their inputs moved and nothing in this consist refroze them.');
    console.log('            Gating now spends a full suite to be told exactly this.');
  }
  if (cautions.length > 0) {
    console.log(
      `[preflight] ⚠ CAUTION — ${cautions.length} REGISTER(S) WERE REFROZEN, BUT NOT ON THIS TREE: `
        + `${cautions.map((x) => x.a.reg.name).join(', ')}.`,
    );
    console.log('            The tuple may well still be right; it is not PROVEN right by this tip.');
    console.log('            Read the EVIDENCE above and decide, or re-measure. This is not a red.');
  }
  if (judged.some((x) => x.v.inheritedStale)) {
    console.log('[preflight] ⚠ THE BASE ITSELF CARRIES A STALE REGISTER (see the ⚠ CERTAIN line above).');
    console.log('            That refreeze is owed by this consist even though it did not cause it.');
  }
  if (blockers.length === 0 && cautions.length === 0) {
    console.log('[preflight] NOTHING OWED on the declared registers. Every UNKNOWN above is still');
    console.log('            unknown — this is not a green, it is the absence of a KNOWN red.');
    return 0;
  }
  return blockers.length > 0 ? 1 : 4;
}

process.exit(main());
