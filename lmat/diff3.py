import sys, re
from collections import defaultdict
def load(p):
    d = defaultdict(list)
    for line in open(p):
        line=line.rstrip('\n')
        if not line: continue
        size, md5, path = line.split('\t')
        norm = re.sub(r'-[A-Za-z0-9_-]{8}(\.[a-z]+)$', r'\1', path)
        d[norm].append((int(size), md5, path))
    for k in d: d[k].sort()
    return d
A,B=load(sys.argv[1]),load(sys.argv[2])
ka,kb=set(A),set(B)
print('GROUPS A=%d B=%d ; FILES A=%d B=%d' % (len(A),len(B),sum(len(v) for v in A.values()),sum(len(v) for v in B.values())))
add=sorted(kb-ka); rem=sorted(ka-kb)
print('ADDED groups (%d): %s' % (len(add), ', '.join(k.replace('dist/assets/','') for k in add)))
print('REMOVED groups (%d): %s' % (len(rem), ', '.join(k.replace('dist/assets/','') for k in rem)))
rehash=0; ident=0; sizechanged=[]
for k in sorted(ka&kb):
    a,b=A[k],B[k]
    if len(a)!=len(b):
        sizechanged.append((k,'COUNT %d -> %d'%(len(a),len(b)))); continue
    for (sa,ma,pa),(sb,mb,pb) in zip(a,b):
        if ma==mb: ident+=1
        else:
            rehash+=1
            if sa!=sb: sizechanged.append((k,'%d -> %d (%+d)'%(sa,sb,sb-sa)))
print('REHASHED files: %d ; IDENTICAL files: %d' % (rehash, ident))
print('SIZE-CHANGED (%d):' % len(sizechanged))
for k,v in sizechanged: print('  ~ %-55s %s' % (k.replace('dist/assets/',''), v))
