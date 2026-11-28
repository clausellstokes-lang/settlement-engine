# (F) NAMES STORED IN PROSE

The other half of a rename: sentences stored on the record that hold the OLD name after the town is renamed. `renameSettlementImpl` writes `name` and nothing else (see (C)), so a stored sentence cannot follow the rename.

Every count is a script's (CONFIRMED) on the same 300 + 300 births as (D): the first 300 of C and of V, which are thorps and hamlets only. The analysis runs `tools/analyze-f.mjs` over `work/D-<X>.jsonl` and `work/F-<X>.jsonl`.

**How a printed line is counted.** It counts if it holds the old name after the rename, on any tab of the owner's page or any of the non-DOM surfaces. The line is a base line not taken away by the rename, or a new line that holds the old name.

**How a line is traced to its home.** Each line is traced to the stored string leaf of the born record that holds it, matched by text (`tools/f-leaves.jsx` lists every string leaf holding the name).

**Lines that could not be matched.** 5 (C) and 1 (V) lines could not be matched by the script. In each, the town's name starts with "Ö", which the leaf finder's `\b` does not see. By reading, they are arrival-scene and crisis-summary lines.

## Counts

| | C | V |
|---|---|---|
| pages that still print the old name after the town's rename | **300 of 300** | **295 of 300** |
| lines | 676 | 735 |
| on the owner's tabs / PDF / Foundry / Tonight | 478 / 99 / 99 / 0 | 501 / 116 / 117 / 1 |

| home (stored field) | C: pages (lines) | V: pages (lines) | printed on | one example (old name kept, the town now "Quillmarsh") |
|---|---|---|---|---|
| `arrivalScene` | 292 (292) | 287 (287) | Summary/Overview | V dp-thorp-1: "Kilton's notices are posted in two languages now, the local one second. The new lettering is neat, official, and on every door that matters, which is how you learn the occupation intends to stay. ..." |
| `stress.summary` (mirrored at `stressors.summary`) | 94 (282) | 102 (306) | Summary/Crisis, PDF crisis page, Foundry Crisis | C dp-thorp-0: "Linyuan owes an outside power more than it can ever repay, and the debt now decides what it can and cannot do." |
| `pressureSentence` | 85 (85) | 97 (99) | Summary/Overview (and Foundry / Tonight once each in V) | C dp-thorp-0: "The interest on Linyuan's debt now outpaces what the timber can bring in; the numbers have been quietly rearranged twice to hide it, and there is no third arrangement that works." |
| `stress[].summary` (a second crisis; mirrored at `stressors[]`) | 2 (12) | 7 (42) | Summary/Crisis, PDF, Foundry | V dp-thorp-108: "Tulumha has gone short of food for a second season. Rationing has begun, the wealthy are hoarding, and the children are visibly hungry." |

**What the births store.** On these 600 births, NO history event, tension, tradition description or hook stores the town's name. `f-leaves` finds the name in exactly the four homes above, plus the `stressors` mirrors. Every one of those four homes prints. The brief's examples of homes ("a history event's text, a tension, a tradition's description, a hook") hold the name at view time instead: they are composed from `settlement.name` when the page renders, so they follow a rename. Larger towns were NOT walked for (F). Their stored homes are not measured here.

**The shared page.** It prints `arrivalScene`, `pressureSentence` and the crisis summary from the same stored strings (PLAUSIBLE, by reading). So it keeps the old name exactly where the owner's page does.

**The cure's shape** (not built; for the chair):
- **A print-time substitution.** A whole-word replace of the record's previous name, applied to these three stored homes at view. This reaches every saved town, but it needs the OLD name, which the record does not keep. Only a canon town's `RENAME_SETTLEMENT` event log row (`targetId: oldName`) holds it.
- **A write-time cascade in `renameSettlementImpl`.** Rewrite the three homes, as `applyFactionRenameToSettlement` rewrites a power's stored prose with `substituteWholeWord`. This reaches the towns renamed from then on.
- **Either way, the AI narrative.** It keeps the old town name too, because the town rename never calls `applyCosmeticRename`.
