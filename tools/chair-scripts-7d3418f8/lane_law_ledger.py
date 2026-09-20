# -*- coding: utf-8 -*-
"""The owner's lane law restated (2026-09-19 17:05): the charter's STAFFING amendment + ODQ §934.54."""
import io, sys

c, f, stamp = sys.argv[1:4]

CHARTER = """## Amendments of __STAMP__ — STAFFING: four working lanes and one gate seat (the owner's lane law, restated; ODQ §934.54)

The owner, 2026-09-19 17:05 EDT, to a chair that had two lanes running: *"remember that you can have up to four lanes doing stuff. One of those lanes is reserved for if any you're waiting gates and suites. But once a bill [build] has gone to the point where it's waiting on the suite or a gate it is paused and wait until it's resumed for its turn."* THE FIVE SEATS ARE FOUR WORKING LANES + ONE GATE/SUITE SEAT, and the four are a floor the owner expects used. How this train plan is staffed under it:

- **The slot stays single** (sealed dispatch wants the worktree ON the branch): ONE packet builds at a time. Everything else runs AHEAD of it or BESIDE it.
- **AHEAD of the slot — the pipeline.** Compile and pre-proof lanes are read-only at a detached tip, so they run while the slot builds: at all times the next TWO members of the sequence are being compiled or pre-proofed. A pre-proof taken at an older tip is promoted by the chair's WINDOW RE-RUN (the commits since, against the packet's declared paths — EM-B1d's promotion is the model); a member whose substrate an in-flight packet touches waits for that landing instead (EM-P2 version 3 waits for EM-B1d: both edit the mutation-coverage manifest).
- **BESIDE the slot — the PARALLEL lanes START NOW, not after run 17** (this amends the sequencing amendment above in one respect only): FIX-F1/F2/F3, TOOL-1/2/3 and RECON-G are built in their own worktrees on their own branches under `briefs/LANE-PARALLEL.md`, cut from the newest landed tip; what waits for a green terminal is their COMPOSITION onto the integration branch (the tooling cures after run 17's green and before EM-P2 version 3 is promoted; the fixes at EM-T4's terminal), so a terminal never validates a tree it did not run on. REVIEW-P needs the preview server and runs outside a terminal's window.
- **The gate seat.** Every gated run (vitest · eslint · typecheck · build · `verify:dist` · `check:packet`) is PAUSE-AND-RESUME: a lane that reaches one finishes its edits, writes its resume note, ends its turn `PAUSED AT THE GATE`, and its working seat goes to the next queued lane; the chair resumes paused lanes ONE AT A TIME in the order written in the kit's `gate-queue.md`; the chair's own terminals take their turn in the same order. Both shared briefs carry the practice verbatim (`LANE-EM-BUILD.md` verb 3; `LANE-PARALLEL.md` verb 4).

"""

ODQ = """- **§934.54 OWNER: THE LANE LAW RESTATED (__STAMP__) — "remember that you can have up to four lanes doing stuff. One of those lanes is reserved for if any you're waiting gates and suites. But once a bill [build] has gone to the point where it's waiting on the suite or a gate it is paused and wait until it's resumed for its turn."** THE FIVE SEATS ARE FOUR WORKING LANES + ONE GATE/SUITE SEAT. The chair had two lanes running (the EM-B1d build and the third re-derivation recon) and was serialising compile lanes behind the slot's build. DONE ON THE SPOT: two Opus compile lanes dispatched (EM-B1f, EM-B3c — four working); the practice written verbatim into both shared briefs (a lane at a gated run writes its resume note, ends its turn `PAUSED AT THE GATE`, and the chair resumes lanes one at a time); the charter gains a STAFFING amendment. **THE CHAIR'S ONE JUDGMENT CALL under it (vetoable):** the PARALLEL lanes of §934.53 (FIX-F1/F2/F3, TOOL-1/2/3, RECON-G) START NOW in their own worktrees instead of waiting for run 17's green — what still waits for a green terminal is their COMPOSITION onto the integration branch, so no terminal validates a tree it did not run on. *Rejected:* holding them until run 17 (the letter of §934.53) — it leaves working seats idle for the hour a terminal takes, which is what the owner's reminder is about. *Reversal:* a parallel branch is never composed until the chair cherry-picks it; dropping one costs nothing on the integration branch. *Blast radius:* none on the integration branch or the ledger until composition; machine load is bounded by the five seats and the single gate.
"""

t = io.open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
io.open(c, "w", encoding="utf-8").write(t.replace(anchor, CHARTER.replace("__STAMP__", stamp) + anchor))
o = io.open(f, encoding="utf-8").read().rstrip("\n")
io.open(f, "w", encoding="utf-8").write(o + "\n" + ODQ.replace("__STAMP__", stamp))
print("charter: STAFFING amendment; ODQ §934.54")
