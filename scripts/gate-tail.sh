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
# THE LOAD CONTEXT, STAMPED IN THE LOG BODY (HUNT-1 Cure 3). A stray timeout is
# classified by asking what else the box was doing; that answer was reconstructed from
# memory, after the fact, every time. Stamped here it is evidence. `getconf
# _NPROCESSORS_ONLN` is the portable core count — no `nproc` dependency. The stamps go
# in the BODY: the contract that the last two printed lines are the full-log path and
# the real exit code is byte-preserved.
{ echo "[gate-tail] start: $(uptime) · cores: $(getconf _NPROCESSORS_ONLN)"; } >"$LOG"
"$@" >>"$LOG" 2>&1
code=$?
echo "[gate-tail] end: $(uptime)" >>"$LOG"
tail -n "$LINES" "$LOG"
echo "[gate-tail] full log: $LOG"
echo "[gate-tail] exit: $code (the gate's own status, not a pipe's)"
exit $code
