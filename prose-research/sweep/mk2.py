import json
d=json.load(open("found-dnd-place-5e-gazetteers.json"))
S=d["sourcesRead"]; C=d["claims"]

DBTREK="https://www.dndbeyond.com/posts/855-encounter-of-the-week-trek-to-ten-towns"
COSPDF="https://media.wizards.com/2016/downloads/DND/CoS_DMsGuild.pdf"
DBGH="https://www.dndbeyond.com/posts/1834-greyhawk-returns-in-the-2024-dungeon-masters-guide"
DMSW="https://dmsworkshop.com/2019/09/27/dm-101-boxed-text-mastering/"
DMDB="https://dmdavid.com/tag/picturing-the-dungeon-boxed-text/"
DMDC="https://dmdavid.com/tag/tag/curse-of-strahd/"
PSCOS="http://thecampaign20xx.blogspot.com/2016/03/dungeons-dragons-guide-to-curse-of.html"
EVREV="https://eventyrgames.com/2020/09/17/review-icewind-dale-rime-of-the-frostmaiden/"
RPGM="https://rpgmusings.com/2020/11/why-how-to-use-legacy-of-the-crystal-shard-in-your-frostmaiden-game/"
OAK="https://www.oakofhonor.com/index.php/2020/10/14/settlements-critique-of-the-dmg-guidelines/"
ETV="https://www.elventower.com/chapter-5-the-town-of-vallaki/"
ENB="https://www.enworld.org/threads/boxed-texts.673236/"
DHREV="https://thealexandrian.net/wordpress/41114/roleplaying-games/review-waterdeep-dragon-heist"
SLYID="https://slyflourish.com/frostmaiden_chapter_1.html"
EV4="https://eventyrgames.com/2020/12/21/running-rime-of-the-frostmaiden-4/"
OT="https://www.theopentome.com/2021/09/24/rime-of-the-frostmaiden-welcome-to-bryn-shander/"
GAL2="https://dnd.galumphing.net/rime-of-the-frostmaiden/bryn-shander-1/"

S += [
 dict(title="Encounter of the Week: Trek to Ten-Towns (D&D Beyond, publisher-hosted)",url=DBTREK,kind="own-words",substantive=True,date="2020-07",route="curl browser-UA, raw HTML"),
 dict(title="Ravenloft & the Dungeon Masters Guild (Wizards of the Coast, official PDF)",url=COSPDF,kind="own-words",substantive=True,date="2016",route="curl binary PDF + pypdf text extraction"),
 dict(title="Greyhawk Returns in the 2024 Dungeon Master's Guide (John Roy, D&D Beyond)",url=DBGH,kind="vendor",substantive=True,date="2024",route="curl browser-UA, raw HTML"),
 dict(title="Dungeon Mastering 101: Mastering the Boxed Text (Dungeon Master's Workshop)",url=DMSW,kind="analysis",substantive=True,date="2019-09-27",route="curl browser-UA, raw HTML"),
 dict(title="Picturing the dungeon – boxed text (David Hartlage, DMDavid)",url=DMDB,kind="analysis",substantive=True,date="2016",route="curl browser-UA, raw HTML"),
 dict(title="How much description should a dungeon key include? (David Hartlage, DMDavid, Curse of Strahd tag page)",url=DMDC,kind="analysis",substantive=True,date="2018-2020",route="curl browser-UA, raw HTML (tag archive page)"),
 dict(title="A Guide to Curse of Strahd (Sean McGovern, Power Score)",url=PSCOS,kind="analysis",substantive=True,date="2016-03",route="curl browser-UA, raw HTML"),
 dict(title="Review – Icewind Dale: Rime of the Frostmaiden (Eventyr Games)",url=EVREV,kind="reception",substantive=True,date="2020-09-17",route="curl browser-UA, raw HTML"),
 dict(title="Why & How to Use Legacy of the Crystal Shard in Your Frostmaiden Game (RPG Musings)",url=RPGM,kind="analysis",substantive=True,date="2020-11",route="curl browser-UA, raw HTML"),
 dict(title="Settlements: critique of the DMG guidelines (Oak of Honor Games)",url=OAK,kind="analysis",substantive=True,date="2020-10-14",route="curl browser-UA, raw HTML"),
 dict(title="Chapter 5 – The Town of Vallaki (Elven Tower)",url=ETV,kind="analysis",substantive=True,date="n.d. (capture 2026-04-18)",route="live URL 403; Wayback raw capture web.archive.org/web/20260418221915id_/"),
 dict(title="Boxed texts (EN World forum thread)",url=ENB,kind="reader",substantive=False,date="2021",route="curl browser-UA, raw HTML"),
 dict(title="Review – Waterdeep: Dragon Heist (Justin Alexander, The Alexandrian)",url=DHREV,kind="analysis",substantive=False,date="2018",route="curl browser-UA, raw HTML"),
 dict(title="Running Icewind Dale: Rime of the Frostmaiden Chapter 1 (Mike Shea, Sly Flourish)",url=SLYID,kind="analysis",substantive=False,date="2021-07-12",route="curl browser-UA, raw HTML"),
 dict(title="Running Rime of the Frostmaiden – Part 4: Northern Ten-Towns (Eventyr Games)",url=EV4,kind="analysis",substantive=False,date="2020-12-21",route="curl browser-UA, raw HTML"),
 dict(title="Rime of the Frostmaiden: Welcome to Bryn Shander (The Open Tome)",url=OT,kind="analysis",substantive=False,date="2021-09-24",route="live URL DNS failure; Wayback capture returned an empty body — NOT READ"),
]

