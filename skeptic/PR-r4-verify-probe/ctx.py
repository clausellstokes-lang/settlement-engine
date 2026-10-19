import sys
path=sys.argv[1]; pat=sys.argv[2]; w=int(sys.argv[3]) if len(sys.argv)>3 else 250
for i,l in enumerate(open(path,encoding='utf-8'),1):
    s=0
    while True:
        j=l.find(pat,s)
        if j<0: break
        print(f"L{i}: …{l[max(0,j-w):j+len(pat)+w]}…\n")
        s=j+1
