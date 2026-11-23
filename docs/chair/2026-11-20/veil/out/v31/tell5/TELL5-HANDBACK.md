# R3-TELL-5 HAND-BACK (VEIL-31's builder; worktree `/home/user/wt/r3tell5`, branch `v31-r3tell5`, from f22bb8324)

This sitting: unit 0, unit 0b (the seat's mid-sitting order), unit (ii). Unit (iii) NOT started (the seat's order).

## STOPS (first)
1. **STOP (sp.crimeTypes, 1 town, `r3m-city-under_siege-1-108`, 20 pages, Reveal off): THE CURE WOULD TAKE A CRISIS'S TYPE
   (VR39).** The one type left is "black market food", the siege's own (raisers [] in both engines' maps); every
   house-raised type has already left. Withholding it would cross VR39 ("a shown house or a crisis keeps its types").
   Not cured. Its other separators are `inst.criminal`/`chains.criminal` 0->+ (the nearest member HAS them).
2. **TO THE SEAT, NOT CURED (sp.ops, 2 towns, `r3m-town-infiltrated-0-12` 20 pages, `r3m-town-insurgency-0-14` 16 pages,
   Reveal off): THE ENTRY LEFT IS ACCOUNTED FOR.** Both serve `criminalInstitutions` ["Gambling Den"], and a SERVED house
   (the Gambling Den, neither criminal by category nor hideable) carries that label: the existing re-derivation over
   the served houses (R3-CURE-2 (a)) already keeps exactly what a served house accounts for. A rule by positive account
   keeps it, so this unit builds nothing for it. Withholding a label a served house carries needs a ruling. (Town:
   `[]` is an open place's form there, 299 of 452 births, so the form would not be a STOP; the account is.)
   sp.ops went 3 -> 2: `r3m-city-none-1-117` (DM) closed with the services.
3. **inst.criminal and chains.criminal did not close** (6 towns each, 168 pages, "0->+"): as ruled, nothing is sent
   for them; said, not cured. income.criminal CLOSED (1 -> 0).

## PROGRESS
- (0) people.allegiance registry marker (ruling 77), commit db8cc08f4: walker red 1/11 at 5818130c4 -> green 11/11. GATE-1/2 not moved (comment only).
- (0b) mutation manifest (the seat's order of ~00:55), commit c0f8faf21: mutationCoverageManifest TOTALITY red 1/10 (galleryVeilTell3, galleryVeilTell4) -> green 10/10.
- (ii) svc.criminal, red d6d8644b2, cure 369331d72: GATE-1 4/92 (7 LOWER BY RULE), GATE-2 26/40 red; families left: powers.capture 21, inst.criminal 6, chains.criminal 6, powers.criminal 3, sp.ops 2 (STOP 2), powers.relations 2, sp.crimeTypes 1 (STOP 1), imports.criminal 1, tensions.crime 1.

## UNIT (ii)
- STEP 0 (`measure/step0.probe.jsx`: VEIL-30's builder's unrun probe, read whole, taken; rows recorded for every birth and
  a served-house bit added; `step0-reading.txt`): the gate's 140 births, twin AND server, every setting but g:111, Reveal
  off and on, 5,600 pages. Any key `allegiance` at a path but `npcs[i].allegiance`: **0** (no STOP). Person copies served:
  `factions[].members[]` 0, `powerStructure.factions[].members[]` 0, object-valued relation ends 0.
- THE TWIN'S FORM (`out/v29/tell4/measure/twinform-ii.txt`, re-read per size): `availableServices.criminal` `[]` in 184
  (town), 309 (city), 305 (metropolis), 340 (village) of 452 nothing-hidden births: `[]` is an open place's form at every
  size. `criminalInstitutions` `[]`: town 299, city 110, village 452, metropolis 0 (untouched: no metropolis in sp.ops).
- WHAT SEPARATED THE FAILING PAGES (`step0-reading.txt`, `step0-rule.txt`): the crime-type tag rows served after their type
  had left ('(smuggling)' 550 page-rows, '(arcane underground)' 390, '(commercial crime)' 180, '(religious fraud)' 150,
  '(street gang)' 40); no criminal row on a hidden page named a served house.
- THE RULE (both engines; 212 (e) in `_gallery_veil_roster_choices`, twin in `applyRosterChoices`; registry: the services
  note SERVICES_WHY): a criminal services row stays only BY POSITIVE ACCOUNT, its `institution` a listed house's name or
  the tag of a type VR39 keeps over `pub`'s own list (servicesGenerator.js writes each tag row from its type); everything
  else leaves; the list stays a list.
- RED (`u2-red*.txt`): 90 faults, both engines alike ('(lawless)', '(informal)', '(religious fraud)' on 30 hiding reads);
  and the gate's 27 towns / 320 pages at 5818130c4. GREEN (`u2-green*.txt`): 0 faults; the tooth 90 rows byte for byte.
  Tell3 + Tell4 + Tell5 arms 5/5.
- THE GATES (`u2-gate/tell2-table.txt`; cache `u2-verify/verify.txt` 45 / 0 differ; t5tpl = v27x211 + 212 64453e56):
  GATE-1 4 of 92 every gated setting, Reveal off and DM, twin = server, 7 LOWER BY RULE (the same seven); controls 0 of 48.
  GATE-2 26 of 40 cells red (was 34), twin = server every cell; non-members off 36 -> 10, DM 46 -> 26.
- ROWS LOST (`u2-rows-lost.txt`, own read): 61 of 92 towns lose a criminal services row; median 1, worst 7.
- `tests/lint` WHOLE at the cure (`u2-lint-whole.txt`, `u2-lint-failing.txt`): 16 files red, ALL PRE-EXISTING, none mine:
  the seat's 12 red at 2437ffea0 (chainPrintSites, domainAnyCastBaseline, factLayers, moduleScopeCwdRatchet,
  negativeAssertionAnchor, noLegacyFactionReaders, proseDrawnAnchors, proseWiringCensus, seedLoopTotality,
  slugifyIdiomBaseline, sovereigntyLightingContract, styleLaw) and PART 30's known four (observedShapeReaders,
  presumedThings, presumptionClasses, writerReach). rosterChoiceRegistry.walker and mutationCoverageManifest green.
