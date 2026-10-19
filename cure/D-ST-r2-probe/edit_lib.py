import sys
F = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_ST.md'
def apply(pairs, label):
    s = open(F, encoding='utf-8').read()
    for i, (old, new) in enumerate(pairs):
        n = s.count(old)
        if n != 1:
            print(f'[{label}#{i}] FAIL count={n}: {old[:120]!r}')
            sys.exit(1)
        s = s.replace(old, new)
    open(F, 'w', encoding='utf-8').write(s)
    print(f'[{label}] applied {len(pairs)} edits')
