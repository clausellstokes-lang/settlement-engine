# WEBSITE / WEB-2 — the concrete retention numbers, and the aggregate that has to become durable first

- **Status:** LANDED
- **Landed at:** the `web-a` train's second car, on the lane tip held for the chair's CAS.
  Built by lane TE-WEB2 on 2026-08-23 (holding tip `1d93458a5837aff491dd686eec9106044ff00780`,
  pinned at `refs/preserve/holding-web2`). Do not redispatch.
- **Verified base:** `claude/composite-r4` at `c129593816b13640e5740603ca3e51d68ee711fc`
- **Landing note:** the verified base is the landing slot (the UC-0 + UC-3 stacked landing,
  landings 39–40). The member was authored at `4060f690036c79e1c6190cb052bdb221bde93cde` (WEB-1's
  landing) as `a4526b85` (the member) + `1d93458a` (this packet) and rebased onto the slot by lane
  TE-WEB2-LANDING as `99d77b0a05846b8d061060b62b496e3f83e494d2` (the member, applied clean) + the
  packet commit that carries this re-stamp; 45 landings crossed. Three of this member's files had
  moved under it (`INDEX.md`, the manifest, `scripts/mutation-coverage-manifest.json` — distinct
  hunks, auto-merged); the eight others, INCLUDING every migration-doc figure and the rehearsal
  core/test WEB-1 had moved to 197, were the SAME blob at base and slot, so the 198 edits applied
  as authored. The census walker (§8) was written ONCE at this landing act, never carried. The
  packet walked READY → LANDED at the slot (§11).
