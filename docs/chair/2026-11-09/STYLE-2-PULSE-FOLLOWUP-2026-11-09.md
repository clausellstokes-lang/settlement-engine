# STYLE-2-PULSE-FOLLOWUP — car 3's pulse rows, after the train (2026-11-09)

**Seat:** PULSE-FOLLOW-UP, an Opus 5.5 build seat, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`), in session `session_01FbPLbeNzSCGcvS25GjfrY3`. **Lane:** `lane/style-2-pulse-followup-2026-11-09`, cut from MERGE-TRAIN's final tip `bd07005b9` (verified with `git rev-parse`) in its own worktree; the integration line untouched. **The law:** WIRING-RULINGS §5–§8; STYLE-RULINGS-2 Part C (C2 for the lines; the chair's ruling, vetoable, for D2·12 and D2·14); the brief's §0. **The worklist:** STYLE-AUDIT-2-PULSE (`b5d578e3a` on `lane/style-2-pulse-r2-2026-11-09`), every row cited by its number; SW-12's record §0 for the measure. No pull request; the seat signs nothing.

## 0. The measure, reproduced first

A scratch copy of `scripts/audit/simulate-world.mjs` (imports made absolute; one line collects `wizardNews.entries` at each world's end; nothing in the repo touched), `WAR_ECON_ALL=1`, `--ticks 52 --reps 2 --scales 0`: two 14-town worlds. Every entry is rendered through exactly what `WizardNewsPanel.jsx :: NewsEntry` prints: `headline`, `newsBodyText`, `newsVoiceLine`, `newsReasonPhrases(…).slice(0, 3)` and `newsReaderSummary`.

- **At the audit's base `2053a809c`: 4,496 entries.** That is the audit's figure exactly, so the harness is right.
- **At this lane's base `bd07005b9`: 4,177 entries**, `HEALTH: OK (no flags)`. The train's cars re-dealt the world, so every base figure below is measured at `bd07005b9` and none is copied from the audit.
- **After every cause: 4,177 entries, entry ids identical and in identical order.** No draw moved: every new variant is `proseSelection.js :: pickLine` on a stable seed.

| row | what printed at `bd07005b9` | cards (base → tip) | the top frame, names slotted (base → tip) |
|---|---|---|---|
| A2·169 | `civic role favors reform.` | 168 → 0 | 108 → 35 ("This is how a citizen answers trouble.") |
| A2·170 | `Pressure sat well clear of the gate, and the ambition behind it is steady.` | 168 → 0 | 99 → 31 |
| A2·171 | `Rare corrupted corrupted mercy ideal modifies behavior.` | "corrupted corrupted" 2 → 0; "Rare corrupted" 7 → 0 | — ("Ideal: X." 161, a label, kept) |
| B·2–4 | `…toward "secure office" has paid off…` · `Role: civic; goal: win public legitimacy.` · `…goal progress reached its culmination.` | 4 → 0 (quoted token, meter, role token) | ≤ 2 → ≤ 2 |
| B·8–10 | `New conditions in the settlement have turned X's effort toward another end.` · `…the justice ideal and naivete flaw still hold.` | 5 → 0 | 1 → 1 |
| A2·41 | the cause labels, slotted mid-sentence (`rooted in funds run short`) | the labels print in about 130 lifecycle lines, all in plain nouns now | — |
| D2·12 / D2·14 / D·89 | raw ids on the DM's herald receipts | dark in the measure (the soak renders only NewsEntry) | — |

## 1. The causes, old → new (each line is a proposal for the owner's veto)

**d4e8d0487 · A2·171, the defect (red-first).** A card corrupted at generation carries its traits as `corrupted_<trait>`, and the reason printed the token together with its own "corrupted". `eventProse.js :: plainTrait` now strips the prefix before printing. The helper lives in eventProse because `npcAgency.js` sits at 799 of its 800-line cap. Pin: `tests/domain/npcAgencyNewsLines.test.js`, 2 of 2 red at the parent.

