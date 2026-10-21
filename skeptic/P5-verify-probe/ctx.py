import sys,re
# usage: ctx.py file pattern [width] [maxhits]
f,pat=sys.argv[1],sys.argv[2]; w=int(sys.argv[3]) if len(sys.argv)>3 else 250; mx=int(sys.argv[4]) if len(sys.argv)>4 else 50
n=0
for i,line in enumerate(open(f,encoding='utf-8'),1):
    for m in re.finditer(pat,line):
        s=max(0,m.start()-w); e=min(len(line),m.end()+w)
        print(f"{f.split('/')[-1]}:{i}: …{line[s:e].strip()}…"); n+=1
        if n>=mx: sys.exit()
