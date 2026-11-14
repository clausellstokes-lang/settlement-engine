#!/usr/bin/env python3
"""The chair's join map: every pair of lanes (and each lane against the line) merged IN MEMORY by `git merge-tree --write-tree`;
nothing is checked out, committed or pushed. Output: pairs with conflicts, and for each conflicted file the pairs that meet on it.
usage: joinmap.py <out.json>"""
import subprocess, sys, json, itertools, collections
R = '/home/user/settlement-engine'
LINE = 'origin/lane/integration-2026-11-07'
LANES = {
 'defence': 'origin/lane/coherence-upkeep-2026-11-12',
 'veil': 'origin/lane/coherence-veil-2026-11-11',
 'leaves': 'origin/lane/w2-c-leaves-2026-11-13',
 'corpus-main': 'origin/lane/w2-write-2026-11-13',
 'corpus-eco': 'origin/lane/w2-write-side-eco-2026-11-13',
 'corpus-rest': 'origin/lane/w2-write-side-rest-2026-11-13',
 'data': 'origin/lane/w2-fix-data-2026-11-13',
 'data-history': 'origin/lane/w2-fix-data-history-2026-11-13',
 'powers': 'origin/lane/powers-follow-up-2026-11-13',
 'r2a': 'origin/lane/r2-code-a-2026-11-13',
 'r2b': 'origin/lane/r2-code-b-2026-11-13',
 'r3-tabs': 'origin/lane/r3-tabs-2026-11-13',
 'r3-code': 'origin/lane/r3-code-c-2026-11-13',
}
def sh(*a):
    return subprocess.run(['git', '-C', R, *a], capture_output=True, text=True)
tips = {k: sh('rev-parse', '--short=9', v).stdout.strip() for k, v in LANES.items()}
tips['LINE'] = sh('rev-parse', '--short=9', LINE).stdout.strip()
refs = dict(LANES); refs['LINE'] = LINE
out = {'tips': tips, 'pairs': {}, 'files': collections.defaultdict(list)}
for a, b in itertools.combinations(sorted(refs), 2):
    r = sh('merge-tree', '--write-tree', '--name-only', '--no-messages', refs[a], refs[b])
    lines = [x for x in r.stdout.split('\n') if x.strip()]
    if r.returncode == 0:
        out['pairs'][a + ' + ' + b] = {'clean': True, 'files': []}
    elif r.returncode == 1:
        files = lines[1:]   # the first line is the tree's id
        out['pairs'][a + ' + ' + b] = {'clean': False, 'files': files}
        for f in files:
            out['files'][f].append(a + ' + ' + b)
    else:
        out['pairs'][a + ' + ' + b] = {'clean': None, 'error': (r.stderr or r.stdout)[:200]}
out['files'] = dict(out['files'])
json.dump(out, open(sys.argv[1], 'w'), indent=1)
n = len(out['pairs']); bad = sum(1 for v in out['pairs'].values() if v['clean'] is False); err = sum(1 for v in out['pairs'].values() if v['clean'] is None)
print('pairs', n, 'with conflicts', bad, 'errors', err, 'conflicted files', len(out['files']))
