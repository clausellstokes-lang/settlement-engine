#!/usr/bin/env python3
"""Visual validation sheet for MFS3a_plangraph. Panels: raw | hull+street+skeleton | blocks.
THE INSTRUMENT IS NOT TRUSTED UNTIL THIS SHEET IS LOOKED AT."""
import sys, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import MFS3a_plangraph as PG

def sheet(path, out, longside=1400):
    res, m = PG.analyse(path, longside, want=True)
    if m is None:
        print("DEGENERATE", json.dumps(res)); return res
    rgb = m["rgb"].astype(np.uint8); base = rgb.copy()
    st = m["street"]
    base[st] = (0.40*base[st] + 0.60*np.array([0,185,225])).astype(np.uint8)
    hb = m["hull"] ^ ndi.binary_erosion(m["hull"], np.ones((5,5)))
    base[hb] = [255,0,255]
    sk = ndi.binary_dilation(m["sk"], np.ones((3,3)))
    base[sk] = [215,0,0]
    third = rgb.copy()
    if m["blab"] is not None:
        blab = m["blab"]; rng = np.random.default_rng(11)
        cols = rng.integers(50,255,size=(int(blab.max())+1,3)); cols[0]=[255,255,255]
        third = (0.55*rgb + 0.45*cols[blab]).astype(np.uint8)
    Image.fromarray(np.concatenate([rgb,base,third],axis=1)).save(out, quality=86)
    print(json.dumps(res))
    return res

if __name__ == "__main__":
    sheet(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv)>3 else 1400)
