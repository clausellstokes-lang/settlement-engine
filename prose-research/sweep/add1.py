# -*- coding: utf-8 -*-
import json
d=json.load(open("found-wolfe-close.json"))
R="live URL fetched raw with a browser user agent (curl), HTML parsed to text"
U_ULT="https://ultan.org.uk/the-reader-as-augur/"
U_RH="http://rrhorton.blogspot.com/2024/08/review-peace-by-gene-wolfe.html"
U_TS="https://treeslices.wordpress.com/2016/08/20/peace-by-gene-wolfe/"
U_LC="https://litandchess.substack.com/p/gene-wolfes-peace"
U_RP="https://reactormag.com/gene-wolfe-peace-review/"
GEV="Nick Gevers, “The Reader as Augur”, Ultan's Library, 5 September 2000"
RH="Rich Horton, Strange at Ecbatan, August 2024"
LEE="Andy Lee, Lit & Chess (Substack), 12 July 2026"
MK2="Mordicai Knode, Reactor (Tor.com), 26 October 2012"
d["sourcesRead"]+= [
 dict(title="The Reader as Augur: Beginnings and Endings in Gene Wolfe's The Book of the Long Sun — Nick Gevers, Ultan's Library",url=U_ULT,kind="analysis",substantive=True,date="2000-09-05",route=R),
 dict(title="Review: Peace, by Gene Wolfe — Rich Horton, Strange at Ecbatan",url=U_RH,kind="analysis",substantive=True,date="2024-08",route=R),
 dict(title="Peace by Gene Wolfe — Tree Slices (reader review quoting one long sentence in full)",url=U_TS,kind="reader",substantive=True,date="2016-08-20",route=R),
 dict(title="Gene Wolfe's Peace — Andy Lee, Lit & Chess",url=U_LC,kind="analysis",substantive=True,date="2026-07-12",route=R),
 dict(title="Gene Wolfe's Peace Will Leave You Anything But Peaceful — Mordicai Knode, Reactor (Tor.com)",url=U_RP,kind="analysis",substantive=True,date="2012-10-26",route=R),
]
def C(feature,claim,source,url,quote,page,kind,polarity,date,reg="none",conf="high"):
    return dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,
                polarity=polarity,date=date,routeHint=R,registerHint=reg,confidence=conf)
