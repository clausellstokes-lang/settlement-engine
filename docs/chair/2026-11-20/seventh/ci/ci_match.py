"""Match a CI run's failing items against the red list BY CONTAINMENT.

Usage: python3 -I ci_match.py <fails file: job<TAB>file<TAB>title> <RED-AT-LINE.tsv>
A failing item is LISTED when a row of the red list has the same test file and its title cell is contained in the
failing item's title (a row holds an `it` title without its `describe` prefix), comparing with whitespace collapsed and
the ' > ' separators of vitest read as single spaces. Items with no test file are matched on the title cell alone.
Prints the counts, every NEW item whole, and every listed row that no failing item matched.
"""
import re, sys

def norm(t):
    t = t.replace(' > ', ' ')
    return re.sub(r'\s+', ' ', t).strip()

fails = []
for line in open(sys.argv[1], encoding='utf-8'):
    line = line.rstrip('\n')
    if not line.strip():
        continue
    parts = line.split('\t')
    if len(parts) < 3:
        parts = parts + ['-'] * (3 - len(parts))
    fails.append((parts[0].strip(), parts[1].strip(), '\t'.join(parts[2:]).strip()))

rows = []
for i, line in enumerate(open(sys.argv[2], encoding='utf-8')):
    if i == 0 or not line.strip():
        continue
    p = line.rstrip('\n').split('\t')
    rows.append((p[0], p[1], p[2], p[3] if len(p) > 3 else ''))

hit = [0] * len(rows)
new = []
listed = 0
for job, f, title in fails:
    nt = norm(title)
    ok = False
    for k, (rj, rf, rt, rc) in enumerate(rows):
        if norm(rt) in nt and (f in ('-', '') or rf == f or rf in nt or f in rf or rf in f):
            hit[k] += 1
            ok = True
    if ok:
        listed += 1
    else:
        new.append((job, f, title))
print('failing items:', len(fails), '; listed:', listed, '; NEW:', len(new))
for job, f, title in new:
    print('NEW\t' + job + '\t' + f + '\t' + title)
missed = [rows[k] for k in range(len(rows)) if hit[k] == 0]
print('rows of the list that no failing item matched:', len(missed), 'of', len(rows))
for rj, rf, rt, rc in missed:
    print('UNMATCHED ROW\t' + rj + '\t' + rf + '\t' + rt[:160])