- eslint on the three touched files 0; registry `--check` 0; VR27: no new 212 helper.

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (executed): step 0's 0 hits; the arm red then green on both engines; the cache verify; every gate count above;
  lint whole's list; the hashes.
- PLAUSIBLE: the rows-lost figures and `step0-rule.txt` stand in each page's SERVED types for the rule's attribution over
  `pub`'s list (equal where the types grouping is open); the tag-to-type table read from servicesGenerator.js and
  safetyProfile.js by eye, not held by a walker (a tag it misses fails toward withholding).

## FOR THE OWNER, in plain words
A shared page with a criminal house hidden could still list underworld services (smuggled goods, illicit magic, forged
relics) that only that house's presence had produced, which ordinary towns never show without a gang of their own. Now a
criminal service is shown only where something the page itself shows explains it: a house on the page, or a kind of crime
the page shows and an ordinary town of that kind would have. Twenty-seven towns stopped standing out this way. Three towns
still stand out in this family's lists: one through a crime its siege itself causes (which the rules keep), two through a
gambling den the page shows openly; both need your chair's word.

COMMITS: db8cc08f4 (212, galleryRosterChoices.js: the marker); c0f8faf21 (scripts/mutation-coverage-manifest.json);
d6d8644b2 (red: tests/security/galleryVeilTell5.pglite.test.js, the manifest, out/v31/tell5/{u0,u0b,measure,step0 records,
u2-red*}); 369331d72 (cure: 212, galleryRosterChoices.js, rosterChoiceRegistry.js, out/v31/tell5/u2-*); the commit
carrying this file. 212 sha256 64453e569c4b346360ef0b7228b94ff7de3ae718c15b6378c2ab70bc5903b4b9 (after unit 0:
4e7e4a22826cd257c4eec0823ffef31056df4a50e3de4cb3685c064f51b2da1c); rollback 8cbd7d1c…ded5b0 and 211 eface6d0…0b01 unchanged.
