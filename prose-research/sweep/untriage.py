# -*- coding: utf-8 -*-
"""untriage.py <name> [--apply] — chair tool (2026-09-07, session 405b5e7e, the owner's delegation of the verify-only pass).
Reads sweep/untriage-<name>.json (written by an Opus reader from the critic: the SKIPPED_TRIAGE rows that are sole witnesses),
and REMOVES those indices from every sweep/verdicts-<name>-triage-*.json (backing each file up as .pre-untriage-<tag>.bak) so that
`node sweep-state.mjs summary` no longer sees a verdict for them and mk-round.py --chunks splits them into verification chunks.
Refuses: an index whose verdict in the state is not SKIPPED_TRIAGE; a triage file that does not parse. Dry by default: prints the plan.
⛔ Run --apply ONLY when no research run for ANY sweep is alive (the summary step rewrites kept-*.json for every sweep)."""
import json,sys,os,glob,shutil,time
S=os.path.dirname(os.path.abspath(__file__)); name=sys.argv[1]; apply='--apply' in sys.argv
u=json.load(open(f'{S}/untriage-{name}.json')); want=sorted({int(r['index']) for r in u['rows']})
st=json.load(open(f'{S}/state-{name}.json')); verd=st.get('verdicts') or {}
bad=[i for i in want if str(i) in verd and verd[str(i)].get('verdict')!='SKIPPED_TRIAGE']
if bad: print('REFUSED: %d listed rows are not SKIPPED_TRIAGE in the state: %s'%(len(bad),[(i,(verd.get(str(i)) or {}).get('verdict')) for i in bad][:12])); sys.exit(2)
files=sorted(glob.glob(f'{S}/verdicts-{name}-triage-*.json')); plan=[]
for f in files:
    d=json.load(open(f)); idx={v['index'] for v in d['verdicts']}; hit=sorted(idx & set(want))
    if hit: plan.append((f,len(idx),hit))
covered=sorted({i for _,_,h in plan for i in h}); missing=[i for i in want if i not in covered]
print('untriage %s: %d rows wanted; %d found across %d triage file(s); %d NOT in any triage file (they may sit in a chunk verdict file — left alone): %s'%(name,len(want),len(covered),len(plan),len(missing),missing[:10]))
for f,n,h in plan: print('  %s: %d of %d rows removed'%(os.path.basename(f),len(h),n))
if not apply: print('DRY RUN — re-run with --apply when no research run is alive'); sys.exit(0)
tag=time.strftime('%m%d-%H%M')
for f,n,h in plan:
    shutil.copy(f, f+'.pre-untriage-%s.bak'%tag); d=json.load(open(f)); hs=set(h)
    d['verdicts']=[v for v in d['verdicts'] if v['index'] not in hs]; d['claims']=[c for c in d.get('claims',[]) if c.get('index') not in hs]
    d['untriaged']=(d.get('untriaged') or [])+[{'at':tag,'rows':h,'why':'owner delegation 2026-09-07: the verify-only completion pass'}]
    json.dump(d,open(f,'w'),ensure_ascii=False)
# 02:15: the merge LAYERS file verdicts onto the state's existing map (sweep-state.mjs merge: verdicts = {...state.verdicts}), so the
# skip must also leave the STATE — delete the indices from state-<name>.json verdicts (backup first); summary then keeps them absent
sp=f'{S}/state-{name}.json'; shutil.copy(sp, sp+'.pre-untriage-%s.bak'%tag); st=json.load(open(sp)); v=st.get('verdicts') or {}
gone=[i for i in want if str(i) in v and v[str(i)].get('verdict')=='SKIPPED_TRIAGE']
for i in gone: del v[str(i)]
st['verdicts']=v; st['untriaged']=(st.get('untriaged') or [])+[{'at':tag,'rows':gone}]; json.dump(st,open(sp,'w'),ensure_ascii=False,indent=1)
print('state-%s.json: %d SKIPPED_TRIAGE verdicts removed (backup .pre-untriage-%s.bak)'%(name,len(gone),tag))
print('APPLIED; now: cd .. && node sweep-state.mjs summary && python3 sweep/mk-round.py %s <tag> --prev sweep/args-%s-<last>.json --cap 4  (NO --triage; NO angles)'%(name,name))
