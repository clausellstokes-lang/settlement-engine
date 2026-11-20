# NAMES-3 hand-back

Written 2026-11-20 10:00 UTC by NAMES-3, HANDED OVER on the chair's word (read at 452,611 tokens against a 250,000 mark). Branch
`lane/names-3-2026-11-20`; tip `94a93e24b`, pushed. The line was merged in at `55c4de58a` (line `0c9069489`: points 79 to 81).
A successor needs only this file, the assignment `docs/chair/2026-11-20/seventh/prompts/NAMES-3.txt` on `origin/lane/chair-2026-11-08`,
and the chair's messages it summarises.

## 1. The rulings in force (each vetoable by the owner)

1. **CV1, one home for a power's number.** A verb or pronoun that follows a power agrees with that power's own number. The reader is
   `src/data/people/powerSentenceName.js :: pluralPowerName` (NAMES-2 moved the body there at point 79; `domain/display/pluralPowerName.js`
   returns it). It is asked through `powerVerb(name, one, many)` and the agreement form `{slot|one|many}` (`fillAgreement`, NAMES-3).
   A name the reader cannot judge takes the singular. No template carries a number of its own.
2. **CV2, by cause, not by line.** The cure is in how a template's verb or pronoun is filled. It is never a list of sentences patched one by one.
3. **CV3, the banked lines.** `tests/lint/presumedThings.walker.test.js` and `presumptionClasses.walker.test.js` bank a source literal by its text.
   Keep a banked literal byte-identical and carry the change in the value; otherwise declare it by the walker's door. Never widen a walker.
4. **CV4, the confinement.** Between base and tip a born town differs only in prose strings, and each changed string differs only as ruled.
   Run `trees.mjs` (below); 0 non-string differences; any other difference goes to the chair at once.
5. **CV5.** `tests/lint/namesInSentences.walker.test.js` stays green. A hideable power's prose form still contains its name, and no stored
   string speaks of a person by pronoun without naming them.
6. **CV6, the measure.** Count with this seat's reader before and after: zero, or each survivor named with its reason.
7. **CV7, what is a fault.** A power is a body of people.
   - **Stands, everywhere, not counted:** "they/them/their" after a singular-named power ("the Elder Council … they get their way").
     `src/generators/power/factionStanding.js` is not touched. This seat's raw pronoun rule reads 1,471 such readings at the line;
     about 120 of them are `factionStanding.js`'s standing lines.
   - **The faults, and only these:** (i) a verb whose subject is the power, with the contrary number, in either direction, wherever it
     stands (after "and" too); (ii) "it/its/itself/it's" said of a plural-named power. These become "them/their/themselves/they are".
8. **The qualified name's possessive (item 3 (d), a style).** It opens the bracket into an epithet: "Tserenpuntsag Ongirad the miller's hours".
   Never "(the miller)'s", never a doubled possessive. The stored `name` and the card's display name keep the bracket, and the bare name
   stays in the string (the share veil folds a bracketed qualifier).
9. **The generated pool is a named survivor, after the deploy.** `src/data/dossierStateProse/power.generated.js` and the state-prose kernel are
   not touched in this lane. Of its 313 templates, 62 name `{faction}` or `{counterpart}`. About 35 of those carry a singular verb or
   "it/its" after the slot (18 a verb, 31 a pronoun, by a template scan). Example: "Everyone at {settlement} can see {faction} could lose the
   hall, and {counterpart} has not yet moved to take it" (6 rendered on the 720). The cure by cause is an agreement form in the kernel's fill.
   `{faction}` also stands in the other five state-prose leaves and in `dossierCausalProse.generated.js`; they are not counted.
10. **Tests compute a pool's sentence, never quote it** (`tests/lint/proseDrawnAnchors.walker.test.js`; `tests/helpers/drawnProse.js`).
    Use interpolated template literals, or `drawnMember` / `poolMemberTexts`.
11. **Push and gates.** Push only the lane branch, with the hooks; never `--no-verify`, never force, never master, never a pull request.
    At the last commit: `tests/lint` whole, `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`. Read every run
    through `sh scripts/gate-tail.sh`.

## 2. The tools (`docs/chair/2026-11-20/content/tools/confinement/`, README there), one command each, from the repo root

- **Confinement between two revisions:** `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <rev-before> <rev-after> <workdir> [--words=number|names|none] [--control] [--fails=N]`.
  It `git archive`s each revision, births the golden 525 and the census 720, and diffs every document key by key. It reports non-string
  differences, string leaves by field, and a word check. Births are cached per sha (about 1.5 min each on 4 cores).
