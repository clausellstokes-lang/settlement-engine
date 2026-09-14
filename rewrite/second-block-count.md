# IS DS-DEF-2 UNUSUALLY DENSE? — the second count, shipped against shipped
*A measurement. Written outside the dock; nothing committed, anywhere. The dock
(`$SC/kit/laneRW-DEF2`) was read read-only at `310893244`; every row classified below comes from
`git show f2da5a3ee:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, and the density proxy from
`docs/content/wiring-census.json` at the same commit. Same classification test as
`rewrite/unfalsifiable-count.md` §0, same measurer seat, same strictness.*

---

## ⭐ THE ANSWER TO ITEM 2, FIRST, IN ONE SENTENCE

**DS-DEF-2 is not unusually dense — at the shipped grain it is 0.0% unfalsifiable, exactly like the
faith block and the population block, and the whole 425-unit sample runs 1.9% — but DS-DEF-2 *is* a
genuine outlier on the one variable that does predict unfalsifiable prose: it is **rank 1 of 55
blocks** for absence-keyed pools (53.8% against 16.1% corpus-wide), and in the rewrite its absence
pools carry 9.4% unfalsifiable against 3.3% in its presence pools — so the corpus should be expected
to land **below** 6.5%, not above it.**

⚠ **This contradicts the first measurement's own stated limit, the one that chartered this car.**
Its §5B2 said *"a block over customs, faith or daily life would very plausibly run a much higher
unfalsifiable share, and the ruling's economics would look different there."* Measured: the faith
block runs **0.0%**, the second faith block **0.0%**, the daily-life/fabric block **0.0%**, the
population block **0.0%**. The conjecture is not supported anywhere I could test it. Ruling 41's
disposition — *"worth building for other desks and not for this one"* — rests on a premise the
numbers do not carry.

---

## 0. THE BLOCKS, NAMED WITH THE REASON, AND THE METHOD

### The control and the three the brief asked for
| # | block | why this one |
|---|---|---|
| control | **DS-DEF-2** shipped, 26 pools / 78 units | the same block as the first count, at the shipped grain — the only like-for-like the corpus can supply |
| 1 | **DS-FTH-3** *Religion state: standing, niche, legitimacy, falls, rank, wealth, season* — 25 pools / 75 units | the **faith block**, and the largest faith surface in the product. Picked because it is the first count's own named counter-hypothesis; if faith runs higher anywhere, it runs higher here |
| 2 | **DS-POP-1** *Population: banded counts, demographic receipts and movement* — 17 pools / 51 units | the **population block**. Also the largest block whose census wiring is **100% unresolved**, so it doubles as a test of whether unresolved wiring predicts loose prose |
| 3 | **DS-ECO-11** *Terrain identity, economic strengths, and the exploitation ladder* — 17 pools / 53 units | the **likely-dense** pick, chosen so the finding cannot be an artefact of picking loose blocks: 14 of its 17 pools are census-RESOLVED and its `fieldsRead`/pool is **1.41 against the control's 1.15** — measurably denser than DS-DEF-2 on the brief's own proxy |

### Four further probes, added because the three above all returned 0.0% and a measurement that only returns zeroes is not a measurement
| # | block | why |
|---|---|---|
| 4 | **DS-STR-1** *Active crisis banners* — 17 pools / 96 units | the **highest draw depth in the shipped corpus** (5.65 units per pool against the control's 3.00). If unfalsifiable prose is a function of how many distinct sentences one key must yield, this is where it shows first |
| 5 | **DS-GEN-1** *Current tensions, incl. `plotHooks[]`* — 10 pools / 50 units | draw depth 5.00, and the block closest in kind to the owner's re-cut framing (*"These are plot hooks"*) |
| 6 | **DS-GEN-15** *The fabric wears it* — 5 pools / 12 units | the **daily-life / customs** family the first count named by name |
| 7 | **DS-FTH-4** *Why the temple holds its ground* — 4 pools / 10 units | a second, differently-shaped faith block, as a check on FTH-3 |

**425 units classified in all.** The extractor's pool counts (26 · 25 · 17 · 17 · 17 · 10 · 5 · 4)
agree **exactly** with `wiring-census.json`'s independent pool counts for the same eight blocks, which
is the only cross-check available on the extraction.

### The test, unchanged
A unit is **COUPLED** when it asserts or denies a field, a roster row, a bucket, a band — *or the
key's own read* (the first count's ⭐ rule, and the one that decides most close calls here). It is
**UNFALSIFIABLE IN CLAIM** when it asserts none of those: conduct, manners, attitude, talk, an
opinion, a household's own arrangement, a non-typed object. Judgment calls are named per unit in §4,
not buried.

⚠ **The U / S split of the first count does not transfer and is not reported.** Shipped rows carry a
VOICE tag (`[ledger]` `[street]` `[visitor]` `[unfolding]` `[counterforce]` `[threshold]` `[elder]`),
not a seated source; there is no `faceSources` seat to be coupled to. Everything below is the
**claim grain only** — which is the right grain, because the first count's headline 6.5% is
`(U+S)/506`, the claim grain too.

---

## 1. THE SHARE PER BLOCK

| block | desk | pools | units | units/pool | **unfalsifiable** | **share** | census `fieldsRead`/pool | absence-keyed pools |
|---|---|---|---|---|---|---|---|---|
| **DS-DEF-2 (CONTROL)** | Defense | 26 | **78** | 3.00 | **0** | **0.0%** | 1.15 (26/26 resolved) | **53.8%** |
| **DS-FTH-3** | Faith | 25 | **75** | 3.00 | **0** | **0.0%** | 0.32 (2/25 resolved) | 20.0% |
| **DS-POP-1** | Population | 17 | **51** | 3.00 | **0** | **0.0%** | 0.00 (0/17 resolved) | 5.9% |
| **DS-ECO-11** | Economics | 17 | **53** | 3.12 | **4** | **7.5%** | 1.41 (14/17 resolved) | 17.6% |
| DS-STR-1 *(probe)* | Stress | 17 | 96 | 5.65 | 4 | 4.2% | 0.88 (15/17 resolved) | 11.8% |
| DS-GEN-1 *(probe)* | General | 10 | 50 | 5.00 | 0 | 0.0% | 0.00 (0/10 resolved) | 0.0% |
| DS-GEN-15 *(probe)* | General | 5 | 12 | 2.40 | 0 | 0.0% | 0.00 (0/5 resolved) | 0.0% |
| DS-FTH-4 *(probe)* | Faith | 4 | 10 | 2.50 | 0 | 0.0% | 0.00 (0/4 resolved) | 25.0% |
| **ALL EIGHT** | — | **111** | **425** | 3.83 | **8** | **1.9%** | — | 23.4% |

⚠ **The census proxy is confounded and must not be read as a density ranking.** 347 of the corpus's
708 pools are `WIRING-UNRESOLVED`, and an unresolved pool contributes `fieldsRead: []` — a zero that
means *the census could not resolve the key*, not *the key is thin*. DS-DEF-2 is one of the fully
resolved blocks (26/26); DS-POP-1, DS-GEN-1 and DS-GEN-15 are resolved at 0/17, 0/10 and 0/5. **On
the resolved subset only, DS-DEF-2's 1.15 `fieldsRead`/pool ranks 32nd of 68 blocks — mid-table, not
"the most densely-typed tab in the product."**

---

## 2. WHAT THE NUMBERS ACTUALLY SAY, INCLUDING THE PART THAT SPOILS THE COMPARISON

### 2a. ⛔ The like-for-like comparison the brief prescribed is very nearly degenerate, and the chair should know that before quoting the zeroes
The brief's method correction was right that shipped-against-shipped is the only comparison available.
It turns out to be **almost incapable of returning a non-zero**, for a structural reason:

> **A shipped row is a one-per-branch restatement of its own key.** Three rows per pool, each a
> different voice on the same fact. Asserting the key is COUPLED by the first count's ⭐ rule, so a
> shipped corpus is ~100% coupled *by construction*.

The rewrite is a different object: ~**24 faces per pool** (506 / 21), written under an explicit
instruction that **a face need not restate its key**. The 6.5% is the residue of that instruction —
what a writer lands on once the key has been said nineteen ways and cannot be said a twentieth.

⇒ **The 6.5% is a property of neither the block nor the corpus. It is a property of the rewrite's own
form.** Nothing about faith, population or defense as *subjects* produced it, and nothing in the
shipped corpus can set its value for another block. That is the honest limit on everything in §3.

### 2b. But the shipped corpus is not useless, because it locates the real driver
All eight non-zero units in 425 fall in exactly two places, and neither is a subject:

- **DS-ECO-11, 3 of 4** are the whole `STRATEGIC VALUE` pool — the one pool in the eight blocks whose
  own heading instructs the writer **not to restate the key**: *"the string is printed beneath; the
  prose never restates it."* When the restatement is forbidden, the unfalsifiable share of that pool
  is **3 of 3 = 100%.** That is the sharpest single datum in this measurement.
- **DS-STR-1, 3 of 4** fall in `politically_fractured`, `recently_betrayed` and `infiltrated` — the
  three pools in the block whose typed condition has **no physical or roster correlate**. A fracture,
  a betrayal and an infiltration are typed facts with nothing to point at, so the writer reaches for
  conduct. (The fourth, ECO-11 `TERRAIN: Swamp`, is the same shape: a row that would sit unchanged on
  Forest, Hills or Mountains.)

### 2c. ⭐ The finding that reverses the worry: DS-DEF-2 is the most ABSENCE-KEYED block in the product
Re-scored from the first count's own §1 table, splitting its 21 rewritten pools by whether the key
names a thing the town **has** or a thing it **lacks**:

| group in DS-DEF-2's rewrite | pools | faces | unfalsifiable | share |
|---|---|---|---|---|
| **absence-keyed** (NO perimeter · NO force · without a wall · nothing organized · militia only · no legal infrastructure · WEAK · NO reserves …) | 12 | 266 | 25 | **9.4%** |
| **presence-keyed** (perimeter AND force · walls AND garrison · full legal chain · STRONG · granary AND hospital …) | 9 | 240 | 8 | **3.3%** |

A **2.8×** ratio, and it runs in the same direction as §2b. Now the corpus:

| rank | block (≥5 pools) | absence-keyed pools |
|---|---|---|
| **1 of 55** | **DS-DEF-2** | **14 / 26 = 53.8%** |
| 2 | DS-SUP-1 | 3 / 6 = 50.0% |
| 3 | DS-GEN-11 | 3 / 6 = 50.0% |
| 4 | DS-DEF-5 | 5 / 11 = 45.5% |
| 5 | DS-DEF-11 | 2 / 5 = 40.0% |
| — | **CORPUS** | **114 / 708 = 16.1%** |

**DS-DEF-2 is unusual — first of fifty-five — but on absences, not on typing.** Its subject is the
five ways a town can fail to be defended, so half its keys name a hole. Holes are what produce
unfalsifiable prose. **The corpus carries absences at a third of DS-DEF-2's rate**, which is why the
projection below lands under 6.5% rather than over it.

---

## 3. THE PROJECTION — stated as a range, and it is still small

**The base.** 708 pools corpus-wide (`wiring-census.json` totals), 2,266 shipped units today. At the
rewrite's realised depth of **24.1 faces per pool**, a fully rewritten corpus is **≈17,060 faces** — a
7.5× multiplication of what is written now. DS-DEF-2's 21 and DS-DEF-11's 5 are landed, so the
**programme's remaining writing is ≈682 pools ≈ 16,440 faces.**

**The rate.** Weighting the two measured rates by the corpus's own absence prevalence:
`0.161 × 9.4% + 0.839 × 3.3%` = **4.3%**.

| reading | corpus unfalsifiable rate | bankable faces of the remaining ~16,440 |
|---|---|---|
| presence-rate floor (no absence uplift at all) | 3.3% | ≈ 550 |
| **central (absence-weighted)** | **4.3%** | **≈ 710** |
| adverse — absence detection undercounts 2×, plus the first count's own most-adverse re-reading (×1.154) | 6.1% | ≈ 1,000 |
| outside case — the thin-key risk of §5C, band-only blocks running 15% | ~5.4–6.4% | ≈ 900–1,050 |

⇒ **THE BANK WOULD HOLD ROUGHLY 550–1,050 FACES, CENTRALLY ~700, OUT OF ~16,440 — a corpus rate of
about 4.3%, BELOW DS-DEF-2's 6.5% rather than above it.**

**The saving.** The first count measured what the bank actually removes: of 33 bankable faces, only
**8 were cross-pool duplicates** — 24.2% of bankable, **1.6% of the block's writing**.

| | saving in faces | share of the remaining writing |
|---|---|---|
| corpus at DS-DEF-2's own collapse rate (24.2%) | ≈ 170 | **1.0%** |
| corpus if cross-*block* collision doubles the collapse rate to 50% — plausible (68 blocks drawing on one finite stock of universal conduct) but **unmeasured** | ≈ 355 | **2.2%** |
| high corner (1,050 bankable × 50%) | ≈ 525 | **3.2%** |

⇒ **1.0% – 3.2% of the programme's remaining writing, centrally about 1.5–2%. Said plainly: this is
still small, and at the central estimate it is SMALLER than the 1.6% measured on DS-DEF-2, not
larger.** The separate saving on the MARK/REFUTE seats — faces authored once and never
preimage-checked again per block — is **≈4.3% of the refuter's per-face load corpus-wide**, against
6.5% on DS-DEF-2. Real, and small, and one desk lower than the block that produced the ruling.

---

## 4. THE JUDGMENT CALLS, NAMED PER UNIT

### 4a. The eight units called UNFALSIFIABLE, with what would flip each
| block | # | unit | why U, and what flips it |
|---|---|---|---|
| ECO-11 | 24 | *"What this country gives, it gives to people who know it, and the knowing is most of what the town sells."* | names no terrain family; would sit unchanged on Forest, Hills, Mountains or Tundra (ruling 35). **Flips to C** if "gives to those who know it" is read as asserting Swamp's impassability. |
| ECO-11 | 37 | *"What {settlement} is worth to anybody else is a separate question from what it is worth to itself, and the two answers are not close."* | the pool's heading forbids restating `strategicValue`; the engine records no "worth to itself", so the asserted divergence is between a typed value and an untyped one. |
| ECO-11 | 38 | *"A stranger with an eye for such things works out what this town is worth holding well before anybody explains it."* | asserts legibility, not a value; sits on every `strategicValue` rung. |
| ECO-11 | 39 | *"The town knows what it sits on, and knows that knowing is not the same as being able to keep it."* | sits on every rung and every defense posture. **Flips to C** if "not being able to keep it" is read as asserting a weak defense. |
| STR-1 | 24 | *"Asking {settlement} a simple question gets a careful one back, because the answer depends on who is asking for whom."* | conduct. **Flips to C** if the carefulness is read as asserting `governanceFractured`. |
| STR-1 | 35 | *"Agreements at {settlement} are being written longer than they used to be written, and the length is the town's answer."* | a drafting custom; no contract length is typed anywhere. |
| STR-1 | 36 | *"{settlement} deals fairly with a stranger and slowly, and the slowness is deliberate."* | conduct; would sit unchanged on `infiltrated` or `politically_fractured`. |
| STR-1 | 42 | *"Conversation in {settlement} stops when it should not and resumes carefully."* | conduct — and the **near-twin of DS-DEF-2 face 78** (*"the talk stops when a stranger sits down"*), which the first count called unfalsifiable. Consistency demands U here. |

### 4b. The units called COUPLED where a second measurer could reasonably flip them
**DS-DEF-2 shipped (10).** `11` *takes the frontier seriously … ordinary rather than anxious* (C:
asserts `monsterThreat=frontier` + standing arrangements; U if read as attitude) · `20` *never needed
to think about what is outside it* (C: asserts `settled`) · `24` *believes it could be held … founded
on something rather than on hope* (C: "something" points at the wall and the garrison; the weakest
coupling in the control) · `35` *knowing its own country is not an answer to a professional army*
(C: militia-only) · `39` *the plan for an army is to not be interesting to one* (C: asserts no force
and no line) · `41` *goes somewhere and takes time, rather than the watch's temper* (C: court process
+ watch bucket) · `50` *the town settles things itself, quickly* (C: asserts no legal machinery) ·
`53` *the people who would have to be paid … know it* (C: the purse) · `59` *already owed, and they
have not forgotten it* (C: wage arrears) · `68` *what it does about a plague is pray and nurse* (C:
the clergy row, and no hospital).
**⇒ If all ten flipped at once — the most adverse reading of the control available — DS-DEF-2 shipped
goes from 0.0% to 12.8%, and the block still does not exceed the rewrite's own 6.5% by way of its
subject; it exceeds it by way of its absences.**

**DS-FTH-3 (6).** `3` *a small faith … a handful of families* · `9` *grown into a contender* · `27`
*legitimate and ordinary … the arrangement people are used to* · `48` *its clergy travel little
because there is nowhere to travel to* · `59` *neither a lender nor a supplicant* · `66` second
sentence (*the shepherd's post under another creed's roof* is invention beyond the field, but the
row's first clause couples on `covert`). Adverse bound **6/75 = 8.0%**.

**DS-POP-1 (4).** `2` `5` `36` `42` — each couples on its first clause only and carries a second
clause that asserts nothing typed. Adverse bound **4/51 = 7.8%**.

**DS-STR-1, called C but close (4).** `39` *there is no visible crisis* (C: asserts the stress is
covert) · `48` *doors are marked* (C: the outbreak's containment) · `54` *answers questions about its
own governance in the past tense* (C: `succession_void`) · `66` *calm in a way a stranger will not be
able to trust* (C: asserting calm asserts a safety state, which the first count's rule couples).

**⇒ Under the most adverse reading available on every block at once, the eight-block sample moves
from 1.9% to 7.5%** — which is the same ceiling the first count's own adverse reading produced
(6.5% → 7.5%). Neither count approaches half under any reading I can construct.

---

## 5. LIMITS

**A. The prescribed comparison cannot set the rewrite-grain ratio, and §3 does not pretend it can.**
Shipped rows are one-per-branch key restatements; rewritten faces are ~24-per-pool and instructed not
to restate. The four 0.0% results are a true finding *about the shipped corpus* and are **not** a
second direct estimate of the 6.5%. Everything in §3 rests on the absence-keying model of §2c — which
*is* measurable corpus-wide — and not on a second count. **The only thing that would settle the
corpus ratio directly is a second block written to face grain.** DEF-1 is next in the queue and will
supply it at no extra cost; this measurement should be re-run against it the day it lands.

**B. The absence-keyed count is a regex over pool names.** `/usr/bin/python3` regex over
`wiring-census.json`'s `pool` strings, matching negation and lack words. It reads DS-DEF-2 at 14/26 =
53.8% against a hand count of 12/21 = 57.1% on the rewritten subset, so it is roughly calibrated *on
this block*. It will **miss** absences named positively (`militia only`, `detention without process`
is caught only by "without"), so the corpus 16.1% is more likely an **undercount** than an overcount —
which is why the adverse row of §3 doubles it.

**C. The thin-key risk is real, unmeasured, and is the one route by which a block could exceed 6.5%.**
DS-POP-1's seventeen pools are one band each; asking twenty-four distinct faces off *"a dozen or so
people left"* gives a writer far less typed material than *"walls and a professional garrison"* does.
Subject matter does not predict the share — **the number of distinct typed facts the key hands the
writer** plausibly does, and the shipped corpus cannot test it because its whole draw-depth range is
2.2–5.65 against the rewrite's 24. §3's outside-case row is the allowance made for it.

**D. The census density proxy the brief asked to be reported beside the count is confounded** (§1
note): 347 of 708 pools are `WIRING-UNRESOLVED` and contribute a `fieldsRead` zero that means
*unresolved*, not *thin*. It is reported because the brief asked for it; it should not be ranked on.

**E. What this count does not cover.** The eight blocks are 111 of 708 pools (15.7%) and 425 of 2,266
shipped units (18.8%). Blocks not sampled include the three largest by unit count after STR-1
(DS-STR-2 96, DS-WAR-5 93, DS-WAR-2 83). `[dm-only]` rows were classified with the rest; the
`*— requires X*` annotations on FTH-3 and FTH-4 rows were read as wiring notes, not as claims.

**F. Where a second measurer would most likely diverge** is the ⭐ key's-own-read rule. It is what
drives the shipped corpus to ~100% coupled, and it is inherited unchanged from the first count
precisely so the two are comparable. A measurer who declined it — who held that restating the key is
not an *assertion of typed state* — would read the shipped corpus far looser and would reach the
opposite disposition in §6. The rule is named here so that disagreement has somewhere to land.

---

## 6. ⭐ THE RECOMMENDATION I WOULD MAKE IF IT WERE MINE

**I would not build the bank, on any desk, and I would record that ruling 41's remaining premise did
not survive measurement.** The ruling's surviving case was that DS-DEF-2 is an unusually dense tab
and that a faith or customs desk would run far higher, so the bank should be built for those desks;
measured, the faith blocks run 0.0% and 0.0%, the daily-life block 0.0%, the population block 0.0%,
and DS-DEF-2 is mid-table on the density proxy rather than first. What DS-DEF-2 *is* first at — of
fifty-five — is absence-keyed pools, at 53.8% against a corpus 16.1%, and absences are the thing that
produces unfalsifiable prose (9.4% against 3.3% inside DS-DEF-2's own rewrite; three of ECO-11's four
in the one pool forbidden to restate its key; three of STR-1's four in the three pools whose condition
has nothing to point at). So the corpus should be expected to run **below** the block that produced
the ruling, at roughly 4.3%, buying a saving of **1.0–3.2% of the remaining writing** — against which
the bank costs a tier tag on about half its rows, a `stress`/`warStatus`/`safetyLabel` page check on
two-thirds of them (the first count's §4 put that at 22 of 33, and `safetyProfile.js:197` prints a
curfew on the very block those faces came from), a deduplication surface the refuter has no seat over,
and the first count's §2 hazard that it concentrates exactly the material correlated with DULL
verdicts and makes it drawable everywhere. **A one-to-three-percent saving is not worth a new
draw-time correctness surface on a product whose owner has said launch will wait for the best
version.** What I would spend the same effort on instead is the finding rather than the ruling: 114
pools corpus-wide are absence-keyed, they carry ~3× the unfalsifiable rate, and they are where the
DULL verdicts cluster — so a **marker-side instrument** ("for an absence-keyed pool, name what the
absence *causes* that the engine records") attacks the defect at its habitat, needs no tier tag, no
page check and no runtime machinery. And if the chair wants the cross-pool saving anyway, it can be
had without the bank: keep the twenty distinct observations as a **writer's brief** — *do not write
these again* — rather than as a drawable pool. That captures the eight duplicate faces, costs one
markdown file, and carries none of the hazard. ⚠ Two things would change this recommendation and
neither is settled: if DEF-1 lands at face grain materially above 6.5% (limit A), or if the thin-key
risk (limit C) proves to run band-only blocks far higher, the arithmetic moves and the ruling should
be re-put. **Both are answerable by re-running this count on DEF-1 the day it lands, and I would gate
any build of the bank on that.**

---

*Measured 2026-09-13 by an Opus measurer for the Opus chair. Dock untouched; no commit made, anywhere.*

---

## APPENDIX — RE-RUNNABLE FROM THIS FILE ALONE

Units are numbered 1–N in document order through each `### DS-…` section of
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` at `f2da5a3ee`, counting only lines matching
`^(\d+)\.\s+`\[tag\]`\s+text`. A unit's pool is the nearest preceding non-empty line when the unit
number is `1`.

```python
import re
lines = open(PATH, encoding='utf-8').read().split('\n')
def rng(bid):
    s = next(i for i,l in enumerate(lines) if l.startswith('### '+bid+':') or l.startswith('### '+bid+' '))
    try:    e = next(i for i,l in enumerate(lines) if i>s and l.startswith('### '))
    except StopIteration: e = len(lines)
    return s, e
