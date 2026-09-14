# RE-REFUTE (the cure round) — DS-DEF-2 · pool `Economic Survival: STRONG`

Re-refuter: Opus (the verifier seat, a different reading from the cure), for the Fable chair · 2026-09-13.
Test applied: ADDENDUM 14/18 as re-worded at `recut/CONTRADICTION-TABLE.md` §V.0 — A FACE IS LAWFUL UNLESS IT
CONTRADICTS THE RECORD; silence is permission; "the card does not license it" names no fault. Floor 1 under
§V.0's quantifier (no field in the tab's SAME-PAGE READ SET, at any value the keys admit, denies it).
Instruments: `cure.md`, `draft.md`, `refute.md`, `card.md` (sections 1–9), `speakers.md`,
`recut/CONTRADICTION-TABLE.md` (§V.0, §V.1 V-17, F1-24, F1-31, F2-01, F2-04, F2-05, F4-02, F4-03, F4-04,
F4-19, R-8, R-9), and — READ-ONLY in the dock, no file written, no command that mutates state — 
`src/generators/defenseGenerator.js`, `src/domain/display/defenseDisplay.js`,
`src/domain/display/threatAssessment.js`, `src/domain/display/stateProse/fieldSynonyms.js`.

STATUS: COMPLETE. 2 cured faces judged · **2 PASS · 0 FAIL · 0 WITHHELD**. Craft at the pool grain: **PASS**.
Both cures are accepted as lawful and both are better than the rows they replace on the axis they were cut for.
Three things are recorded and not charged (one of them a correction to my predecessor's ground), and one claim
in `cure.md`'s own notes is measured FALSE as reasoning while its conclusion stands.

---

## THE MECHANICAL VERIFICATION OF THE CURED FILE (executed, not asserted)

The rows block of `cure.md` was extracted (`awk '/^\*\*`Economic Survival`/,/^--- NOTES/'`) and diffed against
the same block of `draft.md`:

    5c5   [archiver · pair 1 · weigh]   changed
    22c22 [garrison]                     changed
    (nothing else)

- **CONFIRMED: exactly 2 lines changed, every other row byte-identical.** 32 row lines (3 spines + 29 faces,
  counted mechanically) plus the pool line; 29 `[face]` rows; the grammar tokens and source brackets of both
  cured rows are untouched, so `speakers.md` still describes the file exactly.
- **CONFIRMED mechanical voice:** no em dash and no exclamation mark anywhere in the block; **no digit in any
  prose** (tested with the unit indices and the bracket tokens stripped); `{settlement}` in no unit and no face.
- **CONFIRMED provenance of cure 1:** `draft.md:115` holds the line verbatim under HELD —
  "packet 2 V1 weigh alternate: 'Which of the two is right is argued in the town and is not settled anywhere.'"
  The curer took the selector's own held line, not a new invention.

## THE DOCK FIELDS THE TWO CURES TURN ON (read, not taken on trust)

- `src/generators/defenseGenerator.js:189` — `const milUpkeepMult = Math.min(1, 0.6 + (econOutput / 50) * 0.4);`
  under the comment at `:182` "Economic-upkeep gate (**garrison wages, wall maintenance**)", applied at `:190-191`
  only `if (hasAnyDefense && milUpkeepMult < 1)`. **ONE multiplier over the two expenses together — F4-02 and
  V-17 are grounded exactly as charged, and cure 1 removes the split.**
- `src/domain/display/stateProse/fieldSynonyms.js` `FIELD_SYNONYM_ROWS[0]` —
  `field: 'settlement.defenseProfile.economicGates.military'`, `nouns: ['wages','wage','pay','purse']`,
  "The military economic gate IS the town's pay for its watch". **F4-19 confirmed: the watch's wage is inside
  the same gate, so a face may not pay one and not the other.**
- `src/generators/defenseGenerator.js:258-270` — `economic` is `storageScore` FIRST (storage months, capped 70)
  plus flat +10s. **The badge is storage, not money** — cure 2's replacement clause is the arithmetic itself.
- `src/domain/display/threatAssessment.js:167` — "Strong economic base **can absorb a sustained crisis**…".
  Cure 2's "can be fed through a crisis" is the modal the engine itself prints, not an event the record ran
  (F2-04 clear).
- `src/domain/display/defenseDisplay.js:219-221` — `status: econScore >= 65 ? 'Well-funded'` with the note
  "Full pay, maintained equipment, reserve capacity." — **the threshold IS this pool's key**, so that note prints
  on 337/337. `:319-321` — the `Upkeep underfunded: <expense> at N%` line fires **only when the gate is < 1**
  (326/337). Both are display strings; the gate itself is the field.

---

## THE TWO CURED ROWS

### C-1 · V1 face 3 · `[archiver · pair 1 · weigh]` · **PASS**

> "Which of the two is right is argued in the town and is not settled anywhere."

The charged fault is GONE and nothing replaced it.

- **Floor 4 (the charge) — cleared.** The line names no charge the purse meets, no direction between two
  expenses, and no amount. There is no purse in it at all. `economicGates.military` (`defenseGenerator.js:189`,
  the one multiplier over garrison wages and wall maintenance together) is not denied in either direction, so
  F4-02, F4-03 and the V-17 precedent (`CONTRADICTION-TABLE.md:416`) have nothing to bite on.
- **Floor 2 — cleared.** The volume word "full" over the purse (F2-01) went with the clause. What remains is the
  simple habitual present ("is argued", "is not settled"), lawful everywhere; no magnitude, no date, no rate, no
  elapsed course over anything, live or frozen.
- **Ruling 22 — licensed by name, in the licensed words.** "that the matter is in dispute" is one of the three
  shapes, and the ruling's own example is "Which is right is a matter of debate in the town". THE WEIGHING OPENS
  AND NEVER CLOSES: this one leaves the dispute standing and settles nothing, which is the strictest reading of
  the owner's fence (the game master decides what actually happens). It names no covert field and no field's
  opposite.
- **Floor 1, the field I consulted and cleared:** `Town hall` → `Dispute arbitration` (p 0.8) at town and
  `City hall` → `Appeals court` (p 0.8) at city, card §(2b), where denying a service at or above the bar is
  floor 1 "whatever the face is otherwise about". "Is not settled anywhere" does NOT deny the service: it says
  this question has not been resolved, not that the town has nowhere to take a question — and the hall is a
  party to this one, not its arbiter. The desk is consistent here: V3 face 8 ("nobody has brought it the question
  of the watch's wage") passed on the same reading.
- **Floor 3 — clear.** No named person, no deity, no singular office; the subject is the question, not a speaker.
- **Ruling 40 / the E2 ratchet — clear.** No "the survey", "this office", "the record", "entered as". "Anywhere"
  gestures at no record and cites none (F1-24 untouched, which matters on a pool where **no record is held on
  every town**: court 300/337 is the best and `muster` resolves on 0/337).
- **The curer's refusal of the brief's own example is CORRECT and I verify its ground.** The licensed sample
  "the one purse is filled at the gate and spent by the hall" would seat a gate in the archiver's own hand on a
  preimage where the wall-or-gate row stands on **83 of 102 towns** (card §(7)), and an archiver's conjecture is
  not filtered by source the way a `[gate]` face is (car 18c). That is the right call for the right reason.
- **What it costs, and it is a real cost:** V1's weighing now carries no content of its own. It reports that the
  town argues; it does not say what the archiver makes of the argument. The pool keeps one lean (V2) and loses
  its one conjecture. That is craft, it is not a floor, and it is carried into the craft verdict below rather
  than charged here.

### C-2 · V2 face 8 · `[garrison]` · **PASS**

> "The garrison's account is that a town which can be fed through a crisis and does not meet its wage in full
> has decided something, and has not said what."

- **Floor 2 (the charge) — cleared.** "Full stores" is gone. "Can be fed through a crisis" states no volume,
  count, share or duration; it is the capability `threatAssessment.js:167` prints in its own words, and the
  measured band behind it (storage min 5 · median 7 · max 12 months, card §(7)) is nowhere spoken. F2-01 and
  card §(8)'s application of it by name are satisfied.
- **The lesser concern is cured with it, and cured from the card's own sentence.** "Does not meet its wage in
  full" is the shortfall F4-04 licenses (short, late, thin — never none), and it is very nearly verbatim the
  card's own §(7) reading of the watch's grievance: "a town which can feed itself through a siege still does not
  meet its wage in full". The curer improved on it by dropping "siege" — sound, since `under_siege` occurs on
  **no town of this preimage** and a face turning on one would describe a town this key does not select.
- **Floor 2, the tense, checked independently:** "has decided", "has not said" are perfects. They run over the
  allocation, i.e. `defenseProfile.economicGates.*` — **writers 0, FROZEN** in card §(6) — and over
  `scores.economic`, the key's own read and also writers 0. Ruling 11b licenses the perfect twice over here. No
  perfect runs over `institutions` at any bucket grain (38 writers) or over `name` (201).
- **Floor 2, F2-04, checked:** no event is narrated. No crisis came, no harvest failed, no siege was survived. A
  decision INFERRED by a source from two standing facts is a reading, not an event with a date.
- **Floor 4, checked and cleared:** the shortfall is not split. One clause, one wage, one purse; no expense is
  paid while another is not, and no direction is set between the four gates (F4-03).
- **Floor 1, the source:** `[garrison]` is a conditional source (the garrison row stands on 51/102 towns, bucket
  present 286/337) and is projector-filtered by source under car 18c, so it seats where it can speak. The face
  asserts no body in its sentence; W-DEF2-ES-2 remains the seam and remains the engine's, not the writers'.
- **Floor 3 — clear.** "The garrison's account" is the body, never "the garrison commander" (a wartime and
  monster_pressure NPC) and never the Wealthiest Merchant trap this money pool walks toward.

---

## RECORDED, NOT CHARGED

**R-1 · The curer's "repeat checked and cleared" note is FALSE as reasoning; its conclusion survives anyway.**
`cure.md` clears the reused clause on the ground that "this face renders under spine 2 (`[street]`, the public's
granary), so no unit carries the clause twice". Spine 2 is the public's granary — and it is also
"…takes it that **a crisis would find the place ready**", which is the same proposition cure 2 puts in the
garrison's mouth as "a town which **can be fed through a crisis**". The unit therefore does carry the capability
twice: once as the town's perception and once inside the garrison's premise. It is not verbatim, the two do
different work (the second is a premise to a withheld conclusion, not a claim), and the face still reads well
after the spine — so this is a craft note for the chair and not a finding. But the check as written did not test
what it claimed to test, and the chair should not bank it.

**R-2 · A correction to my predecessor's ground for W-DEF2-ES-1 (the full-pay seam).** `refute.md` disposes of
the eleven towns where `economicGates.military` sits at 1.0 by saying "the denier is engine PROSE and a
generation-time projection, so the faces STAND". The display strings are prose — but **the gate itself is a
FIELD** (`defenseProfile.economicGates.military`, writers 0, FROZEN, card §(6)), and at the value 1.0, which the
key admits, `defenseGenerator.js:190` applies no reduction at all and `defenseDisplay.js:319-321` prints no
underfunded note. Read strictly, §V.0's quantifier ("at any value the keys admit") makes every flat shortfall
assertion on this pool a floor-1 finding on those eleven towns — the cured garrison face included, and about
twenty rows besides. I do not charge it, for a stated reason: **card §(8) is the chair's own measured
disposition on exactly this question** — "both fire, a face may deny neither, and therefore 'nothing here goes
unpaid' is as false as 'the wages come late': what is licensed is that the town CAN ABSORB and is STILL SHORT,
which is the whole of this pool's tension and its best material" — written by the marker who counted the 326 and
therefore knew the 11. Charging it would strike the pool's entire central material in the cure round on a
reading the card forecloses, and it would strike twenty rows this desk has already passed. It is a POOL-grain
(or chair-grain) question, not a property of either cured face, and it belongs in the wiring row with its ground
corrected. **The fingerprint that governs it, quoted per ruling 35: `economicGates.military` < 1 on 326 of 337,
minimum 0.87.**

**R-3 · "A town which…" on a preimage that is 235/337 not a town.** Both cured-round-adjacent rows that use the
classifying generic — V1 face 4 (`[register]`, uncured, passed) and the cured V2 face 8 — say "a town which…",
while the identity strip prints `City` on 115 and `Metropolis` on 120 of the 337 (`OverviewTab.jsx:247`, F1-31,
"never spell the band"). I do not charge it. ADDENDUM 18 ruling 12 hands every face the word in as many words
("the town is 'the town', 'here', 'the place', or implied"), all three spines and a third of the pool use it
deictically, and F1-31's target is spelling a DIFFERENT band than the strip prints, not the dossier's own
universal word for the place. But the deictic "the town" and the classifying "a town which…" are not the same
move, and if the chair wants the distinction ruled it is a corpus-grain ruling, not a cure-round FAIL.

---

## CRAFT — AT THE POOL GRAIN: **PASS**

**The fingerprint first (ruling 35).** The figures that moved this verdict: `economicGates.military` **< 1 on
326 of 337** towns (min 0.87) while `defenseDisplay.js:219-221` prints `Well-funded · "Full pay…"` on **337 of
337**, because its threshold (econScore ≥ 65) IS this key; storage **min 5 · median 7 · max 12** months, which
is what barred "full"; **militia 0/337 and the `muster` kind 0/337**, which is why no roll and no levy appears
anywhere in the pool; prosperity **Moderate-or-worse on 110 of 337**, which is why no face reads STRONG as rich.
The pool is written off its own measurement rather than off the label, and after the cure it still is.

**Speakers: eleven** — hall, watch, guilds, register, tavern, market, stranger, garrison, gate, court, plus the
archiver in a weighing, a lean and one observation, over three spine shapes (bare fact · the public's seeing ·
two sources joined). Far above the three-speaker floor, and each carries the interest the card prints for it:
the hall defends the purse it is asked for, the watch accuses it, the guilds claim the provision and disown the
shortfall, the register asks for the dead's share, the market sits between the hall and the trades, the court is
characterised by a question nobody brings it.

**Not DULL, and the cure did not move it toward DULL.** Nothing here is a camera without a speaker and nothing
reads as one sentence twelve times: there is a live dispute in two variants, two concealments in two different
shapes, one observed face, one physical particular (the stranger's grain and complaint), a withheld decision and
a withheld gift. It is plainly better than the shipped rows it replaces, which are three spines with no faces at
all and which the card convicts of four separate false clauses.

**THE COLLAPSE, NAMED (as the verdict requires, none of it fatal):**
1. **The axis is narrow and the cure narrowed one corner of it further.** Roughly two rows in three land on the
   wage against the granary. That is the card's own hook (§9) and it is the pool's best material, but it means a
   seeded draw of four faces in a variant can be four tellings of one grievance; V2 is tightest (faces 4, 7, 8
   and 9 all land on who is owed, and face 8 is now one of them with its volume word gone but its subject
   unchanged). My predecessor flagged this and the curer declined to spend a change on it to keep byte-identity —
   the right call for a cure round, and it leaves the spreading to the chair.
2. **V1's weighing no longer carries an opinion.** Trading the conjecture for the dispute form was lawful and
   necessary, but the pool now has one lean and no conjecture, and V1's pair closes on a procedural sentence.
   Ruling 22's three shapes are down to two across the pool.
3. **Spine 3 still repeats spine 1's clause** ("fed and supplied through a crisis", seven words) and the cure
   adds a third, softer instance inside V2 (R-1 above). Different shapes, same proposition, three times in a
   pool of three units.
4. **The coverage gap stands:** no `[public]` face in any variant, with the HELD line named in `draft.md`. The
   curer was right that placing one is an addition and not a cure. It is the chair's to place or to record as
   deliberate.

## WIRING (the face STANDS; the seam is the engine's, per the brief's disposition rule)

- **W-DEF2-ES-1 (carried forward, GROUND CORRECTED — see R-2).** On the 11 towns where `economicGates.military`
  is 1.0 the denier of every shortfall row is the FIELD and not only the display string; the disposition still
  holds on card §(8)'s measured licence, not on the prose/field distinction my predecessor gave. The chair
  should see it stated that way, because the two grounds fail in different places.
- **W-DEF2-ES-2 (carried forward, unchanged).** `threatAssessment.js:167` names garrison pay unconditionally on
  every town of this preimage while the garrison ROW stands on 51 of 102 towns; the card states the disposition
  itself ("the engine speaking past its own roster; it is not a licence"). The pool's four `[garrison]` faces are
  source-filtered and stand.
- **W-DEF2-ES-3 (carried forward, unchanged and still unverified by me).** The `weigh`, `observed` and
  `compromised` tokens are first of their kind and rest on the selector's reading of the dock's git log, which I
  did not re-check. If the premise is stale, cure 1's row is one of the five that go with it.

STATUS: COMPLETE.
