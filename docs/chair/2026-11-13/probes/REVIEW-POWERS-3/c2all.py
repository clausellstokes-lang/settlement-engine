# every (file, kind) of CENSUS-2's counts.txt whose towns or lines differ base -> tip
import re, sys
def parse(f):
    F = {}
    for l in open(f):
        m = re.match(r'FILE (.+?) \[[^\]]*\](?: NEW-FILE)?: (.*)', l)
        if m:
            for part in m[2].split(' · '):
                k = re.match(r'(\w) (\d+) towns/(\d+) lines', part)
                if k: F[(m[1], k[1])] = (int(k[2]), int(k[3]))
    return F
b, t = parse(sys.argv[1]), parse(sys.argv[2])
for k in sorted(set(b) | set(t)):
    if b.get(k) != t.get(k): print(k, b.get(k), '->', t.get(k))
