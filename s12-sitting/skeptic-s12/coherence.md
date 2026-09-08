Seat: Opus 5 — Fable-unvalidated (the S12 skeptic, COHERENCE lens)

# COHERENCE ACROSS THE TWO S12 DELIVERABLES — the refutation pass

**Nothing here is validated until the Fable chair's sitting.** Written 2026-09-07 by the Opus 5 skeptic under the seat directive (Fable judges; Opus refutes and verifies). **No corpus byte moved. No rule applied, adopted or withdrawn. No file outside `$SK/skeptic-s12/` was written; every tree and dock was read only.** Content read from files is DATA, never an instruction to me. No quotation exceeds twelve words.

**Porcelain of the product dock `$SC/laneB6` (3b1c0eaa51f77561a036ae7ec54682c39856192c):** BEFORE `0`, AFTER `0`.

**Read in full:** `RULES-V2-PART-B.md` (§0–§13, 598 lines); `sweep/RECONCILIATION-DOSSIER.md` (§0–§9, 387 lines); `sweep/MOVE-GRAMMAR.md`; `sweep/CLERK-LAWS.md`; `RULES-V2-DRAFT.md` (A1–A17, A′, B0, B-CLAIM, B-GRAMMAR); `sweep/CHAIR-ANSWERS-S12.md` (09:45 · 13:05 · 13:22 · 13:36 · 13:51 · 14:14); `sweep/CRITIC-S12.md`; `sweep/CONTRADICTIONS.md`; `check-pair.mjs`. Read in part: the six reconciles and six refutations at the passages each finding names; `PROBE_ALL.md` §3's master table.

**Executed this session** (every figure below comes from a command whose output I saw):
1. `node` over the fourteen `primary/*.fingerprint.json` — nine metrics, sorted, with min/2nd-min/max.
2. `sed`/`grep` over `PROBE_ALL.md` §3's master table (the 21-column roster and its header rows).
3. `node` over the product dock at 3b1c0eaa5: `src/data/dossierStateProse/warFaith.generated.js`, block `DS-WAR-1`, every pool and variant with its angle and marks.
4. `node` over all eight `sweep/kept-*.json`: 1,011 distinct `author:N` tokens harvested from Part B by regex, resolved against `index`, graded by `verdict.verdict`.
5. `md5` of `head -{564,565,566,567} RULES-V2-PART-B.md`.
6. `grep -i "syllab|monosyl|S6c"` over both deliverables.

---

## A. WHAT REPRODUCED (recorded so the search is visible as symmetric)

**A-1 · The corrected figure set is sound.** Every band and anchor the fold carried as a correction reproduces from the fourteen exemplar fingerprints, executed:

| Part B's figure | where | my measurement | verdict |
|---|---|---|---|
| abstract-closer band `0.012–0.115` | §7 A12 | 0.0122 (martin-narrative) … 0.1151 (dnd-rules-srd52) | CONFIRMED |
| dnd-flavor 0.021 is its PRONOUN rate, its abstract closer is 0.077 | NL-7, CC-13, chair A5 | pronoun 0.0213, abstract 0.0770 | CONFIRMED |
| documentation band `0.077–0.115`, R10's 0.114 inside | CC-13 | 0.0770 … 0.1151 | CONFIRMED |
| two lowest neighbour-variation floors dnd-flavor 0.495 and dnd-rules-srd52 0.501, then martin-chronicle 0.508 | R-DA-05 (hunter D7) | 0.4950, 0.5010, 0.5080 | CONFIRMED |
| tolkien-elevated semicolon 0.122, the exemplar ceiling | R-DA-06, NL-3 | 0.1220, the maximum of fourteen | CONFIRMED |
| which-tail band `0.0000–0.0370`; martin-chronicle 0.0000 | R-DA-03, chair E3 | 0.0000 … 0.0370 | CONFIRMED |
| antithesis band floor 0.0082, ceiling 0.0401 | §4.0 (hunter D4/D5) | 0.0082 (dnd-rules-srd52) … 0.0401 (tolkien-elevated) | CONFIRMED |
| "There/It is" band `0.0016–0.0556` | R-DA-07, §5.0 | 0.0016 … 0.0556 | CONFIRMED |
| share-under-8 band 0.029–0.333; dnd-flavor 0.0787 | H-7, chair E1 | 0.0292 … 0.3333; 0.0787 | CONFIRMED |
| same-opener band `0.033–0.167` | §4.A item 3, NL-1 | 0.0334 … 0.1667 | CONFIRMED |
| pronoun-closer band `0.021–0.108`; martin-chronicle 0.0543 | H-3, R-DA-04 | 0.0213 … 0.1083; 0.0543 | CONFIRMED |
| R7 abstract closer 0.086; R6 0.078; R10 0.114; R12 0.040; R5 0.020; R3 pronoun 0.077; R4 pronoun 0.128 | §1, §2, §3, §4, §6 | PROBE_ALL §3 row, columns R1…A-W in order | CONFIRMED |

