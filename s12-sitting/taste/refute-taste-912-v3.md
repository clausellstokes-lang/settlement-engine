Seat: Opus 5 — Fable-unvalidated (the verifier, THIRD AND TARGETED CUT). Findings, never a pass; the chair rules on every row.

# REFUTATION OF THE THIRD CUT (`TASTE-SAMPLE-912-v3.md`) — the two changed sentences and the corrected claims

**Corpus.** The product tip in the dock `laneB6` at **3b1c0eaa51f77561a036ae7ec54682c39856192c** (`3b1c0eaa5`). The main working tree was never read for a corpus fact (tree law: its `src` is the frozen ledger branch). Clock by `date`: 2026-09-07 18:15:24 → 18:27:28 EDT.
**Porcelain on the dock: 0 BEFORE, 0 AFTER** (`git -C <laneB6> status --porcelain | wc -l`, executed twice, both `0`). Nothing was written outside `MY/`; scratch under `MY/refuter3-scratch/`. No tree was edited, committed, checked out, stashed or reset; no vitest, no npm.
**Scope.** Targeted, as instructed: v3-1 and v3-3 (the two sentences that moved), the corrected §1 claims, §2's figures, the §7 rulings the sample stands on, and C-sibling after the cut. v3-2 (a byte-identical KEEP) is re-verified mechanically only. Claims twice confirmed by the earlier refutations (the two-seed draw, the 48-of-48 founding, the eighteen (d)-rows) were not re-litigated except where §1's new wording changed them.
**Method.** Every figure comes from a command executed in this session whose output I saw. The corpus was loaded the way `check-pair.mjs:16-25` loads it (`MY/refuter3-scratch/measure.mjs`); the pair mechanics were recomputed independently (`MY/refuter3-scratch/uarms.mjs`); `check-pair.mjs` was re-run against the dock with cwd under `MY/refuter3-scratch/` on the shipped pairs file and on my cures; `gen-probe2.mjs` was re-run READ-ONLY from a copy for seed A to render the changed sentence on real fills; the composers were read at the dock by symbol and then by line.

**Headline.** The two text cures are good, and they are better than what they replace: v3-1 keeps the BEFORE's verb, loses the `name what` garden path, and reads cleanly on the first pass at real fills; v3-3 restores the address relation verbatim and takes the R-DA-03 sentence break for one word less than the BEFORE. Every §2 figure reproduces and the §4 receipt is character-identical to a re-run. **What does not survive contact with the laws is the DECLARATION layer around the two sentences** — three of the four tags and rulings the sample now rests on misdescribe the rules they cite: V5's rule field reads a positional limb into a member that has none and describes an appositive as the second move; the QUALIFY ruling inverts R-DA-03's own licensing clause (a second field, not the same field) and claims an amendment the file does not carry; and §7.4's ground for the V5 licence names a projection neither slot is drawn from. The corrected §1 finding is right in its conclusion and wrong in one measured limb. **No finding rises above MEDIUM, and none of them is in the prose.**

---

## 1. v3-1 — DS-POW-5 [ledger] index 0 — tagged **V5 INSTITUTION → PRESENT (tense: present throughout)**

BEFORE (located by exact string; `check-pair.mjs` locates it, and my own loader reads it at `power.generated.js` `DS-POW-5`, pool `governing body name: a SLOT, never a baked noun`, index 0, angle `ledger`, declared slots `["settlement","seat"]`, no marks):
*What governs {settlement} calls itself the {seat}, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake.*
AFTER: *The {seat} is what {settlement}'s government calls itself, a name precise about the town's size and pretensions in a way outsiders routinely mistake.*
It is the second refuter's cure 1, adopted string-for-string (compared programmatically).