def c(**k): C.append(k)

c(feature="boxed text form",
  claim="A D&D Beyond encounter published by Wizards of the Coast introduces each read-aloud passage with a standing instruction to read or paraphrase it.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="Read or paraphrase the following to set the scene", page="Trek to Ten-Towns, travel section", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dm-page", confidence="high")
c(feature="boxed text form",
  claim="The read-aloud passages in that publisher-hosted encounter are written in the second person present tense.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="Just past midday, you come across a smashed cart", page="First Day: Following the Tracks", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="high")
c(feature="boxed text form",
  claim="That encounter's read-aloud passage for the first day's find runs to two sentences.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="Just past midday, you come across a smashed cart", page="First Day: Following the Tracks", kind="measurement",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="high")
c(feature="dm-facing sentence",
  claim="The DM-facing paragraphs of that publisher-hosted encounter each open with a bolded run-in label naming the thing described.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="Investigating the Cart. This cart is a simple wooden carriage", page="First Day: Following the Tracks", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dm-page", confidence="high")
c(feature="other: digits versus words by register",
  claim="In that encounter the same span of days is spelled out in words inside the read-aloud text.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="you have a four-day journey ahead of you", page="departure read-aloud", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="other: digits versus words by register",
  claim="In that same encounter the span of days is given as a numeral in the DM-facing text.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="making this a 4-day trip at best", page="Trek to Ten-Towns, travel section", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dm-page", confidence="high")
c(feature="plainness and economy",
  claim="Wizards' own encounter advises describing an unremarkable day of travel in a single sentence.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="better to simply describe the day", page="Trek to Ten-Towns, travel section", kind="own-words",
  polarity="asserts", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dm-page", confidence="high")
c(feature="opening sentence",
  claim="That publisher-hosted article opens its description of Bryn Shander by placing the settlement in rank among its neighbours.",
  source="James Haeck / D&D Beyond, Encounter of the Week: Trek to Ten-Towns, publisher-hosted, 2020",
  url=DBTREK, quote="the largest of the ten settlements that make up Ten-Towns", page="The Third Delivery", kind="own-words",
  polarity="applies", date="2020-07", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="edition and house style",
  claim="Wizards' own Ravenloft creator guidance states each tone of the setting as a one-word bold label followed by a sentence about the place.",
  source="Wizards of the Coast, Ravenloft & the Dungeon Masters Guild (official PDF), 2016",
  url=COSPDF, quote="Mystery. Barovia is mysterious, and adventurers should feel as", page="section Tone", kind="own-words",
  polarity="applies", date="2016", routeHint="curl the binary PDF from media.wizards.com, then pypdf text extraction",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="That official Ravenloft guidance describes the domain in the present tense with the place name as grammatical subject.",
  source="Wizards of the Coast, Ravenloft & the Dungeon Masters Guild (official PDF), 2016",
  url=COSPDF, quote="Horror. Barovia is infused by evil", page="section Tone", kind="own-words",
  polarity="applies", date="2016", routeHint="curl the binary PDF from media.wizards.com, then pypdf text extraction",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="A publisher-hosted article says the 2024 Dungeon Master's Guide gazetteer gives each nation its history of conflict and its current strife.",
  source="John Roy, D&D Beyond (publisher-hosted), Greyhawk Returns in the 2024 Dungeon Master's Guide, 2024",
  url=DBGH, quote="along with their history of conflict and what strife they", page="section on the Greyhawk Gazetteer", kind="vendor",
  polarity="asserts", date="2024", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="boxed text form",
  claim="Dungeon Master's Workshop advises that a boxed text containing a paragraph break is usually already twice as long as it should be.",
  source="Dungeon Master's Workshop, Dungeon Mastering 101: Mastering the Boxed Text, 27 Sep 2019",
  url=DMSW, quote="rare that a boxed text that includes a paragraph break", page="section Using Boxed Text Your Way", kind="analysis",
  polarity="asserts", date="2019-09-27", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="high")
c(feature="boxed text form",
  claim="Dungeon Master's Workshop distinguishes boxed text written third-person objective from second-person subjective and advises DMs to shift between them.",
  source="Dungeon Master's Workshop, Dungeon Mastering 101: Mastering the Boxed Text, 27 Sep 2019",
  url=DMSW, quote="shifting text from third-person objective", page="section Using Boxed Text Your Way", kind="analysis",
  polarity="asserts", date="2019-09-27", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="Dungeon Master's Workshop reports that in Waterdeep: Dragon Heist the important areas get boxed text while minor areas are handled in other formats.",
  source="Dungeon Master's Workshop, Dungeon Mastering 101: Mastering the Boxed Text, 27 Sep 2019",
  url=DMSW, quote="most important areas in the adventure are given the boxed", page="section on boxed text's limitations", kind="analysis",
  polarity="asserts", date="2019-09-27", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Dungeon Master's Workshop reports that a minor Dragon Heist location, a bookstore, gets a short paragraph written to be paraphrased.",
  source="Dungeon Master's Workshop, Dungeon Mastering 101: Mastering the Boxed Text, 27 Sep 2019",
  url=DMSW, quote="A bookstore receives a short paragraph description that is written", page="section on boxed text's limitations", kind="analysis",
  polarity="asserts", date="2019-09-27", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Dungeon Master's Workshop reports that a great hall in a Dragon Heist noble villa is described in bullet points rather than prose.",
  source="Dungeon Master's Workshop, Dungeon Mastering 101: Mastering the Boxed Text, 27 Sep 2019",
  url=DMSW, quote="multiple bullet points describing the furnishings, the sounds, and the", page="section on boxed text's limitations", kind="analysis",
  polarity="asserts", date="2019-09-27", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="withheld information and inference",
  claim="DMDavid reports that a tournament boxed text placed the load-bearing detail among less important ones without marking it.",
  source="David Hartlage, DMDavid, Picturing the dungeon – boxed text, 2016",
  url=DMDB, quote="the text mentioned the runes alongside other, less important details", page="section Boxed text", kind="analysis",
  polarity="asserts", date="2016", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="boxed text form",
  claim="DMDavid states that Curse of Strahd supplies boxed text for every one of its locations.",
  source="David Hartlage, DMDavid, How much description should a dungeon key include?",
  url=DMDC, quote="Curse of Strahd includes it for every location", page="section on boxed text", kind="analysis",
  polarity="disputes (names it as excessive)", date="2018-2020", routeHint="curl with browser UA on the DMDavid Curse of Strahd tag archive page",
  registerHint="dossier-archivist", confidence="medium")
c(feature="place and institution description",
  claim="DMDavid states that Curse of Strahd gives detailed description to every location in the adventure.",
  source="David Hartlage, DMDavid, How much description should a dungeon key include?",
  url=DMDC, quote="The Curse of Strahd adventure lavishes detail on every location", page="section Matching description to a location's purpose", kind="analysis",
  polarity="disputes", date="2018-2020", routeHint="curl with browser UA on the DMDavid Curse of Strahd tag archive page",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="DMDavid reports that in Curse of Strahd the houses of notable NPCs run to pages of room-by-room description.",
  source="David Hartlage, DMDavid, How much description should a dungeon key include?",
  url=DMDC, quote="The homes of notable NPCs get pages of room descriptions", page="section Matching description to a location's purpose", kind="analysis",
  polarity="disputes", date="2018-2020", routeHint="curl with browser UA on the DMDavid Curse of Strahd tag archive page",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="DMDavid measures one Vallaki NPC's entry as a page-long workroom description inside a five-page mansion description.",
  source="David Hartlage, DMDavid, How much description should a dungeon key include?",
  url=DMDC, quote="buried in the page-long description of his workroom", page="section Matching description to a location's purpose", kind="measurement",
  polarity="disputes", date="2018-2020", routeHint="curl with browser UA on the DMDavid Curse of Strahd tag archive page",
  registerHint="dossier-archivist", confidence="high")
c(feature="boxed text form",
  claim="Power Score's Curse of Strahd guide records that the Village of Barovia chapter opens with flavour text to be read aloud on the party's arrival.",
  source="Sean McGovern, Power Score, A Guide to Curse of Strahd, Mar 2016",
  url=PSCOS, quote="Read the flavor text out loud", page="Chapter 3: The Village of Barovia, When the Heroes Arrive", kind="analysis",
  polarity="asserts", date="2016-03", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Eventyr Games gives more than 150 pages as the space Rime of the Frostmaiden spends describing the ten towns and its wilderness locations.",
  source="Eventyr Games, Review – Icewind Dale: Rime of the Frostmaiden, 17 Sep 2020",
  url=EVREV, quote="Spread over more than 150 pages, we get a full", page="section Setting", kind="measurement",
  polarity="asserts", date="2020-09-17", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="high")
c(feature="place and institution description",
  claim="Eventyr Games reports that nearly every location in Rime of the Frostmaiden carries a quest or event attached to it.",
  source="Eventyr Games, Review – Icewind Dale: Rime of the Frostmaiden, 17 Sep 2020",
  url=EVREV, quote="every location has a meaningful quest or event attached", page="section Setting", kind="analysis",
  polarity="asserts", date="2020-09-17", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dm-page", confidence="high")
c(feature="sentence length variation",
  claim="Eventyr Games criticises parts of Rime of the Frostmaiden for long meandering paragraphs that cannot be used at the table.",
  source="Eventyr Games, Review – Icewind Dale: Rime of the Frostmaiden, 17 Sep 2020",
  url=EVREV, quote="long, meandering, and poorly-structured paragraphs of text", page="section Accessibility", kind="reception",
  polarity="rejects", date="2020-09-17", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="RPG Musings counts two or three described locations per town in Rime of the Frostmaiden.",
  source="RPG Musings, Why & How to Use Legacy of the Crystal Shard in Your Frostmaiden Game, Nov 2020",
  url=RPGM, quote="each town only gets 2 or 3 described locations", page="section Ten-Towns Businesses & NPCs", kind="measurement",
  polarity="asserts", date="2020-11", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="RPG Musings reports that in the 2013 Legacy of the Crystal Shard campaign guide each town write-up carries at least one new NPC per location.",
  source="RPG Musings, Why & How to Use Legacy of the Crystal Shard in Your Frostmaiden Game, Nov 2020",
  url=RPGM, quote="each town write-up comes with at least one new NPC", page="section on Legacy of the Crystal Shard NPCs", kind="analysis",
  polarity="asserts", date="2020-11 (describing the 2013 D&D Next product)", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="RPG Musings measures two of the minor Bryn Shander locations in Legacy of the Crystal Shard at two to three sentences each.",
  source="RPG Musings, Why & How to Use Legacy of the Crystal Shard in Your Frostmaiden Game, Nov 2020",
  url=RPGM, quote="the Armory and Council Hall in Bryn Shander get 2-3", page="section Ten-Towns Businesses & NPCs", kind="measurement",
  polarity="asserts", date="2020-11 (describing the 2013 D&D Next product)", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Oak of Honor Games reports that the 5e Dungeon Master's Guide sorts settlements by population figures alone.",
  source="Oak of Honor Games, Settlements: critique of the DMG guidelines, 14 Oct 2020",
  url=OAK, quote="The DMG divides settlements just by population", page="section Village", kind="analysis",
  polarity="disputes", date="2020-10-14", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Oak of Honor Games reports that the 5e Dungeon Master's Guide settlement guidance carries a Size section subdivided into Village, Town and City.",
  source="Oak of Honor Games, Settlements: critique of the DMG guidelines, 14 Oct 2020",
  url=OAK, quote="the Size section under its sub-headings of Village, Town", page="opening section", kind="analysis",
  polarity="asserts", date="2020-10-14", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Oak of Honor Games names Commerce as one of the headed sections of the 5e Dungeon Master's Guide settlement guidance and places it on page 19.",
  source="Oak of Honor Games, Settlements: critique of the DMG guidelines, 14 Oct 2020",
  url=OAK, quote="as described in the Commerce section (p19)", page="section Village", kind="analysis",
  polarity="asserts", date="2020-10-14", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="dossier-archivist", confidence="high")
c(feature="naming and forms of address",
  claim="Elven Tower names Vallaki's ruler by noble title, given name, surname and then the office he holds.",
  source="Elven Tower (Derek Ruiz), Chapter 5 – The Town of Vallaki",
  url=ETV, quote="Baron Vargas Vallakovich, the Burgomaster of Vallaki, a ruthless cruel", page="section The powers at play", kind="analysis",
  polarity="applies", date="n.d.; Wayback capture 2026-04-18", routeHint="live URL returns 403; Wayback raw capture web.archive.org/web/20260418221915id_/",
  registerHint="dossier-archivist", confidence="high")
c(feature="place and institution description",
  claim="Elven Tower gives Vallaki's armed strength as a named captain plus a numeral count of guards.",
  source="Elven Tower (Derek Ruiz), Chapter 5 – The Town of Vallaki",
  url=ETV, quote="consists of Izek and 24 guards", page="section The Bomb in Vallaki", kind="analysis",
  polarity="applies", date="n.d.; Wayback capture 2026-04-18", routeHint="live URL returns 403; Wayback raw capture web.archive.org/web/20260418221915id_/",
  registerHint="dm-page", confidence="medium")
c(feature="boxed text form",
  claim="A forum reader reports that reading boxed text aloud signals to players that the location or NPC matters to the plot.",
  source="EN World forum thread 'Boxed texts', reader comment",
  url=ENB, quote="Reading out a chunk of boxed text is basically equivalent", page="thread Boxed texts", kind="reader",
  polarity="disputes (treats the signalling as a drawback)", date="2021", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="medium")
c(feature="place and institution description",
  claim="Justin Alexander estimates the gazetteer portion of Waterdeep: Dragon Heist at about 32 pages.",
  source="Justin Alexander, The Alexandrian, Review – Waterdeep: Dragon Heist, 2018",
  url=DHREV, quote="about 32 pages of gazetteer information", page="closing assessment", kind="measurement",
  polarity="asserts", date="2018", routeHint="curl with browser UA on the live URL; raw HTML",
  registerHint="none", confidence="medium")

d["claims"]=C; d["sourcesRead"]=S; d["complete"]=True
d["coverage"]=("Named roster: Alexandrian RotF review parts 1-2, Alexandrian Descent into Avernus review and Remixing Avernus, "
 "Alexandrian Running the Sandbox parts 1-2 and Dragon Heist review all FETCHED raw; the Alexandrian has NO Curse of Strahd remix "
 "series (thealexandrian.net/wordpress/tag/curse-of-strahd returns 404) and no Icewind Dale Remix exists, so that roster item is "
 "NOT FOUND rather than missed. Sly Flourish CoS and RotF ch.1 prep posts fetched but carry no entry-form analysis. Power Score "
 "reviews and guides for both RotF and Curse of Strahd fetched and substantive. Publisher routes: D&D Beyond 'Trek to Ten-Towns' "
 "encounter and the 2024 DMG Greyhawk article fetched raw, plus one official media.wizards.com PDF; dndbeyond.com/sources/dnd/idrotf "
 "returns only a JavaScript shell (BLOCKED) and no free Ten-Towns or Sigil excerpt is published on wizards.com. elventower.com "
 "returned 403 live and was recovered through the Wayback raw capture; theopentome.com is DNS-dead and its Wayback capture is empty "
 "(NOT READ). Sigil chapter and SCAG city entries covered by read-throughs that quote (Seed of Worlds, Exposition Break, Strange "
 "Assembly, Writer in White). Substantive per route: 4 publisher/official, 8 critic-analysis, 5 measurement-bearing read-throughs, "
 "4 reception reviews; 31 sources logged, 21 substantive. Two consecutive lateral searches surfaced only unlawful full-text mirrors "
 "(5e.tools, scribd, archive.org book scans), which were not used.")
json.dump(d, open("found-dnd-place-5e-gazetteers.json","w"), indent=1, ensure_ascii=False)
print("claims",len(C),"sources",len(S))
