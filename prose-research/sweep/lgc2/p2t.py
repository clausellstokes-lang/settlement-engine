import sys
from pypdf import PdfReader
r=PdfReader(sys.argv[1])
out=[]
for p in r.pages:
    try: out.append(p.extract_text() or '')
    except Exception as e: out.append('')
open(sys.argv[2],'w').write('\n'.join(out))
print(sys.argv[2], len('\n'.join(out)), 'pages', len(r.pages))
