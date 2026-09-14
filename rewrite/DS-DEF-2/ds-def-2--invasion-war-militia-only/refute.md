# REFUTE (seat: opus) — block DS-DEF-2 · pool `Invasion & War: militia only`

Rows judged: 3 spines + 16 faces = 19 units, read against card.md whole, CONTRADICTION-TABLE.md
§V and the "WHAT IS NO LONGER A FINDING" header, and the shipped rows at `f2da5a3ee`.

SITTING 2 (this pass). A complete refute.md already stood from sitting 1. Under the checkpoint
law I continued from it and did NOT bank it on trust: every load-bearing code citation was
RE-EXECUTED against the dock. Five of its citations were confirmed, TWO WERE WRONG, and one
whole class of check it never ran turned up a new WIRING row. The per-face verdicts survive
unchanged; the grounds under three of them do not.

TEST APPLIED: a face is lawful unless it CONTRADICTS. Silence is permission. "The card does not
license it" is not a finding. Four candidate findings were hunted and WITHDRAWN after measuring
the ground; they are recorded so they are not re-found.

## WHAT I RE-EXECUTED (sitting 1 reasoned; this pass ran it)

| claim | result |
|---|---|
| `institutionVocabulary.js` `Citizen militia` = "Part-time soldiers with their own tools and no pay" | CONFIRMED verbatim |
| `threatAssessment.js:123` "Armed citizens who know their ground … No counter to a disciplined military force." | CONFIRMED verbatim |
| `institutionalCatalog.js:881-887` `Veteran's lodge` desc carries "**Informal security**" | CONFIRMED verbatim |
| `institutionalCatalog.js:837-844` village `Adventurers' charter hall` carries "**emergency armed response**"; `:325-332` hamlet row carries "coordinates local defense" | CONFIRMED verbatim, BOTH tiers |
| `threatAssessment.js:64` charter branch "No perimeter, but the charter hall provides specialist response for coordinated threats." | CONFIRMED verbatim |
| `governanceNarrative.js:101-110` `deriveCouncilLabel` → **'the village elders'**, `SMALL_SETTLEMENT_TIERS` (`:15`) = thorp·hamlet·village | CONFIRMED — the word is the engine's own on the WHOLE preimage |
| `npcGenerator.js` `TIER_MANDATORY_ROLES` hamlet `['Elder','Parish Priest']` · village `['Mayor','Guard Captain']` | CONFIRMED |
| sitting 1's `generalStateProse.js:966` road else-arm | **WRONG LINE.** The map is `:896-901` and the else-arm is **`:974`** `ORIGIN_POOL_OF_ROUTE[text(tradeRouteAccess)] \|\| 'road'`. The substance holds and is WIDER than sitting 1 saw (WIRING 1) |
| sitting 1's `safetyProfile.js:463` "no gates to bribe and no checkpoints to avoid" as ground | **DEAD CITATION.** That string is inside `if (inst.hasSmuggling)` (`:460`) and `hasSmuggling` is **0/27** here. It never fires on this pool. The verdict stands on other ground; the CARD cites it twice (WIRING 3) |
| the move-grammar detectors over all 19 rows and the 3 shipped rows | RUN — one hit, new (WIRING 4). Sitting 1 never ran this class |

## PER-FACE

