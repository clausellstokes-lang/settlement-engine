import base64, json, urllib.request, sys

def varint(n):
    out=b''
    while True:
        b=n&0x7f; n>>=7
        out+=bytes([b|0x80]) if n else bytes([b])
        if not n: return out

def field_str(num, s):
    if isinstance(s,str): s=s.encode()
    return varint((num<<3)|2)+varint(len(s))+s

def field_var(num, v):
    return varint((num<<3)|0)+varint(v)

def b64(b): return base64.b64encode(b).decode()

def build_params(vid, lang='en', asr=True):
    inner = field_str(1, 'asr' if asr else '') + field_str(2, lang) + field_str(3, '')
    outer = field_str(1, vid) + field_str(2, b64(inner).encode()) + field_var(3,1) + field_var(8,1)
    return b64(outer)

vid=sys.argv[1]
params=build_params(vid)
body={"context":{"client":{"clientName":"WEB","clientVersion":"2.20240726.00.00","hl":"en"}},"params":params}
req=urllib.request.Request("https://www.youtube.com/youtubei/v1/get_transcript?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
    data=json.dumps(body).encode(),
    headers={"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","Origin":"https://www.youtube.com","X-Youtube-Client-Name":"1","X-Youtube-Client-Version":"2.20240726.00.00"})
try:
    r=urllib.request.urlopen(req, timeout=45)
    d=r.read().decode()
    open('it_%s.json'%vid,'w').write(d)
    print('OK', len(d))
except Exception as e:
    print('ERR', e)
