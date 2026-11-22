#!/usr/bin/env python3
# READ-ALL: what is NEW on each town's page since an earlier inventory: a pruned copy of a census out-dir whose dumps hold, for every
# town, only the parts (sentences, pills) whose (fold, town) pair the earlier inventory does not hold: a new sentence, or an old one
# that now prints in a town where it did not (an inheritor). The packet builder then shows each once under the hardest such town.
# usage: [SURFACES=PDF,Journal] prune_dumps.py <census out-dir> <before inventory.json> <dest out-dir>
import io, re, os, sys, json, gzip, collections
OUT, BEFORE, DEST = sys.argv[1:4]
TABS = tuple((os.environ.get('SURFACES') or 'World,Systems,Summary,Table').split(','))
B = {f: set(v['towns']) for f, v in json.load(io.open(BEFORE, encoding='utf-8')).items()}
# ADDED 2026-11-15: MINW=<n> with AFTER=<the inventory of this census>: keep only a sentence that prints in n towns or more NOW (the wide new lines:
# a new line in one town is read with its town, not here).
MINW = int(os.environ.get('MINW') or 0)
A = {f: len(v['towns']) for f, v in json.load(io.open(os.environ['AFTER'], encoding='utf-8')).items()} if MINW else {}
os.makedirs(DEST + '/dumps', exist_ok=True)
if not os.path.exists(DEST + '/corpus.ndjson.gz'): os.symlink(os.path.abspath(OUT + '/corpus.ndjson.gz'), DEST + '/corpus.ndjson.gz')
src = io.open(os.path.dirname(os.path.abspath(__file__)) + '/inventory.py', encoding='utf-8').read()
# the inventory's own folding, taken from its source so the two cannot drift
ns_ = {'re': re, 'collections': collections}
exec(src[src.index('def names_of(s):'):src.index('inv=collections.defaultdict(set)')], ns_)
names_of, fold, parts_of = ns_['names_of'], ns_['fold'], ns_['parts_of']
MARKP = re.compile(r'^(Stopped by [^.]*\.|Curtailed by [^.]*\.|Scarce in [^.]*\.|Short of [^.]*\.)$')
kept = collections.Counter(); newfolds = set(); gained = set()
for l in gzip.open(OUT + '/corpus.ndjson.gz', 'rt', encoding='utf-8'):
    o = json.loads(l); seed = o['seed']; s = o['s']
    ns = names_of(s); pat = re.compile('|'.join(re.escape(n) for n in ns)) if ns else None
    try: fh = io.open('%s/dumps/%s.txt' % (OUT, seed), encoding='utf-8')
    except OSError: continue
    out = []; cur = None; wrote_head = False
    for line in fh:
        line = line.rstrip('\n')
        if line.startswith('== '):
            cur = line; wrote_head = False; continue
        if not line or line.startswith('[STYLE]') or not cur or cur.strip('= ').strip().split('/')[0] not in TABS: continue
        prev_mark = None
        for p in parts_of(line):
            if MARKP.match(p.strip()): prev_mark = p.strip(); continue      # a crisis mark is kept only with the part it opens (below)
            f = fold(p, pat); mk = prev_mark; prev_mark = None
            if not f or seed in B.get(f, ()): continue
            if MINW and A.get(f, 0) < MINW: continue
            if not wrote_head: out.append(cur); wrote_head = True
            out.append((mk + ' ' + p) if mk else p); kept[seed] += 1
            (gained if f in B else newfolds).add(f)
    io.open('%s/dumps/%s.txt' % (DEST, seed), 'w', encoding='utf-8').write('\n'.join(out) + ('\n' if out else ''))
print('towns with something new: %d of %d · new (sentence, town) pairs %d · sentences new everywhere %d · old sentences in a new town %d' % (sum(1 for v in kept.values() if v), len(kept) or 720, sum(kept.values()), len(newfolds), len(gained)))
