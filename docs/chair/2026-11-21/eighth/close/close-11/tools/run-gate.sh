#!/bin/sh
# run-gate.sh <cwd> <log> <command...>: one exclusive mutex run; retries a mutex give-up (exit 3); exit code appended
cd "$1" || exit 9; L="$2"; shift 2
until sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- "$@" >> "$L" 2>&1; rc=$?; [ $rc -ne 3 ]; do echo "mutex gave up; retry" >> "$L"; done
echo "EXIT $rc" >> "$L"
