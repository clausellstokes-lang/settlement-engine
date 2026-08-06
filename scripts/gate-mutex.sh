#!/bin/sh
# gate-mutex.sh — is the vitest gate slot free?
#
# USE THIS INSTEAD OF SPELLING THE CHECK YOURSELF.
#   sh scripts/gate-mutex.sh          # exit 0 = FREE, exit 1 = HELD (prints the holder)
#   sh scripts/gate-mutex.sh --wait   # block until free, then exit 0; exit 3 on timeout
#
# WHY THIS FILE EXISTS — a bug that cost real time, twice, and was CONFIRMED live.
#
# This program runs ONE vitest lane per machine: two concurrent runs produce FAKE reds
# that lanes have then "repaired". So every brief tells agents to gate a test run on a
# check for a running vitest, and the idiom everyone reaches for is:
#
#     ps aux | grep -c "[v]itest"          # <-- DO NOT USE THIS
#
# The bracket stops grep matching the PATTERN. It does NOT stop grep matching the rest
# of YOUR OWN command line, which `ps aux` faithfully prints. Any other occurrence of
# the plain word on that line — an `echo "=== vitest lanes ==="` label, or the very
# `npx vitest run ...` you are about to execute after the wait loop — matches, and the
# count comes back non-zero with NOTHING actually running.
#
# MEASURED CONSEQUENCE, 2026-08-06: a build agent wrote
#     until [ "$(ps aux | grep -c '[v]itest')" -eq 0 ] || [ $i -ge 40 ]; do sleep 30; done
#     ... npx vitest run tests/lint tests/property tests/security
# in ONE command. The trailing `npx vitest run` put the word on its own command line, so
# the predicate could NEVER reach zero. It slept 30s x 40 = TWENTY MINUTES against a
# mutex nobody held, then gave up and exited without running the gate at all. Reproduced
# under control: bracket-grep alone returned 1 (that one hit being the poller's own
# shell); the same grep on a line that also carried the plain word returned 3.
#
# The failure mode is the nastiest kind: it looks like patience. Nothing errors, nothing
# reds, the lane just quietly does not run its gate.
#
# HOW THIS SCRIPT AVOIDS IT: it never counts. It (a) considers only real vitest RUNNER
# processes, (b) excludes its own process ancestry — this script, the shell that invoked
# it, and that shell's parents, which are exactly the processes carrying your command
# text — and (c) PRINTS THE SURVIVING PROCESS LINES so a positive is always auditable.
# A count is never evidence; a pid is.

set -u

WAIT_MODE=0
[ "${1:-}" = "--wait" ] && WAIT_MODE=1

MAX_POLLS="${GATE_MUTEX_MAX_POLLS:-40}"
POLL_SECONDS="${GATE_MUTEX_POLL_SECONDS:-30}"

# Ancestry of this process: self, the calling shell, and every parent up to init.
# These are the processes whose command lines contain whatever the caller typed.
ancestry_of_self() {
    _p=$$
    while [ -n "$_p" ] && [ "$_p" -gt 1 ] 2>/dev/null; do
        printf '%s\n' "$_p"
        _p=$(ps -o ppid= -p "$_p" 2>/dev/null | tr -d ' ')
    done
}

# Print any genuine vitest runner, one per line, excluding our own ancestry.
#
# TWO exclusions are needed, and the second was only found by testing this script
# against the live incident it was written for:
#
#   1. OWN ANCESTRY — this script, the shell that invoked it, and that shell's parents.
#      Those are the processes carrying the caller's own command text, which is what
#      made the naive `grep -c` idiom self-match.
#
#   2. THE EXECUTABLE MUST BE node/npx/vitest ITSELF — not merely a process whose
#      command line CONTAINS the word. On first test this script reported a sibling
#      agent's `/bin/zsh -c ... npx vitest run ...` as a holder. That shell was
#      WAITING to run vitest and had not started it; the text was in its argv, the
#      process was not a runner. Reporting it would have made one waiting lane block
#      another waiting lane forever — a deadlock strictly worse than the bug being
#      fixed. So we test the FIRST token (the executable) and require vitest in argv.
holders() {
    _anc=$(ancestry_of_self | tr '\n' ' ')
    ps -Ao pid=,command= 2>/dev/null | while IFS= read -r _line; do
        _pid=${_line%% *}
        [ -z "$_pid" ] && continue
        case " $_anc " in *" $_pid "*) continue ;; esac
        # argv[0] is the token after the pid; strip the pid then take the first word.
        _rest=${_line#* }
        _exe=${_rest%% *}
        case "$_exe" in
            *gate-mutex*) continue ;;
            *node|*node.exe|*npx|*vitest) ;;   # a plausible runner executable
            *) continue ;;                     # a shell/editor/grep merely naming it
        esac
        case "$_rest" in
            *vitest*) printf '%s\n' "$_line" ;;
        esac
    done
}

report() {
    _h=$(holders)
    if [ -z "$_h" ]; then
        echo "gate-mutex: FREE — no vitest runner outside this process's ancestry."
        return 0
    fi
    echo "gate-mutex: HELD by:"
    printf '%s\n' "$_h" | sed 's/^/  /'
    return 1
}

if [ "$WAIT_MODE" -eq 0 ]; then
    report
    exit $?
fi

i=0
while [ "$i" -lt "$MAX_POLLS" ]; do
    if [ -z "$(holders)" ]; then
        echo "gate-mutex: acquired after $i poll(s)."
        exit 0
    fi
    i=$((i + 1))
    sleep "$POLL_SECONDS"
done

echo "gate-mutex: GAVE UP after $i poll(s) — still held by:"
holders | sed 's/^/  /'
echo "gate-mutex: if the list above is EMPTY, this script has a bug — report it, do not"
echo "gate-mutex: work around it by removing the wait."
exit 3
