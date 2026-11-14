#!/usr/bin/env python3
# READ-ALL: the first and the second read made one list (a sentence is one row whichever read flagged it; the graver severity stands).
# usage: union_reads.py <merge dir of read 1> <merge dir of read 2> <out dir>
import io, os, sys, json, collections
A, B, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
SEV = {'HIGH': 3, 'MED': 2, 'LOW': 1}
rows = collections.OrderedDict()
def take(path, tag):
    for r in json.load(io.open(path + '/flagged.sentences.json', encoding='utf-8')):
        f = r['fold']; r = dict(r); r['read'] = [tag]; r['id'] = r['id'] if tag == '1' else 'B' + str(r['id'])
        if f in rows:
            o = rows[f]
            if SEV.get(r['sev'], 0) > SEV.get(o['sev'], 0): o['sev'] = r['sev']; o['text'] = r['text'] or o['text']; o['town'] = r['town'] or o['town']
            o['kinds'] = sorted(set(o['kinds']) | set(r['kinds'])); o['whys'] = o['whys'] + r['whys']; o['packets'] = sorted(set(o['packets']) | set('2:' + p for p in r['packets'])); o['read'] = sorted(set(o['read']) | {tag})
        else: rows[f] = r
take(A, '1'); take(B, '2')
# THE CHAIR'S OWN STRIKES (2026-11-14): flags that rest on a fault of the second read's header, not of the page.
import re
STRIKES = [
 (re.compile(r'Pressured'), re.compile(r'Secure'), "the second read's header gave the record's OLD food label as 'the food word'; since the food word's cure every surface prints one word from the food record's band: 'Pressured' beside a label 'Secure' is the header's fault, not the page's"),
 (re.compile(r'campaign advances|re-judged as the campaign'), re.compile(r'.'), "an interface note, printed in every town"),
]
struck = []
for f in list(rows):
    r = rows[f]
    for tx, wy, why in STRIKES:
        if tx.search(r['text'] or '') and wy.search(' '.join(r['whys'])) and r['read'] == ['2']:
            r['struck'] = why; struck.append(r); del rows[f]; break
json.dump(struck, io.open(OUT + '/chair-struck.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('STRUCK BY THE CHAIR (the header\'s fault): %d sentences printing %d times' % (len(struck), sum(r['n'] for r in struck)))
R = sorted(rows.values(), key=lambda r: (-SEV.get(r['sev'], 0), -r['n']))
json.dump(R, io.open(OUT + '/flagged.sentences.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
fa = json.load(io.open(A + '/flags.all.json', encoding='utf-8')); fb = json.load(io.open(B + '/flags.all.json', encoding='utf-8'))
for f in fb: f['packet'] = '2:' + str(f.get('packet'))
json.dump(fa + fb, io.open(OUT + '/flags.all.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
c = collections.Counter(r['sev'] for r in R); both = sum(1 for r in R if len(r['read']) == 2)
print('UNION: %d sentences · %s · flagged by both reads %d · only the first %d · only the second %d' % (len(R), dict(c), both, sum(1 for r in R if r['read'] == ['1']), sum(1 for r in R if r['read'] == ['2'])))
hm = [r for r in R if r['sev'] in ('HIGH', 'MED')]
print('HIGH+MED %d · in >=20 towns %d · towns printing (sum) %d' % (len(hm), sum(1 for r in hm if r['n'] >= 20), sum(r['n'] for r in hm)))
