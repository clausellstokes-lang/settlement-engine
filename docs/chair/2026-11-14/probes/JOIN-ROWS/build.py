import json,importlib.util,glob,os,sys
rows=[]
for p in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'r_*.py'))):
    spec=importlib.util.spec_from_file_location(os.path.basename(p)[:-3],p); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for r in m.R: r['_file']=os.path.basename(p); rows.append(r)
byid={r['id']:r for r in rows}
assert len(byid)==len(rows), 'dup ids'
# merge
out=[];merged={}
for r in rows:
    t=r.get('merge')
    if t:
        assert t in byid, (r['id'],t)
        while byid[t].get('merge'): t=byid[t]['merge']
        merged.setdefault(t,[]).append(r)
for r in rows:
    if r.get('merge'): continue
    r=dict(r); r['also']=[]
    for o in merged.get(r['id'],[]):
        r['also'].append(dict(id=o['id'],sentence=o['sentence'],count=o['count'],sev=o['sev'],namer_writer=o['namer_writer'],src=o['src']))
        r['src']=r['src']+o['src']
    out.append(r)
json.dump(out,open(sys.argv[1] if len(sys.argv)>1 else 'rows.merged.json','w'),indent=1)
print(len(rows),'named rows ->',len(out),'table rows;', sum(1 for r in out if r.get('bundle')),'bundles')
