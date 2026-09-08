#!/bin/sh
# $1 = video id, $2 = out base
for i in 1 2 3 4 5 6 7 8; do
  for CL in android ios tv_simply web_embedded; do
    python3 -m yt_dlp --extractor-args "youtube:player_client=$CL" --write-auto-sub --write-sub --sub-lang "en,en-orig,en-US" --convert-subs srt --skip-download -o "$2.%(ext)s" "https://www.youtube.com/watch?v=$1" >> "$2.log" 2>&1
    if ls "$2".*.srt >/dev/null 2>&1; then echo "OK $CL attempt $i"; exit 0; fi
  done
  sleep 20
done
echo "FAILED"
