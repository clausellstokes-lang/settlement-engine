# -*- coding: utf-8 -*-
"""extract-found.py <name> <runId> [<runId>...] — salvage FINDER results from THIS session's workflow journals into
sweep/found-<name>-<angle>.json (the angle is recovered from the finder agent's own transcript: the prompt's 'Angle: …' line,
matched against the run's args file sweep/args-<name>*.json extraAngles/ANGLES), and note whether a REGRADE result exists.
For runs launched before finders checkpointed to disk (2026-09-05 21:15), or killed by a session limit mid-run."""
import json,sys,os,glob,io,re
SC=os.path.dirname(os.path.abspath(__file__))
import glob as _g
def _wf(run):
    hits=_g.glob('/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/*/subagents/workflows/'+run)
    return (hits[0]+'/') if hits else '/nonexistent/'
WF=None  # resolved per run by _wf(run) (2026-09-06 08:00: run ids now live in more than one session dir)
STD={'academic':'academic and scholarly criticism','craft':'craft essays and writing-advice pieces','voice':"the author's or designers' OWN words",'close':'close readings and line-level analyses','studies':'peer-reviewed and arXiv studies','industry':'publishing and games industry','counter':'the case AGAINST the common tells'}
name=sys.argv[1]; runs=sys.argv[2:]
prompts=dict(STD)
for f in glob.glob(os.path.join(SC,'args-%s*.json'%name)):
    try:
        a=json.load(open(f))
        for e in a.get('extraAngles') or []: prompts[e['key']]=e['prompt']
    except Exception: pass
def angle_of(run,agent):
    p=_wf(run)+'agent-'+agent+'.jsonl'
    if not os.path.exists(p): return None
    for line in io.open(p,encoding='utf-8'):
        try: j=json.loads(line)
        except: continue
        m=(j.get('message') or {}); c=m.get('content'); txt=c if isinstance(c,str) else ' '.join(x.get('text','') for x in c if isinstance(x,dict)) if isinstance(c,list) else ''
        mm=re.search(r'Angle: (.{0,120})',txt)
        if mm:
            head=mm.group(1)
            for k,pr in prompts.items():
                if head.startswith(pr[:40]): return k
            return 'unknown-'+re.sub(r'[^a-z]+','-',head[:30].lower())
    return None
written=[]; regrade=False; verd=0
for run in runs:
    j=_wf(run)+'journal.jsonl'
    if not os.path.exists(j): print('no journal for',run); continue
    for line in io.open(j,encoding='utf-8'):
        try: d=json.loads(line)
        except: continue
        if d.get('type')!='result': continue
        r=d.get('result')
        if isinstance(r,dict) and 'claims' in r:
            ang=angle_of(run,d.get('agentId','')) or 'unknown'
            out=os.path.join(SC,'found-%s-%s.json'%(name,ang))
            json.dump(r,open(out,'w'),ensure_ascii=False,indent=1); written.append((ang,len(r['claims'])))
        elif isinstance(r,dict) and 'verdicts' in r: verd+=len(r['verdicts'])
        elif isinstance(r,str) and 'downgrade' in r.lower(): regrade=True
print(json.dumps({'name':name,'foundWritten':written,'verdictsInJournal':verd,'regradeResultSeen':regrade}))
