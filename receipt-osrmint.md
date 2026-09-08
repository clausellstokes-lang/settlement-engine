# RECEIPT — lane OSRMINT · Opus 5 · 2026-09-05

## ⛔ PARTIAL — THE MINT WAS NOT EXECUTED. STOPPED ON A REFUTED PREMISE.

The brief's fence — *"If the premise does not hold, STOP and report. Do not mint to fit the
ruling."* — fired. One of the three premise legs is **refuted**, and two facts the ruling did
not have make the act materially different from the one ruled on. **Nothing was minted, nothing
was written, the dock is byte-untouched.**

Dock after the lane: `HEAD=940d161ca155ab2be76c9d15b9a8207d9c2f7c2f`, porcelain **0**, **23** cars
over `90702c3e9` — identical to the state I received.

---

## 1 · PREMISE RE-DERIVATION (the act the ruling's Fence 4 demanded)

Harness: `$SC/osrmint/measure-iscriminal.mjs`, `$SC/osrmint/measure-stress.mjs`. Nothing is
restated from a typedef; every row is read off `generateSettlementPipeline` output. Raw JSON in
`$SC/osrmint/out-corpus.json`, `out-wide.json`, `out-stress.json`.

### ⛔ LEG 1 — "the read fires on 324 of 540 generated settlements" — **REFUTED**

| grid (540 settlements each, 10 seeds × 54 configs) | fires | rate |
|---|---|---|
| default configs, **no stress** | **4 / 540** | **0.7 %** |
| `stressTypes: ['wartime']` | 280 / 540 | 51.9 % |
| `stressTypes: ['insurgency','famine']` | 450 / 540 | 83.3 % |
| the instrument's OWN corpus (4 seeds × 4 configs) | **0 / 16** | **0 %** |

The claimed 324/540 is **60 %**, which sits between the two stress-loaded rows. So the prior lane's
figure is almost certainly a real measurement of a **stress-loaded** corpus — but the brief states
it unqualified, as a property of "generated settlements". On ordinary generated worlds the read
fires **~80× less often than the ruling believed**.

Mechanism, CONFIRMED at source: the writer branch is gated on
`safetyProfile.blackMarketCapture > 10` (`economicState.js:319`), and
`blackMarketCapture = baseShadowPercent + stressShadowBonus` (`safetyProfile.js:600-619`), where
`stressShadowBonus` is **zero without stress flags** and tier-scaled. The firing rate is therefore
a property of the GRID'S STRESS LOADING, not of the code.

This is load-bearing: the ruling's first argument is *"Deleting it kills a live lens."* At 0.7 %
on ordinary worlds — and 0 % on the corpus the ratchet actually measures — that argument is far
thinner than the figure it was built on.

### ✅ LEG 2 — co-extensivity, `flagOnly: 0` / `labelOnly: 0` — **CONFIRMED**

`0 / 0` on **all four** grids measured. Structurally guaranteed: `economicState.js:349` pushes
`source` and `isCriminal: true` in **one object literal**. Every flagged row was also labelled
(4, 280, 450 respectively); no row was ever one without the other.

⭐ This CONFIRMS the ruling's *second* argument outright: re-pointing the read at the label set
adds **no life at all** on generated worlds, and would break the deliberate pin at
`economyStateProseDesk.test.js:576` (a criminal LABEL without the flag must return `null` — the
"label trap" the docstring names). The ruling was right to reject that cure.

### ✅ LEG 3 — the declared exemption — **CONFIRMED VERBATIM**

`EXPLAINED_WRITER_EXEMPTIONS` (`check-observed-shape-readers.mjs:1070`) carries
`identity: 'isCriminal on incomeSources'`, `mechanism: 'conditional-generator-branch'`,
`writer: 'src/generators/economy/economicState.js'`,
`ruling: 'ODQ 771.2 — the fifth class, granted on W-COIN-1b measurement'`.

Its observed-key list — `desc, percentage, priorityNote, source, weight` — **matches my corpus
measurement exactly**, key for key.

### ⚠ AND AN INTERNAL CONTRADICTION THE RULING DID NOT SEE

The ruling says *"The instrument already agrees"*. It does not agree for the ruling's reason. The
exemption's own recorded `why` states the read *"is **dead on generated worlds by construction**,
not by defect"*, kept as *"the catch for authored rows wearing no known name."* That is the
**opposite grounding** from "it fires on 324 of 540 generated settlements". My measurement sides
with the exemption, not with the brief's figure.

---

## 2 · TWO FACTS THE RULING DID NOT HAVE

### ⛔ FACT A — the read is **NOT pre-existing debt; this consist created it**

| commit | `isCriminal` occurrences in `economyStateProse.js` |
|---|---|
| `90702c3e9` (product base) | **0** |
| `22d9a0d4d` DESK-ECONFAITH C1 — "DS-ECO-12 lights" | **6** |
| `940d161ca` (dock HEAD) | 6 |

