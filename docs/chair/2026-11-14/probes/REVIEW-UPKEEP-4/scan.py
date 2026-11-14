# usage: python3 -I scan.py <outdir> <out.ndjson>  -- every print of every stage line, by surface
import sys, os, gzip, json, re
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lines import C
D = sys.argv[1]
def one(fn):
    seed = fn[:-7]; rows = []
    try: txt = gzip.open(os.path.join(D, fn), 'rt').read()
    except Exception as e: return [{'seed': seed, 'err': str(e)}]
    parts = re.split(r'^== (.+?) ==$', txt, flags=re.M)
    for k in range(1, len(parts), 2):
        sec, body = parts[k], parts[k+1]
        for i, d, rx in C:
            for m in rx.finditer(body):
                a = body.rfind('\n', 0, m.start()) + 1; b = body.find('\n', m.end()); b = len(body) if b < 0 else b
                rows.append({'seed': seed, 'id': i, 'sec': sec, 'line': body[a:b][:600]})
    return rows
if __name__ == '__main__':
    fs = sorted(f for f in os.listdir(D) if f.endswith('.txt.gz'))
    with Pool(2) as p, open(sys.argv[2], 'w') as o:
        for rows in p.imap_unordered(one, fs, chunksize=8):
            for r in rows: o.write(json.dumps(r) + '\n')
