import sys,re
f=sys.argv[1]; terms=sys.argv[2:]
t=open(f,encoding='utf-8').read()
low=t.lower()
for term in terms:
    print("### TERM:",term)
    st=0; n=0
    while True:
        i=low.find(term.lower(),st)
        if i<0: break
        n+=1
        print("---",i,"---")
        print(t[max(0,i-300):i+400].replace("\n"," "))
        st=i+1
        if n>=6: break
    if n==0: print("(none)")
