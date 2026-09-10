#!/bin/sh
# _lib.sh — shared law for the L-PROBE dark-arm battery. POSIX sh; sourced, never run.
#
# ⛔ THREE LAWS THIS FILE EXISTS TO MAKE UNSKIPPABLE
#  1. A FALLBACK BRANCH MUST NEVER PRINT A FINDING. Every helper here either measures and
#     prints what it measured, or fails loudly. There is no `|| echo "<claim>"` anywhere.
#  2. EVERY EXIT IS CAPTURED IN-SHELL. `step` writes `TRUE_EXIT_<name>=<status>` to the
#     receipt file the moment the child returns. A task notification is not a receipt.
#  3. THE TREE IS NEVER WRITTEN. Anything that needs to drop a file next to product code
#     runs inside a FARM (see `farm_make`): tests/ copied, every other top-level entry
#     symlinked. Two lanes measured the old probe writing a temp file into a tree that was
#     about to be gated.

set -e

# ── Receipt plumbing ────────────────────────────────────────────────────────────
# EXITS_FILE is appended to by `step`. TRUE_EXIT is the running worst status.
: "${EXITS_FILE:?_lib.sh: EXITS_FILE must be set by the caller}"
TRUE_EXIT=0

log() { printf '%s\n' "$*" >&2; }

# note <name> <status> — record one TRUE_EXIT line and fold it into TRUE_EXIT.
note() {
    printf 'TRUE_EXIT_%s=%s\n' "$1" "$2" >> "$EXITS_FILE"
    printf 'TRUE_EXIT_%s=%s\n' "$1" "$2" >&2
    if [ "$2" -ne 0 ]; then TRUE_EXIT="$2"; fi
}

# step <name> <command...> — run a command, capture its EXACT status, record it.
# Never masks: the status recorded is the child's own, and TRUE_EXIT rises with it.
# `set -e` is suspended only across the child so the status can be read.
# ⭐ IN DRY MODE THE CHILD STILL RUNS — WITH `--dry` APPENDED. Every helper in this kit
# accepts `--dry` and, under it, prints the exact commands it would issue and touches
# nothing. A dry mode that only echoed this driver's own idea of the plan would be a
# SECOND account of the work, free to drift from what the helpers actually do; running
# them makes the plan the helpers' own statement. The exit is captured either way.
step() {
    _name="$1"; shift
    if [ "${DRY:-0}" = "1" ]; then
        log "── DRY step $_name: $* --dry"
        set +e
        "$@" --dry
        _st=$?
        set -e
        printf 'DRY_TRUE_EXIT_%s=%s\n' "$_name" "$_st" >> "$EXITS_FILE"
        printf 'DRY_TRUE_EXIT_%s=%s\n' "$_name" "$_st" >&2
        if [ "$_st" -ne 0 ]; then TRUE_EXIT="$_st"; fi
        return 0
    fi
    log "── step $_name: $*"
    set +e
    "$@"
    _st=$?
    set -e
    note "$_name" "$_st"
    return 0
}

# ── The quiet-window law ────────────────────────────────────────────────────────
# THREE CONSECUTIVE 60-SECOND PROBES must each show load-1 < 4.0 AND zero live
# vitest/dist/worker processes. A single instantaneous glance is what produced the
# under-load FALSE REDS this law exists to prevent (DOOR 3's timeout).
#
# ⛔ The counter greps `[v]itest` so the grep itself is never counted, and it EXCLUDES
# this battery's own pids. It returns a COUNT on stdout and nothing else; a failure to
# measure is an error exit, never a printed zero.
QUIET_LOAD_CEILING="${QUIET_LOAD_CEILING:-4.0}"
QUIET_PROBES="${QUIET_PROBES:-3}"
QUIET_INTERVAL="${QUIET_INTERVAL:-60}"

load1() {
    # darwin: "load averages: 2.34 2.11 1.98"; linux: "load average: 2.34, 2.11, 1.98"
    uptime | sed -e 's/.*load average[s]*:[ ]*//' -e 's/,/ /g' | awk '{print $1}'
}

busy_count() {
    # Live runners of the three families that make a measurement untrustworthy.
    ps -Ao pid=,command= \
        | grep -E '[v]itest|[d]ist/workers|node .*[w]orker' \
        | grep -v -F "$$" \
        | wc -l \
        | tr -d ' '
}

