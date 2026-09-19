# HB_ROUND4_CLOSE — THE CLOSE STATEMENT FOR ROUND FOUR

**DATE: 2026-08-07.**
**PREPARED UNDER OPUS 5, NOT FABLE 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

> **EVERY JUDGEMENT IN THIS DOCUMENT IS VETOABLE.** Each carries a VETO
> SENTENCE stating the one thing a future session would need to believe in
> order to flip it. A veto costs one word today; discovering the same call
> baked into a landed wave costs the wave.

**WHAT THIS DOCUMENT IS.** `HB_CHAIR_RULINGS.md` ruled that round four of
the habit-conditioning volume never closed, that what is owed is **a CLOSE
STATEMENT — one document — and NOT a sixth-and-a-half pass**, and that
"with no close, nothing dispatches." This is that document. It is the
close, and it is deliberately the *only* thing it is: it re-executes the
volume's own instruments, records what they returned, audits the
instrument that round four found broken, and then states with precision
the narrow thing a close of this kind is entitled to certify.

**⛔ WHAT THIS DOCUMENT IS NOT.** It is not a review round. No finding
below was hunted by re-reading the architecture; every one of them fell
out of running the instruments the volume already carries. Nothing here
amends a wave spec, a flag ladder, a seam row or a deferral row. Round
four's content stands exactly as round four left it.

---

## §1 — THE CLOSE, STATED

**ROUND FOUR OF `HABIT_conditioning_round4-snapshot.md` IS CLOSED ON
INTERNAL INTEGRITY, at the byte sequence whose BODY md5 is
`6622a9fbe8b4186d2d29e72cbb6d564a` (4,258 body lines above §9).**

The close rests on three executed findings, each recorded in §2 and §3
with the command that produced it:

1. The count ledger and the struck-premise scan return **52 quantities,
   0 FAIL, 52 PASS**, across **131 prose homes** and **71 structural
   cross-checks**, with **42 signature phrases** scanned and **ZERO
   DIFFS** — exit code **0**.
2. The odds-ratio law re-executes and holds: **ZERO violations** over
   200,000 randomized trials, observed range inside the analytic range.
3. **The instrument defect round four found in itself is CURED, and the
   cure is PROVEN by re-enacting the exact defect as a mutant** — not
   asserted. The malformed-row scan that the defect suppressed now runs,
   over a **complete and non-vacuous denominator**, and reddens in both
   directions.

**⚠ THE CLOSE CARRIES ONE DEFECT IT DID NOT INHERIT — SEE §2.1.** As the
volume and its instruments sit in this directory *right now*, the census
does not run at all. That is a packaging defect in the snapshot, not a
defect in the volume, and it is cheap to cure — but a close statement that
did not report it would be certifying a census that a reader following the
documented usage line cannot reproduce.

> **VETO SENTENCE.** To flip this close you would need to believe that
> internal integrity at a fixed byte sequence is not a thing worth
> certifying separately from architectural correctness — i.e. that the
> only close worth having is a full adversarial round. §4 concedes the
> whole of the second and claims only the first.

---

## §2 — THE EXECUTED EVIDENCE

### 2.1 ⚠⚠ THE PACKAGING DEFECT — THE INSTRUMENT ABORTS AS PACKAGED

Run exactly as this directory's own README implies, the census **does not
produce a census**:

```
$ cd docs/architected-volumes-pending-fold
$ python3 HABIT_countsweep.py HABIT_conditioning_round4-snapshot.md
EXIT CODE: 1

COUNT CENSUS — countsweep.py over HABIT_conditioning_round4-snapshot.md

⛔ PARSE ABORT — the instrument could not finish deriving. THIS IS A FINDING, NOT AN OUTAGE:
   FileNotFoundError: [Errno 2] No such file or directory: '.../VERIFY_oddsratio.py'
   A structure this script navigates by (a table header, a quoted literal, a named block)
   has moved. Fix the volume or re-aim the recipe — never delete the quantity.
```

**THE CAUSE, MEASURED.** `HABIT_countsweep.py` line 59 resolves its
sibling sweep script **relative to its own location and by its canonical
name**:

