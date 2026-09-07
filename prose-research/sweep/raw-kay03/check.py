import json,re,unicodedata
chunk=json.load(open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/kay-03.json"))
files={"clarkesworldmagazine.com":"clarkesworld","brightweavings.com/patrick":"bw_patrick","therowanwoodchronicles":"rowanwood","lareviewofbooks":"larb","brightweavings.com/ambiguities":"bw_tigana","reactormag":"reactor","steelypips":"steelypips","speculiction":"speculiction"}
def norm(s):
    s=s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("—","-").replace("–","-").replace("…","...")
    s=re.sub(r"\s+"," ",s)
    return s.lower().strip()
texts={k:norm(open(v+".txt",encoding="utf-8").read()) for k,v in files.items()}
for c in chunk["claims"]:
    key=[k for k in files if k in c["url"]][0]
    q=norm(c["quote"])
    hit=q in texts[key]
    # try without trailing period
    hit2=norm(c["quote"].rstrip(".")) in texts[key]
    print(c["index"], key, "EXACT" if hit else ("EXACT_NOPERIOD" if hit2 else "MISS"))
