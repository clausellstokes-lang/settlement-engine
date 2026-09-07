# Finder notes: D&D, angle "the editorial staff in their own words" (Opus finder, 2026-09-06)

Working dir for raw text: `sweep/staff/` (fetch.sh, *.txt, data.py, verify.py, save.py).

## Roster status (the angle's named sources)
- Kim Mohan: no interview at the primary found; the D&D podcast episode (June 2013) has no transcript online. FETCHED instead: Sivaranjan's contemporaneous blog post quoting two Mohan lines; Stan!'s 2025 tribute (worked with him ten years); MOPOP's 2025 Hall of Fame page (newspaper background). The claim that Mohan wrote a 2021 style-guide docx is NOT confirmed by anything fetched; the two released style guides carry NO byline at all (v1.04a ©2013, v1.08a ©2018) and Mohan retired from WotC in 2013.
- Michele Carter: no own-words source found yet; she is named by Vallese as the other primary Planescape editor.
- Scott Fitzgerald Gray: insaneangel.com pages are credits lists (not substantive); the Mastering Dungeons episode is audio with no transcript.
- Christopher Perkins: FETCHED at the primary - the collected 2011 "Dungeon Master Experience" columns (107pp) via the Wayback id_ capture of wizards.com. Rich on description economy, NPC brevity, arriving in a town, names.
- Ray Vallese (TSR Planescape editor): FETCHED, Exposition Break 2022 interview, own words on the line's voice and on what an RPG editor does.
- Ray Winninger (Dungeoncraft author, later WotC D&D executive producer): FETCHED, John H. Kim's collected PDF of all 29 Dragon columns.
- Dragon writers' guidelines, DMs Guild Style Guide / Guide to Publishing PDFs, AL Season 8 template: PENDING.
- Jeremy Crawford / Chris Sims on the "D&D voice": PENDING.

## Notes
- The two style-guide PDFs are the staff's law in their own words; extracted text has hard line breaks, so quotations were chosen inside a single extracted line where possible.
- Perkins column titles for the quotes: "T'wit" (description economy), "Lies My DM Told Me" (rumours on arrival in a settlement), "What's in a Name?" (naming).
- Winninger's settlement material: Dragon 257 "Home Base" (city bureaucrats: Master of the Docks, Dean of Colleges, constabulary; stronghold and feudal town templates) and Dragon 261 "The Rumor Mill" (the inn/marketplace/library as gossip source; two good NPCs minimum).

## Final state (2026-09-06, complete)
95 claims, 23 sources (18 substantive). All 94 non-empty quotations were pre-verified by script against the fetched text with whitespace and curly-quote normalisation (`staff/verify.py`); 0 mismatches, none over twelve words. One claim carries an empty quote by design (the negative finding that neither released style guide has a byline).

### The four finds the section did not have
1. **The DUNGEON writers' guidelines at the primary** (paizo.com/writersguidelines/dungeon_writer_guidelines.pdf, "By the DUNGEON Staff"). The second-person policy in the staff's own words ("does not make any reference to the viewer"; avoid "you see", "as you enter the room"), the boxed-text length cap ("should only rarely run more than a few sentences", long ones become handouts), no creatures in read-aloud, "the area is not an encounter" if nothing to say, and Appendix 1's **THIRTY QUESTIONS ABOUT YOUR CITY** - the publisher-side slot list the section's Rule 39 has been missing, opening at "Who rules the city?" and closing with the only capitalised question, "WHY DO ADVENTURERS COME TO YOUR CITY?", with "What does the city smell like?" at 24. Measured figures: a city article 8,000-10,000 words, up to five stat blocks, background <=500 words or 5%, a single encounter averaging 500 words, sidebars <=300 words, author bio 25 words.
2. **The Dragon writers' guidelines**: "we will not publish an article written in the first person"; an opening vignette capped at 200 words; a full page of Dragon is about 750 words.
3. **Who wrote what, and when it moved**: neither released style guide carries any byline (v1.04a is (c)2013 on Chicago 16th; v1.08a is (c)2018 on Chicago 17th; the DMs Guild page dates the update to January 2019 and says following the guides is NOT required to publish there). The adventure design guide in the same package is bylined "By Chris Perkins & Greg Bilsland" and still points writers at Chicago 16th. Waterdeep: Dragon Heist (2018) credits Carter, Gray and Mohan as editors under Crawford as managing editor - Mohan was still editing D&D hardcovers five years after retiring from staff. Nothing found supports a 2021 Mohan docx; the section should treat that attribution as unsourced.
4. **The line-editor's register testimony**: Vallese on Planescape's "wry, overly clever voice that smirked"; Vallese on the norm ("communicating the basic info and less on dazzling the audience") and the Planescape exception; Perkins in 1999 that a core AD&D product "does not embrace the narrative style of most PLANESCAPE products" and that "The cant is mostly absent"; Winter that "the language needs to be direct and clear" and that flowery phrases are to be avoided; Sims cutting weasel words "without mercy", refusing superlatives, and calling absolutist statements "editorial nightmares" because they corner later creation - the sharpest argument in the corpus for a dossier that never says always.

### Also worth the section's notice
- Winninger's Dungeoncraft (Dragon 255-283, John H. Kim's collection): the First Rule ("Never force yourself to create more than you must"), the Second Rule (every filled-in piece of the world gets at least one secret), the home base's rumour mill, two good NPCs beating four mediocre ones, and a city bureaucracy of named functions (Master of the Docks, Dean of Colleges).
- Perkins 2011 in his own voice: "I keep my descriptions spare", "I don't frontload information", one distinguishing characteristic per NPC, and on arriving somewhere new, "I pepper them with local rumors-some true, some false" with "When in doubt, tell the players things that are true."
- Abadia documents the Season 8 template's actual rule (headings replacing boxed text) and its failure: a door's description split across "Dimensions & Terrain" and "Door", so "The information is spread out."

### Open for the next round
Kim Mohan in his own words (the June 2013 D&D podcast audio; his Dragon editorials, which need Internet Archive full-text search of the magazine); Michele Carter in her own words (nothing found anywhere); Jeremy Crawford on the D&D voice; the AL Season 8 template document itself; the TSR-era Dungeon guidelines (Google Groups 429 - try a Wayback capture of the newsgroup post or Dragonsfoot mirrors).
