# ⛔⛔ THIS BRIEF'S PREMISE WAS REFUTED BY EXECUTION — WITHDRAWN 2026-09-15, NOT AMENDED

The chair chartered this as "a PROMISE violation on imported dossiers" and told the owner so. **It is not one.** An imported town does NOT reach the desks seedless: `deskSeed` is `String(r?._seed ?? r?.id ?? '')`, and while the importer nulls `_seed`, the `id` SURVIVES (`publicSafe.js:55` allowlists it; `normalizeSettlement.js:191` mints one when absent). Executed end to end on a real generated-then-imported town: today's seed is `s_e07960f5cb437fd6::under_siege` and the cured seed is byte-identical. **An imported dossier's crisis line is drawn from a content-stable id. THE PROMISE was never being broken there.**

⚠ **HOW THE CHAIR GOT IT WRONG, named because it is this programme's own worst failure mode:** the finding was inferred from a KERNEL DOCBLOCK rather than executed — FLOOR 1 BY INFERENCE, the exact fault the sitting identified as the re-cut's chief risk, committed by the chair in a charter and repeated to the owner as fact. THE LESSON, for every future charter: a defect asserted from a comment is a hypothesis; only an executed probe makes it a finding.

WHAT WAS REAL AND WHAT THE CAR DID IS BELOW; the mechanism (a join makes a falsy seed truthy, so canonical-at-zero never runs) is genuine and is cured at both call sites, with ZERO production paths moved.

---

# ⛔ A PROMISE VIOLATION ON IMPORTED DOSSIERS — the crisis line is drawn pseudo-randomly where the law says it must not be

Found by the dark-pool defect car while curing the RATE instrument, reported and NOT fixed because it changes drawn prose. It is chartered on its own because of WHAT it breaks.

`src/components/new/tabs/OverviewTab.jsx:299` builds the per-banner seed as `` `${deskSeed}::${v.type}` ``. On an IMPORTED town `deskSeed` is the empty string, so the seed is not empty — it is the literal `::famine` — and `drawVariant` therefore returns vid 3 where the SEEDLESS LAW requires vid 1 (canonical-at-zero). **An imported dossier's crisis line is drawn pseudo-randomly on the one mount whose whole promise is that it is not.** THE PROMISE is constitutional in this programme (a seed is a starting world forever; the same seed and state always give the same page), and an imported record is exactly the case a reader most expects to be stable.

THE JOB: confirm the defect by executing it (import a town with a crisis banner, print the drawn vid, then the same with a non-empty deskSeed); establish the correct behaviour from the seedless law's own statement — canonical-at-zero, vid 1 — and cure it at the call site; then sweep for the SAME SHAPE elsewhere: any `` `${x}::${y}` `` seed built from a value that can legitimately be empty is the same defect, and the car should report every instance it finds even where it does not cure them. The cure shape the finder suggested is one ternary; verify that before adopting it.

THIS IS A DECLARED BEHAVIOUR SHIFT: drawn prose moves on imported dossiers. Declare it with figures (how many mounts, which banners, before/after vids), re-record any golden ONLY with the cause stated, and do not let the shift ride under a word like "fix".

DOCK: cut your OWN worktree — `git worktree add $SC/kit/lane-promise <sha>` from the DEF-2 dock's repo — because `laneRW-DEF2` is owned by a running prose workflow (chair manual §6.4b). Never push. `/usr/bin/grep`. THE CHECKPOINT LAW. Trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

Return: the EXECUTED confirmation (before/after vids) · COMMIT · FILES · SHIFT (declared, with figures) · THE SWEEP (every same-shape seed found, cured or not) · GATE · HAZARDS · OPEN.
