#!/usr/bin/env python3
"""THE CONSOLIDATION RATCHET — compares the bracketed text of record (old) with the consolidated text (new):
the set of backticked tokens, the counts of laws · hearing kinds · flags · waves · OD rulings · scenario rows · ⭐ rows · DRAFT/UNMEASURED marks,
the `path :: symbol` cites, and the review markers that must be GONE from the new running text.
Usage: python3 consolidate-ratchet.py <old.md> <new.md> [--allow-missing t1,t2] [--allow-missing-file <one token per line; # comments>]   (exit 0 = clean, 1 = differences listed)"""
import re, sys
def read(p): return open(p, encoding='utf-8').read()
def tokens(s): return set(t for t in re.findall(r'`([^`\n]{1,200})`', s) if not t.startswith(' '))
def cites(s): return set(re.findall(r'`?([A-Za-z0-9_./-]+\.js(?:x)?) :: ([A-Za-z0-9_$.]+)`?', s))
def count(s, pat): return len(re.findall(pat, s, flags=re.M))
COUNTS = {
  'laws (XX1–XXn bold)': r'^\*\*[A-Z]{2,4}\d{1,2}\b',
  'OD rulings': r'\bOD-[A-Z]{2,4}-\d{1,3}\b',
  'owner rows ⭐': r'⭐',
  'DRAFT marks': r'\bDRAFT\b',
  'UNMEASURED marks': r'\bUNMEASURED\b',
  'wave ids (XX-n)': r'\b[A-Z]{2,4}-\d{1,2}\b(?= [—–-] )',
  'flags (…Enabled)': r'\b[a-z][A-Za-z]+Enabled\b',
}
MARKERS = r'\[(CURED|REFINED|ADDED|CORRECTED|AMENDED|OPENED|RULED|STOP) [^\]]*\]|\(fp-final r\d[ab]?\)|\(fp-final P[5-8][^)]*\)|↳|ROUTED-UNAPPLIED|\bround r\d\b'
def main():
  a, b = sys.argv[1], sys.argv[2]
  allow = set()
  if '--allow-missing' in sys.argv: allow = set(sys.argv[sys.argv.index('--allow-missing')+1].split(','))
  if '--allow-missing-file' in sys.argv: allow |= set(l.rstrip('\n') for l in open(sys.argv[sys.argv.index('--allow-missing-file')+1], encoding='utf-8') if l.strip() and not l.startswith('#'))
  old, new = read(a), read(b)
  bad = 0
  to, tn = tokens(old), tokens(new)
  missing = sorted(t for t in to - tn if t not in allow)
  added = sorted(tn - to)
  print(f'tokens: old {len(to)} · new {len(tn)} · missing {len(missing)} · new-in-new {len(added)}')
  if missing: bad += 1; print('  MISSING (old tokens absent from the new text; superseded names must be listed in the ledger and passed with --allow-missing):'); [print('   -', t) for t in missing[:60]]
  if added: print('  NEW tokens in the new text (each must be a registered name, never a mint):'); [print('   +', t) for t in added[:40]]
  co, cn = cites(old), cites(new)
  mc = sorted(co - cn)
  print(f'cites (path :: symbol): old {len(co)} · new {len(cn)} · missing {len(mc)}')
  if mc: bad += 1; [print('   - %s :: %s' % c) for c in mc[:40]]
  for name, pat in COUNTS.items():
    n_old, n_new = len(set(re.findall(pat, old, flags=re.M))) if 'OD' in name or 'wave' in name or 'flags' in name else count(old, pat), len(set(re.findall(pat, new, flags=re.M))) if 'OD' in name or 'wave' in name or 'flags' in name else count(new, pat)
    flag = '' if n_new >= n_old or name.startswith('laws') and n_new == n_old else '  ← FEWER (explain in the ledger)'
    print(f'{name}: old {n_old} · new {n_new}{flag}')
    if n_new < n_old: bad += 1
  left = re.findall(MARKERS, new)
  print(f'review markers left in the new text: {len(left)}' + ('  ← MUST BE 0 outside the header/rulings table' if left else ''))
  if left: bad += 1; [print('   !', m if isinstance(m, str) else m) for m in left[:20]]
  print('RATCHET', 'CLEAN' if bad == 0 else f'{bad} DIFFERENCE CLASSES')
  sys.exit(0 if bad == 0 else 1)
main()