# quiet_window — block until the law is satisfied, or fail. Prints every probe.
quiet_window() {
    if [ "${DRY:-0}" = "1" ]; then
        log "DRY quiet_window: would require $QUIET_PROBES consecutive probes, load-1 < $QUIET_LOAD_CEILING, busy == 0, ${QUIET_INTERVAL}s apart"
        return 0
    fi
    _ok=0
    _tries=0
    while [ "$_ok" -lt "$QUIET_PROBES" ]; do
        _tries=$((_tries + 1))
        if [ "$_tries" -gt 40 ]; then
            log "quiet_window: 40 probes without $QUIET_PROBES consecutive quiet readings — REFUSING to run under load."
            return 4
        fi
        _l=$(load1)
        _b=$(busy_count)
        # awk returns 1 (true) when the load is under the ceiling.
        if [ "$_b" -eq 0 ] && awk -v a="$_l" -v c="$QUIET_LOAD_CEILING" 'BEGIN{exit !(a+0 < c+0)}'; then
            _ok=$((_ok + 1))
            log "quiet probe $_ok/$QUIET_PROBES: load1=$_l busy=$_b  OK"
        else
            _ok=0
            log "quiet probe reset: load1=$_l busy=$_b  (ceiling $QUIET_LOAD_CEILING, busy must be 0)"
        fi
        [ "$_ok" -ge "$QUIET_PROBES" ] || sleep "$QUIET_INTERVAL"
    done
    return 0
}

# ── The gate mutex ──────────────────────────────────────────────────────────────
# EVERY vitest invocation in this battery goes through the tree's own mutex. A run
# that skipped it returned a sibling's workers as SKIPS and read green.
# ⛔ `gate-mutex --run` give-up exit 3 is NOT-RUN. It is never green, and `step` records
# it as 3 so the receipt can never be misread as a pass.
mutexed() {
    _tree="$1"; shift
    sh "$_tree/scripts/gate-mutex.sh" --run -- "$@"
}

# mutexed_shared <tree> <cmd...> — the SHARED tier. Refused by the mutex without a
# worker cap, so the cap is written here rather than left to the caller to remember.
mutexed_shared() {
    _tree="$1"; shift
    GATE_MUTEX_TIER=shared sh "$_tree/scripts/gate-mutex.sh" --run -- "$@" --maxWorkers=2
}

# ── The farm ────────────────────────────────────────────────────────────────────
# farm_make <tree> <farmdir> — a scratch root where `tests/` is a real COPY (walkers
# Dirent-type-check and do not follow symlinks) and every other top-level entry is a
# symlink into the tree. The tree receives ZERO writes.
#
# ⛔ node_modules is symlinked, NEVER materialised: a dock with real package copies
# reads a FALSE RED against the first-paint byte budget (measured, both directions).
farm_make() {
    _tree="$1"; _farm="$2"
    [ -d "$_tree" ] || { log "farm_make: no such tree $_tree"; return 2; }
    mkdir -p "$_farm"
    for _e in $(ls -A "$_tree"); do
        [ "$_e" = ".git" ] && continue
        if [ "$_e" = "tests" ]; then
            cp -R "$_tree/tests" "$_farm/tests"
        else
            ln -s "$_tree/$_e" "$_farm/$_e"
        fi
    done
    [ -d "$_farm/tests/lint" ] || { log "farm_make: farm has no tests/lint — copy failed"; return 2; }
}

farm_drop() {
    _farm="$1"
    [ -n "$_farm" ] || return 0
    case "$_farm" in
        /*farm.*) rm -rf "$_farm" ;;
        *) log "farm_drop: refusing to remove '$_farm' — not a farm path"; return 2 ;;
    esac
    if [ -e "$_farm" ]; then log "farm_drop: farm not removed: $_farm"; return 1; fi
}

# ── Receipt-file guards ─────────────────────────────────────────────────────────
# ⛔ AN EMPTY FILE PASSES `sh -n`, SO A LOST SCRIPT REPORTS GREEN. Gate on non-empty
# AND on the presence of the thing the file is supposed to contain, then COUNT.
expect_file() {
    _f="$1"; _needle="$2"; _label="$3"
    if [ ! -s "$_f" ]; then
        log "MISSING OUTPUT: $_label — $_f is absent or zero bytes"
        return 1
    fi
    if [ -n "$_needle" ] && ! grep -q -- "$_needle" "$_f"; then
        log "SUSPECT OUTPUT: $_label — $_f does not contain '$_needle'"
        return 1
    fi
    log "output ok: $_label -> $_f ($(wc -c < "$_f" | tr -d ' ') bytes)"
    return 0
}
