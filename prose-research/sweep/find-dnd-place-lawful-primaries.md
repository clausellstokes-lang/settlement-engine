# find — d&d place, lawful primaries (Opus finder, 2026-09-07)

complete: False
coverage: in progress after 13 sources

## sources read (14)
- [own-words] Settlement Tracker (2024 Dungeon Master's Guide handout) — https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf (route: direct PDF fetch from media.dndbeyond.com, pdftotext; substantive: True)
- [own-words] Death House (Curse of Strahd introductory adventure, free PDF) — https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf (route: direct PDF fetch from media.wizards.com, pdftotext; substantive: True)
- [vendor] What's New in the 2024 Dungeon Master's Guide? (Mike Bernier, D&D Beyond) — https://www.dndbeyond.com/posts/1825-whats-new-in-the-2024-dungeon-masters-guide (route: curl with browser user agent; substantive: True)
- [vendor] Updates in the Dungeon Master's Guide (2024) (DND Staff, D&D Beyond) — https://www.dndbeyond.com/posts/1916-updates-in-the-dungeon-masters-guide-2024 (route: curl with browser user agent; substantive: True)
- [own-words] Encounter of the Week: Snowed In (D&D Beyond) — https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in (route: curl with browser user agent; substantive: True)
- [own-words] Encounter of the Week: Battle of the Braggarts (D&D Beyond) — https://www.dndbeyond.com/posts/723-encounter-of-the-week-battle-of-the-braggarts (route: curl with browser user agent; substantive: True)
- [own-words] Encounter of the Week: Trek to Ten-Towns (D&D Beyond) — https://www.dndbeyond.com/posts/855-encounter-of-the-week-trek-to-ten-towns (route: curl with browser user agent; substantive: True)
- [measurement] System Reference Document 5.2.1 (Wizards of the Coast, CC-BY-4.0) — https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf (route: direct PDF fetch, pdftotext, grep; substantive: True)
- [measurement] System Reference Document 5.1 (Wizards of the Coast, OGL) — https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf (route: direct PDF fetch, pdftotext, grep; substantive: True)
- [reception] The DM's Toolbox in the D&D 2024 Dungeon Master's Guide is filled with fireball fungus and total party kills (Randy, Gaming Nexus) — https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills (route: curl with browser user agent; substantive: True)
- [analysis] Gems of the D&D Dungeon Master's Guide (Mike Shea, Sly Flourish) — https://slyflourish.com/gems_of_the_dmg.html (route: curl with browser user agent; substantive: True)
- [own-words] Adventurers League Dungeon Master's Guide v4 (Wizards of the Coast) — https://media.wizards.com/2016/dnd/ALDMGv4_print.pdf (route: direct PDF fetch, pdftotext — organized-play rules only, no prose or description guidance; substantive: False)
- [vendor] Lost Mine of Phandelver on D&D Beyond (Phandalin entry) — https://www.dndbeyond.com/sources/dnd/lmop/phandalin (route: BLOCKED — redirects to /claim/source/lost-mine-of-phandelver, body text not served; substantive: False)
- [vendor] D&D Free Rules (2024) on D&D Beyond — https://www.dndbeyond.com/sources/dnd/free-rules (route: curl; redirects to /sources/dnd/br-2024 — player-facing sections only, DM chapters require sign-in; substantive: True)

## claims (39)
1. (place and institution description | own-words | asserts) Wizards of the Coast's own 2024 settlement handout bands settlement size by population, with a village at up to 500 people.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "VILLAGE (POP. UP TO 500)" [Settlement Tracker, size checkbox row]
2. (place and institution description | own-words | asserts) The same 2024 handout sets the town band at a population of 501 to 5,000.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "TOWN (POP. 501–5,000)" [Settlement Tracker, size checkbox row]
3. (place and institution description | own-words | asserts) The same 2024 handout sets the city band at a population of 5,001 or more.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "CITY (POP. 5,001+)" [Settlement Tracker, size checkbox row]
4. (place and institution description | own-words | asserts) The publisher's settlement slot list opens with a slot labelled Defining Trait.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "DEFINING TRAIT" [Settlement Tracker, first field]
5. (place and institution description | own-words | asserts) The publisher's settlement slot list carries a slot labelled Claim to Fame.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "CLAIM TO FAME" [Settlement Tracker, second field]
6. (place and institution description | own-words | asserts) The publisher's settlement slot list carries a slot labelled Current Calamity.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "CURRENT CALAMITY" [Settlement Tracker, third field]
7. (place and institution description | own-words | asserts) The publisher's settlement slot list carries a single leadership slot labelled Local Leader.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "LOCAL LEADER" [Settlement Tracker, fourth field]
8. (place and institution description | own-words | asserts) The publisher's settlement handout keeps a list slot for the settlement's noteworthy places, separate from its people.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "NOTEWORTHY PLACES" [Settlement Tracker, right-hand list column]
9. (place and institution description | own-words | asserts) The only economic figure the publisher's settlement handout asks a DM to record is the gp value of the most expensive item for sale.
   src: Wizards of the Coast, Settlement Tracker handout, 2024 Dungeon Master's Guide
   url: https://media.dndbeyond.com/compendium-images/free-rules/dmg/settlement-tracker.pdf
   quote: "GP VALUE OF THE MOST EXPENSIVE ITEM FOR SALE" [Settlement Tracker, footer field]
10. (boxed text form | own-words | applies) In its free Death House adventure Wizards of the Coast introduces read-aloud text with a bare instruction to read, placed after the DM-facing sentence that positions the party.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "Once they reach the village, read:" [Death House, 'Rose and Thorn']
11. (boxed text form | own-words | applies) The Death House read-aloud paragraph opens a settlement with a road, the village, and a simile drawn from its own building stock rather than with any statistic.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "The gravel road leads to a village, its tall houses dark as" [Death House, arrival read-aloud]
12. (concrete sensory noun | own-words | applies) The Death House arrival read-aloud names the village's buildings as solemn dwellings before naming any person.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "Nestled among these solemn dwellings" [Death House, arrival read-aloud]
13. (naming and forms of address | own-words | applies) Death House names a building by the name the locals give it rather than by an owner or address.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "Death House is the name given to an old row house" [Death House, 'History']
14. (dm-facing sentence | own-words | applies) The DM-facing history section of Death House states the townsfolk's behaviour toward the building as a present-tense civic fact.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "Locals give the building a wide berth" [Death House, 'History']
15. (naming and forms of address | own-words | applies) Death House gives a child character a formal given name and a bracketed short form, and states the relationship and age in the same clause.
   src: Wizards of the Coast, Death House (Curse of Strahd introductory adventure), 2016
   url: https://media.wizards.com/2016/downloads/DND/Curse%20of%20Strahd%20Introductory%20Adventure.pdf
   quote: "her seven-year-old brother, Thornboldt" [Death House, 'Rose and Thorn']
16. (place and institution description | vendor | asserts) D&D Beyond's own launch article says the 2024 Dungeon Master's Guide's handouts serve as a template for building settlements.
   src: Mike Bernier, 'What's New in the 2024 Dungeon Master's Guide?', D&D Beyond, 12 Nov 2024
   url: https://www.dndbeyond.com/posts/1825-whats-new-in-the-2024-dungeon-masters-guide
   quote: "creating NPCs and building settlements" ['Adventures, Handouts, and Ready-to-Play Maps']
17. (edition and house style | vendor | asserts) Wizards of the Coast states that the 2024 Dungeon Master's Guide replaces all rules in the 2014 version of the book.
   src: DND Staff, 'Updates in the Dungeon Master's Guide (2024)', D&D Beyond, 20 Feb 2025
   url: https://www.dndbeyond.com/posts/1916-updates-in-the-dungeon-masters-guide-2024
   quote: "it replaces all rules in the 2014 version of the book" ['Using This Book with Older Books']
18. (edition and house style | vendor | asserts) In the publisher's own chapter list the 2024 Dungeon Master's Guide puts campaign-setting creation in chapter 5, not in the adventure-environment chapter the 2014 book used.
   src: DND Staff, 'Updates in the Dungeon Master's Guide (2024)', D&D Beyond, 20 Feb 2025
   url: https://www.dndbeyond.com/posts/1916-updates-in-the-dungeon-masters-guide-2024
   quote: "explores how to create a campaign and campaign setting" ['Updated Structure and Information', Chapter 5]
19. (place and institution description | own-words | applies) An official free D&D Beyond encounter opens a settlement entry with the settlement's name, a population figure, and its people's trade, in one sentence.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "Icehaven is a village of 5,000 souls" ['The Village of Icehaven']
20. (terminology consistency | own-words | disputes) The same official column calls Icehaven a village while giving it a population of 5,000, a figure the publisher's own 2024 settlement handout places in the town band.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "Icehaven is a village of 5,000 souls" ['The Village of Icehaven']
21. (naming and forms of address | own-words | applies) The same column names a settlement's leader as office title plus given name plus surname, in that order.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "The leader of the village, Starosta Ernath Noack" ['Arrival of the Infected One']
22. (boxed text form | own-words | asserts) The official column cues its read-aloud with an instruction that licenses paraphrase rather than verbatim reading.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "read or paraphrase the following" ['Investigation Encounter: Snowed In']
23. (concrete sensory noun | own-words | applies) The arrival read-aloud describes the village through its housing stock and street pattern rather than through its inhabitants.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "mostly made up of steep-roofed cottages, separated by twisting streets" ['Investigation Encounter: Snowed In', read-aloud]
24. (place and institution description | own-words | applies) The column then lists the settlement's important locations by name and numbers them as labelled sub-entries.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "The following areas in Icehaven are important to this encounter" ['Investigation Encounter: Snowed In']
25. (place and institution description | own-words | applies) The column expresses a settlement's market depth as a gp threshold above which a specialty shop must be searched for, the same economic handle the 2024 settlement handout records.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Snowed In', 2020
   url: https://www.dndbeyond.com/posts/732-encounter-of-the-week-snowed-in
   quote: "an item that costs more than 100 gp" ['1. The Haven']
26. (naming and forms of address | own-words | applies) A second official column names a governing officer as an invented office title plus given name plus surname, followed by the plain English office in apposition.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Battle of the Braggarts', 2020
   url: https://www.dndbeyond.com/posts/723-encounter-of-the-week-battle-of-the-braggarts
   quote: "Taskhand Durth Mirimm, the current governor" ['The Wastes of Xhorhas and the City of Jigow']
27. (terminology consistency | own-words | asserts) The same column qualifies its own size label, calling Jigow a small city by population while describing its extent as a sprawl of towns.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Battle of the Braggarts', 2020
   url: https://www.dndbeyond.com/posts/723-encounter-of-the-week-battle-of-the-braggarts
   quote: "Jigow is a small city by population, but its sprawl of towns" ['The Wastes of Xhorhas and the City of Jigow']
28. (boxed text form | own-words | applies) The same column ties each read-aloud to the precise moment and threshold at which it is spoken.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Battle of the Braggarts', 2020
   url: https://www.dndbeyond.com/posts/723-encounter-of-the-week-battle-of-the-braggarts
   quote: "Read or paraphrase the following as the characters enter the Wartpimple Tavern" ['Social Encounter: Battle of the Braggarts']
29. (dm-facing sentence | own-words | asserts) An official D&D Beyond column states that describing travel in an interesting and engaging way is hard to do.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Trek to Ten-Towns', 2020
   url: https://www.dndbeyond.com/posts/855-encounter-of-the-week-trek-to-ten-towns
   quote: "Describing travel in an interesting and engaging way is hard to do" ['Trek to Ten-Towns']
30. (plainness and economy | own-words | asserts) The same column advises compressing an unremarkable stretch into a single sentence rather than accumulating uninspired description.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Trek to Ten-Towns', 2020
   url: https://www.dndbeyond.com/posts/855-encounter-of-the-week-trek-to-ten-towns
   quote: "better to simply describe the day’s travel in a single sentence" ['Trek to Ten-Towns']
31. (boxed text form | own-words | asserts) The same column tells the DM to vary the wording of a repeated transition so the read-aloud does not sound scripted.
   src: Wizards of the Coast / D&D Beyond, 'Encounter of the Week: Trek to Ten-Towns', 2020
   url: https://www.dndbeyond.com/posts/855-encounter-of-the-week-trek-to-ten-towns
   quote: "so it doesn't seem like you're reading from a script" ['Trek to Ten-Towns']
32. (place and institution description | reception | asserts) A reporter covering the publisher's own preview says Settlements is one of the alphabetically arranged topics in the 2024 Dungeon Master's Guide's DM's Toolbox chapter.
   src: Randy, Gaming Nexus, reporting a Wizards of the Coast preview interview with Chris Perkins and Todd Kenreck, 10 Oct 2024
   url: https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills
   quote: "The topics are so varied that they've resorted to an alphabetical presentation" [opening section]
33. (place and institution description | reception | asserts) The same report says the 2024 settlement generator's first roll produces the town's defining feature, giving a Sprawling Cemetery in the demonstration.
   src: Randy, Gaming Nexus, reporting a Wizards of the Coast preview with Chris Perkins, 10 Oct 2024
   url: https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills
   quote: "the town's defining feature is [roll the dice] a Sprawling Cemetery" [settlement demonstration paragraph]
34. (place and institution description | reception | asserts) The same report gives the current-calamity roll's demonstration result as monsters infesting the settlement.
   src: Randy, Gaming Nexus, reporting a Wizards of the Coast preview with Chris Perkins, 10 Oct 2024
   url: https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills
   quote: "What current calamity is befalling the town: Monsters infest the settlement" [settlement demonstration paragraph]
35. (place and institution description | reception | asserts) The same report shows the leadership roll returning a political condition rather than a person, an illegitimate leader causing civil unrest.
   src: Randy, Gaming Nexus, reporting a Wizards of the Coast preview with Chris Perkins, 10 Oct 2024
   url: https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills
   quote: "Local leaders: An illegitimate leader causing civil unrest" [settlement demonstration paragraph]
36. (place and institution description | reception | asserts) The same report says the 2024 settlement tables are rolled live, with a designer building a random settlement on the spot.
   src: Randy, Gaming Nexus, reporting a Wizards of the Coast preview with Chris Perkins, 10 Oct 2024
   url: https://www.gamingnexus.com/News/65236/The-DMs-Toolbox-in-the-DD-2024-Dungeon-Masters-Guide-is-filled-with-fireball-fungus-and-total-party-kills
   quote: "Chris Perkins builds a random settlement while he's just sitting there" [settlement demonstration paragraph]
37. (edition and house style | analysis | disputes) A long-standing D&D usability critic judges the 2014 Dungeon Master's Guide's organization not the best way to parse the job of being a dungeon master.
   src: Mike Shea (Sly Flourish), 'Gems of the D&D Dungeon Master's Guide', 1 Mar 2021
   url: https://slyflourish.com/gems_of_the_dmg.html
   quote: "the best way to parse the job of being a dungeon master" ['How to Read the Dungeon Master's Guide']
38. (civic record register | measurement | asserts) The freely licensed System Reference Document 5.2.1 contains no settlement-description rules: its four occurrences of settlement are all inside spell and equipment text.
   src: Wizards of the Coast, System Reference Document 5.2.1 (CC-BY-4.0), 2025
   url: https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf
   quote: "" [whole document; grep over extracted text]
39. (boxed text form | measurement | asserts) Neither freely licensed SRD, 5.1 nor 5.2.1, mentions read-aloud or boxed text anywhere, so no lawful open-licence source carries the form.
   src: Wizards of the Coast, System Reference Document 5.1 (2016) and 5.2.1 (2025)
   url: https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf
   quote: "" [whole documents; grep over extracted text]
