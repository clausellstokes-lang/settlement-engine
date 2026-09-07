# RECEIPT — lane TUNEREG-2 (Opus 5, Fable-unvalidated)

## PARTIAL

**The blocker is cleared; the landing is not complete, and the remaining step is the chair's.**

`refreezeRefusals()` now returns `ok=true, refusal=null` on the clean committed tree — proved by
executing the same function that produced the `REFUSED [POPULATION_GREW]` in the brief, not by
reasoning about it. The tuning-register walker went from **3 failed / 72 passed** to
**1 failed / 74 passed**.

The one remaining red is **arm 396, `the measured tree matches the committed inventory exactly`**,
and it is **structural, not a defect**: registering a scalar makes it a P1 table, and P1 has
totality both ways with no ceiling, so three new tables are "measured, not in the inventory"
until the inventory is refrozen. **A lane cannot clear it** — the refreeze is the chair's act and
this lane took no `*_REFREEZE` env var, no `--update/--write/--genesis/--rebank`, and wrote
nothing to `.tuning-inventory.json` (its last commit is still `269af950f`).

This is the sibling lane's exact shape one commit back: `536d2e1dc` landed six desk scalars and
said so in its own subject — *"the walker's own totality proves the refreeze was already owed"* —
and the chair's `269af950f` refroze immediately after. **A fully green walker at a lane's own
commit is not reachable by this route.**

Commit: **`2c6c8fda8`** — 19 cars over product `90702c3e9`, porcelain 0.

---

## WHAT WAS DONE

| # | Act | Bytes |
|---|-----|-------|
| 1 | `homes[]` + DRAFT rows for `economyStateProse.js#SOLE_EARNER_FROM`, `#LEADER_FROM` | register only, 0 `src/` |
| 2 | Named the bare `0.05` as `DEFICIT_FRACTION_FROM`, `homes[]` + DRAFT row | 1 `src/` file, +16/−2 |

Register diff is **append-only apart from two note strings** (`JSON.stringify(obj, null, 1) + '\n'`
round-trips the file byte-identically, so there is zero formatting churn).

### The figures, re-derived rather than trusted

The brief said not to trust its numbers. Re-derived with `countUnregisteredNamed` /
`countBareDecimals` — **both refusal lines reproduced exactly**:

```
BEFORE  economyStateProse.js  P2 measured=4 banked=2  sites=[HIGH_RUNG_FROM,LOW_RUNG_TO,SOLE_EARNER_FROM,LEADER_FROM]
        generalStateProse.js  P3 measured=1 banked=0  -> 0.05 at line 525 (brief said ~516)
AFTER   economyStateProse.js  P2 measured=2 banked=2
        generalStateProse.js  P3 measured=0 banked=0
        ALL growth vs banked: (none, estate-wide)
```

The two **new** constants are `SOLE_EARNER_FROM` and `LEADER_FROM`, confirmed by diffing the named
constants against the product base `90702c3e9` — `HIGH_RUNG_FROM`/`LOW_RUNG_TO` predate the consist.

### Ceilings: neither raised, both landed exactly on

`UNREGISTERED_NAMED_CEILING 535 -> 535`, `BARE_DECIMAL_CEILING 6985 -> 6985`. Nothing else moved.

---

## THE CHOICE THE BRIEF LEFT OPEN — and why measurement closed it

The brief allowed either naming the decimal **or** a `DECLARED_GROWTH` row. **The DECLARED_GROWTH
door is shut, and not as a matter of taste:**

`DECLARED_GROWTH_CEILING` is **2** and `register.declaredGrowth` already holds exactly **2** rows
(one `unregisteredNamed`, one `bareDecimals`, both citing T13 Car P′). A third row would **raise a
ceiling** — forbidden by arm 502 and by the brief, and the ceiling's own comment records that
raising one is the *chair's* act, ruled at §883.8. A `DECLARED_GROWTH` row would also have left the
dials unregistered, i.e. attributed the debt instead of curing it.

So: **registration, not attribution.** Both files return to their banked figures with no ceiling touched.

---

## CHANGE NO VALUE — proved, not asserted

