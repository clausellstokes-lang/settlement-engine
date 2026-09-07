import sys, time, subprocess, os
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url, out, tries=4, delay=5.0):
    for i in range(tries):
        r = subprocess.run(['curl','-sSL','-m','70','-A',UA,'-o',out,'-w','%{http_code} %{size_download}',url],
                           capture_output=True, text=True)
        parts = r.stdout.strip().split()
        if len(parts)==2 and parts[0]=='200' and int(parts[1])>500:
            return 'OK '+r.stdout.strip()
        time.sleep(delay*(i+1))
    return 'FAIL '+r.stdout.strip()
if __name__=='__main__':
    nums=sys.argv[1].split(',')
    for n in nums:
        out=f'u{n}.html'
        if os.path.exists(out) and os.path.getsize(out)>500:
            print(n,'cached'); continue
        u=f'https://web.archive.org/web/2021id_/http://lists.urth.net/pipermail/urth-urth.net/2006-October/{n}.html'
        print(n, get(u,out), flush=True)
        time.sleep(2.5)
