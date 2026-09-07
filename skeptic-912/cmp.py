import sys, re, collections
def load(p):
    d={}
    dup=collections.Counter()
    for line in open(p):
        size,md5,path=line.rstrip('\n').split('\t')
        # strip content hash: name-HASH.ext  (hash = 8+ chars of [A-Za-z0-9_-])
        norm=re.sub(r'-[A-Za-z0-9_-]{8}(\.[a-z0-9]+)$', r'\1', path)
        if norm in d: dup[norm]+=1
        d[norm]=(int(size),md5,path)
    return d,dup
A,da=load(sys.argv[1]); B,db=load(sys.argv[2])
print("A lines",len(A),"dupnorm",sum(da.values()),"B lines",len(B),"dupnorm",sum(db.values()))
added=sorted(set(B)-set(A)); removed=sorted(set(A)-set(B))
print("ADDED",len(added)); [print("  +",x) for x in added[:20]]
print("REMOVED",len(removed)); [print("  -",x) for x in removed[:20]]
sizechg=[]; rehash=0
for k in set(A)&set(B):
    if A[k][0]!=B[k][0]: sizechg.append((k,A[k][0],B[k][0],B[k][0]-A[k][0]))
    if A[k][1]!=B[k][1]: rehash+=1
print("SIZE CHANGED",len(sizechg))
for k,a,b,d in sorted(sizechg): print("  *",k,a,"->",b,"(%+d)"%d)
print("REHASHED",rehash)
