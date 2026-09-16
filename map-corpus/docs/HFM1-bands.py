import json, statistics as st, collections
rows=json.load(open("laneHFM1-corpus-measured.json"))
AES12={"hf3","hf13","hf20","hf34","hf35","hf40","hf50","hf56","hf58","hf60","hf62","hf72"}
ORIG49={r["id"] for r in rows if r["era"]=="HF-1"}
def stats(vals):
    v=sorted(x for x in vals if x is not None)
    if not v: return None
    n=len(v); p=lambda f: v[min(n-1,int(n*f))]
    return {"n":n,"min":v[0],"p5":p(.05),"p10":p(.10),"p25":p(.25),"med":st.median(v),
            "p75":p(.75),"p90":p(.90),"p95":p(.95),"max":v[-1]}
def fmt(s):
    if not s: return "n=0"
    return "n=%d  min %.2f | p5 %.2f | p25 %.2f | MED %.2f | p75 %.2f | p95 %.2f | max %.2f"%(
        s["n"],s["min"],s["p5"],s["p25"],s["med"],s["p75"],s["p95"],s["max"])
FIELDS=["paper_L","ink_L","L_range_1_99","value_range_pal8","chroma","paper_grain_sigma",
        "wash_within_sigma","wash_within_sigma_p90","fill_tone_iqr","stroke_p25","stroke_p50",
        "stroke_p75","stroke_p90","stroke_ratio_p90_p25"]
sets={"ALL313":rows,"ORIG49":[r for r in rows if r["id"] in ORIG49],
      "MFS1-AES12":[r for r in rows if r["id"] in AES12],
      "NEW264":[r for r in rows if r["id"] not in ORIG49],
      "HF4c78":[r for r in rows if r["era"]=="HF-4c"]}
for f in FIELDS:
    print("### "+f)
    for k,rs in sets.items():
        print("   %-11s %s"%(k, fmt(stats(r[f] for r in rs))))
