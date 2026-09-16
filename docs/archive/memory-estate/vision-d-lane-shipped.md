---
name: vision-d-lane-shipped
description: "⭐ VISION LANE V-D shipped on claude/vision-d (base 212758ad; A 9db60484 · B 33244c8b · C ab96c69c · D e202dd58 · E 048e584d, NOT folded). V-8 worker harness + V-9 de-eager were ALREADY in base (brief partly stale) → lane = V-8 PINS + R-14 forensics + R-18 paranoia + R-19 museum. Closure 1,032,737 ≤ 1,040,000, headroom only 7,263 (R-14 added +8,003 B raw eager) — FOLD-CRITICAL."
metadata: 
  node_type: memory
  type: project
  created: 2026-07-20
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T16:25:44.228Z
---

2026-07-20: VISION WAVE lane V-D (worktree .claude/worktrees/vision-c, branch
claude/vision-d, base 212758ad). Five lettered commits, NOT folded/pushed.
Manager fold subject: "Vision V-D: the engine works off-thread, the entrance sheds
its weight, every crash comes home reproducible (V-8/V-9 + forensics/paranoia/museum)".

## The brief was PARTLY STALE — re-derive done-state from git, not the brief
- **V-8 worker harness ALREADY EXISTED at base** (advanceInterval.worker.js +
  lib/advanceWorkerClient.js + tests/lib/advanceWorkerClient.test.js), merged in
  "wave 5a — time learns to leap". Capability-detect + sync fallback + failure
  taxonomy + progress protocol all shipped. The brief described it as greenfield.
- **V-9 de-eager ALREADY FOLDED at base** (DE-a 7a629d80 · DE-b 5cee2ea0 · DE-c
  2c4d599b + "FOLD BATCH 3 (13/15)"). customContentSource.js seam + the async
  store actions + tests/build/customRegistryLazy.test.js all present. [[deeager-lane-shipped]].
So V-D's REAL work = V-8's two PINS + R-14 + R-18 + R-19 (V-9 = verify-and-report).

## What actually shipped
- **A (9db60484) V-8 PINS**: tests/domain/advanceWorkerByteIdentity.test.js — worker↔sync
  byte-identity via structuredClone (the postMessage algorithm) + end-to-end through the
  real client over a real-sim Worker double. tests/architecture/engineWorkerDomFree.test.js
  — src/domain+src/kernel reference no window/document/localStorage (the spine is genuinely
  DOM-free; scan is a clean regression guard; `window` overloaded as a domain concept →
  local-binding skip). No source change.
- **B (33244c8b) R-14 CRASH FORENSICS**: errorReporter.js gains a store-injected forensics
  seam (setCrashForensics) that WHITELISTS exactly {seed,tick,flags_on} scalars into the
  payload — no world state/PII by construction. lib/crashForensics.js (new eager) reads
  scalars off the store; store/index.js registers it at boot. build hash = existing `release`.
- **C (ab96c69c) R-18 PARANOIA**: flag advanceWorkerParanoia (default OFF); lib/advanceParanoia.js
  (LAZY — rides campaignAdvanceSession's chunk); gate = flag && import.meta.env.DEV (dead code
  in prod). Re-runs sync in-thread + diffs worldStates, reports divergence via R-14 kind
  'determinism.worker-sync-divergence'. Byte-neutral when off. Hook is INSIDE the multi-tick
  branch of campaignAdvanceSession.js (multiTickArgs scope).
- **D (e202dd58) R-19 SAVE MUSEUM**: tests/fixtures/save-museum/ (manifest.js + 3 synthetic
  exhibits, REAL bodies re-enveloped from the pre-v2 blob) + the real legacy-saves/april-2026-v1.
  Eras: pre-v2 / v2-draft / campaign-canon / forward-version(schemaVersion 99 → pass-through+warn,
  the tolerant loader's HONEST LIMIT). saveMuseum.test.js pins every era loads + provenance honesty.
- **E (048e584d) tsc fixes**: type-narrowed the two new lib helpers (casts + seed type
  string|number|null). Purely type-level.

## FOLD-CRITICAL headroom (for the manager)
Base 212758ad raw closure = 1,024,734. V-D HEAD = **1,032,737** (≤ 1,040,000; **headroom only
7,263 B**). R-14 forensics added **+8,003 B raw / +3,234 B gzip**, ALL in the eager index chunk
(paranoia + museum + V-8 pins are lazy/test-only). ~5 KB of the 8 KB is minifier variable-rename
cascade from adding imports to the large store/index.js. Parallel lanes (vision-e/f/j) folding
atop this must watch the 7,263 B remaining or the composite breaches budget again ([[composite-budget-breach-998b]]).

## Deferred (vetoable)
- V-8 "streamed news": the worker streams per-tick PROGRESS {ticksDone,ticksTotal,interval};
  news is applied on completion (full composed result). Per-tick news STREAMING deferred — no
  UI consumes it (toolbar is a determinate bar) and building plumbing without a surface violates
  "no rich state without a surface". onProgress detail is an open object → extensible when a
  live-news ticker surface exists (V-B territory).

## Hazards confirmed this session
- **Parallel vision-e session materializes files in this worktree during git ops**: my baseline.txt
  refresh transiently captured V-E files (foundry-module/, mcp-server/, worldCode, migration 168)
  that were gone on direct `git status` seconds later. worktree list confirms claude/vision-e
  (9d8d3411) + vision-f/j (both 212758ad) are live. Always take FRESH `git status` before staging;
  explicit-file staging protected every commit.
- Gate green: strict 0 · tsc 0 · lint 0 errors · verify:dist 162 · anyCast unchanged · rawColor ·
  NUL clean · byte-identity 3 · V-9 guards green. New pins total ~+40 across A–D.
