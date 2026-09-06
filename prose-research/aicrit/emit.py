import json,os,sys
D=os.path.dirname(os.path.abspath(__file__))
base=json.load(open(os.path.join(D,"base.json")))
extra_path=os.path.join(D,"extra.json")
extra=json.load(open(extra_path)) if os.path.exists(extra_path) else {"sourcesRead":[],"claims":[]}
meta=json.load(open(os.path.join(D,"meta.json")))
out={"complete":meta["complete"],"coverage":meta["coverage"],
     "sourcesRead":base["sourcesRead"]+extra["sourcesRead"],
     "claims":base["claims"]+extra["claims"]}
p=os.path.join(D,"..","sweep","found-ai-critics-direct.json")
tmp=p+".mytmp"
json.dump(out,open(tmp,"w"),indent=1,ensure_ascii=False)
os.replace(tmp,p)
json.dump(out,open(os.path.join(D,"snapshot.json"),"w"),indent=1,ensure_ascii=False)
print("wrote",len(out["claims"]),"claims",len(out["sourcesRead"]),"sources ->",os.path.realpath(p))