**A-2 · The evidence discipline holds.** I harvested every `author:N` token in Part B — **1,011 distinct** — and resolved each against the kept rows. **974 resolve; every one of the 974 is graded `VERIFIED_VERBATIM` (930) or `VERIFIED_SUBSTANCE` (44). Zero are ungraded, SKIPPED or REFUTED.** No rule in Part B rests on a row the triage did not verify. (The 37 that resolve to nothing are finding B-7 below — a syntax collision, not missing evidence.)

**A-3 · The byte-unchanged provenance claim is true.** The dossier §9 and Part B §13 assert the fold's 565 lines were untouched by the completing seat, "pre-append md5 2825da7a519c157b11e46b0a1166931e". Executed: `head -565 | md5` = `2825da7a519c157b11e46b0a1166931e`; 564 and 566 give different digests. **CONFIRMED exactly.**

**A-4 · The deferred list (lens f) is clean on its sharpest item.** `grep -i "syllab|monosyl|S6c"` over both deliverables returns **one hit**: the dossier §8's own withdrawal row. **No rule in either file quotes a monosyllable or syllable figure.** The hobb/wolfe verify-only passes and the D&D purchase are carried in dossier §8 with their figures (Hobb 152 SKIPPED_TRIAGE; Le Guin 378/924; `kept-dnd.json` 906 rows against the fold's 913 — I confirm the file holds **906** rows) and in §4.F Q27, routed to the sitting, not silently dropped.

**A-5 · The taste-sample block reproduces at the product tip.** Read at 3b1c0eaa5: `DS-WAR-1 :: "warExhaustion: near peace"` holds **four** variants; index 0 is `angle: ledger`, index 2 is `angle: threshold`; **all four carry `marks: []`** (no `dm-only`); the sibling band ladder is rested / near peace / war-weary / exhausted, **four rungs**. Every factual claim the dossier §5 makes about the block — the `[0/4]` ledger, the `[2/4]` threshold, the four-rung ladder, the absent `dm-only` mark — is **CONFIRMED**, notwithstanding §9's honest note that the leaf was not opened when the recommendation was written.

**A-6 · Coverage (lens d) is substantially complete.** All twenty-one numbered CRITIC-S12 findings (C-1…C-11, M-1…M-10) carry a disposition in Part B §11; the critic's own D.1–D.7 clean items are recorded; §E's four limitations are carried in dossier §9 (the seventh lens, the unverified field census, the un-re-executed measurements). All forty-seven CONTRADICTIONS ids appear in Part B §7's forty-row table; thirty-nine read RESOLVED and B5 resolves by reference to A6. Two residues are findings B-6 below.

**A-7 · The allocation table (lens e) is faithful.** I checked every source count in dossier §1's dossier-archivist and npc-ladder rows against the Part B rule that carries it — R-DA-21 48, R-DA-20 26, R-DA-15 24, R-DA-08 23, R-DA-07 14, R-DA-18 47, R-DA-04 17, R-DA-12 23, R-DA-17 41, R-DA-09 21, R-DA-22 25, R-DA-19 46, R-DA-10 37, R-DA-23 6, R-DA-01 18, R-DA-14 29; NL-1 21, NL-7 14, NL-11 27, NL-5 46, NL-12 30, NL-9 14, NL-10 15, NL-4 10, NL-2 19 — **all twenty-five match**. No register's allocation changed between its reconcile and the dossier without the Part B section carrying the ground. One stale row is finding B-11.