**Measured** (my own re-implementation of check-pair's normalisations): words **24 → 23** · sentences **1 → 1** · opener `what governs` → `the {}` · slots `{settlement, seat}` → `{settlement, seat}` · close `mistake` → `mistake` · ration all nine patterns **0 → 0** · contrast shape **0 → 0** · DURATION set `[] → []` · COUNT set `[] → []` · will/shall/would absent both sides · existential opener 0 → 0.

**Rendered on seed A's real fills** (`gen-probe2.mjs` re-run READ-ONLY: `SETTLEMENT Breitturm pop=2921`, `DS-POW-5 :: governing body name … [ledger]`, the governing name **Guild Council**):
BEFORE — *What governs Breitturm calls itself the Guild Council, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake.*
AFTER — *The Guild Council is what Breitturm's government calls itself, a name precise about the town's size and pretensions in a way outsiders routinely mistake.*

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| the same reflexive act by the same agent (*calls itself* kept) | **CONFIRMED** | — | The verb phrase is byte-identical to the BEFORE's. The second refutation's MEDIUM-HIGH finding (the v2 *gives itself* moved the act from use to conferral, the substitution the same file refused on [visitor]) is fully cured, and the claim list now carries the reason. |
| *{settlement}'s government* is the SAME REFERENT as *what governs {settlement}* | **CONFIRMED** | — | Cited from the composer and the writer, not asserted. `{seat}` on this block is `properFill(text(power.governingName))` (`powerStateProse.js:852`), filled into `line5`'s bag (`:896`). `governingName` is written as the governing faction's own name (`rulingStructure.js:787`: the `isGoverning` faction's `faction` field), and the estate carries a field literally named `government` written from the **same expression** one line later (`:792`) — `defenseStateProse.js:587` says in its own comment that `{seat}` is the governing body's generated name, `powerStructure.government`, and fills it so at `:658`. The governing entity is always a FACTION, never an individual, so the definite description cannot narrow the referent; and the pool is keyed only where `governingName` is non-null (`powerStateProse.js:966`, measured by the second refuter), so the presupposition never fails. |
| …and *government* is "the estate's own field name for it, never a new particular" | **PARTLY** | LOW | True as a KEY name and doubly true in value. But the field it names is one the estate's own resolvers are forbidden to read: `titularSuccession.js:52` ("never the free-text `powerStructure.government` string"), `treasury.js:701` (it never reads that field), `factionRename.js:245` — *"the government TYPE, which at generation equals the governing name"*. `line5` never reads it either. So the prose noun is BAKED and its warrant is ordinary co-reference with the {seat} fill, not a field the sentence is generated from. The justification is decorative; it is not false, and the cure does not need it. |
| *a name precise …* attaches unambiguously to the name | **CONFIRMED** | — | The overt host *a name* is restored, and it is the only available one: *Breitturm's government* cannot be in apposition with *a name*. The second refutation's controller ambiguity (v2 had no host at all) is cured. |
| the manner clause preserved with the same object | **CONFIRMED** | — | *in a way outsiders routinely mistake* is byte-identical and still modifies *precise*; what outsiders mistake is the MANNER, not the title. |
| the reader's first parse (any garden path?) | **CONFIRMED** | — | On the rendered fills there is no re-parse. *X is what Y calls itself* is the ordinary free-relative frame; the *name what* adjacency the second refutation caught is gone, and the appositive confirms the reading it arrives after rather than competing with it. This is the row the v2 sentence failed, and the cure delivers it. |
| nothing widens or narrows | **PARTLY** | LOW | One entailment is added. The BEFORE (*Y calls itself the {seat}*) says the body uses that self-name; the AFTER is an inverted specificational copula (*The {seat} is what Y calls itself*), which is exhaustive — it says {seat} is THE self-designation. Mitigations, both measured: `governingName` is a single-valued field, so the quantity is closed by construction; and the [visitor] sibling already entails uniqueness (any other title draws a correction). I record it because the claim list says the typed set is "identical before and after" and, strictly, it is not. |
| no manufactured particular; no band, modality or threat class moved | **CONFIRMED** | — | Measured: DURATION and COUNT sets empty both sides; no will/shall added, no would removed; ration 0 → 0 on all nine patterns; contrast 0 → 0. The one new noun (*government*) resolves to the field row above. |
| tense present throughout | **CONFIRMED** | — | *is*, *calls*, *mistake* — no past form in the AFTER (measured: the past-tense scan returns an empty set). |

### (b) U1–U12
U1 n/a (contrast 0 → 0, measured both directions). **U2 CONFIRMED** (1 sentence). **U3 CONFIRMED** (all nine rationed patterns 0 → 0, measured). U4 n/a (no antithesis either side). U5 neutral — the close is unchanged (`mistake`). **U6 CONFIRMED** (no cause fronted; state first). U7 n/a. U8 n/a. **U9 CONFIRMED** (no gloss cut or created; the second fact survives as an asserted appositive). U10 — measured in §4 below. **U11 CONFIRMED** (COUNT sets identical and empty). **U12 CONFIRMED** (no historical, spatial, capacity or actor clause added).

### (c) THE TAG AND ITS RULE FIELD — **REFUTED, MEDIUM**

