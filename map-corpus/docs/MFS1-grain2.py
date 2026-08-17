#!/usr/bin/env python3
"""GRAIN v2 -- hand-set windows drawn to the SETTLEMENT BOUNDING BOX.
Window fractions are the analyst's eye-set bounds of the built fabric (recorded
per row); everything inside is MEASURED: 90 h + 90 v scans, dark-run counts,
cell pitch = window width / median runs, cells_across = window width / pitch.
Calibration check performed on hf72 + hf40 native crops: one dark run == one
plot/building footprint to within ~8%, so cells_across ~= buildings across.
"""
import sys, json, os
from PIL import Image

JOBS = [
 # path, x0,y0,x1,y1 (fractions of plate), label
 ("map-refs/hf10-thorp-plains.png",       .36,.38,.63,.70, "thorp"),
 ("map-refs/hf12-thorp-coastal.png",      .30,.34,.72,.78, "thorp"),
 ("map-refs/hf11-hamlet-forest.png",      .33,.33,.66,.72, "hamlet"),
 ("map-refs/hf3-village-organic.png",     .30,.28,.66,.72, "village"),
 ("map-refs/hf13-village-fishing.png",    .28,.28,.74,.74, "village"),
 ("map-refs/hf16-village-cold.png",       .18,.34,.84,.70, "village"),
 ("map-refs/hf17-village-wealthy.png",    .30,.24,.72,.78, "village"),
 ("map-refs/hf59-monster-watch.png",      .18,.34,.66,.88, "village"),
 ("map-refs/hf20-town-trade.png",         .22,.10,.80,.92, "town"),
 ("map-refs/hf21-town-temple.png",        .18,.14,.86,.90, "town"),
 ("map-refs/hf23-town-struggling.png",    .14,.12,.88,.90, "town"),
 ("map-refs/hf27-town-unrest.png",        .12,.10,.90,.92, "town"),
 ("map-refs/hf58-martial-law.png",        .12,.10,.90,.90, "town"),
 ("map-refs/hf60-spymaster-copy.png",     .14,.08,.88,.92, "town"),
 ("map-refs/hf62-bankside-town.png",      .10,.08,.88,.62, "town"),
 ("map-refs/hf72-dumbbell-town.png",      .10,.22,.92,.90, "town"),
 ("map-refs/hf30-city-river.png",         .10,.08,.92,.92, "city"),
 ("map-refs/hf33-city-chaos-warren.png",  .10,.08,.92,.92, "city"),
 ("map-refs/hf50-lens-watercolor.png",    .12,.08,.90,.92, "city"),
 ("map-refs/hf40-slum-fringe-city.png",   .10,.08,.92,.92, "city"),
 ("map-refs/hf34-metropolis-capital.png", .06,.06,.95,.95, "metropolis"),
 ("map-refs/hf4-planned-city.png",        .12,.08,.90,.92, "city"),
 ("mf-proto-out/b6/thorp-thorp-parchment.svg.png",   .38,.36,.62,.62, "b6 thorp"),
 ("mf-proto-out/b6/hamlet-hamlet-parchment.svg.png", .36,.34,.68,.66, "b6 hamlet"),
 ("mf-proto-out/b6/village-village-parchment.svg.png",.43,.42,.76,.80, "b6 village"),
 ("mf-proto-out/b6/town-town-parchment.svg.png",     .26,.36,.90,.99, "b6 town"),
 ("mf-proto-out/b6/city-city-parchment.svg.png",     .04,.10,.92,.90, "b6 city"),
 ("mf-proto-out/b6/metropolis-metropolis-parchment.svg.png", .04,.06,.96,.94, "b6 metropolis"),
 ("mf-proto-out/b6/polycentric-town-parchment.svg.png", .10,.20,.92,.92, "b6 town(poly)"),
]

out = []
for path, x0, y0, x1, y1, lab in JOBS:
    if not os.path.exists(path):
        out.append({"file": path, "error": "missing"}); continue
    im = Image.open(path).convert("L")
    W, H = im.size
    win = im.crop((int(W*x0), int(H*y0), int(W*x1), int(H*y1)))
    ww, wh = win.size
    px = win.load()
    runs = []
    for k in range(90):
        y = int(wh*(k+.5)/90); row = [px[x, y] for x in range(ww)]
        thr = sum(row)/len(row) - 30; c=0; inr=False
        for v in row:
            if v < thr and not inr: c+=1; inr=True
            elif v >= thr: inr=False
        runs.append((c, ww))
    for k in range(90):
        x = int(ww*(k+.5)/90); col = [px[x, y] for y in range(wh)]
        thr = sum(col)/len(col) - 30; c=0; inr=False
        for v in col:
            if v < thr and not inr: c+=1; inr=True
            elif v >= thr: inr=False
        runs.append((c*ww/float(wh), ww))   # normalise vertical scans to window width
    vals = sorted(r for r, _ in runs)
    med = vals[len(vals)//2]; p25 = vals[len(vals)//4]; p75 = vals[3*len(vals)//4]
    out.append({"file": os.path.basename(path).replace(".svg.png","").replace(".png",""),
                "band": lab, "window": [x0, y0, x1, y1],
                "cells_across_p25_p50_p75": [round(p25,1), round(med,1), round(p75,1)],
                "cell_pitch_px": round(ww/max(med,1e-6), 1),
                "est_parcels_if_square": int(round(med*med*0.6))})
print(json.dumps(out, indent=1))
