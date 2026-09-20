# -*- coding: utf-8 -*-
"""EM preamble §P2 gains row 12 (from EM-B1d's build STOP). Run from the consist worktree; prints the new SHA-256."""
import hashlib, io

p = "docs/implementation/preambles/EM-PREAMBLE.md"
s = io.open(p, encoding="utf-8").read()
anchor = "11. **The byte budgets are priced at pre-proof"
assert s.count(anchor) == 1
i = s.index(anchor); j = s.index("\n", i)
assert "\n12. **" not in s
add = ("\n12. **Every path a declared command WRITES is a change-manifest row, and the edge-shared generator writes ALL FIVE metas.** One "
       "`npm run build:edge-shared` re-stamps `generatedAt` in every `supabase/functions/_shared/*.meta.json` (the single-build-window pin in "
       "`tests/edgeFunctions/edgeSharedBundleReproducibility.test.js` forbids restoring the siblings), so a member that owes row 10's rebuild declares "
       "each MOVED bundle and ALL FIVE metas as GENERATED rows; and because a member's sealed `checks` run the generator, a manifest that names fewer "
       "cannot pass its own seal (`sealed foreign work drifted` — EM-B1d's build STOP, 2026-09-19). The same law binds any other generator a member's "
       "`checks` run. The pre-proof also SWEEPS `tests/` as well as `src/` for every symbol the member changes and every literal it adds or retires — an "
       "exact pin or a fixture the contract reds is a declared TEST path with its cure — and, when a member adds a value to a NAMED SET, reads the set's "
       "CONSEQUENCE at its consumers: the set's name is a claim, its consumers are its meaning (EM-B1d version 4 joined a reversible status to an "
       "irreversible consequence).")
s = s[:j] + add + s[j:]
io.open(p, "w", encoding="utf-8").write(s)
print("preamble §P2 gains row 12; SHA-256:", hashlib.sha256(s.encode("utf-8")).hexdigest())
