#!/bin/sh
# recut.sh — THE FLIP'S CENSUS, RE-CUT AT THE LANE'S MERGED TIP (SEAT-10, 2026-11-21; the eighth chair's word of 23:24Z:
# "re-cut at the merged tip after unit 1 (one tree, one answer); 9cc5045f2's partial lists stay as history").
# Adapted from BFL's census.sh (lane/seat-7-2026-11-20-flip-wip :: docs/chair/2026-11-20/content/seat/flip/census.sh):
# its set, its shard runner and its four lists, WITHOUT its whole-suite run (rule 8 as re-ruled: no whole suite on a
# seat's box). A MEASURE ONLY: the flip lives in <flip>, a local clone of the repository outside it, never committed.
#
#   sh recut.sh prep <base> <flip> <out>              the flipped clone of <base>: exactly the two dials, the ledger ref
#   sh recut.sh sets <dark> <out>                     the census set at <base>, written to <out>/phase.txt
#   sh recut.sh shard <k> <N> <flip> <out>            flipped, shard k of N of the census set
#   sh recut.sh control <k> <N> <base> <dark> <out>   unflipped, shard k of N of the SAME set, on <dark> (HEAD = <base>, clean)
#   sh recut.sh lists <out>                           the four lists, from the shards' JSON alone
#
# THE SET (BFL's, unchanged in meaning): every test file (`vitest list --filesOnly`) whose text names `birthConfig`,
# `settlementGenerateAction` or `composeInstantWorld`, plus `tests/generators`, `tests/data` and `tests/domain/seat`
# whole. Its directories are RECORDED (<out>/birth-dirs.json), not pinned: the tree moved from BFL's cut.
# Every run: through scripts/gate-mutex.sh (shared tier, --maxWorkers=2), each shard its own task and log under the
# 2-hour ceiling, ONE heavy run at a time on the box. Exit: 0 done, 2 a failure.
set -eu
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY GIT_PREFIX; do
  eval "x=\${$v:-}"; [ -z "$x" ] || { echo "$v is set; unset it first" >&2; exit 2; }
done
REPO=$(git rev-parse --show-toplevel)
usage() { sed -n '8,12p' "$0" >&2; exit 2; }

