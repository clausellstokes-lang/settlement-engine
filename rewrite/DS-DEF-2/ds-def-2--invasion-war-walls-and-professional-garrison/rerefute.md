# RE-REFUTE — DS-DEF-2 · pool `Invasion & War: walls AND professional garrison` · RE-REFUTER (Seat: Opus 5)

<!-- STATUS: COMPLETE (2026-09-13). Instruments read: card.md §1-§4, §6, §9 (and §2b/§2b'/§2c/§2d whole),
speakers.md, draft.md, refute.md, cure.md whole; and, read-only in the dock, faceSources.js,
stateProseKernel.js:490-530/:720-750, institutionalCatalog.js, assembleInstitutions.js:110-275,
defenseGenerator.js (the upkeep gate), institutionServices.js, cultureProfiles.js.
Nothing was entered, edited, committed or tested in any dock; every execution below ran from the
scratchpad against absolute file paths, and `git show` was run with `-C` rather than by entering the tree.
THE TEST: a face is lawful UNLESS it contradicts the record. Silence is permission. "The card does not
license it" names no fault. A FAIL names the face quoted, the field/row/label/machine sentence that
denies it with file and line, and which of the two is the record. -->

## THE COUNT

**1 cured face · 1 PASS · 0 FAIL · 0 WITHHELD.** CRAFT at the pool grain: **PASS**, **10 speakers**.
The cure is accepted. Two new WIRING rows for the chair, neither a finding against the writer or the curer.

## WHAT WAS ACTUALLY CHANGED (verified before judging it)

EXECUTED diff of the nineteen row lines in `cure.md` against `draft.md`: **eighteen byte-identical, one
changed line.** The curer's count is CONFIRMED, not taken on trust. The changed line is variant 2 face 5:

- draft: `` `[elders]` `` One of the elders says the town has never been asked whether it wants soldiers, only what they cost.
- cure:  `` `[tavern]` `` At the tavern they say the town has never been asked whether it wants soldiers, only what they cost.

The claim clause is carried across verbatim; only the attribution frame moved. So exactly one face is
before me, and the pool-grain craft verdict is re-taken because the pool's speaker set changed.

## THE CURED FACE — v2.f5 `[tavern]` · **PASS**

> "the town has never been asked whether it wants soldiers, only what they cost"

### THE MOUTH — the finding's own ground, re-executed from the code rather than from the cure's word

EXECUTED (`sourcesOf` imported from `src/domain/display/stateProse/faceSources.js`, run over a settlement
built from the catalogue's own `required: true` rows at each preimage tier, with the key's walls and
garrison rows added):

| tier | sourcesOf | `tavern` | `elders` |
|---|---|---|---|
| town | court gate guild hall market public register stranger tavern watch | **true** | false |
| city | court garrison gate hall market public register stranger tavern watch | **true** | false |
| metropolis (merged catalogue) | court garrison gate hall market public register stranger tavern watch | **true** | false |

The seat holds at all three tiers, so the cured face draws on all 306 preimage towns and variant 2 ships
five faces again. Three things were checked rather than assumed:

1. `tavern` is in the CLOSED vocabulary — `stateProseKernel.js:498-502` `FACE_SOURCES` lists it fourth.
   `eligibleFaces` (`:743`) admits a face whose source is in the town's roster set, so seating is the
   whole of the question.
2. The seat is `sourcesOfRowName` (`faceSources.js:166`): `TAVERN_NAMES = ['tavern','alehouse']` or
   `INN_RE = /\binns?\b/`, over `nativeSemanticName` of the LIVE roster. The preimage's required rows
   match it at every tier — `Taverns (5-20)` and `Inn (multiple)` at town, `Inns and taverns (district)`
   at city.
3. **The metropolis leg does not hold the way the card says it does, and it does hold the way the cure
   says it does.** `institutionalCatalog.metropolis` read on its own carries 26 rows, ONE of them
   required (`Cemetery network`), and no tavern or inn row at all — so a metropolis built from the card's
   §2 would seat no tavern. The generator does not build it that way: `assembleInstitutions.js:244`
   draws a metropolis from `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`,
   and EXECUTING that merge yields **14 required rows at metropolis**, `Inns and taverns (district)` among
   them. CONFIRMED. The cure's claim is right; the card's §2 is what is wrong, and that is WIRING row 6.

The refused mouth stays refused, re-read here: `ELDER_TIERS = Object.freeze(['thorp','hamlet','village'])`
(`faceSources.js:81`) and `if (ELDER_TIERS.includes(tier)) out.add('elders')` (`:133`) — the only seat of
`elders` anywhere, gated on tier alone. The card's §7 `Town council` seat is the elders HOLDER kind, a
different mechanism. The original finding was correct and the cure answers it at its own grain.

### THE FOUR FLOORS, TAKEN AGAIN ON THE NEW SENTENCE

**FLOOR 1 — no denier found, and I looked for one.** The face asserts the key's own reads (the town has
soldiers; they cost it money) and denies no body. Tested against the closed rosters and the required rows:

