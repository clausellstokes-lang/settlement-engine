# -*- coding: utf-8 -*-
"""EM-B1f's flip-time re-cuts (ODQ §934.47 addenda 84, 86): (1) §6's verbatim contract line and its §11 echo take the HAYSTACK-cast
form the sealed build proved (TS2345 on both configs otherwise; the needle is never cast into NpcStatus); (2) §13.0's base-table
prose is corrected — at the tip the house IS swept from `powerStructure.factions` for `exiled`/`removed` and a `faction_dissolved`
beat fires (arm-independent; the person kept in every cell). Run in the worktree ON the branch AFTER flip_landed_v2.py and BEFORE
validate:packets + the commit. argv: none. Asserts each anchor is unique; prints the counts."""
import io, re

P = "docs/implementation/packets/settlement-editor/EM-B1f.md"
s = io.open(P, encoding="utf-8").read()
assert "- **Status:** `LANDED`" in s, "run flip_landed_v2.py first"

# (1) the contract line: two occurrences (§6's code block and §11's rule list)
old_code = "  if (o && OFF_STAGE_STATUSES.includes(String(o.status || '').toLowerCase())) return true;"
new_code = "  if (o && /** @type {readonly string[]} */ (OFF_STAGE_STATUSES).includes(String(o.status || '').toLowerCase())) return true;"
assert s.count(old_code) == 1, s.count(old_code)
s = s.replace(old_code, new_code, 1)
old_rule = "3. OFF_STAGE_STATUSES.includes(String(o?.status||'').toLowerCase())  ⇒ off-stage"
new_rule = "3. /** @type {readonly string[]} */ (OFF_STAGE_STATUSES).includes(String(o?.status||'').toLowerCase())  ⇒ off-stage"
assert s.count(old_rule) == 1, s.count(old_rule)
s = s.replace(old_rule, new_rule, 1)
note6 = ("\n> **RE-CUT AT THE FLIP (the chair, 2026-09-20; ODQ §934.47 addenda 84, 86):** the verbatim contract as pre-proofed did not typecheck — "
         "`NPC_UNAVAILABLE_STATUSES` is `readonly NpcStatus[]`, so `.includes(<string>)` is `TS2345` on BOTH sealed configs (+1 against a baseline of 0). "
         "The sealed build cured it with the file's adjacent idiom, widening the HAYSTACK (`/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)`), never "
         "casting the untrusted runtime string into `NpcStatus`; nothing measured moved (293 effective, +184 B, the declaration line byte-identical; both "
         "typechecks at their ceilings). The two lines above now read as the tree does.\n")
h6 = "## 6. Exact contracts\n"; assert s.count(h6) == 1
s = s.replace(h6, h6 + note6, 1)

# (2) §13.0's base-table prose
old13a = "**no house leaves `powerStructure.factions` in any cell**"
assert s.count(old13a) == 1, s.count(old13a)
s = s.replace(old13a, "**no house leaves `powerStructure.factions` in any cell** *(REFUTED AT THE BUILD — see the re-cut below: for `exiled`/`removed` the house IS swept)*", 1)
note13 = ("\n> **RE-CUT AT THE FLIP (the chair, 2026-09-20; ODQ §934.47 addendum 84):** the sealed build re-executed this table against the real tree at "
          "`c127cdfb2` and REFUTED its base claim for `exiled`/`removed`: the house IS swept from `powerStructure.factions` (`[The Crown]`) and a "
          "`faction_dissolved` beat DOES fire — seed-stable, the premise files unmoved. It is ARM-INDEPENDENT and the person is kept in every cell, so it "
          "does not touch the promotion verdict (both arms identical row for row; the liveness anchor `false`/`true`); v3's 'dissolved, person kept' is what "
          "reproduces. The prose above stands as the pre-proof wrote it, with this correction beside it — a landed packet's record is not rewritten, it is annotated.\n")
h13 = re.search(r"^## 13\. .*$", s, flags=re.M); assert h13
s = s[:h13.end() + 1] + note13 + s[h13.end() + 1:]
io.open(P, "w", encoding="utf-8").write(s)
print("EM-B1f re-cuts: §6 contract (2 lines) + note; §13.0 refutation marked + note")
