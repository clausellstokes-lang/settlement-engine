import sys,re
path, pat, before, after = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
maxn = int(sys.argv[5]) if len(sys.argv)>5 else 6
txt = open(path, encoding='utf-8').read().split('\n')
n=0
for i,line in enumerate(txt,1):
    for m in re.finditer(re.escape(pat), line):
        s=max(0,m.start()-before); e=min(len(line), m.end()+after)
        print(f"L{i}: …{line[s:e]}…"); n+=1
        if n>=maxn: sys.exit()
