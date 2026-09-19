"""HF-M1 holdout re-balance: deterministic local search (seed 7) over the ELIGIBLE pool.
Objective = era-share error + category-share error + the six aesthetic KS/critical ratios.
Eligibility mirrors HF-4c's own stated rules: no scrub-list plate, no A/B or
figure-derivation plate, no specification sheet, no 'best in corpus' claim."""
import json, random, statistics as st, collections, math
rows=json.load(open("laneHFM1-corpus-measured.json")); R={r["id"]:r for r in rows}
HOLD=set("""hf87 hf89 hf92 hf94 hf126 hf127 hf231 hf237 hf285 hf129 hf130 hf132 hf240 hf267 hf269 hf272
hf275 hf288 hf333 hf134 hf136 hf273 hf289 hf326 hf346 hf102 hf105 hf143 hf145 hf147 hf221 hf223
hf230 hf349 hf354 hf122 hf259 hf265 hf266 hf311 hf168 hf172 hf234 hf282 hf176 hf180 hf183 hf191
hf192 hf195 hf294 hf312 hf200""".split())
SCRUB=set("""hf375 hf292 hf348 hf190 hf170 hf318 hf368 hf383 hf372 hf374 hf329 hf350 hf356 hf361
hf351 hf353 hf328 hf249 hf284 hf296 hf287 hf341 hf314 hf253 hf299 hf357 hf171 hf148 hf268 hf306
hf309 hf310 hf295 hf298 hf149 hf286 hf263 hf141 hf144 hf151 hf167 hf173""".split())
AB=set("""hf135 hf139 hf140 hf142 hf262 hf316 hf317 hf318 hf329 hf373 hf337 hf387 hf347 hf385 hf248
hf276 hf280 hf302 hf256 hf277 hf194 hf198 hf131 hf137 hf133 hf138 hf169 hf218 hf241 hf90
hf10 hf24 hf57 hf254 hf255 hf300""".split())
SPEC=set("""hf303 hf320 hf321 hf322 hf377 hf323 hf304 hf379 hf319 hf378 hf388 hf386 hf376 hf305 hf313
hf314 hf315 hf390 hf206 hf207 hf208 hf71 hf112 hf113 hf114 hf115 hf116 hf261""".split())
BEST=set("hf303 hf338 hf389 hf386 hf379 hf327 hf356 hf360 hf291 hf348".split())
BAD=SCRUB|AB|SPEC|BEST
pool=[r["id"] for r in rows if r["id"] not in BAD]
print("eligible pool:",len(pool),"  current holdout inside pool:",len(HOLD&set(pool)),"of",len(HOLD))
AX=["register_index","paper_L","chroma","wash_within_sigma","fill_tone_iqr","ink_L","stroke_ratio_p90_p25"]
allrows=rows
era_share=collections.Counter(r["era"] for r in allrows)
cat_share=collections.Counter(r["category"] for r in allrows)
N=53
def ks(a,b):
    a=sorted(x for x in a if x is not None); b=sorted(x for x in b if x is not None)
    if not a or not b: return 0,1
    d=max(abs(sum(1 for x in a if x<=v)/len(a)-sum(1 for x in b if x<=v)/len(b)) for v in sorted(set(a+b)))
    return d, 1.36*math.sqrt(1.0/len(a)+1.0/len(b))
def score(S):
    H=[R[h] for h in S]; R_=[r for r in allrows if r["id"] not in S]
    s=0.0
    ec=collections.Counter(r["era"] for r in H)
    for e,c in era_share.items(): s += 3.0*abs(ec.get(e,0)/N - c/len(allrows))
    cc=collections.Counter(r["category"] for r in H)
    for c_,c in cat_share.items(): s += 1.5*abs(cc.get(c_,0)/N - c/len(allrows))
    for f in AX:
        d,crit=ks([r[f] for r in H],[r[f] for r in R_]); s += max(0.0,d/crit-0.6)*2.0
    return s
random.seed(7)
S=set(list(HOLD&set(pool)))
while len(S)<N: S.add(random.choice([p for p in pool if p not in S]))
cur=score(S)
for it in range(60000):
    out=random.choice(list(S)); inn=random.choice(pool)
    if inn in S: continue
    T=set(S); T.remove(out); T.add(inn)
    sc=score(T)
    if sc<cur: S, cur = T, sc
print("final objective %.4f"%cur)
S=sorted(S,key=lambda x:int(x[2:]))
H=[R[h] for h in S]; R_=[r for r in allrows if r["id"] not in set(S)]
print("\nPROPOSED HOLDOUT (n=%d):"%len(S))
print("  era:", dict(sorted(collections.Counter(r["era"] for r in H).items())))
print("  cat:", dict(collections.Counter(r["category"] for r in H).most_common()))
for f in AX:
    d,c=ks([r[f] for r in H],[r[f] for r in R_])
    print("   %-22s hold %8.2f rest %8.2f  KS %.3f / crit %.3f  %s"%(f,
      st.median([r[f] for r in H if r[f] is not None]),st.median([r[f] for r in R_ if r[f] is not None]),
      d,c,"DIFFERENT" if d>c else "ok"))
kept=sorted(set(S)&HOLD,key=lambda x:int(x[2:])); added=sorted(set(S)-HOLD,key=lambda x:int(x[2:])); dropped=sorted(HOLD-set(S),key=lambda x:int(x[2:]))
print("\nKEPT (%d): %s"%(len(kept)," ".join(kept)))
print("\nADDED (%d): %s"%(len(added)," ".join("%s[%s,%s]"%(a,R[a]["era"],R[a]["category"]) for a in added)))
print("\nDROPPED (%d): %s"%(len(dropped)," ".join("%s[%s,%s]"%(a,R[a]["era"],R[a]["category"]) for a in dropped)))
json.dump({"proposed":S,"kept":kept,"added":added,"dropped":dropped}, open("laneHFM1-holdout-proposal.json","w"), indent=1)
