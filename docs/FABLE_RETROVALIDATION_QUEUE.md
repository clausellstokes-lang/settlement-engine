# FABLE RETROVALIDATION QUEUE (ledger branch — the chair's surface)

**STATUS: RE-ARMED 2026-08-26 by owner order (ODQ §685). The queue was created at §236,
filled through §274, ruled empty at §293–§298 (2026-08-21), and stood idle until the
owner assigned the rest of the arc to the Opus seat. It is now the standing register of
everything a Fable seat owes a second look — and the owner calls that pass, not the
queue.**

## 1 · THE ORDER (owner, in chat, 2026-08-26)

> "everything after grow-fold is to be done with opus 5. everything that is validated
> with opus 5 or not marked as validated with fable, is to be marked for retrovalidation
> with fable at the time of my choosing"

## 2 · WHAT IT CHANGES — three amendments to the §236/§237 protocol

1. **THE SEAT IS ASSIGNED, NOT INHERITED.** §236 armed this queue for *exhaustion* —
   Fable ran out, Opus continued. This is an owner's **assignment**: from GROW-FOLD's
   collection forward, the chair and every lane run **Opus 5** whether or not Fable
   capacity exists. §447's seat model yields to it for the remainder of the arc; Fable's
   standing role becomes **retrovalidation on call**.
2. **THE NET WIDENS: UNMARKED IS OWED.** §237 queued *Opus-chaired rows*. The owner's
   rule queues everything **"validated with opus 5 OR not marked as validated with
   fable."** Silence no longer reads as validation. An act whose seat the record cannot
   name is **owed**, exactly as if it were marked Opus — and the burden sits with the
   act, never with the auditor.
3. **THE OWNER HOLDS THE TRIGGER.** §236 made the sitting *the returning Fable chair's
   first act*. It no longer is. The pass runs **at the owner's choosing**, may be
   **SCOPED** by them (see §5), and a returning Fable seat spends its window on whatever
   the owner asks for instead.

**What it does NOT change:** the owner-gated list (every push · the cutover flag · the
tuning signature · legal · the cull · /code-review ultra · the film specimen), the
released arc, or the quality bar. *Opus-seat work is not lesser work.* "Fable-unvalidated"
is a **provenance fact**, not a quality claim — it says who checked, not how well.

## 3 · THE MARKING LAW (binding on every act from ODQ §685 forward)

- Every ledger entry carries exactly one seat trailer in its commit message:
  `Seat: Fable 5 — validated` or `Seat: Opus 5 — Fable-unvalidated`.
- Every Opus-seat act ALSO lands a row in §6 below **in the same commit**, naming
  specifically what Fable should re-derive — the judgment-dense parts (rulings,
  adoptions, refusals, taste verdicts, architecture decisions, minted constants), never
  the mechanical parts.
- Lane (subagent) work inherits its dispatching chair's seat and is enrolled by that
  chair at collection. A lane never writes this file.
- **STRUCTURAL CURE, IN TWO CHANNELS — and §685.4's own claim was too broad (§687.3):**
  **(1)** `chair-tools/chair-commit.sh` REFUSES a message with no seat trailer (or two),
  and refuses an Opus-seat commit that does not carry this file among its paths — five
  planted controls, each exiting non-zero so an `&&`-chain cannot walk past one. That
  covers the **private-index path**. **(2)** `.husky/commit-msg`, tracked on the branch,
  refuses any commit touching the ledger file without exactly one seat trailer — four
  planted controls including a **scope proof** that a commit touching other paths is NOT
  blocked, because lanes commit constantly and must never be stopped by a chair rule. That
  covers the **plain-`git commit` path**, which §685.4's cure did not: `commit-tree` runs
  no hooks and a chair using ordinary git bypassed the check entirely.
  ⚠ **STILL ESCAPING, NAMED RATHER THAN PAPERED OVER:** the mark is per-COMMIT while the
  obligation is per-ARTIFACT (a document amended in place keeps a stale header); non-commit
  surfaces (the memory estate) cannot be reached by any hook; the seat is **self-declared**
  in both channels; and the queue-coupling predicate is scoped to ledger commits, so an
  Opus commit touching other judgment-bearing paths carries no row. **CHARTERED, not
  assumed** (§687.3): a tests/lint walker asserting hook existence + provenance-map
  totality, and a widened coupling predicate — both are port-era cars with a real
  three-ratchet cost.

## 4 · WHAT A ROW MUST SAY

`§N · <act> · <date> · SEAT: Opus 5` then: **what was judged** · **what Fable
re-derives** · **where the receipts are** (preserve ref / receipt path / instrument) ·
**priority** (P1–P4 per §5) · and, once ruled, **RATIFIED / AMENDED / REVERSED**.

A row that cannot name where its evidence lives is itself a finding — record it as
`EVIDENCE-THIN` and let the pass decide whether the act must simply be redone.

