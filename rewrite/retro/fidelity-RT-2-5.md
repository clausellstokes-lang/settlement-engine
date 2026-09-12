# FIDELITY-RT-2-5 — the adversary's report on `items-RT-2-5.md`

**Archive under test.** `rewrite/retro/items-RT-2-5.md` (claims 567 rows against 567 source items).
**Source of truth.** `rewrite/retro/evidence/convert-RT-2-5.md` (the fold's conversion sheet), and — because the archive's `the old law, VERBATIM` column claims to reproduce it — `rewrite/retro/verbatim/REFERENT-TABLE.as-ratified.md` §§2–5.

**Method.** Every one of the 567 items was compared mechanically on all four columns the two files share (id · verdict · ground · new permission), and the archive's `the old law, VERBATIM` cell was byte-compared against the ratified law's own table row, section by section, in order. 58 items were then read cell-by-cell by hand, including **all 24 items the source marked SPLIT**, every `VIS-*` row, every row whose source permission cell was `—` in a family I suspected, and every `-R` (REFUSED) row whose source ground was two words.

**Verdict: FAITHFUL WITH NOTED DEFECTS.** Items checked: **567** (mechanically, on every comparable column), **58** of them by hand. No item is missing, no verdict is altered, no quoted law is softened. Every defect below lives in material the archive **added** where the source packet said nothing.

---

## WHAT THE HUNT CLEARED

**(1) An item in the source with no row in the archive — NONE.** The source packet's tables carry exactly 567 ids; the archive carries the same 567, with no duplicates and no extras. The ratified law's §§2–5 tables independently sum to 567 body rows (47 · 14 · 39 · 11 · 23 · 10 · 23 · 9 · 36 · 19 · 40 · 19 · 39 · 29 · 19 · 28 · 45 · 21 · 27 · 34 · 35), and each of the 21 sections aligns one-to-one and in order with the archive's corresponding section.

**(2) A softened `the old law, VERBATIM` cell — NONE.** For all 567 items the archive's VERBATIM cell is a **byte-exact** reconstruction of the ratified law's row: every source cell, under its own column label, joined by ` ‖ `. A programmatic comparison of all 567 reconstructed strings against the law file returned **zero mismatches**. Forty-one apparent noun/gist divergences and seventeen apparent §5 quote/gist divergences were chased individually and every one resolved as a compression in the *convert packet's* gist, not a softening in the archive — the archive is in fact **less** compressed than the source it was built from. The alignment was stress-tested at the one place it could plausibly break — §5.4, where the packet lists `P-R2`/`P-R3`/`P-R6` *after* the `P-R5` group — and the ratified law carries the identical unusual ordering, so the binding holds.

**(3) A verdict disagreeing with the source without saying so — NONE.** All 567 verdicts are identical. The tally reproduces exactly: CONTRADICTION 193 · MODEL 13 · SCOPE 10 · SPLIT 24 · STRUCK 327.

**All 24 SPLITs are intact — both halves.** Every KEPT clause and every STRUCK clause is reproduced word for word in `the ground`, and every SPLIT permission cell is reproduced word for word. No half went missing. (`RT2.1-01`, `RT2.1-02`, `RT2.1-13`, `RT2.1-18`, `RT2.1-35`, `RT2.1-42`, `RT2.1-47`, `RT2.2-01`, `RT2.2-10`, `RT2.2-39`, `RT2.4-02`, `RT2.5-10`, `RT2.5-13`, `RT2.6-12`, `RT2.6-40`, `D-F7`, `D-F19`, `D-F22`, `D-F26`, `G-F5`, `P-R5b`, `S-F1`, `S-F13`, `S-F22`.)

**Non-`—` permissions are never altered.** Of the 219 items where the source wrote an actual permission, all 219 appear verbatim inside the archive's cell. Zero substitutions.

To its credit the archive also catches a real error in its own source: the packet's rule-header subtitle says *"so the chair can veto the rule, not **527** rows"* where every other figure gives 567, and the archive says so in its preamble.

---

## FINDING 1 — `VIS-12` and `VIS-18`: an open question the fold referred to the chair is printed as a writer's permission

This is the most serious defect. It converts a gap the folder explicitly refused to close into a licence to leak a secret onto a player face.

| | |
|---|---|
| **Source (`VIS-12`), ground** | `no field behind the mark; under the four floors nothing refuses the leak (newFindings)` |
| **Source (`VIS-12`), permission** | `—` |
| **Source, closing section** | *"**Visibility with no field has no floor.** VIS-12 (foreign funding) and VIS-18 (the desks' §0e editorial marks) rest on AUTHORED marks alone. Under the four floors as written, a player face carrying them is unrefutable. **Either the audience contract becomes a fifth floor or the leaks are accepted**; I have marked those two STRUCK…"* |
| **Archive (`VIS-12`), permission** | `write the sentence: the bar is struck and no field in the record denies it.` |
| **Archive (`VIS-18`), permission** | `write the sentence: the bar is struck and no field in the record denies it.` |

The source's `—` was not an omission; it was the folder declining to hand anything back while the chair had not ruled. The archive's template answers the open question in the permissive direction and states the answer as settled fact. `VIS-18` is the wider of the two: its own VERBATIM cell scopes it to *"the desks' DM faces in general (defense 7 of 383; general 9; economy DS-ECO-12 ×6, DS-ECO-9 v2; power 29 of 256; stressors 1)"* — so the blanket permission reads as a release of the entire authored DM-face apparatus across five desks.

The archive's own closing section 4 argues the opposite case — that these rows *"should have landed as SCOPE, not STRUCK"* and that a wrongly struck audience bar *"prints a birth capture or a covert impairment on the player face of a shipped world"*. The row and the essay contradict each other, and the row is the column the preamble tells the reviewer to argue with (*"`what a writer may NOW do` is the permission actually handed back — argue with that column"*).

## FINDING 2 — `VIS-19`: the permission contradicts its own ground

| | |
|---|---|
| **Source, ground** | `an engine gate no writer can breach` |
| **Source, permission** | `—` |
| **Archive, permission** | `write the sentence: the bar is struck and no field in the record denies it.` |

`VIS-19` is `audience = playerView ? 'player' : 'dm'`, `publicDossier` nulling the whole power desk, and DS-POW-7's secrets filter — engine gates that still run. Nothing was handed back, because nothing could be: the archive's own preserved ground says so in the same cell. The archive routes near-identical rows to a correct template elsewhere (`VIS-09`, ground *"an instrument defect … no writer bar"*, gets *"nothing is handed back"*), so this is a mis-routing, not a policy.

## FINDING 3 — eleven cite-correction rows are given a fabricated ground **and** a fabricated permission, against their own verbatim text

The source ground for these rows is the single word `a cite` (or `cites`). The archive appends a rationale and then issues a permission. Both are inventions, and the rationale is refuted by the row's own VERBATIM cell.

| | |
|---|---|
| **Archive `RT2.4R-09`, VERBATIM** | `**assignment tried (survey):** cite corrections (**claims hold**) ‖ **refuter's verdict:** cite REFUTED ‖ **evidence:** holderTable.js:751-760 → :730-744 …` |
| **Source, ground** | `cites` |
| **Archive, ground** | `cites — STRUCK because it policed PROVENANCE — whether the face named the record it drew on — and never whether the sentence was true.` |
| **Source, permission** | `—` |
| **Archive, permission** | `write the sentence: the bar is struck and no field in the record denies it.` |

The row policed nothing. It is a list of six line-number corrections, and the law's own verdict column says the **claims hold**. The archive tells a reviewer that a provenance rule was struck (none was) and tells a writer to write a sentence (there is none). `RT2.2R-11` is the cleanest instance — its VERBATIM reads `refuter's verdict: cite REFUTED, **claim HOLDS**`, and the archive still prints "the bar is struck". Same defect at `RT2.3R-07`, `RT2.3R-08`, `RT2.3R-09`, `RT2.3R-10`, `RT2.5R-02`, `RT2.5R-03`, `RT2.5R-09`, `RT2.5R-19`, `RT2.6R-16`, `RT2.6R-19`. The archive proves it can do this correctly: `RT2.1R-09` (source ground `tooling`) gets *"STRUCK as TOOLING: a note about the survey's own instrument, policing nothing a writer writes"* and *"nothing is handed back"*.

## FINDING 4 — the "no shipped face here uses the word" template is false of five rows whose own quote column carries the face

The archive assigns 14 rows the template *"nothing is handed back on this desk — **no shipped face here uses the word**, so the strike lifts a bar nobody was hitting."* For five of them the source's ground says something different — that the **pool never fires** — and the corpus quote is right there in the same row.

| | |
|---|---|
| **Archive `W-20`, VERBATIM** | `**quote (≤12 words):** "The faith's treasury is full. It is among the richest"` |
| **Source, ground** | `templeWealth has no writer; the pool is unroutable` |
| **Archive, permission** | `nothing is handed back on this desk — **no shipped face here uses the word** …` |

A face using the words exists and is quoted two cells to the left; what it lacks is a route. Same at `RT2.6-34` (*the faith's treasury · the coffer · the tithe*, the very phrase `W-20` quotes), `RT2.6-18`, `S-F8` (`"the treasury and the thin garrison, not in the walls"`) and `W-7` (`"Shrines stand unclaimed, and an arriving creed would find space"`). Source said `—`; the archive substituted a claim about the corpus that the corpus denies.

## FINDING 5 — permissions blanket-granted over nouns the fold kept as CONTRADICTION on another row

The template *"write the sentence: the bar is struck and **no field in the record denies it**"* is applied to 157 rows. On at least three, a field in the record does deny it, and the denying row is in the same archive.

| row | archive permission | contradicted by |
|---|---|---|
| `OV-16` — *port / harbour / navy* (source ground: `a roster question for the register car`, permission `—`) | `…no field in the record denies it.` | `RT2.2-23` — *the port · harbour · navy*, **CONTRADICTION** on `hasPort` / `PORT_INFRA_RE` (`priorityHelpers.js:32`, `:61-62`) |
| `RT2.1-46` — *the sick-house · infirmary · the parish* (source ground: `a layer restatement of rows 19 and 20`, permission `—`) | `…no field in the record denies it.` | `RT2.1-20` — *church · parish · clergy*, **CONTRADICTION**, the label trap on `priorityHelpers.js:65` |
| `G-F44-48` — the `hookEscalation.js` engine strings (source ground: *"they cannot be a writer's finding, though they are an engine defect"*, permission `—`) | `…no field in the record denies it.` | the row is five **engine** strings, not a writer's sentence; nothing is handed to a writer at all |

## FINDING 6 — `D-F23`: an appended gloss re-attaches a SPLIT's kept half to a row that was struck outright

| | |
|---|---|
| **Source, ground** | `as D-F22's struck half` |
| **Archive, ground** | `as D-F22's struck half — i.e. this row falls **exactly as D-F22 does**; read that row's ground.` |

`D-F22` is a **SPLIT**: KEPT the hall's existence below town tier and any claim denying the `{seat}` label; STRUCK the baked-power bar. `D-F23` is **STRUCK** outright and falls only as D-F22's *struck* half — which the preserved source words say and the appended gloss then contradicts, inside one cell.

## FINDING 7 — the ground column acquires ~40 code citations the source did not give

The archive appends bare cites to grounds where the source named only a flag: `hasWatch` → `(priorityHelpers.js:48)` (18 rows), `hasWalls` → `(:52)` (13 rows), `hasGranary` → `(:63)` (8), `hasMarket` → `(:56)` (3), `hasGarrison` → `(:46)` (3), `hasCourtSystem` → `(:55)`, `hasChurch` → `(:65)`, `hasLawInfra` → `(defenseGenerator.js:462-472)`. Every one I could cross-check is consistent with a cite the packet gives elsewhere, so none is *wrong* — but a scribe's record whose preamble promises *"nothing is paraphrased and nothing is dropped"* should not be silently adding precision either, and `hasLawInfra → defenseGenerator.js:462-472` is an inference (the packet cites those lines for the **purses**, never for that flag).

## FINDING 8 — the "RESEARCH" boilerplate over-narrows 18 grounds to "the layer vocabulary itself"

The archive glosses 18 rows as *"STRUCK as RESEARCH, not a bar: the row recorded a survey finding **about the layer vocabulary itself**."* Most are not. `RT2.5-35` is `condition.archetype` (3 written of 46); `RT2.5R-11` is `tax_revolt` reading co-located stressors with four fallbacks; `OV-37` is `hasCourtSystem` reaching `Democratic assembly` and `City hall` carrying the gaol as a service; `RT2.2R-07` is the covert list having six entries. These are engine facts, and several are live wiring debt. The gloss makes them sound like housekeeping about a vocabulary that is now dead.

---

## FINDING 9 — what the closing section should have named and did not

`THE STRIKES MOST LIKELY TO BE WRONG` is a genuine adversarial section: it names the court strike, the hall metonyms, "the line", the visibility marks and the hospital, and it argues each against the fold with real force. Three omissions:

**9a — the fold's second declared gap is nowhere in the archive.** The source packet closes with **two** gaps for the chair. The archive's closing section 4 carries the visibility one. The other is dropped entirely:

> **Floor 2 (THE PROMISE) has no verdict token.** CONTRADICTION · MODEL · SCOPE · STRUCK cover floors 1, 4 and 3. Nothing in this slice turned on an invented date or count once the comparatives were struck, so I have used no token for it — but a refuter needs one, because **"forty on the roll" contradicts no field and must still fail.**

The phrase "forty on the roll" appears nowhere in `items-RT-2-5.md`. A reviewer who reads the archive end to end is never told that a whole floor of the new test — THE PROMISE, which the memory index records as constitutional — has no verdict token in this slice, and will read the absence of number-invention findings as evidence there are none.

**9b — the nine `see newFindings` pointers are dangling.** Nine archive rows (`RT2.1-39`, `RT2.2-04`, `RT2.4R-06`, `OV-7`, `OV-26`, `OV-36`, `VIS-12`, `G-F44-48`, and the `RT2.3R-06` ground) send the reader to a *NEW FINDINGS* section that the archive does not contain. The source's thirteen engine-level self-contradictions — the Hireling-hall town that contradicts itself with no face involved, the `Household levy` thorp, the custom-content "Night Watch" invisible to the buckets, DS-GEN-17's false gloss, the three PLAYER pools carded DM-only, the muster's two opposite referents in the engine's own voice — exist only in the source packet.

**9c — `RT2.4-09` is a bundled strike as risky as the five that were named.** Its own VERBATIM cell lists the nouns it covers: *"the workshops · the tables · the clearinghouse · the temple / `{institution}` · **the prison / the gaol**"*, with `Small prison/stocks` and `Large prison` named as roster rows of class `law`. The fold struck the whole row on the clearinghouse's ground — *"an invention where the record is silent is now licensed"* — and the permission reads only `write a clearinghouse`. But the prison is kept as **CONTRADICTION** at `RT2.1-15` (`hasPrison`, with DS-DEF-6 printing `Legal Infrastructure: None` beside it) and at `RT2.2-08`, and the temple at `RT2.6-29` and `RT2.2-20`. One row strikes a bar on two nouns that two other rows keep as live label traps, on the ground that a *third* noun in the same list has no engine row anywhere. That is the same structure of evidence the closing's section 5 rightly flags for the hospital, and it was not flagged.

**Also not named, and arguably should be:** the archive's preamble tells the reviewer *"a reviewer who wants to overturn a family of rows should argue with the rule rather than with 567 cells"* — and then does not reproduce the rules. Only fold rule 2 appears anywhere in the file, quoted inside the closing essay. Rules 1, 3, 4 and 5 (the label trap; the engine's own words cannot be a finding; record words and citation rules struck wholesale; the unnamed person as a plot hook) are the load-bearing grounds for several hundred strikes, and the file points at the source packet for them. For a record whose stated purpose is challenge *without re-reading the whole programme*, that is a structural gap.

