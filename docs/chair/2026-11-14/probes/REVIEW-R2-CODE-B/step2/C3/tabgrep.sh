# tabgrep.sh <dir> <tab-regex> <line-regex>: print file::tab::line for lines matching in tabs matching
dir=$1; tr=$2; lr=$3
for f in $dir/*.txt; do awk -v F=$(basename $f .txt) -v TR="$tr" -v LR="$lr" '/^== /{t=$0; next} t~TR && $0~LR {print F" :: "t" :: "$0}' $f; done
