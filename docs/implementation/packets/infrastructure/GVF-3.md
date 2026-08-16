# GVF / GVF-3 — the admin search LIKE-wildcard strip (member 3 of `gvf`, SECURITY, §62.2)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `ec7443301ec74325cd051890d0e99ed452bd8ad5`
  (the `gv` terminal; the micro-batch's third train base)
- **Train:** `gvf`, family **GVF**, member **3** of 3.
- **Preamble:** none — GVF is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§62.2** · **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.2, annex row `MB.M15`.

---

## §1 · THE DEFECT

`supabase/functions/admin-actions/index.ts` `list_users` builds

```ts
query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`)
```

from a caller-supplied string. The sanitiser above it strips PostgREST logical-filter
metacharacters — commas, parens, `*`, backslash — and its own comment scopes itself to break-out
of the `.or()` expression. It says nothing about `%` and `_`, which pass through into the pattern
as SQL LIKE metacharacters.

**The harm is precision, not volume.** The query is already capped at 100 rows, so `%` alone
returns what an empty search returns. What the metacharacters buy is a PATTERN ORACLE: `a%z`,
`a_c` and friends let an elevated admin probe the profile table for email *shapes* rather than
search for a string they already hold. The box is meant to be a literal substring search. LOW,
one line plus its pin.

## §2 · THE CURE

`%` and `_` join the stripped class: `/[,()*\\%_]/g`. Stripping rather than escaping is the
available cure, not merely the simple one — PostgREST's `ilike` exposes no in-value escape, and
the sanitiser already strips backslash, so an inserted escape sequence could not survive its own
pass. It is also the idiom already in force: `*` has always been stripped here, because PostgREST
accepts it as an alias for `%`.

⚠ **STATED BEHAVIOUR CHANGE.** A literal `_` in a search no longer matches — it becomes a space,
so `john_doe` searches as `john doe`. That is the same cost `*` has carried here since the
sanitiser was written, and it is recorded in-file rather than left to be discovered.

## §3 · THE CONTROL ARM

The pin DERIVES the sanitiser's own character class out of the source and EXECUTES it. A
hand-copied replica would mirror the deriver and could never see the producer drift away from it
— the fixture-mirrors-the-deriver class, which is precisely what this batch exists to kill. The
arm then asserts the BUILT PATTERN, not merely that the call happens, and that the query is
composed from the sanitised binding rather than the raw one.

## §4 · SCOPE AND BOUNDARY

This closes the metacharacter leg at the one site that reaches an `ilike` pattern from caller
input. It does not touch the break-out sanitiser's existing class, the redacted column set, the
email masking, the 100-row cap, or any other action in the function.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | `%` and `_` cannot reach either ilike pattern |
| A2 | the previously handled break-out set still cannot reach it |
| A3 | the pin derives the class from source rather than replicating it |
| A4 | the pin asserts the built pattern, not just that the call occurs |
| A5 | the query is composed from the sanitised binding, never the raw one |
| A6 | reverting the class to its pre-cure form reds the pin, naming the metacharacter |

## §6 · CHECKS

```
npx vitest run tests/edgeFunctions/contracts.test.js
```

## §7 · MUTANTS AND HAZARDS

- **Estate plant.** The character class reverted to its pre-cure form in the REAL
  `admin-actions/index.ts` reds the pin, naming `"%" must not reach the ilike pattern`. Restored
  byte-exact, verified by `cmp`.
- ⚠ **Same-seed: NEUTRAL.** An edge function, in no generation closure.
- ⚠ **Census:** no test FILE is created or deleted. `titles` moves by one.
- ⚠ This is an EDGE FUNCTION, so the change is inert until the function is redeployed. The pin
  is a source contract and holds at the repository regardless.
