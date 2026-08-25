import importlib.util, json, time, os
HERE = os.path.dirname(os.path.abspath(__file__))
refs = os.path.join(HERE, "MFS1-aes-refs.json")
if not os.path.exists(refs):
    raise SystemExit("UNAVAILABLE — archived reference input is absent: " + refs)
spec = importlib.util.spec_from_file_location("aes", os.path.join(HERE, "MFS1-aesthetic.py"))
A = importlib.util.module_from_spec(spec); spec.loader.exec_module(A)
old = {r["file"]: r for r in json.load(open(refs))}
print("archived aes files:", sorted(old))
for name in ["hf3-village-organic.png","hf72-dumbbell-town.png"]:
    t=time.time(); r = A.measure(os.path.join(os.path.dirname(HERE), "plates", name)); dt=time.time()-t
    o = old[name]
    same = all(r.get(k)==o.get(k) for k in o)
    print(name, "%.1fs"%dt, "EXACT_MATCH" if same else "DIFF")
    if not same:
        for k in o:
            if r.get(k)!=o.get(k): print("   ",k,o.get(k),"->",r.get(k))
