#!/bin/sh
# R5D-SQL-2 (VEIL-37, the chair's E136 (a)): THE RUNS, one runner so the seat re-runs them. Each step writes its own log under
# <logdir>, and its exit is appended to <logdir>/exits.txt. Every database is local (PGHOST below); no git repository variable
# reaches a run; vitest runs through scripts/gate-mutex.sh --run in its shared tier (--maxWorkers=1), and exit 3 (a give-up) is
# waited out and asked again, never routed round.
#   sh run.sh <logdir> [main|cost|all]     main: (a)..(h); cost: (i), after the seat's pool chain has ended; all (the default): both
W=/home/user/wt/r5desc
D=$W/docs/chair/2026-11-20/veil/out/v37/r5dsql2
L="${1:?usage: run.sh <logdir> [main|cost|all]}"; WHAT="${2:-all}"
mkdir -p "$L/tmp" || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
export PGHOST=/var/tmp/rv7 PGUSER=postgres TMPDIR="$L/tmp"
PGMOD=/var/tmp/v18/pgmod
DONE=/var/tmp/v18/out/v37/g/done.txt
cd "$W" || exit 2
X=r5dsql2_x211; A=r5dsql2_a; B=r5dsql2_b; O=r5dsql2_old; F=r5dforms
ex() { echo "$1 rc=$2 $(date -u +%H:%M:%S)${3:+ $3}" >> "$L/exits.txt"; }
# shared-tier vitest through the mutex; exit 3 is a give-up: wait, ask again
mutex() { while :; do GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ "$r" -ne 3 ] && return "$r"; sleep 60; done; }
# the exclusive tier (the cost law): exit 3 is a give-up: wait, ask again
xmutex() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ "$r" -ne 3 ] && return "$r"; sleep 60; done; }
mkdb() { for i in 1 2 3 4 5 6 7 8 9 10; do dropdb --if-exists "$1" && createdb -T v27x211 "$1" && return 0; sleep 30; done; return 1; }

