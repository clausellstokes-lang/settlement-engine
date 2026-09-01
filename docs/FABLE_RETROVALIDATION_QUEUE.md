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

**§877.6 · The §877 collection compiled while the gate ran · 2026-09-01 · SEAT: Opus 5.**

---
