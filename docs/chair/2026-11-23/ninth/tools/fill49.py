"""Fill DRAFT-START-VEIL-49.txt into START-VEIL-49.txt (T5's seat) from VEIL-40's hand-over.

Usage: python3 -I fill49.py <HH:MM read from date -u> <YYYY-MM-DD> <VEIL-40's final documents commit> <the lane's tip: "branch at commit"> [<repo root, default /home/user/wt/chair>]
"""
import sys
hm, date, docs, tip = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
assert len(hm) == 5 and hm[2] == ':' and len(date) == 10 and len(docs) >= 9
ROOT = sys.argv[5] if len(sys.argv) > 5 else '/home/user/wt/chair'
SRC = ROOT + '/docs/chair/2026-11-23/ninth/prompts/DRAFT-START-VEIL-49.txt'
DST = ROOT + '/docs/chair/2026-11-23/ninth/prompts/START-VEIL-49.txt'
s = open(SRC, encoding='utf-8').read()
first, rest = s.split('\n', 1)
assert first.startswith('A DRAFT WITH BLANKS, NOT A START MESSAGE')
s = rest.lstrip('\n')


def fill(mark_prefix, text, count=None):
    global s
    n = 0
    while True:
        a = s.find('@@' + mark_prefix)
        if a < 0:
            break
        b = s.index('@@', a + 2)
        s = s[:a] + text + s[b + 2:]
        n += 1
    assert n >= 1 and (count is None or n == count), (mark_prefix, n, count)


fill('DATE', date)
fill('HOUR', hm)
fill('STATE', 'nothing: VEIL-40 handed over at 16:00 UTC of 2026-11-23 and dispatched nothing more for it')
fill('LATER-N', ' and N112')
fill('PART42-T5', ("block 0 of its section 1, \"VEIL-40 HANDS OVER\", the paragraph on `-t5-wip`: `npm ci`; the ledger ref; the cluster and the "
                   "template by `out/v28/seated/make-instruments.sh <checkout> <outdir>` (`PGHOST=/var/tmp/rv7`; template `v27x211` = 001..211; about 8 "
                   "minutes on VEIL-40's box); your own template = `createdb -T v27x211 <name>` and your branch's 212; the pool-v40 seeds by "
                   "`out/v27/tell2/measure/pool.sh <checkout> /var/tmp/v18/t2/pool-v40 v28tpl` (8 shards; about 23 minutes; `verify.sh` 45 / 0 differ)"))
fill('DOCS-COMMIT', docs)
fill('T5-WIP', 'b096065e5')
fill('RIVAL-BASE', ("61a99a90d of `lane/veil-40-2026-11-23-r5rival-wip` (the rival GREEN on the full pools; over your branch's base 9a2f8ef9a it adds only "
                    "receipts and nine lines of the rival's arm): merged by you in a worktree of your own, as a plain command of its own, before your first run"))
fill('TIP', tip)
fill('PART', '48')
assert '@@' not in s, s[s.index('@@') - 80: s.index('@@') + 120]
open(DST, 'w', encoding='utf-8').write(s)
print('START-VEIL-49.txt written:', len(s), 'bytes')
