# R3-CURE-2 HAND-BACK (VEIL-24's builder; worktree `/home/user/wt/r3c2`, branch `v24-r3c2`, one commit on 06e9e64b3)

## The bytes
- 211 BYTE-FROZEN at this commit: `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, rollback
  `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (both unchanged; `sha256.txt`).
- 212 `de3efccb…eb9f` (06e9e64b3) -> `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2`.
  Its rollback `653ae8b2…ab2f4` -> `40357bed2f44aa8c8b14179a83992d891ddb5a0b31c6dff47f204871091065b1`: ONE NEW HELPER,
  `public._gallery_veil_power_named(jsonb, text[], jsonb)` (R3's section, called only by `_gallery_veil_roster_choices`), revoked
  from public, anon and authenticated by name in 212 (VR27) and dropped beside `_gallery_veil_roster_choices` in the rollback.
- Every cure is in 212's `-- R3: the roster choices` section AND the twin `galleryRosterChoices.js` (`applyRosterChoices`, its new
  `withholdPowerCopies`), rule for rule. Nothing of R4 or R5's composers touched.
- Chains built HERE (scratch PG16, /var/tmp/rv7): `r3c2_x211` (001..211), `r3c2_base` (001..212 at 06e9e64b3, from a copy of its
  migrations), `r3c2_after` (this commit). Probes: `measure/keys.probe.jsx` (+ `keys-an.mjs`, `dist-an.mjs`, `run.sh`).

## Unit 1 — THE FOLD (the chair's ruling 28) — CONFIRMED
- PLANT `hand-fold` (born test): withheld "Thieves' Guild (powerful)" (number id 7) named by its BARE form "Thieves' Guild" in both
  conflict lists, the tension, `contestsNiche`, a membership, `factionAffiliation`, a goal sentence; `{ id: 7 }` membership and a goal
  aimed at id 7. RED at 06e9e64b3 (`born-red.full.log`: unit-1 arm 102 lines; e.g. `powerStructure.conflicts[].parties[] = "Thieves' Guild"`
  served on every read), GREEN after (`born-green.full.log`, 20 of 20).
- The search (born arm and both engines) is THE LANE'S OWN: `gallerySecondHomes.js :: buildNameSearch` (twin, test) and
  `_gallery_veil_name_search` / `_gallery_veil_name_hits` / `_gallery_veil_name_hit` (212): the name and its bare form, folded, at the
  name boundary; the served powers' names are the open names. No third fold written. An id: a STRING (a number by String() / its
  jsonb text), the whole value; the born arm searches it as a value, a key, and a number at an `id`.
