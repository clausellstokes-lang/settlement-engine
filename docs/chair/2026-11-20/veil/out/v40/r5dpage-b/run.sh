#!/bin/sh
# R5D-PAGE-B (VEIL-40), PHASE 1: item 5b's measure, the one runner. Every heavy run through scripts/gate-mutex.sh --run in its
# EXCLUSIVE tier (the default; exit 3, a give-up, is waited out and asked again, never routed round); no git repository variable
# reaches a run; vitest is read by scripts/gate-tail.sh (never through a pipe); every log to a file under <logdir>; each step's
# exit appended to <logdir>/exits.txt with the hour from date -u.
#   sh run.sh <logdir> smoke    one shard: R5DPB_SEEDS (default the two known places and act T), at most R5DPB_LIMIT places
#   sh run.sh <logdir> full     three shards side by side under ONE hold of the mutex, then the tables
#   sh run.sh <logdir> agg      the tables only (no engine, no database)
W=/home/user/wt/r5desc
D=$W/docs/chair/2026-11-20/veil/out/v40/r5dpage-b
L="${1:?usage: run.sh <logdir> smoke|full|agg}"; WHAT="${2:-full}"
mkdir -p "$L/tmp" || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
export TMPDIR="$L/tmp" RV6_SRC=$W RV9_PROBE=$D/r5dpageb-5b.probe.mjs
cd "$W" || exit 2
ex() { echo "$1 rc=$2 $(date -u +%Y-%m-%dT%H:%M:%SZ)${3:+ $3}" >> "$L/exits.txt"; }
xmutex() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ "$r" -ne 3 ] && return "$r"; echo "mutex give-up (3) $(date -u +%H:%M:%S); waiting" >> "$L/mutex-waits.log"; sleep 60; done; }

shards() {
  # THREE probes side by side, one process per pool shard (A's pool and act T; R5-RECENT's pool in two halves), each its own
  # pglite chain; the exit of each to exits.txt; non-zero if any is
  pids=""; names=""
  for spec in A:0/1 C6:0/2 C6:1/2; do
    pool=${spec%%:*}; sh=${spec#*:}; n="$pool-$(echo "$sh" | tr / -)"
    R5DPB_POOL="$pool" R5DPB_SHARD="$sh" R5DPB_OUT="$L/shard-$n.ndjson" sh scripts/gate-tail.sh -n 40 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1 > "$L/shard-$n.log" 2>&1 &
    pids="$pids $!"; names="$names $n"
  done
  rc=0; set -- $names
  for p in $pids; do wait "$p"; r=$?; ex "shard-$1" "$r"; [ "$r" -ne 0 ] && rc=1; shift; done
  return $rc
}

case "$WHAT" in
  smoke)
    git rev-parse --short HEAD > "$L/tree.txt"
    R5DPB_SEEDS="${R5DPB_SEEDS:-r3m-city-none-0-37,jp6-city-8}" R5DPB_SHARD=0/1 R5DPB_OUT="$L/shard-0.ndjson" xmutex sh scripts/gate-tail.sh -n 40 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1 > "$L/smoke.log" 2>&1
    ex smoke $?
    node "$D/aggregate.mjs" "$L"/shard-0.ndjson > "$L/tables.md" 2> "$L/agg.err"; ex agg $? ;;
  full)
    git rev-parse --short HEAD > "$L/tree.txt"
    echo "full: queued $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$L/exits.txt"
    xmutex sh "$D/run.sh" "$L" __shards; ex full $?
    node "$D/aggregate.mjs" "$L"/shard-*.ndjson > "$L/tables.md" 2> "$L/agg.err"; ex agg $? ;;
  __shards) shards ;;
  agg) node "$D/aggregate.mjs" "$L"/shard-*.ndjson > "$L/tables.md" 2> "$L/agg.err"; ex agg $? ;;
  *) echo "run.sh: smoke | full | agg" >&2; exit 2 ;;
esac
