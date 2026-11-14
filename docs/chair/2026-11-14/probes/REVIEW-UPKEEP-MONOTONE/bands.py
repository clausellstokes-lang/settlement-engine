# REVIEW-UPKEEP-MONOTONE step 1 (L-band): every score band chip on every page surface against the record's own score, every birth.
# A row name followed (same line or next line) by a band word; the band must be scoreBand(record score).
# usage: python3 bands.py <dir> <out>
import sys, os, re, gzip, json, collections
D, OUT = sys.argv[1:3]
NAMES = {'Beasts & Monsters': 'monster', 'Monster Defense': 'monster', 'Invasion & War': 'military', 'Military Strength': 'military',
         'Internal Security': 'internal', 'Economic Survival': 'economic', 'Economic Resilience': 'economic',
         'Magical Capability': 'magical', 'Disasters & Famine': 'disaster'}
BANDS = {'STRONG', 'ADEQUATE', 'WEAK', 'CRITICAL'}
def band(n): return 'STRONG' if n >= 65 else 'ADEQUATE' if n >= 40 else 'WEAK' if n >= 20 else 'CRITICAL'
rx = re.compile(r'^(?:[-*• ]*\**)?(' + '|'.join(re.escape(k) for k in NAMES) + r')\**:?\**\s*(?:[-—:]\s*)?(\d+\s*(?:/\s*100)?\s*)?(Strong|Adequate|Weak|Critical|STRONG|ADEQUATE|WEAK|CRITICAL)?\b')
bad = []; seen = collections.Counter(); n = 0
for f in sorted(os.listdir(D)):
    if not f.endswith('.txt.gz'): continue
    seed = f[:-7]; s = json.load(gzip.open(os.path.join(D, seed + '.json.gz'))); sc = (s.get('defenseProfile') or {}).get('scores') or {}; n += 1
    cur = None; prev = None; lines = []
    for x in gzip.open(os.path.join(D, f), 'rt'):
        x = x.rstrip('\n'); m = re.match(r'^== (.*) ==$', x)
        if m: cur = m.group(1); continue
        if cur.startswith(('world-export', 'ai-grounding', 'register')): continue
        lines.append((cur, x.strip()))
    for i, (surf, x) in enumerate(lines):
        m = rx.match(x)
        if not m: continue
        key = NAMES[m.group(1)]; word = m.group(3)
        if not word and i + 1 < len(lines):
            m2 = re.match(r'^(\d+\s*)?(Strong|Adequate|Weak|Critical)( [▼▲])?$', lines[i + 1][1])
            if m2: word = m2.group(2)
        if not word: continue
        v = sc.get(key)
        if not isinstance(v, (int, float)): bad.append((seed, surf, x, word, 'no score', None)); continue
        seen[(surf, key)] += 1
        if word.upper() != band(v): bad.append((seed, surf, x[:80], word, key, v))
        if m.group(2):
            num = int(re.match(r'\d+', m.group(2)).group(0))
            if num != v: bad.append((seed, surf, x[:80], 'figure', key, v))
with open(OUT, 'w') as o:
    o.write(f'births {n}; chips read {sum(seen.values())}; disagreements {len(bad)}\n'); o.write(json.dumps({f'{a}|{b}': c for (a, b), c in seen.items()}) + '\n')
    for b in bad: o.write(json.dumps(b) + '\n')
print(n, sum(seen.values()), len(bad)); print(collections.Counter((b[1], b[4]) for b in bad).most_common(12))
