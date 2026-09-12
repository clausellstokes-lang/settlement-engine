# FIDELITY CHECK — items-W11-W19.md (the writer bars of brief ADDENDUM 13 part A, section B, re-cut under ADDENDUM 14)

**Archive under test:** `rewrite/retro/items-W11-W19.md` (claims 61 rows against 61 source items).
**Source of truth:** `rewrite/retro/evidence/convert-W11-W19.md` (the fold's conversion packet for this slice).
**Second source, used for the `the old law, VERBATIM` column only:** `rewrite/tables-13A.txt` — the ratified ADDENDUM 13 part A text, which the archive itself names as where that column came from. The conversion packet carries only a *gist* column, so the verbatim column cannot be checked against the packet and was checked against the law text instead.

**Adversary's brief:** prove the archive is NOT faithful. Hunt a dropped item, a softened quotation, a silently flipped verdict, an overstated or understated permission, and a high-risk strike the closing section should have named.

**Method and coverage.** Mechanical, not sampled: every one of the 61 rows was parsed out of both files and compared cell by cell (id, verdict, ground, permission), and every `the old law, VERBATIM` cell was matched by hand against `tables-13A.txt`. **61 of 61 items checked, including all 28 SPLITs.** The mechanical result:

| check | result |
|---|---|
| ids in source with no row in archive | **0** |
| ids in archive not in source | **0** |
| verdicts differing between source and archive | **0 of 61** |
| SPLIT rows that lost a half (`kept:` or `struck:` missing) | **0 of 28** |
| `what a writer may now do` cells differing in substance | **0 of 61** (3 differ, all glosses appended to a bare `—`) |
| `the old law, VERBATIM` cells that misquote `tables-13A.txt` | **0 of 61** |
| `ground` cells differing from the source | 40 of 61 — 36 are wording expansions consistent with the source; **4 add a claim the source does not make**; 1 adds a claim that is doubtful on its own terms |

**The headline is that the extraction is clean where the record's teeth live.** No item vanished, no verdict moved, no SPLIT lost its surviving half, no permission cell was widened or narrowed, and no quotation was softened. The defects are all in two places the hunt was told to watch: the **ground** column, where the archive four times supplies an argument the fold did not make and each time the addition makes a strike look more obviously right; and the **framing and closing prose**, where one whole section of the source packet is dropped and one factual claim about which bars the re-cut kills is wrong in the archive's favour.

---

## FINDING 1 — [MATERIAL] The source packet's entire `NEW FINDINGS` section is absent from the archive

The conversion packet does not only convert the old bars; it closes with **eight contradictions "no bar ever stated"** — the positive teeth the re-cut *adds*. The archive carries no trace of that section. It is not mentioned in the header, not rowed, and not pointed at.

> **SOURCE** (`convert-W11-W19.md`, lines 121–131), section heading verbatim:
> "## NEW FINDINGS — real contradictions no bar ever stated
> 1. **The militia and the watch are MUTUALLY EXCLUSIVE.** `Citizen militia` carries `exclusiveGroup: 'civilianDefense'` and the description "Part-time service. **Present only when no professional watch exists.**" (`institutionalCatalog.js:1340-1347`); `Town watch` shares the group (`:1348-1354`). A face naming both as two standing bodies contradicts the roster. **No bar encoded this.**
> 2. **A town's watch is PART-TIME by its own row.** … Calling a town watch professional, full-time or soldiers contradicts the row.
> 3. **Every city HAS a garrison.** `Garrison` is `required: true` — "Professional soldiers. Noble or royal." (`institutionalCatalog.js:1925-1930`). A city face saying the town has no soldiers of its own contradicts the roster. W12 only ever policed the word in the other direction."

> **ARCHIVE** (`items-W11-W19.md`): nothing. Grep over the whole file: `exclusiveGroup` 0 · `civilianDefense` 0 · `Part-time` 0 · `1340` 0 · `1348` 0 · `1925` 0 · `mutually exclusive` 0. The string `Noble or royal` occurs exactly once — inside the closing section's **argument against W12b**, where it is used as evidence for a challenge, not recorded as a finding.

**Mitigation, stated because it is true and materially reduces the severity.** The three findings were not lost from the programme: they landed in `evidence/CONTRADICTION-TABLE.md` as rows **F1-26, F1-27, F1-28**, each carrying the provenance tag `W11-19 NF-1 / NF-2 / NF-3`. NF-4 and NF-8 also landed (`W-08`; `F1-33` carries NF-5/W11b). So the teeth exist. What does not exist is any route from *this slice's retrospective record* to them.

**Why it is still a defect.** `RETRO-VALIDATION.md` §4 sets the protocol: a reviewer reads the fidelity packet, then samples this slice's items, then marks a `VALIDATION` cell. A reviewer following that protocol on W11–W19 will never learn that the slice produced three new contradictions, will not be able to challenge them (they have no row and no `VALIDATION` cell here), and — worst — will validate **W12b** and **W12c** without seeing NF-1 and NF-3, which are the two rows that bear directly on whether "the garrison" may be said off a barracks or a watch. The archive's own closing argument #2 leans on NF-3 to attack W12b, which proves the author had the section in hand and chose not to row it.

**Cure:** either row the eight findings in this file with `VALIDATION` cells of their own, or add one line to the header saying they were carried to `CONTRADICTION-TABLE.md` as F1-26…F1-33 / W-08. One sentence closes it.

---

## FINDING 2 — [MATERIAL] W17a: the ground overstates the new permission, and collides with the row's own kept half

This is the clearest case of the hunt's category (4): a cell that grants more than the re-cut granted.

> **SOURCE** (`convert-W11-W19.md`, W17a, ground, struck half — verbatim):
> "**struck:** the rest — `under_siege.crisisHook` is "The settlement is **surrounded**." (`stressTypes.js:16-17`), which positively puts a force outside."

> **ARCHIVE** (`items-W11-W19.md`, W17a, ground, struck half — verbatim):
> "**struck:** the rest — `under_siege.crisisHook` is "The settlement is **surrounded**." (`stressTypes.js:16-17`), which positively puts a force outside, **so an army at the walls is the record's own claim.**"

The old law's exact words were "a siege entails a besieger, **never walls, gates, a watch or an army at the walls**". The fold struck the ban and grounded the strike on the narrowest thing the hook supports: *a force outside*. The archive upgrades that to **an army at the walls**, and upgrades it from a permission to *the record's own claim* — i.e. from "nothing denies it" to "the page asserts it". Three separate overreaches in one clause:

1. `surrounded` supports a force; it does not support an **army** (a scale/magnitude word that floor 2 polices elsewhere in this same slice — see W16c, W17g "not a battle with a body count").
2. "**at the walls**" is the exact phrase the same row's **kept** half forbids on an unwalled town (`inst.hasWalls` false contradicts the roster). The archive's ground therefore reads, within one cell: *an army at the walls is the record's own claim* / *on an unwalled town, no walls*.
3. "the record's own claim" invites the inverse refutation — that a face *omitting* the army contradicts the hook — which nothing in the re-cut supports.

The permission cell is untouched and correct ("Write the ring of fires outside… On an unwalled town, no walls"), so a writer reading only the last column is safe. A **refuter or a judge reading the ground column is not**, and the ground column is what a refuter is handed.

---

## FINDING 3 — [MATERIAL] The framing prose names W14 as one of the bars the re-cut kills. The source names only W15 and W16, and the archive's own rows refute it.

> **SOURCE** (`convert-W11-W19.md`, line 9, headline — verbatim):
> "The bars that die are the vocabulary lists — **the always-safe word tables of W15 and W16** were a house style, not a truth test, and they are what made the corpus read at 168 distinct words against the shipped 519."

> **ARCHIVE** (`items-W11-W19.md`, line 12 — verbatim):
> "**Three of those — W14, W15, W16 — did the fencing by *prescribing vocabulary*: a table of always-safe spellings a writer could reach for without having to resolve the roster. That is the part the re-cut kills.**"

W14 is **THE LABEL BAR**. Its text (`tables-13A.txt`) is "an engine label is rendered at its ENGINE meaning as section 3 states it, never at its dictionary sense", followed by ten labels and their producers. **It contains no spelling table and prescribes no vocabulary.** The always-safe spelling lists are W15's section-4 list and W16a's "upkeep"/"the keeping" — exactly the two the source named.

The archive's own rows contradict its framing. W14's eleven items resolve **3 CONTRADICTION · 1 MODEL · 6 SPLIT · 1 STRUCK**. W14 is the *most* surviving bar in the slice, not one of the three that "the re-cut kills". A Fable reviewer who reads the framing paragraph and then samples proportionally will sample W14 as a dead bar and find nine live ones.

This is a softening in the archive's favour of exactly the shape the hunt was told to look for: it makes the aggregate strike look broader and more obviously right than the item-level record supports.

---

## FINDING 4 — [MODERATE] Three ground cells add an argument the fold did not make, each time in the strike's favour

Every one of these is an addition, not a softening of a quote — the quotes are clean. But they are the archive's own reasoning presented in the column a reviewer reads as *the fold's ground*, and all three cut one way.

**(a) W11b — the archive convicts the old bar of a falsehood the source did not charge.**

> **SOURCE:** "**struck:** the blanket "never"."
> **ARCHIVE:** "**struck:** the blanket "never" — **the bar's own reason ("feeds EVERY wall row") is false on a town where no fortification chain is instantiated.**"

The bar's reason (`tables-13A.txt`, verbatim) was "because the fortification chain feeds **every wall row** quarried stone (supplyChainData.js:873-884)" — a claim about the chain data covering every wall **row type**, which is true and which the archive's own kept half restates approvingly. The archive rebuts it by sliding to a different subject: whether the chain is **instantiated on this town**. That is a scope limitation on the bar, not a falsity in it. Calling the old law's reason "false" makes the strike look better founded than the fold's own bare "struck: the blanket 'never'".

**(b) W12d — an added inference in the exact spot the archive's own closing section calls the weakest strike.**

> **SOURCE:** "`occupied.viabilityNote` = "Local institutions continue under oversight" (`stressTypes.js:38-39`) positively keeps the town's own bodies on the page."
> **ARCHIVE:** "…positively keeps the town's own bodies on the page, **so both readings are on the record.**"

The note puts the town's own bodies on the record. It says nothing about the occupier's men being on it, and the fold did not claim it did. "Both readings are on the record" is the load-bearing premise for striking a rule that the archive's **own closing argument #5** then says should have survived. The archive argues against itself using ground it invented.

**(c) W14-gateduty — an added legal conclusion, broader than the source's.**

> **SOURCE:** "`institutionServices.js:1324` sets … The RECORD contradicts itself; **a writer agreeing with one of two contradictory surfaces cannot be failed.** Filed to CAR 8b-W-2."
> **ARCHIVE:** "**The RECORD contradicts itself, so no surface denies the face:** `institutionServices.js:1324` sets … A writer agreeing with one of two contradictory surfaces cannot be failed. Filed to CAR 8b-W-2."

The source's rule is one of **lenity toward the writer** (you cannot be *failed*). The archive's added lead clause states a stronger, different proposition — that **no surface denies the face**, i.e. the contradiction is extinguished rather than excused. That is precisely the over-breadth the archive's closing argument #4 then attacks ("too broad as written"). The fold wrote the narrower rule; the archive wrote the broader one and then challenged it.

**(d) minor, noted not charged — W15-land.** Archive adds "The terrain token is the only thing that can be contradicted, and it is not what this bar policed." Not in the source, and doubtful: "what the town raises" also runs against the food/agriculture rows and the supply chain, not the terrain token alone. It understates what survives rather than overstating the permission, but it is still an unsourced positive claim in a ground cell.

---

## FINDING 5 — [MODERATE] A clause of W13 in the law text has no row and no verdict in either the packet or the archive

The archive declares `tables-13A.txt` as the source of its verbatim column. W13 in that text reads, verbatim and in full:

> "**W13 THE WATCH BAR: as item 5; the pay-gate read never uses "the watch"; a corpus row that asserts a watch off a key that reads no watch row is a breach the rewrite cures.**"

The archive's W13b quotes the middle clause with an ellipsis for the first (`"W13 THE WATCH BAR: … the pay-gate read never uses 'the watch'"`). The **third clause is simply gone** — from the archive and from the conversion packet both. Grep: `rewrite cures` appears once in `tables-13A.txt`, zero times in `convert-W11-W19.md`, zero times in `items-W11-W19.md`.

It matters because that clause imposes a **positive cure duty on the shipped corpus**, which is the same shape of duty as W11c ("dropped by the rewrite, never kept as a floor") — and W11c *did* get a row, and was **STRUCK**, and the strike hands the rewrite a licence to keep shipped clauses. The W13 cure duty got no row, so it is neither struck nor standing. A reviewer cannot mark a `VALIDATION` cell on a clause that has none.

Two further law clauses in the same position, noted for completeness (both shared with the source packet, both used as *ground* elsewhere without ever being rowed):
- item 3's "'timber rots' and 'stone endures' are refused even where common sense agrees (**walls never decay**; the one decay clock over built fabric is the calamity-scar half-life…)" — leaned on as floor-4 ground at **W14-readiness** and **W16b**, never rowed. Its implicit verdict is MODEL; nobody can challenge it here.
- item 4's `frontier` default clause ("`normalizeMonsterThreat(undefined) === 'frontier'`… never read as a fact unless the raw value is measured"). Defensibly out of slice — `frontier` is not among the defense desk's own ten — but it sits inside the same item 4 the archive quotes for W14-settled.

---

## FINDING 6 — [MODERATE] A high-risk strike the closing section should have named and did not: W11c

The archive's `THE STRIKES MOST LIKELY TO BE WRONG` names five: W15-gen, W12b, W13e, W14-gateduty, W12d. Each is well argued. **W11c is not there and should be.**

> **The old law (`tables-13A.txt`, verbatim):** "a shipped "stone" or "timber" clause is the corpus's known breach and is dropped by the rewrite, never kept as a floor."
> **Verdict:** STRUCK. **Permission granted:** "Keep the shipped material clause where the row's description agrees; the rewrite no longer owes a drop."

Three reasons it belongs in that section, and it is the only strike in the slice with all three:

1. **It is the only strike that licenses retaining text nobody re-reads.** Every other strike in the slice licenses a writer to *write* something new, which passes a refuter. This one licenses *not acting* on shipped corpus — text that never re-enters the refute loop at all. A strike whose effect is inaction is invisible to the instrument by construction.
2. **Its condition is unenforced.** "Where the row's description agrees" requires someone to resolve `institutionVocabulary.js` against every shipped material clause in the corpus. Nothing in the pipeline does that, and the strike removes the only rule that made the question mandatory.
3. **`RETRO-VALIDATION.md` §2 concedes the premise is unsafe:** "several SHIPPED lines were themselves unlawful". The re-cut's own warrant states that the shipped corpus breaks the law, and this strike hands that corpus a presumption of validity.

The closing section's stated standard is "the five a Fable reviewer should open first… the case AGAINST the fold's decision, put as strongly as I can put it." By that standard W11c outranks W13e, which is argued mainly on instability of a guard rail rather than on a class of text escaping review entirely.

A second candidate, weaker and offered only as a note: **W17g**'s strike of "never armed" licenses "a knife, a hidden cache, **a man who does not come home**" — which runs close to the product-scope floor on a named character's fate. It is not named in the closing section either, and floor 3 is the one floor the slice otherwise treats as untouchable (W19a).

---

## WHAT I COULD NOT BREAK

Stated because an adversary's negative results are evidence too, and because the four hunts below are where a fidelity failure would have been fatal rather than reparable:

- **No dropped item.** All 61 ids present in both; the per-bar counts (W11:4 · W12:5 · W13:6 · W14:11 · W15:14 · W16:5 · W17:7 · W18:5 · W19:4) reconcile to 61 against the law text's own enumeration.
- **No softened quotation.** All 61 `the old law, VERBATIM` cells match `tables-13A.txt` exactly, including the awkward ones the archive had every incentive to tidy: W12b/W12c are the two halves of a single clause ("never from a Barracks (a housing row) **or the watch**") and are quoted as fragments with ellipses rather than smoothed into sentences; W16c/W16d/W16e likewise split one clause three ways and preserve the "…or desertion" / "and never WHOSE beyond the class word" fragments intact. The one cell that is *not* a quotation is **W19d**, which re-quotes W19c's clause and appends an interpretive reconstruction ("the positive half of the same clause, read as a bar on treating an unmeasured faith as present"). The gloss sits outside the quotation marks and the source packet's own gist was equally frank ("`live: false` — the rest of the bar"), so this is disclosed, not smuggled — but it is the one row where a reviewer is validating law text the brief never wrote.
- **No silent verdict flip.** 0 of 61. Both `SPLIT (inverted)` markers (W17b, W17f) are carried, and the archive strengthens rather than hides them (W17b's "**struck, and INVERTED:**").
- **No overstated or understated permission cell.** 58 of 61 are byte-identical to the source. The 3 that differ (W13f, W14-gen, W17d) all append a gloss to a source cell that was a bare `—`; none grants or withholds anything. W14-gen's gloss trades the source's "its reach is only as wide as the rows below" for "a writer gains nothing here directly" and moves the reach statement into the ground column, where it is if anything sharpened ("exactly the union of those rows").
- **No SPLIT lost a half.** 28 of 28 carry both `kept:` and `struck:`, and every kept half's field citations survive intact. This was the hunt's designated highest-risk class and it is clean.
- **The counts in the header are true.** "Item count: 61", the tally "9 CONTRADICTION · 2 MODEL · 1 SCOPE · 28 SPLIT · 21 STRUCK", and "40 of 61 keep teeth and 21 die outright" all reproduce from the parsed rows.

---

## VERDICT

# FAITHFUL WITH NOTED DEFECTS

**Items checked: 61 of 61** (every item in the source packet, including all 28 SPLITs and all 21 STRUCKs), each on four axes — verbatim quotation against `tables-13A.txt`, verdict against the packet, ground against the packet, permission against the packet — plus the framing prose, the closing section, and the packet's `NEW FINDINGS` section.

**The row-level extraction is faithful.** Nothing was dropped, no quotation was softened, no verdict moved, no SPLIT lost its surviving half, and not one of the 61 permission cells grants or withholds anything the fold did not. On the axes where an infidelity would have invalidated the slice, the archive holds.

**Six defects, none fatal, two material, all reparable without re-reading the programme:**

| # | defect | class | severity |
|---|---|---|---|
| 1 | the packet's whole `NEW FINDINGS` section (8 items) absent; NF-1/2/3 recoverable nowhere in this slice | dropped source content | **material** |
| 2 | W17a ground: "a force outside" → "**an army at the walls is the record's own claim**" | overstated permission | **material** |
| 3 | framing prose names **W14** as a vocabulary bar the re-cut kills (source: W15 and W16 only; W14 is 3 CONTRADICTION / 1 MODEL / 6 SPLIT / 1 STRUCK) | softening in the strike's favour | moderate |
| 4 | W11b, W12d, W14-gateduty grounds add an unsourced argument, each in the strike's favour (+W15-land, noted) | added ground | moderate |
| 5 | W13's third clause ("a corpus row that asserts a watch off a key that reads no watch row is a breach **the rewrite cures**") has no row, no verdict, no `VALIDATION` cell | dropped law clause | moderate |
| 6 | **W11c** — the strike that licenses keeping shipped material clauses — not named in `THE STRIKES MOST LIKELY TO BE WRONG` | unnamed high-risk strike | moderate |

**The pattern worth naming to the chair.** Not one defect is in the columns that carry the record's teeth. Every one is in the *argumentative* material the archive added on top of the fold — the framing paragraph, the ground-column expansions, the closing section's selection. And every one of those additions, without exception, leans the same way: it makes a strike look better founded, broader, or safer than the conversion packet itself claimed. The extraction is a scribe's work and it is sound. The commentary wrapped around it is an advocate's, and a Fable seat should read the ground column of this archive as the archive's argument, not as the fold's finding, wherever it says more than `convert-W11-W19.md` says.

**Required before this slice is signed:** defect 1 (one header line pointing at F1-26…F1-33 / W-08, or eight new rows) and defect 2 (delete eleven words from W17a's ground). Defects 3–6 are corrections to prose and one missing row.
