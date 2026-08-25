---
name: unanchored-net-current-extractor-class
description: "⚠️⚠️ The house net-current SQL extractors match `create or replace function public.<name>` UNANCHORED, so a migration header quoting that line in prose gets extracted instead of the function — 101 and 098 are live instances; cure = `^` + `m` flag; 12 sites still unfixed; moneyRpcNetCurrentGuards + surveyorProbeTierSql fixed 2026-07-27"
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-27T18:02:06.563Z
  originSessionId: 88199162-811c-4be3-8912-b0f33c64d43d
---

**The defect.** Dozens of tests read a function out of `supabase/migrations` with

```js
new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'gi')
```

Without `^` and the `m` flag, that regex matches a migration HEADER that quotes the
create statement in prose. The extract then begins mid-comment and swallows the
header — or, worse, an *unrelated* function's body — instead of the real definition.
Wave L-5 hit this while writing migration 192 and fed Postgres ~11k characters of
English.

**It is live in the corpus, not hypothetical.** Measured 2026-07-27 across all 192
migrations, exactly two names extract differently under the anchored form, and both
are the bug:

- `101_drop_privileged_email_backdoor.sql` — its `@rollback` note quotes
  `create or replace function public.current_user_is_privileged()`; the unanchored
  form starts there (the extract's first line even ends with a stray backtick).
- `098_fix_allocation_trigger_double_count.sql` — its comment wraps mid-identifier,
  so the unanchored form invents a phantom function named `enforce_allocation_`.

Every other one of the 367 discovered names extracts byte-identically. **Anchoring is
therefore provably free** — it changes only the broken cases.

**Why it is worse in a source-only suite than a pglite one.** A pglite suite fails
loudly (Postgres refuses to parse prose). A suite that only asserts over extracted
text stays GREEN, because a header discussing the money path necessarily mentions
`account_is_active`, `for update` and `service_role` by name. `moneyRpcNetCurrentGuards`
was exactly that shape: a money guard that would have gone on reporting the RPCs safe
while asserting over English.

**The cure, shipped 2026-07-27 (uncommitted, minifold):**
`tests/security/moneyRpcNetCurrentGuards.test.js` and
`tests/security/surveyorProbeTierSql.pglite.test.js` now anchor at line start, matching
`tests/security/tierCreditMultiplierSql.pglite.test.js` and `tests/config/pricing.test.js`
(anchored by L-5). moneyRpc also gained:

- last-definition-in-file extraction (net-current semantics; a no-op today because no
  file defines either money RPC twice);
- `assertFunctionShaped()` — five properties, throwing `MIS-EXTRACT of <name>` rather
  than returning prose: starts with the create line · closed dollar quote · **no `--`
  line between the create statement and `as $tag$`** (only 1 of 528 corpus signature
  regions does this, 172's `list_gallery_comments`) · no second anchored self-definition
  · a plpgsql `begin`;
- three guard-the-guard cases, one of which scans the whole corpus for mid-line quotes
  and asserts the anchored form never matches one.

Mutation-proved: un-anchoring the regex reds the negative control *and* the corpus case,
and with the anchor gone `assertFunctionShaped` throws instead of passing over prose.

**⚠️ STILL UNANCHORED (12 sites, chip spawned 2026-07-27).** Silent-green risk (text
assertions only): `tests/security/snapshotDenylistDrift.test.js`,
`tests/security/refundLedger.contract.test.js` (5 sites),
`tests/edgeFunctions/contracts.test.js:1369`, `tests/lint/founderSeatsMigration.test.js:68`.
Loud (pglite): `aiSpendSafety`, `factionMemberPublicParity`, `creditPackClawback`,
`gallerySanitize`, `galleryDmFull`, `galleryMapMemberCount`. Name enumerators (phantom
names): `tests/lint/migrationSearchPathPin.test.js:65`,
`tests/lint/migrationGrantPosturePin.test.js:59`.

**The wider class.** Any lazy regex slicing SQL out of a migration can be fooled by
prose. A second instance bit the same day: `surveyorProbeTierSql.pglite.test.js`'s ALTER
extractor `[\s\S]*?;` truncates on a `;` inside a `--` comment that wave L-7a added
*inside* migration 191's ALTER statement.

**How to apply.** Before writing or reviewing any migration-reading test: anchor at line
start, and never let a lazy `[\s\S]*?<delimiter>` run across comment lines. Before writing
a migration header: never spell the literal create-or-replace statement (192's header
records this rule). The real cure is a walker forbidding the unanchored form —
proposed, not built. Related: [[shared-tree-fpg3-and-grep-nul-gotcha]],
[[migration-ref-integrity-walker-fixture-trap]].
