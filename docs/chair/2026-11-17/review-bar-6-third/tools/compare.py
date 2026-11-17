# P4 step (2): the third reader's flags against the sixth's final 51. usage: compare.py <final51.json> <index.bar6.json.gz> <new.json out>; it reads the flags from R below (the scratch folder of this run; set R to a folder of bar6-NN/bar6-NN.c.flags.jsonl)
import io,os,re,sys,json,gzip,collections
R='/home/user/p4/r'; F51=sys.argv[1]; IDX=sys.argv[2]; OUT=sys.argv[3]
idx=json.load(gzip.open(IDX,'rt',encoding='utf-8'))['cal']
f51=json.load(io.open(F51,encoding='utf-8'))
key51={(r['town'],r['text']):r for r in f51}
SEV={'HIGH':3,'MED':2,'LOW':1}
flags={}; state={}; unknown=[]
for n in range(1,22):
    p='%s/bar6-%02d/bar6-%02d.c.flags.jsonl'%(R,n,n); k=0; done=[]
    if not os.path.exists(p): state[n]='NO FILE'; continue
    for line in io.open(p,encoding='utf-8'):
        line=line.strip()
        if not line: continue
        try: f=json.loads(line)
        except Exception: unknown.append(('unparsed',n,line[:80])); continue
        i=str(f.get('id','')).strip(); m=re.match(r'^[Cc]0*(\d+)$',i)
        if m: i='C%04d'%int(m.group(1))
        if i in('DONE','STOPPED'): done.append(line); continue
        if i=='HEADER': continue
        if i not in idx: unknown.append((i,n,str(f.get('why'))[:80])); continue
        k+=1
        t=idx[i]; key=(t['town'],t['text']); s=SEV.get(str(f.get('sev')).upper(),1)
        if key not in flags or s>flags[key]['s']: flags[key]={'s':s,'id':i,'f':f,'section':t['section'],'packet':'bar6-%02d'%n}
    state[n]='%d flags · %s'%(k,' | '.join(done) or 'no DONE')
hm={k:v for k,v in flags.items() if v['s']>=2}
on51=[(k,v) for k,v in hm.items() if k in key51]; new=[(k,v) for k,v in hm.items() if k not in key51]
by=collections.Counter(key51[k]['verdict'] for k,v in on51)
L=collections.Counter(v['s'] for v in flags.values())
newl=[{'id':v['id'],'town':k[0],'section':v['section'],'text':k[1],'readers':'c','sev':{3:'HIGH',2:'MED'}[v['s']],'kinds':[v['f'].get('kind')],'whys':['c: '+str(v['f'].get('why'))],'other':v['f'].get('other',''),'packet':v['packet']} for k,v in sorted(new,key=lambda x:(x[0][0],int(x[1]['id'][1:])))]
json.dump(newl,io.open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('READER c, by packet:'); [print('  bar6-%02d  %s'%(n,state[n])) for n in sorted(state)]
print('distinct sentences flagged (twins counted once): HIGH %d · MED %d · LOW %d'%(L[3],L[2],L[1]))
print('HIGH+MED: %d · on the 51: %d %s · not on the 51 (new): %d'%(len(hm),len(on51),dict(by),len(new)))
print('of the 51, not re-flagged at MED+: %d (%s)'%(51-len(on51),dict(collections.Counter(r['verdict'] for r in f51)-by)))
print('unknown ids / unparsed:',unknown)