- **Train:** `web-a`, family **WEBSITE**, member **2**. WEB-1 founds the family and carries its
  header; this packet adds a ROW to that family, never a second header.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§359.7** (the ruling) · **§402 C2** (the numbers
  table, chair-SIGNED, including the mandatory in-member order) · **§446** (WEB-1 landed, so this
  member's migration number is 198) · **§408** (the authority to mint this packet).
- **censusAuthorization:** §359.7, ratified at §402 C2.
- **Compile of record:** `draft-WEBSITE-PLAN.md` §2 (member) and §13 (standing laws).

---

## §1 · THE RULING, AND THE COUPLING THAT DECIDES WHETHER IT IS SAFE

§359.7 ruled the PRINCIPLE — "the shortest retention consistent with product function,
privacy-preserving default" — and said the concrete numbers are compiled from it and
chair-signed in this charter. §402 C2 signed them. This member is the server half.

The number that matters is `analytics_events`: **400 days → 90**. It cannot simply be
written, because of a coupling that is invisible in the diff. 038's
`mv_retention_cohorts` recomputes `first_seen` from RAW `analytics_events` at every
refresh, so pruning raw to N days truncates every cohort curve at N **and** re-mints
phantom later cohorts for actors whose real first contact fell outside the window.
**400 days of raw person-adjacent rows exist today precisely BECAUSE the aggregate is
derived destructively.** Shorten the window first and the product quietly loses
retention analysis while the dashboards keep drawing a plausible-looking curve.

So the order is mandatory — durable table, backfill, then shorten — and this member does
not merely author it in that order. **It makes the shortening conditional at RUNTIME on
the aggregate being non-empty** (`if exists (select 1 from
public.analytics_retention_cohorts)`; the else branch is 039's 400-day window,
unchanged). A prune that runs before the backfill therefore cannot shorten anything.
That converts the charter's STOP condition from a rule an author must remember into a
state the function cannot reach.

## §2 · NO NEW PERSON-ADJACENT STORE — THE MAP ALREADY EXISTS

The nightly append needs each active actor's cohort day, which is exactly the fact a
90-day raw window no longer holds for an older actor. The obvious answer — a durable
`actor_id → cohort_day` table — was **rejected**, for three reasons that compound: it
exceeds the signed change manifest; it would force an edit to
`purge_analytics_for_user()` that the charter's non-goals forbid; and it would mint a
new indefinite person-adjacent store one member after WEB-1 made person-adjacent planes
default OFF.

It is not needed. **036 already mints that map at first contact.** The ingest function's
single writer (`supabase/functions/ingest-events/actorLinks.ts` —
`resolveDeviceActor` / `resolveUserActor`) claims a row in `analytics_device_links` or
`analytics_identity_links` on the first request that carries the actor, so
`min(created_at)` across those two tables **is** the actor's first-contact day. Those
tables are never pruned, and `purge_analytics_for_user()` (036) already deletes from
both. Zero new shape; account deletion untouched; the aggregate rows stay counts-only.

**RESIDUAL, stated:** `actorLinks.ts`'s documented FAIL-SOFT path can attribute a batch
to an actor with no mapping row. Such an actor has no cohort day and is excluded from the
append — fail closed, and the same population that ages out today. A1 pins that exclusion
positively, which is also what convicts M3.

## §3 · THE EXPORT RECEIPT WAS ALREADY IN THE SCHEMA — ZERO NEW SHAPE

The charter flagged a STOP: if `export_cursors` turned out to be consumed by another
writer with different semantics, overload it and raise instead. **Executed census, 22
hits repo-wide, all classified: there is exactly ONE writer** — the `analytics-export`
edge function, at `index.ts:72` (research legs) and `:112` (rollups). No SQL writer, no
script, no other function. 062 gave it RLS; the only test that touches it asserts that
posture.

And its `last_id` already means what the prune needs. 037 defines `research.snapshots`
and `research.edits` over the BASE tables' own identity columns, so
`id <= last_id('research_edits')` **is** "this row was exported". **The edge function
therefore needs no change at all**, which is the charter's own parenthetical confirmed by
execution rather than assumed.

⚠ **ONE SOUNDNESS LIMIT, AND THE PRUNE HONOURS IT.** `research.snapshots` excludes
`consent_tier = 'product'`, so for a product-tier snapshot `id <= last_id` does **not**
mean exported. Using a receipt to justify deleting a row it does not cover is the
fail-OPEN mistake, so the snapshot arm carries `consent_tier = 'research'`. Product-tier
snapshots are consequently **not pruned by this member** — a recorded residual for a
later ruling, pinned by A5 so it cannot be "tidied" into a fail-open. `edit_events` has
no such limit: 036's check constraint makes it research-only by construction and
`research.edits` is the whole table.

## §4 · WHAT MOVES, AND WHAT DELIBERATELY DOES NOT

| Store | Before | After | Why |
|---|---|---|---|
| `analytics_events` | 400d | **90d** | Funnels read weeks; everything year-scale lives in `analytics_daily_rollups` and the cohort table |
| retention cohorts | destructive MV | **durable append table** | The enabling act for the line above |
| `edit_events` + `settlement_snapshots` | never pruned | **export-then-prune, 400d ceiling, fail closed** | They are the consented research dataset; destroying them un-exported destroys what the consent was FOR |
| `ingest_rate_buckets` | 2d | 2d | Ephemeral by nature |
| `client_error_events` | 30d (081) | 30d | Already the shortest ops triage window |
| `world_sim_metrics` | indefinite (196) | **indefinite, re-affirmed** | 196's three reasons ARE this principle applied. A7 pins it structurally |
| compliance + money | account-lifetime | untouched | A legal question, not a product one |

**The 038 MV is KEPT for one release.** `report_retention()` re-targets the durable table
with `create or replace` and an **unchanged return type** (`setof
public.mv_retention_cohorts`), which is what keeps the grant surface untouched — no drop,
no re-issued `revoke`/`grant`, and `admin-actions`' dispatch byte-unchanged. The release
that finally drops the MV owes this function a new return type; that is the one thing
keeping the view alive, and it is written into the migration so it is not rediscovered.

⚠ **THE NIGHTLY JOB IS ON ITS FOURTH REDEFINITION AND CARRIES ALL THREE PRIOR BODIES.**
`analytics_nightly_maintenance` is latest-wins across 039 → 133 → 134. 134's own header
states the rule; 198 obeys it verbatim (`rollup_analytics_daily`,
`rollup_analytics_v2_daily`, `rollup_intent_atlas_daily`, all three MV refreshes) and
appends one call. Reading 039's body instead of 134's would have silently stopped two
rollup jobs, and nothing in the estate would have said so.

## §5 · SAME-SEED POSTURE

**NEUTRAL, architecturally.** No generator, no corpus, no persisted world shape, no PRNG
stream, no AI-bundle input, no `src/` file of any kind. The member is one migration, one
new test suite, the rehearsal manifest, and four pinned doc figures.

## §6 · DECLARED INTERIOR REDS

**One, and it is deliberate — DISCHARGED AT THE LANDING SLOT (§8, §11).** `tests/lint/sovereigntyLightingContract.walker.test.js` was
RED in the holding tree: the new test file moves the estate census and §417 orders the
walker edit REVERTED so the row is re-derived at the landing slot rather than carried
across the rebase. The measured delta is in §8. **No other interior red exists** — no test
at this base pinned "400 days" or the MV's existence, verified by an executed repo-wide
grep for both, so the re-point the charter anticipated turned out to be empty and is
recorded as such rather than claimed.

## §7 · THE MIGRATION-MINT BILL, ENUMERATED BY GREP

Priced by grepping every `tests/**` reader of `supabase/migrations` at this base (§403.1
completeness), never from remembered names. Eleven gates; five hard-fail.

| Gate | Verdict |
|---|---|
| `check-migration-head.mjs` | derived — no edit; prints head 198, 198 files, contiguous |
| `migrationContiguity` / `migrationAppliedHead` | derived — no edit; status stays `pending` and `applied-head.json` is NOT bumped (that belongs to the `db push` commit) |
| `migrationSearchPathPin` | 198 recreates three SECURITY DEFINER functions and defines a fourth; all four pin `public, pg_temp` with pg_temp LAST. Baseline NOT widened |
| `migrationGrantPosturePin` | vacuous — no `service_*` RPC |
| `netCurrentExtractorAnchor` | every `create or replace function` in 198 sits at column 0 |
| ⛔ `migrationRollbackDiscipline` | 198 names `analytics_device_links` AND `analytics_identity_links`, both on `MONEY_PII_TABLES` ⇒ a `-- @rollback:` note is MANDATORY. Written, and it says which half is reversible and which is not |
| ⛔ `deployRunbookFreshness` | DEPLOY.md head line 197 → 198 |
| ⛔ `architectureFreshness` + `docCounts` | `ARCHITECTURE.md`'s `migrations/** (N)` AND **both** `CURRENT_STATE.md` figures (`contiguous to 198`, and `head 198 is 77 ahead of 121`) |
| ⛔ `mutationCoverageManifest` | a NEW invariant test file owes a manifest entry |
| ⛔ `migrationRehearsalCore` + `tests/ops/migrationRehearsal` | repo head 197 → 198 plus a NEW reviewed wave; six literal pins and **five** relative `plan.waves.at(-N)` pins each shift by one |
| **`publicTableRlsCensus`** | ⭐ **NOT IN WEB-1's TEN-GATE BILL, because 197 created no table.** Every `create table public.<x>` owes an `enable row level security` somewhere in the corpus. 198 creates one, so this gate is live for the first time in the train |

⭐ **THE NEW WAVE IS THE TRAIN'S FIRST *DESTRUCTIVE* ONE.** 196 exposed no subsystem; 197
rewrote rows and could in principle be walked back row by row; 198 **deletes**. Its
`expectedObjects` therefore names the two prune/maintenance functions alongside the table,
because pinning only the table would let a rehearsal read the wave as additive. The
previous wave's `to:` was NOT extended — folding a retention migration into
`consent-person-adjacent-default` would corrupt the record an operator reads.

## §8 · CENSUS — PREDICTED, MEASURED, AND DELIBERATELY NOT COMMITTED

**`2500/365/2135/20730/5787` → `2501/366/2135/20730/5787`**, delta `+1/+1/+0/+0/+0`. The
prediction was written before the run and the walker went green at it in ONE step.

⚠⚠ **THE PARK WAS MEASURED, NOT ASSUMED.** The new suite's reasons are
`SUITE_NOT_RUNNING:describe.runIf()` plus one `TEST_UNREGISTERED:it` per inner arm —
`liveTitlesIn` returns **0** and `liveSuiteTitlesIn` returns **0**, both measured directly
against the peer `tests/security/operatorMessages.pglite.test.js`, which parks for the
same reasons. So `credited` cannot move, and **this file's ten pins are real coverage this
census cannot see.** Do not read `titles: 20730` as "WEB-2 added no tests".

⛔ **THE ROW WAS NOT IN THE BUILD COMMITS.** §417: the walker edit was reverted after measurement
so the landing act re-derives the tuple from the slot rather than carrying it. The delta
above is what crosses the rebase; the tuple is not.

⭐⭐ **RE-DERIVED AT THE LANDING SLOT `c1295938` (TE-WEB2-LANDING, 2026-08-23).** The base had
moved under this member: WEB-4, WEB-5, WEB-6, WEB-7, the four-member map stack, the
three-member producer train, UC-0 and UC-3 re-recorded the walker between `4060f690` and the
slot, so the slot reads **`2510/365/2145/20817/5802`** (read from the slot file's one live
tuple line, never computed) and the landed tuple is slot + `+1/+1/+0/+0/+0` =
**`2511/366/2145/20817/5802`**, CONVICTED BY EXECUTION at the rebased tree (33/33, mutexed)
with TWO negative controls: the slot's own tuple put back reds at `files` — *"the estate's
file count moved — re-measure, do not re-word: expected 2511 to be 2510"* — this member's +1
exactly; and `parked` alone put back at 365 reds at `parked` — *"expected 366 to be 365"* —
the park itself. The file was restored byte-identical after each. The walker row rides the
packet commit of this landing as a `TEST` row in the manifest (it could only be added once the
packet was LANDED: MF-T2H, READY at the slot, reserves the walker path — §11).

## §9 · STOP CONDITIONS

1. A SECOND writer of `export_cursors` appears, or any writer gives `last_id` semantics
   other than "high-water id exported" — the receipt reading collapses and the prune must
   be re-gated, not overloaded.
2. Any RLS or grant surface is loosened anywhere by this member's line of work. Security
   posture is owner-carved; the only grant motion here is a revoke.
3. A prune arm is widened to a row the receipt cannot cover — in particular
   `consent_tier = 'product'` snapshots (§3).
4. `mv_retention_cohorts` is dropped without re-typing `report_retention()`.
5. `analytics_nightly_maintenance` is redefined again without carrying every prior call.
6. Any retroactive purge of already-captured research rows — O3, data deletion,
   owner-gated. **Not executed here.**
7. Any `package.json` byte motion (mint trigger, §349.2).
8. `supabase db push` — the owner's step. This migration is WRITTEN, NOT DEPLOYED, and
   `applied-head.json` stays at 121.

## §10 · ⚠⚠ RAISED — A LANDED PACKET'S `requiredSymbols` TRAPPED THIS MEMBER, AND WILL TRAP THE NEXT

**Found by execution, not by reading.** `validate:packets` went RED the moment this
member updated the DEPLOY.md head line:

```
WEB-1.requiredSymbols[13].symbol is missing from docs/DEPLOY.md: 197_consent_person_adjacent_default.sql
```

WEB-1 pinned the CURRENT migration-head basename as a standing `requiredSymbols` row on a
**LANDED** packet. That name is a moving figure by construction — `deployRunbookFreshness`
exists precisely to force it to move — so the pin cannot survive the next migration
member. WEB-1 itself retired `196_world_sim_metrics.sql` from the same file, which shows
the row was understood as transient; a LANDED requiredSymbol is not. This is the banked
law biting live: **never put a re-recorded figure in `requiredSymbols`.**

⛔ **THE CHARTER'S §379.3 VACUITY CLAIM IS REFUTED BY MEASUREMENT.** The compile recorded
"no member here retires a symbol, so the row is VACUOUSLY SATISFIED". Every
migration-minting member in this train retires the prior head's basename from DEPLOY.md,
so the cross-check §379.3 mandates is LIVE for WEB-2, WEB-3 and every successor.

**WHAT THIS MEMBER DID, and deliberately did not do.** It did **not** edit WEB-1's landed
contract — mutating a landed packet's requiredSymbols is a chair act, not an executor's.
Instead it made both pins resolve against something that does not move: DEPLOY.md now
carries a short **"Read these preambles before the push"** section naming `197` (a DATA
migration whose effect no schema diff shows) and `198` (the train's first DESTRUCTIVE
one). That is genuine operator content — the runbook already singles out `195` for its
owner-gated header — and it is permanent, so neither pin depends on the head line again.

**RAISED for the chair, recommendation stated:** delete
`WEB-1.requiredSymbols[13]` (`docs/DEPLOY.md` → `197_consent_person_adjacent_default.sql`)
and forbid the moving-head-basename pin in `requiredSymbols` going forward. Until that
happens the posture section above is what keeps the gate green, and a future member that
"tidies" it away will red `validate:packets` for the whole repo with no obvious cause.

## §11 · THE LANDING SLOT

- **Rebase:** `git rebase --onto c1295938 4060f690 HEAD`, detached, the two holding commits
  carried as authored. Carry-proof at blob level FIRST (braced `${sha}:path`, with non-vacuity
  controls): three of eleven delivered paths moved at the slot — `INDEX.md`, the manifest, and
  `scripts/mutation-coverage-manifest.json` (the slot's one added row sits ~700 lines from mine;
  git auto-merged it and the `slot..tip` diff of that file is exactly my four lines); the other
  eight were the SAME blob at base and slot — `docs/DEPLOY.md`, `ARCHITECTURE.md`,
  `docs/CURRENT_STATE.md`, `scripts/ops/migrationRehearsalCore.mjs` and
  `tests/ops/migrationRehearsal.test.js` still carried WEB-1's 197 figures, so no keep-slot +
  re-apply was owed. `ls supabase/migrations` at the slot ends at 197 with no foreign `198_*`
  (197 files) — 198 is contiguous. None of the eleven paths appears in any of the five
  edge-shared bundle `.meta.json` rosters (§475 law), so no `build:edge-shared` is owed.
  `supabase/functions/analytics-export/index.ts` is the same blob at base and slot — the one
  `export_cursors` writer is unmoved. `package.json` / `package-lock.json` identical at base and
  slot: no mint trigger crossed.
- **Surgery:** manifest = the slot's bytes + this row by string surgery from the holding
  commit's own insert bytes, never re-serialized (deep-compare 163 → 164, ADDED=["WEB-2"],
  REMOVED=[], DRIFTED=[], row == authored); INDEX keep-both, this row at the "Current packet
  set" head above MF-UC3 (newest-first order); the walker written once (§8).
- **The status walk:** READY → LANDED at the re-stamp. The walk had to come FIRST: MF-T2H is
  READY at the slot and reserves `tests/lint/sovereigntyLightingContract.walker.test.js`, and
  a non-terminal WEB-2 naming the same path would have been refused as a duplicate change
  path; at LANDED nothing is reserved, so the walker `TEST` row joins the manifest in the same
  edit. `verifiedBase` → the slot sha in the header and the manifest row (scoped to this row's
  span — WEB-4's `4060f690` row at the slot untouched).
- **The migration bill at the slot:** the twelve gates re-run mutexed at the rebased tree, the
  verdicts in the lane receipt (`laneTEWEB2-receipt.md`, "THE LANDING SLOT").
- **S0 at the slot:** the two-part reading and its baseline lookup are in the lane receipt.
- **Terminal:** the full bare `npm run check:tail` fires at the LANDED tip itself; its verdict
  lines are in the lane receipt and the chair's ledger row.

