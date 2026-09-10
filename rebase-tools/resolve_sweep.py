#!/usr/bin/env python3
"""Resolve ONE conflict region in scripts/mutation-sweep.sh: keep BOTH sides,
HEAD (§913) first, then INSTR's block with its `# NN.` plant COMMENT NUMBERS
bumped by +1 (labels and every other byte untouched)."""
import re, sys

path = sys.argv[1]
lines = open(path, encoding='utf-8').read().split('\n')
starts = [i for i, l in enumerate(lines) if l.startswith('<<<<<<< ')]
mids   = [i for i, l in enumerate(lines) if l == '=======']
ends   = [i for i, l in enumerate(lines) if l.startswith('>>>>>>> ')]
assert len(starts) == len(mids) == len(ends) == 1, (starts, mids, ends)
s, m, e = starts[0], mids[0], ends[0]
head  = lines[s+1:m]
other = lines[m+1:e]

bumped = 0
out_other = []
for l in other:
    mo = re.match(r'^# (\d+)\. (INSTR-912 car .*)$', l)
    if mo:
        out_other.append('# %d. %s' % (int(mo.group(1)) + 1, mo.group(2)))
        bumped += 1
    else:
        out_other.append(l)

lines[s:e+1] = head + [''] + out_other
open(path, 'w', encoding='utf-8').write('\n'.join(lines))
print('kept HEAD %d lines + INSTR %d lines; plant comments bumped: %d' % (len(head), len(out_other), bumped))
