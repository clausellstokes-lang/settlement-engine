import json
U={
 'roll20':'https://roll20.net/compendium/dnd5e/Rules:Settlements?expansion=33359',
 'tracker':'https://media.dndbeyond.com/compendium-images/br/dmg/settlement-tracker.pdf',
 'dmg14':'https://archive.org/download/dungeon-masters-guide/Dungeon%20Master%27s%20Guide_djvu.txt',
 'srd51':'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf',
 'srd521':'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf',
 'sly':'https://slyflourish.com/random_tables_of_the_dmg.html',
 'oak':'https://www.oakofhonor.com/index.php/2020/10/14/settlements-critique-of-the-dmg-guidelines/',
 'pcg':'https://www.pcgamer.com/games/gosh-i-think-d-and-ds-finally-done-it-the-2024-dungeon-masters-guide-actually-does-a-decent-job-of-teaching-you-how-to-run-a-game/',
 'warg':'https://www.wargamer.com/dnd/tracking-sheets-dms-guide',
 'd20d':'https://d20digest.substack.com/p/read-the-dmg',
 'jeth':'https://jethoof.github.io/home/worldbuilding/Tables/Settlements/',
 'ddbtr':'https://www.dndbeyond.com/sources/dnd/br-2024/tracking-sheets',
 'ebin':'https://ebin.pub/dungeons-amp-dragons-dungeon-masters-guide-5nbsped-9780786965625.html',
}
S={
 'roll20':'Wizards of the Coast, Dungeon Master’s Guide (2024), "Settlements" (DM’s Toolbox), read on the licensed Roll20 compendium',
 'tracker':'Wizards of the Coast, "Settlement Tracker" sheet, Dungeon Master’s Guide (2024), free PDF on D&D Beyond, © 2024',
 'dmg14':'Wizards of the Coast, Dungeon Master’s Guide (2014, 5th edition)',
 'srd51':'Wizards of the Coast, System Reference Document 5.1 (CC-BY-4.0)',
 'srd521':'Wizards of the Coast, System Reference Document 5.2.1 (CC-BY-4.0)',
 'sly':'Mike Shea (Sly Flourish), "Random Tables of the Dungeons and Dragons 5th Edition Dungeon Master’s Guide", 26 May 2015',
 'oak':'Ian, Oak of Honor Games, "Settlements: critique of the DMG guidelines", 14 October 2020',
 'pcg':'Joshua Wolens, PC Gamer, review of the 2024 Dungeon Master’s Guide',
 'warg':'Chris Perkins, quoted in an official 1 October 2024 livestream by Mollie Russell, Wargamer',
 'd20d':'Maximilian Hart, d20 Digest, "Read the DMG", 27 October 2022',
 'jeth':'Jethoof’s Digital Garden, "Settlement Generator" (reproduction citing DMG 5e p.112), 11 February 2023',
 'ddbtr':'Wizards of the Coast / D&D Beyond, "Tracking Sheets", free 2024 rules',
}
def c(feature,claim,k,quote,page,kind,polarity,date,route,reg,conf=None):
    d={"feature":feature,"claim":claim,"source":S[k],"url":U[k],"quote":quote,"page":page,
       "kind":kind,"polarity":polarity,"date":date,"routeHint":route,"registerHint":reg}
    if conf: d["confidence"]=conf
    else: d["confidence"]="high"
    return d

R_ROLL='roll20.net licensed compendium page fetched raw with a browser user agent (section body is free to read); curl + HTML strip'
R_TRK='PDF binary from media.dndbeyond.com (linked from the free /sources/dnd/br-2024/tracking-sheets page), pdftotext -layout'
R_IA='archive.org item "dungeon-masters-guide", file "Dungeon Master\'s Guide_djvu.txt" (full-book OCR), curl direct'
R_PDF='publisher PDF fetched with curl, pdftotext -layout'
R_PLAIN='live URL, browser user agent, curl + HTML strip'

