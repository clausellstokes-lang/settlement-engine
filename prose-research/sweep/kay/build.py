import json, os
OUT="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-kay-academic.json"
SRC="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kay/sources.json"
CLM="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kay/claims.json"
COV="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kay/coverage.txt"
import sys
complete = len(sys.argv)>1 and sys.argv[1]=="final"
d={"complete":complete,
   "coverage":open(COV).read().strip(),
   "sourcesRead":json.load(open(SRC)),
   "claims":json.load(open(CLM))}
json.dump(d,open(OUT,"w"),indent=1,ensure_ascii=False)
print("sources",len(d["sourcesRead"]),"claims",len(d["claims"]),"complete",complete)
