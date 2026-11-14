# figs.py <dir>: every "<Score name>" line followed by a bare number, on every page surface, against the record's score; plus the
# Armed Forces header counts against the record's defence buckets.
import sys,os,gzip,json,re,collections
D=sys.argv[1]; K={'Military':'military','Economic':'economic','Magical':'magical','Monster':'monster','Internal':'internal','Disaster':'disaster'}
bad=[];n=0;seen=collections.Counter();hb=[];hs=0
for f in sorted(os.listdir(D)):
    if not f.endswith('.txt.gz'): continue
    s=json.load(gzip.open(f'{D}/{f[:-7]}.json.gz')); sc=s['defenseProfile']['scores']; ins=s['defenseProfile']['institutions']
    cur=None; d=collections.defaultdict(list)
    for x in gzip.open(f'{D}/{f}','rt'):
        x=x.rstrip('\n');m=re.match(r'^== (.*) ==$',x)
        if m: cur=m.group(1);continue
        d[cur].append(x.strip())
    for surf,L in d.items():
        if surf.startswith(('world-export','ai-grounding','register')): continue
        for i in range(len(L)-1):
            if L[i] in K and re.fullmatch(r'\d+(/100)?',L[i+1]):
                seen[surf]+=1
                if int(L[i+1].split('/')[0])!=sc[K[L[i]]]: bad.append((f,surf,L[i],L[i+1],sc[K[L[i]]]))
    for x in d['tab:defense']:
        m=re.match(r'^Armed Forces & Fortifications (.*?) ?▲?$',x)
        if not m: continue
        hs+=1; got={}
        for num,w in re.findall(r'(\d+) (walls?|forces?|mercenary|charter|arcane)',m.group(1)): got[w.rstrip('s') if w in('walls','forces') else w]=int(num)
        exp={'wall':len(ins.get('walls',[])),'force':len(ins.get('garrison',[]))+len(ins.get('militia',[]))+len(ins.get('watch',[])),'mercenary':len(ins.get('mercenary',[])),'charter':len(ins.get('charter',[])),'arcane':len(ins.get('magicDef',[]))}
        exp={k:v for k,v in exp.items() if v}
        if got!=exp: hb.append((f,x,exp))
print(D,'figures read',dict(seen),'disagree',len(bad),bad[:5]); print('headers',hs,'disagree',len(hb),hb[:6])
