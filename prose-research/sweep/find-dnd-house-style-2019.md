# Raw notes — WotC current house style angle (fetched 2026-09-06)

Working files: `pdfs/` beside this note holds every downloaded PDF/zip and the column-aware text extractions (`*.cols.txt`, `pack_*.txt`). The JSON checkpoint is `found-dnd-house-style-2019.json`.

## Method receipts

- WebSearch budget: 4 searches ran, then the session-wide cap (200/200) was hit. Everything after that was WebFetch against URLs derived from those four result sets, from documents' own cross-references, or from site-internal search pages (which work server-side on WordPress hosts).
- PDFs were downloaded with curl and extracted with pdfplumber; the guides are two-column, so each page was cropped into halves before extraction (`*.cols.txt`). The docx/dotx files were unzipped and `word/document.xml` stripped; `docProps/core.xml` gives author/dates.
- Blocked or unreachable (not cited): dmsguild.com and drivethrurpg.com (403), scribd (landing page only), pdfcoffee (403), classicmodulestoday.com (expired cert), dnd.wizards.com/news/diversity-and-dnd (301 to dndbeyond.com home), web.archive.org (blocked by the tool), pcgamer (truncated), ign.com, polygon.com, dicebreaker.com (blocked), koboldpress.com, 411mania.com, belloflostsouls.net (403), adventurersleague.info (connection refused), slyflourish.com/writing_read_aloud_text.html (404), enworld guessed thread ID (wrong thread), dndbeyond.com/posts/759 (wrong post).

## Premise audit

The angle's framing "no published style guide" is wrong for typography/terminology: WotC's *D&D Style Guide: Writing and Editing* has been public on the DMs Guild since 2018 and in its January-2019 revision (v1.08a) since 2019-02-22. What is NOT public from WotC is any guide to the *voice* of boxed text or DM-facing prose beyond (a) the Perkins/Bilsland two-page Adventure Design Guide and (b) the Adventurers League adventure-format document's boxed-text rule. So "no published prose-voice guide" holds; "no published style guide" does not.

## Finding 1 — three generations of the house style guide, and the one in force is newer than the public PDF

| Version | Where | Dictionary | Singular they | "dwarf man" | New sections |
|---|---|---|---|---|---|
| v1.04a ©2013 | adventurersleague.files.wordpress.com (2018 upload) | MW Collegiate 11th | banned outside dialogue | banned ("female dwarf") | — |
| v1.08a ©2018, "updated January 2019" | cyborgsandmages.wordpress.com (2019-11 upload); DMs Guild bundle | MW Collegiate 11th | allowed, "don't abuse this liberty" | banned ("male dwarf") | Gender-Specific Suffixes, Headings, Sidebars, Bulleted Lists, Appendix References, Adventuring Parties |
| docx, created Kim Mohan 2016-03-07, last modified Judy Bauer (WotC) 2021-07-06 | inside `dungeoncraft-pack-2023-12dec04.zip` on media.dndbeyond.com | merriam-webster.com | allowed freely with clear antecedent; new Pronoun Preference section (they/them for sapient creatures in descriptive text, "it" in rules text, "it" for beasts/aberrations; named canon characters keep canonical pronouns) | **reversed — "dwarf man" / "gnome woman" fine** | Alphabetical Organization, Pronoun Preference, Attack vs. Attack Roll, "Within X Feet", "Statistics" vs "Stat Block", Creature type capitalized; word-list additions (aasimar, blood red, cyclopes, gold/golden, insectile, parlay/parley, tabaxi, tenant/tenet) |

Heading-presence check (grep counts across the three texts) confirms the table. Note the 2021 docx still lowercases "hit points" in examples while the 2024 Free Rules glossary capitalizes "Hit Points", "Long Rest", conditions and actions — so even the 2021 internal guide predates 2024 house style. The D&D Beyond forum question of 2025-06-13 ("is there an update… for 2024 / Chicago 18th?") went unanswered.

## Finding 2 — what v1.08a actually prescribes (prose-relevant)

