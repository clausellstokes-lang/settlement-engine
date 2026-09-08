import sys,re
f=sys.argv[1]; pats=sys.argv[2:]
s=open(f,encoding='utf-8').read()
s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','--')
low=s.lower()
for p in pats:
    print("="*20, p)
    st=0; n=0
    while True:
        i=low.find(p.lower(),st)
        if i<0: break
        n+=1
        print("[%d] ...%s..."%(n, re.sub(r'\s+',' ',s[max(0,i-450):i+450])))
        st=i+1
        if n>=4: break
    if n==0: print("  <<NOT FOUND>>")
    print()
