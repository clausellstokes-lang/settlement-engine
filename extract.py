#!/usr/bin/env python3
"""Extract DS-DEF-2 pools/faces for three revisions; compute opener variety, craft metrics,
and a floor-2 lexical scan. Writes faces.json for the ledger renderer."""
import re, json, sys, statistics
S = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad'
REVS = {'shipped': 'f2da5a3ee', 'licence': '471ce894a', 'recut': 'a3e877e6e'}
STOP = set('the a an and or of to in at is are was be been it its this that with no not nor neither what for on by has have had as from'.split())

def parse(path):
    pools, cur = {}, None
    order = []
    for l in open(path):
        m = re.match(r'\*\*`([^`]+)`: (.+)\*\*\s*$', l)
        if m:
            cur = f'{m.group(1)}: {m.group(2)}'; pools[cur] = []; order.append(cur); continue
        m = re.match(r'\d+\. `\[(\w+)\]` (.+)', l) or re.match(r'\s*- `\[(face)\]` (.+)', l)
        if m and cur:
            pools[cur].append({'stance': m.group(1), 'text': m.group(2).strip()})
    return order, pools

def tok(x): return [w.lower().strip('.,;:?!') for w in x.split()]
def opener(x):
    t = tok(x)
    return ' '.join(t[:3])

F2_PAT = re.compile(r"\b(still|no longer|again|lately|these days|used to|since|for years|for a year|winters?|seasons?|each season|every (?:year|spring|season|night|day|morning)|most nights|often|seldom|always|never|constantly|already|yet|has (?:been|stood|come|turned|taken|built|not)|have (?:been|stood|never|not)|had|months?|weeks?|years?|dozen|hundred|forty|three|two|a few|handful|will |would not last|thinner|less each|more each|older|newer|grown|growing|begins eating|within)\b", re.I)

out = {}
for name, rev in REVS.items():
    order, pools = parse(f'{S}/def2-{rev}.md')
    out[name] = {'order': order, 'pools': pools}
    print(f'== {name} {rev}: {len(order)} pools, {sum(len(v) for v in pools.values())} faces')

# opener variety + craft metrics per pool per version
print('\n=== OPENER VARIETY (distinct first-3-word openers / faces) ===')
hdr = f"{'pool':58} | shipped | licence | recut"
print(hdr)
tot = {k: [0, 0] for k in REVS}
for pool in out['shipped']['order']:
    row = []
    for name in REVS:
        fs = out[name]['pools'].get(pool, [])
        ops = set(opener(f['text']) for f in fs)
        tot[name][0] += len(ops); tot[name][1] += len(fs)
        row.append(f'{len(ops):>2}/{len(fs):<2}')
    print(f'{pool[:58]:58} | {row[0]:^7} | {row[1]:^7} | {row[2]}')
print(f"{'TOTAL':58} | " + ' | '.join(f'{tot[n][0]}/{tot[n][1]}' for n in REVS))

print('\n=== CRAFT METRICS per re-cut pool (12-face pools only) ===')
print(f"{'pool':58} | types/content | top repeated content words | ,and%")
craft = {}
for pool in out['recut']['order']:
    fs = out['recut']['pools'][pool]
    if len(fs) < 12: continue
    c = [w for f in fs for w in tok(f['text']) if w not in STOP and w != '{settlement}']
    freq = {}
    for w in c: freq[w] = freq.get(w, 0) + 1
    top = sorted(freq.items(), key=lambda k: -k[1])[:6]
    conj = sum(1 for f in fs if re.search(r',\s+and\s', f['text']))
    ops = set(opener(f['text']) for f in fs)
    craft[pool] = {'types': len(set(c)), 'content': len(c), 'ratio': round(len(set(c))/len(c), 3), 'top': top, 'and': conj, 'openers': len(ops)}
    print(f"{pool[:58]:58} | {len(set(c)):>3}/{len(c):<3} {len(set(c))/len(c):.2f} | {', '.join(f'{k}x{v}' for k,v in top):48} | {conj}/12")

print('\n=== SAME for licence pools (for contrast) ===')
for pool in out['licence']['order']:
    fs = out['licence']['pools'][pool]
    c = [w for f in fs for w in tok(f['text']) if w not in STOP and w != '{settlement}']
    freq = {}
    for w in c: freq[w] = freq.get(w, 0) + 1
    top = sorted(freq.items(), key=lambda k: -k[1])[:6]
    print(f"{pool[:58]:58} | {len(set(c)):>3}/{len(c):<3} {len(set(c))/len(c):.2f} | {', '.join(f'{k}x{v}' for k,v in top)}")

print('\n=== FLOOR-2 LEXICAL SCAN (candidates only; adjudicated by hand) ===')
for name in REVS:
    print(f'--- {name}')
    for pool in out[name]['order']:
        for i, f in enumerate(out[name]['pools'][pool]):
            hits = sorted(set(m.group(0).lower() for m in F2_PAT.finditer(f['text'])))
            if hits: print(f'  [{pool[:40]}] #{i+1} {hits} :: {f["text"][:110]}')

json.dump({'faces': out, 'craft': craft}, open(f'{S}/faces.json', 'w'), indent=1)
