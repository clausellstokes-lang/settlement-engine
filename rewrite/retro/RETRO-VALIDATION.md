# THE RE-CUT OF 2026-09-12 — THE RETROSPECTIVE VALIDATION RECORD

**Kept at the owner's instruction, 2026-09-12: *"I approve of the call, but I want you to still keep it all in some historical format for fable retro validation."*** This directory is that record. It exists so that a Fable seat, at any later date, can take ANY ONE of the 1,075 judgments made on this day, see exactly what the old law said, what was decided, on what ground, and what the change handed back — and overturn it — **without re-reading the programme and without taking the chair's word for anything.**

The chair that made these judgments was Opus 5. **Not one of them was ratified by a Fable sitting.** That is the reason this record exists, and it is the first thing a reviewer should hold against it.

---

## 1. WHAT WAS DECIDED, AND BY WHOM

**THE OWNER'S WORDS (2026-09-12, verbatim, the whole warrant):**

> "you know what change it. increase the band range and use all of the references to best authors as guiding posts not as laws. the only thing that needs to remain true is the lawfulness. but even then only things that do not refute what the dossier says rather than sticking closely to it. These are plot hooks and descriptions for the author to be immersed. and to change as they see fit... at this point, we are just making flavorless, untaken up prose."

And on the deity doctrine, the same day:

> "dieties can have prose that act according to their alignment position and related to their rank in the hierarchy of that settlement." · "or it would be correct to say that the followers of the diety acted that way."

And on the one question the chair referred up (the game master cannot edit nine of eleven defense blocks; the chair recommended proceeding and treating the edit path as a car):

> "I approve of the call"

**THE CHANGE, in one line.** The test moved from **LICENCE** (a face must be provably backed by the record; anything unbacked FAILS) to **NON-CONTRADICTION** (a face is lawful unless it contradicts the record; silence is PERMISSION). Four floors survive: no self-contradiction across the dossier · no invented magnitude, elapsed course or unobserved field · product scope and the deity doctrine · the engine's own positive model. The full text is brief **ADDENDUM 14** (the re-cut), **15** (the deity carve-out), **16** (the fold received, the floors re-worded and signed, ADDENDUM 15 corrected on measurement).

---

## 2. WHY — AND THE EVIDENCE IS RE-RUNNABLE, NOT ASSERTED

The re-cut was not an aesthetic preference. It followed a measurement of the licence test's own output, at an EQUAL TOKEN BUDGET (type/token ratio falls with length, so an unequal comparison would flatter the shorter text):

| | shipped | after the licence test |
|---|---|---|
| DS-DEF-2, distinct words (≈1,900 tokens) | **519** | **168** |
| DS-DEF-2, content-word types | 489 | 143 |
| DS-DEF-2, mean words per unit | 24.4 | 17.4 |
| DS-DEF-2, two-clause `and` joins | 63 % | 74 % |
| DS-DEF-11 (LANDED, cured), distinct words | 124 over 244 tokens | **125 over 735 tokens** |

The landed block is the sharpest figure in the record: **three times the text, the same vocabulary.**

- `evidence/measure-prose.py` — the audit, re-runnable, with the two exact invocations in its header. Run it. If it does not reproduce `evidence/measurement-output.txt`, this record's premise is broken and everything downstream is open.
- `EXHIBIT-A-prose-before-after.md` — the four pools the chair actually put in front of the owner, unedited, with a fair-reading note stating plainly that several SHIPPED lines were themselves unlawful.

**THE ARGUMENT IN ITS WEAKEST FORM, stated by the chair against itself:** the shipped corpus was *also* breaking the law, so a comparison against it flatters the past. The honest claim is narrower than the numbers look — not that the old prose was lawful, but that the replacement bought lawfulness at a price in vividness **that no law required it to pay**. A reviewer who rejects that narrower claim should reopen the whole re-cut.

---

## 3. WHAT IS IN THIS RECORD

**`verbatim/` — THE LAW AS IT STOOD, UNEDITED.** Nothing here has been touched by the re-cut.
- `BRIEF-pre-recut-ADDENDA-1-to-13.md` — the brief at the moment before ADDENDUM 14 (87 KB): every addendum, the bars W1–W27, the rulings R-i…R-viii′.
- `ENTAILMENT-TABLE.as-ratified.md` (347 KB) · `REFERENT-TABLE.as-ratified.md` (286 KB) — both law tables as ratified on 09-11, in full.
- `tables-13.as-run.txt` · `rulings-DEF2.as-run.txt` — the exact strings every seat of the last run was given.

**`items-*.md` — THE 1,075 JUDGMENTS, ONE ROW EACH.** Per item: the id · **the old law verbatim** · the verdict · the ground (the field that denies a breach, or what the rule policed instead of truth) · **what a writer may now do** · a blank `VALIDATION` cell for the reviewer. Each file closes with **THE STRIKES MOST LIKELY TO BE WRONG** in that slice, with the case against the chair's own decision stated as strongly as its author could put it.

