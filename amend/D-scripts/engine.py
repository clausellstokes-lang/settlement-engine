import re, sys
D = "2026-10-16 (coherence fold"
def C(body, sec=None):   # CORRECTED
    return f"[CORRECTED {D}{(' ' + sec) if sec else ''}) — {body}]"
def R(sec, body): return f"[RULED {D} {sec}) — {body}]"
def S(sec, body): return f"[STRUCK {D} {sec}) — {body}]"
def A(body, sec=None): return f"[ADDED {D}{(' ' + sec) if sec else ''}) — {body}]"
def CL(body, sec=None): return f"[CLARIFIED {D}{(' ' + sec) if sec else ''}) — {body}]"
def SE(body, sec=None): return f"[SUPERSEDED BY EVENT {D}{(' ' + sec) if sec else ''}) — {body}]"
def O(row, body): return f"[OWNER ROW {row} — {body} (coherence fold, 2026-10-16)]"
def FV(fv, tier, deg): return f"[ADDED {D}, req 16/17) — FIRST-VISIBLE: {fv} · TIER: {tier} · DEGRADED ARM: {deg}]"
def REF(key): return "[see the bracket at :{{REF:%s}}]" % key
def KEY(key, text): return "{{KEY:%s}}" % key + text
CARRY = "CARRIED FROM THE LEDGER COPY (the 08-15 stale-site sitting 51ec5a103, §106, the TL-F round — master never received it), verbatim: «"
def CARRYB(txt): return A(CARRY + txt + "»")

def apply(base, items, name):
    errs = []; ins = []
    for i, it in enumerate(items):
        anchor, text, mode = it
        c = base.count(anchor)
        if c != 1:
            errs.append(f"{name}: anchor x{c}: {anchor[:90]!r}"); continue
        pos = base.index(anchor) + len(anchor)
        if mode == 'line':
            pos = base.index('\n', pos)
            add = '\n' + text
        else:
            add = ' ' + text
        ins.append((pos, i, add))
    if errs:
        print("\n".join(errs)); sys.exit(2)
    out = base
    for pos, i, add in sorted(ins, key=lambda x: (x[0], x[1]), reverse=True):
        out = out[:pos] + add + out[pos:]
    # resolve keys
    lines = out.split('\n')
    keyline = {}
    for n, l in enumerate(lines, 1):
        for k in re.findall(r"\{\{KEY:([\w-]+)\}\}", l):
            if k in keyline: print(f"{name}: dup key {k}"); sys.exit(3)
            keyline[k] = n
    out = re.sub(r"\{\{KEY:[\w-]+\}\}", "", out)
    def rep(m):
        k = m.group(1)
        if k not in keyline: print(f"{name}: missing key {k}"); sys.exit(4)
        return str(keyline[k])
    out = re.sub(r"\{\{REF:([\w-]+)\}\}", rep, out)
    # insertion-only proof: strip every inserted text and compare
    chk = out
    final_adds = []
    for pos, i, add in ins:
        a = re.sub(r"\{\{KEY:[\w-]+\}\}", "", add)
        a = re.sub(r"\{\{REF:([\w-]+)\}\}", lambda m: str(keyline[m.group(1)]), a)
        final_adds.append(a)
    for a in sorted(final_adds, key=len, reverse=True):
        if a not in chk: print(f"{name}: inserted text not found for strip"); sys.exit(5)
        chk = chk.replace(a, '', 1)
    assert chk == base, f"{name}: strip-back != base"
    return out, len(ins), keyline
