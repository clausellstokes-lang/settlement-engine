import importlib.util, json, time
spec = importlib.util.spec_from_file_location("aes", "MFS1-aesthetic.py")
A = importlib.util.module_from_spec(spec); spec.loader.exec_module(A)
old = {r["file"]: r for r in json.load(open("MFS1-aes-refs.json"))}
print("archived aes files:", sorted(old))
for name in ["hf3-village-organic.png","hf72-dumbbell-town.png"]:
    t=time.time(); r = A.measure("map-refs/"+name); dt=time.time()-t
    o = old[name]
    same = all(r.get(k)==o.get(k) for k in o)
    print(name, "%.1fs"%dt, "EXACT_MATCH" if same else "DIFF")
    if not same:
        for k in o:
            if r.get(k)!=o.get(k): print("   ",k,o.get(k),"->",r.get(k))
