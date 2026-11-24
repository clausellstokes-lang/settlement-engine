#!/bin/sh
# VEIL-50 unit (1)(b), the chair's question (18:08): does the tip b58abc48b serve the stored prose at any door? VEIL-41's ppkey
# instrument (ccc2e5473 out/v41/c2/ppkey.sh), UNCHANGED: per read, does the served document carry `publicProse` (server page, link,
# import; twin), and server = twin by canonical sha. On the 140 today-born stored at the tip, then the 140 lit-born at the trial join.
V=/home/user/wt/i41/docs/chair/2026-11-20/veil/out; O=/var/tmp/v50/out; L=/var/tmp/v50/log/q1.log
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
mx sh -c "cd /home/user/wt/tip && sh $V/v41/c2/ppkey.sh /home/user/wt/tip $O/stored-today $O/ppkey-tip v28tpl pk" > $O/ppkey-tip.txt 2>&1; echo "ppkeytip rc=$? $(date -u +%H:%M:%S)" >> $L
mx sh -c "cd /home/user/wt/join && sh $V/v41/c2/ppkey.sh /home/user/wt/join $O/stored-join $O/ppkey-join v28tpl pj" > $O/ppkey-join.txt 2>&1; echo "ppkeyjoin rc=$? $(date -u +%H:%M:%S)" >> $L
