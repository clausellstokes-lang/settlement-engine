import sys, pypdf
src, dst = sys.argv[1], sys.argv[2]
r = pypdf.PdfReader(src)
out=[]
for i,p in enumerate(r.pages):
    try: t=p.extract_text() or ""
    except Exception as e: t="[[ERR %s]]"%e
    out.append("\n===== PAGE %d =====\n"%(i+1)+t)
open(dst,"w").write("".join(out))
print(dst, len(r.pages), sum(len(o) for o in out))
