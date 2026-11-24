#!/bin/sh
# VEIL-55: m0.sh, then p1.sh, detached (nohup setsid), so a session's background limit cannot kill them. Exits to their logs.
S=/home/user/wt/docs/docs/chair/2026-11-24/tenth/veil/v55
while ! grep -q '^m0 END' /var/tmp/v55/m0.log 2>/dev/null; do sleep 30; done
sh $S/p1.sh; echo "chain p1 exit=$? $(date -u +%FT%TZ)" >> /var/tmp/v55/p1.log
