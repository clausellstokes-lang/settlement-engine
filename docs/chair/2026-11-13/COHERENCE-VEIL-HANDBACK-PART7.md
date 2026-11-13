# COHERENCE-VEIL — hand-back, part 7: the sixth seat (the second homes, the public prose, 211's helpers)

Seat: COHERENCE-VEIL-6, lane `lane/coherence-veil-2026-11-11`, from **333b33973** (read back from origin before any
work: equal). Migration 211 is a FILE, applied nowhere: every database here was an in-process pglite or a scratch
native PostgreSQL 16.15 cluster on this machine (`/var/tmp/cv6`, UTF8, trust auth, unix socket only, no TCP). No
hosted database, no production credential, no `supabase db push`, no `migration repair`, no deploy, no golden's door.

**TIP:** the commit carrying the latest copy of this file, read back from origin.

**THE NEXT STEP, IF THIS SEAT IS CUT OFF:** items 1-3 are pushed; the final attack (both shapes), planted run and sentence search on the final 211; then the chair's two added items, V5-3 and V5-4 (§4), each its own commit, red first.

## 0. Status

| Item | State | Commit |
|---|---|---|
| 1. The ten second homes (V5-1) | BUILT, pushed; the attack and sentence search at item 1 running | the commit carrying this line |
| 2. The public prose from the stripped record (V5-2) | DONE, pushed | the commit carrying this line |
| 3. 211's helpers, an early-applied copy (V5-7) | DONE, pushed | 7466ea783 |
| V5-3 (the chair's ruling) | DONE, pushed | da844761a |
| V5-4 (the chair's ruling) | DONE, pushed | the commit carrying this line |

## 1. Item 1 — the ten second homes

### 1.1 The review's run reproduced at the base (333b33973)

`planted.probe.jsx` (the review's, unchanged, from `lane/review-veil-3-2026-11-12` at 4700d33eb), 2 seeds × six sizes ×
calm/infiltrated, two shards a side, master's shape on `203 + 211` and `001..211`, the new shape on `001..211`, every
chain built by the review's `native/chain.sh` from the base's migrations. `planted-summary.mjs` over my four shards is
**byte-identical** to the review's `out/planted-master.txt` and `out/planted-tip.txt` (`diff` empty, both): 24 towns
a shape; 4,447 / 7,537 markers; 96 shares; 23,368 / 34,540 rows hidden by hand; 0 births threw; 0 reads raised.
(`veil-probe-6/out/planted-{master,tip}-base.txt`.) The review's attack, new shape, at the base (`attack.probe.jsx`,
RV5_POWERS=1, four shards): 12 towns, 912 shares, 3,648 reads, 75,652 hand hides, 280,152 tokens, 0 leaks, 0 raised:
the review's figures. `secondhome2.mjs` with SENTENCES=1 over its clones: **byte-identical** to the review's
`out/secondhome-tip-sentences.txt` (`veil-probe-6/out/secondhome2-tip-sentences-base.txt`).

### 1.2 The cure (one rule set, two twins)

`src/domain/display/gallerySecondHomes.js` (new; called by `galleryVeil.js :: applyVeil`, which is at its 800-line
cap) and migration 211's section 4b (`_gallery_veil_pieces`, `_gallery_veil_embeds`, `_gallery_veil_names`,
`_gallery_veil_sources`, `_gallery_veil_tie_pieces`, `_gallery_veil_second_homes`) with the impression arm of
`_gallery_veil_card`; the down file drops the six new helpers by signature (46 helpers, none callable by `anon` or
`authenticated`: section 7's loop). **No helper of today's 211 changed its signature.** The sources are read from the
projection BEFORE the eyes run, by the same eye test the applier uses (a card's own eye, or its class switch less the
card's exception):

| Second home | Withheld when | How |
|---|---|---|
| `prominentRelationship.full` / `.tension` | the source tie's description / tension eye is shut. The source tie: the same `npc1Name`, `npc2Name`, `typeName` as the copy's `npc1`, `npc2`, `type`, OR the same description / tension text (so a renamed end still finds it: fail-closed) | the key leaves the copy |
| `prominentRelationship.phrasing` | it embeds a piece of a shut string of its source tie | withheld whole |
| `pressureSentence` | it embeds a piece of any tie's shut description or tension (the sentence names no source) | withheld whole |
| `history.siegeNarrative` | it embeds a piece of a current tension's shut description | withheld whole |
| `defenseProfile.institutions.<slot>[]` (any slot) | the house of that name has its description / function eye shut; or the house is hidden whole | `desc`, `description` / `tags`, `facets`, `serviceKeys` leave the copy; the entry leaves the list |
| `economicState.activeChains[]` | a house hidden whole | its name leaves `processingInstitutions` and `dependency` goes when it names it; a chain whose `label` is the name, or whose processing list held only hidden houses, is withheld whole (its `chainId` prints as the name: `EconomicsTab.jsx:686`, `humanizeToken(c.chainId)`) |
| `simulationTrace[]` (Reveal-DM reads) | a house hidden whole | each cause and each effect whose strings name it leaves its list; an entry naming it anywhere else is withheld whole |
| `<person>.presentation.impression` | the card's own appearance eye is shut and the impression embeds a piece of its `physical` | the impression leaves the face (the rest of `presentation` stays) |

A PIECE of a hidden value is each string leaf, trimmed, and each run of it between `.`, `!`, `?` and `—`, of 12 code
points or more (both twins split and count alike: JavaScript's `split(/[.!?—]+/)` and code-point length; SQL's
`regexp_split_to_table` on the same class and `char_length`). No sentence is recomposed and no prose is new. The page
draws plainly without each: every reader of the withheld keys guards absence (`OverviewTab.jsx:242-246, 518`,
`SummaryTab.jsx:224, 369`, `QuickInspector.jsx:69`, `DefenseTab.jsx:342-343`, the chain readers iterate what is left);
and the guard below builds the page (`gallery.fetchPublicDossier`) over every share it stores.

### 1.3 The guard that stays (red first)

`tests/security/gallerySecondHomes.pglite.test.js`, three arms on a pglite chain of every migration on disk: (1) the
review's planted-marker method in the repository: a marker on every string a user can hide by hand, through the
generator's own `onStep`, three towns (city and hamlet infiltrated, a metropolis), each in BOTH stored shapes (master's
taken back through both migration steps: memberships as affiliations and `linkedFactionIds`, a house as its name, ties
in `npc1Id/npc2Id` with no `id`), every eye shut by hand, DM reveal off and on, live and frozen; the WHOLE row of each
of the four reads searched as text for a marker and for the name of every house hidden whole; the page built over each
share; (2) THE GUARD IS LIVE: a second home the test plants itself (a hidden house's marked description copied to
`economicState.secondHomePlantedByTheGuard`) is found 16 of 16 reads; (3) the same-step class the marker cannot reach:
the three composed homes of a tie, the pressure sentence and the impression written from marked sources, both shapes.
Its header states the two limits.

| | arm 1 | arm 2 (the planted home found) | arm 3 |
|---|---|---|---|
| at the base 333b33973 (the test file alone added) | **RED, 744 sends** | 16 of 16 found (`guard-live-arm-at-base.txt`: the arm alone at the base, 1 passed) | **RED, 784 sends** |
| at item 1 | green | green, 16 of 16 | green |

The base's 744, by class, are the review's rows 6 to 9 in both shapes (`veil-probe-6/out/guard-red-at-base.txt`): the
defence copies' descriptions (seven slots), the siege narrative, a hidden house in the chains' label and processing
lists and in the trace's causes and effects.

### 1.4 The review's instruments at item 1

| Instrument | Base | Item 1 |
|---|---|---|
| `planted.probe.jsx`, master's shape, `203 + 211` and `001..211`, DM off and on, live and frozen | the review's 17 rows a chain (`planted-master-base.txt`) | **0 markers, 0 house names** (`planted-master-item1.txt`): 24 towns, 4,447 markers, 96 shares, 768 reads, 0 raised |
| the same, the new shape, `001..211` | the review's rows (`planted-tip-base.txt`) | **0, 0** (`planted-tip-item1.txt`): 24 towns, 7,537 markers, 96 shares, 384 reads, 0 raised |

**The attack at item 1, the new shape** (`attack.probe.jsx`, RV5_POWERS=1, the reference my own client): 12 towns,
912 shares, 3,648 reads, 75,652 hand hides, 285,988 tokens the reference removed (280,152 at the base: the client now
withholds the second homes too); **0 token leaks, 0 `EXTRA`, 0 raised, 0 `pageShowMore`, its `secondHome` list empty**
(at the base it listed the defence copies in every read); `MISSING` exactly the base's four rows (`decrees` and
`dmLayer` on Reveal-DM reads, the two retired names the review salts onto new cards: the review's own classes);
`postFreeze` on the link 279 (by 208's design, as the review). (`attack-tip-{base,item1}-summary.txt`.)

### 1.6 THE SENTENCE SEARCH FOUND AN ELEVENTH HOME: a chain names a hidden house by the engine's processor match

`secondhome2.mjs` SENTENCES=1 over the item-1 clones (`secondhome2-tip-sentences-item1.txt`): **every one of the
review's ten rows reads 0.** Nine lines remain; I traced each:

| Line | What it is | Class |
|---|---|---|
| `npc.ties(institution)` at `activeChains[].label` and `.processingInstitutions[]`: "Black market" (Oxteitza) | the town's house is **"Black market bazaar"**, hidden whole; the chain names it **"Black market"**, the name the engine's processor match gives it (`computeActiveChains.js :: institutionMatchesProcessor`, id-first over `fuzzyProcessorMatch`, the pattern's first twelve characters). The review's name search looks for the card's own name, so it could not see it; the person's tie (`family: "Black market"`) is how the sentence search did | **A REAL SECOND HOME. Cured below** |
| the same at `.processingInstitutions[]`, "Merchant guilds (3-8)" and the like | a person's tie key equal to the name of a house left OPEN, which the chain names | open at its source |
| `institution.function(tags)` at `activeChains[].chainId`, "fortification"; `npc.goals(goal)` at `.chainId` / `.upstreamChains[]`, "animal_husbandry", "warehouse_logistics" | the same token in two vocabularies: a catalog tag, or a goal's intent key that targets a chain, equal to an open chain's id | open at its source |
| `tension.description` at `economicViability.issues[].description` / `.message` and the tension's own `specificIssue` (Kallipolis) | the tension's description is COMPOSED FROM the viability issue (`historyGenerator.js:442-452`: the issue's text is `specificIssue`, and the description is a lead plus it): the issue is the source and it is open; hiding the tension hides the copy, not the source | open at its source |
| `npc.physical` embedded at `presentation.impression` (Pratopolis) | the impression "Unremarkable clothes, a quiet voice and eyes that never stop moving." holds the words of ANOTHER person's appearance, a shared phrase of two pools; the card's own `physical` holds nothing of it | a coincidence of two pools |

So at item 1 the review's two instruments read zero on the ten rows; the residue is eight lines open at their source
or a coincidence, which no withholding can make zero without taking what is open, plus one real home, now cured.

**How often a hidden house feeds a chain under another name** (`processor-names.probe.jsx` over 300 births, the
engine's own matcher, `processor-names-300-births.json`): two forms only, "Black market" <= "Black market bazaar"
(24) and "Thieves' guild (powerful)" <= "Thieves' guild chapter" (24).

**The cure, both twins** (`gallerySecondHomes.js`; 211's `_gallery_veil_hidden_name` and `_gallery_veil_second_homes`):
a processing name that a house hidden whole answers to (its own name, or the engine's rule: the lower-cased name
holds the pattern's first twelve characters) **and no house left open answers to** is that house's name: it leaves
the processing list; the dependency naming it goes; a chain left with no processor is withheld whole (as before); the
trace's causes and effects holding it go. A name an open house also answers to stays (nothing open is taken). The
label rule is unchanged: a chain whose label IS the name of a house hidden whole is withheld whole, even where an
open house also processes it, because its id prints that name (`EconomicsTab.jsx:686`). **MY RULING, for the chair's
veto:** where the hidden name and an open chain's own label are the same words, the hidden name wins; the cost is
that chain's row.

**Red first, the guard widened**: two towns that carry the alias (`cv6-proc-metropolis-infiltrated-0`, the bazaar;
`cv6-proc-city-infiltrated-2`, the chapter) join the guard, and its oracle is the ENGINE's matcher, not mine: a
processing name only hidden houses answer to, by `institutionMatchesProcessor`, is searched for as text like a
hidden house's name. At 1a017fb51: **RED** in both shapes on every read (`guard-red-processor-names.txt`, 48
lines; the older guard town `rv5-plant-city-infiltrated-0` carries the chapter too). After the cure: **3 of 3**.
The lane's pins after it (`pins-after-processor-names.txt`): **10 files, 207 of 207** (galleryServerVeil 16,
galleryVeilCures 30, gallerySecondHomes 3, publicPayloadVeilTotality 28, allegianceVeil 8, playerRecordVeiledFace
4, lib/gallery 50, lib/partyLinkClient 7, display/publicSafe 56, publicProseVeilInvariance 5). Gates: strict 0
(1,113), ratchet 0 (167), eslint 0. The item-3 rehearsal re-run on this file: every comparison 0, 47 helpers, none
callable (`rehearse-item3.txt`).

### 1.5 The lane's pins at item 1

`galleryServerVeil.pglite`, `galleryVeilCures.pglite`, `playerRecordVeiledFace`, `publicPayloadVeilTotality`,
`allegianceVeil.pglite`, `lib/gallery`, `domain/display/publicSafe`, `lib/partyLinkClient`: **8 files, 198 of 198
passed**, exit 0 (the parity fuzz of 400 documents, the V4 class pin of 60 old-shape towns, the V5 composition pin and
the rollback pin among them). The gates on the touched files: `typecheck:domain:strict` 0 (1,113, ceiling 1,113),
`typecheck:ratchet` 0 (167, ceiling 167), eslint 0, each through `scripts/gate-tail.sh`.

## 2. Item 2 — the public prose is composed from the stripped record (V5-2)

**The cause.** `composePublicProse` (src/components/new/publicProseCompose.js) drew every site from the OWNER's
record and handed the stripped record (`publicVeiledRecordOf`, seed and all) only to the three audience-gated readers.
The text ships to every reader of every share, so in a town with a hidden power the succession line (`power:desk`)
and the conflict lines (`general:overview`) were composed from what no reader may see.

**The cure** (one line of behaviour): every site draws from `ctx.veiledRecord`, the record after the strip, whenever
it exists (that is, for every compose but a caller's `publicDossier: true`, which ships every site SILENT). The
owner's own view reads the record live and is untouched.

**Red first, the lane's invariance pin widened** (`tests/components/publicProseVeilInvariance.test.js`): a new arm
births every infiltrated village and town of the review's own seeds 0 to 24 (50 towns, the review's probe's dials),
asserts `composePublicProse(owner)` deep-equals `composePublicProse(stripped owner)` on every block, and on the
review's town `rv5-r3-village-infiltrated-3` asserts by text that the shipped succession line is the stripped
record's and never "the heavier of the two". At item 1: **RED**, 8 site mismatches in 7 towns, among them the review's
two towns (`invariance-red-item2.txt`); at item 2: **5 of 5** (the 132-town arm and the new one).

**The review's own instrument** (`r3.probe.jsx`): at item 1, 200 towns, 47 with a hidden power, **7 divergent**
(`r3-item1-200.json`); at item 2, the review's full 800 towns, 188 with a hidden power, **0 divergent**
(`r3-item2-800.json`; the review's count at the base: 25).

Every other test that calls the composer at item 2 (dossierPhoneFloorAllViews, defenseRingNoteProjection,
publicProseVeilOnce, publicProseEquality, generalDeskTabFlow, publicProseAdoption, saves.smoke, entityIndex,
domain/publicProse, publicCrisisHookLabel, people6InstitutionFaceLinks): **11 files, 564 of 564**. Gates: strict 0
(1,113), ratchet 0 (167), eslint 0.

**Stored towns.** The deployed client (master) writes no `publicProse`, so no stored town carries an owner-composed
stamp; a town the new client saves is stamped by this composer. Nothing stored needs re-stamping.

## 3. Item 3 — an early-applied copy of today's 211 (V5-7)

**Measured first: no helper of today's 211 changed its signature.** Item 1 added six helpers and changed the bodies
of `_gallery_veil_card` and `_gallery_veil_apply`; every one of the forty early-deployed signatures is created again,
so nothing is left behind, and this file needs no drop. The chair's message of 17:20 UTC says the owner will apply
today's 211 (sha256 `eface6d0…`, the file at 333b33973) alone: this path is now certain.

**Rehearsed on local chains only** (`veil-probe-6/native/rehearse.sh`, the review's `chain.sh` and `catalog.sql`;
203 built from master's own migrations, which equal the lane's 001..203 byte for byte; each file in one transaction,
as the owner's `begin; … commit;`) (`out/rehearse-item3.txt`):

| | lines that differ |
|---|---|
| (a) 203 + today's 211 + this 211, against 203 + this 211 alone | **0** (control, today's 211 against this one: 10) |
| (b) 203 + this 211, then this 211 again over itself | **0**; 001..211 then this 211 again: **0** |
| (c) from 203 + today's 211 + this 211: this down file, then 203's `get_unlisted_dossier` (the review's §7.6), against 203 | **0** |
| (c) the same from 203 + this 211 alone | **0** |
| (d) 001..211, then this down file, against a chain at 210 | **0**; the down file again: 0; this 211 again, against 001..211: 0 (control 210 against 211: 56) |
| (e) the release after the early deploy: 203 + today's 211 + 204..210 + this 211, against 001..211 in order | **0** |
| (f) after the early deploy and this 211: helpers / callable by `anon` or `authenticated` | **47 / 0** (the owner's check of §7.4 now expects `47 | 0`, not `40 | 0`; re-run after §1.6's cure, controls 11 and 57) |

**A pin so a later seat cannot leave one behind** (`galleryVeilCures.pglite.test.js`, "V5-7: …"): the forty
signatures today's 211 creates are frozen in the test; each must be created again by the chain's 211 or dropped by it
by signature, and the down file must drop all forty and every helper the chain creates. Red first on a planted fault
(the early helper `_gallery_veil_jslen(text)` given a second parameter, its down line moved to the new signature, no
drop): **1 failed**, naming `_gallery_veil_jslen(text)` (`v57-pin-red-planted.txt`); on this tree **1 passed**.

## 4. The chair's two added items (message of 17:20 UTC, copied in §9)

### 4.1 V5-3: the custom-content records leave every read that is not the owner's

**The cause** (the review's §1.4): the client's full mode drops `customContentRoster` and `customContentProvenance`
(no page shows them), but on a Reveal-DM share the gallery read and the import sent both (an importer saved them);
the link and the map never did (the sanitiser's allowlist).

**The cure:** in 211, both names join `decrees` and `dmLayer` in the strip of the Reveal-DM projection on the gallery
read and the import (`_gallery_dm_full_json` itself, 121/129, is untouched; no helper added). The client's comment
that called the server half "not landed and owner-gated" now names its twin.

**Red first** (`galleryVeilCures`, "V5-3"): a Reveal-DM share, unmarked, marked, every grouping opened, frozen, and
narrated; the gallery read, link, import, map and page. At 8ca7d8c6d: **RED**: gallery, import AND THE PAGE carried
both on every served share (a served page is not projected again) (`v53-pin-red.txt`); after: **1 passed**, every
read false. **The review's own rows, natively** (`hand/fullmode.sql` on clones of three chains,
`v53-fullmode-native.txt`): at `203 + 211 (today's)` and at item 1, the gallery read and import of `rv5full-marked` and
`rv5full-unmarked` send `customContentProvenance customContentRoster` and seven other keys; after V5-3 they send the
same seven and neither record. The seven (`inst_dmNotes inst_notes mapEdits migrationReports npc_dmNotes npc_notes
tabNotes`) are kept by the client's full mode too (the owner's Reveal-DM opt-in), so no page hides them: not V5-3,
named here for the chair.

### 4.2 V5-4: a person hidden by the per-person switch is never sent in a roster copy, old share or new

**The cause** (the review's §1.5): master's generator embeds each person's whole card in the power's roster
(`factions[].members[]`, `powerStructure.factions[].members[]`). On a DM-full projection the 093 splice reduced a
person with `revealDm: false` in `npcs[]` only; a MARKED share's veil then reached the copies, but an UNMARKED one
(exported before 2026-10-30, served as before) sent the copy whole, and both clients' pages drew it.

**The cure, both twins:** after the member splice, each roster copy of a person the share does not reveal (the very
predicate of the splice: `revealDm`, and on the import `allowImport` too) becomes the same public card as the
person's own `npcs[]` entry; only where the projection is DM-full (`gallery_share_dm` / the client's `full`). 211:
`_gallery_veil_member_revealed`, `_gallery_veil_roster_members`, `_gallery_veil_roster_splice`, called by
`_gallery_apply_member_overrides` (its signature unchanged; the down file drops the three, 50 helpers in all); the
client: `publicSafe.js :: toPublicSafe`. A revealed person's copy stays; a default projection's copies are the
sanitiser's already; nothing else moves.

**Red first** (`galleryVeilCures`, "V5-4"): the review's own document (Ada switched off, Bo shown, each in both
rosters), unmarked and marked, Reveal DM on: at da844761a **RED**: Ada's roster copy was her whole card, secret and
goal (`v54-pin-red.txt`); after: Ada's secret and goal in no read (gallery, link, import, map, page), Bo's secret in
the gallery read, the import and the page as before, Ada's two roster copies deep-equal to her own entry, and the
unmarked gallery response otherwise deep-equal to 210's. **The review's own rows natively** (`hand/roster.sql`,
`v54-roster-native.txt`):

| `rv5roster-unmarked` | 203 + today's 211 | item 1 | V5-4 |
|---|---|---|---|
| gallery read: Ada's secret / goal / Bo's secret | sent / sent / sent | sent / sent / sent | **not / not** / sent |
| import: Ada's secret / goal | sent / sent | sent / sent | **not / not** |
| `rv5roster-marked`, every read | not sent | not sent | not sent |

**Nothing else an old share serves changes, on born towns in the DEPLOYED client's shape** (`v54corpus.probe.jsx`,
master's own generator, `v54-corpus-master-shape.json`): 12 towns (village to metropolis), unmarked Reveal-DM shares
with every third person switched off (59 people), the gallery read, link and import at item 1 against V5-4: **0
differences** but the 236 roster copies of switched-off people, each equal to the person's own public card; the link
unchanged. (A switched-off person's secret sentence still appears 40 times in those responses: each is the same pool
sentence as the OPEN secret of another, revealed person, at that person's own card: a coincidence of the pool.)

The lane's pins after V5-4 (`pins-after-v54.txt`): **12 files, 235 of 235** (galleryVeilCures 32 with the V5-3, V5-4
and V5-7 arms; galleryServerVeil 16; gallerySecondHomes 3; publicPayloadVeilTotality 28; allegianceVeil 8;
playerRecordVeiledFace 4; livingContentRosterPublicDrop 7; lib/gallery 50; importScrub 19; partyLinkClient 7;
display/publicSafe 56; publicProseVeilInvariance 5). Gates: strict 0 (1,113), ratchet 0 (167), eslint 0.

## 9. This brief's rulings, copied in (the chair, session_01FE9mEws7PXYRYdjQPbSX15, 2026-11-13)

> THE LAW (the owner's, record 331): what a user hides by hand is never sent, by any of the four reads (the gallery
> page, the party link, the map page, the import), in either stored shape; what is not hidden is sent as before.

> 1. THE TEN SECOND HOMES (the review's V5-1, section 2.1). Reproduce the review's planted-marker run at your base
> first: it must find what the review found. Then each second home is WITHHELD BY THE EYE THAT GOVERNS ITS SOURCE, in
> migration 211 AND in the client's veil, in both stored shapes, on all four reads: a tie's description and tension
> under prominentRelationship (full, tension, phrasing) and inside pressureSentence; a current tension inside
> history.siegeNarrative; a house's description and its copies in the defence profile's seven lists; the name of a
> house hidden whole in the economy's chains (the processing houses and the label) and in the simulation trace on
> Reveal-DM shares; a sentence of a person's appearance inside the card's impression. What withheld means: the reader
> receives nothing of the hidden string. A composed sentence that embeds a hidden string is withheld whole, or composed
> again from the stripped record where a composer for it already exists; never a sentence with a hole in it, and no new
> prose. A list loses the hidden name and nothing else. The page must still render plainly without what was withheld.
> Nothing that is open is taken: prove it with the review's own check that the lane takes nothing open.
> ACCEPTANCE: the review's planted-marker run and its sentence search (secondhome2 with SENTENCES=1) read ZERO at your
> tip, in both shapes, with the DM reveal off and on, live and frozen. AND A GUARD THAT STAYS IN THE REPOSITORY: a test
> that plants a marker of its own in every string a user can hide by hand, through the generator's own step hook as
> the review's probe does, shuts every eye, and searches the WHOLE payload of each of the four reads as text. It must
> be red at your base and red on a planted new second home of your own, and it says in its header the two limits the
> review names (a marker cannot ride a boolean or a number; a field derived in the same step as its source needs the
> sentence search).

> 2. THE PUBLIC PROSE IS COMPOSED FROM THE STRIPPED RECORD (the review's V5-2): in 25 of 188 towns with a hidden power
> the text every reader gets differs from the text the stripped record gives. For every read that is not the owner's,
> the prose is composed from what that reader may see. Red first on the review's own town
> (rv5-r3-village-infiltrated-3) and class; the lane's invariance pin widened to hold the class.

> 3. IF 211's HELPERS CHANGE THEIR SIGNATURES (the review's V5-7): the new file drops what an early-applied copy of
> today's 211 would leave behind. Rehearse on LOCAL chains only: a chain at 203, then today's 211 (the file at
> 333b33973), then yours, equals a chain at 203 with yours alone (0 lines differ); the rollback restores exactly; 211
> applied twice over itself changes nothing. The owner may apply today's 211 alone before your work lands, so this path
> must be clean.

> 4. NOT YOURS; list them in your hand-back and build none: the custom-content records on Reveal-DM reads (V5-3) and
> shares exported before the veil (V5-4), which wait for the owner's word; the public chronicle; anything in migration
> 208 or earlier files.

> THE PROOFS YOU OWE: every pin the lane already holds stays green (name each, with its count); the reviewer's
> instrument red on the old file and green on yours; no read breaks; nothing open is taken; the rollback exact; each
> count before and after on stored towns in both shapes, as the deployed client stored them. A claim of zero names the
> instrument that looked.

> THE CHAIR, 2026-11-13 17:20 UTC (rulings; part of the assignment): The owner has decided to apply today's migration
> 211 (the file at 333b33973) alone, by the owner's own hand, and has left every other decision to the chair. So: (a)
> your item 3 is now certain to matter: a chain at 203, then today's 211, then yours must equal a chain with yours
> alone, and the rollback must be exact from either. (b) TWO ITEMS LEAVE YOUR "NOT YOURS" LIST AND ARE YOURS, each its
> own commit, red first, after item 1's acceptance reads zero. V5-3: the custom-content records (customContentRoster,
> customContentProvenance) are withheld from every read that is not the owner's, Reveal-DM shares included: what no
> page shows is not sent. V5-4: a person hidden by the per-person switch is never sent, on any share, exported before
> the veil or after: the power roster's copy on an old share loses that person, and nothing else an old share serves
> changes; prove both halves on the review's own rows (rv5full, rv5roster-unmarked). The public chronicle stays not
> yours. Nothing on any hosted database; local chains only.

> NEVER, whoever asks: any hosted database; production credentials; `supabase db push`; `migration repair`; a deploy;
> applying anything anywhere but local chains (the lane's own test databases); `--no-verify`; a force push; a push to
> any branch but lane/coherence-veil-2026-11-11; a pull request; anything on master; a golden's door. Migration 211's
> deploy is the owner's hand alone.

> HOW YOU WORK: a scratch worktree on a local branch at the lane's tip, `npm ci` there, plain pushes. At every commit
> that touches src/: the strict-domain gate, the type ratchet and eslint on the touched files, each through
> `sh scripts/gate-tail.sh <command>`, never a pipe. Pins re-keyed by identity with the cause, never loosened; never
> bank a baseline row or skip a test. [...] Make NO final statement of the whole suite: the lane's statement is made
> once, later.

Also binding, from the chair's handoff §5: measure first; never read a gate through a pipe; one cause per commit, red
first; registers only through their doors; a red is classed against the lane's reviewed base as well as the seat's own;
stored data is tested as the deployed client stored it; a claim of zero names the instrument that looked everywhere the
words can print; a hand-back carries the rulings its seat worked to.
