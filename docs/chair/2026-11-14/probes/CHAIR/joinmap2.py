#!/usr/bin/env python3
"""The chair's join map, second form: the nine lanes at their tips on origin, every pair merged IN MEMORY (git merge-tree --write-tree).
Nothing is checked out, committed or pushed. usage: joinmap2.py <out.json>"""
import subprocess, sys, json, itertools, collections
R = '/home/user/settlement-engine'
LANES = {
 'r3-code': 'origin/lane/r3-code-c-2026-11-13',
 'r3-tabs': 'origin/lane/r3-tabs-2026-11-13',
 'r2a': 'origin/lane/r2-code-a-2026-11-13',
 'powers': 'origin/lane/powers-follow-up-2026-11-13',
 'data': 'origin/lane/w2-fix-data-2026-11-13',
 'corpus': 'origin/lane/w2-write-2026-11-13',
 'leaves': 'origin/lane/w2-c-leaves-2026-11-13',
 'r2b': 'origin/lane/r2-code-b-2026-11-13',
 'defence': 'origin/lane/coherence-upkeep-2026-11-12',
}
def sh(*a):
    return subprocess.run(['git', '-C', R, *a], capture_output=True, text=True)
tips = {k: sh('rev-parse', '--short=9', v).stdout.strip() for k, v in LANES.items()}
out = {'tips': tips, 'pairs': {}, 'files': collections.defaultdict(list)}
for a, b in itertools.combinations(list(LANES), 2):
    r = sh('merge-tree', '--write-tree', '--name-only', '--no-messages', LANES[a], LANES[b])
    lines = [x for x in r.stdout.split('\n') if x.strip()]
    if r.returncode == 0:
        out['pairs'][a + ' + ' + b] = {'clean': True, 'files': []}
    elif r.returncode == 1:
        files = lines[1:]
        out['pairs'][a + ' + ' + b] = {'clean': False, 'files': files}
        for f in files:
            out['files'][f].append(a + ' + ' + b)
    else:
        out['pairs'][a + ' + ' + b] = {'clean': None, 'error': (r.stderr or r.stdout)[:200]}
out['files'] = dict(out['files'])
json.dump(out, open(sys.argv[1], 'w'), indent=1)
def kind(f):
    if f.startswith('src/') and not f.endswith('.generated.js'): return 'CODE'
    if f.startswith('scripts/lib/') or (f.startswith('scripts/') and f.endswith('.mjs')): return 'CODE'
    if f.startswith('supabase/functions/_shared/'): return 'bundle'
    if f.startswith('tests/') and (f.endswith('.json') or '/.' in f): return 'register'
    if f.startswith('tests/'): return 'test'
    if f.startswith('docs/'): return 'doc'
    return 'other'
by = collections.defaultdict(list)
for f, ps in sorted(out['files'].items()):
    by[kind(f)].append((f, ps))
print('tips', tips)
print('pairs', len(out['pairs']), 'with conflicts', sum(1 for v in out['pairs'].values() if v['clean'] is False), 'errors', sum(1 for v in out['pairs'].values() if v['clean'] is None))
for k in ('CODE', 'test', 'register', 'doc', 'bundle', 'other'):
    print('==', k, len(by[k]))
    for f, ps in by[k]:
        print('  ', f, '|', '; '.join(ps) if k in ('CODE', 'test', 'other') else len(ps))
