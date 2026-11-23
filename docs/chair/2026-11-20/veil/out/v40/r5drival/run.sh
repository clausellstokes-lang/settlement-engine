#!/bin/sh
# R5D-RIVAL (VEIL-40): the runs, one runner so the seat re-runs them. Every heavy run through scripts/gate-mutex.sh --run in
# its EXCLUSIVE tier (exit 3, a give-up, is waited out and asked again, never routed round); no git repository variable reaches
# a run; vitest read by scripts/gate-tail.sh (never through a pipe); every log to a file under <logdir>; each step's exit
# appended to <logdir>/exits.txt with the hour from date -u. Every database local (PGHOST below), each named v40rv_*.
#   sh run.sh <tree> <logdir> full     the arm on the full pools: four shards side by side under ONE hold (A and act T in two;
#                                      R5-RECENT's pool in two); R5DRV_SETTINGS and R5DRV_NEVER pass through (the red run's economy)
#   sh run.sh <tree> <logdir> slice    the arm's default (the plants and the slice), one process
#   sh run.sh <tree> <logdir> chains   E116 step (4): 001..211 + 212 + down = 001..211 (every public function's definition md5
#                                      and ACL), _gallery_veil* executable by anon or authenticated on 001..211 + 212, the
#                                      catalogue on the new 212; the registry's door and the standing table's door
#   sh run.sh <tree> <logdir> arms     E116 step (5): the unit's pglite files and walkers, each its own run
#   sh run.sh <tree> <logdir> after    item 6: tests/lint whole, tests/copy whole, the full typecheck, eslint on every file touched
#   sh run.sh <tree> <logdir> cost     item 5: the cost law (the largest born metropolis by R5D-SQL-2's recipe; cost.mjs)
# <tree>: the worktree (or a snapshot of a commit, for the red run) the runs read.
W="${1:?usage: run.sh <tree> <logdir> full|slice|chains|arms|after|cost}"; L="${2:?logdir}"; WHAT="${3:-full}"
D=/home/user/wt/r5rival/docs/chair/2026-11-20/veil/out/v40/r5drival
mkdir -p "$L/tmp" || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
export TMPDIR="$L/tmp" PGHOST=/var/tmp/rv7 PGUSER=postgres
cd "$W" || exit 2
ARM=tests/security/galleryVeilRival.pglite.test.js
ex() { echo "$1 rc=$2 $(date -u +%Y-%m-%dT%H:%M:%SZ)${3:+ $3}" >> "$L/exits.txt"; }
xmutex() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ "$r" -ne 3 ] && return "$r"; echo "mutex give-up (3) $(date -u +%H:%M:%S); waiting" >> "$L/mutex-waits.log"; sleep 60; done; }
mkdb() { dropdb --if-exists "$1" && createdb -T v27x211 "$1"; }
tests_of() { grep -o 'Tests  *[0-9]* [a-z]*[^|]*' "$1" | tail -1; }
shards() {
  pids=""; names=""
  for spec in A:0/2 A:1/2 C6:0/2 C6:1/2; do
    pool=${spec%%:*}; sh=${spec#*:}; n="$pool-$(echo "$sh" | tr / -)"
    R5DRV_POOL=full R5DRV_WHICH="$pool" R5DRV_SHARD="$sh" R5DRV_MEASURES="$L/measures-$n.txt" R5DRV_OUT="$L/shard-$n.ndjson" \
      sh scripts/gate-tail.sh -n 60 npx vitest run "$ARM" --maxWorkers=1 > "$L/shard-$n.log" 2>&1 &
    pids="$pids $!"; names="$names $n"
  done
  rc=0; set -- $names
  for p in $pids; do wait "$p"; r=$?; ex "shard-$1" "$r"; [ "$r" -ne 0 ] && rc=1; shift; done
  return $rc
}
arms() {
  for f in tests/security/galleryVeilRival.pglite.test.js tests/security/galleryVeilDesc.pglite.test.js tests/security/galleryVeilRecent.pglite.test.js \
           tests/security/galleryWithholdAlways.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js \
           tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/rosterChoicePools.walker.test.js \
           tests/lint/standingReaders.walker.test.js; do
    n=$(basename "$f" .test.js)
    R5DRV_MEASURES="$L/measures-$n.txt" xmutex sh scripts/gate-tail.sh -n 80 npx vitest run "$f" --maxWorkers=1 > "$L/arm-$n.log" 2>&1
    ex "arm $f" $? "$(tests_of "$L/arm-$n.log")"
  done
  sh scripts/gate-tail.sh node scripts/veil/standingForms.mjs --check > "$L/standingForms-check.log" 2>&1; ex "standingForms.mjs --check" $?
}
chains() {
  X=v40rv_x211; A=v40rv_a; B=v40rv_b
  sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql supabase/migrations/211_server_side_share_veil.sql > "$L/sha256.txt"; ex sha256 $?
  mkdb $X && mkdb $A && mkdb $B; ex make-dbs $?
  psql -X -q -v ON_ERROR_STOP=1 -d $A -f supabase/migrations/212_share_veil_later_cures.sql > "$L/apply-212.log" 2>&1; ex apply-212 $?
  { psql -X -q -v ON_ERROR_STOP=1 -d $B -f supabase/migrations/212_share_veil_later_cures.sql && \
    psql -X -q -v ON_ERROR_STOP=1 -d $B -f supabase/rollback/212_share_veil_later_cures.down.sql; } > "$L/apply-212-rollback.log" 2>&1; ex apply-212-then-rollback $?
  FN="select p.oid::regprocedure::text || ' ' || md5(pg_get_functiondef(p.oid)) || ' ' || coalesce(p.proacl::text, '-')
        from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind in ('f', 'p') order by 1"
  psql -X -At -d $X -c "$FN" > "$L/fn-211.txt" 2>&1 && psql -X -At -d $B -c "$FN" > "$L/fn-rollback.txt" 2>&1 && cmp "$L/fn-211.txt" "$L/fn-rollback.txt" > "$L/cmp.log" 2>&1
  ex rollback-equals-211 $? "($(wc -l < "$L/fn-211.txt") functions)"
  psql -X -At -d $A -c "$FN" > "$L/fn-212.txt" 2>&1; ex catalogue-212 $? "($(wc -l < "$L/fn-212.txt") functions, $(grep -c '_gallery_veil' "$L/fn-212.txt") _gallery_veil*)"
  n=$(psql -X -At -d $A -c "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like '\_gallery\_veil%'
        and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))" 2>&1)
  echo "$n" > "$L/exec.log"; [ "$n" = "0" ]; ex veil-executable-by-anon-or-authenticated $? "(count $n)"
  sh scripts/gate-tail.sh node scripts/veil/rosterChoiceRegistry.mjs --check > "$L/registry-check.log" 2>&1; ex "rosterChoiceRegistry.mjs --check" $?
  sh scripts/gate-tail.sh node scripts/veil/standingForms.mjs --check > "$L/standingForms-check.log" 2>&1; ex "standingForms.mjs --check" $?
}
after() {
  xmutex sh scripts/gate-tail.sh -n 120 npx vitest run tests/lint > "$L/lint-whole.log" 2>&1; ex "tests/lint whole" $? "$(tests_of "$L/lint-whole.log")"
  xmutex sh scripts/gate-tail.sh -n 80 npx vitest run tests/copy > "$L/copy-whole.log" 2>&1; ex "tests/copy whole" $? "$(tests_of "$L/copy-whole.log")"
  xmutex sh scripts/gate-tail.sh -n 40 node scripts/check-full-typecheck.mjs > "$L/typecheck.log" 2>&1; ex "check-full-typecheck" $? "$(tail -3 "$L/typecheck.log" | tr '\n' ' ')"
  sh scripts/gate-tail.sh npx eslint --no-warn-ignored src/domain/display/galleryRosterChoices.js src/domain/veil/rosterChoiceRegistry.js \
    tests/security/galleryVeilRival.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js "$D/cost.mjs" "$D/largest.probe.mjs" > "$L/eslint.log" 2>&1; ex eslint $?
}
cost() {
  X=v40rv_x211; O=v40rv_old; A=v40rv_a
  mkdb $O && git show 9b1fe3c34:supabase/migrations/212_share_veil_later_cures.sql > "$L/tmp/212-9b1fe3c34.sql" && \
    psql -X -q -v ON_ERROR_STOP=1 -d $O -f "$L/tmp/212-9b1fe3c34.sql" > "$L/apply-212-9b1fe3c34.log" 2>&1; ex apply-212-at-9b1fe3c34 $?
  RV6_SRC="$W" RV9_PROBE="$D/largest.probe.mjs" R5DRV_COST_OUT="$L" xmutex sh scripts/gate-tail.sh -n 40 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1 > "$L/largest.log" 2>&1
  ex largest-metropolis $? "$(node -e 'const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(j.seed, j.length)' "$L/largest-metropolis.json" 2>&1)"
  xmutex node "$D/cost.mjs" "$L/largest-metropolis.json" $X $O $A /var/tmp/v18/pgmod > "$L/cost.log" 2>&1
  ex cost-law $? "$(grep -E 'WITHIN|OUTSIDE' "$L/cost.log" | tail -1)"
}
case "$WHAT" in
  full)
    echo "full: tree $W queued $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$L/exits.txt"
    xmutex sh "$D/run.sh" "$W" "$L" __shards; ex full $? ;;
  __shards) shards ;;
  slice)
    R5DRV_MEASURES="$L/measures-slice.txt" R5DRV_OUT="$L/slice.ndjson" xmutex sh scripts/gate-tail.sh -n 60 npx vitest run "$ARM" --maxWorkers=1 > "$L/slice.log" 2>&1
    ex slice $? "$(tests_of "$L/slice.log")" ;;
  chains) chains ;;
  arms) arms ;;
  after) after ;;
  cost) cost ;;
  *) echo "run.sh: full | slice | chains | arms | after | cost" >&2; exit 2 ;;
esac
