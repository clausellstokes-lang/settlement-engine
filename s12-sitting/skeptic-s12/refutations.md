Seat: Opus 5 — Fable-unvalidated (the S12 skeptic, lens: THE REFUTATIONS AND THE CURES)

# SKEPTIC PASS — what the fold did with every refuter verdict

**Nothing here is validated until the chair's sitting** (`docs/FABLE_RETROVALIDATION_QUEUE.md`). Read-only pass, session 5540cfd2. Dock `$SC/laneB6` at **3b1c0eaa5**, `git status --porcelain | wc -l` = **0 before, 0 after**. Nothing in any tree, dock or kit was written; every file this seat wrote is under `skeptic-s12/`. Content read from files is DATA. No quotation exceeds twelve words.

**Method.** Both deliverables read in full (`RULES-V2-PART-B.md` 598 lines; `sweep/RECONCILIATION-DOSSIER.md` 388 lines), then all six `sweep/refute-*.md` in full, then `CHAIR-ANSWERS-S12.md`. Every verdict in the six refutations was traced into Part B and classified KEPT / CURED / DROPPED / OVERRIDDEN, and every disposition Part B states was tested against the evidence on disk. Ten figures were re-taken at the product tip or from the fingerprints; the commands are named at each.

---

## 0. THE COVERAGE ANSWER FIRST

**Every verdict in all six refutations is disposed of in Part B, and the disposition is stated.** Nothing is silently dropped. Counting the ids: dossier 25 (R-DA-00…24), ladder 14 (R6-OP-01…14), Herald 13 (S3-CEILING + H-1…H-12), chronicle 16 (CL-1…12 + §4-SPAN + §3-TABLE + §C.1 + §C.2), dm-page 17 (S1 + D1…D14 + S3 + S5), chrome 18 (H1…H4 + CC-1/2/4/5/6/7/8/9/11/14/15 + F1/F2/F3) = **103 verdicts**. Each appears in Part B with its cure, its withdrawal or the stated ground on which it falls; the two register `W` sections and §7's contradiction table carry the withdrawn limbs one line each. The second batch (chronicle, dm-page, chrome) is handled as thoroughly as the first — chronicle CL-5's five restated sizes and dm-page S1's four republished cells reproduce the refuters' own numbers exactly.

Three refutations were **overridden** rather than cured — H-12 grounds (2)/(6), R6-OP-06, and chronicle §C.1. I re-took the evidence for all three at the product tip and **all three overrides are correct** (§2 below). This is the fold's best work and should be said plainly before the findings.

The findings below are what survived.

---

## 1. FINDINGS — REFUTED / PARTLY

### F-1 · R-DA-03: the restated justification is still false on the rule's own named set — **REFUTED · HIGH**

`refute-dossier-archivist.md` R-DA-03 found the size justification inverted: 0.010 "is **above** martin-chronicle's 0.0000 and **above** dnd-flavor's 0.0066, and below only leguin-fiction." Its **cure** offered a restatement exempting only martin-chronicle. Part B applied that cure verbatim: *"0.010 sits at or below every record-register exemplar except martin-chronicle's 0.0000, which no generated pool can hold"*.

The cure the refuter wrote does not answer the ground the refuter found, and the fold adopted it unchecked. Measured this session from the fourteen `primary/*.fingerprint.json` (`shapes.whichTailRate`):

| exemplar | whichTailRate |
|---|---|
| martin-chronicle | **0.0000** |
| **dnd-flavor** | **0.0066** |
| leguin-fiction | 0.0123 |
| tolkien-plain | 0.0100 |

`reconcile-dossier-archivist.md:105` defines the set in the rule's own words — three record-register exemplars (martin-chronicle, dnd-flavor, leguin-fiction), with the D&D **rules** columns expressly excluded as "documentation, not a record". So the exemption of one member leaves the sentence false for **dnd-flavor 0.0066**, a member the rule itself names, and equal (not below) at tolkien-plain 0.0100.

Two further grounds compound it:
- **Part B's own §1.0 does not deliver what it promises.** §1.0: *"the refuter found three per-variant ceilings anchored on per-sentence exemplars (R-DA-02's 0.0401, **R-DA-03's 0.0066/0.0123**, R-DA-06's 0.122). Those sizes are re-anchored below."* R-DA-02 **was** re-anchored (per-variant BIBLE 0.045) and R-DA-06's mix was argued immaterial (R2 segments/variant 1.135). R-DA-03 was neither re-anchored nor excused — it keeps 0.010 and re-argues it against the same per-sentence anchors.
- **Chair E3 asked for the re-anchor in terms.** `CHAIR-ANSWERS-S12.md` 13:36: *"R1 … takes R-DA-03's direction with the size re-anchored per-variant."* A per-variant anchor exists and the fold did not use it or say why: `PROBE_ALL.md:320` gives the per-variant gloss-tail column, **BIBLE = 0.000**.

