# -*- coding: utf-8 -*-
import json
d=json.load(open("found-wolfe-close.json"))
R="live URL fetched raw with a browser user agent (curl), HTML parsed to text"
RW="lists.urth.net dead from here (curl 000); Wayback raw capture https://web.archive.org/web/2021id_/<url> (byte-identical to the live capture)"
RG="sfsite.com unreachable live (curl 000); Wayback raw capture https://web.archive.org/web/2019id_/http://www.sfsite.com/fsf/2007/gwng0704.htm"
U_GA="https://www.sfsite.com/fsf/2007/gwng0704.htm"
U_LA="https://lareviewofbooks.org/article/we-read-things-differently/"
U_MP="https://ultan.org.uk/review-botns/"
U41="http://lists.urth.net/pipermail/urth-urth.net/2006-September/002941.html"
U48="http://lists.urth.net/pipermail/urth-urth.net/2006-September/002948.html"
d["sourcesRead"]+=[
 dict(title="How To Read Gene Wolfe — Neil Gaiman (first published in the World Horror Convention 2002 Program Book; reprinted on the F&SF site, April 2007)",url=U_GA,kind="analysis",substantive=True,date="2002",route=RG),
 dict(title="We Read Things Differently — Joan Gordon, Los Angeles Review of Books",url=U_LA,kind="analysis",substantive=True,date="2013-04-30",route=R),
 dict(title="Mapping a Masterwork: A Critical Review of Gene Wolfe's The Book of the New Sun — Peter Wright, Ultan's Library",url=U_MP,kind="analysis",substantive=True,date="2002-08-28",route=R),
 dict(title="(urth) Close Reading: Torturer Chapter I — 'b sharp', Urth mailing list (reply to Roy C. Lackey)",url=U41,kind="reader",substantive=True,date="2006-09-06",route=RW),
 dict(title="(urth) Close Reading: Torturer Chapter I — JWillard, Urth mailing list (reply summarising the thread)",url=U48,kind="reader",substantive=True,date="2006-09-06",route=RW),
]
def C(feature,claim,source,url,quote,page,kind,polarity,date,route,reg="none",conf="high"):
    return dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,
                polarity=polarity,date=date,routeHint=route,registerHint=reg,confidence=conf)
