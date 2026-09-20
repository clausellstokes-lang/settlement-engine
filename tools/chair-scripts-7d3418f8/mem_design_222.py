# -*- coding: utf-8 -*-
"""Memory: design §22.2 (ARCH-REDERIVE v3) and the train-order correction appended to the edit-mode design topic."""
import io, sys, glob

M = "/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/"
stamp = sys.argv[1]
p = M + "design-2026-09-19-edit-mode-pools-decree-registry-and-guards-proposal.md"
t = io.open(p, encoding="utf-8").read().rstrip("\n")
ADD = (
"\n\n**Addendum " + stamp + " (session 7d3418f8) — design §22.2, ARCH-REDERIVE version 3 (ledger `ab069109e`; ODQ §934.47 add. 20; vetoable):** a third Opus recon BUILT the "
"three-way merge `record + (R1 - R0)` and ran it (kit `findings/RECON-ARCH-REDERIVE-3.report.md`, `tools/rederive-prototype-3/`). HELD: identity 63/63 with no edit once the merge "
"short-circuits at every NODE and the record's value may be ABSENT; the cache claim byte for byte; 32/32 edit trials on village/town/city/metropolis. THE CENTRAL FINDING: merged LEAF by "
"leaf, terrain -> desert left a city reading `foodSecurity.label = Import-Dependent` beside `isSecure = true` (a pair no generated record carries). RULED: (1) the unit of merge is a "
"DECLARED CONSISTENCY GROUP (the smallest object that closes an invariant), kept whole when untouched, taken whole from R1 when touched; the recon's MIXED-object census is its ratchet; "
"(2) `recordInvariants` (the recon's instrument promoted; each check control-validated) guards EVERY merged record at RUNTIME with a deterministic escalation group -> key -> all readings; "
"(3) THE CHAIN IS THE SEMANTICS -- each edit is merged alone, in order, like a decree; there is NO batch path (`merge.merge` differed from a batched merge in 34 leaf paths); (4) order is a "
"reading merged three-way; a keyless collection is ATOMIC, nothing merges by position; (5) record keys are classed BY PATH: HELD / WORLD / CONSTANT / READING / MIRROR (recomputed; "
"`factions[].members[]`) / RECEIPT (recomputed last) / HISTORY (`generationCoherenceReceipt` -- lived history, never merged) / AUTHORED (`userCanon`, `aiOverlays`, `dmLayer`, `decrees`); "
"(6) `set-faction-power` renormalises the others to exactly 100; (7) a NEWCOMER NPC is enriched once at birth on a stream keyed by its stable id (it lacked 16 card fields); (8) a removal "
"owes the rename cascade's sweep; (9) first cut consumes-and-discards everywhere, draw-skip waits for the trace partition; (10) the honesty cost is 43 % of taken leaves (18 DM-visible), so "
"the delta carries THREE values: before / now / what the edit alone accounts for. THE EM-R FAMILY RE-CUT: R0a class register, R0b recordInvariants, R1-R5 the seam, R0c the merge, R6 rename "
"+ removal cascade, R7 the corpus ratchet. ALSO: FIX-G1 (a pre-existing generator inconsistency: a town's viability summary counts six dependencies beside a list of five) sequenced, its "
"cure behind the owner's golden door. **Why:** the product's moat is that every fact agrees, so agreement outranks minimal movement. **How to apply:** compile the EM-R family from "
"§22.2's items; never build a batch entry point; never merge by position; a new record key must be classed before it ships."
"\n\n**Train-order correction " + stamp + " (ledger `294d9ccea`; ODQ §934.47 add. 21):** the charter built EM-A2b (T5) before EM-A2a (T6) though A2b MODIFIES `src/domain/edit/pools.js`, "
"which A2a CREATES -> corrected (T5 = A1 -> A2a, P1b, B3c; T6 = B1f -> A2b -> B1a; EM-B1e FLOATS). **How to apply:** a train table is a CLAIM -- diff every train's order against its "
"members' `changeManifest` CREATE/MODIFY pairs before the first promotion (the chair's one-liner is in the 7d3418f8 transcript; the kit's `packets-waiting/*.manifest.json` are the input)."
)
io.open(p, "w", encoding="utf-8").write(t + ADD + "\n")
print("design topic updated:", len((t + ADD).encode("utf-8")), "bytes")