**Consequence.** R-DA-03 is `changesShippedSurface: TRUE`, owner-signed, and is listed in dossier §4.D as rewriting R1 (0.066), R2 (0.054) and A-U (0.062) in place. The direction is unimpeachable and no refuter contests it; the **size** 0.010 is what the false sentence licenses.

**Cure.** Either state the true set — "at or below leguin-fiction 0.0123, above dnd-flavor 0.0066 and martin-chronicle 0.0000, and chosen for X" — or take the chair's instruction and set a per-variant size against the per-variant column, saying that BIBLE's 0.000 is unreachable, exactly as the martin-chronicle clause already does for the per-sentence column.

---

### F-2 · H-1's one-order gesture class is "put to the owner" in Part B and is absent from the dossier's owner list — **REFUTED · MEDIUM**

`refute-herald-pools.md` H-1 ground (3): G-A is the only order carrying GESTURE, so the seeded draw varies nothing on the lines the rule governs, and the rule reproduces fault 9 at the headline tier. Its cure: attach GESTURE to a second order **or** "state plainly that gesture-bearing headlines are a one-order class **and put that to the owner**".

Part B H-1 takes the second branch verbatim: *"gesture-bearing headlines are a ONE-ORDER class today (G-A alone carries GESTURE) and that is put to the owner"*.

Measured: `grep -n -i 'gesture' sweep/RECONCILIATION-DOSSIER.md` returns **two hits, neither an owner question** — the §2 rule-table one-liner (:99) and a passing mention inside item 8 (Q10 parataxis, :219). §4.A/§4.C carry no item for it; §4.C item 4 (Q3) asks the owner only to "decide R5 — add a PLACE- or PARTY-free move the crier may lawfully hold, or refuse". The dossier is the owner's document and §4 is its question list; a matter Part B routes to the owner and the dossier does not ask is not routed.

Severity is MEDIUM rather than HIGH because H-1 is `Shipped: no byte moves` (a regression fence), so no reader-facing text turns on it — but the fold's own disposition is undelivered.

**Cure.** Add it to dossier §4.C beside item 4 (both sides already written in Part B H-1: the one-order class as it stands, against the offered G-C/G-D `STANDING → DEED-with-gesture` second order, "test this").

---

### F-3 · R-DA-17's cure invents a licensing field the fold does not name, while three sibling rules with the same defect are declared NOT-EXECUTABLE — **PARTLY · MEDIUM**

`refute-dossier-archivist.md` R-DA-17 ground (3)/(4): the fourth owner grammar ends on an "unresolved question"; the rule *"assigns a licensing field to every other member … and **none to this one**"*, under a corpus-wide zero-question floor. Its **cure** was narrow and field-safe: realise it *as R-DA-08's declared-gap sentence in the clerk's third person, licensed by a `not-held` field, never as an interrogative*, plus `question rate = 0` as a standing walker assertion.

Part B did not take that cure. It created a **new** move: *"the OPEN QUESTION move — a STANDING-OPEN state licensed by a state field whose value is unresolved/contested/pending"*, with R-DA-08's declared gap demoted to a fallback "where no such field exists". Chair F3 uses the same words, so the fold is applying the chair — but the field is named only as a class, never as a field in the corpus, and:

- Part B's own §908 law (§0.1 row 5) says *"a rule keyed on a field no receipt ships declares itself NOT-EXECUTABLE"*. It is applied to **R-DA-09** (two-account provenance), **R-DA-13** (distance/reliability) and **R-DA-16** (`count.source`/`count.correction`) — all three re-graded NOT-EXECUTABLE, `changesShippedSurface` re-labelled "pending the field", the field listed as an owner-gated schema act (dossier item 30 a–d). R-DA-17's fourth member gets none of that: `Strength STRONG`, `Shipped TRUE`, no NOT-EXECUTABLE marker, and no entry in dossier item 30.
- The DM page's twin **is** treated correctly: D8's typed `unresolved` class is declared OWED and listed at item 30(e), *"owed BEFORE the taste sample"*. The dossier's own recommended taste sample (§5) is a **dossier R1 block**, i.e. the register whose equivalent class is undeclared.

