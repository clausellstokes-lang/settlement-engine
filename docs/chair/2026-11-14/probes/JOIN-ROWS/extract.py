import re,sys,os,glob
SRC,OUT=sys.argv[1],sys.argv[2]
KW=re.compile(r"FOR THE JOIN|NAMED|NOT MINE|NOT THIS LANE|\bLEFT\b|DECLARATION PASS|CARRIED",re.I)
SKIP=re.compile(r"Named commits|Leftover 1|^R4 |successor\)\Z",re.I)
idx=[]
for p in sorted(glob.glob(SRC+'/*')):
    L=open(p,encoding='utf-8').read().split('\n')
    heads=[(i,len(m.group(1)),m.group(2)) for i,l in enumerate(L) for m in [re.match(r'^(#+)\s+(.*)',l)] if m]
    for k,(i,lv,t) in enumerate(heads):
        if not KW.search(t) or SKIP.search(t): continue
        if lv==1: continue
        j=len(L)
        for (i2,lv2,_) in heads[k+1:]:
            if lv2<=lv: j=i2;break
        body='\n'.join(L[i:j])
        name=f"{os.path.basename(p)}__L{i+1}"
        open(f"{OUT}/{name}",'w').write(body)
        idx.append((name,j-i,len(body),t[:90]))
for n,a,b,t in idx: print(f"{b:7d} {a:4d}L {n} | {t}")
print(sum(x[2] for x in idx))
