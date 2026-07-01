# Migration rollback runbook

Supabase migrations are **forward-only** — `supabase db push` applies `.sql` files in
order and there is no built-in `down`. The audit named the absence of any reversal path
for the money/PII schema the "scariest operational gap": a bad migration reaching prod
was forward-fix-only, by hand, under incident pressure. This directory is the reversal
discipline.

## Philosophy: forward-fix first

For most bugs, the safe move is a **new forward migration** that corrects the problem,
not a rollback — a rollback that touches data can lose money/PII, and a half-correct
`down` script run in a panic is worse than none. Reach for a reversal only when a
migration is *structurally* wrong (a bad constraint/trigger/index blocking writes) and
forward-fixing is slower than reverting.

## What lives here

`<NNN>_<slug>.down.sql` — a reversal for migration `<NNN>`, but **only for the
data-safe, schema-additive part**. Dropping a trigger/function/index/constraint the
migration ADDED restores the prior schema without touching rows. Reversals are NOT
auto-applied by `db push`; run one by hand against the target DB during an incident:

```bash
psql "$DATABASE_URL" -f supabase/rollback/097_enforce_allocation_within_grant.down.sql
```

## What is NOT scripted (reverse by hand, deliberately)

- **Data migrations** (row edits, back-fills, the 087 refund pre-dedup that deletes
  duplicate grant rows): irreversible by script — the removed rows are gone. Restore
  from a point-in-time backup if you must.
- **RLS policy tightening / column pins** (e.g. 087's column-pinned self-update
  policy): reversing a security tightening re-opens the hole. Do it only with eyes
  open, per-column, reviewed — never as a blanket auto-`down`.
- **`DROP`s of prior objects**: recreate from the prior migration's body (its
  net-current definition), not a remembered shape.

## Discipline for NEW migrations

Every new migration SHOULD carry a `-- @rollback:` line stating how to reverse it
(even if the answer is "forward-fix only — data migration"). `tests/docs/migrationRollbackDiscipline.test.js`
checks the recent money/PII migrations either ship a `.down.sql` here or carry that
annotation, so reversibility is a tracked property, not an afterthought discovered
mid-incident.