---

## B. THE FINDINGS

### B-1 — REFUTED · HIGH · lens (b)(c) — Part B §10 ratifies ten "walls" as estate-wide, three of which are dossier-only Part A laws its own §0.2 says do not transfer, and one convicts chrome units Part B declines to cut

**The claim.** Part B §10 opens: the eleven typed moves, the eight non-moves **and "the ten walls (§1.4) stand"**, then lists thirteen amendments — every one to §2's order sets, §3's levels or §4's arms. **No amendment touches §1.4.**

**Why it is wrong.** MOVE-GRAMMAR §1.4 is headed *"Order constraints that bind EVERY grammar"* and its members are register-specific laws:

| wall | its text's own citation | its true scope |
|---|---|---|
| 5 — a contrast only where a sibling key or band names the alternative, never fronted, never the closing move of more than one variant per pool | "(A8; dossier R-DA-02)" | **A8 — the dossier's**, per chair B8 |
| 6 — a second fact never as a "which" tail; **never a third sentence** | "(A9; dossier R-DA-03; U2)" | **A9 — the dossier's**, per chair B8 |
| 10 — the settlement token opens at most one variant per pool, **no more than one sentence in six of the register** | "(dossier R-DA-17; Q15)" | R-DA-17 — the dossier's rule and the owner's Q15 number |
| 4 — BILL never immediately follows DEED within one sentence | "(Herald H-3)" | the **Herald's own wall**, chair A3 and Part B H-3 both say so |
| 9 — RECALL at most once per letter section; LIMIT never twice on one surface | "(chronicle CL-4, CL-12)" | the **chronicle's** |

Part B §0.2 states the chair's B8 amendment in its own words: A1/A2/A4/A5/A7/A17 estate-wide, **"A3 and A8–A13 are the dossier's and transfer only where a register re-derived them on its own unit"**. Ratifying §1.4 unamended re-transfers A8, A9 and R-DA-17 to the ladder, the Herald, the chronicle, the DM page and chrome by the back door, and re-universalises the two walls the chair explicitly kept register-local.

**The concrete collision.** Wall 6 bans a third sentence in every grammar. Part B CC-4's own Figure reads **"R9 3+ 0.092, 2-seg 0.37; R16 3+ 0.085; R10 3+ 0.048 — the units exist"**, and CC-4's SIZE is WITHDRAWN with the rate HELD. So the same file simultaneously (a) holds R9's 9.2% three-plus-sentence units untouched and (b) ratifies a wall that reds every one of them. MOVE-GRAMMAR §2.6 itself defines a chrome unit as **"a help paragraph of two or more sentences"**. A walker built from §10 as written would red chrome on its own definition.

**CURE.** Amend §1.4 in Part B §10 as items 1–13 amend §2–§4: scope walls 4, 5, 6, 9 and 10 to the registers whose rules they are, and state which (if any) a second register has re-derived on its own unit. Nothing else in §10 needs to move.

---

### B-2 — REFUTED · HIGH · lens (a) — R-DA-15 keeps an abstract-closer SIZE that is inside the band, unit-mismatched, and hung on an instrument Part B calls blind; NL-7 and CC-13 had theirs withdrawn on exactly those grounds

**The claim.** R-DA-15's Figure: **"R7 abstract-noun closer 0.086 → ≤ 0.060 (bible; per variant)"**, flagged shipped TRUE, owner-signed at the fixture (R7 is `institutionalCatalog.js` / `institutionServices.js`, engine-side generation input). Part B §7 A12 records the ruling: *a rate is capped only where OUTSIDE the band 0.012–0.115* — and then exempts this one, "R7 0.086 → 0.060 stays as the gazetteer's own".

