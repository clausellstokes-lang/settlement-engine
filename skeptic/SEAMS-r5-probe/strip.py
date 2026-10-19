import sys,re,os
# strip dated cure/refine/re-ruled/stop brackets (nesting-aware on [ ]), keep line numbers
TAGS=('[CURED','[REFINED','[RE-RULED','[STOP','[RULED','[WITHDRAWN','[STRUCK','[NOTED','[ROUTED','[RE-RAISED','[AMENDED','[CORRECTED','[⛔ STOP','[⚠')
def strip(text):
    out=[];i=0;n=len(text)
    while i<n:
        hit=None
        if text[i]=='[':
            for t in TAGS:
                if text.startswith(t,i): hit=t;break
        if hit:
            depth=0;j=i
            while j<n:
                c=text[j]
                if c=='[':depth+=1
                elif c==']':
                    depth-=1
                    if depth==0:break
                j+=1
            seg=text[i:j+1]
            out.append('\n'*seg.count('\n'))
            i=j+1
        else:
            out.append(text[i]);i+=1
    return ''.join(out)
src=sys.argv[1];dst=sys.argv[2]
open(dst,'w').write(strip(open(src).read()))
