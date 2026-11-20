# TRAD-5 · UNIT 11, THIRD COMMIT — THE TABLE'S HEADER COMMENT NAMES THE MIXED PICK

Written 2026-11-20 18:58 UTC by TRAD-5 on the chair's word of 18:57 UTC ("Also stale, to fix in the unit: the table's header comment still
names `pickVariant`"). Vetoable by the owner. A list executed verbatim.

Base: `trad5-u11` (unit 11's two commits, `dbfca2aa1`, plus this brief).

THE ONE EDIT: in `src/data/traditionDescriptionTable.js`, the header comment's
"`kernel/proseHash.js :: pickVariant` on the record's stable id" becomes
"`kernel/proseHash.js :: pickVariantMixed` on the record's stable id" (the leaf's pick since unit 11's second commit).
Nothing else in the file; no other file. If the comment line then runs past the file's comment width, re-wrap ONLY that
comment paragraph, no word changed.

PROOF: `git diff` touches that one comment only; `npx eslint src/data/traditionDescriptionTable.js` exit 0. Commit by
explicit path, message "docs(trad-5 u11): the table's header comment names the mixed pick (pickVariant -> pickVariantMixed)"
with the session trailers. Never push.
