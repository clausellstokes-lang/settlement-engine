#!/usr/bin/env python3
"""Contact sheet with a PERCENT grid so fabric windows can be hand-set and
recorded as fractions of the plate (the MFS1-grain2 convention)."""
import sys, os
from PIL import Image, ImageDraw
CORP="/Users/cstokes/Desktop/settlement-engine/map-corpus"
def sheet(ids, out, cols=3, cell=760):
    import json
    fr=json.load(open("MFS3a-frame.json"))["plates"]
    rows=(len(ids)+cols-1)//cols
    ch=int(cell*3392/5056)
    sh=Image.new("RGB",(cols*cell, rows*(ch+22)),(20,20,20))
    d=ImageDraw.Draw(sh)
    for i,pid in enumerate(ids):
        fn=fr[pid]["file"]
        im=Image.open(os.path.join(CORP,"plates",fn)).convert("RGB").resize((cell,ch),Image.LANCZOS)
        dd=ImageDraw.Draw(im)
        for k in range(1,10):
            x=int(cell*k/10); dd.line([(x,0),(x,ch)],fill=(255,0,255) if k!=5 else (255,255,0),width=1)
            dd.text((x+2,2),str(k*10),fill=(255,0,255))
        for k in range(1,10):
            y=int(ch*k/10); dd.line([(0,y),(cell,y)],fill=(0,150,255) if k!=5 else (255,255,0),width=1)
            dd.text((2,y+1),str(k*10),fill=(0,150,255))
        r,c=divmod(i,cols)
        sh.paste(im,(c*cell, r*(ch+22)))
        d.text((c*cell+6, r*(ch+22)+ch+5), f"{pid}  {fr[pid]['stem']}", fill=(255,255,255))
    sh.save(out,quality=80); print(out, sh.size, len(ids))
if __name__=="__main__":
    sheet(sys.argv[2].split(","), sys.argv[1])
