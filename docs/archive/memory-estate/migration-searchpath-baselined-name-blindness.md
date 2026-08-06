---
name: migration-searchpath-baselined-name-blindness
description: "migrationSearchPathPin keys on function NAME, so a baselined name recreated bare by a NEW migration stayed green; POST_CONVENTION_BARE now ledgers every violator whose net-current migration is >= 131, and 147's five gallery definers sit in it unfixed"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T13:04:20.294Z
---

Landed 2026-08-03 as VH-3, commit `ebeabb52` on `claude/composite-r4` in the
minifold worktree (committed, NOT pushed; migration 195 is DARK/undeployed).

`supabase/migrations/195_civility_guard_and_public_identity.sql` recreated
`public.update_display_name` with a bare `set search_path = public` while every
other definer in the same file pinned `public, pg_temp`. Migration 131's repin
sweep had missed this function, so 009 stayed its net-current with the bare form
and 195 inherited the gap. Now pinned; byte-neutral to behaviour, and it lands
before the function ever deploys. The baseline
`tests/lint/.migration-searchpath-baseline.json` shrank 69 → 68 in lockstep, and
the name joined `REPINNED_POST_111` so both directions are held.

**Why nothing caught it:** `tests/lint/migrationSearchPathPin.test.js` keys
entirely on the function NAME. A baselined name is excused FOREVER — a later
migration can `create or replace` it bare and the ratchet stays green, however
many times it is rewritten. The frozen baseline is the right instrument for
pre-convention DEBT, but it cannot express the property that matters: a
definition AUTHORED AFTER the convention has no excuse whatever its name's
history. Bare leaves `pg_temp` implicitly FIRST, the CVE-2018-1058
search-path-hijack shape that 094/111/131 exist to close.

**How to apply:** the second ledger `POST_CONVENTION_BARE` in that test enumerates
every violator whose NET-CURRENT definition lives in a migration numbered >=
`CONVENTION_MIGRATION` (131). Exact-match, shrink-only, and it asserts PROVENANCE
as well as membership — a row whose net-current moved to a different migration is
an unreviewed recreate, which is the event that produced this finding. Any future
migration recreating ANY definer without the pin reds here on arrival. When it
reds: add `set search_path = public, pg_temp` (pg_temp LAST) to that function's
net-current definition; do NOT add a row. Both directions were executed
2026-08-03 (revert the pin → 3 of 5 red; pin one ledger row → the shrink-only arm
reds; restored → 5/5 green).

⚠️ DEFERRED, RECORDED, NOT A BUG TO RE-FIND: building the ledger surfaced FIVE
more post-convention bare definers, all from
`147_gallery_tile_chain_aliveness_title_reactions.sql` —
`_gallery_public_tile_rows`, `list_gallery_dossiers`,
`list_gallery_more_by_creator`, `get_gallery_dossier`, `list_my_gallery_dossiers`.
They are another lane's surface and each pin is its own owner-gated
security-posture call, so they are frozen in the ledger with that reason attached.

Related: [[public-payload-veil-seam]], [[git-checkout-discards-uncommitted-work]].
