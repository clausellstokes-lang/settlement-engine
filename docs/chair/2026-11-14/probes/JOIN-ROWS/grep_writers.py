import json,subprocess,sys,os
J=sys.argv[1]; rows=json.load(open(sys.argv[2]))
res={}
for r in rows:
    w=r.get('words') or ''
    if not w: res[r['id']]=[];continue
    p=subprocess.run(['git','grep','-n','-F',w,J,'--','src'],capture_output=True,text=True)
    hits=[l.split(':',1)[1] for l in p.stdout.splitlines()]
    hits=[h for h in hits if not h.startswith('src/') or True]
    res[r['id']]=[ ':'.join(h.split(':')[:2]) for h in hits]
json.dump(res,open(sys.argv[3],'w'),indent=1)
for k,v in res.items():
    files=sorted(set(h.rsplit(':',1)[0] for h in v))
    print(k, len(v), ' | '.join(files[:5])+(' …' if len(files)>5 else ''))