GA="Neil Gaiman, “How To Read Gene Wolfe”, World Horror Convention 2002 Program Book, reprinted on the F&SF site"
JG="Joan Gordon, “We Read Things Differently”, Los Angeles Review of Books, 30 April 2013"
PW="Peter Wright, “Mapping a Masterwork”, Ultan's Library, 28 August 2002"
d["claims"]+=[
 C("withheld information and inference","Gaiman's first rule for reading Wolfe is to trust the text implicitly because the answers are in it.",GA,U_GA,"Trust the text implicitly. The answers are in there.","numbered rule 1","own-words","asserts","2002",RG,"dossier-archivist"),
 C("withheld information and inference","Gaiman says Peace read as a gentle Midwestern memoir on his first reading and became a horror novel only on a later one.",GA,U_GA,"really was a gentle Midwestern memoir the first time I read","numbered rule 3","own-words","asserts","2002",RG,"dossier-archivist"),
 C("plainness and economy","Gaiman places Wolfe among the clever writers who see no need to point out how clever they are.",GA,U_GA,"who see no need to point out how clever they are","numbered rule 7","own-words","asserts","2002",RG,"dossier-archivist"),

 C("concrete sensory noun","Joan Gordon says the individual scenes of Peace are sharply evoked so that the reader travels in time to its streets and houses.",JG,U_LA,"Its individual scenes are sharply evoked so that we travel in time","standfirst and body","analysis","asserts","2013-04-30","dossier-archivist"),
 C("withheld information and inference","Joan Gordon, quoting Peter Wright, reports that no reviewer recognised the narrator's deathly state when Peace first appeared.","Peter Wright, Attending Daedalus, quoted by Joan Gordon in the Los Angeles Review of Books, 30 April 2013",U_LA,"no reviewer recognised Weer’s deathly state","body, paragraph on Wright's reading","reception","asserts","2013-04-30",R,"dossier-archivist","medium — Wright's words as quoted by Gordon; Attending Daedalus itself not fetched"),
 C("withheld information and inference","Joan Gordon vehemently disagrees with Peter Wright's claim that Wolfe's goal is to confound the reader.",JG,U_LA,"I vehemently disagree that Wolfe’s goal is to confound the reader","body, paragraph on Wright's reading","analysis","disputes","2013-04-30",R),
 C("plainness and economy","Joan Gordon corrects an elaborate symbolic reading of a character by pointing out what the novel merely notes in plain words.",JG,U_LA,"but the novel merely notes that she has grown","body, paragraph on Borski's reading of Olivia","analysis","disputes","2013-04-30",R,"dossier-archivist"),

 C("diction (native vs latinate)","Wolfe, quoted by Peter Wright, says his unfamiliar diction is meant to convey the flavour of an odd place at an odd time.","Gene Wolfe, quoted by Peter Wright, Ultan's Library, 28 August 2002",U_MP,"convey the flavour of an odd place at an odd time","body, section on diction (note 8)","own-words","asserts","2002-08-28",R,"dossier-archivist","medium — Wolfe's words as quoted by Wright; the cited source itself not fetched"),
 C("compounds and coinages","Wolfe, quoted by Peter Wright from the appendix to The Shadow of the Torturer, says the obscure nouns are intended to be suggestive rather than definitive.","Gene Wolfe, appendix to The Shadow of the Torturer, quoted by Peter Wright",U_MP,"intended to be suggestive rather than definitive","body, section on diction (note 9)","own-words","asserts","2002-08-28",R,"dossier-archivist","medium — Wolfe's appendix as quoted by Wright"),
 C("point of view and distance","Peter Wright says Severian is unreliable because of the very characteristic that makes him appear wholly reliable, his eidetic memory.",PW,U_MP,"Severian is unreliable because of the very characteristic that makes him","body, section on the narrator","analysis","asserts","2002-08-28",R,"chronicle-line"),
 C("withheld information and inference","Peter Wright says a mnemonist narrator remembers a wealth of detail, which scatters the meaning of the story.",PW,U_MP,"remember a wealth of detail (plot) which scatters meaning (story)","body, section on the narrator","analysis","asserts","2002-08-28",R,"dossier-archivist"),
 C("withheld information and inference","Peter Wright says the gulf between plot and story, between the apparent and the real, alerts the reader that a contrived textual game is being played.",PW,U_MP,"The gulf between plot and story, between the apparent and the real","body, section on plot and story","analysis","asserts","2002-08-28",R,"dossier-archivist"),
 C("withheld information and inference","Peter Wright says Wolfe effectively conceals his narratological sleight of hand rather than displaying it.",PW,U_MP,"by effectively concealing his narratological sleight of hand","body, section on the literary game","analysis","asserts","2002-08-28",R,"dossier-archivist"),
 C("other: counter-evidence, style-praise as a critical dead end","Peter Wright disputes the critical habit of extolling The Book of the New Sun for its fluidity of style, calling that approach narrow and unimaginative.",PW,U_MP,"extol The Book of the New Sun for its fluidity of style","body, opening section","analysis","disputes","2002-08-28",R),

 C("other: counter-evidence, anomaly as authorial error","A reader on the Urth list rejects Lackey's attribution of the pistol contradiction to Wolfe, arguing the mistakes are Severian's and purposeful, establishing him as unreliable within the first pages.","'b sharp', Urth mailing list, 6 September 2006",U41,"establishing, within the first pages, Severian as an unreliable narrator.","message body, reply to Roy C. Lackey","reader","disputes","2006-09-06",RW,"dossier-archivist"),
 C("other: close-reading method","The same reader says attacking the book chapter by chapter may expose things previously hidden in the cracks.","'b sharp', Urth mailing list, 6 September 2006",U41,"may expose a lot of things previously hidden in the","message body, first paragraph","reader","asserts","2006-09-06",RW),
 C("withheld information and inference","The reader who began the close-reading project repeats that words like 'perhaps' and 'seem' are treacherous coming from Severian, citing a second instance on page 11.","JWillard, Urth mailing list, 6 September 2006",U48,"words like 'perhaps' and 'seem' are","message body, note on p11 of Shadow/Claw","reader","asserts","2006-09-06",RW,"dossier-archivist"),
]
d["coverage"]="in progress — 27 sources read raw"
json.dump(d,open("found-wolfe-close.json","w"),indent=1,ensure_ascii=False)
print(len(d["sourcesRead"]),"sources",len(d["claims"]),"claims")
