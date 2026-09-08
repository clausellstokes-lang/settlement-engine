import json,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
mods=sys.argv[1].split(',')
claims=[];sources=[]
for m in mods:
    mod=__import__(m)
    claims+=getattr(mod,'CLAIMS',[]); sources+=getattr(mod,'SOURCES',[])
cov=open(sys.argv[3]).read().strip() if len(sys.argv)>3 and os.path.exists(sys.argv[3]) else "in progress"
out=dict(complete=(len(sys.argv)>4 and sys.argv[4]=='final'), coverage=cov, sourcesRead=sources, claims=claims)
json.dump(out,open(sys.argv[2],'w'),indent=1,ensure_ascii=False)
print('claims',len(claims),'sources',len(sources),'->',sys.argv[2])
