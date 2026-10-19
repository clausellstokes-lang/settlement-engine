# D-PR-r4: every markdown table row's unescaped-pipe count equals its header's.
import re, sys
lines = open(sys.argv[1], encoding='utf-8').read().split('\n')
bad = []; tables = 0; i = 0
def pipes(l): return len(re.findall(r'(?<!\\)\|', l))
while i < len(lines):
    if lines[i].startswith('|') and i + 1 < len(lines) and re.match(r'^\|[-| :]+\|$', lines[i+1]):
        tables += 1; h = pipes(lines[i]); j = i + 2
        while j < len(lines) and lines[j].startswith('|'):
            if pipes(lines[j]) != h: bad.append((j + 1, pipes(lines[j]), h, lines[j][:90]))
            j += 1
        i = j
    else:
        i += 1
print(f'tables {tables}; bad rows {len(bad)}')
for b in bad: print(b)
