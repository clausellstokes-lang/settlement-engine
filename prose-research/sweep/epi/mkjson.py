import json,re
rows=json.load(open("all.json")); D={r["n"]:r for r in rows if r["n"] is not None}
def U(n): return D[n]["URL"] if "URL" in D[n] else D[n]["url"].replace("http://","https://")
def DT(n): return D[n]["date"]
TAG="https://elliottrwi.com/tag/hobb-reread/"
SER="Geoffrey B. Elliott, \"A Robin Hobb Rereading Series\", elliottrwi.com"
def ent(n): return SER+", Entry %d (%s)"%(n,DT(n))
C=[]
def add(feature,claim,source,url,quote,page="",kind="analysis",polarity="asserts",date="",routeHint="",registerHint="dossier-archivist",confidence="high"):
    C.append(dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence))

MEAS="Census by this finder over the 314 entries of Elliott's rereading series that cover the Farseer (1-100), Tawny Man (221-314) and Fitz and the Fool (390-509) chapters"
MROUTE="wordpress.com public REST v1.1 posts endpoint for elliottrwi.com, tag=hobb-reread, 541 posts, content field = the published post HTML; verified identical to the independently curl-fetched rendered page for entry 226"
def meas(claim,conf="high",reason="",feat="civic record register",rh="dossier-archivist"):
    add(feat,claim,MEAS+"; source corpus: "+SER,TAG,"","census over 314 entries","measurement","asserts","2026-09-06",MROUTE,rh,conf if not reason else conf+" ("+reason+")")

# --- census measurements ---
meas("In 138 of the 314 entries (44 percent) Elliott names no document form for the chapter's opening text, describing it only as a commentary, musing, note, gloss, comment, passage or excerpt.")
meas("Elliott's opening description names a journal or diary in 21 of the 314 entries.")
meas("None of the 100 Elliott entries covering the Farseer trilogy names a journal or diary as the chapter's opening document.")
meas("All 21 entries whose opening description names a journal or diary fall in the Fitz and the Fool trilogy (entries 390-509).")
meas("Elliott's opening description names a letter, missive or message in 16 of the 314 entries.",feat="civic record register",rh="herald-pools")
meas("None of the 100 Elliott entries covering the Farseer trilogy names a letter as the chapter's opening document.",rh="herald-pools")
meas("Elliott's opening description names a treatise in only 2 of the 314 entries.")
meas("Elliott's opening description names a scroll in only 3 of the 314 entries.")
meas("No entry among the 314 describes a chapter's opening document as a recipe.")
meas("Elliott's opening description names a song, verse, stanza or ballad in 9 of the 314 entries.")
meas("Elliott's opening description names a tale, story, legend, myth or creation narrative in 23 of the 314 entries.")
meas("Of the 23 tale, story, legend or creation-narrative openings, 14 fall in the 94 Tawny Man entries.")
meas("Elliott's opening description names a history, annal or chronicle in 11 of the 314 entries.",rh="chronicle-line")
meas("Elliott's opening description names a report, account, dispatch or testimony in 18 of the 314 entries.")
meas("Elliott's phrase \"in-milieu\" occurs in the opening description of 65 of the 314 entries.")
meas("Of the 65 opening descriptions containing \"in-milieu\", 49 fall in the 94 Tawny Man entries.")
meas("The number of opening descriptions naming a personal author or addressee rises across the three trilogies: 15 in Farseer, 17 in Tawny Man, 39 in Fitz and the Fool.",feat="point of view and distance")
meas("Elliott calls the chapter's opening text brief or short in 53 of the 314 entries and extended, lengthy or long in 9.",feat="plainness and economy")
meas("The word \"epigraph\" does not occur in any of the 541 posts tagged hobb-reread on elliottrwi.com.",feat="terminology consistency",rh="none")
meas("Elliott's rereading series comprises 541 posts tagged hobb-reread, numbered Entry 0 through Entry 539 as of 2026-09-02.",feat="other: corpus scale",rh="none")
meas("For 13 of the 120 Fitz and the Fool entries Elliott's opening sentence describes only narrative action and names no opening document at all.",feat="opening sentence")

# --- per-entry evidence ---
def E(n,feature,claim,quote,rh="dossier-archivist",conf="high",pol="asserts"):
    add(feature,claim,ent(n),U(n),quote,"body, opening paragraph","analysis",pol,DT(n),MROUTE,rh,conf)