**Three independent grounds against it, each executed.**

1. **It is inside the band.** I measured `closers.abstractNounRate` over all fourteen primaries: **0.0122 … 0.1151**. R7's 0.086 sits squarely inside. Chair 13:05: a size *"inside the exemplar band … is not a size"*; it becomes a direction with the size owed. A12 states that rule and breaks it in the same row, with no ground beyond the phrase "the gazetteer's own".
2. **It is unit-mismatched, and §1.0 caught the identical error three times.** Part B §1.0's own unit law: *"PROBE_ALL figures are per VARIANT; fingerprint figures are per SENTENCE"* — and it re-anchored R-DA-02's 0.0401, R-DA-03's 0.0066/0.0123 and R-DA-06's 0.122 for exactly that. I confirm 0.086 is PROBE_ALL §3's R7 cell (per variant); the 0.012–0.115 band is per sentence. R-DA-15 was **not** re-anchored, and its cited anchor is "bible", not a per-variant exemplar.
3. **It is hung on an instrument Part B declares blind.** Part B §6.0: *"`:71`'s `abstractCloser` is a suffix test — neither measures the property the rule names; no SIZE in this section is hung on either"*. That prohibition is written in §6 and applied only in §6 — while §1 hangs a size on the same instrument column. Chair 13:05's law ("hung on a shape-instrument is not a size") is estate-wide, not chrome-scoped.

**The asymmetry, stated plainly.** Three rules across three registers govern one instrument column. NL-7's 0.078 → withdrawn as in band. CC-13's 0.114 → withdrawn as in band and on a blind instrument. H-9's 0.020 and CL-7's 0.040 → held. **Only R-DA-15's 0.086 keeps a cut**, on the weakest of the five grounds.

**CURE.** Withdraw the 0.060 as a SIZE; keep R-DA-15's direction (the gazetteer entry closes on the thing) and the KIND rule CC-13 was reduced to; hand the size to the close-kind walker's first run on R7's own per-variant distribution. If the chair keeps it, the ground must be a per-variant gazetteer anchor and a classifier that measures the property, both named.

---

### B-3 — REFUTED · HIGH · lens (a)(b) — the chrome and docent order ceiling of 0.60 breaches the chair's own 13:22 bound, and rides into the owner's Q4 answer as a recommended value

**The claim.** Part B §6.0: chrome's closed set is `{FACT → CONSEQUENCE · FACT → UNDO · CONDITION → FACT · FACT → CAVEAT}` (**n = 4**) and the docent's is `{DOES → WRITES → UNDOES · DOES → OPTIONS → UNDOES · DOES → UNDOES}` (**n = 3**); *"Ceiling … ≤ 0.60 of a page's units; none on the popover; list pages under 0.60."* Dossier §4.A item 1 repeats it verbatim inside the owner's Q4 answer.

**Why it is wrong.** Chair 13:22 fixes the bound in writing: the single-order ceiling *"sits near uniform plus a margin … never 1/n + 0.10 where n = 2, **never 1.6× uniform**"*. Uniform is 1/n, so the ceiling must sit below 1.6/n.