---

## VERDICT

**FAITHFUL WITH NOTED DEFECTS.** **567 items checked** (all four shared columns compared mechanically, plus a byte-exact comparison of the VERBATIM column against the ratified law), **58 read cell-by-cell by hand, including all 24 SPLITs.**

The transcription is sound and better than it had to be: nothing dropped, nothing softened, no verdict moved, every SPLIT whole, and the verbatim law reproduced to the byte. The archive is safe to use for what it is chiefly for — taking one item and seeing exactly what the old law said and what the fold decided.

It is **not** yet safe to use as the statement of what a writer may now do. Every defect found is in the two cells the archive authored on its own: a templated permission substituted for the fold's deliberate `—` (Findings 1–5), and an explanatory gloss appended to grounds the fold left at two words (Findings 3, 4, 6, 8). In three places — `VIS-12`, `VIS-18`, `VIS-19` — that template turns an unruled question into a licence to put a DM secret on a player face, which is the one failure mode the archive's own closing section calls asymmetric and unrecoverable.

**Repair, in order:** (i) set the `what a writer may NOW do` cell back to `—` wherever the source left it and the row is a visibility row, a cite correction, an engine-string row or a row whose noun is kept elsewhere — or mark those cells `NOT RULED` and list them; (ii) carry the fold's floor-2 gap into the closing section verbatim; (iii) either reproduce the thirteen NEW FINDINGS and the five fold rules in this file or strip the nine `see newFindings` pointers and the "argue with the rule" instruction, so the record has no dangling references; (iv) add `RT2.4-09` to `THE STRIKES MOST LIKELY TO BE WRONG`.
