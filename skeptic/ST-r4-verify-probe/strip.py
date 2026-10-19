import re,sys
src=open(sys.argv[1],encoding='utf-8').read().split('\n')
out=[]
for i,line in enumerate(src,1):
    # stop at the cure record (§15)
    res=[];depth=0;j=0
    s=line
    k=0
    buf=''
    while k<len(s):
        if s.startswith('[CURED',k) or s.startswith('[REFINED',k):
            # skip to matching bracket
            d=0
            while k<len(s):
                if s[k]=='[': d+=1
                elif s[k]==']':
                    d-=1
                    if d==0: k+=1; break
                k+=1
            continue
        buf+=s[k]; k+=1
    out.append(f"{i}\t{buf}")
open(sys.argv[2],'w',encoding='utf-8').write('\n'.join(out))
