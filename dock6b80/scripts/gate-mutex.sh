#!/bin/sh
# gate-mutex.sh — inspect, wait for, or atomically hold the Vitest gate slot.
#
#   sh scripts/gate-mutex.sh
#       Inspect only: exit 0 when no held lock or legacy Vitest runner exists,
#       exit 1 and print the owner otherwise.
#
#   sh scripts/gate-mutex.sh --wait
#       Preserve the bounded legacy wait mode. This observes; it does not reserve
#       the slot, so new callers should prefer --run.
#
#   sh scripts/gate-mutex.sh --run -- <command...>
#       Atomically acquire the machine lock, wait out an already-running legacy
#       Vitest process, run the command while holding ownership, return the
#       child's exact status, and release only this process's lock.
#
#   GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- <command...>
#       Enter the SHARED tier instead: a small, worker-capped targeted run that
#       proceeds CONCURRENTLY with other shared runs. See "THE TWO TIERS" below.
#
# ── THE TWO TIERS (ODQ §778.2, TE-EFF-1 car 1) ────────────────────────────────────
# ⛔ THIS TIERS THE MUTEX, NOT THE GATE. DESIGN_BUILD_EFFICIENCY §7 refuses "gate
# tiering or conditional steps" PERMANENTLY, and nothing here touches that: every
# step of `npm run check` still runs, unconditionally, under the EXCLUSIVE tier
# exactly as before. What is tiered is ADMISSION — which runs may be in flight at
# the same moment — and the volume's own prime constraint is the reason the split
# is drawn here: the gate is amortized, never thinned.
#
#   EXCLUSIVE (the default, and every undeclared caller):
#     the full gate, `check:tail`, `npm run check`, `test:ratchet` — anything that
#     runs the whole suite. Semantics are BYTE-FOR-BYTE what they were: acquire the
#     atomic directory, wait out legacy runners, run alone.
#
#   SHARED (declared, never inferred):
#     a targeted `npx vitest run <files>` that has DECLARED itself with
#     `GATE_MUTEX_TIER=shared` and CARRIES A HARD WORKER CAP. Shared runs proceed
#     concurrently with each other. They are refused without the cap, because the
#     whole basis for admitting them concurrently is that they cannot saturate the
#     box — an uncapped "targeted" run is a full-load run wearing a small name.
#
# THE ORDERING, and why no exclusive run can starve: an exclusive caller acquires
# $LOCK_DIR FIRST and drains the shared pool SECOND. A shared entrant refuses to
# enter while $LOCK_DIR exists, so from the instant the exclusive caller holds the
# directory the shared population can only SHRINK. Exclusion therefore holds in
# BOTH directions — a live exclusive holder blocks new shared entrants, and a
# PENDING exclusive (holding the lock, still draining) blocks them too.

set -u

