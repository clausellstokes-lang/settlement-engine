import json,sys
m=json.load(open("mine.json"))
b=json.load(open(sys.argv[1]))
m["sourcesRead"]+=b.get("sourcesRead",[])
m["claims"]+=b.get("claims",[])
if "coverage" in b: m["coverage"]=b["coverage"]
if "complete" in b: m["complete"]=b["complete"]
json.dump(m,open("mine.json","w"),indent=1,ensure_ascii=False)
print("mine now",len(m["claims"]),"claims",len(m["sourcesRead"]),"sources")