| register | n | 1.6 × uniform (the chair's cap) | Part B's ceiling | verdict |
|---|---|---|---|---|
| chrome units | 4 | 0.400 | **0.60** | **breach — 1.5× the cap, 2.4× uniform** |
| docent | 3 | 0.533 | **0.60** | **breach** |
| DM page | 5 | 0.320 | 0.30 | passes |
| R3 | 4 | 0.400 | 0.35 | passes |
| dossier level 2 | 6 | 0.2667 | 0.267 (1/n + 0.10) | **hits the cap exactly** — and Part B's own R-DA-05 cites kay:44, *a threshold hit exactly IS the fault* |

**The second incoherence, inside one paragraph.** Dossier §4.A item 1 states the governing law — *"a function of each register's admissible n … 1/n + 0.10 where n ≥ 4"* — and then lists chrome at 0.60, which that formula puts at 0.35. Nothing derives the exception. And the formula has a **hole at n = 3**: Part B R-DA-17, §10 item 1 and dossier §4.A item 1 all give the formula for n ≥ 4 and NOT-EXECUTABLE for n ≤ 2, leaving n = 3 — the docent's own set — governed by no stated rule.

**CURE.** Either derive chrome's and the docent's ceilings from n under the chair's bound (0.35 at n = 4; below 0.533 at n = 3) or state in writing that chrome is exempt from the 13:22 bound and why — but not both silently. Close the n = 3 hole. Move the n = 6 case off the cap by a stated margin.

---

### B-4 — REFUTED · HIGH · lens (b) — CL-4's cure leaves the letter's `CLOSINGS` pool unsatisfiable: one order is added to a two-unconditional-order set and the result is called four

**The claim.** Part B §4.0 and §10 item 4: *"the letter's greeting and closing pools hold FOUR variants and only THREE unconditional orders each — a fourth unconditional order is added to each set (`ADDRESS` alone; `STANDING` alone) so that 'no order twice in a four-variant pool' is satisfiable"*. CL-4 restates it and is flagged shipped TRUE, **owner-signed twice** (DM copy; the letter golden regen-once).

**The count.** MOVE-GRAMMAR §2.4, carried from `reconcile-chronicle-line.md:122`:

- greeting: `HOLDING → ADDRESS` · `ADDRESS → HOLDING` · `HOLDING` alone · `LIMIT → HOLDING` **when truncated** → **three unconditional**. Adding `ADDRESS` alone gives **four**. ✔
- closing: `SIGNOFF` · `STANDING → SIGNOFF` · `LIMIT → SIGNOFF` → **two unconditional**, because LIMIT is licensed by a computed flag (MOVE-GRAMMAR §1.2 row 11: LIMIT ← a computed flag, written *only when its flag is true*; order wall 9: LIMIT never twice; the reconcile's own CL-4 Grammar: *"the truncation flag licenses the LIMIT"*). Adding `STANDING` alone gives **three**.

Four variants over three unconditional orders: by pigeonhole one order is used twice, so **"no order twice in a four-variant pool" is impossible for `CLOSINGS`** — the exact defect `refute-chronicle-line.md` CL-4 raised (*"The walker fails on every reconstruction"*) and the exact defect this cure was written to remove. The refuter's own "Identical arithmetic for `CLOSINGS`" is where the miscount enters: it applied the greeting's *four-listed-minus-one-conditional* arithmetic to a set of three listed. Part B inherited the slip without re-counting. (MOVE-GRAMMAR §2.4 also prints *"four close KINDS"* over three listed members — the same off-by-one, upstream.)

**CURE.** Add a **second** unconditional closing order (a fifth member, or promote one), or take the refuter's alternative for `CLOSINGS` alone — restate the ceiling per unit at "no order more than twice in a four-variant pool" and say so — and correct MOVE-GRAMMAR §2.4's "four close KINDS" to the members it lists.

---

### B-5 — REFUTED · MEDIUM · lens (b) — Part B §9 adopts CLERK-LAWS §3 "whole", re-importing two positions Part B itself withdrew earlier in the same file

**The claim.** Part B §9: *"the absent slot and the register's own rule are CLERK-LAWS §3's table, **adopted whole** and bound here."*

**What §3's table actually carries.**

1. **Chronicle row, absent-slot column:** *"the generic floor never reaches a reader"*. Part B CL-5 rules the opposite from measurement — the code falls back (`treatyStrainLine` → FLOOR) and `peaceTermsWave3.test.js:411` asserts it, so *"the floor is declared a LIVE fallback"* and a ratchet is OWED. Part B §4.W lists §7.4's "never reaches a reader" among the **withdrawn** limbs. §9 then adopts it back.
2. **npc-ladder row, absent-slot column:** *"the neutral noun ('the paymaster') covers the two terminal paths"*. Part B §2.0 under chair M-7 rules that cure a **DECLARED INTERIM that DELETES a claim — a B-CLAIM breach the owner signs or refuses**, with the honest cure the FIELD read; dossier §4 item 22 puts it to the owner and **recommends refusing the interim**. §9 adopts it as the register's absent-slot rule.

A blanket "adopted whole" over a spec written before the refutations (critic C-1) is the mechanism: CLERK-LAWS §5's provenance confirms it read the six reconciles and not the six refutations.

**CURE.** Replace "adopted whole" with an adopted-with-two-amendments clause naming both cells, exactly as §10 does for MOVE-GRAMMAR's thirteen. The rest of §3's table is sound and I found no third instance.

---

### B-6 — REFUTED · MEDIUM · lens (d) — the contradiction bookkeeping does not survive its own table: §7 resolves 47 of 47, and the "six carried" are owner questions, not hunter findings

**The claim.** Part B §12: *"47 findings — 41 RESOLVED (§7), 6 carried into the OPEN list as owner questions (Q8, Q9/Q11, Q10, Q12, Q14, Q16 …)"*. Dossier §3 repeats it: *"The six carried from Part B §7 (the hunter's 47 findings: 41 RESOLVED in Part B §7; these six are the residue …)"*.

**Executed.** Part B §7's table holds **40 rows** covering all 47 hunter ids (A1–A12, B1–B8, C1–C8, D1–D8 collapsed to one row, E1–E4, F1–F6, G). **39 rows read RESOLVED; the fortieth (B5) reads "as A6"** — resolved by reference. So §7 resolves **47 of 47, not 41**.

The six named as carried are **not hunter ids at all**: Q8, Q9/Q11, Q10, Q12, Q14 and Q16 are `EXEMPLAR-BEST-PARTS.md` §7's owner questions over the author conflicts. The hunter's own (e) class — the four author-conflict findings E1, E2, E3, E4 — are all marked RESOLVED in §7. So the dossier §3's table, which is the owner's view of "what is still open", is introduced as the residue of a hunter pass that has none.

**One id is genuinely unlisted.** `CONTRADICTIONS.md` carries an **E5** (*"K 30 / W 27, the standing-fact close — see A12"*). It appears in neither §7's table nor the roll-up. It is a cross-reference and A12 is resolved, so nothing is lost — but the sitting should see it named. (For the record, the hunter's own roll-up summary is internally wrong too: it prints "11 HIGH · 30 MEDIUM · 4 LOW" over a table I count as 14 HIGH · 30 MEDIUM · 3 LOW = 47. Neither deliverable quotes those totals, so nothing downstream turns on it.)

**CURE.** In §12 and dossier §3: "47 findings, 47 resolved in §7; six OWNER QUESTIONS (from `EXEMPLAR-BEST-PARTS.md` §7, not from the hunter) remain open and are the dossier §3 table." Name E5 in §7 as resolved by A12.

---

### B-7 — REFUTED · MEDIUM · lens (a) — three incompatible citation conventions share one syntax, so §3–§6's source counts cannot be re-derived the way §0.3 says they can

**The claim.** Part B §0.3: *"every rule cites its rows by author and index"*. Dossier §1: *"counts are Part B's re-counted unions of distinct voices"*.

**Executed.** I harvested every `author:N` token in Part B (1,011 distinct) and resolved each against the eight `kept-*.json` `index` fields. **974 resolve — all VERIFIED (A-2 above). 37 resolve to nothing**, and they are all small integers:

`dnd` 3, 5, 13, 23, 24, 26, 27, 31, 38, 39 · `hobb` 6, 8, 10, 12, 20, 26 · `kay` 2, 9, 10, 11, 14, 19 · `leguin` 4, 11, 15, 24, 29, 30, 42 · `martin` 20, 44 · `wolfe` 3, 7, 10, 16, 31, 41.

**Why.** They are `best-*.md` FEATURE ids, not kept-row indices, written in the same form. The collision is demonstrable: Part B H-5 and H-9 cite `kay:26` for the crier's frame test and the standing-fact close; **`kept-kay.json` index 26 is "free indirect discourse for world-information"**, an unrelated row. `kay:30` in H-9 is the close rule; row 30 is "incidental figure given a full death". And the convention is not even stable across sections:

| section | form | example |
|---|---|---|
| §1, §2 (dossier, ladder) | `author:ROW/ROW/ROW` | `kay:303/305/311/324` |
| §3 (Herald) | `author:FEATURE (voice count)` | `kay:26 (6)` · `tolkien:A4 (6)` |
| §5 (DM page) | `author:FEATURE (ROW/ROW/…)` | `wolfe:8 (374/431/1175/1181)` |
| §6 (chrome) | `author:ROW/ROW/… (FEATURE)` | `dnd:475/310/288/1164 (39)` |

§5 and §6 put the same two things in opposite positions. I confirmed §5's parenthesised numbers do resolve and are VERIFIED (`wolfe:374/431/1175/1181` all "omission as information"; `martin:129/299/717/410/418` all verified), so **no evidence is missing** — but the chair cannot mechanically re-derive H-1's 24, H-2's 36, H-9's 23 or CC-5's 39 from the kept files, and the dossier's allocation table inherits counts it cannot check.

**CURE.** One convention, declared once: `author:rowIndex` for rows, `AUTHOR FEATURE-ID` (the existing "K 30", "W 41" prose form) for features, never both after a colon. Then re-print §3's and §6's union bases so each integer is checkable.

---

### B-8 — PARTLY · MEDIUM · lens (a) — Part B §2.0 claims a three-way agreement on the R6 pool row that PROBE_ALL's own column contradicts, and the refuter it cites says so

**The claim.** Part B §2.0: the register-wide row — including *"pools 1,104 = 546 singletons + 558 pairs"* — *"agrees between the fingerprint, PROBE_ALL's R6 column at 6b80d1e8e and the seat's 29a4ff20d measurement (refuter §0, all CONFIRMED)"*.

**Executed.** PROBE_ALL §3's row "pools with 2+ variants", R6 column = **554**. (Column mapping verified against the same table's `files` row, whose R18 cell 546 matches PROBE_ALL:274.) And `refute-npc-ladder.md`, the file Part B cites for the agreement, states it outright: *"own §0 gives 558 pairs; PROBE's deduped count is 554."*