Three corrections bind, and they are the worst finding on this pair. The prose is not at fault in any of them.

1. **V5 has no positional limb, and the rule field invents one.** §2.1's member is `V5 | INSTITUTION → PRESENT`, licensed by *"an institution row + the state key"*. It is an ORDER of moves. Nothing in §2.1 or §1.2 requires the institution move to be the sentence's subject or its opening token. The rule field's "V5: opens on the institution ({seat})" therefore states a requirement the rule does not carry — **and the BEFORE already satisfies the real one**: its subject *What governs {settlement}* denotes the institution and its second clause is the standing state, so the BEFORE is INSTITUTION → PRESENT in two finite clauses. On the tag it carries, the cut buys nothing.
2. **After the cut the opening nominal denotes the NAME, not the body.** *What … calls itself* is a free relative denoting a name; the appositive *a name* confirms it; so *The {seat}* in subject position is read metalinguistically as the name-string. The BEFORE opened on the BODY. If the sample wants the INSTITUTION move at the opening, the cut moves it in the wrong direction.
3. **"ends on the present state" is now an appositive, not a clause.** §1.1 defines a move as *"one typed assertion a sentence or a clause makes"*. The AFTER's PRESENT limb rides a noun phrase. §4.1 item 3 has the walker's classifier assign a move sequence *"by its clause structure"* and calls a disagreement with the tag an arm-A red (§4.3 arm A / §4.1 item 3). On the BEFORE the classifier reads two clauses and agrees with the tag; on the AFTER it reads one and does not. **The cut makes v3-1 a candidate arm-A red where the BEFORE was not** — a cost paid to an owed instrument, invisible today.

### (d) V5's LICENCE — **WITHHELD (carried), MEDIUM**, with one limb the §7.4 ruling does not reach
The second refutation withheld on whether a SLOT can stand in for an institution TABLE row; §7.4 rules that it can (graded in §3 below). Even granting the ruling, a second limb is untouched: §1.2 row 5's INSTITUTION move asserts *who holds an office, who counts, who is counted, who is exempt, what the institution does, by its procedure*. **Self-naming is not on that list.** So the question "is this variant's move an INSTITUTION move at all?" is separate from "is `{seat}` a lawful licence", and only the second has been ruled on. A chair question, not a defect of the cut.

**Worst finding on v3-1: the rule field misdescribes the sentence it defends in both halves, and the tag's evidence is weaker after the cut than before it. REFUTED, MEDIUM. The sentence itself passes every claim test I could put to it.**

---

## 2. v3-3 — DS-POW-5 [street] index 2 — tagged **V1 PRESENT + a QUALIFY second sentence (R-DA-03), the sequence PRESENT → QUALIFY**

BEFORE: *The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else, and both usages are precise.*
AFTER: *The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else. Both usages are precise.*
It is the second refuter's cure 2, adopted string-for-string.

**Measured:** words **23 → 22** · sentences **1 → 2** · opener `the town` → `the town` (unchanged) · slots `{settlement}` → `{settlement}` · close `precise` → `precise` · ration 0 → 0 · contrast 0 → 0 · DURATION/COUNT empty both sides. The only textual difference from the BEFORE is `, and both usages` → `. Both usages`.

