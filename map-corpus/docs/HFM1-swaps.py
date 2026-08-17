import json, statistics as st, collections, math
rows=json.load(open("laneHFM1-corpus-measured.json")); R={r["id"]:r for r in rows}
HOLD="""hf87 hf89 hf92 hf94 hf126 hf127 hf231 hf237 hf285 hf129 hf130 hf132 hf240 hf267 hf269 hf272
hf275 hf288 hf333 hf134 hf136 hf273 hf289 hf326 hf346 hf102 hf105 hf143 hf145 hf147 hf221 hf223
hf230 hf349 hf354 hf122 hf259 hf265 hf266 hf311 hf168 hf172 hf234 hf282 hf176 hf180 hf183 hf191
hf192 hf195 hf294 hf312 hf200""".split()
for e in ["HF-1","HF-2","HF-3","HF-4b","HF-4c"]:
    print("%-6s in holdout: %s"%(e," ".join(h for h in HOLD if R[h]["era"]==e)))
DROP = ["hf223","hf230","hf231","hf168","hf240","hf145","hf147","hf143","hf183","hf176","hf221","hf192",
        "hf122","hf259",
        "hf289","hf273","hf267"]
ADD  = ["hf20","hf17","hf62","hf31","hf53","hf37","hf36","hf5",
        "hf334","hf331","hf344","hf355","hf364","hf352","hf335","hf358","hf342"]
NEW = [h for h in HOLD if h not in DROP] + ADD
print("\nproposed: drop %d add %d -> n=%d (distinct %d)"%(len(DROP),len(ADD),len(NEW),len(set(NEW))))
for tag,S in [("CURRENT",HOLD),("PROPOSED",NEW)]:
    print("\n=== %s ==="%tag)
    H=[R[h] for h in S]; Rest=[r for r in rows if r["id"] not in set(S)]
    print("  era :", {k:v for k,v in sorted(collections.Counter(r["era"] for r in H).items())})
    print("  cat :", dict(collections.Counter(r["category"] for r in H).most_common()))
    def ks(a,b):
        a=sorted(x for x in a if x is not None); b=sorted(x for x in b if x is not None)
        d=max(abs(sum(1 for x in a if x<=v)/len(a)-sum(1 for x in b if x<=v)/len(b)) for v in sorted(set(a+b)))
        return d, 1.36*math.sqrt(1.0/len(a)+1.0/len(b))
    for f in ["register_index","paper_L","chroma","wash_within_sigma","fill_tone_iqr","ink_L"]:
        d,c=ks([r[f] for r in H],[r[f] for r in Rest])
        print("   %-20s hold med %7.2f rest %7.2f  KS %.3f/%.3f %s"%(f,
            st.median([r[f] for r in H if r[f] is not None]),
            st.median([r[f] for r in Rest if r[f] is not None]),d,c,"DIFFERENT" if d>c else "ok"))