| variant | face | verdict | floor | field / row / machine sentence | quote (<=12w) | finding | cure |
|---|---|---|---|---|---|---|---|
| 1 | 0 (spine, ledger) | PASS | — | key fixes walls=false, garrison=false; `institutionVocabulary.js` `Citizen militia` "their own tools and no pay"; `threatAssessment.js:123` fires 27/27 | "No wall stands at {settlement} and no soldier of the town's own." | Every clause key-fixed or the engine's own words. The pool's ONE `{settlement}` sits here and in no face (ruling 12). "No wall stands" is a present absence, not F4-01's fallen wall. | — |
| 1 | 1 | PASS | — | `institutionVocabulary.js` `Citizen militia`; card §9 "a man's own spear and his own billhook" | "he brings the tool he works with" | The card's own particular. No pay, no armoury, no issued arms (V-09 clean). | — |
| 1 | 2 | PASS | — | `hasMarket` 14/27 — conditional source, seated by the draw's filter (car 18c) | "the stalls stand half-tended" | "half-tended" TESTED against F2-01 as a share. It is a degree adverbial on the verb, and no read bands how well a stall is tended, so there is no modelled magnitude to be outside of; the face's own next clause forces the manner reading (the chair's general form). The closest floor-2 call in the pool, and not chargeable. | — |
| 1 | 3 | PASS | — | `config.tradeRouteAccess` [CONFIG, FROZEN] vs F1-102 | "A drover says nobody meets the road here" | WITHDRAWN, and the ground is wider than sitting 1 found. F1-102's OWN ground line says `road` is the ELSE-ARM; EXECUTED, the map (`generalStateProse.js:896-901`) holds only crossroads·river·port·isolated, so `none` (4) AND `mountain_pass` (3) both render under the engine's own **road** arm. Only 4 of 27 are truly `isolated`, and `isolated` denies a trade ROUTE (`tradeGoods.js:53-56`), never a track — no field says no way reaches the town, and the drover's own seating is his arrival. No denier nameable. | — (WIRING 1) |
| 1 | 4 | PASS | — | card §7 governance: `Lord's steward` 11 · `Village reeve` 9 · `Informal elder consensus` 7; V-27 | "The man the town sends its questions to holds that" | The card's own prescribed shape ("the one they send to"), and the pool's only non-"says" finite attribution. "the turns are fairly set" is NOT §8's barred "the turns are well kept": SET is assignment, KEPT is performance, and the second clause withholds the setter. **V-27 checked and does not fire** — its ground is "a town where no force row resolves", and the militia row resolves 27/27. The turn is the card's own §9 flavour ("whose night it is"). | — |
| 1 | 5 | PASS | — | a drinking house 24/27 (`Alehouse`/`Ale house`/`Wayside inn`…) — conditional, seated | "it is the same households out every time" | "every time" TESTED against F2-06. It is a universal over occasions naming WHO, not a frequency per unit time, and says nothing about how often they turn out. The simple habitual, lawful everywhere. | — |
| 1 | 6 | **FAIL** | **1** (F1-25, the negation direction) | `institutions` [LIVE-ROSTER, same-page read set]: `Veteran's lodge` `institutionalCatalog.js:881-887` "retired soldiers and mercenaries gather. **Informal security**" 4/27; `Adventurers' charter hall` `:837-844` "**emergency armed response**" 10/27, firing `threatAssessment.js:64`; `Guard Captain` NPC 13/13 villages (`npcGenerator.js` TIER_MANDATORY_ROLES) | "there are no other hands here to ask" | THE RECORD IS THE ROSTER. The register source is village-seated, and on a village carrying a Veteran's lodge or a charter hall a PRINTED roster row on the same page IS other hands to ask — the charter row's own words are "emergency armed response" and the lodge's are "informal security". This is card §8's named floor-1 negation family ("there is no one who would come", "the town has no answer of any kind") in another coat, and it is the exact failure mode the Fable sitting named: a body inferred into the key's silence that a same-page row denies. The first two clauses are the pool's best single fact and are untouched. | Drop the third clause: "A priest says the same hands carry the bier and stand the night." Shorter, stops sooner, and between two lawful candidates the brief prefers the one that stops sooner. It also drops one of the pool's six negation landings. |
| 2 | 0 (spine, street) | PASS | — | the key's own reads (militia bucket); `guardEffectivenessDesc` 27/27 "reliable in a crisis, absent during routine crime" | "Everyone here has seen who comes out … and who does not" | The seeing is floor-1 clean (absence is the machine's own word) and the second half is the town's perception, licensed to be mistaken (ruling 28). "has seen" is the perfect over the POOL KEY'S OWN READ — licensed by §V.0 floor 2b, not by the frozen census. | — |
| 2 | 1 | PASS | — | `institutionVocabulary.js` "no pay" (V-09) | "is owed a drink by the man who never does" | A drink, not coin. No wage, arrears or purse predicated of the muster. | — |
| 2 | 2 | PASS | — | `institutionVocabulary.js` "no pay" | "he is owed nothing and would take nothing" | Affirms the row. A genuine disagree against face 1: one says a debt is owed, the other that none is. | — |
| 2 | 3 | PASS | — | `Guard Captain` NPC 13/13 villages; `Elder` 14/14 hamlets | "here he is told which door to knock at" | Points TOWARD the command half the Guard Captain affirms rather than denying it, and names no office — a door, not a title. The pool's only stranger face that is not about not being stopped. | — |
| 2 | 4 | PASS (floor) / **CRAFT FAULT** | mechanical | the brief's own rule that reds the build: "no face may open on the same three words as a sibling" | "One of the elders says the man who stays in" | WITHDRAWN ON FLOOR 1, and the withdrawal is now EXECUTED, not reasoned: `governanceNarrative.js:101-110` `deriveCouncilLabel` returns **'the village elders'** for every tier in `SMALL_SETTLEMENT_TIERS` (`:15` = thorp·hamlet·village), so the word is the engine's own across the whole preimage; F1-22 is about the RECORD-KEEPER (`holdersOf('elders')` 0/27), not the word, and the face cites no record. Floor 3 also checked: "one of the elders" is PLURAL and so is not the tier's singular `Elder` NPC. WHAT STANDS: this face opens on the same three words as face 2 of the same variant. | Use the card's own shape, as v1f4 already does — "Whoever the town sends its questions to says…". One edit clears the opener collision and varies the attribution. |
| 2 | 5 | PASS | — | `hasMarket` 14/27, seated; `safetyDesc` 18/27 "Militia volunteers patrol the main paths" | "the night a man stands is a morning somebody else keeps his stall" | Card §9 licenses "whose night it is" as this pool's own flavour, and the engine itself prints militia volunteers patrolling on 18/27, so a man standing a night is affirmed and denied nowhere. No body is named, so F1-01/V-23 (a watch as a body) does not reach it. | — |
| 2 | 6 | PASS | — | `Priest (resident)` required at village; standing per ruling 18 | "the households that come out are not the households that complain" | The one source on the pool that hears both parties, written from its standing. | — |
| 3 | 0 (spine, visitor) | PASS | — | `hasGates` 0/27 (`priorityHelpers.js:53` keywords all carry a walls-bucket word; no `gate` row below town) | "there is nothing here for a stranger to be stopped at" | Key-fixed, and three spines in three shapes (bare fact · public · source), ruling 29 met. ⚠ THE GROUND IS THE FLAG, NOT THE PROSE: sitting 1 rested this on `safetyProfile.js:463`, which never fires here (WIRING 3). Also tested against the charter hall on 10/27 — a specialist response for coordinated threats does not deny that the people who come out are what stands between the town and trouble. | — (WIRING 4: the classifier reads this spine as CONSEQUENCE) |
| 3 | 1 | PASS | — | F2-01 (a distance in a word) | "before he is a street in" | TESTED and not charged. F2-01 bands quantities of MODELLED things with closed band vocabularies; no read bands how far a stranger has walked, and reading F2-01 to bar all scene extent would also bar "well into the houses". The muster's boast is an attributed account inside a declared disagree pair, so the page does not assert it. | — |
| 3 | 2 | **WITHHELD** | 1 | `config.stressTypes` [CONFIG, FROZEN, in the same-page read set] at `wartime` (2/27) → `safetyProfile.js:168` VERIFIED verbatim: "War has reorganised daily life. **Strangers are viewed with heightened suspicion.**" | "nobody looks at a stranger here until he wants something" | A same-page machine sentence prints the flat opposite on the 2 wartime towns, and the key reads no stress field, so the face can print under that banner. WITHHELD RATHER THAN FAILED, and the reasons are three: it is an attributed ACCOUNT and not a recorded fact (ruling 13a — an account can be partial or wrong); it is one half of a DECLARED disagree pair whose other half says the opposite, so the page asserts neither; and the chair's own stress-crossing bar is "absurd", which a stallholder's shrug about custom is not. `recently_betrayed` (`:190`) does NOT occur on this preimage and is not part of the exposure. The chair should see this, not necessarily cure it. | If cured: narrow to trade rather than to attention — "nobody here asks a stranger his business until he wants something bought or sold" — which keeps the pair and drops the universal about looking. |
| 3 | 3 | PASS (floor) / **CRAFT FAULT** | mechanical | same rule as v2f4 | "One of the elders says a stranger is asked his business" | Floor clean: the business is asked "at the table he is fed at and not before it", and the face's own clause forces the lawful reading against §8's F1-08 bar on a stranger stating his business at an entrance — a table is not an entrance. WHAT STANDS: opens on the same three words as face 1 of the same variant. | Same cure as v2f4. |
| 3 | 4 | PASS | — | — | "a stranger is counted a guest until somebody decides otherwise" | "counted" is not a count. Opens and does not close, which the visitor variant wants. | — |