- Nothing is inferred into the key's silence. No body, building, record-keeper, force or faith-house is
  named at all — the subject is "they", the tavern's people, and the object is a thing that did NOT happen.
- The nearest thing to a denier on the required list is `Market square -> Civic announcements` (p 0.8,
  card §2b: "Official proclamations, wanted notices, and public notices read in the square"). That is the
  town being TOLD, one way. The face's complaint is precisely that it is one way. Consonant, not denied.
- `Town hall` carries Permit applications / Tax payment / Dispute arbitration; `City hall` carries Civic
  licensing / Appeals court (card §2b). None of the five is a consultation of the town.
- The one row in the whole catalogue that could look like a denier is the optional city Government row
  `Democratic assembly` (`institutionServices.js:891-894`), whose desc variant reads that citizens
  "argue and decide the major ordinances". I do NOT charge it, and the reason is on the record rather
  than waved at: (a) it is not required at any preimage tier, so it is on no town by construction;
  (b) its only at-or-above-the-bar service is `Petitions` (on, p 0.8) — citizens asking the assembly,
  the opposite direction from the assembly asking the town — while `Public debate` is `on: false`;
  (c) its own franchise is "those entitled to vote", which is not "the town"; and (d) the face is an
  ATTRIBUTED complaint, and a source's opinion on a field the engine does not carry is never a finding.
- The face is not an observation and not a `[public]` face, so §2b′'s observer list does not bind it.

**FLOOR 2 — magnitude and tense: clear, and clear twice over.** "has never been asked" is a perfect
negative. It runs over no live field at all — the engine records no consent, no decision procedure and no
asking, so there is no elapsed course over anything. Its one presupposition (the soldiers exist) is
`institutions[bucket=garrison]`, which is THE POOL KEY'S OWN READ (card §1, "the key FIXES: walls=true ·
garrison=true"), and floor 2's carve-out licenses the perfect and the durative there by name. The brief's
own worked example is this exact shape — "nobody has been asked to stand on the works". No digit, no band
word misused, no date, no rate, no event the record did not run. "only what they cost" names no sum: it
says what the talk is about, not what the figure is.

**FLOOR 3 — scope: clear.** No named character and no fate. No deity. "they" is plural and unnamed, and
it is not the tier's singular named office (no Guard Captain, no Mayor). Setting-agnostic: EXECUTED grep
over `src/data/cultureProfiles.js` returns **zero** occurrences of tavern, alehouse or inn — no profile
carries a predicate about drinking houses either way, and the tavern is a required catalogue row on all
eleven. The word is the engine's own.

**FLOOR 4 — the engine's model: asserted, not denied, and this is the face's strongest leg.**
`defenseGenerator.js` prints the model in its own comment — "Economic-upkeep gate (garrison wages, wall
maintenance)" — ONE multiplier over both halves, and in the next lines "built walls keep standing and
**unpaid soldiers desert slowly**" with "the community baseline (armed households, terrain alarm) is
**unpaid and exempt**". The engine therefore positively models this rung's soldiers as PAID, which is
what the face's "what they cost" says. No purse is split, no direction is given to the gates, no decay
clock, no permanence, no covert fact. `[tavern]` is not in the card's §2c compromisable table (hall,
watch, court) and carries no `compromised` tag, so the inverted test does not apply.

**RULING 35, the neighbouring rung — checked, and the face passes on the strong limb.** The sibling is
`walls with citizen militia` (card §2d). The cured face cannot sit there: a citizen militia IS the town's
own people turned out, and the engine's own words make it the unpaid community baseline and "volunteers
with day jobs, not soldiers" (`safetyProfile.js:472`). "The town has never been asked whether it wants
soldiers, only what they cost" is incoherent on a town whose force is its own unpaid people. This face is
one of the few in the pool that is rung-specific in both halves, which is why losing it would have cost
the pool more than the curer claimed.

