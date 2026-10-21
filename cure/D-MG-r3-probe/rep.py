# exact, count-checked replacements: python3 rep.py <file> <pairs.py>; pairs.py defines PAIRS = [(old, new), ...]
import sys, runpy
path = sys.argv[1]
pairs = runpy.run_path(sys.argv[2])['PAIRS']
s = open(path, encoding='utf-8').read()
for i, (old, new) in enumerate(pairs):
    n = s.count(old)
    if n != 1:
        sys.exit(f'pair {i}: expected 1 occurrence, found {n}: {old[:80]!r}')
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print(f'applied {len(pairs)} replacements')
