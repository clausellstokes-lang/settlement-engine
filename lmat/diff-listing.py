import sys, re, collections
def load(p):
    d = {}
    for line in open(p):
        line = line.rstrip('\n')
        if not line: continue
        size, md5, path = line.split('\t')
        norm = re.sub(r'-[A-Za-z0-9_-]{8}(\.[a-z]+)$', r'\1', path)
        d[norm] = (int(size), md5, path)
    return d
A, B = load(sys.argv[1]), load(sys.argv[2])
ka, kb = set(A), set(B)
print('COUNT A=%d B=%d' % (len(A), len(B)))
add = sorted(kb-ka); rem = sorted(ka-kb)
print('ADDED (%d):' % len(add))
for k in add: print('  + %s  %d B' % (k, B[k][0]))
print('REMOVED (%d):' % len(rem))
for k in rem: print('  - %s  %d B' % (k, A[k][0]))
ch = [k for k in sorted(ka & kb) if A[k][1] != B[k][1]]
print('CONTENT-HASH CHANGED (%d):' % len(ch))
tot=0
for k in ch:
    d = B[k][0]-A[k][0]; tot+=d
    print('  ~ %s  %d -> %d (%+d)  %s -> %s' % (k, A[k][0], B[k][0], d, A[k][2].split('/')[-1], B[k][2].split('/')[-1]))
print('NET BYTES on changed files: %+d' % tot)
same = len(ka&kb) - len(ch)
print('IDENTICAL: %d' % same)
