# -*- coding: utf-8 -*-
import json
d=json.load(open("found-wolfe-close.json"))
RW="lists.urth.net dead from here (curl 000); Wayback raw capture https://web.archive.org/web/2021id_/<url>"
B="http://lists.urth.net/pipermail/urth-urth.net/2006-September/%s.html"
d["sourcesRead"]+=[
 dict(title="(urth) Close Reading: Torturer Chapter II: Severian — JWillard, Urth mailing list (paragraph-by-paragraph notes)",url=B%"058619",kind="reader",substantive=True,date="2006-09-09",route=RW),
 dict(title="(urth) Close Reading: Torturer Chapter II: Severian — Bruce Hayles, Urth mailing list",url=B%"003004",kind="reader",substantive=True,date="2006-09-10",route=RW),
 dict(title="(urth) Close Reading: Torturer Chapter II: Severian — Roy C. Lackey, Urth mailing list",url=B%"003007",kind="reader",substantive=True,date="2006-09-10",route=RW),
]
def C(feature,claim,source,url,quote,page,kind,polarity,date,reg="none",conf="high"):
    return dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,
                polarity=polarity,date=date,routeHint=RW,registerHint=reg,confidence=conf)
d["claims"]+=[
 C("other: incidental detail as evidence","In a paragraph-by-paragraph reading of chapter II, JWillard stops on a plain sentence about piling pebbles and asks whether it is a casual comment or something more.","JWillard, Urth mailing list, 9 September 2006",B%"058619","Casual comment, or something more?","message body, note on paragraph 3","reader","asserts","2006-09-09","dossier-archivist"),
 C("withheld information and inference","The same reader asks whether a sentence framed as reminiscence is a pointer in disguise.","JWillard, Urth mailing list, 9 September 2006",B%"058619","pointer disguised as reminescence?","message body, note on paragraphs 10-11","reader","asserts","2006-09-09","dossier-archivist"),
 C("withheld information and inference","Bruce Hayles says Wolfe has Severian state the rule about symbols while being blind to the symbols on his own tomb.","Bruce Hayles, Urth mailing list, 10 September 2006",B%"003004","Wolfe is an amazing teacher: he shows Severian instructing us on","message body, final paragraph","reader","asserts","2006-09-10","dossier-archivist"),
 C("withheld information and inference","Bruce Hayles says the reader must derive the importance of three symbols despite the narrator not emphasising them at all.","Bruce Hayles, Urth mailing list, 10 September 2006",B%"003004","despite the fact that Severian does not emphasize them whatsoever","message body, final paragraph","reader","asserts","2006-09-10","dossier-archivist"),
 C("other: incidental detail as evidence","Roy C. Lackey treats a physical detail that does not belong in its setting — cart tracks on a beach — as the load-bearing evidence linking two scenes.","Roy C. Lackey, Urth mailing list, 10 September 2006",B%"003007","had no business being on that beach.","message body, reply on the Sand Garden","reader","asserts","2006-09-10","dossier-archivist"),
]
d["complete"]=True
d["coverage"]=("Angle roster (forums, blogs, video-essay transcripts, reading groups) worked in that order. FETCHED, 30 substantive sources: forums — MetaFilter 149475, SFF Chronicles threads 11050 and 528814, and nine Urth-mailing-list messages from the September 2006 'Close Reading: Torturer' project (chapters I and II); "
 "blogs and essay sites — Reactor/Tor.com x2 (Keeley on opening sentences, Knode on Peace), markrkelly.com, katemacdonald.net, Strange at Ecbatan, Tree Slices, Lit & Chess, LA Review of Books (Joan Gordon), the F&SF site (Gaiman, via Wayback), and nine Ultan's Library articles (Gevers x2, Wowra, Andre-Driussi x3, Borski, Crampton x2, Peter Wright). "
 "BLOCKED: video-essay transcripts — both saved YouTube ids (7zvBdTEaJ1M, T4GYEQynCv0) return HTTP 200 with zero bytes on the timedtext endpoint in every format (json3/srv1/srv3/vtt), so no transcript was read and no video-essay claim is made; Reddit r/genewolfe (403 on www .json, 302 on old.reddit) — no reader claims from Reddit. "
 "NOT FOUND live: lists.urth.net (curl 000 on two attempts) — recovered through byte-identical Wayback raw captures; sfsite.com likewise recovered through Wayback. Substantive per route: named roster 12; bibliography chasing 13 (the Ultan's Library article index, and the links named inside the MetaFilter post and inside Andy Lee's essay); lateral 5. "
 "Two further probes surfaced nothing new: the Urth October and November 2006 thread indexes carry no continuation of the close-reading project, and the September index's remaining messages repeat points already claimed.")
json.dump(d,open("found-wolfe-close.json","w"),indent=1,ensure_ascii=False)
print(len(d["sourcesRead"]),"sources",len(d["claims"]),"claims","complete",d["complete"])
