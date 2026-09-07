# -*- coding: utf-8 -*-
"""mk-round-one.py <name> <tag> --prev <args-file> [--runs <runId,...>] [--cap N] [--inflight] [--triage] — build the NEXT round's args from the FILES:
salvage finders from this session's journals (extract-found.py), merge every verdict file (sweep-state summary), fold found files
(assemble), re-split (split-chunks), then angles = prev.findAngles/extraAngles minus those whose found file is COMPLETE
(a found file with "complete": false is assembled AND its angle re-run; legacy files without the flag count as complete),
carry regrade/regradeNotes/synthNotes from prev with regradeTag=<tag>, set cap. Writes sweep/args-<name>-<tag>.json and prints the plan."""
import json,os,sys,subprocess,glob
S=os.path.dirname(os.path.abspath(__file__)); K=os.path.dirname(S)
name=sys.argv[1]; tag=sys.argv[2]; a=sys.argv[3:]
prev=json.load(open(a[a.index('--prev')+1])) if '--prev' in a else {}
runs=a[a.index('--runs')+1].split(',') if '--runs' in a else []
cap=int(a[a.index('--cap')+1]) if '--cap' in a else int(prev.get('cap',3))
def sh(cmd): r=subprocess.run(cmd,capture_output=True,text=True,cwd=K); print('  $',' '.join(cmd),'->',(r.stdout.strip() or r.stderr.strip())[:300]); return r
if runs: sh(['python3',f'{S}/extract-found.py',name]+runs)
sh(['node','sweep-state.mjs','merge',name,'--update-state']); sh(['node','sweep-state.mjs','assemble',name])   # mk-round-one (chair 09-07 03:12): the per-sweep merge instead of the cross-sweep summary, so a build for ONE sweep never rewrites another sweep's kept-/state- files under a live run
if '--triage' in a:
    # S-BOUND (owner 2026-09-06): verify only claims whose FEATURE has fewer than three verified distinct sources; record the rest as
    # SKIPPED_TRIAGE in a verdict file so the state shows them decided (never kept) and split-chunks leaves them out.
    import collections
    sp=f'{S}/state-{name}.json'; st=json.load(open(sp)); claims=st['claims']; verd=st.get('verdicts') or {}
    per=collections.defaultdict(set)
    for i,c in enumerate(claims):
        v=verd.get(str(i)); 
        if c and v and v.get('verdict') in ('VERIFIED_VERBATIM','VERIFIED_SUBSTANCE'): per[str(c.get('feature','')).lower()].add(str(c.get('source','')).lower())
    skip=[i for i,c in enumerate(claims) if c and str(i) not in verd and len(per[str(c.get('feature','')).lower()])>=3]
    keep=[i for i,c in enumerate(claims) if c and str(i) not in verd and i not in set(skip)]
    if skip:
        vf=f'{S}/verdicts-{name}-triage-{tag}.json'
        json.dump({'name':name,'triage':True,'claims':[{'index':i,**{k:claims[i].get(k,'') for k in ('feature','claim','source','url','quote')}} for i in skip],
                   'verdicts':[{'index':i,'verdict':'SKIPPED_TRIAGE','trueWording':'','note':'S-BOUND: the feature already has three or more verified independent sources; not verified this round'} for i in skip]},open(vf,'w'),ensure_ascii=False)
        sh(['node','sweep-state.mjs','summary'])
    print('  triage: %d unverified claims kept for verification, %d skipped (feature already settled by 3+ sources)'%(len(keep),len(skip)))
sh(['python3',f'{S}/split-chunks.py',name])
def complete(angle):
    f=f'{S}/found-{name}-{angle}.json'
    if not os.path.exists(f): return False
    try: return json.load(open(f)).get('complete',True) is not False
    except Exception: return False
angles=[x for x in (prev.get('findAngles') or []) if not complete(x)]
extras=[e for e in (prev.get('extraAngles') or []) if not complete(e['key'])]
ex=f'{S}/extra-{name}-{tag}.json'; json.dump(extras,open(ex,'w'),ensure_ascii=False)
cmd=['python3',f'{S}/mk-args.py',name,'--chunks']
if angles: cmd+=['--angles',','.join(angles)]
if extras: cmd+=['--extra',ex]
sh(cmd)
args=json.load(open(f'{S}/args-{name}.json'))
for k in ('regrade','regradeNotes','synthNotes'):
    if k in prev: args[k]=prev[k]
args['regradeTag']=tag; args['cap']=cap
# v3.2 compact chunks: {f: relative file, i: [first,last]} — the indices a chunk carries are always one contiguous run (split-chunks cuts them so)
cc=[]
for c in (args.get('chunks') or []):
    idx=c['indices']
    if idx==list(range(idx[0],idx[-1]+1)): cc.append({'f':os.path.relpath(c['file'],S),'i':[idx[0],idx[-1]]})
    else: cc.append({'file':c['file'],'indices':idx})   # 09-06 14:05: S-BOUND triage leaves GAPS in the todo list; the legacy {file, indices} form carries the exact list (v3.2 accepts both)
args['chunks']=cc
if '--inflight' in a:
    # fold the in-flight scanner's progress into PRIOR PROGRESS hints for every angle this round re-runs (finder killed before its checkpoint)
    hints={}
    for ang in angles+[e['key'] for e in extras]:
        urls=[]; claims=None
        for f in sorted(glob.glob(f'{S}/inflight/*.json')):
            try: d=json.load(open(f))
            except Exception: continue
            if d.get('role')=='finder' and d.get('name')==name and d.get('angle')==ang:
                urls+= [u for u in d.get('urlsFetched',[]) if u not in urls]
                cp=d.get('checkpointFile') or {}
                if cp.get('claims') is not None: claims=cp['claims']
        if urls:
            hints[ang]='%d sources were fetched before the cutoff%s: %s%s. Start from the roster items NOT in that list, then expand.'%(len(urls),(' and %d claims are checkpointed'%claims) if claims else '',' ; '.join(urls[:40]),' (+%d more in sweep/inflight/)'%(len(urls)-40) if len(urls)>40 else '')
    if hints: args['angleHints']=hints; print('  angleHints for', list(hints))
out=f'{S}/args-{name}-{tag}.json'; json.dump(args,open(out,'w'),ensure_ascii=False)
print(json.dumps({'name':name,'tag':tag,'out':out,'bytes':os.path.getsize(out),'chunks':len(args.get('chunks') or []),'toVerify':sum((len(c['indices']) if 'indices' in c else c['i'][1]-c['i'][0]+1) for c in (args.get('chunks') or [])),'findAngles':angles,'extraAngles':[e['key'] for e in extras],'droppedComplete':[x for x in (prev.get('findAngles') or []) if complete(x)]+[e['key'] for e in (prev.get('extraAngles') or []) if complete(e['key'])],'baseIndex':args.get('baseIndex'),'verifiedCount':args.get('verifiedCount'),'cap':cap}))
