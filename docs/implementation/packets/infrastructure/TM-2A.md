# TM / TM-2A — storage: migration 196 and the loader (member 4 of `tm-core`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `6b337fb1f7bb1d3dde0810310a01a3653c874aac`
  (the `mb` terminal; the tm+sk family's dispatch base)
- **Train:** `tm-core`, family **TM**, member **4** of 5 — **stage 2**, promoted only
  after TM-1W LANDED released `scripts/mutation-coverage-manifest.json`.
- **Depends on:** TM-1A, TM-1W.
- **Preamble:** none — TM is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§117.1** (the schema act,
  pre-authorized) · **§117a** · **§120.2** · **§42/§43** · **§102.3**.
- **Compile of record:** `laneTC28-TM-PLAN.md` §3.4, annex rows `TM.M6`, `TM.M11`,
  `TM.U2`; laws `TM.L4`, `TM.L6`.

---

## §1 · PII-FREE BY SCHEMA, WHICH IS WHY IT IS ITS OWN TABLE

`world_sim_metrics` declares no `actor_id`, no `session_id`, no `country` and no
`consent_tier`. The property cannot regress by a policy edit or a forgotten filter,
because the columns are not there. That is §120.2's "PII-free BY SCHEMA in its own
table", executed rather than promised — and it is the whole reason the simulation
class did not become a discriminator column on `analytics_events`.

House security, unchanged from 036/038/133: RLS ON with **zero policies**, grants
revoked from `anon` and `authenticated`, BRIN on the append-only timestamp, ONE
run-scoped btree, all functions `SECURITY DEFINER` with `search_path` pinned and
execute granted to `service_role` only. The pins **execute** a privilege query
rather than matching the REVOKE text.

## §2 ⭐ · TM.U2 IS SETTLED BY EXECUTION

The compile could not know whether pglite hosts the constructs 196 needs. It does:
the BRIN index, the `SECURITY DEFINER` + `REVOKE`-from-API-roles pattern, the epoch
CHECK constraint, the `jsonb_array_elements` loader and the EAV rollup all apply and
behave under `tests/security/worldSimMetrics.pglite.test.js`. The already-wired
whole-sequence control (`migrationSequenceAll.pglite.test.js`) also stays green with
196 in the sequence, which is the executed negative control the migration-train
discipline demands.

## §3 · VALUES (§42/§43)

| Value | Home |
|---|---|
| Retention: **indefinite** | **PROPOSED-WITH-RATIONALE** in the migration header, vetoable: there is nothing to delete FOR anyone (no row is attributable to a person), the rows ARE the tuning evidence, and volume is bounded by soak cadence rather than by user growth. The deliberate contrast with 039's 400-day raw-event prune is stated in the header so a reader does not read it as an oversight. |
| No prune job | Consequence of the row above. |
| BRIN + one btree | **INHERITED** — the 036 header's own scale math, restated, not re-derived. No third index is added on speculation. |

## §4 · THE WALKER'S AWAITING ROW IS DISCHARGED HERE

TM-1W declared `196_world_sim_metrics.sql` in `SIM_METRIC_MIGRATIONS` and named it
in a shrink-only `AWAITING_MIGRATION` list. This member mints the file and **empties
that list**, and narrows Arm D's column walk to the `create table` body so it reads
columns rather than prose. Lawful because TM-1W is TERMINAL by now — which is
exactly what the train's two-stage promotion buys.

## §5 · SCOPE AND BOUNDARY

One migration, one operator-side loader, one pglite suite, one walker arm narrowed,
one mutation row. Nothing under `src/`. **Same-seed: NEUTRAL.** No running code path
reads this table.

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the table declares the run identity and none of the four forbidden columns, and a planted column is shown catchable |
| A2 | `anon` and `authenticated` hold zero privileges, RLS is on and no policy exists — all asserted by execution |
| A3 | the loader RPC writes exactly what the emitter emits and refuses a non-array payload |
| A4 | a third `epoch_kind` is refused by CHECK, so a new epoch is a schema act rather than a data act |
| A5 | `rollup_sim_metrics` returns the 038/133 EAV shape and sums across epochs |
| A6 | the whole-migration-sequence control stays green with 196 in it |

## §7 · CHECKS

```
npx vitest run tests/security/worldSimMetrics.pglite.test.js tests/security/migrationSequenceAll.pglite.test.js tests/lint/engineTelemetryWall.walker.test.js tests/lint/mutationCoverageManifest.test.js
```

## §8 · MUTANTS AND HAZARDS

- **EXECUTED ESTATE MUTANT.** `actor_id uuid` was added to the REAL migration's
  `create table` body. **Both** the walker's Arm D and the pglite column pin came
  back exit 1 naming `actor_id`. Restored, `cmp` exit 0.
- ⛔ **§102.3:** `tests/security/` is an enforcer dir ⇒ a mutation-coverage row IS
  owed and is minted, surgically, beside its `pglite-executed` siblings.
- ⚠ `validate:migration-head` reads 196 files, contiguous. Its PENDING-DEPLOY notice
  (prod applied head 121) is the normal commit→deploy window and is visible, not fatal.
- ⚠ The 180 s pglite hook-timeout class applies and is spelled with the standard
  never-tune comment.
- ⚠ **CLAIM_RE** over the migration header: **0 matches.**
- ⚠ **Census:** one new test file, five titles, **TWO** suite titles — the presence
  guard and the behaviour suite are separate `describe` blocks, which is why the
  train's suite delta is +5 and not +4.
