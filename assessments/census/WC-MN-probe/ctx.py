import sys,re
path=sys.argv[1]; pats=sys.argv[2].split(','); w=int(sys.argv[3]) if len(sys.argv)>3 else 150; lim=int(sys.argv[4]) if len(sys.argv)>4 else 6
txt=open(path,encoding='utf8').read().split('\n')
for p in pats:
    n=0
    for i,l in enumerate(txt,1):
        for m in re.finditer(re.escape(p),l):
            s=max(0,m.start()-w); e=min(len(l),m.end()+w)
            print(f"[{p}] l.{i}: …{l[s:e]}…"); n+=1
            if n>=lim: break
        if n>=lim: break
