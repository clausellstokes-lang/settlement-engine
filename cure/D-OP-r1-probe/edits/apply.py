import sys, json
path = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_OP.md'
pairs_file = sys.argv[1]
src = open(path, encoding='utf-8').read()
ns = {}
exec(open(pairs_file, encoding='utf-8').read(), ns)
pairs = ns['PAIRS']
for i, (old, new) in enumerate(pairs):
    c = src.count(old)
    if c != 1:
        print(f'FAIL pair {i}: count={c} :: {old[:120]!r}')
        sys.exit(1)
for old, new in pairs:
    src = src.replace(old, new, 1)
open(path, 'w', encoding='utf-8').write(src)
print(f'applied {len(pairs)} pairs; size {len(src)}')
