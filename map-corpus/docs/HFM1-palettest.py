from PIL import Image
import re, sys, time
ATLAS={"hf10":("#F9ECDC","#513F34"),"hf12":("#F7E1C8","#39251A"),"hf11":("#F3DFC6","#120F0A"),
       "hf3":("#FAECDA","#44372E"),"hf72":("#FAE2C5","#5E3420"),"hf40":("#FEF5E8","#332720"),
       "hf24":("#FBEAD5","#684633"),"hf5":("#F8E4CD","#000000"),"hf35":("#FFFFFF","#5A3D2C")}
STEM={"hf10":"hf10-thorp-plains","hf12":"hf12-thorp-coastal","hf11":"hf11-hamlet-forest",
      "hf3":"hf3-village-organic","hf72":"hf72-dumbbell-town","hf40":"hf40-slum-fringe-city",
      "hf24":"hf24-town-siege","hf5":"hf5-night-pigment","hf35":"hf35-ward-closeup"}
def hexof(t): return "#%02X%02X%02X"%t
def calc(im, inset):
    w,h=im.size
    if inset:
        ix,iy=int(w*0.03),int(h*0.03); im=im.crop((ix,iy,w-ix,h-iy))
    rgb=list(im.convert("RGB").getdata())
    lum=[0.299*r+0.587*g+0.114*b for (r,g,b) in rgb]
    order=sorted(range(len(rgb)), key=lambda i: lum[i])
    n=len(rgb)
    dk=order[:max(1,int(n*0.005))]; br=order[-max(1,int(n*0.02)):]
    def mean(idx):
        r=sum(rgb[i][0] for i in idx)/len(idx); g=sum(rgb[i][1] for i in idx)/len(idx); b=sum(rgb[i][2] for i in idx)/len(idx)
        return hexof((int(round(r)),int(round(g)),int(round(b))))
    return mean(br), mean(dk)
BASES=[]
for pid,stem in STEM.items():
    im_full=Image.open("map-refs/%s.png"%stem)
    W,H=im_full.size
    small=im_full.convert("RGB").resize((640,int(round(H*640.0/W))), Image.BILINEAR)
    p1500=Image.open("MFS1-prev/%s.jpg"%stem) if __import__("os").path.exists("MFS1-prev/%s.jpg"%stem) else None
    p1100=Image.open("map-refs/prev-%s.jpg"%stem)
    tests={"640_inset":(small,True),"640_noinset":(small,False),
           "1100_inset":(p1100,True),"1100_noinset":(p1100,False),
           "full_inset":(im_full,True)}
    if p1500: tests["1500_inset"]=(p1500,True); tests["1500_noinset"]=(p1500,False)
    ap,ai=ATLAS[pid]
    line=[pid,"atlas p=%s i=%s"%(ap,ai)]
    for tag,(im,ins) in tests.items():
        if tag=="full_inset":  # too slow at full res; downsample-free check on a 1600 box
            continue
        p,i=calc(im,ins)
        line.append("%s p=%s%s i=%s%s"%(tag,p,"*" if p==ap else "",i,"*" if i==ai else ""))
    print(" | ".join(line))
