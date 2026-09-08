#!/bin/sh
cd "$(dirname "$0")"
for B in "104101.The_Lions_of_Al_Rassan|lions" "7139892-under-heaven|uh" "25938417-children-of-earth-and-sky|coes" "41458663-a-brightness-long-ago|bla" "58863528-all-the-seas-of-the-world|atsw"; do
  ID=${B%%|*}; N=${B##*|}
  python3 grx.py "https://www.goodreads.com/book/show/${ID}?sort=newest" "gr-$N-new"
  sleep 12
done
echo GRDONE
