import json,sys,os
SRC=[
 # (title,url,kind,substantive,date,route)
 ("Sentence first (Stan Carey) — 'How to see one's own world': Le Guin on writing style","https://stancarey.wordpress.com/2024/10/16/how-to-see-ones-own-world-ursula-k-le-guin-on-writing-style/","analysis",True,"2024-10-16","curl browser UA"),
 ("John Pyle, 'From Elfland to Poughkeepsie' (Fairy Spell blog)","https://fairyspell.wordpress.com/2012/11/23/from-elfland-to-poughkeepsie/","analysis",False,"2012-11-23","curl browser UA"),
 ("Rich Horton, Review: Always Coming Home (Strange at Ecbatan)","http://rrhorton.blogspot.com/2024/04/review-always-coming-home-by-ursula-k.html","reception",True,"2024-04-24","curl browser UA"),
 ("Scott Manley Hadley, Always Coming Home (Triumph Of The Now)","https://triumphofthenow.com/2019/07/13/always-coming-home-by-ursula-le-guin/","reception",True,"2019-07-13","curl browser UA"),
 ("Cat Eldridge, Ursula K. Le Guin's Always Coming Home (A Green Man Review)","https://agreenmanreview.com/books/ursula-k-le-guins-always-coming-home/","reception",True,"2001","curl browser UA"),
 ("Nathanael Bonnell, Always Coming Home: Review (New Maps, via Resilience.org)","https://www.resilience.org/stories/2023-02-16/always-coming-home-review/","reception",True,"2023-02-16","curl browser UA"),
 ("Oliver Tearle, Summary and Analysis of 'The Ones Who Walk Away from Omelas' (Interesting Literature)","https://interestingliterature.com/2021/02/ursula-le-guin-ones-who-walk-away-from-omelas-summary-analysis/","analysis",True,"2021-02","curl browser UA"),
 ("Sarah Wyman (SUNY New Paltz), analysis of 'The Ones Who Walk Away from Omelas' (Literary Ladies Guide)","https://www.literaryladiesguide.com/literary-analyses/ones-who-walk-away-from-omelas-ursula-le-guin/","analysis",True,"2021","curl browser UA"),
 ("Reader Response chapter on Omelas, Beginnings and Endings: A Critical Edition (Pressbooks)","https://cwi.pressbooks.pub/beginnings-and-endings-a-critical-edition/chapter/reader-response-9/","reader",True,"2022-12","curl browser UA"),
 ("SFF Chronicles thread 583221: Is a Wizard of Earthsea indicative of Le Guin's writing style?","https://www.sffchronicles.com/threads/583221/","reader",True,"2022-08-01","curl browser UA"),
 ("Erin Ramsay, Earthsea: A Sharpening of Scale (The Lighthouse, Substack)","https://erinramsay.substack.com/p/earthsea-a-sharpening-of-scale","analysis",True,"2024","curl browser UA"),
 ("Jaclyn Morken, Late to the Party: A Wizard of Earthsea (F(r)iction)","https://frictionlit.org/late-to-the-party-a-wizard-of-earthsea-by-ursula-k-le-guin/","reception",False,"2021","curl browser UA"),
 ("LitCharts, A Wizard of Earthsea Chapter 1 Summary & Analysis","https://www.litcharts.com/lit/a-wizard-of-earthsea/chapter-1","analysis",False,None,"curl browser UA"),
 ("Matt Bell, Exercise #21: How to Study Sentence Structure (Substack)","https://mattbell.substack.com/p/exercise-21-how-to-study-sentence","analysis",False,"2021-09","curl browser UA"),
 ("Matt Bell, My Le Guin Year: Craft Lessons From a Master (Reactor / Tor.com)","https://reactormag.com/my-le-guin-year-craft-lessons-from-a-master/","analysis",True,"2021-08-24","curl browser UA"),
 ("Matt Bell, My Le Guin Year: Storytelling Lessons From a Master (Reactor) — republication of the Aug 2021 essay, same body text","https://reactormag.com/my-le-guin-year-storytelling-lessons-from-a-master/","analysis",False,"2022-03-10","curl browser UA"),
]
claims=json.load(open('lgc-claims1.json'))
out={"complete":False,
 "coverage":"CHECKPOINT 1 (round 3, close-readings angle). Named roster (Earthsea prose; From Elfland to Poughkeepsie; Steering the Craft; The Language of the Night) all reached in earlier rounds and re-confirmed here via Stan Carey's blog quoting The Language of the Night; this round deliberately opened NEW close-reading ground the earlier rounds missed: Always Coming Home (Le Guin's fictional ethnography — the nearest thing in her work to a settlement gazetteer) and 'The Ones Who Walk Away from Omelas' (a whole story that is a description of a city). 16 pages fetched raw by curl with a browser user agent; 11 substantive; 0 blocked so far; YouTube transcripts still unreached (youtubetotranscript returns 403, no yt-dlp on the box).",
 "sourcesRead":[{"title":t,"url":u,"kind":k,"substantive":s,**({"date":d} if d else {}),"route":r} for t,u,k,s,d,r in SRC],
 "claims":claims}
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close.json'
json.dump(out,open(p,'w'),indent=1)
print("wrote",p,len(claims),"claims",len(SRC),"sources")
