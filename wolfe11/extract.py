import sys
from pypdf import PdfReader
for name in ["2007-farrell","1989-jones","2007-hall"]:
    r = PdfReader(name+".pdf")
    out=[]
    for i,p in enumerate(r.pages):
        out.append("\n\n===== PDFPAGE %d =====\n" % (i+1))
        try:
            out.append(p.extract_text() or "")
        except Exception as e:
            out.append("EXTRACT_ERROR %s" % e)
    txt="".join(out)
    open(name+".txt","w").write(txt)
    print(name, "pages:", len(r.pages), "chars:", len(txt))