**`fidelity-*.md` — THE ADVERSARIAL CHECK ON THIS RECORD ITSELF.** One adversary per slice, tasked to prove the extraction dropped an item, softened a quotation, flipped a verdict silently, or overstated a new permission. A reviewer starts here: **if the archive is not faithful, the archive is the first thing to fix.**

**`evidence/` — THE WORKING, UNSUMMARISED.** The six convert packets (330 KB), the three adversarial stress packets, the four exemplar packets, `CHAIR-NOTE.md`, `CONTRADICTION-TABLE.md` (the instrument that replaced the bars) and its pre-deity state, the measurement script and its output.

---

## 4. THE PROTOCOL — HOW A FABLE SEAT VALIDATES THIS

1. **Re-run the measurement** (§2). If it does not reproduce, stop and report: the warrant is broken.
2. **Read the fidelity packets** before anything else. A defect there invalidates the slice's rows, not merely one row.
3. **Sample, stratified, and sample the strikes hardest.** Of the five verdicts, **STRUCK is where an error is invisible** — a wrongly KEPT rule announces itself the first time a refuter cites it and a writer objects, but a wrongly STRUCK rule shows up only as a false sentence shipped to a paying game master, months later, with nothing pointing back here. Suggested floor: every item in every `THE STRIKES MOST LIKELY TO BE WRONG` section; twenty per slice besides; **every SPLIT** (a split can lose its surviving half silently).
4. **For each sampled item ask exactly three questions.** (a) Does the `old law verbatim` column match `verbatim/`? (b) Does the ground name a REAL field, at a line that still reads that way — and does the engine still behave so? (c) Does `what a writer may now do` describe a permission that is actually safe, or one that would put a false sentence on the page?
5. **Mark the `VALIDATION` cell** `OK` · `CHALLENGE: <the argument>` · `REVERSE: <the finding it should have been>`.

**WHAT A SUCCESSFUL CHALLENGE DOES.** A reversed STRUCK item returns as a row of `evidence/CONTRADICTION-TABLE.md` with its field named and its floor assigned, and every block landed since this date is re-refuted against that row alone (the block packets under `rewrite/DS-DEF-*/` hold every face verbatim, so a single-row re-refutation is cheap and does not re-open the block). A reversed KEPT item is struck from the table, and the faces it refused are unbanked. **Neither requires re-running the programme**, and that property is the point of keeping the record this way.

---

## 5. THE CHAIR'S OWN LIST OF WHAT IS MOST LIKELY WRONG HERE

Stated first, so a reviewer does not have to find them:

1. **The strike of the always-safe word lists (W15, W24) is the largest single change and the least individually examined.** Over 300 of the 434 strikes come from four rules, and those four were struck substantially on the *aggregate* evidence of §2 rather than item by item. If the re-cut is wrong anywhere, the chair expects it to be wrong here — in a handful of the 31 spellings that were policing a real denial and got swept out with the rest.
2. **Floor 4 was FALSE as the chair first wrote it** ("walls never decay" — `calamityKernel.js` demotes and ruins walls). One floor was already wrong within hours of being written; the other three have had no more scrutiny than that one had.
3. **The instrument did not move with the test.** Of fourteen enumerated page-level collisions, thirteen are invisible to the refuter's current packet. DS-DEF-2 restarts on a partial instrument, knowingly. CAR 8b-W-3 (the refuter's packet) is chartered to land before the second block. **Any block landed before that car is the least-defended work in the programme.**
4. **ADDENDUM 15 was written on an unverified reading of the deity axes and was half wrong** (`lawAxis` is inert to the derived temper; nine conduct shapes are three). It was corrected within the hour by running the code — but it was ratified into the brief before it was run, and the same habit may have touched ADDENDUM 14.
5. **One adversarial finding was itself wrong, and was nearly reported to the owner as a paid-surface bug** (`authoredTemper` is carried; the round trip returns `peacelike`). The adversaries in `evidence/stress-*.md` are not a higher authority than the code, and a reviewer should treat them as claims too.
6. **No Fable sitting ratified any of this.** Every ratification in the programme before 09-12 went through one. These did not.

---

## 6. THE ARCHIVE WAS AUDITED, AND IT FOUND THINGS — added by the chair after the fidelity pass, 2026-09-12

**THE EXTRACTION IS COMPLETE AND EXACT ON COUNT.** 1,075 rows against 1,075 source items, slice by slice: W1-W10 16/16 · W20-W27 20/20 · W11-W19 61/61 · ET-3-4 176/176 · ET-2 235/235 · RT-2-5 567/567. Six adversaries then attacked the archive itself. **All six returned FAITHFUL WITH NOTED DEFECTS. None returned NOT FAITHFUL.** Their strongest negative findings, recorded because they bound the defects: no item is missing, no verdict was silently changed, no quoted law was softened anywhere — *including on the strikes, where a softening would have been most useful to the fold* — and no SPLIT lost its surviving half.

