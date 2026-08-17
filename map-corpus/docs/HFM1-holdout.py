import json, statistics as st, collections, math
rows=json.load(open("laneHFM1-corpus-measured.json"))
R={r["id"]:r for r in rows}
HOLD="""hf87 hf89 hf92 hf94 hf126 hf127 hf231 hf237 hf285 hf129 hf130 hf132 hf240 hf267 hf269 hf272
hf275 hf288 hf333 hf134 hf136 hf273 hf289 hf326 hf346 hf102 hf105 hf143 hf145 hf147 hf221 hf223
hf230 hf349 hf354 hf122 hf259 hf265 hf266 hf311 hf168 hf172 hf234 hf282 hf176 hf180 hf183 hf191
hf192 hf195 hf294 hf312 hf200""".split()
SCRUB=set("""hf375 hf292 hf348 hf190 hf170 hf318 hf368 hf383 hf372 hf374 hf329 hf350 hf356 hf361
hf351 hf353 hf328 hf249 hf284 hf296 hf287 hf341 hf314 hf253 hf299 hf357 hf171 hf148 hf268 hf306
hf309 hf310 hf295 hf298""".split())
AB=set("""hf135 hf139 hf140 hf142 hf262 hf316 hf317 hf318 hf329 hf373 hf337 hf387 hf347 hf385 hf248
hf276 hf280 hf302 hf256 hf277 hf194 hf198 hf131 hf137 hf133 hf138 hf169 hf173 hf218 hf241 hf90
hf10 hf24 hf57""".split())
SPEC_EXCL=set("hf303 hf320 hf321 hf322 hf377 hf323 hf304 hf379 hf319 hf378 hf388".split())
print("holdout n=%d  distinct=%d"%(len(HOLD),len(set(HOLD))))
print("all present on disk:", all(h in R for h in HOLD))
print("∩ scrub list:", sorted(set(HOLD)&SCRUB) or "NONE")
print("∩ A/B + figure-derivation:", sorted(set(HOLD)&AB) or "NONE")
print("∩ symbol/scale-contract sheets:", sorted(set(HOLD)&SPEC_EXCL) or "NONE")
H=[R[h] for h in HOLD]; R_=[r for r in rows if r["id"] not in set(HOLD)]
def dist(rs,key):
    c=collections.Counter(r[key] for r in rs); n=len(rs)
    return {k:(v,100.0*v/n) for k,v in c.items()}
print("\n=== CATEGORY representativeness ===")
print("%-12s %6s %6s %6s %6s %7s"%("category","corpus","%","hold","%","delta pp"))
dc=dist(rows,"category"); dh=dist(H,"category")
worst=[]
for k,_ in collections.Counter(r["category"] for r in rows).most_common():
    cn,cp=dc[k]; hn,hp=dh.get(k,(0,0.0))
    worst.append((abs(hp-cp),k,cn,cp,hn,hp))
    print("%-12s %6d %5.1f%% %6d %5.1f%% %+7.1f"%(k,cn,cp,hn,hp,hp-cp))
print("\n=== ERA representativeness (the axis that matters for tuning) ===")
de=dist(rows,"era"); dhe=dist(H,"era")
for k in ["HF-1","HF-2","HF-3","HF-4b","HF-4c"]:
    cn,cp=de[k]; hn,hp=dhe.get(k,(0,0.0))
    print("  %-6s corpus %3d (%4.1f%%)   holdout %2d (%4.1f%%)   delta %+5.1f pp   proportional would be %.1f"%(
        k,cn,cp,hn,hp,hp-cp,cp*len(HOLD)/100))
print("\n=== STAR representativeness ===")
ds=dist(rows,"stars"); dhs=dist(H,"stars")
for k in [3,2,1,0]:
    cn,cp=ds[k]; hn,hp=dhs.get(k,(0,0.0))
    print("  %d★ corpus %3d (%4.1f%%)  holdout %2d (%4.1f%%)  delta %+5.1f pp"%(k,cn,cp,hn,hp,hp-cp))
print("\n=== AESTHETIC AXES: holdout vs the other 260 ===")
F=["register_index","ink_L","L_range_1_99","chroma","paper_grain_sigma","wash_within_sigma","fill_tone_iqr","stroke_ratio_p90_p25","value_range_pal8","paper_L"]
def ks(a,b):
    a=sorted(x for x in a if x is not None); b=sorted(x for x in b if x is not None)
    allv=sorted(set(a+b)); d=0
    for v in allv:
        fa=sum(1 for x in a if x<=v)/len(a); fb=sum(1 for x in b if x<=v)/len(b)
        d=max(d,abs(fa-fb))
    crit=1.36*math.sqrt(1.0/len(a)+1.0/len(b))
    return d, crit
print("%-22s %9s %9s %8s %8s %s"%("axis","hold med","rest med","KS D","crit.05","verdict"))
for f in F:
    hv=[r[f] for r in H if r[f] is not None]; rv=[r[f] for r in R_ if r[f] is not None]
    d,c=ks(hv,rv)
    print("%-22s %9.2f %9.2f %8.3f %8.3f %s"%(f,st.median(hv),st.median(rv),d,c,
        "DIFFERENT" if d>c else "representative"))