claims=[
# ---- 2024 DMG, publisher's own words
c("other: settlement slot list",
 "The 2024 Dungeon Master's Guide defines a settlement with exactly four settlement-level tables, headed Defining Traits, Claims to Fame, Current Calamities and Local Leaders, plus a Settlements by Size table.",
 'roll20',"The following tables allow you to flesh out details about a settlement.",
 "DM's Toolbox, 'Settlements' > 'Settlement Tables and Tracker'","own-words","asserts","2024-11-12",R_ROLL,"dossier-archivist"),

c("place and institution description",
 "The 2024 DMG asserts that describing a settlement to the players in words is usually enough and no map is required.",
 'roll20',"Simply describing the settlement to your players is usually sufficient.",
 "'Settlements' > sidebar 'Do I Need a Settlement Map?'","own-words","asserts","2024-11-12",R_ROLL,"dm-page"),

c("other: settlement size bands",
 "The 2024 DMG's Settlements by Size table gives population ranges of up to 500 for a village, 501-5,000 for a town and 5,001 and higher for a city.",
 'roll20',"population ranges for villages, towns, and cities",
 "'Settlements' > 'Settlements by Size'","own-words","asserts","2024-11-12",R_ROLL,"dossier-archivist"),

c("other: digits in prose",
 "The 2024 DMG writes a price as a numeral inside a running sentence of its own worked example rather than spelling it out.",
 'roll20',"(which costs 50 GP) is too expensive an item",
 "'Settlements', opening paragraphs","own-words","applies","2024-11-12",R_ROLL,"dm-page"),

c("dm-facing sentence",
 "Every entry on the 2024 DMG's Current Calamities table is a complete sentence in the present tense closed with a full stop.",
 'roll20',"Monsters infest the settlement.",
 "'Settlements' > 'Current Calamities' (1d12)","own-words","applies","2024-11-12",R_ROLL,"chronicle-line"),

c("other: settlement slot list",
 "The 2024 DMG's leadership slot, retitled Local Leaders, admits a council rather than only a single ruler as a settlement's leader.",
 'roll20',"Respected, fair, and just leader or council",
 "'Settlements' > 'Local Leaders' (1d12)","own-words","asserts","2024-11-12",R_ROLL,"dossier-archivist"),

c("concrete sensory noun",
 "The 2024 DMG's Defining Traits table is a list of physical, visible features of the built place rather than of its politics or reputation.",
 'roll20',"Impressive structure (such as a keep, temple, circle of standing stones",
 "'Settlements' > 'Defining Traits' (1d20)","own-words","applies","2024-11-12",R_ROLL,"dossier-archivist"),

c("other: settlement slot list",
 "The 2024 DMG's Settlements section carries no table on relations between the peoples living in a settlement, a slot the 2014 book had as Race Relations.",
 'roll20',"",
 "'Settlements' > 'Settlement Tables and Tracker' (complete list of tables on the page)","measurement","asserts","2024-11-12",R_ROLL,"none",
 "medium - an absence claim: the whole section was read and its seven tables enumerated, but absence cannot be quoted"),

# ---- The Settlement Tracker (the publisher's own record form)
c("civic record register",
 "Wizards' own free Settlement Tracker sheet records a settlement in nine fields: settlement name, a size band, defining trait, claim to fame, current calamity, local leader, noteworthy people, noteworthy places, and the GP value of the most expensive item for sale.",
 'tracker',"GP VALUE OF THE MOST EXPENSIVE ITEM FOR SALE:",
 "Settlement Tracker, single sheet","own-words","asserts","2024-11-12",R_TRK,"dossier-archivist"),

c("civic record register",
 "On Wizards' Settlement Tracker the four rolled slots are labelled in the singular, where the corresponding DMG table headings are plural.",
 'tracker',"DEFINING TRAIT",
 "Settlement Tracker, slot labels","own-words","applies","2024-11-12",R_TRK,"dossier-archivist",
 "medium - the plural table headings are on a different page (the Roll20 compendium capture)"),

c("civic record register",
 "Wizards' Settlement Tracker adds two free-text roster fields, Noteworthy People and Noteworthy Places, that no table in the DMG's Settlements section generates.",
 'tracker',"NOTEWORTHY PEOPLE",
 "Settlement Tracker, lower half","own-words","asserts","2024-11-12",R_TRK,"dossier-archivist",
 "medium - the second limb (no generating table) rests on the Roll20 capture of the section"),

c("other: settlement size bands",
 "Wizards' Settlement Tracker records settlement size as one of three tick boxes carrying the population band in numerals.",
 'tracker',"TOWN (POP. 501–5,000)",
 "Settlement Tracker, header line","own-words","applies","2024-11-12",R_TRK,"dossier-archivist"),

# ---- 2014 DMG chapter 5
c("place and institution description",
 "The 2014 DMG tells the DM to build a settlement around the locations most relevant to the adventure.",
 'dmg14',"When creating a settlement for your campaign, focus",
 "ch.5 'Adventure Environments' > 'Settlements', p.112","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("omission as information",
 "The 2014 DMG warns the DM off naming every street and identifying every building's inhabitants, calling that way madness.",
 'dmg14',"the inhabitants of every building; that way lies madness.",
 "ch.5 > 'Settlements', p.112","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("other: settlement slot list",
 "The 2014 DMG's five Random Settlements tables presuppose that the settlement's size and basic form of government have already been fixed elsewhere.",
 'dmg14',"settlement. They assume that you've already determined",
 "ch.5 > 'Settlements' > 'Random Settlements', p.112","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

c("other: settlement slot list",
 "The 2014 DMG's settlement slots are five tables headed Race Relations, Ruler's Status, Notable Traits, Known For Its, and Current Calamity.",
 'dmg14',"its size and its basic form of government.",
 "ch.5 > 'Random Settlements', p.112 (table headings on the page)","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

c("other: table heading form",
 "The 2014 DMG heads its reputation slot as a sentence stem with an ellipsis that the rolled result completes.",
 'dmg14',"Known For Its ...",
 "ch.5 > 'Random Settlements', p.112","own-words","applies","2014-12-09",R_IA,"herald-pools"),

c("dm-facing sentence",
 "The entries on the 2014 DMG's Current Calamity table are unpunctuated noun phrases rather than sentences.",
 'dmg14',"Undead stirring in cemeteries",
 "ch.5 > 'Random Settlements' > 'Current Calamity', p.112","own-words","applies","2014-12-09",R_IA,"herald-pools"),

c("place and institution description",
 "The 2014 DMG tells the DM drawing a settlement map to ignore the placement of every building and concentrate on major features.",
 'dmg14',"concentrate instead on the major features.",
 "ch.5 > 'Mapping a Settlement', p.114","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("naming and forms of address",
 "The 2014 DMG advises naming a city's wards after the dominant trade, a geographical characteristic, or a dominant site, offering Tannery Square, Riverside and the Lords' Quarter as its own examples.",
 'dmg14',"the kinds of trades that dominate the neighborhood",
 "ch.5 > 'Mapping a Settlement', p.114","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

# ---- 2014 DMG chapter 1
c("other: settlement slot list",
 "The 2014 DMG opens its settlement guidance with a question list whose second sensory question asks what the place looks, smells and sounds like.",
 'dmg14',"What does it look, smell, and sound like?",
 "ch.1 'A World of Your Own' > 'Settlements', p.15","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

c("concrete sensory noun",
 "The 2014 DMG asserts that sensory details are what bring a settlement to life for the players.",
 'dmg14',"Sensory details help bring a settlement to life and",
 "ch.1 > 'Settlements' > 'Atmosphere', p.17","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

c("place and institution description",
 "The 2014 DMG tells the DM to fix one defining factor for a settlement's personality and extrapolate the rest of the description from it.",
 'dmg14',"Settle on a single defining factor that sums up a",
 "ch.1 > 'Settlements' > 'Atmosphere', p.17","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

c("plainness and economy",
 "The 2014 DMG rules that a settlement the party only rests and resupplies in needs no more than a brief description.",
 'dmg14',"of this sort needs no more than a brief description.",
 "ch.1 > 'Settlements' > 'Local Color', p.15","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("omission as information",
 "The 2014 DMG instructs the DM to create only the settlement features the campaign will actually need and let the place grow later.",
 'dmg14',"you put into it. Create only the features of a settlement",
 "ch.1 > 'Settlements' > 'Purpose', p.15","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("edition and house style",
 "The 2014 DMG explicitly licenses the DM to disregard its own settlement advice where it conflicts with the DM's vision.",
 'dmg14',"Disregard any advice here that runs counter to",
 "ch.1 > 'Settlements', p.15","own-words","asserts","2014-12-09",R_IA,"dm-page"),

c("civic record register",
 "Each settlement size in the 2014 DMG is written as a five-field labelled record: Population, Government, Defense, Commerce and Organizations.",
 'dmg14',"Organizations: A village might contain one or two",
 "ch.1 > 'Settlements' > 'Size' (Village, Town, City), pp.16-17","own-words","applies","2014-12-09",R_IA,"dossier-archivist"),

c("other: digits in prose",
 "In the 2014 DMG the city population threshold is spelled out in words inside the running prose.",
 'dmg14',"Cities that hold more than twenty-five thousand people",
 "ch.1 > 'Settlements' > 'Size' > City, p.17","own-words","applies","2014-12-09",R_IA,"dossier-archivist"),

c("other: digits in prose",
 "The same 2014 DMG city entry gives the same population figure in numerals in its labelled Population field, a few lines above the spelled-out sentence.",
 'dmg14',"Population: Up to about 25,000",
 "ch.1 > 'Settlements' > 'Size' > City, p.17","own-words","applies","2014-12-09",R_IA,"dossier-archivist"),

c("other: digits in prose",
 "The 2014 DMG's Forgotten Realms currency example carries two coin values as numerals inside one sentence of running prose.",
 'dmg14',"worth 50 gp in Waterdeep and 30 gp",
 "ch.1 > 'Settlements' > 'Currency' > 'Example: The Forgotten Realms', p.19","own-words","applies","2014-12-09",R_IA,"dossier-archivist"),

c("place and institution description",
 "The 2014 DMG defines a ward as a neighbourhood of a city defined by specific features, produced by the outward expansion of city walls.",
 'dmg14',"naturally divide the city into wards (neighborhoods",
 "ch.1 > 'Settlements' > 'Size' > City, p.17","own-words","asserts","2014-12-09",R_IA,"dossier-archivist"),

# ---- SRD measurements
c("other: open-content coverage",
 "The CC-BY System Reference Document 5.1 carries no settlement section and none of the DMG's settlement tables; 'settlement' occurs twice in the whole document, both times incidentally.",
 'srd51',"",
 "whole document, grep of the extracted text","measurement","asserts","2023-01-01",R_PDF+"; grep over the extracted text","none"),

c("other: open-content coverage",
 "The CC-BY System Reference Document 5.2.1 likewise carries no settlement section and none of the 2024 DMG's settlement tables.",
 'srd521',"",
 "whole document, grep of the extracted text","measurement","asserts","2025-04-22",R_PDF+"; grep over the extracted text","none"),

# ---- secondary
c("other: settlement slot list",
 "Mike Shea's index of the 2014 DMG's random tables places Race Relations, Ruler's Status, Notable Traits, Known For Its and Current Calamity all on page 112, and Forms of Government separately on page 18.",
 'sly',"doesn't include an index of all of the random charts",
 "'The Random Table Index'","analysis","asserts","2015-05-26",R_PLAIN,"none"),

c("edition and house style",
 "Ian of Oak of Honor Games judges that the DMG's Purpose section is about how much the GM should invent and record rather than about what settlements are like.",
 'oak',"is less about what settlements are like in the world",
 "opening section on 'Purpose'","analysis","asserts","2020-10-14",R_PLAIN,"none"),

c("other: settlement size bands",
 "Ian of Oak of Honor Games disputes the 2014 DMG's size scheme, objecting that it separates settlements by population alone where historians separate them by function.",
 'oak',"The DMG divides settlements just by population",
 "'Village' section","analysis","disputes","2020-10-14",R_PLAIN,"none"),

c("other: reception of the tables",
 "PC Gamer's reviewer complains that the 2024 DMG's toolbox tables, settlement creation among them, read as a bullet-point list of suggestions rather than a guide.",
 'pcg',"more of a bullet-point list of suggestions than a guide",
 "review body, on the DM's Toolbox","reception","disputes","2024-11-08",R_PLAIN,"none"),

c("civic record register",
 "Chris Perkins presents the 2024 tracking sheets, the Settlement Tracker among them, as a device for keeping track of important information in play.",
 'warg',"designed to help you keep track of important information",
 "Wargamer report of the 1 October 2024 livestream","own-words","asserts","2024-10-01",R_PLAIN,"dossier-archivist",
 "medium - Perkins' words as transcribed by a reporter, not a primary transcript"),

c("place and institution description",
 "Maximilian Hart demonstrates that the 2014 DMG's page-112 slots compose into a single connected settlement paragraph, and reports it took about 30 seconds.",
 'd20d',"All that took about 30 seconds to create using the tables",
 "'Read the DMG', demonstration paragraph","analysis","applies","2022-10-27",R_PLAIN,"dossier-archivist"),

c("other: settlement slot list",
 "A community reproduction citing DMG 5e p.112 gives the full row lists of the 2014 Race Relations, Ruler's Status, Notable Traits, Known for and Calamity tables.",
 'jeth',"Dungeon Master’s Guide 5e, p.112",
 "'Settlement Generator', footnote 1","relay","asserts","2023-02-11",R_PLAIN,"dossier-archivist",
 "low - the same page also prints a Community Sizes table and an Overall Alignment table that are from the 3.5e DMG, not 5e; use only the tables the 5e book actually has"),
]

sources=[
 {"title":"Settlements | D&D 2024 | Roll20 Compendium (Dungeon Master's Guide 2024)","url":U['roll20'],"kind":"own-words","substantive":True,"date":"2024-11-12","route":R_ROLL},
 {"title":"SETTLEMENT TRACKER (2024 Dungeon Master's Guide free tracking sheet)","url":U['tracker'],"kind":"own-words","substantive":True,"date":"2024","route":R_TRK},
 {"title":"Tracking Sheets - D&D Beyond free 2024 rules (index of the ten sheets)","url":U['ddbtr'],"kind":"vendor","substantive":True,"date":"2024","route":R_PLAIN},
 {"title":"Dungeon Master's Guide (2014) - full-book OCR text","url":U['dmg14'],"kind":"own-words","substantive":True,"date":"2014-12-09","route":R_IA},
 {"title":"Dungeons & Dragons: Dungeon Master's Guide [5 ed.] - partial book text mirror (chs.1-2 clean, used to cross-check OCR)","url":U['ebin'],"kind":"own-words","substantive":True,"date":"2014","route":R_PLAIN},
 {"title":"System Reference Document 5.1 (CC-BY)","url":U['srd51'],"kind":"measurement","substantive":True,"date":"2023","route":R_PDF},
 {"title":"System Reference Document 5.2.1 (CC-BY)","url":U['srd521'],"kind":"measurement","substantive":True,"date":"2025","route":R_PDF},
 {"title":"Random Tables of the D&D 5th Edition Dungeon Master's Guide - Sly Flourish","url":U['sly'],"kind":"analysis","substantive":True,"date":"2015-05-26","route":R_PLAIN},
 {"title":"Settlements: critique of the DMG guidelines - Oak of Honor Games","url":U['oak'],"kind":"analysis","substantive":True,"date":"2020-10-14","route":R_PLAIN},
 {"title":"PC Gamer review of the 2024 Dungeon Master's Guide","url":U['pcg'],"kind":"reception","substantive":True,"date":"2024","route":R_PLAIN},
 {"title":"DnD's 2024 DM's Guide debuts tracking sheets for absolutely everything - Wargamer","url":U['warg'],"kind":"reception","substantive":True,"date":"2024-10-01","route":R_PLAIN},
 {"title":"Read the DMG - d20 Digest","url":U['d20d'],"kind":"analysis","substantive":True,"date":"2022-10-27","route":R_PLAIN},
 {"title":"Settlement Generator - Jethoof's Digital Garden (reproduction of DMG p.112 tables)","url":U['jeth'],"kind":"relay","substantive":True,"date":"2023-02-11","route":R_PLAIN},
]
out={"complete":False,"coverage":"checkpoint after 13 sources","sourcesRead":sources,"claims":claims}
json.dump(out,open('found-dnd-place-dmg-settlements.json','w'),indent=1,ensure_ascii=False)
print(len(claims),"claims,",len(sources),"sources")
