import sys,re
path=sys.argv[1]; pat=sys.argv[2]; before=int(sys.argv[3]); after=int(sys.argv[4]); lines=[int(x) for x in sys.argv[5].split(',')]
L=open(path,encoding='utf-8').read().split('\n')
for n in lines:
    s=L[n-1]
    for m in re.finditer(pat,s):
        a=max(0,m.start()-before); b=min(len(s),m.end()+after)
        print(f"=== {n} @{m.start()}: …{s[a:b]}…")
