#!/bin/sh
# cmp.sh <label> <db A> <db B>: the catalogues of two local chains, line by line; prints the count of lines that differ.
HERE=$(cd "$(dirname "$0")" && pwd); export PGHOST=${PGHOST:-/var/tmp/rv6} PGUSER=postgres
psql -qd $2 -v dir=$HERE/../native -f $HERE/catalog2.sql > ${TMPDIR:-/var/tmp}/rv6cat.$2.txt 2>&1
psql -qd $3 -v dir=$HERE/../native -f $HERE/catalog2.sql > ${TMPDIR:-/var/tmp}/rv6cat.$3.txt 2>&1
n=$(diff ${TMPDIR:-/var/tmp}/rv6cat.$2.txt ${TMPDIR:-/var/tmp}/rv6cat.$3.txt | grep -c '^[<>]')
echo "$1 | $2 ($(wc -l < ${TMPDIR:-/var/tmp}/rv6cat.$2.txt) lines) against $3 ($(wc -l < ${TMPDIR:-/var/tmp}/rv6cat.$3.txt) lines) | lines that differ: $n"
[ "$n" -gt 0 ] && [ -n "${SHOW:-}" ] && diff ${TMPDIR:-/var/tmp}/rv6cat.$2.txt ${TMPDIR:-/var/tmp}/rv6cat.$3.txt | grep '^[<>]' | cut -c1-${SHOW} | head -40
exit 0
