import sys, time, subprocess, os
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url, out, tries=5, delay=6.0):
    code=''
    for i in range(tries):
        r = subprocess.run(['curl','-sSL','-m','60','-A',UA,'-o',out,'-w','%{http_code} %{size_download}',url],
                           capture_output=True, text=True)
        code = r.stdout.strip()
        parts = code.split()
        if len(parts)==2 and parts[0]=='200' and int(parts[1])>0:
            return code
        time.sleep(delay*(i+1))
    return code