I could not show the field absent: `git grep` at 3b1c0eaa5 finds live `contested` state values (`LivingWorldTab.jsx:149` a faith label; `AdvanceReport.jsx:51` an outcome status; `AdminSimTuningPanel.jsx:73` an occupation `statePhrase` test). So this is PARTLY, not REFUTED — a candidate field plausibly exists. What is refuted is the **asymmetry**: the same defect is declared in three rules and undeclared in a fourth.

**Cure.** Name the field (or the two or three candidates) in R-DA-17, or mark the fourth member NOT-EXECUTABLE under the §908 law and add it to dossier item 30 beside D8's `unresolved` class.

---

### F-4 · NL-1's ≤ 0.07 keeps the category mismatch the refuter named — **PARTLY · MEDIUM**

`refute-npc-ladder.md` R6-OP-04 found two defects in one licence, not one: (i) 0.10 > the 0.070 the sentence bounds it with; and (ii) *"`and the country` is a **second-clause tail** … Using a tail-frame rate as the licence for a per-stage **opener** ceiling is a category mismatch **on top of** the arithmetic one."* Its cure offered two branches: set both at ≤ 0.07 keeping the stated reasoning, **or** keep 0.10 and license NL-1 "from an **opener** figure, not a tail figure".

Part B took branch one for both rules: NL-1's per-stage two-word-**opener** ceiling is *"≤ 0.07 (the crier's measured rate, 26 of 373)"*. That is still the tail-frame rate. Defect (i) is cured; defect (ii) is carried into Part B unmentioned, and §2.W's withdrawn-limbs line records only "NL-1's … 0.10 licence".

The refuter itself offered the branch the fold took, so this is PARTLY. But the refuter's own text says the mismatch survives that branch, and Part B's disposition line reads "R6-OP-04 … applied" without qualification.

**Cure.** One sentence in NL-1: the ≤ 0.07 is an arithmetic bound taken from a tail rate, not an opener anchor; the opener anchor is owed to the walker's first run (which NL-1 already owes for the lift filter).

---

### F-5 · R-DA-08's "inside an existing variant" cure has an unstated collision with R-DA-03's two-sentence wall — **PARTLY · LOW**

The refuter's R-DA-08(b) ground was A7: an unrationed absence licence against *"variants rewritten in place, none added"*. Part B's cure — *"an absence sentence lands INSIDE an existing variant, rewritten in place, never as an appended one; the walker asserts the pool length"* — answers the pool-length half exactly. It says nothing about the **sentence** count: `check-pair.mjs:78` FAILS any AFTER with more than two sentences, and R-DA-03 drives the third sentence to zero. An absence sentence placed inside a two-sentence variant is a third sentence unless the variant is re-authored to absorb it, and Part B does not say which. Neither §0.4 nor §7 records the interaction.

**Cure.** State it: the absence is written *within* the variant's existing sentence budget (a fact replaced, not a fact added), or R-DA-03's wall is declared for absence-bearing variants.

---

### F-6 · CL-10's "§9 deliverable with a named owner" names no owner — **PARTLY · LOW**

`refute-chronicle-line.md` CL-10's cure: *"make the closer-class histogram a §9 deliverable **with a named owner**, holding every SIZE until it runs."* Part B CL-10 echoes the phrase — "the closer-class histogram is a §9 deliverable with a named owner" — and names none; the dossier's §8 owed-arms row lists "the close-kind histogram (R-DA-04)" with *"each is a direction with its spec deferred to the instrument lane"*. The instrument lane is not an owner. Cosmetic, but the cure asked for the one thing not done.

---

### F-7 · Two ladder verdicts are carried without their ids — **PARTLY · LOW**

R6-OP-09 (`it` closer 46 → **48**) and R6-OP-10 (denominator 564 → **558**) do not appear by id anywhere in Part B (`grep -c "R6-OP-09" = 0`, `R6-OP-10 = 0`). Both **substances** are carried, in §2.0's corrections paragraph: *"the 'it' closer is 48 (not 46); the pair-pool denominator is 558 (not 564)"*. Nothing is dropped; only the id-to-cure traceability the fold prompt asked for is missing for these two, and §2.W does not list them either.

---

### F-8 · §7's A12 ruling states a per-sentence band and carves a per-variant exception inside it — **PARTLY · LOW**