```python
HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_VOLUME = os.path.join(HERE, "DESIGN_HABIT_ARCHITECTURE-POLISHED.md")
SWEEP_SCRIPT = os.path.join(HERE, "VERIFY_oddsratio.py")
```

The snapshot copy renamed both instruments with a `HABIT_` prefix for
shelf legibility in a shared directory. The prefix is invisible to the
volume and invisible to the count ledger — but `SWEEP_SCRIPT` is read for
its md5 (line 852) **and executed as a subprocess** (line 871), because
quantities 26 and 27 diff the sweep script's identity and its executed
figures. A renamed sibling therefore kills the whole census.

**⭐ THE INSTRUMENT'S BACKSTOP WORKED, AND THAT IS THE FINDING WORTH
KEEPING.** The abort is LOUD, names the exception, and says in terms
"THIS IS A FINDING, NOT AN OUTAGE". This is the round-three/round-four
lesson holding under a failure mode neither round anticipated: an
instrument that dies must still print, because *silence reads as absence
of a finding*. It printed.

**⚠ WHAT WOULD HAVE HAPPENED WITHOUT THE BACKSTOP** is the estate's
recorded hazard exactly: a reader re-running the census as packaged, seeing
no census, and concluding the file simply had nothing to say.

**THE CURE — THREE PARTS, and a `mv` alone is silently undone.** This is
the same three-part shape the EPOCH rename needed and the snapshot deletion
needs (README §"Standing obligation"): (1) restore the canonical names
`countsweep.py` and `VERIFY_oddsratio.py` at the fold, **or** amend both
`cp` lines in `scripts/refresh-archive.sh` if the prefix is kept; (2)
whichever is chosen, the two names must move TOGETHER — the prefix is only
harmful because it was applied to the sibling and not to the locator; (3)
update this directory's README row. ⚠ **A rename of the files alone lets
`scripts/refresh-archive.sh` recreate the prefixed names on the next
refresh**, which is precisely how this defect will come back.

> **VETO SENTENCE.** To flip this finding you would need to show that
> `SWEEP_SCRIPT` is never read on the live path — but it is read twice,
> at lines 852 and 871, and the abort above is the executed proof.

### 2.2 THE CENSUS, RE-RUN AND REPRODUCED

**METHOD, stated so it is auditable.** Both instruments and the volume
were copied byte-for-byte into a scratch directory under the names the
instrument resolves, and the census was run there. **No estate file was
modified.** Byte identity was proven, not assumed:

```
$ cmp HABIT_countsweep.py <scratch>/countsweep.py            -> countsweep IDENTICAL
$ cmp HABIT_VERIFY_oddsratio.py <scratch>/VERIFY_oddsratio.py -> oddsratio IDENTICAL
$ cmp HABIT_conditioning_round4-snapshot.md <scratch>/...md   -> volume IDENTICAL
```

**THE RESULT — exit code 0:**

```
COUNT CENSUS — countsweep.py over HABIT_conditioning_round4-snapshot.md
volume BODY md5 (above §9, stable across re-pastes): 6622a9fbe8b4186d2d29e72cbb6d564a
countsweep.py md5                                  : 0aa8d27dbe8b786ab55c38df7d03a337
volume BODY lines (above §9)                       : 4258

52 quantities swept across TWO families, 0 FAIL, 52 PASS
TOTAL PROSE HOMES DIFFED: 131 ; TOTAL STRUCTURAL CROSS-CHECKS: 71 ; SIGNATURE PHRASES SCANNED: 42
ZERO DIFFS — every counted quantity agrees with every prose home that states it, and no
refuted premise is restated unmarked.
```

**FAMILY ONE** returned 34 PASS rows including `seam_rows` **13**, `waves`
**10**, `flags` **4**, `deferral_book` **43**, `judgment_blocks` **28**,
`refutations` **18**, `chair_questions` **5**, `malformed_row_scan` **0**.
**FAMILY TWO** returned 18 PASS rows, `struck_R1`..`struck_R18`, no
unlicensed restatement of any refuted premise.

