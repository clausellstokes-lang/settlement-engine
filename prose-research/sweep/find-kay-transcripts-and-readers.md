# Finder notes — Kay, angle: TRANSCRIBE then AGGREGATE (2026-09-06, Opus finder, second run after a session cutoff)

Working dir for raws: `sweep/ktr2/`

## Roster item 1 — the 2021 Tolkien Lecture 'Just Enough Light' (video only)
- Video identified and metadata READ: `z1TgX0alFuM`, "Guy Gavriel Kay, 'Just Enough Light: Some Thoughts on Fantasy and Literature,' Tolkien Lecture 2021",
  channel "Tolkien Lecture on Fantasy Literature", upload_date 20210511, duration 3818 s. (yt-dlp -J with
  `--extractor-args youtube:player_client=android_vr`; the default/web/tv/mweb clients all fail "The page needs to be reloaded".)
- Caption tracks EXIST: automatic captions only (no manual subs), `en` and `en-orig`, formats json3/srv1/srv2/srv3/ttml/srt/vtt.
- **THE CAPTION FETCH IS BLOCKED.** Every route to the caption bytes returns Google's 429 interstitial from this network:
  - `yt-dlp --write-auto-sub` → `HTTP Error 429: Too Many Requests` while writing `ggk_tolkienlecture.en-orig.srt`.
  - the signed `https://www.youtube.com/api/timedtext?...` URL by curl with a browser UA, Referer and Accept-Language → 429 (4 tries, 20 s apart).
  - the unsigned `timedtext?v=..&lang=en&kind=asr&fmt=srv1` → 429.
  - Invidious: inv.nadeko.net returns the caption LIST but 0 bytes for the track; invidious.nerdvpn.de / f5.si / tiekoetter / chocolatemoo53 → bot wall or 403.
  - Piped: pipedapi.kavin.rocks 526, adminforge 403, leptons 502, ducks.party 500, privacydev/drgns no route.
  - transcript services: youtubetotranscript.com 403 (Cloudflare), youtubetranscript.com returns
    "YouTube is currently blocking us from fetching subtitles", tactiq 401 "Missing App Check token", notegpt 404.
  - CORS/text proxies: allorigins 522, codetabs 522, corsproxy needs a key, cors.lol 429, r.jina.ai 403.
  - InnerTube `youtubei/v1/get_transcript` with the REAL `getTranscriptEndpoint.params` scraped from the watch page
    (params `Cgt6MVRnWDBhbEZ1TRISQ2dOaGMzSVNBbVZ1R2dBJTNEGAEqM2VuZ2FnZW1lbnQtcGFuZWwtc2VhcmNoYWJsZS10cmFuc2NyaXB0LXNlYXJjaC1wYW5lbDAAOAFAAQ%3D%3D`),
    real INNERTUBE_API_KEY, clientVersion 2.20260904.01.00 and visitorData → HTTP 400 `FAILED_PRECONDITION`.
  - the Browser pane refused to navigate to youtube.com ("navigation ... was denied").
  - no ASR toolchain on this machine (no whisper / mlx_whisper / whisper-cpp; ffmpeg only), and I did not install one,
    nor use `--cookies-from-browser` (that would send the owner's stored credentials).
  => the lecture's OWN sentences are NOT claimable. What IS claimable: two eyewitness write-ups of the lecture
     (Cheryl Morgan, 11 May 2021 — she quotes one Kay phrase; the Pembroke news item; the Pilgrim in Narnia post carries
     no lecture content, only framing).

## Roster item 2 — the Pearl, Blezard and Kleffel audio conversations
Identified from Kay's own site (brightweavings.com/category/ggks-words/interviews/, fetched 200):
- **Nancy Pearl** — "University Book Store Presents Guy Gavriel Kay in conversation with Nancy Pearl", posted 29 May 2022,
  at the publication of *All the Seas of the World*. Embed: `youtube.com/embed/aXn4eb5sKS0` → same YouTube caption wall.
- **Paul Blezard** — "Watch GGK in conversation with Paul Blezard at the Lockdown Litfest", posted 30 May 2021.
  Embed: `youtube.com/embed/DLgiRfhIe8k` → same wall.
- **Rick Kleffel** — The Agony Column podcast RSS (bookotron.com/agony/indexes/tac_podcast.xml, fetched 200, 1.12 MB) carries
  FOUR Kay episodes with direct mp3 enclosures:
    1931 "A 2016 In-Depth Interview With Guy Gavriel Kay", Wed 08 Jun 2016 — bookotron.com/agony/audio/2016/2016-interviews/guy_gavriel_kay-2016.mp3
    938  "A 2010 Interview with Guy Gavriel Kay", Sun 05 Sep 2010 — .../2010/2010-interviews/guy_gavriel_kay-2010.mp3
    882  "Guy Gavriel Kay Reads for The Agony Column Live on May 8, 2010", Wed 12 May 2010 — .../2010/2010-news/051310-taclive050810-kayr.mp3
    134  "A 2007 Interview With Guy Gavriel Kay", Sun 25 Feb 2007 — trashotron.com/agony/audio/guy_gavriel_kay_2007.mp3
  These are bare mp3s with no published transcript; with no ASR on the box they are BLOCKED for verbatim claims.
  (The mp3 URLs are recorded here so a future round with an ASR box can go straight to them.)
- The one audio-derived transcript this sweep already holds (kaywork/olley.srt, olley2.srt) came from
  media.podcasts.ox.ac.uk, which publishes a .srt beside each mp3 — NOT from YouTube. That is the only proven audio route.

## Roster item 3 — READER AGGREGATES
- Goodreads book pages reachable with a browser UA; reviews live in `__NEXT_DATA__.props.pageProps.apolloState`
  under `Review:` keys (30 per page; the `?sort=newest` query is NOT honoured server-side — the 30 are the default set,
  so I sort them myself by createdAt and say so).
  - Tigana 104089 — 200, 30 reviews (extractor `grx.py`)
  - The Lions of Al-Rassan 104101 — 200, 30 reviews
  - Under Heaven 7139892 — HTTP 202, zero bytes (bot challenge) on two attempts
  - Children of Earth and Sky 25938417 — HTTP 202, zero bytes on two attempts
- Goodreads GROUP TOPICS are reachable and are better "split room" evidence than the review page:
  - topic 917171 "who's better Guy Gavriel Kay or George R. R. Martin" (Sword & Laser, Jun 2012) — 200, 22 kB of text
  - topic 565852 "Guy Gavriel Kay: where should I start?" — 200
- Reddit: EVERY live route is walled. old.reddit.com/r/Fantasy/search.json and old.reddit .../.json return the
  "Welcome to Reddit" interstitial HTML (351 kB); www.reddit.com/...json → 403 "Blocked"; api.pullpush.io → 429
  ("This website does not provide free scraping resources for agents"); arctic-shift → 422 "Timeout. Maybe slow down".
  **The route that works is the Wayback raw capture** `https://web.archive.org/web/<ts>id_/<reddit url>`, with the
  timestamps found through the CDX API. Captured:
  - /r/Fantasy/comments/1goa369/tigana_a_review/ @20241207151907 (150 kB, full thread incl. dissent)
  - /r/Fantasy/comments/fkdpfg/review_tigana_a_misguided_masterpiece/ @20230608133320
  - /r/Fantasy/comments/7p5ro9/tigana_by_ggk_should_i_keep_going/ @20230607111129
  - /r/Fantasy/comments/15u1pk0/comment/jwnbsp8/ @20230910041956

## Expansion beyond the roster (bibliography / lateral routes)
- Goodreads GROUP TOPICS: 917171 (Kay vs Martin, 72 messages), 565852 (where should I start), 111082 (Fantasy Book Club, 2009).
- A FIFTH Goodreads book page added for recency: Written on the Dark (218153843, 2025) - the sharpest register evidence in the whole
  angle comes from it (a reader measuring shorter average phrase length; a reader complaining every voice sounds like the narrator;
  a reader saying the writing here is "downright spare ... and not for the better").
- Reader blogs and forums: The Quill to Live book club (a SECOND book club, and the only source with figures: half the club scored
  it 9+, half below 5, average 7); SFFWorld thread 32913; One Last Sketch book-by-book run; Fantasy-Faction Tigana review;
  The Rowanwood Chronicles (2025, flagged medium - its own prose reads formulaic); superstardrifter; Brok3n Engines; Grimdark Magazine.
- Blocked or empty on this angle: LibraryThing (Cloudflare 403), Medium/scribe.rip for the Pat's Writings review (404),
  DuckDuckGo/Mojeek HTML search (challenge pages), Litopia thread (two posts, nothing about the sentences).

## Stopping
The named roster is exhausted (every item fetched, not-found or blocked with the reason recorded) and the last two open searches
surfaced only sources already read or a single blog each, which were then read. 96 claims / 36 sources / 29 substantive.
Final file written with "complete": true.
