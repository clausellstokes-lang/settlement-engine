# (A) THE DOOR AS IT IS (tree 682667fe2; read: PLAUSIBLE unless a count is named)

**What a declaration is.** A pool line declares the atomic facts it presumes as `{ needs, excludes, crisis }`
(`src/domain/facts/factVocabulary.js :: declarationOf`): `needs` = presence or band atoms the record must hold
(`walls`, `institution: mill`, `tier: ≥ town`); `excludes` = presence atoms it must not hold (the twin's side);
`crisis` = a DISJUNCTION of crisis kinds or groups (`crisis: famine, under_siege`; `calm`; `any`). Atoms of different
dimensions are a CONJUNCTION. Four carriers fold into the same shape: a row's own `needs/excludes/crisis` columns; a
registry's `tags` (`X` = needs, `no X` = excludes) only where the site says `tagged` (`:: declarationOfTags`); a
state-prose variant's `marks` (every mark that is not the audience mark or a kernel dimension word,
`src/domain/display/stateProse/stateProseKernel.js :: variantFactDeclaration`; the kernel's own fact marks `walls`,
`threat`, `hunger`, … map through `:: declarationOfMarks`); a position-keyed parallel list for vid-less lists
(`stateProseKernel.js :: resolveDeclaredPosition`). A pool can also carry atoms of its own (`poolDeclares`, the key's
guarantee) and opt into the crisis dimension (`crisisScoped`: silence reads `calm`).
**Colour** (`:: COLOUR_MARK`, `:: isColourLine`): `{ text, colour: true }` or `[colour]` = "read; presumes nothing". It is
NO atom: the draw reads it as silence (a colour line is admitted everywhere); only the census counts it as declared.
**Twins** (`src/domain/facts/drawDeclared.js :: drawDeclared`, `:: resolveSibling`): a sibling row `{ text, twinOf:
<original text>, excludes/needs }` that is OUT of the draw's domain and reached only when its original is refused.

**How an atom is answered** (`factVocabulary.js :: atomHolds`): `parseAtom` finds the dimension in `FACT_DIMENSIONS`;
its ONE reader reads `factsOf(record)` (`src/domain/facts/factsOf.js :: factsOf`, ~70 lazy getters); a presence answer
must be a boolean, a band answer is compared on the dimension's ladder. `undefined` = UNANSWERED: no facts object, a
reader that returned non-boolean, a band value off its ladder, a context atom (`other npc`, `own house`, the pair
atoms, `food production`) called without its `ctx`. **What unknown does today** (`:: declarationAdmits`, "THE ONE
RULE"): a `needs` atom is refused unless `=== true`, an `excludes` atom unless `=== false`, the crisis disjunction
unless `crisisAdmits === true` — so UNKNOWN REFUSES on both sides (fail-closed), and a declared pool drawn with no
`facts` refuses every declared line (`drawDeclared`, kernel `eligibleVariants`: a factual pool with no facts → `[]`).
ONE EXCEPTION, fail-OPEN by design: `resolveSibling` keeps its original when the record is unanswered (no facts).

**What a refusal does** (`drawDeclared`): the site's own selector draws over the FULL pool (twins aside, `held` texts
removed); an admitted winner is kept byte-identical; a refused winner resolves, without a roll, to (1) a fresh admitted
template where the site passes a no-repeat `registry` (`:: freshAdmitted`), else (2) its twin if admitted, else (3)
the admitted member with the highest `hashKey(key::lineId)` (argmax), else `kept` (`keepRefused`: the refused line
PRINTS anyway and is noted) or `none`. `filterDeclared` (kind A: a list printed whole) drops each refused item. The
kernel PRE-FILTERS (`eligibleVariants`) and then takes the hash argmax by vid (`drawVariant`), so a refused variant is
never drawn and the argmax lands elsewhere. Every resolved draw is noted in the presumption ledger
(`presumptionLedger.js`), replayed against the final record only by the test-time self-check
(`presumptionCheck.js :: presumptionFindings`; no `src` caller).

**Every place a line is refused for a reason OTHER than its declared atoms** (found by reading; the list is the
reading's, not a census):
1. `held` (MERGE-R2): a text the roster already carries is out of the domain (`drawDeclared :: heldTest`).
2. the no-repeat registry (`hookVariety.js :: drawUnique`, through `freshAdmitted`): a used family or theme.
3. the pool's own atoms (`poolDeclares`) and `crisisScoped` silence-as-calm: a POOL-level refusal of every line.
4. the kernel's law 5 (`eligibleVariants`): a pool partitioned by a dimension the caller did not answer is SILENT;
   `variantIsAudible` (the `dm-only` mark off the player face); `variantIsAnchored` (a variant whose slot is missing).
5. `fillSlots` returning `null` (`stateProseKernel.js`, `decreeProse.js`, `causalDossierProse.js`,
   `eventCatalogue.js`): a filled line with an unanswered slot is dropped AFTER the draw.
6. Daily Life `pickNameable` (`src/domain/dailyLife.js`): a line naming `{house}` is eligible only where the live
   roster names that house (`housesNamedIn` × `houseFinder`) — A NOUN GUARD ALREADY IN FORCE, on text, not on an atom.
7. Daily Life `yields` (`dailyLife.js :: outsiderParts`, `:: statedAlready`) — see `stated` below.
8. text-veto filters: `narrativeGenerator.js` keeps only templates with no `defenseWordsFindings` (a pool line that
   names a defence the place lacks is dropped by a WORD test, not a declaration); `factionRoles.js` swaps a role for its
   `twin` on a failed declaration; `resourceEventAdmission.js`, `historyGenerator.js`, `foundingRowAdmits.js`,
   `people/poolMap.js`, `cultureProfiles.js`, `pdf/lib/cultureOnPage.js`, `arrivalScene.js` call `declarationAdmits`
   directly, OUTSIDE `drawDeclared` (their own resolution rules: next admitted row, drop, twin).
9. hand-written gates that read one atom and swap the WORDS (not the line): `stressNarrative.js` (`grain`, `imports`,
   `rival power`, `route: isolated`, …), `crisisSummaryVantage.js`, `guardLineUnderTheLaw.js`, `settlementQuickGuide.js`
   (`livestock`), `traditions/genesis.js` (`institution: farmland`). These answer FALSE vs anything-else, so an UNKNOWN
   there reads as "not false" — FAIL-OPEN in practice (`atomHolds(..) === false` tests).

**What `stated` and `yields` do** (`dailyLife.js :: composePublic`, `:: pickNameable`, `:: outsiderParts`). Each Daily
Life pool file declares per BRANCH what its line does (`<POOL>_DOES`: `{ states: '<condition>' }`, `{ consequence:
true }` or `{ names: true }`; e.g. `foodCulture.js :: FOOD_CULTURE_DOES` `strained → food:want`;
`unspokenTopics.js :: UNSPOKEN_TOPICS_DOES` `tension:<x>`). `composePublic` derives the seven other public slots
first; each picked line ADDS its branch's condition key to `ctx.stated`; then the outsider line YIELDS (drops, or
re-picks among the options left) any part whose branch STATES a condition already in `stated`. **It is a NO-REPEAT
rule, not an exclusion rule**: it keeps one condition from being said TWICE (same key), reads the branch's
declaration (never the words), is scoped to ONE tab's eight slots, and never refuses a line because another line
says something INCOMPATIBLE. The charter's "precedent" for "THE PAGE ADMITS" therefore exists only as a sameness
set; there is no relation between claims anywhere in the engine today except a line's own `excludes` against the
RECORD (a line never reads another line's claims).
