# WEBSITE / WEB-1 — person-adjacent consent defaults OFF, and the predicate that spares a real choice

- **Status:** LANDED
- **Landed at:** the `web-a` train's first car, on the lane tip held for the chair's CAS
- **Verified base:** `claude/composite-r4` at `84e06412f6fdca91020197f2a332ba7f98642f64`
- **Landing note:** the verified base is the landing slot (MF-T2H's tip). The member was
  authored at `eb6124a6f3527d6aebd3119ee3ebebfc42902dd6` and rebased onto the slot; twelve landings crossed,
  three of this member's files had moved under it (the census walker, `INDEX.md`, the
  manifest), and every figure was re-derived at the slot, none carried.
- **Train:** `web-a`, family **WEBSITE**, member **1** — the family's FIRST member, so this
  packet is self-contained: no `preambles/` file exists for it yet and none is assumed.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§359.6** (the ruling) · **§402** (the charter
  ruling: C1 signed, J2 ratified) · **§406** (the amended migration predicate) · **§408**
  (the authority to mint this packet).
- **censusAuthorization:** §359.6.
- **Compile of record:** `draft-WEBSITE-PLAN.md` §1 (member) and §13 (standing laws).

---

## §1 · THE RULING, AND THE HALF OF IT THAT NEEDS NO CODE

§359.6: anonymous simulation aggregates are ON **by construction**; anything
person-adjacent is OFF **by default**. Those are two different mechanisms and only the
second one is a flag.

The anonymous half was already structural at the base and stays untouched:
`world_sim_metrics` (196) is PII-free BY SCHEMA — no actor column, no session column, the
columns are simply not there — and its rows are produced by the operator-side soak
harness, not by clients. Nothing about it is consent-gated because no person is in the
data. This member **verifies** that rather than modifying it (A7), so the
"on-by-construction" half is an executed receipt in the record instead of an assumption.

The person-adjacent half is the work. `research` captures structural fingerprints keyed
to a device, so it joins `ai_prose` and `market` at OFF. `essential` is unchanged and
stays ON unless DNT — it is the product's own operation, not a person-adjacent capture
(chair C1). Consent model v2 → v3.

## §2 · THE FLIP DISCIPLINE, RUN BACKWARDS

⭐⭐ **`CONSENT_KEY` IS NOT BUMPED.** That was v2's lesson and it binds v3 identically in
the other direction: bumping the storage key discards every stored record and silently
re-decides for users who had explicitly chosen. The meaning changes under the SAME key,
and `updatedAt > 0` still honours a recorded choice VERBATIM — so a v2-era explicit
opt-**IN** survives the flip exactly as a v2-era opt-OUT survived the last one (A2).

⚠ **A STALE IN-FILE CLAIM WAS CORRECTED RATHER THAN INHERITED.** `consent.js`'s header
asserted that PrivacySettings was the SOLE `setConsent` caller. That was true when
written and false at this base: `consentSync.applyServerOptOut` arrived after it. The
invariant that actually matters was never "one caller" — it is "no caller writes a
record the user did not cause", which both callers satisfy, and the header now says
that instead. The same rot was then found and fixed in `privacySettings.test.jsx`'s own
header, which still described the v2 default after its bodies were re-pointed.

## §3 · THE SERVER PREDICATE — A CONJUNCTION, AND WHY ONE HALF IS NOT ENOUGH

Migration 197 is the **first in the train to UPDATE existing `telemetry_consent` rows**.
124 moved the column default and deliberately rewrote nothing, because the client could
resolve the effective tier from `updatedAt`. v3 cannot: the flip is toward LESS capture,
so a row left reading `research: true` keeps the server clamp open for someone who never
chose it. Updating rows demands a provenance test, and the obvious one is wrong.

⛔ **"NO `consent_change_records` ROWS" IS WRONG ON ITS OWN.** 194's trigger inserts a
record only per **CHANGED** key (`194:439`, reinforced by the table's own
`check (prior_value is distinct from new_value)`), while the `v` stamp lands **wholesale**
with the row (`194:513-516`). So a user who opens Privacy & data and **saves without
moving a toggle** gets `v` stamped and **ZERO** change records. A change-records-only
predicate flips that user and silently overturns a deliberate review.

⛔ **AND THE REVERSE GAP IS REAL.** The trigger defaults its version to 1 when `v` is
absent (`194:430`), so a non-mirror write leaves change records on an **unstamped** row.
A `v`-only predicate flips that one.

Neither signal subsumes the other, so a row is touched only when **both** are absent:

```sql
where (p.telemetry_consent ->> 'v') is null
  and coalesce((p.telemetry_consent ->> 'research')::boolean, false) is true
  and not exists (select 1 from public.consent_change_records c where c.user_id = p.id)
```