**930b611cd · A2·169–171, the wording (C2).** The three reasons under every NPC move (`eventProse.js :: npcCandidateReasons`):
- `civic role favors reform.` → `It is the kind of move a citizen makes.` · `A citizen reaches for this sooner than most.` · `{N} acts as a citizen would.` · `This is how a citizen answers trouble.` These use the role noun `NPC_ROLE_NOUN`. npcAgency infers `civic` when no title matched, so it says "a citizen" and claims no office.
- `Pressure sat {well clear of|barely over} the gate, and the ambition behind it is {steady|hungry}.` → four tellings, each with the four band spellings, for example `Hard times pushed {N} to it, and their ambition is steady.` / `Hard times only just pushed {N} to it, but they are hungry to rise.`, and their kin `The times pressed hard on {N}; …`, `With times this hard, {N} had little choice, …`, `Trouble crowded {N} toward it; a steady ambition did the rest.`
- `Rare corrupted {ideal} ideal modifies behavior.` → `{N} believes in {ideal}, but in a twisted form.` The `Ideal: {ideal}.` label stays.
- **THE REFUSAL LINE APPLIED:** a single telling first measured 118 for the role line (above the old 108) and exactly 99 for the drive line (the old rate), so both lines carry four tellings, seeded on npc id + move and never on the tick. One NPC's repeated move therefore prints the same words, and the metronome de-duplicator's partition is unchanged (ids identical).

**f7a455e36 · B·2–4, the culmination pool** (B·1, the headline, PASS):
- B·2 summary: `X's patient work toward "secure office" has paid off; the prize is now in hand.` and its three kin → `X has worked a long while to {aim}, and now it is done.` · `After long work, X has managed to {aim}.` · `Those who watched X work so long to {aim} now see it done.` · `X set out long ago to {aim}, and the others who hold sway must now reckon with it.` `{aim}` is the worded long goal (`heraldDeeds.js :: NPC_AIMS`).
- B·3 progressReason: `X's long-term goal progress reached its culmination.` / `…ripened into action.` / `…across the threshold.` → `X had been working toward this for a long while.` · `It came after a long stretch of patient work by X.` · `X kept at it, move after move, until it came.` · `Many small moves by X led here.`
- B·4 roleReason: `Role: {role}; goal: {goal}.` / `The {role} path gave X the means to pursue "{goal}".` → `X {got there|did it|reached it|won it} {means}.` The means come from `NPC_ROLE_MEANS`, each role's own influence basis in words; civic is `through the people they deal with every day`.
- The annex `RECEIPT_POOLS_LEGACY.md` §2 carries the live rows verbatim and two floor rows, with a slot note.

