---
name: build-everything-ruled-and-train-law
description: "⭐⭐ OWNER §27 (08-14): build EVERYTHING → diagnostic soak → fix → full soak → tune — every declared wave lands dark BEFORE the first soak; §28 train law governs delivery. Fresh FP census: 111 declared / 22 whole / 85 remaining. ⚠ PACKET_MANIFEST.json joined the never-re-serialize class."
metadata: 
  node_type: memory
  type: project
  date: 2026-08-14
  originSessionId: a244e7a3-27d9-4152-b847-cf42cf4b08a7
  modified: 2026-08-14T08:03:52.561Z
---

Owner, 2026-08-14 ~04:05, verbatim: "diagnostic soak is after everything is built.
its build everything, diagnostic soak, fix, full soak, tune." Recorded as
OWNER_DECISION_QUEUE **§27** (ledger); supersedes §22's near-terminal reading and
§24 op-item 4. §3h step 1 restored literally.

**§28 + DESIGN_BUILD_EFFICIENCY.md** (ledger branch; fold owed to build branch):
trains ≤4 same-volume waves on `refs/trains/<id>`, one CAS to the green terminal,
per-member full proof, ONE terminal bare gate + smoke — the gate is AMORTIZED,
NEVER THINNED. Base-state capsule `docs/implementation/BASE_STATE.json` (first
stamp @ `770167c5`): citable as executed ONLY at exactly its stamped sha; touched
rows always re-executed. Family preambles cited by SHA-256.

**Fresh FP census (laneFPC-census.md + hand note @ ledger `088280ce`): 111
declared / 22 whole / 4 part / 85 remaining; 52 FP flags unminted.** ⚠ HB/WC/EP
volume headers say "LANDED" with ZERO code — document-landed, not code-landed;
the spine's own count self-disagrees (109/108/111 — extraction wins).

**Why:** every successor must sequence from §27+§28, and the census traps
(volume-header LANDED, the 109 figure) will re-bite anyone who greps.

**How to apply:** build queue = laneFPC-census.md per FP §5 dependency order;
first train GR-4B-II, then the infrastructure train (capsule script +
PACKET_STANDARD amendment + IP-1 + FPC's prose contradictions), then ES spine
trains. ⚠⚠ PACKET_MANIFEST.json: NEVER json.dump the whole file — surgical
text append/replace only (a json.dump re-serialization made +6078/−1873 noise,
caught at diff review 08-14). Related: [[endgame-tail-order-ruled]],
[[implementation-packet-dispatch-system]], [[full-delegation-grant-2026-08-10]].
