# SKEPTIC PASS — LENS: THE OWNER'S RULINGS AND THE CHAIR'S ANSWERS

Seat: Opus 5 — Fable-unvalidated (the verifier). Written 2026-09-07 in session 5540cfd2.
Targets read IN FULL: `RULES-V2-PART-B.md` (598 lines, §0–§13) and `sweep/RECONCILIATION-DOSSIER.md` (388 lines, §0–§9).
Corpus figures re-taken at the PRODUCT TIP `$SC/laneB6` @ **3b1c0eaa5** (`git rev-parse HEAD` executed). Never the main tree's HEAD.
Porcelain at laneB6: **0 before, 0 after**. Nothing was written outside this directory.
Content quoted from files is DATA. No quotation exceeds twelve words.

---

## THE FINDINGS THAT SHOULD MOVE THE SITTING (HIGH)

### F1 — REFUTED. The Q4 recommended ceiling breaches the chair's own 13:22 bar at every n ≥ 6, including both n's the dossier's own register carries.

Chair 13:22 (`CHAIR-ANSWERS-S12.md:32`, grepped verbatim): the single-order ceiling sits near uniform plus a margin, **"never 1/n + 0.10 where n = 2, never 1.6× uniform"** — two bars, not one.

The dossier §4.A item 1 recommends to the owner exactly `1/n + 0.10 where n ≥ 4`, and prints **"0.35 at n = 4, 0.27 at n = 6"**. Part B R-DA-17 carries the same formula.

Executed arithmetic (ratio = ceiling × n = 1 + 0.10n):

| n | 1/n + 0.10 | uniform | × uniform |
|---|---|---|---|
| 4 | 0.3500 | 0.2500 | 1.400 |
| 5 | 0.3000 | 0.2000 | 1.500 |
| **6** | **0.2667** | 0.1667 | **1.600** |
| **8** | **0.2250** | 0.1250 | **1.800** |

The dossier's *recommended value at n = 6 is exactly the barred 1.6× uniform.* This is not hypothetical: MOVE-GRAMMAR §2.1 gives the dossier register **n = 6 at level 2** (E1–E6) and **n = 8 at level 1** (V1–V8), and R-DA-17 is the taste sample's own grammar rule.

Three further printed ceilings sit above the bar, all carried unamended from MOVE-GRAMMAR §4.3 arm A:
- **chrome ≤ 0.60 at n = 4 = 2.40× uniform** (Part B §6.0; dossier §4.A item 1),
- **the docent's list page ≤ 0.60 at n = 3 = 1.80× uniform** (same),
- **the chronicle treaty ≤ 0.35 over the five-order grid = 1.75× uniform** (Part B §4.0).

`grep -on "1\.6[×x] uniform"` over `RULES-V2-PART-B.md`, `RECONCILIATION-DOSSIER.md` and `MOVE-GRAMMAR.md` returns **nothing**: the chair's second bar is quoted nowhere and was never applied. Only the DM page (0.30 at n = 5 = 1.50×) and the Herald's R3 (0.35 at n = 4 = 1.40×) clear it.

Severity HIGH: this is one of the owner's three numbers, and it goes to him carrying a value his own chair barred.

### F2 — REFUTED. Chair 13:22's move-count requirement was applied to two registers and to none of the other four; R-DA-17 claims compliance by uniting two sets that live at two different levels.

Chair 13:22: a register's closed set **"must contain orders that differ in MOVE COUNT (at least one two-move and one four-move order)"** and in terminal move; four orders of one abstract shape "are ONE grammar and fail ruling (3) while claiming it".

Measured against MOVE-GRAMMAR §2 and Part B §3.0/§4.0/§5.0/§6.0:

| register | set as printed | move counts | two-move? | four-move? |
|---|---|---|---|---|
| ladder (Part B NL-1, re-cut) | 4 orders | 3 · 2 · 4 · 3 | yes | yes ✓ |
| DM page (Part B §5.0, re-cut) | 5 orders | 2 · 4 · 2 · 3 · 3 | yes | yes ✓ |
| **Herald** (Part B §3.0, G-A…G-E) | 5 orders | 3 · 3 · 2 · 2 · 2 | yes | **no** |
| **chronicle** (MOVE-GRAMMAR §2.4, all units) | letter/treaty/demographic/assessment | max 2 | yes | **no** |
| **chrome** (Part B §6.0) | 4 orders | 2 · 2 · 2 · 2 | yes | **no** |
| **docent** (Part B §6.0) | 3 orders | 3 · 3 · 2 | yes | **no** |
| **dossier LEVEL 1** (V1–V8) | 8 members | 1 · 2 ×7 | yes | **no** |
| dossier LEVEL 2 (E1–E6) | 6 members | 4 · 4 · 3 · 3 · var · 3 | **no** | yes |

