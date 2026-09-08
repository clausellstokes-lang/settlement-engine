#!/usr/bin/env python3
"""cut_html.py <out.txt> <minWords> <html...>  — <p> extraction inside an article/entry container.
Prints every drop count. Derived from the (lost) primary/cut_html.py contract in PROVENANCE.md."""
import sys, re, html, os, json

def strip_tags(s):
    s = re.sub(r'(?is)<(script|style|figure|figcaption|aside|noscript)\b.*?</\1>', ' ', s)
    s = re.sub(r'(?is)<br\s*/?>', ' ', s)
    s = re.sub(r'(?s)<[^>]+>', '', s)
    s = html.unescape(s)
    s = s.replace(' ', ' ')
    return re.sub(r'[ \t]+', ' ', s).strip()

BOILER = re.compile(r'(?i)^(share|tweet|advertisement|subscribe|sign up|read more|related|previous article|next article|'
                    r'copyright|all rights reserved|photo(graph)? by|image:|via |source:|follow us|newsletter|'
                    r'excerpted from|reprinted (with|by) permission|from the book|used by permission|'
                    r'is the author of|was born in|lives in [A-Z]|__+|\[.*\]$)')

def main():
    out, minw = sys.argv[1], int(sys.argv[2])
    files = sys.argv[3:]
    keep, drops = [], {}
    def drop(k): drops[k] = drops.get(k, 0) + 1
    for f in files:
        raw = open(f, encoding='utf-8', errors='replace').read()
        # narrow to an article/entry body when one is identifiable
        m = re.search(r'(?is)<div[^>]+class="[^"]*(post_content|entry-content|article-content|post-content|c-content)[^"]*".*?(?=<footer|<div[^>]+class="[^"]*(related|comments|sidebar))', raw)
        body = m.group(0) if m else (re.search(r'(?is)<article\b.*?</article>', raw).group(0) if re.search(r'(?is)<article\b.*?</article>', raw) else raw)
        ps = re.findall(r'(?is)<p\b[^>]*>(.*?)</p>', body)
        for p in ps:
            t = strip_tags(p)
            if not t: drop('empty'); continue
            if BOILER.match(t): drop('boilerplate'); continue
            w = len(t.split())
            if w < minw: drop('short'); continue
            if not re.search(r'[.?!]["\'”’)]?$', t): drop('nofullstop'); continue
            keep.append(t)
    text = '\n\n'.join(keep)
    open(out, 'w', encoding='utf-8').write(text + '\n')
    words = len(text.split())
    print(f"{os.path.basename(out)}\t{len(files)} srcs\t{len(keep)} paras\t{words} w\tdropped {json.dumps(drops, sort_keys=True)}")

main()
