# -*- coding: utf-8 -*-
"""rebuild-state.py — rebuild each sweep's state-<name>.json DETERMINISTICALLY from the old session's workflow journal.
THE DEFECT (found by the martin synthesis agent, 2026-09-05 evening): export-sweep-state.mjs concatenated every finder result's
claims in JOURNAL (completion) order WITHOUT the workflow's dedupe, while the verifiers' indices referred to the workflow's
deduplicated list in findJobs (ANGLES) order — so verdict i named the wrong claim wherever the two orders diverged.
THE REBUILD: order the four finder results by the ANGLE recovered from each agent's own transcript (the prompt's 'Angle: ...'),
flatten, dedupe with the workflow's exact key (lowercase source|feature|claim[:60], first occurrence wins) → the index space the
verifiers used; attach the journal's verdicts by index (a duplicate-verified index keeps the STRICTER verdict, both recorded);
then overlay THIS session's chunk-file verdicts BY CLAIM CONTENT KEY (their indices were cut against the misaligned array, but each
file carries the claim it verified). RECEIPT: the quote-containment rate (claim.quote found in the verdict's note+trueWording)
under the old pairing vs the rebuilt pairing, per sweep. The old file is kept as state-<name>.v1-misaligned.json."""
import json,os,re,glob,io,sys,collections
WF='/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/subagents/workflows/'
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'sweep')
RUNS={'tolkien':'wf_9b91b240-c98','martin':'wf_e25da3f7-7fb','dnd':'wf_6051234f-d27','ai':'wf_60f0a1e1-39c'}
ANGLES=['academic and scholarly criticism','craft essays and writing-advice pieces','the author\'s or designers\' OWN words','close readings and line-level analyses']
AI_ANGLES=['peer-reviewed and arXiv studies','novelists, fiction editors and developmental editors','publishing and games industry','the case AGAINST the common tells']
STRICT={'CONTRADICTED':0,'NOT_FOUND':1,'BLOCKED':2,'VERIFIED_SUBSTANCE':3,'VERIFIED_VERBATIM':4}
def key(c): return (str(c.get('source',''))+'|'+str(c.get('feature',''))+'|'+str(c.get('claim',''))[:60]).lower()
def angle_of(run,agent,order):
    p=WF+run+'/agent-'+agent+'.jsonl'
    with io.open(p,encoding='utf-8') as f:
        for line in f:
            try: j=json.loads(line)
            except: continue
            m=j.get('message') or {}
            c=m.get('content'); txt=c if isinstance(c,str) else ' '.join(x.get('text','') for x in c if isinstance(x,dict)) if isinstance(c,list) else ''
            mm=re.search(r'Angle: (.{0,80})',txt)
            if mm:
                for i,a in enumerate(order):
                    if mm.group(1).startswith(a[:30]): return i
                raise SystemExit('unknown angle: '+mm.group(1))
    raise SystemExit('no prompt in '+p)
def contain_rate(pairs):
    n=0;hit=0
    for c,v in pairs:
        if not v or v.get('verdict') not in ('VERIFIED_VERBATIM','VERIFIED_SUBSTANCE'): continue
        q=str(c.get('quote','')).strip().lower()
        if len(q)<12: continue
        n+=1; blob=(str(v.get('note',''))+' '+str(v.get('trueWording',''))).lower()
        if q in blob: hit+=1
    return (hit,n)
