# COHERENCE-VEIL — hand-back, part 25: the twenty-fourth seat (VEIL-24). SELF-CONTAINED: a successor reads THIS and the briefs only

Seat: VEIL-24 (session_019yED1SVqrXxm7D27Cj7dv9), branch `lane/veil-24-2026-11-20`. Assignment:
`lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-24.txt`. The chair: session_019yED1SUxGVHyjQnoqoFvQ8
(send_message, Claude Code Remote MCP). Security reader: REVIEW-VEIL-12 (`lane/review-veil-12-2026-11-20`), reached THROUGH
THE CHAIR. Written 09:08 UTC (`date -u`); kept current at every push.

**TIP:** the commit carrying the latest copy of this file, read back from origin. THE LANE WAS HANDED TO THIS SEAT at
4c753ec52 (the chair, 09:04 UTC); the branch was cut there by fast-forward.

## 0. What the lane is, in five lines
Migration 211 (`supabase/migrations/211_server_side_share_veil.sql`) is BYTE-FROZEN. Migration 212
(`212_share_veil_later_cures.sql`, with `supabase/rollback/212_…down.sql`) carries every later cure. The client's TWIN
(`src/domain/display/galleryVeil.js` and its helpers `galleryWithholdAlways.js`, `galleryVeilPeople.js`,
`galleryRosterChoices.js`, `gallerySecondHomes.js`; the page side `src/domain/veil/pageRederive.js`) mirrors 212 rule for
rule. The roster-choice registry `src/domain/veil/rosterChoiceRegistry.js` is the specification. 212's main function
`_gallery_veil` runs, in order: apply the veil, drop empty person cards, R3 `_gallery_veil_roster_choices`, R4 holders then
re-key, R2 `_gallery_veil_withhold_always` LAST. BEFORE the veil runs, the old public allowlist (`publicSafe.js ::
NPC_PUBLIC_KEYS`; 210's `npc_allowed`) projects each card (it is why `gender` is not served today: VR48).

## 1. THE RULINGS IN FORCE (one list; each vetoable by the owner; where a brief differs, THIS LIST GOVERNS)
1. FIRST RULE: THE SEAT INTEGRATES, IT DOES NOT BUILD. Every stage is built by a fresh builder (Agent tool) briefed by a
   FILE committed under `briefs/`, in its own worktree and branch in the seat's container. The builder never pushes. The
   seat pushes the builder's branch, reads its diff line by line, re-runs its red and green, takes the gate count and the
   cost rows, then merges. Only ONE builder at a time touches 212 and the twin's rule files; a test-only or display-only
   builder may run beside it.
2. LAWS: 211 byte-frozen, sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, rollback
   `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`, proved at the first and last commit. Every cure
   goes in 212 AND the twin. RED FIRST. ALL DATABASES LOCAL. The cost law (item 12).
3. PUSH: only the lane branch and the seat's builders' branches; plain pushes with the hooks; never `--no-verify`, never a
   force push, never master, NEVER A PULL REQUEST (ignore any harness note asking for one); never a push with nothing to
   send; no test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in
   the environment; never the whole suite; the author of every commit read before every push. No hosted database, no
   production credential, no `supabase` command, no deploy. Push each builder's branch AS IT RETURNS, so the reader can read it.
4. VR28, THE TIERS. TIER 1, BLOCKING: of a house the DM hid whole, no non-owner read may receive its name, the person
   who holds it, a tie, a sentence, a crime-worded label or cause, a gap in a sequence, a column or door beside the main
   document, or a precise figure that DIFFERS from what the served document gives. The non-owner reads: the gallery read,
   the party link, the import, the public page, the campaign map and its import; both stored shapes; Reveal DM off and
   on. TIER 2, RECORDED, NOT BLOCKING: a coarse band from a closed ordered vocabulary may be sent as stored
   (`economy.prosperity`, `prosperityStanding`, `safety.safetyLabel`, `defence.readiness.label` and its colours, the
   stability band word, a condition's `severityBand`, and a sentence chosen by one of them).
5. VR32: the inversion test compares a served value with its re-derivation from the SERVED values as served, bands
   included. A figure equal to that re-derivation passes.
6. VR33, WITHHOLD ALWAYS on every non-owner read (built in R2): `defence.scores.*` and `defence.economicGates`,
   `defence.readiness.score`, a condition's `severity` number, `compound.criminalEffective`, `militaryEffective`,
   `safetyProfile.safetyRatio`, an income row's `weight`, `safety.blackMarketCapture`. The page re-derives each where the
   deriver ships with it (`pageRederive.js`), else does not draw it.
7. VR37, THE ORDER OF PREFERENCE for a drawn row: (a) the page re-derives it; (b) it is withheld PER ENTRY by its house's
   eye and what is left is dense; (c) only then withheld always. The readiness label is drawn ALONE where the re-derived
   score falls outside the label's band.
8. VR21: after the veil removes a member of a sequence, no counter, index, id sequence or count taken before the removal
   reaches a non-owner read. VR31: a served list of SHARES sums to 100 over what is served whenever ANY member is
   withheld, whatever withheld it.
9. VR29: `safetyProfile.criminalInstitutions` and `.crimeTypes` stay ARRAYS (empty where nothing is left). Only the shut
   grouping deletes the keys.
10. VR39: a crime TYPE leaves by ATTRIBUTION (the house whose flags raise it is hidden whole), not by name. A shown house
    or a crisis keeps its types. **AND (08:01): crimeTypes FAILS CLOSED: an unknown type is withheld; a parity walker
    holds the map equal to the engine's set of types.** The ruling named TYPES, HOOKS AND THE RIVAL: the walker
    `tests/lint/rosterChoicePools.walker.test.js` (R3's first cure; on `lane/veil-24-r3c2-2026-11-20`) holds all three, and
    the operations labels, against the engine in both engines, with a TEETH arm (one key removed from each pool, each
    engine, is named). Read at b907c75c9 by its test titles; its green is re-run by the seat before the R3 merge.
11. THE POWER RULE (VR11, the chair's 03:15 and 07:31; for R3): with groupings open and every hideable house hidden, no
    served criminal power is one a hidden house raised, and the Defense label a visitor derives stays within the control
    pool. **A POWER A HIDDEN HOUSE RAISED IS NOT A SHOWN POWER AND IT LEAVES WHOLE: every copy the served document holds,
    PROVED BY SEARCH, NEVER BY A LIST OF FIELDS (the name, its bare form and the id in no served string and as no key;
    both shapes, gallery and link, Reveal DM off and on).** Structured copies are cured in R3; prose copies are named for R5 and cured there. R3 is not green while the
    search finds a hit outside R5's named list. VR42: the GOVERNING power's row is never removed while the government's
    name stays (a criminal-worded governing body is tier 2); the test says which rule took each town. power.entry's
    REACH (it withholds wherever ANY house is hidden) stands until measured. It is narrowed only if the per-town
    counterfactual shows no observable difference AND the row's absence does not itself become a tell. The count, WITH
    ITS DENOMINATOR (of how many born pages), goes in section 5: OWED (the first cure counted 9 pages without one).
12. VR36, THE COST LAW: the named rows, and the Reveal-DM gallery read of the largest born town, are bound by twice 211's
    Reveal-OFF read of the same town. Every stage that touches 212 times them, and E's cost run carries them.
13. VR27 as amended: a helper 212 adds that is called only inside the definer reads is revoked from PUBLIC, anon and
    authenticated by name, in the commit that adds it.
14. R5's LAW: a served value composed from a withheld one is withheld or recomposed with it, numbers included. THE SIX
    ALIAS PATHS (`publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,criminalLine}`) are R5's: alias
    rows beside `prose.incomeWeight.alias`, each bound to its target's rule, red first on the 30 reads, and the registry's
    new row count goes in the "R5" line.
15. VR9 (R4): where a house is hidden whole, the person who HOLDS it is withheld WHOLE WITH ITS TIES, never blanked.
    VR10 (R4): on every non-owner read every person's id is re-keyed under one salt per read, and every in-payload
    reference follows. **STOP 1 (08:01): references inside a card's OWN ties (`npcs[].relationships[]`) are re-keyed too,
    and the holder pass drops such a tie that names a holder, matched as a string so numeric ids are caught. The born arm
    takes a plant with per-card ties. The reader's probe (number id 90001 with a tie, 64 of 64 served as itself at
    dfa031f3e) must go green.** **STOP 3: the page does not re-key a body the server already re-keyed; the client re-keys
    only where it projects the town itself. `galleryServerVeil` is re-stated under VR46, and any difference left from
    VR9's holders STOPS with its count. The switch (`presentCriminalGroupings`) takes ONE salt for both of its outputs.**
16. THE SALT: VOLATILE on every function that draws randomness AND on every function that reaches it by the transitive
    closure of calls. THE CATALOGUE IS THE PROOF AND THE RED (`provolatile` of every function 211 and 212 create or
    restate). The prepared executions (seven, plus a forced generic plan) are kept as a GUARD, not called the red: no plan
    folds a call whose arguments are never constants. The twin uses one salt per projection. 212's restatement of
    `_gallery_veil` is the final definition a deployed database holds.
17. VR46: a guard that pinned a served person id byte for byte is re-stated MODULO THE READ'S PERSON-ID BIJECTION
    (canonical names by first appearance), every other byte compared exactly. Five teeth, each executed: (i) a reference
    that does not follow its card reds; (ii) any stored person id served, as a SUBSTRING of any string or as any KEY, the
    served marker included, reds, with plants in a sentence and as a key; (iii) a changed non-id byte reds; (iv) within one
    read the re-key is a bijection; (v) two reads of one town differ. A red that does not hold under the re-statement
    stops the builder.
18. VR47, THE HONORIFIC (08:01): the pick of a weighty title is a function of what every read serves: the person's NAME
    and TITLE (gender choosing only the gendered form), on EVERY page, the owner's included; never the card's id, never
    the institution key. One helper builds the seed. A stable per-person seed served for shared pages is REFUSED. Display
    only: no stored byte, no generator figure moves. RED FIRST: two reads of one town print the same honorific for every
    card, and the owner's page and the shared page agree (MERGED df6809f9c: red 4 failed at 4d91d5c5f, green 61/61).
19. VR44 (at the doors' merge): the tile's stability (the `get_gallery_dossier` column, the lists, the og card) is the
    BAND WORD ALONE on every non-owner read, marked or unmarked. Red first by the reader's probe.
20. VR41's two narrowings (at the doors' merge): the chronicle's compare also folds the RAW target id; a power target counts
    as shown where the SERVED body names it (42 withheld entries of 1,393 lived entries go to 0, with a born arm).
    THE DOORS' IMPORT HUNKS (VEIL-23's cure 4): a frozen share's NAME and TIER columns in `import_gallery_dossier` equal
    the served body's on every read, with a planted town named after a hidden house; else both are read from the body.
21. VR43: `get_gallery_map` bumps `view_count`, so migration 091's guard fires on the READ of a stored row holding a
    chronicle (it fails closed). NO BUILD: a one-row count statement goes into the deploy note.
22. VR45: the twin-against-server and CONTROL comparisons compare objects WITHOUT REGARD TO KEY ORDER; array order stays
    exact; plants prove a reordered array, a changed value and an added or missing key are each still caught. (Applied in R6.)
23. VR35, V10-5: a criminal house born without a catalogue id, renamed and hidden whole, leaves its birth name in served
    strings. Re-measure AFTER R3's `power.entry`: a catalogue hideable name is accounted for by a served house or a served
    power whose folded name equals it. Send the count and five examples to the chair before it is built.
24. `safety.blackMarketCapture`'s page column: 're-derive' on a share that carries no veil, 'not drawn' otherwise (PROVEN:
    0 of 96 server reads carry it).
25. THE GATE AT E: its four readings (gallery and link, both stored shapes) show UNREGISTERED 0; any path left is named
    with its reason. That is part of what "E <checksum>" means.
26. CONTENT LANES (a finding against THEM, never built here): TRAD-1 (`lane/trad-2026-11-20`) puts the traditions as text
    into `publicProse` (`display/publicProse.js`, `publicProseCompose.js`); the gate must show that sub-path not differing.
    `lane/frame-2-2026-11-20` lets a criminal power stand as a creditor, and another foreigner or the record-keeper as an
    occupier's face, in a STORED cast role. If R5 edits either composer, tell the chair which lines.
27. KNOWN REDS, NOT THE LANE'S TO CURE: `observedShapeReaders.walker` violations 4 against frozen 1, and its register arm
    {2220, 1556, 448} against {2214, 1552, 444}: the governed schema-46 rung, a unit of the close. Migration 213 (the eight
    older helpers' revokes) joins at the close: two veil tests pin 212 as newest.
28. THE NAME SEARCH (the chair, 08:22, found by VEIL-24): in the engines AND in every test that proves a withholding, a
    name is searched by the lane's own fold: itself AND its bare form without the bracketed qualifier
    (`gallerySecondHomes.js` QUALIFIER; 212's "itself and itself without its bracketed qualifier"); an id is searched as a
    string and as a key. No stage narrows it to the full label. Red first by a plant: a qualified power named by its bare form.
    AND (the chair, 09:04): the fold reaches EVERY structured-copy match in both engines (goal sentences, memberships,
    affiliation keys, conflicts, tensions, contestsNiche) and every born arm. R3's first cure matched the literal label:
    owed inside R3 (R3-CURE-2 unit 1). The line's walker `tests/lint/namesInSentences.walker.test.js` (the working line,
    origin/lane/join-2026-11-14) holds a COPY of this fold: at the join it must read the lane's own function.
29. MESSAGES to the chair: at most 300 words; at once on a surprise; your token count from get_session in each (it has read
    0 for this seat: keep an estimate and add a third); one line after each stage merged green ("R3 <commit>"; for the
    doors: "DOORS-IN <commit>" with 212's sha256). THE MARK: 450,000 tokens; the chair seats a successor at 330,000.
30. THE DERIVED KEY (the chair, 09:04, ruling 2 on R3; RE-WORDED BY THE CHAIR 10:28): EVERY SERVED FIELD THAT FEEDS A
    DERIVED KEY IS RE-DERIVED OVER THE HOUSES THAT READ SERVES, OR WITHHELD; never served as stored beside a roster that
    no longer justifies it. Where the feeding field is not yet attributed (the covert rung), ATTRIBUTE FIRST, per town.
    A TOWN WHOSE DERIVED KEY READS HIGHER THAN ITS COUNTERFACTUAL BLOCKS. A town reading LOWER does NOT block the R3
    merge, on three conditions: (1) each LOWER town is assigned to a named, RULED fail-closed rule (power.entry's reach;
    crimeTypes failing closed; the goal rule; ...), not merely "a cause"; a LOWER whose cause is not such a rule BLOCKS
    and goes to the chair; (2) the counts by rule, with the denominator (of 92), go into the owner's paragraph in plain
    words; (3) THE TELL QUESTION goes to the security reader as a NAMED ATTACK with the LOWER towns listed: is each served
    page one that some town with NOTHING hidden could show (the same served profile found in the born pools), or does the
    combination betray that something was withheld? R3 merges "GREEN TOWARD WITHHOLDING, THE TELL QUESTION OPEN"; the
    reader's verdict gates E, not the merge. At b907c75c9: HIGHER 0, EQUAL 79, LOWER 13 of 92; the 13's assignment to
    rules is OWED (R3-CURE-3, unit D, or the seat before the merge).
    THE ACCEPTANCE (ruling 37 (b)) WITH THE CHAIR'S 10:28 CONDITION: the REGENERATED counterfactual is built by a path
    INDEPENDENT of the projection's re-derivation (the generator run with the houses cut at every step, never the same
    helper called twice); PART 25 names the code that builds it once R3-CURE-3 returns (the differ's B,
    `REVIEW-VEIL-9/differ.probe.jsx :: birth` with `onStep` cutting the houses, is the model).
31. A GOAL NAMING A WITHHELD POWER (the chair, 09:04, ruling 3 on R3): leaves with the power, under Reveal DM too ("leaves
    whole" reaches every string). `galleryServerVeil`'s two guards that pinned such a goal are re-stated with that reason;
    their tooth: a goal aimed at a SHOWN power is still served on that read, byte for byte.
32. THE BETRAYING WORD (the chair, 08:37; WIDENED 10:28; every lane that writes a reader's text): A WORD A SENTENCE
    CHOOSES BY A RANK, A SHARE, A COUNT, A SUPERLATIVE OR AN "ONLY" COMPUTED OVER ROWS A READ CAN WITHHOLD is computed over
    the rows THAT READ SERVES, or the sentence is withheld. R5's brief takes a born arm by counterfactual (the same town
    with the withheld row truly absent prints the same sentence on that read) over every composed or stored sentence of
    that kind. R5'S ORDER, RULED 10:28: FIRST a power's description that names a withheld power (a name in served prose:
    TIER 1; ruling 36 (b): `powerStructure.factions[].desc`, 20 hits in 2 towns, and `factions[].desc`, 4, at the first
    R3 cure; "E" is not sent while the search finds one); THEN the six alias rows
    `publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,criminalLine}`; THEN the rank-word class. The
    reader's baseline for R5: four differing rows (`faith.templeFraud`, `power:desk.structureFlag`,
    `economics.shadowEconomy`, `economics.incomeWeight`) and `factions[].desc` (24 hits of a withheld power's name).
33. VR48, A SERVED CARD CARRIES ITS GENDER (the chair, 09:02, on VEIL-24's measure): on every read that serves the card.
    The veil never withheld it (211 holds `gender` on the card's FLOOR); the old public allowlist does (since 033, no reason
    recorded), so shared pages print the masculine form for 119 women in 60 of 70 born towns ("Godi" for "Gydja",
    "Brewster" for "Alewife"; `out/v24/gender/summary.txt`). In 212 and the twin, NEVER 211; the brief says whether 210's
    array is restated by 212 or edited, and why; one registry row (people.card: gender is floor; it leaves only with the
    card). RED FIRST: the 119 to 0 on the gallery read and the party link, Reveal DM off and on; a born arm that a WITHHELD
    card's gender is served nowhere. Built INSIDE the R4 second cure, its own commit. The other 179 cards where owner and
    shared honorifics differ are all a house or power the page hides by default (`institution.veiled` true: 176 house, 3
    power; `out/v24/gender/causes-summary.txt`): no fault.
34. STAGE L, BEFORE E (the chair, 09:02): the four walkers red at the lane's tip and unchanged by it
    (`out/v24/walkers/`): `presumedThings` (21 undeclared lines: 20 in `gallerySecondHomes.js`, 1 in the registry) and
    `presumptionClasses` (2 lines in `gallerySecondHomes.js`): each line DECLARED by the vocabulary's own door, a claim
    with its reason, never a row to quiet a walker; `writerReach` ("veiled on allegiance" lost `web-display` from its
    frozen reach): the register row re-recorded with its cause; `phoneChromeFloor.census` (/create, /settlements, /gallery
    floored +2 each): the count re-taken by its door. The join needs `tests/lint` green whole but for counts.
35. ORDER (the chair, 09:04): R3 (its second cure; then "R3 <commit>") → R6's merge → the R4 second cure (the three stops;
    VR48 its own commit) → R5 (ruling 32) → R7 → stage L → the doors' merge → the stored figures once at the merged tree → E.
    One line to the chair as each lands.
36. THE READER'S PRE-MEASURE OF THE R3 CURE (the chair, 09:18; REVIEW-VEIL-12 `probes/REVIEW-VEIL-12/out/rc-at-4db8e4208-*`):
    (a) RULING 30 REACHES THE WHOLE OPERATIONS LIST: with nothing criminal served, `safety.criminalInstitutions` carried
    "Rival Gangs" in 17 of 33 towns (control 0 of 28), "Gambling District" 14 (0), "Red Light District" 13 (2),
    "Gambling Halls" 9 (2); the derived key semi-organized 29 of 35 against the control's 5 of 29. Every entry is
    re-derived over the houses the read serves, or the list is withheld (VR29: still an array); the acceptance is the
    per-town equality with the counterfactual AND the control's DISTRIBUTION. Relayed to the R3-CURE-2 builder 09:18.
    (b) A SHOWN POWER'S `powerStructure.factions[].desc` NAMING A WITHHELD POWER ("…they play Thieves' Guild and City-State
    Council against each other…", rv12-rc-metropolis-indebted-0-42, all four reads) is on R5's list, so R3 may be green
    with it NAMED; IT IS TIER 1 UNTIL R5 CURES IT: R5's brief takes it FIRST (recompose over the powers served, or
    withhold), and "E" is not sent while the search finds it.
    (c) The reader's last hit at 4db8e4208: "black marketeer", Reveal DM on, a holder of the hidden Black market: VR9's
    holder pass, in the R4 second cure (its unit 1 or a probe of its own).

37. THE CHAIR ON R3-CURE-2 (10:21; relayed to the R3-CURE-3 builder at 10:24):
    (a) THE TWO REVEAL-DM GOALS SERVED AGAIN ARE A LEAK UNTIL ATTRIBUTED; the stage fails toward withholding. The ONLY
    exemption is a hit lying WHOLLY inside the name of a power or house the SAME document serves, the test naming that
    containing name (a positive exemption, never "the boundary search did not fire"). THE SEARCH IS CASE-BLIND AND COUNTS
    A POSSESSIVE AND A PLURAL ENDING AS A BOUNDARY ("the Thieves' Guild's", "thieves' guilds"): a plant for each, red
    first; and a plant the other way (a goal naming a served power whose name contains a withheld one stays served).
    (b) THE R3 GATE (the seat's recommendation, accepted with two conditions): per-town equality of EVERY derived label
    against the town's REGENERATED counterfactual (houses cut at every step), every town of the pool, both engines,
    Reveal DM off and on. (i) It must be shown able to fail (re-derivation off in a scratch copy reds the five towns that
    read HIGHER before). (ii) The control is REPORTED, NOT GATED, but by a table inside each crime-dial stratum; a gap
    that does not close inside the strata goes to the chair at once. The counterfactual's builder and the table go where
    the security reader can re-run them. (Ruling 30's DIFFERS stands; whether the 13 LOWER towns block is asked.)
    (c) THE THREE publicSafe PINS may be re-stated without a further word, each with its cause in the commit, the old
    positive kept on a town with no house hidden (the criminal power's name, category and standing stay byte for byte),
    and the new arm (a house hidden: the row leaves whole, by search). criminalVeilSwitch VR34 (b) pins the OWNER'S SWITCH:
    NOT re-stated without the chair's word; one paragraph to the chair (its assertion; what happens with the switch on and
    a house hidden elsewhere).
## 2. The bytes (kept current)
| File | sha256 |
|---|---|
| 211 / its rollback (FROZEN) | `eface6d0…be0b01` / `ce8474ff…49712f`: proved at the cut 4c753ec52 |
| 212 / rollback on the lane (after R2; VR47 touched neither) | `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10` / `1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e` (`out/v24/seated/dry-sha.txt`) |
| 212 on the R3 cure's branch (4db8e4208) | `de3efccbbf9905443e0444dc7976fd5200c82c2661536f5150999aea5b68eb9f`, rollback `653ae8b2…b2f4` |

## 3. The stages
| Stage | Where | State |
|---|---|---|
| R1 registry, R2 withhold-always, V10-2 | merged (4ddf8c60c, d136940c3, b5cb22caf) | read cold: they hold |
| VR47 the honorific | merged df6809f9c, bundles e4cce485f (VEIL-23) | done; the owner's count in section 5 |
| R3 roster choices | `lane/veil-24-r3c2-2026-11-20` at 9b18835d1 (pushed; worktree `/home/user/wt/r3c2`, branch `v24-r3c2`): R3 411565ff9, first cure 06e9e64b3, R3-CURE-2 b907c75c9, R3-CURE-3 9b18835d1; 212 `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2` (R3-CURE-3 did not move it), rollback `40357bed…65b1`; hand-backs `out/v24/r3c2/R3C2-HANDBACK.md`, `out/v24/r3c3/R3C3-HANDBACK.md` | NOT MERGED; NOT READ LINE BY LINE BY THIS SEAT beyond R3's and the first cure's source (b907c75c9's and 9b18835d1's diffs are unread). AT 9b18835d1, by the builder's report: (1) the two Reveal-DM goals are NEITHER a leak NOR a false positive: both are withheld in both engines by their target id (`{kind:'power', id:"Thieves' Guild"}`; `out/v24/r3c3/unit1-goals.txt`); (2) A LEAK FOUND, NOT CURED: a GOAL HUSK on server-veil-city-2 and metropolis-7: a goal aimed at the withheld guild is served with its sentence and target id stripped but its INTENT left, both engines (the tooth arm and ruling 37 (a)'s plants are red, saved UNCOMMITTED in `out/v24/r3c3/UNCOMMITTED-red-arms.patch`); (3) ruling 37 (a)'s other-direction plant is red too: a served "Old Thieves' Guild Watch" is withheld WHOLE (over-withholding; the exemption must name the containing served name); (4) the three publicSafe pins RE-STATED per ruling 37 (c) (turned at 411565ff9: power.entry two, the crimeWave tension row one; red at 4c753ec52, green at 9b18835d1; one departure: pin 1's share reads 14, not 5: READ IT); (5) criminalVeilSwitch VR34 (b) NOT re-stated (turned at 06e9e64b3, power.entry on the top-level list; the switch on: the row is served; a second criminal house hidden: withheld; `vr34b-measure.json`): the chair's word owed; (6) ruling 30 (1): all 13 LOWER towns assigned to a ruled rule, none blocks (`D1-lower-towns.txt`); ruling 37 (b) (i) and (ii) and the counterfactual's independence NOT DONE. NEXT: an R3-CURE-4 builder: the husk (the whole goal leaves, intent included, red first by the uncommitted arms), the containing-name exemption, the tooth committed, 37 (b) (i)/(ii) and the counterfactual's code named; THEN the seat reads b907c75c9..tip line by line, re-runs the born test, galleryServerVeil, the harnesses, the acceptance, the cost, and merges "GREEN TOWARD WITHHOLDING, THE TELL QUESTION OPEN". |
| R6 tests | `lane/veil-22-r6-2026-11-20` 7d9ebd078 | COMPLETE, NOT MERGED; merge after R3 and re-run its MAIN arm (red 50 at R6's base: `cast.stakes` by R3's power, `cast.roles` wording by R3 or R5) |
| R4 the people | `lane/veil-22-r4-2026-11-20` a4b89bf9d (R4 dfa031f3e + first cure) | NOT GREEN. NEXT after R3: the R4-CURE-2 builder (STOP 1, STOP 3, the switch's one salt, the catalogue as the red; VR48 its own commit). Draft brief at the seat; committed when launched. |
| R5 composed prose, R7 | not started | R5 after R4 (rulings 14, 28, 32); R7 after R6 |
| L the four walkers | not started | ruling 34 |
| DOORS 3e1115c81 | `lane/veil-doors-3-2026-11-20` (hand-back `docs/chair/2026-11-20/veil/doors/VEIL-DOORS-3-HANDBACK.md` there: read whole before the merge) | merge `--no-ff` after R3 and R4, every hunk read, the two inside `import_gallery_dossier` hardest; ONE builder: rulings 19, 20, the reader's repros, the acceptance run at the merged tree |
| stored figures, E | not started | once at the merged tree; then E (ruling 25) |

## 4. The instruments, one command each (this container; outputs under `/var/tmp/v18/out/v24/`)
- AFTER A CONTAINER REBOOT (one at ~08:53 UTC killed the cluster; /var/tmp survives): `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"` (a "connection refused" from any instrument means this). Nothing else is lost.
- Cluster (fresh container): `mkdir -p /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log && chown postgres:postgres /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log && su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v18pg --locale=C.UTF-8 -E UTF8 --auth=trust -U postgres" && printf "listen_addresses = ''\nunix_socket_directories = '/var/tmp/rv7'\nfsync = off\n" >> /var/tmp/v18pg/postgresql.conf && su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`
- pg driver: `mkdir -p /var/tmp/v18/pgmod && cd /var/tmp/v18/pgmod && npm init -y && npm i pg@8.13.1`
- Readers' library: `mkdir -p /var/tmp/v18/lib && git fetch origin lane/review-veil-3-2026-11-12 lane/review-veil-9-2026-11-19 && git archive 72a3bb24f docs/chair/2026-11-13/probes/REVIEW-VEIL-6 docs/chair/2026-11-13/probes/REVIEW-VEIL-7 docs/chair/2026-11-14/probes/REVIEW-VEIL-8 | tar -x -C /var/tmp/v18/lib && git archive origin/lane/review-veil-9-2026-11-19 docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9 | tar -x -C /var/tmp/v18/lib`
- Probes flat: `mkdir -p /var/tmp/v18/rv9 && cp -r /var/tmp/v18/lib/docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9/* /var/tmp/v18/rv9/ && sed -i 's#/var/tmp/v16/rv9/#/var/tmp/v18/rv9/#g' /var/tmp/v18/rv9/names-unicode.mjs /var/tmp/v18/rv9/page-vocab.probe.jsx /var/tmp/v18/rv9/page.probe.jsx`
- R1's runner and tally: `cp docs/chair/2026-11-20/veil/r1/instruments/* /var/tmp/v18/`
- Dependencies: `npm ci` in the checkout; a builder worktree: `git worktree add -b <branch> /home/user/wt/<name> <commit> && cp -al node_modules /home/user/wt/<name>/node_modules`
- Registry check and walker: `node scripts/veil/rosterChoiceRegistry.mjs --check` and `sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js`
- The two harnesses: `sh scripts/gate-tail.sh npx vitest run --maxWorkers=1 tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js`
- The acceptance run: `cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh <tree> <outdir>` (must EXIT 0; 40 rows at 4c753ec52's parent e4cce485f)
- THE GATE, ONE COMMAND TAKING THE COMMIT: `sh docs/chair/2026-11-20/veil/out/v24/probes/gate.sh <commit>` (from the main checkout; it exports the tree, makes master's worktree at db832c892 if missing, takes the four readings and prints them to `/var/tmp/v18/out/v24/gate-<commit>/readings.txt`).
- The gender measure (VR48's red): `out/v24/probes/gender.probe.jsx` (counts) and `gender2.probe.jsx` (causes), run by the readers' vitest config with `RV6_SRC=<tree> RV9_PROBE=<probe> G24_OUT|G24B_OUT=<json>` against a chain `gtpl24` built by the library's `native/chain.sh gtpl24 212 <tree>/supabase/migrations`.
EXECUTED BY THIS SEAT, SEATED (08:09-08:21 UTC, at 56cad78c8): `--check` exit 0; walker 11 of 11; harnesses 8 of 8; the
acceptance run exit 0, 40 PASS; the four sha256 equal; the gate's party link at the new shape registered 13, diffuse 21,
rng-only 13, UNREGISTERED 38, equal to VEIL-22's reading at d136940c3 (`out/v24/seated/`). At e4cce485f the acceptance
run exit 0, 40 PASS (`out/v24/gender/accept.txt`).

## 5. FOR THE OWNER, IN PLAIN WORDS: what a reader of a shared page loses (and one thing it gains)
- THE RE-KEY OF PERSON IDS (VR10): each time a visitor opens a shared town, every person gets a fresh hidden id for that
  load only. A link to one person's card stops working after a reload, though the card is still there. Two imports of
  one town cannot be matched person to person by id. Names, roles and ties are unchanged.
- THE WEIGHTY TITLE (VR47): on a town made before this change, some people's title changes once ("Master Apothecary" to
  "Apothecary" or back): the same person, the same office. 58 of 163 born-town cards print a different form (VEIL-23's
  count, `out/v23/vr47/`).
- A WOMAN'S TITLE (VR48, a field NEWLY SERVED, once the R4 second cure lands): today a shared page prints the masculine
  form for a woman whose title has one (119 people in 60 of 70 generated towns: "Godi" for "Gydja", "Landlord" for
  "Landlady"), because the old public list never carried a person's gender. The fix serves it: it corrects a wrong word
  on players' pages and reveals nothing the page's own sentences do not already say ("she", "he": 46 such sentences a page).
- THE BLACK MARKET'S SHARE under the default settings: never sent by the server; a page re-derives it only where the share
  carries no veil, else it is not drawn.
- A CRIMINAL POWER'S ROW where no hidden house raised it (power.entry's reach): 9 born pages lose a "Thieves' Guild" row no hidden house raised
  (the first R3 cure's measure; the denominator is still owed: R3-CURE-2 did not re-run it). VR42 (the governing power
  kept while the government's name stays) is met by 0 of 140 born towns; a hand town serves its governing "Thieves' Guild"
  whole, share 60, and that arm is kept.
- A CALMER CRIME PICTURE on some shared pages (ruling 30): where the veil withholds toward safety, the Defense reading a
  visitor works out from the page can come out LOWER than the same town would show with the hidden houses truly gone: 13
  of 92 generated towns at the second R3 cure; never HIGHER. The counts by rule are OWED with the R3 merge.
- THE REASON AFTER "Unstable" on an old page's card: after the doors' merge, the card shows the band word alone ("Unstable")
  on every read that is not the owner's (VR44).

## 6. Log (every hour from `date -u`)
- 08:07 seated beside VEIL-23. 08:09-08:21 instruments re-made at 56cad78c8 (section 4); one message of cures (the gate as
  one command; the fold, made ruling 28; the R4-CURE-2 brief first if the hand-over came early).
- 08:37 ruling 32 relayed (the betraying word). 08:52-09:04 the gender measure for the chair (VR48 ruled) and the four
  walkers (stage L ruled); the container rebooted ~08:53 (the cluster restarted).
- 09:04 THE LANE IS YOURS at 4c753ec52; the branch fast-forwarded there; 211 proved. R3's source diff read line by line.
- 09:07 R3-CURE-2 brief committed (14c81dc38); its builder launched in `/home/user/wt/r3c2`. PART 25 first written 09:09.
- 09:18 the reader's two leads at 4db8e4208 (ruling 36); (a) relayed to the R3-CURE-2 builder 09:18.
- 10:16 R3-CURE-2 returned at its mark (b907c75c9), pushed; three open points to the chair; R3-CURE-3 launched.
- 10:17 the chair: this seat's record read 335,815 tokens; VEIL-25 is seated beside it. THE HAND-OVER POINT: the R3 merge
  or 400,000 tokens, whichever comes first; then "HANDED OVER at <commit>", and this seat only relays builders. The
  R4-CURE-2 brief is written (`briefs/R4-CURE-2-BRIEF.md`, its base filled at launch); VEIL-25 staffs it, not this seat.
- 10:20 PART 25 checked against the chair's list; ruling 30 restored to the chair's word (DIFFERS; the 13 LOWER towns put to it).
- 10:21 the chair's rulings on R3-CURE-2 (ruling 37); relayed to R3-CURE-3 10:24. VEIL-25 seated (session_019yED1QCGsC1hjJ6rjiboyE).
- 10:28 the chair re-worded ruling 30 (LOWER does not block, on three conditions) and the acceptance's independence; VEIL-25's five gaps cured 10:29.
- 11:00 R3-CURE-3 committed; returned at its mark (9b18835d1), pushed; a goal husk found (a leak, not cured). The seat's record read
  375,094 tokens: R3 cannot merge before the 400,000 point, so this seat hands over now (11:01).

## 7. HANDED OVER (to VEIL-25, session_019yED1QCGsC1hjJ6rjiboyE, at the chair's 10:17 plan)
The lane `lane/veil-24-2026-11-20`: tip = the commit carrying this file. Merged since the cut 4c753ec52: NOTHING (docs
only: the R3-CURE-2, R3-CURE-3 and R4-CURE-2 briefs, PART 25, out/v24). 212 on the lane is still `05b915ab…8f10`. NOTHING
OF THIS SEAT RUNS: the R3-CURE-3 builder was stopped at 11:01 after its commit (its worktree is clean). THE INSTRUMENTS in
this container stand (section 4); the cluster is up. NEXT, IN ORDER: (1) the R3-CURE-4 builder (the R3 row above); (2) the
R3 merge with its line to the chair; (3) R6; (4) the R4 second cure from `briefs/R4-CURE-2-BRIEF.md` (fill its base);
then R5 (ruling 32's order), R7, L, the doors, the stored figures, E (ruling 35).