### 6.1 Two defects repeated across every slice. Both are repaired; a reviewer must still know they existed.

1. **⚠ THE PERMISSION COLUMN IS PARTLY THE ARCHIVIST'S, NOT THE FOLD'S.** The protocol tells a reviewer that *"what a writer may NOW do"* is the column to argue with. On a large minority of rows (about 30 % in ET-2) the fold recorded **no permission at all** and the scribe composed one — so a reviewer would have argued with the archivist while believing he argued with the fold. On CONTRADICTION rows the fold usually handed nothing back at all. **Every such cell is now prefixed `[archivist's reading]`.** Where a cell asserted a permission its own preserved ground contradicts, it is corrected and prefixed `[corrected]` — the sharpest instance, found in RT-2-5, *"converts a gap the folder explicitly refused to close into a licence to leak a secret onto a player face"*, and a family of rows that policed nothing (tooling notes, engine-defect notes) were wrongly rendered as *"the bar is struck"* when there was no bar.
2. **⚠ THE FOLD'S OWN NEW FINDINGS WERE NEVER ROWED — AND SOME ARE NEW BARS.** Each convert packet reported contradictions the conversion DISCOVERED that no old rule had stated. The archive rowed none of them. Five of six are missing in W1-W10; three in W11-W19, two of which bear directly on whether "the garrison" may be said off a barracks or a watch. **A writer could have been bound by a bar no row in this archive carried, and no reviewer could have challenged it.** They are now rowed in each file's `APPENDIX — NEW BARS AND FINDINGS ARRIVING WITH THE RE-CUT`, each narrowing row marked `⚠ NEW BAR`.

### 6.2 Three rulings the audit forced, taken by the chair, vetoable

- **R-v IS STRUCK.** ADDENDUM 12 issued eight rulings and the fold converted only six: **R-v and R-vii were never put to the new test at all.** R-v reads *"the reads of a key are one keyed condition, never 'a second fact'"* — a pure licence rule, and the same prohibition the chair struck from the licence card's `may NOT` line hours earlier. It falls with the rest. **A writer may state more than one fact in a unit.**
- **R-vii IS A WIRING ROW, not a writer's law** (*"`NARROWS: gate` stays a wiring ruling for the register car"*). It never bound a writer; it stands unchanged as a register-car row and is out of scope for the writer's test.
- **THE W24 / R-vi COLLISION IS RESOLVED, AND THE FOLD WAS CONSISTENT.** The audit's sharpest cross-slice hazard: W24 (ratified ADDENDUM 13B) cites *"R-vi/W7"* as its authority, and a different slice struck R-vi/W7 — so striking it might silently repeal a clause of ratified law. **It does not.** W24's record-word bar is struck **entire** in the same fold (`CONTRADICTION-TABLE.md` §"no longer a finding"), so authority and dependent fall together. One piece survives and it is a different rule: **F1-24**, a record CITED to a keeper the card prints SOURCE-UNRESOLVED (a toll book with no toll-bar, a muster roll with neither militia nor garrison) — that is about the HOLDER resolving, never about the `[ledger]` stance's vocabulary. The record WORDS are free.

### 6.3 ⛔ THE CITATION RULE FOR ANY VALIDATOR

**Read the grounds in the DOCK at `f2da5a3ee`, not on the ledger branch.** Every file:line in this record was taken in `laneRW-DEF2`. On the ledger branch the numbers drift and two prose-layer files do not exist at HEAD at all. A validator who resolves a citation on the wrong tree will read a true ground as a fabrication. The fidelity pass re-verified the SUBSTANCE of the load-bearing grounds on both trees independently and they hold; three line numbers (`stressGenerator.js` 121 / 168 / 231) match exactly on both.

### 6.4 The five strikes the archive itself nominates first, in one slice alone

The W1-W10 slice argued against its own decisions hard enough to be worth lifting here. A reviewer should start with these: **R-i** (the thread at k=0 — struck citing a mechanical guard that exists only when k ≥ 1, i.e. provably absent in exactly the case the rule was written for, and the residual harm is a dangling referent, which is a floor-1 defect not a matter of taste) · **W1** (possessor binding — struck by reading a holder table as licensing possession, which the ratified entailment law forbids, and ADDENDUM 12 records this construction as the route by which the shipped watch got asserted of a wall) · **R-vi/W7** (see 6.2 — resolved, but on a ground the slice did not have) · **R-viii′'s headcount half** (struck as a cell-overlap rule, when cell overlap is floor 1 in operational dress: two desks narrating one quantity) · **W4** (the construction contract — the one strike that removes an arm which demonstrably CAUGHT a regression, in favour of a pool-grain craft verdict that **does not yet exist and has never run**).
