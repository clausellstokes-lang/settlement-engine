# -*- coding: utf-8 -*-
import json,sys,importlib
sys.path.insert(0,'.')
from build import check, OUT
mods=sys.argv[1:-1]; complete=sys.argv[-1]=='true'
import sources
claims=[]
for m in mods:
    mod=importlib.import_module(m)
    bad=check(mod.CLAIMS)
    if bad:
        print('REFUSING, bad quotes in',m,bad); sys.exit(1)
    claims.extend(mod.CLAIMS)
cov=open('coverage.txt').read().strip() if __import__('os').path.exists('coverage.txt') else ''
out=dict(complete=complete,coverage=cov,sourcesRead=sources.SOURCES,claims=claims)
json.dump(out,open(OUT,'w'),indent=1,ensure_ascii=False)
print('wrote',OUT,len(claims),'claims',len(sources.SOURCES),'sources, complete=',complete)
