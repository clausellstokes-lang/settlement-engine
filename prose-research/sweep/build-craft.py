import json,os
OUT="found-wolfe-craft.json"
S=[]
C=[]
def src(title,url,kind,sub,date=None,route="curl browser-UA raw HTML"):
    S.append({"title":title,"url":url,"kind":kind,"substantive":sub,"date":date,"route":route})
def cl(feature,claim,source,url,quote,page=None,kind="analysis",polarity="asserts",date=None,routeHint="curl browser-UA raw HTML",registerHint="none",confidence="high"):
    C.append({"feature":feature,"claim":claim,"source":source,"url":url,"quote":quote,"page":page,"kind":kind,"polarity":polarity,"date":date,"routeHint":routeHint,"registerHint":registerHint,"confidence":confidence})

G="https://maxgladstone.substack.com/p/the-wolfeman"
src("The Wolfeman",G,"analysis",True,"2022-10-14")
cl("withheld information and inference","Novelist Max Gladstone says Wolfe's readers build interpretations by connecting sentences hundreds of pages apart rather than from anything stated outright.","Max Gladstone, 'The Wolfeman', The Third Place (Substack), 2022",G,"building theories by rubbing together two sentences two hundred pages apart","body, para 4",date="2022-10-14",registerHint="dossier-archivist")
cl("point of view and distance","Gladstone says Wolfe's narrators claim eidetic memory and perfect recall and honesty, and then lie or forget.","Max Gladstone, 'The Wolfeman', The Third Place (Substack), 2022",G,"They assert their eidetic memories and perfect recall and utter honesty","body, para 8",date="2022-10-14")
cl("omission as information","Gladstone says an elision in a Wolfe text can carry large implications a casual reader will not see.","Max Gladstone, 'The Wolfeman', The Third Place (Substack), 2022",G,"vast churning implications invisible to the casual reader","body, para 2",date="2022-10-14",registerHint="dossier-archivist")
cl("withheld information and inference","Gladstone describes reading Wolfe as assembling clues by touch in the dark rather than being told.","Max Gladstone, 'The Wolfeman', The Third Place (Substack), 2022",G,"We fumble through darkness, trying to assemble clues by touch.","body, para 8",date="2022-10-14")
cl("other: authorial signature detail","Gladstone says some details Wolfe plants are the author's signature to the audience rather than evidence about the story world.","Max Gladstone, 'The Wolfeman', The Third Place (Substack), 2022",G,"Wolfe loves to include winking asides between author and audience.","body, para 9",date="2022-10-14",confidence="medium")

H="https://floydholland.substack.com/p/the-enchanting-prose-of-gene-wolfe"
src("The Enchanting Prose of Gene Wolfe",H,"analysis",True,"2025-01-03")
cl("parataxis vs hypotaxis","Floyd Holland characterises Wolfe's prose as dense and built with parentheticals and complicating clauses.","Floyd Holland, 'The Enchanting Prose of Gene Wolfe' (Substack), 2025",H,"the dense prose, interjecting itself with parentheticals and complicating clauses","after the 5HC excerpt",date="2025-01-03")
cl("plainness and economy","Holland says Wolfe never lets a sentence run away from him, reading an aura of control across the prose.","Floyd Holland, 'The Enchanting Prose of Gene Wolfe' (Substack), 2025",H,"One never feels he let a sentence get away from him","penultimate section",date="2025-01-03")
cl("diction (native vs latinate)","Holland attributes the beauty of Wolfe's otherwise unwieldy sentences to word choice and confidence of construction.","Floyd Holland, 'The Enchanting Prose of Gene Wolfe' (Substack), 2025",H,"made beautiful by careful word choice and a certain confidence of construction","penultimate section",date="2025-01-03")
cl("point of view and distance","Wolfe, quoted by Holland, said real people are unreliable narrators all the time.","Gene Wolfe, quoted by Floyd Holland (Substack), 2025",H,"Real people really are unreliable narrators all the time","after the 5HC excerpt",kind="relay",date="2025-01-03",confidence="medium")
cl("withheld information and inference","Holland says the opening scene of The Fifth Head of Cerberus carries clues to a larger mystery while reading as ordinary recollection.","Floyd Holland, 'The Enchanting Prose of Gene Wolfe' (Substack), 2025",H,"the scene is peppered with clues to the larger story","after the 5HC excerpt",date="2025-01-03",registerHint="dossier-archivist")

