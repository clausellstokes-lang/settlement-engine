# splice.py <file> <start-marker> <end-marker> <replacement-file>
# Replaces [start, end) — start inclusive, end exclusive; each marker must occur exactly once.
import sys
path, start, end, repl = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
text = open(path, encoding='utf-8').read()
new = open(repl, encoding='utf-8').read()
for m in (start, end):
    n = text.count(m)
    if n != 1:
        sys.exit(f'marker count {n} != 1: {m!r}')
i, j = text.index(start), text.index(end)
if j <= i:
    sys.exit('end before start')
text = text[:i] + new + text[j:]
open(path, 'w', encoding='utf-8').write(text)
print(f'spliced {j - i} chars -> {len(new)} chars')
