#!/usr/bin/env python3
# mk_check7.py — THE SEVENTH READ'S SECOND-CHECK BRIEF, MADE FROM THE SIXTH'S BY EXACT REPLACEMENTS (the sixth chair, 2026-11-17).
# usage: python3 mk_check7.py <chair lane root> <out file>      (the out file keeps @@BATCH@@, @@OUT@@ and @@N@@ for each checker)
import io, sys
root, out = sys.argv[1], sys.argv[2]
s = io.open(root + '/docs/chair/2026-11-17/review-bar-6/SECOND-CHECK.brief.md', encoding='utf-8').read()
def sub(old, new, n=None):
    global s
    c = s.count(old)
    assert c >= 1 and (n is None or c == n), (old[:70], c)
    s = s.replace(old, new)
sub('/home/user/rec/rbar6/packets-cfc2b680a/cal-', '/home/user/read7/pk/bar7-')
sub('/home/user/rec/rbar6/packets-cfc2b680a', '/home/user/read7/pk')
sub('(twenty-one files)', '(twenty-two files)', 1)
sub('/home/user/c3out/rbar6-cfc2b680a', '/home/user/read7/render')
sub('/home/user/c3out', '/home/user/read7/render')
sub('/home/user/chair/docs/chair/2026-11-14/briefs/BRIEF-REVIEW-BAR-6.md', '/home/user/read7/BRIEF-REVIEW-BAR-7.md', 1)
sub('/home/user/rec/rbar6/verify2/scratch-@@N@@/', '/home/user/read7/verify/scratch-@@N@@/', 1)
sub('bar0-metropolis-calm-rand-42', 'bar0-metropolis-calm-rand-45')
sub('THREE THINGS OF THIS READ.', 'FIVE THINGS OF THIS READ.', 1)
lines = s.split('\n')
i = [k for k, l in enumerate(lines) if l.startswith('FIVE THINGS OF THIS READ.')]
assert len(i) == 1
lines[i[0]] += io.open(root + '/docs/chair/2026-11-17/review-bar-7/CHECK-ADDED.txt', encoding='utf-8').read().rstrip('\n')
s = '\n'.join(lines)
assert 'rbar6' not in s and 'BAR-6' not in s and 'c3out' not in s, 'a trace of the sixth read is left'
io.open(out, 'w', encoding='utf-8').write(s)
print('written', out)