MAX_POLLS="${GATE_MUTEX_MAX_POLLS:-40}"
POLL_SECONDS="${GATE_MUTEX_POLL_SECONDS:-30}"
# ⛔ THE LOCK PATH IS PINNED MACHINE-WIDE, NEVER DERIVED FROM TMPDIR (ODQ §747.4(1)
# diagnosis, 2026-08-29). The default used to read `${TMPDIR:-/tmp}/…`, and macOS gives
# each launch context its own per-user TMPDIR — so a lane whose shell carried
# `TMPDIR=/var/folders/…` and a lane whose shell resolved to `/tmp` locked two
# PHYSICALLY DIFFERENT directories and were not mutually excluded at all. Both printed
# "acquired atomic lock", and the mutex was blamed for an identity failure it never had:
# `mkdir` is atomic, but only per path. `/tmp` is stable per-boot and per-machine; the
# `$(id -u)` suffix keeps the pid probe (`kill -0`) from hitting cross-user EPERM, which
# would otherwise let one user's live holder look dead to another's reclaim arm.
LOCK_DIR="${GATE_MUTEX_LOCK_DIR:-/tmp/settlementforge-vitest-gate.$(id -u).lock}"
# ⛔⛔ THE ALIAS FOLD — PINNING THE DEFAULT WAS ONLY HALF THE IDENTITY PROPERTY.
# The paragraph above cured the DEFAULT. It did not cure the OVERRIDE, and the
# override is what every lane actually uses: `docs/LANE_LAW_ADDENDUM_EFF1.md` §2
# instructs every lane, twice, to
#     export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock
# which is NOT this script's default — the default carries a `$(id -u)` suffix. So
# `npm run check:tail` (the REAL GATE, which exports nothing) and every lane's
# targeted run (which exports the documented string) were locking two physically
# different directories, and the comment below this one asserted they were mutually
# excluded while they were not. The shared pool lived beside one path and the
# exclusive gate held the other, so the addendum's central safety claim — "a live
# exclusive holder excludes them" — was void for exactly the population it was
# written for. A sibling lane measured load 345 on 8 cores and three red gate runs.
#
# THE CURE IS IN THE ACQUIRER, NOT IN THE DOCS. A doc fix cannot reach the briefs
# already in flight, and the next lane law to name a path will be wrong the same
# way. Every historical and documented spelling of THE GATE'S OWN LOCK FAMILY folds
# here onto one canonical path, so a lane on any base and a lane on tip cannot both
# believe they hold "the" lock. The fold key is the FAMILY NAME, never the
# directory — that is what makes it independent of TMPDIR, of the launch context,
# and of which base the caller's script came from. A path outside the family (the
# per-test temp locks in tests/scripts/gateMutex.test.js) is left untouched, which
# is what keeps a deliberately isolated lock deliberately isolated.
GATE_MUTEX_CANONICAL_LOCK_DIR="/tmp/settlementforge-vitest-gate.$(id -u).lock"
_gm_uid="$(id -u)"
_gm_stripped="$LOCK_DIR"
while [ "${_gm_stripped%/}" != "$_gm_stripped" ]; do _gm_stripped="${_gm_stripped%/}"; done
case "${_gm_stripped##*/}" in
    settlementforge-vitest-gate.lock|"settlementforge-vitest-gate.${_gm_uid}.lock")
        if [ "$_gm_stripped" != "$GATE_MUTEX_CANONICAL_LOCK_DIR" ]; then
            echo "gate-mutex: folding lock alias '$LOCK_DIR' onto the canonical" \
                 "'$GATE_MUTEX_CANONICAL_LOCK_DIR' — one lock family, one path." >&2
        fi
        LOCK_DIR="$GATE_MUTEX_CANONICAL_LOCK_DIR"
        ;;
esac
unset _gm_stripped
OWNER_FILE="$LOCK_DIR/pid"
REAPER_DIR="${LOCK_DIR}.reaper"
REAPER_OWNER_FILE="$REAPER_DIR/pid"
LEGACY_SCAN="${GATE_MUTEX_LEGACY_SCAN:-1}"
ORPHAN_GRACE_MINUTES="${GATE_MUTEX_ORPHAN_GRACE_MINUTES:-10}"
# ⛔ THE TIER IS DECLARED, NEVER INFERRED. An undeclared caller is EXCLUSIVE, which is
# what keeps every standing incantation — including the bare `check:tail` and every
# lane brief's exported GATE_MUTEX_LOCK_DIR idiom — working with its semantics
# unchanged. There is deliberately no heuristic that reads the command line and
# decides a run "looks small": the one thing worse than a serialized gate is a gate
# that silently stopped serializing.
TIER="${GATE_MUTEX_TIER:-exclusive}"
# The shared pool is a DIRECTORY OF PID FILES beside the lock, not an integer counter.
# A counter cannot be reaped: when the count says 3 and one holder was killed, nothing
# on disk says WHICH, so the slot is lost until a human clears it — the exact defect
# §351.2 cured for the primary lock. One file named by its holder's pid is reapable by
# the same `kill -0` evidence the lock reaper already uses, and two entrants never
# write the same path, so the registration needs no lock of its own.
SHARED_DIR="${LOCK_DIR}.shared"
SHARED_MAX_WORKERS="${GATE_MUTEX_SHARED_MAX_WORKERS:-2}"
OWN_LOCK=0
OWN_REAPER=0
OWN_SHARED=0

