import sys, re
def load(p):
    d = {}
    for line in open(p):
        line=line.rstrip('\n')
        if not line: continue
        size, md5, path = line.split('\t')
        norm = re.sub(r'-[A-Za-z0-9_-]{8}(\.[a-z]+)$', r'\1', path)
        d[norm] = (int(size), md5, path)
    return d
A,B = load(sys.argv[1]), load(sys.argv[2])
ka,kb=set(A),set(B)
out=[]
out.append('COUNT A=%d B=%d' % (len(A),len(B)))
add=sorted(kb-ka); rem=sorted(ka-kb)
out.append('ADDED (%d): %s' % (len(add), ', '.join('%s(%dB)'%(k.replace("dist/assets/",""),B[k][0]) for k in add)))
out.append('REMOVED (%d): %s' % (len(rem), ', '.join('%s(%dB)'%(k.replace("dist/assets/",""),A[k][0]) for k in rem)))
ch=[k for k in sorted(ka&kb) if A[k][1]!=B[k][1]]
nz=[k for k in ch if A[k][0]!=B[k][0]]
out.append('REHASHED: %d  (of which SIZE-CHANGED: %d; pure-cascade zero-delta: %d)' % (len(ch), len(nz), len(ch)-len(nz)))
out.append('IDENTICAL: %d' % (len(ka&kb)-len(ch)))
tot=0
for k in nz:
    d=B[k][0]-A[k][0]; tot+=d
    out.append('  ~ %-55s %8d -> %8d (%+d)' % (k.replace('dist/assets/',''), A[k][0], B[k][0], d))
out.append('NET BYTES (size-changed files): %+d' % tot)
sys.stdout.write('\n'.join(out)+'\n')
