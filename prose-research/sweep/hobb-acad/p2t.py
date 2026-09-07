import sys
from pypdf import PdfReader
for p in sys.argv[1:]:
    try:
        r=PdfReader(p); t='\n'.join((pg.extract_text() or '') for pg in r.pages)
        o=p[:-4]+'.txt'; open(o,'w').write(t); print(o, len(r.pages),'pages',len(t),'chars')
    except Exception as e: print(p,'ERR',e)
