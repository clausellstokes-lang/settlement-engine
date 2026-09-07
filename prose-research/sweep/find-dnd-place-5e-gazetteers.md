# find: dnd / place / 5e gazetteers (Opus finder, 2026-09-06)

Angle: HOW OFFICIAL 5e WRITES A SETTLEMENT — RotF Ten-Towns, DiA Baldur's Gate Gazetteer,
CoS Vallaki/Village of Barovia, Planescape Sigil chapter, SCAG city entries.
Lawful routes only. Raw fetches via curl + local html2text (gz/*.txt), quotes grepped against the
fetched text before writing.

## ROSTER STATUS
- thealexandrian.net RotF review pt1 (45437) — FETCHED (200), substantive
- thealexandrian.net RotF review pt2 (45452) — FETCHED (200), substantive (BOXED TEXT section)
- thealexandrian.net RotF Running the Sandbox (45125) — FETCHED, thin
- thealexandrian.net Review: Descent Into Avernus (47480) — FETCHED, substantive (Gazetteer section)
- thealexandrian.net Remixing Avernus (44214) — FETCHED, thin on entry form
- thealexandrian.net Curse of Strahd tag — 404 (no CoS remix series on the site)
- Power Score RotF review — FETCHED, substantive
- Power Score RotF guide — FETCHED, run-guide not form analysis
- Sly Flourish Running Curse of Strahd — FETCHED, not structural (defers to Power Score)
- Seed of Worlds Planescape 5e review — FETCHED, substantive (Sigil ward slot order)
- Exposition Break "A Walk Through the Planes: Sigil and the Outlands" — FETCHED, substantive
- Strange Assembly SCAG review — FETCHED, substantive (POV of place descriptions)
- Tribality SCAG review — FETCHED, thin
- Writer in White SCAG review — FETCHED, substantive (per-location slots, page budgets)
- fey ancestry RotF ch.1 guide — FETCHED, substantive (alphabetised entries, minor vs major)
- dnd.galumphing.net Bryn Shander — FETCHED, actual-play narrative, NOT substantive
- elventower.com Vallaki / Village of Barovia — 403 BLOCKED (retry via wayback)
- dndbeyond.com/sources/dnd/idrotf — FETCHED but SPA shell, no text

## RAW FINDINGS (quotes verified by grep against gz/*.txt)

### Alexandrian, "Review – Icewind Dale: Rime of the Frostmaiden" (16 Nov 2020) [idr1]
- "Each town has an additional quest keyed to it" + local rumour table.
- the book's rumour table for chapter 2 is labelled "tall tales"; JA calls that confusing.
- rumour advice "radically inconsistent"; DM told to spoonfeed rumours one at a time.

### Alexandrian, RotF review part 2 (17 Nov 2020) [idr2] — BOXED TEXT section
- WotC boxed text quoted: "Frost-covered blocks of stone jut from the floor of this ten-foot-high cave of ice."
  → second person ("hisses at you"), measurement spelled out ("ten-foot-high"), opens on physical material.
- "there are too many places where the action (or inaction) of the PCs are assumed"
- "constantly telling you the height of the ceiling but absolutely nothing else"
- "the description of the room doesn't mention that they exist"

### Alexandrian, "Review: Descent Into Avernus" (23 Mar 2022) [ava]
- "About fifty pages are given over to the Baldur's Gate Gazetteer, detailing the city as it exists in 1492 DR."
- gazetteer "quite serviceable"; includes player-facing options incl. backgrounds.
- quoted DM-facing gazetteer prose: "Players should work with you, the DM, to customize these particulars to the group."
- Dark Secrets slot list: role, consequences, who knows.

### Power Score / Sean McGovern, RotF review (2 Oct 2020) [psidrev]
- "Chapter one is 99 pages long" of a 262-page adventure.
- "extra adventures stuffed in the back of some town's descriptions"
- "Quick! Who runs Bremen? How many people live in Good Mead?" → govt/population NOT front-loaded.

### fey ancestry, RotF ch.1 guide (18 Jan 2022) [fey1]
- "its parts are tiny enough and alphabetized" → towns in alphabetical order.
- "Three locations described here, and one of them mapped" (Easthaven = the main town).
- Bremen "the rest of the town lacks a bit of flavor"; Dougan's Hole "Not much here in the smallest".
- chapter said to be "80 pages" (cf. Power Score's 99) — report both, do not reconcile.

### Seed of Worlds, Planescape: Adventures in the Multiverse review (Dec 2023) [sowps]
- "46 pages on Sigil and 36 pages on the Outlands"
- per ward: "we get notes on what faction holds sway there, locations" + d8 encounter table.
- section closes with "d10 Sigil adventure hooks, d6 Faction Missions, d8 Sigil Calamities".
- Outlands minor sites: "3 pages covering 18 sites with a single paragraph each".
- Gate-towns: two-page spreads each with d4 hooks.

### Exposition Break, "A Walk Through the Planes – Sigil and the Outlands" (2023) [ebsigil]
- NPC naming form quoted from book: "Duchess Zelza Zurkbane (lawful evil succubus) and her senators"
- town trait slot with no mechanics: "Bedlam's winds infect townsfolk with a contagious spite."
  and "true for pretty much all of the special traits listed"
- minor realms: "brief blurbs, 1-2 paragraphs each, on the following"

### Strange Assembly, SCAG review (2015) [sascag]
- "Descriptions are presented from the point of view of various inhabitants of the Realms."
- "general guides to the character of a place, not an attempt at providing mechanical information"
- ch.2 ~55 pages, ~45 broad locations.

### Writer in White, SCAG review (23 Apr 2021) [wiwscag]
- "Each location is given details that include history, potential lore, city or region maps"
- "firsthand accounts from the researchers and loremasters from whose perspective the book is written"
- "has 53 pages dedicated to the city of Baldur's Gate" (DiA); Dragon Heist 24 pages on Waterdeep.

## TODO
- Power Score Curse of Strahd guide (Vallaki, Village of Barovia)
- tenfootpole / DMDavid on boxed text & town descriptions
- elventower via wayback
- D&D Beyond / wizards.com official previews & free samples
- 2024 DMG gazetteer chapter (Greyhawk) as the house-style control

## FINAL STATE (complete)
61 claims, 31 sources logged (21 substantive). Every quotation re-verified verbatim against the
locally fetched text (gz/*.txt) by script; 0 mismatches.

Added in the second half:
- D&D Beyond "Trek to Ten-Towns" (publisher-hosted, 2020) — the only true WotC prose SPECIMEN in this
  sweep: "Read or paraphrase the following to set the scene", second-person read-aloud, bolded run-in
  DM labels ("Investigating the Cart."), and the digits/words split BY REGISTER
  ("four-day journey" in read-aloud vs "4-day trip" in DM text).
- media.wizards.com CoS_DMsGuild.pdf (official) — one-word bold label + sentence, present tense,
  place name as subject.
- D&D Beyond 2024 DMG Greyhawk article (publisher) — nation entry = description + history of conflict
  + current strife.
- Dungeon Master's Workshop (2019) — boxed text with a paragraph break is "too long by half";
  Dragon Heist gives boxed text to important areas, short paraphrasable paragraphs or bullets to minor ones.
- DMDavid — CoS boxed text for EVERY location; notable NPC homes run to pages.
- RPG Musings — Rime gives "2 or 3 described locations" per town.
- Oak of Honor — 5e DMG sorts settlements by population alone; Size/Government/Commerce headings.
- Elven Tower (via Wayback raw) — Vallaki ruler named title+name+office.

NOT FOUND / BLOCKED (recorded, not missed):
- The Alexandrian has NO Curse of Strahd remix and NO Icewind Dale Remix; the CoS tag 404s.
- dndbeyond.com/sources/dnd/idrotf returns a JS shell only.
- theopentome.com is DNS-dead; its Wayback capture body is empty.
- Unlawful full-text mirrors (5e.tools, scribd, archive.org book scans) were deliberately NOT used.