Arm 396 is a **negative control** for this claim, and it is the reason the one red is useful. It
compares digests, keys, idiom, leaves **and** dependents both ways across the whole estate. Its
output names the three new ids and **nothing else** — no moved digest, no moved leaf, no moved
dependent anywhere. Had naming the `0.05` altered any registered span, or had any value shifted,
this arm would have said so in the same breath.

Every row carries **PROPOSED = the value already shipping** (50, 20, 0.05) with its evidence.
`status: draft`, `signedAt: null`, `signatureVersion` still 0.

---

## ⛔ THE DIAL THE OWNER SHOULD LOOK AT HARDEST

**`economyStateProse.js#SOLE_EARNER_FROM = 50`.** Not because the number is wrong — that is the
owner's to say — but because its boundary behaviour contradicts the sentence it prints. Driven
**live** through `incomeMixPoolKey` at this commit:

```
2 even sources @ 50.0% each -> "INCOME MIX: one source carries the town"
3 even sources @ 33.3% each -> "INCOME MIX: two or three sources between them"
4 even sources @ 25.0% each -> "INCOME MIX: two or three sources between them"
5 even sources @ 20.0% each -> "INCOME MIX: two or three sources between them"
6 even sources @ 16.7% each -> "INCOME MIX: a broad spread, no leader"
```

- **A perfectly even two-way split prints the monopoly sentence.** The cut is `>=` at 50, and the
  pool's own C1 variant says the leader is *"well past half"*. 50.0 is exactly half.
- **Four and five even sources both print "two or three sources between them."**
- **"A broad spread, no leader" cannot fire until six even sources.**

The cause is one shape: the cut reads the **leader alone** and never the roster's **length**, while
the pool's words promise a count. This lane moved nothing and proposes nothing; it is recorded on
both rows so the sitting reads it rather than re-deriving it.

**Second-hardest — `generalStateProse.js#DEFICIT_FRACTION_FROM = 0.05`: signing it signs half a
value.** It mirrors the producer's own inline `gap / need >= 0.05` in `generateSettlementReason`
(`src/generators/narrativeGenerator.js`), which persists nothing. Two literals in two trees, and
only one now has a register row. The desk test pins the *producer's* literal through `mustExtract`,
so they cannot drift silently — but an honest signature covers **both** sites, or the producer's
literal earns a name and a row of its own first.

---

## JUDGMENT (vetoable) — say "veto" to flip either

1. **Unit `share` for the two economy cuts, which are on a 0..100 percent scale.** `share` appears
   in no other register row, but the `cap__share` **role** groups values of 0.05 and 0.5 — so its
   only precedent is 0..1. The fourteen-word vocabulary is **closed but nowhere defined** and has no
   word separating the scales: `fraction01` is wrong, and `score100` names the scale by calling a
   share a score. I chose the semantically true word and **recorded the collision on the row**
   rather than resolving it, because splitting or defining a finite vocabulary is an owner act.
   *Scale evidence:* `normalizeIncomeSources` documents `percentage = 0..100`, the economy
   generators write whole percents (65, 45, 35, 30, 28, 25, 22, 20, 18), and `journalPages.js`
   renders the field with a literal `%`.
2. **Registered the two new dials only, not all four in the file.** This returns the file to its
   banked figure exactly, matching the sibling lane's shape. Registering `HIGH_RUNG_FROM` /
   `LOW_RUNG_TO` too would be a *tightening* (P2 → 0) that reds the unbanked-win arm 485 — a
   different, deliberate car, not this blocker's cure.

**A finding for the chair, not a lane's to fix:** the unit vocabulary is closed by arm 540 but has
**no glossary anywhere in the repo**. Its meaning today is inferable only from usage, and one
lane's reasonable reading is enough to give one word two scales — which is precisely
FINITE-SEMANTICS' own failure mode (§711.6).

---

## GAMING REFUSED

The sibling lane named three shapes it refused; I hold that line and add none. Considered and
refused here:

- **A `DECLARED_GROWTH` row** — would raise `DECLARED_GROWTH_CEILING` and attribute the debt rather
  than cure it.
- **Exporting the three dials** to make them look table-like — the roster regex leaves `export`
  optional, so a register row is never a reason to widen a module's surface.
