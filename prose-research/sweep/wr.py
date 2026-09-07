import json,sys,os
OUT='found-hobb-dropped-and-routes.json'
claims=[]; srcs=[]
for n in sys.argv[2:]:
    if n.startswith('c:'): claims+=json.load(open(n[2:]))
    if n.startswith('s:'): srcs+=json.load(open(n[2:]))
complete = sys.argv[1]=='true'
cov=open('.dr-coverage.txt').read().strip() if os.path.exists('.dr-coverage.txt') else 'in progress'
json.dump({"complete":complete,"coverage":cov,"sourcesRead":srcs,"claims":claims},
          open(OUT,'w'),ensure_ascii=False,indent=1)
print(OUT,"claims",len(claims),"sources",len(srcs),"complete",complete)
