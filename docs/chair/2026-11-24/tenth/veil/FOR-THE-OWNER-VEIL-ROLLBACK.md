# For the owner: one read before migration 212 (the veil's rollback check)

**When:** on the live database, **after 211 and before 212 is applied**. **What it does:** reads only. It changes nothing.

**Why:** 212 takes two functions away from visitors and signed-in users (RULING V23). Its down file
(`supabase/rollback/212_share_veil_later_cures.down.sql`) gives them back exactly as the tests' model of the hosted
platform had them before 212 (RULING V26). The model is not the live database, so this read compares the two
access lists on the live database with the model's.

Paste this into the SQL editor and run it:

```sql
-- READS ONLY. The access lists (proacl) of the two functions 212 closes, as they stand before 212.
select s.sig, p.oid is not null as exists_here, p.proacl::text as access_list
  from (values
    ('public._gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean)'),
    ('public._gallery_sanitize_public_json(jsonb,text[])')
  ) as s(sig)
  left join pg_proc p on p.oid = to_regprocedure(s.sig)
 order by 1;
```

**Expected answer** (two rows, each `exists_here` = true), read off the model of 001..211 under the hosted default
privileges:

| sig | access_list |
|---|---|
| `public._gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean)` | `{=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` |
| `public._gallery_sanitize_public_json(jsonb,text[])` | `{postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` |

**If the answer is the same:** 212's down file restores these two exactly. Go on.

**If any part differs** (a missing row, an extra or missing entry, a different order, or a different role name):
stop before 212. Send the answer as it stands. The down file's grant lines are corrected to that answer first, then
212 is applied.
