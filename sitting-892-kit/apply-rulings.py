#!/usr/bin/env python3
"""apply-rulings.py <frq_in> <rulings.json> <frq_out>

Inserts one `*RULED (§892, Fable 5.1):*` paragraph at the END of each anchored row block of the
retrovalidation queue. NEVER writes in place: builds the whole result in memory, asserts every
anchor exactly once, asserts every ruling landed exactly once, then writes <frq_out>.

rulings.json = [{"anchor": "<exact full line text of the row heading>", "ruling": "<markdown>"}, ...]

Block boundary rule: a row starting with '**§' ends at the next line starting with '**§' or '## ';
a row starting with '## ' ends at the next line starting with '## '. The ruling paragraph is
inserted before that boundary, preceded by exactly one blank line and followed by exactly one.
"""
import json
import sys

frq_in, rulings_path, frq_out = sys.argv[1], sys.argv[2], sys.argv[3]
text = open(frq_in, encoding='utf-8').read()
assert text.endswith('\n'), 'the queue must end with a newline'
lines = text.split('\n')
rulings = json.load(open(rulings_path, encoding='utf-8'))
assert rulings, 'no rulings'

# 1. Every anchor exactly once, and every ruling text absent before the act.
positions = []
for r in rulings:
    if 'line' in r:
        # anchor by 1-based line number + the row id it must carry; resolve to the exact text
        i = r['line'] - 1
        l = lines[i]
        assert l.startswith('## ') or l.startswith('**§'), f"line {r['line']} is not a row heading: {l[:80]!r}"
        assert (r['id'] + ' ') in l or (r['id'] + '.') in l or (r['id'] + '(') in l or (r['id'] + ' ·') in l, f"line {r['line']} does not carry {r['id']}: {l[:80]!r}"
        r['anchor'] = l
    hits = [i for i, l in enumerate(lines) if l == r['anchor']]
    assert len(hits) == 1, f"anchor count {len(hits)} != 1 for: {r['anchor'][:100]!r}"
    assert r['ruling'].strip(), 'empty ruling'
    assert r['ruling'] not in text, f"ruling already present: {r['ruling'][:80]!r}"
    positions.append((hits[0], r))
positions.sort(key=lambda p: p[0])

# 2. Compute each block's end (exclusive) and the insertion index, working from the BOTTOM so
#    earlier indices stay valid.
def block_end(start):
    starter = lines[start]
    kind = 'sub' if starter.startswith('**§') else 'top'
    for j in range(start + 1, len(lines)):
        l = lines[j]
        if l.startswith('## '):
            return j
        if kind == 'sub' and l.startswith('**§'):
            return j
    return len(lines)

out = list(lines)
for start, r in reversed(positions):
    end = block_end(start)
    # trim trailing blank lines inside the block so exactly one blank precedes the ruling
    k = end
    while k - 1 > start and out[k - 1] == '':
        k -= 1
    insert = ['', r['ruling'].rstrip('\n')]
    if end < len(out):
        insert.append('')
    out[k:end] = insert

result = '\n'.join(out)
if not result.endswith('\n'):
    result += '\n'

# 3. Post-conditions: every ruling exactly once; the original prefix up to the first anchor is
#    byte-identical; line count grew by at least len(rulings).
for r in rulings:
    assert result.count(r['ruling']) == 1, f"ruling landed {result.count(r['ruling'])} times: {r['ruling'][:60]!r}"
first = positions[0][0]
assert result.split('\n')[:first + 1] == lines[:first + 1], 'prefix changed'
assert result.count('\n') >= text.count('\n') + len(rulings), 'line count did not grow'

open(frq_out, 'w', encoding='utf-8').write(result)
print(f"applied {len(rulings)} rulings: {frq_in} ({len(text)} B) -> {frq_out} ({len(result)} B)")