Part B §7 A12: *"a rate is capped only where OUTSIDE the band 0.012–0.115 (R7 0.086 → 0.060 stays as the gazetteer's own; NL-7 and CC-13 in band → kind rules)"*. The band 0.012–0.115 is the per-**sentence** fingerprint `closers.abstractNounRate` range (measured: martin-narrative 0.0122, dnd-rules-srd52 0.1151). R7's 0.086 is the per-**variant** PROBE figure (`PROBE_ALL.md:330`), so the band test as stated does not apply to it. The **substance** is sound — the per-variant column carries `BIBLE = 0.060` (same row), so R-DA-15's 0.086 → 0.060 is a legitimate per-variant anchor — but the ruling as written breaches the fold's own §1.0 unit law in the sentence that resolves a unit dispute.

---

### F-9 · Part B §12 counts NL-3 among the sixteen that "survived their refuter as written" — **PARTLY · LOW**

R6-OP-13 is graded *"LOW. NOT REFUTED (noted)"*, so the label is defensible; but its cure ("print it as 4 independent hands + 1 own-instrument measurement") **was applied** — Part B NL-3's Sources line now reads exactly that, and its disposition line says "R6-OP-13 (noted)". If a changed source line is a cure, the split is 15/74, not 16/73. Immaterial to any grade (every NL-3 limb clears three voices); recorded because §12's two integers are quoted forward into the dossier's §2 counts.

---

## 2. THE THREE OVERRIDES — ALL THREE RE-TAKEN AND ALL THREE CORRECT

### O-1 · H-12 grounds (2)/(6) fall — **CONFIRMED**
Part B: *"em dashes HELD at 0 in the crier's strings at the product tip … the refuter's 27 were the ledger tree's."* Re-taken at 3b1c0eaa5: `git -C laneB6 show HEAD:src/domain/display/newsVoice.js | grep -c '—'` = **33**, and a per-line classifier over the same bytes returns **33 comments, 0 inside strings, 0 other**. The refuter's own text concedes it (*"At 6b80d1e8e and 3b1c0eaa5 all 33 are comments and the strings hold zero"*); its ground rested on `29a4ff20d`/`e3840ab62`, which the tree law rules stale. The override is right and the fold's grounds (4) and (1) applications (the tells as a BAN not a rate; `ai:27` struck, count 18) are the refuter's cures verbatim.

### O-2 · R6-OP-06 falls; D6 withdrawn whole — **CONFIRMED**
Part B / chair A1 rest the audience on the code, against `best-own.md:46`'s document label. Re-taken at 3b1c0eaa5:
- `publicSafe.js:101` — `PRIVATE_KEY_RE` is exactly at line 101; neither `compromiseLifecycle` nor `corrupt` matches any alternative in it.
- `publicSafe.js:170` — the npcs-path strip is exactly at line 170 and lists `goal, secret, plotHooks, relationships`; neither key is in it.
- `npcComponents.jsx:254` — the comment reads "Player-safe here"; `:257` calls `npcInteriority({ npc })` with no ground-truth flag; **`:411`** is the render gate `npc.corrupt && compromiseLc?.phrase`.
Every cited locator reproduces. R6 is player-facing at the gate; the withdrawal of a whole rule (D6, eight sizes) on this ground is sound, and the four imperatives are correctly routed to the owner as dossier item 21 rather than cut by the seat.

