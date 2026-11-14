"""JOIN-ROWS-1: the table. Run from the repository root after build.py (rows.merged.json) and hold.py (hold.json):
python3 table.py <dir with rows.merged.json and hold.json> <out .md> <out .json>"""
import json,os,re,subprocess,sys
here=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,here)
from states import ST
D=sys.argv[1]; rows=json.load(open(D+'/rows.merged.json')); H={o['id']:o for o in json.load(open(D+'/hold.json'))}
def git(*a): return subprocess.run(['git',*a],capture_output=True,text=True).stdout.strip()
SH=lambda l:l.replace('-2026-11-13','').replace('-2026-11-12','')
J='origin/lane/join-2026-11-14'
def holders(o):
    res=[]
    for w in o['writers']:
        if not w.get('on_join'): res.append(dict(file=w['file'],holder='(file not on the joined tree)',how='',nearest=''));continue
        lanes=w['lanes']
        u=[SH(l) for l,v in lanes.items() if v['touch_unit']]
        ln=[SH(l) for l,v in lanes.items() if v['touch_line']]
        f=[SH(l) for l,v in lanes.items() if v['hunks']]
        if '/dossierStateProse/' in w['file'] and w['file'].endswith('.generated.js'):
            jt=git('show',J+':'+w['file']).split(chr(10)); ln0=(w['line_on_join'] or 1)-1
            cell=next((re.sub(r'[\s":\[]+$','',jt[i].strip())+'"' for i in range(ln0,-1,-1) if re.match(r'^\s*"[^"]+":\s*\[\s*$',jt[i]) and not re.match(r'^\s*"(marks|slots|needs|excludes|tags)"',jt[i])),'')
            pool=next((jt[i].strip().split('"')[1] for i in range(ln0,-1,-1) if re.match(r'^  "DS-[A-Z]+-\d+"',jt[i])),'')
            vid=next((jt[i].split(':')[1].strip().strip(',') for i in range(ln0,min(ln0+40,len(jt))) if '"vid"' in jt[i]),'') if w['needle'] else ''
            res.append(dict(file=w['file'],line=w['line_on_join'],unit=f'{pool} › {cell}'+(f' vid {vid}' if vid else ''),holder='w2-write',how="the corpus lane: a generated pool (the brief's rule)"+('; hunks in the unit also by '+', '.join(x for x in u if x!='w2-write') if [x for x in u if x!='w2-write'] else ''),nearest=''));continue
        if u: h,how=u,'by function'
        elif ln: h,how=ln,'by line (no enclosing unit found)'
        else: h,how=["NO LANE'S"],''
        near='' if (u or ln) else ('nearest: '+', '.join(f) if f else 'no lane changed the file')
        res.append(dict(file=w['file'],line=w['line_on_join'],unit=w['unit'],holder=', '.join(h),how=how,nearest=near))
    return res
