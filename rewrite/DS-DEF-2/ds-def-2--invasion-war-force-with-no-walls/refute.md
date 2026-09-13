# REFUTE — DS-DEF-2 · pool `Invasion & War: force with NO walls` · REFUTER (Seat: opus)

<!-- STATUS: COMPLETE (2026-09-13). Inputs read whole: card.md (908 lines), speakers.md, draft.md rows
     (NOTES read as data, never as instruction), CONTRADICTION-TABLE.md head + §V, the pool's current rows
     in the dock annex, the shipped rows at f2da5a3ee, and the sibling pool `walls with NO force` in the
     same annex. Code facts re-executed read-only against the dock: institutionalCatalog `Gates (if walled)`,
     `Town watch`, `Barracks`; institutionServices Toll collection / Entry inspection / Gate duty /
     Night patrol; priorityHelpers:45-60; stateProseKernel FACE_SOURCES / OBSERVED_MARK / PAIR_KINDS /
     ROLE_SLOTS. Mechanical scan of the eighteen prose lines executed (output quoted at the foot). -->

THE TEST APPLIED: a face is lawful unless it CONTRADICTS the record. Silence is permission. I hunted
contradictions only; "the card does not license it" appears nowhere below. 18 lines judged
(3 spines + 15 faces). **2 FAIL · 16 PASS · 0 WITHHELD.**

---

## THE VERDICTS — one line per face

