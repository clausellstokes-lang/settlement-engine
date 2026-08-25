---
name: seamless-resume-directive
description: "⭐⭐ OWNER DIRECTIVE (2026-08-10, in-chat): the 5-hour window may exhaust at any time — 'constantly update for seamless resume'. Operative rule: after EVERY lane dispatch, lane report, landing, and ruling, immediately (1) re-run scripts/resume-state.sh (main tree), (2) update the HAND-MAINTAINED section with exact in-flight state + the successor's next command, (3) commit the ledger by plumbing+CAS. A successor must be able to resume MID-LANE from RESUME_STATE alone."
metadata:
  type: feedback
  date: 2026-08-10
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T21:33:23.647Z
---

Owner, 2026-08-10 ~01:15 ET, verbatim intent: "we may run out of 5 hour window usage
so constantly update for seamless resume." **RESTATED 2026-08-11 at the resume ("i will
occasionally run out of 5 hour window usage. prepare for that") — this is a standing
operating condition, not a one-day event.**

✅ **LIVE-FIRE CONFIRMED 2026-08-11 ~16:45:** the window exhausted mid-run with two lanes
in flight (one implementing a packet, one mid-recon-fan-out). Total cost: two partial lane
turns. Recovery at ~17:31: survey (one 48-line untracked WIP file, snapshotted), shared
index reset to HEAD (the stale MM/D noise was masking the true one-file dirt), both lanes
RESUMED from their transcripts with fresh-verify orders — under five minutes, zero landed
work lost. The discipline pays for itself exactly as designed. ⚠ Resumed lanes must
RE-RUN any measurement taken pre-death, never reuse it.

⚠⚠ **THE PRESERVE-MARKER TRAP (bit 2026-08-11):** `resume-state.sh` preserves ONLY from
the `<!-- resume-state.sh preserves` comment line down. Hand content placed between the
`## HAND-MAINTAINED` heading and that comment is DESTROYED on the next regeneration —
the pause session's zero-context handoff block was eaten from the working copy this way
(recovered from git at `005d8cdf`, restored below the marker at `96124a60`). Always write
hand content BELOW the comment marker.

**Why:** the SC-1 lane had just been killed by the session limit mid-verification; the
program's §3k recovery worked but cost a full orphan-attribution cycle. Constant
handoff currency converts a window death from a recovery incident into a page turn.

**How to apply:** treat every state change as a handoff boundary — dispatch, report,
landing, ruling, veto. The three-step update (regenerate derived state → rewrite the
hand note with in-flight lanes, their output-file paths, and the exact next command →
ledger commit) takes under a minute and is never skipped for being "mid-task". The
hand note must name: each running lane's task output path, the newest snapshot id,
the preservation refs, and the scratchpad artifacts a successor needs
(pa-* drafts, chair rulings). Related: [[implementation-packet-dispatch-system]].
