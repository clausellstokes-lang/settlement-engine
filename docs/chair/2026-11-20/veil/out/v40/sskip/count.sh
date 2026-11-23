#!/bin/sh
# R5D-SSKIP's lock turn (N101, N102): the deciding count (SSKIP_NT=1, the N63 closure in the never-there) and N102's classes on
# the stored pools today and master, and the first measure on the born pools (A full, R5-RECENT full, act T), four side by side
# under ONE hold of the mutex. A's born pool also writes its births' sha256 (the "before" of the same-seed byte check).
#   sh count.sh <outdir>      (from the worktree; no git repository variable reaches a run)
O="${1:?outdir}"; mkdir -p "$O" || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
P=$(cd "$(dirname "$0")" && pwd)/sskip-measure.mjs
cd /home/user/wt/sskip || exit 2
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) head $(git rev-parse HEAD)" > "$O/exits.txt"
run() { n=$1; shift; env SSKIP_NT=1 "$@" > "$O/m-$n.txt" 2>&1; echo "$n rc=$? $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$O/exits.txt"; }
run today node "$P" /var/tmp/v18/t2/stored-v40/today &
run master node "$P" /var/tmp/v18/t2/stored-v40/master &
run born-a env SSKIP_SHAS="$O/births-before-born-a.tsv" node "$P" born-a &
(run born-recent node "$P" born-recent; run actT node "$P" actT) &
wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$O/exits.txt"
! grep -q " rc=[1-9]" "$O/exits.txt"