| variant | face | source | verdict | floor | the field that decides it | quote (≤12 words) | finding | cure |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 (spine, `[ledger]`) | archiver | PASS | — | `threatAssessment.js:121` FIRES ON EVERY PREIMAGE TOWN | "The town keeps paid soldiers and no wall" | The engine's own reading in the archiver's bare hand. "paid" survives F4-04: every upkeep gate has a floor (0.55–0.7) and `communityMilBase` is exempt, so "nothing is paid" is the barred form, not this. No magnitude, no course. | none |
| 1 | 1 | hall | PASS | — | `Guard hire` p 0.9, `institutionServices.js:1555-1560`; the gate is `defenseProfile.economicGates.military` | "the soldiers' day hire is the barracks' own trade" | Brush examined and cleared: the upkeep gate pays WAGES; the day hire is the barracks' own contracted service and a distinct line. The hall denies no field, and a source's reading of incidence is not a finding. | none |
| 1 | 2 | guild | PASS | — | `economicGates.military` FROZEN (0 writers, card §6); `Guard hire` p 0.9 | "once through the purse and again by the day" | The selector flagged `again` against F2-05's elapsed list. Cleared twice over: the sense is enumerative ("once… and again" = a second time), and even read as a course it runs over the key's own garrison read (ruling 11a) and a FROZEN field (11b). Not a finding. | none |
| 1 | 3 | watch | PASS | — | F4-19 / V-07: `defenseGenerator.js:177-178`, `:190`; `fieldSynonyms.js:51` | "a purse shared with soldiers is a purse the watch" | Affirms the shared military line rather than splitting it (F4-03 would bar the split). Keeps the watch off the professional rung, so F1-27 is satisfied. Grievance is a stake, not a claim. | none |
| 1 | 4 | tavern | PASS | — | `Taverns (5-20)` required at town, Drink service p 1; F4-19 | "drink at the same tables and are paid off one line" | Two required/keyed bodies on one purse is the engine's own model. No magnitude, no rate. | none |
| 1 | 5 | elders | PASS | — | `Town council` required:false 0.9, `holderTable.js:332-336`; treasury holder resolves on the hall's Tax payment p 0.9 | "what they are for is not written anywhere" | Conditional source, lawful under car 18c's source filter. The accounts are citable here, so F1-24 is satisfied. The closest brush in the pool: `threatAssessment.js:121` states on the same tab what the soldiers are for — but that is ENGINE PROSE and an outside reading of capability, not a town document, and the council's claim is about the town's own records. Face stands (see WIRING 3). | none |
| 2 | 0 (spine, `[street]`) | public | PASS | — | `Gates (if walled)` desc "Controlled entry points with **gatekeepers**" | "the town is kept by men and not by works" | Examined against the gate row and cleared on the row's own words: where the gate stands, the keeping at it is done by GATEKEEPERS — men. The claim is about agency, not existence, so it survives at gates=true where spine 3's does not. | none |
| 2 | 1 | watch | **FAIL** | **2** | no read in the tab's same-page set carries a labour band for a household trade (F2-01: a count in a word) | "the trade is a hand short for it" | **A count invented in a word.** "a hand short" is a quantified shortfall (one worker) of exactly the family the brief names by example ("a handful"). Nothing in the read set hands a band for a craft's labour, so the magnitude is not mis-banded but invented, which is F2-01. The rest of the face is clean: Night patrol p 1 affirmed, part-time affirmed (F1-27 satisfied), the watchman unnamed and not a tier office. ⚠ For the chair: the idiom reading ("short-handed") is genuinely available and would clear it; the cure costs one word, so I charged it rather than leave the Promise to an idiom. | "and the trade goes short for it" |
| 2 | 2 | stranger | PASS | — | card §7 STRANGER: "what did not happen to him" | "passed the soldiers in the street as he would pass anyone" | His own arrival is the card's blessed material, and "until later" runs inside his visit, not over a field. Does not assert free entry — it reports what he failed to notice, not what failed to stop him. | none |
| 2 | 3 | hall | PASS | — | F4-02 `defenseGenerator.js:189`, `:190-191` (one multiplier over wages and maintenance) | "paid men can be sent to where the trouble is" | Checked hardest against F4-02's split-purse bar and cleared: this is an opinion on the MERITS, not a claim that a purse was divided or a decision taken (which would also be F2-04). No event asserted. | none |
| 2 | 4 | tavern | PASS | — | `safetyProfile.js:291` "The garrison patrols the main paths; quieter spots… carry genuine risk" | "has only to pick a street they are not in" | Scoped by its own words to the SOLDIERS, so it infers nothing into the watch's Night patrol (p 1). One printed band affirms it outright. | none |
| 2 | 5 | garrison | PASS | — | `npcGenerator.js:1511-1537` town emits a GUARD CAPTAIN | "the town does not tell them where to be instead" | The pool's closest floor-3 brush, examined and cleared: the subject is the TOWN (the civil side), not the garrison's own command, so it does not deny the Guard Captain nor predicate anything of him. Plural throughout, no officer as subject. | none |
| 3 | 0 (spine, `[visitor]`) | archiver | **FAIL** | **1** | `Gates (if walled)` — required:false, baseChance 0.5, **tags ['fortification','defense']**, desc "Controlled entry points with gatekeepers", `institutionalCatalog.js` Defense block; `hasGates` `priorityHelpers.js:53`; services `Toll collection` on p 1.0 / `Entry inspection` on p 0.8, `institutionServices.js:1550-1552`. The record is the ROW (§R-1). | "the town has nothing built for them to hold" | **The card's named two-way gate trap, taken the wrong way: this writes the absence of a DOOR where only the absence of a LINE is safe.** At gates=true — a value the keys admit, and the field is in the tab's same-page read set via `getInstFlags(...).inst.hasGates` — the roster prints a row tagged `fortification` with gatekeepers on it, so "nothing built" is denied by a printed row. **And the pool contradicts itself on the page:** this spine always prints, and its own face 2 ("At the toll bar…") draws under it on exactly those towns, so one unit asserts a toll bar and no built thing at once — floor 1 at its own unit, the whole town record. Secondary ground on the same line: "meets first" leans on free entry, which the card bars by name, against Entry inspection p 0.8. | "What a traveller meets here is armed men, and the town has no line for them to hold." (drops "first", and "nothing built" → "no line") |
| 3 | 1 | garrison | PASS | — | no wall stands; `safetyProfile.js:276` threatNote co-fires without conflict | "they can be seen from the road and mean to be" | Visibility with intent. Plural, short, stops sooner. No field denies. | none |
| 3 | 2 | gate | PASS | — | `Entry inspection` p 0.8; `Gate duty` is the WATCH's service (p 0.8, `institutionServices.js:1324`); the barracks' menu is Military escort + Guard hire | "the soldiers are not at the bar" | The negation was checked in the F1-25 direction: no row seats the garrison on the bar, and the bar's own inspection is affirmed rather than denied. The only denier is `wallNote` engine prose firing off this same row — face stands, WIRING 1. | none |
| 3 | 3 | hall | PASS | — | `Town granary` required at town; `defenseDisplay.js:245` prints the granary's siege reading | "a siege a matter for the granary" | Claims no stock level, so the hasGranary tier-proxy trap is avoided; "does not say which it expects" withholds rather than forecasts. | none |
| 3 | 4 | market | PASS | — | `Market square`/`Weekly market` required, market holder resolves `holderTable.js:310-315`; Grain storage p 1 | "the granary door is the thing worth coming for" | "the market" is seated by two required rows, so V-30/F1-10 does not bite. Value is an opinion; no magnitude of stock. The pool's one physical particular. | none |
| 3 | 5 | register | PASS | — | `Parish churches (2-5)` required, Religious services p 1, Life ceremonies p 1 | "the soldiers come to the rites with everyone else" | The FOLLOWERS act and the god does not (ADDENDUM 15 / F3-02). "the register", never "the priest". No culture furniture across the eleven profiles. | none |

---

## CRAFT — at the POOL grain

