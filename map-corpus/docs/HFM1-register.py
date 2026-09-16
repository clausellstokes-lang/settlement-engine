"""HF-M1 composite REGISTER INDEX (HF-M1's own construction, not an MF-S1 instrument).
Mean percentile rank over the five DIRECTIONAL hand/ink axes the atlas §2.3 names:
  ink_L (lower better)  wash_within_sigma  paper_grain_sigma  fill_tone_iqr
  stroke_ratio_p90_p25  (all higher better)
Chroma is deliberately EXCLUDED: the atlas states colour is not what carries the
information (hf40 reads cleanest at chroma 27.8).

Read-only by default. --write updates JSON and CSV from one in-memory result;
the corpus integrity gate then proves semantic parity.
"""
import csv, json, statistics as st, collections, os, sys
HERE=os.path.dirname(os.path.abspath(__file__))
JSON_PATH=os.path.join(HERE,"laneHFM1-corpus-measured.json")
CSV_PATH=os.path.join(HERE,"laneHFM1-corpus-measured.csv")
rows=json.load(open(JSON_PATH))
AX=[("ink_L",-1),("wash_within_sigma",1),("paper_grain_sigma",1),("fill_tone_iqr",1),("stroke_ratio_p90_p25",1)]
for f,d in AX:
    vals=sorted(r[f] for r in rows if r[f] is not None)
    n=len(vals)
    for r in rows:
        v=r[f]
        if v is None: r["pr_"+f]=None; continue
        rank=sum(1 for x in vals if x<v)+0.5*sum(1 for x in vals if x==v)
        pr=rank/n
        r["pr_"+f]= pr if d>0 else 1-pr
for r in rows:
    ps=[r["pr_"+f] for f,_ in AX if r["pr_"+f] is not None]
    r["register_index"]=round(100*sum(ps)/len(ps),1)
R={r["id"]:r for r in rows}
def med(rs,f): 
    v=[x[f] for x in rs if x[f] is not None]; return st.median(v) if v else float("nan")
print("=== REGISTER INDEX by star, WITHIN era (de-confounding) ===")
for e in ["HF-1","HF-2","HF-3","HF-4b","HF-4c"]:
    rs=[r for r in rows if r["era"]==e]
    line="%-6s n=%3d overall %5.1f |"%(e,len(rs),med(rs,"register_index"))
    for s in [3,2,1,0]:
        sub=[r for r in rs if r["stars"]==s]
        line+="  %d★:%s(n=%d)"%(s, "%5.1f"%med(sub,"register_index") if sub else "  -  ", len(sub))
    print(line)
print("\n=== REGISTER INDEX by category (median) ===")
for c,_ in collections.Counter(r["category"] for r in rows).most_common():
    rs=[r for r in rows if r["category"]==c]
    print("  %-12s n=%3d  %5.1f"%(c,len(rs),med(rs,"register_index")))
print("\n=== TOP 20 register index ===")
for r in sorted(rows,key=lambda r:-r["register_index"])[:20]:
    print("  %-6s %-34s %-11s %d★ %5.1f  inkL %5.1f washσ %s grain %s IQR %s ratio %s"%(
        r["id"],r["stem"][:34],r["category"],r["stars"],r["register_index"],r["ink_L"],r["wash_within_sigma"],r["paper_grain_sigma"],r["fill_tone_iqr"],r["stroke_ratio_p90_p25"]))
print("\n=== BOTTOM 20 register index ===")
for r in sorted(rows,key=lambda r:r["register_index"])[:20]:
    print("  %-6s %-34s %-11s %d★ %5.1f  inkL %5.1f washσ %s grain %s IQR %s ratio %s"%(
        r["id"],r["stem"][:34],r["category"],r["stars"],r["register_index"],r["ink_L"],r["wash_within_sigma"],r["paper_grain_sigma"],r["fill_tone_iqr"],r["stroke_ratio_p90_p25"]))

if "--write" in sys.argv:
    with open(CSV_PATH,newline="") as handle:
        reader=csv.DictReader(handle)
        fieldnames=list(reader.fieldnames or [])
        csv_rows=list(reader)
    by_id={r["id"]:r for r in rows}
    update_fields=["pr_"+f for f,_ in AX]+["register_index"]
    if not all(field in fieldnames for field in update_fields):
        raise SystemExit("CSV is missing register-index output fields")
    for csv_row in csv_rows:
        source=by_id[csv_row["id"]]
        for field in update_fields:
            value=source.get(field)
            csv_row[field]="" if value is None else value
    json_tmp=JSON_PATH+".tmp"
    csv_tmp=CSV_PATH+".tmp"
    with open(json_tmp,"w") as handle:
        json.dump(rows,handle,indent=1)
        handle.write("\n")
    with open(csv_tmp,"w",newline="") as handle:
        writer=csv.DictWriter(handle,fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_rows)
    os.replace(json_tmp,JSON_PATH)
    os.replace(csv_tmp,CSV_PATH)
    print("wrote JSON + CSV; run corpus_integrity.py to prove parity")
else:
    print("\nDRY RUN — registers not written; pass --write to update JSON + CSV")
