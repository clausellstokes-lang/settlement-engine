#!/bin/sh
# census.sh — FLIP-CENSUS (B), U8: THE FLIP'S CENSUS (builder BFL, SEAT-7's lane, 2026-11-20; brief ../briefs/FLIP-CENSUS.md,
# amended by the chair's 20:14Z rule (SEAT-7 hand-back item 73) and SEAT-7's 20:52Z ruling). A MEASURE ONLY: the flip lives
# in <flip>, a detached scratch worktree of the cut, never committed.
#
#   sh census.sh all <cut> <flip> <dark> <out> [<N>]         every step below, in order (the one command)
#   sh census.sh run <cut> <flip> <out>                        1-3: the flipped copy, the ledger ref, the whole-suite run
#   sh census.sh sets <flip> <out>                             the census set (below), written to <out>/phase-1.txt
#   sh census.sh shard <phase> <k> <N> <flip> <out>            3b: flipped, shard k of N of the phase set minus what the run finished
#   sh census.sh control <phase> <k> <N> <cut> <dark> <out>    4: unflipped, shard k of N of the WHOLE phase set
#   sh census.sh lists <out>                                   5: the four lists (re-made from <out> alone)
#
#   1. <flip>: a detached worktree of <cut> (made and `npm ci`-ed if absent), carrying EXACTLY the two dials:
#      seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION; seatCircumstances.js :: SEAT_CONTEST_LIT = true
#      (SEAT_CIRCUMSTANCE_TUNING untouched). Its diff against the cut must be those two lines, or the run stops.
#   2. the ledger ref some walkers read, fetched in the copy.
#   3. the whole-suite run on the flipped copy, through the gate mutex (both exports inline, the shared tier,
#      --maxWorkers=2), to ONE log (<out>/census-run.log; read by its count lines through scripts/gate-tail.sh), plus
#      Vitest's JSON report (<out>/census-results.json) when the run ends of itself. On 2026-11-20 the harness's 2-hour
#      ceiling on a background task ended it (SEAT-7, 20:52Z: never a relaunch); the files it finished are read from
#      its log (a file line "✓|❯|× <file> (n tests[ | m failed][ | s skipped])" and its "×" test lines).
#   3b. THE CENSUS SHRINKS (the chair, 21:27Z; SEAT-7 21:44Z and 21:47Z, reading (ii)): the flipped copy runs on ONLY
#      the BIRTH-REACHING FILES (a test file, by `vitest list --filesOnly`, whose text names `birthConfig`,
#      `settlementGenerateAction` or `composeInstantWorld`: 505 by text grep at the cut, beside the chair's 516) plus
#      `tests/generators`, `tests/data` and `tests/domain/seat` whole: 793 files at the cut (the "phase 1" set; no
#      phase 2 is run), minus what the run finished, in shards (`vitest run --shard=<k>/<N>`), one at a time, each its
#      own task and log under the ceiling, through the mutex. The birth-reaching files live in BIRTH_DIRS (below, the
#      record the chair asked for; `sets` stops if the computed list differs). What the census does not reach is the
#      chair's flipped whole run on the joined tree at the close.
#   4. THE CONTROL shrinks the same way (no whole test:ratchet): the SAME 793 files, unflipped, on <dark> (the lane
#      checkout of the cut: its src/ and tests/ equal the cut's, nothing untracked), in shards, through the mutex.
#   5. the lists: (1) PINS OF THE DARK DEFAULT (SEAT-6-TO-LIGHT §2's ten, and its two conditional); every other red the
#      control names as failing -> (4) RED WITHOUT THE FLIP (KNOWN); the rest -> (2) BORN FIXTURES THAT MOVE where the
#      reading (the BORN map below, by file) names the pin's kind, else (3) ANYTHING ELSE. A red of the run in a file
#      outside the census set has no control: it is listed apart, unclassified (or in (1) when it is one of the twelve).
# Exit: 0 done, 2 a failure.
set -eu
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY GIT_PREFIX; do
  eval "x=\${$v:-}"; [ -z "$x" ] || { echo "$v is set; unset it first" >&2; exit 2; }
