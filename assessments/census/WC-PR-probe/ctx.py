import sys,re
# usage: ctx.py VOL pattern [max] [width]
D='/Users/cstokes/Desktop/settlement-engine/docs/'
vol, pat = sys.argv[1], sys.argv[2]
mx = int(sys.argv[3]) if len(sys.argv)>3 else 3
w = int(sys.argv[4]) if len(sys.argv)>4 else 200
n=0
for i,line in enumerate(open(D+vol,encoding='utf8'),1):
    for m in re.finditer(pat,line):
        s=max(0,m.start()-w); e=min(len(line),m.end()+w)
        print(f"{vol}:{i}: …{line[s:e].strip()}…"); n+=1
        if n>=mx: sys.exit()
        break