- **Render the 720, every view:** `node docs/chair/2026-11-20/content/tools/confinement/run.mjs <tree> <out> render [--workers=3] [--seeds=a,b]`
  (about 9 minutes). **The first town each worker renders is cold:** its Power view may drop the "Patron deity" block. Re-check any such
  difference warm with `--seeds`.
- **The reader:** `node docs/chair/2026-11-20/content/tools/confinement/agree.mjs <reader-tree> <out> [--pronouns]`. It reads
  `<out>/census.jsonl` (stored) and `<out>/views` (rendered).
  - **Verb rule:** a power in its article form, at a sentence or clause head (after `. ! ? ; :`, a dash, a comma, or a subordinator, "and"
    included). Compound subjects, objects and possessives are skipped. Its verb, after adverbs, is read for number against `pluralPowerName`.
  - **`--pronouns` rule:** a power and a later pronoun of the other number in the same sentence, with no power, name, plural noun or pronoun
    between them. It is noisy (a card's own "they"; "it" for a nearer noun), so read it by template, never as a figure.

## 3. Item 1 and item 2 (done)

- **Item 1 (the tool):** pushed at `d1d8ffff8`; `--seeds` added at `63f7aba3a`; `--pronouns` and `--fails` at `893182805`.
  - Its first run, 7e0c77ae2 → e356c94f2, reproduces the names landing exactly: golden 4 identical, 0 non-string, 21,309 string leaves;
    census 76 identical, 0 non-string, 25,429.
  - The names word check passes 21,308 and 25,407; the 23 that fail are in §5.
  - The control flags every document; `--words=number` rejects all 46,738.
  - e356c94f2 against 37b90e66b: all 1,245 documents identical.
  - `tests/lint` whole at the tool commit: 220 files, 3,271 tests passed.
- **Item 2 (verdict on 9157373d0): SOUND.**
  - Confinement 37b90e66b → 6c38ecfaa: golden 525 identical; census 715 identical; 0 non-string; exactly 5 strings changed, all number-only.
  - Rendered: 139 lines changed, all number-only. Two cold-start views moved; re-rendered warm, they are identical.
  - Its test: 6 of 6 red at its base, 6 of 6 green at its tip.
  - This reader at 6c38ecfaa: stored 10 → 5, rendered 150 → 11.

## 4. Item 3, part by part

All of it is in `9ddfcaa5a`. Its content is the tip's: `18630307a` was reverted by `94a93e24b`, see (d).

**The file:** `tests/data/powerNumberAgreement.test.js`, 12 tests.
- **Red first:** 9 failed and 3 passed in an archive of the line 0c9069489. The 3 that passed are the control and the plural/singular DM
  sweeps' singular arm. The leaf-function tests red by absence (TypeError); the DM, goal, secret and pressure tests red by assertion.
- **Green:** 12 of 12 at the tip, with `proseDrawnAnchors` green (18 of 18 with it). `tests/data/goalFamilies.test.js` was taught the
  agreement form, with a control. The composer suites were run: 7 files, 79 tests green (goalFamilies, personMention, dmPowerLines,
  dmPowerLinesPossessive, powerVerbAgreement, people/goals, tailNarrativeRows).

**Confinement 0c9069489 → 9ddfcaa5a** (`--words=number`, every remaining string then read by a script that undoes the epithet):

| corpus | identical | non-string | changed strings | number-only | possessive-only, bare name kept | other |
|---|---|---|---|---|---|---|
| golden 525 | 283 | **0** | 899 | 891 | 8 | **0** |
| census 720 | 440 | **0** | 971 | 918 | 53 | **0** |

**Fields, census (strings / towns):** npcs[].goal.long 694/251 · goal.short 203/156 · relationships[].description 29/23 ·
relationships[].tension 24/19 · pressureSentence 16/16 · npcs[].secret.what 5/5.
**Fields, golden:** goal.long 773/242 · goal.short 118/103 · relationships tension 6/5 · description 2/2.

**The measure (this reader, stored, the 720):**
- Verbs: 5 at the line → **0** at the tip, of 2,311 readings.
- Rendered, at the tip, on 422 of 720 towns (the render was stopped at the hand-over): **2**, both the generated pool's "{counterpart} has
  not yet moved". At the line (≈ 6c38ecfaa) it was 11. So the 720's rendered figure after is NOT MEASURED: re-run the render and `agree.mjs`.
- Raw pronoun rule: plural+it 854 → 456. Every group left reads false by template: "without buying it", "do it well", "bring it to",
  "keep it longer", "It reaches …" (the conflict), "paid to lose it" (the documents). The ×4 "See the P outgrow the P, so it never has" is a
  singular {power} whose "it" is right; the reader took the nearer, plural name.

**(a) The stored survivor: DONE at 9ddfcaa5a.** narrativeText `succession_void`: "…, and the Religious Authorities are taking over the offices"
(5 stored → 0).

**(i) and (ii): DONE at 9ddfcaa5a, in the six files, as narrowed by CV7.**
- `narrativeText.js`: every verb of the governing or leading power (or its fallback wording), e.g. "now finds" after a singular name;
  "its/it" of a plural one. A local `agree` reads `powerVerb`; no line was added (the file is line-cited).
- `dmPowerLines.js`: every ruler, power and criminals verb, and "it/its"; `crimAgree` gives a list of guilds the plural.
- `stressInstitutionEffects.js` stakes: `{faction|is|are}`, `{faction|suspects|suspect}`, `{faction|believes|believe}`, resolved by
  `fillAgreement` in `npcGenerator.js`. The secret "helped cause and has been concealing" uses a word slot `{has}`, because a secret is read
  back as a `{[a-z]+}` pattern by rareSecrets.js, crisisFactFindings.js and tonightSheet.js. "considers" stays NAMES-2's `withPowerVerb`.
- `goalFamilies.js` + `goals.js :: cellCandidates`: eight `{power|…}` forms.
- Singular "they/their" left, by CV7.

**The earlier seat's list: DONE inside (ii).** Five goal templates and four DM lines.

**Named survivors (not done, with reasons):**
- `narrativeText.js`'s district row (" controls one district …") and occupied row (" still meets, but nothing it decides …"). Their verbs
  stand inside literals the presumed-things widened register banks.
  - A declaration does not clear them: `PRESSURE_ROWS` is not a carrier a draw door is handed, so its `needs` are not credited (tested and
    reverted).
  - "controls" is reached after the draw by NAMES-2's `withPowerVerb`. "meets" and "it decides" are reachable only by a renamed plural
    governing power (every born governing power is singular).
- `dmPowerLines.js` `CAPTURE_LINES.equilibrium[2]` ("{ruler} still rules, and {criminals} still works the streets"). Its literal is banked
  by both presumption walkers. No born ruler or criminal power on the 720 is plural.
- The generated pool (§1.9).

**(d) The qualified name's possessive: DONE at 9ddfcaa5a, one stored string left.**
- The helper is `data/people/personMention.js :: qualifiedPossessives`. It is called inside `secondMentions`, which every person-pair line
  (`npcData.js :: pairProse`) and every goal line (`goals.js :: cellCandidates`) passes through, so one place covers them. It is also called
  in `npcGenerator.js`'s crisis-secret fill: on the drawn text and on its held key alike, so the held refusal compares like with like.
- Stored "(the role)'s": 54 in 33 towns → 1 (census); 8 → 0 (golden). Every changed string keeps the bare name.
- **Left (1):** the crime-knowledge secret, `npcGenerator.js`: "Has been reading ${otherNpc.name}'s correspondence through an intermediary"
  (r2r-metropolis-4, "Poulcheria Raoul (the cartographer)'s").
  - The cure was tried at `18630307a` and **reverted** at `94a93e24b`.
  - **Draws moved:** that pool (`npcGenerator:CRIME_KNOWLEDGE`) refuses a held secret by `heldKey: (s) => frameOf(s.what)`, over the text
    as printed. The epithet changed the frame, so later cards drew other secrets: a golden metropolis card's `secret.what` was replaced
    wholesale. That is a CV4 breach, caught by the tool.
  - **Same commit:** `node scripts/presumed-things-door.mjs --check` read **12 STALE rows**, all `src/data/npcData.js`: watch 8bb7c76d…,
    39ec1442…; granary 688672c4…; garrison b6807ce3…; market 48716f2f…, 07dd0ec4…; shrine c0d5a7de…, 730c7177…, ff907154…, 42450e26…,
    11a74820…, 8a3372be….
  - **Likely cause (PLAUSIBLE, not traced):** the walker's drawn-range tracing (`drawnRanges`, which follows door calls through functions
    and imports) read the pool differently once its `what` was a call. The revert restored 0 fresh / 0 stale.
  - **The cure by cause:** `frameOf` must read the epithet form too, or the possessive must be formed after the held check. Both touch the
    draw's held key, so the change needs its own confinement.