**⭐ THE SELF-ASSERTING IDENTITY QUANTITIES BOTH PASSED**, which is the
part that makes the rest checkable rather than merely printed:
`countsweep_md5` **`0aa8d27dbe8b786ab55c38df7d03a337`** and
`sweep_script_md5` **`ec974edb4ee8f0b776d77d887f28bc6e`** each agree with
the phrase the volume's §9 spells for it. **The instruments that produced
this census are the instruments the volume names.**

**CONFIRMED: the prior report reproduces exactly** — exit 0, 52
quantities, 0 FAIL / 52 PASS, 131 prose homes, 42 signature phrases, zero
diffs. It was verified, not inherited. ⚠ The prior report omitted the 71
structural cross-checks; that is an understatement in the record, not a
disagreement.

### 2.3 THE ODDS-RATIO SWEEP, RE-RUN

`python3 VERIFY_oddsratio.py` — exit **0**. The load-bearing figures:

| Figure | Returned | Volume's §3b phrase |
|---|---|---|
| analytic law interval | `[0.481481, 2.076923]` | matches |
| observed odds range | `[0.481791, 2.075591]` | matches |
| odds violations over N=200,000 | **`0`** | "**ZERO violations**" |
| deleted per-probability violation rate | `0.2643` | matches |
| deleted per-probability worst | `1.938` | matches |
| case A / B / C per-probability max | `1.5457` / `2.0061` / `1.6933` | matches |
| case C `p_deploy` dark | `0.2104` | matches |

**THE ODDS-RATIO LAW HOLDS AS DECLARED**, and the deleted per-probability
claim remains correctly deleted rather than narrowed: it reds in cases A, B
and C (`deleted_pin_reds: true`) and violates in 26.43% of randomized
trials. The `reachability_fill` figures `[1.0006, 0.9994]` show the sweep
reaches the analytic bounds to within 0.06%, so the ZERO is a **filled**
zero, not an unexercised one.

---

## §3 — THE INSTRUMENT AUDIT

`HB_CHAIR_RULINGS.md` and this directory's README both record that round
four found a defect **in the instrument itself**: `coverage()` indexed
`c[3]` on a three-cell row, died of an `IndexError`, and took the whole
census's stdout with it — **before `malformed_row_scan`, the very scan
that exists to report malformed rows, ever ran.** A close statement that
rested on this instrument without auditing that hole would be worthless.
It is audited here, and the audit is executed, not argued.

### 3.1 THE CURE AS THE INSTRUMENT DESCRIBES IT

`cells(row, want=None)` now pads a short row to the header's width, with
the reasoning written down at lines 87–96 — *"padding only keeps the other
fifty quantities alive long enough to be printed beside the malformed-row
finding"*, and the scan itself "measures the RAW row and is unaffected by
this padding."

**⚠ THAT IS A CLAIM, AND A CLAIM IS NOT A CURE.** The estate's standing
law is that a remedy written to compensate for a defect must be **run as a
mutant**, because a remedy that is dead under the current architecture
stays green while proving nothing.

### 3.2 THE CURE, RE-ENACTED AS A MUTANT — EXECUTED

A read-only probe imported the instrument's own functions and planted
defects into **in-memory copies** of the volume. No file was written.

| Mutant | Plant | Result |
|---|---|---|
| **(1)** | a SHORT row (one cell missing) into the first ≥4-column table | **REDDENS** — `line 771: header wants 4 cells, row has 3` |
| **(2)** | a LONG row (one extra cell) at the same site | **REDDENS** — `line 771: header wants 4 cells, row has 5` |
| **(3)** ⭐ | **the round-four defect re-enacted exactly** — a 3-cell row planted into the 4-column `Site\|Action\|Close\|Coverage` table, the identical shape that killed `coverage()` | `coverage()` **SURVIVED (13 rows) — padding holds**; `malformed_row_scan` **REACHED and REDDENED (1)** |