Chrome is the sharpest case: its four are `FACT → CONSEQUENCE · FACT → UNDO · CONDITION → FACT · FACT → CAVEAT` — all two moves, three of four opening on FACT. That is structurally the defect the chair used to withdraw the DM page's S3 ("four three-move orders of one abstract shape are ONE grammar"), and Part B prints a 0.60 ceiling over it while stating it obeys ruling (3).

The dossier is the subtlest: R-DA-17 (Part B:124) writes *"the set varies in move COUNT (E3 three, E1/E2 four; V1 one, V2–V8 two)"* — it satisfies the requirement only by treating the level-2 and level-1 sets as one set. They are not one set. **Level 2 is owner-gated under THE PROMISE and is explicitly UNSHOWN in the taste sample** (dossier §5; Part B §10 item 12), so the only set the wave and the sample actually exercise is level 1, which tops out at two moves. `grep -n "move COUNT|two-move|four-move"` finds exactly one hit in Part B (R-DA-17) and one in the dossier (Q3 item 4) — no register-by-register application exists.

Severity HIGH: ruling (3) is the owner's, and the register the taste sample is cut on is one of the failures.

### F3 — REFUTED. The run rule the dossier recommends to the owner contains a value its own Ground declares unsatisfiable, and it fails MOVE-GRAMMAR's own positive control.

Dossier §4.A item 1, *The run rule*, carries verbatim: adjacency inside one unit (two mounts of one tab, two adjacent tabs of one town, two adjacent quiet advances) **zero**, citing MOVE-GRAMMAR §4.3 B2, whose own recommended column reads "zero (a hard line, not a rate)".

The *Ground* three lines below, in the same item, states: a ceiling below 1/n is unsatisfiable without a refuse-the-repeat filter, **which is a rota by another name**. Zero is below 1/n for every n.

Executed: for a fair independent seeded draw at n = 6 over a town of 8 tabs, P(no adjacent same order) = (5/6)^7 = **0.2791**; across the 200 towns MOVE-GRAMMAR §4.4 negative control 5 requires the walker to pass, P = **1.4 × 10⁻¹¹¹**. Control 5 says in terms: an independent seeded draw over 200 towns must pass every arm, and a walker that reds a fair draw has a ceiling below 1/n. Arm B2 at zero therefore cannot coexist with control 5.

Part B §10 item 8 amends arm B1's slack and leaves B2 untouched. The only ways to satisfy B2 are a draw-time refusal — which chair 13:05 and C-9 make a seed input owner-gated under THE PROMISE, and which R-DA-20 was amended precisely to avoid — or a rota, which MOVE-GRAMMAR §2 refuses as fault 5 at a longer period.

Severity HIGH: it rides inside the owner's Q4 number and would either fire on chance or force the one mechanism the wave forswore.

### F4 — REFUTED. R-DA-01 is flagged `changesShippedSurface: TRUE` for a NEW reader-facing sentence whose licensing field does not exist at the product tip, and is not declared NOT-EXECUTABLE.

R-DA-01's **Grammar** line names its licensing field: `record.origin`. Its **Shipped** line reads TRUE — "the front-matter block is a new reader-facing element, owner-signed". The dossier §4.D lists it first among the 79: "a NEW front-matter origin block per dossier (a public string)".

Executed at 3b1c0eaa5: `grep -rn "record\.origin|recordOrigin|record_origin|compiledBy|keptBy|the office of record|provenanceOffice"` over `src/` returns **zero** hits for any record-origin field. `settlement.schema.js` carries `originSettlementId`, `originRegion` and `originContext` — all on other entities, none a record's origin. `grep -rn "origin"` over `src/data/dossierStateProse/*.js` finds only prose bodies and a stressor's `originContext`.

