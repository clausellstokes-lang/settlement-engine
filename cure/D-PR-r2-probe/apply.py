# D-PR-r2: all-or-nothing exact replacement helper for the PR volume (each old string must occur exactly once).
import sys, importlib.util
PATH = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
def apply(pairs, label):
    s = open(PATH, encoding='utf-8').read()
    for i, (old, new) in enumerate(pairs):
        n = s.count(old)
        if n != 1:
            print(f'{label}: FAIL pair {i}: count={n}: {old[:100]!r}')
            sys.exit(1)
        s = s.replace(old, new)
    open(PATH, 'w', encoding='utf-8').write(s)
    print(f'{label}: applied {len(pairs)} pairs')
if __name__ == '__main__':
    spec = importlib.util.spec_from_file_location('batch', sys.argv[1])
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    apply(mod.PAIRS, sys.argv[1].rsplit('/', 1)[-1])
