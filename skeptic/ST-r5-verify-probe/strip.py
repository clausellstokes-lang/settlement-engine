import sys
def strip_line(s):
    out=[];i=0;n=len(s);unclosed=0
    while i<n:
        if s.startswith('[CURED',i) or s.startswith('[REFINED',i) or s.startswith('[RE-RULED',i):
            depth=0;j=i
            while j<n:
                c=s[j]
                if c=='[':depth+=1
                elif c==']':
                    depth-=1
                    if depth==0: break
                j+=1
            if j>=n: unclosed+=1
            i=j+1;continue
        out.append(s[i]);i+=1
    return ''.join(out),unclosed
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
res=[];bad=[]
for k,l in enumerate(lines,1):
    t,u=strip_line(l)
    if u: bad.append(k)
    res.append(t)
open(sys.argv[2],'w',encoding='utf-8').write('\n'.join(res))
print('lines',len(res),'unclosed-on-lines',bad)