The ruling frames this as debt lane DEADREAD *found* and rightly refused to cure. In fact **this
consist's own C1 commit introduced it, three commits before DEADREAD ran.** Raising a ratchet
ceiling to admit a read the same consist just landed is the ratchet **working**, not failing. The
bank exists to *record one more explained writer*, not to *absorb debt the consist just minted* —
and the recorded program law is that banking a row DISARMS it.

Related, and the program's top live hazard shape: the desk fixture at
`economyStateProseDesk.test.js:433-434` **hand-writes** the very flag it grades
(`source: isCriminal ? 'Black Market Revenue' : 'Wool Trade', …, isCriminal: !!isCriminal`). The
engine does write the field, so this is not the full fixture-only-writer defect — but it is why
the new lens looks alive in test and is near-dead on ordinary generated worlds.

### ⛔ FACT B — the governed migration path **cannot execute this mint as-is**

The baseline is at `schema: 16`. `COMPANION_GATE_TARGET_SCHEMA = 16` is the **live top rung**, and
`LEAF_MIGRATION_PREDECESSOR` is a strict one-rung-per-schema chain that **ends at 16**. There is
**no schema-17 rung**. Fence 3 requires the governed migration path; that path would first need a
new `*_TARGET_SCHEMA` constant, its `LEAF_MIGRATION_PREDECESSOR` entry, its envelope law in the
sibling table, and its allowlist entry — **a code change to the governed instrument itself**, plus
a `--review-template` → completed `--review` → `--bundle` ledger cycle.

That is decisively "a different act" under Fence 1, and much larger than "add a row, bump a pin".

---

## 3 · MEASURED STATE OF THE CONSIST (all captured in-shell as `CMD; E=$?`)

| gate | exit | result |
|---|---|---|
| `node scripts/check-observed-shape-readers.mjs --report` | **1** | 1994 findings; the one NEW row is `isCriminal on incomeSources` in `economyStateProse.js` (ceiling 0) |
| `npx vitest run tests/lint/observedShapeReaders.walker.test.js` | **1** | 2 failed / 42 passed — exactly the two briefed arms |
| `npx vitest run tests/lint/` | **1** | 3 failed / 2128 passed; **only `clampPrimitiveBaseline`** beyond the two OSR arms — nothing else is this lane's |
| three desk suites | **0** | **136 passed** (31 + 65 + 40) — unchanged |
| `npm run typecheck:domain:strict` | **0** | `✓ no strict-type regressions (1121 errors, ceiling 1121)` |

Failure text, read in the correct vitest direction (Received then Expected):
- A1/A7 — `expected 65 to be 64`; diff `- 64 / + 65` ⇒ **live bank = 65**, pin = 64. The mint is a
  mechanically exact fit (`walker.test.js:1036`).
- SHRINK-ONLY — `expected { violations: 1, stale: +0 } to deeply equal { violations: +0, stale: +0 }`.

Precedent exists: the comment above the pin records a prior governed raise, **62 → 64 at the
schema-12 mint (ODQ §819)**. So the *class* of act is legitimate; its premise here is not.

---

## 4 · WHAT I DID NOT DO

No mint. No `--write`, no `--migrate`, no `--review-template`, no baseline hand-edit, no deletion
of the read, no commit, no ref write, no rebase, no push. Nothing in the dock was modified.

⚠ One self-correction worth recording: my first introduction-check used
`git show <sha>:<path> | grep`, whose empty output is **ambiguous between "read absent" and "file
absent"**. It printed a false "FILE ABSENT at every commit including HEAD" — impossible on its
face, which is how it was caught. Fact A above is from the corrected `git cat-file -e` form. A
fallback branch must never print a finding.

---

## 5 · WHAT THE CHAIR NOW HAS TO RULE

The ruling's **direction** (keep the read) survives and is arguably better grounded than before —
Leg 2 confirms the label-set cure adds nothing. What does **not** survive is the premise the
ceiling raise was justified on, plus two facts that change the act's character:

1. Is a governed ceiling raise still warranted for a read **this consist itself introduced**, or
   should C1's new lens be reworked so it does not land debt the ratchet must then be raised to
   admit?
2. Fence 1 says one row, one increment. Executing via Fence 3 now requires **minting schema 17 in
   the instrument**. Does that stay inside the fence, or is it the "different act" the fence names?
3. The ruling's stated reason and the exemption's recorded reason **contradict each other**. Which
   one goes into the row, since the row's whole purpose is to let a later reader re-derive the
   explanation rather than trust it?

---

## RETROVALIDATION ROW

⟦**OPUS-AUTHORED — Fable retrovalidation OWED**⟧ · lane OSRMINT · 2026-09-05 · Seat: Opus 5.
Measurement CONFIRMED by execution (harnesses + gate exits captured in-shell, quoted above).
The refutation of Leg 1, Fact A and Fact B are **CONFIRMED** (executed evidence). The inference
that the prior lane's 324/540 came from a stress-loaded grid is **PLAUSIBLE** — the 60 % figure
sits between two measured stress rows, but that lane's actual grid was not recovered.
No product bytes changed; nothing to retro-validate but the reasoning and the refusal.
