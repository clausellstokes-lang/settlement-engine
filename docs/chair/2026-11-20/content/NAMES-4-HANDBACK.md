# NAMES-4 hand-back

Written by NAMES-4 (a seat of the seventh chair) at the chair's word of 11:52 UTC, 2026-11-20 ("FINISH, DO NOT WIDEN").
Branch `lane/names-4-2026-11-20`, cut at NAMES-3's hand-over `835fabd2d`. That commit already holds the line: `0c9069489` is an
ancestor (merged at `55c4de58a`), so nothing was merged. The tip is pushed. Commits:

- `ad79aa8b1` docs: brief 1 and the mutation tool (`docs/chair/2026-11-20/content/tools/mutation/`).
- `dc126c048` test (builder 1): a swapped agreeing pair reds at any site.
- `92d9bdb31` chore(registers): the lighting census re-taken by its door; the wiring census re-taken, unchanged.
- `d39be3154` docs: brief 2.
- `99aeecb59` fix (builder 2): item 3's three lint reds.
- this file.

**ONE RED OWED:** `tests/domain/facts/census2dTables.test.js` and `census2eTables.test.js` (§5). Both were born at NAMES-3's
`9ddfcaa5a`. Not cured, by the chair's word.

## 1. The cold read: `git diff 0c9069489 835fabd2d -- src tests`, file by file, against CV1 to CV7 and the possessive's ruling

Every changed line was read. Every two-form call has its forms the right way round (one = singular, many = plural).

| file | verdict |
|---|---|
| `src/data/people/powerSentenceName.js` (`fillAgreement`) + `domain/display` re-export | HOLDS: one reader (`powerVerb`); a slot not held takes the singular |
| `src/generators/narrativeText.js` (40 sites, `agree`) | HOLDS. The fallbacks read right ("The authorities" → plural "find"). The two banked rows are survivors (§6) |
| `src/data/people/dmPowerLines.js` (`agree`, `crimAgree`) | HOLDS. `crimAgree` counts exactly what `criminalsOf` prints. The old `guildsOf(f).length > 1 ? 'them' : 'it'` said "it" of "the criminal houses"; the new form says "them". `none[2]` "gives the X its orders" reads as the house's orders, so it is left as written. `equilibrium[2]` is banked (§6) |
| `src/data/people/goalFamilies.js` (8 forms) + `goals.js :: cellCandidates` | HOLDS: the deal is untouched; each "it" left reads of a place or a thing |
| `src/data/stressInstitutionEffects.js` + `npcGenerator.js` (stakes, `{has}`) | Agreement HOLDS. **FAULT: the struck word** (§2 (a)), cured |
| `src/data/people/personMention.js :: qualifiedPossessives` | HOLDS (probes below) |
| `tests/data/powerNumberAgreement.test.js`, `tests/data/goalFamilies.test.js` | Agreement HOLDS. **FAULT: weak by mutation** (§2 (0)) and two lint reds (§2 (b), (c)), cured |

**The possessive's probes (EXECUTED on the helper):**
- A name with no qualifier is untouched.
- "Kit Orr (the king's man)'s hours" → "Kit Orr the king's man's hours". This is a nested possessive, not a doubled name possessive. `npcDisplayNames.js` says an unveiled card can carry such a title.
- A qualifier ending in -s gives "the actress's".
- Two qualified names in one sentence each open their own bracket.
- A curly apostrophe is kept.
- A bare "(…)'" possessive is left. No composer writes it.
- The card's `name` is unchanged.
- On the corpora (§3): 0 card names changed, and the bare name is kept in every changed string.

**(iii) the revert:** `git diff 9ddfcaa5a 835fabd2d -- src tests` is EMPTY. The only difference between them is the NAMES-3 hand-back doc.

## 2. The faults and their cures (each by a builder, red first, diff read line by line, red and green re-run by me)