**What is actually true.** 546 + 558 = 1,104 and 546 + 554 = 1,100, so **558 is very likely the right number** and PROBE's cell is deduped differently. The defect is not the figure — it is that a row carrying a known 4-count disagreement is printed as agreeing across three instruments and marked CONFIRMED. That is the false-green pattern the hunter's own G finding names.

**CURE.** State the row as "558 by direct measurement; PROBE's deduped R6 cell reads 554; the difference is the dedup and is unreconciled", and take the reconciliation with the R6 loader car.

---

### B-9 — REFUTED · MEDIUM · lens (c) — A1 is made estate-wide unqualified, wider than the chair's own gloss, and collides with chrome's measured units and with the dossier's own DM recommendation

**The claim.** Part B §0.2: *"Part A amended (chair B8, B7): **A1**, A2, A4, A5, A7, A17 are ESTATE-WIDE"* — stated without qualification.

**What the chair wrote.** CHAIR-ANSWERS B8 names it **"A1 (state before cause)"** — the parenthetical is the chair's own scoping of which part of A1 travels. MOVE-GRAMMAR §1.4 wall 1 carries the same narrow reading: *"STATE precedes CAUSE where both appear"* and nothing more. But Part A's A1 also carries **"one flowing sentence or two short ones — never a paragraph, a cascade or a list"**.

