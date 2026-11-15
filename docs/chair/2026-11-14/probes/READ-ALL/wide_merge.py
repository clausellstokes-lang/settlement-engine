#!/usr/bin/env python3
# REVIEW-WIDE (the bar's own measure): thirty fresh towns read whole by two readers a packet. The two flag files a packet are merged by sentence id; the count a
# town is the UNION (a sentence either reader flagged), with the overlap said (two independent reads: Lincoln-Petersen gives what both missed).
# usage: bar1_merge.py <repo (refs fetched)> <packets dir (index.json, cal-NN.txt)> <bar1 census out-dir> <tabs inventory of the 720 at the tip> <out dir>
import io, os, re, sys, json, gzip, subprocess, collections
REPO, PK, OUTBAR, INV, OUT = sys.argv[1:6]
os.makedirs(OUT, exist_ok=True)
idx = json.load(io.open(PK + '/index.json', encoding='utf-8'))['cal']
inv = json.load(io.open(INV, encoding='utf-8'))
rec = {}
for l in gzip.open(OUTBAR + '/corpus.ndjson.gz', 'rt', encoding='utf-8'):
    o = json.loads(l); rec[o['seed']] = o['s']
src = io.open('/home/user/rec/readall/inventory.py', encoding='utf-8').read()
ns_ = {'re': re, 'collections': collections}
exec(src[src.index('def names_of(s):'):src.index('inv=collections.defaultdict(set)')], ns_)
names_of, fold = ns_['names_of'], ns_['fold']
pats = {}
for seed, s in rec.items():
    ns = names_of(s); pats[seed] = re.compile('|'.join(re.escape(n) for n in ns)) if ns else None
SEV = {'HIGH': 3, 'MED': 2, 'LOW': 1}
def show(ref, path):
    r = subprocess.run(['git', '-C', REPO, 'show', '%s:%s' % (ref, path)], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None
flags = collections.defaultdict(dict); header = []; state = {}; unknown = collections.Counter()
for p in range(1, 26):
    for r in 'a':
        name = 'wide-%02d' % p
        txt = show('origin/lane/review-wide-2026-11-15-%s-%s' % (name, r), 'docs/chair/2026-11-15/review-wide/%s.%s.flags.jsonl' % (name, r))
        if txt is None: state[(name, r)] = 'NO FILE'; continue
        n = 0; st = 'no DONE line'
        for line in txt.splitlines():
            line = line.strip()
            if not line: continue
            try: f = json.loads(line)
            except Exception: continue
            i = str(f.get('id', '')).strip()
            m_ = re.match(r'^[Cc]0*(\d+)$', i)      # a reader wrote C02758 for C2758: the id is the number
            if m_: i = 'C%04d' % int(m_.group(1))
            if i in ('DONE', 'STOPPED'): st = line[:120]; continue
            if i == 'HEADER': header.append({'packet': name, 'reader': r, 'town': f.get('town'), 'sev': f.get('sev'), 'why': f.get('why')}); continue
            if i not in idx: unknown[(name, r)] += 1; continue
            flags[i][r] = f; n += 1
        state[(name, r)] = '%d flags · %s%s' % (n, st, (' · UNKNOWN IDS %d' % unknown[(name, r)]) if unknown[(name, r)] else '')
print('READERS:')
for k in sorted(state): print('  %s %s  %s' % (k[0], k[1], state[k]))
rows = []; seen = set()
for cid in sorted(flags):
    t = idx[cid]; town, sec, text = t['town'], t['section'], t['text']
    key = (town, text)
    by = flags[cid]
    if key in seen:   # the same sentence printed a second time in the town: counted once, at its first id
        continue
    # a reader may have flagged the twin id of the same sentence: gather every id of this (town, text)
    twins = [c for c in flags if idx[c]['town'] == town and idx[c]['text'] == text]
    seen.add(key)
    rd = set(); sev = 0; kinds = []; whys = []
    for c in twins:
        for r, f in flags[c].items():
            rd.add(r); sev = max(sev, SEV.get(str(f.get('sev')).upper(), 1))
            k = str(f.get('kind') or '?')
            if k not in kinds: kinds.append(k)
            whys.append('%s: %s' % (r, str(f.get('why') or '')[:220]))
    f = fold(text, pats.get(town))
    rows.append({'id': cid, 'sev': {3: 'HIGH', 2: 'MED', 1: 'LOW'}[sev], 'kinds': kinds, 'whys': whys, 'packets': ['bar1'], 'readers': ''.join(sorted(rd)),
                 'text': text, 'town': town, 'sections': [sec], 'fold': f, 'n': len((inv.get(f) or {}).get('towns') or [])})
json.dump(rows, io.open(OUT + '/flagged.sentences.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
allf = [{'packet': 'bar1', 'id': r['id'], 'sev': r['sev'], 'kind': r['kinds'][0], 'why': ' | '.join(r['whys']), 'text': r['text'], 'town': r['town'], 'block_town': r['town']} for r in rows]
json.dump(allf, io.open(OUT + '/flags.all.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump(header, io.open(OUT + '/header.flags.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
sents = collections.Counter(t['town'] for t in idx.values())
print('\nTHE COUNT A TOWN (the union of two readers; a sentence printed twice counted once):')
tot = collections.Counter()
for town in sorted(sents):
    c = collections.Counter(r['sev'] for r in rows if r['town'] == town); tot.update(c)
    s = rec.get(town) or {}
    print('  %-38s %-11s sentences %5d · HIGH %2d · MED %3d · LOW %3d' % (town, s.get('tier'), sents[town], c['HIGH'], c['MED'], c['LOW']))
print('  IN ALL: HIGH %d · MED %d · LOW %d · a town: HIGH %.1f · MED %.1f' % (tot['HIGH'], tot['MED'], tot['LOW'], tot['HIGH'] / float(len(rec)), tot['MED'] / float(len(rec))))
hm = [r for r in rows if r['sev'] in ('HIGH', 'MED')]
a = sum(1 for r in hm if 'a' in r['readers']); b = sum(1 for r in hm if 'b' in r['readers']); ab = sum(1 for r in hm if r['readers'] == 'ab')
print('\nTWO READERS (HIGH and MED): reader a %d · reader b %d · both %d · union %d' % (a, b, ab, len(hm)))
if ab: print('  if the two reads are independent, the towns hold about %d such sentences (a x b / both); the union found %d%% of them' % (round(a * b / ab), round(100.0 * len(hm) * ab / (a * b))))
print('BY KIND (HIGH and MED):', dict(collections.Counter(r['kinds'][0] for r in hm).most_common()))
print('BY SECTION (HIGH and MED):', dict(collections.Counter(r['sections'][0] for r in hm).most_common(12)))
print('HOW WIDE ON THE 720 (HIGH and MED rows by the towns that print the same sentence): >=100: %d · 20-99: %d · 5-19: %d · 1-4: %d · none (new or this town only): %d' % (
    sum(1 for r in hm if r['n'] >= 100), sum(1 for r in hm if 20 <= r['n'] < 100), sum(1 for r in hm if 5 <= r['n'] < 20), sum(1 for r in hm if 1 <= r['n'] < 5), sum(1 for r in hm if r['n'] == 0)))
print('HEADER (the record itself) flags:', len(header))
for h in header[:12]: print('   %s %s %s · %s' % (h['packet'], h['reader'], h['town'], str(h['why'])[:150]))