**(0) The swap plant: no test reds.** I swapped each two-form site one at a time; there are 101 sites (`tools/mutation/mutate.mjs`).
- Of the first 18 narrativeText sites, 8 swaps passed all 8 composer suites (91 tests). Examples: the occupied row's "still signs", "still presides"; "its rivals".
- The cause: the test read only the first verb after a name, and no pronoun at all.
- **Cure, `dc126c048`:** every composer's lines are rendered with "Merchant Guild" and with "Merchant Guilds". Every word that differs between the two renders must be its singular form in the singular render. The test is computed, never quoted.
- The builder's mutation run: **98 killed of 101**. The 3 survivors are doc comments.
- **My re-run, EXECUTED:** 10 sampled mutants all red: the 8 former survivors, the criminal-ruler `itself is`, and the `{has}` slot. Green 24/24 with `proseDrawnAnchors`.

**`tests/lint` WHOLE at `92d9bdb31`, EXECUTED: 3 failed | 3,268 passed of 3,271 (220 files).** All three were born at `9ddfcaa5a`:
- **(a)** `styleLaw.walker`: the retired word "faction" rose 0 → 4 in `stressInstitutionEffects.js`, through the four stakes' `{faction|is|are}` forms.
- **(b)** `mutationCoverageManifest` TOTALITY: `powerNumberAgreement.test.js` had no entry.
- **(c)** `negativeAssertionAnchor`: an un-anchored `not.toContain(")'s")`.

**Cure, `99aeecb59`, no walker widened:**
- (a) The stakes' agreement slot is named `power`, and `npcGenerator.js` hands it `govFaction`. Lines changed in place, none added. A test proves each stake prints what the old form printed, in both numbers.
- (b) Planted regression #142 in `scripts/mutation-sweep.sh`, plus its manifest entry.
- (c) `expectPresentThenAbsent`.
- **Red:** the three walkers red at `92d9bdb31` (my lint-whole run above). **Green, my re-run:** 6 files, 76/76 (the three walkers, the agreement test, `proseDrawnAnchors`, `namesInSentences`).
- **Confinement `835fabd2d` → `99aeecb59`, EXECUTED:** golden 525 identical, census 720 identical, 0 differences of any kind.
- **Vetoable:** NAMES-3's `{has}` word slot was the other way to do (a). The form `{power|is|are}` names a slot the template does not print.

## 3. Confinement `0c9069489` → `835fabd2d` (= the tip's src, by §2), EXECUTED, both corpora IN FULL

| corpus | identical | non-string | changed strings | number-only | possessive-only (bare name kept) | other |
|---|---|---|---|---|---|---|
| golden 525 | 283 | **0** | 899 | 891 | 8 (5 towns) | **0** |
| census 720 | 440 | **0** | 971 | 918 | 53 (32 towns) | **0** |

- Fields (census, strings/towns): goal.long 694/251 · goal.short 203/156 · relationships description 29/23, tension 24/19 · pressureSentence 16/16 · secret.what 5/5.
- Card names changed: 0. Bare name missing: 0. This reproduces NAMES-3's figures exactly.

## 4. CV6, NAMES-3's reader (`agree.mjs`), the census 720, line `0c9069489` → tip `835fabd2d`, EXECUTED

- **(i) verbs, stored:** 5 → **0** (of 2,311 readings). **Rendered, all 720 (both rendered here):** 11 → **6** (of 4,514). All 6 are the generated pool's "{counterpart} has not yet moved" (a survivor).
- **(ii) raw pronoun rule, stored:** plural + it 854 → 456. Every group left reads false by template: "without buying it", "do it well", "keep it longer", "bring it to", "accept it" (the situation), the conflict's "It reaches", "paid to lose it". Genuine (ii): 0.
- Singular + they: 1,471 → 1,479. These stand by CV7.

## 5. Gates at the tip

- **EXECUTED green:**
  - `npm run typecheck:ratchet` 167/167; `npm run typecheck:domain:strict` 1113/1113.
  - The lighting census plain after its refreeze, 34/34.
  - `gen:dossier-prose --check` exit 0; the wiring census unchanged.
- **The governing suites** (every test file naming the six composers, `personMention.js` or `npcGenerator`, 116 files, the seven stored-figure files apart): **2 failed | 1,046 passed | 42 skipped**.
  - **THE RED OWED:** `census2dTables` and `census2eTables`, "every declaring ledger line is declared in place". 5 lines of `docs/census/declarations/` key `PRESSURE_SENTENCES` rows by their text. NAMES-3's `agree` changed the text of under_siege[1], politically_fractured[5], insurgency(street)[1], mass_migration(weakeconomy)[0] and wartime(losing)[0], so each now reads `undefined`.
  - EXECUTED: 36/36 green at the line `0c9069489`, 2 red at `835fabd2d`.
  - The cure is to re-take that ledger's 5 texts by its own door. It is not done.