**THE TELLS AND THE MECHANICS.** EXECUTED over the eighteen unit texts with tags and comments stripped:
0 em dashes · 0 exclamation marks · 0 digits · 0 semicolons · 0 question marks · 0 contractions (the only
apostrophes in the pool are `soldiers'`, `sexton's`, `town's`) · 0 self-citations · `{settlement}` in one
unit (spine 1) and in no face. The cured face is ONE sentence. Its close class measures `plain` — no
which-tail, no summary, no antithesis, no reassurance, no hanging question. "At the tavern they say" is
not merely permitted: it is one of the two idioms the gate's own instrument recognises as an attribution
frame (`measure-block.py` `IDIOM_RE`), and ruling 20 prints it in its list of the plainest attributions.

**THE VERB VETO.** V2's attribution verbs in row order are say · says · holds · says · say. Longest run
of one lemma is two. The veto (three running) is not approached, and the cured face did not change this
because the face it replaced also carried a say verb.

**NO SOURCE SPEAKS TWICE IN ONE VARIANT.** V1 guild · market · tavern · hall · gate; V2 gate · hall ·
court · stranger · tavern; V3 stranger · tavern · register · garrison · watch. The cured face is untagged
by pair, and the three pairs (V1 pair 1 `view`, V2 pair 1 `disagree`, V3 pair 3 `view`) are untouched.

## THE CURER'S OWN RECORDED CALL — REVIEWED, NOT OVERTURNED

The curer took the tavern over the market and recorded the cost: the tavern now speaks three times where
every other twice-heard source speaks twice, and the pool falls from eleven distinct sources to ten. I
agree with the call and the reasoning, and I add the measurement the curer argued from, EXECUTED on the
gate's own instrument (`measure-block.py` `pool_fingerprint`), draft against cure:

| measure | draft | cured |
|---|---|---|
| units / sentences / words | 18 / 21 / 417 | 18 / 21 / **417** |
| words per sentence, mean / sd | 19.9 / 4.17 | 19.9 / 4.17 |
| opener classes | subject 16 · place 2 | subject 15 · **place 3** |
| sameOpenerRate | 0.059 (1 hit) | 0.059 (1 hit) |
| close classes | plain 18 | plain 18 |
| attributions per sentence (loose / strict) | 0.619 / 0.619 | 0.619 / 0.619 |
| pet words per 100 words | 2.16 | 2.16 |
| sensory nouns per 100 words | 4.08 (17 hits) | 4.08 (17 hits) |
| open share / self-citations / forecasts | 0.0 / 0 / 0 | 0.0 / 0 / 0 |

The cure is **word-count neutral** — 417 words before and after — and moves exactly one measure: the
opener histogram, subject 16/place 2 to subject 15/place 3. The curer's second ground ("it breaks V2's
opener run at zero cost") is CONFIRMED by the instrument rather than asserted. Nothing regressed.

On the symmetry question the curer flagged for veto (ruling 19): I read it the same way. Ruling 19's
symmetry is about the ATTRIBUTION — no warmer verb, no more room — and "At the tavern they say" is the
flattest frame on the brief's own list, in one sentence, with no more room than any sibling. A third
appearance of a source is a count, not a warmth. I do not charge it, and the chair has the curer's
one-line market swap if it reads the count otherwise.

The `[public]` promotion the curer deferred to car 18n is the better home for this grievance and I say so
again: `UNIVERSAL_SOURCES` (`stateProseKernel.js:517`) seats `public` on every town by construction, and
the claim is the town's own account of its own history with no power's stake in it. Deferred and recorded,
not dropped.

## CRAFT — POOL GRAIN: **PASS** · 10 speakers

Ruling 35 honoured: the fingerprint above was read before the vote, and **the figure that moved me is the
sensory-noun histogram — 17 hits, of which 15 are the single word `gate`** (the other two are one `stall`
and one false positive, "well founded"). Beside it: `gate` occurs in **11 of the 18 units**, and the word
`wall` occurs in **none**. The pool's key fixes walls and a paid garrison, and the walls reach the reader
only as their own till.

That is a real concentration and it is the reason I state the verdict with its risk rather than without.
It does not tip to DULL, and here is why, against the named collapses one at a time:

- **One construction repeated** — no. Close classes are 18 of 18 `plain`, which is the archiver's
  restraint rather than a mould; the attribution frames run guild factor · stallholders · at the tavern ·
  a clerk · the people on the gate · the men on the gate · a clerk · the court holds · a pedlar · at the
  tavern they · a traveller · at the tavern a woman · the sexton's view · the soldiers · one of the watch.
- **The same few nouns** — the concrete plane is one noun, but the vocabulary is not: **152 distinct words
  in 417**, 127 content types over 227 content tokens, a content ratio of **0.559**.
