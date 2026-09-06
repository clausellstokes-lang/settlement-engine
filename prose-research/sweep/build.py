import json, os, sys

FILES = {
 "https://arxiv.org/pdf/2310.06452": "kirk_pdf.txt",
 "https://arxiv.org/pdf/2510.01171": "vs_pdf.txt",
 "https://arxiv.org/pdf/2501.18101": "dpo_pdf.txt",
 "https://arxiv.org/pdf/2310.13548": "syco_pdf.txt",
 "https://www.pure.ed.ac.uk/ws/portalfiles/portal/460496122/ShumailovEtalNature2024AIModelsCollapseWhen.pdf": "collapse_pdf.txt",
 "https://arxiv.org/pdf/2505.00047": "a2505.00047.txt",
 "https://arxiv.org/pdf/2309.05196": "a2309.05196.txt",
 "https://arxiv.org/pdf/2410.04265": "a2410.04265.txt",
 "https://arxiv.org/pdf/2505.18949": "a2505.18949.txt",
 "https://arxiv.org/pdf/2404.01413": "a2404.01413.txt",
 "https://arxiv.org/pdf/2410.12954": "note_collapse_pdf.txt",
 "https://arxiv.org/pdf/2411.04427": "a2411.04427.txt",
 "https://arxiv.org/pdf/2504.12522": "a2504.12522.txt",
 "https://arxiv.org/pdf/2503.17126": "a2503.17126.txt",
 "https://arxiv.org/pdf/2405.16455": "a2405.16455.txt",
 "https://arxiv.org/pdf/2403.00553": "a2403.00553.txt",
 "https://www.lesswrong.com/posts/t9svvNPNmFf5Qa3TA/mysteries-of-mode-collapse": "janus_wb.txt",
 "https://aclanthology.org/2024.wikinlp-1.12.pdf": "wikinlp.txt",
 "https://arxiv.org/pdf/2405.00492": "a2405.00492.txt",
 "https://openreview.net/pdf?id=3pDMYjpOxk": "omahony.txt",
}

def build(sources, claims, coverage, complete):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get("quote","")
        if not q: continue
        f=FILES.get(c["url"])
        if not f or not os.path.exists(f):
            bad.append((i,"NOFILE",c["url"])); continue
        if q not in open(f,encoding="utf-8",errors="replace").read():
            bad.append((i,"QUOTE-MISS",q))
        if len(q.split())>12:
            bad.append((i,"TOO-LONG",q))
    if bad:
        for b in bad: print("PROBLEM", b)
        sys.exit(1)
    out={"complete":complete,"coverage":coverage,"sourcesRead":sources,"claims":claims}
    json.dump(out, open("found-ai-steerability-mechanism.json","w"), indent=1, ensure_ascii=False)
    print("OK claims=",len(claims)," sources=",len(sources))
