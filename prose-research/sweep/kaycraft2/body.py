import sys,re
n=sys.argv[1]
s=open(n+'.txt',encoding='utf-8').read()
lines=[l.strip() for l in s.split('\n')]
# brightweavings nav ends after "Contact" / begins article after title dup
# heuristic: keep lines longer than 60 chars
out=[l for l in lines if len(l)>60]
print('\n\n'.join(out))