J="https://jafrank09.substack.com/p/whose-afraid-of-the-big-bad-wolfe"
src("Whose Afraid of the Big Bad Wolfe?",J,"analysis",True,"2025-07-22")
cl("opening sentence","In a sentence-level reading of the opening paragraph of The Fifth Head of Cerberus, Alex notes it shows no genre markers at all.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"There are no obvious genre trappings in this opening paragraph, at all.","section 'What can an opening teach you?'",date="2025-07-22",registerHint="dossier-archivist")
cl("omission as information","Alex says what is absent from Wolfe's opening paragraph, not what is present, is what is notable about it.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"What’s noticeable here is not what’s present but what’s missing.","section 'What can an opening teach you?'",date="2025-07-22")
cl("place and institution description","Alex says the opening grounds the reader in concrete spatial description of the narrator's house, naming the orientation of its wings and courtyard.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"grounded in a narrator’s spatial description that is concrete","section 'What can an opening teach you?'",date="2025-07-22",registerHint="dossier-archivist")
cl("concrete sensory noun","Alex says Wolfe makes odd details register as stranger by setting them among mundane ones.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"weird details feel all the weirder when they are grounded","final section",date="2025-07-22",registerHint="dossier-archivist")
cl("omission as information","Alex says the detail Wolfe leaves unexplained reads as more real than an explanation of it would.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"These little opacities feel ‘realer’ than any explanation of them would.","final section",date="2025-07-22",registerHint="dossier-archivist")
cl("withheld information and inference","Alex says the brothers' unexplained soundless gestures imply a private life the reader is never given access to.","Alex, 'Whose Afraid of the Big Bad Wolfe?' (Substack), 2025",J,"hint at a private life that the reader never gets access to","final section",date="2025-07-22")

SI="https://newmythologies.substack.com/p/great-uncle-gene"
src("Great Uncle Gene",SI,"analysis",True,"2023-07-17")
cl("cadence and rhythm","Writer Matthew Sini says Wolfe's sentences work at the level of rhythm and structure.","Matthew Sini, 'Great Uncle Gene', New Mythologies (Substack), 2023",SI,"they hit at the level of rhythm and structure","para 4",date="2023-07-17")
cl("withheld information and inference","Sini says the presence Wolfe's sentences summon has contours that are not clearly defined and yet are not vague.","Matthew Sini, 'Great Uncle Gene', New Mythologies (Substack), 2023",SI,"its contours aren’t always clearly defined, but it’s also not vague","para 4",date="2023-07-17",confidence="medium")
cl("point of view and distance","Sini says much of Wolfe's world is withheld from the reader by the narrowness of the narrator's perception.","Matthew Sini, 'Great Uncle Gene', New Mythologies (Substack), 2023",SI,"kept from us due to the narrowness of the narrator’s perception","closing section",date="2023-07-17",registerHint="dossier-archivist")

W="https://www.wolfewiki.com/pmwiki/pmwiki.php?n=Articles.Novice"
src("Where to Begin? A Novice's Guide to the Lupine Maze",W,"analysis",True,"2017-11-17")
cl("withheld information and inference","The WolfeWiki novice guide reports Wolfe said he does not give important information twice.","WolfeWiki, 'Where to Begin? A Novice's Guide to the Lupine Maze', last modified 2017",W,"he doesn't give the important information twice","section 'Hints for Beginners'",kind="relay",date="2017-11-17")
cl("withheld information and inference","The guide advises reading an apparent contradiction as a hint that the narrator is concealing something.","WolfeWiki, 'Where to Begin? A Novice's Guide to the Lupine Maze', last modified 2017",W,"Apparent contradictions are often useful hints that the narrator is concealing something.","section 'Hints for Beginners'",polarity="applies",date="2017-11-17",registerHint="dossier-archivist")
cl("omission as information","The guide asserts the information a reader needs is always present in a Wolfe text, though not where the reader expects it.","WolfeWiki, 'Where to Begin? A Novice's Guide to the Lupine Maze', last modified 2017",W,"The information you need is always there","section 'Hints for Beginners'",date="2017-11-17",registerHint="dossier-archivist")
cl("per-speaker register","The guide says Wolfe works out what a narrator would say rather than what the author wants to say.","WolfeWiki, 'Where to Begin? A Novice's Guide to the Lupine Maze', last modified 2017",W,"what they would say, rather than what he wants to say","section 'Hints for Beginners'",date="2017-11-17",registerHint="chronicle-line")
cl("point of view and distance","The guide tells a new reader to begin by asking who is telling the story, when, why, and to whom.","WolfeWiki, 'Where to Begin? A Novice's Guide to the Lupine Maze', last modified 2017",W,"Who is telling this story, and when? Why are they telling it","section 'Hints for Beginners'",polarity="applies",date="2017-11-17")

K1="https://reactormag.com/how-gene-wolfe-starts-a-story-and-where-to-start-reading-his-work/"
src("How Gene Wolfe Starts a Story (and Where to Start Reading His Work)",K1,"analysis",True,"2017-11-09")
cl("opening sentence","Matthew Keeley says the grammar of the opening sentence of The Fifth Head of Cerberus carries a clue to the story.","Matthew Keeley, Tor.com/Reactor, 2017",K1,"a slight clue to the story in the sentence’s grammar","body, para 4",date="2017-11-09",registerHint="dossier-archivist")
cl("withheld information and inference","Keeley reads the absent comma in the phrase naming the narrator's brother as a detail the book later explains.","Matthew Keeley, Tor.com/Reactor, 2017",K1,"We eventually do learn why that comma is missing.","body, para 4",date="2017-11-09",registerHint="dossier-archivist")
cl("point of view and distance","Keeley says one first-person sentence near the end of an otherwise third-person Wolfe book makes the reader reconsider all of it.","Matthew Keeley, Tor.com/Reactor, 2017",K1,"asks readers to reconsider everything that they’ve already read","body, para 5",date="2017-11-09")

K2="https://reactormag.com/the-best-way-to-approach-the-book-of-the-new-sun/"
src("The Best Way to Approach The Book of the New Sun",K2,"analysis",True,"2017-12-04")
cl("archaism","Keeley says every word in The Book of the New Sun can be found in a dictionary, so the strangeness is not neologism.","Matthew Keeley, Tor.com/Reactor, 2017",K2,"every word in the book appears in a dictionary","advice 1",date="2017-12-04",registerHint="dossier-archivist")
cl("diction (native vs latinate)","Keeley says the rare words in The Book of the New Sun were chosen to be evocative rather than specific.","Matthew Keeley, Tor.com/Reactor, 2017",K2,"chosen to be evocative, rather than specific","advice 1",date="2017-12-04",registerHint="dossier-archivist")
cl("archaism","Wolfe's appendix to The Shadow of the Torturer, quoted by Keeley, says substituted words like peltast and exultant are meant to be suggestive rather than definitive.","Gene Wolfe, appendix to The Shadow of the Torturer, quoted by Matthew Keeley (Tor.com, 2017)",K2,"are intended to be suggestive rather than definitive","advice 1, block quotation",kind="relay",date="2017-12-04",registerHint="dossier-archivist")
cl("omission as information","Keeley advises the reader to attend to Severian's sins of omission.","Matthew Keeley, Tor.com/Reactor, 2017",K2,"Pay attention to his sins of omission","advice 3",polarity="applies",date="2017-12-04",registerHint="dossier-archivist")
cl("point of view and distance","Keeley says Severian self-justifies and misinterprets but rarely lies outright.","Matthew Keeley, Tor.com/Reactor, 2017",K2,"He self-justifies and misinterprets, but rarely lies outright.","advice 3",date="2017-12-04")
cl("withheld information and inference","Keeley says a small detail in one volume of The Book of the New Sun frequently presages a large revelation in a later one.","Matthew Keeley, Tor.com/Reactor, 2017",K2,"a small detail in one book frequently presages a large revelation","advice 5",date="2017-12-04",registerHint="dossier-archivist")

# non-substantive / logged
src("On Gene Wolfe and the Feeling of Being Inspired","https://monstersandmanuals.blogspot.com/2023/03/on-gene-wolfe-and-feeling-of-being.html","analysis",False,"2023-03-14")
src("Gene Wolfe's Writing Rules","https://brianbiswas.com/blog/2015/wolfewritingrules","relay",False,"2015-03-27")

json.dump({"complete":False,"coverage":"in progress","sourcesRead":S,"claims":C},open(OUT,"w"),indent=1,ensure_ascii=False)
print(len(S),"sources",len(C),"claims")
