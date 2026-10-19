import sys
f=sys.argv[1]; pats=sys.argv[2].split('|'); before=int(sys.argv[3]) if len(sys.argv)>3 else 300; after=int(sys.argv[4]) if len(sys.argv)>4 else 600; maxhits=int(sys.argv[5]) if len(sys.argv)>5 else 40
t=open(f,encoding='utf-8').read().split('\n'); n=0
for i,l in enumerate(t,1):
    for p in pats:
        j=l.find(p)
        if j>=0:
            s=max(0,j-before); e=min(len(l),j+len(p)+after)
            print(f"--- {f.split('/')[-1]}:{i} [{p}] ...{l[s:e]}...\n"); n+=1
            break
    if n>=maxhits: break
