#!/usr/bin/env python3
"""REVIEW-R2-STAGES plants: python3 plant.py <worktree> <plants.json> <out.json>
Each plant: {id, edits:[{file, old, new}], expect:[guard file]}. Apply (old must occur exactly once), run every guard
of the stage, record which files red, restore with `git checkout -- <file>` in the scratch worktree."""
import json, subprocess, sys, os
wt, pf, outp = sys.argv[1:4]
spec = json.load(open(pf)); guards = spec['guards']; res = []
def run(tag):
    rep = f"{os.path.dirname(outp)}/plant-{tag}.json"
    subprocess.run(['npx','vitest','run','--maxWorkers=2','--reporter=json',f'--outputFile={rep}',*guards], cwd=wt, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try: r = json.load(open(rep))
    except Exception as e: return {'error': str(e)}
    red = sorted({os.path.relpath(t['name'], wt) for t in r['testResults'] if t['status'] != 'passed'})
    fails = [a['fullName'] for t in r['testResults'] for a in t['assertionResults'] if a['status'] == 'failed']
    return {'red': red, 'failedTitles': fails, 'total': r.get('numTotalTests'), 'failed': r.get('numFailedTests')}
res.append({'id': 'CONTROL (no plant)', **run('control')})
for p in spec['plants']:
    ok = True
    for e in p['edits']:
        path = os.path.join(wt, e['file']); s = open(path).read(); n = s.count(e['old'])
        if n != 1: ok = False; res.append({'id': p['id'], 'error': f"old occurs {n} times in {e['file']}"}); break
        open(path, 'w').write(s.replace(e['old'], e['new']))
    if ok:
        r = run(p['id']); r['id'] = p['id']; r['expect'] = p['expect']
        r['verdict'] = 'REDS ON ITS FAULT ONLY' if r.get('red') == sorted(p['expect']) else ('SILENT' if not r.get('red') else 'REDS ELSEWHERE TOO / DIFFERENT')
        res.append(r)
    subprocess.run(['git','checkout','--',*{e['file'] for e in p['edits']}], cwd=wt)
    json.dump(res, open(outp, 'w'), indent=1)
json.dump(res, open(outp, 'w'), indent=1)
print('\n'.join(f"{r['id']}: {r.get('verdict', r.get('error','') or ('red ' + str(r.get('red'))))} red={r.get('red')}" for r in res))
