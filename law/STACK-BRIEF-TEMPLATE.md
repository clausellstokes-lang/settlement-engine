# STACKED LANDING — the standing brief (ODQ §516). Dispatch ONE lane for N cars, not N lanes.

The last stacked landing was #39–40. Landings 41–48 were eight singletons in eight gates. This template exists so that never repeats.

## When a stack is lawful
- Every car's change paths are DISJOINT (check the live manifest's reservations, not memory).
- Each car is independently proved and holding at its own pinned tip.
- The chain rebases cleanly: `--onto <slot> <base1> <tip1>`, then the next car onto THAT, in dependency order.

## What the stack lane does differently from a singleton
1. **Rebase the chain**, car by car, proving each hop: carry table at blob level (`git rev-parse --verify -q`, plus a nonexistent-path control — a bare rev-parse ECHOES and exits 0), and every unmoved path blob-identical to its holding.
2. **The census is a SUM OF DELTAS, never a tuple** (§420): walk the final figure once from the arm's own failure messages, and prove the sum with TWO negative controls — the slot tuple back, and ONE car's delta removed (a sibling control that must convict the arithmetic, not just the total).
3. **The §410 three-place flip runs per car** (manifest status + verifiedBase + packet header + INDEX cell), each with its own non-vacuity control. ⚠ The INDEX cell's PROSE must not contain a status word — `parseIndexPacketStatuses` takes the first match anywhere in the cell.
4. **ONE sweep and ONE terminal for the whole stack.** That is the entire point: N cars, one gate. Attribute the ratchet delta per car by execution in a temp slot worktree, then remove it.
5. Cite the slot-facts card for the banked set, the tuple base, the ruin count and the ratchet base. Do not re-derive them.
6. Cap every battery: `--pool=threads --poolOptions.threads.maxThreads=2 --poolOptions.threads.minThreads=1`.
7. **Checkpoint at ~150 turns** and hand a resume brief to a fresh lane — transcript replay is superlinear and the tail turns are the expensive ones (§481, unenforced until §516).
8. LEAD the final report with the tip sha. A landing tip's only ref is often the lane worktree's detached HEAD, and a holding pin covers the BUILD tip only.

## The next stack, pre-planned
**CH-2 · UC-5 · WEB-8** — disjoint by construction: the catalog and its gate paths · `src/domain/undercity/` · pricing and `.env.example`. Dispatch as ONE lane the moment all three report holding. Expected: 170 → 173 packets, three deltas summed, one gate.
