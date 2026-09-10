# FP-1 Implementer Brief — the first-paint reduction program (task #17, now urgent)

Opus 4.8 ultracode implementer, /Users/cstokes/Desktop/settlement-engine (branch
review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. CONTEXT: the
entry-closure budget sits at 1,441,000 with ~224 BYTES of headroom (verify the exact current
number first — waves may have landed since this brief). Every future UI-adjacent wave is now
gated on reclaiming room. BINDING context: the budget test + its history comments
(tests/build/vendorPdfLazy.test.js:~196-226 — read the whole comment block; it names the seams)
and the W4h lesson (a leaf manualChunks pin BACKFIRED by +26KB — co-locating engine-core-shared
transitive deps into the pinned chunk which first-paint then imported).

## THE GOAL
Reclaim ≥25KB from the entry static closure, then RATCHET THE BUDGET DOWN to (measured + ~2KB
cross-env margin). A reduction without the ratchet-down is half the job — the lock-in is the point.

## THE METHOD (strictly incremental — measure after EVERY change)
Work one seam at a time; after each: npm run build + the closure measurement (replicate the
test's BFS or run verify:dist); KEEP only changes that reduce; REVERT anything that grows (the
W4h lesson says intuition fails here — only the measurement counts). Report a per-change ledger:
seam → delta bytes → kept/reverted.

## The seams, in expected-value order (from the budget test's own program + the history)
1. **Registry-prose split** — the budget comment names it ("registry-prose split + copy-namespace
   segmentation, seams mapped since wave 5b"). Find the prose/copy registries reachable from the
   entry (copy namespaces, vocabulary tables) and split the entry-reachable slice from the
   lazy-surface slices so first paint carries only what first paint renders.
2. **Copy-namespace segmentation** — same program: the copy object's namespaces that only lazy
   routes read (dossier/compendium/admin/pdf copy) move behind their consumers' chunks.
3. **Dossier/war read-model closure** — pin lazy where NOT engine-shared, the FINER split than
   W4h's failed leaf-pin: the read-model AND its non-shared transitive deps must move together;
   anything engine-core-shared stays put. Candidates from the history: dossierViewModel, warStatus
   closures (causalState is named ENGINE-SHARED — do not touch it).
4. **Eager store slices** — the comment's "revisit the eager store slices": any slice reachable
   from the entry whose state only lazy routes consume (candidates: gallery/compendium/admin
   slices) — convert to the lazy-registration pattern IF one exists in the store already; if no
   such pattern exists, STOP-AND-REPORT the design rather than inventing store architecture.
5. **Vendor audit** — one pass over the entry-closure chunk listing (the test prints members):
   any vendor/module that looks lazy-only, trace WHY it's in the closure (the test's BFS shows
   the import edge) and cut the edge if it's an accident (a stray static import from an eager file).

## THE CONSTITUTIONAL LAWS
Behavior-identical: NO feature changes, NO component edits beyond import mechanics; goldens
byte-identical; ALL test suites green; every lazy surface still loads (smoke the moved surfaces:
dossier, compendium, admin, gallery — the component-module-load smokes exist); the ratchet-down
lands IN THE SAME wave (CLOSURE_BUDGET_BYTES lowered + the comment block updated with this
program's results and the new baseline).

## Gates
Full battery per the standard; verify:dist green at the NEW lower budget; the per-change ledger
in the report; final closure number + new budget + headroom. If the 25KB target proves
unreachable after honestly working all five seams, STOP-AND-REPORT with the ledger — a smaller
locked-in reduction beats a forced regression.
