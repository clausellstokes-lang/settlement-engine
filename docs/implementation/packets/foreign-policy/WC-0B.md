# War Circulation / WC-0B — the column-class union and the release fork

- **Status:** READY
- **Train:** `refs/trains/wc-0`, **member 2 of 4**. Plan: `laneTC14-TRAIN-PLAN.md`.
- **Chair authority:** `OWNER_DECISION_QUEUE.md` **§52** and this train plan's §1 refusal-in-part
  (chair **Q1**). Ruling consumed: **CR-WC-10** (mint the SECOND counts-mover manifest; do not
  widen law M) — named because `MOVEMENT_SITES` is the law-M manifest this member's successor
  coordinates with, and **this member does not touch it.**
- **Volume:** WC — the war-circulation owner-amendment program.
- **Family preamble, cited BY SHA-256:** `docs/implementation/preambles/WC-PREAMBLE.md`
  sha256 `5241a798e3033007721c1090c69a8fd1608475aef32aae7b7663670867f05b1f` — computed over the bytes LANDED at `D0` (`a393b109`); unmoved since.
- **Branch:** `claude/composite-r4`
- **Verified base:** `claude/composite-r4` at `98c7872ebf3bb5a43091a5ff7d1b7918881593f0`
  (TC14 compiled at `fc8451c4`; lane TC17 re-based to `4f2d37d1`; `eff-1b` carried the base
  here docs-only). **This member's whole subject cluster is byte-identical across that entire
  window — all seven addresses re-executed exact in §3.**
- **Base-state capsule:** `6b822540`; HEAD is its docs-only child, executed at this lane as
  exactly one path (`BASE_STATE.json` itself) — **J-T1**, more tightly than at either earlier
  base.
- **Chain position:** member 2 of 4, on `WC-0A` landed at `511d2ceb`.

---

## 1. Reconciled authority

| Source | What it binds |
|---|---|
| `docs/implementation/preambles/WC-PREAMBLE.md` @ the sha above | §P0–§P11, and **§P2.9 in particular** — the release fork is the volume's own named "most likely to have shipped GREEN" defect |
| `docs/implementation/PACKET_STANDARD.md` | the scope budget, the **≤ 15 effective-line shared-file delta**, STOP conditions, train landings |
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | §3 WC-0 (the three-way discriminator block) · **§7.A.8 COLUMN CLASSES — ALL AT WC-0** · §2.3 the attachment table · §7.E the release-fork pin |
| `laneWV-WC-SUBSTRATE.md` | **the whole `migration.js` cluster is MEASURED-TRUE, every address exact** — re-executed in §4 |

---

## 2. Outcome and boundary

### 2.1 What lands

**The military column classes, the frozen union, and the third arm of a discriminator that is
today two-way and fails toward the wrong lane.**

`releaseArrivals` keeps demographic columns in transit for their own lane and **releases everything
else** into M4's arrival pass. `isDemographicColumn`'s own docstring says it *"FAILS CLOSED toward
M4: a column with no class, or a class this module has never heard of, is M4's."* A
`reinforcement_column` stamped and keyed exactly as §7.A.8 designs would therefore have been
**released by M4, crediting the destination settlement's population as an ordinary migration
arrival** — outside `arrival` / `arrive_home` / `shed`, invisible to WC-6's conservation walker,
**delivering lent troops into a census instead of into a block.**

⇒ **THE DISCRIMINATOR BECOMES THREE-WAY:** `isDemographicColumn` | a new `isMilitaryColumn` |
unclassed-legacy = M4's, exactly as the existing fail-closed docstring already promises. The
`:598` guard widens **in this same commit** as the vocabulary.

⭐ **THREE MEMBERS, NOT TWO.** `reinforcement_column` was missing from an earlier drafting: §1.1.2
and §1.1.5 route an outbound contribution as census → column (`dispatch`) then column → block
(`arrival`), and **no member existed for an OUTBOUND reinforcement.** Since the class is part of
the column KEY, a classless military column would have **collided with a demographic column on the
same origin/dest/tick** — the precise failure the class-in-the-key discipline exists to prevent,
reintroduced by an incomplete union.

