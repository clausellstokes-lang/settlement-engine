import sys, pypdf
r=pypdf.PdfReader(sys.argv[1])
for i,p in enumerate(r.pages):
    print(f"\n=== PAGE {i+1} ===")
    print(p.extract_text() or "")