- **At `99aeecb59`, EXECUTED:** `npm run lint` exit 0; the presumption doors fresh 0 · stale 0 (banked 4635; strips 0/0).
- **`tests/lint` WHOLE at `99aeecb59`:** EXECUTED green, 220 files, 3,271 of 3,271 passed (exit 0, read through gate-tail).

## 6. Stored figures moved AGAIN (all red already at the line; signed by NOBODY), EXECUTED in archives of `0c9069489` and `835fabd2d`

- `tests/property/espionageDormancyFence.test.js` FENCE 1, the driven hash: `cb36943b…6b5d4` → `bf6f92cd…ab992` (constant `9829e655…`).
- `tests/generators/generationForkCensus.test.js` A1, the control row: `adbd469a…` → `26932f67…` (constant `71ea4d5f…`).
- `tests/property/generatorGoldenMaster.test.js`: 521 of 525 configs differ, before and after. The count is unmoved; 242 more towns' strings moved inside it (§3).
- `pipelinePinnedChoosers` A1, `rosterFinalUnderHeldRoster` A1, `powerEconomyFreshness` A4: 40 of 40 sampled golden rows moved, before and after (already saturated).
- `worldFactRederive` A7: red, same message before and after.
- `99aeecb59` moves none of them (§2: 0 differences).

## 7. Survivors, named (not done)

- The crime-knowledge possessive (`npcGenerator.js`, "Has been reading ${otherNpc.name}'s correspondence"): 1 of the census's 54, 0 of the golden's 8. It is NOT retried, by the addendum: the try moved draws.
- narrativeText's two banked rows (" controls one district", " still meets, but nothing it decides").
- `dmPowerLines` `CAPTURE_LINES.equilibrium[2]`.
- The generated pool `power.generated.js`: 6 rendered on the 720.
- The census ledger's 5 texts (§5, owed).
- `docs/census/declarations` still holds the pre-NAMES-3 stakes text (builder 2's note; the stakes tests do not read it).

## 8. Ten sentences, line → tip (the census, verbatim from the born towns)

1. Make the Merchant Guilds so much their own that **it** → **they** could not run a week without them.
2. Build the Religious Authorities up until **it is** → **they are** beyond the reach of the Elder Council.
3. Leave the Craft Guilds stronger than they found **it** → **them**, with Branko Frolov still second and content.
4. Be given the secrets of the Merchant Guilds to keep, as well as **its** → **their** errands to run.
5. Do one thing for the Merchant Guilds this season that the people who lead **it** → **them** cannot ignore.
6. The Household Council in Beikou backed the winning faith … and now **find** → **finds** that a matter of belief has become a matter of who owes whom.
7. The last thing the Merchant Guilds and **its** → **their** rivals agreed on in Benham was that the disagreement should not be allowed to reach the streets.
8. Wadiistan's last strong leader died 9 weeks ago, and the Religious Authorities **is** → **are** taking over the offices.
9. … a purge) that the Religious Authorities helped cause and **has** → **have** been concealing.
10. Dhara Kumar kept Anuradha Basu **(the tavern keeper)'s** → **the tavern keeper's** name out of a scandal that ruined two others.

## 9. Told apart

- **EXECUTED:**
  - The cold read, and its probes.
  - The mutation pass (partial before, 98/101 after) and my red re-run of 10 mutants.
  - Both confinements in full; the CV6 counts on both renders.
  - Lint whole at `92d9bdb31` (3 red) and builder 2's green.
  - The governing suites (2 red, owed) and the stored figures before and after.
  - The two typechecks.
- **REPORTED BY A BUILDER, not re-run by me:** builder 1's full 101-mutant run; builder 2's sweep plant #142 (clean / planted / restored).
- **NOT RUN by me:** `scripts/mutation-sweep.sh` whole; the e2e or build gates (not asked).
