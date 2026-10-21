import sys, difflib, re
D='/Users/cstokes/Desktop/settlement-engine/docs/'
pairs=sys.argv[1:]
def ncols(l): return len(re.findall(r'(?<!\\)\|', re.sub(r'`[^`]*`','',l)))
for p in pairs:
    pre,name=p.rsplit('=',1)
    a=open(pre).read().split('\n'); b=open(D+name).read().split('\n')
    sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
    ins=set()
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op!='equal': ins.update(range(j1,j2))
    # fence state
    fence=[];f=False
    for l in b:
        if l.strip().startswith('```'): f=not f
        fence.append(f)
    for k in sorted(ins):
        l=b[k]; prev=b[k-1] if k>0 else ''; nxt=b[k+1] if k+1<len(b) else ''
        issues=[]
        if not l.startswith('|') and prev.startswith('|') and nxt.startswith('|') and l.strip(): issues.append('BREAKS-TABLE')
        if l.startswith('|') and not prev.startswith('|'): issues.append('ROW-WITHOUT-TABLE')
        if l.startswith('|'):
            # find header
            h=k
            while h>0 and b[h-1].startswith('|'): h-=1
            if ncols(b[h])!=ncols(l): issues.append('COLS %d vs hdr %d'%(ncols(l),ncols(b[h])))
        if fence[k]: issues.append('IN-FENCE')
        if issues: print(name,k+1,issues,l[:90])
    print(name,'inserted',len(ins))
