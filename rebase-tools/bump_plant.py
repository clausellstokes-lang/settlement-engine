#!/usr/bin/env python3
"""Bump ONE INSTR plant's `# NN.` COMMENT NUMBER by +1. Nothing else on the line
and nothing else in the file is touched; the label lives on the check_caught line."""
import re, sys
path, car, old = sys.argv[1], sys.argv[2], int(sys.argv[3])
txt = open(path, encoding='utf-8').read()
needle = '# %d. INSTR-912 car %s ' % (old, car)
n = txt.count('\n' + needle)
assert n == 1, 'expected 1 header, found %d' % n
txt = txt.replace('\n' + needle, '\n# %d. INSTR-912 car %s ' % (old + 1, car), 1)
open(path, 'w', encoding='utf-8').write(txt)
print('bumped car %s: #%d -> #%d' % (car, old, old + 1))
