#!/usr/bin/env python3
"""measure-block.py — THE BLOCK-GRAIN MEASUREMENT (ADDENDUM 18 ruling 1: reported with every round, never a refusal).
usage: measure-block.py <dock> <annex-path> '<block heading prefix>' [budget=1900] [base-rev=f2da5a3ee]
Prints, for the block: the SHIPPED rows at base-rev vs the rows in the WORKING TREE of the dock, at an equal token budget —
distinct words, content types, mean words per unit, the comma-and join rate, the {settlement} rate, and the per-pool content ratio
(distinct content words / content tokens, median over pools). Derived from the retro record's measure-prose.py (the audit that caused the re-cut)."""
import subprocess, re, sys, statistics, os
STOP = set('the a an and or of to in at is are was be been it its this that with no not nor neither what for on by has have had as from'.split())
def block_lines(text, head):
    t = text.split('\n'); s = [i for i,l in enumerate(t) if l.startswith(head)]
    if not s: return []
    s = s[0]; after = [i for i,l in enumerate(t) if i > s and l.startswith('### ')]
    return t[s:(after[0] if after else len(t))]
def pools_of(lines):
    pools, cur = {}, None
    for l in lines:
        m = re.match(r'^\*\*(.+)\*\*\s*$', l.strip())
        if m: cur = m.group(1); pools.setdefault(cur, []); continue
        m = re.match(r'\s*- `\[face\]` (.+)', l) or re.match(r'\d+\. `\[\w+\]` (.+)', l)
        if m and cur is not None: pools[cur].append(re.sub(r'<!--.*?-->', '', m.group(1)).strip())
    return pools
def tok(xs): return [w.lower().strip('.,;:?!') for x in xs for w in x.split()]
def upto(xs, b):
    a, n = [], 0
    for x in xs:
        a.append(x); n += len(x.split())
        if n >= b: break
    return a
def report(label, pools, budget):
    p = [u for us in pools.values() for u in us]
    if not p: print(f'{label}: no units'); return
    q = upto(p, budget); t = tok(q); c = [w for w in t if w not in STOP]
    conj = sum(1 for x in q if re.search(r',\s+and\s', x)); sett = sum(x.count('{settlement}') for x in p)
    ratios = []
    for us in pools.values():
        ct = [w for w in tok(us) if w not in STOP]
        if ct: ratios.append(len(set(ct)) / len(ct))
    print(f"{label}: pools {len(pools)} | units {len(p)} | sample {len(q)}u/{len(t)}tok | DISTINCT {len(set(t))} | content types {len(set(c))} | mean words {statistics.mean([len(x.split()) for x in p]):.1f} | ',and' joins {100*conj/len(q):.0f}% | {{settlement}} per unit {sett/len(p):.2f} | pool content ratio median {statistics.median(ratios):.2f}")
if __name__ == '__main__':
    dock, annex, head = sys.argv[1:4]
    budget = int(sys.argv[4]) if len(sys.argv) > 4 else 1900
    base = sys.argv[5] if len(sys.argv) > 5 else 'f2da5a3ee'
    shipped = subprocess.run(['git','-C',dock,'show',base+':'+annex],capture_output=True,text=True).stdout
    tree = open(os.path.join(dock, annex)).read()
    report('SHIPPED  ' + base, pools_of(block_lines(shipped, head)), budget)
    report('TREE     ' + dock.split('/')[-1], pools_of(block_lines(tree, head)), budget)