do_prep() { # <base> <flip> <out>
  BASE=$1; FLIP=$2; OUT=$3; mkdir -p "$OUT/gt"
  [ ! -e "$FLIP" ] || { echo "$FLIP exists; remove it or name another" >&2; exit 2; }
  git clone -q --shared --no-checkout "$REPO" "$FLIP"
  git -C "$FLIP" checkout -q --detach "$BASE"
  git -C "$FLIP" fetch -q "$REPO" +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08
  cp -al "$REPO/node_modules" "$FLIP/node_modules"
  sed -i 's/^export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;$/export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;/' "$FLIP/src/domain/seat/seatLaw.js"
  sed -i 's/^export const SEAT_CONTEST_LIT = false;$/export const SEAT_CONTEST_LIT = true;/' "$FLIP/src/domain/seat/seatCircumstances.js"
  git -C "$FLIP" diff "$BASE" > "$OUT/flip.diff"
  [ "$(git -C "$FLIP" diff --numstat "$BASE" | tr '\t' ' ')" = "1 1 src/domain/seat/seatCircumstances.js
1 1 src/domain/seat/seatLaw.js" ] || { echo "the flipped clone's diff against $BASE is not the two dials" >&2; exit 2; }
  echo "flipped clone of $(git -C "$FLIP" rev-parse --short HEAD) at $FLIP: the two dials (diff in $OUT/flip.diff)"
}

do_sets() { # <dark> <out>
  DARK=$1; OUT=$2; mkdir -p "$OUT"
  (cd "$DARK" && npx vitest list --filesOnly --json="$OUT/all-files.json" > "$OUT/list.log" 2>&1)
  node --input-type=module - "$OUT" "$DARK" <<'EOF'
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
const [OUT, TREE] = process.argv.slice(2);
const all = JSON.parse(readFileSync(join(OUT, 'all-files.json'), 'utf8')).map((x) => relative(TREE, x.file || x)).sort();
const birth = new Set(all.filter((f) => /birthConfig|settlementGenerateAction|composeInstantWorld/.test(readFileSync(join(TREE, f), 'utf8'))));
const dirs = [...new Set([...birth].map((f) => dirname(f)))].sort();
writeFileSync(join(OUT, 'birth-dirs.json'), `${JSON.stringify(dirs)}\n`);
const NAMED = ['tests/generators', 'tests/data', 'tests/domain/seat'];
const set = all.filter((f) => birth.has(f) || NAMED.some((d) => f.startsWith(`${d}/`)));
writeFileSync(join(OUT, 'phase.txt'), `${set.join('\n')}\n`);
console.log(`files listed ${all.length} · birth-reaching ${birth.size} in ${dirs.length} directories · the census set ${set.length} · outside it ${all.length - set.length}`);
EOF
}

# shard_run <tree> <tag> <k> <N> <out>: one shard of <out>/phase.txt, through the mutex, to its own log and JSON
shard_run() {
  TREE=$1; TAG=$2; K=$3; N=$4; OUT=$5; mkdir -p "$OUT/gt"
  [ -f "$OUT/phase.txt" ] || { echo "no $OUT/phase.txt (run sets first)" >&2; exit 2; }
  set +e
  T0=$(date +%s)
  # shellcheck disable=SC2046
  (cd "$TREE" && TMPDIR="$OUT/gt" sh scripts/gate-tail.sh -n 40 env TMPDIR=/tmp GATE_MUTEX_TIER=shared \
    GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 --shard="$K/$N" \
    --reporter=default --reporter=json --outputFile.json="$OUT/$TAG-$K-of-$N.json" $(cat "$OUT/phase.txt")) > "$OUT/$TAG-$K-of-$N.tail.txt" 2>&1
  echo "exit $? · wall $(( ($(date +%s) - T0) / 60 )) min · $(date -u +%H:%M:%SZ)" >> "$OUT/$TAG-$K-of-$N.tail.txt"
  set -e
  cp "$(ls -t "$OUT"/gt/gate-tail.*.log | head -n 1)" "$OUT/$TAG-$K-of-$N.log"
}

do_shard() { # <k> <N> <flip> <out>
  shard_run "$3" flip "$1" "$2" "$4"
}

do_control() { # <k> <N> <base> <dark> <out>
  K=$1; N=$2; BASE=$3; DARK=$4; OUT=$5
  [ -z "$(git -C "$DARK" status --porcelain -- src tests)" ] || { echo "$DARK has changes under src/ or tests/" >&2; exit 2; }
  git -C "$DARK" diff --quiet "$BASE" HEAD -- src tests || { echo "$DARK's src/ or tests/ differ from $BASE" >&2; exit 2; }
  shard_run "$DARK" dark "$K" "$N" "$OUT"
}

do_lists() { # <out>
  OUT=$1
  node --input-type=module - "$OUT" <<'EOF'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [OUT] = process.argv.slice(2);
const rel = (f) => { const i = f.search(/(^|\/)(tests|src)\//); return i < 0 ? f : f.slice(f[i] === '/' ? i + 1 : i); };
const title = (a) => [...(a.ancestorTitles || []), a.title].join(' > ');
const read = (tag) => {
  const shards = readdirSync(OUT).filter((x) => new RegExp(`^${tag}-\\d+-of-\\d+\\.json$`).test(x)).sort();
  const files = [];
  for (const s of shards) {
    for (const t of JSON.parse(readFileSync(join(OUT, s), 'utf8')).testResults) {
      const reds = t.assertionResults.filter((a) => a.status === 'failed').map((a) => ({ title: title(a), msg: String(a.failureMessages?.[0] || '').split('\n')[0].slice(0, 300) }));
      if (!reds.length && t.status === 'failed') reds.push({ title: '(the file failed to run)', msg: String(t.message || '').split('\n')[0].slice(0, 300) });
      files.push({ file: rel(t.name), tests: t.assertionResults.length, failed: reds.length, skipped: t.assertionResults.filter((a) => ['skipped', 'pending', 'todo'].includes(a.status)).length, reds });
    }
  }
  return { shards, files };
};
const flip = read('flip'); const dark = read('dark');
const reds = flip.files.flatMap((f) => f.reds.map((r) => ({ file: f.file, ...r })));
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
// (2) THE READING, filled by the integrator after reading each red: file -> the born pin's kind
const BORN = {
  // BORN-MAP
};
const list1 = reds.filter((r) => TEN.some((k) => hit(r, k)) || TWO.some((k) => hit(r, k)));
const rest = reds.filter((r) => !list1.includes(r));
const darkReds = new Map(); const darkFiles = new Set(dark.files.map((f) => f.file));
for (const f of dark.files) if (f.reds.length) darkReds.set(f.file, f.reds.map((r) => r.title));
const known = (r) => (darkReds.get(r.file) || []).some((t) => t === r.title || t === '(the file failed to run)');
const list4 = rest.filter((r) => darkFiles.has(r.file) && known(r));
const list2 = rest.filter((r) => darkFiles.has(r.file) && !known(r) && BORN[r.file]).map((r) => ({ ...r, pin: BORN[r.file] }));
const list3 = rest.filter((r) => darkFiles.has(r.file) && !known(r) && !BORN[r.file]);
const uncontrolled = rest.filter((r) => !darkFiles.has(r.file));
// a control red the flip CURES (red unflipped, green flipped) is listed apart: the flip moved it too
const flipRed = new Set(reds.map((r) => `${r.file} :: ${r.title}`));
const curedByFlip = [...darkReds].flatMap(([f, ts]) => ts.filter((t) => !flipRed.has(`${f} :: ${t}`)).map((t) => ({ file: f, title: t })));
const sum = (fs, k) => fs.reduce((n, f) => n + f[k], 0);
const totals = { files: flip.files.length, filesRed: flip.files.filter((f) => f.failed).length, tests: sum(flip.files, 'tests'), failed: sum(flip.files, 'failed'), skipped: sum(flip.files, 'skipped'), list1: list1.length, list2: list2.length, list3: list3.length, list4: list4.length, uncontrolled: uncontrolled.length, curedByFlip: curedByFlip.length };
const control = { shards: dark.shards, files: darkFiles.size, tests: sum(dark.files, 'tests'), failed: sum(dark.files, 'failed'), redFiles: darkReds.size };
const tenRed = TEN.map((k) => ({ file: k[0], title: k[1], red: reds.some((r) => hit(r, k)) }));
const twoRed = TWO.map((k) => ({ file: k[0], title: k[1], red: reds.some((r) => hit(r, k)) }));
writeFileSync(join(OUT, 'census.json'), `${JSON.stringify({ totals, control, tenRed, twoRed, list1, list2, list3, list4, uncontrolled, curedByFlip }, null, 2)}\n`);
console.log(`flipped: ${flip.shards.length} shard(s), files ${totals.files} (red ${totals.filesRed}) · tests ${totals.tests} · failed ${totals.failed} · skipped ${totals.skipped}`);
console.log(`control: ${dark.shards.length} shard(s), files ${control.files} · tests ${control.tests} · failed ${control.failed} in ${control.redFiles} files · flipped reds outside the control's files ${uncontrolled.length} · red unflipped but green flipped ${curedByFlip.length}`);
console.log(`(1) pins of the dark default ${list1.length} (of the ten: ${tenRed.filter((x) => x.red).length} red; conditional: ${twoRed.filter((x) => x.red).length} red) · (2) born fixtures that move ${list2.length} · (3) anything else ${list3.length} · (4) red without the flip (known) ${list4.length}`);
EOF
}

MODE=${1:-}; [ -n "$MODE" ] && shift || usage
case $MODE in
  prep) [ $# -eq 3 ] || usage; do_prep "$@" ;;
  sets) [ $# -eq 2 ] || usage; do_sets "$@" ;;
  shard) [ $# -eq 4 ] || usage; do_shard "$@" ;;
  control) [ $# -eq 5 ] || usage; do_control "$@" ;;
  lists) [ $# -eq 1 ] || usage; do_lists "$@" ;;
  *) usage ;;
esac
