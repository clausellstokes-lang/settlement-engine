RE-REFUTE (the CURE) — DS-DEF-2 · pool `Beasts & Monsters: settled, defenses beyond the need`
seat: REFUTER (opus) · test: ADDENDUM 14 as the Fable sitting re-cut it (ADDENDUM 18 · CONTRADICTION-TABLE §V)

WHAT I READ: cure.md whole (rows + all 8 NOTES sections) · card.md whole · speakers.md · refute.md ·
CONTRADICTION-TABLE.md §V and floors 1-4 · and, READ IN THE DOCK (never entered, never written, no
test run): institutionalCatalog.js · defenseInstitutionBuckets.js · faceSources.js ·
assembleInstitutions.js · rulingStructure.js · moveGrammar.js · defenseDisplay.js · safetyProfile.js ·
terrainHelpers.js · tests/lint/proseMoveGrammar.walker.test.js:826-918.

A FACE IS LAWFUL UNLESS IT CONTRADICTS THE RECORD. Silence is permission. I hunted contradictions only.
THE CURE FIXED ALL THREE NAMED TARGETS. 32 of 35 faces stand. 2 FAIL, 1 WITHHELD, and the CRAFT
verdict is DULL again — on ONE axis, and not the axis the cure was built against.

══════════════════════════════════════════════════════════════════════════════
I. THE THREE NAMED TARGETS — ALL THREE CURED, VERIFIED AGAINST THE ENGINE
══════════════════════════════════════════════════════════════════════════════
v2f12 (target 1, floor 1 + F4-02) CURED. "One of the elders takes it that the households mend their
  own stretch without being asked, and that what is owed is written down nowhere." The denial of pay
  is gone, so nothing now argues with its own co-rendering spine or with `defenseGenerator.js:181-192`.
  What survives is a CUSTOM and a gap in the RECORD of it, and the engine holds no field against either.
  ⭐ AND THE CURER'S SUBSTITUTION WAS RIGHT, RE-VERIFIED: the refuter's own cure read "...before the
  hall is asked". `ELDER_TIERS` is `['thorp','hamlet','village']` (faceSources.js:81) and the ONLY hall
  rows in the catalogue are `Town hall` (institutionalCatalog.js:1550, town) and `City hall` (:2268,
  city). The two sets do not intersect on ANY town. The curer caught a floor the refuter's own words
  would have shipped, and flagged it rather than burying it. Confirmed and endorsed.
v3f10 (target 2, F2-05) CURED OF ITS PERFECT — and it walks into a different floor. See FAIL 2.
v3f8  (target 3, F2-05) CURED. "A guild factor holds that the trades pay the keeping, and that the hall
  takes their silence for consent." Both perfects gone. AND THE SEATING HOLDS, for a reason the curer
  did not give: `GUILD_NAMES = ['craft guild']` (faceSources.js:89) matches only town `Craft guilds
  (5-15)`, city `Craft guilds (30-80)` and metropolis `Craft guilds (100-150+)`; a `Town hall` is
  required at town and a `City hall` at city AND at metropolis, because the metropolis catalogue is
  `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`
  (assembleInstitutions.js:244). Wherever the guild seats, the hall stands. PASS.

══════════════════════════════════════════════════════════════════════════════
II. THE FINDINGS
══════════════════════════════════════════════════════════════════════════════

⛔ FAIL 1 · v2 face 6 · `[market]` · FLOOR 1 (F1-20) — A HALL ON A TOWN THAT HAS NO HALL
  QUOTED: "What becomes of the rest is the hall's business."
  THE FIELD: the `market` source is seated by `MARKET_NAMES = ['market','bazaar','fair','trade
  center','exchange']` over the live roster (faceSources.js:97, :171, :137) — NOT by the tier. Below
  town that list is matched by the village's `Weekly market` (institutionalCatalog.js:484, baseChance
  0.6) and `Fish market` (:517). The preimage carries village (card §1: thorp 13 · village 1 · town 18
  · city 43 · metropolis 43). And there is NO hall row below town anywhere in the catalogue: the only
  two are `Town hall` (:1550) and `City hall` (:2268). At village the governing rows are `Lord's
  steward` (:794), `Village reeve` (:802) and `Village elder` (:810), all `exclusiveGroup: 'government'`
  — one person, never a room — and `rulingStructure.js:171-173` prints them on the Power tab as
  'Feudal Stewardship' / 'Elected Reeve' / 'Elder Council'.
  WHICH IS THE RECORD: the roster. This is neither engine prose nor a generation-time projection — it
  is the closed institution roster (§V.0 floor 1) and the governing label printed from it on another
  tab of the same dossier (§R-12). F1-20 is the row by name.
  ⛔ AND IT IS THE SITTING'S OWN NAMED FAILURE MODE, VERBATIM: "do not infer a body into a key's
  silence that a `required: true` row or a same-tab sentence denies."
  ⚠ THE CURER CHECKED FOR THIS AND WAS DEFEATED BY THE CARD, NOT BY CARELESSNESS. Section 5 of cure.md
  runs exactly this test and concludes "`[market]` and `[hall]` are town-and-city (v2 f6)". That is the
  card's (7) SOURCES line ("Town and city only"). The card's own (5) says the opposite — "market OPEN
  ... open at thorp, village, metropolis" — and (5) is the one that matches the code. See WIRING 4.
  CURE: take the hall out and leave the withheld reason where it is, which is the good half of the face.
    "The stallholders reckon the mending is the first call on the stalls, and that what it leaves is
     spoken for before they see it."
  (No hall, no new body, one sentence, and it still stops on the thing nobody will name.)