**0e8c9308c · B·8–10, the rebranch pool** (B·7, the headline, PASS):
- B·8 summary: `New conditions in the settlement have turned X's effort toward another end.` and kin → `X has given up trying to {oldAim} and now means to {aim}.` · `X no longer works to {oldAim}; now they mean to {aim}.` · `X has set the old aim aside, to {oldAim}, and taken up a new one: to {aim}.` · `People who know X say they have stopped trying to {oldAim} and now mean to {aim}.` The writer read the new goals and did not pass them; it now passes the worded old and new aim of the one goal that changed.
- B·9 contextReason: `The settlement's circumstances have changed since X's aims were set.` and kin → `X's old aim was made for a place that has since changed.` · `Things at home have changed since X first chose that aim.` · `X chose the old aim when times were different.` · `What X once wanted no longer fits the way things stand.` It still names no condition (CURE-P1 U3: the context key's diff is lossy).
- B·10 personalityReason: `New goals do not rewrite X: the {ideal} ideal and {flaw} flaw still hold.` and kin → `X is still the same person: still driven by {ideal}, still given to {flaw}.` and three kin. Traits go through `plainTrait`.
- The annex row is as for B·2.

**92787493b · A2·41, the cause labels** (`causeVocabulary.js :: CAUSE_CLASSES`; the class keys untouched): `funds run short` → `a shortage of money`; `a broken supply chain` → `supplies that stopped coming`; `stores run dry` → `empty storehouses`; `trade choked off` → `the loss of trade`; `the strength levied away` → `the fighters taken for the levy`; `a hollowed-out garrison` → `a half-empty garrison`; `the pressure of the war` → `the hardship of the war`; `the occupier's hand` → `the occupation`; `a patron that rewards the deed` → `a god that rewards wrongdoing`; `a captured institution` → `an institution in criminal hands`. Four labels are kept.

**6969dda79 · D2·14** (`heraldRegister.js :: remnantRow`): the detail `lifecycle.death.oldkeep.5` → `It fell in the course of the world, not by the DM's hand.` The id now rides on the row as `ref` and is never printed. Pin re-keyed by cause; 1 of 22 red at the parent.

**af0087de2 · D2·12 + D·89** (`HeraldSceneContext.jsx`):
- The `Scene {id}` and `Canonical record {kind}: {id}` rows leave the card; the ids ride as `data-scene-id` / `data-canonical-ref`.
- Kind and the cause family print humanized.
- `Recorded reference: {id}` → `A cause the portrait noted, without a description.`
- The heading fallback is the kind in words, never the scene id.
- D·89's footer `These are the portrait compiler's recorded references. The Herald has not guessed a story identity for this place.` → `These are the notes the settlement's portrait was built from. The Herald has not guessed which story this place belongs to.` It is ledger D's row in the same card, and its old claim stopped being true with the cure, so it moves in the same commit.
- Two pins re-keyed by cause (`heraldSceneContext.test.jsx`, `realmInspectorSize.test.jsx`).

**`espionage/espionageGauntlet.js` — read under the law, no edit.** It prints 0 lines in the measure. Its one prose function, `captorLeniencyRead`, has no caller, as the audit records. Its dark line "his fate swings with the week" (a gender not read) goes to PULSE-DARK.

**Follow-ups and registers, each by its door:**
- fa6064510: `domainAnyCastBaseline` named one `{any}` in 0e8c9308c's aim reader, now `{unknown}`. Not widened.
- ba35c24d7: the lighting census refrozen by `LIGHTING_CENSUS_REFREEZE` on a clean tree. Files 3138 → 3139, titles +12, suites +5; the walker green.
- 4edce0c76: writer reach `--write`. Cohort 1362 holds and DARK 1396 holds. 650 identities gain `news=N` (roleArchetype, ambition and corruption are now read in words); 209 lose it (`goal`, now said as the aim).
- d59b6ce80: the prose-family contract re-recorded by its own functions. The base reproduces exactly; at the tip five `reasons[]` rows gain distinct counts only (the four tellings), and occurrences, identities and corpus hold. Digest 9bd27a79 → bc2f448a.
- Pin re-keyed by identity in 930b611cd: `modeSpeedsWy1 :: BASE_PULSE_HASH` 5b6a1e51 → 95f4af4f, TEXT ONLY (152 string leaves, 0 non-string, 0 keys).

## 2. Golden surfaces — UNSIGNED, for STYLE-2-MERGE's signing

| cause | herald desk (`rr-fresh-full|1`, 439 items) | gm /525 | fence /360 | prose /1,050 | witness | pdf |
|---|---|---|---|---|---|---|
| d4e8d0487 A2·171 | a6b2c25b → d4f24935 · 2 items text-moved | 0 | 0 | 0 | 0 | 0 |
| 930b611cd A2·169–171 | d4f24935 → dbef759e · 66 | 0 | 0 | 0 | 0 | 0 |
| f7a455e36 B·2–4 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0e8c9308c B·8–10 | dbef759e → 07906080 · 12 | 0 | 0 | 0 | 0 | 0 |
| 92787493b A2·41 | 07906080 → aafcffa0 · 3 | 0 | 0 | 0 | 0 | 0 |
| 6969dda79, af0087de2 | 0 | 0 | 0 | 0 | 0 | 0 |

How it was measured:
- The herald is measured by its golden's own projection (`heraldDeskProjection`) in clean worktrees, each against its parent. No item id was added or lost at any cause.
- `heraldKnowledgeDeskGolden` is therefore RED at the tip by exactly this move (aafcffa0 against the frozen a6b2c25b), and it is left for the signed door.
- gm and the fences come from the property suites run per cause: generation imports none of these writers, so the generator golden master is byte-identical.

## 3. Census law — clauses struck from the audit's drafts

- A2·169: struck the draft's role words "town official" (and its kin). npcAgency's `civic` is a DEFAULT for any title that matched nothing (innkeepers, woodcarvers), so it says "a citizen".
- A2·170: struck "Times are hard enough to push X…" as one fixed line. The refusal line measured it at the old rate, so it carries four tellings.
- B·2: struck "The town will feel the shift in who holds sway this season": the season is not read and the tier noun is wrong in a village. Kept as "the others who hold sway must now reckon with it" (the `faction_challenge` condition the beat places). Struck "years" ("for years"): the beat reads progress, not time.
- B·4: struck "through the town's offices and councils" for civic (the default role; no office is read).
- B·9: no condition named (CURE-P1 U3's measurement holds).

## 4. What stays (by file)

- `src/domain/worldPulse/causeLifecycle.js`: the lower-case lead on a cause label (A2·34/36/39). It is 26 lines at both base and tip in this measure, and SW-12's lane cures it in this file. The labels here are nouns built for those mid-sentence slots.
- `src/domain/worldPulse/eventProse.js`: B·5 `conditionDescription` (dark) and the rest of ledger B's dark rows, for PULSE-DARK.
- `src/domain/worldPulse/espionage/espionageGauntlet.js`: the dark "his fate" line, for PULSE-DARK.
- `src/components/map/HeraldSceneContext.jsx`: `displayText` composed upstream by the portrait compiler ("regional-grain: river terrace") prints as given; its writer is not this file.
- `src/domain/worldPulse/npcAgency.js`: the summary frame `{N} is out to {aim}.` (A2·168, 168 cards), the headline/summary disconnect. It is not this lane's row (the audit routes it with A1·59), and it is named for the chair.

## 5. The referee and the gates

- **The full suite:** at the base `bd07005b9` and at the tip. The figures are in §6 when the runs close.
- **The cause sets, base reds only:** `tests/domain/npc/characterConsumers` (3), `worldPulseFactionSeating` (2) and `tests/property/editCorpusRatchet` (4) are red in the clean base worktree too; they are the base's own.
- **tsc:** `tsc --noEmit -p .` is text-equal to the base (167 = 167) at every cause.
- **eslint:** clean on every touched file.
- **The 1,000:** the soak births towns and never advances the pulse, so none of these writers can print on it. It was run at the tip to show the twenty frames unmoved (§6).

## 6. Figures at the close

- **The 1,000** (`soak-review.mjs --count 1000 --workers 2`, at `bd07005b9` and at the tip `d59b6ce80`): 1,000 settlements, 657 findings, 0 errors, CLIMB at both. That is the train's own result (657; repetition story 0.035, hooks 0.299). **Every aggregate, `repetition-prose.json` included, is byte-equal, and `settlements.jsonl` (the story hashes) is byte-equal across all 1,000.** The twenty frames are not raised and no new frame enters the top forty; only `run.json` (timing and sha) differs. `coh:tier-noun` is untouched: no line here prints on a dossier.
- **The full suite:** see the closing addendum below.

## 7. CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed here):
- the base sha, and the measure reproduced (4,496 at 2053a809c; 4,177 at bd07005b9);
- every base → tip count above, with identical entry ids after every cause;
- every herald delta, measured by the golden's own projection against its parent;
- the WY-1 arm's text-only leaf diff;
- the prose-family base reproduction and its five moved rows;
- the writer-reach diff by field;
- each new pin red at its parent;
- tsc text-equal.

**PLAUSIBLE:** every new line is a proposal under the law, read against its writer's slots by this seat. Two readings in particular are this seat's: the role nouns and means are drawn from the role table's own influence basis, and "a god that rewards wrongdoing" reads `hasCorruptingDeity` as an evil patron.
