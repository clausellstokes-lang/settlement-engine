import re, io, sys
p = sys.argv[1]
lines = io.open(p, encoding='utf-8').read().split('\n')
def cells(l):
    s = re.sub(r'\\\|', '', l)
    # remove pipes inside backtick spans
    s = re.sub(r'``.*?``', '', s)
    s = re.sub(r'`[^`]*`', '', s)
    return s.count('|')
bad = 0; i = 0
while i < len(lines):
    if lines[i].startswith('|') and i+1 < len(lines) and re.match(r'^\|[-| :]+\|$', lines[i+1].strip()):
        h = cells(lines[i]); j = i+2
        while j < len(lines) and lines[j].startswith('|'):
            if cells(lines[j]) != h:
                bad += 1; print('ROW', j+1, 'cells', cells(lines[j]), 'header', h, lines[j][:90])
            j += 1
        i = j
    else:
        i += 1
print('bad rows:', bad)
