import sys, warnings
warnings.filterwarnings("ignore")
from youtube_transcript_api import YouTubeTranscriptApi as Y
vid=sys.argv[1]
try:
    api=Y()
    fl=api.list(vid)
    tr=None
    for t in fl:
        tr=t; break
    print("TRACKS:", [ (t.language_code, t.is_generated) for t in fl ], file=sys.stderr)
    data=tr.fetch()
    segs=[s.text for s in data]
except Exception as e:
    try:
        segs=[s['text'] for s in Y.get_transcript(vid)]
    except Exception as e2:
        print("ERR1",e,"ERR2",e2, file=sys.stderr); sys.exit(1)
print(" ".join(segs).replace("\n"," "))
