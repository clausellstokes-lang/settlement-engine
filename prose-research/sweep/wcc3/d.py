import sys,re,html,glob
for f in sorted(sys.argv[1:]):
    t=open(f,encoding='utf-8',errors='replace').read()
    ti=re.search(r'<H1>(.*?)</H1>',t,re.S); au=re.search(r'<B>(.*?)</B>',t,re.S)
    dt=re.search(r'<I>(.*?)</I>',t,re.S)
    body=re.search(r'<PRE>(.*?)</PRE>',t,re.S)
    print('\n\n========== '+f+' ==========')
    print('SUBJ:',html.unescape(re.sub(r'<.*?>','',ti.group(1))).strip() if ti else '?')
    print('FROM:',html.unescape(re.sub(r'<.*?>','',au.group(1))).strip() if au else '?', '|', html.unescape(re.sub(r'<.*?>','',dt.group(1))).strip() if dt else '?')
    if body: print(html.unescape(re.sub(r'<.*?>','',body.group(1))))
