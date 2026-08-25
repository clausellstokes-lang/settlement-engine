---
name: domain-strict-burndown-shipped
description: domain-strict gate red at w7-prep 66eda8e8+ (town-layout-v2 fold landed six townMap files w/ 112 strict errors vs ceiling 0) CLOSED by annotation-only burn-down; FOLDED @ 9150b464 (2026-07-17); baseline untouched at total:0
metadata: 
  node_type: memory
  type: project
  originSessionId: ae4f7b77-b1b5-42f0-8576-af15b79688cc
---

2026-07-17: the domain-strict ratchet (scripts/check-domain-strict.mjs, ceiling 0) was RED
at w7-prep from the town-layout-v2 fold (66eda8e8) onward — 112 errors across six
src/domain/townMap files (townLayoutV2 86 · asymmetrySources 10 · townPanorama 8 ·
lynchRubric 6 · siteGenesis 1 · townMapModel 1). The fold's receipts said "tsc 0" (the
LENIENT tsconfig.full) and its strict-gate read was pipe-masked → [[piped-gate-exit-masking]].
NOTE: the reporting session estimated ~550 errors — that was the whole tsc project surface;
the ratchet counts only src/domain/** (112). The ~438 in generators/lib/kernel are
pre-existing debt outside this gate's scope.

**Decision (governance): BURN DOWN, not re-baseline** — JSDoc @param/@typedef/@type
annotations only, keeping the only-shrinks ceiling at 0. `scripts/.domain-strict-baseline.json`
untouched at total:0. Two Opus implementers (owner model split), Fable checker.

**Shipped:** commit 9150b464 (rebased over the SM-5 + DOOR 1 folds; originally d37e7715 off
eb958f4b), FF-folded into claude/w7-prep. Receipts: gate exit 0 from BOTH worktrees ·
vitest battery 544 files / 6,521 passed (lint+architecture+build+domain+townMap v1/v2/style
goldens byte-identical) · verify:dist 146/146 · tsc full exit 0 · eslint 0 errors ·
domain-any 2230 unchanged (zero new holes) · python control-byte scan clean (F24 area).
SM-5's new domain file changeView.js verified strict-clean at fold.

**Vetoable judgment inside:** `TownV2Settlement` typedef collapsed `|null` → optional on
config/spatialLayout/economicState/defenseProfile (required for structural assignability into
the as-consumed contracts; every read is null-guarded; goldens byte-identical). Its `tier`
under-declares nullability (`string|undefined` where callers can pass null — guarded at
townLayoutV2.js:202); left as-is, seam recorded. 17 inline paren-cast sites document proven
invariants (retry-loop non-null `best`/`bestScore`, Map has→get correlation) — casts are
semantics-identical (parens only).

**How to apply:** any new src/domain file must land strict-clean (ceiling is 0 everywhere);
verify with `node scripts/check-domain-strict.mjs` and ITS exit code, never a piped read.
Related: [[town-layout-v2-shipped]], [[piped-gate-exit-masking]], [[comprehensive-review-fix-program]].