**⭐⭐ MUTANT (3) IS THE ONE THAT MATTERS AND IT IS DECISIVE.** It plants
the original defect at the original address in the original table, and
both halves of the cure are observed doing their jobs: the padding keeps
`coverage()` alive, *and* the scan the crash used to suppress now runs to
completion and reports the planted row. **The round-four instrument defect
is CURED, and the cure is proven by execution rather than by the comment
that describes it.**

**⚠ MUTANTS (1) AND (2) TOGETHER matter more than either alone**: a scan
that only catches short rows would be half-blind, and short rows are the
only shape round four actually met. The scan is symmetric.

### 3.3 THE DENOMINATOR — NON-VACUOUS, AND TOTAL

A scan reporting **0** is worthless if it examined nothing. Measured:

```
tables walked         : 15
data rows measured    : 126
header widths present : [2, 3, 4, 5, 6]
cell comparisons      : 545
scan verdict (bad)    : 0
```

**⭐ AND THE TABLE DETECTION IS TOTAL, WHICH IS THE STRONGER CLAIM.** A
non-vacuous denominator still leaves open that the parser silently skipped
tables it could not recognize. It did not:

```
lines starting with |  : 156
contiguous pipe-runs   : 15
runs with a separator  : 15
runs WITHOUT separator : 0
```

**Every contiguous run of pipe-leading lines in the volume is a
well-formed table, and all 15 were walked.** There is no unparsed table for
a malformed row to hide in. The zero is a real zero over 545 cell
comparisons spanning five distinct header widths.

> **VETO SENTENCE.** To flip the instrument audit you would need a table
> in the volume that begins on a line NOT starting with `|`, which the
> 156/15/15/0 census above forecloses.

---

## §4 — ⛔ WHAT THIS CLOSE DOES NOT CERTIFY

Stated plainly, because the value of a narrow close is entirely in the
narrowness being honest.

**IT CERTIFIES:** that at BODY md5 `6622a9fbe8b4186d2d29e72cbb6d564a`,
every counted quantity in the volume agrees with every prose home that
states it; that no premise the volume refuted is restated anywhere without
a licence; that the two instruments the volume names are the two that
produced the census; and that the instrument's own known defect is cured
under an executed mutant. **This is INTERNAL INTEGRITY — the volume does
not contradict itself, and its numbers are its tables'.**

**IT DOES NOT CERTIFY THAT THE ARCHITECTURE IS RIGHT.** Not one line
below is evidence that habit-as-state is the correct model, that the flag
ladder is correctly ordered, that the ten waves are correctly cut, that
the thirteen seam rows name the right neighbours, or that any band, curve
or threshold carries a defensible value. **A count ledger cannot see a
well-formed wrong answer.** It is precisely designed to catch the sentence
that stopped watching its table, and it catches nothing else.

**IT DOES NOT CERTIFY THAT THE VOLUME WAS ADVERSARIALLY REVIEWED AT ROUND
FOUR.** Round four was the volume's SIXTH pass; the close being written now
is a close of the *record*, not a substitute for a review round.

**IT DOES NOT CERTIFY ANYTHING ABOUT THE LIVE TREE.** Every figure above
is derived from document text. The volume's own §5 measurement premises
are stated against a commit that is now many commits stale, and the
volume's standing instruction — *measure at the publishing commit, never
inherit* — is untouched by this close.

**⚠ IT DOES NOT RESOLVE Q1.** See §5.

**IT DOES NOT UPGRADE THE VOLUME TO "SEALED".** The README records that
the sealed/unsealed distinction is load-bearing and that a spurious
"SEALED" label on the sibling EP volume came from a *script's copy
destination*. **This document is a CLOSE, and a close is not a seal.** The
volume still ends on a lesson paragraph; that is now correct rather than
merely unfinished, because the close lives here instead.

---

## §5 — ⛔ Q1 STANDS ESCALATED, AND THE CLOSE DOES NOT TOUCH IT

`HB_CHAIR_RULINGS.md` ruled four of HB's five chair questions and
**escalated Q1 to the owner on persisted-state shape** — two owner-gated
persisted fields plus a third ruled deferred-and-visible.

