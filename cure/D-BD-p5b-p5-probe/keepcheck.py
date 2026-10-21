import difflib, sys
a = open(sys.argv[1]).read().splitlines(); b = open(sys.argv[2]).read().splitlines()
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
low = 0; changed = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag in ('replace', 'delete'):
        for k in range(i1, i2):
            changed += 1
            old = a[k]; best = max((difflib.SequenceMatcher(None, old, b[j]).find_longest_match(0, len(old), 0, len(b[j])).size for j in range(j1, j2)), default=0)
            # every old word kept, in order?
            ow = old.split(); kept = sum(1 for w in ow if any(w in b[j] for j in range(j1, j2)))
            r = kept / max(1, len(ow))
            if r < 0.95: low += 1; print('LOW', k+1, round(r, 3))
print('old lines changed', changed, '· below 95% word-kept', low)