case "$MAX_POLLS" in
    ''|*[!0-9]*)
        echo "gate-mutex: GATE_MUTEX_MAX_POLLS must be a non-negative integer." >&2
        exit 2
        ;;
esac
case "$POLL_SECONDS" in
    ''|*[!0-9.]*|*.*.*)
        echo "gate-mutex: GATE_MUTEX_POLL_SECONDS must be a non-negative number." >&2
        exit 2
        ;;
esac
case "$LOCK_DIR" in
    ''|'/'|'.'|'..')
        echo "gate-mutex: refusing unsafe GATE_MUTEX_LOCK_DIR '$LOCK_DIR'." >&2
        exit 2
        ;;
esac
case "$LEGACY_SCAN" in
    0|1) ;;
    *)
        echo "gate-mutex: GATE_MUTEX_LEGACY_SCAN must be 0 or 1." >&2
        exit 2
        ;;
esac
case "$ORPHAN_GRACE_MINUTES" in
    ''|*[!0-9]*)
        echo "gate-mutex: GATE_MUTEX_ORPHAN_GRACE_MINUTES must be a non-negative integer." >&2
        exit 2
        ;;
esac
case "$TIER" in
    exclusive|shared) ;;
    *)
        echo "gate-mutex: GATE_MUTEX_TIER must be 'exclusive' or 'shared' (got '$TIER')." >&2
        exit 2
        ;;
esac
# ⛔⛔ THE TIER IS CONSUMED HERE, NEVER INHERITED — AND THIS WAS FOUND BY DOG-FOODING, NOT BY
# REASONING. Every other GATE_MUTEX_* variable is a per-SESSION setting a lane exports once; the
# tier is a property of ONE INVOCATION. Left exported it descends into the child, so a lane running
# `GATE_MUTEX_TIER=shared gate-mutex.sh --run -- <anything that itself calls gate-mutex>` turns
# every nested acquisition into a shared request it never declared. Measured: with the tier
# inherited, twelve arms of tests/scripts/gateMutex.test.js reddened `expected 2 to be 23` — their
# nested `--run` calls carry no worker cap, so the cap guard refused them.
#
# ⭐ AN INHERITED DECLARATION IS AN INFERRED ONE, which the header above already refuses in as many
# words. Unsetting restores the pre-tier behaviour exactly for every nested call: it defaults to
# EXCLUSIVE and contends for the lock the way it always did. (The mutex has never been re-entrant;
# a nested exclusive call inside an outer holder contended before this change too, so nothing new
# is broken — the fallback is simply the one that was always there.) A nested run that genuinely
# wants the shared tier declares it for itself, which is the whole point.
unset GATE_MUTEX_TIER
case "$SHARED_MAX_WORKERS" in
    ''|*[!0-9]*|0)
        echo "gate-mutex: GATE_MUTEX_SHARED_MAX_WORKERS must be a positive integer." >&2
        exit 2
        ;;
esac

usage() {
    echo "usage: sh scripts/gate-mutex.sh [--wait | --run -- <command...>]" >&2
    exit 2
}

read_pid() {
    _pid_file=$1
    [ -f "$_pid_file" ] || return 1
    IFS= read -r _recorded_pid < "$_pid_file" || return 1
    case "$_recorded_pid" in
        ''|*[!0-9]*) return 1 ;;
    esac
    [ "$_recorded_pid" -gt 1 ] 2>/dev/null || return 1
    printf '%s\n' "$_recorded_pid"
}

pid_is_live() {
    kill -0 "$1" 2>/dev/null
}

# A creator killed between `mkdir` and its pid write leaves a directory NOBODY can
# prove dead: read_pid fails, so every recovery arm that demands a readable dead
# owner declines forever and the slot is lost until a human removes it. Age is the
# only honest evidence available for such a directory, so an ownerless guard is
# reclaimable only once it is older than the grace. `find -prune -mmin` is the
# portable age test (BSD and GNU both carry -mmin); `stat` is not, and the script
# stays node-free.
dir_is_aged() {
    [ -n "$(find "$1" -prune -mmin "+$ORPHAN_GRACE_MINUTES" 2>/dev/null)" ]
}

