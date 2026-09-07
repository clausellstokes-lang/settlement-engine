#!/usr/bin/env python3
"""Build the three Le Guin corpora under primary/raw/. Derived selection rules are printed."""
import subprocess, sys, os, re, json
S = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/s6b-scratch"
RAW = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary/raw"

def paras(html_name, minw=3):
    tmp = os.path.join(S, "_tmp_cut.txt")
    r = subprocess.run([sys.executable, os.path.join(S, "cut_html.py"), tmp, str(minw),
                        os.path.join(RAW, html_name)], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    return [p for p in open(tmp, encoding="utf-8").read().split("\n\n") if p.strip()]

def w(ps): return sum(len(p.split()) for p in ps)

report = []
# ---------- WRITTEN NONFICTION ----------
written = []
def take(name, keep_idx, why):
    ps = paras(name)
    kept = [ps[i] for i in keep_idx]
    dropped = [i for i in range(len(ps)) if i not in keep_idx]
    report.append((name, len(ps), w(ps), len(kept), w(kept), why, dropped))
    written.extend(kept)

take("leguin-lithub-a-writing-lesson.html",
     [1,2,3,4,5,6,8,10,14,17,18,19,20,21,22,23,24,25,26,27,28,29],
     "Steering the Craft ch.1; dropped LitHub frame(0), 7 specimen blocks by Kipling/Twain/Hurston/Gloss (7,9,11,12,13,15,16), bio(30), affiliate(31)")
take("leguin-lithub-how-to-become-a-writer.html",
     list(range(1,15)) + list(range(16,21)),
     "her essay; dropped LitHub newsletter line(0), Tolstoy quotation(15), bio(21), affiliate(22)")
take("leguin-lithub-great-american-novel.html",
     [2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18],
     "No Time to Spare essay; dropped LitHub frame(0), Hamid quotation(1), pull-quote duplicate(12), credit(19), bio(20), affiliate(21)")
take("leguin-el-utopia.html", list(range(0,19)),
     "her essay; dropped EL newsletter promos(19,20)")
take("leguin-el-amazon.html", [1,2,3,4,5],
     "her open letter; dropped EL editor bio(0,10), EL commentary(6), link line(7), promos(8,9)")

# ---------- SPOKEN NONFICTION (interview answers only) ----------
spoken = []
def take_answers(name, prefixes, drop_idx, why):
    ps = paras(name)
    kept, dropped = [], []
    for i, p in enumerate(ps):
        if i in drop_idx: dropped.append(i); continue
        hit = next((q for q in prefixes if p.startswith(q)), None)
        if hit:
            kept.append(p[len(hit):].strip())
        elif i in EXTRA.get(name, ()):        # unlabelled continuation of her answer
            kept.append(p)
        else:
            dropped.append(i)
    report.append((name, len(ps), w(ps), len(kept), w(kept), why, dropped))
    spoken.extend(kept)

EXTRA = {"leguin-lithub-dictators-poets.html": (25, 41, 46, 50, 51)}
take_answers("leguin-lithub-racism-anarchy.html", ("UG:", "Ursula Le Guin:"), {0,1,63,94,95},
             "Structo interview; kept only paragraphs prefixed 'UG:' / 'Ursula Le Guin:'; dropped LitHub frame(0), interviewer intro(1), stage-direction para(63), interviewer bio(94), affiliate(95) and every 'EM:' question")
take_answers("leguin-lithub-dictators-poets.html", ("UKL:", "Ursula K. Le Guin:"), {0,1,2,3,4,5,8,13,34,52,66,67,68},
             "Tin House Conversations on Writing; kept 'UKL:' / 'Ursula K. Le Guin:' paragraphs + her 5 unlabelled continuations (25,41,46,50,51); dropped Naimon's intro(0-5), an Earthsea epigraph poem(4), 3 pull-quote duplicates(8,34,52), an unlabelled DN continuation(13), credit(66), bio(67), affiliate(68) and every 'DN:' question")

# ---------- FICTION ----------
pagetxt = open(os.path.join(RAW, "leguin-omelas-ucdavis.pagetxt"), encoding="utf-8").read()
lines = [l.rstrip() for l in pagetxt.split("\n")]
fic, fdrop = [], {"pagemarker": 0, "title": 0, "empty": 0}
skip_head = {"The Ones Who Walk Away From Omelas", "From The Wind's Twelve Quarters: Short Stories",
             "by Ursula Le Guin"}
buf = []
for l in lines:
    s = l.strip()
    if re.fullmatch(r"<<<PAGE \d+>>>", s): fdrop["pagemarker"] += 1; continue
    if s in skip_head: fdrop["title"] += 1; continue
    if not s:
        fdrop["empty"] += 1
        if buf: fic.append(" ".join(buf)); buf = []
        continue
    buf.append(s)
if buf: fic.append(" ".join(buf))
fic = [re.sub(r"\s+", " ", p).strip() for p in fic]
fic = [p for p in fic if len(p.split()) >= 3]
report.append(("leguin-omelas-ucdavis.pagetxt", len(lines), len(pagetxt.split()), len(fic), w(fic),
               "Omelas full text; dropped page markers, the 3 title/credit lines", fdrop))

def write(name, ps):
    p = os.path.join(RAW, name)
    open(p, "w", encoding="utf-8").write("\n\n".join(ps) + "\n")
    print(f"{name}\t{len(ps)} paras\t{w(ps)} w")
    return p

print("=== per-source ===")
for r in report:
    print(f"{r[0]}\tparas {r[1]}->{r[3]}\twords {r[2]}->{r[4]}\n   why: {r[5]}\n   dropped idx: {r[6]}")
# transcriber's editorial brackets are the interviewer/editor's words, not hers
BR = re.compile(r"\s*\[[^\]]{0,60}\]")
n_before = sum(len(BR.findall(x)) for x in spoken)
spoken = [re.sub(r"\s{2,}", " ", BR.sub("", x)).strip() for x in spoken]
print(f"spoken: stripped {n_before} editorial bracket spans")
print("=== corpora ===")
write("leguin_nonfiction_written.txt", written)
write("leguin_nonfiction_spoken.txt", spoken)
write("leguin_nonfiction.txt", written + spoken)
write("leguin_fiction.txt", fic)