**THIS CLOSE DOES NOT RULE Q1, DOES NOT NARROW IT, AND DOES NOT CONSUME
ANY SIGNATURE AGAINST IT.** Persisted-state shape is one of the classes
held back from self-ruling regardless of the owner's blanket queue
sign-off, and a blanket grant does not flip a park into a build. The
census's `foreign_fields_written` (**2**: `deployment`, `treaty`) and
`foreign_fields_deferred` (**1**: `occupationRecord`) quantities PASS —
but what they prove is that the volume *names its own persisted surface
consistently*, which is exactly the internal-integrity claim of §4 and not
a judgement on whether that surface should exist.

**WHAT THE CLOSE DOES CHANGE FOR Q1: nothing, except that Q1 is now the
only thing standing between HB and dispatch on the volume's own terms.**
The chair's "with no close, nothing dispatches" condition is discharged by
this document; the Q1 condition is not.

---

## §6 — WHAT REMAINS OWED AFTER THIS CLOSE

| # | Owed | To whom | Blocks |
|---|---|---|---|
| 1 | **Q1 — the two owner-gated persisted fields** | **Owner** | HB waves that write them; NOT the fold |
| 2 | **The packaging defect of §2.1** — restore canonical instrument names or re-aim `SWEEP_SCRIPT`, in BOTH the file and `scripts/refresh-archive.sh` | Fold operator | Reproducibility of §9, not dispatch |
| 3 | **Re-measure at the publishing commit** — every §5 figure, per the volume's own law | Implementer | Each wave at its landing |
| 4 | **The 43-row deferral book** — carried forward unchanged, deliberately deferred and documented | — | Nothing; recorded so it is not re-found as a bug |
| 5 | **FABLE SURVEY** of this document | Next Fable session | Nothing |

**⛔ ROUND FIVE IS NOT OWED.** The chair ruled that what round four needed
was a close, not another pass, and nothing found while writing this close
argues otherwise: the census is green over a complete denominator, the one
instrument defect is cured under mutation, and the only new finding (§2.1)
is a packaging error in the snapshot rather than a defect in the
architecture. **Opening a round five on this evidence would be re-reviewing
a volume whose last three passes each confirmed the previous one, at the
cost of the one thing this program is short of, which is landing time.**

---

## APPENDIX A — THE SEAM-COUNT RULE, AND WHY WC HAS NO SEAM COUNT

**⚠ THIS APPENDIX IS NOT PART OF THE HB CLOSE.** It is recorded here
because the counting rule it states is **read off HB's own instrument**,
and this is the document that audits that instrument. It rules nothing
about WC and amends no WC text.

**THE PROBLEM.** The parent volume's §9 arithmetic cannot be written at the
fold without a seam count from each incoming volume. EP declares **+10**
and HB declares **+13**. `WC_war-circulation_in-progress-snapshot.md`
declares **no seam count anywhere** across 6,492 lines.

**THE RULE, stated so a chair can re-derive it in one step.** From
`HABIT_countsweep.py` line 327 and its consumer at line 644:

```python
def seams(self):
    return table_by_header(self.text, ["#", "Neighbour", "The contract", "The tripwire"])
...
sm = vol.seams()
r = Result("seam_rows", len(sm), "count data rows of §8.1")
check(vol, r, "amends by **+%d**" % len(sm))
```

> **THE RULE.** In the incoming volume, find the single markdown pipe
> table under `## §8 SEAMS PINNED BOTH SIDES` → `### 8.1` whose header is
> the four columns `#` · `Neighbour` · `The contract` · `The tripwire`.
> **Count ALL its data rows — no filtering of any kind.** That integer is
> the volume's seam count and the `+N` it amends the parent §9 matrix by.

⚠ Two precision notes. First, the absence of filtering is deliberate and
contrasts with the sibling quantity `anticipation_seams` (line 333), which
*does* subtract struck rows; `seams()` counts every physical data row.
Second, the literal header string is HB-local — already-folded ES and WY
spell it `Neighbor` with a differently-worded fourth column — so the
transferable rule is **the four-column shape under §8.1**, not the exact
string.

