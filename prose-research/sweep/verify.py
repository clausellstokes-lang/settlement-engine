import json
m={
"https://www.theverge.com/24065145/ai-obituary-spam-generative-clickbait":"bio-verge.txt",
"https://www.wired.com/story/morbid-war-online-obituaries/":"bio-wired-morbid.txt",
"https://www.wired.com/story/youtube-obituary-pirates/":"bio-wired-yt.txt",
"https://www.legalgenealogist.com/2026/05/12/ai-meets-tos/":"lg-aitos.txt",
"https://www.wikitree.com/g2g/1665597/should-wikitree-have-a-style-guide-for-ai-generated-content":"wt-styleguide.txt",
"https://www.wikitree.com/g2g/2021670/should-become-official-wikitree-policy-generated-enhanced":"wt-policy.txt",
"https://vitabrevis.americanancestors.org/-ai-in-genealogical-research":"va-ai.txt",
"https://www.amyjohnsoncrow.com/using-chatgpt-for-genealogy-accurately/":"ajc.txt",
"https://familylocket.com/can-chatgpt-help-with-genealogy-citations/":"fl-cit.txt",
"https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing":"wp-signs.txt",
"https://www.familysearch.org/en/blog/ai-developments-genealogy":"fs-ai.txt",
}
d=json.load(open("found-ai-arch-biographical-record.json"))
cache={}
bad=0
for i,c in enumerate(d["claims"]):
    q=c.get("quote","")
    if not q: continue
    f=m.get(c["url"])
    if not f: print("NOFILE",i,c["url"]); continue
    if f not in cache: cache[f]=open(f,encoding="utf-8").read()
    if q not in cache[f]:
        bad+=1
        print("MISS",i,"|",c["source"][:45],"|",repr(q))
print("total quotes checked; misses:",bad)
