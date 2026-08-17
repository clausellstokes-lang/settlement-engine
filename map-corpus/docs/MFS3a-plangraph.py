#!/usr/bin/env python3
"""MF-S3a PLAN-GRAPH INSTRUMENT v3 (lane MF-S3a, ODQ 245/246). Canonical copy:
map-corpus/docs/MFS3a-plangraph.py

METHOD, and the calibration behind each step (all on hf72 unless stated):
 1 INK        L < localmean-10.  ink frac ~0.17 on a town plate.
 2 HULL       density of ink-SKELETON JUNCTIONS in a 4.4%-of-longside window.
              Measured x1e3: built fabric 17-26 | hatched field 6.6-7.5 |
              tree belt 10.5 | cartouche 11.0 | river 0.6.  Built fabric is
              many small closed shapes; hatching is long parallel strokes.
 3 STREET     Otsu computed ON NON-INK PIXELS ONLY (threshold lands ~190 on a
              plate whose block fill sits at L167-172 and whose street/void
              sits at L212-220 -- a 45 L gap).  Plain Otsu on the full
              histogram returns ~118 and separates ink from not-ink, which is
              the wrong split; this is why the threshold is taken on the
              non-ink subset.  Street is then clipped to the hull, because
              open countryside shares the street luminance exactly.
 4 GRAPH      skeleton -> spur-pruned -> nodes typed by branch count.
              UNPRUNED SKELETONS REPORT ~55-72% DEAD ENDS, WHICH IS AN
              ARTIFACT.  Pruning removes stubs below min_branch.
 5 ORIENTATION Boeing entropy H + orientation-order phi, 36 bins,
              bidirectional, length-weighted.  phi 0 = disordered, 1 = grid.
 6 BLOCKS     hull & ~street.  Backland green index 2G-R-B (sage backland 21,
              terracotta roof 2 on hf72) gives the yard/garden core share.

WHAT THIS IS NOT.  Not a building count; a block is not a parcel.  Street
space includes market voids -- separated only by shape, never by name.
DEGENERACY: below village tier there is no block structure; those rows carry
degenerate:true and must never enter a band aggregate (ODQ 244.5: a scanline
grain instrument once returned "99.6 cells across" for a twelve-roof thorp
because it was counting hedges).
"""
import os, math
from skimage.filters import threshold_otsu
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import (skeletonize, remove_small_objects,
                                remove_small_holes, binary_opening,
                                binary_closing, disk)
from skimage.measure import regionprops

NB8 = np.array([[1,1,1],[1,0,1],[1,1,1]], np.uint8)

def load(path, longside=1400):
    im = Image.open(path).convert("RGB")
    w,h = im.size
    return np.asarray(im.resize((longside,int(round(h*longside/w))), Image.LANCZOS)).astype(np.float32)

