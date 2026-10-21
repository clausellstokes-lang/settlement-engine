#!/usr/bin/env python3
"""Insert-only helper: ins.py <file> <anchor-file> <text-file> [before]
Inserts text immediately AFTER (or BEFORE) the unique anchor; asserts exactly one match."""
import sys
f, af, tf = sys.argv[1:4]
before = len(sys.argv) > 4 and sys.argv[4] == 'before'
s = open(f, encoding='utf-8').read()
a = open(af, encoding='utf-8').read().rstrip('\n')
t = open(tf, encoding='utf-8').read().rstrip('\n')
n = s.count(a)
if n != 1:
    sys.exit(f'ANCHOR COUNT {n} != 1 in {f}')
i = s.index(a)
j = i if before else i + len(a)
s2 = s[:j] + t + s[j:]
open(f, 'w', encoding='utf-8').write(s2)
print(f'inserted {len(t)} chars {"before" if before else "after"} anchor at offset {i}')
