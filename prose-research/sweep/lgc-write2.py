import json
SRC2=[
 ("John Plotz on Earthsea, Anarchism, and Ursula K. Le Guin (Public Books, with Elizabeth Ferry)","https://www.publicbooks.org/john-plotz-on-earthsea-anarchism-and-ursula-k-le-guin/","analysis",True,"2024-02-21"),
 ("Rob Tomlinson, The Dispossessed (A Good Read)","https://www.rob-tomlinson.com/a-good-read/dispossessed","analysis",True,"2020s"),
 ("Theodora Goss, Stonecoast: Wizard of Earthsea","https://theodoragoss.com/2015/02/28/stonecoast-wizard-of-earthsea/","analysis",True,"2015-02-28"),
 ("The Book Nut, A Wizard of Earthsea (review + comment thread)","https://thebooknut.com/2018/03/30/a-wizard-of-earthsea/","reception",True,"2018-03-30"),
 ("Doug Merrill, The Dispossessed by Ursula K. Le Guin (The Frumious Consortium)","https://www.thefrumiousconsortium.net/2018/03/19/the-dispossessed-by-ursula-k-le-guin/","analysis",True,"2018-03-19"),
 ("alannaofdoom, 'Bright the hawk's flight on the empty sky' (Cannonball Read)","https://cannonballread.com/2014/02/bright-the-hawks-flight-on-the-empty-sky/","reader",True,"2014-02-13"),
 ("Wet Broken Things, Book review - Tehanu","https://wetbrokenthings.wordpress.com/2025/05/25/book-review-tehanu/","reception",True,"2025-05-25"),
 ("Moda od Radosti, Tehanu, a novel by Ursula K. Le Guin (book review)","https://modaodaradosti.blogspot.com/2024/08/tehanu-novel-by-ursula-k-le-guin-book.html","reader",True,"2024-08"),
 ("Jaclyn Morken / F(r)iction and LitCharts ch.1 — see checkpoint 1 (non-substantive for prose)","https://www.litcharts.com/lit/a-wizard-of-earthsea/chapter-1","analysis",False,None),
 ("YouTube video essay 'What is good fantasy prose?' (5lDA8VyeLx0) — BLOCKED, transcript unreachable","https://www.youtube.com/watch?v=5lDA8VyeLx0","analysis",False,None),
 ("YouTube video essay 'From Elfland to Poughkeepsie ... Fantasy Essays' (bt5ypCZvivg) — BLOCKED, transcript unreachable","https://www.youtube.com/watch?v=bt5ypCZvivg","analysis",False,None),
]
base=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close.json'))
c2=json.load(open('lgc-claims2.json'))
seen={s['url'] for s in base['sourcesRead']}
for t,u,k,s,d in SRC2:
    if u in seen: continue
    row={"title":t,"url":u,"kind":k,"substantive":s,"route":"curl with browser user agent (live URL)"}
    if d: row["date"]=d
    base['sourcesRead'].append(row)
base['claims']=base['claims']+c2
base['coverage']=("CHECKPOINT 2 (round 3, close-readings angle). The angle's named roster (Earthsea prose; From Elfland to Poughkeepsie; Steering the Craft; The Language of the Night) was fetched and mined in rounds 1-2 and is already banked in merged-leguin.json, so round 3 spent its budget on close readings those rounds missed: Always Coming Home as a fictional ethnography (4 sources), 'The Ones Who Walk Away from Omelas' as a description of a city (3), the opening paragraph of The Dispossessed (2 independent close readings), the opening of A Wizard of Earthsea read by a working novelist (1), a one-sentence close reading by a novelist-teacher (Matt Bell), plus reader/forum/comment-thread material (4). "
 "27 pages fetched RAW by curl with a browser user agent; 22 substantive. Blocked: every route to a YouTube transcript (timedtext returns an empty body, youtubetotranscript 403, tactiq 401, youtubetranscript.com is client-side only, no yt-dlp on the machine) and www.tor.com 403 (cured by the reactormag mirror). WebFetch itself was unusable for this angle: it returned model-written summaries rather than page text, so nothing was quoted from it.")
json.dump(base,open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close.json','w'),indent=1)
print("claims",len(base['claims']),"sources",len(base['sourcesRead']))