# Ancestry of this process: self, the calling shell, and every parent up to init.
# These command lines contain the caller's own `vitest` text and are not holders.
ancestry_of_self() {
    _p=$$
    while [ -n "$_p" ] && [ "$_p" -gt 1 ] 2>/dev/null; do
        printf '%s\n' "$_p"
        _p=$(ps -o ppid= -p "$_p" 2>/dev/null | tr -d ' ')
    done
}

# Compatibility backstop for Vitest processes started without --run. Require a
# plausible runner executable; a waiting shell merely containing the word is not
# a holder. The atomic directory is the authority for new callers.
holders() {
    [ "$LEGACY_SCAN" -eq 1 ] || return 0
    _anc=$(ancestry_of_self | tr '\n' ' ')
    ps -Ao pid=,command= 2>/dev/null | while IFS= read -r _raw_line; do
        _line=$(printf '%s\n' "$_raw_line" | sed 's/^[[:space:]]*//')
        _pid=${_line%% *}
        [ -n "$_pid" ] || continue
        case " $_anc " in *" $_pid "*) continue ;; esac
        _rest=${_line#* }
        _exe=${_rest%% *}
        case "$_exe" in
            *gate-mutex*) continue ;;
            *node|*node.exe|*npx|*vitest) ;;
            *) continue ;;
        esac
        case "$_rest" in
            *vitest*) printf '%s\n' "$_line" ;;
        esac
    done
}

# ── THE SHARED POOL ──────────────────────────────────────────────────────────────
# Reap by the SAME evidence the primary lock reaper demands: a pid that `kill -0`
# says is gone. A non-numeric entry is also removed — nothing this script writes can
# produce one (the filename is always `$$`), so leaving it would let a stray byte
# deadlock the exclusive drain forever, which is the failure mode the ownerless-lock
# cure exists to refuse.
# ⚠ PID REUSE IS THE ONE HOLE, AND IT FAILS SAFE: a recycled pid makes a dead entry
# look live, so the exclusive caller WAITS LONGER. It can never make a live holder
# look dead, so it can never admit a concurrent run. This is the same exposure the
# primary lock already carries and it is bounded by MAX_POLLS.
reap_shared() {
    [ -d "$SHARED_DIR" ] || return 0
    for _shared_entry in "$SHARED_DIR"/*; do
        [ -e "$_shared_entry" ] || continue
        _shared_name=${_shared_entry##*/}
        case "$_shared_name" in
            ''|*[!0-9]*) rm -f "$_shared_entry"; continue ;;
        esac
        pid_is_live "$_shared_name" || rm -f "$_shared_entry"
    done
}

