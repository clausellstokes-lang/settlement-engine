# pdiff.py <dirA> <dirB>: every changed line pair across the keys, by section, classed by a normalised shape
import sys, os, difflib, re, collections as C
A, B = sys.argv[1], sys.argv[2]
shapes = C.Counter(); ex = {}
for k in sorted(os.listdir(A)):
    a = open(f'{A}/{k}').read().split('\n'); b = open(f'{B}/{k}').read().split('\n')
    sec = []; cur = '?'
    for l in a:
        if l.startswith('== '): cur = l
        sec.append(cur)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal': continue
        s = sec[i1] if i1 < len(sec) else sec[-1]
        old = ' | '.join(a[i1:i2]); new = ' | '.join(b[j1:j2])
        norm = lambda x: re.sub(r'\d+', '#', x)[:220]
        key = (s, op, norm(old), norm(new))
        shapes[key] += 1; ex.setdefault(key, k)
for (s, op, o, n), c in sorted(shapes.items(), key=lambda x: (x[0][0], -x[1])):
    print(f'{c:3d} {s} {op} [{ex[(s,op,o,n)]}]\n     - {o}\n     + {n}')
