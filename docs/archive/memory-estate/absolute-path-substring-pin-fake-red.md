---
name: absolute-path-substring-pin-fake-red
description: "tests/architecture/archViewWall.test.js asserts a path-substring over an ABSOLUTE path, so an archive-census checkout under any directory named `arch` reds a real-looking architecture violation; never unpack a census archive into a path containing /arch/"
metadata:
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-08T02:41:04.506Z
---

Observed 2026-08-07, lane S12-W2, build branch `claude/composite-r4`.

A full `npm run test:ratchet` inside an integrity-counted `git archive` reported ONE
failing test outside the frozen census:

    tests/architecture/archViewWall.test.js :: the K-5 governor module is view-only
    (import-wall pin: reads no golden, writes no model state)
    lives outside the arch/ determinism perimeter in the view-policy layer

It reproduced in ISOLATION (`Tests 1 failed | 18 passed`), so it was **not** the recorded
parallel-contention flake and the gate mutex was held. It was entirely an artifact of the
measurement environment: the archive had been unpacked into a scratch directory literally
named `arch`. Renaming that directory to `tree` and re-running the SAME committed bytes
gives `Tests 19 passed (19)`.

**Why:** the pin is

    const govPath = join(ROOT, 'src/lib/townScene/adaptiveQuality.js');
    expect(govPath.includes('/arch/')).toBe(false);

`ROOT` is an ABSOLUTE path, so the substring test sees every ancestor directory, not just
the repo-relative part it means to constrain. Any checkout beneath a path containing
`/arch/` fails it. The red is indistinguishable from a real architectural violation — it
names a determinism perimeter and an import wall — so it invites an hour of investigation
into a file nobody touched.

**How to apply:**
- When taking an ARCHIVE CENSUS (see [[receipt-vacuity-and-shared-ratchet-rules]]'s
  ARCHIVE-CENSUS LAW), never unpack into a directory named `arch`, and avoid `dist`,
  `node_modules`, `src` and `tests` as scratch directory names for the same reason.
  This lane's convention: `<scratchpad>/<LANE>/tree`.
- Before attributing ANY out-of-census red to your own change, re-run the file alone AND
  check whether the assertion reads an absolute path. `git diff --stat` against your own
  changed-file list is the cheap first test: if the failing test's inputs are not in it,
  suspect the environment before the change.
- The pin itself is not wrong about its intent and was deliberately left alone by
  S12-W2 (out of lane). The honest fix, if a lane ever owns it, is to compare a
  REPO-RELATIVE path (`relative(ROOT, govPath)`) instead of the absolute one.

Related: [[walker-census-law-machinery]], [[receipt-vacuity-and-shared-ratchet-rules]],
[[generation-remediation-gate-state]].