### WITHDRAWN CANDIDATES (hunted, measured, dropped — recorded so they are not re-found)
1. **"the elders" as a body** (v2f4, v3f3) — EXECUTED: `governanceNarrative.js:101-110` + `:15`.
   The engine says "the village elders" at hamlet AND village. The card's "`holdersOf('elders')`
   is 0/27" is about the RECORD-KEEPER, and no face cites a record.
2. **"the road" on an isolated town** (v1f3) — `generalStateProse.js:974` + the map at `:896-901`.
   `none` and `mountain_pass` fall to the engine's own `road` arm; only 4/27 are `isolated`, and
   `isolated` denies a trade route, not a track.
3. **"a street in" as a distance** (v3f1) — F2-01 bands quantities of modelled things; scene
   extent is not one.
4. **"the turns are fairly set" as V-27's standing rotation** (v1f4) — V-27's ground is "a town
   where NO force row resolves". The militia row resolves 27/27, so V-27 cannot fire on this key
   at all. The turn is the card's own §9 vocabulary and the hamlet `Burial ground` row's own word
   ("kept by the households in turn").

## CRAFT — POOL GRAIN: **DULL**

SPEAKERS: **6** (muster · market · stranger · elders/governance · alehouse · register). Well
above the three-speaker floor, and every one of the six speaks at least twice. Stake is real and
in dispute: the turn, who comes out and who does not, a drink owed, a name with nowhere to go,
and two honest disagree pairs.