- **Changing `>= 0.05` to a form P3 does not count** (an integer scale, a regex) — the instrument's
  cannot-catch list is documented precisely so nobody mines it; that is buying silence.
- **Registering all four economy dials to overshoot the ratchet** — a real win, but it belongs to a
  deliberate tightening act, not to a blocker cure smuggling scope.

---

## RECEIPTS — every exit captured in-shell (`CMD > file; E=$?`), none read from a task notification

| Gate | Exit | Result |
|---|---|---|
| walker, **baseline before any edit** | **1** | 3 failed / 72 passed — the exact three arms the brief named |
| `refreezeRefusals()` **before** | — | `REFUSED [POPULATION_GREW]` reproduced |
| `refreezeRefusals()` **after, clean tree** | — | **`ok=true refusal=null`** |
| `npx vitest run tests/lint/tuningRegister.walker.test.js` | **1** | **74 passed / 1 failed** — only arm 396 |
| `npx vitest run tests/lint/` | **1** | **2125 passed / 6 failed** |
| desk suites (general + defense + economy) | **0** | **136 passed** (31 + 65 + 40) |
| `npm run typecheck:domain:strict` (the **real** script) | **0** | `1121 errors, ceiling 1121` — unchanged |
| `npx eslint` on the changed `src/` file | **0** | clean |

### `tests/lint/` failing-arm list (reported even though non-empty)

| Arm | Owner |
|---|---|
| `clampPrimitiveBaseline` — baseline matches local clamp/clamp01 | chair (expected) |
| `observedShapeReaders` — A1/A7 schema-7 filters | chair (expected) |
| `observedShapeReaders` — SHRINK-ONLY ceiling | chair (expected) |
| `proseNumerics` — path+line+category+snippet debt | chair (expected) |
| `proseNumerics` — baseline has exact unique identities | chair (expected) |
| `tuningRegister.walker` — **arm 396**, measured tree vs inventory | **this lane's, cleared by the chair's refreeze** |

**The five expected reds are pre-existing — CONFIRMED by executing them at the base commit, not
inferred from absence.** A temp worktree was cut at `21091374c` (the pre-lane HEAD) with
`node_modules` **symlinked, never materialised**, and the three files re-run there:

```
BASE_4_EXIT=1     Tests  5 failed | 70 passed (75)
   clampPrimitiveBaseline · observedShapeReaders x2 · proseNumerics x2   ← identical five
```

The worktree was then removed and the dock re-verified: HEAD `2c6c8fda8`, porcelain 0, **435**
top-level symlinks in `node_modules`, `vitest --version` resolves. Three corroborating checks agree:
neither changed file appears anywhere in those arms' output; `.prose-numerics-baseline.json` carries
**zero** `stateProse` rows and its debt stayed at 225 (all drift is line numbers in
`src/components/new/tabs/*.jsx`); and the only lint baseline naming `stateProse` is
`.domain-any-baseline.json`, whose real script passed at ceiling.

### Shared-tree hygiene

Staged by explicit file list (never `-A`/`-u`/`.`), both hunks read and confirmed mine. Post-commit:
porcelain **0**, baseline diff shows **no vanished untracked file**, and `git hash-object` confirms
the committed blobs are **byte-identical** to the bytes the gates ran on — so `lint-staged`'s
`eslint --fix` rewrote nothing and the green stamp genuinely covers the committed bytes. No rebase,
no push, no ref writes, no `git checkout --`, no stash. The commit was **amended once** (own
just-made commit, HEAD confirmed mine, unpushed) to carry the executed boundary finding; the walker
was re-run after that edit before amending, because the edit voided the prior green.

---

## ⚠ FOR THE CHAIR — THE SEAL REF MOVED, AND NOT BY THIS LANE

`refs/preserve/train-desk-integrated-2026-09-04` **no longer points at the 18-car state.** It now
points at **`0e57f5b4c`** — this lane's **superseded pre-amend commit**.

I wrote no refs. The evidence that something else did: the ref file's mtime is `Sep 5 00:59`, which
is the exact minute of my first commit (`0e57f5b4c`, `00:59:06`), and `.husky/` contains only
`pre-commit` and `pre-push` — **no post-commit hook**. The mechanism is therefore outside the repo
(harness auto-preserve on commit). It advanced on the commit and did **not** follow the amend.

