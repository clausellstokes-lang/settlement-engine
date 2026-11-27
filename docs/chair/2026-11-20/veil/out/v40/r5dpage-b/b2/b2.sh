#!/bin/sh
# R5D-PAGE-B2 (VEIL-40), the one runner. Every heavy run through scripts/gate-mutex.sh --run (the EXCLUSIVE tier; a give-up,
# exit 3, is waited out and asked again); no git repository variable reaches a run; vitest read by scripts/gate-tail.sh; every
# log to a file under <logdir>; each step's exit appended to <logdir>/exits.txt with the hour from date -u.
#   sh b2.sh <logdir> dump              THE STORED POOLS (addendum 1, B2 (1)): VEIL-33's dump.sh (out/v33/legacy/, copied from
#                                       216cb46d8) over the seed index LP_POOL (default /var/tmp/v18/t2/pool-v40), on THIS tree
#                                       (today-born, publicProse composed as saves.js stores it) and on the scratch detached
#                                       worktree of master db832c892 (master-born; master has no publicProse), into
#                                       /var/tmp/v18/t2/stored-v40/{today,master}/
#   sh b2.sh <logdir> vitest <files..>  the named test files, R5DP_* / R5C6_* env passed through
#   sh b2.sh <logdir> batch <jobs file> [P=3]  every job line `<name> @@ <env assignments> @@ <vitest args>` (args split on blanks: a
#                                       test-name pattern writes a blank as `.`) under ONE hold of the
#                                       mutex, P side by side (each its own pglite chain), each read by gate-tail.sh
W=/home/user/wt/r5desc
M=/home/user/wt/b-master
S=/var/tmp/v18/t2/stored-v40
L="${1:?usage: b2.sh <logdir> dump|vitest}"; WHAT="${2:?}"; shift 2
mkdir -p "$L/tmp" || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
export TMPDIR="$L/tmp"
cd "$W" || exit 2
ex() { echo "$1 rc=$2 $(date -u +%Y-%m-%dT%H:%M:%SZ)${3:+ $3}" >> "$L/exits.txt"; }
xmutex() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ "$r" -ne 3 ] && return "$r"; echo "mutex give-up (3) $(date -u +%H:%M:%S); waiting" >> "$L/mutex-waits.log"; sleep 60; done; }
D=$W/docs/chair/2026-11-20/veil/out/v33/legacy
case "$WHAT" in
  dump)
    P=${LP_POOL:-/var/tmp/v18/t2/pool-v40}
    echo "dump queued $(date -u +%Y-%m-%dT%H:%M:%SZ) pool $P" >> "$L/exits.txt"
    xmutex sh "$D/dump.sh" "$W" "$S/today" "$P" > "$L/dump-today.log" 2>&1; ex dump-today $?
    xmutex sh "$D/dump.sh" "$M" "$S/master" "$P" > "$L/dump-master.log" 2>&1; ex dump-master $? ;;
  vitest)
    echo "vitest queued $(date -u +%Y-%m-%dT%H:%M:%SZ) $*" >> "$L/exits.txt"
    n=$(echo "$*" | tr -c 'a-zA-Z0-9\n' _ | cut -c1-80)
    xmutex sh scripts/gate-tail.sh -n 60 npx vitest run "$@" > "$L/vitest-$n.log" 2>&1; ex "vitest $*" $? "log $L/vitest-$n.log" ;;
  batch)
    J="${1:?jobs file}"; P="${2:-3}"
    echo "batch queued $(date -u +%Y-%m-%dT%H:%M:%SZ) $J P=$P" >> "$L/exits.txt"
    xmutex sh "$0" "$L" __batch "$J" "$P"; ex "batch $J" $? ;;
  __batch)
    J="$1"; P="$2"
    grep -v '^#' "$J" | grep -v '^$' | xargs -P "$P" -I{} sh -c 'line="$1"; L="$2"; n=${line%% @@ *}; r=${line#* @@ }; e=${r%% @@ *}; a=${r#* @@ };
      env $e sh scripts/gate-tail.sh -n 80 npx vitest run $a > "$L/job-$n.log" 2>&1; echo "job $n rc=$? $(date -u +%Y-%m-%dT%H:%M:%SZ) env $e" >> "$L/exits.txt"' _ {} "$L"
    ! grep -q "^job .* rc=[1-9]" "$L/exits.txt" ;;
  *) echo "b2.sh: dump | vitest <files> | batch <jobs> [P]" >&2; exit 2 ;;
esac
