#!/usr/bin/env python3
"""Run the plan-graph instrument over the HAND-SET window table."""
import importlib.util, json, os, sys, traceback

HERE = os.path.dirname(os.path.abspath(__file__))
CORP = os.path.dirname(HERE)

def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

PG = load_module("mfs3a_plangraph", os.path.join(HERE, "MFS3a-plangraph.py"))
fr=json.load(open(os.path.join(HERE, "MFS3a-frame.json")))["plates"]
wins=json.load(open(os.path.join(HERE, "MFS3a-windows.json")))
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
output_path=os.path.join(HERE,"MFS3a-planmetrics.json")
if "--write" in sys.argv:
    temp=output_path+".tmp"
    with open(temp,"w") as handle:
        json.dump(rows,handle,indent=1)
        handle.write("\n")
    os.replace(temp,output_path)
    print("\nwrote MFS3a-planmetrics.json  n=",len(rows))
else:
    expected=json.load(open(output_path))
    if expected != rows:
        raise SystemExit("MFS3a-planmetrics.json DRIFT — inspect before --write")
    print("\nMFS3a-planmetrics.json MATCHES — dry run, no write  n=",len(rows))