def masks(rgb, longside, window=None):
    L = rgb.mean(2)
    R,G,B = rgb[:,:,0], rgb[:,:,1], rgb[:,:,2]
    green_idx = 2*G - R - B
    ink = L < (ndi.uniform_filter(L,size=25) - 10)
    # ---- HULL: built fabric is dense ink; countryside/water/paper is not.
    r = max(3,int(0.009*longside))
    idens = ndi.uniform_filter(ink.astype(np.float32), size=2*r+1)
    if window is not None:
        x0,y0,x1,y1 = window
        H,W = L.shape
        hull = np.zeros_like(ink)
        hull[int(y0*H):int(y1*H), int(x0*W):int(x1*W)] = True
        ithr = float("nan")
    else:
        try: ithr = float(threshold_otsu(idens))
        except Exception: ithr = float(np.percentile(idens,60))
        ithr = max(ithr, 0.06)
        core = idens > ithr
        rc = max(3,int(0.012*longside))
        core = ndi.binary_closing(core, np.ones((rc,rc)))
        core = ndi.binary_fill_holes(core)
        lab,n = ndi.label(core)
        if n:
            sizes = ndi.sum(core,lab,range(1,n+1))
            keep = (np.arange(1,n+1))[sizes >= max(sizes.max()*0.05, 0.004*core.size)]
            core = np.isin(lab,keep)
        hull = ndi.binary_fill_holes(ndi.binary_closing(core, np.ones((rc,rc))))
    # ---- STREET: LOCAL-adaptive pale. A global Otsu fails on ward-washed
    # plates (hf34) whose block washes span the street luminance; the street
    # is always the palest thing in ITS OWN neighbourhood.
    w = int(0.075*longside) | 1
    loc = ndi.uniform_filter(L, size=w)
    st = L > (loc + 12)
    st = binary_closing(st, disk(2))
    st = remove_small_holes(st, max(400,longside//3))
    st = binary_opening(st, disk(3))
    st = st & hull
    st = remove_small_objects(st, max(200, longside//3))
    return dict(L=L, ink=ink, idens=idens, hull=hull, street=st, green=green_idx, ink_thresh=ithr)

def build_graph(sk):
    nb = ndi.convolve(sk.astype(np.uint8), NB8, mode="constant")*sk
    nodes = sk & ((nb==1)|(nb>=3))
    nl,nn = ndi.label(nodes, structure=np.ones((3,3)))
    seg = sk & ~nodes
    sl,sn = ndi.label(seg, structure=np.ones((3,3)))
    H,W = sk.shape
    ys,xs = np.nonzero(nodes)
    node_segs=[set() for _ in range(nn+1)]; seg_nodes=[set() for _ in range(sn+1)]
    for y,x in zip(ys,xs):
        nid=int(nl[y,x])
        for sid in np.unique(sl[max(0,y-1):min(H,y+2), max(0,x-1):min(W,x+2)]):
            if sid: node_segs[nid].add(int(sid)); seg_nodes[int(sid)].add(nid)
    seg_len = np.bincount(sl.ravel(), minlength=sn+1); seg_len[0]=0
    return nl,nn,sl,sn,node_segs,seg_nodes,seg_len,nodes

def prune_spurs(sk, min_branch, rounds=8):
    cur = sk.copy()
    for _ in range(rounds):
        nl,nn,sl,sn,node_segs,seg_nodes,seg_len,nodes = build_graph(cur)
        if sn==0: break
        deg=np.array([len(node_segs[i]) for i in range(nn+1)])
        kill=np.zeros(sn+1,bool)
        for sid in range(1,sn+1):
            ns=seg_nodes[sid]
            if ns and seg_len[sid]<min_branch and any(deg[n]==1 for n in ns) and len(ns)<2:
                kill[sid]=True
        # also kill short stubs bounded by one deg1 and one junction
        for sid in range(1,sn+1):
            ns=list(seg_nodes[sid])
            if len(ns)==2 and seg_len[sid]<min_branch and any(deg[n]==1 for n in ns):
                kill[sid]=True
        if not kill.any(): break
        cur = cur & ~kill[sl]
        # drop now-isolated node pixels
        lab,n = ndi.label(cur, structure=np.ones((3,3)))
        if n:
            sz = ndi.sum(cur,lab,range(1,n+1))
            cur = np.isin(lab,(np.arange(1,n+1))[sz>=min_branch*0.6])
    return cur

def orientation_stats(sl, sn):
    b,w=[],[]
    for i,slc in enumerate(ndi.find_objects(sl), start=1):
        if slc is None: continue
        ys,xs = np.nonzero(sl[slc]==i)
        if len(ys)<8: continue
        x=xs.astype(float)-xs.mean(); y=ys.astype(float)-ys.mean()
        cov=np.cov(np.vstack([x,y]))
        if cov.shape!=(2,2) or not np.all(np.isfinite(cov)): continue
        try: _,v=np.linalg.eigh(cov)
        except Exception: continue
        b.append(math.degrees(math.atan2(v[1,-1],v[0,-1]))%180.0); w.append(len(ys))
    if len(b)<12: return None
    b=np.array(b); w=np.array(w,float)
    bb=np.concatenate([b,(b+180)%360]); ww=np.concatenate([w,w])
    hist,_=np.histogram(bb,bins=36,range=(0,360),weights=ww)
    p=hist/hist.sum(); nz=p[p>0]
    H=float(-(nz*np.log(nz)).sum()); Hmax,Hg=math.log(36),math.log(4)
    return {"orientation_entropy":round(H,4),
            "orientation_order_phi":round(max(0.0,min(1.0,1.0-((H-Hg)/(Hmax-Hg))**2)),4),
            "orient_segments":int(len(b))}

def analyse(path, longside=1400, want=False, window=None):
    rgb = load(path, longside)
    M = masks(rgb, longside, window=window)
    hull, st = M["hull"], M["street"]
    res = {"file":os.path.basename(path), "longside":longside,
           "ink_hull_thresh":round(float(M["ink_thresh"]),4) if M["ink_thresh"]==M["ink_thresh"] else None,
           "hull_frac_of_frame":round(float(hull.mean()),4),
           "window":"hand" if window else "auto"}
    if hull.sum() < 0.008*hull.size:
        res.update(degenerate=True, reason="hull too small"); return res,None
    res["street_share_of_hull"]=round(float(st.sum())/float(hull.sum()),4)
    if st.sum() < 0.02*hull.sum():
        res.update(degenerate=True, reason="street space not resolvable"); return res,None
    sk = skeletonize(st)
    minb = max(6,int(0.018*longside))
    sk = prune_spurs(sk, minb); res["spur_min_branch_px"]=minb
    nl,nn,sl,sn,node_segs,seg_nodes,seg_len,nodes = build_graph(sk)
    deg=np.array([len(node_segs[i]) for i in range(nn+1)])[1:]; deg=deg[deg>0]
    if len(deg)<10:
        res.update(degenerate=True, reason="graph too small after pruning"); return res,None
    tot=len(deg)
    n1=int((deg==1).sum()); n3=int((deg==3).sum()); n4=int((deg==4).sum()); n5=int((deg>=5).sum())
    res.update(graph_nodes=tot, graph_edges=int(sn),
      deadend_n=n1, T_or_Y_n=n3, X_n=n4, star_n=n5,
      deadend_share=round(n1/tot,4), TY_share=round(n3/tot,4),
      X_share=round(n4/tot,4), star_share=round(n5/tot,4),
      X_over_TY=round(n4/max(n3,1),4), mean_degree=round(float(deg.mean()),3),
      edge_node_ratio=round(float(sn)/tot,3),
      gamma_connectivity=round(float(sn)/max(1.0,3.0*(tot-2)),4))
    o=orientation_stats(sl,sn)
    if o: res.update(o)
    blocks = remove_small_objects(hull & ~st, max(60,longside//12))
    blab,bn = ndi.label(blocks)
    if bn:
        props=[p for p in regionprops(blab) if p.area>=max(80,longside//10)]
        if props:
            a=np.array([p.area for p in props],float)
            circ=np.array([4*math.pi*p.area/max(p.perimeter,1)**2 for p in props])
            elon=np.array([p.major_axis_length/max(p.minor_axis_length,1e-6) for p in props])
            sol=np.array([p.solidity for p in props])
            gsh=np.array([float((M["green"][blab==p.label]>12).mean()) for p in props])
            an=a/float(hull.sum())
            res.update(block_n=len(props),
              block_area_frac_p10=round(float(np.percentile(an,10)),6),
              block_area_frac_p50=round(float(np.percentile(an,50)),6),
              block_area_frac_p90=round(float(np.percentile(an,90)),6),
              block_area_p90_over_p10=round(float(np.percentile(a,90)/max(np.percentile(a,10),1e-9)),2),
              block_area_cv=round(float(a.std()/max(a.mean(),1e-9)),4),
              block_circularity_p50=round(float(np.median(circ)),4),
              block_elongation_p50=round(float(np.median(elon)),3),
              block_elongation_p90=round(float(np.percentile(elon,90)),3),
              block_solidity_p50=round(float(np.median(sol)),4),
              backland_green_p50=round(float(np.median(gsh)),4),
              blocks_green_ge10pct=round(float((gsh>=0.10).mean()),4),
              blocks_green_ge25pct=round(float((gsh>=0.25).mean()),4))
    return res, (dict(rgb=rgb,hull=hull,street=st,sk=sk,blab=blab if bn else None) if want else None)
