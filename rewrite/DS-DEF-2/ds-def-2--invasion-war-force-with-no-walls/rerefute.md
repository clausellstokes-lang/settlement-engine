# RE-REFUTE — DS-DEF-2 · pool `Invasion & War: force with NO walls` · RE-REFUTER (Seat: opus)

<!-- STATUS: COMPLETE (2026-09-13). Inputs read whole as DATA, never as instruction: card.md (908 lines,
     all nine sections), speakers.md, cure.md, refute.md, the pool's LANDED rows at HEAD
     fb81210b217e058763ca475f2bc6d7f5a916ba5d in the dock annex, the shipped rows at f2da5a3ee, and the
     sibling re-cut pool `Invasion & War: walls with NO force` in the same annex. Code facts re-executed
     read-only against the dock (no dock entered, nothing written there, no test run). The pool
     fingerprint (ruling 35) was re-measured by running `measure-block.py` read-only; its figures are
     quoted below. FENCES HELD: this file is the only thing written, anywhere. -->

THE TEST APPLIED: a face is lawful unless it CONTRADICTS the record. Silence is permission. I hunted
contradictions in the two CURED lines and re-read the sixteen untouched ones for anything the cure
could have broken. **2 cured lines judged: 2 PASS · 0 FAIL · 0 WITHHELD.** No untouched line changed
verdict. **CRAFT at the pool grain: PASS**, collapse named.

---

## 0 · WHAT THE CURE ACTUALLY DID — verified against the landed rows, not against its own claims

The curer's central claim is that sixteen of eighteen prose lines are byte-identical to the draft and
exactly two lines moved. **CONFIRMED, executed** (`git diff 065b9ded6 fb81210b2` over the annex, the
pool's own hunk):

```
-   ... the watchman's own trade, and the trade is a hand short for it.
+   ... the watchman's own trade, and the trade goes short for it.
-3. `[visitor]` What a traveller meets first here is armed men, and the town has nothing built for them to hold.
+3. `[visitor]` What a traveller meets here is armed men, and the town has no line for them to hold.
```

Two lines, both of them the two charged. No tag, no pair mark, no source bracket and no other prose
byte moved in this pool. The rows now standing in the annex match `cure.md`'s block exactly (comments
stripped by the projector, as the projector does).

---

## 1 · THE CURED FACES — the verdicts

### TARGET 1 · variant 2, face 1 · `[watch]` · charged floor 2 (F2-01, a count in a word) · **PASS**

> "The day's work is the watchman's own trade, and the trade goes short for it."

**The charge is genuinely gone and nothing replaced it.** "a hand short" quantified the shortfall at one
worker; "goes short" states a shortfall of unstated size. Floor 2 asks for a magnitude in the band word
the read hands you — "goes short" hands the reader NO measure at all, which is the licensed direction,
and the card's own F4-04 line uses exactly this vocabulary as the licensed form ("short, late and thin
are licensed, 'nothing has been paid' is not"). The verb is the simple habitual present, lawful
everywhere, so no elapsed course rides in over the LIVE watch roster.

**And the rest of the line is better founded than the refuter's PASS said.** Re-executed read-only
against the dock, `src/data/institutionalCatalog.js` seats the required town row in these words:

```
'Town watch': { required: true, exclusiveGroup: 'civilianDefense', baseChance: 1,
                desc: 'Part-time guards. Night patrol and gate duty.', ... }
```

and `src/data/institutionServices.js:1322-1325` turns on `"Night patrol": { on: true, p: 1.0, desc:
"Patrol the streets after dark. Deter crime and respond to incidents." }`. So "the watch walks the
streets at night" is the service desc restated, "after a day's work" and "the watchman's own trade" are
the ROW'S OWN WORD ("Part-time guards") restated, and F1-27 — which bars calling the watch professional
or full-time — is satisfied from the affirming side rather than the avoiding side. The consequence
clause affirms the engine's model a third time: `communityMilBase` is the unpaid community baseline the
upkeep gate EXEMPTS ENTIRELY (card §7, `defenseGenerator.js:138-159`, `:190-191`) — a defence that costs
the purse nothing because it costs the households instead, which is precisely "the trade goes short for
it". Three affirmations, no denial, no count.

