import sys, re
p = sys.argv[1]
lines = open(p, encoding='utf-8').read().split('\n')
def cells(l):
    # count unescaped pipes outside backticks? the house check counts unescaped pipes
    s = re.sub(r'\\\|', '', l)
    return s.count('|')
bad = 0; i = 0
while i < len(lines):
    if lines[i].startswith('|') and i + 1 < len(lines) and re.match(r'^\|[-| :]+\|$', lines[i+1]):
        n = cells(lines[i]); j = i + 2
        while j < len(lines) and lines[j].startswith('|'):
            if cells(lines[j]) != n:
                bad += 1; print(f'line {j+1}: {cells(lines[j])} pipes vs header {n}: {lines[j][:90]}')
            j += 1
        i = j
    else:
        i += 1
print('tables checked; mismatches:', bad)
