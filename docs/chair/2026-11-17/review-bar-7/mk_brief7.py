#!/usr/bin/env python3
# mk_brief7.py — THE SEVENTH READ'S READERS' BRIEF, MADE FROM THE SIXTH'S BY EXACT REPLACEMENTS (the sixth chair, 2026-11-17).
# usage: python3 mk_brief7.py <chair lane root> <out file>
# Every replacement asserts that its old text stands in the sixth's brief exactly once: a brief that moved fails loudly.
# What changes: the history paragraph; what the page now prints BY DESIGN (the owner's supply rule, the house's mark on a
# person's card, the very rare secrets); the output and the way of working (the seventh's readers are helpers on the
# chair's own machine: they read a local packet file and write a local flags file; no git, no branch, no push).
import io, sys
root, out = sys.argv[1], sys.argv[2]
s = io.open(root + '/docs/chair/2026-11-14/briefs/BRIEF-REVIEW-BAR-6.md', encoding='utf-8').read()
lines = s.split('\n')
def line_starting(prefix):
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    return hits[0]
def sub(old, new):
    global s
    assert s.count(old) == 1, (old[:60], s.count(old))
    s = s.replace(old, new)

sub('# BRIEF · REVIEW-BAR-6 ·', '# BRIEF · REVIEW-BAR-7 ·')
sub('since then TWO rounds of builder seats (twenty seats) have closed whole KINDS of fault, each by a detector over a thousand towns: the detectors that counted 761 instances in a hundred and fifty towns now count 10. THIS IS THE SIXTH READ (2026-11-17), IN THE BAR\'S OWN FORM:',
    'then two rounds of builder seats closed whole KINDS of fault, each by a detector over a thousand towns; the sixth read (2026-11-17, early; thirty towns) found no HIGH and, after the strict second check, 29 false sentences in thirty towns (about one a town); since then a round of six builder seats has cured its families by rule, the owner\'s SUPPLY RULE has been built (every house and its material tell one story: below) and the owner\'s VERY RARE SECRETS have been added (below). THIS IS THE SEVENTH READ (2026-11-17), IN THE BAR\'S OWN FORM:')

sub('the gaps (a house that lacks its input; a resource nobody works).',
    'the gaps, IN THE RECORD\'S OWN STORED WORDS (a house that lacks its input; a resource nobody works; and, new, a house that BUYS its material: "Sawmill: Sawmill runs on imported mountain_timber": the record\'s own key, not a line of the page, and not a fault: it tells you that house is fed from outside).')
lines = s.split('\n'); i = line_starting('A HOUSE MARKED SHORT IS A FACT OF THE PAGE')
NEW33 = io.open(root + '/docs/chair/2026-11-17/review-bar-7/BY-DESIGN.txt', encoding='utf-8').read().rstrip('\n')
lines[i] = NEW33
s = '\n'.join(lines)

a = s.index('## The output'); b = len(s)
TAIL = io.open(root + '/docs/chair/2026-11-17/review-bar-7/OUTPUT-AND-WORK.txt', encoding='utf-8').read()
s = s[:a] + TAIL
assert 'REVIEW-BAR-6' not in s and 'session_01ACmDYZrFEVXyZEUg1NDxxC' not in s and 'review-bar-6' not in s, 'a trace of the sixth read is left'
io.open(out, 'w', encoding='utf-8').write(s)
print('written', out, len(s.split('\n')), 'lines')