done
HERE=$(cd "$(dirname "$0")" && pwd)
LOCK=/tmp/settlementforge-vitest-gate.lock
usage() { sed -n '6,12p' "$0" >&2; exit 2; }

do_run() { # <cut> <flip> <out>
  CUT=$1; FLIP=$2; OUT=$3; mkdir -p "$OUT/gt"
  if [ ! -d "$FLIP" ]; then git worktree add --detach "$FLIP" "$CUT"; (cd "$FLIP" && npm ci > "$OUT/npm-ci.log" 2>&1); fi
  sed -i 's/^export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;$/export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;/' "$FLIP/src/domain/seat/seatLaw.js"
  sed -i 's/^export const SEAT_CONTEST_LIT = false;$/export const SEAT_CONTEST_LIT = true;/' "$FLIP/src/domain/seat/seatCircumstances.js"
  git -C "$FLIP" diff "$CUT" > "$OUT/flip.diff"
  [ "$(git -C "$FLIP" diff --numstat "$CUT" | tr '\t' ' ')" = "1 1 src/domain/seat/seatCircumstances.js
1 1 src/domain/seat/seatLaw.js" ] || { echo "the flipped copy's diff against $CUT is not the two dials" >&2; exit 2; }
  git -C "$FLIP" fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08
  set +e
  (cd "$FLIP" && TMPDIR="$OUT/gt" sh scripts/gate-tail.sh -n 60 env TMPDIR=/tmp GATE_MUTEX_LOCK_DIR=$LOCK GATE_MUTEX_TIER=shared \
    GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 \
    --reporter=default --reporter=json --outputFile.json="$OUT/census-results.json") > "$OUT/census-tail.txt" 2>&1
  echo "exit $?" >> "$OUT/census-tail.txt"
  set -e
  cp "$(ls -t "$OUT"/gt/gate-tail.*.log | head -n 1)" "$OUT/census-run.log"
}

BIRTH_DIRS='["tests/build","tests/components","tests/data","tests/domain","tests/domain/crisis","tests/domain/display","tests/domain/dossier","tests/domain/facts","tests/domain/people","tests/domain/summary","tests/domain/worldPulse","tests/foundry","tests/generators","tests/generators/people","tests/generators/power","tests/lib","tests/lib/instantWorld","tests/lint","tests/pdf","tests/store","tests/ui"]'

do_sets() { # <flip> <out>
  FLIP=$1; OUT=$2
  [ -f "$OUT/census-run.log" ] || { echo "no $OUT/census-run.log" >&2; exit 2; }
  (cd "$FLIP" && npx vitest list --filesOnly --json="$OUT/all-files.json" > "$OUT/list.log" 2>&1)
  BIRTH_DIRS=$BIRTH_DIRS node --input-type=module - "$OUT" "$FLIP" <<'EOF'
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
const [OUT, FLIP] = process.argv.slice(2);
const all = JSON.parse(readFileSync(join(OUT, 'all-files.json'), 'utf8')).map((x) => relative(FLIP, x.file || x)).sort();
const birth = new Set(all.filter((f) => /birthConfig|settlementGenerateAction|composeInstantWorld/.test(readFileSync(join(FLIP, f), 'utf8'))));
const dirs = [...new Set([...birth].map((f) => dirname(f)))].sort();
if (JSON.stringify(dirs) !== process.env.BIRTH_DIRS) { console.error(`census: the birth directories are now ${JSON.stringify(dirs)}, not BIRTH_DIRS`); process.exit(2); }
const NAMED = ['tests/generators', 'tests/data', 'tests/domain/seat'];
const named = (f) => NAMED.some((d) => f.startsWith(`${d}/`));
const phase1 = all.filter((f) => birth.has(f) || named(f));
writeFileSync(join(OUT, 'phase-1.txt'), `${phase1.join('\n')}\n`);
const done = new Set([...readFileSync(join(OUT, 'census-run.log'), 'utf8').matchAll(/^ [✓❯×] (\S+) \(\d+ tests?/gm)].map((m) => m[1]));
console.log(`files listed ${all.length} · birth-reaching ${birth.size} in ${dirs.length} directories · finished in the run ${done.size}`);
console.log(`the census set ${phase1.length} (finished in the run ${phase1.filter((f) => done.has(f)).length}; to run flipped ${phase1.filter((f) => !done.has(f)).length}) · outside it ${all.length - phase1.length}`);
EOF
}

# shard_run <tree> <tag> <k> <N> <file list> <out>: one shard, through the mutex, to its own log and JSON
shard_run() {
  TREE=$1; TAG=$2; K=$3; N=$4; LIST=$5; OUT=$6
  set +e
  T0=$(date +%s)
  # shellcheck disable=SC2046
  (cd "$TREE" && TMPDIR="$OUT/gt" sh scripts/gate-tail.sh -n 40 env TMPDIR=/tmp GATE_MUTEX_LOCK_DIR=$LOCK GATE_MUTEX_TIER=shared \
    GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 --shard="$K/$N" \
    --reporter=default --reporter=json --outputFile.json="$OUT/$TAG-$K-of-$N.json" $(cat "$LIST")) > "$OUT/$TAG-$K-of-$N.tail.txt" 2>&1
  echo "exit $? · wall $(( ($(date +%s) - T0) / 60 )) min" >> "$OUT/$TAG-$K-of-$N.tail.txt"
  set -e
  cp "$(ls -t "$OUT"/gt/gate-tail.*.log | head -n 1)" "$OUT/$TAG-$K-of-$N.log"
}

do_shard() { # <phase> <k> <N> <flip> <out>
  P=$1; K=$2; N=$3; FLIP=$4; OUT=$5
  [ -f "$OUT/phase-$P.txt" ] || { echo "no $OUT/phase-$P.txt (run sets first)" >&2; exit 2; }
  node -e 'const fs=require("fs"); const done=new Set([...fs.readFileSync(process.argv[2],"utf8").matchAll(/^ [✓❯×] (\S+) \(\d+ tests?/gm)].map(m=>m[1])); const rest=fs.readFileSync(process.argv[1],"utf8").trim().split("\n").filter(f=>!done.has(f)); fs.writeFileSync(process.argv[3], rest.join("\n")+"\n");' \
    "$OUT/phase-$P.txt" "$OUT/census-run.log" "$OUT/phase-$P.flip-remaining.txt"
  shard_run "$FLIP" "flip-p$P" "$K" "$N" "$OUT/phase-$P.flip-remaining.txt" "$OUT"
}

do_control() { # <phase> <k> <N> <cut> <dark> <out>
  P=$1; K=$2; N=$3; CUT=$4; DARK=$5; OUT=$6
  [ -z "$(git -C "$DARK" status --porcelain)" ] || { echo "$DARK has uncommitted or untracked files" >&2; exit 2; }
  git -C "$DARK" diff --quiet "$CUT" HEAD -- src tests || { echo "$DARK's src/ or tests/ differ from $CUT" >&2; exit 2; }
  shard_run "$DARK" "dark-p$P" "$K" "$N" "$OUT/phase-$P.txt" "$OUT"
}

do_lists() { # <out>
  OUT=$1
  node --input-type=module - "$OUT" <<'EOF'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [OUT] = process.argv.slice(2);
const rel = (f) => { const i = f.search(/(^|\/)(tests|src)\//); return i < 0 ? f : f.slice(f[i] === '/' ? i + 1 : i); };
const title = (a) => [...(a.ancestorTitles || []), a.title].join(' > ');
// ── the flipped run: its JSON when it ended of itself, else its log's finished files plus every shard's JSON ──
const files = []; // { file, tests, failed, skipped, reds: [{ title, msg }], source }
const fromJson = (path, source) => {
  const res = JSON.parse(readFileSync(path, 'utf8'));
  for (const t of res.testResults) {
    const reds = t.assertionResults.filter((a) => a.status === 'failed').map((a) => ({ title: title(a), msg: String(a.failureMessages?.[0] || '').split('\n')[0].slice(0, 300) }));
    if (!reds.length && t.status === 'failed') reds.push({ title: '(the file failed to run)', msg: String(t.message || '').split('\n')[0].slice(0, 300) });
    files.push({ file: rel(t.name), tests: t.assertionResults.length, failed: reds.length, skipped: t.assertionResults.filter((a) => ['skipped', 'pending', 'todo'].includes(a.status)).length, reds, source });
  }
};
let shape;
if (existsSync(join(OUT, 'census-results.json'))) { fromJson(join(OUT, 'census-results.json'), 'run'); shape = 'the run ended of itself'; } else {
  const log = readFileSync(join(OUT, 'census-run.log'), 'utf8').split('\n');
  for (let i = 0; i < log.length; i += 1) {
    const m = /^ ([✓❯×]) (\S+) \((\d+) tests?(?: \| (\d+) failed)?(?: \| (\d+) skipped)?\)/.exec(log[i]);
    if (!m) continue;
    const f = { file: m[2], tests: Number(m[3]), failed: Number(m[4] || 0), skipped: Number(m[5] || 0), reds: [], source: 'run (log)' };
    if (files.some((x) => x.file === f.file)) continue;
    for (let j = i + 1; j < log.length && /^ {3,}/.test(log[j]); j += 1) {
      const t = /^ {3,}× (.*?)(?: \d+ms)?$/.exec(log[j]);
      if (t) f.reds.push({ title: t[1], msg: '' });
    }
    files.push(f);
  }
  const shards = readdirSync(OUT).filter((x) => /^flip-p\d+-\d+-of-\d+\.json$/.test(x)).sort();
  for (const s of shards) fromJson(join(OUT, s), s.replace('.json', ''));
  shape = `the run was ended before its end: ${files.filter((x) => x.source === 'run (log)').length} files read from its log, ${files.length - files.filter((x) => x.source === 'run (log)').length} from ${shards.length} flipped shard(s)`;
}
const reds = files.flatMap((f) => f.reds.map((r) => ({ file: f.file, ...r })));
const TEN = [
  ['tests/domain/seatLawWiring.test.js', 'the vocabulary: one key, two versions, the dial at the default'],
  ['tests/domain/seatLawWiring.test.js', '1. CREATE (dark): birthConfig carries no _seatLawVersion'],
  ['tests/domain/seatLawWiring.test.js', '2. CREATE (THE CLAMP): an incoming _seatLawVersion: 2 is clamped away'],
  ['tests/domain/livingContentLawWiring.test.js', 'CREATE (LIT, the product path): birthConfig writes the law marker and NOTHING else'],
  ['tests/domain/livingContentLawWiring.test.js', 'CREATE (dark, fired deliberately): at the dormant dial birthConfig still writes not one byte'],
  ['tests/domain/livingContentLawWiring.test.js', 'CREATE (THE SAME-SEED CONTROL, LIT): a birth through the boundary is the same world but the law it declares'],
  ['tests/domain/livingContentLawWiring.test.js', 'CREATE (THE CLAMP): a LIT marker arriving through the wizard form cannot birth a v2 world'],
  ['tests/domain/seat/seatContest.test.js', 'the dial is dark and every factor of the registered table reads 1'],
  ['tests/domain/seat/seatContest.test.js', 'under the law, dark: the kind read is today\'s'],
  ['tests/domain/seat/seatContest.test.js', 'dark: today\'s read (a craft archetype has no row, so the plot reads palace_coup)'],
];
const TWO = [
  ['tests/domain/seatLawWiring.test.js', '4. GENERATION_LAWS.seat is a WIRED row that says the dial is dark'],
  ['tests/domain/seat/seatContest.test.js', 'the proposed figures are written beside the table, in its register row'],
];
const hit = (r, [f, t]) => r.file === f && r.title.includes(t);
// (2) THE READING: a red whose pin is a born figure, string or digest that a birth minting the law moves (file -> pin kind)
const BORN = {
  // BORN-MAP
};
const list1 = reds.filter((r) => TEN.some((k) => hit(r, k)) || TWO.some((k) => hit(r, k)));
const rest = reds.filter((r) => !list1.includes(r));
// ── THE CONTROL: the same phase sets, unflipped (every dark-p<phase>-<k>-of-<N>.json) ──
const darkShards = readdirSync(OUT).filter((x) => /^dark-p\d+-\d+-of-\d+\.json$/.test(x)).sort();
const darkReds = new Map(); const darkFiles = new Set(); let darkTests = 0;
for (const s of darkShards) {
  for (const t of JSON.parse(readFileSync(join(OUT, s), 'utf8')).testResults) {
    const f = rel(t.name);
    darkFiles.add(f); darkTests += t.assertionResults.length;
    const r = t.assertionResults.filter((a) => a.status === 'failed').map(title);
    if (!r.length && t.status === 'failed') r.push('(the file failed to run)');
    if (r.length) darkReds.set(f, r);
  }
}
// a log title carries no describe path: it matches a control red that ends with it
const known = (r) => (darkReds.get(r.file) || []).some((t) => t === r.title || t.endsWith(` > ${r.title}`) || t === '(the file failed to run)');
const list4 = rest.filter((r) => darkFiles.has(r.file) && known(r));
const list2 = rest.filter((r) => darkFiles.has(r.file) && !known(r) && BORN[r.file]).map((r) => ({ ...r, pin: BORN[r.file] }));
const list3 = rest.filter((r) => darkFiles.has(r.file) && !known(r) && !BORN[r.file]);
const controlled = (r) => darkFiles.has(r.file);
const uncontrolled = rest.filter((r) => !controlled(r));
const sum = (k) => files.reduce((n, f) => n + f[k], 0);
const totals = { shape, files: files.length, filesRed: files.filter((f) => f.failed).length, tests: sum('tests'), failed: sum('failed'), skipped: sum('skipped'), list1: list1.length, list2: list2.length, list3: list3.length, list4: list4.length };
const tenRed = TEN.map((k) => ({ file: k[0], title: k[1], red: reds.some((r) => hit(r, k)) }));
const twoRed = TWO.map((k) => ({ file: k[0], title: k[1], red: reds.some((r) => hit(r, k)) }));
const control = { shards: darkShards, files: darkFiles.size, tests: darkTests, redFiles: darkReds.size };
totals.uncontrolled = uncontrolled.length;
writeFileSync(join(OUT, 'census.json'), `${JSON.stringify({ totals, tenRed, twoRed, list1, list2, list3, list4, uncontrolled, control }, null, 2)}\n`);
console.log(`${shape}`);
console.log(`files run ${totals.files} (red ${totals.filesRed}) · tests ${totals.tests} · failed ${totals.failed} · skipped ${totals.skipped}`);
console.log(`the control: the phase sets unflipped, ${darkShards.length} shard(s): ${darkFiles.size} files, ${darkTests} tests, ${darkReds.size} files red; reds of the run outside the control's files (unclassified) ${uncontrolled.length}`);
console.log(`(1) pins of the dark default ${list1.length} (of the ten: ${tenRed.filter((x) => x.red).length} red; conditional: ${twoRed.filter((x) => x.red).length} red) · (2) born fixtures that move ${list2.length} · (3) anything else ${list3.length} · (4) red without the flip (known) ${list4.length}`);
EOF
}

MODE=${1:-}; [ -n "$MODE" ] && shift || usage
case $MODE in
  run) [ $# -eq 3 ] || usage; do_run "$@" ;;
  sets) [ $# -eq 2 ] || usage; do_sets "$@" ;;
  shard) [ $# -eq 5 ] || usage; do_shard "$@" ;;
  control) [ $# -eq 6 ] || usage; do_control "$@" ;;
  lists) [ $# -eq 1 ] || usage; do_lists "$@" ;;
  all)
    [ $# -ge 4 ] || usage
    do_run "$1" "$2" "$4"
    if [ ! -f "$4/census-results.json" ]; then
      do_sets "$2" "$4"
      N=${5:-2}; k=1
      while [ "$k" -le "$N" ]; do do_shard 1 "$k" "$N" "$2" "$4"; k=$((k + 1)); done
      k=1
      while [ "$k" -le "$N" ]; do do_control 1 "$k" "$N" "$1" "$3" "$4"; k=$((k + 1)); done
    fi
    do_lists "$4" ;;
  *) usage ;;
esac