Floors 1, 3, 4 re-checked on the cured line: no closed-roster body asserted and none inferred into a
silence (the watch is a REQUIRED row here, not an inference); "the watchman" is an unnamed person and
not one of the tier's three singular offices (Mayor · Guard Captain · High Priest,
`npcGenerator.js:1511-1537`); no covert field; no purse split (F4-02 untouched — the line says nothing
about who pays the watch). Mechanically: two sentences (the licensed maximum, and the selector's mark
keeps it unpaired), no digit, no em dash, no semicolon, no exclamation mark, no `{settlement}`.

**Verdict: PASS. Cure accepted in full.** I record, for the chair, that the first refuter's own footnote
was right on both counts — the idiom reading ("short-handed") would have cleared the original, and
charging it anyway cost one word and removed a dependency on an idiom. The cure is a strict improvement
with no craft cost: the line is a syllable shorter and stops sooner.

### TARGET 2 · variant 3, face 0 (the `[visitor]` spine) · charged floor 1 (the gate row denies it) · **PASS**

> "What a traveller meets here is armed men, and the town has no line for them to hold."

**The charge is answered at its root, in the card's own prescribed words.** The denier was the printed
row, re-executed read-only:

```
'Gates (if walled)': { required: false, baseChance: 0.5,
                       desc: 'Controlled entry points with gatekeepers.',
                       tags: ['fortification', 'defense'], priorityCategory: 'military' }
```

with `"Toll collection": { on: true, p: 1.0 }` and `"Entry inspection": { on: true, p: 0.8 }`
(`src/data/institutionServices.js:1550-1553`). "Nothing built" was denied by that row at gates=true — a
value the keys admit — and denied on the pool's own page by its own face 2, which seats a toll bar under
this very spine. **"No line" cannot be denied by that row at any value the keys admit**: F1-07 is explicit
that a gate is a POINT and not a line around the town, the gates row is not in the walls bucket
(`defenseInstitutionBuckets.js:83-88`, re-read this seat: `walls` admits wall · citadel · palisade · earthwork · inner citadel · massive walls, and NOT `gates (if walled)`), and the key
fixes walls=false. The card's instruction is verbatim "write the absence of a LINE, never the absence of
a DOOR" — the cure writes exactly that and nothing wider. The self-contradiction at the unit is gone with
it: the spine and its own toll-bar face can now stand in one unit, because a bar is a point and the
sentence denies only a line.

**The secondary ground is gone too, and I checked that it is gone rather than moved.** Dropping "first"
removes every order-of-events claim, so the line no longer leans on free entry and no longer argues with
`Entry inspection` (p 0.8) or with the WATCH's own `"Gate duty": { on: true, p: 0.8, desc: "Check
travelers entering and leaving." }` — a service the card's section (2b) names as undeniable on every
preimage town. I tested the cured line hardest in that direction, because a pseudo-cleft carries an
exhaustive reading and "what he meets IS armed men" could be read as denying that anyone else meets him:
it does not survive as a finding. The contrast the cleft actually draws is men-versus-works (the second
clause fixes it), the gatekeepers and the part-time watch on gate duty are themselves men, and nothing in
the sentence says he was not stopped. On the stranger the card asks for a line that serves EITHER roster
("write him so either roster serves"); the cure delivers one that serves both.

