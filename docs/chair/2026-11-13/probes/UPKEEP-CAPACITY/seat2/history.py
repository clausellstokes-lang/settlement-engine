# history.py <runs-dir> <key>...: each town's readiness, band and five scores at every step's tree
import json,glob,sys
R=sys.argv[1]; steps=['BASE','C1','C2','C3','C4','C4b','C5','M2b','C6b']
data={}
for st in steps:
    fs=glob.glob(f'{R}/{st}/c2-*.ndjson')
    if not fs: continue
    data[st]={json.loads(l)['key']:json.loads(l)['base'] for f in fs for l in open(f)}
for k in sys.argv[2:]:
    print('##',k)
    prev=None
    for st,d in data.items():
        x=d[k]; cur=(x['score'],x['band'],tuple(x['scores'][:5]),x['hPow'])
        if cur!=prev: print(f'   {st:5s} {x["score"]:3d} {x["band"]:17s} {x["scores"][:5]} pow {x["hPow"]}')
        prev=cur
