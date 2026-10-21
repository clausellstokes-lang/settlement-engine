import sys
VOL = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_OP.md'
def apply(pairs, label):
    s = open(VOL, encoding='utf-8').read()
    for i, (old, new) in enumerate(pairs):
        n = s.count(old)
        if n != 1:
            print(f'{label} pair {i}: anchor count {n} -- ABORT', file=sys.stderr)
            print(old[:200], file=sys.stderr)
            sys.exit(1)
        s = s.replace(old, new)
    open(VOL, 'w', encoding='utf-8').write(s)
    print(f'{label}: {len(pairs)} edits applied')

def replace_line(prefix, new, label):
    s = open(VOL, encoding='utf-8').read()
    lines = s.split('\n')
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    if len(hits) != 1:
        print(f'{label}: prefix hits {len(hits)} -- ABORT', file=sys.stderr); sys.exit(1)
    lines[hits[0]] = new
    open(VOL, 'w', encoding='utf-8').write('\n'.join(lines))
    print(f'{label}: line {hits[0]+1} replaced')
