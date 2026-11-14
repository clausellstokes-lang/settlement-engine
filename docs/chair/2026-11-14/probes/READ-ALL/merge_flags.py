#!/usr/bin/env python3
# READ-ALL: the readers' flags merged, joined to the inventory (how many towns print each sentence), ranked,
# and the read's recall measured on the calibration pages against the bar's first read.
# usage: merge_flags.py <packets dir (index.json, *.txt)> <repo with the readers' branches fetched> <bar list json> <bar dumps dir> <out dir>
import io, re, os, sys, json, glob, subprocess, collections
PK, REPO, BARLIST, BARDUMPS, OUT = sys.argv[1:6]
os.makedirs(OUT, exist_ok=True)
idx = json.load(io.open(PK + '/index.json', encoding='utf-8'))
ids, cal = idx['ids'], idx['cal']
SEV = {'HIGH': 3, 'MED': 2, 'MEDIUM': 2, 'LOW': 1}
packets = sorted(os.path.basename(p)[:-4] for p in glob.glob(PK + '/*.txt'))
# the text each id was shown with (as printed in the block's town)
shown = {}
for p in packets:
    town = None
    for line in io.open('%s/%s.txt' % (PK, p), encoding='utf-8'):
        m = re.match(r'==== TOWN (\S+)', line)
        if m: town = m.group(1); continue
        m = re.match(r'(C?\d{4,5}) (?:\[[^\]]*\] )?(.*)$', line.rstrip('\n'))
        if m: shown[(p, m.group(1))] = (town, m.group(2))
flags = []; status = {}
for p in packets:
    # crisis-07's file is on the crisis-06 branch; SUFFIX=-s reads the next model down's calibration branches; FLAGS_DIR reads local files
    br = 'origin/lane/read-all-2026-11-14-' + ('crisis-06' if p == 'crisis-07' else p) + (os.environ.get('SUFFIX', '') if p.startswith('cal') else '')
    try:
        if os.environ.get('FLAGS_DIR'): txt = io.open('%s/%s.flags.jsonl' % (os.environ['FLAGS_DIR'], p), encoding='utf-8').read()
        else: txt = subprocess.check_output(['git', '-C', REPO, 'show', '%s:docs/chair/2026-11-14/read-all/%s.flags.jsonl' % (br, p)], stderr=subprocess.DEVNULL).decode('utf-8')
    except (subprocess.CalledProcessError, OSError):
        status[p] = 'NO FILE'; continue
    n = 0; bad = 0; done = ''
    for line in txt.split('\n'):
        line = line.strip()
        if not line: continue
        try: o = json.loads(line)
        except Exception: bad += 1; continue
        i = str(o.get('id', ''))
        if i in ('DONE', 'STOPPED'): done = json.dumps(o); continue
        o['packet'] = p; o['sev'] = str(o.get('sev', '')).upper().replace('MEDIUM', 'MED'); o['kind'] = str(o.get('kind', '')).upper()
        t = shown.get((p, i))
        o['text'] = t[1] if t else ''; o['block_town'] = t[0] if t else ''
        o['known_id'] = bool(t) or i == 'HEADER'
        flags.append(o); n += 1
    status[p] = '%d flags%s%s' % (n, (' · %d unparsed lines' % bad) if bad else '', ' · ' + done if done else ' · NOT DONE')
