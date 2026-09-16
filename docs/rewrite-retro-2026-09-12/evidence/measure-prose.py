#!/usr/bin/env python3
"""measure-prose.py — THE AUDIT THAT CAUSED THE RE-CUT, re-runnable.

Prints, for a block, the vocabulary and construction figures of the SHIPPED rows
against a later revision, at an EQUAL TOKEN BUDGET (the type/token ratio falls with
length, so an unequal comparison would flatter the shorter text).

  python3 measure-prose.py <dock> <annex-path> <block-heading> <next-heading> <revA> <revB> [budget]

The figures in brief ADDENDUM 14 came from:
  DS-DEF-2 : dock laneRW-DEF2, f2da5a3ee vs 471ce894a, budget 1900
  DS-DEF-11: dock laneRW-DEF11, f73bdbf16 vs 5cfc02000, budget 1200
"""
import subprocess, re, sys, statistics

def units(dock, annex, rev, head, nxt):
    t = subprocess.run(['git','-C',dock,'show',rev+':'+annex],capture_output=True,text=True).stdout.split('\n')
    s = [i for i,l in enumerate(t) if l.startswith(head)][0]
    after = [i for i,l in enumerate(t) if i > s and l.startswith(nxt)]
    e = after[0] if after else len(t)
    out = []
    for l in t[s:e]:
        m = re.match(r'\s*- `\[face\]` (.+)', l) or re.match(r'\d+\. `\[\w+\]` (.+)', l)
        if m: out.append(m.group(1))
    return out

STOP = set('the a an and or of to in at is are was be been it its this that with no not nor neither what for on by has have had as from'.split())
def tok(xs): return [w.lower().strip('.,;:?!') for x in xs for w in x.split()]
def upto(xs, b):
    a, n = [], 0
    for x in xs:
        a.append(x); n += len(x.split())
        if n >= b: break
    return a

def report(label, p, budget):
    q = upto(p, budget); t = tok(q); c = [w for w in t if w not in STOP]
    conj = sum(1 for x in q if re.search(r',\s+and\s', x))
    print(f"{label}: units {len(p)} | sample {len(q)}u/{len(t)}tok | DISTINCT {len(set(t))} | content types {len(set(c))} "
          f"| mean words {statistics.mean([len(x.split()) for x in p]):.1f} | ',and' joins {100*conj/len(q):.0f}%")
    freq = {}
    for w in c: freq[w] = freq.get(w, 0) + 1
    print('   top content words:', ', '.join(f'{k} x{v}' for k, v in sorted(freq.items(), key=lambda k: -k[1])[:8]))

if __name__ == '__main__':
    dock, annex, head, nxt, revA, revB = sys.argv[1:7]
    budget = int(sys.argv[7]) if len(sys.argv) > 7 else 1900
    report('SHIPPED  ' + revA, units(dock, annex, revA, head, nxt), budget)
    report('AFTER    ' + revB, units(dock, annex, revB, head, nxt), budget)
