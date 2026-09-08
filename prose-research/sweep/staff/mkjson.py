import json, os, sys
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
def write(d, complete):
    d["complete"]=complete
    with open(os.path.join(BASE,"found-dnd-place-editorial-staff.json"),"w") as f:
        json.dump(d,f,indent=1,ensure_ascii=False)
    print("wrote", len(d["claims"]), "claims", len(d["sourcesRead"]), "sources, complete=",complete)