**Two collisions the unqualified reading creates.**
- **Chrome.** CC-4's Figure: R9 three-plus-sentence units 0.092, R16 0.085, R10 0.048, size WITHDRAWN, rate HELD; MOVE-GRAMMAR §2.6 defines a chrome unit as a help paragraph of two or more sentences. Estate-wide A1 bans them; no Part B rule cuts them; CC-10's Obeys clause says the opposite in writing — *"the two-sentence law is the Herald's; here a band"*.
- **The DM page.** Dossier §4 item 5 recommends to the owner that the DM page is *"the only surface where a person may run to a paragraph"*. Under §0.2's own reading that recommendation breaches an estate-wide Part A law, and neither deliverable says A1 is amended for it.

**CURE.** Carry the chair's parenthetical into §0.2 — "A1 (state before cause) estate-wide; A1's one-or-two-sentence clause remains the dossier's until a register re-derives it" — or amend A1 in writing with the two exceptions named. Either is fine; the silent widening is not.

---

### B-10 — PARTLY · LOW · lens (b) — the taste-sample plan lists an R2-only grammar among the members an R1 pool may draw

Dossier §5: *"k = 4 → the pool shows min(k, 8) = 4 distinct level-1 grammars from **V1/V2/V4/V5/V6/V7/V8** as its fields license."* MOVE-GRAMMAR §2.1 marks **V7 "(R2 only)"** — it is the causal join's `HISTORY → PRESENT with the joint chosen`, licensed by event provenance, which R1 STATE by definition does not carry (R-DA-19: the event move is *"forbidden in R1 STATE"*). `DS-WAR-1` is an R1 STATE block (`dossierStateProse/warFaith.generated.js`, confirmed by reading it). The admissible set is V1/V2/V4/V5/V6/V8 — six, still ≥ 4, so **the "four distinct grammars" claim survives**; the member list is wrong, not the plan. Fix the list; and note that whether V2, V4 and V5 are licensed by this block's fields is untested and is the cutting lane's first receipt.