**THE POOL IS DECISIVELY NOT DULLER THAN THE SHIPPED ROWS IT REPLACES — MEASURED.** The shipped
three (`f2da5a3ee`) are three bare abstractions of `threatAssessment.js:123` with ZERO speakers
and `{settlement}` in all three; the re-cut has six speakers, one `{settlement}`, and particulars
a game master can spend at once. The negation-landing measure also passes: 6 of 19 units land on
a negation (31.6%), just inside the one-third bar — and the v1f6 cure takes it to 5.

THE COLLAPSE IS THE ATTRIBUTION FRAME, and it is counted, not impressionistic:

- **"says / say" is the attribution verb in 15 of the 17 attributed units.** Only two vary it
  ("By a stallholder's account", "holds that"), and both sit in variant 1.
- **The brief's selector veto — "the same attribution verb three times running" — is tripped
  twice, and hard.** Variant 2 runs say · says · says · says · says · says (SIX consecutive).
  Variant 3 runs says · says · says · says · says (FIVE, the spine included).
- **Two sibling-opener collisions, and the rule they break REDS THE BUILD**: v2 f2 + f4 both open
  "One of the …", and v3 f1 + f3 both open "One of the …". "no face may open on the same three
  words as a sibling" is a mechanical voice rule, not a taste preference.
- **"A priest says" opens the register face in all three variants**; "One of the muster says"
  opens a muster face in all three, verbatim and six words deep.
- **The spine echo bites.** A spine co-renders with every face of its variant: spine 2's "comes
  out" reappears in v2 f1 and f2; spine 1 lands on "their own tools" and v1f1 opens on "the tool
  he works with". "come(s) out" carries three spines and four faces.
- **Variant 3 is three permutations of one sentence**: "a stranger is looked over…", "a stranger
  is asked his business…", "a stranger is counted a guest…", two of them hinged on "until".
- The withheld-reason device lands twice in the same words: "and does not say who set them" /
  "and does not say who decides".

WHY DULL AND NOT A PASS WITH NOTES: the particulars are good, but a game master scanning twelve
renderings reads ONE frame — an indefinite source, the verb "says", a that-clause — fifteen times
out of seventeen. That is "one construction repeated" at the pool grain, which is the one craft
collapse this verdict exists to catch, and two of its instances additionally red the build.

CURE (pool grain): vary the frame in at least one face per variant — the medial attribution, the
possessive account ("By a stallholder's account"), "holds that", "it is said", "it is not recorded
that" — and in doing so clear both sibling-opener collisions, which the same edit reaches. The
pool's own hand already shows the range in variant 1.

## WIRING (not face charges)

