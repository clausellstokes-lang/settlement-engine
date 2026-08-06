---
name: concurrency-law-ruled
description: "⭐⭐ THE CONCURRENCY LAW (chair-ruled 2026-08-06 from a measured parallelization map): TWO build lanes, ONE landing slot, ONE gate slot, ALL IN ONE WORKTREE. A second worktree is REFUSED for engine lanes — the gate is a MACHINE mutex not a tree resource, and exact-census/shrink-only files merge GREEN-BUT-WRONG in both parents. Plus: the cert-lane PARTITION is standing practice, and hot files get PER-CYCLE line budgets."
metadata:
  type: project
  created: 2026-08-06
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:29:33.801Z
---

# The concurrency law

**THE SHAPE:** TWO concurrent BUILD lanes, ONE landing slot, ONE gate slot —
all in the single minifold worktree. Optionally a THIRD lane if and only if it
is read-only recon/architecture that commits nothing. Realistic throughput
~1.3-1.5 waves per slot, not 2.0 — the engine lane is dependency-bound before
it is file-bound.

**WHY TWO LANES WORK:** the exclusive resources are not the whole wave — they
are (a) the INDEX during the commit window and (b) the CPU during a gate run.
Two lanes may BUILD concurrently for hours; they LAND serially. A second lane
must be able to hold a completed, green, UNCOMMITTED wave through the first
lane's landing. GR-1 did exactly this in cycle 1 — TREAT IT AS THE DESIGNED
PROTOCOL, not as the failure it was recorded as.

**⛔ A SECOND WORKTREE IS REFUSED FOR ENGINE LANES** (measured verdict):
1. IT DOES NOT BUY A SECOND GATE. "One vitest lane" is a MACHINE property, not
   a tree property. Full suite measured 636s / 2,129 files / 22,581 tests. Two
   worktrees = two lanes queueing for one CPU, plus a NEW failure mode: a lane
   that runs anyway gets FAKE reds it then "repairs".
2. IT CONVERTS A SAME-COMMIT COLLISION INTO AN UNMERGEABLE MERGE.
   ENGINE_GATED_VIRTUAL_RULE_KEYS asserts an EXACT one-key delta;
   BACKLOG_RULE_KEYS shrink-only asserted exact; couplingInclusion shrink-only
   over module sets; .prose-numerics-baseline a 413-row exact census;
   .size-baseline tolerance-ZERO both directions; mutation-coverage-manifest
   1,959 lines of hand-spliced JSON. Each merges TEXTUALLY GREEN and
   SEMANTICALLY WRONG, and the estate has NO instrument that detects a
   hand-resolved exact census.
3. IT MAKES THE HOT-FILE LINE BUDGET INVISIBLE — and that already bit: GR-0 and
   GR-1 spent 9 of peaceTerms.js's 24 remaining lines in ONE evening, in ONE
   tree, without seeing each other.
4. THE PROVEN ALTERNATIVE EXISTS: the SERIALIZED LANDING (constructed staged
   blobs, gate proved inside a git archive of the INDEX).
Worth it for exactly ONE class: a long-running READ-ONLY job (soak grid, dist
verify) — which the terminal phase owns anyway.

**RULING A — THE CERT-LANE PARTITION IS STANDING PRACTICE.** Each program
certifies in its OWN subsystemRows lane file; the totality walker asserts the
PARTITION, not the address. EIGHT lane files exist; TR-1 already did this.
Routing every new program's cert rows to its own lane file removes ~1/3 of the
CQ5 collision AT ZERO ARCHITECTURAL COST. Previously per-wave and under-used.

**RULING B — PER-CYCLE HOT-FILE LINE BUDGETS, assigned by the chair BEFORE
dispatch:** peaceTerms.js 776/800 (+24, NINE waves want it), beliefMap.js 773
(+27), informationStatecraft.js 763 (+37), generosityKernel.js 800 (+0).
A shared file near its ceiling needs a PER-CYCLE budget, never a per-wave one.

**⚠ THE THREE-FILE CQ5 FRAME UNDERSTATES THE PROBLEM.** Measured true shared
footprint of a flag wave is 6-9 files, and the most universal one —
scripts/mutation-coverage-manifest.json — IS NOT IN THE TRIO and is taken by
NO-FLAG waves too. A plan that serializes on the trio and lets no-flag lanes
run free STILL collides on the mutation manifest, the Herald registration
tables (heraldRouting + WHAT_PHRASES, append-at-same-anchor), the coupling
registry, and the ratchet baselines.

**⛔ EP CAN NEVER SHARE A CYCLE** — it is the only program that edits
pulseKernel.js (banked at 1580), whose PRNG call order IS the stream identity.

⚠️⚠️ **THE "94 WAVES REMAIN" FIGURE IS UNVERIFIED — DO NOT CITE IT AS MEASURED
(chair correction, 2026-08-06).** It is an unmeasured number nested inside another
unmeasured number, and a census lane has been dispatched to settle it. Two reasons
it cannot stand as measured: (1) post-fold the declared total would be **108
waves** (75 in the parent volume + 33 pending), implying 14 landed —
arithmetically possible, but nobody has counted it; (2) the parent volume's own
headline **"75 waves / 66 seams" is labelled PLAUSIBLE, not measured** in the fold
package's anomaly A6, and EP's charter makes the re-count BINDING: if a post-fold
re-count disagrees with 75/66, **the tree wins and the disagreement is a
STOP-and-report**. Until the census returns, any statement of a remaining-wave
count must carry the word UNVERIFIED. The per-volume figures below DID reproduce
against the volumes themselves (WC 17, HB 10, EP 6) and the three pending volumes
total **33 waves / 11 flags** — it is the AGGREGATE remaining-work claim that is
unsourced, not the parts.

**PARTLY-MEASURED counts (2026-08-06):** remaining total was stated as
**94 waves — ⚠ UNVERIFIED, see above**, composed FP core 61 (8 landed) · WC 17 ·
WY 12 · ES 7 · EP **6**
(NOT 16 — the 16 counted EP-N tokens including judgment ids) · HB 10 (in the
volume, not the tree). 49 carry a flag; 45 do not. ⚠ **ES-1..ES-6 are NO-FLAG**
— espionageEnabled landed at ES-0 (55674790); the volume text saying it lands
at ES-1 is STALE, moving SIX waves out of the serialized column.

Related: [[cq5-flag-law-collides-with-parallel-lanes]] (the law this refines) ·
[[fp-cycle1-serialized-landing-and-cq5-row-guard]] (the proven alternative) ·
[[hot-files-at-max-lines-ceiling]] · [[derive-dont-restate-and-mutant-must-change]].