| test | verdict | severity | evidence |
|---|---|---|---|
| the verb and its object are kept (the address relation asserted, not implied) | **CONFIRMED** | — | *calls the hall by its proper title* is byte-identical to the BEFORE. The second refutation's MEDIUM finding on v2's *uses the hall's proper title* (the hall demoted from object of the act to possessor of the title) is fully cured. |
| U2 — the two-sentence ceiling | **CONFIRMED** | — | 2 sentences, measured; `check-pair.mjs`'s `THREE+ SENTENCES` arm silent. |
| the sibling [visitor] is not contradicted | **CONFIRMED** | — | The agent stays *the town*, so the shorter form remains the town's own and is not what draws a stranger's correction. Every word but the joint is the BEFORE's, so the cut cannot have created a sibling tension. |
| no claim widens or narrows | **CONFIRMED** | — | A coordinate clause becomes an independent one. Both assert; slots, ration, bands and counts identical. |
| **the second sentence is "a QUALIFY move under R-DA-03"** | **REFUTED** | **MEDIUM** | R-DA-03 defines the move twice, and both times against the tag. Part B §1 R-DA-03, Grammar: a QUALIFY move is *"a second FACT by a second field"*; `reconcile-dossier-archivist.md:106`, Grammar: *"a second FACT licensed by a second typed field"*. §7.3 and the §2 tag both write **"a second fact of the same field"** — the licensing clause inverted. And the licence is not merely misquoted, it is absent: this variant's declared slots are `["settlement"]` (measured from the leaf) and the composed bag is `{settlement, seat}`, so **no field on this block holds the precision of the town's two usages**. §4.3 arm D reds exactly on a tag naming a member whose licensing fields the block does not hold. The sentence is inherited (the BEFORE carries the same words as a tail), so the cut does not create the unlicensed claim — **v3 creates the claim that it is licensed.** |
| the §7.3 ruling against MOVE-GRAMMAR §1.2 / §2.1 **as written** | **REFUTED (an amendment is required, not a reading)** | MEDIUM | §1.2's eleven-move vocabulary holds no QUALIFY. §2.1's closed level-1 set (V1–V8) holds no member carrying one. The ONLY occurrence of QUALIFY in `MOVE-GRAMMAR.md` is §1.4 wall 6 (measured: `grep -n QUALIFY` returns exactly one line, `:100`), which constrains its FORM (never a *which* tail, never a third sentence) and licenses nothing. The ruling is coherent and I do not dispute it as a ruling — but it is new law, and the sample presents it as if the file already bore it. |
| "the sitting's superseded-passages appendix carries it" | **REFUTED** | MEDIUM | Measured at the file: `MOVE-GRAMMAR.md` §9's superseded-passages table (stamped 2026-09-07 17:16, and the file's mtime is 17:16:34) contains **no QUALIFY row** — its sixteen rows are the ones the sitting stamped, and the ruling is not among them. The parenthetical states in the present tense a thing that has not been done. A one-line write to §9, or a change of tense, closes it. |
| the R-DA-03 counter this cut moves toward | **WITHHELD (re-raised)** | MEDIUM | R-DA-03's own figure is `R1 2nd-sentence summary 0.035 → 0.000`, and its statement bars *no summarising second sentence*. The cut converts a coordinate tail — which that counter does not see — into a standalone second sentence, which is exactly what it counts. Whether *Both usages are precise.* is a clerk's second fact or a summarising beat is the FIRST refutation's WITHHELD; §7.8 carries it to the owner's walk **as unsettled**, while §2's tag answers it **as settled**. One document, two answers, and the tag is the load-bearing half: if the walk rules it a summary, the AFTER breaches the rule that was cited to license it. |
| (a constraint for the chair's cure-making, not a verdict) | **NOTE** | — | R-DA-03's Grammar line also forbids the QUALIFY *as the closing move of more than one variant per pool*. With [2] carrying one, no other variant of this pool may close on a qualification — which rules out any two-sentence cure on [0] (see §6, cure 1b). |

**Worst finding on v3-3: the tag cites R-DA-03 for a licence R-DA-03 refuses (a second field, not the same field) and for which this block holds no field, and the ruling's claimed home in the appendix is not there. REFUTED, MEDIUM. The sentence is claim-preserving and is the best of the three cuts offered for it.**

---

## 3. THE CORRECTED §1 CLAIMS

| # | claim | verdict | severity | evidence |
|---|---|---|---|---|
| 1 | the three slot readings are **8 / 5 / 2** | **CONFIRMED** | — | Measured from the leaf and the composer: declared `slots` = `[settlement, seat, faction, counterpart, good, route, band, institution]` = **8**; union over the block's variants (text tokens and per-variant declared lists agree) = `{good, institution, route, seat, settlement}` = **5**; `line5`'s bag (`powerStateProse.js:896`) = `{settlement, seat}` = **2**. The block holds **40** variants in **12** pools; `{institution}`, `{route}` and `{good}` appear in **1** variant each, none of them in this pool (measured per-slot counts: settlement 32, seat 15, institution 1, route 1, good 1). |
| 2 | **DS-GEN-18's `craftSlots` fills `{institution}` with `{resource}` or `{good}`** | **PARTLY** | **MEDIUM** | The block, the bag and the citation are right (`generalStateProse.js:1841–1859`, exactly the object's first and last lines; one reader at `:1861`; declared slots `[settlement, institution, resource, good]`). The composition is not. `institution: craftInstitutionFill(craftRow?.processingInstitutions)` and `craftRow = stalledRow \|\| workedRow`, which is non-null **only on STALLED and HOME-FED**; `craftInstitutionFill` over an empty list returns `undefined` (`:1258–1267`). So per CALL the bag is: STALLED `{settlement, institution}` · HOME-FED `{settlement, institution, resource}` · BOUGHT-IN `{settlement, good}` · UNWORKED `{settlement, resource}`. **`{institution}` and `{good}` are never filled together.** The CONCLUSION survives untouched on HOME-FED alone — `{settlement} + {institution} + {resource}` licenses V1 + V5 + V4, three level-1 shapes on one (block, pool) — and the leaf agrees (`HOME-FED [0] ledger` declares `[settlement, resource, institution]`). Only the "or `{good}`" limb is false, and it is the limb that made the claim read as a property of the block rather than of one pool. |
| 3 | DS-ECO-11's exploitation lens fills `{resource}`, `{good}` and `{institution}` | **CONFIRMED** | — | `exploitSlots` at `:978–984` (the citation is exact) carries all three, and the lens merges it OVER the shared bag — `line(blockId, poolKey, extra)` at `:928–931` builds `{...slots, ...extra}` — so `{settlement}` survives beside them. Read at `:1047`. The leaf agrees: `EXPLOITATION: fullyExploited [0] ledger` declares `[resource, settlement, institution, good]` in one variant. Three shapes are licensed there today. |
| 4 | the composer's bag is per CALL; DS-ECO-11 has four readers | **CONFIRMED** | — | Four readers at `:1044`, `:1045`, `:1046`, `:1047` (lenses A–D), over TWO bags (the shared one at `:897`, the lens-D override at `:978`). The licence set is keyed on (block, pool), exactly as the sample now says — and my DS-GEN-18 measurement is a second instance of the same point. |
| 5 | "arm D as specified reads the LEAF's fields; the composed-fill arm is OWED" | **CONFIRMED** | — | §4.1 item 2 has the walker read *"the fields the leaf exposes"*; §4.3 arm D reds on a tag whose licensing fields the block does not hold. Neither reads a composer bag, and §5 (e) lists that arm as owed. The second refutation's (d)6 is correctly applied. |
| 6 | **§7.4: at this tip a composed slot naming the institution is a lawful V5 licence, "the institution table being a derived projection of exactly these fields"** | **PARTLY — the permission is defensible, the MECHANISM is refuted** | **MEDIUM** | Measured against CLERK-LAWS §1.2's column table, both slots the ruling names come from somewhere else. **`{seat}`** ← `powerStructure.governingName` ← the governing FACTION's name; `factions[]` and `institutions[]` are distinct arrays on the settlement (`settlement.schema.js:361` / `:363`), and CLERK-LAWS §1.2 lists `governingFactionOf` under the **`office`** column, whose type is *"a role noun"* — a faction's proper name is not one — while the `institution` column is fed by `settlement.institutions[]` through the live roster. **`{institution}`** (DS-GEN-18, DS-ECO-11) ← `chain.processingInstitutions[0]`, and that array is not the roster either: it is the chain's STATIC pattern list filtered to the patterns some live institution fuzzy-matches (`computeActiveChains.js:292–297`, written at `:381`), so the noun rendered is the matched PATTERN, not the roster row's own `name`. So "the slot is the row's name column" is contradicted for one slot and unmeasured for the other. The narrower ground survives and is enough for the ruling: both fills are roster-gated or faction-derived designations of a body the world actually holds. **This is the standing law's own shape — charter the permission, measure the mechanism.** |
| 7 | "twenty of sixty-eight blocks compose only `{settlement}`" | **NOT RE-MEASURED** | — | Attributed in the sample to SITTING §A12 and left there; measuring it means resolving 68 composed bags, which is outside a targeted pass. Recorded so the chair does not read its absence as a pass. |

