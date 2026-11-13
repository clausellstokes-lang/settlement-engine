# REVIEW-POWERS-3 c2compare.py <base counts.txt> <tip counts.txt> <lane files> — each kind's towns and lines, base and tip,
# for every pattern and for the lane's own files (CENSUS-2's counts.txt rows); a kind that RISES is printed with RISE
import re, sys
def parse(f):
    P, F = {}, {}
    for l in open(f):
        m = re.match(r'PATTERN (\w): towns (\d+) · distinct lines (\d+)', l)
        if m: P[m[1]] = (int(m[2]), int(m[3])); continue
        m = re.match(r'FILE (\S+(?: \S+)?) \[[^\]]*\](?: NEW-FILE)?: (.*)', l)
        if m:
            for part in m[2].split(' · '):
                k = re.match(r'(\w) (\d+) towns/(\d+) lines', part)
                if k: F[(m[1], k[1])] = (int(k[2]), int(k[3]))
    return P, F
bP, bF = parse(sys.argv[1]); tP, tF = parse(sys.argv[2]); lane = set(open(sys.argv[3]).read().split())
for k in sorted(set(bP) | set(tP)): b, t = bP.get(k, (0, 0)), tP.get(k, (0, 0)); print(f'PATTERN {k}: towns {b[0]} -> {t[0]}, lines {b[1]} -> {t[1]}{"  RISE" if t[0] > b[0] or t[1] > b[1] else ""}')
for key in sorted(set(bF) | set(tF)):
    if key[0] not in lane: continue
    b, t = bF.get(key, (0, 0)), tF.get(key, (0, 0)); print(f'{key[0]} kind {key[1]}: towns {b[0]} -> {t[0]}, lines {b[1]} -> {t[1]}{"  RISE" if t[0] > b[0] or t[1] > b[1] else ""}')
