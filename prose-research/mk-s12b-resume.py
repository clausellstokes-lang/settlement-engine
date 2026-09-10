#!/usr/bin/env python3
# mk-s12b-resume.py — after a session death, cache the DOSSIER stage of s12-dossier-and-verify.workflow.js from its journal.
# Prints the Workflow args JSON (a real object) to pass as `args`; the seven lenses + fold always re-run (their files are claims).
import json,glob,os,sys
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
runs=json.load(open(SC+'/prose-research/sweep/LAST-RUNS.json'))['_S12']
journals=[]
r=runs
while r:
    td=r.get('transcriptDir')
    if td and os.path.exists(td+'/journal.jsonl'): journals.append(td+'/journal.jsonl')
    r=r.get('previous')
cached={}
for j in journals:
    for line in open(j):
        try: d=json.loads(line)
        except: continue
        if d.get('type')=='result' and isinstance(d.get('result'),dict) and 'partBAddendumLines' in d['result']:
            cached['dossier']=d['result']; break
    if cached: break
out={'cached':cached}
dossier=SC+'/prose-research/sweep/RECONCILIATION-DOSSIER.md'
print('journals read:',journals, file=sys.stderr)
print('dossier file present:',os.path.exists(dossier),'| cached dossier result:',bool(cached), file=sys.stderr)
if cached and not os.path.exists(dossier): print('WARNING: journal has a dossier result but the file is missing — do NOT cache; relaunch plain', file=sys.stderr)
json.dump(out,open(SC+'/prose-research/sweep/s12b-resume-args.json','w'),indent=1)
print(json.dumps(out)[:400])
