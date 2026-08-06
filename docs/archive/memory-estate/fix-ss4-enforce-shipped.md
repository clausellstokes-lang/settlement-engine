---
name: ""
metadata: 
  node_type: memory
  type: wave-shipped
  date: 2026-07-20
  branch: claude/ss4-enforce
  commit: 472f7f51
  worktree: .claude/worktrees/vision-j
  status: NOT folded / NOT pushed
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T03:13:24.142Z
---

# SS4 enforcement+correctness+claims cluster shipped @ 472f7f51

ONE gated commit on claude/ss4-enforce (base e457d923, vision-j worktree). 20
findings dispositioned: 14 fixed (4 new standing enforcers + 4 extended + 2
correctness + 4 doc truth-ups), 5 struck with verified reasons, 1 half-refuted
(anon "three forges a day" is ACCURATE — anonAtCap gates the COMBINED 1+2=3
cap; only the unbound number was real, now pinned).

## New standing machinery (maintain, don't bypass)
- tests/lint/determinismBanCoverage.test.js — per-FILE effective-config pin of
  every determinism ban selector across generators/domain/workers/kernel/pdf +
  seam exemptions (clock.js, prng.js, pdf wall-clock). Kills the flat-config
  last-wins shadow hole. Extending a ban layer? Update LAYERS there in the
  same change.
- tests/lib/savesColumnParity.test.js — settlements ghost-column walker
  (written ⊆ supabaseList SELECT ∪ EXEMPT_UNREAD-with-reason; writer census
  pins saves.js+gallery.js as the only writers). New settlements column ⇒ add
  to the SELECT or exempt WITH reason.
- tests/security/migrationRefIntegrity.meta.test.js — every .sql basename in
  tests/security must exist; kills the runIf silent-skip class. ⚠️ CAUGHT LIVE:
  clientErrorReports.pglite.test.js still pinned 156_client_error_reports.sql
  after the V-E renumber to 167 — that pglite suite was silently skipped;
  re-pointed + passing. Renumbering migrations ⇒ this test names the stale refs.
- tests/copy/landingClaimsParity.test.js — landing capability claims bound
  two-way to DEFAULT_DAILY_CAP / tierFacts / war+grounding+golden suites.

## Hardened
- mutation-sweep.sh: attribution control (mutated=red AND reverted=green; any
  nonzero used to score CAUGHT — a moved vitest target exits 1, executed) + 4
  new areas (faction-key, ghost column, eslint shadow block, migration
  renumber via mv). 12/12 CAUGHT on the shipped run.
- check-domain-strict.mjs: --listFilesOnly scope sentinel (domain must be in
  the compilation; skipped under DOMAIN_STRICT_TSC_CMD seam) + abs/backslash
  path tolerance in the count RE; include pinned statically in
  domainStrictBaseline.test.js.
- enforcement-claims corpus = ALL root+docs md minus frozen labeled EXEMPT
  list (new docs in-corpus by default). DESIGN_COHESION_WEAVE:317's facetOf
  consumer walker claim was PHANTOM (no such walker exists) — doc corrected to
  design-intent; building that walker remains open if anyone wants it.
- rename-npc dispatcher accepts {npcIndex | npcId} (documented shape was
  silently dropped — reproduced then cleared; net-zero lines in the
  size-frozen slice).

## Hazards for successors
- ⚠️ Mid-session cwd reset: after a usage-limit resume, relative-path Bash
  landed in the DEFAULT worktree (minifold), not the brief's worktree — 8
  batches of evidence reads hit the wrong tree and had to be re-verified
  (ss4-enforce is 406 files ahead of ceb77368). cd + rev-parse per command
  block; absolute paths always.
- Covenant parity now EXECUTES buildAccountExport → validateAccountImport;
  gutting either side reds it (was symbol-existence only).

Gate (verbatim receipts in the commit body): domain-strict bare exit 0 ·
tsc full exit 0 · eslint touched 0 · 18 test files / 127 tests passed ·
mutation-sweep 12/12 CAUGHT exit 0 · NUL scan CLEAN. Full suite not run
(wave brief); expected reds = the 4 parked golden families only.
