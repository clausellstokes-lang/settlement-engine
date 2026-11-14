#!/bin/sh
# census.sh <files...>: print file<TAB>match<TAB>line for catalogue count ranges and gates
RX='\((\d[\d,]*\s*[-–]\s*\d[\d,]*\+?(\s*households)?|\d[\d,]*\+\s*(only|households)?|high magic|low magic|if walled|multiple)\)'
grep -oHP ".{0,90}$RX.{0,40}" "$@"