This is the §908 law's exact case, and Part B applies it twice elsewhere: R-DA-09 ("NOT-EXECUTABLE until a provenance field carrying two accounts exists") and R-DA-13 ("NOT-EXECUTABLE until a provenance field carrying a distance/reliability value exists"), both re-labelled "pending the field" with the field named owner-gated (critic C-7). R-DA-01 has the same defect and got neither label. Under ruling (5) as Part B §0.1 states it — a rule keyed on a field no receipt ships declares itself NOT-EXECUTABLE — R-DA-01's origin block is a sentence bought with a fact no field licenses.

*Correction owed:* R-DA-01's front-matter limb re-graded NOT-EXECUTABLE / "pending the field", the field listed as a schema act in dossier §4 item 30, and the 79-rule signature list reduced accordingly. R-DA-01's other limbs (no I/you/persona; the 22 parked rows) are unaffected and stand.

Severity HIGH: it is the first rule on the owner's signature list and it would write a new public string with nothing behind it — the Brackwater failure mode the wave exists to cure.

### F5 — PARTLY. Q15 reaches the owner with half a recommended value.

Chair 13:22/09:45 told the fold to bring a recommended value for **"Q15 the name-density rate and the town-name opener ceiling"**. Both halves were asked.

The dossier §4.A item 3 delivers the opener ceiling with its ground — **"≤ 0.167 (one in six) as the register ceiling, 0.150 the target"** — and I reproduced its basis: `estate-state.fingerprint.json` `openers.topOpeners` gives the settlement token at **610** against `sentences` **2914** = **0.2093** (CONFIRMED), and the fourteen primaries' `sameOpenerAsPreviousRate` band is **0.0334 (martin-chronicle) – 0.1667 (leguin-fiction)** (CONFIRMED), so 0.167 does sit at the band's top.

For the density half it says in terms: **no number is set**; the direction is settled and the rate is owed to the walker's first run; "the seat brings no value it cannot ground". The refusal is honest and reasoned and is a defensible act — but it is not a recommended value, and Q15 is one of the three the chair said would come with one.

Severity HIGH (an owner question), grade PARTLY because the ground for the refusal is stated.

---

## THE FINDINGS OF WEIGHT (MEDIUM)

### F6 — PARTLY. Q7's second half was answered by the chair as S12's to set and is put back to the owner.

Chair 09:45, Q7: "The shape (a sentence vs a paragraph for a person) is S12's to set per register." Part B R-DA-14's Grammar line hands it back: "the person's SHAPE ... is Q7's". The dossier makes it §4.C item 5, an owner question.

Mitigation, and why this is PARTLY and not REFUTED: both files DISCLOSE the divergence (dossier §7, §9; Part B is named as the source of the disagreement), and the dossier supplies **the seat's recommended per-register value** — dossier a sentence, ladder one spoken line, Herald the receipt's PERSON move, DM page the only paragraph surface. So the chair's instruction is substantively discharged; what is added is an owner veto the chair did not ask for.

### F7 — PARTLY. NL-8(a)'s ration, stated as a multiple of the median, reproduces the field mean the chair barred.

Chair A11/D4: every rationed-pet-word ceiling is set **against the MEDIAN 0.106 ... never the mean 0.185**. Both figures reproduced from `PROBE_ALL.md`: the ratio tables at :924/:935/:977 all divide by **0.106**, and :807 prints **0.185** in a column headed "field mean" (CONFIRMED).

Part B NL-8(a) sets the ladder's ration at **"≤ 1.75× the median 0.106 (≈ 0.185) — stated as a multiple of the median, never as the field mean (chair A11)"**. Executed: 1.75 × 0.106 = **0.1855**. The rule prints the barred number in its own parenthesis and declares in the same clause that it is not using it. The chair's ruling was applied in form and evaded in value.

