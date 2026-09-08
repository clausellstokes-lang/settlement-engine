# SKEPTIC PASS — §911 / CAP-HORIZON-909
**Seat: Opus 5 — Fable-unvalidated · read-only on every tree · lens: THE CHAIR'S FOUR PROPOSED RULINGS AND WHAT THE ROW MUST CARRY**

Dock `laneB6` porcelain **0 before, 0 after**; HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c` unmoved.
Every figure below came from a command executed in this pass, importing the dock's own
`scripts/soak/evaluate.mjs`, `scripts/soak/register.mjs` and `scripts/soak/tripwires.mjs` read-only,
and re-parsing the three artifact receipts, §907's 300-year receipt and the three §909 receipts.

---

## PART 1 — THE FOUR PROPOSED RULINGS

### RULING 1 — "no window re-cut, no tuning; the reading is a seed-and-horizon fact" → **SOUND, CHAIR-DECIDABLE, one correction to the ground**

Chair-decidable. §909 ruling (2) already holds "no window re-cut, no tuning" under the owner's
01:45 grant of the three §907 rows, and this ruling moves nothing: it is the direction that needs
no signature. THE PROMISE is untouched (no dial moved), STATE NEVER FATE is untouched (zero
product bytes, dock porcelain 0), and the 08-06 sequencing law is not engaged.

**The correction is to the mechanism, not the permission** (the standing law: charter the
permission, MEASURE the mechanism). The two halves of "seed-and-horizon" carry very different
evidence:

- the **seed** half is measured at n = 2 and is strong. At the same year 300, same 4 settlements,
  same lit overlay, `loadRatio01` reads **0.4787** (seed `…-300y-4s-seed1`) against **0.6443**
  (seed `…-600y-4s-seed1`). I add a control the receipt does not: the two worlds' START realm
  populations are **21,844** and **21,124** — 3.3 % apart. So the 0.166 divergence is a
  *trajectory* fact, not an initial-condition fact. That strengthens C3.
- the **horizon** half rests on **one seed** (the lane's own E2). The row must say so in the same
  sentence, or "the fixture settles" reads as a fixture-family finding when it is one world's.

### RULING 2 — "the freeze's evidence must carry MORE THAN ONE SEED (a recommendation to the sitting)" → **SOUND AS A RECOMMENDATION; ⛔ ITS CITED HOME IS WRONG**

Chair-decidable *because it is a recommendation and not an act*. A multi-seed cell would change
`cellKeyOf` / the register's cell identity — persistence shape, which is owner-gated — so routing
it as a recommendation rather than a decision is exactly right.

⛔ **But the receipt's C3 cites "§2.5/CAP-7" as the home, and neither is.** Measured in
`docs/DESIGN_HORIZON.md` at `29a4ff20d`:
- §2.5 (header at line 205) is **the car plan**; its C4′ is the lighting car.
- **CAP-7** is a **§12 owner row** (header at 1042; the row at 1051) and it asks a different
  question entirely: if the cured kernel fails the **30-year envelope** on the fixture, (a) accept
  a calmer sub-century world, (b) tune `BIRTH_EASE`/`DEATH_EASE`, or (c) widen the fixture. **The
  seed grid is none of the three.**
- Searching the whole 1,469-line design for a seed-count decision returns nothing: `seedIndices`
  lives only in `scripts/audit/realm-scale-certification.mjs`.

**So the seed grid is a NEW owner row, not a re-opening of CAP-7**, and the §911 row should say
that rather than hang it on a row that does not contain it. Filing it under CAP-7 would bury it in
a row whose recommendation is already written and points elsewhere.

Two supporting facts the recommendation should carry, both measured here:
- "Both research profiles carry `seedIndices: [1]`" — **CONFIRMED**: `research-lit` (`:97`, cell
  300 y × 12 s at `:101`) and `research-lit-4s` (`:107`, cell 300 y × 4 s at `:111`). The
  `seedIndices: [1, 2]` cell at `:75` is the **release** profile, not a research one, so the
  estate already knows how to spell a two-seed cell — the design change is small.
- the owner-hours price of the recommendation, at the lane's own new figures: a second 600-year
  4-settlement seed ≈ **1 h 15 m** (measured), a second 300 y × 12 s seed ≈ **1.9–2.4 h**.

### RULING 3 — "which plateau definition the freeze reads (one century vs three) is the tuning sitting's, owner-signed" → ⛔ **OVER-GATED; SPLIT IT**

This is the one ruling I would ask the chair to withdraw as written.

The disagreement C4/E3 names is between two pieces of **instrument code**, not two values:
- `settlementShapeOf` compares the final year to **100 entries back** (`CENTURY = 100`,
  `register.mjs:54`) — an ABSOLUTE window, declared as such in its own header;
- `capacity_plateau` compares `pops[last]` to `pops[mid]`, `mid = Math.floor(last/2)`
  (`tripwires.mjs:436`, read at `:442-443`) — a HORIZON-RELATIVE window, three centuries on a
  600-year receipt.

Choosing `mid` or `last-100` moves **no tuning value**. The value in the neighbourhood is the
**0.05 band** (`PLATEAU_FLATNESS`, `register.mjs:60`, and the literal `0.05` in the detector) —
*that* is owner-signed and must stay so. Sending the WINDOW to the sitting parks a code question
behind a signature the owner cannot usefully give, and leaves the freeze door reading a definition
nobody ruled in the meantime. The delegated §907 rows were (b), (c), (d); C4/E3 is a **new**
finding, so it is not owner-gated by inheritance either — it falls to the chair under "decide
within scope; record vetoably."

**And the choice is not academic — I measured which verdicts it flips.** On the 600-year receipt,
per settlement, |last − reference| / reference:

| settlement | vs `pops[mid]` (y300) | vs one century back (y500) | flips? |
|---|---|---|---|
| soak-a | 0.1554 — fires | 0.1290 — fires | no |
| **soak-b** | **0.0502 — fires (the hairline)** | **0.0206 — silent** | ⭐ **YES** |
| soak-c | 0.3203 — fires | 0.0469 — silent | ⭐ **YES** |
| soak-d | 0.4615 — fires | 0.5625 — fires | no |

So the window choice, not the world, decides **half** the convictions on this receipt — including
R13's hairline. That is a chair-sized instrument ruling with a measured consequence, and it should
be ruled, not deferred to a sitting about values.

**Recommended split:** the chair rules the WINDOW (vetoably, in this row); only a move of the 0.05
band goes to the sitting. Note also that `population.<id>.shape` is pinned `exact` in the register
(I re-derived: soak-a `other`, soak-b `plateau`, soak-c `plateau`, soak-d `other`), so any change
to `settlementShapeOf`'s window is a register-refreeze act and must be sequenced as one.

### RULING 4 — "SOAK-1 re-priced ≈ 4–5 h, MANUAL, after the walk" → **SEQUENCING SOUND; THE FIGURE NEEDS TWO CORRECTIONS AND ONE ADDITION**

The sequencing half is not a new ruling at all: §909 ruling (3) already reads "the terminal soak
stays MANUAL on this Mac and after the walk (the 08-06 sequencing law); the price is accepted
whatever it measures." The WALK is an explicit carve-out from the 01:45 grant, so keeping the soak
behind it is the only lawful reading. **CONFIRMED.**

The design's ask is confirmed as stated: SOAK-1 (`DESIGN_HORIZON.md:1068`) asks for **≈ 35 h**
(300 y × 12 s LIT ≈ 17.6 h + the DARK twin ≈ 17.6 h), or the interim 4 s cell instead.

**The order of magnitude survives every correction I can make.** Even taking the settlement term
as high as ×2.0, `rate(12,300) = 0.4585 × 2.0 × 1.3856 = 1.271 s/sy` ⇒ run A 4,575 s, A+B 9,150 s
= 2.54 h lit, ×1.11 dark = 2.82 h, **total ≈ 5.4 h — still 6.5× under 35 h.** The headline stands.

**But two figures in the priced table do not reproduce as stated:**

1. ⛔ **`rate(4,300) — seed B = 0.8051 s/sy`, ground given as "the 600-year world's OWN first 300
   years, from `yearlyMs`", is not what `yearlyMs` says.** Summing `yearlyMs[0..299]` gives
   938,161 ms ⇒ **0.7818 s/sy** — which is exactly what the receipt's OWN prefix table prints
   ("through y300 938.2 s 0.7818 s/sy") and what `M1-600y-extract.txt:201` prints. I recovered the
   0.8051 construction: it is `(938,161 + 28,002)/1200` where 28,002 ms is the **whole 600-year
   run's** fixed overhead (`runDurationsMs.primary` 2,239,561 − Σ`yearlyMs` 2,211,559), added
   un-prorated to a 300-year prefix. That is a defensible model — but it is undocumented, it
   contradicts the receipt's own prefix table, and it inflates the quoted seed spread from
   **+23.1 % to +26.7 %** and the band's top from **2.32 h to 2.39 h**.

2. ⛔ **`f_S(12) = ×1.4820`, ground given as "4 s vs 12 s, both LIT, both 30 y", is CROSS-SEED and
   the receipt does not say so.** The 4-settlement 30-year receipts are §909's, seed **`w0-soak`**;
   the 12-settlement probe is seed **`realm-scale-research-lit-4s-30y-12s-seed1`**. This is the
   identical confound R6 raised and R10 cured on the HORIZON axis — and it rides the SETTLEMENT
   axis unnamed. Measured size:

   | | mean realm pop | per settlement | µs / soul-year |
   |---|---|---|---|
   | 30 y × 4 s LIT (`w0-soak`) | 12,735 | 3,184 | 144.6 |
   | 30 y × 12 s LIT (`…12s-seed1`) | 41,039 | 3,420 | 198.7 |

   So of the ×1.482, about **×1.074 is a bigger world per settlement** and **×1.374 is a genuine
   per-soul rise with settlement count**. The confound is real but modest (~7 %); the honest label
   is "×1.482, of which ≈7 % is a seed-level world-size difference", not "both LIT, both 30 y".
   ⚠ The larger exposure is the extrapolation: the two worlds' **start** populations per
   settlement differ ×1.4286 (4,421 vs 6,316) and they contract at very different rates over the
   same thirty years (×0.611 at 4 s, ×0.404 at 12 s). Over 300 years that can move the price in
   **either** direction — the receipt names only the upward risks (super-multiplicative axes, the
   dark runaway). A cheaper terminal cell is as live a possibility as a dearer one.

3. ⚠ **Single-run timing noise on this box reaches +7.8 %** and the band does not carry it:
   §909's lit 30 y × 4 s receipt has `replay/primary` = **1.0779**. (The lane's own runs replayed
   at 0.988–0.996, so the noise is intermittent, not systematic — but four significant figures on
   `f_S` are not supported by it.)

**THE ADDITION THE ROW OWES.** The re-pricing does not only re-price SOAK-1. **CAP-10**
(`DESIGN_HORIZON.md:1054`) asks the owner to choose between re-running the 300 y × 12 s LIT cell
after any demographics retune (**"≈ 17.6 h on this Mac, before push"**) and signing the demographics
ids UNCHANGED at v1 — and it recommends signing unchanged. At the lane's measurement that re-run is
**≈ 1.9–2.4 h**, and CAP-10's recommendation loses most of its force: a two-hour re-run after a
retune is cheap. The receipt never says so, and the §911 row should — the same measurement that
answers SOAK-1 reopens CAP-10's trade-off.

---

## PART 2 — WHAT THE §911 ROW MUST CARRY

**⭐ D1 — DISCHARGED, and the discharge matches the wording.** §910's D1 (receipt line 183; the ODQ
row's own summary reads "the shipped-300-row proof owed to CAP-HORIZON-909") asks for
`capacity_plateau` graded on a **shipped** series at the row's own horizon, under the **new
writer**. I re-executed the dock's `evaluateReceipt` on `horizon-600y-4s-lit.json` myself:
`yearlyPopulations` **600 × 4**, `yearlyDiedFlags` **600 × 4**, `capacity_plateau` gate **true**,
requires satisfied, horizon **600 observed / 150 required**, **4 findings**, `deterministicFirings`
**4**, `fullInstrument` **true**, `notExecutable` **[]**, `observability` **[]**. Not through
`observability`, not `notExecutable`. **CONFIRMED — the ledger row can close D1.**

**C1–C6.** C1 (D1 closed) — carry, confirmed above. C2 (SOAK-1 re-priced) — carry with the two
corrections and the CAP-10 addition. C3 (the seed grid) — carry as a **NEW owner row**, not under
CAP-7 (Ruling 2). C4 (two plateau windows disagree) — carry as a **chair ruling**, not a sitting
item (Ruling 3), with the flip table. C5 (the dark twin's price is a floor) — carry as written; it
is the lane's own honest caveat and I found nothing against it. **C6 (`pgrep -f vitest`
over-matches)** — a code act **is** owed, and it is the estate's, not this lane's: I confirmed the
mechanism (`LOCK_DIR="…/settlementforge-vitest-gate.$(id -u).lock"`, `gate-mutex.sh:61`, canonical
at `:85`; "vitest" is a substring) and both false positives on disk (`quiet-window-M1b.log`
SAMPLE 6 at 08:50:54; `quiet-window-M2dark.log` SAMPLE 74 at 10:08:25 — each in the minute its own
launch was reaching for the lock). The direction argument holds: over-matching cannot manufacture a
false ZERO, so every `vitest: 0` in the estate stands. **The owed act is a one-line idiom fix in
the sampler recipe** (`pgrep -f 'vitest' | grep -v gate` or `pgrep -f 'node .*vitest'`) plus a
sentence wherever the quiet-window law is written. It belongs to whichever lane next touches the
sampler; it is not owner-gated and it must not be left as a bare observation.

**E1 (the cross term) — the 150 y × 12 s probe is CHAIR-SIZED.** At the lane's own measured rate
`rate(12,150) ≈ 0.4585 × 1.482 × f_Y(150)`; from the 600-year world's own prefix table `f_Y(150)`
sits between `f_Y(30)` = 1.0 and `f_Y(300)` = 1.386, so run A ≈ 1,300–1,800 s and A+B+C ≈ **50–65
min**, not the receipt's "≈ 25 min" (which used the constant rate the receipt itself refuses —
R4's own error, committed once more in E1). Even at an hour it is chair-sized: it is a measurement
lane with zero product bytes, the same shape §907 and this lane already ran under delegated
authority. ⚠ But correct the estimate in the row.

**E2 (a second 600-year seed) — owner-hours, and the chair is right to call it so.** ≈ 1 h 15 m
measured, on a Mac serialised behind the exclusive mutex, during which no chair gate can run
(`GATE_MUTEX_MAX_POLLS` 40 × 30 s = a 20-minute bounded wait, so any gate launched into it
refuses). That is the real cost and the row should state it in those terms, not only in wall clock.

**E3 (the horizon-relative window) — folds into Ruling 3.** State it as the reason the ruling is
needed: the SAME row asks a harder question of a LONGER receipt, which is counter-intuitive and
will be misread.

**R13 (the hairline) — carry, and carry the flip.** soak-b drift **0.0502** against a **0.05** band,
reproduced exactly. On the other window it reads **0.0206** and is silent. A 0.0002 margin should
not reach the tuning desk as a signal.

**⛔ AND ONE THING THE RECEIPT DOES NOT CARRY THAT THE ROW SHOULD.** The lane's own M2 **LIT**
probe **fired a capacity row and the receipt does not report it**: `capacity_realm_load` fires at
**0.4360** ("realm load 0.4360 outside the plateau window [0.6, 1.05]"), with two `observability`
rows (`capacity_plateau` and `capacity_floor_thaw`, inconclusive by their own horizon guards at
30/150 and 30/100). It is in `M2-lit-extract.txt:23`; it appears nowhere in the receipt body,
while the DARK twin's tripwire status IS reported. It is a **third** reading of the very figure C3
is about, and it reads LOW — consistent with the receipt's "read at the wrong time" thesis, but
the chair should be given it rather than have it surface later as a fourth number.

---

## PART 3 — SMALLER CORRECTIONS THE ROW SHOULD NOT REPEAT

- **Three line cites are wrong** (the estate's own live hazard: a cited line number is wrong at the
  commit that ships it). `tripwires.mjs:426` for `requires: ['yearlyPopulations[last]', …]` →
  actual **422**. `tripwires.mjs:437-438` for the `pops[mid]` comparison → `mid` is at **436**, the
  reads at **442–443**. `register.mjs:53` for `CENTURY = 100` → actual **54**. Everything else I
  checked is exact: `tripwires.mjs` 162, 163, 427, 433, 471, 494, 543; `register.mjs` 65, 80;
  `gate-mutex.sh` 61, 85; `whole-world-soak.mjs` 158, 1021, 1122, 1123; `soakInvariants.mjs` 158,
  165, 172; `realm-scale-certification.mjs` 97–112.
- **The window-excursion list is decade-sampled and presented as complete.** The receipt gives
  three dips with minima 0.4843 / 0.5405 / 0.5922. At per-year resolution there are **nine**
  contiguous out-of-window runs — y66, y200, **y208–284 (min 0.4612)**, y325, y335–338,
  **y355–388 (min 0.5197)**, y390–394, y433, **y463–477 (min 0.5610)** — and every named minimum
  understates the true one. The qualitative claims survive: the deepest dip is the earliest, the
  three named troughs do get shallower, and y478–600 is continuously in-window (the receipt's
  "y480 to y600" is true).
- **"It enters at year 10" is a sampling artifact.** The world is INSIDE the window from **year 1
  (0.8980)** and stays inside until year 66. The receipt's own phrasing ("first *decade* inside")
  is defensible; the headline sentence built on it is not.
- **The 4-settlement dark/lit ratio is quoted twice, differently** — ×1.207 (66,679 / 55,243, one
  run) and ×1.2120 (66,679 / 55,016.5, the two-run mean). Both derive; pick one.
- **The dark twin's quiet window was two clean minutes, not three.** `quiet-window-M2dark.log`
  SAMPLE 71 (10:05:25) still reads `gate-mutex procs: 1` — M1 had not released. Only SAMPLEs 72 and
  73 are clean before the 10:08:33 launch, against the three-consecutive-minute law the receipt
  states for M1 and M2. The launch is still well-evidenced (mutex inspect FREE, lock taken after 0
  polls of every kind), but the row should not say the same law was met three ways.
- **`docs/DESIGN_HORIZON.md` is NOT in the `laneB6` dock** at `3b1c0eaa5` — it lives on the ledger
  branch (`git show 29a4ff20d:docs/DESIGN_HORIZON.md`, 1,469 lines / 729,637 B). A brief that sends
  a lane to read it in the dock sends the lane to a missing file.

---

## PART 4 — THE FRQ ENROLMENT

`docs/FABLE_RETROVALIDATION_QUEUE.md` at `29a4ff20d` carries exactly **73** `### R<n>` headers; the
last is **R73 — lane SOAK-HONEST-909**, and the file's closing line reads that §910 enrols
SOAK-HONEST-909. **CONFIRMED: §911 enrols R74.**

---

## WHAT I COULD NOT TEST
- Whether the terminal 300 y × 12 s cell's own seed produces a world resembling either probe — no
  such run exists, so the price band's dominant term stays unbounded in both directions.
- Whether the box's load differed materially between the §909 4-settlement runs and this lane's
  12-settlement run (the timing comparison's other confound). The §909 quiet-window logs were not
  in scope for this pass.
- The 08-06 sequencing law's own text: I read it only as restated in §909 ruling (3) and in memory.
