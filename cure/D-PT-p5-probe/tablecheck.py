import re, sys
path = sys.argv[1]
lines = open(path, encoding='utf-8').read().split('\n')
def cells(line):
    # strip code spans (which may contain '|'), then escaped pipes
    s = re.sub(r'`[^`]*`', 'X', line)
    s = s.replace('\\|', 'X')
    return s.count('|')
tables = 0; bad = []
i = 0
while i < len(lines):
    if lines[i].startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s\-:|]+\|\s*$', lines[i+1]):
        tables += 1
        n = cells(lines[i]); j = i + 2
        while j < len(lines) and lines[j].startswith('|'):
            if cells(lines[j]) != n: bad.append((j+1, n, cells(lines[j]), lines[j][:90]))
            j += 1
        i = j
    else:
        i += 1
print(f'tables {tables} · mismatched rows {len(bad)}')
for b in bad: print(b)
