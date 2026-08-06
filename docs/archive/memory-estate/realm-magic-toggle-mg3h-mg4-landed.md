---
name: realm-magic-toggle-mg3h-mg4-landed
description: "MG-3h + MG-4 landed 2026-08-03 (a80c0be4, eea5a6c6) — the realm magic toggle's leak register is closed except L2/L3, which stay blocked on warDeployment's size ratchet; MG-4's twin-world bands are PENDING owner signature"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T12:11:44.313Z
---

Program: `docs/DESIGN_REALM_MAGIC_TOGGLE.md` on `claude/composite-r4` (worktree
`.claude/worktrees/minifold`). State as of **2026-08-03**, all COMMITTED, **not pushed**.

- **MG-1** `5fff5352` (the modal + fourth knob), **MG-2** `648fa634` (the projection).
- **MG-3a/c/d/e/f/g** landed earlier; leaks L1, L4–L9 closed.
- **MG-3h** `a80c0be4` — L10, L11, L12 closed under chair ruling **R-BLD-5**. See
  [[arcane-classifier-catalog-tag-cure]] for the architecture and its live hazards.
- **MG-4** `eea5a6c6` — `tests/lib/instantWorld/mundaneRealmAcceptance.test.js`, 20 pins.

**⛔ STILL OPEN — L2 + L3, ONE blocked item, not two.** `stampWarMagicLaw` has zero callers
in `src/`; the reader (`feasibilityGate.pairMagicFunctions`) landed inert, so a whole-mundane
realm still verdicts `require_magic` off ironmongery. Both unblock on the same line at
`warDeployment.js:716`, which measures 1412 effective lines against a frozen ceiling of 1106
in `scripts/.size-baseline.json` — the pre-commit gate rejects ANY staged change to that
file from ANY lane. Same wall as WR-7b. Do not raise the frozen number; it is shrink-only
and not a lane decision.

**MG-4 MEASURED (seed `mg4-acceptance`, small/realistic_regional/highIsland, 5 members):**
world_law_magic 5/5 green; zero arcane institutions/factions/services/history events; zero
teleport edges even with a planted circle; magicProfile all-absent everywhere. The
same-seed MAGICAL twin carries 4/1/8/2 of those — the twin is the control on every census.
Twin-world envelope: members 1.000, institutions 0.987 (156 vs 158), factions 1.000.
**⚠️ `PENDING_BANDS` in that file are NOT owner-signed** — §6 puts them on the soak. They
are generous collapse-catchers; one seed cannot answer a seed-FAMILY question. Replace them
and delete the note when the owner signs.

**Why:** MG-3h had a RECORDED STOP saying L10–L12 could not be done without a 10-site
contract change. That stop was correct about its own design and is now superseded, not
overruled — the doc keeps both blocks. Anyone re-reading the stop without the ruling above
it will re-block work that is already finished.

**How to apply:** resume from `docs/DESIGN_REALM_MAGIC_TOGGLE.md` — every slice carries its
own ✅/⛔ block with receipts. Three mutants deliberately do NOT red MG-4 and the file's
header says why (the projection's dial half is derivable from the world fact at
`resolveConfig.js:79`; magicFilter's strip and institutionProbability's dial-zero are two
independent suppressions; MG-3h's L11 gate is a pinned no-op on the resolved path). Do not
"fix" those into redding. **Also deferred, not a bug:**
`tests/lint/configMigrationSingleWriter.walker.test.js` (landed by MG-3f) has no
`scripts/mutation-coverage-manifest.json` entry and reds the E-A totality contract; it needs
its author's rationale line, not a guessed one.

Related: [[arcane-classifier-catalog-tag-cure]], [[stressor-kernel-byid-wrapper-trap]],
[[minifold-tree-is-live]], [[sizebaseline-exact-ceiling-hazard]].