⭐ **AND THE WHOLE VOCABULARY LANDS HERE, NOT AT WC-13.** WC-6 needs `reinforcement_column` and
(through the `return` fork's shape) `veteran_return` **seven waves** before WC-13 would have minted
them — a wave-order violation the dependency graph had no way to express.

### 2.2 What it deliberately does NOT build — the non-goals, named

⛔ No producer: **nothing stamps a military class until WC-6 mints the first one**, which is
exactly what makes this landing byte-identical · no second column ledger (§8.1 row 9: *"this volume
WIDENS the class list and adds no second column ledger"*) · no key-collision pin (that lands at
WC-6 **with the first producer**, and is re-run at WC-13 for `shed_column`) · **no WC-lane release
pass** — the second half of the both-directions pin lands with the WC-6 producer; here it is the
**pre-pinned seam with its executed red-capability proof** · no flag · no new leaf · no persisted
FIELD (⛔ CR-WC-9's class is untouched: this is a **predicate and key** widening over an existing
column record) · no `spatialUsage` row · no news kind, no UI byte.

⭐ **WC-0B IS BYTE-IDENTICAL ON EVERY SEEDED WORLD**, and the byte-identity pin is not the
member's strongest claim — the release-fork pin is. **Everything else here is byte-identical and
this is the one predicate that changes.**

---

## 3. THE REFUTED PREMISE AND THE ONE THAT HELD

### R-WC0B-1 — THE THREE-SITE ENUMERATION OMITTED THE SITE THAT MATTERED

The volume's own earlier enumeration of this widening was `":520 / :545 / :553"` — **stamp, stamp,
key** — and it says nothing about **WHO RELEASES A COLUMN.** Round 3 added the fourth site. This
member's manifest exists because of that correction, and the packet records it so no implementer
re-derives the three-site list from an older paragraph.

### ⭐ AND THE CLUSTER THAT DID NOT ROT — re-executed at `fc8451c4`, EVERY ADDRESS EXACT

```
migration.js:474  export const DEMOGRAPHIC_COLUMN_CLASSES = Object.freeze(['refugee', 'voluntary']);
migration.js:483  export function isDemographicColumn(column) {
migration.js:520  ...(DEMOGRAPHIC_COLUMN_CLASSES.indexOf(travelClass) >= 0 ? { travelClass } : {}),
migration.js:545  const stamp = DEMOGRAPHIC_COLUMN_CLASSES.indexOf(planClass) >= 0 ? { travelClass: planClass } : …
migration.js:553  const key = `${columnKey(d.originId, d.destId, now)}${planClass && stamp.travelClass ? …
migration.js:578  export function releaseArrivals(worldState, tick) {
migration.js:598  if (isDemographicColumn(col)) { next[key] = col; continue; }
```

Seven of seven exact — re-executed by THIS lane at `98c7872e`, now **thirty-five commits** after
the substrate sweep rather than nine, and still every address exact. **The only cluster in a
6,973-line volume that did not rot**, and the volume's own reason is the lesson §P0 generalizes: it names the
FUNCTION and its GUARD at two separate addresses, *"because a single number here is exactly the
hand-keyed line-address rot 5.7 forbids."* ⛔ **Navigate by symbol regardless.**

---

## 4. Verified tree contract and executed preflight receipts

### 4.1 The subject file

`src/domain/spatial/migration.js` — **237 eff** measured by eslint's own `Linter`
(`max-lines { skipBlankLines: true, skipComments: true }`). **No `scripts/.size-baseline.json`
row; not a capsule hot file.** Its layer home is POP
(`/^src\/domain\/spatial\/(?:migration|migrationRumors)\.js$/`), unchanged by this member.

### 4.2 The read-side consumers, re-executed and UNCHANGED

`isDemographicColumn`'s other consumers are `demographicsMigration.js:458`, `:505` and `:636` —
all **read-side and untouched** by this widening (verified). The full importer set of the
predicate at `fc8451c4` is `migration.js`, `demographicsMigration.js`, `migrationKernel.js`; the
member changes the predicate's **callers not at all** and its **branch set** by exactly one arm.

### 4.3 Required live symbols (existence-checked at EVERY status)

| Path | Symbol |
|---|---|
| `src/domain/spatial/migration.js` | `export const DEMOGRAPHIC_COLUMN_CLASSES` |
| `src/domain/spatial/migration.js` | `export function isDemographicColumn` |
| `src/domain/spatial/migration.js` | `export function releaseArrivals` |

⛔ **`MILITARY_COLUMN_CLASSES`, `COLUMN_CLASSES` and `isMilitaryColumn` are NOT cited** — this
packet is about to create them, and `requiredSymbols` are existence-checked at DRAFT and READY.

### 4.4 Hot files and censuses

No hot file named. Lighting census `files` **2433 → 2434 at `I2`, a NAMED interior red**, greening
at `I4` (the base tuple is `2431 / 364 / 2067 / 20149 / 5660`, read from the LIVE literal at
`sovereigntyLightingContract.walker.test.js:4339` — ⛔ never from a first-match grep, which returns
the GR-4d ancestry COMMENT at `:4038`; `WC-0A` moved `files` to 2433). Flag manifest rows
**20 → 20**. `ARGUED_ROSTER_CEILING` / `UNLAYERED_BASELINE_CEILING` untouched — **this member
creates no `src/` leaf at all**, so §P1 R-WC0-3 does not fire.

⛔ **AND THE ANCHOR CEILING BINDS THIS MEMBER'S ONE NEW FILE (ODQ §99.2).**
`negativeAssertionAnchor.walker` gives every new `tests/domain/**` file a ceiling of ZERO against a
frozen roster of 515 files / 1557 negatives, and `militaryColumnRelease.test.js` is not in it. B2 is
a negative and B4 reaches for one twice. **The walker joins this member's focused battery** — it is
invisible to a run of the acceptance file alone. ⚠ And the executor's own lesson from `I1`: a
COMMENT that spells the scanned forms in order to say the file avoids them is itself a violation.
Word the notice; never widen the scan.

---

## 5. Exact state, behaviour and lifecycle contract

### 5.1 The vocabulary

| Export | Members | Note |
|---|---|---|
| `DEMOGRAPHIC_COLUMN_CLASSES` | `refugee`, `voluntary` | **existing, untouched** |
| `MILITARY_COLUMN_CLASSES` | `reinforcement_column`, `shed_column`, `veteran_return` | **three, not two** (§3) |
| `COLUMN_CLASSES` | the frozen union of both | the totality export; **the class is part of the column KEY** (`:553` — the collision discipline) |
| `isMilitaryColumn(column)` | — | the new predicate, **shaped line for line like `isDemographicColumn`** |

### 5.2 Exact transitions — the four sites, and what each becomes

| Site | Today | After |
|---|---|---|
| `:520` `columnOf`'s conditional class spread | keyed on `DEMOGRAPHIC_COLUMN_CLASSES` | keyed on `COLUMN_CLASSES` — **admits the military members too**, and an unknown class still falls through to unclassed-legacy rather than being honoured |
| `:545` the plan stamp | same | same widening |
| `:553` the class-in-the-key | same | same widening — **the `travelClass`-in-the-key discipline is preserved verbatim** |
| `:598` the release guard | `if (isDemographicColumn(col))` | `if (isDemographicColumn(col) \|\| isMilitaryColumn(col))` |

### 5.3 Lifecycle paths (L4) — and this is a PERSISTENCE-SURFACE widening

The volume states it and this packet honours it: *"the predicate widening is a persistence-surface
widening: it owes the same fail-closed normalize arm §1.4.1 gives `blocks[]`."*

| Path | Behaviour |
|---|---|
| **create** | a column is stamped with a class only where a producer supplies one. **No WC producer exists at this member**, so no military column is ever created here |
| **read** | `isMilitaryColumn` is total over `MILITARY_COLUMN_CLASSES` and false for everything else |
| **persist** | the column record's shape is **unchanged**; only the set of admitted `travelClass` VALUES widens. ⛔ **No new field, so CR-WC-9's escalated class is not entered** |
| **regenerate** | a re-derived column re-stamps from the same plan class; the widened spread is deterministic and order-free |
| **undo / restore / migrate** | a saved column carrying an unknown class **still falls through to unclassed-legacy = M4's**, exactly as the pre-existing docstring promises. ⭐ **The fail-closed direction is preserved, which is what makes this widening safe against every save written before it** |

---

## 6. Exact TWO-path manifest — two handwritten, zero generated

| # | Action | Path | Budget |
|---:|---|---|---|
| 1 | `MODIFY` | `src/domain/spatial/migration.js` | ≤ **15 eff** (the shared-file delta cap). Estimated **8**: two frozen arrays, one predicate, three one-line widenings |
| 2 | `CREATE` | `tests/domain/militaryColumnRelease.test.js` | 1 `describe` + **5** `it` |

**Handwritten 2 of 12. New production leaves 0 of 2. Existing logic-bearing production files
modified 1 of 3. Feature flags 0 of 1. Acceptance cases 5 of 8.**

⛔ **`tests/domain/migrationWithMortality.test.js` AND `tests/domain/demographicsMigration.test.js`
ARE NOT IN THIS MANIFEST, AND THAT IS A MEASURED CLAIM, NOT AN OMISSION**: both exercise
**demographic** columns, whose stamping, keying and release are byte-for-byte unchanged by a
widening that only ADDS admitted values. ⛔ **VERIFY-AT-BUILD: run both focusedly; a red in either
is a STOP that re-opens this claim, never a test edit.**

---

## 7. Ordered coding sequence

1. `MILITARY_COLUMN_CLASSES`, then `COLUMN_CLASSES` as the frozen union, beside the existing
   demographic list.
2. `isMilitaryColumn`, shaped line for line like `isDemographicColumn` at `:483`, with the same
   fail-closed docstring discipline.
3. The three widenings at `:520` / `:545` / `:553`, **navigating by symbol**.
4. The `:598` release-guard widening **last**, so the release fork's before/after is a single
   reviewable hunk.
5. The acceptance file, then the §P3 anchor preflight.

---

## 8. Acceptance matrix — exactly five titles, ONE file, ONE `describe`

| # | Case |
|---|---|
| B1 | `MILITARY_COLUMN_CLASSES` holds its **three** members including `reinforcement_column`, `COLUMN_CLASSES` is the frozen union of both lists, and the union is totality-exported and codepoint-stable |
| B2 | ⭐ **THE RELEASE-FORK PIN, DIRECTION ONE:** a `reinforcement_column` planted on the migration ledger is **NOT released** by `releaseArrivals` — it is held in transit for the WC lane. *(The second direction — that the WC lane DOES release it — lands with the WC-6 producer; this member pins the seam.)* |
| B3 | ⭐⭐ **THE WIDENING-OMITTED MUTANT REDS B2:** with the `:598` guard restored to `isDemographicColumn(col)` alone, the planted military column **is** released into M4's arrival pass. *(The executed red proof §7.E demands — a guard that cannot be reddened cannot be proven.)* |
| B4 | the discriminator is **three-way**: an unclassed-legacy column is released (M4's, unchanged), a demographic column is held (unchanged), a military column is held (new) — and a column carrying a class **this module has never heard of** is released, because the docstring's fail-closed promise still holds |
| B5 | `columnOf`'s spread admits the military members and the class stays part of the column KEY, so a `reinforcement_column` and a `refugee` column on the same origin/dest/tick occupy **different keys** — the collision the class-in-the-key discipline exists to prevent |

⛔ ONE literal `describe`, straight-line `it` calls, string-literal titles. **No `.each`, no
`describe.runIf`, no nesting.**

⚠ **B2 IS A NEGATIVE AND OWES AN ANCHOR** (§P3). Route it through
`tests/helpers/anchoredNegatives.js`'s `expectPresentThenAbsent` **called by name on the same
line**, or carry `// anchored: …` on the line immediately above. **A new test file has ceiling
ZERO.**

---

## 9. Mutation proof — four disposable mutants

| # | Plant | Must convict |
|---|---|---|
| M1 | restore `:598` to `isDemographicColumn(col)` alone | **B3 by construction, and B2** |
| M2 | drop `reinforcement_column` from `MILITARY_COLUMN_CLASSES` | B1 **and** B2 — ⭐ the arity mutant is what proves the three-member correction is load-bearing |
| M3 | remove the class from the column key at `:553` | B5 |
| M4 | make `isMilitaryColumn` return `true` for an unknown class | B4 — the fail-closed direction |

Each planted, convicted, restored **digest-exact**. ⚠ **M1 and M2 must convict SEPARATELY**: if M2
alone reds only B1, the release pin is passing for the wrong reason and B2 is measuring the guard
rather than the vocabulary.

---

## 10. Focused verification — exact argv

```
npx vitest run tests/domain/militaryColumnRelease.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/domain/migrationWithMortality.test.js tests/domain/demographicsMigration.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx eslint src/domain/spatial/migration.js tests/domain/militaryColumnRelease.test.js ; echo TRUE_EXIT=$?
```

⛔ Bare, fresh shell, never wrapped in `gate-mutex.sh --run`, outlasted in your own turn.

**EXPECTED AT `I2`:** the acceptance file GREEN · both existing migration suites GREEN
(the §6 claim, executed) · `couplingInclusion.walker` GREEN · `negativeAssertionAnchor.walker`
GREEN · `sovereigntyLightingContract.walker` **RED on `files` (2434 vs 2431) — NAMED**, greening at
`I4`.

⛔⛔ **A RED BATTERY TRUNCATES THIS TRAIN; BANKING HAS NO DOOR** (§97.2 / §99.2). `est-1c` froze
`ORDINARY_TEST_CONTROL` EMPTY and made the sampling test the victory assertion, so ordinary debt
must be exactly zero and may not be spent. The named census red above is a walker-census red by
construction, not a banked failure.

---

## 11. Wave-specific hazards, coupling and OSR

- **COUPLING BILL: ZERO.** No new `src/` file; `migration.js` keeps its POP home and gains no
  import.
- **OSR: verify-at-build at 1998.** A widened frozen array can mint an observed shape; **a new
  finding is a STOP, never a `--write`.** ⚠ This is the member most likely of the four to move OSR,
  because it widens a persisted record's admitted value set.
- ⚠⚠ **THE BYTE-IDENTITY CLAIM IS TRUE FOR A NAMED REASON AND THE PIN MUST ASSERT THAT REASON**
  (§P2.8, the family's canonical vacuity lesson): the seeded corpus is byte-identical because **no
  producer stamps a military class until WC-6 mints one** — not because the widening is
  behaviourally neutral. It is not: the release fork's branch set genuinely changes. **B3 is what
  keeps the claim honest.**
- ⚠ **THE PIN THAT DOES *NOT* LAND HERE.** The column key-collision pin lands FIRST at WC-6 with the
  class-out-of-key mutant on a real `reinforcement_column`, and is re-run at WC-13 for
  `shed_column`. §8.1 row 9 records why the re-run is non-vacuous only *because* `reclass` is the
  first producer that ever stamps the class: **before it, the re-run passed happily over a member
  nothing minted.** B5 pins the key SHAPE here; it does not pretend to be the collision pin.

---

## 12. Completion receipt and STOP conditions

The receipt records: the seven re-executed addresses, `migration.js`'s effective-line delta against
the ≤ 15 cap (before and after), the five titles, the four mutants with convictions and
digest-exact restores, the two untouched migration suites' green, the **named** census red, and
OSR at its exact floor.

**STOP on:** the `migration.js` delta exceeding 15 eff · a red in either untouched migration suite ·
a new OSR finding · any need for a new field (⛔ CR-WC-9) · any need for a second column ledger ·
the discriminator proving not to be cleanly three-way at a real call site.