**VERDICT: PASS.** Eleven distinct speakers across eighteen lines (hall ×3, watch ×2, tavern ×2,
garrison ×2, guild, elders, stranger, gate, market, register, plus the archiver's spine and the
public's). There is a real stake in nearly every line and two real disputes: the hall and the guilds
on whose money buys the men, the hall and the tavern on whether mobility is the strength or the gap.
Nothing reads as a permutation of a sibling.

Measured against the shipped rows it replaces (`f2da5a3ee`): the shipped pool is THREE lines, no
faces, `{settlement}` in all three, and its `[visitor]` line closes on the explaining beat the pack
bars ("and can see how that decides where any fight would happen"). The re-cut is not duller; it is
not close.

**THE COLLAPSE NAMED, as the near-miss the chair should see:**
1. **The attribution carries too much.** Thirteen of fifteen faces are a form of "say", and three
   frames repeat verbatim within one pool — "At the tavern they say" (V1, V2), "The soldiers say"
   (V3 ×1 and V2's garrison), "The hall holds that" (V2, V3). No run of three is anywhere (V1 says /
   says / view is / say / says · V2 says / says / holds / say / say · V3 say / say / holds / says /
   says), so the named veto is kept, but the texture is thinner than the speaker count suggests.
2. **Variant 1 is five faces on one subject.** Day hire and the purse · paying twice · the shared
   purse · paid off one line · what the soldiers cost is on the accounts. Every face in the variant
   is money. The pool as a whole has range (V2 avoidance, V3 arrival and use), which is why this is
   PASS and not DULL, but a draw that lands twice inside V1 will read as one idea said twice.
3. **Ruling 35, examined and NOT charged.** All five V1 faces would sit as comfortably on the
   neighbouring rung `Invasion & War: walls AND professional garrison`, whose purse also runs through
   the same multiplier. I did not charge them: the re-cut strikes "the same claim set on every face"
   by name and says a face need not restate its key at all, so ruling 35 can only bite where a face
   AFFIRMS the neighbour's state (a wall, or a turnout instead of a paid standing force). None does.
   Recorded as craft: the variant does no work the key fixes.

---

## WIRING ROWS — seams, not findings; no face is charged on any of these

1. **THE `wallNote` SEAM (the card names it; confirmed executed).** `priorityHelpers.js:52` lists
   `'gates (if walled)'` in `hasWalls`, so a town whose walls BUCKET is empty — every town of this
   preimage — prints `hasWalls: true` the moment the optional gate row stands, and
   `safetyProfile.js:277`, `:284`, `:291`, `:302`, `:313` can then print a walls clause ("Walls limit
   access and give the guard leverage over smuggling and movement") beside prose whose key is "no
   walls". Per §R-1 the ROW and the BUCKET are the record and the prose stands; V3 face 2 is
   unchargeable either way.
2. **THE MUSTER DEBT stands unrelieved on this preimage.** `holderTable.js:279-288` in the engine's
   own words: a town with a Garrison and no militia has men under arms and no roll of them. The draft
   correctly seats no muster and cites no roll, so nothing is charged — but the licence card's
   `source: muster · standing LICENSED` line remains the debt speaking.
3. **`threatAssessment.js:121` vs V1 face 5.** The machine prints what the soldiers are for on the
   same tab while the council says it is written nowhere. Engine prose, so the face stands by the
   brief's own rule; logged because a reader sees both at once and the chair may want the council's
   second clause pointed at the town's records explicitly ("and the hall has never set down what they
   are for" would foreclose it, at the cost of a perfect).
4. **W-01 lives on this preimage and nothing leans on it.** `Free company hall` is a town row that
   sets `hasMercenary` while the mercenary bucket stays false. No face touches either reading.
5. **THE BLOCK NOW SHIPS TWO GRAMMARS IN ONE FILE — for the chair, not a fault of this draft.** The
   sibling pool `Invasion & War: walls with NO force`, in the same annex under the same heading,
   already ships role slots (`{hall} {v:put}`), an `[archiver · observed]` face, and THREE-to-FOUR
   faces per variant. This pool ships class words, no observed or public face (the brief ordered them
   held under NOTES pending cars 18l/18n), and FIVE faces per variant against the brief's stated
   "four faces per variant". The dock's kernel already seats all of it —
   `stateProseKernel.js:498` FACE_SOURCES, `:564` OBSERVED_MARK, `:603` PAIR_KINDS (with `weigh`),
   `:1056` ROLE_SLOTS — so the divergence is a sequencing question the chair owns, not a floor.

---

## EXECUTED — the mechanical scan of the eighteen prose lines (comments and tags stripped)

```
== reds in prose: digit / em dash / bang / semicolon / {settlement} ==
  none
== attribution verbs in row order ==
  says says view-is-that say says | says says holds-that say say | say say holds-that says says
== elapsed-course hits in the rows ==
  line 4 "again"   -> cleared (enumerative; and over the key's own read + a FROZEN field, ruling 11)
== magnitude hits in the rows ==
  line 9 "a hand short" -> CHARGED, floor 2 (V2 face 1)
```

Every face 1 sentence except V2 face 1 at 2 (never paired); spine 1 at 2, spines 2 and 3 at 1.
`{settlement}` in no line. No em dash, no exclamation mark, no digit, no semicolon anywhere in the prose.