s,e = rng('DS-DEF-2'); seg = lines[s:e]; rows = []; pool = None
for i,l in enumerate(seg):
    m = re.match(r'^(\d+)\.\s+`\[([^\]]+)\]`\s+(.*)$', l)
    if m:
        if m.group(1) == '1':
            for j in range(i-1,-1,-1):
                if seg[j].strip(): pool = seg[j].strip().strip('*'); break
        rows.append([pool, m.group(2), m.group(3)])
assert len(rows) == 78 and len({r[0] for r in rows}) == 26   # agrees with wiring-census.json
```

**THE VERDICT SET. Every unit not listed here is COUPLED (417 of 425).**

```
DS-DEF-2  (78 units) : UNFALSIFIABLE = none
DS-FTH-3  (75 units) : UNFALSIFIABLE = none
DS-POP-1  (51 units) : UNFALSIFIABLE = none
DS-ECO-11 (53 units) : UNFALSIFIABLE = 24  37  38  39
DS-STR-1  (96 units) : UNFALSIFIABLE = 24  35  36  42
DS-GEN-1  (50 units) : UNFALSIFIABLE = none
DS-GEN-15 (12 units) : UNFALSIFIABLE = none
DS-FTH-4  (10 units) : UNFALSIFIABLE = none
```

The absence-keyed pool count of §2c is this regex over `wiring-census.json`'s `pool` strings:

```python
NEG = re.compile(r'\b(no|not|none|nothing|nobody|never|without|absent|missing|empty|un\w+ed|'
                 r'lacks?|lacking|zero|unexploited|unaffiliated|uncontested|dormant|covert|'
                 r'thin|weak|critical|void|vacuum|fractured|suppressed)\b', re.I)
# 114 / 708 = 16.1% corpus-wide; DS-DEF-2 14 / 26 = 53.8%, rank 1 of the 55 blocks with >= 5 pools
```