Foundation Chicago 17th + MW 11th; rules apply to every product type. Tone: high fantasy, LotR/GoT plausibility test ("ring wraiths aren't used for gags"), party over lone hero. Gender: neutral wording when gender unknown/irrelevant; second person in rules; singular they allowed but rationed; no "he/she", no alternating; "man/woman" humans-only (breakable in dialogue/first person); no gendered suffixes; "god" for any deity. Headings: strict hierarchy, structural not aesthetic; inline subhead in bold italics ending with a period; bold is the only emphasis. Sidebars must be position-independent. American spelling; serial comma; negative contractions encouraged; "non-elf" hyphenated, "nonhuman" closed; "100 gp treasure" unhyphenated. Possessives per Chicago 17. Foreign/invented words italic when used as words. Lists introduced by a full sentence + colon. Numbers: spell out 0–100 in prose; numerals for game quantities and tactical distances; narrative distances spelled out ("fifty miles"). Percent as a word; d100. Cross-refs judicious; appendices lettered; page references avoided. Thoughts/telepathy typography free. "On" a plane, "in Elysium". Game-term typography: capitalize abilities/actions/features/feats/skills/languages/planes/traits; italicize spells/magic items/artifacts; bold stat-block names at first appearance, nothing between number and name. Verb collocations fixed (cast a spell, take damage, make a saving throw, finish a rest, score a critical hit). "Succeed on" not "make" a check; "save" sparingly; "result"=total; "magic item" never "magical item"; no "points of damage"; "an extra 1d4 fire damage"; proficient in/with; DM is a noun; no weeks/months in rules ("7 days"); "human"≠"mortal"; "humanoid" is a type. Word list (dwarves, mithral, staffs, war band…). FR terms: Goodman/Goodwoman capped, goodsir lowercase, godsforsaken (Realms; not required elsewhere), "the Realms" after "the Forgotten Realms". Adventuring Parties: avoid "fellowship"; prefer party/group/band/company because parties are "fractious or more mercenary".

## Finding 3 — the bundle's other documents

