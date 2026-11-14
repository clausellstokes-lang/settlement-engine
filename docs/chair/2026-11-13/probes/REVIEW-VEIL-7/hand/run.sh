#!/bin/sh
# hand/run.sh <db> <town.json> <veil.json> <tag> [outdir]      REVIEW-VEIL-7, LOCAL scratch cluster only.
# Stores one hand-written town three times on a local chain and reads each as a non-owner:
#   <tag>-base    no veil record, Reveal DM off   (the control: what the sanitiser alone passes)
#   <tag>-veil    the veil record, Reveal DM off
#   <tag>-dm      the veil record, Reveal DM on
# Reads, each written to <outdir>/<tag>-<share>-<read>.json: gallery (anon), link (anon), import (signed-in reader).
# A read that raises writes {"ERROR": "..."}; a read with no row writes null.
set -u
DB=$1; TOWN=$2; VEIL=$3; TAG=$4; OUT=${5:-/home/user/wt/out}
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres
mkdir -p $OUT
psql -qd $DB -v ON_ERROR_STOP=1 -v town="$(cat $TOWN)" -v veil="$(cat $VEIL)" -v tag=$TAG >/dev/null <<'SQL'
delete from public.settlements where public_slug like :'tag' || '-%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (:'town'::jsonb)->>'name', 'town', :'town'::jsonb,
  true, :'tag' || '-' || k, now(), :'tag' || 'l-' || k, 'unlisted', ov, dm, true
from (values ('base', '{}'::jsonb, false), ('veil', :'veil'::jsonb, false), ('dm', :'veil'::jsonb, true)) v(k, ov, dm);
SQL
for share in base veil dm; do
  for read in gallery link import; do
    case $read in
      gallery) q="select (select to_jsonb(g.data) from public.get_gallery_dossier('$TAG-$share') g)"; who=anon; uid='';;
      link)    q="select public.get_unlisted_dossier('${TAG}l-$share') -> 'dossier'"; who=anon; uid='';;
      import)  q="select (select to_jsonb(g.data) from public.import_gallery_dossier('$TAG-$share') g)"; who=authenticated; uid=22222222-2222-2222-2222-222222222222;;
    esac
    f=$OUT/$TAG-$share-$read.json
    psql -qAtd $DB -c "select set_config('test.uid', '$uid', false)" -c "set role $who" -c "$q" > $f.tmp 2> $f.err
    if [ -s $f.err ]; then node -e 'console.log(JSON.stringify({ERROR: require("fs").readFileSync(process.argv[1],"utf8").trim().slice(0,300)}))' $f.err > $f; else sed -n '2p' $f.tmp > $f; [ -s $f ] || echo null > $f; fi
    rm -f $f.tmp $f.err
  done
done
echo "read $TAG on $DB into $OUT"