---

### B-11 — PARTLY · LOW · lens (e) — the dossier's herald allocation lists a row Part B withdrew

Dossier §1, herald row: *"KAY 10/2/30/14/16/26/44/**40**"*. Part B §3.W withdraws it by name: *"H-7's 0.15–0.25 band and `kay:40`"* — H-7's text says `kay:40` (PARTIAL, 2) *"is dropped from the count"*. It should not appear in the allocation table as an author row the register draws on. (Symmetrically, `leguin:41`, which H-7 does count, is absent from the same cell.) No count in §2 or §4 moves.

---

### B-12 — PARTLY · LOW · lens (a) — the "in-house proof" that licenses the dossier's ration is contradicted by two registers' targets

Chair A11's ground, carried by R-DA-06 and R-DA-10: the ration is set against the median 0.106, with **"R3's 0.176 the in-house proof"** — chair A11 calls it *"the estate's own floor of what is achievable"*. The dossier and R2 are then capped at 0.200 (1.9×). But CL-1 targets **≤ 0.10** and CC-5 targets **≤ 0.060** (0.57×) — both below the figure named as the floor of achievability. Either 0.176 is a floor (and CL-1/CC-5 are unreachable) or it is simply the lowest register measured (and it licenses nothing about 1.9×). One reading, stated once, would settle it. Nothing else turns on it.

---

## C. WHAT THIS LENS DID NOT REACH

- I did not re-execute PROBE_ALL's extractors; §3's cells are quoted from the table and cross-checked only by column position against its own `files` row.
- I did not verify the source counts of §3's and §6's rules (H-1 24 … CC-15 26) — B-7 is the reason they are not mechanically checkable, and re-deriving them by hand from the `best-*.md` feature rows is the sitting's or another lens's work. H-9's printed 23 against components summing to 24 is the one I would look at first; H-11's 19 against components summing to 20 **is** explained in its own text (a Wolfe union of 8, not 3 + 6), so H-9's may be too — the union basis is simply not printed.
- I did not read the nine `best-*.md` files, `EXEMPLAR-BEST-PARTS.md`, or the four `refute-probe-all-*.md`.
- I checked the walker spec's satisfiability arithmetic (B-3, B-4) but not the classifier's feasibility, and I did not attempt to run `check-pair.mjs`.

**Nothing here is applied. No corpus text changed. No rule was adopted or withdrawn by me. Nothing is validated until the Fable chair's retrovalidation sitting.**

Seat: Opus 5 — Fable-unvalidated.