Two further gaps in the same ruling's application: chair A11 requires "its in-house proof named" for each register's multiple. R-DA-06 and R-DA-10 name it (R3's 0.176). **NL-8 names none** for 1.75×, and CC-5's 0.57× defers its proof to the un-run bible recut.

### F8 — PARTLY. CC-1's shipped-surface flag rests on three citations, one of which lands on a comment at the product tip and was never re-taken as Part B required.

Part B §6.0 states that `operationRegistry.js` **DIFFERS** across the trees and that `:280`'s second person is **"re-taken at laneB6 before CC-1's flag is final"**. Dossier §9 records that no corpus figure was re-measured. I re-took it.

At 3b1c0eaa5, `src/store/operationRegistry.js:280` is a **code comment** ("...targetScope 'global' because the mode belongs to the player..."). The reader-facing second-person docent string is at **:284** — `setAdvanceAutoResolve`'s description, ending "those decisions wait for you". (`:558` also carries "while-you-were-away", a dev `reason` string.)

The other two ARE right at the product tip: `bandLadders.js:220` ("Not a dial you set...") and `:224` ("These are the states you will see" — second person plus the future indicative CC-8 bans). So the FLAG is correct — three reader-facing docent strings do exist — but the third citation is wrong and Part B's own precondition for finalising the flag was never discharged.

### F9 — PARTLY. The dossier prints line numbers for the live corpus defect that are off by one at the product tip.

Part B R-DA-19 cures this correctly, stating the defect is **"cited by pool key and angle, never a line number"**. The dossier §4 item 26(a) nonetheless prints "(the header is `RECEIPT_POOLS_DOSSIER_STATE.md:2243`, the row `:2246`)".

Executed at 3b1c0eaa5: the header `**economicBase: extraction**` is at **:2244**; the `[counterforce]` row ("turtles the chokepoints when it fights") is at **:2247**. The DEFECT ITSELF IS REAL — a war-doctrine row under an economic-base key — and the anti-vacuity guard's fixture stands. Only the two line numbers drift.

### F10 — PARTLY. R-DA-03's restated justification is false against one exemplar column it does not exclude.

R-DA-03's refuter cure restates the ≤ 0.010 ceiling's ground as: **0.010 sits at or below every record-register exemplar except martin-chronicle's 0.0000**. Executed over the fourteen `primary/*.fingerprint.json` columns, `shapes.whichTailRate`: **dnd-flavor 0.0066** is also below 0.010 (as are martin 0.0011 and martin-narrative 0.0024). If dnd-flavor is a record register — and Part B treats it as one throughout (H-7, NL-7, CC-13 all anchor on it) — the "except" clause names one column short. The direction survives; the justification as written does not.

---

## WHAT I COULD NOT KNOCK DOWN (CONFIRMED)

### C1 — Ruling (1) is obeyed. No weight, no author average, anywhere.
`FIVE_AUTHOR_CHECK.md:107` (C1) reads: the five weights, **"0 sources in every section (CONFIRMED by grep...)"**. No weight, percentage split or cross-author average appears in Part B §1–§13 or in the dossier. Every rule's Sources line is a union of distinct voices against the register's own measured failure, exactly as ruling (1) requires. The dossier §4.B refuses the weights in one line and §1's allocation table names authors per register with no arithmetic between them.

### C2 — The MOOT six are listed as settled, not re-asked; Q26–Q29 are listed answered, not re-opened.
Dossier §4.E carries Q1, Q2, Q6, Q7-first-half, Q21, Q22 one line each with the ruling that settles them and where. §4.F carries Q26–Q29 one line each, "NOT re-opened". Item 17 and item 27 apply Q29 and Q22 rather than re-asking them. The only exception to this clean record is Q7's second half — F6 above.

### C3 — The rule count is exact, and every rule flagged shipped is listed for signature.
`grep -cE "^### <prefix>"` over Part B: dossier **25**, ladder **13**, Herald **12**, chronicle **12**, DM page **13** (D6 absent), chrome **15** + B-DASH **1** = **91**. Matches Part B §12 and dossier §2.
The 79 reconciles arithmetically: 91 − 10 shipped-false (R-DA-00/18/20/21/24, H-1, H-10, CL-3, CL-12, D12) − R-DA-09 (pending the field) − R-DA-16 (false floor, limbs pending) = **79**, and I counted 79 distinct rule ids across dossier §4.D's display-side and engine-side lists. No rule flagged TRUE/YES in Part B is missing from §4.D.

### C4 — The A16 engine-side line is drawn correctly on every rule that crosses it.
Every rule touching R3 (H-2, H-3, the R3 halves of H-6/H-7/H-9, H-8's war-pool defect, D2's D-b), R7/R8 (R-DA-14, R-DA-15, R-DA-19's R8 half, R-DA-22) and R14 (R-DA-16, D9's R14 half, R-DA-00) is flagged owner-gated at the FIXTURE and listed under §4.D's engine-side heading, with park-red and goldens-regen-once stated. THE R3 GATE (Part B §3.0) is stated once and inherited.

### C5 — R-DA-20's `false` gate flag is right, and CL-9's withdrawn selector limb is right.
Chair C-9 and 13:05 require a seed-input mover to be flagged true-and-gated or restated as a freeze-time gate. R-DA-20 is restated in place: the walker runs at the reconstruction lane's gate and in `--check`, **never at the draw** — the draw is `hash % eligible.length` and a draw-time refusal is "NOT proposed". Its `false` is correct because it writes no bytes and moves no seed input; the rewrites it forces are signed under the rules that make them. CL-9's "retire for one span" limb was withdrawn on the same ground (it would change the selector and re-render every past quiet advance). Both are the chair's ruling correctly applied.

### C6 — The exemplar bands the size-withdrawals turn on all reproduce from the fourteen fingerprints.
Executed over `primary/*.fingerprint.json`:

| band Part B asserts | measured | verdict |
|---|---|---|
| abstract closer 0.012–0.115 (A12) | 0.0122 (martin-narrative) – 0.1151 (dnd-rules-srd52) | ✓ |
| documentation abstract closer 0.077–0.115 (CC-13) | dnd-flavor 0.0770 – dnd-rules-srd52 0.1151 | ✓ |
| **dnd-flavor abstract 0.077, pronoun 0.021** (the A5 correction) | **0.0770 / 0.0213** | ✓ |
| whichTail 0.0000–0.0370 (H-2, R-DA-03) | martin-chronicle 0.0000 – leguin-nonfiction-spoken 0.0370 | ✓ |
| antithesis 0.0082–0.0401 | dnd-rules-srd52 0.0082 – tolkien-elevated 0.0401 | ✓ |
| "There/It is" 0.0016–0.0556 | dnd-flavor 0.0016 – leguin-fiction 0.0556 | ✓ |
| same-opener 0.033–0.167 | 0.0334 – 0.1667 | ✓ |
| shareUnder8 0.029–0.333; dnd-flavor 0.0787 (chair E1) | 0.0292 – 0.3333; 0.0787 | ✓ |
| pronoun closer 0.021–0.108 (H-3) | 0.0213 – 0.1083 | ✓ |
| neighbourVariation floors 0.495 / 0.501 / 0.508 (hunter D7) | dnd-flavor 0.4950, dnd-rules-srd52 0.5010, martin-chronicle 0.5080 | ✓ |
| tolkien-elevated semicolon 0.122 (R-DA-06, NL-3) | 0.1220 | ✓ |
| martin-chronicle pronoun closer 0.0543 (R-DA-04) | 0.0543 | ✓ |
| martin-chronicle shareOver30 0.3382 (R-DA-06) | 0.3382 | ✓ |
| estate: antithesis 0.1088, sameOpener 0.1321, pronoun closer 0.1335, abstract 0.0439, nbrVar 0.399, sd 7.2, runsOfThree 0.320 | all exact | ✓ |
| ration median 0.106 / field mean 0.185 (chair A11) | PROBE_ALL ratio tables divide by 0.106; :807 prints 0.185 as field mean | ✓ |

Every size the fold WITHDREW on an in-band ground (H-2's R3 gloss, H-3's pronoun, H-7's band, NL-7's rate, CC-13's closer) is genuinely in band. The chair's E3, E1, A12 and A5 rulings were applied on real numbers.

### C7 — The receipt set and the live breaches are real at the product tip.
Verified at 3b1c0eaa5: `chronicleReadModel.test.js:99` pins index 0 to the canonical quiet sentence; `:102` pins the span noun in every pool line; `demographicReading.test.js:86` contains 'room to grow'; `:98` contains 'Some will leave'; `peaceTermsWave3.test.js:411` asserts the treaty floor; `generate-dossier-state-prose.mjs:89` opens `LIVE_STRING_BINDINGS`; `.clamp-primitive-baseline.json:9` is `settlementRumors.js`; `historyData.js:1326` carries "the PCs"; `npcComponents.jsx:254` carries "Player-safe here" and `:411` is the ladder-phrase render site behind `npc.corrupt` (chair A1's ground for R6's audience — CONFIRMED as the dossier states it); `warReceiptPools.js` carries 23 first-person matches. Both LIVE BREACHES are real: `newsVoice.js:97` asserts a totality over an open column, and `RECEIPT_POOLS_DOSSIER_STATE.md:5233` asserts an exemption on a column CLERK-LAWS §1.2 measures null everywhere. `grep -rni exempt` finds no writer and no `bailiff` exists — the Brackwater kicker is refused by construction, as R-DA-15 and chair A4 claim.

### C8 — The em-dash and question figures at the product tip are the fold's, not the ledger tree's.
`newsVoice.js` at 3b1c0eaa5 carries 33 em-dash lines, all inside comment blocks; **zero in strings**. H-12's "HELD at 0" and B-DASH's "that half of critic C-8 falls" are CONFIRMED at the product. The two crier interrogatives are real at `:442` (the succor cell) and `:496` (the reframe cell) — both genuine question-marked sentences — and are correctly routed to the owner as a modality spend under B-CLAIM.

### C9 — The R5 NOT-EXECUTABLE ruling is arithmetically right, and the eleven-column table reconciles.
At n = 2, one of two orders must hold at least 0.50 by pigeonhole, so a 0.35 share ceiling is unsatisfiable: R5's "carries no share ceiling and says so" is correct, and the withdrawal of the spec's n = 4 for R5 is correct. CLERK-LAWS §1.2 carries twelve table rows, of which `closed` is the per-column attribute chair A4 names separately — eleven data columns. "Eleven columns, `closed` per column, persons never closed" reconciles.

### C10 — Ruling (7)'s standing laws hold across all 91 rules.
I found no rule that puts a digit in prose (CL-8's and CC-7's numerals are declared LINE-HEAD/label classes, both stated vetoable), no rule that names a character's fate (R-DA-14 is office-only and cites product scope; NL-13's tier marker is a marker), no theological claim (deity doctrine is cited in R-DA-11/13/15, NL-4/11, H-4/6, D5/10/14), no archivist voice crossing to chrome (CC-1's wall, both directions), and no corpus text change — porcelain 0 at laneB6 before and after this pass, and both documents assert the same.

---

## WHAT I DID NOT TEST, AND WHY

- **The seven `check-pair.mjs` line citations** (:64, :66, :74, :78, :85, :87, :109–121, :118, :123–126, :129, :130, :136) were not re-read line by line; they bear on chair G's OWED/instrumented labels, which the sixth-lens refuters already pressed, not on this lens.
- **The R6 per-stage figures** are marked "re-take at laneB6" by Part B §2.0 itself and remain un-re-taken by anyone; that re-take belongs to a corpus lens, not this one.
- **Every rule's Sources count** (the union arithmetic behind 91 strength grades) was not recounted; ruling (2) was tested only at the level of "no weight and no average enters", which it passes.
- **The nine `best-*.md` and the `kept-*.json` graded rows** were not opened; my ruling-(1) verdict rests on `FIVE_AUTHOR_CHECK.md` C1's executed grep, which the fold itself cites.

---

## THE SHORT LIST FOR THE CHAIR

Four corrections I would put to the sitting before the three numbers go to the owner:

1. **Re-derive the Q4 ceiling under the chair's own bar.** The formula must satisfy ratio < 1.6 at the n each register actually carries. `1/n + 0.10` fails at n ≥ 6; chrome's 0.60 and the treaty's 0.35 fail outright.
2. **Re-cut the Herald, chronicle, chrome and docent sets by shape, and state the dossier's LEVEL-1 set on its own.** Four registers plus the level the wave touches carry no four-move order, and the sample is cut on one of them.
3. **Give arm B2 a satisfiable value or withdraw it from the owner's number.** Zero adjacency reds a fair draw with probability 1 − 1.4 × 10⁻¹¹¹ across the walker's own 200-town control.
4. **Re-grade R-DA-01's front-matter limb NOT-EXECUTABLE** and take it off the 79 until a record-origin field exists — the same treatment R-DA-09 and R-DA-13 already carry.

Nothing above is validated. Every verdict is the skeptic's and is the chair's to accept or refuse.

Seat: Opus 5 — Fable-unvalidated. Porcelain at `$SC/laneB6`: 0 before, 0 after. Product tip 3b1c0eaa5.
