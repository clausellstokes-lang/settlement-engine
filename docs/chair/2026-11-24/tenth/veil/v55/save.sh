#!/bin/sh
# VEIL-55: the running logs saved to the documents branch and pushed (the chair's word of 22:48: partial results in a pushed file).
# Loop: sh save.sh loop (every 30 minutes, detached); once: sh save.sh. Copies the step logs and tables only (no data), commits by
# explicit path, pushes the branch by its own name only when origin lacks the local tip.
D=/home/user/wt/docs; S=docs/chair/2026-11-24/tenth/veil/v55; O=$D/$S/out
once() {
  mkdir -p $O; cd $D || return 1
  for f in /var/tmp/v55/m0.log /var/tmp/v55/p1.log /var/tmp/v55/out/seated/exits.txt; do [ -f $f ] && cp $f $O/$(basename $(dirname $f))-$(basename $f); done
  for f in /var/tmp/v55/out/u2/*.log /var/tmp/v55/out/p1/*/table.txt /var/tmp/v55/out/p1/*/window.txt /var/tmp/v55/out/p1/run4.txt /var/tmp/v55/out/p1/gates/*.txt; do
    [ -f "$f" ] && tail -c 20000 "$f" > "$O/$(echo "${f#/var/tmp/v55/out/}" | tr '/' '_')"; done
  for f in /var/tmp/v55/out/p1/security.txt /var/tmp/v55/out/p1/named.txt; do [ -f $f ] && tail -60 $f > $O/$(basename $f); done
  git add $S/out && git diff --cached --quiet && return 0
  git commit -q -m "docs(veil, VEIL-55): running logs saved $(date -u +%H:%M) UTC (save.sh)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1SoJ6KH9Wyp2Fera7R" -- $S/out
  [ "$(git ls-remote origin refs/heads/lane/veil-55-2026-11-24 | cut -f1)" = "$(git rev-parse HEAD)" ] || timeout 900 git push -q origin lane/veil-55-2026-11-24 >> /var/tmp/v55/save-push.log 2>&1
  echo "save $(git rev-parse --short HEAD) push-rc=$? $(date -u +%FT%TZ)" >> /var/tmp/v55/save.log
}
if [ "$1" = loop ]; then while :; do once; sleep 1800; done; else once; fi