- FOUND BY THE FOLD, CURED: `simulationTrace[].targetId = "faction.thieves_guild"` under Reveal DM (12 hits, 3 born towns:
  town-infiltrated-0-12, city-politically_fractured-0-40, metropolis-indebted-0-56; the literal search never saw the slug). A trace
  entry a top-level string of which names a withheld power now leaves WHOLE, the trace renumbered dense after (VR21, `ts` = index, the
  apply's own rule). 0 after.
- THE TOOTH (executed): the goal aimed at the SHOWN "Harbour Board" and its membership are served byte for byte (canonical key order)
  on every read that serves goals (4 reads); the shown conflict and the Ropers membership stay.

## Unit 2 — THE DERIVED DEFENSE KEY (the chair's ruling 2; the seat's relay of 09:18) — per-town CONFIRMED; the distribution NOT MET AS WORDED
- ATTRIBUTED FIRST (`unit2-keys-base.txt`, 92 hidden-house towns, both engines, Reveal off and on; each key field swapped alone to
  the counterfactual's served value): (a) city-none-0-37, city-wartime-0-49: `criminalInstitutions` alone ("Rival Gangs");
  city-none-0-31: no single field (Rival Gangs served AND the counterfactual's income row withheld). (b) town-indebted-0-16,
  town-wartime-0-19: `availableServices.criminal` alone ("Fencing stolen goods", institution "(covert)"), NOT the income row.
- CURE (212 + twin, where a house is hidden whole): (a) THE WHOLE OPERATIONS LIST is re-derived over the SERVED houses by the engine's
  label table (`crimlabels` / `CRIMINAL_INST_LABELS`, held equal to safetyProfile.js's CRIMINAL_INST_LABELS by a new arm of
  `tests/lint/rosterChoicePools.walker.test.js`, with its tooth; `unit2-labels-walker-green.txt`): an entry kept, in order, only as many
  times as served houses carry its label; VR29: still an array. (b) a `(covert)` criminal service is WITHHELD (servicesGenerator.js draws
  it from the criminal climate the houses moved; no served field re-derives it). Registry: `safety.criminalInstitutions` scope and
  `SERVICES_WHY` amended with the reason (`registry-check.txt` exit 0).
- PER TOWN, AFTER (`unit2-keys-after.txt`, 92 towns): server off / dm and twin off / dm each EQUAL 79, LOWER 13, HIGHER 0
  (base: 78 / 9 / 5). "Magical crime" served where the counterfactual has none: 0. Born arm (14 named towns, both engines, both
  Reveal settings): HIGHER 0, every LOWER with its cause named (`born-green-measures.txt`).
- THE 13 LOWER, each by its cause (all WITHHELD fields; none is a served field read as a tell): `incomeSources` (the criminal income
  row the apply withholds; the counterfactual's own economy writes one): city-none-0-31, town-insurgency-1-94, town-under_siege-0-18,
  town-under_siege-1-88; `incomeSources` or `servicesCriminal`: city-under_siege-1-118, town-under_siege-0-28, town-under_siege-1-98,
  town-wartime-0-29; `servicesCriminal` (this cure's covert withholding, or X-21e): town-none-0-17, town-none-1-91; `powers` (R3's
  power.entry withholds a Thieves' Guild no hidden house raised; the first cure's unit 5 loss): metropolis-insurgency-1-124,
  metropolis-wartime-0-59, town-none-0-23.
- THE DISTRIBUTION (`unit2-distribution-after.txt`): "Rival Gangs" served 0 of 92 (was the relay's 17 of 33). Every label still
  served is served EXACTLY as the house-free counterfactual serves it (Gambling District 38/92 both, Red Light District 32/92 both,
  Gambling Halls 18/92 both, Gambling Den 3/92 both; served where the counterfactual has none: 0 for each), i.e. by a SHOWN house.
  AGAINST THE CONTROL (48 towns with no hideable house): key semi-organized 67% vs 15%, Gambling District 41% vs 4%. The
  counterfactual itself sits there (semi-organized 64%). The hidden-house pool is the crime-heavy draw; the control is not a like
  pool. ACCEPTANCE 2 AS WORDED IS NOT MET, AND NO SERVED VALUE EXCEEDS ITS TOWN'S COUNTERFACTUAL: STOPPED FOR THE SEAT on which
  comparator rules (I would tell the seat: the counterfactual, per town, is the like-for-like one).

## Unit 3 — THE TWO GUARD REDS (the chair's ruling 3) — NOT FINISHED: ONE LEAD OPEN FOR THE SEAT
- RE-STATED in `tests/security/galleryServerVeil.pglite.test.js` only: law (2)'s reference drops a person's goal that targets or
  names (the lane's fold) a power of the stored record the page after 212 does not serve, with the reason in the test
  (`goalsLeaveWithTheirPower`; it counts `control.goals` and `control.shownGoals`).
- THE TOOTH ARM RAN RED and is NOT COMMITTED (`guards-security-1.txt`: 80 of 81, the tooth `expected 0 to be greater than 0` on
  `control.goals`): at this commit the two towns pass (server-veil-city-infiltrated-0, server-veil-metropolis-3) because the
  Reveal-DM goals the first cure withheld (`npc_mages_guild`, `npc_smelter`; their target is `{ family, key, kind }`, no id) are
  SERVED again: the first cure matched the LITERAL label as a case-folded substring of the goal sentence; the lane's fold (name
  boundary, served powers' names cut out as open names) does not match them. NOT ATTRIBUTED (the mark): either the literal match
  was a false positive (a withheld name inside a longer served word or name), or THE FOLD MISSES A FORM AND THE GOAL IS A LEAK.
  FIRST READ OWED: print those two goals and the withheld powers at default+dm (`/tmp/claude-0/.../scratchpad/goal.probe.jsx`
  started it; its dials did not reproduce the town before the stop). Until then, treat it as a possible leak.

## Unit 4 — THE SEAT'S READ OF 06e9e64b3
- (i) NUMBER IDS — CONFIRMED: `wn` took only string ids in both engines. Plant `hand-fold` (`{ id: 7 }`, goal target id 7): RED at
  base (the membership and goal served), GREEN after (match by String() / jsonb text).
- (ii) THE SHARE SUM — CONFIRMED, the engines DISAGREED: plants `hand-shares-a` (0.1, 64.1, 35.8: decimal sum 100, double sum not)
  and `hand-shares-b` (thirds: double sum 100, decimal sum not). RED at base: the twin re-derived A to [0,64,36] and kept B, 212 the
  reverse (14 reads, `born-red.full.log`; the twin arm red too). CURE: the twin compares the EXACT decimal sum (`sumIsHundred`, the
  shortest spelling summed as integers at one scale), as 212's numeric. GREEN.
- (iii) A POWER WITHHELD WHERE NO HOUSE IS HIDDEN WHOLE — MEASURED, NOTHING TO CURE: base hits 3, all the hand town's PARTY LINK with no
  veil record (bare-form copies); the link's default hides that town's criminal house whole, so they were unit 1's, and the fold cured
  them. After: 21 reads judged (no house hidden whole, a power withheld), 0 hits. The copy pass's `whole` gate stands. (PLAUSIBLE:
  that the link's default hides the house whole is read from the cure's effect, not traced through `_gallery_veil_resolve`.)

## Unit 5 — THE OWED RUNS (files here; `guards-exits.txt`)
- Born test `galleryRosterChoices.pglite`: RED 6 of 20 at base (`born-red.txt`, `born-red.full.log`), GREEN 20 of 20
  (`born-green.txt`, `born-green.full.log`, `born-green-measures.txt`).
- Guards (`guards-exits.txt`; each batch's `.txt` and `.summary.txt`): `guards-security-2` (gallerySanitizer,
  galleryMapMemberCount, VR17's galleryVeilSignalCopies, R2's galleryWithholdAlways) exit 0, 61 of 61; `guards-harnesses`
  (shareRenderTwice, rosterChoiceInversion, criminalSwitchHandReach = V10-2's third) exit 0, 22 of 22; `guards-security-1`
  (galleryVeilHandRows, gallerySecondHomes, galleryVeilCures, galleryServerVeil) 80 of 81: the two towns GREEN, the uncommitted
  tooth red (unit 3 above).
- `guards-twin` (16 files): 254 of 260. observedShapeReaders 2 (KNOWN, not touched). FOUR MORE, ALL RED AT 06e9e64b3 TOO (run on an
  archive of that commit, `twin-reds-at-base.txt`, the same four): `criminalVeilSwitch` VR34 (b) ("a power's members carried only on
  master's top-level list") and `publicSafe` three ("criminal faction ... name, category and standing stay": a Thieves' Guild
  faction now withheld; "Defense's criminal architecture ... their data goes"; "flipping every eye to shown reveals no DM-only
  field"). NOT THIS CURE'S; R3's / the first cure's power.entry most likely (PLAUSIBLE); criminalVeilSwitch was to stay green: it is
  not, at the base too. FOR THE SEAT.
- Known reds (`known-reds.txt`): phoneChromeFloor.census, presumedThings, presumptionClasses, writerReach: red, untouched.
- Registry `--check` exit 0 (`registry-check.txt`); its walker and the pools walker green in `guards-twin` (the pools walker's new
  label arm green, `unit2-labels-walker-green.txt`; it cannot pass at the base, which holds no table: PLAUSIBLE red, not run there).
- THE ACCEPTANCE RUN (REVIEW-VEIL-7 run-all on this tree): EXIT 0, 40 PASS, 0 FAIL, server against twin all 15 equal
  (`acceptance.txt`).
- Typechecks: domain:strict 0 (1113 at its ceiling), ratchet 0 (`typecheck-*.txt`). eslint on every touched file 0 (`eslint.txt`).
- THE COST LAW (chains r3c2_x211 | r3c2_base | r3c2_after; `cost-big-town.txt`, `cost-v8245.txt`; the largest born town
  regenerated, sha a060ce8d…): gallery off 442.9 | 677.1 | 697.7; gallery DM 210.0 | 598.0 | 593.0; link 304.0 | 568.0 | 545.0 ms.
  BOUND: DM after 593.0 <= 2 x 442.9 = 885.8, MET. v8245 medians: V8-3 row 6620 | 7818 | 7550; 50/500/500 115 | 217 | 253 (2.2x
  211, tight; base 1.9x); 300 KB rows 431 | 440 | 464 and 1608 | 1562 | 1587 ms.

## Unit 6 — THE OWNER'S COUNTS
- power.entry is untouched by this cure, so the first cure's counts stand (NOT re-run here): 9 born pages lose a Thieves' Guild row
  no hidden house raised (`out/v23/r3c/unit5-reach.txt`); VR42 (a governing power a hidden house raised) reached by 0 of 140 born
  towns (`out/v23/r3c/unit1-vr42-counterfactual.txt`), proved on the hand town `hand-governs` (share 60, served whole).
- New beside them: the covert withholding moves 4 towns' keys below the counterfactual (diffuse -> null: town-none-0-17,
  town-under_siege-0-28, town-wartime-0-29, city-none-0-31's second cause).

## R5's list (prose, not touched)
- `powerStructure.factions[].desc` and its top-level copy `factions[].desc` (a SHOWN power's description naming the withheld guild):
  the first cure's count 20 hits / 2 towns + 4 (`out/v23/r3c/unit2-measure-copies-after.txt`); the born test's towns: 0
  (`born-green-measures.txt`).

## CONFIRMED / PLAUSIBLE
CONFIRMED: every red and green above with its file; zero towns HIGHER in both engines. PLAUSIBLE: (iii)'s attribution of the base
hits to the link's default veil; that no served field other than the six the key reads moves it (the attribution swaps those six).

## WHAT IS LEFT (stopped at the mark)
1. Unit 3's lead: the two Reveal-DM goals the fold no longer withholds (possible leak; attribute first).
2. The distribution acceptance (unit 2) is not met as worded; the per-town counterfactual is met: the seat's ruling on the comparator.
3. The four twin reds present at 06e9e64b3 (criminalVeilSwitch VR34 (b), publicSafe x3): not this cure's; for the seat.
4. Unit 6's counts not re-run (power.entry untouched).

Last line: this commit is the one on `v24-r3c2` carrying this file (parent 06e9e64b3); it touches 212, its rollback, `galleryRosterChoices.js`, `rosterChoiceRegistry.js`, `rosterChoicePools.walker.test.js`, `galleryRosterChoices.pglite.test.js`, `galleryServerVeil.pglite.test.js` and `out/v24/r3c2/`; 212 sha256 `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2`.
