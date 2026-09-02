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

**§881.16.2 · TAILF-land's PAUSE REPORT — the consist's picks and registers complete, the probe battery owed, and one measured byte finding · 2026-09-02 · SEAT: Opus 5 (lane TAILF-land), enrolled by the Opus chair.**

*The lane's own judgment calls, as it reported them (a returning Fable seat re-derives these; the lane's full rows are owed at its HOLD and are NOT yet written):*
1. **It CONTINUED the measurement acts after §3.5.4's STOP tripped rather than halting the lane** (the closure read 1,046,662 against the order's predicted 1,046,604). Its ground: no ceiling was breached (338 B of margin under the unraised 1,047,000; engine Δ 0 B against a 236 B margin), the acts that followed are measurements rather than mutations, and halting would have cost the window without protecting anything. **The chair (Opus) RATIFIES the continuation and rules the finding itself a chair row owed BEFORE the CAS** — see (2). **Veto shape:** none needed for the acts taken; every one is re-runnable.
2. **It CLASSIFIED the +58 B by rebuilding the base arm** (`$SP/base-C` rebuilt and reproducing 1,046,604 and engine 675,764 exactly), then hashing all eight first-paint chunks: seven identical, the whole delta inside the eager `index` chunk (576,060 → 576,118), and zero TAIL-F fingerprints in any of the eight. Its conclusion: the order's ⟦A9⟧(c) was WRONG — Rollup split `faithField.js` into a new lazy chunk and `index`'s preload map gained that filename once. This is a composition cost of the consist's own shape, not a leak of TAIL-F bytes into first paint. **What Fable re-derives:** the eight-chunk hash comparison and the preload-map claim (the decisive evidence), and whether a preload-map entry is the right thing to spend 58 B of first paint on or whether the chunk should be co-located.
3. **It recorded §5.4's "exactly ONE red file" as TWO** (`voiceMechanics` ×4 and `enforcement-claims` ×1, all five at their exact banked magnitudes) rather than smoothing the order's prediction.
4. **It named D-1** (pick 5's battery carried a second red file with one cause, cured by pick 8 and discharged at RUN 1) rather than reporting the battery clean.

*Receipts (the lane's, exits captured):* dock `9a0584f0f`, 12 commits over `fab576aba`, porcelain 0, 12/12 parser-visible trailers, zero landing cures needed; lighting tuple `2495/370/2125/22437/6069` every digit predicted; ratchet register `30731 2443 10 1` with 14/14 magnitudes unmoved; the plain gate `OK — 10 known failure(s) of 30731 tests, ceiling 10`; OSR `1993 exactly matching`; typechecks 173/173 and 1121/1121; `vendorPdfLazy` 40/40 zero skips; §5.4's four batches and §5.5/§5.6 green but for the five banked rows.

*Priority:* **HIGH for (2)** — it is the one row standing between the dock and the CAS, and it re-bases T13's own composed-closure arithmetic. MEDIUM for (1). LOW for (3)/(4).

**§881.16.3 · T13-PRELAND's PAUSE REPORT — pick 14 (the P′ placement cure) COMMITTED and behaviourally proven; Car 5 not started; the build unspent · 2026-09-02 · SEAT: Opus 5 (lane T13-PRELAND), enrolled by the Opus chair.**

*The lane's own judgment calls (a returning Fable seat re-derives these):*
1. **It COMMITTED the four dirty paths as pick 14 rather than leaving them uncommitted at the pause**, on the ground that both halves were fully proven before the order arrived (the equivalence probe and the differential probe both clean, the goldens unmoved, both typecheck ratchets green). The chair's pause order allowed either; committing a PROVEN change is the safer resume substrate and it left the dock porcelain 0. **Veto shape:** `git revert 822c4f93a` — the cure is one commit.
2. ⭐ **It REFUSED the brief's `10^6.4` saturation literal and used the MEASURED crossing double `2511886.43150957906619` instead** — the brief's constant sits 7 ULPs above the true crossing and would have left a real ordering window in which the folded comparator disagreed with the original. **This is the single most load-bearing call in the cure** and the one Fable should re-derive first: the claim is that the lexicographic (tier, min(pop, crossing)) ordering is IDENTICAL to the original expression for every input the comparator can see, and the probe that backs it is 15,071,406 score comparisons over integer populations `0 … 2,511,900` × six tier ranks plus 3,000,000 random quadruples plus cross-rank, above-cap and NaN arms, with **0 mismatches**, and a differential probe of 2,449,925 cases through the real exported API with **0 divergences**.
3. **It re-ran the eager census over ALL 21 `detMath` importers** rather than only the two the receipt named — finding exactly two eager before the cure and **zero after**, and additionally proving `bandedStock.js` is NOT eager, which is what guarantees Car 5's family (i) cannot undo P′. The wider census is the lane's own widening of the brief.
4. **It classified both remaining reds as PRE-EXISTING by proof, not by assertion** (`clampPrimitiveBaseline`'s 78-vs-62 count identical at HEAD and worktree; `proseNumerics`'s `moralDrift.js` line shift owed to an earlier pick), so no red is attributable to pick 14.

*⛔ THE CHAIR'S OWN ERROR, recorded by the lane (the brief-error streak law, §872.1):* **this chair's dispatch brief named the wrong ban member list in both directions** — it listed `Math.sqrt`, `Math.cbrt` and `Math.hypot`, while the counter's own `TRANSCENDENTAL_FNS` is 22 members with **`Math.sqrt` deliberately absent**. Car 5's ban must mirror the counter's list by construction, never a hand-written set in a brief. The brief pointed at the counter file as the authority, which is what saved it; the standing law holds — **a dispatch brief POINTS at the charter, never paraphrases it.**

*Receipts:* dock `822c4f93a`, **14 commits** over `8b07ce45f`, porcelain 0, trailer `Opus 5 (lane T13-PRELAND)` parser-visible; goldens 0/525 drifted with non-vacuity established (525 corpus rows = 525 manifest keys) and the negative control still convicting (DRIFT_COUNT=1); logs `$SP/pprime-consumers.log`, `$SP/tc-ratchet.log`, `$SP/tc-strict.log`. **The ONE build is UNSPENT** — no dist measurement exists at `822c4f93a`; predicted closure **1,046,330 ± 250 RAW** (from 1,047,496 at build #6b), engine 675,339 with a stated code-motion caveat.

*Priority:* **HIGH for (2)** — the whole cure rests on that equivalence. MEDIUM for (3) and the chair's error. LOW for (1) and (4).
