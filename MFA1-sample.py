#!/usr/bin/env python3
"""MF-A1 anchor-reference pixel measurement (PIL-only).

MEASURED: median-cut palette clusters (hex+share); luminance percentiles
(value structure); corner-vs-center luminance (vignette); margin paper mean,
full-res grain sigma (high-freq) and stain amplitude (low-freq); ink extreme;
edge-darkening profile for a named wash region (L vs distance from wash edge).
Same stats for the b6 flat render = the measured gap.
"""
import sys, os
from PIL import Image, ImageFilter, ImageStat

S = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad'

def hexof(t): return '#%02X%02X%02X' % t

def lum(p): return 0.299*p[0]+0.587*p[1]+0.114*p[2]

def clusters(im, n=8):
    q = im.convert('RGB').quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()
    counts = sorted(q.getcolors(im.size[0]*im.size[1]), reverse=True)
    tot = im.size[0]*im.size[1]
    out = []
    for c, idx in counts[:n]:
        rgb = tuple(pal[idx*3:idx*3+3])
        out.append((hexof(rgb), round(100*c/tot, 1), round(lum(rgb))))
    return out

def lum_pcts(im):
    g = im.convert('L')
    h = g.histogram(); tot = sum(h)
    pcts = {}
    acc = 0; targets = {5:None,25:None,50:None,75:None,95:None}
    for v, c in enumerate(h):
        acc += c
        for t in targets:
            if targets[t] is None and acc >= tot*t/100: targets[t] = v
    return targets

def vignette(im):
    g = im.convert('L'); w, h = g.size; k = int(min(w, h)*0.12)
    def mean(box): return ImageStat.Stat(g.crop(box)).mean[0]
    corners = [mean((0,0,k,k)), mean((w-k,0,w,k)), mean((0,h-k,k,h)), mean((w-k,h-k,w,h))]
    center = mean(((w-k)//2,(h-k)//2,(w+k)//2,(h+k)//2))
    return round(sum(corners)/4,1), round(center,1)

def paper_stats(path, box):
    """box: margin/empty-paper region at FULL RES. grain sigma = std of (L - 9px median);
    stain amplitude = std of 33px-box-blurred L."""
    im = Image.open(path).convert('L').crop(box)
    med = im.filter(ImageFilter.MedianFilter(9))
    diff = [a-b for a, b in zip(im.getdata(), med.getdata())]
    m = sum(diff)/len(diff)
    grain = (sum((d-m)**2 for d in diff)/len(diff))**0.5
    blur = im.filter(ImageFilter.BoxBlur(16))
    st = ImageStat.Stat(blur)
    return round(ImageStat.Stat(im).mean[0],1), round(grain,2), round(st.stddev[0],2)

def edge_profile(path, box, is_wash):
    """Luminance vs distance-from-wash-edge inside a wash. is_wash(p)->bool on RGB.
    Erode wash mask k times with MinFilter(3); L mean of pixels leaving the mask at
    each ring = profile from edge (ring 0) inward."""
    im = Image.open(path).convert('RGB').crop(box)
    w, h = im.size
    px = list(im.getdata())
    mask = Image.new('L', (w, h), 0)
    mask.putdata([255 if is_wash(p) else 0 for p in px])
    rings = []
    cur = mask
    for ring in range(14):
        er = cur.filter(ImageFilter.MinFilter(5))  # ~2px erosion per step
        border = [i for i, (a, b) in enumerate(zip(cur.getdata(), er.getdata())) if a == 255 and b == 0]
        if not border: break
        Ls = [lum(px[i]) for i in border]
        rings.append((ring*2, round(sum(Ls)/len(Ls), 1), len(border)))
        cur = er
    core = [i for i, v in enumerate(cur.getdata()) if v == 255]
    if core:
        Ls = [lum(px[i]) for i in core]
        rings.append(('core', round(sum(Ls)/len(Ls), 1), len(core)))
    return rings

def full_report(name, path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    small = im.resize((1200, int(h*1200/w)), Image.BILINEAR)
    print(f'== {name} ({w}x{h})')
    print('  clusters:', clusters(small))
    print('  lum pcts:', lum_pcts(small))
    cv = vignette(small)
    print(f'  vignette: corners {cv[0]} vs center {cv[1]} (delta {round(cv[1]-cv[0],1)})')

if __name__ == '__main__':
    for name, f in [('hf3-village', 'map-refs/hf3-village-organic.png'),
                    ('hf30-city', 'map-refs/hf30-city-river.png'),
                    ('hf14-mining', 'map-refs/hf14-village-mining.png'),
                    ('hf5-night', 'map-refs/hf5-night-pigment.png'),
                    ('hf61-chrome', 'map-refs/hf61-chrome-plate.png'),
                    ('b6-town-flat', 'mf-proto-out/b6/town-town-parchment.svg.png'),
                    ('b6-city-flat', 'mf-proto-out/b6/city-city-parchment.svg.png')]:
        full_report(name, os.path.join(S, f))
    # paper stats: empty margin boxes at full res (picked from viewed previews)
    print('paper hf3 (top-right margin):', paper_stats(S+'/map-refs/hf3-village-organic.png', (4300, 350, 4800, 850)))
    print('paper hf61 (left blank):     ', paper_stats(S+'/map-refs/hf61-chrome-plate.png', (300, 2600, 800, 3100)))
    print('paper hf30 (SE country):     ', paper_stats(S+'/map-refs/hf30-city-river.png', (4400, 700, 4900, 1200)))
    print('paper b6 (NW fields):        ', paper_stats(S+'/mf-proto-out/b6/town-town-parchment.svg.png', (300, 300, 800, 800)))
    # edge darkening: hf3 green field (the crop I studied: centered 4130,920 -> box)
    green = lambda p: p[1] > p[0]-12 and p[1] > p[2]+8 and 120 < p[1] < 215
    print('hf3 green-field wash profile (L by px-from-edge):')
    for row in edge_profile(S+'/map-refs/hf3-village-organic.png', (3650, 850, 4450, 1450), green):
        print('   ', row)
    # hf30 water wash (grey-green, low sat, mid L)
    water = lambda p: abs(p[0]-p[1]) < 22 and abs(p[1]-p[2]) < 22 and 120 < p[1] < 200 and p[2] >= p[0]-10
    print('hf30 water wash profile:')
    for row in edge_profile(S+'/map-refs/hf30-city-river.png', (2500, 2100, 3400, 2800), water):
        print('   ', row)
