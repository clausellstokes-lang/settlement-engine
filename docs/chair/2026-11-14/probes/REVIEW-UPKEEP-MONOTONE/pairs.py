# pairs.py: each Threat Assessment row on the Defense tab: (row, band chip, the prose line under it, masked of the town's name)
# counted at base and at tip; pairs (row, band, prose-template) the tip prints that the base never prints anywhere -> new pairings.
import gzip, re, os, json, collections, sys
S = '/tmp/claude-0/-home-user-settlement-engine/6df78bee-69c1-5d69-8635-8598a0eccd1d/scratchpad'
ROWS = ['Beasts & Monsters', 'Invasion & War', 'Internal Security', 'Economic Survival', 'Disasters & Famine']
def rows(t, f):
    s = json.load(gzip.open(f'{S}/out/{t}/{f[:-7]}.json.gz')); name = s.get('name') or '@@'
    cur = None; L = []
    for x in gzip.open(f'{S}/out/{t}/{f}', 'rt'):
        x = x.rstrip('\n'); m = re.match(r'^== (.*) ==$', x)
        if m: cur = m.group(1); continue
        if cur == 'tab:defense': L.append(x.strip())
    out = []
    for r in ROWS:
        if r in L:
            i = L.index(r); band = re.sub(r' [▼▲]$', '', L[i + 1]); pro = L[i + 2].replace(name, '{N}')
            pro = re.sub(r'\b(thorp|hamlet|village|town|city|metropolis)\b', '{T}', pro)
            out.append((r, band, pro))
    return out
pairs = {t: collections.defaultdict(list) for t in ('base', 'tip')}
for f in sorted(os.listdir(f'{S}/out/tip')):
    if not f.endswith('.txt.gz'): continue
    for t in ('base', 'tip'):
        for p in rows(t, f): pairs[t][p].append(f[:-7])
new = {p: v for p, v in pairs['tip'].items() if p not in pairs['base']}
print('pairs base', len(pairs['base']), 'tip', len(pairs['tip']), 'new at tip', len(new), 'births', len({s for v in new.values() for s in v}))
out = open(f'{S}/out/pairs.new.ndjson', 'w')
for p, v in sorted(new.items(), key=lambda kv: -len(kv[1])):
    out.write(json.dumps({'row': p[0], 'band': p[1], 'prose': p[2], 'n': len(v), 'seeds': v}) + '\n')
c = collections.Counter((p[0], p[1]) for p in new); print(c.most_common(20))