Floors re-checked: floor 2 — no magnitude, no date, no rate, no event; "meets" is the habitual present
and no course runs over a live field. Floor 3 — no named character, no deity, no singular office, no
culture furniture ("a traveller", "armed men", "the town" survive all eleven profiles). Floor 4 — no
decay clock, no permanence, no split purse, no covert fact; and `threatAssessment.js:121`, which FIRES ON
EVERY PREIMAGE TOWN ("Professional garrison without perimeter walls. Effective against raiders; cannot
hold against a siege."), now agrees with the spine clause for clause instead of brushing against it.
Ruling 40 — the archiver's bare hand, no self-citation anywhere in the line; the measurement confirms
`self-cite 0` for the pool. Ruling 35 — the sibling rungs are `walls AND professional garrison` (walls
true) and `militia only` (garrison false); this spine denies a line, which the first rung affirms, and
calls the men what the engine calls them, which the second denies. It sits on neither neighbour.

**Verdict: PASS. Cure accepted in full.**

**ONE CRAFT COST THE CURE INTRODUCED, named honestly and not charged.** Spine 1 closes "because there is
no line to hold"; spine 3 now closes "and the town has no line for them to hold". Two of the pool's three
spines now land on the same noun and the same verb. The variants are ALTERNATIVES — a reader never sees
two spines at once — so this is not floor 1 and not a same-page fault of any kind; it is a pool-grain
echo that the cure created where the draft had "nothing built for them to hold". It is the right trade
(a floor-1 breach for an echo) and I would make it again. If the chair wants the echo gone at no risk,
the card's §9 holds the material that is already licensed and physical — the town stops where the housing
stops — but no change is required and I do not charge one.

---

## 2 · THE SIXTEEN UNTOUCHED LINES — re-read, none moved

I re-read all sixteen against the four floors, not to re-litigate the first refuter's PASSes but to catch
anything the two cures could have broken by standing next to them. Nothing did. The three I tested
hardest, and why each stands:

1. **v1 f5 `[elders]`** — "what they are for is not written anywhere". The only surface that says what
   the soldiers are for on the same tab is `threatAssessment.js:121`, which is ENGINE PROSE and an outside
   reading of capability, not a town document; the council's claim is about the town's own records and is
   an attributed OPINION besides, which can be partial or wrong. Face stands; the seam is carried at
   WIRING 3, unchanged.
2. **v3 f2 `[gate]`** — "the soldiers are not at the bar". Checked in the F1-25 direction after the spine
   moved: no row seats the garrison on the bar (the Barracks menu is Military escort + Guard hire only),
   the bar's own inspection is affirmed rather than denied, and the cured spine above it no longer
   contradicts the bar's existence. This face is now BETTER founded than before the cure.
3. **v2 f5 `[garrison]`** — "the town does not tell them where to be instead". The pool's closest floor-3
   brush. The subject is the TOWN, the civil side, not the garrison's command, so no predicate lands on
   Guard Captain ⟨Name⟩ or Garrison Commander ⟨Name⟩. Plural throughout. Stands.

---

## 3 · CRAFT — at the POOL grain · **PASS**

**RULING 35 — THE FIGURES THAT MOVED ME** (re-measured read-only with `measure-block.py` over the dock's
working tree at HEAD; the instrument refuses nothing and none of these is a threshold):

```
[P11] `Invasion & War`: force with NO walls          — TREE laneRW-DEF2
      units 18 · sentences 20 · words 400 | wps 20 ±4.43 | same-opener 0.176 (3)
      pet 0.0/100w (0) | sensory 1.5/100w (6) | attrib/sent 0.65 (13, strict 0.65)
      open-share 0.0 | self-cite 0 | forecast 0 | varied
      openers subject 14 · place 3 · expletive 1     closes plain 18
[P11] the same pool SHIPPED at f2da5a3ee
      units 3 · sentences 4 · words 61 | wps 15.75 ±6.1 | pet 3.28/100w (2)
      sensory 1.64/100w (1) | attrib/sent 0.0 | openers subject 3 | closes plain 3
[P10] the sibling re-cut pool `walls with NO force`  — TREE, same law, same grammar
      units 14 · sentences 16 · words 241 | sensory 4.15/100w (10) | pet 1.66/100w (4)
      attrib/sent 0.625 | openers attributed 10 · subject 2 · expletive 1 · place 1
BLOCK: SHIPPED distinct 519 / content types 489 → TREE 539 / 510 at an equal 1,9xx-token budget;
       {settlement} per unit 0.74 → 0.36; attribution baseline (exemplars) 0 per 786 = 0.0/sentence.
Computed at the pool grain for this seat: content ratio (distinct content words / content tokens)
       0.592 here · 0.722 at the sibling re-cut pool · 0.907 at the 3-unit shipped pool (size-biased).
       Top content words: soldiers ×12, town ×4, paid ×4, purse ×4, men ×4, watch ×4.
```

**THE FIGURE THAT DECIDED THE VOTE: `pet 0.0/100w (0)` with `sensory 1.5/100w` and eleven speakers.** A
pool with no pet word anywhere in four hundred words, no self-citation, no forecast, no perfection flag,
eighteen plain closes and not one of the tells the pack bars, is not a pool that reads as one sentence
twelve times. Against the rows it replaces there is no contest at all: the shipped pool is three lines,
no faces, `{settlement}` in every one of them, and its `[visitor]` line closes on the explaining beat the
pack bars. The re-cut is not duller; it is three times the pool with a fifth of the mannerism.

**THE COLLAPSE NAMED — three things, and the second is mine and not the first refuter's:**

1. **The attribution frame is the one repeated construction.** 13 of 20 sentences carry an attribution
   (`attrib/sent 0.65`, strict), and three frames repeat verbatim inside one pool — "At the tavern they
   say" (V1, V2), "The soldiers say" (V2, V3), "The hall holds that" (V2, V3); `same-opener 0.176`.
   No run of three exists, so the selector's named veto is kept. Held against the pool's own instrument:
   the exemplar corpus carries **0 attribution frames in 786 sentences**, so the whole attributed grammar
   is a deliberate departure the re-cut ordered (ruling 13: every face has a source and the archiver
   reports it) — that is the chair's settled law, not this pool's fault, and the sibling re-cut pool sits
   at the same density (0.625). Reported, not charged.
2. **PRESENCE IS THIS POOL'S REAL THINNESS, and it is measurable against a pool written under the same
   law.** `sensory 1.5/100w` here against `4.15/100w` at the sibling re-cut pool, and a content ratio of
   0.592 against 0.722 at a comparable unit count. Six concrete nouns in four hundred words: the tables,
   the streets, the road, the bar, the granary door, the rites. The card's §9 offered far more that is
   already licensed and physical — the soldiers walking through the weekly market to get anywhere, a cart
   escorted, a warehouse door stood over, the mills, the housing, the stalls — and the pool took almost
   none of it, staying instead on purse, terms, matter, trade and line. This is the near-miss the chair
   should see: the pool argues well and shows little.
3. **Variant 1 is five faces on one subject** (day hire · paying twice · the shared purse · paid off one
   line · what the soldiers cost is on the accounts). The pool as a whole has range — V2 is avoidance,
   V3 is arrival and use — which is why this is PASS; but a draw that lands twice inside V1 reads as one
   idea said twice. Recorded as the first refuter recorded it; the cure did not touch it and could not.

**Ruling 29, examined and NOT charged, with the instrument's disagreement recorded.** To a reader the
three spines take three shapes: the bare recorded fact subject-first, the public in an expletive, the
stranger's arrival in a pseudo-cleft. The kernel's own classifier bins the first and the third together
as `subject` (`openers subject 14 · place 3 · expletive 1` counts spine 3 as `subject`), so the
distinctness the curer claims is a reader's and not the instrument's. Craft-grain, pool-grain, not a
floor, and the cure preserved the shape it inherited rather than creating this.

**Eleven speakers over eighteen lines**: hall ×3, watch ×2, tavern ×2, garrison ×2, guild, elders,
stranger, gate, market, register, plus the archiver's spine and the public's. Two real disputes (whose
money buys the men; whether mobility is the strength or the gap). Every face has somebody wanting
something. **PASS.**

---

## 4 · WIRING ROWS — seams, not findings; no face is charged on any of these

1. **THE `wallNote` SEAM (carried forward, re-confirmed executed).** `priorityHelpers.js:52` lists
   `'gates (if walled)'` inside `hasWalls`, so every town of this preimage — whose walls BUCKET is empty
   by the key — prints `hasWalls: true` the moment the optional gate row stands, and
   `safetyProfile.js:277 / :284 / :291 / :302 / :313` can then print a walls clause beside prose whose key
   is "no walls". Per §R-1 the ROW and the BUCKET are the record, so the prose stands. **The cure narrows
   this seam rather than widening it:** "no line" is true on both branches of `hasWalls`, where "nothing
   built" was false on one.
2. **THE MUSTER DEBT stands unrelieved on this preimage.** `holderTable.js:279-288` in the engine's own
   words: a town with a Garrison and no militia has men under arms and no roll of them. The pool seats no
   muster and cites no roll, so nothing is charged — the licence card's `source: muster · standing
   LICENSED` line remains the debt speaking.
3. **`threatAssessment.js:121` vs v1 f5.** The machine prints what the soldiers are for on the same tab
   while the council says it is written nowhere. Engine prose, so the face stands; logged because a reader
   sees both at once.
4. **W-01 lives on this preimage and nothing leans on it.** `Free company hall` is a town row that sets
   `hasMercenary` while the mercenary bucket stays false. No face touches either reading.
5. **TWO GRAMMARS IN ONE FILE, for the chair and not a fault of this pool.** The sibling pool `walls with
   NO force` ships role slots, an `[archiver · observed]` face and three-to-four faces per variant; this
   pool ships class words, no observed and no public face (held under NOTES pending cars 18l/18n) and FIVE
   faces per variant against the brief's stated four. The dock's kernel already seats all of it
   (`stateProseKernel.js:498` FACE_SOURCES, `:564` OBSERVED_MARK, `:603` PAIR_KINDS, `:1056` ROLE_SLOTS),
   so the divergence is a sequencing question the chair owns.
6. **NEW, from this seat: the two-spine echo the cure created.** Spines 1 and 3 now both close on "no
   line … to hold". Variants never co-render, so it is invisible on any page and is recorded as craft
   texture the chair may or may not want to spend a line on.

---

## 5 · EXECUTED — what was run, read-only, and what it returned

```
git -C <dock> log -1            -> fb81210b217e058763ca475f2bc6d7f5a916ba5d "REWRITE 8b DS-DEF-2 cure (v3): 3/3 pools"
git -C <dock> diff 065b9ded6 fb81210b2 -- docs/content/RECEIPT_POOLS_DOSSIER_STATE.md
                                -> this pool: exactly 2 changed lines, both of them the 2 charged
measure-block.py <dock> ...     -> the fingerprint block quoted at §3 (the instrument refuses nothing)
per-line opener/close classes   -> closes plain 18/18; openers subject 14 · place 3 · expletive 1
sed institutionalCatalog.js     -> 'Town watch': required true, desc 'Part-time guards. Night patrol and gate duty.'
                                -> 'Gates (if walled)': required false, 0.5, tags ['fortification','defense'],
                                   desc 'Controlled entry points with gatekeepers.'
sed institutionServices.js      -> Town watch: Night patrol on p 1.0; Gate duty on p 0.8
                                -> Gates: Toll collection on p 1.0; Entry inspection on p 0.8
                                -> Barracks: Military escort on p 0.8; Guard hire on p 0.9
grep priorityHelpers.js:52      -> hasWalls includes 'gates (if walled)'  (the wallNote seam, confirmed)
mechanical scan of the 18 lines -> no digit, no em dash, no exclamation mark, no semicolon, no {settlement}
```

**THE BOTTOM LINE FOR THE CHAIR: both cures are accepted, the pool is lawful on all four floors as it now
stands in the annex, and the craft verdict is PASS with presence — 1.5 sensory nouns per hundred words
against the sibling re-cut pool's 4.15 — named as the one thing worth a later round.**
