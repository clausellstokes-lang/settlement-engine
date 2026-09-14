# RE-REFUTE — DS-DEF-2 · `Beasts & Monsters: plagued, perimeter AND organized force`

Seat: opus (refuter, CURE round). Rows judged: the CURED rows, which are ALSO the rows in the
dock's working tree — `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2630-2665`
(read this sitting; byte-for-byte identical to the rows in `cure.md`). 3 spines + 32 faces =
35 renderings. Test: ADDENDUM 14/18 non-contradiction, the four floors as
`recut/CONTRADICTION-TABLE.md` §V.0 words them.

## THE VERDICT IN ONE LINE

**No FAIL. Craft: PASS.** The two floor-1 FAILs of the prior sitting are cured at the root and
not hedged; the **DULL** ruling's named collapse is gone on all four of its measured counts,
and the cure's own claims were re-measured on the file rather than believed. Two of the cure's
notes are CORRECTED below (one understates a residual by a factor of nearly three; one overstates
a card fact in the pool's favour), and one new WIRING row is recorded. Nothing on the page turns
on either correction.

---

## PART 1 — THE TWO CURED FAILS

### v2 f5 `[muster]` — **CURED, FAIL LIFTED**

> "The muster says whoever goes up is whoever the household could spare that day."

The denier of the landed face was `config.stressTypes` through the same-page producer
`generateSafetyProfile` — re-read at the source this sitting, `src/generators/safetyProfile.js:193-199`
(`hasStress('monster_pressure')` → *"Outlying areas are avoided. Night movement is restricted."*)
and `:99-108` (`hasStress('occupied')` → *"Movement is restricted and monitored … curfew and
checkpoint protocols."*). **Both citations hold verbatim.** The cured face makes no claim about
the town's policing of its own night at any stress value, so the denier no longer reaches it.

Re-tested on its own ground: `muster` seats only where the militia bucket resolves
(`faceSources.js:139` `if (forces.militia.present) out.add('muster')`, re-read), which is hamlet
and village, where the force row is `Citizen militia`. **V-09 clean** — no wage, no pay, no
arrears. **F2-01 clean** — "whoever the household could spare" is a selection, not a headcount.
**F2-02 clean** — "that day" is a distributive deictic, not a date or a duration. It does not deny
the `Citizen militia` row's own words (*"Organised community defense. Musters for raids and monster
incursions."*): a muster drawn from whoever a household can spare **is** that row. Positive landing.

### v2 f6 `[watch]` — **CURED, FAIL LIFTED**

> "One of the watch says the walk above the gate belongs to whoever stands it, and the round goes under it."

The landed face died on its own universal quantifier (*"whatever the country is doing"*) against
`safetyProfile.js:152` (*"Patrol patterns have changed"*), `:161` (*"Normal patrol patterns have been
abandoned"*), `:197` and `:213` — all four re-read this sitting and all four standing. **The cure
removes the quantifier entirely**, and with it the only thing that made the face unsaveable: a
bounded present habitual about who owns which ground survives every stress value the keys admit,
because none of the four strings says where a round runs, only that its pattern is not the normal one.

Re-tested: `watch` seats only on a resolved watch bucket (`faceSources.js:140`), i.e. town and city,
where the wall the "walk" belongs to is `Town walls` / `City walls and gates` and never a berm.
It denies neither of the `Town watch`'s required services — `Night patrol` (p 1) and `Gate duty`
(p 0.8), card §2b: a round that passes under the gate-walk **is** gate duty, not its denial. It does
not call the watch professional or soldiers (**F1-27** clean), and it does not put the watch on the
key's `force`, which on this block is garrison-or-militia. Positive landing, present tense.

---

## PART 2 — EVERY OTHER RENDERING (the pool was DULL, so all 35 are re-judged)

**All PASS.** Recorded below are only the calls that took work; the rest are clean on their face.

### The seating check, re-run at the source

`faceSources.js:126-146` re-read. `sourcesOf` filters the draw, so no body word in this pool rides
an unseated town. Confirmed this sitting, and one thing the prior sitting did not check:

- `hall` seats on `HALL_NAMES = ['town hall','city hall']` (`:82`), `guild` on `['craft guild']` (`:88`).
- ⚠ I tested whether **v1 f5 `[guild]`** — *"…before anybody in the hall decides how it is spent"* —
  asserts a hall on a town whose roster cannot carry one, since `Craft guilds (100-150+)` exists at
  metropolis (`institutionalCatalog.js`, metropolis block) and **no `town hall` / `city hall` row
  appears in the metropolis block at all** (its governance row is `Palace/government complex`).
  **IT DOES NOT, and the reason is a card correction:** a metropolis roster is built from
  `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`
  (`src/generators/steps/assembleInstitutions.js:243-245`, read this sitting), so every `required: true`
  CITY row — `City hall`, `Parish churches (10-30)`, `Garrison`, `Professional city watch`,
  `City walls and gates` — stands at metropolis too. **v1 f5 PASSES on all five tiers.**
  See WIRING **W-3**: the card's §2 (*"metropolis (1): Cemetery network"*) and §7 (*"metropolis has
  no required hall row"*, *"the register is OPEN at metropolis"*) read the metropolis block alone and
  therefore understate the tier. The error is in the SAFE direction — it only ever forbids the writer
  more than the roster does — so no face in this pool is charged on it and none needs re-cutting.

### The three closest lawfulness calls in the cure

- **v1 f7 `[register]` — PASS, and it is the closest call.** *"…the ground fills from the outlying
  work, where people are at their own labour and alone."* The cure's new clause asserts that people
  ARE at outlying labour, and `safetyProfile.js:197-198` can print *"Outlying areas are avoided"* on
  the same page under `monster_pressure`. **It is not a denial, and the required rows are why:**
  `Subsistence farming` and `Common grazing land` (hamlet), `Farmland` (village), `Access to external
  mill` (hamlet, *"Walk 2-5km"*) are `required: true` — the engine positively models outlying labour
  on the tiers where this face draws hardest. *Avoided* is a behaviour, not an emptying, and the face
  states the cause of the avoiding rather than its opposite. Contrast the landed v2 f5, which asserted
  the flat negation of a machine sentence. It also names the ACT and not the ground's placement, which
  card §2c requires.
- **v2 f3 `[stranger]` — PASS.** *"…looked him over and went on with their talk."* Under `occupied`
  (`:105`, *"curfew and checkpoint protocols"*) and `wartime` (`:199`, *"Strangers are viewed with
  heightened suspicion"*), the face **affirms** an inspection rather than denying one; "went on with
  their talk" is a manner, not the absence of a protocol. It is strictly safer than the landed face it
  replaces, which carried the denial (*"did not stop talking to each other while they did it"*).
- **v2 f8 `[hall]` — PASS.** *"The works come to the hall the way the water does."* I looked for the
  denying row and there is none: `Multiple water sources` (town) is *"Wells, fountains, or piped water"*
  and `Aqueduct or water system` (city) is *"Engineered water supply. Conduits, cisterns, fountains"*
  (`institutionalCatalog.js:1578`, `:2310`) — water that comes is the engine's own at both tiers, and
  at metropolis the city row carries over (W-3). The sentence asserts no past decision (the landed
  perfect is gone, **F2-04** clean) and names no ordering of what the one purse pays (**F4-02 / V-17**
  clean). ⚠ It is the pool's least legible sentence; see CRAFT.

### The rest, by floor

- **Floor 1, bodies.** Every body word rides a tag the projector seats: `garrison` never draws below
  town, `muster` only at hamlet and village, `watch` never below town (**F1-01 / V-23** clean),
  `elders` below town only, `hall` / `guild` / `market` / `court` / `tavern` / `register` / `gate` on
  their roster reads. No face contrasts the hall and the court as two bodies (**F1-29** as §V.2 corrects
  it); a variant renders ONE face, so v1 f4/f5 (hall) and v1 f9 (court) never co-render in any case.
  No charter hall, mercenary, prison, hospital or warehouse is asserted in either direction (**F1-25**).
  No tier or scale word anywhere (**F1-31 / V-03**), no wall material and no `{defmaterial}` spent
  (**V-06 / F1-32**), no material source (**F1-33**), no placement of a burial ground (card §2c).
  ⚠ `tavern` CAN seat at hamlet on the `Wayside inn` row (`INN_RE` at `faceSources.js:85`), so
  **v1 f6**'s *"come in off the walk"* can draw where the wall is *"Basic wooden palisade or earthwork
  berm"*. No row denies a standing place on a perimeter the key says is stood, and "the walk" is the
  card's own §9 vocabulary — **PASS**, recorded so the chair can see it was tested.
- **Floor 2.** No digit, no date, no duration, no rate, no trend, no founding, no age — **measured on
  the file, not recalled** (scan below). Duratives used — *has seen*, *has never been asked*, *looked
  well kept*, *were standing*, *have gone home* — run over the key's own reads (walls, garrison,
  militia), over `config.monsterThreat` (FROZEN, zero writers) or over
  `defenseProfile.economicGates.military` (FROZEN, card §6), all licensed by §V.0 floor 2b. Nothing
  carries a durative over `institutions[bucket=watch]`, `[bucket=charter]`, `[bucket=mercenary]` or the
  root `institutions`, LIVE at 38 writers. v3 f1's *"as readily as"* is a comparison of manner, not a
  rate (**F2-06** does not reach it). v2 f5's *"could spare that day"* is a distributive, not a span.
- **Floor 3.** No minted name. Every acting person is plural, indefinite or a trade: *a carter*,
  *a guild factor*, *a clerk in the hall*, *Stallholders*, *Those who hold the way through*,
  *Whoever buries the dead*, *One of the watch*, *One of the garrison*, *The elders*, *A traveller*.
  None is the tier's singular named office (`Mayor` · `Guard Captain` · `High Priest` · `Governor` ·
  `City Watch Chief` · `Wealthiest Merchant` · `Guild Archmage`, plus the stress roles) — **F3-06**
  clean. No deity anywhere. No cultural furniture the eleven profiles deny (**F3-05**).
- **Floor 4.** The one military purse is affirmed and never split — v3 f4 states it outright, and no
  face pays the wall and not the muster (**F4-02 / V-17**). No gate direction split (**F4-03**), no
  total collapse of pay (**F4-04**), no decay clock and no permanence on the fabric (**F4-01**), no
  readiness band explained by the works (**F4-06**), `plagued` read as monsters throughout and never as
  disease (**F4-05**). No covert fact on any player face, and card §2c marks this pool on none —
  **correctly, no `compromised` candidate is offered** (ruling 26) and **no `[public]` or
  `[archiver · observed]` candidate is rowed** while cars 18m/18n are unlanded. **No `dm-only` face is
  rowed at all**, so ruling 17's inverted test has nothing to judge here — which is right: with no
  covert field there is nothing for a note to point toward.
- **THE SIBLING RUNGS (ruling 35).** Card §2d: `heartland` → *settled, defenses beyond the need*;
  `frontier` → *frontier, credible deterrence*; `force = false` → *perimeter but NO force to hold it*.
  **No face reads as a neighbouring rung.** The two that carry the most weight in the cure both land on
  THIS rung: v3 f1's *"people here name what is in the country as readily as they name their own work"*
  is a `plagued` sentence and would be false on `settled`; every face that puts a person on the line
  affirms `force = true` against the NO-force sibling. Nothing here says the country is quiet or that
  nobody stands.
- **THE SIBLING-SENTENCE TRAP (card §8, this pool's own).** No face says the town is losing, overrun,
  breaking or cannot hold — against `threatAssessment.js:54` *"survivable posture"* / `:59` *"viable but
  demanding"*. And no face says the town is secure or equal to it — against `:59` *"Simultaneous
  incursions will break coverage"*. **v3 f5** (*"the choosing is done on any night two things come at
  once"*) sits exactly on `:59`'s own sentence and is the pool's best use of it. Clean in both directions.

### The pairs and the spines

- **pair 1** (v1 f4 hall / v1 f5 guild), **pair 3** (v2 f1 gate / v2 f2 tavern), **pair 6** (v3 f4 hall /
  v3 f5 garrison): each is two DIFFERENT sources, and each genuinely disagrees — who funds the purse ·
  what actually comes to the bar late · whether the town is ever asked to choose. **No `disagree` that
  agrees.** No craft finding at the pool on the pairs.
- **Three spines, three shapes** (ruling 29): bare archiver's hand · the public · an attributed account
  with the attribution last. `{settlement}` in ONE unit (spine 1) and in no `[face]` sub-row —
  **ruling 12 clean, measured.** No self-citation anywhere (ruling 40): the instrument's own
  `SELF_CITE` ratchet reports **0**.
- **THE SPINE-3 ECHO IS GONE.** The landed spine 3 and its face 1 carried the same thought twice (the
  who-holds-it frame and the elsewhere landing). v3 f1 is rewritten onto the interest the stranger alone
  is seated for, and no phrase of spine 3 now appears in any face of variant 3. Verified by reading
  all twelve renderings of the variant together.

---

## PART 3 — CRAFT, AT THE POOL GRAIN: **PASS**

### The ruling-35 fingerprint, read BEFORE the vote (`rewrite/measure-block.py`, run this sitting)

| measure | landed `507ff2637` | **cured (tree)** | block median |
|---|---|---|---|
| rationed pet words | 1.24/100w (10) | **0.38/100w (3)** | 1.26/100w |
| sensory nouns | 0.75/100w (6) | **1.01/100w (8)** | 1.55/100w |
| attributions / sentence | 0.784 (29) | **0.703 (26)** | 0.623 |
| same-opener (first word, adjacent) | 0.088 (3) | **0.118 (4)** | 0.167 |
| words / sentence | 21.78 ±5.01 | **21.35 ±5.03** | 20.51 |
| self-citations · forecasts | 0 · 0 | **0 · 0** | 0 · 1 |

**THE FIGURE THAT MOVED ME: the rationed pet words fell from 10 hits to 3 — 1.24 → 0.38 per hundred
words against a block median of 1.26, the second-lowest rate of any rewritten pool in DS-DEF-2.** The
ration's `(nobody|no one|nothing)` and `whatever` limbs are precisely the ones the negated-landing habit
was built out of, and the instrument — which knows nothing of the chair's one-third rule — registers
their removal independently of my own count.

### The named collapse, re-measured on the file

**NEGATED LANDINGS: 20 of 32 → 6 of 32 (19%), against a bar of 10.** Confirmed mechanically on the
extracted rows, both conventions: 6 with the trailing attribution stripped and 6 without, so the figure
does not turn on the counting rule. Per variant: v1 **2 of 11** (f1, f11) · v2 **1 of 10** (f2) ·
v3 **3 of 11** (f4, f7, f9). The cure reports 5 by its own reading and 6 by the crude scan, and the
difference is v3 f7, where the negation sits inside the subject (*"the parts it does not cover"*) and the
landing itself is positive — **I count it as negated and the figure is still 6, four under the bar.**
The five faces kept negated are the five the prior sitting singled out as the pool's best lines.

The other three counts, all re-measured, all confirmed:
- **`the line`: 13 of 35 → 9 of 35 renderings.** v1 f7 and v1 f8 are both off it, so the sibling
  landing-noun collision is gone.
- **No duplicate three-word opener inside any variant** (v1, v2, v3 all clean).
- **Landing nouns distinct inside every variant** once a trailing attribution is stripped, with the one
  exception (v3 f4 / v3 f7, both closing on *them*) that the landed rows already carried.

### ⚠ TWO CORRECTIONS TO THE CURE'S OWN NOTES

1. **THE ATTRIBUTION-VERB RUN IS MUCH LONGER THAN THE CURE REPORTS.** The packet says *"runs of three
   `says` in sequence remain inside each variant"*. Measured on the file, the runs are **eight (v1 f1–f8),
   six (v2 f1–f6) and six (v3 f1–f6)** — *"Those who hold the way through say"* is a `say` frame, and
   counting it as one is what moves v1 from three to eight. 26 of 32 faces carry a `say`/`says` frame.
   **This does not make the pool DULL** — the frame is mandated by the voice law (every face reports a
   source), the verb is fenced by ruling 20's bar on the mannered synonym, the veto belongs to the
   SELECTOR and not to a refuter, and the instrument puts this pool's attribution density 16th of the 21
   rewritten pools in the block, inside the pack and not an outlier. But the escalation the cure sends
   to the chair should carry the true number, because the supply fix it asks for (the writer's brief
   asking by rate for attribution-last, attribution-embedded and object-fronted frames) is sized by it.
2. **THE CURE INTRODUCED TWO SAME-OPENER ADJACENCIES WHILE FIXING THE THREE-WORD COLLISION.** The
   fingerprint's first-word measure rises 3 → 4. The two new ones are the cure's own: **v2 f4** moved to
   attribution-last, so it now opens *"The burials…"* beside v2 f5's *"The muster…"*; and **v3 f5**
   re-framed with the attribution embedded, so it now opens *"The choosing…"* beside v3 f6's *"The
   goods…"*. Neither breaches the chair's rule (which is three words, and all three-word openers are
   distinct), and at 0.118 the pool still sits below the block median of 0.167 — **recorded, not charged.**

### Why PASS and not DULL

Twelve distinct speakers (court · elders · garrison · gate · guild · hall · market · muster · register ·
stranger · tavern · watch), three spines in three shapes, three true pairs with a real dispute in each,
genuine stakes on BOTH halves of the preimage (the wage and the purse on the garrison half, the day the
field does not get back on the militia half), and a pool far richer than the three flat shipped spines it
replaces. None of the DULL triggers is present: not one construction repeated at the sentence grain, not
the same few nouns, not permutations, not fewer than three speakers, not a camera with no speaker, not a
pool with nothing in dispute. **The one collapse the pool was refused on is measurably gone, and the cure
paid for it in the right currency — it turned thirteen faces to say what IS done and kept the landing
noun, rather than trimming or hedging.**

Two residues stay on the record and neither is a collapse: the attribution frame (correction 1, the
selector's and the brief's) and the **sensory rate at 1.01/100w against a block median of 1.55** — which
is this pool's law rather than an unspent ration, since no material, no scale, no placement, no record,
no count and no tier word may be written here. ⚠ And one sentence is the pool's weakest as prose rather
than as law: **v2 f8**, *"The works come to the hall the way the water does"*, whose simile a game master
scanning at a glance will read twice. It is lawful and I do not refuse it; if the chair wants one more
turn of the handle, that is the face to spend it on.

---

## WIRING

- **W-1 · THE PROVENANCE LIMB IS CLEARED — CONFIRMED AT THE REGEX, NOT INFERRED.** The prior sitting
  recorded all three `[elders]` faces opening *"The elders say"* against
  `src/domain/prose/moveGrammar.js:225`, whose PROVENANCE alternation literally contains
  `the elders (?:say|hold|remember|keep)` — the same limb as *"from the road"*. I extracted the live
  alternation out of the product source and ran it over all 35 cured renderings: **zero matches.**
  *"The elders have it that"* and *"the elders have it"* escape it (`have` is not on the limb's verb
  list), and no other frame in the pool matches — I also checked *"by the court's own account"*,
  *"A guild factor holds that"*, *"One of the watch holds"*, *"the muster says"*, *"whoever buries the
  dead says"* and *"at the tavern they say"*. **The pool's citation ceiling is ZERO and nothing spends
  it**: no muster roll, no toll book, no accounts, no parish register-as-a-record, no *from the road*.
  The three faces' CONTENT is unchanged. W-1 is discharged.
- **W-2 · `threatAssessment.js:59` hardcodes "Palisade and citizen militia"** on a branch that fires for
  any walls row, while this key reads the LIVE roster. Card §8 W-09 already rules it a wiring row; no
  face in this pool rides the collision. Recorded for completeness, unchanged from the prior sitting.
- **W-3 · NEW — THE CARD UNDERSTATES THE METROPOLIS TIER.** `assembleInstitutions.js:243-245` builds a
  metropolis roster by merging the CITY catalog with the metropolis one, so every `required: true` city
  row stands at metropolis: `City hall`, `Parish churches (10-30)`, `Burial grounds and charnel house`,
  `Garrison`, `Professional city watch`, `City walls and gates`, `Daily markets`, `Multiple courthouses`.
  The card's §2 lists metropolis as carrying ONE required row, and §7 tells the writer the hall is unseated
  and the register OPEN there. **The error is in the safe direction — it forbids more than the roster does —
  so no face is charged and nothing needs re-cutting.** The next card the instrument prints for a
  metropolis-bearing preimage should merge the two blocks, or a writer will be fenced off material the
  roster actually carries.

## THE MECHANICAL SCAN, RUN ON THE FILE

Zero digits · zero em dashes · zero en dashes · zero exclamation marks · zero semicolons · zero
contractions in any spine or face. One `{settlement}`, in spine 1, in no `[face]` sub-row. Every unit
is one or two sentences; none is three. No self-citation (`the survey`, `this office`, `the record has`,
`entered as`, `set down here`): the instrument's ratchet reports 0. No forecast (`will` / `shall`): the
instrument reports 0; the one forward-looking clause is a conditional (*would find out*). Zero PROVENANCE
matches. Three INSTITUTION-move matches (v1 f5 *hall decides*, v2 f7 *guild factor holds*, v3 f7 *watch
holds*) and one HISTORY-move match (v3 f10 *after the*) — **all four were in the landed rows and none is
the cure's doing**, so no move budget moves at this head. Face order, seating and pair marks identical to
`speakers.md` and to `507ff2637`: no face added, dropped, re-seated or moved.
