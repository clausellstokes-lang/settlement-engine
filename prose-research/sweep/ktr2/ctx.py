import sys
f=sys.argv[1]; q=sys.argv[2]
t=open(f,encoding='utf8').read()
i=t.find(q)
print('FOUND' if i>=0 else 'MISSING', f)
if i>=0: print('...'+t[max(0,i-320):i+len(q)+80]+'...')