## 5. The 23 strings the names word check did not pass (7e0c77ae2 → e356c94f2)

6 are harmless punctuation. 17 are the possessive wart, cured at 9ddfcaa5a, but for the one survivor in §4 (d).

- **metropolis|slavic|coastal|port|civilized|golden-master-v3 relationships[76].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Olivera Vasić (the workhouse master) needs Raisa Saveliev's seal on certain papers; Raisa Saveliev needs Olivera Vasić (the workhouse master)'s silence about certain others. Neither has asked for more than the other could pay.
  - after: Olivera Vasić (the workhouse master) needs Raisa Saveliev's seal on certain papers; the fortune teller needs the workhouse master's silence about certain others. Neither has asked for more than the other could pay.
- **r2r-thorp-1 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Terrapolis are careful to leave the forms of local rule in place (Elder Council still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Terrapolis are careful to leave the forms of local rule in place: the Elder Council still meets, still signs, still presides, which fools no one and is not meant to.
- **r2r-thorp-24 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Sanctaminus are careful to leave the forms of local rule in place (Household Council still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Sanctaminus are careful to leave the forms of local rule in place: the Household Council still meets, still signs, still presides, which fools no one and is not meant to.
- **r2r-city-8 relationships[42].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Altankhuyag Dörbete wants to bring a third member into the alliance. Ghazan Urgench (the senior craft-guild master) thinks the newcomer would take Ghazan Urgench (the senior craft-guild master)'s place.
  - after: Altankhuyag Dörbete wants to bring a third member into the alliance. Ghazan Urgench (the senior craft-guild master) thinks the newcomer would take his place.
- **r2r-city-17 relationships[19].description** — WART left in the after text: "(the role)'s"; cured at 9ddfcaa5a (item 3 (d))
  - before: Ergene Kereit still keeps Tserenpuntsag Ongirad (the miller)'s hours and Tserenpuntsag Ongirad (the miller)'s ledger format. Everyone who deals with Ergene Kereit recognises the teacher.
  - after: Ergene Kereit still keeps Tserenpuntsag Ongirad (the miller)'s hours and his ledger format. Everyone who deals with Ergene Kereit recognises the teacher.
- **r2r-city-50 relationships[4].description** — WART left in the after text: "(the role)'s"; cured at 9ddfcaa5a (item 3 (d))
  - before: Tubertus Nerva still keeps Laenas Sabinus (the guild archmage)'s hours and Laenas Sabinus (the guild archmage)'s ledger format. Everyone who deals with Tubertus Nerva recognises the teacher.
  - after: Tubertus Nerva still keeps Laenas Sabinus (the guild archmage)'s hours and the guild archmage's ledger format. Everyone who deals with Tubertus Nerva recognises the teacher.
- **r2r-metropolis-2 relationships[20].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Wu Inoue's operation runs on a schedule Tianmei Zheng (the castellan) provides: where Tianmei Zheng (the castellan)'s people will be, and where they will not. In public the two exchange formal nods.
  - after: Wu Inoue's operation runs on a schedule Tianmei Zheng (the castellan) provides: where her people will be, and where they will not. In public the two exchange formal nods.
- **r2r-metropolis-7 relationships[60].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Tserenpuntsag Jalayir (the workhouse master) has begun to count the debt Tuyaa Kalmyk owes among Tserenpuntsag Jalayir (the workhouse master)'s assets, and has had it written down before witnesses.
  - after: Tserenpuntsag Jalayir (the workhouse master) has begun to count the debt Tuyaa Kalmyk owes among his assets, and has had it written down before witnesses.
- **r2r-metropolis-15 relationships[15].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Kaikeyyi Bhat (the luxury merchant) needs Sanjay Dutta's seal on certain papers; Sanjay Dutta needs Kaikeyyi Bhat (the luxury merchant)'s silence about certain others. Neither has asked for more than the other could pay.
  - after: Kaikeyyi Bhat (the luxury merchant) needs Sanjay Dutta's seal on certain papers; he needs her silence about certain others. Neither has asked for more than the other could pay.
- **r2r-metropolis-26 relationships[24].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Shaohua Deng wants to bring a third member into the alliance. Eun Ren (the beast master) thinks the newcomer would take Eun Ren (the beast master)'s place.
  - after: Shaohua Deng wants to bring a third member into the alliance. Eun Ren (the beast master) thinks the newcomer would take his place.
- **r2r-metropolis-29 relationships[64].description** — WART left in the after text: "(the role)'s"; cured at 9ddfcaa5a (item 3 (d))
  - before: Erene Cumans still keeps Zümür Borjigin (the master baker)'s hours and Zümür Borjigin (the master baker)'s ledger format. Everyone who deals with Erene Cumans recognises the teacher.
  - after: Erene Cumans still keeps Zümür Borjigin (the master baker)'s hours and the master baker's ledger format. Everyone who deals with Erene Cumans recognises the teacher.
- **r2r-metropolis-39 relationships[75].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Despoina Alexios (the smelt master) wants Philippos Triakontaphyllos's position, and Philippos Triakontaphyllos wants Despoina Alexios (the smelt master)'s reputation. They are civil in public and unforgiving in private.
  - after: Despoina Alexios (the smelt master) wants Philippos Triakontaphyllos's position, and he wants her reputation. They are civil in public and unforgiving in private.
- **r2r-metropolis-40 relationships[42].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Sujin Sasaki (the bowyer) has begun to count the debt Xian Guo owes among Sujin Sasaki (the bowyer)'s assets, and has had it written down before witnesses.
  - after: Sujin Sasaki (the bowyer) has begun to count the debt Xian Guo owes among her assets, and has had it written down before witnesses.
- **r2s-under_siege-city-3 relationships[29].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Trude Gärtner has asked Luitgard Uhl (the master baker) for a vote against Luitgard Uhl (the master baker)'s own interests. It is the first payment Trude Gärtner has asked for.
  - after: Trude Gärtner has asked Luitgard Uhl (the master baker) for a vote against the master baker's own interests. It is the first payment Trude Gärtner has asked for.
- **r2s-occupied-hamlet-2 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Dunkelstift are careful to leave the forms of local rule in place (Free Elder Council still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Dunkelstift are careful to leave the forms of local rule in place: the Free Elder Council still meets, still signs, still presides, which fools no one and is not meant to.
- **r2s-occupied-village-1 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Celoichi are careful to leave the forms of local rule in place (Household Council still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Celoichi are careful to leave the forms of local rule in place: the Household Council still meets, still signs, still presides, which fools no one and is not meant to.
- **r2s-occupied-city-1 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Qaranuur are careful to leave the forms of local rule in place (Merchant oligarchy still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Qaranuur are careful to leave the forms of local rule in place: the Merchant oligarchy still meets, still signs, still presides, which fools no one and is not meant to.
- **r2s-occupied-city-2 relationships[52].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Night Uoc wants to bring a third member into the alliance. Quiahuitl Chi (the master weaver) thinks the newcomer would take Quiahuitl Chi (the master weaver)'s place.
  - after: Night Uoc wants to bring a third member into the alliance. Quiahuitl Chi (the master weaver) thinks the newcomer would take his place.
- **r2s-occupied-metropolis-1 relationships[28].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Georgios II Protostrator wants to bring a third member into the alliance. Stylianos Chrysoberges (the luxury merchant) thinks the newcomer would take Stylianos Chrysoberges (the luxury merchant)'s place.
  - after: Georgios II Protostrator wants to bring a third member into the alliance. Stylianos Chrysoberges (the luxury merchant) thinks the newcomer would take his place.
- **r2s-occupied-metropolis-3 pressureSentence** — harmless: the bracket became a colon (NAMES-1); reads better
  - before: The occupiers of Rajigarh are careful to leave the forms of local rule in place (Grand Merchant Oligarchy still meets, still signs, still presides) which fools no one and is not meant to.
  - after: The occupiers of Rajigarh are careful to leave the forms of local rule in place: the Grand Merchant Oligarchy still meets, still signs, still presides, which fools no one and is not meant to.
- **r2s-politically_fractured-metropolis-1 relationships[18].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Vangchug Bashkir (the mint master) needs Khutulun Merv's seal on certain papers; Khutulun Merv needs Vangchug Bashkir (the mint master)'s silence about certain others. Neither has asked for more than the other could pay.
  - after: Vangchug Bashkir (the mint master) needs Khutulun Merv's seal on certain papers; the midwife needs the mint master's silence about certain others. Neither has asked for more than the other could pay.
- **r2s-infiltrated-town-3 relationships[11].tension** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Sona Dubey (the cooper) wants to bring a third member into the alliance. Sona Dubey (the cartographer) thinks the newcomer would take Sona Dubey (the cartographer)'s place.
  - after: Sona Dubey (the cooper) wants to bring a third member into the alliance. Sona Dubey (the cartographer) thinks the newcomer would take her place.
- **r2s-insurgency-metropolis-1 relationships[72].description** — WART in the before text only; NAMES-1 already replaced the possessive mention
  - before: Quetzal Ixim (the watch commander) chooses where Quetzal Ixim (the watch commander)'s people go, and Zac Uc pays for their routes. The streets Zac Uc uses are the quietest in the settlement.
  - after: Quetzal Ixim (the watch commander) chooses where her people go, and Zac Uc pays for their routes. The streets Zac Uc uses are the quietest in the settlement.

## 6. Ten sentences before and after, for the owner (line 0c9069489 → tip; the census)

1. Make the Merchant Guilds so much their own that **it** could not run a week without them. → … that **they** could not run …
2. Build the Religious Authorities up until **it is** beyond the reach of the Elder Council. → … until **they are** beyond …
3. Leave the Craft Guilds stronger than they found **it**, … → … than they found **them**, …
4. Do one thing for the Merchant Guilds this season that the people who lead **it** cannot ignore. → … who lead **them** …
5. The Household Council in Beikou backed the winning faith … and now **find** that … → … and now **finds** that …
6. The last thing the Merchant Guilds and **its** rivals agreed on in Benham … → … and **their** rivals …
7. Wadiistan's last strong leader died 9 weeks ago, and the Religious Authorities **is** taking over the offices … → … **are** taking over …
8. … a purge) that the Religious Authorities helped cause and **has** been concealing → … and **have** been concealing
9. Dhara Kumar kept Anuradha Basu **(the tavern keeper)'s** name out of a scandal … → … Anuradha Basu **the tavern keeper's** name …
10. Tadhg Clifford's child wants to marry into Teamhair MacIntyre **(the innkeeper)'s** household. → … Teamhair MacIntyre **the innkeeper's** household.

## 7. Stored figures moved AGAIN by 9ddfcaa5a (named, signed by nobody, before and after NOT re-read)

The confinement shows each moves by prose strings alone: golden 242 more towns' strings, census 280 towns'.
- `tests/property/generatorGoldenMaster.test.js` (already red on the line; now 242 more of its 525 towns' strings differ).
- `tests/generators/generationForkCensus.test.js` A1 (the control row's hash, if its town carries a moved string).
- The golden-corpus arms of `pipelinePinnedChoosers`, `rosterFinalUnderHeldRoster` and `powerEconomyFreshness` A4.
- `tests/domain/worldFactRederive.test.js` A7.
- `tests/property/espionageDormancyFence.test.js` FENCE 1 (the driven golden).

NOT RUN at the tip: these files, so their new hashes are not read. The successor runs them and records the before and after.

## 8. Gates at the tip (94a93e24b, content = 9ddfcaa5a + the revert)

- **Green, EXECUTED:** `npm run typecheck:ratchet` 167/167; `npm run typecheck:domain:strict` 1113/1113; `npm run lint` exit 0; both
  presumption doors 0 fresh / 0 stale; the new test and `proseDrawnAnchors`, 18/18; the 7 composer files, 79/79.
- **NOT RUN at the tip:**
  - `tests/lint` WHOLE (last run green at `d1d8ffff8`, 220/3,271). It is EXPECTED red on `sovereigntyLightingContract` "THE CENSUS IS AN
    ASSERTION": the new test file adds 1 file and its titles. Re-take that count by its door at the landing, as the chair does.
  - The governing suites of the changed modules.
  - The rendered measure on all 720.

## 9. Told apart

- **CONFIRMED by execution:** the tool's reproduction; the item 2 verdict; item 3's confinement (0 non-string; every changed string
  number-only or possessive-only, with the bare name kept); the stored measure (5 → 0 verbs; 54 → 1 and 8 → 0 possessives); red first and
  green; the gates listed green; the reverted possessive's moved draw and its 12 stale rows.
- **PLAUSIBLE:** that the 12 stale rows come from `drawnRanges`' tracing.
- **NOT DONE / NOT RUN:** the rendered figure on all 720 at the tip (2 on 422); `tests/lint` whole and the governing suites at the tip;
  the stored figures' new hashes; the one survivor of (d).
