#!/usr/bin/env python3
"""HF-M1 GRAIN v2 — MFS1-grain2.py's measurement kernel, UNCHANGED, with windows
RE-SET per plate (atlas §2.8.3: the windows are the analyst's eye-bounds and a later
lane must re-set them or the numbers are meaningless).

Two job sets:
  REPRO  = MF-S1's 22 original corpus windows verbatim -> proves instrument equivalence
  NEW    = HF-M1's own eye-set windows, read off a decile-gridded render of each plate
           (HFM1-grid.py). Windows are [E]; everything inside them is [M].
"""
import json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.dirname(HERE)

REPRO = [
 ("hf10-thorp-plains",.36,.38,.63,.70,"thorp"), ("hf12-thorp-coastal",.30,.34,.72,.78,"thorp"),
 ("hf11-hamlet-forest",.33,.33,.66,.72,"hamlet"), ("hf3-village-organic",.30,.28,.66,.72,"village"),
 ("hf13-village-fishing",.28,.28,.74,.74,"village"), ("hf16-village-cold",.18,.34,.84,.70,"village"),
 ("hf17-village-wealthy",.30,.24,.72,.78,"village"), ("hf59-monster-watch",.18,.34,.66,.88,"village"),
 ("hf20-town-trade",.22,.10,.80,.92,"town"), ("hf21-town-temple",.18,.14,.86,.90,"town"),
 ("hf23-town-struggling",.14,.12,.88,.90,"town"), ("hf27-town-unrest",.12,.10,.90,.92,"town"),
 ("hf58-martial-law",.12,.10,.90,.90,"town"), ("hf60-spymaster-copy",.14,.08,.88,.92,"town"),
 ("hf62-bankside-town",.10,.08,.88,.62,"town"), ("hf72-dumbbell-town",.10,.22,.92,.90,"town"),
 ("hf30-city-river",.10,.08,.92,.92,"city"), ("hf33-city-chaos-warren",.10,.08,.92,.92,"city"),
 ("hf50-lens-watercolor",.12,.08,.90,.92,"city"), ("hf40-slum-fringe-city",.10,.08,.92,.92,"city"),
 ("hf34-metropolis-capital",.06,.06,.95,.95,"metropolis"), ("hf4-planned-city",.12,.08,.90,.92,"city"),
]
NEW = [
 # THORP — the rung MF-S1 measured at n=1
 ("hf10-thorp-plains",      .13,.31,.45,.70,"thorp","MF-S1's window sat EAST of the cluster, mostly open field"),
 ("hf85-thorp-riverside",   .20,.20,.87,.72,"thorp",""),
 ("hf86-thorp-upland",      .19,.25,.85,.72,"thorp",""),
 ("hf87-thorp-forest-edge", .24,.14,.72,.66,"thorp","clearing; canopy inside the window"),
 ("hf88-thorp-crossroads",  .20,.13,.80,.60,"thorp",""),
 ("hf89-thorp-coastal",     .26,.08,.92,.62,"thorp",""),
 ("hf90-thorp-plains",      .11,.10,.88,.78,"thorp","dispersed open-field thorp; furlong hatching inside window"),
 # HAMLET — the rung MF-S1 could not measure cleanly at all
 ("hf11-hamlet-forest",     .30,.15,.72,.76,"hamlet","canopy stipple unavoidable"),
 ("hf91-hamlet-green",      .25,.12,.76,.80,"hamlet",""),
 ("hf92-hamlet-mill",       .34,.03,.76,.95,"hamlet",""),
 ("hf93-hamlet-street",     .08,.08,.92,.72,"hamlet",""),
 ("hf94-hamlet-crossroads", .20,.06,.85,.72,"hamlet",""),
 ("hf95-hamlet-riverside",  .10,.10,.90,.50,"hamlet",""),
 ("hf96-hamlet-upland",     .22,.18,.72,.72,"hamlet",""),
 # VILLAGE top-up
 ("hf125-village-oasis",    .10,.13,.87,.85,"village",""),
 ("hf126-village-terrace",  .23,.28,.72,.63,"village",""),
 ("hf127-village-marsh",    .18,.15,.78,.72,"village",""),
 ("hf128-village-steppe",   .28,.20,.80,.80,"village","dispersed corral settlement"),
 # TOWN top-up
 ("hf316-town-many-names-AB",.15,.07,.82,.78,"town",""),
 ("hf318-town-unequal-circuit-AB",.17,.05,.92,.82,"town",""),
 ("hf324-town-bastide-halffilled",.10,.06,.92,.90,"town","half-taken-up plots"),
 ("hf373-town-hilltown-CURE329",.18,.10,.90,.82,"town",""),
 # CITY top-up
 ("hf134-city-delta",       .14,.05,.80,.90,"city",""),
 ("hf139-city-desert-clean",.07,.08,.92,.88,"city",""),
 ("hf235-city-canals",      .18,.03,.96,.88,"city",""),
 ("hf327-city-mudbrick-river-caravan",.06,.10,.85,.90,"city",""),
 # METROPOLIS — the other rung MF-S1 measured at n=1
 ("hf34-metropolis-capital",.17,.04,.89,.92,"metropolis","re-set tight to the walled fabric"),
 ("hf100-metropolis-confluence",.06,.03,.88,.95,"metropolis",""),
 ("hf101-metropolis-port",  .03,.02,.90,.80,"metropolis","harbour water inside the box"),
 ("hf102-metropolis-sacred",.06,.04,.92,.84,"metropolis",""),
 ("hf103-metropolis-rings", .08,.04,.80,.85,"metropolis",""),
 ("hf104-metropolis-caravan",.17,.04,.83,.88,"metropolis",""),
 ("hf105-metropolis-ribbon",.03,.04,.95,.92,"metropolis","RIBBON: cross-axis box; cartouche in NE corner"),
 ("hf374-city-unequal-circuit-metropolis",.04,.06,.92,.90,"metropolis",""),
 ("hf389-city-metropolis-wallshape",.03,.10,.90,.95,"metropolis",""),
]

def measure(path, x0, y0, x1, y1):
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
        runs.append((c*ww/float(wh), ww))
    vals = sorted(r for r, _ in runs)
    med = vals[len(vals)//2]; p25 = vals[len(vals)//4]; p75 = vals[3*len(vals)//4]
    return {"cells_across_p25_p50_p75":[round(p25,1),round(med,1),round(p75,1)],
            "cell_pitch_px": round(ww/max(med,1e-6),1),
            "est_parcels_if_square": int(round(med*med*0.6))}

out=[]
for job in REPRO:
    stem,x0,y0,x1,y1,band = job
    r = measure(os.path.join(CORPUS,"plates","%s.png"%stem), x0,y0,x1,y1)
    r.update({"file":stem,"band":band,"set":"REPRO","window":[x0,y0,x1,y1],"note":""}); out.append(r)
for job in NEW:
    stem,x0,y0,x1,y1,band,note = job
    r = measure(os.path.join(CORPUS,"plates","%s.png"%stem), x0,y0,x1,y1)
    r.update({"file":stem,"band":band,"set":"NEW","window":[x0,y0,x1,y1],"note":note}); out.append(r)
output_path=os.path.join(HERE,"HFM1-grain2.json")
if "--write" in sys.argv:
    temp=output_path+".tmp"
    with open(temp,"w") as handle:
        json.dump(out,handle,indent=1)
        handle.write("\n")
    os.replace(temp,output_path)
    print("wrote",output_path,"rows",len(out))
else:
    print(json.dumps(out,indent=1))
    print("DRY RUN — pass --write to persist; rows",len(out))
