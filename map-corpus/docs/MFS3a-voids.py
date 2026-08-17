#!/usr/bin/env python3
"""MF-S3a WIDTH / GRAIN / VOID instrument (companion to MFS3a_plangraph).

GRAIN      cell pitch from dark-run counts on 120 h + 120 v scans inside the
           HAND-SET window (the MFS1-grain2 kernel, re-implemented so the
           window is explicit).  cells_across = window width / median pitch.
           !! At thorp/hamlet tier this counts hedges and furrows, not
           buildings (ODQ 244.5).  Rows below village carry grain_valid:false.
WIDTH      the street mask's local WIDTH via the distance transform sampled on
           the skeleton, x2, normalised to the plate's cell pitch -> street
           width in PLOT-WIDTHS, directly comparable to atlas T-04/T-09.
           Percentiles give the route hierarchy; p97/p50 is the hierarchy depth.
VOIDS      street-space components, and within the main component the WIDE
           parts (distance transform above a plot-width) -> squares/markets.
           Reported as: void count, largest void area in plot-widths squared,
           and the share of street area sitting in voids rather than channels.
           A CENTER is a void; polycentricity is >1 large well-separated void.
"""
import os, json, math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, remove_small_objects, remove_small_holes, binary_opening, binary_closing, disk

def analyse(path, window, longside=1600):
    im = Image.open(path).convert("RGB"); w,h = im.size
    im = im.resize((longside,int(round(h*longside/w))), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32); L = a.mean(2)
    H,W = L.shape
    x0,y0,x1,y1 = int(window[0]*W),int(window[1]*H),int(window[2]*W),int(window[3]*H)
    Lw = L[y0:y1, x0:x1]
    wh, ww = Lw.shape
    out = {"win_px":[int(ww),int(wh)]}
    # ---- GRAIN: dark-run pitch (MFS1-grain2 kernel, explicit window)
    runs=[]
    for k in range(120):
        yy=int(wh*(k+.5)/120); row=Lw[yy]
        thr=row.mean()-30; c=0; inr=False
        for v in row:
            if v<thr and not inr: c+=1; inr=True
            elif v>=thr: inr=False
        runs.append(c)
    for k in range(120):
        xx=int(ww*(k+.5)/120); col=Lw[:,xx]
        thr=col.mean()-30; c=0; inr=False
        for v in col:
            if v<thr and not inr: c+=1; inr=True
            elif v>=thr: inr=False
        runs.append(c*ww/float(wh))
    runs=np.array(sorted(runs),float)
    med=float(np.median(runs))
    pitch = ww/max(med,1e-6)
    out.update(cells_across_p50=round(med,1),
               cells_across_p25=round(float(np.percentile(runs,25)),1),
               cells_across_p75=round(float(np.percentile(runs,75)),1),
               cell_pitch_px=round(pitch,2))
    # ---- STREET mask inside the window (same rule as the plan-graph tool)
    wq=int(0.075*longside)|1
    loc=ndi.uniform_filter(L,size=wq)
    st_full = L > (loc+12)
    st_full = binary_closing(st_full, disk(2))
    st_full = remove_small_holes(st_full, max(400,longside//3))
    st_full = binary_opening(st_full, disk(3))
    st = np.zeros_like(st_full); st[y0:y1,x0:x1]=st_full[y0:y1,x0:x1]
    st = remove_small_objects(st, max(200,longside//3))
    if st.sum() < 300:
        out["degenerate"]=True; return out
    dt = ndi.distance_transform_edt(st)
    sk = skeletonize(st)
    widths = 2.0*dt[sk]
    widths = widths[widths>0]/max(pitch,1e-6)
    if len(widths)>20:
        q=lambda f: round(float(np.percentile(widths,f)),3)
        out.update(width_plotwidths_p25=q(25), width_plotwidths_p50=q(50),
                   width_plotwidths_p75=q(75), width_plotwidths_p90=q(90),
                   width_plotwidths_p97=q(97), width_plotwidths_p99=q(99),
                   hierarchy_p97_over_p50=round(q(97)/max(q(50),1e-6),2),
                   hierarchy_p90_over_p25=round(q(90)/max(q(25),1e-6),2))
    # ---- VOIDS: places where the street space is wider than ~1.6 plot widths
    void = dt > (1.6*pitch/2.0)
    void = remove_small_objects(void, max(40,int((pitch*1.2)**2)))
    vl,vn = ndi.label(void)
    if vn:
        areas = ndi.sum(void, vl, range(1,vn+1))/ (pitch**2)   # in plot-widths^2
        areas = np.sort(areas)[::-1]
        big = areas[areas >= 4.0]     # at least 2x2 plot-widths of open ground
        out.update(void_n_ge4pw2=int(len(big)),
                   void_largest_pw2=round(float(areas[0]),2) if len(areas) else 0.0,
                   void_2nd_pw2=round(float(areas[1]),2) if len(areas)>1 else 0.0,
                   void_area_share_of_street=round(float(void.sum())/float(st.sum()),4),
                   void_2nd_over_1st=round(float(areas[1]/areas[0]),3) if len(areas)>1 else 0.0)
    out["street_share_of_window"]=round(float(st[y0:y1,x0:x1].mean()),4)
    return out

if __name__=="__main__":
    CORP="/Users/cstokes/Desktop/settlement-engine/map-corpus"
    fr=json.load(open("MFS3a-frame.json"))["plates"]
    wins=json.load(open("MFS3a-windows.json"))
    rows=[]
    for key,w in wins.items():
        if key.startswith("_"): continue
        pid=key.split("@")[0]
        if pid not in fr: continue
        r=analyse(os.path.join(CORP,"plates",fr[pid]["file"]), tuple(w))
        r.update(key=key, plate=pid, part=key.split("@")[1] if "@" in key else "whole",
                 category=fr[pid]["category"], tier=fr[pid]["tier"])
        r["grain_valid"] = fr[pid]["tier"] not in ("thorp","hamlet")
        rows.append(r)
        print(f"{key:20s} cells {r.get('cells_across_p50','-'):>6} pitch {r.get('cell_pitch_px','-'):>6} "
              f"w50 {r.get('width_plotwidths_p50','-'):>6} w97 {r.get('width_plotwidths_p97','-'):>6} "
              f"hier {r.get('hierarchy_p97_over_p50','-'):>6} voids {r.get('void_n_ge4pw2','-'):>4} "
              f"v1 {r.get('void_largest_pw2','-'):>8} v2/v1 {r.get('void_2nd_over_1st','-')}")
    json.dump(rows, open("MFS3a-voidmetrics.json","w"), indent=1)
    print("\nwrote MFS3a-voidmetrics.json n=",len(rows))
