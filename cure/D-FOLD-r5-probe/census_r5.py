# D-FOLD-r5 token census on master (read-only). A "quoted" hit: the word directly inside ' " or `.
import os, re, sys
root = sys.argv[1]
words = sys.argv[2:]
def files(sub):
    for dp, dn, fn in os.walk(os.path.join(root, sub)):
        dn[:] = [d for d in dn if d != 'node_modules']
        for f in fn:
            if f.endswith(('.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx')):
                yield os.path.join(dp, f)
for w in words:
    q = re.compile(r"[\'\"`]" + re.escape(w) + r"[\'\"`]")
    pre = re.compile(r"[\'\"`]" + re.escape(w))
    out = []
    for sub in ('src', 'tests'):
        nq = npre = 0; ex = []
        for p in files(sub):
            try: t = open(p, encoding='utf-8', errors='ignore').read()
            except Exception: continue
            if q.search(t): nq += 1; ex.append(os.path.relpath(p, root))
            elif w.endswith(':') and pre.search(t): npre += 1; ex.append(os.path.relpath(p, root))
        out.append(f"{sub} {nq if not w.endswith(':') else npre}" + (f" (e.g. {ex[0]})" if ex else ''))
    print(f"{w}: " + ' · '.join(out))
