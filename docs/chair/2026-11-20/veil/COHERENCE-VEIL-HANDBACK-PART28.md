# COHERENCE-VEIL — hand-back, part 28: the twenty-seventh seat (VEIL-27). SELF-CONTAINED: a successor reads THIS and the briefs only

Seat: VEIL-27 (session_019yED1RmuijyUDwGxU73uSf), branch `lane/veil-27-2026-11-20`. Assignment:
`lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-27.txt`. The chair: session_019yED1SUxGVHyjQnoqoFvQ8
(send_message, Claude Code Remote MCP). Security reader: REVIEW-VEIL-14, seated by the chair when R3 is ready, reached THROUGH
THE CHAIR. Written 15:13 UTC (`date -u`); kept current at every push. Section 1 is PART 27's list, carried whole, with the
rulings since (53 on). PART 27 (VEIL-26's) is on this branch beside it, unchanged: history.

**TIP:** the commit carrying the latest copy of this file, read back from origin. THE LANE WAS HANDED TO THIS SEAT at
99a159f59 (the chair, 15:10 UTC: "THE LANE IS YOURS at 99a159f59"); the branch was cut there by fast-forward from e5b95d637;
211 proved (`eface6d0…0b01`, rollback `ce8474ff…712f`).

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
    doors: "DOORS-IN <commit>" with 212's sha256). THE MARK (VEIL-26's prompt): 400,000 tokens; the chair seats a successor at 300,000; get_session reads 0 for this seat: an estimate is said.
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
38. THE CHAIR AT THE HAND-OVER (11:12 UTC):
    (a) THE GOAL HUSK IS A LEAK: a goal naming a withheld power LEAVES WITH IT, THE WHOLE GOAL, EVERY FIELD OF IT (its intent
    included); a husk is a tell. Its red arms (`out/v24/r3c3/UNCOMMITTED-red-arms.patch`) are committed RED first. The seat
    widens it to the CLASS: any served object that held a withheld power's name or id and is served with that field stripped
    is a husk (R3-CURE-4 unit 1 measures it by comparing the projection with the served body by path; the search cannot see it).
    (b) THE EXEMPTION: a SERVED power whose name contains a withheld one ("Old Thieves' Guild Watch") stays served byte for
    byte; the test names the containing served name (ruling 37 (a)).
    (c) VR34 (b), THE CHAIR'S WORD: the behaviour STANDS (switch on and no criminal house hidden: the criminal row served; a
    criminal house hidden: withheld; it fails toward withholding, and a row whose weight a hidden house raised must not be
    served). The pin is re-stated to say exactly that, both arms. OWED BEFORE THE DEPLOY: where the Curate screen shows the
    switch on while a criminal house is hidden, it says in plain words that the grouping is not shown while one of its houses
    is hidden; it sets nothing and reveals nothing new to the owner. THE FILE: `src/components/gallery/CurateMode.jsx ::
    CriminalSwitch` (its words in `src/domain/display/criminalVeilSwitch.js :: CRIMINAL_SWITCH_WORDS`): THIS LANE'S (V10-2's
    lineage, VEIL-V102 97e51d7f6); the doors' branch has not touched either file since its base bedd5a392 (its two-dot diff
    there is base drift). SIZE: OWED (the seat's estimate: one sentence of words, one condition, one red-first render test).
    (d) R3 merges after R3-CURE-4, "GREEN TOWARD WITHHOLDING, THE TELL QUESTION OPEN"; "R3 <commit>" to the chair, who forwards
    it with the named attack (the LOWER towns' tell question).
    (e) PIN 1's SHARE (publicSafe "criminal faction … name, category and standing stay", 14 not 5), READ BY THE SEAT: the
    trimmed fixture Bailthwaite stores two shares, 5 and 30 (sum 35); R3's VR31 re-derives ANY served share set whose exact sum
    is not 100 (the detection of a power the projection withheld before R3 sees it), by largest remainder: 5/35 -> 14, 30/35
    -> 86. Nothing is withheld on that read and nothing is revealed. It stands. Recorded: the trigger is "the sum is not 100",
    not "a member was withheld", so an old stored set that does not sum to 100 is normalized on a page with nothing hidden
    (harmless; a generated town sums to 100).
39. THE CHAIR, 11:24: (a) the Curate notice is BUILT NOW, beside R3-CURE-4 (it touches no line of 212): one builder
    (`briefs/CURATE-NOTICE-BRIEF.md`), one sentence, one condition, a red-first render test, display only, the owner's Curate
    screen alone; THE SENTENCE IS AUTHORED: its words go to the chair before it merges. (b) The owner's list carries the
    renamed criminal house's lost label (with its count) and ruling 38 (e)'s normalized shares.
40. THE CHAIR, 11:43: THE CURATE NOTICE RULED. Its words, verbatim: "While a criminal house is hidden, the town's criminal
    powers stay off the shared page too, so they cannot give the house away. Show the house to show them, or leave it hidden
    and they stay off." Its condition: the switch reads shown or partly AND a criminal house's whole-house eye is hidden AND
    the town HAS a criminal power (a sentence about powers that are not there would send a DM hunting); that arm red first.
    Merge it with both, then "CURATE <commit>" to the chair. If R3-CURE-4 narrows power.entry's reach, the condition is
    re-checked before R3's merge and the chair told what changed. THE HAND-OVER POINT for VEIL-25: R3's merge or 380,000
    tokens by its record, whichever comes first; VEIL-26 is seated beside it; after the hand-over VEIL-25 only relays builders.
41. THE CHAIR, 12:09: (1) `income.criminalRow` (registry VR14 (ii)) IS A RULED FAIL-CLOSED RULE: a row whose weight a
    hidden house raised is not served; the seven LOWER towns resting on it do not block R3. (2) THE TELL QUESTION, SHARPENED:
    the served page is judged against what a town WITH NOTHING HIDDEN could show UNDER SOME SETTING OF THE OWNER'S SWITCHES.
    A page without the criminal income row is what every town shows with the criminal switch off, so its absence alone is
    no tell; the tell, if any, is a COMBINATION (some criminal content a switch-off page would not show, together with the
    income row's and the criminal powers' absence). Per LOWER town (the seven first, then all thirteen): is the served page
    equal, in every criminal-related field, to the regenerated house-free town's page under SOME switch setting? Yes for all:
    no tell. No: the differing fields are the tell; the cure withholds or re-derives them too. The instrument goes in the
    lane as one more column of R3-CURE-4's gate if cheap (relayed to its builder 12:1x); else the reader builds its own.
    (3) R3 merges "GREEN TOWARD WITHHOLDING, THE TELL QUESTION OPEN" once R3-CURE-4 is in and green; its line names the seven.
    VEIL-26 is read in and has re-made the instruments.
42. THE CHAIR, 12:21: (1) THE HUSK CLASS: ANY ROW OF A LIST the name sweep strips of a withheld name LEAVES WHOLE (a goal,
    a membership, a conflict party in either list, a tension, a relation pair); a row with its naming fields gone and its
    other fields left is a tell. Cured by its cause: the copy pass sees the row BEFORE the sweep empties it, or the sweep
    removes the row, both engines, red first; the builder says which and why. (2) THE WATCH: approved as cured (category
    decides; the name only where there is no category; 0 of 1,478 born powers move). (3) THE KEY-LEVEL HUSKS
    (`contestsNiche` on a shown power, `factionAffiliation` on a served person): MEASURE FIRST, cure nothing: over
    nothing-hidden towns by holder kind and size, how often the key is absent; for the cut towns, whether the holder without
    the key is an ordinary shape at that size (the possible-world test); if the engine nearly always writes the key, BOTH
    options with counts (re-derive over what is served; withhold the holder) for the chair to rule. (4) VEIL-25 HANDS OVER
    NOW. All three relayed to R3-CURE-5 (12:2x).
43. THE CHAIR, 12:25 (a lead from another lane, UNMEASURED): `brokerageLegalityOf` reads a house's OWN `tags`, so an illegal
    brokerage whose `function` eye the DM hides (which removes its own tags) MAY STOP COUNTING AS HIDEABLE in the veil's own
    predicate: hiding one part of a house would un-hide the house. NOT BUILT ON: one helper establishes it by a plant (a
    hideable brokerage, its function eye hidden: is the house still withheld where its whole-house eye is hidden, both
    engines?); one line to the chair. If real: a stage of its own before E; to the security reader's attack list either way.
44. THE CHAIR, 12:32 (the order at the hand-over): (1) read R3-CURE-4's branch (`lane/veil-25-r3c4-2026-11-20` at c5786c5ce)
    once, line by line, its reds and greens re-run; (2) ruling 43's plant; (3) R3-CURE-5 when relayed: its diff ONCE, section
    8's five checks first; the key-level measure (ruling 42 (3)) goes to the chair for a ruling before anything is cured
    there; (4) R3's merge "GREEN TOWARD WITHHOLDING, THE TELL QUESTION OPEN", "R3 <commit>" to the chair NAMING THE SEVEN
    `income.criminalRow` TOWNS (ruling 41); then R6, R4's second cure, R5, R7, L, the doors, E.
45. THE CHAIR, 12:52: ruling 43 CLOSED (NOT REAL, accepted; `out/v26/brok/summary.tsv` kept). THE SECURITY READER IS NOW
    REVIEW-VEIL-13 (REVIEW-VEIL-12 stopped at 350,052); stage lines still go to the chair, which forwards them. WITH "R3
    <commit>", IN THE SAME MESSAGE: the THIRTEEN LOWER towns BY NAME, each with the rule it is assigned to, the seven resting
    on `income.criminalRow` marked (the reader's tell question starts from that list). THE SEAT'S COUNT: the chair reads this
    seat's record (168,853 at 12:38); use the chair's figure plus the spend since.
46. THE CHAIR, 13:45 (the 13:05 anomaly's cause, ESTABLISHED by the chair): a commit made while a push is in flight goes out
    with it; the next push then has NO REF to send, and `.husky/pre-push` with no ref runs `npm run check` inside git's hook
    environment, where two fixture tests write commits by "Fixture <fixture@example.test>" and `core.bare = true` into the
    real repository. RULES, for the seat and its builders: NEVER COMMIT ON A BRANCH WHILE ITS PUSH IS IN FLIGHT; BEFORE EVERY
    PUSH `git ls-remote` AND PUSH ONLY IF THE REMOTE DIFFERS; a push log showing `npm run check` is killed at once. THIS
    REPOSITORY READ CLEAN at 13:47 (core.bare false; no local user.email; the lane's authors all Claude; no fixture commit
    outside old origin history).
47. THE CHAIR, 14:21 (1): THE KEY-LEVEL HUSKS: LEAVE THE KEY OFF (a shown power's `contestsNiche`, a served person's
    affiliation keys): the new shape serves `contestsNiche` on no nothing-hidden page; the old shape's powers mostly lack it
    at every size; withholding the holder is the larger tell and loss. CONDITION BEFORE THE R3 MERGE: the same table FROM THE
    SERVER, folded into the guard runs; a key the server serves where the twin does not is a PARITY FINDING AND STOPS THE
    MERGE. The 14+ cuts removing a value that names a SERVED house: accepted as over-withholding, counted with their
    denominator in the owner's paragraph (section 5).
48. THE CHAIR, 14:21 (2): VEIL-26's gap in dbff7eeb3 RULED A LEAK: a person whose id is a NUMBER, or who has NO id, kept a
    swept goal or membership as a husk. Cured in R3-CURE-5: the pre-sweep match by id AS TEXT for any scalar, both engines;
    with no id, the goal or membership is withheld where any pre-sweep goal or membership naming a withheld power contains it;
    red first by two plants (a numeric-id person whose goal names the withheld power; one with no id). THE SAME FAMILY AS
    R4's STOP 1 (the number id 90001): R4's cure and this one SHARE ONE HELPER for "an id as text" in each engine (the twin's
    `galleryRosterChoices.js :: idText` is the candidate; 212's jsonb scalar text), never two.
49. THE CHAIR, 14:24 (2): THE TELL IS FOUND, NOT OPEN, AND IT BLOCKS "R3 <commit>" TO THE READER. R3-CURE-5's tell column read
    NO in 26 of 26 town-reads (13 LOWER towns × Reveal off/on): an EMPTY operations list where the house-free page has no such
    field; crisis crime types and criminal services where it has none; no income row, power, goals or memberships where the
    open page has them: an open-shaped page with its criminal core gone. THE POSSIBLE-WORLD RULE: the served page's WHOLE
    criminal surface equals, field for field, the page of the same town REGENERATED WITHOUT THE HIDDEN HOUSES under the
    owner's own switch setting; where a fail-closed rule withholds something that page would show, under the NEAREST setting
    that shows none of what was withheld, in the limit the switch-OFF page; AN EMPTY LIST AND AN ABSENT FIELD ARE DIFFERENT;
    cured toward withholding; the tell column becomes a GATED arm (YES everywhere; mixed switch settings tried). VEIL-27's
    unit "R3-TELL", with "R3-CURE-6" (ruling 48's numeric-id cure, NOT in R3-CURE-5: it returned before the gap reached it).
    "R3 <commit>" goes to the security reader ONLY AFTER BOTH, with the thirteen LOWER towns by name and rule (ruling 45).
50. THE CHAIR, 14:24 (1): THE CONTROL GAP (R3-CURE-5 STOP 1: the served Defense key's distribution differs from the control's
    inside every crime-dial stratum, but the pool tracks its OWN counterfactual: low 83/83%, mid 74/70%, high 54/49%):
    RECORDED, NOT BLOCKING, on the chair's reading that the served Defense key is a function of what the served page itself
    shows. VEIL-27 PROVES that reading; the reader gets the question by name.
51. THE CHAIR, 14:24 (3): the key left off (ruling 47) stands; R3-CURE-5 found `powerStructure.factions[].contestsNiche`
    withheld on EVERY served page by R2's always-rule (0 of every power of 280 nothing-hidden pages) and no affiliation key
    on any born person (0 of 6,678): the key-level husks are the hand rows only. THE SERVER'S TABLE IS STILL OWED (ruling 47's
    condition), now before "R3 <commit>" rather than before the merge (the merge was ordered at 14:24).
52. THE CHAIR, 14:24 (4): R3-CURE-5's corrected counts REPLACE PART 26's: VR42 is met by 12 of 140 born towns ("Corrupt
    Council" / "Corrupt City Council"); `income.criminalRow` covers 8 LOWER towns (not 7). FOR THE OWNER: a RENAMED shown
    criminal house loses its operations line on 74 of 76 plants. OWED BEFORE E: the cost rows on the largest town.
53. THE CHAIR, 15:10 (VEIL-27's read of R3-CURE-6, dc6227ead + 8d5768ebc): RULING 48'S ONE-HELPER RULE WAS NOT MET (the twin
    holds two id-as-text functions in `galleryRosterChoices.js`, `idText` (a boolean reads '') and `idKeyOf` (a boolean reads
    its text); 212 writes the scalar text inline six times, no helper). MERGED AS BUILT (it closes a leak, toward withholding),
    ON THREE CONDITIONS: (1) A TOOTH NOW, red first where it can red: a person whose id is `true`, one whose id is `false`, one
    whose id is the empty string, BOTH engines: the twin and 212 serve the same result for each and no stripped goal or
    membership survives for any; IF THAT ARM IS RED at 8d5768ebc, THE FOLD IS DONE BEFORE R3-TELL. (2) Until the fold, a
    walker over 212's own text holds the six inline scalar-text expressions to ONE text (six identical occurrences, counted).
    (3) THE FOLD IS OWED IN R4-CURE-2: one id-as-text helper in the twin (`idKeyOf` folded into `idText`, a boolean read as its
    text), one in 212 (revoked by name, dropped by the rollback, known to 213's walker), the six sites repointed; named in the
    line "R3 <commit>". THE CONDITIONAL TOOTH (the shown power's goal in R3-CURE-6's arm, which skips a shown person served
    without a goal): no unit of its own; R3-TELL's two-sided possible-world arm reds it; its builder makes it unconditional.
    THE MARK (the chair, 15:10): 450,000 tokens; the successor seated at 360,000; the chair's read is the true figure.
54. THE CHAIR, 16:45 (R3-TELL unit 1, a43bca3d1, `out/v27/tell/TELL-HANDBACK.md`): THE TELL RULE RE-STATED. It REPLACES ruling
    49's "equals, field for field, the page of the same town regenerated" (the regenerated town is another draw: criminal
    content of its own in 81 of 92). WHAT IT PROTECTS IS UNCHANGED: A READER CANNOT TELL A PAGE WITH HOUSES HIDDEN FROM THE
    PAGE OF A PLACE THAT NEVER HAD THEM. THE TEST IS MEMBERSHIP: the served criminal surface's SIGNATURE is one that a
    NOTHING-HIDDEN page OF THE SAME SIZE shows under some setting of the owner's switch. (a) THE SIGNATURE: each field present,
    absent or empty (an empty list and an absent field differ); each family's rows none, one or several; AND the cross-field
    bits that carried the old tells: a criminal power with no criminal house shown; crime types with no house; a services row
    with no house; shares that do not sum to their whole. (b) THE POOL WIDENED: at least 300 controls a size born with nothing
    hidden, each read under every switch setting; A SIGNATURE SEEN IN FEWER THAN TWO OF A SIZE'S NOTHING-HIDDEN PAGES IS NOT A
    MEMBER. (c) CURED TOWARD WITHHOLDING until every town is a member; the limit is the switch-off page, always a member.
    (d) THE TELL COLUMN IS THIS TEST, GATED: 0 non-members of 92, Reveal off and on. THE NINE: power.entry NARROWED: it
    withholds a power only where a HIDDEN house raised it (ruling 11's condition met); a criminal power that stands without
    the hidden houses is served, as the place that never had them shows it; then membership decides (where "a criminal power
    with no house shown" is not a member at that size, the page falls toward switch-off). A switch that hides a power's row is
    NEW CAPABILITY for the owner: not now, a named survivor. REVEAL DM (the 30): the same rule. THE COST IS ACCEPTED, toward
    withholding; reported after the cure: non-members by Reveal setting, the towns fallen to switch-off, rows lost (median and
    worst), and one paragraph for the owner.
55. THE CHAIR, 16:45 (R3-TELL unit 1, STOP 1): THE TWIN SENDS MORE (`availableServices.criminal` rows with no `institution`
    key: "Fence (stolen goods)" 5 towns, "Muscle for hire" + "Protection racket" 5 towns; 212 drops or serves `[]`): every
    read that projects through the twin leaks. R3-CURE-8 FIRST: red first on the ten towns, the twin serves what 212 serves
    and no more; the builder NAMES every read that sends through the twin (surfaces, audiences); a PARITY WALKER over EVERY
    `availableServices` family: a row with no `institution` key is treated alike by both engines.
    ORDER (16:45): R3-CURE-7's merge; R3-CURE-8; the key-level table and the Defense-key proof; the tell's cure under ruling
    54; then "R3 <commit>". The successor (VEIL-28) is seated at 360,000.
56. THE CHAIR, 17:00 (sent as "veil ruling 55"; numbered 56 here, 55 being R3-CURE-8): WHAT AN IMPORTER MAY RECEIVE IS THE
    DOCUMENT THE SHARE SERVES TO THAT READER UNDER THE VEIL, AND NOTHING ELSE; the clone is built from the served document,
    never the stored row; if the veil cannot be applied the import fails closed. ONE VEIL, EVERY DOOR. MEASURED AT decc8c9e7
    (helper, `out/v27/imp/`): (a) 212's `import_gallery_dossier` (212 its latest) runs the veil as the gallery read does and
    adds the income-weight strip: its `data` is byte-equal to the gallery read's on every share, both chains, Reveal off and
    on; a marked share's hidden house reaches neither. An UNMARKED share (no veil record) is served exactly by the gallery and
    the import alike and only the link takes the default veil: 211's DECIDED design ("an unmarked share read as a listing is
    served exactly; the link's readers are players"), which is what TRAD-4's red met (it compared the import with the LINK).
    Before 211 the import ignored the veil; 211 alone left 13 traces (cured by 212). `fetchDossierForImport` reads no veil
    (it strips seed, `_config`, notes; the civility mask). A FROZEN share's import returns the LIVE name and tier (the doors'
    hunks cure it; their copy of the function lacks 212's weight strip: the merge keeps both). (b) NO REGISTRY ROW OR HOST FOR
    ANY DOOR: rows are keyed by payload path; the inversion test reads only `get_gallery_dossier` as anon with a veil record
    always written; nothing lists the functions that return a dossier. (c) DOORS WITHOUT THE VEIL (by search of the latest
    definitions): `get_unlisted_map` (168: the world snapshot as stored, anyone with the link); the tile columns
    (`_gallery_public_tile_rows`, 147: three values derived from `data`, behind the gallery lists and the dossier);
    `import_gallery_map` (072) goes through `get_gallery_map` (211, its world snapshot sent as stored); the client's
    worldExport 'player' variant (the owner hands the file: PLAUSIBLE that a hidden house travels). Stage IMPORT-DOOR
    (`briefs/IMPORT-DOOR-BRIEF.md`) after R3-CURE-8 and before E; "IMPORT-DOOR <commit>" to the reader as its own line.
57. THE CHAIR, 17:25: (a) the import door IS ruling 56 (the numbering stands). (b) AN UNMARKED SHARE READ AS A LISTING IS
    SERVED EXACTLY: 211's decided design STANDS, not re-opened; the import of an unmarked share equals its listing. (c) 212
    meets ruling 56 for the dossier; what is NEW is that THE REGISTRY COVERS PATHS, NOT DOORS: `briefs/IMPORT-DOOR-BRIEF.md`
    APPROVED: a door-census walker, red first, naming EVERY function and client path that hands a stored dossier, a world
    snapshot or a value derived from one to a non-owner, each held to the veil or to a written SHRINK-ONLY row saying why it
    needs none; then the cures (`get_unlisted_map`'s snapshot, `get_gallery_map`'s snapshot reached by `import_gallery_map`,
    the three tile values of `_gallery_public_tile_rows`), the client's world export measured with its STOP. After R3-CURE-8;
    "IMPORT-DOOR <commit>" to the reader as its own line. (d) THE FROZEN SHARE's live name and tier on import: at the DOORS'
    MERGE both the doors' cure and 212's weight strip are kept, PROVED BY A TEST at that merge, not a note. (e) The brief says
    whether anything `fetchDossierForImport` adds can now be removed (the server serves the veiled document). (f) Ruling 52's
    cost item MET (587 ms against 797). (g) A QUESTION FOR R5 (from SAME-1's sameness census): fourteen EXISTING state-prose
    wordings eligible only by a crime fact print in public prose: DS-ECO-6 "minor shadow activity" vids 4, 5; DS-DEF-3 Safe
    vids 3, 8, Unsafe vid 5, occupation curfew vid 2 (`crime wave`); DS-DEF-4 semi-organized vids 3-7, diffuse vids 2, 4,
    capture-none vid 2. On a shared read hiding the criminal houses: WITHHELD, RE-COMPOSED with the crime facts demoted, or
    SERVED AS STORED? One line a block, by execution (a helper launched 17:3x; `/var/tmp/v18/m27/r5q/`). The sameness seats
    write no new line needing a crime fact: these fourteen are this lane's and the reader's (R5, ruling 32's class).
58. THE CHAIR, 18:21 (R3-TELL-2 unit 1, ea60f67fd, read whole), VERBATIM: "THE TELL'S GATE RESTATED; ruling 54 (c)'s premise
    ("the switch-off page is always a member") is WITHDRAWN as false.
    1. A MEMBER. read(T, s) is GATED only where s hides at least one house T holds (a page that hides nothing tells nothing:
    allOpen is exempt). It is a member where its signature is that of read(T', s') for at least two distinct births T' of T's
    size such that s' hides NOTHING T' holds. Your pool is PART A (T' holds no hideable house): right for every page that shows
    no criminal house. PART B is owed for mixed settings: births that DO hold hideable houses, read under the settings that show
    all they hold (no rejection, so cheap): 150 a size.
    2. TWO GATES. One fine signature cannot be met at 300 births, and a coarse one alone would have hidden the tell you found
    (an absent key inside a present block). GATE-1, FULL fineness, 0 of 92, every gated setting, both engines, Reveal off and
    DM: EVERY SINGLE PART (each of the 87 fields, each family's count, each row-key state, each cross bit) holds a value seen in
    at least two nothing-hidden births of the size. Controls 0 of 48 on it; a part where they are not is NAMED to me, never
    dropped. GATE-2, the JOINT signature at the family level (your coarsening), calibrated by the controls: 0 of 48 at every
    gated setting, else too fine; then 0 of 92. Own and off now; mixed when part B stands. REPORTED, never gated: the full fine
    signature, hidden against controls, with the separating parts. If hidden exceeds controls beyond sampling (Fisher
    p < 0.05): STOP, send me the parts.
    3. THE CAUSES. (a) THE VEIL NEVER DELETES A KEY THAT NOTHING-HIDDEN PAGES ALWAYS CARRY: it serves the EMPTY form those pages
    show ('' here); GATE-1 holds all 87 to it. AND a fifth cross bit now: the drag sentence's state against the SERVED market (a
    no-market page with an empty drag sentence, where nothing-hidden no-market places print one, is a tell to anyone who knows
    the generator). If '' fails that bit, R3's cure re-derives the sentence over what the read serves. (b) R4's parts (the
    criminal-worded role, trace, ties, goals, memberships, cast) are STAGED: R3's gates run with them dropped AND LISTED RED as
    R4's; gated at R4's second cure; E's gate holds everything. (c) THE POWER'S ROW, tier-free and toward withholding: a
    criminal power's row is served only where no hidden house raised it AND the read still serves at least one criminal house;
    otherwise withheld. Its count goes in the owner's paragraph; if it passes a handful at town and village, tell me.
    4. BEFORE E, not now: both gates on every door that serves the veiled document (link, import, public) and on the old
    stored shape."
59. THE CHAIR, 18:44 (on ruling 57 (g)'s answer, 45ce337b3): A REGISTRY ROW THAT SAYS "WITHHOLD" WHILE BOTH ENGINES SERVE IS A
    FALSE ASSURANCE, and the content lanes' exemptions rest on those rows (a wording that needs a hideable fact is allowed only
    where its field is withheld from every shared read). RULED FOR R5'S BRIEF: (1) THE WALKER COMES FIRST, red first: for every
    registry row, the rule it states (withhold, recompose, serve) IS what both engines do, proved on born towns and on plants
    where no born town takes the row; its red list is R5's worklist, and it stays as a standing test. (2) The six blocks served
    as stored (DS-ECO-6 v4, v5; DS-DEF-3 Safe v3, v8, Unsafe v5, curfew v2) come right after the factions' description; each is
    WITHHELD in R5 unless a re-composition over what the read serves is proved a member by the tell's two gates (ruling 58;
    re-composition is the exception that must earn its place). (3) The eight already withheld stay. HELD FOR THE JOIN: the
    sameness lanes have added wordings since (the trouble half's eleven hooks with a hideable need; the place lane's smuggling
    chain rows; the Daily Life owner-only slot `commoner_resentments_dm`): the walker of (1) covers the rows that withhold
    them. When R3-CURE-8 returns: merge if green, then the tell's cure.
60. THE CHAIR, 19:10: A NEW STAGE, CHAINS-ROW (found by VEIL-28): no registry row names `economicState.activeChains`; its rows
    are built red first like every registry row (ruling 59's walker covers them). And R3-CURE-8's STOP 1 FOR THE CHAIR'S WORD
    (sent with the hand-over): both engines serve a NON-criminal services row whose `institution` named a hidden house in
    another spelling (plant: '(street gang)' beside the hidden "Street gang") with that key swept: a husk (ruling 42 (1)'s
    class), confirmed on the plant in 10 families + a custom one (25 of 25 reads), not measured on born towns (every synthetic
    '(…)' provider is criminal). The seat's recommendation: such a row leaves WHOLE, both engines, red first, in the tell's cure.
61. THE CHAIR, 19:21: the chair's ruling of 19:21 on the tell's three stops is with VEIL-28 and opens PART 29. So that
    nothing is lost if a message is: (1) GATE-1 is the hard gate (88 of 92 red today, 0 of 48 controls); (2) the empty form is
    what nothing-hidden pages show: `null` for the drag sentence; (3) a read is gated where it hides at least one house,
    whatever the setting is called; (4) GATE-2 at its coarsest level is a comparison with the controls (one-sided Fisher at or
    above 0.05) with every failing page listed, not a zero; (5) the power's row: only on a hiding read; a non-governing
    criminal power's row is withheld unless no hidden house raised it and a criminal house is still served; the governing row
    follows VR42 and the 11 are LOWER BY RULE, listed. (R3-TELL-2's instrument: `lane/veil-27-tell2-wip-2026-11-20` at
    f95ce89a5, hand-back `out/v27/tell2/TELL2-HANDBACK.md` Parts I-II, brief `briefs/R3-TELL-2-BRIEF.md`; its builder's
    context is spent: VEIL-28 seats a fresh one for the cure.)
## 2. The bytes (kept current)
| File | sha256 |
|---|---|
| 211 / its rollback (FROZEN) | `eface6d0…be0b01` / `ce8474ff…49712f`: proved at the cut 4c753ec52 |
| 212 / rollback on the lane (after R2; VR47 touched neither) | `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10` / `1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e` (`out/v24/seated/dry-sha.txt`) |
| 212 / rollback on the lane AFTER THE R3 MERGE (aa4e3079e) | `70c6eb4582b4a9282d7ec1221c4214ae4143e514ad208f3e838eaa301220a124` / `8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0`; 211 unchanged (`out/v26/r3merge/sha256.txt`) |
| 212 / rollback on the lane AFTER R3-CURE-6's MERGE (99416745f) | `6260803d1c4dddc13831f0e72c7e3ee0c88e4853e74c56e1c384b4251efb0218` / `8cbd7d1c…ded5b0` (unchanged); 211 unchanged |
| 212 / rollback on the lane AFTER R3-CURE-8's MERGE (b9dc6c4e5) | `1c15e3acf2d45ab71d59ffa31290de9faf4ce115b20a34c8b4b3250fd8a2ebc7` / `8cbd7d1c…ded5b0` (unchanged); 211 unchanged (`out/v27/r3c8-seat/sha256.txt`) |
| 212 on the R3 cure's branch (4db8e4208) | `de3efccbbf9905443e0444dc7976fd5200c82c2661536f5150999aea5b68eb9f`, rollback `653ae8b2…b2f4` |

## 3. The stages
| Stage | Where | State |
|---|---|---|
| R1 registry, R2 withhold-always, V10-2 | merged (4ddf8c60c, d136940c3, b5cb22caf) | read cold: they hold |
| VR47 the honorific | merged df6809f9c, bundles e4cce485f (VEIL-23) | done; the owner's count in section 5 |
| R3 roster choices | MERGED (VEIL-26: aa4e3079e through 4661a1353) + R3-CURE-6 (99416745f) + R3-CURE-7 (2c6cb8efa) + R3-CURE-8 (b9dc6c4e5) by VEIL-27; 212 `1c15e3ac…ebc7` | GREEN TOWARD WITHHOLDING. NOT SENT TO THE READER: the tell's cure under rulings 58 and 61 (VEIL-28; PART 29); then "R3 <commit>" with the thirteen towns, ruling 53 named, the 11 governing rows LOWER BY RULE (ruling 61 (5)). |
| CURATE notice (rulings 38 (c), 39, 40) | MERGED 7ddf4876f (`--no-ff` of `lane/veil-25-curate-2026-11-20` at 58f2fdf16: 1bd894613 + 58f2fdf16) | DONE: red 3/16 at 1bd894613's source, green 25/25 (`/var/tmp/v18/out/v25/curate/`); display only, 212 unchanged. Recorded, not cured: the notice reads `category` only (R3 also takes a /thie/ name: it can stay silent there) and does not exempt the governing power (VR42: it can over-warn there). RE-CHECK its condition if R3-CURE-4 narrows power.entry's reach. |
| R6 tests | `lane/veil-22-r6-2026-11-20` 7d9ebd078 | COMPLETE, NOT MERGED; merge after R3 and re-run its MAIN arm (red 50 at R6's base: `cast.stakes` by R3's power, `cast.roles` wording by R3 or R5) |
| R4 the people | `lane/veil-22-r4-2026-11-20` a4b89bf9d (R4 dfa031f3e + first cure) | NOT GREEN. AFTER "R3 <commit>", IMPORT-DOOR and R6: R4-CURE-2 (`briefs/R4-CURE-2-BRIEF.md`; STOP 1, STOP 3, the one salt, the catalogue red; VR48 its own commit; RULING 53's FOLD: one id-as-text helper per engine, the six 212 sites repointed, the walker retired; R3-CURE-5's join hazard: the re-key runs AFTER the copy pass). |
| R5 composed prose, R7 | not started | R5 after R4 (rulings 14, 28, 32, 57 (g), 59): ITS BRIEF PUTS RULING 59's WALKER FIRST (every registry row's rule is what both engines do; its red list is R5's worklist), then the factions' desc, then the six blocks served as stored (`out/v27/r5q/RESULT.txt`), withheld unless a re-composition earns membership by ruling 58's two gates; R7 after R6 |
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

- THE BROKERAGE PLANT (ruling 43; VEIL-26's helper, 12:5x): copy `out/v26/brok/brok_plant.mjs` to a worktree's root and
  `out/v26/brok/brokProbe.pglite.test.js.txt` to its `tests/security/brokProbe.pglite.test.js`, then `env -u GIT_DIR -u
  GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE sh
  scripts/gate-tail.sh npx vitest run tests/security/brokProbe.pglite.test.js --maxWorkers=1` (writes
  `/var/tmp/v18/out/v26/brok/summary.tsv`). RESULT AT 15567e597: NOT REAL (`out/v26/brok/summary.tsv`: (B) and (D) 0 hits of
  24 reads each; (A) and (C) 24 of 24; (C) differs from (A) only at the house's own `tags`, `serviceKeys`). Both engines judge
  hideability on the untrimmed card before any eye trims it (212 `_gallery_veil_apply` CTE `h` → `_gallery_veil_house`; the
  twin's `galleryVeil.js :: applyVeil`), then remove by id. To the security reader's attack list (the chair's word).
- VEIL-26 SEATED, in a fresh container (11:50-12:15, at eca0d655d): every section-4 instrument re-made and equal to PART 26:
  sha256 four; `--check` 0; walker 11/11; harnesses 8/8; acceptance exit 0, 40 PASS; the gate 42|38|66|55 UNREGISTERED
  (`out/v26/seated/`).

- VEIL-27'S INSTRUMENTS, ONE COMMAND EACH (a FRESH container: first section 4's cluster, pg driver, library, probes and `npm ci`):
  the private chains and the acceptance run: `cp docs/chair/2026-11-20/veil/out/v27/seated/run-all-v27.sh
  /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/ && cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod
  sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh <tree> <outdir>` (builds v27x211 and v27x212; EXIT 0, 40 PASS);
  THE GATE: `export PGHOST=/var/tmp/rv7 PGUSER=postgres; createdb -T v27x211 <tpl> && psql -q -v ON_ERROR_STOP=1 -d <tpl> -f
  <tree>/supabase/migrations/212_share_veil_later_cures.sql && sh <tree>/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh
  <tree> <outdir> <tpl> 2` (about 2 minutes on a quiet box; EXIT 0: HIGHER 0, EQUAL 79, LOWER 13 at 6260803d);
  THE GUARDS: `cp docs/chair/2026-11-20/veil/out/v27/seated/g27.sh /var/tmp/v18/ && sh /var/tmp/v18/g27.sh <worktree> <tag> born sv s1
  s2 harn twin known` (outputs `/var/tmp/v18/out/v27/<tag>/`; one batch at a time; the known reds: observedShapeReaders in
  twin, the four in known); THE COST LAW: `out/v27/cost/cost-tip.sh` (needs `/var/tmp/v18/m27/{big.probe.jsx,big-cost.mjs,cost.sh,base}`:
  big.probe from `out/v24/r3c2/measure/`, big-cost from `out/v25/r3c5/measure/` with the town path set to
  /var/tmp/v18/m27/big.json and dbs v27x211/v27x212, cost.sh from `out/v24/r3c2/measure/`, base = `git archive e5b95d637
  supabase/migrations`); run it on a QUIET box. Builders' unfinished work is saved under `out/v27/wip/` (diff + untracked tar).

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
  kept while the government's name stays) is met by 12 of 140 born towns ("Corrupt Council"; R3-CURE-5, ruling 52); a hand town serves its governing "Thieves' Guild"
  whole, share 60, and that arm is kept.
- A CALMER CRIME PICTURE on some shared pages (ruling 30): where the veil withholds toward safety, the Defense reading a
  visitor works out from the page can come out LOWER than the same town would show with the hidden houses truly gone: 13
  of 92 generated towns at the R3 merge; never HIGHER (`out/v26/r3merge/gate-table.txt`). BY RULE: 8 rest on the criminal income
  row (a row a hidden house raised is not served), 3 on power.entry's reach (the criminal power kept off), 2 on the covert
  service. THE SECURITY READER'S QUESTION WAS ANSWERED BY THE LANE ITSELF: on all 13 the calmer page IS a tell today (ruling
  49); the cure (R3-TELL) makes it equal to a page a house-free town shows under some setting of the owner's switches.
- A RENAMED CRIMINAL HOUSE'S LINE in the criminal-operations list (seat's note on R3-CURE-2): where some criminal house is
  hidden, a SHOWN criminal house the DM renamed loses its line in the operations list on a shared page (the list is rebuilt
  from catalogue names only). Toward withholding. COUNT: 74 of 76 plants (R3-CURE-5, ruling 52).
- AN OLD TOWN'S POWER SHARES (ruling 38 (e)): if an old stored town's power shares do not add up to 100, a shared page shows
  them rescaled to 100, even when nothing is hidden. The same powers, in the same order; only the numbers differ.
- THE CRIMINAL POWERS KEPT OFF WHILE A CRIMINAL HOUSE IS HIDDEN (power.entry's reach): on a shared page the town's criminal
  powers do not appear while any criminal house is hidden, even if the owner switched "Hide everything criminal" to shown.
  The owner's Curate screen now says so in one sentence (merged 7ddf4876f), only where the town has a criminal power.
- THE REASON AFTER "Unstable" on an old page's card: after the doors' merge, the card shows the band word alone ("Unstable")
  on every read that is not the owner's (VR44).

## 6. Log (every hour from `date -u`; PART 25 section 6 holds VEIL-24's)
- 10:22 seated beside VEIL-24 at 55a264a78; first message: seven rulings at full strength, five gaps (cured by VEIL-24 at 10:29).
- 10:23-10:40 instruments re-made in a fresh container (section 4): `--check` 0; walker 11/11; harnesses 8/8; acceptance
  exit 0, 40 PASS; the four sha256 as PART 25; the gate at 55a264a78: new-gallery 13|21|13|UNREGISTERED 42, new-link
  13|21|13|38, master-gallery 13|15|10|66, master-link 13|15|10|55 (`/var/tmp/v18/out/v24/gate-55a264a78/readings.txt`,
  copied to `out/v25/seated/`).
- 10:28 the chair: the gate per town against the regenerated counterfactual, the control reported not gated, on three
  conditions; LOWER does not block on ruled rules; R5's order (rulings 30, 32, 37 as PART 25 carries them).
- 11:12 THE LANE IS YOURS at 214c36dde; branch fast-forwarded; 211 proved. Ruling 38. b907c75c9 and 9b18835d1 read line by
  line; their reds and greens re-run (`out/v25/rerun/`); R3-CURE-4 brief written and its builder launched (11:16).
- 11:24 the chair: the Curate notice now, beside R3-CURE-4 (ruling 39); its builder launched 11:22.
- 11:42 the Curate notice returned (1bd894613), read, re-run; its sentence to the chair.
- 11:43 the chair ruled the notice (ruling 40); the notice's builder resumed for the words and the condition (11:44). R3 red at 06e9e64b3 re-run: born test 6 of 37 red, each a cure's new arm (`out/v25/rerun/born-red-06.txt`).
- 11:55 the Curate notice merged 7ddf4876f (re-run: red 3/16, green 25/25).
- 12:09 the chair: ruling 41; the tell column relayed to R3-CURE-4 (12:10). The seat's own check of five LOWER towns at 9b18835d1 matches D1 (`out/v25/lower-check-9b.txt`).
- 12:4x R3-CURE-4 returned at its mark (c5786c5ce; units 1-2 uncommitted); its branch pushed; R3-CURE-5 brief written (12:20).
- 12:21 the chair: ruling 42; HAND OVER NOW. 12:21 PART 26 made true for the hand-over (section 8).

- 11:48 VEIL-26 seated beside VEIL-25 at eca0d655d; 12:15 instruments re-made, all equal (section 4).
- 12:25 the chair: R3-CURE-4's findings; the brokerage lead (ruling 43).
- 12:32 THE LANE IS YOURS at 15567e597; branch fast-forwarded; 211 proved; PART 26 re-read (rulings 41, 42, section 8). Ruling 44.
- 12:35-12:50 R3-CURE-4's branch read and re-run (section 3). The brokerage plant (helper): NOT REAL; one line to the chair.
- 12:57 PART 27 current; waiting for R3-CURE-5's relay.

- 13:05 ANOMALY: a plain push of 2cfea785d ran `.husky/pre-push`'s NON-lane path (`npm run check`, the whole suite) though
  the ref was `lane/*`; the push landed; the check was killed at 20 min; its dead lock removed. Cause NOT established. Every
  later push runs under a guard that kills it when `> settlementforge@1.0.0 check` appears (the command in section 6's next line).
- 13:31 the chair (13:31, to every seat): the weekly usage warning; nothing stays only in a container; `-wip` branches for
  unfinished work; one builder at a time; R3's merge is the lane's one aim. THE GUARDED PUSH: `L=/var/tmp/v18/out/v26/push.txt;
  (git push origin lane/veil-26-2026-11-20 > $L 2>&1; echo "EXIT $?" >> $L) & P=$!; for i in $(seq 1 60); do sleep 10; grep -q
  "settlementforge@1.0.0 check$" $L && { pkill -P $P; kill $P; break; }; grep -q '^EXIT' $L && break; done`.

- 14:17 the chair: R3-CURE-5 on origin as WIP (`lane/veil-25-r3c5-wip-2026-11-20` at 101fae14d: dbff7eeb3 the cure of units
  1-2; c4e2b1ab2 the measures); read dbff7eeb3 now; the key-level table to the chair.
- 14:28 THE KEY-LEVEL TABLE (c4e2b1ab2 `out/v25/r3c5/unit2-keylevel-table{,-master}.txt`, twin only) to the chair: new shape,
  `contestsNiche` served on 0% of nothing-hidden powers (the veil never serves it); master's shape, 67-88% of nothing-hidden
  powers lack it at every kind and size; person keys 0 everywhere; withholding the holder = 97/99 rows in 68/70 of 92 towns.
  RECOMMENDED: leave the key off (today's behaviour); the server's side to be read before the merge. THE CHAIR RULES.
- 14:40 dbff7eeb3 READ ONCE (212, rollback, twin, born test): holds on §8 checks (1)-(3). ONE GAP TOWARD SENDING, sent to the
  chair for R3-CURE-5: the pre-sweep goal/membership match (and the husk arm) pairs people by id ONLY WHERE THE ID IS A
  STRING; a number id or no id keeps a swept goal/membership as a husk. Cure: id as text, a numeric-id plant, red first.
- 14:19 PART 27 current. NEXT: R3-CURE-5's final commits read as a difference; then R3's merge and "R3 <commit>" with the
  thirteen LOWER towns by name and rule (ruling 45); the chair seats VEIL-27 when the merge begins.

- 14:24 the chair: R3-CURE-5 finished (4661a1353); merge it; rulings 49-52. 14:33 the merge began: aa4e3079e (`--no-ff`).
- 14:52 RE-RUN AT THE MERGED TREE (`out/v26/r3merge/`, every exit 0): the gate (template x211 + the tree's 212) HIGHER 0, EQUAL
  79, LOWER 13 of 92, "Magical crime" above 0, server = twin, Reveal off = on; R3's born test 22/22; galleryServerVeil +
  galleryVeilHandRows 43/43; the two walkers + criminalVeilSwitch 26/26; `--check` 0; acceptance exit 0, 40 PASS; sha256 as
  section 2. THE THIRTEEN LOWER TOWNS AND THEIR RULES (the swap that alone closes each): `income.criminalRow` (8):
  r3m-city-none-0-31, r3m-city-under_siege-1-118 (+covert service), r3m-town-insurgency-1-94, r3m-town-under_siege-0-18,
  r3m-town-under_siege-0-28 (+covert), r3m-town-under_siege-1-88, r3m-town-under_siege-1-98 (+covert), r3m-town-wartime-0-29
  (+covert); power.entry's reach (3): r3m-metropolis-insurgency-1-124, r3m-metropolis-wartime-0-59, r3m-town-none-0-23; the
  covert service alone (2): r3m-town-none-0-17, r3m-town-none-1-91.
- 15:13 VEIL-27: THE LANE IS YOURS at 99a159f59 (the chair, 15:10); fast-forwarded; 211 proved; R3-CURE-6 merged (99416745f); ruling 53; PART 28 begun.
- 16:57 RE-RUNS AT THE MERGED TIP 72913fc86 (`/var/tmp/v18/out/v27/`): green list (born 23/23 and serverVeil+handrows at 8d5768ebc; s1, s2, harnesses at the tip all EXIT 0; twin 15/16, the known observedShapeReaders red only; known-reds the four); acceptance EXIT 0, 40 PASS; THE GATE HIGHER 0, EQUAL 79, LOWER 13, the same thirteen. R3-TELL unit 1 returned (a43bca3d1, merged fbc41ad1e): rulings 54-55. RULING 47's CONDITION MET AND RULING 50's READING PROVED (helper, `out/v27/kl/`): the server's key-level table equals the twin's, 0 parity findings over 464 pages a shape, both shapes, Reveal off and on; the Defense key recomputed from SERVED fields alone equals the served key in 928 of 928 page-reads (the page's own path: `DefenseTab.jsx` -> `criminalStructureOf`). NAMED FOR THE READER, PLAUSIBLE, NOT MEASURED: the shared page's Defense SENTENCE `publicProse['defense:criminal']` is composed at save time from the owner's record (R5's class, ruling 32).
- 17:12 THE COST LAW AT THE TIP (212 6260803d; quiet box, load 1.0; `out/v27/cost/`): the largest born town's Reveal-DM gallery read 587.3 ms against twice 211's Reveal-OFF read (2 x 398.6 = 797.2): WITHIN; gallery off 621.9 (1.56x), link 552.1 (1.78x). The v8245 rows (3 rounds, x211 | base 05b915ab | after): 10,000 hit rows 6,828 | 8,313 | 8,043 ms; 500+500 rows 126 | 243 | 248 (1.97x, the base already 1.93x: the TIGHTEST row, not R3's); deep 200 houses 471 | 493 | 523; deep 600 houses 1,580 | 1,687 | 1,683. RULING 52's 'owed before E' MET at this tip (to be re-taken at E). R3-CURE-8 and R3-TELL-2 (unit 1) launched at 5f45144ae.
- 18:31 RULING 57 (g) ANSWERED BY EXECUTION (helper, at 43d4c309b; `out/v27/r5q/RESULT.txt`; twin 960 born towns, server 20 + 6 plants, equal on every path): NONE of the fourteen is re-composed. DS-DEF-4 (8: semi-organized v3-v7, diffuse v2, v4, capture-none v2) WITHHELD (the whole `defense:criminal` site leaves where a house is hidden whole, both engines). DS-ECO-6 v4, v5 (`economy:economics.shadowEconomy.sentence`, 25 and 97 towns) and DS-DEF-3 Safe v3, v8, Unsafe v5, curfew v2 (`defense:state.publicOrder`) SERVED AS STORED: the registry's `prose.shadowEconomy` row says withhold and the publicOrder rows say recompose, NEITHER ENGINE APPLIES THEM YET (R5's stage, ruling 14 and 32: not built). Six variants were planted (no born town chose them); capture-none v2 never chosen (the composer reads the stripped record). FOR R5's BRIEF: these six blocks first after the factions' desc; and a walker that a registry row's rule IS applied by both engines (today a row can say withhold while both serve).
- 19:40 R3-CURE-8 returned (60131acc9), read once, red 11/11 and green 37/37 + 43/43 re-run; merged b9dc6c4e5; 212 1c15e3ac. R3-TELL-2's instrument returned on ruling 58 (f95ce89a5, pushed -wip); the chair ruled its stops to VEIL-28 (ruling 61). HANDED OVER (section 8).

## 7. THE JOIN (the chair's word in VEIL-25's prompt): what the join must re-prove on the joined document
The working line (origin/lane/join-2026-11-14, at 0c906948 when this was written) and four content lanes ADD SERVED TEXT at
the join: the traditions' descriptions (their text a function only of facts no act of the DM can hide), the session sheet's
frame (the crisis page takes an explicit audience), the seat's train (a holder leaf that takes an audience and fails closed
to the reader's), and a possessive that opens a bracketed qualifier ("Tserenpuntsag Ongirad the miller's hours"). Each
brings its own proof for the security reader; THE JOIN RE-PROVES ON THE JOINED DOCUMENT, not on each lane's: the name search
(ruling 28: the lane's fold, a name and its bare form, case-blind, a possessive and a plural ending as a boundary; ids as
strings and as keys) over every served string of the joined body, both shapes, gallery and link, Reveal DM off and on, with
nothing found outside R5's named list; the husk comparison (ruling 38 (a)) over the new served objects; ruling 32's
counterfactual over every new sentence that chooses a word by a rank, share, count, superlative or "only"; the gate's four
readings at UNREGISTERED 0 (ruling 25); and the render-twice and inversion harnesses. The line's walker
`tests/lint/namesInSentences.walker.test.js` holds a COPY of the fold in `src/domain/display/gallerySecondHomes.js`: at the
join it must import and call the lane's own function (`buildNameSearch` / the bare fold), never its copy.

## 8. HANDED OVER (VEIL-27 to VEIL-28, at the chair's word of 19:10; written 19:40 UTC)
THE LANE: `lane/veil-27-2026-11-20`, tip = the commit carrying this section (read it back from origin). 212 `1c15e3ac…ebc7`,
rollback `8cbd7d1c…ded5b0`; 211 unchanged since the cut 99a159f59 (`git diff 99a159f59 -- supabase/migrations/211*
supabase/rollback/211*` empty). MERGED BY VEIL-27, each read once line by line, its red and green re-run by the seat:
R3-CURE-6 (99416745f), R3-TELL unit 1 (fbc41ad1e, measures), R3-CURE-7 (2c6cb8efa, test-only), R3-CURE-8 (b9dc6c4e5).
GREEN AT 72913fc86 (section 6): the gate 0/79/13, acceptance 40 PASS, the guards and harnesses, the known reds only, the cost
law (ruling 52 MET), ruling 47's server table (0 findings), ruling 50's proof (928/928). AT b9dc6c4e5: R3's born test 37/37,
serverVeil + hand rows 43/43 (seat); the gate, acceptance, harnesses, walkers by R3-CURE-8's builder's count.
NOTHING RUNNING: every builder of this seat has returned. Branches on origin: `lane/veil-27-r3c7-2026-11-20` (merged),
`lane/veil-27-tell-2026-11-20` (merged), `lane/veil-27-r3c8-2026-11-20` (merged), `lane/veil-27-tell2-wip-2026-11-20` at
f95ce89a5 (R3-TELL-2's INSTRUMENT, NOT MERGED, read by the chair, not by this seat line by line; brief
`briefs/R3-TELL-2-BRIEF.md`; hand-back `out/v27/tell2/TELL2-HANDBACK.md`; its pool caches `/var/tmp/v18/t2/` are in THIS
container only and are rebuilt by its `tell2.sh` (about 2.5 CPU-hours)).
VEIL-28's ORDER (the chair's, 19:10 and 19:21): the tell's cure under rulings 58 and 61 (PART 29 opens with the chair's
19:21 ruling), with ruling 60's non-criminal husk if the chair rules it; "R3 <commit>" (section 3's R3 row); IMPORT-DOOR
(`briefs/IMPORT-DOOR-BRIEF.md`, rulings 56, 57); CHAINS-ROW (ruling 60); then R6, R4-CURE-2 (+ ruling 53's fold), R5 (ruling
59's walker first), R7, L, the doors (+ ruling 57 (d)'s test), the stored figures, E (ruling 58 §4: both gates on every door).
