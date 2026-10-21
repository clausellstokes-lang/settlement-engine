#!/usr/bin/env python3
"""P5 — merge the ten wiring-census lane files into assessments/WIRING-CENSUS-2026-10-20.md with the counts computed.
Usage: python3 p5-merge-census.py   (re-runnable; rewrites the merged file from the lane files; the P5b ADJUDICATION section, if present, is preserved)
Rows are counted from the lanes' pipe tables: a row's class is its 10th column (header: | id | kind | item | where | writer | readers | seam | flag | wave | class | note |)."""
import os, re, glob
KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
OUT = os.path.join(KIT, 'assessments', 'WIRING-CENSUS-2026-10-20.md')
ORDER = ['BD', 'FOLD', 'PL', 'MN', 'RN', 'CH', 'PT', 'PS', 'ST', 'PR']
def norm(c):
    c = c.strip().strip('*').strip('`').upper()
    if c.startswith('OK'): return 'OK'
    if 'DEAD' in c: return 'DEAD END'
    if 'SHELL' in c: return 'SHELL'
    if 'INAPPR' in c: return 'INAPPROPRIATE'
    return 'OTHER:' + c[:30]
tables, counts, missing, candidates = {}, {}, [], {}
for v in ORDER:
    p = os.path.join(KIT, 'assessments', 'census', f'WC-{v}.md')
    if not os.path.exists(p):
        missing.append(v); continue
    lines = open(p, encoding='utf-8').read().splitlines()
    rows, cand, in_cand = [], [], False
    for ln in lines:
        if ln.startswith('## ') or ln.startswith('# '):
            in_cand = 'CANDIDATE' in ln.upper()
        if in_cand and ln.strip() and not ln.startswith('#'):
            cand.append(ln)
        if ln.startswith('|') and not re.match(r'^\|\s*-', ln):
            cells = [c.strip() for c in ln.strip().strip('|').split('|')]
            if len(cells) >= 10 and cells[0].lower() != 'id' and re.match(r'^WC-', cells[0]):
                rows.append((cells, ln))
    tables[v] = rows
    candidates[v] = cand
    c = {'OK': 0, 'DEAD END': 0, 'SHELL': 0, 'INAPPROPRIATE': 0, 'OTHER': 0}
    for cells, _ in rows:
        k = norm(cells[9])
        c[k if k in c else 'OTHER'] += 1
    counts[v] = (len(rows), c)
total = sum(n for n, _ in counts.values())
agg = {'OK': 0, 'DEAD END': 0, 'SHELL': 0, 'INAPPROPRIATE': 0, 'OTHER': 0}
for _, c in counts.values():
    for k in agg: agg[k] += c[k]
prev_adj = ''
if os.path.exists(OUT):
    old = open(OUT, encoding='utf-8').read()
    m = old.find('## ADJUDICATION (P5b)')
    if m >= 0: prev_adj = old[m:]
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('# THE WIRING CENSUS — 2026-10-20 (P5; CHAIR-NOTES 19; the owner, 2026-10-19: "make sure that everything is wired to something and that something has to be appropriate")\n\n')
    f.write(f'**COUNTS (lane classes, before adjudication): rows {total} · ok {agg["OK"]} · dead ends {agg["DEAD END"]} · shells {agg["SHELL"]} · inappropriate {agg["INAPPROPRIATE"]}' + (f' · unclassified {agg["OTHER"]}' if agg['OTHER'] else '') + '**\n\n')
    if missing: f.write('⚠ lanes with no file yet: ' + ', '.join(missing) + '\n\n')
    f.write('| lane | rows | ok | dead ends | shells | inappropriate |\n|---|---|---|---|---|---|\n')
    for v in ORDER:
        if v in counts:
            n, c = counts[v]
            f.write(f'| WC-{v} | {n} | {c["OK"]} | {c["DEAD END"]} | {c["SHELL"]} | {c["INAPPROPRIATE"]} |\n')
    f.write('\n## THE NON-OK ROWS (every lane; the P5b seat adjudicates these)\n\n| id | kind | item | where | writer | readers | seam | flag | wave | class | note |\n|---|---|---|---|---|---|---|---|---|---|---|\n')
    for v in ORDER:
        for cells, ln in tables.get(v, []):
            if norm(cells[9]) != 'OK': f.write(ln + '\n')
    f.write('\n## THE CANDIDATES SECTIONS, VERBATIM PER LANE\n')
    for v in ORDER:
        if v in candidates:
            f.write(f'\n### WC-{v}\n' + '\n'.join(candidates[v]) + '\n')
    f.write('\n## THE FULL TABLE (every lane, every row)\n\n| id | kind | item | where | writer | readers | seam | flag | wave | class | note |\n|---|---|---|---|---|---|---|---|---|---|---|\n')
    for v in ORDER:
        for cells, ln in tables.get(v, []): f.write(ln + '\n')
    if prev_adj: f.write('\n' + prev_adj)
print(f'rows {total} · ok {agg["OK"]} · dead ends {agg["DEAD END"]} · shells {agg["SHELL"]} · inappropriate {agg["INAPPROPRIATE"]} · unclassified {agg["OTHER"]}; lanes present: {[v for v in ORDER if v in counts]}; missing: {missing}')