live_shared_count() {
    reap_shared
    _shared_n=0
    if [ -d "$SHARED_DIR" ]; then
        for _shared_entry in "$SHARED_DIR"/*; do
            [ -e "$_shared_entry" ] || continue
            _shared_n=$((_shared_n + 1))
        done
    fi
    printf '%s\n' "$_shared_n"
}

enter_shared() {
    mkdir -p "$SHARED_DIR" 2>/dev/null || return 1
    printf '%s\n' "$$" > "$SHARED_DIR/$$" || return 1
    OWN_SHARED=1
    return 0
}

release_shared_slot() {
    [ "$OWN_SHARED" -eq 1 ] || return 0
    rm -f "$SHARED_DIR/$$"
    # Best-effort only: a concurrent shared sibling legitimately keeps it non-empty.
    rmdir "$SHARED_DIR" 2>/dev/null || true
    OWN_SHARED=0
}

# THE CAP IS A CONDITION OF ENTRY, NOT A SUGGESTION. The whole basis for admitting
# shared runs concurrently is that a capped targeted run cannot saturate the box, so
# a shared-tier caller that carries no cap is REFUSED rather than admitted-and-warned.
# A cap ABOVE the ceiling is refused too: `--maxWorkers=64` satisfies "carries a cap"
# while defeating every reason the cap exists, and a guard that a caller can satisfy
# vacuously is not a guard.
declared_worker_cap() {
    _cap_next=0
    for _cap_arg in "$@"; do
        if [ "$_cap_next" -eq 1 ]; then
            printf '%s\n' "$_cap_arg"
            return 0
        fi
        case "$_cap_arg" in
            --maxWorkers=*|--max-workers=*) printf '%s\n' "${_cap_arg#*=}"; return 0 ;;
            --maxWorkers|--max-workers) _cap_next=1 ;;
        esac
    done
    return 1
}

require_worker_cap() {
    if ! _cap=$(declared_worker_cap "$@"); then
        echo "gate-mutex: SHARED tier REFUSED — the command declares no worker cap." >&2
        echo "  A shared run is admitted concurrently only because it cannot saturate the box." >&2
        echo "  Add --maxWorkers=$SHARED_MAX_WORKERS (or run without GATE_MUTEX_TIER=shared to take" >&2
        echo "  the exclusive slot)." >&2
        return 2
    fi
    case "$_cap" in
        ''|*[!0-9]*|0)
            echo "gate-mutex: SHARED tier REFUSED — worker cap '$_cap' is not a positive integer." >&2
            return 2
            ;;
    esac
    if [ "$_cap" -gt "$SHARED_MAX_WORKERS" ]; then
        echo "gate-mutex: SHARED tier REFUSED — worker cap $_cap exceeds the ceiling of" >&2
        echo "  $SHARED_MAX_WORKERS. A cap above the ceiling is a full-load run wearing a small name." >&2
        return 2
    fi
    return 0
}

release_reaper() {
    [ "$OWN_REAPER" -eq 1 ] || return 0
    _owner=$(read_pid "$REAPER_OWNER_FILE" 2>/dev/null || true)
    if [ "$_owner" = "$$" ]; then
        rm -f "$REAPER_OWNER_FILE"
        rmdir "$REAPER_DIR" 2>/dev/null || true
    fi
    OWN_REAPER=0
}

release_owned_lock() {
    [ "$OWN_LOCK" -eq 1 ] || return 0
    _owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    if [ "$_owner" = "$$" ]; then
        rm -f "$OWNER_FILE"
        if ! rmdir "$LOCK_DIR" 2>/dev/null; then
            echo "gate-mutex: owner $$ could not remove non-empty lock '$LOCK_DIR'." >&2
        fi
    else
        echo "gate-mutex: lock ownership changed from $$ to ${_owner:-UNKNOWN}; leaving it intact." >&2
    fi
    OWN_LOCK=0
}

cleanup() {
    release_owned_lock
    release_reaper
    release_shared_slot
}
trap cleanup 0

acquire_reaper() {
    if mkdir "$REAPER_DIR" 2>/dev/null; then
        if ! printf '%s\n' "$$" > "$REAPER_OWNER_FILE"; then
            rmdir "$REAPER_DIR" 2>/dev/null || true
            return 1
        fi
        OWN_REAPER=1
        return 0
    fi

    # A process may itself die while reclaiming a stale primary lock. Recover
    # that tiny guard only when its recorded owner is definitely dead.
    _reaper_owner=$(read_pid "$REAPER_OWNER_FILE" 2>/dev/null || true)
    if [ -n "$_reaper_owner" ] && ! pid_is_live "$_reaper_owner"; then
        rm -f "$REAPER_OWNER_FILE"
        rmdir "$REAPER_DIR" 2>/dev/null || true
    elif [ -z "$_reaper_owner" ] && dir_is_aged "$REAPER_DIR"; then
        # The same killed-mid-acquisition window on the guard itself. Left alone an
        # ownerless reaper dir blocks EVERY primary recovery forever, so the primary
        # cure would be unreachable without this arm.
        rm -f "$REAPER_OWNER_FILE"
        rmdir "$REAPER_DIR" 2>/dev/null || true
    fi
    return 1
}

# The killed-between-mkdir-and-pid-write state on the PRIMARY lock: the directory
# exists with no readable owner, so recover_dead_owner's dead-pid evidence can never
# be produced. Reclaim it only past the grace, and only after re-confirming
# ownerlessness UNDER the reaper guard — the mirror of the dead-owner re-read.
reclaim_ownerless_lock() {
    dir_is_aged "$LOCK_DIR" || return 1
    acquire_reaper || return 1
    _recheck_owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    if [ -z "$_recheck_owner" ] && dir_is_aged "$LOCK_DIR"; then
        rm -f "$OWNER_FILE"
        if rmdir "$LOCK_DIR" 2>/dev/null; then
            echo "gate-mutex: reclaimed ownerless lock aged >${ORPHAN_GRACE_MINUTES}m."
            release_reaper
            return 0
        fi
    fi
    release_reaper
    return 1
}

recover_dead_owner() {
    [ -d "$LOCK_DIR" ] || return 1
    _stale_owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    [ -n "$_stale_owner" ] || { reclaim_ownerless_lock; return $?; }
    pid_is_live "$_stale_owner" && return 1
    acquire_reaper || return 1

    # Re-read under the recovery guard. Only remove the same still-dead owner;
    # never act on a lock that changed while this caller was waiting.
    _current_owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    if [ "$_current_owner" = "$_stale_owner" ] && ! pid_is_live "$_current_owner"; then
        rm -f "$OWNER_FILE"
        if rmdir "$LOCK_DIR" 2>/dev/null; then
            echo "gate-mutex: reclaimed stale lock from dead PID $_current_owner."
            release_reaper
            return 0
        fi
    fi
    release_reaper
    return 1
}

try_acquire_lock() {
    if mkdir "$LOCK_DIR" 2>/dev/null; then
        if ! printf '%s\n' "$$" > "$OWNER_FILE"; then
            rmdir "$LOCK_DIR" 2>/dev/null || true
            echo "gate-mutex: could not record lock owner in '$OWNER_FILE'." >&2
            return 2
        fi
        OWN_LOCK=1
        return 0
    fi
    # The owner may release between this caller's failed mkdir and inspection.
    # A now-absent path is ordinary contention resolution: retry, do not turn
    # the release race into a false "non-directory" hard error.
    if [ ! -e "$LOCK_DIR" ]; then
        return 1
    fi
    if [ ! -d "$LOCK_DIR" ]; then
        echo "gate-mutex: lock path exists but is not a directory: '$LOCK_DIR'." >&2
        return 2
    fi
    # A successful reclaim made the directory available NOW. Retry the atomic
    # mkdir in this call instead of charging one full poll interval (and, for a
    # zero-poll caller, incorrectly giving up after making the slot free).
    if recover_dead_owner >/dev/null 2>&1 && mkdir "$LOCK_DIR" 2>/dev/null; then
        if ! printf '%s\n' "$$" > "$OWNER_FILE"; then
            rmdir "$LOCK_DIR" 2>/dev/null || true
            echo "gate-mutex: could not record lock owner in '$OWNER_FILE'." >&2
            return 2
        fi
        OWN_LOCK=1
        return 0
    fi
    return 1
}

describe_lock() {
    [ -d "$LOCK_DIR" ] || return 1
    _owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    if [ -z "$_owner" ]; then
        echo "gate-mutex: HELD by atomic lock with an unreadable owner: $LOCK_DIR"
    elif pid_is_live "$_owner"; then
        _owner_command=$(ps -p "$_owner" -o command= 2>/dev/null || true)
        echo "gate-mutex: HELD by atomic lock PID $_owner${_owner_command:+: $_owner_command}"
    else
        echo "gate-mutex: STALE atomic lock from dead PID $_owner (use --run to reclaim)."
    fi
    return 0
}

report() {
    # The shared population is REPORTED but does not drive the exit code. Inspect's
    # contract ("exit 0 when no held lock or legacy runner exists") is what existing
    # callers were written against, and a live shared run's own Vitest is already
    # caught by the legacy scan below — so naming the pool adds the datum without
    # moving a single caller's verdict.
    _shared_live=$(live_shared_count)
    [ "$_shared_live" -gt 0 ] && echo "gate-mutex: $_shared_live SHARED holder(s) live in $SHARED_DIR."
    if describe_lock; then
        return 1
    fi
    _h=$(holders)
    if [ -z "$_h" ]; then
        echo "gate-mutex: FREE — no held lock or Vitest runner outside this process's ancestry."
        return 0
    fi
    echo "gate-mutex: HELD by legacy runner:"
    printf '%s\n' "$_h" | sed 's/^/  /'
    return 1
}

wait_for_observed_free() {
    _i=0
    while [ "$_i" -le "$MAX_POLLS" ]; do
        recover_dead_owner >/dev/null 2>&1 || true
        if ! describe_lock >/dev/null 2>&1 && [ -z "$(holders)" ]; then
            echo "gate-mutex: free after $_i poll(s)."
            return 0
        fi
        [ "$_i" -eq "$MAX_POLLS" ] && break
        _i=$((_i + 1))
        sleep "$POLL_SECONDS"
    done
    echo "gate-mutex: GAVE UP after $_i poll(s) — slot remains held."
    describe_lock || holders | sed 's/^/  /'
    return 3
}

run_held() {
    _i=0
    while [ "$_i" -le "$MAX_POLLS" ]; do
        try_acquire_lock
        _acquire_status=$?
        [ "$_acquire_status" -eq 0 ] && break
        [ "$_acquire_status" -eq 2 ] && return 2
        [ "$_i" -eq "$MAX_POLLS" ] && {
            echo "gate-mutex: GAVE UP after $_i poll(s) — atomic lock remains held."
            describe_lock || true
            return 3
        }
        _i=$((_i + 1))
        sleep "$POLL_SECONDS"
    done

    # ── DRAIN THE SHARED POOL ────────────────────────────────────────────────────
    # THE ORDER IS THE ENTIRE NO-STARVATION ARGUMENT, so it is stated where it is
    # relied on: this caller ALREADY HOLDS $LOCK_DIR, and `run_shared` refuses to
    # enter while that directory exists. The shared population can therefore only
    # SHRINK from this line onward, and a stream of small runs cannot hold the gate
    # off indefinitely the way a plain "wait until the pool is empty" would.
    # Bounded like every other wait here: a wedged shared holder must not make the
    # real gate unreachable, so exhaustion is a GAVE UP (exit 3) and the trap
    # releases the lock this caller was holding.
    _shared_i=0
    while [ "$_shared_i" -le "$MAX_POLLS" ]; do
        _shared_live=$(live_shared_count)
        [ "$_shared_live" -eq 0 ] && break
        [ "$_shared_i" -eq "$MAX_POLLS" ] && {
            echo "gate-mutex: GAVE UP after $_shared_i poll(s) — $_shared_live shared holder(s)"
            echo "  remain in $SHARED_DIR:"
            ls "$SHARED_DIR" 2>/dev/null | sed 's/^/    PID /'
            return 3
        }
        _shared_i=$((_shared_i + 1))
        sleep "$POLL_SECONDS"
    done

    # A legacy caller may have started Vitest before this process acquired the
    # directory. Hold the new lock while waiting so no second --run caller races.
    # ⚠ THIS RUNS AFTER THE DRAIN ON PURPOSE. A shared run's own Vitest is a legacy
    # holder to this scan, so scanning first would report the pool the drain is about
    # to empty and turn an orderly drain into a GAVE UP.
    _legacy_i=0
    while [ "$_legacy_i" -le "$MAX_POLLS" ]; do
        _h=$(holders)
        [ -z "$_h" ] && break
        [ "$_legacy_i" -eq "$MAX_POLLS" ] && {
            echo "gate-mutex: GAVE UP after $_legacy_i poll(s) — legacy runner remains held:"
            printf '%s\n' "$_h" | sed 's/^/  /'
            return 3
        }
        _legacy_i=$((_legacy_i + 1))
        sleep "$POLL_SECONDS"
    done

    # NAME THE DIRECTORY AND BOTH COUNTERS. The old line printed only `$_i` and printed
    # AFTER the legacy wait, so a run that sat ~7 minutes in the legacy loop still reported
    # "after 0 poll(s)" — and it never said WHICH directory it locked, the one datum that
    # makes a two-population split visible from any two logs.
    # ⚠ THE SHARED-DRAIN COUNTER IS APPENDED, NEVER INTERLEAVED. `atomic poll(s) +
    # N legacy poll(s)` is asserted as a contiguous substring by the identity arm
    # §747.4(1) landed; splicing the new counter between them would red a guard that
    # is about a different defect entirely.
    echo "gate-mutex: acquired atomic lock at $LOCK_DIR as PID $$ after $_i atomic poll(s) + $_legacy_i legacy poll(s) + $_shared_i shared-drain poll(s)."
    "$@"
    _child_status=$?
    release_owned_lock
    return "$_child_status"
}

# ── THE SHARED TIER ──────────────────────────────────────────────────────────────
# REGISTER, THEN VERIFY. The window this closes is real and one poll wide: an
# exclusive caller can `mkdir "$LOCK_DIR"` between this caller's "is the lock free?"
# test and its own registration, and an entrant that only tested first would then run
# CONCURRENTLY WITH THE GATE while both logs claimed correctness — the §747.4(1)
# failure shape exactly. So the entry registers first and re-tests after, and backs
# out if it lost. The race resolves in the safe direction both ways: the loser
# deregisters and polls, and an exclusive caller that observes the transient entry
# merely waits one drain poll.
run_shared() {
    require_worker_cap "$@" || return 2

    _i=0
    _entered=0
    while [ "$_i" -le "$MAX_POLLS" ]; do
        recover_dead_owner >/dev/null 2>&1 || true
        if [ ! -d "$LOCK_DIR" ]; then
            if ! enter_shared; then
                echo "gate-mutex: could not register a shared holder in '$SHARED_DIR'." >&2
                return 2
            fi
            if [ ! -d "$LOCK_DIR" ]; then
                _entered=1
                break
            fi
            release_shared_slot
        fi
        [ "$_i" -eq "$MAX_POLLS" ] && break
        _i=$((_i + 1))
        sleep "$POLL_SECONDS"
    done

    if [ "$_entered" -ne 1 ]; then
        echo "gate-mutex: GAVE UP after $_i poll(s) — an EXCLUSIVE holder owns the slot."
        describe_lock || true
        return 3
    fi

    # ⚠ THE LEGACY SCAN IS DELIBERATELY NOT RUN HERE. It exists to catch a Vitest
    # started outside this machinery, and every OTHER shared run's Vitest matches it —
    # so scanning would make shared runs exclude each other and the tier would be a
    # slower spelling of the one it was built beside.
    echo "gate-mutex: entered SHARED tier at $SHARED_DIR as PID $$ after $_i poll(s); $(live_shared_count) shared holder(s) live, worker cap <= $SHARED_MAX_WORKERS."
    "$@"
    _child_status=$?
    release_shared_slot
    return "$_child_status"
}

MODE=inspect
case "${1:-}" in
    '') ;;
    --print-lock-dir)
        # The ALIAS FOLD's own witness: print the path this invocation WOULD lock and
        # exit, taking nothing. A guard that had to acquire the real lock to learn its
        # identity could not run inside the gate it guards, so the identity question
        # would go on being answered by reading two files and hoping.
        [ "$#" -eq 1 ] || usage
        printf '%s\n' "$LOCK_DIR"
        exit 0
        ;;
    --wait)
        [ "$#" -eq 1 ] || usage
        MODE=wait
        ;;
    --run)
        shift
        [ "${1:-}" = "--" ] || usage
        shift
        [ "$#" -gt 0 ] || usage
        MODE=run
        ;;
    *) usage ;;
esac

case "$MODE" in
    inspect) report ;;
    wait) wait_for_observed_free ;;
    run)
        # The tier branches HERE and nowhere else, so an undeclared caller reaches
        # `run_held` by exactly the path it always did.
        if [ "$TIER" = shared ]; then
            run_shared "$@"
        else
            run_held "$@"
        fi
        ;;
esac
exit $?
