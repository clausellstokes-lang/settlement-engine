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

set -u

MAX_POLLS="${GATE_MUTEX_MAX_POLLS:-40}"
POLL_SECONDS="${GATE_MUTEX_POLL_SECONDS:-30}"
LOCK_DIR="${GATE_MUTEX_LOCK_DIR:-${TMPDIR:-/tmp}/settlementforge-vitest-gate.lock}"
OWNER_FILE="$LOCK_DIR/pid"
REAPER_DIR="${LOCK_DIR}.reaper"
REAPER_OWNER_FILE="$REAPER_DIR/pid"
LEGACY_SCAN="${GATE_MUTEX_LEGACY_SCAN:-1}"
OWN_LOCK=0
OWN_REAPER=0

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
    fi
    return 1
}

recover_dead_owner() {
    [ -d "$LOCK_DIR" ] || return 1
    _stale_owner=$(read_pid "$OWNER_FILE" 2>/dev/null || true)
    [ -n "$_stale_owner" ] || return 1
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

    # A legacy caller may have started Vitest before this process acquired the
    # directory. Hold the new lock while waiting so no second --run caller races.
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

    echo "gate-mutex: acquired atomic lock as PID $$ after $_i poll(s)."
    "$@"
    _child_status=$?
    release_owned_lock
    return "$_child_status"
}

MODE=inspect
case "${1:-}" in
    '') ;;
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
    run) run_held "$@" ;;
esac
exit $?
