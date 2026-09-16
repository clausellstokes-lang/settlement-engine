import sys, re
def eff(path):
    src=open(path, encoding='utf-8').read()
    lines=src.split('\n')
    # mark comment spans
    n=len(lines)
    iscomment=[[False]*(len(l)+1) for l in lines]
    i=0; state=0  # 0 code,1 line comment(to eol),2 block,3 string,4 template
    li=0; ci=0
    q=''
    while li<n:
        line=lines[li]
        ci=0
        while ci<len(line):
            c=line[ci]; nxt=line[ci+1] if ci+1<len(line) else ''
            if state==0:
                if c=='/' and nxt=='/':
                    for k in range(ci,len(line)): iscomment[li][k]=True
                    ci=len(line); continue
                if c=='/' and nxt=='*':
                    state=2; iscomment[li][ci]=True; iscomment[li][ci+1]=True; ci+=2; continue
                if c in '"\'':
                    state=3; q=c; ci+=1; continue
                if c=='`':
                    state=4; ci+=1; continue
                ci+=1
            elif state==2:
                iscomment[li][ci]=True
                if c=='*' and nxt=='/':
                    iscomment[li][ci+1]=True; state=0; ci+=2; continue
                ci+=1
            elif state==3:
                if c=='\\': ci+=2; continue
                if c==q: state=0
                ci+=1
            elif state==4:
                if c=='\\': ci+=2; continue
                if c=='`': state=0
                ci+=1
        if state==3: state=0  # unterminated string on line
        li+=1
    count=0
    for li,line in enumerate(lines):
        stripped=''.join(ch for k,ch in enumerate(line) if not iscomment[li][k])
        if stripped.strip()=='' : continue
        count+=1
    return count
for p in sys.argv[1:]:
    try: print(f"{eff(p):5d}  {p}")
    except Exception as e: print(f"ERR {p} {e}")
