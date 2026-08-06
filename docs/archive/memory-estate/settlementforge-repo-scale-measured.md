---
name: settlementforge-repo-scale-measured
description: "SettlementForge is a deterministic D&D settlement/world sim (React/Zustand/Supabase) by solo builder Clausell Stokes; first-party code MEASURED 2026-08-05 at 1,972,206 lines (~1.97M, +5.3M dependency lines = ~7.3M total) — the long-quoted ~1.23M figure is STALE"
metadata:
  node_type: memory
  type: project
  created: 2026-08-06
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-06T10:29:01.299Z
---

# What SettlementForge is, and how big it actually is

**The product:** a deterministic D&D settlement- and world-simulator. Stack is
React / Zustand / Supabase. Solo builder: **Clausell Stokes**.

**The measurement (2026-08-05, late):** first-party source is **1,972,206 lines**
(~1.97M). Dependencies add ~5.3M, for **~7.3M lines total**.

⚠ **The ~1.23M first-party figure that circulated for months is STALE** and should
not be quoted. It was superseded by the 2026-08-05 count above.

**Why:** scale figures get quoted in planning ("can one lane sweep this?", "how
long will a census take?", "is a full-tree grep affordable?") and a figure that is
low by ~60% produces plans that under-staff their own censuses. The number also
drifts fast in this program — it grew from ~1.23M to ~1.97M — so it carries its
measurement date as part of the fact.

**How to apply:** quote the figure WITH its date, and treat any scale number older
than a few weeks as needing re-measurement rather than repetition — the
derive-don't-restate law applies to this fact as much as to any in-repo count
([[derive-dont-restate-and-mutant-must-change]]). This is exactly the kind of
hand-maintained restatement that goes stale at its source, which is why it lives
in one file that can be corrected in one place instead of being spelled inline
across briefs.

Related: [[derive-dont-restate-and-mutant-must-change]] ·
[[concurrency-law-ruled]] (the throughput numbers that pair with this scale) ·
[[lane-end-gate-gotchas]] (what this scale costs at gate time).