### O-3 · chronicle §C.1 "the kept files are stable" — **CONFIRMED**
Part B §4.0 declares §C.1 not a hazard on chair 13:05, which cites three md5s. Re-taken: `md5 kept-dnd.json` = **f28a2110**934a607f0e232e91d529e87b, `kept-wolfe.json` = **f59140c8**3aed77a08b34c58ad7a329a0, `kept-leguin.json` = **d9333707**dec715822bac9ed78d86d9dc — all three match the chair's cited prefixes exactly, despite every kept file now carrying an mtime of 09-07 16:16:26 (i.e. the autosave rewrote the bytes identically, as the chair said). The refuter's mtime-based hazard is genuinely answered. The separate 906-vs-913 D&D residual (`kept-dnd.json` holds **906** rows against `best-dnd.md`'s "913 VERIFIED rows") is real and is correctly carried in dossier §8 for re-derivation at the sitting.

---

## 3. WHAT I TRIED TO REFUTE AND COULD NOT (the search was symmetric)

- **The instrument citations.** Every `check-pair.mjs` line Part B and the dossier cite reproduces at the file on disk (136 lines): `:64/:65` NOT LOCATED, `:66` MARKS→notes, `:71–73` DURATION/COUNT, `:74` R4 sibling, `:78` THREE+, `:81` RATIONED, `:85` ANTITHESIS, **`:87` the shape NOTE pushed into `r`** (a genuinely FAILING arm — §6.3's correction of the earlier refuter holds), `:96/:105` R4-BAND, `:109–121` A11 with `:118` the PRE-EXISTING **note**, `:123/:124/:126/:129`, `:130` the three-way verdict with `WITHHELD(R4-BAND)`, `:136` the mechanical-pass caveat. The chair-G relabelling ("instrumented; verdict the refuter's") is applied wherever a Test named a note or a withheld verdict.
- **The `LIVE_STRING_BINDINGS` fence.** `generate-dossier-state-prose.mjs:89` is exactly where `LIVE_STRING_BINDINGS` opens; `economyFreshness.js:187` is exactly the `export const ECONOMY_FRESHNESS_SENTENCES`. Its two members share their first **ten** words, so the refuter's concrete casualty under R-DA-05 is real, and §1.0's single fence with the four inheriting rules named is the refuter's own alternative cure, delivered.
- **The A5 / NL-7 / CC-13 figure.** `dnd-flavor.fingerprint.json`: `abstractNounRate` **0.077**, `pronounRate` **0.0213** — the fold's correction is exact, and the CC-13 documentation band 0.077 (flavor) / 0.0876 (rules) / **0.1151** (srd52) reproduces, so R10's 0.114 does sit inside it and the size is rightly withdrawn. NL-7's exemplar range 0.012–0.115 also reproduces (martin-narrative 0.0122 the floor).
- **The A11 ration correction.** `PROBE_ALL.md:807` prints 0.185 in the FIELD column and the ratio tables (`:924/:935/:977/:980`) all divide by **0.106**. Chair A11's "median never the mean" is correctly applied in R-DA-06, R-DA-10, NL-8(a) (1.75× = 0.1855) and CC-5 (R16 1.0×, R9 0.89×, target 0.57× — all three reproduce against 0.106).
- **CL-5's re-derivation.** Part B's five restated sizes (35 → ≤ 26; 4 → ≥ 9; 36 → ≤ 26; 16 → ≤ 8; ≤ 0.35 of 39) are the refuter's cure number for number, and the `The term` ×4 evidence is deleted as asked; the floor is settled the way the refuter demanded (a ratchet OWED, the floor declared a LIVE fallback meanwhile).
- **The §13 append receipt.** Part B §13 claims §0–§12 byte-unchanged at 565 lines, md5 `2825da7a519c157b11e46b0a1166931e`. Executed: the file is 598 lines; `md5(head -565)` = **2825da7a519c157b11e46b0a1166931e**, and line 565 is the fold's own seat line. The receipt is exact — a rare thing in this program's history and worth the chair's notice.
- **The arithmetic I expected to break.** H-2's re-count to **36** reconciles: the reconcile printed 35 from components summing to 36 (a single stated deduction for Gary K. Wolfe / Dirda); the refuter's Kay correction 10 → 11 moves the components to 37 and the same single deduction gives 36. Part B §12's 91 also adds (25 + 13 + 12 + 12 + 13 + 16), as does 89 = 91 − 2 = 16 + 73, and the dossier's 79 signature rules = 91 − 10 shipped-false − R-DA-09 − R-DA-16.

## 4. WHERE THIS SKEPTIC COULD NOT REACH

- Source counts were not re-derived from `kept-*.json`; the three prior refuters executed that check across ~1,000 row references and found zero missing and zero non-VERIFIED, and I did not duplicate it.
- No PROBE_ALL figure was recomputed from the corpus; each was re-read at its own table cell and cross-checked against the fingerprint JSONs where both units exist.
- `MOVE-GRAMMAR.md` and `CLERK-LAWS.md` were read only where Part B cites them; the seventh lens over the two Fable specs (chair C-1/C-2) is a separate pass and is still owed.
- The existence question behind F-3 is answered "candidates exist", not "the field exists"; naming the field is the cure, and naming it is the fold's or the instrument lane's act, not this seat's.

**Nothing here is applied. No corpus text changed. Porcelain 0 before, 0 after. Nothing is validated until the Fable chair's sitting.**
