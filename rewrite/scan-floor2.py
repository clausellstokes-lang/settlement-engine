#!/usr/bin/env python3
"""scan-floor2.py — the grammar-decidable floor-2 scan (F2-01/02/05/06 as re-worded by ADDENDUM 18): usage scan-floor2.py <file> [--quoted-only]
Flags a RATE, an ELAPSED COURSE (perfect/durative/comparative-against-a-past/ordinal-over-events/modal future), a DATE/SEASON and a bare COUNT.
Under ruling 11 an elapsed course is licensed over a FROZEN field; this scan cannot see fields, so it REPORTS the class and lets the reader decide.
On the exemplar pack (ruling 5) every hit in an example line must be rewritten or marked 'frozen-field only'."""
import re, sys
RATE = r"\b(more often than not|most (nights|days|years|winters|springs)|every (spring|summer|autumn|winter|year|night|morning|day|week|month|tenday|seventh)|seldom|rarely|often|usually|twice|thrice|three times|once a|once every|nowadays|these days|lately|of late)\b"
ELAPSED = r"\b(has|have|had) (been|stood|held|kept|left|not|never|always|long|since|gone|come|run|grown|fallen|risen)\b|\b(still|no longer|as ever|since|to this day|again|the second time|not for the first time|for years|in years|for generations|used to|any more|anymore)\b|\b(older|newer|thinner|thicker|fewer|more|less|longer|shorter) than (it|they|there) (was|were|used)\b"
FUTURE = r"\b(will|would|shall) (hold|not|never|last|stand|come|be)\b|\bwould not last\b"
DATE = r"\b(three|four|five|six|ten|twenty|forty) (winters|summers|years|seasons|months|generations)\b|\b(since|before|after) the (fire|siege|war|founding|plague|flood|old lord|last)\b|\bin the old lord's time\b"
COUNT = r"\b(a dozen|a handful|a hundred|hundreds|forty|thirty|twenty|a score|half the town|most of the town)\b"
classes = [('RATE', RATE), ('ELAPSED', ELAPSED), ('FUTURE', FUTURE), ('DATE', DATE), ('COUNT', COUNT)]
quoted_only = '--quoted-only' in sys.argv
hits = 0
for n, line in enumerate(open(sys.argv[1]), 1):
    if quoted_only and not (line.startswith('>') or '*' in line): continue
    for name, pat in classes:
        for m in re.finditer(pat, line, re.I):
            hits += 1; print(f'{n}: {name:8s} "{m.group(0)}"  | {line.strip()[:150]}')
print(f'-- {hits} hit(s)')
