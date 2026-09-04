#!/bin/sh
# pre-gate.sh — the logging wrapper around scripts/pre-gate.mjs.
#
# ⚠ THE LAST LINE IS THE WHOLE POINT. A background task reports the exit status of its LAST
# command, and this program was bitten by exactly that on 2026-09-02: a wrapper whose final act
# was a `printf` reported 0 over a red gate. So the engine's status is captured into TRUE_EXIT
# the instant it returns, printed as a grep-able line, and the script ENDS on `exit $TRUE_EXIT`.
# Nothing may be added after it.
#
# ⚠ SECOND LAW EARNED THE SAME NIGHT: a `sed`-patched wrapper died at parse time and burned a
# gate slot. Run `sh -n scripts/pre-gate.sh` after ANY edit to this file, before running it.
#
# Usage:  sh scripts/pre-gate.sh [--list]
#         sh scripts/pre-gate.sh > /path/pre-gate.log 2>&1

set -u

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd) || exit 2
cd "$ROOT" || exit 2

printf 'PREGATE_PID=%s\n' "$$"
printf 'PREGATE_CWD=%s\n' "$ROOT"
printf 'PREGATE_HEAD=%s\n' "$(git rev-parse HEAD 2>/dev/null || echo unknown)"
printf 'PREGATE_PORCELAIN=[%s]\n' "$(git status --porcelain 2>/dev/null | tr '\n' ' ')"
printf 'PREGATE_LOAD=%s\n' "$(uptime | sed 's/.*average[s]*: //')"
printf 'PREGATE_START=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '\n'

node scripts/pre-gate.mjs "$@"
TRUE_EXIT=$?

printf '\n'
printf 'TRUE_EXIT=%s\n' "$TRUE_EXIT"
printf 'PREGATE_END=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

exit $TRUE_EXIT
