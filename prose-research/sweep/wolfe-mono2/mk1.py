# -*- coding: utf-8 -*-
import json, os, re, unicodedata
B='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/wolfe-mono2/'
CB='https://www.cambridge.org/core/books/'
AD=CB+'attending-daedalus/'
SNS=CB+'shadows-of-the-new-sun/'
files={
 AD+'preface/E534225E10471DD899126B4501FD52B3': B+'wright-preface.txt',
 SNS+'abs/shadows-of-the-new-sun/introduction/C861D0D3B8C29D7A4CD8C40CAA72A62E': B+'shadows-intro.txt',
}
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('‘',"'").replace('’',"'").replace('“','"').replace('”','"')
    s=s.replace('–','-').replace('—','-').replace('…','...')
    s=re.sub(r'\s+',' ',s)
    return s.lower()
