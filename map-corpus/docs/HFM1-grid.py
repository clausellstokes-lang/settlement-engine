#!/usr/bin/env python3
"""Overlay a labelled decile grid on a downsampled plate so window fractions can be
read off directly. Eye-bounds set on these images are [E] by definition (atlas §2.8.3)."""
import sys, os
from PIL import Image, ImageDraw
W=1000
for stem in sys.argv[1:]:
    src="map-refs/%s.png"%stem
    im=Image.open(src).convert("RGB")
    w,h=im.size; H=int(round(h*W/w))
    im=im.resize((W,H), Image.BILINEAR)
    d=ImageDraw.Draw(im)
    for i in range(1,10):
        x=int(W*i/10.0); d.line([(x,0),(x,H)], fill=(255,0,0), width=1)
        d.text((x+3,4), "%.1f"%(i/10.0), fill=(255,0,0))
        y=int(H*i/10.0); d.line([(0,y),(W,y)], fill=(0,90,255), width=1)
        d.text((4,y+3), "%.1f"%(i/10.0), fill=(0,90,255))
    for i in range(1,20):
        if i%2==0: continue
        x=int(W*i/20.0); d.line([(x,0),(x,10)], fill=(255,0,0)); d.line([(x,H-10),(x,H)], fill=(255,0,0))
        y=int(H*i/20.0); d.line([(0,y),(10,y)], fill=(0,90,255)); d.line([(W-10,y),(W,y)], fill=(0,90,255))
    im.save("HFM1-grid/%s.jpg"%stem, quality=82)