**Nothing is lost.** `21091374c` remains an ancestor of both the seal's target and current HEAD.

**But two things are now true that the chair should decide about:**

1. The seal's **name** says "train-desk-integrated" while its **target** is a lane commit — the
   18-car integrated state it was cut to mark is no longer what it points *at*.
2. **Current HEAD `2c6c8fda8` is covered by no preserve ref at all.** `git for-each-ref
   refs/preserve --contains 2c6c8fda8` is empty. The real tip is unsealed.

I did not re-point it: the brief forbids ref writes, and a seal is the chair's instrument. **Re-seal
at `2c6c8fda8` before relying on the old name.**

**Durable hazard worth a memory row (reported to the chair, not written by this lane):** *committing
in a dock auto-advances that dock's `refs/preserve/*` seal to the new commit, and an **amend** then
strands the seal on the superseded commit while the true tip goes unsealed.* A lane that amends —
which is otherwise correct practice on an unpushed own commit — silently un-seals its own dock.

---

## DEFERRED — documented, not a bug to re-find

- **`HIGH_RUNG_FROM` / `LOW_RUNG_TO`** (`economyStateProse.js`) are equally reader-facing dials with
  vetoable-JUDGMENT docblocks and are **owed a register row**. Not taken here: they sit at the
  banked figure, so registering them is a tightening that reds arm 485 (unbanked win) — a separate
  deliberate car. Recorded in the `homes[]` note so it cannot be lost.
- **The producer's own `0.05`** in `narrativeGenerator.js` has no register row. Taking it means
  touching `src/generators`, which *reduces* that file's banked P3 and reds arm 453 — again a
  tightening act, and it changes a producer, not a desk.
- **The unit vocabulary has no glossary.** Chair/owner call, above.

---

## RETROVALIDATION ROW

*What a Fable pass must re-measure to convict this lane. Everything below is a claim this seat made;
none of it should be inherited on trust.*

| # | Claim | How to refute it |
|---|---|---|
| 1 | No tuning value moved. | Re-run the walker. Arm 396 must name **exactly** the three new ids and **no** `spanDigest moved` / `leaves moved` / `keys` line. Any fourth line convicts. |
| 2 | The refreeze door is open. | `refreezeRefusals({previous, measured, register})` on a clean tree ⇒ `ok=true`. If it refuses, this lane's cure is incomplete. |
| 3 | Both ceilings landed *on*, not *over*. | `live.totals.unregisteredNamed === 535` and `bareDecimals === 6985`. A single unit over convicts. |
| 4 | `share` is the right unit word for a 0..100 dial. | **Weakest claim in this receipt.** Its only precedent (`cap__share`) is 0..1 and the vocabulary is undefined. If the sitting rules `share` = 0..1, both economy rows need re-typing — the value is unaffected either way. |
| 5 | The 50/50 → "one source carries the town" finding. | Re-drive `incomeMixPoolKey([{percentage:50},{percentage:50}])`. If it does not return the monopoly string, this seat mis-reported the sharpest item in the receipt. |
| 6 | The 5 other `tests/lint/` reds predate this lane. | **Settled by execution, not by absence.** A temp worktree was cut at the pre-lane commit `21091374c` (node_modules symlinked, never materialised) and the three files re-run there: **exit 1, 5 failed / 70 passed — the same five arm names, exactly.** Worktree removed; dock verified intact afterwards (HEAD `2c6c8fda8`, porcelain 0, **435** top-level symlinks, vitest resolves). |
| 7 | Arm 396 cannot be cleared by a lane. | Read `discoverTables`' scalar-roster branch plus P1's stated totality. If a route exists that registers a dial *without* minting a table, this lane missed it and the chair's refreeze was avoidable. |

**Epistemic labels:** rows 1, 2, 3, 5, 6 are **CONFIRMED** (executed this turn, output quoted above).
Row 4 is a **JUDGMENT**, not a fact — and the weakest thing here.
Row 7 is **CONFIRMED** for the routes read, **PLAUSIBLE** as an exhaustive claim.