- **Adventure Design Guide** (Perkins & Bilsland, 2 pp; 2018 and 2019 copies byte-identical): ten principles — PCs are the heroes; a *credible threat*; clichés with a spin; *the here and now* (less history the better); player decisions matter (no railroading); logical order for a first-time DM; concision "to ease the burden on the DM" with descriptive texture reserved for NPCs (features, mannerisms, quirks), dungeon dressing, treasure; appeal to all player types; rise above the humdrum; good maps. Organized-play addendum: published monsters/items; PH/MM/DMG authoritative; no preset ending. Still cites Chicago **16th** (the style guide cites 17th). Points to the "Adventure Format Template" for format — that is where the boxed-text rule lives.
- **Forgotten Realms Style Guide** (29 pp): tone hopeful (vs cynical Greyhawk, tragic Dragonlance); "replace your divots"; "Don't Whitewash the Realms"; gender roles equal (orc and Northlander exceptions); keep it PG; loose in-world time diction ("mid morning", "nigh sunset", "bells"); tenday days "first day…"; banned words (a.m., p.m., coffee→kaeth, money→coin, restaurant→feasting hall, week→tenday, hourglass→sandglass, o'clock→bells, hill/mountain/high elf→Realms subraces); "godsforsaken (replaces Godforsaken)"; "goodsir"; Common as a trade pidgin; stock phrases ("Well met", "Until swords part").
- **D&D IP Guide** (13 pp): "Stay experiential" — don't explain the IP through exposition; monsters are mostly for killing "and their stuff is for taking"; PH/MM/DMG authoritative for lore.
- **DnD Standards** (©2020, in the 2023 pack): no profanity; mostly G-rated, sliding to PG; PG-13 only with approval (Rick & Morty); no stereotypes; villains' evil called out; no real-world religion analogs for evil faiths; avoid tokenism.

## Finding 4 — where boxed text is prescribed today (Adventurers League)

- **DC Adventure Format v1.3.docx** (Claire Hoffman, Nov 2023): "Boxed text should be used very sparingly—only when a particularly important event truly calls for it. Don't use it to describe rooms or normalcy… no more than one or two brief and descriptive sentences… should only provide a narrative for exciting events." Sample boxed text = two sentences + a one-line spoken tag. Background keywords CAPITALIZED and BOLDED at first appearance; backstory restraint; overview entries of one to two sentences per part; NPC block = paragraph + single-sentence "What They Want" + single-sentence "NPC Snapshot" retitled to an epithet ("Stoic Guardian"); Area Information with inline subheads (Dimensions and Terrain, Lighting…); bold for keyed objects, "judiciously"; sidebars avoid directly applicable info except Playing the Pillars (Combat/Exploration/Social); CONTENT WARNING line; Sensitivity Lead credit; Chicago 17 + MW 11.
- **1 - D&D AL Template.dotx** (created by Jeremy Crawford 2019-09-30): "This Boxed Text style is used only for text that a DM is meant to read to the players." Epigraph without quotation marks; sidebar test; "Styles only!"
- **Dungeoncraft v1.9c** (May 2025, updated 2025-06-23): must use the template; "You should be familiar with the D&D Style Guide (also provided)"; no DM-vs-player competition. The same style-guide clause is in the 2021 Witchlight v1.2 and 2023 CCv1.4 guides. The Dungeoncraft guide itself has no boxed-text rules; those are in the format docx.

## Finding 5 — designer and community voices

- Crawford 2018-12-21: style guide permits singular they, "careful about avoiding the common pitfalls" (antecedent ambiguity). DMs Guild 2019-02-22: update adds "tips on achieving gender neutral language".
- Crawford 2016-11-17 poll: "boxed text (aka read-aloud text)".
- April 2019 thread: Mike Shea — "Brevity is critically important", keep living creatures out of boxed text; Greg Marks (AL admin) — boxed text beyond "a paragraph or so" is a fault; Merwin — most DMs "WANT boxed text"; Haeck — "immensely useful". Merwin Nov 2021: boxed text as prompts; "excellent boxed text does a lot of heavy lifting".
- The Alexandrian 2022-08-01: freeze-frame and remote-control pitfalls; "actionable chunks". Comment (mellonbread 2022-08-02): recalls a lost WotC dev blog saying boxed text "should never be longer than three sentences" — unverifiable, source gone.
- EN World 2018-11-25: bundle contents; readers note WotC's own hardcovers use "week"; Sigil reserved.

## Finding 6 — June 2020 statement and the Strahd / Tomb revisions

- Original WotC URL now redirects to the D&D Beyond home; archive.org unreachable from this tool. Best available: Gizmodo/io9 2020-06-18 report (sensitivity readers; reprint review; Romani consultant for Vistani; Tomb of Annihilation named; orc/drow re-examination; quote "That's just not right, and it's not something we believe in."). Wikipedia (Tomb of Annihilation) quotes the statement: "we changed text that was racially insensitive" in recent reprints of ToA and CoS.
- Curse of Strahd Revamped (Gizmodo 2020-07-27, Julie Muncy): Winninger — text only; art/tarokka unchanged; free to prior D&D Beyond owners; revisions removed "uncivilized"/heavy-drinker framing and an ableist portrayal; curses/Evil Eye abilities remained — "surgical changes". Wikipedia (CoS) cites PC Gamer: "a revised depiction of the Vistani".
- NOT found: the specific Tomb of Annihilation wording changes, or Winninger's own posts. Deferred — see ledger.

## Open-questions ledger

- **Unverified:** the "three sentences" WotC dev-blog rule (single hearsay comment, source lost). The exact ToA text diffs (no reachable source). Whether WotC's internal guide has moved again since 2021-07 (the 2024 glossary suggests yes; no document found).
- **Single-sourced:** the June 2020 statement text (Gizmodo report + Wikipedia quotation; the primary page is gone from the live web and archive.org was blocked).
- **Not read because blocked:** DMs Guild product page (its "not required to publish" line is known only from a search snippet and is therefore not claimed).
- **Deliberately not covered:** Paizo/third-party style guides; the 2024 DMG's own advice on writing read-aloud text (not fetched — D&D Beyond source pages beyond the free glossary need a login).
- **Stopping rule:** search budget exhausted after 4 rounds; fetch rounds continued until two consecutive rounds (Sage Advice posts; Dicebreaker/BoLS/Wikipedia-Winninger) added nothing new about prose features.
