# fdiff.py <old sql> <new sql> : per function name, NEW / CHANGED / SAME / GONE (statement text, lead comments excluded)
import sys, subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
def stmts(p):
    L = open(p, encoding='utf8').read().split('\n')
    spans = subprocess.run([sys.executable, '-I', os.path.join(here, 'spans.py'), p], capture_output=True, text=True).stdout.split('\n')
    d = {}
    for s in filter(None, spans):
        a, b, c, n = s.split(); assert n not in d, n
        d[n] = '\n'.join(L[int(b)-1:int(c)])
    return d
o, n = stmts(sys.argv[1]), stmts(sys.argv[2])
for k in n:
    print(('NEW' if k not in o else 'CHANGED' if o[k] != n[k] else 'SAME'), k)
for k in o:
    if k not in n: print('GONE', k)
