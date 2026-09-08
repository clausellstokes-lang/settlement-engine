import sys,re
f=sys.argv[1]; pat=sys.argv[2]; w=int(sys.argv[3]) if len(sys.argv)>3 else 200
s=open(f,encoding='utf-8').read()
for m in re.finditer(re.escape(pat),s,re.I):
    print('---',m.start())
    print(s[max(0,m.start()-w):m.end()+w].replace('\n',' | '))
