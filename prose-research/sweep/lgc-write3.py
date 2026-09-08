import json
P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close.json'
base=json.load(open(P))
c3=json.load(open('lgc-claims3.json'))
SRC3=[
 ("Michael Chabon, Le Guin's Subversive Imagination (The Paris Review Daily)","https://www.theparisreview.org/blog/2019/11/20/leguins-subversive-imagination/","analysis",True,"2019-11-20","live URL 403; Wayback raw capture (20260620070427id_)"),
 ("Jason P. Vest, The Re-Possessed: Ursula K. Le Guin storms the Library of America (The Common Reader)","https://commonreader.wustl.edu/c/the-re-possessed/","analysis",True,"2021-05-30","curl browser UA"),
 ("Alison Smith, Her Left Hand, The Darkness (Granta)","https://granta.com/her-left-hand-the-darkness/","reception",True,"2019-01-03","live URL 403; Wayback raw capture (20250903091534id_)"),
 ("Sherryl Vint interviewed by Cal Flyn, The Best Ursula Le Guin Books (Five Books)","https://fivebooks.com/best-books/best-ursula-le-guin-books-sherryl-vint/","analysis",True,"2021-05-07","curl browser UA"),
 ("Sean Guynes, Introducing the Ursula K. Le Guin Reread (Reactor) + comment thread","https://reactormag.com/introducing-the-ursula-k-le-guin-reread/","reader",True,"2020-06-22","curl browser UA"),
 ("Terry Morris, Earthsea and Tales from Earthsea, Steam Engine Time No. 11 (fanzine PDF)","https://efanzines.com/SFC/SteamEngineTime/SET11.pdf","reception",True,"2009-02","PDF binary fetched, streams decompressed, text operators extracted"),
 ("Writing About Ursula and Her Work — the estate's index of critical writing (used for bibliography chasing)","https://www.ursulakleguin.com/reviews","relay",False,"2026","curl browser UA"),
 ("New Criticism chapter on Omelas, Beginnings and Endings: A Critical Edition (thematic, not prose-level)","https://idaho.pressbooks.pub/beginnings-and-endings-a-critical-edition/chapter/new-criticism-10/","reader",False,"2022-12","curl browser UA"),
]
seen={s['url'] for s in base['sourcesRead']}
for t,u,k,s,d,r in SRC3:
    if u in seen: continue
    row={"title":t,"url":u,"kind":k,"substantive":s,"route":r}
    if d: row["date"]=d
    base['sourcesRead'].append(row)
base['claims']=base['claims']+c3
base['complete']=True
sub=sum(1 for s in base['sourcesRead'] if s['substantive'])
base['coverage']=(
 "Round 3, Le Guin close-readings/line-level angle. Named roster: the four items the angle names (the Earthsea prose, From Elfland to Poughkeepsie, Steering the Craft, The Language of the Night) were all FETCHED and already banked in rounds 1-2 (merged-leguin.json holds 100 Le Guin claims, 41 kept, including the Elfland PDF, the NEA guide, Walton's reread, Stan Carey, LitHub, Nepveu and Vermont Softworks); this round re-read Stan Carey raw to confirm and then spent its budget on close readings the earlier rounds missed rather than duplicating them. "
 "NOT FOUND: no line-level close reading of Always Coming Home's ethnographic entries themselves (four reviews describe the form, none reads a Kesh paragraph). "
 "BLOCKED: every route to a video-essay transcript (YouTube timedtext returns an empty body, youtubetotranscript 403, tactiq 401, youtubetranscript.com is client-side only, no yt-dlp on the machine), so no video essay is cited; www.tor.com, theparisreview.org, granta.com and reddit all 403 to curl (the first cured by the reactormag mirror, the next two by Wayback raw captures, reddit not cured). WebFetch returned model-written summaries rather than page text for every URL tried, so nothing is quoted from it: all 34 pages were read raw. "
 f"Sources: 34 fetched, {sub} substantive. By route: named roster / prior-round confirmation 2; lateral search (WebSearch, budget exhausted mid-round) 24; bibliography chasing from the estate's own index of critical writing and from the Pressbooks book's sibling chapters 6; Wayback recovery ladder 2. "
 "The new ground opened: Always Coming Home as a fictional ethnography and the nearest thing in Le Guin to a settlement gazetteer (4 independent readers, who agree it works and agree it reads slowly); 'The Ones Who Walk Away from Omelas' as a sustained description of a city by a narrator who admits the limits of the record (3); the opening paragraph of The Dispossessed, close-read twice independently (no people in it, no names for seven pages); the opening of A Wizard of Earthsea read as a descent from a bird's-eye view to a goatherd, by a novelist who teaches it; a one-sentence close reading by Matt Bell; and reader/forum/comment-thread material including the dissenting view that the distance reads as surface without depth.")
json.dump(base,open(P,'w'),indent=1)
print("claims",len(base['claims']),"sources",len(base['sourcesRead']),"substantive",sub)
