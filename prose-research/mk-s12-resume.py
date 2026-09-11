#!/usr/bin/env python3
# mk-s12-resume.py [journal.jsonl ...] — builds sweep/s12-resume-args.json for reconciliation-workflow.resume-v2.js from the journals of
# every S12 run so far (default: auto-find every wf_* journal under ~/.claude/projects/<this project>/*/subagents/workflows whose first
# started agent's key belongs to an S12 script — detected by the presence of reconcile/refute results; newest journal wins per item).
# A result is classified by its shape: reconcile = has 'rules'; refute = has 'verdicts'; hunt = 'findings'; spec = 'counts' + file name;
# critic = 'missing'; fold = 'rulesKept'. Only registers whose deliverable FILE exists on disk are cached (the file is the checkpoint).
# Prints the Workflow call. Chair, 2026-09-07 12:3x (window-cutoff prep).
import json, os, sys, glob, time, io
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
K=SC+'/prose-research'; S=K+'/sweep'
PROJ='/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine'
REGS=['dossier-archivist','npc-ladder','herald-pools','chronicle-line','dm-page','chrome-and-compendium']
def key_of(r):
    f=(r.get('file') or ''); base=os.path.basename(f)
    for k in REGS:
        if k in base or k in (r.get('register') or ''): return k
    return None
EXCLUDE={'wf_33d10449-ec8','wf_bdebda48-278'}  # the two all-Opus runs (their reconcile files were renamed *.opus-draft.md; their result 'file' fields point at today's Fable names)
def seat_ok(path, who):
    try: first=io.open(path,encoding='utf-8').readline()
    except Exception: return False
    return who in first
journals=sys.argv[1:] or sorted(glob.glob(PROJ+'/*/subagents/workflows/wf_*/journal.jsonl'), key=os.path.getmtime)
cached={'reconcile':{},'refute':{}}; seen=[]
for J in journals:
    try: lines=[json.loads(l) for l in open(J)]
    except Exception: continue
    res=[l['result'] for l in lines if l.get('type')=='result' and isinstance(l.get('result'),dict)]
    # an S12 journal carries at least one result whose file names an S12 register file (reconcile-/refute-<register>.md) or an S12 deliverable
    if not any(key_of(r) and ('rules' in r or 'verdicts' in r) and ('/sweep/reconcile-' in (r.get('file') or '') or '/sweep/refute-' in (r.get('file') or '')) for r in res) and not any(('rulesKept' in r) or (r.get('file') or '').endswith(('CONTRADICTIONS.md','MOVE-GRAMMAR.md','CLERK-LAWS.md','CRITIC-S12.md')) for r in res): continue
    if os.path.basename(os.path.dirname(J)) in EXCLUDE: continue
    seen.append(J)
    for r in res:
        if 'rules' in r:
            k=key_of(r); f=S+'/reconcile-'+k+'.md' if k else None
            if k and os.path.exists(f) and seat_ok(f,'Fable') and not r['rules'][:1]==[{'id':'REFUSED'}]:
                cached['reconcile'][k]={'register':k,'file':f,'rules':[{'id':x.get('id'),'strength':x.get('strength'),'sourceCount':x.get('sourceCount'),'changesShippedSurface':x.get('changesShippedSurface')} for x in r['rules']],'refusedTechniques':[],'conflicts':[],'absenceRule':'(see file)','openQuestions':[],'allocation':'(see file; cached from '+os.path.basename(os.path.dirname(J))+')'}
        elif 'verdicts' in r:
            k=key_of(r); f=S+'/refute-'+k+'.md' if k else None
            if k and os.path.exists(f) and seat_ok(f,'Opus'):
                cached['refute'][k]={'register':k,'file':f,'verdicts':[{'id':v.get('id'),'refuted':bool(v.get('refuted')),'ground':(v.get('ground') or '')[:160],'severity':v.get('severity') or 'MEDIUM'} for v in r['verdicts']]}
        elif 'findings' in r and os.path.exists(S+'/CONTRADICTIONS.md'): cached['hunt']={'file':S+'/CONTRADICTIONS.md','findings':[{'kind':x.get('kind'),'where':x.get('where'),'text':(x.get('text') or '')[:160],'severity':x.get('severity')} for x in r['findings']]}
        elif 'counts' in r and 'MOVE-GRAMMAR' in (r.get('file') or '') and os.path.exists(S+'/MOVE-GRAMMAR.md'): cached['grammar']=r
        elif 'counts' in r and 'CLERK' in (r.get('file') or '') and os.path.exists(S+'/CLERK-LAWS.md'): cached['clerk']=r
        elif 'missing' in r and os.path.exists(S+'/CRITIC-S12.md'): cached['critic']={'file':S+'/CRITIC-S12.md','missing':[{'what':(x.get('what') or '')[:200],'severity':x.get('severity')} for x in r['missing']]}
        elif 'rulesKept' in r and os.path.exists(K+'/RULES-V2-PART-B.md'): cached['fold']=r
# a refute is only valid for the reconcile it refuted: drop a cached refute whose reconcile is not cached (the reconciler would re-run and its file change)
for k in list(cached['refute']):
    if k not in cached['reconcile']: del cached['refute'][k]
# and a cached refute must be newer than its reconcile file
for k in list(cached['refute']):
    if os.path.getmtime(S+'/refute-'+k+'.md') < os.path.getmtime(S+'/reconcile-'+k+'.md'): del cached['refute'][k]
out={'drafts':{'dossier-archivist':True,'herald-pools':True,'npc-ladder':True},'cached':cached}
json.dump(out, open(S+'/s12-resume-args.json','w'), indent=1)
print('journals read:', [os.path.basename(os.path.dirname(j)) for j in seen])
print('cached reconcile:', sorted(cached['reconcile']), '| refute:', sorted(cached['refute']), '| hunt', 'hunt' in cached, 'grammar', 'grammar' in cached, 'clerk', 'clerk' in cached, 'critic', 'critic' in cached, 'fold', 'fold' in cached)
print('args bytes:', os.path.getsize(S+'/s12-resume-args.json'))
print('\nLAUNCH (a NEW session):  Workflow({ scriptPath: "%s/reconciliation-workflow.resume-v2.js", args: <the JSON object in %s/s12-resume-args.json> })' % (K, S))
print('(the args must be passed as a real JSON object, never a string; re-run this script right before launching so the newest journal wins)')
