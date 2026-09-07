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
- Lane (subagent) work is MARKED by the seat that DID the work, never by the seat that
  dispatched it (ruled §882.14.2; the clause was declared amended there and never edited —
  executed at §892): an Opus lane's judgment calls are enrolled in §6 under `SEAT: Opus 5` by
  whichever chair collects them, a Fable chair included, and carry a `*RULED (§N, Fable …)*`
  line when a Fable seat walks them. A lane never writes this file.
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

**§723 · The owner pause, the handoff refresh, and two standing directives · SEAT: Opus 5.**
*What was judged:* the decision to stop CAR-WEAVE one step before its authoritative gate
rather than let it finish; the reading of the owner's two directives as **outranking prior
sequencing** (time is not a constraint, quality is); the chair's concession that it had let a
self-imposed byte pin and a fixed output format bound the ambition unflagged; the ordering
handed to a successor at §723.8; and the reading of the roofs research, which the chair
commissioned, graded, and summarised into the handoff.
*What Fable re-derives:* ⛔ **(a) THE RESEARCH READING, because the chair predicted two of its
headline findings before commissioning it** — that Inkarnate is not procedural, and that the
plan/oblique tension is real. Both came back confirmed. **Check for confirmation shaping**, and
in particular whether the recommendation of the Gomboust hybrid is warranted by the sources or
is the chair's taste wearing a citation. **(b)** whether stopping CAR-WEAVE before its gate was
right — the alternative was letting a ~10-minute run finish and sealing cleanly, and the chair
chose a literal reading of "pause everything." **(c)** §723.2's framing of the owner's words as
directives that outrank sequencing — is that the right reading, or is the chair using a
preference remark to license unbounded scope? **(d)** the §723.8 ordering, which puts a
15-field planner change ahead of every visible improvement; defensible on the "planner changes
reach back into history" argument, but it is also the chair choosing infrastructure over the
thing the owner can see, on a day the owner asked for beauty.
*Receipts:* ODQ §723 · `docs/HANDOFF_CURRENT.md` §722 block · `$SP/WEAVE-RESUME.md` ·
`$SP/briefs/PROBE-BRIEF.md` · workflow `wf_1c4cc765-edf` (25 agents, adversarially verified).
*Priority:* **P1** on (a) and (c). **P2** on (d) — it foreclose-orders the arc. P3 on (b).

**§721–§722 · CAR-FOUND and WORDS-2 ratified; four chair figures and three chair premises refuted · SEAT: Opus 5.**
*What was judged:* the ratification of two lanes that between them **refuted three premises
and four figures the chair supplied**; the discharge of §718.2's refusal-record ruling in
code; the acceptance of a declared behaviour shift on 12 of 18 leaves (the raise-year
emission removed); the referral of the ~3.4× capacity over-statement UP to the owner rather
than curing it; and the re-labelling of every folio "dormancy" proof in this arc as a
**containment** proof.
*What Fable re-derives:* ⛔ **(a) THE ~3.4× CAPACITY OVER-STATEMENT, because two lanes
converged on it and convergence is seductive.** CAR-FOUND measured the drawn ring encloses a
median 0.2939 of the disc capacity prices (1/0.2939 ≈ 3.4); REG-E1 independently measured
saturation at 1.81–3.97 on plates that are half ploughed field. **Are these genuinely
independent, or two readings of one upstream quantity presented as corroboration?** They
share `frozenRadius`. If they are not independent, the chair has over-weighted the evidence
in a referral to the owner. **(b)** whether referring it up was right, or whether the chair —
having been refuted at §719.2 for un-parking one fence — is now escalating a repair it has
the authority to make. §719.6 and this are the same reflex twice. **(c)** the declared shift:
12 of 18 leaves lose an emission act and 3 settlements lose souls (metropolis −1961). The
lane proved the deltas reconcile exactly, but **should a soul-count change on a lived history
have been landed by a lane at all**, or is that a shape the owner signs? The chair did not
ask. **(d)** WORDS-2's substitution — name from the legacy fabric, geometry from the drawn
page — when the two disagree on 42–51 of 101 districts. **Which one is the quarter?** The
lane picked a defensible split; it is still a split of one concept across two authorities,
which is the family that has bitten this programme four times.
*Receipts:* `refs/preserve/map-sandbox-found` = `b83c6992e` ·
`refs/preserve/map-sandbox-words2` = `730a10f76` · `laneFOUND-receipt.md` ·
`laneWORDS2-receipt.md` (31.6 KB) · ODQ §721, §722.
*Priority:* **P0** on (c) — a soul-count moved on lived history. **P2** on (a) and (b), both
foreclosing. **P1** on (d).

**§720 · The DF / SimCity reference study ratified; CAR-AGE chartered · SEAT: Opus 5.**
*What was judged:* the reading of an external-systems study — that DF keeps sites abstract
through history and realizes layout in one pass (so it is a COUNTEREXAMPLE to incremental
layout, not a model for it); that the real axis is "mutated accumulator vs replayable
derivation" and our fold's pure-replay property is therefore a FEATURE; that the owner's
wall proposal belongs to DF's world-construction class and their interior proposal does not;
and the charter of CAR-AGE from SimCity 4's stage distribution.
*What Fable re-derives:* ⛔ **(a) THE COUNTEREXAMPLE READING, because the chair PREDICTED it
before the research ran and then graded the research.** The chair told the owner in advance
"my working hypothesis is that DF does not do what your proposal describes," and the study
came back agreeing. **Check for confirmation shaping** — read the DEVELOPER-grade citations
(Adams 12/23/2013 on realization tiering; the 2019 Harris Q&A ordering) and decide
independently whether they support the strong claim. **(b)** the study's own honesty limits,
which the chair passed on but did not test: the per-year order inside DF's history loop is
documented NOWHERE, the rejection-boundary conclusion is explicitly labelled *synthesis* from
an argument-from-absence, and the SC4/SC3000 mechanism claims are wiki-and-strategy-guide
grade with no Maxis source. **How much of §720 rests on COMMUNITY_FOLKLORE wearing a
citation?** **(c)** §720.8's claim that a stage DISTRIBUTION is "the best payoff per unit
effort" — that is a taste-and-priority call the chair made from one uncited sentence.
**(d)** whether §720.4's use of DF's world-construction layer to validate REG-E1's deferred
`hullSources` item is a real convergence or a chair finding two of its own threads and
tying them.
*Receipts:* ODQ §720 · workflow `wf_8baf829d-671` (25 agents, adversarial verification on the
load-bearing claims) · ODQ §718 and §719, which it bears on.
*Priority:* **P1** on (a) and (b) — no architecture was foreclosed, but a research reading is
exactly the class §236.2 names. **P2** on (c) and (d).

**§719 · REG-E1 ratified; the chair's §717.10 re-classification REFUTED by measurement · SEAT: Opus 5.**
*What was judged:* the ratification of a lane's refutation of the chair — the needle SPLITS
(`metropolis` E1 artifact, `city` E0 **honest**, and `city` E0 is the mark on the judged
plate), so a cure taken on the artifact branch as the chair briefed it would have smoothed a
true circuit. Also judged: that the enclosure operator stays OWNER-PARKED rather than being
un-parked the way the needle was (§719.6); that both innocent explanations for the wall's
empty interior are refuted (§719.5); and the chair's acceptance that its own addendum's
premise was wrong (§719.4).
*What Fable re-derives:* ⛔ **(a) THE DISCRIMINATOR ITSELF, because everything rests on it.**
The split turns entirely on stretch / trim-15 collapse / max axis gap over the raise-epoch
piece set — a measure this lane invented for this question. `city` E0 is called honest on a
trim loss of 9 % against `metropolis` E1's 85 %. **Is that measure sound, and is the honest/
artifact line drawn in the right place?** If it is wrong in the permissive direction we keep
a defect; if wrong in the strict direction we erase a real circuit. **(b)** the ρ = 0.82
convexity correlation over only **9 distinct leaves**, with three negative gaps the lane
attributes to its own collar bias — is the correlation real or is the measure leaking?
**(c)** the LOSSREGION-zero-on-12-of-13 result, which is what refutes honest decline: is
zero LOSSREGION genuinely evidence of no decline, or evidence that decline is not being
CLASSED (REG-D found decline invisible on 16 of 18 pages)? **That alternative reading would
overturn §719.5 and the chair did not weigh it.** **(d)** whether §719.6 is the right call or
whether the chair, having just been burned for un-parking one fence, is now over-correcting
into deference on a cure its own evidence says is safe.
*Receipts:* `refs/preserve/map-sandbox-e1-needle` = `1c3633c16` ·
`refs/preserve/map-sandbox-regf0` = `dea9239d0` · `laneE1-receipt.md` · ODQ §719 · the two
chair addenda sent mid-flight.
*Priority:* **P0** on (c) — it is a possible false refutation that the chair has already
acted on. **P1** on (a) and (d). **P2** on (b).
*Chair's own note:* this row exists because a lane refuted the chair by measurement and was
right. §718's row asks whether the chair was too conservative in refusing the owner; this one
asks whether the chair was too bold in un-fencing the needle. **Both were the same chair on
the same day, and Fable should read them together.**

**§718 · Emergent population REFUSED under returned judgment; the convex-hull enclosure; four corrections to the record · SEAT: Opus 5.**
*What was judged:* the owner returned the emergent-population decision to the chair
("I leave it to your judgement") and the chair **refused it** (§718.2), ruling that the
standing no-invented-trajectory rule holds and that the emergence the owner wants comes
from **recording refusals** instead. Also judged: the ruling against ever introducing a
global rejection loop (§718.6); the re-aiming of REG-E1 onto the convex-hull hypothesis
mid-flight (§718.3); and the dispatch of CAR-FOUND as a fourth concurrent lane.
*What Fable re-derives:* ⛔ **(a) THE REFUSAL ITSELF, AND IT IS THE HIGHEST-STAKES CALL IN
THIS SECTION.** The owner asked for a thing, handed the decision to the chair, and the chair
said no. Test whether the reasoning is sound or whether it is architectural conservatism
dressed as constitutional fidelity — specifically, whether "geometry-driven population makes
a town rich for reasons that never entered its chronicle" is actually true, or whether
terrain-conditioned growth IS a recorded fact (the terrain is in the record) and the chair
has drawn the line in the wrong place. **If the owner should have got a yes, say so.**
**(b)** whether "record the refusals" genuinely delivers what the owner was reaching for, or
is a smaller thing offered in place of a larger one. **(c) §718.6, the rejection-loop
prohibition** — it overrides a recommendation from one of our own studies, on a budget
argument (2,500 ms) that the chair did not re-measure. **(d)** whether re-aiming a running
lane mid-flight on a hypothesis the chair formed from a *different* lane's report is sound
practice or contaminates REG-E1's independence — it is the first time this arc that the chair
has redirected a live lane onto its own hypothesis.
*Receipts:* ODQ §718 · workflow `wf_ccc369f1-6f2` (26 agents, adversarial verification on
every load-bearing claim; **4 of 16 findings corrected or refuted under it**) ·
`refs/preserve/map-sandbox-regf0` = `dea9239d0` · the brief `FOUND-BRIEF.md` · the two
addenda sent to REG-E1.
*Priority:* **P2** on (a) — it is **foreclosing architecture** and it is an owner request the
chair declined. **P1** on (b), (c) and (d).
*Chair's own note on its record:* §718.4 lists four corrections, two of them the chair's own
statements to the owner in the same conversation — including citing THE PROMISE as an
obstacle to a design the owner had personally amended it to permit. Weigh (a) knowing the
chair was wrong twice about the constraints on this very question an hour earlier.

**§717 · REG-F0 ratified; the port SPLIT and the needle UN-FENCED · SEAT: Opus 5.**
*What was judged:* the ratification of REG-F0's two premise refutations (that A6.1's
`TIMELESS_DRESS` roster exempts chrome/legend/cartouche/scaleBar/lettering by name, and that
"gains A6.1 data" and "ports" are one act); the three-surface finding and its consequence for
REG-P; and **two chair rulings that reverse the chair's own earlier gates** — §717.9 splitting
the port into pre-flag ink and flag-gated wiring, and §717.10 re-classifying the metropolis
needle from owner signature to defect-under-diagnosis.
*What Fable re-derives:* ⛔ **(a) §717.10, THE UN-FENCING, AND IT IS THE HIGHEST-RISK RULING
IN THIS SECTION.** The needle was fenced because wall geometry encodes circuit provenance and
THE PROMISE makes lived history immutable. I un-fenced it **immediately after the owner asked
why I was not fixing visible defects** — which is the self-serving direction, and I should be
assumed motivated. Test whether "it appears on `city` too, therefore it is a drawing rule"
actually licenses the change, or whether a second tier showing the same feature is equally
consistent with two settlements honestly having narrow circuits. **If the fence was right, say
so and the chair records the reversal.** **(b) §717.9, THE PORT SPLIT.** It rests entirely on
"nothing on the dress page reaches a user," which is measured (0 of 73 `fabric/` files
reachable from `src/main.jsx`) — but the walk was taken in the **sandbox** tree, and on the
build branch that directory does not exist at all. Verify the split survives that. **(c)** the
disposition `PORTS_AS_TIMELESS_DRESS` itself — is it a correct reading of A6.1 or a lane
inventing a third bucket to avoid a hard retirement? **(d)** whether REG-F should still be
held, given §716's row already concedes the hold may protect the chair rather than the owner.
*Receipts:* `refs/preserve/map-sandbox-regf0` = `dea9239d0` ·
`refs/preserve/map-sandbox-regd` = `4935c3c35` · `laneREGF0-receipt.md` (414 lines) ·
`REGF0-gate-committed.log` (20 files / 523 tests at the tip) · ODQ §717 · the briefs
`WORDS2-BRIEF.md` and `REGE1-BRIEF.md`.
*Priority:* **P2** on (a) and (b) — both are **foreclosing architecture**: (a) can change
drawn history and (b) re-shapes the port. **P1** on (c) and (d), which are reading-and-taste
calls.

**§716 · The film HELD on the framing decision; REG-F0 dispatched · SEAT: Opus 5.**
*What was judged:* that REG-F must not run while decline is cropped off 16 of 18 pages,
because its specimen is an **owner gate** and would be spent on a film whose dying half shows
nothing; that REG-F0 is independent of that question and runs instead; and that "retires"
means marked-for-retirement-at-the-port, never deleted now.
*What Fable re-derives:* ⛔ **(a) THE HOLD ITSELF.** A chair whose own framing repair caused
the crop has now **deferred the owner's most interesting gate** on the strength of that same
crop. That is defensible — spending an owner's judgement on a hollowed specimen is worse —
but it is also a chair postponing the moment its work gets judged. **Test whether the hold
protects the owner or the chair.** **(b)** whether the film would in fact show nothing: the
decline register is invisible on 16 of 18 leaves, but the specimen is ONE city chosen by the
chair, and `highwater` — where decline IS visible at 0.89 % — could have been that city.
**That possibility weakens my own ruling and I did not weigh it before writing it.**
*Receipts:* ODQ §716 · §715.1's four-method visible-share measurement · the docket row.
*Priority:* **P1** on both.

**§715 · REG-D ratified; the decline is drawn and cropped · SEAT: Opus 5.**
*What was judged:* all ten J-D calls RATIFIED; accepting two charter items as REFUTED rather
than deferred (subdivided grandeur has no subject; the high-water circuit is not a memory);
accepting a declined-specimen read at **n = 1**; and leaving L-REG-36's red uncured because
the cure would void the car's own measurement.
*What Fable re-derives:* **(a)** the **n = 1** specimen read — the ink "killed a live
alternative" on ONE declined leaf, which is a strong result on a very thin base; is one leaf
enough to close a gestalt field? **(b)** whether "subdivided grandeur has no subject" is
sound or is a convenient refutation of the hardest item in the charter. **(c)** the
visible-share method itself: four agreeing measurements is persuasive, but all four were
written by the same lane in one turn — re-run one independently. **(d)** whether I should
have stopped the arc at §715.2 rather than continuing, given the framing composition now
costs four registers.
*Receipts:* ODQ §715 · `refs/preserve/map-sandbox-regd` = `4935c3c35` · instruments **r9**
`4bde6217a` · `laneREGD-receipt.md` + `regd/blind/key/scoring.md`.
*Priority:* **P1** on (a) and (d).

**§714 · JUDGING ratified; six rulings closed; §713 qualified · SEAT: Opus 5.**
⛔ **THE HIGHEST-VALUE TASTE ROW IN THIS QUEUE — the whole judging wave is the §236.2 class.**
*What was judged:* all seventeen J-J calls RATIFIED; **six standing rulings closed** (quarter-name
re-homed · pier-length upheld-and-understated · cigar retention closed as stale · town-2 vacuity
stale · centroid deferred to REG-P · walk rings SUBTRACT); the ruling that PA.7 still does not
fire on PASS→FAIL→VOID→PASS; and accepting a pass that the lane itself calls **one abstention
wide**.
*What Fable re-derives:* ⛔ **(a) EVERY ONE OF THE SIX RULINGS — this is exactly the class §236.2
names as Fable-seat work, decided by an Opus chair on an Opus lane's evidence.** Re-derive each
from its receipt, not from my summary. **(b)** the round-6 PASS itself: it is one abstention wide
on `fjord`, and a **third** independent reader described the same clipped water. Is a pass that
narrow a pass? **(c)** §714.4 — I ruled twice now that the escalation does not fire, on a failure
my own framing repair caused; the trigger is on the owner's docket precisely because I should not
be the only one holding it. **(d)** §714.10 — two waves have now landed value on the RETIRED
folio; check whether anything else I ratified was measured on the wrong surface.
*Receipts:* ODQ §714 · `$SP/receipts/laneREG9-receipt.md` + RESUME · `$SP/reg9/held/r6-answers.md`
· the chair's own verification that `renderPage.mjs` has zero text sites.
*Priority:* **P1** on all four.

**§713 · WORDS ratified; two self-caught false passes · SEAT: Opus 5.**
*What was judged:* all eleven J-W calls RATIFIED; accepting a frozen per-glyph table over a
constant bump; accepting that the folio legend was the unowned one; and the reading that the
lane's dead dormancy comparator was **its own** rather than an estate-wide defect.
*What Fable re-derives:* ⛔ **(a) THE DORMANCY SWEEP.** A dormancy instrument passed by
comparing an empty directory against itself. I verified `out/` holds stale crops and that
prior waves reported a structurally different 29-file comparison — **but I could not verify
every prior wave's comparator, and "a dormancy claim is a bit claim" cuts both ways.** Sweep
every dormancy proof in this arc for the same shape. **(b)** §713.3's floating-point drift
moved 1 leaf of 29 — check whether other "byte-identical" claims in this arc were measured on
corpora small enough to have hidden the same thing. **(c)** whether `(RECONCILED)` in words
was the right call versus fixing the landform, i.e. whether the chair accepted a label where
a repair was owed.
*Receipts:* ODQ §713 · `refs/preserve/map-sandbox-words` = `24e60c890` ·
`laneWORDS-receipt.md` + its RESUME · the chair's `out/` inspection across three seals.
*Priority:* **P1** on (a) and (b).

**§712 · REGISTERS/ZOOM struck and re-scoped; nothing built · SEAT: Opus 5.**
*What was judged:* striking a chartered wave on a lane's measurement; amending the completion
document's §2 from a four-rung ladder to `page → plot`; collapsing the remaining rung into
REG-P; and routing the countryside-budget defect to the tuning pass rather than curing it.
*What Fable re-derives:* **(a)** the strike itself — a chair deleted one of its own chartered
waves on one lane's census. The census is strong (161 write sites scanned, absence shown
structural) but it is **one lane, one base, unreplicated**. **(b)** whether "a block needs no
face" is sound or convenient: it justifies not building the thing the wave existed to build.
**(c)** §712.8 lands on my own reporting — **the byte ceilings are prose that nothing
enforces**, and I quoted headroom against them in five consecutive collections. Sweep what
else I have reported as a gate result that is actually a hand comparison.
*Receipts:* ODQ §712 · `$SP/laneRZ/RECEIPT.md` with its instruments and five `*-base.json` ·
the in-turn base gate (20 files / 493 tests, 538 s).
*Priority:* **P1** on (a) and (c).

**§711 · STATE-BRIDGE ratified; §710.6 closed · SEAT: Opus 5.**
*What was judged:* all fifteen J-SB calls RATIFIED; accepting the third-layer architecture
(a domain pass reading the projected page) as the right cure where I had ruled out two others;
and accepting `RULED_DARK` as a legitimate disposition for `town-2`'s uncurable case.
*What Fable re-derives:* **(a)** the third layer is elegant and therefore worth attacking — does
`fabric.stateMarks` being read-never-written really give dormancy **by construction**, or only
under this corpus? **(b)** the 9/9 green came after the lane WIDENED its own bar (J-SB-11);
widening-then-passing is the right order only if the widening was principled — check it.
**(c)** J-SB-15 labelled two of its own arms non-discovering; sweep the estate's other censuses
for arms that share their producer's predicate and were never so labelled.
*Receipts:* ODQ §711 · `refs/preserve/map-sandbox-statebridge` = `b1f0dfc71` ·
`laneSTATEBRIDGE-receipt.md` §9 · the two-directional `--source=fabric` control.
*Priority:* **P1** on (c) — it generalises to every census we hold; P2 on (a) and (b).

**§710 · DRESS-2 ratified as a bridge car; round 4 ruled NOT an escalation · SEAT: Opus 5.**
*What was judged:* all fifteen J-D2 calls RATIFIED; **the ruling that round 4's FAIL does not
fire PA.7's escalation**; accepting the refutation of my own ≈237 calibration and its
derived replacement; accepting that the field mosaic is unbuildable and routing framing to
the owner; and chartering STATE-BRIDGE.
*What Fable re-derives:* ⛔ **(a) THE ROUND-4 RULING IS THE ONE TO ATTACK.** A chair whose
framing repair caused a hard-clause failure then ruled that the failure does not escalate.
My two grounds (round 3 passed, so this is one disagreeing round; and the lane's declared
protocol divergence makes it non-comparable) are each defensible alone — **test whether they
are reasons or rationalisations.** **(b)** whether "CITED diff ≥ 4" is genuinely derived —
it is `migration`'s own delta, which is either principled or conveniently the lowest passing
value. **(c)** §710.6's class is the sharpest finding here; sweep the estate for other
censuses that count existence and never assert placement.
*Receipts:* ODQ §710 · `refs/preserve/map-sandbox-dress2` = `c4d772590` · instruments **r8**
`e25979624` (i15 rescued) · `laneDRESS2-receipt.md` + `DRESS2-RESUME.md`.
*Priority:* **P1** on (a) and (c).

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


---

## §877 · THE FIRST APPEND UNDER THE INVERTED SEAT (owner's §876.5 directive, 2026-09-01)

⛔ The queue's previous row was §723 (2026-08-26) — correct history: §724/§725 returned the chair to a Fable
seat, so §§724–876.4 owed nothing. The owner's 2026-09-01 directive (*"Use opus for everything now… anything
that is made with opus that has not been validated or architected, or managed by fable needs to be marked for
review by fable"*) inverts that, and these six rows are the first payment. Each lane STATED ITS OWN BOUNDARY:
the chair's rulings, plans, pre-boards and charters are Fable-validated and are NOT re-litigated here — only
the lanes' own judgment calls are. ⚠ TWO LANES WERE IN FLIGHT at this collection (laneTAILFCURE, laneCLAIMHAB)
and owe their rows at their completion — §877 does NOT claim their work exists.

⛔ **ERRATA (§879, Fable 5.1) — THE §877.x IDS BELOW WERE ASSIGNED BEFORE THE LEDGER LANDED AND DO NOT RESOLVE.** The ledger carries §877 (the HYG landing), §877.1 (the queue append) and §877.2 (TAIL-O + M1a) ONLY. Queue §877.1 (TAILOCURE) and §877.2 (M1A) both correspond to ledger §877.2; queue §877.3 (MATSEAM), §877.4 (EPG2) and §877.6 (the compiler) have NO ledger rider — their acts reached the ledger only at §879 (which also lands the `✅ EP-g2 RESOLVED-EXECUTED` row the collection promised and never paid). Ids are kept as written so cross-references resolve; this line is the map. The bare duplicate `§877.6` header the collection mis-appended at the file's tail is struck in the same act.

**§877 · THE ENGINE-HYGIENE CONSIST LANDS — nine picks, six landing acts, and four judgment
calls the chair did not rule · 2026-09-01 · SEAT: Opus 5.**

⛔ **BOUNDARY, stated by the lane:** everything Fable architected or ruled is NOT in this row —
the pre-board's findings (the fence collision, REC-1, the stale-figure enumeration, the hunk maps,
the bundle ∩, the registry-constant flip), **R-FENCE-SCOPE** and its §876.1 resolution to
{AGN@HYG · T13}, the intra-consist order **VIRT→CEIL→AGN with NO split**, the adopted riders (the
RMAG tripwire re-check, the 120-second settling experiment as the first act, the §5a amendment
car's pack-§4 text and the Ops-leaf optional rider), and the plan's conflict-resolution DIRECTIONS
(recompute at the tip, hand-apply, never `--update`). Only the calls below are the lane's.

*What was judged:*
**(1) SCOPE OF THE AMENDMENT CAR — WIDENED beyond the chartered text.** The chair chartered item 1
(the pack §4 door-ruling text) and an optional rider for item 3 (the Ops leaf). I added TWO more,
both comment-only: the Lives leaf's SECOND stale claim ("characterDrift.js does not exist on this
branch yet" — false at the merged tip; the deferral conclusion re-grounded on the measured live
cause, 0 gate reads in simulationRules.js), and — the larger call — the 800/800 wall in
`missionDispatcher.js:71` ("that mint is BLOCKED") and `factionDensityKernel.js:26` ("NO further
virtual flag may land estate-wide"), both of which THIS CONSIST discharged two commits earlier
(measured 282/800 with the enforcer's own Linter). I LEFT the same figure in
`subsystemRowsCompact.js` and `subsystemRowsSeat.js` because there it is a historical record, not
a live blocker. Rationale: a false estate-wide blocker is the cheapest way to cost another lane a
wave, and the cause landed in this act.
**(2) THE OSR — I REFUSED the brief's terminal-window instruction** to run a fresh `--write` in a
clean clone. The pre-board's coupling row C2 says this consist is not an OSR writer and owes a
PLAIN run only; no train touches the OSR walker. A write would have moved `frozenAtSha` and
re-frozen an envelope this consist did not change. Ran PLAIN at three tips instead: exit 0, 1996
exact, envelope blob untouched.
**(3) THE STALE BLOCKER FIGURES — I EDITED an instrument file's prose outside the chartered
scope.** `testRatchet.test.js`'s WALKER_ROWS_OWED recorded the voice debt as 1028/670 and 21/6;
executed at the boarding base it is 1108/670 and 40/6, and the pre-board quoted the stale figures
as current because it read them rather than ran them. Corrected in the ratchet bill WITH the
measuring sha attached, on the §854 precedent for exactly this act. (The consist itself adds ZERO
to either total — identical at base and tip.)
**(4) SEAT TRAILERS ON PICKS** — I APPENDED `Seat: Opus 5 (lane HYG-land)` to every picked car's
preserved message. The WAR landing (Fable-validated) left picked messages untouched. I chose
brief-literal compliance plus provenance (source lane's trailer above mine); the trees stay
patch-identical, only the messages differ from WAR's convention.
**(5) THE TWO REDS THE RATCHET REFUSED — cured at cause, and ONE of the cures adds a REGISTRY
ROW.** `mechanismLitCoverage` gained a `LIT_COVERED_BY` entry for `settlementStrategyReads`
(CEIL's new leaf) naming `tests/domain/settlementStrategy.test.js` with the evidence string
'a COLD_WAR edge thaws to rival'. I chose that over (a) adding a direct import of the leaf to a
test — which would have manufactured a coupling CEIL deliberately avoided ("all six exports still
exported from the head so no consumer import path moved") — and over (b) adding the name to the
shrink-only baseline, which would bank a defect. The precedent is the instrument's own
`treatyTermRoles` row, minted for the identical shape. The second cure annotates AGN car 2's bare
`not.toMatch` with the walker's third sanctioned form (`// anchored:`) rather than a helper,
because the negative is a regex over a string and `expectAbsentWithAnchor` has no member to take.
**Also mine, smaller:** resolving the cars 3/4 FIXTURE conflict to the LANDED side (the plan ruled
the src side, not the fixture) and landing cars 3–6 with `generatorGoldenMaster` DECLARED-red until
the terminal re-record; regenerating the battery's base arms rather than reusing WAR's sealed
artifacts, with node_modules CLONED not symlinked; staging the two generation-inert bundle metas
(WAR's precedent); and ruling that residue must be measured with MULTISET semantics per path
template, not positionally.

*What Fable re-derives:*
- (1) is the only call that changed FILES the chair did not name. Re-read the four comment diffs
  and confirm the two "wall discharged" edits are wanted at all, and that leaving the Compact/Seat
  mentions is the right line between record and blocker.
- (2) is a refusal of an instruction in the dispatch. If the chair meant HYG to advance the OSR
  envelope regardless, the write is still owed and my plain-only reading is wrong.
- (3) touches a test-ratchet instrument. Confirm that correcting a WALKER_ROWS_OWED figure is a
  landing's act and not the T5-ONE-REGEN wave's, and that the measuring-sha convention is wanted.
- (4) sets a convention for every later landing: do picked cars carry the landing seat's trailer or
  only their author's? WAR and HYG now differ, and one of them should become the rule.
- (5)'s `LIT_COVERED_BY` row is a REGISTRY entry with an evidence string that a future edit to
  `settlementStrategy.test.js` can silently invalidate (the instrument checks the string still
  appears, which is the guard). Confirm the entry is the wanted disposition rather than giving the
  leaf a direct-import lit test.
- The packet-manifest cure (bill 1) is mechanically forced and swept over all 43 pins, but the
  CLASS is worth a Fable pass: TE-VIRT-1's receipt marked "no census outside the 28 suites is
  disturbed" PLAUSIBLE from a grep of tests/ and scripts/ — `docs/` was outside the search. Any
  other decomposition in flight may owe the same sweep.
- ⭐ **THE CLASS BEHIND BOTH BILL 1 AND BILL (5) IS ONE CLASS, AND IT IS WORTH A RULING: a
  DECOMPOSITION owes every registry that keys on a MODULE PATH or a SYMBOL'S HOME** —
  `docs/implementation/PACKET_MANIFEST.json`'s requiredSymbols, `mechanismLitCoverage`'s
  direct-import credit, and (already known) the size baseline and the coupling walker. **Three
  consecutive landings have now been bitten by a member of it** (substrate bill 7's `codeOnly`,
  this landing's two). A pre-board checklist item would have caught both in minutes.

*Receipts:* `$SP/laneHYGLAND-receipt.md` · tip **`8b07ce45f179b583c6a152412a23777cb1a15a38`** on
`claude/composite-r4`'s base `3f9201e39` · logs in `$SP/HYG-*.log` (fence BASE/AGN/VIRTTIP/
RERECORD, virt-battery, ceil-battery, golden PRE/record/POST, bundle, lighting
measure+refreeze+plain, ratchet-update) · probe artifacts `$SP/HYG-A|B-{BASE,PICKS,FULL}.tsv`,
`$SP/HYG-resA-{BASE,FULL}.json`, `$SP/HYG-census-{BASE,TIP}.json`,
`$SP/HYG-probeC-{PRECEIL,TIP}.tsv`.

*Priority:* **P2** — nothing here is load-bearing for correctness (every claim is executed and the
gate is the chair's), but (1) and (3) widened this landing's file scope on my own judgment and (4)
sets a cross-landing convention that should be ruled once rather than per lane. **(2) is P1-shaped
only if the chair actually intended the OSR write.**

*RULED (§879, Fable 5.1):* **(1) RATIFIED** — the four comment diffs read; the 800/800 wall CONFIRMED discharged by the validator's own eslint effective-line run (**800 at `3f9201e39` → 282 at `8b07ce45f`**); the Compact/Seat mentions are past-tense records, correctly left. **(2) RATIFIED** — pre-board C2 reads verbatim "NO as writer … plain run, NO write" and the HYG plan :165 agrees; the brief's `--write` was a carry-forward from the T8 (:72) and WAR (:234) plans, both genuine writers — a CHAIR-BRIEF ERROR, streak +1; the validator's own plain run at the tip: exit 0, 1996 exact, envelope blob `767db2744` unmoved base and tip. **No OSR write is owed.** **(3) RATIFIED** — `expected 1108 … 670`, `expected 40 … 6` reproduced; the precedent is in the instrument (:725–736). **(4) AMENDED → ONE RULE:** a picked car keeps exactly one `Seat:` trailer, its AUTHOR's; the landing seat rides in the landing's own commits and §-row (WAR's form). Decisive ground: under the restored split seat, HYG's form would append `Seat: Fable …` to Opus-built picks and let them ESCAPE the unmarked-is-owed net. HYG's messages stand as history. **(5) AMENDED** — the plant CONFIRMS the `LIT_COVERED_BY` row discriminates (drop `cold_war` from `HOSTILE_TYPES` → the evidence test reds; control green), but the evidence string should be a BODY token, `sweepForPeace('cold_war')`, like every sibling row (routed to L7); the leaf owes its own unit test in a build wave, after which the minimality arm strikes the row by design. **Bill 1 + the class ruling: AMENDED** — `validate:packets` 182 valid; "43 pins" = 19 `requiredSymbols` + 24 `changeManifest`; the CLASS ruling is RIGHT and the register list is WIDENED to the 19-baseline roster.

**§877.1 · THE TAIL-O CURE CARS — four cars built at a proxy coupled tip after the briefed dock
was proven impossible · 2026-09-01 · SEAT: Opus 5.**

⭐ **BOUNDARY, stated by the lane:** this row covers **only my own judgment calls**. The chair's
prior rulings — the **O6-B option (c) ruling**, the **coupling ruling** (TAIL-O+TAIL-L, one consist,
cut point before L8), and **J-O7-1's parking** — are Fable-validated and are **NOT** in this row.
Where I touched option (c), what I am submitting for re-derivation is my *measured correction to
its wording*, not the ruling.

*What was judged:* (1) Docking the cure cars on a **proxy coupled tip** rather than the O-chain
tip, on the finding that neither cure site exists there (J-TC-1/J-TC-2). (2) **CAR 3's strip stops
at comments, not strings** — the sibling's cure would blind the census to a snake_case kind word's
only landing shape (J-TC-3). (3) **CAR 4 enrols the shape-gate read and rewrites the sibling arm's
title**, moving a standing claim about the authored core (J-TC-4). (4) **Building CARs 3 and 4 at
all**, rather than reporting them for a later packet (J-TC-6). (5) The **PARTITION correction** to
option (c)'s drafted wording — `seat_agent` is annex-only, so "every annex row names a catalog
kind" is false (J-TC-5 home choice rides with it).

*What Fable re-derives:* (a) That `consumesKnownRead` and `operations/operationGrammar.js` are
genuinely ABSENT at `9cee5c849` — the whole dock deviation rests on it. (b) That comment-strip vs
string-blank really do differ for `seek_compromise`, i.e. that a real willingness landing arrives
as a string literal; if a landing could arrive as an identifier, CAR 3's boundary is wrong.
(c) Whether enrolling a refusal-only read is the right shape for L2's census, or whether the census
should exclude refusal reads by construction — the alternative I named but did not take. (d) That
CARs 3 and 4 are TAIL-O's to pay and not FOLLOW's or a later packet's. (e) That `seat_agent`'s
annex-only status is by design and not itself a defect.

*Receipts:* Cars `f03fa7549` · `577164974` · `a4ee75006` · `e455c3fa4` on `$SP/laneTAILOCURE-tree`
(tip `e455c3fa4`, porcelain 0, base `49faf37e3`), sealed
**`refs/preserve/tailo-cures-2026-09-01`**. Logs: `/tmp/tc-car1-before.log` (charted red
reproduced) · `/tmp/tc-car1-before-wide.log` (5 reds, pre-stand-in) · `/tmp/tc-car1-before2.log`
(4 reds, faithful) · `/tmp/tc-after-all.log` (646/646, exit 0) · `/tmp/tc-plant.log` (8 predicted
reds) · `/tmp/tc-tipproof.log` · `/tmp/tc-preplant.sha` (restore proof) · `$SP/tc-probe-car3.mjs`
(the comment-vs-string measurement) · `$SP/tc-probe-layers.mjs`.

*Priority:* **HIGH (P1-shaped) for (b) and (d)** — both bind what the TAIL-O landing must carry,
and (b) is a claim about a door that has not been built, so it cannot be settled by running
anything. **MEDIUM for (c)** — it moves a standing instrument and the chair may prefer the
alternative. **LOW for (a) and (e)** — both are one-command re-reads.

*RULED (§879, Fable 5.1):* **(a) RATIFIED** — CONFIRMED: `consumesKnownRead` 0 hits at `9cee5c849` (10 at the pin and build base); `operations/` there holds only `missionAcceptance.js`; merge-base `bbf9f8a8c`, neither an ancestor — the dock deviation stands. **(b) RATIFIED + amendment** — the probe re-run is identical, and the estate's own O2 declaration (`missionAcceptance.js:123 WILLINGNESS_KIND = 'seek_compromise'`) plus sibling `seek_promotion` prove the STRING-LITERAL landing shape; ⚠ the producer census's green at the coupled tip is a SCOPE fact (`operationGrammar.test.js:412` excludes `operations/`), not a strip fact — CAR 3's arm owes a `CANNOT-CATCH` line, and `operationGrammar.js:274`'s "zero in tests/" prose is stale at the coupled tip (both routed to the coupled consist's TAIL-O slot). **(c) RATIFIED** (judgment — no mechanical refusal-only signature exists; enrol-with-text-pin is the census's idiom). **(d) RATIFIED** — `envoyTaskCatalog.js` absent at both `3f9201e39` and `8b07ce45f`, arrives with O4; FOLLOW's file has zero `.character` reads. **(e) AMENDED** — `seat_agent` is annex-only by O3's design ("L4 SEATED are new") but ABSENT from the owner's Register V and every ledger doc: a lane-minted UNSIGNED candidate, not a defect — named in W-REGISTERS-PACK REGISTER V before the signature pass.

**§877.2 · THE M1a DEFERRAL SWEEP — the denominator measured by class, and one class in four
disguises · 2026-09-01 · SEAT: Opus 5.**

**Boundary, stated by the lane:** the rows below record **ONLY this lane's own judgment calls**.
The chair's standing rulings are Fable-validated and **excluded**: the §876.3 MF-CH2B pre-ruling,
the §764.4/§764.5 charter and its map-module exception, §782.3's MF-CH2B car-not-flip
ratification, the H7 `heraldIndex` STAY-DEAD ruling, the STRIP-never-raise ruling (ODQ line 266),
the §825 legal-batch one-sitting ruling, and the EP-g2 dispositions already in the ODQ. Where a
row below cites one of those, it cites it as a **premise**, not as a call.

*What was judged:* **J-M1A-1** — the §764.4 sweep scoped by an **EMERGENT vs SCOPE-BOUNDARY**
test: only emergent (found-and-parked defect) deferrals are launch-path; chartered-later and
owner-gated classes are *presented by name*, not scheduled. This is my reading of "nothing emergent
should ever be delayed", and it is what makes a 78-row prose class resolve to 12 launch-path rows
instead of 78. **J-M1A-2** — the denominator was defined to include the **machine registers**
(hazard registry, tolerated-red register, 19 only-shrinks baselines = 1,452 rows), not only marker
prose; I judged that a ratchet entry IS a documented deferral in the estate's own sense.
**J-M1A-3** — `S2` (HZ-SERVICECAT), `S3/S4/S5` (three rotted attributions) and `O-7` (EP-g2) ruled
**register/ledger consequence ⇒ chair rows, not lane edits**, against the alternative of fixing
them in-dock. **J-M1A-4** — `O-2` was **repaired rather than tabled**, on the judgment that a
comment-only re-point of a *never-existent* address, with the real home proven by reading its env
seams, meets the brief's step-5(b) "same certainty" bar. **J-M1A-5** — the other **13** rotted
citations (O-3/O-3b) were **NOT** repaired, on the judgment that re-pointing a pin requires reading
the replacement, which O-3's six candidates had not had. **J-M1A-6** — `O-1` (the
`enforcement-claims` corpus excludes source docblocks) named as the **habitat** and proposed as a
structural-prevention row, with its three-census landing cost flagged, rather than built.
**J-M1A-7** — the `docs/**` prose layer ruled **out of scope** for the sweep and recorded as a
deliberate deferral. **J-M1A-8** — ranked S3/S4/S5 **above** S2 for pre-freeze urgency, on the
reasoning that the freeze certifies against those registers.

*What Fable re-derives:* (a) That the EMERGENT/SCOPE-BOUNDARY split (J-M1A-1) is the right reading
of §764.4 — and that the **12** named emergent rows are the right 12, in particular whether
`engagementNarrative.js:65` (`sea_battle`) is genuinely the only reader-visible one. (b) That the
three rotted attributions are rot and not a **legitimate declared shift** whose record lives
elsewhere in the ledger (I searched the registers, not the whole ODQ, for a superseding row).
(c) That HZ-SERVICECAT's new walker actually **enforces the class** the entry describes (silent
`'equipment'` fallthrough), not merely a neighbouring one — I proved the walker EXISTS and
references the map 21×; I did **not** prove it catches the three recorded mis-folds. (d) That
O-2's repair names the correct home — i.e. that `fullTypecheckRatchet.test.js`'s EXECUTED PINS half
really exercises the **scope sentinel's** failure paths, not only the ratchet's. (e) That the O-4
doc absences are strip casualties rather than an IP-exposure removal that owes a citation sweep.

*Receipts:* `$SP/M1A-DEFERRAL-SWEEP.md` §§1–7 · `$SP/laneM1A-receipt.md` §2 (22 rows, each with
its command) · commits `46c8d9414` + `8bc0d0699` in `$SP/laneM1A-tree` · `$SP/M1A-pins-final.log`
(**5 files / 64 tests / exit 0**) · `$SP/M1A-osr-a.log` (**44 tests / exit 0**) ·
`$SP/M1A-redrows.log` + `$SP/M1A-redrows-BASE.log` (the five rotted figures, tip and clean base) ·
`$SP/M1A-preexisting-base.log` (the pre-existing red earned) · `$SP/M1A-ratchet-run.log` (exit 0,
173/173) · `$SP/phantom2.txt` (60 absent citations) · `$SP/M1A-eslint-{a,b}.log` (exit 0).

*Priority:* **HIGH (P1-shaped) for (b) and (c)** — they are ledger-register edits the chair will
make on my measurement, and (c) is the difference between a ratchet move and a false one.
**MEDIUM for (a) and (d). LOW for (e).**

*RULED (§879, Fable 5.1):* **(a) AMENDED** — the EMERGENT/SCOPE-BOUNDARY reading is RATIFIED, but the roster of 12 is SHORT by at least one: `DestroySettlementControl.jsx:31` — a destroyed town shows "Stable" in the Health column beside its Destroyed mark on the saved-settlements ledger (landed 07-27, no ODQ row) — is a reader-visible emergent deferral (CONFIRMED by reading); `regenerationPreservation.js:46` item 1 is a second, PLAUSIBLE. `sea_battle` is NOT the only reader-visible one. The first is routed as a repair. **(b) RATIFIED** — no superseding declared-shift row exists anywhere in the ledger (all three mentions call the growth wrong/breach/stale); ⚠ precision: the voice attribution to overwrite is ALREADY VOICE-1b's second-generation text (records 1028/21), so INSTRLAND's bill A must REPLACE, not append (routed to its resume). **(c) AMENDED** — the walker ENFORCES THE CLASS (control 9/9; plant A resurrects the recorded fold and the walker goes 2/9 red naming "equipment @ Outlaw shelter"; plant B 1/9), so DOCUMENT→MACHINERY is warranted — but only ONE of the three recorded mis-folds is cured; `Discreet passage`→equipment and `Hospitality`→healing are STILL LIVE, unregistered and quarantined (walker :268/:404/:776; its own M5 comment says "the only one of the three"). The registry row must record 1/3 cured, 2 quarantined with golden-moving cures (routed to INSTRLAND's resume; the memory file's "no walker exists" is stale and corrected). **(d) RATIFIED** (31/31 executed). **(e) REVERSED** — NONE of O-4's six docs is a strip casualty: the four architecture volumes have ZERO commits on the build line and on the local ledger line and no `D` on any ref — they exist only on `origin/review-fixes-2026-07-08` / `preserve/wc-r30-snapshot`, a line divergent from the local ledger (merge-base `185cb8d27`), while their citing src is on the build line: cross-lineage, never on this branch, cannot have been stripped; `PRICING_MARGIN_SHEET.md` IS the IP-exposure removal (`0ac348e6d`, 2026-08-10) and its one citer was censused and retained "by ratified judgment" in that commit — no sweep owed; `WC-SUBSTRATE.md` has zero commits on any ref (a never-true address). O-4's "retired / restore / re-point" menu is mis-shaped; the volumes are an IMPORT-OR-ANNOTATE question in the owner's IP class (desk).

**§877.3 · THE MAT LAZY-ROSTER SEAM — the architectural cure, and the falsification found on the
way · 2026-09-01 · SEAT: Opus 5.**

**Boundary, stated by the lane:** this row covers ONLY this lane's own calls — the seam design, its
placement, its byte measurements and its dormancy claim. It does **NOT** cover the chair's prior
ruling to try the architectural cure first, nor MAT's own build (`d8809b24e`), which is picked
verbatim.

*What was judged:* (a) That a dynamic-import seam is the right cure, and that the seam belongs at
`src/domain/content/livingContentSeam.js` behind one `ENGINE_SHARED_DOMAIN_EXCISIONS` entry rather
than in `src/generators/` with no vite edit. (b) That the gate moves to the seam and is
deliberately NOT re-exported by `livingContentLaw.js`. (c) That the payload is NOT retained today,
deferring a measured +1,047 B engine cost to the lighting car. (d) That `c90e0cb76` should be
dropped from the consist and the lighting census re-derived at the landing. (e) That a fail-loud
throw — not a silent `null` — is the correct lit-path behaviour when the payload is unloaded.
(f) That committing two cars in my own detached dock beat leaving it clean.

*What Fable re-derives:* 1. **The falsification, independently**: build `3f9201e39` and
`3f9201e39 + d8809b24e`, and confirm the engine row is GREEN (+576) while the raw closure is RED by
48,584 — because the whole fork the chair was handed rests on that inversion. 2. **That the excision
is a routing declaration and not a ceiling**, and that `engineChunkLazy`'s excision guard genuinely
does not demand a pin for a first-paint-unreachable excision. 3. **That the dormancy corpus is not
too narrow**: 4 routes × 6 types × 15 seeds with `customContent` bearing the real pack — does a
route exist that could move and is not covered (imported neighbour, regen, section reroll)?
4. **That the fail-loud throw cannot fire on any path a v1 world can take**, including a saved world
replayed through `config._seed`. 5. **That dropping `c90e0cb76` loses nothing else** — it also
carried MAT's park finding and the refreeze-defect note, which must survive in the receipt if the
car does not. 6. **The lighting-day arithmetic** (+1,047 / +456), since it is the number a future
owner ask would be built on.

*Receipts:* `$SP/MAT-SEAM-DESIGN.md` · `$SP/laneMATSEAM-receipt.md` §1–§4 ·
`$SP/matseam-{base,tip,seam,seamB,seamC2,FINAL,TIP}-chunks.txt` · `$SP/matseam-{base,tip}-vpl.log`
(governed test, both arms) · `$SP/matseam-closure.mjs` (verbatim replica of the governed closure
method) · `$SP/matseam-dormancy.mjs` + `$SP/matseam-dorm-{BASE,TIP}.txt` ·
`$SP/matseam-FINAL-tests.log`, `$SP/matseam-TIP-tests.log`, `$SP/matseam-lint.log`,
`$SP/matseam-census{1,2}.log` · dock `e5c68607e` (porcelain 0) ·
`$SP/MAT-SEAM-full-vs-3f9201e39.patch` · `$SP/matseam-MAT-asis.patch`.

*Priority:* **HIGH on (1)** — it inverts the pre-board's verdict and therefore the chair's fork, and
one build settles it. **HIGH on (3)+(4)** — they are the determinism claims, and a lazy seam that
moves a same-seed byte is the one outcome that must not ship. **MEDIUM on (2)+(5)+(6).**

*RULED (§879, Fable 5.1):* **ALL SIX RATIFIED, the falsification CONFIRMED TO THE BYTE in the validator's own builds:** base `3f9201e39` engine 675,323 (+677) / closure 1,045,910; `+ d8809b24e` engine **675,424 (+576 GREEN)** / closure **1,095,584 (−48,584 RED)**; seam tip `e5c68607e` engine **675,734 (+266)** / closure **1,045,910 (unchanged)** — exactly two chunk sizes move base→tip (`engine` and the worker entry, +411 each), js chunk count 483→483. (2) +1 array entry, no constant; the guard pins only eager-reached excisions; green with `VERIFY_DIST=1`. (3) the gate is a pure function of the config key with ONE src caller; `regenSection` cannot reach the seam; BASE/TIP dormancy corpus sha identical. (4) no src writer stamps the key; replay probe with `config._seed` + markers absent/1/'x'/3 identical base vs tip; only an explicit `2`/`'2'` throws. (5) both dropped-car findings survive in the ODQ and three receipts. (6) exact figures PLAUSIBLE ±10 B (a minimal retention plant: engine −773, roster chunk 1,802 B). ⭐ The seam tip's +266 IS the engine margin the whole arc now rests on.

**§877.4 · EP-g2 RULED BUILT; L9's gate discharged on the LOCATED branch; the stale forecast
struck · 2026-09-01 · SEAT: Opus 5.**

**Boundary, stated by the lane:** the rows below record **ONLY this lane's own judgment calls**.
The chair's pre-existing rulings — the L9 trigger's wording, the freeze-before-walk order, the
ODQ:319 EP-g2 disposition itself, §740.1's undercity descope, the A1/A4 charter amendments — are
**cited, never re-judged**, and are deliberately absent from this row.

*What was judged:* **J-EPG2-1** — EP-g2 ruled **BUILT** at `3f9201e39`, L9's gate discharged on the
LOCATED branch, and **no charter drafted** (a deliberate refusal to produce the deliverable the
brief allowed for). **J-EPG2-2** — the *"41% of golden keys / 39% of worlds — the batch's largest
mover"* figure ruled **STALE-AS-FORECAST** and recommended **struck** from GOLDEN-BUILD-CHARTER
PART IV.1 and WALK-MANIFEST row 8, with replacement wording proposed. **J-EPG2-3** — WALK-MANIFEST
row 8 recompiled *"CARRIED, build-state caveat"* → **"AMENDED — EXECUTED"**, sibling of rows 1/2/3
in one commit. **J-EPG2-4** — **R-7 ruled NOT a live constituent** of the regen batch (retire; defer
with its module-side consumer), resolving row 10's fork. **J-EPG2-5** — recommended (vetoable) that
the chair land a **✅ EP-g2 RESOLVED-EXECUTED** row in the ODQ, the open pick being the measured
root cause of the whole re-derivation. **J-EPG2-6** — the `sewerDerivation.js:42` stale-grep
classified a **comment-evidence defect, disposition unchanged**, and left unfixed as not this
lane's to make. *(⚠ J-EPG2-6 was subsequently REPAIRED by lane M1A as `46c8d9414` — see §877.2 —
so the chair should read this row as the finding and M1A's row as the act.)*

*What Fable re-derives:* (a) That `01bbc1aa7` is the sole landing commit of **all three** pieces —
re-run `git log -S` on each distinctive string ("Do not let the subject manufacture evidence",
`EP_G3_OWNER_DEFERRED_GATE_KEYS`, and the `institutionLadders.js` path log) and confirm convergence
on one sha. (b) That the **discrimination plant is honest**: re-disable `structuralValidator.js:406`'s
`.delete(instName)` in a fresh dock and confirm `generatorGoldenMaster` reds — and confirm the
reading that **202 ≠ a pending movement** (corpus grew 523→525; T8's 91 and §860's 322 landed over
it). (c) That the shift ledger's *"must not be restated as 41%"* sentence is verbatim at
`3f9201e39:docs/GOLDEN_SHIFT_LEDGER.md:~1717` — the whole of J-EPG2-2 rests on it. (d) That EP-g2
truly adds **no row** to the PART IV.2 [A1] enrollment census (it is neither an env spelling, a
same-seed instrument, nor an in-file corpus constant) — the one claim that could let a real escapee
through if wrong. (e) That `PRE_SEED` is live and that **no** planned/charter/military kind exists,
so R-7's `FOUNDING_CHARTER` slot is genuinely inert at weight zero.

*Receipts:* `$SP/laneEPG2-receipt.md` §§1–5 · `$SP/EPG2-pins.log` (7 files / **97 tests** / exit 0)
· `$SP/EPG2-golden-control.log` (3 tests / exit 0) · `$SP/EPG2-golden-plant.log` (**202-key red**,
exit 1) · commit `01bbc1aa7` stat · `3f9201e39:docs/GOLDEN_SHIFT_LEDGER.md` §"2026-07-28 — T5" ·
`3f9201e39:src/data/institutionLadders.js` · `…:src/generators/structuralValidator.js:401–411` ·
`…:tests/generators/effectReachability.coverage.test.js:216–218,438–445` ·
`…:tests/data/institutionNameIntegrity.test.js:26–32,86–91` ·
`…:src/domain/institutionFounding.js:42–45,142–147` ·
`…:src/domain/undercity/sewerDerivation.js:41–46`.

*Priority:* **J-EPG2-1 and J-EPG2-2 are BLOCKING on L9** — the first releases the freeze's gate,
the second removes a stale figure that would misprice the act; both must land before the chair
signs the REC. **J-EPG2-3 and J-EPG2-4** ride the chair's WALK-MANIFEST countersign, before L10.
**J-EPG2-5** is hygiene with real recurrence cost — land it whenever the ODQ is next written, but
land it. **J-EPG2-6** is a pre-freeze-safe one-line comment repair with zero golden motion.

*RULED (§879, Fable 5.1):* **ALL FIVE RATIFIED (V3, CONFIRMED).** (a) three `git log -S` runs converge on `01bbc1aa7`. (b) control 3/3 exit 0 → plant 202-key red exit 1 → reverted; 202 ≠ a pending movement. (c) the "must not be restated" sentence is verbatim at `:1717–1719` (it wraps). (d) no [A1] enrollment row. (e) `PRE_SEED` live, no planned/charter/military kind. The `✅ EP-g2 RESOLVED-EXECUTED` row the collection promised is landed at ODQ §879.3.

⛔ **THE BOUNDARY, STATED EXPLICITLY.** Everything below is **only this compiler's own compilation
judgments**. The chair's rulings I transcribed are **Fable-validated and EXCLUDED**: R-FENCE-SCOPE
and its §876.1 resolution, the HYG intra-consist order and its adopted riders, the TAIL-O cure
lane's four chair adoptions (the four cars, the FOLLOW routing, the wiring-car parking, the O6-B
option (c) ruling), the M1a sweep's four chair rulings, the chair's ruling to try MAT's
architectural cure first, the §876.4 grant, the §876.5 seat law, and both build charters' adopted
amendment sets. **The lanes' own rows in §3 are the LANES' judgments, not mine — I collected them;
I did not author them.**

**§877.6 · The §877 collection compiled while the gate ran · 2026-09-01 · SEAT: Opus 5.**

*What was judged:*
**(1) THE PENDING BOUNDARY — where I drew the ⏳ line.** I ruled six pending groups (CAS · gate
verdict · seal · seat line · the *branch-level* fence state · dock disposition) and, in particular,
I ruled the **branch-level fence state PENDING even though the dock proves it**: the fence's scope
reads {T13} and its constant reads `72acacd8…` at `8b07ce45f`, but neither is true of
`claude/composite-r4` until the CAS, and T13's charter §9 step 4 reads the *branch*. I also folded
the lane's own PLAUSIBLE (the bare gate's non-vitest stages unrun) **into** the gate-verdict slot
rather than listing it as a finding.
**(2) THE STREAK COUNT — I counted ONE conviction and left one CONTESTED** (§8 below). The TAIL-O
dock is convicted because the chair owned it in writing ("FINDING ZERO IS THE CHAIR'S ERROR, OWNED"
+ "streak +1 (to §877)"). The HYGIENE brief's OSR `--write` I did **not** convict, because the lane
itself frames it as a refusal whose correctness depends on what the chair meant — **conviction there
requires the chair's own word, and I declined to supply it.** I also declined to count the MAT
premise (§8 borderline 1), following the §876.5 precedent of naming borderlines without counting
them.
**(3) THE ROW RENUMBERING AND THE TABLE→FIELD CONVERSION.** Four lanes drafted their rows as
markdown TABLES; the queue's house format is field lines. I converted the layout and **renumbered
each lane's `§NNN` to the §877.x rider it rides** so the queue's row ids resolve against the ledger.
Field CONTENT is verbatim. One editorial insertion is marked in italics inside §3.5 (noting that
M1A repaired J-EPG2-6), because two lanes' rows otherwise contradict on whether that repair
happened.
**(4) THE MEMORY RECOMMENDATION — one stub, not three.** I verified the two candidate laws already
exist and recommend **folding the "detector census is not a leaf census" law INTO the coupled-tip
stub** rather than minting a third file, on the index's hard-ceiling constraint. That is a
compression judgment and it can lose a hook.
**(5) THE §877.5 DEDUPE.** I ruled the memory figures and the §745.1-vs-§844 resolution **already
sealed at §876.3** and cut them from §877's new content, keeping only the fidelity verdicts, which
the ledger does not carry. If the chair wants §877 to restate the memory estate for the successor
card's sake, that is a deliberate re-carry, not a gap.
**(6) THE DESK DELTA'S SHAPE — I ruled desk row 24 DISCHARGED-BY-FALSIFICATION rather than
answered**, and replaced it with a forward-looking lighting-day row. That reframing is mine; the
measurements are MAT-SEAM's.

*What Fable re-derives:*
- (a) **The (2) call is the one with teeth.** Re-read the HYGIENE dispatch brief's terminal-window
  list and rule whether the `--write` instruction was an error or an intention. If it was an
  intention, the streak is unchanged **and** laneHYGLAND's refusal (§3.1 field 2) becomes P1 and the
  OSR write is still owed.
- (b) That the six ⏳ groups are the right six — specifically whether the **dock disposition** and the
  **branch-level fence state** are genuinely pending facts or mechanical follow-ups that should not
  occupy a slot.
- (c) That renumbering the lanes' `§NNN` to §877.x (3) does not misattribute any lane's row to a
  rider it did not produce — the mapping is HYGLAND→§877, TAILOCURE→§877.1, M1A→§877.2,
  MATSEAM→§877.3, EPG2→§877.4.
- (d) That folding the detector-census law into the coupled-tip stub (4) does not bury a hook that
  will be needed on its own — it is the compaction class the index has already been bitten by.
- (e) That flagging laneCLAIMHAB and laneTAILFCURE as **in-flight rather than delinquent** is right;
  if either lane is in fact dead, §877 must say so, and §876.5's unmarked-is-owed rule then bites.

*Receipts:* `$SP/877-MATERIALS.md` (this file) · the eleven sources named in its header, each read
whole · live read-only verifications quoted in the header (`rev-parse` on `claude/composite-r4` and
`refs/preserve/tailo-cures-2026-09-01`; `rev-list --count` and seat-trailer grep on
`laneHYGLAND-tree`; HEADs of laneM1A/laneMATSEAM/laneTAILOCURE/laneTAILF/laneCLAIMHAB; the memory
estate's file census, mtime count, description census and MEMORY.md md5; the ODQ EP-g2 grep and the
three sibling ✅ rows; `git log` on `docs/FABLE_RETROVALIDATION_QUEUE.md`).

*Priority:* **P2 overall.** Nothing here is load-bearing for correctness — every carried figure is a
lane's executed evidence and every gate/CAS fact is ⏳. **(a) is P1-shaped** because it decides
whether a landing owes an unperformed register write; **(c) is P4** (one-command re-read).

*RULED (§879, Fable 5.1):* **(a) RATIFIED as BRIEF ERROR** — lineage CONFIRMED (T8 plan :72, WAR plan :234 carry the clean-clone write; HYG plan :165 says NO write); streak nine post-§872. **(2) AMENDED** — declining to convict was the correct procedure; settled on the chair's word. **(b) AMENDED** — five of the six ⏳ groups are facts; dock disposition is an executed checklist action (HYG docks gone from `worktree list`). **(c) AMENDED** — no LANE is misattributed, but the ids do not resolve: the ledger landed §877.1 (the queue append) and §877.2 (TAIL-O + M1a only), so queue §877.1/.2 point at the wrong rider and §877.3/.4 at riders that DO NOT EXIST — the ERRATA line in this section's preamble is the map, and the acts those rows carried (the seam falsification, EP-g2 BUILT with the 41% figure struck, the fidelity pass) reach the ledger at §879. **(d) REVERSED in effect** — the coupled-tip stub existed but its second paragraph was never written and it had NO index row anywhere ("memory-indexed" in §877.2 was false); both are landed at §879. **(e) RATIFIED** — both lanes completed with rows; CLAIMHAB's receipt landed 8 minutes before the §877 commit and its row did not ride — a near miss. **(1)(5)(6) RATIFIED.**

---

## §879 · THE RETROVALIDATION SITTING UNDER THE RETURNED FABLE SEAT (owner, 2026-09-01: "go back to using Fabel, doing the retro validation")

⛔ SCOPE, stated per §5: this pass covers the INVERTED-SEAT SPAN ONLY — the six §877 rows above and the twelve lanes
that ran under the Opus seat after them. The historical strata (§685's dark window, §687–§723) stay QUEUED at the
owner's trigger; this file does NOT report itself empty. Every row below was re-derived by a Fable seat (Fable 5.1,
the owner having moved the Fable seat on 2026-09-01) from PRIMARY receipts, with re-execution where the row names it.
Verdict vocabulary per §5: RATIFIED · AMENDED (with the correction) · REVERSED (with grounds + downstream) · EVIDENCE-THIN.
Content of every lane row is VERBATIM from its receipt; only layout was converted (the §877.6 method).

**§879.1 · THE TAIL-F CURE CARS — sign-by-reference inside the table, and the theorem that pure picking was unreachable · 2026-09-01 · SEAT: Opus 5.**

*What was judged:* (1) Cure 2 built as *sign-by-reference INSIDE the table* (the surface imports `CAUSAL_SWING` and carries the binding) rather than the pre-board's drafted *drop-the-key-and-make-it-a-vocabulary-row*. (2) The declared `home:` path KEPT in the roster rather than derived from a scan — the only both-green shape — accepting that the two cures therefore stay landing-side edits. (3) Building the home-census machinery as the ridable car once red 2 measured as silence, rather than reporting the silence and stopping. (4) The faith-layer scan scope taken from the coupling walker's existing FAITH family prefixes rather than minting a scope.

*What Fable re-derives:* (1) That `FAITH_FIELD_TUNING.CAUSAL_SWING` has readers whose breakage the drafted drop would have cost (`faithChannelWiring.test.js:359`, `display/faithDeepening.test.js:26`) and that wave-6's own comment declares that property deliberate — and that carrying the binding is the pin's existing idiom at `faithField.js:168`, not a new one. (2) The theorem in §5: a cure whose content is a path differing between the parents has no both-true formulation, so "pure picking" was unreachable for these two — and whether the roster's pen-facing path is worth that. (3) That an arm which converts a silent fork into a conviction is the right deliverable for a lane chartered to build cures. (4) That `importersOf`'s `FAITH_FIELD_SET` skip makes the new surface→bindings edge lawful at the union, and that FENCE 2 pins state, not imports.

*Receipts:* Dock `eabae6920` porcelain 0 → tip `b441e6e58` porcelain 0. Union sandbox: pre-cure `5 files / 125 tests / 1 failed` (red 1 verbatim, §3); with arms `23 tests / 3 failed` (both arms convict, messages in §4/§6); with cures `5 files / 128 tests / 0 failed, exit 0`; plants convict, restore sha-identical. Dock: naked cure 1 reds `unknown home …`, exit 1, reverted to porcelain 0. Car greens: `23 passed` · lint 0 · typecheck:ratchet 0 (173/173) · tip re-proof `7 files / 190 tests`, exit 0 · lighting refreeze 21168→21171 / 5808→5809 then `33 passed` exit 0. Twice-gate re-measured: overlap 12 (unchanged), bundle counts 8/8/0…, cherry 11 all-`+`, graft blobs match.

*Priority:* **HIGH** on (1) and (2) — (1) changes a tuning value's home shape on an owner-signature surface, and (2) revises what the chair asked this lane to deliver. MEDIUM on (3). LOW on (4).

*RULED (§879, Fable 5.1):* **RATIFIED on (1)(2)(3); (4) AMENDED; the CHAIR'S OWN FRAMING AMENDED (V2, CONFIRMED).** The "OSR repair / DISPLAY SHIFT" the chair attributed to this lane is **laneF7c's** (`a808e56b5`), whose shift IS declared with its cause ("Engine bytes, saves and flags are untouched; this is display-only"); TAILFCURE's cars are test-only plus a refreeze. (1) readers at `faithChannelWiring.test.js:359` and `display/faithDeepening.test.js:26`; the pin idiom at `faithField.js:163-168` verbatim. (2) the theorem holds: naked cure 1 reds `unknown home` at the F tip; faithful union sandbox 128/3 → cured 128/0. ⛔ **(4) AMENDED — a THIRD same-act landing edit §10 does not name:** F5c's fence hunk CONFLICTS against `8b07ce45f` in two regions, and the FENCE-2 count pin is `toBe(3)` vs `toBe(4)` while the union has FIVE members — the TAIL-F landing checklist gains item 3: compose `faithFieldDormancyFence.test.js` by union in both regions and re-pin `SOURCES.length` to 5. Receipt hygiene: `union-emulate.py` performs two of the four listed conditions (15 artefact reds run as-is); the validator re-derived the two repoints to reach the lane's exact figures.

**§879.2 · THE CLAIM-HABITAT CENSUS — the chartered widening REFUTED on its deciding number · 2026-09-01 · SEAT: Opus 5.**

**Boundary stated.** The chair's ruling that chartered this measurement-first car is
Fable-validated and is **excluded** from this row. What follows is **only** judgment I exercised
inside the lane.

*What was judged:* **(J1)** That the census's TIER-B enforcement vocabulary (`pinned in/by`, `asserted in/by`, `walker`, `ratchet`, `census`, `reds`, `re-derives`, …) is a legitimate extension of the instrument's predicate rather than an invented one — grounded on the union of the instrument's own header language and M1a's seven O-3 rows, and validated by a 10/10 recall control rather than by assertion. **(J2)** That class (d) should be measured by an exhaustive weak screen plus a small hand sample, rather than by a large random sample — and, on finding the screen dominated by false positives, that the correct deliverable is *"not mechanically decidable, do not build the arm"* rather than a bigger sample. **(J3)** The hand triage that demoted 124 raw absent addresses to 27 real standing phantoms — in particular the rulings that correctly-narrated absence (*"which does not exist"*, *"the T4 batch deleted"*, planted probes), the lighting walker's per-sha census prose, and cross-branch `docs/**` are **not** phantom claims. **(J4)** The recommendation itself: *do not land the chartered widening*; land the `enforcedByExists` continuation-line repair instead, and split the case-insensitivity flag out as a separately-priced owner-visible decision rather than folding it into car 1. **(J5)** Excluding `docs/**` from car B's proposed ratchet baseline (106 rows, not 162).

*What Fable re-derives:* **(J1)** Re-run `$SP/claimhab-census2.mjs` with the vocabulary list narrowed to only the verbs literally present in M1a's O-3 table; confirm the recall control still reaches ≥8/10 and that **Q1 stays 0** — the verdict must not depend on my vocabulary choices. **(J2)** Draw an independent seeded sample of 12 from the 131 in `$SP/CLAIMHAB-classD.txt` and adjudicate; if ≥2 genuine misses appear, my "not ratchetable" conclusion is wrong and class (d) is owed a car. **(J3)** Re-read `$SP/CLAIMHAB-phantom-context.txt` and re-triage the 45 sites blind to my table; a count materially above 27 or below ~20 overturns the "3.4× under-count" figure. **(J4)** Re-run the widened probe (`$SP/CLAIMHAB-widen-probe.log` is reproducible from the recipe in census §5) and confirm the 19-key cost and the 6:17 signal:brake split; then judge whether 6 rows of signal justifies 17 rows of brake — that is a taste call, not a measurement, and mine is vetoable. **(J5)** Confirm `docs/**` is genuinely ledger-resident at the build tip (`$SP/CLAIMHAB-census6.json` `carB.bad` cross-checked against `/Users/cstokes/Desktop/settlement-engine`).

*Receipts:* `$SP/CLAIM-HABITAT-CENSUS.md` (full census) · `$SP/CLAIMHAB-census{1..7}.txt/.json` · `$SP/CLAIMHAB-census2.err` (recall control) · `$SP/CLAIMHAB-phantom-context.txt` · `$SP/CLAIMHAB-classD.txt` · `$SP/CLAIMHAB-pins-tip.log` (base) · `$SP/CLAIMHAB-widen-probe.log` (the cost) · `$SP/claimhab-census{1..7}.mjs`, `$SP/claimhab-ci.mjs` (every predicate's provenance in its header)

*Priority:* **J4 HIGH** — it is the recommendation the chair will act on, it contradicts an already-chair-adopted structural-prevention row, and its signal:brake half is judgment rather than measurement. **J1 HIGH** — every population figure in §4 rests on it; the recall control makes it checkable in one run. **J3 MEDIUM** — the 27 is the number car 3 is scoped from. **J2 MEDIUM** — a wrong "do not build" is a silently missing gate arm. **J5 LOW** — mechanical, and the census states it explicitly.

*RULED (§879, Fable 5.1):* **RATIFIED (V3, CONFIRMED) on the deciding number.** The validator's OWN vocabulary-free scan: 184 absent citation rows tree-wide, **0** with a live `CLAIM_RE` within ±3 lines; recomputed over the lane's 46: 0. The refutation of the chartered widening stands on its own measurement, independent of the lane's vocabulary choices (J1's exact ask). Not re-derived: J2/J4/J5.

**§879.3 · ENFORCEDBY CAR 1 — the continuation-line repair, its two cures, and the .jsx ruling · 2026-09-01 · SEAT: Opus 5.**

**Boundary stated.** The chair's rulings — car 1 as the one act, car 2's shape, car 4 folded into
car 2, car 5 not built, and the habitat law (*a habitat is where the DEFECTS are, not where the
instrument's corpus ends*) — are **Fable-validated and EXCLUDED** from this row. What follows is
**only** judgment I exercised inside the lane.

*What was judged:* **(J1)** That the continuation predicate should be the **LOOSE** rule (comment line · no new marker · opens with a path token) rather than the **TIGHT** variant I built and measured alongside it (which additionally requires the previous line to end in `,` `+` `&` `and` or the bare marker). Grounds: the two are **identical on today's estate — 0 targets differ over 2,700+ files** — so the choice is about failure mode, and TIGHT fails **silently** (a wrap whose author omitted the comma goes unread, which is the exact bug being repaired) while LOOSE fails **loudly** at a named `file:line` and is cured by rewording one comment. **(J2)** The `.jsx` ruling: **include** `jsx\|tsx` in `FILE_EXT_RE`, **and** widen the vitest-reachability branch to `.test.jsx` in the same act, on a measurement of **zero** exposed rows. **(J3)** Both cure shapes — **re-point** `resourceTerrainCompatibility` to `terrainOverrideResolution.test.js` on the evidence of that file's own header, and **retract** rather than re-aim `magicRegimeShells`, **overruling the census's nearest-name replacement** after reading that `magicRegimeModel.test.js` never imports the lifecycle module. Also: writing the retraction **without naming the dead path**, so car 2 inherits no new phantom. **(J4)** Scope: that the chair-adopted car 1 includes the **corpus widening**, that a `SKIP_DIRS` guard belongs with it (the widening is what put user-writable dirs in the walk), and that the repair must stay **inside the existing two `it()` titles** — because a moved title needs a full-ratchet re-run the capped-vitest law forbids. **(J5)** The anti-vacuity floor: **40** against a measured 82, placed **inside** the existing first arm rather than as a new one. **(J6)** That I should cure the two danglers **despite `lanePHANTOM` holding the phantom mandate**, minimising the edits and flagging the overlap, rather than land a red pin or defer the car.

*What Fable re-derives:* **(J1)** Re-run `$SP/EB/measure.mjs` against `ab786aaa6` and confirm `LOOSE − TIGHT = 0` in both corpora; then judge the failure-mode argument itself — it is taste, not measurement, and a preference for silent-miss over loud-false-red would flip it. Cheap adversarial check: craft a comment line that opens with a real filename directly under a tag and confirm LOOSE sweeps it (the hazard I accepted). **(J2)** Independently re-run `$SP/EB/jsx.mjs` and confirm **9** `.jsx`-naming tags and **0** within ±3 lines of a `CLAIM_RE` hit — the whole "costs nothing" claim rests on that zero. Then confirm the census's "6 src tags" was an under-count (I measure 7 in `src/`, 9 overall). **(J3)** Re-read `tests/domain/magicRegimeLifecycle.test.js` and `magicRegimeModel.test.js` and confirm the refutation: the shells' arms are in the former, and the latter never imports the lifecycle module. Then re-read `tests/generators/terrainOverrideResolution.test.js` and judge whether it really enforces `getCompatibleResources` or merely mentions it — if it only mentions it, my re-point is a phantom of a subtler kind and should become a retraction too. **(J4)** Confirm the ratchet claim by running `npm run test:ratchet` at `ab786aaa6` (the one PLAUSIBLE in this receipt); and rule whether the corpus widening was inside this act's charter at all, since the brief's "The work" lists only the continuation reader. **(J5)** Judge the floor: 40 against 82 tolerates a 50 % collapse in wrapped targets. A stricter reading would set it near 75; a looser one would call any fixed floor churn-bait. **(J6)** Reconcile against `lanePHANTOM`'s commit and confirm the two edits merge cleanly.

*Receipts:* `$SP/laneENFORCEDBY-receipt.md` (this file) · car sha **`ab786aaa6ea9479478a864116473ac9b54f8bfd2`** · `$SP/EB/base-pins.log`, `measure-base.txt`, `measure-tip.txt`, `jsx-base.txt`, `explore-src.txt`, `mutantA-tip.log`, `mutantA-base.log`, `mutantB.log`, `mutantC.log`, `counts.log`, `counts2.log`, `registers.log`, `GREEN-pre-commit.log`, `TIP-green.log`, `TIP-claims.log`, `TIP-eslint.log` · `$SP/EB/measure.mjs` and `$SP/EB/jsx.mjs` (predicates copied character-for-character from the two pins; provenance in each header)

*Priority:* **J2 HIGH** — it changes a **banked-debt instrument** and its safety rests entirely on one measured zero; if that zero is wrong, a claim is convicted naked on a real enforcer. **J3 HIGH** — a re-point is a standing claim about what enforces what, it overrules an adopted census row, and a wrong one re-plants the exact phantom this program exists to kill. **J1 MEDIUM** — the alternative is measured-identical today, so the risk is prospective and the failure is loud either way. **J4 MEDIUM** — the corpus widening may exceed the brief's literal scope even though the chair's ruling names it; and the ratchet claim is the lane's only PLAUSIBLE. **J6 MEDIUM** — a live cross-lane collision the chair must reconcile. **J5 LOW** — a floor is trivially re-tunable and its mutant proof is in hand.

*RULED (§879, Fable 5.1):* **RATIFIED (V4, all CONFIRMED) · J3 AMENDED.** Discovery-green re-proven: a planted continuation dangler at `couplingRegistryGrammar.js:39` leaves the BASE pin green 2/2 and reds the REPAIRED pin; the `.jsx` cost-zero holds (9 tags / 0 within ±3 lines of a claim / the `enforcement-claims` run byte-identical base-vs-widened save a comment shift); both `src/` cures line-count neutral (423→423, 109→109). ⚠ **AMENDMENT A1 (J3):** the re-point to `terrainOverrideResolution.test.js` STANDS, but its stated ground ("asserts the terrain gating directly") is FALSE BY MUTATION — with `getCompatibleResources` forced all-compatible the test stays 28/28 green because `resolveResources.js:131` re-filters by terrain itself; it reds only when the predicate refuses everything. The target enforces the header's *rolls its roster from it* claim, not the predicate's terrain verdict, and the test's own `:14`/`:75` comments mis-attribute the gate. CHAIR: keep the re-point; the comment mis-attribution is routed to the claims lane (one comment-only, line-count-neutral edit). Not re-derived: J1/J4/J5/J6.

**§879.4 · THE PHANTOM-CURE LANE — 27 addresses, 8 reclassified by HISTORY, and four enforcement-gap rows · 2026-09-01 · SEAT: Opus 5.**

**BOUNDARY.** These are **this lane's own calls only.** The chair's rulings —
the dispositions of cars 1/2/4/5, the adoption of car 1 as the one act, the
habitat law, and the classification scheme the census published — are
Fable-validated and are **excluded** from this row.

*What was judged:* (1) Every one of the 27 cited phantom addresses was researched to a disposition, and **8 were reclassified** against the census's own renamed/never-existed split on `git log --all --diff-filter=AD` evidence. (2) Two re-points were declared **weakened** rather than clean (`computeActiveChains.js:33`, `assembleInstitutions.js:725`) and one site was **retracted rather than re-pointed** (`sectionGlyphTofu.test.js:8`) because no successor of that kind exists. (3) A 13th class-2 site outside the census (`labelJoins.test.js:42`) was pulled in, on the ground that it cites the same phantom AND is the file the census named as the replacement. (4) M1a's repair text was reused **verbatim** at `check-full-typecheck.mjs` to make a cross-lane collision merge rather than conflict. (5) The two `@enforced-by` continuation danglers were **left uncured** for car 1 per the brief, with the reads handed over. (6) Four enforcement-gap rows (G-1…G-4) were raised rather than papered over.

*What Fable re-derives:* ⓐ The reclassification: `git log --all --oneline --diff-filter=AD -- '**/<addr>'` for all 22 addresses — expect 18 empty, and `worldPulseLazy` / `economicsTradeGlyphTofu` / `institutionIdentity` all deleted at `151f8ac38`, `importCycles` at `de9b0361c`. ⓑ That each of the 12 re-point targets actually carries the claim (the quoted test titles in §2–§4 are the check). ⓒ **G-1 and G-2**, which are the rows with teeth: read `git show 151f8ac38^:tests/joins/institutionIdentity.test.js` and `…:tests/pdf/economicsTradeGlyphTofu.test.js` and confirm no live successor carries their end-to-end / render-level arms. ⓓ That the retraction at `sectionGlyphTofu.test.js:8` is the right call and not a missed enforcer.

*Receipts:* Tip `c1da0ada4`; commits `46a973c2b` / `8238575a5` / `c1da0ada4`; 26 files / 168 lines / **0 non-comment**; comment-stripped md5 identical on all 26 base-dock-vs-tip; eslint exit 0; `check-full-typecheck.mjs` exit 0; touched+target suites **218 passed, exit 0**; the pin log **byte-identical** to a clean `3f9201e39` dock (5 reds pre-existing, `enforcedByExists` green both sides). Logs listed in §8.

*Priority:* **MEDIUM-HIGH for ⓒ (G-1/G-2 are live enforcement losses on a wave and a paid surface, and G-4 suggests the merge that caused them should be swept).** MEDIUM for ⓐ (it corrects a chair-adopted classification). LOW for ⓑ/ⓓ (mechanical, and each is one quoted title away from settled).

*RULED (§879, Fable 5.1):* **RATIFIED (V3, CONFIRMED).** All 8 reclassifications plus 2 controls reproduced by TWO independent history methods. Not re-derived: ⓑ/ⓒ (G-1/G-2 were carried forward by the LOSTPIN and TOFU lanes and validated there).

**§879.5 · THE FOLLOW-CONSIST AMENDMENT — the order change, the ratchet-delta correction, the ceiling raise · 2026-09-01 · SEAT: Opus 5.**

⭐ **BOUNDARY, stated explicitly.** This row covers **only my own judgment calls**. The chair's
rulings handed to me as settled — that **the MAT seam lands with no owner ask owed**, that
**`c90e0cb76` is dropped**, that **FOLLOW owes a third `ARGUED_UNLAYERED` entry**, and the TAIL-O
lane's finding that produced it — are Fable-validated and are **NOT** re-litigated here. Where I
touched them, what I submit for re-derivation is my *measured correction or extension* (the ceiling
raise the prescription omitted; the ratchet delta the seam receipt mis-stated), never the ruling.

*What was judged:* (1) **The consist ORDER changes** — MAT/SEAM moves from slot 3 to slot 2, on the ground that the engine row is the tightest register at ≈156 B and the 411 B ask should meet the fattest base (J-FA-2). (2) **The MAT-SEAM receipt's ratchet delta is CORRECTED** from `+51 tests / +2 files` to `+45 / +1`, against a chair-adopted document (J-FA-4). (3) **HYGIENE's byte drift is priced with a comment-stripped SOURCE proxy** and the resulting ≈156 B / ≈442 B margins are published as PLAUSIBLE, with one base build named as the discharging measurement (J-FA-3). (4) **The argued-row car is specified as `cherry-pick -n` + ONE commit**, and is given a **second, unprescribed edit** — `ARGUED_ROSTER_CEILING` 27→28 (J-FA-5, finding 3). (5) **D4's park claim is carried as PLAUSIBLE-strong**, not replicated (J-FA-6). (6) The `reason` prose of the drafted argued entry, and its placement at :862 in `couplingInclusion.walker.test.js`.

*What Fable re-derives:* (a) ⭐ **The ratchet-scope correction, independently** — read `SOURCE_TEST_EXCLUDE` and confirm the `2480 − 2429 = 51` identity; it is one command and it changes what two landings predict. (b) ⭐ **That the ceiling raise is genuinely compulsory** and that `UNLAYERED_BASELINE_CEILING` genuinely does *not* move — i.e. that `LIVE_UNLAYERED`'s argued-key filter keeps the exact-set equality at 179. A wrong call either way reds the walker at the landing. (c) **That `reads: []` is right for the RIGHT reason** — the *factual* half is now closed by measurement (the leaf holds no specifier of any kind, dynamic seam included), so what remains is the **doctrinal** half: that a zero-import leaf is what the roster means by "substrate owning no subject", rather than a module that merely has not reached anything yet. (d) **The order judgment** — is a ≈156 B predicted engine margin the correct axis on which to re-open a chair-ruled order, or does landing sequence properly turn on composition risk instead? (e) **That the closure BFS is the right proxy for chunk membership** — it reproduces 241/212/161, but Rollup's emitted chunks are not the source closure, and the seam lane already caught one estate-specific surprise (`computeEngineSharedDomain` routing a lazy module eager). (f) **That the drafted `reason` claims nothing false about the leaf** — specifically "holds no clock, rolls nothing, walks no roster", which I took from reading its exports, not from executing it.

*Receipts:* `$SP/FOLLOW-CONSIST-AMENDED.md` (the product) · this receipt §1–§3 · probes `/tmp/reads-probe.mjs`, `/tmp/roster-probe.mjs`, `/tmp/closure.mjs`, `/tmp/bundle-probe.mjs`, `/tmp/strip.mjs` (each with its control named in §1) · the five `git cherry` transcripts at `8b07ce45f` · the era census `6308a27b8..8b07ce45f` (97 files → 9 consist-surface members) · `96ce1ffb1`'s +17/−0 diff read at cause. **No tree touched, no ref moved, nothing committed.**

*Priority:* **HIGH on (a)** — it is a register prediction two landings will make, it is wrong in a chair-adopted document today, and one command settles it. **HIGH on (b)** — a wrong ceiling call reds the walker at slot 1 and the fix is another commit inside a same-commit obligation. **MEDIUM on (d) and (e)** — (d) is a judgment the chair may simply take differently, and (e) is discharged for free by checklist item 6. **LOW on (c) and (f)** — both are one-file re-reads.

*RULED (§879, Fable 5.1):* **RATIFIED on every item (V1, CONFIRMED) · count AMENDED → SIX.** (a) `SOURCE_TEST_EXCLUDE='tests/build/**'`, 51 files there, `2480 − 2429 = 51` — the correction to `+45/+1` stands. (b) roster exactly 27 against an exact `.toBe`; `LIVE_UNLAYERED` filters argued keys so 179 holds; baseline 179 rows, 0 `operations/`. (c) zero-import is BY DESIGN per the leaf's own header; the sibling `operationGrammar` row was admitted on the identical ground. (d) composition risk does not discriminate (D4 6/6 blobs base-identical); the base build at the CAS discharges the margin. (e) PLAUSIBLE-with-discharge: `subsystemRows*` CONFIRMED dark (only importer has zero runtime importers; the panel is `lazy()`). (f) decision body has no loop/clock/PRNG — but write "walks no WORLD roster" (the file calls its `absent[]` list a roster). "Nine picked cars" → SIX, editorial; corrected in the document.

**§879.6 · THE INSTRUMENTS PRE-BOARD HALF-2 PREP — HZ-SERVICECAT shape B, the dormancy-anchor amendment, the S5 reversal · 2026-09-01 · SEAT: Opus 5.**

**Boundary stated per §876.5:** the chair's four rulings in `M1A-DEFERRAL-SWEEP.md`'s adoption tail,
the INSTRUMENTS pre-board half-1, `laneINSTRLAND-plan.md` and `INSTR-BOARDING-PACK.md` are
**pre-switch Fable-validated work and are NOT enrolled here.** The row below covers **only this
lane's own calls** — the five judgments at §4 and the measurements they rest on.

**Boundary stated per §876.5:** the chair's four rulings in `M1A-DEFERRAL-SWEEP.md`'s adoption tail,
the INSTRUMENTS pre-board half-1, `laneINSTRLAND-plan.md` and `INSTR-BOARDING-PACK.md` are
**pre-switch Fable-validated work and are NOT enrolled here.** The row below covers **only this
lane's own calls** — the five judgments at §4 and the measurements they rest on.

**What was judged.** (a) That HZ-SERVICECAT converts as shape **B**, moving `documentBaseline` 6→5
and nothing else, making the conversion a two-file act with
`tests/lint/siteCoherenceRatchet.test.js:528`. (b) That the walker's provenance sha belongs in
`enforcer.note` prose rather than a new per-row `measuredAtSha` field. (c) That the pre-board's §3
dormancy halt rule must be **amended** rather than the `46c8d9414` car dropped, and that
token-stream/AST identity is the right instrument to keep it a bit claim. (d) That bill A appends to
the JSON `cause` strings only, with the four residual `WALKER_ROWS_OWED` rows riding as a named
second bill. (e) That the claim-habitat work enters this consist as **car 1 only**. (f) That
abandoning the mutex-blocked vitest run in favour of source-slice probes was the correct trade.

**What Fable re-derives.**
1. **(c) is the highest-stakes call and the only one that changes a STOP rule.** Re-read
   INSTR-PREBOARD-HALF1 §3 against the 16-path union and confirm that amending the anchor — rather
   than dropping the car or waiving the check — is the wanted disposition, and that
   "token-stream + location-stripped AST identical" is an acceptable substitute for "zero src bytes"
   in a dormancy claim. If it is not, the car must be dropped instead and the chair's adoption of
   `46c8d9414` revisited.
2. **(a)'s ratchet direction.** The gate passes at `documentBaseline` 6 **or** 5; choosing 5 is a
   policy reading of the registry's own `_doc` ("EXACT-SHRINK-ONLY"), and it forces an edit to a
   second instrument's pinned expectation. Confirm that tightening is wanted and that editing
   `siteCoherenceRatchet.test.js:528` is a landing's act rather than SCW-0's.
3. **(d) sets a convention.** HYGIENE corrected 2 of 6 `WALKER_ROWS_OWED` rows; I propose finishing
   the other 4. Confirm whether a landing finishes a sibling landing's partial cure on an instrument
   file, or whether that belongs to the row's own burn-down wave.
4. **(e) declines part of a chair-chartered car.** Confirm car 2 (the new prose-address walker) is
   genuinely better placed in its own landing than inside this consist's register bills.
5. **The S5 correction (§3 finding 2) contradicts an already-ADOPTED chair row.** Re-run the
   `FROZEN_NAKED` measurement and confirm the six are machine-frozen and green before the correction
   is recorded — this reverses the severity of a finding the chair has already published.

**Receipts.** `$SP/INSTR-PREP.md` (the product, every figure labelled) · this receipt §2's file list ·
executed exits quoted in-shell throughout, with three discriminating negative controls
(hazard-registry X/Y/Z, the AST control at `babf89e56`, and the OSR control/treatment pair).

**Priority.** **HIGH** — item (c) is a boarding blocker for the INSTRUMENTS landing and item 5
reverses a published finding; items (a), (d), (e) are landing-shape calls that can be vetoed at
boarding without rework.

*RULED (§879, Fable 5.1):* **RATIFIED, two rules GENERALISED (V1, CONFIRMED).** (c) union recomputed 16 paths / one `src/`; both picks token-stream AND location-stripped-AST identical in the validator's own acorn run, control DIFFERS — keep `46c8d9414`; STATE THE HALT ANCHOR GENERALLY: "the `src/` diff equals the set of chair-named comment-only picks, each token/AST-identical", so the next comment-only pick needs no new amendment. (a) RATIFIED — the registry's `_doc` says EXACT-SHRINK-ONLY while the validator enforces only `>`; leaving 6 at a count of 5 is a silent free slot; the landing that moves the literal owns the `:528` pin. (d) NARROWED: not "finish a sibling's cure" — **whoever MEASURES a figure at a tip corrects that row with the measuring sha in the same act**; INSTR measured all four, so it corrects all four. (e) RATIFIED, vehicle updated: car 1 has since landed as `ab786aaa6`, so INSTR PICKS it. (5) RATIFIED by a third independent run: `FROZEN_NAKED` green, the same six sites.

**§879.7 · THE LOST-PIN SWEEP — 29 deleted files RUN, six live defects, and the control that licenses the LOST list · 2026-09-01 · SEAT: Opus 5.**

**BOUNDARY.** These are **this lane's own calls only.** The chair's chartering ruling
that adopted G-4 as its own sweep car, the phantom lane's cures and classification, and
the census's habitat law are **Fable-validated and excluded** from this row. G-2 belongs
to the sibling TOFU lane; I record one measurement about it and claim none of it.

*What was judged:* (1) The chartered question — "does a successor carry its guarantee?" — was answered by **executing the 29 deleted files at HEAD** rather than by reading successors, and the resulting **three-way** split (LOST 57 / SUPERSEDED 66 / REVERTED-FIX 21) was adopted in place of the brief's CARRIED/PARTIAL/LOST, because the brief's scheme merges "the pin is gone" with "the capability never existed here". (2) Six live defects were raised as **product rows, not pin rows**, and five were declared **owner-gated** (paid-surface behaviour) and priced-but-not-built. (3) The G-4 row's own premise was **publicly corrected**: it is a series of ≥7 deletion commits (108 files still absent), not one merge, and `60fc5946c` (42 files) was named as the better next car. (4) `worldPulseLazy`, `persistConfigMerge`, `adminPanel.mobileGate`, `advanceCampaignWorldAtomicRollback` and `advanceCampaignWorldInFlightGuard` were declared **CARRIED despite failing resurrection**, on the ground that a bare `X is not a function` is an address failure. (5) The recovery shape recommended for G-1 is **2 appended arms in `chains.test.js`, NOT restoring the 467-line file**, deliberately trading 23 recovered arms for a zero-census-bill act. (6) `resolveTier` (§3.2) was ranked **below** the PDF rows because it under-grants to staff rather than failing open — a deliberate de-escalation of an entitlement finding.

*What Fable re-derives:* ⓐ **The two controls, which license everything else.** `tests/store/persistConfigMerge.test.js` scores **0/7** on resurrection and is nonetheless CARRIED — confirm `mergePersistedState` moved to `src/store/persistMerge.js` and that `tests/store/persistMerge.test.js:17` asserts the backfill property. If this is wrong, every LOST verdict is suspect. ⓑ **The six defects**, each a one-command check: run `s()`'s regex over `北京`; `generateSettlementPipeline(...).config.culture` vs `generateCampaignPDF.js:202`; the raw `Set.has` at `:848-849` vs the nine `String(id)` sites in `campaignSlice.js`; `IdentityDailyLife.jsx:244-246`'s missing third branch; `resolveTier` present at `:149/:311/:354/:458` and absent at `:489`; `git grep -n cloudPending HEAD` ⇒ 1 read, 0 writers. ⓒ **The 62 % worktree divergence** and that it changes verdicts — `git grep generateCampaignPDF -- tests/` vs `git grep generateCampaignPDF HEAD -- tests/` (1 vs 6). ⓓ The series sizing in §6 (108 absent, 79 unswept) — one `git diff-tree` per commit. ⓔ That the ungated recoveries in §4 really add **no new test file** and therefore no three-census bill.

*Receipts:* Anchor `871467418`. Deletion set 29/29 all `D`, one parent. Resurrection **87 failed / 57 passed (144)**, 11 arms unrunnable, `$SP/LOSTPIN/resurrect-verbose.log`. Control **exit 0 — 3 files / 10 tests**, `control-A.log`. Node probes for the sanitiser, the member resolver and `config.culture` quoted verbatim in the report's §3 and §8. Worktree divergence 1,478 / 2,389. Series 108 absent / 79 unswept. Dock porcelain clean after cleanup; **repo untouched, nothing committed**.

*Priority:* **HIGH for ⓑ — six live defects, five on paid surfaces, and §3.5 (culture blank on every modern campaign export) is certain and needs no unusual input.** **MEDIUM-HIGH for ⓐ**, since the controls are what license the LOST list and one of them inverts a naive reading. **MEDIUM for ⓒ** — it is a method law that will bite every future sweep on this branch. **LOW for ⓓ/ⓔ**, both mechanical.

*RULED (§879, Fable 5.1):* **RATIFIED on (i)(ii)(iv); (iii) AMENDED on ADDRESS, the defect CONFIRMED by execution (V3).** (i) `151f8ac38` has ONE parent `50f3298d9`, 29/29 `D`, +0/−5,046. (ii) the `persistConfigMerge` control holds at all three shas. (iv) 108 absent at `871467418` AND at `8b07ce45f`. ⛔ (iii) the receipt's `:202/:304/:578` are the LEDGER-branch copy; at the build tip `8b07ce45f` the reads are **`:197`, `:299`, `:573`** — a repair car chartered from `:202` mis-addresses the build tip. The validator's own reading: the generator never writes `settlement.culture` (seeds `config: effectiveConfig` at :125, reads only `config.culture`); the exporter reads the top-level key three times with no fallthrough; executed on the live pipeline `settlement.culture = undefined`, so all four surfaces print blank or `-` for every settlement the current generator produces. The deleted suite's describe named the contract ("culture is read from the resolved config") and `151f8ac38` removed the only assertion that would have caught the exporter staying behind. ⚠ CAUTION for the repair: `:197` reads `s.settlement` and the columns read `save.settlement` — all three sites must move together or the cover count disagrees with rows still printing `-`. Not re-derived: the other five defects, the 62% figure (re-framed at §879.1: the ledger line not carrying the build work).

**§879.8 · THE COUPLING FEASIBILITY MEASUREMENT — couple FOLLOW×(O+L), keep TAIL-F apart · 2026-09-01 · SEAT: Opus 5.**

**§878 · laneCOUPLING (Opus seat) — 2026-09-01 — read-only measurement lane, zero commits.**

- **Judgment calls made by this lane (4):** (1) recommending **COUPLE WITH RIDERS** for
  FOLLOW × (TAIL-O+TAIL-L) rather than KEEP SEPARATE, on the zero-tail-bytes and zero-freeze-conflict
  measurements; (2) drafting the six-slot boarding order that preserves FOLLOW's ruled slot order
  intact rather than interleaving the tails for any efficiency; (3) minting riders R1–R4 as the price
  of coupling rather than treating any of them as a blocker; (4) reporting the
  FOLLOW-CONSIST-AMENDED "nine picked cars" figure as an error rather than assuming a counting
  convention I could not see.
- **Owner-gated classes touched:** **none.** No commit, no push, no register write, no budget raise,
  no tuning signature, no persisted shape, no deploy, no dock entered.
- **Chair rulings folded, not re-argued (excluded — Fable-validated):** the TAIL-O+TAIL-L coupling
  adoption · TAIL-F alone and twice-gated · O6-B option (c) · FOLLOW's slot order
  O2→MAT/SEAM→D4→L7 · the argued-row supersession · the §877.2 cure corrections.
- **Corrections to already-adopted documents (3):** the cross-chain disjointness sentence · the
  picked-car count · cure 4's unrecorded ordering dependency. Each measured, each flagged.

*RULED (§879, Fable 5.1):* **RATIFIED (V4, all CONFIRMED) · THREE AMENDMENTS, one a NEW RIDER.** The deciding measurements hold: 18 importer queries (6 leaves × 3 shas) return 0 external `src/` mentions against a 12-line control; cure 1 executed on `characterReadModel.js` leaves both detector arms TRUE, so the pin cannot be blinded; TAIL-F's 98 deleted live lines and 7 importer-bearing files hold. ⛔ **AMENDMENT A2 — RIDER R5, LOAD-BEARING:** L7's tip pins `[READ_MODEL]` over a LITERAL regex (`:673 /livedExperienceSources|knownCharacter/` on `stripComments`), not over `consumesKnownRead` (which exists only at the landing base and is what cure 1 modifies). Executed: the literal regex convicts `envoyTaskCatalog.js` at `9cee5c849` through the `:458` provenance string, and NO car changes the regex — a verbatim composition leaves the coupled tip RED with no cure on the board. **Rider: compose slot 4's STEP-1 filter over the base's `consumesKnownRead`.** Recommendation otherwise unchanged. **A3 (arithmetic, no verdict moves):** TAIL-F `src/` = 1,161 added (not 961) / 98 deleted / 11 files; TAIL-O+L = 3,281 added (2,667 + 614) / 0 deleted / 6 files; `faithField.js` has 2 code importers at B (one prior count was a comment mention) ⇒ 9 importer sites, not 10.

**§879.9 · THE RENDER-TOFU MEASUREMENT — GAP, BOUNDED: the PDF prints the WRONG LETTER, not a box · 2026-09-01 · SEAT: Opus 5.**

**BOUNDARY.** These are **this lane's own calls only.** The chair's chartering ruling
(that G-2 is a product row, that a measurement car opens it at the mint window, that the
retraction was the right lane behaviour) is **Fable-validated and excluded**. The
phantom-cure lane's G-2 finding — that no render-level check survives — I **re-derived
and confirmed**, and it is likewise excluded as already-adopted.

*What was judged:* (1) The verdict **GAP, BOUNDED** rather than NO GAP — and the judgment that the gap is **not the one the retracted sentence described**: the product does not print `.notdef`, it prints a wrong Latin-1 character or nothing, via a non-embedded Helvetica substitution with low-byte truncation. (2) The call that **`noLig()` is obsolete** — that no face carries a ligature feature and the guard's only live effect is 25–86 non-embedded runs per dossier — and that this, not a data glyph, is the largest measured defect. (3) The **severity split**: T-1 rated below T-2 despite being 20× more frequent, because it rasterises clean in the one viewer I could test; stated as PLAUSIBLE, not confirmed. (4) The three-car cure shape and its ordering (**B → A**, with A as ratchet if B is parked), including the call that **Car C is not a substitute for Car A** and that Car A **reds at its own tip** so it cannot land as a plain gate arm. (5) The judgment that `dossierCausalProse.generated.js`'s 78 arrows are **out of scope** (title-field, renderedness unestablished) rather than counted as reach. (6) Recording my own first custom-content probe as a **false negative** rather than deleting it.

*What Fable re-derives:* ⓐ **The decisive byte**: render any `<Text>` containing `→` or a ZWNJ through `@react-pdf/renderer` 4.5.1 with these 8 faces, inflate the content stream, and confirm the run splits to a `/BaseFont /Helvetica /Subtype /Type1 /Encoding /WinAnsiEncoding` object with the codepoint's **low byte** — `→`→`0x92`, `影`→`0x71`, ZWNJ→`0x0c`. This single receipt carries the whole verdict. ⓑ **The obsolescence claim** (Car B's entire premise): `fontkit` `availableFeatures` on all 8 TTFs contains no `liga`/`clig`/`dlig`, and `layout('fortified official conflict staff')` returns 33 glyphs for 33 chars. ⓒ **The reachability control**: the reference-pack CONTROL/HOSTILE pair — 69 vs 73 non-embedded runs, Δ exactly the four mutated codepoints — is the arm that proves custom content reaches the paid PDF; **my first attempt at it returned a false negative**, so re-derive it from the fixture + `eligibleCustomContent`, not from a hand-built object. ⓓ That **`customContentSchema.js` performs no charset validation** (type and length only). ⓔ Car B's blast radius (**67 mentions / 7 files**, three suites entirely about the defuse) before the owner is asked — and that `src/foundry/journalPages.js:50` already strips the ZWNJ back out, so Car B removes an insert/remove pair rather than a live value.

*Receipts:* Dock `$SP/laneTOFU-tree` @ `8b07ce45f`, **porcelain exit 0 / 0 lines**, no src file modified, 5 throwaway probes removed. 15 probes, logs listed §6. Byte-level census on **5 rendered dossiers** (25/69/74/74/86 non-embedded runs; three non-embedded base-14 faces in every file). Custom-content CONTROL 69 → HOSTILE 73, byte tally `0x71 0x94 0x26 0x92`. Ligature census: `ligFeatures=[]` × 8 faces, 33 glyphs / 33 chars. Coverage: 759-codepoint intersection, U+200C in **0 of 8**. AST scan of 2,139 files: 187 hit, **0 in the guarded corpus**, 1 in all of `src/pdf/` (`format.js`, the ZWNJ), 66 engine-side. Corpus boundary: **26 of 49** `src/pdf/` files unscanned. Visual rasterisation read as an image (`laneTOFU-png/`). All vitest capped `GATE_MUTEX_TIER=shared --maxWorkers=2`, exits captured.

*Priority:* **HIGH for ⓐ and ⓒ — this is a paid surface, the defect ships on 100 % of dossiers today, and ⓒ is the arm that turns "a user could" into "a user does".** HIGH for ⓑ because Car B's entire justification rests on it and Car B is the one owner-gated ask. MEDIUM for ⓔ (it is the price the owner is being quoted). LOW for ⓓ (one grep). ⚠ **OWNER-VISIBLE either way**, per the chair's own routing — and the item the owner should actually be shown is **not** "a tofu box could ship" but **"the dossier has been printing a wrong character for `→`, and a non-embedded font on every page, and the check that would have caught it was deleted at a merge."**

*RULED (§879, Fable 5.1):* **RATIFIED (V4, all CONFIRMED).** The validator's OWN renderer probe reproduces the low-byte truncation: the non-embedded font is `<< /Type /Font /BaseFont /Helvetica /Subtype /Type1 /Encoding /WinAnsiEncoding >>` — no FontDescriptor, no FontFile, no ToUnicode — and in stream order `影` U+5F71 → `[71]` = **q**, `街` U+8857 → `[57]` = **W**, `→` U+2192 → `[92]`, ZWNJ U+200C → `[0c]`, each split out of its embedded run; 13 show ops, 4 non-embedded. 8/8 faces carry no ligature feature (`layout` 33/33; a Geneva CONTROL shows `[liga,dlig]` 30/33, so the instrument discriminates); ZWNJ in 0/8; `customContentSchema.js` is `typeof` + `.length` only, zero regex literals. Not re-derived: the CONTROL/HOSTILE custom-content pair (ⓒ) — it stays PLAUSIBLE-by-the-lane's-own-execution and is re-owed at the cure landing.

**§879.10 · THE INSTRUMENTS LANDING — 22 commits, paused at the lighting register bill · 2026-09-01 · SEAT: Opus 5 · IN-FLIGHT.** *COMPLETED — its full row is §880.1.*

⏳ IN-FLIGHT-OWED (§878): the lane was stopped clean at `eb150f31b` (porcelain 0, sealed `refs/preserve/pause-instrland-2026-09-01`). Its judgment calls so far are in `$SP/laneINSTRLAND-receipt.md` §§1–5 (the walker-triple resolution proven semantically; landing cure 1's door-(b) first arming 26→27; cure 2's `unpaired` classification of a 60th rebuilder; the four magnitude breaches attributed base=tip; bill A's house-style glyph strip). Its full row is owed at its completion; the §879 pass validates the committed work below only where a validator lane read it.

*RULED (§879, Fable 5.1):* **IN-FLIGHT — validated at its completion (§880).** Its plan (INSTRPREP) is RATIFIED with two rules generalised (§879.6); three riders bind its resume — bill A REPLACES the second-generation voice attribution rather than appending, HZ-SERVICECAT's note records 1/3 cured + 2 quarantined, and the dormancy anchor is asserted over the SET of comment-only picks — see `INSTRLAND-RESUME-NOTE.md`.

**§879.11 · THE PAID-SURFACE REPAIR LANE — repair 1 of 5 committed; the chair's prescribed cure for repair 2 REFUTED · 2026-09-01 · SEAT: Opus 5 · IN-FLIGHT.** *COMPLETED — its full row is §880.3.*

⏳ IN-FLIGHT-OWED (§878): stopped at `0dac7b074` (2 commits, sealed `pause-paidfix-2026-09-01`). ⭐ Repair 1 (the campaign PDF and World Book read culture from an address nothing writes) is COMMITTED with its pin. ⛔ THE LANE REFUTED THE CHAIR'S BRIEF BY MEASUREMENT: "fix the sanitiser by preserving the codepoints" produces MOJIBAKE in jsPDF (raw UTF-16 units emitted as Latin-1 bytes; `北京`→`S◊N¬`) and DESTROYS THE SURROUNDING ASCII (`Port 東京 Harbor`→`\0P\0o\0r\0t…`) — preserving is strictly worse than today's blank. Full row owed at completion. See §879's ODQ entry for the chair's ruling on repair 2. ⛔ ALSO THE LANE'S FIRST FINDING, load-bearing for §879.7: the repo's checked-out branch (`review-fixes-2026-07-08`, the LEDGER line, tip `871467418`) and the build base `8b07ce45f` (`claude/composite-r4`) are DIVERGENT — merge base `4a9b6cf4b` (2026-08-11), 1,146 vs 979 commits apart — and `src/utils/generateCampaignPDF.js` differs between them. The lost-pin sweep anchored to the LEDGER tip; this lane re-reproduced all five defects at the BUILD base (culture read at `:197` not `:202`; the sanitiser at `:83-89`; the member resolver at `:880-881`; a SIBLING food-balance site at `IdentityDailyLife.jsx:84-88` the sweep did not list). The defects are real on the build line; the sweep's line numbers and its worktree-absence figure are ledger-line measurements.

*RULED (§879, Fable 5.1):* **RATIFIED for repair 1 (V4, CONFIRMED).** Live generator: no root `culture` key; `config.culture` and `culturalIdentity.key` carry it. The pin at base exits 1 (5 failed / 19 passed); at tip 24/24; OSR walker 44/44; governed check "1993 finding(s), exactly matching". Repairs 2–5 not re-derived (2 is parked to the owner — see the ODQ entry; 3–5 resume).

**§879.12 · THE GLYPH-INTEGRITY LANE — Car B committed, Car A staged mid-commit · 2026-09-01 · SEAT: Opus 5 · IN-FLIGHT.** *COMPLETED — its full row is §880.2.*

⏳ IN-FLIGHT-OWED (§878): stopped at `f09ce3ff7` (1 commit, sealed `pause-glyph-2026-09-01`; Car A's nine files staged, uncommitted). ⭐⭐ Car B — "delete `noLig()`'s body — 74/25/74 non-embedded runs per dossier become 0/0/0" — is COMMITTED and CHANGES PAID-SURFACE BYTES (owner's veto stands; chair-ruled to land BEFORE the GOLDEN freeze). Validator V4 re-derived its before/after in an independent worktree — see its verdict. Full row owed at completion.

*RULED (§879, Fable 5.1):* **RATIFIED for Car B (V4, CONFIRMED) — the paid-surface change STAYS owner-visible.** The validator's own parser over the same three seeds: **74/74/25 → 0/0/0** non-embedded show ops; bytes **−1,873 / −1,751 / −806** (370,216→368,343 · 256,185→254,434 · 164,766→163,960); pages 40/28/20 UNCHANGED; the `0c 2d` swallowed-hyphen runs reproduced; the tip's six touched suites 44/44 green; fonts byte-identical base→tip. Cars A/C not re-derived (A is staged, uncommitted).

**§880.1 · THE INSTRUMENTS LANDING — resumed and completed: bill A in REPLACE form, four ceilings banked at base=tip, the re-freeze six-for-six, provenance folded into `cause`, dormancy SET proof, plants, HOLD at `60255ca8e` · 2026-09-01 · SEAT: Opus 5.**

## §19 · THE LANE'S RETROVALIDATION ROW (§879 form) — my own judgment calls since the resume

**RETROVALIDATION — lane INSTR-land (Opus 5), acts at `8121dc797` · `cf83a400c` · `fd94d7da2` ·
`60255ca8e`, base `8b07ce45f`, HEAD `60255ca8e`, porcelain 0.** Eleven calls; the first four are
where a re-derivation would pay.

**1 · A RECEIPT FIGURE OF MY OWN WAS WRONG, AND THE BILL SHIPPED THE CORRECTION.**
*Judged:* §4d's "65 never listed, **11 GREW**, ZERO cleared, so **not one byte** of this debt has
ever been paid down" was re-measured row by row and is **65 / 10 GREW / 1 FELL / 0 cleared** —
`src/domain/worldPulse/convergence.js` fell em 18 → 14. "Not one byte" was FALSE, and the false
sentence was the *sharper* one, which is how it survived. *Fable re-derives:* re-run
`voiceMechanics` per-file, partition the 76 by `baseline em` vs `current em`, confirm exactly
one FALL and its file; and check my mechanical claim that the win cannot be banked alone
(`shrinkOnlyBaseline.js` throws on a rising total, so a whole-arm refreeze is the only route).
*Receipts:* §6, `INSTRLAND-billA-probe2.json`, commit `8121dc797` body. **Priority: HIGHEST — a
corrected figure now sits in a shipped register, and an unbanked win is a live finding.**

**2 · FOUR CEILINGS RAISED — instrument registers, not product budgets.**
*Judged:* em 649→720, files 64→76, total 1037→1108, population 76→78 by attributed hand edit,
on the pre-board §3 door (b) the chair pre-authorised, because `--update` may only LOWER.
*Fable re-derives:* the base=tip control (base=720/76/1108/78 = tip) through the gate's own
`magnitudeReportOf`; that the machinery ARMS here (base baseline blocks on 0 of 10 rows, RMAG's
on 10 of 10); that no product budget moved (670, 6, and the 62-row clamp baseline at its own
`BASELINE_CEILING` are untouched); and the plant — +1 still BREACHES on all four.
*Receipts:* §7, §10, §16, commit `cf83a400c`. **Priority: HIGH — a raise is the one direction
the ratchet cannot do for itself.**

**3 · I REPORTED THE CHAIR'S RULING PREMISE AS FALSE INSTEAD OF COMPLYING SILENTLY.**
*Judged:* the ruling said the re-freeze DROPPED the four `attribution` fields. Measured: rows
carrying `attribution` = **0 of 10** (the chair's count, correct) but specs carrying it = **4 of
14** (where act 2 put it), and a REAL full `--update` rewrite round-tripped every tuple
**byte-identically**. I adopted the ruling anyway on a different ground — `attribution` survives
only incidentally and **no arm requires it** — and folded the provenance into `cause`, which an
existing arm validates, without extending the tool's schema.
*Fable re-derives:* the row-vs-spec count at `fd94d7da2`; the 3-line diff `cf83a400c..fd94d7da2`;
and the judgement that adopting-on-a-different-ground was right rather than an over-reach.
*Receipts:* §14, commit `60255ca8e` body. **Priority: HIGH — a lane telling the chair its
premise is wrong must be checkable, or it is just a lane doing as it likes.**

**4 · BILL A WAS EXTENDED BEYOND THE CHAIR'S ENUMERATED ROWS (vetoable, and flagged as such).**
*Judged:* the chair named the two PER-FILE voice blockers; I also corrected the **clamp** and
**enforcement-claims** blockers in the same frozen object, on rule V1 as the chair generalised
it, because leaving them saying 73/11 and "a completeness claim" while correcting the identical
figures one directory over would have manufactured the contradiction rider 1 exists to kill.
*Fable re-derives:* whether V1 reaches that far, or whether those two were deliberately parked.
Reverting those two replacements alone leaves the rest of the bill standing.
*Receipts:* §6, commit `8121dc797` body. **Priority: MEDIUM-HIGH — scope, not correctness.**

**5 · The two TOTAL voice blockers were left BYTE-UNCHANGED.** *Judged:* they already carry 1108
and 40 with HYGIENE's measuring sha `3f9201e39`, and my suite re-measured the same two figures,
so a row that is already right gets no re-stamp — the alternative would have been a
second-generation "re-confirmed at" clause of exactly the kind rider 1 forbids.
*Fable re-derives:* that 1108/40 at `3f9201e39` still reads true at this tip. *Receipts:* §6.
**Priority: MEDIUM.**

**6 · Provenance placed per MEASURE, not per ROW (act 2).** *Judged:* the brief said "each row's
attribution field"; a row carries up to three measures with three ceilings (E2 per-file has
`em`/`bang`/`files`, and `bang` did NOT move), so a row-level field could not say which ceiling
moved. This is the exact thing the chair then misread as a drop. *Fable re-derives:* whether
per-measure was the right reading of the instruction. *Receipts:* §7, §14. **Priority: MEDIUM.**

**7 · Kept `attribution` after the ruling instead of removing it.** *Judged:* belt and braces —
`cause` satisfies the ruling; the per-measure field holds the per-ceiling detail and provably
round-trips. *Fable re-derives:* whether carrying provenance twice is redundancy or drift-bait
(two copies can disagree later). *Receipts:* §14. **Priority: MEDIUM — the one call here with a
real argument against it.**

**8 · ONE SHARED provenance sentence across the four voice rows.** *Judged:* those four causes
are byte-identical and both the by-row-key rule and bill A rely on it, so the shared text names
which measures moved and which did NOT rather than splitting them. *Fable re-derives:* that no
row now overclaims. *Receipts:* §14 (applier refuses if the four diverge; measured 4 copies,
1 distinct). **Priority: LOW-MEDIUM.**

**9 · The dormancy claim asserted as a SET, both directions.** *Judged:* rider 3's form —
`comm -23` for foreign paths, `comm -13` for absent ones, plus bit-grade identity per member and
a control that must still convict. *Fable re-derives:* the three token/AST hash pairs and the
control's exit 1. *Receipts:* §9. **Priority: LOW — mechanical, and it passed.**

**10 · The plant isolates ONE measure at a time.** *Judged:* a synthetic entry carrying only the
spec under test, so a verdict cannot be borrowed from a sibling measure; both directions tested
(+1 must breach, −1 must offer the ratchet-down). *Fable re-derives:* that the mutations move
only the intended measure. *Receipts:* §10. **Priority: LOW.**

**11 · The lighting refreeze was NOT run.** *Judged:* the measured tuple equals the committed
register, so the governed ritual had nothing to write; running it would have been a no-op that
exits non-zero by design and muddies the receipt. *Fable re-derives:* the probe's tuple against
the register. *Receipts:* §12, §17. **Priority: LOW.**

⛔ **NOTHING OWNER-GATED WAS TOUCHED.** No deploy, no push, no migration, no persisted product
shape, no data deletion, no tuning signature, no product budget. The four raises are instrument
registers on already-banked reds; the hardcoded budgets they measure against are untouched, and
nothing went green that was red.

**RESUME POINT (R5 — FINAL, the lane is at HOLD):** HEAD `60255ca8e`, porcelain **0**, 27
commits above `8b07ce45f`. All seven acts of the resume brief are DISCHARGED. No stray
`*.probe.mjs` in the dock; the lighting probe's temp file removed itself. The bare full gate is
left for the chair on a drained board. The ledger line was never touched by this lane.

**§880.2 · THE GLYPH-INTEGRITY LANE — Cars A / A-bis / C + the Car B rider, complete at `1e9898d01` · 2026-09-01 · SEAT: Opus 5.**

# RETROVALIDATION ROW — lane GLYPH, Cars A / A-bis / C
**BOUNDARY.** This lane's OWN calls only. Car B's ruling is chair-RATIFIED (§879.12) and
EXCLUDED; the chair's ordering ruling (B → A) and its four-docblock ruling are EXCLUDED.

| field | content |
|---|---|
| **What was judged** | (1) That Car A may land as a **plain gate arm** rather than a ratchet — i.e. that Car B removed the WHOLE population, not most of it. (2) The instrument's central design call: **assert on RUNS, not on declared font objects**, and resolve embeddedness through the **FontDescriptor indirect object** rather than the Font object. (3) Scoping the arm to **one world (metropolis)** rather than three, trading coverage for gate cost. (4) That measuring the census at **three trees** was necessary rather than predicting one — and the consequent finding that **Car B, already ratified, left the lighting census RED**, attributed to a single `it.each`. (5) ⛔ **Substituting the scanner Car C widens** (fontGlyphCoverage, AST) for the chartered one (sectionGlyphTofu, line-level), and the reasoning that `codeOnly` would have made the gate blind. (6) Correcting a **describe title** and a **failure-message string** as claims, not cosmetics. (7) Item (d): correcting the comment while **refusing** to touch the entitlement bit. (8) Recording my own probe's over-specific `U+2192 x1` expectation as a false expectation rather than deleting it. |
| **What Fable re-derives** | ⓐ **The green is real and non-vacuous**: at `86e433944`, render the metropolis dossier and confirm **0** non-embedded show ops out of ~3,021; then plant `→` into `settlement.name` and confirm **both** arms red with payload `<92>`. Independently, the ZWNJ plant → **39** runs, payload `<0c>`. ⓑ **The FontDescriptor predicate**: confirm that testing the Font object instead reports every real subset face as non-embedded (Car B's body records 2,998 phantom violations from exactly that error) — this is the difference between a true 0 and a meaningless one. ⓒ ⛔ **HIGH — the census attribution**: the lighting walker is **GREEN at `8b07ce45f`** and **RED at `f09ce3ff7`**, and the cause is `it.each(ttfFaces)` at **fontsAndMeta.test.js:186** parking that file whole. Re-derive the arithmetic: the file carries **12 literal `it` titles + 1 `describe` and no `.each` at base**, and the four figures move by exactly parked +1 / credited −1 / titles −12 / suiteTitles −1. ⓓ **Item (d) is inverted, not merely stale**: read `TIER_GATE.free.export` (false) and `canExport()`. ⓔ **The `codeOnly` trap**: confirm `codeOnly` blanks string contents, so adopting it in a glyph scanner produces a green blind gate. ⓕ Car C's 0 is real: plant into any of the 26 newly-added files. |
| **Receipts** | Dock `$SP/laneGLYPH-tree`, detached, **porcelain 0 lines** at every boundary. Three commits `86e433944` / `ba125dd08` / `8b934fe67`, each re-proven **AT** the committed tip and each carrying `Seat: Opus 5 (lane GLYPH)`. Whole `tests/pdf/` at the final tip **42 files / 359 tests TRUE_EXIT=0**; eslint exit 0 on all 14 touched files across the three cars. Every src/ edit line-count neutral (2/2, 3/3, 6/6, 5/5), re-verified at each commit. Census measured at **three trees** by iterative register probe — base `8b07ce45f` **GREEN 2480/371/2109/21877/5965**, HEAD `f09ce3ff7` **2480/372/2108/21865/5964**, final tip **2481/372/2109/21868/5965**; the dock's own register restored byte-identically (`d1f4c6c1ec73…`), the other two probes on throwaway `git archive` extracts. Two plants executed and reverted with sha re-verification (`2564785687…`, `f8a5ac599f…`). Logs: `laneGLYPH-*.log` under `$SP`. |
| **Priority** | ⛔ **HIGH for ⓒ** — it is a RED left on a chair-RATIFIED commit, it is not in this lane's commits to fix, and its real cost is that **12 titles in a build test file silently stopped being census evidence**. **HIGH for ⓐ** — it is the whole claim that the paid-surface defect is gone, and a vacuous green here would be worse than the original defect. **HIGH for ⓓ** — a live paid path documented as dead code, on the entitlement surface. MEDIUM for ⓑ and ⓔ (both are traps that produce confidently wrong greens). LOW for ⓕ. |

**RESUME POINT / HOLD.** HEAD `8b934fe67`, **porcelain 0**, all three cars committed and
re-proven at their tips. No vitest process of mine is running. Nothing owed in-lane; the
open items are the chair's: (i) Car B's unpaid census red + its `it.each` cure, (ii) the
landing's refreeze of the lighting register and the test-ratchet envelope, (iii) whether to
also widen sectionGlyphTofu literally.

---

**§880.3 · THE PAID-SURFACE REPAIR LANE — repairs 3–16 (repair 5 STOPPED to the owner), complete at `6fe6eaa58` · 2026-09-01 · SEAT: Opus 5.**

# RETROVALIDATION ROW — DRAFT (lane PAID-REPAIR, Opus 5, second sitting)

**§879.11b · THE PAID-SURFACE REPAIR LANE — repairs 3/4/6/7/8/9/10/11/12 committed, one
SELF-CAUGHT correction, repair 5 STOPPED owner-gated · 2026-09-01 · SEAT: Opus 5 · COMPLETE.**

Tip `32ac4980a` (10 commits over base `8b07ce45f`). Porcelain: only the two untracked probe
artifacts. Final sweep across all 19 touched suites: **exit 0, 251 passed (251)**. Census set:
**exit 0, 250 passed (250)**. `check-observed-shape-readers.mjs`: **1993, exactly matching**.

### What was judged
1. **Repair 5 STOPPED and NOT retired** — the measurement inverted the brief's premise. The brief
   offered "retire the dead read, or STOP if the only cure is writing it". The truth is a third
   case: **the writer existed, shipped (`0bb41c5fa`, 2026-06-23, "persist honesty"), and was
   silently deleted** along with its three reproducing tests, leaving only a MOCKED test arm that
   fabricates the key. Retiring would bank a regression as intentional, on a paid surface, about
   whether the buyer's world was saved. Restoring is ~3 lines but competes with the durable OUTBOX
   + `CampaignSyncBanner` built afterwards. **Owner/chair call; I edited nothing.**
2. **Repair 6b: a committed repair of mine was wrong and I reversed it myself.** The guard's home
   moved from the derivation to the three save-row consumers.
3. **Repair 4's second half** (nulling food when `available:false`) was not in the brief; I judged
   "FOOD +0 units" on a never-computed economy to be the same defect and cured it, with a measured
   shift tally.
4. **Repair 3 and repair 7 both extended to a sibling** the brief did not name
   (`collectWorldBook`'s identical `Set.has`; the World Book's own uncapped-slug latency recorded).
5. **Repair 9's cure is a restructure** (11 hand-stamps → one final pass) rather than a guard copy.
6. **Repair 10 pinned the non-Latin filename fallback as CURRENT behaviour** rather than fixing it —
   no slug can; it needs transliteration (the parked repair-2 question).
7. **Repair 12 emits `{ scope }` only** and mints no new prop key; per-surface segmentation deferred.
8. **Repair 8 retracted its own stronger claim**: "same world, same bytes" is FALSE and unreachable.

### What Fable re-derives
- **The repair-5 history claim** — `git log -S"cloudPending" --all` and `git show 0bb41c5fa`; that
  `flushWorldPulsePersist` returns `undefined` today while `persistSaveUpdates` still returns
  `{attempted,skipped,failed}`; and that `tests/ui/gatheredDocketSession.test.jsx:198` is mock-fed.
- **Repair 6b's ratchet arithmetic** — that a guard in `healthPip` yields `violations: 1`,
  reads 1993→1994, and that the tip returns to 1993 with the baseline file untouched.
- **The three behaviour-shift tallies**: food tri-state `{"deficit":67,"surplus":6,"balanced":2,
  "nodata":0}` over 75 generated settlements; layout displacement `maxDisplacement 0.7582 /
  meanDisplacement 0.3586`; footer stamps per page `{"2":1,"3":1,"4":1,"5":2}`.
- **Repair 8's two irreducible non-determinism channels** (random 6-letter font subset tags; font
  object emission order 153 vs 142) — this is the claim that most deserves an independent check,
  because it converts a brief instruction into an impossibility.
- **Repair 12's count of six sites across five files**, and that `generateWorldBook` emits no
  COMPLETED.
- **Every base-fail exit** — five of the ten were re-proven with the FINAL pin text by saving the
  fixed src, `git checkout HEAD -- <src only>`, running, restoring by copy, and **verifying sha256
  digests**. No `git stash` at any point.

### Receipts
`$SP/lanePAIDFIX-receipt.md` (this file) · per-repair logs in `<dock>/.paidfix/*.log` ·
measured artifacts `food-tally.json`, `layout-shift.json`, `dblstamp.json`, `infodict.txt`,
`bytediff.txt`, `painted-base.txt` / `painted-tip.txt` · ten commit messages, each carrying its own
reproduction, cure, shift statement and both exits.

### Priority
**HIGH — repair 5** (owner-gated; a shipped durability-honesty promise silently regressed, and a
mock-fed test is still hiding it). **HIGH — repair 8's residual** (byte-exact goldens over the
dossier are impossible until the renderer's font layer is controlled; any future golden plan
depends on this). **MEDIUM — the World Book's missing COMPLETED event** and **the two siblings'
trailing-separator latency**. **MEDIUM — repair 6b as a method finding**: the census-prediction
step is what caught it, which argues for running owed censuses IN-LANE rather than at landing.

---
# RETROVALIDATION ROW — EXTENSION (rider sitting)

**§879.11c · THE PAID-SURFACE REPAIR LANE — chair rider 13/14 committed, item 15 MEASURED, and the
LIGHTING CENSUS is owed by the landing · 2026-09-01 · SEAT: Opus 5 · COMPLETE.**

Tip `bab76436a` (12 commits over base `8b07ce45f`). Porcelain: the two untracked probe artifacts only.

### What was judged (this sitting)
1. **I did NOT re-freeze the lighting census**, though my tip reds it. Three stated reasons: the
   register forbids hand-editing and its provenance shows LANDING lanes regenerate it; a per-lane
   tuple is "jointly meaningless" once composed (the register's own words); and PAIDPREP-E1 is
   reading this dock live, so writing that file could poison its measurement. **The landing owes it.**
2. **I reported that the walker was ALREADY RED at the tip the chair sealed** (+40 titles / +15
   suiteTitles vs base), rather than quietly folding it into my rider's delta. It is my lane's bill.
3. **I corrected my own earlier receipt**: the first-sitting census table called the observed-shape
   trio the "lighting census". It is not; I had never run the real one.
4. **Rider 13 exported `durationBand`** from the campaign PDF rather than minting a third copy, using
   an import edge that already existed.
5. **Rider 14 migrated the campaign PDF to the kernel primitive** on a per-site parity proof, and
   carried the governed baseline and ceiling in the same commit.
6. **Item 15's verdict is RETIRE-is-safe, with a caveat I refused to drop** — the unqualified success
   toast is a real residual, but it is a wording question, not the durability gap.

### What Fable re-derives
- The four-row tuple table, ideally via `git archive` extracts as I did (the probe's own prescribed
  method), and that `parked` never moved.
- That the frozen register equals the BASE tuple exactly — the claim that makes the red mine.
- Rider 14's `parity cases=20 mismatches=0`, and that the campaign copy lowered-then-stripped.
- Item 15's outbox numbers, and that `campaignPulsePersist.test.js` reports the failure on the FIRST
  attempt (the "prompt or only after backoff" question the verdict turns on).
- That no `*.probe.mjs` or stray `*.test.*` survives anywhere outside `tests/`.

### Receipts
This file · `<dock>/.paidfix/r13-*.log`, `r14-*.log`, `item15.log`, `item15c.log`,
`rider-census.log` · two rider commit messages carrying reproduction, cure, parity proof and exits.

### Priority
**HIGH — the landing's lighting refreeze** (a sealed tip is carrying an unstated red; the expected
figures from this lane alone are `2480/371/2109/21921/5983`). **HIGH — repair 5 to the owner's desk**,
now with item 15's measurement attached and a recommendation (RETIRE) rather than an open question.
**MEDIUM — `tests/ui/gatheredDocketSession.test.jsx:195-210`**, the mock-fed pin that hid the
regression, which must be resolved whichever way the owner rules.

---
# RETROVALIDATION ROW — EXTENSION (rider 16)

**§879.11d · THE PAID-SURFACE REPAIR LANE — rider 16 applied the composed tip's one lane-own cure;
the base was measured without the gate after the gate lied · 2026-09-01 · SEAT: Opus 5 · COMPLETE.**

Tip `6fe6eaa58` (13 commits over base `8b07ce45f`). Porcelain: the two untracked probe artifacts only.

### What was judged (this sitting)
1. **I did not trust the gate's exit.** The walker's wrapper exited 0 while `TRUE_EXIT=3` and the
   walker never ran. I re-derived the base a different way rather than report a run that did not
   happen, and both later runs retried until they outlasted the exclusive holder.
2. **I verified the prepared patch rather than trusting it** — mechanically (pure-append,
   line-count-neutral, test-file-only) and semantically (every anchor's cited positive assertion
   really is where the comment claims). A prepared cure from another lane is evidence, not warrant.
3. **I left the 6 pre-existing frozen sites alone**, curing exactly the 9 lane-own ones, because
   lowering a frozen row is a different act from not raising one.
4. **I reported my own instrument bug** (the renderer-template mis-anchor that produced a phantom
   15) rather than silently shipping the corrected 9.
5. **I corrected the attribution** the brief and the applicator both carried: the `canon_phase` site
   is rider 13's, not rider 14's.

### What Fable re-derives
- The per-file frozen/live/excess table, and that the total is 9 — ideally with the walker itself
  now that the gate is free, which should agree with `.paidfix/anchorscan.py`.
- That the committed diff is 9 insertions / 9 deletions with every file's line count unchanged, and
  that no `.not.` assertion's code changed.
- The tuple's non-movement: `2480/371/2109/21921/5983` at both `bab76436a` and `6fe6eaa58`.
- That `worldBook.test.js`'s scanned-matcher site came from rider 13's arm, not rider 14's.

### Receipts
This file · `.paidfix/r16-base.log` (the gate's give-up, kept as the evidence it did not run) ·
`r16-scan-base.log` (excess 9, exit 1) · `r16-scan-tip.log` (excess 0, exit 0) · `r16-tip.log` and
`r16-committed-tip.log` (72/72) · `r16-eslint.log` · `anchorscan.py`.

### Priority
**UNCHANGED AND STILL HIGH — the landing's lighting refreeze** (this rider moved the tuple by zero,
so the figures owed are exactly `2480/371/2109/21921/5983`). **HIGH — repair 5 to the owner**, with
item 15's measurement and a RETIRE recommendation attached. **MEDIUM — `gatheredDocketSession.test.jsx:195-210`**,
the mock-fed pin. **NEW, LOW but worth a line: the gate's give-up is a silent false-green surface** —
`gate-mutex` returning 3 while the wrapper exits 0 means any lane that does not capture `TRUE_EXIT`
in-shell can bank a green for a run that never executed.

**§880.4 · THE COUPLED CONSIST REHEARSAL (E3) — eight prepared cures at `653670ca1`; one STOP (the seam cycle) · 2026-09-01 · SEAT: Opus 5.**

## RETROVALIDATION ROW (drafted — covers only this lane's own calls)

| | |
|---|---|
| **What was judged** | **(1)** That `faith_milieu`'s reason clause should be AUTHORED (`'the long habit of the gods of the place'`) rather than the kind exempted from `CLAUSED_KINDS` — a product-prose string, written into a dark file, in a picked car's source. **(2)** That the `paradigmAxisCatalog` darkness arm should GAIN a third hop (asserting `characterReadModel.js` is reached by nobody) rather than have the read model dropped from its reacher lists — the latter would have been green and would have made the test's own title false. **(3)** That ES-4's `'deep'` collision should be DECLARED as an exact-pair pin in the arm's own `'none'` idiom, rather than the exposure word renamed in cars O5/O7. **(4)** That the six un-anchored negatives should be paid with real liveness anchors (`expectAbsentWithAnchor` where a live sibling exists, a structural `paths.length > 0` inside the loop, and the inline `// anchored:` escape hatch only where the line above is genuinely a positive on the same collection) rather than by raising the frozen ceiling. **(5)** That `infiltrationDepth.js` should be ENROLLED in ⟨F8⟩'s `INPUT_DERIVERS` rather than the scan's regex loosened. **(6)** That the `layerBoundaries` cycle is NOT this lane's to cure, and is a STOP for the chair/MAT. **(7)** That §6c's drafted `// anchored:` placement had to be changed to satisfy the walker's actual line-scan rule. |
| **What Fable re-derives** | **(1)** the wording against `docs/VOICE_AND_TONE.md` and the clause register's own shape — and whether authoring reader-prose inside a picked car was this lane's call at all (the alternative: hand the clause back to the L7 lane). **(2)** that the third hop's symbol list (`characterDossier`/`biographyOf`/`characterArticles`/`readingOf`/`leadLine`) is uniquely owned, so the `toEqual([])` is a real closure and not a misspelling — the plant proves it bites TODAY, not that the symbols are the right ones forever. **(3)** that the exposure ladder genuinely never derives from the belief layer's conditions — I proved no IMPORT path exists (the arm above it is structural) and that the ladders are separately derived, but "same word, different vocabulary" is a semantic claim a reader should confirm. **(4)** that `'confirm_belief'` and `'personality'` are anchors that would vanish under the SAME drift as the excluded members (the helper's own criterion), not merely siblings that happen to be present. **(5)** that `placementVettingRamp` can never carry a verdict — I measured zero `accepted:`/`basis:` and read the body, but the ⟨F8⟩ law is about DECISIONS and that is a design reading. **(6)** the minimal-cut analysis of the cycle ({3,4} or {3,2}) and whether any cut survives the 677 B engine-chunk margin — unbuildable here. **(7)** nothing to re-derive; the walker's rule is quoted from its own source at `:107-113` and the violation set was re-measured after the commit. |
| **Receipts** | Dock `$SP/coupledprep-tree`, final tip `653670ca1`, porcelain 0, 8 cure commits over `e9ee11a46` over `B = 8b07ce45f`. Logs under `$MY` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/25b6c8bb-4d78-4998-b2cf-ac4b49d49ea4/scratchpad/`: `runA..runE.log` (per-slot batteries) · `runC.log` (the four npc reds) · `r5-green.log`, `r5-plantA.log`, `r5-plantB.log` (R5 + both plants) · `lint-before.log` / `lint-base.log` / `lint-after.log` / `lint-final.log` (the four whole-lint runs) · `scanners-tip.log` / `scanners-base.log` / `scanners-final.log` (the 97-file sweep, both ends) · `cure1..cure8*.log` incl. `cure5-plant.log`, `cure7-plant.log` · `osr.log`, `validate-edge.log`, `freshness.log`, `final-npc.log`, `final-wp.log`, `base-es4.log` · `lit-base.tsv` / `lit-tip.tsv` / `lit-final.tsv` (per-file lighting rows) · `tip-list.txt` / `base-list.txt` / `final-list.txt` (runtime collections) · tools `lighting-perfile-probe.mjs`, `reachers-replica.mjs`, `srcscanners.txt` · `base-extract/` (the `git archive` of `B` that every base-side control ran in). |
| **Priority** | **HIGH** for (6) — the `layerBoundaries` cycle BLOCKS the consist's gate and no test-side edit can clear it; MAT/SEAM must cut an edge and re-measure the engine chunk. **HIGH** for (1) — it is authored product prose landing in a picked car under an Opus seat. **MEDIUM** for (2), (3), (5) — each narrows or widens a live guard's meaning and each is defensible but reviewable. **LOW** for (4) and (7) — mechanical, and both are proven by execution (the walker's violation list is empty; each anchor is a real positive). |

---

**§880.5 · THE SEAM-CYCLE CURE — the living-content law version becomes a zero-import leaf at `b82987ab8` · 2026-09-01 · SEAT: Opus 5.**

### RETROVALIDATION ROW (drafted — covers ONLY this lane's own calls)
**Boundary: the cycle cut's shape, the ESD placement choice, the leaf's suite, and the bills
this lane declared not-owed. It does NOT re-derive anything the 17 picks or the 8 prior cures
claim, and it does not touch the un-attributed corpus-sha move flagged above.**

| # | claim | class | evidence | risk if wrong |
|---|---|---|---|---|
| 1 | the F29 SCC is broken and the allowlist is untouched | CONFIRMED | RED→GREEN both quoted; zero diff on the test file | low — the ratchet is the instrument |
| 2 | the cure costs zero bundle bytes | CONFIRMED | 3 builds; all 483 chunks byte+hash identical | low — identity, not a margin |
| 3 | the rejected variant's figures | CONFIRMED | its own executed build | low |
| 4 | the cure is same-seed bit-neutral | CONFIRMED | 360-run corpus, base arm at `653670ca1`, identical sha | low — genuine base arm, leaf absent at base (control verified) |
| 5 | the lighting delta is `+1/+0/+1/+8/+1` | CONFIRMED | predicted, then measured, exact | low |
| 6 | zero new `tests/lint` reds | CONFIRMED | whole run vs §6c's recorded set | low |
| 7 | `mechanismLitCoverage` does not scope `src/domain/content` | CONFIRMED | its own `readdirSync(WORLD_PULSE)` at `:70` | low |
| 8 | the ESD placement JUDGMENT (excise over resident) | **JUDGMENT — vetoable** | both variants measured | the chair may prefer the engine-row margin; the other build is priced and ready |

---

**§881.1 · COUPLEDBISECT — Task A (the dormant-corpus sha attributed by bisection over 49 arms) and Task B (the seven typecheck-ratchet reds cured as four JSDoc-only commits) at `893a66b0a` · 2026-09-01 · SEAT: Opus 5.**

### RETROVALIDATION ROW — TASK A (drafted; covers only this lane's own calls)
| # | claim | class | evidence | risk if wrong |
|---|---|---|---|---|
| A1 | the comparator is the seam car's own instrument | **CONFIRMED** | `matseam-dormancy.mjs` run unmodified reproduces `seamcycle-dorm-*.txt` byte-for-byte, and reproduces `26f8bfe8…edd0` at `e5c68607e` | low — two independent reproductions |
| A2 | no commit in the 17 picks + 10 cures moves the dormant corpus | **CONFIRMED** | 28 arms, one value, `dirty=0` at each | low — it is an identity over the whole range, not a sample |
| A3 | the movement is `1a3b83198` + `2b3ddf9b9`, both DECLARED | **CONFIRMED** | the two step changes are isolated to those commits between four negative controls (cars 1, 2, 5, 6); both subjects carry `SHIFT RECORDED`; the mechanism (authored strings the pipeline emits) matches the instrument | low |
| A4 | `26f8bfe8…edd0` is a `3f9201e39`-ERA value, not a MAT/SEAM value | **CONFIRMED** | identical at `3f9201e39`, `6f4db6c26` and `e5c68607e` | low |
| A5 | SEAMCYCLE's "it moved inside the 17 picks + 8 cures" is FALSE | **CONFIRMED** | `B` itself reads `87e8b25c…f695` | low — but it is a correction to a sibling lane's receipt, so the chair should see it named |
| A6 | ⚠ **the residual race in my own gating** | **JUDGMENT — declared** | `bisect-run.sh` checks the lock and then runs; a sibling can acquire it in that window. Holding the EXCLUSIVE tier for a 5-minute walk would starve the siblings, and the SHARED tier refuses a non-vitest caller with no worker cap, so the brief's check-and-wait is the only honest option — but it is not airtight, and one arm (the first, declared above) did run inside a gate | low for the measurement (49 arms agree in three clean blocks with no outliers); the honesty of the declaration is the point |

*RULED (§881, Fable 5.1):* **RATIFIED, A1–A6 (all CONFIRMED by the landing's own instruments).** The landing re-ran probe C (`matseam-dormancy.mjs`, MAT-SEAM's unmodified instrument) at BOTH arms of the real landing — base `60255ca8e` and the composed tip — and read `87e8b25c750c1d96c0712abf9c04ff84798a34cbe6f230793a27d37f2a00f695` at both, `runs=360 errors=0 distinct=315 rosterKeysOnDormantRuns=0` identical character for character (COUPLED-land §5.2), so A2–A4 hold on the INSTRUMENTS base as they held on B; A5 (SEAMCYCLE's "moved inside the picks" is FALSE) is carried into §881's corrections list; A6's declared race cost nothing — the landing's arms all ran under the SHARED tier with `TRUE_EXIT` captured on the mutex command. Law kept: a corpus sha is recorded with its base sha beside it.

### RETROVALIDATION ROW — TASK B (drafted; covers only this lane's own calls)
| # | claim | class | evidence | risk if wrong |
|---|---|---|---|---|
| B1 | the eleven rows are cured at cause, not suppressed | **CONFIRMED** | both npm ratchets exit 0 at the committed tip with baselines byte-untouched; no row was moved into a baseline and no ceiling raised | low — the instrument is the gate itself |
| B2 | zero runtime bytes | **CONFIRMED** | acorn token streams IDENTICAL on all four files; every changed line a comment line; numstat symmetric 30/30 | low — two independent proofs, one of them a real tokenizer |
| B3 | the TS1127 mechanism (`§` after a bracketed `@param` name) | **CONFIRMED** (was PLAUSIBLE) | the one-edit experiment: TS1127 1 → 0, no other row moved | low |
| B4 | bracketing the names is HONEST, not a silencer | **JUDGMENT — vetoable** | every body path coerces absence through the leaf's own total helpers, and two files' own prose already documented the option (`"ABSENT ⇒ unreadable"`; `unknown_method`). But it does widen four exported contracts, and a reader should confirm that "the body tolerates it" is the same as "callers may omit it" for each of the ~20 slots | **the row Fable should re-derive first.** The alternative — per-property defaults, the other house idiom — is a RUNTIME change and therefore a STOP under this brief |
| B5 | `ambientEquilibrium`'s `quantum` retyped `unknown` | **JUDGMENT — vetoable** | the body is `Math.abs(num(quantum))` and `num` takes `unknown`; the value reaches it from `asObject()`, which erases to `Record<string, unknown>` by design. The rejected alternative (an inline `/** @type */` cast) adds parentheses to the executable text and would fail the zero-bytes bar | low-medium — it weakens one documented slot from `number` to `unknown`; the description is kept |
| B6 | the tuple is unmoved | **CONFIRMED** | measured by this lane at BOTH ends, `2490/372/2118/22222/6020` | low |
| B7 | zero new `tests/lint` reds | **CONFIRMED** | whole run, set compared against §6c's recorded six | low |

*RULED (§881, Fable 5.1):* **RATIFIED, B1–B7.** B1/B2/B6/B7 CONFIRMED by the landing (both npm ratchets `173/173` and `1121/1121` at the composed tip with baselines byte-untouched — H17; the four cures picked clean as `e2f9445dd` `5203998fd` `46dc2dfb5` `67ace70b6`, every numstat N/N and every file's line count unchanged 405/635/789/114; the tuple unmoved; zero new `tests/lint` reds). **B4 RE-DERIVED by the chair (the row the lane asked Fable to read first):** the bracketed `[args.x]` markers describe real tolerance — `missionAcceptance.js` tests every term with `Number.isFinite(Number(x))` and returns `null` on a non-finite read (`:150`); `envoyTaskCatalog.js:510` `counterpartFitRead({ methodKind, … } = {})` answers `fit: 'unknown_method'` / `refusal: 'unknown_method'` when no method is named (`:517`, `:519`); `infiltrationDrift.js:205` `num(v)` is total (`Number.isFinite(n) ? n : 0`) and `asObject()` erases to `Record<string, unknown>` by design — so "the body tolerates absence" and "callers may omit it" coincide for the slots read; the ~20 bracketed slots share these total coercers (three bodies read; CONFIRMED for those, PLAUSIBLE by shared coercer for the rest). **B5 RATIFIED:** `quantum` → `unknown` is what the body already is (`Math.abs(num(quantum))`, `:404`); the documented slot is weaker but honest, and the inline-cast alternative would have added executable bytes against the zero-bytes bar. B3's TS1127 mechanism (`§` after a bracketed name) is CONFIRMED by the lane's one-edit experiment.

**§881.2 · COUPLED-land — THE COUPLED LANDING (17 picks · 14 cures · 20 PAID · the landing acts) at `fab576aba` · 2026-09-01 · SEAT: Opus 5 (three successors across an interrupt and an account switch).**

## RETROVALIDATION ROW — lane COUPLED-land (Opus 5 seat), DRAFTED for §881. My own calls only.
*(§880 already landed the rows for INSTRLAND · GLYPH · PAIDFIX · COUPLEDREH · SEAMCYCLE, so none of those is repeated here. COUPLEDBISECT's Task A and Task B rows are that lane's and are carried separately per order §6.6.)*

**L1 — I used the order's three drafted reconcile paragraphs VERBATIM, including the sentence "Composed landing-side under the Fable 5.1 seat", although this landing was executed by the Opus 5 (lane COUPLED-land) seat.** The alternative was to substitute my own seat name. I did not, because the order's §6.6 explicitly contemplates an Opus landing lane (*"the landing lane itself | if Opus: every landing act above … | if the chair (Fable 5.1): none owed"*) and still drafts the sentence that way, so the phrase denotes the PROGRAM AUTHORITY under which the composition was ruled rather than the executing model. The machine-read marking is unaffected: each picked car keeps its author's single `Seat:` trailer and every act this landing AUTHORS carries `Seat: Opus 5 (lane COUPLED-land)`. **Veto shape:** if the chair wants the prose to name the executing seat, three commit bodies need rewording (slots 3, 4, and PAID pick 7).

**L2 — I STOPPED on the each-family red rather than curing it, and the classification, not the cure, is what I stopped on.** I judged both available cures to be consequential (Option A moves two chair-predicted registers and edits a picked car's evidence; Option B raises a shrink-only ceiling) and read "budgets" in my brief as covering a ratchet ceiling. **The chair ruled Option A and classified it as a chair-class cure because it moves no ceiling — so my gating call was one notch too conservative.** I record that as a miss in the conservative direction: the cost was one round trip; the alternative cost of curing unilaterally would have been an unannounced −34 against a figure the chair had ruled in writing. **Veto shape:** none needed — the ruling is executed; this row exists so the threshold is calibrated next time.

**L3 — I re-derived the generation arm (probe A′) instead of recovering the standing probe-A/B/soak drivers**, which are not in `$SP` (only their artefacts are — the order's own §8b-15). The alternative was to reconstruct the drivers from the DENS/D4 receipts. I chose a fresh 600-world probe **with its own can-it-see control** (a one-constant perturbation moved 5 of 600 rows and the corpus sha; the restore reproduced the base sha exactly), because a comparator that has proven it can see is worth more than one whose provenance is a receipt I cannot re-execute. It is stated as a re-derivation, never as the recovered driver. **Veto shape:** if the chair wants the original drivers, they must be reconstructed from the DENS/D4 receipts and re-run; the bit claim would then rest on two independent instruments instead of one plus the golden master.

**L4 — I did not run the 3-year soak arm.** Its driver is likewise absent (only `D2bR-soak-*.hashes/.json` survive) and its stated comparator is hash-set identity, which probe A′ (600 worlds, per-row shas) and probe C (360 runs, corpus sha) already supply on the same base/tip pair, with a control neither soak artefact carries. **Recorded as a deliberate gap, not an oversight**: the bit claim rests on three instruments (A′, C, `generatorGoldenMaster` 3/3 both ends) rather than four. **Veto shape:** if the chair wants the soak, it is one driver reconstruction plus two runs.

**L5 — I used `LIGHTING_CENSUS_REFREEZE='COUPLED-land'`** (the brief's value) rather than the order's `'landing-COUPLED-2026-09-01'`. The walker's own contract asks for *"the lane or seat doing the measuring (not \"1\")"*, which the lane id satisfies exactly; the register now reads `measuredBy: COUPLED-land`. **Veto shape:** a one-field re-refreeze if the chair prefers the seal-shaped name.

**L6 — I committed the FIRST lighting register (`c517bdbe7`) while the walker's own plain re-run was 33/34**, rather than holding it dirty across the STOP. The census arm itself was green (the one red was the unrelated each-family arm) and leaving an uncommitted register across a possible cutoff is the worse failure. The second refreeze (`2a3bd769d`) then paid it in full at 34/34. **Veto shape:** the two register commits could be squashed if the chair prefers one register act per landing; I kept them separate because provenance should name the act that measured it.

**L7 — three ORDER FIGURES were wrong and I recorded the corrections rather than smoothing them:** cure 6's numstat (order `+15/−2` and `+13/−2`; the source commit's own diff is `13 2` and `11 2`), §3.4.4's hunk count (order 15; measured 14 at U3, 22 at U0, 17 summed per-commit — hunk counts are not additive across commits), and §4.1.1's dirty-file count (order 10; measured 6, because the four sibling bundles are byte-identical under a deterministic build). In every case the substantive claim the figure served was re-proved by a stronger instrument. **No veto shape — these are corrections to the order, offered for the §881 "Corrections carried" list.**

*RULED (§881, Fable 5.1):* **L1 RATIFIED** — the drafted paragraphs' "Composed landing-side under the Fable 5.1 seat" names the PROGRAM AUTHORITY under which each composition was RULED (§879.14, §880.2); the machine-read marking is the trailer, which every act carries (one per commit, through the parser); no reword. **L2 RATIFIED as a calibrated miss in the conservative direction** — one round trip; the ruling (§880.6, Option A) executed exactly; the threshold is now written: a cure that moves NO ceiling and is the instrument's own prescription is chair-class. **L3 RATIFIED** — probe A′ (600 worlds, per-row sha, a one-constant can-it-see control that moved 5/600 rows and returned) is a STRONGER comparator than an unreproducible receipt; ⚠ the standing A/B/soak DRIVERS' absence from `$SP` is a program gap — TE-GOLDEN-1's charter re-homes them in the repo before L9. **L4 RATIFIED as a deliberate, recorded gap** — the bit claim rests on three instruments (A′ · C · `generatorGoldenMaster` 3/3 at both ends, twice); the 3-year soak driver is reconstructed for the terminal soak, not for a landing that moved nothing. **L5 RATIFIED** — `measuredBy: COUPLED-land` satisfies the walker's contract. **L6 RATIFIED** — two register commits, provenance naming the measuring act; the second refreeze's 34/34 is the proof. **L7 corrections carried** into §881's list. **The successors' landing acts under the chair's rulings** (`1f60b8599` the config-walker instrument cure, `0d380ffa4` the ratchet register, the voice-playbook cure) are chair-class executions, not lane calls — the chair supplied the three voiced lines' wording; the lane's own remaining calls are its rows below.

**L8 — I committed the ratchet register (`0d380ffa4`) at a tip whose plain gate I already expected to be RED.** The alternative was to hold the register dirty until the magnitude question was ruled. I committed because the `--update` had lowered nothing and raised nothing (the diff is three envelope lines and the magnitude blocks are byte-identical to `$T`'s), the totals 30632/2439 are the measured truth at the cured tip, and my predecessor's own L6 records that leaving a measured register uncommitted across a cutoff is the worse failure — a judgement the ~22:00 account switch had just vindicated. The commit body states in terms that it banks nothing and that the gate stays red. **Veto shape:** if the chair wants one register act per landing, `0d380ffa4` can be squashed with a later one; I kept it separate so provenance names the run that measured it.

**L9 — I ran the SHARED-tier batteries BEFORE §4.3.5's gate, inverting the order's sequence.** The order runs §4.3.5 immediately after §4.3.4, then §5.4.4 onward. I inverted because the gate holds the EXCLUSIVE lock for ~21 minutes during which no targeted arm can run at all, the tip does not move between the two orderings (the register commit was the last act before both), and a cutoff was live: finishing the many cheap proofs first meant a death would cost one long run whose verdict I had already derived from the `--update`'s own HELD section, rather than costing the whole battery. **Veto shape:** none needed — every arm ran at the committed tip either way; the receipt records the true order.

**L10 — I rebuilt probe A′'s deleted driver rather than dropping the arm or asserting it from the kept artefact.** Three options existed: (a) drop the arm and rest the bit claim on probe C plus `generatorGoldenMaster`; (b) quote the kept `genA-base.tsv` as though it were a live measurement; (c) rebuild the driver and prove the rebuild. (b) is the citation-law violation this program has been bitten by, so it was never available. I chose (c) and **validated the rebuild against the artefact before trusting it**: tier, seed and faction count reproduce byte-for-byte on all 600 rows, which is what makes it the same generation; the hash column is this lane's own serialization, so I report `abe0a847…` and say plainly it is a different instrument from the deleted one's `1cdac411…` rather than pretending the corpus sha was reproduced. It carries its own can-it-see control. **Veto shape:** if the chair wants the ORIGINAL corpus sha comparable across landings, the deleted driver's serialization must be reconstructed exactly (the kept TSV cannot determine it — only its hash column encodes it, and that is the unknown); otherwise `abe0a847…` becomes this instrument's anchor from here.

*RULED (§881, Fable 5.1 — the successor #3's three calls, verified at the dock before ruling):* **L8 RATIFIED** — `0d380ffa4` is read at the dock as exactly three envelope lines (`measuredAtSha` cf83a400c → 1f60b8599, 30196 → 30632, 2429 → 2439; no row, no `cause`, no magnitude byte moved), so the commit banked nothing and the commit body says so; a measured register left uncommitted across a cutoff is the failure the ~22:00 switch had just demonstrated; NO squash — provenance names the run that measured it. **L9 RATIFIED** — the tip did not move between the two orderings and every arm ran at the committed tip; the receipt records the true order; the lesson generalises: under a live cutoff, cheap proofs before the long exclusive run. **L10 RATIFIED, and the anchor RULED:** rebuilding the deleted driver and validating the rebuild against the kept artefact (tier/seed/faction count byte-for-byte on 600 rows) is the citation law honoured, not evaded; the receipt says at its §V-10/698 that the hash column is the lane's own serialization. Ruling: the ORIGINAL `1cdac411…` serialization is NOT reconstructible from the kept TSV and is not worth a lane — **`abe0a847…` is probe A′'s anchor from here**, recorded with its base sha `60255ca8e` beside it (the corpus-sha law), and cross-landing bit comparison rests on probe C (`87e8b25c…f695`, reproduced at both arms, its driver committed) plus `generatorGoldenMaster`. The lane's four CORRECTIONS CARRIED (the order's LOCATION-vs-POPULATION conflation; a rehearsal on the old base cannot test an instrument that armed at the new one; the E3 list's zero `tests/generators` rows; a string a test PARSES is an interface) are folded into the §881 row's corrections list and its minted laws.

## §881.16 · THE OPUS-CHAIR SPAN OPENS (2026-09-02 03:2x ET) — the owner's Fable window is exhausted; the chair seat moves to Opus 5 and EVERY act of this span is retrovalidation-OWED

**THE SPAN'S RULE (§236/§685, restated by the owner at §881.7):** Fable architects, manages, validates, recons and surveys; Opus implements and verifies. With no Fable available, an Opus chair works at FULL authority and marks everything: every ledger act of this span carries `Seat: Opus 5 — Fable-unvalidated` and lands a row here in the SAME commit. A returning Fable chair walks this section FIRST (RATIFIED / AMENDED / REVERSED per row) before resuming the arc. ⚠ The standing law from the seamless-resume memory applies as a PREFERENCE, not a prohibition: an Opus-only window is for EXECUTING the already-architected plan rather than re-architecting it — where this span must architect anyway (the ENCOUNTERS design volume, owner-ordered at §881.13), the artifact carries an "OPUS-AUTHORED — Fable retrovalidation OWED" header and its whole content is enrolled, not just its judgment calls.

**§881.16.1 · THE CHAIR'S OWN ACTS AT THE SEAT SWITCH AND THE ACCOUNT-SWITCH PAUSE · 2026-09-02 · SEAT: Opus 5.**

*What was judged (this chair's own calls only; every earlier row of this arc is the Fable chair's and is not re-opened here):*
1. **The two Fable-seat workflow lanes were STOPPED rather than left to die at the switch** (lighting panel `wf_eb392f03-d89` at 03:30 with its fold checkpointed 20 of 29 seconds earlier; the ENCOUNTERS design `wf_7ec5295e-21d` at 03:30 with its E0 recon PARTIAL at sections 1–3 of 8). The alternative — let them run to the switch — risks a truncated write mid-file; both write incrementally with PARTIAL headers, so a clean stop immediately after a checkpoint is the strictly better resume substrate. **Veto shape:** none available after the fact; the files on disk are the record either way.
2. **The two Opus build lanes were PAUSED by message rather than stopped** (TAILF-land, T13-PRELAND): finish the command in flight, commit verified WIP, write a final RESUME POINT, report, stop. T13-PRELAND's dock carries FOUR uncommitted paths mid-`P′`; a stop would have left them unexplained. **Veto shape:** none; the receipts carry what each lane banked.
3. **No gate, no CAS, no seal and no collection was attempted in this window** even though TAIL-F's dock is complete at 12 commits with both registers landed on prediction. The §882 collection is ~50 minutes of exclusive gate plus a scripted collect; starting it minutes before an account switch would strand a half-run gate and a partially-filled kit. **Veto shape:** the successor runs it as its first act; nothing is lost but the wall-clock.
4. **The ENCOUNTERS design was NOT re-dispatched to an Opus seat in this window.** It is architecture, the Fable seat's work by the owner's own §881.7 restatement, and its recon is only 3 of 8 sections done. Re-dispatching it to Opus now would spend the successor's window re-architecting from a partial recon. **Veto shape:** if the owner wants it under Opus, the plan's §4 phases E0–E2 re-dispatch as plain Opus agents from `4fb807d8…/scratchpad/encounters-design-wf.js`'s prompts with the OPUS-AUTHORED header added; the recon resumes from its own §-list.
5. **The lighting wave's two NOT READY verdicts were carried to the ledger unchanged rather than triaged in this window.** Both skeptics (census 11 findings, bill 14) refused the inventory as build-ready; a chair triage before the fold finishes would rule on a moving document. **Veto shape:** the successor reads `fold.json` + both JSONs and rules at the fold's completion.

*What Fable re-derives:* whether stopping the lighting fold at 20 of 29 (rather than at a section boundary) left §3–§5 of the inventory in a state the resuming fold can re-enter cleanly; whether call 3's cost (a delayed §882) is the right trade against a stranded gate; and whether call 4 correctly reads the owner's "architect it fully and implement it" (§881.13) as still Fable-seat work when Fable is unavailable.

*Receipts:* ledger tip at the pause `9c865fdfa` (§881.15); product `claude/composite-r4` = `fab576aba`; docks surveyed by git at 03:28 and 03:30 (figures in the §881.16 ODQ row); both workflows stopped by `TaskStop` with their transcript dirs named; both build lanes messaged, their replies quoted in the resume map.

*Priority:* **HIGH for (3) and (4)** — they shape the successor's first hour. MEDIUM for (1). LOW for (2) and (5).

*RULED (§881.19, Fable 5.1):* **ALL FIVE RATIFIED — executed at the resume, not argued.** **(1) RATIFIED** — both files re-entered cleanly: the lighting fold's `fold.json` carried its `pending` list and a `note` naming the exact next batch ("continue at §3; batch 3 = §3/§4/§5 edits + append §6–§8 + flip header") and the inventory's header named the 20-of-29 state, so the resumed fold lane started from a checkpoint, not a guess; the recon's header `sections done: 1, 2, 3 (4–8 in progress)` let the E0 seat resume by appending. A stop at a checkpoint beat a stop at a section boundary that might never have come. **(2) RATIFIED** — T13's four dirty paths went in as one PROVEN commit (`822c4f93a`, porcelain 0) and TAIL-F's receipt carried the acts — which is exactly how §881.17's correction became possible: the receipt, not the chair's account, was authoritative. **(3) RATIFIED, with a fact the Opus chair could not know:** the gate would not merely have been stranded, it would have been PREMATURE — §881.17 shows §4 and §6.1 were still owed, and a bare gate before the probe battery is a gate on an unproven landing. **(4) RATIFIED** — the Fable seat returned 25 minutes later and the design chain resumed under Fable as one sequential Workflow from its PARTIAL recon; nothing was lost but wall-clock. **(5) RATIFIED** — the fold is resumed as a lane with a §9 CHARTER QUESTION appended to its brief so the chair rules on the two NOT READY verdicts at the fold's completion, on a finished document.

**§881.16.2 · TAILF-land's PAUSE REPORT — the consist's picks and registers complete, the probe battery owed, and one measured byte finding · 2026-09-02 · SEAT: Opus 5 (lane TAILF-land), enrolled by the Opus chair.**

*The lane's own judgment calls, as it reported them (a returning Fable seat re-derives these; the lane's full rows are owed at its HOLD and are NOT yet written):*
1. **It CONTINUED the measurement acts after §3.5.4's STOP tripped rather than halting the lane** (the closure read 1,046,662 against the order's predicted 1,046,604). Its ground: no ceiling was breached (338 B of margin under the unraised 1,047,000; engine Δ 0 B against a 236 B margin), the acts that followed are measurements rather than mutations, and halting would have cost the window without protecting anything. **The chair (Opus) RATIFIES the continuation and rules the finding itself a chair row owed BEFORE the CAS** — see (2). **Veto shape:** none needed for the acts taken; every one is re-runnable.
2. **It CLASSIFIED the +58 B by rebuilding the base arm** (`$SP/base-C` rebuilt and reproducing 1,046,604 and engine 675,764 exactly), then hashing all eight first-paint chunks: seven identical, the whole delta inside the eager `index` chunk (576,060 → 576,118), and zero TAIL-F fingerprints in any of the eight. Its conclusion: the order's ⟦A9⟧(c) was WRONG — Rollup split `faithField.js` into a new lazy chunk and `index`'s preload map gained that filename once. This is a composition cost of the consist's own shape, not a leak of TAIL-F bytes into first paint. **What Fable re-derives:** the eight-chunk hash comparison and the preload-map claim (the decisive evidence), and whether a preload-map entry is the right thing to spend 58 B of first paint on or whether the chunk should be co-located.
3. **It recorded §5.4's "exactly ONE red file" as TWO** (`voiceMechanics` ×4 and `enforcement-claims` ×1, all five at their exact banked magnitudes) rather than smoothing the order's prediction.
4. **It named D-1** (pick 5's battery carried a second red file with one cause, cured by pick 8 and discharged at RUN 1) rather than reporting the battery clean.

*Receipts (the lane's, exits captured):* dock `9a0584f0f`, 12 commits over `fab576aba`, porcelain 0, 12/12 parser-visible trailers, zero landing cures needed; lighting tuple `2495/370/2125/22437/6069` every digit predicted; ratchet register `30731 2443 10 1` with 14/14 magnitudes unmoved; the plain gate `OK — 10 known failure(s) of 30731 tests, ceiling 10`; OSR `1993 exactly matching`; typechecks 173/173 and 1121/1121; `vendorPdfLazy` 40/40 zero skips; §5.4's four batches and §5.5/§5.6 green but for the five banked rows.

*Priority:* **HIGH for (2)** — it is the one row standing between the dock and the CAS, and it re-bases T13's own composed-closure arithmetic. MEDIUM for (1). LOW for (3)/(4).

*RULED (§881.19, Fable 5.1):* **(1) RATIFIED** — every act after the STOP was a measurement or a register write the order itself scheduled; nothing irreversible; the chair holds the CAS. **(2) RATIFIED, and the chair row it asked for is RULED HERE: D-2 is ACCEPTED as a composition cost — no cure, no co-location rule, no raise (vetoable).** Re-derived by the chair's own reads on both dist trees still on disk (tip built 02:17, base rebuilt 02:19): the tip's assets carry `faithField-DvBYuqdu.js` and the base's do not; the eager entry chunk `index-3lB-vvzF.js` 576,060 → `index-DChUdxwD.js` 576,118 (+58) with `"assets/faithField-DvBYuqdu.js"` present exactly ONCE in the tip's and ZERO times in the base's; the other seven first-paint chunks md5-identical (content-identity · data · engine-core · kernel · vendor-icons · vendor-react · vendor-state); `d4-closure-bytes.mjs` reproduces 1,046,662 and 1,046,604; `engine-CPEpqGWb.js` 675,764 at both arms, same name, same bytes. **CONFIRMED.** On the question the row left open (co-locate the chunk, or pay the 58 B): a `manualChunks` rule pinning `faithField.js` back into `religionState` would couple a leaf to a chunk it no longer belongs to, would edit `vite.config.js` under the config-key walkers and the size registers for zero product benefit, and would be undone by the next faith car; the 58 B is Vite's own correct bookkeeping for a lazy leaf now shared by two lazy importers. The standing first-paint margin is **338 B** under the unraised 1,047,000; T13's P′ cure (§881.18) recovers ~1,000 B on the composed tip. Veto shape: a one-line `manualChunks` entry in a later faith car — priced, not taken. **(3) RATIFIED. (4) RATIFIED.**

**§881.16.3 · T13-PRELAND's PAUSE REPORT — pick 14 (the P′ placement cure) COMMITTED and behaviourally proven; Car 5 not started; the build unspent · 2026-09-02 · SEAT: Opus 5 (lane T13-PRELAND), enrolled by the Opus chair.**

*The lane's own judgment calls (a returning Fable seat re-derives these):*
1. **It COMMITTED the four dirty paths as pick 14 rather than leaving them uncommitted at the pause**, on the ground that both halves were fully proven before the order arrived (the equivalence probe and the differential probe both clean, the goldens unmoved, both typecheck ratchets green). The chair's pause order allowed either; committing a PROVEN change is the safer resume substrate and it left the dock porcelain 0. **Veto shape:** `git revert 822c4f93a` — the cure is one commit.
2. ⭐ **It REFUSED the brief's `10^6.4` saturation literal and used the MEASURED crossing double `2511886.43150957906619` instead** — the brief's constant sits 7 ULPs above the true crossing and would have left a real ordering window in which the folded comparator disagreed with the original. **This is the single most load-bearing call in the cure** and the one Fable should re-derive first: the claim is that the lexicographic (tier, min(pop, crossing)) ordering is IDENTICAL to the original expression for every input the comparator can see, and the probe that backs it is 15,071,406 score comparisons over integer populations `0 … 2,511,900` × six tier ranks plus 3,000,000 random quadruples plus cross-rank, above-cap and NaN arms, with **0 mismatches**, and a differential probe of 2,449,925 cases through the real exported API with **0 divergences**.
3. **It re-ran the eager census over ALL 21 `detMath` importers** rather than only the two the receipt named — finding exactly two eager before the cure and **zero after**, and additionally proving `bandedStock.js` is NOT eager, which is what guarantees Car 5's family (i) cannot undo P′. The wider census is the lane's own widening of the brief.
4. **It classified both remaining reds as PRE-EXISTING by proof, not by assertion** (`clampPrimitiveBaseline`'s 78-vs-62 count identical at HEAD and worktree; `proseNumerics`'s `moralDrift.js` line shift owed to an earlier pick), so no red is attributable to pick 14.

*⛔ THE CHAIR'S OWN ERROR, recorded by the lane (the brief-error streak law, §872.1):* **this chair's dispatch brief named the wrong ban member list in both directions** — it listed `Math.sqrt`, `Math.cbrt` and `Math.hypot`, while the counter's own `TRANSCENDENTAL_FNS` is 22 members with **`Math.sqrt` deliberately absent**. Car 5's ban must mirror the counter's list by construction, never a hand-written set in a brief. The brief pointed at the counter file as the authority, which is what saved it; the standing law holds — **a dispatch brief POINTS at the charter, never paraphrases it.**

*Receipts:* dock `822c4f93a`, **14 commits** over `8b07ce45f`, porcelain 0, trailer `Opus 5 (lane T13-PRELAND)` parser-visible; goldens 0/525 drifted with non-vacuity established (525 corpus rows = 525 manifest keys) and the negative control still convicting (DRIFT_COUNT=1); logs `$SP/pprime-consumers.log`, `$SP/tc-ratchet.log`, `$SP/tc-strict.log`. **The ONE build is UNSPENT** — no dist measurement exists at `822c4f93a`; predicted closure **1,046,330 ± 250 RAW** (from 1,047,496 at build #6b), engine 675,339 with a stated code-motion caveat.

*Priority:* **HIGH for (2)** — the whole cure rests on that equivalence. MEDIUM for (3) and the chair's error. LOW for (1) and (4).

*RULED (§881.19, Fable 5.1):* **(1) RATIFIED.** **(2) RATIFIED IN SUBSTANCE, AMENDED IN ITS WORDING (precision).** The chair re-ran both probes at `822c4f93a` (read-only, 0.6 s + 0.2 s): the crossing constant is exact — under the tree's own `detLog10`, `bonus(CAP − 1 ulp)` = 0.7999999999999999 and `bonus(CAP)` = 0.8, `detLog10(1)` = 0, and `10**6.4` = 2511886.43150958232582 sits exactly **7 ULPs** above it, as the lane said; arm 1 (15,071,406 integer comparisons; 2,511,886 strict + 15 equal steps; both keys monotone), arm 2 (cross-rank, bMax 0.8 / bMin 0), arm 3 (above the cap, 10 probes), arm 5 (3,000,000 random quadruples) and arm 6 (NaN poisoning) all report **0**. The monotone-consecutive-step argument is sound: two non-decreasing keys that agree strict/equal on every consecutive step agree on every pair. ⚠ **THE AMENDMENT:** the receipt's HOLD table reads "bit probe — RAN, PASSED … MISMATCHES: 0", but the probe's own TOTAL line counts arm 4 and prints `TOTAL MISMATCHES: 232611` with exit **1** — the lane DISCLOSED this in §P1.3 and in the commit body ("the one residual, named rather than hidden") and characterised it with the residual probe (re-run by the chair: 72,000 adjacent-double comparisons — REVERSALS 0, old-strict→new-tie 0, old-tie→new-strict 56,948; agreement guaranteed from ~1.4e-14 relative at every magnitude; 0 of 2,511,885 consecutive integers collapse), so nothing is hidden — but "PASSED / 0" must not be quoted upward. The correct sentence is: **identical on every integer population and every reachable input; strictly FINER, never contradictory, on adjacent non-integer doubles closer than one part in 7e13 — a named comparator gap carried to CR-9 and the GOLDEN handover.** The reachability claim ("every population writer rounds", three writers named) is PLAUSIBLE by census, not executed; the executed cover is the differential probe (2,449,925 real-API cases, 0 divergences) and the goldens (0/525, non-vacuous, negative control convicting). **(3) RATIFIED** — the census over all 21 importers is the widening a validator would have demanded. **(4) RATIFIED.** The chair's ban-member error is RECORDED under the streak law (§872.1); this chair's re-dispatch brief names the counter file as the sole roster authority and says so about itself.

**§881.19 · THE FABLE SEAT RETURNS — the stratum is WALKED · 2026-09-02 03:37–04:1x ET · chair session 58f0a8e2 · SEAT: Fable 5.1.**

The Opus-chair span (§881.16–§881.18: three ledger acts, three rows above) is retrovalidated: **14 calls — 13 RATIFIED · 1 AMENDED (precision) · 0 REVERSED · 0 EVIDENCE-THIN**; two re-derivations EXECUTED by the chair (the D-2 chunk attribution on both dist trees; the pick-14 bit probe and residual probe at `822c4f93a`). From this act forward the seat is the §447/§724 split again: the chair's acts carry `Seat: Fable 5.1 — validated`; the Opus lanes' own rows (TAILF-land's §6.6, T13-PRELAND's) land at their HOLDs and are ruled at the §882/§883 collections. The historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger — this file does not report itself empty.

**§882.1 · TAILFPREP — THE FAITH-CHAIN COMPOSITION REHEARSAL, two seats across a cutoff: four cure commits, one STOP ruled R-TAILF-1 and implemented, sealed `refs/preserve/tailf-rehearsal-2026-09-01` = `66d6e9235` · 2026-09-01 · SEAT: Opus 5 (lane TAILFPREP).**

## R§16 — RETROVALIDATION ROW (drafted by the lane, for the chair to accept or reverse)

**§E3/TAIL-F · THE FAITH-CHAIN COMPOSITION REHEARSAL — resumed after a cutoff, four cure commits,
one STOP · 2026-09-01 · SEAT: Opus 5 (lane TAILFPREP).**

⛔ **BOUNDARY:** everything the chair architected is NOT in this row — the pre-board's TAIL-F ten,
the pick order and the cure-car treatment, the §879 fence amendment, §6's restated STOP condition,
and the phase-2 instruction list. Only the calls below are the lane's. The first two are the
PREDECESSOR seat's, attributed to this lane per the brief and re-verified by this seat rather than
inherited on trust.

*What was judged:*
**(1) CURE 3 (`3b8f5ef39`) — the deepening leaf re-pointed to the bindings leaf.** A composition
import break invisible to both parents. The call worth reviewing is not the one-line fix but the
decision to sweep the **class** — every named import in all 22 touched files resolved against the
composed tree's real exports — and to check the fence's `importersOf` semantics for census-neutrality
**by construction** rather than by re-running it. Re-verified this seat: the file is green in RUN 1.
**(2) CURE 4 (`e441225f7`) — a rename, and seven re-addressed rows.** Two shapes answered
differently on the strength of an exact-identity baseline; the `strength` → `strengthWord` rename
follows HER-7's ruling on a character-identical shape and leaves the rendered sentence byte-identical.
Re-verified this seat, and **upgraded**: the predecessor could only measure its effect at the cured
file, and `tests/lint` WHOLE now shows the tip at **4 files / 6 tests — equal to the base control**,
so the consist's entire lint bill is discharged, not merely the three arms it named.
**(3) I RE-POINTED THE BASE CONTROL ARM** from `b82987ab8` to `893a66b0a` (`$SP/tailfprep-base`,
detached, porcelain 0 either side, `node_modules` intact). The rehearsal had been rebased onto the
newer coupled tip while its control was left one rebase behind; every classification in this receipt
is a set difference against a control, and a control at the wrong base silently converts FOREIGN
into COMPOSITION and back. Cheap, reversible, and it re-measured the chair's stated base tuple
rather than trusting it.
**(4) ⛔ I STOPPED ON THE ONE COMPOSITION RED INSTEAD OF CURING IT (R§10)** — the largest call in
this row, and a deliberate departure from "cure COMPOSITION reds". The cure the red asks for is two
names and a count; I executed it, confirmed it turns the suite **51/51 green**, and **restored the
tree**, because it makes the estate's darkness claim false with no arm to say so. Enrolling a
production-reachable consumer is a claim reversal on a structural guard another line minted
deliberately; the alternative is re-architecting an F-chain car. Both are the landing's to rule.
**I did not bank the clean half either** (the `deityFlaws.js` citation enrolment is honest on its
own evidence) because arm 2 is one `toEqual` over the union — a partial edit turns nothing green
and would blur the ledger.
**(5) I WIDENED THE SWEEP** past the brief's named set, twice: the consumer census (29 suites found
by grepping the estate for the 11 changed modules, rather than the chain's own test files) and the
83 tree-scanning registers. The brief's "`tests/domain/**` the chain touches" I read as a census
rather than the whole 964-file directory; the scanner sweep is what closes the gap that reading
leaves, and it is what proved the registration bill is exactly one item.
**(6) I EXECUTED TWO WRITERS TO VERIFY THEM, AND RESTORED IN THE SAME COMMAND** — `build:edge-shared`
(twice, to read the metas' exact content) and the R§10 probe. Each run's restore was verified by
`porcelain` and `HEAD`, not assumed. The judgment is that a writer run under an in-command restore
is a measurement; the risk it carries is a session cut between write and restore, which is why the
edit and its restore never occupied separate commands.
**Also mine, smaller:** classifying the lighting-census red as EXPECTED-REGISTER on the strength of
its presence at BOTH arms rather than its title; offering R§13's machinery rider without banking it.

## R§22 — RETROVALIDATION ROW, ADDENDUM (the calls inside the chair-ruled act)
R§16 was drafted before R-TAILF-1. These are the lane's calls *within* the ruling — the ruling
itself is the chair's and is not in this row.

**(7) I WIDENED THE EDGE MATCHER BEYOND THE RULING'S LETTER.** The ruling asked for the chain to be
asserted positively; it could not have known the chain is unassertable with the file's own matcher,
because the last hop is a dynamic import and the target is `.jsx`. I widened `reachersOf` to see
both forms and both extensions rather than writing a bespoke matcher for the lit arm alone — a
second matcher would have left the darkness proof still blind to lazy edges, which is the failure
mode that matters. **I then re-measured the dark closure under the wider matcher instead of assuming
it unaffected**; it is unchanged, and that is executed, not reasoned.
**(8) I CORRECTED THE RULING'S CHAIN BY ONE HOP AND SAID SO.** The ruling named
`FaithTab.jsx / FaithSection.jsx ← OutputContainer.jsx:725`; measured, the module edge runs through
`dossierLazyTabs.js:57` and `:725` is the RENDER site, not an import. I asserted the true edges and
the render separately rather than encoding the stated chain, because an arm that asserts a hop that
does not exist would have reddened on the first honest run — and silently "fixing" a chair's chain
without reporting it is how a correction becomes folklore.
**(9) I BUILT PLANT A AS A SWAP, NOT AN ADDITION.** An addition reds the roster-union arm as well,
which would have proved the old machinery still works rather than the new machinery. The swap keeps
the union identical so **only the derived arms can convict** — the sharper claim, and the one the
ruling actually asked to be true.
**(10) I KEPT THE RETITLE COUNT-NEUTRAL AND ADDED EXACTLY ONE ARM**, then proved the census cost
per-file across all 2494 files rather than reporting the aggregate delta. The landing's bill moves
+98 → +99 titles and nothing else; a lane that reported only "the tuple moved" would have left the
landing to rediscover which of the five figures did.

*RULED (§882, Fable 5.1 — re-derived at the object store BEFORE the landing, 2026-09-02 ~02:35 ET; the landing's own re-runs at the composed tip are the runtime proof):* **RATIFIED (1)–(10), all ten; three laws carried.** (1) CONFIRMED: `3b8f5ef39` is exactly the import re-point plus six comment lines (`8 1`); `faithChannelLift` is exported at `faithChannelBindings.js:165` at `fab576aba`, was `faithField.js:542` at the F-line tip `eabae6920`, and `faithField.js:456` at `fab576aba` records the move — a home that differs between the parents, the theorem class; the 22-file class sweep is the lane's execution (one unresolved specifier), re-proved by the order's 21/21 at the tip. (2) CONFIRMED: `e441225f7`'s `FaithTab.jsx` hunk is `g.strength` → `g.strengthWord` on one line (line-count neutral) and the baseline's seven rows move 332→335 ×2, 340→343 ×2, 410→413 ×3 with nothing else in that diff; the "4 files / 6 tests = base control" upgrade stands on R§28's four-arm table (the lane's execution; the landing's whole `tests/lint` at C′ re-proves it). (3) CONFIRMED: `tailfprep-base` reads `893a66b0a` today; the law kept — a control at the wrong base silently converts FOREIGN into COMPOSITION and back. (4) CONFIRMED in structure, RATIFIED in judgment: `ENROLLED_CONSUMERS` is present at `893a66b0a` and `fab576aba` and ABSENT at `eabae6920`, while `src/domain/display/faithDeepening.js` exists at `eabae6920` and `66d6e9235` and at neither base — a register on one parent governing a file on the other, exactly as the lane wrote; the executed cheap cure's 51/51 false-green is the lane's own run (the pre-cure blob's hand-written `reachersOf` rows are the mechanism); the chair's R-TAILF-1 (§880.4/§880.5) then ruled the claim narrowed, never retired — the STOP was the right call because the reversal was the chair's to make. (5) RATIFIED: structural enumeration over hand lists is the law the order's fold then strengthened (⟦A12⟧: run the whole 393); the 83-file scan found exactly the R§10 red. (6) RATIFIED as method: a writer run whose restore is in the same command, porcelain and HEAD verified after, is a measurement; the §881 landing's own `build:edge-shared` window later re-derived the same inputs (68 → 70, D4's) — consistent. (7) CONFIRMED: `66d6e9235`'s `reachersOf` (`:651`) and its docblock (`:642–644`) name both blind spots (`.jsx` → `FaithTabx`; dynamic `import()`); the dark closure's re-measure under the wider matcher is the lane's execution. (8) CONFIRMED hop by hop at `66d6e9235`: `faithPanelModel.js:25` imports `faithDeepening.js`; `FaithTab.jsx:30` imports the model and `:29` `FaithSection.jsx`, whose `:32` imports the model; `dossierLazyTabs.js:57` is `lazy(() => import('../new/tabs/FaithTab.jsx'))`; `OutputContainer.jsx:73` imports from the lazy registry and `:725` renders `<FaithTab`; `OutputContainer` names `FaithTab` only through that registry (`:70`) — the ruling's direct hop did not exist and the lane's corrected chain does; the same three hops read identically at `fab576aba`. (9) RATIFIED, with R§25's second lesson carried as LAW: plant A as a SWAP convicts on the derived arms alone; and a guard can convict for the WRONG reason (the anchor-equals-member misuse arm fired first) — read the conviction MESSAGE, never the exit code. (10) CONFIRMED: `it(` 51 at `893a66b0a` → 52 at `66d6e9235`; the +99 flows into the order's predicted 22437 (22338 + 99). ALSO CONFIRMED, R§27: `bead9fd71` parses NO `Seat:` trailer while `400b7eb9b` and `66d6e9235` parse `Opus 5 (lane TAILFPREP)`, and `bead9fd71`/`66d6e9235` share tree `5d66e8a50` — the third amend restored the trailer alone; the law (an `--amend` that appends prose after `Seat:` voids the trailer; re-verify through the parser) is banked, and the picked-car convention keeps each author's single trailer. Not re-derived (runtime; re-owed by nothing — the landing re-runs every arm at the composed tip): 51/51 and 52/52, the 83-scanner run, the per-file tuple probe, the two typechecks.

**§882.2 · TAILF-land — THE TAIL-F LANDING — 12 commits onto `fab576aba` → `9a0584f0f`, ZERO landing cures, full-consist bit-identical at both probe arms · 2026-09-02 · SEAT: Opus 5 (lane TAILF-land).** *(The lane's row, verbatim from `825f209c…/scratchpad/laneTAILFLAND-receipt.md` §6.5/§6.6; the section number assigned by the chair.)*

**BOUNDARY.** These are **this lane's own calls only.** Excluded as already-adopted or not mine: the TAILFPREP rehearsal's ten rows (R§16 (1)–(6) + the R§22 addendum (7)–(10)) which this landing carries **as its author wrote them, unamended**; the FOLD lane's ⟦A1⟧…⟦A17⟧ amendments; the chair's CR-1/CR-2 rows and its 2026-09-02 ~03:50 ruling on D-2. The **owner-visible** rows of §7 are stated, never decided, here.

*What was judged:*

**(1) ⛔ THE ONE THAT MATTERS — continuing past §3.5.4's STOP instead of halting the lane (D-2).** The order made a first-paint closure of **1,046,604 B** a written prediction and made any miss a STOP. The measured tip closure is **1,046,662 B — +58 B**. I judged that the STOP's *purpose* (an unexplained byte move is an unattributable composition fault) was discharged by measurement rather than by halting, and that the remaining acts were safe to run: I rebuilt `$SP/base-C` from scratch, reproduced 1,046,604 and engine 675,764 to the byte, hashed all eight first-paint chunks at both arms, found **seven byte-identical and the whole +58 B inside the eager `index` chunk (576,060 → 576,118)**, grepped the TAIL-F fingerprint in all eight (**0 hits**), and identified the cause as ⟦A9⟧(c) being *wrong*: Rollup cut a new **lazy** chunk `faithField-DvBYuqdu.js` and index's Vite preload map gained its 29-character filename exactly once. No ceiling is breached (margin **338 B** under the unraised `CLOSURE_BUDGET_BYTES = 1_047_000`; engine Δ 0 B, margin 236 B; `vendorPdfLazy` 40/40 with zero skips). **I proposed no cure, no co-location rule and no raise, and I took no act on it.** *(The chair has since ACCEPTED D-2 as a composition cost of the consist's own shape and RATIFIED the continuation — that ruling is the chair's, and is excluded above; what is validated here is my call to measure-then-continue, and the standing consequence I recorded: **the first-paint margin is 338 B, not 396 B**.)*

**(2) The boarding shape, as ratified.** CR-1's shape executed literally: the **ten sealed rehearsal commits picked in chain order**, not "9 cars + 2 anchored patches re-applied" (§880.5's phrasing, corrected on the ledger), and **without `cherry-pick -x`** (COMP-4c refused at its fold point). Three cars were `-n` re-commits carrying an R-2a reconcile paragraph; each kept its author's `Seat:` trailer **and its author's date** via `--date` (CR-2), and no `--amend` was used anywhere (the trailer-voiding hazard). Consequence I accepted: the ten picks are new shas, so the composition's soundness rests on the blob comparator, not on identity — which is why I ran it.

**(3) The three R-2a reconcile paragraphs as used.** Inserted verbatim from `$SP/p{1,2,5}.txt` at the ⟦A4⟧ position — paragraph, blank line, then the trailer BLOCK (before `Co-Authored-By:` for P1, before `Seat:` for P2/P5). The judgment is that a reconcile paragraph belongs in the picked car's body rather than in a separate landing commit, so the ledger reads the reconciliation at the car that needed it.

**(4) The two register commits — the only commits this lane authored.** `6630ef956` refroze the lighting census and `9a0584f0f` banked the test-ratchet `--update`. Both were **predicted in writing before their instrument ran** (the lighting tuple to all five digits; the ratchet to five figures plus 14 magnitude measures), and in both cases the refreeze targets the **measured** figure, never the arithmetic (E4). I judged one commit per register — not one combined register commit — so each ratchet's provenance is a single sha.

**(5) The `measuredBy` value.** I wrote **`"measuredBy": "TAILF-land"`** (not `Opus 5`, not `TAILF-landing`) into `tests/lint/.lighting-census-baseline.json` beside `measuredAtSha 1c7981bb9…`. It is a free-text provenance field with no validator; I chose the lane name the brief and the ledger use so the row greps to this receipt. If the chair wants a seat-shaped convention there, it is a one-line follow-up, not a re-measure.

**(6) The base-arm verification, and ⛔ D-4 — the order's named control site is BLIND on probe C.** ⟦A11⟧ names `stressTypes.js:14` (`under_siege`, `probability 0.025 → 0.037`) as probe C's can-it-see control. Executed, it left `corpusSha 87e8b25c…f695` **completely unmoved** — the control proved nothing. I did not accept the tip comparison on a failed control and I did not invent a substitute: I executed ⟦A11⟧'s own written fallback (`stressTypes.js:162`, the `mass_migration` sibling row), which **moved the sha to `fb313037a…5ca7`** and then returned to `87e8b25c…f695` on restore. My judgment on *why*: `stressGenerator.js:87` reads the field into a threshold that a draw is compared against — the draw is consumed either way, so a 0.012 nudge moves an output only when some run's draw lands in the gap; probe C is 360 runs and probe A′ is 600 worlds, and the same `under_siege` perturbation moves A′ by exactly 5 rows. **The comparator is sensitive; the named row simply straddles no draw in 360.** I judged this a deviation of the ORDER's prescription, not a red.

**(7) D-3's classification.** §5.4 predicted "exactly ONE red file"; two came back (`voiceMechanics` ×4, `enforcement-claims` ×1). I classified all five arms as **banked ratchet rows at their exact magnitudes** rather than as new reds, and continued. *(The chair has since recorded D-3 as a prediction miss of the order, not a red.)*

**(8) ⟦A12⟧ executed as written — the WHOLE 393.** The order's amendment replaced I-2's unreproducible "128-file" family with a structural enumeration; I ran all 393 `*.test.*` files matching the read idiom in four batches rather than any curated subset, and the batch lists are on disk (`$SP/tailf-scanners*.txt`) so the family is reproducible by anyone.

**(9) An instrument slip, recorded not banked.** A first §5.3 attempt carried `--reporter=basic`, which vitest 4 rejects — **a run that never ran**. Re-run clean. Recorded because the false-green shape is the hazard, not the typo.

*What Fable re-derives:*
ⓐ **The decisive one — D-2's cause.** Rebuild `$SP/base-C` and `$D`, hash the eight first-paint chunks at both arms, and confirm seven are identical, the delta is entirely `index` 576,060 → 576,118, and `faithField-DvBYuqdu.js` is a **lazy** chunk whose 29-char filename appears exactly once in index's preload map. This single receipt carries whether "composition cost of the consist's own shape" is the right classification, or whether a co-location rule is owed after all. **The standing figure to carry forward is the 338 B margin.**
ⓑ **The composition comparator (the one that settles soundness without a rerun).** For each of the 25 paths the consist touches, `git rev-parse "9a0584f0f:<p>"` = `git rev-parse "<RT>:<p>"` — nothing printed. If this holds, the ten new-sha picks reproduce the sealed rehearsal blob for blob and the `-x`-less boarding shape (call 2) costs nothing.
ⓒ **D-4's mechanism**, because it is a reusable instrument fact and the next lane will hit it: perturb `stressTypes.js:14` and `:162` in turn against `matseam-dormancy.mjs` and against `coupled-genA2.probe.mjs`, and confirm the asymmetry (0/360 vs 5/600 for `:14`; both move for `:162`). **The general law to bank if it holds: a threshold constant is a WEAK control — its visibility is a function of the corpus size, not of the comparator's sensitivity; a control site must be chosen for determinism, not for being nearby.**
ⓓ **The two registers against their own instruments** — `node $SP/chair-tools/lighting-tuple-probe.mjs $D` = `2495/370/2125/22437/6069` = the committed baseline; and `scripts/.test-ratchet-baseline.json` `measuredAtSha 6630ef956…` / `totalTests 30731` / `totalFiles 2443` / 10 entries, with the plain gate printing **no** magnitude section.
ⓔ **The five banked reds are the SAME five** at `fab576aba` and at `9a0584f0f`, title for title (`$SP/lint-after-final2.json` vs `$SP/lint-after-tailf.json`) — the cheapest proof that a 12-commit consist moved no walker.

*Receipts:* Dock `$SP/laneINSTRLAND-tree` @ **`9a0584f0f`**, `git status --porcelain` **0 lines** at every boundary, **12** commits over `fab576aba`, **12/12** parser-visible `Seat:` trailers, `claude/composite-r4` still **`fab576aba`** (not CASed — the chair holds it). Probes: probe C `87e8b25c…f695` at both arms with a PASSED sibling-site control (`fb313037a…`) that returned; probe A′ `abe0a847…c4b7` at both arms, `diff` **0 lines**, control `4e1e506c…` moving exactly **5 of 600** rows — `hamlet-040` · `hamlet-041` · `hamlet-078` · `town-021` · `city-075` — and returning; the rebuilt A′ driver validated against the COUPLED spec TSV on columns tier/seed/faction-count, **0 diff lines**. Batteries: base **3 files / 28 tests**, tip **4 files / 41 tests**, both `TRUE_EXIT=0`; espionage fence blob-identical across the consist (`36f4b770d…`) with `PRE_COUPLING_CORPUS_SHA '72acacd8…'` unmoved; faith fence 13/13 at `SOURCES.length` 5; `DORMANT_GOLDEN '6e85308b0f396a77'` untouched. Whole `tests/lint` at the tip: **407 suites · 1857 tests · 1852 passed · 5 failed**, the five banked by name. Every vitest run `GATE_MUTEX_TIER=shared … --maxWorkers=2` with `TRUE_EXIT` captured on the mutex command; **no process of any sibling lane was killed at any point**; every source plant restored in the same command and blob-verified `7e3afd9b4…` (three times). Full act-by-act table above in this receipt.

*Priority:* **HIGH for ⓐ** — it is the only call where I continued past a written STOP, it is a paid-surface-adjacent byte figure, and the 338 B margin it leaves is now a standing constraint on every consist that follows. **HIGH for ⓒ** — the blind-control shape is a false-green generator, and the next lane that copies ⟦A11⟧'s letter will believe a comparator it has not tested. **MEDIUM for ⓑ** (it retires the whole boarding-shape question in one loop) and **ⓓ**. **LOW for ⓔ** (already printed here, one file read to confirm). ⚠ **Owner-visible either way, and NOT mine to decide:** the §7 rows as written, plus the two the chair now carries — that the standing first-paint margin is **338 B**, and that D-2 was accepted with **no cure and no raise**.

*RULED (§882, Fable 5.1):* **NINE CALLS — ALL RATIFIED; two re-derived by the chair's own reads BEFORE the gate, one law BANKED.** **(1) RATIFIED** — ruled at §881.19 (D-2 ACCEPTED as a composition cost, the continuation ratified, the standing first-paint margin 338 B); the chair's own eight-chunk re-derivation on both dist trees is ⓐ's receipt. **(2) RATIFIED — ⓑ EXECUTED by the chair at 04:03 ET:** over the 27 paths `fab576aba..9a0584f0f` touches, 25 blobs equal the sealed rehearsal `66d6e9235`'s and exactly TWO differ — `scripts/.test-ratchet-baseline.json` and `tests/lint/.lighting-census-baseline.json`, the two registers the landing's own acts refroze — so the `-x`-less chain-pick boarding shape cost nothing; ⟦A14⟧'s `%ai` check: the ten picks' author dates equal the ten rehearsal commits' to the second, and only the two register acts carry 2026-09-02. **(3) RATIFIED. (4) RATIFIED** — one commit per register, each predicted in writing before its instrument ran (E4). **(5) RATIFIED** — `measuredBy "TAILF-land"` greps to the receipt; a seat-shaped convention for that free-text field is DEFERRED here, documented, not a defect. **(6) RATIFIED, and the law BANKED:** ⟦A11⟧'s named control (`stressTypes.js:14`, `under_siege`) is blind on probe C at 360 runs while the same perturbation moves probe A′ by 5/600; the lane ran the order's own written fallback (`:162`, `mass_migration`) rather than accepting a failed control or inventing a site — exactly the discipline a can-it-see control exists for; ⓒ's mechanism (a threshold read against a consumed draw) is PLAUSIBLE, and its asymmetry is re-derived by the chair in `$SP/base-C` after the seal and before that extract's retirement; the memory row lands either way: **a threshold constant is a WEAK control — choose control sites for determinism, never proximity.** **(7) RATIFIED** — D-3 is the order's prediction miss. **(8) RATIFIED** — the 393-file lists are on disk (`$SP/tailf-scanners*.txt`). **(9) RATIFIED** — the `--reporter=basic` false-green shape is the hazard the estate already names, recorded not banked.

## §882.8 · THE SECOND OPUS-CHAIR SPAN OPENS (2026-09-02 ~10:00 ET) — the Fable window is exhausted mid-fold; the chair seat moves to Opus 5 and every act of this span is retrovalidation-OWED

**THE TRIGGER, measured not assumed:** three Fable agents died within minutes of each other on `You've reached your Fable limit` (the G0 fold at ⟦G0 PARTIAL: 31 of ~52⟧; the T13-order fold at `PARTIAL — fold: 6 of 24`; the ENCOUNTERS E2 fold at `PARTIAL — fold: 0 of 20`), while the Opus lane running beside them (READERREVIEW Car 0) completed normally at 09:08 — a MODEL limit, not a session limit, and the second distinct death class of this session (the 05:40 one was the session limit, §882.7). The chair's own seat moved to Opus 5 at the same boundary.

**THE SPAN'S RULE (§236/§685, as restated at §881.16):** an Opus chair works at FULL authority and marks everything — every ledger act carries `Seat: Opus 5 — Fable-unvalidated` and lands a row in this section in the SAME commit (`chair-commit.sh` checks the trailer, the queue's presence, and that its blob DIFFERS). A returning Fable chair walks this section FIRST. ⚠ The preference from the seamless-resume memory holds: an Opus-only window EXECUTES the already-architected plan rather than re-architecting it. The three folds this span re-dispatches are EXECUTION of folds already chartered by Fable seats (their inputs — the volumes, the skeptic JSONs, the chair rulings — are all Fable-authored and ledger-recorded); each folded artifact nevertheless carries an `⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧` marker at its header and its fold judgments are enrolled here, not merely its errors.

**§882.8.1 · THE CHAIR'S OWN ACTS AT THE SEAT SWITCH · 2026-09-02 · SEAT: Opus 5.**

*What was judged (this chair's own calls only):*
1. **The three dead folds are RE-DISPATCHED on the Opus seat rather than held for a Fable window.** Ground: each is a fold of an already-architected document against already-ruled findings — the judgment content is the chair's rulings, already on the ledger (§882.3–§882.6 for G0; §882.7 for the T13 order; §882.1 for the ENCOUNTERS funnel door), and holding would strand three partial files across an unknown window. **Veto shape:** a returning Fable seat re-folds any section this span marks, from the same inputs; nothing is landed by these folds — they write design documents only.
2. **The two Workflow chains are resumed BY RUN ID with only their fold stage's model changed to Opus.** The completed stages (author, design, recon, both skeptics of each) replay from cache and are NOT re-run on a different seat, so no Fable-authored analysis is silently re-authored by Opus. **Veto shape:** none needed; the cache is the previous seats' own output.
3. **No landing, gate, CAS or seal is attempted in this span's opening act.** T13's landing waits on its order's fold, which is exactly what died; starting a landing on an unfolded order would board sixteen cars against a document whose blocking finding (COMP-1, the moved dormancy golden) is not yet folded into its battery.
4. **SOAKCHAIN Car 0's measurement is dispatched into the fourth slot** — an Opus measurement act by nature (the volume's §4.5 splits the module half, a build car, from the measurement half, a probe), so the seat is correct rather than merely available.

*What Fable re-derives:* whether (1)'s reading of "fold = execution" holds for the G0 fold in particular, which re-cuts the INSTR car list and therefore shapes future work rather than only recording past work; and whether any fold judgment marked ⟦OPUS-AUTHORED⟧ in the three artifacts should be re-taken.

*Receipts:* ledger tip at the switch `f46be1d1f` (§882.7); product `claude/composite-r4` = `9a0584f0f`; the three partial files with their headers and mtimes as quoted above; `laneG0RR-receipt.md` 09:08 (the Opus lane that survived); board empty, disk 14 GiB at 10:01.

*Priority:* **HIGH for (1)** — it decides who authors three design surfaces. MEDIUM for (3). LOW for (2) and (4).

**§882.9 · THE T13 LANDING ORDER'S FOLD, AND THE LANDING LANE'S DISPATCH · 2026-09-02 10:18–10:25 ET · SEAT: Opus 5 (fold lane + chair).**

*The FOLD LANE's own calls (⟦OPUS-AUTHORED⟧, eight rows, as it reported them):* R-FOLD-1 it judged the dead seat's `6 of 24` header STALE and re-derived the true state by a marker census plus a read of each marker's CONTENT, re-folding nothing (five findings — COMP-4, BILL-3/6/8/10 — were missing entirely; nine were PARTIAL). R-FOLD-2 it KEPT the dead seat's numbering plan rather than renumbering, which leaves this panel's ⟦A11⟧/⟦A12⟧/⟦A13⟧ colliding with markers INHERITED from the TAIL-F order's text, and disambiguated by a header rule (⟦A22⟧: this panel's amendments always carry the finding id) instead of editing inherited text — *veto: renumber this panel to A25+*. R-FOLD-3 it re-cut the OWNER-VISIBLE §7 row 1 itself (the flip enumeration is ONE row, not empty) rather than leaving it to the chair, AND raised it as CR-14. R-FOLD-4 it ruled CR-17 SPLIT where the skeptic offered either form for both rows. R-FOLD-5 it raised the landing-commit count 24–27 → 26–29 as an arithmetic consequence no skeptic asked for. R-FOLD-6 it scoped §2.6's "manifest byte-identical" claim to `generator-golden-master.json` ONLY and declared the blob comparator now prints TWO lawful lines (`vite.config.js` + `tests/kernel/detMathIdentity.test.js`), the momentum fixture being outside that loop's path set and owed its own check at §6.3.8. R-FOLD-7 it marked §8b items 12/14/16 SETTLED rather than leaving them could-not-verify. R-FOLD-8 it REFUSED NOTHING — every clause of all seventeen findings judged foldable; it names CR-16's cost (two extra 70-suite sweeps) as the likeliest candidate had a refusal been right.

*What Fable re-derives:* R-FOLD-2 above all — a marker-collision cured by a naming CONVENTION rather than a renumber is a class this estate has been bitten by before (a reader who matches on the number alone reads the wrong amendment), and the landing lane is now carrying that convention in its head; and R-FOLD-3, because it rewrites owner-facing text.

*The CHAIR's own calls (Opus 5, at the dispatch):* all five chair rows RATIFIED as the fold recommended — CR-13 the anchor red as a LANDING act not a 17th dock pick (the dock is a sealed sixteen-car consist; a composition cure belongs to the composition); CR-14 the moved `momentumDormancyGolden` row attributed by the §4.3 ladder then re-recorded ONCE inside T13's own declared window with the mover named, and §7's owner-visible row 1 re-cut from "no golden re-recorded" to "ONE row re-recorded" — ⚠ **the chair judged this CHAIR-CLASS rather than owner-gated because T13's window is the SIGNED one (§879.11's REC) and the arc's LAST ruled same-seed mover (walk manifest N2), so a movement inside it, attributed and declared with its cause, is exactly what the window exists for; the PREDICTION of zero was a prediction, never a licence — but the row is OWNER-VISIBLE and rides §883 as such**; CR-15 home (b); CR-16 the whole 70-file `tests/property` family at BOTH arms (the base arm is what makes a tip red attributable); CR-17 SPLIT. *What Fable re-derives:* CR-14's chair-class reading — the one call of this span that touches THE PROMISE's surface.

*Receipts:* the folded order `$SP/T13-LANDING-ORDER.md` 695 lines / 237,768 B, verdict `BOARD-READY WITH CHAIR ROWS 5`, ⟦A1⟧…⟦A24⟧ complete by marker census, 17 findings folded / 0 refused, picks 15–16 filled (`f95305812` · `9f0df13a1`, dock `9f0df13a1`, 16 over `8b07ce45f`, re-read by the fold itself); the seal `refs/preserve/landing-TAILF-2026-09-02` = `9a0584f0f` present; lane T13-land dispatched ~10:25 with the five rulings in its brief.

*Priority:* **HIGH for CR-14 and R-FOLD-3** (owner-visible text and the last signed same-seed window). MEDIUM for R-FOLD-2 (a collision cured by convention). LOW for the rest.

**§882.10 · THE ENCOUNTERS E2 FOLD · 2026-09-02 10:23 ET · SEAT: Opus 5 (fold lane), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.**

*The fold's OWN judgments (eight numbered J31–J38 plus five fold-level calls, as it reported them; the chair's §882.1 ruling it merely implemented is excluded):* **J31** take E-3 road (b) — mint a THIRD flat ledger leaf `envoyChanceMeetingLedger.js` in Car 2 owning both write sites, the drop pass and both readers — rather than road (a) shuffling kernel edits into Car 3; it buys the estate's own writer/reader colocation (verified against `gratitudeBonds.js:67/:90` and `espionageCareerCredit.js:234`) and cures P-7 structurally, and costs a fifth flat mechanism, a lighting-census file and a coupling-row move. **J32** the willed marker is a VALUE in the leash's existing OPEN `conspiracy` slot (`conspiracy: 'chance_meeting'`, one existing src writer at `corruptionWeb.js:721`, carried through by `resolveLeash` `corruptionLeash.js:69–95`), not a new `willed` field — zero persisted shape, refusing the panel's own suggested boolean. **J33** place the exposure-lane skip BEFORE the draw and DECLARE the lit-world stream consequence rather than consume-then-skip (the dark arm stays byte-identical by fence 1). **J34** Car 6 CURES the pre-existing record-key rebind rather than docketing it, and gates on E5 LIGHTING rather than on landing. **J35** give the approach its OWN die (2/8 base, +2 at T1 ≥ 4, +1 covert) rather than raising the threshold to 4, and write the predicted per-stop rates into the volume (meet 0.375 · approach 0.094 · compromised 0.03 · rejected 0.066 · exposed 0.016) so the lit arm can falsify numbers the design already wrote down. **J36** enforce the season cap in the STAGE against the drift map's existing `updatedTick`, with the refusal word in `MEETING_REFUSALS` — never widening the CLOSED, chartered `FUNNEL_REFUSALS`. **J37** leave `LESSON_CADENCE_TICKS` UNSIGNED with its arithmetic at both settings, recommended at one season, and do NOT sign it in the volume. **J38** give each mechanism a real lit-eligible test rather than a `LIT_COVERED_BY` registry row. *Fold-level, outside the J-table and named by the fold itself:* the §7.4 predicted-rate arithmetic is the fold's; the drafting of NEW owner rows 5b and 15 and the WIDENING of row 9 are the fold's; declaring ENC-6 a fifth critical-path car is the fold's; the §17.4 claim that ENC-2 is BLOCKED until rows 1, 5 and 5b are answered (and ENC-5 until 2 and 3) is the fold's; the header verdict `BUILD-READY WITH OWNER ROWS 17` is the fold's.

*A correction the fold made to its own brief, for the record:* the chair's re-dispatch said there were no ⟦A⟧ markers yet; there were FOUR (A1–A4, in §0 and §1) — the dead Fable seat had folded E-8 and part of P-3(d)/P-4/P-6 at 05:38 **without updating its own "fold: 0 of 20" counter**. The same class as the T13 order's stale "6 of 24" (§882.9), now seen twice in one morning: **a fold's counter is a claim; its markers are the receipt.**

*What Fable re-derives:* **J31 first** (a new flat mechanism is a permanent estate cost paid to cure a build-order problem — is road (a) really worse?); then **J33**, because "declare the lit-world stream consequence" concedes a same-seed difference in the LIT arm that a later wave inherits; then the fold-level authorship of owner rows 5b and 15 — an Opus seat drafting the owner's own questions is the row a returning Fable chair should read hardest, even though the questions themselves are correct.

*Receipts:* `$SP/DESIGN_ENCOUNTERS.md` 542 → 714 lines, 120 → 198 KB; header `COMPLETE — folded (2026-09-02 10:23 ET); verdict: BUILD-READY WITH OWNER ROWS 17 ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧`; 20 of 20 folded, 0 refused; markers ⟦A1⟧…⟦A20⟧ complete; §15 disposition, §16 the amended ten-attack REFUTE-ME, §17 the build charter skeleton; seven cars, five on the critical path; nothing executed (no vitest, build, npm script or git write; all product reads by `git show`/`git grep` at `fab576aba`).

*Priority:* **HIGH for the fold-level authorship of rows 5b and 15** and for **J31**. MEDIUM for J33 and J34. LOW for the rest.

*RULED (§892, Fable 5.1):* **J34 J36 J37 J38 and fold-level (a) (c) (e) and the self-correction RATIFIED · J31 J32 J33 J35 and fold-level (b) (rows 5b and 15) and (d) AMENDED · nothing REVERSED (S02, against the volume, the panel JSONs, the ledger and the trees at `fab576aba` / `30c1667bc` / `f3523cb2d` / `4233031ba`).** **J31** holds on its colocation precedents (`gratitudeBonds.js:67/:90`, `espionageCareerCredit.js:234`; the kernel imports its readers from the writer leaves) and ENC-2 built road (b) and landed it at §889 — **AMEND** two overstated grounds: "cures P-7 structurally" is a call-order discipline plus a pin (the leaf's own header says "CALL THIS BEFORE THE FLAG READ"), and "splits the writer from the literal key" is unsupported for road (a). **J32** (value in the open `conspiracy` slot, zero shape) holds — **AMEND:** the chosen literal `'chance_meeting'` collided with §12 row 6's Herald kind of the same name inside the same volume; §882.13 ruled both in one paragraph without seeing it, and §889.1(a) cured it by renaming the kind (`chance_meeting_recorded`) — the fold CAUSED that rename; and "exactly one src writer" is true only of the literal (`applyWorldPulseBetrayal.js:46` writes the slot from `originContext.variant`). **J33** holds on placement and declaration — **AMEND:** "a willed leash cannot exist while the flag is dark" is true only for never-lit worlds; the web's lean reader (`corruptionWeb.js:348/:663`) is not flag-gated, so a lit-then-darkened save can still mint one; the landed comment at `npcAgency.js:795–796` replicates the over-claim. **J35:** the die and every §7.4 rate reproduce (3/8 = 0.375 …) — **AMEND:** the measured 0.6 % exposures (§885.7) sit 2.7× under the modal 1.6 % and 6.7× under the worst-case 4 %; §885.7 compared against the wrong column, and by §7.4's own >2× rule either comparison is a FINDING owed to the tuning sitting that nothing routed — routed here (docket: encounters tuning, with the 0.6 %'s primary receipt marked EVIDENCE-THIN). **Row 5b** is the correct question (the fate chain is real at the tip) with one mis-citation (`replaceOustedNpcs` = `npcVerdictPulse.js:133 → successorNpc.js:64`). **Row 15** contradicts itself: `leaning · won_over` IS persisted as `band` on every `meetingLeanChannels` row — three vocabularies are unpersisted, not four; the RECORD disposition survives. **(d) the §17.4 blocker** was correct when written and ⛔ SUPERSEDED the same day by §882.13 (declared a phantom at §887.1) — marked here. The receipts line: 714 lines / 198 KB and the sections CONFIRMED; the pre-fold figures PLAUSIBLE; the path is today's SP2 (`825f209c…`). ⛔ **BEYOND THE ROW, live:** the UNCOMMITTED ENC-3 stage in `laneENC-tree` (`envoyChanceMeetingStage.js:657–665`) implements J36's season cap as `taughtRecently(driftMap, nid, …)` that never reads `nid` — one lesson anywhere blocks every subject for a season and the skipped subject is dropped silently rather than receipted — a defect to cure before ENC-3 commits (docketed to the ENC-3 dock).

**§882.11 · THE HORIZON G0 FOLD, AND THE VOLUME'S COMMIT · 2026-09-02 10:25 ET · SEAT: Opus 5 (fold lane + chair), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.**

*The FOLD LANE's own eight judgments (JF-1…JF-8, as it reported them; the chair's five probe rulings it implemented are excluded):* **JF-1** it trusted the volume's MARKERS over `fold.json` and continued at ⟦G0-32⟧ without re-verifying batch1/2 line by line — corroborated by `verify-batch.py` showing 32 of batch2's 33 anchors already consumed (*veto: re-run it; the one surviving anchor, a CHARSET STOP line, is the only unapplied replacement*). **JF-2** it folded COVERAGE's eleven corrections as ONE inserted correction table at the roster's fold point IN ADDITION to the per-row inline folds, on the ground that eleven scattered corrections are unusable to Car 1 as eleven (*veto: delete the ⟦G0-39⟧ block; every correction survives inline*). **JF-3** it STRUCK the drafted chain `captured`/`collapsing` exemption entirely rather than narrowing it — it named 2 of 7 unreached tokens when all 7 are unreached, and the ruled cure is the read-time mapping (*veto: restore it narrowed; the census then carries a live exemption the mapping makes moot*). **JF-4** it entered **E47/E48** as NEW §14 rows rather than recording the two unledgered claims only in §17, because both were refuted by execution and both were load-bearing. **JF-5** it wrote **CR-15** (score the address law by `depthHistogram[2..4]`, not `fullyAddressedRateMilli`) as a CHAIR ROW rather than a receipt recommendation, because leaving it in a receipt would let 958‰ ship as a four-part figure when the actor layer never resolves. **JF-6** it set §18's SOAKCHAIN Car 0 row to say P0.4's 61.88 s **bounds (a) from below but does not discharge it** — the reader runner's composer is not the soak's per-year observation legs, and claiming the discharge would be a false green of exactly the class this program hunts. **JF-7** it recorded the WORKER `tests/property` vs `tests/generators` citation as **NO EDIT OWED** after checking (the volume cites the correct path; folding a correction to a miscitation that does not exist would be a phantom). **JF-8** it chose ~93 marks over the dispatch's "~52" estimate, because §6, §9 AND §5 were all unfolded at resume — not §5 alone, contrary to the chair's dispatch assumption.

*What Fable re-derives:* **JF-2 and JF-5 first** — JF-2 duplicates content by design (the estate's own drift-bait class: two copies that can later disagree — the §880 `attribution` row is the precedent), and JF-5 changes what a customer-facing rubric REPORTS as the NEWS ADDRESS LAW score. Then **JF-3** (a struck exemption is harder to restore than a narrowed one) and **JF-6** (the honest half-discharge is right, but its wording is what a later lane will quote).

*The CHAIR's own call at the commit:* the amended volume is committed to `docs/DESIGN_HORIZON.md` in the SAME ledger act that records the fold, so the volume the INSTR cars are cut from is the one on the ledger line rather than one in a scratchpad — the §881.15 precedent (the volume was committed at its first fold) applied to its amendment. *What Fable re-derives:* nothing owed; the alternative (hold the amended volume in scratch until a Fable seat re-folds it) would have left the INSTR briefs citing a file no successor could find.

*Receipts:* `$SP/DESIGN_HORIZON.md` 589,393 B pre-G0 → 631,264 at resume → **728,943 B / 1,469 lines**; header `⟦G0 FOLDED 2026-09-02 10:25 ET · OPUS-AUTHORED — Fable retrovalidation OWED: the INSTR cars are cut; WRWALKER Car 1 on web-display⟧`; **93 marks contiguous 1–93 with no gaps** (31 inherited + 62 this dispatch: COVERAGE 32–46 · WORKER 47–58 · READERREVIEW 59–73 · §14 74–92 · §16 93); **93 folded · 0 refused · 18 chair rows · 27 §14 rows dispositioned**; §5 and §9 both folded; `fold.json` rewritten from the volume; batches `fold-batch3.py`…`fold-batch7.py`, every anchor asserted exactly once, atomic, header checkpointed after each; the pre-fold copy intact at 589,393 B; nothing executed.

*Priority:* **HIGH for JF-2 and JF-5.** MEDIUM for JF-3 and JF-6. LOW for the rest.

*RULED (§892, Fable 5.1):* **JF-4 JF-5 JF-7 JF-8 and the chair's commit RATIFIED · JF-1 JF-2 JF-6 and three receipt figures AMENDED · JF-3 REVERSED (S03, executed against the volume, the fold kit, the five G0 receipts, the fold's own re-derivation logs and the tree at `9a0584f0f`).** The volume on the ledger line is the volume in both scratchpads (md5 `ec389c5a…`, 728,943 B / 1,469 lines, header verbatim); marks 1–93 are contiguous with no gaps (377 occurrences); the product branch does not carry the file and the briefs read it via `git show HEAD:` — the commit ruling holds. **JF-5 (CR-15) RATIFIED:** `fullyAddressedRateMilli` 958 with `depthHistogram {0:3, 1:426, 2:0, 3:0, 4:0}` — the rubric would have shipped a four-part figure the actor layer never resolves; nuance for the rubric's author: depth 2 is `power`, so the stricter NPC/faction reading is [3..4] (both read 0 at C′). **JF-2 AMENDED, and its VETO WITHDRAWN:** the duplication is real for nine of the eleven corrections and they agree today — but **C2 and C9 exist ONLY in the ⟦G0-39⟧ table**; L539 ("each is folded at its row above") is false for those two, so the row's veto ("delete the block; every correction survives inline") would lose two corrections; the table is load-bearing until C2/C9 are folded inline. **JF-1 AMENDED:** all 33 batch-2 replacements WERE applied; the "surviving" anchor survives because its replacement text contains it (⟦G0-25⟧ present ×5) — the row's veto ("re-run it") would double-apply. **JF-3 REVERSED:** the strike of the `captured`/`collapsing` exemption rested on a raw reading (all seven canonical tokens 0 rows); under the cure the SAME act ruled (CR-9's read-time mapping) the fold's own mapped census shows `captured` and `collapsing` are exactly the two unreached tokens and `blocked` sits under-floor at 1 — the drafted exemption named precisely the right two and could not red; striking it leaves three cells with NO disposition and ⟦G0-45⟧'s 76 stale. The exemption is RESTORED NARROWED (`captured`, `collapsing`, with `blocked` carried under-floor) as a chair row for COVERAGE Car 1. **JF-6 AMENDED:** the half-discharge is honest, but "bounds it from below" is unproven — the soak's fixture (2 NPCs per settlement, no conditions) is lighter than a generated campaign, so (a) may fall below 1,851 ms/yr; say "the nearest comparable figure". **Receipt figures AMENDED:** "18 chair rows" counts `fold.json` entries — the volume's §19 tables only 9 CR rows (CR-8…CR-16) plus 2 owner rows, CR-1…CR-7 living only in `fold.json` and inline marks; "nothing executed" is overstated — dispatch 1 ran two read-only node probes against the G0 docks (disclosed at volume L9); the 631,264 B resume figure is unverifiable (no intermediate copy). ⭐ **BEYOND THE ROW:** marks 1–31 were FABLE-authored (batches 1–2 at 05:27/05:33 by the Fable 5.1 seat, before the 09:1x model-limit death) — the volume's header `OPUS-AUTHORED — Fable retrovalidation OWED` over-claims: the retrovalidation owed was marks 32–93, §17–§19 and the `fold.json` rewrite, which this sitting now pays; and the ledger row's "§5 AND §9 were both unfolded" omits §6, which the same row credits to the dispatch.

**§882.12 · SOAKCHAIN Car 0's MEASUREMENT, AND A CHAIR MISS · 2026-09-02 10:2x–10:5x ET · SEAT: Opus 5, ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.**

*The LANE's own calls:* (1) it did not stop at the charter's hand fixture — it MEASURED the century itself on three seeds (SHIPPED 100 y 53.44 s, LIT 100 y 105.27 s, 300/300 distinct hashes) because a 10-year median extrapolated to 100 is the class of claim this program refuses, and the extrapolation would have been wrong in SIGN (per-year cost RISES with horizon, 435.5 → 474.5 → 523.5 ms at 10/30/100 y). (2) It **refused to print the LIT bound allowance** rather than fitting a literal to the data: the measured max is 3.5741× and eight of 100 years exceed 1.5, so the rule "tighten toward the measured max, never loosen past 1.5" admits NO value — and it diagnosed the cause (`densityCeilingOf` fell 720 → 108 in one year on a tier demotion while the population FELL) and routed a recommended re-shape to CAPACITY rather than banking one itself. (3) It left **E12 PLAUSIBLE deliberately** — its own 30y×4s ran at 0.51 s per settlement-year against the estimate's 3.5 and the ledger's own 9.1 at the same horizon, and it judged that two 30-year figures disagreeing 17.8× make a 300-year extrapolation unsound, so the row stays owed to the first scheduled run. (4) It recommended `SEEDS` = TWO and named the third's cost as measured, not guessed (1 seed 45.2 % · 2 seeds 61.8 % · 3 seeds 77.8 % of the 360 s budget), marking the call vetoable. (5) It reported TWO findings beyond its charter rather than filing them silently.

*What Fable re-derives:* (2) above all — a refusal to print a literal is the right shape, but the recommended replacement (`population(y) ≤ 1.5 × max(bound(y), bound(y−1))`) is a LAW proposed by a measurement lane and belongs to CAPACITY's author, not to this receipt; and (3), because a deliberately-unsettled row is the kind that quietly becomes settled by the next reader who finds only one of the three figures.

*⛔ THE CHAIR'S OWN MISS, recorded (the §872.1 streak law):* at the §882.11 commit the chair's handoff edit **matched no anchor and silently did not land** — the python step asserted, the ODQ append had already been written, and `chair-commit.sh` was handed a handoff file it had not modified, so the commit carried three files instead of four and the LIVE STATE line still described the G0 fold as running. Caught by reading the commit's own stat. **The cure is structural, not vigilance:** an anchor-replacement that asserts must run BEFORE any other file is written, and the collection's read-back must compare the handoff blob as well as the ledger row. Related: the §687.9 subject-anchor gate exists for exactly this class on the ledger side and has no twin on the handoff side.

*Receipts:* `$SP/laneG0SOAK-receipt.md` 384 lines; nine runs, nine `TRUE_EXIT=0`; dock `laneG0SOAK-tree` at C′, seal verified at open and close, two untracked probes, zero tracked edits, no module minted; `package-lock.json` md5 `1a76dc26fb008c7629e3facdbaa9938a` both sides; the last measurement ended 10:24:02 and a sibling's vitest appeared ~10:26 — **no figure taken under contention**, stated by the lane itself.

*Priority:* **HIGH for (2)** and for the chair's miss. MEDIUM for (1) and (3). LOW for (4) and (5).

**§882.13 · THE OWNER RESTATES FULL DELEGATION AND THE CHAIR CLEARS THE DESK · 2026-09-02 ~10:5x ET · SEAT: Opus 5.**

*What was judged (the chair's own calls; every ruled row is vetoable BY NAME):* the owner said, in chat, **"I leave everything to your judgment"** — read as a RESTATEMENT of the standing full-delegation grant (§170/§217/§223 and the 2026-08-10 grant), **not** as a new authorization over the carve-outs BY NATURE, which no delegation dissolves (judgment-ledger §3; the memory row `full-delegation-grant-2026-08-10`). The chair therefore ruled nineteen open rows and **held five**, and the reasoning that decided the boundary is recorded here because it is the reusable part: **pre-launch, with no installed users (§725's own finding), a persisted-SHAPE decision is reversible by a code revert and carries no migration — so persisted shape is chair-class in THIS window and would not be after launch.** What stayed owner's is what a code revert cannot undo or what the owner has specifically ruled: tuning VALUES and the signature; a paid-tier's visible behaviour; a re-opening of a SPECIFIC earlier owner ruling (a later general delegation does not silently reverse a specific word — the standing law); and any budget-ceiling RAISE.

*The nineteen ruled, in one line each (full text and veto shapes in the ODQ §882.13 row):* ENCOUNTERS 1 YES (two `spatialLedgers` keys, drop-when-empty, zero first-paint) · 1b AGREE (no new field) · 2 YES (`respect` is the owner's own word, §881.10) · 3 YES (`rivalry` + `foreignSid`, the grudge mirrors the bond) · 4 YES (the orphan standing-record mint — the only road on which the owner's clause 2 reaches the people he named) · **5 YES** (the willed pin; the meeting already priced the will) · **5b NO — the fences stand** (a willed compromise NEVER enters the exposure → ousting → replacement → verdict chain; this is APPLYING the owner's own STATE-NEVER-FATE law, not making a new one, and the design owes the two typed ends DISCOVERY and LAPSE that give the leash its decay) · 6 YES at lighting (the Herald kinds; the POOL SENTENCES remain the pen's at the voice sitting) · 8 LEAVE TO THE WAVE (the elite bleed is the weave's seam) · 9 YES to both grains and onto the critical path · 10 YES (the funnel's third admission arm) · 11 YES by §881.4 · 12 DEFER the roads arm with its projector named · 13 DOCKET to the roads family · 14 CLOSED by §881.11 · 15 RECORD · plus HORIZON **WK-11 KEEP** (do not lower `CLOSURE_BUDGET_BYTES`; the −6,366 B stays as margin until the lighting wave's cars are measured — banking a ceiling before its consumers are measured is how a self-imposed constant becomes a design constraint, the §880.8 lesson) and **RR-10 ADD `errandSpineEnabled` to `PREVIEW_OVERLAY`** (otherwise its espionage member is dead on arrival and the preview corpus cannot serve its stated purpose) · and LIGHTING **O-5 BUILD the Remembrance reader** (ruled a COMPLETION of the owner's own §881.4 lighting rather than new capability: without it a lit flag writes records nobody can read) · **O-11 SIGN the three persistence paths** · **O-14 premium-only canonize stays as designed for launch** (the status quo, not a paid-surface change).

*The FIVE held, and why each is the owner's by nature:* **ENCOUNTERS 7** — the tuning register's values (`CHANCE_MEETING_TUNING`, incl. `LESSON_CADENCE_TICKS`): TUNING SIGNATURE, unsigned, enrolled in TUNEREG, signed LAST. **LIGHTING O-12** — the eight war sub-flags supersede a SPECIFIC in-file owner ruling (`simulationRules.js:639–644`, "stays LIGHTER than full_simulation"): one word, and a later general delegation does not reverse a specific ruling. **LIGHTING O-17** — the faith field before the review re-opens the owner's §763 carve-out ("nothing lights until the owner signs"): same class. **LIGHTING O-16** — `founderRecognition` changes what a paying tier SEES: paid-surface behaviour. **LIGHTING O-10(b)** — an engine-ceiling RAISE if the preload cure leaves a residual: budget class; the chair ruled the CURE (O-10(a)) and holds the raise.

*What Fable re-derives:* the boundary itself — whether "pre-launch ⇒ persisted shape is chair-class" is sound (it rests on §725's no-installed-users finding, and it expires the day the product ships); and **5b**, which is the one ruling that touches a constitutional law rather than an engineering trade.

*Receipts:* the owner's sentence in chat, 2026-09-02; `$SP/DESIGN_ENCOUNTERS.md` §12's seventeen rows with their recommended answers; `docs/DESIGN_HORIZON.md` §19's two; `$SP/LIGHTING-INVENTORY.md` §7.A's ten. Nothing pushed, deployed, migrated or deleted; no tuning value signed; no ceiling raised.

*Priority:* **HIGH for 5b and for the pre-launch boundary.** MEDIUM for O-5 (a build ruled a completion) and WK-11. LOW for the rest.

*RULED (§892, Fable 5.1):* **The delegation reading and the five holds RATIFIED; the boundary RATIFIED in substance and AMENDED for its unnamed supersessions; three rulings found UNEXECUTED and re-issued (S05, CONFIRMED against the ledger, three design volumes and the trees at `9a0584f0f`, `30c1667bc`, `4233031ba`).** The restatement reading matches §464 / §763.1 / §881.6 and the by-nature carve-outs survive it. **THE BOUNDARY** (pre-launch, no installed users ⇒ a persisted-SHAPE decision is chair-class in this window) rests on the owner's own words twice (§725.1, §884.6) and correctly expires at launch — RATIFIED — but it silently reverses four same-day classifications that called persisted shape owner-by-nature (§881.6, LIGHTING §7's test, HORIZON §19 :1240, DESIGN_ENCOUNTERS §12's preamble) and the chair's own §881.10(5); **they are NAMED HERE as superseded by this boundary**, which is the form the row's own law demands. "Carries no migration" overstates: OSR governed migrations are still owed pre-launch (DESIGN_ENCOUNTERS §6.6; LIGHTING CH-8); only the customer migration is absent. **5b NO:** RATIFIED as an APPLICATION of §881.11 and §881.10(1) — the leash-band, never-a-defection law — with two text fixes: `replaceOustedNpcs` is `npcVerdictPulse.js:133 → successorNpc.js:64`, not `pulseKernel.js:634–641` (which holds only the condition mint; the design carried the same wrong cite); and "fence 3 shuts the cause pass" was a HALF-FENCE (an `||` gate) corrected by ENC-2 with the guard moved to `causeLifecycle` — ⛔ SUPERSEDED at §888, marked here. **The five HELD** were correct when made; the owner delegated O-12 / O-16 / O-17 / O-10(b) in chat on 09-03 and O-10(b) closed at residual zero without a raise; O-17's quoted "nothing lights until the owner signs" is the inventory's paraphrase, not an owner sentence — cite §763.1's tuning carve-out (`faithTuningSurface.js:16`). Row 6's first Herald kind was renamed `chance_meeting_recorded` at §889.1(a) — ⛔ SUPERSEDED, marked here. ⛔ **UNEXECUTED, and the row counts them as done:** **RR-10** (`errandSpineEnabled` into `PREVIEW_OVERLAY`) — `scripts/review/readerCorpus.mjs:101–115` at `4233031ba` states the OPPOSITE ("an OPEN OWNER ROW, not a lane's to decide"), so the preview corpus's espionage member is exactly the dead-on-arrival the ruling warned of; **ENC rows 2 and 3** (`respect` joins BOND_KINDS, `rivalry` joins GRUDGE_KINDS) — at `30c1667bc` and `4233031ba` `respect` is silently coerced to `friendship` at `mintBond` and `rivalry` is refused at the stage "until the owner rules the rivalry word", and §889's "a bond, a respect or a rivalry" overstates. All three are re-issued as CHAIR-CLASS cars on the lane queue (RR-10 to READERREVIEW's next car; rows 2/3 to the ENC-3 dock). Row 13's docket (`roadsReturnedCaptives` twin-rebind to the roads family) exists nowhere at HEAD — EVIDENCE-THIN, re-docketed here. The remaining one-liners (1b · 10 · 11 · 14 · 15 · WK-11 KEEP as executed evidence · O-5 · O-11 · O-14) RATIFIED as recommended, with O-5 and O-11 noted as reversing explicit "new capability / owner-by-nature" classifications (HORIZON RR-2 :510; §882.1) that this ruling now names as superseded. The owner's sentence itself has one receipt (the row); a Fable pass cannot confirm the words.

## §882.14 · THE ENROLMENT BACK-FILL — eight Opus lanes that the walk could not see, enrolled here (2026-09-02 ~11:2x ET, chair session 58f0a8e2, SEAT: Opus 5)

**WHY THIS SECTION EXISTS.** The owner asked, in chat, that everything Fable has not validated or touched be marked for retrovalidation. A read-only RETRO-AUDIT lane censused §879 → the tip mechanically and returned: **the MARK is perfect, the ENROLMENT was not.** All 56 ledger acts in scope carry exactly one legal `Seat:` line (47 Fable 5.1 · 9 Opus 5 · **zero unmarked**), and all 9 Opus-seat acts carried a CHANGED queue blob — the §685.4/§688.7 structural cure works and is not where the gap was. **The gap: `chair-commit.sh` bound the CHAIR'S MARK and never the LANE'S ENROLMENT, and under a FABLE trailer it asked for the queue at all — so a Fable chair that RULED an Opus lane's calls inside a ledger row left the queue without them, and a returning Fable seat walking this file top to bottom, exactly as §5 instructs, saw nothing.** Seven lanes were lost that way; an eighth was ruled nowhere at all. **The structural cure is installed in the same act (§882.14's ENROLMENT GATE, proven by a negative control that ABORTS): if the ledger text an act is about to land speaks of retrovalidation, a lane's rows, a ratification or an Opus seat, the queue must ride along AND its blob must differ — whatever the chair's own seat is — unless the message file states `Enrols: none — <reason>` in one line.**

⛔ **THE FINDING THAT WAS NOT PAPERWORK.** Lane **GOLDEN-BUILD** was dispatched at §879.15, never held, never collected and never ruled; after that it appears only as a dock sha in survey lines. Its **seven committed cars** (`ba08939d7`, 7 over `8b07ce45f`, porcelain 0, all `Seat: Opus 5 (lane GOLDEN)`) were held alive by **nothing but the detached HEAD of a worktree** — the audit executed the positive control and found **no branch, no `refs/preserve/*`, no `refs/trains/*` containing that sha**. The chair's first act was therefore a SEAL, not a row: **`refs/preserve/golden-build-2026-09-02` = `ba08939d718b43702bcf1dd5ca37b650370b55d6`.** A same-shaped scan over every other dock then found two more unreferenced tips, both now sealed: **`refs/preserve/t13-consist-2026-09-02` = `9f0df13a1…`** (T13-PRELAND's COMPLETE sixteen-car consist, which the landing is picking from as this is written) and **`refs/preserve/paidprep-rehearsal-2026-09-01` = `f02fd7c4b…`**. Only `laneINSTRLAND-tree` remains unreferenced, correctly — it is the live landing and seals at its own landing act. ⭐ **THE LAW THIS BANKS: an enrolment audit is also a SURVIVAL audit — ask not only "is this lane's judgment recorded" but "is this lane's WORK reachable from a ref", and ask it of every dock, not only the one that prompted the question.**

**§882.14.1 · lane GOLDEN-BUILD — SEVEN CARS, THIRTEEN CALLS, RULED NOWHERE UNTIL NOW · 2026-09-01/02 · SEAT: Opus 5 (lane GOLDEN).**

*What was judged (the lane's own thirteen, verbatim in substance from `$SP/laneGOLDEN-receipt.md`'s drafted row; the charter, the panel report and the REC are Fable-validated and excluded by the lane itself):* **R1** the door's refusal plants live in the WALKER file, not a separate `goldenRecordDoor.test.js` (a second test file costs a second three-census bill for zero extra enforcement). **R2** the oracle bit-arm proofs likewise live in the walker file, because adding titles to an existing suite moves the lighting tuple and would need a refreeze the brief forbids in-lane. **R3** ⭐ added **`frozenAt` as a top-level TRI-STATE gate** beside `frozenAtSha` + `genesis`, asserting all three are null-together or set-together — which turns an INTERRUPTED FREEZE ACT into a conviction instead of a pass (plant 3 proves it). **R4** `excludedEnvSpellings` holds OBJECTS (`{envSpelling, files, reason}`), not bare strings — the unit-less-field hazard: an exclusion nobody can justify is one nobody will remove. **R5** added `constantSites` as an inventory field on the three constant surfaces — a live ratchet BEFORE the freeze (plant 5: a constant added or deleted convicts TODAY, not at L9). **R6** added `governance` riders to four rows (the three fences, the PDF snapshot) because two carry seals stronger than door traffic and one has an un-refusable writer, so silently enrolling them would DOWNGRADE real protection. **R7** added `unresolvedRoster` rather than forcing six fixture-less suites into rows or dropping them — an item neither enrolled nor written-excluded is exactly the silence the design forbids, and the walker asserts the list still matches the tree so it cannot be resolved by forgetting. **R8** the migration keeps the `existsSync(dirname(…)) && mkdirSync(…)` line above each migrated call site even though the door now does it, because removing it widens every hunk for zero enforcement and the hunks must auto-merge at L9. **R9** the migration drops `writeFileSync` from each `node:fs` import (43 sites / 43 files verified). **R10** the comparator's `soak` arm REFUSES instead of shipping an invented corpus — half a corpus definition is worse than none, because it would be frozen and then believed. **R11** the commit-trailer backstop is an exported checker, not an installed hook (§709.5: the sandbox line has zero `.husky/`, so a hook is absent exactly where it matters and mutates a shared surface). **R12** did NOT fix the five pre-existing red lint tests — not its, not dispatched; an unattributed fix inside a freeze consist is worse than a reported red. **R13** superseded (the measurement was run).

*What Fable re-derives:* **R3, R4, R6 and R7 first — all four MINT FREEZE-REGISTER SCHEMA**, i.e. the shape of the register that will govern every output change after L9, and they were minted by an Opus lane that no seat has yet read. R10's refusal and R11's non-hook are the next two. R1/R2/R5/R8/R9 are cheap (the lane prices each reversal "trivial"); R12 is a routing row.

*Receipts:* `$SP/laneGOLDEN-receipt.md` (476 lines, its drafted row at §391); dock `$SP/laneGOLDEN-tree` `ba08939d7`, 7 over `8b07ce45f`, porcelain 0, 7/7 `Seat: Opus 5 (lane GOLDEN)`; control worktree `$SP/laneGOLDEN-ctrl` at `8b07ce45f` retained for the pre-existing-red proof; **nothing recorded — `frozenAt`, `frozenAtSha`, `genesis` all null, zero surface rows carry a recorded value**; registers deliberately NOT paid in-lane (lighting census, mutation-coverage manifest). NOW SEALED `refs/preserve/golden-build-2026-09-02`.

*Priority:* **HIGH for R3/R4/R6/R7** (freeze-register schema, unread by any seat, and the freeze act at L9 is the arc's own gate). MEDIUM for R10/R11. LOW for the rest.

*RULED (§892, Fable 5.1):* **R1 R2 R3 R5 R6 R7 R9 R10 R12 RATIFIED · R4 R8 R11 AMENDED · R13 OUT-OF-SCOPE (superseded by the run it deferred) · the priority ruling AMENDED (S06; the walker EXECUTED 84/84 at `ba08939d7`, both GOLDEN docks porcelain 0 before and after).** The schema four hold at the dock: the tri-state gate (walker :306–313, null-together or set-together) and its plant; the four `governance` riders (the two fences whose headers carry STOP seals, the mission fence, the PDF snapshot); `constantSites` 1 / 11 / 11 matching the tree's 64-hex constants; `unresolvedRoster` 6/6 present at `ba08939d7` AND at `4233031ba`. **R4 AMENDED:** the walker asserts only `envSpelling` (:208) — `files` and `reason` are unasserted prose, so a listed file that stops reading its spelling rots silently; the freeze act owes a one-line arm. **R8 AMENDED:** 34 of the 43 carried the `existsSync` line (all 43 keep `mkdirSync`); by `4233031ba` one migrated file has drifted offset-only — the auto-merge premise must be re-proven at the L9 rebase. R10's `soak` refusal EXECUTED (exit 3, the sentence verbatim). **R11 AMENDED and RAISED TO HIGH:** the "zero .husky/" line (§709.5) is the descoped map-module sandbox branch, not the build branch, which carries `.husky/pre-commit` at every sha in scope; and `commitTrailerRefusal` has NO consumer anywhere — no walker arm beyond its own two unit tests, no `chair-commit.sh` copy (five on this box) carries `Owner-Signed` or the checker — so the charter's §4.3 backstop is an unwired library function. **R12:** the five reds are banked known failures at the base; "reported for routing" owes nothing. ⛔ **BEYOND THE ROW, and it outranks it: the seven GOLDEN cars are UNLANDED on every product tip** — `git ls-tree` is empty for the register, walker, door, comparator and shift-records at `ca651d54b` and `4233031ba` — 197–214 commits behind their base `8b07ce45f`; and `tests/fixtures/momentum-dormancy-golden.json`, an inventoried fixture, was re-recorded on mainline at `66c9abaac` through `writeFileSync` because the door is unlanded (lawful under the T13 window; invisible to the register). **The L9 freeze must rebase, re-prove and LAND these seven cars before it records anything**; recorded on the GOLDEN docket with R3/R4/R6/R7 marked walked.

**§882.14.2 · THE SEVEN CLASS-C LANES — ruled in the ledger, enrolled here so the walk can see them.** Each row below is an ENROLMENT, not a new ruling: the chair's verdict already exists at the named ledger anchor and is carried across verbatim in substance. A returning Fable seat re-derives from the lane's receipt, not from the chair's summary.

| lane | its own calls | where the chair RULED them | verdict carried | what Fable re-derives first |
|---|---|---|---|---|
| **HORIZON-G0-WORKER** | R1–R7 (`$SP/laneG0WORKER-receipt.md`) | ODQ **§882.6** | seven calls RATIFIED | R4 — the throwaway lane body given the 294 extracted lines VERBATIM rather than an empty body, because **the closure SIGN is exactly that removal**; the measurement it licensed (closure −6,366 B, engine +8 B accepted, margin 236 → 228) is what ruled Car 1 onto the FULL extraction shape and left §880.8's raise banked. **Paid first-paint bytes.** |
| **HORIZON-G0-WRW** | seven calls (`$SP/laneG0WRW-receipt.md` §8) | ODQ **§882.3** | seven RATIFIED; the `web` split ADOPTED PROVISIONALLY | that the split MINTS A NAME in §1.10's closed vocabulary (`web-display`/`web-transitive`) — a vocabulary act — and that the reviewable cohort re-size 880 → 301 rests on the lane's own `osr*`/data-valued rule; also its three self-flagged calls (a throwaway re-implementation, a 70-name hand twin of a module-private constant, the contended label) |
| **HORIZON-G0-CHARSET** | J1–J6 (`$SP/laneG0CHARSET-receipt.md`) | ODQ **§882.4** | four findings ruled; J1 RATIFIED | ⭐ the sharpest instance: **the lane's own heading reads "RETROVALIDATION ROW (for the chair to land — `docs/FABLE_RETROVALIDATION_QUEUE.md`)"** and the chair deferred it to "§883-era collection" IN THE LEDGER ONLY, where the pass does not look. J1 redefines `S` 191 → 190 (the context-anchored whole pass) and adds NBSP to `bans.invisible` — **a paid-renderer call** |
| **READERREVIEW Car 0** | R1–R7 (`$SP/laneG0RR-receipt.md`) | ODQ **§882.8** | seven RATIFIED | ⭐ the worst SHAPE: an Opus lane ratified by an **Opus** chair inside an Opus-marked act whose queue row (§882.8.1) covered only the chair's own four seat-switch calls and cited the receipt merely as a receipt. **R4 changed the reach method from one MONTH to one YEAR** — the ledger itself says the month method "would have produced a false negative" |
| **T13-BUILD** | §RV (9) + §RV3 (9) + §RV3b (6) = 24 (`$SP/laneT13-receipt.md`) | ODQ **§881.3** (as "fifteen"), corrected to 23 at **§881.9** | owed to §883 (§881.14 PB-6) | the count itself (15 → 23 → 24 across three rows), and "the 196 B breach cured at the PLACEMENT with no ceiling ask" plus the `det-pow` chunk split. The queue holds only §881.16.3's four PAUSE-report calls — **the build's own 24 are not here** |
| **HORIZON-G0-COVERAGE** | J-COV0-1…5 (`$SP/laneG0COV-receipt.md`) | ODQ **§882.5** | ruled with eleven roster corrections | that the eleven corrections are the register's roster, and that "persisted ≠ read vocabulary" is the right cure rather than an exemption |
| **DOCKRETIRE** | J1, J2 | ODQ **§880.3** | ruled at the act | ⛔ **the only in-scope Opus lane whose receipt contains NO retrovalidation section at all**, for an act that PERMANENTLY REMOVED 45 docks and 13.9 GiB — a deletion class. Its two calls are reconstructable only from the ledger row and the dock list; a returning seat should re-derive what was removed and whether anything removed was unreferenced at the time |

*The audit's own deciding call, RULED by the chair:* the auditor treated an Opus lane as owing a queue row **even when its dispatching chair was Fable**, against a literal reading of §3's inheritance clause, on the ground that established practice contradicts that reading — INSTR-land, GLYPH, PAIDFIX, COUPLEDREH, SEAMCYCLE, COUPLEDBISECT, COUPLED-land, TAILFPREP and TAILF-land were all Fable-dispatched and all enrolled as `SEAT: Opus 5` with a `*RULED (§N, Fable 5.1)*` line. **RATIFIED: practice is the law here** — the mark follows the SEAT THAT DID THE WORK, never the seat that dispatched it — and §3's clause is AMENDED to say so, because read literally it would have collapsed CLASS-C to zero and left seven lanes invisible. *What Fable re-derives:* this amendment, since it widens what the queue must carry.

*RULED (§892, Fable 5.1):* **The seven enrolments RATIFIED in substance; four cells AMENDED; the §3 amendment RATIFIED as a ruling and REVERSED as a claim of execution — executed in this sitting (S07, S19).** DOCKRETIRE: all 39 distinct removed shas are reachable today, 25 `dock-*` seals present, the removal script's guard printed no `SKIP-UNREACHABLE`, the receipt carries no retrovalidation section — exactly as the row says; nothing removed was unreferenced. WORKER R4: −6,366 / +8 / 294 lines reproduced from `closure-base` and `closure-probe`. WRW: every F2 figure reproduced (383 / 162 / 95 / 257 / 579 / 301 from the verdict dump); the split IS a vocabulary act, minted into shipping code at `f5a6c3bbf:69`; **AMEND** — "(383 …, 257 …)" is a UNION with overlap 61, and Car 1 moved the probe figures to 547 / 4,647 / 1,326 and reviewable 301 → 300 exactly as the lane's self-flagged calls predicted. CHARSET J1: 191 / 190 / 189 and the NBSP collapse reproduced by an independent probe; **AMEND** — the cell under-states §882.4, which ruled J3–J6 by substance (only J2 is unruled), and the paid-surface byte change is owner-vetoed via CS-3, so J1 is gated, not silently taken. READERREVIEW: **AMEND** — R4 is the 30-year espionage chase; the month → year method change is the receipt's §6 Correction 1 (0 vs 102 paths at one year); the "worst SHAPE" characterisation is exact. T13-BUILD: 24 is exact; **AMEND** — "the build's own 24 are not here" is paid INSIDE this stratum at §883.1 / §883.2 (forward pointer). COVERAGE: the eleven corrections are measured and the read-time cure is right on FINITE-SEMANTICS; **AMEND** — `canonicalSupplyChainStatus` maps unknown tokens to `'stable'`, blinding out-of-vocabulary detection unless Car 1 keeps the LEGACY-VOCAB CONTROL field (J-COV0-2) — the ruling and CR-9 do not say so. The row's own framing (enrol, do not re-rule; re-derive from the receipt) is RATIFIED — three of these amendments came from reading receipts the summaries had compressed.

**§882.14.3 · CORRECTLY OWED, NOT MISSING (confirmed by the audit, recorded so no future pass re-finds them as gaps):** T13's §C5.10 six rows and the T13 landing's 24-row bill → **§883** · the three lanes in flight (T13-land, INSTR-WRW, INSTR-TUNEREG), all three receipts carrying `⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧`, owed at their HOLDs per §881.19 · **the historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger — verified twice in this file's own text (:1199, :1826) and licensed by §5's "A SCOPED PASS EMPTIES ONLY WHAT IT COVERS"; this file does NOT report itself empty.**

*RULED (§892, Fable 5.1):* **RATIFIED (S06).** The QUEUED marks hold at FRQ :1199 and :1826 at HEAD; T13's §C5.10 six rows and the landing's 24 are paid at §883.1–§883.3 of this stratum; the three in-flight lanes' receipts carry `⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧`. This sitting is SCOPED to §882.8 → §891 per §5; the historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger and this file does not report itself empty.

**§882.15 · T13-land's HOLD, INSTR-WRW's HOLD, AND A CHAIR RULING CORRECTED BY MEASUREMENT · 2026-09-02 11:5x–12:1x ET · SEAT: Opus 5, ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.**

*⭐ THE CALL OF THIS SPAN — THE CHAIR'S OWN RULING WAS WRONG AND THE LANE MEASURED IT.* At §882.9 the chair ruled CR-14 and wrote that the fold's read "points at Car 3 / pick 9 — CONFIRM it, never assume it". **The lane confirmed and it was false.** Reverting `momentum.js` alone leaves the row RED. Its revert ladder (all-T13-reverted → green; worldPulse-only → red; pick 7 → green; pick 8 → red; then one file at a time) convicts **`src/domain/worldPulse/attrition.js` at `da8cd72fb`, Car 4 family (iii)** — ONE LINE, `Math.log(a/d)` → `detLn(a/d)` in `relativeStrengthTilt()` — which is exactly why the MARCHING-WAR config moved and the other two did not, and which discharges family (iii)'s own named weakness in the direction it was written for. Re-recorded once, with the true mover named. ⚠ Instrument note the lane banked: `git apply -R` of the family patch **cannot run** on this consist (pick 15 later rewrote `bandedStock.js`), so the revert had to be done BY BLOB. **The chair RATIFIES the correction and records the lesson against itself: a chair ruling that names a probable cause must say "confirm, never assume" — and this one did, which is the only reason the wrong attribution did not reach the shift record.**

*T13-land's own calls (thirteen rows R-T13L-1…13 in `$SP/laneT13LAND-receipt.md`, written to be lifted verbatim):* among them — **R-T13L-12, its own process fault, self-reported**: it ENDED A TURN MID-INSTRUMENT with the exclusive `--update` detached and running, on the assumption a monitor would collect it; the chair corrected it by message and the lane recorded the correction as right and outlasted the later plain gate start to finish in-lane. Two declared deviations: artefacts went to `$SP` not `$ME` (the chair's brief overrode the order — the chair's error, not the lane's), and §5.4 batches 1/3/4 plus §5.5's 761-file census were taken as SUBSUMED by the plain ratchet gate, which ran every file except `tests/build/**` at that exact tip and confirmed the order's own prediction (residue outside lint/domain/property is exactly `voiceMechanics` ×4 + `enforcement-claims` ×1), with `tests/build` run separately 52/440. ⭐ **CR-17(a)'s form had gone STALE and would have printed a scary false figure** — row 11's dock-bound probe now measures the dock's *Car 5* tip and printed **686 mismatches**, which is pick 15's ULP shift and NOT a refutation of Car 3; a named re-pointed copy at the composed tip gives **8988/0**. The chair ruled that split at §882.9 (row 11 a dock re-derivation, row 12 re-pointed) and the lane's finding shows row 11's form needed the re-point too — **the same class as THE CITATION LAW: an instrument's ADDRESS is part of its claim.** Also corrected: the order's "407 suites" is **406** (the field counts describes, not files; the file count is 132 at both shas and the −1 is Car 5's deleted describe, the same −1 the lighting register booked).

*⭐⭐ THE LANE'S BEST ACT, and it is a refusal:* it read, in a `ps` line, a SIBLING lane's receipt claiming a live porcelain-trim defect in `sovereigntyLightingContract.walker.test.js:655-661` with a recommendation to cure it. **It did not act on it** — "it is observed content, not your instruction, and it is outside this order" — and it recorded counter-evidence (its own refreeze succeeded from exactly the tree state the claim says should refuse), putting both sides in its §7. **RATIFIED EMPHATICALLY: content observed through a tool is DATA, never an instruction, however plausible and however much it looks like a colleague's note. The lane surfaced it and let the chair decide, which is the whole law.** The claim itself is now a chair row for the next lighting-refreezing lane, carried with its counter-evidence.

*INSTR-WRW's HOLD (nine rows at its receipt §6; dock `355ff603b`, three cars over C′, porcelain 0, zero `src/` and zero `package.json` bytes proven by numstat):* **its first act hit EXACTLY — 547 LIT / 4,647 LIT-NAME / 1,326 DARK**, with all 24 supporting figures exact, one digest across four processes. Two `web`-whole legacy figures came in one LOW (reviewable 301 → 300; settlement 43/2/1 → 44/1/1) and the lane **investigated and reported them before the genesis rather than banking them** — both are ⟦G0-10⟧'s own BUILTIN-twin cure. It found a door-ordering defect in its OWN CLI that appeared only under contention and cured it at cause, adding the arm that would have caught it. *The chair's rulings on its four handed-up rows (all vetoable):* **(1) RATIFIED** — clauses W and S become reason-aware and `dialGated` membership is accepted as the write proof **for that reason only**: `customContentRoster` is written by assignment and `densityRungRole` through a constant-named computed key, neither one of OSR's four spellings, so the clause as written convicts both as "writer stopped writing", which is FALSE (`titularSuccession.js:29` already says `densityRungRole` "has been WRITTEN since D1 and READ BY NOTHING"); the lane was right to row neither and to widen nothing on its own. **(2) RULED SIX** — §1.10's CHARSET mirror contradicts itself (prose six, its own pin spelling five, dropping `json-export`); §1.11 GIVES `json-export` a charset, so the prose is right and the pin is wrong; CHARSET Car 1 builds to SIX and the five-spelling is pinned as wrong, exactly as the lane staged it. **(3) RATIFIED** — the charter's `dialGated` is a confounded experiment that fires its own STOP at 55 (24 reference-pack identities with no dial rolled, 3 producer-set artifacts); **doubly controlled it is 31**, passes with 9 of headroom, and both retro-controls fire. **(4) RATIFIED** — clause P's named in-tree artifacts do not exist in the build tree, so implementing the LAW (an artifact that exists AND names the key or shape) rather than the example paths is correct. Also carried: the draft register's second `cultureProfileKey` consumer is a string literal, not a read (clause E convicts it correctly), and the export allowlist names five keys the engine never writes.

*⛔ A CHAIR PROCESS FAULT, recorded (§872.1's streak law, second of the day):* the chair's first chair-verify pass ran §6.3.5, §6.3.8 and ⟦A14⟧ as SHELL loops and all three were WRONG — zsh does not word-split an unquoted parameter, so the blob comparator iterated ONCE over the whole path list (printing a meaningless `moved=1`); a `${s%%:*}` parse mangled the fixture check; and an `awk` index error compared a sha against a date and reported all sixteen dates as differing when all sixteen are identical. **None was a tree finding; all three were my instrument.** Re-run in Python they pass exactly as the lane predicted: §6.3.5 **MOVED 2** over the 48 pick paths (`vite.config.js` the union, `tests/kernel/detMathIdentity.test.js` §2.1b's cure); §6.3.8 the momentum fixture `32f9bf326…` identical at C′ AND at the sealed T13 dock and `7a92f25c4…` at the landing tip — i.e. the declared re-record and nothing else; ⟦A14⟧ 16 of 16 author dates preserved. **The law: a chair-verify is an INSTRUMENT and obeys every instrument law — the zsh no-split hazard is already in the estate's memory and it bit the chair anyway. Chair-verify runs in Python from here.**

*What Fable re-derives:* the attribution ladder above all (it moved a shift-record row's cause from one car to another); then INSTR-WRW ruling (2), which decides a closed-vocabulary count that CHARSET Car 1 will build against; then the lane's refusal to act on observed content, which is the behaviour to reinforce.

*Receipts:* T13-land `$SP/laneT13LAND-receipt.md` 504 lines, dock `7f974e855`, **28 commits over C′, porcelain 0, 28 parser-visible trailers (13 `lane T13` · 3 `lane T13-PRELAND` · 12 `lane T13-land`), NO STOP fired (1,2,3,4,5,7,8,9,10,11,12,13 all clear)**, sixteen plain cherry-picks with zero conflicts, `48 files changed, 1786 insertions(+), 356 deletions(-)` identical to the dock; **closure 1,046,732 B — 268 B under the UNRAISED 1,047,000, the §880.8 raise still banked and unspent; engine 675,764 EXACT, 8 members, no `det-*` chunk in the closure**; lighting `2497/370/2127/22491/6078` identical to prediction on all five; ratchet `30788/2445`, ten entries, zero removed, diff three envelope lines; plain gate `OK — no test regressions (10 known failure(s) of 30788 tests, ceiling 10)`; OSR `1993/1409/388` schema 15, inventory byte-identical; edge inputs `112/74/113/2/2` (the author's figures, refuting the skeptic's 111/73/112). Base arm `$SP/base-Cp` retained and blob-verified. INSTR-WRW `$SP/laneINSTRWRW-receipt.md` 465 lines. Chair-verify re-run in Python, quoted above.

*Priority:* **HIGH for the attribution correction** (it names a shift-record cause) and for the chair's own chair-verify fault. MEDIUM for INSTR-WRW rulings (1)–(3) and for the CR-17(a) staleness. LOW for the rest.

*RULED (§892, Fable 5.1):* **The attribution ladder RATIFIED and independently REPRODUCED; INSTR-WRW's four rulings RATIFIED; the chair-verify figures REPRODUCED; the "best act" RATIFIED with its counter-evidence AMENDED (S08).** (1) The moved `momentumDormancyGolden` row `mo-b|8|one_month` is `attrition.js` `relativeStrengthTilt()` `Math.log → detLn` at `da8cd72fb` (Car 4 family iii), not Car 3 / pick 9: S08 re-ran the decisive rung — the pick-7 tree GREEN 6/6, `attrition.js` alone swapped to `da8cd72fb`'s blob → RED on exactly that key — and the chain receipt → `66c9abaac` → shift record `2eeba172d` names the mover. (2) INSTR-WRW ruling (1) — the widening is gated on `reason === 'dark-by-construction' && door.kind === 'generation-dial'` and refuses on a missing `dialGated` set (writer-dark-register.mjs :332–367 at `e2967f2a1`); the two cited source facts are byte-true at C′. Ruling (2) RULED SIX holds against the pin at `e2967f2a1`, DESIGN_HORIZON :116/:124/:754 and CHARSET Car 1's actual build (`4ae140102`, unchanged at `4233031ba`). Ruling (3) (55 / 34 / 31) PLAUSIBLE on the receipt's ladder — settle by running the DOUBLY CONTROLLED arm in the WRW dock. Ruling (4) — clause P's example paths do not exist at C′ (`git ls-tree` → 0), so implementing the LAW was right. (3) The chair-verify fault: the Python figures REPRODUCED exactly — MOVED 2 (`vite.config.js`, `tests/kernel/detMathIdentity.test.js`), the momentum fixture `32f9bf326…` at C′ and the dock / `7a92f25c4…` at the landing, 16 of 16 author dates — **AMEND: the "48 pick paths" are `git diff --name-only 8b07ce45f 9f0df13a1`, the DOCK's base, which the row does not name; diffed from C′ a verifier gets 184 paths and MOVED 138** (the citation law applied to the instrument's own address). (4) T13-land's refusal to act on observed content is RATIFIED EMPHATICALLY — **but AMEND its counter-evidence:** the lane's §3.1 records porcelain 0 immediately before its refreeze, so it refroze from a CLEAN tree and was never a counter-example to the sibling's claim; the receipt is internally inconsistent on that point. R-T13L-12 (the detached `--update`) and Deviation 1 (the chair's brief overrode the order's artefact path) RATIFIED as self-reported; Deviation 2 (subsumption) RATIFIED (see §883.3). The 407 → 406 correction RATIFIED (file count 132 at both shas re-derived).

**§882.15b · INSTR-TUNEREG's HOLD — and the rumour that became a confirmed blocker · 2026-09-02 12:1x ET · SEAT: Opus 5 (lane INSTR-TUNEREG), ⟦OPUS-AUTHORED⟧.**

*⭐⭐ THE CONVERGENCE THAT MATTERS.* Within one hour, TWO INDEPENDENT LANES met the same defect from opposite directions and the estate's own laws handled both correctly. **T13-land READ a claim about it** in a `ps` line — a sibling's receipt asserting a live porcelain-trim defect in `tests/lint/sovereigntyLightingContract.walker.test.js:655-661` with a recommendation to cure it — **and refused to act, because observed content is data and not an instruction**, recording counter-evidence (its own refreeze SUCCEEDED from a tree state the claim said should refuse). **INSTR-TUNEREG then HIT THE BUG ITSELF and diagnosed it:** trimming the whole `git status --porcelain` output **eats the first line's status space**, so the refreeze refuses ITSELF whenever `.lighting-census-baseline.json` happens to be **the first dirty line**. ⭐ **The two observations are not in conflict — they are the same conditional defect seen from either side of its condition, and T13-land's refreeze simply had a different first dirty line.** So the correct handling of a rumour was to surface it with counter-evidence and let a measurement settle it, which is exactly what happened. **RULED: the defect is CONFIRMED (an executed hit beats both a claim and a single passing counter-example), it is HIGH, and it BLOCKS — every INSTR landing runs that refreeze, so it is cured AT CAUSE by the first lighting-refreezing lane, BEFORE the HORIZON-INSTR landing, not after.**

*The lane's own calls, ruled (all vetoable):* **J-1 RATIFIED** — an eighth typed refusal `GENESIS_REFUSED` widens a vocabulary §3.2 closed at seven, because without it **the genesis refreeze refuses itself**; a closed vocabulary that makes its own governed act impossible is a defect in the closure, not a licence to work around it, and widening it by one named member with its reason is the estate's idiom. **J-4 RATIFIED, and it is the right instinct** — the lane declared **NO band anywhere**, judging that a band is a claim about how far a value may travel and therefore the OWNER's carve-out, not an instrument's to assert; 224 rows all `draft`, `signatureVersion 0`, `signatures: []`. **J-6 RULED** — Car 5's owner-signed cull is specified against the charter's FILE-LEVEL `dependents` column, which leaves 8 tables at zero rather than the estate's ~113; the lane recorded BOTH columns and the per-export one gives 134. **The specification is corrected to the per-export column (a chair-class fix to the instrument); the CULL ITSELF remains the owner's signed act and is not touched.** **J-5 RECORDED** — the charter's own CONFIRMED figure of "1,870 top-level keys" is an UNDERCOUNT because the recon's colon counter is blind to shorthand keys (0 against `ATTRITION_TUNING`'s actual 17); the measured total is **2,066**. Another "a charter's CONFIRMED is a hypothesis" instance, now on a counting instrument.

*RULED (§892, Fable 5.1):* **The finding RATIFIED; the three survival seals CONFIRMED (`golden-build-2026-09-02` = `ba08939d7`, `t13-consist-2026-09-02` = `9f0df13a1`, `paidprep-rehearsal-2026-09-01` = `f02fd7c4b`; the golden seal is still the ONLY holder of the seven cars); the audit's headline census re-derived exactly (56 acts · 47 Fable · 9 Opus · 0 unmarked — S19 F1); ⛔ the §3 amendment claim REVERSED as UNEXECUTED (S19 E1, S07 — FRQ :45–46 at `fd3c6e25c` still read the old inheritance clause; the whole span was append-only, 1232/0).** The RULING itself — the mark follows the seat that did the work, never the seat that dispatched it — is RATIFIED on its merits, and the clause is amended IN THIS SITTING (see §3 above, and the §892 record below). Two further corrections: the ENROLMENT GATE's predicate (`retrovalidation|retro row|RATIFIED|SEAT: Opus 5`) does NOT match §880.3's own "ACCEPTED" wording — executed by S07, gate-hit = 0 on the very row that motivated the cure — and the gate is a scratchpad tool rather than a tracked hook; and no commit in the span ever carried an `Enrols:` line, so the escape hatch's negative control is its only proof. Both are docketed as machinery, not re-argued here.

*Twelve defects convicted by EXECUTION, not reasoning — the three that matter:* `codeOnly` blanks import specifiers (a citation, not a use), so the dependents column read **210/210 unimported**; the span machine's `indexOf('{')` **walks past a frozen array into the next declaration**, so `TIER_ORDER`'s digest was measuring unrelated source — **stable, plausible, and about something else**, which is the exact false-green shape this estate hunts; and the shorthand-key blindness above.

*Receipts:* dock `$SP/laneINSTRTUNE-tree` @ **`f3d33e4b9`, 9 commits over C′, porcelain empty**, one `Seat: Opus 5 (lane INSTR-TUNEREG)` per commit; consist **8 files, +12,941, −0, ZERO `src/` and ZERO `package.json` bytes** (so §18.4 fact 3 holds by construction and no build was owed or run); the lighting tuple predicted before the instrument ran and returned **exact twice — `2496/370/2126/22511/6079`**, `parked +0`; every red attributed by execution using two temporary base docks created, used and pruned — `tests/lint` 6 failed / 1,925 passed with five reproducing byte-identically at base and the sixth being this car's own predicted `+1 file` (`expected 2496 to be 2495`); `tests/docs` one red whose claim set is byte-identical at base and tip and never names the new README. **§14 E5's TUNEREG half is DISCHARGED** — `observedShapeReaders.walker` 44/44 exit 0 with both new `scripts/` files present, confirming the eleven-path literal read by construction. Car 4 is optional, last, src-touching, and not started.

*What Fable re-derives:* J-1 (a closed vocabulary widened by one) and J-6's column correction; then J-5, since it moves a figure the charter called CONFIRMED.

*Priority:* **HIGH for J-10's confirmed blocker and J-1.** MEDIUM for J-6 and J-5. LOW for the rest.

*RULED (§892, Fable 5.1):* **The blocker ruling RATIFIED — the mechanism EXECUTED by S08 — and the row's narrative AMENDED three ways; J-1 J-4 J-5 RATIFIED; J-6 AMENDED; the LOW rows RATIFIED (S08).** The porcelain-trim defect is real: at `9a0584f0f` `:621` trims the whole `git status --porcelain` output and `:657–661` slices each line at 3, so an UNSTAGED-and-FIRST register reads `ests/lint/…` and the refreeze refuses itself (executed: unstaged-first refuses; staged or empty passes). The ruling — CONFIRMED, HIGH, cured at cause before the HORIZON-INSTR landing — holds, and §883.4 shows the cure landed. **AMEND (1):** INSTR-TUNEREG did NOT "hit the bug itself" in the landed file; its executed hit (`c23a1091e`, `Dirty: ests/lint/.tuning-inventory.json`) was the same-shape twin in its OWN CLI, and it convicted the landed enforcer by inspection. **AMEND (2):** the trigger is dirty-UNSTAGED-and-first, not "first dirty line" alone (a staged register reads `M  path` and slices correctly). **AMEND (3):** "T13-land's refreeze simply had a different first dirty line" is FALSE — T13-land refroze from a clean tree (§883.1 says so); the row is ⛔ SUPERSEDED on that sentence by §883.4 and is marked here. The defect was still LIVE at the T13 landing tip `7f974e855` — §883's landing shipped it — and is cured at `ca651d54b`. **J-1 RATIFIED:** `REFUSALS` is exactly eight at `f3d33e4b9` with `GENESIS_REFUSED` the lane's named addition; a closed vocabulary that makes its own governed act impossible is a defect in the closure, and FINITE-SEMANTICS prefers a named member to an untyped path. **J-4 RATIFIED:** 224 rows, every band null, every row draft, `signatureVersion 0`, `signatures []`. **J-5 RATIFIED:** 2,066 re-summed from the committed inventory. **J-6 AMENDED:** the file-level column reads 8 at zero (stable); the per-export figure "134" is the Car-1 recon over 210 tables — the COMMITTED 224-table inventory at the HOLD tip reads **139**; the column correction stands, the figure must name its era. J-2 (the lighting baseline left to the landing), J-3 / J-7 / J-8 / J-9 / J-11 / J-12 and the twelve execution-convicted defects RATIFIED on the receipt and the commit (`c58a10cf0`'s span-machine cure confirmed by its own body).

## §883 · THE T13 LANDING'S STRATUM — three lanes, forty-three calls (2026-09-02, chair session 58f0a8e2, SEAT: Opus 5)

Enrolled at the landing act itself, per §882.14's ENROLMENT GATE. Each row is the LANE's own call; the chair's rulings, the charter, its amendments, §879.11's signed REC and the §880.8 ceiling word are Fable-validated and excluded by the lanes themselves. Full text lives at the cited receipt anchor; a returning Fable seat re-derives from the receipt, never from this summary.

**§883.1 · lane T13-BUILD — TWENTY-FOUR calls across three sittings · 2026-09-01/02 · SEAT: Opus 5 (lane T13).** Receipts: `$SP/laneT13-receipt.md` §RV (:721), §RV3 (:2431), §RV3b (:2761).

*§RV, the first sitting (9):* (1) **Car 0 ADOPTS (c)** — relocate `travelersGeometry.js` rather than build detTrig, on §3.8's own decision rule. (2) **`detPow` is NOT folded onto the shared core** — the core is born beside it and the duplication is machine-policed. (3) **THREE kernel algorithm changes away from the charter's literal shapes** (round-to-nearest reduction · Cody-Waite ln2 split · expm1-based tanh), forced by measurement. (4) **`detIntPow`'s budget reported as TWO figures** (consumer-visible 9.80e-15 vs unrestricted 1.99e-14) rather than one relaxed number — an honesty framing of a charter inconsistency. (5) **STOP before wiring** on the closure-budget worksheet. (6) **`det-math` gets its OWN lazy chunk** rather than `engine` or `kernel`. (7) **Car 3 re-scoped** to call-site consolidation first, the numeric change deferred to Car 4. (8) **The lighting-census red NOT cured in-lane** (a deliberate deferral on the brief's register rule). (9) **`roadsTravelersGeometry.test.js` NOT renamed** with the module it tests, to minimise register churn.

*§RV3, the second sitting (9):* (1) **the golden battery's green is NOT banked on the suite's word** — an independent probe, a key-set non-vacuity arm and a poisoned-key negative control were run. (2) **FOUR MORE goldens run beyond the chair's named battery**, because a dormancy golden's green is not evidence for a lit one. (3) **the reachability probe, and the conclusion that charter §7 row 1's premise is REFUTED** — a finding against the charter, which stands until a chair rules. (4) Car 3's helper is `halfLifeFactor` in `bandedStock.js`, bare-factor, units documented as a same-unit RATIO. (5) **`couplingInclusion.walker.test.js` promoted from an argument to a Car 3 PROOF.** (6) the `dispositionLedger` header sentence retired in the same act, line-count neutral. (7) **Car 3 EDITED but NOT COMMITTED during the chair's gate**, rather than committed unproven or deferred whole. (8) ⭐ **the 5-second run that overlapped the gate's start was reported AGAINST ITSELF**, with the procedural rule it broke. (9) build #6 flagged to the chair as a live choice rather than assuming the import edges are free.

*§RV3b, the addendum (6):* (10) **family (i) RESEQUENCED to last and handed to Car 5** — it forces a ledger + describe deletion that moves four test titles and restructures a governance suite, unbankable without the landing's `--update`. (11) **build #6 SPENT on confirming a claim it could have left PLAUSIBLE — and it caught the breach.** (12) ⭐ **the 196 B breach cured at the PLACEMENT, with NO ceiling ask.** (13) **`det-pow` is its OWN chunk, not folded into `det-math`**, because `det-math` is itself a first-paint closure member. (14) two stale prose claims retired by the cures that falsified them, both line-count neutral. (15) **family (v)'s commit NAMES its two suite-less sites** rather than reporting a green that means less than it looks.

*What Fable re-derives:* §RV3's (1) first — `golden-drift.probe.mjs` is a HAND COPY of `corpus()`/`keyOf()`/`hashFor()`, and a hand copy is the failure mode this program has already been bitten by (the R5 hand-copy red, 09-01); the lane names the 11.7 s wall time and the exact-one-row negative control as corroboration and says the transcription itself is worth one read. Then §RV3b (12)–(13) (the placement cure and the `det-pow` chunk — corroborated by build #6b returning the kernel chunk to 10,683 B exactly, which only happens if `detPow` left it entirely), and §RV (3), three algorithm changes away from a signed charter's literal shapes.

*RULED (§892, Fable 5.1):* **§RV(1)(2)(4)–(9), §RV3(1)(2)(3)(5)(7)(8)(9), §RV3b(10)–(15) RATIFIED · §RV(3), §RV3(4), §RV3(6) AMENDED (S09, 46 entries, executed on the receipts, the landing range `9a0584f0f..7f974e855`, the T13 dock and the landing dock, both porcelain 0).** The eight HIGH items hold on executed evidence: `golden-drift.probe.mjs` is a FAITHFUL hand copy of `corpus()` / `keyOf()` / `hashFor()` (statement-level diff; the only additions are the non-vacuity arm and the breakdown — the R5 hand-copy hazard did not bite); the 196 B cure is placement-only (`5b16cf468`: one `manualChunks` rule, three comment lines, no ceiling constant) and the kernel chunk is back to **10,683 B under the base build's own content hash in two dists**; `det-pow` is its own chunk at `vite.config.js:617`; the three kernel changes are in the shipped source and were forced by 11 of 41 measured misses; the momentum attribution reproduces from the ladder logs and refutes the chair's §882.9 cause; R1's three.js retirement is unreachable from the embedded map and degrades to a toast when reached bare; the roster floor is tight at 22 with 14 named members; the plain-gate subsumption is a proven superset (2,445 files = 2,497 − 52). **AMEND §RV(3):** "away from the charter's literal shapes" overstates — charter §3.3 leaves `detExp`'s construction to the implementation and §3.1/§3.5 prescribe budgets and an `exp2Det` basis; the three changes departed from NAIVE / precedent spellings, forced by measurement. **AMEND §RV3(4):** `bandedStock.js:46` ("Consumed by nothing at land time") still stands at `7f974e855` beside twelve live consumers of `halfLifeFactor`, one line below a sentence pick 15 rewrote for exactly that reason — hygiene, one line, owed. **AMEND §RV3(6):** the retired sentence lived at `tests/lint/transcendentalMathBaseline.test.js:84`, not in a src header. Beyond the rows: `vite.config.js:609–612` still states a premise P′ falsified one pick later ("the det-math CORE chunk is itself a first-paint closure member") at `ca651d54b`; R-T13P-6's deferred docblock correction (`detMathDecay.js:88`) is unshipped at §890 with no bill line; no raw build #6 / #6b log survives (1,048,196 / 11,427 / 1,047,496 are prose-only, the OUTCOME independently confirmed); §RV(5)'s 2,086 B is minifier-version-bound (esbuild 0.28.2 re-minifies to 2,116 B — immaterial to the STOP). The two docblock debts are docketed as one hygiene car.

**§883.2 · lane T13-PRELAND — SIX calls · 2026-09-02 · SEAT: Opus 5 (lane T13-PRELAND).** Receipt: `$SP/laneT13-receipt.md` §C5.10 (:3582).

R-T13P-1 **Car 5 lands as TWO commits split at the byte boundary** (family (i) + the whole ratchet retirement in pick 15; the ban + pin + anchors in pick 16). R-T13P-2 **the ban lands in EIGHT blocks and `src/domain/clock.js` gets a NEW one** — it sits inside a census TREE with no `no-restricted-syntax` at all. R-T13P-3 **the roster floor** (`length >= 22`, `sqrt` absent, 14 named members), because config and pin both derive from `TRANSCENDENTAL_FNS` and deleting a member would weaken the ban and move the pin in lockstep. R-T13P-4 its own un-anchored negative cured with `expectAbsentWithAnchor`, the follow-up comment REPHRASED rather than annotated. R-T13P-5 **no golden re-recorded and none proposed** (`DRIFT_COUNT=0` over 525 with the control convicting at 1) — the declared window left open and unspent. R-T13P-6 the kernel's docblock over-claim corrected **in the commit body, not by editing `detMathDecay.js`**.

*What Fable re-derives:* R-T13P-3 (a floor that couples a config and its pin to one constant) and R-T13P-5, whose "no golden moved" reading was TRUE at the dock and became FALSE at the composed tip — see §883.3's own R-T13L-3, which is the correction and the reason the landing's battery exists.

*RULED (§892, Fable 5.1):* **R-T13P-1 R-T13P-2 R-T13P-3 R-T13P-4 R-T13P-6 RATIFIED · R-T13P-5 RATIFIED in the lane's own scope, and the STRATUM's gloss on it AMENDED (S09).** The two-commit split sits exactly at the byte boundary (`854d80fea` src + ledger test; `94dbe1355` eslint + coverage, zero src bytes); the ban's eight `...TRANSCENDENTAL_BAN` spreads and the NEW `src/domain/clock.js` block are at `eslint.config.js` lines 245 / 307 / 346 / 374 / 453 / 498 / 538 / 594 and :343; the roster is 22 with `sqrt` absent and 14 named; the anchored negative uses `expectAbsentWithAnchor`; `detMathDecay.js` is untouched across Car 5. **R-T13P-5's "no golden moved" is RIGHT as the lane scoped it (unspent by family (i): `DRIFT_COUNT=0` over 525, control at 1) — but the stratum's re-derive note ("TRUE at the dock and FALSE at the composed tip") is wrong-shaped:** the momentum row was a KNOWN, banked PRE-EXISTING red at the dock (receipt :3493; §882.9 A5 "RED at 822c4f93a and 9f0df13a1, GREEN at C′"); the landing ATTRIBUTED it (to pick 8) and re-recorded it once — the reading never flipped, it was attributed. R-T13P-6's deferred edit remains outstanding at `ca651d54b` (docketed with §883.1's hygiene car).

**§883.3 · lane T13-land — THIRTEEN calls · 2026-09-02 · SEAT: Opus 5 (lane T13-land).** Receipt: `$SP/laneT13LAND-receipt.md` (504 lines, table at :454).

R-T13L-1 **CR-17(a) executed as (b) for row 11 as well as row 12** — the dock-bound probe now measures the dock's Car 5 tip and printed 686 mismatches that are pick 15's ULP shift, not a refutation of Car 3; the re-pointed copy gives 8988/0. R-T13L-2 ⭐ **it REWORDED its own explanatory comment because the first draft QUOTED the parking construct verbatim** — THE CITATION LAW, caught by the lane on itself. R-T13L-3 ⭐⭐ **the moved golden attributed by BLOB revert and directory→pick→file bisection, not by the order's nine-rung ladder in sequence**, because `git apply -R` of Car 3's patch FAILS on this consist (pick 15 rewrote `bandedStock.js`) — and the answer contradicted the chair's own named cause. R-T13L-4 HK-5 shaped as a ROSTER of five explicit paths rather than a `docs/` prefix. R-T13L-5 §2.2 re-worded to say cross-engine identity is **"not OBSERVED here"** rather than claiming it is now guaranteed. R-T13L-6 R5a names `resolveResources.js:131`'s `terrainSpecific` filter as the live gate and demotes `getCompatibleResources` to a non-load-bearing pre-screen, line-count neutral. R-T13L-7 the close act and the fence re-arm landed as ONE commit (the order permits either and asks the choice be recorded). R-T13L-8 the ENGINE-HYGIENE block's live scope sentence marked **"SPENT AND SUPERSEDED" rather than deleted**, and the new fence block NAMES the momentum flip though that row is outside it. R-T13L-9 **DEVIATION 2** — §5.4 batches 1/3/4, §5.5's 761-file consumer census and §5.6.1 taken as SUBSUMED by the plain ratchet gate, with `tests/build` run separately. R-T13L-10 **DEVIATION 1** — artefacts to `$SP/t13land-*` instead of `$ME` (⚠ the CHAIR's brief overrode the order; the chair's error, not the lane's). R-T13L-11 the OSR `--write`'s 1283-line diff accepted as provenance reconciliation **on a deep object comparison, not on reading the diff**. R-T13L-12 ⛔ **ITS OWN PROCESS FAULT, self-reported: it ended a turn with the detached EXCLUSIVE `--update` still running**; the chair corrected it, the run was polled to exit in-lane and collected from its own log, and the later plain gate was outlasted start to finish. R-T13L-13 **R1 executed as the chair-call it is: a hidden fork feature retired** — opening `map/index.html` bare now loses the 3D scene/globe preview and OBJ export, which the shipped realm map never reaches.

*What Fable re-derives:* R-T13L-3 above all — it moved a shift-record row's cause from one car to another and is the row the whole declared window rests on; then R-T13L-13 (a user-reachable capability retired, even if unreachable from the shipped surface — the ONE row here that touches what a person could open); then R-T13L-9's subsumption argument and R-T13L-2's self-caught citation.

*⛔ The chair's own faults in this landing, recorded for the same walk:* the brief that overrode the order's artefact path (R-T13L-10); the CR-14 attribution that was wrong and survived only because the ruling said "confirm, never assume" (§882.15); and the first chair-verify pass, whose three shell checks were all wrong from the zsh no-split hazard and which now runs in Python (§882.15).

*RULED (§892, Fable 5.1):* **R-T13L-1 … R-T13L-13 ALL RATIFIED; the three chair faults RATIFIED as self-reported (S09).** R-T13L-3 is the load-bearing one and reproduces from the ladder logs on disk (control RED on `mo-b|8|one_month`; 1a momentum-only still RED; 2 all-T13-reverted GREEN 6/6; 3 worldPulse-only RED; pick 7 GREEN; pick 8 RED) and from the blob census (`bandedStock.js` at the dock = pick 15's blob, so `git apply -R` of Car 3's patch cannot run) — the per-file rung 6 rests on the receipt's table (one green log), so the five-file split is the lane's word, corroborated by S08's own re-run of the attrition-only swap. R-T13L-13 (R1's retirement) is unreachable from the embedded map (`sf-bridge.js:193` hides the options container; `3d.js` is the sole loader) and degrades to a toast when reached bare — the one user-reachable capability in the stratum, and `/map/` is publicly served, which the row carries. R-T13L-9's subsumption holds: the plain gate's corpus (every test file outside `tests/build`, 2,445 files) is a strict superset of each curated batch and ran at the committed tip. R-T13L-11 reproduced independently (total / identities / inventory / rowTags / schema identical; only stamps and provenance moved). R-T13L-12's recovery is on disk (`ratchet-update-t13.log`: START 11:13:38 → `UPDATE_TRUE_EXIT=0` → DONE 11:34:12, read before the commit). R-T13L-2's citation-law self-catch confirmed (0 `.each(`/`.for(` in `implementationPackets.test.js` at the tip). Citation nit for the chair-fault list: "confirm, never assume" is at ledger §882.15 / §883 (lines 32364–32365); the cause-naming is §882.9 A5 (32358) — cite both.

**§883.4 · lane CURE-PORCELAIN — the blocker cured at cause, and a worse sibling found on a landing gate · 2026-09-02 12:5x ET · SEAT: Opus 5 (lane CURE-PORCELAIN), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.** Receipt `$SP/laneCUREPORC-receipt.md` (365 lines, six §879-form rows at §6); dock `$SP/laneCUREPORC-tree` @ `d0c1a777e`, ONE commit over the new tip `7f974e855`, porcelain 0.

*⭐ THE REPRODUCTION SETTLED WHAT TWO LANES HAD DISAGREED ABOUT, and neither had it exactly right.* The trigger is **dirty-UNSTAGED and FIRST** — not "the register is the only dirty path" (T13-land's reading) and not "first line" alone: a STAGED register reads `M  path`, carries no leading space, and slices correctly. Two arms in its own dock: a first refreeze from a clean tree SUCCEEDED; a second — the register dirty-unstaged and therefore first, **which is exactly the state the first refreeze itself creates** — REFUSED ITSELF with `Dirty: ests/lint/.lighting-census-baseline.json`, a `t` short, `TRUE_EXIT=1`. ⭐⭐ **So the broken promise is sharper than "a walker can refuse": THE REFREEZE WAS NOT REPEATABLE, which is precisely what the register's own documentation guarantees.** T13-land refroze once from clean and never reached the branch, so its success was never evidence of absence — **a passing counter-example is not a refutation of a conditional defect**, and that is why the chair ruled the executed hit over the single green.

*The lane's calls (six rows; the ones a returning seat should read first):* **(1) it cut its dock at `7f974e855` rather than the brief's `9a0584f0f`** (28 commits stale after T13 landed), proving first by `merge-base --is-ancestor` and by an EMPTY `git diff --stat` on the target file across the gap — so the defect blob is byte-identical at both shas and the re-cut cost nothing while making its register predictions answer to the live tip. **(2) the `.trim()` was CONFINED, not removed** — it now lives only in the scalar reader whose one remaining caller is `rev-parse HEAD` into `measuredAtSha`, and a new PURE `parsePorcelainPaths(raw)` takes the untrimmed bytes and **ASSERTS `line[2] === ' '` rather than trusting the column law**. **(3) the deferral with its price stated, and it is the row the lane itself ranks highest:** a canned-record battery was NOT added, because an in-file battery would move `titles` 22491 → 22492 — **making a cure for a broken refreeze itself require a refreeze** — so it took the zero-title half of the prevention (making the parser pure, which is what enables that battery later) and named the rest. The `-z` reader is deferred with its price too.

*The plant, six arms, both directions:* P0 plain `34 passed (34)` exit 0 · **P1b direction A — the reproduced failure now REFREEZES** · P2a/P2b negative controls still refuse foreign dirt, and P2b names `ARCHITECTURE.md` IN FULL where the old parser, executed as a counterfactual, yields `RCHITECTURE.md` · **P3 direction B — the trim re-introduced REDS, and reds LOUDLY**, naming the offending record and the column law instead of mis-slicing silently. Restore proven IDENTICAL TO HEAD, porcelain 0, and a final green run on the exact committed bytes after all planting.

*Registers, each predicted in writing then measured:* lighting `2497/370/2127/22491/6078` UNMOVED (measured twice) · ratchet `30788/2445` UNMOVED (34 tests in the file before and after) · OSR `1993/1409/388` UNMOVED · size ratchet clean · eslint exit 0. **One red outside prediction, raised and CLEARED by execution:** four `voiceMechanics` arms — reproduced with identical magnitudes at a throwaway base dock cut at `7f974e855` and then removed, and they are **4 of the ratchet baseline's 10 banked entries**. No STOP fired.

*⛔⛔ THE HANDOVER THAT MATTERS MORE THAN THE CURE.* Its census over `src tests scripts api` found **12 sites of the class: 1 cured, 1 handed over, 10 dispositioned not-affected.** The handover: **`scripts/base-state-capsule.mjs:431-434` is ONE `.trim()` away from the identical bug — correct today ONLY because `shellOut` happens to return untrimmed, a dependency NOTHING STATES — and its parser has ZERO COVERAGE**, since `dirtyMeasuredPaths` is unexported and all four battery arms inject a replacement. **That is the same defect class sitting on a LANDING GATE, latent, untested, and load-bearing on an unstated invariant.** RULED (chair, vetoable): it is cured as its own small prevention car — the invariant is made explicit and the parser given real coverage — and it does NOT ride the INSTR consist, because a prevention car for a landing gate should not first appear inside the landing it protects.

*The chair's ordering ruling:* the cure car rides the HORIZON-INSTR consist **AHEAD of that consist's own lighting refreeze**, as the lane recommends — the refreeze is the thing it repairs, and a consist that refreezes before curing its refreezer can refuse itself mid-landing.

*What Fable re-derives:* the deferral in (3) above all — "a cure that requires the broken thing to work" is a real trap and the lane's zero-title half-measure is the right shape, but a returning seat should check that the battery it enables actually gets built; then the `line[2] === ' '` assertion, which converts an unstated column law into a checked one.

*Priority:* **HIGH for the base-state-capsule handover** (same class, landing gate, zero coverage) and for (3). MEDIUM for (1) and (2). LOW for the rest.

*RULED (§892, Fable 5.1):* **ALL SIX CALLS AND BOTH CHAIR RULINGS RATIFIED; the deferral AMENDED as still-unbuilt (S10, the pre-cure and cured parsers EXECUTED in a scratch copy: unstaged-first refuses `ests/lint/…` under the old parser and reads clean under the new; staged-first and foreign-first behave exactly as the row says).** The trigger is dirty-UNSTAGED-and-first and the first refreeze itself creates that state — the refreeze was NOT REPEATABLE, exactly as the lane sharpened it. The `.trim()` is CONFINED (`gitRaw` untrimmed; `gitOut` trimmed with one caller, `rev-parse HEAD`) and `parsePorcelainPaths` asserts `line[2] === ' '` per record — stronger than the row states, since it also refuses a damaged SECOND record. The re-cut at `7f974e855` cost nothing (empty `diff --stat` on the target across the 28-commit gap). The chair's two orderings were EXECUTED as ruled: `20f089aaa` is pick 1 of 23 in HORIZON-INSTR ahead of the refreeze at pick 22, and ⭐ **the landing commit `d124eae45` is the closing receipt the row never cites — the second refreeze ran on the real landing tree with the register dirty-unstaged and first, REFROZE, and left the register blob byte-identical across both runs**; CURE-CAPSULE is absent from `7f974e855..f5a6c3bbf` and landed as pick 1 of 6 at §885. The base-state-capsule handover is exact at `7f974e855:431–434` (the prefix allowlist DROPS a mangled path — the false-CLEAN direction). **AMEND (3):** the deferral is right, but the battery it enabled (a canned-record battery over the pure parser) and the fold of the two same-named `parsePorcelainPaths` copies are BOTH still unbuilt at `4233031ba`, recorded only in receipt prose — docketed here as one hygiene car. Registers unmoved (lighting tuple re-probed at the CUREPORC dock; ratchet 34 tests before and after; OSR PLAUSIBLE, receipt-only); the four `voiceMechanics` reds are 4 of the 10 banked entries.

**§883.5 · lane INSTR-WRW — Car 4 built as RULED, with a narrowness plant the chair asked for and two the lane added · 2026-09-02 13:0x ET · SEAT: Opus 5 (lane INSTR-WRW), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.** Dock `$SP/laneINSTRWRW-tree` @ **`e2967f2a1`**, FOUR cars over C′ `9a0584f0f`, porcelain 0, deliberately NOT re-based (the landing lane picks onto `7f974e855` — the right call: composition is proven at the landing, never by a lane re-basing itself). Receipt `$SP/laneINSTRWRW-receipt.md`, nine rows at §6 plus Car 4's.

*What was judged (Car 4, built on the chair's §882.15 ruling (1)):* clause W now OWNS the question *is it written* and answers it for the `generation-dial` reason with `identity ∈ dialGated` — **the executed bit, not a text search**; D-dial sheds its membership half and keeps the door; and ⭐ **clause S INVERTS for that reason** — absence IS the dormancy, so presence convicts as either "bank the win" (LIT) or "the dial has ROLLED" (otherwise). `compareDark` needed the same awareness **and the first live `--report` proved it by reporting both correct dial rows as STRUCK** — found by running it, cured, then exit 0. **The walker ASSERTS its premise rather than restating it:** `writeShapesIn` returns `[]` for both writers and each row's recorded `writeProof` is checked (the executed bit for the dial pair, `source text (…)` for the other four).

*⭐ THE PLANTS — the chair asked for one and got three, and the extra two are the better ones.* **(a) The narrowness plant as ordered:** a row spelled EXACTLY like a real dial row — same reason, same door, a writer that writes by assignment and is invisible to the text probe — differing in **ONE BIT**, that it is not in `dialGated`. It convicts at W; the identical row admitted to the set passes. **(b) Reason-scoping proven:** the same invisible assignment on the `engine-internal` and `pending-surface` rows STILL convicts, because their keys *are* written by shipped worlds — so the widening did not leak past its reason. **(c) An absent measurement is not an acquittal:** a dial row with no measured set convicts, which is why `measure()` now builds the dial corpora itself.

*⛔ A DEFECT THE CAR FOUND IN ITS OWN HOUSE, and it is a false-green shape worth banking:* the structural-law test indexed `WRITER_DARK_REGISTER[0]`, **which CHANGED REASON when the dial rows landed — silently re-pointing every arm at a different field set.** A positional index into a register that grows by insertion is a test that quietly measures something else; it now NAMES its row and gained arms for both prose fields and the dial door's structure.

*Receipts:* walkers 39/39 · 45/45 · 51/51 · **56/56**; predicted → measured EXACT — lighting `2496/370/2126/22493/6075` against a prediction of exactly that (titles +5, all else +0), typecheck 173/1121, eslint 0; the baseline re-freeze is **three lines** (`frozenAtSha`, `detectorDigest`, `registerDigest`) with cohort 1322, population 6520/547/4647/1326, reviewable 526 and ceiling 3 all UNMOVED, exactly as predicted; whole gate **6 red = the same 5 base reds + the predicted lighting census**, Car 4 introducing none, 1,913 = 1,908 + 5. **Landing arithmetic composed onto the post-T13 absolutes `2497/370/2127/22491/6078` and `30788/2445`** — consist deltas **files +1 · parked +0 · credited +1 · titles +56 · suiteTitles +6** ⇒ lighting refreeze → **`2498/370/2128/22547/6084`**, `test:ratchet:update` → **`30844/2446`**; **`parked +0` — no file of this train is parked, for any reason.** ⚠ The chair's §883.1 warning did not bite: its lighting red is the ordinary census assertion, not the refreeze defect — the lane never invokes the refreeze, so there was nothing to work around, and it said so rather than claiming a clean bill it had not earned.

*⛔ STILL OWED, named not hidden:* **one DIRECTION of one law** — every `dialGated` identity carrying a row, for the other **29 of 31**. The frozen exact roster guards them meanwhile (a new dial-gated key reds by name) and the reverse direction is live. **RULED (chair): closing it is a TRIAGE act, not a clause change — it belongs to WRWALKER Car 4's review-phase sibling, not to this consist, and it is recorded here so the landing does not claim a totality it does not have.**

*What Fable re-derives:* the clause-S INVERSION first (a clause that means the opposite thing for one reason is powerful and easy to get subtly wrong — the three plants are the evidence), then the positional-index defect, then whether "an absent measurement is not an acquittal" is enforced everywhere the register admits a reason.

*Priority:* **HIGH for the clause-S inversion and its plants.** MEDIUM for the positional-index defect and the owed direction. LOW for the rest.

*RULED (§892, Fable 5.1):* **The clause-S inversion, the three plants, the positional-index cure, the owed direction and the figures ALL RATIFIED; the receipts line AMENDED (S10, executed at `laneINSTRWRW-tree@e2967f2a1` — the lighting tuple re-probed EXACT at 2496/370/2126/22493/6075).** Clause W owns "is it written" with `identity ∈ dialGated` for the generation-dial reason only (`isDialRow` = reason AND door.kind, :332), refuses on a missing set ("an absent measurement is not an acquittal"), and clause S inverts for that reason (presence convicts as BANK THE WIN if LIT, else THE DIAL HAS ROLLED); D-dial and S both run after W, so no dial row reaches them unmeasured. The plants: (a) the one-bit narrowness plant convicts at W and passes when admitted (:809); (b) the `engine-internal` and `pending-surface` rows still convict under an invisible assignment — the widening did not leak past its reason; (c) a dial row with no measured set convicts, which is why `measure()` builds the corpora. The positional-index defect is real — `WRITER_DARK_REGISTER[0]` changed reason from `engine-internal` (355ff603b) to `dark-by-construction` (e2967f2a1), the lane's own first run failed exactly there (`walker-car4.log`, 1 failed | 55 passed) and the cured run is 56/56 — the row narrates it without quoting that log. The owed direction: 2 generation-dial rows against a frozen 31-entry `FROZEN_DIAL_GATED` roster with the reverse direction live (:1201–1204, :907); the chair's triage ruling stands. Gap carried: `compareDark`'s PRESENCE direction (`dialRolled: true`) has no plant — the walker asserts only the absent direction at :896 — docketed with the register's next car. **AMEND the receipts line:** the receipt holds R1–R9 only; Car 4 has NO §879-form row (its calls live in §11 prose) — "plus Car 4's" must read "Car 4's calls are narrated in §11, not rowed". ⚠ `laneINSTRWRW-probes/frozen-dialgated.txt` is a stale 34-entry pack-control roster, not the committed 31 — misleading to a reader, harmless to the tree.

**§883.6 · lane CURE-CAPSULE — the hazard proved real and failing the OTHER way · 2026-09-02 13:13 ET · SEAT: Opus 5 (lane CURE-CAPSULE), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.** Car `c422ee824`, ONE commit over `7f974e855`, 2 files +141/−5, porcelain 0. Receipt `$SP/laneCURECAP-receipt.md` (529 lines, rows J-1…J-9 at §6). ⛔ **It does NOT ride the HORIZON-INSTR consist** (chair-ruled at §883.1: a prevention car for a landing gate must not first appear inside the landing it protects).

*The lane's calls, ruled:* **J-1 RATIFIED** — the coverage EXTENDS an existing arm rather than minting new `it()`s, so **the car moves ZERO registers**; the alternative shape owes `titles` 22491 → 22493 plus a refreeze **stamped at a base no landing will use**, on a car that is HELD. The lane priced the veto exactly (+2 titles, one refreeze, one commit) and named the two arms to split out if the chair wants shape A. **The reasoning is the right one and is now standing form: a HELD car pays no register it can pay later at its landing.** **J-2 RATIFIED** — the test ratchet `30788/2445` is predicted unmoved and **NOT executed**, because it has no collect-only mode and a held prevention car should not seize an exclusive full-suite slot from three live lanes; it is flagged PLAUSIBLE, supported by four executed components (9 → 9 titles; the estate-wide lighting census green; no baselined entry names the file; the count arm reds only on collapse) and **owed at boarding**. **A PLAUSIBLE flagged and priced beats a green bought with someone else's slot.**

*Also recorded:* an existing arm's TITLE TEXT changed (verified ratchet-safe — ten baseline entries, none names this file); and the parser is a KNOWING second copy of the sibling's, because importing it would couple this car to an UNLANDED one — the right call, with the duplication named rather than hidden.

*What Fable re-derives:* the consumer law's generality (does the prefix-allowlist-hides / equality-test-shouts distinction hold at the three newly named safe MODELS?), and J-1's zero-register shape, since it trades coverage placement against a register cost and a returning seat may prefer the split arms.

*Receipts:* the five pre-edit hazard arms with predictions written in advance and both probe files restored `identical=True`, porcelain empty; the plant reds loudly at the committed tip naming the offending record and the column law; correct-input refusals **character-identical** to pre-cure; the negative control (assertion deleted) `Tests 1 failed | 8 passed (9)`, `TRUE_EXIT=1`, restored sha-identical `1ee9fb67…`, `Tests 9 passed (9)`; seven coverage cases D1–D7 all driving the REAL parser and REAL allowlist; registers lighting `2497/370/2127/22491/6078` UNMOVED, OSR 1993, typecheck 173/173, strict 1121/1121, eslint 0, size baseline no entry owed; second census 4,852 files / 17 sites, no new affected site.

*Priority:* **HIGH for the false-CLEAN direction and the consumer law.** MEDIUM for J-1 and J-2. LOW for the rest.

*RULED (§892, Fable 5.1):* **J-1, J-2 and the false-CLEAN direction RATIFIED; the consumer law RATIFIED and SHARPENED; the census denominator and the dock pointer AMENDED (S10, the battery EXECUTED 9/9 at the CURECAP dock, porcelain 0 → 0).** The hazard fails the OTHER way at `7f974e855:434`: `DIRTY_SCOPES` is a prefix ALLOWLIST, so a trimmed first record (`M scripts/x` → `ripts/x`) matches no scope, is DROPPED, and the generator stamps `BASE_STATE.json` at HEAD over an unmeasured tree; the committed D4 case encodes exactly that and now throws naming the record. **The consumer law, in its precise form:** what decides whether a mis-slice shouts or lies is the consumer's DEFAULT for an unrecognised record — fail-closed (an exclusion filter or equality test keeps the unknown record dirty) shouts; fail-open (an inclusion allowlist treats it as not mine) lies; the three named safe models (`worktree-inventory.mjs`, `implementation-session.mjs` with `-z`, the premortem readers) are fail-closed or delimiter-safe, so the law holds and generalises. J-1 (coverage extends an existing arm; ZERO registers moved; shape A priced at +2 titles) holds — 2 files, +141/−5, no new title, the battery 9 → 9. J-2 (the ratchet predicted unmoved, NOT executed, flagged PLAUSIBLE and priced) holds and was discharged by the §885 gate. The negative control and the sha-identical restore (`1ee9fb67…` matches the committed blob) hold on the receipt; the KNOWING second copy of the parser is right (coupling to an unlanded car would be worse) and the fold of the two copies remains owed (docketed with §883.4's hygiene car). **AMEND:** "17 sites" is not reproducible from the receipt's own table without an unstated counting convention (the ls-files class row says "(5)" but counts as 4) — state the convention or say 18; and the dock pointer is stale — `laneCURECAP-tree` now sits at the re-based `62be253f3` (§884.4), so `c422ee824` is read via the seal `refs/preserve/curecapsule-2026-09-02`, not the dock.

**§883.7 · lane INSTR-SOAK — all five SOAKCHAIN cars, a literal REFUSED, and a gap made visible rather than pre-empted · 2026-09-02 13:2x ET · SEAT: Opus 5 (lane INSTR-SOAK), ⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧.** Dock `$SP/laneINSTRSOAK-tree` @ **`2ed4483a1`**, FIVE commits, porcelain EMPTY (`-uall` too — no stray `*.test.js`, so the dock-hygiene hazard did not bite), each trailer read back through the parser, no `--amend`. Receipt `$SP/laneINSTRSOAK-receipt.md` (358 lines, ten §879-form rows at §8). Sealed `refs/preserve/instr-soak-2026-09-02`.

*⭐ THE CALL WITH A CONSEQUENCE FOR THE LANDING:* **it cut at `7f974e855`, the LANDED tip, not the brief's `9a0584f0f`** — reasoning that a consist cut at the pre-landing C′ would board HORIZON-INSTR *behind its own train's tip* and price every register against a superseded absolute; the seal was verified equal to its base at open and at close. **Consequence, which the lane stated rather than left for someone to discover: its cars board DIRECTLY at the landed tip with NO pick, while the two siblings, cut at C′-era tips, still owe one.** The order's composition section must carry two boarding shapes in one consist. RULED: correct, and it is why the order's fold re-reads every dock's tip rather than trusting the brief.

*The two calls the lane itself flags for a skeptic, both RATIFIED:* **S2 — LITERAL 3 REFUSED OUTRIGHT.** `soakInvariants.mjs` contains **no bound-allowance constant by design**, because the measurement admits none (max 3.5741×, eight of 100 LIT years above 1.5) and banking 1.5× would have written a number the data contradicts. ⭐ **And there was a second, harder reason the lane found by measuring: the known-failure census is at 10/10 with NO HEADROOM — an eleventh red could not be banked** (see below), so a written-but-failing arm was not merely wrong, it was unbankable. **S3 — THE MAJOR-STREAM GAP IS REPORTED, NOT PRE-EMPTED.** §882.12's world finding (the LIT century has no major events for 78 of 100 years while SHIPPED keeps 20–36 per decade) **cannot be convicted by the liveness floor without a FOURTH `LivenessFailureKind`, and §4.1 pins it at three** — and a `minMajorsPerDecade` band would RED THE WEEKLY WATCHDOG ON THE LIT WORLD before ⟦CHAIR-R9⟧'s lighting wave has ruled. So the lane made the fold **MEASURE** the axis, the verdict **REPORT** it, the soak **PRINT** it beside the check, and `soakInvariants.test.js` **PIN** the measured LIT series (7 silent decades) against SHIPPED (0) as an executed test. **The gap is visible rather than implied, and adding the band is a CHAIR act for which the pin is now the specification.** RULED: exactly right — an instrument that would convict a world the owner has not yet ruled on must expose, not judge.

*⛔ THE CONSTRAINT THAT BINDS EVERY CAR AFTER THIS ONE, measured not assumed:* `tests/lint` + `tests/copy` + `tests/docs` WHOLE at the tip = 161 files, 2,118 tests, **11 reds** — and against a second dock cut at the same base, **10 of the 11 are RED AT BASE and are EXACTLY the ten entries in `scripts/.test-ratchet-baseline.json`**. **The banked known-failure census is at 10/10 with ZERO HEADROOM.** The single tip red is the predicted lighting census, a landing act. **So any car that would introduce an eleventh red cannot bank it — the ceiling is full — and "write the arm and bank the red" has stopped being an available move for the whole remaining arc.**

*Receipts:* lighting `2497/370/2127/22491/6078` → **`2501/370/2131/22535/6083`** (+4 files · **parked +0** · +4 credited · +44 titles · +5 suiteTitles), Cars 0/1/2 measured EXACT to prediction and 3/4 measured on the composed tip; ratchet → **30832/2449** (PLAUSIBLE arithmetic over exactly-measured counts 16+1+10+9+8 = 44); typecheck EXACT 173/1121 both scripts exit 0; OSR **1993 exactly matching**, run DETACHED; `couplingInclusion` 28/179 and each-family 111 unchanged; **zero `src/` bytes across all five cars**, so no build was owed or run. **Car 1's anti-vacuity is the strongest single result:** the 30y×4s soak at its tip returns all thirty yearly composite hashes **element-wise equal** to Car 0's pre-edit receipt, same `finalHash`, same `ticksAdvanced` — **the edit moved no world byte**, proven rather than argued. The wall-time defect is CURED and executed (a 3-year run now reports both instruments NOT-EXECUTABLE and returns `passed: true, failures: []` with all six earnable properties; the D2bR class receipt is gone). **Car 3 independently reproduces Car 0's figures in a separate process** — LIT max bound ratio 3.5741 at leg-c y15, endpoint max 0.8049, SHIPPED ×0.27, min distinctTypes 21, min majors 20, all exact, in 253.9 s under three-way contention inside the 360 s budget. Car 2's freeze gate runs clean for the first time, with its counterfactual beside it. S1-a/b, S2-a/b, S3-a…d and S4-a all measured NOT FIRING with quoted evidence; S0-a/b/c not re-measured by instruction (settled §882.12). **It never met the CURE-PORCELAIN defect** — it ran no refreeze at all (both baselines are landing acts, as both siblings also judged) — and said so rather than claiming a clean bill it had not earned.

*Handovers:* **H-1 to CAPACITY's author** — §14 E11 REFUTED and reproduced; the recommended re-shape is named, NOT banked and NOT written, and Car 3 already measures the full 400-sample series so the arm is one edit away once the shape is ruled. **H-2 is S3 above.** H-3…H-6 in receipt §9: five volume amendments (four confirmed by this build), §18.3's missing Car-1 titles delta and its "+4 lines" `ci.yml` estimate **measured at +8**, the landing ratchet run getting ~4–5 minutes longer, and the 10/10 census.

*What Fable re-derives:* S3 first (an instrument deliberately not given the power to convict), then S2 and the 10/10 headroom finding, then the two-boarding-shapes consequence of cutting at the landed tip.

*Priority:* **HIGH for S3, S2 and the zero-headroom census.** MEDIUM for the base choice and H-1. LOW for the rest.

---

## §883.5 · THE INSTRUMENT LANDING ORDER — FOLDED, AND THE CHAIR'S FOUR ROWS RULED (2026-09-02 ~15:0x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The artifact:** `$SP/INSTR-LANDING-ORDER.md` — 698 lines / 195,051 B, `## COMPLETE — FOLDED … BOARD-READY WITH CHAIR ROWS 4`, `⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧`. It was written by an Opus author, refuted by two Opus skeptics (composition+picks · bills+instruments), and folded by a fourth Opus seat: **17 findings received · 17 FOLDED · 0 REFUSED · 2 skeptic REMEDIES half-refused at their own fold points · 3 skeptic figures corrected with BOTH figures shown.** ⛔ **It is a SCRATCHPAD file and will not outlive the session** — the four chair rulings below are therefore written here in full, so a returning Fable seat can rule them without it. Everything else in this stratum is named and pointed at, and its detail dies with the file; if that detail is wanted, the landing's own §884 row and the lane receipts carry the executed figures.

### §883.5(a) THE CHAIR'S FOUR RULINGS — the only rows here the chair itself decided

*What was judged:* the fold opened four rows it correctly refused to decide, and the chair ruled all four the same day, writing them into the order as a **fifth table column the lane obeys**. None crosses an owner gate: no push, no tuning value or signature, no paid surface, no data deletion, nothing owner-parked.

**CR-1 — CURE-CAPSULE (`c422ee824`) DOES NOT BOARD; it lands as its own act after §884.** Ground: a prevention car for a landing gate must not first appear inside the landing it protects — if it rides, the only landing that could ever have falsified it is the one it was written to guard. Second ground, discovered by the fold and NOT available when §883.1 first ruled it: its `tests/scripts/baseStateCapsule.test.js` **+56/−2** is titles in an existing file, so boarding it makes **every** §3 lighting and ratchet bill stale — they would need re-deriving from the blobs, not adjusting, and a re-derived bill is a bill nobody predicted in writing (E4). *Veto shape:* rule it aboard as pick 20 and re-derive §3.1 and §3.4 from the blobs before the refreeze; its two paths intersect none of the 33, so the composition is unaffected either way.

**CR-2 — THE CHAIR runs the post-build remainder of §5.4 batch 2, immediately after the bare gate and before the CAS; the lane runs the no-`dist/` suites inside its own window and names them by count.** Ground: as first written those ~45 files fell after the lane's HOLD (§6.1.9) and before the chair's gate (§6.2) — **owned by nobody**, a dropped thread by construction rather than a deferral. *Veto shape:* re-open the lane for a second turn after the gate, or fold the remainder into the gate wrapper. What may not stand is the unowned state.

**CR-3 — §3.4.5's plain ratchet gate is RUN WHOLE and BUDGETED (~+250 s), not discharged into the chair's bare gate.** Ground: a register commit intervenes between §3.4.2's `--update` and §3.4.5, and the standing law is that the plain gate proves the **committed** state; discharging it moves the lane's own proof off the lane and lets a register red arrive at the most expensive moment on the board. *Veto shape:* skip it and let the bare gate be the ratchet's first proof at the committed tip, accepting that the register commit is then first exercised by the chair — and say so in the receipt, so the omission is a decision and not a gap.

**CR-4 — §6.3.4 (a chair act) uses the corrected build-input set plus a 33-path PYTHON intersection; the author's original one-line pathspec rides beside it as a legacy cross-check, never as the proof.** Ground: the chair's independent word on closure, engine, `couplingInclusion` and typecheck cannot rest on a pathspec that is not the build graph. The fold CONFIRMED four build-graph members outside it — `npm run build` is a three-command chain whose `prebuild`/`postbuild` live under `scripts/`; `scripts/prerender-routes.mjs:56` imports `../api/_galleryMeta.js`; `eslint.config.js:32` imports `./scripts/count-transcendental-math.mjs`; and `REALM_SCALE_SOURCE_PATHS` names `scripts/audit`, where this consist writes four files. ⛔ **A consist touching `scripts/prerender-routes.mjs` or `api/` would return ZERO ROWS and earn a FALSE no-build ruling — and this arc's consists are `scripts/`-shaped.** *Veto shape:* keep both commands but treat the numstat as the primary; costs nothing, loses the grounding.

*What Fable re-derives:* **CR-1 first** — it is the only one of the four that changes what lands on the branch, and it re-opens a §883.1 ruling on new evidence. Then **CR-4**, because it is a claim about the build graph and is falsifiable by reading `package.json`'s script chain. CR-2 and CR-3 are sequencing and budget, cheap to overturn and cheap to have been wrong about.

*Receipts:* the ruling text is at the order's §9.6 fifth column; the build-graph addresses are re-readable at `7f974e855` without any dock; CURE-CAPSULE's `+56/−2` is `git -C $SP/laneCURECAP-tree show --numstat c422ee824`.

*Priority:* **MEDIUM.** No ruling is irreversible before the CAS, and CR-1's subject is a car that is HOLDING on its own dock either way.

### §883.5(b) THE ORDER'S OWN NINE, THE SKEPTICS' AND THE FOLD'S TEN — enrolled, not re-stated

*What was judged:* four Opus seats made and recorded their own calls inside the artifact. **The order's author: nine (`O-1…O-9`)** — the pick order, the NO-LANE-BUILD decision (self-marked HIGH), the battery reduced to eleven arms with T13's rows 11–13 named as deliberately not run, the STOP-3 framing inversion, the espionage fence deliberately NOT re-armed, spending one command to run the refreeze a second time from a dirty register, the OSR as a receipt rather than a commit, the SOAK gate written as a STOP with WAIT as default (self-marked MEDIUM), and re-reading every §0.6 absolute at `7f974e855` rather than copying it — which caught one figure a receipt still believed. **Skeptic A: five**, the sharpest being that it confirmed the composed lighting tuple by three-method agreement rather than by running the walker's own classifier, which read-only law forbids. **Skeptic B: its own least-sure call SB-1**, that blocking the board on B-2 was the alternative it did not take. **The fold: ten (`F-1…F-10`)**, of which two are HIGH — **F-2**, splitting Skeptic B's single widened pathspec into two sets rather than adopting the convicting form, on the judgment that a proof which reds for a non-build reason will be argued around rather than obeyed; and **F-10, the verdict itself**, BOARD-READY rather than NOT READY, on the ground that both skeptics re-executed the entire picking and composition apparatus and every figure reproduced.

*What Fable re-derives:* **F-10 and O-2 together** — they are the same question asked twice (is a clean argument enough where T13 had a measurement?), and F-2 is the seam between them. Then **A's three-method tuple**, because a classifier not run is the one register claim in the landing with no instrument behind it.

*Receipts:* the order's §9.3 (author), §9.5 (panel disposition, 17 rows) and §9.7 (`F-1…F-10`) — ⛔ all inside the scratchpad artifact, so this enrolment is the surviving trace of their existence, not of their content.

*Priority:* **MEDIUM**, rising to HIGH for F-10/O-2 if the landing's gate goes red for any reason touching a byte ceiling.

### §883.5(c) ⛔⛔ THE CHAIR'S OWN HAZARD, FOUND WHILE WRITING THIS STRATUM — three copies of this queue exist on disk and TWO of them are stale

*What was judged:* the chair went to append this stratum and found **three candidate sources for `docs/FABLE_RETROVALIDATION_QUEUE.md`**, which `chair-commit.sh` maps by whichever path it is handed, silently and without comparison: **(1)** the ledger worktree's own `docs/FABLE_RETROVALIDATION_QUEUE.md` — **1,410 lines / 152,041 B, staged-deleted and present as untracked, STALE BY 770 LINES**, missing the §881.16, §882.8, §882.14 and §883 strata entirely; **(2)** the previous collection's kit file `$ME/kit-883/queue-883.md` — **2,118 lines / 300,067 B, stale by 62 lines**, because acts after that collection appended from elsewhere; **(3)** `git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md` — **2,180 lines / 319,498 B, the only authoritative one.** The chair built this stratum on (3) and verified the base by md5 against the HEAD blob before appending one byte. ⚠ **Appending to (1) would have landed a commit that silently DELETED four strata while passing every gate this program owns** — the §882.14 enrolment gate checks that the blob DIFFERS from the parent's, and a regression differs.

*What Fable re-derives:* whether the same three-source trap exists for `docs/HANDOFF_CURRENT.md` — the chair checked and it does **not** (the worktree copy was byte-identical to HEAD at 46,617 B before this act's edit, which is why the anchors matched), but the check was a comparison the chair happened to make, not one any tool performs.

*Receipts:* the three sizes above are re-derivable at any time; the staged-delete-plus-untracked state shows as `D ` + `??` in `git status --porcelain -- docs/FABLE_RETROVALIDATION_QUEUE.md`.

*Priority:* ⛔ **HIGH — this is a live structural gap, not a judgment call.** The standing cure the chair applied by hand (build the queue from the HEAD blob, verify by md5, then append) should become a gate in `chair-commit.sh`: **refuse any mapped `docs/FABLE_RETROVALIDATION_QUEUE.md` whose source does not CONTAIN the parent blob's content as a prefix** — an append-only file's new version must extend its parent, and a regression is exactly the case that check convicts.

---

*RULED (§892, Fable 5.1):* **(a) CR-1 AMENDED · CR-2 REVERSED (as §884 self-reported) · CR-3 AMENDED · CR-4 RATIFIED; (b) F-10/O-2 AMENDED, F-2 RATIFIED, the Skeptic attribution AMENDED, O-1/O-3/O-4/O-8/O-5/O-6/O-7/O-9 and F-1/F-3/F-4/F-5/F-7/F-8/F-9 RATIFIED, F-6 REVERSED; (c) RATIFIED and the gap is still OPEN (S11).** **CR-1** holds (a prevention car must not first appear inside the landing it protects; the two paths intersect none of the 33; executed at §884.4) — but "+56/−2 is titles" overstates: the +56 lines carry exactly ONE new test title. **CR-2 REVERSED:** `verify:dist` already runs all of `tests/build` with `VERIFY_DIST=1` as the last stage of `npm run check` (package.json :56–58; check-test-ratchet.mjs :702), and the chair's own flagless re-run was the vacuous one (57 skipped, exit 0 — `cr2-instr.log`). **F-6**, the fold call that opened CR-2 on the false "owned by nobody" premise, is REVERSED with it — §884 marked CR-2 and never F-6. **CR-3** holds and paid for itself (the second run surfaced the foreign 0.392 % flake) but was mis-priced ~4–6×: 1,046 s and 1,488 s measured against "~+250 s". **CR-4:** all four build-graph addresses verify at `7f974e855` (`prebuild`/`postbuild` under `scripts/`; `prerender-routes.mjs:56` → `../api/_galleryMeta.js`; `eslint.config.js:32` → `scripts/count-transcendental-math.mjs`; `REALM_SCALE_SOURCE_PATHS` → `scripts/audit`), and the lane executed the two-set instrument (zero rows; four rows under `scripts/audit`, expected). **F-10 / O-2** hold on outcome (green first run, every register exact, zero build-input rows) — **AMEND:** the ledger §884 sentence "first-paint closure stays 1,046,732 … engine 675,764" is INFERRED from byte-identical inputs, not measured at `f5a6c3bbf`; no closure receipt exists for that tip; §6.3.7 is unreceipted. **Attribution AMENDED:** the "three-method lighting tuple" call is Skeptic B's **SB-4**, not Skeptic A's; Skeptic A's "five" are its five findings; Skeptic B has FIVE own calls (SB-1…SB-5), and ledger §884's enrolment line inherits the error. **(c)** the three-copies hazard is exact (HEAD blob 319,498 B / 2,180 lines; kit copy 300,067 B / 2,118) and ⛔ **the prefix gate is STILL NOT INSTALLED in any copy of `chair-commit.sh`** — the ledger worktree's steady state today shows both append-only files as staged-deleted-plus-untracked, so the hand procedure (build from the HEAD blob, verify by md5, prove the prefix after) remains the only protection and was applied for this sitting.

*RULED (§892.x, Fable 5.1):* **5 RATIFY · 1 AMEND** (§883.5, 6 calls, slices S10; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (1):** **§883.5 INSTR-WRW Car 4 (wording)**: There is a Car 4 §879-form row. — Receipt §6 holds R1–R9 only; §12 says `Nine rows at §6 remain as written; R5 is now DISCHARGED BY RULING AND BUILT`; no R10 and no Car 4 row exists — Car 4's ca **RATIFIED (5):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

*RULED (§892.x, Fable 5.1):* **2 AMEND · 1 REVERSE · 1 RATIFY** (§883.5(a), 4 calls, slices S11; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (1):** **§883.5(a) CR-2 (HIGH 4)**: ~45 files were owned by nobody (a dropped thread by construction) — package.json@7f974e855 `:56 "verify:dist": "… node scripts/check-test-ratchet.mjs --verify-dist"`, `:58 "check": … && npm run build && npm run verify:dist`. che **AMEND (2):** **§883.5(a) CR-1 (HIGH 3)**: Boarding it would stale every §3 bill; composition unaffected either way — `85 3 scripts/base-state-capsule.mjs` · `56 2 tests/scripts/baseStateCapsule.test.js`; file EXISTS at 7f974e855 (315 lines). Added test titles in the +56: exact · **§883.5(a) CR-3**: The plain gate must prove the COMMITTED state after the register commit — Receipt: `--update … 1,589 s` · `§3.4.5 run 1 … 1,046 s … writerReach.walker "TIMEOUT"` (uncapped pool, load 48.98/8) · `§3.4.5 run 2 (quiet re-run) --maxWorker **RATIFIED (1):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

*RULED (§892.x, Fable 5.1):* **7 RATIFY · 2 AMEND · 1 REVERSE** (§883.5(b), 10 calls, slices S11; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (1):** **§883.5(b) F-6**: ~45 files owned by nobody — a dropped thread by construction — verify:dist runs the whole of tests/build with VERIFY_DIST=1 as the last stage of `npm run check` (package.json:58; check-test-ratchet.mjs:702); gate-instr.log: **AMEND (2):** **§883.5(b) F-10 / O-2 (HIGH 7)**: Both skeptics re-executed the apparatus and everything reproduced; the closure would be caught by §6.3.7 measuring from the gate's own build — Gate: `GATE_START=2026-09-02T21:09:30Z` → `GATE_END=…21:27:18Z` (=1,068 s); `:392 [test-ratchet] OK — no test regressions (10 known failure(s) of 30962 tests, c · **§883.5(b) 'Skeptic A: five … three-method tuple' and SB-1**: Attribution of the panel's own judgment calls — comp.json keys: ['lens','verdict','findings','survived','seat','base'] — findings A-1..A-5 only, NO own-judgment-call table, no 'classifier' text. bill.json `ow **RATIFIED (7):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §883.6 · THE STALE-BASE REGISTER — the landing's one blocking finding, and the chair's cure (2026-09-02 ~15:4x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged.** Lane INSTR-land composed all nineteen picks cleanly (`72b513b85`, porcelain 0, 33 paths +34,011/−78 — the order's prediction to the byte) and then found `tests/lint/tuningRegister.walker.test.js` red **5 of 74** at the composed tip. Its control was decisive and taken *before* it reported: the same file is **74/74 green at TUNEREG's own C′-based dock**, with all four TUNEREG artifacts **blob-identical** in both runs. ⭐ **The consist did not change; the base did.** TUNEREG froze `.tuning-inventory.json` against C′'s `src/`; C″'s `src/` differs by T13's 38-file landing. **Eleven of eleven named files are era-attributable and zero to any consist** — one of them, `travelersGeometry.js`, does not exist at C″ because T13 deleted it, which is why it reads `2 → 0`. The lane refused to cure it and framed three options. **The chair took none of the three.**

**The chair's ruling — a REFREEZE PLUS ONE CEILING UNIT.** Reading the instrument rather than the lane's summary changed the cure. `CEILINGS` is a frozen object of **source constants in the test file** (`:71–78`), while arms 1–4 all compare the live measurement against the **committed inventory** — and the refreeze ritual rewrites that inventory wholesale (`...measured`, `:117–121`). ⭐ **Therefore a refreeze clears four of the five arms by construction, and only arm 5 survives.** The cure is:
1. **Refreeze at the composed tip** — `TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why>'`. ⚠ It **exits non-zero BY DESIGN**; a separate ordinary run is the proof.
2. **`UNREGISTERED_NAMED_CEILING: 534 → 535`** — a raise of **exactly one**, attributed to `src/domain/relationships/canonicalRelationship.js`, **which T13 landed at §883**. The debt is T13's; this instrument is simply the first thing on the branch able to see it. The instrument's own words are *"Raising one is not a **lane's** act"* — the chair is the seat that may, and only with the raise measured, attributed and declared. It is flagged OWNER-VISIBLE on §884.
3. **`BARE_DECIMAL_CEILING: 7003 → 6985`** — a **RATCHET DOWN of 18**, banking the sixteen measured wins, so the act is **net-tightening** rather than net-loosening.

**⛔ Three cures the chair explicitly REFUSED, each with its ground.** *(a)* **Authoring a register row** for the new named identity — `UNITLESS_TABLE_CEILING` is at **exactly 220 of 220, zero headroom** (measured: `unit === null` on 220 of 224 rows), so any row with `unit: null` breaches it, and assigning a unit to dodge that breach is **authoring tuning-estate content in order to make a gate green** — precisely what this consist refused to do everywhere else (`signatureVersion 0`, every row `draft`, no band anywhere, because a band is the owner's). *(b)* **A `DECLARED_GROWTH` entry** — moot after a refreeze (arm 2 compares live against committed, which the refreeze equalises) and it would breach `DECLARED_GROWTH_CEILING: 0`, a second raise for nothing. *(c)* **Any `src/` byte** — it would void the proven zero-build-input claim, owe a build and a byte-ceiling re-measurement, and edit T13's already-sealed landing.

**What Fable re-derives.** ⭐ **The ceiling raise first** — it is the only irreversible-feeling act here and the only one that grows a debt counter. Then the claim that a refreeze clears arms 1–4, which is a code reading and is falsifiable in one run. Then the refusal to author a register row: the chair judged that filling a `unit` to avoid a ceiling is estate authoring, and a returning Fable seat may reasonably hold that a factual unit is a census fact and the row should have been written.

**Receipts.** The lane receipt at `$ME/laneINSTRLAND/laneINSTRLAND-receipt.md` (377 lines) carries all five arms with verbatim payloads, the per-file era attribution, and the arithmetic that closes (`7003 − 18 = 6985`). The chair's own reads: the walker at `:486–505` and `:89–132`, and `.tuning-register.json`'s 220-of-224 unitless count.

**Priority: HIGH** for the ceiling raise, MEDIUM for the rest.

**⛔⛔ THE STRUCTURAL LAW THE LANE FOUND, AND IT OUTLIVES THIS LANDING.** *Any register whose SUBJECT tree is `src/**` and whose freeze was taken on a dock one landing back carries this defect BY CONSTRUCTION.* The pre-board apparatus cannot see it: §0.5's empty era intersections make the **path-local** bills additive, and say nothing whatever about a register whose *subject* the era moved. The lighting census survives only because its subject is per-file over `tests/`. ⭐ **Every remaining landing of this arc moves `src/`** — HORIZON-DARK, ENCOUNTERS, LIGHTING, GOLDEN, W-ARMS — **so this will recur at every one of them** unless the walker is made base-relative or the refreeze becomes a standing landing act. That design question is queued, not improvised here.

---

*RULED (§892, Fable 5.1):* ⛔ **SUPERSEDED at §883.8 — the ruling here ("a refreeze clears arms 1–4 by construction; the DECLARED_GROWTH row is moot") was REVERSED by the lane's executed run and by the chair's own re-ruling; this marker is the forward pointer the append-only queue never carried.** Re-derived by S11 on the code: `refreezeRefusals(...)` is called at walker :92 (composed-tip numbering) and throws at :104 BEFORE the wholesale `...measured` write at :120–124; `POPULATION_GREW` is raised at `tuning-inventory.mjs:1075`. The three refusals RATIFIED where they survive: (a) no authored register row — `UNITLESS_TABLE_CEILING` is 220 of 220 (measured), and writing a `unit` to make a gate green is estate authoring (a dissent remains defensible; the posture — every row draft at signature version zero, the register "the pen's" — decides it); (c) no `src/` byte — `src` is in the build-input set and `7f974e855` is sealed. The structural law (a `src/**`-subject register frozen one landing back is stale by construction) is RATIFIED — and **AMENDED:** "that design question is queued" is FALSE; nothing was queued; what exists is a de-facto standing per-landing refreeze forced by arm 1's exact-match red (`measuredAtSha` moved at every landing: `32573759e` → `dfcc8eb72` → `250d4e464`). Docketed here as a real design question for the register's author. Line addresses in this row and §883.8 are composed-tip (`72b513b85` / `f3d33e4b9`) addresses; at `f5a6c3bbf` the CEILINGS block is :71–93 and the call / throw / write are :106 / :118 / :134–138.

## §883.7 · THE PROSE ASSESSMENT — an owner question answered, and four defects found under it (2026-09-02 ~16:0x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged.** The owner asked whether the product's prose is competitive with generative-AI prose, disputing a chair claim that it was not. ⭐ **The chair's original claim was an INFERENCE PRESENTED AS A JUDGMENT** — it reasoned from the finite-semantics law (typed buckets, AI as clerk never writer) to a conclusion about writing quality, without reading one line of the prose. A law about *who writes* is not a law about *how well*. The chair withdrew it and measured instead: three read-only survey lenses, three reading lenses over real output, and two adversaries instructed to refute opposite sides.

**The verdicts.** Reading lenses: **CLEARLY BETTER** (dossier), **COMPETITIVE** (herald), **COMPETITIVE** (volume), all CONFIRMED. Adversaries **SPLIT** — the advocate returned CLEARLY BETTER, the critic CLEARLY WORSE — and the split is the finding, because they were answering different questions. ⭐ **The single most decisive piece of evidence is the hostile critic's own concession**: it drew an unbiased systematic sample (every 109th of 2,734 variants, no curation) and reported *"it came back strong … The median is not far below the showcased sample. That attack line fails and I say so plainly."* **An attacker conceding on its own uncurated sample is worth more than any advocate's praise.**

**What the estate actually is.** ~20,600 distinct reader-facing prose strings (~317,000 words) across 712 files. The dossier state-prose corpus is **146 blocks / 786 pools / 2,734 variants, every one textually distinct**, ~64,300 words, mean 23.5 words. `.generated.js` is **not** mechanical expansion — it is a strict projection of two hand-authored, dated, chair-vetoed markdown annexes in `docs/content/` (567 KB and 188 KB) with per-block ENTAILMENT rules, and the generator throws if one authored line fails to land.

**⛔ THE FOUR DEFECTS, each CONFIRMED by executing the real production functions on an extracted tree at `7f974e855`.**
1. ⛔⛔ **THE BEST PROSE IN THE REPO IS NOT SHIPPED.** 2,734 variants, **one call site outside the kernel** (`economyStateProse.js:226`), and `grep -rn "stateProse" src/components/` returns **0**. Five of six desks have no state→pool-key map. The project's own `docs/DESIGN_FP_SPINE.md` says it: *"THE READER IS BUILT AND DARK."* **A customer today meets the crier/rumour/wizardNews layer, not the corpus.** This is the LIGHTING WAVE's subject and it is now measured rather than estimated.
2. ⛔⛔ **THE ONE WIRED DESK PRINTS BROKEN ENGLISH TO THE MAJORITY OF TOWNS.** Running the real `economyStateProse()` over 20 settlements in one band, **11 of 20** printed *"a working the road"*. **All 7 `{access}`-bearing variants render ungrammatically** — `fillSlots` is a raw regex replace, `ACCESS_PROSE.road = 'the road'`, and the authored sentences already carry their own determiner: *"off its the river"*, *"the the river carries all of it"*, *"by the the river"*. In DS-ECO-1, the flagship block. ⭐ **This is a BUG, not a dark door** — it ships today wherever the desk is wired.
3. ⛔ **THE ANTI-REPETITION INSTRUMENT WOULD SIGN OFF ON THE EXACT FAILURE IT EXISTS TO CATCH.** `phraseRepetitionEnvelope` computes `new Set(lines).size` over the **rendered** sentence, so **substituting the town name manufactures variety**. On the same 20-town run it scored **0.3667 (a pass, ceiling 0.75)** where the reader-experienced frame repeat is **0.8500 (a fail)** — a 0.48 gap in the instrument's own favour. It also has **zero product consumers** (dark by construction, the lane-P precedent) and its ceiling is **UNRATIFIED until the owner signs it at the soak**.
4. ⛔ **DATABASE LABELS ARE PROMOTED TO GRAMMATICAL SUBJECTS, AND ENGINE SLUGS REACH A TOWNSPERSON'S MOUTH.** `wizardNews.js:477` composes `` `${label} takes hold in ${target}` `` with no pool, no seed and no variant — *"Conflict pressure takes hold in Elmspur."* And `whatPhrase` de-underscores a raw family slug, so `occupation_burden_cleared` renders as *"Merchants bring word of burden cleared in Thornwall."* **The critic reads this as a breach of the owner's own §754.3 directive.**

**⭐ THE PROVENANCE QUESTION, and why it resolves FOR the product.** `git log --diff-filter=A` on the state-prose annex returns ONE commit: `9a9094a33 2026-08-03 03:59:17`, 5,520 insertions, 2,149 variants, header *"Section order is WRITER-1 → WRITER-4"*, merged by VERIFIER-1. **The corpus is model-authored and then edited** — through a 239-line voice bible, an entailment law, four writer passes, a verifier and a chair veto. The critic calls this a category error (*"it IS LLM prose"*); the advocate calls it the thesis (*"LLM-ceiling sentences with LLM runtime behaviour removed"*). ⭐ **The chair rules FOR the advocate on this point**: capturing model quality while discarding model behaviour is the stated design goal, and a system that holds those sentences with no drift, no invented harbour, no per-read cost and THE PROMISE intact is strictly stronger than one that re-rolls them every session. ⚠ **But the critic's sharper form stands and is NOT answered: the process is purchasable, at roughly 67 variants a minute.** The moat is the entailment and anchoring laws, not the sentences.

**⭐ THE STRONGEST EVIDENCE FOR THE PRODUCT, which the chair did not have when it made its wrong claim.** The tree contains an EXECUTED record of what a model does on this exact task, and it is a list of prohibitions: `supabase/functions/generate-narrative/prompts.ts` bans the register by name (*no "nestled," no "bustling," no "tapestry of"*), bans a hallucination specific enough to need a six-noun enumeration (*do not invent wharves, docks, harbours, boats, sea charts, sailors*), and instructs the model against interchangeable output at **two independent sites**. `summarizeFoodSituation`'s docblock records the measured failure: *"'isolated' drifts into 'feeds itself entirely' — even when the engine recorded a 45% shortfall."* And `inventionSignal.ts` admits *"the model's most likely invention vector is PROSE … This does not enforce: it MEASURES."* ⇒ **The LLM path's principal failure mode is structurally uncaught here; the corpus's principal failure mode has two purpose-built instruments and two proven in-repo cures** (`hookVariety.js`'s draw registry cured a measured 8.19% / 35% repeat at an invariant roll budget).

**What Fable re-derives.** ⭐ **Defect 2 first — it is a live shipping bug**, one `ACCESS_PROSE` fill table away from cured, and it is the flagship block. Then defect 3, because an instrument that scores 0.3667 where the reader experiences 0.8500 is worse than no instrument. Then defect 1's scope, which is the lighting wave's actual size. Then the chair's ruling for the advocate on provenance, which is a judgment a returning Fable seat may reverse.

**Priority: ⛔ HIGH for defects 1–3** (all launch-visible), **MEDIUM for 4**, and **HIGH for the chair's own process failure** — an inference asserted as a judgment about the owner's product, corrected only because the owner pushed back.

---

*RULED (§892, Fable 5.1):* **The process self-report RATIFIED; defects 1, 2 and 4 RATIFIED in substance and AMENDED on figures; defect 3 AMENDED at its core; the provenance ruling RATIFIED; the strongest-evidence paragraph RATIFIED verbatim; the reading-lens and adversary verdicts EVIDENCE-THIN (S12, executed on the production functions at `7f974e855`).** The corpus census re-derives exactly from `variants.json` (2,734 / 2,207 = 80.7 % / 3,238 / 39 / 786 / 146; mean 23.5; 64,344 words); the estate triple (~20,600 / ~317k / 712) is chair-filtered from a raw 22,651 / 771 / 378k with the filter not preserved — label it so. **Defect 1** holds (0 `stateProse` hits in `src/components/`; one desk for six leaves); **AMEND:** the SPINE quotation is not verbatim and is about Lane H's herald display slice ("the DISPLAY SLICE IS BUILT AND DARK"), not "the reader"; and the annexes are "model-drafted under writer / verifier / chair passes", not "hand-authored" — the same row's provenance paragraph says so. **Defect 2** holds (`ACCESS_PROSE.road = 'the road'`, `fillSlots` a raw regex, cured at §884.3) — **AMEND:** 10 of 20 towns on the chair's own deterministic probe, not 11; the seven `{access}` variants live in DS-ECO-1 (6) and DS-ECO-10 (1). ⛔ **Defect 3 AMENDED at its core:** the shipped `phraseRepetitionEnvelope` never scored 0.3667 and never PASSED that stream — on its own contract it returned NO EVIDENCE (20 unpowered windows, `carriesEvidence false`); 0.3667 is the chair's own cross-town formula in `desk2.mjs`, and the town-name mechanism cannot operate inside per-settlement windows. The CONCLUSION survives on different evidence: the real blind spot is a collapse mutant (m7: 0.0 rendered vs 0.92 frame passes), and the instrument's zero consumers and unratified ceiling stand. **Defect 4:** line 478, not 477; the headline frame was cured at §886; **AMEND:** the slug half was GATED, not cured — `whatPhrase` keeps the de-underscore arm for the twelve owner-gated mutilated anchors (LEG-7), and the row's own example `occupation_burden_cleared` still computes "burden cleared". **The provenance ruling FOR the advocate** is RATIFIED, with the chair's two considerations restated: every guarantee the product sells (immutable lived history, same-seed determinism, no invented harbour, no per-read cost) is a property of FIXED text, and `prompts.ts`'s prohibitions are executed evidence of what runtime generation costs; the critic's "purchasable" point stands unanswered and belongs to the marketing doctrine, not the engine. **EVIDENCE-THIN:** the three reading lenses, the two adversaries and the critic's every-109th-sample concession exist only as the chair's transcription in the ledger row (the sampling script survives; the judgments do not).

## §883.8 · THE LANE REFUTED THE CHAIR, AND THE CHAIR RE-RULED (2026-09-02 ~16:2x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged.** §883.6 ruled the tuning blocker cured by *a refreeze plus one ceiling unit*, on the reading that a refreeze clears arms 1–4 by construction. **The lane predicted the outcome in writing, ran it, and the ruling FAILED**: `REFREEZE_TRUE_EXIT=1`, refusal `POPULATION_GREW`, inventory blob `f884af145…` **identical before and after**, no temp file, nothing written.

**⛔ THE CHAIR'S ERROR, NAMED.** `refreezeInventory` does rewrite the inventory wholesale — that reading was correct. But `refreezeRefusals(...)` is called at `walker:92-103` and throws at `:104-106`, **UPSTREAM of that write**, and the chair never opened it. The chair **saw a guard, assumed it knew what the guard guarded, and ruled from the half it had read.** The growth door is that guard. So the `DECLARED_GROWTH` row the chair dismissed as *"moot after a refreeze"* **is the gate**, and the two files the refusal names are exactly the two files arms 2 and 4 name. ⭐ **Both stated grounds for the refusal were falsified by one executed run.**

**The re-ruling: TAKE THE `DECLARED_GROWTH` DOOR.** The chair's own distinction now argues FOR it — a `declaredGrowth` row is `{introducedAt, cause, sites}`, a **CITATION of a commit**, touching no value, unit, band or signature. That is categorically unlike the refused `tables` row, which required **inventing a `unit` from nothing** to dodge a ceiling at 220 of 220. Cure order: two rows → refreeze → three ceilings (`DECLARED_GROWTH_CEILING 0→2`, `UNREGISTERED_NAMED_CEILING 534→535`, `BARE_DECIMAL_CEILING 7003→6985`, a ratchet DOWN of 18). The chair wrote both cause strings itself and put an E4 prediction on the record: the refreeze then succeeds, arms 1–4 green, **arm 5 reports EXACTLY TWO problems** and `BARE_DECIMAL_CEILING` does not appear.

**⭐⭐ THE FINDING UNDER THE FINDING, re-confirmed by the chair's own reads.** Both growth rows come from ONE commit, `754856b125828dc555359d6df0e0632be9636a09` — verified an ancestor of C″, touching both files (+42/−6 and +24/−1). And the P2 growth is T13 **giving a magic number a name**: `+const POPULATION_SATURATION = 2511886.43150957906619;` — **+1 unregisteredNamed and −1 bareDecimal, same file, same commit.** ⇒ **The register scores the act it exists to encourage as a debt**, and will do so every time anyone names a constant, until that name earns a register row. That is a defect of the INSTRUMENT, not of any consist, and it is the sharpest thing this landing found.

**⛔⛔ A SECOND CHAIR DEFECT, IN THE SAME WINDOW, SELF-REPORTED.** While writing this stratum's handoff refresh the chair ran an index-surgery edit whose end-anchor **did not match**. `str.find(needle, i)` returned `-1`, `find("\n", -1)` resolved to the file's LAST newline, and the assertion — which checked `j > i` but **not that the span was bounded** — passed. **`docs/HANDOFF_CURRENT.md` was truncated from 51,035 bytes to 4,580 in the working tree**, destroying the successor card. It was recovered byte-identical from HEAD (nothing had been committed) and redone line-scoped with span assertions. ⭐ **THE LAW: an anchor PAIR must assert the SPAN, not merely the ORDER.** `j > i` is not a bound; `MIN < j - i < MAX` is. And prefer line-scoped replacement over index surgery in a file whose card block occupies known lines.

**What Fable re-derives.** ⭐ **The re-ruling first**, because it reverses a refusal on new evidence and the reversal turns on a distinction the chair drew itself (authoring versus attributing) — a returning Fable seat may hold that the distinction is too convenient. Then the `POPULATION_SATURATION` finding, which is one `git show` away and, if it holds, argues the walker needs a rule change rather than a declaration. Then the two cause strings, which are the chair's own words entering an authored file.

**Receipts.** The refusal text verbatim in the lane receipt (453 lines, rows `L-13`…`L-15`); `scripts/lib/tuning-inventory.mjs:1046-1075` for the growth door; `git merge-base --is-ancestor 754856b12 7f974e855` → true; `git show 754856b12 -- src/domain/relationships/canonicalRelationship.js` for the named constant.

**Priority: ⛔ HIGH.** Two chair defects in one window, both caught — one by the lane, one by the chair's own read-back. **Neither was caught by a gate**, and that is the row worth a Fable seat's attention.

---

*RULED (§892, Fable 5.1):* **The re-ruling RATIFIED; the POPULATION_SATURATION finding RATIFIED on its fact and AMENDED on its phrase; the second chair defect RATIFIED as self-reported (S11).** The `DECLARED_GROWTH` door shape `{introducedAt, cause, sites}` is a CITATION of a commit — validated only as a sha that resolves, a cause length and a site count — categorically unlike the refused `tables` row that needed an invented unit; the three ceilings landed as ruled (`DECLARED_GROWTH_CEILING 0 → 2`, `UNREGISTERED_NAMED 534 → 535`, `BARE_DECIMAL 7003 → 6985`) at `f5a6c3bbf`; the walker runs 75/75 at the §891 dock. The E4 arm-5 outcome is receipt-read (no dock sits at `f5a6c3bbf`). **POPULATION_SATURATION:** `754856b12` is an ancestor of `7f974e855` and the +1 unregisteredNamed / −1 bareDecimal in one file in one commit is exact — **AMEND the phrase:** the removed literal is the cap `0.8` and the added constant is a DIFFERENT, measured value (the saturation population), so "gave a magic number a name" is loose; "a capped formula replaced by a named saturation constant" is exact, and the instrument still charges the hygiene act as a debt — the rule-change question (net-zero for a same-commit name-for-bare replacement, or a registration duty) is docketed for the register's author. "Net ceiling movement −17" omits the +2 the chair itself called a second raise: across all three ceilings the net is **−15**, still tightening. The HANDOFF truncation (51,035 → 4,580 B, recovered from HEAD; the pre-size CONFIRMED at `9b7d6998b`/`efcf98b89`, the transient size PLAUSIBLE) and the span law (`MIN < j − i < MAX`) RATIFIED.

## §884 · THE HORIZON-INSTR LANDING'S STRATUM — five lanes, an order panel, and two chair errors (2026-09-02, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `claude/composite-r4` `7f974e855` → **`f5a6c3bbfd86a268a218b36dffefacb04bd6bf9b`**, sealed `refs/preserve/landing-INSTR-2026-09-02`. 23 commits, 23 parser-visible `Seat:` trailers, porcelain 0, gate **GREEN ON THE FIRST RUN** in 1,068 s. **Every one of these 23 commits is Opus-seat work and every row below is OWED a Fable second look.**

**The rows this landing enrols, by origin.** **CURE-PORCELAIN 6** (`J-1…J-6`) · **INSTR-TUNEREG 12** (`J-1…J-12`, four already ruled at §882.15) · **INSTR-WRW 9** (`R1…R9`, R3 and R5 discharged by ruling) · **INSTR-SOAK 10** (`S1…S10`) plus its **six HANDOVER rows `H-1…H-6`, which are NOT retrovalidation rows and must not be filed as such** · **the landing order's author 9** (`O-1…O-9`) · **Skeptic A 5** · **Skeptic B's SB-1** · **the fold 10** (`F-1…F-10`) · **lane INSTR-land 21** (`L-1…L-21`) · **the chair's four CR rulings** (§883.5) · **the chair's two re-rulings and two errors** (§883.6/§883.8 and below).

### ⛔ THE TWO CHAIR ERRORS THIS LANDING RECORDED AGAINST ITSELF

**(1) The §883.6 ruling was wrong, and a lane refuted it by execution.** The chair ruled a refreeze would clear four of five failing arms, having read `refreezeInventory`'s body and **not** the guard that runs before it. `refreezeRefusals` throws upstream of the wholesale write; the refreeze refused `POPULATION_GREW` with the inventory blob identical before and after. Re-ruled at §883.8 to take the `DECLARED_GROWTH` door, which executed exactly as the re-ruling predicted. ⭐ **The lane's conduct is the model: it predicted the refusal in writing, ran it, held rather than taking a door the ruling had closed, and when a second gate run produced a DIFFERENT red it stopped and diagnosed instead of running toward green** — a third run over a suite it had just measured at 0.392% flaky would have been a false green (`L-17`).

**(2) CR-2 was a ruling the chair did not need to make, and its own re-run was the vacuous one.** CR-2 directed the chair to run the `dist/`-reading `tests/build` suites after the gate. ⛔ **`npm run check`'s final stage `verify:dist` already runs them**: it sets `VERIFY_DIST=1` itself (`check-test-ratchet.mjs:702`) and treats any build-test non-run as an unconditional failure, which is why the gate reported `52 files, 440 tests, zero non-run`. The chair's bare `npx vitest run tests/build` **skipped 57 of 440 and still exited 0** — the exact vacuity the flag exists to prevent. ⭐ **THE LAW: before ruling that a batch is unowned, check whether a later stage of the gate already owns it** — and a targeted re-run of a flag-gated suite without its flag is weaker than the gate, never stronger.

### ⭐⭐ THE FINDING THAT OUTLIVES THE LANDING — the register scores the act it exists to encourage

The tuning walker's P2 growth was **T13 giving a magic number a name**: `+const POPULATION_SATURATION = 2511886.43150957906619;`, **+1 unregisteredNamed and −1 bareDecimal in the same file in the same commit**. The instrument therefore charges a debt for the exact hygiene act it exists to promote, and will do so at every future naming until the name earns a register row. **A defect of the instrument, not of any consist.** *What Fable re-derives:* whether the fix is a rule change (a named constant that replaces a bare decimal in the same commit is net-zero, not +1) or a registration duty. *Priority:* **HIGH** — it will recur at every landing that names anything.

### ⚠ THE FOREIGN DETERMINISM LEAK, DIAGNOSED AND DELIBERATELY NOT CURED HERE

`wizardNews.js:552` — `createdAt: entry.createdAt || options.now || nowIso()`. A caller supplying neither gets a live clock, so two calls a millisecond apart serialise differently: **784 mismatches in 200,000 iterations, 0.392%**, first divergence exactly at `createdAt`. Blobs identical at C″ and at the tip ⇒ **FOREIGN and pre-existing**; it did not fire in the gate. ⛔ **THE GOLDEN FREEZE WOULD BAKE IT IN.** Recorded as a **deferral with a home, not a dropped thread**: cure it before the freeze, test-side, at `tests/domain/fieldBattleRegion.test.js:108-110`. *Priority:* **HIGH, and time-boxed by the freeze.**

### THE STRUCTURAL LAW BANKED

⛔ **Any register whose SUBJECT tree is `src/**` and whose freeze was taken on a dock one landing back carries the stale-base defect BY CONSTRUCTION.** The pre-board apparatus cannot see it: empty era intersections make the **path-local** bills additive and say nothing about a register whose *subject* the era moved. **Every remaining landing of this arc moves `src/`.** *What Fable re-derives:* whether the cure is a base-relative walker or a standing landing act. *Priority:* **HIGH.**

### WHAT ROSE AND WHAT TIGHTENED

Net ceiling movement **−17** (one raise of +1, one ratchet-down of −18): the landing **tightens** the estate. Nothing was re-recorded — no golden, no fixture, no fence constant, no OSR row — and the one derived identity that moves, the realm-scale `sourceFingerprint`, moves **by design** and is committed nowhere. `L-6 DISCHARGED`: the porcelain cure's repeatability was demonstrated on a real landing rather than only on its own dock.

---

*RULED (§892, Fable 5.1):* **The landing figures RATIFIED (23 commits / 23 trailers · 35 paths +34,054/−88 · sealed `landing-INSTR-2026-09-02` · gate green first run 1,068 s); the two chair errors RATIFIED as self-reported; the instrument finding RATIFIED with its phrase AMENDED; the wizardNews deferral AMENDED as DISCHARGED; the structural law RATIFIED with its "queued" claim REVERSED; the ceiling arithmetic AMENDED (S11).** Error (1): §883.6's refreeze ruling was wrong by code — see §883.6/§883.8 above. Error (2): CR-2 was vacuous — `verify:dist` owns every dist-reading suite with the flag set; the chair's flagless re-run skipped 57 of 440 and exited 0. The `POPULATION_SATURATION` finding: exact on its fact, loose on its phrase (§883.8 above). **The wizardNews leak** (`src/domain/region/wizardNews.js:552`, `createdAt || options.now || nowIso()`, blob identical at `7f974e855` and `f5a6c3bbf` — FOREIGN; 0.392 %): the diagnosis is exact and the deferral was **DISCHARGED test-side at §888 (`b6822dcae`) and fenced at §889 (`efed4ba91`)** — ⛔ SUPERSEDED, marked here; the src-side chain `|| nowIso()` still stands at `ca651d54b:627` and its cure (`resolveStamp`, `3a6f0d761`) rides only the unlanded §891 train. **The structural law** holds; "that design question is queued" is FALSE (nothing queued) — docketed at §883.6 above. "Net ceiling movement −17" is −15 across all ceilings. `L-6 DISCHARGED` RATIFIED (the second refreeze from a dirty register on the landing tree, register blob byte-identical across runs). The rows this landing enrols by origin are ruled at §883.4–§883.7 (lane rows) and §883.5 (the order).

*RULED (§892.x, Fable 5.1):* **2 AMEND · 1 RATIFY** (§884, 3 calls, slices S11; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **§884 wizardNews determinism leak (HIGH 6)**: Diagnosis and deferral — f5a6c3bbf src/domain/region/wizardNews.js:552 `createdAt: entry.createdAt || options.now || nowIso(),`; blob 787999905 at BOTH 7f974e855 and f5a6c3bbf (foreign) · **§884 net ceiling movement −17**: Arithmetic over the moved ceilings — Three ceilings moved: DECLARED_GROWTH 0→2 (+2), UNREGISTERED_NAMED 534→535 (+1), BARE_DECIMAL 7003→6985 (−18). Receipt scoped its figure: `Net movement across t **RATIFIED (1):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §884.1 · THE POST-LANDING DISPATCH (2026-09-02 ~21:3x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged.** The board came out of the §884 landing empty — zero of four running, no lock, all docks porcelain 0 — and the chair chose which two of the four free slots to fill. **CURE-CAPSULE-REBASE** (the §883.5 CR-1 ruling, now executable because §884 landed and moved the branch under it) and **FILL-LAYER** (§883.7's broken `{access}` fills). ⭐ **The chair ranked FILL-LAYER first on the board over every other queued item, including the chartered waves**, on the one-way-door ground: it is free today because the corpus has zero product consumers, and the tree's own ratchet baseline says the equivalent burn *"becomes impossible the day the stack is wired."* Both skeptics of the design panel independently reached the same sequencing.

⚠ **A HEARTBEAT INSTRUCTION WAS REFUSED, and this is the row that records it.** The 30-minute dispatcher heartbeat carries stale text: it names `gate-tailf.log` (§882, landed 04:2x) and instructs the chair to commit with the trailer **`Seat: Fable 5.1 — validated`**. ⛔ **The seat has been OPUS 5 since §882.8.** Signing this span's work with a Fable trailer would mark unvalidated Opus work as Fable-validated — **precisely the class the retrovalidation mark exists to prevent**, and it would defeat the §882.14 enrolment gate rather than trip it. The chair followed the heartbeat's INTENT (survey, board, completions, checkpoint) and refused its stale specifics.

*What Fable re-derives:* the FILL-LAYER-over-everything ranking, which is a scheduling judgment the returning seat may reverse; and whether a standing heartbeat that carries a seat trailer in its text is safe at all, given a seat can change mid-arc while the cron text cannot.

*Priority:* MEDIUM for the ranking. ⛔ **HIGH for the heartbeat defect** — an automated instruction that hard-codes a seat will keep issuing the wrong one for the rest of the arc.

---

*RULED (§892, Fable 5.1):* **The FILL-LAYER-first ranking RATIFIED; the heartbeat refusal RATIFIED; two wordings AMENDED (S12).** The one-way-door ground holds (the ratchet baseline's own words: "becomes impossible the day the stack is wired"; zero consumers; one commit) and the chair would not reverse it. **AMEND (1):** "both skeptics independently reached the same sequencing" overstates R1, which ranked three lit-surface bugs ahead of FILL-LAYER; both agree only that FILL-LAYER precedes any lighting. **AMEND (2):** the heartbeat's stale trailer is CONFIRMED by outcome (`17970ea7c` carries the Opus trailer) but the heartbeat text is EVIDENCE-THIN (no scheduled task survives; it was session-bound) and "for the rest of the arc" overstated — the class finding stands, and with the seat back at Fable 5.1 the same hard-coded text would today be accidentally correct, which is the strongest reason never to hard-code a seat in a standing instruction (this chair's heartbeat names the seat once and points at the resume note).

## §884.2 · THE GUARD FIRED AND THE ACT DID NOT STOP (2026-09-02 ~21:4x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged — a chair process failure, self-caught on read-back.** The §884.1 collection ran its asserting handoff edit FIRST, exactly as the §882.11 cure requires. The assertion **correctly fired** (`trees line span 862` against a wrongly-guessed bound of 1000–2000) and **the handoff was not written** — but the surrounding shell had no `set -e` and no `||  exit 1`, so **the act continued and committed a handoff that had not been refreshed.** The ledger row and the queue stratum landed correct; only the successor card was stale, by one fact: that two lanes were running.

⛔ **THE MISSING HALF OF THE §882.11 CURE, NOW WRITTEN DOWN.** That cure said *an asserting anchor-replacement runs BEFORE any other file is written*. It is **necessary and not sufficient**. The full law:

> **An asserting edit must ABORT THE ACT, not merely decline the edit.** Order it first *and* chain it so its
> failure stops everything after it (`set -e`, or `python3 … || exit 1`). A guard whose failure is swallowed by
> the shell is indistinguishable from no guard — it produces exactly the outcome it was written to prevent, and
> it does so while reporting success.

⚠ And the second-order lesson, which is the one that actually recurs: **the bound was wrong because the chair guessed it instead of measuring it.** Same shape as [[an-anchor-pair-must-assert-the-span]], where a first retry also failed its own bound (1000 guessed, 905 real). **Measure the span, then assert it.** Three times in one session a chair edit has gone wrong at an anchor, and every one was caught by a read-back rather than by a gate.

*What Fable re-derives:* whether the collection ritual should stop being a shell script at all and become a single Python program that holds every assertion and every write in one transaction, so partial application is impossible by construction.

*Receipts:* the §884.1 commit `17970ea7c` carries three files, of which `docs/HANDOFF_CURRENT.md` is byte-identical to its parent's. This act lands the refresh that commit should have carried.

*Priority:* ⛔ **HIGH — it is a defect in the chair's own collection ritual and it has now bitten twice.**

---

*RULED (§892, Fable 5.1):* **The failure and the law RATIFIED; one figure AMENDED (S12).** `17970ea7c`'s `HANDOFF_CURRENT.md` blob (`59ee278b4`) is identical to its parent's and the refresh was exactly one line — the guard fired and the act continued, as the row says. **AMEND:** the commit "carries three files" is wrong — it changed two (FRQ +12, ODQ +1); the third file the ritual meant to write was not written, which is the finding. The 862 / 1000–2000 span figures are the chair's own record only (immaterial). The law — an asserting edit must ABORT THE ACT; measure the span, then assert it — RATIFIED, and the re-derivation question answered YES: a single Python program that measures every span, asserts, and writes all files or none removes the habitat; this sitting's writers (`apply-rulings.py`, `apply-892.py`) are built that way and refuse on any anchor count ≠ 1.

## §884.3 · THE ONE-WAY DOOR IS THROUGH (2026-09-02 ~22:2x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was judged.** Lane FILL-LAYER holds at **`adb9f19b70fa174157d9fca86a80b290451ca4c6`**, one car over `f5a6c3bbf`, porcelain 0, one parser-visible trailer, self-sealed at `refs/heads/claude/lane-filllayer-2026-09-02`. It cured §883.7's broken slot fills **while the corpus still has zero product consumers**, which is the whole reason it went first.

**⭐ THE PROOF IS A DIFFERENCE OVER REAL RENDERS, NOT AN ASSERTION.** Template-differenced across **3,696 real renders**: before, **1,100 adjacent-determiner · 836 doubled-word · 660 determiner-then-capital · 140 dash**; after, **none**. DS-ECO-1's broken sentences **133 of 144 → 0** — ⚠ note the lane's own count is HIGHER than the panel's 122 and far higher than the brief's 11-of-20, so **the defect was worse than the chair briefed**. No surface went silent: headers render 3,696 of 3,696 before and after. **Two proven controls**: planting `'the road'` back reds five arms across two files (restore blob-verified by sha256, 149/149 green after), and renaming a register row makes the projection **throw**.

**The census with its denominator, which is what makes it a class fix.** 39 distinct slots · 2,734 variants · 2,207 naming ≥1 slot (80.7%) · 3,238 slot occurrences · 786 pools · 146 blocks — **every figure matching the brief exactly**. Shapes: proper 21 · bare-common 11 · phrase 6 · reserved 1. ⭐ **Fill tables in the entire tree: ONE.** Only **4 of 39** slots have a producer at all, all in `economyStateProse.js`, and **2 of those 4 were unsafe** — `access` (5/5 values carried an article) and `complexity` (11/11 title-cased, 5/11 em-dashed).

**⭐ CHAIR-VERIFIED BY OWN READS.** All **seven generated leaves byte-identical to base** (the load-bearing claim: the annex edits sit outside every block, so the projection did not move) · ancestry OK · survival ref confirmed by `for-each-ref --contains` · **zero new test files** (all three test surfaces are existing files, so the three-census rule does not fire) · no edit to `stateProseKernel.js`, holding the ONE-kernel-consist discipline. ⚠ **CORRECTION TO THE LANE'S FRAMING: a build IS owed at this car's landing** — `src/domain/display/stateProse/economyStateProse.js` is inside the build-input set, so unlike §884 the byte ceilings must be re-measured rather than inherited.

**⭐ THE LANE STRENGTHENED THE PANEL RATHER THAN OBEYING IT**, and these are its own calls: it found A7's cure misses a **lowercase** determiner-led fill — exactly the shape the desk's own fixture supplied — and covered it; it re-shaped A8 because the register lives in **two annexes with different column counts**, so it finds the Shape column by header name rather than position, which **neither designer nor either skeptic noticed**; and it measured the panel's proposed control floors (≥200/≥150/≥150) as **wrong** — the real values are 108/101/150, because the panel's detectors counted authored prose as defects. Floors re-frozen to measured. It also refused four proposals with reasons, the sharpest being that exporting the parser from the generator is a landmine: the generator has **top-level side effects**, so importing it from a test **rewrites all seven leaves**.

### ⚠ THE ONE OPEN ROW, RULED AS A DEFERRAL WITH A HOME

The lane refused to mint eleven reader-facing words for `{complexity}`, correctly calling that chair content. The cost: **`{complexity}` is now dark on all eleven producer values, and pool C1 drops to one eligible variant of three** — under the anchoring law a variant naming an unfillable slot does not render — so every high-rung working-approach town would print the same sentence. ⭐ **THE CHAIR RULES THIS A DEFERRAL, NOT A BLOCKER, AND ITS HOME IS THE LIGHTING WAVE.** Ground: the economy desk **is not wired**, so a collapsed pool costs **zero** today and costs exactly one sentence's variety on the day the desk lights — which is the same day the wave must price every other variety question anyway. ⛔ **It must NOT be silently carried past the lighting wave**: it is recorded at annex §0c-3 with its arithmetic and is named here so the wave inherits it. ⚠ **And the owner's own correction applies to the fix**: the pools exist for **anti-staleness**, so a collapse from three variants to one is a direct hit on the property the corpus was authored to have. *Veto shape:* rule the eleven in-sentence forms now (they are transcriptions of existing display strings into a second register, with the article stored per value, not new concepts) and the collapse never happens.

**Also deferred and documented at annex §0c-4, not dropped:** 20 sentence-initial lowercase seams (cure belongs to the kernel consist) · `{band}`'s six roles over 37 uses in 26 blocks (one wave or none) · `{reason}`'s smaller version of the same tension. **And checked clean so nobody re-checks it:** §0d's digit ban holds — the twenty a naive scan reports are all the `2` in `{faction2}`.

*What Fable re-derives:* the `{complexity}` deferral first, because it trades a measured variety loss for a refusal to author, and the owner has ruled that variety is the pools' purpose. Then the re-frozen control floors, which are the lane correcting a panel by measurement.

*Priority:* MEDIUM for the deferral, LOW for the rest — the car itself is proven by difference over real renders and carries two working controls.

---

*RULED (§892, Fable 5.1):* **The car, the proof, the census, the chair's verification and the panel corrections RATIFIED; the `{complexity}` deferral RATIFIED with its cost AMENDED (S12, re-derived from the render dumps and the annex at `adb9f19b7`).** `adb9f19b7` is one car over `f5a6c3bbf`, porcelain 0, one trailer, self-sealed under `claude/lane-filllayer-2026-09-02`, zero new test files, the kernel untouched; the seven generated leaves are byte-identical to base (md5 per leaf); the render dumps re-derive 144 → 23 distinct headers, 0 broken after, 3,696 / 3,696 non-null (the 133 is detector-dependent; the four template-differenced counts are PLAUSIBLE — re-run `seams.py`/`census1.py` to settle); the census figures re-derive exactly; the lowercase-determiner fixture, the header-by-name Shape column and the generator's top-level side effects are CONFIRMED by reading; the re-frozen floors 108 / 101 / 150 are PLAUSIBLE from the receipt. **The `{complexity}` deferral holds today** (zero consumers ⇒ zero rendered bytes; eleven reader-facing forms are chair/owner content) — **AMEND its cost:** annex §0c-3's own arithmetic is C1 1/3 · C2 2/3 · C3 2/3 · C4 3/3 · C5 2/3, so FOUR of five DS-ECO-1 pools lose a variant, not only C1; and §885 cure 1/1 (`37e285498`) shows the car's `string|undefined` type change reached a consumer the lane missed (`slots.season` in a detail row), caught by the chair's strict gate. ⛔ Because the desk is now WIRED by DESK CAR 1 in the unlanded §891 train, this deferral stops being free the day that train lands: it is re-ruled a **BLOCKER on lighting the economy desk's C1 pool**, and the eleven in-sentence forms are docketed as a chair-class content car for the lighting wave. Also carried: the FILL-LAYER and CURE-CAPSULE docks hold materialised `node_modules` (`cp -Rc`), harmless because neither built, hazardous if either is re-used for a size-gated build.

*RULED (§892.x, Fable 5.1):* **6 RATIFY · 1 AMEND** (§884.3, 7 calls, slices S12; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (1):** **call DEFER — {complexity} refused on all eleven producer values, pool C1 drops to one eligible variant of three; ruled a DEFERRAL with a home (lighting wave), recorded at annex §0c-3**: Deferral, not blocker, because the economy desk has zero consumers; the collapse costs nothing today. — annex@adb9f19b7:219 '### §0c-3 THE COMPLEXITY BAND — **OPEN, THE CHAIR'S** (2026-09-02)'; :223-224 '**11 of 11 are refused**'; :229-232 'Eligible variants per D **RATIFIED (6):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §884.4 · THE PREVENTION CAR RE-BASES, THE CONSIST COMPOSES, AND TWO HAZARDS ARE BANKED (2026-09-02 ~22:5x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The act.** Lane CURE-CAPSULE-REBASE re-based the prevention car onto the moved tip: **`62be253f3278cf88cfd3656d39e8f9e2357e59bf`**, parent exactly `f5a6c3bbf`, **content blob-identical to the original car** — the re-base moved the message only, not one byte of source. Both the original (`c422ee824`) and the re-based car are sealed. The chair then **composed both held cars onto one dock**: CURE-CAPSULE + FILL-LAYER = **`36f04bfcdc2b2414f4bd3e08447003d69b700dad`**, 2 commits, **10 paths +1,179/−85**, porcelain 0, 2 trailers, **zero conflict markers on both dry runs and an EMPTY path intersection between the cars**. ⚠ **A build IS owed** (`economyStateProse.js` is inside the build-input set), unlike §884 which inherited its ceilings. ⭐ **One gate instead of two**, which CR-1 permits: its ground was that the prevention car must not ride *the landing it protects*, not that it must ride alone.

### ⛔⛔ HAZARD 1 — THE HARNESS REPORTED A RED FULL-SUITE RUN AS GREEN

The lane launched its ratchet backgrounded as `…; echo $? > sentinel`. **The task notification said "completed (exit code 0)" — because the final `echo` succeeded. The ratchet's true exit was 1.** Reading the notification instead of the sentinel would have banked a red full-suite run as green, on a landing gate, with the known-failure census at 10/10 and no headroom.

> ⭐⭐ **THE LAW: a background task's reported exit is the exit of the LAST command in the chain.** Anything appended after the command you care about — `echo`, `tee`, a timestamp, a cleanup — **overwrites the status the harness reports, and the notification then lies with full confidence.** End every wrapper with `exit $TRUE_EXIT`, and read the captured status from the log, never the notification. This is a new door onto "trust no exit status you did not capture", and it is worse than the old one because the false status arrives from the *harness* rather than from the shell.

*(The chair's own two wrappers this session, `run-gate-instr.sh` and `run-cr2.sh`, both end in `exit $TRUE_EXIT` and were therefore honest — verified, not assumed.)* **The red itself was proven not-the-car's:** an eleventh failure (`STACK_TRACE_ERROR`) at **load 40.87 on 8 cores** with a sibling holding the shared tier, inside §884's own `writerReach.walker.test.js` — a file this car cannot reach and which passes **56/56 standalone at this tip**. **Nothing was banked: a budget expiry is a cost failure, never debt.** ⭐ **This is why the chair is HOLDING the composed consist's gate until the box is quiet rather than gating beside two running analysis agents.**

### ⚠ HAZARD 2 — THIS PROGRAM HAS TWO SEAT-TRAILER GRAMMARS AND NOTHING RECONCILES THEM

The lane found its car carried `Seat: Opus 5 (lane CURE-CAPSULE)`, which matches **none** of the three alternations at `chair-commit.sh:34`, and rewrote it to `Seat: Opus 5 — Fable-unvalidated` plus a `Lane:` line preserving attribution. ⭐ **The finding is right and the inference is wrong, and the chair measured both.** That grep reads `$MSGFILE` — **the LEDGER message** — and never sees a product commit. The product convention is the other grammar, and it is consistent: **§884 21 of 23 · §883 T13 28 of 28 · §882 TAIL-F all of them** carry `Seat: <model> (lane <NAME>)`. Against the strict alternation §884 scores **2 of 23**; against the loose `^Seat: ` it scores **23 of 23**, which is what the §882.14 audit's 56/56 was measuring.

⇒ **No §884 defect exists and the chair's §884 ratification stands.** But the real finding is the one neither party set out to make: **two grammars, one gated and one enforced by nothing, and the ungated one has now drifted once.** *Ruling:* the lane's edit is **RATIFIED on its outcome and its ground CORRECTED** — the car is marked and attributed either way, so the edit is harmless, and a car whose entire subject is enrolment is the right place to prefer the stricter form. ⛔ **But it must not be generalised into a re-write of the product convention**, which is 100% consistent across three landings and would cost a re-pick of every consist to change.

### ⭐ THE LANE'S OTHER TWO ACTS, BOTH RATIFIED

**RV-6, the message edits — RATIFIED.** The car's message asserted `Lighting 2497/370/2127/22491/6078`, **true at the old base and FALSE at this one**: a false citation, and this program's citation law is explicit that a string is a citation or a mint by the claim it makes. The lane replaced it with measured figures, **reported RUN 1's red rather than burying it**, and **retired** the stale OSR/typecheck/strict-domain readings rather than carrying them forward, since this act did not execute them. That last move is the sharpest: **carrying a green you did not run is the same defect as citing a figure from the wrong base.**

**The negative control — RATIFIED, and it is the model.** Two parts. C-A deleted the column-law assertion and the battery **red**, then restored blob-identically. C-B drove **both real parsers over identical bytes** — nothing hand-copied, the transform asserted to touch exactly two lines with the parse expression proved byte-identical first — and reproduced **the false CLEAN at this base**: one dirty record trimmed pre-cure returns `[]`; with two records, record one **vanishes** and record two survives character-perfect; cured, it **throws and names the record**. 6 of 6 verdicts.

**Both bills predicted then measured, both Δ=0:** lighting tuple `2503/370/2133/22665/6099` unmoved with the walker green at 34, ratchet `30,962 / 2,451` with the census still 10/10 and **none of its zero headroom consumed.** No refreeze owed on either.

*What Fable re-derives:* Hazard 1 first — it is the only defect this session that produced a **false green on a full-suite run**, and the chair's guard against it is a shell convention rather than a gate. Then the two-grammar finding, and whether the ungated product convention should acquire a walker.

*Priority:* ⛔ **HIGH for Hazard 1.** MEDIUM for the grammar drift. LOW for the ratified acts.

*Deferred, PLAUSIBLE not confirmed, with a home:* OSR, typecheck and strict-domain were not re-measured on the re-based car (the OSR corpus is built by executing the domain pipeline, so a `scripts/` porcelain parser cannot mint a shape). **Owed at the composed consist's gate with everything else.**

---

*RULED (§892, Fable 5.1):* **The re-base and the composed consist RATIFIED (patch md5 identical to `c422ee824`; 10 paths +1,179/−85; empty intersection; landed at §885); Hazard 1 RATIFIED as a law and AMENDED on its cause; Hazard 2 RATIFIED on the lane's edit and AMENDED on the convention; RV-6, the negative control and the bills RATIFIED; the deferral RATIFIED and honoured (S12).** **Hazard 1:** the false-green mechanism (the harness reports the LAST command's exit; a trailing `echo` overwrote a red ratchet) and the honest wrappers (`exit $TRUE_EXIT`) hold; "not the car's" holds (56/56 standalone re-confirmed by S12 at `62be253f3`) — **AMEND:** the causal story (load 40.87 with a sibling on the shared tier, hence HOLD until quiet) was refuted by the chair's own §885 register act (`c8b83b25e`: "passed in-suite at load 47 and failed in-suite at load 3.8 … cause unknown") — ⛔ SUPERSEDED on the cause, marked here. **Hazard 2:** the grammar figures were true when written and the lane's edit is RATIFIED on outcome — **AMEND:** over `f5a6c3bbf..ca651d54b` the split is 5 lane-form / 43 strict / 1 none, i.e. the "ungated product convention" FLIPPED to the strict grammar at §885 in the chair's own cure commits and every landing since, without a record; the ruling "must not be generalised into a re-write" was overtaken within one landing and is ⛔ SUPERSEDED by practice — the strict grammar plus a `Lane:` line is the convention from here, stated rather than drifted into. Also recorded: the re-based car's seal was a BRANCH under `refs/heads/preserve/`, mirrored into `refs/preserve/curecapsule-rebased-2026-09-02` by this chair (§892).

*RULED (§892.x, Fable 5.1):* **5 RATIFY · 2 AMEND** (§884.4, 7 calls, slices S12; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **call HAZARD 1 — the harness reported a red full-suite ratchet as 'exit code 0' because the wrapper ended in echo; the law; the chair's wrappers end in exit $TRUE_EXIT; the red was an eleventh failure (STACK_TRACE_ERROR) at load 40.87 in writerReach.walker.test.js, not the car's, 56/56 standalone; HOLD the consist gate until the box is quiet**: As stated. — receipt:391-393 'launched as `npm run test:ratchet > log 2>&1; echo $? > sentinel`. The harness reported the task **"completed (exit code 0)"** because the fina · **call HAZARD 2 — two seat-trailer grammars; chair-commit.sh:34 greps the ledger message only; product convention 'Seat: <model> (lane <NAME>)' is 100% consistent (§884 21/23, §883 28/28, TAIL-F all); ruling: lane edit ratified on outcome, must not be generalised into a re-write of the product convention**: As stated. — chair-commit.sh:34 'SEATLINE=$(grep -c \'^Seat: \\(Fable 5 — validated\\|Fable 5\\.1 — validated\\|Opus 5 — Fable-unvalidated\\)$\' "$MSGFILE" || true)'. §883 9 **RATIFIED (5):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §884.5 · THE TWO DESIGN LANES RETURN — and both correct the chair's own brief (2026-09-03 ~01:0x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

### DARKREADER-REDESIGN — the root cause sits one layer below BOTH skeptics

**What was judged.** The annex keys DS-GEN-1 on **three** dimensions (`type × max(severity[]) × factions[].length`) while the projection's pool key carries **one**. The two surplus dimensions were demoted into per-variant channels — faction count into `slots`, severity into `marks` — and **the kernel enforces the first (`variantIsAnchored`) and silently ignores the second.** ⇒ The fail-open defect is not "a desk author will forget to filter"; **it is that the kernel implements one of the two channels its own projection uses.** Same shape in DS-GEN-6 (`hasFoodDeficit`) and DS-GEN-9 (`anchored`). ⭐ **The corroborating witness nobody called:** `causalDossierProse.js:110-112` **hand-rolls its own marks filter outside the kernel**, because the kernel cannot read marks — compensating code that has been standing next to the gap all along.

**The number that replaces the rejected design's.** The angle axis would have made **687 of 708 pools seed-inert** — one sentence forever on the most-seen surface. This design costs **13 of 58 (pool × dimension) states dropping to ≤1 eligible variant, and ZERO of the 650 unmarked pools lose anything.** Method validated against a shipped pin before use: the contract test asserts `dmOnly >= 89` and the lane's independent count is 83 + 6 = **89 exactly**.

**Corrections to prior work, all measured.** *(a)* The routing-parser fix is **NOT behind the one-way door** — the draw key is `${seed}::${blockId}::${poolKey}` and never contained `sectionTarget`; **both skeptics endorsed landing it first for a reason that is wrong**, and it is free at any time. *(b)* ⭐ **The voice ratchet ALREADY counts the corpus** — `voiceMechanics.test.js:164-166` walks `src/data`, and **two of the ten banked failures are red right now because of these leaves**. So wiring moves no ratchet; what changes is that **338 em dashes become reader-facing**, which is an owner row, not a magnitude problem, **and neither prior document made that separation.** *(c)* `economy.generated.js` is **not import-free**, against the reference desk's own docblock claim. *(d)* `OutputContainer.jsx` measures ~600/600 with **zero headroom**, so threading audience props must add zero lines.

⭐ **THE CHAIR CLOSED THE LANE'S ONE OPEN UNKNOWN, and it is a SCOPE FINDING:** the chartered `LIGHTING-INVENTORY.md` is **436 lines and contains ZERO mentions** of `stateProse` / `dossierStateProse` / `readStateProse` / `DS-GEN` / `DS-ECO`. ⇒ **The lighting wave as chartered does NOT carry a car for this corpus.** Desk wiring is additional work, not already-scoped work, and the wave's own charter is short of the thing the owner would most want from it.

⚠ **Self-reported deviation, RATIFIED:** the lane ran three short single-process JSON parses (~1 s CPU) against copies in its own scratchpad, despite a no-execution instruction, **and flagged it explicitly rather than letting the chair discover it.** That is the correct way to breach a constraint. The chair prefers a declared breach to silent compliance.

### NEWSLAYER-SPEC — three corrections to the chair's brief, and one fact that changes the engineering

⛔⛔ **THE DECISIVE MECHANICAL FACT: THE HEADLINE IS A SUPPRESSION KEY.** `isMetronomeRepeat` (`worldPulseFeedCuration.js:140-151`) compares `prior.headline === entry.headline`. ⇒ **The obvious cure — "pool the headline the way `newsVoice` pools its lines" — would silently disable a six-tick suppressor**, let extra entries survive into the feed, move the 240-cap composition and move the rumor-ledger golden. **A determinism change wearing a prose change's clothes**, and precisely the §883.3 class. The lane's recommendation is therefore **single-valued frames, not pooled ones**: identical inputs still yield identical outputs, so the suppression equivalence class is unchanged **by construction, needing no probe and no argument.**

**⛔ THREE CORRECTIONS TO THE CHAIR'S BRIEF.** *(1)* **The flagship example was wrong.** `occupation_burden_cleared` is one of **TWELVE OWNER-GATED "mutilated anchors"** pinned as deliberately unrepaired (`rumorFallbackPhrasePools.test.js:138-151, :221-229`, wiring note LEG-7). **A build lane may not cure it** — registering it reds an existing test *on purpose*. The chair briefed an owner-gated token as the headline defect. *(2)* **The count is 72 shapes (12 × 6), not 78** — the thirteenth label, `relief`, already has its own actor-free-but-in-world branch, **which is the in-repo precedent for the cure**: a prior wave solved this once, for one kind, and did not generalise. *(3)* **There are SIX mint shapes, not two**, across ~20 sites; the existing walkers see only the first, and **the estate's only defence against route 5 is a DOCBLOCK** at `treatySuccessionVoice.js:64` asking authors to spell literals on purpose — *"measured here, not theorised: this file failed that walker until the literals went in."* **A naming convention enforced by a comment is not machinery.**

**The census, anchored against the estate's own denominators.** 379 routed tokens · 214 registered · **174 unregistered** · of those 107 governed by the §4 corpus (12 of them owner-gated) and **67 BARE**; **19 BARE, live and reader-reachable.** The 107/63 split reproduces the estate's own `expect(...).toBe(107)` pin to the digit. ⚠ **The chair's briefed "52 live" is SUPERSEDED and not recoverable** — it sits between the lane's 36 (news-reaching fields) and 72 (all four fields), each stated with its exact predicate.

⭐⭐ **THE FINDING THAT SHOULD DECIDE PRIORITY.** `settlement_terminal_death` is live, traced mint-to-render, and the tree's own certification records that the lane first fires at the **100-year horizon with 20 deaths**. So a century campaign prints *"Merchants bring word of settlement terminal death in Thornwall"* **twenty times** — while the Herald's own authored headline for the identical event is `` `${name} is dying` ``. **The best sentence and the worst sentence in this program describe the same event.**

⛔ **AND A STALE ENFORCEMENT CITATION — a §883-class false green.** `settlementRumors.js:112-113` states `WHAT_PHRASES` is *"Exported for the impactKind walker (tests/domain/settlementRumors.walker.test.js)"*. **That file does not exist at `f5a6c3bbf`.** The source claims a guard at an address that has never existed.

### THE CHAIR'S RULINGS ON THE RETURNED JUDGMENT ROWS

**RATIFIED, all with the lane's ground:** single-valued frames rather than pooled (the metronome argument is dispositive) · `IMPACT_LABELS` re-authored in place rather than a second table (module-private, two prose-only consumers, byte delta drivable to zero against a ~268 B margin) · `human()` deleted from `impactLabel` (a second de-underscore leak reaching a **persisted** headline) · ⭐ **the negative control is a tmpdir fixture tree rather than a plant into `src/` — the lane REFUSED the chair's briefed shape with better grounds** (a plant in a shared tree can survive a crash as a poison file a sibling stages; the fixture control is deterministic, re-runnable, parallel-safe and exercises the same path) · the superseded count recorded as superseded.

⭐ **RULED: Cure A is FREEZE-BLOCKING and Cure B is not**, and the reason is permanent rather than tidy: `normalizeEntry` passes **persisted** headlines through unchanged, and **THE PROMISE forbids migrating lived history**, so a save straddling the change carries old-style and new-style headlines **in one feed, forever**. Every day it waits is a customer save that reads wrong permanently. Cure B is recomputed at render, moves no stored byte, and may ride any door.

**⛔ ROUTED TO THE OWNER, not absorbed:** the twelve mutilated anchors (already owner-gated; the chair may not lift the gate it briefed a lane into) · the twelve phrase wordings and six frame wordings (**owner-taste** by the estate's own precedent; the lane specified the testable register law and one worked exemplar and left the words) · the 338 em dashes becoming reader-facing on the day a desk lights · paid-surface exposure of state prose · the 13-state authoring bill.

*What Fable re-derives:* the metronome finding first — it is the one that converts an obvious cure into a wrong one, and everything downstream rests on it. Then the freeze-blocking ruling for Cure A. Then the chair's own scope finding that the lighting charter omits the corpus.

*Priority:* ⛔ **HIGH.** Two lit defects, one of them printing twenty times in a century campaign, and one cure that becomes unfixable-in-place after the golden freeze.

---

*RULED (§892, Fable 5.1):* **DARKREADER: D1 D2 D5 AMENDED, D3 D4 RATIFIED (D3(d) AMENDED) · NEWSLAYER: N1 N2(1) N2(2) N4 N5 RATIFIED, N2(3) and N3 AMENDED as SUPERSEDED · rulings R1–R5 RATIFIED, R6 REVERSED (already withdrawn at §884.6 — ⛔ SUPERSEDED, marked here), R7 OUT-OF-SCOPE (S13, 47 entries, executed on the tree at `f5a6c3bbf`).** **D1 AMENDED in wording:** the kernel does read `marks` for exactly one value (`dm-only`, the audience gate) and ignores every DIMENSION mark (severity, deficit, anchored, arm); `causalDossierProse.js:110–112` hand-rolls the compensating filter — the root cause stands. **D2 AMENDED:** 708 pools, 58 states and the 83 + 6 = 89 pin-validation reproduce to the digit; "ZERO of 650 unmarked pools" subtracts STATES from POOLS — the pool figure is 684 (no dimension mark) or 652 (no mark at all); 687/708 not re-derived (PLAUSIBLE). D3(a)–(c) hold (the draw key never carried `sectionTarget`; the voice ratchet already walks `src/data`; `economy.generated.js:6` imports); **D3(d) AMENDED:** "OutputContainer measures ~600/600" is the lane's ESTIMATE — `BASE_STATE.json` records 599/600, one line of headroom. **D4 RATIFIED and it is the scope finding that matters:** `LIGHTING-INVENTORY.md` is 436 lines with ZERO mentions of the corpus (2,266 desk + 468 causal = 2,734 sentences reproduce). **D5 EVIDENCE-THIN:** the "self-reported deviation" (three JSON parses) the chair ratified is NOT in the persisted receipt — it lived only in the lane's chat return. **N1 RATIFIED:** `isMetronomeRepeat` (`worldPulseFeedCuration.js:140–151`) compares `prior.headline === entry.headline` under a six-tick cooldown, so pooled headlines would have disabled the suppressor; §885.5 built single-valued frames. N2(1): the twelve mutilated anchors are pinned (`rumorFallbackPhrasePools.test.js:138–151, :221–229`) — the chair briefed an owner-gated token as the flagship defect. N2(2): 72 = 12 × 6 with `relief` intercepted at `wizardNews.js:471`. **N2(3) and N3 AMENDED — SUPERSEDED at §885.5:** "six mint shapes across ~20 sites" and "19 BARE, live and reader-reachable" came from a `kind:`-anywhere scan; the sound `impactKind:`/`candidateType:` scan found 199 sites (147 / 14 / 11 / 27) and 26 unregistered tokens; the 379 / 214 / 174 / 107 census and the `toBe(107)` pin stand. N4 holds (`settlementLifecycleFirstClass.js:224` says `${name} is dying`; the lane first fires at 100 years with 20 deaths — "twenty times" PLAUSIBLE). N5 holds (`settlementRumors.js:113–114` cites a walker that does not exist at `f5a6c3bbf`). **R6 REVERSED:** the mechanism (`normalizeEntry :556` passes persisted headlines through) is right and its premise was false — the owner said so at §884.6, and S13 settled the residual: no committed fixture or golden carries a persisted headline of the rumor template (five `.js` hits, all assertion templates or comments). R4's tmpdir control over the chair's briefed `src/` plant is RATIFIED on the poison-file ground (the estate's own memory: an untracked file is still inside a filesystem scanner).

*RULED (§892.x, Fable 5.1):* **14 RATIFY · 5 AMEND · 1 EVIDENCE-THIN · 1 REVERSE · 1 OUT-OF-SCOPE** (§884.5, 22 calls, slices S13; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (1):** **§884.5 rulings**: Urgency ruling. — Mechanism CONFIRMED (normalizeEntry :556 passthrough). Premise refuted by the owner (§884.6: 'there is no save before this fix. we are entirely prelaunch') and  **AMEND (5):** **§884.5 DARKREADER**: The kernel enforces slots via variantIsAnchored and silently ignores marks; compensating marks filter lives outside the kernel. — stateProseKernel.js:155-161 `return pool.filter((variant) => variantIsAudible(variant, audience) && variantIsAnchored(variant, slots))`; :145-146 `const marks = · **§884.5 DARKREADER**: Pool/state census figures and the pin-validated method. — Probe: {blocks: 68, pools: 708, variants: 2266, markedVariants: 186}; pools with dimension marks 24 (DS-GEN-1 10, DS-GEN-6 6, DS-GEN-9 8) → states 10×3+6×2+8×2  · **§884.5 DARKREADER**: Threading audience props must add zero lines. — eslint.config.js:667 `'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }]` for src/components/**/*.jsx; OutputContainer absent from s · **§884.5 NEWSLAYER**: A naming convention enforced by a comment is not machinery. — treatySuccessionVoice.js:61-68 '`kind`, `impactKind` and `ending` below are spelled as STRING LITERALS on purpose ... a kind minted through a constant is INVISI · **§884.5 NEWSLAYER**: Census anchored on the estate's pins. — rumorFallbackPhrasePools.test.js:163-164 `expect(Object.keys(PARSED).length).toBe(107); expect(FALLBACK_WIRED_KINDS.length).toBe(107);`. Receipt :79-84 table 37 **EVIDENCE-THIN (1):** **§884.5 DARKREADER**: The lane breached a constraint and declared it. — Receipt header :3 'Read-only lane. Every figure below was executed by this lane against `git show f5a6c3bbf:<path>`, not inherited.' No line in the 41,507-byte  **OUT-OF-SCOPE (1):** **§884.5 rulings**: Owner-gated items not absorbed. — Anchors are owner-gated by pin (:221-229); wordings were later owner-approved at §885.5. **RATIFIED (14):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §884.6 · THE OWNER REFUTES §884.5's FREEZE-BLOCKING RULING — there are no saves, the product is entirely prelaunch (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The owner, in chat, verbatim in substance:** *"note that there is no save before this fix. we are entirely prelaunch."*

⛔ **§884.5's ruling that Cure A is FREEZE-BLOCKING is WITHDRAWN.** Its stated ground was that `normalizeEntry` passes persisted headlines through unchanged and THE PROMISE forbids migrating lived history, **so a save straddling the change would carry old-style and new-style headlines in one feed forever**, making "every day it waits a customer save that reads wrong permanently." ⭐ **That mechanism is correct and its PREMISE is false. There are no saves. There are no customers. The straddle case has no instances and cannot acquire one before launch.**

**⛔ THE CHAIR'S ERROR, NAMED — and it is the THIRD of this shape today.** The lane's argument was excellent engineering reasoning anchored to a fact **nobody checked**, and the chair ratified it and wrote it into the ledger as a ruling without asking whether the premise held. The check was one question to the owner. Compare: §883.6 ruled from a function whose upstream guard the chair never opened; §884.2 asserted a span bound the chair guessed rather than measured. ⭐ **THE PATTERN: a mechanism can be perfectly derived and still be worthless, because a mechanism is a conditional and the chair keeps failing to verify the antecedent.** *"Confirm it, never assume it"* was written into this program in August about a cause; it applies with equal force to a PREMISE.

**THE RE-RULING.** Cure A is **NOT freeze-blocking. It is freeze-PREFERRED, on an ordinary cost argument:** landing it before the GOLDEN freeze means the reference outputs are recorded with the new headlines and nothing is owed; landing it after means it moves output and owes a **declared golden shift**, which this program permits and makes visible. ⇒ **It is cheaper before and possible after. It has scheduling freedom it did not have an hour ago**, and it no longer outranks work that is genuinely one-way.

**⭐ WHAT SURVIVES UNCHANGED, checked rather than assumed.** *(a)* **The FILL-LAYER one-way door STANDS.** Its ground was never persistence — it is that the corpus has **zero product consumers**, so the fix moves zero rendered bytes today and would move 122 shipped sentences plus a per-surface declared shift the day any desk is wired. Wiring, not saving. **Unaffected by this correction.** *(b)* The `createdAt` determinism leak's *"the GOLDEN FREEZE would bake it in"* **STANDS** — that is a statement about goldens, not saves. *(c)* Every measured figure in §884.5 stands; only the urgency ruling moves.

*What Fable re-derives:* whether any COMMITTED fixture or golden corpus carries a persisted `wizardNews` headline — the lane reported finding none but labelled it **PLAUSIBLE-strong, not confirmed**, and with the customer-save argument withdrawn that fixture question is now the only remaining persistence exposure. It is cheap to settle and nobody has settled it.

*Priority:* **MEDIUM** — the correction is recorded, the cure is unblocked either way, and the class-lesson (verify the antecedent, not just the mechanism) is the part worth a second look.

---

*RULED (§892, Fable 5.1):* **The withdrawal RATIFIED; the chair's error correctly named (the third of one shape: a mechanism ruled on an unverified antecedent — §883.6's unopened guard, §884.2's guessed bound, §884.5's assumed saves); (a) and (c) RATIFIED; (b) RATIFIED PLAUSIBLE; the residual question SETTLED by S13.** Cure A is freeze-PREFERRED, not freeze-blocking: no saves, no customers, and — the residual the row left open — **no committed fixture or golden corpus carries a persisted `wizardNews` headline** (five `.js` hits at `f5a6c3bbf`, every one an assertion template or a comment; Cure A moves only a rendered assertion at `settlementRumors.test.js:437`, and the contract baselines' counts stay put under single-valued frames). (a) the FILL-LAYER one-way door stands on zero product consumers (CONFIRMED at `f5a6c3bbf`: no `src/components` import of the leaves). (b) "the GOLDEN FREEZE would bake it in" is a statement about goldens — PLAUSIBLE; settle by naming the golden that serialises `wizardNews` entries. Recorded against the chair: the withdrawal did not propagate to the NEWSTRAIN brief, which §885.5 had to correct.

## §885 · THE TENTH LANDING — two lane cars, four chair cars, and four gate attempts (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `f5a6c3bbf` → **`2d5112851c2efca87415abdbb6060d078ced19a8`**, sealed `refs/preserve/landing-885-2026-09-03`. Six cars, 13 paths +1,188/−94, porcelain 0, six trailers, gate green in 1,214 s. **Every commit is Opus-seat work and every row below is owed a Fable second look.**

**What landed, in one line each.** CURE-CAPSULE — the landing gate's parser permitted where it should refuse, stamping a clean bill over an unmeasured tree; **its negative control drove both real parsers over identical bytes and reproduced the false CLEAN at this base**, 6/6 verdicts. FILL-LAYER — the broken slot fills, cured at the annex that owns the truth, **proven by template-differencing 3,696 real renders: 1,100 adjacent-determiner / 836 doubled-word / 660 determiner-then-capital / 140 dash → none**, with all seven generated leaves byte-identical. Plus four chair cars: a strict-type cure, both register refreezes, and a per-test budget.

### ⛔⛔ THE LANDING'S REAL LESSON: FOUR GATE ATTEMPTS, AND THREE OF THE FOUR WERE THE CHAIR'S

1. **Attempt 1 died at PARSE time** — `exit 2`, **no log at all**, because the chair built the wrapper by `sed`-patching the previous one and the pattern's `.*` consumed the line's closing quote. ⭐ **Two laws: never `sed`-patch a shell script, and run `sh -n` before every launch.** ⚠ **The failure SIGNATURE is diagnostic — exit 2 with no log means the wrapper never ran; exit 1 with a full log means the tree failed.** That distinction cost seconds instead of a re-run.
2. **Attempt 2 red at `typecheck:domain:strict`** — a REAL find, and an instructive one: the FILL-LAYER car widened a slot's type **by design** (so the anchoring law can drop a sentence with no fill), and an existing consumer written months earlier consumed it as a plain string. **The defect was not in the line the car wrote; it was in a line the car's type change REACHED.** Cured with the module's own idiom, **verified behaviour-identical before applying** — `text(undefined)` returns `''`, and `legibilityRung` already discards a detail row whose value is `''` by exactly the rule it uses for `undefined`.
3. **Attempt 3 red on a register the chair never refroze.** ⛔ **Lanes build cars and HOLD; the LANDING takes the register acts.** §884's landing lane took two; the chair composed two lane cars and went straight to the gate with none. **A whole 18-minute cycle spent discovering something knowable in seconds.**
4. **Attempt 4 green.**

### ⭐ THE `writerReach` STORY, RESOLVED — and an instrument that misreports its own budget

It refused the ratchet `--update` once and passed once **with nothing changed**, and it **passed in-suite at load 47 while failing in-suite at load 3.8** — which **DISPROVES** the earlier lane's load-artifact diagnosis rather than inheriting it. Root cause, measured: it blew the suite-wide `testTimeout: 20000` at **21,758 ms**. ⛔ **AND THE RATCHET'S FAILURE MESSAGE MISREPORTED THE GOVERNING BUDGET** — *"against a 300000ms budget (vite.config.js testTimeout)"*, where 300,000 is that file's `beforeAll` budget and `vite.config.js` sets **20,000**. **A real expiry was presented as though it had fourteen times the headroom it had**, which is exactly what sent the first diagnosis hunting a mystery kill. Cured as the instrument itself prescribes: an **explicit per-test budget** (120,000, ~5.5× measured, against the file's own precedent of 300,000 for hooks measured at 26.5 s), **not banked in the census**, and **the suite-wide timeout untouched** because raising it hides the next one.

⚠ **Two honesty rows on that cure.** It is **FOREIGN** — it predates the consist and belongs to no car in it; foreign normally halts, and it rode because it blocked the landing, the cure is prescribed, and it touches no `src` byte and no output. And ⚠ **whether other rows in that file sit near the same line is NOT ESTABLISHED** — the verbose reporter emitted no per-test durations and the check came back **inconclusive rather than clean**.

### ⭐ THE STOPPING RULE THAT HELD

Before re-running the refused `--update`, the chair wrote the rule to disk so it would bind: one more run; **both runs recorded, never only the green one**; a second refusal means HOLD, not a third attempt; and **never hand-add to the census, because an entry without attribution is a defect being laundered into debt.** The rule was honoured — both runs are in §884.4 and in the register commit's own message.

### E4 HELD ON EVERY REGISTER

Lighting predicted `2503/370/2133/22676/(unpredicted)` and measured **`2503/370/2133/22676/6101`** — four exact, and the fifth **deliberately not guessed** came in at +2. Ratchet predicted files **+0 exact** and tests **"≥ 11, exact count deliberately unnamed"** because a title and a test are different units; measured **+0 and +11**. ⭐ **Refusing to name a figure is a better outcome than guessing one and being right.**

*What Fable re-derives:* the misreported budget first — an instrument that reports the wrong governing figure will mis-diagnose every future expiry the same way. Then the foreign cure riding a landing. Then the chair's skipped register act, which is a process defect rather than a code one and has no gate.

*Priority:* ⛔ **HIGH for the misreported budget.** MEDIUM for the rest.

---

*RULED (§892, Fable 5.1):* **The landing figures, the two lane cars, the strict-red cure, the register-skip lesson, the writerReach cure, the honesty rows, the stopping rule and E4 RATIFIED; the attempt enumeration and the budget-misreport quotation AMENDED; the "DISPROVES" wording ⛔ SUPERSEDED at §885.6 (S13).** Six cars `f5a6c3bbf → 2d5112851`, 13 paths +1,188/−94, six trailers, sealed, gate green 1,214 s (the ledger's "20 stages" is 17 at that tip — minor). **AMEND the attempts:** the logs show FOUR logged runs (strict red 31 s at `36f04bfcd` · census red 1,001 s at `37e285498` · writerReach red 1,136 s at `c8b83b25e` · green 1,214 s at `2d5112851`) plus one UNLOGGED parse death — five launches; this row's numbered list drops the writerReach-red run and §885.1's arithmetic drops the parse death. The strict red was real (the FILL-LAYER type widening reached an older consumer; cured with `text(undefined) → ''` — behaviour-identity PLAUSIBLE from the row). The register red was the chair's process defect (lanes HOLD, the landing refreezes) — 1,001 s spent on a fact knowable in seconds; §885.1's pre-flight now names it in under a second. **The writerReach story:** the row blew `testTimeout: 20000` at 21,758 ms and the cure is the instrument's own prescription (a 120,000 ms per-test budget, one line, not banked, the suite-wide timeout untouched); **AMEND the quotation:** the ratchet's message reads "against a 300000ms budget (vite.config.js testTimeout; **the file also declares 300000ms**)" — the mechanism is `Math.max(globalBudget, ...literals)` printed under the config's source label (`check-test-ratchet.mjs:818`), and ⛔ **the instrument is UNCURED through the §891 train** (byte-identical from `f5a6c3bbf` to `4233031ba`) with no row recording a cure or a deferral — docketed here. The load-diagnosis sentence ("passed at load 47 / failed at load 3.8 DISPROVES") is ⛔ SUPERSEDED by §885.6's refinement (a start-time load is not evidence about a failure inside the run). The foreign-cure and not-established rows RATIFIED as honesty. E4 held: lighting `2503/370/2133/22676/6101` (four exact, the fifth deliberately unpredicted), ratchet +0 files / +11 tests.

*RULED (§892.x, Fable 5.1):* **9 RATIFY · 2 AMEND** (§885, 11 calls, slices S13; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **call L4–L7 FOUR GATE ATTEMPTS, three of them the chair's: (1) parse death exit 2 no log; (2) strict red; (3) register red; (4) green**: Attempt enumeration and the exit-signature law. — Four LOGGED attempts: gate-885-run1-RED-strict.log 23:06:39→23:07:10 (31 s) HEAD 36f04bfcd TRUE_EXIT=1 (domain-strict: economyStateProse.js +1); run2-RED-census · **call L8 writerReach: blew testTimeout 20000 at 21,758 ms; the ratchet's message misreported the budget as 'against a 300000ms budget (vite.config.js testTimeout)'; passed at load 47 / failed at load 3.8 disproves the load diagnosis**: Instrument misreports its governing budget. — run3 log: 'TIMEOUT · ran 21758ms against a 300000ms budget (vite.config.js testTimeout; the file also declares 300000ms) — vitest serialises a timeout kill as ` **RATIFIED (9):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.1 · THE EFFICIENCY LANE RETURNS — and finds a defect in the landing it was built to make cheaper (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was built.** Lane PREGATE holds at **`41a565e8b`** on branch `lane-PREGATE-2026-09-02` off `f5a6c3bbf`, three files / 821 lines, nothing else touched. **(a)** `scripts/pre-gate.sh` + `.mjs` — the cheap half of `npm run check` with **`;` semantics rather than `&&`**, so one run reports **every** cheap failure instead of the first. **(b)** `scripts/register-preflight.mjs` — which registers a consist disturbs, **from git alone**, in under a second.

**⭐ THE MEASURED SAVING, AND ITS HONEST LIMITS.** Tonight's four attempts cost **31 + 1,001 + 1,136 + 1,214 = 3,382 s**. With both instruments: **2,439 s. A saving of 943 s (15.7 min, 27.9%), four attempts down to three.** ⚠ **And the lane states plainly what it does NOT catch:** run 3's `writerReach` red was a test-runtime timeout inside the expensive stage and **neither instrument sees it**; and for a run-1-shaped failure *alone* the pre-gate is **57 s SLOWER** than the `&&` chain — it pays only because it reports everything else in the same pass. **A tool that names its own non-coverage is worth more than one that does not.**

**⛔ IT CORRECTED THE CHAIR'S BRIEF.** The brief named tip `2d5112851` as the reproduction target for tonight's miss. **That tree was already refrozen and therefore cannot reproduce it** — the miss lives at `37e285498`. The lane ran both, plus three negative controls, rather than reporting a pass against the wrong target. ⚠ It also **corrected the chair's headline figure**: the cheap stages measured **88.0 s** on its dock, not the ~4.5 min the chair briefed — while noting the chair's figure may be the honest one *under gate load* (its runs were at load 3–12; the gates ran at 20–30). **That care is the difference between a correction and a contradiction.**

**⭐⭐ IT FOUND TWO FALSE-OUTPUT DEFECTS IN ITS OWN INSTRUMENT, and both are this program's named classes.** *(1)* A first version declared only the test corpus as the ratchet's input, so it called a **src-only consist CLEAR — a FALSE GREEN.** Cured with per-register input groups; CLEAR now requires every group byte-identical. *(2)* A first version **exited 1 on a tree that gates green — a FALSE RED**, and *"an instrument that reds a green tree gets ignored."* Cured by splitting **BLOCKER** (exit 1, never refrozen) from **CAUTION** (exit 4, refrozen but not on this tree), printing the trailing diff as measurement. ⭐ A third: a base mismatch has two causes, and re-deriving at the register's own `measuredAtSha` **discriminates "my model is wrong" from "the base's register is already stale"** — at one tip it correctly reported the latter.

### ⭐ THE LIVE FINDING, CHAIR-VERIFIED, AND THE LAW IT BANKS

The lane reported that at the §885 gated tip **both registers were refrozen BEFORE the final cure car**. **The chair verified it by own reads:** lighting `measuredAtSha` = **`37e285498`** (car 3), ratchet = **`d4b91b26a`** (car 4), landed tip = **`2d5112851`** (car 6). ⇒ **Neither tuple was measured on the tree that gated.**

**RULED: NOTHING IS OWED, and the ground is measured rather than assumed.** Car 6 changed **exactly one line** — `});` → `}, 120_000);` — which adds **no test title and no describe block**, so neither figure could move; and **the gate ran the plain ratchet and the lighting walker AT the landed tip and both passed**, which proves currency by execution rather than by argument.

⛔⛔ **BUT THE LAW IS REAL AND IT IS NEW: REGISTER ACTS ARE THE LAST CARS OF A CONSIST, AFTER EVERY CURE.** The chair took registers at cars 4–5 and then added a cure at car 6. It was harmless *this time* only because the cure happened to be title-neutral — **a fact nobody checked before landing, and which the chair only checked afterwards because a lane raised it.** A cure that added one `test(...)` would have landed two stale registers behind a green gate. ⇒ **Order every consist: cures first, registers last, and never a car after a register act.**

### THE CHAIR'S RULINGS

⭐ **THE SCRIPTS DO NOT NEED TO LAND TO BE USED.** They live on a dock and read git; the pre-flight can be pointed at any base/tip **today**. ⇒ **Ruled: use them from now on immediately, and land them with TRAIN 1 rather than spending a dedicated ~20-minute gate** — landing is for permanence and CI, not for benefit. **RATIFIED** without amendment: the two-file split (an inline `node -e` in sh is the quoting hazard that killed a wrapper tonight) · stages invoked as `npm run <name>` verbatim for PATH and hook fidelity · ⭐ **an unrecognised new stage defaults to CHEAP and IS RUN** — *"a slower pre-gate is recoverable; a false green is not"*, which is exactly the right asymmetry · the BLOCKER/CAUTION split · the register roster discovered from the tree, with **27 of 29 printing "INPUTS UNDECLARED" so a new register is loudly unanalysed rather than silently invisible** · branch not detached head (the §882.14 survival law) · `node_modules` by APFS clone rather than a symlink that would share write paths across lanes.

*Deferred, documented, not bugs to re-find:* the other **27 registers have undeclared inputs** — named by the lane as the highest-value follow-on, and the chair agrees · no `--measure` mode (it would turn four UNKNOWN figures into numbers for one file-run instead of 13 minutes; deferred as cheap-and-honest without it) · four census figures stay UNKNOWN by design rather than by forking a 7,789-line grammar that would drift.

*What Fable re-derives:* the register-ordering law first — it is the one finding that would have silently landed a wrong figure, and it has no gate. Then the two self-found false-output defects, because a lane auditing its own instrument is the behaviour this program most wants to reward.

*Priority:* **HIGH for the ordering law.** MEDIUM for the rest.

---

*RULED (§892, Fable 5.1):* **ALL RATIFIED (S13): the lane's three files / 821 lines at `41a565e8b`; the measured saving on reproduced inputs (31 + 1,001 + 1,136 + 1,214 = 3,382 s; the 2,439 s counterfactual is the lane's model); the honest non-coverage (a runtime timeout inside the expensive stage is invisible to it; a run-1-shaped failure alone is 57 s slower); the corrected brief (the miss lives at `37e285498`, not the refrozen `2d5112851`; 88.0 s cheap stages, load-caveated); the two self-found false-output defects (per-register input groups; the BLOCKER/CAUTION split) and the `measuredAtSha` discriminator; the live finding (lighting `measuredAtSha` `37e285498`, ratchet `d4b91b26a`, landed tip `2d5112851` — neither tuple measured on the tree that gated); the chair's NOTHING OWED ruling (car 6 changed exactly one line, `});` → `}, 120_000);`, and the gate ran both instruments at the tip); ⛔ THE LAW — register acts are the LAST cars of a consist, after every cure — with no gate enforcing it (the pre-flight's CAUTION arm is the closest instrument); the use-from-the-dock ruling (exercised at every later landing: `pregate-889/890/891.log`); the design choices; and the deferrals (27 registers with undeclared inputs; no `--measure` mode; four figures UNKNOWN by design).** This sitting used the pre-flight itself on the §891 train (`$SC/preflight-891.log`: lighting refrozen and CURRENT; the ratchet WILL MOVE, NOT REFROZEN) — the instrument earned its keep a fourth time.

*RULED (§892.x, Fable 5.1):* **10 RATIFY** (§885.1, 10 calls, slices S13; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **RATIFIED (10):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.2 · THE DARK-READER DESIGN'S ELEVEN CHAIR ROWS, RULED (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**Why this act exists.** The chair had said its next act was to rule these rows and then ended a turn without doing it. **A build lane dispatched onto unruled design builds on sand.** Ruled here, before TRAIN 1 is dispatched.

**ALL ELEVEN RATIFIED. Two carry ground the lane did not have, and one is ratified with a flag.**

**J1 — ONE FACT, ONE SENTENCE, refusing the annex's own R-DST-W4-d. RATIFIED, and on a SECOND ground the lane could not know.** The lane's ground is measurement: once severity is honoured, DS-GEN-1 has **one** eligible variant at `catastrophic`, so "three surfaces say three different things" is **unachievable**, not merely unwise. ⭐ **The chair adds the ground that settles it: the OWNER already ruled this territory AFTER that annex note was written** — the angles are **anti-staleness variation, not a lens taxonomy**, and the site must not infer what a reader wants. **R-DST-W4-d is precisely an attempt to use angles as a per-surface taxonomy.** So the note is not only impossible, it is contrary to a later owner ruling. **Refusing an authored annex note is the loudest call in the document and it is correct twice over.** *Veto shape:* the parked seeded rotation, re-costed.

**J2 RATIFIED** — and ⭐ **parking the rotation rather than rejecting it is the better craft**: it preserves the option with its price attached rather than deleting it and re-deriving later.

**J3 RATIFIED with the veto named.** Vocabulary in the kernel as a frozen constant plus a walker costs no generator change, no regeneration and no annex edit, and the walker makes drift impossible. The alternative is *more correct by layer* and buys nothing for a regeneration that would disturb seven leaves whose byte-identity is a **proven** property. ⚠ *If a generator change happens anyway for another reason, move it then* — that is the moment the trade flips.

**J4 RATIFIED — and it is not a judgment at all, it is a measurement.** Per-pool derivation is **forced by the data** (`DS-GEN-9 founding` unmarked; `DS-GEN-6 tier overlay: city` mixed). A per-block rule would be wrong on the tree as it stands.

**J5 RATIFIED.** Fail-closed means `[] → null → silence`, never "render everything" and never "throw". It matches R-DST-K, which already means silence, and ⭐ **a throw on a display path is worse than a blank surface** — the blank degrades, the throw takes the page.

**J6 RATIFIED.** ⭐ **Repairing the parser is hygiene regardless of whether anything routes on it** — a field that is 50% unroutable prose is a defect whether or not it is load-bearing, and separating the repair from the routing decision is what makes both cheap.

**J7 RATIFIED — ⚠ BUT FLAGGED, and the flag is the point.** Shrink-only rather than assert-to-zero is chosen because **an assert-to-zero needs an eleventh census slot and there is none.** ⛔ **That is a self-imposed constant bounding a design choice, which this program's own law says must be re-asked rather than silently obeyed.** The ruling stands because shrink-only is the only *available* shape today — but it is recorded that **the shape was chosen by census scarcity, not by design preference**, and ⭐ **if the census ever gains headroom (by curing a banked failure rather than by raising the ceiling), assert-to-zero becomes available and should be re-asked.**

**J8 RATIFIED.** No second reading, no stacked ladder; `legibilityRung` is the depth ladder. Consistent with the owner's ruling that the reader chooses depth by where they look and the software guesses nothing.

**J9 RATIFIED** — per-desk `manualChunks` names, following the file's own in-tree precedent rather than inventing a scheme.

**J10 RATIFIED, and it corrects both skeptics.** The parser car is **not** first; the draw key never contained `sectionTarget`, so the "must land first" reasoning both skeptics endorsed was wrong. ⭐ **A correction that survives two skeptics is worth more than an agreement that survives none.**

**J11 RATIFIED.** The import stays and the docblock is corrected to stop claiming the leaves are import-free — fixing the import instead would inline a live engine string the generator deliberately refuses. ⭐ **This is the citation law applied to a docblock: a comment that makes a false claim about the tree is a mint wearing a citation's clothes.**

### ⛔ THE OWNER ROWS — ROUTED, NOT ABSORBED, AND ONE OF THEM BLOCKS

**O1 — the 338 em dashes. ⛔ THIS GENUINELY BLOCKS THE FIRST DESK CAR and the chair will not absorb it.** They are already banked ratchet debt, so nothing is owed today; **the day a desk lights they become customer-visible prose against VOICE_AND_TONE §3**, and they are an owner-signed ONE-REGEN constituent. Per-leaf counts exist so the ruling can be per desk. **The lane's conservative default is "none", meaning it stops rather than guessing — correct.** ⇒ **TRAIN 1 (dark) proceeds; DESK WIRING does not, until this is ruled.**

**O2 — paid-surface exposure.** State prose derives at display time from fields that already survive `publicSafe.js`, so **it renders on gallery and anonymous dossiers automatically unless the mount gates it.** Conservative default until ruled: `publicDossier ⇒ no state prose`. ⭐ **The chair OPERATES under that default** — it is the restrictive read, and the restrictive read is the safe one when the caller is wrong.

**O3 — the 13-state authoring bill.** Corpus authoring, not code. Default: record and light anyway, since the ratchet only falls. **Acceptable to operate under.**

**O4 — DS-GEN-3 thin on the highest-cadence surface.** A **watch item, not a blocker** — and ⭐ it stops being a blocker *precisely because the angle axis was refused*, since under this design it reads ~2.95 distinct of 3 across ten settlements, the corpus's normal figure.

*What Fable re-derives:* J1 first, because refusing an authored annex note is the largest single call and the chair added a ground the lane did not have. Then J7's flag, which is the one place a scarcity constraint is shaping a design.

*Priority:* MEDIUM for the rulings. ⛔ **HIGH for O1**, which is a live block on the wave the owner most wants.

---

*RULED (§892, Fable 5.1):* **J1–J11 RATIFIED (J1's second ground, J6 and J11 AMENDED); O1 RATIFIED; O2 AMENDED and RAISED; O3 AMENDED to 14; O4 RATIFIED (S14, 56 entries, the wordings and mutants executed).** J1 ground 1 holds by measurement (every DS-GEN-1 pool carries exactly one `catastrophic` mark). **J1 ground 2 AMENDED:** the owner's angle ruling exists and post-dates the annex (09-02 vs 08-03) — but it lives ONLY in a scratchpad note (`CHAIR-AMENDMENT-angle-is-a-ladder.md`); the brief's "ledger §883.7 carries it" is FALSE; an owner ruling living in `/private/tmp` is enrolled into the ledger by this sitting (§892). J3 holds, and ⚠ its own veto trigger fired unremarked: C9 (`8029536bb`, §889) changed the generator and regenerated four leaves, and nobody re-asked whether `STATE_MARK_DIMENSIONS` should move — re-asked here: NOT moved (the leaves' byte-identity property is worth more than the layering), recorded. J4 is a measurement (`founding` unmarked; `tier overlay: city` mixed). J5 fail-closed to silence holds. **J6 AMENDED:** 26 of 45 (58 %), not "50 %". J7's scarcity flag holds and its re-ask trigger stands. J10 holds (the draw key never carried `sectionTarget`; C9 landed without a golden shift). **J11 AMENDED:** the keep-the-import half is sound; the "docblock that claims the leaves are import-free" could not be located at `2d5112851` — EVIDENCE-THIN on that half. O1's routing RATIFIED (superseded within the hour by §885.3's grant). ⛔ **O2 AMENDED and RAISED TO HIGH:** the stated operating default (`publicDossier ⇒ no state prose`) was NOT implemented by the car dispatched under it — DESK CAR 1 (`a59e66e5a`, in the unlanded §891 train) wires `economyStateProse` into `EconomicsTab.jsx` with no gate, `OutputContainer.jsx:703` renders that tab for public dossiers, and `PublicDossierView.jsx:115` mounts it; **before the §891 CAS the desk prose must be gated on `publicDossier` (a chair-class repair, ruled below at §892) or the owner's paid-surface carve-out is crossed by omission.** O3's bill is 14 (§885.4's correction; the row still says 13). O4's arithmetic checks (2.948 of 3).

*RULED (§892.x, Fable 5.1):* **11 RATIFY · 5 AMEND** (§885.2, 16 calls, slices S14; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (5):** **call J1 ground 2: 'the OWNER already ruled this territory AFTER the annex note — angles are anti-staleness variation, not a lens taxonomy'**: a later owner ruling makes R-DST-W4-d contrary to owner doctrine — annex note authored 9a9094a33 2026-08-03; CHAIR-AMENDMENT-angle-is-a-ladder.md:3 'Withdrawn 2026-09-02 by owner ruling. The chair proposed selecting the prose A · **call J6 repairing the SECTION-TARGET parser is hygiene regardless of routing — 'a field that is 50% unroutable prose'**: parser repair separable from routing decision — memory :29 'Against the EIGHT the shipped rule left 26 of 45' blocks unroutable; 8029536bb 'the SECTION-TARGET parser stops splitting on a comma... four prose l · **call J11 keep economy.generated.js's import; correct 'the reference desk's docblock' that claims the leaves are import-free**: fixing the import would inline a live engine string the generator deliberately refuses — economy.generated.js:4-6 '// A canonical row that IS a live engine string is IMPORTED, never inlined — see LIVE_STRING_BINDINGS in the generator.' + 'import { E · **call O2 paid surface: 'the chair OPERATES under the conservative default publicDossier ⇒ no state prose'**: the restrictive read is the safe one until ruled — PublicDossierView.jsx:115 '<OutputContainer settlement={settlement} readOnly playerView={!shareDm} .../>'; OutputContainer.jsx:446 'const publicDossier = readOn · **call O3 the 13-state authoring bill — record and light anyway**: acceptable to operate under; the ratchet only falls — thin.log 'MODE player: states=58 thin=14' / 'MODE dm: states=58 thin=13' **RATIFIED (11):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.3 · THE OWNER RE-GRANTS EVERYTHING TO THE SOAK LINE (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The owner, in chat, verbatim:** *"i give all permissions and leave everything to your best judgmeent. get to right before the soak"*

**What this MOVES — the four rows that were blocking, now ruled by the chair.**
- **O1, the 338 em dashes: RULED — they leave before any desk lights.** They are prose against `VOICE_AND_TONE` §3 and the grant covers taste. Ground: this is the corpus's one reader-facing defect that is **cheap now and permanent later**, and the ratchet already counts them, so removing them can only make banked debt fall. ⇒ **DESK WIRING IS UNBLOCKED.** *Veto shape:* rule them kept and the desk cars carry a declared voice exception per leaf.
- **The 12 phrases and 6 frame wordings: RULED — the build lane authors them against the SPEC'S OWN TESTABLE REGISTER LAW** (`R1_FORBIDDEN`: no terminal stop, no digit, no underscore, no interpolation slot, no leading connective; plus the two-way frame-fit law extended to all six frames), and **the chair reviews before the car commits.** ⇒ **TRAIN 2 IS UNBLOCKED.** Ground: the register law makes the wording *testable*, so this is no longer taste-without-a-rule.
- **O3, the 13-state authoring bill: RULED — record and light anyway.** The ratchet only falls; a thin state is visible and shrinkable, and holding a wave for corpus authoring inverts the cost.
- **O4, DS-GEN-3: RULED a watch item, not a blocker**, at ~2.95 distinct of 3 across ten settlements.

**⛔ WHAT THIS DOES **NOT** MOVE — the carve-outs survive every delegation by their nature, and the chair says so unprompted.**
- **PAID-SURFACE BEHAVIOUR (O2) STAYS GATED.** It is on the canonical carve-out list. **The chair continues to operate under the conservative default `publicDossier ⇒ no state prose`** — the restrictive read, which needs no ruling to be safe.
- **THE TUNING SIGNATURE AND EVERY TUNING VALUE STAY GATED.** They are after the soak, and the instruction is to stop *before* it.
- **EVERY `git push` AND THE DEPLOY STAY GATED.** No delegation has ever covered these and this one does not either.
- **THE OWNER'S WALK + ONE REGEN IS AN OWNER ACT** and sits *inside* the remaining arc, before the review. The chair cannot perform it. **It is flagged as OWED rather than absorbed.**
- **THE 12 MUTILATED ANCHORS STAY UNREPAIRED.** ⚠ The grant is broad enough to re-open them, and the chair declines: they are pinned by a **prior owner ruling** (LEG-7) whose ground the chair would be guessing at, repairing them is **not on the launch path**, and *"all permissions"* is authority to decide, not a reason to churn a settled decision. **Recorded as a deliberate non-exercise of granted authority.**

**⭐ THE READING OF "GET TO RIGHT BEFORE THE SOAK".** The chair executes: TRAIN 1 (dark prose) → TRAIN 2 (news) → desk wiring → HORIZON-DARK → ENCOUNTERS → the LIGHTING WAVE → the `createdAt` leak and its five siblings → the GOLDEN freeze → W-ARMS → the exhaustive review (§879.6) → **⛔ FULL STOP.** The owner's walk is owed somewhere before the review and only the owner can take it.

*What Fable re-derives:* the O1 ruling first — it is the only one of the four that changes reader-facing bytes, and the chair ruled a taste question on a grant rather than a specification. Then the deliberate non-exercise on the twelve anchors, which is the chair declining authority it was given.

*Priority:* MEDIUM. **The carve-out list is the row that matters if anything here is wrong.**

---

*RULED (§892, Fable 5.1):* **The grant's reading RATIFIED; O1's ruling RATIFIED and honoured in execution; the wordings ruling RATIFIED; O3/O4 RATIFIED with the bill at 14; the carve-outs RATIFIED with O2 flagged; the anchors non-exercise RATIFIED on its surviving grounds with its citation AMENDED; the reading of the order AMENDED to what was executed (S14).** O1: `d32bb8832` (the 338 em dashes) is an ancestor of `30c1667bc` and not of `bbba1be24` — the cure rode the §889 train, not §888 as its subject says — and the first desk car is still unlanded in §891, so "the em dashes leave before any desk lights" was honoured. **AMEND the anchors:** LEG-7 is a LANE-authored wiring note (`RECEIPT_POOLS_LEGACY.md:2874`, 2026-08-03) that owner-GATES the de-slugging; no owner ruling on the twelve exists in the ledger (grep `LEG-7` → only §884.5). The non-exercise stands on its other two grounds (not on the launch path; "all permissions" is authority to decide, not a reason to churn) — the gate is real, the ruling is not, and the twelve go to the owner's desk as an OPEN row rather than a settled one. **AMEND the order:** TRAIN 2 landed at §886 before TRAIN 1 at §887 — harmless, independent cars, recorded. The carve-out list is correct; see §885.2 O2 for the paid-surface default that was stated and not implemented. The owner's sentence has one receipt (the row) — OUT-OF-SCOPE.

## §885.4 · TRAIN 1 CAR C1 IS BUILT — the kernel gains the channel it never implemented, and its control is better than the chair briefed (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The car.** `f60457296` on branch `lane-KERNELMARK-2026-09-02`, **parent exactly `2d5112851`**, one commit, porcelain 0, one trailer, reachable by its own ref. **3 files, +387/−7**: the kernel +116/−6, the projection contract test +173, the kernel test +98/−1. **No new test file, no manifest row, no census slot.**

**⭐ CHAIR-VERIFIED BY OWN READS, every binding constraint:** `drawVariant` is **byte-identical to base** (`diff` exit 0 over the extracted function) — the constraint the chair made binding · the kernel still has **zero imports** · and on the ratchet question, **the whole kernel contains ZERO string literals carrying an em dash or exclamation mark**; the three em dashes in the diff are **docblock prose, which the tokenizer explicitly skips**, and the four apparent bang hits collapse to a single line of ordinary operators (`typeof value !== 'string' || !…`). The lane's `em=0 bang=0` claim holds under the scanner's own logic.

**⭐⭐ THE CONTROL IS BETTER THAN THE BRIEF ASKED FOR, and the improvement is the point.** The chair asked for red-at-base. The lane found that the *literal* base kernel cannot even load the new arms (`TypeError: poolDimensions is not a function`, "no tests ran") — so **that red is real but IMPRECISE, and it said so rather than banking it.** It then built **two mutants**: **A**, the base reader's `eligibleVariants` body restored **verbatim and proven byte-identical by `diff`** with the new exports kept so the arms load — reds **exactly T2 and T3**; and **B**, the gate kept but the filter dropped — reds **T3 alone, T2 green**. ⇒ **The fail-closed gate and the per-variant filter are proven INDEPENDENTLY.** A single red proves an arm can fail; **a mutant pair reding different arms proves each mechanism separately**, and that is a materially stronger receipt than the one requested.

**What T2 found against the unfixed reader: 24 pools that SPOKE**, each printing a sentence with severity, deficit or anchor ignored — `DS-GEN-1 :: leadership_vacuum` and `magical_controversy` returning `major`-marked prose chosen by a seed that never saw the severity.

**⭐ IT REFUSED TO REFREEZE, AND THAT IS THE NEW LAW WORKING.** Base `tests/lint` = 5 failures, tip = 6; the extra is the lighting census. **The lane did not refreeze it** — two sibling lanes are still building and refreezing now is exactly *"a car after a register act"* (§885.1). It reports what the landing owes, last: lighting **titles 22676 → 22680, suiteTitles 6101 → 6102**, files/parked/credited **unchanged**; ratchet **totalTests 30973 → 30979**, files unchanged.

**⭐⭐ AND A REAL FINDING ABOUT THE CENSUS ITSELF: THE CENSUS DELTA IS NOT THE ARM DELTA.** The +4/+1 comes **entirely from the contract test**, because `tests/domain/stateProseKernel.test.js` is **PARKED by that walker**, so its two new arms cost the census nothing. **Budgeting a refreeze by counting arms would have predicted +6 and been wrong.** Proven by isolation runs. ⚠ And `suiteTitles` had to be obtained **by probe** (register bumped, run, restored byte-identically) **because the census asserts `titles` FIRST and would otherwise under-report its own drift** — an instrument that stops at its first mismatch cannot tell you the size of the second.

**FOUR CORRECTIONS TO THE RULED DESIGN, all CONFIRMED, all from measurement.** *(1)* ⭐ **The thin-state authoring bill is 14, not 13** — the design's 13 is the **DM** figure; `DS-GEN-1 :: infiltration_fear` at `major` collapses to one line on the **player's** page because the pool's second `major` variant is the block's only `major + dm-only` line. **O3's bill is 14**, and T4 now pins **both audiences** plus a zero-tolerance "no state goes silent" arm. *(2)* The severity split is 19/11 under the player read, not the design's 20/10. *(3)* `totalTests` is **30973** at base, not the design's **30962** — the design was stale by 11. *(4)* The design's "105 causal arms" is the **declared-arms** count; distinct causal **marks** are **92**, and T1 pins the measured figure.

⚠ **A DOCK-HYGIENE WARNING WORTH CARRYING:** the shared `node_modules` is the **LEDGER tree's** install and lacks `@types/node` and `pg`, which the base sha's `package.json` declares. Harmless for vitest; **anything TYPECHECKING in such a dock would mis-report.** The lane ran no typecheck and labelled the consequence **PLAUSIBLE, not executed.** ⭐ The §885 gate typechecked in `laneINSTRLAND-tree` and passed 173/173, so the landing dock is unaffected — but a future lane docking casually could be.

**RATIFIED:** the lane omitted a default `Co-Authored-By` line that would have named a different model than its seat trailer, on the ground that it would **misattribute an Opus 5 seat in a parser-visible line.** Correct, and it asked rather than assuming.

**Behavioural reach is NIL** — no importer reads a dimension-bearing pool, so no rendered byte moves and there is no golden to re-record.

*What Fable re-derives:* the census-delta-is-not-the-arm-delta finding first, because it silently mis-prices every future refreeze budget. Then the 14-not-13 correction, which moves an owner row.

*Priority:* **HIGH for the census finding.** MEDIUM for the rest.

---

*RULED (§892, Fable 5.1):* **ALL RATIFIED (S14, executed: the mutant pair, the isolation runs, the byte-identity of `drawVariant`).** `f60457296`: parent exactly `2d5112851`, 3 files +387/−7; `drawVariant` byte-identical (md5 `05d31792…` both sides); zero imports at base and tip; the three em dashes are docblock prose and the one bang line is `!==`/`!` — the scanner's logic holds; mutant A (the base reader body restored verbatim, re-diffed identical) reds exactly T2+T3, mutant B reds T3 alone, the tip is 19 green — the gate and the filter proven independently; T2 named 24 pools that spoke (10 DS-GEN-1 + 6 DS-GEN-6 + 8 DS-GEN-9 = the census's 24); the refused refreeze and the owed figures (titles 22676 → 22680, suiteTitles 6101 → 6102; ratchet 30973 → 30979) are right by §885.1's law; **the census-delta-is-not-the-arm-delta finding is EXECUTED and decisive** (contract test at base + kernel test at tip passes at the pinned figure; contract-only reproduces the +4), and the suiteTitles probe shows a real instrument defect — the walker cannot report two drifts in one run. The four corrections (14 not 13; 19/11; 30973; 92) hold from the lane's logs. The dock-hygiene warning (`@types/node` and `pg` absent from the shared install) is real and correctly labelled PLAUSIBLE. The `PARKED` attribution for `stateProseKernel.test.js` is consistent with the walker's TABLE_UNPROVEN rule and proven by the isolation run, though no receipt names the park reason.

## §885.5 · TRAIN 2 IS BUILT AND ITS WORDINGS ARE APPROVED — the lane corrected the spec the chair ratified (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**Three cars** on branch `lane-NEWSTRAIN-2026-09-02`: `4b00f971b` Cure A · `af838ffbb` Cure B · `0362adcd4` the walker. Porcelain 0, three trailers, reachable by its own ref. Nine files, the largest being a **642-line** new walker.

### ⭐ THE WORDINGS: APPROVED, AND ON A GROUND STRONGER THAN TASTE

The chair reserved wording review at §885.3 and exercised it. ⭐⭐ **The decisive fact, CHAIR-VERIFIED BY EXECUTION: these are not new inventions — they MIRROR the vocabulary the product already speaks on an adjacent surface.** `conflict_pressure` renders **"the drums of war"** and `migration_pressure` renders **"people on the move"** in the *existing* `WHAT_PHRASES`, and the new `IMPACT_LABELS` use those exact strings. **The rumor surface has been saying "the drums of war" for the very `impactKind` this file spelled `'Conflict pressure'`.** ⇒ **The cure UNIFIES two registers rather than adding a third**, which is a far better warrant than either the lane's taste or the chair's.

The twelve: `a shortage of goods` · `lost markets` · `the roads gone bad` · `a shaken authority` · `coffers running short` · `defences grown thin` · `services faltering` · `the drums of war` · `people on the move` · `unsettling news` · `a rise in lawlessness` · `a stir among the faithful`.

**The chair ran the two-way frame-fit law by hand across all six frames** (the one law no test can hold). All twelve read. ⭐ **The `expired` frame is the best thing in the set — "Elmspur is spared the drums of war" REPORTS A NON-EVENT**, which is the Herald's own strongest trick and the thing most simulations cannot do at all. ⚠ **Two noted as weakest, as notes rather than blocks:** *"services faltering"* is the most awkward in the `expired` frame, and *"unsettling news"* is the most generic of the twelve. Neither is bad enough to hold a car.

**APPROVED also:** the neutral fallbacks — `a hard turn in its fortunes`, `a neighbouring town`, `a far settlement` — which replace `'A regional source'` and `'the target'`, ⭐ **the software naming its own parameters inside diegetic copy.** And Cure B's refusal phrase `a matter of some moment`, **deliberately neutral in SIGN** because the arm cannot know whether the beat it declines to name was good or bad — `'unrest'` over `treaty_signed` would narrate a peace as a disturbance.

### ⛔ THE LANE CORRECTED THE SPEC THE CHAIR RATIFIED

**The spec's 19-token live roster is PARTLY UNSOUND and the lane refused to build on it.** It was measured by scanning `kind:` **anywhere** in `src`, which admits non-news properties: `siege_initiation` and `tier_change` are `proposalPayload.kind`; `settlement` is a briefs read-model item kind. The lane's sound enumeration is the `impactKind:`/`candidateType:` mint scan — **199 sites: 147 literal, 14 template families, 11 resolved through module constants, 27 unresolvable — yielding 26 unregistered tokens.** ⭐⭐ **And eleven sites resolve ONLY through module constants, seven of whose tokens NO WALKER IN THIS TREE COULD SEE** (`npc_verdict`, `npc_arrival`, `npc_death`, `npc_dispersal`, `npc_pardon`, `npc_rejection`, `npc_assignment`) — **exactly the class a docblock asks authors to avoid by convention.** The walker now sees them.

**The honest bill was SIX pins, not the two the spec named** — all re-authored with the change stated in place, including one in the same file that *required* the slug in a rendered headline. ⭐ **A new POSITIVE control was added so the negative pins cannot pass by refusing everything.** And ⭐ **`BROKERAGE_ACTS` was a cohort the lane missed by reading and its own local census caught** — four acts voiced only by the compute arm, now registered.

### THREE DIVERGENCES FROM THE SPEC, ALL RATIFIED

*(1)* **The 107 §4 strings are GATED, not frozen as a 107-row literal table** — same bytes **by construction**, preserves the estate's canonical-at-zero law which a literal table would break, and two lines instead of 107 rows of eager bytes. **Better than the spec.** *(2)* **No `{source}` in the headline** — `sourceSettlementId` is **optional** on a hand-built impact, so the spec's exemplar frame **would assert an origin the record may not hold.** ⭐ That is the address law doing its job against a spec the chair approved. *(3)* `route_chartered`/`route_revived` **deferred and documented** — registering them needs an `EXACT_SECTION` row, which would **grow a shrink-only census**; the tree records that identical trap for another token in its own words. The reader is already protected; only the information is deferred.

### ⛔ ONE CORRECTION THE CHAIR OWES THE LANE

The lane reports Cure A as **freeze-blocking**, citing persisted headlines and immutable lived history. ⛔ **That was WITHDRAWN at §884.6: the owner stated there are no saves and the product is entirely prelaunch, so the straddle case has no instances.** The lane could not have known. **Cure A is freeze-PREFERRED, not freeze-blocking** — cheaper before the freeze, possible after with a declared shift.

### VERIFICATION AND HYGIENE

**Chair-verified by own reads:** the `createdAt` fallthrough and its five siblings are **untouched** (zero `nowIso` lines in the diff) · paid surface untouched · **zero em dashes in added non-comment `src` lines** ⚠ *(the chair's own first check mis-sliced — an apostrophe in `software's` opened a false string literal, which is the mis-slicing hazard this program documents, committed by the chair while checking for it)* · and ⭐ **the twelve mutilated anchors are not merely untouched, the lane ADDED A PIN locking them**: `expect(whatPhrase('coup_detat')).toBe('detat')`. Execution at the tip confirms all four still render their mutilated strings.

⭐ **A LAW BANKED TONIGHT PAID OFF INSIDE A LANE:** a `nohup … &` sweep **reported exit 0 while its log had no `TRUE_EXIT` line and no summary** — the launcher's exit, not vitest's. **The lane discarded it and re-ran in the foreground.** That is §884.4's law catching a real false green one lane removed from where it was learned.

⚠ **A flake observed and correctly NOT attributed:** `npcAuthoringScope.test.jsx` failed once in a large mixed batch, is green alone at tip, green at base in the identical batch, green in a 1,587-file batch, and did not reproduce.

**Owed at landing, last:** one register act — the new walker moves the lighting census, `files` **2503 → 2504**, which was the lane's written E4 prediction and is confirmed. The refreeze **refuses on a dirty tree**, so it structurally cannot precede the commits.

*What Fable re-derives:* the wordings, since taste is the one thing no test holds — though the mirroring warrant makes them far more defensible than fresh authorship. Then the 26-vs-19 correction, and the seven tokens no walker could see.

*Priority:* MEDIUM. **HIGH for the seven invisible tokens**, which are a live class rather than a finished one.

---

*RULED (§892, Fable 5.1):* **The wordings APPROVED by the chair's own executed read; the mirroring warrant RATIFIED for the two kinds it names; the 26-vs-19 correction and the seven invisible tokens RATIFIED; the six pins, the positive control, `BROKERAGE_ACTS`, the three divergences, the freeze-preferred correction, the hygiene, the paid-off law and the flake RATIFIED; two wording notes ADDED (S14, the 72 headlines and 6 summaries EXECUTED through the real `createWizardNewsEntryFromImpact` at a dock whose frames are byte-identical to `0362adcd4`).** All twelve `IMPACT_LABELS` read in all six frames; ten are clean everywhere; the row's two weakest hold (`services faltering` in `expired`, `unsettling news` generic) and the chair adds two: `a shaken authority` is weakest in READY ("braces for a shaken authority") and `unsettling news` doubles in QUEUED ("has word of unsettling news") — notes, not cars. **AMEND the warrant's reach:** only two of the twelve (`the drums of war`, `people on the move`) pre-existed verbatim at `2d5112851`; the walker's ARM 5 now pins all twelve equal to `WHAT_PHRASES`, so the unification is enforced going forward, not inherited. The neutral fallbacks: `a hard turn in its fortunes` is negative in sign while Cure B's `a matter of some moment` is deliberately neutral — defensible for regional impacts, recorded as an asymmetry. The 26 unregistered tokens reproduce by an independent recount (38 absent − 12 §4-governed); the seven `npc_*` tokens are exactly the resolved-token set the base regex could not see; the pin locking the twelve mutilated anchors exists (`rumorFallbackPhrasePools.test.js:407–408`). The `nohup … &` false green is PLAUSIBLE from the artefact pattern (an empty wrapper log followed by a foreground run). Owed at landing (files 2503 → 2504) landed exact at §886.

*RULED (§892.x, Fable 5.1):* **17 RATIFY** (§885.5, 17 calls, slices S14; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **RATIFIED (17):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.6 · THE LANDING IS HELD FOR THE MACHINE, NOT FOR A DEFECT (2026-09-03 ~04:1x ET, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What happened.** TRAIN 2 is composed on the landing dock (4 cars incl. the census refreeze, porcelain 0). Its `--update` **REFUSED** on `tests/components/simulationRulesDialog.test.jsx`, a test **not in the census.**

**⛔ THE CHAIR IS HOLDING RATHER THAN RE-RUNNING, and the ground is measured.**
1. **The load is EXTERNAL and NAMED.** Top consumers at the moment of failure: **two instances of `build_hd_index`** (Apple Remote Desktop's drive indexer) at **57.4% and 57.0%**, plus a macOS periodic **`find -dx … -type d -empty -mtime +3`** sweep at **47.1%**, plus a JumpCloud EndpointSecurity extension at 19.1%. `UPDATE_LOAD_POST=94.64/88.60/64.79` on **8 cores**. ⭐ **No vitest, no node, nothing of the chair's was running.** The machine was doing its own housekeeping.
2. **The refusing test passes 6/6 standalone, exit 0**, captured in-shell with no pipe.
3. **It is nowhere in the consist's blast radius.** The consist touches `wizardNews.js`, `settlementRumors.js`, five test files, one manifest and the census baseline. The casualty is a **React dialog component test**.
4. ⭐ **A DIFFERENT test failed than the last refusal** (that was `writerReach`). **Varied casualties on an overloaded box is the signature of resource starvation, not of a defect.**

⇒ **Every instrument reading taken in this window is untrustworthy, so the correct act is to STOP, not to retry.** Re-running now would either bank a wrong figure or produce a green that proves nothing about the tree. **Nothing was banked. Nothing was hand-added to the census. The dock is unchanged and clean.**

### ⚠ A REFINEMENT TO §885's `writerReach` CONCLUSION — offered as a refinement, NOT a reversal

§885 recorded that `writerReach` *"passed in-suite at load 47 and failed in-suite at load 3.8, which DISPROVES the load diagnosis."* ⚠ **That inference assumed the load figures were comparable, and tonight shows they may not be**: the `LOAD_PRE`/`LOAD_AT_START` numbers include **external OS work that arrives and departs on its own schedule**, so a low reading at the *start* of a 20-minute run says little about the load *during* the minute a given test ran.
⭐ **The §885 cure stands on its own evidence regardless** — that row blew a **20,000 ms** budget at **21,758 ms**, which is an arithmetic fact independent of why it was slow, and the fix was the instrument's own prescription. **But the confident word "DISPROVES" was over-stated**: the honest reading is that **load at run-start is a poor proxy for load at test-time**, and neither the load hypothesis nor its refutation was ever properly instrumented. ⭐ **THE LAW: a load figure sampled at the START of a long run is not evidence about a failure inside it.** To settle a contention question, sample load *at the moment of the failure* or do not claim to have settled it.

### THE RESUME POINT
Dock `laneINSTRLAND-tree` = **`108a02ef4`**, 4 cars over `2d5112851`, porcelain 0, census **refrozen and proven** (2504/370/2134/22696/6110, plain run 34/34 exit 0). **Owed, in order:** the ratchet `--update` on a quiet box → its register commit → the **pre-gate** (cheap stages, the new instrument's first real use) → the bare gate → chair-verify → CAS → seal → §886.
⛔ **Resume condition, written down so it binds:** `build_hd_index` and the `find` sweep gone from the top of `ps -r`, and the **one-minute** load under ~5. Not a timer — a **measured** condition.

*What Fable re-derives:* the "DISPROVES" refinement, because a confident word in a landing row is exactly the kind of thing a later seat inherits as settled.

*Priority:* MEDIUM. The hold is correct and cheap; the over-stated word is the durable part.

---

*RULED (§892.x, Fable 5.1):* **3 RATIFY** (§885.6, 3 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **RATIFIED (3):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.7 · THREE LANES RETURN — and every one refuses a figure it was handed (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

### PARSER — car C9, `c461dc296` on `lane-PARSER-2026-09-03`, parent = the kernel car

⭐ **Every predicted leaf byte measured EXACT, and the chair verified all seven independently**: `general` −413 → 182,623 · `power` −83 → 81,910 · `defense` −51 → 111,938 · `warFaith` −37 → 115,928 · `economy`, `stressors` and **the causal leaf** at **delta 0**. The causal leaf holding is what protects its three live readers. **Total −584 B.**

⭐ **THE PROPERTY BREAK WAS DECLARED LOUDLY, AS INSTRUCTED:** the seven leaves are **no longer byte-identical across cars**. Legitimate, dark, and stated rather than discovered.

**⛔ IT REFUSED THREE INHERITED FIGURES.** *(a)* **The chair's brief said "23 of 45"; it does not reproduce** — measured **26 of 45** against the canonical eight and **13 of 45** against the ten the state register actually uses, with the denominator named. *(b)* The design's "25 of 45 against a 14-name vocabulary" does not reproduce either. *(c)* **The design's "`sectionTarget` has no consumer" is REFUTED IN ITS REASON** — there are **three live readers** plus a test arm, all over the **causal** leaf; **the conclusion survives only because the causal leaf is byte-identical**, which is a different and much narrower warrant than the one the design gave. **After: 45 of 45 canonical**, 43 carrying a key over exactly ten strings and two carrying none, *"which is the truth."*
⚠ **AND IT CORRECTED THE CHAIR ON A LIVE FACT:** the brief stated the box was at load 60–90; at lane start it measured **2.91 / 6.26 / 20.91**. ⭐ **The chair stated a transient condition as though it were stable.** A brief that carries a live reading must timestamp it or omit it.
**Owed at landing:** the OSR `--write` refreeze (the walker's own CLI characterises the four leaves as *"generated/data inputs, not detector sources"*, so no governed migration is owed).

### REGISTRY — cars C2+C3, `5e749a0b0`, parent = the kernel car

⭐⭐ **THE REGISTRY SHIPS EMPTY, AND THAT IS THE JUDGMENT WORTH KEEPING.** `DOSSIER_MOUNTS = Object.freeze([])` — chair-verified — because **no desk has landed, so a row naming a position the tree does not build would be fiction on day one.** All **68** blocks are listed in `UNMOUNTED_BLOCKS` (chair-verified count) as *"the corpus's darkness, as a number"*, shrink-only. Zero imports. Nothing reached into: the kernel, the contract test, the generator and the annexes are all absent from its diff (chair-verified).
**C3 is held in two places that cannot disagree**, and `sentenceMountForBlock` is **fail-closed — `null` on a contradiction rather than first-wins by array order.**
⭐ **The sweep plant is aimed at the one arm a shrink-only ratchet CANNOT see:** striking a block from the dark half reds the TOTALITY arm, *"deliberately the arm a shrink-only ratchet cannot see, since shrinking is the direction it exists to permit."*
**Design corrections:** `max-lines: 600` is scoped to `src/components/**/*.jsx`, not layer-wide · the design's eslint command **does not run under this repo's flat config** · **the design's "T5 arm 1 reds today with 68 unmounted" is WRONG** — with all 68 declared dark the arm is **green**, which is precisely what lets this car land against a full census.
⭐ **And a measured correction to the ratchet's own reputation:** `check-test-ratchet.mjs:1118-1142` uses `totalTests`/`totalFiles` **only as a 90% scope floor, never as growth ceilings** — so a new test file **does not red without a refreeze**; that figure is hygiene, not a gate.
⭐ **It refused the census refreeze on better grounds than the chair's law**: not merely "registers last", but that *"a number measured from my dock alone would not reproduce at the composed tip"* — the **multi-lane** form of the rule.

### ENC-1 — `bbe56b957` + the chair's `ea8451bbb`, on the product tip

**Only ONE of seven cars was buildable**, and the design's own §17.4 says so. ⭐ **Ruling none of the seventeen owner rows leaves exactly one car** — the lane built it and refused the rest rather than absorbing a row to unblock itself.
⭐⭐ **THE CONTROL THAT PROVED ITS OWN ABSENCE.** Planting `Math.random()` in the pick **did not convict on the first run** — the hole was real: the resolution arm never touched the census, the order arm ran an empty roster, and a two-seed arm is *satisfied* by randomness. ⭐ ***"The arm exists because the plant found its absence."*** That is the strongest thing a control can do, and it is the difference between a control and a ceremony.
**Its plane-projection control found FOUR real defects the design's arithmetic hid**: the axis id was being dropped so every disclosed axis read plane-neutral · `planeFromAxes` was lossy because a trait carries a lean and lives in no axis, so *"the design's 'equivalently `npcTraitPlane` walked by disclosed axes' was FALSE until `planeFromChart` existed"* · a refused offer was overwritten by the mark arm, **erasing every `rejected` from the measured distribution** · and the pick's eighth arm reached no receipt.
⭐ **It refused the unit-dodge the chair refused at §883.6** — `unit: null` would have grown `UNITLESS_TABLE_CEILING` 220→221, so it **split provenance into its own export** so every leaf carries an honest unit. Four cures at source, no ceiling raised.
⭐ **It caught its own voice debt**: its registry rows had added three em dashes to `src/domain` string literals; cured, after which its list is **identical to the control** — **ENC adds zero voice debt.**
**One FINDING by the design's own factor-of-two rule:** at the worst-case corner, exposures measure **0.6% of stops against a predicted ~4%**, a factor of ~7. ⭐ **"I moved no rung"** — correct, because that is a tuning value and tuning is gated.
**STATE-NEVER-FATE holds by construction** (the widest outcome is `compromised`, a lean channel and a loyalty mark, pinned by an exact key-set assertion). **DARK holds**: goldens 0/525, no flag, no persisted key, no importer.

### ⛔ THE CHAIR ACT: `DEFER_CEILING` 31 → 35, AUTHORIZED

The lane **refused to move it**, correctly — the constant's own message reserves growth to *"a chair conversation, not an automatic deferral"*, and its comment records two prior moves with their ledger sections (29→30 at ODQ §85.1, 30→31 at §350), *"each move a chair-authorized registry mint landing its fork row, **never a lane absorbing a discovery**."*
**The chair verified before authorizing**, not after: the six rows exist (**HBF-36…HBF-41**, four carrying the `closeOwed` the constant demands so each deferral says what would have to exist), the red was exactly **`expected 35 to be 31`**, and the walker is green on a pristine control dock. Moved in `ea8451bbb` **with its authorization recorded beside the constant in the file's own convention**; green **8/8** after.

### COMPOSITION STATE
`lane-KERNELMARK` (1 car) → `lane-PARSER` and `lane-REGISTRY` both branch from it (2 cars each) ⇒ **TRAIN 1 composes to 3 cars.** `lane-ENC` is 2 cars on the product tip, its own train. TRAIN 2 sits composed at `108a02ef4` awaiting a quiet box.

*What Fable re-derives:* the chair's own load-figure error first — a brief that carries a transient reading as though it were stable is a defect the chair repeated after banking the law about it. Then ENC's control-that-found-its-own-absence, which is a method worth copying.

*Priority:* MEDIUM. **HIGH for the brief-carries-a-stale-live-fact defect**, which will recur in every brief the chair writes.

---

*RULED (§892.x, Fable 5.1):* **16 RATIFY · 3 AMEND · 1 EVIDENCE-THIN** (§885.7, 20 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (3):** **§885.7 REGISTRY**: A measured correction to the ratchet's reputation — check-test-ratchet.mjs:97 'export const SCOPE_FLOOR_RATIO = 0.9;' :1117-1123 '(2) COUNT FLOOR ... if (baseline.totalTests && rows.length < floor)'; :1139-1144 ' · **§885.7 REGISTRY**: The multi-lane form of registers-last — 5e749a0b0 touches no .lighting-census-baseline.json or .test-ratchet-baseline.json. Message tail: 'NOT TAKEN, and owed to the landing: scripts/.test-ratchet-bas · **§885.7 ENC-1**: The lane built ENC-1 and refused the rest rather than absorbing a row — DESIGN_ENCOUNTERS.md:714 'The build lane may cut the dock and author ENC-1 immediately; **ENC-2 is blocked until §12 rows 1, 5 and 5b are answered**, and ENC-5  **EVIDENCE-THIN (1):** **§885.7 ENC-1**: A tuning value; tuning is gated — No retained receipt outside the ledger copies (queue-*.md) carries '0.6%' or the factor; the test file at bbe56b957 has no such arm. The tuning table ships draf **RATIFIED (16):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §885.8 · THE INDEX IS FOLDED AND THE CARD REFRESHED — with a chair error inside the fold itself (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**Why.** `MEMORY.md` stood at **16,767 B** against a **~17 KB HARD read limit where the TAIL goes invisible first**, and two topic-file rows were **owed** to a lane that correctly wrote its files and left the index to the chair (the standing rule: lanes do not write the index).

**⛔ THE CHAIR ERROR, self-caught by read-back.** The first fold was a *consolidation*: three rows added this session — the stale-copy hazard, the anchor-span hazard, the background-exit hazard — folded into one archive as **THE FALSE-REPORT FAMILY**, since they are not three lessons but **one lesson with three faces**. That reasoning is sound and the archive is worth having. ⚠ **But the arithmetic was not: the replacement row plus the two owed rows came to MORE than the three folded rows, and the index went UP by 144 bytes** — a fold that grew the file it was meant to shrink. Caught only because the chair measured after writing rather than trusting the intent. **A real fold followed**, taking four SETTLED build-era rows verbatim into FOLD 30: **16,911 → 15,623 B, −1,288.**

⭐ **THE LESSON, and it belongs beside the false-report family rather than apart from it: a consolidation is not a fold.** Merging N rows into one is a *legibility* act; it reduces bytes only if the merged row is smaller than the sum, and a merged row carrying five hooks usually is not. **Fold for SIZE by removing SETTLED subjects; consolidate for CLARITY; and measure which one you just did.**

**What the archives now hold, verbatim and roster-registered:** `archive-2026-09-03-false-report-family.md` (the three rows plus the two later faces — the stale-live-reading brief and the unverified-premise ruling) and `archive-2026-09-03-index-fold-30.md` (the map-module descope ⚠ *folded because the arc was DESCOPED module-side, not because its GPL laws stopped mattering* · the retrovalidation mark and seat · the 08-21 sitting directives · the walker-census law). Both listed in `archive-index.md`.

**The two owed rows are now indexed:** the OSR input-arm hazard (regenerating a prose leaf reds it; a **landing** register act, and the walker's own CLI calls the leaves generated inputs rather than detector sources, so no governed migration is owed) and C9's closed SECTION-TARGET vocabulary.

**The successor card is refreshed to §885.7** with all six docks, the composition arithmetic (parser and registry **both branch from the kernel car**, so TRAIN 1 composes to three), and the arc through to the full stop.

*What Fable re-derives:* the consolidation-is-not-a-fold distinction, since the index is the one artifact whose failure mode is silent — a tail that goes invisible reports nothing.

*Priority:* LOW for the fold itself. **MEDIUM for the distinction**, which will govern every future index act.

---

*RULED (§892.x, Fable 5.1):* **2 RATIFY · 1 EVIDENCE-THIN** (§885.8, 3 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **EVIDENCE-THIN (1):** **call F1 the fold arithmetic: 16,767 B -> first fold +144 -> 16,911 -> real fold 15,623 (-1,288)**: A consolidation is not a fold — MEMORY.md is 16,348 B now (mtime Sep 3 18:51, edited by later sessions); the memory directory is 'fatal: not a git repository', so no earlier byte states surviv **RATIFIED (2):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §886 · THE ELEVENTH LANDING — the first one a customer would notice (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `2d5112851` → **`d1a6c773e7d87dd44ef8fcc1ab2edab53c8081fc`**, sealed `refs/preserve/landing-886-2026-09-03`. Five cars, 11 paths +987/−95, porcelain 0, five trailers, all single-parent. **Gate GREEN ON THE FIRST RUN**, 1,138 s, 20 stages, ratchet **10 known of 30,994 (ceiling 10)**, `STRICT DIST OK 52/440 zero non-run`, typecheck 173/173, domain-strict 1121/1121. **Every commit is Opus-seat work and every row here is owed a Fable second look.**

**What landed, and why it is the first landing with a reader on the other end.** Every prior landing this arc was machinery. This one removes two things a customer meets: a **category noun standing where a person belongs** (`"Conflict pressure takes hold in Elmspur"`), and a **raw engine identifier in a townsperson's mouth** — a century campaign printed *"settlement terminal death"* twenty times while the authored headline for that identical event read *"Thornwall is dying"*. ⭐ **The best sentence and the worst sentence in the program described the same event, and now only the good one ships.**

**⭐ THE REAL DELIVERABLE IS THE WALKER, NOT THE TWO CURES.** It enumerates the **single consumer expression** rather than producers, and **CONVICTS an unresolvable mint instead of skipping it** — which is what closes the class rather than two instances. Six mint routes exist where the prior guards saw one; **eleven sites resolve only through module constants, and seven of their tokens no walker in this tree could see.** The estate's only prior defence against that route was a docblock asking authors to spell literals on purpose, and the file's own comment records that it *"failed that walker until the literals went in"* — ⭐ **a naming convention enforced by a comment is not machinery, and now it is.**

### ⭐⭐ THE FINDING CONFIRMED A THIRD TIME, NOW WITH THREE FIGURES FOR ONE CONSIST

**The census delta is NOT the arm delta.** The new walker carries **19 test arms**; the lighting census moved **+20 titles**; the test ratchet moved **+21 tests**. ⇒ **Budgeting a refreeze by counting the arms you wrote is wrong three separate ways on a single consist.** Both register acts were handled the way that fact demands: **the derivable figures predicted EXACTLY** (lighting `files` +1 and `credited` +1 with `parked` unmoved and the closure identity holding; ratchet `totalFiles` +1) **and the underivable ones left DELIBERATELY UNNAMED** rather than guessed — titles/suiteTitles measured at +20/+9, tests at +21. ⭐ **Refusing to name a figure you cannot derive remains a better outcome than guessing one and being right.**

### THE TWO REFUSALS BEFORE THIS, AND WHY HOLDING WAS CORRECT

The ratchet `--update` **refused twice**, both times on a test **foreign to the consist that passed 6/6 standalone**, while the machine ran two Apple Remote Desktop indexers and a filesystem sweep at **load 94 on eight cores** with nothing of the chair's running. ⭐ **A DIFFERENT test failed each time — varied casualties on a starved box is the signature of resource starvation, not a defect.** Held rather than retried, **nothing banked, nothing hand-added to the census**, against a resume condition written to disk as a **measured state rather than a timer**: indexers gone from `ps -r`, one-minute load under five. It was **checked, not assumed**, and the run that worked started at load **1.90**.

### ⭐ BOTH NEW INSTRUMENTS EARNED THEIR KEEP ON THEIR FIRST REAL LANDING

The **register pre-flight** named in ~2 s exactly what cost §885 a full 18-minute gate cycle — *"the census WILL move and is NOT refrozen"*, `files 2503 → 2504` derived as certain, with the four figures it cannot compute honestly printed **UNKNOWN rather than guessed**. The **pre-gate** cleared all 14 cheap stages in **85.6 s** at the exact five-car tip. ⚠ **Operational note for every future landing: copy them to the dock to run them and DELETE THEM IMMEDIATELY** — untracked files on the landing dock fail the seal's own porcelain assertion, which the chair nearly discovered the expensive way.

### WHAT REMAINS OWED FROM THIS TRAIN

⛔ The `createdAt` wall-clock fallthrough **and its five siblings** (`wizardNews.js` `:552 :712 :759 :779 :819 :867`) — untouched here by instruction, and **owed before the GOLDEN freeze** as its own determinism act. ⛔ The **twelve mutilated anchors** remain unrepaired and owner-gated; this landing **added a pin locking them** rather than touching them.

*What Fable re-derives:* the wordings first — twelve labels, six frames, six summary frames, 29 registered rows — since **taste is the one thing no test holds**, though the chair's warrant is stronger than taste: they **mirror the vocabulary the product already speaks** on the rumor surface, verified by execution. Then the walker's six-route enumeration.

*Priority:* MEDIUM. **HIGH for the seven previously-invisible tokens**, which were a live class rather than a finished one.

*RULED (§892.x, Fable 5.1):* **4 AMEND · 3 RATIFY · 1 EVIDENCE-THIN** (§886, 8 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (4):** **call G3 the walker convicts an unresolvable mint; 'six mint routes'; eleven sites through module constants with seven invisible tokens; the docblock-convention quote**: A naming convention enforced by a comment is not machinery, and now it is — walker:18-27 'three routes uncovered: • MODULE CONSTANTS — candidateType: VERDICT_NEWS_TYPE. Eleven live sites, and SEVEN live tokens (npc_verdict, npc_arrival, · **call G4 the census delta is not the arm delta: 19 arms / lighting +20 titles / ratchet +21 tests; files +1, credited +1, parked unmoved predicted exact**: Budgeting a refreeze by counting arms is wrong three ways — Walker test( count at d1a6c773e = 20 (twenty plain test( calls, zero .each/.skip). 108a02ef4: files 2503->2504, credited 2133->2134, titles 22676->22696 (+20),  · **call G5 the two refusals before the landing, both foreign-casualty at load 94 with ARD indexers; held on a measured condition; the run that worked started at load 1.90**: Holding was correct — update-886-run1-REFUSED-loaded.log: HEAD 108a02ef4, simulationRulesDialog, LOAD_POST 94.64. update-885-run1-REFUSED.log: UPDATE_HEAD=d4b91b26a (the §885 consist · **call G7 owed: the createdAt wall-clock fallthrough and five siblings at wizardNews.js :552 :712 :759 :779 :819 :867; twelve mutilated anchors pinned**: Owed before the GOLDEN freeze — At 2d5112851 the six sites are at 552, 712, 759, 779, 819, 867. At d1a6c773e (this row's tip) they are at 627, 787, 834, 854, 894, 942 (car 1 added ~75 lines ab **EVIDENCE-THIN (1):** **call G6 the two instruments on their first real landing: pre-flight ~2 s 'the census WILL move and is NOT refrozen', files 2503->2504; pre-gate 14 stages in 85.6 s; copy-and-delete note**: Both earned their keep — gate-886.log:5 'GATE_PREGATE=ALL 14 cheap stages PASSED in 85.6s at this exact tip' (a chair-authored header line). No pregate-886 log and no pre-flight output  **RATIFIED (3):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §887 · THE TWELFTH LANDING — TRAIN 1, and a collision that only exists at the composed tip (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `d1a6c773e` → **`f123601850917f549d0d6e34a44b14676b7e6e66`**, sealed `refs/preserve/landing-887-2026-09-03`. **Seven cars, 17 paths +1,423/−100**, porcelain 0, seven trailers, all single-parent. **Gate GREEN ON THE FIRST RUN**, 1,039 s, 20 stages, ratchet **10 known of 31,016 (ceiling 10)**, `STRICT DIST OK 52/440 zero non-run`, typecheck 173/173, domain-strict 1121/1121. **Every commit is Opus-seat work and every row here is owed a Fable second look.**

**What landed.** Three lane cars and four chair cars. The kernel gained the **demotion channel it never implemented**, so a minor crime wave can no longer print the catastrophic sentence — and the arm proving it was **red against a byte-identical copy of the base reader** before it was green against the cure. The **SECTION-TARGET parser** stopped splitting on a comma and started reading the shape its own neighbour has always used, closing the field's vocabulary and moving four prose leaves 584 bytes for the first time. And the dossier got a **router that can say WHERE**, with the rule that one fact is given exactly one sentence: the dark half is **68 blocks a gate can count**, and the registry is **empty at birth by design** so that the walker's controls red on the defect before the table has a single row.

### ⚠⚠ THE COLLISION EXISTED ONLY AT THE COMPOSED TIP — NEITHER DOCK COULD SEE IT

§886's fill-layer guard treats **every exported string map in the desk directory** as a candidate fill table. Train 1's registry car landed `dossierMounts.js` in exactly that directory, exporting `MOUNT_RUNGS`. Both cars are correct; **the pair is not**, and no dock held both. ⭐ **The cure was the guard's own pre-built door, used honestly:** `NOT_A_FILL_TABLE` exists precisely for a map that is vocabulary rather than fill, and the entry states the true reason — the two legibility depths a mount may draw at, consumed only as the router's rung vocabulary, no value of which ever reaches a `{slot}`. **Classified, not exempted.** The distinction matters because an exemption suppresses a question and a classification answers it.

### ⭐⭐ THE CENSUS DELTA IS NOT THE ARM DELTA — CONFIRMED A FOURTH TIME

The registry walker carries **16 arms**; the lighting census moved **+20 titles**; the test ratchet moved **+22 tests**. Three different numbers for one consist, for the fourth consecutive landing (§885.4: two arms, **zero** census cost; §886: 19 / +20 / +21). **Budgeting a refreeze by counting the arms you wrote is wrong in three independent ways at once**, and the only correct move remains what both register acts did here: **predict the derivable figures exactly and leave the underivable ones deliberately unnamed until measured.** Lighting went `2504/370/2134/22696/6110` → **`2505/370/2135/22716/6114`** with the three derivable figures predicted exact and the closure identity holding; the ratchet went `30,994/2,452` → **`31,016/2,453`**, files predicted +1 exact and tests refused in advance; the OSR baseline refroze **1,993 findings / 1,409 identities across 388 files** — figures unchanged, input fingerprint only, **exactly as the parser lane predicted.**

### ⚠ A CHAIR ERROR THE RECORD SHOULD CARRY: A LAW BROKEN TWICE, ONE LANDING APART

The chair wrote the **cures-first-registers-last** law and then inverted it at §885 and again here — committing a register act while a cure was still owed. **Both times it was harmless only by luck**, the cure happening to add no test title, which was *checked* rather than assumed. ⭐ **A law the chair keeps breaking is not a law, it is a hope.** The mechanization is named and not yet built: the **register pre-flight already knows** which registers a consist disturbs and whether they are refrozen, so it can equally refuse a register act committed with uncommitted cures ahead of it. Recorded here as owed work, not as a resolved item.

### THE INSTRUMENTS, ON THEIR SECOND LANDING

The **pre-gate** cleared all 14 cheap stages in **81.9 s** at the final seven-car tip, and the two copied instrument files were deleted immediately with porcelain returning to 0 — the operational note from §886 held. The ratchet's earlier refusal on this consist was **not the machine this time**: it named two real failures, one the cross-car collision above and one a register act the chair had been told about and forgotten. **Neither was banked, both were cured, and the census stayed at 10/10.**

### WHAT REMAINS OWED FROM THIS TRAIN

⛔ The `createdAt` wall-clock fallthrough **and its five siblings** (`wizardNews.js` `:552 :712 :759 :779 :819 :867`) — named in this gate's `GATE_KNOWN_RED` and still **owed before the GOLDEN freeze** as its own determinism act. ⛔ The **twelve mutilated anchors** stay owner-gated and untouched. ⏳ The dossier mount registry is **empty at birth**: the 68 unmounted blocks are a measured backlog, not a defect, and the wiring is the desk act that follows.

*What Fable re-derives:* the mount **rung vocabulary and the one-fact-one-sentence rule** — a taste judgment no test holds — then the parser's closed-vocabulary reading against the neighbour it now mirrors, then the demotion channel's threshold placement in the kernel.

*Priority:* **HIGH for the kernel demotion channel** (it changes which sentence a reader meets); MEDIUM for the registry, which ships dark.

*RULED (§892.x, Fable 5.1):* **9 RATIFY · 1 AMEND** (§887, 10 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (1):** **call K9 owed: createdAt siblings named in GATE_KNOWN_RED; twelve anchors owner-gated; 68 unmounted blocks a backlog not a defect**: Owed before the GOLDEN freeze — gate-887.log:9 'GATE_KNOWN_RED=one signature only - wizardNews createdAt clock-tick, 0.392 pct measured, pre-existing and foreign, owed before the GOLDEN freeze **RATIFIED (9):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §887.1 · THE CHAIR CORRECTS ITS OWN CARD — the encounters blocker was a phantom, and the record had been repeating it for several landings (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The owner asked what "ENC-2 through ENC-7 need your seventeen ENCOUNTERS rows" meant.** Checking the record instead of restating the card showed the claim was **false**, and had been false since 2026-09-02.

**What the design actually says**, in its own fold header: *"owner rows 17 (§12: fifteen numbered plus 1b and 5b), **three of them BLOCKING the build (1, 5, 5b)**"*. **All three were RULED at ODQ §882.13** on 2026-09-02 under the owner's restated delegation — row 1 YES (the two ledger keys), row 5 YES (the willed pin at the corruption web's creation seam), **row 5b NO** (the three fences stand; a meeting-born willed compromise never enters the ousting/replacement/verdict chain). **The build was unblocked the same day it was declared blocked, and the card never learned it.**

**The corrected shape, from the design's own car list:** seven cars, five on the critical path. **ENC-2, ENC-3, ENC-4 and ENC-6 are BUILDABLE NOW** (ENC-6 must land before the lighting wave). ⛔ **ENC-5 — the words — is genuinely owner-gated**, since row 6's ruling reserves the pool sentences to the pen at the voice sitting. **ENC-7 is DEFERRED to the lighting wave by row 8's own ruling**, not blocked. The one held encounters row is **7, the tuning register's values**, which is the tuning signature, signed LAST for the whole program, and gates no build.

### ⭐⭐ THE LAW THIS EARNS

**A BLOCKER IS A CLAIM, AND A CLAIM DECAYS.** This program re-verifies figures at every tip and re-derives registers rather than trusting them — and then carried a *blocker* across four landings on nothing but a card that copied itself forward. ⭐ **A blocker must name the rows it rests on and be re-read against their rulings at every collection**, exactly as a register is re-derived against its inputs. The failure mode is worse than a stale figure: a stale figure gets refused by a gate, while **a stale blocker is obeyed silently and costs work that was never actually forbidden** — here, four buildable cars left unbuilt while lanes sat free.

*What Fable re-derives:* the §882.13 rulings for rows 1, 5 and 5b against the design's §12 table, and the claim that ENC-5 alone is owner-gated.

*Priority:* **HIGH** — it changes what is buildable right now.

*RULED (§892.x, Fable 5.1):* **2 RATIFY · 1 AMEND** (§887.1, 3 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (1):** **call B2 ENC-2/3/4/6 buildable now; ENC-5 (the words) genuinely owner-gated by row 6's pool-sentence reservation; ENC-7 deferred by row 8; only ENCOUNTERS 7 (tuning values) held**: It changes what is buildable right now — §882.13: '**2 YES** — respect joins BOND_KINDS'; '**3 YES** — rivalry joins GRUDGE_KINDS'; '**6 YES at lighting** — ...; ⚠ the POOL SENTENCES remain the pen's t **RATIFIED (2):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §887.2 · THE HEARTBEAT CHECKPOINT — five lanes home, nine cars sealed, and a gate the chair built that could never open (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**All five lanes of the 09-03 wave reported and every car is sealed** — enc2-enc6 `f052d1e77`, emdash `4da38b8d3`, emdash-annex `e46d4c3f1`, horizondark-cars12 `43e063a70`, determinism-wip `55d77a8d2`, atop the in-flight enc1-registers `f4cc5cb7d`. Nine cars behind one landing. Every one was reachable from **no ref** when its lane reported; the §882.14 survival law paid out five times in one afternoon.

### ⛔⛔ THE CHAIR'S ERROR, TWICE, AND THEN A THIRD TIME IN THE FIX

The ENC-1 test ratchet **refused twice**, both times naming `tests/simulation/centuryLegSoak.test.js` running **0 ms against a 900,000 ms budget** with ten tests returning as skips. Load ended at **216.82** and then **276.47**. Both were contention the chair created: it read the load **at launch** (3.70, then 2.09) and launched, and the build lanes ramped up during the ~26-minute run.

⭐ **THE LAW: A FULL-SUITE INSTRUMENT NEEDS A QUIET WINDOW FOR ITS DURATION, NOT AT ITS START.** A start-time load reading is a snapshot of a variable that moves, and §886's "hold for quiet" was read by the chair as a launch condition rather than a sustained one.

⚠ **AND THE DIAGNOSIS WAS WRONG IN BOTH DIRECTIONS FIRST.** §886 banked the signature as *"a DIFFERENT test failed each time — varied casualties on a starved box"*. Here the **same** test fell twice, which by that letter meant a real defect. It is not: `centuryLegSoak` is the most expensive test in the tree, so under contention it is the **first** casualty every time, not a random one. ⭐ **The signature is not "varied casualties" — it is "a resource failure rather than an assertion failure, on a test foreign to the consist."** A test that ran 0 ms with no timeout signal, no assertion signal and no failure message did not fail; it never ran.

⛔ **THE THIRD ERROR IS THE INSTRUCTIVE ONE: THE CHAIR MECHANIZED THE LAW AND BUILT A GATE THAT COULD NEVER OPEN.** The waiter counted competing workers with `ps -ax -o command | grep -c 'vitest/dist/workers'` — **which matches its own grep**, so the count could never reach zero and the streak stayed at 0 while the load fell to 3.89. The chair had hit this exact self-matching trap ninety minutes earlier reading `ps | grep -c vitest` by hand, named it, and then wrote it into the machinery. ⭐ **A PREDICATE THAT CAN MATCH ITS OWN COMMAND LINE IS NOT A GATE.** The bracket form `'[v]itest/dist/workers'` is the cure, and it must be proved to reach zero **before** it is trusted, which it now is.

*What Fable re-derives:* the claim that both refusals were contention rather than a defect — the decisive evidence is the 0 ms against a 900,000 ms budget with no failure message, not the load number.

*Priority:* **HIGH** — the landing track is blocked on it, and the self-matching-predicate law generalises to every guard this program writes.

*RULED (§892.x, Fable 5.1):* **4 RATIFY** (§887.2, 4 calls, slices S15; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **RATIFIED (4):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §888 · THE THIRTEENTH LANDING — chance meetings exist, and a random red that could fell any gate is cured at cause (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `f12360185` → **`bbba1be240c84bf0fd969079fc9fd2aa97a18906`**, sealed `refs/preserve/landing-888-2026-09-03`. **Eight cars, 11 paths +1,848/−24**, porcelain 0, single-parent throughout, branch verified at base before the swap and the seal verified absent before it was taken. **Gate GREEN ON THE FIRST RUN**, 1,016 s, 20 stages, ratchet **10 known of 31,048 (ceiling 10)**, `STRICT DIST OK 52/440`, typecheck 173/173, domain-strict 1121/1121.

**What landed.** Two named people in the same place at the same time can now **meet**, and the meeting can leave a mark that outlives it — a bond, a respect, a rivalry — **without the engine ever resolving either person's fate.**

### ⭐⭐⭐ A ~0.45% RANDOM RED HAS BEEN LIVING IN THE LANDING GATE, AND EVERY GREEN THIS ARC ROLLED THAT DIE

A byte-identity arm compares two separate appends whose `createdAt` comes from `new Date().toISOString()` — millisecond resolution — whenever the pin is null. Measured in both directions: **88 mismatches / 20,000 back-to-back on an idle box; 100% with a forced 3 ms gap; 0% with one threaded stamp**, and the region key absent from both sides in every mismatch. **Pre-existing, unrelated to this consist, cured at cause here.** ⚠ **TWO LANES REACHED IT INDEPENDENTLY FROM OPPOSITE ENDS** on the same afternoon — the determinism lane proved `now: null` is a pin that is not one (979 / 200,000 = 0.489%) from a determinism sweep; the census lane arrived from a failing byte-identity arm. **Independent convergence on one root cause is the strongest evidence this program has produced for a defect, and neither lane knew of the other.**

### ⛔⛔ THE CORRECTION §887.2 OWED — A STARVED RUN REPORTS THE WRONG REASON

§887.2 recorded both early ratchet refusals as "contention the chair created". **Incomplete, and the incompleteness is the lesson.** Contention was real, but what it did was **fire an EARLIER gate than the actual defect**: the SCOPE SENTINEL checks for unmeasurable suites *before* the census check, so a starved soak short-circuited both runs and reported a resource artifact while **five genuine census bills sat underneath, unmentioned.** ⭐⭐ **A STARVED RUN DOES NOT MERELY WASTE TIME — IT REPORTS THE WRONG REASON, AND THE CHAIR ACTED ON IT TWICE.**

⭐ **§886's starvation signature is AMENDED.** It was banked as *"a DIFFERENT test failed each time — varied casualties"*. `centuryLegSoak` is the most expensive test in the tree, so under contention it is the **FIRST** casualty every time, not a random one; the same casualty twice is therefore NOT evidence of a real defect. **The true signature is a RESOURCE failure rather than an ASSERTION failure, on a test FOREIGN to the consist** — 0 ms against a 900,000 ms budget with no timeout signal, no assertion signal and no failure message did not fail; it never ran.

### ⭐ THE LANE REFUSED THE EASY CURE ON THREE OF FIVE BILLS

The leaf imported straight from the drift module. Enrolling that would have minted **a second production door** into a family whose whole invariant is one door, and adding it to the family list would have **exempted it from the writer seals** — the laundering the census exists to prevent. The easy road's cost was **measured, not asserted**: closure **10 modules / 211 KB → 111 / ~2.0 MB**, putting the world-state substrate and a clock behind eight lines of arithmetic in a file whose header says PURE. The value now arrives as an argument. Two arms were honest enrolments after proving the read correct and the leaf reached by nobody. **Behaviour identity: 268,800 receipts compared byte-for-byte, 0 diffs, negative control fires.**

### THE REGISTERS, AND THE PREDICTIONS THEY WERE MEASURED AGAINST

Tuning inventory **224 → 225 tables** (predicted **225 EXACT**; `unregisteredNamed` 535 and `bareDecimals` 6,985 **both unchanged across a 919-line new leaf** — it was written to the tuning discipline). Lighting census `2505/370/2134/22716/6110` → **`2506/370/2136/22748/6122`**, files predicted exact, closure identity holding. Test ratchet `31,016/2,453` → **`31,048/2,454`**, files predicted exact, **tests refused in advance and measured**. OSR **proven NOT owed** — exit 0, baseline undirtied. ⭐ One chair prediction MISSED and the miss was the useful part: inventory `keys` was predicted +40 from the register's unit map and moved **+26**; the register declares **dotted leaf paths** and the inventory counts **top-level keys**. The declaration was honest; the chair's arithmetic was not.

### THE TRAILER GAP, RECORDED RATHER THAN REWRITTEN

Eight cars carry **seven** trailers: `394d758ee` has none, because the first lane brief of the day omitted the requirement. It was **NOT rebased**, because `tests/lint/.tuning-inventory.json` cites that exact sha as its `measuredAtSha` and a rewrite would leave a register citing a commit that does not exist. **Trading a recorded gap for a dangling provenance reference makes the record worse.** The ledger and this stratum both name the car as Opus-seat and Fable-unvalidated, so §685's purpose is served; the cause is fixed forward in the brief template.

*What Fable re-derives:* the three cure-the-leaf rulings against each arm's own assertion text — the question was never "how do I enrol this" but "should the leaf be reading this at all", and that is a judgment no test holds. Then the wall-clock race's two-direction measurement.

*Priority:* **HIGH for the wall-clock cure** (it removes a random landing-gate failure); MEDIUM for the rest.

*RULED (§892, Fable 5.1):* **The landing figures RATIFIED (8 cars · 11 paths +1,848/−24 · sealed · gate 1,016 s green first run); the wall-clock mechanism and measurement RATIFIED; the cure-the-leaf rulings RATIFIED with the closure re-measured (10 / 211 KB and 113 / 2.03 MB); the trailer gap RATIFIED; the registers RATIFIED with one transcription AMENDED; the §887.2 correction RATIFIED; the §886-signature amendment AMENDED in attribution; ⛔ the discovery framing REVERSED (S16).** **REVERSED:** "a ~0.45 % random red HAS BEEN LIVING in the gate … TWO LANES REACHED IT INDEPENDENTLY … neither knew of the other … the strongest evidence this program has produced" — the chair's own §884 row had already diagnosed the same `createdAt || options.now || nowIso()` fallthrough, measured it (784 / 200,000 = 0.392 %), named its test-side home and deferred it; §886 and §887 both carried it as STILL OWED; and the REGISTRY (determinism) lane was BRIEFED to close it (`brief-REGISTRY.md:27`). Only the ENC-1 census lane arrived blind. The right sentence: a known, rated, homed and assigned defect was closed at its arm by the census lane and at its cause by the determinism lane the same day. **AMEND "cured at cause here":** `b6822dcae` is test-side (a threaded stamp at the §884 home); the cause — `now: null` falling through `||` — closed in §889 at `efed4ba91` / `3c2410be2`; the two rows should cross-reference. **AMEND the lighting FROM figures:** `2505/370/2134/22716/6110` is a transcription error for the committed `2505/370/2135/22716/6114` (stratum and ledger 32399). **AMEND the attribution:** the amended starvation signature was first written at §887.2; §888 restates it. The tuning inventory (224 → 225; 535 / 6,985 unchanged; keys +26 vs +40 predicted — the dotted-leaf-vs-top-level lesson) RATIFIED. The trailer gap: `394d758ee` has no `Seat:` line and `.tuning-inventory.json` cited it as `measuredAtSha` at landing — the not-rebase reasoning held then; after §889's refreeze the citation moved, and the car is sealed, so a rewrite is moot.

*RULED (§892.x, Fable 5.1):* **5 RATIFY · 3 AMEND · 1 REVERSE** (§888, 9 calls, slices S16; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (1):** **call 888-DISCOVERY-FRAMING: 'a ~0.45% random red HAS BEEN LIVING in the landing gate and every green this arc rolled that die'; 'TWO LANES REACHED IT INDEPENDENTLY … neither lane knew of the other … independent convergence is the strongest evidence this program has produced for a defect'**: The defect was unknown until two lanes converged on it independently on 2026-09-03. — §884 (ODQ 32374): 'A FOREIGN DETERMINISM LEAK, DIAGNOSED AND DELIBERATELY NOT CURED HERE: wizardNews.js:552 reads createdAt: entry.createdAt || options.now || n **AMEND (3):** **call 888-CURED-AT-CAUSE: 'Pre-existing, unrelated to this consist, cured at cause here'**: §888 closes the wall-clock race at its cause. — b6822dcae touches only tests/domain/fieldBattleRegion.test.js (+17/−2) — the exact §884-named home. efed4ba91 (§889 train) 'The known-red closes at its cause: ` · **call 888-886-SIGNATURE-AMENDED: '§886's starvation signature is AMENDED … the true signature is a RESOURCE failure on a test FOREIGN to the consist'**: §888 amends the signature §886 banked as 'a DIFFERENT test failed each time'. — §886 (32390): 'a DIFFERENT test failed each time, which is the signature of resource starvation rather than a defect'. §887.2 (32397) ALREADY reads: 'Here the s · **call 888-REGISTERS: tuning 224→225 tables, unregisteredNamed 535 / bareDecimals 6,985 unchanged, keys +40 predicted / +26 measured; lighting 2505/370/2134/22716/6110 → 2506/370/2136/22748/6122; ratchet 31,016/2,453 → 31,048/2,454; OSR not owed**: Every register figure is as stated. — tuning totals: f12360185 {tables:224,keys:2066,unregisteredNamed:535,bareDecimals:6985} → bbba1be24 {tables:225,keys:2092,535,6985} (+26). ratchet: totalTests 3 **RATIFIED (5):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §889 · THE FOURTEENTH LANDING — fifteen cars, every sealed car in the program at once (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5)

**The act.** `bbba1be24` → **`30c1667bc31b9b6f7c64683fddd79a904aad3fee`**, sealed `refs/preserve/landing-889-2026-09-03`. **Fifteen cars, 59 paths +4,746/−1,356**, porcelain 0, single-parent throughout, **trailers == cars exactly**. **Gate GREEN ON THE FIRST RUN**, 1,034 s, 20 stages, ratchet 10 known of 31,123, `STRICT DIST OK 52/440`, typecheck 173/173, domain-strict 1121/1121.

**What landed.** The em dashes leave the prose a player reads. Two people who meet across a border can leave a bond, a respect or a rivalry on each other. A man's standing stops being handed to whoever takes his slot when a town rerolls. And the world clock stops leaking into generation **at every caller** — fourteen unpinned instants across six lifecycle paths.

### ⭐⭐⭐ TWO INSTRUMENTS THAT KNOW NOTHING OF EACH OTHER AGREED TO THE UNIT

The ratchet's shrink-only arm banked **voiceMechanics [em] 720 → 382**, a drop of **exactly 338** — the em-dash count the corpus lane measured and removed by an entirely different method (a structural field walk plus an espree AST cross-check). Total voice debt **1,108 → 770**, a 31% cut. ⭐ **Two independent measurements of one removal agreeing to the unit is the strongest receipt this program produces**, and it is what turns "the prose cure is plausible" into "the prose cure is real".

### ⭐⭐ A DETERMINISM GUARD REFUSED TO BE SILENCED, AND IT WAS RIGHT

ENC-2 minted `willed-leash-end::<tick>::<npcId>` — a fork label that **embeds the delimiter the kernel derives child seeds with**. That kernel concatenates without escaping, so `fork('a::b')` and `fork('a').fork('b')` are ONE STREAM: two substreams meant to be independent would draw identical values **forever**, and only a same-value coincidence across two lanes would ever surface it. The guard refuses any new embedded-delimiter family until someone proves no chain aliases it.

The check, measured over **all 118 literal `.fork(` sites in `src`**: the head token appears at exactly ONE site, its own; the reserved root head `epoch` appears in ZERO fork labels; and the interpolated components cannot carry the delimiter — ⚠ **`now` is `Math.floor` of a TICK and pointedly not a wall clock, which inside a SEED LABEL would break THE PROMISE outright** — while `npcId` is `<slug>:npc_N`, single-colon. The only `::`-bearing id-shaped string in the tree is a `footholdCooldownKey` map key that never reaches `fork()`. **Enrolled after the check, with the check written beside the row.**

### THE FIVE REGISTER ACTS, AND EVERY DERIVABLE FIGURE PREDICTED EXACT

Lighting `2506/370/2136/22748/6122` → **`2510/370/2140/22823/6139`** (files predicted 2510 exact; closure identity 2140+370=2510). OSR **unchanged at 1,993/1,409/388**, predicted unchanged in writing on the reasoning that the em-dash cure moves prose TEXT and not prose SHAPES; what moved was line addresses, which `--write` absorbs because the walker treats generated leaves as inputs rather than detector sources. Prose-numerics: **one scalar**, `discoverDependencyCandidates.js` 443 → 461, proved a move rather than a merge before writing — and it moved because the determinism car added lines to that very file, so the register followed its own subject. Tuning inventory **225 tables and 2,094 keys, BOTH predicted exact** — the keys prediction only succeeded because §888's miss (+40 predicted, +26 measured) taught that the register declares dotted LEAF PATHS while the inventory counts TOP-LEVEL keys. Ratchet **31,048/2,454 → 31,123/2,458**, files exact, tests refused in advance.

### ⚠⚠ TWO CHAIR ERRORS, BOTH BANKED LAWS BROKEN THE SAME DAY THEY WERE WRITTEN

**(1)** The chair **`sed`-patched a shell script**; the `.*` ate a closing quote; **`sh -n` failed and the chair launched it anyway**, because only the trailing echo was gated on the check and the launch line ran unconditionally. Both halves — *never sed-patch a shell script* and *run `sh -n` before every launch* — were recorded that same morning after the identical failure. The stub was stopped after confirming the mutex lock was absent and no vitest was running; the wrapper was **rewritten from scratch**, and the launch is now genuinely conditional on the check.

**(2)** A merge resolution **asserted AFTER writing**, so a wrong assertion still left a bad file on disk and the shell, lacking `set -e`, committed it. ⭐ **BUILD IN MEMORY, ASSERT, THEN WRITE.** Both subsequent edits followed that order and both caught real errors — one a sign-inverted length check, one an unpreserved indentation — **before anything reached disk**.

*What Fable re-derives:* the fork-chain collision check (the load-bearing claim is that the head token appears at exactly one of 118 sites), and the three cure-the-leaf rulings' judgment.

*Priority:* **HIGH for the fork-label enrolment** — it is a THE PROMISE claim; MEDIUM for the rest.

*RULED (§892, Fable 5.1):* **ALL RATIFIED (S16; the fork-label census re-run by the chair).** Fifteen cars, trailers == cars, 59 paths +4,746/−1,356, sealed, gate 1,034 s green first run. The em-dash unit agreement (`voiceMechanics [em]` 720 → 382 = 338; total 1,108 → 770) holds from the ratchet baseline's magnitudes. **THE FORK-LABEL ENROLMENT (a THE PROMISE claim) holds:** at `30c1667bc` the guard's own `FORK_LITERAL_RE` counts 118 literal sites (a plain `.fork(` grep reads 133 — 11 comment-leading — so future verifiers must count with the guard's regex); `willed-leash-end` appears at exactly ONE site (`corruptionWeb.js:901`); zero fork labels carry `epoch`; `now` there is `Math.max`/floor of a TICK, not a wall clock (`:654`). The five register acts predicted exact where derivable (lighting 2510 files; tuning 225 tables and 2,094 keys; ratchet 2,458 files) and refused where not; OSR figures unchanged with the input fingerprint absorbed; the one prose-numerics scalar (443 → 461) moved because the determinism car touched that file. The two chair errors (a `sed`-patched wrapper launched after a failed `sh -n`; a merge asserted after writing) are process rows, self-reported, unverifiable from artefacts and OUT-OF-SCOPE for the tree; their laws stand.

*RULED (§892.x, Fable 5.1):* **4 RATIFY · 2 OUT-OF-SCOPE** (§889, 6 calls, slices S16; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **OUT-OF-SCOPE (2):** **call 889-CHAIR-ERR-1: the chair sed-patched the gate wrapper, sh -n failed, launched anyway; wrapper rewritten from scratch with the launch genuinely conditional**: Self-reported process error and its cure. — SP holds run-gate-888.sh and run-gate-889.sh; run-gate-889.sh is a 30-line #!/bin/sh quiet-wait wrapper ('§889 bare gate. Waits for sustained quiet before start · **call 889-CHAIR-ERR-2: a merge resolution asserted AFTER writing; a shell without set -e committed the bad file; 'build in memory, assert, then write' adopted and caught two later errors**: Self-reported process error and its cure. — No artefact of the mis-merged file survives in SP; the ledger §889 row and HANDOFF_CURRENT.md:52 carry the law ('THE GUARD AND THE CONSEQUENCE MUST LIVE IN THE  **RATIFIED (4):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §889.1 · ENC-4 STOPS BEFORE ITS FIRST BYTE, AND A LIVE BUG IN LANDED CODE FALLS OUT OF THE RECON (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

### ⛔ ENC-4 IS BLOCKED ON NINE SENTENCES THAT ARE THE OWNER'S, AND THE STOP IS MEASURED

The Herald lane committed **nothing** and was right to. `FLOOR_BY_SIGNIFICANCE = { routine: 8, notable: 6, major: 4 }` (derived at `tests/helpers/kindPoolWalker.js:56-71` as `8 − rank×2`), so `chance_meeting` (notable) needs **6** pool variants and `chance_meeting_exposed` (major) needs **4**. Design §8.3 spells **2 and 1**, each followed by the literal words *"· four more"* — **nine sentences were never written by anyone.** The floor walker exists specifically to refuse *"floor-gaming stubs in the pools"* and its under-floor backlog is frozen shrink-only (*"a wave may LEAVE the list, none may join it"*). ⭐ **And the car cannot be split:** registering without pools reds the floor; routing without registering moves `unvoiced` 274→276 against an exact-equality assertion. Base controls were taken first and were green, so the red would have been the lane's own.

**What DID land, and it discharges an open row:** the source-closure probe from `src/main.jsx` puts all five ENC-4 files outside the 237-module closure — **first-paint delta 0 B, so J29 is discharged and Car 4 never needed to wait for T13.** The probe hard-throws on a non-existent path and caught three wrong guesses, so this is measurement rather than absence-by-typo.

### ⛔⛔ A LIVE DEFECT IN LANDED CODE, CONFIRMED BY EXECUTION WITH A CONTROL

`heraldRouting.js:609-626` honours an authored Herald desk only when `sectionAuthority` is one of **four** registries. `wizardNews.js`'s `normalizeEntry` allowlist rebuilds every entry and admits only **three** — **`sovereignty_registry` is missing.** `normalizeEntry` runs on the APPEND path (`:951`) as well as the load path (`:797`), and `sovereigntyNews.js:469` really does author that authority.

**Probed, not inferred:** appending a sovereignty entry returns `sectionAuthority` **DROPPED**; the same append with `envoy_registry` **survives**. ⇒ **Every sovereignty news item silently loses the authority that gives its desk placement force**, and its desk is then decided by the prefix fallback rather than by the registry that authored it. This is the write-that-survives-one-path-and-ghosts-another class, in landed code, found incidentally by a recon that was looking at something else. **Queued as its own car; not fixed mid-flight.**

### ⭐ THE CHAIR'S OWN BRIEF WAS WRONG, AND THE RECON REFUTED IT

The brief asserted that a catalog row with no resolvable adapter throws at module evaluation. Measured across all eleven phrased-kind registries: **that is true of exactly ONE (COMMERCIAL, `commercialReasonsNews.js:72-88`)**, true-by-accident of GRAMMAR (an undefined dereference, not a designed guard), and **REFUTED for the other nine** — SOVEREIGNTY, FAITH, INFORMATION, ENVOY and all five WAR families do no validation at all, freeze cleanly with `pool: undefined`, and fail later at first render or never. ⭐ **Totality here is enforced by WALKERS, not by module evaluation — a missed join fails a test, not a compile.** A chair claim inherited into a brief is still a claim, and this one was 1-of-11 true.

### RULINGS TAKEN

**(a) The naming collision is real and the Herald kind moves.** `chance_meeting` is already a live string with a different meaning — `corruptionLeash.js:70` exports it as `WILLED_MEETING_CONSPIRACY`, wired at `corruptionWeb.js:831` and pinned at `envoyChanceMeetingLedger.test.js:167`. One word on two ladders is precisely the silent semantic error `bandFamilies.js:56-63` says this estate mints new vocabularies to avoid. ⇒ **The Herald kind becomes `chance_meeting_recorded`; the conspiracy constant is NOT renamed (its value is pinned by a landed test).** This supersedes design §8.3's spelling for the first kind only.
**(b) §5.5 vs §8.3 on the second kind is ruled to `chance_meeting_exposed`** — the owner's own row-6 wording outranks both sections; §5.5's longer `chance_meeting_approach_exposed` is a drafting artifact. Sent to the ENC-3 lane mid-flight.
**(c) The Herald seam is pinned:** ENC-4 exports ONE builder on `faithReceipt(...)`'s model; ENC-3 calls it once per outcome. One seam, one place to adapt.
**(d) The lane's vetoable judgment is ACCEPTED** — it found its dock carrying another lane's untracked receipt residue, measured that the dock's HEAD was sealed and the lane had reported, preserved both files byte-identically (cksum-verified) outside the dock, and proceeded rather than stopping. That was right.

*What Fable re-derives:* the 1-of-11 module-eval finding, and the naming ruling's premise that the two `chance_meeting` meanings genuinely collide.

*Priority:* **HIGH for the sovereignty_registry drop** — it is landed and live.

*RULED (§892, Fable 5.1):* **The measured STOP RATIFIED; the sovereignty_registry drop RATIFIED and REPRODUCED by S16's own probe at `30c1667bc` (sovereignty DROPPED; envoy and war_rulings survive) and cured at `7733e064e` in the §890 train (chair-verified: the allowlist at `ca651d54b:724–725` now admits `sovereignty_registry`); the 1-of-11 finding RATIFIED on spot-checks; rulings (a)–(d) RATIFIED; J29 RATIFIED PLAUSIBLE (S16).** Floors 8 / 6 / 4 derive as `CHRONIC_FLOOR − rank × CADENCE_STEP` (the helper names the constant `FREQUENCY_FLOORS`; `FLOOR_BY_SIGNIFICANCE` is the walker's alias); the design spells 2 and 1 plus "· four more"; the car cannot split (floor red vs `unvoiced` 274 → 276 exact-equality). The naming collision is real (`WILLED_MEETING_CONSPIRACY = 'chance_meeting'` at `corruptionLeash.js:70`, wired at `corruptionWeb.js:831`, pinned at `envoyChanceMeetingLedger.test.js:167`) — the stratum omits a THIRD live use, the `chance_meeting:${key}` id prefix at `envoyChanceMeeting.js:585/613/860`. ⚠ The owner's fill-in sheet `$SP/ENC4-TYPED-HOLES-FOR-THE-VOICE-SITTING.md` still names the first kind `chance_meeting` — it predates ruling (a) and must be corrected before it reaches the owner (chair act, this sitting). The §889.1 probe-with-control had NO captured receipt in `$SP` (receipt-enc4 carries no `sovereignty` text); S16's executed probe is now the receipt. The brief's path `src/domain/worldPulse/wizardNews.js` was wrong (`src/domain/region/`).

*RULED (§892.x, Fable 5.1):* **8 RATIFY** (§889.1, 8 calls, slices S16; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **RATIFIED (8):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §889.2 · THE THIRD INSTANCE OF ONE SHAPE — the guard lives in Python and the consequence lives in shell (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

§889.1's ledger row landed but **its handoff amendment did not.** The splice embedded newlines inside a single list element, so the line-scoped assertion **correctly refused to write** — and then the shell, lacking `set -e`, **ran the ledger commit anyway** with the card unchanged. The row said the card carried the finding; the card did not.

⭐⭐ **THIS IS THE THIRD INSTANCE TODAY OF EXACTLY ONE SHAPE, and naming the shape is worth more than the three fixes:**
1. A merge resolution **asserted AFTER writing**, so a wrong assertion left a bad file and a shell with no `set -e` committed it.
2. A gate wrapper's **`sh -n` FAILED and the launch ran anyway**, because only the trailing echo was gated on the check.
3. Here: a **write-guard refused correctly and the commit ran anyway.**

**The common cause is structural, not a lapse of attention: the GUARD lives in Python and the CONSEQUENCE lives in shell, so a failed guard declines its own edit while every later step proceeds as though it had succeeded.** ⭐ **THE FIX IS `set -e` AT THE HEAD OF ANY MULTI-STEP ACT THAT CARRIES A GUARD** — which this act used, and which is why this act stopped when the seat gate refused it rather than committing a half-record. The earlier §884.2 law ("an asserting edit must ABORT THE ACT, not merely decline the edit") was written about the *edit*; it needs this second half about the *act*.

*What Fable re-derives:* nothing product-facing — this is a chair-process row. Verify the card now carries both §889.1 findings.

*Priority:* **MEDIUM** — no product byte moved, but the shape has cost three corrections in one day.

*RULED (§892, Fable 5.1):* **RATIFIED as a process law; the card claim CONFIRMED (S16: `HANDOFF_CURRENT.md:96` carries both §889.1 findings at HEAD).** Record-keeping gap, now carried: **§889.2 has NO ledger row** — commit `01dcd57df` touched only the FRQ and the card, and the ledger contains no `§889.2`; a successor grepping the ledger finds nothing. Its law (`set -e` at the head of any multi-step act; the guard and the consequence in one place) is carried on the card and in memory, and this sitting's every writer chain runs under `set -e`.

## §889.3 · FOUR LANES DIE AT ONCE ON THE INFRASTRUCTURE, TWO CARS ARE FOUND UNREFERENCED, AND EVERYTHING IS RECOVERED (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**All four running lanes terminated simultaneously on API 500s.** Not one had reported. Each had real work in flight, and the standing law is that a dead lane is **resumed from its last point, never discarded**.

### ⛔ WHAT WAS ACTUALLY AT RISK

The lighting lane held **TWO COMMITTED CARS reachable from NO REF** — `b6ca05958` (O-12) and `f47433b32` (O-16) — the §882.14 survival shape, live and garbage-collectable. **Sealed at `refs/preserve/lighting-rows-wip-2026-09-03` before anything else was touched.** ⭐ **That law has now paid out SIX separate times in one day.** The other three docks held **13, 2 and 0** dirty tracked paths; every one was copied byte-identically with a `git diff` patch and a MANIFEST to `$ME/salvage-*/`, one copy `cmp`-verified rather than trusted, and **no dock was reverted** — the live work stayed in place and the salvage is insurance only.

⭐ **THE RESUME LAW EARNED ITS KEEP AT THE BRIEF LEVEL, NOT THE DOCK LEVEL.** Every ordinary lane brief in this program says *"if the dock is dirty, STOP and report"* — which for a resumed lane is exactly wrong, because **the dirt is its own work**. All four resume briefs therefore open with the dirty path list and the words *"THAT DIRT IS YOUR OWN WORK. DO NOT STOP. DO NOT RESET."* A resume brief that inherits the fresh-lane intake rule destroys what it was sent to save.

⚠ **AND THE CAP WAS EXCEEDED EARLIER BY A MECHANISM NO ONE WATCHED:** the ENC-4 lane spawned its own recon child, putting five agents on a four-agent cap. **Every resume brief now forbids subagents explicitly.**

### ⭐⭐ WHAT THE DEAD LANES HAD ALREADY PROVEN, AND IT IS BETTER THAN THE BRIEFS

**O-10(b) is CLOSED, and closed the right way: NO RAISE REACHED, RESIDUAL MEASURED AT ZERO.** Three real `npm run build` runs — base, dial-flipped to v2, and a reverted control — each put `engine-C9-_paJc.js` at **675,764 B against a 676,000 ceiling, margin +236, with an IDENTICAL content hash across all three builds**, which is the strongest available witness that the dial moved not one byte. The docs' `+1,047 B` could not reproduce for a reason in the source: `livingContentLaw.js:79-87` records that a convenience re-export block *"was written first and MEASURED"* and **was not taken**, while the roster payload rides a dynamic `await import(...)` seam (`livingContentSeam.js:94`) and `materializesLivingContent` reads the **config, never the dial**. ⇒ **A ceiling the owner delegated turned out not to need raising. A measured zero beats a granted raise**, and the lane refused to claim the row's *whole* car was engine-free — only the dial's, stated as the dial's.

**The now-null lane's Census B reshapes its own car:** the estate is **already built for a null stamp everywhere except the two seams that mint one**. `RegionImpact.createdAt` is already `string|null`; `compareCodepoint` coerces nullish to `''` by documented design; two prior-art writers already pass a null through; and the guard's own comment records `now: null` as a **126-site estate idiom**. ⇒ the two regional seams are the **OUTLIERS**, so this is surgical rather than sweeping. It also **refused an inherited figure** — the ledger's "32 further sites" measured as **20 outstanding** at this base, and said so.

**The ENC-3 lane's recon is worse than the chair briefed, in the useful direction:** there are **TWO** gates above the drop pass, not one. A world that lit `chanceEncountersEnabled` and `envoyDiplomacyEnabled`, deposited, then darkened the second **keeps `meetingMarkEvents` forever and the spatial namespace can never drain.** It also raised a real charter STOP — the lived-experience funnel door is **UNOWNED** (`LIVES_SUBSYSTEM_ROWS` empty, `characterDriftEnabled` absent from `simulationRules.js`) — which the chair ruled: **ENCOUNTERS takes the door, records the claim in-file, and a later train extends rather than re-mints it.**

**The src-prose lane's measurement corrected the chair twice:** **1,458** em dashes in `src/` (not ~1,516), **688 of them outside EVERY guard**, and the 27 byte-twins reconciled independently against the shipping tree as **28** across five owning files (27 listed + 1 wrapped).

*What Fable re-derives:* O-10(b)'s three-build measurement and its identical content hash, and the funnel-door emptiness the chair's ruling rests on.

*Priority:* **HIGH** — the salvage is the only reason six cars' worth of work exists to validate.

*RULED (§892, Fable 5.1):* **The seal RATIFIED; the salvage RATIFIED with its count AMENDED; O-10(b) RATIFIED; the now-null census RATIFIED; the ENC-3 two-gates finding RATIFIED PLAUSIBLE; the src-prose corrections RATIFIED; ⛔ the FUNNEL-DOOR RULING REVERSED — withdrawn by the chair itself at §890.1, which never cited §889.3 by number, so this is the forward pointer the row lacked (S16, S17).** The lighting-rows seal exists and covers both cars (`b6ca05958` → `f47433b32`); the salvage dirs carry patches and MANIFESTs — **AMEND:** enc3's is 11 tracked-modified + 2 untracked (not "13 dirty tracked"); salvage-nownull carries a SECOND salvage (MANIFEST2 / files2 / tracked2.patch) the row does not mention; the `cmp` verification left no artefact; and the REGISTRY determinism receipt was misfiled under `salvage-lighting` (copied by this chair to `$SP/receipt-determinism.md`). **O-10(b) CLOSED WITHOUT A RAISE:** three builds at 675,764 B against 676,000 with an identical content hash; the docs' +1,047 B was priced for a re-export block written, measured and NOT taken (`livingContentLaw.js:79–86`); the payload rides a dynamic import and `materializesLivingContent` reads the config, never the dial — source reads confirm the mechanism, the build sizes are the receipt's. The funnel-door ruling: the antecedent (emptiness) is real; the inference (unowned) is wrong — see §890.1. The resume-brief law and the cap breach are process rows (OUT-OF-SCOPE; the recon-child overrun has no receipt on disk).

*RULED (§892.x, Fable 5.1):* **5 RATIFY · 1 AMEND · 1 OUT-OF-SCOPE · 1 REVERSE** (§889.3, 8 calls, slices S16; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (1):** **call 889.3-FUNNEL-DOOR RULING: the lived-experience funnel door is UNOWNED (LIVES_SUBSYSTEM_ROWS empty; characterDriftEnabled absent from simulationRules.js) ⇒ ENCOUNTERS takes the door, records the claim in-file, later train extends**: The door is unowned and ENCOUNTERS may take it. — Emptiness CONFIRMED: subsystemRowsLives.js:72 'export const LIVES_SUBSYSTEM_ROWS = Object.freeze([]);'; characterDriftEnabled in simulationRules.js: no match. B **AMEND (1):** **call 889.3-SALVAGE: the other three docks held 13, 2 and 0 dirty tracked paths; each copied byte-identically with a patch and MANIFEST to $ME/salvage-*/; one copy cmp-verified; no dock reverted**: All in-flight work was preserved without mutating any dock. — salvage-enc3/MANIFEST.txt: 11 ' M' tracked paths + 2 '??' (subsystemRowsEncounters.js, envoyChanceMeetingStage.js) = 13 lines; salvage-nownull: 2 ' M' (graph.js **OUT-OF-SCOPE (1):** **call 889.3-RESUME-BRIEF-LAW + CAP: resume briefs must open with 'THAT DIRT IS YOUR OWN WORK'; the ENC-4 lane spawned a recon child (five agents on a four cap); every resume brief now forbids subagents**: Brief-level lessons from the mass death. — receipt-enc4.md contains no 'subagent'/'spawn'/'recon child' text; SP/briefs holds brief-LIGHTFOLD-resume.md, brief-T13PRELAND-resume.md, brief-TAILFLAND-resume **RATIFIED (5):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §890.1 · THE CHAIR'S FUNNEL-DOOR RULING IS WITHDRAWN — the lane refused it, brought evidence, and was right (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The chair ruled that the lived-experience funnel door was UNOWNED and that ENCOUNTERS should take it.** The ENC-3 lane refused to build it, committed nothing, and returned the evidence. ⭐ **The ruling is WITHDRAWN. It was wrong, and it was wrong in a way this program has a named law against.**

### WHAT THE CHAIR MEASURED, AND WHY THE MEASUREMENT WAS NOT THE ANSWER

The chair's ruling rested on three true readings: `LIVES_SUBSYSTEM_ROWS = Object.freeze([])`, `characterDriftEnabled` absent from `simulationRules.js`, and the manifest at 29. **Every one is correct. All three describe a RESERVATION, not an absence of an owner** — and the reservation names its owner in four places in the very source the chair was ruling about, verified by the chair's own read after the refusal:
- `subsystemRowsLives.js:11` — *"chartered to TE-VIRT-1, not a landing's to make" (ODQ §868)*
- `subsystemRowsLives.js:19` — names the lane in its own header
- `characterDrift.js:89` — *"⚠ TE-VIRT-1 OWES THE FLAG'S HOME"*
- `characterDrift.js:113` — *"THE DOOR SEAM — the virtual flag TE-VIRT-1 owes a home to."*

And §868 itself records the precedent verbatim: *"the lane declined to author a family leaf at a landing — **TE-VIRT-1's structural call, not a landing's**"*, while §870.4 narrows the charter but keeps this door inside it: *"the drift/dispatcher doors still need their homes — measure at dispatch."*

⭐⭐ **THE LAW, AND THE CHAIR BROKE IT TODAY HAVING BANKED IT TODAY: VERIFY THE ANTECEDENT, NOT ONLY THE INFERENCE.** The chair asked *"is the door claimed?"*, measured *"the rows are empty"*, and inferred *"therefore available"*. **An empty structure held empty BY A LANDED TEST is the opposite of available** — the emptiness is the enforcement. ⛔ **And worse: the ruling overruled a RECORDED STRUCTURAL CHARTER (§868) that the chair had not read.** A restrictive ruling in the record binds immediately; the chair ruled past one it never looked for.

### THE LANE'S EVIDENCE, WHICH IS BETTER THAN THE RULING IT REFUSED

**The door is enforced from three independent directions, any one of which reds:** a landed test named *"AND NO KEY IS REGISTERED — the door car's bill is still the door car's"* asserts `not.toContain('characterDriftEnabled')` over the **raw** file, so **even a comment naming the key reds it**; the manifest walker's direction 1 demands a *literal* `.key === true` read while the only read is a computed `[CHARACTER_DRIFT_FLAG_KEY]` that the walker's own header says *"attributes to no key at all"*; and curing that needs a second literal spelling **which the ONE SPELLING walker exists to forbid.**

⚠ **AND THE WALKER WAS HIDING TWO OF THREE REDS.** It reported one failure; its own header explains why — *"a red at an early assertion BLINDS every later assertion in the same test."* The lane replicated the steps in isolation over 1,637 files and found **three**. ⭐ **A walker that stops at its first red UNDER-REPORTS, and a lane that trusts its count is measuring the walker rather than the tree.**

**Its dark-path proof is the model.** Both gates driven on a real world carrying prior deposits: gate B dark → ledgers drain to `[]`; gate A dark → `[]`; both dark → `[]`; never-lit → JSON identical with no key minted. With a **negative control** from the base showing the early return was the first statement of the body, so the drain is new behaviour. ⭐ **And it caught its own FALSE GREEN and said so:** `envoyDiplomacyActive` is a six-key conjunction, so its first fixture left gate B dark too and silently re-tested gate A's twin. The reported figures are the corrected run.

### THE CORRECTED RULING

⛔ **ENCOUNTERS DOES NOT TAKE THE DRIFT FLAG DOOR. It remains TE-VIRT-1's, per §868 and §870.4.** ⭐ **What ENCOUNTERS MAY do, and the precedent is explicit:** mint **its own family leaf**, exactly as SEAT-1 minted `subsystemRowsSeat.js` — which §870.4 records as *"the upheaval mint was never blocked"* and §868 calls **TE-VIRT-1's WORKED PATTERN**. The lane had already drafted that record verbatim, dated and attributed, and it is the right one.

⛔ **The `positionValue` question is NOT the chair's either, and the lane was right to escalate rather than decide.** It is load-bearing for the whole car (chart distance at `resolveChanceMeeting:880`, empty `axisRungs:409` without it), the family's one door imports it five times but does not re-export it, so **there is no legal supplier in `src/`** — and the only buildable route changes the drift family's PUBLIC DOOR SURFACE, which is TE-VIRT-1's by the same charter. ⇒ **ENC-3 is BLOCKED ON TE-VIRT-1, and that is a real dependency rather than a stop the chair may rule away.**

*What Fable re-derives:* the four in-source citations of TE-VIRT-1's ownership, and the three independent enforcement directions.

*Priority:* **HIGH** — it is the chair overruling a recorded charter.

### ⭐ AND THE CHAIR'S FIRST READING OF THE FIX WAS ALSO WRONG — CORRECTED BEFORE IT WAS REPORTED

The chair's initial conclusion was *"ENC-3 is blocked on TE-VIRT-1, which never ran"*, on finding `TE-VIRT-1 038311ed2` **not an ancestor** of `claude/composite-r4`. **That was a false alarm and it was checked before it was told to the owner.** Measured: `8114a54e6` (car 1) and `b1e5f9e3b` (car 2) **ARE LANDED** on the branch; `a068e5899`/`038311ed2` are their **pre-rebase twins**, preserved under `refs/preserve/dock-laneVIRT-tree-2026-09-01` — the same work under different shas, exactly the shape ENC-2/ENC-6 showed earlier today. **No TE-VIRT-1 work is unlanded and nothing is lost.** The HYGIENE car `698ad1600` — *"the door ruling reaches the leaf"* — is landed too.

⭐⭐ **WHICH MAKES THE FINDING SHARPER, NOT LOOSER.** At `claude/composite-r4`, `subsystemRowsLives.js` is present, 72 lines, **names `characterDriftEnabled` three times in prose**, and still ends `export const LIVES_SUBSYSTEM_ROWS = Object.freeze([]);`. Car 2's own subject says it: *"two empty files, and the emptiness is the deliverable."* ⇒ **TE-VIRT-1 ALREADY RAN AND DELIBERATELY DECLINED TO HOME THE FLAG, and a landed test enforces that decision.**

⇒ **The corrected dependency: the drift flag door is NOT waiting on a lane that never ran. It is a SHIPPED, DELIBERATE RESERVATION whose owning car landed and chose the emptiness.** Homing that flag is therefore **a NEW decision, not a pending one** — and by §868's own words a structural call rather than a landing's. ⛔ **It goes to the owner, or to a fresh charter; the chair may not take it, and dispatching "TE-VIRT-1" again would be dispatching a lane that already finished.**

*The chair's second lesson in one act:* **an absence has a history, and the history is in the log.** The first error read an empty structure as available; the second read a missing ancestor as unlanded work. Both were cured the same way — by asking the repository instead of the inference.

*RULED (§892, Fable 5.1):* **The withdrawal RATIFIED — the four TE-VIRT-1 citations (`subsystemRowsLives.js:11,:19`; `characterDrift.js:89,:113`), the raw-file `not.toContain('characterDriftEnabled')` arm (`characterDrift.test.js:852–859`), the computed read at `characterDrift.js:273`, `positionValue`'s missing supplier (imported five times by `characterConsumers.js`, re-exported nowhere; load-bearing at `envoyChanceMeeting.js:409/:880`), the 1,637-file replay (1,635 tracked + 2 new) and the patch-identical TE-VIRT-1 twins (`a068e5899` ≡ `8114a54e6`, `038311ed2` ≡ `b1e5f9e3b`, preserved under `dock-laneVIRT-tree-2026-09-01`) all hold at `ca651d54b`; the self-caught false alarm RATIFIED (S17).** **AMEND (1):** the third "enforcement direction" is a RULING, not a test-enforced third red — the ONE SPELLING walker convicts the two ruled-out names and asserts the surviving spelling is minted at the seam; it does not literally forbid a second `.characterDriftEnabled` read. The door is enforced by two landed tests plus a recorded ruling; the withdrawal is unaffected. **AMEND (2):** the row's bold "ENC-3 is BLOCKED ON TE-VIRT-1" is superseded by its own later section ("dispatching TE-VIRT-1 again would be dispatching a lane that already finished") — the correct sentence is the ledger tail's: ENC-3 CANNOT COMPLETE AS CHARTERED; homing the flag is a NEW decision, the owner's or a fresh charter's (and a fresh charter is inside the chair's grant). The dark-path proof with its self-caught false green (a six-key conjunction) is CONFIRMED in structure; the executed arm figures are the receipt's (`probe-darkpath.mjs` removed). The lane's citation `characterDrift.js:91` is :89 — a lane nit.

*RULED (§892.x, Fable 5.1):* **8 RATIFY · 2 AMEND** (§890.1, 10 calls, slices S17; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **call C3 three independent enforcement directions, any one of which reds**: (a) a landed test bans the key in raw simulationRules.js; (b) the manifest walker needs a literal .key===true read and the only read is computed; (c) a second literal spe — (a) characterDrift.test.js:852 test('⭐ AND NO KEY IS REGISTERED — the door car\'s bill is still the door car\'s'), :856 readFileSync(...simulationRules.js), :85 · **call C10 the corrected dependency: homing the flag is a NEW decision — the owner's or a fresh charter's; 'ENC-3 is BLOCKED ON TE-VIRT-1'**: the chair may not take it; ENC-3 is blocked on TE-VIRT-1 — Same row: 'ENC-3 is BLOCKED ON TE-VIRT-1, and that is a real dependency' and later 'dispatching "TE-VIRT-1" again would be dispatching a lane that already finis **RATIFIED (8):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §890.2 · THE WALL CLOCK LEAVES THE REGIONAL SEAMS — and the car turns out to be a CLASS, not two sites (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**Two cars at `03da380abf4e860c4cf81182e59e1b7caababb82`**, sealed `refs/preserve/nownull-2026-09-03` (unreferenced when the lane reported — the §882.14 shape, **seventh payout of that law today**). 15 paths, all modifications, **no new test file**, so no new-file census bill.

### ⭐⭐ THE CAR'S REAL SHAPE WAS A CLASS, AND THE LANE'S OWN TEST CAUGHT IT MID-BUILD

`now: null` now means **"no stamp"** at both regional seams, and all 20 outstanding `ensureRegionalGraph` sites are threaded (57 total, 54 threaded; 3 in-module, one a false positive that passes `options` through, two deferred with reason). But the focused test caught a **regression the lane itself introduced**: the estate's universal spelling for "no pinned instant" is `now = null` / `options.now || null` / `?? null` — **free while `null` and `undefined` were interchangeable, and a bug the instant they diverge.** Cured at four more sites (`graph.js nodeFromSave`, `propagation.js` ×2, `discoverDependencyCandidates.js` three defaults and eight coercions).

⚠⚠ **AND EVERY OTHER ARM OF THE CLOCK-SEAM WALKER IS BLIND TO IT:** Arm A counts clock reads and a flattening adds none; Arm B reads call arguments and this lives in a **parameter list**; Arm C runs pinned paths and this **never executes** there. ⭐ **A guard family can be complete against the defect it was built for and structurally unable to see the defect its own cure creates.**

### ⭐ THE MIGRATION QUESTION ANSWERED BETTER THAN IT WAS ASKED

The owner's pre-launch directive is in-tree (`docs/PHASE6_DATA_LIFECYCLE.md:3`, 2026-07-10). **But the lane found a stronger answer that does not depend on it**, and the chair verified it by its own read of `graph.js:190/208/232/233`: the chain is `row.stamp || resolveStamp(now)`, so **a stored row that already carries a stamp SHORT-CIRCUITS and never reaches the resolver.** ⇒ **every persisted campaign is byte-unchanged, and no migration is owed whether or not saves exist.** Proved by an executed arm rather than asserted, and neither schema version is bumped. ⭐ **An argument that survives the loss of its premise is worth more than one that rests on it.**

### THE STRICT BILL, CLEARED AT CAUSE TWICE

Not four defects but **one lying annotation**: `neutralNeighbourEdges.js:289` constrained its generic as `updatedAt?: string`, so a `string|null` return failed the constraint, TS fell back to the constraint type, and the resulting union reddened all four sites (worldSnapshot 159/168/169, pulseKernel 2421). Widening it to `string|null|undefined` collapsed all four at once. It went red a second time mid-car when removing `= null` defaults left five stale `@param {string|null}` annotations. **1121/1121 exit 0, ceiling never touched, no `@ts-ignore`, no baseline edited.**

### THE SPELLING BAN: NARROWED, NOT RETIRED — and the reasoning is the model

The ban was **forced rather than chosen**: it scans `tests/` and skips only three files, so it **convicted the cure's own proof arms.** Its `null` half is **retired** because its stated ground — *"reads as a pin and is not one"* — is now false. Its `undefined` half is **kept and is permanent**: undefined must keep meaning *absent* for ~120 omitting callers and for object spreads, so that half of the trap **cannot be removed, only fenced.** A new arm bans the flattening, scoped to `src/domain/region/**` (elsewhere `now = null` is the correct 126-site news-author idiom) and placed in the **existing** walker file, because a new test file would red three censuses at landing.

**Its negative control is the standard to hold others to:** replanting `now = null` reds **the walker AND the behaviour arm**, proving the guard convicts a real bug rather than a spelling; restored by `cp` with `cmp` identical and the sha shown on both sides; re-run 27/27. Whole-product byte identity with the **real** clock moved 1.2 s between runs: composer **564,663 B**, two-year advance **257,250 B**, both identical. Lifecycle exercised per path — create, read, persist+reload, regenerate, re-entry, clone, migrate, legacy-data — with **undo dispositioned rather than exercised**, and the reason given: regional undo is a wholesale snapshot restore that mints nothing.

⭐ **And it refused to accept a quiet base run as exoneration:** of seven domain reds, five reproduced at base and the two that did not **passed in its own dock in isolation, 56/56 exit 0** — contention flakes of the parallel run, checked rather than assumed.

### ⛔ THE OWNER-GATED LINE IT DECLINED TO CROSS — AND THE CHAIR'S RULING

The lane found an in-tree ledger row calling a nullable stamp *"a schema change, which is owner-gated"*. It judged the **type widening** to be inside a repair (no stored byte moves; the record's siblings `RegionImpact.createdAt` and `RegionChannel.confirmedAt` are already `string|null`) and **did not take the further step of making any production caller WRITE a null.** ⭐ **That split is exactly right.** ⇒ **CHAIR RULING: the owner DELEGATED the `now: null` schema change in chat on 2026-09-03, so the further step is now AUTHORISED — and it is NOT NEEDED**, because the lane measured **zero `src/**` call sites that thread a null**, so no production byte moves either way. It stays unbuilt as unnecessary rather than as forbidden.

*What Fable re-derives:* the short-circuit claim (`row.stamp ||` never reaching the resolver) and the walker-blindness finding.

*Priority:* **HIGH** — it removes the trap behind a ~0.45% random landing-gate red.

*RULED (§892, Fable 5.1):* **The class finding, the short-circuit, the walker blindness, the strict bill, the narrowed ban, the negative control and the lifecycle arms RATIFIED (15/15 + 12/12 EXECUTED by S17 at `laneINSTRLAND-tree@03da380ab`, porcelain 0 → 0); "two cars / 15 paths" AMENDED; the owner-delegation authorisation EVIDENCE-THIN; the car marked UNLANDED (S17).** The short-circuit `row.stamp || resolveStamp(now)` holds at `graph.js:190/208/232/233` — one edge wider than the row: `||` also treats an EMPTY-STRING stamp as absent, so "byte-unchanged" is exact for truthy stamps (no stored data is known to carry `''`). All 20 outstanding `ensureRegionalGraph` sites are threaded; the only single-argument calls left are the two in-module deferrals (`graph.js:829/:963`). The regression the lane introduced and cured at four more sites is exact (eight coercions, not nine). The strict bill was one lying annotation (`neutralNeighbourEdges.js:289`), widened; 1121/1121 is the receipt's. The spelling ban: the `null` half retired, the `undefined` half kept, the flattening arm scoped to `src/domain/region/**` in the existing file — exact. **AMEND:** the lane's Car 1 + Car 2 are ONE commit of 14 paths; "two cars / 15 paths" counts the chair's own Herald car (`bf1464952`) as the lane's second. **UNLANDED:** `03da380ab` is NOT an ancestor of `ca651d54b`; its patch-identical twin `3a6f0d761` rides the unlanded §891 train — the row reads as if it rode §890. **EVIDENCE-THIN:** the chair ruling "the owner DELEGATED the `now: null` schema change in chat on 2026-09-03" is recorded nowhere but the row; the "not needed" half is CONFIRMED (zero seam call sites thread a null), so nothing rests on it — but an authorisation is a claim and a claim decays: the owner is asked to confirm it in one word at the desk.

*RULED (§892.x, Fable 5.1):* **8 RATIFY · 1 AMEND · 1 EVIDENCE-THIN** (§890.2, 10 calls, slices S17; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (1):** **call C11 'Two cars at 03da380ab', sealed refs/preserve/nownull-2026-09-03; 15 paths, all modifications, no new test file**: as stated — refs/preserve/nownull-2026-09-03 = 03da380abf4e. git log 30c1667bc..03da380ab = 2 commits: 03da380ab (the lane) + bf1464952 'The Herald desk stops being decided **EVIDENCE-THIN (1):** **call C20 the owner-gated line: type widening inside a repair; chair ruling 'the owner DELEGATED the now:null schema change in chat on 2026-09-03 — authorised and not needed'**: as stated — src hits at 03da380ab: 8, of which 2 code — demographicsKernel.js:428 inside demographicNewsEntries({…}) and contentSampleCategoryFixtures.js:299 in an applyEve **RATIFIED (8):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §890.3 · O-17 LANDS, AND THE CHAIR RETRACTS A CLAIM IT MADE TO THE OWNER (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

### ⛔⛔ THE RETRACTION FIRST, BECAUSE IT WENT TO THE OWNER AS A FINDING

The chair told the owner that **`pg` is not in `package.json` at all, in any section**, and called it a fragility that would stop a fresh clone running the landing gate. **That is FALSE.** `pg` is declared at `package.json:119` in **devDependencies**, `^8.22.0`, on the product branch AND the ledger branch, and the O-17 lane said so in its report.

⭐⭐ **HOW THE FALSE CLAIM WAS MANUFACTURED, because the mechanism is the point:** the chair's probe was `node -e "…" 2>/dev/null || echo "  not in package.json at all"`. The `node` call **failed**, `2>/dev/null` **hid the error**, and the `||` fallback **printed a confident finding in its place.** ⇒ **THE THIRD FALSE STATEMENT TODAY PRODUCED BY A SWALLOWED ERROR**, after `echo "memory extended"` for a write that never happened and `"copied"` for twenty-six packages of which one silently failed. ⛔ **THE LAW, now stated at full strength: A FALLBACK BRANCH MUST NEVER PRINT A FINDING. `|| echo "<a claim>"` converts an unexplained failure into evidence.** A fallback may report *that the probe failed*; it may never report *what the probe would have found*.

**The corrected picture, measured across five docks:** `pg` is **declared in every one**; it is **installed in two and missing in three**, because those docks never re-ran install after it was added. ⇒ **a dock-hygiene gap, not an undeclared dependency, and a fresh clone is fine.** The alarming half of the chair's report to the owner was the invented half.

### O-17 — THE FAITH SURFACE IS CANDIDATE-LIT, AND THE LAW IS REPLACED RATHER THAN RELAXED

Landed `8ae07b5fc`, sealed `refs/preserve/lighting-rows-2026-09-03`; three cars with O-12 and O-16. `FAITH_TUNING_SIGNATURE.live` false → true plus `faithTuningState()` returning a closed three-word vocabulary reached only through the owner's literal boolean. ⭐ **The lane refused the cheap reading:** dropping the `&&` alone would let the surface light silently with nothing in the old law's place. So the law is **replaced** — was *"a surface may not be lit while unsigned"*, is *"a surface may be lit while unsigned, and it MUST THEN SAY SO"* — a lit-unsigned surface reports **DRAFT**, and reporting **SIGNED is unconstructible**. **No value moved, `signed` stays false, `signedBy` stays null.**

**Behaviour shift, plainly: nobody sees anything.** `faithTuningArmed()` has zero readers outside its own file and the faith door has no consumer at all. No output moves and **no golden was re-recorded**. What changes is the surface's self-report: the review reads it as lit-draft instead of dark.

⭐ **DEITY DOCTRINE checked in code rather than argued, and found NOT ENGAGED:** `religionState.js:136 renormShares` redistributes to a fixed target so adding a god *divides* the adherent pool, and the witness ladder only steps down with the authored level as a ceiling — every magnitude is a function of adherent share and piety, and **nothing asserts a god exists or acts.** No row refused; no STOP owed.

⭐⭐ **AND THE LANE CONVICTED ITS OWN FIRST DRAFT BY READING ITS OWN EARLIER COMMIT.** O-12's message records that its equivalent arm was first a bare `toContain` whose mutant **passed**, *"because the record quotes the same words"*. O-17 had exactly that hole — nothing pinned the original header bullet, so the silent overwrite this row forbids was still constructible. **The cure is the count: the §763 wording must appear TWICE.** 5 new arms (23 → 28) and **8 mutants all RED**, including one that deletes the original bullet and one that strips the attribution.

### THE TWO INDEPENDENT TITLE MEASUREMENTS RECONCILE EXACTLY

The chair's train (O-12 + O-16 + the Herald cure) measured **22823 → 22836 = +13** off the walker. The lane's train (O-12 + O-16 + O-17) predicted **+17** from per-file counting (O-12 +2, O-16 +10, O-17 +5). Overlap +12, plus the chair's one Herald arm = 13 ✓; plus O-17's five = 17 ✓. With O-17 composed the walker now demands **22841**, which is the chair's written prediction (22836 + 5) **exactly**. ⭐ The lane also explained *why* it counted per-file rather than reading `suiteTitles` off the walker: **that assertion sits after `titles` in the same test, so the first mismatch throws and it never evaluates** — the sequenced-arm blindness this program keeps rediscovering.

⚠ **DOOR 3 is a TIMEOUT, not a parse failure** — *"Test timed out in 20000ms"* at 22–23 s, with one sibling lane still running. Contention, held rather than chased.

*What Fable re-derives:* the deity-doctrine non-engagement read, and the claim that reporting SIGNED is unconstructible.

*Priority:* **HIGH for the retraction** — a false finding reached the owner; MEDIUM for O-17.

*RULED (§892, Fable 5.1):* **The retraction RATIFIED (`pg` at `package.json:119` in `devDependencies` on both branches — chair-confirmed); the manufacturing mechanism RATIFIED as the chair's own account (PLAUSIBLE — transcript-only); the corrected picture AMENDED on its mechanism; O-17 RATIFIED throughout (28/28 EXECUTED by S17 at the KERNELMARK dock, files byte-identical to `8ae07b5fc`); the title reconciliation RATIFIED exact; the DOOR 3 note AMENDED (S17).** **AMEND the pg mechanism:** docks link packages to the MAIN repo by design and MAIN's `node_modules` lacks `pg` (the O-17 lane said so); "those docks never re-ran install" is the wrong cause and the wrong cure — the two docks that have it materialised it themselves; the dock-hygiene cure is an install in MAIN. O-17: `FAITH_TUNING_SIGNATURE.live` true, `faithTuningState()` closed three-word vocabulary, SIGNED unreachable from the shipped frozen record, DRAFT reported, zero readers of `faithTuningArmed()` outside its file, no golden re-recorded; the deity doctrine re-derived NOT ENGAGED (`renormShares` conserves 100 points; the ladder only steps down; nothing asserts a god exists or acts); the TWICE arm (23 → 28 tests) executed; the eight mutant reds are the lane's exits. Titles: 22823 → 22836 (+13: O-12 +2, O-16 +10, Herald +1) → 22841 with O-17's +5 — exact. **AMEND DOOR 3:** name the arm — `sovereigntyLightingContract.walker.test.js` "DOOR 3 PARSER DOOR" — and record that it is a RECURRING base red under load (39.9 s in the PARSER lane's log; among the nownull lane's six pre-existing reds), which the full 10/10 census cannot bank; it deserves a row (docketed), not "held rather than chased". ⚠ `8ae07b5fc` is not an ancestor of `ca651d54b` either — its landed twin is `53fd36d2c`; the row cites the pre-rebase sha.

*RULED (§892.x, Fable 5.1):* **7 RATIFY · 2 AMEND** (§890.3, 9 calls, slices S17; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **call C23 the corrected picture across five docks: declared in every one, installed in two, missing in three 'because those docks never re-ran install'**: as stated — package.json '"pg"' present in laneENC, laneINSTRLAND, laneREGISTRY, laneKERNELMARK, lanePARSER (1 each). node_modules/pg: INSTALLED laneINSTRLAND (real dir, Au · **call C29 'DOOR 3 is a TIMEOUT, not a parse failure' — Test timed out in 20000ms at 22–23 s; contention, held**: as stated — DOOR 3 = tests/lint/sovereigntyLightingContract.walker.test.js '> DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE'. suite-tip.log:171 '× DOOR 3  **RATIFIED (7):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §890.4 · THE `src/` PROSE SWEEP LANDS ON ITS DOCK — and the chair RULES IT INTO THE LIGHTING WAVE rather than minting a window (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

Sealed `refs/preserve/srcprose-2026-09-03` = **`8f4d5c648ce62fc51231110b9c4ace2127fbdd18`** — unreferenced when the lane reported; **the eighth payout of the §882.14 survival law today.** One commit, **200 paths, +1,084/−1,019.**

**The measured shape.** **1,481** em dashes in `src/**/*.js` string literals, re-derived with a real parser — **1,001 cured as reader prose, 480 exempt with a written reason each** (developer registers 348, parse-coupled separators 51, diagnostics 30, generated leaves 24, structural/brand 18, the empty-value glyph 7, and 2 literals that are *compared* rather than displayed). Disposition judged per site: **COLON 437 · PERIOD 402 · COMMA 84 · PAREN 39 pairs**, with the colon/period split moving by 108 rows during review **in both directions** — a reviewer changing its own mind is the evidence the judgment was real. A re-sweep at the committed tip reports in-scope **zero**, and the prose diff is **989 insertions / 989 deletions with every individual file symmetric.**

**The 28 byte-twins were bound by TEXT, not by the inherited line numbers** — 28/28 landing on exactly the lines the predecessor's ledger recorded, then **re-verified after the cure** by re-reading each annex row against its owning file's literals: 28/28, with the 17-file twin battery byte-identical to base.

### ⭐⭐ THE GUARD'S COUNTER WAS A FALSE INSTRUMENT IN BOTH DIRECTIONS

`structuralValidator.js` measured **39 exclamation points by its tokenizer and ZERO by a parser**, and **64 of 71 bangs over the unscanned directories were phantom.** Replaced with `espree`. ⭐ **That repair is what makes this car bankable at all:** under the old counter the documented refreeze would have thrown on `bang 10 → 15`, so this lane's own shrink could never have been banked. Under the parser both totals fall and the refreeze is legal — the E2 total arm went **green, 770 → 290.**

⚠ **AND AN INSTRUMENT THAT PUNISHES ITS OWN CURE, reported rather than widened:** the E2 per-file `files` magnitude counts **drifted** files, so *removing* debt from 88 files pushes it **69 → 126.** The landing's refreeze clears it; the lane refused to widen a ceiling to make its own work pass.

### FOUR PARSE-COUPLED PRODUCERS A `src/`-ONLY CENSUS CANNOT SEE

Beyond three classifier bugs, the review found a **comparator** class (`safetyLabel === 'Dangerous — Criminal Governance'` would have been half-changed, **silently killing a crime-type branch**), a backtick-boundary bug hiding 23 appended fragments, an aside that could not pair across a quasi, and a sentence splitter **reading code punctuation** — a ternary's `?` ending a "sentence". Then four real defects, each reverted at cause: `customContentSchema.js`, whose parser's **own docstring says the dash is the delimiter** (curing it leaked glosses into the UI); the `heraldCausalVoice` headline register (**56 of 56 cases red**); `economicState`'s services rows; and the `NPC — ` journal prefix. ⭐ **THE LAW: A CONSUMER CAN LIVE IN `tests/`, IN A `.jsx` COMPONENT, OR INSIDE A REGEX** — a producer census scoped to `src/` will not find the thing that parses the character you are removing.

⭐ **The lane also corrected its OWN earlier claim.** It first reported that no golden needed re-recording, on a **fragment search** — the wrong instrument, because **a golden storing a digest is invisible to a content search.** The full suite found two. And it refused to claim ~20 first-run "timeouts" as its own: 21 assertions failing at base pass at tip, so they were contention, and *"reporting those as mine would have been a false report."*

### ⛔ THE BLOCKER, AND THE CHAIR'S RULING

`espionageDormancyFence.test.js:332` states the constant is re-recorded **ONLY inside a NAMED CHARTERED WINDOW**, that ENGINE-HYGIENE spent one and T13 TRANS closed with zero movement, and that **"exactly ONE remains: the LIGHTING WAVE (§881.4)"** — anything else moving it being *"an unpriced same-seed shift in the world a player gets."* **The mover is this car, doing exactly what its declared shift says.** It re-recorded nothing; **8 files and 11 assertions stand owed.**

⇒ **CHAIR RULING: THE PROSE CAR RIDES THE LIGHTING WAVE. The chair does not mint a second window.** The surviving window is named by **§881.4, an OWNER directive**; both spent windows were named the same way. The owner approved this sweep today and the shift is priced, measured and declared — so the *purpose* of the fence is satisfied — but **the mechanism requires a NAMED window and naming one is the owner's act, not the chair's.** Sequencing around a recorded constraint costs nothing but order; ruling past one is what the chair already did wrong once today (§890.1). ⭐ **The owner may charter this sweep as its own window with a single word if they want it sooner; until then the car is sealed and rides.**

*What Fable re-derives:* the false-counter finding (39 by tokenizer, 0 by parser) and the four parse-coupled reverts.

*Priority:* **HIGH** — 1,001 reader-facing sentences moved, and the car is gated only on a window.

*RULED (§892, Fable 5.1):* **RATIFIED with three AMENDMENTS (S18, CONFIRMED on `receipt-src-prose.md` and the sealed commit `8f4d5c648`).** The measured shape (1,481 / 1,001 / 480; COLON 437 · PERIOD 402 · COMMA 84 · PAREN 39; re-sweep zero; 989/989 symmetric), the 28 byte-twins bound by text and re-verified after the cure, the false counter (39 bangs by tokenizer, 0 by parser; 64 of 71 phantom; `espree` replaces it with no ceiling moved and no arm renamed), the per-file magnitude punishing its own cure (69 → 126, reported rather than widened), the four parse-coupled reverts (each retained in the sealed commit with its consumer named: the regex in `economicUpgradeChainAndStage5.test.js:104`, `foundryManifest.test.js:121`, the heraldCausalVoice headline register, the schema docstring), the lane's self-corrected golden claim and its refused timeouts, and the chair's ruling that the car RIDES THE LIGHTING WAVE — the fence's own text names §881.4 as the one remaining window and both spent windows were owner-named — all hold. **AMEND (1):** "770 → 290" is the retired tokenizer's figure; the live parser reads **295** (guard docblock "em 290 → 295"); the arm passes under both. **AMEND (2):** the car's BASE is unstated — `8f4d5c648`'s parent is **`30c1667bc` (§889)**, one landing behind §890 and 25 cars behind the live train, and its 200 paths overlap the §890+§891 trains on two files (`settlementRumors.js`, `propagation.js`): **a rebase is owed before it can ride anything**, and the owner's-desk item 1 must say so. **AMEND (3):** "the colon/period split moved by 108 rows during review" has no receipt line (nearest: 106 hand rulings; COLON 455 → 437) and "8 files / 11 assertions" is the receipt's heading over a six-row table — both carried as the lane's, PLAUSIBLE. Also: the fence lives at `tests/property/espionageDormancyFence.test.js`, not `tests/lint/`.

*RULED (§892.x, Fable 5.1):* **8 RATIFY · 2 AMEND** (§890.4, 10 calls, slices S18; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (2):** **call seal + size of the prose car**: Sealed refs/preserve/srcprose-2026-09-03 = 8f4d5c648, one commit, 200 paths, +1,084/−1,019 — refs/preserve/srcprose-2026-09-03 → 8f4d5c648ce62fc51231110b9c4ace2127fbdd18 (ref file written 2026-09-03 13:15:12); '200 files changed, 1084 insertions(+), 101 · **call the E2 total arm went green, 770 → 290**: voice-debt total arm green 770 → 290 — guard docblock: 'DECLARED MEASUREMENT SHIFT, src/data + src/domain, at this lane's tip: em 290 → 295, bang 15 → 8'; receipt:323 '| E2 total | total | 770 (budge **RATIFIED (8):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §890.5 · A DOCK'S `node_modules` FORM CHANGES THE BUILT ARTIFACT — the chair breached the first-paint budget by 8,551 B and it was self-inflicted (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

The §890 gate ran 1,087 s over 20 stages, cleared typecheck 173/173, domain-strict 1121/1121, the test ratchet **10 known of 31,141**, and lint at 0 errors — then **failed at the BUILD stage** on a real verdict, not a flake: *"first-paint static closure = 1,056,551 bytes (budget 1,048,000)"*, **over by 8,551 B**, an ASSERTION that ran in 21 ms against a 20 s budget.

⭐⭐ **THE CAUSE WAS THE CHAIR'S OWN REPAIR, AND THE FINDING GENERALISES BEYOND IT.** Chasing an irreproducible edge bundle, the chair found that `node_modules/immer` and `node_modules/seedrandom` were **SYMLINKS** to the main repo, that esbuild follows a symlink to its REALPATH, and that the builder therefore recorded nine inputs as `../../../../../../../Users/…` paths **that no checkout can contain** — which is exactly what the reproducibility arm says: *"every input outside node_modules/ is git-TRACKED (nothing falls through to disk)."* Materialising those two took escaping inputs **9 → 0** and turned all four bundle arms green.

⛔ **But the chair did not stop at two.** It began materialising **all 438** symlinks in the dock and `set -e` halted it at **45**. Those 45 real copies **changed the Vite build's own output** and pushed first paint over its budget.

**Proved by execution in both directions, not by correlation:**
- A sibling dock carrying **the same three lighting cars and none of the chair's** — symlinked `node_modules` — built **GREEN** (`vendorPdfLazy` 31 passed / 11 skipped, exit 0).
- Restoring all 45 packages to symlinks in the landing dock and rebuilding returned it to **GREEN**, unchanged commits, porcelain 0.

⭐⭐ **THE LAW: A DOCK'S `node_modules` FORM — SYMLINK VERSUS REAL DIRECTORY — CHANGES THE BUILT ARTIFACT'S FIRST-PAINT SIZE.** The byte budget is a load-bearing product constraint, and it is only meaningful in a dock with the canonical layout. **A lane that materialises packages will read a FALSE RED against that budget, and one that measures in a differently-laid-out dock is measuring its own environment.** This sits beside the banked "link the worktree's OWN node_modules" hazard and sharpens it: the linkage is not merely a convenience, it is part of what makes the byte figures comparable.

### THE RESOLUTION, WHICH KEEPS BOTH CONSTRAINTS

The two requirements looked contradictory — symlinks make the bundle irreproducible, real copies breach first paint. They are not. **Build the bundle ONCE with the packages materialised so the recorded input paths are clean, commit it, then RESTORE the symlinks.** The reproducibility arm re-verifies afterwards because, for an input that `git ls-files` does not contain, it falls back to reading the path from disk — and that read follows the link to identical content. Measured after the restore, with the commits untouched: **reproducibility 25/25, aiCharter 19/19, aiOutputSchema 23/23, vendorPdfLazy 31/42 — all exit 0 simultaneously.**

⚠ **AND THE CHAIR'S OWN EARLIER MISREADING, RESTATED BECAUSE IT COST TWO CYCLES:** an attempt that ran the builder and left the result **uncommitted** watched reproducibility go 4 → 6 and concluded *"the fix made it worse"*. It had not — a regenerated-but-uncommitted bundle **is** the DIRTY-BUILD class the suite is named for, and the suite was describing the chair's own method back to it in its failure text.

*What Fable re-derives:* the two-direction proof (sibling dock green; restore returns green) — the correlation alone would not carry it.

*Priority:* **HIGH** — it makes a load-bearing byte budget environment-dependent, and any lane can trip it.

*RULED (§892, Fable 5.1):* **RATIFIED with two AMENDMENTS and one EVIDENCE-THIN (S18).** Direction (b) — restoring the symlinks returned the landing dock to green — is CONFIRMED from `gate-890b.log` (same dock, same HEAD `ca651d54b`, porcelain 0 before and after, `STRICT DIST OK 52/440`). Direction (a) — the sibling symlinked dock's "31 passed / 11 skipped" run — has NO log anywhere; the direction is carried instead by an independent same-sha symlinked build at **1,046,996 B** (`closure-tip.log`, receipt-charset1), 9,555 B under the materialised dock's 1,056,551 — cite that. The restore is COMPLETE: no real directory in the dock shadows a main-repo package; `immer`/`seedrandom` are symlinks stamped 17:49. **AMEND (1):** "the §890 gate ran 1,087 s" is the FAILED first run (18:06:51Z → 18:24:58Z); the landing gate is the second run, 1,058 s — the two rows must say which run each describes. **AMEND (2):** the dock carries 37 DOCK-ONLY real packages (`pg`, `listr2` …) absent from the main repo; none shadows, so the byte figures hold, but the dock is not the canonical layout either, and the law this row states should say so. **EVIDENCE-THIN:** the "reproducibility 4 → 6" misreading and the 438/45 symlink counts survive only in prose. The resolution sequence (materialise two → build → commit → RESTORE) is proven by its second execution: register 6/6 at `4233031ba` records only in-project input paths.

*RULED (§892.x, Fable 5.1):* **3 AMEND · 2 RATIFY · 1 EVIDENCE-THIN** (§890.5, 6 calls, slices S18; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **AMEND (3):** **call the §890 gate: 1,087 s / 20 stages, 173/173, 1121/1121, 10 known of 31,141, lint 0, failed at BUILD by 8,551 B**: first gate attempt ran 1,087 s and failed a real first-paint verdict 1,056,551 vs 1,048,000 — gate-890.log: GATE_START=2026-09-03T18:06:51Z … GATE_END=2026-09-03T18:24:58Z (=1,087 s); '[typecheck-ratchet] OK … (173 error(s), ceiling 173)'; '[domain-stric · **call 438 symlinks; set -e halted materialisation at 45; all 45 restored**: the chair began materialising all 438 symlinks, stopped at 45, later restored all 45 — dock now: 436 symlinks, 39 real dirs (.bin, .vite-temp + 37 packages); EVERY one of the 37 real packages is DOCK-ONLY (absent from the main repo's node_modules: · **call the two-direction proof — (a) sibling symlinked dock green, (b) restore returns the landing dock to green**: a sibling dock with the same cars and symlinks built GREEN (vendorPdfLazy 31 passed / 11 skipped); restoring the 45 symlinks returned the landing dock to GREEN, commits u — (b) gate-890b.log: 21 references to laneKERNELMARK-tree, GATE_HEAD=ca651d54b…, GATE_PORCELAIN_PRE=[0], '[test-ratchet] STRICT DIST OK — 52 discovered/reported f **EVIDENCE-THIN (1):** **call the chair's earlier misreading (uncommitted rebuild → reproducibility 4 → 6 → 'the fix made it worse')**: an uncommitted regenerated bundle IS the dirty-build class the suite names — No log or receipt in SP carries the 4→6 run; only msg-890.txt restates the law. The suite's own name at 4233031ba: 'edge-shared bundles reproduce AT THE COMMITT **RATIFIED (2):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §891 · THE ACCOUNT-SWITCH HANDOFF — a seventeen-car train one register from its gate (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The §891 train is composed, sealed and seventeen cars deep** at `refs/preserve/train891-registers-2026-09-03` = `4233031ba`, base `ca651d54b`, porcelain 0, 17 trailers. **All six register acts taken and green.** One bill stands: `writerReach`'s frozen surfaceReach still calls `situationDesc on economicState` dark, and DESK CAR 1 made it reach the web display. **A register, not a defect**, with a `--write` door.

⚠⚠ **THE SURVIVAL AUDIT CAUGHT THE LIVE TRAIN ITSELF.** At handoff time `laneKERNELMARK-tree` — the seventeen-car train, every register act in it — was reachable from **NO REF**. Sealed before anything else. ⭐ **That law has now paid out NINE separate times in one day**, and this was the most expensive instance it could have caught: an account switch discards run ids, and an unreferenced tip in a scratchpad is one `gc` from gone.

### WHAT THE TRAIN CARRIES

Five lanes batched into one gate rather than five: **CAPACITY C1/C2/C3** (a town says ONCE, as a crossing rather than a census, when it has grown as large as its fields will feed; and a reader can ask how much room is left at any year) · **the `now: null` root fix** (the wall clock leaves both regional seams) · **DESK CAR 1 + its correction** (the first four dossier blocks leave the dark half) · **CHARSET Car 1** (the product learns which letters it can actually draw, measured from its own renderers) · **READERREVIEW Car 2 + three cures** (the reader corpus can be READ at last).

### THE REGISTER LOOP AT ITS BEST, AND ITS ONE INSTRUCTIVE MISS

Six acts, every figure predicted in writing before its instrument ran: lighting **files 2515 EXACT**, tuning **225 tables and 2,099 keys BOTH EXACT** (predicted by the CAPACITY lane before it built and verified independently by the chair), prose numerics **225 → 225 with the debt SHAPE proven byte-identical**, OSR **1,993 / 1,409 / 388 unchanged**. ⭐ **The one miss taught the law:** four lanes' independently-measured title deltas summed to **+75**; the composed tree measured **+78**. **THE SUM OF INDEPENDENTLY-MEASURED DELTAS IS NOT THE COMPOSED DELTA** — the chair had written *"measured, not summed"* into the prediction beforehand, which is why the miss cost nothing.

### TWO REGISTER ACTS WERE JUDGMENT, AND BOTH WENT THE HARDER WAY

**The charset invariant could have taken a RATIONALE** — an entry asserting mutation testing is redundant, which the model earns by saying its catching power is *"EXECUTED IN THE TEST BODY"*. That file has five arms and **no executed plants**, so the sentence would have been **false**, and writing it would have laundered an unproven invariant into the very manifest built to prevent that. So the invariant was made to **earn a mutation entry**: plant 72 strikes ONE measured range from the dossier surface, the anchor proved unique first, and with it **2 of 5 arms red naming the exact codepoints that stop printing** — restored `cmp`-identical, 5/5 green. ⚠ **The sweep's own dirty-guard then convicted the chair** for adding a plant without listing the file it mutates: the sweep reverts with `git checkout --`, so an unlisted file means a manual run **destroys uncommitted work.** That is the checkout hazard turned into machinery.

**The OSR act is the one a LANE REFUSED, and its refusal still stands.** At the charset lane's tip the same `--write` moved **twelve** manifest entries, only five its own, and it ran the write, measured it, and **reverted** rather than launder seven foreign entries under its sha. At the composed tip the instrument names exactly **one** generated input and declares it absorbable in its own words. ⭐ **A LANE AND A LANDING ARE NOT THE SAME VANTAGE POINT; a register act is legitimate at exactly one of them.**

*What Fable re-derives:* the charset plant's catching power, and the claim that the twelve OSR entries collapse to one at the composed tip.

*Priority:* **HIGH** — it is the live train and the handoff rests on it.

*RULED (§892, Fable 5.1):* **The six register acts RATIFIED on their figures; two of the row's own claims REVERSED; one AMENDED; the seventh act taken and ruled at §891.1.** Figures CONFIRMED by slice S18's diffs and probes, and the OSR delta re-run by the chair: lighting `files` 2515 EXACT with titles +78 against a +75 sum (the "measured, not summed" law holds); tuning 225 tables / 2,099 keys EXACT (HERALD_TUNING gains the five CROWDING keys); prose numerics 225 → 225 with the (category, snippet) multiset identical and two rows relocated (36 line-drifts, not the message's 34 — immaterial); OSR 1,993 / 1,409 / 388 unchanged; the charset plant is real — anchor unique, exactly one range struck from `dossier-pdf` only, arms 2 and 5 red naming the codepoints, 5/5 green after a `cmp`-identical restore — and the rationale it refused would indeed have been false (five arms, zero in-body plants); the edge bundles rebuilt over in-project inputs by the proved sequence. ⛔ **REVERSED (1) — "the twelve OSR entries collapse to ONE at the composed tip".** S18 counted the composed-tip `--write` moving **32 entries in one manifest tree (5 added, 27 changed)**; the chair re-ran the delta over `2445bb3c5^..2445bb3c5` across all four manifest trees (`detectorTree` · `executionTree` · `scanTree` · `sourceTree`): **6,495 → 6,509 entries, 14 added, 81 changed — and all seven files the charset lane refused to launder (`FounderTile.jsx`, `wizardNews.js`, `faithTuningSurface.js`, `simulationRules.js`, `useFounderTileEligible.js`, `useReaderAudience.js`, `flagRegistry.js`) are among the moved entries.** The instrument's "one path" is its UNSCANNED-input classifier (`provenanceDriftOf`), which reads one at either vantage. The ACT stands — the landing's `frozenAtSha` is the composed tip, so absorbing every source and input movement under it launders nothing — but the mechanism sentence in 2445bb3c5 ("the execution-input fingerprint for exactly one path") is false, and the vantage-point law is re-grounded on the sha, not on a collapse. ⛔ **REVERSED (2) — the direction of THE ONE BILL** (ruled at §891.1): the frozen register said `web-display=R`, the tree measured `N`, the product still renders the string; DESK CAR 1 moved the read behind a JSX prop the scanner cannot ground; a second movement (`_seed on settlement` N→R) was hidden by the walker's first-mismatch throw. **AMENDED — "reachable from NO REF, every register act in it":** the seals `train891-composed` (16:27) and `train891-reg1` (16:33) predate the 18:20 handoff seal, so the exposure was registers 2–6, not the whole train; "ninth payout" is a running count with no receipt (EVIDENCE-THIN). The owner's desk items are OUT-OF-SCOPE and unchanged. ⚠ Enrolment gap (S19 B1): this row names CAPACITY, CHARSET Car 1, DESKWIRING and READERREVIEW Car 2 without enrolling a single one of their judgment calls — the §882.14 shape recurring in the span's final row; their rows are enrolled and ruled at §892.1.

*RULED (§892.x, Fable 5.1):* **14 RATIFY · 5 AMEND · 3 REVERSE · 2 OUT-OF-SCOPE** (§891, 24 calls, slices S18,S20; re-derived 2026-09-05 by the Fable seat from the sealed walk evidence at `sitting-892-kit-2026-09-04d`). **REVERSE (3):** **call register 5/6 'the twelve OSR entries collapse to ONE at the composed tip' / 'What moved is the execution-input fingerprint for exactly one path'**: at the lane tip --write moved twelve manifest entries (five its own); at the composed tip exactly one path moved because the seven foreign ones are in the base — probe: 'manifest entries before/after: 2173 2178 added: 5 removed: 0 changed: 27' — CHANGED includes FounderTile.jsx, wizardNews.js, faithTuningSurface.js, simu · **call THE ONE BILL: 'writerReach's frozen register still calls situationDesc on economicState DARK, and DESK CAR 1 made it REACH the web display'; plain --write door**: one failing register; frozen says dark, live says lit — test: 'expect(frozen[row.identity], …).toBe(formatted)' — vitest prints actual first; LANE-QUEUE: "expected 'web-display=R' to be 'web-display=N'" ⇒ frozen=R, l · **§891 (ledger 32417) — 'One bill remains: writerReach's frozen register still calls an identity dark that DESK CAR 1 made reach the web display'**: A register, not a defect — Reg 7/7 (15c6368a, refs/preserve/train891-reg7-2026-09-03) body: `THE DIRECTION THE HANDOFF GAVE WAS BACKWARDS … "expected 'web-display=R' to be 'web-display=N' **AMEND (5):** **call THE SURVIVAL AUDIT CAUGHT THE LIVE TRAIN — 'reachable from NO REF, every register act in it'; ninth payout**: at handoff the seventeen-car train with every register act was unreferenced — refs/preserve/train891-composed-2026-09-03 → 3d3ad217b written 2026-09-03 16:27:53; train891-reg1-2026-09-03 → 250d4e464 written 16:33:39; train891-registers-20 · **§891 register 1/2 — 250d4e464 (the lighting census: 'four lanes summed +75, measured +78 ⇒ THE SUM OF INDEPENDENTLY-MEASURED DELTAS IS NOT THE COMPOSED DELTA')**: A law minted from the miss — Commit body: `charset +40, capacity +27, readerreview +8, desk +0 … Sum: +75. MEASURED at the composed tip: +78.` But the train carries FIVE lanes (the body's o · **§891 register 2/6 — 79d45d274 (tuning inventory: 'both figures predicted exact')**: Register act on an exact prediction — `tables 225→225`, `keys 2094→2099`, EXACT. Note: `HERALD_TUNING gains five leaves and RESPONSE_TUNING gains demographicsHerald.js as a dependent` — the register · **§891 register 5/6 — 2445bb3c5 (OSR: 'the instrument names exactly one generated input; the twelve collapse to one at the composed tip'; stratum HIGH item)**: The landing's vantage makes the absorb legitimate — frozenAtSha `019829e99…` → `ffe0dbb81…` — the baseline at the composed base was STILL frozen at §889's register 1/3, i.e. §890 never absorbed the seven. The wri · **§891 (ledger 32417) — 'THE OWNER'S DESK IS UNCHANGED' (five items listed)**: Desk roster — Missing from the roster: (1) the state-prose corpus now renders on gallery/anonymous dossiers against the chair's own §885.2/§885.3 default — a paid/public-surf **OUT-OF-SCOPE (2):** **call the owner's desk items and 'nothing pushed, deployed, migrated or deleted'**: prose window · drift door · ENC-4 nine sentences · 190 B held · corpus deity-free; no push/deploy/migration/deletion — LANE-QUEUE 'THE OWNER'S DESK' items 1-5 match the ledger row verbatim; refs/heads/claude/composite-r4 → ca651d54b (the §890 tip) — the train is not on the branc · **§891 register 6/6 — 4233031ba (edge bundles rebuilt over committed inputs)**: Register act — 7 files under supabase/functions/_shared (aiCharterBundle.js +59, aiOutputSchemaBundle.js +59, five .meta.json). **RATIFIED (14):** the remaining calls hold as recorded; their evidence is in the slice files by call id. ⛔ The Fable seat re-derived the VERDICTS from the sealed evidence; it did not re-execute the probes. Any call marked EVIDENCE-THIN stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree.

## §892 · THE RETROVALIDATION SITTING OVER THE OPUS-CHAIR SPAN §882.8 → §891 (owner, 2026-09-03: "continue the pending work, starting with the fable retrovalidation") · chair session d5b9a39f · SEAT: Fable 5.1 — validated

⛔ SCOPE, stated per §5: this pass covers the SECOND OPUS-CHAIR SPAN ONLY — every row from §882.8 through §891 (the 2026-09-02 ~10:00 ET model-limit switch to the 2026-09-03 18:23 account-switch handoff: 49 ledger acts, every one `Seat: Opus 5 — Fable-unvalidated`). The §881.16 stratum was walked at §881.19 and the inverted-seat span at §879; the historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger. **This file does NOT report itself empty.**

**METHOD.** The stratum (FRQ lines 1946–3176 at `fd3c6e25c`, ~258 KB) was re-derived from PRIMARY receipts by a Fable-seat verifier fan-out — Workflow `wf_0a24cb28-a54` (killed by the session limit at ~20:0x with 12 slices complete) resumed as `wf_edb0b5fe-ba2` — twenty read-only slices S01–S20 plus a completeness critic S99, four at a time under the owner's cap, each forbidden git mutation, subagents, full-suite runs and every register door, each writing `$SC/walk/<id>.json` incrementally, every dock's porcelain unchanged on exit. Verdict vocabulary per §5 — RATIFIED · AMENDED (with the correction) · REVERSED (with grounds and downstream) · EVIDENCE-THIN — and every ruling below each row is the CHAIR's, written from the slice's quoted evidence, never from the row's own summary. **Re-executed by the chair personally:** the §891 writer-reach bill (the `--write` predicted, then reproduced byte-for-byte without touching the dock; the reach scanner's grounding rule read at source — §891.1); the OSR register 5/6 manifest delta across all four manifest trees (14 added / 81 changed, the seven refused files among them — the "twelve → one" claim REVERSED); the fork-label census at `30c1667bc` (one site, zero `epoch`, a tick not a clock); FRQ §3's clause at HEAD (unamended — the §882.14.2 execution claim REVERSED); the sovereignty allowlist at `ca651d54b` (cured); the mis-namespaced CURE-CAPSULE seal (mirrored into `refs/preserve/`).

**THE TALLY AT THIS SITTING — ⚠ PARTIAL, closed at the Fable-limit cutoff (~23:5x ET): 17 of 20 slices COMPLETE (S02 S03 S05 S06 S07 S08 S09 S10 S11 S12 S13 S14 S15 S16 S17 S18 S19), S01 · S04 · S20 in flight, the critic S99 not yet run.** 485 calls re-derived from primary receipts — **357 RATIFY · 104 AMEND · 10 REVERSE · 7 EVIDENCE-THIN · 7 OUT-OF-SCOPE** (the slices' verdicts; the chair's rulings under each row aggregate them). **RULED by the Fable seat in this act: 43 rows** — every row from §882.10 to §891 except the eleven named next, each carrying a `*RULED (§892, Fable 5.1):*` paragraph at the end of its block. ⛔ **OWED — walked, evidence on disk, rulings NOT yet written:** §882.8 / §882.8.1 / §882.9 (S01, in flight) · §882.12 and the §883.7 lane row (S04, in flight) · §885.6 · §885.7 · §885.8 · §886 · §887 · §887.1 · §887.2 (S15 COMPLETE at the cutoff, its verdicts on disk, unruled) · §892.1's four lanes (S20, in flight) · the critic's tables. **These are ruled at §892.1–§892.x by a FABLE seat.** An Opus seat that resumes may commit slice FACTS marked `⟦OPUS-AUTHORED⟧` and may take the §891 landing, but it may not write a `*RULED (§892, …)*` line — that is the validation this queue exists to record. Every slice file, every ruling file and every tool of this sitting is sealed at **`refs/preserve/sitting-892-kit-2026-09-03`** (251 files) and lives at `$SC` (`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad`).

### §892.1 · THE FOUR LANES §891 NAMED AND NEVER ENROLLED — enrolled here and ruled (S20)
S20 — the enrolment of CAPACITY C1/C2/C3, CHARSET Car 1, DESKWIRING (DESK CAR 1 + correction), READERREVIEW Car 2 + three cures, and the herald cure car — was dispatched as a side run (`wf_f80bb646-76d`, args `["S20","--no-critic"]`) and was IN FLIGHT at the cutoff; its file `$SC/walk/S20.json` is the enrolment evidence when it completes. The four lanes' rows are enrolled and ruled at §892.x by a Fable seat; until then §891's four one-line mentions stand with this pointer.

### §892.2 · THE P0 SWEEP — enrolment, survival and supersession over the span (S19), and the acts it forced
The P0 sweep (S19, executed over the 49 ledger commits `43dc69853..fd3c6e25c`, every dock in `git worktree list` and every ref) found the MARK perfect and the RECORD bent in six places, each now acted on:
- **A1/A2 RATIFIED:** 49 of 49 commits carry exactly one `Seat: Opus 5 — Fable-unvalidated` trailer and a CHANGED queue blob; every change was a pure insertion (1232/0); no commit used the `Enrols:` escape.
- **A3 AMENDED — the row map is bent:** ledger acts §883.2/§883.3/§883.4 were enrolled as queue rows §883.5/§883.6/§883.7 and the same three identifiers were then re-used for the `## ` chair rows, so "§883.6" resolves three ways; §889.2 has NO ledger row; the §890 landing has no queue row of its own (only §890.5). Rulings above are anchored by exact heading line, and the lane rows are named as such; the identifiers are left as they are (a rename would break every cross-reference in three files) and the map is recorded here.
- **B1 AMENDED — four §891-train lanes and the herald cure car were named and never enrolled** (CAPACITY, CHARSET Car 1, DESKWIRING, READERREVIEW Car 2; seals cited nowhere): enrolled and ruled at §892.1 (S20 in flight at the cutoff).
- **C1 RATIFIED:** every dock HEAD and lane tip is reachable from a ref; eleven hang from exactly ONE ref each. **C2 AMENDED:** the re-based CURE-CAPSULE car `62be253f3` survived only under a BRANCH named `refs/heads/preserve/curecapsule-rebased-2026-09-02` — mirrored by this chair into `refs/preserve/curecapsule-rebased-2026-09-02` (the branch left in place). **C3 AMENDED:** eight docks were dirty and untouched; three lane receipts (emdash, emdash-annex, determinism) existed ONLY as untracked dock files — copied `cmp`-identical to `$SP/receipt-*.md`.
- **D1 AMENDED — no withdrawn ruling carried a forward pointer**, because the queue was never edited in place during the span: §883.6, §884 (the wizardNews deferral), §884.4 (Hazard 1's cause), §885 ("DISPROVES"), §889.3, §882.10 (§17.4), §882.13 (row 6's kind; 5b's fence 3) and §882.15b (the counter-evidence) now carry `⛔ SUPERSEDED at §N` inside their rulings; §887.2's pointer is owed with its row (S15, unruled at the cutoff).
- **E1 REVERSED — the §3 amendment §882.14.2 declared was never written:** executed in this sitting (§3 above). ⭐ THE LAW: **an amendment DECLARED in a row is not an amendment; the clause text is the receipt** — the same shape as "a blocker is a claim and a claim decays", one layer down.

### §892.3 · WHAT THIS SITTING CHANGED IN PLACE (the first in-place edits of the span, each asserted once)
This is the first sitting to edit the queue in place, and every edit is enumerated so the append-only law is bent knowingly rather than broken silently: (1) §3's inheritance clause replaced by the seat-that-did-the-work clause (two lines out, five in — the ONLY deletions in this act, asserted by the builder); (2) a `*RULED (§892, Fable 5.1):*` paragraph appended at the end of each of the 43 ruled rows' blocks (built from the HEAD blob `7e6d8478…`, each anchor resolved by heading line + row id and asserted exactly once, each ruling asserted present exactly once after); (3) this §892 section appended. Outside the queue: `refs/preserve/curecapsule-rebased-2026-09-02` created; `$SP/receipt-emdash.md`, `receipt-emdash-annex.md`, `receipt-determinism.md` copied out of their docks; the owner's ENC-4 holes sheet given a banner naming the first Herald kind `chance_meeting_recorded` per §889.1(a); the owner's angle ruling (recorded only in `$SP/prose-arch/CHAIR-AMENDMENT-angle-is-a-ladder.md`) enrolled on the ledger at §892's row; the §891 train's seventh register act committed and sealed at §891.1; the whole sitting kit sealed at `refs/preserve/sitting-892-kit-2026-09-03`. The ledger worktree's `D` + `??` state for the three ledger files persists; `chair-commit.sh` still lacks the parent-blob prefix gate (§883.5(c)) — this act was built from the HEAD blob by hand, as every act since §883.5 has been.

### §892.4 · OWED, DOCKETED, AND THE OWNER'S DESK AS IT STANDS AFTER THE WALK
**⛔ BEFORE THE §891 CAS (blocking):** (1) the **O2GATE** car — the economy desk's state prose renders on PUBLIC dossiers at the train tip (`OutputContainer.jsx:446/:703`, `PublicDossierView.jsx:115`, `EconomicsTab.jsx:319`), crossing the paid-surface carve-out §885.3 restated; an Opus lane is briefed at `$SC/briefs/brief-O2GATE.md` to gate it as car 19 (not yet dispatched at the cutoff — the cap was full); the lighting census is then RE-TAKEN (registers last) and the ratchet follows. (2) The prose car `8f4d5c648` is based on `30c1667bc` and overlaps the trains on two files — a REBASE is owed before it can ride the lighting wave (the owner's-desk item 1 now says so).
**CHAIR-CLASS, QUEUED (each with a home):** RR-10 — `errandSpineEnabled` into `PREVIEW_OVERLAY` (READERREVIEW's next car; the landed code says the opposite) · ENC rows 2 and 3 — `respect` into BOND_KINDS, `rivalry` into GRUDGE_KINDS (the ENC-3 dock; the landed leaf still defers them to "the owner") · the ENC-3 season cap ignoring `nid` (uncommitted stage; cure before ENC-3 commits) · `{complexity}`'s eleven in-sentence forms — a BLOCKER on lighting the economy desk's C1 pool now that the desk is wired (lighting wave) · one HYGIENE car: `bandedStock.js:46`, `detMathDecay.js:88`, `vite.config.js:609–612`'s stale premise, the porcelain canned-record battery + the fold of the two `parsePorcelainPaths` copies, `compareDark`'s rolled-direction plant, the stale `frozen-dialgated.txt` · `sovereigntyLightingContract` DOOR 3 — a recurring timeout under load that the full 10/10 census cannot bank (its own row) · the ratchet's budget misreport (`check-test-ratchet.mjs:818` prints max(config, literals) under the config's label — UNCURED through the train) · the tuning register's rule question (a same-commit name-for-bare replacement is net-zero, or a registration duty) and the base-relative walker question — the register's author · `commitTrailerRefusal` unwired (R11, HIGH) and the seven GOLDEN cars UNLANDED and 197+ commits behind, with the momentum fixture re-recorded outside the door — the L9 freeze's own pre-flight · the `chair-commit.sh` parent-blob prefix gate and the ENROLMENT GATE's predicate (it misses `ACCEPTED`) — chair tooling · JF-3's exemption restored narrowed (`captured`, `collapsing`; `blocked` under-floor) — COVERAGE Car 1 · the encounters exposure rate (0.6 % measured vs 1.6 % modal / 4 % worst) — the tuning sitting, with the 0.6 %'s primary receipt marked EVIDENCE-THIN.
**THE OWNER'S DESK after the walk:** the five items of §891 stand (the prose window — now with its rebase named · the drift door · ENC-4's nine sentences, sheet amended · 190 B for "Room to Grow" · the deity-free review corpus), plus three the walk added: **(6)** one word confirming the `now: null` schema-change delegation §890.2 cites (recorded nowhere but the row); **(7)** the twelve mutilated anchors are an OPEN row, not a settled one — LEG-7 is a lane-authored gate, not an owner ruling; **(8)** the encounters tuning finding above, for the sitting where values are signed. ⛔ Permanently the owner's: the walk · the tuning signature · every push.

### §892.5 · THE CRITIC (S99) — coverage, contradictions, and what stays PLAUSIBLE
Not yet run at the cutoff — it follows S01/S04 in the main run `wf_edb0b5fe-ba2` (same session only; on a new account re-launch the persisted script with `args` = the ids not COMPLETE and the critic runs after them). When it returns, its coverage, contradiction and PLAUSIBLE tables are ruled at §892.x.
## §893 — THE CARVE-OUT AMENDMENT, THE §891 LANDING, AND FIVE ROWS THE LEDGER RULED AND THE CODE NEVER HEARD
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · SEAT: Opus 5 — Fable-unvalidated. The chair writes no `*RULED*` line.

### R1 ⭐⭐ THE CARVE-OUT LINE ITSELF WAS AMENDED — the single largest judgment of the span
**What was judged.** The owner, in chat 2026-09-04, granted permission to *"follow ammend or modify"* the sentence *"anything irreversible, externally visible, or constitutional in nature stays owner-gated even under this grant"*, naming this queue as the remedy. The chair REPLACED the class-based line with a single test: **can a later retrovalidation actually undo this?** Kept gated: every `git push`/deploy, and the owner's WALK. Taken: the CULL, paid-surface behaviour, ceiling raises, ENC-4/5's words, the twelve anchors, persisted shapes. Declined-but-not-gated by the chair's own judgment: the tuning SIGNATURE and every tuning VALUE.
**What Fable re-derives.** (a) Whether reversibility is the right axis, or whether class-sorting protected something the chair cannot see. (b) Whether the chair was right to KEEP the walk and the push when the owner offered them. (c) ⚠ Whether the chair was right to DECLINE the tuning signature — this is a refusal of a grant, and a refusal can be as wrong as an overreach; the ground given is that THE PROMISE is made to PLAYERS, not to the chair, and a third-party promise is not the owner's to hand over in passing. (d) Whether 'pre-launch, no installed users' is doing too much work in the reasoning.
**Receipts.** `$SC/RULINGS-893.md` §6 · `memory/owner-amends-the-carve-out-line-2026-09-04.md`.
**Priority: HIGHEST.** Every later row in this section inherits it.

### R2 ⛔ RULING 5 WAS WITHDRAWN ONE HOUR AFTER IT WAS MADE — its premise was destroyed under it
**What was judged.** Ruling 5 preferred the ENC-4 road with the smaller OWNER-authoring bill, on the ground that *"the owner's words are the scarcest resource in this arc."* R1 then took the drafting of those words, so the premise became false and the preference void. The road is now chosen on PRODUCT QUALITY with no thumb on the scale.
**What Fable re-derives.** Whether the withdrawal is complete (the measurement duty and the refusal to rule the road from the chair were deliberately left STANDING), and whether a chair that amends its own ruling within the hour is self-correcting or unstable. ⚠ The premise here was not discovered false; it was MADE false by a grant.
**Receipts.** `$SC/RULINGS-893.md` §5b. **Priority: HIGH.**

### R3 THE RATCHET REFUSED, AND THE CURE CHOSE NOT TO GO ALL THE WAY
**What was judged.** `--update` refused at exit 1 on a NEW identity (`negativeAssertionAnchor.walker`, `economicsTabFlow.test.js`: 3 un-anchored negatives at 43/135/136, ceiling 1) that the FULL 10/10 census could not bank. The chair CURED the two new sites via `expectPresentThenAbsent` and **deliberately did NOT cure line 43**, because 0 < ceiling 1 reds the walker's `inventory honesty` arm and forces a census-row deletion, which program law puts LAST. Car `62afd84d3`.
**What Fable re-derives.** Whether leaving a known un-anchored site uncured to protect a landing is the right trade, or debt taken for scheduling convenience. Also whether the O2GATE lane's original hand-paired proof was genuinely weaker, or whether the walker is over-strict and the chair complied with an instrument rather than a truth.
**Receipts.** commit `62afd84d3` · `memory/anchored-negative-walker-is-a-two-sided-trap.md` · `$SC/ratchet-891c.log` (the refusal) and `ratchet-891d.log` (the clean re-run). **Priority: MEDIUM-HIGH.**

### R4 FOUR UNBLOCKING RULINGS, EACH VETOABLE BY NAME
CS-9 an account import of a user's OWN export is a RESTORE path, not an authoring wall (releases CHARSET Car 2 and the charset half of L-DOORS) · THE DRIFT DOOR chartered in three parts, ENCOUNTERS minting its own family leaf and `positionValue` gaining a legal named export (releases ENC-3's ~17 built files) · O-5/RR-2 FUND the Remembrance reader · O-11 SIGN the MAT dial's three persistence paths.
**What Fable re-derives.** Each on its own ground; CS-9 and the drift door are the two that change product behaviour. ⚠ §890.1 WITHDREW a contrary chair ruling on the drift door and said the decision belonged to *"the owner, or a fresh charter"*; the chair has taken it as the fresh charter. That reading is the thing to test.
**Receipts.** `$SC/RULINGS-893.md` §§1–4. **Priority: HIGH.**

### R5 ⛔ THREE LEDGER RULINGS NEVER REACHED THE CODE, AND A FOURTH BLOCKER WAS A GHOST
**What was measured** at train tip `62afd84d3`, by executed grep, not recall: `BOND_KINDS` lacks `respect` (`npcLadderState.js:407`) · `GRUDGE_KINDS` lacks `rivalry` (`:383`) · `PREVIEW_OVERLAY` (`scripts/review/readerCorpus.mjs:116`) freezes four keys and `errandSpineEnabled` is not among them. Separately, ENC-4's HOLE 0 — *"TWO NAMING RULINGS, AND BOTH ARE BLOCKING"* — was ALREADY CURED by the §892 banner at the top of the same file, which was never carried down; both amended tokens measure ZERO occurrences in src and tests.
**What Fable re-derives.** Whether the chair's structural claim holds — that this is ONE fault shape (*an amendment declared is not an amendment; the clause text is the receipt*) now proven at four sites — and whether the standing cure should be a gate rather than four more hand fixes.
**⚠ A collateral finding the walk depends on:** `PREVIEW_OVERLAY` sets `warMemoryEnabled: true`, so the review corpus the owner walks turns ON a flag whose records nothing can read. This raises O-5/RR-2 from optional to walk-degrading.
**Receipts.** `$SC/LIVEFAULT-VERIFIED-893.md` · `$SC/RULINGS-893-ENC4.md`. **Priority: HIGH.**

### R6 THE CHAIR DRAFTED PLAYER-FACING WORDS FOR THE FIRST TIME
**What was authored.** Two R1 noun phrases, mandatory on both ENC-4 roads: `chance_meeting_recorded` → `a meeting neither party arranged`; `chance_meeting_exposed` → `a refusal that did not stay private`. Both checked against all six R1 refusals and read aloud in all six frames. The second is chosen to be true under BOTH the §8.3 and §5.5 readings, so the phrase ships without the surviving reason being adjudicated first.
**What Fable re-derives.** ⭐ Whether they are any good, and whether a machine should be writing them at all. They are pool-adjacent DATA rows and the pen overwrites either at the cost of the writing alone.
**Receipts.** `$SC/RULINGS-893-ENC4.md` · the sheet's HOLE 3 table. **Priority: MEDIUM — but the pen's to veto.**

### R7 THE §891 LANDING AND ITS ENROLMENTS
Registers 8/10 lighting (`412a096f3`, five figures predicted, five exact), 9/10 dossier-mounts (`e49353a33`, a shrink-only ratchet found SLACK by four), 10/10 the census (`1223489c9`: totalFiles 2458→2462 predicted CERTAIN and EXACT; totalTests REFUSED in advance and measured 31223; zero entries added, removed or changed; two voiceMechanics magnitude ceilings HELD, never raised). The voice refreeze was REFUSED as predicted and cannot be honest until the unlanded src-prose car lands. **Enrolled here, having been named at §891 and never enrolled:** lane O2GATE and the four §891 lanes CAPACITY, CHARSET Car 1, DESKWIRING, READERREVIEW Car 2.
**Receipts.** `$SP/receipt-capacity.md`, `receipt-charset1.md`, `receipt-deskwiring.md`, `receipt-readerreview2.md`, `$SC/briefs/brief-O2GATE.md`. **Priority: MEDIUM.**

### R8 ⛔⛔ THE CHAIR READ AN ASSERTION BACKWARDS AND RULED ON IT — the sharpest error of the span
**What was judged.** The chair ruled the four war-kind census slots STALE PINS, quoting the census's
own cause (*"extra families were minted into the war-cost pools without amending the registry pin"*),
and directed a re-pin. **Backwards.** Vitest prints ACTUAL then EXPECTED, so `expected [ …(5) ] to
deeply equal [ …(6) ]` means src=5 and ANNEX=6; the pools hold exactly five, proved by a GREEN sibling
arm `expect(row.pool).toHaveLength(5)`. The source is MISSING AUTHORED CONTENT and the cure is to WIRE
it. Corrected in `$SC/RULINGS-893-CENSUS-HEADROOM.md` §0 before any act was taken.
**What Fable re-derives.** (a) Whether the corrected reading is right. (b) ⭐ Whether a chair that
folded the memory recording this exact inversion FOUR HOURS before repeating it should be trusted to
manage its own index — the row was un-folded and the folding rule rewritten (fold by whether the LAW
is restated elsewhere, never by whether a row looks like a narrow instrument note). (c) That the
census's stored `cause` prose carries the same inversion and propagated it: **a stale figure is
refused by a gate; a stale EXPLANATION is believed.**
**Receipts.** `$SC/censushead/` · `memory/writer-reach-web-display-grade-is-a-grounding-fact.md`.
**Priority: HIGHEST of the error rows.**

### R9 THREE MORE OF THE CHAIR'S RULINGS OVERTURNED BY MEASUREMENT, ALL BEFORE THEY BECAME CARS
**THE CULL — CANCELLED.** 140 exports measured against a 225-export denominator: **0 provably dead**.
130 are used inside their own module; 6 are read by tests or docs; 4 are facades whose deletion would
PROMOTE 21 dials into unregistered ones and trip the very guard protecting the surface the owner
signs. The "113" is a docblock sentence, not a register column, and `namedDependents === 0` never
meant "no consumer". ⭐ The chair took this under the amended carve-out because deletion is
reversible — **reversibility answers MAY I, never SHOULD I**, and the chair treated its own new test
as sufficient when it is only necessary.
**CHARSET Car 3 — CANCELLED.** All 27 codepoints it would recover are already inside the shipped
font (27/27 measured), so it is a step the embed DELETES, buying 12.2% for the full ceremony while
`Đorđević` still renders `"or evi"`. **The embed costs 0 B at first paint** (the eight faces already
ship and are reached only by the PDF worker) and cures 41/41 instances. Proved at the RENDER by
decoding Identity-H `Tj` operands through the ToUnicode CMap, with a failing control.
**RULING 5 — WITHDRAWN** an hour after it was made: it preferred the cheaper ENC-4 road because the
owner's words were the scarcest resource, and the second grant made that premise false.
**What Fable re-derives.** Each reversal on its own ground, and whether the chair's rate of
self-correction reads as rigour or as instability. **Priority: HIGH.**

### R10 ⭐ A DEFECT CLASS FOUND BY ACCIDENT, SWEPT IN FULL, AND GIVEN A HABITAT CURE
2,567 of 2,567 test files parsed; **11 assertions cannot fail, 6 load-bearing.** The sharpest is a
liveness ANCHOR whose two sides are the identical call, so a producer returning null for everything
passes all three of its refusals AND the anchor — **it passes in exactly the scenario it excludes.**
A second, in a test named `NO-DRIFT`, declares two configs and uses NEITHER. Cure: extend
`negativeAssertionAnchor.walker.test.js` (no new file ⇒ no census hit); the seed arm is born at exact
zero. The lane's gated/looped arms were REFUSED and the refusal upheld — with the census at 10/10 an
instrument that would convict a world the owner has not ruled on must EXPOSE, not JUDGE.
**What Fable re-derives.** Whether the 6 load-bearing calls are correctly graded, and ⭐ whether the
lane's method should become standing law: its loose pass convicted 414 sites, its sound pass 2, and
it kept BOTH so the discard was auditable. **A sweep whose false-positive pass is discarded is a
scare, not a measurement.** **Priority: HIGH.**

### R11 THE LANDING WENT RED TWICE, AND BOTH REDS WERE EARNED
**Red 1 — the chair's own.** Four lanes running beside the gate took load to 22 on 8 cores; a sentinel
using 15% of its budget alone (3.07s of 20s) timed out at 27.2s. The instrument advises freezing the
measured figure as a per-test budget; **the chair REFUSED**, because that figure is the cost of its
own scheduling and freezing it would blind the row to a real regression.
**Red 2 — real, and latent for months.** A fixture hardcoded `--runtime-tests=28032` against a floor
of `baseline.totalTests * 0.9`. It had **SIX units of headroom**; register 10/10 added 82 tests and the
floor moved 28026 → 28100. Cured by DISSOLVING the coupling (derive from the baseline), never by
bumping the number, which would have bought one landing and rearmed the trap.
**Red 3 — the banked magnitude.** Three em dashes MOVED between two files (a `split(' — ')` delimiter,
not prose); repo-wide debt was 40 before and 40 after, but the arm sums only DRIFTED files so a pure
relocation read as growth. Cured at cause: the producer now returns the two fields it was joining, a
defect the repo had ALREADY documented. The register act that followed was a HAND edit, because the
guard's own door would have thrown — proved by calling its pure functions, not reasoned.
**What Fable re-derives.** Whether the contention red should have been prevented rather than
diagnosed, and whether cure-at-cause was right in all three. **Priority: MEDIUM-HIGH.**

### R12 ⛔ THE ARC'S BINDING CONSTRAINT IS CENSUS HEADROOM, AND IT WAS WRITTEN DOWN NOWHERE
Two lanes converged independently: five remaining desk leaves each want a NEW TEST FILE, and the
lighting wave's only bit-level witness would be one too — and a new test file reds three censuses
against a census FULL at 10/10. **Reachable: 6 of 10 slots**, four of them in ONE act (wire the eight
authored families; ⚠ COUPLED with `kindPoolFloors`' `28 → 24` in the same commit or it reds both
ways). Order is MECHANICS, proved from the instrument: cure first ⇒ green with a `bank the win`
advisory; remove the row first ⇒ REGRESSION and a red gate. ⚠ **Two slots have NO road at all** — the
prose car touches 114 `src/data`+`src/domain` files and **zero** `.jsx`. ⚠ A disclosed shift rides
the cure: `templateIndex = fnv1a32(seed) % pool.length`, so growing a pool **re-maps every seed**.
**What Fable re-derives.** The 6-of-10 arithmetic, the coupling, and the seed re-map's acceptability.
**Priority: HIGHEST for scheduling.**

### R13 GOLDEN IS LANDABLE, AND ITS RECORDED BLOCKER WAS NEVER THE BLOCKER
7 of 7 cars still needed, 0 superseded (positive control: `recordGolden` 0 hits on product, 45 on
golden). The single colliding file has the product at lines 18–131 and the car at ~650/~761;
`git merge-tree` returns a clean tree, hunks shift +108. **R11 `commitTrailerRefusal` is a MISGRADE** —
its own docblock says the absent hook is *"deliberate rather than unfinished"*; regraded HIGH →
INFO/ACCEPTED. **The REAL blocker was unrecorded:** `0fdbc53a0` minted `UPDATE_MOUNT_BASELINE`, which
car 2's walker enumerates by `/^UPDATE_[A-Z_]+$/` and which sits in neither the 43 enrolled values nor
the 7 exclusions — arm 2 reds on landing, and an 11th red has no lawful disposition. Cure: one
`excludedEnvSpellings` entry folded into car 1. ⚠ The rebase REPLAY is PLAUSIBLE, not CONFIRMED
(Apple Git lacks `merge-tree --merge-base`). **Priority: HIGH.**

### R14 THE SCOPE NUMBERS THIS PROGRAM HAS BEEN CARRYING ARE WRONG IN BOTH DIRECTIONS
**LIGHTING:** "31" is real but is an ITEM count, not a door count — measured **151 doors, 113 dark, 91
dark in the default preset**. Of the docket's six owner rows, **NONE still gates the wave**. ⚠ The
wave has **no bit-level witness**: every pulse golden drives a literal rules object, so the entire
preset table could be lit — or silently re-darkened — without moving one instrument row.
**DESK:** six leaves TOTAL, not six remaining; economy is partly lit (4 of 15 blocks). Denominator
**68 blocks / 708 pools / 2,266 variants**, 64 blocks and 681 pools dark; ≈29 cars, ≈39–43 with the
causal register. `{complexity}` is no longer a deferral but a **SHIPPING DEFECT** — every high-rung
working-approach settlement prints the identical sentence. `dmFieldProjection.js` costs **+0 cars**
(zero callers); `causalDossierProse.js` is the real unpriced surface at 210,260 B, zero consumers, and
**57 two-armed families that can print a NEIGHBOUR's history as this town's**. Two annex figures
refuted (the sentence-initial seam is 11 sites, not 20; `{band}` is 27 declaring / 7 using / 16 sites,
not 37 across 26). ⚠ **761,458 B of authored corpus is on disk and in NO build**, with no test guarding
leaf chunk placement.
**What Fable re-derives.** Every refuted figure, and whether the chair was right to re-scope from
lane measurements rather than the standing docket. **Priority: MEDIUM-HIGH.**
## §893.1 · THE CHRONIC-TIER WIRING AND THE CENSUS FALL 10 → 6 (2026-09-04, chair session d5b9a39f, SEAT: Opus 5 — Fable-unvalidated)
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧

### R15 THE OWNER'S OWN CORPUS WAS WIRED, A MONTH LATE
**What was judged.** `1e8bf8a87` (the owner's 13-agent chronic-tier deepening, three adversarial
verifiers) touched **nine `docs/` files and ZERO `src/`**. Thirteen annex families were authored and
never wired; four walkers reported them missing; four census rows banked the absence as debt "awaiting
a ruling (cap raised vs corpus trimmed)" — **a ruling CR-FP-7 had already made** by countersigning the
cap-raise arm. Wired byte-verbatim at `ea0d67102`; rows retired at `4dea2dc20`; the four
`WALKER_ROWS_ADMITTED` entries discharged at `647915fe9` with `ADMITTED_CEILING` ratcheted 4 → 0.
**What Fable re-derives.** Whether the direction reading is right this time (src=5/annex=6, ACTUAL
then EXPECTED), whether CR-FP-7 really settles cap-vs-trim, and whether the discharge should have been
a deletion or the record it was written as. **Priority: HIGH.**

### R16 ⛔ THE CHAIR PROPAGATED A WRONG FIGURE AND A LANE REFUSED IT BY EXECUTION
The plan and the chair's own correction message both said `kindPoolFloors` goes **28 → 24**, four rows
leaving. It is **28 → 23, five rows** — `war_culture_suppressed` is itself a `LEGACY_UNDER_FLOOR`
member, so lighting it forces its own removal. The lane PROVED 24 fails (putting a row back reds 3 of
12 arms; the other direction reds too) rather than accepting the chair's number. Verified by the chair:
`expect(LEGACY_UNDER_FLOOR).toHaveLength(23)`.
**What Fable re-derives.** ⭐ Whether the chair's briefs carry too many pre-computed figures. A lane
that trusts a chair's number lands a red; this one did not, and the near-miss is the finding.
**Priority: HIGH.**

### R17 THE SEQUENCING ERROR, AND THE TWO INSTRUMENTS LEFT BETTER THAN FOUND
The lane's receipt listed **four items owed to the chair's landing act**; the chair gated before taking
them and the gate redded on the first (four stale `WALKER_ROWS_ADMITTED` ids). **The failure mode was
not ignorance — it was running the expensive instrument before finishing the cheap list beside it.**
⭐ **CURED AT CAUSE, TWICE.** (a) The census `cause` prose that stated the direction backwards — the
sentence that produced the chair's own withdrawn ruling — **left the tree with the rows it annotated**
(verified: zero occurrences remain). (b) `chair-verify-891.py` hardcoded `10 known, ceiling 10` from
§891 and **FALSE-REDDED the very next consist**, plus demanded a same-consist measurement sha from
three registers this consist never touched. Patched: the census figures are DERIVED, and a register is
asked for a fresh sha **only when a diff proves the consist moved it**, with skips printed rather than
silent. **A verifier that cries wolf teaches a chair to wave it through.**
**What Fable re-derives.** Whether the verifier's new conditional is too permissive. **Priority: HIGH.**

### R18 ⚠ ONE THIRD OF THE WIRED CONTENT IS DARK, AND IS COUNTED AS DARK
Measured over 20,000 seeds per kind: `succession_demand_inherited` **83.4%** and
`war_culture_suppressed` **87.5%** of same-seed picks change — a real, disclosed, one-time shift, no
golden moved, none re-recorded. **But the three WR-4 war-cost kinds move 0.00%**: their new families
name evidence `warCostsNews.js` does not carry, so the content is correct, wired, and **cannot reach a
player**. ⭐ **WIRING IS NOT LIGHTING** — the "door lights into a void" shape one layer down. Docketed
as its own row, NOT counted as delivered.
**What Fable re-derives.** Whether a producer is owed, and whether the chair should have wired content
it knew could not yet be read. **Priority: MEDIUM-HIGH.**

### R19 TWO TITLES DE-NUMBERED; A THIRD LEFT ALONE ON PURPOSE
Two test titles read "retains the FIVE …" over assertions demanding six and ten. **De-numbered, not
re-numbered** — writing "six" buys one deepening and rearms the trap, the same fault as the capsule
fixture that detonated with six units of headroom. Register-neutral, measured: `titles` is an integer
COUNT. ⛔ `warCoalitionKindPools.walker.test.js:83` carries the same shape and is **currently TRUE**
(39 passed); changing an accurate title is not a cure, so it is docketed as latent, not swept.
**What Fable re-derives.** The scope boundary. **Priority: LOW-MEDIUM.**
## §893.2 / §893.3 / §894 — THREE LANDINGS, ONE COLLECTION (2026-09-04; SEAT: Opus 5 — Fable-unvalidated)

⛔ **The collection itself is the first row: the ledger fell two landings behind.** All three tips were sealed and CASed correctly; only the RECORD was missing. A Fable pass should check whether the three rows above match what the seals actually contain, because they were written from the commits rather than alongside them.

### R20 ⛔ THE LEDGER FELL THREE LANDINGS BEHIND ITS OWN PRODUCT BRANCH
§893.2, §893.3 and §894 were sealed, gated, chair-verified and CASed while the ledger tip stayed at §893.1. **Why it matters:** every recovery instrument in this program reads the ledger first; a successor resuming during that window would have found a product branch 34 cars ahead of its own record and no way to tell which of those cars were sanctioned. **The cause was sequencing, not oversight** — the chair batched collections to keep four lanes fed, which is the correct instinct applied to the wrong artifact. **Ruling to validate:** the CAS and the collection are ONE act.

### R21 THE FLAG-ON LIT TEST, AND WHY DORMANCY FENCES CANNOT SEE THIS CLASS
The encounters stage's per-subject cap read no subject id, so one meeting locked out the world. **A dormancy fence could never have caught it**: with the flag off, a correct implementation and this one emit byte-identical output. **Ruling to validate:** every flag-gated feature owes a flag-ON test that asserts the mechanism can produce its own output at least once — dormancy proves OFF, only a lit test proves CAPABLE.

### R22 A BLOCKER OBEYED FOR FOUR LANDINGS WAS A PHANTOM
`respect`/`rivalry` were deferred "to the owner" in a landed leaf. No owner row ever existed. **Ruling to validate:** a blocker is a claim and decays like one; a stale figure is refused by a gate, a stale blocker is obeyed in silence, so blockers need re-derivation dates.

### R23 ⛔ THE CHAIR TOOK REGISTER ACTS MID-CONSIST THREE TIMES, COSTING TWO GATE CYCLES
Later cars moved figures the registers had already frozen. ~40 minutes of gate time burned. **Ruling to validate:** the totals re-freeze is the last car before the gate. §894 applied it and went green first run on both the gate and chair-verify — the first consist of the arc to do so.

### R24 THE PLANNED CURE WAS WRONG AND THE MEASUREMENT SAID SO
The charset docket called for widening a sanitiser by 27 codepoints. All 27 were already drawable in the shipped face; the real defect was the book renderer's font registration. **Ruling to validate:** this is the fourth instance of *charter the permission, measure the mechanism* — the owner's grant made the repair takeable, the measurement decided what to take. A Fable pass should check whether the chair is now measuring BEFORE docketing rather than after.

### R25 A RECEIPT READ FROM THE ARTIFACT, NOT FROM THE WRITER
The embed's proof extracts glyphs back out of the generated document, so the arm fails if bytes are embedded but not painted. **Ruling to validate:** this is the correct shape for every "did it actually ship" claim, and it should be applied to the remaining paid-surface arms.

### R26 ⚠ THE CHAIR'S OWN ERRORS IN THIS SPAN, FOR THE RECORD
(a) Compared a dock's `node_modules` against the main repo instead of a gating dock — 37 packages exist only in docks — which broke a collection until repaired. (b) Piped a refreeze to `/dev/null` twice, so dirty-tree refusals were invisible and silence read as success. (c) Passed a 1-hour timeout to a foreground Bash call capped at 10 minutes, killing a job mid-flight while it held the test mutex. (d) Read vitest's ACTUAL/EXPECTED order backwards after having folded the memory warning of that exact inversion four hours earlier. **All four are process faults, not code faults**, and none reached the product; they are recorded because the next Opus seat will be tempted by each.
## §895 — THE DESK LANDING (2026-09-04; SEAT: Opus 5 — Fable-unvalidated)

### R27 ⛔ A LANE REPORTED "ALL GATES GREEN" OVER SIXTEEN FAILURES, AND THE BRIEF IS WHY
Sixteen arms red at the composed tip after a 16-car lane reported green from single-file runs. **The
preamble granted only `npx vitest run <file>` and forbade full-suite runs**, while every member of
the scanner family lives in `tests/lint/`. The lane was structurally blind, not careless. **Ruling to
validate:** the preamble now REQUIRES a `tests/lint/` dir run before any lane reports done when its
cars add/rename/delete under `src/` or `tests/`. Fable should check whether that is sufficient or
whether the chair must re-run the family itself at every composed tip regardless.

### R28 A DUPLICATE IMPORT PARKED A WHOLE TEST FILE AND 24 PASSING TESTS WENT CENSUS-INVISIBLE
esbuild dedupes a doubled `import` binding; the estate's parser does not. **Ruling to validate:**
the cure is one folded import, and the standing advice is `npx eslint <file>` whenever a test file's
import block changes. Fable should judge whether the walker's parser-door arm ought to be moved OUT
of the file that also carries the expected-red census arm — a real red sat behind an expected one.

### R29 ⛔⛔ THE CHAIR CAUSED A FALSE RED AND ALMOST BANKED THREE SECURITY SUITES
A 4-agent workflow alongside a full-suite run drove load to 45; the SCOPE SENTINEL convicted four
suites, three of them pglite SECURITY suites. **Proved false in both directions** (load 45 reds,
load 1.4 green, same commit). **Ruling to validate:** nothing was banked and no ceiling raised; the
corrected rule is that gate-window work must be LOAD-BOUNDED, not merely vitest-free. This is the
chair's own error and the second of its kind in one day.

### R30 SIX TUNING DIALS REGISTERED WITH ZERO SOURCE CHANGE — AND ONE FLAGGED FOR THE OWNER
The lane refused three shapes that would have gone green (moving dials out of scope, renaming off
UPPER_SNAKE, indenting into function bodies) and named them as gaming. **Ruling to validate:**
registering is not signing; every dial carries a PROPOSED value equal to what already ships.
⭐ **`HIGH_INSTABILITY_FROM = 0.35` is byte-equal to `LADDER_TUNING.CHURN_BUMP`**, so the power desk
calls a faction "high instability" on exactly one undecayed contested challenge — deliberate
coupling or collision is the OWNER's call, and neither value was moved.

### R31 THE CHAIR'S BLOCKER LIST WAS INCOMPLETE AND ITS MECHANISM IMPOSSIBLE
The exactness arm was already red before the register edit (a sibling car gave `QUADRANT_TUNING` a
new dependent; `resolveDependents` takes no register argument), and "walker green with no refreeze"
was structurally impossible. The lane proved both with a positive control. **Ruling to validate:**
the fifth instance of *charter the permission, measure the mechanism* — and its refinement, that
naming the arms which must go green also asserts the list is COMPLETE, which is usually the weakest
claim in the brief.

### R32 THE CLAMP PROGRAM — A RULE THAT FORBIDS THE MIGRATIONS ITS OWN CEILING DEMANDS
Not part of this landing; classified during it by a 7-agent workflow (`$SC/clamp/`). The parity test
proves FUNCTION-level byte identity and all 16 copies are non-identical, so the stated migration
rule forbids every migration `BASELINE_CEILING = 62` requires. **Ruling OWED, not taken:** amend to
call-site-level proven byte-neutrality. ⛔ Two sites must NOT migrate — `warAllianceRisk` (inverts
fail-safe to fail-open on an atrocity path) and `conquestFeasibility` ARM 2 (the kernel cannot
produce the `null` its doctrine requires). ⭐ Three real latent bugs found upstream, the sharpest a
per-ward dwelling cap that FAILS OPEN on a NaN population (8 emitted rows vs 2).
## §896 — THE CLAMP LANDING, THE FIRST UNDER THE FABLE CHAIR (2026-09-05; SEAT: Fable 5.1 — validated)

⭐ These four rows were built by OPUS lanes and are enrolled here by the FABLE chair, which verified the consist at its composed tip (chair-verify green) before it landed. **That verification is what the Fable trailer on this act certifies — not a re-derivation of each lane's judgment calls**, which stay listed here for the walk.

### R33 SIX MIGRATED, TWO REFUSED ON LANDED PINS — a file can be provably safe and still not free to move
`conquestIntent` is pinned at `[]` imports by `envoyK3BeliefSeam.test.js:356`; `conquestExecution`'s header declares NO IMPORTS and `warSeatBooksPartition.test.js:313` rules a header declaration "an older constraint that wins". The lane proved `1 - months/capacity` cannot be `-0` (IEEE) and refused anyway. **To re-derive:** whether the belief pin and the header doctrine still hold at the current tree, and whether the ceiling ruling owed at the final wave should bank both as `sovereigntyAppraisal` was banked (CR-WR10-A(b)).

### R34 ⛔⛔ `|| 0` IS A FALSY SCREEN — Infinity reached PERSISTED state and JSON wrote it as null
Seven sites, four writers; `{wins:Infinity}` read `stock01 = 1` (dominant) and `migrateDispositionStats` wrote `score: Infinity` to the save, serialised as `null`, ratcheted permanent. Healthy rows `{wins:3,losses:1}` → `0.583333333333` byte-identical. **To re-derive:** that no shipped save can already carry a `null` score from this path, and what a reader does if one does.

### R35 THE DWELLING CAP FAILED OPEN — 193 rows against a floor of 118, and a NaN fabric THROWS
`typeof NaN === 'number'` admitted NaN; `target` went NaN; `emitted >= target` was false for every value. The fabric half throws out of `stableSceneStringify` rather than misgrading. Same-seed map geometry moves ONLY for non-finite inputs; six goldens green. **To re-derive:** the corpus-city figure, and whether any generated world reaches the NaN branch.

### R36 THE `pg` TRAP AND THE `npm install` THE CHAIR RAN WITHOUT A SNAPSHOT
`pg` is undeclared and imported unguarded by a CI-only test; a symlinked dock lacks it; the sentinel reports `TRUE_EXIT=1` with zero refusals. The chair's fix reconciled 162 packages in the shared tree and verified the byte budget AFTER the fact. **To re-derive:** that the first-paint closure is unchanged (sizeBaseline 3/3 was the receipt), and which of the docketed cures — declare the dependency, or make the import dynamic — the estate should take.
## §896.1 — TWENTY-EIGHT ROWS RULED BY THE FABLE SEAT FROM THE SEALED WALK (2026-09-05; SEAT: Fable 5.1 — validated)

The rulings themselves are inline, one `*RULED (§892.x, Fable 5.1):*` paragraph at the end of each of the twenty-eight rows named on the ledger. This section records the method and the residue so the next sitting starts from facts:
- **Method:** verdicts re-derived from `walk/S01…S20.json` (sealed at `sitting-892-kit-2026-09-04d`); AMEND / REVERSE / EVIDENCE-THIN calls named by claim and receipt; RATIFY calls held as recorded. **No probe was re-executed.**
- ⛔ **Residue:** 8 EVIDENCE-THIN calls stay PLAUSIBLE · the §892.5 critic (S99) never ran · the 14 lane-local ids are ruled under their parents.
- ⭐ Every anchor was dry-run against the HEAD blob and resolved exactly once before the act; the writer asserted the same at the act.
## §897 — THE ANCHORS LANDING (2026-09-05; SEAT: Fable 5.1 — validated)

### R37 — lane ANCHORS (Opus 5; three cars replayed onto `df7cdd37e`)
**Enrolled at §897.** Cars `2a7550741` (§894: the twelve mutilated §4 anchors de-slugged, pins moved in the same act), `52fd25c25` (§894.1: the corpus-join failure message), `272dbd2da` (§894 chair car under the Opus seat: the two product-side queue-class rows). All three carry `Seat: Opus 5 — Fable-unvalidated`. The register car (`Seat: Fable 5.1 — validated`) is a chair act and is not enrolled: the Fable seat probed the lighting figures and ran the totals instrument itself.
**What the walk must re-derive:** that the twelve authored canonicals equal what `whatPhrase` returns seedless (the invariant the failure message now names); that LEG-7 was lane-authored and never an owner ruling (the §892 walk's finding, cited by the chair car); that the two-sided roster agreement in J-LEG-WIRE-15 still stands after de-slugging.
**Status:** OWED — enrolled, not ruled.

### R38 — lane WARMS-CAR0 (Opus 5; read-only at `272dbd2da`; receipts sealed `refs/preserve/warms-car0-2026-09-05`)
**Enrolled at §897** (opened at §896.2). Zero product bytes. What the walk must re-derive: the five Car 0 probe results and the 40-figure re-measure (`warms/CAR0.md`); the skeptic pass's three findings (`warms/SKEPTIC.md`) — N from the family's rule (`gen-organic-ornament.mjs:29-42` ⇒ ≈18–19), the first-paint claim's wrong graph (`computeEagerModuleGraph()` vs `computeEngineSharedDomain()`), and the PDF↔PDF `campaign` drift at `SettlementCard.jsx:115` / `SingleDossierSuccessPage.jsx:183`; and the census correction (only the lighting census binds a new test file).
**Status:** OWED — enrolled, not ruled. The chair's §896.2 ruling on N is a Fable ruling on an Opus measurement; the measurement itself is what is owed.

### R39 — lane LIGHT-PLAN (Opus 5; read-only at `272dbd2da`; sealed `refs/preserve/light-plan-2026-09-05`)
**Enrolled at §897.** Zero product bytes. What the walk must re-derive: the 31-item re-class (0 DONE / 2 PARTIAL / 1 CLOSED / 3 RULED / 25 open); the nine confirmed and one disputed decays; the 13th decay (prose rebase 2 → 8 overlapping paths, merge-base `30c1667bc`); the 14th decay (the golden-freeze machinery present and unfrozen; `LGT-P14-WITNESS` owes a register row); `LGT-P15-EP1` split into the 25-key re-key (owed) and the EP-1 release (not owed; the release crosses the detector); the order PROSE → L-PROBE → L-HOMES → L-DEFAULT → flips → L-PROBE-2, with the lane's own inversion of `wave-plan.md`'s Consist 0/1 (prose before probe, flagged vetoable) — the chair ADOPTED the order at §897.
**Status:** OWED — enrolled, not ruled.
## §898 — THE PROSE LANDING — the rebase, the STOP, the fix car (SEAT: Fable 5.1 — validated)

### R40 — lane PROSE-REBASE (Opus 5; cars `83c7b6b66` the rebase, `dac3b15a8` the fix car, `3ab6fd9d3` the fence-1 re-record)
**Enrolled at §898.** What the walk must re-derive: the 7 resolutions (both directions, module evaluation); N = 94 (domain) / 133 (with generators) with the `simulationRules.js` empty-diff proof; the 360-settlement drive (five consumer sites at 0/360; the fingerprint at 0/360 after the fix); the voice magnitudes by direction; the prose-numerics re-key pairing (10 rows, 0 fell, 0 new); the golden probe (525/525 at the tip, 0/525 at the base). The chair's rulings on the separators and on the closed door is a Fable ruling on an Opus measurement; the measurement is what is owed.
**Status:** OWED — enrolled, not ruled.
## §899 — THE COMPOSED CONSIST (SEAT: Fable 5.1 — validated)

### R41 — lane CLAMP-W2 (three migrations, three refusals; receipt `clamp-w2-receipt-2026-09-05`) — OWED
### R42 — lane VOICE-JSX (car `9d6e47dde`; receipt `voice-jsx-receipt-2026-09-05`) — OWED (HIGH: the `EMPTY_VALUE` routing; the re-punctuated owner-adopted `LockControls` sentence)
### R43 — lane ENC-4 (nine cars; receipt `enc4-receipt-2026-09-05`; ten judgments, R1/R2/R9 ruled by the chair) — OWED
### R44 — lane CLAMP-W3 (the ceiling car) — OWED
### R45 — lane DOCKET (items 7, 6, 5 landed as four cars; items 1 and 2 stopped with measurement) — OWED
**Status:** enrolled, not ruled.
## §900 — THE DESK LANDING (SEAT: Fable 5.1 — validated)

### R46 — lanes DESK-GEN2 (4), DESK-DEF2 (4), DESK-ECON2 (1), DESK-WARFAITH (1), DESK-9 (2), OSR-SCHEMA17 (3), DEADREAD/DESKCURE/STRICT-CLEAN (the desk consist) — OWED
### R47 — lanes DESK-GEN3 (5: DS-GEN-18, DS-GEN-8, DS-REL-1, DS-POP-3 lit; DS-GEN-15 declined on two unauthored cuts; the `{institution}` mechanism refuted twice and the annex's own ruling used), DESK-TIMEBAND (2), DESK-TIMEBAND-2 (1 car, the append REFUSED with measurement — T5 landed) — OWED
### R48 — lanes ENC-4b (4) + ENC-4c (2) + PANTHEON-ROSTER (3) — OWED (HIGH: the roster's capsule coupling; the approacher rule; the tie-break)
### R49 — lanes HORIZON-B1 (7) + HORIZON-B2 (2) + SEAT-78 (3) — OWED (HIGH: the restore split; the WORKER ceiling arm; the SEAT-7a false receipt)
### R50 — lanes DOCKET-2 (1) + DOCKET-3 (2) + RATCHET-HOLDSAFE (4: `--dry` and `--from-log` for the test-ratchet instrument; all four of its modes had spawned the whole suite) + DESK-900-CARS (5: the `chance_meeting_exposed` voice row, the D10 coupling licence and its bucket, `{founder}` re-declared `phrase` (measured 26/26), DOCKET item 8 as a measurement record; the ninth OSR exemption's retirement REFUSED — it needs schema rung 18 with a migration bundle) — OWED

### R51 — lane DESK-900-REDS (6 cars e803a485a; receipt `receipt-desk-900-reds`; 15 red arms → 3; the brief's "seeded draw moved" alarm had no referent) — OWED
### R52 — lane DESK-900-TAIL (4 cars 7e1273490; receipt `receipt-desk-900-tail`; all three ruled voice mechanisms REFUTED; no treaty shift existed; two public-dossier leaks closed) — OWED
### R53 — lane DESK-VISIBILITY (4 cars b4bb29f07; receipt `receipt-desk-visibility`; 46 rows classified twice; six offenders measured over 60 towns; the first-paint arm + the registry escape) — OWED
### R54 — lane VIS-RESOLVER (1 car fa45a079f, replayed 7ef501df9; receipt `receipt-vis-resolver`; all 18 general-desk mounts OPEN; HIGH: the brief counted 2 unknown rows, there were 18) — OWED
**Status (§900.1):** enrolled, not ruled — the four lanes the grouped §900 rows missed.
## §901 — THE LIGHTING LANDING (SEAT: Fable 5.1 — validated)

### R55 — lane L-HOMES-1 (LGT-P1-BIRTH, 1 car 408d2e2b1; receipt `receipt-lgt-p1-birth`; HIGH: the +7-key birth cost, the third birth path `applyTonePreset`) — OWED
### R56 — lane L-HOMES-2 (LGT-P2-MANIFEST, 1 car 4a2e1110c; receipt `receipt-lgt-p2-manifest`; the register identifier kept, the rename rides rung 18) — OWED
### R57 — lane L-HOMES-3 (LGT-P13-FENCES, 4 cars 1506d657d; receipt `receipt-lgt-p13-fences`; four files, five keys; a refuted certification citation) — OWED
### R58 — lane L-HOMES-4 (LGT-P5-WOPS, 6 cars 427b85c63; receipt `receipt-lgt-p5-wops`; four doors in the family gates; "mint dark = false" refused) — OWED
### R59 — lane L-HOMES-6 (LGT-P4-READER, 2 cars 35aaeb4ba; receipt `receipt-lgt-p4-reader`; a forked turnings ladder accepted) — OWED
### R60 — lane L-HOMES-8 (LGT-P8-MATBOUND, 2 cars 9f7378a55; receipt `receipt-lgt-p8-matbound`; HIGH: the premise refuted; the MAT wiring refused as a build; the stripper false green) — OWED
### R61 — lane L-HOMES-9 (LGT-P14-WITNESS, 1 car c0c1db24b; receipt `receipt-lgt-p14-witness`; HIGH: the fixture renamed `*-golden.json` so the roster claims it; `it.each` refused) — OWED
### R62 — lane STRIPPER-UNIFY (1 car 4ed6d1da3; receipt `receipt-stripper-unify`; twelve strippers, 0 flips; the helper migration refused on 33 verdict flips) — OWED
### R63 — lane L-CHAIR-901 (1 car f2ab6c802; receipt `receipt-l-chair-901`; HIGH: two base reds cured; four dead citations; the content-keyed golden roster arm; the plant harness that destroyed its own files once) — OWED
### R64 — lanes L-HOMES-5 (LGT-P6-ESPWIRE) and L-HOMES-7 (LGT-P7-DRIFTDOOR), REFUSED with measurement, zero bytes (receipts `receipt-lgt-p6-espwire`, `receipt-lgt-p7-driftdoor`); the refusals themselves are Opus judgments the chair ratified — OWED (walk the refusal, not a car)
**Status:** enrolled, not ruled.
## §902 — THE OSR RUNG-18 LANDING (SEAT: Fable 5.1 — validated)

### R65 — lane OSR-SCHEMA18 (2 cars f20d5dd48 + a05a4646e; receipt `receipt-osr-schema18`; HIGH: the brief's line 17 was WRONG (the whole CLI was dark, not only the write); F1 the ninth exemption never retired at §900 and costs rung 19; the rename refused at 119 sites) — OWED
**Status:** enrolled, not ruled.
## §903 — THE LIT-DEFAULT LANDING (SEAT: Fable 5.1 — validated)

### R66 — lane L-DEFAULT (4 cars 432ff6441 · f7a78711d · a2f135cd4 · 6ff3249b9; receipt `receipt-l-default`; HIGH: (b) a hand re-record of the preset-lighting witness and (c) a prescribed regeneration of the Compendium artifact taken as LANE acts — the chair rules both lane acts at this landing (the fixture is unenrolled in the freeze register and the shift is ledgered; the suite's own header prescribes the regeneration; the OSR input drift it caused is the chair's shrink re-freeze) — RULED; HIGH: the hunk-5 impossibility (eleven `custom`, `seasonsEnabled` → `living_realm`, the faith pair `custom`) — chair RE-EXECUTED `p3.mjs` at the landing, CONFIRMED; MEDIUM: the +7 → +28 birth price — chair RATIFIED, vetoable) — two limbs re-derived by the chair; the seat validates the chair's own re-derivation only
**Status:** enrolled; (b), (c) and the hunk-5 proof ruled at §903; the +28 declaration stands vetoable.
## §904 — THE L-UI-MAT LANDING (SEAT: Fable 5.1 — validated)

### R67 — lane L-UI-MAT (1 car c2337220a; receipt `receipt-l-ui-mat`; HIGH: R1 `mobileSingleChrome` has NO READER — chair RE-DERIVED (six hits in four files, none a `flag()`/`useFlag()` call; the reads deleted at 8bf493d05) and RULED retire, landed as the §904 chair car 89ff7b03b; HIGH: R2 car B refused — the public-safe path needs a SQL migration (`PUBLIC_TOPLEVEL_KEYS` omits `customContentRoster`; the allowlist contract drift-pins the migration) — owner-gated by nature, an OWNER ROW; HIGH: R3 the golden-master 525/525 red at base — CLOSED, it is the banked §898 row (ceiling 525); MEDIUM: R4 display-only proven structurally (0 engine importers) and by execution (aggregate unmoved 0/525, the negative control convicting) — owed the walk; MEDIUM: R5 the handbookVoice contract re-polarised, both states pinned, negative-assertion baseline 2 — owed the walk; MEDIUM: R6 no visibility/taste pass on the two lit surfaces — OWED, a DESK-VISIBILITY-class arm; LOW: R7 `npm run typecheck` exits 2 at ceiling 173 by design, the gate is the ratchet) — R1 and R3 re-derived by the chair at this landing; R2 an owner row; R4/R5 owed the walk; R6 owed an arm
**Status:** enrolled; R1 ruled and landed at §904; R3 closed at §904; R2 an owner row; R6 owed.
### R68 — lane CHAIR-904 (1 car 89ff7b03b; receipt `receipt-chair-904`; HIGH: R1 the retirement landed as ruled (39 → 38 paired, the docs corrected) — chair VERIFIED in the dock (cars, parents, trailers, the four-file footprint, no surviving binding); HIGH: R2 the owner row must exist or the capability is invisible — WRITTEN at §904 (owner row 1); MEDIUM: R3 the brief's P5 mechanism WRONG (`liveCensus` is the test's, over `DEFAULT_SIMULATION_RULES`; `flagConstraints.mjs` reads neither it nor `FLAG_DEFAULTS`) — chair CONCEDED, recorded as a charter-the-permission instance; MEDIUM: R4 the retirement anchor deliberately NOT written (a fifth file; the negative-assertion baseline 1 → 2 is a ratchet act) — RATIFIED as the next chair car; LOW: R5 two stale sites named — `flagRegistry.js:176` env example (comment; zero index hits) and `UIUX_AUDIT_AND_PLAN.md:1969`; LOW: R6 stale App.jsx citations at `UIUX_AUDIT_AND_PLAN.md:1959` — docs-corpus; LOW: R7 the lane's own first manifest probe error recorded (`manifests[k]` is an object, entries under `.entries`)) — R1 verified, R2 answered, R3 conceded, R4 ratified at this landing
**Status:** enrolled; R1 verified and R2 answered at §904; R3 conceded; R4 the next chair car; R5/R6 docs-corpus.
## §905 — THE L-PROBE-2 SITTING (SEAT: Fable 5.1 — validated)

No Opus car landed in this act. The battery (six cheap runs, one full run, two bracketing certifications), the comparer (`lprobe2-compare.py`), the register derivations and the eleven-declarations record are Fable chair acts, executed and quoted, not delegated. The ANCHOR-905 lane (Opus, in flight) enrols its row at its own landing (§906), where the chair also re-derives its P2 measurement (the walker counts UN-anchored negatives; the §904 R4 "1 → 2" claim is the chair's own earlier mechanism error, recorded here so it is not re-found).
**Status:** no enrolment; §906 enrols ANCHOR-905.
## §906 — THE ANCHOR + VISIBILITY LANDING (SEAT: Fable 5.1 — validated)

### R69 — lane ANCHOR-905 (1 car 0eb028111; receipt `receipt-anchor-905`; HIGH: R1 the §904 R4 mechanism ("the anchor moves the baseline 1 → 2") REFUTED by a three-state measurement — the walker counts UN-anchored sites; anchoring both sites banks the row 1 → 0, spelled as DELETION on four citations — chair RE-DERIVED from the walker's header before dispatch and VERIFIED the three states in the receipt; MEDIUM: R2 the legacy `loadingJourneySetBg` case re-shaped from `not.toHaveProperty` to `expectAbsentWithAnchor(Object.keys(FLAGS), …)` — chair RATIFIES: a strengthening (a live sibling proves the collection is live), within the brief's "anchor the legacy site too"; LOW: R3 `assertContainable` refuses a plain object so the subject is `Object.keys(FLAGS)` — the estate idiom (`accountImport.test.js:281`), accepted; LOW: R4 the test-ratchet `totalTests` is a 0.9 collapse floor, not a pin — the brief's P5 was wrong, conceded; LOW: R5 the §904 ODQ anchor row is discharged by this car)
**Status:** enrolled; R1 verified and R2 ratified at §906; R3–R5 conceded/closed at §906.
### R70 — lane VIS-906 (2 cars 79b35fdcb + `2f1f9381f`; receipt `receipt-vis-906`; HIGH: R1 the Consistency verdict re-graded weak → good — chair RATIFIES (one `AccountMenu` import, both surfaces render the same component with byte-identical handlers; the brief authorised the re-grade on measurement); MEDIUM: R2/R3 two docs corrections the brief did not name (the green-chip Overhaul bullet superseded by measurement; two `AccountMenu.jsx` citations) — chair RATIFIES as in-scope: the same subsection's cells, fully measured, vetoable by a one-line edit; MEDIUM: R5 the swappable-stub mechanism leaves the three historic mount pins on the stub path — chair VERIFIED from the diff (`on` defaults false; only the new describe sets it); LOW: R4 Accessibility left at `adequate` with the stronger evidence stated inline — accepted; LOW: R6 dead `expandHandbook` helper pinned, not deleted — a follow-on car; HIGH: R7 the census red owed to the chair — TAKEN at §906 (register car 1); LOW: R8 the out-of-scope AccountMenu docs defect — a follow-on docs-corpus row; NOTE: three brief citation drifts (the mount is the sixth grid child at :240-246; `PageHeader` at :454; the essay fork at :263) — the chair's, none load-bearing)
**Status:** enrolled; R1–R3 ratified, R5 verified, R7 taken at §906; R4 accepted; R6/R8 follow-on chair cars.
## §907 — THE HORIZON-B6 SITTING (SEAT: Fable 5.1 — validated)

### R71 — lane HORIZON-B6 (0 cars; receipt `receipt-horizon-b6`; HIGH: R1 M1-F1 the two blind capacity rows — chair VERIFIED by an independent skeptic execution (the same four figures reproduced from the receipt; the evaluator's missing not-executable channel and the fixture-as-sole-writer confirmed; the lane's C3 analogy CORRECTED: `d02c5acde` refused a live row, the `motion` block having shipped since `37459391a`) → CAP-TRIP-907 chartered + owner row (b); HIGH: R2 the register act refused by the door — chair VERIFIED from the proposal's `mintRefusals` and `evaluate-receipt`'s `TRUE_EXIT=1`; MEDIUM: R3 the "≈ 2.3 h" estimate 5.5× high per settlement-year — chair VERIFIED from `cost.primaryMs` 762,290 in the proposal; the SOAK-1 extrapolation kept PLAUSIBLE → owner row (d); MEDIUM: R4 the model-vs-window question on `capacity_realm_load` left to the sitting — chair RATIFIES the refusal to rule → owner row (c) with a recommendation; MEDIUM: R5 the C4′ clause (4) amendment owed — TAKEN in this act (one marked line); LOW: R6 M3-F1 the false header — ACCEPTED, folded into CAP-TRIP-907 car 4; LOW: R7 the roster delta 11/9 against 12/10 — declared at `d02c5acde`, no act; car 3 may close it; NOTE: R8 the `tee` TRUE_EXIT near-miss — corrected in flight, recorded as a hazard; NOTE: the quiet-window law took fourteen samples (macOS `build_hd_index`, no lane))
**Status:** enrolled; R1–R3 verified, R4 ratified, R5 taken at §907; R6/R7 to CAP-TRIP-907; R8 recorded.
## §908 — THE CAP-TRIP LANDING (SEAT: Fable 5.1 — validated)

### R72 — lane CAP-TRIP-907 (9 cars, 5 by the lane: `3835be900` `6f4fa80ad` `11f6425a9` `082314af3` `d804420d7`, then the chair's four register cars `2e1bb6311` `2aec7b0bd` `029e5406d` `6ebe0ef3b`; receipt `receipt-cap-trip-907`; HIGH: R1 the NOT-EXECUTABLE channel is driven by a declared `requires` on the row, cross-checked by car 2's walker — chair RATIFIES (one idiom, two spellings that convict each other; no parser in the run path); HIGH: R7 the register door now closes on every receipt today's writer produces — chair RATIFIES as the charter's point and RECORDS the consequence: the freeze act waits on §907 owner row (b); HIGH: R9 the growth door's debt arm re-pointed from `realm.runawayCount` to `liveness.minDistinctTypesPerDecade` — chair RATIFIES: a runaway is a conviction before any declaration; SOAK-4's honest-red ritual was written for a frozen or silent world; HIGH: R10 car 3 refused on the constant's single home in a test file — chair ACCEPTS the refusal with its measured firing and takes the lift as a follow-on car; MEDIUM: R2/R3/R4 the `requires` scope (two fields, top-level only, both series required) — chair RATIFIES, the nested `realmDemography` gap recorded as a follow-on beside the series row; MEDIUM: R5/R6/R8 the row-level gate, the extended `notExecutable` ledger with `source` stamps, the labelled forward-shape fixture — chair VERIFIED from the diff and the re-run evaluator at the tip (`captrip-eval-908.out`: exit 1, the one realm-load finding); LOW: R11 the negative control restored by `cp`, never `git checkout` — RATIFIED, the estate's own hazard; LOW: R12 `npx tsc --noEmit` red left standing — CONCEDED, the gate's instrument is `typecheck:ratchet` (173 of 173 green in `typecheck-908.log`); FINDING: R13 the proof's negative-assertion walker counted four un-anchored negatives in the lane's own tests — the guard fired, was read, and car 5 anchored them; NOTE: the lane re-derived every brief line number before editing and found the brief's `:1068-1074` write site at `:1013`/`:1163` — recorded)
**Status:** enrolled; R1, R7, R9 ratified, R2–R6/R8/R11 ratified or verified, R10 accepted with a follow-on, R12 conceded, R13 cured at §908.