E(2,"civic record register","Elliott records that the second chapter of Assassin's Apprentice opens with an in-milieu historical document to which the narrator then responds in the main text.","opening with an in-milieu historical document")
E(3,"civic record register","Elliott records that the third chapter of Assassin's Apprentice opens with a passage from an in-milieu reference text.","a passage from an in-milieu reference text")
E(28,"civic record register","Elliott records that Royal Assassin chapter 3 opens with a description of an old scroll about King Wisdom's encounter with the Elderlings.","a description of an old scroll detailing",rh="chronicle-line")
E(33,"repetition and refrain","Elliott records that a Royal Assassin chapter opens with two stanzas from an in-milieu song, \"The Vixen Queen's Hunt\".","opens with two stanzas from the in-milieu",rh="herald-pools")
E(52,"proverbs and sayings","Elliott records that a Royal Assassin chapter opens with what read as a series of folk sayings.","a series of what read as folk sayings",rh="herald-pools")
E(56,"civic record register","Elliott records that a Royal Assassin chapter opens with an excerpt from a Six Duchies legend.","an excerpt from a Six Duchies legend")
E(57,"place and institution description","Elliott records that a Royal Assassin chapter opens with something like an encyclopedia entry about Burrich.","something of an encyclopedia entry regarding Burrich")
E(221,"opening sentence","Elliott records that the first chapter of the Tawny Man trilogy opens with a riddle attributed in-milieu to Kelstar.","the cryptic Kelstar",rh="none")
E(227,"civic record register","Elliott records that a Fool's Errand chapter opens with an in-milieu discussion of the Old Blood drawn from Badgerlock's \"Old Blood Tales\".","an in-milieu discussion of the Old Blood from Badgerlock")
E(228,"civic record register","Elliott records that a Fool's Errand chapter opens with a letter from Burrich to his counterpart in a lesser court.","a letter from Burrich to his counterpart in a lesser court",rh="herald-pools")
E(246,"civic record register","Elliott records that a Fool's Errand chapter opens with a selection from Chivalry Farseer's treatise \"Of the Mountain Kingdom\".","a selection from Chivalry Farseer")
E(255,"repetition and refrain","Elliott records that a Golden Fool chapter opens with verses attributed to Starling Birdsong.","begins with verses from Starling Birdsong",rh="herald-pools")
E(272,"civic record register","Elliott records that a Golden Fool chapter opens with an extended complaint from one of Chade's agents on Aslevjal.","an extended complaint from one of Chade",rh="herald-pools")
E(285,"annalist voice and deep time","Elliott records that a Fool's Fate chapter opens with an Outisland creation narrative.","an Outisland creation narrative",rh="chronicle-line")
E(310,"civic record register","Elliott records that a Fool's Fate chapter opens with a brief and pointed message from Patience to Kettricken.","a brief and pointed message from Patience to Kettricken",rh="herald-pools")
E(313,"civic record register","Elliott records that a Fool's Fate chapter opens with a reply from Kettricken to Bingtown about Tintaglia.","a reply from Kettricken to Bingtown about Tintaglia",rh="herald-pools")
E(390,"civic record register","Elliott records that the front matter of Fool's Assassin includes the text of a letter from Queen Desire to Fennis of Tilth.","a letter from Queen Desire to Fennis of Tilth",rh="herald-pools")
E(406,"translation and register","Elliott records that a Fool's Assassin chapter is preceded by an excerpted translation Fitz made of a damaged original.","an excerpted translation done by Fitz of a damaged original")
E(409,"withheld information and inference","Elliott records that a Fool's Assassin chapter is prefaced by a fragment of recorded prophecy about the Unexpected Son.","A fragment of recorded prophecy regarding the Unexpected Son")
E(410,"translation and register","Elliott records that a Fool's Assassin chapter is preceded by an excerpt from a translated commentary on killing.","an excerpt from a translated commentary on killing")
E(418,"civic record register","Elliott records that a Fool's Assassin chapter is prefaced by a brief excerpt from a pedagogical treatise by Fedwren.","A brief excerpt from a pedagogical treatise by Fedwren")
E(420,"point of view and distance","Elliott records that a Fool's Assassin chapter is preceded by an excerpt from Fitz's journals.","an excerpt from Fitz")
E(434,"annalist voice and deep time","Elliott records that a Fool's Quest chapter is preceded by a passage from the Servants' histories marking a change in terminology.","a passage from the Servants",rh="chronicle-line")
E(459,"point of view and distance","Elliott records that an extended excerpt from Bee's dream journals serves as the prologue of Assassin's Fate.","An extended excerpt from Bee")
E(502,"civic record register","Elliott records that an Assassin's Fate chapter is prefaced by testimony from a Skilled apprentice written at Nettle's direction.","Testimony from a Skilled apprentice written at Nettle")

# --- Elliott's device statements ---
E(237,"civic record register","Elliott names the chapter-opening device in the Farseer and Tawny Man trilogies as an Asimovian citation of in-milieu reference works.","the citation of in-milieu reference works")
E(237,"other: chapter-opening device attribution","Elliott attributes the chapter-opening device of the Farseer and Tawny Man trilogies to Asimov.","the Asimovian device with which Hobb opens the chapters of the",rh="none")
E(427,"place and institution description","Elliott writes that the Fitz-centred novels emulate Asimovian encyclopedia entries in their chapter beginnings.","the Fitz-centric novels emulate the Asimovian encyclopedia-entries in their")
E(101,"register modulation","Elliott notes the absence of Asimovian encyclopedia-style chapter entries in the Liveship Traders prologue as a clue that the series is a different thing.","The lack of Asimovian encyclopedia-style entries is a subtler clue",pol="rejects")
E(279,"place and institution description","Elliott identifies the opening text of a Fool's Fate chapter as an encyclopedic entry.","One is the encyclopedic entry at the beginning")
E(383,"plainness and economy","Elliott observes that the Rain Wilds chapter-preface letters are rarely of any length because they are carried by pigeons.","the letters are rarely of any length, sensibly to them being",rh="herald-pools")
E(383,"other: chapter-preface function","Elliott says the Rain Wilds chapter-prefaces both provide Asimovian context and trace ongoing narratives outside the main story.","the chapter-prefaces used not only in the Asimovian style",rh="chronicle-line")
E(226,"civic record register","Elliott describes Hobb's practice as an Asimovian move of grounding chapters in in-milieu reference materials.","the Asimovian move of grounding chapters in in-milieu reference materials")
E(250,"register modulation","Elliott records that the Golden Fool prologue opens with abortive in-milieu comments from Fitz about the loss of Nighteyes rather than an impersonal record.","abortive in-milieu comments from Fitz about the loss of Nighteyes")
E(225,"point of view and distance","Elliott records that a Fool's Errand chapter opens with what seem to be Fitz's own later recorded musings on the Old Blood.","Fitz")
json.dump(C,open("claims_part1.json","w"),indent=1)
print(len(C))