d["claims"]+=[
 C("opening sentence","Gevers says each volume of The Book of the Long Sun opens with a dialogue in which the informed figure yields his information only in oracular or otherwise obscure form.",GEV,U_ULT,"which he will only yield up in oracular or otherwise obscure form","section 'Beginnings and endings', paragraph 3","analysis","asserts","2000-09-05","dossier-archivist"),
 C("opening sentence","Gevers says the information in each opening passage, and the precise character of its obscurity, amount to terms of reading for the rest of the volume.",GEV,U_ULT,"amount to guidance, to terms of reading, for the remainder","section 'Beginnings and endings', paragraph 3","analysis","asserts","2000-09-05","dossier-archivist"),
 C("closing sentence","Gevers, using Kim Stanley Robinson's and John Clute's term 'slingshot ending', describes an ending whose momentum of implication carries beyond the text it terminates.",GEV+", citing Kim Stanley Robinson and John Clute",U_ULT,"an ending whose momentum of implication carries well beyond the confines","section 'Beginnings and endings', paragraph 3","analysis","applies","2000-09-05"),
 C("opening sentence","Gevers reads the first words of Lake of the Long Sun as establishing that silent implication can convey as much as any violent confrontation.",GEV,U_ULT,"silent implication can convey as much as any violent confrontation","section on Lake of the Long Sun's opening","analysis","asserts","2000-09-05","dossier-archivist"),
 C("withheld information and inference","Gevers says the opening of Nightside the Long Sun presents signs to two augurs at once, Silk and the reader.",GEV,U_ULT,"signs are presented to those augurs, Silk and the reader","section on Nightside the Long Sun's opening","analysis","asserts","2000-09-05","dossier-archivist"),
 C("withheld information and inference","Gevers reads a passing description of a boy's frozen grin as an ironic tribute to that character's concealed function as the tetralogy's narrator.",GEV,U_ULT,"his craftily concealed and long-term function as Long Sun","section on Nightside the Long Sun's opening","analysis","asserts","2000-09-05","dossier-archivist"),
 C("plainness and economy","Gevers says that in Exodus From the Long Sun Wolfe's narration becomes spare and unexplanatory, a minefield of hints and implications.",GEV,U_ULT,"narration becomes spare, unexplanatory, a minefield of hints and implications","section on Exodus From the Long Sun","analysis","asserts","2000-09-05","dossier-archivist"),
 C("withheld information and inference","Gevers says volume three states as its terms of reading the necessity of assembling the text's meaning from numerous seemingly disconnected clues.",GEV,U_ULT,"assembling the meaning of the text from numerous seemingly disconnected clues","section on Calde of the Long Sun","analysis","asserts","2000-09-05","dossier-archivist"),
 C("other: incidental detail as evidence","Gevers reads the physical detail of a hastily erected triumphal arch as a sign of the makeshift nature of the new revolutionary regime.",GEV,U_ULT,"as a sign of the generally makeshift nature of the revolutionary","section on Calde's Epilogue","analysis","asserts","2000-09-05","dossier-archivist"),
 C("closing sentence","Gevers says the narrator's self-identification in the closing section of Exodus forces the reader to re-appraise the whole preceding text.",GEV,U_ULT,"thus forcing the reader to re-appraise the whole of the preceding text","section on Exodus's conclusion","analysis","asserts","2000-09-05","chronicle-line"),

 C("opening sentence","Rich Horton calls the opening sentence of Peace somewhat famous.",RH,U_RH,"The novel's somewhat famous opening sentence reads","paragraph 2","analysis","asserts","2024-08"),
 C("withheld information and inference","Rich Horton says a legend supplied later in Peace lets the reader infer that the fallen elm was planted on the narrator's grave.",RH,U_RH,"One assumes, then, that the elm tree that has just fallen","paragraph 2","analysis","asserts","2024-08","dossier-archivist"),
 C("point of view and distance","Rich Horton infers from that same detail that the narration of Peace comes decades or more after the narrator's death.",RH,U_RH,"this narration is likely decades if not more after Weer's death","paragraph 2","analysis","asserts","2024-08","chronicle-line"),
 C("omission as information","Rich Horton says Peace contains a great many lacunae, with very few of its stories actually coming to an end.",RH,U_RH,"There are also a great many lacunae.","paragraph on the stories","analysis","asserts","2024-08","dossier-archivist"),

 C("sentence length variation","A reader quoting one Peace sentence in full remarks that it is a single sentence and that some are a struggle to get through.","Tree Slices (book blog), 20 August 2016",U_TS,"Some of them are a struggle to get through","body, after the block quotation","reader","asserts","2016-08-20"),

 C("withheld information and inference","Andy Lee says the narrator's voice constructs the world of a novel by revealing some truths and concealing others.",LEE,U_LC,"revealing some truths and concealing others","introductory paragraphs","analysis","asserts","2026-07-12","dossier-archivist"),
 C("omission as information","Andy Lee says Wolfe never shows the reader the monster of Peace directly.",LEE,U_LC,"Wolfe never shows you the monster directly.","paragraph beginning 'What raises Peace'","analysis","asserts","2026-07-12","dossier-archivist"),
 C("withheld information and inference","Andy Lee likens Wolfe's method in Peace to hiding the answers in plain sight.",LEE,U_LC,"the hiding of answers in plain sight","paragraph beginning 'What raises Peace'","analysis","asserts","2026-07-12","dossier-archivist"),
 C("omission as information","Andy Lee says Peace could be the story of a conventional life except that its gaps are troubling.",LEE,U_LC,"It could be the story of a conventional life, but the gaps","paragraph on Weer's formative years","analysis","asserts","2026-07-12","dossier-archivist"),
 C("withheld information and inference","Andy Lee says the narrator of Peace is searching in his memories but also trying to conceal a great deal more.",LEE,U_LC,"he’s also trying to conceal a whole lot more","paragraph on Weer's formative years","analysis","asserts","2026-07-12","dossier-archivist"),
 C("civic record register","Andy Lee reads a Peace bookseller's line about a forged volume — that it is nevertheless catalogued — as capturing how a record confers existence on what it lists.",LEE,U_LC,"but nevertheless it is catalogued, there it is on the page","paragraph after the Gold dialogue","analysis","asserts","2026-07-12","dossier-archivist"),
 C("withheld information and inference","Andy Lee reports that Wolfe's own comments on Peace suggest he worried he had concealed too well for readers to follow.",LEE+", relaying unspecified comments by Gene Wolfe",U_LC,"he was concerned that he’d done too good of a job","paragraph beginning 'What raises Peace'","relay","mentions","2026-07-12","none","medium — the page names no occasion or text for Wolfe's comments"),

 C("withheld information and inference","Mordicai Knode says Wolfe does not lay out a trail of breadcrumbs in Peace but the clues are there.",MK2,U_RP,"doesn’t lay out breadcrumbs in a trail…but the clues are there","body, section on the second layer","analysis","asserts","2012-10-26","dossier-archivist"),
 C("other: incidental detail as evidence","Mordicai Knode says the reader who chases all the details of Peace to their roots reaches the conclusion that the narrator is dead.",MK2,U_RP,"if you chase all the details to their roots","body, section on the third layer","analysis","asserts","2012-10-26","dossier-archivist"),
 C("withheld information and inference","Mordicai Knode says the evidence that the narrator of Peace is dead is buried in the text but convincing.",MK2,U_RP,"The evidence for it is buried, but convincing.","body, section on the third layer","analysis","asserts","2012-10-26","dossier-archivist"),
]
d["coverage"]="in progress — 15 sources read raw"
json.dump(d,open("found-wolfe-close.json","w"),indent=1,ensure_ascii=False)
print(len(d["sourcesRead"]),"sources",len(d["claims"]),"claims")
