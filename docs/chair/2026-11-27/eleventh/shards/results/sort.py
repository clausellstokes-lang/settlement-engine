#!/usr/bin/env python3
"""usage: sort.py LABEL N  -> fetches lane/shard-<label>-<k>of<n>-2026-11-27, reads failures.tsv, matches RED-AT-LINE.tsv by containment."""
import sys, subprocess, re, html, json
label, n = sys.argv[1], int(sys.argv[2])
repo = '/home/user/settlement-engine'
red = []
for i, line in enumerate(open('/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv', encoding='utf-8')):
    p = line.rstrip('\n').split('\t')
    if i == 0 or len(p) < 3: continue
    red.append(p)
norm = lambda s: re.sub(r'[\s>]+', '', html.unescape(s)).lower()
tot = {'tests': 0, 'failed': 0, 'files': 0}
on, new, missing = [], [], []
for k in range(1, n + 1):
    br = f'lane/shard-{label.lower()}-{k}of{n}-2026-11-27'
    r = subprocess.run(['git', '-C', repo, 'fetch', '-q', 'origin', br], capture_output=True, text=True)
    if r.returncode: missing.append(k); continue
    base = f'docs/chair/2026-11-27/eleventh/shards/{label}/{k}-of-{n}/'
    sm = json.loads(subprocess.run(['git', '-C', repo, 'show', 'FETCH_HEAD:' + base + 'summary.json'], capture_output=True, text=True).stdout)
    for key in tot: tot[key] += int(sm.get(key) or 0)
    print(f'shard {k}/{n}:', {x: sm.get(x) for x in ('files', 'tests', 'failed', 'suiteErrors', 'exit')})
    out = subprocess.run(['git', '-C', repo, 'show', 'FETCH_HEAD:' + base + 'failures.tsv'], capture_output=True, text=True).stdout
    for line in out.splitlines():
        p = line.split('\t')
        if len(p) < 2: continue
        f, t, m = p[0], p[1], (p[2] if len(p) > 2 else '')
        hit = [r for r in red if (r[1] in f or f in r[1]) and (norm(r[2]) in norm(t) or norm(t) in norm(r[2]))]
        (on if hit else new).append((k, f, html.unescape(t), html.unescape(m), hit[0][3] if hit and len(hit[0]) > 3 else ''))
print('TOTAL', tot, 'missing shards', missing)
print(f'ON THE LIST: {len(on)}   NOT ON THE LIST: {len(new)}')
with open(f'{sys.argv[3] if len(sys.argv) > 3 else "."}/{label}-new.tsv', 'w') as fh:
    for r in new: fh.write('\t'.join(map(str, r[:4])) + '\n')
with open(f'{sys.argv[3] if len(sys.argv) > 3 else "."}/{label}-on.tsv', 'w') as fh:
    for r in on: fh.write('\t'.join(map(str, r)) + '\n')
from collections import Counter
for f, c in Counter(r[1] for r in new).most_common(60): print(f'  {c:4d}  {f}')
