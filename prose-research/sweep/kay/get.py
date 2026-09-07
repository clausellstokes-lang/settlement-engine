import sys, subprocess, re, html, os, gzip, io
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
def fetch(url):
    p=subprocess.run(["curl","-sL","--compressed","-A",UA,"--max-time","90",url],capture_output=True)
    return p.stdout
def totext(b):
    s=b.decode("utf-8","replace")
    s=re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>"," ",s)
    s=re.sub(r"(?is)<br\s*/?>","\n",s)
    s=re.sub(r"(?is)</(p|div|li|h[1-6]|tr|blockquote)>","\n",s)
    s=re.sub(r"(?s)<[^>]+>"," ",s)
    s=html.unescape(s)
    s=re.sub(r"[ \t\xa0]+"," ",s)
    s=re.sub(r"\n\s*\n+","\n\n",s)
    return s.strip()
if __name__=="__main__":
    url=sys.argv[1]; out=sys.argv[2]
    b=fetch(url)
    if b[:4]==b"%PDF":
        open(out+".pdf","wb").write(b)
        from pdfminer.high_level import extract_text
        t=extract_text(out+".pdf")
    else:
        t=totext(b)
    open(out,"w").write(t)
    print(url,"->",out,len(t),"chars")