⛔ FAIL 2 · v3 face 10 · `[muster]` · FLOOR 1 — THE ONLY ROW THAT SEATS THIS SOURCE SAYS OTHERWISE
  QUOTED: "the knowing is the whole of what the town asks of them"
  THE FIELD: `DEFENSE_BUCKET_KEYWORDS.militia = ['citizen militia','militia']`
  (defenseInstitutionBuckets.js:92-94), and `sourcesOf` seats the muster on `forces.militia.present`
  alone (faceSources.js:139). Walk the preimage against that list and EXACTLY ONE ROW SEATS THIS SOURCE:
    · thorp — `Household levy` (institutionalCatalog.js:104) matches NEITHER limb. No muster.
    · village — `Citizen militia` (:867). THE ONLY ONE.
    · town — `Citizen militia` (:1340) shares `exclusiveGroup: 'civilianDefense'` with `Town watch`
      (:1348), which is `required: true`. It can never stand. No muster.
    · city / metropolis — no militia row exists in either catalogue (the metropolis merges the city's,
      assembleInstitutions.js:244, and the city's Defense block is `City walls and gates` ·
      `Professional city watch` · `Garrison` · `Citadel`, :1910-1940). No muster.
  That one row's PRINTED DESCRIPTION reads: "Organised community defense. Musters for raids and
  monster incursions. More reliable than hamlet levies." The face totalises the town's ask — the
  knowing is THE WHOLE of it — and the mustering the row exists to do is outside that whole.
  WHICH IS THE RECORD: the roster row's own printed description, which is what F1-32 makes the record
  (a row's description fixes the fact against the prose) and what the reader sees beside the face
  (§R-12). Not a projection, not a machine sentence.
  ⚠ THE CHAIR'S GENERAL FORM DOES NOT RESCUE IT. That form needs the face's OWN neighbouring clause to
  FORCE the lawful reading. Here the neighbouring clause is "they know their places on the works" —
  which supplies the knowing and forces nothing about the ask. The pool's own v2f10 shows the lawful
  move in one line: "The muster has it that the calling is the whole of the arrangement" — THE CALLING,
  which is the row's word, not a totality that excludes it.
  ⚠ AND THIS IS THE REFUTER'S OWN CURE TAKEN VERBATIM (cure.md §1, target 2). The cure removed the
  perfect correctly and inherited the totality with it. The fault is mine before it is the curer's.
  CURE: stop totalising the ask; put the emptiness on what the places have to teach, not on the duty.
    "One of the muster says they know their places on the works, and that the places are easier to keep
     in mind than the reason for them."
  (No perfect, no magnitude, no totality over the ask, and the hook — nobody remembers why — is sharper.)

⚠ WITHHELD · v2 face 2 · `[tavern]` · the field is NAMED, the denial is not closed
  QUOTED: "the works are the last thing the purse comes round to"
  THE FIELD: `defenseGenerator.js:182`, `:189-192` — ONE multiplier, `milUpkeepMult = min(1, 0.6 +
  econOutput/50 × 0.4)`, over "garrison wages, wall maintenance" TOGETHER. F4-03 adds that the four
  gates "differ in degree only, never in direction". Variant 2's co-rendering spine fixes the referent
  of "the purse" as that military purse in its own words ("One purse meets the keeping of that work and
  whatever else the town's defence costs"), so the face is ordering disbursement INSIDE the one
  multiplier, which the engine does not model and whose own asymmetry runs the other way
  (`:184-187`: "built walls keep standing and unpaid soldiers desert slowly").
  WHY I WITHHOLD RATHER THAN CHARGE: F4-02's named claim is "the wall kept and the muster NOT", and
  this face denies payment to nothing — it puts the works LAST in a queue that still reaches them, which
  is the same shape the curer defended at v2f5 ("the incidence of a charge and not a split in the
  multiplier") and which the pair's other half ("met in its turn") holds open. A queue position is not
  a split. The burden is mine and I cannot close it. THE FACE STANDS; the chair should rule whether an
  ORDER inside the single purse is F4-02's direction or merely the tavern's account of one.

══════════════════════════════════════════════════════════════════════════════
III. THE CRAFT VERDICT AT THE POOL GRAIN — DULL. THE COLLAPSE IS THE OPENER.
══════════════════════════════════════════════════════════════════════════════
Every figure below is an EXECUTED match over the 38 cured rows as cure.md carries them (parsed out of
`## THE ROWS`, joinable comments stripped), not a reading of the prose.

⭐ FOUR OF THE PRIOR SITTING'S SEVEN MEASURES ARE GENUINELY CURED, AND I RE-MEASURED EACH:
  (1) the attributed two-clause compound — single-sentence "[source] says/holds A and B": 12 of 35.
      WAS 25 of 35. Six shapes now carry the pool where one did.
  (2) THE NEGATION LANDING — the figure that moved me: 10 of 35 = 29% on the WIDE reading (any
      negative-valued landing word: no · not · nobody · nothing · never · none · without · little ·
      least · last · short), 6 of 35 = 17% on the STRICT one (the final clause landing on what is NOT
      there). WAS 18 of 35 = 51%. The bar is one third = 11.67. UNDER IT ON BOTH READINGS, for the
      first time in two sittings, and batch 4's 16-of-27 rate is broken.
  (3) the same few nouns: ZERO of 35 faces land on `the works` or `the keeping`. WAS 22 of 35. The
      words are still concentrated (`works` in 15 faces, `purse` 6, `mending` 6) but no longer at the
      landing, which is what the measure charged. 236 distinct words over 764 tokens.
  (5) the attribution verb: the longest run in ANY variant is TWO.
      v1 says says account holds says says account says — says has-it holds
      v2 says says account says says reckon says account says has-it holds takes-it
      v3 says says holds holds account holds say holds says says take-it
  (6-as-the-curer-numbered-it) the road echo: `road` appears ONCE in the pool, in spine 3, and in no
      face. Executed.
  This pool does NOT read as one sentence twelve times, it is not a camera with no speaker, twelve
  speakers carry real and opposed interests, and it is not duller than the three shipped rows it
  replaces. The cure did most of what it was asked.

⛔ AND IT RE-COLLAPSES ON THE ONE MEASURE THE CURE'S TABLE DOES NOT CONTAIN.
  THE PRIOR SITTING'S FINDING (6) was the OPENER RULE, measured v1 0 · v2 3 · v3 0. The cure's table
  renumbers past it — its rows (1)-(6) are construction · negation · nouns · pair 2 · verb run · the
  road echo — and the opener is nowhere in the packet. MEASURED ON THE CURED ROWS:
      v1: "One of the" opens f6 (watch) · f8 (garrison) · f11 (elders)
      v2: "One of the" opens f7 (watch) · f9 (garrison) · f12 (elders)
      v3: "One of the" opens f2 (watch) · f9 (garrison) · f10 (muster)
      3 · 3 · 3 = NINE of 35 faces, and the breach is now in EVERY variant instead of one.
  The chair's own mechanical rule is "no face may open on the same three words as a sibling", and these
  are the rules "that red the build and stand". Read down any variant and the three force-seated
  sources speak in one voice with one entrance. That is one construction repeated, which is the DULL
  verdict's first named collapse, and the cure tripled it while fixing five other things.
  ⚠ A RESIDUAL SPINE-FACE ECHO, measured as trigrams and bigrams: spine 2 carries "the keeping" and so
  do v2f1 and v2f11; spine 3 carries "on the works" and so does v3f10. A spine co-renders with every
  face of its variant. Minor beside the opener, and named so the next cure takes both in one pass.
  THE CURE IS NARROW: re-open three faces per variant. Nothing else in this pool needs rewriting, and
  a whole re-draft would cost the four measures that have finally landed.

══════════════════════════════════════════════════════════════════════════════
IV. THE CITATION GATE — MEASURED ON THE CURED ROWS, CLEAN
══════════════════════════════════════════════════════════════════════════════
I copied `CLAUSE_DETECTORS` verbatim out of `moveGrammar.js:200-232` and matched all 38 cured rows, at
the ROW grain and again at the CLAUSE grain:
    PROVENANCE 0 · 0.   INSTITUTION 4 · CONSEQUENCE 3 · PERSON 3 · HISTORY 1 · PRESENT 27.
`tests/lint/proseMoveGrammar.walker.test.js:853` and `:917` pin `cited.length` to exactly 7 and this
packet moves it by ZERO. The sibling pin `genericNotCited.length === 11` also holds: no face carries
`the (rolls|registers|ledgers|books|records) (say|shows|holds|carries|names|records|has)`.
⛔ THE HAIR'S BREADTH THE CURER FLAGGED IS REAL AND I RE-RAN IT: the detector's limb is
`the elders (?:say|hold|remember|keep)`. All three elders faces survive on the verb alone — "has it
that" · "takes it that" · "take it that". NORMALISING ANY ONE OF THEM TO "The elders say" SPENDS A
CITATION AND REDS AN EXACT-INTEGER PIN. The HISTORY hit is v3f3, the detector's `after the` limb firing
on "asking after the works"; no exact pin reads HISTORY.
MECHANICAL ARMS, all executed, all zero: em dash · en dash · exclamation mark · digit · semicolon ·
colon · ellipsis · contraction · future indicative. `has|have|had` matches three faces and none is a
perfect ("has no occasion", "has it that" ×2). `no longer` zero. `{settlement}` once, in spine 1, in no
`[face]` row. The self-citing vocabulary ruling 40 bars: zero.
⛔ ONE THING I DID NOT DO AND NO CHAIR SHOULD READ AS DONE: no test was run and no byte was written in
any dock. Every gate statement above is a source-read prediction over an executed regex match; it is
not a green.

══════════════════════════════════════════════════════════════════════════════
V. WIRING — WHERE THE CARD IS WRONG AND NO FACE IS CHARGED
══════════════════════════════════════════════════════════════════════════════
W-1 THE CARD'S METROPOLIS IS WRONG ON 43 OF 118 TOWNS. Card (2) prints "metropolis (1): Cemetery
    network" and (7) THE SOURCES builds its whole argument on it ("a METROPOLIS carries exactly ONE
    required row", "the pool's largest tier and its second-largest tier have ALMOST NOTHING REQUIRED IN
    COMMON"). FALSE. `assembleInstitutions.js:244` builds the metropolis catalogue as
    `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`, so a metropolis
    inherits every city row — `City walls and gates`, `Professional city watch`, `Garrison`, `City hall`,
    `Multiple courthouses`, `City granaries`, `Parish churches (10-30)`, all `required: true`. The error
    runs in the PERMISSIVE direction for the writer (it hides bodies that DO stand), so it charges no
    face; it is why v3f8's hall stands.
W-2 THE CARD'S MUSTER SEATING IS WRONG. (7) says "that leaves it to the thorp, the village and the
    metropolis". The bucket keywords are `['citizen militia','militia']`
    (defenseInstitutionBuckets.js:92-94): the thorp's `Household levy` (institutionalCatalog.js:104)
    matches neither, and no militia row exists at city or metropolis. THE MUSTER SEATS ON THE VILLAGE
    `Citizen militia` (:867) ALONE — one row, on the preimage's smallest tier. That is the ground of
    FAIL 2 and it should head the card.
W-3 THE CARD'S WATCH SEATING IS WRONG IN THE OTHER DIRECTION. (7) says the watch is "OPEN at thorp,
    village and metropolis, where any watch as a body is F1-01 / V-23". The watch bucket is
    `['town watch','city watch','professional city watch']` (:95-97) and no such row exists below town,
    so V-23 can never fire on a `[watch]`-tagged face of this pool. Harmless, and it cost the writers
    caution they did not owe.
W-4 THE CARD CONTRADICTS ITSELF ABOUT THE MARKET, AND THE CURE FELL INTO THE SEAM. (5) says market
    "OPEN ... open at thorp, village, metropolis"; (7) says "Town and city only". (5) matches the code.
    A card whose two sections disagree about where a source sits is a card that will keep producing
    FAIL 1 on every block. The (7) line should be regenerated from the same predicate as (5).
W-5 The card's (5) already carries the marker's correction that `walls` is FIXED, not open. Unchanged
    and still correct; recorded so the next instrument run does not "fix" it back.