json.dump(flags, io.open(OUT + '/flags.all.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('PACKETS:'); [print('  %-10s %s' % (p, status[p])) for p in packets]
main = [f for f in flags if not f['packet'].startswith('cal')]
print('FLAGS on the 720: %d · by severity %s · by kind %s · ids unknown %d' % (len(main), dict(collections.Counter(f['sev'] for f in main)), dict(collections.Counter(f['kind'] for f in main)), sum(1 for f in main if not f['known_id'])))
# ---- one row a sentence
rows = {}
for f in main:
    i = str(f['id'])
    if i not in ids: continue
    r = rows.setdefault(i, {'id': i, 'sev': 'LOW', 'kinds': set(), 'whys': [], 'packets': set(), 'text': f['text'], 'town': f.get('town') or f['block_town'], 'n': len(ids[i]['towns']), 'sections': ids[i]['sections'], 'fold': ids[i]['fold']})
    if SEV.get(f['sev'], 0) > SEV.get(r['sev'], 0): r['sev'] = f['sev']
    r['kinds'].add(f['kind']); r['whys'].append('%s: %s' % (f['packet'], f.get('why', ''))); r['packets'].add(f['packet'])
R = sorted(rows.values(), key=lambda r: (-SEV.get(r['sev'], 0), -r['n']))
for r in R: r['kinds'] = sorted(r['kinds']); r['packets'] = sorted(r['packets'])
json.dump(R, io.open(OUT + '/flagged.sentences.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
bysev = collections.Counter(r['sev'] for r in R)
print('DISTINCT SENTENCES FLAGGED: %d of %d · %s · printing in towns (sum) %d' % (len(R), len(ids), dict(bysev), sum(r['n'] for r in R)))
for sev in ('HIGH', 'MED'):
    rs = [r for r in R if r['sev'] == sev]
    print('  %s: %d sentences; in >=20 towns %d; in 5-19 %d; in 2-4 %d; in 1 %d' % (sev, len(rs), sum(1 for r in rs if r['n'] >= 20), sum(1 for r in rs if 5 <= r['n'] < 20), sum(1 for r in rs if 2 <= r['n'] < 5), sum(1 for r in rs if r['n'] == 1)))
bysec = collections.Counter()
for r in R:
    if r['sev'] in ('HIGH', 'MED'):
        for s in r['sections']: bysec[s] += 1
print('  HIGH+MED by section:', ', '.join('%s %d' % kv for kv in bysec.most_common(14)))
with io.open(OUT + '/TOP.md', 'w', encoding='utf-8') as fh:
    fh.write('| sev | towns | id | sections | sentence (as shown) | why |\n|---|---|---|---|---|---|\n')
    for r in sorted(R, key=lambda r: (-(r['sev'] in ('HIGH', 'MED')), -r['n']))[:400]:
        fh.write('| %s | %d | %s | %s | %s | %s |\n' % (r['sev'], r['n'], r['id'], ', '.join(r['sections'])[:60], r['text'][:240].replace('|', '/'), r['whys'][0][:200].replace('|', '/')))
# ---- calibration: the bar's rows that still print word for word, and whether a reader flagged them
def norm(s): return re.sub(r'\s+', ' ', str(s).replace('‘', "'").replace('’', "'").replace('“', '"').replace('”', '"')).strip()
def fig(s): return re.sub(r'\d[\d,.]*', '#', s)
L = json.load(io.open(BARLIST, encoding='utf-8'))
pages = {}
def page(seed):
    if seed not in pages:
        try: pages[seed] = [fig(norm(l)) for l in io.open('%s/%s.txt' % (BARDUMPS, seed), encoding='utf-8').read().split('\n') if l and not l.startswith('== ') and not l.startswith('[STYLE]')]
        except Exception: pages[seed] = None
    return pages[seed]
calflag = collections.defaultdict(list)      # town -> [(normalised text, flag)]
for f in flags:
    if f['packet'].startswith('cal') and str(f['id']) in cal:
        c = cal[str(f['id'])]; calflag[c['town']].append((fig(norm(c['text'])), f))
res = collections.Counter(); missed = []; hit_ids = set()
for r in L:
    if r.get('severity') not in ('HIGH', 'MED'): continue
    p = page(r['town'])
    if p is None: res['nopage'] += 1; continue
    s = fig(norm(r['sentence']))
    prints = any(s in l for l in p) if len(s) > 12 else any(l == s for l in p)
    if not prints: res[r['severity'] + ' gone'] += 1; continue
    # a reader caught the row if it flagged a calibration sentence that the row's sentence contains or is contained in
    got = [f for (t, f) in calflag.get(r['town'], []) if len(t) > 12 and (t in s or s in t)]
    if got: res[r['severity'] + ' printing, FLAGGED'] += 1; hit_ids.update(str(f['id']) for f in got)
    else: res[r['severity'] + ' printing, missed'] += 1; missed.append(r)
print('CALIBRATION (the bar\'s ten pages):', dict(res))
calf = [f for f in flags if f['packet'].startswith('cal')]
new = [f for f in calf if str(f['id']) not in hit_ids and f['sev'] in ('HIGH', 'MED')]
print('  flags on the ten pages: %d (%s); HIGH/MED flags that match no bar row still printing: %d' % (len(calf), dict(collections.Counter(f['sev'] for f in calf)), len(new)))
json.dump({'missed': missed, 'new': new}, io.open(OUT + '/calibration.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
bk = collections.Counter((r.get('kind'), r.get('tab')) for r in missed)
print('  missed rows by the bar\'s kind and tab:', ', '.join('%s/%s %d' % (k[0], k[1], v) for k, v in bk.most_common(12)))
