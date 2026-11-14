#!/usr/bin/env python3
# READ-ALL: each flagged sentence traced to its writer in the counted tree (the census's own tracer, writers2.mjs),
# given to the lane that holds the writer's file, and written out as one worklist a lane, widest first.
# usage: trace_flags.py <merge out dir (flagged.sentences.json)> <census out-dir (corpus.ndjson.gz)> <tree> <census probes dir> <out dir>
import io, os, sys, json, subprocess, collections
MERGED, CENSUS, TREE, PROBES, OUT = sys.argv[1:6]
os.makedirs(OUT, exist_ok=True)
R = json.load(io.open(MERGED + '/flagged.sentences.json', encoding='utf-8'))
R = [r for r in R if r['sev'] in ('HIGH', 'MED')]
hits = [{'pattern': 'R', 'sub': (r['kinds'] or ['?'])[0], 'why': r['whys'][0].split(': ', 1)[-1], 'seed': r['town'], 'view': (r['sections'] or ['?'])[0], 'vtab': (r['sections'] or ['?'])[0],
         'surface': 'tab', 'line': r['text'], 'norm': r['text'], 'rid': r['id'], 'n': r['n'], 'sev': r['sev'], 'fold': r['fold'], 'kinds': r['kinds'], 'packets': r['packets']} for r in R if r.get('text')]
json.dump(hits, io.open(OUT + '/hits.json', 'w', encoding='utf-8'), ensure_ascii=False)
link = OUT + '/corpus.ndjson.gz'
if not os.path.exists(link): os.symlink(CENSUS + '/corpus.ndjson.gz', link)
env = dict(os.environ, TREE=TREE, OUT=OUT)
print(subprocess.run(['node', PROBES + '/writers2.mjs'], env=env, capture_output=True, text=True).stdout.strip()[-300:])
H = json.load(io.open(OUT + '/hits.json', encoding='utf-8'))
hold = json.load(io.open(PROBES + '/holders.tipA.json', encoding='utf-8'))
PARENT = {'rbs': 'rb', 'wse': 'wr', 'wsr': 'wr', 'wcs': 'wc', 'fh': 'fd', 'uc': 'up', 'um': 'up', 'bd': 'wr', 'vl': 'vl'}
NAME = {'up': 'defence (coherence-upkeep)', 'pw': 'powers', 'ra': 'r2-code-a', 'rb': 'r2-code-b', 'rc': 'r3-code-c', 'rt': 'r3-tabs', 'wc': 'leaves (w2-c-leaves)', 'fd': 'data (w2-fix-data)',
        'wr': 'corpus (w2-write)', 'js': 'surfaces', 'jn': 'no-lane', 'vl': 'veil', '-': 'NO HOLDER (no-lane)', '?': 'UNTRACED'}
byfile = collections.defaultdict(set)
for k, v in hold.items():
    if k.startswith('_'): continue
    for f in v.get('files', []): byfile[f].add(PARENT.get(k, k))
lanes = collections.defaultdict(list)
for h in H:
    w = h.get('writer') or {}; f = w.get('file') or '(untraced)'
    hs = sorted(byfile.get(f, [])) if f != '(untraced)' else ['?']
    if f != '(untraced)' and not hs: hs = ['-']
    h['holders'] = hs
    # the corpus's generated leaves and their source document are the corpus lane's whoever else touched them
    if 'dossierStateProse' in f or f.startswith('docs/content/'): hs = ['wr']
    lanes[hs[0] if len(hs) == 1 else '+'.join(hs)].append(h)
json.dump(H, io.open(OUT + '/traced.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('TRACED: %d flagged sentences (HIGH+MED); untraced %d' % (len(H), sum(1 for h in H if (h.get('writer') or {}).get('file') in (None, '(untraced)'))))
for lane, hs in sorted(lanes.items(), key=lambda kv: -sum(h['n'] for h in kv[1])):
    hs.sort(key=lambda h: (-(h['sev'] == 'HIGH'), -h['n']))
    nm = '+'.join(NAME.get(x, x) for x in lane.split('+'))
    writers = collections.Counter((h['writer'].get('file', '?') + ' :: ' + str(h['writer'].get('fn', ''))) if h.get('writer') else '?' for h in hs)
    print('  %-34s sentences %4d (HIGH %3d) · towns printing (sum) %6d · writers %3d' % (nm[:34], len(hs), sum(1 for h in hs if h['sev'] == 'HIGH'), sum(h['n'] for h in hs), len(writers)))
    json.dump([{'id': h['rid'], 'sev': h['sev'], 'n': h['n'], 'town': h['seed'], 'section': h['view'], 'fold': h['fold'], 'text': h['line'], 'why': h['why'], 'kinds': h['kinds'],
                'writer': {k: (h.get('writer') or {}).get(k) for k in ('file', 'line', 'fn')}} for h in hs], io.open('%s/WORKLIST-%s.json' % (OUT, lane.replace('+', '_').replace('?', 'UNTRACED').replace('-', 'NOHOLDER')), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    with io.open('%s/WORKLIST-%s.md' % (OUT, lane.replace('+', '_').replace('?', 'UNTRACED').replace('-', 'NOHOLDER')), 'w', encoding='utf-8') as fh:
        fh.write('# READ-ALL worklist · %s\n\n%d flagged sentences (HIGH %d), each a CANDIDATE a reader flagged against one town\'s facts: verify it where it prints before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside).\n\n' % (nm, len(hs), sum(1 for h in hs if h['sev'] == 'HIGH')))
        fh.write('## By writer (flagged sentences · towns printing, summed)\n\n')
        agg = collections.defaultdict(lambda: [0, 0])
        for h in hs:
            k = (h['writer'].get('file', '?') + ' :: ' + str(h['writer'].get('fn', ''))) if h.get('writer') else '?'
            agg[k][0] += 1; agg[k][1] += h['n']
        for k, (c, n) in sorted(agg.items(), key=lambda kv: -kv[1][1])[:80]: fh.write('- %s · %d · %d\n' % (k, c, n))
        fh.write('\n## The sentences\n\n| sev | towns | id | section | town read in | sentence | what the reader said | writer |\n|---|---|---|---|---|---|---|---|\n')
        for h in hs:
            w = h.get('writer') or {}
            fh.write('| %s | %d | %s | %s | %s | %s | %s | %s:%s %s |\n' % (h['sev'], h['n'], h['rid'], h['view'], h['seed'], h['line'][:300].replace('|', '/'), h['why'][:220].replace('|', '/'), w.get('file', '?'), w.get('line', ''), str(w.get('fn', ''))[:60]))
