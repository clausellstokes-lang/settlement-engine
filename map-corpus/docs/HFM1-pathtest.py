import importlib.util, json, time, os
spec = importlib.util.spec_from_file_location("mfs1", "MFS1-measure.py")
M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
old = {r["file"]: r for r in json.load(open("MFS1-metrics.json"))}
KEYS = ["paper_L","paper_hex","ink_hex","value_range_L","mean_chroma","built_share_frame",
        "core_centroid_norm","r50_r80_blocks","open_share_in_core","dense_share_in_core","center_edge_ratio"]
for name in ["hf10-thorp-plains","hf34-metropolis-capital","hf50-lens-watercolor","hf40-slum-fringe-city"]:
    o = old[name]
    for tag, p in [("A_1500prev","MFS1-prev/%s.jpg"%name),
                   ("B_1100prev","map-refs/prev-%s.jpg"%name),
                   ("C_fullpng","map-refs/%s.png"%name)]:
        t=time.time(); r = M.analyze(p, None); dt=time.time()-t
        print(name, tag, "%.1fs"%dt)
        for k in KEYS:
            if r.get(k) != o.get(k):
                print("   DIFF", k, "old=",o.get(k), "new=",r.get(k))
