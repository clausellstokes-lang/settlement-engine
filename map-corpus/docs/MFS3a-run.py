#!/usr/bin/env python3
"""Run the plan-graph instrument over the HAND-SET window table."""
import json, os, sys, traceback
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import MFS3a_plangraph as PG
CORP="/Users/cstokes/Desktop/settlement-engine/map-corpus"
fr=json.load(open("MFS3a-frame.json"))["plates"]
wins=json.load(open("MFS3a-windows.json"))
rows=[]
for key,w in wins.items():
    if key.startswith("_"): continue
    pid=key.split("@")[0]
    if pid not in fr:
        rows.append({"key":key,"error":"not studiable / holdout"}); continue
    path=os.path.join(CORP,"plates",fr[pid]["file"])
    try:
        r,_=PG.analyse(path,1600,window=tuple(w))
    except Exception as e:
        r={"error":f"{type(e).__name__}: {e}"}; traceback.print_exc()
    r["key"]=key; r["plate"]=pid; r["part"]=key.split("@")[1] if "@" in key else "whole"
    r["category"]=fr[pid]["category"]; r["tier"]=fr[pid]["tier"]; r["stem"]=fr[pid]["stem"]
    rows.append(r)
    print(f"{key:20s} {r.get('graph_nodes','-'):>5} nodes  dead {r.get('deadend_share','-'):>6}  "
          f"TY {r.get('TY_share','-'):>6}  X {r.get('X_share','-'):>6}  phi {r.get('orientation_order_phi','-'):>6}  "
          f"blk {str(r.get('block_n','-')):>4}  green {r.get('backland_green_p50','-')}  {r.get('reason','')}")
json.dump(rows, open("MFS3a-planmetrics.json","w"), indent=1)
print("\nwrote MFS3a-planmetrics.json  n=",len(rows))