---

## 4. §2's FIGURES AFTER THE CUT — **CONFIRMED, every one, measured**

Openers computed with `check-pair.mjs`'s own normalisation (slots → `{}`, first two words, lowercased, stripped).

| figure | sample | measured | verdict |
|---|---|---|---|
| openers, three distinct | three distinct before and after | BEFORE `what governs` / `a stranger` / `the town`; AFTER `the {}` / `a stranger` / `the town` — 3 distinct both sides | **CONFIRMED** |
| settlement-token openers | 0 → 0 | 0 → 0 | **CONFIRMED** (R-DA-17's per-pool limb untouched) |
| article-openers | **2 → 3** | 2 → 3 (definite-only: 1 → 2) | **CONFIRMED** — the second refutation's (d)15 correctly applied, and the sample states no rule caps them, which is right |
| close kinds | unchanged: `mistake` · `immediately` · `precise` | unchanged, measured word-for-word | **CONFIRMED** |
| sentence counts | 1/1/1 → 1/1/2 | 1/1/1 → 1/1/2 | **CONFIRMED**, and the receipt's A11 line reports it |
| word counts | 24→23 · 17→17 · 23→22 | 24→23 · 17→17 (byte-identical KEEP) · 23→22 | **CONFIRMED**, none longer |
| the §4 receipt reproduces | verbatim | Re-ran `check-pair.mjs` against the dock with cwd under `MY/refuter3-scratch/`; `diff` against `check-pair-pow5-v3.out` returns **nothing** — identical character-for-character, including `corpus loaded: 2734 variants in 1020 pools` | **CONFIRMED** |

**v3-2** (the KEEP): BEFORE and AFTER compared programmatically — identical; 17 → 17 words, 1 → 1 sentence, opener and close unchanged; the claim list now reads *any other*, the second refutation's LOW cure applied. **CONFIRMED.**

---

## 5. C-SIBLING AFTER THE CUT — **CONFIRMED, with one PARTLY**

1. **The three cohere in structural fact.** No band word, count noun, duration word, quantifier, geography, calendar or outcome moves in any of the three pairs (measured: DURATION and COUNT sets empty on all six texts; ration and contrast 0 → 0 throughout). They differ in standpoint, which is the lawful axis.
2. **[2] names the hall, and it is declared.** The divergence is the corpus's: at index 2 the declared `slots` list is `["settlement"]` and the text carries that token alone, so the body is named by its hall while [0] and [1] name it by `{seat}` — true of the BEFORE and the AFTER alike. The sample states it as a pre-existing finding for the wave rather than as a property of the cut. **CONFIRMED**, and the handling is the honest one.
3. **Nothing is sharpened.** [2]'s AFTER differs from its BEFORE by a sentence joint only; [1] is byte-identical; [0] keeps the same agent, verb and manner clause. The [visitor]/[street] tension is exactly where it was.
4. **One thing the C-sibling sentence does not yet carry — PARTLY, LOW.** [0]'s AFTER now entails exhaustivity (see §1(a)); [1] entails the same thing from the stranger's side; [2] says the town uses a shorter form for the HALL. No contradiction — different agent, different object — but the pool's three variants now stand in a tighter relation than the BEFORE's did, and the C-sibling paragraph reports coherence without reporting that.
5. **NOTE (not a breach).** The pool's key is *governing body name: a SLOT, never a baked noun*, and [0]'s AFTER introduces a baked common noun for the body (*government*) where the BEFORE had a bare relative. The key bars a baked NAME, not a common noun, so nothing is breached — but a reader of the key alone will notice it, and it is worth one clause in the rule field rather than a discovery at the owner's walk.

---

## SCORE

Counts are of tests **explicitly graded** above (n/a, NOTE and NOT-RE-MEASURED rows are not counted).

| section | CONFIRMED | REFUTED | PARTLY | WITHHELD | worst finding | severity |
|---|---|---|---|---|---|---|
| **v3-1 · C-pair + U** | 12 | 0 | 2 | 0 | the inverted copula adds an exhaustivity entailment the claim list calls identical | LOW |
| **v3-1 · the tag and its rule field** | 0 | 1 | 0 | 1 | V5 has no positional limb; the opener now denotes the NAME, and the "present state" is an appositive, so the classifier would disagree with the tag | **MEDIUM** |
| **v3-3** | 4 | 3 | 0 | 1 | the QUALIFY tag inverts R-DA-03's licensing clause and names a licence this block does not hold | **MEDIUM** |
| **§1 corrected claims** | 4 | 0 | 2 | 0 | `{institution}` and `{good}` are never filled together on DS-GEN-18; and §7.4's "row's name column" is contradicted for `{seat}` and unmeasured for `{institution}` | **MEDIUM** |
| **§2 figures + the receipt** | 8 | 0 | 0 | 0 | — | — |
| **C-sibling** | 3 | 0 | 1 | 0 | the tightened entailment across [0] and [1] is not reported | LOW |
| **TOTAL** | **31** | **4** | **5** | **2** | | |

**The single worst finding: the declaration layer, not the prose.** Three of the four things the third cut newly rests on describe the rules they cite inaccurately — V5's rule field (a positional limb §2.1 does not have, and an appositive called the second move), the QUALIFY ruling (R-DA-03 says a second field; the ruling says the same field, and no field on this block holds the claim at all), and §7.4's ground (neither slot is drawn from the institution roster the table's column is built from). Each is cheap to fix and none of them requires a byte of the two sentences to move. **The two sentences themselves are the best versions the three cuts have produced, and I could not break either one on claim preservation.**

---

## CURES (a cure never adds a claim)

**Both text cures below were EXECUTED through `check-pair.mjs` against the dock at 3b1c0eaa5, cwd under `MY/refuter3-scratch/` (`cures-v3.json`; receipt below), and both pass every mechanical arm.** Offered as "test this, don't trust it" — the chair rules. **My primary recommendation on v3-1 is the declaration cure (1), not a text cure**: the shipped sentence is good.

### Declaration cures (no text moves)

1. **v3-1 (MEDIUM) — describe the sentence the cut actually made.** Strike "V5: opens on the institution ({seat})" as the rule's requirement; §2.1's V5 is an ORDER, licensed by an institution row and the state key, with no positional limb — and the BEFORE already realised INSTITUTION → PRESENT in two finite clauses. Say instead what is true and is a real gain: the cure keeps the BEFORE's verb, restores an overt appositive host, and removes the re-parse; the opening nominal is the `{seat}` used as the body's NAME; the standing fact rides an appositive. **And declare the cost**, because it is the sample's own kind of honesty: §4.1's classifier reads move sequences by clause structure, so on the AFTER it will read one clause where the tag names two moves — an arm-A disagreement the BEFORE would not have produced. That is a finding for the walker lane, not a defect.
2. **v3-3 (MEDIUM) — quote R-DA-03's licensing clause as it is written.** The QUALIFY move is *a second FACT licensed by a second typed field* (Part B §1 R-DA-03 Grammar; `reconcile-dossier-archivist.md:106`), not "a second fact of the same field". Then state the consequence plainly: on DS-POW-5 no field holds the precision of the town's two usages (the variant's declared slots are `["settlement"]`; the bag is `{settlement, seat}`), so the second sentence is a **pre-existing, unlicensed second fact banked for the authoring wave**, not a licensed QUALIFY. The R-DA-03 gain the cut really delivers is the sentence BREAK and the A11 spread; it does not need the licence to be worth taking.
3. **v3-3 (MEDIUM) — do not claim an amendment the file does not carry.** `MOVE-GRAMMAR.md` §9's table has no QUALIFY row (measured: one QUALIFY hit in the whole file, §1.4 wall 6 at `:100`). Either write the row into §9 before the sample ships, or change the tense to "the sitting will carry it". A sample whose §4 stands on receipts cannot state an unwritten amendment in the present tense.
4. **v3-3 (MEDIUM) — settle §2 against §7.8, or declare the split.** §2 tags the second sentence a QUALIFY (settled); §7.8 carries the same sentence to the owner's walk as an open WITHHELD. Both cannot be true. The honest form: the tag reads it as a second fact, the classification is the walk's, and if the walk reads it as a summarising beat then R-DA-03's own `2nd-sentence summary 0.035 → 0.000` counter is what it lands in — a decision the owner is being asked to make, stated as one.
5. **§1 (MEDIUM) — correct the DS-GEN-18 mechanism, keep the finding.** Replace "fills `{institution}` with `{resource}` or `{good}`" with the measured composition: `craftSlots` fills `{institution}` on **STALLED** and **HOME-FED** only (it derives from `craftRow`, which is null on the other two keys), `{resource}` on HOME-FED and UNWORKED, `{good}` on BOUGHT-IN — so the three-shape licence lands on **HOME-FED**, where `{settlement} + {institution} + {resource}` gives V1 + V5 + V4, and the leaf's own `HOME-FED [0] ledger` variant declares exactly those three. The correction makes the sample's own per-(block, pool) point twice: the licence set is keyed on the POOL, and DS-GEN-18 is the second block that proves it.
6. **§7.4 (MEDIUM) — charter the permission on the ground that holds.** Keep the ruling; drop "the institution table being a derived projection of exactly these fields" and "the slot is the row's name column". Measured: `{seat}` is the governing FACTION's name (`rulingStructure.js:787`; `factions[]` and `institutions[]` are distinct, `settlement.schema.js:361`/`:363`), and CLERK-LAWS §1.2 puts `governingFactionOf` under the `office` column typed "a role noun"; `{institution}` is the chain's static processing PATTERN retained by a fuzzy roster match (`computeActiveChains.js:292–297`, `:381`), not the roster row's `name`. The defensible ground: **both fills are roster-gated or faction-derived designations of a body the world holds, and the table when it exists will project them — which column each maps to is an OWED measurement for the table's car.**
7. **§1 (LOW) — say that the A12 twenty is inherited.** "twenty of sixty-eight blocks compose only `{settlement}`" is the sitting's figure, not re-measured here; attribute it in the line, per the citation law.
8. **v3-1 (LOW) — two clauses in the rule field.** (a) *government* is a baked common noun whose warrant is co-reference with the `{seat}` fill — not a field the sentence is generated from, since `line5` never reads `powerStructure.government` and three shipped comments forbid resolvers to read it. (b) The inverted copula is exhaustive where the BEFORE was not; the exhaustivity is licensed by `governingName` being single-valued and is already entailed by the [visitor] sibling. Both are one clause each and they close the only two claim-side residues on the pair.

### Text cures (offered, not recommended over cure 1)

9. **v3-1 — if the chair wants the INSTITUTION move at the opening AND both facts in finite clauses (23 → 23 words vs the BEFORE's 24, PASS).**
   *"{settlement}'s government calls itself the {seat}, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake."*
   It keeps the BEFORE's verb AND its two-clause shape, so the tag's PRESENT limb is a clause again and the classifier agrees with it; the opening nominal denotes the BODY, so INSTITUTION → PRESENT is evidenced at the opening in the sense the rule field wants; there is no free relative, so no exhaustivity is added and no host is needed; it is one word shorter than the BEFORE, the same saving the adopted cure makes. Measured opener `{}'s government` — **article-openers stay 2 → 2**, which the adopted cure moves to 3. **The trade, stated:** it opens on the `{settlement}` token, so the pool's settlement-token openers go **0 → 1**. R-DA-17's per-pool limb allows at most one per pool, so nothing is breached — but the sample reports 0 → 0 as a virtue, and this cure spends it. The chair chooses which figure it would rather report.
10. **v3-1 — the two-sentence form (24 → 24 words, PASS) is available and I advise against it.**
   *"The {seat} is what {settlement}'s government calls itself. The name is precise about the town's size and pretensions in a way outsiders routinely mistake."*
   It restores the finite second clause and keeps the V5 opener at no length cost (the pool's spread becomes 2/1/2). But R-DA-03's Grammar line forbids the QUALIFY *as the closing move of more than one variant per pool*, and [2] already carries one — so this cure is lawful only if v3-3's second sentence is re-classified as something other than a QUALIFY, which is cure 2's open question. Offered for completeness, refused on its own ground.

### Instrument gaps this cut exposes (for the walker lane, beyond the seven §5 already lists)
(h) **an APPOSITIVE / non-clausal-move arm** — the classifier reads clause structure (§4.1 item 3), so a move packed into a supplementive NP is invisible to it and will read as an arm-A disagreement with a correct tag; the arm must decide, once, whether a nominal appositive realises a move. (i) **an EXHAUSTIVITY arm for specificational copulas** (`X is what Y calls itself`, `X is the one that …`) against `closed(column)` — CLERK-LAWS §2.2 C4 already types the quantifier limb; the cleft is the same claim wearing syntax. (j) **a QUALIFY-licence arm** — R-DA-03's "second typed field" is checkable the moment the composed-fill resolver of §5 (e) exists, and it is the arm that would have caught this tag.

### The cures' receipt (executed)

```
$ node check-pair.mjs <laneB6> cures-v3.json
#cure-v3-1a PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#cure-v3-1b PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 2/1/1

corpus loaded: 2734 variants in 1020 pools; 2 pass mechanically, 0 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 0 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```
Word counts, measured: cure-v3-1a **24 → 23** (opener `{}'s government`, 1 sentence) · cure-v3-1b **24 → 24** (opener `the {}`, 2 sentences). Neither is longer. **A mechanical pass is not a claim-preservation verdict here either** — these are the refuter's proposals and the chair rules on their claims exactly as it rules on the sample's.

---

*Read-only throughout. No tree was edited, committed, checked out, stashed or reset; no vitest and no npm was run; nothing was written inside the dock, the main tree or `K`. `check-pair.mjs` was executed with an absolute path and `gen-probe2.mjs` from a copy, both with cwd under `MY/refuter3-scratch/`; the only files written are this one and the scripts, probe output and receipts beneath `MY/refuter3-scratch/`.*
*Dock porcelain: **0 before, 0 after**. Product **3b1c0eaa5** unchanged.*
