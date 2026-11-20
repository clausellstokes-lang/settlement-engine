#!/bin/sh
# salt-distinct.sh <db>: run salt-volatility.sql and count, per block, the person keys served and the distinct ones.
HERE=$(cd "$(dirname "$0")" && pwd)
psql -U postgres -d "$1" -f "$HERE/salt-volatility.sql" 2>&1 | awk '/^==/{if(b)print b" | keys "n" distinct "d; b=$0; n=0; d=0; delete s; next} /npc_[0-9a-f]{16}/{for(i=1;i<=NF;i++) if($i ~ /^npc_[0-9a-f]{16}$/){n++; if(!($i in s)){s[$i]=1; d++}}} END{print b" | keys "n" distinct "d}'
