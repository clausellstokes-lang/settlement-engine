import re,sys
s=open('/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_MG.md').read().split('\n')
def cells(line):
    # count unescaped pipes outside backticks? markdown: backticks do not protect pipes in GFM tables; only \| escapes
    return len(re.findall(r'(?<!\\)\|', line))
bad=0; i=0
while i<len(s):
    if s[i].startswith('|') and i+1<len(s) and re.match(r'^\|[-| :]+\|$', s[i+1].strip()):
        n=cells(s[i]); j=i+2
        while j<len(s) and s[j].startswith('|'):
            if cells(s[j])!=n:
                print(f'line {j+1}: {cells(s[j])} pipes vs header {n}: {s[j][:100]}'); bad+=1
            j+=1
        i=j
    else: i+=1
print('bad rows:',bad)
