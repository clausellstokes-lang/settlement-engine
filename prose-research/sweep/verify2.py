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
"https://www.washingtonpost.com/technology/2025/08/03/ai-obituaries-funeral-homes/":"wapo.txt",
"https://futurism.com/funeral-homes-chatgpt-obituaries":"fut-funeral.txt",
"https://futurism.com/msn-ai-brandon-hunter-useless":"futurism.txt",
"https://www.poynter.org/commentary/2023/artificial-intelligence-obituary-brandon-hunter-useless/":"poynter.txt",
"https://bcgcertification.org/bcg-ai-portfolio":"bcg.txt",
"https://en.wikipedia.org/wiki/Wikipedia:Large_language_models":"wp-llm.txt",
"https://arxiv.org/abs/2305.14251":"fact-abs.txt",
"https://arxiv.org/pdf/2305.14251":"factscore.txt",
}
d=json.load(open("found-ai-arch-biographical-record.json"))
cache={}; bad=[]
for i,c in enumerate(d["claims"]):
    q=c.get("quote","")
    if not q: continue
    f=m.get(c["url"])
    if not f: print("NOFILE",i,c["url"]); continue
    if f not in cache: cache[f]=open(f,encoding="utf-8").read()
    if q not in cache[f]: bad.append((i,c["url"],q)); print("MISS",i,"|",repr(q))
print("misses:",len(bad),"of",len(d["claims"]))
