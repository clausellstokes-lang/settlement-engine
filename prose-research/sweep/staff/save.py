import sys, json, os
sys.path.insert(0,'.')
import data
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
complete = len(sys.argv)>1 and sys.argv[1]=="final"
cov = open('coverage.txt').read().strip() if os.path.exists('coverage.txt') else "in progress"
d={"complete":complete,"coverage":cov,"sourcesRead":data.sources,"claims":data.claims}
json.dump(d, open(os.path.join(BASE,"found-dnd-place-editorial-staff.json"),"w"), indent=1, ensure_ascii=False)
print("saved",len(data.claims),"claims",len(data.sources),"sources complete=",complete)
