import sys,re,glob
# usage: ctx.py PATTERN [FILTER] [width] [vols...]
pat=sys.argv[1]; flt=sys.argv[2] if len(sys.argv)>2 and sys.argv[2] else None
w=int(sys.argv[3]) if len(sys.argv)>3 else 160
vols=sys.argv[4:] or sorted(glob.glob('/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_*.md'))+sorted(glob.glob('/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_W_*.md'))
for v in vols:
    if not v.startswith('/'): v='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_%s.md'%v
    try: lines=open(v,encoding='utf8').read().split('\n')
    except Exception as e: continue
    for i,l in enumerate(lines,1):
        for m in re.finditer(pat,l):
            s=l[max(0,m.start()-w):m.end()+w]
            if flt and not re.search(flt,s,re.I): continue
            print('%s:%d: …%s…'%(v.split('/')[-1].replace('DESIGN_FP_ARCH_','').replace('.md',''),i,s.replace('\n',' ')))