**MECHANICAL ACTS CARRY NO ROW — THEY RIDE (§688.7's corollary).** A handoff refresh, an
index fold, a pointer update or a re-preserved toolkit contains no judgment, and minting a
hollow row for it would dilute the register into noise. Such acts **ride the next
judgment-bearing commit** rather than standing alone; that commit's real row satisfies the
gate for both. The rule is deliberately shaped so that *a standalone Opus commit is,
by construction, one that owed a row* — if you find yourself wanting to bypass the gate for
a mechanical change, the answer is to attach it to the next real act, not to weaken the gate.

## 5 · THE PASS, WHEN THE OWNER CALLS IT

**Method (from §236, kept):** walk the queue top to bottom, **re-derive each judgment
from the primary receipts — never rubber-stamp**, record per-row RATIFIED / AMENDED /
REVERSED in a ledger sitting, and give any AMENDED/REVERSED row's downstream the §61-style
annex re-verification.

**Priority strata (chair's ordering, vetoable — so a partial pass is still coherent):**

| stratum | what it holds | why it ranks here |
|---|---|---|
| **P0 · POISONED DISCHARGES** | any act with UNKNOWN provenance that a *completed* ruling now stands on | Added §687 on the critic's finding, and it outranks taste: a P1 error costs one wrong look, while a P0 error means **work already reported closed is not closed, and nobody will re-open it.** ⛔ Known member: **§287.10 — unattributed and never ruled — was the ground on which §298 REVERSED §242's holdout rulings**, i.e. an unvalidated section overturned a validated one *inside the estate's only completed sitting*. §685.5(v) had already voided two inferences of this shape. **P0 is a search, not a list**: sweep §291–§298 and every "MOOT/VOID/SUPERSEDED under §N" citation whose N is UNKNOWN in the provenance map. Bounded, and it repairs a discharge rather than a row. |
| **P1 · TASTE AND CLOSURE** | judging rounds · blind silhouette/gestalt reads and their keys · dress "look" calls · corpus curation · film pacing | §236.2 names exactly this class as Fable-seat work. It is where the seat plausibly changes the answer, and it compounds — a dress call propagates into every later wave. |
| **P2 · FORECLOSING ARCHITECTURE** | retirements/deletions · vocabulary mints · schema and format shapes · anything that removes an option | Cheap to re-examine now, expensive after the code is gone. |
| **P3 · MINTED CONSTANTS** | every SIGNED_CONSTANTS row minted under an Opus chair | Already second-netted: the **owner's tuning signature** walks this same sheet, last. |
| **P4 · MECHANICAL** | counts · censuses · gate greens · byte/op figures | Executed evidence, re-derivable by any seat. Lowest retrovalidation value; listed for completeness, not for spending a Fable window on. |

**A SCOPED PASS EMPTIES ONLY WHAT IT COVERS.** If the owner calls "P1 only," the ruled
rows close and **everything else stays queued** — this file never reports itself empty on
a partial pass. (Chair's ruling, vetoable: the 2026-08-21 sitting could declare the queue
empty because it covered its whole surface; a scoped pass cannot inherit that sentence.)

## 6 · THE REGISTER

### 6.1 · STRATUM 0 — the historical surface (audited at §685.5)

*Seeded from the §685 provenance audit — six auditors over the ledger by era, one over
the document estate, and a completeness critic. See ODQ §685.5 and §687 for the findings.*

⛔ **THE OWNER HAS GIVEN THIS ORDER FOUR TIMES** (§687.1): **2026-07-31** (creating
docs/FABLE_VALIDATION_QUEUE.md) · **2026-08-17** (§236, creating this file) · **2026-08-23**
(§484, creating the "OPUS REGISTER") · **2026-08-26** (§685, this). Three mechanisms, three
lapses. **That is the argument for enforcing the mark in tooling rather than in discipline
— and for keeping ONE register, this one, instead of a fourth.**

⭐ **THE INSTRUMENT: `docs/PROVENANCE_MAP.tsv`** — one machine-derived row per ledger
section (693), each resolved to OPUS-TEXT · FABLE-TEXT · TRAILER-OPUS · TRAILER-FABLE ·
UNKNOWN by two independent channels. **It is ADDITIVE — history is never rewritten.**
Measured: **474 TRAILER-FABLE · 52 OPUS-TEXT · 37 FABLE-TEXT · 130 UNKNOWN.**
**THE UNKNOWN SURFACE IS FOUR RUNS, NOT 608 SECTIONS: §18–§23 · §287–§290 · §311 ·
§322–§439.** That is what the owner's rule genuinely leaves owed, and it is the register's
true size.

| era | status | measured | P |
|---|---|---|---|
| **§1–§237** | MIXED — and the blanket is refuted | §237.2's "Rows §1-§237 are Fable-validated" is a **blanket declaration, not a finding**, and §236.1 disagrees with it on the boundary (§235 vs §237). The era's own text refutes it: **§70.1 records that seven of the eight design-volume sweeps were OPUS lanes** ("only LG's was Fable"), **§51.2 charters "Phase V — verification (OPUS lanes, Fable-governed)"**, and §109.3 fixes the staffing law that makes the era mixed-seat *by design*. 36 launch-tail commits carry an **Opus 4.8** trailer. Provenance-map UNKNOWN here: **§18–§23**. | P4 for the shipped launch tail; ⛔ **P0/P1 for §22** — see the rows below |
| **⛔ §22 · THE UNIVERSAL STANDING AUTHORIZATION** | **UNKNOWN provenance** | The chair's *operative reading* of the owner's "for anything now and in the future that requires my permission, i give you that freely" — converting every future owner-gate into a chair-executable act, **subject to a carve-out list the chair itself drew**. It is the widest grant in the ledger, **every later chair act stands on it**, the reading is the chair's rather than the owner's words, and its provenance is UNKNOWN. | **P0** |
| **§12.4 · THE LOCKS SPLIT** | **UNKNOWN + CONTRADICTED** | Ruled `locks.institutions` DELETED / `locks.factions` KEPT AND WIRED — a self-reversal on the repair-vs-new-capability line, made inside the 08-10/11 Opus window. ⛔ **docs/FABLE_VALIDATION_QUEUE.md carries an undischarged row on the same subject reaching the OPPOSITE conclusion** ("the `locks` shield STOPPED, not repaired: neither writer-side nor reader-side is available to a lane"). Two records, two answers, one still marked owed. | **P0** |
| **§16 · THE ESPIONAGE REFUSAL** | UNKNOWN provenance | Self-described as "the largest finding of the run": refuses a capability and redefines a product surface on three grounds, dated inside the Opus window, and resting on a measurement a retro-pass can simply re-execute. | P1 |
| **§238–§274** | ✅ **DISCHARGED** | 36 sections properly marked; all 30 entries ruled at §293–§298 (2026-08-21). No action. | — |
| **§275–§290** | **OWED** | §275/§276 are explicitly Fable-chaired. **§287–§290 (2026-08-20) carry no attribution of any kind**, and the sitting's coverage stops at §274. | P2 |
| **§291–§321** | MIXED | 30 of 31 sections carry in-text "chair: FABLE". **§311 is unmarked — and it is the undercity design of record**, not a mechanical row. | P2 |
| **§322–§439** | ⛔ **THE DARK WINDOW** | **~118 sections with NEITHER a text mark NOR a commit trailer** — the seat-model era whose own §447 fixed the seat model it then failed to record. The largest genuinely-owed surface in the program. | **P1/P2 by content** |
| **§440–§684** | **RECOVERED-NOT-MARKED** | Seat recovered as **Fable 5** from commit trailers (492 Fable · 39 Opus · 174 none across the 705 commits touching the ledger file; the instrument validated 26/28 at the §238–§274 boundary). Owner decides at the pass whether recovery discharges the mark. | P3 |
| **the document estate** | REPAIRED IN PART | The *architecture* tier named its seat (DESIGN_SPINE, _COMPLETION, _REG_GROW, _REGISTER_PROGRAM); the **decision, evidence and signature tier did not** — SIGNED_CONSTANTS (the sheet the owner signs LAST), SPINE_DECISION, CONVENTION_AUDIT and OWNER_DOCKET were silent, and SIGNED_CONSTANTS' attribute-by-§-pointer route **fails** (none of its six cited headers carries a seat). All four now carry a recovered-provenance stamp (§686 act). | P2 |
| **⛔ docs/FABLE_VALIDATION_QUEUE.md** | **A SECOND, OLDER QUEUE — LARGELY UNRULED** | The **2026-07-31** asking's own register: 883,766 B, **151 data rows, of which 147 carry no status marker**. Its own sections record a Fable pass over rows through 2026-08-01 and an "OPUS-ERA — FABLE-SURVEYED 2026-08-09 (F-S1)" over parts; **the residue was never ruled**. It holds the §12.4 contradiction above. **Folded in by POINTER, not merged** — the rows stay where they are; this file is the single register that knows about them. | **P1** (it is judgment-dense by construction — its own row law admits only judgment-density items) |
| **non-doc surfaces** | ⛔ **UNRECOVERABLE** | 43 preserve seals name lanes and §§ but **never a seat**; only **11 of 316** lane receipts carry a seat line; INSTRUMENTS.md contains zero seat words. ⚠ **SCOPE HAZARD: `refs/trains/*` (31 refs) and `refs/preserved/*` (3) are a second, older sealed namespace that a sweep scoped to `refs/preserve/` misses entirely.** | P4, but the scope hazard is P2 for any future sweep |

### 6.2 · STRATUM 1 — the forward arc (pre-authored; each wave's chair appends specifics)

*Every wave from GROW-FOLD's collection to the port runs under an Opus chair, so every
one of them is owed. Pre-authoring what Fable re-examines is the same succession service
DESIGN_SPINE_COMPLETION performs for the work itself: the chair executing a wave inherits
the retro-question already framed, and only fills in what it actually decided.*

| wave | what Fable re-derives | P |
|---|---|---|
| **GROW-FOLD** (collection + ruling) | whether the raise-before-growth fold is a *restoration* of the metropolis plot count or a new artifact wearing the old number; C1's re-based evidence row (a correction of a correction — §655.3); the band floor's survival at the new fold order | P2 |
| **DRESS-1** | the ford **as drawn** against hf264's plate (PA.3 pre-ruled by Fable; the execution is not) · the "built band with visible toft ground" look **as drawn** (PA.6) · the wear provisional thresholds · **the gestalt gate's blind KEY** (deciding what a leaf *should* read as is itself a judgment) and every round verdict · the value-hierarchy floor · each declared baseline re-record (i1/i5/i6/i7 — a re-record asserts the new number is the right one) | **P1** |
| **SEATING** | the quota deck's institution mix per tier (truth blended with taste) · the location weights · the maritime category **mint** | P2 |
| **DRESS-2** | **blind silhouette ROUND 4 grading** — the §236.2 class by name · V-B13 placement · the relief grammar · the field mosaic's content · the scenario element-diff **floor** (a chair-set number) | **P1** |
| **REGISTERS/ZOOM** | the reveal ladder's law (what appears at which rung is a taste decision wearing a budget) · per-rung budgets | P2 |
| **REG-7 (print)** | projection choices and the parity verdict | P3 |
| **WORDS** | cartouche language (prose taste) · the enumerated denylist · label-placement doctrine | **P1** |
| **JUDGING** | **the entire wave.** Every round's convictions, cures and closures — under PA.7 the *chair* closes rounds, and that chair is now Opus. The single highest-value retro target in the arc. | **P1** |
| **REG-D** | decline-dress taste · the canon-honesty verdicts (zero invented decay is a judgment about evidence) | **P1** |
| **REG-11 · REG-F0 · REG-F** | the film's beat pacing and restraint calls · the legacy sweep's retire-or-give-data decisions. **NOT owed: the film specimen** — the owner closes it, which outranks any seat. | **P1** |
| **REG-P (the port)** | the retirement list (code deleted is the least reversible act in the arc) · the declared-shifts compilation's **completeness** · each readiness verdict. Second-netted by the owner's cutover review. | **P2** |
| **post-cutover** (COVER · DW · AD · catalog · OSR · parity · soaks) | the taste calls in DW/AD dress · the catalog's content rulings · the OSR mint's anchor · soak certifications | P2/P3 |
| **cross-cutting, every wave** | every SIGNED_CONSTANTS row minted under an Opus chair (P3 — the tuning signature nets these) · every new standing law added to the doctrine (P2) · every memory file written (P4) | — |

### 6.3 · ROWS (append-only; one per Opus-seat act, newest last)

**§685 · The seat directive recorded, the queue re-armed, the marking law made
structural · 2026-08-26 · SEAT: Opus 5.**
*What was judged:* the reading of the owner's order (three amendments in §2), the
boundary placement (§684 is the last Fable-chaired entry), the priority strata in §5, the
scoped-pass ruling, and the audit's stratification of the historical surface.
*What Fable re-derives:* whether §2's three amendments read the owner's sentence
correctly — particularly amendment 2's claim that "not marked" is a **default-owed**
state rather than a request to mark future work only; and whether P1–P4 puts the right
things first.
*Receipts:* this file · ODQ §685 · the audit findings quoted at §685.5.
*Priority:* **P1** (it governs every later row).
*Note on its own provenance:* the seat changed at the owner's command mid-turn. The chair
cannot prove from inside which model executed this entry, so it is marked **Opus** — the
conservative side, because a false *Fable* mark is a false green, while a false *Opus*
mark costs only one re-derivation.

**§686 · GROW-FOLD collected, sealed and ruled · 2026-08-26 · SEAT: Opus 5.**
*What was judged:* **J-GFOLD-2 ratified** — the lane built a *second* cure after
measurement convicted the one its brief named, which is a scope judgment as much as a
technical one; **J-GFOLD-3 ratified** — an instrument amendment landed with its own
planted control; the **+94 % constructor cost ACCEPTED rather than optimised**; the two
wrong-way band outliers **named for tuning rather than cured**; and **C1's magnitude
declared re-based**, closing §655.3.
*What Fable re-derives:* (a) whether accepting 19 % → 34 % of the perf budget was right at
the exact moment DRESS-1 begins laying ink on top, or whether the optimisation belonged
here; (b) whether the frozen-circuit instrument is the right re-basing for C1, or whether
a *share* statistic quietly replaced the claim the charter actually needed; (c) whether
J-GFOLD-2 exceeded its brief in a way that should have escalated rather than proceeded.
*Receipts:* `refs/preserve/map-sandbox-gfold-order` = `56ee43dad` · the lane receipt
`laneGFOLD-receipt.md` · ODQ §686.
*Priority:* **P2** — the host-chooser law and the corrected C1 record both foreclose
options; item (a) is P3.

**§687 · The provenance audit, the map, and two cures to §685's own gate · SEAT: Opus 5.**
*What was judged:* the reading that trailer-recovered provenance is a **third status**
rather than a discharge; the P0 stratum's creation and the claim that §287.10 poisons
§298's discharge; the decision to fold the 07-31 queue in **by pointer rather than merge**;
and the scoping of the commit-msg hook to ledger paths only.
*What Fable re-derives:* whether **PROVENANCE_MAP.tsv's channel logic is sound** — in
particular whether a self-declared `Co-Authored-By` trailer should count as recovery at
all, since both channels are written by the same model whose seat is in question; and
whether P0's membership test ("a completed ruling stands on an UNKNOWN section") is drawn
tightly enough to be a search rather than an excuse.
*Receipts:* `docs/PROVENANCE_MAP.tsv` · ODQ §687 · the 8-agent audit's journal.
*Priority:* **P1** — it sets the register's own shape.

**§688 · DRESS-1 collected, sealed and ruled · SEAT: Opus 5.**
*What was judged:* **all eleven J-DRESS1 calls RATIFIED**, three with consequences —
especially **J-DRESS1-1**, which amends a standing law (no lockfile in the sandbox ⇒
`npm ci` inapplicable ⇒ the collected count is the non-vacuity proof); the ruling that
**round 1's 61.1 % is a cure-and-re-round, not an escalation**; and the three corrections
to the record above the lane.
*What Fable re-derives:* ⛔ **(a) THE TASTE HALF — this is the P1 of the whole arc.** The
gestalt round graded **61.1 % whole-leaf** with the hard clause met; a Fable seat should
re-read the same leaves and say whether the 7 disagreements are ink defects or key
defects, because an Opus chair curing toward its own key is the one loop no control here
can break. **(b)** whether accepting a symlinked `node_modules` on a collected-count proof
is genuinely equivalent to the law it replaces. **(c)** whether the metropolis wrap's
degeneracy should have STOPPED the wave rather than chartered a census.
*Receipts:* `refs/preserve/map-sandbox-dress1-ink` = `ad2b8d399` · `laneDRESS1-receipt.md`
(52,693 B) · ODQ §688.
*Priority:* **P1** on (a), P2 on (b) and (c).

**§709 · SEATING ratified in three gated waves · SEAT: Opus 5.**
*What was judged:* all ten J-SEAT calls RATIFIED; accepting the byte-identity dormancy proof
**on diff scope rather than on a re-render**; accepting "0 wherever the ground exists" as the
right bar; and routing the casing question to the owner rather than letting a lane mint a
visual device without a plate.
*What Fable re-derives:* **(a) THE BYTE-IDENTITY — I verified it structurally, not by
rendering.** W1's diff touches no renderer, which makes the claim consistent; it does not make
it measured. Re-run the render. **(b)** §709.3's honest limit: standing shares track the
prosperity label almost alone, so the variety signal rests mainly on family mix (10 of 12) —
is that enough variety, or is the standing ladder decorative? **(c)** §709.5's consequence:
if a green sandbox gate means materially less than a green build gate, then **every wave I
ratified on this line was ratified against a weaker bar than I believed** — re-read those
ratifications with that in hand.
*Receipts:* ODQ §709 · `refs/preserve/map-sandbox-seating` = `6bc1a5051` · the resume file's
checkpoints 4–8 · the chair's `ls-tree` comparison of the two branches' gate surfaces.
*Priority:* **P1** on (a) and (c).

**§708 · SEATING's recon refutes its charter on five counts · SEAT: Opus 5.**
*What was judged:* resuming mid-lane rather than restarting; accepting all five premise
corrections; the ruling that §697–§701's "fabric at reference parity" is **narrower than the
sentence I wrote around it** (true on density/shape/size, silent on ward coherence); and
declining to call the deity finding a live defect on the lane's say-so.
*What Fable re-derives:* **(a)** §708.3 — zero WARD and zero BLOCK faces on every leaf is a
substrate finding of the first order, and it sat undetected through four waves that all
reported green. What else did those waves' censuses not ask? **(b)** whether my parity
qualification is honest or a face-saving narrowing — read §697–§702 and judge whether the
sentences I wrote were really about density alone. **(c)** the §708.6 restraint: is
"chartered, not alarmed" right for a constitutional law, or is it under-reacting twice in a
row now (§705 was the first)?
*Receipts:* ODQ §708 · `$SP44/SEATING-RESUME.md` (the dead lane's own 9.8 KB checkpoint) ·
the chair's `git cat-file`/`git grep` reads against `master`.
*Priority:* **P1** on (a) and (c).

**§707 · DRESS-FRAME ratified; three of the chair's figures refuted · SEAT: Opus 5.**
*What was judged:* ratifying a wave that corrected three of my published figures; accepting
BOTH refusals (the wall lever and the silhouette) on the lane's measurements; and taking the
INSTRUMENTS.md index act myself at r7.
*What Fable re-derives:* **(a)** §707.1(i) is the load-bearing one — if map figures belong to
a PLATE rather than to the programme, then **every cross-plate comparison in §697–§702 needs
re-reading**, including ones I put in front of the owner. Sweep for others. **(b)** whether
the wall lever was rightly refused: an 18 % shortfall dismissed as sub-perceptual is exactly
the reasoning that lets a real gap survive, and the lane had an interest in not coupling a
paint constant to a signed one. **(c)** whether π/4 = 78.54 % "asserted in the gate to nine
decimals" is a real achievement or a tautology — it is true **by construction**, so a gate
asserting it may be testing arithmetic rather than the drawing.
*Receipts:* ODQ §707 · `refs/preserve/map-sandbox-dressframe` = `a58e19abf` · instruments r7
`1fb0937d1` · `laneDRESSFRAME-receipt.md`.
*Priority:* **P1** on (a) and (c).

**§706 · DRESS-FRAME dispatched; the legacy cure parked on a timing question · SEAT: Opus 5.**
*What was judged:* that DRESS-FRAME proceeds now while the two legacy-wall cure cars stay
chartered-but-unstarted, because their value depends on a fact only the owner holds — whether
the deploy precedes the cutover. If the cutover lands first, the legacy wall retires and the
fix is wasted work on a path scheduled for deletion.
*What Fable re-derives:* whether parking a known, measured, customer-facing defect behind a
visual wave is right, or whether the chair chose the more interesting work and dressed the
choice as a dependency. The honest test: was the timing question genuinely unanswerable
without the owner, or merely unasked?
*Receipts:* ODQ §706 · §705.7's charter · the docket row.
*Priority:* P2.

**§705 · The determination lands PARTLY; my §703.3 trace refuted · SEAT: Opus 5.**
*What was judged:* the split verdict (nothing live, a total defect on the train); routing it
to the owner as informational-critical rather than blocking; chartering the cure as TWO cars;
and the reading that the live-commit identification is high-confidence rather than certain.
*What Fable re-derives:* **(a)** the live-site claim — it rests on master carrying no
town-map files and CI deploying master only; my own probe of the release endpoint returned
the app shell, which corroborates but does not prove. Getting this wrong in the reassuring
direction would be the worst error available here. **(b)** whether "informational, not
blocking" is right for a 100 %-deterministic visible defect sitting on a train the owner is
poised to push. **(c)** §705.2 — I read a manifest as evidence of shipped code; check whether
that same mistake is load-bearing anywhere else in my rulings.
*Receipts:* ODQ §705 · the lane's corpus of 1,680 settlements, its rendered PNGs and its
negative control · `git ls-tree -r master`.
*Priority:* **P1** on (a) and (c).

**§704 · Sequencing: the determination lane pre-empts the largest visual wave · SEAT: Opus 5.**
*What was judged:* that a cheap check which might reveal a **customer-visible** defect takes
precedence over DRESS-FRAME, the largest visual improvement available; and that the check is
scoped to DETERMINE ONLY, with no repair, so that a cure (which would move live output) is
chosen deliberately rather than slid in by a lane that found the problem.
*What Fable re-derives:* whether pre-empting is right, or whether an unproven product defect
should yield to certain visual progress the owner has been asking for; and whether splitting
determination from repair is discipline or delay.
*Receipts:* ODQ §703.3/§703.7 · the lane's brief in its dispatch.
*Priority:* P2.

**§703 · WALL-CURTAIN ratified; the shipped wall may carry the defect · SEAT: Opus 5.**
*What was judged:* ratifying the cure; accepting the lawfulness test; and the reading that
§703.3 is a *possible* live product defect rather than a certain one (traced partway, and
chartered rather than asserted).
*What Fable re-derives:* **(a)** §703.3 — whether the shipped map really shows walls over
water. I stopped short of certainty deliberately, and a wrong answer either way is costly:
over-claiming alarms the owner, under-claiming leaves a defect live. **(b)** §703.4's
consequence — that my "gate green" readings on three prior waves claimed coverage the gate
never had; check whether any of those ratifications should be revisited.
*Receipts:* ODQ §703 · `refs/preserve/map-sandbox-wallcurtain` = `9c7261829` ·
`laneWALLCURTAIN-receipt.md`.
*Priority:* **P1** on both.

**§702 · The paint study; two docket rows STRUCK; DRESS-FRAME chartered · SEAT: Opus 5.**
*What was judged:* that the reference's framing mechanism **dissolves** the page-budget trade
rather than deciding it (so a question left the owner's docket by a chair's reading of a
research dossier); that the rotation signature was the wrong lever and can be struck; and
that framing is a chair repair under §585 rather than an owner signature.
*What Fable re-derives:* ⛔ **(a) THE STRIKES.** A chair removed two items from the owner's
docket on a study's say-so. That is the convenient direction, and §702.1's reasoning — "the
land stays generated and true, it just stops being painted" — deserves testing against
L-REG-33's actual text before it is treated as settled. **(b)** whether re-framing every
plate is genuinely a repair toward a mechanism the owner chose (§656) or a composition change
large enough to need his eye regardless. **(c)** §702.6's unsettled reconciliation — the lane
could not derive our 1.7–6.9 % from our framing constants, so the *structural* claim is sound
while the *magnitude* is not yet closed.
*Receipts:* ODQ §702 · `draft-R-WATABOU-PAINT.md` (53 KB, read log §9) · the docket diff.
*Priority:* **P1** on (a) and (b) — striking an owner's row is the act most worth a second seat.

**§701 · DRESS-FABRIC ratified; its own charter refuted · SEAT: Opus 5.**
*What was judged:* ratifying a wave that refuted the premise it was chartered on; adopting
its recommendation AGAINST its own density lever; withdrawing my §698.2(i) rotation
inference; and routing the page budget, the rotation dial and the aggregation guard to the
owner rather than taking them.
*What Fable re-derives:* **(a)** the reference target **0.431** is a RECONSTRUCTION from
published figures, not a measurement of a reference map — the whole parity finding rests on
it, and the lane rightly declared it a band; test whether the reconstruction is sound.
**(b)** whether "the masses track their own way network, so the alignment is truthful"
is right, or whether truthful-but-monotonous is still a defect worth curing. **(c)** whether
ratifying on a 0.5 % measured win plus three owner questions is the right bar for a wave.
*Receipts:* ODQ §701 · `refs/preserve/map-sandbox-dressfab-grammar` = `f8f6456a0` ·
instruments r6 `02e63b9f4` · `laneDRESSFAB-receipt.md`.
*Priority:* **P1** on (a) — every parity claim in the programme now leans on that number.

**§700 · The arc re-ordered to visuals-first; DRESS-FABRIC dispatched · SEAT: Opus 5.**
*What was judged:* adopting the owner's sequencing and withdrawing the chair's "we would tune
twice" objection as overstated; keeping one guard (tune against the real partition); the
declined/besieged leaf in the tuning set; and re-aiming the charter onto rotation, aggregation
and palette while FORBIDDING the obvious shape fix.
*What Fable re-derives:* **(a)** whether the objection was rightly withdrawn — the chair
conceded a point to the owner and then re-ordered a whole arc on it, which is the agreeable
direction, not necessarily the correct one. **(b)** whether forbidding a car its likeliest
theory is good discipline or a chair over-steering a lane away from a finding it might have
made independently. **(c)** the aggregation band's cost accounting when it lands, since the
identity bijection it must not break is what the zoom ladder and the whole dwellings programme
rest on.
*Receipts:* ODQ §700 · `$SP/briefs/DRESS-FABRIC-BRIEF.md` · §698's parse.
*Priority:* **P1** on (a) — it re-ordered the arc; P2 on (b) and (c).

**§699 · SPINE-3 ratified with corrections, after adversarial verification · SEAT: Opus 5.**
*What was judged:* RATIFY-WITH-CORRECTIONS on 1 CONFIRMED / 3 WEAKER-THAN-STATED verdicts;
that the band boundary held (constructor width unmoved) while the blanket "no band moved"
sentence is struck; that the water cure's **7–9x over-drop** is a new defect rather than a
cure; four corrections including two to rows I had already put on the owner's docket; and
that the four deferrals are genuine owner signatures.
*What Fable re-derives:* **(a)** the ratification itself — three of four verdicts were
"weaker than stated" and a chair still ratified; is that the right threshold, or did
convenience set it? **(b)** §699.3's over-drop reading: is unpublishing 248 u of dry wall to
remove 32 u of wet genuinely a defect, or is it the lawful consequence of publishing only
whole dry fragments? The skeptic asserted the former and I adopted it without independent
measurement. **(c)** §699.8's claim that PA.4's wear was dark corpus-wide — it retroactively
voids an exit I ratified at §688, so it should be re-checked rather than inherited.
*Receipts:* ODQ §699 · `refs/preserve/map-sandbox-spine3-substrate` = `96bcbbbf5` ·
`laneSPINE3-receipt.md` · the four skeptics' journal at `wf_98b37638-77d`.
*Priority:* **P1** on (a) and (c); P2 on (b).

**§698 · §697's diagnosis half-refuted by measurement · SEAT: Opus 5.**
*What was judged:* that our per-building shape complexity (mean 9.25 verts vs the
reference's 4.6) and size variation (1.81x vs 1.72x) are **at or past parity**, so the
remaining divergence is a rotation spread, an aggregation ratio and a palette — parameters,
not architecture; and that this vindicates the owner's visuals-first sequencing.
*What Fable re-derives:* **(a)** the parse itself — subpath splitting on an SVG compound
path is easy to get wrong, and the whole conclusion rests on it; re-run it independently.
**(b)** whether matching the reference's *spread* while being twice as complex per shape is
actually parity or a different look that merely scores the same. **(c)** §698.4's
aggregation lever, which is the one row here with a real cost (byte ceiling at 85 %, and the
identity bijection the zoom ladder and DW depend on).
*Receipts:* ODQ §698 · the parse over `dress1b/render-parchment/city-city-parchment.svg` ·
dissect/mfcg-*-census.json.
*Priority:* **P2** — measurement-backed, but it re-aims a wave and one of its levers is
budget-bound.

**§697 · The reference-gap diagnosis; DRESS-FABRIC chartered · SEAT: Opus 5.**
*What was judged:* that the aesthetic gap to the reference is **packing and variation, not
count**, and that our fabric contradicts the spine's own party-run intent; the charter and
its exits; and the deferral of the cure until the per-member-vs-per-run question is settled.
*What Fable re-derives:* **(a)** the diagnosis itself — it was made from ONE crop of ONE
plate against two reference captures, which is thin evidence for a claim that re-aims the
dress programme. **(b)** whether "the deficit is packing, not count" survives measurement at
other tiers, or holds only at city. **(c)** whether taking the reference's variation band as
a target is emulation or imitation — the clean-room line (§668/§673) permits ideas and
mathematics, and a measured *band* is close to that boundary.
*Receipts:* ODQ §697 · `$SP/round3/crop-fabric.png` · dissect/mfcg-*-census.json.
*Priority:* **P1** — it is a taste-and-direction call that re-aims a whole wave.

**§696 · Round 3 scored; DRESS-1 complete · SEAT: Opus 5.**
*What was judged:* the PASS at 94.4 %, the ruling that an abstention is a miss but not a
wrong-class read, and the reading of the tier bias as systematic rather than noise.
*What Fable re-derives:* **(a)** whether the round-3 method genuinely severed key from
answers, or whether the chair — who held the blindmap and scored the result — could have
tilted it; the raw answers and the map are both preserved, so this is checkable rather than
arguable. **(b)** whether §696.4's decoding is right that four plates are one drawing, since
it would mean every gestalt score in this programme was taken over a thinner corpus than
believed. **(c)** whether a 94.4 % on structural fields should have closed DRESS-1 at all,
given §696.6 concedes the drawing is an underpainting.
*Receipts:* `$SP/round3/` (plates, blindmap, answers, score.json) · ODQ §696.
*Priority:* **P1** on (a) — it is the integrity of the pass itself; P2 on (b) and (c).

**§695 · The gestalt gate RULED under the owner's returned judgment · SEAT: Opus 5.**
⛔ **THE SINGLE MOST IMPORTANT ROW IN THIS QUEUE.**
*What was judged:* the owner said *"I leave everything to your best judgment"*, and the chair
used it to **amend a gate that had just failed twice** — `tier` collected-but-ungraded, `arc`
moved to REG-D. Also judged: the limits of that grant (the by-nature carve-outs do **not**
move), and the safeguard that the pass is **re-earned by a fresh round, never re-scored**.
*What Fable re-derives:* **the whole of it, adversarially.** A chair with authority to amend
a gate amended the gate that was failing, in the direction that makes the failure disappear —
that is the most self-serving act available in this programme, and the chair said so in
§695.2 before making it. Specifically: **(a)** are the three grounds genuinely independent of
the score, or reverse-engineered from it? The fitted-page/non-monotonic argument and the
inter-reader spread are the load-bearing ones — **test them, do not read them**. **(b)** was
moving `arc` to REG-D a principled relocation or a quiet deletion with a forwarding address?
**(c)** did the round-3 safeguard actually hold — was the fresh round genuinely fresh, and
did anyone re-score old data anywhere? **(d)** is §695.7's law ("a gate can fail by asking
too little OR by asking the impossible") sound, or does it license amending any gate that
proves inconvenient?
*Receipts:* ODQ §695 · DESIGN_SPINE_COMPLETION PA.7 as amended · the DRESS-1/1b receipts
carrying both rounds' raw answers · round 3's own receipt when it lands.
*Priority:* **P1**, and it should be the FIRST taste row a Fable seat reads.

**§694 · SPINE-3 dispatched; the scope judgment; the gate-name generalization · SEAT: Opus 5.**
*What was judged:* that the owner's gestalt pause blocks the **taste** arc but not the
**substrate**, so a constructor car runs now; the two hard exclusions (the band's width,
which is the owner's signature, and all dress ink); and the generalization drawn from three
instances in one sitting — *a gate's name is a claim, and the claim must be measured against
the predicate, not the intention.*
*What Fable re-derives:* **(a)** whether running SPINE-3 during an owner-gated pause is
right, or whether an escalation should freeze everything downstream of it — the chair
reasoned from §684.3's precedent, which is a *convenient* precedent for continuing to work,
and that is worth a second look. **(b)** whether the three-instance generalization is sound
or is pattern-matching across cases that only rhyme (a coupling gate, a contract test and a
legend census are not obviously one family).
*Receipts:* ODQ §694 · `$SP/briefs/SPINE3-BRIEF.md` · the two dress receipts' §DEFER lists.
*Priority:* **P2** on (a) — it governs how future escalations behave; P3 on (b).

**§693 · The three parallel sweeps; the P0 verdict; six strikes · SEAT: Opus 5.**
*What was judged:* the verdict that the completed sitting is **partly poisoned rather than
wholesale** (two discharges poisoned, the ratifications weakened not voided); the six
STRIKES, each by measurement, which **shrink** this register — including striking my own
§687.5 provenance claim for §12 and §16; the ruling that §287–§290 get **ruled rather than
resolved** (their provenance is structurally unrecoverable per §291.3); and the 10 %/50 %
scoping.
*What Fable re-derives:* **(a)** whether "weakened, not voided" is the right call on the
ratifications — the sweep tested §298.1(b) for restatement-vs-re-derivation and **ran that
check on nothing else**, so the generalization is one datum wide. **(b)** whether the six
strikes are sound, since striking removes work from your own future queue and is therefore
the self-serving direction. **(c)** the largest unexamined body, **§440–§684 (245 sections)**,
filed P3 on trailer evidence alone with no sweep having read it.
*Receipts:* ODQ §693 · `docs/PROVENANCE_MAP.tsv` · the three sweeps' journal.
*Priority:* **P1** on (a) and (c); P2 on (b).

**§692 · DRESS-1b collected, sealed and ruled; the gestalt gate escalated · SEAT: Opus 5.**
*What was judged:* twelve J-DRESS1B calls RATIFIED; the 30-row classifier mapping accepted
as derived-from-emission; the lane's own improvement (11→12) accepted as **variance and
disclaimed**; two corrections to the chair's own record; and the ruling that the gestalt
question **goes to the owner rather than to a round 3**.
*What Fable re-derives:* ⛔ **(a) THE SAME P1 AS §688, NOW SHARPER — read the eighteen
plates cold and answer the tier question independently.** The lane diagnosed `tier` and
`arc` as KEY defects; that is the self-serving direction for a lane grading its own round,
and the only outside evidence is the inter-reader spread (100 %/100 % structural vs
77.8 %/83.3 % on tier/arc). A second seat's uncontaminated read is the one thing that
settles it, and no control inside the wave can substitute. **(b)** the arguable mapping rows
— `dress-ditch`→wall, `dress-relict`→wall, `dress-quays`→ground, `dress-accessible`→building
— each of which moves what an instrument reads. **(c)** whether ratifying **J-DRESS1B-6** was
right: a squint tie resolved to UNRESOLVED **moves a verdict in the ink's own favour**, and
the lane disclosed exactly that — is disclosure sufficient, or should a tie have failed?
*Receipts:* `refs/preserve/map-sandbox-dress1b-round2` = `6e33a0637` ·
`refs/preserve/reg-instruments-2026-08-27-r5` = `4c3ffe515` · `laneDRESS1B-receipt.md`
(815 lines) · ODQ §692.
*Priority:* **P1** on (a) — it is the arc's central taste question and it is now twice
unresolved; P2 on (b) and (c).

**§690 · The instrument-estate recon, captured after the halt · SEAT: Opus 5.**
*What was judged:* only the decision to **capture rather than act** — the owner halted work
and the classifier ruling §690.3 names is deliberately LEFT UNRULED. Also judged: that the
classifier question now **precedes** DRESS-1b's re-records rather than following them.
*What Fable re-derives:* whether extending `GROUP_ROLE` with the 30 `dress-*` ids is the
right cure or a papering-over — it moves **every recorded i1/i5/i7 pixel baseline**, so it
is a declared shift across the whole instrument estate and deserves a second seat's eyes
before it is taken. Also whether §690.3's hypothesis (that the classifier collision bears
on DRESS-1's 61.1 % gestalt round) is worth testing or is a distraction.
*Receipts:* ODQ §690 · `refs/preserve/reg-instruments-2026-08-26-r4` = `79c02a0ea` ·
`INSTRUMENTS.md`'s own closing section, which prices the cure and assigns it to the chair.
*Priority:* **P2** (it foreclosed nothing — but the ruling it defers is P1 when taken).

**§689 · The competitive-set correction · SEAT: Opus 5.**
*What was judged:* the chair's refinement of the owner's own positioning — that
"convenience" is the entry argument and coherence-from-truth plus time are the moat — and
the ruling that Inkarnate leaves the *competitive* set while staying in the *aesthetic*
one.
*What Fable re-derives:* whether that refinement is right, or whether it is the builder's
instinct re-asserting architecture over experience — **the exact error the owner corrected
on 2026-08-05** ("the things that YOU find great are not what the community finds great").
A Fable seat should check this one against the marketing doctrine, not against the code.
*Receipts:* ODQ §689 · the owner's message, quoted verbatim there.
*Priority:* **P1** — it is a taste-and-positioning call, the class §236.2 names.