summary={}
for name,run in RUNS.items():
    res=[]
    for line in io.open(WF+run+'/journal.jsonl',encoding='utf-8'):
        try: j=json.loads(line)
        except: continue
        if j.get('type')=='result' and isinstance(j.get('result'),dict): res.append(j)
    finders=[r for r in res if 'claims' in r['result']]; verifs=[r for r in res if 'verdicts' in r['result']]
    order=AI_ANGLES if name=='ai' else ANGLES
    finders.sort(key=lambda r: angle_of(run,r['agentId'],order))
    angles=[order[angle_of(run,r['agentId'],order)][:20] for r in finders]
    raw=[dict(c,angle=order[angle_of(run,r['agentId'],order)].split(' ')[0]) for r in finders for c in r['result']['claims']]
    seen=set(); claims=[]
    for c in raw:
        k=key(c)
        if k in seen: continue
        seen.add(k); claims.append(c)
    # journal verdicts by index (duplicates: keep the stricter; record both)
    verd={}; dups=0; disagree=0
    for r in verifs:
        for v in r['result']['verdicts']:
            i=v.get('index')
            if not isinstance(i,int): continue
            if i in verd:
                dups+=1
                if verd[i]['verdict']!=v['verdict']: disagree+=1
                a,b=verd[i],v
                keep,alt=(a,b) if STRICT.get(a['verdict'],9)<=STRICT.get(b['verdict'],9) else (b,a)
                keep=dict(keep); keep['alt']={'verdict':alt['verdict'],'trueWording':alt.get('trueWording',''),'note':alt.get('note','')[:300]}
                verd[i]=keep
            else: verd[i]=dict(v)
    outOfRange=[i for i in verd if i>=len(claims)]
    # old pairing receipt (the misaligned file) vs new
    oldp=os.path.join(OUT,'state-%s.json'%name); old=json.load(io.open(oldp,encoding='utf-8')) if os.path.exists(oldp) else None
    old_rate=None
    if old and not old.get('rebuiltFrom'):
        oc=old['claims']; ov=old.get('verdicts') or {}
        old_rate=contain_rate([(oc[int(i)],v) for i,v in ov.items() if int(i)<len(oc)])
        io.open(os.path.join(OUT,'state-%s.v1-misaligned.json'%name),'w',encoding='utf-8').write(json.dumps(old,ensure_ascii=False,indent=1))
    new_rate=contain_rate([(claims[i],v) for i,v in verd.items() if i<len(claims)])
    # overlay THIS session's chunk-file verdicts by CONTENT key
    kidx={key(c):i for i,c in enumerate(claims)}
    files=sorted(glob.glob(os.path.join(OUT,'verdicts-%s-*.json'%name))); fromFiles=0; unmatched=0; overwrote=0
    for f in files:
        try: d=json.load(io.open(f,encoding='utf-8'))
        except Exception as e: print('SKIP',f,e); continue
        byIdx={c.get('index'):c for c in (d.get('claims') or []) if isinstance(c,dict)}
        for v in d.get('verdicts') or []:
            c=byIdx.get(v.get('index'))
            if not c: unmatched+=1; continue
            ni=kidx.get(key(c))
            if ni is None: unmatched+=1; continue
            nv=dict(v); nv['index']=ni; nv['fromFile']=os.path.basename(f)
            if ni in verd: overwrote+=1
            verd[ni]=nv; fromFiles+=1
    kept=sum(1 for i,v in verd.items() if i<len(claims) and v['verdict'] in ('VERIFIED_VERBATIM','VERIFIED_SUBSTANCE'))
    state={'name':name,'runId':run,'rebuiltFrom':'journal+transcripts (rebuild-state.py, 2026-09-05 evening)','angleOrder':angles,'claims':claims,'verdicts':{str(i):v for i,v in sorted(verd.items()) if i<len(claims)}}
    io.open(oldp,'w',encoding='utf-8').write(json.dumps(state,ensure_ascii=False,indent=1))
    summary[name]={'raw':len(raw),'deduped':len(claims),'journalVerdicts':len(verd)-fromFiles+overwrote,'dupVerdicts':dups,'dupDisagree':disagree,'outOfRange':len(outOfRange),'fileVerdicts':fromFiles,'fileUnmatched':unmatched,'fileOverwroteJournal':overwrote,'verified':len(state['verdicts']),'kept':kept,'unverified':len(claims)-len(state['verdicts']),'quoteContain_OLD':old_rate,'quoteContain_NEW':new_rate,'angles':angles}
    print(name, json.dumps(summary[name],ensure_ascii=False))
io.open(os.path.join(OUT,'rebuild-summary.json'),'w',encoding='utf-8').write(json.dumps(summary,ensure_ascii=False,indent=1))
