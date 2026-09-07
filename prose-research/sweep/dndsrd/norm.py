import re, sys, unicodedata

def load_pages(path):
    t = open(path, encoding='utf-8').read()
    parts = re.split(r'<<<PAGE (\d+)>>>\n?', t)
    return {int(parts[i]): parts[i+1] for i in range(1, len(parts), 2)}

def normalize(raw):
    # SRD 5.1 uses TAB + NBSP as intra-line word separators and hard-wraps every column line
    s = raw.replace(' ', ' ').replace('\t', ' ')
    s = s.replace('‐', '-').replace('‑', '-')
    s = s.replace('-​‐', '-')
    s = s.replace('-­‐', '-').replace('­', '')  # soft hyphen artefacts
    lines = [re.sub(r' +', ' ', ln).strip() for ln in s.split('\n')]
    return lines

def paragraphs(lines):
    """Join hard-wrapped lines into paragraphs. A new paragraph starts on a blank line
    or on a line that began with the SRD's leading-indent marker (kept as a lone space)."""
    paras, cur = [], []
    for ln in lines:
        if not ln:
            if cur: paras.append(' '.join(cur)); cur = []
            continue
        cur.append(ln)
    if cur: paras.append(' '.join(cur))
    out = []
    for p in paras:
        p = re.sub(r'\s+', ' ', p).strip()
        if p: out.append(p)
    return out
