import sys, re, collections
def load(p):
    d=collections.defaultdict(list)
    n=0
    for line in open(p):
        size,md5,path=line.rstrip('\n').split('\t')
        norm=re.sub(r'-[A-Za-z0-9_-]{8}(\.[a-z0-9]+)$', r'\1', path)
        d[norm].append((int(size),md5,path)); n+=1
    return d,n
A,na=load(sys.argv[1]); B,nb=load(sys.argv[2])
print("lines A",na,"B",nb,"normkeys A",len(A),"B",len(B))
print("ADDED keys",sorted(set(B)-set(A)))
print("REMOVED keys",sorted(set(A)-set(B)))
sizechg=[];rehash=0;multi=[]
for k in sorted(set(A)&set(B)):
    a=sorted(A[k]); b=sorted(B[k])
    if len(a)!=len(b): multi.append((k,len(a),len(b))); continue
    if len(a)>1: multi.append((k,len(a),len(b)))
    sa=[x[0] for x in a]; sb=[x[0] for x in b]
    if sa!=sb: sizechg.append((k,sa,sb))
    ma=sorted(x[1] for x in a); mb=sorted(x[1] for x in b)
    rehash+=sum(1 for i in range(len(ma)) if ma[i]!=mb[i])
print("multi-entry norm keys:",multi)
print("SIZE CHANGED",len(sizechg))
for r in sizechg: print("  *",r)
print("REHASHED (md5 multiset mismatch count)",rehash)
tot=lambda D: sum(x[0] for v in D.values() for x in v)
print("total bytes A",tot(A),"B",tot(B),"delta",tot(B)-tot(A))
