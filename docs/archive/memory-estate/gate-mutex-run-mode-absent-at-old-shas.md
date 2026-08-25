---
name: gate-mutex-run-mode-absent-at-old-shas
description: "⚠️⚠️ `sh scripts/gate-mutex.sh --run -- npx vitest run …` inside a `git archive` of a sha BEFORE d7ec3885 runs NO TEST AND EXITS 0 — the `--run` mode did not exist yet, so the flag falls through to the INSPECT path, prints `gate-mutex: FREE`, and returns success; the tell is an EMPTY LOG beside a green exit. Drive an old tree with the CURRENT tree's copy of the script (the lock is machine-wide, so cwd may be the old tree)"
metadata: 
  node_type: memory
  type: project
  created: 2026-08-10
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T14:03:22.505Z
---

# A both-ends archive census can fake-green its BASE half, with exit 0

Measured 2026-08-10 while re-recording the sovereignty-lighting census
(`tests/lint/sovereigntyLightingContract.walker.test.js`) across
2b4ca96f → 01a81a1e.

The house re-record procedure reads BOTH ENDS WITH THE SAME INSTRUMENT: build an
integrity-counted `git archive` of the base sha and of the head sha, and run the
walker in each. The base half silently did not run.

## The mechanism

`scripts/gate-mutex.sh` gained its `--run` mode in commit **d7ec3885** ("chore:
add implementation acceleration tooling"). At any earlier sha the script accepts
only inspect-mode and `--wait`. It does not reject an unknown flag — `--run`
falls through to the INSPECT path, which prints

```
gate-mutex: FREE — no vitest runner outside this process's ancestry.
```

and exits **0**. The `-- npx vitest run …` remainder is never executed. So the
base archive reported success having run nothing at all.

**This is nastier than an ordinary exit-0 lie, because the expected result was
also green.** A base archive is supposed to pass — that is the whole point of
re-executing the frozen figures. So a fake green is indistinguishable from the
real thing on exit status alone.

## The tell, and how it was caught

`EXIT=0` beside a **log containing only the gate-mutex line** — no `RUN v4.1.8`
banner, no `Test Files`/`Tests` summary. The catch was incidental: the run was
also supposed to write a probe dump to `$CENSUS_PARKED_OUT`, and that file did
not exist. Without the side-effect file the fake green would have been banked.

## How to apply

- **Never accept a `Test Files … passed` claim without the summary lines in the
  log.** For any archive run, grep the log for `Tests  ` and assert it is
  present, not merely that the exit code is 0. A green with no test summary is a
  run that did not happen.
- **Drive an OLD tree with the CURRENT tree's script**:
  `cd <old-archive> && sh <head-archive>/scripts/gate-mutex.sh --run -- npx vitest run <path>`.
  The lock lives in `TMPDIR` and is machine-wide, so it serializes correctly
  regardless of which checkout the script text came from. The script is lane
  apparatus, not part of the measurement, so using the newer copy does not
  contaminate a both-ends reading — but say so in the annotation.
- **Generalize the suspicion**: any repo script invoked inside an archive of an
  old sha is the OLD version of that script. Before trusting a both-ends
  receipt, diff the apparatus: `git diff <base> <head> -- scripts/<tool>`. In
  this same round the walker itself was verified byte-identical at both ends
  (`git diff 2b4ca96f 01a81a1e -- <walker> <its two imports>` was EMPTY), which
  is what made the estate deltas attributable to the estate rather than to a
  rule change. The instrument was checked; the *harness around* the instrument
  was not, and that is where the lie got in.

## Related

- [[receipt-vacuity-and-shared-ratchet-rules]] — the ARCHIVE-CENSUS LAW this
  procedure implements.
- [[piped-gate-exit-masking]] — the other exit-0 family; this one needs no pipe.
- [[archive-census-node-modules-leg]] — the other archive leg that fake-reds
  (main tree's `node_modules` missing `three`/`pg`); still live, still required.
- [[walker-census-law-machinery]] — the re-record procedure itself.