1. **THE CARD OVER-COUNTS THE ROADLESS TOWNS, AND BY MORE THAN SITTING 1 SAW.** card.md's
   speaker section reads "8 of 27 are `isolated` or `none`" and tells the writer not to write the
   road. EXECUTED: `generalStateProse.js:974` is
   `ORIGIN_POOL_OF_ROUTE[text(tradeRouteAccess)] || 'road'` with the map at `:896-901` holding
   ONLY crossroads · river · port · isolated — so `none` (4) **and `mountain_pass` (3)** both
   render under the engine's own **road** arm, which is F1-102's own parenthetical ("`road` is
   the ELSE-ARM over four route values"). Towns rendering as road: **11**. Truly roadless: **4**.
   A writer obeying the card refuses a word the engine itself uses on eleven towns.
   ⚠ Sitting 1 cited `:966`; the line is `:974`.

2. **THE CARD'S SECTION (7) AND §V DISAGREE ABOUT WHERE THE REGISTER IS SEATED, THREE FACES RIDE
   ON IT, AND AT HAMLET IT IS TWO FLOORS AT ONCE.** The mechanical section (7) seats "the register
   (parish)" at BOTH preimage tiers off `Access to parish church` + `Burial ground`; §V-29 names
   "the parish register at a hamlet whose church is 2–5 km away (F1-11)" a floor-1 row, and the
   marker's section makes the register village-only (13/27, `Priest (resident)`). The card says §V
   governs. This pool has THREE faces opening "A priest says", and their lawfulness rests entirely
   on the draw's source filter (car 18c) honouring the village-only seat. **If the filter reads
   section (7), all three print on the 14 hamlets — and there the face breaches TWICE, not once:**
   floor 1 (no clergy lives there; the required row is `Access to parish church`, "Travel to
   village church") AND floor 3, because `npcGenerator.js` `TIER_MANDATORY_ROLES.hamlet` is
   `['Elder','Parish Priest']`, so the `Parish Priest` is the tier's SINGULAR named office on all
   14 and F3-06's rider bars him from speaking in a face. No wording change can fix either.
   Confirm the filter before the packet lands.

3. ⛔ **NEW — THE CARD CITES A STRING THAT NEVER FIRES ON THIS PREIMAGE, TWICE.** card.md §7 (the
   gate section) and §8 both quote `safetyProfile.js:463` — "The lack of controlled entry points
   makes movement relatively easy; no gates to bribe and no checkpoints to avoid" — as "the
   engine's own words for this state" / "the engine's own reading of the state". EXECUTED: that
   string is the else-branch of `gateNote`, computed INSIDE `if (inst.hasSmuggling) {` at
   `safetyProfile.js:460`, and the card's own measured roster reads **`hasSmuggling` 0/27**. It
   cannot print on any town of this preimage. Sitting 1 rested v3's spine on it. **No face fails
   for this** — `hasGates` 0/27 off the key and the roster is the real and sufficient ground — but
   two of the card's citations are dead and should be re-pointed before another writer leans on
   them.

4. ⛔ **NEW — SPINE 3 TRIPS A MOVE DETECTOR THE POOL'S SHIPPED ROWS DO NOT.** EXECUTED over all 19
   rows with `CLAUSE_DETECTORS` from `src/domain/prose/moveGrammar.js`: exactly one hit. Spine 3's
   "whoever **comes out of** the houses" matches the CONSEQUENCE detector (`moveGrammar.js:227`)
   on the literal `comes out of`. The pool's three shipped rows classify **clean, zero moves**.
   CONSEQUENCE's declared licence is "event provenance AND a household/office row
   (double-licensed)" and this pool has no event provenance. **This is NOT the batch-3 breach**:
   the exact-count corpus assertion in `tests/lint/proseMoveGrammar.walker.test.js:831-852` is
   PROVENANCE-only, and I found no CONSEQUENCE count assertion anywhere in that file — so no
   shrink-only ceiling is nameable. But it is the same SHAPE as the batch-3 refusal, it is a rise
   from 0 on this pool, and the cure seat should see it before the gate rather than after. A
   one-word change ("whoever the houses send out", "whoever leaves the houses") clears it.
   ⚠ I also re-ran the PROVENANCE limb the brief warns about: "One of the elders **says**" does
   NOT match `the elders (?:say|hold|remember|keep)\b` — the trailing `\b` fails against "says".
   The pool spends no citation, which is correct, since the shipped rows carried none.

5. **STANDING, RE-VERIFIED, NO FACE LEANS ON IT:** the W-19 / W-22 family (offices minted
   roster-blind). A `Watch Captain` is minted on 4/27 with `hasWatch` false; and
   `npcGenerator.js` `STRESS_MANDATORY_ROLES.wartime = ['Garrison Commander','Guild Master']`
   mints a **Garrison Commander on the 2 wartime towns where `hasGarrison` is false**. No face in
   this pool touches the watch or a garrison in any form; every row checked.
