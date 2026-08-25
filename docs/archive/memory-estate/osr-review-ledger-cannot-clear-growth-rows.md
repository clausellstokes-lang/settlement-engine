---
name: osr-review-ledger-cannot-clear-growth-rows
description: "⛔⛔ CR-OSR-FREEZE-3-R2's PREMISE IS EXECUTION-REFUTED (Opus review lane, 2026-08-10, POSITIVE+NEGATIVE CONTROL RUN): `validateReviewLedger` throws on `report.issues` BEFORE it reads a single decision, and `issues` is derived MECHANICALLY from the new/increased reconciliation — so a COMPLETE, fully-accepted 2,326-row review ledger with a real note on every row STILL THROWS while any growth row exists; ⚠⚠ reviewing the 171 rows is NECESSARY but CANNOT green the migration — the schema-4 lane must also rewire how `issues` is computed"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T23:04:05.633Z
---

## The mechanism, by file:line

`scripts/migrate-observed-shape-readers.mjs`:

- **:441-444** — `predecessorIssues` is built by *filtering the reconciliation*: every
  predecessor row whose `reconciliation` is `'new'` or `'increased'` becomes an issue string.
  Nothing about a review decision enters this computation.
- **:518** — `issues: predecessorIssues` is placed on the report.
- **:596-598** — `validateReviewLedger` throws
  `observed-shape migration report has unresolved issues: …` **before** it validates the
  decisions array (which starts at :599).

So the ordering is: schema check → bindings check → **issues check** → decisions check.
A ledger never reaches its own decisions while a growth row exists.

## The executed control (this is the receipt, not the reading)

`scratchpad/osrfreeze2-issuesgate.mjs` builds one minimal synthetic report and runs it twice,
differing in **exactly one field** (`issues`). Both runs use a COMPLETE ledger produced by the
repo's own `reviewTemplateOf`, with every decision set to `accept` and a real note:

```
WITH one growth issue (the live situation): THREW — observed-shape migration report has
  unresolved issues: src/x.js: "k on s" is new against the schema-2 predecessor (0 -> 1)
WITH issues cleared (control): PASSED — authorization keys: 13
```

The negative control proves the ledger itself is well-formed and would authorize; the positive
control proves `issues` alone is what blocks.

## What this means for the freeze path

CR-OSR-FREEZE-3-R2 says "the 171 growth rows are reviewed first, then the genesis freezes,
the review ledger the validator enforces is honored, never amended around." The review is
still worth doing (and is done — see [[osr-171-growth-rows-triaged]]), but **honoring the
ledger is not sufficient**. The schema-4 author lane must ALSO do one of:

1. Make `predecessorIssues` skip rows the ledger accepts (an issue is raised only for a growth
   row whose decision is absent or not `accept`) — the change that makes the ledger mean what
   R2 assumed it means; or
2. Accept that a schema-2 → schema-N migration through this tool can never validate while the
   heuristic leg's inventory grows at all, and take a different genesis route.

⚠ Option 1 is a governance-surface change: it converts `issues` from "the reconciliation is
not clean" to "the reconciliation is not *reviewed*". State that in writing when it lands, or a
later reader will think the gate weakened by accident.

## Other hardcoded schema-3 surfaces a schema-4 lane must move

- `scripts/migrate-observed-shape-readers.mjs:447` — `kind: 'observed-shape-schema-2-to-3-migration'`
- `scripts/migrate-observed-shape-readers.mjs:474` — `baselineSchema: 3`
- `scripts/lib/observed-shape-baseline.mjs:21` — `export const BASELINE_SCHEMA = 3;`
- `scripts/lib/observed-shape-baseline.mjs:242` — the literal message `'observed-shape baseline is not schema 3'`

Related: [[osr-schema3-freeze-refused-measured]] · [[osr-resolver-state-identity-ruling]] ·
[[osr-171-growth-rows-triaged]] · [[osr-heuristic-leg-detector-mechanisms]].
