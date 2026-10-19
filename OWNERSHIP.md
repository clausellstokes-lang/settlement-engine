# OWNERSHIP — two seats never own one file at once (the standard's rule 39)

| Lane | Owns (writes) | Reads only |
|---|---|---|
| R1 · R2 · R3 · R4 (research) | `findings/R<n>.md`, `findings/R<n>-probe/**` | everything else |
| L-PL | `docs/DESIGN_FP_ARCH_PL.md` | all |
| L-MN | `docs/DESIGN_FP_ARCH_MN.md` | all |
| L-RN | `docs/DESIGN_FP_ARCH_RN.md` (new) | all |
| L-CH | `docs/DESIGN_FP_ARCH_CH.md` (new) | all |
| L-PT | `docs/DESIGN_FP_ARCH_PT.md` (new) | all |
| L-PS · L-ST · L-PR (10-18) | `docs/DESIGN_FP_ARCH_PS.md` · `ST.md` · `PR.md` (new) | all |
| L-BD (10-18 ~18:1x; compiled beside round 3b) | `docs/DESIGN_FP_ARCH_BD.md` (new) | all |
| skeptics | `skeptic/<id>.md` | all |
| disposition lanes | the one volume named in the lane id + `cure/<id>.md` | all |
| bracket lanes (P4) | the named landed volumes, insertions-only | all |
| THE CHAIR | `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md`, `docs/OWNER_DECISION_QUEUE.md`, `docs/HANDOFF_CURRENT.md`, the two briefs' status lines, this kit's root files | — |

The code of record (the master worktree) and the ledger's `src/` are READ-ONLY for every seat. No seat touches git.
