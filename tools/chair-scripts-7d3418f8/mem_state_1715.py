# -*- coding: utf-8 -*-
"""Memory: the program-state topic gains the 17:1x update; the index's START HERE row is refreshed (by link target + marker)."""
import io, sys

M = "/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/"
stamp = sys.argv[1]

p = M + "state-2026-09-18-the-fixes-program-lanes-consist-and-gate-queue.md"
t = io.open(p, encoding="utf-8").read().rstrip("\n")
UPDATE = (
"\n\n**Update " + stamp + " (session 7d3418f8):** TRAIN EM-T3 IS TWO-THIRDS LANDED. Build branch tip `58fcfe614` = a41a0e109 + `4da740b52` (EM preamble rows 10-11: the edge-shared INPUT "
"membership and the byte budgets; SHA-256 1cf54427...faf6) + EM-B3a READY/LANDED `668d87512` (the veil precedes the writer) + EM-P3 READY/LANDED `f4e5b64c5` (the option sets' one home; worker "
"ceiling 1,401,208 exact, +80 B after a PLACEMENT cure took +634 B off the table; ODQ 934.19 add. 3) + the third docs fold `32f1ba048` + EM-B1d PLACED READY (version 4, base 32f1ba048; its "
"matcher triggers on the DISCRIMINATING subset {dead, exiled, retired}; the STALE EM-P2 v2 withdrawn to the kit). The EM-B1d Opus BUILD lane holds the slot. DESIGN RULED TODAY (all vetoable): "
"section 21/21.5 generation's facts MEASURED BY EXECUTION (Tier 1 = 75 (step,key) rows; EM-P2 version 3 compiled and closed, waits in the kit); section 22 ARCH-REDERIVE (HELD FACTS ARE FINAL "
"at every writer; no schema change) and 22.1 (the consequence of an edit is the DIFFERENCE of two re-derivations -- a three-way merge `record + (R1 - R0)`; the EM-R0..R6 family; a THIRD recon "
"is measuring the merge and its honesty cost). OWNER ORDERS: 934.53 'Put the deferred work into the sequence' -> every one of 22 deferred items has a slot, a condition or a decision point "
"(charter 'THE DEFERRED WORK, SEQUENCED'; the kit's DEFERRALS-UNSEQUENCED.md is a pointer file); 934.54 THE LANE LAW RESTATED 17:05 -> FIVE SEATS = FOUR WORKING LANES + ONE GATE SEAT, the "
"four are a FLOOR ([[owner-directive-2026-09-18-only-four-agents-at-a-time-for-machine-load]]): compile/pre-proof lanes are PIPELINED ahead of the slot (`briefs/LANE-EM-COMPILE-2.md` = "
"compile + pre-proof in one pass), PARALLEL fix/tooling lanes run in their own worktrees (`briefs/LANE-PARALLEL.md`) and START NOW -- only their COMPOSITION waits for a green terminal (the "
"chair's one judgment call, vetoable), and every gated run is PAUSE-AND-RESUME (`PAUSED AT THE GATE -- <note>`; the chair resumes one at a time). Ledger tip `256c4a993`. IN FLIGHT at 17:1x "
"(four working): the EM-B1d build, RECON-ARCH-REDERIVE-3, the EM-B1f and EM-B3c compile lanes (read-only on `read-tip-58fcfe614`). NEXT: B1d's landing -> CURE-A (the model walker's regex) "
"-> ONE lighting refreeze -> RUN 17 = T3's terminal; the seat queue and the gate order are in the kit's `gate-queue.md`; the kit's RESUME-NOTE top block (17:13) is the live owed list."
)
io.open(p, "w", encoding="utf-8").write(t + UPDATE + "\n")

ip = M + "MEMORY.md"
u = io.open(ip, encoding="utf-8").read()
rows = [ln for ln in u.split("\n") if "START HERE (09-19" in ln and "(state-2026-09-18-the-fixes-program-lanes-consist-and-gate-queue.md)" in ln]
assert len(rows) == 1, len(rows)
NEW = (
"- ⭐⭐⭐ [**START HERE (09-19 17:1x EDT, session 7d3418f8 — the SUCCESSOR chair, Fable 5.1): READ THE DURABLE KIT "
"`/Users/cstokes/Desktop/settlement-engine-kits/chair-kit-923472dc-2026-09-19/RESUME-NOTE.md` TOP BLOCK first (live state · the owed list · the SEAT QUEUE); sealed as "
"`refs/preserve/chair-kit-923472dc-2026-09-19`. ⛔ THE CHAIR NEVER EDITS src/ OR tests/ (rule the shape, brief an OPUS lane, validate). ⛔ FOUR WORKING LANES + ONE GATE SEAT, the four a "
"FLOOR (owner 17:05, ODQ §934.54): pipeline compile/pre-proof lanes AHEAD of the slot, PARALLEL lanes beside it, every gate PAUSE-AND-RESUME. Branch tip 58fcfe614: train EM-T3 = EM-B3a "
"LANDED 668d87512 · EM-P3 LANDED f4e5b64c5 · EM-B1d BUILDING in the slot → CURE-A → ONE lighting refreeze → RUN 17. Design §21–§22.1 ruled (facts measured by execution; HELD FACTS ARE "
"FINAL; an edit's consequence is the DIFFERENCE of two re-derivations); the deferred work is SEQUENCED (§934.53). Ledger 256c4a993. The push chain (§934.42) stays PAUSED**]"
"(state-2026-09-18-the-fixes-program-lanes-consist-and-gate-queue.md)"
)
u = u.replace(rows[0], NEW, 1)
io.open(ip, "w", encoding="utf-8").write(u)
print("index bytes:", len(u.encode("utf-8")))