main() {
  : > "$L/exits.txt"
  echo "tree $(git rev-parse --short HEAD) $(git status --short -- supabase scripts/veil src/domain/display/galleryWithholdAlways.js | tr '\n' ' ')" > "$L/tree.txt"
  sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql \
    supabase/migrations/211_server_side_share_veil.sql supabase/migrations/210_*.sql scripts/veil/standingForms.ids.json > "$L/sha256.txt"
  node scripts/veil/standingForms.mjs --print > "$L/print.txt" 2>&1; r=$?; ex print "$r" "$(tail -1 "$L/print.txt")"

  # (a) the door's check; and on a copy of the tip's factionStanding.js with one sentence changed, it reds with its message
  sh scripts/gate-tail.sh node scripts/veil/standingForms.mjs --check > "$L/a-check.log" 2>&1; r=$?; ex a-check "$r" "$(grep -o 'green ([0-9]* rows' "$L/a-check.log")"
  sed 's/close enough to matter and too far behind to lead\./close enough to matter, too far behind to lead./' src/generators/power/factionStanding.js > "$L/tmp/factionStanding.changed.js"
  cmp -s src/generators/power/factionStanding.js "$L/tmp/factionStanding.changed.js" && echo "the copy did not change" > "$L/a-check-file.log"
  node scripts/veil/standingForms.mjs --check --file "$L/tmp/factionStanding.changed.js" >> "$L/a-check-file.log" 2>&1; r=$?
  grep -q 'ships only WITH a migration' "$L/a-check-file.log" && m=yes || m=no
  ex a-check-file-red "$r" "(want 1, the message: $m)"
  # (b) the registry's door
  sh scripts/gate-tail.sh node scripts/veil/rosterChoiceRegistry.mjs --check > "$L/b-registry.log" 2>&1; ex b-registry-check $?
  # (c) the walker, 11 of 11
  mutex sh scripts/gate-tail.sh -n 60 npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js --maxWorkers=1 > "$L/c-walker.log" 2>&1
  r=$?; ex c-walker "$r" "$(grep -o 'Tests  *[0-9]* passed ([0-9]*)' "$L/c-walker.log" | tail -1)"
  # (d) the full typecheck and eslint on every JS file touched
  nice -n 10 sh scripts/gate-tail.sh node scripts/check-full-typecheck.mjs > "$L/d-typecheck.log" 2>&1; ex d-typecheck $?
  sh scripts/gate-tail.sh npx eslint --no-warn-ignored scripts/veil/standingForms.mjs scripts/veil/standingForms.proof.mjs src/domain/display/galleryWithholdAlways.js \
    "$D/r5dsql2.probe.jsx" "$D/g-cases.mjs" "$D/cost.mjs" > "$L/d-eslint.log" 2>&1; ex d-eslint $?

  # (e) the local chains: 001..211 (v27x211) + 212; the same + the rollback, every public function's definition md5 and ACL
  #     against 211's; on 001..211 + 212, no _gallery_veil* executable by anon or authenticated
  mkdb $X && mkdb $A && mkdb $B && mkdb $O; ex e-make-dbs $?
  psql -X -q -v ON_ERROR_STOP=1 -d $A -f supabase/migrations/212_share_veil_later_cures.sql > "$L/e-apply-212.log" 2>&1; ex e-apply-212 $?
  { psql -X -q -v ON_ERROR_STOP=1 -d $B -f supabase/migrations/212_share_veil_later_cures.sql && \
    psql -X -q -v ON_ERROR_STOP=1 -d $B -f supabase/rollback/212_share_veil_later_cures.down.sql; } > "$L/e-apply-212-rollback.log" 2>&1; ex e-apply-212-rollback $?
  FN="select p.oid::regprocedure::text || ' ' || md5(pg_get_functiondef(p.oid)) || ' ' || coalesce(p.proacl::text, '-')
        from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind in ('f', 'p') order by 1"
  psql -X -At -d $X -c "$FN" > "$L/e-fn-211.txt" 2>&1 && psql -X -At -d $B -c "$FN" > "$L/e-fn-rollback.txt" 2>&1 && cmp "$L/e-fn-211.txt" "$L/e-fn-rollback.txt" > "$L/e-cmp.log" 2>&1
  r=$?; ex e-rollback-equals-211 "$r" "($(wc -l < "$L/e-fn-211.txt") functions)"
  n=$(psql -X -At -d $A -c "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like '\_gallery\_veil%'
        and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))" 2>&1)
  echo "$n" > "$L/e-exec.log"; [ "$n" = "0" ]; r=$?; ex e-veil-executable-by-anon-or-authenticated "$r" "(count $n)"
  git show eeda6a126:supabase/migrations/212_share_veil_later_cures.sql > "$L/tmp/212-eeda6a126.sql" && \
    psql -X -q -v ON_ERROR_STOP=1 -d $O -f "$L/tmp/212-eeda6a126.sql" > "$L/e-apply-212-eeda6a126.log" 2>&1; ex e-apply-212-at-eeda6a126 $?

  # (f) the proof: JS and Postgres (a scratch database, no migration), and 300 births' standings
  dropdb --if-exists $F && createdb $F; ex f-make-db $?
  nice -n 10 node scripts/veil/standingForms.proof.mjs "$L/proof" --pg --walk 300 > "$L/f-proof.log" 2>&1; r=$?; ex f-proof "$r" "$(tail -1 "$L/f-proof.log")"

  # (g) the proof's cases through 212's _gallery_veil_withhold_always and the twin's standingBase, against the reference
  first=$(sed -n 's/^(m) cases: \([0-9]*\) of the first pass.*/\1/p' "$L/f-proof.log")
  node "$D/g-cases.mjs" "$L/proof/cases.csv" $A "$first" $PGMOD > "$L/g-cases.log" 2>&1; r=$?; ex g-cases "$r" "$(head -1 "$L/g-cases.log" | sed 's/.*: SQL/SQL/')"

  # (h) the probe: born towns and the mask's plants, server and twin, this tree and eeda6a126 (its twin's literal from git)
  git show eeda6a126:src/domain/display/galleryWithholdAlways.js | awk '/STANDING_FORMS begin/{f=1;next}/STANDING_FORMS end/{f=0}f' | sed '1s/^`//;$s/`$//' > "$L/old-literal.json"
  node -e 'const t=require("fs").readFileSync(process.argv[1],"utf8");JSON.parse(t);const u=t.replace(/\n$/,"");console.log("old literal sha256",require("crypto").createHash("sha256").update(u,"utf8").digest("hex"),"length",u.length)' "$L/old-literal.json" > "$L/h-old-literal.log" 2>&1
  r=$?; ex h-old-literal "$r" "$(cat "$L/h-old-literal.log")"
  export RV6_SRC=$W RV6_PGMOD=$PGMOD RV9_PROBE=$D/r5dsql2.probe.jsx R5Q_DB=$A R5Q_DB_OLD=$O R5Q_OLD_LIT="$L/old-literal.json" R5Q_OUT="$L"
  mutex sh scripts/gate-tail.sh -n 80 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1 > "$L/h-probe.log" 2>&1
  ex h-probe $?
}

cost() {
  # (i) THE COST LAW, only on a quiet box: the seat's pool chain has ended (a line beginning END)
  echo "waiting for END in $DONE from $(date -u +%H:%M:%S)" > "$L/i-wait.log"
  while ! grep -q '^END' "$DONE" 2>/dev/null; do sleep 60; done
  echo "END seen $(date -u +%H:%M:%S); load $(cat /proc/loadavg)" >> "$L/i-wait.log"
  [ -f "$L/largest-metropolis.json" ] || { ex i-cost-law 2 "(no largest-metropolis.json: run main first)"; return 2; }
  xmutex node "$D/cost.mjs" "$L/largest-metropolis.json" $X $O $A $PGMOD > "$L/i-cost.log" 2>&1
  r=$?; ex i-cost-law "$r" "$(grep -E 'WITHIN|OUTSIDE' "$L/i-cost.log" | tail -1)"
}

case "$WHAT" in
  main) main ;;
  cost) cost ;;
  all) main; cost ;;
  *) echo "run.sh: main | cost | all" >&2; exit 2 ;;
esac