**THE RULE REPRODUCES BOTH DECLARED FIGURES — EXECUTED:**

```
EP  tables=30   seam-table rows=10      (declared +10 at §5 item 5)
HB  tables=15   seam-table rows=13      (declared +13 at §5 item 4)
WC  tables=0    seam-table rows=NO SUCH TABLE (LookupError)
```

EP's §8.1 heading reads *"The TEN seam rows (row 9 added by chair ruling
R9; ⭐ row 10 by chair ruling T1)"*; HB's reads *"The THIRTEEN seam rows
(⭐ row 13 added at the amendment — the campaign clock)"*. **Two for two.**

**⛔ WC CANNOT BE COUNTED BY THIS RULE, AND NO NUMBER SHOULD BE
MANUFACTURED. CONFIRMED, by measurement:**

- `grep -c -a "^|" WC_war-circulation_in-progress-snapshot.md` returns
  **0**. **WC contains ZERO markdown pipe tables** across 6,492 lines. Its
  tabular material is indented fixed-width ASCII blocks.
- WC has **no §8 and no §9**. Its headings are `# SECTION 0 -- OWNER
  INTENT AND THE LAW CHECKLIST` … `# SECTION 7 -- APPENDICES`, an
  entirely different skeleton from the shared EP/HB one.
- `grep -n -a -i "amends by\|seam matrix\|matrix count\|QUEUE INSERTION"`
  returns **nothing**. WC has **no queue-insertion section**, and writes no
  parent-amending arithmetic clause for any quantity — it states its wave
  count as a bare fact ("Seventeen waves, four arcs").

**WC declares no seam count because it was never given the fold apparatus
that declares one.** This is a structural absence, not an oversight in a
sentence.

**⚠⚠ THE TRAP, NAMED SO NOBODY WALKS INTO IT.** WC uses the phrase "seam
row" twelve times in a **different sense** — a *pre-pinned seam row* is a
test pin inside a wave that reds when its counterpart lands, not a
cross-program contract row. **A grep-count of "seam row" in WC returns a
number that is not a seam-matrix count. Do not use it.**

**THE NEAREST DEFENSIBLE PROXY, WITH ITS CAVEAT.** WC's semantic analogue
is `SECTION 4 -- THE COORDINATION CONTRACTS`, whose own opening states the
seam contract exactly: *"Each contract names the OWNER of the shared
thing, the CONSUMER, and the seam enforcement."* But it is a **two-level**
structure where §8.1 is **flat**, so no single granularity maps: per
neighbour-volume it yields **5**, per contract it yields **25**. **These
bracket the answer; neither IS the answer**, because EP's 10 and HB's 13
count an artifact that exists, while WC's would count an artifact someone
must first author.

**THE RECOMMENDED CHAIR ACT — commission WC's §8.1 table, then apply the
rule.** The fold arithmetic needs a number that a reader can re-derive in
one step, and the only honest way to get one is for WC to grow the same
four-column table its siblings carry. **This is a small, mechanical,
non-architectural act** — the contracts already exist in SECTION 4 and
need transcribing into the house shape, not inventing.

**⭐ ONE FINDING FOR THE FOLD ARITHMETIC, recorded because it changes what
"+N" means physically.** The parent's §9 carries **47 physical data rows**
while its closing summary says **66 seams pinned** — not a defect, but the
fold convention: rows 46 and 47 are **compressed range rows** (`| 46-58 |
THE ESPIONAGE BLOCK (13 rows) | … |` and `| 59-66 | THE WAYFARE BLOCK (8
rows) | … |`), and 45 + 13 + 8 = 66. **A folded volume contributes ONE
physical row and +N logical seams.** An operator who counts physical rows
at the fold will measure 47, disagree with the PLAUSIBLE 66 that EP's
VERIFY-AT-FOLD banner tests against, and fire a false STOP.

> **VETO SENTENCE (appendix).** To flip the refusal to number WC you
> would need to find a four-column seam table in WC — but the volume
> contains no markdown table of any width, which the executed `grep -c -a
> "^|"` result of `0` settles.
