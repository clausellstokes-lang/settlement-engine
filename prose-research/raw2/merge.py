import json,sys
base=json.load(open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-ai-critics-direct.json.orig"))
mine=json.load(open("mine.json"))
out={"complete":mine.get("complete",False),
     "coverage":mine.get("coverage",""),
     "sourcesRead":base["sourcesRead"]+mine["sourcesRead"],
     "claims":base["claims"]+mine["claims"]}
p="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-ai-critics-direct.json"
json.dump(out,open(p,"w"),indent=1,ensure_ascii=False)
print("wrote",p,"claims",len(out["claims"]),"sources",len(out["sourcesRead"]))
