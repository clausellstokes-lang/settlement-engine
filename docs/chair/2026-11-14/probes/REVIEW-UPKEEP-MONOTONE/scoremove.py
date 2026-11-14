# REVIEW-UPKEEP-MONOTONE 8(b): per birth, the defence profile's scores, readiness score and label, base -> tip, from the records.
# usage: python3 scoremove.py <base_dir> <tip_dir> <out.ndjson>
import sys, os, gzip, json, collections
B, T, OUT = sys.argv[1:4]
SC = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster']
out = open(OUT, 'w'); moved = collections.Counter(); bytier = collections.defaultdict(collections.Counter); n = 0
labmove = collections.Counter(); up = collections.Counter(); down = collections.Counter()
for f in sorted(x for x in os.listdir(T) if x.endswith('.json.gz')):
    if not os.path.exists(os.path.join(B, f)): continue
    b = json.load(gzip.open(os.path.join(B, f))); t = json.load(gzip.open(os.path.join(T, f))); n += 1
    db, dt = b.get('defenseProfile') or {}, t.get('defenseProfile') or {}
    row = {'seed': f[:-8], 'tier': t.get('tier'), 'pop': t.get('population')}
    for k in SC:
        vb, vt = (db.get('scores') or {}).get(k), (dt.get('scores') or {}).get(k)
        if vb != vt:
            row[k] = [vb, vt]; moved[k] += 1; bytier[t.get('tier')][k] += 1
            if isinstance(vb, (int, float)) and isinstance(vt, (int, float)): (up if vt > vb else down)[k] += 1
    rb, rt = db.get('readiness') or {}, dt.get('readiness') or {}
    if rb.get('score') != rt.get('score'):
        row['readiness'] = [rb.get('score'), rt.get('score')]; moved['readiness'] += 1; bytier[t.get('tier')]['readiness'] += 1
        (up if (rt.get('score') or 0) > (rb.get('score') or 0) else down)['readiness'] += 1
    if rb.get('label') != rt.get('label'):
        row['label'] = [rb.get('label'), rt.get('label')]; moved['label'] += 1; bytier[t.get('tier')]['label'] += 1; labmove[f"{rb.get('label')} -> {rt.get('label')}"] += 1
    if b.get('population') != t.get('population'): row['popMoved'] = [b.get('population'), t.get('population')]
    if len(row) > 3: out.write(json.dumps(row) + '\n')
print('births', n, 'moved', dict(moved)); print('up', dict(up)); print('down', dict(down))
for k, v in sorted(bytier.items()): print(' ', k, dict(v))
print('label moves', dict(labmove))
