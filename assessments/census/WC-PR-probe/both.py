import re,sys
D='/Users/cstokes/Desktop/settlement-engine/docs/'
def both(vol,a,b,w=220,mx=3):
    n=0
    for i,l in enumerate(open(D+vol,encoding='utf8'),1):
        if re.search(a,l) and re.search(b,l):
            m=re.search(a,l); s=max(0,m.start()-w); print(f"{vol}:{i}: …{l[s:m.end()+w].strip()}…\n"); n+=1
            if n>=mx: break
    if n==0: print(f"{vol}: NONE for {a} & {b}\n")
if __name__=='__main__':
    args=sys.argv[1:]
    both(args[0],args[1],args[2],int(args[3]) if len(args)>3 else 220,int(args[4]) if len(args)>4 else 3)
