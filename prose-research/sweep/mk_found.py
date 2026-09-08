import json, sys
S = "found-dnd-scholarship-history.json"
def write(d):
    open(S,'w').write(json.dumps(d, indent=1, ensure_ascii=False))
