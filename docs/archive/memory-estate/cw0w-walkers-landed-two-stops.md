---
name: cw0w-walkers-landed-two-stops
description: "CW-0w CLOSED (FP wave #2) @ b3fb8f49+f7da6b60+03dee5fd+e30770bd — the coupling registry's four owed walkers; TWO STOPS owed a chair ruling: the desk-agreement rule is FALSIFIED for 7 of 12 kind-bearing rows (adjudication is structurally unreachable from SECTION_OF), and tests/lint/proseNumerics.test.js is RED AT BASE (401 baseline vs 410 live)"
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:27:46.877Z
---

Wave CW-0w (DESIGN_FP_ARCHITECTURE.md §5 block #2, pulled forward as J-FP-3),
2026-08-04, branch `claude/composite-r4` in the minifold worktree. Four
commits, one per slice, none pushed: `b3fb8f49` (prefix regex + registry split),
`f7da6b60` (inclusion ratchet), `03dee5fd` (schema v3 + desk walker + receipt
sampler), `e30770bd` (prose-numerics fifth detector). Wave base 99d63d92.

## What exists now

- **`couplingRegistrySchema.js` / `couplingRegistryWar.js` / `couplingRegistry.js`**
  — the registry split three ways, measured 6 / 376 / 62 effective by the
  enforcer's own Linter. The head re-exports all 30 row constants by name, so
  NO consumer import path moved. ⚠ The direction is one-way ON PURPOSE: a leaf
  importing the head would close a module cycle in src/domain. Every FUTURE
  volume's leaf imports `couplingRow` from the SCHEMA module, never from the war
  leaf and never from the head.
- **The couplingId shape pin** is now built FROM a named nine-prefix list
  (WR TR GR WF POP IN INT SP CW) in `tests/domain/couplingRegistry.test.js`.
  Seam SC-7: a tenth volume reds until consciously admitted. Before this, the
  FIRST non-WAR row would have red the file.
- **`tests/lint/couplingInclusion.walker.test.js`** + `.coupling-inclusion-baseline.json`
  — 191 modules mapped across seven layers, **152 frozen cross-layer pairs**. A
  NEW pair reds unless a registry row LICENSES it (row.direction matches and
  row.read/counterforce names the importer), so licensed pairs need no baseline
  edit and the inventory only shrinks. ⚠ Infrastructure hosts (pulseKernel,
  applyWorldPulse, worldState, settlementLifecycleKernel) are DELIBERATELY
  unmapped — L1 routes every future FP stage through the lifecycle kernel, and
  mapping it would mint a pair per mount.
- **`tests/lint/couplingDesk.walker.test.js`** — schema v3's optional frozen
  `kinds[]` (absent-never-empty), 7 rows declaring 9 kinds, plus a receiptField
  SCAN so a row cannot dodge the join by declining to declare kinds.
- **`tests/helpers/couplingReceiptSample.js`** + `tests/domain/couplingReceiptSample.test.js`
  — the SC-9 shared sampler. Honesty rule: an unresolvable address is UNSAMPLED
  with a reason, NEVER a silent pass.

## ⛔ TWO STOPS OWED A CHAIR RULING

1. **The desk-agreement rule is FALSIFIED by the live tree.** Both
   DESIGN_FP_COUPLINGS.md §6 and DESIGN_FP_ARCH_CW.md §4 spec the desk walker as
   "every registry row's kinds route to intendedDesk". MEASURED: it holds for
   **5 of the 12** rows whose receiptField names Herald kinds and fails for
   **7**. `heraldRouting.js` says why in its own WR-10 comment — **adjudication
   is NEVER a token output**; it is decided at the RECORD layer — and TEN
   registry rows carry `intendedDesk: 'adjudication'`. CW-ARCH's S13 read that
   same comment as evidence the two AGREE. The 7 disputes are frozen
   shrink-only in the walker's DISPUTED register (11 row-kind pairs). Five are
   the structural-desk case; **two are genuine splits with no excuse**:
   `CPL-1.WAR_TO_TRADE.WR-6.coalition_settlement` claims `trade` while
   `coalition_apportionment` files under `events`, and
   `CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter` claims `war` while
   `envoy_parlaying`/`envoy_held` file under `events`. Neither side is an
   implementer's to move: intendedDesk is owner-facing editorial intent,
   SECTION_OF is the paper's single-home law.
2. **`tests/lint/proseNumerics.test.js` is RED AT BASE.** At 99d63d92 the
   committed baseline holds 401 rows while the tree scans to **410** — seven
   unrecorded floatInterpolation leaks, two twoDecimalScore, plus ~100 rows
   whose line identities moved under the war-era waves. §10.4 makes that a
   STOP-and-report, never a re-record. A reviewed re-record needs a chair ruling
   in FABLE_VALIDATION_QUEUE.md; re-recording inside any lane would launder nine
   other lanes' prose leaks and raise two frozen ceilings.

## ⭐ BOTH STOPS RULED AND EXECUTED AT CYCLE CLOSE (migrated from the memory index, 2026-08-06)

The two stops above are **no longer owed** — both were ruled by the chair and
executed at the FP cycle-1 close. Recorded here because the index line carried the
outcome while this file still read "OWED":

1. **The desk-agreement stop → ruled as `CR-FP-1`, resolved AUTHORITY-ROUTED.**
   intendedDesk stays owner-facing editorial intent and SECTION_OF stays the
   paper's single-home law; the 7 disputes stay frozen shrink-only in the DISPUTED
   register rather than either side being moved by an implementer.
2. **The proseNumerics stop → ruled as `CR-FP-2`, a REVIEWED RE-RECORD.** The
   401-baseline / 410-live gap was re-recorded under the ruling rather than
   laundered inside a lane. ⚠ Note `CR-FP-2`'s originally STATED cause was
   REFUTED on execution — the act executed against the MEASURED cause, not the
   documented one (see [[fp-cycle1-serialized-landing-and-cq5-row-guard]]).

## The nine-prefix set is CLOSED, and the fold makes it eleven

The couplingId prefix list (WR TR GR WF POP IN INT SP CW) is a CLOSED set of
**nine**, and seam SC-7 reds until a new volume is consciously admitted. Recorded
so the next admission is not mistaken for a defect: **ES and WY become the TENTH
and ELEVENTH prefixes at their fold** — both volumes are architected and pending
fold, so two admissions are already owed and expected.

## Hazards this wave re-confirmed by execution

- ⚠⚠ **A raw NUL was authored again** (7th time) into
  `tests/lint/couplingDesk.walker.test.js` line 112, where a separator was
  intended. Caught ONLY by the python3 byte-scan; vitest was green with it.
- ⚠⚠ **A sweep perl anchor spelled the arrow `→`** — perl reads `\u` as a
  case escape, so it matched nothing, changed nothing and exited 0. Caught by
  MEASURING the baseline before/after (152 then 152). Never use `→` or `→`
  in a `perl -0pi` pattern; match `[^"]*` instead, and always prove the anchor
  applied.
- ⚠ **CW-ARCH S5's "couplingRegistry.js = 575 effective" is the RAW count.**
  Measured 394 effective at the time. Re-measure every size with the enforcer
  Linter; never inherit one from a document.
- ⚠ **The shared coverage manifest is a concurrent-lane collision surface.** A
  python json round-trip reformatted all 1,884 lines; restore from
  `git show HEAD:<path> >` and edit surgically. When another lane's rows are
  already in the worktree, build the INDEX entry from HEAD + your rows only,
  `git add`, then restore the worktree file — never stage a shared file whole.

## How to apply

Before any FP wave lands a cross-layer read: the row goes in the SAME commit and
must name the IMPORTER as its `read` address, or `couplingInclusion.walker` reds.
Before any wave adds a Herald kind to a registry row: declare it in `kinds[]`
only if `SECTION_OF(kind) === row.intendedDesk`; otherwise it belongs in the
disputed register and the chair rules. IN-5 owns the belief_misjudgment refile —
the desk walker reads both sides live and stays green through the flip.
