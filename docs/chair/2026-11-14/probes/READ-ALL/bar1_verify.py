#!/usr/bin/env python3
# REVIEW-BAR-1: flags checked against the page itself before any builder sees them.
#  (1) MARK ADJACENT: a flagged service or house line whose row carries the crisis leaf's mark on the line beside it (the packet shows the
#      row's name and its description as two lines; the mark opens the description): the reader judged the name without its mark: STRUCK.
#  (2) STORED AS ITS OWN FACT: a plot hook, a rumour or a recent-conflict line flagged only for being "in none of CRISIS, QUARRELS,
#      TENSIONS or PAST": it states a new fact of its own and nothing denies it: SET APART (the brief's own rule: a claim the header
#      neither supports nor denies).
# usage: bar1_verify.py <merged dir> <bar1 census out-dir>  -> merged/struck.json, merged/kept.sentences.json and the count again
import io, re, sys, json, collections
M, OUT = sys.argv[1:3]
R = json.load(io.open(M + '/flagged.sentences.json', encoding='utf-8'))
MARK = re.compile(r'^(Stopped by|Curtailed by|Scarce in|Short of|Stopped:|\(stopped\)|\(curtailed\)|\(scarce\))|\((stopped|curtailed|scarce)\)\s*$', re.I)
dumps = {}
def tab_lines(seed):
    if seed not in dumps:
        L = []; cur = None
        for line in io.open('%s/dumps/%s.txt' % (OUT, seed), encoding='utf-8'):
            line = line.rstrip('\n')
            if line.startswith('== '): cur = line.strip('= ').strip(); continue
            if cur and cur.split('/')[0] in ('World', 'Systems', 'Summary', 'Table') and line and not line.startswith('[STYLE]'): L.append((cur, line))
        dumps[seed] = L
    return dumps[seed]
NONE_OF = re.compile(r'(in|is in) (none|no) (of )?(CRISIS|QUARRELS|TENSIONS|PAST)|not in (QUARRELS|TENSIONS|CRISIS|PAST)|in no (CRISIS|QUARRELS|TENSIONS|PAST)', re.I)
struck = []; kept = []
for r in R:
    why = ' | '.join(r['whys']); reason = None
    if r['sections'][0] in ('Systems/Services', 'Systems/Institutions') and re.search(r'unmarked|no (short |famine |siege )?mark|without (a|its) mark|carries no mark|shown unmarked|no mark', why, re.I):
        L = tab_lines(r['town']); hit = False; seen_any = False
        for i, (sec, line) in enumerate(L):
            if sec != r['sections'][0]: continue
            if r['text'] in line or line in r['text']:
                seen_any = True
                near = [L[j][1] for j in range(max(0, i - 1), min(len(L), i + 3)) if j != i]
                if MARK.search(line) or any(MARK.search(x) for x in near): hit = True
        if hit: reason = 'MARK ADJACENT: the row carries its mark on the line beside the flagged one'
        elif not seen_any: reason = None
    if not reason and r['sections'][0].startswith(('Summary/Plot Hooks', 'Summary/Overview', 'World/Rumors', 'Systems/Defense', 'Systems/Power')) and NONE_OF.search(why) and not re.search(r'contradict|but the same page|while the same|PAIR', why):
        reason = 'STATES ITS OWN FACT: flagged only for being on no list of the header; nothing denies it'
    (struck if reason else kept).append(dict(r, struck=reason) if reason else r)
json.dump(struck, io.open(M + '/struck.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump(kept, io.open(M + '/kept.sentences.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('STRUCK OR SET APART: %d' % len(struck), dict(collections.Counter(s['struck'].split(':')[0] for s in struck)))
for s in struck: print('   %-4s %-34s %-2s | %s' % (s['sev'], s['town'][5:], s['readers'], s['text'][:90]))
towns = sorted({r['town'] for r in R}); tot = collections.Counter()
print('\nTHE COUNT A TOWN AFTER THE CHECK:')
for t in towns:
    c = collections.Counter(r['sev'] for r in kept if r['town'] == t); tot.update(c)
    print('  %-38s HIGH %2d · MED %3d · LOW %3d' % (t, c['HIGH'], c['MED'], c['LOW']))
print('  IN ALL: HIGH %d · MED %d · LOW %d · a town: HIGH+MED %.1f' % (tot['HIGH'], tot['MED'], tot['LOW'], (tot['HIGH'] + tot['MED']) / 10.0))
hm = [r for r in kept if r['sev'] in ('HIGH', 'MED')]
a = sum(1 for r in hm if 'a' in r['readers']); b = sum(1 for r in hm if 'b' in r['readers']); ab = sum(1 for r in hm if r['readers'] == 'ab')
print('TWO READERS after the check (HIGH and MED): a %d · b %d · both %d · union %d' % (a, b, ab, len(hm)))
