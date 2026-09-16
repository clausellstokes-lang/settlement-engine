#!/bin/sh
# gate-tail.sh — run a gate command with truncated output and the TRUE exit code.
#
# THE HAZARD THIS KILLS (bit twice on 2026-07-27 alone): reading a gate through a
# pipe — `npm run check | tail` — reports the PIPE's exit status, not the gate's,
# so a red gate reads as green and the lie survives until someone greps the log
# body. This wrapper writes the full output to a log file, prints only the tail,
# and exits with the gate command's own status.
#
# Usage:
#   sh scripts/gate-tail.sh npm run check
#   sh scripts/gate-tail.sh -n 80 npx vitest run tests/security
#
# The last two lines it prints are the full-log path and the real exit code, so a
# truncated read can never hide the verdict.
LINES=40
if [ "$1" = "-n" ]; then
  LINES="$2"
  shift 2
fi
if [ "$#" -eq 0 ]; then
  echo "usage: sh scripts/gate-tail.sh [-n lines] <command> [args...]" >&2
  exit 2
fi
LOG="${TMPDIR:-/tmp}/gate-tail.$$.log"
"$@" >"$LOG" 2>&1
code=$?
tail -n "$LINES" "$LOG"
echo "[gate-tail] full log: $LOG"
echo "[gate-tail] exit: $code (the gate's own status, not a pipe's)"
exit $code
