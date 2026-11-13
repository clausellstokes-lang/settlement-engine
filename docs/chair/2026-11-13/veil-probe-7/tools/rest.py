# rest.py <sql> : every line outside a function statement that is not a comment or blank
import sys, subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
p = sys.argv[1]; L = open(p, encoding='utf8').read().split('\n')
inside = set()
for s in filter(None, subprocess.run([sys.executable, '-I', os.path.join(here, 'spans.py'), p], capture_output=True, text=True).stdout.split('\n')):
    a, b, c, n = s.split(); inside.update(range(int(b)-1, int(c)))
for i, l in enumerate(L):
    if i in inside or not l.strip() or l.lstrip().startswith('--'): continue
    print(l)