**THE UNDER-FLIP GUARD (the conjunction's enabling receipt).** A conjunction is only safe
if nothing stamps `v` automatically. Enumerated by grep at this base across `src/`,
`tests/`, `supabase/`, `scripts/`, `api/`: `set_my_telemetry_consent` has exactly ONE
client caller (`consentSync.js:102`), whose only `src/` caller is
`PrivacySettings.jsx:123` — a toggle handler. The sign-in path (`authSlice.js:381` →
`reconcileTelemetryConsent`) SELECTs and then narrows the LOCAL record; it never calls
the RPC. `ingest-events` only SELECTs. **No automatic path stamps `v`, so the under-flip
set is empty** — and stays empty only while that holds. A future boot-time mirror write
would silently widen it, which is why the guard is written down rather than re-derived.

**The residual, stated plainly:** rows with neither signal flip OFF (the intent);
`v`-stamped reviewers keep their state (the cure); rows with change records keep theirs;
the under-flip set is empty (above).

## §4 · REVERSIBILITY IS HONEST, NOT SCRIPTED

The column-default half reverses in one statement (restore 124's default) and the
migration's own `-- @rollback:` annotation spells it out. **The DATA half is deliberately
not scripted**: re-flipping would re-opt-in a population on a default they never chose —
the v2 lesson run backwards, and a worse harm than the drift it would undo. The affected
rows stay individually identifiable (a `consent_change_records` row, `research`
true→false, source `'system'`, inside this migration's window), so a targeted reversal
remains possible on owner direction.

⭐ **197 GETS ITS OWN REHEARSAL WAVE, AND NOT THE PREVIOUS ONE.** The wave manifest ended
at 196; extending that wave's `to:` would have folded a consent migration into
`simulation-metrics-storage` and corrupted the record an operator actually reads. The new
wave `consent-person-adjacent-default` is the train's **first DATA wave** — it creates
nothing and defines nothing, so its `expectedObjects` is a single already-existing table
and the thing to review is the predicate, not the DDL. The wave declares `forward-only`
(every wave must) while the migration itself classifies **`documented-manual-reversal`**
from its own annotation; that distinction is pinned, because wave-policy classification
would tell an operator the whole wave is reversible when its data half is not.

## §5 · SAME-SEED POSTURE

**NEUTRAL, architecturally.** No generator, no corpus, no persisted world shape, no PRNG
stream, no AI-bundle input. The member changes a default, one data migration, docs, and
tests. **`PrivacySettings.jsx` is byte-unchanged** — it renders whatever `getConsent()`
returns, so there is no user-facing surface change; only the default moved.

## §6 · DECLARED INTERIOR REDS

The v2 defaults tests pinned `research` ON and redded mid-member: 5 arms in
`tests/lib/consent.test.js`, 4 in `tests/ui/privacySettings.test.jsx`. Every one is a
**declared re-point with its cause stated in-file** (§359.6), never a silent re-record. A
rename is title-count-neutral, so the census evidence layer moves by exactly the ONE new
arm — see §8.

## §7 · THE MIGRATION-MINT BILL WAS TEN GATES

Enumerated by walking every `tests/**` reader of `supabase/migrations`, then every reader
of the DOCS those readers pin. Four hard-fail: `deployRunbookFreshness` (the DEPLOY.md
head line), `architectureFreshness` + `docCounts` (`ARCHITECTURE.md`'s
`migrations/** (N)` and **both** `CURRENT_STATE.md` figures — the "contiguous to" line
reads like dated prose and is a pinned figure), `migrationRollbackDiscipline` (197 names
both `profiles` and `consent_change_records`, so a `-- @rollback:` note is mandatory —
the regex reads the whole source, comments included), and
`scripts/ops/migrationRehearsalCore.mjs`. A new invariant TEST file separately owes a
`mutation-coverage-manifest.json` entry.

⛔ **THE TENTH BIT ONLY AT THE TERMINAL.** `tests/ops/migrationRehearsal.test.js` throws
in `beforeAll` when the wave manifest ends below the repo head, collecting ZERO tests —
which `test:ratchet`'s SCOPE SENTINEL reports at stage 15 of 17. **A
`tests/lint tests/build tests/docs` sweep cannot see it.** The sweep must include
`tests/ops`.

## §8 · CENSUS — RE-RECORDED, AND WHAT IT CANNOT SEE

`2,499/364/2,135/20,729/5,787` → `2,500/365/2,135/20,730/5,787` at the landing slot, the
after-tuple convicted by the arm's own equality and the slot tuple read back from its failure
message (`expected 2500 to be 2499`) as the control. The DELTA `+1/+1/+0/+1/+0` is what crossed
the rebase, never the tuple: the authored after-figure `2,498/365/2,133/20,720/5,785` sat on a
base that H8B (+4 titles) and MF-T2H (+2 files/+2 credited/+6 titles/+2 suite titles) had
since moved, and carrying it would have reverted both landed re-records silently.

⚠⚠ **THE NEW pglite SUITE PARKS**, on `SUITE_NOT_RUNNING:describe.runIf()` — measured
directly, and byte-identical to why `operatorMessages.pglite.test.js` parks, as every
runIf-gated pglite suite in the estate does. `credited` therefore does not move, and
**this file's twelve pins are real coverage the census cannot see** (`liveTitlesIn`
returns 0, measured). The visible `+1 title` is the single jsdom arm in
`consent.test.js`. A later lane attributing that delta by arithmetic would mis-attribute
it, which is why the cause block in the walker says so in full.

## §9 · STOP CONDITIONS

1. A second writer of consent **defaults** appears anywhere — a narrowing caller is not
   one, but a boot/auto path that writes a default is (§406's guard reopens).
2. Any automatic or boot-time path calls `set_my_telemetry_consent`, which would stamp
   `v` without a user action and silently widen the under-flip set.
3. `CONSENT_KEY` is bumped, or `EVENTS_REV` moves.
4. Any already-captured research-plane row is purged — that is O3, data deletion, and
   owner-gated. **Not executed here.** Forward capture stops at the flip regardless.
5. Any `package.json` byte motion (mint trigger, §349.2).
6. A PrivacySettings toggle **label** is reworded — copy is the owner's.
7. The wave manifest is extended by moving an existing wave's `to:` instead of adding a
   reviewed wave.
