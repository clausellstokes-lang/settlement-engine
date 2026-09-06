# -*- coding: utf-8 -*-
"""mk-round.py <name> <tag> --prev <args-file> [--runs <runId,...>] [--cap N] — build the NEXT round's args from the FILES:
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
sh(['node','sweep-state.mjs','summary']); sh(['node','sweep-state.mjs','assemble',name]); sh(['python3',f'{S}/split-chunks.py',name])
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
out=f'{S}/args-{name}-{tag}.json'; json.dump(args,open(out,'w'),ensure_ascii=False)
print(json.dumps({'name':name,'tag':tag,'out':out,'bytes':os.path.getsize(out),'chunks':len(args.get('chunks') or []),'toVerify':sum(len(c['indices']) for c in (args.get('chunks') or [])),'findAngles':angles,'extraAngles':[e['key'] for e in extras],'droppedComplete':[x for x in (prev.get('findAngles') or []) if complete(x)]+[e['key'] for e in (prev.get('extraAngles') or []) if complete(e['key'])],'baseIndex':args.get('baseIndex'),'verifiedCount':args.get('verifiedCount'),'cap':cap}))
