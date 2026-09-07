import json
C=json.load(open("claims_part1.json"))+json.load(open("claims_part2.json"))
rows=json.load(open("all.json")); D={r["n"]:r for r in rows if r["n"] is not None}
def u(n): return D[n]["url"].replace("http://","https://")
SR=[]
def S(title,url,kind,sub,date="",route=""):
    SR.append({"title":title,"url":url,"kind":kind,"substantive":sub,"date":date,"route":route})
S("Geoffrey B. Elliott, 'A Robin Hobb Rereading Series' — the complete corpus, 541 posts tagged hobb-reread, Entry 0 to Entry 539","https://elliottrwi.com/tag/hobb-reread/","analysis",True,"2019-05-24 to 2026-09-02","wordpress.com public REST v1.1 posts endpoint for elliottrwi.com (tag=hobb-reread, fields include content), paginated by page_handle; content verified identical to the curl-fetched rendered page for entry 226")
S("elliottrwi.com sitemap.xml","https://elliottrwi.com/sitemap.xml","measurement",True,"fetched 2026-09-06","curl with browser user agent, HTTP 200; 1001 locs, 420 rereading-series URLs (capped, so 2019-2020 entries absent) — the reason the REST route was used instead")
cited=sorted({n for n in D if any(c["url"]==u(n) for c in C)})
for n in cited:
    S("Elliott, A Robin Hobb Rereading Series, Entry %d — %s"%(n,D[n]["title"].split(":",1)[-1].strip() if ":" in D[n]["title"] else D[n]["title"]),u(n),"analysis",True,D[n]["date"],"wordpress.com REST v1.1 content field; live URL 200 on spot check")
S("Matthew Oliver, 'History in the Margins: Epigraphs and Negative Space in Robin Hobb's Assassin's Apprentice', Mythlore 41.1 (141), pp. 45-66","https://dc.swosu.edu/mythlore/vol41/iss1/4/","analysis",True,"2022-10","open-access PDF on disk at sweep/hobb-raw/oliver-mythlore.pdf; text extracted and searched")
S("Stefan Ekman and Audrey Isabel Taylor, 'Between World and Narrative: Fictional Epigraphs and Critical World-Building', JFA 32.2","https://www.diva-portal.org/smash/get/diva2:1659740/FULLTEXT01.pdf","analysis",True,"2021","PDF on disk at sweep/hobb-acad/ekman-taylor.pdf (earlier lane fetched it via the Wayback raw capture); read for the four functions — it does not discuss Hobb")
S("Geoffrey B. Elliott, 'The Fedwren Project: A Robin Hobb Annotated Bibliography'","https://elliottrwi.com/research/hobb-bibliography/","analysis",True,"fetched 2026-09-06","curl with browser user agent, HTTP 200, 85 KB of text")
S("Jeffrey David Outcalt, 'Extra Credit: Continued Reading for Hobb's Farseer trilogy', Substack","https://jeffreydavidoutcalt.substack.com/p/extra-credit-continued-reading-for","reader",True,"fetched 2026-09-06","curl with browser user agent, HTTP 200")
S("RPG StoryTellers (house byline), 'The Assassin's Canvas: ... Robin Hobb's Farseer Trilogy'","https://rpgstorytellers.com/the-assassins-canvas-a-comprehensive-analysis-of-narrative-interiority-magic-systems-and-cultural-anthropology-in-robin-hobbs-farseer-trilogy/","analysis",False,"fetched 2026-09-06","curl with browser user agent, HTTP 200; uncredited house byline, machine-generated cadence — recorded as a contested secondary, not relied on")
S("Page by Paige, 'The Farseer Trilogy by Robin Hobb'","https://mypagebypaige.com/archives/the-farseer-trilogy-robin-hobb","reader",False,"fetched 2026-09-06","curl with browser user agent, HTTP 200; 0 occurrences of 'epigraph' — nothing on the angle")
out={"complete":False,"coverage":"in progress","sourcesRead":SR,"claims":C}
json.dump(out,open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-hobb-epigraph-census.json","w"),indent=1)
print("sources",len(SR),"claims",len(C))
