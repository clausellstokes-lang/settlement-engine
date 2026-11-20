# The third read's 1b-M3 class: a "no money" crisis line beside a can-pay line, on any surface but the exports.
import sys,re,os,json,collections
D=sys.argv[1]
HUN=re.compile(r'every coin goes on food|The war takes most of the money')
PAY=re.compile(r'Money enough to ride out a long crisis|can pay its way through it')
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
C=collections.Counter(); seeds=[]; where=collections.Counter(); pays=collections.Counter()
for f in sorted(os.listdir(D)):
    p=parse(os.path.join(D,f)); txt={k:'\n'.join(v) for k,v in p.items() if not k.startswith('world-export')}
    allt='\n'.join(txt.values())
    if HUN.search(allt) and PAY.search(allt):
        seeds.append(f[:-4])
        for k,t in txt.items():
            for m in PAY.finditer(t): where[k]+=1; pays[m.group(0)]+=1
print('M3', len(seeds)); print(dict(where)); print(dict(pays))
json.dump(seeds,open(sys.argv[2],'w'))
