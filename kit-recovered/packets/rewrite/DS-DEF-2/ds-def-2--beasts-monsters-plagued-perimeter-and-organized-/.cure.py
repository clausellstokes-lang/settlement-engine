import io, os
d = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md"
lines = io.open(d, encoding="utf-8").read().split("\n")
rows = lines[2595:2607]   # 1-indexed 2596..2607
assert rows[0].startswith("1. `[ledger]`"), rows[0]
assert rows[8].startswith("3. `[unfolding]`"), rows[8]

cures = {
 2: "   - `[face]` Creatures range the country around {settlement}, and the town's wall and the muster are carried standing.",
 3: "   - `[face]` The town's force and the works are entered as standing at {settlement}, and creature country lies around the town.",
 4: "2. `[street]` Defense at {settlement} includes a wall and a muster, and creatures press the country outside.",
 7: "   - `[face]` The creatures are in the country around {settlement}, and the town has a wall and a force.",
 9: "   - `[face]` The wall at {settlement} stands and so does the muster, and the pressure from the country's creatures lies open.",
}
for i, t in cures.items():
    rows[i] = t

out = "\n".join(rows) + "\n"
p = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/rewrite/DS-DEF-2/ds-def-2--beasts-monsters-plagued-perimeter-and-organized-/cure-round-1.md"
io.open(p, "w", encoding="utf-8").write(out)
print(out)