- **Permutations** — no. Fifteen faces, fifteen distinct claims. The closest cousins, V1 gate and V2 gate,
  differ in what they claim (a disclaimer of custody against a claim of custody).
- **Fewer than three speakers** — no. Ten.
- **Duller than the shipped rows** — decisively not, and I read them rather than inferring.
  `git show f2da5a3ee` gives three abstract spines, no faces, no speaker, no stake, `{settlement}` in every
  one, a semicolon and a which-clause closer in row 1, and row 1 a near-paraphrase of the machine sentence
  at `threatAssessment.js:115`. Row 3 is unfalsifiable by construction.
- **No stake** — the opposite. The guilds pay twice, the hall defends the purse, the gate disclaims what
  happens after, the court will hear a stranger, the pedlar was searched, the tavern drinks beside the men
  it resents paying for, the soldiers feel wanted only after dark, the watch is two duties counted as one,
  the sexton keeps ground ready while saying it will not be needed.

The cure slightly improves the opener spread and slightly narrows the speaker set; neither moves the
verdict. **The collapse to name for the chair, if a later round opens slots: spend them on the WALLS and
on something seen that is not the gate** — fifteen faces put two things in front of the eye (the opened
pack, the long table), and the card's own §7 is half the cause, since it makes a circuit an invention on
the town slice of the preimage.

## WIRING — for the chair, not findings against the writer or the curer

The first four rows are the previous refuter's and I confirm all four still stand untouched by this cure
(the card's §7 elders seat; the brief's "four faces per variant" against the gate's real pin of 15 at
`generate-dossier-state-prose.mjs:744`; the garrison/watch one-row seam at a ruined city; the register's
universal body with a non-universal book). Two are new and both were turned up by re-executing the cure's
own claims:

5. **THE CARD UNDERSTATES THE METROPOLIS ROSTER BY THIRTEEN REQUIRED ROWS, AND THE ERROR CUTS BOTH WAYS.**
   Card §2 prints "metropolis (1): Cemetery network". The generator builds a metropolis from
   `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`
   (`src/generators/steps/assembleInstitutions.js:244`). EXECUTED: that merge carries **14** required rows,
   including `City walls and gates`, `Professional city watch`, `Garrison`, `City hall`, `Multiple
   courthouses`, `Parish churches (10-30)`, `Inns and taverns (district)` and `City granaries`. A refuter
   reading the card alone would believe a metropolis is required to hold nothing but a cemetery — which
   both invents floor-1 findings (charging a face for "inferring" a hall that is in fact required) and
   hides real ones (a face denying the professional city watch at metropolis). This cure's metropolis seat
   is only sound BECAUSE of the merge, and the card does not print it. Same family as row 1: the card
   reports a mechanism that is not the one the product runs.

6. **A `required: true` ROW IS A SEAT ONLY WHILE IT IS UNRUINED, AND NO PACKET SAYS SO.** `sourcesOf`
   reads `liveInstitutions`, the ruin-filtered roster (`faceSources.js:134`), while card §2/§2b speak of
   required rows as though they were unconditional. On a town whose tavern row has been ruined by a
   calamity the cured face is simply not drawn and variant 2 ships four faces there — no fault, and the
   same exposure every roster-seated face in the corpus carries. It is recorded because the cure's headline
   ("five faces on all 306 towns") is true of the generation roster and not of every later year, and the
   chair should know which of the two the claim is about. This is the card §3 SEAM row read from the
   seating side; it is not a contradiction, and per the brief the face STANDS.

## WHAT I DID NOT CHARGE, AND WHY

- **The three `At the tavern` openers.** Units 4, 12 and 15 open on the identical two words. They sit one
  per variant, and a town renders ONE variant, so no reader ever meets two of them. The instrument agrees:
  `sameOpenerRate` is 0.059 with a single hit, unchanged by the cure. A craft note, not a finding.
- **The tavern profiting from the soldiers (V1 f3) against the tavern resenting their cost (V2 f5).**
  Different variants, never co-rendered, so floor 1's page unit is never violated; and read together they
  are a human tension rather than a contradiction. It is the better reading of the pool, not a defect.
- **The `Democratic assembly` row**, for the four reasons set out under floor 1.
- **Ruling 35's first limb over the eight levy faces.** The previous refuter declined to charge these and
  was right: the first limb is the same-claim-set contract, which the sitting STRUCK by name. Charging
  them would be reapplying a struck bar. Recorded as craft above, where it belongs.
- **The long table (V3 f2)** and the gate-noun concentration — both against faces that PASSED, neither a
  named target, and the curer's refusal to spend a cure on them is correct procedure.