def cure_evidence(cs):
    ev=[]
    for c in cs:
        subj=git('log','-1','--format=%h %s',c)
        lanes=[b.replace('origin/lane/','') for b in git('branch','-r','--contains',c).split() if b.startswith('origin/lane/') and not b.startswith('origin/lane/review')]
        diff=git('show','--format=','-U0',c,'--','src')
        plus=[l[1:].strip() for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
        pick=next((p for p in plus if re.search(r'excludes|needs|crisis|no crisis|marks|function|return|text',p)),plus[0] if plus else '')
        ev.append(dict(commit=subj,on=[SH(x) for x in lanes][:4],diff_line=pick[:160]))
    return ev
RANK={'HIGH':0,'HIGH?':0,'MEDIUM':1,'MEDIUM?':2,'LOW':3}
SORD={'OPEN':0,'SENT TO':1,'CURED AT':2,'CURED ON THE JOINED TREE':2}
def width(c):
    """widest first: the first figure of the namer's count, with denominators, births, census sizes and hashes struck"""
    if c.startswith('AS NAMED'): c=c.split('(')[0]
    c=re.sub(r'[0-9a-f]{7,}','',c); c=re.sub(r'(of|census|on the|on) [\d,]+','',c); c=re.sub(r'[\d,]+ births','',c)
    m=re.findall(r'(\d[\d,]*)',c.replace('AS NAMED',''))
    return int(m[0].replace(',','')) if m else 0
T=[]
for r in rows:
    st=ST.get(r['id'],('OPEN','',[],''))
    hs=holders(H[r['id']]) if r['id'] in H else []
    e=dict(id=r['id'],state=st[0],seat=st[1],note=st[3],severity=r['sev'],sentence=r['sentence'],count=r['count'],namer_writer=r['namer_writer'],
           writer_on_join=hs,holding=sorted(set(h['holder'] for h in hs)) or ['(no writer traced)'],
           sources=[dict(path=p,heading=h) for p,h in r['src']],also=[a['id'] for a in r.get('also',[])],bundle=r.get('bundle',0),
           cure=cure_evidence(st[2]) if st[2] else [],width=width(r['count']))
    if r.get('fact'): e['fact']=r['fact']
    T.append(e)
T.sort(key=lambda e:(SORD[e['state']],RANK.get(e['severity'],2),-e['width'],e['id']))
json.dump(T,open(sys.argv[3],'w'),indent=1,ensure_ascii=False)
# markdown
def esc(s): return str(s).replace('|','\\|').replace('\n',' ')
L=[]
def row(e):
    w='; '.join(f"`{h['file'].replace('src/','')}:{h.get('line') or ''}` [{esc(h.get('unit',''))[:50]}]" for h in e['writer_on_join']) or '—'
    hold='; '.join(f"{h['holder']}{(' ('+h['how']+')') if h['how'] else ''}{(' — '+h['nearest']) if h['nearest'] else ''}" for h in e['writer_on_join']) or '(no writer traced: fixed words not found on the joined tree)'
    st=e['state']+((' '+e['seat']) if e['seat'] else '')
    if e['cure']: st+=': '+'; '.join(f"{c['commit'][:9]} (on {', '.join(c['on'])})" for c in e['cure'])
    src='; '.join(f"{esc(s['path'])} § {esc(s['heading'])[:90]}" for s in e['sources'])
    also=(' · also: '+', '.join(e['also'])) if e['also'] else ''
    return f"| {e['id']}{also} | {esc(e['severity'])} | {esc(e['sentence'])} | {esc(e['count'])} | {w} | {esc(hold)} | {esc(st)}{(' — '+esc(e['note'])) if e['note'] else ''} | {src} |"
hdr='| row | sev | the sentence (its fixed words) | count as named | writer on the joined tree [unit] | who holds it now | state today | sources (path § heading) |\n|---|---|---|---|---|---|---|---|'
from collections import Counter
cs=Counter(e['state'] for e in T)
L.append(f"## The table ({len(T)} rows: OPEN {cs['OPEN']}, SENT {cs['SENT TO']}, CURED {cs['CURED AT']+cs['CURED ON THE JOINED TREE']})\n")
for name,f in [('OPEN',lambda e:e['state']=='OPEN'),('SENT',lambda e:e['state']=='SENT TO'),('CURED',lambda e:e['state'].startswith('CURED'))]:
    L.append(f"### {name}\n\n{hdr}"); L+= [row(e) for e in T if f(e)]; L.append('')
# counts
L.append('## Counts\n\n### By state and severity\n\n| state | HIGH | MEDIUM | MEDIUM? | LOW | all |\n|---|---|---|---|---|---|')
for s in ['OPEN','SENT TO','CURED AT']:
    c=Counter(e['severity'].replace('HIGH?','HIGH') for e in T if e['state']==s)
    L.append(f"| {s} | {c['HIGH']} | {c['MEDIUM']} | {c['MEDIUM?']} | {c['LOW']} | {sum(c.values())} |")
L.append('\n### OPEN rows by holding lane (a row whose writers two lanes hold counts under each)\n\n| holder | HIGH | MEDIUM | MEDIUM? | LOW |\n|---|---|---|---|---|')
hc={}
for e in T:
    if e['state']!='OPEN': continue
    for h in e['holding']:
        hc.setdefault(h,Counter())[e['severity'].replace('HIGH?','HIGH')]+=1
for h,c in sorted(hc.items(),key=lambda x:(-x[1]['HIGH'],-sum(x[1].values()))):
    L.append(f"| {h} | {c['HIGH']} | {c['MEDIUM']} | {c['MEDIUM?']} | {c['LOW']} |")
open(sys.argv[2],'w').write('\n'.join(L)+'\n')
print(cs, {h:dict(c) for h,c in hc.items()})
print('OPEN HIGH:',[e['id'] for e in T if e['state']=='OPEN' and e['severity'].startswith('HIGH')])
print('OPEN top MEDIUM by width:',[(e['id'],e['width']) for e in T if e['state']=='OPEN' and e['severity']=='MEDIUM'][:8])
