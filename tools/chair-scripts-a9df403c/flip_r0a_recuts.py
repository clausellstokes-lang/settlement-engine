# -*- coding: utf-8 -*-
"""EM-R0a's flip-time annotation (ODQ §934.47 addendum 105): §12's "NAMES EXACTLY THESE THREE PATHS" was written before the chair's
placement cuts added three rows (the wiring-census MODIFY row and two comment-only MODIFY rows); the completion commit named SIX paths
per §7, the sealed authority. A landed record is annotated, never rewritten. Run in the worktree ON the branch AFTER flip_landed_v2.py
and BEFORE validate:packets + the commit. argv: none."""
import io

P = "docs/implementation/packets/settlement-editor/EM-R0a.md"
s = io.open(P, encoding="utf-8").read()
assert "- **Status:** `LANDED`" in s, "run flip_landed_v2.py first"
old = "⭐ **THE COMPLETION COMMIT NAMES EXACTLY THESE THREE PATHS AND NO OTHER** — the commit is made with"
assert s.count(old) == 1, s.count(old)
new = ("⭐ **THE COMPLETION COMMIT NAMES EXACTLY THESE THREE PATHS AND NO OTHER** *(RE-CUT AT THE FLIP, the chair, 2026-09-20 — ODQ §934.47 "
       "addendum 105: the three were the compile's; the chair's placement cuts added THREE more rows to §7 — the wiring-census MODIFY row "
       "(preamble row 13) and the two comment-only MODIFY rows for `tests/store/decreeRegistryPersistence.test.js` and `tests/lib/editTravel.test.js` "
       "— so the completion commit lawfully named SIX paths, §7 being the sealed authority; the build lane noticed the staleness and followed §7. "
       "A landed record is annotated, never rewritten.)* — the commit is made with")
s = s.replace(old, new, 1)
io.open(P, "w", encoding="utf-8").write(s)
print("EM-R0a §12 annotated: three paths → six per §7")
